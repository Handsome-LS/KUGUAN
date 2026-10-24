import { ValidationError, positiveInteger, requiredText, optionalText } from './validation.js';

export function applyDemoMutation(snapshot, path, input) {
  const data = structuredClone(snapshot);
  const id = crypto.randomUUID();
  const time = new Date().toISOString();
  const exists = (table, entryId, label) => {
    const entry = data[table].find((candidate) => candidate.id === entryId);
    if (!entry) throw new ValidationError(`${label}不存在，请刷新后重试`);
    return entry;
  };

  if (path === '/api/items') {
    const name = requiredText(input.name, '物品名称', 80);
    const sku = requiredText(input.sku, '物品编号', 40).toUpperCase();
    if (!/^[A-Z0-9_-]+$/.test(sku)) throw new ValidationError('物品编号仅支持字母、数字、短横线和下划线');
    if (data.items.some((item) => item.sku === sku)) throw new ValidationError('物品编号已存在');
    const category = requiredText(input.category, '物品分类', 40);
    const unit = requiredText(input.unit, '计量单位', 10);
    const threshold = input.threshold ?? 10;
    if (!Number.isSafeInteger(threshold) || threshold < 0 || threshold > 1000000000) throw new ValidationError('预警数量必须是非负整数');
    data.items.unshift({ id, name, sku, category, unit, threshold, icon: 'box', color: 'purple', created_at: time });
  } else if (path === '/api/warehouses') {
    const name = requiredText(input.name, '仓库名称', 60);
    const code = requiredText(input.code, '仓库编号', 20).toUpperCase();
    if (!/^[A-Z0-9_-]+$/.test(code)) throw new ValidationError('仓库编号仅支持字母、数字、短横线和下划线');
    exists('admins', input.managerId, '管理员');
    if (data.warehouses.some((warehouse) => warehouse.name === name || warehouse.code === code)) throw new ValidationError('仓库名称或编号已存在');
    data.warehouses.push({ id, name, code, address: optionalText(input.address, 200), manager_id: input.managerId });
  } else if (path === '/api/admins') {
    data.admins.push({ id, name: requiredText(input.name, '管理员姓名', 30), role: requiredText(input.role, '职务', 40), phone: optionalText(input.phone, 40), color: ['purple', 'blue', 'orange', 'green'][data.admins.length % 4] });
  } else if (path === '/api/operations') {
    const { kind, itemId, warehouseId, targetId, adminId } = input;
    if (!['in', 'consume', 'transfer'].includes(kind)) throw new ValidationError('请选择有效的操作类型');
    const quantity = positiveInteger(input.quantity, '数量');
    const note = kind === 'consume' ? requiredText(input.note, '消耗备注', 1000) : optionalText(input.note);
    const origin = kind === 'in' ? requiredText(input.origin, '生产地 / 来源', 200) : '';
    const item = exists('items', itemId, '物品');
    const warehouse = exists('warehouses', warehouseId, '仓库');
    const admin = exists('admins', adminId, '操作人');
    let target;
    if (kind === 'transfer') {
      target = exists('warehouses', targetId, '目标仓库');
      if (warehouseId === targetId) throw new ValidationError('来源仓库和目标仓库不能相同');
    }
    const changeStock = (stockWarehouseId, delta) => {
      let stock = data.stocks.find((entry) => entry.item_id === itemId && entry.warehouse_id === stockWarehouseId);
      const current = stock?.quantity ?? 0;
      const next = current + delta;
      if (next < 0) throw new ValidationError(`库存不足，当前可用数量为 ${current}`);
      if (!Number.isSafeInteger(next) || next > 1000000000) throw new ValidationError('库存数量超出上限');
      if (!stock) {
        stock = { item_id: itemId, warehouse_id: stockWarehouseId };
        data.stocks.push(stock);
      }
      Object.assign(stock, { quantity: next, updated_at: time });
    };
    changeStock(warehouseId, kind === 'in' ? quantity : -quantity);
    if (kind === 'transfer') changeStock(targetId, quantity);
    const reference = `KG${time.slice(0, 10).replaceAll('-', '')}${id.slice(0, 8).toUpperCase()}`;
    data.operations.unshift({ id, reference, kind, item_id: itemId, warehouse_id: warehouseId, target_id: target?.id ?? null, quantity, origin, note, admin_id: adminId, created_at: time, item_name: item.name, sku: item.sku, unit: item.unit, admin_name: admin.name, warehouse_name: warehouse.name, target_name: target?.name ?? null });
    return { data, result: { id, reference } };
  } else {
    throw new ValidationError('接口不存在');
  }
  return { data, result: { id } };
}

function access(database, mode, callback) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('state', mode);
    const store = transaction.objectStore('state');
    let result;
    let failure;
    transaction.oncomplete = () => resolve(result);
    transaction.onerror = () => {};
    transaction.onabort = () => reject(failure || new Error('浏览器数据保存失败，请检查网站存储权限或可用空间。'));
    const request = store.get('current');
    request.onsuccess = () => {
      try { result = callback(request.result, store); }
      catch (error) { failure = error; transaction.abort(); }
    };
  });
}

export function createDemoStore() {
  let ready;
  const connect = async () => {
    if (!globalThis.indexedDB) throw new Error('当前浏览器不支持网站数据保存，请使用新版 Chrome、Edge、Firefox 或 Safari。');
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open(`kuguan-demo-v1:${new URL('.', import.meta.url).pathname}`, 1);
      request.onupgradeneeded = () => request.result.createObjectStore('state');
      request.onerror = () => reject(new Error('无法打开浏览器数据库，请允许本站保存网站数据。'));
      request.onblocked = () => reject(new Error('请关闭其他库管演示页面后重试。'));
      request.onsuccess = () => {
        request.result.onversionchange = () => request.result.close();
        resolve(request.result);
      };
    });
    try {
      if (!await access(database, 'readonly', (data) => Boolean(data))) {
        const response = await fetch(new URL('./demo-seed.json', import.meta.url));
        if (!response.ok) throw new Error('无法读取演示数据，请刷新页面重试。');
        const seed = await response.json();
        await access(database, 'readwrite', (data, store) => {
          if (!data) store.put(seed, 'current');
        });
      }
      return database;
    } catch (error) {
      database.close();
      throw error;
    }
  };
  return {
    async request(path, payload) {
      ready ??= connect();
      const database = await ready;
      if (path === '/api/state' && payload === undefined) return access(database, 'readonly', (data) => data);
      return access(database, 'readwrite', (data, store) => {
        const { data: next, result } = applyDemoMutation(data, path, payload);
        store.put(next, 'current');
        return result;
      });
    }
  };
}

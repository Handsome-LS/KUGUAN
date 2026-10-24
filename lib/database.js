import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { ValidationError, positiveInteger, requiredText, optionalText } from '../public/validation.js';

export { ValidationError };

export function createDatabase(filename, { seed = true } = {}) {
  if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true });
  const database = new DatabaseSync(filename);
  database.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '', color TEXT NOT NULL DEFAULT 'purple'
    );
    CREATE TABLE IF NOT EXISTS warehouses (
      id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, code TEXT NOT NULL UNIQUE,
      address TEXT NOT NULL DEFAULT '', manager_id TEXT NOT NULL REFERENCES admins(id)
    );
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY, sku TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
      category TEXT NOT NULL, unit TEXT NOT NULL, threshold INTEGER NOT NULL DEFAULT 10 CHECK (threshold >= 0),
      icon TEXT NOT NULL DEFAULT 'box', color TEXT NOT NULL DEFAULT 'purple', created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS stocks (
      item_id TEXT NOT NULL REFERENCES items(id), warehouse_id TEXT NOT NULL REFERENCES warehouses(id),
      quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0), updated_at TEXT NOT NULL,
      PRIMARY KEY (item_id, warehouse_id)
    );
    CREATE TABLE IF NOT EXISTS operations (
      id TEXT PRIMARY KEY, reference TEXT NOT NULL UNIQUE,
      kind TEXT NOT NULL CHECK (kind IN ('in', 'consume', 'transfer')),
      item_id TEXT NOT NULL REFERENCES items(id), warehouse_id TEXT NOT NULL REFERENCES warehouses(id),
      target_id TEXT REFERENCES warehouses(id), quantity INTEGER NOT NULL CHECK (quantity > 0),
      origin TEXT NOT NULL DEFAULT '', note TEXT NOT NULL DEFAULT '',
      admin_id TEXT NOT NULL REFERENCES admins(id), created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS operations_date ON operations(created_at DESC);
  `);

  function transaction(callback) {
    database.exec('BEGIN IMMEDIATE');
    try {
      const result = callback();
      database.exec('COMMIT');
      return result;
    } catch (error) {
      database.exec('ROLLBACK');
      throw error;
    }
  }

  function exists(table, id, label) {
    if (typeof id !== 'string' || !database.prepare(`SELECT id FROM ${table} WHERE id = ?`).get(id)) {
      throw new ValidationError(`${label}不存在，请刷新后重试`);
    }
  }

  function changeStock(itemId, warehouseId, delta, time) {
    const current = database.prepare('SELECT quantity FROM stocks WHERE item_id = ? AND warehouse_id = ?').get(itemId, warehouseId)?.quantity ?? 0;
    const next = current + delta;
    if (next < 0) throw new ValidationError(`库存不足，当前可用数量为 ${current}`);
    if (!Number.isSafeInteger(next) || next > 1000000000) throw new ValidationError('库存数量超出上限');
    database.prepare(`INSERT INTO stocks (item_id, warehouse_id, quantity, updated_at) VALUES (?, ?, ?, ?)
      ON CONFLICT(item_id, warehouse_id) DO UPDATE SET quantity = excluded.quantity, updated_at = excluded.updated_at`)
      .run(itemId, warehouseId, next, time);
  }

  function addOperation(input) {
    const { kind, itemId, warehouseId, targetId, adminId } = input;
    if (!['in', 'consume', 'transfer'].includes(kind)) throw new ValidationError('请选择有效的操作类型');
    const quantity = positiveInteger(input.quantity, '数量');
    const note = kind === 'consume' ? requiredText(input.note, '消耗备注', 1000) : optionalText(input.note);
    const origin = kind === 'in' ? requiredText(input.origin, '生产地 / 来源', 200) : '';
    exists('items', itemId, '物品');
    exists('warehouses', warehouseId, '仓库');
    exists('admins', adminId, '操作人');
    if (kind === 'transfer') {
      exists('warehouses', targetId, '目标仓库');
      if (warehouseId === targetId) throw new ValidationError('来源仓库和目标仓库不能相同');
    }
    return transaction(() => {
      const time = new Date().toISOString();
      changeStock(itemId, warehouseId, kind === 'in' ? quantity : -quantity, time);
      if (kind === 'transfer') changeStock(itemId, targetId, quantity, time);
      const id = randomUUID();
      const reference = `KG${time.slice(0, 10).replaceAll('-', '')}${randomUUID().slice(0, 8).toUpperCase()}`;
      database.prepare(`INSERT INTO operations
        (id, reference, kind, item_id, warehouse_id, target_id, quantity, origin, note, admin_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(id, reference, kind, itemId, warehouseId, kind === 'transfer' ? targetId : null, quantity, origin, note, adminId, time);
      return { id, reference };
    });
  }

  function addItem(input) {
    const name = requiredText(input.name, '物品名称', 80);
    const sku = requiredText(input.sku, '物品编号', 40).toUpperCase();
    if (!/^[A-Z0-9_-]+$/.test(sku)) throw new ValidationError('物品编号仅支持字母、数字、短横线和下划线');
    if (database.prepare('SELECT id FROM items WHERE sku = ?').get(sku)) throw new ValidationError('物品编号已存在');
    const category = requiredText(input.category, '物品分类', 40);
    const unit = requiredText(input.unit, '计量单位', 10);
    const threshold = input.threshold ?? 10;
    if (!Number.isSafeInteger(threshold) || threshold < 0 || threshold > 1000000000) throw new ValidationError('预警数量必须是非负整数');
    const id = randomUUID();
    database.prepare(`INSERT INTO items (id, sku, name, category, unit, threshold, icon, color, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'box', 'purple', ?)`)
      .run(id, sku, name, category, unit, threshold, new Date().toISOString());
    return { id };
  }

  function addWarehouse(input) {
    const name = requiredText(input.name, '仓库名称', 60);
    const code = requiredText(input.code, '仓库编号', 20).toUpperCase();
    if (!/^[A-Z0-9_-]+$/.test(code)) throw new ValidationError('仓库编号仅支持字母、数字、短横线和下划线');
    exists('admins', input.managerId, '管理员');
    if (database.prepare('SELECT id FROM warehouses WHERE name = ? OR code = ?').get(name, code)) throw new ValidationError('仓库名称或编号已存在');
    const id = randomUUID();
    database.prepare('INSERT INTO warehouses (id, name, code, address, manager_id) VALUES (?, ?, ?, ?, ?)')
      .run(id, name, code, optionalText(input.address, 200), input.managerId);
    return { id };
  }

  function addAdmin(input) {
    const id = randomUUID();
    database.prepare('INSERT INTO admins (id, name, role, phone, color) VALUES (?, ?, ?, ?, ?)')
      .run(id, requiredText(input.name, '管理员姓名', 30), requiredText(input.role, '职务', 40), optionalText(input.phone, 40), ['purple', 'blue', 'orange', 'green'][Math.floor(Math.random() * 4)]);
    return { id };
  }

  function snapshot() {
    return {
      admins: database.prepare('SELECT * FROM admins ORDER BY rowid').all(),
      warehouses: database.prepare('SELECT * FROM warehouses ORDER BY rowid').all(),
      items: database.prepare('SELECT * FROM items ORDER BY created_at DESC, rowid').all(),
      stocks: database.prepare('SELECT * FROM stocks').all(),
      operations: database.prepare(`SELECT operations.*, items.name AS item_name, items.sku, items.unit,
        admins.name AS admin_name, warehouses.name AS warehouse_name, target.name AS target_name
        FROM operations JOIN items ON items.id = operations.item_id
        JOIN admins ON admins.id = operations.admin_id
        JOIN warehouses ON warehouses.id = operations.warehouse_id
        LEFT JOIN warehouses AS target ON target.id = operations.target_id
        ORDER BY operations.created_at DESC, operations.rowid DESC`).all()
    };
  }

  if (seed && !database.prepare('SELECT id FROM admins LIMIT 1').get()) {
    transaction(() => {
      const admins = [['admin-1', '林晓', '系统管理员', '138 0012 6800', 'purple'], ['admin-2', '陈宇', '仓库管理员', '138 0012 6801', 'blue'], ['admin-3', '王静', '仓库管理员', '138 0012 6802', 'orange']];
      for (const admin of admins) database.prepare('INSERT INTO admins VALUES (?, ?, ?, ?, ?)').run(...admin);
      const warehouses = [['wh-1', '杭州主仓', 'HZ-001', '杭州市余杭区文一西路 998 号', 'admin-1'], ['wh-2', '上海分仓', 'SH-002', '上海市松江区新桥镇民益路 88 号', 'admin-2'], ['wh-3', '深圳分仓', 'SZ-003', '深圳市宝安区福永街道物流园 B 栋', 'admin-3']];
      for (const warehouse of warehouses) database.prepare('INSERT INTO warehouses VALUES (?, ?, ?, ?, ?)').run(...warehouse);
      const items = [
        ['item-1', 'EL-001', '无线蓝牙键盘', '电子设备', '个', 20, 'keyboard', 'purple', [128, 64, 32]],
        ['item-2', 'PK-001', '环保快递纸箱', '包装材料', '个', 100, 'box', 'orange', [680, 320, 200]],
        ['item-3', 'OF-001', 'A4 打印纸', '办公用品', '包', 30, 'paper', 'blue', [86, 54, 40]],
        ['item-4', 'TL-001', '多功能螺丝刀套装', '五金工具', '套', 10, 'tool', 'green', [28, 16, 12]],
        ['item-5', 'EL-002', 'USB-C 数据线', '电子设备', '条', 30, 'cable', 'blue', [12, 8, 4]],
        ['item-6', 'PK-002', '透明封箱胶带', '包装材料', '卷', 50, 'tape', 'pink', [220, 100, 80]],
        ['item-7', 'OF-002', '黑色中性笔', '办公用品', '支', 50, 'pen', 'purple', [0, 0, 0]],
        ['item-8', 'SF-001', '防护工作手套', '劳保用品', '副', 30, 'glove', 'green', [72, 48, 36]],
        ['item-9', 'EL-003', '便携标签打印机', '电子设备', '台', 5, 'printer', 'orange', [0, 0, 0]],
        ['item-10', 'PK-003', '防震气泡膜', '包装材料', '卷', 15, 'roll', 'blue', [6, 3, 2]],
        ['item-11', 'TL-002', '不锈钢测量卷尺', '五金工具', '个', 10, 'tape', 'orange', [36, 20, 14]],
        ['item-12', 'SF-002', '一次性防尘口罩', '劳保用品', '盒', 20, 'mask', 'pink', [96, 60, 44]]
      ];
      const now = Date.now();
      for (const [index, item] of items.entries()) {
        const [id, sku, name, category, unit, threshold, icon, color, quantities] = item;
        const created = new Date(now - (items.length - index) * 86400000).toISOString();
        database.prepare('INSERT INTO items VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(id, sku, name, category, unit, threshold, icon, color, created);
        for (const [warehouseIndex, quantity] of quantities.entries()) {
          const time = new Date(now - (index * 2 + warehouseIndex) * 3600000).toISOString();
          database.prepare('INSERT INTO stocks VALUES (?, ?, ?, ?)').run(id, warehouses[warehouseIndex][0], quantity, time);
          if (quantity > 0) database.prepare('INSERT INTO operations VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
            .run(randomUUID(), `KG-DEMO-${index + 1}-${warehouseIndex + 1}`, 'in', id, warehouses[warehouseIndex][0], null, quantity, ['杭州优品制造厂', '上海合作供应商', '深圳生产中心'][warehouseIndex], '首次库存建档', admins[warehouseIndex][0], time);
        }
      }
    });
    addOperation({ kind: 'consume', itemId: 'item-2', warehouseId: 'wh-1', quantity: 20, note: '日常订单打包领用', adminId: 'admin-1' });
    addOperation({ kind: 'transfer', itemId: 'item-1', warehouseId: 'wh-1', targetId: 'wh-2', quantity: 8, note: '上海分仓备货补充', adminId: 'admin-2' });
  }

  return { snapshot, addItem, addWarehouse, addAdmin, addOperation, close: () => database.close() };
}

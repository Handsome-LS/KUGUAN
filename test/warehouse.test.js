import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createDatabase, ValidationError } from '../lib/database.js';
import { createApp } from '../server.js';

function setup(context) {
  const database = createDatabase(':memory:', { seed: false });
  context.after(() => database.close());
  const adminId = database.addAdmin({ name: '测试管理员', role: '仓库管理员' }).id;
  const warehouseId = database.addWarehouse({ name: '来源仓', code: 'TEST-A', managerId: adminId }).id;
  const targetId = database.addWarehouse({ name: '目标仓', code: 'TEST-B', managerId: adminId }).id;
  const itemId = database.addItem({ name: '测试物品', sku: 'TEST-001', category: '测试分类', unit: '个' }).id;
  const operation = { kind: 'in', itemId, warehouseId, adminId, quantity: 25, origin: '测试生产厂', note: '第一批' };
  const stock = (id = warehouseId) => database.snapshot().stocks.find((entry) => entry.item_id === itemId && entry.warehouse_id === id)?.quantity || 0;
  return { database, adminId, warehouseId, targetId, itemId, operation, stock };
}

test('new items start with zero stock and unique identifiers', (context) => {
  const fixture = setup(context);
  assert.equal(fixture.stock(), 0);
  assert.throws(() => fixture.database.addItem({ name: '重复', sku: 'test-001', category: '测试分类', unit: '个' }), /物品编号已存在/);
});

test('inbound persists origin, note, operator, reference and quantity', (context) => {
  const fixture = setup(context);
  const result = fixture.database.addOperation(fixture.operation);
  assert.equal(fixture.stock(), 25);
  const record = fixture.database.snapshot().operations[0];
  assert.equal(record.origin, '测试生产厂');
  assert.equal(record.note, '第一批');
  assert.equal(record.admin_id, fixture.adminId);
  assert.equal(record.reference, result.reference);
  assert.ok(record.created_at);
});

test('consumption can exhaust stock and records the reason', (context) => {
  const fixture = setup(context);
  fixture.database.addOperation(fixture.operation);
  fixture.database.addOperation({ ...fixture.operation, kind: 'consume', note: '生产领用' });
  assert.equal(fixture.stock(), 0);
  assert.equal(fixture.database.snapshot().operations[0].note, '生产领用');
});

test('insufficient stock leaves stock and operation history unchanged', (context) => {
  const fixture = setup(context);
  fixture.database.addOperation(fixture.operation);
  assert.throws(() => fixture.database.addOperation({ ...fixture.operation, kind: 'consume', quantity: 26 }), /库存不足/);
  assert.equal(fixture.stock(), 25);
  assert.equal(fixture.database.snapshot().operations.length, 1);
});

test('transfer atomically changes both warehouses and conserves total stock', (context) => {
  const fixture = setup(context);
  fixture.database.addOperation(fixture.operation);
  fixture.database.addOperation({ ...fixture.operation, kind: 'transfer', targetId: fixture.targetId, quantity: 7, note: '分仓补货' });
  assert.equal(fixture.stock(), 18);
  assert.equal(fixture.stock(fixture.targetId), 7);
  assert.equal(fixture.stock() + fixture.stock(fixture.targetId), 25);
  const record = fixture.database.snapshot().operations[0];
  assert.equal(record.kind, 'transfer');
  assert.equal(record.target_name, '目标仓');
  assert.equal(fixture.database.snapshot().operations.length, 2);
});

test('failed destination update rolls back source deduction and record', (context) => {
  const fixture = setup(context);
  fixture.database.addOperation(fixture.operation);
  fixture.database.addOperation({ ...fixture.operation, warehouseId: fixture.targetId, quantity: 1000000000 });
  assert.throws(() => fixture.database.addOperation({ ...fixture.operation, kind: 'transfer', targetId: fixture.targetId, quantity: 1 }), /库存数量超出上限/);
  assert.equal(fixture.stock(), 25);
  assert.equal(fixture.stock(fixture.targetId), 1000000000);
  assert.equal(fixture.database.snapshot().operations.length, 2);
});

test('same-warehouse transfers and missing relations are rejected', (context) => {
  const fixture = setup(context);
  assert.throws(() => fixture.database.addOperation({ ...fixture.operation, kind: 'transfer', targetId: fixture.warehouseId }), /不能相同/);
  assert.throws(() => fixture.database.addOperation({ ...fixture.operation, adminId: 'missing' }), /操作人不存在/);
  assert.throws(() => fixture.database.addOperation({ ...fixture.operation, warehouseId: 'missing' }), /仓库不存在/);
  assert.throws(() => fixture.database.addOperation({ ...fixture.operation, itemId: 'missing' }), /物品不存在/);
});

test('quantity validation rejects zero, negatives, fractions and unsafe values', (context) => {
  const fixture = setup(context);
  for (const quantity of [0, -1, 1.5, '10', NaN, Infinity, 1000000001]) {
    assert.throws(() => fixture.database.addOperation({ ...fixture.operation, quantity }), ValidationError);
  }
  assert.equal(fixture.database.snapshot().operations.length, 0);
});

test('inbound requires a source and consumption requires a note', (context) => {
  const fixture = setup(context);
  assert.throws(() => fixture.database.addOperation({ ...fixture.operation, origin: ' ' }), /生产地/);
  assert.throws(() => fixture.database.addOperation({ ...fixture.operation, kind: 'consume', note: '' }), /消耗备注/);
  assert.throws(() => fixture.database.addOperation({ ...fixture.operation, kind: 'unknown' }), /操作类型/);
});

test('database survives closing and reopening without reseeding', () => {
  const folder = mkdtempSync(join(tmpdir(), 'kuguan-test-'));
  const filename = join(folder, 'warehouse.sqlite');
  try {
    const first = createDatabase(filename);
    const before = first.snapshot();
    first.addOperation({ kind: 'consume', itemId: 'item-1', warehouseId: 'wh-1', quantity: 1, note: '持久化测试', adminId: 'admin-1' });
    first.close();
    const reopened = createDatabase(filename);
    try {
      assert.equal(reopened.snapshot().operations.length, before.operations.length + 1);
      assert.equal(reopened.snapshot().items.length, before.items.length);
      assert.equal(reopened.snapshot().operations[0].note, '持久化测试');
    } finally { reopened.close(); }
  } finally { rmSync(folder, { recursive: true, force: true }); }
});

test('HTTP endpoints serve the app and validate requests', async (context) => {
  const fixture = setup(context);
  const server = createApp(fixture.database);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  context.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const homepage = await fetch(base);
  assert.equal(homepage.status, 200);
  assert.match(await homepage.text(), /库管/);
  const snapshot = await fetch(`${base}/api/state`);
  assert.equal((await snapshot.json()).warehouses.length, 2);
  const write = await fetch(`${base}/api/operations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fixture.operation) });
  assert.equal(write.status, 201);
  assert.equal(fixture.stock(), 25);
  const invalid = await fetch(`${base}/api/operations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert.equal(invalid.status, 400);
  const noJson = await fetch(`${base}/api/operations`, { method: 'POST', body: '{}' });
  assert.equal(noJson.status, 415);
  const crossOrigin = await fetch(`${base}/api/operations`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://example.com' }, body: JSON.stringify(fixture.operation) });
  assert.equal(crossOrigin.status, 403);
  const privateFile = await fetch(`${base}/server.js`);
  assert.equal(privateFile.status, 404);
});

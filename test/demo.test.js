import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDatabase } from '../lib/database.js';
import { applyDemoMutation } from '../public/demo-store.js';

function fixture() {
  const database = createDatabase(':memory:');
  try { return structuredClone(database.snapshot()); } finally { database.close(); }
}

const operation = { kind: 'in', itemId: 'item-1', warehouseId: 'wh-1', adminId: 'admin-1', quantity: 3, origin: '测试工厂', note: '演示测试' };
const quantity = (data, warehouse = 'wh-1') => data.stocks.find((stock) => stock.item_id === 'item-1' && stock.warehouse_id === warehouse).quantity;

test('browser demo inbound creates complete history without mutating original data', () => {
  const initial = fixture();
  const before = structuredClone(initial);
  const { data, result } = applyDemoMutation(initial, '/api/operations', operation);
  assert.deepEqual(initial, before);
  assert.equal(quantity(data), quantity(initial) + 3);
  assert.equal(data.operations[0].reference, result.reference);
  assert.equal(data.operations[0].origin, '测试工厂');
  assert.equal(data.operations[0].note, '演示测试');
  assert.equal(data.operations[0].admin_name, '林晓');
  assert.equal(data.operations[0].item_name, '无线蓝牙键盘');
});

test('browser demo transfer conserves inventory and saves the target warehouse', () => {
  const initial = fixture();
  const { data } = applyDemoMutation(initial, '/api/operations', { ...operation, kind: 'transfer', targetId: 'wh-2' });
  assert.equal(quantity(data), quantity(initial) - 3);
  assert.equal(quantity(data, 'wh-2'), quantity(initial, 'wh-2') + 3);
  assert.equal(data.operations[0].target_name, '上海分仓');
  assert.throws(() => applyDemoMutation(initial, '/api/operations', { ...operation, kind: 'transfer', targetId: 'wh-1' }), /不能相同/);
});

test('browser demo destination overflow never changes source or operation history', () => {
  const initial = fixture();
  initial.stocks.find((stock) => stock.item_id === 'item-1' && stock.warehouse_id === 'wh-2').quantity = 1000000000;
  const before = structuredClone(initial);
  assert.throws(() => applyDemoMutation(initial, '/api/operations', { ...operation, kind: 'transfer', targetId: 'wh-2' }), /库存数量超出上限/);
  assert.deepEqual(initial, before);
});

test('browser demo can consume to zero and rejects shortages or missing notes', () => {
  const initial = fixture();
  assert.equal(quantity(applyDemoMutation(initial, '/api/operations', { ...operation, kind: 'consume', quantity: quantity(initial) }).data), 0);
  assert.throws(() => applyDemoMutation(initial, '/api/operations', { ...operation, kind: 'consume', quantity: quantity(initial) + 1 }), /库存不足/);
  assert.throws(() => applyDemoMutation(initial, '/api/operations', { ...operation, kind: 'consume', note: '' }), /消耗备注/);
});

test('browser demo validates quantities, required sources and related records', () => {
  const initial = fixture();
  for (const invalid of [0, -1, 1.5, '3', Infinity, 1000000001]) {
    assert.throws(() => applyDemoMutation(initial, '/api/operations', { ...operation, quantity: invalid }), /必须是/);
  }
  assert.throws(() => applyDemoMutation(initial, '/api/operations', { ...operation, origin: ' ' }), /生产地/);
  assert.throws(() => applyDemoMutation(initial, '/api/operations', { ...operation, adminId: 'missing' }), /操作人不存在/);
});

test('browser demo supports item, warehouse and administrator creation with unique codes', () => {
  const initial = fixture();
  const added = applyDemoMutation(initial, '/api/items', { name: '新物品', sku: 'new-001', category: '测试', unit: '套', threshold: 0 });
  assert.equal(added.data.items[0].sku, 'NEW-001');
  assert.equal(added.data.items[0].id, added.result.id);
  assert.equal(added.data.stocks.some((stock) => stock.item_id === added.result.id), false);
  assert.throws(() => applyDemoMutation(added.data, '/api/items', { name: '重复', sku: 'new-001', category: '测试', unit: '套' }), /已存在/);
  const admin = applyDemoMutation(initial, '/api/admins', { name: '新成员', role: '仓库管理员' });
  const warehouse = applyDemoMutation(admin.data, '/api/warehouses', { name: '新分仓', code: 'new-wh', managerId: admin.result.id });
  assert.equal(warehouse.data.warehouses.at(-1).manager_id, admin.result.id);
  assert.throws(() => applyDemoMutation(warehouse.data, '/api/warehouses', { name: '另一个仓', code: 'new-wh', managerId: admin.result.id }), /已存在/);
});

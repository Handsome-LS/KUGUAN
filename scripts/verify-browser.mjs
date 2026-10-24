import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { createDatabase } from '../lib/database.js';
import { createApp } from '../server.js';
import { createPagesPreview } from './preview-pages.mjs';

const output = resolve('test-results');
const isDemo = process.argv.includes('--demo');
mkdirSync(output, { recursive: true });
const profile = join(output, `browser-profile-${Date.now()}`);
const chromePath = process.env.CHROME_PATH || ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
if (!chromePath) throw new Error('找不到 Chrome / Edge，请通过 CHROME_PATH 指定浏览器可执行文件。');
const database = createDatabase(':memory:');
const server = isDemo ? createPagesPreview() : createApp(database);
await new Promise((complete) => server.listen(0, '127.0.0.1', complete));
const base = `http://127.0.0.1:${server.address().port}${isDemo ? '/KUGUAN/' : ''}`;
const browser = spawn(chromePath, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-extensions', '--no-sandbox', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--window-size=1440,1080', 'about:blank'], { windowsHide: true, stdio: 'ignore' });
let socket;
let sequence = 0;
const pending = new Map();
const errors = [];
const checks = [];
let expectedBadRequests = 0;

async function until(check, label, timeout = 12000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try { const value = await check(); if (value) return value; } catch {}
    await delay(100);
  }
  throw new Error(`等待超时：${label}`);
}

function command(method, params = {}) {
  const id = ++sequence;
  return new Promise((complete, reject) => {
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`CDP 超时：${method}`)); }, 15000);
    pending.set(id, { complete: (value) => { clearTimeout(timeout); complete(value); }, reject: (error) => { clearTimeout(timeout); reject(error); } });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text + ': ' + result.exceptionDetails.exception?.description);
  return result.result.value;
}

const click = (selector) => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
const waitFor = (selector) => until(() => evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`), selector);
const waitClosed = () => until(() => evaluate('!document.querySelector("#modal").open'), '弹窗提交成功');
async function fillForm(values) {
  await evaluate(`(() => { const form = document.querySelector('#modal form'); const values = ${JSON.stringify(values)}; for (const [name, value] of Object.entries(values)) { const field = form.elements[name]; field.value = value; field.dispatchEvent(new Event('input', { bubbles: true })); field.dispatchEvent(new Event('change', { bubbles: true })); } })()`);
}
const submit = () => evaluate('document.querySelector("#modal form").requestSubmit()');
const snapshot = () => isDemo ? evaluate('import(new URL("./demo-store.js", location.href)).then(module => module.createDemoStore().request("/api/state"))') : fetch(`${base}/api/state`).then((response) => response.json());
function passed(label) { checks.push(label); console.log(`PASS ${label}`); }

try {
  const port = await until(async () => (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0], '浏览器启动', 20000);
  const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(pages.find((page) => page.type === 'page').webSocketDebuggerUrl);
  await new Promise((complete, reject) => { socket.addEventListener('open', complete, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const request = pending.get(message.id);
      pending.delete(message.id);
      message.error ? request.reject(new Error(message.error.message)) : request.complete(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') {
      if (message.params.entry.source === 'network' && message.params.entry.text.includes('400') && expectedBadRequests > 0) expectedBadRequests--;
      else errors.push(message.params.entry.text);
    }
  });
  await command('Runtime.enable');
  await command('Log.enable');
  await command('Page.enable');
  await command('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1080, deviceScaleFactor: 1, mobile: false });
  await command('Page.navigate', { url: base });
  await waitFor('.inventory-table tbody tr');
  if (isDemo) {
    assert.ok(await evaluate('document.querySelector(".demo-notice").textContent.includes("当前浏览器")'));
    assert.ok(await evaluate('document.querySelector(".workspace-badge").textContent.includes("演示")'));
    passed('GitHub project subpath serves demo assets and browser-storage notices');
  }
  assert.equal(await evaluate('document.querySelectorAll(".metric-card").length'), 4);
  assert.equal(await evaluate('document.querySelectorAll(".inventory-table tbody tr").length'), 8);
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'));
  await writeFile(join(output, 'desktop.png'), Buffer.from((await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })).data, 'base64'));
  passed('Desktop inventory renders with metrics, pagination and no page overflow');

  await click('[data-status="missing"]');
  assert.equal(await evaluate('document.querySelectorAll(".inventory-table tbody tr").length'), 2);
  assert.ok(await evaluate('[...document.querySelectorAll(".quantity")].every(element => element.textContent === "0")'));
  await click('[data-status="all"]');
  passed('Missing state filters only zero-stock items');

  await click('[data-action="new-item"]');
  await fillForm({ name: '浏览器测试物品', sku: 'BROWSER-001', category: '验证分类', unit: '个', threshold: 5 });
  await submit();
  await waitClosed();
  const itemId = (await snapshot()).items.find((item) => item.sku === 'BROWSER-001').id;
  passed('Item creation saves through the browser form');

  await click('[data-action="operation"][data-kind="in"]');
  await fillForm({ itemId, warehouseId: 'wh-1', quantity: 10, origin: '浏览器验证工厂', note: '入库测试' });
  await submit();
  await waitClosed();
  assert.equal((await snapshot()).stocks.find((stock) => stock.item_id === itemId && stock.warehouse_id === 'wh-1').quantity, 10);
  passed('Inbound updates inventory and persists source and note');

  await click('[data-action="operation"][data-kind="consume"]');
  await fillForm({ itemId, warehouseId: 'wh-1', quantity: 11, note: '超额消耗测试' });
  if (!isDemo) expectedBadRequests++;
  await submit();
  await until(() => evaluate('!document.querySelector("#form-error").hidden'), '库存不足错误');
  assert.match(await evaluate('document.querySelector("#form-error").textContent'), /库存不足/);
  await fillForm({ quantity: 2, note: '生产领用' });
  await submit();
  await waitClosed();
  assert.equal((await snapshot()).stocks.find((stock) => stock.item_id === itemId && stock.warehouse_id === 'wh-1').quantity, 8);
  passed('Consumption rejects insufficient stock, then saves valid consumption');

  await click('[data-action="operation"][data-kind="transfer"]');
  await fillForm({ itemId, warehouseId: 'wh-2' });
  assert.ok(await evaluate('[...document.querySelector("#op-target").options].some(option => option.value === "wh-1" && !option.disabled)'));
  await fillForm({ itemId, warehouseId: 'wh-1', quantity: 3, targetId: 'wh-2', note: '跨仓调拨验证' });
  await submit();
  await waitClosed();
  let data = await snapshot();
  assert.equal(data.stocks.find((stock) => stock.item_id === itemId && stock.warehouse_id === 'wh-1').quantity, 5);
  assert.equal(data.stocks.find((stock) => stock.item_id === itemId && stock.warehouse_id === 'wh-2').quantity, 3);
  passed('Transfer updates both source and destination');

  await click('[data-action="new-warehouse"]');
  await fillForm({ name: '浏览器测试仓库', code: 'BROWSER-WH', address: '测试地址', managerId: 'admin-2' });
  await submit();
  await waitClosed();
  assert.ok((await snapshot()).warehouses.some((warehouse) => warehouse.code === 'BROWSER-WH'));
  passed('Warehouse form creates a warehouse with an assigned manager');

  await click('[data-view="admins"]');
  await click('[data-action="new-admin"]');
  await fillForm({ name: '测试成员', role: '仓库操作员', phone: '13800000000' });
  await submit();
  await waitClosed();
  assert.ok((await snapshot()).admins.some((admin) => admin.name === '测试成员'));
  await click('[data-action="choose-admin"][data-id="admin-2"]');
  assert.ok(await evaluate('document.querySelector(".profile-button").textContent.includes("陈宇")'));
  passed('Administrator creation and active-operator switching work');

  await click('[data-view="records"]');
  await waitFor('.record-table tbody tr');
  await evaluate(`(() => { const input = document.querySelector('#search-input'); input.value = 'BROWSER-001'; input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  assert.equal(await evaluate('document.querySelectorAll(".record-table tbody tr").length'), 3);
  await click('[data-action="record-detail"]');
  assert.ok(await evaluate('document.querySelector("#modal").textContent.includes("跨仓调拨验证")'));
  await click('[data-action="close-modal"]');
  const downloads = join(output, `downloads-${Date.now()}`);
  mkdirSync(downloads, { recursive: true });
  await command('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloads });
  await click('[data-action="export"]');
  await until(() => evaluate('document.querySelector("#toast-region").textContent.includes("已导出 3")'), '记录导出');
  const csvName = await until(async () => (await readdir(downloads)).find((name) => name.endsWith('.csv')), 'CSV 文件下载');
  const csv = await readFile(join(downloads, csvName), 'utf8');
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('浏览器验证工厂'));
  assert.ok(csv.includes('跨仓调拨验证'));
  assert.equal(csv.split('\r\n').length, 4);
  passed('Record search, details and CSV export work');

  for (const view of ['overview', 'warehouses', 'admins', 'inventory']) {
    await click(`[data-view="${view}"]`);
    assert.ok(await evaluate('document.querySelector("#main-content h1") !== null'));
  }
  passed('All five navigation sections render');

  await command('Page.reload');
  await waitFor('.inventory-table tbody tr');
  assert.ok(await evaluate('document.querySelector(".profile-button").textContent.includes("陈宇")'));
  assert.equal((await snapshot()).operations.filter((operation) => operation.item_id === itemId).length, 3);
  passed('Reload retains inventory, history and selected operator');

  if (isDemo) {
    const before = await snapshot();
    const attempts = await evaluate(`(() => { const operation = { kind: 'consume', itemId: ${JSON.stringify(itemId)}, warehouseId: 'wh-1', adminId: 'admin-1', quantity: 4, note: '并发领用验证' }; return Promise.allSettled(Array.from({ length: 2 }, () => import(new URL('./demo-store.js', location.href)).then(module => module.createDemoStore().request('/api/operations', operation)))).then(results => results.map(result => result.status)); })()`);
    assert.equal(attempts.filter((status) => status === 'fulfilled').length, 1);
    assert.equal(attempts.filter((status) => status === 'rejected').length, 1);
    const after = await snapshot();
    assert.equal(after.stocks.find((stock) => stock.item_id === itemId && stock.warehouse_id === 'wh-1').quantity, 1);
    assert.equal(after.operations.length, before.operations.length + 1);
    passed('Concurrent browser transactions prevent negative stock and lost updates');
  }

  await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await delay(250);
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'));
  await click('[data-action="menu"]');
  assert.ok(await evaluate('document.querySelector(".sidebar").classList.contains("mobile-open")'));
  await click('[data-view="records"]');
  assert.ok(await evaluate('!document.querySelector(".sidebar").classList.contains("mobile-open")'));
  await click('[data-action="menu"]');
  await click('[data-view="inventory"]');
  await writeFile(join(output, 'mobile.png'), Buffer.from((await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })).data, 'base64'));
  passed('Mobile layout has no overflow and drawer navigation works');
  assert.deepEqual(errors, []);
  passed('No browser JavaScript or console errors');
  await writeFile(join(output, isDemo ? 'pages-browser-report.json' : 'browser-report.json'), JSON.stringify({ passed: checks.length, checks, errors }, null, 2));
  console.log(`Browser checks passed: ${checks.length}. Screenshots: ${output}`);
} finally {
  socket?.close();
  browser.kill();
  await new Promise((complete) => server.close(complete));
  database.close();
  await delay(300);
  try { await rm(profile, { recursive: true, force: true }); } catch {}
}

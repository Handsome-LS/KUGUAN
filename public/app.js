const paths = {
  box: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9M7.5 5.5l9 5"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  warehouse: '<path d="m3 9 9-6 9 6v12H3V9Z"/><path d="M8 21V11h8v10M8 15h8M8 18h8"/>',
  history: '<path d="M3 11a9 9 0 1 1 2.5 7M3 4v7h7"/><path d="M12 7v5l3 2"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M21 21v-2a6 6 0 0 0-3-5.2"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  arrowUp: '<path d="M12 20V4m-6 6 6-6 6 6"/>',
  arrowDown: '<path d="M12 4v16m-6-6 6 6 6-6"/>',
  transfer: '<path d="M3 7h17m-4-4 4 4-4 4M21 17H4m4-4-4 4 4 4"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  filter: '<path d="M4 7h16M7 12h10M10 17h4"/><circle cx="8" cy="7" r="2" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="2" fill="currentColor" stroke="none"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  empty: '<path d="m4 8 4-5h8l4 5v12H4V8Z"/><path d="M4 8h5l1 4h4l1-4h5"/>',
  alert: '<path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5M12 17h.01"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4M12 17h.01"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  dots: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  sort: '<path d="M8 4v16m-4-4 4 4 4-4M16 20V4m-4 4 4-4 4 4"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18M8 15h2M14 15h2"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  phone: '<path d="M5 3h4l2 5-3 2a14 14 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
  leaf: '<path d="M5 20c0-9 7-12 14-15 1 10-2 16-9 14M5 20l10-10"/>',
  keyboard: '<rect x="2" y="6" width="20" height="13" rx="2"/><path d="M5 10h1m3 0h1m3 0h1m3 0h1M5 13h1m3 0h1m3 0h1m3 0h1M7 16h10"/>',
  paper: '<path d="M6 3h9l4 4v14H6V3Z"/><path d="M15 3v5h4M9 12h7M9 16h7M3 7v15"/>',
  tool: '<path d="M14 5a5 5 0 0 0-6 6L2 17l5 5 6-6a5 5 0 0 0 6-6l-4 3-4-4 3-4Z"/>',
  cable: '<path d="M8 3v4M5 3v4M4 7h5v4H4V7ZM6.5 11v5a4 4 0 0 0 8 0v-5M12 7h5v4h-5V7ZM13 3v4M16 3v4"/>',
  tape: '<ellipse cx="12" cy="10" rx="9" ry="6"/><ellipse cx="12" cy="10" rx="4" ry="2.5"/><path d="M3 10v5c0 3.3 4 6 9 6s9-2.7 9-6v-5"/>',
  pen: '<path d="m15 3 6 6-12 12H3v-6L15 3ZM12 6l6 6M3 15l6 6"/>',
  glove: '<path d="M6 12V6a1.5 1.5 0 0 1 3 0v5-7a1.5 1.5 0 0 1 3 0v7-6a1.5 1.5 0 0 1 3 0v6-4a1.5 1.5 0 0 1 3 0v9c0 4-3 6-6 6-4 0-5-3-7-6l-2-3a1.5 1.5 0 0 1 2-2l3 3"/>',
  printer: '<path d="M7 8V3h10v5M7 17H3V8h18v9h-4M7 14h10v7H7v-7ZM17 11h1"/>',
  roll: '<ellipse cx="7" cy="12" rx="4" ry="8"/><ellipse cx="7" cy="12" rx="1.5" ry="3"/><path d="M7 4h11c5 0 5 16 0 16H7"/>',
  mask: '<path d="m6 7 6-3 6 3v7c0 4-6 7-6 7s-6-3-6-7V7ZM6 9H3v6h3M18 9h3v6h-3M9 10h6M9 13h6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  arrowRight: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  external: '<path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7"/>'
};

const icon = (name, className = '') => `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.box}</svg>`;
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const number = (value) => new Intl.NumberFormat('zh-CN').format(value);
const formatDate = (value, short = false) => new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit', ...(short ? {} : { hour: '2-digit', minute: '2-digit', hour12: false }) }).format(new Date(value));
const today = () => new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).format(new Date());
const app = document.querySelector('#app');
const modal = document.querySelector('#modal');
const viewNames = { overview: '工作台概览', inventory: '物品库存', warehouses: '仓库管理', records: '操作记录', admins: '管理员' };
let storedAdmin;
try { storedAdmin = localStorage.getItem('kuguan-admin'); } catch {}
const state = { data: null, view: 'inventory', warehouse: 'all', category: 'all', status: 'all', search: '', page: 1, pageSize: 8, selected: new Set(), sort: 'default', filters: false, recordKind: 'all', recordDays: 'all', adminId: storedAdmin || 'admin-1', mobileNav: false };

async function api(path, payload) {
  const response = await fetch(path, payload ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) } : {});
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || '请求失败，请稍后重试');
  return result;
}

async function refresh() {
  state.data = await api('/api/state');
  if (!state.data.admins.some((admin) => admin.id === state.adminId)) state.adminId = state.data.admins[0]?.id;
}

const currentAdmin = () => state.data.admins.find((admin) => admin.id === state.adminId);
const adminById = (id) => state.data.admins.find((admin) => admin.id === id);
const warehouseById = (id) => state.data.warehouses.find((warehouse) => warehouse.id === id);
const categoryOptions = () => [...new Set(state.data.items.map((item) => item.category))];
const quantityFor = (itemId, warehouseId = state.warehouse) => state.data.stocks.filter((stock) => stock.item_id === itemId && (warehouseId === 'all' || stock.warehouse_id === warehouseId)).reduce((sum, stock) => sum + stock.quantity, 0);
const isLow = (item) => quantityFor(item.id) > 0 && quantityFor(item.id) <= item.threshold;
const lastUpdated = (itemId) => state.data.stocks.filter((stock) => stock.item_id === itemId && (state.warehouse === 'all' || stock.warehouse_id === state.warehouse)).map((stock) => stock.updated_at).sort().at(-1);

function getItems(includeStatus = true) {
  let items = state.data.items.filter((item) => {
    const search = state.search.trim().toLowerCase();
    if (search && !`${item.name} ${item.sku} ${item.category}`.toLowerCase().includes(search)) return false;
    if (state.category !== 'all' && item.category !== state.category) return false;
    const quantity = quantityFor(item.id);
    return !includeStatus || state.status === 'all' || (state.status === 'exists' && quantity > 0) || (state.status === 'missing' && quantity === 0) || (state.status === 'low' && isLow(item));
  });
  if (state.sort === 'name') items.sort((first, second) => first.name.localeCompare(second.name, 'zh-CN'));
  if (state.sort === 'quantity') items.sort((first, second) => quantityFor(second.id) - quantityFor(first.id));
  if (state.sort === 'default') items.sort((first, second) => first.sku.localeCompare(second.sku));
  return items;
}

function getRecords() {
  return state.data.operations.filter((operation) => {
    if (state.warehouse !== 'all' && operation.warehouse_id !== state.warehouse && operation.target_id !== state.warehouse) return false;
    if (state.recordKind !== 'all' && operation.kind !== state.recordKind) return false;
    if (state.recordDays !== 'all' && Date.now() - new Date(operation.created_at).getTime() > Number(state.recordDays) * 86400000) return false;
    const search = state.search.trim().toLowerCase();
    return !search || `${operation.item_name} ${operation.sku} ${operation.reference} ${operation.admin_name} ${operation.note} ${operation.origin}`.toLowerCase().includes(search);
  });
}

function avatar(admin, size = '') {
  return `<span class="avatar ${escapeHtml(admin?.color || 'purple')} ${size}">${escapeHtml(admin?.name?.slice(-2) || '管')}</span>`;
}

function shell() {
  const admin = currentAdmin();
  app.innerHTML = `<aside class="sidebar ${state.mobileNav ? 'mobile-open' : ''}">
    <a class="brand" href="#inventory" aria-label="库管首页"><span class="brand-mark">${icon('box')}</span><span class="brand-name">库管<span>KUGUAN</span></span><span class="brand-dot"></span></a>
    <div class="workspace-label">工作空间 <span class="workspace-badge">本地版</span></div>
    <nav class="main-nav" aria-label="主导航">${[['overview', 'grid', '工作台概览'], ['inventory', 'box', '物品库存'], ['warehouses', 'warehouse', '仓库管理'], ['records', 'history', '操作记录'], ['admins', 'users', '管理员']].map(([view, symbol, label]) => `<button class="nav-item ${state.view === view ? 'active' : ''}" data-view="${view}">${icon(symbol)}<span>${label}</span>${view === 'inventory' ? `<span class="nav-count">${state.data.items.length}</span>` : ''}</button>`).join('')}</nav>
    <div class="sidebar-divider"></div><div class="sidebar-label">我的仓库<button class="icon-button" data-action="new-warehouse" title="新建仓库" aria-label="新建仓库">${icon('plus')}</button></div>
    <div class="warehouse-nav">${state.data.warehouses.map((warehouse, index) => `<button class="warehouse-nav-item ${state.warehouse === warehouse.id ? 'selected' : ''}" data-warehouse="${escapeHtml(warehouse.id)}"><span class="warehouse-dot dot-${index % 3}"></span><span>${escapeHtml(warehouse.name)}</span>${icon('chevron')}</button>`).join('')}</div>
    <div class="sidebar-bottom"><div class="sidebar-tip"><span class="tip-icon">${icon('leaf')}</span><strong>井井有条，心中有数</strong><p>每一件物品的来去<br>都有迹可循。</p><span class="tip-decoration">${icon('box')}</span></div><button class="help-link" data-action="help">${icon('help')}<span>使用帮助</span>${icon('external')}</button><div class="sidebar-version">库管 · 让仓储更简单 <span>v1.0</span></div></div>
  </aside>
  <div class="sidebar-scrim ${state.mobileNav ? 'visible' : ''}" data-action="close-nav"></div>
  <div class="workspace"><header class="topbar"><div class="breadcrumb"><button class="icon-button mobile-menu" data-action="menu" aria-label="打开导航">${icon('menu')}</button><span class="breadcrumb-home">工作空间</span>${icon('chevron')}<span>${viewNames[state.view]}</span></div><div class="topbar-right"><span class="topbar-date">${icon('calendar')}${today()}</span><span class="topbar-separator"></span><button class="icon-button notification-button" data-action="notifications" aria-label="查看库存预警" title="库存预警">${icon('bell')}${state.data.items.some(isLow) ? '<span class="notification-dot"></span>' : ''}</button><button class="profile-button" data-action="switch-admin" title="切换操作人">${avatar(admin)}<span>${escapeHtml(admin?.name)}<small>${escapeHtml(admin?.role)}</small></span>${icon('down')}</button></div></header><main id="main-content"></main><footer class="page-footer"><span>每一份库存，都心中有数。</span><span><i class="online-dot"></i> 本地数据库已连接</span></footer></div>`;
  renderMain();
}

function pageHeader(title, description, actions = '') {
  return `<section class="page-heading"><div><div class="eyebrow">WAREHOUSE MANAGEMENT</div><h1>${title}</h1><p>${description}</p></div><div class="heading-actions">${actions}</div></section>`;
}

function warehouseSelect(id = 'warehouse-filter') {
  return `<div class="select-wrap">${icon('warehouse')}<select id="${id}" aria-label="筛选仓库"><option value="all">全部仓库</option>${state.data.warehouses.map((warehouse) => `<option value="${escapeHtml(warehouse.id)}" ${state.warehouse === warehouse.id ? 'selected' : ''}>${escapeHtml(warehouse.name)}</option>`).join('')}</select>${icon('down')}</div>`;
}

function metrics() {
  const items = state.data.items;
  const total = items.reduce((sum, item) => sum + quantityFor(item.id), 0);
  const available = items.filter((item) => quantityFor(item.id) > 0).length;
  const missing = items.length - available;
  return `<section class="metrics" aria-label="库存统计">
    <article class="metric-card"><div class="metric-top"><span>物品种类</span><span class="metric-icon purple">${icon('box')}</span></div><div class="metric-value">${number(items.length)}<span>种</span></div><div class="metric-bottom"><span class="metric-note">全部已建档物品</span><span class="tiny-label">${categoryOptions().length} 个分类</span></div></article>
    <article class="metric-card"><div class="metric-top"><span>库存总量</span><span class="metric-icon blue">${icon('warehouse')}</span></div><div class="metric-value">${number(total)}<span>件</span></div><div class="metric-bottom"><span class="metric-note">${state.warehouse === 'all' ? '分布于所有仓库' : escapeHtml(warehouseById(state.warehouse)?.name)}</span><span class="tiny-label">${state.warehouse === 'all' ? state.data.warehouses.length : 1} 个仓库</span></div></article>
    <article class="metric-card"><div class="metric-top"><span>存在物品</span><span class="metric-icon green">${icon('checkCircle')}</span></div><div class="metric-value">${number(available)}<span>种</span></div><div class="metric-bottom"><span class="metric-note"><i class="status-dot green-dot"></i>有可用库存</span><span class="metric-percent">${items.length ? Math.round(available / items.length * 100) : 0}%</span></div></article>
    <article class="metric-card"><div class="metric-top"><span>不存在物品</span><span class="metric-icon orange">${icon('empty')}</span></div><div class="metric-value">${number(missing)}<span>种</span></div><div class="metric-bottom"><span class="metric-note"><i class="status-dot orange-dot"></i>当前库存为零</span><button class="text-link" data-action="show-missing">查看物品 ${icon('chevron')}</button></div></article>
  </section>`;
}

function searchInput(placeholder = '搜索物品名称、编号…') {
  return `<div class="search-input">${icon('search')}<input id="search-input" type="search" value="${escapeHtml(state.search)}" placeholder="${placeholder}" autocomplete="off" aria-label="${placeholder}"><kbd>/</kbd></div>`;
}

function inventory() {
  const allItems = getItems(false);
  const counts = { all: allItems.length, exists: allItems.filter((item) => quantityFor(item.id) > 0).length, missing: allItems.filter((item) => quantityFor(item.id) === 0).length, low: allItems.filter(isLow).length };
  const items = getItems();
  const pages = Math.max(1, Math.ceil(items.length / state.pageSize));
  state.page = Math.min(state.page, pages);
  const pageItems = items.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
  const lowCount = state.data.items.filter(isLow).length;
  return `${pageHeader('物品库存', '掌握每一件物品的状态，让仓库管理更从容。', `<button class="button secondary" data-action="operation" data-kind="consume">${icon('minus')}消耗</button><button class="button secondary" data-action="operation" data-kind="transfer">${icon('transfer')}调拨</button><button class="button primary" data-action="operation" data-kind="in">${icon('plus')}加入物品</button>`)}
    ${metrics()}
    <section class="inventory-panel panel"><div class="panel-heading"><div class="panel-title"><h2>库存清单</h2><span class="count-label">${state.data.items.length} 种物品</span></div><div class="panel-heading-actions"><button class="text-link new-item-link" data-action="new-item">${icon('plus')}新建物品</button><button class="button export-button" data-action="export">${icon('download')}导出${state.selected.size ? ` (${state.selected.size})` : ''}</button></div></div>
      <div class="inventory-tabs" role="tablist" aria-label="物品状态">${[['all', '全部物品'], ['exists', '存在'], ['missing', '不存在']].map(([key, label]) => `<button role="tab" aria-selected="${state.status === key}" class="tab ${state.status === key ? 'active' : ''}" data-status="${key}">${key === 'exists' ? '<i class="status-dot green-dot"></i>' : key === 'missing' ? '<i class="status-dot gray-dot"></i>' : ''}${label}<span>${counts[key]}</span></button>`).join('')}<button class="low-tab ${state.status === 'low' ? 'active' : ''}" data-status="low">${icon('alert')}库存偏低 <span>${counts.low}</span></button></div>
      <div class="table-toolbar">${searchInput()}<div class="toolbar-right">${warehouseSelect()}<button class="button filter-button ${state.filters ? 'pressed' : ''}" data-action="filters">${icon('filter')}筛选${state.category !== 'all' ? '<i class="filter-dot"></i>' : ''}</button></div></div>
      ${state.filters ? `<div class="filter-panel"><label for="category-filter">物品分类</label><select id="category-filter"><option value="all">全部分类</option>${categoryOptions().map((category) => `<option ${state.category === category ? 'selected' : ''}>${escapeHtml(category)}</option>`).join('')}</select><label for="sort-filter">排序方式</label><select id="sort-filter"><option value="default" ${state.sort === 'default' ? 'selected' : ''}>物品编号</option><option value="name" ${state.sort === 'name' ? 'selected' : ''}>物品名称</option><option value="quantity" ${state.sort === 'quantity' ? 'selected' : ''}>库存数量从多到少</option></select><button class="text-link" data-action="reset-filters">重置筛选</button></div>` : ''}
      <div class="table-scroll"><table class="inventory-table"><thead><tr><th class="checkbox-cell"><input type="checkbox" id="select-all" aria-label="选择当前页所有物品" ${pageItems.length && pageItems.every((item) => state.selected.has(item.id)) ? 'checked' : ''}></th><th>物品信息<button class="sort-button" data-action="sort" title="切换排序" aria-label="切换排序">${icon('sort')}</button></th><th>分类</th><th>所在仓库</th><th>库存数量</th><th>状态</th><th>最近更新</th><th class="actions-cell">操作</th></tr></thead><tbody>${pageItems.map(itemRow).join('')}</tbody></table>${!pageItems.length ? emptyState('没有找到符合条件的物品', '试试调整搜索词或筛选条件，也可以加入新物品。', 'reset-filters', '重置筛选') : ''}</div>
      ${pagination(items.length, pages, '种物品')}
    </section>
    <div class="inventory-note">${icon('help')}<span>物品状态根据库存自动更新：数量大于 0 为<span class="note-highlight">存在</span>，数量为 0 为<span class="note-highlight">不存在</span>。</span>${lowCount ? `<button data-status="low" class="text-link note-warning">${lowCount} 种物品库存偏低 ${icon('arrowRight')}</button>` : ''}</div>`;
}

function itemRow(item) {
  const quantity = quantityFor(item.id);
  const stocks = state.data.stocks.filter((stock) => stock.item_id === item.id && stock.quantity > 0 && (state.warehouse === 'all' || stock.warehouse_id === state.warehouse));
  const updated = lastUpdated(item.id);
  const warehouseNames = stocks.map((stock) => warehouseById(stock.warehouse_id)?.name);
  return `<tr class="${state.selected.has(item.id) ? 'row-selected' : ''}"><td class="checkbox-cell"><input type="checkbox" data-select="${escapeHtml(item.id)}" aria-label="选择${escapeHtml(item.name)}" ${state.selected.has(item.id) ? 'checked' : ''}></td><td><button class="item-identity" data-action="item-detail" data-id="${escapeHtml(item.id)}"><span class="item-art ${escapeHtml(item.color)}">${icon(item.icon)}</span><span class="item-name">${escapeHtml(item.name)}<small>${escapeHtml(item.sku)}</small></span></button></td><td><span class="category-tag">${escapeHtml(item.category)}</span></td><td><div class="warehouse-cell" title="${escapeHtml(warehouseNames.join('、'))}">${warehouseNames.length ? `${icon('warehouse')}<span>${escapeHtml(warehouseNames[0])}</span>${warehouseNames.length > 1 ? `<span class="warehouse-more">+${warehouseNames.length - 1}</span>` : ''}` : '<span class="muted">—</span>'}</div></td><td><span class="quantity ${isLow(item) ? 'low-quantity' : ''}">${number(quantity)}</span><span class="unit">${escapeHtml(item.unit)}</span>${isLow(item) ? `<span class="low-indicator" title="预警线：${item.threshold} ${escapeHtml(item.unit)}">${icon('alert')}</span>` : ''}</td><td><span class="status-badge ${quantity > 0 ? 'exists' : 'missing'}"><i></i>${quantity > 0 ? '存在' : '不存在'}</span></td><td class="date-cell">${updated ? formatDate(updated) : '尚无记录'}</td><td class="actions-cell"><div class="row-actions"><button class="row-add" data-action="operation" data-kind="in" data-item="${escapeHtml(item.id)}">加入</button><span></span><button class="row-consume" data-action="operation" data-kind="consume" data-item="${escapeHtml(item.id)}" ${quantity <= 0 ? 'disabled' : ''}>消耗</button><button class="icon-button more-button" data-action="item-detail" data-id="${escapeHtml(item.id)}" title="物品详情" aria-label="查看${escapeHtml(item.name)}详情">${icon('dots')}</button></div></td></tr>`;
}

function pagination(total, pages, unit = '条记录') {
  return `<div class="pagination"><span>共 <strong>${number(total)}</strong> ${unit} <span class="pagination-range">${total ? `· 显示 ${(state.page - 1) * state.pageSize + 1}–${Math.min(state.page * state.pageSize, total)}` : ''}</span></span><div><select id="page-size" aria-label="每页显示数量">${[8, 16, 32].map((size) => `<option value="${size}" ${state.pageSize === size ? 'selected' : ''}>${size} 条 / 页</option>`).join('')}</select><button class="page-button prev" data-page="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''} aria-label="上一页">${icon('chevron')}</button>${Array.from({ length: pages }, (_, index) => index + 1).filter((page) => page === 1 || page === pages || Math.abs(page - state.page) <= 1).map((page, index, shown) => `${index > 0 && page - shown[index - 1] > 1 ? '<span class="page-ellipsis">…</span>' : ''}<button class="page-button ${state.page === page ? 'active' : ''}" data-page="${page}" aria-label="第 ${page} 页" ${state.page === page ? 'aria-current="page"' : ''}>${page}</button>`).join('')}<button class="page-button" data-page="${state.page + 1}" ${state.page === pages ? 'disabled' : ''} aria-label="下一页">${icon('chevron')}</button></div></div>`;
}

function emptyState(title, text, action = '', label = '') {
  return `<div class="empty-state"><span>${icon('empty')}</span><h3>${title}</h3><p>${text}</p>${action ? `<button class="button secondary" data-action="${action}">${label}</button>` : ''}</div>`;
}

function warehouses() {
  const list = state.data.warehouses.filter((warehouse) => !state.search || `${warehouse.name} ${warehouse.code} ${warehouse.address}`.includes(state.search));
  return `${pageHeader('仓库管理', '连接每一座仓库，让物品流转更高效。', `<button class="button primary" data-action="new-warehouse">${icon('plus')}新建仓库</button>`)}<div class="section-toolbar"><span class="section-summary">共 <strong>${state.data.warehouses.length}</strong> 个仓库，协同管理每一份库存</span>${searchInput('搜索仓库名称、编号…')}</div><section class="warehouse-grid">${list.map((warehouse, index) => {
    const stocks = state.data.stocks.filter((stock) => stock.warehouse_id === warehouse.id);
    const manager = adminById(warehouse.manager_id);
    return `<article class="warehouse-card panel"><div class="warehouse-card-top"><span class="warehouse-card-icon ${['purple', 'blue', 'orange'][index % 3]}">${icon('warehouse')}</span><span class="status-badge exists"><i></i>使用中</span></div><h2>${escapeHtml(warehouse.name)}</h2><span class="warehouse-code">${escapeHtml(warehouse.code)}</span><p class="warehouse-address">${icon('pin')}${escapeHtml(warehouse.address || '尚未填写仓库地址')}</p><div class="warehouse-card-stats"><div><strong>${stocks.filter((stock) => stock.quantity > 0).length}<small>种</small></strong><span>在库物品</span></div><div><strong>${number(stocks.reduce((sum, stock) => sum + stock.quantity, 0))}<small>件</small></strong><span>库存总量</span></div></div><div class="warehouse-card-bottom"><div>${avatar(manager, 'small')}<span>${escapeHtml(manager?.name)}<small>仓库负责人</small></span></div><button class="text-link" data-warehouse="${escapeHtml(warehouse.id)}">查看库存 ${icon('arrowRight')}</button></div></article>`;
  }).join('')}</section>${!list.length ? emptyState('没有找到仓库', '换个名称或编号试试。', 'reset-filters', '清空搜索') : ''}`;
}

function admins() {
  const list = state.data.admins.filter((admin) => !state.search || `${admin.name} ${admin.role} ${admin.phone}`.includes(state.search));
  return `${pageHeader('管理员', '明确每一份责任，让协作有序发生。', `<button class="button primary" data-action="new-admin">${icon('plus')}添加管理员</button>`)}<div class="section-toolbar"><span class="section-summary">共 <strong>${state.data.admins.length}</strong> 位成员 · 当前操作人：${escapeHtml(currentAdmin()?.name)}</span>${searchInput('搜索姓名、职务、联系方式…')}</div><section class="admin-grid">${list.map((admin) => {
    const assigned = state.data.warehouses.filter((warehouse) => warehouse.manager_id === admin.id);
    return `<article class="admin-card panel"><div class="admin-card-heading">${avatar(admin, 'large')}${admin.id === state.adminId ? '<span class="current-label">当前操作人</span>' : ''}</div><h2>${escapeHtml(admin.name)}</h2><p class="admin-role">${icon('shield')}${escapeHtml(admin.role)}</p><div class="admin-contact">${icon('phone')} ${escapeHtml(admin.phone || '未填写联系方式')}</div><div class="admin-warehouses"><span>负责仓库</span><div>${assigned.length ? assigned.map((warehouse) => `<button class="warehouse-tag" data-warehouse="${escapeHtml(warehouse.id)}">${icon('warehouse')}${escapeHtml(warehouse.name)}</button>`).join('') : '<span class="muted">暂未分配仓库</span>'}</div></div><div class="admin-card-footer"><span>已完成 <strong>${state.data.operations.filter((operation) => operation.admin_id === admin.id).length}</strong> 次操作</span><button class="text-link" data-action="choose-admin" data-id="${escapeHtml(admin.id)}" ${admin.id === state.adminId ? 'disabled' : ''}>切换为此操作人 ${icon('arrowRight')}</button></div></article>`;
  }).join('')}</section>${!list.length ? emptyState('没有找到管理员', '试试搜索其他姓名或联系方式。', 'reset-filters', '清空搜索') : ''}<p class="page-hint">${icon('help')}操作人用于记录实际经办成员；当前本地版不包含账号登录和权限隔离。</p>`;
}

const operationLabel = (kind) => ({ in: '加入', consume: '消耗', transfer: '调拨' }[kind]);
const operationIcon = (kind) => ({ in: 'arrowDown', consume: 'arrowUp', transfer: 'transfer' }[kind]);

function records() {
  const operations = getRecords();
  const pages = Math.max(1, Math.ceil(operations.length / state.pageSize));
  state.page = Math.min(state.page, pages);
  return `${pageHeader('操作记录', '从哪里来，到哪里去。每一次操作，都有据可查。', `<button class="button secondary" data-action="refresh">${icon('history')}刷新记录</button><button class="button primary" data-action="export">${icon('download')}导出记录</button>`)}<section class="panel records-panel"><div class="panel-heading"><div class="panel-title"><h2>物品流转记录</h2><span class="count-label">${operations.length} 条</span></div><span class="immutable-label">${icon('shield')}操作记录自动留存</span></div><div class="table-toolbar">${searchInput('搜索物品、操作人、备注…')}<div class="toolbar-right">${warehouseSelect()}<select id="record-kind" aria-label="操作类型"><option value="all">全部操作</option>${['in', 'consume', 'transfer'].map((kind) => `<option value="${kind}" ${state.recordKind === kind ? 'selected' : ''}>${operationLabel(kind)}</option>`).join('')}</select><select id="record-days" aria-label="记录时间范围">${[['all', '全部时间'], ['7', '最近 7 天'], ['30', '最近 30 天']].map(([value, label]) => `<option value="${value}" ${state.recordDays === value ? 'selected' : ''}>${label}</option>`).join('')}</select></div></div><div class="table-scroll"><table class="record-table"><thead><tr><th>操作类型</th><th>物品信息</th><th>数量</th><th>仓库 / 流向</th><th>操作人</th><th>操作时间</th><th>详情</th></tr></thead><tbody>${operations.slice((state.page - 1) * state.pageSize, state.page * state.pageSize).map((operation) => `<tr><td><span class="operation-badge ${operation.kind}">${icon(operationIcon(operation.kind))}${operationLabel(operation.kind)}</span></td><td><div class="record-item">${escapeHtml(operation.item_name)}<small>${escapeHtml(operation.sku)}</small></div></td><td><strong class="operation-quantity ${operation.kind}">${operation.kind === 'in' ? '+' : operation.kind === 'consume' ? '−' : ''}${number(operation.quantity)}</strong> <span class="unit">${escapeHtml(operation.unit)}</span></td><td><div class="record-flow">${escapeHtml(operation.warehouse_name)}${operation.target_name ? `${icon('arrowRight')}${escapeHtml(operation.target_name)}` : ''}</div><small class="record-note">${escapeHtml(operation.note || operation.origin || '—')}</small></td><td><span class="operator-cell">${avatar(adminById(operation.admin_id), 'small')}${escapeHtml(operation.admin_name)}</span></td><td class="date-cell">${formatDate(operation.created_at)}</td><td><button class="text-link" data-action="record-detail" data-id="${escapeHtml(operation.id)}">查看</button></td></tr>`).join('')}</tbody></table>${!operations.length ? emptyState('暂无符合条件的记录', '调整筛选条件，或完成一次物品操作。', 'reset-filters', '重置筛选') : ''}</div>${pagination(operations.length, pages)}</section>`;
}

function overview() {
  const operations = state.data.operations;
  const todayDate = new Date().toLocaleDateString('en-CA');
  const daily = operations.filter((operation) => new Date(operation.created_at).toLocaleDateString('en-CA') === todayDate);
  const maxQuantity = Math.max(1, ...state.data.warehouses.map((warehouse) => state.data.stocks.filter((stock) => stock.warehouse_id === warehouse.id).reduce((sum, stock) => sum + stock.quantity, 0)));
  return `${pageHeader('每一份库存，都心中有数。', `你好，${escapeHtml(currentAdmin()?.name)}。这里是你的仓储工作台。`, `<button class="button secondary" data-action="export">${icon('download')}导出库存</button><button class="button primary" data-action="operation" data-kind="in">${icon('plus')}加入物品</button>`)}${metrics()}<div class="overview-grid"><section class="panel distribution-panel"><div class="panel-heading"><div class="panel-title"><h2>仓库库存分布</h2></div><span class="muted">实时库存</span></div><div class="distribution-list">${state.data.warehouses.map((warehouse, index) => {
    const quantity = state.data.stocks.filter((stock) => stock.warehouse_id === warehouse.id).reduce((sum, stock) => sum + stock.quantity, 0);
    return `<button class="distribution-row" data-warehouse="${escapeHtml(warehouse.id)}"><div><span>${escapeHtml(warehouse.name)}</span><strong>${number(quantity)}<small>件</small></strong></div><span class="distribution-track"><span class="bar-${index % 3}" style="width:${Math.max(2, quantity / maxQuantity * 100)}%"></span></span></button>`;
  }).join('')}</div><div class="distribution-footer">${icon('warehouse')} ${state.data.warehouses.length} 个仓库 · 数据随每次操作实时更新</div></section><section class="panel today-panel"><div class="panel-heading"><div class="panel-title"><h2>今日流转</h2></div><span class="count-label">${daily.length} 次操作</span></div><div class="today-stats">${['in', 'consume', 'transfer'].map((kind) => `<div><span class="operation-icon ${kind}">${icon(operationIcon(kind))}</span><strong>${number(daily.filter((operation) => operation.kind === kind).reduce((sum, operation) => sum + operation.quantity, 0))}</strong><span>${operationLabel(kind)}数量</span></div>`).join('')}</div><button class="text-link today-link" data-view="records">查看完整操作记录 ${icon('arrowRight')}</button></section></div><section class="panel recent-panel"><div class="panel-heading"><div class="panel-title"><h2>最近动态</h2><span class="subtle-label">每一次流转，都有迹可循</span></div><button class="text-link" data-view="records">查看全部 ${icon('arrowRight')}</button></div><div class="activity-list">${operations.slice(0, 5).map((operation) => `<button class="activity-row" data-action="record-detail" data-id="${escapeHtml(operation.id)}"><span class="operation-icon ${operation.kind}">${icon(operationIcon(operation.kind))}</span><div><p><strong>${escapeHtml(operation.admin_name)}</strong> ${operationLabel(operation.kind)}了 <strong>${escapeHtml(operation.item_name)}</strong> <span>${operation.quantity} ${escapeHtml(operation.unit)}</span></p><small>${escapeHtml(operation.warehouse_name)}${operation.target_name ? ` → ${escapeHtml(operation.target_name)}` : ''} · ${escapeHtml(operation.note || operation.origin)}</small></div><time>${formatDate(operation.created_at)}</time>${icon('chevron')}</button>`).join('') || emptyState('还没有操作动态', '加入你的第一件物品，开始记录。')}</div></section>`;
}

function renderMain(preserveSearch = false) {
  const content = document.querySelector('#main-content');
  if (!content) return;
  const focused = preserveSearch && document.activeElement?.id === 'search-input';
  const selection = focused ? document.activeElement.selectionStart : null;
  content.innerHTML = ({ inventory, warehouses, records, admins, overview }[state.view])();
  if (focused) {
    const search = document.querySelector('#search-input');
    search?.focus({ preventScroll: true });
    search?.setSelectionRange(selection, selection);
  }
}

function navigate(view, warehouse) {
  state.view = view;
  state.search = '';
  state.page = 1;
  state.selected.clear();
  state.mobileNav = false;
  if (warehouse) state.warehouse = warehouse;
  else if (view !== 'inventory' && view !== 'records') state.warehouse = 'all';
  if (location.hash !== `#${view}`) history.replaceState(null, '', `#${view}`);
  shell();
}

function openModal(title, description, content, size = '') {
  modal.className = size;
  modal.innerHTML = `<div class="modal-heading"><div><h2 id="modal-title">${title}</h2><p>${description}</p></div><button class="icon-button" data-action="close-modal" aria-label="关闭">${icon('close')}</button></div>${content}`;
  if (!modal.open) modal.showModal();
}

function formFooter(label = '保存', extra = '') {
  return `<div id="form-error" class="form-error" role="alert" hidden></div><div class="modal-footer">${extra}<button class="button secondary" type="button" data-action="close-modal">取消</button><button class="button primary" type="submit">${icon('check')}${label}</button></div>`;
}

function warehouseOptions(selected, exclude = '') {
  return state.data.warehouses.filter((warehouse) => warehouse.id !== exclude).map((warehouse) => `<option value="${escapeHtml(warehouse.id)}" ${warehouse.id === selected ? 'selected' : ''}>${escapeHtml(warehouse.name)}</option>`).join('');
}

function showOperation(kind = 'in', itemId = '') {
  if (!state.data.items.length || !state.data.warehouses.length) {
    toast(!state.data.items.length ? '请先新建物品档案' : '请先新建仓库', 'info');
    return !state.data.items.length ? showItemForm(kind) : showWarehouseForm();
  }
  const selectedItem = itemId || getItems()[0]?.id || state.data.items[0].id;
  const warehouse = state.warehouse !== 'all' ? state.warehouse : kind === 'in' ? state.data.warehouses[0].id : state.data.stocks.find((stock) => stock.item_id === selectedItem && stock.quantity > 0)?.warehouse_id || state.data.warehouses[0].id;
  const descriptions = { in: '记录物品来源与数量，库存将自动增加。', consume: '记录领用、使用或损耗，库存将自动扣减。', transfer: '将物品从一个仓库移至另一个仓库，两边库存同步更新。' };
  openModal(`${operationLabel(kind)}物品`, descriptions[kind], `<div class="operation-switch" role="tablist" aria-label="操作类型">${['in', 'consume', 'transfer'].map((type) => `<button role="tab" aria-selected="${kind === type}" class="${kind === type ? 'active' : ''}" data-action="operation" data-kind="${type}" data-item="${escapeHtml(selectedItem)}">${icon(operationIcon(type))}${operationLabel(type)}</button>`).join('')}</div><form data-form="operation" data-kind="${kind}"><div class="modal-body"><div class="field"><div class="field-label"><label for="op-item">物品 <em>*</em></label><button type="button" class="text-link" data-action="new-item" data-return="${kind}">${icon('plus')}新建物品</button></div><select id="op-item" name="itemId" required>${state.data.items.map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === selectedItem ? 'selected' : ''}>${escapeHtml(item.name)} · ${escapeHtml(item.sku)}</option>`).join('')}</select></div><div class="field-grid"><div class="field"><label for="op-warehouse">${kind === 'transfer' ? '来源仓库' : '仓库'} <em>*</em></label><select id="op-warehouse" name="warehouseId" required>${warehouseOptions(warehouse)}</select></div><div class="field"><label for="op-quantity">${operationLabel(kind)}数量 <em>*</em></label><div class="quantity-input"><input id="op-quantity" name="quantity" type="number" min="1" max="1000000000" step="1" placeholder="请输入数量" required><span id="op-unit"></span></div></div></div>${kind === 'transfer' ? `<div class="field"><label for="op-target">目标仓库 <em>*</em></label><select id="op-target" name="targetId" required>${warehouseOptions('', warehouse)}</select></div>` : ''}<div id="stock-preview" class="stock-preview"></div>${kind === 'in' ? '<div class="field"><label for="op-origin">生产地 / 来源 <em>*</em></label><input id="op-origin" name="origin" maxlength="200" placeholder="例如：杭州优品制造厂、采购供应商" required></div>' : ''}<div class="field"><label for="op-note">${kind === 'consume' ? '消耗备注 <em>*</em>' : '备注 <span class="optional">选填</span>'}</label><textarea id="op-note" name="note" rows="3" maxlength="1000" placeholder="${kind === 'consume' ? '请说明消耗用途，例如：生产领用、日常使用…' : kind === 'transfer' ? '例如：分仓补货、仓库间物资调配…' : '可补充批次、入库说明等信息…'}" ${kind === 'consume' ? 'required' : ''}></textarea></div><div class="form-operator">${avatar(currentAdmin(), 'small')}<span>操作人：${escapeHtml(currentAdmin()?.name)}</span><span>本次操作将自动留存记录</span></div></div>${formFooter(`确认${operationLabel(kind)}`)}</form>`);
  updateStockPreview();
}

function updateStockPreview() {
  const form = modal.querySelector('[data-form="operation"]');
  if (!form) return;
  const item = state.data.items.find((entry) => entry.id === form.elements.itemId.value);
  const warehouseId = form.elements.warehouseId.value;
  const current = quantityFor(item.id, warehouseId);
  const quantity = Number(form.elements.quantity.value) || 0;
  const kind = form.dataset.kind;
  const next = current + (kind === 'in' ? quantity : -quantity);
  modal.querySelector('#op-unit').textContent = item.unit;
  modal.querySelector('#stock-preview').innerHTML = `${icon('box')}<span>当前库存 <strong>${number(current)} ${escapeHtml(item.unit)}</strong></span>${quantity ? `<span class="preview-arrow">${icon('arrowRight')}</span><span class="${next < 0 ? 'text-danger' : ''}">操作后 <strong>${number(next)} ${escapeHtml(item.unit)}</strong></span>` : ''}`;
  if (kind === 'transfer') {
    const target = form.elements.targetId;
    target.innerHTML = warehouseOptions(target.value);
    for (const option of target.options) option.disabled = option.value === warehouseId;
    if (target.value === warehouseId) target.value = [...target.options].find((option) => !option.disabled)?.value || '';
  }
}

function showItemForm(returnKind = '') {
  openModal('新建物品', '先建立物品档案，再通过「加入」录入库存。', `<form data-form="item" data-return="${escapeHtml(returnKind)}"><div class="modal-body"><div class="field"><label for="item-name">物品名称 <em>*</em></label><input id="item-name" name="name" maxlength="80" placeholder="例如：无线蓝牙键盘" required></div><div class="field"><label for="item-sku">物品编号 <em>*</em></label><input id="item-sku" name="sku" maxlength="40" pattern="(?:[A-Za-z0-9_]|-)+" placeholder="例如：EL-004" required><small>使用唯一编号，支持英文字母、数字、- 和 _</small></div><div class="field-grid"><div class="field"><label for="item-category">分类 <em>*</em></label><input id="item-category" name="category" list="category-options" maxlength="40" placeholder="选择或输入分类" required><datalist id="category-options">${categoryOptions().map((category) => `<option value="${escapeHtml(category)}"></option>`).join('')}</datalist></div><div class="field"><label for="item-unit">计量单位 <em>*</em></label><input id="item-unit" name="unit" maxlength="10" placeholder="例如：个、包、套" required></div></div><div class="field"><label for="item-threshold">库存预警线</label><input id="item-threshold" name="threshold" type="number" min="0" max="1000000000" step="1" value="10" required><small>库存大于 0 且不超过此数量时，显示库存偏低提醒。</small></div></div>${formFooter('创建物品')}</form>`);
}

function showWarehouseForm() {
  openModal('新建仓库', '添加一个仓库，并指定负责管理员。', `<form data-form="warehouse"><div class="modal-body"><div class="field"><label for="wh-name">仓库名称 <em>*</em></label><input id="wh-name" name="name" maxlength="60" placeholder="例如：北京分仓" required></div><div class="field"><label for="wh-code">仓库编号 <em>*</em></label><input id="wh-code" name="code" maxlength="20" pattern="(?:[A-Za-z0-9_]|-)+" placeholder="例如：BJ-004" required></div><div class="field"><label for="wh-address">仓库地址 <span class="optional">选填</span></label><input id="wh-address" name="address" maxlength="200" placeholder="填写仓库的实际地址"></div><div class="field"><label for="wh-manager">仓库负责人 <em>*</em></label><select id="wh-manager" name="managerId" required>${state.data.admins.map((admin) => `<option value="${escapeHtml(admin.id)}">${escapeHtml(admin.name)} · ${escapeHtml(admin.role)}</option>`).join('')}</select></div></div>${formFooter('创建仓库')}</form>`);
}

function showAdminForm() {
  openModal('添加管理员', '添加仓库协作成员，操作记录将保留经办人。', `<form data-form="admin"><div class="modal-body"><div class="field"><label for="admin-name">姓名 <em>*</em></label><input id="admin-name" name="name" maxlength="30" placeholder="请输入管理员姓名" required></div><div class="field"><label for="admin-role">职务 <em>*</em></label><select id="admin-role" name="role"><option>仓库管理员</option><option>系统管理员</option><option>仓库操作员</option></select></div><div class="field"><label for="admin-phone">联系方式 <span class="optional">选填</span></label><input id="admin-phone" name="phone" type="tel" maxlength="40" placeholder="请输入联系电话"></div><div class="info-note">${icon('help')}添加的成员可被指定为仓库负责人，或切换为当前操作人。</div></div>${formFooter('添加管理员')}</form>`);
}

function showItemDetail(itemId) {
  const item = state.data.items.find((entry) => entry.id === itemId);
  if (!item) return;
  const operations = state.data.operations.filter((operation) => operation.item_id === itemId).slice(0, 4);
  openModal('物品详情', '查看各仓库库存与最近流转。', `<div class="modal-body"><div class="detail-item"><span class="item-art large ${escapeHtml(item.color)}">${icon(item.icon)}</span><div><h3>${escapeHtml(item.name)}</h3><span>${escapeHtml(item.sku)} · ${escapeHtml(item.category)} · ${escapeHtml(item.unit)}</span></div><span class="status-badge ${quantityFor(itemId, 'all') > 0 ? 'exists' : 'missing'}"><i></i>${quantityFor(itemId, 'all') > 0 ? '存在' : '不存在'}</span></div><h4 class="detail-section-title">各仓库库存 <small>预警线 ${item.threshold} ${escapeHtml(item.unit)}</small></h4><div class="detail-stocks">${state.data.warehouses.map((warehouse) => `<div>${icon('warehouse')}<span>${escapeHtml(warehouse.name)}</span><strong>${number(quantityFor(itemId, warehouse.id))}<small>${escapeHtml(item.unit)}</small></strong></div>`).join('')}</div><h4 class="detail-section-title">最近操作</h4><div class="detail-history">${operations.map((operation) => `<button data-action="record-detail" data-id="${escapeHtml(operation.id)}"><span class="operation-badge ${operation.kind}">${operationLabel(operation.kind)}</span><span>${escapeHtml(operation.warehouse_name)}<small>${escapeHtml(operation.note || operation.origin)}</small></span><strong>${operation.quantity} ${escapeHtml(item.unit)}</strong><time>${formatDate(operation.created_at)}</time></button>`).join('') || '<p class="muted">尚无操作记录</p>'}</div></div><div class="modal-footer"><button class="button secondary" data-action="operation" data-kind="transfer" data-item="${escapeHtml(itemId)}">${icon('transfer')}调拨</button><button class="button secondary" data-action="operation" data-kind="consume" data-item="${escapeHtml(itemId)}" ${quantityFor(itemId, 'all') <= 0 ? 'disabled' : ''}>${icon('minus')}消耗</button><button class="button primary" data-action="operation" data-kind="in" data-item="${escapeHtml(itemId)}">${icon('plus')}加入物品</button></div>`);
}

function showRecordDetail(id) {
  const operation = state.data.operations.find((entry) => entry.id === id);
  if (!operation) return;
  openModal('操作详情', operation.reference, `<div class="modal-body"><div class="record-detail-banner ${operation.kind}"><span class="operation-icon ${operation.kind}">${icon(operationIcon(operation.kind))}</span><div><strong>${operationLabel(operation.kind)}完成</strong><p>${escapeHtml(operation.item_name)}</p></div><strong>${operation.kind === 'in' ? '+' : operation.kind === 'consume' ? '−' : ''}${number(operation.quantity)}<small>${escapeHtml(operation.unit)}</small></strong></div><dl class="detail-fields"><div><dt>物品编号</dt><dd>${escapeHtml(operation.sku)}</dd></div><div><dt>${operation.kind === 'transfer' ? '来源仓库' : '操作仓库'}</dt><dd>${escapeHtml(operation.warehouse_name)}</dd></div>${operation.target_name ? `<div><dt>目标仓库</dt><dd>${escapeHtml(operation.target_name)}</dd></div>` : ''}${operation.origin ? `<div><dt>生产地 / 来源</dt><dd>${escapeHtml(operation.origin)}</dd></div>` : ''}<div><dt>操作人</dt><dd>${escapeHtml(operation.admin_name)}</dd></div><div><dt>操作时间</dt><dd>${escapeHtml(new Date(operation.created_at).toLocaleString('zh-CN', { hour12: false }))}</dd></div><div><dt>备注</dt><dd class="preserve-lines">${escapeHtml(operation.note || '无备注')}</dd></div></dl><div class="info-note">${icon('shield')}操作记录已保存，可在操作记录页面导出。</div></div><div class="modal-footer"><button class="button primary" data-action="close-modal">完成</button></div>`);
}

function showAdminSwitch() {
  openModal('切换操作人', '后续物品操作将以选中的管理员身份记录。', `<div class="modal-body admin-switch-list">${state.data.admins.map((admin) => `<button data-action="choose-admin" data-id="${escapeHtml(admin.id)}">${avatar(admin)}<span>${escapeHtml(admin.name)}<small>${escapeHtml(admin.role)}</small></span>${state.adminId === admin.id ? icon('check') : icon('chevron')}</button>`).join('')}<div class="info-note">${icon('help')}当前为本地协作版，操作人选择不代表账号登录或权限验证。</div></div>`);
}

function showHelp() {
  openModal('欢迎使用库管', '让每一件物品的来去都有迹可循。', `<div class="modal-body help-content"><div><span class="metric-icon purple">${icon('box')}</span><section><h3>建立物品档案</h3><p>点击「新建物品」填写名称、唯一编号、分类与单位。新建档案初始库存为零，状态为「不存在」。</p></section></div><div><span class="metric-icon green">${icon('arrowDown')}</span><section><h3>加入与消耗</h3><p>「加入物品」记录数量、仓库和生产地 / 来源；「消耗」填写数量与用途备注。库存会自动计算，不能消耗超过现有库存的物品。</p></section></div><div><span class="metric-icon blue">${icon('transfer')}</span><section><h3>仓库间调拨</h3><p>选择来源仓库、目标仓库及数量。一次提交同时更新两边库存，并保留完整的调拨记录。</p></section></div><div><span class="metric-icon orange">${icon('history')}</span><section><h3>记录与数据</h3><p>每次库存操作都会保存操作人、时间、数量与备注，支持筛选和 CSV 导出。数据保存在本机 SQLite 数据库，关闭页面后仍保留。首次启动已加入演示物品，方便体验。</p></section></div><div class="info-note">${icon('users')}右上角可切换操作人。当前本地版不包含登录和角色权限隔离，所有成员均可进行库存操作。</div></div><div class="modal-footer"><button class="button primary" data-action="close-modal">开始使用 ${icon('arrowRight')}</button></div>`);
}

function exportCsv() {
  let rows;
  let filename;
  if (state.view === 'records') {
    rows = [['单据编号', '操作类型', '物品名称', '物品编号', '数量', '单位', '仓库', '目标仓库', '生产地/来源', '备注', '操作人', '操作时间'], ...getRecords().map((operation) => [operation.reference, operationLabel(operation.kind), operation.item_name, operation.sku, operation.quantity, operation.unit, operation.warehouse_name, operation.target_name || '', operation.origin, operation.note, operation.admin_name, new Date(operation.created_at).toLocaleString('zh-CN', { hour12: false })])];
    filename = '操作记录';
  } else {
    const items = getItems().filter((item) => !state.selected.size || state.selected.has(item.id));
    rows = [['物品名称', '物品编号', '分类', '仓库范围', '库存数量', '单位', '状态', '预警线'], ...items.map((item) => [item.name, item.sku, item.category, state.warehouse === 'all' ? '全部仓库' : warehouseById(state.warehouse)?.name, quantityFor(item.id), item.unit, quantityFor(item.id) > 0 ? '存在' : '不存在', item.threshold])];
    filename = '库存清单';
  }
  const csv = '\uFEFF' + rows.map((row) => row.map((value) => {
    const text = String(value ?? '');
    const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  }).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `库管-${filename}-${new Date().toLocaleDateString('en-CA')}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(`已导出 ${rows.length - 1} 条${filename}`);
}

function toast(message, type = 'success') {
  const element = document.createElement('div');
  element.className = `toast ${type}`;
  element.innerHTML = `${icon(type === 'error' ? 'alert' : type === 'info' ? 'help' : 'checkCircle')}<span>${escapeHtml(message)}</span>`;
  document.querySelector('#toast-region').append(element);
  setTimeout(() => element.remove(), 4200);
}

document.addEventListener('click', async (event) => {
  const target = event.target.closest('button, [data-action], [data-view], [data-warehouse], [data-page], [data-status]');
  if (!target || target.disabled) return;
  if (target.dataset.view) return navigate(target.dataset.view);
  if (target.dataset.warehouse) return navigate('inventory', target.dataset.warehouse);
  if (target.dataset.status) { state.status = target.dataset.status; state.page = 1; state.selected.clear(); return renderMain(); }
  if (target.dataset.page) { state.page = Math.max(1, Number(target.dataset.page)); return renderMain(); }
  const action = target.dataset.action;
  if (action === 'operation') return showOperation(target.dataset.kind, target.dataset.item);
  if (action === 'close-modal') return modal.close();
  if (action === 'new-item') return showItemForm(target.dataset.return);
  if (action === 'new-warehouse') return showWarehouseForm();
  if (action === 'new-admin') return showAdminForm();
  if (action === 'item-detail') return showItemDetail(target.dataset.id);
  if (action === 'record-detail') return showRecordDetail(target.dataset.id);
  if (action === 'switch-admin') return showAdminSwitch();
  if (action === 'help') return showHelp();
  if (action === 'choose-admin') {
    state.adminId = target.dataset.id;
    try { localStorage.setItem('kuguan-admin', state.adminId); } catch {}
    modal.close(); shell(); return toast(`已切换为 ${currentAdmin().name}`);
  }
  if (action === 'filters') { state.filters = !state.filters; return renderMain(); }
  if (action === 'sort') { state.sort = ['default', 'name', 'quantity'][(['default', 'name', 'quantity'].indexOf(state.sort) + 1) % 3]; state.page = 1; return renderMain(); }
  if (action === 'reset-filters') { state.search = ''; state.category = 'all'; state.status = 'all'; state.warehouse = 'all'; state.page = 1; state.recordKind = 'all'; state.recordDays = 'all'; state.sort = 'default'; state.selected.clear(); return shell(); }
  if (action === 'show-missing' || action === 'notifications') { state.status = action === 'show-missing' ? 'missing' : 'low'; return navigate('inventory'); }
  if (action === 'export') return exportCsv();
  if (action === 'menu') { state.mobileNav = !state.mobileNav; return shell(); }
  if (action === 'close-nav') { state.mobileNav = false; return shell(); }
  if (action === 'refresh') { try { await refresh(); shell(); toast('记录已更新'); } catch (error) { toast(error.message, 'error'); } }
});

document.addEventListener('input', (event) => {
  if (event.target.id === 'search-input' && !event.isComposing) { state.search = event.target.value; state.page = 1; state.selected.clear(); renderMain(true); }
  if (event.target.closest('[data-form="operation"]')) updateStockPreview();
});

document.addEventListener('change', (event) => {
  const target = event.target;
  if (target.closest('[data-form="operation"]')) updateStockPreview();
  if (target.id === 'warehouse-filter') { state.warehouse = target.value; state.selected.clear(); state.page = 1; return shell(); }
  if (target.id === 'category-filter') { state.category = target.value; state.page = 1; state.selected.clear(); return renderMain(); }
  if (target.id === 'sort-filter') { state.sort = target.value; state.page = 1; return renderMain(); }
  if (target.id === 'page-size') { state.pageSize = Number(target.value); state.page = 1; return renderMain(); }
  if (target.id === 'record-kind') { state.recordKind = target.value; state.page = 1; return renderMain(); }
  if (target.id === 'record-days') { state.recordDays = target.value; state.page = 1; return renderMain(); }
  if (target.dataset.select) { target.checked ? state.selected.add(target.dataset.select) : state.selected.delete(target.dataset.select); return renderMain(); }
  if (target.id === 'select-all') { getItems().slice((state.page - 1) * state.pageSize, state.page * state.pageSize).forEach((item) => target.checked ? state.selected.add(item.id) : state.selected.delete(item.id)); renderMain(); }
});

document.addEventListener('submit', async (event) => {
  const form = event.target.closest('[data-form]');
  if (!form) return;
  event.preventDefault();
  if (form.dataset.submitting) return;
  const payload = Object.fromEntries(new FormData(form));
  const type = form.dataset.form;
  if (type === 'operation') Object.assign(payload, { quantity: Number(payload.quantity), kind: form.dataset.kind, adminId: state.adminId });
  if (type === 'item') payload.threshold = Number(payload.threshold);
  const endpoint = { operation: 'operations', item: 'items', warehouse: 'warehouses', admin: 'admins' }[type];
  const submit = form.querySelector('[type="submit"]');
  const errorElement = form.querySelector('#form-error');
  errorElement.hidden = true;
  submit.disabled = true;
  form.dataset.submitting = 'true';
  try {
    const result = await api(`/api/${endpoint}`, payload);
    await refresh();
    modal.close();
    shell();
    toast({ operation: `${operationLabel(payload.kind)}成功，库存与记录已更新`, item: '物品档案已创建，可继续加入库存', warehouse: '仓库创建成功', admin: '管理员添加成功' }[type]);
    if (type === 'item' && form.dataset.return) showOperation(form.dataset.return, result.id);
  } catch (error) {
    errorElement.textContent = error.message;
    errorElement.hidden = false;
    errorElement.scrollIntoView({ block: 'nearest' });
  } finally {
    submit.disabled = false;
    delete form.dataset.submitting;
  }
});

modal.addEventListener('click', (event) => {
  if (event.target !== modal) return;
  const bounds = modal.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) modal.close();
});

document.addEventListener('keydown', (event) => {
  if (event.key === '/' && !modal.open && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
    event.preventDefault();
    document.querySelector('#search-input')?.focus();
  }
});

window.addEventListener('hashchange', () => {
  const view = location.hash.slice(1);
  if (viewNames[view]) navigate(view);
});

try {
  await refresh();
  if (viewNames[location.hash.slice(1)]) state.view = location.hash.slice(1);
  shell();
} catch (error) {
  app.innerHTML = `<div class="connection-error"><span class="boot-mark">${icon('warehouse')}</span><h1>暂时无法连接仓库</h1><p>${escapeHtml(error.message)}</p><p>请确认本地服务已启动，然后刷新页面。</p><button class="button primary" id="retry">重新连接</button></div>`;
  document.querySelector('#retry').addEventListener('click', () => location.reload());
}

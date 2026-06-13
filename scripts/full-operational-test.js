const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const BASE_URL = (process.env.OPERATIONAL_TEST_BASE_URL || 'https://2b-tex-railway-startjs.up.railway.app').replace(/\/$/, '');
const API_URL = `${BASE_URL}/api`;
const username = process.env.SYSTEM_USER || '';
const password = process.env.SYSTEM_PASS || '';

if (!username || !password) {
  console.error('SYSTEM_USER and SYSTEM_PASS are required to run the full operational test.');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const stamp = Date.now().toString(36);
const orderNo = `تيست-${stamp}`;
const customerName = `تيست كودكس ${stamp}`;
const ids = {
  customer: `customer-test-${stamp}`,
  pricing: `pricing-test-${stamp}`,
  orderA: `order-test-${stamp}-a`,
  orderB: `order-test-${stamp}-b`,
  allocA1: `alloc-test-${stamp}-a1`,
  allocA2: `alloc-test-${stamp}-a2`,
  allocB1: `alloc-test-${stamp}-b1`,
  widthA1: `width-test-${stamp}-30`,
  widthA2: `width-test-${stamp}-32`,
};

let cookie = '';

function fail(label, extra = null) {
  console.error(JSON.stringify({ ok: false, label, extra }, null, 2));
  process.exit(1);
}

function assert(condition, label, extra = null) {
  if (!condition) fail(label, extra);
}

async function api(method, route, body) {
  const response = await fetch(`${API_URL}${route}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) fail(`HTTP ${response.status} ${method} ${route}`, data);
  return data;
}

function sum(rows, key = 'quantity') {
  return rows.reduce((total, row) => total + Number(row?.[key] || 0), 0);
}

function roundNumber(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function parseArray(value) {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapOrder(row, customers) {
  const widthMode = row.width_mode || 'single';
  return {
    id: row.id,
    orderNumber: row.order_number || '',
    pricingId: row.pricing_id || '',
    customer: customers.find((item) => item.id === row.customer_id)?.name || '',
    orderDate: row.order_date || '',
    productCode: row.product_code || '',
    fabricType: row.fabric_type || '',
    totalRawQuantity: Number(row.total_raw_quantity || 0),
    expectedWastePercent: Number(row.expected_waste_percent || 0),
    widthMode,
    widthLines: widthMode === 'multiple' ? parseArray(row.width_lines_json) : [],
    inchWidth: row.inch_width || '',
    kiloPrice: Number(row.kilo_price || 0),
    rawCost: Number(row.raw_cost || 0),
    paymentTerms: row.payment_terms || '',
    accessoryType: row.accessory_type || '',
    accessoryPercent: Number(row.accessory_percent || 0),
    accessoryLines: parseArray(row.accessory_lines_json),
    dyehouse: row.dyehouse || '',
    weavingSource: row.weaving_source || '',
    notes: row.notes || '',
    status: row.status || 'pending',
    operationClosed: !!row.is_closed,
  };
}

function mapAllocation(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    color: row.color || '',
    pantoneCode: row.pantone_code || '',
    plannedQuantity: Number(row.planned_quantity || 0),
    dyehouse: row.dyehouse || '',
    widthLineId: row.width_line_id || '',
    rawInch: row.raw_inch || '',
    rawWidth: row.raw_width || '',
    targetFinishedWidth: row.finished_width || '',
    targetFinishedWeight: row.finished_weight || '',
    accessoryQuantityManual: row.accessory_quantity_manual ?? null,
    notes: row.notes || '',
  };
}

function mapBatch(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    allocationId: row.allocation_id,
    date: row.batch_date || row.transfer_date || '',
    quantity: Number(row.quantity || 0),
    supplier: row.supplier || '',
    dyehouse: row.dyehouse || '',
    widthLineId: row.width_line_id || '',
    noteNumber: row.note_number || '',
    notes: row.notes || row.reason || '',
    finishedWidth: row.finished_width || '',
    finishedWeight: row.finished_weight || '',
    accessoryType: row.accessory_type || '',
    movement: row.movement || '',
  };
}

function mapTransfer(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    allocationId: row.from_allocation_id,
    newAllocationId: row.to_allocation_id,
    fromDyehouse: row.from_dyehouse || '',
    toDyehouse: row.to_dyehouse || '',
    quantity: Number(row.quantity || 0),
    date: row.transfer_date || '',
    transferDate: row.transfer_date || '',
    noteNumber: row.note_number || '',
    reason: row.notes || '',
  };
}

function createFrontendDomain(state) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(process.cwd(), 'orders.js'), 'utf8'), sandbox, { filename: 'orders.js' });
  return sandbox.window.TwoBTexOrders.createOrderDomain({
    buildItemCode: (value) => `2B-${value || ''}`,
    orderRawCost: () => 0,
    roundNumber,
    sum,
    uid: () => `runtime-${Math.random().toString(16).slice(2)}`,
    getState: () => state,
  });
}

function createDocumentBuilders() {
  const sandbox = { window: {}, Date };
  vm.runInNewContext(fs.readFileSync(path.join(process.cwd(), 'documents.js'), 'utf8'), sandbox, { filename: 'documents.js' });
  return sandbox.window.TwoBTexDocuments.createBuilders({
    documentFooter: () => '',
    documentHeader: () => '',
    documentLogo: () => '',
    emptyRow: (cols, text) => `<tr><td colspan="${cols}">${text}</td></tr>`,
    escapeHtml: (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch])),
    formatNumber: (value, digits = 3) => Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: digits }),
    orderRawCost: () => 0,
    rawPermitImagesSection: () => '',
    reportOperationNotes: (order) => order?.notes || '',
    uniqueNonEmpty: (items) => [...new Set((items || []).map((item) => String(item || '').trim()).filter(Boolean))],
    sum,
    roundNumber,
    stockFlowText: () => '-',
  });
}

async function login() {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) fail('login-failed', await response.json().catch(() => ({})));
  cookie = (response.headers.get('set-cookie') || '').split(';')[0];
  assert(cookie, 'session-cookie-missing');
}

async function seedOperationalCycle() {
  await api('POST', '/customers', { id: ids.customer, name: customerName, notes: 'عميل اختبار كودكس لتشغيل دورة كاملة' });
  await api('POST', '/pricings', {
    id: ids.pricing,
    pricing_number: `${orderNo}-Q`,
    customer_id: ids.customer,
    pricing_date: today,
    fabric_type: 'قماش تيست سنجل 30/32',
    material_type: 'قطن',
    dyehouse: 'جيما',
    color_class: 'ألوان اختبار',
    quantity: 500,
    inch_width: 30,
    finished_weight: 180,
    raw_cost: 80,
    dye_cost: 30,
    waste_percent: 8,
    extra_cost: 5,
    profit_per_kg: 25,
    unit_price: 140,
    total_price: 70000,
    payment_terms: 'كاش',
    notes: 'عرض سعر اختبار لاختبار توليد المستندات والقيمة غير صفر',
    status: 'converted',
  });
  const widthLines = [
    { id: ids.widthA1, inch: 30, width: 30, quantity: 300 },
    { id: ids.widthA2, inch: 32, width: 32, quantity: 200 },
  ];
  await api('POST', '/orders', {
    id: ids.orderA,
    order_number: orderNo,
    pricing_id: ids.pricing,
    customer_id: ids.customer,
    order_date: today,
    product_code: `2B-${orderNo}-A`,
    fabric_type: 'قماش تيست سنجل 30/32',
    total_raw_quantity: 500,
    expected_waste_percent: 8,
    width_mode: 'multiple',
    width_lines_json: JSON.stringify(widthLines),
    inch_width: 30,
    kilo_price: 140,
    raw_cost: 80,
    payment_terms: 'كاش',
    accessory_type: 'ريب',
    accessory_percent: 0,
    accessory_lines_json: JSON.stringify([
      { id: `acc-${stamp}-rib`, type: 'ريب', percent: 0, quantityManual: 50 },
      { id: `acc-${stamp}-cuff`, type: 'أساور', percent: 0, quantityManual: 25 },
    ]),
    dyehouse: 'جيما',
    weaving_source: 'قسم النسيج تيست',
    notes: 'اختبار كامل: تسعير، أمر نسيج، صباغة، مرتجع خام، مخزن، تسليم، هالك.',
    status: 'in-progress',
    is_closed: 0,
  });
  await api('POST', '/orders', {
    id: ids.orderB,
    order_number: orderNo,
    customer_id: ids.customer,
    order_date: today,
    product_code: `2B-${orderNo}-B`,
    fabric_type: 'قماش تيست إنترلوك عرض إضافي',
    total_raw_quantity: 120,
    expected_waste_percent: 5,
    width_mode: 'single',
    inch_width: 34,
    kilo_price: 155,
    raw_cost: 90,
    payment_terms: 'كاش',
    dyehouse: 'السلام',
    weaving_source: 'قسم النسيج تيست',
    notes: 'الصنف الثاني لنفس رقم الطلب لاختبار الطلب المجمع بدون عرض سعر إضافي.',
    status: 'in-progress',
    is_closed: 0,
  });
  await api('POST', `/orders/${ids.orderA}/allocations`, { id: ids.allocA1, color: 'أحمر تيست', planned_quantity: 300, dyehouse: 'جيما', width_line_id: ids.widthA1, raw_inch: 30, raw_width: 30, finished_width: 30, finished_weight: 180, accessory_quantity_manual: 45, notes: 'لون اختبار 1' });
  await api('POST', `/orders/${ids.orderA}/allocations`, { id: ids.allocA2, color: 'أزرق تيست', planned_quantity: 200, dyehouse: 'جيما', width_line_id: ids.widthA2, raw_inch: 32, raw_width: 32, finished_width: 32, finished_weight: 185, accessory_quantity_manual: 30, notes: 'لون اختبار 2' });
  await api('POST', `/orders/${ids.orderB}/allocations`, { id: ids.allocB1, color: 'أسود تيست', planned_quantity: 120, dyehouse: 'السلام', raw_inch: 34, raw_width: 34, finished_width: 34, finished_weight: 190, notes: 'صنف ثاني لنفس الطلب' });
  await api('POST', '/batches/bulk', { items: [
    { type: 'raw', data: { id: `rawrecv-${stamp}-1`, order_id: ids.orderA, allocation_id: ids.allocA1, batch_date: today, quantity: 300, supplier: 'قسم النسيج تيست', note_number: `NR-${stamp}-1`, notes: 'استلام خام من النسيج' } },
    { type: 'raw', data: { id: `rawrecv-${stamp}-2`, order_id: ids.orderA, allocation_id: ids.allocA2, batch_date: today, quantity: 200, supplier: 'قسم النسيج تيست', note_number: `NR-${stamp}-2`, notes: 'استلام خام من النسيج' } },
    { type: 'dyehouse', data: { id: `dye-${stamp}-1`, order_id: ids.orderA, allocation_id: ids.allocA1, batch_date: today, quantity: 300, dyehouse: 'جيما', width_line_id: ids.widthA1, note_number: `ND-${stamp}-1`, notes: 'إرسال للمصبغة' } },
    { type: 'dyehouse', data: { id: `dye-${stamp}-2`, order_id: ids.orderA, allocation_id: ids.allocA2, batch_date: today, quantity: 200, dyehouse: 'جيما', width_line_id: ids.widthA2, note_number: `ND-${stamp}-2`, notes: 'إرسال للمصبغة' } },
    { type: 'rawReturn', data: { id: `return-${stamp}-1`, order_id: ids.orderA, allocation_id: ids.allocA2, batch_date: today, quantity: 20, reason: 'مرتجع خام اختبار من المصبغة', note_number: `RR-${stamp}-1`, notes: 'مرتجع خام' } },
    { type: 'finished', data: { id: `fin-${stamp}-1`, order_id: ids.orderA, allocation_id: ids.allocA1, batch_date: today, quantity: 280, finished_width: 30, finished_weight: 180, note_number: `FR-${stamp}-1`, notes: 'استلام مجهز' } },
    { type: 'finished', data: { id: `fin-${stamp}-2`, order_id: ids.orderA, allocation_id: ids.allocA2, batch_date: today, quantity: 170, finished_width: 32, finished_weight: 185, note_number: `FR-${stamp}-2`, notes: 'استلام مجهز' } },
    { type: 'customer', data: { id: `cust-${stamp}-1`, order_id: ids.orderA, allocation_id: ids.allocA1, batch_date: today, quantity: 260, notes: 'تسليم عميل 1' } },
    { type: 'customer', data: { id: `cust-${stamp}-2`, order_id: ids.orderA, allocation_id: ids.allocA2, batch_date: today, quantity: 160, notes: 'تسليم عميل 2' } },
    { type: 'accessory', data: { id: `accbatch-${stamp}-1`, order_id: ids.orderA, allocation_id: ids.allocA1, batch_date: today, accessory_type: 'ريب', quantity: 45, note_number: `AC-${stamp}-1`, movement: 'sent', notes: 'إكسسوار تحت القماش' } },
    { type: 'accessory', data: { id: `accbatch-${stamp}-2`, order_id: ids.orderA, allocation_id: ids.allocA2, batch_date: today, accessory_type: 'أساور', quantity: 30, note_number: `AC-${stamp}-2`, movement: 'sent', notes: 'إكسسوار تحت القماش' } },
  ] });
  await api('POST', '/transfers', { id: `transfer-${stamp}-1`, order_id: ids.orderA, from_allocation_id: ids.allocA1, to_allocation_id: ids.allocA2, from_dyehouse: 'جيما', to_dyehouse: 'السلام', quantity: 50, transfer_date: today, note_number: `TR-${stamp}-1`, notes: 'تحويل مصبغة اختبار' });
  await api('PUT', `/orders/${ids.orderA}`, { status: 'closed', is_closed: 1 });
}

async function verifyOperationalCycle() {
  const bootstrap = await api('GET', '/bootstrap');
  const customers = bootstrap.customers || [];
  const state = {
    orders: (bootstrap.orders || []).map((row) => mapOrder(row, customers)),
    allocations: (bootstrap.allocations || []).map(mapAllocation),
    rawBatches: (bootstrap.dyehouseDeliveryBatches || []).map(mapBatch),
    productionBatches: (bootstrap.finishedReceivingBatches || []).map(mapBatch),
    customerBatches: (bootstrap.customerDeliveryBatches || []).map(mapBatch),
    rawReturns: (bootstrap.rawReturns || []).map(mapBatch),
    gluingBatches: (bootstrap.gluingBatches || []).map(mapBatch),
    accessoryBatches: (bootstrap.accessoryBatches || []).map(mapBatch),
    dyehouseTransfers: (bootstrap.dyehouseTransfers || []).map(mapTransfer),
  };
  const domain = createFrontendDomain(state);
  const order = domain.calculateOrder(state.orders.find((item) => item.id === ids.orderA));
  order.rawBatches = state.rawBatches.filter((row) => row.orderId === order.id);
  order.productionBatches = state.productionBatches.filter((row) => row.orderId === order.id);
  order.customerBatches = state.customerBatches.filter((row) => row.orderId === order.id);
  order.rawReturns = state.rawReturns.filter((row) => row.orderId === order.id);
  order.accessoryBatches = state.accessoryBatches.filter((row) => row.orderId === order.id);
  order.dyehouseTransfers = state.dyehouseTransfers.filter((row) => row.orderId === order.id);
  const grouped = state.orders.filter((item) => item.orderNumber === order.orderNumber);
  assert(grouped.length === 2, 'grouped-order-two-items', { count: grouped.length });
  assert(order.totalSentToDyehouse === 500, 'frontend-sent', { value: order.totalSentToDyehouse });
  assert(order.totalFinishedReceived === 450, 'frontend-finished', { value: order.totalFinishedReceived });
  assert(order.totalDeliveredToCustomer === 420, 'frontend-delivered', { value: order.totalDeliveredToCustomer });
  assert(order.warehouseBalance === 30, 'frontend-warehouse', { value: order.warehouseBalance });
  assert(order.totalRawReturnedToWeaving === 20, 'frontend-raw-return', { value: order.totalRawReturnedToWeaving });
  assert(order.totalWaste === 30, 'frontend-waste', { value: order.totalWaste });
  assert(order.remainingAtDyehouse === 0, 'frontend-dyehouse-closed', { value: order.remainingAtDyehouse });
  assert(order.accessoryRequired === 75 && order.accessorySent === 75, 'frontend-accessory', { required: order.accessoryRequired, sent: order.accessorySent });
  const summary = await api('GET', `/orders/${ids.orderA}/summary`);
  assert(roundNumber(summary.totalSentToDyehouse) === 500 && roundNumber(summary.warehouseBalance) === 30 && roundNumber(summary.wasteQuantity) === 30, 'backend-summary', summary);
  const builders = createDocumentBuilders();
  const documents = {
    quotation: builders.buildQuotationDocument(order),
    weaving: builders.buildWeavingOrderDocument(order),
    dyeing: builders.buildDyeingOrderDocument(order, 'جيما'),
    full: builders.buildCompactFullReportDocument(order),
    waste: builders.buildWasteReportDocument(order),
    lab: builders.buildLabSamplesDocument(order),
    stickers: builders.buildStickersDocument(order),
  };
  assert(documents.quotation.length > 1000 && (documents.quotation.includes('70,000') || documents.quotation.includes('70000')), 'doc-quotation', { length: documents.quotation.length });
  assert(documents.weaving.length > 1000 && documents.weaving.includes(order.customer), 'doc-weaving', { length: documents.weaving.length });
  assert(documents.dyeing.length > 1000 && !documents.dyeing.includes(order.customer) && documents.dyeing.includes('500') && documents.dyeing.includes('ND-'), 'doc-dyeing', { length: documents.dyeing.length });
  assert(documents.full.length > 1000 && documents.full.includes(order.orderNumber), 'doc-full', { length: documents.full.length });
  assert(documents.waste.length > 1000 && documents.waste.includes(order.orderNumber), 'doc-waste', { length: documents.waste.length });
  assert(documents.lab.length > 500 && documents.lab.includes(order.orderNumber), 'doc-lab', { length: documents.lab.length });
  assert(documents.stickers.length > 500 && documents.stickers.includes(order.orderNumber), 'doc-stickers', { length: documents.stickers.length });
  return {
    orderNumber: order.orderNumber,
    customer: order.customer,
    groupedItems: grouped.map((item) => item.fabricType),
    frontend: {
      sent: order.totalSentToDyehouse,
      rawReturned: order.totalRawReturnedToWeaving,
      finished: order.totalFinishedReceived,
      delivered: order.totalDeliveredToCustomer,
      warehouse: order.warehouseBalance,
      waste: order.totalWaste,
      dyehouseRemaining: order.remainingAtDyehouse,
      accessoryRequired: order.accessoryRequired,
      accessorySent: order.accessorySent,
    },
    backend: {
      sent: roundNumber(summary.totalSentToDyehouse),
      warehouse: roundNumber(summary.warehouseBalance),
      waste: roundNumber(summary.wasteQuantity),
    },
    documents: Object.fromEntries(Object.entries(documents).map(([key, value]) => [key, value.length])),
  };
}

(async () => {
  await login();
  await seedOperationalCycle();
  const result = await verifyOperationalCycle();
  console.log(JSON.stringify({ ok: true, baseUrl: BASE_URL, ...result }, null, 2));
})().catch((error) => fail('unexpected-error', { message: error.message, stack: error.stack }));

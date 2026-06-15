const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { calculateOrderSummary } = require('../backend/calculations');

function roundNumber(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function sum(rows, key = 'quantity') {
  return rows.reduce((total, row) => total + Number(row?.[key] || 0), 0);
}

function createFrontendDomain(state) {
  const sandbox = { window: {} };
  const source = fs.readFileSync(path.join(__dirname, '..', 'orders.js'), 'utf8');
  vm.runInNewContext(source, sandbox, { filename: 'orders.js' });
  return sandbox.window.TwoBTexOrders.createOrderDomain({
    buildItemCode: (value) => `2B-${value || ''}`,
    orderRawCost: () => 0,
    roundNumber,
    sum,
    uid: () => `id-${Math.random().toString(16).slice(2)}`,
    getState: () => state,
  });
}

function createDocumentBuilders() {
  const sandbox = { window: {}, Date };
  const source = fs.readFileSync(path.join(__dirname, '..', 'documents.js'), 'utf8');
  vm.runInNewContext(source, sandbox, { filename: 'documents.js' });
  const formatNumber = (value, digits = 3) => Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: digits });
  const accessoryLineName = (line) => String(line?.type || 'إكسسوار').trim() || 'إكسسوار';
  const accessoryPlannedQuantityForLine = (order, allocation, line) => {
    const allocations = Array.isArray(order?.allocations) ? order.allocations : [];
    const totalPlanned = allocations.reduce((total, item) => total + Number(item.plannedQuantity || 0), 0);
    const manual = line?.quantityManual !== undefined && line?.quantityManual !== null && line?.quantityManual !== '';
    const quantity = manual && totalPlanned
      ? Number(line.quantityManual || 0) * Number(allocation?.plannedQuantity || 0) / totalPlanned
      : Number(allocation?.plannedQuantity || 0) * Number(line?.percent || 0) / 100;
    return roundNumber(quantity);
  };
  return sandbox.window.TwoBTexDocuments.createBuilders({
    documentFooter: () => '',
    documentHeader: () => '',
    documentLogo: () => '',
    emptyRow: (cols, text) => `<tr><td colspan="${cols}">${text}</td></tr>`,
    escapeHtml: (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch])),
    formatNumber,
    orderRawCost: () => 0,
    rawPermitImagesSection: () => '',
    reportOperationNotes: () => '',
    uniqueNonEmpty: (items) => [...new Set((items || []).map((item) => String(item || '').trim()).filter(Boolean))],
    sum,
    roundNumber,
    accessoryLineName,
    accessoryPlannedQuantityForLine,
    accessoryPlannedPartsForOrder: (order, allocation) => (order?.accessoryLines || []).map((line) => {
      const quantity = accessoryPlannedQuantityForLine(order, allocation, line);
      return quantity ? `${formatNumber(quantity)} ${accessoryLineName(line)}` : '';
    }).filter(Boolean),
    stockFlowText: (clothQuantity, accessoryParts = []) => {
      const parts = [];
      const hasAccessories = Array.isArray(accessoryParts) && accessoryParts.length > 0;
      if (Number(clothQuantity || 0)) parts.push(hasAccessories ? `${formatNumber(clothQuantity)} جسم` : formatNumber(clothQuantity));
      parts.push(...accessoryParts);
      return parts.length ? parts.join(' - ') : '-';
    },
  });
}

function assertClose(actual, expected, label) {
  assert.equal(roundNumber(actual), roundNumber(expected), label);
}

function backendSummary({ sent = 0, finished = 0, delivered = 0, closed = false, rawReceived = 0 }) {
  return calculateOrderSummary(
    {
      id: 'order-check',
      total_raw_quantity: 100,
      expected_waste_percent: 8,
      is_closed: closed ? 1 : 0,
    },
    {
      rawReceivingBatches: rawReceived ? [{ quantity: rawReceived }] : [],
      dyehouseDeliveryBatches: sent ? [{ quantity: sent }] : [],
      finishedReceivingBatches: finished ? [{ quantity: finished }] : [],
      customerDeliveryBatches: delivered ? [{ quantity: delivered }] : [],
      rawReturns: [],
      gluingBatches: [],
    }
  );
}

function frontendSummary({ sent = 0, finished = 0, delivered = 0, closed = false }) {
  const state = {
    orders: [{
      id: 'order-check',
      orderNumber: 'CHECK-1',
      totalRawQuantity: 100,
      expectedWastePercent: 8,
      operationClosed: closed,
      widthMode: 'single',
      inchWidth: 32,
    }],
    allocations: [{
      id: 'alloc-check',
      orderId: 'order-check',
      color: 'check color',
      plannedQuantity: 100,
      dyehouse: 'check dyehouse',
    }],
    rawBatches: sent ? [{ orderId: 'order-check', allocationId: 'alloc-check', quantity: sent }] : [],
    productionBatches: finished ? [{ orderId: 'order-check', allocationId: 'alloc-check', quantity: finished }] : [],
    customerBatches: delivered ? [{ orderId: 'order-check', allocationId: 'alloc-check', quantity: delivered }] : [],
    rawReturns: [],
    gluingBatches: [],
    dyehouseTransfers: [],
    accessoryBatches: [],
  };
  const domain = createFrontendDomain(state);
  return domain.calculateOrder(state.orders[0]);
}

function frontendMultiColorSummary() {
  const state = {
    orders: [{
      id: 'order-multi-check',
      orderNumber: 'CHECK-2',
      totalRawQuantity: 100,
      expectedWastePercent: 8,
      widthMode: 'single',
      inchWidth: 32,
    }],
    allocations: [
      { id: 'alloc-a', orderId: 'order-multi-check', color: 'A', plannedQuantity: 60, dyehouse: 'D' },
      { id: 'alloc-b', orderId: 'order-multi-check', color: 'B', plannedQuantity: 40, dyehouse: 'D' },
    ],
    rawBatches: [
      { orderId: 'order-multi-check', allocationId: 'alloc-a', quantity: 60 },
      { orderId: 'order-multi-check', allocationId: 'alloc-b', quantity: 40 },
    ],
    productionBatches: [
      { orderId: 'order-multi-check', allocationId: 'alloc-a', quantity: 55 },
      { orderId: 'order-multi-check', allocationId: 'alloc-b', quantity: 37 },
    ],
    customerBatches: [
      { orderId: 'order-multi-check', allocationId: 'alloc-a', quantity: 30 },
      { orderId: 'order-multi-check', allocationId: 'alloc-b', quantity: 20 },
    ],
    rawReturns: [],
    gluingBatches: [],
    dyehouseTransfers: [],
    accessoryBatches: [],
  };
  const domain = createFrontendDomain(state);
  return domain.calculateOrder(state.orders[0]);
}

function frontendOversentFinishedSummary() {
  const state = {
    orders: [{
      id: 'order-oversent-check',
      orderNumber: 'CHECK-3',
      totalRawQuantity: 1000,
      expectedWastePercent: 5,
      widthMode: 'single',
      inchWidth: 32,
    }],
    allocations: [{
      id: 'alloc-oversent',
      orderId: 'order-oversent-check',
      color: 'oversent',
      plannedQuantity: 1000,
      dyehouse: 'D',
    }],
    rawBatches: [{ orderId: 'order-oversent-check', allocationId: 'alloc-oversent', quantity: 1035.5 }],
    productionBatches: [{ orderId: 'order-oversent-check', allocationId: 'alloc-oversent', quantity: 1000 }],
    customerBatches: [],
    rawReturns: [],
    gluingBatches: [],
    dyehouseTransfers: [],
    accessoryBatches: [],
  };
  const domain = createFrontendDomain(state);
  return domain.calculateOrder(state.orders[0]);
}

function frontendAllocationLinkedRawDispatchSummary() {
  const state = {
    orders: [{
      id: 'order-allocation-linked-raw',
      orderNumber: 'CHECK-RAW-ALLOC',
      totalRawQuantity: 3000,
      expectedWastePercent: 0,
      widthMode: 'single',
      inchWidth: 32,
    }],
    allocations: [
      { id: 'alloc-black', orderId: 'order-allocation-linked-raw', color: 'أسود', plannedQuantity: 1500, dyehouse: 'السلام' },
      { id: 'alloc-white', orderId: 'order-allocation-linked-raw', color: 'أبيض', plannedQuantity: 1500, dyehouse: 'السلام' },
    ],
    rawBatches: [
      { orderId: 'order-allocation-linked-raw', allocationId: 'alloc-black', quantity: 1500 },
    ],
    productionBatches: [],
    customerBatches: [],
    rawReturns: [],
    gluingBatches: [],
    dyehouseTransfers: [],
    accessoryBatches: [],
  };
  const domain = createFrontendDomain(state);
  return domain.calculateOrder(state.orders[0]);
}

function frontendOrderLevelRawDispatchSummary() {
  const state = {
    orders: [{
      id: 'order-level-raw',
      orderNumber: 'CHECK-RAW-ORDER',
      totalRawQuantity: 3000,
      expectedWastePercent: 0,
      widthMode: 'single',
      inchWidth: 32,
    }],
    allocations: [
      { id: 'alloc-order-black', orderId: 'order-level-raw', color: 'أسود', plannedQuantity: 1500, dyehouse: 'السلام' },
      { id: 'alloc-order-white', orderId: 'order-level-raw', color: 'أبيض', plannedQuantity: 1500, dyehouse: 'السلام' },
    ],
    rawBatches: [
      { orderId: 'order-level-raw', allocationId: '', quantity: 3000, dyehouse: 'السلام' },
    ],
    productionBatches: [],
    customerBatches: [],
    rawReturns: [],
    gluingBatches: [],
    dyehouseTransfers: [],
    accessoryBatches: [],
  };
  const domain = createFrontendDomain(state);
  return domain.calculateOrder(state.orders[0]);
}

function frontendManualAccessorySummary() {
  const state = {
    orders: [{
      id: 'order-accessory-check',
      orderNumber: 'CHECK-4',
      totalRawQuantity: 700,
      expectedWastePercent: 5,
      widthMode: 'single',
      inchWidth: 32,
      accessoryLines: [{ id: 'acc-line', type: 'ريب', percent: 0, quantityManual: 70 }],
    }],
    allocations: [
      { id: 'alloc-accessory-a', orderId: 'order-accessory-check', color: 'A', plannedQuantity: 350, dyehouse: 'D' },
      { id: 'alloc-accessory-b', orderId: 'order-accessory-check', color: 'B', plannedQuantity: 350, dyehouse: 'D' },
    ],
    rawBatches: [],
    productionBatches: [],
    customerBatches: [],
    rawReturns: [],
    gluingBatches: [],
    dyehouseTransfers: [],
    accessoryBatches: [],
  };
  const domain = createFrontendDomain(state);
  return domain.calculateOrder(state.orders[0]);
}

function checkBackendFlow() {
  const atDyehouse = backendSummary({ rawReceived: 100, sent: 100, finished: 92, delivered: 0 });
  assertClose(atDyehouse.remainingAtDyehouse, 8, 'backend: dyehouse balance after partial finished receipt');
  assertClose(atDyehouse.warehouseBalance, 92, 'backend: warehouse balance after finished receipt');

  const partialDelivery = backendSummary({ rawReceived: 100, sent: 100, finished: 92, delivered: 50 });
  assertClose(partialDelivery.remainingAtDyehouse, 8, 'backend: customer delivery must not change dyehouse balance');
  assertClose(partialDelivery.warehouseBalance, 42, 'backend: customer delivery reduces warehouse only');

  const oversent = backendSummary({ rawReceived: 103.55, sent: 103.55, finished: 100 });
  assertClose(oversent.remainingAtDyehouse, 3.55, 'backend: extra raw sent remains visible at dyehouse');

  const closed = backendSummary({ rawReceived: 100, sent: 100, finished: 92, delivered: 50, closed: true });
  assertClose(closed.wasteQuantity, 8, 'backend: closed order turns missing finished into actual waste');
  assertClose(closed.remainingAtDyehouse, 0, 'backend: closed order clears dyehouse balance through actual waste');
  assertClose(closed.warehouseBalance, 42, 'backend: closed order keeps warehouse balance unchanged');
}

function checkFrontendFlow() {
  const atDyehouse = frontendSummary({ sent: 100, finished: 92, delivered: 0 });
  assertClose(atDyehouse.remainingAtDyehouse, 8, 'frontend: dyehouse balance after partial finished receipt');
  assertClose(atDyehouse.warehouseBalance, 92, 'frontend: warehouse balance after finished receipt');

  const partialDelivery = frontendSummary({ sent: 100, finished: 92, delivered: 50 });
  assertClose(partialDelivery.remainingAtDyehouse, 8, 'frontend: customer delivery must not change dyehouse balance');
  assertClose(partialDelivery.warehouseBalance, 42, 'frontend: customer delivery reduces warehouse only');

  const closed = frontendSummary({ sent: 100, finished: 92, delivered: 50, closed: true });
  assertClose(closed.totalWaste, 8, 'frontend: closed order turns missing finished into actual waste');
  assertClose(closed.remainingAtDyehouse, 0, 'frontend: closed order clears dyehouse balance through actual waste');
  assertClose(closed.warehouseBalance, 42, 'frontend: closed order keeps warehouse balance unchanged');
}

function checkFrontendBackendParity() {
  const backend = backendSummary({ rawReceived: 100, sent: 100, finished: 92, delivered: 50, closed: true });
  const frontend = frontendSummary({ sent: 100, finished: 92, delivered: 50, closed: true });
  assertClose(frontend.totalSentToDyehouse, backend.totalSentToDyehouse, 'parity: sent to dyehouse');
  assertClose(frontend.totalFinishedReceived, backend.totalFinishedReceived, 'parity: finished receipt');
  assertClose(frontend.totalDeliveredToCustomer, backend.customerDeliveredQuantity, 'parity: customer delivery');
  assertClose(frontend.remainingAtDyehouse, backend.remainingAtDyehouse, 'parity: dyehouse balance');
  assertClose(frontend.warehouseBalance, backend.warehouseBalance, 'parity: warehouse balance');
  assertClose(frontend.totalWaste, backend.wasteQuantity, 'parity: actual waste');
}

function checkMultiColorOperationalEntry() {
  const frontend = frontendMultiColorSummary();
  assertClose(frontend.totalSentToDyehouse, 100, 'multi-color: sent quantities are combined');
  assertClose(frontend.totalFinishedReceived, 92, 'multi-color: finished quantities are combined');
  assertClose(frontend.totalDeliveredToCustomer, 50, 'multi-color: customer delivery quantities are combined');
  assertClose(frontend.remainingAtDyehouse, 8, 'multi-color: dyehouse balance is still visible before closure');
  assertClose(frontend.warehouseBalance, 42, 'multi-color: warehouse balance after partial delivery');
}

function checkOversentFinishedOrderKeepsExtraAtDyehouse() {
  const frontend = frontendOversentFinishedSummary();
  assertClose(frontend.remainingAtDyehouse, 35.5, 'oversent: extra raw sent remains visible at dyehouse');
  assertClose(frontend.rawAtDyehouseAvailable, 35.5, 'oversent: extra raw sent remains in dyehouse balance');
  assertClose(frontend.warehouseBalance, 1000, 'oversent: warehouse balance follows finished receipt');
}

function checkAllocationLinkedRawDispatchStaysPerColor() {
  const frontend = frontendAllocationLinkedRawDispatchSummary();
  const black = frontend.allocations.find((allocation) => allocation.id === 'alloc-black');
  const white = frontend.allocations.find((allocation) => allocation.id === 'alloc-white');
  assertClose(black.sentToDyehouse, 1500, 'raw dispatch: allocation-linked raw must stay on selected color');
  assertClose(white.sentToDyehouse, 0, 'raw dispatch: allocation-linked raw must not duplicate to sibling colors');
  assertClose(frontend.totalSentToDyehouse, 1500, 'raw dispatch: total sent follows saved allocation rows only');
}

function checkOrderLevelRawDispatchDistributesByColorPlan() {
  const frontend = frontendOrderLevelRawDispatchSummary();
  const black = frontend.allocations.find((allocation) => allocation.id === 'alloc-order-black');
  const white = frontend.allocations.find((allocation) => allocation.id === 'alloc-order-white');
  assertClose(black.sentToDyehouse, 1500, 'raw dispatch: one order-level issue is allocated to black by plan');
  assertClose(white.sentToDyehouse, 1500, 'raw dispatch: one order-level issue is allocated to white by plan');
  assertClose(frontend.totalSentToDyehouse, 3000, 'raw dispatch: one order-level issue keeps the full sent total');
}

function checkDyeingDocumentShowsPhysicalRawBalance() {
  const builders = createDocumentBuilders();
  const html = builders.buildDyeingOrderDocument({
    id: 'order-document-balance',
    orderNumber: 'DOC-1',
    orderDate: '2026-06-10',
    customer: 'Test',
    fabricType: 'Fabric',
    dyehouse: 'D',
    totalRawOrdered: 150,
    allocations: [{ id: 'alloc-document-balance', orderId: 'order-document-balance', color: 'main', plannedQuantity: 150, dyehouse: 'D', remainingAtDyehouse: 175.6 }],
    rawBatches: [{ orderId: 'order-document-balance', allocationId: 'alloc-document-balance', date: '2026-06-10', quantity: 175.6, noteNumber: '53645' }],
    productionBatches: [],
    rawReturns: [],
    dyehouseTransfers: [],
  }, 'D');
  assert(html.includes('175.6'), 'document: dyeing order raw balance must show physical sent balance above planned quantity');
}

function checkBodyLabelOnlyAppearsWithAccessories() {
  const builders = createDocumentBuilders();
  const baseOrder = {
    id: 'order-body-label',
    orderNumber: 'DOC-BODY',
    orderDate: '2026-06-15',
    customer: 'Test',
    fabricType: 'Fabric',
    dyehouse: 'D',
    totalRawOrdered: 3000,
    allocations: [
      { id: 'alloc-body-a', orderId: 'order-body-label', color: 'أسود', plannedQuantity: 1500, dyehouse: 'D', targetFinishedWidth: 160, targetFinishedWeight: 270 },
      { id: 'alloc-body-b', orderId: 'order-body-label', color: 'أبيض', plannedQuantity: 1500, dyehouse: 'D', targetFinishedWidth: 160, targetFinishedWeight: 270 },
    ],
    rawBatches: [{ orderId: 'order-body-label', date: '2026-06-15', quantity: 3000, noteNumber: '53135' }],
    productionBatches: [],
    rawReturns: [],
    dyehouseTransfers: [],
  };
  const noAccessoryHtml = builders.buildDyeingOrderDocument(baseOrder, 'D');
  assert(!noAccessoryHtml.includes('جسم'), 'document: body label must not appear when order has no accessories');

  const withAccessoryHtml = builders.buildDyeingOrderDocument({
    ...baseOrder,
    accessoryLines: [{ type: 'ريب', percent: 10, quantity: 300 }],
  }, 'D');
  assert(withAccessoryHtml.includes('جسم'), 'document: body label must appear when order has accessories');
  assert(withAccessoryHtml.includes('ريب'), 'document: accessory type must appear when order has accessories');
}

function checkWarehouseTabKeepsInventorySection() {
  const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  assert(source.includes('const inventorySection = `<div class="subsection stock-flow-section">'), 'ui: inventory section must be routed to warehouse tab');
  assert(!source.includes('section.remove();'), 'ui: warehouse inventory section must not be removed while consolidating order details');
}

function checkNoRawWarehouseDashboardTerminology() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const serverSource = fs.readFileSync(path.join(__dirname, '..', 'backend', 'server.js'), 'utf8');
  assert(!appSource.includes("['خام مستلم'"), 'ui: dashboard must not show raw received as a warehouse-like stage');
  assert(!appSource.includes('خام متاح بالمصبغة'), 'ui: order details must call dyehouse balance داخل المصبغة');
  assert(!serverSource.includes("key: 'ready-to-dyehouse'"), 'ai: no standalone ready-to-dyehouse stage after removing raw warehouse concept');
  assert(!serverSource.includes('خام جاهز للمصبغة'), 'ai: no raw-ready wording after removing raw warehouse concept');
}

function checkManualAccessoryDistribution() {
  const frontend = frontendManualAccessorySummary();
  assertClose(frontend.accessoryRequired, 70, 'accessory: manual total is preserved');
  assertClose(frontend.allocations[0].accessoryQuantity, 35, 'accessory: first color receives proportional accessory quantity');
  assertClose(frontend.allocations[1].accessoryQuantity, 35, 'accessory: second color receives proportional accessory quantity');
}

checkBackendFlow();
checkFrontendFlow();
checkFrontendBackendParity();
checkMultiColorOperationalEntry();
checkOversentFinishedOrderKeepsExtraAtDyehouse();
checkAllocationLinkedRawDispatchStaysPerColor();
checkOrderLevelRawDispatchDistributesByColorPlan();
checkDyeingDocumentShowsPhysicalRawBalance();
checkBodyLabelOnlyAppearsWithAccessories();
checkWarehouseTabKeepsInventorySection();
checkNoRawWarehouseDashboardTerminology();
checkManualAccessoryDistribution();

console.log('Operational flow check passed.');

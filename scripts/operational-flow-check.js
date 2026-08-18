const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { calculateOrderSummary } = require('../backend/calculations');

function roundNumber(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(Number(value || 0) * factor) / factor;
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

function createPricingDomain() {
  const sandbox = { window: {} };
  const source = fs.readFileSync(path.join(__dirname, '..', 'pricing.js'), 'utf8');
  vm.runInNewContext(source, sandbox, { filename: 'pricing.js' });
  return sandbox.window.TwoBTexPricing.createPricingDomain({
    buildItemCode: (value) => `2B-${value || ''}`,
    clone: (value) => JSON.parse(JSON.stringify(value ?? null)),
    isLegacyRecoveredText: () => false,
    normalizeDyehousePriceLabel: (value) => String(value || '').trim(),
    roundNumber,
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

function frontendPerColorAccessorySummary() {
  const state = {
    orders: [{ id:'order-derby-colors', orderNumber:'CHECK-DERBY', totalRawQuantity:1000, widthMode:'single', accessoryLines:[{ id:'derby', type:'ديربي', percent:0, quantityManual:'' }] }],
    allocations: [
      { id:'derby-a', orderId:'order-derby-colors', color:'A', plannedQuantity:400, accessoryQuantityManual:20 },
      { id:'derby-b', orderId:'order-derby-colors', color:'B', plannedQuantity:600, accessoryQuantityManual:60 },
    ],
    rawBatches: [], productionBatches: [], customerBatches: [], rawReturns: [], gluingBatches: [], dyehouseTransfers: [], accessoryBatches: [],
  };
  return createFrontendDomain(state).calculateOrder(state.orders[0]);
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
  assertClose(closed.wastePercentage, 8.7, 'backend: actual waste percent uses finished received weight');
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
  assertClose(closed.totalWastePercent, 8.7, 'frontend: actual waste percent uses finished received weight');
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
  assertClose(frontend.totalWastePercent, backend.wastePercentage, 'parity: actual waste percent');
}

function checkPricingUiUsesOperationalWaste() {
  const source = fs.readFileSync(path.join(__dirname, '..', 'modules', 'pricingUi.js'), 'utf8');
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  assert(source.includes('function pricingWastePercentFromOrder'), 'pricing-ui: order pricing cards must derive waste percent from the calculated order');
  assert(source.includes('calculated.totalWastePercent'), 'pricing-ui: order pricing cards must prefer actual operational waste percent');
  assert(source.includes('pricingWithOrderWastePercent(linkedPricing, calculated)'), 'pricing-ui: linked pricing cards must refresh displayed waste percent from the order');
  assert(source.includes('pricingWithOperationalWastePercent(sourcePricing)'), 'pricing-ui: old pricing list rows must refresh linked order waste at runtime');
  assert(source.includes('pricingWithOperationalWastePercent(pricing)'), 'pricing-ui: editing an old linked pricing card must refresh operational waste');
  assert(appSource.includes('function pricingWithOperationalWastePercent'), 'app: pricing calculations must normalize old linked pricing cards with operational waste');
  assert(appSource.includes('const source = pricingWithOperationalWastePercent(pricing || {})'), 'app: calculatePricing must use operational waste before any display or print calculation');
}

function checkWasteDisplaysUseFinishedWeight() {
  const documentsSource = fs.readFileSync(path.join(__dirname, '..', 'documents.js'), 'utf8');
  const reportsSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'reportsUi.js'), 'utf8');
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  assert(documentsSource.includes('function actualWastePercentForLine'), 'documents: waste report rows must recalculate actual waste percent at display time');
  assert(documentsSource.includes('(waste / finished) * 100'), 'documents: actual waste percent must use finished received weight');
  assert(reportsSource.includes('function actualWastePercentForReport'), 'reports: management reports must recalculate actual waste percent at display time');
  assert(appSource.includes('function actualWastePercentForDisplay'), 'app: order detail rows must recalculate actual waste percent at display time');
  assert(appSource.includes('formatNumber(actualWastePercentForDisplay(allocation), 1)'), 'app: allocation tables must not print stale allocation waste percent');
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
    operationNotes: { dyeingStages: ['Dyeing', 'Packaging', 'Ram'] },
    allocations: [{ id: 'alloc-document-balance', orderId: 'order-document-balance', color: 'main', plannedQuantity: 150, dyehouse: 'D', remainingAtDyehouse: 175.6 }],
    rawBatches: [{ orderId: 'order-document-balance', allocationId: 'alloc-document-balance', date: '2026-06-10', quantity: 175.6, noteNumber: '53645' }],
    productionBatches: [],
    rawReturns: [],
    dyehouseTransfers: [],
  }, 'D');
  assert(html.includes('175.6'), 'document: dyeing order raw balance must show physical sent balance above planned quantity');
  assert(!html.includes('Dyeing'), 'document: dyeing order must not show pricing dyeing stages');
  assert(!html.includes('Packaging'), 'document: dyeing order must not show pricing packaging stages');
  assert(!html.includes('Ram'), 'document: dyeing order must not show pricing ram stages');

  const plannedOnlyHtml = builders.buildDyeingOrderDocument({
    id: 'order-document-planned-only',
    orderNumber: 'DOC-PLANNED-ONLY',
    orderDate: '2026-08-02',
    customer: 'Test',
    fabricType: 'Fabric',
    dyehouse: 'D',
    allocations: [{ id: 'alloc-planned-only', orderId: 'order-document-planned-only', color: 'blue', plannedQuantity: 35285, dyehouse: 'D', sentToDyehouse: 0, remainingAtDyehouse: 0 }],
    rawBatches: [],
    productionBatches: [],
    rawReturns: [],
    dyehouseTransfers: [],
  }, 'D');
  assert(plannedOnlyHtml.includes('35,285'), 'document: planned dyeing quantity must remain visible');
  assert(plannedOnlyHtml.includes('>0</td>'), 'document: raw balance must stay zero until a physical raw dispatch exists');
}

function checkDyeingDocumentSplitsMultiDyehouseOrder() {
  const builders = createDocumentBuilders();
  const order = {
    id: 'order-document-multi-dyehouse',
    orderNumber: 'DOC-MULTI-DYE',
    orderDate: '2026-06-17',
    customer: 'Test',
    fabricType: 'Single Lycra Cotton',
    dyehouse: 'Geima',
    totalRawOrdered: 1500,
    allocations: [
      { id: 'alloc-new-white', orderId: 'order-document-multi-dyehouse', color: 'white', plannedQuantity: 300, dyehouse: 'New Geima', sentToDyehouse: 305.91, remainingAtDyehouse: 305.91, targetFinishedWidth: 175, targetFinishedWeight: 185 },
      { id: 'alloc-new-black', orderId: 'order-document-multi-dyehouse', color: 'black', plannedQuantity: 300, dyehouse: 'New Geima', sentToDyehouse: 305.91, remainingAtDyehouse: 305.91, targetFinishedWidth: 175, targetFinishedWeight: 185 },
      { id: 'alloc-geima-1', orderId: 'order-document-multi-dyehouse', color: 'red', plannedQuantity: 150, dyehouse: 'Geima', sentToDyehouse: 154.93, remainingAtDyehouse: 154.93, targetFinishedWidth: 175, targetFinishedWeight: 185 },
      { id: 'alloc-geima-2', orderId: 'order-document-multi-dyehouse', color: 'green', plannedQuantity: 150, dyehouse: 'Geima', sentToDyehouse: 154.93, remainingAtDyehouse: 154.93, targetFinishedWidth: 175, targetFinishedWeight: 185 },
      { id: 'alloc-geima-3', orderId: 'order-document-multi-dyehouse', color: 'blue', plannedQuantity: 150, dyehouse: 'Geima', sentToDyehouse: 154.93, remainingAtDyehouse: 154.93, targetFinishedWidth: 175, targetFinishedWeight: 185 },
      { id: 'alloc-geima-4', orderId: 'order-document-multi-dyehouse', color: 'yellow', plannedQuantity: 150, dyehouse: 'Geima', sentToDyehouse: 154.93, remainingAtDyehouse: 154.93, targetFinishedWidth: 175, targetFinishedWeight: 185 },
      { id: 'alloc-geima-5', orderId: 'order-document-multi-dyehouse', color: 'navy', plannedQuantity: 150, dyehouse: 'Geima', sentToDyehouse: 154.94, remainingAtDyehouse: 154.94, targetFinishedWidth: 175, targetFinishedWeight: 185 },
      { id: 'alloc-geima-6', orderId: 'order-document-multi-dyehouse', color: 'grey', plannedQuantity: 150, dyehouse: 'Geima', sentToDyehouse: 154.94, remainingAtDyehouse: 154.94, targetFinishedWidth: 175, targetFinishedWeight: 185 },
    ],
    rawBatches: [],
    productionBatches: [],
    rawReturns: [],
    dyehouseTransfers: [],
  };
  const newGeimaHtml = builders.buildDyeingOrderDocument(order, 'New Geima');
  assert(newGeimaHtml.includes('600'), 'document: New Geima planned total must include its two colors only');
  assert(newGeimaHtml.includes('611.82'), 'document: New Geima raw balance must use its two color sent quantities only');
  assert(!newGeimaHtml.includes('1,500'), 'document: New Geima header must not show the full order raw total');
  assert(newGeimaHtml.includes('white') && newGeimaHtml.includes('black'), 'document: New Geima must show white and black');
  assert(!newGeimaHtml.includes('red'), 'document: New Geima must not include Geima colors');

  const geimaHtml = builders.buildDyeingOrderDocument(order, 'Geima');
  assert(geimaHtml.includes('900'), 'document: Geima planned total must include its six colors only');
  assert(geimaHtml.includes('929.6'), 'document: Geima raw balance must use its six color sent quantities only');
  assert(geimaHtml.includes('red') && geimaHtml.includes('grey'), 'document: Geima must show Geima colors');
  assert(!geimaHtml.includes('white'), 'document: Geima must not include New Geima colors');
}

function checkLegacyPartialTransferUsesActualQuantity() {
  const builders = createDocumentBuilders();
  const order = {
    id: 'order-document-legacy-transfer',
    orderNumber: 'DOC-LEGACY-TRANSFER',
    orderDate: '2026-06-17',
    customer: 'Test',
    fabricType: 'Mixed',
    dyehouse: 'Star',
    totalRawOrdered: 4100,
    totalRawReceived: 4180,
    rawAtDyehouseAvailable: 1719.2,
    totalFinishedReceived: 100,
    totalDeliveredToCustomer: 40,
    warehouseBalance: 60,
    totalWaste: 0,
    allocations: [
      { id: 'alloc-width-75', orderId: 'order-document-legacy-transfer', color: 'off white', plannedQuantity: 2100, dyehouse: 'Biko', sentToDyehouse: 2100, remainingAtDyehouse: 2100, finishedReceived:100, deliveredToCustomer:40, targetFinishedWidth: 75, targetFinishedWeight: 140 },
    ],
    rawBatches: [{ orderId: 'order-document-legacy-transfer', allocationId: null, date: '2026-05-20', quantity: 4180, noteNumber: '5454' }],
    productionBatches: [],
    customerBatches: [{ orderId:'order-document-legacy-transfer', allocationId:'alloc-width-75', date:'2026-05-28', quantity:40, noteNumber:'CUST-77' }],
    rawReturns: [],
    dyehouseTransfers: [
      { allocationId: 'alloc-width-75', fromDyehouse: 'Star', toDyehouse: 'Biko', quantity: 380.8, date: '2026-05-20', reason: 'تحويل مصبغة' },
      { orderId: 'other-order', allocationId: 'other-allocation', fromDyehouse: 'Geima', toDyehouse: 'New Geima', quantity: 593.6, date: '2026-05-23', noteNumber: '5454', reason: 'foreign transfer must stay hidden' },
    ],
  };
  const bikoHtml = builders.buildDyeingOrderDocument(order, 'Biko');
  assert(bikoHtml.includes('380.8'), 'document: legacy partial dyehouse transfer must use the transferred raw quantity');
  assert(!bikoHtml.includes('2,100'), 'document: legacy partial dyehouse transfer must not show the full allocation as transferred');
  const starHtml = builders.buildDyeingOrderDocument(order, 'Star');
  assert(starHtml.includes('1,719.2'), 'document: legacy partial dyehouse transfer source must keep the remaining raw quantity visible');
  assert(!starHtml.includes('2,100'), 'document: source dyehouse must not show the full allocation after partial raw transfer');
  const fullHtml = builders.buildCompactFullReportDocument(order);
  assert(fullHtml.includes('تحويلات المصبغة'), 'document: detailed report must include dyehouse transfer section');
  assert(fullHtml.includes('2026-05-20'), 'document: detailed report transfer section must show transfer date');
  assert(fullHtml.includes('Star') && fullHtml.includes('Biko'), 'document: detailed report transfer section must show source and target dyehouse');
  assert(fullHtml.includes('380.8'), 'document: detailed report transfer section must show transfer quantity');
  assert(fullHtml.includes('off white') && fullHtml.includes('2,100'), 'document: detailed report must show color plan quantities');
  assert(fullHtml.includes('رصيد المخزن') && fullHtml.includes('60'), 'document: detailed report must show warehouse balance');
  assert(fullHtml.includes('داخل المصبغة') && fullHtml.includes('1,719.2'), 'document: detailed report must show dyehouse balance');
  assert(fullHtml.includes('مواعيد استلام العميل') && fullHtml.includes('2026-05-28') && fullHtml.includes('CUST-77'), 'document: detailed report must show customer receipt dates and permit numbers');
  assert(!fullHtml.includes('593.6') && !fullHtml.includes('other-order'), 'document: detailed report must not include transfers from other orders');
}

function checkDetailedReportSplitsRawTransferByDyehouse() {
  const builders = createDocumentBuilders();
  const order = {
    id: 'order-detailed-transfer-split',
    orderNumber: 'DOC-TRANSFER-SPLIT',
    customer: 'Customer',
    fabricType: 'Fabric',
    dyehouse: 'Geima',
    totalRawOrdered: 1000,
    totalRawReceived: 1000,
    rawAtDyehouseAvailable: 1000,
    totalFinishedReceived: 0,
    warehouseBalance: 0,
    allocations: [
      { id: 'alloc-transfer-split', orderId: 'order-detailed-transfer-split', color: 'main', plannedQuantity: 1000, dyehouse: 'Geima', sentToDyehouse: 1000, remainingAtDyehouse: 1000, targetFinishedWidth: 160, targetFinishedWeight: 270 },
    ],
    rawBatches: [{ orderId: 'order-detailed-transfer-split', allocationId: null, date: '2026-06-17', quantity: 1000, noteNumber: '1' }],
    productionBatches: [],
    rawReturns: [],
    dyehouseTransfers: [
      { orderId: 'order-detailed-transfer-split', allocationId: 'alloc-transfer-split', fromDyehouse: 'Geima', toDyehouse: 'New Geima', quantity: 300, date: '2026-06-17', reason: 'تحويل مصبغة' },
    ],
  };
  const fullHtml = builders.buildCompactFullReportDocument(order);
  assert(fullHtml.includes('توزيع الرصيد على المصابغ'), 'document: detailed report must include dyehouse distribution section');
  assert(fullHtml.includes('<td>Geima</td><td>700</td><td>700</td>'), 'document: detailed report source dyehouse must show 700 after transferring 300 from 1000');
  assert(fullHtml.includes('<td>New Geima</td><td>300</td><td>300</td>'), 'document: detailed report target dyehouse must show 300 after receiving transfer');
}

function checkDetailedReportUsesDispatchDyehouse() {
  const builders = createDocumentBuilders();
  const order = {
    id: 'order-72104-regression',
    orderNumber: '72104',
    customer: 'ارمان',
    fabricType: 'سنجل ليكرا فسكوز',
    dyehouse: 'جيما',
    totalRawOrdered: 4215,
    totalRawReceived: 3372.3,
    allocations: [
      { id:'a1', orderId:'order-72104-regression', color:'اسود', plannedQuantity:4215, dyehouse:'جيما', sentToDyehouse:3372.3, remainingAtDyehouse:3372.3 },
    ],
    rawBatches: [
      { orderId:'order-72104-regression', quantity:607.3, dyehouse:'بيكو', noteNumber:'54393' },
      { orderId:'order-72104-regression', quantity:612.3, dyehouse:'بيكو', noteNumber:'54392' },
      { orderId:'order-72104-regression', quantity:610.6, dyehouse:'بيكو', noteNumber:'54394' },
      { orderId:'order-72104-regression', quantity:500, dyehouse:'جيما', noteNumber:'54353' },
      { orderId:'order-72104-regression', quantity:517.9, dyehouse:'جيما', noteNumber:'54344' },
      { orderId:'order-72104-regression', quantity:524.2, dyehouse:'جيما', noteNumber:'54345' },
    ],
    productionBatches: [], rawReturns: [], dyehouseTransfers: [],
  };
  const html = builders.buildCompactFullReportDocument(order);
  assert(html.includes('<td>بيكو</td><td>1,830.2</td><td>1,830.2</td><td>0</td>'), 'document: Biko dispatches must remain separate even without Biko color allocations');
  assert(html.includes('<td>جيما</td><td>1,542.1</td><td>1,542.1</td>'), 'document: Geima dispatches must not include Biko raw permits');
}

function checkDyeingOrderPickerUsesDispatchDyehouses() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const documentsSource = fs.readFileSync(path.join(__dirname, '..', 'documents.js'), 'utf8');
  assert(appSource.includes('const dispatchDyehouses = rawBatches'), 'dyeing picker: permit dyehouses must be included in the available choices');
  assert(appSource.includes('data-bulk-row-note-number'), 'bulk dyehouse issue: permit number must be entered beside its dyehouse row');
  assert(appSource.includes('noteNumber:rowNoteNumber'), 'bulk dyehouse issue: each saved dispatch must use its own dyehouse permit number');
  assert(appSource.includes("اكتب رقم الإذن بجوار المصبغة"), 'bulk dyehouse issue: dispatch quantity must require its linked permit number');
  assert(appSource.includes('function rawDispatchQuantityForDyehouse(order, dyehouseName)'), 'dyeing picker: each choice must calculate its permit quantity separately');
  assert(appSource.includes('const quantity = dispatchedQuantity || rows.reduce'), 'dyeing picker: permit quantity must be shown even before colors are assigned');
  assert(appSource.includes('function openAllocationTableDialog(order)'), 'color allocation: add-color action must open the table dialog');
  assert(appSource.includes('const rowCount = Math.max(6 - existingRows.length, 1)'), 'color allocation: manager must preload existing colors and keep at least one new row');
  assert(appSource.includes('data-add-allocation-entry'), 'color allocation: table must allow adding another color row');
  assert(appSource.includes('function customerOrderLabel(order)'), 'customers: orders must display the fixed customer code beside the customer name');
  assert(appSource.includes('function openPantoneColorExperiment()'), 'pantone experiment: color search and screen picker dialog must be available');
  assert(appSource.includes('new window.EyeDropper().open()'), 'pantone experiment: screen eyedropper must capture the preview color');
  assert(documentsSource.includes('class="lab-color-info"'), 'lab samples: each color must display its name and Pantone number');
  assert(documentsSource.includes('class="lab-color-swatch'), 'lab samples: each color must include a circular color image');
  assert(appSource.includes('customerCode: customerLookupCode(customers, row.customer_id)'), 'customers: every loaded order must inherit its customer code');
  assert(documentsSource.includes('order?.customerCode || order?.customer_code'), 'customers: operational documents must display the customer code');
}

function checkDetailedReportRejectsForeignDyehouseTransfers() {
  const builders = createDocumentBuilders();
  const order = {
    id: 'order-locarno-scope',
    orderNumber: '1008',
    customer: 'Locarno',
    fabricType: 'Fabric',
    dyehouse: 'Star',
    totalRawOrdered: 4100,
    totalRawReceived: 4180,
    rawAtDyehouseAvailable: 4100,
    allocations: [
      { id: 'locarno-width-75', orderId: 'order-locarno-scope', color: 'off white', plannedQuantity: 2100, dyehouse: 'Biko', sentToDyehouse: 2100, remainingAtDyehouse: 2100, targetFinishedWidth: 75, targetFinishedWeight: 140 },
    ],
    rawBatches: [{ orderId: 'order-locarno-scope', allocationId: null, date: '2026-05-20', quantity: 4180, noteNumber: '1008-note' }],
    productionBatches: [],
    rawReturns: [],
    dyehouseTransfers: [
      { orderId: 'order-locarno-scope', allocationId: 'locarno-width-75', fromDyehouse: 'Star', toDyehouse: 'Biko', quantity: 380.8, date: '2026-05-20', reason: 'تحويل مصبغة' },
      { orderId: 'order-gharbawy-scope', allocationId: 'gharbawy-white', fromDyehouse: 'Geima', toDyehouse: 'New Geima', quantity: 593.6, date: '2026-05-23', noteNumber: '5454', reason: 'تحويل مصبغة' },
      { orderId: 'order-locarno-scope', allocationId: 'gharbawy-white', fromDyehouse: 'Geima', toDyehouse: 'New Geima', quantity: 300, date: '2026-06-17', noteNumber: '5454', reason: 'bad migrated foreign transfer' },
    ],
  };
  const fullHtml = builders.buildCompactFullReportDocument(order);
  assert(fullHtml.includes('380.8'), 'document: detailed report must keep the current order transfer');
  assert(!fullHtml.includes('593.6'), 'document: detailed report must reject transfers from another order id');
  assert(!fullHtml.includes('bad migrated foreign transfer'), 'document: detailed report must reject transfers with invalid allocation links even if order id was migrated incorrectly');
  assert(!fullHtml.includes('Geima') && !fullHtml.includes('New Geima'), 'document: foreign dyehouses must not leak into the current order report');
}

function checkOrderLevelRawTransferCanStillSplitSingleAllocationDyehouseBalance() {
  const builders = createDocumentBuilders();
  const order = {
    id: 'order-single-allocation-raw-transfer',
    orderNumber: 'RAW-SINGLE',
    customer: 'Customer',
    fabricType: 'Fabric',
    dyehouse: 'Geima',
    totalRawOrdered: 1000,
    totalRawReceived: 1000,
    rawAtDyehouseAvailable: 1000,
    allocations: [
      { id: 'single-allocation', orderId: 'order-single-allocation-raw-transfer', color: 'main', plannedQuantity: 1000, dyehouse: 'Geima', sentToDyehouse: 1000, remainingAtDyehouse: 1000, targetFinishedWidth: 160, targetFinishedWeight: 270 },
    ],
    rawBatches: [{ orderId: 'order-single-allocation-raw-transfer', allocationId: null, date: '2026-06-17', quantity: 1000, noteNumber: '1' }],
    productionBatches: [],
    rawReturns: [],
    dyehouseTransfers: [
      { orderId: 'order-single-allocation-raw-transfer', fromDyehouse: 'Geima', toDyehouse: 'New Geima', quantity: 300, date: '2026-06-17', reason: 'نقل خام' },
    ],
  };
  const fullHtml = builders.buildCompactFullReportDocument(order);
  assert(fullHtml.includes('<td>Geima</td><td>700</td><td>700</td>'), 'document: order-level raw transfer source dyehouse must keep 700 for a single-allocation order');
  assert(fullHtml.includes('<td>New Geima</td><td>300</td><td>300</td>'), 'document: order-level raw transfer target dyehouse must show 300 for a single-allocation order');
}

function checkDyehouseTransferKindsAreSeparated() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const documentsSource = fs.readFileSync(path.join(__dirname, '..', 'documents.js'), 'utf8');
  assert(appSource.includes('TRANSFER_RAW_MARKER'), 'transfers: raw-transfer marker must exist');
  assert(appSource.includes('TRANSFER_ALLOCATION_MARKER'), 'transfers: allocation-transfer marker must exist');
  assert(appSource.includes('TRANSFER_ACCESSORY_MARKER'), 'transfers: accessory raw-transfer marker must exist');
  assert(appSource.includes('function transferTextLooksRaw(value)'), 'transfers: legacy raw-transfer text must be classified as raw transfer');
  assert(appSource.includes('function isUnreadableOperationalText(value)'), 'data repair: unreadable operational names must be detected');
  assert(appSource.includes('function repairUnreadableOrderFabricTypesFromPricings()'), 'data repair: unreadable order fabric names must be recovered from pricing cards');
  assert(appSource.includes('repairUnreadableOrderFabricTypesFromPricings();'), 'data repair: order fabric recovery must run after pricing cards load');
  assert(appSource.includes('if (text.includes(TRANSFER_ALLOCATION_MARKER)) return false'), 'transfers: explicit allocation transfer must override legacy raw-transfer text');
  assert(appSource.includes('function transferRecordMode(transfer)'), 'transfers: repair must use normalized transfer kind, not stale mode values');
  assert(appSource.includes("text.includes('\\u062e\\u0631\\u0648\\u062c \\u062e\\u0627\\u0645')"), 'transfers: legacy خروج خام notes must be treated as raw transfer');
  assert(appSource.includes("allocation.dyehouse = fromDyehouse"), 'transfers: raw transfer repair must keep the allocation at its original dyehouse');
  assert(appSource.includes('function dyehouseLedgerSegmentsForAllocation(order, allocation)'), 'ui: order detail must use an explicit dyehouse ledger helper');
  assert(appSource.includes('function chooseDyehouseTransferType(hasAccessories = false)'), 'transfers: UI must ask whether the transfer is cloth raw, accessory raw, or allocation movement');
  assert(appSource.includes('data-transfer-choice="raw"'), 'transfers: transfer dialog must expose a raw movement choice');
  assert(appSource.includes('data-transfer-choice="allocation"'), 'transfers: transfer dialog must expose a color/allocation movement choice');
  assert(appSource.includes('data-transfer-choice="accessory"'), 'transfers: transfer dialog must expose an accessory raw movement choice');
  assert(appSource.includes('1 - \\u0646\\u0642\\u0644 \\u062e\\u0627\\u0645\\n2 - \\u0646\\u0642\\u0644 \\u0644\\u0648\\u0646'), 'transfers: fallback prompt must keep clear raw/color choices');
  assert(appSource.includes("mode:'raw'"), 'transfers: raw transfer must be saved without allocation splitting');
  assert(documentsSource.includes('const transferTextLooksRaw = (value) =>'), 'documents: legacy raw-transfer notes must be recognized');
  assert(documentsSource.includes("if (text.includes('[allocation-transfer]')) return false"), 'documents: allocation transfer must not be counted as physical raw transfer');
  assert(documentsSource.includes("text.includes('[accessory-transfer]')"), 'documents: accessory raw transfer must be reported separately from cloth raw transfer');
  assert(documentsSource.includes('const isRawTransfer = (transfer, order = null) => transferKind(transfer, order) ==='), 'documents: dyeing documents must distinguish physical raw transfers with order context');
  assert(documentsSource.includes('function dyehouseLedgerSegmentsForAllocation(order, allocation)'), 'documents: dyehouse documents must use one ledger for source and target raw balances');
  assert(documentsSource.includes('function dyehouseScopedAllocations(order, dyehouseName)'), 'documents: dyeing documents must scope color rows by dyehouse transfer quantities');
  assert(documentsSource.includes('totalRawOrdered:plannedTotal'), 'documents: dyeing document header raw total must be scoped to the selected dyehouse');
  assert(documentsSource.includes('hasExplicitDyehouseDispatch ? movementBalance : (operationalBalance || movementBalance)'), 'documents: explicit permit dyehouse must override the order-level operational balance');
  assert(appSource.includes('function scopedOrderDetailAllocationRows(order)'), 'ui: order detail color plan must split balances by scoped dyehouse rows');
  assert(appSource.includes('function scopedDyehouseSegmentsForAllocation(order, allocation)'), 'ui: order detail must build a dyehouse balance ledger for each color');
  assert(appSource.includes('return dyehouseLedgerSegmentsForAllocation(order, allocation);'), 'ui: legacy scoped dyehouse helper must delegate to the explicit ledger');
  assert(appSource.includes('const firstSourceDyehouse = String(rawTransfers.find'), 'ui: legacy partial transfers must keep the original source dyehouse visible');
  assert(appSource.includes('body.innerHTML = scopedOrderDetailAllocationRows(order).map'), 'ui: order detail color plan must render scoped dyehouse rows');
  assert(appSource.includes('transferBelongsToOrderScope(order, transfer)'), 'ui: order detail dyehouse rows must reject foreign order transfers');
  assert(appSource.includes('data-transfer-source-dyehouse'), 'ui: raw transfer button must carry the displayed row source dyehouse');
  assert(appSource.includes('data-transfer-available-quantity'), 'ui: raw transfer button must carry the displayed row available quantity');
  assert(appSource.includes('data-transfer-accessory-summary'), 'ui: raw transfer button must carry the displayed row accessory summary');
  assert(appSource.includes('function accessoryPlannedPartsForScopedQuantity(order, allocation, scopedQuantity)'), 'ui: split dyehouse rows must scale accessory quantities with scoped raw quantities');
  assert(appSource.includes('const accessoryReason = isRawTransfer && accessorySummary'), 'ui: raw transfer reason must preserve the related accessory summary');
  assert(appSource.includes("transferRecord = { id:uid(), orderId:allocation.orderId, allocationId:id, newAllocationId:null, color:`${accessoryType}"), 'ui: accessory raw transfer must save a transfer row linked to the same color');
  assert(appSource.includes("accessoryFlowQuantityForLine(order, calculated, 'sent', accessoryLine)"), 'ui: accessory raw transfer availability must use actual sent accessory movements');
  assert(appSource.includes('async function transferAllocationDyehouse(id, context = {})'), 'ui: transfer handler must accept row context for scoped raw transfers');
  assert(appSource.includes('const currentDyehouse = scopedSourceDyehouse || allocation.dyehouse || order.dyehouse ||'), 'ui: raw transfer must compare against displayed source dyehouse before allocation dyehouse');
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
  const calculatedPercentHtml = builders.buildDyeingOrderDocument({
    ...baseOrder,
    totalRawOrdered: 5200,
    totalRawQuantity: 5200,
    allocations: [{ ...baseOrder.allocations[0], plannedQuantity: 5200, color:'أسود', pantoneCode:'18.0316' }],
    accessoryLines: [{ type: 'ديربي', percent: 195, quantityManual: 195, quantity: 195 }],
  }, 'D');
  assert(calculatedPercentHtml.includes('195'), 'document: accessory quantity must remain visible inside the color row');
  assert(!calculatedPercentHtml.includes('<h3>الإكسسوارات</h3>'), 'document: dyeing order must not duplicate accessories in a separate section');
  assert(calculatedPercentHtml.includes('document-color-swatch'), 'document: known color names must render a small color swatch');
  assert(calculatedPercentHtml.includes('<bdi dir="ltr">'), 'document: Pantone codes must keep their entered left-to-right order inside Arabic text');
  assert(calculatedPercentHtml.includes('18.0316'), 'document: Pantone punctuation and digits must remain exactly as entered');
  const wasteLoadedHtml = builders.buildDyeingOrderDocument({
    ...baseOrder,
    expectedWastePercent: 10,
    totalRawOrdered: 1000,
    totalRawQuantity: 1000,
    allocations: [
      { ...baseOrder.allocations[0], plannedQuantity: 500, expectedWastePercent: 10 },
      { ...baseOrder.allocations[1], plannedQuantity: 500, expectedWastePercent: 10 },
    ],
  }, 'D');
  assert(wasteLoadedHtml.includes('1,100'), 'dyeing document: total must include expected waste above customer quantity');
  assert(wasteLoadedHtml.includes('550'), 'dyeing document: every color quantity must include its expected waste');
  assert(!wasteLoadedHtml.includes('طلب العميل 500 + هالك 50'), 'dyeing document: print must hide customer-plus-waste calculation details');
  assert(!wasteLoadedHtml.includes('هالك التشغيل المضاف'), 'dyeing document: print summary must hide planned-waste details');
  const componentHtml = builders.buildWeavingOrderDocument({
    ...baseOrder,
    totalRawOrdered: 5000,
    totalRawQuantity: 5000,
    expectedWastePercent: 10,
    accessoryLines: [{ type:'ريب', percent:3, quantity:150, unit:'kg' }],
    operationNotes: { rawComponents: [
      { name:'ممشط', specification:'', quantity:4000 },
      { name:'شانيه فاتح', specification:'2%', quantity:500 },
      { name:'شانيه فاتح', specification:'8%', quantity:500 },
    ] },
  });
  assert(componentHtml.includes('ممشط'), 'weaving document: main raw component must appear');
  assert(componentHtml.includes('شانيه فاتح') && componentHtml.includes('2%') && componentHtml.includes('8%'), 'weaving document: same-name shania specifications must remain separate');
  assert(componentHtml.includes('4,400') && componentHtml.includes('550'), 'weaving document: waste must be loaded independently on every raw component');
  assert(componentHtml.includes('ريب: 120 كجم') && componentHtml.includes('ريب: 15 كجم'), 'weaving document: rib quantity must appear under its proportional raw component');
  assert(!componentHtml.includes('<h3>جدول الألوان</h3>'), 'weaving document: color table must not appear');
  assert(!componentHtml.includes('<h3>الإكسسوارات</h3>'), 'weaving document: accessories must not be duplicated in a separate table');
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

function checkUsdPricingConvertsEgpProfit() {
  const pricingDomain = createPricingDomain();
  const pricing = pricingDomain.calculatePricing({
    currency: 'USD',
    exchangeRate: 50,
    rawCost: 4,
    dyeCost: 50,
    extraCost: 0,
    wastePercent: 0,
    deferredPercent: 0,
    profitPerKg: 30,
    quantity: 100,
  }, {});
  assertClose(pricing.dyeCost, 1, 'pricing: EGP dye cost must convert to USD');
  assertClose(pricing.profitPerKg, 30, 'pricing: stored profit input must stay in EGP');
  assertClose(pricing.profitCost, 0.6, 'pricing: EGP profit margin must expose converted USD value');
  assertClose(pricing.sellPrice, 5.6, 'pricing: USD sell price must add converted profit, not raw EGP profit');
}

function checkUsdPricingMatchesExcelSheet() {
  const pricingDomain = createPricingDomain();
  const pricing = pricingDomain.calculatePricing({
    currency: 'USD',
    exchangeRate: 52,
    rawCost: 4.4,
    dyeCost: 80,
    extraCost: 0,
    wastePercent: 10,
    wasteBasis: 'net',
    deferredPercent: 0,
    profitPerKg: 33,
    quantity: 2700,
  }, {});
  assertClose(pricing.costPerKgEgp, 332, 'pricing: USD card must round EGP cost per kg like the Excel sheet');
  assertClose(pricing.sellPriceEgp, 365, 'pricing: USD card must add EGP profit after rounding EGP cost');
  assertClose(pricing.sellPrice, 7.02, 'pricing: USD final sell price must match Excel after converting final EGP price');
}

function checkAccessoryPricingUsesWasteAndProfit() {
  const pricingDomain = createPricingDomain();
  const pricing = pricingDomain.calculatePricing({
    currency: 'EGP',
    rawCost: 200,
    dyeCost: 50,
    wastePercent: 10,
    wasteBasis: 'gross',
    deferredPercent: 0,
    profitPerKg: 30,
    quantity: 100,
    accessoryLines: [{ type: 'ريب', quantity: 10, price: 100, stageCost: 20, wastePercent: 10, wasteBasis: 'gross', profitPerKg: 30 }],
  }, {});
  const accessory = pricing.accessoryLines[0] || {};
  assertClose(accessory.costPerKg, 132, 'pricing: accessory kilo cost must include raw, stages, and waste');
  assertClose(accessory.sellPrice, 162, 'pricing: accessory kilo sale price must include profit');
  assertClose(accessory.total, 1620, 'pricing: accessory total must use final accessory sale price');
  assertClose(pricing.accessoryTotal, 1620, 'pricing: accessory total must not be raw-plus-stage cost only');

  const derby = pricingDomain.calculateAccessoryLine({
    type: 'ديربي',
    quantity: 195,
    price: 238,
    stageCost: 80.5,
    wastePercent: 4,
    wasteBasis: 'net',
    profitPerKg: 20,
  }, { currency: 'EGP' }, {});
  assertClose(derby.costPerKg, 328.02, 'pricing: derby cost must include raw, selected stages, and net waste');
  assertClose(derby.sellPrice, 348.02, 'pricing: derby sale price must include per-kilo profit');
  assertClose(derby.total, 67863.9, 'pricing: derby total must use final sale price for the entered quantity');

  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  assert(appSource.includes('pricingDomain.calculateAccessoryLine'), 'pricing ui: accessory editor must use the central pricing engine');
  assert(!appSource.includes('إجمالي خام الإكسسوار'), 'pricing ui: accessory result must not be labeled as a raw-only subtotal');
}

function checkLegacyPricingItemsInheritCardTerms() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  assert(appSource.includes('function pricingInheritedNumber'), 'pricing: legacy grouped card items must inherit missing numeric terms safely');
  assert(appSource.includes("pricingInheritedNumber(item, ['wastePercent', 'waste_percent'], pricing.wastePercent ?? pricing.waste_percent ?? 0)"), 'pricing: old item rows without waste percent must inherit the card waste percent');
  assert(appSource.includes("pricingInheritedNumber(item, ['profitPerKg', 'profit_per_kg'], pricing.profitPerKg ?? pricing.profit_per_kg ?? 0)"), 'pricing: old item rows without profit must inherit the card profit');
  assert(appSource.includes("pricingInheritedNumber(item, ['deferredPercent', 'deferred_percent'], pricing.deferredPercent ?? pricing.deferred_percent ?? 0)"), 'pricing: old item rows without deferred terms must inherit the card deferred terms');
  assert(appSource.includes('accessoryLines: Array.isArray(pricing.accessoryLines) ? pricing.accessoryLines : []'), 'pricing: old single-card accessory lines must not be dropped');
}

function checkPricingCurrencyBadgesExist() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  assert(appSource.includes('data-pricing-currency-badge="pricing"'), 'pricing ui: selected currency badge must appear beside pricing-currency money inputs');
  assert(appSource.includes('data-pricing-currency-badge="egp"'), 'pricing ui: EGP badge must appear beside EGP-entered money inputs');
  assert(appSource.includes('updatePricingCurrencyBadges'), 'pricing ui: currency badges must update when currency changes');
  assert(appSource.includes('pricingFormulaPreview'), 'pricing ui: formula preview must explain the visible pricing result');
}

function checkWeavingDocumentLayoutUsesPreparedSpecs() {
  const builders = createDocumentBuilders();
  const html = builders.buildWeavingOrderDocument({
    orderNumber: '72084',
    customer: 'مصنع بسناج',
    orderDate: '2026-07-01',
    fabricType: 'بيكا مخلوط 50-50',
    dyehouse: 'بيكو',
    weavingSource: 'دلتا تكستايل',
    totalRawOrdered: 2000,
    totalRawQuantity: 2000,
    expectedWastePercent: 8,
    inchWidth: 30,
    operationNotes: { preparedWeight: 240, preparedWidth: 125 },
    allocations: [
      { id:'a1', color:'أسود', plannedQuantity:2000, targetFinishedWeight:999, targetFinishedWidth:999 },
    ],
  });
  assert(html.includes('الوزن المجهز'), 'weaving document: prepared weight must be visible');
  assert(html.includes('العرض المجهز'), 'weaving document: prepared width must be visible');
  assert(html.includes('البوصة') && html.includes('30'), 'weaving document: separate inch box must remain visible');
  assert(html.includes('class="weaving-fabric-value"'), 'weaving document: long fabric names must use a wrapping-safe cell');
  assert(html.includes('مورد النسيج') && !html.includes('مصنع / مورد النسيج'), 'weaving document: weaving party label must be supplier only');
  assert(html.includes('الصنف') && html.includes('بيكا مخلوط 50-50'), 'weaving document: separate fabric box must remain visible');
  assert(html.includes('2,160'), 'weaving document: required raw must equal allocated customer quantity plus pricing waste');
  assert(html.includes('240') && html.includes('125'), 'weaving document: prepared weight and width entered on the order must be printed');
  assert(!html.includes('999'), 'weaving document: order-level prepared specs must override stale allocation specs');
  assert(html.includes('<th>الوزن المجهز</th><td>240</td></tr>'), 'weaving document: prepared weight must finish the first balanced row');
  assert(html.includes('<tr><th>العرض المجهز</th><td>125</td><th>إجمالي الخام المطلوب</th>'), 'weaving document: prepared width must start the second balanced row');
  assert(!html.includes('كمية طلب العميل'), 'weaving document: customer quantity must not appear in operation data');
  assert(!html.includes('هالك التسعير'), 'weaving document: pricing waste breakdown must not appear in operation data');
  assert(html.includes('إجمالي الخام المطلوب</th><td>2,160'), 'weaving document: only final required raw quantity must appear');
  assert(!html.includes('إذن الخام'), 'weaving document: raw permit number must not appear before raw issue exists');
}

function checkCollarAccessoryMeasurements() {
  const formsSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'formsUi.js'), 'utf8');
  const ordersSource = fs.readFileSync(path.join(__dirname, '..', 'orders.js'), 'utf8');
  const documentsSource = fs.readFileSync(path.join(__dirname, '..', 'documents.js'), 'utf8');
  assert(formsSource.includes('data-collar-only'), 'collar accessory: size and unit fields must be collar-only');
  assert(formsSource.includes('data-accessory-field="length"'), 'collar accessory: length field must exist');
  assert(formsSource.includes('data-accessory-field="width"'), 'collar accessory: width field must exist');
  assert(formsSource.includes('<option value="piece"'), 'collar accessory: piece unit must be selectable');
  assert(ordersSource.includes("unit:line.unit === 'piece' ? 'piece' : 'kg'"), 'collar accessory: unit and dimensions must survive order calculation');
  assert(documentsSource.includes('مقاس ${fmt(line.length || 0)} × ${fmt(line.width || 0)} سم'), 'collar accessory: documents must display collar dimensions');
}

function checkPersistentOrderBalances() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const stylesSource = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  const requiredLabels = ['طلب العميل', 'المرسل للمصبغة', 'المستلم من المصبغة', 'رصيد المصبغة', 'رصيد المخزن', 'المسلم للعميل'];
  assert(appSource.includes('function orderPersistentBalancesHtml(order)'), 'order details: persistent balance strip must exist');
  requiredLabels.forEach((label) => assert(appSource.includes(`['${label}'`), `order details: persistent balance strip must show ${label}`));
  assert(appSource.includes('node === persistentBalances'), 'order details: balance strip must remain outside tab panels');
  assert(stylesSource.includes('.order-persistent-balances{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))'), 'order details: balance cards must wrap without horizontal scrolling');
  assert(!stylesSource.includes('.order-persistent-balances{display:grid;grid-template-columns:repeat(6,minmax(135px,1fr))'), 'order details: fixed-width six-card row must not return');
}

function checkDesktopConnectionIndicatorRecovery() {
  const shellSource = fs.readFileSync(path.join(__dirname, '..', 'windows-app', 'src', 'shell.js'), 'utf8');
  assert(shellSource.includes('state === "loading" ? "جاري الاتصال"'), 'desktop shell: loading must not be reported as server unavailable');
  assert(shellSource.includes('if (!mainLoadFailed)'), 'desktop shell: successful load completion must restore connected state');
  assert(shellSource.includes('event.isMainFrame === false'), 'desktop shell: subframe failures must not mark the whole server offline');
}

function checkPricingGroupedPriceViewExists() {
  const pricingUiSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'pricingUi.js'), 'utf8');
  assert(pricingUiSource.includes('pricing-group-row'), 'pricing ui: pricing list must group prices by fabric/raw item');
  assert(pricingUiSource.includes('سعر الخام'), 'pricing ui: grouped price list must show raw price explicitly');
  assert(pricingUiSource.includes('سعر المجهز'), 'pricing ui: grouped price list must show finished price explicitly');
}

function checkPricingActiveAndLinkedSectionsExist() {
  const pricingUiSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'pricingUi.js'), 'utf8');
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  assert(pricingUiSource.includes('pricing-section-row'), 'pricing ui: pricing cards must be split into clear sections');
  assert(pricingUiSource.includes('كروت سعر شغالة فعليًا'), 'pricing ui: active pricing cards section must exist');
  assert(pricingUiSource.includes('كروت سعر مرتبطة بطلبات تشغيل'), 'pricing ui: linked pricing cards section must exist');
  assert(pricingUiSource.includes('data-open-order'), 'pricing ui: linked pricing cards must open the operational order');
  assert(appSource.includes("event.target.closest('[data-open-order]')"), 'pricing ui: open-order action must be handled');
}

function checkFixedPackagingPricingStageExists() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  assert(/price:2,\s*fixed:true/.test(appSource), 'pricing ui: packaging stage must be fixed at 2 EGP');
  assert(/price:0\.5,\s*fixed:true/.test(appSource), 'pricing ui: transport stage must be fixed at 0.5 EGP');
  assert(appSource.includes('fixedPricingStageDefinition'), 'pricing ui: fixed pricing stages must be normalized centrally');
  assert(appSource.includes("isFixedStage ? '<span class=\"status pending\">"), 'pricing ui: fixed stages must not show delete action');
}

function checkPricingListFiltersAndOrderNumber() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const documentsSource = fs.readFileSync(path.join(__dirname, '..', 'documents.js'), 'utf8');
  const indexSource = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const pricingUiSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'pricingUi.js'), 'utf8');
  const navigationSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'navigation.js'), 'utf8');
  assert(pricingUiSource.includes('pricingNumber: calculated.orderNumber || nextOrderPricingNumber(calculated)'), 'pricing ui: cards opened from existing orders must keep the order number');
  assert(pricingUiSource.includes('pricingRowsForReport'), 'pricing ui: filtered pricing rows must be exposed for printing');
  assert(indexSource.includes('pricingSearchInput') && indexSource.includes('pricingCustomerFilter') && indexSource.includes('pricingStatusFilter'), 'pricing ui: pricing list must have standalone filters');
  assert(indexSource.includes('printFilteredPricingsBtn'), 'pricing ui: filtered pricing list must be printable');
  assert(appSource.includes('openFilteredPricingsReport'), 'pricing ui: filtered pricing print report must be wired');
  assert(navigationSource.includes("action === 'pricingList'") && navigationSource.includes('deps.renderPricings?.()'), 'pricing ui: pricing list navigation must render the pricing table');
  assert(indexSource.includes('<th>رقم الطلب</th><th>العميل</th><th>الصنف</th><th>المصبغة</th><th>الكمية'), 'pricing ui: list must use the unified order number label');
  assert(!appSource.includes('<th>رقم الكرت</th><th>رقم الطلب</th>'), 'pricing print: card and order numbers must not appear as separate columns');
  assert(appSource.includes('الرصيد الفعلي للبيع'), 'pricing print: actual sellable balance must be shown');
  assert(appSource.includes('totalContractsText'), 'pricing print: contract total summary must be calculated');
  assert(indexSource.includes('./modules/navigation.js?v=20260808-03'), 'pricing navigation: navigation asset must use the current cache-busting key');
  assert(indexSource.includes('./app.js?v=20260817-06'), 'pricing navigation: main app asset must use the current cache-busting key');
  assert(appSource.includes('data-add-pricing-width') && appSource.includes('pricingWidthLinesFromRow'), 'pricing width distribution: one fabric item must support multiple inch/width/quantity lines');
  assert(appSource.includes("widthMode: primaryDraft.widthMode || 'single'") && appSource.includes('widthLines: primaryDraft.widthLines || []'), 'pricing width distribution: conversion must preserve the single message width breakdown');
  assert(appSource.includes('pendingConvertedOrderDrafts.length > 1 ? pendingConvertedOrderDrafts : []'), 'pricing width distribution: multiple products must still convert separately when one product has multiple widths');
  assert(appSource.includes('quotationWidthRows') && appSource.includes('توزيع البوص والعروض والكميات'), 'quotation width distribution: customer quotation must show inch, width and quantity');
  assert(appSource.includes('يرجى مراجعة العرض والموافقة عليه.'), 'customer quotation: approval request must appear on the customer-facing offer');
  assert(appSource.includes('مصدر التكلفة التقديرية') && appSource.includes('فتح كرت التكلفة'), 'financial center: order center must expose its linked pricing card');
  assert(pricingUiSource.includes('data-open-order-financial'), 'pricing list: a linked pricing card must open its order financial center');
  assert(documentsSource.includes('function widthDistributionSection') && documentsSource.includes('${widthDistributionSection(order)}'), 'operational documents: order and production documents must show saved width distribution');
  assert(appSource.includes('operationalQuantity > 0 ? operationalQuantity : pricingQuantity'), 'customer quotation: empty operational accessory data must not erase the pricing-card quantity');
  assert(appSource.includes('refreshOpenLiveDocument();'), 'realtime quotation: loaded backend changes must refresh an open quotation');
  assert(appSource.includes("refs.documentBody.dataset.pricingId = pricing.id"), 'realtime quotation: open document must retain its linked pricing id');
  assert(appSource.includes('quantityManual:syncedQuantity'), 'customer quotation: accessory quantity must sync from the operational order without becoming zero');
  assert(appSource.includes('<th>اللون</th><th>رقم البانتون</th><th>الكمية</th></tr>'), 'customer quotation: approved colors must show color, Pantone, and quantity');
  assert(!appSource.includes('<th>اللون</th><th>رقم البانتون</th><th>الكمية</th><th>المصبغة</th>'), 'customer quotation: internal dyehouse must not be exposed to the customer');
}

function checkAccessoryRawDeliveryPermit() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const serverSource = fs.readFileSync(path.join(__dirname, '..', 'backend', 'server.js'), 'utf8');
  const mssqlSource = fs.readFileSync(path.join(__dirname, '..', 'backend', 'db-mssql.js'), 'utf8');
  assert(appSource.includes('data-add-bulk-extra-accessory'), 'accessory raw: combined permit must allow extra accessory raw rows');
  assert(appSource.includes('data-bulk-accessory-dyehouse'), 'accessory raw: each row must capture its receiving dyehouse');
  assert(appSource.includes('data-bulk-accessory-note-number'), 'accessory raw: each row must capture its supplier permit number');
  assert(appSource.includes("dyehouse:accessoryDyehouse"), 'accessory raw: receiving dyehouse must be persisted with the batch');
  assert(serverSource.includes("accessory_type','quantity','dyehouse','note_number"), 'accessory raw: backend whitelist must persist dyehouse');
  assert(mssqlSource.includes("['batch_date TEXT', 'dyehouse TEXT', 'note_number TEXT', 'movement TEXT']"), 'accessory raw: SQL Server migration must add the dyehouse column');
}

function checkDesktopPdfExportsOnlyDocumentSheet() {
  const documentsUiSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'documentsUi.js'), 'utf8');
  const stylesSource = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  const desktopMainSource = fs.readFileSync(path.join(__dirname, '..', 'windows-app', 'src', 'main.js'), 'utf8');
  assert(documentsUiSource.includes("classList.add('desktop-pdf-export')"), 'pdf export: desktop flow must isolate the printable document before capture');
  assert(documentsUiSource.includes("classList.remove('desktop-pdf-export')"), 'pdf export: isolated export mode must always be cleaned up');
  assert(stylesSource.includes('body.desktop-pdf-export #documentDialog .dialog-head{display:none!important}'), 'pdf export: dialog toolbar must never appear inside the PDF');
  assert(stylesSource.includes('body.desktop-pdf-export #documentBody>.document-sheet'), 'pdf export: the white document sheet must be the export target');
  assert(desktopMainSource.includes('setEmulatedMedia({ media: "print" })'), 'pdf export: desktop shell must explicitly apply print media before printToPDF');
}

function checkClosedOrdersStayOutOfOperatingLists() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const ordersUiSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'ordersUi.js'), 'utf8');
  assert(appSource.includes("if (order.operationClosed && status !== 'closed') return false;"), 'orders list: operationally closed orders must be hidden unless the closed filter is selected');
  assert(ordersUiSource.includes('.filter((order) => !order.operationClosed)'), 'stage screens: operationally closed orders must be hidden');
}

function checkVisibleVersionSynchronization() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const indexSource = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const identityUiSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'serverIdentityUi.js'), 'utf8');
  assert(appSource.includes('window.TWO_B_APP_VERSION = APP_VERSION'), 'version ui: loaded application version must be exposed for synchronization');
  assert(identityUiSource.includes('function syncVisibleVersion(identity)'), 'version ui: top badge must synchronize with server identity');
  assert(identityUiSource.includes('window.twoBTexCanAutoRefresh'), 'version ui: mismatch must wait until unsaved work is safe');
  assert(identityUiSource.includes("url.searchParams.set('auto_sync'"), 'version ui: safe version mismatch must reload automatically with cache busting');
  assert(appSource.includes('function refreshBackendDataAutomatically()'), 'live sync: operational data must refresh automatically');
  assert(appSource.includes('refreshIfChanged:true'), 'live sync: unchanged server payload must not rerender the workspace');
  assert(appSource.includes('function userHasActiveUnsavedWork()'), 'live sync: active forms and drafts must block automatic refresh');
  assert(identityUiSource.includes('اضغط R'), 'version ui: mismatch must give an explicit refresh instruction');
  assert(indexSource.includes('./modules/serverIdentityUi.js?v=20260808-07'), 'version ui: identity synchronizer must use the current cache key');
}

function checkRealtimeOperationalSynchronization() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const frontendServerSource = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  assert(packageJson.dependencies?.ws, 'realtime sync: ws must be a direct production dependency');
  assert(frontendServerSource.includes('new WebSocketServer({ noServer:true })'), 'realtime sync: frontend server must host the WebSocket channel');
  assert(frontendServerSource.includes("pathname !== '/realtime' || !isAuthorized(req)"), 'realtime sync: socket upgrades must require an authenticated session');
  assert(frontendServerSource.includes("type:'data-change'"), 'realtime sync: successful mutations must be broadcast to connected clients');
  assert(appSource.includes('function connectRealtimeSync()'), 'realtime sync: clients must connect and reconnect automatically');
  assert(appSource.includes("message.type === 'data-change'"), 'realtime sync: clients must refresh when another device changes data');
  assert(appSource.includes('setInterval(()=>flushRealtimeRefresh()'), 'realtime sync: deferred events must resume after the active form is safe');
  assert(appSource.includes('60000'), 'realtime sync: polling must remain only as a distant fallback');
}

function checkNamedColorApproximation() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const documentsSource = fs.readFileSync(path.join(__dirname, '..', 'documents.js'), 'utf8');
  const indexSource = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert(appSource.includes('function approximateNamedColorHex(value)'), 'named colors: UI must derive an approximate swatch directly from the Arabic color name');
  assert(appSource.includes("[/(بترولي)/, '#17666a']"), 'named colors: petrol color must have a deterministic approximate swatch');
  assert(appSource.includes('namedColorLabelHtml(allocation.color)'), 'named colors: allocation table must display the approximate color circle');
  assert(documentsSource.includes('window.approximateNamedColorHex'), 'named colors: printed documents must reuse the name-based color approximation');
  assert(!documentsSource.includes("const saved = clean(line?.colorHex"), 'named colors: documents must not depend on a saved Pantone-derived hex value');
  assert(indexSource.includes('./documents.js?v=20260816-04'), 'named colors: document builder must use the current cache key');
}

function checkOrderPreparedSpecsPersistence() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  assert(appSource.includes("'orderPreparedWeight','orderPreparedWidth'"), 'order form: prepared weight and width fields must be wired');
  assert(appSource.includes("document.getElementById('totalRawQuantity')?.closest('label')?.insertAdjacentElement('afterend', preparedWeightLabel)"), 'order form: prepared specs must appear directly after total required raw');
  assert(appSource.includes('payloadOperationNotes.preparedWeight'), 'order save: prepared weight must be persisted in operation notes');
  assert(appSource.includes('payloadOperationNotes.preparedWidth'), 'order save: prepared width must be persisted in operation notes');
  assert(appSource.includes("order?.operationNotes?.preparedWeight || ''"), 'order edit: prepared weight must be restored');
  assert(appSource.includes("order?.operationNotes?.preparedWidth || ''"), 'order edit: prepared width must be restored');
}

function checkPricingToOrderCarriesGroupedOperationalFields() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const formsUiSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'formsUi.js'), 'utf8');
  assert(formsUiSource.includes('data-grouped-field="dyehouse"'), 'order form: grouped pricing rows must carry dyehouse');
  assert(formsUiSource.includes('data-grouped-field="weavingSource"'), 'order form: grouped pricing rows must carry weaving source');
  assert(formsUiSource.includes('data-grouped-field="accessorySummary"'), 'order form: grouped pricing rows must show accessory summary');
  assert(appSource.includes('accessoryLines:item.accessoryLines || []'), 'pricing conversion: grouped order review must show accessory lines');
  assert(appSource.includes('dyehouse:item.dyehouse || pricingDraft.dyehouse'), 'order save: grouped order item dyehouse must be preserved before pricing fallback');
  assert(appSource.includes('weavingSource:item.weavingSource || pricingDraft.weavingSource'), 'order save: grouped order item weaving source must be preserved before pricing fallback');
}

function checkWeavingSupplierDeliveryPermitLabels() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  assert(appSource.includes('إذن تسليم خام من مورد النسيج للمصبغة'), 'raw dispatch: document title must identify the weaving supplier as permit issuer');
  assert(appSource.includes('رقم إذن مورد النسيج'), 'raw dispatch: permit number must be labeled as the weaving supplier permit');
  assert(appSource.includes('المصبغة المستلمة'), 'raw dispatch: dyehouse must be identified as the receiving party');
  assert(!appSource.includes("dyehouse: 'أمر صرف للمصبغة'"), 'raw dispatch: legacy misleading title must not return');
}

function checkFinishedReceivingTracksActualDyehouse() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const backendSource = fs.readFileSync(path.join(__dirname, '..', 'backend', 'server.js'), 'utf8');
  const mssqlSource = fs.readFileSync(path.join(__dirname, '..', 'backend', 'db-mssql.js'), 'utf8');
  assert(appSource.includes("dyehouseSelect.name = 'dyehouse'"), 'finished receiving: new entry must select the actual source dyehouse');
  assert(appSource.includes("field('المصبغة المستلم منها', 'dyehouse'"), 'finished receiving: editor must expose the actual source dyehouse');
  assert(appSource.includes('batch?.dyehouse || allocation.dyehouse'), 'finished receiving: movement label must prefer batch dyehouse over allocation default');
  assert(backendSource.includes("finished_receiving_batches: ['id','order_id','allocation_id','batch_date','quantity','dyehouse'"), 'finished receiving: backend must persist batch dyehouse');
  assert(mssqlSource.includes("addColumnIfMissing('finished_receiving_batches', 'dyehouse TEXT')"), 'finished receiving: SQL Server migration must add batch dyehouse');
}

function checkGroupedPricingVerifyUsesItemsJson() {
  const guardsSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'persistenceGuards.js'), 'utf8');
  assert(guardsSource.includes('function pricingPersistenceMatches'), 'pricing save: grouped pricing verification must use a dedicated matcher');
  assert(guardsSource.includes('parseDbJsonArray(row.pricing_items_json)'), 'pricing save: grouped pricing verification must inspect saved price items JSON');
  assert(guardsSource.includes('savedItems.length !== expectedItems.length'), 'pricing save: grouped pricing verification must compare item counts');
}

function checkPricingSaveBypassesLegacyHiddenRequiredFields() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const indexSource = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert(indexSource.includes('id="savePricingBtn"'), 'pricing save: explicit save button must exist');
  assert(indexSource.includes('type="button" id="savePricingBtn"'), 'pricing save: button must bypass native hidden-field validation');
  assert(appSource.includes("'pricingForm','savePricingBtn','pricingNumber'"), 'pricing save: save button must be registered in refs');
  assert(appSource.includes("field.removeAttribute('required')"), 'pricing save: legacy hidden fields must remove required attributes');
  assert(appSource.includes('field.disabled = true'), 'pricing save: legacy hidden fields must be disabled');
  assert(appSource.includes("field.setAttribute('data-pricing-legacy-disabled', 'true')"), 'pricing save: legacy hidden fields must be marked disabled');
  assert(appSource.includes('function validatePricingPayloadForSave'), 'pricing save: app-level validation must replace hidden native validation');
  assert(appSource.includes('refs.savePricingBtn.onclick = refs.pricingForm.onsubmit'), 'pricing save: explicit save button must call pricing save handler');
}

function checkOrderQuotationUsesLinkedPricingCard() {
  const documentsUiSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'documentsUi.js'), 'utf8');
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const pricingUiSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'pricingUi.js'), 'utf8');
  assert(documentsUiSource.includes("if (type === 'quotation')"), 'documents ui: quotation branch must be explicit');
  assert(documentsUiSource.includes('deps.openPricingQuotation(orderPricing.id)'), 'documents ui: order quotation must use linked pricing card when available');
  assert(documentsUiSource.includes('عرض السعر المرتبط'), 'documents ui: linked quotation action must be clear to the user');
  assert(appSource.includes('alreadyConverted') && appSource.includes('pricingConvertedByOrder(sourcePricing || pricing)'), 'quotation document: converted pricing cards must not offer duplicate order conversion');
  assert(appSource.includes('function linkedOperationalOrderForPricing'), 'quotation document: accepted pricing must locate its linked operational order');
  assert(appSource.includes('function pricingContractSourceForOrder'), 'quotation document: accepted card rates must merge with current operational quantities');
  assert(appSource.includes('const contractSource = pricingContractSourceForOrder(sourcePricing, operationalOrder);'), 'quotation document: quotation and costing must calculate from the linked operational contract source');
  assert(appSource.includes('operationalOrder?.allocations?.map'), 'quotation document: color rows must come from the operational color distribution table');
  assert(pricingUiSource.includes('تحويل لطلب تشغيل'), 'pricing ui: conversion action must be explicitly labelled as an order conversion');
}

function checkSeparateWorkspaceModules() {
  const indexSource = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const navigationSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'navigation.js'), 'utf8');
  const focusSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'focusViews.js'), 'utf8');
  const stylesSource = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  assert(indexSource.includes('class="panel pricing-panel" data-module-panel="pricing"'), 'navigation: pricing must be a standalone module panel');
  assert(indexSource.includes('id="aiModelPanel" data-module-panel="ai"'), 'navigation: AI must be a standalone module panel');
  assert(indexSource.includes('id="statsGrid" data-module-panel="dashboard"'), 'navigation: dashboard stats must stay only in dashboard');
  assert(indexSource.includes('class="panel orders-list-panel" data-module-panel="orders"'), 'navigation: general orders list must be its own module panel');
  assert(indexSource.includes('id="weavingOrdersPanel" data-module-panel="weaving"'), 'navigation: weaving must have its own operational list panel');
  assert(indexSource.includes('id="dyehouseOrdersPanel" data-module-panel="dyehouse"'), 'navigation: dyehouse must have its own operational list panel');
  assert(indexSource.includes('id="warehouseOrdersPanel" data-module-panel="warehouse"'), 'navigation: warehouse must have its own operational list panel');
  assert(indexSource.includes('id="weavingOrdersTableBody"'), 'navigation: weaving list must not reuse the general orders table body');
  assert(indexSource.includes('id="dyehouseOrdersTableBody"'), 'navigation: dyehouse list must not reuse the general orders table body');
  assert(indexSource.includes('id="warehouseOrdersTableBody"'), 'navigation: warehouse list must not reuse the general orders table body');
  assert(indexSource.includes('class="workspace-grid module-hidden" data-module-panel="order-details"'), 'navigation: order details must be its own module');
  assert(!indexSource.includes('data-module-panel="dashboard sales weaving dyehouse warehouse reports"'), 'navigation: orders list must not be shared across every module');
  assert(!indexSource.includes('data-module-panel="sales reports"'), 'navigation: pricing list must not be shared with reports/sales aggregate');
  assert(!indexSource.includes('data-module-action="warehouse" data-nav-action="report:inventory"'), 'navigation: warehouse menu must not duplicate inventory report');
  assert(navigationSource.includes("setWorkspaceModule('pricing')"), 'navigation: pricing action must open pricing module');
  assert(navigationSource.includes("setWorkspaceModule('orders')"), 'navigation: orders action must open orders module');
  assert(navigationSource.includes("setWorkspaceModule('ai')"), 'navigation: AI action must open AI module');
  assert(navigationSource.includes("'stage:weaving': '#weavingOrdersPanel'"), 'navigation: weaving shortcut must scroll to the weaving screen');
  assert(navigationSource.includes("'stage:dyehouse': '#dyehouseOrdersPanel'"), 'navigation: dyehouse shortcut must scroll to the dyehouse screen');
  assert(navigationSource.includes("'stage:warehouse': '#warehouseOrdersPanel'"), 'navigation: warehouse shortcut must scroll to the warehouse screen');
  assert(focusSource.includes("deps.setWorkspaceModule('order-details')"), 'navigation: opening an order must switch to order-details module');
  assert(focusSource.includes('const wasFocused = deps.getOrderFocusMode()'), 'navigation: closing order focus must know whether an order was actually focused');
  assert(focusSource.includes('if (wasFocused) deps.setWorkspaceModule(previousOrderListModule ||'), 'navigation: closing inactive order focus must not override the requested module');
  assert(stylesSource.includes('body[data-active-module="pricing"] .main-workspace'), 'navigation: CSS must expose pricing module workspace');
  assert(stylesSource.includes('body[data-active-module="order-details"] .main-workspace'), 'navigation: CSS must expose order-details module workspace');
}

function checkManualAccessoryDistribution() {
  const frontend = frontendManualAccessorySummary();
  assertClose(frontend.accessoryRequired, 70, 'accessory: manual total is preserved');
  assertClose(frontend.allocations[0].accessoryQuantity, 35, 'accessory: first color receives proportional accessory quantity');
  assertClose(frontend.allocations[1].accessoryQuantity, 35, 'accessory: second color receives proportional accessory quantity');
}

function checkPerColorAccessoryDistribution() {
  const frontend = frontendPerColorAccessorySummary();
  assertClose(frontend.allocations[0].accessoryQuantity, 20, 'accessory: first color keeps its manual derby kilos');
  assertClose(frontend.allocations[1].accessoryQuantity, 60, 'accessory: second color keeps its manual derby kilos');
  assertClose(frontend.accessoryRequired, 80, 'accessory: per-color derby kilos become the order accessory total');
  assertClose(frontend.accessoryLines[0].percent, 8, 'accessory: per-color derby kilos calculate the correct order percentage');
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  assert(appSource.includes('data-allocation-derby-unit'), 'accessory ui: per-color derby entry must accept percent or kilograms');
  assert(appSource.includes('data-derby-uniform-unit'), 'accessory ui: uniform derby entry must also accept percent or kilograms');
  assert(appSource.includes('accessoryInputUnit:uniformUnit'), 'accessory ui: uniform derby value must be copied into every saved color row');
  assert(appSource.includes("value !== ''"), 'accessory ui: zero derby must be accepted while a truly blank value is rejected');
  assert(appSource.includes('if (hasAllocationManual)'), 'accessory documents: saved per-color kilos, including zero, must take precedence over proportional distribution');
  assert(appSource.includes('existingRows.map((row)=>allocationEntryRowHtml(order, row))'), 'accessory ui: color manager must preload existing colors');
  assert(appSource.includes('const allocationTotal = roundNumber(createdAllocations.reduce'), 'order quantity: saved single-width color distribution must calculate its authoritative total');
  assert(appSource.includes('totalRawQuantity:allocationTotal'), 'order quantity: order header must synchronize with the color distribution total');
  assert(appSource.includes("order.widthMode !== 'multiple'"), 'order quantity: multi-width orders must keep their dedicated width-distribution total');
}

function checkWhatsappAccountReplacement() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const serviceSource = fs.readFileSync(path.join(__dirname, '..', 'whatsapp-service', 'server.js'), 'utf8');
  assert(appSource.includes('data-change-whatsapp-account'), 'WhatsApp account: settings must expose an explicit change-account action');
  assert(appSource.includes("confirm:'CHANGE_ACCOUNT'"), 'WhatsApp account: reset request must require explicit confirmation');
  assert(serviceSource.includes("app.post('/api/session/reset'"), 'WhatsApp account: service must provide a session reset endpoint');
  assert(serviceSource.includes('previousClient.removeAllListeners()'), 'WhatsApp account: old client reconnect events must be disabled before logout');
  assert(serviceSource.includes('fs.rmSync(sessionsDir, { recursive:true, force:true'), 'WhatsApp account: old local authentication session must be removed');
  assert(serviceSource.includes('await initializeWhatsappClient()'), 'WhatsApp account: service must immediately create a fresh QR session');
}

function checkOrderBusinessModes() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const ordersUiSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'ordersUi.js'), 'utf8');
  const backendSource = fs.readFileSync(path.join(__dirname, '..', 'backend', 'server.js'), 'utf8');
  const mssqlSchema = fs.readFileSync(path.join(__dirname, '..', 'backend', 'schema.mssql.sql'), 'utf8');
  assert(appSource.includes('id="orderType"'), 'order type: request form must offer trade or manufacturing-only');
  assert(appSource.includes('id = \'orderTypeFilter\''), 'order type: operations list must have an independent type filter');
  assert(appSource.includes("orderType: row.order_type === 'manufacturing'"), 'order type: SQL value must map into runtime orders');
  assert(appSource.includes("order_type: order.orderType === 'manufacturing'"), 'order type: selected value must persist to SQL Server');
  assert(appSource.includes("if (order?.orderType === 'manufacturing') return 0"), 'order type: manufacturing-only orders must exclude purchased fabric cost');
  assert(appSource.includes("order.orderType === 'manufacturing' ? { ...item, rawCost:0 }"), 'order type: linked contract costing must exclude raw fabric for manufacturing-only');
  assert(ordersUiSource.includes("order.orderType === 'manufacturing' ? 'مصنعية فقط' : 'بيع وشراء'"), 'order type: operating rows must visibly identify each business mode');
  assert(backendSource.includes("'order_type'"), 'order type: backend CRUD allowlist must include order_type');
  assert(mssqlSchema.includes('order_type NVARCHAR(40)'), 'order type: SQL Server schema must persist the business mode');
}

function checkFullBatchPermitEditor() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  assert(appSource.includes('function openBatchEditorDialog(type, batch)'), 'movement permit: clicking a saved movement must open a complete editor');
  assert(appSource.includes('data-batch-editor-save'), 'movement permit: editor must provide an explicit save action');
  assert(appSource.includes('data-batch-editor-delete'), 'movement permit: authorized users must be able to delete the permit from the editor');
  assert(appSource.includes('name="noteNumber"'), 'movement permit: permit number must remain directly editable');
  assert(appSource.includes('name="sourceDocumentFile"'), 'movement permit: raw permit image must be visible and replaceable');
  assert(appSource.includes('title="اضغط لفتح الإذن كاملًا"'), 'movement permit: the whole saved row must be clickable');
  assert(appSource.includes("await deleteBatch(type, id, { confirmed:true })"), 'movement permit: confirmed editor deletion must use the protected backend delete path');
}

function checkMultiWidthOrderRowsKeepWidthLabels() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  assert(appSource.includes('function allocationWidthLabel(order, allocation)'), 'multi-width orders: shared width label helper must exist');
  assert(appSource.includes('function allocationMovementLabel(order, allocation)'), 'multi-width orders: movement label must include the width label');
  assert(appSource.includes('<td>${escapeHtml(allocationWidthLabel(order, allocation))}</td>'), 'multi-width orders: color plan rows must show the related width label');
  const movementUses = appSource.match(/allocationMovementLabel\(order, allocation\), batch\.quantity/g) || [];
  assert(movementUses.length >= 2, 'multi-width orders: receiving and return movement rows must show the related width label');
  assert(appSource.includes('accessoryAllocationLabel(batch)'), 'multi-width orders: accessory receiving rows must keep the related width label');
  assert(appSource.includes('transferAllocationLabel(batch)'), 'multi-width orders: dyehouse transfer rows must keep the related width label');
}

function checkBatchPermitAuditDetails() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const stylesSource = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  assert(appSource.includes('function batchEditorAuditHtml(batch)'), 'movement permit: editor must render saved audit details');
  assert(appSource.includes("batch?.createdBy || batch?.created_by || 'غير مسجل'"), 'movement permit: editor must show the original creator');
  assert(appSource.includes("batch?.updatedBy || batch?.updated_by || 'لم يعدل بعد'"), 'movement permit: editor must show the last editor');
  assert(appSource.includes('${batchEditorAuditHtml(batch)}'), 'movement permit: every permit editor must include its audit panel');
  assert(stylesSource.includes('.batch-editor-audit-grid'), 'movement permit: audit details must have a responsive visible layout');
}

function checkDisconnectedWriteDraftProtection() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  assert(appSource.includes("const WRITE_DRAFT_STORAGE_KEY = '2btex.unsavedWriteDrafts.v1'"), 'offline writes: unsaved permit edits must have durable local draft storage');
  assert(appSource.includes('savePermitDraft(type, batch.id'), 'offline writes: permit values must be captured before attempting the server save');
  assert(appSource.includes('loadPermitDraft(type, batch.id)'), 'offline writes: reopening a permit must restore its interrupted edit');
  assert(appSource.includes('لم تُمسح الحقول التي أدخلتها'), 'offline writes: failed saves must clearly tell the user that entered fields remain');
  assert(!appSource.includes("alert(message || 'تعذر تثبيت التعديل في قاعدة البيانات. سيتم الرجوع لآخر بيانات محفوظة.');\n  await loadBackendData();"), 'offline writes: a failed save must not unconditionally reload and erase the active form');
}

function checkOperationalHealthCenter() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const stylesSource = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  assert(appSource.includes('function permitDraftRows()'), 'health center: interrupted permit drafts must be listed centrally');
  assert(appSource.includes('function operationalBalanceAuditRows()'), 'health center: operational balances must be audited centrally');
  assert(appSource.includes('data-open-write-draft'), 'health center: an interrupted draft must be reopenable');
  assert(appSource.includes('data-open-audit-order'), 'health center: a balance issue must open its related order');
  assert(appSource.includes("['المزامنة اللحظية', realtimeOk"), 'health center: realtime synchronization state must be visible');
  assert(appSource.includes("['واتساب', whatsappOk"), 'health center: WhatsApp state must be visible');
  assert(stylesSource.includes('.system-health-grid'), 'health center: service state cards must have a responsive layout');
}

function checkOperationalAiManagerRules() {
  const serverSource = fs.readFileSync(path.join(__dirname, '..', 'backend', 'server.js'), 'utf8');
  const aiEmployeeSource = fs.readFileSync(path.join(__dirname, '..', 'backend', 'aiEmployee.js'), 'utf8');
  const backendAiSource = `${serverSource}\n${aiEmployeeSource}`;
  const aiUiSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'aiUi.js'), 'utf8');
  const operationalAiSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'operationalAiManager.js'), 'utf8');
  assert(backendAiSource.includes('function buildOperationalDashboardReport'), 'ai: backend must have deterministic operational manager report');
  assert(backendAiSource.includes("source: 'railway-operational-manager'"), 'ai: general employee report must identify operational manager source');
  assert(backendAiSource.includes('function compactAiEmployeeModelPayload'), 'ai: model calls must use a compact 2B operational payload');
  assert(backendAiSource.includes('function runAiEmployeeModelReport'), 'ai: employee report must call the configured AI model when available');
  assert(backendAiSource.includes('function buildEnhancedOperationalCommandReport'), 'ai: employee report must route direct operational commands before model calls');
  assert(serverSource.includes('buildEnhancedOperationalCommandReport(context, userRequest)'), 'ai: employee endpoint must use the enhanced direct command layer');
  assert(backendAiSource.includes('function buildOrderLookupCommandReport'), 'ai: direct command layer must answer order-number questions deterministically');
  assert(backendAiSource.includes('function buildDyehouseBalanceCommandReport'), 'ai: direct command layer must answer dyehouse balance questions deterministically');
  assert(backendAiSource.includes('function buildWarehouseReadyCommandReport'), 'ai: direct command layer must answer ready-to-deliver and warehouse questions deterministically');
  assert(backendAiSource.includes('function buildDelayedOrdersCommandReport'), 'ai: direct command layer must answer delayed-order questions deterministically');
  assert(backendAiSource.includes('function buildWasteCommandReport'), 'ai: direct command layer must answer waste questions deterministically');
  assert(backendAiSource.includes('if (process.env.GEMINI_API_KEY)'), 'ai: Gemini must be supported for the real 2B AI employee');
  assert(backendAiSource.includes('if (process.env.OPENAI_API_KEY)'), 'ai: OpenAI fallback must be supported for the real 2B AI employee');
  assert(backendAiSource.includes('rulesBaseline'), 'ai: model output must be grounded by deterministic 2B operational rules');
  assert(serverSource.includes('questionFocus.active ? buildFocusedEmployeeReport(data) : buildOperationalDashboardReport(data)'), 'ai: focused and general reports must have separate baselines');
  assert(backendAiSource.includes('compactOperationalOrder'), 'ai: backend response must include concrete operational order facts');
  assert(backendAiSource.includes('لا توجد أوامر مطابقة للسؤال'), 'ai: focused no-match response must not fall back to a generic report');
  assert(aiUiSource.includes('buildLocalAiEmployeeResponse'), 'ai: frontend must keep local fallback if the AI endpoint is unavailable');
  assert(operationalAiSource.includes('data-ai-open-order'), 'ai: dashboard rows must open the selected operational order');
  assert(operationalAiSource.includes('أهم إجراء اليوم'), 'ai: dashboard must show a concrete daily action');
}

checkBackendFlow();
checkFrontendFlow();
checkFrontendBackendParity();
checkPricingUiUsesOperationalWaste();
checkWasteDisplaysUseFinishedWeight();
checkMultiColorOperationalEntry();
checkOversentFinishedOrderKeepsExtraAtDyehouse();
checkAllocationLinkedRawDispatchStaysPerColor();
checkOrderLevelRawDispatchDistributesByColorPlan();
checkDyeingDocumentShowsPhysicalRawBalance();
checkDyeingDocumentSplitsMultiDyehouseOrder();
checkLegacyPartialTransferUsesActualQuantity();
checkDetailedReportSplitsRawTransferByDyehouse();
checkDetailedReportUsesDispatchDyehouse();
checkDyeingOrderPickerUsesDispatchDyehouses();
checkDetailedReportRejectsForeignDyehouseTransfers();
checkOrderLevelRawTransferCanStillSplitSingleAllocationDyehouseBalance();
checkDyehouseTransferKindsAreSeparated();
checkBodyLabelOnlyAppearsWithAccessories();
checkWarehouseTabKeepsInventorySection();
checkNoRawWarehouseDashboardTerminology();
checkUsdPricingConvertsEgpProfit();
checkUsdPricingMatchesExcelSheet();
checkAccessoryPricingUsesWasteAndProfit();
checkLegacyPricingItemsInheritCardTerms();
checkPricingCurrencyBadgesExist();
checkWeavingDocumentLayoutUsesPreparedSpecs();
checkOrderPreparedSpecsPersistence();
checkWeavingSupplierDeliveryPermitLabels();
checkFinishedReceivingTracksActualDyehouse();
checkCollarAccessoryMeasurements();
checkPersistentOrderBalances();
checkDesktopConnectionIndicatorRecovery();
checkPricingGroupedPriceViewExists();
checkPricingActiveAndLinkedSectionsExist();
checkFixedPackagingPricingStageExists();
checkPricingListFiltersAndOrderNumber();
checkVisibleVersionSynchronization();
checkRealtimeOperationalSynchronization();
checkNamedColorApproximation();
checkAccessoryRawDeliveryPermit();
checkDesktopPdfExportsOnlyDocumentSheet();
checkClosedOrdersStayOutOfOperatingLists();
checkPricingToOrderCarriesGroupedOperationalFields();
checkGroupedPricingVerifyUsesItemsJson();
checkPricingSaveBypassesLegacyHiddenRequiredFields();
checkOrderQuotationUsesLinkedPricingCard();
checkSeparateWorkspaceModules();
checkManualAccessoryDistribution();
checkPerColorAccessoryDistribution();
checkWhatsappAccountReplacement();
checkOrderBusinessModes();
checkFullBatchPermitEditor();
checkBatchPermitAuditDetails();
checkDisconnectedWriteDraftProtection();
checkOperationalHealthCenter();
checkMultiWidthOrderRowsKeepWidthLabels();
checkOperationalAiManagerRules();

console.log('Operational flow check passed.');

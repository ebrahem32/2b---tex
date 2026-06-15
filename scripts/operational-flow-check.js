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

function checkPricingCurrencyBadgesExist() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  assert(appSource.includes('data-pricing-currency-badge="pricing"'), 'pricing ui: selected currency badge must appear beside pricing-currency money inputs');
  assert(appSource.includes('data-pricing-currency-badge="egp"'), 'pricing ui: EGP badge must appear beside EGP-entered money inputs');
  assert(appSource.includes('updatePricingCurrencyBadges'), 'pricing ui: currency badges must update when currency changes');
  assert(appSource.includes('pricingFormulaPreview'), 'pricing ui: formula preview must explain the visible pricing result');
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
  assert(appSource.includes("name:'تغليف', price:2, fixed:true"), 'pricing ui: packaging stage must be fixed at 2 EGP');
  assert(appSource.includes("fixedPackaging ? 2"), 'pricing ui: fixed packaging stage price must stay 2');
  assert(appSource.includes("fixedPackaging ? '<span class=\"status pending\">ثابت</span>'"), 'pricing ui: fixed packaging stage must not show delete action');
}

function checkPricingListFiltersAndOrderNumber() {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const indexSource = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const pricingUiSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'pricingUi.js'), 'utf8');
  assert(pricingUiSource.includes('pricingNumber: calculated.orderNumber || nextOrderPricingNumber(calculated)'), 'pricing ui: cards opened from existing orders must keep the order number');
  assert(pricingUiSource.includes('pricingRowsForReport'), 'pricing ui: filtered pricing rows must be exposed for printing');
  assert(indexSource.includes('pricingSearchInput') && indexSource.includes('pricingCustomerFilter') && indexSource.includes('pricingStatusFilter'), 'pricing ui: pricing list must have standalone filters');
  assert(indexSource.includes('printFilteredPricingsBtn'), 'pricing ui: filtered pricing list must be printable');
  assert(appSource.includes('openFilteredPricingsReport'), 'pricing ui: filtered pricing print report must be wired');
  assert(indexSource.includes('<th>رقم الطلب</th><th>العميل</th><th>الصنف</th><th>المصبغة</th><th>الكمية'), 'pricing ui: list must use the unified order number label');
  assert(!appSource.includes('<th>رقم الكرت</th><th>رقم الطلب</th>'), 'pricing print: card and order numbers must not appear as separate columns');
  assert(appSource.includes('الرصيد الفعلي للبيع'), 'pricing print: actual sellable balance must be shown');
  assert(appSource.includes('totalContractsText'), 'pricing print: contract total summary must be calculated');
}

function checkOrderQuotationUsesLinkedPricingCard() {
  const documentsUiSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'documentsUi.js'), 'utf8');
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const pricingUiSource = fs.readFileSync(path.join(__dirname, '..', 'modules', 'pricingUi.js'), 'utf8');
  assert(documentsUiSource.includes("if (type === 'quotation')"), 'documents ui: quotation branch must be explicit');
  assert(documentsUiSource.includes('deps.openPricingQuotation(orderPricing.id)'), 'documents ui: order quotation must use linked pricing card when available');
  assert(documentsUiSource.includes('عرض السعر المرتبط'), 'documents ui: linked quotation action must be clear to the user');
  assert(appSource.includes('alreadyConverted') && appSource.includes('pricingConvertedByOrder(sourcePricing || pricing)'), 'quotation document: converted pricing cards must not offer duplicate order conversion');
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
  assert(indexSource.includes('class="panel orders-list-panel" data-module-panel="orders weaving dyehouse warehouse"'), 'navigation: orders list must be limited to operational list modules');
  assert(indexSource.includes('class="workspace-grid module-hidden" data-module-panel="order-details"'), 'navigation: order details must be its own module');
  assert(!indexSource.includes('data-module-panel="dashboard sales weaving dyehouse warehouse reports"'), 'navigation: orders list must not be shared across every module');
  assert(!indexSource.includes('data-module-panel="sales reports"'), 'navigation: pricing list must not be shared with reports/sales aggregate');
  assert(navigationSource.includes("setWorkspaceModule('pricing')"), 'navigation: pricing action must open pricing module');
  assert(navigationSource.includes("setWorkspaceModule('orders')"), 'navigation: orders action must open orders module');
  assert(navigationSource.includes("setWorkspaceModule('ai')"), 'navigation: AI action must open AI module');
  assert(focusSource.includes("deps.setWorkspaceModule('order-details')"), 'navigation: opening an order must switch to order-details module');
  assert(stylesSource.includes('body[data-active-module="pricing"] .main-workspace'), 'navigation: CSS must expose pricing module workspace');
  assert(stylesSource.includes('body[data-active-module="order-details"] .main-workspace'), 'navigation: CSS must expose order-details module workspace');
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
checkUsdPricingConvertsEgpProfit();
checkUsdPricingMatchesExcelSheet();
checkPricingCurrencyBadgesExist();
checkPricingGroupedPriceViewExists();
checkPricingActiveAndLinkedSectionsExist();
checkFixedPackagingPricingStageExists();
checkPricingListFiltersAndOrderNumber();
checkOrderQuotationUsesLinkedPricingCard();
checkSeparateWorkspaceModules();
checkManualAccessoryDistribution();

console.log('Operational flow check passed.');

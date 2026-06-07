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

function checkBackendFlow() {
  const atDyehouse = backendSummary({ rawReceived: 100, sent: 100, finished: 92, delivered: 0 });
  assertClose(atDyehouse.remainingAtDyehouse, 8, 'backend: dyehouse balance after partial finished receipt');
  assertClose(atDyehouse.warehouseBalance, 92, 'backend: warehouse balance after finished receipt');

  const partialDelivery = backendSummary({ rawReceived: 100, sent: 100, finished: 92, delivered: 50 });
  assertClose(partialDelivery.remainingAtDyehouse, 8, 'backend: customer delivery must not change dyehouse balance');
  assertClose(partialDelivery.warehouseBalance, 42, 'backend: customer delivery reduces warehouse only');

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

checkBackendFlow();
checkFrontendFlow();
checkFrontendBackendParity();
checkMultiColorOperationalEntry();

console.log('Operational flow check passed.');

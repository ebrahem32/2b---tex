function sum(rows, key = 'quantity') {
  return rows.reduce((total, row) => total + Number(row?.[key] || 0), 0);
}

function round(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

const OPERATION_TOLERANCE_PERCENT = 5;

function toleranceFor(quantity) {
  return Math.abs(Number(quantity || 0)) * OPERATION_TOLERANCE_PERCENT / 100;
}

function remainingWithTolerance(target, actual) {
  const remaining = Math.max(Number(target || 0) - Number(actual || 0), 0);
  return remaining <= toleranceFor(target) ? 0 : remaining;
}

function remainingPhysical(target, actual) {
  return round(Math.max(Number(target || 0) - Number(actual || 0), 0));
}

function gluingKey(batch = {}) {
  return String(batch.note_number || batch.noteNumber || batch.partner_fabric || batch.partnerFabric || batch.id || '').trim();
}

function gluingMovement(batch = {}) {
  return String(batch.movement || 'sent');
}

function gluingOrderId(batch = {}) {
  return batch.order_id || batch.orderId || '';
}

function gluingAllocationId(batch = {}) {
  return batch.allocation_id || batch.allocationId || '';
}

function gluingQuantity(batch = {}) {
  return Number(batch.quantity || 0);
}

function gluingMetricsForOrder(order, rows = []) {
  const orderId = order?.id || order?.order_id || order?.orderId || '';
  const groups = rows.reduce((acc, row) => {
    const key = gluingKey(row);
    if (!key) return acc;
    acc[key] = acc[key] || [];
    acc[key].push(row);
    return acc;
  }, {});
  const totals = { sent: 0, returned: 0, received: 0, balance: 0 };
  Object.values(groups).forEach((groupRows) => {
    const allSent = sum(groupRows.filter((row) => gluingMovement(row) === 'sent'));
    const allReturned = sum(groupRows.filter((row) => gluingMovement(row) === 'return'));
    const allReceived = sum(groupRows.filter((row) => gluingMovement(row) === 'received'));
    const netGroupSent = Math.max(allSent - allReturned, 0);
    const sourceRows = groupRows.filter((row) => gluingMovement(row) === 'sent' && gluingOrderId(row) === orderId);
    const sourceKeys = [...new Set(sourceRows.map((row) => `${gluingOrderId(row)}|${gluingAllocationId(row)}`))];
    sourceKeys.forEach((sourceKey) => {
      const [sourceOrderId, sourceAllocationId] = sourceKey.split('|');
      const sent = sum(groupRows.filter((row) => gluingMovement(row) === 'sent' && gluingOrderId(row) === sourceOrderId && gluingAllocationId(row) === sourceAllocationId));
      const returned = sum(groupRows.filter((row) => gluingMovement(row) === 'return' && gluingOrderId(row) === sourceOrderId && gluingAllocationId(row) === sourceAllocationId));
      const netSource = Math.max(sent - returned, 0);
      const receivedShare = netGroupSent ? Math.min(netSource, allReceived * netSource / netGroupSent) : 0;
      totals.sent += sent;
      totals.returned += returned;
      totals.received += receivedShare;
      totals.balance += Math.max(netSource - receivedShare, 0);
    });
  });
  return {
    sent: round(totals.sent),
    returned: round(totals.returned),
    received: round(totals.received),
    balance: round(totals.balance),
  };
}

function calculateOrderSummary(order, data = {}) {
  const rawReceivedRecorded = sum(data.rawReceivingBatches || []);
  const sentToDyehouse = sum(data.dyehouseDeliveryBatches || []);
  const rawReceived = Math.max(rawReceivedRecorded, sentToDyehouse);
  const finishedReceived = sum(data.finishedReceivingBatches || []);
  const customerDelivered = sum(data.customerDeliveryBatches || []);
  const rawReturned = sum(data.rawReturns || []);
  const gluingMetrics = gluingMetricsForOrder(order, data.gluingBatches || []);
  const sentToGluing = gluingMetrics.sent;
  const returnedFromGluing = gluingMetrics.returned;
  const receivedFromGluing = gluingMetrics.received;
  const deliveredFromGluing = 0;
  const gluingBalance = gluingMetrics.balance;
  const gluedProductBalance = 0;
  const requested = Number(order?.total_raw_quantity || order?.totalRawQuantity || 0);
  const dyehouseTarget = sentToDyehouse;
  const rawToleranceQuantity = toleranceFor(requested);
  const isClosed = Boolean(order?.is_closed || order?.operationClosed);
  const wasteQuantity = isClosed ? Math.max(sentToDyehouse - finishedReceived - rawReturned, 0) : 0;
  const wastePercentage = sentToDyehouse ? wasteQuantity / sentToDyehouse * 100 : 0;
  const estimatedWaste = requested * Number(order?.expected_waste_percent || order?.expectedWastePercent || 0) / 100;
  const remainingRawToReceive = remainingWithTolerance(requested, rawReceived);
  const remainingNotSentToDyehouse = remainingWithTolerance(rawReceived, sentToDyehouse);
  const remainingAtDyehouse = remainingPhysical(dyehouseTarget, finishedReceived + rawReturned + wasteQuantity);
  const customerRemainingQuantity = remainingWithTolerance(requested, customerDelivered);
  const warehouseBalance = remainingWithTolerance(finishedReceived + returnedFromGluing, customerDelivered + sentToGluing);
  const operationallyComplete = sentToDyehouse > 0
    && remainingRawToReceive === 0
    && remainingNotSentToDyehouse === 0
    && remainingAtDyehouse === 0
    && customerRemainingQuantity === 0
    && warehouseBalance === 0
    && gluingBalance === 0
    && gluedProductBalance === 0;

  return {
    totalRequestedQuantity: round(requested),
    totalRawReceived: round(rawReceived),
    remainingRawToReceive: round(remainingRawToReceive),
    totalSentToDyehouse: round(sentToDyehouse),
    totalSentToGluing: round(sentToGluing),
    totalReturnedFromGluing: round(returnedFromGluing),
    totalReceivedFromGluing: round(receivedFromGluing),
    totalDeliveredFromGluing: round(deliveredFromGluing),
    gluingBalance: round(gluingBalance),
    remainingNotSentToDyehouse: round(remainingNotSentToDyehouse),
    totalFinishedReceived: round(finishedReceived),
    remainingAtDyehouse: round(remainingAtDyehouse),
    customerDeliveredQuantity: round(customerDelivered),
    customerRemainingQuantity: round(customerRemainingQuantity),
    gluedProductBalance: round(gluedProductBalance),
    warehouseBalance: round(warehouseBalance),
    operationallyComplete,
    rawReturned: round(rawReturned),
    estimatedWasteQuantity: round(estimatedWaste),
    wasteQuantity: round(wasteQuantity),
    wastePercentage: round(wastePercentage)
  };
}

module.exports = { calculateOrderSummary };

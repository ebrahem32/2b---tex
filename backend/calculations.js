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

function calculateOrderSummary(order, data = {}) {
  const rawReceivedRecorded = sum(data.rawReceivingBatches || []);
  const sentToDyehouse = sum(data.dyehouseDeliveryBatches || []);
  const rawReceived = Math.max(rawReceivedRecorded, sentToDyehouse);
  const finishedReceived = sum(data.finishedReceivingBatches || []);
  const customerDelivered = sum(data.customerDeliveryBatches || []);
  const rawReturned = sum(data.rawReturns || []);
  const gluingBatches = data.gluingBatches || [];
  const sentToGluing = sum(gluingBatches.filter((batch) => String(batch?.movement || 'sent') === 'sent'));
  const receivedFromGluing = sum(gluingBatches.filter((batch) => String(batch?.movement || '') === 'received'));
  const deliveredFromGluing = sum(gluingBatches.filter((batch) => String(batch?.movement || '') === 'customer'));
  const gluingBalance = Math.max(sentToGluing - receivedFromGluing, 0);
  const gluedProductBalance = Math.max(receivedFromGluing - deliveredFromGluing, 0);
  const requested = Number(order?.total_raw_quantity || order?.totalRawQuantity || 0);
  const dyehouseTarget = sentToDyehouse && requested ? Math.min(sentToDyehouse, requested) : sentToDyehouse;
  const rawToleranceQuantity = toleranceFor(requested);
  const isClosed = Boolean(order?.is_closed || order?.operationClosed);
  const wasteQuantity = isClosed ? Math.max(sentToDyehouse - finishedReceived - rawReturned, 0) : 0;
  const wastePercentage = sentToDyehouse ? wasteQuantity / sentToDyehouse * 100 : 0;
  const estimatedWaste = requested * Number(order?.expected_waste_percent || order?.expectedWastePercent || 0) / 100;
  const remainingRawToReceive = remainingWithTolerance(requested, rawReceived);
  const remainingNotSentToDyehouse = remainingWithTolerance(rawReceived, sentToDyehouse);
  const remainingAtDyehouse = remainingWithTolerance(dyehouseTarget, finishedReceived + rawReturned + wasteQuantity);
  const customerRemainingQuantity = remainingWithTolerance(requested, customerDelivered);
  const warehouseBalance = remainingWithTolerance(finishedReceived, customerDelivered + sentToGluing);
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

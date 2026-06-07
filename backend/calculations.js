function sum(rows, key = 'quantity') {
  return rows.reduce((total, row) => total + Number(row?.[key] || 0), 0);
}

function round(value) {
  return Math.round(Number(value || 0) * 100) / 100;
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
  const isClosed = Boolean(order?.is_closed || order?.operationClosed);
  const wasteQuantity = isClosed ? Math.max(sentToDyehouse - finishedReceived - rawReturned, 0) : 0;
  const wastePercentage = sentToDyehouse ? wasteQuantity / sentToDyehouse * 100 : 0;
  const estimatedWaste = requested * Number(order?.expected_waste_percent || order?.expectedWastePercent || 0) / 100;

  return {
    totalRequestedQuantity: round(requested),
    totalRawReceived: round(rawReceived),
    remainingRawToReceive: round(Math.max(requested - rawReceived, 0)),
    totalSentToDyehouse: round(sentToDyehouse),
    totalSentToGluing: round(sentToGluing),
    totalReceivedFromGluing: round(receivedFromGluing),
    totalDeliveredFromGluing: round(deliveredFromGluing),
    gluingBalance: round(gluingBalance),
    remainingNotSentToDyehouse: round(Math.max(rawReceived - sentToDyehouse, 0)),
    totalFinishedReceived: round(finishedReceived),
    remainingAtDyehouse: round(Math.max(sentToDyehouse - finishedReceived - rawReturned - wasteQuantity, 0)),
    customerDeliveredQuantity: round(customerDelivered),
    customerRemainingQuantity: round(Math.max(requested - customerDelivered, 0)),
    gluedProductBalance: round(gluedProductBalance),
    warehouseBalance: round(Math.max(finishedReceived - customerDelivered - sentToGluing, 0)),
    rawReturned: round(rawReturned),
    estimatedWasteQuantity: round(estimatedWaste),
    wasteQuantity: round(wasteQuantity),
    wastePercentage: round(wastePercentage)
  };
}

module.exports = { calculateOrderSummary };

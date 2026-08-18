const assert = require('assert');
const { buildCustomerFinancialCenter, buildOrderFinancialCenter } = require('../backend/financial-center');

const trade = buildOrderFinancialCenter({
  order: { id:'o1', order_number:'100', order_type:'trade', total_raw_quantity:1000, kilo_price:300, raw_cost:200, is_closed:0 },
  pricing: { id:'p1', pricing_number:'PC-100', quantity:950, total_price:285000, dye_cost:50 },
  rawReceivingBatches: [{ quantity:1080 }],
  finishedReceivingBatches: [{ quantity:990 }],
  customerDeliveryBatches: [{ quantity:900, unit_price:300, total_price:270000 }],
});
assert.equal(trade.weaving.actualValue, 216000);
assert.equal(trade.dyeing.actualValue, 49500);
assert.equal(trade.revenue.recognizedValue, 270000);
assert.equal(trade.totals.recognizedMargin, 4500);
assert.equal(trade.pricing.linked, true);
assert.equal(trade.pricing.id, 'p1');
assert.equal(trade.pricing.number, 'PC-100');
assert.equal(trade.pricing.totalOffer, 285000);

const manufacturing = buildOrderFinancialCenter({
  order: { id:'o2', order_number:'101', order_type:'manufacturing', total_raw_quantity:500, kilo_price:80, raw_cost:220 },
  pricing: { id:'p2', dye_cost:55 },
  rawReceivingBatches: [{ quantity:500 }],
  finishedReceivingBatches: [{ quantity:480 }],
});
assert.equal(manufacturing.weaving.applicable, false);
assert.equal(manufacturing.weaving.actualValue, 0);
assert.equal(manufacturing.dyeing.actualValue, 26400);

const customer = buildCustomerFinancialCenter({
  customer: { id:'c1', name:'عميل اختبار' },
  orderCenters: [trade, manufacturing],
  account: { openingBalance:1000, payments:[{ amount:50000 }] },
});
assert.equal(customer.weaving.actualValue, 216000);
assert.equal(customer.dyeing.actualValue, 75900);
assert.equal(customer.collections.outstanding, 221000);

console.log('Financial center check passed');

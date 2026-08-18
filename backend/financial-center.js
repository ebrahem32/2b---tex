function number(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function round(value) {
  return Math.round(number(value) * 100) / 100;
}

function sum(rows, selector) {
  return (rows || []).reduce((total, row) => total + number(selector(row)), 0);
}

function parseJson(value, fallback) {
  if (value && typeof value === 'object') return value;
  try {
    return JSON.parse(value || '');
  } catch {
    return fallback;
  }
}

function normalized(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

function isManufacturingOrder(order = {}) {
  const type = normalized(order.order_type || order.orderType);
  return type === 'manufacturing'
    || type === 'manufacture'
    || type.includes('مصنعيه')
    || type.includes('تصنيع');
}

function pricingItems(pricing = {}) {
  const items = parseJson(pricing.pricing_items_json || pricing.priceItems, []);
  return Array.isArray(items) ? items.filter(Boolean) : [];
}

function pricingItemForOrder(order = {}, pricing = {}) {
  const items = pricingItems(pricing);
  if (!items.length) return pricing;
  const fabric = normalized(order.fabric_type || order.fabricType);
  return items.find((item) => normalized(item.fabricType || item.materialType) === fabric)
    || items.find((item) => {
      const itemFabric = normalized(item.fabricType || item.materialType);
      return itemFabric && fabric && (itemFabric.includes(fabric) || fabric.includes(itemFabric));
    })
    || items[0];
}

function exchangeRate(source = {}) {
  const rate = number(source.exchangeRate || source.exchange_rate);
  return rate > 0 ? rate : 1;
}

function rawUnitCostEgp(item = {}, pricing = {}, order = {}) {
  if (isManufacturingOrder(order)) return 0;
  const directOrderCost = number(order.raw_cost || order.rawCost);
  if (directOrderCost > 0) return directOrderCost;
  const raw = number(item.rawCost ?? item.raw_cost ?? pricing.raw_cost ?? pricing.rawCost);
  const currency = String(item.currency || pricing.currency || 'EGP').toUpperCase();
  return currency === 'USD' ? raw * exchangeRate({ ...pricing, ...item }) : raw;
}

function dyeUnitCostEgp(item = {}, pricing = {}) {
  const stages = parseJson(item.dyeStages || item.dye_stages, []);
  if (Array.isArray(stages) && stages.length) {
    return sum(stages, (stage) => stage.price || stage.cost);
  }
  return number(item.dyeCost ?? item.dye_cost ?? pricing.dye_cost ?? pricing.dyeCost);
}

function customerDeliveryRows(rows = []) {
  return rows.filter((row) => !['finished_sale', 'finished_transfer_out'].includes(String(row.movement || '').trim()));
}

function buildOrderFinancialCenter(input = {}) {
  const order = input.order || {};
  const pricing = input.pricing || {};
  const item = pricingItemForOrder(order, pricing);
  const rawRows = input.rawReceivingBatches || [];
  const finishedRows = input.finishedReceivingBatches || [];
  const deliveryRows = customerDeliveryRows(input.customerDeliveryBatches || []);

  const contractQuantity = number(order.total_raw_quantity || order.totalRawQuantity);
  const rawReceivedQuantity = sum(rawRows, (row) => row.quantity);
  const finishedReceivedQuantity = sum(finishedRows, (row) => row.quantity);
  const deliveredQuantity = sum(deliveryRows, (row) => row.quantity);
  const salesUnitPrice = number(order.kilo_price || order.kiloPrice || pricing.unit_price || pricing.unitPrice);
  const rawUnitCost = rawUnitCostEgp(item, pricing, order);
  const dyeUnitCost = dyeUnitCostEgp(item, pricing);
  const deliveredValue = sum(deliveryRows, (row) => number(row.total_price) || number(row.quantity) * (number(row.unit_price) || salesUnitPrice));
  const contractValue = contractQuantity * salesUnitPrice;
  const actualRawValue = rawReceivedQuantity * rawUnitCost;
  const actualDyeValue = finishedReceivedQuantity * dyeUnitCost;
  const estimatedRawValue = contractQuantity * rawUnitCost;
  const estimatedDyeValue = contractQuantity * dyeUnitCost;
  const recognizedRevenue = deliveredValue || (order.is_closed ? contractValue : 0);
  const actualCost = actualRawValue + actualDyeValue;

  return {
    version: 1,
    currency: 'EGP',
    calculationStatus: pricing?.id || order?.pricing_id ? 'linked-pricing' : 'order-fields-only',
    order: {
      id: order.id || '',
      orderNumber: order.order_number || order.orderNumber || '',
      customerId: order.customer_id || order.customerId || '',
      customerName: input.customer?.name || input.customerName || '',
      fabricType: order.fabric_type || order.fabricType || '',
      businessMode: isManufacturingOrder(order) ? 'manufacturing' : 'trade',
    },
    pricing: {
      linked: Boolean(pricing?.id || order?.pricing_id),
      id: pricing?.id || order?.pricing_id || '',
      number: pricing?.pricing_number || pricing?.pricingNumber || '',
      quantity: round(number(pricing?.quantity)),
      totalOffer: round(number(pricing?.total_price || pricing?.totalPrice)),
      source: pricing?.id ? 'pricing-card' : 'order-fields',
    },
    quantities: {
      contract: round(contractQuantity),
      rawReceived: round(rawReceivedQuantity),
      finishedReceived: round(finishedReceivedQuantity),
      customerDelivered: round(deliveredQuantity),
    },
    revenue: {
      unitPrice: round(salesUnitPrice),
      contractValue: round(contractValue),
      recognizedValue: round(recognizedRevenue),
      deliveredValue: round(deliveredValue),
    },
    weaving: {
      applicable: !isManufacturingOrder(order),
      unitCost: round(rawUnitCost),
      estimatedValue: round(estimatedRawValue),
      actualValue: round(actualRawValue),
      quantityBasis: 'raw-received',
    },
    dyeing: {
      unitCost: round(dyeUnitCost),
      estimatedValue: round(estimatedDyeValue),
      actualValue: round(actualDyeValue),
      quantityBasis: 'finished-received',
    },
    totals: {
      estimatedCost: round(estimatedRawValue + estimatedDyeValue),
      actualCost: round(actualCost),
      estimatedMargin: round(contractValue - estimatedRawValue - estimatedDyeValue),
      recognizedMargin: round(recognizedRevenue - actualCost),
    },
    warnings: [
      !pricing?.id && !order?.pricing_id ? 'لا يوجد كرت تسعير مرتبط؛ الحساب يعتمد على حقول الطلب فقط.' : '',
      dyeUnitCost <= 0 ? 'تكلفة الصباغة غير مسجلة.' : '',
      !isManufacturingOrder(order) && rawUnitCost <= 0 ? 'سعر خام النسيج غير مسجل.' : '',
    ].filter(Boolean),
  };
}

function buildCustomerFinancialCenter(input = {}) {
  const centers = input.orderCenters || [];
  const account = input.account || {};
  const openingBalance = number(account.openingBalance || account.opening_balance);
  const payments = Array.isArray(account.payments) ? account.payments : [];
  const paymentTotal = sum(payments, (payment) => payment.amount);
  const total = (path) => round(centers.reduce((value, center) => value + number(path(center)), 0));
  const recognizedSales = total((center) => center.revenue.recognizedValue);

  return {
    version: 1,
    currency: 'EGP',
    customer: input.customer || null,
    ordersCount: centers.length,
    orders: centers,
    weaving: {
      estimatedValue: total((center) => center.weaving.estimatedValue),
      actualValue: total((center) => center.weaving.actualValue),
    },
    dyeing: {
      estimatedValue: total((center) => center.dyeing.estimatedValue),
      actualValue: total((center) => center.dyeing.actualValue),
    },
    revenue: {
      contractValue: total((center) => center.revenue.contractValue),
      recognizedValue: recognizedSales,
    },
    collections: {
      openingBalance: round(openingBalance),
      payments: payments,
      paymentTotal: round(paymentTotal),
      outstanding: round(openingBalance + recognizedSales - paymentTotal),
    },
    totals: {
      estimatedCost: total((center) => center.totals.estimatedCost),
      actualCost: total((center) => center.totals.actualCost),
      estimatedMargin: total((center) => center.totals.estimatedMargin),
      recognizedMargin: total((center) => center.totals.recognizedMargin),
    },
  };
}

module.exports = {
  buildCustomerFinancialCenter,
  buildOrderFinancialCenter,
  isManufacturingOrder,
  pricingItemForOrder,
};

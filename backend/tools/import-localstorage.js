const fs = require('fs');
const path = require('path');

const sourcePath = process.argv[2];
const shouldImport = process.argv.includes('--commit');

const KEYS = {
  orders: '2btex.orders.v4',
  allocations: '2btex.allocations.v4',
  raw: '2btex.raw.v4',
  dye: '2btex.dye.v5',
  finished: '2btex.finished.v4',
  production: '2btex.production.v2',
  customer: '2btex.customer.v2',
  accessory: '2btex.accessory.v1',
  transfers: '2btex.dyehouseTransfers.v1',
  rawReturns: '2btex.rawReturns.v1',
  pricings: '2btex.pricings.v1',
  customerAccounts: '2btex.customerAccounts.v1',
  reportOutbox: '2btex.reportOutbox.v1',
  whatsappSettings: '2btex.whatsappSettings.v1',
  auditLog: '2btex.auditLog.v1',
  whatsappStatus: '2btex.whatsappStatus.v1',
};

if (!sourcePath) {
  console.log('Usage: node tools/import-localstorage.js <localstorage-export.json> [--commit]');
  process.exit(1);
}

function readJson(filePath) {
  const text = fs.readFileSync(path.resolve(filePath), 'utf8').replace(/^\uFEFF/, '');
  return JSON.parse(text);
}

function sourceData(payload) {
  return payload && payload.data && typeof payload.data === 'object' ? payload.data : payload;
}

function rowsFrom(data, key) {
  const value = data[key];
  return Array.isArray(value) ? value : [];
}

function objectValue(data, key) {
  const value = data[key];
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function normalizedField(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function duplicatesBy(rows, getter) {
  const seen = new Map();
  const duplicates = [];
  rows.forEach((row, index) => {
    const value = String(getter(row) || '').trim();
    if (!value) return;
    if (seen.has(value)) duplicates.push({ value, firstIndex: seen.get(value), index });
    else seen.set(value, index);
  });
  return duplicates;
}

function orderCompositeKey(row, includeDate = false) {
  const parts = [normalizedField(row.orderNumber), normalizedField(row.customer), normalizedField(row.fabricType)];
  if (includeDate) parts.push(normalizedField(row.orderDate));
  return parts.join(' | ');
}

function pricingCompositeKey(row, includeDate = false) {
  const parts = [normalizedField(row.pricingNumber), normalizedField(row.customer), normalizedField(row.fabricType)];
  if (includeDate) parts.push(normalizedField(row.pricingDate));
  return parts.join(' | ');
}

function classifyOrderDuplicates(orders) {
  const duplicateExact = duplicatesBy(orders, (row) => orderCompositeKey(row, true) || orderCompositeKey(row, false));
  const byNumber = new Map();
  orders.forEach((row, index) => {
    const number = normalizedField(row.orderNumber);
    if (!number) return;
    if (!byNumber.has(number)) byNumber.set(number, []);
    byNumber.get(number).push({ index, customer: normalizedField(row.customer), fabricType: normalizedField(row.fabricType), orderDate: normalizedField(row.orderDate) });
  });
  const sameOrderNumberDifferentFabric = [];
  byNumber.forEach((items, orderNumber) => {
    const fabrics = [...new Set(items.map((item) => item.fabricType).filter(Boolean))];
    if (fabrics.length > 1) sameOrderNumberDifferentFabric.push({ orderNumber, count: items.length, fabrics, items });
  });
  return { duplicateExact, sameOrderNumberDifferentFabric };
}

function classifyPricingDuplicates(pricings) {
  const duplicateExact = duplicatesBy(pricings, (row) => pricingCompositeKey(row, true) || pricingCompositeKey(row, false));
  const byNumber = new Map();
  pricings.forEach((row, index) => {
    const number = normalizedField(row.pricingNumber);
    if (!number) return;
    if (!byNumber.has(number)) byNumber.set(number, []);
    byNumber.get(number).push({ index, customer: normalizedField(row.customer), fabricType: normalizedField(row.fabricType), pricingDate: normalizedField(row.pricingDate) });
  });
  const samePricingNumberDifferentFabric = [];
  byNumber.forEach((items, pricingNumber) => {
    const fabrics = [...new Set(items.map((item) => item.fabricType).filter(Boolean))];
    const customers = [...new Set(items.map((item) => item.customer).filter(Boolean))];
    if (items.length > 1 && (fabrics.length > 1 || customers.length > 1)) {
      samePricingNumberDifferentFabric.push({ pricingNumber, count: items.length, customers, fabrics, items });
    }
  });
  return { duplicateExact, samePricingNumberDifferentFabric };
}

function allocationOrderLookup(allocations) {
  const lookup = new Map();
  allocations.forEach((allocation) => {
    if (allocation && allocation.id && allocation.orderId) lookup.set(String(allocation.id), allocation.orderId);
  });
  return lookup;
}

function withResolvedOrderId(rows, allocationToOrder) {
  let resolvedFromAllocationId = 0;
  const mapped = rows.map((row) => {
    if (row.orderId || !row.allocationId) return row;
    const resolvedOrderId = allocationToOrder.get(String(row.allocationId));
    if (!resolvedOrderId) return row;
    resolvedFromAllocationId += 1;
    return { ...row, orderId: resolvedOrderId, resolvedOrderIdFromAllocationId: true };
  });
  return { rows: mapped, resolvedFromAllocationId };
}

function splitRawMovements(rawRows) {
  const rawReceiving = [];
  const dyehouseDelivery = [];
  rawRows.forEach((row) => {
    if (normalizedField(row.movementKind).toLowerCase() === 'out') dyehouseDelivery.push(row);
    else rawReceiving.push(row);
  });
  return { rawReceiving, dyehouseDelivery };
}

function missingIndexes(rows, predicate) {
  const indexes = [];
  rows.forEach((row, index) => {
    if (predicate(row)) indexes.push(index);
  });
  return indexes;
}

function uniqueCustomers(orders, pricings, customerAccounts) {
  const names = new Set();
  orders.forEach((row) => row.customer && names.add(String(row.customer).trim()));
  pricings.forEach((row) => row.customer && names.add(String(row.customer).trim()));
  Object.keys(customerAccounts).forEach((name) => name && names.add(String(name).trim()));
  return [...names].filter(Boolean);
}

function batchProblems(rows, allocationRequired = false) {
  return {
    missingOrderId: missingIndexes(rows, (row) => !row.orderId),
    missingAllocationId: allocationRequired ? missingIndexes(rows, (row) => !row.allocationId) : [],
  };
}

function value(row, ...names) {
  for (const name of names) {
    if (row && row[name] !== undefined && row[name] !== null && row[name] !== '') return row[name];
  }
  return null;
}

function numberValue(row, ...names) {
  const raw = value(row, ...names);
  const number = Number(String(raw ?? '').replace(',', '.'));
  return Number.isFinite(number) ? number : 0;
}

function stableId(prefix, raw) {
  const text = normalizedField(raw) || `${prefix}-${Date.now()}-${Math.random()}`;
  return `${prefix}-${Buffer.from(text).toString('hex').slice(0, 48)}`;
}

function customerIdFor(name) {
  return stableId('customer', normalizedField(name));
}

function appendNote(...parts) {
  return parts.filter((part) => normalizedField(part)).join(' | ');
}

function existingIds(db, table) {
  const stmt = db.prepare(`SELECT id FROM ${table}`);
  const ids = new Set();
  while (stmt.step()) ids.add(String(stmt.getAsObject().id));
  stmt.free();
  return ids;
}

function countRows(db, table) {
  const stmt = db.prepare(`SELECT COUNT(*) AS count FROM ${table}`);
  stmt.step();
  const count = Number(stmt.getAsObject().count || 0);
  stmt.free();
  return count;
}

function runInsert(db, sql, params) {
  db.run(sql, params.map((item) => (item === undefined ? null : item)));
}

function knownSets(prepared) {
  return {
    orderIds: new Set(prepared.orders.map((row) => String(row.id || stableId('order', orderCompositeKey(row, true))))),
    pricingIds: new Set(prepared.pricings.map((row) => String(row.id || stableId('pricing', pricingCompositeKey(row, true))))),
    allocationIds: new Set(prepared.allocations.map((row) => String(row.id || stableId('allocation', `${row.orderId}|${row.color}|${row.plannedQuantity}`)))),
  };
}

async function importRows(prepared) {
  const dbModule = require('../db');
  const db = await dbModule.initDb();
  const before = {
    customers: countRows(db, 'customers'),
    pricings: countRows(db, 'pricings'),
    orders: countRows(db, 'orders'),
    allocations: countRows(db, 'order_allocations'),
    raw: countRows(db, 'raw_receiving_batches'),
    dyehouseDelivery: countRows(db, 'dyehouse_delivery_batches'),
    finished: countRows(db, 'finished_receiving_batches'),
    customerDelivery: countRows(db, 'customer_delivery_batches'),
    accessories: countRows(db, 'accessory_batches'),
    transfers: countRows(db, 'dyehouse_transfers'),
  };
  const { orderIds, pricingIds, allocationIds } = knownSets(prepared);

  db.run('BEGIN TRANSACTION;');
  try {
    prepared.customers.forEach((name) => {
      runInsert(db, 'INSERT OR IGNORE INTO customers (id, name, notes) VALUES (?, ?, ?)', [customerIdFor(name), name, 'مستورد من LocalStorage']);
    });

    prepared.pricings.forEach((row) => {
      runInsert(db, `INSERT OR IGNORE INTO pricings (
        id, pricing_number, customer_id, pricing_date, fabric_type, material_type, dyehouse,
        color_class, quantity, inch_width, finished_weight, raw_cost, dye_cost, waste_percent,
        extra_cost, profit_per_kg, unit_price, total_price, payment_terms, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        row.id || stableId('pricing', pricingCompositeKey(row, true)),
        value(row, 'pricingNumber'),
        customerIdFor(value(row, 'customer')),
        value(row, 'pricingDate'),
        value(row, 'fabricType'),
        value(row, 'materialType'),
        value(row, 'dyehouse'),
        value(row, 'colorClass'),
        numberValue(row, 'quantity'),
        numberValue(row, 'inchWidth'),
        numberValue(row, 'finishedWeight'),
        numberValue(row, 'rawCost'),
        numberValue(row, 'dyeCost'),
        numberValue(row, 'wastePercent'),
        numberValue(row, 'extraCost'),
        numberValue(row, 'profitPerKg'),
        numberValue(row, 'unitPrice', 'salePrice'),
        numberValue(row, 'totalPrice', 'total'),
        value(row, 'paymentTerms'),
        value(row, 'notes'),
        value(row, 'status') || 'active',
      ]);
    });

    prepared.orders.forEach((row) => {
      runInsert(db, `INSERT OR IGNORE INTO orders (
        id, order_number, pricing_id, customer_id, order_date, fabric_type, total_raw_quantity,
        expected_waste_percent, inch_width, kilo_price, payment_terms, dyehouse, weaving_source,
        notes, status, is_closed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        row.id || stableId('order', orderCompositeKey(row, true)),
        value(row, 'orderNumber'),
        pricingIds.has(String(value(row, 'pricingId'))) ? value(row, 'pricingId') : null,
        customerIdFor(value(row, 'customer')),
        value(row, 'orderDate'),
        value(row, 'fabricType'),
        numberValue(row, 'totalRawQuantity'),
        numberValue(row, 'expectedWastePercent'),
        numberValue(row, 'inchWidth'),
        numberValue(row, 'kiloPrice'),
        value(row, 'paymentTerms'),
        value(row, 'dyehouse'),
        value(row, 'weavingSource'),
        value(row, 'notes'),
        value(row, 'status') || 'active',
        row.isClosed || row.is_closed ? 1 : 0,
      ]);
    });

    prepared.allocations.forEach((row) => {
      if (!orderIds.has(String(row.orderId))) return;
      runInsert(db, `INSERT OR IGNORE INTO order_allocations (
        id, order_id, color, pantone_code, planned_quantity, dyehouse, finished_width, finished_weight, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        row.id || stableId('allocation', `${row.orderId}|${row.color}|${row.plannedQuantity}`),
        row.orderId,
        value(row, 'color'),
        value(row, 'pantoneCode', 'pantone'),
        numberValue(row, 'plannedQuantity', 'quantity'),
        value(row, 'dyehouse'),
        numberValue(row, 'targetFinishedWidth', 'finishedWidth'),
        numberValue(row, 'targetFinishedWeight', 'finishedWeight'),
        value(row, 'notes'),
      ]);
    });

    prepared.rawReceiving.forEach((row) => {
      if (!orderIds.has(String(row.orderId))) return;
      runInsert(db, `INSERT OR IGNORE INTO raw_receiving_batches (
        id, order_id, allocation_id, batch_date, quantity, supplier, note_number, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
        row.id || stableId('raw', `${row.orderId}|${row.allocationId}|${row.date}|${row.quantity}|${row.noteNumber}`),
        row.orderId,
        allocationIds.has(String(row.allocationId)) ? row.allocationId : null,
        value(row, 'date', 'batchDate'),
        numberValue(row, 'quantity'),
        value(row, 'supplier'),
        value(row, 'noteNumber'),
        value(row, 'notes'),
      ]);
    });

    prepared.dyehouseDeliveries.forEach((row) => {
      if (!orderIds.has(String(row.orderId))) return;
      runInsert(db, `INSERT OR IGNORE INTO dyehouse_delivery_batches (
        id, order_id, allocation_id, batch_date, quantity, dyehouse, note_number, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
        row.id || stableId('dyehouse', `${row.orderId}|${row.allocationId}|${row.date}|${row.quantity}|${row.noteNumber}`),
        row.orderId,
        allocationIds.has(String(row.allocationId)) ? row.allocationId : null,
        value(row, 'date', 'batchDate'),
        numberValue(row, 'quantity'),
        value(row, 'dyehouse') || value(row, 'supplier'),
        value(row, 'noteNumber'),
        value(row, 'notes'),
      ]);
    });

    prepared.finishedRows.forEach((row) => {
      if (!orderIds.has(String(row.orderId))) return;
      runInsert(db, `INSERT OR IGNORE INTO finished_receiving_batches (
        id, order_id, allocation_id, batch_date, quantity, finished_width, finished_weight, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
        row.id || stableId('finished', `${row.orderId}|${row.allocationId}|${row.date}|${row.quantity}`),
        row.orderId,
        allocationIds.has(String(row.allocationId)) ? row.allocationId : null,
        value(row, 'date', 'batchDate'),
        numberValue(row, 'quantity'),
        numberValue(row, 'finishedWidth', 'width'),
        numberValue(row, 'finishedWeight', 'weight'),
        value(row, 'notes'),
      ]);
    });

    prepared.customerRows.forEach((row) => {
      if (!orderIds.has(String(row.orderId))) return;
      runInsert(db, `INSERT OR IGNORE INTO customer_delivery_batches (
        id, order_id, allocation_id, batch_date, quantity, notes
      ) VALUES (?, ?, ?, ?, ?, ?)`, [
        row.id || stableId('customerDelivery', `${row.orderId}|${row.allocationId}|${row.date}|${row.quantity}`),
        row.orderId,
        allocationIds.has(String(row.allocationId)) ? row.allocationId : null,
        value(row, 'date', 'batchDate'),
        numberValue(row, 'quantity'),
        value(row, 'notes'),
      ]);
    });

    prepared.accessories.forEach((row) => {
      if (!orderIds.has(String(row.orderId))) return;
      runInsert(db, `INSERT OR IGNORE INTO accessory_batches (
        id, order_id, allocation_id, accessory_type, quantity, notes
      ) VALUES (?, ?, ?, ?, ?, ?)`, [
        row.id || stableId('accessory', `${row.orderId}|${row.allocationId}|${row.accessoryType}|${row.quantity}`),
        row.orderId,
        allocationIds.has(String(row.allocationId)) ? row.allocationId : null,
        value(row, 'accessoryType', 'type'),
        numberValue(row, 'quantity'),
        appendNote(value(row, 'notes'), value(row, 'date') && `التاريخ: ${value(row, 'date')}`, value(row, 'noteNumber') && `رقم الإذن: ${value(row, 'noteNumber')}`, value(row, 'movement') && `الحركة: ${value(row, 'movement')}`),
      ]);
    });

    prepared.rawReturns.forEach((row) => {
      if (!orderIds.has(String(row.orderId))) return;
      runInsert(db, `INSERT OR IGNORE INTO raw_returns (
        id, order_id, allocation_id, batch_date, quantity, reason, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
        row.id || stableId('rawReturn', `${row.orderId}|${row.allocationId}|${row.date}|${row.quantity}`),
        row.orderId,
        allocationIds.has(String(row.allocationId)) ? row.allocationId : null,
        value(row, 'date', 'batchDate'),
        numberValue(row, 'quantity'),
        value(row, 'reason'),
        value(row, 'notes'),
      ]);
    });

    prepared.transfers.forEach((row) => {
      if (!orderIds.has(String(row.orderId))) return;
      runInsert(db, `INSERT OR IGNORE INTO dyehouse_transfers (
        id, order_id, from_allocation_id, to_allocation_id, from_dyehouse, to_dyehouse, quantity, transfer_date, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        row.id || stableId('transfer', `${row.orderId}|${row.allocationId}|${row.newAllocationId}|${row.quantity}|${row.date}`),
        row.orderId,
        allocationIds.has(String(row.allocationId)) ? row.allocationId : null,
        allocationIds.has(String(row.newAllocationId)) ? row.newAllocationId : null,
        value(row, 'fromDyehouse'),
        value(row, 'toDyehouse'),
        numberValue(row, 'quantity'),
        value(row, 'date', 'transferDate'),
        appendNote(value(row, 'notes'), value(row, 'reason'), value(row, 'noteNumber') && `رقم الإذن: ${value(row, 'noteNumber')}`),
      ]);
    });

    db.run('COMMIT;');
    fs.writeFileSync(dbModule.DB_PATH, Buffer.from(db.export()));
  } catch (error) {
    db.run('ROLLBACK;');
    throw error;
  }

  const after = {
    customers: countRows(db, 'customers'),
    pricings: countRows(db, 'pricings'),
    orders: countRows(db, 'orders'),
    allocations: countRows(db, 'order_allocations'),
    raw: countRows(db, 'raw_receiving_batches'),
    dyehouseDelivery: countRows(db, 'dyehouse_delivery_batches'),
    finished: countRows(db, 'finished_receiving_batches'),
    customerDelivery: countRows(db, 'customer_delivery_batches'),
    accessories: countRows(db, 'accessory_batches'),
    transfers: countRows(db, 'dyehouse_transfers'),
  };
  return { before, after };
}

async function main() {
  const payload = readJson(sourcePath);
  const data = sourceData(payload);

  const orders = rowsFrom(data, KEYS.orders);
  const pricings = rowsFrom(data, KEYS.pricings);
  const allocations = rowsFrom(data, KEYS.allocations);
  const raw = rowsFrom(data, KEYS.raw);
  const dye = rowsFrom(data, KEYS.dye);
  const finished = rowsFrom(data, KEYS.finished);
  const production = rowsFrom(data, KEYS.production);
  const customer = rowsFrom(data, KEYS.customer);
  const accessory = rowsFrom(data, KEYS.accessory);
  const rawReturns = rowsFrom(data, KEYS.rawReturns);
  const transfers = rowsFrom(data, KEYS.transfers);
  const reportOutbox = rowsFrom(data, KEYS.reportOutbox);
  const auditLog = rowsFrom(data, KEYS.auditLog);
  const customerAccounts = objectValue(data, KEYS.customerAccounts);
  const allocationToOrder = allocationOrderLookup(allocations);
  const rawMovementMapping = splitRawMovements(raw);
  const finishedSource = production.length ? production : finished;
  const resolvedFinished = withResolvedOrderId(finishedSource, allocationToOrder);
  const resolvedCustomer = withResolvedOrderId(customer, allocationToOrder);
  const dyehouseDeliveries = [...dye, ...rawMovementMapping.dyehouseDelivery];
  const customers = uniqueCustomers(orders, pricings, customerAccounts);

  const issues = {
    ordersWithoutOrderNumber: missingIndexes(orders, (row) => !row.orderNumber),
    allocationsWithoutOrderId: missingIndexes(allocations, (row) => !row.orderId),
    batches: {
      raw: batchProblems(rawMovementMapping.rawReceiving, false),
      dyehouse: batchProblems(dyehouseDeliveries, false),
      finished: batchProblems(resolvedFinished.rows, true),
      customer: batchProblems(resolvedCustomer.rows, true),
      accessory: batchProblems(accessory, false),
      rawReturns: batchProblems(rawReturns, true),
      dyehouseTransfers: batchProblems(transfers, false),
    },
  };

  const ignoredBecauseMissingData =
    issues.ordersWithoutOrderNumber.length +
    issues.allocationsWithoutOrderId.length +
    Object.values(issues.batches).reduce((total, item) => total + item.missingOrderId.length + item.missingAllocationId.length, 0);

  const result = {
    dryRun: !shouldImport,
    sourceFile: path.resolve(sourcePath),
    counts: {
      orders: orders.length,
      pricings: pricings.length,
      expectedCustomers: customers.length,
      allocations: allocations.length,
      rawBatches: rawMovementMapping.rawReceiving.length,
      dyehouseBatches: dyehouseDeliveries.length,
      finishedBatches: resolvedFinished.rows.length,
      customerDeliveryBatches: resolvedCustomer.rows.length,
      accessories: accessory.length,
      rawReturns: rawReturns.length,
      dyehouseTransfers: transfers.length,
      reportOutbox: reportOutbox.length,
      auditLog: auditLog.length,
    },
    mapping: {
      [KEYS.orders]: 'orders',
      [KEYS.allocations]: 'order_allocations',
      [KEYS.raw]: 'raw_receiving_batches / dyehouse_delivery_batches by movementKind',
      [KEYS.dye]: 'dyehouse_delivery_batches',
      [KEYS.finished]: 'finished_receiving_batches',
      [KEYS.production]: 'finished_receiving_batches',
      [KEYS.customer]: 'customer_delivery_batches',
      [KEYS.accessory]: 'accessory_batches',
      [KEYS.transfers]: 'dyehouse_transfers',
      [KEYS.rawReturns]: 'raw_returns',
      [KEYS.pricings]: 'pricings',
      [KEYS.reportOutbox]: 'report_outbox',
      [KEYS.auditLog]: 'audit_log',
      [KEYS.whatsappSettings]: 'whatsapp_settings',
    },
    migrationMappingReview: {
      rawReceivingFromRaw: rawMovementMapping.rawReceiving.length,
      dyehouseDeliveryFromRawMovementOut: rawMovementMapping.dyehouseDelivery.length,
      dyehouseDeliveryFromDyeKey: dye.length,
      finishedOrderIdResolvedFromAllocationId: resolvedFinished.resolvedFromAllocationId,
      customerOrderIdResolvedFromAllocationId: resolvedCustomer.resolvedFromAllocationId,
    },
    ignoredBecauseMissingData,
    potentialDuplicates: {
      orders: classifyOrderDuplicates(orders),
      pricings: classifyPricingDuplicates(pricings),
    },
    issues,
    unmapped_data: {
      [KEYS.customerAccounts]: Object.keys(customerAccounts).length,
      [KEYS.whatsappStatus]: data[KEYS.whatsappStatus] ? 1 : 0,
    },
    imported: false,
  };

  if (shouldImport) {
    result.imported = true;
    result.databaseCounts = await importRows({
      customers,
      orders,
      pricings,
      allocations,
      rawReceiving: rawMovementMapping.rawReceiving,
      dyehouseDeliveries,
      finishedRows: resolvedFinished.rows,
      customerRows: resolvedCustomer.rows,
      accessories: accessory,
      rawReturns,
      transfers,
      reportOutbox,
      auditLog,
    });
  }

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
});

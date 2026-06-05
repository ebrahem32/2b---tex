const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const { DB_PATH, initDb, run, get, all } = require('./db');
const { calculateOrderSummary } = require('./calculations');

const PORT = Number(process.env.PORT || 3050);
const HOST = '0.0.0.0';
const BACKUP_DIR = path.join(__dirname, 'backups');

fs.mkdirSync(BACKUP_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

const TABLE_FIELDS = {
  customers: ['id','name','phone','a5_customer_id','notes','created_at','updated_at'],
  pricings: ['id','pricing_number','customer_id','pricing_date','fabric_type','material_type','dyehouse','color_class','quantity','inch_width','finished_weight','raw_cost','dye_cost','waste_percent','extra_cost','profit_per_kg','unit_price','total_price','payment_terms','notes','status','created_at','updated_at'],
  orders: ['id','order_number','pricing_id','customer_id','order_date','product_code','fabric_type','total_raw_quantity','expected_waste_percent','width_mode','width_lines_json','inch_width','kilo_price','raw_cost','payment_terms','accessory_type','accessory_percent','accessory_lines_json','dyehouse','weaving_source','notes','status','is_closed','created_at','updated_at'],
  order_allocations: ['id','order_id','color','pantone_code','planned_quantity','dyehouse','width_line_id','raw_inch','raw_width','finished_width','finished_weight','accessory_quantity_manual','notes','created_at','updated_at'],
  raw_receiving_batches: ['id','order_id','allocation_id','batch_date','quantity','supplier','note_number','notes','created_at','updated_at'],
  dyehouse_delivery_batches: ['id','order_id','allocation_id','batch_date','quantity','dyehouse','width_line_id','note_number','notes','created_at','updated_at'],
  finished_receiving_batches: ['id','order_id','allocation_id','batch_date','quantity','finished_width','finished_weight','note_number','notes','created_at','updated_at'],
  customer_delivery_batches: ['id','order_id','allocation_id','batch_date','quantity','notes','created_at','updated_at'],
  accessory_batches: ['id','order_id','allocation_id','batch_date','accessory_type','quantity','note_number','movement','notes','created_at','updated_at'],
  raw_returns: ['id','order_id','allocation_id','batch_date','quantity','reason','note_number','notes','created_at','updated_at'],
  dyehouse_transfers: ['id','order_id','from_allocation_id','to_allocation_id','from_dyehouse','to_dyehouse','quantity','transfer_date','note_number','notes','created_at','updated_at'],
  report_outbox: ['id','report_type','order_id','order_number','customer_name','target_group','message_text','attachment_path','status','error_message','retry_count','created_at','sent_at'],
  audit_log: ['id','action','entity_type','entity_id','before_json','after_json','note','created_at'],
};

function tableData(table, data) {
  const allowed = TABLE_FIELDS[table];
  if (!allowed) return data;
  return Object.fromEntries(Object.entries(data).filter(([key]) => allowed.includes(key)));
}

function id() {
  return crypto.randomUUID();
}

function now() {
  return new Date().toISOString();
}

const LEGACY_TEST_ORDER_NUMBERS = new Set(['2554']);
const LEGACY_TEST_CUSTOMERS = new Set(['ام احمد','أم أحمد','ام أحمد','أم احمد']);

function normalizeArabicName(value) {
  return String(value || '').replace(/[إأآ]/g, 'ا').replace(/\s+/g, ' ').trim();
}

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function insertSql(table, data) {
  const filtered = tableData(table, data || {});
  const body = { id: filtered.id || id(), ...filtered, created_at: filtered.created_at || now(), updated_at: filtered.updated_at || now() };
  const keys = Object.keys(body);
  return {
    id: body.id,
    sql: `INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`,
    values: keys.map((key) => body[key])
  };
}

function updateSql(table, data, idValue) {
  const body = { ...tableData(table, data || {}), updated_at: now() };
  delete body.id;
  delete body.created_at;
  const keys = Object.keys(body);
  return {
    sql: `UPDATE ${table} SET ${keys.map((key) => `${key} = ?`).join(', ')} WHERE id = ?`,
    values: [...keys.map((key) => body[key]), idValue]
  };
}

function crudRoutes(base, table) {
  app.get(`/api/${base}`, asyncHandler(async (_req, res) => {
    res.json(await all(`SELECT * FROM ${table} ORDER BY created_at DESC`));
  }));
  app.post(`/api/${base}`, asyncHandler(async (req, res) => {
    const query = insertSql(table, req.body || {});
    await run(table === 'customers' ? query.sql.replace('INSERT INTO', 'INSERT OR IGNORE INTO') : query.sql, query.values);
    res.status(201).json(await get(`SELECT * FROM ${table} WHERE id = ?`, [query.id]));
  }));
  app.put(`/api/${base}/:id`, asyncHandler(async (req, res) => {
    const query = updateSql(table, req.body || {}, req.params.id);
    await run(query.sql, query.values);
    res.json(await get(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]));
  }));
  app.delete(`/api/${base}/:id`, asyncHandler(async (req, res) => {
    if (table === 'orders') {
      const deleted = await deleteOrderGraph(req.params.id);
      return res.json({ ok: true, deleted });
    }
    const result = await run(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
    res.json({ ok: true, deleted: result.changes || 0 });
  }));
}

async function deleteOrderGraph(orderId) {
  const order = await get('SELECT id, order_number FROM orders WHERE id = ?', [orderId]);
  if (!order) return 0;
  await run('DELETE FROM report_outbox WHERE order_id = ? OR order_number = ?', [order.id, order.order_number || '']);
  await run('DELETE FROM dyehouse_transfers WHERE order_id = ?', [order.id]);
  await run('DELETE FROM raw_returns WHERE order_id = ?', [order.id]);
  await run('DELETE FROM accessory_batches WHERE order_id = ?', [order.id]);
  await run('DELETE FROM customer_delivery_batches WHERE order_id = ?', [order.id]);
  await run('DELETE FROM finished_receiving_batches WHERE order_id = ?', [order.id]);
  await run('DELETE FROM dyehouse_delivery_batches WHERE order_id = ?', [order.id]);
  await run('DELETE FROM raw_receiving_batches WHERE order_id = ?', [order.id]);
  await run('DELETE FROM order_allocations WHERE order_id = ?', [order.id]);
  await run('DELETE FROM orders WHERE id = ?', [order.id]);
  return 1;
}

async function deleteAllocationGraph(allocationId) {
  const allocation = await get('SELECT id FROM order_allocations WHERE id = ?', [allocationId]);
  if (!allocation) return 0;
  await run('DELETE FROM dyehouse_transfers WHERE from_allocation_id = ? OR to_allocation_id = ?', [allocation.id, allocation.id]);
  await run('DELETE FROM raw_returns WHERE allocation_id = ?', [allocation.id]);
  await run('DELETE FROM accessory_batches WHERE allocation_id = ?', [allocation.id]);
  await run('DELETE FROM customer_delivery_batches WHERE allocation_id = ?', [allocation.id]);
  await run('DELETE FROM finished_receiving_batches WHERE allocation_id = ?', [allocation.id]);
  await run('DELETE FROM dyehouse_delivery_batches WHERE allocation_id = ?', [allocation.id]);
  await run('DELETE FROM raw_receiving_batches WHERE allocation_id = ?', [allocation.id]);
  await run('DELETE FROM order_allocations WHERE id = ?', [allocation.id]);
  return 1;
}

async function cleanupLegacyTestOrders() {
  const placeholders = [...LEGACY_TEST_ORDER_NUMBERS].map(() => '?').join(',');
  const rows = await all(
    `SELECT o.id, o.order_number, c.name AS customer
     FROM orders o
     LEFT JOIN customers c ON c.id = o.customer_id
     WHERE o.order_number IN (${placeholders})`,
    [...LEGACY_TEST_ORDER_NUMBERS]
  );
  const matches = rows.filter((row) => LEGACY_TEST_CUSTOMERS.has(normalizeArabicName(row.customer)));
  if (!matches.length) return;
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const target = path.join(BACKUP_DIR, `before-legacy-test-orders-cleanup-${stamp}.sqlite`);
  if (fs.existsSync(DB_PATH)) fs.copyFileSync(DB_PATH, target);
  for (const row of matches) await deleteOrderGraph(row.id);
  console.log(`[2B Tex] Removed ${matches.length} legacy test orders after backup: ${target}`);
}

app.get('/api/health', asyncHandler(async (_req, res) => {
  const row = await get('SELECT COUNT(*) AS count FROM sqlite_master WHERE type = ?', ['table']);
  res.json({ ok: true, service: '2B Tex Backend', database: DB_PATH, tables: row.count, time: now() });
}));

app.post('/api/backup', asyncHandler(async (_req, res) => {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const target = path.join(BACKUP_DIR, `2btex-${stamp}.sqlite`);
  if (fs.existsSync(DB_PATH)) fs.copyFileSync(DB_PATH, target);
  res.json({ ok: true, file: target });
}));

app.get('/api/backups', asyncHandler(async (_req, res) => {
  const files = fs.readdirSync(BACKUP_DIR).filter((name) => name.endsWith('.sqlite'));
  res.json(files.map((name) => ({ name, path: path.join(BACKUP_DIR, name) })));
}));

crudRoutes('customers', 'customers');
crudRoutes('pricings', 'pricings');
crudRoutes('orders', 'orders');

app.get('/api/orders/:id', asyncHandler(async (req, res) => {
  const order = await get('SELECT * FROM orders WHERE id = ?', [req.params.id]);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
}));

app.get('/api/orders/:orderId/allocations', asyncHandler(async (req, res) => {
  res.json(await all('SELECT * FROM order_allocations WHERE order_id = ? ORDER BY created_at', [req.params.orderId]));
}));

app.post('/api/orders/:orderId/allocations', asyncHandler(async (req, res) => {
  const query = insertSql('order_allocations', { ...req.body, order_id: req.params.orderId });
  await run(query.sql, query.values);
  res.status(201).json(await get('SELECT * FROM order_allocations WHERE id = ?', [query.id]));
}));

app.put('/api/allocations/:id', asyncHandler(async (req, res) => {
  const query = updateSql('order_allocations', req.body || {}, req.params.id);
  await run(query.sql, query.values);
  res.json(await get('SELECT * FROM order_allocations WHERE id = ?', [req.params.id]));
}));

app.delete('/api/allocations/:id', asyncHandler(async (req, res) => {
  const deleted = await deleteAllocationGraph(req.params.id);
  res.json({ ok: true, deleted });
}));

const batchTables = {
  raw: 'raw_receiving_batches',
  dyehouse: 'dyehouse_delivery_batches',
  finished: 'finished_receiving_batches',
  customer: 'customer_delivery_batches',
  accessory: 'accessory_batches',
  rawReturn: 'raw_returns',
  'raw-return': 'raw_returns'
};

app.get('/api/orders/:orderId/batches', asyncHandler(async (req, res) => {
  const orderId = req.params.orderId;
  const result = {};
  for (const [key, table] of Object.entries(batchTables)) {
    result[key] = await all(`SELECT * FROM ${table} WHERE order_id = ? ORDER BY created_at`, [orderId]);
  }
  result.accessories = await all('SELECT * FROM accessory_batches WHERE order_id = ? ORDER BY created_at', [orderId]);
  result.rawReturns = await all('SELECT * FROM raw_returns WHERE order_id = ? ORDER BY created_at', [orderId]);
  result.transfers = await all('SELECT * FROM dyehouse_transfers WHERE order_id = ? ORDER BY created_at', [orderId]);
  res.json(result);
}));

app.get('/api/bootstrap', asyncHandler(async (_req, res) => {
  const systemSettingsRows = await all('SELECT key, value_json FROM system_settings ORDER BY key');
  const systemSettings = {};
  for (const row of systemSettingsRows) {
    try {
      systemSettings[row.key] = JSON.parse(row.value_json);
    } catch {
      systemSettings[row.key] = null;
    }
  }
  res.json({
    customers: await all('SELECT * FROM customers ORDER BY name'),
    pricings: await all('SELECT * FROM pricings ORDER BY created_at DESC'),
    orders: await all('SELECT * FROM orders ORDER BY created_at DESC'),
    allocations: await all('SELECT * FROM order_allocations ORDER BY created_at'),
    rawReceivingBatches: await all('SELECT * FROM raw_receiving_batches ORDER BY created_at'),
    dyehouseDeliveryBatches: await all('SELECT * FROM dyehouse_delivery_batches ORDER BY created_at'),
    finishedReceivingBatches: await all('SELECT * FROM finished_receiving_batches ORDER BY created_at'),
    customerDeliveryBatches: await all('SELECT * FROM customer_delivery_batches ORDER BY created_at'),
    accessoryBatches: await all('SELECT * FROM accessory_batches ORDER BY created_at'),
    rawReturns: await all('SELECT * FROM raw_returns ORDER BY created_at'),
    dyehouseTransfers: await all('SELECT * FROM dyehouse_transfers ORDER BY created_at'),
    reportOutbox: await all('SELECT * FROM report_outbox ORDER BY created_at DESC'),
    systemSettings,
  });
}));

app.get('/api/settings/:key', asyncHandler(async (req, res) => {
  const row = await get('SELECT key, value_json FROM system_settings WHERE key = ?', [req.params.key]);
  if (!row) return res.json({ key: req.params.key, value: null });
  let value = null;
  try {
    value = JSON.parse(row.value_json);
  } catch {}
  res.json({ key: row.key, value });
}));

app.put('/api/settings/:key', asyncHandler(async (req, res) => {
  const valueJson = JSON.stringify(req.body?.value ?? null);
  const existing = await get('SELECT key FROM system_settings WHERE key = ?', [req.params.key]);
  if (existing) {
    await run('UPDATE system_settings SET value_json = ?, updated_at = ? WHERE key = ?', [valueJson, now(), req.params.key]);
  } else {
    await run('INSERT INTO system_settings (key, value_json, created_at, updated_at) VALUES (?, ?, ?, ?)', [req.params.key, valueJson, now(), now()]);
  }
  res.json({ key: req.params.key, value: req.body?.value ?? null });
}));

function batchPost(route, table) {
  app.post(route, asyncHandler(async (req, res) => {
    const query = insertSql(table, req.body || {});
    await run(query.sql, query.values);
    res.status(201).json(await get(`SELECT * FROM ${table} WHERE id = ?`, [query.id]));
  }));
}

batchPost('/api/batches/raw', 'raw_receiving_batches');
batchPost('/api/batches/dyehouse', 'dyehouse_delivery_batches');
batchPost('/api/batches/finished', 'finished_receiving_batches');
batchPost('/api/batches/customer', 'customer_delivery_batches');
batchPost('/api/batches/accessory', 'accessory_batches');
batchPost('/api/batches/raw-return', 'raw_returns');

app.post('/api/transfers', asyncHandler(async (req, res) => {
  const query = insertSql('dyehouse_transfers', req.body || {});
  await run(query.sql, query.values);
  res.status(201).json(await get('SELECT * FROM dyehouse_transfers WHERE id = ?', [query.id]));
}));

app.put('/api/transfers/:id', asyncHandler(async (req, res) => {
  const query = updateSql('dyehouse_transfers', req.body || {}, req.params.id);
  await run(query.sql, query.values);
  res.json(await get('SELECT * FROM dyehouse_transfers WHERE id = ?', [req.params.id]));
}));

app.delete('/api/transfers/:id', asyncHandler(async (req, res) => {
  await run('DELETE FROM dyehouse_transfers WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

function localCustomerId(name) {
  const clean = String(name || '').trim();
  if (!clean) return null;
  return `customer-${clean.replace(/\s+/g, '-').replace(/[^\u0600-\u06FF\w-]/g, '')}`;
}

function firstValue(row, keys, fallback = '') {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null && row?.[key] !== '') return row[key];
  }
  return fallback;
}

function numValue(row, keys) {
  return Number(firstValue(row, keys, 0)) || 0;
}

function normalizeOrderStatus(status) {
  return status === 'active' ? 'pending' : (status || 'pending');
}

function jsonArrayValue(value) {
  if (Array.isArray(value)) return JSON.stringify(value);
  if (!value) return '[]';
  if (typeof value === 'string') {
    try {
      return Array.isArray(JSON.parse(value)) ? value : '[]';
    } catch {
      return '[]';
    }
  }
  return '[]';
}

function dateValue(row) {
  return firstValue(row, ['batchDate', 'date', 'orderDate', 'pricingDate', 'createdAt', 'created_at'], null);
}

async function backupDatabaseForImport() {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const target = path.join(BACKUP_DIR, `before-import-local-${stamp}.sqlite`);
  if (fs.existsSync(DB_PATH)) fs.copyFileSync(DB_PATH, target);
  return target;
}

async function upsertMapped(table, data, stats) {
  const clean = tableData(table, data || {});
  if (!clean.id) {
    stats.skipped++;
    return;
  }
  const exists = await get(`SELECT id FROM ${table} WHERE id = ?`, [clean.id]);
  if (exists) {
    const query = updateSql(table, clean, clean.id);
    await run(query.sql, query.values);
    stats.updated++;
  } else {
    const query = insertSql(table, clean);
    await run(query.sql, query.values);
    stats.inserted++;
  }
  stats.byTable[table] = (stats.byTable[table] || 0) + 1;
}

function mapOrder(row, customerId, inferredPricingId) {
  return {
    id: row.id,
    order_number: firstValue(row, ['orderNumber', 'order_number']),
    pricing_id: firstValue(row, ['pricingId', 'pricing_id'], inferredPricingId || null),
    customer_id: customerId,
    order_date: firstValue(row, ['orderDate', 'order_date']),
    product_code: firstValue(row, ['productCode', 'product_code']),
    fabric_type: firstValue(row, ['fabricType', 'fabric_type']),
    total_raw_quantity: numValue(row, ['totalRawQuantity', 'total_raw_quantity']),
    expected_waste_percent: numValue(row, ['expectedWastePercent', 'expected_waste_percent']),
    width_mode: firstValue(row, ['widthMode', 'width_mode'], 'single'),
    width_lines_json: jsonArrayValue(row.widthLines || row.width_lines_json),
    inch_width: numValue(row, ['inchWidth', 'inch_width']),
    kilo_price: numValue(row, ['kiloPrice', 'kilo_price']),
    raw_cost: numValue(row, ['rawCost', 'raw_cost']),
    payment_terms: firstValue(row, ['paymentTerms', 'payment_terms']),
    accessory_type: firstValue(row, ['accessoryType', 'accessory_type']),
    accessory_percent: numValue(row, ['accessoryPercent', 'accessory_percent']),
    accessory_lines_json: jsonArrayValue(row.accessoryLines || row.accessory_lines_json),
    dyehouse: firstValue(row, ['dyehouse']),
    weaving_source: firstValue(row, ['weavingSource', 'weaving_source']),
    notes: firstValue(row, ['notes']),
    status: normalizeOrderStatus(firstValue(row, ['status'], 'pending')),
    is_closed: row.isClosed || row.operationClosed ? 1 : 0,
    created_at: firstValue(row, ['createdAt', 'created_at'], now()),
    updated_at: firstValue(row, ['updatedAt', 'updated_at'], now())
  };
}

function mapPricing(row, customerId) {
  return {
    id: row.id,
    pricing_number: firstValue(row, ['pricingNumber', 'pricing_number']),
    customer_id: customerId,
    pricing_date: firstValue(row, ['pricingDate', 'pricing_date']),
    fabric_type: firstValue(row, ['fabricType', 'fabric_type']),
    material_type: firstValue(row, ['materialType', 'material_type']),
    dyehouse: firstValue(row, ['dyehouse']),
    color_class: firstValue(row, ['colorClass', 'color_class']),
    quantity: numValue(row, ['quantity']),
    inch_width: numValue(row, ['inchWidth', 'inch_width']),
    finished_weight: numValue(row, ['finishedWeight', 'finished_weight']),
    raw_cost: numValue(row, ['rawCost', 'raw_cost']),
    dye_cost: numValue(row, ['dyeCost', 'dye_cost']),
    waste_percent: numValue(row, ['wastePercent', 'waste_percent']),
    extra_cost: numValue(row, ['extraCost', 'extra_cost']),
    profit_per_kg: numValue(row, ['profitPerKg', 'profit_per_kg']),
    unit_price: numValue(row, ['unitPrice', 'unit_price']),
    total_price: numValue(row, ['totalPrice', 'total_price']),
    payment_terms: firstValue(row, ['paymentTerms', 'payment_terms']),
    notes: firstValue(row, ['notes']),
    status: firstValue(row, ['status'], row.convertedOrderId ? 'converted' : 'active'),
    created_at: firstValue(row, ['createdAt', 'created_at'], now()),
    updated_at: firstValue(row, ['updatedAt', 'updated_at'], now())
  };
}

// Sync browser LocalStorage payload into SQLite through safe field mapping.
app.post('/api/import-local', asyncHandler(async (req, res) => {
  const body = req.body || {};
  const stats = { inserted: 0, updated: 0, skipped: 0, byTable: {}, repairedOrderId: 0 };
  const backup = await backupDatabaseForImport();
  const ordersInput = body.orders || [];
  const pricingsInput = body.pricings || [];
  const allocationsInput = body.allocations || [];
  const allocationOrderById = new Map(allocationsInput.filter((row) => row?.id).map((row) => [row.id, row.orderId || row.order_id]));
  const orderById = new Map(ordersInput.filter((row) => row?.id).map((row) => [row.id, row]));
  const pricingByComposite = new Map();

  for (const pricing of pricingsInput) {
    const customerId = localCustomerId(pricing.customer || pricing.customer_name);
    const mapped = mapPricing(pricing, customerId);
    const key = [mapped.pricing_number, customerId, mapped.fabric_type, mapped.pricing_date].join('|');
    pricingByComposite.set(key, mapped.id);
    if (customerId) await upsertMapped('customers', { id: customerId, name: pricing.customer || pricing.customer_name || '', created_at: now(), updated_at: now() }, stats);
    await upsertMapped('pricings', mapped, stats);
  }

  for (const order of ordersInput) {
    const customerId = localCustomerId(order.customer || order.customer_name);
    const pricingKey = [order.orderNumber || order.order_number, customerId, order.fabricType || order.fabric_type, order.orderDate || order.order_date].join('|');
    const mappedOrder = mapOrder(order, customerId, pricingByComposite.get(pricingKey));
    if (customerId) await upsertMapped('customers', { id: customerId, name: order.customer || order.customer_name || '', created_at: now(), updated_at: now() }, stats);
    await upsertMapped('orders', mappedOrder, stats);
    if (mappedOrder.pricing_id) await run('UPDATE pricings SET status = ?, updated_at = ? WHERE id = ?', ['converted', now(), mappedOrder.pricing_id]);
  }

  for (const row of allocationsInput) {
    await upsertMapped('order_allocations', {
      id: row.id,
      order_id: firstValue(row, ['orderId', 'order_id']),
      color: firstValue(row, ['color']),
      pantone_code: firstValue(row, ['pantoneCode', 'pantone_code']),
      planned_quantity: numValue(row, ['plannedQuantity', 'planned_quantity', 'quantity']),
      dyehouse: firstValue(row, ['dyehouse']),
      width_line_id: firstValue(row, ['widthLineId', 'width_line_id']),
      raw_inch: numValue(row, ['rawInch', 'raw_inch']),
      raw_width: numValue(row, ['rawWidth', 'raw_width']),
      finished_width: numValue(row, ['finishedWidth', 'targetFinishedWidth', 'finished_width']),
      finished_weight: numValue(row, ['finishedWeight', 'targetFinishedWeight', 'finished_weight']),
      accessory_quantity_manual: row.accessoryQuantityManual ?? row.accessory_quantity_manual ?? null,
      notes: firstValue(row, ['notes']),
      created_at: firstValue(row, ['createdAt', 'created_at'], now()),
      updated_at: firstValue(row, ['updatedAt', 'updated_at'], now())
    }, stats);
  }

  async function batchOrderId(row) {
    const direct = firstValue(row, ['orderId', 'order_id'], null);
    if (direct) return direct;
    const allocationId = firstValue(row, ['allocationId', 'allocation_id'], null);
    const repaired = allocationOrderById.get(allocationId);
    if (repaired) stats.repairedOrderId++;
    return repaired || null;
  }

  async function importRawRow(row) {
    const order_id = await batchOrderId(row);
    const allocation_id = firstValue(row, ['allocationId', 'allocation_id'], null);
    const common = {
      id: row.id,
      order_id,
      allocation_id,
      batch_date: dateValue(row),
      quantity: numValue(row, ['quantity']),
      width_line_id: firstValue(row, ['widthLineId', 'width_line_id']),
      note_number: firstValue(row, ['noteNumber', 'note_number']),
      notes: firstValue(row, ['notes']),
      created_at: firstValue(row, ['createdAt', 'created_at'], now()),
      updated_at: firstValue(row, ['updatedAt', 'updated_at'], now())
    };
    const movement = String(row.movementKind || row.movement || '').toLowerCase();
    if (movement === 'out' || movement === '') {
      const order = orderById.get(order_id);
      await upsertMapped('dyehouse_delivery_batches', { ...common, dyehouse: firstValue(row, ['dyehouse'], order?.dyehouse || '') }, stats);
    } else {
      await upsertMapped('raw_receiving_batches', { ...common, supplier: firstValue(row, ['supplier', 'weavingSource']) }, stats);
    }
  }

  for (const row of body.rawBatches || []) await importRawRow(row);
  for (const row of body.dyeBatches || body.dyehouse || []) {
    await upsertMapped('dyehouse_delivery_batches', {
      id: row.id,
      order_id: await batchOrderId(row),
      allocation_id: firstValue(row, ['allocationId', 'allocation_id'], null),
      batch_date: dateValue(row),
      quantity: numValue(row, ['quantity']),
      dyehouse: firstValue(row, ['dyehouse']),
      width_line_id: firstValue(row, ['widthLineId', 'width_line_id']),
      note_number: firstValue(row, ['noteNumber', 'note_number']),
      notes: firstValue(row, ['notes']),
      created_at: firstValue(row, ['createdAt', 'created_at'], now()),
      updated_at: firstValue(row, ['updatedAt', 'updated_at'], now())
    }, stats);
  }

  for (const row of [...(body.finishedBatches || []), ...(body.productionBatches || []), ...(body.finished || [])]) {
    await upsertMapped('finished_receiving_batches', {
      id: row.id,
      order_id: await batchOrderId(row),
      allocation_id: firstValue(row, ['allocationId', 'allocation_id'], null),
      batch_date: dateValue(row),
      quantity: numValue(row, ['quantity']),
      finished_width: numValue(row, ['finishedWidth', 'finished_width']),
      finished_weight: numValue(row, ['finishedWeight', 'finished_weight']),
      note_number: firstValue(row, ['noteNumber', 'note_number']),
      notes: firstValue(row, ['notes']),
      created_at: firstValue(row, ['createdAt', 'created_at'], now()),
      updated_at: firstValue(row, ['updatedAt', 'updated_at'], now())
    }, stats);
  }

  for (const row of body.customerBatches || body.customer || []) {
    await upsertMapped('customer_delivery_batches', {
      id: row.id,
      order_id: await batchOrderId(row),
      allocation_id: firstValue(row, ['allocationId', 'allocation_id'], null),
      batch_date: dateValue(row),
      quantity: numValue(row, ['quantity']),
      notes: firstValue(row, ['notes']),
      created_at: firstValue(row, ['createdAt', 'created_at'], now()),
      updated_at: firstValue(row, ['updatedAt', 'updated_at'], now())
    }, stats);
  }

  for (const row of body.accessoryBatches || body.accessory || []) {
    await upsertMapped('accessory_batches', {
      id: row.id,
      order_id: await batchOrderId(row),
      allocation_id: firstValue(row, ['allocationId', 'allocation_id'], null),
      batch_date: dateValue(row),
      accessory_type: firstValue(row, ['accessoryType', 'accessory_type']),
      quantity: numValue(row, ['quantity']),
      note_number: firstValue(row, ['noteNumber', 'note_number']),
      movement: firstValue(row, ['movement'], 'sent'),
      notes: firstValue(row, ['notes']),
      created_at: firstValue(row, ['createdAt', 'created_at'], now()),
      updated_at: firstValue(row, ['updatedAt', 'updated_at'], now())
    }, stats);
  }

  for (const row of body.rawReturns || []) {
    await upsertMapped('raw_returns', {
      id: row.id,
      order_id: await batchOrderId(row),
      allocation_id: firstValue(row, ['allocationId', 'allocation_id'], null),
      batch_date: dateValue(row),
      quantity: numValue(row, ['quantity']),
      reason: firstValue(row, ['reason']),
      note_number: firstValue(row, ['noteNumber', 'note_number']),
      notes: firstValue(row, ['notes']),
      created_at: firstValue(row, ['createdAt', 'created_at'], now()),
      updated_at: firstValue(row, ['updatedAt', 'updated_at'], now())
    }, stats);
  }

  for (const row of body.dyehouseTransfers || body.transfers || []) {
    await upsertMapped('dyehouse_transfers', {
      id: row.id,
      order_id: firstValue(row, ['orderId', 'order_id']),
      from_allocation_id: firstValue(row, ['allocationId', 'fromAllocationId', 'from_allocation_id']),
      to_allocation_id: firstValue(row, ['newAllocationId', 'toAllocationId', 'to_allocation_id']),
      from_dyehouse: firstValue(row, ['fromDyehouse', 'from_dyehouse']),
      to_dyehouse: firstValue(row, ['toDyehouse', 'to_dyehouse']),
      quantity: numValue(row, ['quantity']),
      transfer_date: dateValue(row),
      note_number: firstValue(row, ['noteNumber', 'note_number']),
      notes: firstValue(row, ['notes']),
      created_at: firstValue(row, ['createdAt', 'created_at'], now()),
      updated_at: firstValue(row, ['updatedAt', 'updated_at'], now())
    }, stats);
  }

  for (const row of body.reportOutbox || []) {
    await upsertMapped('report_outbox', {
      id: row.id,
      report_type: firstValue(row, ['reportType', 'report_type']),
      order_id: firstValue(row, ['orderId', 'order_id']),
      order_number: firstValue(row, ['orderNumber', 'order_number']),
      customer_name: firstValue(row, ['customerName', 'customer_name']),
      target_group: firstValue(row, ['targetGroup', 'target_group']),
      message_text: firstValue(row, ['messageText', 'message_text']),
      attachment_path: firstValue(row, ['attachmentPath', 'attachment_path']),
      status: firstValue(row, ['status'], 'pending'),
      error_message: firstValue(row, ['errorMessage', 'error_message']),
      retry_count: numValue(row, ['retryCount', 'retry_count']),
      created_at: firstValue(row, ['createdAt', 'created_at'], now()),
      sent_at: firstValue(row, ['sentAt', 'sent_at'], null)
    }, stats);
  }

  for (const row of body.auditLog || []) {
    await upsertMapped('audit_log', {
      id: row.id,
      action: firstValue(row, ['action']),
      entity_type: firstValue(row, ['entityType', 'entity_type']),
      entity_id: firstValue(row, ['entityId', 'entity_id']),
      before_json: typeof row.before === 'string' ? row.before : JSON.stringify(row.before || null),
      after_json: typeof row.after === 'string' ? row.after : JSON.stringify(row.after || null),
      note: firstValue(row, ['note']),
      created_at: firstValue(row, ['createdAt', 'created_at'], now())
    }, stats);
  }

  res.json({ ok: true, backup, ...stats });
}));

app.delete('/api/batches/:type/:id', asyncHandler(async (req, res) => {
  const table = batchTables[req.params.type];
  if (!table) return res.status(400).json({ error: 'Unknown batch type' });
  await run(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
  res.json({ ok: true });
}));

app.put('/api/batches/:type/:id', asyncHandler(async (req, res) => {
  const table = batchTables[req.params.type];
  if (!table) return res.status(400).json({ error: 'Unknown batch type' });
  const query = updateSql(table, req.body || {}, req.params.id);
  await run(query.sql, query.values);
  res.json(await get(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]));
}));

async function orderSummary(orderId) {
  const order = await get('SELECT * FROM orders WHERE id = ?', [orderId]);
  if (!order) return null;
  return calculateOrderSummary(order, {
    rawReceivingBatches: await all('SELECT * FROM raw_receiving_batches WHERE order_id = ?', [orderId]),
    dyehouseDeliveryBatches: await all('SELECT * FROM dyehouse_delivery_batches WHERE order_id = ?', [orderId]),
    finishedReceivingBatches: await all('SELECT * FROM finished_receiving_batches WHERE order_id = ?', [orderId]),
    customerDeliveryBatches: await all('SELECT * FROM customer_delivery_batches WHERE order_id = ?', [orderId]),
    rawReturns: await all('SELECT * FROM raw_returns WHERE order_id = ?', [orderId])
  });
}

app.get('/api/orders/:orderId/summary', asyncHandler(async (req, res) => {
  const summary = await orderSummary(req.params.orderId);
  if (!summary) return res.status(404).json({ error: 'Order not found' });
  res.json(summary);
}));

app.get('/api/dashboard/summary', asyncHandler(async (_req, res) => {
  const orders = await all('SELECT * FROM orders');
  const summaries = [];
  for (const order of orders) summaries.push(await orderSummary(order.id));
  res.json({
    ordersCount: orders.length,
    totalRequestedQuantity: summaries.reduce((t, s) => t + s.totalRequestedQuantity, 0),
    totalRawReceived: summaries.reduce((t, s) => t + s.totalRawReceived, 0),
    totalSentToDyehouse: summaries.reduce((t, s) => t + s.totalSentToDyehouse, 0),
    totalFinishedReceived: summaries.reduce((t, s) => t + s.totalFinishedReceived, 0),
    warehouseBalance: summaries.reduce((t, s) => t + s.warehouseBalance, 0),
    wasteQuantity: summaries.reduce((t, s) => t + s.wasteQuantity, 0)
  });
}));

app.get('/api/export/localstorage-template', (_req, res) => {
  res.json({
    '2btex.orders.v4': [],
    '2btex.allocations.v4': [],
    '2btex.raw.v4': [],
    '2btex.dye.v5': [],
    '2btex.production.v2': [],
    '2btex.customer.v2': [],
    '2btex.pricings.v1': []
  });
});

app.post('/api/import/localstorage', (_req, res) => {
  res.status(202).json({ ok: true, message: 'Import is prepared but not automatic. Use backend/tools/import-localstorage.js.' });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: error.message || 'Internal server error' });
});

initDb().then(async () => {
  await cleanupLegacyTestOrders();
  app.listen(PORT, HOST, () => {
    console.log(`2B Tex Backend: http://localhost:${PORT}/api/health`);
  });
}).catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

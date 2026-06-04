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
  orders: ['id','order_number','pricing_id','customer_id','order_date','fabric_type','total_raw_quantity','expected_waste_percent','inch_width','kilo_price','payment_terms','dyehouse','weaving_source','notes','status','is_closed','created_at','updated_at'],
  order_allocations: ['id','order_id','color','pantone_code','planned_quantity','dyehouse','finished_width','finished_weight','notes','created_at','updated_at'],
  raw_receiving_batches: ['id','order_id','allocation_id','batch_date','quantity','supplier','note_number','notes','created_at','updated_at'],
  dyehouse_delivery_batches: ['id','order_id','allocation_id','batch_date','quantity','dyehouse','note_number','notes','created_at','updated_at'],
  finished_receiving_batches: ['id','order_id','allocation_id','batch_date','quantity','finished_width','finished_weight','notes','created_at','updated_at'],
  customer_delivery_batches: ['id','order_id','allocation_id','batch_date','quantity','notes','created_at','updated_at'],
  accessory_batches: ['id','order_id','allocation_id','accessory_type','quantity','notes','created_at','updated_at'],
  raw_returns: ['id','order_id','allocation_id','batch_date','quantity','reason','notes','created_at','updated_at'],
  dyehouse_transfers: ['id','order_id','from_allocation_id','to_allocation_id','from_dyehouse','to_dyehouse','quantity','transfer_date','notes','created_at','updated_at'],
  report_outbox: ['id','report_type','order_id','order_number','customer_name','target_group','message_text','attachment_path','status','error_message','retry_count','created_at','sent_at'],
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
    await run(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
    res.json({ ok: true });
  }));
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
  await run('DELETE FROM order_allocations WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

const batchTables = {
  raw: 'raw_receiving_batches',
  dyehouse: 'dyehouse_delivery_batches',
  finished: 'finished_receiving_batches',
  customer: 'customer_delivery_batches'
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
  });
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

app.delete('/api/batches/:type/:id', asyncHandler(async (req, res) => {
  const table = batchTables[req.params.type];
  if (!table) return res.status(400).json({ error: 'Unknown batch type' });
  await run(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
  res.json({ ok: true });
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

initDb().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`2B Tex Backend: http://localhost:${PORT}/api/health`);
  });
}).catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const { DB_PATH, initDb, run, get, all, schemaHealth } = require('./db');
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
  orders: ['id','order_number','pricing_id','customer_id','order_date','product_code','fabric_type','total_raw_quantity','expected_waste_percent','width_mode','width_lines_json','inch_width','kilo_price','raw_cost','payment_terms','accessory_type','accessory_percent','accessory_lines_json','dyehouse','weaving_source','notes','operation_notes_json','status','is_closed','created_at','updated_at'],
  order_allocations: ['id','order_id','color','pantone_code','planned_quantity','dyehouse','width_line_id','raw_inch','raw_width','finished_width','finished_weight','accessory_quantity_manual','notes','created_at','updated_at'],
  raw_receiving_batches: ['id','order_id','allocation_id','batch_date','quantity','supplier','note_number','notes','source_document_json','created_at','updated_at'],
  dyehouse_delivery_batches: ['id','order_id','allocation_id','batch_date','quantity','dyehouse','width_line_id','note_number','notes','source_document_json','created_at','updated_at'],
  finished_receiving_batches: ['id','order_id','allocation_id','batch_date','quantity','finished_width','finished_weight','note_number','notes','source_document_json','created_at','updated_at'],
  customer_delivery_batches: ['id','order_id','allocation_id','batch_date','quantity','notes','source_document_json','created_at','updated_at'],
  accessory_batches: ['id','order_id','allocation_id','batch_date','accessory_type','quantity','note_number','movement','notes','source_document_json','created_at','updated_at'],
  raw_returns: ['id','order_id','allocation_id','batch_date','quantity','reason','note_number','notes','source_document_json','created_at','updated_at'],
  dyehouse_transfers: ['id','order_id','from_allocation_id','to_allocation_id','from_dyehouse','to_dyehouse','quantity','transfer_date','note_number','notes','created_at','updated_at'],
  report_outbox: ['id','report_type','order_id','order_number','customer_name','target_group','message_text','attachment_path','status','error_message','retry_count','created_at','sent_at'],
  audit_log: ['id','action','entity_type','entity_id','before_json','after_json','note','created_at'],
  users: ['id','name','username','password_hash','role','is_active','created_at','updated_at'],
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

function safeJsonParse(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function readableCustomerNameFromId(customerId) {
  const raw = String(customerId || '').trim();
  if (!raw.startsWith('customer-')) return '';
  const body = raw.slice('customer-'.length).trim();
  if (!body || /^-+$/.test(body)) return '';
  if (/^[0-9a-f]+$/i.test(body) && body.length % 2 === 0) {
    try {
      const decoded = Buffer.from(body, 'hex').toString('utf8').trim();
      if (decoded && decoded !== body) return decoded;
    } catch {}
  }
  return body.replace(/-+/g, ' ').trim();
}

async function repairMissingCustomersFromReferences() {
  const refs = await all(`
    SELECT DISTINCT ref.customer_id
    FROM (
      SELECT customer_id FROM orders WHERE customer_id IS NOT NULL AND TRIM(customer_id) <> ''
      UNION
      SELECT customer_id FROM pricings WHERE customer_id IS NOT NULL AND TRIM(customer_id) <> ''
    ) ref
    LEFT JOIN customers c ON c.id = ref.customer_id
    WHERE c.id IS NULL
  `);
  for (const row of refs) {
    const name = readableCustomerNameFromId(row.customer_id);
    if (!name) continue;
    const customer = await ensureCustomerReference(row.customer_id, name, 'إصلاح تلقائي لعميل مرتبط بطلب أو تسعيرة');
    if (customer?.id && customer.id !== row.customer_id) {
      await run('UPDATE orders SET customer_id = ?, updated_at = ? WHERE customer_id = ?', [customer.id, now(), row.customer_id]);
      await run('UPDATE pricings SET customer_id = ?, updated_at = ? WHERE customer_id = ?', [customer.id, now(), row.customer_id]);
    }
  }
}

async function ensureCustomerReference(customerId, name, notes = 'مضاف من الواجهة') {
  const cleanId = String(customerId || '').trim();
  const cleanName = String(name || '').trim() || readableCustomerNameFromId(cleanId);
  if (!cleanId || !cleanName) return null;
  const byName = await get('SELECT * FROM customers WHERE name = ?', [cleanName]);
  if (byName && byName.id !== cleanId) return byName;
  const byId = await get('SELECT * FROM customers WHERE id = ?', [cleanId]);
  if (byId) {
    if (byId.name !== cleanName) {
      const before = byId;
      await run('UPDATE customers SET name = ?, notes = COALESCE(notes, ?), updated_at = ? WHERE id = ?', [cleanName, notes, now(), cleanId]);
      const after = await get('SELECT * FROM customers WHERE id = ?', [cleanId]);
      await auditMutation('update', 'customers', cleanId, before, after, 'customer reference repair');
      return after;
    }
    return byId;
  }
  if (byName) return byName;
  const stamp = now();
  await run('INSERT INTO customers (id, name, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?)', [cleanId, cleanName, notes, stamp, stamp]);
  return get('SELECT * FROM customers WHERE id = ?', [cleanId]);
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(String(password || ''), salt, 120000, 32, 'sha256').toString('hex');
  return `pbkdf2_sha256$120000$${salt}$${hash}`;
}

function verifyPassword(password, storedHash) {
  const parts = String(storedHash || '').split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2_sha256') return false;
  const iterations = Number(parts[1] || 0);
  const salt = parts[2];
  const hash = parts[3];
  if (!iterations || !salt || !hash) return false;
  const candidate = crypto.pbkdf2Sync(String(password || ''), salt, iterations, 32, 'sha256').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(hash, 'hex'));
}

function sessionSecret() {
  return process.env.AUTH_SECRET || process.env.SESSION_SECRET || process.env.SYSTEM_PASS || '2btex-development-session-secret';
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString('base64url');
}

function base64UrlJson(value) {
  return base64UrlEncode(JSON.stringify(value));
}

function signSessionPayload(payload) {
  const body = base64UrlJson(payload);
  const signature = crypto.createHmac('sha256', sessionSecret()).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function verifySessionToken(token) {
  const [body, signature] = String(token || '').split('.');
  if (!body || !signature) return null;
  const expected = crypto.createHmac('sha256', sessionSecret()).update(body).digest('base64url');
  if (expected.length !== signature.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() > Number(payload.exp)) return null;
    return payload;
  } catch {
    return null;
  }
}

function cookieValue(header, name) {
  const match = String(header || '').split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : '';
}

function sessionCookie(token) {
  const secure = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID ? '; Secure' : '';
  return `twobtex_session=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=28800${secure}`;
}

function clearSessionCookie() {
  const secure = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID ? '; Secure' : '';
  return `twobtex_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`;
}

function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name || '',
    username: row.username || '',
    role: row.role || 'user',
    is_active: Number(row.is_active) === 1 ? 1 : 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function ensureDefaultAdminUser() {
  const countRow = await get('SELECT COUNT(*) AS count FROM users');
  if (Number(countRow?.count || 0) > 0) return;
  const username = process.env.SYSTEM_USER || 'admin';
  const password = process.env.SYSTEM_PASS || '151297';
  const user = {
    id: id(),
    name: 'مدير النظام',
    username,
    password_hash: hashPassword(password),
    role: 'admin',
    is_active: 1,
    created_at: now(),
    updated_at: now(),
  };
  await run(
    'INSERT INTO users (id, name, username, password_hash, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [user.id, user.name, user.username, user.password_hash, user.role, user.is_active, user.created_at, user.updated_at]
  );
}

const LEGACY_TEST_ORDER_NUMBERS = new Set(['2554']);
const LEGACY_TEST_CUSTOMERS = new Set(['ام احمد','أم أحمد','ام أحمد','أم احمد']);
const LOCAL_IMPORT_ENABLED = process.env.ALLOW_LOCAL_IMPORT === '1';

function normalizeArabicName(value) {
  return String(value || '').replace(/[إأآ]/g, 'ا').replace(/\s+/g, ' ').trim();
}

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function auditEntityLabel(entityType) {
  return {
    customers: 'عميل',
    pricings: 'تسعيرة',
    orders: 'طلب',
    order_allocations: 'لون',
    raw_receiving_batches: 'استلام خام من النسيج',
    dyehouse_delivery_batches: 'صرف خام للمصبغة',
    finished_receiving_batches: 'استلام مجهز',
    customer_delivery_batches: 'تسليم عميل',
    accessory_batches: 'إكسسوار',
    raw_returns: 'مرتجع خام',
    dyehouse_transfers: 'تحويل مصبغة',
    report_outbox: 'إرسال تقرير',
    system_settings: 'إعدادات النظام',
    audit_log: 'سجل التعديلات',
    users: 'مستخدم',
  }[entityType] || entityType || 'بيان';
}

function auditActionLabel(action) {
  return { create:'إضافة', update:'تعديل', delete:'حذف' }[action] || action || 'حركة';
}

function auditRowValue(row, keys) {
  for (const key of keys) {
    const value = row?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return '';
}

function describeAudit(action, entityType, entityId, beforeValue = null, afterValue = null, note = '') {
  const row = afterValue && !afterValue.deleted ? afterValue : beforeValue;
  const entity = auditEntityLabel(entityType);
  const actionText = auditActionLabel(action);
  const orderNumber = auditRowValue(row, ['order_number', 'orderNumber']);
  const pricingNumber = auditRowValue(row, ['pricing_number', 'pricingNumber']);
  const color = auditRowValue(row, ['color', 'pantone_code', 'pantoneCode']);
  const quantity = auditRowValue(row, ['quantity', 'planned_quantity', 'total_raw_quantity']);
  const noteNumber = auditRowValue(row, ['note_number', 'noteNumber']);
  const username = auditRowValue(row, ['username']);
  const name = auditRowValue(row, ['name']);
  const dyehouse = auditRowValue(row, ['dyehouse', 'to_dyehouse', 'from_dyehouse']);
  const parts = [`${actionText} ${entity}`];
  if (orderNumber) parts.push(`رقم الطلب ${orderNumber}`);
  if (pricingNumber) parts.push(`رقم التسعيرة ${pricingNumber}`);
  if (color) parts.push(`اللون ${color}`);
  if (quantity) parts.push(`كمية ${quantity}`);
  if (noteNumber) parts.push(`إذن ${noteNumber}`);
  if (dyehouse) parts.push(`المصبغة ${dyehouse}`);
  if (username || name) parts.push(username ? `المستخدم ${username}` : `الاسم ${name}`);
  if (!orderNumber && !pricingNumber && !color && !quantity && !noteNumber && !username && entityId) parts.push(`ID ${entityId}`);
  const cleanNote = String(note || '').trim();
  if (cleanNote && !/^POST |^PUT |^DELETE |^upsert via POST /.test(cleanNote)) parts.push(cleanNote);
  return parts.join(' - ');
}

async function auditMutation(action, entityType, entityId, beforeValue = null, afterValue = null, note = '') {
  try {
    const readableNote = describeAudit(action, entityType, entityId, beforeValue, afterValue, note);
    await run(
      'INSERT INTO audit_log (id, action, entity_type, entity_id, before_json, after_json, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id(), action, entityType, entityId || '', JSON.stringify(beforeValue ?? null), JSON.stringify(afterValue ?? null), readableNote, now()]
    );
  } catch (error) {
    console.warn(`[2B Tex] audit failed for ${action} ${entityType} ${entityId || ''}: ${error.message}`);
  }
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
    if (table === 'customers' && req.body?.id) {
      const customer = await ensureCustomerReference(req.body.id, req.body.name, req.body.notes || 'مضاف من الواجهة');
      return res.status(200).json(customer);
    }
    const existing = await existingUniqueBusinessRow(table, req.body || {});
    if (existing) {
      const before = await get(`SELECT * FROM ${table} WHERE id = ?`, [existing.id]);
      const query = updateSql(table, req.body || {}, existing.id);
      await run(query.sql, query.values);
      const after = await get(`SELECT * FROM ${table} WHERE id = ?`, [existing.id]);
      await auditMutation('update', table, existing.id, before, after, `upsert via POST /api/${base}`);
      return res.status(200).json(after);
    }
    const query = insertSql(table, req.body || {});
    await run(table === 'customers' ? query.sql.replace('INSERT INTO', 'INSERT OR IGNORE INTO') : query.sql, query.values);
    const after = await get(`SELECT * FROM ${table} WHERE id = ?`, [query.id]);
    await auditMutation('create', table, query.id, null, after, `POST /api/${base}`);
    res.status(201).json(after);
  }));
  app.put(`/api/${base}/:id`, asyncHandler(async (req, res) => {
    const before = await get(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
    const query = updateSql(table, req.body || {}, req.params.id);
    await run(query.sql, query.values);
    const after = await get(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
    await auditMutation('update', table, req.params.id, before, after, `PUT /api/${base}/${req.params.id}`);
    res.json(after);
  }));
  app.delete(`/api/${base}/:id`, asyncHandler(async (req, res) => {
    const before = await get(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
    if (table === 'orders') {
      const deleted = await deleteOrderGraph(req.params.id);
      await auditMutation('delete', table, req.params.id, before, { deleted }, `DELETE /api/${base}/${req.params.id}`);
      return res.json({ ok: true, deleted });
    }
    const result = await run(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
    await auditMutation('delete', table, req.params.id, before, { deleted: result.changes || 0 }, `DELETE /api/${base}/${req.params.id}`);
    res.json({ ok: true, deleted: result.changes || 0 });
  }));
}

async function existingUniqueBusinessRow(table, data) {
  if (!data) return null;
  if (table === 'orders' && data.order_number && data.customer_id && data.fabric_type) {
    return get(
      'SELECT id FROM orders WHERE order_number = ? AND customer_id = ? AND TRIM(fabric_type) = TRIM(?) LIMIT 1',
      [data.order_number, data.customer_id, data.fabric_type]
    );
  }
  return null;
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
  const schema = schemaHealth();
  const volumeRoot = path.resolve(process.env.RAILWAY_VOLUME_MOUNT_PATH || '/data');
  res.json({
    ok: schema.ok,
    service: '2B Tex Backend',
    database: DB_PATH,
    tables: row.count,
    schema,
    storage: {
      database: DB_PATH,
      railwayVolumeRoot: volumeRoot,
      usesRailwayVolumePath: path.resolve(DB_PATH).startsWith(volumeRoot),
      autoSeedAllowed: process.env.ALLOW_DB_SEED === '1',
      localImportEnabled: LOCAL_IMPORT_ENABLED,
    },
    time: now()
  });
}));

function normalizeAiArray(value) {
  return Array.isArray(value) ? value : [];
}

function compactAiPayload(input = {}) {
  const orders = normalizeAiArray(input.orders);
  const outbox = normalizeAiArray(input.reportOutbox);
  const summaryStats = input.summaryStats && typeof input.summaryStats === 'object' ? input.summaryStats : {};
  return {
    summaryStats,
    orders: orders.slice(0, 150).map((order) => ({
      orderNumber: order.orderNumber,
      customer: order.customer,
      fabricType: order.fabricType,
      dyehouse: order.dyehouse,
      status: order.status,
      stageInfo: order.stageInfo || null,
      operationClosed: Boolean(order.operationClosed),
      totalRawOrdered: Number(order.totalRawOrdered || 0),
      totalRawReceived: Number(order.totalRawReceived || 0),
      totalSentToDyehouse: Number(order.totalSentToDyehouse || 0),
      totalFinishedReceived: Number(order.totalFinishedReceived || 0),
      rawAtDyehouseAvailable: Number(order.rawAtDyehouseAvailable || 0),
      warehouseBalance: Number(order.warehouseBalance || 0),
      totalDeliveredToCustomer: Number(order.totalDeliveredToCustomer || 0),
      totalWaste: Number(order.totalWaste || 0),
      totalWastePercent: Number(order.totalWastePercent || 0),
      expectedWasteQuantity: Number(order.expectedWasteQuantity || 0),
      expectedWastePercent: Number(order.expectedWastePercent || 0),
      accessoryRequired: Number(order.accessoryRequired || 0),
      accessoryBalance: Number(order.accessoryBalance || 0),
      rawNoteNumbers: normalizeAiArray(order.rawNoteNumbers),
      notes: order.notes || '',
      allocations: normalizeAiArray(order.allocations).map((allocation) => ({
        color: allocation.color,
        dyehouse: allocation.dyehouse,
        plannedQuantity: Number(allocation.plannedQuantity || 0),
        sentToDyehouse: Number(allocation.sentToDyehouse || 0),
        finishedReceived: Number(allocation.finishedReceived || 0),
        remainingAtDyehouse: Number(allocation.remainingAtDyehouse || 0),
        wasteQuantity: Number(allocation.wasteQuantity || 0),
        expectedWasteQuantity: Number(allocation.expectedWasteQuantity || 0),
      })),
    })),
    reportOutbox: outbox.slice(0, 100).map((item) => ({
      reportType: item.reportType,
      orderNumber: item.orderNumber,
      customerName: item.customerName,
      targetGroup: item.targetGroup,
      status: item.status,
      errorMessage: item.errorMessage || '',
      createdAt: item.createdAt,
      sentAt: item.sentAt,
    })),
  };
}

function aiFallbackAnalysis(data) {
  const orders = normalizeAiArray(data.orders);
  const outbox = normalizeAiArray(data.reportOutbox);
  const openOrders = orders.filter((order) => !['completed', 'closed'].includes(order.status) && !order.operationClosed);
  const stageGroups = openOrders.reduce((acc, order) => {
    const key = order.stageInfo?.key || 'unknown';
    acc[key] = acc[key] || { count: 0, quantity: 0, label: order.stageInfo?.label || 'غير محدد' };
    acc[key].count += 1;
    acc[key].quantity += Number(order.totalRawOrdered || 0);
    return acc;
  }, {});
  const stageLine = Object.values(stageGroups)
    .sort((a, b) => b.count - a.count)
    .map((item) => `${item.label}: ${item.count} طلب / ${Math.round(item.quantity).toLocaleString('en-US')} كجم`)
    .join('، ') || 'لا توجد طلبات مفتوحة ظاهرة.';
  const atDyehouse = orders.reduce((total, order) => total + Number(order.rawAtDyehouseAvailable || 0), 0);
  const warehouse = orders.reduce((total, order) => total + Number(order.warehouseBalance || 0), 0);
  const unsentRaw = orders.reduce((total, order) => total + Math.max(Number(order.totalRawOrdered || 0) - Number(order.totalRawReceived || 0), 0), 0);
  const failedReports = outbox.filter((item) => item.status === 'failed' || item.status === 'pending');
  const stuckOrders = openOrders
    .map((order) => ({
      label: `${order.orderNumber || '-'} - ${order.customer || '-'} - ${order.stageInfo?.label || 'غير محدد'} - واقف ${Number(order.stageInfo?.days || 0)} يوم`,
      days: Number(order.stageInfo?.days || 0),
      quantity: Number(order.totalRawOrdered || 0),
    }))
    .sort((a, b) => (b.days - a.days) || (b.quantity - a.quantity))
    .slice(0, 8)
    .map((item) => item.label);
  return {
    source: process.env.OPENAI_API_KEY ? 'local-fallback-after-openai-error' : 'local-rules',
    executiveSummary: `يوجد ${orders.length} طلب داخل النظام، منها ${openOrders.length} طلب مفتوح. توزيع الوقوف الحالي: ${stageLine}. رصيد المصبغة ${Math.round(atDyehouse).toLocaleString('en-US')} كجم، ورصيد المخزن ${Math.round(warehouse).toLocaleString('en-US')} كجم.`,
    keyFindings: [
      `طلبات مفتوحة: ${openOrders.length}`,
      `خام لم يخرج للنسيج/المصبغة بعد: ${Math.round(unsentRaw).toLocaleString('en-US')} كجم`,
      `رصيد داخل المصابغ: ${Math.round(atDyehouse).toLocaleString('en-US')} كجم، وهذا ليس هالكًا نهائيًا أثناء التشغيل.`,
      `رصيد جاهز أو واقف بالمخزن: ${Math.round(warehouse).toLocaleString('en-US')} كجم`,
      `تقارير واتساب تحتاج متابعة: ${failedReports.length}`,
    ],
    ordersToWatch: stuckOrders,
    risks: [
      atDyehouse > 0 ? 'وجود رصيد داخل المصابغ يحتاج متابعة بتاريخ الإرسال حتى لا يتحول لتأخير غير واضح.' : 'لا يظهر رصيد كبير داخل المصابغ من البيانات الحالية.',
      warehouse > 0 ? 'وجود رصيد بالمخزن يحتاج فلترة حسب العميل وتاريخ دخول المخزن لتحديد أولويات التسليم.' : 'رصيد المخزن الحالي محدود أو غير ظاهر في البيانات المرسلة.',
      failedReports.length ? 'بعض رسائل أو تقارير واتساب لم ترسل أو ما زالت معلقة.' : 'لا توجد مشكلة واضحة في قائمة إرسال التقارير.',
    ],
    recommendations: [
      'ابدأ بالطلبات صاحبة أكبر عدد أيام وقوف، ثم الأكبر كمية.',
      'راجع أوامر المصبغة التي لها خام مرسل ولم يكتمل استلام المجهز.',
      'راجع رصيد المخزن حسب العميل لتحديد ما يمكن تسليمه اليوم.',
      'لا تغلق أي طلب قبل مطابقة الخام المرسل، المجهز المستلم، التسليم، والمرتجعات.',
    ],
    priorityActions: [
      'فلتر الطلبات على: واقف في المصبغة، وراجع أقدم تاريخ إرسال.',
      'فلتر الطلبات على: واقف في المخزن، ورتب حسب العميل والتاريخ.',
      'راجع قائمة الإرسال لو فيها تقارير معلقة قبل نهاية اليوم.',
    ],
    whatsappMessage: `ملخص 2B: ${orders.length} طلب، المفتوح ${openOrders.length}. رصيد المصابغ ${Math.round(atDyehouse).toLocaleString('en-US')} كجم، رصيد المخزن ${Math.round(warehouse).toLocaleString('en-US')} كجم، خام غير مرسل ${Math.round(unsentRaw).toLocaleString('en-US')} كجم. الأولوية: متابعة أقدم طلبات واقفة في المصبغة والمخزن.`,
  };
}

function daysBetween(startValue, endValue = new Date()) {
  const start = startValue ? new Date(startValue) : null;
  const end = endValue instanceof Date ? endValue : new Date(endValue);
  if (!start || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)));
}

function latestDate(rows, ...keys) {
  const dates = [];
  for (const row of rows || []) {
    for (const key of keys) {
      const value = row?.[key];
      if (!value) continue;
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) dates.push(date);
    }
  }
  if (!dates.length) return '';
  return new Date(Math.max(...dates.map((date) => date.getTime()))).toISOString().slice(0, 10);
}

function orderStageForAi(order, summary, movementDates = {}, allocationsCount = 0) {
  if (Number(order.is_closed || 0) === 1) return { key: 'closed', label: 'مغلق', since: movementDates.closed || order.updated_at || order.created_at, reason: 'تم إغلاق الطلب تشغيليًا' };
  if (!allocationsCount) return { key: 'color-planning', label: 'بانتظار توزيع الألوان', since: order.created_at || order.order_date, reason: 'لا توجد خطة ألوان مسجلة' };
  if (summary.remainingRawToReceive > 0) return { key: 'weaving', label: 'واقف في النسيج', since: order.order_date || order.created_at, reason: `متبقي استلام خام ${summary.remainingRawToReceive} كجم` };
  if (summary.remainingNotSentToDyehouse > 0) return { key: 'ready-to-dyehouse', label: 'خام جاهز لم يرسل للمصبغة', since: movementDates.rawReceived || order.order_date || order.created_at, reason: `رصيد خام لم يرسل ${summary.remainingNotSentToDyehouse} كجم` };
  if (summary.remainingAtDyehouse > 0) return { key: 'dyehouse', label: 'واقف في المصبغة', since: movementDates.sentToDyehouse || order.order_date || order.created_at, reason: `داخل المصبغة ${summary.remainingAtDyehouse} كجم` };
  if (summary.warehouseBalance > 0) return { key: 'warehouse', label: 'واقف في المخزن', since: movementDates.finishedReceived || order.order_date || order.created_at, reason: `رصيد مخزن ${summary.warehouseBalance} كجم` };
  if (summary.customerRemainingQuantity > 0 && summary.totalFinishedReceived > 0) return { key: 'delivery', label: 'جاهز للتسليم', since: movementDates.finishedReceived || order.order_date || order.created_at, reason: `متبقي للعميل ${summary.customerRemainingQuantity} كجم` };
  return { key: 'completed', label: 'مكتمل فعليًا', since: movementDates.customerDelivered || order.updated_at || order.created_at, reason: 'لا يظهر رصيد تشغيل مفتوح' };
}

function groupSum(rows, key = 'quantity') {
  return (rows || []).reduce((total, row) => total + Number(row?.[key] || 0), 0);
}

async function buildAiEmployeeContext() {
  await repairMissingCustomersFromReferences();
  const today = new Date();
  const [
    customers,
    orders,
    allocations,
    rawReceivingBatches,
    dyehouseDeliveryBatches,
    finishedReceivingBatches,
    customerDeliveryBatches,
    accessoryBatches,
    rawReturns,
    dyehouseTransfers,
    reportOutbox,
    auditLog,
  ] = await Promise.all([
    all('SELECT * FROM customers ORDER BY name'),
    all('SELECT * FROM orders ORDER BY created_at DESC'),
    all('SELECT * FROM order_allocations ORDER BY created_at'),
    all('SELECT * FROM raw_receiving_batches ORDER BY created_at'),
    all('SELECT * FROM dyehouse_delivery_batches ORDER BY created_at'),
    all('SELECT * FROM finished_receiving_batches ORDER BY created_at'),
    all('SELECT * FROM customer_delivery_batches ORDER BY created_at'),
    all('SELECT * FROM accessory_batches ORDER BY created_at'),
    all('SELECT * FROM raw_returns ORDER BY created_at'),
    all('SELECT * FROM dyehouse_transfers ORDER BY created_at'),
    all('SELECT * FROM report_outbox ORDER BY created_at DESC LIMIT 100'),
    all('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 80'),
  ]);
  const customersById = new Map(customers.map((customer) => [customer.id, customer]));
  const byOrder = (rows) => rows.reduce((acc, row) => {
    const key = row.order_id;
    if (!key) return acc;
    acc[key] = acc[key] || [];
    acc[key].push(row);
    return acc;
  }, {});
  const buckets = {
    allocations: byOrder(allocations),
    rawReceivingBatches: byOrder(rawReceivingBatches),
    dyehouseDeliveryBatches: byOrder(dyehouseDeliveryBatches),
    finishedReceivingBatches: byOrder(finishedReceivingBatches),
    customerDeliveryBatches: byOrder(customerDeliveryBatches),
    accessoryBatches: byOrder(accessoryBatches),
    rawReturns: byOrder(rawReturns),
    dyehouseTransfers: byOrder(dyehouseTransfers),
  };

  const orderCards = orders.map((order) => {
    const orderAllocations = buckets.allocations[order.id] || [];
    const summary = calculateOrderSummary(order, {
      rawReceivingBatches: buckets.rawReceivingBatches[order.id] || [],
      dyehouseDeliveryBatches: buckets.dyehouseDeliveryBatches[order.id] || [],
      finishedReceivingBatches: buckets.finishedReceivingBatches[order.id] || [],
      customerDeliveryBatches: buckets.customerDeliveryBatches[order.id] || [],
      rawReturns: buckets.rawReturns[order.id] || [],
    });
    const movementDates = {
      rawReceived: latestDate(buckets.rawReceivingBatches[order.id], 'batch_date', 'created_at'),
      sentToDyehouse: latestDate(buckets.dyehouseDeliveryBatches[order.id], 'batch_date', 'created_at'),
      finishedReceived: latestDate(buckets.finishedReceivingBatches[order.id], 'batch_date', 'created_at'),
      customerDelivered: latestDate(buckets.customerDeliveryBatches[order.id], 'batch_date', 'created_at'),
    };
    const stage = orderStageForAi(order, summary, movementDates, orderAllocations.length);
    const customer = customersById.get(order.customer_id);
    return {
      id: order.id,
      orderNumber: order.order_number,
      customer: customer?.name || readableCustomerNameFromId(order.customer_id) || '-',
      fabricType: order.fabric_type || '-',
      dyehouse: order.dyehouse || '-',
      orderDate: order.order_date,
      status: order.status,
      isClosed: Number(order.is_closed || 0) === 1,
      stage: { ...stage, days: daysBetween(stage.since, today) },
      quantities: summary,
      movementDates,
      allocationsCount: orderAllocations.length,
      colors: orderAllocations.slice(0, 20).map((allocation) => ({
        color: allocation.color || '-',
        dyehouse: allocation.dyehouse || order.dyehouse || '-',
        plannedQuantity: Number(allocation.planned_quantity || 0),
        width: Number(allocation.finished_width || allocation.raw_width || 0),
        weight: Number(allocation.finished_weight || 0),
      })),
      rawNotes: (buckets.rawReceivingBatches[order.id] || []).map((row) => row.note_number).filter(Boolean),
      dyehouseNotes: (buckets.dyehouseDeliveryBatches[order.id] || []).map((row) => row.note_number).filter(Boolean),
      operationNotes: safeJsonParse(order.operation_notes_json, null) || order.notes || '',
      notes: order.notes || '',
    };
  });

  const openOrders = orderCards.filter((order) => !order.isClosed && !['completed', 'closed'].includes(order.status));
  const stageGroups = openOrders.reduce((acc, order) => {
    const key = order.stage.key;
    acc[key] = acc[key] || { key, label: order.stage.label, count: 0, quantity: 0, oldestDays: 0 };
    acc[key].count += 1;
    acc[key].quantity += Number(order.quantities.totalRequestedQuantity || 0);
    acc[key].oldestDays = Math.max(acc[key].oldestDays, Number(order.stage.days || 0));
    return acc;
  }, {});
  const dyehouseBalances = dyehouseDeliveryBatches.reduce((acc, row) => {
    const dyehouse = row.dyehouse || 'غير محدد';
    acc[dyehouse] = acc[dyehouse] || { dyehouse, sent: 0, finished: 0, balance: 0 };
    acc[dyehouse].sent += Number(row.quantity || 0);
    return acc;
  }, {});
  for (const row of finishedReceivingBatches) {
    const allocation = allocations.find((item) => item.id === row.allocation_id);
    const order = orders.find((item) => item.id === row.order_id);
    const dyehouse = allocation?.dyehouse || order?.dyehouse || 'غير محدد';
    dyehouseBalances[dyehouse] = dyehouseBalances[dyehouse] || { dyehouse, sent: 0, finished: 0, balance: 0 };
    dyehouseBalances[dyehouse].finished += Number(row.quantity || 0);
  }
  Object.values(dyehouseBalances).forEach((row) => { row.balance = Math.max(row.sent - row.finished, 0); });

  return {
    generatedAt: now(),
    role: '2B Tex AI Employee',
    mission: 'متابعة التشغيل اليومي، كشف الوقوف، ترتيب الأولويات، ومساعدة الإدارة برسائل عملية.',
    factorySnapshot: {
      customersCount: customers.length,
      ordersCount: orders.length,
      openOrdersCount: openOrders.length,
      requestedRaw: groupSum(orderCards.map((order) => ({ quantity: order.quantities.totalRequestedQuantity }))),
      rawReceived: groupSum(orderCards.map((order) => ({ quantity: order.quantities.totalRawReceived }))),
      sentToDyehouse: groupSum(orderCards.map((order) => ({ quantity: order.quantities.totalSentToDyehouse }))),
      finishedReceived: groupSum(orderCards.map((order) => ({ quantity: order.quantities.totalFinishedReceived }))),
      warehouseBalance: groupSum(orderCards.map((order) => ({ quantity: order.quantities.warehouseBalance }))),
      dyehouseBalance: groupSum(orderCards.map((order) => ({ quantity: order.quantities.remainingAtDyehouse }))),
      deliveredToCustomers: groupSum(orderCards.map((order) => ({ quantity: order.quantities.customerDeliveredQuantity }))),
      accessoryMovements: accessoryBatches.length,
      rawReturns: groupSum(rawReturns),
      transfersCount: dyehouseTransfers.length,
      pendingWhatsappReports: reportOutbox.filter((item) => ['pending', 'queued', 'failed'].includes(item.status)).length,
    },
    stageGroups: Object.values(stageGroups).sort((a, b) => (b.oldestDays - a.oldestDays) || (b.quantity - a.quantity)),
    priorityOrders: openOrders
      .slice()
      .sort((a, b) => (b.stage.days - a.stage.days) || (b.quantities.totalRequestedQuantity - a.quantities.totalRequestedQuantity))
      .slice(0, 20),
    dyehouseBalances: Object.values(dyehouseBalances).sort((a, b) => b.balance - a.balance),
    recentAudit: auditLog.map((row) => ({
      action: row.action,
      entityType: row.entity_type,
      entityId: row.entity_id,
      note: row.note,
      createdAt: row.created_at,
    })),
    reportOutbox: reportOutbox.map((row) => ({
      reportType: row.report_type,
      orderNumber: row.order_number,
      customerName: row.customer_name,
      targetGroup: row.target_group,
      status: row.status,
      errorMessage: row.error_message || '',
      createdAt: row.created_at,
      sentAt: row.sent_at,
    })),
  };
}

async function runOpenAiAnalysis(data) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: [
            'أنت نموذج ذكاء اصطناعي متخصص في تشغيل 2B Tex للنسيج والصباغة والتجهيز.',
            'حلل النظام من منظور صاحب المصنع: ما الذي واقف؟ واقف من امتى؟ ما سبب الوقوف؟ وما الأولوية اليوم؟',
            'لا تعتبر rawAtDyehouseAvailable أو remainingAtDyehouse هالكًا نهائيًا أثناء التشغيل.',
            'الهالك النهائي يظهر فقط بعد اكتمال أو إغلاق دورة الطلب.',
            'اكتب عربي واضح مختصر وعملي، واعتمد على الأرقام فقط.',
            'أرجع JSON فقط بالمفاتيح: source, executiveSummary, keyFindings, ordersToWatch, risks, recommendations, priorityActions, whatsappMessage.',
          ].join('\n'),
        },
        { role: 'user', content: JSON.stringify(data) },
      ],
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error?.message || body.message || `OpenAI ${response.status}`);
  const content = body.choices?.[0]?.message?.content || '{}';
  const parsed = JSON.parse(content);
  return {
    source: 'openai',
    executiveSummary: parsed.executiveSummary || '',
    keyFindings: normalizeAiArray(parsed.keyFindings),
    ordersToWatch: normalizeAiArray(parsed.ordersToWatch),
    risks: normalizeAiArray(parsed.risks),
    recommendations: normalizeAiArray(parsed.recommendations),
    priorityActions: normalizeAiArray(parsed.priorityActions),
    whatsappMessage: parsed.whatsappMessage || '',
  };
}

async function runGeminiAnalysis(data) {
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{
          text: [
            'أنت نموذج ذكاء اصطناعي متخصص في تشغيل 2B Tex للنسيج والصباغة والتجهيز.',
            'حلل النظام من منظور صاحب المصنع: ما الذي واقف؟ واقف من امتى؟ ما سبب الوقوف؟ وما الأولوية اليوم؟',
            'لا تعتبر rawAtDyehouseAvailable أو remainingAtDyehouse هالكًا نهائيًا أثناء التشغيل.',
            'الهالك النهائي يظهر فقط بعد اكتمال أو إغلاق دورة الطلب.',
            'اكتب عربي واضح مختصر وعملي، واعتمد على الأرقام فقط.',
            'أرجع JSON فقط بالمفاتيح: source, executiveSummary, keyFindings, ordersToWatch, risks, recommendations, priorityActions, whatsappMessage.',
          ].join('\n'),
        }],
      },
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
      contents: [{
        role: 'user',
        parts: [{ text: JSON.stringify(data) }],
      }],
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error?.message || body.message || `Gemini ${response.status}`);
  const content = body.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '{}';
  const parsed = JSON.parse(content);
  return {
    source: 'gemini',
    executiveSummary: parsed.executiveSummary || '',
    keyFindings: normalizeAiArray(parsed.keyFindings),
    ordersToWatch: normalizeAiArray(parsed.ordersToWatch),
    risks: normalizeAiArray(parsed.risks),
    recommendations: normalizeAiArray(parsed.recommendations),
    priorityActions: normalizeAiArray(parsed.priorityActions),
    whatsappMessage: parsed.whatsappMessage || '',
  };
}

app.get('/api/ai/health', (_req, res) => {
  const provider = process.env.GEMINI_API_KEY ? 'gemini' : (process.env.OPENAI_API_KEY ? 'openai' : 'local-rules');
  const model = process.env.GEMINI_API_KEY ? (process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite') : (process.env.OPENAI_MODEL || 'gpt-4.1-mini');
  res.json({ ok: true, provider, model, hasGeminiKey: Boolean(process.env.GEMINI_API_KEY), hasOpenAiKey: Boolean(process.env.OPENAI_API_KEY) });
});

app.post('/api/ai/analyze-report', asyncHandler(async (req, res) => {
  const data = compactAiPayload(req.body || {});
  if (process.env.GEMINI_API_KEY) {
    try {
      return res.json(await runGeminiAnalysis(data));
    } catch (error) {
      console.warn('[2B Tex] Gemini analysis failed, trying next provider:', error.message);
    }
  }
  if (!process.env.OPENAI_API_KEY) return res.json(aiFallbackAnalysis(data));
  try {
    return res.json(await runOpenAiAnalysis(data));
  } catch (error) {
    console.warn('[2B Tex] OpenAI analysis failed, using local rules:', error.message);
    return res.json(aiFallbackAnalysis(data));
  }
}));

app.get('/api/ai/employee-context', asyncHandler(async (_req, res) => {
  res.json(await buildAiEmployeeContext());
}));

app.post('/api/ai/employee-report', asyncHandler(async (req, res) => {
  const context = await buildAiEmployeeContext();
  const data = {
    ...context,
    userRequest: String(req.body?.question || 'حلل حالة تشغيل 2B الآن كموظف ذكاء اصطناعي مسؤول عن المتابعة اليومية.').trim(),
  };
  if (process.env.GEMINI_API_KEY) {
    try {
      return res.json(await runGeminiAnalysis(data));
    } catch (error) {
      console.warn('[2B Tex] Gemini employee report failed, trying next provider:', error.message);
    }
  }
  if (!process.env.OPENAI_API_KEY) return res.json(aiFallbackAnalysis({ orders: data.priorityOrders, reportOutbox: data.reportOutbox, summaryStats: data.factorySnapshot }));
  try {
    return res.json(await runOpenAiAnalysis(data));
  } catch (error) {
    console.warn('[2B Tex] OpenAI employee report failed, using local rules:', error.message);
    return res.json(aiFallbackAnalysis({ orders: data.priorityOrders, reportOutbox: data.reportOutbox, summaryStats: data.factorySnapshot }));
  }
}));

app.post('/api/backup', asyncHandler(async (_req, res) => {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const target = path.join(BACKUP_DIR, `2btex-${stamp}.sqlite`);
  if (fs.existsSync(DB_PATH)) fs.copyFileSync(DB_PATH, target);
  await auditMutation('create', 'system_settings', 'backup', null, { file: target, created_at: now() }, 'إنشاء نسخة احتياطية');
  res.json({ ok: true, file: target });
}));

app.get('/api/backups', asyncHandler(async (_req, res) => {
  const files = fs.readdirSync(BACKUP_DIR).filter((name) => name.endsWith('.sqlite'));
  res.json(files.map((name) => ({ name, path: path.join(BACKUP_DIR, name) })));
}));

app.get('/api/audit-log', asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim();
  const limit = Math.min(Math.max(Number(req.query.limit || 100), 1), 500);
  if (q) {
    const like = `%${q}%`;
    return res.json(await all(
      `SELECT * FROM audit_log
       WHERE entity_id LIKE ? OR note LIKE ? OR before_json LIKE ? OR after_json LIKE ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [like, like, like, like, limit]
    ));
  }
  res.json(await all('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT ?', [limit]));
}));

app.post('/api/auth/login', asyncHandler(async (req, res) => {
  await ensureDefaultAdminUser();
  const username = String(req.body?.username || '').trim();
  const password = String(req.body?.password || '');
  if (!username || !password) return res.status(400).json({ error: 'اسم الدخول وكلمة المرور مطلوبين' });
  let row = await get('SELECT * FROM users WHERE username = ?', [username]);
  const matchesStoredPassword = row && verifyPassword(password, row.password_hash);
  const matchesSystemFallback = username === (process.env.SYSTEM_USER || 'admin') && password === (process.env.SYSTEM_PASS || '151297');
  if (!row && matchesSystemFallback) {
    const user = { id:'system-admin', name:'مدير النظام', username, role:'admin', is_active:1 };
    const token = signSessionPayload({ id:user.id, username:user.username, name:user.name, role:user.role, exp:Date.now() + (8 * 60 * 60 * 1000) });
    res.setHeader('Set-Cookie', sessionCookie(token));
    return res.json({ ok: true, user });
  }
  if (!row || Number(row.is_active) !== 1 || (!matchesStoredPassword && !matchesSystemFallback)) {
    return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
  }
  const user = publicUser(row);
  const token = signSessionPayload({ id:user.id, username:user.username, name:user.name, role:user.role, exp:Date.now() + (8 * 60 * 60 * 1000) });
  res.setHeader('Set-Cookie', sessionCookie(token));
  res.json({ ok: true, user });
}));

app.get('/api/auth/me', asyncHandler(async (req, res) => {
  await ensureDefaultAdminUser();
  const token = cookieValue(req.headers.cookie, 'twobtex_session');
  const session = verifySessionToken(token);
  if (!session?.id) return res.status(401).json({ error: 'غير مسجل الدخول' });
  if (session.id === 'system-admin' && session.username === (process.env.SYSTEM_USER || 'admin')) {
    return res.json({ ok: true, user: { id:'system-admin', name:session.name || 'مدير النظام', username:session.username, role:'admin', is_active:1 } });
  }
  const row = await get('SELECT * FROM users WHERE id = ?', [session.id]);
  if (!row || Number(row.is_active) !== 1) return res.status(401).json({ error: 'الجلسة غير صالحة' });
  res.json({ ok: true, user: publicUser(row) });
}));

app.post('/api/auth/logout', asyncHandler(async (_req, res) => {
  res.setHeader('Set-Cookie', clearSessionCookie());
  res.json({ ok: true });
}));

app.get('/api/users', asyncHandler(async (_req, res) => {
  await ensureDefaultAdminUser();
  const rows = await all('SELECT * FROM users ORDER BY created_at DESC');
  res.json(rows.map(publicUser));
}));

app.post('/api/users', asyncHandler(async (req, res) => {
  await ensureDefaultAdminUser();
  const body = req.body || {};
  const username = String(body.username || '').trim();
  const password = String(body.password || '').trim();
  if (!username) return res.status(400).json({ error: 'اسم المستخدم مطلوب' });
  if (!password) return res.status(400).json({ error: 'كلمة المرور مطلوبة' });
  const existing = await get('SELECT id FROM users WHERE username = ?', [username]);
  if (existing) return res.status(400).json({ error: 'اسم الدخول موجود بالفعل' });
  const row = {
    id: body.id || id(),
    name: String(body.name || username).trim(),
    username,
    password_hash: hashPassword(password),
    role: ['admin','manager','user'].includes(body.role) ? body.role : 'user',
    is_active: body.is_active === 0 ? 0 : 1,
    created_at: now(),
    updated_at: now(),
  };
  await run(
    'INSERT INTO users (id, name, username, password_hash, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [row.id, row.name, row.username, row.password_hash, row.role, row.is_active, row.created_at, row.updated_at]
  );
  const after = await get('SELECT * FROM users WHERE id = ?', [row.id]);
  await auditMutation('create', 'users', row.id, null, publicUser(after), 'إضافة مستخدم للنظام');
  res.status(201).json(publicUser(after));
}));

app.put('/api/users/:id', asyncHandler(async (req, res) => {
  await ensureDefaultAdminUser();
  const before = await get('SELECT * FROM users WHERE id = ?', [req.params.id]);
  if (!before) return res.status(404).json({ error: 'المستخدم غير موجود' });
  const body = req.body || {};
  const fields = {
    name: body.name !== undefined ? String(body.name || '').trim() : before.name,
    username: body.username !== undefined ? String(body.username || '').trim() : before.username,
    role: ['admin','manager','user'].includes(body.role) ? body.role : before.role,
    is_active: body.is_active === 0 || body.is_active === 1 ? body.is_active : before.is_active,
    updated_at: now(),
  };
  if (!fields.username) return res.status(400).json({ error: 'اسم المستخدم مطلوب' });
  const duplicate = await get('SELECT id FROM users WHERE username = ? AND id <> ?', [fields.username, req.params.id]);
  if (duplicate) return res.status(400).json({ error: 'اسم الدخول موجود بالفعل' });
  const values = [fields.name, fields.username, fields.role, fields.is_active, fields.updated_at];
  let sql = 'UPDATE users SET name = ?, username = ?, role = ?, is_active = ?, updated_at = ?';
  if (body.password) {
    sql += ', password_hash = ?';
    values.push(hashPassword(body.password));
  }
  sql += ' WHERE id = ?';
  values.push(req.params.id);
  await run(sql, values);
  const after = await get('SELECT * FROM users WHERE id = ?', [req.params.id]);
  await auditMutation('update', 'users', req.params.id, publicUser(before), publicUser(after), 'تعديل مستخدم في النظام');
  res.json(publicUser(after));
}));

app.delete('/api/users/:id', asyncHandler(async (req, res) => {
  await ensureDefaultAdminUser();
  const before = await get('SELECT * FROM users WHERE id = ?', [req.params.id]);
  if (!before) return res.status(404).json({ error: 'المستخدم غير موجود' });
  const activeAdmins = await all("SELECT id FROM users WHERE role = 'admin' AND is_active = 1");
  if (before.role === 'admin' && activeAdmins.length <= 1) {
    return res.status(400).json({ error: 'لا يمكن حذف آخر مدير نشط' });
  }
  await run('DELETE FROM users WHERE id = ?', [req.params.id]);
  await auditMutation('delete', 'users', req.params.id, publicUser(before), { deleted: 1 }, 'حذف مستخدم من النظام');
  res.json({ ok: true, deleted: 1 });
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
  const after = await get('SELECT * FROM order_allocations WHERE id = ?', [query.id]);
  await auditMutation('create', 'order_allocations', query.id, null, after, `POST /api/orders/${req.params.orderId}/allocations`);
  res.status(201).json(after);
}));

app.put('/api/allocations/:id', asyncHandler(async (req, res) => {
  const before = await get('SELECT * FROM order_allocations WHERE id = ?', [req.params.id]);
  const query = updateSql('order_allocations', req.body || {}, req.params.id);
  await run(query.sql, query.values);
  const after = await get('SELECT * FROM order_allocations WHERE id = ?', [req.params.id]);
  await auditMutation('update', 'order_allocations', req.params.id, before, after, `PUT /api/allocations/${req.params.id}`);
  res.json(after);
}));

app.delete('/api/allocations/:id', asyncHandler(async (req, res) => {
  const before = await get('SELECT * FROM order_allocations WHERE id = ?', [req.params.id]);
  const deleted = await deleteAllocationGraph(req.params.id);
  await auditMutation('delete', 'order_allocations', req.params.id, before, { deleted }, `DELETE /api/allocations/${req.params.id}`);
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

app.post('/api/batches/:type', asyncHandler(async (req, res) => {
  const table = batchTables[req.params.type];
  if (!table) return res.status(400).json({ error: 'Unknown batch type' });
  const query = insertSql(table, req.body || {});
  await run(query.sql, query.values);
  const after = await get(`SELECT * FROM ${table} WHERE id = ?`, [query.id]);
  await auditMutation('create', table, query.id, null, after, `POST /api/batches/${req.params.type}`);
  res.status(201).json(after);
}));

app.get('/api/bootstrap', asyncHandler(async (_req, res) => {
  await repairMissingCustomersFromReferences();
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
  if (req.params.key === 'auditLog') {
    return res.json({ key: req.params.key, value: null, ignored: true });
  }
  const valueJson = JSON.stringify(req.body?.value ?? null);
  const existing = await get('SELECT key, value_json, created_at, updated_at FROM system_settings WHERE key = ?', [req.params.key]);
  const before = existing ? { key: existing.key, value: safeJsonParse(existing.value_json, null), created_at: existing.created_at, updated_at: existing.updated_at } : null;
  if (existing) {
    await run('UPDATE system_settings SET value_json = ?, updated_at = ? WHERE key = ?', [valueJson, now(), req.params.key]);
  } else {
    await run('INSERT INTO system_settings (key, value_json, created_at, updated_at) VALUES (?, ?, ?, ?)', [req.params.key, valueJson, now(), now()]);
  }
  const after = { key: req.params.key, value: req.body?.value ?? null, updated_at: now() };
  await auditMutation(existing ? 'update' : 'create', 'system_settings', req.params.key, before, after, 'حفظ إعدادات النظام');
  res.json(after);
}));

function batchPost(route, table) {
  app.post(route, asyncHandler(async (req, res) => {
    const query = insertSql(table, req.body || {});
    await run(query.sql, query.values);
    const after = await get(`SELECT * FROM ${table} WHERE id = ?`, [query.id]);
    await auditMutation('create', table, query.id, null, after, `POST ${route}`);
    res.status(201).json(after);
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
  const after = await get('SELECT * FROM dyehouse_transfers WHERE id = ?', [query.id]);
  await auditMutation('create', 'dyehouse_transfers', query.id, null, after, 'POST /api/transfers');
  res.status(201).json(after);
}));

app.put('/api/transfers/:id', asyncHandler(async (req, res) => {
  const before = await get('SELECT * FROM dyehouse_transfers WHERE id = ?', [req.params.id]);
  const query = updateSql('dyehouse_transfers', req.body || {}, req.params.id);
  await run(query.sql, query.values);
  const after = await get('SELECT * FROM dyehouse_transfers WHERE id = ?', [req.params.id]);
  await auditMutation('update', 'dyehouse_transfers', req.params.id, before, after, `PUT /api/transfers/${req.params.id}`);
  res.json(after);
}));

app.delete('/api/transfers/:id', asyncHandler(async (req, res) => {
  const before = await get('SELECT * FROM dyehouse_transfers WHERE id = ?', [req.params.id]);
  await run('DELETE FROM dyehouse_transfers WHERE id = ?', [req.params.id]);
  await auditMutation('delete', 'dyehouse_transfers', req.params.id, before, { deleted: 1 }, `DELETE /api/transfers/${req.params.id}`);
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

function sourceDocumentValue(row) {
  const value = row?.sourceDocument || row?.source_document || row?.source_document_json || null;
  if (!value) return null;
  return typeof value === 'string' ? value : JSON.stringify(value);
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
    operation_notes_json: typeof row.operation_notes_json === 'string'
      ? row.operation_notes_json
      : JSON.stringify(row.operationNotes || row.operation_notes_json || {}),
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
  if (!LOCAL_IMPORT_ENABLED) {
    return res.status(403).json({ ok: false, error: 'LOCAL_IMPORT_DISABLED', message: 'Importing browser LocalStorage into Railway is disabled.' });
  }
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
      source_document_json: sourceDocumentValue(row),
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
      source_document_json: sourceDocumentValue(row),
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
      source_document_json: sourceDocumentValue(row),
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
      source_document_json: sourceDocumentValue(row),
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
      source_document_json: sourceDocumentValue(row),
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
      source_document_json: sourceDocumentValue(row),
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
  const before = await get(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
  await run(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
  await auditMutation('delete', table, req.params.id, before, { deleted: 1 }, `DELETE /api/batches/${req.params.type}/${req.params.id}`);
  res.json({ ok: true });
}));

app.put('/api/batches/:type/:id', asyncHandler(async (req, res) => {
  const table = batchTables[req.params.type];
  if (!table) return res.status(400).json({ error: 'Unknown batch type' });
  const before = await get(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
  const query = updateSql(table, req.body || {}, req.params.id);
  await run(query.sql, query.values);
  const after = await get(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
  await auditMutation('update', table, req.params.id, before, after, `PUT /api/batches/${req.params.type}/${req.params.id}`);
  res.json(after);
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
  await ensureDefaultAdminUser();
  app.listen(PORT, HOST, () => {
    console.log(`2B Tex Backend: http://localhost:${PORT}/api/health`);
  });
}).catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { AsyncLocalStorage } = require('async_hooks');
const express = require('express');
const cors = require('cors');
const { DB_PATH, initDb, run, transaction, get, all, schemaHealth } = require('./db');
const { calculateOrderSummary } = require('./calculations');

const PORT = Number(process.env.PORT || 3050);
const HOST = process.env.BACKEND_HOST || '127.0.0.1';
const SYSTEM_USER = process.env.SYSTEM_USER || 'admin';
const SYSTEM_PASS = process.env.SYSTEM_PASS || '';
const BACKUP_DIR = path.join(__dirname, 'backups');

fs.mkdirSync(BACKUP_DIR, { recursive: true });

const app = express();
const requestContext = new AsyncLocalStorage();
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use((req, _res, next) => {
  requestContext.run({ user: null }, next);
});

const TABLE_FIELDS = {
  customers: ['id','name','phone','a5_customer_id','notes','created_at','updated_at'],
  pricings: ['id','pricing_number','customer_id','pricing_date','fabric_type','material_type','dyehouse','color_class','quantity','inch_width','finished_weight','raw_cost','dye_cost','waste_percent','extra_cost','profit_per_kg','unit_price','total_price','pricing_items_json','payment_terms','notes','status','created_at','updated_at'],
  orders: ['id','order_number','pricing_id','customer_id','order_date','product_code','fabric_type','total_raw_quantity','expected_waste_percent','width_mode','width_lines_json','inch_width','kilo_price','raw_cost','payment_terms','accessory_type','accessory_percent','accessory_lines_json','dyehouse','weaving_source','notes','operation_notes_json','status','is_closed','created_at','updated_at'],
  order_allocations: ['id','order_id','color','pantone_code','planned_quantity','dyehouse','width_line_id','raw_inch','raw_width','finished_width','finished_weight','accessory_quantity_manual','notes','created_at','updated_at'],
  raw_receiving_batches: ['id','order_id','allocation_id','batch_date','quantity','supplier','note_number','notes','source_document_json','created_at','updated_at'],
  dyehouse_delivery_batches: ['id','order_id','allocation_id','batch_date','quantity','dyehouse','width_line_id','note_number','notes','source_document_json','created_at','updated_at'],
  finished_receiving_batches: ['id','order_id','allocation_id','batch_date','quantity','finished_width','finished_weight','note_number','notes','source_document_json','created_at','updated_at'],
  customer_delivery_batches: ['id','order_id','allocation_id','batch_date','quantity','customer_name','unit_price','total_price','payment_terms','note_number','movement','notes','source_document_json','created_at','updated_at'],
  accessory_batches: ['id','order_id','allocation_id','batch_date','accessory_type','quantity','note_number','movement','notes','source_document_json','created_at','updated_at'],
  raw_returns: ['id','order_id','allocation_id','batch_date','quantity','reason','note_number','notes','source_document_json','created_at','updated_at'],
  gluing_batches: ['id','order_id','allocation_id','batch_date','quantity','movement','partner_fabric','output_name','customer_name','note_number','notes','source_document_json','created_at','updated_at'],
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

function roleRank(role) {
  return { viewer: 0, accountant: 1, user: 1, manager: 2, admin: 3 }[role] ?? 0;
}

function userFromSessionPayload(payload) {
  if (!payload?.id) return null;
  return {
    id: payload.id,
    username: payload.username || '',
    name: payload.name || payload.username || '',
    role: payload.role || 'viewer',
    is_active: 1,
  };
}

async function requestUser(req) {
  const tokenUser = userFromSessionPayload(verifySessionToken(cookieValue(req.headers.cookie, 'twobtex_session')));
  if (tokenUser) return tokenUser;
  const header = req.headers.authorization || '';
  if (header.startsWith('Basic ')) {
    try {
      const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
      const separator = decoded.indexOf(':');
      const username = decoded.slice(0, separator);
      const password = decoded.slice(separator + 1);
      if (SYSTEM_PASS && username === SYSTEM_USER && password === SYSTEM_PASS) {
        return { id: 'system-admin', username, name: 'مدير النظام', role: 'admin', is_active: 1 };
      }
      const row = await get('SELECT * FROM users WHERE username = ?', [username]);
      if (row && Number(row.is_active) === 1 && verifyPassword(password, row.password_hash)) return publicUser(row);
    } catch {}
  }
  return null;
}

function requireRole(minRole = 'viewer') {
  return asyncHandler(async (req, res, next) => {
    const user = await requestUser(req);
    if (!user) return res.status(401).json({ error: 'غير مسجل الدخول' });
    if (roleRank(user.role) < roleRank(minRole)) return res.status(403).json({ error: 'هذه الحركة تحتاج صلاحية أعلى' });
    req.currentUser = user;
    const store = requestContext.getStore();
    if (store) store.user = user;
    next();
  });
}

async function ensureDefaultAdminUser() {
  const countRow = await get('SELECT COUNT(*) AS count FROM users');
  if (Number(countRow?.count || 0) > 0) return;
  const username = SYSTEM_USER;
  // Never seed a well-known password. Use SYSTEM_PASS when provided,
  // otherwise generate a random one so no guessable admin account exists.
  const password = SYSTEM_PASS || crypto.randomBytes(24).toString('hex');
  if (!SYSTEM_PASS) {
    console.warn('[2B Tex] SYSTEM_PASS not set. Seeded admin with a random password; set SYSTEM_PASS or create a user to log in.');
  }
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
const BACKUP_RETENTION_DAYS = Number(process.env.BACKUP_RETENTION_DAYS || 6);
let lastBackupCleanup = { deleted: 0, deletedFiles: [], retentionDays: BACKUP_RETENTION_DAYS, ranAt: null };
const OPERATION_STAGE_DEFINITIONS = [
  { key: 'weaving', label: 'واقف في النسيج', description: 'طلب لم يكتمل خروج الخام من النسيج إلى المصبغة.' },
  { key: 'color-planning', label: 'بانتظار توزيع الألوان', description: 'طلب يحتاج خطة ألوان واضحة قبل التشغيل.' },
  { key: 'dyehouse', label: 'واقف في المصبغة', description: 'خام مرسل للمصبغة ولم يكتمل استلام المجهز.' },
  { key: 'warehouse', label: 'واقف في المخزن', description: 'مجهز مستلم ولم يتم تسليمه للعميل بالكامل.' },
  { key: 'delivery', label: 'جاهز للتسليم', description: 'يوجد رصيد جاهز يحتاج تسليم ومتابعة.' },
  { key: 'completed', label: 'مكتمل فعليًا', description: 'لا يوجد رصيد تشغيل مفتوح ظاهر.' },
  { key: 'closed', label: 'مغلق تشغيليًا', description: 'تم إغلاق دورة الطلب يدويًا.' },
];

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
    gluing_batches: 'دمج خامات',
    dyehouse_transfers: 'تحويل مصبغة',
    report_outbox: 'إرسال تقرير',
    system_settings: 'إعدادات النظام',
    audit_log: 'سجل التعديلات',
    users: 'مستخدم',
  }[entityType] || entityType || 'بيان';
}

function auditActionLabel(action) {
  if (action === 'login') return 'تسجيل دخول';
  if (action === 'logout') return 'تسجيل خروج';
  return { create:'إضافة', update:'تعديل', delete:'حذف' }[action] || action || 'حركة';
}

function auditRowValue(row, keys) {
  for (const key of keys) {
    const value = row?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return '';
}

const AUDIT_FIELD_LABELS = {
  name: 'الاسم',
  username: 'اسم الدخول',
  role: 'الصلاحية',
  is_active: 'الحالة',
  customer_id: 'العميل',
  pricing_id: 'التسعيرة',
  order_number: 'رقم الطلب',
  pricing_number: 'رقم التسعيرة',
  order_date: 'تاريخ الطلب',
  pricing_date: 'تاريخ التسعيرة',
  fabric_type: 'الصنف',
  material_type: 'الخامة',
  dyehouse: 'المصبغة',
  color_class: 'درجة اللون',
  color: 'اللون',
  pantone_code: 'كود اللون',
  total_raw_quantity: 'إجمالي الخام',
  planned_quantity: 'كمية اللون',
  quantity: 'الكمية',
  inch_width: 'البوصة',
  raw_width: 'العرض',
  finished_width: 'العرض',
  finished_weight: 'الوزن',
  raw_cost: 'سعر الخام',
  kilo_price: 'سعر الكيلو',
  unit_price: 'سعر الوحدة',
  total_price: 'الإجمالي',
  payment_terms: 'السداد',
  accessory_type: 'نوع الإكسسوار',
  accessory_percent: 'نسبة الإكسسوار',
  accessory_lines_json: 'الإكسسوارات',
  weaving_source: 'مصدر النسيج',
  notes: 'الملاحظات',
  operation_notes_json: 'ملاحظات التشغيل',
  status: 'الحالة',
  is_closed: 'إغلاق الطلب',
  batch_date: 'تاريخ الحركة',
  supplier: 'المورد',
  note_number: 'رقم الإذن',
  source_document_json: 'بيانات المستند',
  from_dyehouse: 'من مصبغة',
  to_dyehouse: 'إلى مصبغة',
  reason: 'السبب',
  partner_fabric: 'الخامة الثانية',
  output_name: 'اسم المنتج الناتج',
  customer_name: 'العميل',
  movement: 'نوع الحركة',
  value_json: 'الإعداد',
};

function auditChangedFields(beforeValue = null, afterValue = null) {
  if (!beforeValue || !afterValue) return [];
  const skip = new Set(['id', 'created_at', 'updated_at', 'password_hash']);
  const keys = Array.from(new Set([...Object.keys(beforeValue || {}), ...Object.keys(afterValue || {})]));
  return keys
    .filter((key) => !skip.has(key))
    .filter((key) => JSON.stringify(beforeValue?.[key] ?? null) !== JSON.stringify(afterValue?.[key] ?? null))
    .map((key) => AUDIT_FIELD_LABELS[key] || key)
    .slice(0, 8);
}

function currentAuditActor() {
  return requestContext.getStore()?.user || null;
}

function auditActorLabel(actor) {
  const name = String(actor?.name || actor?.username || '').trim();
  const username = String(actor?.username || '').trim();
  if (!name && !username) return '';
  if (name && username && name !== username) return `${name} (${username})`;
  return name || username;
}

function describeAudit(action, entityType, entityId, beforeValue = null, afterValue = null, note = '', actor = null) {
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
  const changedFields = action === 'update' ? auditChangedFields(beforeValue, afterValue) : [];
  if (changedFields.length) parts.push(`تغير: ${changedFields.join('، ')}`);
  const actorLabel = auditActorLabel(actor);
  if (actorLabel) parts.push(`بواسطة ${actorLabel}`);
  const cleanNote = String(note || '').trim();
  if (cleanNote && !/^POST |^PUT |^DELETE |^upsert via POST /.test(cleanNote)) parts.push(cleanNote);
  return parts.join(' - ');
}

async function auditMutation(action, entityType, entityId, beforeValue = null, afterValue = null, note = '') {
  try {
    const readableNote = describeAudit(action, entityType, entityId, beforeValue, afterValue, note, currentAuditActor());
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
  app.post(`/api/${base}`, requireRole('manager'), asyncHandler(async (req, res) => {
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
  app.put(`/api/${base}/:id`, requireRole('manager'), asyncHandler(async (req, res) => {
    const before = await get(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
    const query = updateSql(table, req.body || {}, req.params.id);
    await run(query.sql, query.values);
    const after = await get(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
    await auditMutation('update', table, req.params.id, before, after, `PUT /api/${base}/${req.params.id}`);
    res.json(after);
  }));
  app.delete(`/api/${base}/:id`, requireRole('admin'), asyncHandler(async (req, res) => {
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

function deleteOrderGraphTx(tx, orderId) {
  const order = tx.get('SELECT id, order_number FROM orders WHERE id = ?', [orderId]);
  if (!order) return 0;
  tx.run('DELETE FROM report_outbox WHERE order_id = ? OR order_number = ?', [order.id, order.order_number || '']);
  tx.run('DELETE FROM dyehouse_transfers WHERE order_id = ?', [order.id]);
  tx.run('DELETE FROM raw_returns WHERE order_id = ?', [order.id]);
  tx.run('DELETE FROM gluing_batches WHERE order_id = ?', [order.id]);
  tx.run('DELETE FROM accessory_batches WHERE order_id = ?', [order.id]);
  tx.run('DELETE FROM customer_delivery_batches WHERE order_id = ?', [order.id]);
  tx.run('DELETE FROM finished_receiving_batches WHERE order_id = ?', [order.id]);
  tx.run('DELETE FROM dyehouse_delivery_batches WHERE order_id = ?', [order.id]);
  tx.run('DELETE FROM raw_receiving_batches WHERE order_id = ?', [order.id]);
  tx.run('DELETE FROM order_allocations WHERE order_id = ?', [order.id]);
  tx.run('DELETE FROM orders WHERE id = ?', [order.id]);
  return 1;
}

async function deleteOrderGraph(orderId) {
  return transaction((tx) => deleteOrderGraphTx(tx, orderId));
}

async function deleteAllocationGraph(allocationId) {
  return transaction((tx) => {
    const allocation = tx.get('SELECT id FROM order_allocations WHERE id = ?', [allocationId]);
    if (!allocation) return 0;
    tx.run('DELETE FROM dyehouse_transfers WHERE from_allocation_id = ? OR to_allocation_id = ?', [allocation.id, allocation.id]);
    tx.run('DELETE FROM raw_returns WHERE allocation_id = ?', [allocation.id]);
    tx.run('DELETE FROM gluing_batches WHERE allocation_id = ?', [allocation.id]);
    tx.run('DELETE FROM accessory_batches WHERE allocation_id = ?', [allocation.id]);
    tx.run('DELETE FROM customer_delivery_batches WHERE allocation_id = ?', [allocation.id]);
    tx.run('DELETE FROM finished_receiving_batches WHERE allocation_id = ?', [allocation.id]);
    tx.run('DELETE FROM dyehouse_delivery_batches WHERE allocation_id = ?', [allocation.id]);
    tx.run('DELETE FROM raw_receiving_batches WHERE allocation_id = ?', [allocation.id]);
    tx.run('DELETE FROM order_allocations WHERE id = ?', [allocation.id]);
    return 1;
  });
}

async function deleteCustomerGraph(customerId) {
  const customer = await get('SELECT * FROM customers WHERE id = ?', [customerId]);
  if (!customer) return { deletedCustomer: 0, deletedOrders: 0, deletedPricings: 0, deletedCustomerBatches: 0, deletedOutbox: 0 };
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const safeName = String(customer.name || customer.id || 'customer').replace(/[^\u0600-\u06FF\w-]+/g, '-').slice(0, 80) || 'customer';
  const backupPath = path.join(BACKUP_DIR, `before-full-customer-delete-${safeName}-${stamp}.sqlite`);
  if (fs.existsSync(DB_PATH)) fs.copyFileSync(DB_PATH, backupPath);
  return transaction((tx) => {
    const orderRows = tx.all('SELECT id FROM orders WHERE customer_id = ?', [customer.id]);
    let deletedOrders = 0;
    for (const row of orderRows) deletedOrders += deleteOrderGraphTx(tx, row.id);
    const pricingResult = tx.run('DELETE FROM pricings WHERE customer_id = ?', [customer.id]);
    const customerBatchResult = tx.run('DELETE FROM customer_delivery_batches WHERE customer_name = ?', [customer.name || '']);
    const outboxResult = tx.run('DELETE FROM report_outbox WHERE customer_name = ?', [customer.name || '']);
    const customerResult = tx.run('DELETE FROM customers WHERE id = ?', [customer.id]);
    return {
      deletedCustomer: customerResult.changes || 0,
      deletedOrders,
      deletedPricings: pricingResult.changes || 0,
      deletedCustomerBatches: customerBatchResult.changes || 0,
      deletedOutbox: outboxResult.changes || 0,
      backup: path.basename(backupPath),
    };
  });
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

function sqliteBackupFiles() {
  return fs.readdirSync(BACKUP_DIR)
    .filter((name) => name.endsWith('.sqlite'))
    .map((name) => {
      const filePath = path.join(BACKUP_DIR, name);
      const stat = fs.statSync(filePath);
      return { name, path: filePath, size: stat.size, createdAt: stat.birthtime.toISOString(), updatedAt: stat.mtime.toISOString() };
    })
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

async function cleanupOldBackups() {
  const cutoff = Date.now() - Math.max(1, BACKUP_RETENTION_DAYS) * 24 * 60 * 60 * 1000;
  const backupRoot = path.resolve(BACKUP_DIR);
  const deletedFiles = [];
  for (const file of sqliteBackupFiles()) {
    const resolved = path.resolve(file.path);
    if (!resolved.startsWith(backupRoot + path.sep)) continue;
    const fileTime = new Date(file.updatedAt || file.createdAt || 0).getTime();
    if (!Number.isFinite(fileTime) || fileTime >= cutoff) continue;
    fs.unlinkSync(resolved);
    deletedFiles.push(file.name);
  }
  lastBackupCleanup = { deleted: deletedFiles.length, deletedFiles, retentionDays: BACKUP_RETENTION_DAYS, ranAt: now() };
  if (deletedFiles.length) {
    await auditMutation('delete', 'system_settings', 'backup-retention', { files: deletedFiles }, { deleted: deletedFiles.length, retentionDays: BACKUP_RETENTION_DAYS }, `حذف نسخ احتياطية أقدم من ${BACKUP_RETENTION_DAYS} أيام`);
  }
  return lastBackupCleanup;
}

async function createDatabaseBackup(reason = 'manual') {
  await cleanupOldBackups();
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const target = path.join(BACKUP_DIR, `2btex-${reason}-${stamp}.sqlite`);
  if (!fs.existsSync(DB_PATH)) return { ok: false, error: 'DB_NOT_FOUND', file: target };
  fs.copyFileSync(DB_PATH, target);
  const stat = fs.statSync(target);
  await auditMutation('create', 'system_settings', 'backup', null, { file: target, size: stat.size, reason, created_at: now() }, 'إنشاء نسخة احتياطية');
  return { ok: true, file: target, name: path.basename(target), size: stat.size, createdAt: stat.birthtime.toISOString() };
}

async function ensureDailyBackup() {
  await cleanupOldBackups();
  if (!fs.existsSync(DB_PATH)) return null;
  const today = new Date().toISOString().slice(0, 10);
  const exists = sqliteBackupFiles().some((file) => file.name.includes(`auto-${today}`) || file.updatedAt.startsWith(today));
  if (exists) return null;
  return createDatabaseBackup(`auto-${today}`);
}

async function tableCount(table) {
  const row = await get(`SELECT COUNT(*) AS count FROM ${table}`);
  return Number(row?.count || 0);
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

app.get('/api/system/check', asyncHandler(async (_req, res) => {
  const schema = schemaHealth();
  const backups = sqliteBackupFiles();
  const tables = {
    customers: await tableCount('customers'),
    pricings: await tableCount('pricings'),
    orders: await tableCount('orders'),
    allocations: await tableCount('order_allocations'),
    rawReceiving: await tableCount('raw_receiving_batches'),
    dyehouseDelivery: await tableCount('dyehouse_delivery_batches'),
    finishedReceiving: await tableCount('finished_receiving_batches'),
    customerDelivery: await tableCount('customer_delivery_batches'),
    accessories: await tableCount('accessory_batches'),
    rawReturns: await tableCount('raw_returns'),
    gluing: await tableCount('gluing_batches'),
    transfers: await tableCount('dyehouse_transfers'),
    auditLog: await tableCount('audit_log'),
  };
  const dashboard = await (async () => {
    const ordersRows = await all('SELECT * FROM orders');
    const summaries = [];
    for (const order of ordersRows) summaries.push(await orderSummary(order.id));
    return {
      ordersCount: ordersRows.length,
      totalRequestedQuantity: summaries.reduce((t, s) => t + s.totalRequestedQuantity, 0),
      totalRawReceived: summaries.reduce((t, s) => t + s.totalRawReceived, 0),
      totalSentToDyehouse: summaries.reduce((t, s) => t + s.totalSentToDyehouse, 0),
      totalGluingBalance: summaries.reduce((t, s) => t + Number(s.gluingBalance || 0), 0),
      totalGluedProductBalance: summaries.reduce((t, s) => t + Number(s.gluedProductBalance || 0), 0),
      totalFinishedReceived: summaries.reduce((t, s) => t + s.totalFinishedReceived, 0),
      warehouseBalance: summaries.reduce((t, s) => t + s.warehouseBalance, 0),
      wasteQuantity: summaries.reduce((t, s) => t + s.wasteQuantity, 0),
    };
  })();
  const dbExists = fs.existsSync(DB_PATH);
  const dbStat = dbExists ? fs.statSync(DB_PATH) : null;
  const checks = [
    { key: 'database', label: 'قاعدة البيانات', ok: dbExists, detail: dbExists ? `${Math.round(dbStat.size / 1024 / 1024 * 100) / 100} MB` : 'غير موجودة' },
    { key: 'schema', label: 'هيكل قاعدة البيانات', ok: schema.ok, detail: schema.ok ? 'مكتمل' : `${schema.missing.length} أعمدة ناقصة` },
    { key: 'orders', label: 'بيانات الطلبات', ok: tables.orders > 0, detail: `${tables.orders} طلب` },
    { key: 'movements', label: 'حركات التشغيل', ok: (tables.rawReceiving + tables.dyehouseDelivery + tables.finishedReceiving + tables.customerDelivery) > 0, detail: `${tables.rawReceiving + tables.dyehouseDelivery + tables.finishedReceiving + tables.customerDelivery} حركة` },
    { key: 'backup', label: 'النسخ الاحتياطي', ok: backups.length > 0, detail: backups[0]?.name || 'لا توجد نسخ' },
    { key: 'ai', label: 'Gemini AI', ok: Boolean(process.env.GEMINI_API_KEY), detail: process.env.GEMINI_API_KEY ? (process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite') : 'غير مضبوط' },
    { key: 'audit', label: 'سجل التعديلات', ok: tables.auditLog > 0, detail: `${tables.auditLog} حركة مسجلة` },
  ];
  res.json({
    ok: checks.every((check) => check.ok),
    generatedAt: now(),
    checks,
    tables,
    dashboard,
    orderStages: OPERATION_STAGE_DEFINITIONS,
    storage: {
      database: DB_PATH,
      databaseSize: dbStat?.size || 0,
      backupsDir: BACKUP_DIR,
      latestBackup: backups[0] || null,
      backupsCount: backups.length,
      retentionDays: BACKUP_RETENTION_DAYS,
      lastCleanup: lastBackupCleanup,
    },
  });
}));

const createAiEmployee = require('./aiEmployee');
const {
  compactAiPayload,
  aiFallbackAnalysis,
  runOpenAiAnalysis,
  runGeminiAnalysis,
  buildAiEmployeeContext,
  buildAiQuestionFocus,
  buildFocusedEmployeeReport,
  buildOperationalDashboardReport,
  runAiEmployeeModelReport,
  buildEnhancedOperationalCommandReport,
} = createAiEmployee({
  repairMissingCustomersFromReferences,
  readableCustomerNameFromId,
});

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
  const userRequest = String(req.body?.question || 'حلل حالة تشغيل 2B الآن كموظف ذكاء اصطناعي مسؤول عن المتابعة اليومية.').trim();
  const commandReport = buildEnhancedOperationalCommandReport(context, userRequest);
  if (commandReport) return res.json(commandReport);
  const questionFocus = buildAiQuestionFocus(userRequest, context.orders || context.priorityOrders || []);
  const data = {
    ...context,
    userRequest,
    questionFocus: {
      active: questionFocus.active,
      keywords: questionFocus.keywords,
      intent: questionFocus.intent,
      matchesCount: questionFocus.matches.length,
      orders: questionFocus.matches.slice(0, 120),
    },
    focusInstruction: questionFocus.active
      ? (questionFocus.matches.length
        ? 'سؤال المستخدم محدد. اجعل الإجابة عن questionFocus.orders فقط، ولا تبدأ بتقرير عام إلا لو طلب المستخدم ذلك صراحة.'
        : 'سؤال المستخدم محدد لكن لا توجد أوامر مطابقة في قاعدة البيانات. قل ذلك بوضوح ولا تعرض تقريرًا عامًا بدل الإجابة.')
      : 'سؤال المستخدم عام، اعرض ملخص التشغيل والأولويات.',
  };
  const rulesBaseline = questionFocus.active ? buildFocusedEmployeeReport(data) : buildOperationalDashboardReport(data);
  return res.json({ ...(await runAiEmployeeModelReport(data, rulesBaseline)), userRequest: data.userRequest });
}));

app.post('/api/backup', requireRole('admin'), asyncHandler(async (_req, res) => {
  res.json(await createDatabaseBackup('manual'));
}));

app.get('/api/backups', asyncHandler(async (_req, res) => {
  res.json({ retentionDays: BACKUP_RETENTION_DAYS, lastCleanup: lastBackupCleanup, backups: sqliteBackupFiles() });
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

const LOGIN_MAX_ATTEMPTS = Number(process.env.LOGIN_MAX_ATTEMPTS || 8);
const LOGIN_LOCK_MS = Number(process.env.LOGIN_LOCK_MS || 15 * 60 * 1000);
const loginAttempts = new Map();

function loginAttemptKey(req, username) {
  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').toString().split(',')[0].trim();
  return `${ip}|${String(username || '').toLowerCase()}`;
}

function loginLockRemainingMs(key) {
  const entry = loginAttempts.get(key);
  if (!entry) return 0;
  if (Date.now() - entry.first > LOGIN_LOCK_MS) { loginAttempts.delete(key); return 0; }
  if (entry.count < LOGIN_MAX_ATTEMPTS) return 0;
  return LOGIN_LOCK_MS - (Date.now() - entry.first);
}

function recordLoginFailure(key) {
  const entry = loginAttempts.get(key);
  if (!entry || Date.now() - entry.first > LOGIN_LOCK_MS) {
    loginAttempts.set(key, { count: 1, first: Date.now() });
  } else {
    entry.count += 1;
  }
}

app.post('/api/auth/login', asyncHandler(async (req, res) => {
  await ensureDefaultAdminUser();
  const username = String(req.body?.username || '').trim();
  const password = String(req.body?.password || '');
  if (!username || !password) return res.status(400).json({ error: 'اسم الدخول وكلمة المرور مطلوبين' });
  const attemptKey = loginAttemptKey(req, username);
  const lockRemaining = loginLockRemainingMs(attemptKey);
  if (lockRemaining > 0) {
    return res.status(429).json({ error: `تم تجاوز عدد محاولات الدخول. حاول بعد ${Math.ceil(lockRemaining / 60000)} دقيقة.` });
  }
  let row = await get('SELECT * FROM users WHERE username = ?', [username]);
  const matchesStoredPassword = row && verifyPassword(password, row.password_hash);
  const matchesSystemFallback = Boolean(SYSTEM_PASS) && username === SYSTEM_USER && password === SYSTEM_PASS;
  if (!row && matchesSystemFallback) {
    loginAttempts.delete(attemptKey);
    const user = { id:'system-admin', name:'مدير النظام', username, role:'admin', is_active:1 };
    const token = signSessionPayload({ id:user.id, username:user.username, name:user.name, role:user.role, exp:Date.now() + (8 * 60 * 60 * 1000) });
    res.setHeader('Set-Cookie', sessionCookie(token));
    await auditMutation('login', 'users', user.id, null, user, 'تسجيل دخول ناجح');
    return res.json({ ok: true, user });
  }
  if (!row || Number(row.is_active) !== 1 || (!matchesStoredPassword && !matchesSystemFallback)) {
    recordLoginFailure(attemptKey);
    return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
  }
  loginAttempts.delete(attemptKey);
  const user = publicUser(row);
  const token = signSessionPayload({ id:user.id, username:user.username, name:user.name, role:user.role, exp:Date.now() + (8 * 60 * 60 * 1000) });
  res.setHeader('Set-Cookie', sessionCookie(token));
  await auditMutation('login', 'users', user.id, null, user, 'تسجيل دخول ناجح');
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

app.post('/api/auth/logout', asyncHandler(async (req, res) => {
  const user = await requestUser(req);
  if (user) await auditMutation('logout', 'users', user.id, user, null, 'تسجيل خروج');
  res.setHeader('Set-Cookie', clearSessionCookie());
  res.json({ ok: true });
}));

app.get('/api/users', requireRole('admin'), asyncHandler(async (_req, res) => {
  await ensureDefaultAdminUser();
  const rows = await all('SELECT * FROM users ORDER BY created_at DESC');
  res.json(rows.map(publicUser));
}));

app.post('/api/users', requireRole('admin'), asyncHandler(async (req, res) => {
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
    role: ['admin','manager','user','accountant','viewer'].includes(body.role) ? body.role : 'user',
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

app.put('/api/users/:id', requireRole('admin'), asyncHandler(async (req, res) => {
  await ensureDefaultAdminUser();
  const before = await get('SELECT * FROM users WHERE id = ?', [req.params.id]);
  if (!before) return res.status(404).json({ error: 'المستخدم غير موجود' });
  const body = req.body || {};
  const fields = {
    name: body.name !== undefined ? String(body.name || '').trim() : before.name,
    username: body.username !== undefined ? String(body.username || '').trim() : before.username,
    role: ['admin','manager','user','accountant','viewer'].includes(body.role) ? body.role : before.role,
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

app.delete('/api/users/:id', requireRole('admin'), asyncHandler(async (req, res) => {
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

app.delete('/api/customers/:id/full', requireRole('admin'), asyncHandler(async (req, res) => {
  const before = await get('SELECT * FROM customers WHERE id = ?', [req.params.id]);
  const deleted = await deleteCustomerGraph(req.params.id);
  await auditMutation('delete', 'customers', req.params.id, before, { deleted }, 'حذف كامل للعميل');
  res.json({ ok: true, deleted });
}));

crudRoutes('customers', 'customers');
crudRoutes('pricings', 'pricings');
crudRoutes('orders', 'orders');

app.post('/api/orders/bulk', requireRole('manager'), asyncHandler(async (req, res) => {
  const items = Array.isArray(req.body?.orders) ? req.body.orders : [];
  if (!items.length) return res.status(400).json({ error: 'orders array is required' });
  const seen = new Set();
  for (const item of items) {
    const key = [item.order_number || '', item.customer_id || '', String(item.fabric_type || '').trim()].join('|');
    if (seen.has(key)) return res.status(409).json({ error: `Duplicate order item: ${item.order_number || '-'} / ${item.fabric_type || '-'}` });
    seen.add(key);
    const existing = await existingUniqueBusinessRow('orders', item);
    if (existing) return res.status(409).json({ error: `Duplicate order item: ${item.order_number || '-'} / ${item.fabric_type || '-'}` });
  }
  const saved = await transaction(async (tx) => {
    const output = [];
    for (const item of items) {
      const query = insertSql('orders', item || {});
      tx.run(query.sql, query.values);
      const row = await tx.get('SELECT * FROM orders WHERE id = ?', [query.id]);
      output.push(row);
    }
    return output;
  });
  for (const row of saved) await auditMutation('create', 'orders', row.id, null, row, 'POST /api/orders/bulk');
  res.status(201).json(saved);
}));

app.get('/api/orders/:id', asyncHandler(async (req, res) => {
  const order = await get('SELECT * FROM orders WHERE id = ?', [req.params.id]);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
}));

app.get('/api/orders/:orderId/allocations', asyncHandler(async (req, res) => {
  res.json(await all('SELECT * FROM order_allocations WHERE order_id = ? ORDER BY created_at', [req.params.orderId]));
}));

app.post('/api/orders/:orderId/allocations', requireRole('manager'), asyncHandler(async (req, res) => {
  const query = insertSql('order_allocations', { ...req.body, order_id: req.params.orderId });
  await run(query.sql, query.values);
  const after = await get('SELECT * FROM order_allocations WHERE id = ?', [query.id]);
  await auditMutation('create', 'order_allocations', query.id, null, after, `POST /api/orders/${req.params.orderId}/allocations`);
  res.status(201).json(after);
}));

app.put('/api/allocations/:id', requireRole('manager'), asyncHandler(async (req, res) => {
  const before = await get('SELECT * FROM order_allocations WHERE id = ?', [req.params.id]);
  const query = updateSql('order_allocations', req.body || {}, req.params.id);
  await run(query.sql, query.values);
  const after = await get('SELECT * FROM order_allocations WHERE id = ?', [req.params.id]);
  await auditMutation('update', 'order_allocations', req.params.id, before, after, `PUT /api/allocations/${req.params.id}`);
  res.json(after);
}));

app.delete('/api/allocations/:id', requireRole('admin'), asyncHandler(async (req, res) => {
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
  gluing: 'gluing_batches',
  glue: 'gluing_batches',
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
  result.gluing = await all('SELECT * FROM gluing_batches WHERE order_id = ? ORDER BY created_at', [orderId]);
  result.transfers = await all('SELECT * FROM dyehouse_transfers WHERE order_id = ? ORDER BY created_at', [orderId]);
  res.json(result);
}));

app.post('/api/batches/:type', requireRole('manager'), asyncHandler(async (req, res) => {
  if (req.params.type === 'bulk') return saveBulkBatches(req, res);
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
    gluingBatches: await all('SELECT * FROM gluing_batches ORDER BY created_at'),
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

app.put('/api/settings/:key', requireRole('manager'), asyncHandler(async (req, res) => {
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
  app.post(route, requireRole('manager'), asyncHandler(async (req, res) => {
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

function normalizeBulkBatchItem(item = {}) {
  const table = batchTables[item.type];
  if (!table) throw new Error(`Unknown batch type: ${item.type || ''}`);
  const body = tableData(table, item.data || {});
  if (!body.id) body.id = id();
  if (!body.order_id) throw new Error('order_id is required');
  if (!body.batch_date) body.batch_date = now().slice(0, 10);
  body.quantity = Number(body.quantity || 0);
  if (!Number.isFinite(body.quantity) || body.quantity === 0) throw new Error('quantity is required');
  return { type: item.type, table, body };
}

async function saveBulkBatches(req, res) {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  if (!items.length) return res.status(400).json({ error: 'لا توجد حركات للحفظ' });
  const normalized = items.map(normalizeBulkBatchItem);
  const saved = await transaction(async (tx) => {
    const rows = [];
    for (const item of normalized) {
      const query = insertSql(item.table, item.body);
      tx.run(query.sql, query.values);
      rows.push({ type: item.type, table: item.table, row: tx.get(`SELECT * FROM ${item.table} WHERE id = ?`, [query.id]) });
    }
    return rows;
  });
  await auditMutation('create', 'system_settings', 'bulk-batches', null, { count: saved.length, types: saved.map((item) => item.type) }, `حفظ جماعي ${saved.length} حركة تشغيل`);
  res.status(201).json({ ok: true, count: saved.length, items: saved });
}

app.post('/api/batches/bulk', requireRole('manager'), asyncHandler(saveBulkBatches));

app.post('/api/transfers', requireRole('manager'), asyncHandler(async (req, res) => {
  const query = insertSql('dyehouse_transfers', req.body || {});
  await run(query.sql, query.values);
  const after = await get('SELECT * FROM dyehouse_transfers WHERE id = ?', [query.id]);
  await auditMutation('create', 'dyehouse_transfers', query.id, null, after, 'POST /api/transfers');
  res.status(201).json(after);
}));

app.put('/api/transfers/:id', requireRole('manager'), asyncHandler(async (req, res) => {
  const before = await get('SELECT * FROM dyehouse_transfers WHERE id = ?', [req.params.id]);
  const query = updateSql('dyehouse_transfers', req.body || {}, req.params.id);
  await run(query.sql, query.values);
  const after = await get('SELECT * FROM dyehouse_transfers WHERE id = ?', [req.params.id]);
  await auditMutation('update', 'dyehouse_transfers', req.params.id, before, after, `PUT /api/transfers/${req.params.id}`);
  res.json(after);
}));

app.delete('/api/transfers/:id', requireRole('admin'), asyncHandler(async (req, res) => {
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
    pricing_items_json: typeof row.pricing_items_json === 'string' ? row.pricing_items_json : JSON.stringify(row.priceItems || row.pricingItems || []),
    payment_terms: firstValue(row, ['paymentTerms', 'payment_terms']),
    notes: firstValue(row, ['notes']),
    status: firstValue(row, ['status'], row.convertedOrderId ? 'converted' : 'active'),
    created_at: firstValue(row, ['createdAt', 'created_at'], now()),
    updated_at: firstValue(row, ['updatedAt', 'updated_at'], now())
  };
}

// Sync browser LocalStorage payload into SQLite through safe field mapping.
app.post('/api/import-local', requireRole('admin'), asyncHandler(async (req, res) => {
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
      customer_name: firstValue(row, ['customerName', 'customer_name']),
      unit_price: numValue(row, ['unitPrice', 'unit_price']),
      total_price: numValue(row, ['totalPrice', 'total_price']),
      payment_terms: firstValue(row, ['paymentTerms', 'payment_terms']),
      note_number: firstValue(row, ['noteNumber', 'note_number']),
      movement: firstValue(row, ['movement'], 'delivery'),
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

app.delete('/api/batches/:type/:id', requireRole('admin'), asyncHandler(async (req, res) => {
  const table = batchTables[req.params.type];
  if (!table) return res.status(400).json({ error: 'Unknown batch type' });
  const before = await get(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
  await run(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
  await auditMutation('delete', table, req.params.id, before, { deleted: 1 }, `DELETE /api/batches/${req.params.type}/${req.params.id}`);
  res.json({ ok: true });
}));

app.put('/api/batches/:type/:id', requireRole('manager'), asyncHandler(async (req, res) => {
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
    rawReturns: await all('SELECT * FROM raw_returns WHERE order_id = ?', [orderId]),
    gluingBatches: await all('SELECT * FROM gluing_batches')
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
    totalGluingBalance: summaries.reduce((t, s) => t + Number(s.gluingBalance || 0), 0),
    totalGluedProductBalance: summaries.reduce((t, s) => t + Number(s.gluedProductBalance || 0), 0),
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

app.post('/api/import/localstorage', requireRole('admin'), (_req, res) => {
  res.status(202).json({ ok: true, message: 'Import is prepared but not automatic. Use backend/tools/import-localstorage.js.' });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: error.message || 'Internal server error' });
});

initDb().then(async () => {
  await ensureDefaultAdminUser();
  await ensureDailyBackup();
  app.listen(PORT, HOST, () => {
    console.log(`2B Tex Backend: http://localhost:${PORT}/api/health`);
  });
}).catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

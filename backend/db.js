const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, '2btex.sqlite');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

fs.mkdirSync(DATA_DIR, { recursive: true });

let db = null;

const REQUIRED_COLUMNS = {
  orders: [
    'product_code',
    'width_mode',
    'width_lines_json',
    'raw_cost',
    'accessory_type',
    'accessory_percent',
    'accessory_lines_json',
    'operation_notes_json',
  ],
  order_allocations: [
    'width_line_id',
    'raw_inch',
    'raw_width',
    'accessory_quantity_manual',
  ],
  dyehouse_delivery_batches: ['width_line_id'],
  finished_receiving_batches: ['note_number'],
  accessory_batches: ['batch_date', 'note_number', 'movement'],
  raw_returns: ['note_number'],
  dyehouse_transfers: ['note_number'],
};

async function initDb() {
  if (db) return db;
  const SQL = await initSqlJs();
  db = fs.existsSync(DB_PATH)
    ? new SQL.Database(fs.readFileSync(DB_PATH))
    : new SQL.Database();
  db.run('PRAGMA foreign_keys = ON;');
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  db.run(schema);
  runMigrations();
  persist();
  return db;
}

function tableColumns(table) {
  const stmt = db.prepare(`PRAGMA table_info(${table})`);
  const columns = [];
  while (stmt.step()) columns.push(stmt.getAsObject().name);
  stmt.free();
  return new Set(columns);
}

function addColumnIfMissing(table, definition) {
  const column = String(definition).trim().split(/\s+/)[0];
  if (tableColumns(table).has(column)) return;
  db.run(`ALTER TABLE ${table} ADD COLUMN ${definition}`);
}

function schemaHealth() {
  if (!db) return { ok: false, missing: [] };
  const missing = [];
  for (const [table, columns] of Object.entries(REQUIRED_COLUMNS)) {
    const existing = tableColumns(table);
    for (const column of columns) {
      if (!existing.has(column)) missing.push({ table, column });
    }
  }
  return { ok: missing.length === 0, missing };
}

function assertSchemaReady() {
  const health = schemaHealth();
  if (!health.ok) {
    const list = health.missing.map((item) => `${item.table}.${item.column}`).join(', ');
    throw new Error(`Database schema migration is incomplete. Missing columns: ${list}`);
  }
}

function runMigrations() {
  [
    'product_code TEXT',
    "width_mode TEXT DEFAULT 'single'",
    'width_lines_json TEXT',
    'raw_cost REAL DEFAULT 0',
    'accessory_type TEXT',
    'accessory_percent REAL DEFAULT 0',
    'accessory_lines_json TEXT',
    'operation_notes_json TEXT',
  ].forEach((definition) => addColumnIfMissing('orders', definition));
  [
    'width_line_id TEXT',
    'raw_inch REAL DEFAULT 0',
    'raw_width REAL DEFAULT 0',
    'accessory_quantity_manual REAL',
  ].forEach((definition) => addColumnIfMissing('order_allocations', definition));
  addColumnIfMissing('dyehouse_delivery_batches', 'width_line_id TEXT');
  addColumnIfMissing('finished_receiving_batches', 'note_number TEXT');
  [
    'batch_date TEXT',
    'note_number TEXT',
    'movement TEXT',
  ].forEach((definition) => addColumnIfMissing('accessory_batches', definition));
  addColumnIfMissing('raw_returns', 'note_number TEXT');
  addColumnIfMissing('dyehouse_transfers', 'note_number TEXT');
  dropUnsafeUniqueIndexes();
  backfillAccessoryBatchFields();
  assertSchemaReady();
}

function rows(sql, params = []) {
  const stmt = db.prepare(sql, params);
  const result = [];
  while (stmt.step()) result.push(stmt.getAsObject());
  stmt.free();
  return result;
}

function scalar(sql, params = []) {
  return rows(sql, params)[0] || null;
}

function dropUnsafeUniqueIndexes() {
  db.run('DROP INDEX IF EXISTS idx_orders_number_customer_unique');
  db.run('DROP INDEX IF EXISTS idx_pricings_number_customer_unique');
  db.run('DROP INDEX IF EXISTS idx_orders_number_customer_fabric_unique');
  db.run("CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_number_customer_fabric_unique ON orders(order_number, customer_id, TRIM(fabric_type)) WHERE order_number IS NOT NULL AND TRIM(order_number) <> '' AND customer_id IS NOT NULL AND TRIM(customer_id) <> '' AND fabric_type IS NOT NULL AND TRIM(fabric_type) <> ''");
}

function notePart(text, label) {
  const pattern = new RegExp(`${label}\\s*:\\s*([^|]+)`);
  const match = String(text || '').match(pattern);
  return match ? match[1].trim() : '';
}

function backfillAccessoryBatchFields() {
  const stmt = db.prepare('SELECT id, notes, batch_date, note_number, movement FROM accessory_batches');
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  for (const row of rows) {
    const notes = String(row.notes || '');
    const batchDate = row.batch_date || notePart(notes, '\\u0627\\u0644\\u062a\\u0627\\u0631\\u064a\\u062e');
    const noteNumber = row.note_number || notePart(notes, '\\u0631\\u0642\\u0645 \\u0627\\u0644\\u0625\\u0630\\u0646');
    const movement = row.movement || notePart(notes, '\\u0627\\u0644\\u062d\\u0631\\u0643\\u0629') || 'sent';
    if (batchDate !== row.batch_date || noteNumber !== row.note_number || movement !== row.movement) {
      db.run(
        'UPDATE accessory_batches SET batch_date = ?, note_number = ?, movement = ? WHERE id = ?',
        [batchDate || null, noteNumber || null, movement || 'sent', row.id]
      );
    }
  }
}

function persist() {
  if (!db) return;
  fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
}

async function exec(sql) {
  await initDb();
  db.run(sql);
  persist();
  return {};
}

async function run(sql, params = []) {
  await initDb();
  db.run(sql, params);
  persist();
  return { changes: db.getRowsModified() };
}

async function all(sql, params = []) {
  await initDb();
  const stmt = db.prepare(sql, params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

async function get(sql, params = []) {
  const rows = await all(sql, params);
  return rows[0] || null;
}

module.exports = { get db() { return db; }, DB_PATH, initDb, exec, run, get, all, schemaHealth };

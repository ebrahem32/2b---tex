const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, '2btex.sqlite');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

fs.mkdirSync(DATA_DIR, { recursive: true });

let db = null;

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

function addColumnIfMissing(table, definition) {
  try {
    db.run(`ALTER TABLE ${table} ADD COLUMN ${definition}`);
  } catch (error) {
    if (!String(error?.message || error).includes('duplicate column name')) throw error;
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
  ].forEach((definition) => addColumnIfMissing('orders', definition));
  [
    'width_line_id TEXT',
    'raw_inch REAL DEFAULT 0',
    'raw_width REAL DEFAULT 0',
    'accessory_quantity_manual REAL',
  ].forEach((definition) => addColumnIfMissing('order_allocations', definition));
  addColumnIfMissing('dyehouse_delivery_batches', 'width_line_id TEXT');
  addColumnIfMissing('dyehouse_transfers', 'note_number TEXT');
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

module.exports = { get db() { return db; }, DB_PATH, initDb, exec, run, get, all };

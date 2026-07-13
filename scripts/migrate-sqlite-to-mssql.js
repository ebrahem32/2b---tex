const fs = require('fs');
const path = require('path');
const sql = require('mssql');
const initSqlJs = require('../backend/node_modules/sql.js');

const ROOT_DIR = path.join(__dirname, '..');
const DEFAULT_SQLITE_PATH = path.join(ROOT_DIR, 'server-data', '2btex.sqlite');
const SCHEMA_PATH = path.join(ROOT_DIR, 'backend', 'schema.mssql.sql');

const TABLES = [
  'customers',
  'pricings',
  'orders',
  'order_allocations',
  'raw_receiving_batches',
  'dyehouse_delivery_batches',
  'finished_receiving_batches',
  'customer_delivery_batches',
  'accessory_batches',
  'raw_returns',
  'gluing_batches',
  'dyehouse_transfers',
  'report_outbox',
  'whatsapp_settings',
  'system_settings',
  'audit_log',
  'users',
];

function boolEnv(name, fallback = false) {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return ['1', 'true', 'yes', 'y'].includes(String(value).toLowerCase());
}

function connectionConfig(databaseOverride) {
  if (process.env.MSSQL_CONNECTION_STRING && !databaseOverride) {
    return process.env.MSSQL_CONNECTION_STRING;
  }
  const server = process.env.MSSQL_SERVER || process.env.SQLSERVER_HOST || 'localhost';
  const port = Number(process.env.MSSQL_PORT || process.env.SQLSERVER_PORT || 1433);
  const database = databaseOverride || process.env.MSSQL_DATABASE || process.env.SQLSERVER_DATABASE || '2BTex';
  const user = process.env.MSSQL_USER || process.env.SQLSERVER_USER || '';
  const password = process.env.MSSQL_PASSWORD || process.env.SQLSERVER_PASSWORD || '';
  const config = {
    server,
    port,
    database,
    options: {
      encrypt: boolEnv('MSSQL_ENCRYPT', false),
      trustServerCertificate: boolEnv('MSSQL_TRUST_CERT', true),
    },
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
    requestTimeout: Number(process.env.MSSQL_REQUEST_TIMEOUT || 30000),
  };
  if (user || password) {
    config.user = user;
    config.password = password;
  }
  if (server.includes('\\')) delete config.port;
  return config;
}

function quoteName(name) {
  return `[${String(name).replace(/]/g, ']]')}]`;
}

function splitBatches(sqlText) {
  return String(sqlText || '')
    .split(/^\s*GO\s*$/gim)
    .map((part) => part.trim())
    .filter(Boolean);
}

async function ensureDatabase() {
  if (!boolEnv('MSSQL_CREATE_DATABASE', false)) return;
  const database = process.env.MSSQL_DATABASE || process.env.SQLSERVER_DATABASE || '2BTex';
  const master = await sql.connect(connectionConfig('master'));
  try {
    const request = master.request();
    request.input('databaseName', database);
    const exists = await request.query('SELECT DB_ID(@databaseName) AS id');
    if (!exists.recordset[0].id) {
      const safeDatabase = quoteName(database);
      await master.request().query(`CREATE DATABASE ${safeDatabase}`);
      console.log(`Created SQL Server database: ${database}`);
    }
  } finally {
    await master.close();
  }
}

function sqliteRows(db, query, params = []) {
  const stmt = db.prepare(query, params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function sqliteTableExists(db, table) {
  return sqliteRows(db, "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?", [table]).length > 0;
}

async function targetColumns(pool, table) {
  const result = await pool.request()
    .input('table', table)
    .query("SELECT COLUMN_NAME AS name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = @table ORDER BY ORDINAL_POSITION");
  return new Set(result.recordset.map((row) => row.name));
}

async function insertIfMissing(pool, table, row, columns) {
  const pk = table === 'system_settings' ? 'key' : 'id';
  if (row[pk] === undefined || row[pk] === null || row[pk] === '') return 'skipped-no-key';
  const usable = Object.keys(row).filter((column) => columns.has(column));
  if (!usable.includes(pk)) return 'skipped-no-key';

  const exists = await pool.request()
    .input('pk', row[pk])
    .query(`SELECT 1 AS found FROM ${quoteName(table)} WHERE ${quoteName(pk)} = @pk`);
  if (exists.recordset.length) return 'skipped-existing';

  const request = pool.request();
  usable.forEach((column, index) => {
    request.input(`v${index}`, row[column] === undefined ? null : row[column]);
  });
  const columnSql = usable.map(quoteName).join(', ');
  const valueSql = usable.map((_column, index) => `@v${index}`).join(', ');
  await request.query(`INSERT INTO ${quoteName(table)} (${columnSql}) VALUES (${valueSql})`);
  return 'inserted';
}

async function main() {
  const sqlitePath = process.env.SQLITE_SOURCE_PATH || process.env.DB_PATH || DEFAULT_SQLITE_PATH;
  if (!fs.existsSync(sqlitePath)) {
    throw new Error(`SQLite source file was not found: ${sqlitePath}`);
  }

  await ensureDatabase();
  const target = await sql.connect(connectionConfig());
  try {
    for (const batch of splitBatches(fs.readFileSync(SCHEMA_PATH, 'utf8'))) {
      await target.request().batch(batch);
    }

    const SQL = await initSqlJs();
    const sqlite = new SQL.Database(fs.readFileSync(sqlitePath));
    const totals = {};

    for (const table of TABLES) {
      if (!sqliteTableExists(sqlite, table)) {
        totals[table] = { inserted: 0, skippedExisting: 0, skippedNoKey: 0, source: 0 };
        continue;
      }
      const columns = await targetColumns(target, table);
      const rows = sqliteRows(sqlite, `SELECT * FROM ${table}`);
      totals[table] = { inserted: 0, skippedExisting: 0, skippedNoKey: 0, source: rows.length };
      for (const row of rows) {
        const status = await insertIfMissing(target, table, row, columns);
        if (status === 'inserted') totals[table].inserted += 1;
        if (status === 'skipped-existing') totals[table].skippedExisting += 1;
        if (status === 'skipped-no-key') totals[table].skippedNoKey += 1;
      }
    }

    console.table(totals);
    console.log('SQLite to SQL Server migration finished without deleting source data.');
  } finally {
    await target.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

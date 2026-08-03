const fs = require('fs');
const path = require('path');

function requireMssqlDriver() {
  // بالترتيب: المضبوط يدويًا، ثم runtime المضمّن داخل الحزمة (يجعلها محمولة)،
  // ثم مسار ProgramData القديم على السيرفر الحالي، وأخيرًا node_modules العادي.
  const appRoot = path.resolve(__dirname, '..', '..');
  const candidateRoots = [
    process.env.MSSQL_NODE_MODULES,
    process.env.SQLSERVER_NODE_MODULES,
    path.join(appRoot, 'runtime', 'node_modules'),
    'C:\\ProgramData\\2BTex\\node-test\\node_modules',
  ].filter(Boolean);
  for (const root of candidateRoots) {
    const candidate = path.join(root, 'mssql');
    if (fs.existsSync(candidate)) return require(candidate);
  }
  return require('mssql');
}

const sql = requireMssqlDriver();

const DB_PATH = process.env.MSSQL_DATABASE || process.env.SQLSERVER_DATABASE || '2BTex';
const SCHEMA_PATH = path.join(__dirname, 'schema.mssql.sql');

const REQUIRED_COLUMNS = {
  customers: ['customer_code'],
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
  pricings: ['pricing_items_json'],
  order_allocations: [
    'width_line_id',
    'raw_inch',
    'raw_width',
    'accessory_quantity_manual',
  ],
  raw_receiving_batches: ['source_document_json', 'created_by', 'updated_by'],
  dyehouse_delivery_batches: ['width_line_id', 'source_document_json', 'created_by', 'updated_by'],
  finished_receiving_batches: ['note_number', 'source_document_json', 'created_by', 'updated_by'],
  customer_delivery_batches: ['customer_name', 'unit_price', 'total_price', 'payment_terms', 'note_number', 'movement', 'source_document_json', 'created_by', 'updated_by'],
  accessory_batches: ['batch_date', 'note_number', 'movement', 'source_document_json', 'created_by', 'updated_by'],
  raw_returns: ['note_number', 'source_document_json', 'created_by', 'updated_by'],
  gluing_batches: ['movement', 'partner_fabric', 'output_name', 'customer_name', 'note_number', 'source_document_json', 'created_by', 'updated_by'],
  dyehouse_transfers: ['note_number', 'created_by', 'updated_by'],
  users: ['name', 'username', 'password_hash', 'role', 'is_active'],
};

let pool = null;

function boolEnv(name, fallback = false) {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return ['1', 'true', 'yes', 'y'].includes(String(value).toLowerCase());
}

function connectionConfig() {
  if (process.env.MSSQL_CONNECTION_STRING) return process.env.MSSQL_CONNECTION_STRING;
  const server = process.env.MSSQL_SERVER || process.env.SQLSERVER_HOST || 'localhost';
  const port = Number(process.env.MSSQL_PORT || process.env.SQLSERVER_PORT || 1433);
  const database = process.env.MSSQL_DATABASE || process.env.SQLSERVER_DATABASE || '2BTex';
  const user = process.env.MSSQL_USER || process.env.SQLSERVER_USER || '';
  const password = process.env.MSSQL_PASSWORD || process.env.SQLSERVER_PASSWORD || '';
  const trustServerCertificate = boolEnv('MSSQL_TRUST_CERT', true);
  const encrypt = boolEnv('MSSQL_ENCRYPT', false);
  const trustedConnection = boolEnv('MSSQL_TRUSTED_CONNECTION', false);

  const config = {
    server,
    port,
    database,
    options: { encrypt, trustServerCertificate },
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
    requestTimeout: Number(process.env.MSSQL_REQUEST_TIMEOUT || 30000),
  };

  if (trustedConnection) {
    config.options.trustedConnection = true;
  } else {
    config.user = user;
    config.password = password;
  }

  if (server.includes('\\')) delete config.port;
  return config;
}

async function initDb() {
  if (pool) return pool;
  pool = await sql.connect(connectionConfig());
  await execBatches(fs.readFileSync(SCHEMA_PATH, 'utf8'));
  await runMigrations();
  return pool;
}

async function execBatches(sqlText, requestFactory = () => pool.request()) {
  const batches = String(sqlText || '')
    .split(/^\s*GO\s*$/gim)
    .map((part) => part.trim())
    .filter(Boolean);
  for (const batch of batches) {
    await requestFactory().batch(batch);
  }
}

async function tableColumns(table) {
  const rows = await all(
    `SELECT COLUMN_NAME AS name
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = ?
     ORDER BY ORDINAL_POSITION`,
    [table]
  );
  return new Set(rows.map((row) => row.name));
}

function mapColumnDefinition(definition) {
  const text = String(definition || '').trim();
  const [name] = text.split(/\s+/);
  const upper = text.toUpperCase();
  let type = 'NVARCHAR(MAX)';
  if (upper.includes('REAL')) type = 'FLOAT';
  if (upper.includes('INTEGER')) type = 'INT';
  const defaultMatch = text.match(/\bDEFAULT\s+(.+)$/i);
  const defaultSql = defaultMatch ? ` DEFAULT ${mapDefault(defaultMatch[1])}` : '';
  return { name, sql: `[${name}] ${type}${defaultSql}` };
}

function mapDefault(value) {
  const clean = String(value || '').trim();
  if (clean.toUpperCase() === 'CURRENT_TIMESTAMP') return 'SYSUTCDATETIME()';
  return clean.replace(/'/g, "''").replace(/^''(.*)''$/, "'$1'");
}

async function addColumnIfMissing(table, definition) {
  const { name, sql: columnSql } = mapColumnDefinition(definition);
  const existing = await tableColumns(table);
  if (existing.has(name)) return;
  await run(`ALTER TABLE [${table}] ADD ${columnSql}`);
}

async function schemaHealth() {
  if (!pool) return { ok: false, missing: [] };
  const missing = [];
  for (const [table, columns] of Object.entries(REQUIRED_COLUMNS)) {
    const existing = await tableColumns(table);
    for (const column of columns) {
      if (!existing.has(column)) missing.push({ table, column });
    }
  }
  return { ok: missing.length === 0, missing };
}

async function assertSchemaReady() {
  const health = await schemaHealth();
  if (!health.ok) {
    const list = health.missing.map((item) => `${item.table}.${item.column}`).join(', ');
    throw new Error(`Database schema migration is incomplete. Missing columns: ${list}`);
  }
}

async function runMigrations() {
  await addColumnIfMissing('customers', 'customer_code TEXT');
  await addColumnIfMissing('pricings', 'pricing_items_json TEXT');
  for (const definition of [
    'product_code TEXT',
    "width_mode TEXT DEFAULT 'single'",
    'width_lines_json TEXT',
    'raw_cost REAL DEFAULT 0',
    'accessory_type TEXT',
    'accessory_percent REAL DEFAULT 0',
    'accessory_lines_json TEXT',
    'operation_notes_json TEXT',
  ]) await addColumnIfMissing('orders', definition);
  for (const definition of [
    'width_line_id TEXT',
    'raw_inch REAL DEFAULT 0',
    'raw_width REAL DEFAULT 0',
    'accessory_quantity_manual REAL',
  ]) await addColumnIfMissing('order_allocations', definition);
  await addColumnIfMissing('dyehouse_delivery_batches', 'width_line_id TEXT');
  for (const table of [
    'raw_receiving_batches',
    'dyehouse_delivery_batches',
    'finished_receiving_batches',
    'customer_delivery_batches',
    'accessory_batches',
    'raw_returns',
    'gluing_batches',
  ]) {
    await addColumnIfMissing(table, 'source_document_json TEXT');
    await addColumnIfMissing(table, 'created_by TEXT');
    await addColumnIfMissing(table, 'updated_by TEXT');
  }
  for (const definition of [
    'customer_name TEXT',
    'unit_price REAL DEFAULT 0',
    'total_price REAL DEFAULT 0',
    'payment_terms TEXT',
    'note_number TEXT',
    "movement TEXT DEFAULT 'delivery'",
  ]) await addColumnIfMissing('customer_delivery_batches', definition);
  await addColumnIfMissing('finished_receiving_batches', 'note_number TEXT');
  for (const definition of ['batch_date TEXT', 'note_number TEXT', 'movement TEXT']) {
    await addColumnIfMissing('accessory_batches', definition);
  }
  await addColumnIfMissing('raw_returns', 'note_number TEXT');
  for (const definition of [
    "movement TEXT DEFAULT 'sent'",
    'partner_fabric TEXT',
    'output_name TEXT',
    'customer_name TEXT',
    'note_number TEXT',
  ]) await addColumnIfMissing('gluing_batches', definition);
  await addColumnIfMissing('dyehouse_transfers', 'note_number TEXT');
  await addColumnIfMissing('dyehouse_transfers', 'created_by TEXT');
  await addColumnIfMissing('dyehouse_transfers', 'updated_by TEXT');
  for (const definition of [
    'name TEXT',
    'username TEXT',
    'password_hash TEXT',
    "role TEXT DEFAULT 'user'",
    'is_active INTEGER DEFAULT 1',
  ]) await addColumnIfMissing('users', definition);
  await assertSchemaReady();
}

function normalizeSql(sqlText, params = []) {
  let text = String(sqlText || '').trim();
  if (/^SELECT\s+COUNT\(\*\)\s+AS\s+count\s+FROM\s+sqlite_master\s+WHERE\s+type\s*=\s*\?/i.test(text)) {
    return { text: 'SELECT COUNT(*) AS [count] FROM sys.tables', params: [] };
  }

  text = text
    .replace(/\bSELECT\s+key\s*,\s*value_json\s+FROM\s+system_settings\b/gi, 'SELECT [key] AS [key], value_json FROM system_settings')
    .replace(/\bSELECT\s+key\s*,\s*value_json\s*,\s*created_at\s*,\s*updated_at\s+FROM\s+system_settings\b/gi, 'SELECT [key] AS [key], value_json, created_at, updated_at FROM system_settings')
    .replace(/\bINSERT\s+INTO\s+system_settings\s*\(\s*key\s*,/gi, 'INSERT INTO system_settings ([key],')
    .replace(/\bUPDATE\s+system_settings\s+SET\b/gi, 'UPDATE system_settings SET')
    .replace(/\bWHERE\s+key\s*=/gi, 'WHERE [key] =')
    .replace(/\bORDER\s+BY\s+key\b/gi, 'ORDER BY [key]');

  text = text.replace(/\bINSERT\s+OR\s+IGNORE\s+INTO\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i, (_m, table, cols, values) => {
    const tableName = String(table || '').toLowerCase();
    const normalizedCols = tableName === 'system_settings'
      ? cols.replace(/(^|,\s*)key(\s*,|$)/i, (part) => part.replace(/\bkey\b/i, '[key]'))
      : cols;
    const firstColumn = normalizedCols.split(',')[0].trim().replace(/[\[\]]/g, '');
    const firstColumnSql = table.toLowerCase() === 'system_settings' && firstColumn.toLowerCase() === 'key' ? '[key]' : firstColumn;
    return `IF NOT EXISTS (SELECT 1 FROM ${table} WHERE ${firstColumnSql} = ?) INSERT INTO ${table} (${normalizedCols}) VALUES (${values})`;
  });

  text = text.replace(/\s+\bLIMIT\s+(\d+|\?)\s*$/i, (_match, limit) => {
    const orderBy = /\bORDER\s+BY\b/i.test(text) ? '' : ' ORDER BY (SELECT NULL)';
    return `${orderBy} OFFSET 0 ROWS FETCH NEXT ${limit} ROWS ONLY`;
  });

  let index = 0;
  text = text.replace(/\?/g, () => `@p${index++}`);
  return { text, params };
}

function bind(request, params = []) {
  params.forEach((value, index) => request.input(`p${index}`, value === undefined ? null : value));
  return request;
}

async function exec(sqlText) {
  await initDb();
  await execBatches(sqlText);
  return {};
}

async function run(sqlText, params = []) {
  await initDb();
  const { text, params: mappedParams } = normalizeSql(sqlText, params);
  const result = await bind(pool.request(), mappedParams).query(text);
  return { changes: Array.isArray(result.rowsAffected) ? result.rowsAffected.reduce((total, count) => total + count, 0) : 0 };
}

async function all(sqlText, params = []) {
  await initDb();
  const { text, params: mappedParams } = normalizeSql(sqlText, params);
  const result = await bind(pool.request(), mappedParams).query(text);
  return result.recordset || [];
}

async function get(sqlText, params = []) {
  const rows = await all(sqlText, params);
  return rows[0] || null;
}

async function transaction(work) {
  await initDb();
  const tx = new sql.Transaction(pool);
  await tx.begin(sql.ISOLATION_LEVEL.READ_COMMITTED);
  try {
    const runner = {
      async run(sqlText, params = []) {
        const { text, params: mappedParams } = normalizeSql(sqlText, params);
        const result = await bind(new sql.Request(tx), mappedParams).query(text);
        return { changes: Array.isArray(result.rowsAffected) ? result.rowsAffected.reduce((total, count) => total + count, 0) : 0 };
      },
      async get(sqlText, params = []) {
        const rows = await this.all(sqlText, params);
        return rows[0] || null;
      },
      async all(sqlText, params = []) {
        const { text, params: mappedParams } = normalizeSql(sqlText, params);
        const result = await bind(new sql.Request(tx), mappedParams).query(text);
        return result.recordset || [];
      },
    };
    const result = await work(runner);
    await tx.commit();
    return result;
  } catch (error) {
    await tx.rollback();
    throw error;
  }
}

async function backupDatabase(filePath) {
  await initDb();
  const target = path.resolve(String(filePath || ''));
  if (!path.isAbsolute(target) || path.extname(target).toLowerCase() !== '.bak') {
    throw new Error('SQL Server backup target must be an absolute .bak path.');
  }
  const database = String(DB_PATH).replace(/]/g, ']]');
  const safeTarget = target.replace(/'/g, "''");
  await pool.request().batch(
    `BACKUP DATABASE [${database}] TO DISK = N'${safeTarget}' WITH INIT, COPY_ONLY, CHECKSUM, STATS = 10`
  );
  return target;
}

module.exports = {
  get db() { return pool; },
  DB_PATH,
  initDb,
  exec,
  run,
  transaction,
  get,
  all,
  schemaHealth,
  backupDatabase,
  normalizeSqlForTest: normalizeSql,
};

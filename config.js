/**
 * 2B Tex - مصدر الحقيقة الوحيد للإعدادات والمسارات.
 *
 * كل المسارات تُشتق من جذر التطبيق (المجلد الأب لمجلد system)، فلا يوجد أي حرف
 * قرص أو مسار مطلق مكتوب في الكود — وهذا شرط نقل الحزمة لأي جهاز أو سيرفر.
 *
 * أولوية القيم: متغير بيئة موجود ← config/2btex.config.json ← .env.sqlserver.local
 * (توافق عكسي) ← الافتراضي. الترتيب ده معناه إن السيرفر الحالي يفضل شغال بنفس
 * متغيرات البيئة الـ machine-level لحد ما ننقل القيم للملف.
 */

const fs = require('fs');
const path = require('path');

const SYSTEM_DIR = __dirname;
const APP_ROOT = path.resolve(SYSTEM_DIR, '..');

const paths = {
  appRoot: APP_ROOT,
  systemDir: SYSTEM_DIR,
  configDir: path.join(APP_ROOT, 'config'),
  configFile: process.env.TWOBTEX_CONFIG || path.join(APP_ROOT, 'config', '2btex.config.json'),
  dataDir: path.join(APP_ROOT, 'data'),
  logsDir: path.join(APP_ROOT, 'logs'),
  backupsDir: path.join(APP_ROOT, 'backups'),
  runtimeDir: path.join(APP_ROOT, 'runtime'),
  runtimeNodeModules: path.join(APP_ROOT, 'runtime', 'node_modules'),
  serverToolsDir: path.join(APP_ROOT, 'server-tools'),
  whatsappServiceDir: path.join(SYSTEM_DIR, 'whatsapp-service'),
  whatsappDataDir: path.join(APP_ROOT, 'data', 'whatsapp'),
  whatsappRuntimeDir: path.join(APP_ROOT, 'data', 'whatsapp-service'),
  legacyEnvFile: path.join(SYSTEM_DIR, '.env.sqlserver.local'),
  sqliteRuntimeDb: path.join(SYSTEM_DIR, 'server-data', '2btex.sqlite'),
  sqliteSeedDb: path.join(SYSTEM_DIR, 'backend', 'data', '2btex.sqlite'),
};

const DEFAULTS = {
  ports: { frontend: 3000, backend: 3050, whatsapp: 3020 },
  hosts: { frontend: '0.0.0.0', backend: '127.0.0.1', whatsapp: '127.0.0.1' },
  db: {
    client: 'sqlite',
    server: '',
    port: 1433,
    database: '2BTex',
    user: '',
    password: '',
    encrypt: false,
    trustServerCertificate: true,
  },
  auth: { systemUser: 'admin', systemPass: '', authSecret: '' },
  openaiApiKey: '',
  appUrl: '',
};

function readJsonFile(filePath) {
  try {
    const text = fs.readFileSync(filePath, 'utf8').replace(/^﻿/, '');
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/** يقرأ ملف .env بصيغة KEY=VALUE ويرجّع كائن — للتوافق مع .env.sqlserver.local. */
function readDotEnvFile(filePath) {
  const values = {};
  let text = '';
  try {
    text = fs.readFileSync(filePath, 'utf8');
  } catch {
    return values;
  }
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const separator = line.indexOf('=');
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    if (key) values[key] = line.slice(separator + 1).trim();
  }
  return values;
}

function firstDefined(...candidates) {
  for (const value of candidates) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'string' && value.trim() === '') continue;
    return value;
  }
  return undefined;
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toBoolean(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  const text = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(text)) return true;
  if (['0', 'false', 'no', 'off'].includes(text)) return false;
  return fallback;
}

let cached = null;

function load({ reload = false } = {}) {
  if (cached && !reload) return cached;

  const file = readJsonFile(paths.configFile);
  const legacy = readDotEnvFile(paths.legacyEnvFile);
  const env = process.env;
  const filePorts = file.ports || {};
  const fileHosts = file.hosts || {};
  const fileDb = file.db || {};
  const fileAuth = file.auth || {};

  const frontendPort = toNumber(firstDefined(env.PORT, filePorts.frontend), DEFAULTS.ports.frontend);
  const backendPort = toNumber(firstDefined(env.BACKEND_PORT, filePorts.backend), DEFAULTS.ports.backend);
  const whatsappPort = toNumber(firstDefined(env.WHATSAPP_PORT, filePorts.whatsapp), DEFAULTS.ports.whatsapp);

  const dbClient = String(
    firstDefined(env.DB_CLIENT, env.DATABASE_CLIENT, fileDb.client, legacy.DB_CLIENT, DEFAULTS.db.client),
  ).trim().toLowerCase();

  const config = {
    paths,
    configFileExists: fs.existsSync(paths.configFile),
    ports: { frontend: frontendPort, backend: backendPort, whatsapp: whatsappPort },
    hosts: {
      frontend: firstDefined(env.FRONTEND_HOST, fileHosts.frontend, DEFAULTS.hosts.frontend),
      backend: firstDefined(env.BACKEND_HOST, fileHosts.backend, DEFAULTS.hosts.backend),
      whatsapp: firstDefined(env.WHATSAPP_HOST, fileHosts.whatsapp, DEFAULTS.hosts.whatsapp),
    },
    db: {
      client: dbClient,
      server: firstDefined(env.MSSQL_SERVER, fileDb.server, legacy.MSSQL_SERVER, DEFAULTS.db.server),
      port: toNumber(firstDefined(env.MSSQL_PORT, fileDb.port, legacy.MSSQL_PORT), DEFAULTS.db.port),
      database: firstDefined(env.MSSQL_DATABASE, fileDb.database, legacy.MSSQL_DATABASE, DEFAULTS.db.database),
      user: firstDefined(env.MSSQL_USER, fileDb.user, legacy.MSSQL_USER, DEFAULTS.db.user),
      password: firstDefined(env.MSSQL_PASSWORD, fileDb.password, legacy.MSSQL_PASSWORD, DEFAULTS.db.password),
      encrypt: toBoolean(firstDefined(env.MSSQL_ENCRYPT, fileDb.encrypt, legacy.MSSQL_ENCRYPT), DEFAULTS.db.encrypt),
      trustServerCertificate: toBoolean(
        firstDefined(env.MSSQL_TRUST_CERT, fileDb.trustServerCertificate, legacy.MSSQL_TRUST_CERT),
        DEFAULTS.db.trustServerCertificate,
      ),
      sqlitePath: firstDefined(
        env.DB_PATH,
        file.sqlitePath,
        fs.existsSync(paths.sqliteRuntimeDb) ? paths.sqliteRuntimeDb : undefined,
        paths.sqliteSeedDb,
      ),
    },
    auth: {
      systemUser: firstDefined(env.SYSTEM_USER, fileAuth.systemUser, DEFAULTS.auth.systemUser),
      systemPass: firstDefined(env.SYSTEM_PASS, fileAuth.systemPass, DEFAULTS.auth.systemPass),
      authSecret: firstDefined(env.AUTH_SECRET, env.SESSION_SECRET, fileAuth.authSecret, DEFAULTS.auth.authSecret),
    },
    openaiApiKey: firstDefined(env.OPENAI_API_KEY, file.openaiApiKey, DEFAULTS.openaiApiKey) || '',
    appUrl: firstDefined(env.APP_URL, file.appUrl, DEFAULTS.appUrl) || '',
  };

  cached = config;
  return config;
}

/**
 * ينشر الإعدادات على process.env بحيث تراها العمليات الفرعية (backend / frontend /
 * whatsapp). لا يدهس أي متغير بيئة موجود مسبقًا.
 */
function applyToEnv(config = load()) {
  const assignments = {
    PORT: String(config.ports.frontend),
    BACKEND_PORT: String(config.ports.backend),
    WHATSAPP_PORT: String(config.ports.whatsapp),
    BACKEND_HOST: config.hosts.backend,
    WHATSAPP_HOST: config.hosts.whatsapp,
    DB_CLIENT: config.db.client,
    SYSTEM_USER: config.auth.systemUser,
    SYSTEM_PASS: config.auth.systemPass,
    AUTH_SECRET: config.auth.authSecret,
    OPENAI_API_KEY: config.openaiApiKey,
    MSSQL_NODE_MODULES: fs.existsSync(path.join(paths.runtimeNodeModules, 'mssql'))
      ? paths.runtimeNodeModules
      : '',
  };

  if (config.db.client === 'mssql' || config.db.client === 'sqlserver' || config.db.client === 'sql-server') {
    Object.assign(assignments, {
      MSSQL_SERVER: config.db.server,
      MSSQL_PORT: String(config.db.port),
      MSSQL_DATABASE: config.db.database,
      MSSQL_USER: config.db.user,
      MSSQL_PASSWORD: config.db.password,
      MSSQL_ENCRYPT: config.db.encrypt ? '1' : '0',
      MSSQL_TRUST_CERT: config.db.trustServerCertificate ? '1' : '0',
    });
  } else {
    assignments.DB_PATH = config.db.sqlitePath;
  }

  for (const [key, value] of Object.entries(assignments)) {
    if (value === undefined || value === null || value === '') continue;
    if (process.env[key] !== undefined && process.env[key] !== '') continue;
    process.env[key] = String(value);
  }
  return process.env;
}

/** وصف مختصر لقاعدة البيانات للوجات — بدون أي كلمات مرور. */
function describeDatabase(config = load()) {
  if (config.db.client === 'sqlite') return `SQLite ${config.db.sqlitePath}`;
  return `SQL Server ${config.db.server}:${config.db.port}/${config.db.database}`;
}

module.exports = { load, applyToEnv, describeDatabase, paths, DEFAULTS };

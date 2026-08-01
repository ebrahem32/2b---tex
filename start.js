/**
 * 2B Tex - Railway startup script
 * ظٹط´ط؛ظ‘ظ„ backend + frontend ظ…ط¹ط§ظ‹ ظپظٹ ظ†ظپط³ ط§ظ„ظ€ container
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const appConfig = require('./config');

const startupConfig = appConfig.load();
const productionMssqlLock = path.join(appConfig.paths.configDir, 'production-mssql.lock');
const isSqlServerClient = ['mssql', 'sqlserver', 'sql-server'].includes(
  String(startupConfig.db.client || '').trim().toLowerCase(),
);

if (
  fs.existsSync(productionMssqlLock)
  && (!startupConfig.configFileExists || !isSqlServerClient)
) {
  console.error('[2B Tex] Startup blocked: production requires the external SQL Server configuration.');
  process.exit(1);
}

// ينشر ملف الإعدادات الموحّد على process.env قبل أي قراءة تحته، بدون دهس أي
// متغير بيئة موجود مسبقًا — فالسيرفر الحالي يفضل شغال بنفس متغيراته.
appConfig.applyToEnv(startupConfig);

const FRONTEND_PORT = process.env.PORT || '3000';
function internalPort(value, fallback, reserved = []) {
  const cleanValue = String(value || '').trim();
  const cleanFallback = String(fallback || '').trim();
  if (cleanValue && !reserved.includes(cleanValue)) return cleanValue;
  let candidate = Number(cleanFallback || 3050);
  while (reserved.includes(String(candidate))) candidate += 1;
  return String(candidate);
}
const BACKEND_PORT = internalPort(process.env.BACKEND_PORT, '3050', [FRONTEND_PORT]);
const WHATSAPP_PORT = internalPort(process.env.WHATSAPP_PORT, '3020', [FRONTEND_PORT, BACKEND_PORT]);
const LOCAL_RUNTIME_DB_PATH = path.join(__dirname, 'server-data', '2btex.sqlite');
const DB_PATH = process.env.DB_PATH || (fs.existsSync(LOCAL_RUNTIME_DB_PATH) ? LOCAL_RUNTIME_DB_PATH : path.join(__dirname, 'backend', 'data', '2btex.sqlite'));
const SEED_PATH = path.join(__dirname, 'backend', 'data', '2btex.sqlite');
const IS_RAILWAY = !!(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID || process.env.RAILWAY_SERVICE_ID);
const ALLOW_DB_SEED = process.env.ALLOW_DB_SEED === '1';
const VOLUME_ROOT = process.env.RAILWAY_VOLUME_MOUNT_PATH || '/data';
const LEGACY_WHATSAPP_DATA_DIR = path.join(__dirname, 'whatsapp-service', 'data');
// جلسة واتساب مرتبطة بمجلدها؛ لو المجلد القديم موجود نحترمه حتى لا يُفقد الربط.
const WHATSAPP_DATA_DIR = process.env.WHATSAPP_DATA_DIR
  || (IS_RAILWAY ? path.join(VOLUME_ROOT, 'whatsapp')
    : (fs.existsSync(LEGACY_WHATSAPP_DATA_DIR) ? LEGACY_WHATSAPP_DATA_DIR : appConfig.paths.whatsappDataDir));
const puppeteerExecutablePath = process.env.PUPPETEER_EXECUTABLE_PATH || (IS_RAILWAY ? '/usr/bin/chromium' : '');
const WHATSAPP_SERVICE_DIR = path.join(__dirname, 'whatsapp-service');
// أماكن محتملة لنسخة تشغيل واتساب المثبّتة بـ node_modules، بالترتيب: المضبوطة
// يدويًا، ثم المضمّنة في الحزمة (محمولة)، ثم مسار ProgramData القديم.
const WHATSAPP_RUNTIME_CANDIDATES = [
  process.env.WHATSAPP_SERVICE_RUNTIME,
  appConfig.paths.whatsappRuntimeDir,
  'C:\\ProgramData\\2BTex\\whatsapp-service',
].filter(Boolean);

function whatsappServiceCwd() {
  if (IS_RAILWAY) return WHATSAPP_SERVICE_DIR;
  for (const candidate of WHATSAPP_RUNTIME_CANDIDATES) {
    if (!fs.existsSync(path.join(candidate, 'node_modules'))) continue;
    if (!fs.existsSync(path.join(candidate, 'package.json'))) continue;
    fs.copyFileSync(path.join(WHATSAPP_SERVICE_DIR, 'server.js'), path.join(candidate, 'server.js'));
    return candidate;
  }
  return WHATSAPP_SERVICE_DIR;
}

function failStartup(message) {
  console.error('==========================================');
  console.error('[2B Tex] FATAL STARTUP PROTECTION');
  console.error(message);
  console.error('==========================================');
  process.exit(1);
}

if (IS_RAILWAY && path.resolve(DB_PATH) === path.resolve(SEED_PATH) && process.env.ALLOW_BUNDLED_DB_ON_RAILWAY !== '1') {
  failStartup('[2B Tex] Railway must use a persistent DB_PATH such as /data/2btex.sqlite. Bundled GitHub SQLite is not allowed for production.');
}

// --- ط­ظ…ط§ظٹط© ط§ظ„ط¥ظ†طھط§ط¬: ظ„ط§ ظ†ظ†ط³ط® ظ‚ط§ط¹ط¯ط© GitHub طھظ„ظ‚ط§ط¦ظٹظ‹ط§ ظپظˆظ‚ طھط´ط؛ظٹظ„ Railway ---
if (DB_PATH !== SEED_PATH && !fs.existsSync(DB_PATH)) {
  const dbDir = path.dirname(DB_PATH);
  fs.mkdirSync(dbDir, { recursive: true });
  if (ALLOW_DB_SEED && fs.existsSync(SEED_PATH)) {
    fs.copyFileSync(SEED_PATH, DB_PATH);
    console.log(`[2B Tex] Database seeded by explicit ALLOW_DB_SEED=1: ${DB_PATH}`);
  } else if (IS_RAILWAY) {
    failStartup(`[2B Tex] Persistent Railway database is missing at ${DB_PATH}. Refusing to seed from GitHub. Attach a Railway Volume mounted at /data or restore the production SQLite first.`);
  } else if (fs.existsSync(SEED_PATH)) {
    console.log(`[2B Tex] Local run without production DB. Using bundled database at ${SEED_PATH}`);
  }
}

console.log('==========================================');
console.log('[2B Tex] Starting system...');
console.log(`[2B Tex] DB:       ${DB_PATH}`);
console.log(`[2B Tex] Backend:  port ${BACKEND_PORT}`);
console.log(`[2B Tex] Frontend: port ${FRONTEND_PORT}`);
console.log(`[2B Tex] WhatsApp: port ${WHATSAPP_PORT}`);
console.log('==========================================');

function launch(name, args, cwd, env = {}, options = {}) {
  const critical = options.critical !== false;
  const restartDelayMs = Number(options.restartDelayMs || 15000);
  // process.execPath وليس 'node' من الـ PATH: الحزمة المحمولة تشغّل نسختها
  // المضمّنة من Node على أجهزة لا يوجد بها Node مثبّت.
  const proc = spawn(process.execPath, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'inherit'
  });
  proc.on('error', (err) => {
    console.error(`[${name}] ERROR: ${err.message}`);
    if (critical) process.exit(1);
  });
  proc.on('exit', (code, signal) => {
    console.error(`[${name}] Exited - code=${code}, signal=${signal}`);
    if (critical) process.exit(code || 1);
    console.error(`[${name}] Restarting in ${Math.round(restartDelayMs / 1000)}s`);
    setTimeout(() => launch(name, args, cwd, env, options), restartDelayMs);
  });
  return proc;
}

// طھط´ط؛ظٹظ„ ط§ظ„ظ€ backend ط£ظˆظ„ط§ظ‹
launch('backend', ['server.js'], path.join(__dirname, 'backend'), {
  PORT: BACKEND_PORT,
  DB_PATH
});

// طھط´ط؛ظٹظ„ ط®ط¯ظ…ط© ظˆط§طھط³ط§ط¨ ط¯ط§ط®ظ„ظٹظ‹ط§ ط­طھظ‰ ظٹطھط¹ط§ظ…ظ„ ط§ظ„ظƒظ…ط¨ظٹظˆطھط± ظˆط§ظ„ظ…ظˆط¨ط§ظٹظ„ ظ…ط¹ ظ†ظپط³ ط±ط§ط¨ط· Railway.
launch('whatsapp', ['server.js'], whatsappServiceCwd(), {
  PORT: WHATSAPP_PORT,
  DATA_DIR: WHATSAPP_DATA_DIR,
  REPORTS_DIR: path.join(WHATSAPP_DATA_DIR, 'reports'),
  ...(puppeteerExecutablePath ? { PUPPETEER_EXECUTABLE_PATH: puppeteerExecutablePath } : {}),
}, { critical: false, restartDelayMs: 30000 });

// طھط´ط؛ظٹظ„ ط§ظ„ظ€ frontend ط¨ط¹ط¯ 3 ط«ظˆط§ظ†ظٹ ظ„ظ„طھط£ظƒط¯ ط£ظ† ط§ظ„ظ€ backend ط¬ط§ظ‡ط²
setTimeout(() => {
  launch('frontend', ['server.js'], __dirname, {
    PORT: FRONTEND_PORT,
    BACKEND_PORT,
    WHATSAPP_PORT
  });
}, 3000);

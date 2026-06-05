/**
 * 2B Tex - Railway startup script
 * يشغّل backend + frontend معاً في نفس الـ container
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const BACKEND_PORT = process.env.BACKEND_PORT || '3050';
const FRONTEND_PORT = process.env.PORT || '3000';
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'backend', 'data', '2btex.sqlite');
const SEED_PATH = path.join(__dirname, 'backend', 'data', '2btex.sqlite');
const IS_RAILWAY = !!(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID || process.env.RAILWAY_SERVICE_ID);
const ALLOW_DB_SEED = process.env.ALLOW_DB_SEED === '1';

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

// --- حماية الإنتاج: لا ننسخ قاعدة GitHub تلقائيًا فوق تشغيل Railway ---
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
console.log('==========================================');

function launch(name, args, cwd, env = {}) {
  const proc = spawn('node', args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'inherit'
  });
  proc.on('error', (err) => {
    console.error(`[${name}] ERROR: ${err.message}`);
    process.exit(1);
  });
  proc.on('exit', (code, signal) => {
    console.error(`[${name}] Exited — code=${code}, signal=${signal}`);
    process.exit(code || 1);
  });
  return proc;
}

// تشغيل الـ backend أولاً
launch('backend', ['server.js'], path.join(__dirname, 'backend'), {
  PORT: BACKEND_PORT,
  DB_PATH
});

// تشغيل الـ frontend بعد 3 ثواني للتأكد أن الـ backend جاهز
setTimeout(() => {
  launch('frontend', ['server.js'], __dirname, {
    PORT: FRONTEND_PORT,
    BACKEND_PORT
  });
}, 3000);

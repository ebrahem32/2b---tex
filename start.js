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

// --- نسخ قاعدة البيانات إلى الـ Volume عند أول تشغيل ---
if (DB_PATH !== SEED_PATH && !fs.existsSync(DB_PATH)) {
  const dbDir = path.dirname(DB_PATH);
  fs.mkdirSync(dbDir, { recursive: true });
  if (fs.existsSync(SEED_PATH)) {
    fs.copyFileSync(SEED_PATH, DB_PATH);
    console.log(`[2B Tex] Database seeded: ${DB_PATH}`);
  } else {
    console.log('[2B Tex] No seed found, starting with empty database');
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

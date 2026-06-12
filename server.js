const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const childProcess = require('child_process');
const crypto = require('crypto');

const root = __dirname;
const port = Number(process.env.PORT || 3000);
const systemUser = process.env.SYSTEM_USER;
const systemPass = process.env.SYSTEM_PASS;
const apiTarget = {
  host: '127.0.0.1',
  port: Number(process.env.BACKEND_PORT || 3050),
};
const whatsappTarget = {
  host: process.env.WHATSAPP_HOST || '127.0.0.1',
  port: Number(process.env.WHATSAPP_PORT || 3020),
};
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};
const noStoreHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

function latestBackupInfo() {
  const roots = [root, path.dirname(root)];
  const found = [];
  for (const base of roots) {
    try {
      for (const name of fs.readdirSync(base)) {
        if (!/^backup-before-|^backup-/.test(name)) continue;
        const fullPath = path.join(base, name);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) found.push({ name, path: fullPath, modifiedAt: stat.mtime.toISOString() });
      }
    } catch {}
  }
  return found.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt))[0] || null;
}

function currentCloudflareUrl() {
  const candidates = [
    path.join(root, 'logs', 'cloudflared.log'),
    path.join(root, 'logs', 'cloudflared.err.log'),
  ];
  const urls = [];
  for (const file of candidates) {
    try {
      const text = fs.readFileSync(file, 'utf8');
      const matches = text.match(/https:\/\/[-a-z0-9]+\.trycloudflare\.com/gi) || [];
      urls.push(...matches);
    } catch {}
  }
  return urls[urls.length - 1] || '';
}

function isProcessRunning(name) {
  try {
    const output = childProcess.execSync('tasklist', { encoding: 'utf8', windowsHide: true });
    return output.toLowerCase().includes(name.toLowerCase());
  } catch {
    return false;
  }
}

function backendHealth() {
  return new Promise((resolve) => {
    const req = http.request({ hostname: apiTarget.host, port: apiTarget.port, path: '/api/health', method: 'GET', timeout: 2500 }, (res) => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 300);
    });
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.on('error', () => resolve(false));
    req.end();
  });
}

function whatsappHealth() {
  return new Promise((resolve) => {
    const req = http.request({ hostname: whatsappTarget.host, port: whatsappTarget.port, path: '/api/status', method: 'GET', timeout: 2500 }, (res) => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 300);
    });
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.on('error', () => resolve(false));
    req.end();
  });
}

function safePath(urlPath) {
  let decoded = '/';
  try {
    decoded = decodeURIComponent(urlPath.split('?')[0]);
  } catch {
    return null;
  }
  const clean = decoded === '/' ? '/index.html' : decoded;
  const target = path.normalize(path.join(root, clean));
  const relative = path.relative(root, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return target;
}

function sendMissingCredentials(res) {
  res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('لم يتم ضبط بيانات الدخول للنظام. اضبط SYSTEM_USER و SYSTEM_PASS ثم أعد تشغيل السيرفر.');
}

function timingSafeEqualText(a, b) {
  const left = Buffer.from(String(a || ''), 'utf8');
  const right = Buffer.from(String(b || ''), 'utf8');
  if (left.length !== right.length) return false;
  return cryptoSafeEqual(left, right);
}

function cryptoSafeEqual(left, right) {
  let result = 0;
  for (let i = 0; i < left.length; i += 1) result |= left[i] ^ right[i];
  return result === 0;
}

function sessionSecret() {
  return process.env.AUTH_SECRET || process.env.SESSION_SECRET || process.env.SYSTEM_PASS || '2btex-development-session-secret';
}

function cookieValue(header, name) {
  const match = String(header || '').split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : '';
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

function isAuthorized(req) {
  if (verifySessionToken(cookieValue(req.headers.cookie, 'twobtex_session'))) return true;
  const header = req.headers.authorization || '';
  if (!header.startsWith('Basic ')) return false;
  try {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
    const separator = decoded.indexOf(':');
    if (separator < 0) return false;
    const user = decoded.slice(0, separator);
    const pass = decoded.slice(separator + 1);
    return timingSafeEqualText(user, systemUser) && timingSafeEqualText(pass, systemPass);
  } catch {
    return false;
  }
}

function isAuthPublicRequest(req) {
  const url = req.url || '/';
  return url === '/login.html'
    || url.startsWith('/api/auth/login')
    || url.startsWith('/api/auth/logout')
    || url.startsWith('/api/auth/me')
    || url.startsWith('/2b-mark.svg')
    || url.startsWith('/2B%20Tex%20Circular.ico');
}

function redirectToLogin(res) {
  res.writeHead(302, { Location: '/login.html', ...noStoreHeaders });
  res.end();
}

function requestAppLogin(req, res) {
  if ((req.url || '').startsWith('/api')) {
    res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8', ...noStoreHeaders });
    res.end(JSON.stringify({ error: 'غير مسجل الدخول' }));
    return;
  }
  redirectToLogin(res);
}

function requestLogin(res) {
  res.writeHead(401, {
    'Content-Type': 'text/plain; charset=utf-8',
    'WWW-Authenticate': 'Basic realm="2B Tex"',
  });
  res.end('مطلوب تسجيل الدخول لفتح نظام 2B Tex.');
}

function proxyApi(req, res) {
  if (apiTarget.port === port) {
    res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: false, error: 'إعداد منفذ قاعدة البيانات غير صحيح. راجع BACKEND_PORT.' }));
    return;
  }
  const options = {
    hostname: apiTarget.host,
    port: apiTarget.port,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `${apiTarget.host}:${apiTarget.port}` },
  };
  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
    proxyRes.pipe(res);
  });
  proxyReq.on('error', () => {
    res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: false, error: 'خدمة قاعدة البيانات غير متصلة حاليًا' }));
  });
  req.pipe(proxyReq);
}

function proxyWhatsapp(req, res) {
  const pathName = (req.url || '').replace(/^\/whatsapp/, '') || '/';
  const options = {
    hostname: whatsappTarget.host,
    port: whatsappTarget.port,
    path: pathName,
    method: req.method,
    headers: { ...req.headers, host: `${whatsappTarget.host}:${whatsappTarget.port}` },
  };
  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
    proxyRes.pipe(res);
  });
  proxyReq.on('error', () => {
    res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: false, error: 'خدمة واتساب غير متصلة حاليًا' }));
  });
  req.pipe(proxyReq);
}

const server = http.createServer((req, res) => {
  if (!systemUser || !systemPass) {
    sendMissingCredentials(res);
    return;
  }
  if (!isAuthPublicRequest(req) && !isAuthorized(req)) {
    requestAppLogin(req, res);
    return;
  }
  if ((req.url || '').startsWith('/system/status')) {
    Promise.all([backendHealth(), whatsappHealth()]).then(([backendOk, whatsappOk]) => {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        ok: true,
        frontend: { ok: true, port },
        backend: { ok: backendOk, port: apiTarget.port },
        whatsapp: { ok: whatsappOk, port: whatsappTarget.port },
        cloudflare: { ok: isProcessRunning('cloudflared.exe'), url: currentCloudflareUrl() },
        backup: { ok: !!latestBackupInfo(), latest: latestBackupInfo() },
        updatedAt: new Date().toISOString(),
      }));
    });
    return;
  }
  if ((req.url || '').startsWith('/whatsapp')) {
    proxyWhatsapp(req, res);
    return;
  }
  if ((req.url || '').startsWith('/api')) {
    proxyApi(req, res);
    return;
  }
  const filePath = safePath(req.url || '/');
  if (!filePath) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('الملف غير موجود');
      return;
    }
    res.writeHead(200, { 'Content-Type': mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream', ...noStoreHeaders });
    res.end(data);
  });
});

server.listen(port, '0.0.0.0', () => {
  const addresses = [];
  for (const items of Object.values(os.networkInterfaces())) {
    for (const item of items || []) {
      if (item.family === 'IPv4' && !item.internal) addresses.push(item.address);
    }
  }
  console.log('2B Tex system is running');
  console.log('افتح من نفس الكمبيوتر: http://localhost:' + port);
  addresses.forEach((ip) => console.log('افتح من الموبايل: http://' + ip + ':' + port));
  console.log('اترك هذه النافذة مفتوحة أثناء الاستخدام.');
});

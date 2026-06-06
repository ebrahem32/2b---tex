const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

const PORT = Number(process.env.PORT || 3020);
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const REPORTS_DIR = process.env.REPORTS_DIR || path.join(DATA_DIR, 'reports');
const OUTBOX_FILE = path.join(DATA_DIR, 'outbox.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const ATTEMPTS_FILE = path.join(DATA_DIR, 'attempts.json');

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(REPORTS_DIR, { recursive: true });

const defaultSettings = {
  weavingGroupName: '2B - النسيج',
  dyeingGroupName: '2B - المصبغة',
  dyehousesReportGroupName: 'اوردارات 2B',
  dyehouseGroups: {},
  weavingGroups: {},
  customerGroups: {},
  sendingEnabled: false
};
const statuses = new Set(['pending', 'sending', 'sent', 'failed', 'cancelled']);

function readJson(file, fallback) {
  try {
    const value = JSON.parse(fs.readFileSync(file, 'utf8'));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}
function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2), 'utf8');
}
function nowIso() { return new Date().toISOString(); }
function safeFilePart(value) {
  return String(value || '').replace(/[\\/:*?"<>|\s]+/g, '_').replace(/_+/g, '_').slice(0, 80) || 'report';
}
function cleanupChromiumLocks(dir) {
  try {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) cleanupChromiumLocks(fullPath);
      else if (/^Singleton/.test(entry.name)) fs.rmSync(fullPath, { force: true });
    }
  } catch (error) {
    console.warn(`WhatsApp session lock cleanup skipped: ${error.message}`);
  }
}

let outbox = readJson(OUTBOX_FILE, []);
let settings = { ...defaultSettings, ...readJson(SETTINGS_FILE, {}) };
let attempts = readJson(ATTEMPTS_FILE, []);
let whatsapp = { status: 'disconnected', updatedAt: nowIso(), errorMessage: '', qr: '', qrDataUrl: '' };
let clientReady = false;
let isProcessing = false;

cleanupChromiumLocks(path.join(DATA_DIR, 'sessions'));

function persist() {
  writeJson(OUTBOX_FILE, outbox);
  writeJson(SETTINGS_FILE, settings);
  writeJson(ATTEMPTS_FILE, attempts.slice(-1000));
}
function publicWhatsappState() {
  return {
    status: whatsapp.status,
    updatedAt: whatsapp.updatedAt,
    errorMessage: whatsapp.errorMessage,
    qrDataUrl: whatsapp.status === 'waiting_for_qr' ? whatsapp.qrDataUrl || '' : '',
  };
}
function mergeOutbox(incoming = []) {
  const byId = new Map(outbox.map((item) => [item.id, item]));
  for (const row of incoming) {
    if (!row || !row.id) continue;
    const local = byId.get(row.id);
    const normalized = {
      id: row.id,
      reportType: row.reportType || '',
      orderNumber: row.orderNumber || '',
      customerName: row.customerName || '',
      targetGroup: row.targetGroup || '',
      messageText: row.messageText || '',
      attachmentPath: row.attachmentPath || '',
      status: statuses.has(row.status) ? row.status : 'pending',
      createdAt: row.createdAt || nowIso(),
      sendingAt: row.sendingAt || null,
      sentAt: row.sentAt || null,
      errorMessage: row.errorMessage || '',
      retryCount: Number(row.retryCount || 0)
    };
    if (!local) {
      byId.set(row.id, normalized);
      continue;
    }
    // إذا طلبت الواجهة إعادة مشاركة تقرير مرسل بالفعل، نسمح بإرجاعه للطابور.
    if (local.status === 'sent' && normalized.status === 'pending') {
      byId.set(row.id, { ...local, ...normalized, sentAt: null, sendingAt: null, errorMessage: '' });
    } else if (local.status === 'sent') {
      byId.set(row.id, { ...normalized, ...local });
    } else if (local.status === 'sending') {
      byId.set(row.id, { ...normalized, ...local, messageText: normalized.messageText || local.messageText, attachmentPath: normalized.attachmentPath || local.attachmentPath });
    } else {
      byId.set(row.id, { ...local, ...normalized, status: normalized.status });
    }
  }
  outbox = [...byId.values()].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  persist();
}

const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(cors());
app.use(express.json({ limit: '100mb' }));

app.get('/api/status', (req, res) => {
  res.json({ whatsapp: publicWhatsappState(), outbox, attempts: attempts.slice(-50) });
});
app.get('/api/groups', async (req, res) => {
  try {
    if (!clientReady || whatsapp.status !== 'connected') {
      return res.status(409).json({ ok: false, error: 'whatsapp_not_connected', whatsapp: publicWhatsappState(), groups: [] });
    }
    const chats = await client.getChats();
    const groups = chats
      .filter((chat) => chat.isGroup)
      .map((chat) => ({ id: chat.id?._serialized || chat.id || '', name: String(chat.name || '').trim() }))
      .filter((group) => group.name)
      .sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    res.json({ ok: true, groups });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message, groups: [] });
  }
});
app.get('/api/outbox', (req, res) => res.json({ outbox }));
app.post('/api/outbox/sync', (req, res) => {
  if (req.body && req.body.settings) settings = { ...settings, ...req.body.settings };
  mergeOutbox(Array.isArray(req.body?.outbox) ? req.body.outbox : []);
  res.json({ ok: true, whatsapp: publicWhatsappState(), outbox });
});
app.post('/api/outbox/:id/retry', (req, res) => {
  const row = outbox.find((item) => item.id === req.params.id);
  if (!row) return res.status(404).json({ ok: false, error: 'report_not_found' });
  if (row.status !== 'sent') {
    row.status = 'pending';
    row.errorMessage = '';
    row.sendingAt = null;
  }
  persist();
  res.json({ ok: true, row });
});
app.post('/api/outbox/:id/cancel', (req, res) => {
  const row = outbox.find((item) => item.id === req.params.id);
  if (!row) return res.status(404).json({ ok: false, error: 'report_not_found' });
  if (row.status !== 'sent') row.status = 'cancelled';
  persist();
  res.json({ ok: true, row });
});
app.post('/api/reports/upload', (req, res) => {
  try {
    const { reportType, orderNumber, customerName, dataUrl } = req.body || {};
    const rawDataUrl = String(dataUrl || '');
    const isPng = rawDataUrl.startsWith('data:image/png;base64,');
    const isPdf = rawDataUrl.startsWith('data:application/pdf;base64,');
    if (!isPng && !isPdf) {
      return res.status(400).json({ ok: false, error: 'invalid_report_data' });
    }
    const datePart = new Date().toISOString().slice(0, 10);
    const extension = isPdf ? 'pdf' : 'png';
    const fileName = `${safeFilePart(reportType)}_${safeFilePart(orderNumber)}_${safeFilePart(customerName)}_${datePart}.${extension}`;
    const filePath = path.join(REPORTS_DIR, fileName);
    fs.writeFileSync(filePath, Buffer.from(rawDataUrl.split(',')[1], 'base64'));
    res.json({ ok: true, attachmentPath: filePath });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

async function findGroupByName(groupName) {
  const wanted = String(groupName || '').trim();
  if (!wanted) throw new Error('اسم الجروب غير محدد');
  const chats = await client.getChats();
  const compact = (value) => String(value || '').replace(/\*/g, '').replace(/[ـ\-\s]+/g, '').trim().toLowerCase();
  const normalizedWanted = compact(wanted);
  return chats.find((chat) => chat.isGroup && String(chat.name || '').trim() === wanted)
      || chats.find((chat) => chat.isGroup && compact(chat.name) === normalizedWanted);
}
function addAttempt(row, ok, message) {
  attempts.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, reportId: row.id, reportType: row.reportType, orderNumber: row.orderNumber, targetGroup: row.targetGroup, ok, message, createdAt: nowIso() });
  attempts = attempts.slice(-1000);
}
function configuredGroups(map) {
  return new Set(Object.values(map || {}).map((value) => String(value || '').trim()).filter(Boolean));
}
function isTargetAllowed(row) {
  const target = String(row.targetGroup || '').trim();
  if (!target) return false;
  if (row.reportType === 'weaving_production_order') return configuredGroups(settings.weavingGroups).has(target);
  if (row.reportType === 'dyeing_production_order') return configuredGroups(settings.dyehouseGroups).has(target);
  if (['customerreport_pdf_report', 'quotation_pdf_report'].includes(row.reportType)) return configuredGroups(settings.customerGroups).has(target);
  return true;
}
async function processNextReport() {
  if (!settings.sendingEnabled || !clientReady || whatsapp.status !== 'connected' || isProcessing) return;
  outbox.forEach((item) => {
    if (item.status === 'sending' && item.sendingAt && (Date.now() - new Date(item.sendingAt).getTime()) > 120000) {
      item.status = 'pending';
      item.errorMessage = '';
    }
  });
  const row = outbox.find((item) => item.status === 'pending');
  if (!row) return;
  isProcessing = true;
  row.status = 'sending';
  row.sendingAt = nowIso();
  row.errorMessage = '';
  persist();
  try {
    if (!isTargetAllowed(row)) throw new Error('الجروب غير مربوط يدويًا في إعدادات واتساب');
    const group = await findGroupByName(row.targetGroup);
    if (!group) throw new Error(`لم يتم العثور على الجروب: ${row.targetGroup}`);
    const text = row.messageText || 'تقرير من نظام 2B Tex';
    if (row.attachmentPath && fs.existsSync(row.attachmentPath)) {
      const media = MessageMedia.fromFilePath(row.attachmentPath);
      await group.sendMessage(media, { caption: text });
    } else {
      await group.sendMessage(text);
    }
    row.status = 'sent';
    row.sentAt = nowIso();
    row.errorMessage = '';
    addAttempt(row, true, 'تم الإرسال');
  } catch (error) {
    row.retryCount = Number(row.retryCount || 0) + 1;
    row.errorMessage = error.message || String(error);
    row.status = row.retryCount < 3 ? 'pending' : 'failed';
    addAttempt(row, false, row.errorMessage);
  } finally {
    persist();
    isProcessing = false;
  }
}

const client = new Client({
  authStrategy: new LocalAuth({ clientId: '2b-tex-ops', dataPath: path.join(DATA_DIR, 'sessions') }),
  puppeteer: {
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  }
});
client.on('qr', async (qr) => {
  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(qr, { margin: 1, width: 280 });
  } catch {}
  whatsapp = { status: 'waiting_for_qr', updatedAt: nowIso(), errorMessage: '', qr, qrDataUrl };
  console.log('\nامسح QR التالي من واتساب أول مرة فقط:\n');
  qrcode.generate(qr, { small: true });
});
client.on('ready', () => {
  clientReady = true;
  whatsapp = { status: 'connected', updatedAt: nowIso(), errorMessage: '', qr: '', qrDataUrl: '' };
  console.log('WhatsApp connected');
});
client.on('authenticated', () => console.log('WhatsApp authenticated'));
client.on('auth_failure', (msg) => {
  clientReady = false;
  whatsapp = { status: 'disconnected', updatedAt: nowIso(), errorMessage: msg || 'فشل تسجيل الدخول', qr: '', qrDataUrl: '' };
});
client.on('disconnected', (reason) => {
  clientReady = false;
  whatsapp = { status: 'disconnected', updatedAt: nowIso(), errorMessage: reason || 'انقطع الاتصال', qr: '', qrDataUrl: '' };
});

app.listen(PORT, () => {
  console.log(`2B Tex WhatsApp service running on http://127.0.0.1:${PORT}`);
  client.initialize();
  setInterval(processNextReport, 7000);
});

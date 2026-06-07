import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'training', 'output', 'order-flow');
const captureDir = path.join(outDir, 'captures');
const slideDir = path.join(outDir, 'slides');
const htmlDir = path.join(outDir, 'html');
const audioDir = path.join(outDir, 'audio');
const segmentDir = path.join(outDir, 'segments');
const finalVideo = path.join(rootDir, 'training', 'output', '2b-tex-order-flow-training-v2026.06.07.20.mp4');
const finalScript = path.join(rootDir, 'training', 'output', '2b-tex-order-flow-training-script-v2026.06.07.20.txt');

const appUrl = process.env.TWO_B_TEX_APP_URL || 'https://2b-tex-railway-startjs.up.railway.app';
const username = process.env.TWO_B_TEX_USER;
const password = process.env.TWO_B_TEX_PASSWORD;

if (!username || !password) {
  throw new Error('Set TWO_B_TEX_USER and TWO_B_TEX_PASSWORD before generating the training video.');
}

const basicAuth = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
const today = new Date().toISOString().slice(0, 10);
const stamp = new Date().toISOString().replace(/\D/g, '').slice(2, 12);
const ids = {
  customer: `customer-training-flow-${stamp}`,
  pricing: `pricing-training-flow-${stamp}`,
  order: `order-training-flow-${stamp}`,
  allocation: `allocation-training-flow-${stamp}`,
  raw: `raw-training-flow-${stamp}`,
  finished: `finished-training-flow-${stamp}`,
  customerDelivery: `delivery-training-flow-${stamp}`,
};
const orderNumber = `TR-${stamp.slice(4)}`;
const pricingNumber = `Q-${orderNumber}`;

const demo = {
  customer: 'عميل تدريب التشغيل',
  fabric: 'سنجل ليكرا تدريبي',
  dyehouse: 'جيما',
  weavingSource: 'مصدر نسيج تدريبي',
  color: 'كحلي تدريبي',
  quantity: 120,
  finishedQuantity: 120,
  deliveredQuantity: 120,
  inch: 32,
  width: 110,
  finishedWeight: 180,
  rawCost: 200,
  dyeCost: 80,
  profit: 35,
  unitPrice: 340,
};

const slides = [
  {
    capture: '01-pricing.png',
    title: '١. تسجيل التسعيرة',
    bullets: [
      'ابدأ بتسجيل بيانات العميل والصنف والكمية والبوصة.',
      'التسعيرة هي مرحلة ما قبل التشغيل، ومنها يتم تنزيل الطلب.',
      'بعد الحفظ تأكد أن التسعيرة ظهرت في قائمة التسعيرات.',
    ],
    narration: 'نبدأ دورة التشغيل من التسعير. الموظف يسجل العميل، الصنف، الكمية، البوصة، المصبغة المقترحة، سعر الكيلو وطريقة السداد. بعد الحفظ تظهر التسعيرة في القائمة، ومنها نستخدم زر تنزيل طلب لتحويلها إلى أمر تشغيل.',
  },
  {
    capture: '02-order-list.png',
    title: '٢. تنزيل التسعيرة إلى طلب',
    bullets: [
      'بعد تنزيل الطلب لا نعيد إدخال نفس البيانات من جديد.',
      'الطلب يظهر برقمه واسم العميل والصنف في قائمة الطلبات.',
      'استخدم البحث برقم الطلب أو العميل أو الصنف للوصول السريع.',
    ],
    narration: 'بعد اعتماد التسعيرة يتم تنزيلها إلى طلب. هنا نراجع أن الطلب ظهر في قائمة الطلبات بنفس العميل والصنف، وأن البحث يصل إليه برقم الطلب أو اسم العميل أو اسم الصنف. لا نكرر البيانات يدويًا طالما التسعيرة تحولت إلى طلب.',
  },
  {
    capture: '03-allocation.png',
    title: '٣. خطة توزيع الألوان',
    bullets: [
      'افتح الطلب وسجل اللون والكمية المخططة.',
      'كل لون يرتبط بالمصبغة والعرض والوزن المجهز.',
      'المخطط يجب أن يكون واضحًا قبل بدء الحركات.',
    ],
    narration: 'داخل الطلب نبدأ بخطة توزيع الألوان. نضيف اللون، الكمية المخططة، المصبغة، العرض، والوزن المجهز. هذه الخطة هي أساس كل الحركات التالية، لذلك يجب مراجعتها قبل تسجيل خروج الخام.',
  },
  {
    capture: '04-raw-out.png',
    title: '٤. خروج الخام للمصبغة',
    bullets: [
      'سجل خروج الخام من النسيج إلى المصبغة.',
      'اكتب الكمية ورقم الإذن ومصدر النسيج عند الحاجة.',
      'بعد الحفظ يظهر رصيد داخل المصبغة.',
    ],
    narration: 'بعد تجهيز خطة اللون نسجل حركة خروج الخام من النسيج إلى المصبغة. هذه الحركة هي التي تفتح رصيد الخام داخل المصبغة، وتظهر في ملخص الطلب كخام خرج من النسيج وكخام متاح بالمصبغة.',
  },
  {
    capture: '05-finished.png',
    title: '٥. استلام المجهز',
    bullets: [
      'عند رجوع الشغل من المصبغة سجل الكمية المستلمة.',
      'في التدريب نسجل نفس الكمية حتى تكون الدورة مكتملة وواضحة.',
      'بعد الاستلام ينتقل الرصيد إلى المخزن.',
    ],
    narration: 'عندما يرجع الشغل من المصبغة نسجل استلام المجهز. في فيديو التدريب نسجل نفس الكمية التي خرجت، حتى تكون الدورة التعليمية كاملة وواضحة. بعد الاستلام يصبح الرصيد داخل المخزن وجاهزًا للتسليم. وفي الشغل الحقيقي إذا رجعت كمية أقل أو أكثر، ستظهر المتابعة من خلال ملخص الطلب.',
  },
  {
    capture: '06-delivered.png',
    title: '٦. تسليم العميل وإغلاق الدورة',
    bullets: [
      'سجل تسليم العميل من رصيد المخزن فقط.',
      'بعد التسليم الكامل يصبح رصيد المخزن صفرًا.',
      'راجع الملخص قبل اعتبار الطلب مكتملًا.',
    ],
    narration: 'آخر خطوة هي تسليم العميل. يتم التسليم من رصيد المخزن، وليس من الخام التاريخي. بعد تسليم الكمية المستلمة بالكامل يصبح رصيد المخزن صفرًا، ونراجع الملخص للتأكد أن الخام الخارج، المجهز المستلم، الهالك، والتسليم كلها متطابقة.',
  },
];

const chromeCandidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
];

async function findChrome() {
  for (const candidate of chromeCandidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // keep looking
    }
  }
  throw new Error('Chrome or Edge was not found.');
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${path.basename(command)} exited with ${code}`)));
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function probeDuration(file) {
  const chunks = [];
  await new Promise((resolve, reject) => {
    const child = spawn(ffprobeInstaller.path, [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      file,
    ]);
    child.stdout.on('data', (chunk) => chunks.push(chunk));
    child.stderr.on('data', (chunk) => process.stderr.write(chunk));
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`ffprobe exited with ${code}`)));
  });
  return Number(Buffer.concat(chunks).toString('utf8').trim() || 6);
}

async function downloadFile(url, target) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36',
    },
  });
  if (!response.ok) throw new Error(`TTS download failed: ${response.status}`);
  await fs.writeFile(target, Buffer.from(await response.arrayBuffer()));
}

function splitTtsText(text, maxLength = 180) {
  const parts = String(text).split(/([،.؟!؛])/).reduce((acc, part, index, source) => {
    if (index % 2 === 0) acc.push(`${part}${source[index + 1] || ''}`.trim());
    return acc;
  }, []).filter(Boolean);
  const output = [];
  let current = '';
  for (const part of parts) {
    const next = current ? `${current} ${part}` : part;
    if (next.length <= maxLength) {
      current = next;
    } else {
      if (current) output.push(current);
      current = part;
    }
  }
  if (current) output.push(current);
  return output;
}

function googleTtsUrl(text) {
  const params = new URLSearchParams({ ie: 'UTF-8', q: text, tl: 'ar', client: 'tw-ob' });
  return `https://translate.google.com/translate_tts?${params.toString()}`;
}

async function saveArabicTts(text, target, index) {
  const chunkDir = path.join(audioDir, `chunks-${String(index + 1).padStart(2, '0')}`);
  await fs.mkdir(chunkDir, { recursive: true });
  const chunkFiles = [];
  for (const [chunkIndex, shortText] of splitTtsText(text).entries()) {
    const file = path.join(chunkDir, `chunk-${String(chunkIndex + 1).padStart(2, '0')}.mp3`);
    await downloadFile(googleTtsUrl(shortText), file);
    chunkFiles.push(file);
  }
  if (chunkFiles.length === 1) {
    await fs.copyFile(chunkFiles[0], target);
    return;
  }
  const concatFile = path.join(chunkDir, 'chunks.txt');
  await fs.writeFile(concatFile, chunkFiles.map((file) => `file '${file.replace(/\\/g, '/')}'`).join('\n'), 'utf8');
  await run(ffmpegInstaller.path, ['-y', '-f', 'concat', '-safe', '0', '-i', concatFile, '-c', 'copy', target]);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function apiLogin() {
  const response = await fetch(`${appUrl}/api/auth/login`, {
    method: 'POST',
    headers: { Authorization: basicAuth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error(`Login failed: ${response.status}`);
  const cookie = response.headers.get('set-cookie')?.split(';')[0] || '';
  if (!cookie) throw new Error('Login did not return a session cookie.');
  return cookie;
}

async function apiFetch(cookie, endpoint, options = {}) {
  const response = await fetch(`${appUrl}${endpoint}`, {
    ...options,
    headers: {
      Authorization: basicAuth,
      Cookie: cookie,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(`${endpoint} failed ${response.status}: ${text}`);
  return data;
}

async function createFlowRecords(cookie) {
  await apiFetch(cookie, '/api/customers', {
    method: 'POST',
    body: JSON.stringify({ id: ids.customer, name: demo.customer, notes: 'عميل تدريبي لفيديو شرح دورة التشغيل' }),
  });
  await apiFetch(cookie, '/api/pricings', {
    method: 'POST',
    body: JSON.stringify({
      id: ids.pricing,
      pricing_number: pricingNumber,
      customer_id: ids.customer,
      pricing_date: today,
      fabric_type: demo.fabric,
      material_type: 'قطن',
      dyehouse: demo.dyehouse,
      color_class: 'غوامق - مفتوح',
      quantity: demo.quantity,
      inch_width: demo.inch,
      finished_weight: demo.finishedWeight,
      raw_cost: demo.rawCost,
      dye_cost: demo.dyeCost,
      waste_percent: 6.7,
      extra_cost: 0,
      profit_per_kg: demo.profit,
      unit_price: demo.unitPrice,
      total_price: demo.unitPrice * demo.quantity,
      payment_terms: 'كاش',
      notes: 'تسعيرة تدريبية لشرح التشغيل فقط',
      status: 'draft',
    }),
  });
}

async function convertPricingToOrder(cookie) {
  await apiFetch(cookie, `/api/pricings/${ids.pricing}`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'converted' }),
  });
  await apiFetch(cookie, '/api/orders', {
    method: 'POST',
    body: JSON.stringify({
      id: ids.order,
      order_number: orderNumber,
      pricing_id: ids.pricing,
      customer_id: ids.customer,
      order_date: today,
      product_code: `2B-${orderNumber}`,
      fabric_type: demo.fabric,
      total_raw_quantity: demo.quantity,
      expected_waste_percent: 6.7,
      width_mode: 'single',
      width_lines_json: JSON.stringify([]),
      inch_width: demo.inch,
      kilo_price: demo.unitPrice,
      raw_cost: demo.rawCost,
      payment_terms: 'كاش',
      accessory_type: '',
      accessory_percent: 0,
      accessory_lines_json: JSON.stringify([]),
      dyehouse: demo.dyehouse,
      weaving_source: demo.weavingSource,
      notes: 'طلب تدريبي لفيديو شرح دورة التشغيل من التسعير حتى تسليم العميل',
      status: 'pending',
      is_closed: 0,
    }),
  });
}

async function addAllocation(cookie) {
  await apiFetch(cookie, `/api/orders/${ids.order}/allocations`, {
    method: 'POST',
    body: JSON.stringify({
      id: ids.allocation,
      color: demo.color,
      pantone_code: '',
      planned_quantity: demo.quantity,
      dyehouse: demo.dyehouse,
      width_line_id: '',
      raw_inch: demo.inch,
      raw_width: demo.width,
      finished_width: demo.width,
      finished_weight: demo.finishedWeight,
      accessory_quantity_manual: null,
      notes: 'لون تدريبي واحد لتوضيح الدورة',
    }),
  });
}

async function addRawOut(cookie) {
  await apiFetch(cookie, '/api/batches/dyehouse', {
    method: 'POST',
    body: JSON.stringify({
      id: ids.raw,
      order_id: ids.order,
      allocation_id: ids.allocation,
      batch_date: today,
      quantity: demo.quantity,
      dyehouse: demo.dyehouse,
      width_line_id: '',
      note_number: `RAW-${stamp.slice(-4)}`,
      notes: 'خروج خام تدريبي للمصبغة',
      source_document_json: null,
    }),
  });
}

async function addFinished(cookie) {
  await apiFetch(cookie, '/api/batches/finished', {
    method: 'POST',
    body: JSON.stringify({
      id: ids.finished,
      order_id: ids.order,
      allocation_id: ids.allocation,
      batch_date: today,
      quantity: demo.finishedQuantity,
      finished_width: demo.width,
      finished_weight: demo.finishedWeight,
      note_number: `FIN-${stamp.slice(-4)}`,
      notes: 'استلام مجهز تدريبي',
      source_document_json: null,
    }),
  });
}

async function addCustomerDelivery(cookie) {
  await apiFetch(cookie, '/api/batches/customer', {
    method: 'POST',
    body: JSON.stringify({
      id: ids.customerDelivery,
      order_id: ids.order,
      allocation_id: ids.allocation,
      batch_date: today,
      quantity: demo.deliveredQuantity,
      notes: 'تسليم تدريبي كامل للعميل',
      source_document_json: null,
    }),
  });
}

async function openAppPage(page) {
  await page.authenticate({ username, password });
  await page.goto(appUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  if (page.url().includes('/login')) {
    await page.type('#username', username);
    await page.type('#password', password);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
      page.click('button[type="submit"]'),
    ]);
  }
  await page.waitForSelector('#searchInput', { timeout: 60000 });
}

async function addOverlay(page, title) {
  await page.evaluate((text) => {
    document.querySelector('[data-training-overlay]')?.remove();
    const overlay = document.createElement('div');
    overlay.dataset.trainingOverlay = '1';
    overlay.textContent = text;
    overlay.style.cssText = [
      'position:fixed',
      'z-index:999999',
      'left:28px',
      'top:22px',
      'direction:rtl',
      'background:rgba(7,20,42,.92)',
      'color:#fff',
      'border:2px solid #d3a93f',
      'border-radius:14px',
      'padding:14px 20px',
      'font:800 25px Segoe UI,Tahoma,sans-serif',
      'box-shadow:0 12px 32px rgba(0,0,0,.28)',
    ].join(';');
    document.body.appendChild(overlay);
  }, title);
}

async function filterPricingRow(page) {
  await page.evaluate((pricingNo) => {
    document.body.classList.add('workspace-open');
    document.querySelectorAll('#pricingTableBody tr').forEach((row) => {
      row.style.display = row.textContent.includes(pricingNo) ? '' : 'none';
    });
    document.querySelector('.pricing-panel')?.scrollIntoView({ block: 'start' });
  }, pricingNumber);
  await sleep(600);
}

async function openOrder(page) {
  await page.evaluate((orderNo, orderId) => {
    document.body.classList.add('workspace-open');
    const input = document.querySelector('#searchInput');
    if (input) {
      input.value = orderNo;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    document.querySelector(`button[data-view="${orderId}"]`)?.click();
  }, orderNumber, ids.order);
  await sleep(1000);
  await page.evaluate(() => document.querySelector('#orderDetailsPanel')?.scrollIntoView({ block: 'start' }));
  await sleep(400);
}

async function capture(page, fileName, title, mode = 'order') {
  if (mode === 'pricing') await filterPricingRow(page);
  if (mode === 'order') await openOrder(page);
  if (mode === 'list') {
    await page.evaluate((orderNo) => {
      document.body.classList.add('workspace-open');
      const input = document.querySelector('#searchInput');
      if (input) {
        input.value = orderNo;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      document.querySelector('#ordersTableBody')?.scrollIntoView({ block: 'center' });
    }, orderNumber);
    await sleep(700);
  }
  await addOverlay(page, title);
  await page.screenshot({ path: path.join(captureDir, fileName), fullPage: false });
}

function slideHtml(slide, index, imageData) {
  const bullets = slide.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <style>
    *{box-sizing:border-box}
    body{margin:0;width:1920px;height:1080px;background:#07111f;color:#07142a;font-family:"Segoe UI",Tahoma,Arial,sans-serif;overflow:hidden}
    .page{position:absolute;inset:48px;border-radius:28px;background:#f8fafc;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.35)}
    .header{height:112px;background:#07142a;color:white;display:flex;align-items:center;justify-content:space-between;padding:0 64px;direction:ltr}
    .brand{font-size:44px;font-weight:900}.tag{font-size:22px;color:#d3a93f;font-weight:900}
    .content{display:grid;grid-template-columns:530px 1fr;gap:34px;padding:34px;height:872px;direction:rtl}
    .panel{border-left:8px solid #d3a93f;padding:24px 28px;background:white;border-radius:18px;box-shadow:0 8px 30px rgba(7,20,42,.08)}
    h1{font-size:50px;line-height:1.25;margin:0 0 26px;color:#07142a}
    ul{margin:0;padding:0 28px 0 0;font-size:27px;line-height:1.75;font-weight:800;color:#172033}
    li{margin:12px 0}
    .shot{background:#101820;border-radius:18px;padding:12px;display:grid;place-items:center;box-shadow:0 10px 34px rgba(7,20,42,.18)}
    .shot img{width:100%;max-height:810px;object-fit:contain;border-radius:12px}
    .footer{position:absolute;left:0;right:0;bottom:0;height:48px;background:#07142a;color:white;display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:800;direction:ltr}
  </style>
</head>
<body>
  <main class="page">
    <section class="header"><div class="brand">2B TEX</div><div class="tag">تشغيل فقط - خطوة ${index + 1} من ${slides.length}</div></section>
    <section class="content">
      <aside class="panel"><h1>${escapeHtml(slide.title)}</h1><ul>${bullets}</ul></aside>
      <div class="shot"><img src="${imageData}" alt=""></div>
    </section>
    <div class="footer">2B Tex Operational Flow Training - ${orderNumber}</div>
  </main>
</body>
</html>`;
}

async function renderSlides(chromePath) {
  for (let index = 0; index < slides.length; index += 1) {
    const capturePath = path.join(captureDir, slides[index].capture);
    const image = await fs.readFile(capturePath);
    const html = slideHtml(slides[index], index, `data:image/png;base64,${image.toString('base64')}`);
    const htmlPath = path.join(htmlDir, `slide-${String(index + 1).padStart(2, '0')}.html`);
    const pngPath = path.join(slideDir, `slide-${String(index + 1).padStart(2, '0')}.png`);
    await fs.writeFile(htmlPath, html, 'utf8');
    await run(chromePath, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      '--window-size=1920,1080',
      `--screenshot=${pngPath}`,
      `file:///${htmlPath.replace(/\\/g, '/')}`,
    ]);
  }
}

async function renderVideo() {
  const segmentFiles = [];
  await fs.writeFile(finalScript, slides.map((slide, index) => `${index + 1}. ${slide.title}\n${slide.narration}\n`).join('\n'), 'utf8');
  for (let index = 0; index < slides.length; index += 1) {
    const png = path.join(slideDir, `slide-${String(index + 1).padStart(2, '0')}.png`);
    const mp3 = path.join(audioDir, `slide-${String(index + 1).padStart(2, '0')}.mp3`);
    const segment = path.join(segmentDir, `segment-${String(index + 1).padStart(2, '0')}.mp4`);
    await saveArabicTts(slides[index].narration, mp3, index);
    const duration = Math.max(await probeDuration(mp3) + 0.7, 6);
    await run(ffmpegInstaller.path, [
      '-y',
      '-loop', '1',
      '-framerate', '30',
      '-i', png,
      '-i', mp3,
      '-t', duration.toFixed(2),
      '-vf', 'scale=1920:1080,format=yuv420p',
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-c:a', 'aac',
      '-b:a', '160k',
      '-shortest',
      segment,
    ]);
    segmentFiles.push(segment);
  }
  const concatFile = path.join(outDir, 'segments.txt');
  await fs.writeFile(concatFile, segmentFiles.map((file) => `file '${file.replace(/\\/g, '/')}'`).join('\n'), 'utf8');
  await run(ffmpegInstaller.path, ['-y', '-f', 'concat', '-safe', '0', '-i', concatFile, '-c', 'copy', finalVideo]);
}

async function main() {
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(captureDir, { recursive: true });
  await fs.mkdir(slideDir, { recursive: true });
  await fs.mkdir(htmlDir, { recursive: true });
  await fs.mkdir(audioDir, { recursive: true });
  await fs.mkdir(segmentDir, { recursive: true });

  const chromePath = await findChrome();
  const cookie = await apiLogin();
  await createFlowRecords(cookie);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ Authorization: basicAuth });
  await openAppPage(page);
  await capture(page, '01-pricing.png', `تسعيرة تدريبية ${pricingNumber}`, 'pricing');

  await convertPricingToOrder(cookie);
  await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
  await capture(page, '02-order-list.png', `الطلب ظهر بعد تنزيل التسعيرة: ${orderNumber}`, 'list');

  await addAllocation(cookie);
  await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
  await capture(page, '03-allocation.png', 'إضافة اللون والكمية المخططة', 'order');

  await addRawOut(cookie);
  await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
  await capture(page, '04-raw-out.png', 'خروج الخام من النسيج إلى المصبغة', 'order');

  await addFinished(cookie);
  await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
  await capture(page, '05-finished.png', 'استلام المجهز ودخول المخزن', 'order');

  await addCustomerDelivery(cookie);
  await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
  await capture(page, '06-delivered.png', 'تسليم العميل ومراجعة الرصيد', 'order');
  await browser.close();

  await renderSlides(chromePath);
  await renderVideo();
  const stat = await fs.stat(finalVideo);
  const summary = await apiFetch(cookie, `/api/orders/${ids.order}/summary`, { method: 'GET' });
  console.log(JSON.stringify({
    orderNumber,
    finalVideo,
    sizeMb: Math.round(stat.size / 1024 / 1024 * 10) / 10,
    summary,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

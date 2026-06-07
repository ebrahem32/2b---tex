import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'training', 'output');
const frameDir = path.join(outDir, 'frames');
const htmlDir = path.join(outDir, 'html');
const audioDir = path.join(outDir, 'audio');
const segmentDir = path.join(outDir, 'segments');
const finalVideo = path.join(outDir, '2b-tex-training-v2026.06.07.20.mp4');
const finalScript = path.join(outDir, '2b-tex-training-script-v2026.06.07.20.txt');

const slides = [
  {
    title: 'شرح نظام تشغيل 2B Tex',
    subtitle: 'النسخة v2026.06.07.20',
    bullets: [
      'متابعة دورة التشغيل من التسعير حتى تسليم العميل',
      'الحفظ يتم على Railway وقاعدة البيانات مباشرة',
      'GitHub هو المصدر الرسمي للكود والنسخة المعتمدة',
    ],
    narration: 'أهلا بيك في شرح نظام تشغيل تو بي تكس. في الفيديو ده هنمشي على أهم خطوات التعامل مع النظام بعد آخر التعديلات، من أول فتح النظام وحتى متابعة الطلبات والتقارير ودمج الخامات.',
  },
  {
    title: 'فتح النظام والحالة العامة',
    bullets: [
      'سجل الدخول بالمستخدم المخصص لك',
      'راجع لمبة قاعدة البيانات ولمبة واتساب',
      'راجع رقم النسخة ووقت الإصدار أعلى الشاشة',
    ],
    narration: 'أول خطوة بعد فتح النظام هي تسجيل الدخول. بعد الدخول راقب لمبة قاعدة البيانات، لازم تكون خضراء. ولمبة واتساب بتوضح حالة الربط. رقم النسخة ووقت الإصدار ظاهرين أعلى الشاشة عشان نعرف بالضبط إحنا شغالين على أي إصدار.',
  },
  {
    title: 'القوائم المنسدلة',
    bullets: [
      'القوائم تجمع أوامر النظام حسب الوظيفة',
      'أوامر التشغيل منفصلة عن التقارير',
      'الشاشة الرئيسية تفضل هادئة بدون تكرار معلومات',
    ],
    narration: 'القوائم الجديدة معمولة عشان تقلل الزحمة. التشغيل له قائمة، والتقارير لها قائمة منفصلة، والإعدادات والذكاء الاصطناعي لهم أماكن واضحة. الهدف إنك تفتح النظام وتدخل على المهمة المطلوبة مباشرة بدون تكرار أو لخبطة.',
  },
  {
    title: 'التسعير وتحويله لطلب',
    bullets: [
      'سجل بيانات العميل والصنف والكمية والبوصة',
      'اختر طريقة السداد: كاش أو شيكات أو دفعات',
      'بعد اعتماد السعر اضغط تنزيل طلب',
    ],
    narration: 'في مرحلة التسعير، تدخل العميل والصنف والكمية والبوصة وسعر الكيلو وطريقة السداد. عرض السعر المقدم للعميل لا يظهر فيه اسم المصبغة. بعد الاعتماد تضغط تنزيل طلب، فيتحول السعر إلى طلب تشغيل بدون أن يظل مكرر في قائمة التسعيرات.',
  },
  {
    title: 'إنشاء ومراجعة الطلب',
    bullets: [
      'كود الطلب لا يكفي وحده للبحث',
      'البحث يعتمد على رقم الطلب والعميل والصنف',
      'عرض الطلب يفتح صفحة مركزة للطلب فقط',
    ],
    narration: 'عند مراجعة الطلب، ابحث برقم الطلب أو اسم العميل أو الصنف. زر عرض الطلب يفتح صفحة مركزة فيها الطلب وحده، وبعد العرض تظهر أزرار التعديل والحذف في مكان واضح، بدون تكرار نفس البيانات في أكثر من جزء.',
  },
  {
    title: 'دورة التشغيل',
    bullets: [
      'تقسيم الألوان وتحديد الكميات والعروض',
      'استلام الخام من النسيج',
      'إرسال الخام للمصبغة ثم استلام المجهز',
      'دخول المخزن ثم تسليم العميل',
    ],
    narration: 'دورة التشغيل تبدأ بتقسيم الألوان، ثم استلام الخام من النسيج، ثم إرساله للمصبغة، وبعدها استلام المجهز ودخوله المخزن، ثم تسليم العميل. كل حركة يتم حفظها في قاعدة البيانات وتنعكس على رصيد الطلب والحالة.',
  },
  {
    title: 'الإدخال الجماعي',
    bullets: [
      'يمكن إدخال أكثر من لون في نفس الحركة',
      'ينطبق ذلك على الخام والإكسسوارات والتسليم',
      'الهدف تقليل التكرار وتسريع الشغل اليومي',
    ],
    narration: 'الأساس في التشغيل أصبح الإدخال الجماعي. بدل ما تدخل لون وتحفظ ثم تعود للون التالي، تقدر تسجل مجموعة ألوان أو إكسسوارات أو تسليمات مع بعض، وهذا يوفر وقت ويقلل أخطاء الإدخال.',
  },
  {
    title: 'دمج الخامات',
    bullets: [
      'اختر خامتين أو أكثر من رصيد المخزن',
      'اسحب الكميات إلى نفس رقم عملية الدمج',
      'سجل المنتج الناتج فقط',
      'بعد الدمج افتح للمنتج الجديد طلب عادي',
    ],
    narration: 'مرحلة دمج الخامات منفصلة. تختار الخامات من الطلبات الرئيسية وتسحب الكميات المطلوبة إلى رقم عملية دمج واحد. بعد ذلك تسجل المنتج الناتج فقط. لا يوجد رجوع خام ولا تسليم عميل داخل الدمج، لأن المنتج الناتج سينزل له طلب عادي جديد.',
  },
  {
    title: 'التقارير والطباعة',
    bullets: [
      'أوامر التشغيل منفصلة عن تقارير المتابعة',
      'الأرقام تظهر بالإنجليزية لتحسين الطباعة',
      'الإكسسوارات والملاحظات تظهر في مكانها الصحيح',
    ],
    narration: 'التقارير مصممة للطباعة والمتابعة. أوامر التشغيل مثل أمر النسيج وأمر الصباغة منفصلة عن تقارير المتابعة. الأرقام تظهر بالإنجليزية، والخط أغمق، والإكسسوارات والملاحظات تظهر مرة واحدة فقط في مكانها الصحيح.',
  },
  {
    title: 'متابعة الحالات',
    bullets: [
      'واقف في النسيج',
      'خام جاهز للمصبغة',
      'واقف في المصبغة',
      'واقف في المخزن',
      'جاهز للتسليم أو مكتمل',
    ],
    narration: 'حالات الطلب تساعدك تعرف الطلب واقف فين وليه. النظام يحسب هل الطلب واقف في النسيج، أو جاهز للمصبغة، أو داخل المصبغة، أو في المخزن، أو جاهز للتسليم. هذه الحالات مهمة جدا لتقارير المتابعة والذكاء الاصطناعي.',
  },
  {
    title: 'سجل التعديلات والذكاء الاصطناعي',
    bullets: [
      'سجل التعديلات يحفظ الإضافة والتعديل والحذف',
      'مساعد 2B الذكي يقرأ حالة التشغيل',
      'يعطي ملخصات ومخاطر وأولويات متابعة',
    ],
    narration: 'سجل التعديلات يحفظ الحركات المهمة داخل النظام، مثل إضافة أو تعديل أو حذف طلب أو حركة تشغيل. ومساعد تو بي الذكي يعتمد على بيانات التشغيل ليطلع ملخصات ومخاطر وأولويات تساعد الإدارة في المتابعة اليومية.',
  },
  {
    title: 'قاعدة العمل اليومية',
    bullets: [
      'أي حفظ ناجح يجب أن يظل بعد التحديث',
      'أي مشكلة تبدأ بفحص لمبة قاعدة البيانات',
      'اعتمد على Railway كبيئة التشغيل الرسمية',
    ],
    narration: 'قاعدة العمل اليومية بسيطة: أي حركة تحفظها يجب أن تظل موجودة بعد تحديث الصفحة. لو ظهر خلل، راجع حالة الاتصال وقاعدة البيانات. التشغيل والاختبار الرسمي يكون من Railway، والنسخة الرسمية للكود والبيانات المعتمدة على GitHub.',
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
      // try next browser
    }
  }
  throw new Error('No Chrome or Edge executable found for slide rendering.');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapArabic(text, max = 38) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function htmlSlide(slide, index) {
  const bulletHtml = slide.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('');
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      width: 1920px;
      height: 1080px;
      overflow: hidden;
      font-family: "Segoe UI", Tahoma, Arial, sans-serif;
      background: linear-gradient(135deg, #07111f 0%, #0d2438 52%, #f6f7f8 100%);
      color: #07142a;
    }
    .page {
      position: absolute;
      inset: 70px;
      height: 940px;
      border-radius: 34px;
      background: #fbfcfe;
      box-shadow: 0 24px 44px rgba(0, 18, 38, 0.24);
      overflow: hidden;
    }
    .header {
      height: 155px;
      background: #07142a;
      color: white;
      direction: ltr;
      padding: 42px 100px;
      position: relative;
    }
    .brand { font-size: 62px; line-height: 58px; font-weight: 900; }
    .tag { margin-top: 12px; color: #c6d4e2; font-size: 25px; font-weight: 700; }
    .num { position: absolute; top: 60px; right: 82px; color: #d3a93f; font-size: 34px; font-weight: 900; }
    .title { text-align: center; font-size: 72px; line-height: 1.2; font-weight: 900; margin: 48px 120px 4px; }
    .subtitle { text-align: center; font-size: 38px; font-weight: 800; color: #d3a93f; margin-bottom: 24px; direction: ltr; }
    .rule { height: 7px; background: #07142a; margin: 26px 120px 40px; }
    ul { width: 1320px; margin: 0 auto; padding: 0 70px 0 0; font-size: 43px; line-height: 1.62; font-weight: 800; text-align: right; }
    li { margin: 12px 0; padding-right: 10px; }
    .footer {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 75px;
      background: #07142a;
      color: white;
      display: grid;
      place-items: center;
      direction: ltr;
      font-size: 27px;
      font-weight: 800;
    }
  </style>
</head>
<body>
  <main class="page">
    <section class="header">
      <div class="brand">2B TEX</div>
      <div class="tag">WEAVING | DYEING | FINISHING</div>
      <div class="num">${String(index + 1).padStart(2, '0')}</div>
    </section>
    <h1 class="title">${escapeHtml(slide.title)}</h1>
    ${slide.subtitle ? `<div class="subtitle">${escapeHtml(slide.subtitle)}</div>` : ''}
    <div class="rule"></div>
    <ul>${bulletHtml}</ul>
    <div class="footer">2B Tex ERP Training - v2026.06.07.20</div>
  </main>
</body>
</html>`;
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${path.basename(command)} exited with ${code}`));
    });
  });
}

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
  const pieces = [];
  const sentences = String(text).split(/([،.؟!؛])/).reduce((acc, part, index, source) => {
    if (index % 2 === 0) acc.push(`${part}${source[index + 1] || ''}`.trim());
    return acc;
  }, []).filter(Boolean);
  let current = '';
  for (const sentence of sentences) {
    const next = current ? `${current} ${sentence}` : sentence;
    if (next.length <= maxLength) {
      current = next;
      continue;
    }
    if (current) pieces.push(current);
    if (sentence.length <= maxLength) {
      current = sentence;
    } else {
      const words = sentence.split(/\s+/);
      current = '';
      for (const word of words) {
        const candidate = current ? `${current} ${word}` : word;
        if (candidate.length > maxLength && current) {
          pieces.push(current);
          current = word;
        } else {
          current = candidate;
        }
      }
    }
  }
  if (current) pieces.push(current);
  return pieces;
}

function googleTtsUrl(text) {
  const params = new URLSearchParams({
    ie: 'UTF-8',
    q: text,
    tl: 'ar',
    client: 'tw-ob',
  });
  return `https://translate.google.com/translate_tts?${params.toString()}`;
}

async function saveArabicTts(text, target, index) {
  const urls = splitTtsText(text).map((shortText) => ({ shortText, url: googleTtsUrl(shortText) }));
  const chunkDir = path.join(audioDir, `chunks-${String(index + 1).padStart(2, '0')}`);
  await fs.mkdir(chunkDir, { recursive: true });
  const chunkFiles = [];
  for (let chunkIndex = 0; chunkIndex < urls.length; chunkIndex += 1) {
    const file = path.join(chunkDir, `chunk-${String(chunkIndex + 1).padStart(2, '0')}.mp3`);
    await downloadFile(urls[chunkIndex].url, file);
    chunkFiles.push(file);
  }
  if (chunkFiles.length === 1) {
    await fs.copyFile(chunkFiles[0], target);
    return;
  }
  const concatFile = path.join(chunkDir, 'chunks.txt');
  await fs.writeFile(concatFile, chunkFiles.map((file) => `file '${file.replace(/\\/g, '/')}'`).join('\n'), 'utf8');
  await run(ffmpegInstaller.path, [
    '-y',
    '-f', 'concat',
    '-safe', '0',
    '-i', concatFile,
    '-c', 'copy',
    target,
  ]);
}

async function main() {
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(frameDir, { recursive: true });
  await fs.mkdir(htmlDir, { recursive: true });
  await fs.mkdir(audioDir, { recursive: true });
  await fs.mkdir(segmentDir, { recursive: true });
  const chromePath = await findChrome();
  await fs.writeFile(finalScript, slides.map((slide, index) => `${index + 1}. ${slide.title}\n${slide.narration}\n`).join('\n'), 'utf8');

  const segmentFiles = [];
  for (let index = 0; index < slides.length; index += 1) {
    const slide = slides[index];
    const png = path.join(frameDir, `slide-${String(index + 1).padStart(2, '0')}.png`);
    const html = path.join(htmlDir, `slide-${String(index + 1).padStart(2, '0')}.html`);
    const mp3 = path.join(audioDir, `slide-${String(index + 1).padStart(2, '0')}.mp3`);
    const segment = path.join(segmentDir, `segment-${String(index + 1).padStart(2, '0')}.mp4`);
    await fs.writeFile(html, htmlSlide(slide, index), 'utf8');
    await run(chromePath, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      '--window-size=1920,1080',
      `--screenshot=${png}`,
      `file:///${html.replace(/\\/g, '/')}`,
    ]);
    await saveArabicTts(slide.narration, mp3, index);
    const duration = Math.max(await probeDuration(mp3) + 0.6, 5);
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
  await run(ffmpegInstaller.path, [
    '-y',
    '-f', 'concat',
    '-safe', '0',
    '-i', concatFile,
    '-c', 'copy',
    finalVideo,
  ]);

  const stat = await fs.stat(finalVideo);
  console.log(JSON.stringify({ finalVideo, sizeMb: Math.round(stat.size / 1024 / 1024 * 10) / 10 }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

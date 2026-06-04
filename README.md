# نظام 2B Tex للتشغيل والمتابعة

نظام 2B Tex هو برنامج متابعة تشغيل للنسيج والصباغة والتجهيز، بداية من التسعير والطلب وحتى أوامر التشغيل والحركات والتقارير.

## الحالة الحالية

- النسخة الحالية مهيأة للعمل محليًا وعلى Railway.
- الواجهة الرئيسية تعمل من `server.js`.
- الـ Backend يعمل بقاعدة SQLite.
- الواجهة تعتمد على الـ Backend كمصدر أساسي، مع بقاء LocalStorage كاحتياطي عند فشل الاتصال.
- المشروع مرفوع على GitHub:
  `https://github.com/ebrahem32/2b---tex`
- رابط Railway الحالي:
  `https://2b-tex-railway-startjs.up.railway.app`

## التشغيل المحلي

افتح PowerShell من جذر المشروع ثم شغل:

```powershell
$env:SYSTEM_USER="admin"
$env:SYSTEM_PASS="ضع_كلمة_مرور_قوية_هنا"
& "D:\2B Tex نظام التشغيل\whatsapp-service\runtime\node-v20.11.1-win-x64\node.exe" "D:\2B Tex نظام التشغيل\backend\server.js"
& "D:\2B Tex نظام التشغيل\whatsapp-service\runtime\node-v20.11.1-win-x64\node.exe" "D:\2B Tex نظام التشغيل\server.js"
```

ثم افتح:

`http://localhost:3000`

## التشغيل على Railway

Railway يشغل `start.js`، وهو يقوم بتشغيل:

- Backend على المنفذ المحدد في `BACKEND_PORT`.
- Frontend/Proxy على المنفذ المحدد في `PORT`.

متغيرات البيئة المطلوبة:

- `SYSTEM_USER`
- `SYSTEM_PASS`
- `PORT`
- `BACKEND_PORT`
- `DB_PATH`

القيمة المستخدمة حاليًا لقاعدة Railway:

`/data/2btex.sqlite`

## قاعدة البيانات

قاعدة التشغيل الأساسية:

`backend/data/2btex.sqlite`

على Railway يتم استخدام Volume في:

`/data/2btex.sqlite`

ملاحظة مهمة: إذا كانت قاعدة `/data/2btex.sqlite` موجودة بالفعل على Railway فلن يتم استبدالها تلقائيًا عند رفع seed جديد من GitHub. أي تحديث بيانات يجب أن يتم عبر migration أو Backup/Restore آمن.

## الفحص قبل الرفع

لتشغيل فحوصات JavaScript:

```powershell
npm run check
```

GitHub Actions يشغل نفس الفحص عند كل push على الفرع `main`.

## ملفات لا يجب رفعها

- ملفات `.env`
- ملفات logs
- النسخ الاحتياطية
- `whatsapp-service/runtime`
- `whatsapp-service/data`
- أي مفاتيح API أو كلمات مرور

## خدمات إضافية

### واتساب

تشغيل محلي:

`تشغيل خدمة واتساب.bat`

الإرسال التلقائي لا يعمل إلا إذا تم تفعيله وربط الجروبات من إعدادات واتساب.

### A5

خدمة A5 للقراءة فقط. النظام لا يسجل مدفوعات ولا يعدل أرصدة A5.

تشغيل محلي:

`تشغيل خدمة A5.bat`

### مساعد 2B الذكي

تشغيل محلي:

`تشغيل خدمة مساعد 2B الذكي.bat`

يجب ضبط `OPENAI_API_KEY` داخل `ai-service\.env` محليًا فقط.

## النسخ الاحتياطي

قبل أي تعديل كبير:

1. انسخ مجلد المشروع كاملًا.
2. انسخ قاعدة SQLite.
3. احتفظ باسم واضح مثل:
   `backup-before-change-YYYYMMDD-HHMM`

## أشهر الأعطال

- الصفحة لا تفتح: تأكد أن `server.js` يعمل وأن `SYSTEM_USER` و`SYSTEM_PASS` مضبوطين.
- `/api/health` لا يعمل: تأكد أن الـ Backend يعمل.
- بيانات Railway مختلفة: راجع قاعدة `/data/2btex.sqlite` داخل Railway Volume.
- واتساب غير متصل: شغل خدمة واتساب واربط الجروبات.
- AI غير متصل: راجع `OPENAI_API_KEY` وخدمة `ai-service`.

## خطة الرجوع

1. الرجوع إلى آخر commit مستقر.
2. استرجاع SQLite من Backup.
3. إعادة تشغيل الخدمة محليًا أو على Railway.

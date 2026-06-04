# 2B Tex GitHub Ready Status

## الهدف

تهيئة المشروع ليكون GitHub هو مصدر النسخة المعتمدة، مع بقاء البيانات محمية وعدم رفع الأسرار أو ملفات التشغيل المحلية غير الضرورية.

## طريقة التشغيل من GitHub محليًا

1. اسحب المشروع من GitHub.
2. ثبت تبعيات الـ backend:

```powershell
npm install --prefix backend
```

3. اضبط بيانات الدخول كمتغيرات بيئة:

```powershell
$env:SYSTEM_USER="admin"
$env:SYSTEM_PASS="كلمة_مرور_قوية"
```

4. شغل النظام:

```powershell
npm start
```

## Railway

Railway يستخدم:

- `Dockerfile`
- `railway.toml`
- `start.js`

ومتغيرات البيئة المطلوبة:

- `SYSTEM_USER`
- `SYSTEM_PASS`
- `PORT`
- `BACKEND_PORT`
- `DB_PATH`

## قاعدة البيانات

قاعدة seed الحالية المرفوعة:

`backend/data/2btex.sqlite`

على Railway يفضل استخدام Volume في:

`/data/2btex.sqlite`

مهم: GitHub ليس قاعدة بيانات تشغيل حية. أي تعديل يومي يجب أن يكتب في قاعدة Railway/SQLite، ثم يتم أخذ Backup دوري. رفع قاعدة جديدة إلى GitHub يتم فقط بعد اعتمادها كنسخة seed.

## الحماية

- لا يتم رفع `.env`.
- لا يتم رفع كلمات مرور.
- لا يتم رفع logs أو backups أو runtime المحلي.
- Basic Auth يعمل من `SYSTEM_USER` و `SYSTEM_PASS`.

## ملفات محلية لا تدخل في Build

تمت إضافة `.dockerignore` حتى لا يدخل في نشر Railway:

- backups
- logs
- cloudflared.exe
- WhatsApp runtime/session
- ملفات `.env`
- قواعد DB غير معتمدة

## الفحص قبل الرفع

```powershell
npm run check
```

## الخطوة التالية

بعد اعتماد النسخة، يتم عمل Backup لقاعدة Railway وتحميلها محليًا أو رفعها كـ seed جديد عند الحاجة فقط.

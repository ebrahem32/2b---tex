# حالة نظام 2B Tex - 2026-06-04

## ما تم إنجازه

- تم نقل النظام من الاعتماد الكامل على LocalStorage إلى Backend + SQLite.
- تم ربط الواجهة بالـ Backend للقراءة والعرض، مع بقاء LocalStorage كاحتياطي.
- تم رفع المشروع إلى GitHub:
  `https://github.com/ebrahem32/2b---tex`
- تم نشر النظام على Railway:
  `https://2b-tex-railway-startjs.up.railway.app`
- تم تشغيل Frontend و Backend داخل نفس Railway deployment.
- تم تفعيل Basic Auth عبر `SYSTEM_USER` و `SYSTEM_PASS`.
- تم تفعيل Reverse Proxy بحيث تعمل طلبات `/api` من نفس رابط الواجهة.
- تم إصلاح أرصدة الاستيراد الأساسية وظهور التسعيرات المحولة.

## أرقام التشغيل الحالية على Railway

- عدد الطلبات: 61
- عدد العملاء: 18
- الخام المستلم: 69,531.1
- المرسل للمصبغة: 69,531.1
- المجهز المستلم: 31,932.06
- التسعيرات النشطة: 1

## طريقة التشغيل اليدوي محليًا

```powershell
$env:SYSTEM_USER="admin"
$env:SYSTEM_PASS="ضع_كلمة_مرور_قوية_هنا"
& "D:\2B Tex نظام التشغيل\whatsapp-service\runtime\node-v20.11.1-win-x64\node.exe" "D:\2B Tex نظام التشغيل\backend\server.js"
& "D:\2B Tex نظام التشغيل\whatsapp-service\runtime\node-v20.11.1-win-x64\node.exe" "D:\2B Tex نظام التشغيل\server.js"
```

ثم افتح:

`http://localhost:3000`

## طريقة التشغيل التلقائي المحلي

- الملف: `D:\2B Tex نظام التشغيل\start-public-system.ps1`
- يعتمد على Windows Environment Variables:
  - `SYSTEM_USER`
  - `SYSTEM_PASS`
- يحفظ السجلات داخل:
  - `D:\2B Tex نظام التشغيل\logs\backend.log`
  - `D:\2B Tex نظام التشغيل\logs\frontend.log`
  - `D:\2B Tex نظام التشغيل\logs\cloudflared.log`

## Railway

- رابط التشغيل:
  `https://2b-tex-railway-startjs.up.railway.app`
- ملف التشغيل:
  `start.js`
- قاعدة Railway:
  `/data/2btex.sqlite`

## ملفات Backup مهمة

- `D:\backup-before-db-reimport-20260604-195349`
- `D:\backup-before-github-hardening-20260604-200352`
- `D:\backup-before-github-docs-20260604-204744`

## الملفات المعدلة في مرحلة GitHub

- `D:\2B Tex نظام التشغيل\package.json`
- `D:\2B Tex نظام التشغيل\.gitattributes`
- `D:\2B Tex نظام التشغيل\.gitignore`
- `D:\2B Tex نظام التشغيل\.github\workflows\checks.yml`
- `D:\2B Tex نظام التشغيل\README.md`
- `D:\2B Tex نظام التشغيل\CURRENT_STATUS_20260604.md`
- `D:\2B Tex نظام التشغيل\GITHUB_RAILWAY_REVIEW_20260604.md`

## ما لم يكتمل

- إضافة Backup/Export مباشر من قاعدة Railway.
- نقل كل شاشات الإدخال تدريجيًا للـ Backend فقط.
- مراجعة طويلة المدى لطريقة تخزين SQLite على Railway مقارنة بقاعدة بيانات مستضافة.

## الخطوة القادمة المقترحة

إضافة endpoint آمن أو سكريبت لتصدير Backup من `/data/2btex.sqlite` قبل أي تعديلات تشغيل كبيرة.

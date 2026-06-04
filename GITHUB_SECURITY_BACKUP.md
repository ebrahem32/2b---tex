# 2B Tex - GitHub + Backup Security

## الهدف

GitHub يحمل نسخة النظام المعتمدة، بما فيها قاعدة التشغيل `backend/data/2btex.sqlite` عند اعتمادها.

## الحماية

- لا يتم تخزين كلمة مرور الدخول داخل الكود.
- تشغيل النظام يعتمد على:
  - `SYSTEM_USER`
  - `SYSTEM_PASS`
- النسخ الاحتياطية المشفرة تعتمد على:
  - `BACKUP_PASS`

## تشغيل محمي

```powershell
$env:SYSTEM_USER="admin"
$env:SYSTEM_PASS="كلمة-مرور-قوية"
& "D:\2B Tex نظام التشغيل\whatsapp-service\runtime\node-v20.11.1-win-x64\node.exe" "D:\2B Tex نظام التشغيل\server.js"
```

## إنشاء Backup مشفر

```powershell
$env:BACKUP_PASS="كلمة-مرور-قوية-للنسخ"
& "D:\2B Tex نظام التشغيل\backup-system-secure.ps1"
```

المخرجات الافتراضية تحفظ في:

`D:\2B-Tex-Secure-Backups`

## استرجاع Backup

```powershell
$env:BACKUP_PASS="كلمة-مرور-قوية-للنسخ"
& "D:\2B Tex نظام التشغيل\restore-system-secure.ps1" -BackupFile "D:\2B-Tex-Secure-Backups\اسم-الملف.zip.2benc"
```

## ملاحظات مهمة

- لا ترفع ملفات `.env` أو كلمات المرور إلى GitHub.
- الأفضل أن يكون GitHub Repository خاصًا Private طالما قاعدة البيانات مرفوعة.
- النسخة المشفرة على الجهاز هي خط الرجوع إذا حصل خلل في GitHub أو Railway.

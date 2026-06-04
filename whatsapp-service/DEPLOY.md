# دليل نشر WhatsApp Service على Railway

## الخطوات

### 1. إضافة مجلد whatsapp-service فقط إلى GitHub

افتح Terminal أو Git Bash داخل مجلد `whatsapp-service` وشغّل:

```bash
cd "D:\2B Tex نظام التشغيل\whatsapp-service"
git init
git add server.js package.json Dockerfile .dockerignore railway.toml
git commit -m "initial deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

> **ملاحظة:** لا ترفع مجلد `node_modules` أو `runtime` أو `data`.

---

### 2. إنشاء مشروع على Railway

1. افتح [railway.app](https://railway.app) وسجّل دخول
2. اضغط **New Project** ← **Deploy from GitHub repo**
3. اختر الـ repo الذي رفعته
4. Railway سيكتشف الـ `Dockerfile` تلقائيًا

---

### 3. إضافة Volume لحفظ جلسة واتساب

هذه الخطوة **مهمة جدًا** — بدونها ستُفقد جلسة واتساب عند كل إعادة تشغيل.

1. في مشروعك على Railway، اضغط على الـ **Service**
2. اذهب إلى تبويب **Volumes**
3. اضغط **Add Volume**
4. اضبط الإعدادات:
   - **Mount Path**: `/app/data`
5. احفظ — Railway سيعيد تشغيل الخدمة تلقائيًا

---

### 4. الحصول على الرابط العام

1. في تبويب **Settings** ← **Networking**
2. اضغط **Generate Domain**
3. ستحصل على رابط مثل: `https://your-service.up.railway.app`

هذا هو رابط الـ API — استخدمه في باقي نظام 2B Tex بدلاً من `http://127.0.0.1:3020`.

---

### 5. ربط واتساب (QR Code)

عند أول تشغيل، افتح سجلات Railway (تبويب **Logs**) وستجد QR Code — امسحه من تطبيق واتساب على هاتفك.

بعد المسح، تُحفظ الجلسة في الـ Volume ولا تحتاج لتكرارها.

---

## متغيرات البيئة (اختياري)

| المتغير | القيمة الافتراضية | الوصف |
|---------|------------------|-------|
| `PORT` | `3020` | منفذ الخادم (Railway يضبطه تلقائيًا) |
| `DATA_DIR` | `/app/data` | مجلد البيانات والجلسات |
| `REPORTS_DIR` | `/app/data/reports` | مجلد التقارير المرفوعة |
| `PUPPETEER_EXECUTABLE_PATH` | `/usr/bin/chromium` | مسار Chromium (مضبوط في Dockerfile) |

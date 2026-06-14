# Full System Cleanup Review

التاريخ: 2026-06-15  
النسخة المرجعية: v2026.06.15.09  
آخر نسخة مرفوعة عند بدء المراجعة: `99eccbb Unify order form and pricing source flow`  
Tag أمان قبل أي تنظيف: `cleanup-before-current-version`

## الهدف

هذه مراجعة تنظيف فقط حسب ملف `Full System Cleanup Plan.pdf`. لم يتم حذف ملفات، ولم يتم تعديل منطق تشغيل، ولم يتم لمس الحسابات أو قاعدة البيانات.

الهدف من التقرير هو تحديد ما يمكن تنظيفه لاحقًا على مراحل صغيرة وآمنة، وما يجب مراجعته فقط، وما يمنع لمسه بدون موافقة صريحة.

## حالة المستودع عند المراجعة

- عدد الملفات المتتبعة تقريبًا: 99 ملف.
- يوجد تعديل محلي على `backend/data/2btex.sqlite` قبل هذه المراجعة، ولم يتم لمسه أو إضافته إلى Git.
- يوجد ملف محلي غير متتبع `project-memory-pdf-extract.tmp.txt`، ولم يتم حذفه أو إضافته.
- مجلدات التشغيل مثل `node_modules/` و`logs/` ونسخ backup موجودة محليًا ومحمية غالبًا عبر `.gitignore`.

## الملفات التي تم فحصها

| الملف / المنطقة | الغرض الحالي | قرار التنظيف |
|---|---|---|
| `app.js` | منسق الواجهة الرئيسي بعد التقسيم | تنظيف تدريجي فقط |
| `styles.css` | تنسيقات الواجهة | مراجعة selectors قبل أي حذف |
| `index.html` | نقطة تحميل الواجهة والموديولات | مراجعة فقط |
| `documents.js` | بناء المستندات والطباعة | لا ينظف الآن |
| `orders.js` | Domain للطلبات | لا ينظف الآن |
| `pricing.js` | مصدر تسعير غير محمل مباشرة في `index.html` | مراجعة فقط |
| `compat/pricing.js` | نسخة التسعير المحملة فعليًا في `index.html` | لا تحذف الآن |
| `compat/polyfills.js` | Polyfills محملة في `index.html` | لا تحذف الآن |
| `compat/app.js` | ملف توافق قديم غير محمل ظاهرًا | مرشح مراجعة |
| `compat/orders.js` | ملف توافق قديم غير محمل ظاهرًا | مرشح مراجعة |
| `compat/documents.js` | ملف توافق قديم غير محمل ظاهرًا | مرشح مراجعة |
| `backend/server.js` | API وعمليات الحفظ | Review only |
| `backend/calculations.js` | الحسابات الحساسة | Do not touch |
| `backend/data/2btex.sqlite` | قاعدة بيانات التشغيل | Do not touch |
| `ai-service/` | خدمة الذكاء الصناعي | Review only |
| `whatsapp-service/` | خدمة واتساب | Review only |
| `a5-service/` | قراءة أرصدة A5 | Review only |
| ملفات `.bat` و`.ps1` | اختصارات وتشغيل ونسخ احتياطي | Review only |
| `training/output/` | فيديوهات وسكربتات تدريب | Review only |
| `project-memory/` | ذاكرة المشروع | Do not delete |

## خريطة أحجام مهمة

| الملف | الحجم التقريبي |
|---|---:|
| `app.js` | 6210 سطر |
| `backend/server.js` | 2316 سطر |
| `styles.css` | 726 سطر |
| `documents.js` | 378 سطر |
| `orders.js` | 290 سطر |
| `index.html` | 192 سطر |

## Safe To Clean Later

هذه نقاط آمنة نسبيًا للتنظيف لاحقًا لأنها تخص الواجهة أو ملفات مؤقتة، لكن يتم تنفيذها في commits صغيرة مع `npm run check` بعد كل خطوة.

1. إزالة تكرار مفتاح `weavingSource` داخل تحويل كرت التسعير إلى طلب في `app.js`.
   - النوع: Frontend no-op cleanup.
   - السبب: المفتاح مكرر داخل نفس object، والقيمة الثانية تطغى على الأولى.

2. تبسيط بناء صف كرت التسعير في `app.js`.
   - يوجد حقن HTML باستخدام `.replace(...)` لإضافة `weavingSource`.
   - الأفضل لاحقًا تحويله إلى markup مباشر واضح.
   - لا يتم ذلك إلا بعد اختبار تنزيل الطلب من كرت التسعير.

3. تنظيف logs وملفات مؤقتة محلية بعد موافقة صريحة.
   - أمثلة: `logs/`, `local-*.log`, `tmp-server*.log`, `backend/backups/*.log`.
   - هذه ملفات محلية وليست جزءًا من التشغيل.
   - لا يتم حذف `project-memory-pdf-extract.tmp.txt` إلا بتأكيد منفصل.

4. مراجعة selectors القديمة في `styles.css`.
   - أي selector لا يوجد له استخدام في `index.html` أو `app.js` أو `modules/*` يمكن حذفه لاحقًا.
   - يحتاج فحص آلي/يدوي قبل الحذف.

## Review Only

هذه الملفات أو المناطق لا تنظف الآن لأنها قد تكون مرتبطة بالتشغيل أو التوافق أو الاختبارات.

1. ملفات `compat/`
   - `compat/pricing.js` محمل فعليًا في `index.html`، لذلك لا يحذف.
   - `compat/polyfills.js` محمل فعليًا، لذلك لا يحذف.
   - `compat/app.js`, `compat/orders.js`, `compat/documents.js` تبدو غير محملة حاليًا، لكنها تحتاج قرار توافق قبل الحذف.

2. `pricing.js`
   - لا يظهر أنه محمل في `index.html`.
   - قد يكون source أو نسخة غير مفعلة مقابل `compat/pricing.js`.
   - القرار الأفضل لاحقًا: إما توحيد مصدر التسعير أو توثيق سبب وجود نسختين.

3. ملفات التشغيل `.bat` و`.ps1`
   - مثل تشغيل الشبكة، واتساب، A5، النسخ الاحتياطي، DuckDNS.
   - لا تحذف لأنها قد تكون جزءًا من تشغيل المصنع خارج GitHub/Railway.

4. ملفات التدريب في `training/output/`
   - فيديوهات وملفات شرح قد تكون كبيرة.
   - يمكن نقلها لاحقًا إلى release أو أرشيف خارجي، لكن لا تحذف بدون موافقة.

5. `backend/server.js`
   - كبير ومهم، لكن لا يتم تنظيفه الآن.
   - أي تنظيف داخله يحتاج مرحلة Backend Refactor منفصلة.

6. `documents.js` و`orders.js`
   - ملفات منطقية مستخدمة في الواجهة والاختبارات.
   - لا تنظف إلا بعد اكتمال تثبيت منطق كرت التسعير والطلب والطباعة.

7. `package.json` scripts
   - `npm run check` لا يفحص كل ملفات `compat/*` ولا يفحص `pricing.js` بشكل مباشر.
   - يمكن لاحقًا إضافة syntax checks لهذه الملفات كخطوة أمان، قبل حذف أو توحيد أي ملف.

## Do Not Touch Without Explicit Approval

هذه مناطق ممنوع لمسها في تنظيف عادي:

- `backend/calculations.js`
- `backend/data/2btex.sqlite`
- أي schema أو migration أو ملف قاعدة بيانات.
- منطق الهالك.
- منطق رصيد المخزن.
- منطق رصيد المصبغة.
- منطق إغلاق الطلب.
- منطق حساب العميل.
- save flows / rollback / verify persistence.
- auth/session behavior.
- AI backend prompts أو rules.
- WhatsApp outbox/service.
- A5 service.
- `project-memory/` كمصدر ذاكرة.
- ملفات env والنسخ الاحتياطية.

## Potential Unused / Legacy Candidates

هذه ليست قرارات حذف، لكنها نقاط تحتاج تحقق:

| المرشح | السبب | القرار |
|---|---|---|
| `compat/app.js` | لا يظهر محملًا في `index.html` | راجع قبل الحذف |
| `compat/orders.js` | لا يظهر محملًا في `index.html` | راجع قبل الحذف |
| `compat/documents.js` | لا يظهر محملًا في `index.html` | راجع قبل الحذف |
| `pricing.js` | غير محمل مباشرة بينما `compat/pricing.js` مستخدم | توحيد لاحق |
| root docs القديمة `CURRENT_STATUS_20260604.md` و`GITHUB_*` | تبدو توثيق قديم قبل `project-memory` | أرشفة بعد موافقة |
| `training/output/*.mp4` | ملفات كبيرة للتدريب | نقل/أرشفة بعد موافقة |

## Old HTML / CSS Notes

- لا يوجد دليل كافٍ لحذف عناصر HTML الآن.
- بعض حقول التسعير القديمة مخفية أو مستخدمة للتوافق داخل الواجهة.
- أي حذف من `index.html` يجب أن يتم بعد:
  1. بحث عن كل `id`.
  2. فحص `app.js` و`modules/*`.
  3. اختبار إنشاء كرت تسعير.
  4. اختبار تحويل كرت التسعير إلى طلب.
  5. اختبار الطباعة.

## Deletion Risks

1. حذف ملف من `compat/` قد يكسر تحميل الواجهة في الإنتاج.
2. حذف `pricing.js` أو `compat/pricing.js` بدون توحيد قد يكسر كرت التسعير.
3. حذف scripts التشغيل قد يعطل طريقة تشغيل محلية يستخدمها المصنع.
4. حذف ملفات تدريب أو docs قد يفقد مرجع تشغيل مهم.
5. حذف logs أو temp من داخل repo آمن غالبًا، لكن الحذف المحلي الآن غير مطلوب.
6. أي touch على SQLite قد يدخل بيانات اختبار أو يحذف بيانات تشغيلية.

## Ordered Cleanup Plan

### Commit 1: Frontend Tiny No-op Cleanup

- إزالة duplicate `weavingSource`.
- تبسيط حقن markup داخل صف كرت التسعير إن كان واضحًا.
- تشغيل `npm run check`.

### Commit 2: Expand Syntax Safety Checks

- إضافة فحص syntax لـ `pricing.js` وملفات `compat/*.js` المهمة.
- لا تغيير سلوك.
- تشغيل `npm run check`.

### Commit 3: Pricing Source Decision

- تحديد هل المصدر الرسمي هو `pricing.js` أم `compat/pricing.js`.
- توحيد التحميل أو توثيق سبب وجود الاثنين.
- لا حذف قبل الاختبار.

### Commit 4: Remove Confirmed Unused Compat Files

- فقط إذا ثبت أنها غير محملة ولا مستخدمة ولا مطلوبة للتوافق.
- حذف ملف واحد أو مجموعة صغيرة.
- تشغيل `npm run check` واختبار المتصفح.

### Commit 5: CSS / HTML Selector Cleanup

- حذف selectors أو HTML القديم المؤكد فقط.
- اختبار الشاشات: كرت تسعير، طلب، مستندات، مخزن، AI dashboard.

### Commit 6: Docs / Root Archive

- نقل أو أرشفة docs قديمة داخل `project-memory/archive/` بعد موافقة.
- لا حذف مباشر إذا كانت مرجع تاريخي.

### Commit 7: Optional Repo Slimming

- نقل فيديوهات التدريب الكبيرة إلى GitHub Release أو Drive بعد موافقة.
- لا يتم ذلك ضمن تنظيف الكود.

### Backend Cleanup

- مؤجل.
- يبدأ فقط بعد تقرير Backend Architecture منفصل.
- لا يشمل الحسابات أو قاعدة البيانات.

## التوصية

ابدأ التنظيف الفعلي لاحقًا من Commit 1 فقط:

```text
Frontend Tiny No-op Cleanup
```

ولا تبدأ بحذف `compat/` أو ملفات scripts أو أي شيء من backend. هذه المراجعة تؤكد أن التنظيف يجب أن يكون تدريجيًا جدًا، لأن النظام أصبح ERP تشغيليًا وليس مجرد واجهة.

## Execution Update - 2026-06-15

تم تنفيذ الجزء الآمن من الخطة بعد هذه المراجعة على النسخة الحالية:

- `pricing.js` أصبح مصدر التسعير الرسمي المحمل في `index.html`.
- تم حذف النسخة المكررة `compat/pricing.js` بعد إزالة الاعتماد عليها.
- تم حذف ملفات التوافق القديمة غير المحملة:
  - `compat/app.js`
  - `compat/orders.js`
  - `compat/documents.js`
- بقي `compat/polyfills.js` فقط من ملفات التوافق لأنه لا يزال محملًا في `index.html`.
- لم يتم لمس backend أو SQLite أو الحسابات أو خدمات AI/WhatsApp/A5.

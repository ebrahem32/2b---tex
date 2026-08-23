const A5_CONTROL_CENTER_URL = String(process.env.A5_CONTROL_CENTER_URL || 'http://192.168.11.205:3040').replace(/\/$/, '');

const AI_BUSINESS_KNOWLEDGE = Object.freeze({
  identity: {
    company: '2B Tex',
    domain: 'النسيج والصباغة والتجهيز ومتابعة طلبات العملاء',
    assistantRole: 'مساعد تشغيل وتحليل للإدارة؛ يقرأ ولا يخترع أرقامًا ولا ينفذ حركات مالية أو مخزنية من تلقاء نفسه.',
    systems: {
      twoB: 'المصدر التشغيلي للطلبات والألوان والأذون والمصابغ والتسليمات والتقارير.',
      a5: 'المصدر المحاسبي للمشتريات والمخازن والتحويلات والإنتاج والمبيعات وأرصدة الموردين والعملاء.',
    },
  },
  orderLifecycle: [
    'كرت تسعير وعرض سعر ثم قبول العميل وتحويله إلى طلب تشغيل.',
    'استلام أو شراء الخام ثم تسجيل إذن الخام وربطه برقم الإذن والجهة والمصبغة.',
    'توزيع الكمية على الألوان والمصابغ ثم إرسال الخام للمصبغة.',
    'استلام المجهز واحتساب الرصيد داخل المصبغة ورصيد المخزن والتسليم للعميل.',
    'الإغلاق التشغيلي لا يحذف التاريخ؛ الطلب المغلق يختفي من القائمة النشطة فقط.',
  ],
  orderTypes: {
    buyAndSell: '2B تشتري الخام وتتحمل تكلفة الخام والهالك والصباغة ثم تبيع المنتج للعميل.',
    manufacturingOnly: 'الخام ملك العميل؛ لا يضاف سعر خام ولا هالك تسعير على العميل، وتقتصر التكلفة على المصنعية/الصباغة والخدمات.',
  },
  quantityRules: [
    'طلب العميل هو الكمية الصافية المتفق عليها. الخام التشغيلي المطلوب = طلب العميل + الهالك التشغيلي المعتمد.',
    'أمر تشغيل الصباغة يعرض كمية كل لون بعد إضافة الهالك، ولا يعرض تفاصيل معادلة الهالك في النسخة المطبوعة.',
    'الرصيد داخل المصبغة ليس هالكًا. الهالك الفعلي يعتمد فقط بعد مطابقة المرسل والمستلم والمرتجع والتسليم أو عند إغلاق الدورة.',
    'رصيد المخزن يعني مجهزًا فعليًا جاهزًا للتسليم ما لم توجد حركة حجز أو تسليم مسجلة.',
    'كل رصيد خام يجب فصله بالمصبغة ورقم الإذن؛ لا تجمع خام مصبغتين في رصيد واحد.',
  ],
  dyeingAndColors: [
    'يجوز تقسيم الطلب أو الألوان على أكثر من مصبغة، وكل لون/كمية يحمل مصبغته وإذنه.',
    'توزيع الألوان هو المصدر الرسمي لنسب وكميات الديربي والإكسسوارات في أمر التشغيل.',
    'البانتون اختياري؛ يحفظ كما أدخله المستخدم ولا تعاد صياغته بطريقة تغير الرقم، وتخفى خانته وصورته عند عدم وجوده.',
    'صورة اللون تقريبية من اسم اللون وليست مرجع مطابقة معملية أو بديلًا لكرت Pantone رسمي.',
  ],
  accessories: [
    'الأنواع تشمل ريب وريـبس وديربي ولياقات وأساور وغيرها.',
    'يمكن توزيع الإكسسوار بنسبة موحدة لكل الألوان أو بقيمة مختلفة لكل لون، والقيمة قد تكون نسبة مئوية أو كيلوجرامًا.',
    'في أمر الصباغة يظهر بجوار كمية اللون جسم بخط صغير، وتحته نوع الإكسسوار وكميته عند وجوده.',
    'اللياقات والأساور قد تكون بالقطعة ولها طول وعرض مستقلان؛ لا تعامل دائمًا ككيلوجرام.',
  ],
  sizingAndDocuments: [
    'الصنف الواحد قد ينقسم إلى رسائل بوص/عرض/كمية مختلفة مع متابعة مستقلة داخل نفس الطلب.',
    'إضافة صنف تعني صنفًا مختلفًا ورسالة مستقلة، أما اختلاف البوص والعروض فهو توزيع داخل الصنف نفسه.',
    'صيغة أمر تشغيل النسيج المعتمدة ثابتة: مورد النسيج، بيانات التشغيل، ومكونات الخام مثل الجسم والشانيه والريب؛ لا يعاد تصميمها دون طلب صريح.',
  ],
  financialRules: [
    'المركز المالي مرتبط بالطلب والعميل وكرت التكلفة.',
    'تفصل أموال الخام/النسيج عن أموال الصباغة والتجهيز، ثم تعرض التكلفة والبيع والنتيجة الإجمالية.',
    'سعر الخام الموجود في كرت التسعير ينتقل للطلب المرتبط ولا يطلب إدخاله يدويًا مرة ثانية.',
  ],
  a5Integration: {
    principle: 'التكامل طبقة فوق 2B ولا يلغي بنيته. إذا كانت الحركة غير موجودة تضاف، وإذا كانت موجودة تطبق عليها المطابقة دون تكرار.',
    matching: 'ربط الأصناف والطلبات يدوي ومعتمد؛ التشابه النصي اقتراح فقط ولا يعتمد تلقائيًا.',
    mapping: 'كل ربط يتضمن طلب/منتج 2B وصنف الخام في A5 وصنف المجهز في A5 وحساب المورد.',
    categories: { raw: 'منتج قماش', finished: 'منتج الوان' },
    flow: 'فاتورة شراء → المخزن الرئيسي → تحويل لمخزن المصبغة → حركة إنتاج/تحويل → رجوع منتج مجهز للمخزن الرئيسي بعد الهالك → بيع للعميل.',
    deltaAccounts: 'دلتا لها حساب كاش وحساب شيكات. شركة دلتا تكستايل_2 حساب شيكات مخصص وليست موردًا مستقلًا.',
    safety: 'أي حركة ملتبسة أو أكثر من طلب مفتوح لنفس الصنف أو لون غير محدد تذهب للمراجعة ولا تستورد بالتخمين.',
  },
  whatsappAndBackups: [
    'الإرسال قد يكون اختياريًا بموافقة المستخدم أو تلقائيًا حسب الإعداد، ولا يعتبر التقرير مرسلًا إلا بعد تأكيد حالة الخدمة.',
    'النسخ الاحتياطي يحتفظ بآخر 6 أيام؛ قسم F مخصص للنسخ الاحتياطي وأيقونة التشغيل فقط.',
  ],
  answerPolicy: [
    'ابدأ بالنتيجة ثم الدليل: رقم الطلب، العميل، الصنف، المصبغة، رقم الإذن، الكمية، وتاريخ الحركة.',
    'فرّق دائمًا بين مخطط وفعلي، وبين 2B وA5، وبين خام ومجهز.',
    'عند التعارض اذكر المصدرين والفرق واطلب مراجعة الحركة؛ لا تصحح رقمًا بالحدس.',
    'لا تكشف مفاتيح أو كلمات مرور أو مسارات داخلية، ولا تنفذ حذفًا أو قيدًا محاسبيًا من إجابة تحليلية.',
  ],
});

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

async function fetchJson(path, timeoutMs = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${A5_CONTROL_CENTER_URL}${path}`, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function compactA5Link(row = {}) {
  return {
    orderNumber: String(row.twoBOrderNumber || ''),
    twoBCustomer: row.twoBCustomer || '',
    twoBFabric: row.twoBFabric || '',
    rawItem: { code: row.a5RawItemCode || row.a5ItemCode || '', name: row.a5RawItemName || row.a5ItemName || '' },
    finishedItem: { code: row.a5FinishedItemCode || '', name: row.a5FinishedItemName || '' },
    supplierAccount: row.a5SupplierName || row.a5SupplierAccount || '',
    expectedPurchaseUnitPrice: Number(row.expectedPurchaseUnitPrice || 0),
    expectedSaleUnitPrice: Number(row.expectedSaleUnitPrice || 0),
    dyehouse: row.a5Dyehouse || '',
    invoiceNumbers: row.a5InvoiceNumber || '',
    transferIds: safeArray(row.a5TransferIds).slice(0, 30),
    status: row.linkStatus || 'linked',
    note: row.note || '',
    updatedAt: row.updatedAt || row.linkedAt || '',
  };
}

async function buildA5KnowledgeSnapshot() {
  try {
    const [connectors, sync, links] = await Promise.all([
      fetchJson('/api/connectors/status'),
      fetchJson('/api/sync/status'),
      fetchJson('/api/order-links'),
    ]);
    const rows = safeArray(links.rows).map(compactA5Link);
    return {
      available: connectors?.connectors?.a5?.ok === true,
      twoBAvailable: connectors?.connectors?.twoB?.ok === true,
      mode: connectors?.connectors?.mode || links.mode || 'read-only-review',
      sync: {
        enabled: sync?.enabled === true,
        running: sync?.running === true,
        intervalSeconds: Number(sync?.intervalSeconds || 0),
        lastRunAt: sync?.lastRunAt || '',
        lastSuccessAt: sync?.lastSuccessAt || '',
        lastError: sync?.lastError || null,
        imported: Number(sync?.lastResult?.imported || 0),
        duplicates: Number(sync?.lastResult?.duplicates || 0),
        pendingReview: Number(sync?.reviewCount ?? safeArray(sync?.reviews).length),
      },
      linkedOrdersCount: rows.length,
      links: rows.slice(0, 100),
      reviewItems: safeArray(sync?.reviews).slice(0, 30).map((item) => ({
        orderNumber: item.orderNumber || '',
        itemCode: item.itemCode || '',
        documentNumber: item.documentNumber || '',
        date: item.date || '',
        quantity: Number(item.quantity || 0),
        reason: item.reason || '',
      })),
    };
  } catch (error) {
    return {
      available: false,
      twoBAvailable: true,
      mode: 'unavailable',
      sync: { enabled: false, running: false, lastError: error?.message || 'A5 unavailable' },
      linkedOrdersCount: 0,
      links: [],
      reviewItems: [],
    };
  }
}

module.exports = {
  AI_BUSINESS_KNOWLEDGE,
  buildA5KnowledgeSnapshot,
};

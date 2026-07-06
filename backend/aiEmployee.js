const { all, get } = require('./db');
const { calculateOrderSummary } = require('./calculations');

// Factory: the AI employee layer needs two customer helpers that live with the
// audit/repair logic in server.js, so they are injected instead of required.
function createAiEmployee(deps = {}) {
const {
  repairMissingCustomersFromReferences,
  readableCustomerNameFromId,
} = deps;

function now() {
  return new Date().toISOString();
}

function safeJsonParse(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeAiArray(value) {
  return Array.isArray(value) ? value : [];
}

function compactAiPayload(input = {}) {
  const orders = normalizeAiArray(input.orders);
  const outbox = normalizeAiArray(input.reportOutbox);
  const summaryStats = input.summaryStats && typeof input.summaryStats === 'object' ? input.summaryStats : {};
  return {
    summaryStats,
    orders: orders.slice(0, 150).map((order) => {
      const operationallyComplete = Boolean(order.operationallyComplete || order.operationClosed || ['completed', 'closed'].includes(String(order.status || '').toLowerCase()));
      return {
      orderNumber: order.orderNumber,
      customer: order.customer,
      fabricType: order.fabricType,
      dyehouse: order.dyehouse,
      status: operationallyComplete ? 'completed' : order.status,
      operationallyComplete,
      stageInfo: order.stageInfo || null,
      operationClosed: Boolean(order.operationClosed),
      totalRawOrdered: Number(order.totalRawOrdered || 0),
      totalRawReceived: Number(order.totalRawReceived || 0),
      totalSentToDyehouse: Number(order.totalSentToDyehouse || 0),
      totalFinishedReceived: Number(order.totalFinishedReceived || 0),
      rawAtDyehouseAvailable: Number(order.rawAtDyehouseAvailable || 0),
      warehouseBalance: Number(order.warehouseBalance || 0),
      totalDeliveredToCustomer: Number(order.totalDeliveredToCustomer || 0),
      totalWaste: Number(order.totalWaste || 0),
      totalWastePercent: Number(order.totalWastePercent || 0),
      expectedWasteQuantity: Number(order.expectedWasteQuantity || 0),
      expectedWastePercent: Number(order.expectedWastePercent || 0),
      accessoryRequired: Number(order.accessoryRequired || 0),
      accessoryBalance: Number(order.accessoryBalance || 0),
      rawNoteNumbers: normalizeAiArray(order.rawNoteNumbers),
      notes: order.notes || '',
      allocations: normalizeAiArray(order.allocations).map((allocation) => ({
        color: allocation.color,
        dyehouse: allocation.dyehouse,
        plannedQuantity: Number(allocation.plannedQuantity || 0),
        sentToDyehouse: Number(allocation.sentToDyehouse || 0),
        finishedReceived: Number(allocation.finishedReceived || 0),
        remainingAtDyehouse: Number(allocation.remainingAtDyehouse || 0),
        wasteQuantity: Number(allocation.wasteQuantity || 0),
        expectedWasteQuantity: Number(allocation.expectedWasteQuantity || 0),
      })),
    }; }),
    reportOutbox: outbox.slice(0, 100).map((item) => ({
      reportType: item.reportType,
      orderNumber: item.orderNumber,
      customerName: item.customerName,
      targetGroup: item.targetGroup,
      status: item.status,
      errorMessage: item.errorMessage || '',
      createdAt: item.createdAt,
      sentAt: item.sentAt,
    })),
  };
}

function aiFallbackAnalysis(data) {
  const orders = normalizeAiArray(data.orders);
  const outbox = normalizeAiArray(data.reportOutbox);
  const openOrders = orders.filter((order) => !['completed', 'closed'].includes(order.status) && !order.operationClosed);
  const stageGroups = openOrders.reduce((acc, order) => {
    const key = order.stageInfo?.key || 'unknown';
    acc[key] = acc[key] || { count: 0, quantity: 0, label: order.stageInfo?.label || 'غير محدد' };
    acc[key].count += 1;
    acc[key].quantity += Number(order.totalRawOrdered || 0);
    return acc;
  }, {});
  const stageLine = Object.values(stageGroups)
    .sort((a, b) => b.count - a.count)
    .map((item) => `${item.label}: ${item.count} طلب / ${Math.round(item.quantity).toLocaleString('en-US')} كجم`)
    .join('، ') || 'لا توجد طلبات مفتوحة ظاهرة.';
  const atDyehouse = orders.reduce((total, order) => total + Number(order.rawAtDyehouseAvailable || 0), 0);
  const warehouse = orders.reduce((total, order) => total + Number(order.warehouseBalance || 0), 0);
  const unsentRaw = orders.reduce((total, order) => total + Math.max(Number(order.totalRawOrdered || 0) - Number(order.totalRawReceived || 0), 0), 0);
  const failedReports = outbox.filter((item) => item.status === 'failed' || item.status === 'pending');
  const stuckOrderItems = openOrders
    .map((order) => ({
      label: `${order.orderNumber || '-'} - ${order.customer || '-'} - ${order.stageInfo?.label || 'غير محدد'} - واقف ${Number(order.stageInfo?.days || 0)} يوم`,
      days: Number(order.stageInfo?.days || 0),
      quantity: Number(order.totalRawOrdered || 0),
      action: Number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse || 0) > 0
        ? `اتصل بالمصبغة ${order.dyehouse || '-'} لمتابعة ${Math.round(Number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse || 0)).toLocaleString('en-US')} كجم.`
        : (Number(order.warehouseBalance || 0) > 0 ? `نسق تسليم ${Math.round(Number(order.warehouseBalance || 0)).toLocaleString('en-US')} كجم للعميل.` : 'راجع آخر حركة تشغيل وحدد الإجراء التالي.'),
    }))
    .sort((a, b) => (b.days - a.days) || (b.quantity - a.quantity))
    .slice(0, 8);
  const stuckOrders = stuckOrderItems.map((item) => item.label);
  return {
    source: process.env.OPENAI_API_KEY ? 'local-fallback-after-openai-error' : 'local-rules',
    executiveSummary: `يوجد ${orders.length} طلب داخل النظام، منها ${openOrders.length} طلب مفتوح. توزيع الوقوف الحالي: ${stageLine}. رصيد المصبغة ${Math.round(atDyehouse).toLocaleString('en-US')} كجم، ورصيد المخزن ${Math.round(warehouse).toLocaleString('en-US')} كجم. أهم إجراء: ${stuckOrderItems[0] ? `${stuckOrderItems[0].label}. ${stuckOrderItems[0].action}` : 'لا توجد أولوية حرجة الآن.'}`,
    keyFindings: [
      `طلبات مفتوحة: ${openOrders.length}`,
      `خام لم يخرج من النسيج للمصبغة بعد: ${Math.round(unsentRaw).toLocaleString('en-US')} كجم`,
      `رصيد داخل المصابغ: ${Math.round(atDyehouse).toLocaleString('en-US')} كجم، وهذا ليس هالكًا نهائيًا أثناء التشغيل.`,
      `رصيد جاهز أو واقف بالمخزن: ${Math.round(warehouse).toLocaleString('en-US')} كجم`,
      `تقارير واتساب تحتاج متابعة: ${failedReports.length}`,
    ],
    ordersToWatch: stuckOrders,
    risks: [
      atDyehouse > 0 ? 'وجود رصيد داخل المصابغ يحتاج متابعة بتاريخ الإرسال حتى لا يتحول لتأخير غير واضح.' : 'لا يظهر رصيد كبير داخل المصابغ من البيانات الحالية.',
      warehouse > 0 ? 'وجود رصيد بالمخزن يحتاج فلترة حسب العميل وتاريخ دخول المخزن لتحديد أولويات التسليم.' : 'رصيد المخزن الحالي محدود أو غير ظاهر في البيانات المرسلة.',
      failedReports.length ? 'بعض رسائل أو تقارير واتساب لم ترسل أو ما زالت معلقة.' : 'لا توجد مشكلة واضحة في قائمة إرسال التقارير.',
    ],
    recommendations: [
      'ابدأ بالأقدم وقوفا أو الأكبر كمية حسب القائمة الحالية.',
      'راجع أوامر المصبغة التي لها خام مرسل ولم يكتمل استلام المجهز.',
      'راجع رصيد المخزن حسب العميل لتحديد ما يمكن تسليمه اليوم.',
      'لا تغلق أي طلب قبل مطابقة الخام المرسل، المجهز المستلم، التسليم، والمرتجعات.',
    ],
    priorityActions: stuckOrderItems.length
      ? stuckOrderItems.slice(0, 3).map((item) => `${item.label}. ${item.action}`)
      : [
        'فلتر الطلبات على: واقف في المصبغة، وراجع أقدم تاريخ إرسال.',
        'فلتر الطلبات على: واقف في المخزن، ورتب حسب العميل والتاريخ.',
        'راجع قائمة الإرسال لو فيها تقارير معلقة قبل نهاية اليوم.',
      ],
    whatsappMessage: `ملخص 2B: ${orders.length} طلب، المفتوح ${openOrders.length}. رصيد المصابغ ${Math.round(atDyehouse).toLocaleString('en-US')} كجم، رصيد المخزن ${Math.round(warehouse).toLocaleString('en-US')} كجم، خام لم يخرج للمصبغة ${Math.round(unsentRaw).toLocaleString('en-US')} كجم. الأولوية: متابعة أقدم طلبات واقفة في المصبغة والمخزن.`,
  };
}

function buildOperationalEmployeeReport(context = {}) {
  const snapshot = context.factorySnapshot || {};
  const stageGroups = normalizeAiArray(context.stageGroups);
  const priorityOrders = normalizeAiArray(context.priorityOrders);
  const reportOutbox = normalizeAiArray(context.reportOutbox);
  const stageLine = stageGroups.length
    ? stageGroups.map((stage) => `${stage.label}: ${stage.count} طلب / ${Math.round(Number(stage.quantity || 0)).toLocaleString('en-US')} كجم`).join('، ')
    : 'لا توجد طلبات مفتوحة ظاهرة.';
  const watch = priorityOrders
    .filter((order) => !['completed', 'closed'].includes(String(order.status || '').toLowerCase()) && !order.isClosed)
    .slice(0, 12)
    .map((order) => ({
      orderNumber: order.orderNumber || '-',
      customer: order.customer || '-',
      fabricType: order.fabricType || '-',
      dyehouse: order.dyehouse || '-',
      stage: order.stage?.label || '-',
      daysInStage: Number(order.stage?.days || 0),
      reason: operationalDecisionText(order),
      requestedRaw: Number(order.quantities?.totalRequestedQuantity || 0),
      dyehouseBalance: Number(order.quantities?.remainingAtDyehouse || 0),
      warehouseBalance: Number(order.quantities?.warehouseBalance || 0),
    }));
  const failedReports = reportOutbox.filter((item) => ['pending', 'queued', 'failed'].includes(item.status));
  const dyehouseBalance = Math.round(Number(snapshot.dyehouseBalance || 0));
  const warehouseBalance = Math.round(Number(snapshot.warehouseBalance || 0));
  return {
    source: 'railway-operational-rules',
    executiveSummary: `يوجد ${Number(snapshot.ordersCount || 0).toLocaleString('en-US')} طلب داخل النظام، منها ${Number(snapshot.openOrdersCount || 0).toLocaleString('en-US')} طلب مفتوح. توزيع الوقوف الحالي: ${stageLine}. رصيد المصبغة ${dyehouseBalance.toLocaleString('en-US')} كجم، ورصيد المخزن ${warehouseBalance.toLocaleString('en-US')} كجم. أهم إجراء: ${watch[0] ? `طلب ${watch[0].orderNumber} - ${watch[0].customer}: ${watch[0].reason}` : 'لا توجد أولوية حرجة الآن.'}`,
    keyFindings: [
      `طلبات مفتوحة: ${Number(snapshot.openOrdersCount || 0).toLocaleString('en-US')}`,
      `رصيد داخل المصابغ: ${dyehouseBalance.toLocaleString('en-US')} كجم`,
      `رصيد مجهز جاهز للتسليم: ${warehouseBalance.toLocaleString('en-US')} كجم`,
      `مجهز مستلم: ${Math.round(Number(snapshot.finishedReceived || 0)).toLocaleString('en-US')} كجم`,
      `تقارير واتساب تحتاج متابعة: ${failedReports.length}`,
    ],
    ordersToWatch: watch,
    risks: [
      dyehouseBalance > 0 ? 'يوجد رصيد داخل المصابغ يحتاج مراجعة حسب أوامر الاستلام الفعلية.' : 'لا يظهر رصيد مصبغة مفتوح من الحساب التشغيلي.',
      warehouseBalance > 0 ? 'يوجد رصيد مخزن يحتاج خطة تسليم حسب العميل وتاريخ الدخول.' : 'لا يظهر رصيد مخزن مفتوح كبير من الحساب التشغيلي.',
      failedReports.length ? 'بعض رسائل أو تقارير واتساب لم ترسل أو ما زالت معلقة.' : 'لا توجد مشكلة واضحة في قائمة إرسال التقارير.',
    ],
    recommendations: [
      'ابدأ بالأقدم وقوفا أو الأكبر كمية حسب القائمة الحالية.',
      'تابع الطلبات حسب المرحلة المحسوبة من حركات التشغيل، وليس من كمية الخام المرسل فقط.',
      'لا تغلق أي طلب قبل مطابقة المرسل للمصبغة والمستلم مجهز والمرتجع والهالك.',
    ],
    priorityActions: watch.length
      ? watch.slice(0, 3).map((order) => `طلب ${order.orderNumber} - ${order.customer}: ${order.reason}`)
      : [
        'راجع فلتر: واقف في المصبغة للطلبات التي لم يكتمل لها استلام مجهز فعلي.',
        'راجع فلتر: واقف في المخزن للطلبات الجاهزة للتسليم.',
        'راجع قائمة الإرسال لو فيها تقارير معلقة قبل نهاية اليوم.',
      ],
    whatsappMessage: `ملخص 2B: الطلبات المفتوحة ${Number(snapshot.openOrdersCount || 0).toLocaleString('en-US')}. رصيد المصابغ ${dyehouseBalance.toLocaleString('en-US')} كجم، ورصيد المخزن ${warehouseBalance.toLocaleString('en-US')} كجم. الأولوية حسب المرحلة المحسوبة من حركات التشغيل الفعلية.`,
  };
}

function compactOperationalOrder(order = {}) {
  const quantities = order.quantities || {};
  return {
    orderNumber: order.orderNumber || '-',
    customer: order.customer || '-',
    fabricType: order.fabricType || '-',
    dyehouse: order.dyehouse || '-',
    stage: order.stage?.label || '-',
    days: Number(order.stage?.days || 0),
    reason: order.stage?.reason || '-',
    requestedRaw: Number(quantities.totalRequestedQuantity || 0),
    dyehouseBalance: Number(quantities.remainingAtDyehouse || 0),
    warehouseBalance: Number(quantities.warehouseBalance || 0),
    finishedReceived: Number(quantities.totalFinishedReceived || 0),
    delivered: Number(quantities.customerDeliveredQuantity || 0),
    wastePercent: Number(quantities.totalWastePercent || 0),
    action: operationalDecisionText(order),
  };
}

function buildOperationalDashboardReport(context = {}) {
  const snapshot = context.factorySnapshot || {};
  const orders = normalizeAiArray(context.orders)
    .filter((order) => !order.isClosed && !['completed', 'closed'].includes(String(order.status || '').toLowerCase()));
  const delayed = orders
    .filter((order) => Number(order.stage?.days || 0) >= 7)
    .sort((a, b) => Number(b.stage?.days || 0) - Number(a.stage?.days || 0));
  const dyehouse = orders
    .filter((order) => Number(order.quantities?.remainingAtDyehouse || 0) > 0)
    .sort((a, b) => Number(b.quantities?.remainingAtDyehouse || 0) - Number(a.quantities?.remainingAtDyehouse || 0));
  const ready = orders
    .filter((order) => Number(order.quantities?.warehouseBalance || 0) > 0)
    .sort((a, b) => Number(b.quantities?.warehouseBalance || 0) - Number(a.quantities?.warehouseBalance || 0));
  const highWaste = orders
    .filter((order) => Number(order.quantities?.totalWastePercent || 0) >= Math.max(8, Number(order.quantities?.expectedWastePercent || 0) + 2))
    .sort((a, b) => Number(b.quantities?.totalWastePercent || 0) - Number(a.quantities?.totalWastePercent || 0));
  const priority = [...delayed, ...dyehouse, ...ready, ...highWaste]
    .filter((order, index, list) => list.findIndex((candidate) => candidate.id === order.id) === index)
    .slice(0, 12);
  const top = priority[0];
  return {
    source: 'railway-operational-manager',
    executiveSummary: `قراءة تشغيل اليوم: ${Number(snapshot.openOrdersCount || 0).toLocaleString('en-US')} طلب مفتوح، داخل المصابغ ${Math.round(Number(snapshot.dyehouseBalance || 0)).toLocaleString('en-US')} كجم، جاهز للتسليم ${Math.round(Number(snapshot.warehouseBalance || 0)).toLocaleString('en-US')} كجم. أهم إجراء: ${top ? `طلب ${top.orderNumber} - ${top.customer}: ${operationalDecisionText(top)}` : 'لا توجد أولوية حرجة الآن.'}`,
    keyFindings: [
      `طلبات متأخرة: ${delayed.length}`,
      `طلبات بها رصيد داخل المصابغ: ${dyehouse.length}`,
      `طلبات بها رصيد مجهز جاهز للتسليم: ${ready.length}`,
      `طلبات هالكها أعلى من المتوقع: ${highWaste.length}`,
    ],
    ordersToWatch: priority.map(compactOperationalOrder),
    risks: [
      delayed[0] ? `أقدم وقوف: طلب ${delayed[0].orderNumber} - ${delayed[0].customer} منذ ${Number(delayed[0].stage?.days || 0)} يوم في ${delayed[0].stage?.label || '-'}.` : 'لا يوجد وقوف متأخر حسب حد 7 أيام.',
      dyehouse[0] ? `أكبر رصيد مصبغة: طلب ${dyehouse[0].orderNumber} - ${dyehouse[0].customer} / ${Math.round(Number(dyehouse[0].quantities?.remainingAtDyehouse || 0)).toLocaleString('en-US')} كجم داخل ${dyehouse[0].dyehouse || '-'}.` : 'لا يوجد رصيد مصبغة مفتوح.',
      ready[0] ? `أكبر جاهز للتسليم: طلب ${ready[0].orderNumber} - ${ready[0].customer} / ${Math.round(Number(ready[0].quantities?.warehouseBalance || 0)).toLocaleString('en-US')} كجم.` : 'لا يوجد رصيد مجهز جاهز للتسليم.',
    ],
    recommendations: [
      'ابدأ بالأقدم وقوفا ثم الأكبر كمية، وليس بالعروض العامة.',
      'أي رصيد داخل المصبغة يحتاج متابعة باسم المصبغة والكمية الفعلية.',
      'أي رصيد مخزن هو جاهز للتسليم ويحتاج قرار تسليم أو حجز للعميل.',
    ],
    priorityActions: priority.slice(0, 5).map((order) => `طلب ${order.orderNumber} - ${order.customer}: ${operationalDecisionText(order)}`),
    whatsappMessage: `متابعة 2B اليوم: متأخر ${delayed.length}، داخل المصابغ ${dyehouse.length}، جاهز للتسليم ${ready.length}. ${top ? `الأولوية: ${top.orderNumber} - ${top.customer}: ${operationalDecisionText(top)}` : 'لا توجد أولوية حرجة.'}`,
  };
}

function compactAiEmployeeModelPayload(data = {}, rulesBaseline = {}) {
  const focus = data.questionFocus || {};
  const focusedOrders = normalizeAiArray(focus.orders).slice(0, 80).map(compactOperationalOrder);
  const priorityOrders = normalizeAiArray(data.priorityOrders).slice(0, 40).map(compactOperationalOrder);
  const allOrders = normalizeAiArray(data.orders).slice(0, 120).map(compactOperationalOrder);
  return {
    generatedAt: data.generatedAt,
    role: data.role,
    mission: data.mission,
    userRequest: data.userRequest,
    focusInstruction: data.focusInstruction,
    questionFocus: {
      active: Boolean(focus.active),
      keywords: focus.keywords || [],
      intent: focus.intent || {},
      matchesCount: Number(focus.matchesCount || 0),
      orders: focusedOrders,
    },
    factorySnapshot: data.factorySnapshot,
    stageGroups: data.stageGroups,
    dyehouseBalances: normalizeAiArray(data.dyehouseBalances).slice(0, 30),
    priorityOrders,
    orders: focus.active ? focusedOrders : allOrders,
    rulesBaseline,
    responseRules: [
      'أجب كموظف تشغيل داخل 2B Tex وليس كمساعد عام.',
      'لا تستخدم معلومات من خارج البيانات المرسلة.',
      'أي أمر تذكره يجب أن يحتوي على رقم الطلب والعميل والصنف والمرحلة والكمية أو الأيام عند توفرها.',
      'لو السؤال محدد وquestionFocus.active=true لا تخرج عن questionFocus.orders.',
      'لو لا توجد أوامر مطابقة قل ذلك صراحة ولا تعرض أوامر بديلة.',
      'لا تعتبر الرصيد داخل المصبغة هالكا إلا إذا كان الطلب مغلقا أو الهالك مسجل فعليا.',
      'رصيد المخزن هو مجهز جاهز للتسليم.',
    ],
  };
}

function mergeAiEmployeeModelReport(modelReport = {}, rulesBaseline = {}, source = '') {
  return {
    source: source || modelReport.source || rulesBaseline.source || 'ai-model',
    executiveSummary: modelReport.executiveSummary || rulesBaseline.executiveSummary || '',
    keyFindings: normalizeAiArray(modelReport.keyFindings).length ? normalizeAiArray(modelReport.keyFindings) : normalizeAiArray(rulesBaseline.keyFindings),
    ordersToWatch: normalizeAiArray(modelReport.ordersToWatch).length ? normalizeAiArray(modelReport.ordersToWatch) : normalizeAiArray(rulesBaseline.ordersToWatch),
    risks: normalizeAiArray(modelReport.risks).length ? normalizeAiArray(modelReport.risks) : normalizeAiArray(rulesBaseline.risks),
    recommendations: normalizeAiArray(modelReport.recommendations).length ? normalizeAiArray(modelReport.recommendations) : normalizeAiArray(rulesBaseline.recommendations),
    priorityActions: normalizeAiArray(modelReport.priorityActions).length ? normalizeAiArray(modelReport.priorityActions) : normalizeAiArray(rulesBaseline.priorityActions),
    whatsappMessage: modelReport.whatsappMessage || rulesBaseline.whatsappMessage || '',
  };
}

async function runAiEmployeeModelReport(data = {}, rulesBaseline = {}) {
  const payload = compactAiEmployeeModelPayload(data, rulesBaseline);
  if (process.env.GEMINI_API_KEY) {
    try {
      const result = await runGeminiAnalysis(payload);
      return mergeAiEmployeeModelReport(result, rulesBaseline, 'gemini');
    } catch (error) {
      console.warn('[2B Tex] Gemini employee report failed, using operational rules:', error.message);
    }
  }
  if (process.env.OPENAI_API_KEY) {
    try {
      const result = await runOpenAiAnalysis(payload);
      return mergeAiEmployeeModelReport(result, rulesBaseline, 'openai');
    } catch (error) {
      console.warn('[2B Tex] OpenAI employee report failed, using operational rules:', error.message);
    }
  }
  return rulesBaseline;
}

function daysBetween(startValue, endValue = new Date()) {
  const start = startValue ? new Date(startValue) : null;
  const end = endValue instanceof Date ? endValue : new Date(endValue);
  if (!start || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)));
}

function latestDate(rows, ...keys) {
  const dates = [];
  for (const row of rows || []) {
    for (const key of keys) {
      const value = row?.[key];
      if (!value) continue;
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) dates.push(date);
    }
  }
  if (!dates.length) return '';
  return new Date(Math.max(...dates.map((date) => date.getTime()))).toISOString().slice(0, 10);
}

function orderStageForAi(order, summary, movementDates = {}, allocationsCount = 0) {
  if (Number(order.is_closed || 0) === 1) return { key: 'closed', label: 'مغلق', since: movementDates.closed || order.updated_at || order.created_at, reason: 'تم إغلاق الطلب تشغيليًا' };
  if (!allocationsCount) return { key: 'color-planning', label: 'بانتظار توزيع الألوان', since: order.created_at || order.order_date, reason: 'لا توجد خطة ألوان مسجلة' };
  if (summary.remainingRawToReceive > 0) return { key: 'weaving', label: 'واقف في النسيج', since: order.order_date || order.created_at, reason: `متبقي خروج خام للمصبغة ${summary.remainingRawToReceive} كجم` };
  if (summary.remainingNotSentToDyehouse > 0) return { key: 'weaving', label: 'واقف في النسيج', since: movementDates.rawReceived || order.order_date || order.created_at, reason: `خام لم يخرج للمصبغة ${summary.remainingNotSentToDyehouse} كجم` };
  if (summary.gluingBalance > 0) return { key: 'gluing', label: 'واقف في دمج الخامات', since: movementDates.gluing || movementDates.sentToDyehouse || order.order_date || order.created_at, reason: `رصيد خام في دمج الخامات ${summary.gluingBalance} كجم` };
  if (summary.gluedProductBalance > 0) return { key: 'glued-ready', label: 'منتج مدمج جاهز للتسليم', since: movementDates.gluing || movementDates.finishedReceived || order.order_date || order.created_at, reason: `رصيد منتج مدمج ${summary.gluedProductBalance} كجم` };
  if (summary.remainingAtDyehouse > 0) return { key: 'dyehouse', label: 'واقف في المصبغة', since: movementDates.sentToDyehouse || order.order_date || order.created_at, reason: `داخل المصبغة ${summary.remainingAtDyehouse} كجم` };
  if (summary.warehouseBalance > 0) return { key: 'warehouse', label: 'واقف في المخزن', since: movementDates.finishedReceived || order.order_date || order.created_at, reason: `رصيد مخزن ${summary.warehouseBalance} كجم` };
  if (summary.customerRemainingQuantity > 0 && summary.totalFinishedReceived > 0) return { key: 'delivery', label: 'جاهز للتسليم', since: movementDates.finishedReceived || order.order_date || order.created_at, reason: `متبقي للعميل ${summary.customerRemainingQuantity} كجم` };
  return { key: 'completed', label: 'مكتمل فعليًا', since: movementDates.customerDelivered || order.updated_at || order.created_at, reason: 'لا يظهر رصيد تشغيل مفتوح' };
}

function groupSum(rows, key = 'quantity') {
  return (rows || []).reduce((total, row) => total + Number(row?.[key] || 0), 0);
}

function roundAiNumber(value, digits = 2) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return 0;
  const factor = 10 ** digits;
  return Math.round(num * factor) / factor;
}

function aiFormatNumber(value, digits = 2) {
  return roundAiNumber(value, digits).toLocaleString('en-US');
}

function aiIncludesText(haystack = '', needle = '') {
  const normalizedNeedle = normalizeAiSearchText(needle);
  if (!normalizedNeedle) return false;
  return normalizeAiSearchText(haystack).includes(normalizedNeedle);
}

async function buildAiEmployeeContext() {
  await repairMissingCustomersFromReferences();
  const today = new Date();
  const [
    customers,
    orders,
    allocations,
    rawReceivingBatches,
    dyehouseDeliveryBatches,
    finishedReceivingBatches,
    customerDeliveryBatches,
    accessoryBatches,
    rawReturns,
    gluingBatches,
    dyehouseTransfers,
    reportOutbox,
    auditLog,
    customerAccountsRow,
  ] = await Promise.all([
    all('SELECT * FROM customers ORDER BY name'),
    all('SELECT * FROM orders ORDER BY created_at DESC'),
    all('SELECT * FROM order_allocations ORDER BY created_at'),
    all('SELECT * FROM raw_receiving_batches ORDER BY created_at'),
    all('SELECT * FROM dyehouse_delivery_batches ORDER BY created_at'),
    all('SELECT * FROM finished_receiving_batches ORDER BY created_at'),
    all('SELECT * FROM customer_delivery_batches ORDER BY created_at'),
    all('SELECT * FROM accessory_batches ORDER BY created_at'),
    all('SELECT * FROM raw_returns ORDER BY created_at'),
    all('SELECT * FROM gluing_batches ORDER BY created_at'),
    all('SELECT * FROM dyehouse_transfers ORDER BY created_at'),
    all('SELECT * FROM report_outbox ORDER BY created_at DESC LIMIT 100'),
    all('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 80'),
    get('SELECT value_json FROM system_settings WHERE key = ?', ['customerAccounts']),
  ]);
  const customersById = new Map(customers.map((customer) => [customer.id, customer]));
  const ordersById = new Map(orders.map((order) => [order.id, order]));
  const allocationsById = new Map(allocations.map((allocation) => [allocation.id, allocation]));
  const customerAccounts = safeJsonParse(customerAccountsRow?.value_json, {}) || {};
  const byOrder = (rows) => rows.reduce((acc, row) => {
    const key = row.order_id;
    if (!key) return acc;
    acc[key] = acc[key] || [];
    acc[key].push(row);
    return acc;
  }, {});
  const buckets = {
    allocations: byOrder(allocations),
    rawReceivingBatches: byOrder(rawReceivingBatches),
    dyehouseDeliveryBatches: byOrder(dyehouseDeliveryBatches),
    finishedReceivingBatches: byOrder(finishedReceivingBatches),
    customerDeliveryBatches: byOrder(customerDeliveryBatches),
    accessoryBatches: byOrder(accessoryBatches),
    rawReturns: byOrder(rawReturns),
    gluingBatches: byOrder(gluingBatches),
    dyehouseTransfers: byOrder(dyehouseTransfers),
  };

  const orderCards = orders.map((order) => {
    const orderAllocations = buckets.allocations[order.id] || [];
    const summary = calculateOrderSummary(order, {
      rawReceivingBatches: buckets.rawReceivingBatches[order.id] || [],
      dyehouseDeliveryBatches: buckets.dyehouseDeliveryBatches[order.id] || [],
      finishedReceivingBatches: buckets.finishedReceivingBatches[order.id] || [],
      customerDeliveryBatches: buckets.customerDeliveryBatches[order.id] || [],
      rawReturns: buckets.rawReturns[order.id] || [],
      gluingBatches,
    });
    const movementDates = {
      rawReceived: latestDate(buckets.rawReceivingBatches[order.id], 'batch_date', 'created_at'),
      sentToDyehouse: latestDate(buckets.dyehouseDeliveryBatches[order.id], 'batch_date', 'created_at'),
      gluing: latestDate(buckets.gluingBatches[order.id], 'batch_date', 'created_at'),
      finishedReceived: latestDate(buckets.finishedReceivingBatches[order.id], 'batch_date', 'created_at'),
      customerDelivered: latestDate(buckets.customerDeliveryBatches[order.id], 'batch_date', 'created_at'),
    };
    const stage = orderStageForAi(order, summary, movementDates, orderAllocations.length);
    const customer = customersById.get(order.customer_id);
    return {
      id: order.id,
      orderNumber: order.order_number,
      customer: customer?.name || readableCustomerNameFromId(order.customer_id) || '-',
      fabricType: order.fabric_type || '-',
      dyehouse: order.dyehouse || '-',
      orderDate: order.order_date,
      kiloPrice: Number(order.kilo_price || 0),
      status: order.status,
      isClosed: Number(order.is_closed || 0) === 1,
      stage: { ...stage, days: daysBetween(stage.since, today) },
      quantities: summary,
      movementDates,
      allocationsCount: orderAllocations.length,
      colors: orderAllocations.slice(0, 20).map((allocation) => ({
        color: allocation.color || '-',
        dyehouse: allocation.dyehouse || order.dyehouse || '-',
        plannedQuantity: Number(allocation.planned_quantity || 0),
        width: Number(allocation.finished_width || allocation.raw_width || 0),
        weight: Number(allocation.finished_weight || 0),
      })),
      rawNotes: (buckets.rawReceivingBatches[order.id] || []).map((row) => row.note_number).filter(Boolean),
      dyehouseNotes: (buckets.dyehouseDeliveryBatches[order.id] || []).map((row) => row.note_number).filter(Boolean),
      operationNotes: safeJsonParse(order.operation_notes_json, null) || order.notes || '',
      notes: order.notes || '',
    };
  });

  const customerAccountNames = Array.from(new Set([
    ...customers.map((customer) => customer.name),
    ...orderCards.map((order) => order.customer),
    ...customerDeliveryBatches.map((batch) => batch.customer_name),
    ...Object.keys(customerAccounts || {}),
  ].map((name) => String(name || '').trim()).filter(Boolean)));
  const customerAccountSummaries = customerAccountNames.map((customerName) => {
    const account = customerAccounts[customerName] || { openingBalance: 0, payments: [] };
    const payments = Array.isArray(account.payments) ? account.payments : [];
    const orderInvoices = orderCards
      .filter((order) => aiIncludesText(order.customer, customerName) || aiIncludesText(customerName, order.customer))
      .map((order) => {
        const quantity = Number(order.quantities?.customerDeliveredQuantity || 0) || (order.isClosed ? Number(order.quantities?.totalRequestedQuantity || 0) : 0);
        const unitPrice = Number(order.kiloPrice || 0);
        return {
          orderNumber: order.orderNumber,
          date: order.orderDate,
          item: order.fabricType,
          quantity,
          unitPrice,
          amount: roundAiNumber(quantity * unitPrice),
          status: Number(order.quantities?.customerDeliveredQuantity || 0) > 0 ? 'تم التسليم' : (order.isClosed ? 'مغلق تشغيليا' : 'تحت التشغيل'),
        };
      });
    const stockSaleInvoices = customerDeliveryBatches
      .filter((batch) => String(batch.movement || '').trim() === 'finished_sale' && aiIncludesText(batch.customer_name, customerName))
      .map((batch) => {
        const order = ordersById.get(batch.order_id) || {};
        const allocation = allocationsById.get(batch.allocation_id) || {};
        const quantity = Number(batch.quantity || 0);
        const unitPrice = Number(batch.unit_price || order.kilo_price || 0);
        return {
          orderNumber: order.order_number || batch.order_id || '-',
          date: batch.batch_date || batch.created_at,
          item: [order.fabric_type, allocation.color].filter(Boolean).join(' / ') || 'بيع مجهز',
          quantity,
          unitPrice,
          amount: roundAiNumber(Number(batch.total_price || 0) || (quantity * unitPrice)),
          status: 'بيع مجهز من المخزن',
        };
      });
    const invoices = [...orderInvoices, ...stockSaleInvoices].filter((invoice) => Number(invoice.amount || 0) || Number(invoice.quantity || 0));
    const invoiceTotal = roundAiNumber(invoices.reduce((total, invoice) => total + Number(invoice.amount || 0), 0));
    const paymentTotal = roundAiNumber(payments.reduce((total, payment) => total + Number(payment.amount || 0), 0));
    const openingBalance = roundAiNumber(Number(account.openingBalance || 0));
    return {
      customerName,
      openingBalance,
      invoiceTotal,
      paymentTotal,
      balance: roundAiNumber(openingBalance + invoiceTotal - paymentTotal),
      invoices: invoices.slice(-20),
      payments: payments.slice(-20),
    };
  });

  const recentDyehouseTransfers = dyehouseTransfers.map((transfer) => {
    const order = ordersById.get(transfer.order_id) || {};
    const customer = customersById.get(order.customer_id);
    const fromAllocation = allocationsById.get(transfer.from_allocation_id) || {};
    const toAllocation = allocationsById.get(transfer.to_allocation_id) || {};
    const allocation = Object.keys(toAllocation).length ? toAllocation : fromAllocation;
    return {
      id: transfer.id,
      date: transfer.transfer_date || transfer.created_at,
      orderId: transfer.order_id,
      orderNumber: order.order_number || '-',
      customer: customer?.name || readableCustomerNameFromId(order.customer_id) || '-',
      fabricType: order.fabric_type || '-',
      fromDyehouse: transfer.from_dyehouse || '-',
      toDyehouse: transfer.to_dyehouse || '-',
      quantity: Number(transfer.quantity || 0),
      color: allocation.color || '-',
      width: allocation.raw_width || allocation.finished_width || '',
      noteNumber: transfer.note_number || '',
      notes: transfer.notes || '',
      transferType: transfer.from_allocation_id || transfer.to_allocation_id ? 'نقل لون' : 'نقل خام',
    };
  });

  const openOrders = orderCards.filter((order) => !order.isClosed && !['completed', 'closed'].includes(order.status));
  const stageGroups = openOrders.reduce((acc, order) => {
    const key = order.stage.key;
    acc[key] = acc[key] || { key, label: order.stage.label, count: 0, quantity: 0, oldestDays: 0 };
    acc[key].count += 1;
    acc[key].quantity += Number(
      key === 'dyehouse' ? order.quantities.remainingAtDyehouse
        : key === 'warehouse' || key === 'delivery' ? order.quantities.warehouseBalance
          : order.quantities.totalRequestedQuantity
    ) || 0;
    acc[key].oldestDays = Math.max(acc[key].oldestDays, Number(order.stage.days || 0));
    return acc;
  }, {});
  const dyehouseBalances = dyehouseDeliveryBatches.reduce((acc, row) => {
    const dyehouse = row.dyehouse || 'غير محدد';
    acc[dyehouse] = acc[dyehouse] || { dyehouse, sent: 0, finished: 0, balance: 0 };
    acc[dyehouse].sent += Number(row.quantity || 0);
    return acc;
  }, {});
  for (const row of finishedReceivingBatches) {
    const allocation = allocations.find((item) => item.id === row.allocation_id);
    const order = orders.find((item) => item.id === row.order_id);
    const dyehouse = allocation?.dyehouse || order?.dyehouse || 'غير محدد';
    dyehouseBalances[dyehouse] = dyehouseBalances[dyehouse] || { dyehouse, sent: 0, finished: 0, balance: 0 };
    dyehouseBalances[dyehouse].finished += Number(row.quantity || 0);
  }
  Object.values(dyehouseBalances).forEach((row) => { row.balance = Math.max(row.sent - row.finished, 0); });

  return {
    generatedAt: now(),
    role: '2B Tex AI Employee',
    mission: 'متابعة التشغيل اليومي، كشف الوقوف، ترتيب الأولويات، ومساعدة الإدارة برسائل عملية.',
    factorySnapshot: {
      customersCount: customers.length,
      ordersCount: orders.length,
      openOrdersCount: openOrders.length,
      requestedRaw: groupSum(orderCards.map((order) => ({ quantity: order.quantities.totalRequestedQuantity }))),
      rawReceived: groupSum(orderCards.map((order) => ({ quantity: order.quantities.totalRawReceived }))),
      sentToDyehouse: groupSum(orderCards.map((order) => ({ quantity: order.quantities.totalSentToDyehouse }))),
      finishedReceived: groupSum(orderCards.map((order) => ({ quantity: order.quantities.totalFinishedReceived }))),
      warehouseBalance: groupSum(orderCards.map((order) => ({ quantity: order.quantities.warehouseBalance }))),
      dyehouseBalance: groupSum(orderCards.map((order) => ({ quantity: order.quantities.remainingAtDyehouse }))),
      deliveredToCustomers: groupSum(orderCards.map((order) => ({ quantity: order.quantities.customerDeliveredQuantity }))),
      accessoryMovements: accessoryBatches.length,
      rawReturns: groupSum(rawReturns),
      transfersCount: dyehouseTransfers.length,
      pendingWhatsappReports: reportOutbox.filter((item) => ['pending', 'queued', 'failed'].includes(item.status)).length,
    },
    stageGroups: Object.values(stageGroups).sort((a, b) => (b.oldestDays - a.oldestDays) || (b.quantity - a.quantity)),
    priorityOrders: openOrders
      .slice()
      .sort((a, b) => (b.stage.days - a.stage.days) || (b.quantities.totalRequestedQuantity - a.quantities.totalRequestedQuantity))
      .slice(0, 20),
    orders: orderCards,
    dyehouseBalances: Object.values(dyehouseBalances).sort((a, b) => b.balance - a.balance),
    customerAccounts: customerAccountSummaries.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance)),
    dyehouseTransfers: recentDyehouseTransfers.slice(-250).reverse(),
    dyehouseNames: Array.from(new Set([
      ...Object.keys(dyehouseBalances),
      ...recentDyehouseTransfers.flatMap((transfer) => [transfer.fromDyehouse, transfer.toDyehouse]),
    ].map((name) => String(name || '').trim()).filter((name) => name && name !== '-'))).sort((a, b) => a.localeCompare(b, 'ar')),
    recentAudit: auditLog.map((row) => ({
      action: row.action,
      entityType: row.entity_type,
      entityId: row.entity_id,
      note: row.note,
      createdAt: row.created_at,
    })),
    reportOutbox: reportOutbox.map((row) => ({
      reportType: row.report_type,
      orderNumber: row.order_number,
      customerName: row.customer_name,
      targetGroup: row.target_group,
      status: row.status,
      errorMessage: row.error_message || '',
      createdAt: row.created_at,
      sentAt: row.sent_at,
    })),
  };
}

async function runOpenAiAnalysis(data) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: [
            'أنت نموذج ذكاء اصطناعي متخصص في تشغيل 2B Tex للنسيج والصباغة والتجهيز.',
            'حلل النظام من منظور صاحب المصنع: ما الذي واقف؟ واقف من امتى؟ ما سبب الوقوف؟ وما الأولوية اليوم؟',
            'لا تعتبر rawAtDyehouseAvailable أو remainingAtDyehouse هالكًا نهائيًا أثناء التشغيل.',
            'الهالك النهائي يظهر فقط بعد اكتمال أو إغلاق دورة الطلب.',
            'اكتب عربي واضح مختصر وعملي، واعتمد على الأرقام فقط.',
            'إذا كان payload يحتوي على questionFocus.active=true فالإجابة يجب أن تكون عن questionFocus.orders فقط. لا تعرض ملخصًا عامًا للنظام إلا إذا طلب المستخدم ذلك صراحة.',
            'إذا كان questionFocus.active=true و questionFocus.matchesCount=0 فقل بوضوح أنه لا توجد أوامر مطابقة للسؤال ولا تختر أوامر أخرى بديلة.',
            'إذا كان payload يحتوي على rulesBaseline فاعتبره حساب النظام الرسمي، واستخدمه كمرجع أرقام لا يتم تغييره.',
            'دورك إضافة فهم وتشخيص وتوصية تشغيلية فوق rulesBaseline، وليس اختراع طلبات أو كميات جديدة.',
            'لا تذكر أي طلب إلا إذا كان موجودًا داخل questionFocus.orders أو orders أو priorityOrders في payload.',
            'أرجع JSON فقط بالمفاتيح: source, executiveSummary, keyFindings, ordersToWatch, risks, recommendations, priorityActions, whatsappMessage.',
          ].join('\n'),
        },
        { role: 'user', content: JSON.stringify(data) },
      ],
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error?.message || body.message || `OpenAI ${response.status}`);
  const content = body.choices?.[0]?.message?.content || '{}';
  const parsed = JSON.parse(content);
  return {
    source: 'openai',
    executiveSummary: parsed.executiveSummary || '',
    keyFindings: normalizeAiArray(parsed.keyFindings),
    ordersToWatch: normalizeAiArray(parsed.ordersToWatch),
    risks: normalizeAiArray(parsed.risks),
    recommendations: normalizeAiArray(parsed.recommendations),
    priorityActions: normalizeAiArray(parsed.priorityActions),
    whatsappMessage: parsed.whatsappMessage || '',
  };
}

async function runGeminiAnalysis(data) {
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{
          text: [
            'أنت نموذج ذكاء اصطناعي متخصص في تشغيل 2B Tex للنسيج والصباغة والتجهيز.',
            'حلل النظام من منظور صاحب المصنع: ما الذي واقف؟ واقف من امتى؟ ما سبب الوقوف؟ وما الأولوية اليوم؟',
            'لا تعتبر rawAtDyehouseAvailable أو remainingAtDyehouse هالكًا نهائيًا أثناء التشغيل.',
            'الهالك النهائي يظهر فقط بعد اكتمال أو إغلاق دورة الطلب.',
            'اكتب عربي واضح مختصر وعملي، واعتمد على الأرقام فقط.',
            'إذا كان payload يحتوي على questionFocus.active=true فالإجابة يجب أن تكون عن questionFocus.orders فقط. لا تعرض ملخصًا عامًا للنظام إلا إذا طلب المستخدم ذلك صراحة.',
            'إذا كان questionFocus.active=true و questionFocus.matchesCount=0 فقل بوضوح أنه لا توجد أوامر مطابقة للسؤال ولا تختر أوامر أخرى بديلة.',
            'إذا كان payload يحتوي على rulesBaseline فاعتبره حساب النظام الرسمي، واستخدمه كمرجع أرقام لا يتم تغييره.',
            'دورك إضافة فهم وتشخيص وتوصية تشغيلية فوق rulesBaseline، وليس اختراع طلبات أو كميات جديدة.',
            'لا تذكر أي طلب إلا إذا كان موجودًا داخل questionFocus.orders أو orders أو priorityOrders في payload.',
            'أرجع JSON فقط بالمفاتيح: source, executiveSummary, keyFindings, ordersToWatch, risks, recommendations, priorityActions, whatsappMessage.',
          ].join('\n'),
        }],
      },
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
      contents: [{
        role: 'user',
        parts: [{ text: JSON.stringify(data) }],
      }],
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error?.message || body.message || `Gemini ${response.status}`);
  const content = body.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '{}';
  const parsed = JSON.parse(content);
  return {
    source: 'gemini',
    executiveSummary: parsed.executiveSummary || '',
    keyFindings: normalizeAiArray(parsed.keyFindings),
    ordersToWatch: normalizeAiArray(parsed.ordersToWatch),
    risks: normalizeAiArray(parsed.risks),
    recommendations: normalizeAiArray(parsed.recommendations),
    priorityActions: normalizeAiArray(parsed.priorityActions),
    whatsappMessage: parsed.whatsappMessage || '',
  };
}

function normalizeAiSearchText(value = '') {
  return String(value || '')
    .toLowerCase()
    .replace(/[\u0623\u0625\u0622\u0671\u0627]/g, '\u0627')
    .replace(/[\u0629]/g, '\u0647')
    .replace(/[\u0649]/g, '\u064a')
    .replace(/[\u0640]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function aiQuestionKeywords(question = '') {
  const stopWords = new Set([
    '\u0639\u0646', '\u0639\u0644\u0649', '\u0639\u0644\u064a', '\u0641\u064a', '\u0645\u0646', '\u0627\u0644\u0649', '\u0627\u0644\u064a', '\u0643\u0644', '\u0627\u064a\u0647', '\u0627\u064a', '\u0647\u0648', '\u0647\u064a', '\u0645\u0627', '\u0645\u0627\u0630\u0627', '\u062f\u0647', '\u062f\u064a', '\u062f\u0627',
    '\u0627\u0644\u0644\u064a', '\u0627\u0644\u0630\u064a', '\u0627\u0644\u062a\u064a', '\u0645\u064a\u0646', '\u0641\u064a\u0646', '\u0643\u0627\u0645',
    '\u0639\u0627\u064a\u0632', '\u0639\u0627\u0648\u0632', '\u0627\u0631\u064a\u062f', '\u0639\u0627\u064a\u0632\u0647', '\u0631\u0627\u062c\u0639', '\u0634\u0648\u0641', '\u0642\u0648\u0644', '\u0642\u0648\u0644\u064a', '\u0627\u0639\u0631\u0641', '\u0647\u0627\u062a', '\u0627\u0638\u0647\u0631', '\u0628\u064a\u0646', '\u0627\u0639\u0645\u0644',
    '\u062d\u0644\u0644', '\u062a\u062d\u0644\u064a\u0644', '\u062d\u0644\u0644\u064a', '\u062d\u0644\u0644\u0644\u064a', '\u0645\u062a\u0627\u0628\u0639\u0647', '\u0645\u062a\u0627\u0628\u0639\u0629', '\u062a\u0642\u0631\u064a\u0631', '\u062a\u0642\u0627\u0631\u064a\u0631', '\u062d\u0627\u0644\u0647', '\u062d\u0627\u0644\u0629', '\u0648\u0636\u0639', '\u0645\u0648\u0642\u0641', '\u062a\u0641\u0627\u0635\u064a\u0644',
    '\u0627\u0648\u0631\u062f\u0631', '\u0627\u0648\u0631\u062f\u0631\u0627\u062a', '\u0627\u0648\u0631\u062f\u0631\u0627\u062a\u0647', '\u0627\u0648\u0631\u062f\u0631\u0627\u062a\u0647\u0627', '\u0627\u0648\u0631\u062f\u0631\u0627\u062a\u0647\u0645', '\u0637\u0644\u0628', '\u0637\u0644\u0628\u0627\u062a', '\u0627\u0644\u0637\u0644\u0628', '\u0627\u0644\u0627\u0648\u0627\u0645\u0631', '\u0627\u0645\u0631', '\u0627\u0648\u0627\u0645\u0631',
    '\u0627\u0644\u062a\u0634\u063a\u064a\u0644', '\u0639\u0627\u0645', '\u0639\u0627\u0645\u0647', '\u0627\u0644\u0639\u0627\u0645\u0629', '\u0627\u0644\u0646\u0638\u0627\u0645', '\u0627\u0644\u0633\u064a\u0633\u062a\u0645', '2b', '\u062a\u0648', '\u0628\u064a'
  ].map(normalizeAiSearchText));
  const rawWords = normalizeAiSearchText(question).split(/\s+/).filter(Boolean);
  const joined = rawWords.join(' ');
  const keywords = rawWords.filter((word) => word.length >= 2 && !stopWords.has(word));
  const customerLike = [];
  for (let i = 0; i < keywords.length - 1; i += 1) customerLike.push(keywords[i] + ' ' + keywords[i + 1]);
  return Array.from(new Set(customerLike.concat(keywords.filter((word) => !/^\d+$/.test(word) || joined.includes(word)))));
}

function aiQuestionIntent(question = '') {
  const text = normalizeAiSearchText(question);
  const hasAny = (words) => words.some((word) => text.includes(normalizeAiSearchText(word)));
  return {
    dyehouse: hasAny(['مصبغة', 'المصبغة', 'المصابغ', 'الصباغة', 'الصباغه', 'داخل المصبغة', 'واقف في المصبغة']),
    delivery: hasAny(['جاهز للتسليم', 'تسليم', 'تسليمه', 'المخزن', 'رصيد المخزن', 'مخزن']),
    weaving: hasAny(['النسيج', 'خام لم يستلم', 'استلام خام', 'واقف في النسيج']),
    rawReady: hasAny(['خام لم يخرج', 'لم يرسل', 'لم يتبعت', 'ارسال للمصبغة', 'إرسال للمصبغة']),
    delayed: hasAny(['متاخر', 'متأخر', 'متاخره', 'متأخرة', 'واقف بقاله', 'واقف من زمان', 'اقدم', 'أقدم']),
    waste: hasAny(['هالك', 'الهالك', 'فاقد', 'فرق الكمية']),
    open: hasAny(['مفتوح', 'تحت التشغيل', 'شغال']),
    closed: hasAny(['مغلق', 'مكتمل', 'اتقفل', 'مقفل']),
  };
}

function aiIntentKeywordStopWords() {
  return new Set([
    'مصبغة', 'المصبغة', 'المصابغ', 'الصباغة', 'الصباغه', 'داخل', 'واقف', 'واقفه',
    'جاهز', 'جاهزه', 'للتسليم', 'تسليم', 'مخزن', 'المخزن', 'النسيج', 'خام',
    'متاخر', 'متأخر', 'متاخره', 'متأخرة', 'اقدم', 'أقدم', 'هالك', 'الهالك',
    'مفتوح', 'مغلق', 'مكتمل', 'شغال', 'الطلبات'
  ].map(normalizeAiSearchText));
}

function isAiIntentKeyword(value = '', intentStopWords = aiIntentKeywordStopWords()) {
  const words = normalizeAiSearchText(value).split(/\s+/).filter(Boolean);
  if (!words.length) return false;
  return words.some((word) => {
    const stripped = word.startsWith('ال') ? word.slice(2) : word;
    return intentStopWords.has(word) || intentStopWords.has(stripped);
  });
}

function orderMatchesAiIntent(order = {}, intent = {}) {
  const stageKey = String(order.stage?.key || '');
  const stageLabel = normalizeAiSearchText(order.stage?.label || '');
  const quantities = order.quantities || {};
  const checks = [];
  if (intent.dyehouse) checks.push(stageKey === 'dyehouse' || Number(quantities.remainingAtDyehouse || 0) > 0 || stageLabel.includes('مصبغه'));
  if (intent.delivery) checks.push(stageKey === 'delivery' || stageLabel.includes('تسليم'));
  if (intent.weaving) checks.push(stageKey === 'weaving' || Number(quantities.remainingRawToReceive || 0) > 0 || stageLabel.includes('نسيج'));
  if (intent.rawReady) checks.push(stageKey === 'weaving' || Number(quantities.remainingNotSentToDyehouse || 0) > 0);
  if (intent.delayed) checks.push(Number(order.stage?.days || 0) >= 7);
  if (intent.waste) checks.push(Number(quantities.totalWaste || 0) > 0 || Number(quantities.expectedWasteQuantity || 0) > 0);
  if (intent.open) checks.push(!order.isClosed && !['completed', 'closed'].includes(String(order.status || '')));
  if (intent.closed) checks.push(order.isClosed || ['completed', 'closed'].includes(String(order.status || '')));
  return checks.length ? checks.some(Boolean) : true;
}

function buildAiQuestionFocus(question = '', orders = []) {
  const keywords = aiQuestionKeywords(question);
  const intent = aiQuestionIntent(question);
  const hasIntent = Object.values(intent).some(Boolean);
  const intentStopWords = aiIntentKeywordStopWords();
  const numericKeywords = keywords.filter((word) => /^\d+$/.test(word));
  const textKeywords = keywords.filter((word) => !/^\d+$/.test(word) && !isAiIntentKeyword(word, intentStopWords));
  if (!keywords.length && !hasIntent) return { active: false, keywords: [], matches: [], intent };
  const matches = (orders || []).filter((order) => {
    const fields = [
      order.orderNumber,
      order.customer,
      order.fabricType,
      order.dyehouse,
      order.stage?.label,
      order.stage?.reason,
      order.notes,
      order.operationNotes,
    ];
    const haystack = normalizeAiSearchText(fields.filter(Boolean).join(' '));
    const orderNumber = normalizeAiSearchText(order.orderNumber || '');
    const numericMatch = numericKeywords.length ? numericKeywords.some((word) => orderNumber.includes(word) || haystack.includes(word)) : true;
    const textMatch = textKeywords.length ? textKeywords.some((word) => haystack.includes(word)) : true;
    const intentMatch = orderMatchesAiIntent(order, intent);
    return numericMatch && textMatch && intentMatch;
  });
  return { active: true, keywords, intent, matches };
}

function focusedOrderLine(order = {}) {
  const quantity = Number(order.quantities?.totalRequestedQuantity || 0).toLocaleString('en-US');
  const finished = Number(order.quantities?.totalFinishedReceived || 0).toLocaleString('en-US');
  const balance = Number(order.quantities?.warehouseBalance || 0).toLocaleString('en-US');
  return `${order.orderNumber || '-'} - ${order.customer || '-'} - ${order.fabricType || '-'} - ${order.stage?.label || '-'} منذ ${Number(order.stage?.days || 0)} يوم - ${order.stage?.reason || '-'} - خام ${quantity} كجم - مجهز ${finished} كجم - رصيد مخزن ${balance} كجم`;
}

function operationalDecisionText(order = {}) {
  const quantities = order.quantities || {};
  const stageKey = String(order.stage?.key || '');
  const dyehouseBalance = Number(quantities.remainingAtDyehouse || quantities.rawAtDyehouseAvailable || 0);
  const warehouseBalance = Number(quantities.warehouseBalance || 0);
  const wastePercent = Number(quantities.totalWastePercent || order.totalWastePercent || 0);
  const expectedWaste = Number(quantities.expectedWastePercent || order.expectedWastePercent || 0);
  if (stageKey === 'dyehouse' || dyehouseBalance > 0) {
    const readyNote = warehouseBalance > 0 ? ` ويوجد أيضا ${Math.round(warehouseBalance).toLocaleString('en-US')} كجم جاهز للتسليم.` : '';
    return `اتصل بالمصبغة ${order.dyehouse || '-'} لمتابعة ${Math.round(dyehouseBalance).toLocaleString('en-US')} كجم داخل المصبغة.${readyNote}`;
  }
  if (warehouseBalance > 0) return `نسق تسليم ${Math.round(warehouseBalance).toLocaleString('en-US')} كجم للعميل؛ هذا رصيد مجهز فعلي في المخزن.`;
  if (wastePercent >= Math.max(8, expectedWaste + 2)) return `راجع الهالك ${wastePercent.toLocaleString('en-US', { maximumFractionDigits: 1 })}% قبل اعتماد الإغلاق.`;
  if (stageKey === 'weaving') return 'تابع خروج الخام من النسيج أو سجل الإذن الناقص.';
  return order.stage?.reason || 'راجع آخر حركة تشغيل وحدد الإجراء التالي.';
}

function focusedOrderPriority(order = {}, intent = {}) {
  const quantities = order.quantities || {};
  const stageKey = String(order.stage?.key || '');
  if (intent.dyehouse) return [stageKey === 'dyehouse' ? 1 : 0, Number(quantities.remainingAtDyehouse || 0), Number(order.stage?.days || 0)];
  if (intent.delivery) return [stageKey === 'delivery' ? 1 : 0, Number(quantities.warehouseBalance || 0), Number(order.stage?.days || 0)];
  if (intent.delayed) return [Number(order.stage?.days || 0), Number(quantities.totalRequestedQuantity || 0), Number(quantities.remainingAtDyehouse || 0)];
  return [Number(order.stage?.days || 0), Number(quantities.totalRequestedQuantity || 0), Number(quantities.remainingAtDyehouse || 0)];
}

function compareFocusedOrders(a = {}, b = {}, intent = {}) {
  const left = focusedOrderPriority(a, intent);
  const right = focusedOrderPriority(b, intent);
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const diff = Number(right[index] || 0) - Number(left[index] || 0);
    if (diff) return diff;
  }
  return String(a.orderNumber || '').localeCompare(String(b.orderNumber || ''), 'ar');
}

function buildFocusedEmployeeReport(data = {}) {
  const focus = data.questionFocus || {};
  const intent = focus.intent || {};
  const matches = normalizeAiArray(focus.orders);
  const sortedMatches = matches.slice().sort((a, b) => compareFocusedOrders(a, b, intent));
  const keywords = normalizeAiArray(focus.keywords).join(' ');
  if (!matches.length) {
    return {
      source: 'railway-focused-rules',
      executiveSummary: `لا توجد أوامر مطابقة للسؤال: ${data.userRequest || keywords || '-'}.`,
      keyFindings: [`كلمات البحث: ${keywords || '-'}`, 'لم يتم العثور على طلب أو عميل أو مرحلة مطابقة داخل بيانات Railway الحالية.'],
      ordersToWatch: [],
      risks: ['لو كان الاسم موجودًا بصيغة مختلفة، ابحث بجزء من اسم العميل أو رقم الطلب.'],
      recommendations: ['جرّب البحث برقم الطلب، أو باسم العميل فقط، أو باسم الصنف.'],
      priorityActions: ['لا توجد حركة مطلوبة قبل تحديد طلب مطابق.'],
      whatsappMessage: `لا توجد أوامر مطابقة للسؤال: ${data.userRequest || keywords || '-'}.`,
      userRequest: data.userRequest || '',
    };
  }
  const stageGroups = matches.reduce((acc, order) => {
    const key = order.stage?.label || 'غير محدد';
    acc[key] = acc[key] || { label: key, count: 0, quantity: 0, oldestDays: 0 };
    acc[key].count += 1;
    acc[key].quantity += Number(order.quantities?.totalRequestedQuantity || 0);
    acc[key].oldestDays = Math.max(acc[key].oldestDays, Number(order.stage?.days || 0));
    return acc;
  }, {});
  const stageSummary = Object.values(stageGroups)
    .sort((a, b) => b.oldestDays - a.oldestDays)
    .map((stage) => `${stage.label}: ${stage.count} طلب / ${Math.round(stage.quantity).toLocaleString('en-US')} كجم / أقدم وقوف ${stage.oldestDays} يوم`)
    .join('، ');
  const watch = sortedMatches
    .slice(0, 12)
    .map((order) => ({
      orderNumber: order.orderNumber || '-',
      customer: order.customer || '-',
      fabricType: order.fabricType || '-',
      dyehouse: order.dyehouse || '-',
      stage: order.stage?.label || '-',
      daysInStage: Number(order.stage?.days || 0),
      reason: operationalDecisionText(order),
      requestedRaw: Number(order.quantities?.totalRequestedQuantity || 0),
      finishedReceived: Number(order.quantities?.totalFinishedReceived || 0),
      warehouseBalance: Number(order.quantities?.warehouseBalance || 0),
    }));
  return {
    source: 'railway-focused-rules',
    executiveSummary: `وجدت ${matches.length} أمر مطابق للسؤال. التوزيع الحالي: ${stageSummary || 'غير محدد'}. أهم إجراء: ${operationalDecisionText(sortedMatches[0] || {})}`,
    keyFindings: sortedMatches.slice(0, 10).map(focusedOrderLine),
    ordersToWatch: watch,
    risks: [
      matches.some((order) => Number(order.stage?.days || 0) >= 7) ? 'يوجد أوامر مطابقة واقفة أكثر من 7 أيام وتحتاج متابعة مباشرة.' : 'لا يظهر تأخير كبير في الأوامر المطابقة من مدة الوقوف الحالية.',
      matches.some((order) => Number(order.quantities?.warehouseBalance || 0) > 0) ? 'يوجد رصيد مخزن في بعض الأوامر المطابقة يحتاج خطة تسليم.' : 'لا يظهر رصيد مخزن مفتوح في الأوامر المطابقة.',
    ],
    recommendations: [
      'ابدأ بالأقدم وقوفا أو الأكبر كمية حسب القائمة الحالية.',
      'طابق المرحلة مع آخر حركة تشغيل قبل اتخاذ قرار الإغلاق أو التسليم.',
      'أي رصيد مخزن ظاهر يعتبر جاهزا للتسليم ويحتاج موعدا مع العميل.',
    ],
    priorityActions: watch.slice(0, 3).map((order) => `راجع طلب ${order.orderNumber} - ${order.customer}: ${order.reason}`),
    whatsappMessage: `متابعة ${data.userRequest || keywords}: ${matches.length} أمر مطابق. ${watch.slice(0, 3).map((order) => `${order.orderNumber} ${order.stage} ${order.daysInStage} يوم`).join(' | ')}`,
    userRequest: data.userRequest || '',
  };
}

function aiCommandHasAny(question = '', words = []) {
  const text = normalizeAiSearchText(question);
  return words.some((word) => text.includes(normalizeAiSearchText(word)));
}

function aiCommandSearchTokens(question = '', extraStopWords = []) {
  const stopWords = new Set([
    ...aiQuestionKeywords('').map(normalizeAiSearchText),
    'حساب', 'كشف', 'رصيد', 'عميل', 'العميل', 'فلان', 'حسابات',
    'تحويل', 'تحويلات', 'حول', 'نقل', 'مصابغ', 'مصبغه', 'مصبغة', 'المصبغه', 'المصبغة',
    'واتساب', 'واتس', 'whatsapp', 'ارسل', 'ارسال', 'يبعت', 'ابعت', 'تقرير',
    ...extraStopWords,
  ].map(normalizeAiSearchText));
  return normalizeAiSearchText(question)
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 2 && !stopWords.has(word) && !/^\d+$/.test(word));
}

function aiBestNameMatch(question = '', names = [], extraStopWords = []) {
  const normalizedQuestion = normalizeAiSearchText(question);
  const tokens = aiCommandSearchTokens(question, extraStopWords);
  const scored = (names || [])
    .map((name) => {
      const clean = String(name || '').trim();
      if (!clean) return null;
      const normalizedName = normalizeAiSearchText(clean);
      let score = 0;
      if (normalizedQuestion.includes(normalizedName)) score += 100;
      if (normalizedName.includes(normalizedQuestion)) score += 40;
      for (const token of tokens) {
        if (normalizedName.includes(token)) score += 12;
      }
      return score ? { name: clean, score } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'ar'));
  return scored[0]?.name || '';
}

function buildCustomerAccountCommandReport(context = {}, userRequest = '') {
  const accounts = normalizeAiArray(context.customerAccounts);
  const matchedName = aiBestNameMatch(userRequest, accounts.map((account) => account.customerName));
  if (!matchedName) {
    return {
      source: '2b-operational-query-engine',
      executiveSummary: 'لم أجد عميل مطابق داخل حسابات النظام. اكتب جزء من اسم العميل كما هو مسجل في شاشة العملاء.',
      keyFindings: accounts.slice(0, 8).map((account) => `${account.customerName}: رصيد ${aiFormatNumber(account.balance)} جنيه`),
      ordersToWatch: [],
      risks: ['لو الاسم مكتوب بأكثر من صيغة، راجع شاشة العملاء ووحد الاسم الرسمي.'],
      recommendations: ['اكتب: حساب + اسم العميل، مثال: حساب أمل فاشون.'],
      priorityActions: [],
      whatsappMessage: 'لم أجد عميل مطابق لطلب كشف الحساب.',
      userRequest,
    };
  }
  const account = accounts.find((item) => item.customerName === matchedName) || {};
  const invoices = normalizeAiArray(account.invoices);
  const payments = normalizeAiArray(account.payments);
  return {
    source: '2b-operational-query-engine',
    executiveSummary: `كشف حساب ${matchedName}: الرصيد الحالي ${aiFormatNumber(account.balance)} جنيه. مستحقات ${aiFormatNumber(account.invoiceTotal)} جنيه، مدفوعات ${aiFormatNumber(account.paymentTotal)} جنيه، رصيد افتتاحي ${aiFormatNumber(account.openingBalance)} جنيه.`,
    keyFindings: [
      `عدد فواتير/حركات العميل الظاهرة: ${invoices.length}`,
      `إجمالي المستحقات: ${aiFormatNumber(account.invoiceTotal)} جنيه`,
      `إجمالي المدفوعات: ${aiFormatNumber(account.paymentTotal)} جنيه`,
      `الرصيد الحالي: ${aiFormatNumber(account.balance)} جنيه`,
    ],
    ordersToWatch: invoices.slice(-10).reverse().map((invoice) => ({
      orderNumber: invoice.orderNumber || '-',
      customer: matchedName,
      fabricType: invoice.item || '-',
      reason: `${invoice.status || '-'} / كمية ${aiFormatNumber(invoice.quantity)} / سعر ${aiFormatNumber(invoice.unitPrice)} / إجمالي ${aiFormatNumber(invoice.amount)} جنيه`,
    })),
    risks: Number(account.balance || 0) > 0
      ? [`يوجد رصيد مستحق على ${matchedName} بقيمة ${aiFormatNumber(account.balance)} جنيه.`]
      : ['لا يظهر رصيد مستحق موجب حسب البيانات الحالية.'],
    recommendations: [
      payments.length ? `آخر دفعة مسجلة: ${payments[payments.length - 1]?.date || '-'} / ${aiFormatNumber(payments[payments.length - 1]?.amount)} جنيه.` : 'لا توجد دفعات مسجلة في حساب العميل.',
      'طابق كشف الحساب مع A5 إذا كان العميل له رصيد خارجي قبل الاعتماد النهائي.',
    ],
    priorityActions: Number(account.balance || 0) > 0 ? [`راجع تحصيل ${matchedName} أو أرسل له كشف الحساب.`] : [`راجع آخر تسليمات ${matchedName} للتأكد من عدم وجود حركة غير مسعرة.`],
    whatsappMessage: `كشف حساب ${matchedName}: الرصيد ${aiFormatNumber(account.balance)} جنيه، مستحقات ${aiFormatNumber(account.invoiceTotal)}، مدفوعات ${aiFormatNumber(account.paymentTotal)}.`,
    userRequest,
  };
}

function buildDyehouseTransferCommandReport(context = {}, userRequest = '') {
  const transfers = normalizeAiArray(context.dyehouseTransfers);
  const dyehouseNames = normalizeAiArray(context.dyehouseNames);
  const matchedDyehouse = aiBestNameMatch(userRequest, dyehouseNames);
  const scoped = matchedDyehouse
    ? transfers.filter((transfer) => aiIncludesText(transfer.fromDyehouse, matchedDyehouse) || aiIncludesText(transfer.toDyehouse, matchedDyehouse))
    : transfers;
  const incoming = scoped
    .filter((transfer) => matchedDyehouse && aiIncludesText(transfer.toDyehouse, matchedDyehouse))
    .reduce((total, transfer) => total + Number(transfer.quantity || 0), 0);
  const outgoing = scoped
    .filter((transfer) => matchedDyehouse && aiIncludesText(transfer.fromDyehouse, matchedDyehouse))
    .reduce((total, transfer) => total + Number(transfer.quantity || 0), 0);
  const balanceRows = normalizeAiArray(context.dyehouseBalances)
    .filter((row) => !matchedDyehouse || aiIncludesText(row.dyehouse, matchedDyehouse))
    .sort((a, b) => Number(b.balance || 0) - Number(a.balance || 0));
  return {
    source: '2b-operational-query-engine',
    executiveSummary: matchedDyehouse
      ? `تحويلات ${matchedDyehouse}: عدد ${scoped.length} حركة. داخل إلى ${matchedDyehouse}: ${aiFormatNumber(incoming)} كجم، خارج منها: ${aiFormatNumber(outgoing)} كجم.`
      : `تحويلات المصابغ: عدد ${scoped.length} حركة ظاهرة في النظام. اكتب اسم مصبغة مثل: تحويل جيما لتصفية النتيجة.`,
    keyFindings: [
      ...(matchedDyehouse ? [`المصبغة المطلوبة: ${matchedDyehouse}`, `إجمالي الداخل: ${aiFormatNumber(incoming)} كجم`, `إجمالي الخارج: ${aiFormatNumber(outgoing)} كجم`] : []),
      ...balanceRows.slice(0, 5).map((row) => `${row.dyehouse}: مرسل ${aiFormatNumber(row.sent)} / مستلم ${aiFormatNumber(row.finished)} / رصيد ${aiFormatNumber(row.balance)} كجم`),
    ],
    ordersToWatch: scoped.slice(0, 15).map((transfer) => ({
      orderNumber: transfer.orderNumber || '-',
      customer: transfer.customer || '-',
      fabricType: transfer.fabricType || '-',
      dyehouse: `${transfer.fromDyehouse || '-'} -> ${transfer.toDyehouse || '-'}`,
      reason: `${transfer.transferType || 'تحويل'} / ${transfer.date || '-'} / ${transfer.color || '-'}${transfer.width ? ` عرض ${transfer.width}` : ''} / ${aiFormatNumber(transfer.quantity)} كجم / إذن ${transfer.noteNumber || '-'}`,
    })),
    risks: scoped.length ? [] : ['لا توجد تحويلات مطابقة. لو التحويل موجود في شاشة الطلب، راجع ربط order_id أو allocation_id للحركة.'],
    recommendations: [
      matchedDyehouse ? `راجع رصيد ${matchedDyehouse} بعد التحويلات للتأكد أن الداخل والخارج مطابقان لأوامر التشغيل.` : 'اكتب اسم المصبغة بعد كلمة تحويل للحصول على تقرير مصبغة محددة.',
      'حركات نقل اللون يجب ألا تغير رصيد الخام المادي إلا إذا كانت الحركة نقل خام صريحة.',
    ],
    priorityActions: scoped.slice(0, 3).map((transfer) => `راجع أمر ${transfer.orderNumber} - ${transfer.fromDyehouse} إلى ${transfer.toDyehouse} - ${aiFormatNumber(transfer.quantity)} كجم.`),
    whatsappMessage: matchedDyehouse
      ? `تحويلات ${matchedDyehouse}: داخل ${aiFormatNumber(incoming)} كجم، خارج ${aiFormatNumber(outgoing)} كجم، عدد الحركات ${scoped.length}.`
      : `تحويلات المصابغ: ${scoped.length} حركة. اكتب اسم المصبغة للتفصيل.`,
    userRequest,
  };
}

function buildWhatsappCommandReport(context = {}, userRequest = '') {
  const rows = normalizeAiArray(context.reportOutbox);
  const pending = rows.filter((row) => ['pending', 'queued'].includes(String(row.status || '').toLowerCase()));
  const failed = rows.filter((row) => String(row.status || '').toLowerCase() === 'failed');
  const sent = rows.filter((row) => String(row.status || '').toLowerCase() === 'sent');
  return {
    source: '2b-operational-query-engine',
    executiveSummary: `حالة واتساب من طابور النظام: pending/queued ${pending.length}، failed ${failed.length}، sent ${sent.length}. الاتصال نفسه يتم تشخيصه من إعدادات واتساب لأن الخدمة قد تكون متصلة لكن الإرسال غير مفعل أو الجروب غير مربوط.`,
    keyFindings: [
      `رسائل منتظرة: ${pending.length}`,
      `رسائل فاشلة: ${failed.length}`,
      `رسائل مرسلة: ${sent.length}`,
      ...failed.slice(0, 5).map((row) => `${row.reportType || '-'} / ${row.orderNumber || '-'} / ${row.targetGroup || '-'}: ${row.errorMessage || '-'}`),
    ],
    ordersToWatch: pending.slice(0, 10).map((row) => ({
      orderNumber: row.orderNumber || '-',
      customer: row.customerName || '-',
      dyehouse: row.targetGroup || '-',
      reason: `${row.reportType || '-'} / ${row.status || '-'} / ${row.errorMessage || 'بانتظار الإرسال'}`,
    })),
    risks: failed.length ? ['يوجد تقارير فشلت في الإرسال وتحتاج مراجعة اسم الجروب أو الربط اليدوي.'] : [],
    recommendations: [
      'افتح إعدادات واتساب وتأكد من تفعيل الإرسال التلقائي.',
      'تأكد أن كل مصبغة/عميل/مصدر نسيج مربوط باسم جروب واتساب مطابق.',
      'لو الخدمة متصلة ولا ترسل، راجع رسالة التشخيص الجديدة في لوحة إعدادات واتساب.',
    ],
    priorityActions: failed.slice(0, 3).map((row) => `أعد محاولة ${row.reportType || '-'} للطلب ${row.orderNumber || '-'} بعد تصحيح الجروب ${row.targetGroup || '-'}.`),
    whatsappMessage: `واتساب 2B: pending ${pending.length}، failed ${failed.length}، sent ${sent.length}.`,
    userRequest,
  };
}

function aiOrderDisplayLine(order = {}) {
  const q = order.quantities || {};
  return [
    `طلب ${order.orderNumber || '-'}`,
    order.customer || '-',
    order.fabricType || '-',
    order.dyehouse ? `المصبغة ${order.dyehouse}` : '',
    order.stage?.label ? `${order.stage.label} منذ ${Number(order.stage.days || 0)} يوم` : '',
    `خام مطلوب ${aiFormatNumber(q.totalRequestedQuantity)} كجم`,
    `مرسل للمصبغة ${aiFormatNumber(q.totalSentToDyehouse)} كجم`,
    `داخل المصبغة ${aiFormatNumber(q.remainingAtDyehouse)} كجم`,
    `مخزن ${aiFormatNumber(q.warehouseBalance)} كجم`,
    `مسلم ${aiFormatNumber(q.customerDeliveredQuantity)} كجم`,
    `هالك ${aiFormatNumber(q.totalWaste)} كجم (${aiFormatNumber(q.totalWastePercent, 1)}%)`,
  ].filter(Boolean).join(' - ');
}

function aiOrderWatchRow(order = {}, reason = '') {
  const q = order.quantities || {};
  return {
    orderNumber: order.orderNumber || '-',
    customer: order.customer || '-',
    fabricType: order.fabricType || '-',
    dyehouse: order.dyehouse || '-',
    stage: order.stage?.label || '-',
    daysInStage: Number(order.stage?.days || 0),
    requestedRaw: Number(q.totalRequestedQuantity || 0),
    dyehouseBalance: Number(q.remainingAtDyehouse || 0),
    warehouseBalance: Number(q.warehouseBalance || 0),
    reason: reason || operationalDecisionText(order),
  };
}

function aiExtractNumbers(value = '') {
  return Array.from(new Set(String(value || '').match(/\d+/g) || []));
}

function aiSortByQuantityThenDays(rows = [], quantityGetter = (row) => row.quantities?.totalRequestedQuantity) {
  return rows.slice().sort((a, b) => {
    const quantityDiff = Number(quantityGetter(b) || 0) - Number(quantityGetter(a) || 0);
    if (quantityDiff) return quantityDiff;
    return Number(b.stage?.days || 0) - Number(a.stage?.days || 0);
  });
}

function buildOrderLookupCommandReport(context = {}, userRequest = '') {
  const orders = normalizeAiArray(context.orders);
  const numbers = aiExtractNumbers(userRequest);
  if (!numbers.length) return null;
  const matches = orders.filter((order) => {
    const orderNumber = normalizeAiSearchText(order.orderNumber || '');
    return numbers.some((number) => orderNumber.includes(normalizeAiSearchText(number)));
  });
  if (!matches.length) return {
    source: '2b-operational-query-engine',
    executiveSummary: `لم أجد طلب مطابق للأرقام: ${numbers.join(', ')} داخل بيانات النظام الحالية.`,
    keyFindings: ['اكتب رقم الطلب كما يظهر في لوحة التشغيل أو كرت التسعير.'],
    ordersToWatch: [],
    risks: [],
    recommendations: ['لو الطلب موجود في الشاشة وغير ظاهر هنا، راجع مزامنة Railway أو رقم الطلب الرسمي.'],
    priorityActions: [],
    whatsappMessage: `لم أجد طلب مطابق للأرقام: ${numbers.join(', ')}.`,
    userRequest,
  };
  const totals = matches.reduce((acc, order) => {
    const q = order.quantities || {};
    acc.raw += Number(q.totalRequestedQuantity || 0);
    acc.sent += Number(q.totalSentToDyehouse || 0);
    acc.dyehouse += Number(q.remainingAtDyehouse || 0);
    acc.warehouse += Number(q.warehouseBalance || 0);
    acc.delivered += Number(q.customerDeliveredQuantity || 0);
    acc.waste += Number(q.totalWaste || 0);
    return acc;
  }, { raw: 0, sent: 0, dyehouse: 0, warehouse: 0, delivered: 0, waste: 0 });
  return {
    source: '2b-operational-query-engine',
    executiveSummary: `تقرير طلب ${numbers.join(', ')}: وجدت ${matches.length} بند/صنف. خام مطلوب ${aiFormatNumber(totals.raw)} كجم، مرسل للمصبغة ${aiFormatNumber(totals.sent)} كجم، داخل المصبغة ${aiFormatNumber(totals.dyehouse)} كجم، رصيد مخزن ${aiFormatNumber(totals.warehouse)} كجم، مسلم ${aiFormatNumber(totals.delivered)} كجم، هالك ${aiFormatNumber(totals.waste)} كجم.`,
    keyFindings: matches.map(aiOrderDisplayLine),
    ordersToWatch: matches.map((order) => aiOrderWatchRow(order)),
    risks: matches
      .filter((order) => Number(order.stage?.days || 0) >= 7 || Number(order.quantities?.totalWastePercent || 0) >= 8 || Number(order.quantities?.warehouseBalance || 0) < 0)
      .map((order) => `طلب ${order.orderNumber} - ${order.customer}: ${order.stage?.label || '-'} منذ ${Number(order.stage?.days || 0)} يوم / هالك ${aiFormatNumber(order.quantities?.totalWastePercent, 1)}% / مخزن ${aiFormatNumber(order.quantities?.warehouseBalance)} كجم`),
    recommendations: [
      'راجع مرحلة كل بند من نفس رقم الطلب قبل اتخاذ قرار التسليم أو الإغلاق.',
      'لو الطلب مقسم على أكثر من مصبغة، اعتمد على تقرير التحويلات وخطة الألوان لكل مصبغة.',
      'رصيد المخزن هو فقط الجاهز فعليًا للتسليم، ورصيد المصبغة لا يعتبر هالكًا أثناء التشغيل.',
    ],
    priorityActions: matches.slice(0, 5).map((order) => `طلب ${order.orderNumber} - ${order.customer}: ${operationalDecisionText(order)}`),
    whatsappMessage: `طلب ${numbers.join(', ')}: خام ${aiFormatNumber(totals.raw)} كجم، داخل المصبغة ${aiFormatNumber(totals.dyehouse)} كجم، مخزن ${aiFormatNumber(totals.warehouse)} كجم، مسلم ${aiFormatNumber(totals.delivered)} كجم.`,
    userRequest,
  };
}

function buildDyehouseBalanceCommandReport(context = {}, userRequest = '') {
  const orders = normalizeAiArray(context.orders);
  const dyehouseNames = normalizeAiArray(context.dyehouseNames);
  const matchedDyehouse = aiBestNameMatch(userRequest, dyehouseNames, ['رصيد', 'داخل', 'مصبغة', 'المصبغة']);
  const wantsAnyDyehouse = aiCommandHasAny(userRequest, ['رصيد مصبغة', 'رصيد المصبغة', 'داخل المصبغة', 'داخل المصابغ', 'المصابغ']);
  if (!matchedDyehouse && !wantsAnyDyehouse) return null;
  const rows = orders.filter((order) => {
    const balance = Number(order.quantities?.remainingAtDyehouse || 0);
    if (balance <= 0) return false;
    if (!matchedDyehouse) return true;
    const names = [
      order.dyehouse,
      ...normalizeAiArray(order.colors).map((color) => color.dyehouse),
    ].filter(Boolean).join(' ');
    return aiIncludesText(names, matchedDyehouse);
  });
  const sorted = aiSortByQuantityThenDays(rows, (order) => order.quantities?.remainingAtDyehouse);
  const totalBalance = sorted.reduce((total, order) => total + Number(order.quantities?.remainingAtDyehouse || 0), 0);
  const scopedTitle = matchedDyehouse ? `رصيد ${matchedDyehouse}` : 'رصيد المصابغ';
  return {
    source: '2b-operational-query-engine',
    executiveSummary: `${scopedTitle}: ${sorted.length} طلب بها رصيد داخل المصبغة، بإجمالي ${aiFormatNumber(totalBalance)} كجم. الترتيب من الأعلى للأقل حسب الرصيد.`,
    keyFindings: sorted.slice(0, 15).map((order) => `${order.orderNumber} - ${order.customer} - ${order.fabricType} - ${order.dyehouse || matchedDyehouse || '-'}: داخل المصبغة ${aiFormatNumber(order.quantities?.remainingAtDyehouse)} كجم / منذ ${Number(order.stage?.days || 0)} يوم`),
    ordersToWatch: sorted.slice(0, 15).map((order) => aiOrderWatchRow(order, `داخل المصبغة ${aiFormatNumber(order.quantities?.remainingAtDyehouse)} كجم`)),
    risks: sorted.filter((order) => Number(order.stage?.days || 0) >= 7).slice(0, 5).map((order) => `طلب ${order.orderNumber} واقف ${Number(order.stage?.days || 0)} يوم داخل ${order.dyehouse || matchedDyehouse || '-'}.`),
    recommendations: [
      matchedDyehouse ? `ابدأ بأكبر رصيد داخل ${matchedDyehouse} ثم الأقدم وقوفًا.` : 'ابدأ بأكبر رصيد داخل المصابغ ثم الأقدم وقوفًا.',
      'قارن الرصيد مع أوامر استلام المجهز والتحويلات قبل اعتبار أي فرق هالك.',
    ],
    priorityActions: sorted.slice(0, 3).map((order) => `تابع طلب ${order.orderNumber} - ${order.customer}: ${aiFormatNumber(order.quantities?.remainingAtDyehouse)} كجم داخل ${order.dyehouse || matchedDyehouse || '-'}.`),
    whatsappMessage: `${scopedTitle}: ${aiFormatNumber(totalBalance)} كجم داخل المصبغة في ${sorted.length} طلب. أكبر طلب: ${sorted[0] ? `${sorted[0].orderNumber} / ${sorted[0].customer} / ${aiFormatNumber(sorted[0].quantities?.remainingAtDyehouse)} كجم` : '-'}.`,
    userRequest,
  };
}

function buildWarehouseReadyCommandReport(context = {}, userRequest = '') {
  if (!aiCommandHasAny(userRequest, ['جاهز للتسليم', 'رصيد المخزن', 'المخزن', 'جاهز', 'يتسلم'])) return null;
  const orders = normalizeAiArray(context.orders)
    .filter((order) => Number(order.quantities?.warehouseBalance || 0) !== 0)
    .sort((a, b) => Number(b.quantities?.warehouseBalance || 0) - Number(a.quantities?.warehouseBalance || 0));
  const total = orders.reduce((sumValue, order) => sumValue + Number(order.quantities?.warehouseBalance || 0), 0);
  return {
    source: '2b-operational-query-engine',
    executiveSummary: `رصيد المخزن الجاهز للتسليم: ${aiFormatNumber(total)} كجم موزعة على ${orders.length} طلب/بند. أي رقم سالب ظاهر هنا يظل مشكلة محفوظة للمراجعة ولا يتم إخفاؤه.`,
    keyFindings: orders.slice(0, 20).map((order) => `${order.orderNumber} - ${order.customer} - ${order.fabricType}: مخزن ${aiFormatNumber(order.quantities?.warehouseBalance)} كجم / مسلم ${aiFormatNumber(order.quantities?.customerDeliveredQuantity)} كجم`),
    ordersToWatch: orders.slice(0, 20).map((order) => aiOrderWatchRow(order, `رصيد مخزن ${aiFormatNumber(order.quantities?.warehouseBalance)} كجم`)),
    risks: orders.filter((order) => Number(order.quantities?.warehouseBalance || 0) < 0).map((order) => `طلب ${order.orderNumber} لديه رصيد مخزن سالب ${aiFormatNumber(order.quantities?.warehouseBalance)} كجم ويحتاج مراجعة حركة التسليم.`),
    recommendations: [
      'رتب التسليم حسب أكبر رصيد ثم أقدم تاريخ دخول مخزن.',
      'لا تفتح أمر تشغيل جديد لعميل لديه رصيد مجهز متاح قبل مراجعة التسليم.',
    ],
    priorityActions: orders.slice(0, 3).map((order) => `نسق تسليم طلب ${order.orderNumber} - ${order.customer}: ${aiFormatNumber(order.quantities?.warehouseBalance)} كجم.`),
    whatsappMessage: `جاهز للتسليم: ${aiFormatNumber(total)} كجم في ${orders.length} طلب. أكبر رصيد: ${orders[0] ? `${orders[0].orderNumber} / ${orders[0].customer} / ${aiFormatNumber(orders[0].quantities?.warehouseBalance)} كجم` : '-'}.`,
    userRequest,
  };
}

function buildDelayedOrdersCommandReport(context = {}, userRequest = '') {
  if (!aiCommandHasAny(userRequest, ['متأخر', 'متاخر', 'الطلبات المتأخرة', 'الطلبات المتاخره', 'واقف من زمان', 'أقدم', 'اقدم'])) return null;
  const orders = normalizeAiArray(context.orders)
    .filter((order) => !order.isClosed && !['completed', 'closed'].includes(String(order.status || '').toLowerCase()) && Number(order.stage?.days || 0) >= 7)
    .sort((a, b) => Number(b.stage?.days || 0) - Number(a.stage?.days || 0));
  return {
    source: '2b-operational-query-engine',
    executiveSummary: `الطلبات المتأخرة: ${orders.length} طلب واقف 7 أيام أو أكثر. الترتيب من الأقدم للأحدث.`,
    keyFindings: orders.slice(0, 20).map((order) => `${order.orderNumber} - ${order.customer} - ${order.fabricType}: ${order.stage?.label || '-'} منذ ${Number(order.stage?.days || 0)} يوم / ${order.stage?.reason || '-'}`),
    ordersToWatch: orders.slice(0, 20).map((order) => aiOrderWatchRow(order)),
    risks: orders.slice(0, 5).map((order) => `طلب ${order.orderNumber} متأخر ${Number(order.stage?.days || 0)} يوم في ${order.dyehouse || order.stage?.label || '-'}.`),
    recommendations: ['ابدأ بالأقدم وقوفًا، ثم الأكبر كمية، ثم الطلب الذي لديه رصيد مخزن جاهز للتسليم.'],
    priorityActions: orders.slice(0, 5).map((order) => `راجع ${order.orderNumber} - ${order.customer}: ${operationalDecisionText(order)}`),
    whatsappMessage: `الطلبات المتأخرة: ${orders.length}. ${orders.slice(0, 3).map((order) => `${order.orderNumber}/${order.customer}/${Number(order.stage?.days || 0)} يوم`).join(' | ')}`,
    userRequest,
  };
}

function buildWasteCommandReport(context = {}, userRequest = '') {
  if (!aiCommandHasAny(userRequest, ['هالك', 'الهالك', 'اعلى هالك', 'أعلى هالك', 'فاقد'])) return null;
  const orders = normalizeAiArray(context.orders)
    .filter((order) => Number(order.quantities?.totalWaste || 0) > 0 || Number(order.quantities?.totalWastePercent || 0) > 0)
    .sort((a, b) => Number(b.quantities?.totalWastePercent || 0) - Number(a.quantities?.totalWastePercent || 0));
  return {
    source: '2b-operational-query-engine',
    executiveSummary: `تقرير الهالك: ${orders.length} طلب بها هالك فعلي/نسبة هالك ظاهرة. الترتيب من أعلى نسبة للأقل.`,
    keyFindings: orders.slice(0, 20).map((order) => `${order.orderNumber} - ${order.customer} - ${order.fabricType}: هالك ${aiFormatNumber(order.quantities?.totalWaste)} كجم / ${aiFormatNumber(order.quantities?.totalWastePercent, 1)}% / المتوقع ${aiFormatNumber(order.quantities?.expectedWastePercent, 1)}%`),
    ordersToWatch: orders.slice(0, 20).map((order) => aiOrderWatchRow(order, `هالك ${aiFormatNumber(order.quantities?.totalWaste)} كجم (${aiFormatNumber(order.quantities?.totalWastePercent, 1)}%)`)),
    risks: orders
      .filter((order) => Number(order.quantities?.totalWastePercent || 0) >= Math.max(8, Number(order.quantities?.expectedWastePercent || 0) + 2))
      .slice(0, 8)
      .map((order) => `طلب ${order.orderNumber}: الهالك ${aiFormatNumber(order.quantities?.totalWastePercent, 1)}% أعلى من المتوقع ${aiFormatNumber(order.quantities?.expectedWastePercent, 1)}%.`),
    recommendations: ['لا تعتمد الهالك النهائي إلا بعد مطابقة المرسل للمصبغة، المستلم مجهز، المرتجعات، والتسليم.'],
    priorityActions: orders.slice(0, 5).map((order) => `راجع هالك طلب ${order.orderNumber} - ${order.customer}: ${aiFormatNumber(order.quantities?.totalWastePercent, 1)}%.`),
    whatsappMessage: `أعلى هالك: ${orders[0] ? `${orders[0].orderNumber}/${orders[0].customer}/${aiFormatNumber(orders[0].quantities?.totalWastePercent, 1)}%` : 'لا يوجد هالك ظاهر'}.`,
    userRequest,
  };
}

function buildOperationalCommandReport(context = {}, userRequest = '') {
  if (aiCommandHasAny(userRequest, ['حساب', 'كشف حساب', 'رصيد عميل', 'حساب فلان'])) {
    return buildCustomerAccountCommandReport(context, userRequest);
  }
  if (aiCommandHasAny(userRequest, ['تحويل', 'تحويلات', 'نقل مصبغة', 'نقل لون'])) {
    return buildDyehouseTransferCommandReport(context, userRequest);
  }
  if (aiCommandHasAny(userRequest, ['واتساب', 'واتس اب', 'whatsapp', 'ارسال التقارير', 'إرسال التقارير'])) {
    return buildWhatsappCommandReport(context, userRequest);
  }
  return null;
}

function buildEnhancedOperationalCommandReport(context = {}, userRequest = '') {
  if (aiCommandHasAny(userRequest, ['حساب', 'كشف حساب', 'رصيد عميل'])) {
    return buildCustomerAccountCommandReport(context, userRequest);
  }
  const orderReport = buildOrderLookupCommandReport(context, userRequest);
  if (orderReport) return orderReport;
  if (aiCommandHasAny(userRequest, ['تحويل', 'تحويلات', 'نقل مصبغة', 'نقل لون'])) {
    return buildDyehouseTransferCommandReport(context, userRequest);
  }
  const dyehouseReport = buildDyehouseBalanceCommandReport(context, userRequest);
  if (dyehouseReport) return dyehouseReport;
  const warehouseReport = buildWarehouseReadyCommandReport(context, userRequest);
  if (warehouseReport) return warehouseReport;
  const delayedReport = buildDelayedOrdersCommandReport(context, userRequest);
  if (delayedReport) return delayedReport;
  const wasteReport = buildWasteCommandReport(context, userRequest);
  if (wasteReport) return wasteReport;
  if (aiCommandHasAny(userRequest, ['واتساب', 'واتس اب', 'ارسال التقارير', 'إرسال التقارير'])) {
    return buildWhatsappCommandReport(context, userRequest);
  }
  return buildOperationalCommandReport(context, userRequest);
}

return {
  compactAiPayload,
  aiFallbackAnalysis,
  runOpenAiAnalysis,
  runGeminiAnalysis,
  buildAiEmployeeContext,
  buildAiQuestionFocus,
  buildFocusedEmployeeReport,
  buildOperationalDashboardReport,
  runAiEmployeeModelReport,
  buildEnhancedOperationalCommandReport,
};
}

module.exports = createAiEmployee;

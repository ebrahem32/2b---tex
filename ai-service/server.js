require('dotenv').config();

const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const http = require('http');

const app = express();
const port = Number(process.env.PORT || 3030);
const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const logFile = require('path').join(__dirname, 'ai-service.log');

app.use(cors({ origin: true }));
app.use(express.json({ limit: '2mb' }));

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function compactPayload(input = {}) {
  const orders = normalizeArray(input.orders);
  const outbox = normalizeArray(input.reportOutbox);
  const summaryStats = input.summaryStats && typeof input.summaryStats === 'object' ? input.summaryStats : {};

  return {
    summaryStats,
    orders: orders.slice(0, 120).map((order) => ({
      orderNumber: order.orderNumber,
      customer: order.customer,
      fabricType: order.fabricType,
      dyehouse: order.dyehouse,
      status: order.status,
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
      notes: order.notes || '',
      rawNoteNumbers: order.rawNoteNumbers || [],
      allocations: normalizeArray(order.allocations).map((allocation) => ({
        color: allocation.color,
        dyehouse: allocation.dyehouse,
        plannedQuantity: Number(allocation.plannedQuantity || 0),
        sentToDyehouse: Number(allocation.sentToDyehouse || 0),
        finishedReceived: Number(allocation.finishedReceived || 0),
        remainingAtDyehouse: Number(allocation.remainingAtDyehouse || 0),
        wasteQuantity: Number(allocation.wasteQuantity || 0),
        expectedWasteQuantity: Number(allocation.expectedWasteQuantity || 0),
      })),
      accessoryRequired: Number(order.accessoryRequired || 0),
      accessorySent: Number(order.accessorySent || 0),
      accessoryReceived: Number(order.accessoryReceived || 0),
      accessoryDelivered: Number(order.accessoryDelivered || 0),
      accessoryBalance: Number(order.accessoryBalance || 0),
      accessoryWaste: Number(order.accessoryWaste || 0),
    })),
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

function fallbackAnalysis(data) {
  const orders = normalizeArray(data.orders);
  const openOrders = orders.filter((order) => !['completed', 'closed'].includes(order.status));
  const atDyehouse = orders.reduce((total, order) => total + Number(order.rawAtDyehouseAvailable || 0), 0);
  const unsentRaw = orders.reduce((total, order) => total + Math.max(Number(order.totalRawOrdered || 0) - Number(order.totalRawReceived || 0), 0), 0);
  const failedReports = normalizeArray(data.reportOutbox).filter((item) => item.status === 'failed' || item.status === 'pending');

  return {
    executiveSummary: `يوجد ${orders.length} طلب مسجل، منها ${openOrders.length} طلب تحت التشغيل. المتبقي بالمصبغة ${atDyehouse.toLocaleString('ar-EG')} كجم، والخام غير المرسل ${unsentRaw.toLocaleString('ar-EG')} كجم.`,
    keyFindings: [
      `طلبات تحت التشغيل: ${openOrders.length}`,
      `متبقي بالمصبغة: ${atDyehouse.toLocaleString('ar-EG')} كجم وليس هالكًا نهائيًا أثناء التشغيل.`,
      `خام لم يتم إرساله: ${unsentRaw.toLocaleString('ar-EG')} كجم`,
      `تقارير تحتاج متابعة: ${failedReports.length}`,
    ],
    risks: [
      atDyehouse > 0 ? 'يوجد رصيد داخل المصبغة يحتاج متابعة قبل اعتباره هالكًا.' : 'لا يظهر رصيد كبير داخل المصبغة من البيانات المرسلة.',
      failedReports.length ? 'بعض تقارير واتساب لم يتم إرسالها أو فشلت.' : 'لا توجد مخاطر واضحة في إرسال التقارير.',
    ],
    recommendations: [
      'راجع الطلبات ذات المتبقي الأكبر داخل المصبغة أولًا.',
      'لا تغلق دورة التشغيل قبل مطابقة الداخل للمخزن والتسليم والمرتجع.',
      'أعد محاولة إرسال التقارير غير المرسلة.',
    ],
    whatsappMessage: `ملخص تشغيل 2B Tex: ${orders.length} طلب، ${openOrders.length} تحت التشغيل، متبقي بالمصبغة ${atDyehouse.toLocaleString('ar-EG')} كجم، خام غير مرسل ${unsentRaw.toLocaleString('ar-EG')} كجم، وتقارير تحتاج متابعة ${failedReports.length}.`,
  };
}

app.get('/api/ai/health', (req, res) => {
  res.json({ ok: true, hasApiKey: Boolean(process.env.OPENAI_API_KEY) });
});

app.post('/api/ai/analyze-report', async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'MISSING_OPENAI_API_KEY', message: 'لم يتم ضبط مفتاح OpenAI API داخل السيرفر' });
  }

  const data = compactPayload(req.body || {});
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: [
            'أنت مساعد إداري لنظام 2B Tex لمتابعة النسيج والصباغة.',
            'اكتب تحليلًا عربيًا عمليًا مختصرًا مبنيًا على الأرقام فقط.',
            'لا تعتبر remainingAtDyehouse أو rawAtDyehouseAvailable هالكًا نهائيًا أثناء التشغيل.',
            'الهالك النهائي يحسب فقط للطلبات completed أو closed أو operationClosed=true.',
            'أرجع JSON فقط بالمفاتيح: executiveSummary, keyFindings, risks, recommendations, whatsappMessage.',
          ].join('\n'),
        },
        {
          role: 'user',
          content: JSON.stringify(data),
        },
      ],
    });

    const content = completion.choices?.[0]?.message?.content || '';
    const parsed = JSON.parse(content);
    res.json({
      executiveSummary: parsed.executiveSummary || '',
      keyFindings: normalizeArray(parsed.keyFindings),
      risks: normalizeArray(parsed.risks),
      recommendations: normalizeArray(parsed.recommendations),
      whatsappMessage: parsed.whatsappMessage || '',
    });
  } catch (error) {
    const message = error && error.message ? error.message : String(error);
    console.error('AI analysis failed:', message);
    try {
      require('fs').appendFileSync(logFile, `[${new Date().toISOString()}] ${message}\n`, 'utf8');
    } catch {}
    res.status(500).json({ error: 'AI_ANALYSIS_FAILED', message: 'تعذر تحليل التقرير من سيرفر OpenAI حاليًا. راجع مفتاح OpenAI أو الرصيد.' });
  }
});

const server = http.createServer(app);
server.on('error', (error) => {
  console.error('AI service failed to start:', error.message);
});
server.listen(port, '127.0.0.1', () => {
  console.log(`2B Tex AI service is running on http://127.0.0.1:${port}`);
});

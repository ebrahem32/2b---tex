(function () {
  function createAiUi(deps) {
    const operationalAiManager = deps.createOperationalAiManager ? deps.createOperationalAiManager({
      escapeHtml: deps.escapeHtml,
      formatNumber: deps.formatNumber,
      roundNumber: deps.roundNumber,
      orderStageInfo: deps.orderStageInfo,
      getCalculatedOrders: () => deps.getOrders().map((order) => deps.calculateOrder(order)),
    }) : null;

    function buildAiSummaryStats(list = deps.allOrders()) {
      const reportOutbox = deps.getReportOutbox();
      const openOrders = list.filter((order)=>!['completed','closed'].includes(order.status));
      const pendingReports = reportOutbox.filter((item)=>['pending','failed'].includes(item.status));
      return {
        ordersCount: list.length,
        openOrdersCount: openOrders.length,
        pendingOrdersCount: list.filter((order)=>order.status === 'pending').length,
        inProgressOrdersCount: list.filter((order)=>order.status === 'in-progress').length,
        completedOrdersCount: list.filter((order)=>order.status === 'completed').length,
        closedOrdersCount: list.filter((order)=>order.status === 'closed').length,
        totalRawOrdered: deps.roundNumber(list.reduce((total, order)=>total + Number(order.totalRawOrdered || 0), 0)),
        totalSentToDyehouse: deps.roundNumber(list.reduce((total, order)=>total + Number(order.totalSentToDyehouse || 0), 0)),
        totalGluingBalance: deps.roundNumber(list.reduce((total, order)=>total + Number(order.gluingBalance || 0), 0)),
        totalGluedProductBalance: deps.roundNumber(list.reduce((total, order)=>total + Number(order.gluedProductBalance || 0), 0)),
        totalFinishedReceived: deps.roundNumber(list.reduce((total, order)=>total + Number(order.totalFinishedReceived || 0), 0)),
        totalRemainingAtDyehouse: deps.roundNumber(list.reduce((total, order)=>total + Number(order.rawAtDyehouseAvailable || 0), 0)),
        totalWarehouseBalance: deps.roundNumber(list.reduce((total, order)=>total + Number(order.warehouseBalance || 0), 0)),
        totalDeliveredToCustomer: deps.roundNumber(list.reduce((total, order)=>total + Number(order.totalDeliveredToCustomer || 0), 0)),
        finalWasteOnClosedOrders: deps.roundNumber(list.filter((order)=>['completed','closed'].includes(order.status)).reduce((total, order)=>total + Number(order.totalWaste || 0), 0)),
        reportsNeedAttention: pendingReports.length,
      };
    }

    function collectAiReportPayload() {
      const calculatedOrders = deps.allOrders().map((order)=>({
        ...order,
        stageInfo: deps.orderStageInfo(order),
        rawNoteNumbers: deps.getRawBatches().filter((batch)=>batch.orderId===order.id).map((batch)=>batch.noteNumber).filter(Boolean),
      }));
      return {
        orders: calculatedOrders,
        weavingOrders: deps.getOrders(),
        dyeingPlans: deps.getAllocations(),
        batches: {
          rawBatches: deps.getRawBatches(),
          productionBatches: deps.getProductionBatches(),
          customerBatches: deps.getCustomerBatches(),
          accessoryBatches: deps.getAccessoryBatches(),
          rawReturns: deps.getRawReturns(),
          gluingBatches: deps.getGluingBatches(),
          dyehouseTransfers: deps.getDyehouseTransfers(),
        },
        reportOutbox: deps.getReportOutbox(),
        summaryStats: buildAiSummaryStats(calculatedOrders),
      };
    }

    function formatAiItem(item) {
      if (item == null) return '-';
      if (typeof item !== 'object') return String(item);
      const parts = [];
      if (item.orderNumber || item.orderId) parts.push(`طلب ${item.orderNumber || item.orderId}`);
      if (item.customer) parts.push(`العميل ${item.customer}`);
      if (item.status) parts.push(item.status);
      if (typeof item.stage === 'string') parts.push(item.stage);
      if (item.stage?.label) parts.push(item.stage.label);
      if (item.daysInStatus != null) parts.push(`واقف ${item.daysInStatus} يوم`);
      if (item.daysInStage != null) parts.push(`واقف ${item.daysInStage} يوم`);
      if (item.stage?.days != null) parts.push(`واقف ${item.stage.days} يوم`);
      if (item.fabricType) parts.push(`الصنف ${item.fabricType}`);
      if (item.dyehouse) parts.push(`المصبغة ${item.dyehouse}`);
      if (item.reason || item.notes) parts.push(item.reason || item.notes);
      return parts.length ? parts.join(' - ') : JSON.stringify(item);
    }

    function asListHtml(items) {
      const rows = Array.isArray(items) ? items : [];
      return rows.length ? `<ul>${rows.map((item)=>`<li>${deps.escapeHtml(formatAiItem(item))}</li>`).join('')}</ul>` : '<p class="empty-state">لا توجد بيانات كافية للعرض.</p>';
    }

    function operationalDecisionFor(order = {}, stage = {}) {
      const dyehouseBalance = Number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse || 0);
      const warehouseBalance = Number(order.warehouseBalance || 0);
      const wastePercent = Number(order.totalWastePercent || 0);
      if (stage.key === 'dyehouse' || dyehouseBalance > 0) return `اتصل بالمصبغة ${order.dyehouse || '-'} لمتابعة ${deps.formatNumber(dyehouseBalance)} كجم داخل المصبغة.`;
      if (warehouseBalance > 0) return `نسق تسليم ${deps.formatNumber(warehouseBalance)} كجم للعميل قبل فتح تشغيل جديد.`;
      if (wastePercent >= Math.max(8, Number(order.expectedWastePercent || 0) + 2)) return `راجع الهالك ${deps.formatNumber(wastePercent, 1)}% قبل اعتماد الإغلاق.`;
      if (stage.key === 'weaving') return 'تابع خروج الخام من النسيج أو سجل الإذن الناقص.';
      return stage.reason || 'راجع آخر حركة تشغيل وحدد الإجراء التالي.';
    }

    function renderAiAnalysis(result, title = 'الملخص التنفيذي') {
      const refs = deps.refs;
      const safe = result || {};
      const sourceLabel = safe.source === 'gemini' ? 'موظف 2B الذكي - Gemini' : (safe.source === 'openai' ? 'موظف 2B الذكي - OpenAI' : 'تحليل تشغيلي من قواعد 2B');
      refs.aiAnalysisBody.innerHTML = `<section class="ai-result-section"><p class="eyebrow">${sourceLabel}</p><h3>${deps.escapeHtml(title)}</h3><p>${deps.escapeHtml(safe.executiveSummary || '-')}</p></section><section class="ai-result-section"><h3>أهم الملاحظات</h3>${asListHtml(safe.keyFindings)}</section><section class="ai-result-section"><h3>الطلبات التي تحتاج متابعة</h3>${asListHtml(safe.ordersToWatch)}</section><section class="ai-result-section"><h3>المخاطر</h3>${asListHtml(safe.risks)}</section><section class="ai-result-section"><h3>التوصيات</h3>${asListHtml(safe.recommendations)}</section><section class="ai-result-section"><h3>أولويات اليوم</h3>${asListHtml(safe.priorityActions)}</section><section class="ai-result-section"><h3>رسالة واتساب للإدارة</h3><div class="ai-whatsapp-message" id="aiWhatsappMessage">${deps.escapeHtml(safe.whatsappMessage || '-')}</div></section>`;
      refs.aiAnalysisDialog.showModal();
    }

    function buildLocalAiEmployeeResponse(question = '') {
      const q = String(question || '').toLowerCase();
      const list = deps.getOrders().map((order)=>deps.calculateOrder(order));
      const withStage = list.map((order)=>({ order, stage:deps.orderStageInfo(order) }));
      let scope = withStage.filter(({ stage })=>!['completed','closed'].includes(stage.key));
      let reportTitle = 'ملخص تشغيلي محلي';
      if (q.includes('مصبغ') || q.includes('dye')) {
        reportTitle = 'داخل المصبغة';
        scope = withStage.filter(({ order, stage })=>stage.key === 'dyehouse' || Number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse || 0) > 0);
      } else if (q.includes('مخزن') || q.includes('جاهز') || q.includes('تسليم')) {
        reportTitle = 'رصيد المخزن / جاهز للتسليم';
        scope = withStage.filter(({ order })=>Number(order.warehouseBalance || 0) > 0);
      } else if (q.includes('نسيج') || q.includes('weav')) {
        reportTitle = 'رصيد النسيج';
        scope = withStage.filter(({ stage })=>stage.key === 'weaving');
      } else if (q.includes('هالك') || q.includes('waste')) {
        reportTitle = 'تحليل الهالك';
        scope = withStage.filter(({ order })=>Number(order.totalWaste || 0) > 0 || Number(order.totalWastePercent || 0) > 0);
      } else if (q.includes('أقدم') || q.includes('متأخر') || q.includes('واقف')) {
        reportTitle = 'الطلبات الواقفة';
        scope = withStage.filter(({ stage })=>!['completed','closed'].includes(stage.key));
      }
      const sorted = scope.sort((a,b)=>Number(b.stage.days || 0) - Number(a.stage.days || 0)).slice(0, 8);
      const totalRaw = deps.sum(sorted.map(({ order })=>Number(order.totalRawOrdered || 0)));
      const totalDyehouse = deps.sum(sorted.map(({ order })=>Number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse || 0)));
      const totalWarehouse = deps.sum(sorted.map(({ order })=>Number(order.warehouseBalance || 0)));
      const executiveSummary = sorted.length
        ? `${reportTitle}: ${sorted.length} طلب / خام ${deps.formatNumber(totalRaw)} كجم / داخل المصبغة ${deps.formatNumber(totalDyehouse)} / رصيد مخزن ${deps.formatNumber(totalWarehouse)}.`
        : `${reportTitle}: لا توجد طلبات مطابقة حاليا.`;
      const ordersToWatch = sorted.map(({ order, stage })=>({
        orderNumber: order.orderNumber,
        customer: order.customer,
        fabricType: order.fabricType,
        dyehouse: order.dyehouse,
        stage: stage.label,
        daysInStage: stage.days,
        reason: operationalDecisionFor(order, stage)
      }));
      const risks = sorted.filter(({ order, stage })=>Number(stage.days || 0) >= 7 || Number(order.totalWastePercent || 0) >= 8).map(({ order, stage })=>`طلب ${order.orderNumber} - ${order.customer}: ${stage.label} من ${stage.days} يوم / هالك ${deps.formatNumber(order.totalWastePercent || 0, 1)}%`);
      const topDecision = ordersToWatch[0]
        ? `أهم إجراء: طلب ${ordersToWatch[0].orderNumber} - ${ordersToWatch[0].customer}. ${ordersToWatch[0].reason}`
        : 'أهم إجراء: لا توجد حركة عاجلة في هذا النطاق.';
      return {
        source: 'local',
        executiveSummary: `${executiveSummary} ${topDecision}`,
        keyFindings: [
          `عدد الطلبات: ${sorted.length}`,
          `إجمالي داخل المصبغة: ${deps.formatNumber(totalDyehouse)}`,
          `إجمالي رصيد المخزن: ${deps.formatNumber(totalWarehouse)}`,
        ],
        ordersToWatch,
        risks,
        recommendations: sorted.length ? ['ابدأ بالأقدم وقوفا أو الأكبر كمية حسب القائمة الحالية.', 'لا تغلق أي طلب قبل مطابقة المرسل للمصبغة والمستلم مجهز والمرتجع والهالك.', 'أي رصيد مخزن ظاهر يعتبر جاهزا للتسليم ويحتاج موعد مع العميل.'] : ['لا توجد أولوية عاجلة في هذا النطاق.'],
        priorityActions: ordersToWatch.slice(0, 3).map((item)=>`طلب ${item.orderNumber} - ${item.customer}: ${item.reason}`),
        whatsappMessage: `${executiveSummary}\n${ordersToWatch.slice(0, 5).map((item)=>`- ${item.orderNumber} / ${item.customer}: ${item.reason}`).join('\n') || 'لا توجد طلبات للعرض.'}`,
      };
    }

    async function requestAiEmployee(question, triggerButton, title = 'الملخص التنفيذي') {
      if (!triggerButton) return;
      const refs = deps.refs;
      const oldText = triggerButton.textContent;
      triggerButton.disabled = true;
      triggerButton.textContent = 'جاري التحليل...';
      if (refs.aiStatusText) refs.aiStatusText.textContent = 'موظف 2B الذكي يقرأ قاعدة البيانات من Railway الآن.';
      try {
        const response = await fetch(`${deps.AI_SERVICE_URL}/api/ai/employee-report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question }),
        });
        const data = await response.json().catch(()=>({}));
        if (!response.ok) {
          if (data.error === 'MISSING_OPENAI_API_KEY') throw new Error('لم يتم ضبط مفتاح OpenAI API داخل السيرفر');
          throw new Error(data.message || 'تعذر تحليل التقرير من خدمة مساعد 2B الذكي');
        }
        renderAiAnalysis(data, title);
        if (refs.aiStatusText) refs.aiStatusText.textContent = 'تم إنشاء تقرير مركز المتابعة الذكي من بيانات Railway.';
      } catch (error) {
        console.warn('ai-service-fallback', error);
        renderAiAnalysis(buildLocalAiEmployeeResponse(question), title);
        if (refs.aiStatusText) refs.aiStatusText.textContent = 'تم الرد محليا من بيانات النظام لأن خدمة AI غير متاحة.';
      } finally {
        triggerButton.disabled = false;
        triggerButton.textContent = oldText;
      }
    }

    async function analyzeReportWithAi() {
      await requestAiEmployee('حلل تشغيل 2B الآن: ما الذي واقف، لماذا، وما أولويات اليوم؟', deps.refs.analyzeReportBtn, 'تقرير مركز المتابعة الذكي');
    }

    async function askAiEmployee() {
      const question = String(deps.refs.aiQuestionInput?.value || '').trim();
      if (!question) { alert('اكتب سؤالك للموظف الذكي أولا.'); return; }
      await requestAiEmployee(question, deps.refs.askAiBtn, 'رد مركز المتابعة الذكي');
    }

    async function copyAiWhatsappMessage() {
      const text = document.getElementById('aiWhatsappMessage')?.textContent?.trim() || '';
      if (!text || text === '-') { alert('لا توجد رسالة جاهزة للنسخ.'); return; }
      try {
        await navigator.clipboard.writeText(text);
        alert('تم نسخ الرسالة.');
      } catch {
        const area = document.createElement('textarea');
        area.value = text;
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        area.remove();
        alert('تم نسخ الرسالة.');
      }
    }

    function renderOperationalAiDashboard() {
      if (!operationalAiManager) return null;
      return operationalAiManager.render(deps.refs.operationalAiDashboard || document.getElementById('operationalAiDashboard'));
    }

    function installAiUiHandlers() {
      const refs = deps.refs;
      if (refs.analyzeReportBtn) refs.analyzeReportBtn.onclick = analyzeReportWithAi;
      if (refs.askAiBtn) refs.askAiBtn.onclick = askAiEmployee;
      if (refs.aiQuestionInput) refs.aiQuestionInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          askAiEmployee();
        }
      });
      if (refs.closeAiAnalysisBtn) refs.closeAiAnalysisBtn.onclick = () => refs.aiAnalysisDialog.close();
      if (refs.copyAiWhatsappBtn) refs.copyAiWhatsappBtn.onclick = copyAiWhatsappMessage;
      if (refs.operationalAiDashboard) {
        refs.operationalAiDashboard.addEventListener('click', (event) => {
          const refreshButton = event.target.closest('[data-refresh-operational-ai]');
          if (refreshButton) {
            renderOperationalAiDashboard();
            if (refs.aiStatusText) refs.aiStatusText.textContent = 'تم تحديث مدير التشغيل الذكي من بيانات الشاشة الحالية.';
            return;
          }
          const orderButton = event.target.closest('[data-ai-open-order], [data-view]');
          if (orderButton) {
            const orderId = orderButton.dataset.aiOpenOrder || orderButton.dataset.view;
            if (orderId && typeof deps.openOrderFocusMode === 'function') deps.openOrderFocusMode(orderId);
          }
        });
      }
      renderOperationalAiDashboard();
    }

    return {
      buildAiSummaryStats,
      collectAiReportPayload,
      formatAiItem,
      renderAiAnalysis,
      buildLocalAiEmployeeResponse,
      requestAiEmployee,
      analyzeReportWithAi,
      askAiEmployee,
      copyAiWhatsappMessage,
      renderOperationalAiDashboard,
      installAiUiHandlers,
    };
  }

  window.createAiUi = createAiUi;
})();

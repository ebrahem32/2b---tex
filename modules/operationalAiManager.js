(function () {
  function createOperationalAiManager(deps) {
    const delayDays = Number(deps.delayDays || 7);
    const readyDays = Number(deps.readyDays || 3);
    const wastePercent = Number(deps.wastePercent || 8);

    function number(value) {
      return Number(value || 0);
    }

    function fmt(value, digits = 3) {
      return deps.formatNumber ? deps.formatNumber(value, digits) : number(value).toLocaleString('en-US');
    }

    function openOrder(order) {
      return order && !['completed', 'closed'].includes(String(order.status || ''));
    }

    function isDyehouseStage(order) {
      const stage = deps.orderStageInfo(order);
      return stage.key === 'dyehouse' && number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse) > 0;
    }

    function isReadyStage(order) {
      return number(order.warehouseBalance) > 0;
    }

    function item(order, extra = {}) {
      const stage = deps.orderStageInfo(order);
      return {
        id: order.id,
        orderNumber: order.orderNumber || '-',
        customer: order.customer || '-',
        fabricType: order.fabricType || '-',
        dyehouse: order.dyehouse || '-',
        stageKey: stage.key,
        stageLabel: stage.label,
        days: number(stage.days),
        quantity: number(extra.quantity),
        wastePercent: number(order.totalWastePercent),
        reason: extra.reason || stage.reason || '',
      };
    }

    function sortByRisk(rows) {
      return rows.slice().sort((a, b) => (
        number(b.days) - number(a.days)
        || number(b.quantity) - number(a.quantity)
        || number(b.wastePercent) - number(a.wastePercent)
      ));
    }

    function analyze() {
      const orders = deps.getCalculatedOrders();
      const active = orders.filter(openOrder);
      const withStage = active.map((order) => ({ order, stage: deps.orderStageInfo(order) }));
      const delayed = sortByRisk(withStage
        .filter(({ stage }) => number(stage.days) >= delayDays)
        .map(({ order, stage }) => item(order, {
          quantity: number(order.rawAtDyehouseAvailable || order.warehouseBalance || order.remainingToCustomer),
          reason: `${stage.label} منذ ${stage.days} يوم`,
        })));
      const dyehouse = sortByRisk(active
        .filter(isDyehouseStage)
        .map((order) => item(order, {
          quantity: number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse),
          reason: `داخل المصبغة ${fmt(order.rawAtDyehouseAvailable || order.remainingAtDyehouse)} كجم`,
        })));
      const ready = sortByRisk(active
        .filter(isReadyStage)
        .map((order) => {
          const stage = deps.orderStageInfo(order);
          const dyehouseBalance = number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse);
          const mixedNote = dyehouseBalance > 0 ? ` / مع متبقي بالمصبغة ${fmt(dyehouseBalance)} كجم` : '';
          return item(order, {
            quantity: number(order.warehouseBalance),
            reason: `جاهز للتسليم ${fmt(order.warehouseBalance)} كجم منذ ${stage.days} يوم${mixedNote}`,
          });
        }))
        .filter((row) => row.days >= readyDays || row.quantity > 0);
      const highWaste = sortByRisk(orders
        .filter((order) => number(order.totalWastePercent) >= Math.max(wastePercent, number(order.expectedWastePercent) + 2))
        .map((order) => item(order, {
          quantity: number(order.totalWaste),
          reason: `هالك ${fmt(order.totalWastePercent, 1)}% / ${fmt(order.totalWaste)} كجم`,
        })));
      const seenPriority = new Set();
      const priority = sortByRisk([...delayed, ...dyehouse.slice(0, 3), ...ready.slice(0, 3), ...highWaste])
        .filter((row) => {
          if (seenPriority.has(row.id)) return false;
          seenPriority.add(row.id);
          return true;
        })
        .slice(0, 8);
      const topAction = priority[0]
        ? `متابعة أوردر ${priority[0].orderNumber} - ${priority[0].customer}: ${priority[0].reason}`
        : 'لا توجد أولوية حرجة الآن. راجع التشغيل الدوري فقط.';
      return {
        generatedAt: new Date().toISOString(),
        counts: {
          active: active.length,
          delayed: delayed.length,
          dyehouse: dyehouse.length,
          ready: ready.length,
          highWaste: highWaste.length,
        },
        totals: {
          dyehouse: deps.roundNumber(dyehouse.reduce((total, row) => total + number(row.quantity), 0)),
          ready: deps.roundNumber(ready.reduce((total, row) => total + number(row.quantity), 0)),
          waste: deps.roundNumber(highWaste.reduce((total, row) => total + number(row.quantity), 0)),
        },
        delayed,
        dyehouse,
        ready,
        highWaste,
        priority,
        topAction,
      };
    }

    function renderList(rows, emptyText) {
      const safeRows = rows.slice(0, 6);
      if (!safeRows.length) return `<div class="empty-state">${deps.escapeHtml(emptyText)}</div>`;
      return safeRows.map((row) => `<button type="button" class="operational-ai-row" data-ai-open-order="${deps.escapeHtml(row.id)}">
        <strong>${deps.escapeHtml(row.orderNumber)} - ${deps.escapeHtml(row.customer)}</strong>
        <span>${deps.escapeHtml(row.fabricType)} / ${deps.escapeHtml(row.stageLabel)}</span>
        <small>${deps.escapeHtml(row.reason)}</small>
      </button>`).join('');
    }

    function render(container) {
      if (!container) return null;
      const data = analyze();
      const hour = new Date().getHours();
      const greeting = hour < 12 ? 'صباح الخير' : 'مساء الخير';
      container.innerHTML = `<div class="operational-ai-manager">
        <div class="operational-ai-hero">
          <div>
            <p class="eyebrow">Operational AI Manager - Read Only</p>
            <h3>${greeting} يا إبراهيم</h3>
            <p>اليوم عندك ${data.counts.delayed} طلبات متأخرة، ${data.counts.ready} طلب جاهز للتسليم، و ${data.counts.highWaste} طلب هالكه مرتفع.</p>
          </div>
          <button class="mini-btn gold" type="button" id="refreshOperationalAiBtn" data-refresh-operational-ai>تحديث التحليل</button>
        </div>
        <div class="operational-ai-cards">
          <article><span>الطلبات المتأخرة</span><strong>${data.counts.delayed}</strong><small>أكثر من ${delayDays} أيام</small></article>
          <article><span>داخل المصبغة</span><strong>${fmt(data.totals.dyehouse)}</strong><small>${data.counts.dyehouse} طلب</small></article>
          <article><span>جاهز للتسليم</span><strong>${fmt(data.totals.ready)}</strong><small>${data.counts.ready} طلب</small></article>
          <article><span>هالك عالي</span><strong>${data.counts.highWaste}</strong><small>${fmt(data.totals.waste)} كجم</small></article>
        </div>
        <div class="operational-ai-action"><span>أهم إجراء اليوم</span><strong>${deps.escapeHtml(data.topAction)}</strong></div>
        <div class="operational-ai-grid">
          <section><h4>الطلبات المتأخرة</h4>${renderList(data.delayed, 'لا توجد طلبات متأخرة حسب الحد الحالي.')}</section>
          <section><h4>ما داخل المصبغة</h4>${renderList(data.dyehouse, 'لا يوجد رصيد حرج داخل المصبغة.')}</section>
          <section><h4>جاهز للتسليم</h4>${renderList(data.ready, 'لا يوجد رصيد جاهز للتسليم حاليا.')}</section>
          <section><h4>أعلى هالك</h4>${renderList(data.highWaste, 'لا توجد نسب هالك مرتفعة حاليا.')}</section>
        </div>
        <div class="operational-ai-recommendations">
          <h4>توصيات اليوم</h4>
          <ul>
            <li>ابدأ بأقدم طلب داخل المصبغة قبل فتح تشغيل جديد.</li>
            <li>راجع الجاهز للتسليم مع العميل حتى لا يتحول المخزن إلى نقطة انتظار.</li>
            <li>أي طلب هالكه أعلى من المتوقع يتم مراجعته قبل الإغلاق التشغيلي.</li>
          </ul>
        </div>
      </div>`;
      return data;
    }

    return { analyze, render };
  }

  window.createOperationalAiManager = createOperationalAiManager;
}());

(function () {
  function createTodayOrdersUi(deps) {
    function number(value) {
      return Number(value || 0);
    }

    function fmt(value, digits = 3) {
      return deps.formatNumber ? deps.formatNumber(value, digits) : number(value).toLocaleString('en-US');
    }

    function activeOrder(order) {
      return order && !['completed', 'closed'].includes(String(order.status || '').toLowerCase());
    }

    function stagePlace(order, stage = deps.orderStageInfo(order)) {
      if (stage.key === 'weaving') return order.weavingSource || 'النسيج';
      if (stage.key === 'dyehouse') return order.dyehouse || 'المصبغة';
      if (stage.key === 'warehouse') return 'المخزن';
      if (stage.key === 'delivery') return order.customer || 'التسليم';
      return stage.label || '-';
    }

    function row(order, reason, tone = '') {
      const stage = deps.orderStageInfo(order);
      return {
        id: order.id,
        orderNumber: order.orderNumber || '-',
        customer: order.customer || '-',
        fabricType: order.fabricType || '-',
        dyehouse: order.dyehouse || '-',
        stage: stagePlace(order, stage),
        days: number(stage.days),
        quantity: number(order.rawAtDyehouseAvailable || order.warehouseBalance || order.totalWaste || 0),
        wastePercent: number(order.totalWastePercent),
        reason,
        tone,
      };
    }

    function sortRows(rows, primary = (row) => row.days) {
      return rows.slice().sort((a, b) => (
        number(primary(b)) - number(primary(a))
        || number(b.quantity) - number(a.quantity)
        || number(b.wastePercent) - number(a.wastePercent)
        || number(b.days) - number(a.days)
        || String(a.orderNumber).localeCompare(String(b.orderNumber), 'ar')
      ));
    }

    function build() {
      const orders = deps.getCalculatedOrders();
      const active = orders.filter(activeOrder);
      const delayed = sortRows(active
        .filter((order) => number(deps.orderStageInfo(order).days) >= 7)
        .map((order) => row(order, `واقف ${deps.orderStageInfo(order).days} يوم في ${stagePlace(order)}`, 'danger')));
      const dyehouse = sortRows(active
        .filter((order) => number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse) > 0)
        .map((order) => {
          const item = row(order, `${stagePlace(order, { key:'dyehouse', label:'المصبغة' })}: داخل المصبغة ${fmt(order.rawAtDyehouseAvailable || order.remainingAtDyehouse)} كجم`, 'warning');
          item.quantity = number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse);
          return item;
        }), (item) => item.quantity);
      const ready = sortRows(active
        .filter((order) => number(order.warehouseBalance) > 0)
        .map((order) => {
          const dyehouseBalance = number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse);
          const mixedNote = dyehouseBalance > 0 ? ` / مع متبقي في ${stagePlace(order, { key:'dyehouse', label:'المصبغة' })} ${fmt(dyehouseBalance)} كجم` : '';
          const item = row(order, `جاهز للتسليم ${fmt(order.warehouseBalance)} كجم${mixedNote}`, 'success');
          item.quantity = number(order.warehouseBalance);
          return item;
        }), (item) => item.quantity);
      const highWaste = sortRows(orders
        .filter((order) => number(order.totalWastePercent) >= Math.max(8, number(order.expectedWastePercent) + 2))
        .map((order) => {
          const item = row(order, `هالك ${fmt(order.totalWastePercent, 1)}% / ${fmt(order.totalWaste)} كجم`, 'danger');
          item.quantity = number(order.totalWaste);
          return item;
        }), (item) => item.wastePercent);
      const decisions = [
        ...delayed,
        ...dyehouse.filter((item) => !delayed.some((late) => late.id === item.id)),
        ...ready.filter((item) => !delayed.some((late) => late.id === item.id)),
        ...highWaste.filter((item) => !delayed.some((late) => late.id === item.id)),
      ].slice(0, 10);
      return { active, delayed, dyehouse, ready, highWaste, decisions };
    }

    function listHtml(rows, emptyText) {
      if (!rows.length) return `<div class="empty-state">${deps.escapeHtml(emptyText)}</div>`;
      return rows.slice(0, 6).map((item) => `<button type="button" class="today-order-row ${item.tone}" data-today-order="${deps.escapeHtml(item.id)}">
        <strong>${deps.escapeHtml(item.orderNumber)} - ${deps.escapeHtml(item.customer)}</strong>
        <span>${deps.escapeHtml(item.fabricType)} / ${deps.escapeHtml(item.dyehouse)}</span>
        <small>${deps.escapeHtml(item.reason)}</small>
      </button>`).join('');
    }

    function render(panel = deps.refs.todayOrdersPanel || document.getElementById('todayOrdersPanel')) {
      if (!panel) return null;
      const data = build();
      const top = data.decisions[0];
      panel.innerHTML = `<div class="section-head stacked-on-mobile">
        <div><p class="eyebrow">مركز المتابعة الذكي</p><h2>متابعة اليوم</h2><p class="orders-list-note">قراءة واحدة مختصرة لما يحتاج حركة اليوم: المصبغة، المخزن، التأخير، والهالك.</p></div>
        <div class="actions"><button class="mini-btn gold" type="button" data-refresh-today-orders>تحديث</button></div>
      </div>
      <div class="today-orders-kpis">
        <article><span>طلبات مفتوحة</span><strong>${data.active.length}</strong></article>
        <article><span>داخل المصبغة</span><strong>${data.dyehouse.length}</strong></article>
        <article><span>جاهز للتسليم</span><strong>${data.ready.length}</strong></article>
        <article><span>متأخر / هالك</span><strong>${data.delayed.length + data.highWaste.length}</strong></article>
      </div>
      <div class="today-main-action"><span>أهم قرار الآن</span><strong>${deps.escapeHtml(top ? `${top.orderNumber} - ${top.customer}: ${top.reason}` : 'لا توجد أولوية حرجة الآن.')}</strong></div>
      <div class="today-orders-grid">
        <section><h3>ابدأ بها</h3>${listHtml(data.decisions, 'لا توجد قرارات عاجلة الآن.')}</section>
        <section><h3>داخل المصبغة</h3>${listHtml(data.dyehouse, 'لا يوجد رصيد مفتوح داخل المصبغة.')}</section>
        <section><h3>جاهز للتسليم</h3>${listHtml(data.ready, 'لا يوجد رصيد جاهز للتسليم حاليا.')}</section>
        <section><h3>هالك / تأخير</h3>${listHtml([...data.delayed, ...data.highWaste], 'لا توجد تنبيهات تأخير أو هالك مرتفع.')}</section>
      </div>`;
      return data;
    }

    function installTodayOrdersUiHandlers() {
      const panel = deps.refs.todayOrdersPanel || document.getElementById('todayOrdersPanel');
      if (!panel) return;
      panel.addEventListener('click', (event) => {
        if (event.target.closest('[data-refresh-today-orders]')) {
          render(panel);
          return;
        }
        const orderButton = event.target.closest('[data-today-order]');
        if (orderButton && typeof deps.openOrderFocusMode === 'function') deps.openOrderFocusMode(orderButton.dataset.todayOrder);
      });
    }

    return { buildTodayOrders: build, renderTodayOrdersPanel: render, installTodayOrdersUiHandlers };
  }

  window.createTodayOrdersUi = createTodayOrdersUi;
}());

(function () {
  function createFocusViews(deps) {
    function syncOrderFocusMode() {
      document.body.classList.toggle('order-focus-mode', deps.getOrderFocusMode());
    }

    function decorateOrderFocusHeader(order) {
      const refs = deps.refs;
      if (!deps.getOrderFocusMode() || !refs.orderDetailsPanel || refs.orderDetailsPanel.querySelector('.order-focus-toolbar')) return;
      const details = [
        ['الصنف', order?.fabricType || '-'],
        ['المصبغة', order?.dyehouse || '-'],
        ['مصدر النسيج', order?.weavingSource || '-'],
        ['تاريخ الطلب', order?.orderDate || '-'],
      ];
      const detailsHtml = details.map(([label, value])=>`<div class="order-focus-detail"><span>${deps.escapeHtml(label)}</span><strong>${deps.escapeHtml(value)}</strong></div>`).join('');
      refs.orderDetailsPanel.insertAdjacentHTML('afterbegin', `<div class="order-focus-toolbar"><button class="mini-btn gold" id="backToOrdersBtn" type="button">رجوع لقائمة الطلبات</button><div class="order-focus-title"><span class="eyebrow">عرض الطلب وأدواته</span><strong>${deps.escapeHtml(order?.orderNumber || '-')} - ${deps.escapeHtml(order?.customer || '-')}</strong></div><div class="batch-actions"><button class="mini-btn" id="focusEditOrderBtn" type="button">تعديل الطلب</button>${deps.canDeleteRecords() ? '<button class="mini-btn danger" id="focusDeleteOrderBtn" type="button">حذف الطلب</button>' : ''}</div></div><div class="order-focus-details">${detailsHtml}</div>`);
    }

    function closeOrderFocusMode() {
      deps.setOrderFocusMode(false);
      syncOrderFocusMode();
      deps.syncFilteredListMode();
      document.querySelector('.orders-list-panel')?.scrollIntoView({ behavior:'smooth', block:'start' });
    }

    function openOrderFocusMode(orderId) {
      deps.setSelectedOrderId(orderId);
      deps.closeDashboardFocusMode();
      deps.closeAiFocusMode();
      deps.setOrderFocusMode(true);
      syncOrderFocusMode();
      deps.syncFilteredListMode();
      deps.renderDetails();
      deps.refs.orderDetailsPanel?.scrollIntoView({ behavior:'smooth', block:'start' });
    }

    function syncAiFocusMode() {
      document.body.classList.toggle('ai-focus-mode', deps.getAiFocusMode());
    }

    function syncDashboardFocusMode() {
      document.body.classList.toggle('dashboard-focus-mode', deps.getDashboardFocusMode());
    }

    function decorateDashboardFocusHeader() {
      const stats = document.getElementById('statsGrid');
      if (!stats || document.querySelector('[data-dashboard-focus-toolbar]')) return;
      stats.insertAdjacentHTML('beforebegin', '<div class="dashboard-focus-toolbar" data-dashboard-focus-toolbar><button class="mini-btn gold" type="button" id="backFromDashboardBtn">رجوع للنظام</button><div><span class="eyebrow">لوحة مستقلة</span><strong>ملخص الطلبات والمتابعة فقط</strong></div></div>');
    }

    function closeDashboardFocusMode() {
      const wasFocused = deps.getDashboardFocusMode();
      deps.setDashboardFocusMode(false);
      syncDashboardFocusMode();
      document.querySelector('[data-dashboard-focus-toolbar]')?.remove();
      if (wasFocused) document.getElementById('mainWorkspace')?.scrollIntoView({ behavior:'smooth', block:'start' });
    }

    function openDashboardFocusMode() {
      deps.openMainWorkspace();
      deps.closeAiFocusMode();
      deps.closeOrderFocusMode();
      deps.closeSidebar();
      deps.setWorkspaceModule('dashboard');
      deps.setDashboardFocusMode(true);
      syncDashboardFocusMode();
      decorateDashboardFocusHeader();
      deps.renderOperationFollowPanel();
      document.getElementById('statsGrid')?.scrollIntoView({ behavior:'smooth', block:'start' });
    }

    function decorateAiFocusHeader() {
      const panel = document.getElementById('aiModelPanel');
      if (!panel || panel.querySelector('[data-ai-focus-toolbar]')) return;
      panel.insertAdjacentHTML('afterbegin', '<div class="ai-focus-toolbar" data-ai-focus-toolbar><button class="mini-btn gold" type="button" id="backFromAiBtn">رجوع للنظام</button><div><span class="eyebrow">لوحة مستقلة</span><strong>مركز المتابعة الذكي</strong></div></div>');
    }

    function closeAiFocusMode() {
      const wasFocused = deps.getAiFocusMode();
      deps.setAiFocusMode(false);
      syncAiFocusMode();
      document.querySelector('[data-ai-focus-toolbar]')?.remove();
      if (wasFocused) document.getElementById('mainWorkspace')?.scrollIntoView({ behavior:'smooth', block:'start' });
    }

    function openAiFocusMode() {
      deps.openMainWorkspace();
      deps.closeDashboardFocusMode();
      deps.closeOrderFocusMode();
      deps.closeSidebar();
      deps.setAiFocusMode(true);
      syncAiFocusMode();
      decorateAiFocusHeader();
      document.getElementById('aiModelPanel')?.scrollIntoView({ behavior:'smooth', block:'start' });
    }

    return {
      syncOrderFocusMode,
      decorateOrderFocusHeader,
      closeOrderFocusMode,
      openOrderFocusMode,
      syncAiFocusMode,
      syncDashboardFocusMode,
      decorateDashboardFocusHeader,
      closeDashboardFocusMode,
      openDashboardFocusMode,
      decorateAiFocusHeader,
      closeAiFocusMode,
      openAiFocusMode,
    };
  }

  window.createFocusViews = createFocusViews;
})();

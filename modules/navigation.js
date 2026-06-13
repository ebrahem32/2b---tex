(function () {
  function createNavigation(deps) {
    function openMainWorkspace() {
      document.body.classList.add('workspace-open');
      document.getElementById('mainWorkspace')?.removeAttribute('aria-hidden');
    }

    function closeOpenErpMenus(except = null) {
      document.querySelectorAll('.erp-menu.open').forEach((menu) => {
        if (menu !== except) menu.classList.remove('open');
      });
    }

    function closeSidebar() {
      document.body.classList.remove('sidebar-open');
      document.querySelector('[data-sidebar-toggle]')?.setAttribute('aria-expanded', 'false');
    }

    function toggleSidebar() {
      const opened = !document.body.classList.contains('sidebar-open');
      document.body.classList.toggle('sidebar-open', opened);
      document.querySelector('[data-sidebar-toggle]')?.setAttribute('aria-expanded', opened ? 'true' : 'false');
    }

    function setActiveSidebarButton(button = null) {
      document.querySelectorAll('.sidebar-nav button.active').forEach((item) => item.classList.remove('active'));
      if (button) button.classList.add('active');
    }

    function setWorkspaceModule(moduleKey = 'dashboard') {
      const key = String(moduleKey || 'dashboard').trim();
      document.body.dataset.activeModule = key;
      document.querySelectorAll('[data-module-panel]').forEach((panel) => {
        const modules = String(panel.dataset.modulePanel || '').split(/\s+/).filter(Boolean);
        panel.classList.toggle('module-hidden', modules.length > 0 && !modules.includes(key));
      });
    }

    function normalizeReportAction(type = '') {
      return ({
        'raw-available': 'inventory',
        customer: 'customer-account',
        'dyehouse-performance': 'dyehouse-balances',
      })[type] || type;
    }

    function applyStageShortcut(stageValue) {
      const refs = deps.refs;
      if (!stageValue || !refs.orderStatusFilter) return;
      if (stageValue === 'stage:ready-to-dyehouse') stageValue = 'stage:dyehouse';
      if (stageValue === 'stage:delivery') stageValue = 'stage:warehouse';
      if (stageValue === 'stage:color-planning') stageValue = 'stage:weaving';
      if (stageValue === 'stage:glued-ready') stageValue = 'stage:gluing';
      openMainWorkspace();
      deps.closeDashboardFocusMode();
      deps.closeAiFocusMode();
      deps.closeOrderFocusMode();
      refs.orderStatusFilter.value = stageValue;
      deps.renderOrders();
      document.querySelector('.orders-list-panel')?.scrollIntoView({ behavior:'smooth', block:'start' });
    }

    function handleNavMenuAction(action) {
      const refs = deps.refs;
      if (!action) return;
      openMainWorkspace();
      closeOpenErpMenus();
      if (action === 'workspaceHome') {
        deps.openDashboardFocusMode();
        return;
      }
      if (action === 'todayOrders') {
        deps.closeDashboardFocusMode();
        deps.closeAiFocusMode();
        deps.closeOrderFocusMode();
        deps.renderTodayOrdersPanel?.();
        document.getElementById('todayOrdersPanel')?.scrollIntoView({ behavior:'smooth', block:'start' });
        return;
      }
      if (action === 'ordersList') {
        deps.closeDashboardFocusMode();
        deps.closeAiFocusMode();
        deps.closeOrderFocusMode();
        return;
      }
      if (action === 'pricingNew') refs.openPricingFormBtn?.click();
      if (action === 'orderNew') refs.openOrderFormBtn?.click();
      if (action === 'managementReports') refs.openManagementReportsBtn?.click();
      if (action.startsWith('report:')) {
        deps.openManagementReport(normalizeReportAction(action.slice('report:'.length)));
        return;
      }
      if (action === 'aiModel') {
        deps.openAiFocusMode();
        return;
      }
      if (action === 'operationalFollow') {
        deps.closeDashboardFocusMode();
        deps.closeAiFocusMode();
        document.getElementById('operationFollowPanel')?.scrollIntoView({ behavior:'smooth', block:'start' });
        deps.refreshOperationFollowPanel();
      }
      if (action === 'aiAnalyze') {
        deps.openAiFocusMode();
        refs.analyzeReportBtn?.click();
      }
      if (action === 'printFilteredOrders') refs.printFilteredOrdersBtn?.click();
      if (action === 'gluingQueue') deps.openGluingQueueDialog();
      if (action === 'customerAccounts') deps.renderCustomerAccountsDialog();
      if (action === 'a5Accounts') deps.renderA5AccountsDialog();
      if (action === 'whatsappSettings') deps.openWhatsappSettingsDialog().catch((error)=>{ console.error('whatsapp-settings-open-error', error); deps.renderWhatsappSettingsDialog([]); });
      if (action === 'outbox') deps.openOutboxDialog();
      if (action === 'auditLog') deps.openAuditLogDialog().catch(console.error);
      if (action === 'users') deps.openUsersDialog();
      if (action === 'systemStatus') deps.openSystemStatusDialog();
      if (action === 'dyehousePrices') deps.renderDyehousePricesDialog();
      if (action === 'pricingList') { deps.closeDashboardFocusMode(); deps.closeAiFocusMode(); document.querySelector('.pricing-panel')?.scrollIntoView({ behavior:'smooth', block:'start' }); }
      if (action === 'ordersList') { deps.closeDashboardFocusMode(); deps.closeAiFocusMode(); refs.searchInput?.closest('.panel')?.scrollIntoView({ behavior:'smooth', block:'start' }); }
      if (action === 'orderDetails') { deps.closeDashboardFocusMode(); deps.closeAiFocusMode(); refs.orderDetailsPanel?.scrollIntoView({ behavior:'smooth', block:'start' }); }
    }

    return {
      openMainWorkspace,
      closeOpenErpMenus,
      closeSidebar,
      toggleSidebar,
      setActiveSidebarButton,
      setWorkspaceModule,
      normalizeReportAction,
      applyStageShortcut,
      handleNavMenuAction,
    };
  }

  window.createNavigation = createNavigation;
})();

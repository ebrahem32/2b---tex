(function () {
  function createOrdersUi(deps) {
    const {
      refs,
      filteredOrders,
      renderStats,
      renderErpCockpit,
      orderStageInfo,
      formatNumber,
      escapeHtml,
      canDeleteRecords,
      activeOrderFilterSummary,
      getOrderFocusMode,
      getCalculatedOrders,
    } = deps;

function ordersListHeadingForCurrentFilter(list = []) {
  const status = refs.orderStatusFilter?.value || 'all';
  const stageHeadings = {
    'stage:weaving': {
      eyebrow: '\u0631\u0635\u064a\u062f \u0627\u0644\u0646\u0633\u064a\u062c',
      title: '\u0631\u0635\u064a\u062f \u0627\u0644\u0646\u0633\u064a\u062c',
      subtitle: '\u062a\u062c\u0645\u064a\u0639 \u0648\u0627\u062d\u062f \u0644\u0643\u0644 \u0623\u0648\u0627\u0645\u0631 \u0627\u0644\u0646\u0633\u064a\u062c \u0628\u062f\u0648\u0646 \u062a\u0642\u0633\u064a\u0645 \u0628\u064a\u0646 \u0628\u0627\u0646\u062a\u0638\u0627\u0631 \u0627\u0644\u0627\u0633\u062a\u0644\u0627\u0645 \u0648\u0648\u0627\u0642\u0641 \u0641\u064a \u0627\u0644\u0646\u0633\u064a\u062c.'
    },
    'stage:gluing': {
      eyebrow: '\u062f\u0645\u062c',
      title: '\u062f\u0645\u062c',
      subtitle: '\u062a\u062c\u0645\u064a\u0639 \u0648\u0627\u062d\u062f \u0644\u0643\u0644 \u062d\u0631\u0643\u0627\u062a \u062f\u0645\u062c \u0627\u0644\u062e\u0627\u0645\u0627\u062a \u0628\u062f\u0648\u0646 \u062a\u0642\u0633\u064a\u0645\u0627\u062a \u0641\u0631\u0639\u064a\u0629.'
    },
    'stage:dyehouse': {
      eyebrow: '\u062f\u0627\u062e\u0644 \u0627\u0644\u0645\u0635\u0628\u063a\u0629',
      title: '\u0631\u0635\u064a\u062f \u0627\u0644\u0645\u0635\u0628\u063a\u0629',
      subtitle: '\u0623\u0648\u0627\u0645\u0631 \u062a\u0645 \u062a\u0633\u0644\u064a\u0645 \u0642\u0645\u0627\u0634 \u0645\u0646\u0647\u0627 \u0644\u0644\u0645\u0635\u0628\u063a\u0629 \u0648\u0644\u0645 \u064a\u0643\u062a\u0645\u0644 \u0627\u0633\u062a\u0644\u0627\u0645 \u0627\u0644\u0645\u062c\u0647\u0632.'
    },
    'stage:warehouse': {
      eyebrow: '\u0631\u0635\u064a\u062f \u0627\u0644\u0645\u062e\u0632\u0646',
      title: '\u0631\u0635\u064a\u062f \u0627\u0644\u0645\u062e\u0632\u0646 / \u062c\u0627\u0647\u0632 \u0644\u0644\u062a\u0633\u0644\u064a\u0645',
      subtitle: '\u0643\u0644 \u0623\u0645\u0631 \u0644\u0647 \u0631\u0635\u064a\u062f \u0645\u062e\u0632\u0646 \u0641\u0639\u0644\u064a\u060c \u062d\u062a\u0649 \u0644\u0648 \u0643\u0627\u0646 \u0645\u063a\u0644\u0642\u064b\u0627 \u062a\u0634\u063a\u064a\u0644\u064a\u064b\u0627 \u0623\u0648 \u0628\u0647 \u0631\u0635\u064a\u062f \u0633\u0627\u0644\u0628 \u064a\u062d\u062a\u0627\u062c \u0645\u0631\u0627\u062c\u0639\u0629.'
    },
  };
  const heading = stageHeadings[status];
  if (heading) return { ...heading, count: list.length };
  if (hasActiveOrderFilter()) return {
    eyebrow: '\u0646\u062a\u0627\u0626\u062c \u0627\u0644\u0641\u0644\u062a\u0631\u0629',
    title: '\u0642\u0627\u0626\u0645\u0629 \u0645\u0641\u0644\u062a\u0631\u0629',
    subtitle: activeOrderFilterSummary(),
    count: list.length
  };
  return {
    eyebrow: '\u0627\u0644\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629',
    title: '\u0627\u0644\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629',
    subtitle: '',
    count: list.length
  };
}

function updateOrdersListHeading(list = []) {
  const panel = document.querySelector('.orders-list-panel');
  const head = panel?.querySelector('.section-head > div');
  if (!head) return;
  const heading = ordersListHeadingForCurrentFilter(list);
  let note = head.querySelector('[data-orders-list-note]');
  if (!note) {
    note = document.createElement('p');
    note.className = 'orders-list-note';
    note.dataset.ordersListNote = 'true';
    head.appendChild(note);
  }
  const eyebrow = head.querySelector('.eyebrow');
  const title = head.querySelector('h2');
  if (eyebrow) eyebrow.textContent = heading.eyebrow;
  if (title) title.textContent = `${heading.title} (${heading.count})`;
  note.textContent = heading.subtitle || '';
  note.hidden = !heading.subtitle;
}

function orderRowHtml(order) {
  const stage = orderStageInfo(order);
  const waitingText = stage.startDate ? `${stage.startDate} / ${stage.days} يوم` : '-';
  return `<tr class="order-result-row" data-order-row="${order.id}">
      <td data-label="رقم الطلب"><strong class="order-number-cell">${escapeHtml(order.orderNumber || '-')}</strong></td>
      <td data-label="العميل">${escapeHtml(order.customer || '-')}</td>
      <td data-label="الصنف">${escapeHtml(order.fabricType || '-')}</td>
      <td data-label="الأرصدة">
        <div class="order-balance-stack" aria-label="أرصدة الطلب">
          <span><em>خام</em><strong>${formatNumber(order.totalRawOrdered || 0)}</strong></span>
          <span><em>مصبغة</em><strong>${formatNumber(order.totalSentToDyehouse || 0)}</strong></span>
          <span class="emphasis"><em>مخزن</em><strong>${formatNumber(order.warehouseBalance || 0)}</strong></span>
        </div>
      </td>
      <td data-label="المرحلة"><span class="status ${order.status}" title="${escapeHtml(stage.reason)}">${escapeHtml(stage.label)}</span><small class="order-stage-age">${escapeHtml(waitingText)}</small></td>
      <td data-label="إجراءات"><div class="batch-actions"><button class="mini-btn" data-view="${order.id}">عرض</button><button class="mini-btn" data-edit-order="${order.id}">تعديل</button>${canDeleteRecords() ? `<button class="mini-btn danger" data-delete-order="${order.id}">حذف</button>` : ''}</div></td>
    </tr>`;
}

function renderOrderRows(body, list, emptyText) {
  if (!body) return;
  body.innerHTML = list.map(orderRowHtml).join('') || `<tr><td colspan="6">${emptyText}</td></tr>`;
}

function sortDesc(list, valueOf) {
  return [...list].sort((a, b) => Number(valueOf(b) || 0) - Number(valueOf(a) || 0));
}

function renderStageScreens() {
  const source = typeof getCalculatedOrders === 'function' ? getCalculatedOrders() : filteredOrders();
  const weaving = sortDesc(
    source.filter((order) => ['weaving', 'color-planning'].includes(orderStageInfo(order).key)),
    (order) => Math.max(Number(order.totalRawOrdered || 0) - Number(order.totalRawReceived || 0), 0)
  );
  const dyehouse = sortDesc(
    source.filter((order) => {
      const stage = orderStageInfo(order).key;
      return ['dyehouse', 'gluing', 'glued-ready'].includes(stage)
        || Number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse || 0) > 0
        || Number(order.gluingBalance || 0) > 0
        || Number(order.gluedProductBalance || 0) > 0;
    }),
    (order) => Number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse || order.gluingBalance || order.gluedProductBalance || 0)
  );
  const warehouse = sortDesc(
    source.filter((order) => Number(order.warehouseBalance || 0) !== 0),
    (order) => Math.abs(Number(order.warehouseBalance || 0))
  );
  renderOrderRows(refs.weavingOrdersTableBody, weaving, 'لا توجد أوامر نسيج مفتوحة حاليًا.');
  renderOrderRows(refs.dyehouseOrdersTableBody, dyehouse, 'لا توجد أوامر داخل المصبغة حاليًا.');
  renderOrderRows(refs.warehouseOrdersTableBody, warehouse, 'لا يوجد رصيد مخزن حاليًا.');
}

function renderOrders() {
  const list = filteredOrders();
  syncFilteredListMode();
  renderStats(list);
  renderErpCockpit(list);
  updateOrdersListHeading(list);
  renderOrderRows(refs.ordersTableBody, list, 'لا توجد طلبات مطابقة للفلتر الحالي.');
  renderStageScreens();
}

function hasActiveOrderFilter() {
  return Boolean(
    String(refs.searchInput?.value || '').trim()
    || (refs.orderStatusFilter?.value && refs.orderStatusFilter.value !== 'all')
    || (refs.customerFilter?.value && refs.customerFilter.value !== 'all')
    || (refs.dyehouseFilter?.value && refs.dyehouseFilter.value !== 'all')
    || (refs.fabricFilter?.value && refs.fabricFilter.value !== 'all')
  );
}

function syncFilteredListMode() {
  document.body.classList.toggle('filtered-list-mode', hasActiveOrderFilter() && !getOrderFocusMode());
}

    return {
      ordersListHeadingForCurrentFilter,
      updateOrdersListHeading,
      renderOrders,
      hasActiveOrderFilter,
      syncFilteredListMode,
    };
  }

  window.createOrdersUi = createOrdersUi;
})();

(function () {
  function createReportsUi(deps) {
    const {
      refs,
      documentHeader,
      documentFooter,
      withDocumentFooter,
      allOrders,
      filteredOrders,
      sum,
      reportNumber,
      reportFmt,
      formatNumber,
      escapeHtml,
      emptyRow,
      orderFilterLabel,
      cleanOperationalStage,
      getOperationalStage,
      stageStartDate,
      daysSince,
      orderMovementDates,
      calculateOrder,
      accessoryFlowQuantityForLine,
      accessoryLineName,
      accessoryPlannedQuantityForLine,
      reportOrderItemsCell,
      getOrders,
      getAllocations,
      getRawBatches,
      getProductionBatches,
      getCustomerBatches,
      getRawReturns,
    } = deps;

function openManagementReportsMenu() {
  refs.documentTitle.textContent = 'التقارير الإدارية';
  refs.documentBody.dataset.documentType = 'management-reports-menu';
  const cards = [
    ['orders-follow', 'تقرير متابعة الطلبات', 'ملخص الطلبات وحالتها من الخام حتى التسليم.'],
    ['dyehouse-balances', 'تقرير أرصدة المصابغ', 'الكميات المتبقية داخل كل مصبغة حسب الطلبات والألوان.'],
    ['inventory', 'تقرير رصيد المخزن', 'رصيد المخزن الحالي حسب الداخل والتسليم.'],
    ['delays', 'تقرير التأخيرات', 'الطلبات المتوقفة أو المتأخرة في مراحل التشغيل.'],
    ['waste-analysis', 'تحليل الهالك', 'مقارنة الهالك التقديري بالهالك الفعلي.'],
    ['customer-account', 'تقرير العملاء', 'ملخص كل عميل داخل نظام المتابعة.'],
    ['order-movement', 'حركة الطلبات', 'تواريخ انتقال الطلبات بين مراحل التشغيل.'],
    ['raw-returns', 'مرتجعات الخام', 'حركات الخام المرتجع من المصبغة أو التشغيل.'],
    ['accessories', 'تقرير الإكسسوار', 'حركات الإكسسوار خروجًا واستلامًا وتسليمًا.'],
  ];
  refs.documentBody.innerHTML = `<div class="document-sheet orders-follow-report">${documentHeader()}<div class="report-title"><h2>التقارير الإدارية</h2><span>اختر التقرير المطلوب لمراجعة التشغيل الحالي.</span></div><div class="management-report-grid no-print">${cards.map(([type,title,desc])=>`<button type="button" class="management-report-card" data-management-report="${type}"><strong>${title}</strong><span>${desc}</span></button>`).join('')}</div><section class="report-section"><h3>قائمة التقارير</h3><table class="follow-table"><thead><tr><th>التقرير</th><th>الوصف</th><th>إجراء</th></tr></thead><tbody>${cards.map(([type,title,desc])=>`<tr><th>${title}</th><td>${desc}</td><td><button type="button" class="mini-btn gold" data-management-report="${type}">فتح التقرير</button></td></tr>`).join('')}</tbody></table></section>${documentFooter()}</div>`;
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
function showManagementReport(title, subtitle, sectionsHtml, reportKey = '') {
  refs.documentTitle.textContent = title;
  refs.documentBody.dataset.documentType = 'management-report';
  refs.documentBody.dataset.reportKey = reportKey || title;
  refs.documentBody.dataset.reportTitle = title;
  refs.documentBody.dataset.reportSubtitle = subtitle;
  const reportHtml = `${documentHeader()}<div class="report-title"><h2>${title}</h2><span>${subtitle}</span></div>${sectionsHtml}`;
  refs.documentBody.innerHTML = `<div class="document-sheet orders-follow-report">${withDocumentFooter(reportHtml)}</div>`;
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
function openManagementReport(type) {
  if (type === 'orders-follow') { if (refs.documentDialog.open) refs.documentDialog.close(); return openOrdersReport(); }
  if (type === 'dyehouse-balances') { if (refs.documentDialog.open) refs.documentDialog.close(); return openDyehouseBalancesReport(); }
  const list = allOrders();
  if (type === 'inventory') {
    const clothRows = [];
    const accessoryRows = [];
    list.forEach((order)=>order.allocations.forEach((allocation)=>{
      const delivered = sum(getCustomerBatches().filter((batch)=>batch.allocationId===allocation.id));
      const balance = reportNumber(Number(allocation.finishedReceived || 0) - delivered);
      if (balance > 0) clothRows.push(`<tr><td>${order.orderNumber}</td><td>${order.customer}</td><td>${order.fabricType || '-'}</td><td>${allocation.color || '-'}</td><td>${allocation.rawInch || order.inchWidth || '-'}</td><td>${allocation.rawWidth || allocation.targetFinishedWidth || '-'}</td><td>${reportFmt(allocation.finishedReceived)}</td><td>${reportFmt(delivered)}</td><td><strong>${reportFmt(balance)}</strong></td></tr>`);
      if (order.accessoryLines.length) {
        order.accessoryLines.forEach((line)=>{
          const received = accessoryFlowQuantityForLine(order, allocation, 'received', line);
          const customerDelivered = accessoryFlowQuantityForLine(order, allocation, 'customer', line);
          const accessoryBalance = reportNumber(received - customerDelivered);
          if (accessoryBalance > 0) accessoryRows.push(`<tr><td>${order.orderNumber}</td><td>${order.customer}</td><td>${allocation.color || '-'}</td><td>${accessoryLineName(line, order)}</td><td>${reportFmt(received)}</td><td>${reportFmt(customerDelivered)}</td><td><strong>${reportFmt(accessoryBalance)}</strong></td></tr>`);
        });
      }
    }));
    return showManagementReport('تقرير رصيد المخزن', 'رصيد القماش والإكسسوار المتاح حسب الداخل للمخزن والتسليم للعميل.', `<section class="report-section"><h3>رصيد القماش الحالي</h3><table class="follow-table"><thead><tr><th>رقم الطلب</th><th>العميل</th><th>الصنف</th><th>اللون</th><th>البوصة</th><th>العرض</th><th>دخل المخزن</th><th>تسليم العميل</th><th>الرصيد الحالي</th></tr></thead><tbody>${clothRows.join('') || '<tr><td colspan="9">لا يوجد رصيد قماش حالي.</td></tr>'}</tbody></table></section><section class="report-section"><h3>رصيد الإكسسوار</h3><table class="follow-table"><thead><tr><th>رقم الطلب</th><th>العميل</th><th>اللون</th><th>نوع الإكسسوار</th><th>مستلم</th><th>مسلم للعميل</th><th>الرصيد الحالي</th></tr></thead><tbody>${accessoryRows.join('') || '<tr><td colspan="7">لا يوجد رصيد إكسسوار حالي.</td></tr>'}</tbody></table></section>`, type);
  }
  if (type === 'delays') {
    const rows = list.filter((order)=>cleanOperationalStage(getOperationalStage(order))!=='مكتمل').map((order)=>{ const stageDate = stageStartDate(order); return { order, stage:cleanOperationalStage(getOperationalStage(order)), stageDate, days:daysSince(stageDate) }; }).sort((a,b)=>b.days-a.days).map(({order,stage,stageDate,days})=>`<tr><td>${order.orderNumber}</td><td>${order.customer}</td><td>${order.fabricType || '-'}</td><td>${order.dyehouse || '-'}</td><td>${stage}</td><td>${stageDate || '-'}</td><td><strong>${days}</strong></td><td>${reportFmt(order.totalRawOrdered)}</td><td>${reportFmt(order.totalFinishedReceived)}</td><td>${reportFmt(order.totalDeliveredToCustomer)}</td></tr>`).join('');
    return showManagementReport('تقرير التأخيرات', 'الطلبات المفتوحة أو المتأخرة حسب مرحلة التشغيل وآخر حركة مسجلة.', `<section class="report-section"><h3>تفاصيل التأخير</h3><table class="follow-table"><thead><tr><th>رقم الطلب</th><th>العميل</th><th>الصنف</th><th>المصبغة</th><th>المرحلة</th><th>تاريخ المرحلة</th><th>أيام الانتظار</th><th>خام مطلوب</th><th>دخل المخزن</th><th>تسليم العميل</th></tr></thead><tbody>${rows || '<tr><td colspan="10">لا توجد طلبات متأخرة حاليًا.</td></tr>'}</tbody></table></section>`, type);
  }
  if (type === 'waste-analysis') {
    const rows = list.flatMap((order)=>order.allocations.map((allocation)=>`<tr><td>${order.orderNumber}</td><td>${order.customer}</td><td>${order.fabricType || '-'}</td><td>${allocation.color || '-'}</td><td>${allocation.dyehouse || '-'}</td><td>${reportFmt(allocation.plannedQuantity)}</td><td>${reportFmt(allocation.finishedReceived)}</td><td>${reportFmt(allocation.expectedWasteQuantity)} (${reportFmt(allocation.expectedWastePercent,2)}%)</td><td>${reportFmt(allocation.wasteQuantity)} (${reportFmt(allocation.wastePercent,2)}%)</td><td>${reportFmt(Number(allocation.wasteQuantity || 0) - Number(allocation.expectedWasteQuantity || 0))}</td></tr>`)).join('');
    return showManagementReport('تحليل الهالك', 'مقارنة الهالك التقديري بالهالك الفعلي حسب كل لون.', `<section class="report-section"><h3>تفاصيل الهالك</h3><table class="follow-table"><thead><tr><th>رقم الطلب</th><th>العميل</th><th>الصنف</th><th>اللون</th><th>المصبغة</th><th>المخطط</th><th>دخل المخزن</th><th>هالك تقديري</th><th>هالك فعلي</th><th>الفرق</th></tr></thead><tbody>${rows || '<tr><td colspan="10">لا توجد بيانات هالك حاليًا.</td></tr>'}</tbody></table></section>`, type);
  }
  if (type === 'customer-account') {
    const groups = {};
    list.forEach((order)=>{ const key = order.customer || '-'; groups[key] = groups[key] || { count:0, contract:0, raw:0, finished:0, delivered:0, balance:0, open:0 }; groups[key].count += 1; groups[key].contract += Number(order.contractTotal || order.totalContract || (Number(order.kiloPrice || 0) * Number(order.totalRawOrdered || 0)) || 0); groups[key].raw += Number(order.totalRawOrdered || 0); groups[key].finished += Number(order.totalFinishedReceived || 0); groups[key].delivered += Number(order.totalDeliveredToCustomer || 0); groups[key].balance += Number(order.warehouseBalance || 0); if (cleanOperationalStage(getOperationalStage(order))!=='مكتمل') groups[key].open += 1; });
    const rows = Object.entries(groups).sort((a,b)=>a[0].localeCompare(b[0],'ar')).map(([customer,data])=>`<tr><td>${customer}</td><td>${data.count}</td><td>${reportFmt(data.contract,2)}</td><td>${reportFmt(data.raw)}</td><td>${reportFmt(data.finished)}</td><td>${reportFmt(data.delivered)}</td><td>${reportFmt(data.balance)}</td><td>${data.open}</td></tr>`).join('');
    return showManagementReport('تقرير العملاء', 'ملخص كل عميل داخل نظام المتابعة.', `<section class="report-section"><h3>ملخص العملاء</h3><table class="follow-table"><thead><tr><th>العميل</th><th>عدد الطلبات</th><th>إجمالي العقود</th><th>خام مطلوب</th><th>دخل المخزن</th><th>تسليم العميل</th><th>رصيد المخزن</th><th>طلبات مفتوحة</th></tr></thead><tbody>${rows || '<tr><td colspan="8">لا توجد بيانات عملاء.</td></tr>'}</tbody></table></section>`, type);
  }
  if (type === 'order-movement') {
    const rows = list.map((order)=>{ const dates = orderMovementDates(order); return `<tr><td>${order.orderNumber}</td><td>${order.customer}</td><td>${order.fabricType || '-'}</td><td>${dates.orderDate}</td><td>${dates.weavingDate}</td><td>${dates.dyehouseDate}</td><td>${dates.customerDate}</td><td>${cleanOperationalStage(getOperationalStage(order))}</td></tr>`; }).join('');
    return showManagementReport('حركة الطلبات', 'تواريخ انتقال الطلبات بين مراحل التشغيل.', `<section class="report-section"><h3>تواريخ الحركة</h3><table class="follow-table"><thead><tr><th>رقم الطلب</th><th>العميل</th><th>الصنف</th><th>تاريخ الطلب</th><th>خروج الخام للمصبغة</th><th>دخول المخزن</th><th>تسليم العميل</th><th>مرحلة التشغيل</th></tr></thead><tbody>${rows || '<tr><td colspan="8">لا توجد حركات طلبات.</td></tr>'}</tbody></table></section>`, type);
  }
  if (type === 'raw-returns') {
    const rows = getRawReturns().map((batch)=>{ const allocation = getAllocations().find((item)=>item.id===batch.allocationId); const sourceOrder = getOrders().find((item)=>item.id===batch.orderId || item.id===allocation?.orderId); const order = sourceOrder ? calculateOrder(sourceOrder) : { orderNumber:'-', customer:'-' }; return `<tr><td>${batch.date || '-'}</td><td>${order.orderNumber || '-'}</td><td>${order.customer || '-'}</td><td>${allocation?.color || '-'}</td><td>${allocation?.dyehouse || '-'}</td><td>${reportFmt(batch.quantity)}</td><td>${batch.noteNumber || '-'}</td><td>${batch.notes || '-'}</td></tr>`; }).join('');
    return showManagementReport('مرتجعات الخام', 'حركات الخام المرتجع من المصبغة أو التشغيل.', `<section class="report-section"><h3>تفاصيل المرتجعات</h3><table class="follow-table"><thead><tr><th>التاريخ</th><th>رقم الطلب</th><th>العميل</th><th>اللون</th><th>المصبغة</th><th>الكمية</th><th>رقم الإذن</th><th>ملاحظات</th></tr></thead><tbody>${rows || '<tr><td colspan="8">لا توجد مرتجعات خام.</td></tr>'}</tbody></table></section>`, type);
  }
  if (type === 'accessories') {
    const rows = [];
    list.filter((order)=>order.accessoryLines.length).forEach((order)=>order.allocations.forEach((allocation)=>{
      order.accessoryLines.forEach((line)=>{
        const required = accessoryPlannedQuantityForLine(order, allocation, line);
        const sent = accessoryFlowQuantityForLine(order, allocation, 'sent', line);
        const received = accessoryFlowQuantityForLine(order, allocation, 'received', line);
        const delivered = accessoryFlowQuantityForLine(order, allocation, 'customer', line);
        rows.push(`<tr><td>${order.orderNumber}</td><td>${order.customer}</td><td>${allocation.color || '-'}</td><td>${accessoryLineName(line, order)}</td><td>${reportFmt(required)}</td><td>${reportFmt(sent)}</td><td>${reportFmt(received)}</td><td>${reportFmt(delivered)}</td><td>${reportFmt(received - delivered)}</td></tr>`);
      });
    }));
    return showManagementReport('تقرير الإكسسوار', 'حركات الإكسسوار خروجًا واستلامًا وتسليمًا.', `<section class="report-section"><h3>تفاصيل الإكسسوار</h3><table class="follow-table"><thead><tr><th>رقم الطلب</th><th>العميل</th><th>اللون</th><th>نوع الإكسسوار</th><th>المطلوب</th><th>المرسل</th><th>المستلم</th><th>المسلم للعميل</th><th>الرصيد</th></tr></thead><tbody>${rows.join('') || '<tr><td colspan="9">لا توجد حركات إكسسوار.</td></tr>'}</tbody></table></section>`, type);
  }
}

function activeOrderFilterSummary() {
  const parts = [];
  const query = refs.searchInput?.value?.trim();
  if (query) parts.push(`بحث: ${query}`);
  if (refs.customerFilter?.value && refs.customerFilter.value !== 'all') parts.push(`العميل: ${refs.customerFilter.value}`);
  if (refs.dyehouseFilter?.value && refs.dyehouseFilter.value !== 'all') parts.push(`المصبغة: ${refs.dyehouseFilter.value}`);
  if (refs.fabricFilter?.value && refs.fabricFilter.value !== 'all') parts.push(`الصنف: ${refs.fabricFilter.value}`);
  if (refs.orderStatusFilter?.value && refs.orderStatusFilter.value !== 'all') parts.push(`الحالة: ${orderFilterLabel(refs.orderStatusFilter.value)}`);
  return parts.join(' | ') || 'كل الطلبات الظاهرة';
}
function openOrdersReport(sourceList = null, title = 'تقرير متابعة الطلبات', subtitle = 'ملخص الطلبات وحالتها من الخام والإكسسوار حتى التسليم.', reportKey = 'orders-follow') {
  const list = Array.isArray(sourceList) ? sourceList : allOrders();
  const fmt = (value) => Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
  const totals = list.reduce((acc, order)=>{
    acc.raw += Number(order.totalRawOrdered || 0);
    acc.received += Number(order.totalRawReceived || 0);
    acc.sent += Number(order.totalSentToDyehouse || 0);
    acc.finished += Number(order.totalFinishedReceived || 0);
    acc.delivered += Number(order.totalDeliveredToCustomer || 0);
    acc.balance += Number(order.warehouseBalance || 0);
    acc.waste += Number(order.totalWaste || 0);
    acc.accessoryRequired += Number(order.accessoryRequired || 0);
    acc.accessorySent += Number(order.accessorySent || 0);
    acc.accessoryReceived += Number(order.accessoryReceived || 0);
    acc.accessoryDelivered += Number(order.accessoryDelivered || 0);
    acc.accessoryBalance += Number(order.accessoryBalance || 0);
    return acc;
  }, { raw:0, received:0, sent:0, finished:0, delivered:0, balance:0, waste:0, accessoryRequired:0, accessorySent:0, accessoryReceived:0, accessoryDelivered:0, accessoryBalance:0 });
  const hasAccessory = ['accessoryRequired','accessorySent','accessoryReceived','accessoryDelivered','accessoryBalance'].some((key)=>Number(totals[key] || 0) !== 0);
  const summaryAccessoryRow = hasAccessory ? `<tr><th>إجمالي الإكسسوار المطلوب</th><td>${fmt(totals.accessoryRequired)}</td><th>إكسسوار مستلم</th><td>${fmt(totals.accessoryReceived)}</td><th>رصيد الإكسسوار</th><td>${fmt(totals.accessoryBalance)}</td></tr>` : '';
  const summary = `<section class="report-section"><h3>ملخص الكميات</h3><table class="summary-table compact-summary"><tbody><tr><th>عدد الطلبات</th><td>${list.length}</td><th>إجمالي الخام المطلوب</th><td>${fmt(totals.raw)}</td><th>مرسل للمصبغة</th><td>${fmt(totals.sent)}</td></tr><tr><th>دخل المخزن</th><td>${fmt(totals.finished)}</td><th>رصيد المخزن</th><td>${fmt(totals.balance)}</td><th>تسليم العميل</th><td>${fmt(totals.delivered)}</td></tr>${summaryAccessoryRow}</tbody></table></section>`;
  const columns = [
    ['رقم الطلب', (order)=>order.orderNumber || '-'],
    ['العميل', (order)=>order.customer || '-'],
    ['الصنف والكميات', (order)=>`<strong class="report-item-title">${escapeHtml(order.fabricType || '-')}</strong>${reportOrderItemsCell(order)}`],
    ['المصبغة', (order)=>order.dyehouse || '-'],
    ['المرحلة', (order)=>cleanOperationalStage(getOperationalStage(order))],
    ['مرسل', (order)=>fmt(order.totalSentToDyehouse)],
    ['مخزن', (order)=>fmt(order.totalFinishedReceived)],
    ['رصيد', (order)=>fmt(order.warehouseBalance)],
    ['تسليم', (order)=>fmt(order.totalDeliveredToCustomer)],
    ['هالك', (order)=>`${fmt(order.totalWaste)} (${formatNumber(order.totalWastePercent || 0, 1)}%)`],
  ];
  const rows = list.map((order)=>`<tr>${columns.map(([, getter])=>`<td>${getter(order)}</td>`).join('')}</tr>`).join('');
  const table = `<section class="report-section"><h3>تفاصيل الطلبات</h3><table class="follow-table filtered-follow-table"><thead><tr>${columns.map(([label])=>`<th>${label}</th>`).join('')}</tr></thead><tbody>${rows || emptyRow(columns.length, 'لا توجد طلبات مسجلة.')}</tbody></table></section>`;
  showManagementReport(title, subtitle, `${summary}${table}`, reportKey);
}
function openFilteredOrdersReport() {
  const list = filteredOrders();
  const summary = activeOrderFilterSummary();
  openOrdersReport(list, 'تقرير الطلبات حسب الفلترة', `${summary} - عدد الطلبات: ${list.length}`, 'filtered-orders');
}
function openDyehouseBalancesReport() {
  const list = allOrders();
  const labels = {
    title:'\u0623\u0631\u0635\u062f\u0629 \u0627\u0644\u0645\u0635\u0627\u0628\u063a \u0627\u0644\u0641\u0639\u0644\u064a\u0629',
    subtitle:'\u0645\u0627 \u0647\u0648 \u0645\u0648\u062c\u0648\u062f \u0627\u0644\u0622\u0646 \u062f\u0627\u062e\u0644 \u0643\u0644 \u0645\u0635\u0628\u063a\u0629 \u0628\u0639\u062f \u062e\u0635\u0645 \u0643\u0644 \u0627\u0633\u062a\u0644\u0627\u0645 \u0645\u062c\u0647\u0632 \u0645\u0633\u062c\u0644\u060c \u0644\u062a\u0648\u062c\u064a\u0647 \u0623\u0648\u0627\u0645\u0631 \u062c\u062f\u064a\u062f\u0629 \u0623\u0648 \u0646\u0642\u0644 \u0623\u0648\u0627\u0645\u0631 \u0628\u064a\u0646 \u0627\u0644\u0645\u0635\u0627\u0628\u063a.',
    summary:'\u0645\u0644\u062e\u0635 \u0627\u0644\u0631\u0635\u064a\u062f \u062f\u0627\u062e\u0644 \u0627\u0644\u0645\u0635\u0627\u0628\u063a \u0627\u0644\u0622\u0646',
    details:'\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0623\u0648\u0627\u0645\u0631 \u0627\u0644\u0645\u0648\u062c\u0648\u062f\u0629 \u062f\u0627\u062e\u0644 \u0627\u0644\u0645\u0635\u0628\u063a\u0629',
    dyehouse:'\u0627\u0644\u0645\u0635\u0628\u063a\u0629', activeOrders:'\u0623\u0648\u0627\u0645\u0631 \u0645\u0641\u062a\u0648\u062d\u0629 \u062f\u0627\u062e\u0644\u0647\u0627', activeColors:'\u0623\u0644\u0648\u0627\u0646 \u062f\u0627\u062e\u0644\u0647\u0627', sent:'\u0645\u0631\u0633\u0644 \u0644\u0644\u0645\u0635\u0628\u063a\u0629', received:'\u0645\u0633\u062a\u0644\u0645 \u0645\u0646 \u0627\u0644\u0645\u0635\u0628\u063a\u0629', remaining:'\u0627\u0644\u0631\u0635\u064a\u062f \u0627\u0644\u0641\u0639\u0644\u064a \u062f\u0627\u062e\u0644 \u0627\u0644\u0645\u0635\u0628\u063a\u0629', oldest:'\u0623\u0642\u062f\u0645 \u0627\u0633\u062a\u0644\u0627\u0645 \u062e\u0627\u0645', maxDays:'\u0623\u0643\u0628\u0631 \u0623\u064a\u0627\u0645 \u0648\u0642\u0648\u0641', planned:'\u0627\u0644\u0645\u062e\u0637\u0637', order:'\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628', customer:'\u0627\u0644\u0639\u0645\u064a\u0644', item:'\u0627\u0644\u0635\u0646\u0641', color:'\u0627\u0644\u0644\u0648\u0646', sentDate:'\u062a\u0627\u0631\u064a\u062e \u0627\u0633\u062a\u0644\u0627\u0645 \u0627\u0644\u062e\u0627\u0645', lastReceived:'\u062a\u0627\u0631\u064a\u062e \u062a\u0633\u0644\u064a\u0645 \u0627\u0644\u0645\u0635\u0628\u063a', days:'\u0623\u064a\u0627\u0645 \u0627\u0644\u0648\u0642\u0648\u0641',
    emptySummary:'\u0644\u0627 \u062a\u0648\u062c\u062f \u0623\u0631\u0635\u062f\u0629 \u0641\u0639\u0644\u064a\u0629 \u062f\u0627\u062e\u0644 \u0627\u0644\u0645\u0635\u0627\u0628\u063a \u062d\u0627\u0644\u064a\u064b\u0627.', emptyDetails:'\u0644\u0627 \u062a\u0648\u062c\u062f \u0623\u0648\u0627\u0645\u0631 \u0645\u0641\u062a\u0648\u062d\u0629 \u062f\u0627\u062e\u0644 \u0627\u0644\u0645\u0635\u0627\u0628\u063a.'
  };
  const groups = {};
  const detailRows = [];
  const firstMovementDate = (collection, allocationId, orderId = '') => collection.filter((batch)=>batch.allocationId === allocationId || (!batch.allocationId && batch.orderId === orderId)).map((batch)=>batch.date || '').filter(Boolean).sort()[0] || '';
  list.forEach((order)=>{
    (order.allocations || []).forEach((allocation)=>{
      const name = allocation.dyehouse || order.dyehouse || '-';
      const sent = reportNumber(allocation.sentToDyehouse || 0);
      const received = reportNumber(allocation.finishedReceived || 0);
      const remaining = reportNumber(Math.max(sent - received, 0));
      const sentDate = firstMovementDate(getRawBatches(), allocation.id, order.id);
      const receivedDate = firstMovementDate(getProductionBatches(), allocation.id);
      const waitingDays = remaining > 0 ? daysSince(sentDate) : 0;
      groups[name] = groups[name] || { activeOrders:new Set(), activeColors:0, sent:0, received:0, remaining:0, oldestDate:'', maxDays:0 };
      groups[name].sent += sent;
      groups[name].received += received;
      groups[name].remaining += remaining;
      if (remaining > 0) {
        groups[name].activeOrders.add(order.orderNumber);
        groups[name].activeColors += 1;
        groups[name].maxDays = Math.max(groups[name].maxDays, waitingDays);
        if (sentDate && (!groups[name].oldestDate || sentDate < groups[name].oldestDate)) groups[name].oldestDate = sentDate;
        detailRows.push(`<tr><td>${name}</td><td>${order.orderNumber || '-'}</td><td>${order.customer || '-'}</td><td>${order.fabricType || '-'}</td><td>${allocation.color || '-'}</td><td>${reportFmt(allocation.plannedQuantity || 0)}</td><td>${reportFmt(sent)}</td><td>${reportFmt(received)}</td><td><strong>${reportFmt(remaining)}</strong></td><td>${sentDate || '-'}</td><td>${receivedDate || '-'}</td><td>${waitingDays}</td></tr>`);
      }
    });
  });
  const rows = Object.entries(groups).filter(([, data])=>reportNumber(data.remaining) > 0).sort((a,b)=>b[1].remaining - a[1].remaining).map(([name,data])=>`<tr><td>${name}</td><td>${data.activeOrders.size}</td><td>${data.activeColors}</td><td>${reportFmt(data.sent)}</td><td>${reportFmt(data.received)}</td><td><strong>${reportFmt(data.remaining)}</strong></td><td>${data.oldestDate || '-'}</td><td>${data.maxDays}</td></tr>`).join('');
  const summaryHead = `<tr><th>${labels.dyehouse}</th><th>${labels.activeOrders}</th><th>${labels.activeColors}</th><th>${labels.sent}</th><th>${labels.received}</th><th>${labels.remaining}</th><th>${labels.oldest}</th><th>${labels.maxDays}</th></tr>`;
  const detailsHead = `<tr><th>${labels.dyehouse}</th><th>${labels.order}</th><th>${labels.customer}</th><th>${labels.item}</th><th>${labels.color}</th><th>${labels.planned}</th><th>${labels.sent}</th><th>${labels.received}</th><th>${labels.remaining}</th><th>${labels.sentDate}</th><th>${labels.lastReceived}</th><th>${labels.days}</th></tr>`;
  const html = `<section class="report-section"><h3>${labels.summary}</h3><table class="follow-table"><thead>${summaryHead}</thead><tbody>${rows || `<tr><td colspan="8">${labels.emptySummary}</td></tr>`}</tbody></table></section><section class="report-section"><h3>${labels.details}</h3><table class="follow-table"><thead>${detailsHead}</thead><tbody>${detailRows.join('') || `<tr><td colspan="12">${labels.emptyDetails}</td></tr>`}</tbody></table></section>`;
  showManagementReport(labels.title, labels.subtitle, html, 'dyehouse-balances');
}

    return {
      openManagementReportsMenu,
      showManagementReport,
      openManagementReport,
      activeOrderFilterSummary,
      openOrdersReport,
      openFilteredOrdersReport,
      openDyehouseBalancesReport,
    };
  }

  window.createReportsUi = createReportsUi;
})();
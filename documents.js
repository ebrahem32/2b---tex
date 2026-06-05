(function () {
  function createBuilders(deps) {
    const {
      documentFooter,
      documentHeader,
      documentLogo,
      emptyRow,
      escapeHtml,
      formatNumber,
      orderRawCost,
      rawPermitImagesSection,
      reportOperationNotes,
      uniqueNonEmpty,
      sum,
      roundNumber,
      accessoryTypesLabel,
    } = deps;

    const safeText = (value) => escapeHtml(value === undefined || value === null || value === '' ? '-' : value);
    const fmt = (value, digits = 3) => formatNumber(Number(value || 0), digits);
    const clean = (value) => String(value || '').trim();
    const customerName = (order) => clean(order?.customer || order?.customerName || order?.clientName || '');

    function uniqueBy(rows, keyFactory) {
      const seen = new Set();
      return (rows || []).filter((row, index) => {
        const key = keyFactory(row, index);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    function orderAllocations(order) {
      return uniqueBy(Array.isArray(order?.allocations) ? order.allocations : [], (line, index) => [
        line.id || index,
        clean(line.color || line.pantoneCode),
        clean(line.dyehouse || order?.dyehouse),
        Number(line.plannedQuantity || 0),
        clean(line.rawInch || order?.inchWidth),
        clean(line.targetFinishedWidth || line.rawWidth),
        clean(line.targetFinishedWeight),
      ].join('|'));
    }

    function orderAccessoryLines(order) {
      const configuredLines = Array.isArray(order?.accessoryLines) ? order.accessoryLines : [];
      const normalized = configuredLines
        .map((line) => ({
          type: clean(line.type || 'إكسسوار'),
          percent: Number(line.percent || 0),
          quantity: Number(line.quantityManual || line.quantity || 0),
        }))
        .filter((line) => line.type || line.percent || line.quantity);
      if (normalized.length) {
        const byType = new Map();
        normalized.forEach((line) => {
          const key = clean(line.type || 'إكسسوار');
          const current = byType.get(key) || { type: key, percent: 0, quantity: 0 };
          current.percent += Number(line.percent || 0);
          current.quantity += Number(line.quantity || 0);
          byType.set(key, current);
        });
        return Array.from(byType.values()).map((line) => ({
          ...line,
          percent: roundNumber(line.percent),
          quantity: roundNumber(line.quantity),
        }));
      }

      const allocationRequired = orderAllocations(order).reduce((total, line) => total + Number(line.accessoryQuantity || 0), 0);
      const quantity = Number(order?.accessoryRequired || 0) || allocationRequired;
      const percent = Number(order?.accessoryPercent || 0);
      const type = clean(order?.accessoryType || '');
      if (!type && !percent && !quantity) return [];
      return [{ type: type || 'إكسسوار', percent, quantity }];
    }

    function reportShell(title, order, body, options = {}) {
      const subtitle = options.subtitle ? `<span>${safeText(options.subtitle)}</span>` : '';
      return `<div class="two-b-report">${documentHeader()}<div class="report-title"><h2>${safeText(title)}${order?.orderNumber ? ` <small># ${safeText(order.orderNumber)}</small>` : ''}</h2>${subtitle}</div>${basicInfoSection(order, options)}${body}${documentFooter()}</div>`;
    }

    function basicInfoSection(order, options = {}) {
      const omitted = new Set(['رقم الطلب', ...(options.omitBasicFields || [])]);
      const fields = [
        ['رقم الطلب', order?.orderNumber],
        ['العميل', customerName(order)],
        ['التاريخ', options.date || order?.orderDate],
        ['الصنف', order?.fabricType],
        ['إجمالي الخام', `${fmt(order?.totalRawOrdered)} كجم`],
        ['المصبغة', options.dyehouse || order?.dyehouse],
      ].filter(([label]) => !omitted.has(label));
      if (options.rawNotes && !omitted.has('إذن الخام')) fields.push(['إذن الخام', options.rawNotes]);
      return `<div class="document-meta">${fields.map(([label, value]) => `<div><span>${safeText(label)}</span>${safeText(value)}</div>`).join('')}</div>`;
    }

    function colorRows(order, rows = orderAllocations(order), options = {}) {
      const includeDyehouse = !!options.includeDyehouse;
      const includeInch = options.includeInch || order?.widthMode === 'multiple';
      const includeFinished = options.includeFinished !== false;
      const includeReceived = !!options.includeReceived;
      const includeCustomerDelivered = !!options.includeCustomerDelivered;
      const includeWaste = !!options.includeWaste;
      const headers = [
        'اللون',
        includeInch ? 'البوصة' : '',
        'الكمية',
        includeDyehouse ? 'المصبغة' : '',
        'العرض',
        includeFinished ? 'الوزن المجهز' : '',
        includeReceived ? 'دخل المخزن' : '',
        includeCustomerDelivered ? 'تسليم العميل' : '',
        includeWaste ? 'الهالك الفعلي' : '',
      ].filter(Boolean);
      const body = rows.map((line) => {
        const cells = [
          safeText(line.color || line.pantoneCode),
          includeInch ? safeText(line.rawInch || order?.inchWidth) : '',
          fmt(line.plannedQuantity),
          includeDyehouse ? safeText(line.dyehouse || order?.dyehouse) : '',
          safeText(line.targetFinishedWidth || line.rawWidth),
          includeFinished ? safeText(line.targetFinishedWeight) : '',
          includeReceived ? fmt(line.finishedReceived) : '',
          includeCustomerDelivered ? fmt(line.deliveredToCustomer || line.customerDelivered) : '',
          includeWaste ? `${fmt(line.wasteQuantity)} (${formatNumber(Number(line.wastePercent || 0), 1)}%)` : '',
        ].filter((cell) => cell !== '');
        return `<tr>${cells.map((cell) => `<td>${cell}</td>`).join('')}</tr>`;
      }).join('');
      return `<section class="report-section"><h3>جدول الألوان</h3><table><thead><tr>${headers.map((head) => `<th>${safeText(head)}</th>`).join('')}</tr></thead><tbody>${body || emptyRow(headers.length, 'لا توجد ألوان مسجلة.')}</tbody></table></section>`;
    }

    function accessoriesSection(order, options = {}) {
      const lines = orderAccessoryLines(order);
      if (!lines.length) return '';
      const showMovement = !!options.showMovement;
      const header = showMovement
        ? '<tr><th>نوع الإكسسوار</th><th>النسبة</th><th>المطلوب</th><th>المرسل</th><th>المستلم</th><th>المسلم للعميل</th><th>الرصيد</th></tr>'
        : '<tr><th>نوع الإكسسوار</th><th>النسبة</th><th>الكمية المطلوبة</th></tr>';
      const rows = lines.map((line) => {
        if (!showMovement) return `<tr><td>${safeText(line.type)}</td><td>${formatNumber(line.percent || 0)}%</td><td>${fmt(line.quantity)}</td></tr>`;
        return `<tr><td>${safeText(line.type)}</td><td>${formatNumber(line.percent || 0)}%</td><td>${fmt(line.quantity || order?.accessoryRequired)}</td><td>${fmt(order?.accessorySent)}</td><td>${fmt(order?.accessoryReceived)}</td><td>${fmt(order?.accessoryDelivered)}</td><td>${fmt(order?.accessoryBalance)}</td></tr>`;
      }).join('');
      return `<section class="report-section"><h3>الإكسسوارات</h3><table class="summary-table"><thead>${header}</thead><tbody>${rows}</tbody></table></section>`;
    }

    function notesSection(order) {
      return `<section class="report-section"><h3>ملاحظات</h3><p>${safeText(reportOperationNotes(order))}</p></section>`;
    }

    function widthSummary(order) {
      if (order?.widthMode === 'multiple') {
        const inches = uniqueNonEmpty((order.widthLines || []).map((line) => line.inch)).join('، ');
        return inches || '-';
      }
      return order?.inchWidth || '-';
    }

    function buildWeavingOrderDocument(order) {
      const rawRows = `<section class="report-section"><h3>بيانات التشغيل</h3><table class="summary-table"><tbody><tr><th>مصدر النسيج</th><td>${safeText(order?.weavingSource)}</td><th>البوصة</th><td>${safeText(widthSummary(order))}</td></tr><tr><th>سعر الخام</th><td colspan="3">${fmt(orderRawCost(order))}</td></tr></tbody></table></section>`;
      return reportShell('أمر تشغيل نسيج', order, `${rawRows}${colorRows(order, orderAllocations(order), { includeDyehouse:false, includeReceived:false, includeWaste:false })}${accessoriesSection(order)}${notesSection(order)}`);
    }

    function dyehouseTransfersFor(order, dyehouseName) {
      const name = clean(dyehouseName);
      return (Array.isArray(order?.dyehouseTransfers) ? order.dyehouseTransfers : []).filter((transfer) => clean(transfer.toDyehouse) === name);
    }

    function rawBatchesFor(order) {
      return (Array.isArray(order?.rawBatches) ? order.rawBatches : []).filter((batch) => batch.orderId === order?.id);
    }

    function dyehouseRawNotes(order, dyehouseName, isOriginalDyehouse) {
      const notes = dyehouseRawNoteList(order, dyehouseName, isOriginalDyehouse);
      return uniqueNonEmpty(notes).join('، ') || '-';
    }

    function dyehouseRawNoteList(order, dyehouseName, isOriginalDyehouse) {
      return isOriginalDyehouse
        ? rawBatchesFor(order).map((batch) => batch.noteNumber)
        : dyehouseTransfersFor(order, dyehouseName).map((transfer) => transfer.noteNumber);
    }

    function buildDyeingOrderDocument(order, dyehouseName) {
      const name = clean(dyehouseName || order?.dyehouse);
      const originalDyehouse = clean(order?.dyehouse);
      const isOriginalDyehouse = !name || name === originalDyehouse;
      const transfersToDyehouse = dyehouseTransfersFor(order, name);
      const rows = orderAllocations(order).filter((allocation) => {
        const allocationDyehouse = clean(allocation.dyehouse || order?.dyehouse);
        if (isOriginalDyehouse) return allocationDyehouse === name;
        return allocationDyehouse === name && transfersToDyehouse.some((transfer) => transfer.newAllocationId === allocation.id || transfer.allocationId === allocation.id || clean(transfer.color) === clean(allocation.color || allocation.pantoneCode));
      });
      const plannedTotal = roundNumber(rows.reduce((total, allocation) => total + Number(allocation.plannedQuantity || 0), 0));
      const rawTotal = isOriginalDyehouse
        ? roundNumber(Math.max(sum(rawBatchesFor(order)) - sum((order?.dyehouseTransfers || []).filter((transfer) => clean(transfer.fromDyehouse) === name && clean(transfer.toDyehouse) !== name)), 0))
        : roundNumber(sum(transfersToDyehouse));
      const dates = isOriginalDyehouse ? rawBatchesFor(order).map((batch) => batch.date) : transfersToDyehouse.map((transfer) => transfer.transferDate || transfer.date);
      const reportDate = uniqueNonEmpty(dates).join('، ') || order?.orderDate || '-';
      const rawNoteList = uniqueNonEmpty(dyehouseRawNoteList(order, name, isOriginalDyehouse));
      const rawNotes = dyehouseRawNotes(order, name, isOriginalDyehouse);
      const summary = `<section class="report-section"><h3>بيانات الصباغة</h3><table class="summary-table"><tbody><tr><th>إجمالي كمية المصبغة</th><td>${fmt(plannedTotal)}</td><th>رصيد الخام في المصبغة</th><td>${fmt(rawTotal)}</td></tr><tr><th>عدد الألوان</th><td>${rows.length}</td><th>إذن الخام</th><td>${safeText(rawNotes)}</td></tr></tbody></table></section>`;
      const rawImages = typeof rawPermitImagesSection === 'function' ? rawPermitImagesSection(order, rawNoteList) : '';
      return reportShell('أمر تشغيل صباغة', order, `${summary}${colorRows(order, rows, { includeDyehouse:false, includeReceived:false, includeWaste:false })}${accessoriesSection({ ...order, allocations:rows })}${notesSection(order)}${rawImages}`, { dyehouse:name, date:reportDate, rawNotes, omitBasicFields:['إذن الخام'] });
    }

    function buildDyeingSummaryDocument(order) {
      return buildDyeingOrderDocument({ ...order, rawBatches: order.rawBatches || [], dyehouseTransfers: order.dyehouseTransfers || [] }, order?.dyehouse || '');
    }

    function buildLabSamplesDocument(order) {
      const rows = orderAllocations(order);
      const sampleRows = [];
      for (let index = 0; index < Math.max(rows.length, 1); index += 2) {
        const right = rows[index] || {};
        const left = rows[index + 1] || {};
        sampleRows.push(`<tr><td class="sample-cell"></td><td class="color-cell">${safeText(right.color || right.pantoneCode || '')}</td><td class="color-cell">${safeText(left.color || left.pantoneCode || '')}</td><td class="sample-cell"></td></tr>`);
      }
      return `<div class="document-sheet lab-document lab-samples-sheet"><table class="lab-samples-table"><colgroup><col class="lab-sample-col"><col class="lab-color-col"><col class="lab-color-col"><col class="lab-sample-col"></colgroup><tbody><tr><td colspan="3" class="lab-title">عينات معمل</td><td class="lab-logo-cell">${documentLogo()}</td></tr><tr class="lab-meta-row"><th>رقم الطلب</th><td class="lab-order-number">${safeText(order?.orderNumber)}</td><th>التاريخ</th><td>${safeText(order?.orderDate)}</td></tr><tr class="lab-meta-row"><th>المصبغة</th><td>${safeText(order?.dyehouse)}</td><th>الصنف</th><td>${safeText(order?.fabricType)}</td></tr><tr class="lab-item-row"><th colspan="2">الكمية</th><td colspan="2">${fmt(order?.totalRawOrdered)} كجم</td></tr><tr class="lab-sample-head"><th>العينة</th><th>اللون</th><th>اللون</th><th>العينة</th></tr>${sampleRows.join('')}</tbody></table></div>`;
    }

    function buildStickersDocument(order) {
      const rows = orderAllocations(order);
      const stickerRows = rows.map((line, index) => {
        const stickerId = `sticker-${line.id || index}`;
        return `<div class="sticker-item"><div class="sticker-card" data-sticker-id="${safeText(stickerId)}"><div class="sticker-brand"><strong>2B Tex</strong><span>تشغيل</span></div><div class="sticker-order">${safeText(order?.orderNumber)}</div><div class="sticker-line"><span>العميل</span><strong>${safeText(customerName(order))}</strong></div><div class="sticker-line"><span>الصنف</span><strong>${safeText(order?.fabricType)}</strong></div><div class="sticker-line sticker-line-color"><span>اللون</span><strong>${safeText(line.color || line.pantoneCode)}</strong></div><div class="sticker-grid"><div><span>الكمية</span><strong>${fmt(line.plannedQuantity)}</strong></div><div><span>البوصة</span><strong>${safeText(line.rawInch || order?.inchWidth)}</strong></div><div><span>العرض</span><strong>${safeText(line.targetFinishedWidth || line.rawWidth)}</strong></div><div><span>الوزن</span><strong>${safeText(line.targetFinishedWeight)}</strong></div></div></div><button class="mini-btn sticker-print-btn" type="button" data-print-sticker="${safeText(stickerId)}">طباعة هذا اللون</button></div>`;
      }).join('');
      return `<div class="document-sheet sticker-sheet">${stickerRows || '<p>لا توجد استيكرات متاحة.</p>'}</div>`;
    }

    function buildCompactFullReportDocument(order) {
      const summary = `<section class="report-section"><h3>ملخص التشغيل</h3><table class="summary-table"><tbody><tr><th>خام مطلوب</th><td>${fmt(order?.totalRawOrdered)}</td><th>خام مستلم</th><td>${fmt(order?.totalRawReceived)}</td></tr><tr><th>مرسل للمصبغة</th><td>${fmt(order?.totalSentToDyehouse)}</td><th>دخل المخزن</th><td>${fmt(order?.totalFinishedReceived)}</td></tr><tr><th>تسليم العميل</th><td>${fmt(order?.totalDeliveredToCustomer)}</td><th>رصيد المخزن</th><td>${fmt(order?.warehouseBalance)}</td></tr><tr><th>هالك تقديري</th><td>${fmt(order?.expectedWasteQuantity)}</td><th>هالك فعلي</th><td>${fmt(order?.totalWaste)} (${formatNumber(Number(order?.totalWastePercent || 0), 1)}%)</td></tr></tbody></table></section>`;
      return reportShell('التقرير التفصيلي للطلب', order, `${summary}${colorRows(order, orderAllocations(order), { includeCustomerDelivered:true, includeWaste:true })}${accessoriesSection(order, { showMovement:true })}${notesSection(order)}`, { subtitle:'متابعة كاملة من الخام حتى التسليم للعميل.', omitBasicFields:['إجمالي الخام', 'المصبغة'] });
    }

    function buildWasteReportDocument(order) {
      return reportShell('تقرير الهالك', order, `${colorRows(order, orderAllocations(order), { includeCustomerDelivered:true, includeWaste:true })}${accessoriesSection(order, { showMovement:true })}${notesSection(order)}`, { subtitle:'الهالك الفعلي محسوب من التشغيل الفعلي.', omitBasicFields:['المصبغة'] });
    }

    function buildQuotationDocument(order) {
      const total = roundNumber(orderAllocations(order).reduce((sum, line) => sum + (Number(line.plannedQuantity || 0) * Number(order?.kiloPrice || 0)), 0));
      const rows = orderAllocations(order).map((line) => `<tr><td>${safeText(order?.fabricType)}</td><td>${safeText(line.color || line.pantoneCode)}</td><td>${fmt(line.plannedQuantity)}</td><td>${safeText(line.rawInch || order?.inchWidth)}</td><td>${fmt(order?.kiloPrice)}</td><td>${fmt(Number(line.plannedQuantity || 0) * Number(order?.kiloPrice || 0))}</td></tr>`).join('');
      const table = `<section class="report-section"><h3>بنود العرض</h3><table><thead><tr><th>الصنف</th><th>اللون</th><th>الكمية</th><th>البوصة</th><th>سعر الكيلو</th><th>الإجمالي</th></tr></thead><tbody>${rows || emptyRow(6, 'لا توجد بنود عرض.')}</tbody></table></section>`;
      const summary = `<section class="report-section quotation-summary"><h3>ملخص العرض</h3><table class="summary-table"><tbody><tr><th>إجمالي العقد</th><td>${fmt(total)} جنيه</td><th>طريقة السداد</th><td>${safeText(order?.paymentTerms || 'كاش')}</td></tr></tbody></table></section>`;
      return reportShell('عرض سعر', order, `${summary}${table}${notesSection(order)}`, { subtitle:'عرض تجاري للعميل حسب بيانات الطلب الحالية.', omitBasicFields:['المصبغة'] });
    }

    return {
      buildCompactFullReportDocument,
      buildDyeingOrderDocument,
      buildDyeingSummaryDocument,
      buildLabSamplesDocument,
      buildQuotationDocument,
      buildStickersDocument,
      buildWasteReportDocument,
      buildWeavingOrderDocument,
    };
  }

  window.TwoBTexDocuments = { createBuilders };
})();

(function () {
  function createBuilders(deps) {
    const {
      accessoryDocumentSection,
      documentFooter,
      documentHeader,
      documentLogo,
      escapeHtml,
      formatNumber,
      getFirstRawNoteNumber,
      orderRawCost,
      rawPermitImagesSection,
      reportOperationNotes,
      uniqueNonEmpty,
    } = deps;

    function weavingAccessoryDocumentSection(order, fmt, safe) {
      const lines = Array.isArray(order?.accessoryLines) ? order.accessoryLines : [];
      const fallbackLine = order?.accessoryType || Number(order?.accessoryPercent || 0) || Number(order?.accessoryRequired || 0)
        ? [{ type:order?.accessoryType || 'إكسسوار', percent:order?.accessoryPercent || 0, quantity:order?.accessoryRequired || 0 }]
        : [];
      const rows = (lines.length ? lines : fallbackLine)
        .map((line) => `<tr><td>${safe(line.type || 'إكسسوار')}</td><td>${formatNumber(Number(line.percent || 0))}%</td><td>${fmt(line.quantity || line.quantityManual || 0)}</td></tr>`).join('');
      if (!rows) return '';
      return `<section class="report-section"><h3>الإكسسوارات</h3><table class="summary-table"><thead><tr><th>نوع الإكسسوار</th><th>النسبة</th><th>الكمية المطلوبة</th></tr></thead><tbody>${rows}</tbody></table></section>`;
    }
    
    function buildWeavingOrderDocument(order, fmt, safe) {
      const hasAccessoryColumns = !!weavingAccessoryDocumentSection(order, fmt, safe);
      const inchLabel = order.widthMode === 'multiple' ? uniqueNonEmpty(order.widthLines.map((line)=>line.inch)).join('، ') || '-' : safe(order.inchWidth);
      const widthRows = order.widthMode === 'multiple' && order.widthLines.length
        ? `<section class="report-section"><h3>توزيع العروض</h3><table class="summary-table"><thead><tr><th>البوصة</th><th>العرض</th><th>الكمية</th></tr></thead><tbody>${order.widthLines.map((line)=>`<tr><td>${safe(line.inch)}</td><td>${safe(line.width)}</td><td>${fmt(line.quantity)}</td></tr>`).join('')}</tbody></table></section>`
        : '';
      const accessorySection = weavingAccessoryDocumentSection(order, fmt, safe);
      const allocationRows = (order.allocations || []).map((line)=>`<tr><td>${safe(line.color || line.pantoneCode)}</td><td>${fmt(line.plannedQuantity)}</td><td>${safe(line.dyehouse || order.dyehouse)}</td><td>${safe(line.targetFinishedWidth)}</td><td>${safe(line.targetFinishedWeight)}</td>${hasAccessoryColumns ? `<td>${fmt(line.accessoryQuantity || 0)}</td>` : ''}</tr>`).join('') || `<tr><td colspan="${hasAccessoryColumns ? 6 : 5}">لا توجد ألوان مسجلة.</td></tr>`;
      const allocationTable = `<section class="report-section"><h3>خطة توزيع الألوان</h3><table><thead><tr><th>اللون</th><th>الكمية</th><th>المصبغة</th><th>العرض</th><th>الوزن المجهز</th>${hasAccessoryColumns ? '<th>الإكسسوار المطلوب</th>' : ''}</tr></thead><tbody>${allocationRows}</tbody></table></section>`;
      const notes = `<section class="report-section"><h3>ملاحظات تشغيل</h3><p>${safe(reportOperationNotes(order))}</p></section>`;
      return `${documentHeader()}<div class="report-title"><h2>أمر تشغيل نسيج</h2></div><div class="document-meta"><div><span>رقم الطلب</span>${safe(order.orderNumber)}</div><div><span>العميل</span>${safe(order.customer)}</div><div><span>التاريخ</span>${safe(order.orderDate)}</div><div><span>الصنف</span>${safe(order.fabricType)}</div><div><span>إجمالي الخام</span>${fmt(order.totalRawOrdered)}</div><div><span>المصبغة</span>${safe(order.dyehouse)}</div></div><section class="report-section"><h3>بيانات الخام</h3><table class="summary-table"><tbody><tr><th>إجمالي الخام المطلوب</th><td>${fmt(order.totalRawOrdered)}</td><th>سعر الخام</th><td>${fmt(orderRawCost(order))}</td></tr><tr><th>مصدر النسيج</th><td>${safe(order.weavingSource)}</td><th>البوصة</th><td>${inchLabel}</td></tr></tbody></table></section>${widthRows}${accessorySection}${allocationTable}${notes}${documentFooter()}`;
    }
    
    function buildQuotationDocument(order, fmt, safe) {
      const rows = (order.allocations || []).map((line)=>`<tr><td>${safe(order.fabricType)}</td><td>${safe(line.color || line.pantoneCode)}</td><td>${fmt(line.plannedQuantity)}</td><td>${safe(order.inchWidth)}</td><td>${fmt(order.kiloPrice)}</td><td>${fmt(Number(line.plannedQuantity || 0) * Number(order.kiloPrice || 0))}</td></tr>`).join('') || '<tr><td colspan="6">لا توجد بنود عرض.</td></tr>';
      return `${documentHeader()}<div class="report-title"><h2>عرض سعر</h2><span>عرض تجاري للعميل حسب بيانات الطلب الحالية.</span></div><div class="document-meta"><div><span>رقم الطلب</span>${safe(order.orderNumber)}</div><div><span>العميل</span>${safe(order.customer)}</div><div><span>التاريخ</span>${safe(order.orderDate)}</div><div><span>الصنف</span>${safe(order.fabricType)}</div><div><span>إجمالي الخام</span>${fmt(order.totalRawOrdered)}</div><div><span>المصبغة</span>${safe(order.dyehouse)}</div></div><section class="report-section"><h3>بنود العرض</h3><table><thead><tr><th>الصنف</th><th>اللون</th><th>الكمية</th><th>البوصة</th><th>سعر الكيلو</th><th>الإجمالي</th></tr></thead><tbody>${rows}</tbody></table></section><section class="report-section"><h3>ملاحظات تشغيل</h3><p>${safe(reportOperationNotes(order))}</p></section>${documentFooter()}`;
    }
    
    function buildDyeingSummaryDocument(order, fmt, safe) {
      const accessorySection = accessoryDocumentSection(order, fmt, safe);
      const hasAccessoryColumns = !!accessorySection;
      const rows = (order.allocations || []).map((line)=>`<tr><td>${safe(line.color || line.pantoneCode)}</td><td>${fmt(line.plannedQuantity)}</td><td>${safe(line.dyehouse || order.dyehouse)}</td><td>${safe(line.targetFinishedWidth)}</td><td>${safe(line.targetFinishedWeight)}</td><td>${fmt(line.finishedReceived)}</td><td>${fmt(line.wasteQuantity)} (${formatNumber(line.wastePercent || 0, 1)}%)</td>${hasAccessoryColumns ? `<td>${fmt(line.accessoryQuantity || 0)}</td>` : ''}</tr>`).join('') || `<tr><td colspan="${hasAccessoryColumns ? 8 : 7}">لا توجد ألوان مسجلة.</td></tr>`;
      const rawNotes = getFirstRawNoteNumber(order) || '-';
      return `${documentHeader()}<div class="report-title"><h2>أمر تشغيل صباغة</h2><span>أمر تشغيل الصباغة للمصبغة المحددة.</span></div><div class="document-meta"><div><span>رقم الطلب</span>${safe(order.orderNumber)}</div><div><span>العميل</span>${safe(order.customer)}</div><div><span>التاريخ</span>${safe(order.orderDate)}</div><div><span>الصنف</span>${safe(order.fabricType)}</div><div><span>إجمالي الخام</span>${fmt(order.totalRawOrdered)}</div><div><span>المصبغة</span>${safe(order.dyehouse)}</div></div><section class="report-section"><h3>بيانات الصباغة</h3><table class="summary-table"><tbody><tr><th>إذن الخام</th><td>${safe(rawNotes)}</td><th>إجمالي كمية الصباغة</th><td>${fmt(order.totalSentToDyehouse || order.totalRawOrdered)}</td></tr><tr><th>عدد الألوان</th><td>${(order.allocations || []).length}</td><th>رصيد الخام في المصبغة</th><td>${fmt(order.totalSentToDyehouse)}</td></tr></tbody></table></section>${accessorySection}<section class="report-section"><h3>خطة توزيع الألوان</h3><table><thead><tr><th>اللون</th><th>الكمية</th><th>المصبغة</th><th>العرض</th><th>الوزن المجهز</th><th>دخل المخزن</th><th>الهالك الفعلي</th>${hasAccessoryColumns ? '<th>الإكسسوار المطلوب</th>' : ''}</tr></thead><tbody>${rows}</tbody></table></section>${rawPermitImagesSection(order)}<section class="report-section"><h3>ملاحظات تشغيل</h3><p>${safe(reportOperationNotes(order))}</p></section>${documentFooter()}`;
    }
    
    function buildWasteReportDocument(order, fmt, safe) {
      const rows = (order.allocations || []).map((line)=>`<tr><td>${safe(line.color || line.pantoneCode)}</td><td>${fmt(line.sentToDyehouse)}</td><td>${fmt(line.finishedReceived)}</td><td>${fmt(line.expectedWasteQuantity)}</td><td>${fmt(line.wasteQuantity)}</td><td>${formatNumber(line.wastePercent || 0, 1)}%</td></tr>`).join('') || '<tr><td colspan="6">لا توجد بيانات هالك.</td></tr>';
      return `${documentHeader()}<div class="report-title"><h2>تقرير الهالك</h2><span>الهالك الفعلي محسوب من التشغيل الفعلي وليس من المخطط.</span></div><div class="document-meta"><div><span>رقم الطلب</span>${safe(order.orderNumber)}</div><div><span>العميل</span>${safe(order.customer)}</div><div><span>التاريخ</span>${safe(order.orderDate)}</div><div><span>الصنف</span>${safe(order.fabricType)}</div><div><span>إجمالي الخام</span>${fmt(order.totalRawOrdered)}</div><div><span>المصبغة</span>${safe(order.dyehouse)}</div></div><section class="report-section"><h3>تفاصيل الهالك</h3><table><thead><tr><th>اللون</th><th>مرسل للمصبغة</th><th>دخل المخزن</th><th>هالك تقديري</th><th>هالك فعلي</th><th>نسبة الهالك</th></tr></thead><tbody>${rows}</tbody></table></section>${accessoryDocumentSection(order, fmt, safe)}${documentFooter()}`;
    }
    
    function buildCompactFullReportDocument(order, fmt, safe) {
      const accessorySection = accessoryDocumentSection(order, fmt, safe);
      const hasAccessoryColumns = !!accessorySection;
      const rows = (order.allocations || []).map((line)=>`<tr><td>${safe(line.color || line.pantoneCode)}</td><td>${fmt(line.plannedQuantity)}</td><td>${safe(line.dyehouse || order.dyehouse)}</td><td>${safe(line.targetFinishedWidth)}</td><td>${safe(line.targetFinishedWeight)}</td><td>${fmt(line.finishedReceived)}</td><td>${fmt(line.wasteQuantity)} (${formatNumber(line.wastePercent || 0, 1)}%)</td>${hasAccessoryColumns ? `<td>${fmt(line.accessoryQuantity || 0)}</td>` : ''}</tr>`).join('') || `<tr><td colspan="${hasAccessoryColumns ? 8 : 7}">لا توجد ألوان مسجلة.</td></tr>`;
      return `${documentHeader()}<div class="report-title"><h2>التقرير التفصيلي للطلب</h2><span>متابعة كاملة من الخام حتى التسليم للعميل.</span></div><div class="document-meta"><div><span>رقم الطلب</span>${safe(order.orderNumber)}</div><div><span>العميل</span>${safe(order.customer)}</div><div><span>التاريخ</span>${safe(order.orderDate)}</div><div><span>الصنف</span>${safe(order.fabricType)}</div><div><span>إجمالي الخام</span>${fmt(order.totalRawOrdered)}</div><div><span>المصبغة</span>${safe(order.dyehouse)}</div></div><section class="report-section"><h3>ملخص التشغيل</h3><table class="summary-table"><tbody><tr><th>خام مطلوب</th><td>${fmt(order.totalRawOrdered)}</td><th>خام مستلم</th><td>${fmt(order.totalRawReceived)}</td></tr><tr><th>مرسل للمصبغة</th><td>${fmt(order.totalSentToDyehouse)}</td><th>دخل المخزن</th><td>${fmt(order.totalFinishedReceived)}</td></tr><tr><th>تسليم العميل</th><td>${fmt(order.totalDeliveredToCustomer)}</td><th>رصيد المخزن</th><td>${fmt(order.warehouseBalance)}</td></tr><tr><th>هالك تقديري</th><td>${fmt(order.expectedWasteQuantity)}</td><th>هالك فعلي</th><td>${fmt(order.totalWaste)}</td></tr></tbody></table></section>${accessorySection}<section class="report-section"><h3>خطة توزيع الألوان</h3><table><thead><tr><th>اللون</th><th>الكمية</th><th>المصبغة</th><th>العرض</th><th>الوزن المجهز</th><th>دخل المخزن</th><th>الهالك الفعلي</th>${hasAccessoryColumns ? '<th>الإكسسوار المطلوب</th>' : ''}</tr></thead><tbody>${rows}</tbody></table></section><section class="report-section"><h3>ملاحظات تشغيل</h3><p>${safe(reportOperationNotes(order))}</p></section>${documentFooter()}`;
    }
    
    function buildLabSamplesDocument(order, fmt, safe) {
      const allocationList = Array.isArray(order.allocations) ? order.allocations : [];
      const sampleRows = [];
      for (let index = 0; index < Math.max(allocationList.length, 1); index += 2) {
        const right = allocationList[index] || {};
        const left = allocationList[index + 1] || {};
        sampleRows.push(`<tr><td class="sample-cell"></td><td class="color-cell">${safe(right.color || right.pantoneCode || '')}</td><td class="color-cell">${safe(left.color || left.pantoneCode || '')}</td><td class="sample-cell"></td></tr>`);
      }
      return `<div class="document-sheet lab-document lab-samples-sheet"><table class="lab-samples-table"><colgroup><col class="lab-sample-col"><col class="lab-color-col"><col class="lab-color-col"><col class="lab-sample-col"></colgroup><tbody><tr><td colspan="3" class="lab-title">عينات معمل</td><td class="lab-logo-cell">${documentLogo()}</td></tr><tr class="lab-meta-row"><th>رقم الطلب</th><td class="lab-order-number">${safe(order.orderNumber)}</td><th>التاريخ</th><td>${safe(order.orderDate)}</td></tr><tr class="lab-meta-row"><th>المصبغة</th><td>${safe(order.dyehouse)}</td><th>الصنف</th><td>${safe(order.fabricType)}</td></tr><tr class="lab-item-row"><th colspan="2">الكمية</th><td colspan="2">${fmt(order.totalRawOrdered)} كجم</td></tr><tr class="lab-sample-head"><th>العينة</th><th>اللون</th><th>اللون</th><th>العينة</th></tr>${sampleRows.join('')}</tbody></table></div>`;
    }
    
    function buildStickersDocument(order, fmt, safe) {
      const allocationList = Array.isArray(order.allocations) ? order.allocations : [];
      const stickerRows = allocationList.map((line, index)=>{
        const stickerId = `sticker-${line.id || index}`;
        return `<div class="sticker-card" data-sticker-id="${escapeHtml(stickerId)}"><div class="sticker-brand"><strong>2B Tex</strong><span>تشغيل</span></div><div class="sticker-order">${safe(order.orderNumber)}</div><div class="sticker-line"><span>العميل</span><strong>${safe(order.customer)}</strong></div><div class="sticker-line"><span>الصنف</span><strong>${safe(order.fabricType)}</strong></div><div class="sticker-line"><span>اللون</span><strong>${safe(line.color || line.pantoneCode)}</strong></div><div class="sticker-grid"><div><span>الكمية</span><strong>${fmt(line.plannedQuantity)}</strong></div><div><span>البوصة</span><strong>${safe(line.rawInch || order.inchWidth)}</strong></div><div><span>العرض</span><strong>${safe(line.targetFinishedWidth || line.rawWidth || '-')}</strong></div><div><span>الوزن</span><strong>${safe(line.targetFinishedWeight || '-')}</strong></div></div><button class="mini-btn sticker-print-btn" type="button" data-print-sticker="${escapeHtml(stickerId)}">طباعة هذا اللون</button></div>`;
      }).join('');
      return `<div class="document-sheet sticker-sheet">${stickerRows || '<p>لا توجد استيكرات متاحة.</p>'}</div>`;
    }

    return {
      buildCompactFullReportDocument,
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

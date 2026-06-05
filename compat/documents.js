(function() {
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
      accessoryTypesLabel
    } = deps;
    const safeText = (value) => escapeHtml(value === void 0 || value === null || value === "" ? "-" : value);
    const fmt = (value, digits = 3) => formatNumber(Number(value || 0), digits);
    const clean = (value) => String(value || "").trim();
    const customerName = (order) => clean((order == null ? void 0 : order.customer) || (order == null ? void 0 : order.customerName) || (order == null ? void 0 : order.clientName) || "");
    function uniqueBy(rows, keyFactory) {
      const seen = /* @__PURE__ */ new Set();
      return (rows || []).filter((row, index) => {
        const key = keyFactory(row, index);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    function orderAllocations(order) {
      return uniqueBy(Array.isArray(order == null ? void 0 : order.allocations) ? order.allocations : [], (line, index) => [
        line.id || index,
        clean(line.color || line.pantoneCode),
        clean(line.dyehouse || (order == null ? void 0 : order.dyehouse)),
        Number(line.plannedQuantity || 0),
        clean(line.rawInch || (order == null ? void 0 : order.inchWidth)),
        clean(line.targetFinishedWidth || line.rawWidth),
        clean(line.targetFinishedWeight)
      ].join("|"));
    }
    function orderAccessoryLines(order) {
      const configuredLines = Array.isArray(order == null ? void 0 : order.accessoryLines) ? order.accessoryLines : [];
      const normalized = configuredLines.map((line) => ({
        type: clean(line.type || "إكسسوار"),
        percent: Number(line.percent || 0),
        quantity: Number(line.quantityManual || line.quantity || 0)
      })).filter((line) => line.type || line.percent || line.quantity);
      if (normalized.length) {
        const byType = /* @__PURE__ */ new Map();
        normalized.forEach((line) => {
          const key = clean(line.type || "إكسسوار");
          const current = byType.get(key) || { type: key, percent: 0, quantity: 0 };
          current.percent += Number(line.percent || 0);
          current.quantity += Number(line.quantity || 0);
          byType.set(key, current);
        });
        return Array.from(byType.values()).map((line) => ({
          ...line,
          percent: roundNumber(line.percent),
          quantity: roundNumber(line.quantity)
        }));
      }
      const allocationRequired = orderAllocations(order).reduce((total, line) => total + Number(line.accessoryQuantity || 0), 0);
      const quantity = Number((order == null ? void 0 : order.accessoryRequired) || 0) || allocationRequired;
      const percent = Number((order == null ? void 0 : order.accessoryPercent) || 0);
      const type = clean((order == null ? void 0 : order.accessoryType) || "");
      if (!type && !percent && !quantity) return [];
      return [{ type: type || "إكسسوار", percent, quantity }];
    }
    function reportShell(title, order, body, options = {}) {
      const subtitle = options.subtitle ? "<span>".concat(safeText(options.subtitle), "</span>") : "";
      return '<div class="two-b-report">'.concat(documentHeader(), '<div class="report-title"><h2>').concat(safeText(title)).concat((order == null ? void 0 : order.orderNumber) ? " <small># ".concat(safeText(order.orderNumber), "</small>") : "", "</h2>").concat(subtitle, "</div>").concat(basicInfoSection(order, options)).concat(body).concat(documentFooter(), "</div>");
    }
    function basicInfoSection(order, options = {}) {
      const omitted = /* @__PURE__ */ new Set(["رقم الطلب", ...options.omitBasicFields || []]);
      const fields = [
        ["رقم الطلب", order == null ? void 0 : order.orderNumber],
        ["العميل", customerName(order)],
        ["التاريخ", options.date || (order == null ? void 0 : order.orderDate)],
        ["الصنف", order == null ? void 0 : order.fabricType],
        ["إجمالي الخام", "".concat(fmt(order == null ? void 0 : order.totalRawOrdered), " كجم")],
        ["المصبغة", options.dyehouse || (order == null ? void 0 : order.dyehouse)]
      ].filter(([label]) => !omitted.has(label));
      if (options.rawNotes && !omitted.has("إذن الخام")) fields.push(["إذن الخام", options.rawNotes]);
      return '<div class="document-meta">'.concat(fields.map(([label, value]) => "<div><span>".concat(safeText(label), "</span>").concat(safeText(value), "</div>")).join(""), "</div>");
    }
    function colorRows(order, rows = orderAllocations(order), options = {}) {
      const includeDyehouse = !!options.includeDyehouse;
      const includeInch = options.includeInch || (order == null ? void 0 : order.widthMode) === "multiple";
      const includeFinished = options.includeFinished !== false;
      const includeReceived = !!options.includeReceived;
      const includeCustomerDelivered = !!options.includeCustomerDelivered;
      const includeWaste = !!options.includeWaste;
      const headers = [
        "اللون",
        includeInch ? "البوصة" : "",
        "الكمية",
        includeDyehouse ? "المصبغة" : "",
        includeReceived ? "دخل المخزن" : "",
        includeCustomerDelivered ? "تسليم العميل" : "",
        includeWaste ? "الهالك الفعلي" : "",
        includeFinished ? "الوزن المجهز" : "",
        "العرض"
      ].filter(Boolean);
      const body = rows.map((line) => {
        const cells = [
          safeText(line.color || line.pantoneCode),
          includeInch ? safeText(line.rawInch || (order == null ? void 0 : order.inchWidth)) : "",
          fmt(line.plannedQuantity),
          includeDyehouse ? safeText(line.dyehouse || (order == null ? void 0 : order.dyehouse)) : "",
          includeReceived ? fmt(line.finishedReceived) : "",
          includeCustomerDelivered ? fmt(line.deliveredToCustomer || line.customerDelivered) : "",
          includeWaste ? "".concat(fmt(line.wasteQuantity), " (").concat(formatNumber(Number(line.wastePercent || 0), 1), "%)") : "",
          includeFinished ? safeText(line.targetFinishedWeight) : "",
          safeText(line.targetFinishedWidth || line.rawWidth)
        ].filter((cell) => cell !== "");
        return "<tr>".concat(cells.map((cell) => "<td>".concat(cell, "</td>")).join(""), "</tr>");
      }).join("");
      return '<section class="report-section"><h3>جدول الألوان</h3><table><thead><tr>'.concat(headers.map((head) => "<th>".concat(safeText(head), "</th>")).join(""), "</tr></thead><tbody>").concat(body || emptyRow(headers.length, "لا توجد ألوان مسجلة."), "</tbody></table></section>");
    }
    function accessoriesSection(order, options = {}) {
      const lines = orderAccessoryLines(order);
      if (!lines.length) return "";
      const showMovement = !!options.showMovement;
      const header = showMovement ? "<tr><th>نوع الإكسسوار</th><th>النسبة</th><th>المطلوب</th><th>المرسل</th><th>المستلم</th><th>المسلم للعميل</th><th>الرصيد</th></tr>" : "<tr><th>نوع الإكسسوار</th><th>النسبة</th><th>الكمية المطلوبة</th></tr>";
      const rows = lines.map((line) => {
        if (!showMovement) return "<tr><td>".concat(safeText(line.type), "</td><td>").concat(formatNumber(line.percent || 0), "%</td><td>").concat(fmt(line.quantity), "</td></tr>");
        return "<tr><td>".concat(safeText(line.type), "</td><td>").concat(formatNumber(line.percent || 0), "%</td><td>").concat(fmt(line.quantity || (order == null ? void 0 : order.accessoryRequired)), "</td><td>").concat(fmt(order == null ? void 0 : order.accessorySent), "</td><td>").concat(fmt(order == null ? void 0 : order.accessoryReceived), "</td><td>").concat(fmt(order == null ? void 0 : order.accessoryDelivered), "</td><td>").concat(fmt(order == null ? void 0 : order.accessoryBalance), "</td></tr>");
      }).join("");
      return '<section class="report-section"><h3>الإكسسوارات</h3><table class="summary-table"><thead>'.concat(header, "</thead><tbody>").concat(rows, "</tbody></table></section>");
    }
    function notesSection(order) {
      return '<section class="report-section"><h3>ملاحظات</h3><p>'.concat(safeText(reportOperationNotes(order)), "</p></section>");
    }
    function widthSummary(order) {
      if ((order == null ? void 0 : order.widthMode) === "multiple") {
        const inches = uniqueNonEmpty((order.widthLines || []).map((line) => line.inch)).join("، ");
        return inches || "-";
      }
      return (order == null ? void 0 : order.inchWidth) || "-";
    }
    function buildWeavingOrderDocument(order) {
      const rawRows = '<section class="report-section"><h3>بيانات التشغيل</h3><table class="summary-table"><tbody><tr><th>مصدر النسيج</th><td>'.concat(safeText(order == null ? void 0 : order.weavingSource), "</td><th>البوصة</th><td>").concat(safeText(widthSummary(order)), '</td></tr><tr><th>سعر الخام</th><td colspan="3">').concat(fmt(orderRawCost(order)), "</td></tr></tbody></table></section>");
      return reportShell("أمر تشغيل نسيج", order, "".concat(rawRows).concat(colorRows(order, orderAllocations(order), { includeDyehouse: false, includeReceived: false, includeWaste: false })).concat(accessoriesSection(order)).concat(notesSection(order)));
    }
    function dyehouseTransfersFor(order, dyehouseName) {
      const name = clean(dyehouseName);
      return (Array.isArray(order == null ? void 0 : order.dyehouseTransfers) ? order.dyehouseTransfers : []).filter((transfer) => clean(transfer.toDyehouse) === name);
    }
    function rawBatchesFor(order) {
      return (Array.isArray(order == null ? void 0 : order.rawBatches) ? order.rawBatches : []).filter((batch) => batch.orderId === (order == null ? void 0 : order.id));
    }
    function dyehouseRawNotes(order, dyehouseName, isOriginalDyehouse) {
      const notes = dyehouseRawNoteList(order, dyehouseName, isOriginalDyehouse);
      return uniqueNonEmpty(notes).join("، ") || "-";
    }
    function dyehouseRawNoteList(order, dyehouseName, isOriginalDyehouse) {
      return isOriginalDyehouse ? rawBatchesFor(order).map((batch) => batch.noteNumber) : dyehouseTransfersFor(order, dyehouseName).map((transfer) => transfer.noteNumber);
    }
    function buildDyeingOrderDocument(order, dyehouseName) {
      const name = clean(dyehouseName || (order == null ? void 0 : order.dyehouse));
      const originalDyehouse = clean(order == null ? void 0 : order.dyehouse);
      const isOriginalDyehouse = !name || name === originalDyehouse;
      const transfersToDyehouse = dyehouseTransfersFor(order, name);
      const rows = orderAllocations(order).filter((allocation) => {
        const allocationDyehouse = clean(allocation.dyehouse || (order == null ? void 0 : order.dyehouse));
        if (isOriginalDyehouse) return allocationDyehouse === name;
        return allocationDyehouse === name && transfersToDyehouse.some((transfer) => transfer.newAllocationId === allocation.id || transfer.allocationId === allocation.id || clean(transfer.color) === clean(allocation.color || allocation.pantoneCode));
      });
      const plannedTotal = roundNumber(rows.reduce((total, allocation) => total + Number(allocation.plannedQuantity || 0), 0));
      const rawTotal = isOriginalDyehouse ? roundNumber(Math.max(sum(rawBatchesFor(order)) - sum(((order == null ? void 0 : order.dyehouseTransfers) || []).filter((transfer) => clean(transfer.fromDyehouse) === name && clean(transfer.toDyehouse) !== name)), 0)) : roundNumber(sum(transfersToDyehouse));
      const dates = isOriginalDyehouse ? rawBatchesFor(order).map((batch) => batch.date) : transfersToDyehouse.map((transfer) => transfer.transferDate || transfer.date);
      const reportDate = uniqueNonEmpty(dates).join("، ") || (order == null ? void 0 : order.orderDate) || "-";
      const rawNoteList = uniqueNonEmpty(dyehouseRawNoteList(order, name, isOriginalDyehouse));
      const rawNotes = dyehouseRawNotes(order, name, isOriginalDyehouse);
      const summary = '<section class="report-section"><h3>بيانات الصباغة</h3><table class="summary-table"><tbody><tr><th>إجمالي كمية المصبغة</th><td>'.concat(fmt(plannedTotal), "</td><th>رصيد الخام في المصبغة</th><td>").concat(fmt(rawTotal), "</td></tr><tr><th>عدد الألوان</th><td>").concat(rows.length, "</td><th>إذن الخام</th><td>").concat(safeText(rawNotes), "</td></tr></tbody></table></section>");
      const rawImages = typeof rawPermitImagesSection === "function" ? rawPermitImagesSection(order, rawNoteList) : "";
      return reportShell("أمر تشغيل صباغة", order, "".concat(summary).concat(colorRows(order, rows, { includeDyehouse: false, includeReceived: false, includeWaste: false })).concat(accessoriesSection({ ...order, allocations: rows })).concat(notesSection(order)).concat(rawImages), { dyehouse: name, date: reportDate, rawNotes, omitBasicFields: ["إذن الخام"] });
    }
    function buildDyeingSummaryDocument(order) {
      return buildDyeingOrderDocument({ ...order, rawBatches: order.rawBatches || [], dyehouseTransfers: order.dyehouseTransfers || [] }, (order == null ? void 0 : order.dyehouse) || "");
    }
    function buildLabSamplesDocument(order) {
      const rows = orderAllocations(order);
      const sampleRows = [];
      for (let index = 0; index < Math.max(rows.length, 1); index += 2) {
        const right = rows[index] || {};
        const left = rows[index + 1] || {};
        sampleRows.push('<tr><td class="sample-cell"></td><td class="color-cell">'.concat(safeText(right.color || right.pantoneCode || ""), '</td><td class="color-cell">').concat(safeText(left.color || left.pantoneCode || ""), '</td><td class="sample-cell"></td></tr>'));
      }
      return '<div class="document-sheet lab-document lab-samples-sheet"><table class="lab-samples-table"><colgroup><col class="lab-sample-col"><col class="lab-color-col"><col class="lab-color-col"><col class="lab-sample-col"></colgroup><tbody><tr><td colspan="3" class="lab-title">عينات معمل</td><td class="lab-logo-cell">'.concat(documentLogo(), '</td></tr><tr class="lab-meta-row"><th>رقم الطلب</th><td class="lab-order-number">').concat(safeText(order == null ? void 0 : order.orderNumber), "</td><th>التاريخ</th><td>").concat(safeText(order == null ? void 0 : order.orderDate), '</td></tr><tr class="lab-meta-row"><th>المصبغة</th><td>').concat(safeText(order == null ? void 0 : order.dyehouse), "</td><th>الصنف</th><td>").concat(safeText(order == null ? void 0 : order.fabricType), '</td></tr><tr class="lab-item-row"><th colspan="2">الكمية</th><td colspan="2">').concat(fmt(order == null ? void 0 : order.totalRawOrdered), ' كجم</td></tr><tr class="lab-sample-head"><th>العينة</th><th>اللون</th><th>اللون</th><th>العينة</th></tr>').concat(sampleRows.join(""), "</tbody></table></div>");
    }
    function buildStickersDocument(order) {
      const rows = orderAllocations(order);
      const stickerRows = rows.map((line, index) => {
        const stickerId = "sticker-".concat(line.id || index);
        return '<div class="sticker-item"><div class="sticker-card" data-sticker-id="'.concat(safeText(stickerId), '"><div class="sticker-brand"><strong>2B Tex</strong><span>تشغيل</span></div><div class="sticker-order">').concat(safeText(order == null ? void 0 : order.orderNumber), '</div><div class="sticker-line"><span>العميل</span><strong>').concat(safeText(customerName(order)), '</strong></div><div class="sticker-line"><span>الصنف</span><strong>').concat(safeText(order == null ? void 0 : order.fabricType), '</strong></div><div class="sticker-line sticker-line-color"><span>اللون</span><strong>').concat(safeText(line.color || line.pantoneCode), '</strong></div><div class="sticker-grid"><div><span>الكمية</span><strong>').concat(fmt(line.plannedQuantity), "</strong></div><div><span>البوصة</span><strong>").concat(safeText(line.rawInch || (order == null ? void 0 : order.inchWidth)), "</strong></div><div><span>العرض</span><strong>").concat(safeText(line.targetFinishedWidth || line.rawWidth), "</strong></div><div><span>الوزن</span><strong>").concat(safeText(line.targetFinishedWeight), '</strong></div></div></div><button class="mini-btn sticker-print-btn" type="button" data-print-sticker="').concat(safeText(stickerId), '">طباعة هذا اللون</button></div>');
      }).join("");
      return '<div class="document-sheet sticker-sheet">'.concat(stickerRows || "<p>لا توجد استيكرات متاحة.</p>", "</div>");
    }
    function buildCompactFullReportDocument(order) {
      const summary = '<section class="report-section"><h3>ملخص التشغيل</h3><table class="summary-table"><tbody><tr><th>خام مطلوب</th><td>'.concat(fmt(order == null ? void 0 : order.totalRawOrdered), "</td><th>خام مستلم</th><td>").concat(fmt(order == null ? void 0 : order.totalRawReceived), "</td></tr><tr><th>مرسل للمصبغة</th><td>").concat(fmt(order == null ? void 0 : order.totalSentToDyehouse), "</td><th>دخل المخزن</th><td>").concat(fmt(order == null ? void 0 : order.totalFinishedReceived), "</td></tr><tr><th>رصيد المخزن</th><td>").concat(fmt(order == null ? void 0 : order.warehouseBalance), "</td><th>هالك تقديري</th><td>").concat(fmt(order == null ? void 0 : order.expectedWasteQuantity), "</td></tr></tbody></table></section>");
      return reportShell("التقرير التفصيلي للطلب", order, "".concat(summary).concat(colorRows(order, orderAllocations(order), { includeCustomerDelivered: true, includeWaste: true })).concat(accessoriesSection(order, { showMovement: true })).concat(notesSection(order)), { subtitle: "متابعة كاملة من الخام حتى التسليم للعميل.", omitBasicFields: ["إجمالي الخام", "المصبغة"] });
    }
    function buildWasteReportDocument(order) {
      return reportShell("تقرير الهالك", order, "".concat(colorRows(order, orderAllocations(order), { includeCustomerDelivered: true, includeWaste: true })).concat(accessoriesSection(order, { showMovement: true })).concat(notesSection(order)), { subtitle: "الهالك الفعلي محسوب من التشغيل الفعلي.", omitBasicFields: ["المصبغة"] });
    }
    function buildQuotationDocument(order) {
      const total = roundNumber(orderAllocations(order).reduce((sum2, line) => sum2 + Number(line.plannedQuantity || 0) * Number((order == null ? void 0 : order.kiloPrice) || 0), 0));
      const rows = orderAllocations(order).map((line) => "<tr><td>".concat(safeText(order == null ? void 0 : order.fabricType), "</td><td>").concat(safeText(line.color || line.pantoneCode), "</td><td>").concat(fmt(line.plannedQuantity), "</td><td>").concat(safeText(line.rawInch || (order == null ? void 0 : order.inchWidth)), "</td><td>").concat(fmt(order == null ? void 0 : order.kiloPrice), "</td><td>").concat(fmt(Number(line.plannedQuantity || 0) * Number((order == null ? void 0 : order.kiloPrice) || 0)), "</td></tr>")).join("");
      const table = '<section class="report-section"><h3>بنود العرض</h3><table><thead><tr><th>الصنف</th><th>اللون</th><th>الكمية</th><th>البوصة</th><th>سعر الكيلو</th><th>الإجمالي</th></tr></thead><tbody>'.concat(rows || emptyRow(6, "لا توجد بنود عرض."), "</tbody></table></section>");
      const summary = '<section class="report-section quotation-summary"><h3>ملخص العرض</h3><table class="summary-table"><tbody><tr><th>إجمالي العقد</th><td>'.concat(fmt(total), " جنيه</td><th>طريقة السداد</th><td>").concat(safeText((order == null ? void 0 : order.paymentTerms) || "كاش"), "</td></tr></tbody></table></section>");
      return reportShell("عرض سعر", order, "".concat(summary).concat(table).concat(notesSection(order)), { subtitle: "عرض تجاري للعميل حسب بيانات الطلب الحالية.", omitBasicFields: ["المصبغة"] });
    }
    return {
      buildCompactFullReportDocument,
      buildDyeingOrderDocument,
      buildDyeingSummaryDocument,
      buildLabSamplesDocument,
      buildQuotationDocument,
      buildStickersDocument,
      buildWasteReportDocument,
      buildWeavingOrderDocument
    };
  }
  window.TwoBTexDocuments = { createBuilders };
})();

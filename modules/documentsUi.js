(function () {
  function createDocumentsUi(deps) {
    function stripDyeingPricingStageSections() {
      const body = deps.refs.documentBody;
      if (!body || body.dataset.documentType !== 'dyeing') return;
      [...body.querySelectorAll('.report-section')].forEach((section) => {
        const title = String(section.querySelector('h3')?.textContent || '').replace(/\s+/g, ' ').trim();
        if (title.includes('مراحل التشغيل')) section.remove();
      });
    }

    function renderDocuments() {
      const refs = deps.refs;
      const currentOrder = deps.getOrders().find((item)=>item.id === deps.getSelectedOrderId());
      const linkedPricing = currentOrder?.pricingId ? deps.getPricings().find((pricing)=>pricing.id === currentOrder.pricingId) : null;
      const orderPricing = currentOrder ? (linkedPricing || deps.pricingForOrder(currentOrder)) : null;
      const pricingActionLabel = orderPricing ? 'تعديل كرت التسعير المرتبط' : 'إنشاء كرت تسعير من الطلب';
      const quotationActionLabel = orderPricing ? 'عرض السعر المرتبط' : 'إنشاء عرض سعر من الطلب';
      refs.documentsPanel.innerHTML = `
        <div class="document-action-group">
          <h3>عرض العميل</h3>
          <button class="mini-btn gold" data-order-pricing>${pricingActionLabel}</button>
          <button class="mini-btn gold" data-doc="quotation">${quotationActionLabel}</button>
        </div>
        <div class="document-action-group">
          <h3>أوامر التشغيل</h3>
          <button class="mini-btn gold" data-doc="weaving">أمر تشغيل نسيج</button>
          <button class="mini-btn gold" data-doc="dyeing">أمر تشغيل صباغة</button>
          <button class="mini-btn gold" data-doc="labSamples">عينات معمل</button>
          <button class="mini-btn gold" data-doc="stickers">طباعة استيكرات</button>
        </div>
        <div class="document-action-group">
          <h3>التقارير والكشوفات</h3>
          <button class="mini-btn" data-doc="waste">تقرير الهالك</button>
          <button class="mini-btn gold" data-doc="fullreport">التقرير التفصيلي</button>
          <button class="mini-btn" data-doc="print">طباعة التقرير الحالي</button>
          <button class="mini-btn" disabled>تصدير PDF لاحقًا</button>
        </div>`;
    }

    async function openDyeingDocumentForDyehouse(dyehouseName) {
      if (deps.isBackendAvailable()) await deps.loadBackendData();
      const sourceOrder = deps.getOrders().find((item)=>item.id===deps.getSelectedOrderId());
      if (!sourceOrder) return;
      const name = String(dyehouseName || '').trim();
      const operationNoteText = await deps.promptOperationNotes(sourceOrder, 'dyeing', name);
      if (operationNoteText === null) return;
      const refreshedSourceOrder = deps.getOrders().find((item)=>item.id===deps.getSelectedOrderId()) || sourceOrder;
      const order = deps.calculateOrder(refreshedSourceOrder);
      const fmt = (value) => deps.roundNumber(value).toLocaleString('en-US', { maximumFractionDigits: 3 });
      const reportOrder = { ...order, operationNoteText, whatsappDyehouseName:name };
      deps.setCurrentDocumentType('dyeing');
      deps.refs.documentTitle.textContent = `أمر صباغة - ${name || '-'}`;
      deps.refs.documentBody.dataset.documentType = 'dyeing';
      deps.refs.documentBody.dataset.dyehouseName = name;
      deps.refs.documentBody.innerHTML = `<div class="document-sheet dyeing-document">${deps.withDocumentFooter(deps.buildDyeingOrderDocument({
        ...reportOrder,
        rawBatches: deps.getRawBatches(),
        productionBatches: deps.getProductionBatches(),
        finishedBatches: deps.getFinishedBatches(),
        rawReturns: deps.getRawReturns(),
        dyehouseTransfers: deps.getDyehouseTransfers(),
      }, name, fmt))}</div>`;
      stripDyeingPricingStageSections();
      if (deps.refs.documentDialog.open) deps.refs.documentDialog.close();
      deps.refs.documentDialog.showModal();
      deps.queueDocumentReport('dyeing', reportOrder);
    }

    async function openDocument(type) {
      const refs = deps.refs;
      if (deps.isBackendAvailable()) await deps.loadBackendData();
      const sourceOrder = deps.getOrders().find((item)=>item.id === deps.getSelectedOrderId());
      if (!sourceOrder) { alert('اختر طلبًا أولًا.'); return; }
      let order = deps.calculateOrder(sourceOrder);
      if (type === 'dyeing') {
        const names = deps.dyehouseNamesForOrder(order);
        if (names.length > 1) {
          deps.renderDyehouseDocumentPicker(order);
        } else {
          await openDyeingDocumentForDyehouse(names[0] || order.dyehouse || '');
        }
        return;
      }
      const fmt = (value) => deps.formatNumber(Number(value || 0));
      const safe = (value) => deps.escapeHtml(value || '-');
      const titleMap = { quotation:'عرض سعر', weaving:'أمر تشغيل نسيج', dyeing:'أمر تشغيل صباغة', waste:'تقرير الهالك', fullreport:'التقرير التفصيلي للطلب', labSamples:'عينات معمل', stickers:'استيكرات التشغيل' };
      const title = titleMap[type] || 'مستند تشغيلي';
      deps.setCurrentDocumentType(type);
      refs.documentTitle.textContent = title;
      refs.documentBody.dataset.documentType = type;
      refs.documentBody.dataset.reportTitle = title;
      refs.documentBody.dataset.reportSubtitle = `رقم الطلب: ${order.orderNumber || '-'} - العميل: ${order.customer || '-'}`;
      if (type === 'dyeing') refs.documentBody.dataset.dyehouseName = order.dyehouse || '';
      let body = '';
      let alreadyWrapped = false;
      if (type === 'quotation') {
        const linkedPricing = order?.pricingId ? deps.getPricings().find((pricing)=>pricing.id === order.pricingId) : null;
        const orderPricing = linkedPricing || deps.pricingForOrder(order);
        if (orderPricing && typeof deps.openPricingQuotation === 'function') {
          deps.openPricingQuotation(orderPricing.id);
          return;
        }
        body = deps.buildQuotationDocument(order, fmt, safe);
      } else if (type === 'weaving') {
        const operationNoteText = await deps.promptOperationNotes(sourceOrder, 'weaving');
        if (operationNoteText === null) return;
        const refreshedSourceOrder = deps.getOrders().find((item)=>item.id === deps.getSelectedOrderId()) || sourceOrder;
        order = deps.calculateOrder(refreshedSourceOrder);
        body = deps.buildWeavingOrderDocument({ ...order, operationNoteText, rawBatches:deps.getRawBatches(), dyehouseTransfers:deps.getDyehouseTransfers() }, fmt, safe);
      } else if (type === 'dyeing') {
        body = deps.buildDyeingSummaryDocument(order, fmt, safe);
      } else if (type === 'waste') {
        body = deps.buildWasteReportDocument({ ...order, reportNotesText:deps.combinedOperationNotes(order) }, fmt, safe);
      } else if (type === 'fullreport') {
        body = deps.buildCompactFullReportDocument({
          ...order,
          rawBatches:deps.getRawBatches(),
          finishedBatches:deps.getFinishedBatches(),
          customerBatches:deps.getCustomerBatches(),
          rawReturns:deps.getRawReturns(),
          dyehouseTransfers:deps.getDyehouseTransfers(),
          reportNotesText:deps.combinedOperationNotes(order),
        }, fmt, safe);
      } else if (type === 'labSamples') {
        body = deps.buildLabSamplesDocument(order, fmt, safe);
        alreadyWrapped = true;
      } else if (type === 'stickers') {
        body = deps.buildStickersDocument(order, fmt, safe);
        alreadyWrapped = true;
      } else {
        body = `${deps.documentHeader()}<div class="report-title"><h2>${title}</h2></div><div class="document-meta"><div><span>رقم الطلب</span>${safe(order.orderNumber)}</div><div><span>العميل</span>${safe(order.customer)}</div><div><span>التاريخ</span>${safe(order.orderDate)}</div><div><span>الصنف</span>${safe(order.fabricType)}</div><div><span>إجمالي الخام</span>${fmt(order.totalRawOrdered)}</div><div><span>المصبغة</span>${safe(order.dyehouse)}</div></div>${deps.documentFooter()}`;
      }
      refs.documentBody.innerHTML = alreadyWrapped ? body : `<div class="document-sheet">${body}</div>`;
      if (refs.documentDialog.open) refs.documentDialog.close();
      refs.documentDialog.showModal();
    }

    function manualStickerRowHtml(index = Date.now()) {
      return `<tr data-manual-sticker-row>
        <td><input data-manual-sticker="width" placeholder="العرض"></td>
        <td><input data-manual-sticker="weight" placeholder="الوزن"></td>
        <td><button class="mini-btn danger" type="button" data-remove-manual-sticker-row="${index}">حذف</button></td>
      </tr>`;
    }

    function openStickerChoiceDialog() {
      const refs = deps.refs;
      const sourceOrder = deps.getOrders().find((item)=>item.id === deps.getSelectedOrderId());
      refs.documentTitle.textContent = 'استيكرات التشغيل';
      refs.documentBody.dataset.documentType = 'sticker-choice';
      refs.documentBody.innerHTML = `<div class="document-sheet sticker-choice-sheet">
        <div class="subsection-head">
          <div>
            <p class="eyebrow">طباعة استيكرات</p>
            <h2>اختار نوع الاستيكر</h2>
          </div>
        </div>
        <section class="report-section">
          <h3>استيكر تشغيل</h3>
          <p class="muted">${sourceOrder ? `سيتم فتح استيكرات الطلب ${deps.escapeHtml(sourceOrder.orderNumber || '-')} / ${deps.escapeHtml(sourceOrder.customer || '-')}.` : 'لا يوجد طلب مفتوح حاليًا.'}</p>
          <button class="primary-btn" type="button" data-open-current-stickers ${sourceOrder ? '' : 'disabled'}>طباعة استيكر تشغيل للأوردر الحالي</button>
        </section>
        <section class="report-section">
          <h3>كرتيلات المعرض</h3>
          <p class="muted">استخدمها لطباعة كرتيلة معرض بدون رقم طلب أو عميل أو لون أو كمية، وبدون حفظ أي بيانات تشغيل.</p>
          <div class="form-grid">
            <label><span>البراند</span><select data-manual-sticker-order="showroomBrand"><option value="2B">2B</option><option value="Deltex.co">Deltex.co</option></select></label>
            <label><span>الصنف</span><input data-manual-sticker-order="fabricType" placeholder="الصنف"></label>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>العرض</th><th>الوزن</th><th>إجراء</th></tr></thead>
              <tbody data-manual-sticker-rows>${manualStickerRowHtml(1)}</tbody>
            </table>
          </div>
          <div class="document-actions no-print">
            <button class="mini-btn" type="button" data-add-manual-sticker-row>+ كرتيلة</button>
            <button class="primary-btn" type="button" data-print-manual-stickers>فتح كرتيلات المعرض</button>
          </div>
        </section>
      </div>`;
      if (refs.documentDialog.open) refs.documentDialog.close();
      refs.documentDialog.showModal();
    }

    function buildManualStickerOrderFromDialog() {
      const refs = deps.refs;
      const orderValue = (name) => refs.documentBody.querySelector(`[data-manual-sticker-order="${name}"]`)?.value.trim() || '';
      const rows = [...refs.documentBody.querySelectorAll('[data-manual-sticker-row]')].map((row, index) => {
        const value = (name) => row.querySelector(`[data-manual-sticker="${name}"]`)?.value.trim() || '';
        return {
          id: `manual-sticker-${Date.now()}-${index}`,
          plannedQuantity: 0,
          targetFinishedWidth: value('width'),
          rawWidth: value('width'),
          targetFinishedWeight: value('weight'),
        };
      }).filter((row)=>row.targetFinishedWidth || row.targetFinishedWeight);
      return {
        id: `manual-sticker-order-${Date.now()}`,
        orderNumber: '',
        customer: '',
        fabricType: orderValue('fabricType') || 'يدوي',
        showroomBrand: orderValue('showroomBrand') || '2B',
        allocations: rows.length ? rows : [{ id:'manual-sticker-empty', plannedQuantity:0 }],
      };
    }

    function openManualStickersDocument() {
      const refs = deps.refs;
      const order = buildManualStickerOrderFromDialog();
      deps.setCurrentDocumentType('stickers');
      refs.documentTitle.textContent = 'كرتيلات المعرض';
      refs.documentBody.dataset.documentType = 'stickers';
      refs.documentBody.dataset.reportTitle = 'كرتيلات المعرض';
      refs.documentBody.dataset.reportSubtitle = `الصنف: ${order.fabricType || '-'}`;
      refs.documentBody.innerHTML = deps.buildStickersDocument(order, { showroom:true });
      if (refs.documentDialog.open) refs.documentDialog.close();
      refs.documentDialog.showModal();
    }

    async function safeOpenDocument(type) {
      try {
        if (type === 'stickers') {
          openStickerChoiceDialog();
          return;
        }
        await openDocument(type === 'labsamples' ? 'labSamples' : type);
      } catch (error) {
        console.error('document-open-error', error);
        alert('تعذر فتح المستند حاليًا. راجع بيانات الطلب ثم حاول مرة أخرى.');
      }
    }

    function printCurrentDocument(stickerId = null) {
      const refs = deps.refs;
      const isSticker = deps.getCurrentDocumentType() === 'stickers' || !!refs.documentBody.querySelector('.sticker-sheet');
      const isOrdersFollowReport = !isSticker && !!refs.documentBody.querySelector('.orders-follow-report');
      let stickerPrintStyle = null;
      let reportPrintStyle = null;
      const cleanup = () => {
        document.body.classList.remove('printing-stickers');
        document.body.classList.remove('printing-orders-follow');
        if (stickerPrintStyle) stickerPrintStyle.remove();
        if (reportPrintStyle) reportPrintStyle.remove();
      };
      if (isSticker) {
        const cards = [...refs.documentBody.querySelectorAll('.sticker-card')];
        if (stickerId || cards.length === 1) {
          const selectedId = stickerId || cards[0]?.dataset.stickerId || '';
          document.body.classList.add('printing-stickers');
          stickerPrintStyle = document.createElement('style');
          stickerPrintStyle.textContent = `@media print { @page { size: 55mm 40mm; margin: 0; } body.printing-stickers .sticker-item:not(:has(.sticker-card[data-sticker-id="${selectedId}"])) { display:none!important; } body.printing-stickers .sticker-card:not([data-sticker-id="${selectedId}"]) { display:none!important; } }`;
          document.head.appendChild(stickerPrintStyle);
        }
      }
      if (isOrdersFollowReport) {
        document.body.classList.add('printing-orders-follow');
        reportPrintStyle = document.createElement('style');
        reportPrintStyle.textContent = '@media print { @page { size: A4 landscape; margin: 7mm; } }';
        document.head.appendChild(reportPrintStyle);
      }
      window.addEventListener('afterprint', cleanup, { once:true });
      setTimeout(() => window.print(), 80);
      setTimeout(cleanup, 4000);
    }

    function currentReportTypeFromDocument() {
      const refs = deps.refs;
      const documentType = refs.documentBody?.dataset.documentType || deps.getCurrentDocumentType();
      const directTypes = {
        weaving:'weaving_production_order',
        dyeing:'dyeing_production_order',
        fullreport:'dyehouses_report',
        'orders-follow':'orders_follow_report',
        'dyehouse-balances':'dyehouse_balances_report',
      };
      if (directTypes[documentType]) return directTypes[documentType];
      if (documentType === 'management-report') return `management_${deps.cleanCodePart(refs.documentBody.dataset.reportKey || refs.documentTitle.textContent || 'report')}`;
      if (['quotation','waste','rawreport','productionreport','customerreport'].includes(documentType)) return `${documentType}_pdf_report`;
      return '';
    }

    function currentShareReportPayload(reportType) {
      const refs = deps.refs;
      const documentType = refs.documentBody?.dataset.documentType || deps.getCurrentDocumentType();
      const sourceOrder = deps.getOrders().find((item)=>item.id===deps.getSelectedOrderId());
      const reportTypeLabels = deps.getReportTypeLabels();
      if (sourceOrder && ['weaving','dyeing','fullreport','quotation','waste','rawreport','productionreport','customerreport'].includes(documentType)) {
        const order = deps.calculateOrder(sourceOrder);
        if (documentType === 'dyeing') {
          const dyehouseName = String(refs.documentBody?.dataset.dyehouseName || '').trim();
          return dyehouseName ? { ...order, whatsappDyehouseName:dyehouseName } : order;
        }
        if (['weaving','fullreport'].includes(documentType)) return order;
        const titleMap = { quotation:'عرض سعر', waste:'تقرير الهالك', rawreport:'تقرير الخام', productionreport:'تقرير الإنتاج', customerreport:'تقرير تسليم العميل' };
        const title = titleMap[documentType] || refs.documentTitle?.textContent || 'تقرير PDF';
        reportTypeLabels[reportType] = title;
        return { ...order, isStandaloneReport:true, reportTitle:title, reportSubtitle:`رقم الطلب: ${order.orderNumber || '-'} - العميل: ${order.customer || '-'}` };
      }
      const title = refs.documentBody?.dataset.reportTitle || refs.documentTitle?.textContent || 'تقرير PDF';
      const subtitle = refs.documentBody?.dataset.reportSubtitle || 'تقرير PDF من نظام 2B Tex';
      reportTypeLabels[reportType] = title;
      return { id:reportType, orderNumber:title, customer:'تقرير', reportTitle:title, reportSubtitle:subtitle, isStandaloneReport:true };
    }

    async function shareCurrentReportPdf() {
      const refs = deps.refs;
      const reportType = currentReportTypeFromDocument();
      const order = reportType ? currentShareReportPayload(reportType) : null;
      if (!reportType || !order) {
        alert('لا يوجد تقرير مفتوح جاهز للمشاركة.');
        return;
      }
      const oldText = refs.shareWhatsAppBtn.textContent;
      refs.shareWhatsAppBtn.disabled = true;
      refs.shareWhatsAppBtn.textContent = 'جاري تجهيز PNG...';
      try {
        const blob = await deps.reportToPngBlob();
        const reportTypeLabels = deps.getReportTypeLabels();
        const fileName = `${deps.cleanCodePart(reportTypeLabels[reportType] || refs.documentTitle?.textContent || '2B-Tex')}-${deps.cleanCodePart(order.orderNumber || 'report')}.png`;
        const file = new File([blob], fileName, { type:'image/png' });
        if (navigator.canShare && navigator.canShare({ files:[file] }) && navigator.share) {
          await navigator.share({ title:reportTypeLabels[reportType] || refs.documentTitle?.textContent || '2B Tex', files:[file] });
          alert('تم فتح المشاركة اليدوية بصورة PNG عالية الدقة.');
          return;
        }
        if (navigator.clipboard && window.ClipboardItem) {
          try {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            alert('تم نسخ صورة التقرير للحافظة. افتح واتساب والصق الصورة يدويًا.');
            return;
          } catch (clipboardError) {
            console.warn('share-png-clipboard-skipped', clipboardError);
          }
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(()=>URL.revokeObjectURL(url), 1500);
        alert('تم تجهيز صورة PNG عالية الدقة وتنزيلها. أرسلها يدويًا من واتساب.');
      } catch (error) {
        console.error('share-png-error', error);
        alert('تعذر تجهيز صورة المشاركة. جرب الطباعة PDF أو أعد فتح التقرير مرة أخرى.');
      } finally {
        refs.shareWhatsAppBtn.disabled = false;
        refs.shareWhatsAppBtn.textContent = oldText;
      }
    }

    async function shareCurrentReportPngManual() {
      return await shareCurrentReportPdf();
    }

    function installDocumentsUiHandlers() {
      const refs = deps.refs;
      refs.documentBody.addEventListener('click', (event) => {
        if (event.target.closest('[data-open-current-stickers]')) {
          openDocument('stickers');
          return;
        }
        if (event.target.closest('[data-add-manual-sticker-row]')) {
          refs.documentBody.querySelector('[data-manual-sticker-rows]')?.insertAdjacentHTML('beforeend', manualStickerRowHtml(Date.now()));
          return;
        }
        if (event.target.closest('[data-remove-manual-sticker-row]')) {
          const rows = refs.documentBody.querySelectorAll('[data-manual-sticker-row]');
          if (rows.length > 1) event.target.closest('[data-manual-sticker-row]')?.remove();
          return;
        }
        if (event.target.closest('[data-print-manual-stickers]')) {
          openManualStickersDocument();
          return;
        }
        if (event.target.dataset.printSticker) printCurrentDocument(event.target.dataset.printSticker);
        if (event.target.dataset.editPricingDoc) deps.editPricing(event.target.dataset.editPricingDoc);
        if (event.target.dataset.convertPricing) deps.convertPricingToOrder(event.target.dataset.convertPricing);
      });
      refs.documentsPanel.onclick = (event) => {
        const orderPricingButton = event.target.closest('[data-order-pricing]');
        if (orderPricingButton) {
          deps.openPricingForOrder();
          return;
        }
        const type = event.target.dataset.doc;
        if (!type) return;
        if (type === 'print') { safeOpenDocument('dyeing'); setTimeout(()=>printCurrentDocument(),150); return; }
        safeOpenDocument(type);
      };
      refs.closeDocumentBtn.onclick = () => refs.documentDialog.close();
      refs.documentDialog.addEventListener('close', deps.stopWhatsappSettingsAutoRefresh);
      refs.printDocumentBtn.onclick = () => printCurrentDocument();
      if (refs.shareWhatsAppBtn) {
        refs.shareWhatsAppBtn.textContent = 'مشاركة PNG';
        refs.shareWhatsAppBtn.onclick = shareCurrentReportPngManual;
      }
      window.shareCurrentReportPngManual = shareCurrentReportPngManual;
    }

    return {
      renderDocuments,
      openDyeingDocumentForDyehouse,
      openDocument,
      safeOpenDocument,
      printCurrentDocument,
      currentReportTypeFromDocument,
      currentShareReportPayload,
      shareCurrentReportPdf,
      shareCurrentReportPngManual,
      installDocumentsUiHandlers,
    };
  }

  window.createDocumentsUi = createDocumentsUi;
})();

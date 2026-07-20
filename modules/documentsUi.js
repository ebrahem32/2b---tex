(function () {
  function createDocumentsUi(deps) {
    function stripDyeingPricingStageSections() {
      const body = deps.refs.documentBody;
      if (!body || body.dataset.documentType !== 'dyeing') return;
      [...body.querySelectorAll('.report-section')].forEach((section) => {
        const title = String(section.querySelector('h3')?.textContent || '').replace(/\s+/g, ' ').trim();
        if (title.includes('ظ…ط±ط§ط­ظ„ ط§ظ„طھط´ط؛ظٹظ„')) section.remove();
      });
    }

    function renderDocuments() {
      const refs = deps.refs;
      const currentOrder = deps.getOrders().find((item)=>item.id === deps.getSelectedOrderId());
      const linkedPricing = currentOrder?.pricingId ? deps.getPricings().find((pricing)=>pricing.id === currentOrder.pricingId) : null;
      const orderPricing = currentOrder ? (linkedPricing || deps.pricingForOrder(currentOrder)) : null;
      const pricingActionLabel = orderPricing ? 'تعديل كرت التسعير المرتبط' : 'إنشاء كرت تسعير من الطلب';
      const quotationActionLabel = orderPricing ? 'عرض السعر المرتبط' : 'إنشاء عرض سعر من الطلب';
      const costingAction = orderPricing ? `<button class="mini-btn gold" data-order-pricing-cost="${orderPricing.id}">ط¹ط±ط¶ ظƒط±طھ ط§ظ„طھظƒظ„ظپط©</button>` : '';
      refs.documentsPanel.innerHTML = `
        <div class="document-action-group">
          <h3>ط¹ط±ط¶ ط§ظ„ط¹ظ…ظٹظ„</h3>
          <button class="mini-btn gold" data-order-pricing>${pricingActionLabel}</button>
          <button class="mini-btn gold" data-doc="quotation">${quotationActionLabel}</button>
          ${costingAction}
        </div>
        <div class="document-action-group">
          <h3>ط£ظˆط§ظ…ط± ط§ظ„طھط´ط؛ظٹظ„</h3>
          <button class="mini-btn gold" data-doc="weaving">ط£ظ…ط± طھط´ط؛ظٹظ„ ظ†ط³ظٹط¬</button>
          <button class="mini-btn gold" data-doc="dyeing">ط£ظ…ط± طھط´ط؛ظٹظ„ طµط¨ط§ط؛ط©</button>
          <button class="mini-btn gold" data-doc="labSamples">ط¹ظٹظ†ط§طھ ظ…ط¹ظ…ظ„</button>
          <button class="mini-btn gold" data-doc="stickers">ط·ط¨ط§ط¹ط© ط§ط³طھظٹظƒط±ط§طھ</button>
        </div>
        <div class="document-action-group">
          <h3>ط§ظ„طھظ‚ط§ط±ظٹط± ظˆط§ظ„ظƒط´ظˆظپط§طھ</h3>
          <button class="mini-btn" data-doc="waste">طھظ‚ط±ظٹط± ط§ظ„ظ‡ط§ظ„ظƒ</button>
          <button class="mini-btn gold" data-doc="fullreport">ط§ظ„طھظ‚ط±ظٹط± ط§ظ„طھظپطµظٹظ„ظٹ</button>
          <button class="mini-btn" data-doc="print">ط·ط¨ط§ط¹ط© ط§ظ„طھظ‚ط±ظٹط± ط§ظ„ط­ط§ظ„ظٹ</button>
          <button class="mini-btn" disabled>طھطµط¯ظٹط± PDF ظ„ط§ط­ظ‚ظ‹ط§</button>
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
      deps.refs.documentTitle.textContent = `ط£ظ…ط± طµط¨ط§ط؛ط© - ${name || '-'}`;
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
      if (!sourceOrder) { alert('ط§ط®طھط± ط·ظ„ط¨ظ‹ط§ ط£ظˆظ„ظ‹ط§.'); return; }
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
      const titleMap = { quotation:'ط¹ط±ط¶ ط³ط¹ط±', weaving:'ط£ظ…ط± طھط´ط؛ظٹظ„ ظ†ط³ظٹط¬', dyeing:'ط£ظ…ط± طھط´ط؛ظٹظ„ طµط¨ط§ط؛ط©', waste:'طھظ‚ط±ظٹط± ط§ظ„ظ‡ط§ظ„ظƒ', fullreport:'ط§ظ„طھظ‚ط±ظٹط± ط§ظ„طھظپطµظٹظ„ظٹ ظ„ظ„ط·ظ„ط¨', labSamples:'ط¹ظٹظ†ط§طھ ظ…ط¹ظ…ظ„', stickers:'ط§ط³طھظٹظƒط±ط§طھ ط§ظ„طھط´ط؛ظٹظ„' };
      const title = titleMap[type] || 'ظ…ط³طھظ†ط¯ طھط´ط؛ظٹظ„ظٹ';
      deps.setCurrentDocumentType(type);
      refs.documentTitle.textContent = title;
      refs.documentBody.dataset.documentType = type;
      refs.documentBody.dataset.reportTitle = title;
      refs.documentBody.dataset.reportSubtitle = `ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨: ${order.orderNumber || '-'} - ط§ظ„ط¹ظ…ظٹظ„: ${order.customer || '-'}`;
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
        body = `${deps.documentHeader()}<div class="report-title"><h2>${title}</h2></div><div class="document-meta"><div><span>ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨</span>${safe(order.orderNumber)}</div><div><span>ط§ظ„ط¹ظ…ظٹظ„</span>${safe(order.customer)}</div><div><span>ط§ظ„طھط§ط±ظٹط®</span>${safe(order.orderDate)}</div><div><span>ط§ظ„طµظ†ظپ</span>${safe(order.fabricType)}</div><div><span>ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط®ط§ظ…</span>${fmt(order.totalRawOrdered)}</div><div><span>ط§ظ„ظ…طµط¨ط؛ط©</span>${safe(order.dyehouse)}</div></div>${deps.documentFooter()}`;
      }
      refs.documentBody.innerHTML = alreadyWrapped ? body : `<div class="document-sheet">${body}</div>`;
      if (refs.documentDialog.open) refs.documentDialog.close();
      refs.documentDialog.showModal();
    }

    function manualStickerRowHtml(index = Date.now()) {
      return `<tr data-manual-sticker-row>
        <td><input data-manual-sticker="width" placeholder="ط§ظ„ط¹ط±ط¶"></td>
        <td><input data-manual-sticker="weight" placeholder="ط§ظ„ظˆط²ظ†"></td>
        <td><button class="mini-btn danger" type="button" data-remove-manual-sticker-row="${index}">ط­ط°ظپ</button></td>
      </tr>`;
    }

    function openStickerChoiceDialog() {
      const refs = deps.refs;
      const sourceOrder = deps.getOrders().find((item)=>item.id === deps.getSelectedOrderId());
      refs.documentTitle.textContent = 'ط§ط³طھظٹظƒط±ط§طھ ط§ظ„طھط´ط؛ظٹظ„';
      refs.documentBody.dataset.documentType = 'sticker-choice';
      refs.documentBody.innerHTML = `<div class="document-sheet sticker-choice-sheet">
        <div class="subsection-head">
          <div>
            <p class="eyebrow">ط·ط¨ط§ط¹ط© ط§ط³طھظٹظƒط±ط§طھ</p>
            <h2>ط§ط®طھط§ط± ظ†ظˆط¹ ط§ظ„ط§ط³طھظٹظƒط±</h2>
          </div>
        </div>
        <section class="report-section">
          <h3>ط§ط³طھظٹظƒط± طھط´ط؛ظٹظ„</h3>
          <p class="muted">${sourceOrder ? `ط³ظٹطھظ… ظپطھط­ ط§ط³طھظٹظƒط±ط§طھ ط§ظ„ط·ظ„ط¨ ${deps.escapeHtml(sourceOrder.orderNumber || '-')} / ${deps.escapeHtml(sourceOrder.customer || '-')}.` : 'ظ„ط§ ظٹظˆط¬ط¯ ط·ظ„ط¨ ظ…ظپطھظˆط­ ط­ط§ظ„ظٹظ‹ط§.'}</p>
          <button class="primary-btn" type="button" data-open-current-stickers ${sourceOrder ? '' : 'disabled'}>ط·ط¨ط§ط¹ط© ط§ط³طھظٹظƒط± طھط´ط؛ظٹظ„ ظ„ظ„ط£ظˆط±ط¯ط± ط§ظ„ط­ط§ظ„ظٹ</button>
        </section>
        <section class="report-section">
          <h3>ظƒط±طھظٹظ„ط§طھ ط§ظ„ظ…ط¹ط±ط¶</h3>
          <p class="muted">ط§ط³طھط®ط¯ظ…ظ‡ط§ ظ„ط·ط¨ط§ط¹ط© ظƒط±طھظٹظ„ط© ظ…ط¹ط±ط¶ ط¨ط¯ظˆظ† ط±ظ‚ظ… ط·ظ„ط¨ ط£ظˆ ط¹ظ…ظٹظ„ ط£ظˆ ظ„ظˆظ† ط£ظˆ ظƒظ…ظٹط©طŒ ظˆط¨ط¯ظˆظ† ط­ظپط¸ ط£ظٹ ط¨ظٹط§ظ†ط§طھ طھط´ط؛ظٹظ„.</p>
          <div class="form-grid">
            <label><span>ط§ظ„ط¨ط±ط§ظ†ط¯</span><select data-manual-sticker-order="showroomBrand"><option value="2B">2B</option><option value="Deltex.co">Deltex.co</option></select></label>
            <label><span>ط§ظ„طµظ†ظپ</span><input data-manual-sticker-order="fabricType" placeholder="ط§ظ„طµظ†ظپ"></label>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>ط§ظ„ط¹ط±ط¶</th><th>ط§ظ„ظˆط²ظ†</th><th>ط¥ط¬ط±ط§ط،</th></tr></thead>
              <tbody data-manual-sticker-rows>${manualStickerRowHtml(1)}</tbody>
            </table>
          </div>
          <div class="document-actions no-print">
            <button class="mini-btn" type="button" data-add-manual-sticker-row>+ ظƒط±طھظٹظ„ط©</button>
            <button class="primary-btn" type="button" data-print-manual-stickers>ظپطھط­ ظƒط±طھظٹظ„ط§طھ ط§ظ„ظ…ط¹ط±ط¶</button>
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
        fabricType: orderValue('fabricType') || 'ظٹط¯ظˆظٹ',
        showroomBrand: orderValue('showroomBrand') || '2B',
        allocations: rows.length ? rows : [{ id:'manual-sticker-empty', plannedQuantity:0 }],
      };
    }

    function openManualStickersDocument() {
      const refs = deps.refs;
      const order = buildManualStickerOrderFromDialog();
      deps.setCurrentDocumentType('stickers');
      refs.documentTitle.textContent = 'ظƒط±طھظٹظ„ط§طھ ط§ظ„ظ…ط¹ط±ط¶';
      refs.documentBody.dataset.documentType = 'stickers';
      refs.documentBody.dataset.reportTitle = 'ظƒط±طھظٹظ„ط§طھ ط§ظ„ظ…ط¹ط±ط¶';
      refs.documentBody.dataset.reportSubtitle = `ط§ظ„طµظ†ظپ: ${order.fabricType || '-'}`;
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
        alert('طھط¹ط°ط± ظپطھط­ ط§ظ„ظ…ط³طھظ†ط¯ ط­ط§ظ„ظٹظ‹ط§. ط±ط§ط¬ط¹ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط·ظ„ط¨ ط«ظ… ط­ط§ظˆظ„ ظ…ط±ط© ط£ط®ط±ظ‰.');
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
      if (window.twoBTexDesktop?.print) {
        setTimeout(async () => {
          try {
            await window.twoBTexDesktop.print();
          } catch (error) {
            console.warn('desktop-print-fallback', error);
            window.print();
          } finally {
            setTimeout(cleanup, 1000);
          }
        }, 80);
        return;
      }
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
        const titleMap = { quotation:'ط¹ط±ط¶ ط³ط¹ط±', waste:'طھظ‚ط±ظٹط± ط§ظ„ظ‡ط§ظ„ظƒ', rawreport:'طھظ‚ط±ظٹط± ط§ظ„ط®ط§ظ…', productionreport:'طھظ‚ط±ظٹط± ط§ظ„ط¥ظ†طھط§ط¬', customerreport:'طھظ‚ط±ظٹط± طھط³ظ„ظٹظ… ط§ظ„ط¹ظ…ظٹظ„' };
        const title = titleMap[documentType] || refs.documentTitle?.textContent || 'طھظ‚ط±ظٹط± PDF';
        reportTypeLabels[reportType] = title;
        return { ...order, isStandaloneReport:true, reportTitle:title, reportSubtitle:`ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨: ${order.orderNumber || '-'} - ط§ظ„ط¹ظ…ظٹظ„: ${order.customer || '-'}` };
      }
      const title = refs.documentBody?.dataset.reportTitle || refs.documentTitle?.textContent || 'طھظ‚ط±ظٹط± PDF';
      const subtitle = refs.documentBody?.dataset.reportSubtitle || 'طھظ‚ط±ظٹط± PDF ظ…ظ† ظ†ط¸ط§ظ… 2B Tex';
      reportTypeLabels[reportType] = title;
      return { id:reportType, orderNumber:title, customer:'طھظ‚ط±ظٹط±', reportTitle:title, reportSubtitle:subtitle, isStandaloneReport:true };
    }

    function currentOpenDocumentSharePayload() {
      const refs = deps.refs;
      const sheet = refs.documentBody?.querySelector('.document-sheet');
      if (!sheet || !refs.documentDialog?.open) return null;
      const documentType = refs.documentBody?.dataset.documentType || deps.getCurrentDocumentType() || 'document';
      const reportType = currentReportTypeFromDocument() || `document_${deps.cleanCodePart(documentType || 'open')}`;
      const title = (refs.documentBody?.dataset.reportTitle || refs.documentTitle?.textContent || '2B Tex').trim();
      const number =
        sheet.querySelector('.report-title small')?.textContent ||
        sheet.querySelector('.quotation-title small')?.textContent ||
        sheet.querySelector('h2 small')?.textContent ||
        refs.documentBody?.dataset.documentNumber ||
        'document';
      return {
        sheet,
        reportType,
        title,
        orderNumber:String(number).replace('#', '').trim() || 'document',
      };
    }

    function blobToDataUrl(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error || new Error('Failed to read PNG blob.'));
        reader.readAsDataURL(blob);
      });
    }

    async function shareCurrentReportPdf() {
      const refs = deps.refs;
      const openDocument = currentOpenDocumentSharePayload();
      if (!openDocument) {
        alert('ظ„ط§ ظٹظˆط¬ط¯ طھظ‚ط±ظٹط± ظ…ظپطھظˆط­ ط¬ط§ظ‡ط² ظ„ظ„ظ…ط´ط§ط±ظƒط©.');
        return;
      }
      const reportType = openDocument.reportType;
      const order = currentShareReportPayload(reportType) || openDocument;
      const oldText = refs.shareWhatsAppBtn.textContent;
      refs.shareWhatsAppBtn.disabled = true;
      refs.shareWhatsAppBtn.textContent = 'ط¬ط§ط±ظٹ طھط¬ظ‡ظٹط² PNG...';
      try {
        const blob = await deps.reportToPngBlob();
        const reportTypeLabels = deps.getReportTypeLabels();
        const title = reportTypeLabels[reportType] || openDocument.title || refs.documentTitle?.textContent || '2B-Tex';
        const fileName = `${deps.cleanCodePart(title)}-${deps.cleanCodePart(order.orderNumber || openDocument.orderNumber || 'document')}.png`;
        if (window.twoBTexDesktop?.savePng) {
          const dataUrl = await blobToDataUrl(blob);
          const result = await window.twoBTexDesktop.savePng({ fileName, dataUrl });
          if (result?.ok) {
            alert('تم حفظ صورة PNG وفتح مكان الملف.');
            return;
          }
          if (result?.canceled) return;
          console.warn('desktop-save-png-fallback', result?.error || result);
        }
        const file = new File([blob], fileName, { type:'image/png' });
        if (navigator.canShare && navigator.canShare({ files:[file] }) && navigator.share) {
          await navigator.share({ title:reportTypeLabels[reportType] || refs.documentTitle?.textContent || '2B Tex', files:[file] });
          alert('طھظ… ظپطھط­ ط§ظ„ظ…ط´ط§ط±ظƒط© ط§ظ„ظٹط¯ظˆظٹط© ط¨طµظˆط±ط© PNG ط¹ط§ظ„ظٹط© ط§ظ„ط¯ظ‚ط©.');
          return;
        }
        if (navigator.clipboard && window.ClipboardItem) {
          try {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            alert('طھظ… ظ†ط³ط® طµظˆط±ط© ط§ظ„طھظ‚ط±ظٹط± ظ„ظ„ط­ط§ظپط¸ط©. ط§ظپطھط­ ظˆط§طھط³ط§ط¨ ظˆط§ظ„طµظ‚ ط§ظ„طµظˆط±ط© ظٹط¯ظˆظٹظ‹ط§.');
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
        alert('طھظ… طھط¬ظ‡ظٹط² طµظˆط±ط© PNG ط¹ط§ظ„ظٹط© ط§ظ„ط¯ظ‚ط© ظˆطھظ†ط²ظٹظ„ظ‡ط§. ط£ط±ط³ظ„ظ‡ط§ ظٹط¯ظˆظٹظ‹ط§ ظ…ظ† ظˆط§طھط³ط§ط¨.');
      } catch (error) {
        console.error('share-png-error', error);
        alert('طھط¹ط°ط± طھط¬ظ‡ظٹط² طµظˆط±ط© ط§ظ„ظ…ط´ط§ط±ظƒط©. ط¬ط±ط¨ ط§ظ„ط·ط¨ط§ط¹ط© PDF ط£ظˆ ط£ط¹ط¯ ظپطھط­ ط§ظ„طھظ‚ط±ظٹط± ظ…ط±ط© ط£ط®ط±ظ‰.');
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
        const orderPricingCostButton = event.target.closest('[data-order-pricing-cost]');
        if (orderPricingCostButton) {
          deps.openPricingCostSheet(orderPricingCostButton.dataset.orderPricingCost);
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
        refs.shareWhatsAppBtn.textContent = 'ظ…ط´ط§ط±ظƒط© PNG';
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


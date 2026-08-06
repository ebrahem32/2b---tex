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
      accessoryLineName,
      accessoryPlannedQuantityForLine,
      accessoryPlannedPartsForOrder,
      accessoryFlowQuantityForLine,
      accessoryFlowPartsForOrder,
      accessoryBalancePartsForOrder,
      stockFlowText,
    } = deps;

    const safeText = (value) => escapeHtml(value === undefined || value === null || value === '' ? '-' : value);
    const fmt = (value, digits = 3) => formatNumber(Number(value || 0), digits);
    const clean = (value) => String(value || '').trim();
    const colorWithPantone = (line) => {
      const color = clean(line?.color);
      const pantone = clean(line?.pantoneCode || line?.pantone_code);
      if (color && pantone && color.toLocaleLowerCase('ar') !== pantone.toLocaleLowerCase('ar')) return `${color} — بانتون ${pantone}`;
      return color || pantone || '-';
    };
    const approximateColorHex = (line) => {
      const saved = clean(line?.colorHex || line?.color_hex);
      if (/^#[0-9a-f]{6}$/i.test(saved)) return saved;
      const name = clean(line?.color).toLocaleLowerCase('ar');
      const colors = [
        [/اسود|أسود|فاحم/, '#151515'], [/ابيض|أبيض|اوف وايت|أوف وايت/, '#f3efe2'],
        [/رمادي/, '#777b80'], [/بيج|كشمير/, '#c6ad86'], [/بني|شوكولات/, '#5b3526'],
        [/زيتي/, '#596334'], [/اخضر|أخضر/, '#285943'], [/بترول/, '#17666a'], [/كحلي/, '#172d46'],
        [/ازرق|أزرق/, '#315f8b'], [/سماوي/, '#9dcbd0'], [/نبيتي/, '#661f30'], [/احمر|أحمر/, '#a8282f'],
        [/موف/, '#76527d'], [/بينك|وردي|روز/, '#d78fa7'], [/اصفر|أصفر|مسطردة/, '#d4aa3b'],
      ];
      return colors.find(([pattern]) => pattern.test(name))?.[1] || '';
    };
    const colorLabelWithSwatch = (line) => {
      const color = clean(line?.color);
      const pantone = clean(line?.pantoneCode || line?.pantone_code);
      const label = color && pantone && color.toLocaleLowerCase('ar') !== pantone.toLocaleLowerCase('ar')
        ? `${safeText(color)} <span class="pantone-label">— بانتون <bdi dir="ltr">${safeText(pantone)}</bdi></span>`
        : (pantone ? `<bdi class="pantone-label" dir="ltr">${safeText(pantone)}</bdi>` : safeText(color || '-'));
      const hex = approximateColorHex(line);
      return `<span class="document-color-label">${hex ? `<i class="document-color-swatch" style="background:${hex}" title="معاينة تقريبية للون"></i>` : ''}<span>${label}</span></span>`;
    };
    const transferTextLooksRaw = (value) => {
      const text = String(value || '');
      if (text.includes('[allocation-transfer]')) return false;
      return text.includes('[raw-transfer]')
        || /\braw\b/i.test(text)
        || text.includes('\u062e\u0631\u0648\u062c \u062e\u0627\u0645')
        || text.includes('\u0646\u0642\u0644 \u062e\u0627\u0645');
    };
    function sourceAllocationForTransfer(order, transfer) {
      const id = transfer?.allocationId || transfer?.fromAllocationId || transfer?.from_allocation_id;
      return orderAllocations(order).find((allocation) => allocation.id === id) || null;
    }

    const transferKind = (transfer, order = null) => {
      const text = clean(`${transfer?.mode || ''} ${transfer?.reason || ''} ${transfer?.notes || ''}`);
      if (text.includes('[accessory-transfer]')) return 'accessory';
      if (text.includes('[allocation-transfer]')) return 'allocation';
      if (transferTextLooksRaw(text)) return 'raw';
      if (transfer?.newAllocationId || transfer?.toAllocationId || transfer?.to_allocation_id) return 'allocation';
      const sourceAllocation = order ? sourceAllocationForTransfer(order, transfer) : null;
      const planned = Number(sourceAllocation?.plannedQuantity || 0);
      const quantity = Number(transfer?.quantity || 0);
      if (planned && quantity > 0 && quantity < planned - 0.01) return 'raw';
      return 'allocation';
    };
    const isRawTransfer = (transfer, order = null) => transferKind(transfer, order) === 'raw';
    const customerName = (order) => {
      const name = clean(order?.customer || order?.customerName || order?.clientName || '');
      const code = clean(order?.customerCode || order?.customer_code || '');
      return code ? `${name} (${code})` : name;
    };
    const fallbackAccessoryName = (line, order) => clean(line?.type || order?.accessoryType || 'إكسسوار');
    const resolvedAccessoryName = (line, order) => (
      typeof accessoryLineName === 'function' ? accessoryLineName(line, order) : fallbackAccessoryName(line, order)
    );
    const flowText = (clothQuantity, accessoryParts = []) => {
      if (typeof stockFlowText === 'function') return stockFlowText(clothQuantity, accessoryParts);
      const hasAccessories = Array.isArray(accessoryParts) && accessoryParts.length > 0;
      const clothText = Number(clothQuantity || 0) ? (hasAccessories ? `${fmt(clothQuantity)} جسم` : fmt(clothQuantity)) : '';
      return [clothText, ...(accessoryParts || [])].filter(Boolean).join(' - ') || '-';
    };
    const flowCell = (clothQuantity, accessoryParts = []) => flowText(clothQuantity, accessoryParts)
      .split(' - ')
      .map((part, index) => `<span class="report-flow-line ${index ? 'report-flow-accessory' : 'report-flow-body'}">${safeText(part)}</span>`)
      .join('');
    const plannedAccessoryParts = (order, allocation) => (
      typeof accessoryPlannedPartsForOrder === 'function' ? accessoryPlannedPartsForOrder(order, allocation) : []
    );
    const movementAccessoryParts = (order, allocation, movement) => (
      typeof accessoryFlowPartsForOrder === 'function' ? accessoryFlowPartsForOrder(order, allocation, movement) : []
    );
    const balanceAccessoryParts = (order, allocation) => (
      typeof accessoryBalancePartsForOrder === 'function' ? accessoryBalancePartsForOrder(order, allocation) : movementAccessoryParts(order, allocation, 'balance')
    );

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

    function actualWastePercentForLine(line) {
      const waste = Number(line?.wasteQuantity || line?.actualWasteQuantity || 0);
      const finished = Number(line?.finishedReceived || line?.totalFinishedReceived || 0);
      if (waste > 0 && finished > 0) return roundNumber((waste / finished) * 100);
      return Number(line?.wastePercent || line?.actualWastePercent || 0);
    }

    function orderAccessoryLines(order) {
      const configuredLines = Array.isArray(order?.accessoryLines) ? order.accessoryLines : [];
      const normalized = configuredLines
        .map((line) => ({
          type: clean(resolvedAccessoryName(line, order)),
          percent: Number(line.percent || 0),
          quantity: Number(line.quantityManual || line.quantity || 0),
          unit: line.unit === 'piece' ? 'piece' : 'kg',
          length: Number(line.length || 0),
          width: Number(line.width || 0),
        }))
        .filter((line) => line.type || line.percent || line.quantity);
      if (normalized.length) {
        const byType = new Map();
        normalized.forEach((line) => {
          const type = clean(line.type || resolvedAccessoryName(line, order));
          const key = [type, line.unit, Number(line.length || 0), Number(line.width || 0)].join('|');
          const current = byType.get(key) || { type, percent: 0, quantity: 0, unit: line.unit, length: line.length, width: line.width };
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
      return [{ type: type || resolvedAccessoryName({}, order), percent, quantity }];
    }

    function accessoryPercentForOrder(line, order) {
      if (line?.unit === 'piece') return roundNumber(Number(line?.percent || 0));
      const quantity = Number(line?.quantity || 0);
      const orderTotal = Number(order?.totalRawOrdered || order?.totalRawQuantity || 0);
      if (quantity > 0 && orderTotal > 0) return roundNumber((quantity / orderTotal) * 100);
      return roundNumber(Number(line?.percent || 0));
    }

    function reportShell(title, order, body, options = {}) {
      const subtitle = options.subtitle ? `<span>${safeText(options.subtitle)}</span>` : '';
      const info = options.skipBasicInfo ? '' : basicInfoSection(order, options);
      return `<div class="two-b-report">${documentHeader()}<div class="report-title"><h2>${safeText(title)}${order?.orderNumber ? ` <small># ${safeText(order.orderNumber)}</small>` : ''}</h2>${subtitle}</div>${info}${body}${documentFooter()}</div>`;
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
      const includeWarehouseBalance = !!options.includeWarehouseBalance;
      const includeWaste = !!options.includeWaste;
      const includePlannedWasteBreakdown = !!options.includePlannedWasteBreakdown;
      const headers = [
        'اللون',
        includeInch ? 'البوصة' : '',
        'الكمية',
        includeDyehouse ? 'المصبغة' : '',
        includeReceived ? 'دخل المخزن' : '',
        includeCustomerDelivered ? 'تسليم العميل' : '',
        includeWarehouseBalance ? 'رصيد المخزن' : '',
        includeWaste ? 'الهالك الفعلي' : '',
        includeFinished ? 'الوزن المجهز' : '',
        'العرض',
      ].filter(Boolean);
      const body = rows.map((line) => {
        const plannedQuantityCell = includePlannedWasteBreakdown
          ? `${flowCell(line.plannedQuantity, plannedAccessoryParts(order, line))}<span class="report-flow-line report-flow-accessory">طلب العميل ${fmt(line.customerPlannedQuantity ?? line.plannedQuantity)} + هالك ${fmt(line.documentExpectedWasteQuantity || 0)} (${formatNumber(line.documentExpectedWastePercent || 0, 2)}%)</span>`
          : flowCell(line.plannedQuantity, plannedAccessoryParts(order, line));
        const cells = [
          colorLabelWithSwatch(line),
          includeInch ? safeText(line.rawInch || order?.inchWidth) : '',
          plannedQuantityCell,
          includeDyehouse ? safeText(line.dyehouse || order?.dyehouse) : '',
          includeReceived ? flowCell(line.finishedReceived, movementAccessoryParts(order, line, 'received')) : '',
          includeCustomerDelivered ? flowCell(line.deliveredToCustomer || line.customerDelivered, movementAccessoryParts(order, line, 'customer')) : '',
          includeWarehouseBalance ? flowCell(Number(line.finishedReceived || 0) - Number(line.warehouseOut ?? line.deliveredToCustomer ?? line.customerDelivered ?? 0), balanceAccessoryParts(order, line)) : '',
          includeWaste ? `${fmt(line.wasteQuantity)} (${formatNumber(actualWastePercentForLine(line), 1)}%)` : '',
          includeFinished ? safeText(line.targetFinishedWeight) : '',
          safeText(line.targetFinishedWidth || line.rawWidth),
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
        if (!showMovement) {
          const unitLabel = line.unit === 'piece' ? 'قطعة' : 'كجم';
          const size = line.length || line.width ? ` — مقاس ${fmt(line.length || 0)} × ${fmt(line.width || 0)} سم` : '';
          return `<tr><td>${safeText(`${line.type}${size}`)}</td><td>${formatNumber(accessoryPercentForOrder(line, order))}%</td><td>${fmt(line.quantity)} ${unitLabel}</td></tr>`;
        }
        const allocations = orderAllocations(order);
        const required = typeof accessoryPlannedQuantityForLine === 'function'
          ? allocations.reduce((total, allocation) => total + Number(accessoryPlannedQuantityForLine(order, allocation, line) || 0), 0)
          : Number(line.quantity || order?.accessoryRequired || 0);
        const sent = typeof accessoryFlowQuantityForLine === 'function'
          ? allocations.reduce((total, allocation) => total + Number(accessoryFlowQuantityForLine(order, allocation, 'sent', line) || 0), 0)
          : Number(order?.accessorySent || 0);
        const received = typeof accessoryFlowQuantityForLine === 'function'
          ? allocations.reduce((total, allocation) => total + Number(accessoryFlowQuantityForLine(order, allocation, 'received', line) || 0), 0)
          : Number(order?.accessoryReceived || 0);
        const delivered = typeof accessoryFlowQuantityForLine === 'function'
          ? allocations.reduce((total, allocation) => total + Number(accessoryFlowQuantityForLine(order, allocation, 'customer', line) || 0), 0)
          : Number(order?.accessoryDelivered || 0);
        return `<tr><td>${safeText(line.type)}</td><td>${formatNumber(accessoryPercentForOrder({ ...line, quantity:required }, order))}%</td><td>${fmt(required)}</td><td>${fmt(sent)}</td><td>${fmt(received)}</td><td>${fmt(delivered)}</td><td>${fmt(received - delivered)}</td></tr>`;
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

    function firstAllocationValue(order, keys) {
      const line = orderAllocations(order).find((allocation) => keys.some((key) => clean(allocation?.[key])));
      if (!line) return '';
      const key = keys.find((field) => clean(line?.[field]));
      return key ? line[key] : '';
    }

    function finishedWidthSummary(order) {
      const values = uniqueNonEmpty(orderAllocations(order).map((line) => line.targetFinishedWidth || line.rawWidth));
      if (values.length) return values.join('، ');
      return firstAllocationValue(order, ['targetFinishedWidth', 'rawWidth']) || order?.finishedWidth || '-';
    }

    function finishedWeightSummary(order) {
      const values = uniqueNonEmpty(orderAllocations(order).map((line) => line.targetFinishedWeight));
      if (values.length) return values.join('، ');
      return order?.finishedWeight || firstAllocationValue(order, ['targetFinishedWeight']) || '-';
    }

    function weavingCustomerQuantity(order) {
      const allocatedQuantity = orderAllocations(order)
        .reduce((total, line) => total + Number(line?.plannedQuantity || line?.planned_quantity || 0), 0);
      return roundNumber(allocatedQuantity > 0
        ? allocatedQuantity
        : Number(order?.totalRawQuantity || order?.totalRawOrdered || 0));
    }

    function weavingRequiredRawQuantity(order) {
      const customerQuantity = weavingCustomerQuantity(order);
      const wastePercent = Math.max(Number(order?.expectedWastePercent || order?.expected_waste_percent || 0), 0);
      return roundNumber(customerQuantity * (1 + (wastePercent / 100)));
    }

    function weavingItemDescription(order) {
      return [
        `البوصة ${safeText(widthSummary(order))}`,
        `الصنف ${safeText(order?.fabricType)}`,
        `الخام المطلوب ${fmt(weavingRequiredRawQuantity(order))} كجم`,
        `وزن مجهز ${safeText(finishedWeightSummary(order))}`,
        `العرض مجهز ${safeText(finishedWidthSummary(order))}`,
      ].join(' - ');
    }

    function weavingInfoSection(order) {
      return `<div class="document-meta weaving-document-meta"><div><span>التاريخ</span>${safeText(order?.orderDate)}</div><div><span>العميل</span>${safeText(customerName(order))}</div><div><span>الصنف</span>${safeText(order?.fabricType)}</div><div><span>المصبغة</span>${safeText(order?.dyehouse)}</div></div>`;
    }

    function weavingRawComponents(order) {
      const configured = Array.isArray(order?.operationNotes?.rawComponents) ? order.operationNotes.rawComponents : [];
      return configured.map((line)=>({
        name:clean(line?.name),
        specification:clean(line?.specification),
        quantity:Number(line?.quantity || 0),
      })).filter((line)=>line.name || line.specification || line.quantity > 0);
    }

    function weavingRawComponentsSection(order) {
      const rows = weavingRawComponents(order);
      if (!rows.length) return '';
      const wastePercent = order?.orderType === 'manufacturing' ? 0 : Math.max(Number(order?.expectedWastePercent || 0), 0);
      const body = rows.map((line)=>{
        const wasteQuantity = roundNumber(line.quantity * wastePercent / 100);
        const operatingQuantity = roundNumber(line.quantity + wasteQuantity);
        const label = [line.name, line.specification].filter(Boolean).join(' - ');
        return `<tr><td>${safeText(label)}</td><td>${fmt(line.quantity)}</td><td>${wastePercent ? `${fmt(wasteQuantity)} (${fmt(wastePercent)}%)` : 'غير مطبق'}</td><td>${fmt(operatingQuantity)}</td></tr>`;
      }).join('');
      return `<section class="report-section weaving-components-section"><h3>مكونات تشغيل الخام</h3><table><thead><tr><th>المكون / المواصفة</th><th>كمية العميل</th><th>الهالك المضاف</th><th>كمية التشغيل</th></tr></thead><tbody>${body}</tbody></table></section>`;
    }

    function buildWeavingOrderDocument(order) {
      const customerQuantity = weavingCustomerQuantity(order);
      const wastePercent = Math.max(Number(order?.expectedWastePercent || order?.expected_waste_percent || 0), 0);
      const requiredRawQuantity = weavingRequiredRawQuantity(order);
      const manufacturing = order?.orderType === 'manufacturing';
      const commercialRows = manufacturing
        ? `<tr><th>كمية خام العميل</th><td>${fmt(customerQuantity)}</td><th>سعر الخام والهالك</th><td>غير محسوب</td></tr>`
        : `<tr><th>كمية طلب العميل</th><td>${fmt(customerQuantity)}</td><th>هالك التسعير</th><td>${fmt(wastePercent)}%</td></tr><tr><th>إجمالي الخام المطلوب</th><td>${fmt(requiredRawQuantity)}</td><th>سعر الخام</th><td>${fmt(orderRawCost(order))}</td></tr>`;
      const rawRows = `<section class="report-section"><h3>بيانات التشغيل</h3><table class="summary-table"><tbody><tr><th>البوصة</th><td>${safeText(widthSummary(order))}</td><th>نوع التشغيل</th><td>${manufacturing ? 'مصنعية / صباغة فقط' : 'بيع وشراء'}</td></tr><tr><th>الوزن المجهز</th><td>${safeText(finishedWeightSummary(order))}</td><th>العرض المجهز</th><td>${safeText(finishedWidthSummary(order))}</td></tr>${commercialRows}</tbody></table></section>`;
      return reportShell(manufacturing ? 'أمر تشغيل مصنعية / صباغة' : 'أمر تشغيل نسيج', order, `${weavingInfoSection(order)}${rawRows}${weavingRawComponentsSection(order)}${colorRows(order, orderAllocations(order), { includeDyehouse:false, includeReceived:false, includeWaste:false })}${accessoriesSection(order)}${notesSection(order)}`, { skipBasicInfo:true });
    }

    function orderRawPermitNoteList(order) {
      return [
        ...(Array.isArray(order?.rawNoteNumbers) ? order.rawNoteNumbers : []),
        ...rawBatchesFor(order).map((batch) => batch.noteNumber),
      ];
    }

    function orderRawPermitNotes(order) {
      return uniqueNonEmpty(orderRawPermitNoteList(order)).join('، ') || '-';
    }

    function dyehouseTransfersFor(order, dyehouseName) {
      const name = clean(dyehouseName);
      return (Array.isArray(order?.dyehouseTransfers) ? order.dyehouseTransfers : [])
        .filter((transfer) => transferBelongsToOrder(order, transfer) && clean(transfer.toDyehouse) === name);
    }

    function orderAllocationIdSet(order) {
      return new Set(orderAllocations(order).map((line) => line.id).filter(Boolean));
    }

    function transferLinkedIds(transfer = {}) {
      return [
        transferAllocationId(transfer),
        transfer?.newAllocationId,
        transfer?.toAllocationId,
        transfer?.to_allocation_id,
      ].filter(Boolean);
    }

    function transferHasLinkedAllocation(order, transfer = {}) {
      const allocationIds = orderAllocationIdSet(order);
      return transferLinkedIds(transfer).some((id) => allocationIds.has(id));
    }

    function baseDyehouseNamesForOrder(order) {
      return new Set(uniqueNonEmpty([
        order?.dyehouse,
        ...orderAllocations(order).map((allocation) => allocation.dyehouse || order?.dyehouse),
      ]).map((name) => clean(name)));
    }

    function transferTouchesKnownOrderDyehouse(order, transfer = {}) {
      const baseNames = baseDyehouseNamesForOrder(order);
      return baseNames.has(clean(transfer.fromDyehouse)) || baseNames.has(clean(transfer.toDyehouse));
    }

    function allocationMatchesDyehouse(order, allocation, dyehouseName, transfersToDyehouse = []) {
      const name = clean(dyehouseName);
      const allocationDyehouse = clean(allocation?.dyehouse || order?.dyehouse);
      if (!name) return true;
      if (allocationDyehouse === name) return true;
      return transfersToDyehouse.some((transfer) => (
        transfer.newAllocationId === allocation?.id
        || transfer.allocationId === allocation?.id
        || clean(transfer.color) === clean(allocation?.color || allocation?.pantoneCode)
      ));
    }

    function transferAllocationId(transfer = {}) {
      return transfer.allocationId || transfer.fromAllocationId || transfer.from_allocation_id || '';
    }

    function rawTransfersForAllocation(order, allocation) {
      const allocationId = allocation?.id;
      if (!allocationId) return [];
      const allocations = orderAllocations(order);
      return (Array.isArray(order?.dyehouseTransfers) ? order.dyehouseTransfers : [])
        .filter((transfer) => {
          if (!transferBelongsToOrder(order, transfer) || !isRawTransfer(transfer, order)) return false;
          const transferAllocation = transferAllocationId(transfer);
          if (transferAllocation) return transferAllocation === allocationId;
          return allocations.length === 1;
        });
    }

    function dyehouseLedgerSegmentsForAllocation(order, allocation) {
      const planned = Number(allocation?.plannedQuantity || 0);
      const rawTransfers = rawTransfersForAllocation(order, allocation);
      const allocationDyehouse = clean(allocation?.dyehouse || order?.dyehouse);
      const firstSourceDyehouse = clean(rawTransfers.find((transfer) => clean(transfer.fromDyehouse))?.fromDyehouse);
      const baseDyehouse = firstSourceDyehouse || allocationDyehouse;
      const ledger = new Map();
      const add = (dyehouseName, quantity) => {
        const name = clean(dyehouseName);
        if (!name) return;
        ledger.set(name, roundNumber(Number(ledger.get(name) || 0) + Number(quantity || 0)));
      };
      add(baseDyehouse, planned);
      rawTransfers.forEach((transfer) => {
        const quantity = Number(transfer.quantity || 0);
        const fromName = clean(transfer.fromDyehouse);
        const toName = clean(transfer.toDyehouse);
        if (!quantity || !fromName || !toName || fromName === toName) return;
        add(fromName, -quantity);
        add(toName, quantity);
      });
      if (!ledger.size) add(allocationDyehouse, planned);
      return [...ledger.entries()]
        .map(([dyehouse, quantity]) => ({ dyehouse, quantity: roundNumber(Math.max(Number(quantity || 0), 0)) }))
        .filter((segment) => segment.quantity > 0);
    }

    function scopedAllocationQuantity(order, allocation, dyehouseName) {
      const name = clean(dyehouseName);
      if (!name) return roundNumber(Number(allocation?.plannedQuantity || 0));
      const segment = dyehouseLedgerSegmentsForAllocation(order, allocation)
        .find((item) => clean(item.dyehouse) === name);
      return roundNumber(segment?.quantity || 0);
    }

    function dyehouseScopedAllocations(order, dyehouseName) {
      return orderAllocations(order)
        .map((allocation) => {
          const scopedQuantity = scopedAllocationQuantity(order, allocation, dyehouseName);
          const hasRawTransfers = rawTransfersForAllocation(order, allocation).length > 0;
          return scopedQuantity > 0
            ? { ...allocation, sourcePlannedQuantity: Number(allocation.plannedQuantity || 0), plannedQuantity: scopedQuantity, ...(hasRawTransfers ? { remainingAtDyehouse: scopedQuantity } : {}) }
            : null;
        })
        .filter(Boolean);
    }

    function transferNoteNumber(transfer) {
      const direct = String(transfer?.noteNumber || '').trim();
      if (direct) return direct;
      const text = String(transfer?.reason || transfer?.notes || '').trim();
      const match = text.match(/(?:رقم\s*الإذن|رقم\s*اذن|إذن|اذن)\s*[:：-]?\s*([0-9٠-٩A-Za-z/-]+)/);
      return match ? match[1] : '';
    }

    function rawBatchesFor(order) {
      return (Array.isArray(order?.rawBatches) ? order.rawBatches : []).filter((batch) => batch.orderId === order?.id);
    }

    function rawBatchDyehouse(order, batch) {
      const direct = clean(batch?.dyehouse);
      if (direct) return direct;
      const allocationId = batch?.allocationId || batch?.allocation_id;
      const allocation = orderAllocations(order).find((line) => line.id === allocationId);
      return clean(allocation?.dyehouse || order?.dyehouse);
    }

    function rawBatchesForDyehouse(order, dyehouseName) {
      const name = clean(dyehouseName);
      return rawBatchesFor(order).filter((batch) => rawBatchDyehouse(order, batch) === name);
    }

    function dyehouseRawNotes(order, dyehouseName, isOriginalDyehouse) {
      const notes = dyehouseRawNoteList(order, dyehouseName, isOriginalDyehouse);
      return uniqueNonEmpty(notes).join('، ') || '-';
    }

    function dyehouseRawNoteList(order, dyehouseName, isOriginalDyehouse) {
      const name = clean(dyehouseName);
      const transfersToDyehouse = dyehouseTransfersFor(order, dyehouseName);
      const rows = dyehouseScopedAllocations(order, name);
      const rowAllocationIds = new Set(rows.map((allocation) => allocation.id).filter(Boolean));
      const rowRawNotes = rawBatchesForDyehouse(order, name)
        .filter((batch) => !batch.allocationId || rowAllocationIds.has(batch.allocationId) || clean(batch.dyehouse) === name)
        .map((batch) => batch.noteNumber);
      const transferNotes = transfersToDyehouse.map((transfer) => transferNoteNumber(transfer));
      if (!isOriginalDyehouse) return uniqueNonEmpty([...rowRawNotes, ...transferNotes]);
      const outgoingTransferNotes = new Set(uniqueNonEmpty((Array.isArray(order?.dyehouseTransfers) ? order.dyehouseTransfers : [])
        .filter((transfer) => isRawTransfer(transfer, order) && clean(transfer.fromDyehouse) === name && clean(transfer.toDyehouse) !== name)
        .map((transfer) => transferNoteNumber(transfer))).map((note) => clean(note)));
      return rowRawNotes
        .filter((note) => !outgoingTransferNotes.has(clean(note)));
    }

    function dyehouseDocumentBalance(order, rows, dyehouseName, isOriginalDyehouse, transfersToDyehouse) {
      const name = clean(dyehouseName);
      const rowAllocationIds = new Set(rows.map((allocation) => allocation.id).filter(Boolean));
      const rowBatchSum = (items) => sum((Array.isArray(items) ? items : []).filter((batch) => rowAllocationIds.has(batch.allocationId)));
      const transferredOut = sum((order?.dyehouseTransfers || []).filter((transfer) => isRawTransfer(transfer, order) && clean(transfer.fromDyehouse) === name && clean(transfer.toDyehouse) !== name));
      const transferredIn = sum((transfersToDyehouse || []).filter((transfer) => isRawTransfer(transfer, order)));
      const directDispatchTotal = roundNumber(sum(rawBatchesForDyehouse(order, name)));
      const hasExplicitDyehouseDispatch = rawBatchesFor(order).some((batch) => clean(batch.dyehouse) === name);
      const directNetDispatch = roundNumber(Math.max(directDispatchTotal - transferredOut, 0));
      const sentFromRows = roundNumber(sum(rows.map((allocation) => ({ quantity: Number(allocation.sentToDyehouse || 0) }))));
      const sentToDyehouse = directNetDispatch || transferredIn || sentFromRows || (isOriginalDyehouse
        ? roundNumber(Math.max(rowBatchSum(rawBatchesFor(order)) - transferredOut, 0))
        : 0);
      const receivedFromDyehouse = rowBatchSum(order?.productionBatches || order?.finishedBatches);
      const returnedFromDyehouse = rowBatchSum(order?.rawReturns);
      const wasteInRows = sum(rows.map((allocation) => ({ quantity: Number(allocation.wasteQuantity || allocation.actualWasteQuantity || 0) })));
      const operationalBalance = roundNumber(sum(rows.map((allocation) => ({ quantity: Number(allocation.remainingAtDyehouse || 0) }))));
      const movementBalance = roundNumber(Math.max(sentToDyehouse - receivedFromDyehouse - returnedFromDyehouse - wasteInRows, 0));
      return roundNumber(hasExplicitDyehouseDispatch ? movementBalance : (operationalBalance || movementBalance));
    }

    function todayIsoDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    function firstDyehouseOperationDate(dates) {
      const cleanDates = uniqueNonEmpty(dates).sort((a, b) => String(a).localeCompare(String(b)));
      return cleanDates[0] || todayIsoDate();
    }

    function dyeingOperationStageNames(order) {
      return [];
    }

    function dyeingOperationStagesSection(order) {
      return '';
    }

    function buildDyeingOrderDocument(order, dyehouseName) {
      const name = clean(dyehouseName || order?.dyehouse);
      const originalDyehouse = clean(order?.dyehouse);
      const isOriginalDyehouse = !name || name === originalDyehouse;
      const transfersToDyehouse = dyehouseTransfersFor(order, name);
      const scopedRows = dyehouseScopedAllocations(order, name);
      const manufacturing = order?.orderType === 'manufacturing';
      const rows = scopedRows.map((allocation) => {
        const customerPlannedQuantity = Number(allocation.plannedQuantity || 0);
        const wastePercent = manufacturing ? 0 : Math.max(Number(allocation.expectedWastePercent ?? order?.expectedWastePercent ?? 0), 0);
        const expectedWasteQuantity = roundNumber(customerPlannedQuantity * wastePercent / 100);
        return {
          ...allocation,
          customerPlannedQuantity,
          documentExpectedWastePercent:wastePercent,
          documentExpectedWasteQuantity:expectedWasteQuantity,
          plannedQuantity:roundNumber(customerPlannedQuantity + expectedWasteQuantity),
        };
      });
      const customerPlannedTotal = roundNumber(rows.reduce((total, allocation) => total + Number(allocation.customerPlannedQuantity || 0), 0));
      const expectedWasteTotal = roundNumber(rows.reduce((total, allocation) => total + Number(allocation.documentExpectedWasteQuantity || 0), 0));
      const plannedTotal = roundNumber(customerPlannedTotal + expectedWasteTotal);
      const rawTotal = dyehouseDocumentBalance(order, scopedRows, name, isOriginalDyehouse, transfersToDyehouse);
      const directDates = rawBatchesForDyehouse(order, name).map((batch) => batch.date || batch.batchDate || batch.batch_date);
      const dates = directDates.length ? directDates : transfersToDyehouse.map((transfer) => transfer.transferDate || transfer.date);
      const reportDate = firstDyehouseOperationDate(dates);
      const rawNoteList = uniqueNonEmpty(dyehouseRawNoteList(order, name, isOriginalDyehouse));
      const rawNotes = dyehouseRawNotes(order, name, isOriginalDyehouse);
      const documentOrder = { ...order, totalRawOrdered:plannedTotal, totalRawQuantity:plannedTotal };
      const summary = `<section class="report-section"><h3>بيانات الصباغة</h3><table class="summary-table"><tbody><tr><th>طلب العميل</th><td>${fmt(customerPlannedTotal)}</td><th>هالك التشغيل المضاف</th><td>${manufacturing ? 'غير مطبق' : fmt(expectedWasteTotal)}</td></tr><tr><th>إجمالي كمية المصبغة</th><td>${fmt(plannedTotal)}</td><th>رصيد الخام في المصبغة</th><td>${fmt(rawTotal)}</td></tr><tr><th>عدد الألوان</th><td>${rows.length}</td><th>إذن الخام</th><td>${safeText(rawNotes)}</td></tr></tbody></table></section>`;
      const rawImages = typeof rawPermitImagesSection === 'function' ? rawPermitImagesSection(order, rawNoteList) : '';
      return reportShell('أمر تشغيل صباغة', documentOrder, `${summary}${colorRows(documentOrder, rows, { includeDyehouse:false, includeReceived:false, includeWaste:false, includePlannedWasteBreakdown:true })}${notesSection(order)}${rawImages}`, { dyehouse:name, date:reportDate, rawNotes, omitBasicFields:['إذن الخام', 'العميل'] });
    }

    function buildDyeingSummaryDocument(order) {
      return buildDyeingOrderDocument({ ...order, rawBatches: order.rawBatches || [], dyehouseTransfers: order.dyehouseTransfers || [] }, order?.dyehouse || '');
    }

    function buildLabSamplesDocument(order) {
      const rows = orderAllocations(order);
      const labColorContent = (line = {}) => {
        const color = clean(line.color || '');
        const pantone = clean(line.pantoneCode || line.pantone_code || '');
        return `<div class="lab-color-info"><strong>${safeText(color || pantone || '-')}</strong>${pantone ? `<span class="pantone-label">بانتون <bdi dir="ltr">${safeText(pantone)}</bdi></span>` : '<span>رقم البانتون غير مسجل</span>'}</div>`;
      };
      const labSampleContent = (line = {}) => {
        const imageValue = clean(line.colorImage || line.color_image || line.colorImageUrl || line.color_image_url || '');
        const image = /^(?:data:image\/(?:png|jpeg|webp);base64,|https?:\/\/)/i.test(imageValue) ? imageValue : '';
        const colorValue = clean(line.colorHex || line.color_hex || '');
        const colorHex = /^#[0-9a-f]{6}$/i.test(colorValue) ? colorValue : '';
        const style = image ? `background-image:url('${safeText(image)}')` : (colorHex ? `background-color:${colorHex}` : '');
        return `<div class="lab-color-swatch ${style ? 'has-color' : ''}"${style ? ` style="${style}"` : ''}><span>${style ? '' : 'صورة اللون'}</span></div>`;
      };
      const sampleRows = [];
      for (let index = 0; index < Math.max(rows.length, 1); index += 2) {
        const right = rows[index] || {};
        const left = rows[index + 1] || {};
        sampleRows.push(`<tr><td class="sample-cell">${labSampleContent(right)}</td><td class="color-cell">${labColorContent(right)}</td><td class="color-cell">${labColorContent(left)}</td><td class="sample-cell">${labSampleContent(left)}</td></tr>`);
      }
      const accessoryLines = orderAccessoryLines(order);
      const accessoryTotal = roundNumber(accessoryLines.reduce((total, line) => total + Number(line.quantity || 0), 0));
      const accessoryRows = accessoryLines.map((line) => `<tr class="lab-accessory-row"><th>${safeText(line.type)}</th><td>${formatNumber(accessoryPercentForOrder(line, order))}%</td><th>الإجمالي</th><td>${fmt(line.quantity)} كجم</td></tr>`).join('');
      const accessorySection = accessoryLines.length
        ? `<tr class="lab-section-title"><th colspan="4">إجماليات الإكسسوارات</th></tr><tr class="lab-sample-head"><th>نوع الإكسسوار</th><th>النسبة</th><th>البند</th><th>الكمية</th></tr>${accessoryRows}<tr class="lab-total-row"><th colspan="3">إجمالي الإكسسوارات</th><td>${fmt(accessoryTotal)} كجم</td></tr>`
        : '';
      return `<div class="document-sheet lab-document lab-samples-sheet"><table class="lab-samples-table"><colgroup><col class="lab-sample-col"><col class="lab-color-col"><col class="lab-color-col"><col class="lab-sample-col"></colgroup><tbody><tr><td colspan="3" class="lab-title">عينات معمل</td><td class="lab-logo-cell">${documentLogo()}</td></tr><tr class="lab-meta-row"><th>رقم الطلب</th><td class="lab-order-number">${safeText(order?.orderNumber)}</td><th>التاريخ</th><td>${safeText(order?.orderDate)}</td></tr><tr class="lab-meta-row"><th>المصبغة</th><td>${safeText(order?.dyehouse)}</td><th>الصنف</th><td>${safeText(order?.fabricType)}</td></tr><tr class="lab-item-row"><th colspan="2">الكمية</th><td colspan="2">${fmt(order?.totalRawOrdered)} كجم</td></tr><tr class="lab-sample-head"><th>العينة</th><th>اللون</th><th>اللون</th><th>العينة</th></tr>${sampleRows.join('')}${accessorySection}</tbody></table></div>`;
    }

    function buildStickersDocument(order, options = {}) {
      const showroomMode = !!(options && typeof options === 'object' && options.showroom);
      const rows = orderAllocations(order);
      const stickerRows = rows.map((line, index) => {
        const stickerId = `sticker-${line.id || index}`;
        if (showroomMode) {
          const brandName = String(order?.showroomBrand || '').trim() === 'Deltex.co' ? 'Deltex.co' : '2B';
          return `<div class="sticker-item"><div class="sticker-card showroom-sticker-card" data-sticker-id="${safeText(stickerId)}"><div class="sticker-brand"><strong>${safeText(brandName)}</strong><span>كرتيلة معرض</span></div><div class="sticker-line showroom-fabric-line"><span>الصنف</span><strong>${safeText(order?.fabricType)}</strong></div><div class="sticker-grid showroom-sticker-grid"><div><span>العرض</span><strong>${safeText(line.targetFinishedWidth || line.rawWidth)}</strong></div><div><span>الوزن</span><strong>${safeText(line.targetFinishedWeight)}</strong></div></div></div><button class="mini-btn sticker-print-btn" type="button" data-print-sticker="${safeText(stickerId)}">طباعة هذه الكرتيلة</button></div>`;
        }
        return `<div class="sticker-item"><div class="sticker-card" data-sticker-id="${safeText(stickerId)}"><div class="sticker-brand"><strong>2B Tex</strong><span>تشغيل</span></div><div class="sticker-order">${safeText(order?.orderNumber)}</div><div class="sticker-line"><span>العميل</span><strong>${safeText(customerName(order))}</strong></div><div class="sticker-line"><span>الصنف</span><strong>${safeText(order?.fabricType)}</strong></div><div class="sticker-line sticker-line-color"><span>اللون</span><strong>${safeText(line.color || line.pantoneCode)}</strong></div><div class="sticker-grid"><div><span>الكمية</span><strong>${fmt(line.plannedQuantity)}</strong></div><div><span>البوصة</span><strong>${safeText(line.rawInch || order?.inchWidth)}</strong></div><div><span>العرض</span><strong>${safeText(line.targetFinishedWidth || line.rawWidth)}</strong></div><div><span>الوزن</span><strong>${safeText(line.targetFinishedWeight)}</strong></div></div></div><button class="mini-btn sticker-print-btn" type="button" data-print-sticker="${safeText(stickerId)}">طباعة هذا اللون</button></div>`;
      }).join('');
      return `<div class="document-sheet sticker-sheet">${stickerRows || '<p>لا توجد استيكرات متاحة.</p>'}</div>`;
    }

    function transferAllocationLabel(order, transfer = {}) {
      const sourceId = transferAllocationId(transfer);
      const targetId = transfer?.newAllocationId || transfer?.toAllocationId || transfer?.to_allocation_id;
      const allocation = orderAllocations(order).find((line) => line.id === targetId)
        || orderAllocations(order).find((line) => line.id === sourceId)
        || {};
      const parts = [
        allocation.color || transfer.color || allocation.pantoneCode,
        allocation.targetFinishedWidth || allocation.rawWidth,
        allocation.targetFinishedWeight,
      ].filter((value) => clean(value));
      return parts.length ? parts.map(safeText).join(' / ') : '-';
    }

    function transferBelongsToOrder(order, transfer = {}) {
      const orderId = clean(order?.id);
      const transferOrderId = clean(transfer.orderId || transfer.order_id);
      const linkedIds = transferLinkedIds(transfer);
      const hasLinkedAllocation = transferHasLinkedAllocation(order, transfer);
      if (orderId && transferOrderId) {
        if (transferOrderId !== orderId) return false;
        if (linkedIds.length) return hasLinkedAllocation;
        return transferTouchesKnownOrderDyehouse(order, transfer);
      }
      return hasLinkedAllocation;
    }

    function dyehouseTransfersSection(order) {
      const transfers = (Array.isArray(order?.dyehouseTransfers) ? order.dyehouseTransfers : [])
        .filter((transfer) => transferBelongsToOrder(order, transfer));
      if (!transfers.length) return '';
      const rows = transfers
        .slice()
        .sort((a, b) => clean(a.transferDate || a.date).localeCompare(clean(b.transferDate || b.date)))
        .map((transfer) => {
          const currentKind = transferKind(transfer, order);
          const kind = currentKind === 'accessory' ? 'نقل خام إكسسوار' : isRawTransfer(transfer, order) ? 'نقل خام' : 'نقل لون';
          const date = transfer.transferDate || transfer.date || '-';
          return `<tr><td>${safeText(date)}</td><td>${safeText(kind)}</td><td>${safeText(transfer.fromDyehouse)}</td><td>${safeText(transfer.toDyehouse)}</td><td>${transferAllocationLabel(order, transfer)}</td><td>${fmt(transfer.quantity)}</td><td>${safeText(transferNoteNumber(transfer))}</td><td>${safeText(transfer.reason || transfer.notes)}</td></tr>`;
        }).join('');
      return `<section class="report-section"><h3>تحويلات المصبغة</h3><table class="summary-table"><thead><tr><th>التاريخ</th><th>نوع التحويل</th><th>من مصبغة</th><th>إلى مصبغة</th><th>اللون / العرض</th><th>الكمية</th><th>رقم الإذن</th><th>ملاحظات</th></tr></thead><tbody>${rows}</tbody></table></section>`;
    }

    function dyehouseNamesForDetailedReport(order) {
      const transferNames = (Array.isArray(order?.dyehouseTransfers) ? order.dyehouseTransfers : [])
        .filter((transfer) => transferBelongsToOrder(order, transfer))
        .flatMap((transfer) => [transfer.fromDyehouse, transfer.toDyehouse]);
      return uniqueNonEmpty([
        order?.dyehouse,
        ...rawBatchesFor(order).map((batch) => rawBatchDyehouse(order, batch)),
        ...orderAllocations(order).map((allocation) => allocation.dyehouse || order?.dyehouse),
        ...transferNames,
      ]);
    }

    function dyehouseDistributionSection(order) {
      const names = dyehouseNamesForDetailedReport(order);
      if (!names.length) return '';
      const originalDyehouse = clean(order?.dyehouse);
      const rows = names.map((name) => {
        const scopedRows = dyehouseScopedAllocations(order, name);
        const plannedTotal = roundNumber(scopedRows.reduce((total, allocation) => total + Number(allocation.plannedQuantity || 0), 0));
        const transfersToDyehouse = dyehouseTransfersFor(order, name);
        const transferredIn = sum(transfersToDyehouse.filter((transfer) => isRawTransfer(transfer, order)));
        const transferredOut = sum((order?.dyehouseTransfers || []).filter((transfer) => isRawTransfer(transfer, order) && clean(transfer.fromDyehouse) === clean(name) && clean(transfer.toDyehouse) !== clean(name)));
        const dispatchedTotal = roundNumber(Math.max(sum(rawBatchesForDyehouse(order, name)) - transferredOut, 0) + transferredIn);
        const rawBalance = dyehouseDocumentBalance(order, scopedRows, name, !name || clean(name) === originalDyehouse, transfersToDyehouse);
        const colors = uniqueNonEmpty(scopedRows.map((allocation) => allocation.color || allocation.pantoneCode)).join('، ');
        if (!dispatchedTotal && !plannedTotal && !rawBalance) return '';
        return `<tr><td>${safeText(name)}</td><td>${fmt(dispatchedTotal)}</td><td>${fmt(rawBalance)}</td><td>${scopedRows.length}</td><td>${safeText(colors)}</td></tr>`;
      }).filter(Boolean).join('');
      return rows ? `<section class="report-section"><h3>توزيع الرصيد على المصابغ</h3><table class="summary-table"><thead><tr><th>المصبغة</th><th>الخام المرسل للمصبغة</th><th>الرصيد داخل المصبغة</th><th>عدد الألوان</th><th>الألوان</th></tr></thead><tbody>${rows}</tbody></table></section>` : '';
    }

    function buildCompactFullReportDocument(order) {
      const dyehouseBalance = Number(order?.rawAtDyehouseAvailable ?? order?.remainingAtDyehouse ?? 0);
      const summary = `<section class="report-section"><h3>ملخص التشغيل</h3><table class="summary-table"><tbody><tr><th>خام مطلوب</th><td>${fmt(order?.totalRawOrdered)}</td><th>خام خرج للمصبغة</th><td>${fmt(order?.totalRawReceived)}</td></tr><tr><th>داخل المصبغة</th><td>${fmt(dyehouseBalance)}</td><th>دخل المخزن</th><td>${fmt(order?.totalFinishedReceived)}</td></tr><tr><th>تسليم العميل</th><td>${fmt(order?.totalDeliveredToCustomer)}</td><th>رصيد المخزن</th><td>${fmt(order?.warehouseBalance)}</td></tr><tr><th>هالك فعلي</th><td>${fmt(order?.totalWaste)}</td><th>هالك تقديري</th><td>${fmt(order?.expectedWasteQuantity)}</td></tr></tbody></table></section>`;
      return reportShell('التقرير التفصيلي للطلب', order, `${summary}${dyehouseDistributionSection(order)}${colorRows(order, orderAllocations(order), { includeDyehouse:true, includeReceived:true, includeCustomerDelivered:true, includeWarehouseBalance:true, includeWaste:true })}${dyehouseTransfersSection(order)}${accessoriesSection(order, { showMovement:true })}${notesSection(order)}`, { subtitle:'متابعة كاملة من الخام حتى التسليم للعميل.', omitBasicFields:['إجمالي الخام', 'المصبغة'] });
    }

    function buildWasteReportDocument(order) {
      return reportShell('تقرير الهالك', order, `${colorRows(order, orderAllocations(order), { includeCustomerDelivered:true, includeWaste:true })}${accessoriesSection(order, { showMovement:true })}${notesSection(order)}`, { subtitle:'الهالك الفعلي محسوب من التشغيل الفعلي.', omitBasicFields:['المصبغة'] });
    }

    function buildQuotationDocument(order) {
      const sourceRows = orderAllocations(order);
      const fallbackQuantity = Number(order?.totalRawOrdered || order?.totalRawQuantity || 0);
      const offerRows = sourceRows.length ? sourceRows : [{ color:'-', plannedQuantity:fallbackQuantity, rawInch:order?.inchWidth }];
      const total = roundNumber(offerRows.reduce((sum, line) => sum + (Number(line.plannedQuantity || 0) * Number(order?.kiloPrice || 0)), 0));
      const rows = offerRows.map((line) => `<tr><td>${safeText(order?.fabricType)}</td><td>${safeText(line.color || line.pantoneCode || '-')}</td><td>${fmt(line.plannedQuantity)}</td><td>${safeText(line.rawInch || order?.inchWidth)}</td><td>${fmt(order?.kiloPrice)}</td><td>${fmt(Number(line.plannedQuantity || 0) * Number(order?.kiloPrice || 0))}</td></tr>`).join('');
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

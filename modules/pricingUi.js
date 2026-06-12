(function () {
  function createPricingUi(deps) {
    const {
      refs,
      escapeHtml,
      activeDyehousePriceLibrary,
      isLegacyRecoveredText,
      normalizeDyehousePriceLabel,
      uniqueNonEmpty,
      getSuggestedDyeCost,
      calculatePricing,
      buildItemCode,
      setPaymentFields,
      pricingForOrder,
      calculateOrder,
      orderRawCost,
      nextPricingNumber,
      isActivePricing,
      canDeleteRecords,
      getPricings,
      getOrders,
      getSelectedOrderId,
      setEditingPricingId,
      setPendingPricingOrderId,
      showAlert,
    } = deps;

function applyPricingDyehouseOptions() {
  if (!refs.pricingDyehouse) return;
  const current = refs.pricingDyehouse.value;
  const names = Object.keys(activeDyehousePriceLibrary())
    .filter((name)=>name && !isLegacyRecoveredText(name))
    .sort((a,b)=>a.localeCompare(b, 'ar'));
  refs.pricingDyehouse.innerHTML = `<option value="">اختر المصبغة</option>${names.map((name)=>`<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')}`;
  if (names.includes(current)) refs.pricingDyehouse.value = current;
  applyPricingColorOptions();
}

function applyPricingMaterialOptions() {
  if (!refs.pricingMaterialType) return;
  const current = refs.pricingMaterialType.value;
  const options = ['قطن', 'مخلوط', 'بوليستر'];
  refs.pricingMaterialType.innerHTML = `<option value="">اختر الخامة</option>${options.map((name)=>`<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')}`;
  if (options.includes(current)) refs.pricingMaterialType.value = current;
}

function applyPricingColorOptions() {
  if (!refs.pricingColorClass) return;
  const current = normalizeDyehousePriceLabel(refs.pricingColorClass.value);
  const librarySource = activeDyehousePriceLibrary();
  const dyehouse = refs.pricingDyehouse?.value || '';
  const material = refs.pricingMaterialType?.value || '';
  const library = librarySource[dyehouse];
  const resolved = library?.aliasOf ? librarySource[library.aliasOf] : library;
  const materialKey = material === 'مخلوط' ? 'قطن' : material;
  const sourceLibraries = resolved ? [resolved] : Object.values(librarySource).map((config)=>config?.aliasOf ? librarySource[config.aliasOf] : config);
  const colors = materialKey
    ? uniqueNonEmpty(sourceLibraries.flatMap((config)=>Object.keys(config?.dyeing?.[materialKey] || {})))
    : uniqueNonEmpty(Object.values(resolved?.dyeing || {}).flatMap((items)=>Object.keys(items || {})));
  const fallback = ['غسيل - مفتوح','غسيل - مقفول','أبيض / كسترة - مفتوح','أبيض / كسترة - مقفول','فواتح - مفتوح','فواتح - مقفول','وسط - مفتوح','وسط - مقفول','غوامق - مفتوح','غوامق - مقفول','أسود - مفتوح','أسود - مقفول','أسود خاص - مفتوح','أسود خاص - مقفول','ألوان خاصة - مفتوح','ألوان خاصة - مقفول'];
  const options = (colors.length ? colors : (materialKey ? [] : fallback)).filter((name)=>name && !isLegacyRecoveredText(name)).sort((a,b)=>a.localeCompare(b, 'ar'));
  refs.pricingColorClass.innerHTML = `<option value="">اختر الدرجة</option>${options.map((name)=>`<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')}`;
  if (options.includes(current)) refs.pricingColorClass.value = current;
}

function updateSuggestedDyeCost() {
  const suggested = getSuggestedDyeCost(refs.pricingDyehouse.value, refs.pricingMaterialType.value, refs.pricingColorClass.value);
  refs.pricingSuggestedDyeCost.value = suggested;
  if (suggested !== '') refs.pricingDyeCost.value = suggested;
  updatePricingPreview();
}

function renderPricings() {
  const activePricings = getPricings().filter(isActivePricing);
  refs.pricingTableBody.innerHTML = activePricings.map(calculatePricing).map((pricing)=>`<tr><td data-label="رقم التسعيرة">${pricing.pricingNumber}</td><td data-label="العميل">${pricing.customer}</td><td data-label="الصنف">${pricing.fabricType}</td><td data-label="المصبغة">${pricing.dyehouse}</td><td data-label="الكمية">${pricing.quantity}</td><td data-label="تكلفة الكيلو">${pricing.costPerKg.toLocaleString('en-US')}</td><td data-label="سعر البيع">${pricing.sellPrice.toLocaleString('en-US')}</td><td data-label="إجمالي العقد">${pricing.totalOffer.toLocaleString('en-US')}</td><td data-label="الحالة"><span class="status pending">تسعيرة</span></td><td data-label="إجراءات"><div class="batch-actions"><button class="mini-btn" data-pricing-quote="${pricing.id}">عرض سعر</button><button class="mini-btn" data-convert-pricing="${pricing.id}">تنزيل طلب</button><button class="mini-btn" data-edit-pricing="${pricing.id}">تعديل</button>${canDeleteRecords() ? `<button class="mini-btn danger" data-delete-pricing="${pricing.id}">حذف</button>` : ''}</div></td></tr>`).join('');
}

function updatePricingPreview() {
  const pricing = calculatePricing({ dyehouse:refs.pricingDyehouse.value, rawCost:+refs.pricingRawCost.value, dyeCost:+refs.pricingDyeCost.value, wastePercent:+refs.pricingWastePercent.value, extraCost:+refs.pricingExtraCost.value, profitPerKg:+refs.pricingProfitPerKg.value, quantity:+refs.pricingQuantity.value });
  refs.pricingWasteCostPreview.textContent = pricing.wasteCost.toLocaleString('en-US');
  refs.pricingCostPreview.textContent = pricing.costPerKg.toLocaleString('en-US');
  refs.pricingSellPreview.textContent = pricing.sellPrice.toLocaleString('en-US');
  refs.pricingTotalPreview.textContent = pricing.totalOffer.toLocaleString('en-US');
}

function fillPricingForm(pricing) {
  const material = pricing.materialType || '';
  const dyehouse = pricing.dyehouse || '';
  const colorClass = normalizeDyehousePriceLabel(pricing.colorClass || '');
  refs.pricingNumber.value = pricing.pricingNumber || '';
  if (refs.pricingProductCode) refs.pricingProductCode.value = pricing.productCode || buildItemCode(pricing.pricingNumber);
  refs.pricingCustomer.value = pricing.customer || '';
  refs.pricingDate.value = pricing.pricingDate || new Date().toISOString().slice(0,10);
  refs.pricingFabricType.value = pricing.fabricType || '';
  applyPricingMaterialOptions();
  refs.pricingMaterialType.value = [...refs.pricingMaterialType.options].some((option)=>option.value === material) ? material : '';
  applyPricingDyehouseOptions();
  refs.pricingDyehouse.value = [...refs.pricingDyehouse.options].some((option)=>option.value === dyehouse) ? dyehouse : '';
  applyPricingColorOptions();
  refs.pricingColorClass.value = [...refs.pricingColorClass.options].some((option)=>option.value === colorClass) ? colorClass : '';
  refs.pricingQuantity.value = pricing.quantity || '';
  refs.pricingInchWidth.value = pricing.inchWidth || '';
  refs.pricingFinishedWeight.value = pricing.finishedWeight || '';
  refs.pricingRawCost.value = pricing.rawCost || '';
  refs.pricingDyeCost.value = pricing.dyeCost || '';
  refs.pricingWastePercent.value = pricing.wastePercent || '';
  refs.pricingExtraCost.value = pricing.extraCost || 0;
  refs.pricingProfitPerKg.value = pricing.profitPerKg || '';
  setPaymentFields(refs.pricingPaymentMode, refs.pricingPaymentDetails, refs.pricingPaymentTerms, pricing.paymentTerms || '');
  refs.pricingNotes.value = pricing.notes || '';
  updateSuggestedDyeCost();
}

function editPricing(id) {
  const pricing = getPricings().find((item)=>item.id===id);
  if (!pricing) return;
  setEditingPricingId(id);
  setPendingPricingOrderId(null);
  if (refs.deletePricingBtn) refs.deletePricingBtn.style.display = 'inline-flex';
  fillPricingForm(pricing);
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.pricingDialog.showModal();
}

function nextOrderPricingNumber(order) {
  const base = nextPricingNumber();
  const used = new Set(getPricings().map((pricing)=>String(pricing.pricingNumber || '').trim()).filter(Boolean));
  if (!used.has(base)) return base;
  let index = 2;
  while (used.has(String(Number(base) + index - 1))) index += 1;
  return String(Number(base) + index - 1);
}

function pricingDraftFromOrder(order) {
  const calculated = calculateOrder(order);
  const linkedPricing = calculated?.pricingId ? getPricings().find((pricing)=>pricing.id === calculated.pricingId) : null;
  if (linkedPricing) return linkedPricing;
  const matchedPricing = pricingForOrder(calculated);
  if (matchedPricing) return matchedPricing;
  return {
    pricingNumber: nextOrderPricingNumber(calculated),
    productCode: calculated.productCode || buildItemCode(calculated.orderNumber),
    customer: calculated.customer || '',
    pricingDate: new Date().toISOString().slice(0, 10),
    fabricType: calculated.fabricType || '',
    quantity: calculated.totalRawOrdered || calculated.totalRawQuantity || '',
    inchWidth: calculated.inchWidth || '',
    finishedWeight: calculated.allocations?.[0]?.targetFinishedWeight || '',
    rawCost: calculated.rawCost || orderRawCost(calculated) || '',
    dyehouse: calculated.dyehouse || calculated.allocations?.[0]?.dyehouse || '',
    wastePercent: calculated.expectedWastePercent || '',
    profitPerKg: Number(calculated.kiloPrice || 0) ? Math.max(0, Number(calculated.kiloPrice || 0) - Number(calculated.rawCost || orderRawCost(calculated) || 0)) : '',
    paymentTerms: calculated.paymentTerms || '',
    notes: calculated.notes || '',
  };
}

function openPricingForOrder(orderId = getSelectedOrderId()) {
  const order = getOrders().find((item)=>item.id === orderId);
  if (!order) { showAlert('اختر طلبًا أولًا.'); return; }
  const draft = pricingDraftFromOrder(order);
  const existingId = draft.id || '';
  setEditingPricingId(existingId || null);
  setPendingPricingOrderId(existingId && order.pricingId === existingId ? null : order.id);
  if (refs.deletePricingBtn) refs.deletePricingBtn.style.display = existingId ? 'inline-flex' : 'none';
  refs.pricingForm.reset();
  fillPricingForm(draft);
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.pricingDialog.showModal();
}

    return {
      applyPricingDyehouseOptions,
      applyPricingMaterialOptions,
      applyPricingColorOptions,
      updateSuggestedDyeCost,
      renderPricings,
      updatePricingPreview,
      fillPricingForm,
      editPricing,
      nextOrderPricingNumber,
      pricingDraftFromOrder,
      openPricingForOrder,
    };
  }

  window.createPricingUi = createPricingUi;
})();

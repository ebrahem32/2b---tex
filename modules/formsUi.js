(function () {
  function createFormsUi(deps) {
    const {
      refs,
      uid,
      escapeHtml,
      getEditingOrderId,
    } = deps;

function readWidthLinesFromEditor() {
  return [...refs.widthLinesEditor.querySelectorAll('.width-line-row')].map((row)=>({ id:row.dataset.widthLineId || uid(), inch:row.querySelector('[data-width-field="inch"]').value.trim(), width:Number(row.querySelector('[data-width-field="width"]').value), quantity:Number(row.querySelector('[data-width-field="quantity"]').value) })).filter((item)=>item.inch && item.width > 0 && item.quantity > 0);
}

function widthLineRowHtml(line = {}) {
  return `<div class="width-line-row" data-width-line-id="${line.id || ''}"><input data-width-field="inch" placeholder="" value="${line.inch || ''}"><input data-width-field="width" type="number" placeholder="" value="${line.width || ''}"><input data-width-field="quantity" type="number" placeholder="" value="${line.quantity || ''}"><button type="button" class="mini-btn danger" data-remove-width-line></button></div>`;
}

function renderWidthLinesEditor(lines = []) {
  refs.widthLinesEditor.innerHTML = `<div class="width-line-head"><span>البوصة</span><span>العرض</span><span>الكمية</span><span></span></div>${(lines.length ? lines : [{}]).map((line)=>widthLineRowHtml(line)).join('')}`;
}

function accessoryLineRowHtml(line = {}) {
  return `<div class="accessory-line-row" data-accessory-line-id="${line.id || ''}"><input data-accessory-field="type" placeholder=" " list="accessoryTypeList" value="${line.type || ''}"><input data-accessory-field="percent" type="number" step="0.01" placeholder=" %" value="${line.percent || ''}"><input data-accessory-field="quantity" type="number" step="0.01" placeholder=" " value="${line.quantityManual || line.quantity || ''}"><button type="button" class="mini-btn danger" data-remove-accessory-line></button></div>`;
}

function renderAccessoryLinesEditor(lines = []) {
  const rows = lines.length ? lines : [{}];
  refs.accessoryLinesEditor.innerHTML = `<datalist id="accessoryTypeList"><option value="ريب"><option value="لياقات"><option value="أساور"><option value="ديربي"></datalist><div class="accessory-line-head"><span>نوع الإكسسوار</span><span>النسبة %</span><span>الكمية</span><span></span></div>${rows.map((line)=>accessoryLineRowHtml(line)).join('')}`;
}

function readAccessoryLinesFromEditor() {
  const rows = [...refs.accessoryLinesEditor.querySelectorAll('.accessory-line-row')].map((row)=>({
    id: row.dataset.accessoryLineId || uid(),
    type: row.querySelector('[data-accessory-field="type"]').value.trim(),
    percent: Number(row.querySelector('[data-accessory-field="percent"]').value || 0),
    quantityManual: row.querySelector('[data-accessory-field="quantity"]').value === '' ? '' : Number(row.querySelector('[data-accessory-field="quantity"]').value || 0),
  })).filter((item)=>item.type || item.percent > 0 || Number(item.quantityManual || 0) > 0);
  if (rows.length) return rows.map((item)=>({ ...item, type:item.type || '' }));
  if (refs.accessoryType.value || Number(refs.accessoryPercent.value || 0)) return [{ id:uid(), type:refs.accessoryType.value || '', percent:Number(refs.accessoryPercent.value || 0), quantityManual:'' }];
  return [];
}

function syncWidthModeUi() {
  const multiple = refs.widthMode.value === 'multiple';
  refs.widthLinesBox.classList.toggle('active', multiple);
  refs.inchWidth.required = !multiple;
  syncGroupedOrderUi();
}

function groupedOrderRowHtml(item = {}, isPrimary = false) {
  return `<div class="grouped-order-row${isPrimary ? ' primary' : ''}" data-grouped-order-row><input data-grouped-field="fabricType" placeholder="الصنف" value="${escapeHtml(item.fabricType || '')}" ${isPrimary ? 'readonly' : ''}><input data-grouped-field="totalRawQuantity" type="number" step="0.01" placeholder="الكمية" value="${item.totalRawQuantity || ''}" ${isPrimary ? 'readonly' : ''}><input data-grouped-field="inchWidth" placeholder="البوصة" value="${item.inchWidth || ''}" ${isPrimary ? 'readonly' : ''}><input data-grouped-field="kiloPrice" type="number" step="0.01" placeholder="سعر الكيلو" value="${item.kiloPrice || ''}" ${isPrimary ? 'readonly' : ''}><input data-grouped-field="expectedWastePercent" type="number" step="0.01" placeholder="الهالك %" value="${item.expectedWastePercent || ''}" ${isPrimary ? 'readonly' : ''}><button type="button" class="mini-btn danger" data-remove-grouped-order ${isPrimary ? 'disabled' : ''}>حذف</button></div>`;
}

function groupedOrderPrimaryItem() {
  return { fabricType:refs.fabricType?.value || '', totalRawQuantity:refs.totalRawQuantity?.value || '', inchWidth:refs.inchWidth?.value || '', kiloPrice:refs.kiloPrice?.value || '', expectedWastePercent:refs.expectedWastePercent?.value || '' };
}

function syncGroupedOrderPrimaryRow() {
  const rows = document.getElementById('groupedOrderRows');
  if (!rows) return;
  const primary = rows.querySelector('[data-grouped-order-row].primary');
  if (!primary) { rows.insertAdjacentHTML('afterbegin', groupedOrderRowHtml(groupedOrderPrimaryItem(), true)); return; }
  const item = groupedOrderPrimaryItem();
  Object.entries(item).forEach(([key, value]) => {
    const input = primary.querySelector(`[data-grouped-field="${key}"]`);
    if (input) input.value = value;
  });
}

function syncGroupedOrderUi() {
  const box = document.getElementById('groupedOrderBox');
  if (!box) return;
  box.hidden = Boolean(getEditingOrderId()) || refs.widthMode?.value === 'multiple';
  syncGroupedOrderPrimaryRow();
}

function resetGroupedOrderRows() {
  const rows = document.getElementById('groupedOrderRows');
  if (!rows) return;
  rows.innerHTML = groupedOrderRowHtml(groupedOrderPrimaryItem(), true);
  syncGroupedOrderUi();
}

function readGroupedOrderItems() {
  return [...document.querySelectorAll('#groupedOrderRows [data-grouped-order-row]')].map((row)=>({
    fabricType: row.querySelector('[data-grouped-field="fabricType"]')?.value.trim() || '',
    totalRawQuantity: Number(row.querySelector('[data-grouped-field="totalRawQuantity"]')?.value || 0),
    inchWidth: row.querySelector('[data-grouped-field="inchWidth"]')?.value.trim() || '',
    kiloPrice: Number(row.querySelector('[data-grouped-field="kiloPrice"]')?.value || 0),
    expectedWastePercent: Number(row.querySelector('[data-grouped-field="expectedWastePercent"]')?.value || 0),
  })).filter((item)=>item.fabricType || item.totalRawQuantity > 0 || item.inchWidth || item.kiloPrice > 0);
}

function installGroupedOrderUi() {
  if (!refs.orderForm || document.getElementById('groupedOrderBox')) return;
  const anchor = refs.totalRawQuantity?.closest('label') || refs.fabricType?.closest('label');
  if (!anchor) return;
  anchor.insertAdjacentHTML('afterend', `<div class="full-row grouped-order-box" id="groupedOrderBox"><div class="subsection-head"><div><span>أصناف داخل نفس الطلب</span><p class="eyebrow">كل صنف يحفظ كأمر تشغيل مستقل بنفس رقم الطلب والعميل حتى تظل مراحل النسيج والصباغة والتسليم منفصلة وآمنة.</p></div><button type="button" class="mini-btn" id="addGroupedOrderItemBtn">+ إضافة صنف</button></div><div class="grouped-order-head"><span>الصنف</span><span>الكمية</span><span>البوصة</span><span>سعر الكيلو</span><span>الهالك %</span><span></span></div><div id="groupedOrderRows"></div></div>`);
  document.getElementById('addGroupedOrderItemBtn')?.addEventListener('click', () => document.getElementById('groupedOrderRows')?.insertAdjacentHTML('beforeend', groupedOrderRowHtml()));
  document.getElementById('groupedOrderRows')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-grouped-order]');
    if (!button || button.disabled) return;
    button.closest('[data-grouped-order-row]')?.remove();
  });
  [refs.fabricType, refs.totalRawQuantity, refs.inchWidth, refs.kiloPrice, refs.expectedWastePercent].filter(Boolean).forEach((input) => {
    input.addEventListener('input', syncGroupedOrderPrimaryRow);
    input.addEventListener('change', syncGroupedOrderPrimaryRow);
  });
  resetGroupedOrderRows();
}

    return {
      readWidthLinesFromEditor,
      widthLineRowHtml,
      renderWidthLinesEditor,
      accessoryLineRowHtml,
      renderAccessoryLinesEditor,
      readAccessoryLinesFromEditor,
      syncWidthModeUi,
      groupedOrderRowHtml,
      groupedOrderPrimaryItem,
      syncGroupedOrderPrimaryRow,
      syncGroupedOrderUi,
      resetGroupedOrderRows,
      readGroupedOrderItems,
      installGroupedOrderUi,
    };
  }

  window.createFormsUi = createFormsUi;
})();

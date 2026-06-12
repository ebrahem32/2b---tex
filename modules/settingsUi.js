(function () {
  function createSettingsUi(deps) {
    const {
      refs,
      escapeHtml,
      activeDyehousePriceLibrary,
      isLegacyRecoveredText,
    } = deps;

function dyehousePriceRows() {
  const rows = [];
  Object.entries(activeDyehousePriceLibrary()).forEach(([dyehouse, config]) => {
    if (isLegacyRecoveredText(dyehouse)) return;
    if (config?.aliasOf) return;
    const dyeing = config?.dyeing || {};
    Object.entries(dyeing).forEach(([material, colors]) => {
      if (isLegacyRecoveredText(material)) return;
      Object.entries(colors || {}).forEach(([color, price]) => {
        if (isLegacyRecoveredText(color)) return;
        rows.push({ dyehouse, material, color, price: price ?? '' });
      });
    });
    if (!Object.keys(dyeing).length) rows.push({ dyehouse, material:'', color:'', price:'' });
  });
  return rows.length ? rows : [{ dyehouse:'', material:'', color:'', price:'' }];
}

function dyehousePriceRowHtml(row = {}) {
  return `<tr data-dyehouse-price-row>
    <td><input type="text" data-price-dyehouse value="${escapeHtml(row.dyehouse || '')}" placeholder="اسم المصبغة"></td>
    <td><input type="text" data-price-material value="${escapeHtml(row.material || '')}" placeholder="نوع الخامة"></td>
    <td><input type="text" data-price-color value="${escapeHtml(row.color || '')}" placeholder="درجة اللون"></td>
    <td><input type="number" step="0.01" data-price-value value="${escapeHtml(row.price ?? '')}" placeholder="السعر"></td>
    <td><button class="mini-btn" type="button" data-delete-price-row>حذف</button></td>
  </tr>`;
}

function dyehousePriceSummaryHtml() {
  return Object.entries(activeDyehousePriceLibrary()).filter(([name])=>name && !isLegacyRecoveredText(name)).map(([dyehouse, config]) => {
    const extras = Object.entries(config.extras || {}).map(([name, price])=>`<tr><td>${escapeHtml(name)}</td><td>${escapeHtml(price)}</td></tr>`).join('') || '<tr><td colspan="2">لا توجد بنود تجهيز.</td></tr>';
    const printing = Object.entries(config.printing || {}).flatMap(([type, rows])=>Object.entries(rows || {}).map(([name, price])=>`<tr><td>${escapeHtml(type)}</td><td>${escapeHtml(name)}</td><td>${escapeHtml(price)}</td></tr>`)).join('') || '<tr><td colspan="3">لا توجد طباعة.</td></tr>';
    return `<section class="whatsapp-settings-section">
      <div class="subsection-head"><h3>${escapeHtml(dyehouse)} - ${config.accountingMode === 'gross' ? 'قائم' : 'صافي'}</h3></div>
      <h4>التجهيز</h4>
      <table><thead><tr><th>البند</th><th>السعر</th></tr></thead><tbody>${extras}</tbody></table>
      <h4>الطباعة</h4>
      <table><thead><tr><th>النوع</th><th>البند</th><th>السعر</th></tr></thead><tbody>${printing}</tbody></table>
    </section>`;
  }).join('');
}

function renderDyehousePricesDialog() {
  const rowsHtml = dyehousePriceRows().map(dyehousePriceRowHtml).join('');
  refs.documentTitle.textContent = 'أسعار المصابغ';
  refs.documentBody.dataset.documentType = 'dyehouse-prices';
  refs.documentBody.innerHTML = `<div class="document-sheet whatsapp-settings-sheet">
    <h2>تحديث أسعار المصابغ</h2>
    <p class="muted">أضف أو عدل أسعار الصباغة والتجهيز المستخدمة في شاشة التسعير. اكتب اسم المصبغة ونوع الخامة ودرجة اللون والسعر، ثم احفظ القائمة.</p>
    <table>
      <thead><tr><th>المصبغة</th><th>نوع الخامة</th><th>درجة اللون</th><th>السعر</th><th>إجراء</th></tr></thead>
      <tbody data-dyehouse-price-rows>${rowsHtml}</tbody>
    </table>
    ${dyehousePriceSummaryHtml()}
    <div class="document-actions no-print">
      <button class="mini-btn" type="button" data-add-price-row>إضافة بند</button>
      <button class="primary-btn" type="button" data-save-dyehouse-prices>حفظ أسعار المصابغ</button>
    </div>
  </div>`;
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}

    return {
      dyehousePriceRows,
      dyehousePriceRowHtml,
      dyehousePriceSummaryHtml,
      renderDyehousePricesDialog,
    };
  }

  window.createSettingsUi = createSettingsUi;
})();

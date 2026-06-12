(function () {
  function createAuditUi(deps) {
    const {
      refs,
      escapeHtml,
      arDateTime,
      isLegacyRecoveredText,
      backendRequest,
    } = deps;

function auditActionLabel(action) {
  return { create:'إضافة', update:'تعديل', delete:'حذف', retry:'إعادة محاولة', error:'خطأ' }[action] || action || 'حركة';
}

function auditEntityLabel(entityType) {
  return {
    order: 'طلب',
    pricing: 'تسعيرة',
    allocation: 'لون',
    orderDetails: 'تفاصيل طلب',
    reportOutbox: 'قائمة الإرسال',
    whatsappSettings: 'إعدادات واتساب',
    dyehousePriceLibrary: 'أسعار المصابغ',
    customerAccount: 'حساب عميل',
    customerPayment: 'دفعة عميل',
    customers: 'عميل',
    pricings: 'تسعيرة',
    orders: 'طلب',
    order_allocations: 'لون',
    raw_receiving_batches: 'استلام خام من النسيج',
    dyehouse_delivery_batches: 'صرف خام للمصبغة',
    finished_receiving_batches: 'استلام مجهز',
    customer_delivery_batches: 'تسليم عميل',
    accessory_batches: 'إكسسوار',
    raw_returns: 'مرتجع خام',
    dyehouse_transfers: 'تحويل مصبغة',
    report_outbox: 'إرسال تقرير',
    system_settings: 'إعدادات النظام',
    users: 'مستخدم',
  }[entityType] || entityType || 'بيان';
}

function normalizeAuditItem(row) {
  if (!row) return null;
  return {
    id: row.id || '',
    createdAt: row.created_at || row.createdAt || '',
    action: row.action || '',
    entityType: row.entity_type || row.entityType || '',
    entityId: row.entity_id || row.entityId || '',
    note: row.note || '',
  };
}

function cleanAuditNote(item) {
  const text = String(item?.note || '').trim();
  if (text && !isLegacyRecoveredText(text)) return text;
  const number = String(text || item?.entityId || '').match(/\d+/)?.[0] || String(item?.entityId || '').trim();
  const entity = auditEntityLabel(item?.entityType);
  const action = auditActionLabel(item?.action);
  return `${action} ${entity}${number ? ` رقم ${number}` : ''}`;
}

async function fetchAuditLogRows() {
  const rows = await backendRequest('/audit-log?limit=500', { cache:'no-store' });
  return Array.isArray(rows) ? rows.map(normalizeAuditItem).filter(Boolean) : [];
}

function renderAuditLogRows(rows) {
  return rows.map((item)=>`<tr>
    <td>${escapeHtml(arDateTime(item.createdAt))}</td>
    <td>${escapeHtml(auditActionLabel(item.action))}</td>
    <td>${escapeHtml(auditEntityLabel(item.entityType))}</td>
    <td>${escapeHtml(item.entityId || '-')}</td>
    <td>${escapeHtml(cleanAuditNote(item))}</td>
  </tr>`).join('') || '<tr><td colspan="5">لا توجد حركات مسجلة حتى الآن.</td></tr>';
}

async function openAuditLogDialog() {
  refs.documentTitle.textContent = 'سجل التعديلات';
  refs.documentBody.dataset.documentType = 'audit-log';
  refs.documentBody.innerHTML = '<div class="document-sheet orders-follow-report"><div class="report-title"><h2>سجل التعديلات</h2><span>جاري تحميل الحركات من قاعدة البيانات...</span></div></div>';
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
  try {
    const rows = await fetchAuditLogRows();
    refs.documentBody.innerHTML = `<div class="document-sheet orders-follow-report"><div class="report-title"><h2>سجل التعديلات</h2><span>آخر العمليات المسجلة من قاعدة بيانات التشغيل مباشرة.</span></div><section class="report-section"><h3>تفاصيل السجل</h3><table class="follow-table"><thead><tr><th>التاريخ</th><th>الحركة</th><th>نوع البيان</th><th>المرجع</th><th>التفاصيل</th></tr></thead><tbody>${renderAuditLogRows(rows)}</tbody></table></section></div>`;
  } catch (error) {
    refs.documentBody.innerHTML = '<div class="document-sheet orders-follow-report"><div class="report-title"><h2>سجل التعديلات</h2><span>تعذر تحميل سجل التعديلات من قاعدة البيانات.</span></div><div class="notice warning">السجل لا يعرض بيانات قديمة من المتصفح. أعد المحاولة بعد التأكد من اتصال قاعدة البيانات.</div></div>';
  }
}

    return {
      auditActionLabel,
      auditEntityLabel,
      normalizeAuditItem,
      cleanAuditNote,
      fetchAuditLogRows,
      renderAuditLogRows,
      openAuditLogDialog,
    };
  }

  window.createAuditUi = createAuditUi;
})();

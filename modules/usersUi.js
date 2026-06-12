(function () {
  function createUsersUi(deps) {
    const {
      refs,
      escapeHtml,
      arDateTime,
      backendRequest,
      getCurrentUser,
      alert,
      confirm,
    } = deps;

async function fetchSystemUsers() {
  return await backendRequest('/users', { cache:'no-store' });
}

function systemUserRoleLabel(role) {
  return { admin:'مدير', manager:'مسؤول تشغيل', user:'مستخدم', accountant:'حسابات', viewer:'مشاهدة' }[role] || role || 'مستخدم';
}

function currentUserRole() {
  return getCurrentUser()?.role || 'viewer';
}

function canManageUsers() {
  return currentUserRole() === 'admin';
}

function canDeleteRecords() {
  return currentUserRole() === 'admin';
}

function canWriteRecords() {
  return ['admin', 'manager'].includes(currentUserRole());
}

function applyPermissionVisibility() {
  if (!canManageUsers()) document.getElementById('usersBtn')?.remove();
  if (!canWriteRecords()) {
    document.querySelectorAll([
      '#openOrderFormBtn',
      '#openPricingFormBtn',
      '#dyehousePricesBtn',
      '[data-nav-action="orderNew"]',
      '[data-nav-action="pricingNew"]',
      '[data-nav-action="dyehousePrices"]',
      '[data-order-pricing]',
      '[data-convert-pricing]',
      '[data-edit-pricing]',
      '[data-edit-pricing-doc]',
      '[data-edit-order]',
      '#editOrderBtn',
      '#focusEditOrderBtn',
      '#toggleOperationClosedBtn',
      '#addAllocationBtn',
      '[data-edit-allocation]',
      '[data-transfer-allocation]',
      '[data-open-bulk-entry]',
      '[data-save-bulk-batches]',
    ].join(',')).forEach((button) => button.remove());
    document.querySelectorAll('#orderDetailsPanel .batch-form button, #orderDetailsPanel .batch-form input, #orderDetailsPanel .batch-form select, #orderDetailsPanel .batch-form textarea').forEach((element) => {
      element.disabled = true;
    });
    document.querySelectorAll('#orderDetailsPanel .batch-form').forEach((form) => {
      if (!form.querySelector('[data-readonly-note]')) form.insertAdjacentHTML('afterbegin', '<p class="eyebrow" data-readonly-note>صلاحيتك الحالية للعرض فقط. اطلب من مسؤول التشغيل تسجيل الحركة.</p>');
    });
  }
  if (!canDeleteRecords()) {
    document.querySelectorAll('[data-delete-pricing], [data-delete-order], [data-delete-allocation], [data-delete-system-user], [data-batch-action="delete"], #focusDeleteOrderBtn').forEach((button) => button.remove());
  }
}

async function openUsersDialog() {
  if (!canManageUsers()) {
    alert('إدارة المستخدمين للمدير فقط.');
    return;
  }
  refs.documentTitle.textContent = 'المستخدمين';
  refs.documentBody.dataset.documentType = 'system-users';
  refs.documentBody.innerHTML = '<div class="document-sheet"><h2>المستخدمين</h2><p class="muted">جاري تحميل المستخدمين...</p></div>';
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
  try {
    const users = await fetchSystemUsers();
    const rows = users.map((user)=>`<tr>
      <td><strong>${escapeHtml(user.name || '-')}</strong></td>
      <td>${escapeHtml(user.username || '-')}</td>
      <td>${escapeHtml(systemUserRoleLabel(user.role))}</td>
      <td><span class="status ${Number(user.is_active) === 1 ? 'completed' : 'failed'}">${Number(user.is_active) === 1 ? 'نشط' : 'موقوف'}</span></td>
      <td>${escapeHtml(arDateTime(user.updated_at || user.created_at))}</td>
      <td><div class="batch-actions"><button class="mini-btn" type="button" data-edit-system-user="${escapeHtml(user.id)}">تعديل</button><button class="mini-btn danger" type="button" data-delete-system-user="${escapeHtml(user.id)}">حذف</button></div></td>
    </tr>`).join('');
    refs.documentBody.innerHTML = `<div class="document-sheet">
      <div class="subsection-head"><div><h2>المستخدمين</h2><p class="muted">إدارة مستخدمي النظام. الدخول الحالي يظل مؤمنًا ببيانات السيرفر حتى نقل تسجيل الدخول بالكامل للمستخدمين.</p></div><button class="mini-btn gold" type="button" data-new-system-user>إضافة مستخدم</button></div>
      <table><thead><tr><th>الاسم</th><th>اسم الدخول</th><th>الصلاحية</th><th>الحالة</th><th>آخر تعديل</th><th>إجراءات</th></tr></thead><tbody>${rows || '<tr><td colspan="6">لا يوجد مستخدمين حتى الآن.</td></tr>'}</tbody></table>
    </div>`;
    refs.documentBody.dataset.usersJson = JSON.stringify(users);
  } catch (error) {
    refs.documentBody.innerHTML = '<div class="document-sheet"><h2>المستخدمين</h2><div class="notice warning">تعذر تحميل المستخدمين حاليًا.</div></div>';
  }
}

function openSystemUserForm(user = null) {
  refs.documentTitle.textContent = user ? 'تعديل مستخدم' : 'إضافة مستخدم';
  refs.documentBody.dataset.documentType = 'system-user-form';
  refs.documentBody.innerHTML = `<div class="document-sheet">
    <div class="subsection-head"><h2>${user ? 'تعديل مستخدم' : 'إضافة مستخدم'}</h2><button class="mini-btn" type="button" data-back-system-users>رجوع</button></div>
    <div class="summary-grid">
      <label><span>الاسم</span><input data-user-name value="${escapeHtml(user?.name || '')}"></label>
      <label><span>اسم الدخول</span><input data-user-username value="${escapeHtml(user?.username || '')}" required></label>
      <label><span>الصلاحية</span><select data-user-role><option value="admin">مدير</option><option value="manager">مسؤول تشغيل</option><option value="user">مستخدم</option><option value="accountant">حسابات</option><option value="viewer">مشاهدة</option></select></label>
      <label><span>الحالة</span><select data-user-active><option value="1">نشط</option><option value="0">موقوف</option></select></label>
      <label class="full-row"><span>${user ? 'كلمة مرور جديدة - اختياري' : 'كلمة المرور'}</span><input data-user-password type="password" autocomplete="new-password"></label>
    </div>
    <div class="dialog-actions"><button class="primary-btn" type="button" data-save-system-user="${escapeHtml(user?.id || '')}">حفظ المستخدم</button></div>
  </div>`;
  refs.documentBody.querySelector('[data-user-role]').value = user?.role || 'user';
  refs.documentBody.querySelector('[data-user-active]').value = String(Number(user?.is_active ?? 1));
}

function systemUserFormPayload(isNew) {
  const body = refs.documentBody;
  const payload = {
    name: body.querySelector('[data-user-name]')?.value || '',
    username: body.querySelector('[data-user-username]')?.value || '',
    role: body.querySelector('[data-user-role]')?.value || 'user',
    is_active: Number(body.querySelector('[data-user-active]')?.value || 1),
  };
  const password = body.querySelector('[data-user-password]')?.value || '';
  if (password || isNew) payload.password = password;
  return payload;
}

async function saveSystemUser(userId = '') {
  const isNew = !userId;
  const payload = systemUserFormPayload(isNew);
  if (!payload.username || (isNew && !payload.password)) {
    alert('اسم الدخول وكلمة المرور مطلوبين.');
    return;
  }
  if (isNew) await backendRequest('/users', { method:'POST', body:JSON.stringify(payload) });
  else await backendRequest(`/users/${userId}`, { method:'PUT', body:JSON.stringify(payload) });
  await openUsersDialog();
}

async function deleteSystemUser(userId) {
  if (!userId || !confirm('حذف المستخدم؟')) return;
  await backendRequest(`/users/${userId}`, { method:'DELETE' });
  await openUsersDialog();
}

    return {
      fetchSystemUsers,
      systemUserRoleLabel,
      currentUserRole,
      canManageUsers,
      canDeleteRecords,
      canWriteRecords,
      applyPermissionVisibility,
      openUsersDialog,
      openSystemUserForm,
      systemUserFormPayload,
      saveSystemUser,
      deleteSystemUser,
    };
  }

  window.createUsersUi = createUsersUi;
})();

const STORAGE_KEYS = {
  orders: '2btex.orders.v4',
  allocations: '2btex.allocations.v4',
  raw: '2btex.raw.v4',
  dye: '2btex.dye.v5',
  finished: '2btex.finished.v4',
  production: '2btex.production.v2',
  customer: '2btex.customer.v2',
  accessory: '2btex.accessory.v1',
  transfers: '2btex.dyehouseTransfers.v1',
  rawReturns: '2btex.rawReturns.v1',
  pricings: '2btex.pricings.v1',
  customerAccounts: '2btex.customerAccounts.v1',
  reportOutbox: '2btex.reportOutbox.v1',
  whatsappSettings: '2btex.whatsappSettings.v1',
  dyehousePriceLibrary: '2btex.dyehousePriceLibrary.v1',
  auditLog: '2btex.auditLog.v1',
  whatsappStatus: '2btex.whatsappStatus.v1',
};
// LEGACY_ARABIC_MARKER: بقايا كتل قديمة تالفة داخل app.js.
// المسارات المستخدمة فعليًا تم تجاوزها بدوال عربية سليمة في نهاية الملف، وهذه العلامة تبقى ظاهرة في البحث حتى لا نخفي مواضع التنظيف المتبقية.
// LEGACY UNUSED - pending cleanup:
// buildFullOrderReport, openDocument, openManagementReportsMenu, openOrdersReport,
// openDyehouseBalancesReport, buildDyeingOrderReport, openPricingQuotation,
// renderDyehouseDocumentPicker, addAllocation, promptOperationNotes,
// rawPermitImagesSection, documentHeader, editAllocation, buildLabSamplesReport.
const uid = () => `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const clone = (value) => JSON.parse(JSON.stringify(value));
const load = (key, fallback, legacyKey) => {
  try {
    const current = JSON.parse(localStorage.getItem(key));
    const legacy = legacyKey ? JSON.parse(localStorage.getItem(legacyKey)) : null;
    if (Array.isArray(current) && current.length) return current;
    if (Array.isArray(legacy) && legacy.length) return legacy;
    return clone(fallback);
  } catch {
    return clone(fallback);
  }
};
const save = () => {
  ensureRuntimeCollections();
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
  localStorage.setItem(STORAGE_KEYS.allocations, JSON.stringify(allocations));
  localStorage.setItem(STORAGE_KEYS.raw, JSON.stringify(rawBatches));
  localStorage.setItem(STORAGE_KEYS.dye, JSON.stringify(dyeBatches));
  localStorage.setItem(STORAGE_KEYS.finished, JSON.stringify(finishedBatches));
  localStorage.setItem(STORAGE_KEYS.production, JSON.stringify(productionBatches));
  localStorage.setItem(STORAGE_KEYS.customer, JSON.stringify(customerBatches));
  localStorage.setItem(STORAGE_KEYS.accessory, JSON.stringify(accessoryBatches));
  localStorage.setItem(STORAGE_KEYS.transfers, JSON.stringify(dyehouseTransfers));
  localStorage.setItem(STORAGE_KEYS.rawReturns, JSON.stringify(rawReturns));
  localStorage.setItem(STORAGE_KEYS.pricings, JSON.stringify(pricings));
  localStorage.setItem(STORAGE_KEYS.customerAccounts, JSON.stringify(customerAccounts));
  localStorage.setItem(STORAGE_KEYS.reportOutbox, JSON.stringify(reportOutbox));
  localStorage.setItem(STORAGE_KEYS.whatsappSettings, JSON.stringify(whatsappSettings));
  localStorage.setItem(STORAGE_KEYS.auditLog, JSON.stringify(auditLog));
  localStorage.setItem(STORAGE_KEYS.whatsappStatus, JSON.stringify(whatsappStatus));
};

const defaults = {
  orders: [],
  allocations: [],
  raw: [],
  dye: [],
  finished: [],
  production: [],
  customer: [],
  accessory: [],
  transfers: [],
  rawReturns: [],
  pricings: [],
  customerAccounts: {},
  reportOutbox: [],
  whatsappSettings: { weavingGroupName: '2B - النسيج', dyeingGroupName: '2B - المصبغة', dyehousesReportGroupName: 'اوردارات 2B', dyehouseGroups: {}, weavingGroups: {}, customerGroups: {}, sendingEnabled: false },
  auditLog: [],
  whatsappStatus: { status: 'disconnected', updatedAt: '', errorMessage: '' },
};

let orders = clone(defaults.orders);
let allocations = clone(defaults.allocations);
let rawBatches = clone(defaults.raw);
let dyeBatches = clone(defaults.dye);
let finishedBatches = clone(defaults.finished);
let productionBatches = clone(defaults.production);
let customerBatches = clone(defaults.customer);
let accessoryBatches = clone(defaults.accessory);
let dyehouseTransfers = clone(defaults.transfers);
let rawReturns = clone(defaults.rawReturns);
let pricings = clone(defaults.pricings);
let customerAccounts = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.customerAccounts));
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : clone(defaults.customerAccounts);
  } catch {
    return clone(defaults.customerAccounts);
  }
})();
let reportOutbox = load(STORAGE_KEYS.reportOutbox, defaults.reportOutbox);
let whatsappSettings = (() => {
  try { return { ...defaults.whatsappSettings, ...(JSON.parse(localStorage.getItem(STORAGE_KEYS.whatsappSettings)) || {}) }; }
  catch { return clone(defaults.whatsappSettings); }
})();
let auditLog = load(STORAGE_KEYS.auditLog, defaults.auditLog);
let whatsappStatus = (() => {
  try { return { ...defaults.whatsappStatus, ...(JSON.parse(localStorage.getItem(STORAGE_KEYS.whatsappStatus)) || {}) }; }
  catch { return clone(defaults.whatsappStatus); }
})();
if (!Array.isArray(reportOutbox)) reportOutbox = clone(defaults.reportOutbox);
if (!Array.isArray(auditLog)) auditLog = clone(defaults.auditLog);
if (!Array.isArray(customerBatches)) customerBatches = clone(defaults.customer);
if (!Array.isArray(dyehouseTransfers)) dyehouseTransfers = clone(defaults.transfers);
if (!Array.isArray(rawReturns)) rawReturns = clone(defaults.rawReturns);
const LEGACY_TEST_ORDER_NUMBERS = new Set(['2554']);
const LEGACY_TEST_CUSTOMERS = new Set(['ام احمد','أم أحمد','ام أحمد','أم احمد']);
function normalizeLegacyCustomerName(value) {
  return String(value || '').replace(/[إأآ]/g, 'ا').replace(/\s+/g, ' ').trim();
}
function isLegacyTestOrder(order) {
  return LEGACY_TEST_ORDER_NUMBERS.has(String(order?.orderNumber || '').trim())
    && LEGACY_TEST_CUSTOMERS.has(normalizeLegacyCustomerName(order?.customer));
}
function purgeLegacyTestOrdersFromMemory() {
  const legacyIds = orders.filter(isLegacyTestOrder).map((order)=>order.id).filter(Boolean);
  if (!legacyIds.length) return false;
  const legacyIdSet = new Set(legacyIds);
  const legacyAllocationIds = new Set(allocations.filter((allocation)=>legacyIdSet.has(allocation.orderId)).map((allocation)=>allocation.id));
  orders = orders.filter((order)=>!legacyIdSet.has(order.id));
  allocations = allocations.filter((allocation)=>!legacyIdSet.has(allocation.orderId));
  rawBatches = rawBatches.filter((batch)=>!legacyIdSet.has(batch.orderId));
  rawReturns = rawReturns.filter((batch)=>!legacyIdSet.has(batch.orderId) && !legacyAllocationIds.has(batch.allocationId));
  dyeBatches = dyeBatches.filter((batch)=>!legacyAllocationIds.has(batch.allocationId));
  productionBatches = productionBatches.filter((batch)=>!legacyAllocationIds.has(batch.allocationId));
  finishedBatches = finishedBatches.filter((batch)=>!legacyAllocationIds.has(batch.allocationId));
  customerBatches = customerBatches.filter((batch)=>!legacyAllocationIds.has(batch.allocationId));
  accessoryBatches = accessoryBatches.filter((batch)=>!legacyIdSet.has(batch.orderId) && !legacyAllocationIds.has(batch.allocationId));
  dyehouseTransfers = dyehouseTransfers.filter((transfer)=>!legacyIdSet.has(transfer.orderId) && !legacyAllocationIds.has(transfer.allocationId) && !legacyAllocationIds.has(transfer.newAllocationId));
  return true;
}
function ensureRuntimeCollections() {
  if (!Array.isArray(orders)) orders = clone(defaults.orders);
  if (!Array.isArray(allocations)) allocations = clone(defaults.allocations);
  if (!Array.isArray(rawBatches)) rawBatches = clone(defaults.raw);
  if (!Array.isArray(dyeBatches)) dyeBatches = clone(defaults.dye);
  if (!Array.isArray(finishedBatches)) finishedBatches = clone(defaults.finished);
  if (!Array.isArray(productionBatches)) productionBatches = clone(defaults.production);
  if (!Array.isArray(customerBatches)) customerBatches = clone(defaults.customer);
  if (!Array.isArray(accessoryBatches)) accessoryBatches = clone(defaults.accessory);
  if (!Array.isArray(dyehouseTransfers)) dyehouseTransfers = clone(defaults.transfers);
  if (!Array.isArray(rawReturns)) rawReturns = clone(defaults.rawReturns);
  if (!Array.isArray(pricings)) pricings = clone(defaults.pricings);
  if (!customerAccounts || typeof customerAccounts !== 'object' || Array.isArray(customerAccounts)) customerAccounts = clone(defaults.customerAccounts);
  if (!Array.isArray(reportOutbox)) reportOutbox = clone(defaults.reportOutbox);
  if (!Array.isArray(auditLog)) auditLog = clone(defaults.auditLog);
  if (!whatsappSettings || typeof whatsappSettings !== 'object' || Array.isArray(whatsappSettings)) whatsappSettings = clone(defaults.whatsappSettings);
  whatsappSettings = { ...defaults.whatsappSettings, ...whatsappSettings };
  if (!whatsappSettings.dyehouseGroups || typeof whatsappSettings.dyehouseGroups !== 'object' || Array.isArray(whatsappSettings.dyehouseGroups)) whatsappSettings.dyehouseGroups = {};
  if (!whatsappSettings.weavingGroups || typeof whatsappSettings.weavingGroups !== 'object' || Array.isArray(whatsappSettings.weavingGroups)) whatsappSettings.weavingGroups = {};
  if (!whatsappSettings.customerGroups || typeof whatsappSettings.customerGroups !== 'object' || Array.isArray(whatsappSettings.customerGroups)) whatsappSettings.customerGroups = {};
  if (!whatsappStatus || typeof whatsappStatus !== 'object' || Array.isArray(whatsappStatus)) whatsappStatus = clone(defaults.whatsappStatus);
  whatsappStatus = { ...defaults.whatsappStatus, ...whatsappStatus };
}
ensureRuntimeCollections();
function ensureRecordIds(collection) {
  let changed = false;
  (collection || []).forEach((item)=>{ if (item && !item.id) { item.id = uid(); changed = true; } });
  return changed;
}
function repairTransferredAllocationDyehouses() {
  let changed = false;
  (dyehouseTransfers || []).forEach((transfer)=>{
    const targetId = transfer.newAllocationId || transfer.allocationId;
    const toDyehouse = String(transfer.toDyehouse || '').trim();
    if (!targetId || !toDyehouse) return;
    const allocation = allocations.find((item)=>item.id === targetId);
    if (allocation && String(allocation.dyehouse || '').trim() !== toDyehouse) {
      allocation.dyehouse = toDyehouse;
      changed = true;
    }
  });
  return changed;
}
if ([rawBatches, rawReturns, dyeBatches, productionBatches, finishedBatches, customerBatches, accessoryBatches, dyehouseTransfers].some(ensureRecordIds) || repairTransferredAllocationDyehouses()) save();
const saveData = save;
let selectedOrderId = null;
let editingOrderId = null;
let editingPricingId = null;
let currentDocumentType = null;
let pendingConvertedPricingId = null;
let initialLocalStorageSnapshot = null;

const refs = Object.fromEntries([
  'statsGrid','pricingTableBody','ordersTableBody','searchInput','customerFilter','dyehouseFilter','fabricFilter','orderStatusFilter','orderDetailsPanel','documentsPanel','analyzeReportBtn','aiStatusText','aiAnalysisDialog','aiAnalysisBody','closeAiAnalysisBtn','copyAiWhatsappBtn','openPricingFormBtn','openDocumentReviewBtn','openOrderFormBtn','openOrdersReportBtn','openDyehouseBalancesReportBtn','openManagementReportsBtn','closePricingFormBtn','pricingDialog','pricingForm','pricingNumber','pricingProductCode','pricingCustomer','pricingDate','pricingFabricType','pricingMaterialType','pricingDyehouse','pricingColorClass','pricingQuantity','pricingInchWidth','pricingFinishedWeight','pricingRawCost','pricingDyeCost','pricingSuggestedDyeCost','pricingWastePercent','pricingExtraCost','pricingProfitPerKg','pricingPaymentTerms','pricingNotes','pricingWasteCostPreview','pricingCostPreview','pricingSellPreview','pricingTotalPreview','closeOrderFormBtn','orderDialog','orderForm','orderNumber','productCode','customer','orderDate','fabricType','totalRawQuantity','expectedWastePercent','widthMode','inchWidth','widthLinesBox','widthLinesEditor','addWidthLineBtn','kiloPrice','paymentTerms','accessoryType','accessoryPercent','accessoryLinesEditor','addAccessoryLineBtn','dyehouse','weavingSource','orderNotes','weavingSlipDialog','weavingSlipForm','weavingSlipFile','weavingSlipPreview','weavingSlipType','weavingSlipOrderNumber','weavingSlipDate','weavingSlipAllocation','weavingSlipWidthLine','weavingSlipQuantity','weavingSlipSupplier','weavingSlipNoteNumber','reviewMatchNoteBtn','reviewMatchStatus','weavingSlipNotes','closeWeavingSlipBtn','documentDialog','documentTitle','documentBody','closeDocumentBtn','printDocumentBtn','shareWhatsAppBtn','deletePricingBtn'
].map((id) => [id, document.getElementById(id)]));
refs.orderNotes?.closest('label')?.querySelector('span') && (refs.orderNotes.closest('label').querySelector('span').textContent = 'ملاحظات تشغيل');

function captureLocalStorageSnapshot() {
  ensureRuntimeCollections();
  return {
    orders: clone(orders),
    allocations: clone(allocations),
    rawBatches: clone(rawBatches),
    dyeBatches: clone(dyeBatches),
    finishedBatches: clone(finishedBatches),
    productionBatches: clone(productionBatches),
    customerBatches: clone(customerBatches),
    accessoryBatches: clone(accessoryBatches),
    dyehouseTransfers: clone(dyehouseTransfers),
    rawReturns: clone(rawReturns),
    pricings: clone(pricings),
    dyehousePriceLibrary: clone(customDyehousePriceLibrary || {}),
    reportOutbox: clone(reportOutbox),
    auditLog: clone(auditLog),
  };
}

const WHATSAPP_SERVICE_URL = 'http://127.0.0.1:3020';
const AI_SERVICE_URL = 'http://127.0.0.1:3030';
const A5_SERVICE_URL = 'http://127.0.0.1:3041';
const BACKEND_API_URL = '/api';
let backendAvailable = false;

async function backendRequest(path, options = {}) {
  const response = await fetch(`${BACKEND_API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (!response.ok) throw new Error(`Backend ${response.status}`);
  return response.json();
}

const dbDate = (row) => row.batch_date || row.transfer_date || row.order_date || row.pricing_date || row.created_at || '';
const customerLookupName = (customers, id) => customers.find((item)=>item.id===id)?.name || '';
function parseDbJsonArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function normalizeOrderStatus(status) {
  return status === 'active' ? 'pending' : (status || 'pending');
}
function mapDbOrder(row, customers) {
  const widthMode = row.width_mode || 'single';
  return {
    id: row.id,
    orderNumber: row.order_number || '',
    pricingId: row.pricing_id || '',
    customer: customerLookupName(customers, row.customer_id) || row.customer || '',
    orderDate: row.order_date || '',
    productCode: row.product_code || buildItemCode(row.order_number),
    fabricType: row.fabric_type || '',
    totalRawQuantity: Number(row.total_raw_quantity || 0),
    expectedWastePercent: Number(row.expected_waste_percent || 0),
    widthMode,
    inchWidth: row.inch_width || '',
    widthLines: widthMode === 'multiple' ? parseDbJsonArray(row.width_lines_json) : [],
    kiloPrice: Number(row.kilo_price || 0),
    rawCost: Number(row.raw_cost || 0),
    paymentTerms: row.payment_terms || '',
    accessoryType: row.accessory_type || '',
    accessoryPercent: Number(row.accessory_percent || 0),
    accessoryLines: parseDbJsonArray(row.accessory_lines_json),
    dyehouse: row.dyehouse || '',
    weavingSource: row.weaving_source || '',
    notes: row.notes || '',
    status: normalizeOrderStatus(row.status),
    operationClosed: !!row.is_closed,
  };
}
function mapDbAllocation(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    color: row.color || '',
    pantoneCode: row.pantone_code || '',
    plannedQuantity: Number(row.planned_quantity || 0),
    dyehouse: row.dyehouse || '',
    widthLineId: row.width_line_id || '',
    rawInch: row.raw_inch || '',
    rawWidth: row.raw_width || '',
    targetFinishedWidth: row.finished_width || '',
    targetFinishedWeight: row.finished_weight || '',
    accessoryQuantityManual: row.accessory_quantity_manual ?? null,
    notes: row.notes || '',
  };
}
function mapDbBatch(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    allocationId: row.allocation_id,
    date: dbDate(row),
    quantity: Number(row.quantity || 0),
    supplier: row.supplier || '',
    dyehouse: row.dyehouse || '',
    widthLineId: row.width_line_id || '',
    noteNumber: row.note_number || '',
    notes: row.notes || row.reason || '',
    finishedWidth: row.finished_width || '',
    finishedWeight: row.finished_weight || '',
    accessoryType: row.accessory_type || '',
    movement: row.movement || '',
  };
}
function mapDbTransfer(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    allocationId: row.from_allocation_id,
    newAllocationId: row.to_allocation_id,
    fromDyehouse: row.from_dyehouse || '',
    toDyehouse: row.to_dyehouse || '',
    quantity: Number(row.quantity || 0),
    date: dbDate(row),
    reason: row.notes || '',
    noteNumber: row.note_number || '',
    transferDate: row.transfer_date || dbDate(row),
    mode: row.to_allocation_id ? 'split' : 'full',
  };
}
function mapDbPricing(row, customers) {
  return {
    id: row.id,
    pricingNumber: row.pricing_number || '',
    customer: customerLookupName(customers, row.customer_id) || '',
    pricingDate: row.pricing_date || '',
    fabricType: row.fabric_type || '',
    materialType: row.material_type || '',
    dyehouse: row.dyehouse || '',
    colorClass: row.color_class || '',
    quantity: Number(row.quantity || 0),
    inchWidth: row.inch_width || '',
    finishedWeight: row.finished_weight || '',
    rawCost: Number(row.raw_cost || 0),
    dyeCost: Number(row.dye_cost || 0),
    wastePercent: Number(row.waste_percent || 0),
    extraCost: Number(row.extra_cost || 0),
    profitPerKg: Number(row.profit_per_kg || 0),
    unitPrice: Number(row.unit_price || 0),
    totalPrice: Number(row.total_price || 0),
    paymentTerms: row.payment_terms || '',
    notes: row.notes || '',
    status: row.status || 'active',
  };
}
function renderBackendUnavailable() {
  orders = clone(defaults.orders);
  allocations = clone(defaults.allocations);
  rawBatches = clone(defaults.raw);
  dyeBatches = clone(defaults.dye);
  finishedBatches = clone(defaults.finished);
  productionBatches = clone(defaults.production);
  customerBatches = clone(defaults.customer);
  accessoryBatches = clone(defaults.accessory);
  dyehouseTransfers = clone(defaults.transfers);
  rawReturns = clone(defaults.rawReturns);
  pricings = clone(defaults.pricings);
  if (refs.statsGrid) refs.statsGrid.innerHTML = '<div class="metric"><span>حالة قاعدة البيانات</span><strong>غير متاحة</strong></div>';
  if (refs.pricingTableBody) refs.pricingTableBody.innerHTML = '<tr><td colspan="8">قاعدة البيانات غير متاحة حاليًا. أعد تحميل الصفحة بعد عودة الاتصال.</td></tr>';
  if (refs.ordersTableBody) refs.ordersTableBody.innerHTML = '<tr><td colspan="9">قاعدة البيانات غير متاحة حاليًا. لن يتم عرض بيانات قديمة من المتصفح.</td></tr>';
  if (refs.orderDetailsPanel) refs.orderDetailsPanel.innerHTML = '<div class="empty-state">قاعدة البيانات غير متاحة. النظام متوقف عن عرض أو تعديل بيانات التشغيل حتى يعود الاتصال.</div>';
}
function updateConnectionBadge(id, ok, label, detail = '') {
  const badge = document.getElementById(id);
  if (!badge) return;
  badge.classList.toggle('is-ok', !!ok);
  badge.classList.toggle('is-down', !ok);
  badge.setAttribute('aria-label', `${label}: ${ok ? 'متصل' : 'غير متصل'}`);
  badge.title = detail || `${label}: ${ok ? 'متصل' : 'غير متصل'}`;
  const text = badge.querySelector('[data-connection-text]');
  if (text) text.textContent = `${label}: ${ok ? 'متصل' : 'غير متصل'}`;
}
function updateBackendStatusBadge(detail = '') {
  updateConnectionBadge('backendStatusBadge', backendAvailable, 'قاعدة البيانات', detail);
}
function updateWhatsappStatusBadge() {
  const connected = whatsappStatus?.status === 'connected';
  updateConnectionBadge('whatsappStatusBadge', connected, 'واتساب', whatsappStatus?.errorMessage || whatsappStatus?.updatedAt || '');
}
async function pollBackendStatus() {
  try {
    await backendRequest('/health', { cache: 'no-store' });
    backendAvailable = true;
    updateBackendStatusBadge('قاعدة البيانات متصلة');
  } catch (error) {
    backendAvailable = false;
    updateBackendStatusBadge('قاعدة البيانات غير متاحة');
  }
}
async function loadBackendData() {
  try {
    const data = await backendRequest('/bootstrap', { cache: 'no-store' });
    const customers = data.customers || [];
    orders = (data.orders || []).map((row)=>mapDbOrder(row, customers));
    pricings = (data.pricings || []).map((row)=>mapDbPricing(row, customers));
    allocations = (data.allocations || []).map(mapDbAllocation);
    rawBatches = (data.dyehouseDeliveryBatches || []).map(mapDbBatch);
    finishedBatches = [];
    productionBatches = (data.finishedReceivingBatches || []).map(mapDbBatch);
    customerBatches = (data.customerDeliveryBatches || []).map(mapDbBatch);
    accessoryBatches = (data.accessoryBatches || []).map(mapDbBatch);
    rawReturns = (data.rawReturns || []).map(mapDbBatch);
    dyehouseTransfers = (data.dyehouseTransfers || []).map(mapDbTransfer);
    purgeLegacyTestOrdersFromMemory();
    if (!orders.some((order)=>order.id === selectedOrderId)) selectedOrderId = orders[0]?.id || null;
    const settings = data.systemSettings || {};
    if (settings.customerAccounts && typeof settings.customerAccounts === 'object' && !Array.isArray(settings.customerAccounts)) {
      customerAccounts = settings.customerAccounts;
    }
    if (settings.whatsappSettings && typeof settings.whatsappSettings === 'object' && !Array.isArray(settings.whatsappSettings)) {
      whatsappSettings = { ...defaults.whatsappSettings, ...settings.whatsappSettings };
    }
    if (Array.isArray(settings.auditLog)) {
      auditLog = settings.auditLog;
    }
    const backendPriceLibrary = data.systemSettings?.dyehousePriceLibrary;
    if (backendPriceLibrary && typeof backendPriceLibrary === 'object' && !Array.isArray(backendPriceLibrary)) {
      customDyehousePriceLibrary = sanitizeDyehousePriceLibrary(backendPriceLibrary);
      saveDyehousePriceLibraryLocal();
      applyPricingDyehouseOptions();
      updateSuggestedDyeCost();
    }
    backendAvailable = true;
    updateBackendStatusBadge('قاعدة البيانات متصلة');
    save();
    renderAll();
  } catch (error) {
    backendAvailable = false;
    updateBackendStatusBadge('قاعدة البيانات غير متاحة');
    console.warn('Backend unavailable; operational LocalStorage fallback is disabled', error);
    renderBackendUnavailable();
  }
}

async function syncLocalStorageToBackend() {
  if (!confirm('سيتم ترحيل بيانات المتصفح الحالية إلى قاعدة البيانات بدون حذف LocalStorage. هل تريد المتابعة؟')) return;
  const snapshot = initialLocalStorageSnapshot || captureLocalStorageSnapshot();
  try {
    const result = await backendRequest('/import-local', {
      method: 'POST',
      body: JSON.stringify({
        metadata: {
          origin: location.origin,
          href: location.href,
          exportedAt: new Date().toISOString(),
          source: 'ui-sync'
        },
        ...snapshot
      })
    });
    alert(`تمت المزامنة.\nتمت إضافة: ${result.inserted || 0}\nتم تحديث: ${result.updated || 0}\nتم تجاهل: ${result.skipped || 0}`);
    await loadBackendData();
  } catch (error) {
    console.error(error);
    alert('تعذر تنفيذ المزامنة. تأكد أن خدمة قاعدة البيانات تعمل ثم حاول مرة أخرى.');
  }
}
const orderToApi = (order, customerId = null) => ({
  id: order.id,
  order_number: order.orderNumber,
  pricing_id: order.pricingId || null,
  customer_id: customerId,
  order_date: order.orderDate,
  product_code: order.productCode || buildItemCode(order.orderNumber),
  fabric_type: order.fabricType,
  total_raw_quantity: Number(order.totalRawQuantity || 0),
  expected_waste_percent: Number(order.expectedWastePercent || 0),
  width_mode: order.widthMode || 'single',
  width_lines_json: JSON.stringify(Array.isArray(order.widthLines) ? order.widthLines : []),
  inch_width: order.inchWidth || '',
  kilo_price: Number(order.kiloPrice || 0),
  raw_cost: Number(order.rawCost || 0),
  payment_terms: order.paymentTerms || '',
  accessory_type: order.accessoryType || '',
  accessory_percent: Number(order.accessoryPercent || 0),
  accessory_lines_json: JSON.stringify(Array.isArray(order.accessoryLines) ? order.accessoryLines : []),
  dyehouse: order.dyehouse || '',
  weaving_source: order.weavingSource || '',
  notes: order.notes || '',
  status: normalizeOrderStatus(order.status),
  is_closed: order.operationClosed ? 1 : 0,
});
const allocationToApi = (allocation) => ({
  id: allocation.id,
  color: allocation.color || '',
  pantone_code: allocation.pantoneCode || '',
  planned_quantity: Number(allocation.plannedQuantity || 0),
  dyehouse: allocation.dyehouse || '',
  width_line_id: allocation.widthLineId || '',
  raw_inch: allocation.rawInch || null,
  raw_width: allocation.rawWidth || null,
  finished_width: allocation.targetFinishedWidth || allocation.rawWidth || '',
  finished_weight: allocation.targetFinishedWeight || '',
  accessory_quantity_manual: allocation.accessoryQuantityManual ?? null,
  notes: allocation.notes || '',
});
const pricingToApi = (pricing, customerId = null) => {
  const calculated = calculatePricing(pricing);
  return {
    id: pricing.id,
    pricing_number: pricing.pricingNumber,
    customer_id: customerId,
    pricing_date: pricing.pricingDate,
    fabric_type: pricing.fabricType,
    material_type: pricing.materialType || '',
    dyehouse: pricing.dyehouse || '',
    color_class: pricing.colorClass || '',
    quantity: Number(pricing.quantity || 0),
    inch_width: pricing.inchWidth || '',
    finished_weight: pricing.finishedWeight || '',
    raw_cost: Number(pricing.rawCost || 0),
    dye_cost: Number(pricing.dyeCost || 0),
    waste_percent: Number(pricing.wastePercent || 0),
    extra_cost: Number(pricing.extraCost || 0),
    profit_per_kg: Number(pricing.profitPerKg || 0),
    unit_price: Number(calculated.sellPrice || 0),
    total_price: Number(calculated.totalOffer || 0),
    payment_terms: pricing.paymentTerms || '',
    notes: pricing.notes || '',
    status: pricing.status || 'active',
  };
};
function pricingConvertedByOrder(pricing) {
  const pricingOrderNumber = orderNumberFromPricing(pricing?.pricingNumber);
  const pricingNumber = String(pricing?.pricingNumber || '').trim();
  const pricingId = String(pricing?.id || '').trim();
  const customer = normalizeForCompare(pricing?.customer);
  const fabric = normalizeForCompare(pricing?.fabricType);
  return orders.some((order) => {
    const orderNumber = String(order.orderNumber || '').trim();
    const samePricingId = pricingId && String(order.pricingId || '').trim() === pricingId;
    const sameNumber = orderNumber === String(pricingOrderNumber || '').trim() || orderNumber === pricingNumber;
    return samePricingId || (sameNumber && normalizeForCompare(order.customer) === customer && normalizeForCompare(order.fabricType) === fabric);
  });
}
function isActivePricing(pricing) {
  const status = String(pricing?.status || '').toLowerCase();
  return !pricing?.convertedOrderId && !['converted', 'ordered', 'order', 'closed'].includes(status) && !pricingConvertedByOrder(pricing);
}
const batchToApi = (batch) => ({
  id: batch.id,
  order_id: batch.orderId || selectedOrderId || '',
  allocation_id: batch.allocationId || null,
  batch_date: batch.date || new Date().toISOString().slice(0, 10),
  quantity: Number(batch.quantity || 0),
  supplier: batch.supplier || '',
  dyehouse: batch.dyehouse || '',
  width_line_id: batch.widthLineId || null,
  note_number: batch.noteNumber || '',
  notes: batch.notes || '',
  finished_width: batch.finishedWidth || null,
  finished_weight: batch.finishedWeight || null,
  accessory_type: batch.accessoryType || null,
  movement: batch.movement || null,
});
const transferToApi = (transfer) => ({
  id: transfer.id,
  order_id: transfer.orderId || selectedOrderId || '',
  from_allocation_id: transfer.allocationId || null,
  to_allocation_id: transfer.newAllocationId || null,
  from_dyehouse: transfer.fromDyehouse || '',
  to_dyehouse: transfer.toDyehouse || '',
  quantity: Number(transfer.quantity || 0),
  transfer_date: transfer.date || new Date().toISOString().slice(0, 10),
  note_number: transfer.noteNumber || '',
  notes: transfer.reason || transfer.notes || '',
});
function backendCustomerId(name) {
  return `customer-${String(name || 'unknown').trim().replace(/\s+/g, '-').replace(/[^\u0600-\u06FF\w-]/g, '')}`;
}
async function ensureBackendCustomer(name) {
  const cleanName = String(name || '').trim();
  if (!backendAvailable || !cleanName) return null;
  const id = backendCustomerId(cleanName);
  await postBackend('/customers', { id, name: cleanName, notes: 'مضاف من الواجهة' });
  return id;
}
async function postBackend(path, payload) {
  if (!backendAvailable) return null;
  try { return await backendRequest(path, { method: 'POST', body: JSON.stringify(payload) }); }
  catch (error) { backendAvailable = false; console.warn('Backend write failed, kept LocalStorage copy', error); return null; }
}
async function putBackend(path, payload) {
  if (!backendAvailable) return null;
  try { return await backendRequest(path, { method: 'PUT', body: JSON.stringify(payload) }); }
  catch (error) { backendAvailable = false; console.warn('Backend update failed, kept LocalStorage copy', error); return null; }
}
async function deleteBackend(path) {
  if (!backendAvailable) return null;
  try { return await backendRequest(path, { method: 'DELETE' }); }
  catch (error) { backendAvailable = false; console.warn('Backend delete failed, kept LocalStorage copy', error); return null; }
}
async function saveBackendSetting(key, value) {
  if (!backendAvailable) return null;
  try {
    return await backendRequest(`/settings/${key}`, { method:'PUT', body:JSON.stringify({ value }) });
  } catch (error) {
    backendAvailable = false;
    console.warn('Backend setting save failed', key, error);
    return null;
  }
}
async function ensureBackendForWrite(message = 'تعذر الاتصال بقاعدة البيانات. لم يتم اعتماد التعديل.') {
  try {
    await backendRequest('/health', { cache: 'no-store' });
    backendAvailable = true;
    return true;
  } catch (error) {
    backendAvailable = false;
    console.warn('Backend unavailable before write', error);
    alert(message);
    return false;
  }
}
function backendBatchType(type) {
  return type === 'production' || type === 'finished' ? 'finished'
    : type === 'rawReturn' ? 'raw-return'
    : type === 'accessory' ? 'accessory'
    : type === 'customer' ? 'customer'
    : type === 'raw' ? 'dyehouse'
    : type === 'dye' ? 'dyehouse'
    : type;
}
async function rollbackAfterBackendWriteFailure(message) {
  alert(message || 'تعذر تثبيت التعديل في قاعدة البيانات. سيتم الرجوع لآخر بيانات محفوظة.');
  await loadBackendData();
}
const reportTypeLabels = {
  weaving_production_order: 'أمر تشغيل نسيج',
  dyeing_production_order: 'أمر تشغيل صباغة',
  dyehouses_report: 'تقرير المصابغ',
  orders_follow_report: 'تقرير متابعة الطلبات',
  dyehouse_balances_report: 'تقرير أرصدة المصابغ',
  document_pdf_report: 'تقرير PDF',
};
const reportTypeIcons = { pending:'•', sending:'…', sent:'✓', failed:'!', cancelled:'×' };
const reportStatusText = { pending:'في قائمة الإرسال', sending:'جاري الإرسال', sent:'تم الإرسال', failed:'تعذر الإرسال', cancelled:'تم الإلغاء' };
function nowIso() { return new Date().toISOString(); }
function arDateTime(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  return isNaN(date.getTime()) ? '-' : date.toLocaleString('ar-EG', { dateStyle:'short', timeStyle:'short' });
}
function normalizeForCompare(value) { return String(value || '').trim().toLowerCase(); }
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char)=>({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
}
function recordAudit(action, entityType, entityId, beforeValue = null, afterValue = null, note = '') {
  if (!Array.isArray(auditLog)) auditLog = [];
  const safeClone = (value) => {
    try { return value === null || value === undefined ? null : clone(value); }
    catch { return value === null || value === undefined ? null : String(value); }
  };
  auditLog.unshift({ id:uid(), action, entityType, entityId, beforeValue:safeClone(beforeValue), afterValue:safeClone(afterValue), note, createdAt:nowIso() });
  auditLog = auditLog.slice(0, 1000);
}
async function persistAuditLog() {
  await saveBackendSetting('auditLog', auditLog);
}
function getFirstRawNoteNumber(order) {
  if (!order) return '';
  return [...new Set(rawBatches.filter((batch)=>batch.orderId===order.id).map((batch)=>batch.noteNumber).filter(Boolean))].join('، ');
}
function pricingForOrder(order) {
  if (!order) return null;
  const orderNo = String(order.orderNumber || '').trim();
  return pricings.find((pricing)=>String(pricing.pricingNumber || '').trim() === orderNo || orderNumberFromPricing(pricing.pricingNumber) === orderNo) || null;
}
function orderRawCost(order) {
  const direct = Number(order?.rawCost || order?.rawPrice || 0);
  if (direct) return direct;
  return Number(pricingForOrder(order)?.rawCost || 0);
}
function uniqueNonEmpty(values) {
  return [...new Set((values || []).map((value)=>String(value || '').trim()).filter(Boolean))];
}
function mappedGroupFor(name, groupMap = {}) {
  const wanted = normalizeForCompare(name);
  if (!wanted) return '';
  const entry = Object.entries(groupMap || {}).find(([key])=>normalizeForCompare(key) === wanted);
  return String(entry?.[1] || '').trim();
}
function targetGroupsForReport(reportType, order = null) {
  ensureRuntimeCollections();
  if (reportType === 'weaving_production_order') return uniqueNonEmpty([mappedGroupFor(order?.weavingSource, whatsappSettings.weavingGroups)]);
  if (reportType === 'dyeing_production_order') {
    if (order?.whatsappDyehouseName) return uniqueNonEmpty([mappedGroupFor(order.whatsappDyehouseName, whatsappSettings.dyehouseGroups)]);
    const allocationDyehouses = uniqueNonEmpty((order?.allocations || []).map((allocation)=>allocation.dyehouse));
    const dyehouses = allocationDyehouses.length ? allocationDyehouses : uniqueNonEmpty([order?.dyehouse]);
    return uniqueNonEmpty(dyehouses.map((dyehouse)=>mappedGroupFor(dyehouse, whatsappSettings.dyehouseGroups)));
  }
  if (['customerreport_pdf_report','quotation_pdf_report'].includes(reportType) && order?.customer) return uniqueNonEmpty([mappedGroupFor(order.customer, whatsappSettings.customerGroups)]);
  if (reportType === 'dyehouses_report') return uniqueNonEmpty([whatsappSettings.dyehousesReportGroupName]);
  return uniqueNonEmpty([whatsappSettings.dyehousesReportGroupName]);
}
function targetGroupForReport(reportType, order = null) {
  return targetGroupsForReport(reportType, order)[0] || '';
}
function reportNeedsManualWhatsappGroup(reportType) {
  return ['weaving_production_order','dyeing_production_order','customerreport_pdf_report','quotation_pdf_report'].includes(reportType);
}
// LEGACY DOCUMENT FUNCTION - pending cleanup: overridden by the active Arabic reportMessage implementation.
function reportMessage(reportType, order) {
  const rawNote = getFirstRawNoteNumber(order) || '-';
  if (reportType === 'weaving_production_order') {
    return `أمر تشغيل نسيج\nرقم الطلب: ${order.orderNumber || '-'}\nالعميل: ${order.customer || '-'}\nالصنف: ${order.fabricType || '-'}\nالكمية: ${formatNumber(order.totalRawOrdered || 0)}\nسعر الخام: ${formatNumber(orderRawCost(order) || 0)}\nالتاريخ: ${order.orderDate || '-'}\nملاحظات التشغيل: ${reportOperationNotes(order)}`;
  }
  if (reportType === 'dyeing_production_order') {
    const dyehouseName = String(order.whatsappDyehouseName || order.dyehouse || '').trim();
    const dyeingLines = (order.allocations || [])
      .filter((line)=>!dyehouseName || String(line.dyehouse || order.dyehouse || '').trim() === dyehouseName)
      .map((line)=>`${line.color || line.pantoneCode || '-'}: ${formatNumber(line.plannedQuantity || 0)} كجم`)
      .join('\n');
    return `أمر تشغيل صباغة\nرقم الطلب: ${order.orderNumber || '-'}\nإذن الخام: ${rawNote}\nالعميل: ${order.customer || '-'}\nالمصبغة: ${dyehouseName || '-'}\nالصنف: ${order.fabricType || '-'}\nالألوان والكميات:\n${dyeingLines || '-'}\nملاحظات التشغيل: ${reportOperationNotes(order)}`;
  }
  if (order.isStandaloneReport) {
    return `${reportTypeLabels[reportType] || order.reportTitle || 'تقرير من نظام 2B Tex'}\n${order.reportSubtitle || 'تقرير من نظام 2B Tex'}\nوقت التجهيز: ${arDateTime()}`;
  }
  return `تقرير تشغيل\nرقم الطلب: ${order.orderNumber || '-'}\nالعميل: ${order.customer || '-'}\nالمرسل للمصبغة: ${formatNumber(order.totalSentToDyehouse || order.totalRawReceived || 0)}\nالمستلم مجهز: ${formatNumber(order.totalFinishedReceived || 0)}\nالهالك الفعلي: ${formatNumber(order.totalWaste || 0)}\nنسبة الهالك: ${formatNumber(order.totalWastePercent || 0)}%`;
}
function enqueueReport(reportType, order, attachmentPath = '') {
  ensureRuntimeCollections();
  if (!order || !reportType) return null;
  if (reportType === 'dyeing_production_order' && !getFirstRawNoteNumber(order)) return null;
  const targets = targetGroupsForReport(reportType, order);
  if (!targets.length) return null;
  const rows = [];
  targets.forEach((targetGroup)=>{
    const dyehouseName = reportType === 'dyeing_production_order' && !order.whatsappDyehouseName
      ? dyehouseNamesForOrder(order).find((name)=>mappedGroupFor(name, whatsappSettings.dyehouseGroups) === targetGroup) || ''
      : '';
    const messageOrder = dyehouseName ? { ...order, whatsappDyehouseName:dyehouseName } : order;
    const existing = reportOutbox.find((item)=>item.reportType===reportType && item.orderNumber===order.orderNumber && item.targetGroup===targetGroup && ['pending','sending','failed','sent'].includes(item.status));
    if (existing) { rows.push(existing); return; }
    const row = { id:uid(), reportType, orderNumber:order.orderNumber, customerName:order.customer, targetGroup, messageText:reportMessage(reportType, messageOrder), attachmentPath, status:'pending', createdAt:nowIso(), sendingAt:null, sentAt:null, errorMessage:'', retryCount:0 };
    reportOutbox.unshift(row);
    rows.push(row);
    recordAudit('create', 'reportOutbox', row.id, null, row, `إضافة ${reportTypeLabels[reportType] || reportType} إلى قائمة الإرسال`);
    persistAuditLog().catch((error)=>console.warn('audit-save-failed', error));
  });
  save();
  syncOutboxToWhatsappService();
  return rows[0] || null;
}
function refreshQueuedReportRows(reportType, order, attachmentPath = '') {
  const targets = targetGroupsForReport(reportType, order);
  reportOutbox
    .filter((row)=>row.reportType===reportType && row.orderNumber===order.orderNumber && targets.includes(row.targetGroup))
    .forEach((row)=>{
      const dyehouseName = reportType === 'dyeing_production_order' && !order.whatsappDyehouseName
        ? dyehouseNamesForOrder(order).find((name)=>mappedGroupFor(name, whatsappSettings.dyehouseGroups) === row.targetGroup) || ''
        : '';
      const messageOrder = dyehouseName ? { ...order, whatsappDyehouseName:dyehouseName } : order;
      row.attachmentPath = attachmentPath || row.attachmentPath || '';
      row.status = 'pending';
      row.sendingAt = null;
      row.sentAt = null;
      row.errorMessage = '';
      row.retryCount = 0;
      row.messageText = reportMessage(reportType, messageOrder);
    });
}
async function syncOutboxToWhatsappService() {
  try {
    await fetch(`${WHATSAPP_SERVICE_URL}/api/outbox/sync`, { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ outbox:reportOutbox, settings:whatsappSettings }) });
  } catch {}
}
async function pollWhatsappService() {
  ensureRuntimeCollections();
  try {
    const response = await fetch(`${WHATSAPP_SERVICE_URL}/api/status`);
    if (!response.ok) throw new Error('service-offline');
    const data = await response.json();
    whatsappStatus = data.whatsapp || { status:'disconnected', updatedAt:nowIso(), errorMessage:'' };
    if (Array.isArray(data.outbox)) {
      const localById = new Map(reportOutbox.map((item)=>[item.id,item]));
      data.outbox.forEach((remote)=>{ localById.set(remote.id, { ...(localById.get(remote.id) || {}), ...remote }); });
      reportOutbox = [...localById.values()].sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
    }
    save();
    updateWhatsappStatusBadge();
    if (selectedOrderId && refs.orderDetailsPanel?.querySelector('.report-send-status') && !orderDetailsHasActiveDraft()) renderDetails();
  } catch {
    whatsappStatus = { status:'disconnected', updatedAt:nowIso(), errorMessage:'خدمة واتساب غير متصلة حاليًا' };
    updateWhatsappStatusBadge();
  }
}
function reportRowsForOrder(order) {
  ensureRuntimeCollections();
  const types = ['weaving_production_order','dyeing_production_order','dyehouses_report'];
  return types.flatMap((type)=>{
    const targets = targetGroupsForReport(type, order);
    const fallbackTargets = targets.length ? targets : [''];
    return fallbackTargets.map((targetGroup)=>reportOutbox.find((item)=>item.reportType===type && item.orderNumber===order.orderNumber && item.targetGroup===targetGroup) || { reportType:type, targetGroup, status:'pending', sentAt:null, errorMessage:'', retryCount:0 });
  });
}
// LEGACY DOCUMENT FUNCTION - pending cleanup: overridden by the active Arabic renderReportSendStatus implementation.
function renderReportSendStatus(order) {
  const rows = reportRowsForOrder(order).map((row)=>`<tr><td>${escapeHtml(reportTypeLabels[row.reportType] || row.reportType)}</td><td>${escapeHtml(row.targetGroup || '-')}</td><td>${reportTypeIcons[row.status] || ''} ${reportStatusText[row.status] || row.status}</td><td>${row.sentAt ? arDateTime(row.sentAt) : '-'}</td><td>${escapeHtml(row.errorMessage || '-')}</td><td>${row.id && row.status === 'failed' ? `<button class="mini-btn" data-retry-outbox="${row.id}">إعادة المحاولة</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="6">لا توجد تقارير في قائمة الإرسال.</td></tr>';
  return `<section class="report-send-status panel-card"><div class="subsection-head"><div><h3>حالة مشاركة التقارير</h3><p class="eyebrow">المشاركة التلقائية تعمل فقط عند تفعيل واتساب وربط الجروبات.</p></div></div><table><thead><tr><th>التقرير</th><th>الجروب</th><th>الحالة</th><th>وقت الإرسال</th><th>ملاحظات</th><th>إجراء</th></tr></thead><tbody>${rows}</tbody></table></section>`;
}
// LEGACY DOCUMENT FUNCTION - pending cleanup: overridden by the active Arabic whatsappGroupsPromptHint implementation.
async function whatsappGroupsPromptHint() {
  try {
    const response = await fetch(`${WHATSAPP_SERVICE_URL}/api/groups`);
    if (!response.ok) return '';
    const data = await response.json();
    const names = (data.groups || []).map((group)=>group.name).filter(Boolean).slice(0, 20);
    return names.length ? `\n\nالجروبات المتاحة حاليًا:\n${names.join('\n')}\n\nاكتب اسم الجروب كما يظهر هنا.` : '';
  } catch {
    return '';
  }
}
function whatsappSettingsRowHtml(type, label, name = '', group = '') {
  return `<tr data-whatsapp-group-row data-group-type="${escapeHtml(type)}">
    <td><input type="text" data-entity-name value="${escapeHtml(name)}" placeholder="${escapeHtml(label)}"></td>
    <td><input type="text" data-group-name value="${escapeHtml(group)}" placeholder="اسم جروب واتساب"></td>
    <td><button class="mini-btn" type="button" data-delete-group-row>حذف</button></td>
  </tr>`;
}
function whatsappSettingsSectionHtml(type, title, label, map, names) {
  const rowsHtml = whatsappSettingsRows(map, names).map(([name, group])=>whatsappSettingsRowHtml(type, label, name, group)).join('');
  return `<section class="whatsapp-settings-section">
    <div class="subsection-head"><h3>${escapeHtml(title)}</h3><button class="mini-btn" type="button" data-add-whatsapp-group-row="${escapeHtml(type)}" data-row-label="${escapeHtml(label)}">إضافة</button></div>
    <table>
      <thead><tr><th>${escapeHtml(label)}</th><th>اسم جروب واتساب</th><th>إجراء</th></tr></thead>
      <tbody data-whatsapp-group-rows="${escapeHtml(type)}">${rowsHtml}</tbody>
    </table>
  </section>`;
}
function renderWhatsappSettingsDialog(groupNames = []) {
  ensureRuntimeCollections();
  const groupOptions = groupNames.map((name)=>`<option value="${escapeHtml(name)}"></option>`).join('');
  refs.documentTitle.textContent = 'إعدادات واتساب';
  refs.documentBody.dataset.documentType = 'whatsapp-settings';
  refs.documentBody.innerHTML = `<div class="document-sheet whatsapp-settings-sheet">
    <h2>إعدادات واتساب</h2>
    <p class="muted">اربط كل عميل أو مصبغة أو مصدر نسيج بالجروب الصحيح. الإرسال التلقائي لا يعمل إلا عند تفعيله صراحة.</p>
    <div class="summary-grid">
      <label><span>جروب التقارير العامة</span><input type="text" data-general-report-group value="${escapeHtml(whatsappSettings.dyehousesReportGroupName || '')}" placeholder="مثال: تقارير المصابغ"></label>
      <label class="checkbox-row"><input type="checkbox" data-sending-enabled ${whatsappSettings.sendingEnabled ? 'checked' : ''}> <span>تفعيل الإرسال التلقائي عند تشغيل خدمة واتساب</span></label>
    </div>
    ${whatsappSettingsSectionHtml('dyehouse', 'ربط المصابغ بالجروبات', 'اسم المصبغة', whatsappSettings.dyehouseGroups, knownDyehouseNames())}
    ${whatsappSettingsSectionHtml('weaving', 'ربط مصادر النسيج بالجروبات', 'مصدر النسيج', whatsappSettings.weavingGroups, knownWeavingNames())}
    ${whatsappSettingsSectionHtml('customer', 'ربط العملاء بالجروبات', 'اسم العميل', whatsappSettings.customerGroups, knownCustomerNames())}
    <datalist id="whatsappGroupNames">${groupOptions}</datalist>
    <div class="document-actions no-print">
      <button class="primary-btn" type="button" data-save-whatsapp-settings>حفظ الإعدادات</button>
    </div>
  </div>`;
  refs.documentBody.querySelectorAll('[data-group-name]').forEach((input)=>input.setAttribute('list', 'whatsappGroupNames'));
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
async function saveWhatsappSettingsFromDialog() {
  if (!(await ensureBackendForWrite('تعذر الاتصال بقاعدة البيانات. لم يتم حفظ إعدادات واتساب.'))) return;
  const before = clone(whatsappSettings);
  const nextMaps = { dyehouse:{}, weaving:{}, customer:{} };
  refs.documentBody.querySelectorAll('[data-whatsapp-group-row]').forEach((row)=>{
    const type = row.dataset.groupType || 'dyehouse';
    const entity = row.querySelector('[data-entity-name]')?.value.trim() || '';
    const group = row.querySelector('[data-group-name]')?.value.trim() || '';
    if (entity && group && nextMaps[type]) nextMaps[type][entity] = group;
  });
  const nextSettings = {
    ...whatsappSettings,
    dyehousesReportGroupName: refs.documentBody.querySelector('[data-general-report-group]')?.value.trim() || '',
    dyehouseGroups: nextMaps.dyehouse,
    weavingGroups: nextMaps.weaving,
    customerGroups: nextMaps.customer,
    sendingEnabled: !!refs.documentBody.querySelector('[data-sending-enabled]')?.checked,
  };
  const saved = await saveBackendSetting('whatsappSettings', nextSettings);
  if (!saved) {
    await rollbackAfterBackendWriteFailure('تعذر حفظ إعدادات واتساب في قاعدة البيانات. لم يتم اعتماد التعديل.');
    return;
  }
  whatsappSettings = nextSettings;
  recordAudit('update', 'whatsappSettings', 'groups', before, whatsappSettings, 'تحديث إعدادات مجموعات واتساب');
  refreshOutboxTargetsAfterSettings();
  await saveBackendSetting('auditLog', auditLog);
  save();
  syncOutboxToWhatsappService();
  await loadBackendData();
  renderWhatsappSettingsDialog();
  alert(whatsappSettings.sendingEnabled ? 'تم حفظ إعدادات واتساب وتفعيل الإرسال.' : 'تم حفظ إعدادات واتساب مع بقاء الإرسال التلقائي متوقفًا.');
}
function isLegacyRecoveredText(value) {
  const text = String(value || '');
  const legacyText = ['نص','قديم','غير','مستعاد'].join(' ');
  return text.includes(legacyText) || /\uFFFD|ï؟½|\?{3,}/.test(text);
}
function normalizeDyehousePriceLabel(value) {
  return String(value || '')
    .trim()
    .replace(/كسر بياض/g, 'كسترة')
    .replace(/أسود مخصوص/g, 'أسود خاص');
}

function sanitizeDyehousePriceLibrary(source = {}) {
  const clean = {};
  Object.entries(source || {}).forEach(([dyehouse, config]) => {
    if (!dyehouse || isLegacyRecoveredText(dyehouse) || !config || typeof config !== 'object') return;
    if (config.aliasOf && isLegacyRecoveredText(config.aliasOf)) return;
    const dyeing = {};
    Object.entries(config.dyeing || {}).forEach(([material, colors]) => {
      if (!material || isLegacyRecoveredText(material)) return;
      Object.entries(colors || {}).forEach(([color, price]) => {
        const cleanColor = normalizeDyehousePriceLabel(color);
        if (!cleanColor || isLegacyRecoveredText(cleanColor)) return;
        const number = Number(price);
        if (!Number.isFinite(number)) return;
        if (!dyeing[material]) dyeing[material] = {};
        dyeing[material][cleanColor] = number;
      });
    });
    const extras = {};
    Object.entries(config.extras || {}).forEach(([name, price]) => {
      const number = Number(price);
      if (name && !isLegacyRecoveredText(name) && Number.isFinite(number)) extras[name] = number;
    });
    clean[dyehouse] = {
      effectiveFrom: config.effectiveFrom || '',
      accountingMode: config.accountingMode || 'net',
      dyeing,
      printing: config.printing && typeof config.printing === 'object' ? config.printing : {},
      extras,
    };
    if (config.aliasOf) clean[dyehouse].aliasOf = config.aliasOf;
  });
  return clean;
}
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
async function saveDyehousePricesFromDialog() {
  if (!(await ensureBackendForWrite('تعذر الاتصال بقاعدة البيانات. لم يتم حفظ أسعار المصابغ.'))) return;
  const before = clone(customDyehousePriceLibrary || {});
  const next = {};
  refs.documentBody.querySelectorAll('[data-dyehouse-price-row]').forEach((row) => {
    const dyehouse = row.querySelector('[data-price-dyehouse]')?.value.trim() || '';
    const material = row.querySelector('[data-price-material]')?.value.trim() || '';
    const color = normalizeDyehousePriceLabel(row.querySelector('[data-price-color]')?.value || '');
    const rawPrice = row.querySelector('[data-price-value]')?.value;
    if (!dyehouse || isLegacyRecoveredText(dyehouse) || isLegacyRecoveredText(material) || isLegacyRecoveredText(color)) return;
    if (!next[dyehouse]) {
      const existing = customDyehousePriceLibrary?.[dyehouse] || {};
      next[dyehouse] = {
        effectiveFrom: existing.effectiveFrom || '',
        accountingMode: existing.accountingMode || 'net',
        dyeing: {},
        printing: clone(existing.printing || {}),
        extras: clone(existing.extras || {}),
      };
      if (existing.aliasOf) next[dyehouse].aliasOf = existing.aliasOf;
    }
    if (!material || !color || rawPrice === '') return;
    const price = Number(rawPrice);
    if (!Number.isFinite(price)) return;
    if (!next[dyehouse].dyeing[material]) next[dyehouse].dyeing[material] = {};
    next[dyehouse].dyeing[material][color] = price;
  });
  customDyehousePriceLibrary = sanitizeDyehousePriceLibrary(next);
  const saved = await saveDyehousePriceLibrary();
  if (!saved) {
    customDyehousePriceLibrary = before;
    saveDyehousePriceLibraryLocal();
    await rollbackAfterBackendWriteFailure('تعذر حفظ أسعار المصابغ في قاعدة البيانات. لم يتم اعتماد التعديل.');
    return;
  }
  recordAudit('update', 'dyehousePriceLibrary', 'pricing', before, customDyehousePriceLibrary, 'تحديث أسعار المصابغ');
  await saveBackendSetting('auditLog', auditLog);
  await loadBackendData();
  applyPricingDyehouseOptions();
  updateSuggestedDyeCost();
  renderDyehousePricesDialog();
  alert('تم حفظ أسعار المصابغ بنجاح.');
}
function csvCell(value) {
  const text = String(value ?? '').replace(/"/g, '""');
  return `"${text}"`;
}
function downloadTextFile(fileName, content, type = 'text/csv;charset=utf-8') {
  const blob = new Blob(['\ufeff', content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
}
function buildA5ExportRows() {
  const rows = [];
  pricings.filter((pricing)=>!pricing.convertedOrderId).map(calculatePricing).forEach((pricing)=>{
    rows.push({
      type:'عرض سعر',
      number:pricing.pricingNumber,
      date:pricing.pricingDate,
      customer:pricing.customer,
      item:pricing.fabricType,
      quantity:pricing.quantity,
      unitPrice:pricing.sellPrice,
      total:pricing.totalOffer,
      paymentTerms:pricing.paymentTerms,
      source:'2B Tex - التسعير',
      notes:pricing.notes || '',
    });
  });
  orders.map(calculateOrder).forEach((order)=>{
    const deliveredQuantity = Number(order.totalDeliveredToCustomer || 0);
    const contractQuantity = Number(order.totalRawQuantity || order.totalRawOrdered || 0);
    const quantity = deliveredQuantity || contractQuantity;
    const unitPrice = Number(order.kiloPrice || 0);
    rows.push({
      type: deliveredQuantity ? 'فاتورة تسليم عميل' : 'طلب تشغيل',
      number: order.orderNumber,
      date: order.orderDate,
      customer: order.customer,
      item: order.fabricType,
      quantity,
      unitPrice,
      total: roundNumber(quantity * unitPrice),
      paymentTerms: order.paymentTerms,
      source:'2B Tex - المتابعة',
      notes: order.notes || '',
    });
  });
  return rows;
}
function exportA5AccountingCsv() {
  const headers = ['نوع الحركة','رقم المستند','التاريخ','العميل','البند','الكمية','سعر الوحدة','الإجمالي','شروط السداد','المصدر','ملاحظات'];
  const rows = buildA5ExportRows();
  const body = rows.map((row)=>[
    row.type,
    row.number,
    row.date,
    row.customer,
    row.item,
    row.quantity,
    row.unitPrice,
    row.total,
    row.paymentTerms,
    row.source,
    row.notes,
  ].map(csvCell).join(',')).join('\r\n');
  const fileName = `2B-A5-export-${new Date().toISOString().slice(0,10)}.csv`;
  downloadTextFile(fileName, `${headers.map(csvCell).join(',')}\r\n${body}`);
  alert(`تم تجهيز ملف A5 بعدد ${rows.length} حركة. افتح الملف في Excel ثم راجعه قبل رفعه إلى A5.`);
}
function renderA5ExportDialog() {
  const rows = buildA5ExportRows();
  const preview = rows.slice(0, 20).map((row)=>`<tr><td>${row.type}</td><td>${row.number}</td><td>${row.date || '-'}</td><td>${row.customer || '-'}</td><td>${row.item || '-'}</td><td>${formatNumber(row.quantity || 0)}</td><td>${formatNumber(row.total || 0)}</td></tr>`).join('');
  refs.documentTitle.textContent = 'تصدير حركات A5';
  refs.documentBody.dataset.documentType = 'a5-export';
  refs.documentBody.innerHTML = `<div class="document-sheet">
    <h2>تصدير حركات A5</h2>
    <p class="muted">هذه شاشة تجهيز ملف CSV للقراءة والمراجعة قبل الرفع إلى برنامج A5. لا يتم تعديل أرصدة A5 من داخل نظام المتابعة.</p>
    <div class="document-actions no-print"><button class="primary-btn" type="button" data-export-a5-csv>تحميل ملف A5 CSV</button></div>
    <table><thead><tr><th>النوع</th><th>رقم المستند</th><th>التاريخ</th><th>العميل</th><th>البند</th><th>الكمية</th><th>الإجمالي</th></tr></thead><tbody>${preview || '<tr><td colspan="7">لا توجد حركات جاهزة للتصدير.</td></tr>'}</tbody></table>
  </div>`;
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
function ensureCustomerAccount(customerName) {
  const name = String(customerName || '').trim();
  if (!name) return null;
  if (!customerAccounts[name] || typeof customerAccounts[name] !== 'object' || Array.isArray(customerAccounts[name])) {
    customerAccounts[name] = { openingBalance:0, payments:[] };
  }
  if (!Array.isArray(customerAccounts[name].payments)) customerAccounts[name].payments = [];
  customerAccounts[name].openingBalance = Number(customerAccounts[name].openingBalance || 0);
  return customerAccounts[name];
}
function customerAccountInvoices(customerName) {
  const name = String(customerName || '').trim();
  return orders
    .filter((order)=>String(order.customer || '').trim() === name)
    .map(calculateOrder)
    .map((order)=>{
      const deliveredQuantity = Number(order.totalDeliveredToCustomer || 0);
      const contractQuantity = Number(order.totalRawQuantity || order.totalRawOrdered || 0);
      const invoiceQuantity = deliveredQuantity || (order.operationClosed ? contractQuantity : 0);
      const unitPrice = Number(order.kiloPrice || 0);
      return {
        id: order.id,
        orderNumber: order.orderNumber,
        date: order.orderDate,
        item: order.fabricType,
        quantity: invoiceQuantity,
        unitPrice,
        amount: roundNumber(invoiceQuantity * unitPrice),
        status: deliveredQuantity ? 'تم التسليم' : (order.operationClosed ? 'مغلق بدون تسليم' : 'تحت التشغيل'),
      };
    });
}
function customerAccountSummary(customerName) {
  const account = ensureCustomerAccount(customerName) || { openingBalance:0, payments:[] };
  const invoices = customerAccountInvoices(customerName);
  const invoiceTotal = roundNumber(invoices.reduce((total, item)=>total + Number(item.amount || 0), 0));
  const paymentTotal = roundNumber((account.payments || []).reduce((total, item)=>total + Number(item.amount || 0), 0));
  const balance = roundNumber(Number(account.openingBalance || 0) + invoiceTotal - paymentTotal);
  return { customerName, openingBalance:Number(account.openingBalance || 0), invoices, invoiceTotal, payments:account.payments || [], paymentTotal, balance };
}
function knownAccountCustomers() {
  return uniqueNonEmpty([...orders.map((order)=>order.customer), ...pricings.map((pricing)=>pricing.customer), ...Object.keys(customerAccounts || {})]);
}
function renderCustomerAccountsDialog() {
  ensureRuntimeCollections();
  knownAccountCustomers().forEach(ensureCustomerAccount);
  const rows = knownAccountCustomers().map(customerAccountSummary).map((item)=>`<tr><td>${escapeHtml(item.customerName)}</td><td>${formatNumber(item.openingBalance)}</td><td>${formatNumber(item.invoiceTotal)}</td><td>${formatNumber(item.paymentTotal)}</td><td>${formatNumber(item.balance)}</td><td><button class="mini-btn" type="button" data-customer-ledger="${escapeHtml(item.customerName)}">عرض الحساب</button></td></tr>`).join('');
  refs.documentTitle.textContent = 'حسابات العملاء';
  refs.documentBody.dataset.documentType = 'customer-accounts';
  refs.documentBody.innerHTML = `<div class="document-sheet">
    <h2>حسابات العملاء</h2>
    <p class="muted">الرصيد الحالي = الرصيد الافتتاحي + مستحقات الطلبات - المدفوعات. هذه القراءة داخل نظام المتابعة فقط ولا تعدل أرصدة A5.</p>
    <table><thead><tr><th>العميل</th><th>رصيد افتتاحي</th><th>مبيعات / مستحقات</th><th>مدفوعات</th><th>الرصيد الحالي</th><th>إجراء</th></tr></thead><tbody>${rows || '<tr><td colspan="6">لا توجد حسابات عملاء متاحة.</td></tr>'}</tbody></table>
  </div>`;
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
function renderCustomerLedgerDialog(customerName) {
  const summary = customerAccountSummary(customerName);
  const invoiceRows = summary.invoices.map((item)=>`<tr><td>${item.orderNumber || '-'}</td><td>${item.date || '-'}</td><td>${item.item || '-'}</td><td>${formatNumber(item.quantity)}</td><td>${formatNumber(item.unitPrice)}</td><td>${formatNumber(item.amount)}</td><td>${item.status}</td></tr>`).join('');
  const paymentRows = summary.payments.map((item)=>`<tr><td>${item.date || '-'}</td><td>${formatNumber(item.amount)}</td><td>${item.method || '-'}</td><td>${item.notes || '-'}</td><td><button class="mini-btn danger" type="button" data-delete-customer-payment="${item.id}" data-customer-name="${escapeHtml(summary.customerName)}">حذف</button></td></tr>`).join('');
  refs.documentTitle.textContent = `كشف حساب العميل ${summary.customerName}`;
  refs.documentBody.dataset.documentType = 'customer-ledger';
  refs.documentBody.innerHTML = `<div class="document-sheet">
    <div class="subsection-head"><h2>كشف حساب العميل ${escapeHtml(summary.customerName)}</h2><button class="mini-btn" type="button" data-back-customer-accounts>رجوع</button></div>
    <div class="summary-grid">
      <div class="metric"><span>رصيد افتتاحي</span><strong>${formatNumber(summary.openingBalance)}</strong></div>
      <div class="metric"><span>مبيعات / مستحقات</span><strong>${formatNumber(summary.invoiceTotal)}</strong></div>
      <div class="metric"><span>مدفوعات</span><strong>${formatNumber(summary.paymentTotal)}</strong></div>
      <div class="metric emphasis"><span>الرصيد الحالي</span><strong>${formatNumber(summary.balance)}</strong></div>
    </div>
    <section class="report-section">
      <h3>تعديل الرصيد الافتتاحي</h3>
      <div class="summary-grid"><label><span>الرصيد الافتتاحي</span><input type="number" step="0.01" data-opening-balance value="${summary.openingBalance}"></label><button class="primary-btn" type="button" data-save-opening-balance="${escapeHtml(summary.customerName)}">حفظ الرصيد</button></div>
    </section>
    <section class="report-section">
      <h3>إضافة دفعة</h3>
      <div class="summary-grid"><input type="date" data-payment-date value="${new Date().toISOString().slice(0,10)}"><input type="number" step="0.01" data-payment-amount placeholder="المبلغ"><input data-payment-method placeholder="طريقة الدفع"><input data-payment-notes placeholder="ملاحظات"><button class="primary-btn" type="button" data-add-customer-payment="${escapeHtml(summary.customerName)}">إضافة دفعة</button></div>
    </section>
    <section class="report-section"><h3>فواتير الطلبات</h3><table><thead><tr><th>رقم الطلب</th><th>التاريخ</th><th>البند</th><th>الكمية</th><th>سعر الوحدة</th><th>الإجمالي</th><th>الحالة</th></tr></thead><tbody>${invoiceRows || '<tr><td colspan="7">لا توجد فواتير مسجلة لهذا العميل.</td></tr>'}</tbody></table></section>
    <section class="report-section"><h3>المدفوعات</h3><table><thead><tr><th>التاريخ</th><th>المبلغ</th><th>طريقة الدفع</th><th>ملاحظات</th><th>إجراء</th></tr></thead><tbody>${paymentRows || '<tr><td colspan="5">لا توجد مدفوعات مسجلة لهذا العميل.</td></tr>'}</tbody></table></section>
  </div>`;
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
async function saveCustomerOpeningBalance(customerName) {
  const account = ensureCustomerAccount(customerName);
  if (!account) return;
  if (!(await ensureBackendForWrite('تعذر الاتصال بقاعدة البيانات. لم يتم حفظ حساب العميل.'))) return;
  const before = clone(account);
  const nextAccounts = clone(customerAccounts);
  nextAccounts[customerName] = { ...(nextAccounts[customerName] || { payments:[] }), openingBalance:Number(refs.documentBody.querySelector('[data-opening-balance]')?.value || 0) };
  const saved = await saveBackendSetting('customerAccounts', nextAccounts);
  if (!saved) {
    await rollbackAfterBackendWriteFailure('تعذر حفظ حساب العميل في قاعدة البيانات. لم يتم اعتماد التعديل.');
    return;
  }
  customerAccounts = nextAccounts;
  recordAudit('update', 'customerAccount', customerName, before, customerAccounts[customerName], `تعديل الرصيد الافتتاحي للعميل ${customerName}`);
  await saveBackendSetting('auditLog', auditLog);
  await loadBackendData();
  renderCustomerLedgerDialog(customerName);
}
async function addCustomerPayment(customerName) {
  const account = ensureCustomerAccount(customerName);
  if (!account) return;
  const amount = Number(refs.documentBody.querySelector('[data-payment-amount]')?.value || 0);
  if (!amount) { alert('أدخل مبلغ الدفعة قبل الحفظ.'); return; }
  if (!(await ensureBackendForWrite('تعذر الاتصال بقاعدة البيانات. لم يتم حفظ الدفعة.'))) return;
  const payment = { id:uid(), date:refs.documentBody.querySelector('[data-payment-date]')?.value || new Date().toISOString().slice(0,10), amount, method:refs.documentBody.querySelector('[data-payment-method]')?.value || '', notes:refs.documentBody.querySelector('[data-payment-notes]')?.value || '' };
  const before = clone(account);
  const nextAccounts = clone(customerAccounts);
  const nextAccount = { ...(nextAccounts[customerName] || { openingBalance:0, payments:[] }) };
  nextAccount.payments = [payment, ...(nextAccount.payments || [])];
  nextAccounts[customerName] = nextAccount;
  const saved = await saveBackendSetting('customerAccounts', nextAccounts);
  if (!saved) {
    await rollbackAfterBackendWriteFailure('تعذر حفظ دفعة العميل في قاعدة البيانات. لم يتم اعتماد الدفعة.');
    return;
  }
  customerAccounts = nextAccounts;
  recordAudit('create', 'customerPayment', payment.id, before, nextAccount, `إضافة دفعة للعميل ${customerName}`);
  await saveBackendSetting('auditLog', auditLog);
  await loadBackendData();
  renderCustomerLedgerDialog(customerName);
}
async function deleteCustomerPayment(customerName, paymentId) {
  const account = ensureCustomerAccount(customerName);
  if (!account) return;
  if (!(await ensureBackendForWrite('تعذر الاتصال بقاعدة البيانات. لم يتم حذف الدفعة.'))) return;
  const before = clone(account);
  const nextAccounts = clone(customerAccounts);
  const nextAccount = { ...(nextAccounts[customerName] || { openingBalance:0, payments:[] }) };
  nextAccount.payments = (nextAccount.payments || []).filter((payment)=>payment.id !== paymentId);
  nextAccounts[customerName] = nextAccount;
  const saved = await saveBackendSetting('customerAccounts', nextAccounts);
  if (!saved) {
    await rollbackAfterBackendWriteFailure('تعذر حذف دفعة العميل من قاعدة البيانات. لم يتم اعتماد الحذف.');
    return;
  }
  customerAccounts = nextAccounts;
  recordAudit('delete', 'customerPayment', paymentId, before, nextAccount, `حذف دفعة للعميل ${customerName}`);
  await saveBackendSetting('auditLog', auditLog);
  await loadBackendData();
  renderCustomerLedgerDialog(customerName);
}
function refreshOutboxTargetsAfterSettings() {
  let changed = false;
  reportOutbox.forEach((row)=>{
    const sourceOrder = orders.find((order)=>order.orderNumber === row.orderNumber);
    const calculatedOrder = sourceOrder ? calculateOrder(sourceOrder) : null;
    const targets = targetGroupsForReport(row.reportType, calculatedOrder);
    const nextTarget = targets.includes(row.targetGroup) ? row.targetGroup : targets[0];
    if (!nextTarget && reportNeedsManualWhatsappGroup(row.reportType) && row.targetGroup) {
      row.targetGroup = '';
      row.status = 'failed';
      row.errorMessage = 'لم يتم تحديد جروب واتساب لهذا التقرير.';
      row.sendingAt = null;
      changed = true;
      return;
    }
    if (nextTarget && row.targetGroup !== nextTarget) {
      row.targetGroup = nextTarget;
      changed = true;
    }
    if (nextTarget && row.status === 'failed' && isLegacyRecoveredText(row.errorMessage)) {
      row.status = 'pending';
      row.retryCount = 0;
      row.errorMessage = '';
      row.sendingAt = null;
      changed = true;
    }
  });
  if (changed) save();
}
async function openWhatsappSettingsDialog() {
  renderWhatsappSettingsDialog(await fetchWhatsappGroupNames());
}
function trackingCustomerSummary(customerName) {
  const wanted = normalizeForCompare(customerName);
  const relatedOrders = orders.map(calculateOrder).filter((order)=>normalizeForCompare(order.customer) === wanted);
  const activeOrders = relatedOrders.filter((order)=>!order.operationClosed && !['delivered','cancelled'].includes(order.status));
  const deliveredQuantity = roundNumber(relatedOrders.reduce((total, order)=>total + Number(order.totalDeliveredToCustomer || 0), 0));
  const pendingValue = roundNumber(activeOrders.reduce((total, order)=>{
    const quantity = Number(order.totalRawQuantity || order.totalRawOrdered || 0);
    return total + (quantity * Number(order.kiloPrice || 0));
  }, 0));
  const lastOrder = relatedOrders.slice().sort((a,b)=>String(b.orderDate || '').localeCompare(String(a.orderDate || '')))[0];
  return { ordersCount:relatedOrders.length, activeOrdersCount:activeOrders.length, deliveredQuantity, pendingValue, lastOrderNumber:lastOrder?.orderNumber || '' };
}
async function fetchA5Customers() {
  const response = await fetch(`${A5_SERVICE_URL}/api/a5/customers`, { cache:'no-store' });
  if (!response.ok) throw new Error('a5-offline');
  const data = await response.json();
  if (!data.ok || !Array.isArray(data.customers)) throw new Error(data.message || 'a5-invalid');
  return data.customers;
}
async function fetchA5CustomerLedger(customerName) {
  const response = await fetch(`${A5_SERVICE_URL}/api/a5/customer-ledger?customerName=${encodeURIComponent(customerName)}`, { cache:'no-store' });
  if (!response.ok) throw new Error('a5-offline');
  const data = await response.json();
  if (!data.ok || !Array.isArray(data.movements)) throw new Error(data.message || 'a5-invalid');
  return data.movements;
}
function formatA5Date(value) {
  if (!value) return '-';
  const match = String(value).match(/\/Date\((\d+)\)\//);
  const date = match ? new Date(Number(match[1])) : new Date(value);
  return isNaN(date.getTime()) ? String(value) : date.toLocaleDateString('ar-EG');
}
async function renderA5AccountsDialog() {
  refs.documentTitle.textContent = 'حسابات A5';
  refs.documentBody.dataset.documentType = 'a5-accounts';
  refs.documentBody.innerHTML = `<div class="document-sheet">
    <div class="subsection-head"><div><h2>حسابات A5</h2><p class="muted">قراءة أرصدة العملاء من برنامج الحسابات A5 بدون تعديل أي بيانات مالية.</p></div></div>
    <p class="muted">جاري تحميل بيانات العملاء من خدمة A5...</p>
  </div>`;
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
  try {
    const customers = await fetchA5Customers();
    const rows = customers.map((customer)=>{
      const tracking = trackingCustomerSummary(customer.customerName);
      const balance = Number(customer.balance || 0);
      const balanceClass = balance > 0 ? 'danger-text' : (balance < 0 ? 'success-text' : '');
      return `<tr>
        <td>${escapeHtml(customer.customerName || '-')}</td>
        <td>${escapeHtml(customer.areaName || '-')}</td>
        <td class="${balanceClass}"><strong>${formatNumber(balance)}</strong></td>
        <td>${formatNumber(customer.totalDebit || 0)}</td>
        <td>${formatNumber(customer.totalCredit || 0)}</td>
        <td>${customer.movementCount || 0}</td>
        <td>${tracking.ordersCount}</td>
        <td>${tracking.activeOrdersCount}</td>
        <td>${formatNumber(tracking.deliveredQuantity)}</td>
        <td>${tracking.lastOrderNumber || '-'}</td>
        <td><button class="mini-btn" type="button" data-a5-ledger="${escapeHtml(customer.customerName || '')}">عرض الحساب</button></td>
      </tr>`;
    }).join('');
    refs.documentBody.innerHTML = `<div class="document-sheet">
      <div class="subsection-head"><div><h2>حسابات A5</h2><p class="muted">بيانات قراءة فقط من A5 مع ربطها بطلبات نظام المتابعة.</p></div><button class="mini-btn no-print" type="button" data-refresh-a5-accounts>تحديث</button></div>
      <table><thead><tr><th>العميل</th><th>المنطقة</th><th>رصيد A5</th><th>إجمالي مدين</th><th>إجمالي دائن</th><th>عدد الحركات</th><th>طلبات المتابعة</th><th>تحت التشغيل</th><th>كمية مسلمة</th><th>آخر طلب</th><th>إجراء</th></tr></thead><tbody>${rows || '<tr><td colspan="11">لا توجد بيانات عملاء متاحة من A5.</td></tr>'}</tbody></table>
    </div>`;
  } catch (error) {
    refs.documentBody.innerHTML = `<div class="document-sheet">
      <h2>حسابات A5</h2>
      <div class="notice warning">خدمة A5 غير متاحة حاليًا. شغّل ملف "تشغيل خدمة A5.bat" ثم حاول مرة أخرى.</div>
      <div class="document-actions no-print"><button class="primary-btn" type="button" data-refresh-a5-accounts>إعادة المحاولة</button></div>
    </div>`;
  }
}
async function renderA5LedgerDialog(customerName) {
  const name = String(customerName || '').trim();
  refs.documentTitle.textContent = `كشف حساب A5 - ${name}`;
  refs.documentBody.dataset.documentType = 'a5-ledger';
  refs.documentBody.innerHTML = `<div class="document-sheet">
    <div class="subsection-head"><div><h2>كشف حساب A5</h2><p class="muted">${escapeHtml(name)} - بيانات قراءة فقط من A5.</p></div><button class="mini-btn no-print" type="button" data-back-a5-accounts>رجوع</button></div>
    <p class="muted">جاري تحميل حركات الحساب...</p>
  </div>`;
  try {
    const movements = await fetchA5CustomerLedger(name);
    const tracking = trackingCustomerSummary(name);
    const totals = movements.reduce((acc, item)=>{
      acc.debit += Number(item.debit || 0);
      acc.credit += Number(item.credit || 0);
      return acc;
    }, { debit:0, credit:0 });
    const currentBalance = movements.length ? Number(movements[0].afterBalance || 0) : 0;
    const rows = movements.map((item)=>`<tr>
      <td>${formatA5Date(item.movementDate)}</td>
      <td>${escapeHtml(item.movementType || '-')}</td>
      <td>${escapeHtml(item.description || '-')}</td>
      <td>${formatNumber(item.beforeBalance || 0)}</td>
      <td>${formatNumber(item.debit || 0)}</td>
      <td>${formatNumber(item.credit || 0)}</td>
      <td><strong>${formatNumber(item.afterBalance || 0)}</strong></td>
      <td>${item.orderRef || item.orderBookRef || '-'}</td>
    </tr>`).join('');
    refs.documentBody.innerHTML = `<div class="document-sheet">
      <div class="subsection-head"><div><h2>كشف حساب A5 - ${escapeHtml(name)}</h2><p class="muted">حركات العميل في A5 مع ملخص طلباته داخل نظام المتابعة.</p></div><button class="mini-btn no-print" type="button" data-back-a5-accounts>رجوع</button></div>
      <div class="summary-grid">
        <div class="metric"><span>رصيد العميل</span><strong>${formatNumber(currentBalance)}</strong></div>
        <div class="metric"><span>إجمالي مدين</span><strong>${formatNumber(totals.debit)}</strong></div>
        <div class="metric"><span>إجمالي دائن</span><strong>${formatNumber(totals.credit)}</strong></div>
        <div class="metric"><span>عدد الحركات</span><strong>${movements.length}</strong></div>
        <div class="metric"><span>طلبات المتابعة</span><strong>${tracking.ordersCount}</strong></div>
        <div class="metric"><span>تحت التشغيل</span><strong>${tracking.activeOrdersCount}</strong></div>
      </div>
      <table><thead><tr><th>التاريخ</th><th>نوع الحركة</th><th>البيان</th><th>رصيد قبل</th><th>مدين</th><th>دائن</th><th>رصيد بعد</th><th>مرجع الطلب</th></tr></thead><tbody>${rows || '<tr><td colspan="8">لا توجد حركات متاحة لهذا العميل في A5.</td></tr>'}</tbody></table>
    </div>`;
  } catch (error) {
    refs.documentBody.innerHTML = `<div class="document-sheet">
      <div class="subsection-head"><h2>كشف حساب A5</h2><button class="mini-btn no-print" type="button" data-back-a5-accounts>رجوع</button></div>
      <div class="notice warning">تعذر تحميل كشف الحساب من A5. تأكد أن خدمة A5 تعمل ثم حاول مرة أخرى.</div>
    </div>`;
  }
}
function openAuditLogDialog() {
  ensureRuntimeCollections();
  const actionLabels = { create:'إنشاء', update:'تعديل', delete:'حذف', retry:'إعادة محاولة', error:'خطأ' };
  const entityLabels = { order:'طلب', pricing:'تسعيرة', allocation:'لون', orderDetails:'تفاصيل طلب', reportOutbox:'قائمة الإرسال', whatsappSettings:'إعدادات واتساب', dyehousePriceLibrary:'أسعار المصابغ', customerAccount:'حساب عميل', customerPayment:'دفعة عميل' };
  const cleanAuditNote = (item) => {
    const text = String(item?.note || '').trim();
    if (text && !isLegacyRecoveredText(text)) return text;
    const number = String(text || item?.entityId || '').match(/\d+/)?.[0] || String(item?.entityId || '').trim();
    const entity = entityLabels[item?.entityType] || item?.entityType || 'بيان';
    const action = actionLabels[item?.action] || item?.action || 'تحديث';
    return `${action} ${entity}${number ? ` رقم ${number}` : ''}`;
  };
  const rows = auditLog.slice(0,200).map((item)=>`<tr><td>${escapeHtml(arDateTime(item.createdAt))}</td><td>${escapeHtml(actionLabels[item.action] || item.action || '-')}</td><td>${escapeHtml(entityLabels[item.entityType] || item.entityType || '-')}</td><td>${escapeHtml(cleanAuditNote(item))}</td></tr>`).join('') || '<tr><td colspan="4">لا توجد تعديلات مسجلة حتى الآن.</td></tr>';
  refs.documentTitle.textContent = 'سجل التعديلات';
  refs.documentBody.dataset.documentType = 'audit-log';
  refs.documentBody.innerHTML = `<div class="document-sheet orders-follow-report"><div class="report-title"><h2>سجل التعديلات</h2><span>آخر العمليات والتعديلات المسجلة داخل النظام.</span></div><section class="report-section"><h3>تفاصيل السجل</h3><table class="follow-table"><thead><tr><th>التاريخ</th><th>الإجراء</th><th>نوع البيان</th><th>الملاحظة</th></tr></thead><tbody>${rows}</tbody></table></section></div>`;
  if (refs.documentDialog.open) refs.documentDialog.close(); refs.documentDialog.showModal();
}
function openOutboxDialog() {
  ensureRuntimeCollections();
  const brokenText = isLegacyRecoveredText;
  const cellText = (value, fallback = '-') => {
    const text = String(value ?? '').trim();
    return escapeHtml(!text || brokenText(text) ? fallback : text);
  };
  const rows = reportOutbox.map((item)=>{
    const reportName = reportTypeLabels[item.reportType] || item.reportType || 'تقرير';
    const status = `${reportTypeIcons[item.status] || ''} ${reportStatusText[item.status] || item.status || '-'}`.trim();
    const errorText = brokenText(item.errorMessage) ? 'رسالة قديمة غير قابلة للعرض' : (item.errorMessage || '-');
    const action = item.status === 'failed' ? `<button class="mini-btn" data-retry-outbox="${item.id}">إعادة المحاولة</button>` : '';
    return `<tr><td>${cellText(reportName, 'تقرير')}</td><td>${cellText(item.orderNumber, '-')}</td><td>${cellText(item.targetGroup, 'غير محدد')}</td><td>${escapeHtml(status)}</td><td>${cellText(errorText, '-')}</td><td>${action}</td></tr>`;
  }).join('') || '<tr><td colspan="6">لا توجد تقارير في قائمة الإرسال.</td></tr>';
  refs.documentTitle.textContent = 'قائمة إرسال واتساب';
  refs.documentBody.dataset.documentType = 'outbox';
  refs.documentBody.innerHTML = `<div class="document-sheet"><h2>قائمة إرسال واتساب</h2><p class="muted">حالة التقارير التي تنتظر الإرسال أو تم إرسالها من خدمة واتساب.</p><table><thead><tr><th>التقرير</th><th>رقم الطلب</th><th>الجروب</th><th>الحالة</th><th>ملاحظات</th><th>إجراء</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
async function openSystemStatusDialog() {
  refs.documentTitle.textContent = 'حالة تشغيل النظام';
  refs.documentBody.dataset.documentType = 'system-status';
  refs.documentBody.innerHTML = '<div class="document-sheet"><h2>حالة تشغيل النظام</h2><p>جاري فحص الخدمات...</p></div>';
  refs.documentDialog.showModal();
  try {
    const status = await fetch('/system/status', { cache: 'no-store' }).then((response)=>response.json());
    const cloudflareUrl = status.cloudflare?.url || 'لا يوجد رابط مسجل حاليًا';
    const row = (label, value, ok) => `<tr><td>${label}</td><td><span class="status ${ok ? 'completed' : 'failed'}">${ok ? 'يعمل' : 'متوقف'}</span></td><td>${escapeHtml(value || '-')}</td></tr>`;
    refs.documentBody.innerHTML = `<div class="document-sheet">
      <h2>حالة تشغيل النظام</h2>
      <table>
        <thead><tr><th>البند</th><th>الحالة</th><th>التفاصيل</th></tr></thead>
        <tbody>
          ${row('Frontend', `Port ${status.frontend?.port || 3000}`, status.frontend?.ok)}
          ${row('Backend', `Port ${status.backend?.port || 3050}`, status.backend?.ok)}
          ${row('Cloudflare', cloudflareUrl, status.cloudflare?.ok)}
          ${row('Backup', status.backup?.latest?.path || 'لا يوجد Backup معروف', status.backup?.ok)}
        </tbody>
      </table>
      <p><strong>رابط Cloudflare الحالي:</strong> ${cloudflareUrl.startsWith('https://') ? `<a href="${escapeHtml(cloudflareUrl)}" target="_blank" rel="noopener">${escapeHtml(cloudflareUrl)}</a>` : escapeHtml(cloudflareUrl)}</p>
    </div>`;
  } catch {
    refs.documentBody.innerHTML = '<div class="document-sheet"><h2>حالة تشغيل النظام</h2><p>تعذر قراءة حالة النظام حاليًا.</p></div>';
  }
}
function installAutomationUi() {
  const actionBar = document.querySelector('.hero-actions') || document.querySelector('header') || document.body;
  if (!document.getElementById('whatsappStatusBadge')) {
    actionBar.insertAdjacentHTML('beforeend', `<button class="mini-btn connection-badge is-down" id="backendStatusBadge" type="button"><span class="connection-dot"></span><span data-connection-text>قاعدة البيانات: غير متصل</span></button><button class="mini-btn connection-badge is-down" id="whatsappStatusBadge" type="button"><span class="connection-dot"></span><span data-connection-text>واتساب: غير متصل</span></button><button class="mini-btn" id="systemStatusBtn" type="button">حالة النظام</button><button class="mini-btn" id="syncLocalStorageBtn" type="button">مزامنة البيانات</button><button class="mini-btn" id="whatsappSettingsBtn" type="button">إعدادات واتساب</button><button class="mini-btn" id="dyehousePricesBtn" type="button">أسعار المصابغ</button><button class="mini-btn" id="a5AccountsBtn" type="button">حسابات A5</button><button class="mini-btn" id="outboxBtn" type="button">قائمة الإرسال</button><button class="mini-btn" id="auditLogBtn" type="button">سجل التعديلات</button>`);
  }
  document.getElementById('backendStatusBadge')?.addEventListener('click', pollBackendStatus);
  document.getElementById('whatsappStatusBadge')?.addEventListener('click', pollWhatsappService);
  document.getElementById('systemStatusBtn')?.addEventListener('click', openSystemStatusDialog);
  document.getElementById('syncLocalStorageBtn')?.addEventListener('click', syncLocalStorageToBackend);
  document.getElementById('whatsappSettingsBtn')?.addEventListener('click', openWhatsappSettingsDialog);
  document.getElementById('dyehousePricesBtn')?.addEventListener('click', renderDyehousePricesDialog);
  document.getElementById('a5AccountsBtn')?.addEventListener('click', renderA5AccountsDialog);
  document.getElementById('outboxBtn')?.addEventListener('click', openOutboxDialog);
  document.getElementById('auditLogBtn')?.addEventListener('click', openAuditLogDialog);
  updateBackendStatusBadge();
  updateWhatsappStatusBadge();
}
async function reportToCanvas(options = {}) {
  const sheet = refs.documentBody.querySelector('.document-sheet');
  if (!sheet || !window.html2canvas) throw new Error('no-sheet');
  const renderTarget = async (target) => {
    const targetHeight = Math.max(target.scrollHeight || target.offsetHeight || 1, 1);
    const scale = options.scale || Math.max(0.8, Math.min(2, 14000 / targetHeight));
    return await html2canvas(target, {
      backgroundColor: '#ffffff',
      scale,
      useCORS: true,
      allowTaint: true,
      imageTimeout: 0,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: Math.max(target.scrollWidth || target.offsetWidth || 1100, 1100),
      ignoreElements: (element)=>element.classList?.contains('no-print'),
      onclone: (clonedDoc)=>clonedDoc.querySelectorAll('.document-brand-logo img').forEach((img)=>img.remove()),
    });
  };
  try {
    return await renderTarget(sheet);
  } catch (error) {
    const cloneWrap = document.createElement('div');
    cloneWrap.style.cssText = 'position:absolute;left:-20000px;top:0;width:1100px;background:#fff;pointer-events:none;';
    cloneWrap.appendChild(sheet.cloneNode(true));
    document.body.appendChild(cloneWrap);
    try { return await renderTarget(cloneWrap.firstElementChild); }
    finally { cloneWrap.remove(); }
  }
}
function asciiBytes(text) {
  const bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i += 1) bytes[i] = text.charCodeAt(i) & 255;
  return bytes;
}
function concatBytes(parts) {
  const total = parts.reduce((sumBytes, part)=>sumBytes + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  parts.forEach((part)=>{ out.set(part, offset); offset += part.length; });
  return out;
}
function dataUrlToBytes(dataUrl) {
  const binary = atob(String(dataUrl).split(',')[1] || '');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
function buildPdfFromPages(pageCanvases) {
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const objects = [];
  const addObject = (bodyParts) => objects.push(Array.isArray(bodyParts) ? bodyParts : [asciiBytes(bodyParts)]);
  addObject('<< /Type /Catalog /Pages 2 0 R >>');
  const kids = pageCanvases.map((_, index)=>`${3 + index * 3} 0 R`).join(' ');
  addObject(`<< /Type /Pages /Kids [${kids}] /Count ${pageCanvases.length} >>`);
  pageCanvases.forEach((canvas, index)=>{
    const pageObj = 3 + index * 3;
    const imageObj = pageObj + 1;
    const contentObj = pageObj + 2;
    const imageBytes = dataUrlToBytes(canvas.toDataURL('image/jpeg', 0.92));
    const imageRatio = canvas.height / canvas.width;
    const drawWidth = pageWidth;
    const drawHeight = Math.min(pageHeight, pageWidth * imageRatio);
    const drawY = pageHeight - drawHeight;
    const content = `q\n${drawWidth.toFixed(2)} 0 0 ${drawHeight.toFixed(2)} 0 ${drawY.toFixed(2)} cm\n/Im${index + 1} Do\nQ\n`;
    addObject(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im${index + 1} ${imageObj} 0 R >> >> /Contents ${contentObj} 0 R >>`);
    addObject([asciiBytes(`<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`), imageBytes, asciiBytes('\nendstream')]);
    addObject(`<< /Length ${asciiBytes(content).length} >>\nstream\n${content}endstream`);
  });
  const parts = [asciiBytes('%PDF-1.4\n')];
  const offsets = [0];
  objects.forEach((bodyParts, index)=>{
    offsets.push(parts.reduce((sumBytes, part)=>sumBytes + part.length, 0));
    parts.push(asciiBytes(`${index + 1} 0 obj\n`), ...bodyParts, asciiBytes('\nendobj\n'));
  });
  const xrefOffset = parts.reduce((sumBytes, part)=>sumBytes + part.length, 0);
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset)=>{ xref += `${String(offset).padStart(10, '0')} 00000 n \n`; });
  xref += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  parts.push(asciiBytes(xref));
  return new Blob([concatBytes(parts)], { type:'application/pdf' });
}
async function reportToPdfBlob() {
  const canvas = await reportToCanvas();
  const pageHeight = Math.max(1200, Math.round(canvas.width * 1.414));
  const pageCanvases = [];
  for (let top = 0; top < canvas.height; top += pageHeight) {
    const sliceHeight = Math.min(pageHeight, canvas.height - top);
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeight;
    const ctx = pageCanvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    ctx.drawImage(canvas, 0, top, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
    pageCanvases.push(pageCanvas);
  }
  return buildPdfFromPages(pageCanvases);
}
async function uploadCurrentDocumentPdf(reportType, order) {
  const blob = await reportToPdfBlob();
  const dataUrl = await new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('pdf-read-failed'));
    reader.readAsDataURL(blob);
  });
  const customerName = reportType === 'dyeing_production_order' && order.whatsappDyehouseName
    ? `${order.customer || ''}_${order.whatsappDyehouseName}`
    : order.customer;
  const response = await fetch(`${WHATSAPP_SERVICE_URL}/api/reports/upload`, { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ reportType, orderNumber:order.orderNumber, customerName, dataUrl }) });
  if (!response.ok) {
    if (response.status === 413) throw new Error('pdf-too-large');
    throw new Error('upload-failed');
  }
  const data = await response.json();
  return data.attachmentPath || data.path || '';
}
async function getWhatsappServiceStatus() {
  const response = await fetch(`${WHATSAPP_SERVICE_URL}/api/status`);
  if (!response.ok) throw new Error('whatsapp-service-offline');
  return await response.json();
}
function normalizeWhatsappGroupName(value) {
  return String(value || '').replace(/\*/g, '').replace(/[\-\s]+/g, '').trim().toLowerCase();
}

async function ensureWhatsappGroupExists(groupName) {
  const response = await fetch(`${WHATSAPP_SERVICE_URL}/api/groups`);
  if (!response.ok) return;
  const data = await response.json();
  const wanted = normalizeWhatsappGroupName(groupName);
  const groups = data.groups || [];
  const found = groups.some((group)=>{
    const normalizedGroup = normalizeWhatsappGroupName(group.name);
    return normalizedGroup === wanted;
  });
  if (!found) {
    const preview = groups.map((group)=>group.name).slice(0, 12).join('\n');
    const error = new Error('whatsapp-group-not-found');
    error.groupName = groupName;
    error.groupPreview = preview;
    throw error;
  }
}
function queueDocumentReport(type, order) {
  const reportType = ({ weaving:'weaving_production_order', dyeing:'dyeing_production_order', fullreport:'dyehouses_report' })[type];
  if (!reportType || !order) return;
  setTimeout(async()=>{
    try {
      const attachmentPath = await uploadCurrentDocumentPdf(reportType, order);
      const row = enqueueReport(reportType, order, attachmentPath);
      if (row && attachmentPath) { refreshQueuedReportRows(reportType, order, attachmentPath); save(); syncOutboxToWhatsappService(); }
    } catch (error) {
      console.warn('whatsapp-auto-queue-skipped', error);
    }
  }, 350);
}
async function retryOutbox(id) {
  const item = reportOutbox.find((row)=>row.id===id);
  if (!item) return;
  item.status = 'pending';
  item.errorMessage = '';
  item.retryCount = Number(item.retryCount || 0) + 1;
  recordAudit('retry', 'reportOutbox', id, null, item, 'إعادة إرسال التقرير');
  await persistAuditLog();
  save();
  await syncOutboxToWhatsappService();
  openOutboxDialog();
  pollWhatsappService();
}

const cleanCodePart = (value) => String(value || '').trim().replace(/\s+/g, '-');
function buildItemCode(number) {
  const part = cleanCodePart(number);
  return part ? `2B-${part}` : '';
}
function numericPart(value) {
  const match = String(value || '').match(/\d+/g);
  return match ? Number(match[match.length - 1]) : 0;
}
function nextPricingNumber() {
  const maxNumber = Math.max(
    1000,
    ...pricings.map((pricing)=>numericPart(pricing.pricingNumber)),
    ...orders.map((order)=>numericPart(order.orderNumber))
  );
  return String(maxNumber + 1);
}
function orderNumberFromPricing(pricingNumber) {
  const number = numericPart(pricingNumber);
  return number ? String(number) : String(pricingNumber || '');
}
function syncAutoCodes() {
  if (refs.pricingProductCode) refs.pricingProductCode.value = buildItemCode(refs.pricingNumber?.value);
  if (refs.productCode) refs.productCode.value = buildItemCode(refs.orderNumber?.value);
}
let itemCodeMigrationNeeded = false;
orders = orders.map((order) => {
  const productCode = order.productCode || buildItemCode(order.orderNumber);
  if (productCode !== order.productCode) itemCodeMigrationNeeded = true;
  return { ...order, productCode };
});
pricings = pricings.map((pricing) => {
  const productCode = pricing.productCode || buildItemCode(pricing.pricingNumber);
  if (productCode !== pricing.productCode) itemCodeMigrationNeeded = true;
  return { ...pricing, productCode };
});
if (itemCodeMigrationNeeded) save();

const TWO_B_TEX_DYEHOUSE_PRICE_LIBRARY = {
  'جيما': {
    effectiveFrom: '2026-04-15',
    accountingMode: 'net',
    dyeing: {
      'قطن': {
        'غسيل - مفتوح':45, 'غسيل - مقفول':52,
        'أبيض / كسترة - مفتوح':49, 'أبيض / كسترة - مقفول':56,
        'فواتح - مفتوح':65, 'فواتح - مقفول':72,
        'وسط - مفتوح':68, 'وسط - مقفول':75,
        'غوامق - مفتوح':71, 'غوامق - مقفول':78,
        'أسود - مفتوح':72, 'أسود - مقفول':79,
        'أسود خاص - مفتوح':74, 'أسود خاص - مقفول':81,
        'ألوان خاصة - مفتوح':75, 'ألوان خاصة - مقفول':82,
      },
      'بوليستر': {
        'أبيض / كسترة - مفتوح':40, 'أبيض / كسترة - مقفول':47,
        'وسط - مفتوح':41, 'وسط - مقفول':48,
        'غوامق - مفتوح':43, 'غوامق - مقفول':50,
        'أسود - مفتوح':44, 'أسود - مقفول':51,
        'ألوان خاصة - مفتوح':48, 'ألوان خاصة - مقفول':55,
      },
    },
    extras: {
      'كسترة':9,
      'قص براسل':5,
      'حلاقة':2,
      'كربون فينش':3,
      'إنزيم':5,
      'دبل إنزيم':4,
      'سخاوة خاصة':5,
      'شق خام':5,
      'تجهيز خاص نيو جيما':3,
      'تجهيز سقعانه':7,
      'تجهيز بوليفار':7,
      'معالج زيوت':5,
      'معالجة زيوت خاصة':8,
    },
  },
  'نيو جيما': {
    effectiveFrom: '2026-04-15',
    accountingMode: 'net',
    dyeing: {},
    printing: {
      'بيجمنت': {
        'سنجل بدون ليكرا - أقل من 2.5 متر':60,
        'سنجل ليكرا - أقل من 2.5 متر':67,
        'سنجل بدون ليكرا - أقل من 4 متر':70,
        'سنجل ليكرا - أقل من 4 متر':77,
        'سنجل بدون ليكرا - أكبر من 4 متر':77,
        'سنجل ليكرا - أكبر من 4 متر':84,
      },
      'راكتيف': {
        'سنجل بدون ليكرا - أقل من 2.5 متر':75,
        'سنجل ليكرا - أقل من 2.5 متر':82,
        'سنجل بدون ليكرا - أقل من 4 متر':80,
        'سنجل ليكرا - أقل من 4 متر':87,
      },
      'ديسبيرس': {
        'أقل من 2.5 متر':53,
        'أقل من 4 متر':60,
      },
      'شعيرات + كربون نقش': { 'عام':53 },
      'أوفر برنت': { 'عام':16 },
      'فلوريسنت': { 'عام':13 },
      'جليتر': { 'عام':14 },
    },
    extras: {},
  },
};
TWO_B_TEX_DYEHOUSE_PRICE_LIBRARY['نيو جيما'].dyeing = clone(TWO_B_TEX_DYEHOUSE_PRICE_LIBRARY['جيما'].dyeing);
TWO_B_TEX_DYEHOUSE_PRICE_LIBRARY['نيو جيما'].extras = clone(TWO_B_TEX_DYEHOUSE_PRICE_LIBRARY['جيما'].extras);
let customDyehousePriceLibrary = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.dyehousePriceLibrary));
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
})();
function mergeDyehousePriceLibrary() {
  const merged = sanitizeDyehousePriceLibrary(TWO_B_TEX_DYEHOUSE_PRICE_LIBRARY);
  Object.entries(sanitizeDyehousePriceLibrary(customDyehousePriceLibrary || {})).forEach(([dyehouse, config]) => {
    if (!dyehouse || !config || typeof config !== 'object') return;
    const current = merged[dyehouse] || { effectiveFrom:'', dyeing:{}, extras:{} };
    merged[dyehouse] = {
      ...current,
      ...config,
      dyeing: { ...(current.dyeing || {}), ...(config.dyeing || {}) },
      printing: { ...(current.printing || {}), ...(config.printing || {}) },
      extras: { ...(current.extras || {}), ...(config.extras || {}) },
    };
  });
  return merged;
}
function saveDyehousePriceLibraryLocal() {
  localStorage.setItem(STORAGE_KEYS.dyehousePriceLibrary, JSON.stringify(customDyehousePriceLibrary || {}));
}
async function saveDyehousePriceLibrary() {
  customDyehousePriceLibrary = sanitizeDyehousePriceLibrary(customDyehousePriceLibrary || {});
  saveDyehousePriceLibraryLocal();
  if (!backendAvailable) return false;
  try {
    await backendRequest('/settings/dyehousePriceLibrary', {
      method: 'PUT',
      body: JSON.stringify({ value: customDyehousePriceLibrary }),
    });
    return true;
  } catch (error) {
    backendAvailable = false;
    console.warn('Dyehouse price library backend save failed', error);
    return false;
  }
}
function activeDyehousePriceLibrary() {
  return mergeDyehousePriceLibrary();
}
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
const AMAL_FASHION_ORDER_LIBRARY = {};
function cloneAmalSuggestion(item) { return JSON.parse(JSON.stringify(item || {})); }
function getAmalOrderNumberFromFile(file) {
  const name = String(file?.name || '');
  const match = name.match(/(\d{3,6})/);
  return match ? match[1] : '';
}

function getRawIssueSuggestionFromFile() {
  return null;
}

function normalizeDigits(value) {
  return String(value || '').trim()
    .replace(/[\u0660-\u0669]/g, (digit)=>String(digit.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (digit)=>String(digit.charCodeAt(0) - 0x06F0));
}

function noteParts(value) {
  return normalizeDigits(value).split(/[^\d]+/).filter(Boolean);
}
function orderRawNoteCandidates(order) {
  const orderNumber = String(order?.orderNumber || '').trim();
  const pricing = pricingForOrder(order);
  const library = AMAL_FASHION_ORDER_LIBRARY[orderNumber];
  return uniqueNonEmpty([
    library?.rawNoteNumber,
    pricing?.rawNoteNumber,
    ...rawBatches.filter((batch)=>batch.orderId === order?.id).map((batch)=>batch.noteNumber),
  ].flatMap(noteParts));
}
function findOrderForRawIssueSuggestion(suggestion = {}) {
  const byOrderNumber = suggestion.orderNumber
    ? orders.find((order)=>String(order.orderNumber || '').trim() === String(suggestion.orderNumber || '').trim())
    : null;
  if (byOrderNumber) return byOrderNumber;
  const wantedNotes = noteParts(suggestion.rawNoteNumber);
  if (wantedNotes.length) {
    const byNote = orders.find((order)=>{
      const notes = orderRawNoteCandidates(order);
      return wantedNotes.some((note)=>notes.includes(note));
    });
    if (byNote) return byNote;
  }
  const firstFabric = normalizeForCompare((suggestion.rows || []).find((row)=>!isAccessoryRow(row))?.fabricType || '');
  if (firstFabric) {
    return orders.find((order)=>normalizeForCompare(order.fabricType).includes(firstFabric) || firstFabric.includes(normalizeForCompare(order.fabricType)));
  }
  return null;
}
function isAccessoryRow(row) {
  const text = String(row?.fabricType || row?.accessoryType || '').trim();
  return !!row?.accessoryType || /\b(||||||)\b/i.test(text);
}

function calcAccessoryPercentFromRows(rows) {
  const clothTotal = rows.filter((row)=>!isAccessoryRow(row)).reduce((t,row)=>t+Number(row.quantity||0),0);
  const accessoryTotal = rows.filter(isAccessoryRow).reduce((t,row)=>t+Number(row.quantity||0),0);
  return clothTotal && accessoryTotal ? roundNumber(accessoryTotal / clothTotal * 100) : 0;
}
function getSuggestedDyeCost(dyehouse, materialType, colorClass) {
  const librarySource = activeDyehousePriceLibrary();
  const library = librarySource[dyehouse];
  const resolved = library?.aliasOf ? librarySource[library.aliasOf] : library;
  if (!resolved) return '';
  const colorKey = normalizeDyehousePriceLabel(colorClass);
  if (materialType === 'مخلوط') {
    const base = resolved.dyeing?.['قطن']?.[colorKey];
    return base === undefined || base === null || base === '' ? '' : Number(base) + 9;
  }
  return resolved?.dyeing?.[materialType]?.[colorKey] ?? '';
}
function updateSuggestedDyeCost() {
  const suggested = getSuggestedDyeCost(refs.pricingDyehouse.value, refs.pricingMaterialType.value, refs.pricingColorClass.value);
  refs.pricingSuggestedDyeCost.value = suggested;
  if (suggested !== '') refs.pricingDyeCost.value = suggested;
  updatePricingPreview();
}
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
function orderAccessoryConfig(order = {}) {
  const lines = Array.isArray(order.accessoryLines) ? order.accessoryLines : [];
  if (lines.length) return lines.map((line)=>({ id:line.id || uid(), type:line.type || 'إكسسوار', percent:Number(line.percent || 0), quantityManual:line.quantityManual !== undefined ? line.quantityManual : '' })).filter((line)=>line.type || line.percent || line.quantityManual);
  if (order.accessoryType || Number(order.accessoryPercent || 0)) return [{ id:uid(), type:order.accessoryType || 'إكسسوار', percent:Number(order.accessoryPercent || 0), quantityManual:'' }];
  return [];
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
}
const roundNumber = (value, digits = 2) => {
  const number = Number(value || 0);
  return Number(Math.round((number + Number.EPSILON) * 10 ** digits) / 10 ** digits);
};
const formatNumber = (value, digits = 3) => roundNumber(value, digits).toLocaleString('ar-EG', { maximumFractionDigits: digits });
const sum = (items) => roundNumber(items.reduce((total, item) => total + Number(item.quantity || 0), 0));
const getAllocations = (order) => allocations.filter((allocation) => allocation.orderId === order.id);
const statusLabel = (status) => ({ pending:'بانتظار الاستلام', 'in-progress':'قيد التشغيل', completed:'مكتمل', closed:'مغلق تشغيليًا' }[status]);

function normalizeOrderForRuntime(order = {}) {
  const safe = { ...order };
  safe.id = safe.id || uid();
  safe.orderNumber = safe.orderNumber || '';
  safe.productCode = safe.productCode || buildItemCode(safe.orderNumber);
  safe.customer = safe.customer || '';
  safe.orderDate = safe.orderDate || new Date().toISOString().slice(0,10);
  safe.fabricType = safe.fabricType || '';
  safe.totalRawQuantity = Number(safe.totalRawQuantity || safe.totalRawOrdered || 0);
  safe.expectedWastePercent = Number(safe.expectedWastePercent || 0);
  safe.widthMode = safe.widthMode || 'single';
  safe.inchWidth = safe.inchWidth || '';
  safe.widthLines = Array.isArray(safe.widthLines) ? safe.widthLines : [];
  safe.kiloPrice = Number(safe.kiloPrice || 0);
  safe.rawCost = Number(safe.rawCost || safe.rawPrice || orderRawCost(safe) || 0);
  safe.paymentTerms = safe.paymentTerms || '';
  safe.accessoryType = safe.accessoryType || '';
  safe.accessoryPercent = Number(safe.accessoryPercent || 0);
  safe.accessoryLines = orderAccessoryConfig(safe);
  safe.dyehouse = safe.dyehouse || '';
  safe.weavingSource = safe.weavingSource || '';
  safe.notes = safe.notes || '';
  safe.operationNotes = safe.operationNotes && typeof safe.operationNotes === 'object' && !Array.isArray(safe.operationNotes) ? safe.operationNotes : {};
  safe.operationClosed = Boolean(safe.operationClosed);
  return safe;
}
function calculateAllocation(allocation = {}, orderContext = null) {
  const order = orderContext || orders.find((item)=>item.id===allocation.orderId) || {};
  const orderAllocations = getAllocations(order);
  const orderRawSent = sum(rawBatches.filter((batch) => batch.orderId === allocation.orderId));
  const widthRawSent = allocation.widthLineId ? sum(rawBatches.filter((batch) => batch.orderId === allocation.orderId && batch.widthLineId === allocation.widthLineId)) : 0;
  const widthPlanned = allocation.widthLineId ? orderAllocations.filter((item)=>item.widthLineId === allocation.widthLineId).reduce((total, item)=>total + Number(item.plannedQuantity || 0), 0) : 0;
  const totalPlanned = roundNumber(orderAllocations.reduce((total, item)=>total + Number(item.plannedQuantity || 0), 0));
  const basePlanned = Number(allocation.plannedQuantity || 0);
  const proportionalWidthSent = widthPlanned ? widthRawSent * basePlanned / widthPlanned : 0;
  const proportionalOrderSent = totalPlanned ? orderRawSent * basePlanned / totalPlanned : 0;
  const sent = roundNumber(allocation.widthLineId ? proportionalWidthSent : (orderAllocations.length <= 1 ? orderRawSent : proportionalOrderSent));
  const finished = sum(productionBatches.filter((batch) => batch.allocationId === allocation.id));
  const rawReturned = sum(rawReturns.filter((batch) => batch.allocationId === allocation.id));
  const actualBase = sent || Number(allocation.plannedQuantity || 0);
  const actualWaste = order.operationClosed && (sent || finished || rawReturned) ? Math.max(sent - finished - rawReturned, 0) : 0;
  const actualWastePercent = actualBase ? roundNumber(actualWaste / actualBase * 100) : 0;
  const transfers = dyehouseTransfers.filter((batch) => batch.allocationId === allocation.id);
  return { ...allocation, transfers, rawReturned:roundNumber(rawReturned), transferredQuantity:roundNumber(sum(transfers)), sentToDyehouse:roundNumber(sent), finishedReceived:roundNumber(finished), remainingAtDyehouse:roundNumber(Math.max(sent - finished - rawReturned - actualWaste, 0)), actualWasteQuantity:roundNumber(actualWaste), actualWastePercent, wasteQuantity:roundNumber(actualWaste), wastePercent:actualWastePercent };
}
function expectedWasteFor(order, quantity) {
  return roundNumber(Number(quantity || 0) * Number(order.expectedWastePercent || 0) / 100);
}
function allocationAccessoryQuantity(order, allocation) {
  if (allocation.accessoryQuantityManual !== null && allocation.accessoryQuantityManual !== undefined && allocation.accessoryQuantityManual !== '') return roundNumber(Number(allocation.accessoryQuantityManual || 0));
  const lines = orderAccessoryConfig(order);
  const percent = lines.length ? lines.reduce((total, line)=>total + Number(line.percent || 0), 0) : Number(order.accessoryPercent || 0);
  return roundNumber(Number(allocation.plannedQuantity || 0) * percent / 100);
}
function calculateOrder(order) {
  order = normalizeOrderForRuntime(order);
  const expectedWastePercent = Number(order.expectedWastePercent || 0);
  const isClosed = Boolean(order.operationClosed);
  const baseAllocations = getAllocations(order).map((allocation)=>calculateAllocation(allocation, order));
  const singleWidthValue = order.widthMode !== 'multiple' ? baseAllocations.find((item)=>item.targetFinishedWidth)?.targetFinishedWidth : null;
  const singleWeightValue = order.widthMode !== 'multiple' ? baseAllocations.find((item)=>item.targetFinishedWeight)?.targetFinishedWeight : null;
  const orderAllocations = baseAllocations.map((allocation) => {
    const widthLine = (order.widthLines || []).find((item)=>item.id===allocation.widthLineId);
    const expectedWasteQuantity = isClosed ? expectedWasteFor(order, allocation.plannedQuantity) : 0;
    if (widthLine) return { ...allocation, rawInch:widthLine.inch, rawWidth:widthLine.width, targetFinishedWidth:widthLine.width, accessoryQuantity: allocationAccessoryQuantity(order, allocation), expectedWastePercent, expectedWasteQuantity };
    if (order.widthMode !== 'multiple') return { ...allocation, targetFinishedWidth: singleWidthValue || allocation.targetFinishedWidth || '', targetFinishedWeight: singleWeightValue || allocation.targetFinishedWeight || '', accessoryQuantity: allocationAccessoryQuantity(order, allocation), expectedWastePercent, expectedWasteQuantity };
    return { ...allocation, accessoryQuantity: allocationAccessoryQuantity(order, allocation), expectedWastePercent, expectedWasteQuantity };
  });
  const rawToDyehouse = sum(rawBatches.filter((batch) => batch.orderId === order.id));
  const allocated = roundNumber(orderAllocations.reduce((total, item) => total + Number(item.plannedQuantity || 0), 0));
  const operated = roundNumber(orderAllocations.reduce((total, item) => total + Number(item.sentToDyehouse || 0), 0));
  const warehouseReceived = roundNumber(orderAllocations.reduce((total, item) => total + Number(item.finishedReceived || 0), 0));
  const rawReturnedToWeaving = sum(rawReturns.filter((batch) => orderAllocations.some((allocation) => allocation.id === batch.allocationId)));
  const expectedWasteQuantity = isClosed ? expectedWasteFor(order, order.totalRawQuantity) : 0;
  const deliveredToCustomer = sum(customerBatches.filter((batch) => orderAllocations.some((allocation) => allocation.id === batch.allocationId)));
  const waste = isClosed ? Math.max(rawToDyehouse - warehouseReceived - rawReturnedToWeaving, 0) : 0;
  const widthLines = order.widthMode === 'multiple' ? (order.widthLines || []) : [{ inch:order.inchWidth || '', width:Number(order.inchWidth || 0), quantity:Number(order.totalRawQuantity || 0) }];
  const totalWidthQuantity = roundNumber(widthLines.reduce((total, item)=>total + Number(item.quantity || 0), 0));
  const totalRawOrdered = order.widthMode === 'multiple' && totalWidthQuantity > 0 ? totalWidthQuantity : roundNumber(order.totalRawQuantity);
  const configuredAccessoryLines = orderAccessoryConfig(order).map((line)=>{
    const quantity = line.quantityManual !== '' && line.quantityManual !== null && line.quantityManual !== undefined
      ? Number(line.quantityManual || 0)
      : Number(order.totalRawQuantity || 0) * Number(line.percent || 0) / 100;
    return { id:line.id || uid(), type:line.type || 'إكسسوار', percent:Number(line.percent || 0), quantityManual:line.quantityManual, quantity:roundNumber(quantity) };
  }).filter((line)=>line.type || line.percent || line.quantity);
  const manualAccessoryQuantity = roundNumber(orderAllocations.reduce((total, item)=>total + Number(item.accessoryQuantity || 0), 0));
  const recordedAccessoryQuantity = sum(accessoryBatches.filter((batch)=>batch.orderId === order.id && (!batch.movement || batch.movement === 'sent')));
  const hasAccessory = configuredAccessoryLines.length > 0 || !!order.accessoryType || manualAccessoryQuantity > 0 || recordedAccessoryQuantity > 0;
  const accessoryQuantity = manualAccessoryQuantity || roundNumber(Number(order.totalRawQuantity || 0) * Number(order.accessoryPercent || 0) / 100) || recordedAccessoryQuantity;
  const accessoryLines = configuredAccessoryLines.length ? configuredAccessoryLines : (hasAccessory ? [{ type:order.accessoryType || 'إكسسوار', percent:Number(order.accessoryPercent || 0), quantity:roundNumber(accessoryQuantity) }] : []);
  const accessoryRequired = roundNumber(accessoryLines.reduce((total, item)=>total + Number(item.quantity || 0), 0));
  const accessorySent = sum(accessoryBatches.filter((batch)=>batch.orderId===order.id && (!batch.movement || batch.movement === 'sent')));
  const accessoryReceived = sum(accessoryBatches.filter((batch)=>batch.orderId===order.id && batch.movement === 'received'));
  const accessoryDelivered = sum(accessoryBatches.filter((batch)=>batch.orderId===order.id && batch.movement === 'customer'));
  const accessoryWaste = isClosed ? Math.max(accessorySent - accessoryReceived, 0) : 0;
  return {
    ...order,
    allocations: orderAllocations,
    totalRawOrdered,
    widthLines,
    totalWidthQuantity,
    widthDistributionMatches: Math.abs(totalWidthQuantity - Number(order.totalRawQuantity || 0)) <= 0.01,
    accessoryLines,
    totalRawReceived: roundNumber(rawToDyehouse),
    totalAllocated: roundNumber(allocated),
    remainingUnallocatedRaw: roundNumber(Math.max(rawToDyehouse - allocated, 0)),
    allocationExceedsRaw: allocated > rawToDyehouse,
    totalSentToDyehouse: roundNumber(rawToDyehouse),
    rawAtDyehouseAvailable: roundNumber(Math.max(rawToDyehouse - warehouseReceived - rawReturnedToWeaving - waste, 0)),
    totalRawReturnedToWeaving: roundNumber(rawReturnedToWeaving),
    expectedWastePercent,
    expectedWasteQuantity: isClosed ? expectedWasteFor(order, totalRawOrdered) : 0,
    totalFinishedReceived: roundNumber(warehouseReceived),
    warehouseBalance: roundNumber(Math.max(warehouseReceived - deliveredToCustomer, 0)),
    totalDeliveredToCustomer: roundNumber(deliveredToCustomer),
    remainingToCustomer: roundNumber(Math.max(allocated - deliveredToCustomer, 0)),
    remainingAtDyehouse: roundNumber(Math.max(operated - warehouseReceived, 0)),
    totalWaste: roundNumber(waste),
    totalWastePercent: rawToDyehouse ? roundNumber(waste / rawToDyehouse * 100) : 0,
    totalActualWaste: roundNumber(waste),
    totalActualWastePercent: rawToDyehouse ? roundNumber(waste / rawToDyehouse * 100) : 0,
    accessoryRequired,
    accessorySent: roundNumber(accessorySent),
    accessoryReceived: roundNumber(accessoryReceived),
    accessoryDelivered: roundNumber(accessoryDelivered),
    accessoryBalance: roundNumber(Math.max(accessoryReceived - accessoryDelivered, 0)),
    accessoryWaste: roundNumber(accessoryWaste),
    accessoryWastePercent: accessorySent ? roundNumber(accessoryWaste / accessorySent * 100) : 0,
    status: order.operationClosed ? 'closed' : deliveredToCustomer >= allocated && allocated > 0 ? 'completed' : rawToDyehouse === 0 ? 'pending' : 'in-progress',
  };
}
function calculatePricing(pricing) {
  const library = activeDyehousePriceLibrary()[pricing.dyehouse] || {};
  const wasteBase = library.accountingMode === 'gross'
    ? Number(pricing.rawCost || 0) + Number(pricing.dyeCost || 0) + Number(pricing.extraCost || 0)
    : Number(pricing.rawCost || 0);
  const wasteCost = wasteBase * Number(pricing.wastePercent || 0) / 100;
  const costPerKg = Number(pricing.rawCost || 0) + Number(pricing.dyeCost || 0) + Number(pricing.extraCost || 0) + wasteCost;
  const sellPrice = costPerKg + Number(pricing.profitPerKg || 0);
  const totalOffer = sellPrice * Number(pricing.quantity || 0);
  return { ...pricing, productCode:pricing.productCode || buildItemCode(pricing.pricingNumber), accountingMode:library.accountingMode || 'net', wasteCost:roundNumber(wasteCost), costPerKg:roundNumber(costPerKg), sellPrice:roundNumber(sellPrice), totalOffer:roundNumber(totalOffer) };
}
function renderPricings() {
  const activePricings = pricings.filter(isActivePricing);
  refs.pricingTableBody.innerHTML = activePricings.map(calculatePricing).map((pricing)=>`<tr><td data-label="رقم التسعيرة">${pricing.pricingNumber}</td><td data-label="العميل">${pricing.customer}</td><td data-label="الصنف">${pricing.fabricType}</td><td data-label="المصبغة">${pricing.dyehouse}</td><td data-label="الكمية">${pricing.quantity}</td><td data-label="تكلفة الكيلو">${pricing.costPerKg.toLocaleString('ar-EG')}</td><td data-label="سعر البيع">${pricing.sellPrice.toLocaleString('ar-EG')}</td><td data-label="إجمالي العقد">${pricing.totalOffer.toLocaleString('ar-EG')}</td><td data-label="الحالة"><span class="status pending">تسعيرة</span></td><td data-label="إجراءات"><div class="batch-actions"><button class="mini-btn" data-pricing-quote="${pricing.id}">عرض سعر</button><button class="mini-btn" data-convert-pricing="${pricing.id}">تنزيل طلب</button><button class="mini-btn" data-edit-pricing="${pricing.id}">تعديل</button><button class="mini-btn danger" data-delete-pricing="${pricing.id}">حذف</button></div></td></tr>`).join('');
}
function updatePricingPreview() {
  const pricing = calculatePricing({ dyehouse:refs.pricingDyehouse.value, rawCost:+refs.pricingRawCost.value, dyeCost:+refs.pricingDyeCost.value, wastePercent:+refs.pricingWastePercent.value, extraCost:+refs.pricingExtraCost.value, profitPerKg:+refs.pricingProfitPerKg.value, quantity:+refs.pricingQuantity.value });
  refs.pricingWasteCostPreview.textContent = pricing.wasteCost.toLocaleString('ar-EG');
  refs.pricingCostPreview.textContent = pricing.costPerKg.toLocaleString('ar-EG');
  refs.pricingSellPreview.textContent = pricing.sellPrice.toLocaleString('ar-EG');
  refs.pricingTotalPreview.textContent = pricing.totalOffer.toLocaleString('ar-EG');
}
function pricingPayload(id = uid()) {
  return { id, pricingNumber:refs.pricingNumber.value, productCode:buildItemCode(refs.pricingNumber.value), customer:refs.pricingCustomer.value, pricingDate:refs.pricingDate.value, fabricType:refs.pricingFabricType.value, dyehouse:refs.pricingDyehouse.value, colorClass:refs.pricingColorClass.value, quantity:+refs.pricingQuantity.value, inchWidth:+refs.pricingInchWidth.value, finishedWeight:+refs.pricingFinishedWeight.value, materialType:refs.pricingMaterialType.value, rawCost:+refs.pricingRawCost.value, dyeCost:+refs.pricingDyeCost.value, wastePercent:+refs.pricingWastePercent.value, extraCost:+refs.pricingExtraCost.value, profitPerKg:+refs.pricingProfitPerKg.value, paymentTerms:refs.pricingPaymentTerms.value, notes:refs.pricingNotes.value };
}
function fillPricingForm(pricing) {
  refs.pricingNumber.value = pricing.pricingNumber || '';
  if (refs.pricingProductCode) refs.pricingProductCode.value = pricing.productCode || buildItemCode(pricing.pricingNumber);
  refs.pricingCustomer.value = pricing.customer || '';
  refs.pricingDate.value = pricing.pricingDate || new Date().toISOString().slice(0,10);
  refs.pricingFabricType.value = pricing.fabricType || '';
  refs.pricingMaterialType.value = pricing.materialType || '';
  refs.pricingDyehouse.value = pricing.dyehouse || '';
  refs.pricingColorClass.value = pricing.colorClass || '';
  refs.pricingQuantity.value = pricing.quantity || '';
  refs.pricingInchWidth.value = pricing.inchWidth || '';
  refs.pricingFinishedWeight.value = pricing.finishedWeight || '';
  refs.pricingRawCost.value = pricing.rawCost || '';
  refs.pricingDyeCost.value = pricing.dyeCost || '';
  refs.pricingWastePercent.value = pricing.wastePercent || '';
  refs.pricingExtraCost.value = pricing.extraCost || 0;
  refs.pricingProfitPerKg.value = pricing.profitPerKg || '';
  refs.pricingPaymentTerms.value = pricing.paymentTerms || '';
  refs.pricingNotes.value = pricing.notes || '';
  updatePricingPreview();
}
function editPricing(id) {
  const pricing = pricings.find((item)=>item.id===id);
  if (!pricing) return;
  editingPricingId = id;
  if (refs.deletePricingBtn) refs.deletePricingBtn.style.display = 'inline-flex';
  fillPricingForm(pricing);
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.pricingDialog.showModal();
}
async function deletePricing(id) {
  const pricing = pricings.find((item)=>item.id===id);
  if (!pricing) return;
  if (!confirm(`هل تريد حذف التسعيرة رقم ${pricing.pricingNumber}؟`)) return;
  if (!(await ensureBackendForWrite())) return;
  const backendSaveRequired = true;
  const deleted = await deleteBackend(`/pricings/${id}`);
  if (backendSaveRequired && !deleted) {
    await rollbackAfterBackendWriteFailure('تعذر حذف التسعيرة من قاعدة البيانات. لم يتم اعتماد الحذف.');
    return;
  }
  recordAudit('delete', 'pricing', id, pricing, null, `حذف التسعيرة رقم ${pricing.pricingNumber || ''}`);
  await persistAuditLog();
  if (editingPricingId === id) editingPricingId = null;
  await loadBackendData();
  if (refs.documentDialog.open) refs.documentDialog.close();
}
async function addPricing(event) {
  event.preventDefault();
  if (!(await ensureBackendForWrite())) return;
  const backendSaveRequired = true;
  if (editingPricingId) {
    const index = pricings.findIndex((item)=>item.id===editingPricingId);
    if (index !== -1) {
      const before = clone(pricings[index]);
      const updatedPricing = pricingPayload(editingPricingId);
      const backendCustomer = await ensureBackendCustomer(updatedPricing.customer);
      const savedPricing = await putBackend(`/pricings/${editingPricingId}`, pricingToApi(updatedPricing, backendCustomer));
      if (backendSaveRequired && !savedPricing) {
        await rollbackAfterBackendWriteFailure('تعذر حفظ تعديل التسعيرة في قاعدة البيانات. لم يتم اعتماد التعديل.');
        return;
      }
      recordAudit('update', 'pricing', editingPricingId, before, updatedPricing, `تعديل التسعيرة رقم ${updatedPricing.pricingNumber || ''}`);
      await persistAuditLog();
    }
    editingPricingId = null;
  } else {
    const createdPricing = pricingPayload();
    const backendCustomer = await ensureBackendCustomer(createdPricing.customer);
    const savedPricing = await postBackend('/pricings', pricingToApi(createdPricing, backendCustomer));
    if (backendSaveRequired && !savedPricing) {
      await rollbackAfterBackendWriteFailure('تعذر حفظ التسعيرة الجديدة في قاعدة البيانات. لم يتم اعتماد التسعيرة.');
      return;
    }
    recordAudit('create', 'pricing', createdPricing.id, null, createdPricing, `إنشاء التسعيرة رقم ${createdPricing.pricingNumber || ''}`);
    await persistAuditLog();
  }
  await loadBackendData();
  refs.pricingDialog.close();
}
function convertPricingToOrder(id) {
  const pricing = calculatePricing(pricings.find((item)=>item.id===id));
  if (!pricing) return;
  const orderNumber = orderNumberFromPricing(pricing.pricingNumber);
  pendingConvertedPricingId = pricing.id;
  editingOrderId = null;
  fillOrderForm({
    pricingId: pricing.id,
    orderNumber,
    productCode: buildItemCode(orderNumber),
    customer: pricing.customer || '',
    orderDate: pricing.pricingDate || new Date().toISOString().slice(0,10),
    fabricType: pricing.fabricType || '',
    totalRawQuantity: pricing.quantity || '',
    widthMode: 'single',
    inchWidth: pricing.inchWidth || '',
    widthLines: [],
    kiloPrice: pricing.sellPrice || '',
    rawCost: pricing.rawCost || 0,
    paymentTerms: pricing.paymentTerms || '',
    dyehouse: pricing.dyehouse || '',
    weavingSource: '',
    accessoryType: '',
    accessoryPercent: 0,
    notes: pricing.notes || ''
  });
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.orderDialog.showModal();
}
async function markPricingConverted(pricingNumber, orderId, pricingId = null) {
  const convertedAt = new Date().toISOString();
  const converted = [];
  pricings.forEach((pricing)=>{
    const matches = pricingId ? pricing.id === pricingId : (String(pricing.pricingNumber)===String(pricingNumber) || orderNumberFromPricing(pricing.pricingNumber)===String(pricingNumber));
    if (matches) converted.push({ ...pricing, status:'converted', convertedOrderId: orderId || true, convertedAt });
  });
  let ok = true;
  for (const pricing of converted) {
    const saved = await putBackend(`/pricings/${pricing.id}`, { status:'converted', notes:pricing.notes || '' });
    if (!saved) ok = false;
  }
  if (ok && converted.length) {
    const convertedById = new Map(converted.map((pricing)=>[pricing.id, pricing]));
    pricings = pricings.map((pricing)=>convertedById.get(pricing.id) || pricing);
  }
  return ok;
}
function openPricingQuotation(id) {
  const pricing = calculatePricing(pricings.find((item)=>item.id===id));
  if (!pricing) return;
  refs.documentTitle.textContent = 'عرض سعر';
  refs.documentBody.innerHTML = `<div class="document-sheet">${documentHeader()}<div class="document-inline-actions no-print"><button class="mini-btn" data-convert-pricing="${pricing.id}">تنزيل طلب</button><button class="mini-btn" data-edit-pricing-doc="${pricing.id}">تعديل</button></div><h2>عرض سعر</h2><div class="document-meta"><div><span>رقم التسعيرة</span>${pricing.pricingNumber}</div><div><span>العميل</span>${pricing.customer}</div><div><span>التاريخ</span>${pricing.pricingDate}</div><div><span>الصنف</span>${pricing.fabricType}</div><div><span>درجة اللون</span>${pricing.colorClass}</div><div><span>الكمية</span>${pricing.quantity}</div><div><span>البوصة</span>${pricing.inchWidth}</div><div><span>الوزن المجهز</span>${pricing.finishedWeight}</div><div><span>سعر الوحدة</span>${pricing.sellPrice.toLocaleString('ar-EG')} جنيه</div><div><span>إجمالي العرض</span>${pricing.totalOffer.toLocaleString('ar-EG')} جنيه</div><div><span>شروط السداد</span>${pricing.paymentTerms}</div></div><table><thead><tr><th>البند</th><th>القيمة</th></tr></thead><tbody><tr><td>تكلفة الخام</td><td>${pricing.rawCost.toLocaleString('ar-EG')}</td></tr><tr><td>تكلفة الصباغة</td><td>${pricing.dyeCost.toLocaleString('ar-EG')}</td></tr><tr><td>تكلفة الهالك التقديري</td><td>${pricing.wasteCost.toLocaleString('ar-EG')}</td></tr><tr><td>تكلفة المراحل الإضافية</td><td>${pricing.extraCost.toLocaleString('ar-EG')}</td></tr><tr><td>إجمالي التكلفة</td><td>${pricing.costPerKg.toLocaleString('ar-EG')}</td></tr><tr><td>الربح للكيلو</td><td>${pricing.profitPerKg.toLocaleString('ar-EG')}</td></tr><tr><td><strong>سعر البيع</strong></td><td><strong>${pricing.sellPrice.toLocaleString('ar-EG')}</strong></td></tr></tbody></table><p>${pricing.notes || 'لا توجد ملاحظات إضافية.'}</p>${documentFooter()}</div>`;
  refs.documentDialog.showModal();
}
function allOrders() { return orders.map(calculateOrder); }
function orderSearchText(order) {
  const allocationIds = (order.allocations || []).map((allocation)=>allocation.id);
  const noteNumbers = [
    ...rawBatches.filter((batch)=>batch.orderId===order.id).map((batch)=>batch.noteNumber),
    ...rawReturns.filter((batch)=>allocationIds.includes(batch.allocationId)).map((batch)=>batch.noteNumber),
    ...accessoryBatches.filter((batch)=>batch.orderId===order.id || allocationIds.includes(batch.allocationId)).map((batch)=>batch.noteNumber),
    ...productionBatches.filter((batch)=>allocationIds.includes(batch.allocationId)).map((batch)=>batch.noteNumber),
    ...customerBatches.filter((batch)=>allocationIds.includes(batch.allocationId)).map((batch)=>batch.noteNumber),
    ...dyehouseTransfers.filter((batch)=>batch.orderId===order.id || allocationIds.includes(batch.allocationId)).map((batch)=>batch.noteNumber),
  ];
  return [order.orderNumber, order.customer, order.dyehouse, order.weavingSource, order.fabricType, order.productCode, ...noteNumbers].filter(Boolean).join(' ').toLowerCase();
}
function filteredOrders() {
  const query = refs.searchInput.value.trim().toLowerCase();
  const status = refs.orderStatusFilter.value;
  const customer = refs.customerFilter.value;
  const dyehouse = refs.dyehouseFilter.value;
  const fabric = refs.fabricFilter.value;
  return allOrders().filter((order) => orderSearchText(order).includes(query) && (status === 'closed' ? order.status === 'closed' : (status === 'all' ? order.status !== 'closed' : order.status === status)) && (customer === 'all' || order.customer === customer) && (dyehouse === 'all' || order.dyehouse === dyehouse) && (fabric === 'all' || order.fabricType === fabric));
}
function fillSelectOptions(select, values, allLabel) {
  const current = select.value || 'all';
  select.innerHTML = `<option value="all">${allLabel}</option>${[...new Set(values.filter(Boolean))].sort().map((value)=>`<option value="${value}">${value}</option>`).join('')}`;
  if ([...select.options].some((option)=>option.value === current)) select.value = current;
}
function renderOrderFilters() {
  fillSelectOptions(refs.customerFilter, orders.map((order)=>order.customer), 'كل العملاء');
  fillSelectOptions(refs.dyehouseFilter, orders.map((order)=>order.dyehouse), 'كل المصابغ');
  fillSelectOptions(refs.fabricFilter, orders.map((order)=>order.fabricType), 'كل الأصناف');
}
function renderStats(list) {
  const fmt = (value) => roundNumber(value).toLocaleString('ar-EG', { maximumFractionDigits: 3 });
  const values = [
    ['عدد الطلبات', list.length],
    ['خام مطلوب', list.reduce((t,o)=>t+o.totalRawOrdered,0)],
    ['خام مستلم', list.reduce((t,o)=>t+o.totalRawReceived,0)],
    ['مرسل للمصبغة', list.reduce((t,o)=>t+o.totalSentToDyehouse,0)],
    ['مجهز مستلم', list.reduce((t,o)=>t+o.totalFinishedReceived,0)],
    ['هالك إجمالي', list.reduce((t,o)=>t+o.totalWaste,0)],
  ];
  refs.statsGrid.innerHTML = values.map(([label,value]) => `<article class="stat-card"><span>${label}</span><strong>${fmt(value)}</strong></article>`).join('');
}
function buildAiSummaryStats(list = allOrders()) {
  const openOrders = list.filter((order)=>!['completed','closed'].includes(order.status));
  const pendingReports = reportOutbox.filter((item)=>['pending','failed'].includes(item.status));
  return {
    ordersCount: list.length,
    openOrdersCount: openOrders.length,
    pendingOrdersCount: list.filter((order)=>order.status === 'pending').length,
    inProgressOrdersCount: list.filter((order)=>order.status === 'in-progress').length,
    completedOrdersCount: list.filter((order)=>order.status === 'completed').length,
    closedOrdersCount: list.filter((order)=>order.status === 'closed').length,
    totalRawOrdered: roundNumber(list.reduce((total, order)=>total + Number(order.totalRawOrdered || 0), 0)),
    totalSentToDyehouse: roundNumber(list.reduce((total, order)=>total + Number(order.totalSentToDyehouse || 0), 0)),
    totalFinishedReceived: roundNumber(list.reduce((total, order)=>total + Number(order.totalFinishedReceived || 0), 0)),
    totalRemainingAtDyehouse: roundNumber(list.reduce((total, order)=>total + Number(order.rawAtDyehouseAvailable || 0), 0)),
    totalWarehouseBalance: roundNumber(list.reduce((total, order)=>total + Number(order.warehouseBalance || 0), 0)),
    totalDeliveredToCustomer: roundNumber(list.reduce((total, order)=>total + Number(order.totalDeliveredToCustomer || 0), 0)),
    finalWasteOnClosedOrders: roundNumber(list.filter((order)=>['completed','closed'].includes(order.status)).reduce((total, order)=>total + Number(order.totalWaste || 0), 0)),
    reportsNeedAttention: pendingReports.length,
  };
}
function collectAiReportPayload() {
  const calculatedOrders = allOrders().map((order)=>({
    ...order,
    rawNoteNumbers: rawBatches.filter((batch)=>batch.orderId===order.id).map((batch)=>batch.noteNumber).filter(Boolean),
  }));
  return {
    orders: calculatedOrders,
    weavingOrders: orders,
    dyeingPlans: allocations,
    batches: {
      rawBatches,
      productionBatches,
      customerBatches,
      accessoryBatches,
      rawReturns,
      dyehouseTransfers,
    },
    reportOutbox,
    summaryStats: buildAiSummaryStats(calculatedOrders),
  };
}
function asListHtml(items) {
  const rows = Array.isArray(items) ? items : [];
  return rows.length ? `<ul>${rows.map((item)=>`<li>${item}</li>`).join('')}</ul>` : '<p class="empty-state">لا توجد بيانات كافية للعرض.</p>';
}
function renderAiAnalysis(result) {
  const safe = result || {};
  refs.aiAnalysisBody.innerHTML = `<section class="ai-result-section"><h3>الملخص التنفيذي</h3><p>${safe.executiveSummary || '-'}</p></section><section class="ai-result-section"><h3>أهم الملاحظات</h3>${asListHtml(safe.keyFindings)}</section><section class="ai-result-section"><h3>المخاطر</h3>${asListHtml(safe.risks)}</section><section class="ai-result-section"><h3>التوصيات</h3>${asListHtml(safe.recommendations)}</section><section class="ai-result-section"><h3>رسالة واتساب للإدارة</h3><div class="ai-whatsapp-message" id="aiWhatsappMessage">${safe.whatsappMessage || '-'}</div></section>`;
  refs.aiAnalysisDialog.showModal();
}
async function analyzeReportWithAi() {
  if (!refs.analyzeReportBtn) return;
  const oldText = refs.analyzeReportBtn.textContent;
  refs.analyzeReportBtn.disabled = true;
  refs.analyzeReportBtn.textContent = 'جاري التحليل...';
  if (refs.aiStatusText) refs.aiStatusText.textContent = 'جاري إرسال بيانات التشغيل إلى مساعد 2B الذكي.';
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/ai/analyze-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collectAiReportPayload()),
    });
    const data = await response.json().catch(()=>({}));
    if (!response.ok) {
      if (data.error === 'MISSING_OPENAI_API_KEY') throw new Error('لم يتم ضبط مفتاح OpenAI API داخل السيرفر');
      throw new Error(data.message || 'تعذر تحليل التقرير من خدمة مساعد 2B الذكي');
    }
    renderAiAnalysis(data);
    if (refs.aiStatusText) refs.aiStatusText.textContent = 'تم تحليل التقرير بواسطة خدمة OpenAI.';
  } catch (error) {
    const message = error.message === 'لم يتم ضبط مفتاح OpenAI API داخل السيرفر' ? error.message : (error.message || 'خدمة مساعد 2B الذكي غير متصلة حاليًا');
    if (refs.aiStatusText) refs.aiStatusText.textContent = message;
    refs.aiAnalysisBody.innerHTML = `<div class="empty-state">${message}</div>`;
    refs.aiAnalysisDialog.showModal();
  } finally {
    refs.analyzeReportBtn.disabled = false;
    refs.analyzeReportBtn.textContent = oldText;
  }
}
async function copyAiWhatsappMessage() {
  const text = document.getElementById('aiWhatsappMessage')?.textContent?.trim() || '';
  if (!text || text === '-') { alert('لا توجد رسالة جاهزة للنسخ.'); return; }
  try {
    await navigator.clipboard.writeText(text);
    alert('تم نسخ الرسالة.');
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
    alert('  .');
  }
}

function renderOrders() {
  const list = filteredOrders();
  renderStats(list);
  refs.ordersTableBody.innerHTML = list.map((order) => `<tr><td data-label="رقم الطلب">${order.orderNumber}</td><td data-label="العميل">${order.customer}</td><td data-label="الصنف">${order.fabricType}</td><td data-label="خام مطلوب">${order.totalRawOrdered}</td><td data-label="خام مستلم">${order.totalRawReceived}</td><td data-label="مرسل للمصبغة">${order.totalSentToDyehouse}</td><td data-label="مجهز مستلم">${order.totalFinishedReceived}</td><td data-label="الهالك">${formatNumber(order.totalWastePercent || 0, 1)}%</td><td data-label="الحالة"><span class="status ${order.status}">${statusLabel(order.status)}</span></td><td data-label="إجراءات"><div class="batch-actions"><button class="mini-btn" data-view="${order.id}">عرض</button><button class="mini-btn" data-edit-order="${order.id}">تعديل</button><button class="mini-btn danger" data-delete-order="${order.id}">حذف</button></div></td></tr>`).join('');
}

function documentFooter() {
  const printedAt = new Date().toLocaleString('ar-EG', { dateStyle:'medium', timeStyle:'short' });
  return `<div class="document-footer"><span>${printedAt}</span><strong>Manager : Ibrahim Assem</strong></div>`;
}
function withDocumentFooter(body) {
  return body.includes('sticker-sheet') ? body : `${body}${documentFooter()}`;
}
function updateRawMovementVisibility(form) {
  if (!form) return;
  const isReturn = form.elements.movementKind?.value === 'return';
  form.querySelectorAll('[data-return-only]').forEach((field) => field.classList.toggle('field-hidden', !isReturn));
  form.querySelectorAll('[data-out-only]').forEach((field) => field.classList.toggle('field-hidden', isReturn));
}

function accessoryTypeSelectHtml(order) {
  const options = (order?.accessoryLines || []).map((line)=>`<option value="${line.type}">${line.type}</option>`).join('');
  return `<select name="accessoryType" required><option value="">اختر نوع الإكسسوار</option>${options}</select>`;
}

function accessoryTypesLabel(order) {
  const names = uniqueNonEmpty((order?.accessoryLines || []).map((line)=>line.type));
  return names.length ? names.join(' + ') : 'إكسسوار';
}
function accessoryDocumentSection(order, fmt, safe) {
  const lines = Array.isArray(order?.accessoryLines) ? order.accessoryLines : [];
  const hasAccessory = lines.length || Number(order?.accessoryRequired || 0) || Number(order?.accessorySent || 0) || Number(order?.accessoryReceived || 0) || Number(order?.accessoryDelivered || 0);
  if (!hasAccessory) return '';
  const rows = (lines.length ? lines : [{ type:'إكسسوار', percent:order?.accessoryPercent || 0, quantity:order?.accessoryRequired || 0 }])
    .map((line) => `<tr><td>${safe(line.type || 'إكسسوار')}</td><td>${formatNumber(Number(line.percent || 0))}%</td><td>${fmt(line.quantity || line.quantityManual || 0)}</td></tr>`).join('');
  const wasteText = order?.operationClosed ? `${fmt(order.accessoryWaste || 0)} (${formatNumber(order.accessoryWastePercent || 0, 1)}%)` : 'يظهر بعد إغلاق الدورة';
  return `<section class="report-section"><h3>متابعة الإكسسوار</h3><table class="summary-table"><tbody><tr><th>إكسسوار مطلوب</th><td>${fmt(order.accessoryRequired || 0)}</td><th>إكسسوار مرسل</th><td>${fmt(order.accessorySent || 0)}</td></tr><tr><th>إكسسوار مستلم</th><td>${fmt(order.accessoryReceived || 0)}</td><th>إكسسوار مسلم للعميل</th><td>${fmt(order.accessoryDelivered || 0)}</td></tr><tr><th>رصيد الإكسسوار</th><td>${fmt(order.accessoryBalance || 0)}</td><th>هالك الإكسسوار</th><td>${wasteText}</td></tr></tbody></table><table class="summary-table"><thead><tr><th>نوع الإكسسوار</th><th>النسبة</th><th>الكمية المطلوبة</th></tr></thead><tbody>${rows}</tbody></table></section>`;
}
function updateCustomerDeliveryFields(form) {
  if (!form) return;
  const isAccessory = form.elements.movementKind?.value === 'accessory';
  form.querySelectorAll('[data-accessory-only]').forEach((field) => field.classList.toggle('field-hidden', !isAccessory));
}
function repairOrderDetailsArabic(order) {
  const root = refs.orderDetailsPanel;
  if (!root || !order) return;
  const isBadText = isLegacyRecoveredText;
  const setText = (selector, text) => { const element = root.querySelector(selector); if (element) element.textContent = text; };
  const setPlaceholder = (selector, text) => { root.querySelectorAll(selector).forEach((element)=>{ element.placeholder = text; }); };
  setText('#editOrderBtn', 'تعديل الطلب');
  setText('#toggleOperationClosedBtn', order.operationClosed ? 'إعادة فتح التشغيل' : 'إغلاق دورة التشغيل');
  setText('#addAllocationBtn', '+ إضافة لون');
  root.querySelectorAll('.batch-box h3').forEach((title) => {
    const form = title.closest('.batch-box')?.querySelector('.batch-form')?.dataset.form;
    const labels = { raw:'خروج خام', accessory:'خروج إكسسوار', accessoryReceived:'استلام إكسسوار', production:'استلام مجهز', customer:'تسليم عميل' };
    if (labels[form]) title.textContent = labels[form];
  });
  const rawForm = root.querySelector('form[data-form="raw"]');
  if (rawForm) {
    rawForm.elements.movementKind.options[0].textContent = 'خروج خام للمصبغة';
    rawForm.elements.movementKind.options[1].textContent = 'ارتجاع خام للنسيج';
    rawForm.querySelector('[name="widthLineId"] option')?.replaceChildren(document.createTextNode('اختر العرض عند خروج الخام'));
    rawForm.querySelector('[name="allocationId"] option')?.replaceChildren(document.createTextNode('اختر اللون / المصبغة للمرتجع'));
    const fileLabel = rawForm.querySelector('.batch-file-label span');
    if (fileLabel) fileLabel.textContent = 'صورة إذن الخام';
    rawForm.querySelector('button') && (rawForm.querySelector('button').textContent = 'إضافة حركة');
  }
  root.querySelectorAll('select[name="widthLineId"] option').forEach((option) => {
    const line = (order.widthLines || []).find((item)=>item.id === option.value);
    if (line) option.textContent = `بوصة ${line.inch} — عرض ${line.width} — مطلوب ${line.quantity}`;
  });
  root.querySelectorAll('form[data-form="accessory"] button, form[data-form="accessoryReceived"] button').forEach((button)=>button.textContent = 'إضافة');
  root.querySelector('form[data-form="production"] button') && (root.querySelector('form[data-form="production"] button').textContent = 'إضافة استلام');
  root.querySelector('form[data-form="customer"] button') && (root.querySelector('form[data-form="customer"] button').textContent = 'إضافة حركة');
  const customerForm = root.querySelector('form[data-form="customer"]');
  if (customerForm?.elements.movementKind) {
    customerForm.elements.movementKind.options[0].textContent = 'تسليم قماش';
    if (customerForm.elements.movementKind.options[1]) customerForm.elements.movementKind.options[1].textContent = 'تسليم إكسسوار';
  }
  setPlaceholder('input[name="quantity"]', 'الكمية');
  setPlaceholder('form[data-form="production"] input[name="quantity"], form[data-form="accessoryReceived"] input[name="quantity"]', 'الكمية المستلمة');
  setPlaceholder('input[name="supplier"]', 'مصدر النسيج');
  setPlaceholder('input[name="noteNumber"]', 'رقم الإذن');
  setPlaceholder('input[name="notes"]', 'ملاحظات');
  root.querySelectorAll('.summary-grid .metric span').forEach((span, index) => {
    const labels = ['إجمالي الخام المطلوب','خرج من النسيج إلى المصبغة','خام متاح بالمصبغة','دخل المخزن من المصبغة','رصيد المخزن','تم تسليمه للعميل','مرتجع خام للنسيج','هالك تقديري','هالك فعلي'];
    if (labels[index]) span.textContent = labels[index];
  });
  root.querySelectorAll('th').forEach((th) => {
    if (!isBadText(th.textContent)) return;
    const row = [...th.parentElement.children];
    const index = row.indexOf(th);
    const fixed = ({ 0:'البوصة', 1:'العرض', 2:'الكمية', 7:'هالك تقديري', 8:'هالك تقديري', 9:'هالك فعلي', 10:'إجراءات' })[index];
    if (fixed) th.textContent = fixed;
  });
  root.querySelectorAll('.batch-list .empty-state').forEach((item)=>{ if (isBadText(item.textContent)) item.textContent = 'لا توجد دفعات بعد.'; });
  root.querySelectorAll('.batch-list .batch-item span').forEach((span)=>{
    let text = span.textContent;
    text = text.replace(/\?+/g, '').replace(/\uFFFD/g, '').replace(/ï؟½/g, '').replace(/\s+/g, ' ').trim();
    if (text.includes('202') && !text.includes('خروج خام')) text = `خروج خام - ${text}`;
    text = text.replace(/(\d+)\s*-\s*(\d+)$/, 'بوصة $1 - عرض $2');
    span.textContent = text;
  });
  const sendStatus = root.querySelector('.report-send-status');
  if (sendStatus) {
    const title = sendStatus.querySelector('h3');
    const hint = sendStatus.querySelector('.eyebrow');
    if (title) title.textContent = 'حالة مشاركة التقارير';
    if (hint) hint.textContent = 'المشاركة تتم عبر خدمة واتساب عند تشغيلها.';
  }
  root.querySelectorAll('h3').forEach((title)=>{
    if (isBadText(title.textContent)) title.textContent = 'رصيد المخزن الحالي';
  });
  root.querySelectorAll('.subsection .eyebrow').forEach((hint)=>{
    if (isBadText(hint.textContent)) hint.textContent = 'رصيد المخزن حسب التشغيل والتسليم';
  });
  root.querySelectorAll('th').forEach((th)=>{
    if (!isBadText(th.textContent)) return;
    const row = [...th.parentElement.children];
    const index = row.indexOf(th);
    const fixed = index === 3 ? 'دخل المخزن' : index === 4 ? 'الرصيد الحالي' : 'ملاحظات';
    th.textContent = fixed;
  });
}
function canvasToPngBlob(canvas) {
  return new Promise((resolve, reject)=>canvas.toBlob((blob)=>blob ? resolve(blob) : reject(new Error('png-create-failed')), 'image/png'));
}
async function reportToPngBlob() {
  const canvas = await reportToCanvas({ scale:3 });
  return await canvasToPngBlob(canvas);
}
function orderDetailsHasActiveDraft() {
  const active = document.activeElement;
  if (active?.closest?.('#orderDetailsPanel .batch-form')) return true;
  return !!refs.orderDetailsPanel?.querySelector('.batch-form[data-dirty="true"]');
}

function renderDocuments() {
  refs.documentsPanel.innerHTML = `<button class="mini-btn gold" data-doc="quotation">إنشاء عرض سعر</button><button class="mini-btn gold" data-doc="weaving">إنشاء أمر نسيج</button><button class="mini-btn gold" data-doc="dyeing">إنشاء أمر صباغة</button><button class="mini-btn gold" data-doc="labSamples">عينات معمل</button><button class="mini-btn" data-doc="waste">تقرير الهالك</button><button class="mini-btn gold" data-doc="fullreport">تقرير الطلب الكامل</button><button class="mini-btn gold" data-doc="stickers">طباعة استيكرات التشغيل</button><button class="mini-btn" data-doc="print">طباعة</button><button class="mini-btn" disabled>تصدير PDF لاحقًا</button>`;
}
function batchItemHtml(type, batch, label) { return `<div class="batch-item"><span>${label}</span><div class="batch-actions"><button class="mini-btn" data-batch-action="edit" data-batch-type="${type}" data-batch-id="${batch.id}">تعديل</button><button class="mini-btn danger" data-batch-action="delete" data-batch-type="${type}" data-batch-id="${batch.id}">حذف</button></div></div>`; }
function listHtml(items, formatter) { const rows = Array.isArray(items) ? items : []; return rows.length ? rows.map(formatter).join('') : `<div class="empty-state">لا توجد دفعات بعد.</div>`; }
function allocationWidthSuffix(order, allocation) {
  if (!order || !allocation || order.widthMode !== 'multiple') return '';
  const widthLine = (order.widthLines || []).find((item) => item.id === allocation.widthLineId) || {};
  const inch = allocation.rawInch || widthLine.inch || '-';
  const width = allocation.rawWidth || allocation.targetFinishedWidth || widthLine.width || '-';
  return ` / بوصة ${inch} - عرض ${width}`;
}
function allocationOptionLabel(order, allocation) {
  if (!allocation) return '-';
  return `${allocation.color || '-'} / ${allocation.dyehouse || '-'}${allocationWidthSuffix(order, allocation)}`;
}
function allocationColorLabel(order, allocation) {
  if (!allocation) return '-';
  return `${allocation.color || '-'}${allocationWidthSuffix(order, allocation)}`;
}
function movementLine(...parts) {
  return parts.map((part)=>String(part ?? '').trim()).filter(Boolean).join(' - ');
}
function noteSuffix(batch) {
  return batch?.noteNumber ? ` / رقم إذن ${batch.noteNumber}` : '';
}

function renderDetails() {
  ensureRuntimeCollections();
  if (!refs.orderDetailsPanel) return;
  const baseOrder = orders.find((order) => order.id === selectedOrderId);
  if (!baseOrder) return;
  const order = calculateOrder(baseOrder);
  order.allocations = Array.isArray(order.allocations) ? order.allocations : [];
  order.widthLines = Array.isArray(order.widthLines) ? order.widthLines : [];
  order.accessoryLines = Array.isArray(order.accessoryLines) ? order.accessoryLines : [];
  const allocationPercent = order.totalRawReceived ? Math.min(order.totalAllocated / order.totalRawReceived * 100, 100) : 0;
  const rawItems = (()=>{ const outgoing = rawBatches.filter((batch)=>batch.orderId===order.id).map((batch)=>{ const widthLine = order.widthLines.find((item)=>item.id===batch.widthLineId); const widthLabel = widthLine ? `بوصة ${widthLine.inch} / عرض ${widthLine.width}` : ''; return { type:'raw', batch, label:movementLine('خروج خام للمصبغة', batch.date, batch.quantity, batch.supplier || '-', widthLabel) + noteSuffix(batch) }; }); const returns = rawReturns.filter((batch)=>order.allocations.some((allocation)=>allocation.id===batch.allocationId)).map((batch)=>{ const allocation=order.allocations.find((item)=>item.id===batch.allocationId); return { type:'rawReturn', batch, label:movementLine('مرتجع خام للنسيج', batch.date, allocation?.dyehouse || '-', allocation?.color || '-', batch.quantity) + noteSuffix(batch) }; }); const rows = outgoing.concat(returns).sort((a,b)=>String(b.batch.date||'').localeCompare(String(a.batch.date||''))); return rows.length ? rows.map((item)=>batchItemHtml(item.type, item.batch, item.label)).join('') : '<div class="empty-state">لا توجد دفعات بعد.</div>'; })();
  const accessoryColor = (batch)=>order.allocations.find((item)=>item.id===batch.allocationId)?.color || batch.color || '-';
  const accessoryTypeOptions = order.accessoryLines.map((line)=>`<option value="${line.type}">${line.type}</option>`).join('');
  const accessoryTypeSelect = `<select name="accessoryType" required><option value="">اختر نوع الإكسسوار</option>${accessoryTypeOptions}</select>`;
  const accessoryItems = listHtml(accessoryBatches.filter((batch)=>batch.orderId===order.id && batch.movement === 'sent'), (batch)=>batchItemHtml('accessory', batch, movementLine('خروج إكسسوار', batch.date, batch.quantity, batch.accessoryType || order.accessoryLines[0]?.type || 'إكسسوار') + noteSuffix(batch)));
  const accessoryReceivedItems = listHtml(accessoryBatches.filter((batch)=>batch.orderId===order.id && batch.movement === 'received'), (batch)=>batchItemHtml('accessory', batch, movementLine('استلام إكسسوار', batch.date, accessoryColor(batch), batch.quantity, batch.accessoryType || 'إكسسوار') + noteSuffix(batch)));
  const productionItems = listHtml(productionBatches.filter((batch)=>order.allocations.some((allocation)=>allocation.id===batch.allocationId)), (batch)=>{ const allocation=order.allocations.find((item)=>item.id===batch.allocationId); return batchItemHtml('production', batch, movementLine('استلام مجهز', batch.date, allocation?.dyehouse || '-', allocation?.color || '-', batch.quantity) + noteSuffix(batch)); });
  const customerItems = (()=>{ const cloth = customerBatches.filter((batch)=>order.allocations.some((allocation)=>allocation.id===batch.allocationId)).map((batch)=>{ const allocation=order.allocations.find((item)=>item.id===batch.allocationId); const label = allocation ? allocationColorLabel(order, allocation) : '-'; return { type:'customer', batch, label:movementLine('تسليم قماش للعميل', batch.date, label, batch.quantity) }; }); const accessories = accessoryBatches.filter((batch)=>batch.orderId===order.id && batch.movement === 'customer').map((batch)=>{ const allocation=order.allocations.find((item)=>item.id===batch.allocationId); const label = allocation ? allocationColorLabel(order, allocation) : accessoryColor(batch); return { type:'accessory', batch, label:movementLine('تسليم إكسسوار للعميل', batch.date, label, batch.quantity, batch.accessoryType || order.accessoryLines[0]?.type || 'إكسسوار') + noteSuffix(batch) }; }); const rows = cloth.concat(accessories).sort((a,b)=>String(b.batch.date||'').localeCompare(String(a.batch.date||''))); return rows.length ? rows.map((item)=>batchItemHtml(item.type, item.batch, item.label)).join('') : '<div class="empty-state">لا توجد دفعات بعد.</div>'; })();
  const transferItems = listHtml(dyehouseTransfers.filter((batch)=>batch.orderId===order.id), (batch)=>batchItemHtml('transfer', batch, movementLine('تحويل مصبغة', batch.date, batch.color || '-', batch.fromDyehouse || '-', batch.toDyehouse || '-', batch.quantity) + noteSuffix(batch)));
  const rawReturnItems = listHtml(rawReturns.filter((batch)=>order.allocations.some((allocation)=>allocation.id===batch.allocationId)), (batch)=>{ const allocation=order.allocations.find((item)=>item.id===batch.allocationId); return batchItemHtml('rawReturn', batch, movementLine('مرتجع خام للنسيج', batch.date, allocation?.dyehouse || '-', allocation?.color || '-', batch.quantity) + noteSuffix(batch)); });
  const stockRows = order.allocations.map((allocation)=>{ const delivered = sum(customerBatches.filter((batch)=>batch.allocationId===allocation.id)); const balance = roundNumber(Number(allocation.finishedReceived || 0) - delivered); const widthInfo = order.widthMode === 'multiple' ? `بوصة ${allocation.rawInch || '-'} / عرض ${allocation.rawWidth || allocation.targetFinishedWidth || '-'}` : `بوصة ${order.inchWidth || '-'} / عرض ${allocation.targetFinishedWidth || '-'}`; return `<tr><td>${allocation.color}</td><td>${widthInfo}</td><td>${formatNumber(allocation.finishedReceived || 0)}</td><td>${formatNumber(delivered || 0)}</td><td><strong>${formatNumber(balance)}</strong></td></tr>`; }).join('');
  const accessoryStockRows = order.accessoryLines.length ? order.allocations.flatMap((allocation)=>order.accessoryLines.map((line)=>{ const received = sum(accessoryBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement==='received' && (batch.accessoryType || line.type) === line.type)); const delivered = sum(accessoryBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement==='customer' && (batch.accessoryType || line.type) === line.type)); const balance = roundNumber(received - delivered); return `<tr><td>${allocation.color}</td><td>${line.type}</td><td>${formatNumber(received || 0)}</td><td>${formatNumber(delivered || 0)}</td><td><strong>${formatNumber(balance)}</strong></td></tr>`; })).join('') : '';
  const inventorySection = `<div class="subsection"><div class="subsection-head"><div><h3>رصيد المخزن الحالي</h3><p class="eyebrow">رصيد المخزن حسب التشغيل والتسليم</p></div></div><div class="table-wrap"><table class="allocation-table"><thead><tr><th>اللون</th><th>العرض</th><th>دخل المخزن</th><th>تسليم العميل</th><th>الرصيد الحالي</th></tr></thead><tbody>${stockRows}</tbody></table></div>${order.accessoryLines.length ? `<div class="table-wrap"><table class="allocation-table"><thead><tr><th>اللون</th><th>العرض</th><th>دخل المخزن</th><th>تسليم العميل</th><th>الرصيد الحالي</th></tr></thead><tbody>${accessoryStockRows}</tbody></table></div>` : ''}</div>`;
  refs.orderDetailsPanel.innerHTML = `<div class="section-head"><div><p class="eyebrow">${order.orderNumber}</p><h2>${order.customer}</h2></div><div class="actions"><button class="mini-btn" id="editOrderBtn">تعديل الطلب</button><button class="mini-btn ${order.operationClosed ? 'gold' : 'danger'}" id="toggleOperationClosedBtn">${order.operationClosed ? 'إعادة فتح التشغيل' : 'إغلاق دورة التشغيل'}</button><span class="status ${order.status}">${statusLabel(order.status)}</span></div></div><h3>&#1605;&#1604;&#1582;&#1589; &#1583;&#1608;&#1585;&#1577; &#1575;&#1604;&#1578;&#1588;&#1594;&#1610;&#1604;</h3><div class="summary-grid"><div class="metric"><span>&#1573;&#1580;&#1605;&#1575;&#1604;&#1610; &#1575;&#1604;&#1582;&#1575;&#1605; &#1575;&#1604;&#1605;&#1591;&#1604;&#1608;&#1576;</span><strong>${order.totalRawOrdered}</strong></div><div class="metric"><span>&#1582;&#1585;&#1580; &#1605;&#1606; &#1575;&#1604;&#1606;&#1587;&#1610;&#1580; &#1573;&#1604;&#1609; &#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</span><strong>${order.totalRawReceived}</strong></div><div class="metric"><span>&#1582;&#1575;&#1605; &#1605;&#1578;&#1575;&#1581; &#1576;&#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</span><strong>${order.rawAtDyehouseAvailable}</strong></div><div class="metric"><span>&#1583;&#1582;&#1604; &#1575;&#1604;&#1605;&#1582;&#1586;&#1606; &#1605;&#1606; &#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</span><strong>${order.totalFinishedReceived}</strong></div><div class="metric emphasis"><span>&#1585;&#1589;&#1610;&#1583; &#1575;&#1604;&#1605;&#1582;&#1586;&#1606;</span><strong>${order.warehouseBalance}</strong></div><div class="metric"><span>&#1578;&#1605; &#1578;&#1587;&#1604;&#1610;&#1605;&#1607; &#1604;&#1604;&#1593;&#1605;&#1610;&#1604;</span><strong>${order.totalDeliveredToCustomer}</strong></div><div class="metric"><span>مرتجع خام للنسيج</span><strong>${order.totalRawReturnedToWeaving}</strong></div><div class="metric"><span>هالك تقديري</span><strong>${order.expectedWasteQuantity} (${order.expectedWastePercent}%)</strong></div><div class="metric"><span>هالك فعلي</span><strong>${order.totalWaste} (${formatNumber(order.totalWastePercent || 0, 1)}%)</strong></div></div>${order.widthMode === 'multiple' ? `<div class="subsection"><div class="subsection-head"><h3>توزيع العروض</h3></div>${order.widthDistributionMatches ? '' : `<div class="warning">تنبيه: مجموع العروض لا يطابق إجمالي الطلب</div>`}<div class="table-wrap"><table class="allocation-table"><thead><tr><th>البوصة</th><th>العرض</th><th>الكمية</th></tr></thead><tbody>${order.widthLines.map((item)=>`<tr><td>${item.inch}</td><td>${item.width}</td><td>${item.quantity}</td></tr>`).join('')}</tbody></table></div></div>` : ''}<div class="subsection"><div class="subsection-head"><div><h3>&#1582;&#1591;&#1577; &#1578;&#1608;&#1586;&#1610;&#1593; &#1575;&#1604;&#1571;&#1604;&#1608;&#1575;&#1606;</h3><p class="eyebrow">${order.totalAllocated} / ${order.totalRawReceived} &#1603;&#1580;&#1605; &#1605;&#1606; &#1575;&#1604;&#1582;&#1575;&#1605; &#1575;&#1604;&#1605;&#1587;&#1578;&#1604;&#1605;</p></div><button class="mini-btn" id="addAllocationBtn">+ &#1573;&#1590;&#1575;&#1601;&#1577; &#1604;&#1608;&#1606;</button></div><div class="allocation-bar"><div class="allocation-fill" style="width:${allocationPercent}%"></div></div>${order.allocationExceedsRaw ? `<div class="warning">&#1603;&#1605;&#1610;&#1577; &#1575;&#1604;&#1589;&#1576;&#1575;&#1594;&#1577; &#1575;&#1604;&#1605;&#1582;&#1591;&#1591;&#1577; &#1571;&#1603;&#1576;&#1585; &#1605;&#1606; &#1603;&#1605;&#1610;&#1577; &#1575;&#1604;&#1582;&#1575;&#1605; &#1575;&#1604;&#1605;&#1578;&#1575;&#1581;&#1577;</div>` : ''}<div class="table-wrap"><table class="allocation-table"><thead><tr><th>&#1575;&#1604;&#1604;&#1608;&#1606;</th><th>&#1575;&#1604;&#1605;&#1582;&#1591;&#1591;</th><th>&#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</th><th>&#1575;&#1604;&#1593;&#1585;&#1590;</th><th>&#1575;&#1604;&#1608;&#1586;&#1606; &#1605;&#1580;&#1607;&#1586;</th>${order.accessoryLines.length ? `<th>${accessoryTypesLabel(order)}</th>` : ''}<th>&#1578;&#1605; &#1578;&#1588;&#1594;&#1610;&#1604;&#1607;</th><th>&#1583;&#1582;&#1604; &#1575;&#1604;&#1605;&#1582;&#1586;&#1606;</th><th>هالك تقديري</th><th>هالك فعلي</th><th>إجراء</th></tr></thead><tbody>${order.allocations.map((allocation)=>`<tr><td>${allocation.color}</td><td>${allocation.plannedQuantity}</td><td>${allocation.dyehouse}</td><td>${allocation.targetFinishedWidth}</td><td>${allocation.targetFinishedWeight}</td>${order.accessoryLines.length ? `<td>${allocation.accessoryQuantity}</td>` : ''}<td>${allocation.sentToDyehouse}</td><td>${allocation.finishedReceived}</td><td>${allocation.expectedWasteQuantity || 0} (${allocation.expectedWastePercent || 0}%)</td><td>${allocation.wasteQuantity} (${formatNumber(allocation.wastePercent || 0, 1)}%)</td><td><div class="batch-actions"><button class="mini-btn" data-edit-allocation="${allocation.id}">&#1578;&#1593;&#1583;&#1610;&#1604;</button><button class="mini-btn" data-transfer-allocation="${allocation.id}">&#1606;&#1602;&#1604; &#1605;&#1589;&#1576;&#1594;&#1577;</button><button class="mini-btn danger" data-delete-allocation="${allocation.id}">&#1581;&#1584;&#1601;</button></div></td></tr>`).join('')}</tbody></table></div></div>${inventorySection}<div class="batch-grid compact"><div class="batch-box"><h3>خروج خام</h3><form class="batch-form" data-form="raw"><select name="movementKind" class="full"><option value="out">خروج خام للمصبغة</option><option value="return">ارتجاع خام للنسيج</option></select><input name="date" type="date" required>${order.widthMode === 'multiple' ? `<select name="widthLineId" data-out-only><option value="">اختر العرض عند خروج الخام</option>${order.widthLines.map((item)=>`<option value="${item.id}">بوصة ${item.inch} - عرض ${item.width} - كمية ${item.quantity}</option>`).join('')}</select>` : ''}<select name="allocationId" data-return-only class="field-hidden"><option value="">اختر اللون / المصبغة للمرتجع</option>${order.allocations.map((allocation)=>`<option value="${allocation.id}">${allocationOptionLabel(order, allocation)}</option>`).join('')}</select><input name="quantity" type="number" step="0.01" placeholder="الكمية" required><input name="supplier" placeholder="مصدر النسيج" value="${order.weavingSource}"><input name="noteNumber" placeholder="رقم إذن"><input class="full" name="notes" placeholder="ملاحظات"><label class="full batch-file-label" data-out-only><span>صورة إذن الخام</span><input name="sourceDocumentFile" type="file" accept="image/*"></label><button class="mini-btn full">إضافة حركة</button></form><div class="batch-list">${rawItems}</div></div>${order.accessoryLines.length ? `<div class="batch-box"><h3>خروج إكسسوار</h3><form class="batch-form" data-form="accessory"><input name="date" type="date" required>${accessoryTypeSelectHtml(order)}<input name="quantity" type="number" step="0.01" placeholder="الكمية" required><input name="noteNumber" placeholder="رقم إذن"><input class="full" name="notes" placeholder="ملاحظات"><button class="mini-btn full">إضافة خروج</button></form><div class="batch-list">${accessoryItems}</div></div><div class="batch-box"><h3>استلام إكسسوار</h3><form class="batch-form" data-form="accessoryReceived"><input name="date" type="date" required>${accessoryTypeSelectHtml(order)}<select name="allocationId" required><option value="">اختر اللون</option>${order.allocations.map((allocation)=>`<option value="${allocation.id}">${allocationColorLabel(order, allocation)}</option>`).join('')}</select><input name="quantity" type="number" step="0.01" placeholder="الكمية المستلمة" required><input name="noteNumber" placeholder="رقم إذن"><input class="full" name="notes" placeholder="ملاحظات"><button class="mini-btn full">إضافة استلام</button></form><div class="batch-list">${accessoryReceivedItems}</div></div>` : ''}<div class="batch-box"><h3>استلام مجهز</h3><form class="batch-form" data-form="production"><select name="allocationId"><option value="raw">&#1575;&#1582;&#1578;&#1585; &#1575;&#1604;&#1604;&#1608;&#1606; / &#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</option>${order.allocations.map((allocation)=>`<option value="${allocation.id}">${allocationOptionLabel(order, allocation)}</option>`).join('')}</select><input name="date" type="date" required><input name="quantity" type="number" step="0.01" placeholder="&#1575;&#1604;&#1603;&#1605;&#1610;&#1577; &#1575;&#1604;&#1605;&#1587;&#1578;&#1604;&#1605;&#1577;" required><input name="noteNumber" placeholder="&#1585;&#1602;&#1605; &#1573;&#1584;&#1606; &#1575;&#1604;&#1575;&#1587;&#1578;&#1604;&#1575;&#1605;"><input class="full" name="notes" placeholder="&#1605;&#1604;&#1575;&#1581;&#1592;&#1575;&#1578;"><button class="mini-btn full">&#1573;&#1590;&#1575;&#1601;&#1577; &#1575;&#1587;&#1578;&#1604;&#1575;&#1605;</button></form><div class="batch-list">${productionItems}</div></div><div class="batch-box"><h3>تسليم عميل</h3><form class="batch-form" data-form="customer"><select name="movementKind" class="full"><option value="cloth">تسليم قماش</option>${order.accessoryLines.length ? '<option value="accessory">تسليم إكسسوار</option>' : ''}</select><select name="allocationId">${order.allocations.map((allocation)=>`<option value="${allocation.id}">${allocationColorLabel(order, allocation)}</option>`).join('')}</select><input name="date" type="date" required>${order.accessoryLines.length ? `<span data-accessory-only class="field-hidden">${accessoryTypeSelectHtml(order)}</span>` : ''}<input name="quantity" type="number" step="0.01" placeholder="&#1575;&#1604;&#1603;&#1605;&#1610;&#1577;" required><input class="full" name="notes" placeholder="&#1605;&#1604;&#1575;&#1581;&#1592;&#1575;&#1578;"><button class="mini-btn full">&#1573;&#1590;&#1575;&#1601;&#1577; &#1581;&#1585;&#1603;&#1577;</button></form><div class="batch-list">${customerItems}</div></div><div class="batch-box"><h3>&#1578;&#1581;&#1608;&#1610;&#1604;&#1575;&#1578; &#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</h3><p class="eyebrow">&#1578;&#1587;&#1580;&#1610;&#1604; &#1571;&#1610; &#1606;&#1602;&#1604; &#1605;&#1606; &#1605;&#1589;&#1576;&#1594;&#1577; &#1604;&#1571;&#1582;&#1585;&#1609; &#1576;&#1583;&#1608;&#1606; &#1601;&#1602;&#1583;&#1575;&#1606; &#1575;&#1604;&#1578;&#1575;&#1585;&#1610;&#1582;.</p><div class="batch-list">${transferItems}</div></div></div>`;
  refs.orderDetailsPanel.insertAdjacentHTML('beforeend', renderReportSendStatus(order));  refs.orderDetailsPanel.querySelectorAll('form[data-form="raw"]').forEach(updateRawMovementVisibility);
  refs.orderDetailsPanel.querySelectorAll('form[data-form="customer"]').forEach(updateCustomerDeliveryFields);
  repairOrderDetailsArabic(order);
  renderDocuments();
}
async function toggleOperationClosed() {
  const order = orders.find((item)=>item.id===selectedOrderId);
  if (!order) return;
  if (!(await ensureBackendForWrite())) return;
  const backendSaveRequired = true;
  const updatedOrder = { ...order, operationClosed: !order.operationClosed };
  if (backendSaveRequired) {
    const backendCustomer = await ensureBackendCustomer(updatedOrder.customer);
    const savedOrder = await putBackend(`/orders/${updatedOrder.id}`, orderToApi(updatedOrder, backendCustomer));
    if (!savedOrder) {
      await rollbackAfterBackendWriteFailure('تعذر حفظ حالة دورة التشغيل في قاعدة البيانات. لم يتم اعتماد التعديل.');
      return;
    }
  }
  selectedOrderId = updatedOrder.id;
  await loadBackendData();
}
function fillOrderForm(order) {
  refs.orderNumber.value = order.orderNumber || '';
  if (refs.productCode) refs.productCode.value = order.productCode || buildItemCode(order.orderNumber);
  refs.customer.value = order.customer || '';
  refs.orderDate.value = order.orderDate || '';
  refs.fabricType.value = order.fabricType || '';
  refs.totalRawQuantity.value = order.totalRawQuantity || '';
  if (refs.expectedWastePercent) refs.expectedWastePercent.value = order.expectedWastePercent || '';
  refs.widthMode.value = order.widthMode || 'single';
  refs.inchWidth.value = order.inchWidth || '';
  renderWidthLinesEditor(order.widthLines || []);
  syncWidthModeUi();
  refs.kiloPrice.value = order.kiloPrice || '';
  refs.paymentTerms.value = order.paymentTerms || '';
  refs.dyehouse.value = order.dyehouse || '';
  refs.weavingSource.value = order.weavingSource || '';
  refs.accessoryType.value = order.accessoryType || '';
  refs.accessoryPercent.value = order.accessoryPercent || 0;
  renderAccessoryLinesEditor(orderAccessoryConfig(order));
  refs.orderNotes.value = order.notes || '';
}
async function addOrder(event) {
  event.preventDefault();
  const widthLines = refs.widthMode.value === 'multiple' ? readWidthLinesFromEditor() : [];
  if (refs.widthMode.value === 'multiple' && widthLines.length === 0) { alert('أضف عرضًا واحدًا على الأقل عند اختيار أكثر من عرض.'); return; }
  const currentOrder = editingOrderId ? orders.find((order)=>order.id === editingOrderId) : null;
  const accessoryLines = readAccessoryLinesFromEditor();
  const firstAccessory = accessoryLines[0] || {};
  const payload = { pricingId: currentOrder?.pricingId || pendingConvertedPricingId || '', orderNumber:refs.orderNumber.value, productCode:buildItemCode(refs.orderNumber.value), customer:refs.customer.value, orderDate:refs.orderDate.value, fabricType:refs.fabricType.value, totalRawQuantity:+refs.totalRawQuantity.value, expectedWastePercent:+refs.expectedWastePercent.value || 0, widthMode:refs.widthMode.value, inchWidth:refs.inchWidth.value, widthLines, kiloPrice:+refs.kiloPrice.value, rawCost:orderRawCost({ ...currentOrder, orderNumber:refs.orderNumber.value }), paymentTerms:refs.paymentTerms.value, accessoryType:firstAccessory.type || refs.accessoryType.value, accessoryPercent:+(firstAccessory.percent ?? refs.accessoryPercent.value) || 0, accessoryLines, dyehouse:refs.dyehouse.value, weavingSource:refs.weavingSource.value, notes:refs.orderNotes.value };
  if (!(await ensureBackendForWrite())) return;
  const backendSaveRequired = true;
  const backendCustomer = await ensureBackendCustomer(payload.customer);
  if (editingOrderId) {
    const previousDyehouse = String(currentOrder?.dyehouse || '').trim();
    const transferredAllocationIds = new Set(dyehouseTransfers
      .filter((transfer)=>transfer.orderId === editingOrderId)
      .flatMap((transfer)=>[transfer.allocationId, transfer.newAllocationId])
      .filter(Boolean));
    const updatedOrder = { ...currentOrder, ...payload };
    const updatedAllocations = allocations.map((allocation) => {
      if (allocation.orderId !== editingOrderId) return allocation;
      const allocationDyehouse = String(allocation.dyehouse || '').trim();
      if (transferredAllocationIds.has(allocation.id) || (previousDyehouse && allocationDyehouse !== previousDyehouse)) return allocation;
      return { ...allocation, dyehouse: payload.dyehouse };
    });
    const savedOrder = await putBackend(`/orders/${editingOrderId}`, orderToApi(updatedOrder, backendCustomer));
    if (backendSaveRequired && !savedOrder) {
      await rollbackAfterBackendWriteFailure('تعذر حفظ تعديل الطلب في قاعدة البيانات. لم يتم اعتماد التعديل.');
      return;
    }
    const changedAllocations = updatedAllocations.filter((allocation) => {
      const original = allocations.find((item)=>item.id === allocation.id);
      return original && original.dyehouse !== allocation.dyehouse;
    });
    for (const allocation of changedAllocations) {
      const savedAllocation = await putBackend(`/allocations/${allocation.id}`, allocationToApi(allocation));
      if (backendSaveRequired && !savedAllocation) {
        await rollbackAfterBackendWriteFailure('تم حفظ الطلب، لكن تعذر تحديث مصبغة الألوان المرتبطة في قاعدة البيانات. لم يتم اعتماد التعديل كاملًا.');
        return;
      }
    }
    selectedOrderId = editingOrderId;
  } else {
    const newOrder = { id:uid(), status:'pending', ...payload };
    const savedOrder = await postBackend('/orders', orderToApi(newOrder, backendCustomer));
    if (backendSaveRequired && !savedOrder) {
      await rollbackAfterBackendWriteFailure('تعذر حفظ الطلب الجديد في قاعدة البيانات. لم يتم اعتماد الطلب.');
      return;
    }
    selectedOrderId = savedOrder.id || newOrder.id;
    const pricingMarked = await markPricingConverted(payload.orderNumber, newOrder.id, payload.pricingId);
    if (backendSaveRequired && !pricingMarked) {
      await rollbackAfterBackendWriteFailure('تم حفظ الطلب، لكن تعذر تحديث حالة التسعيرة في قاعدة البيانات. راجع الطلب والتسعيرة قبل المتابعة.');
      return;
    }
  }
  editingOrderId = null;
  pendingConvertedPricingId = null;
  await loadBackendData();
  refs.orderDialog.close();
}
async function addBatch(event) {
  event.preventDefault();
  const type = event.target.dataset.form;
  const data = Object.fromEntries(new FormData(event.target).entries());
  const rawDocumentFile = event.target.elements.sourceDocumentFile?.files?.[0] || null;
  delete data.sourceDocumentFile;
  data.id = uid(); data.quantity = +data.quantity;
  data.orderId = selectedOrderId;
  if (!(await ensureBackendForWrite())) return;
  const backendSaveRequired = true;
  let backendResult = true;
  if (type === 'raw') {
    const currentOrder = calculateOrder(orders.find((item)=>item.id===selectedOrderId));
    if (data.movementKind === 'return') {
      if (!data.allocationId) { alert('اختر اللون / المصبغة قبل تسجيل مرتجع الخام.'); return; }
      backendResult = await postBackend('/batches/raw-return', { ...batchToApi(data), reason:data.reason || data.notes || '' });
    } else {
      if (currentOrder.widthMode === 'multiple' && !data.widthLineId) { alert('اختر العرض المرتبط قبل تسجيل خروج الخام.'); return; }
      if (rawDocumentFile) data.sourceDocument = { type:'raw-batch-image', image: await resizeSlipImage(rawDocumentFile) };
      backendResult = await postBackend('/batches/dyehouse', batchToApi(data));
    }
  }
  if (type === 'rawReturn') {
    if (!data.allocationId) { alert('اختر اللون / المصبغة قبل تسجيل مرتجع الخام.'); return; }
    backendResult = await postBackend('/batches/raw-return', { ...batchToApi(data), reason:data.reason || data.notes || '' });
  }
  if (type === 'accessory') {
    if (!data.accessoryType) { alert('اختر نوع الإكسسوار أولًا.'); return; }
    data.movement = 'sent'; delete data.allocationId;
    backendResult = await postBackend('/batches/accessory', batchToApi(data));
  }
  if (type === 'accessoryReceived') {
    if (!data.accessoryType) { alert('اختر نوع الإكسسوار أولًا.'); return; }
    if (!data.allocationId) { alert('اختر اللون المرتبط باستلام الإكسسوار.'); return; }
    data.movement = 'received';
    backendResult = await postBackend('/batches/accessory', batchToApi(data));
  }
  if (type === 'production') {
    if (!data.allocationId || data.allocationId === 'raw') { alert('اختر اللون / المصبغة قبل تسجيل استلام المجهز.'); return; }
    backendResult = await postBackend('/batches/finished', batchToApi(data));
  }
  if (type === 'finished') {
    const allocation = calculateAllocation(allocations.find((item)=>item.id===data.allocationId));
    if (data.quantity > allocation.remainingAtDyehouse) { data.notes = [data.notes, 'تنبيه: الكمية المستلمة أكبر من المتبقي داخل المصبغة'].filter(Boolean).join(' - '); }
    data.finishedWidth = +data.finishedWidth; data.finishedWeight = +data.finishedWeight;
    backendResult = await postBackend('/batches/finished', batchToApi(data));
  }
  if (type === 'customer') {
    if (data.movementKind === 'accessory') {
      if (!data.accessoryType) { alert('اختر نوع الإكسسوار أولًا.'); return; }
      if (!data.allocationId) { alert('اختر اللون المرتبط بتسليم الإكسسوار.'); return; }
      data.movement = 'customer';
      const receivedAccessory = sum(accessoryBatches.filter((batch)=>batch.allocationId===data.allocationId && batch.movement==='received' && batch.accessoryType===data.accessoryType));
      const deliveredAccessory = sum(accessoryBatches.filter((batch)=>batch.allocationId===data.allocationId && batch.movement==='customer' && batch.accessoryType===data.accessoryType));
      const availableAccessory = Math.max(receivedAccessory - deliveredAccessory, 0);
      if (data.quantity > availableAccessory) { data.notes = [data.notes, 'تنبيه: كمية الإكسسوار المسلمة أكبر من الرصيد المتاح'].filter(Boolean).join(' - '); }
      backendResult = await postBackend('/batches/accessory', batchToApi(data));
    } else {
      const allocation = calculateAllocation(allocations.find((item)=>item.id===data.allocationId));
      const alreadyDelivered = sum(customerBatches.filter((batch)=>batch.allocationId===data.allocationId));
      const warehouseAvailable = Math.max(allocation.finishedReceived - alreadyDelivered, 0);
      if (data.quantity > warehouseAvailable) { data.notes = [data.notes, 'تنبيه: كمية التسليم أكبر من رصيد المخزن المتاح'].filter(Boolean).join(' - '); }
      backendResult = await postBackend('/batches/customer', batchToApi(data));
    }
  }
  if (backendSaveRequired && !backendResult) {
    await rollbackAfterBackendWriteFailure('تعذر حفظ الحركة في قاعدة البيانات. لم يتم اعتماد الحركة.');
    return;
  }
  event.target.reset();
  await loadBackendData();
}
async function addAllocation() {
  const order = calculateOrder(orders.find((item)=>item.id===selectedOrderId));
  const color = prompt('اكتب اللون المطلوب'); if (!color) return;
  const createdAllocations = [];
  if (!(await ensureBackendForWrite())) return;
  const backendSaveRequired = true;
  if (order.widthMode === 'multiple') {
    const targetFinishedWeight = Number(prompt('اكتب الوزن المجهز المطلوب')); if (!targetFinishedWeight) return;
    order.widthLines.forEach((widthLine) => { const allocation = { id:uid(), orderId:order.id, color, plannedQuantity:widthLine.quantity, dyehouse:order.dyehouse, targetFinishedWidth:widthLine.width, targetFinishedWeight, widthLineId:widthLine.id, rawInch:widthLine.inch, rawWidth:widthLine.width }; createdAllocations.push(allocation); });
  } else {
    const plannedQuantity = Number(prompt('اكتب كمية اللون')); if (!plannedQuantity) return;
    const existing = order.allocations[0];
    const targetFinishedWidth = existing?.targetFinishedWidth || Number(prompt('اكتب العرض')); if (!targetFinishedWidth) return;
    const targetFinishedWeight = existing?.targetFinishedWeight || Number(prompt('اكتب الوزن المجهز')); if (!targetFinishedWeight) return;
    const allocation = { id:uid(), orderId:order.id, color, plannedQuantity, dyehouse:order.dyehouse, targetFinishedWidth, targetFinishedWeight };
    createdAllocations.push(allocation);
  }
  const savedAllocations = [];
  for (const allocation of createdAllocations) savedAllocations.push(await postBackend(`/orders/${order.id}/allocations`, allocationToApi(allocation)));
  if (backendSaveRequired && savedAllocations.some((item)=>!item)) {
    await rollbackAfterBackendWriteFailure('تعذر حفظ اللون في قاعدة البيانات. لم يتم اعتماد الإضافة.');
    return;
  }
  await loadBackendData();
}
async function editAllocation(id) {
  const allocation = allocations.find((item)=>item.id===id);
  if (!allocation) return;
  const order = orders.find((item)=>item.id===allocation.orderId);
  const colorValue = prompt('اكتب اللون / كود اللون', allocation.color || allocation.pantoneCode || '');
  if (colorValue === null) return;
  const cleanedColor = colorValue.trim();
  if (!cleanedColor) return;
  const targetFinishedWidth = Number(prompt('اكتب العرض', allocation.targetFinishedWidth));
  if (!targetFinishedWidth) return;
  const targetFinishedWeight = Number(prompt('اكتب الوزن المجهز', allocation.targetFinishedWeight));
  if (!targetFinishedWeight) return;
  if (!(await ensureBackendForWrite())) return;
  const backendSaveRequired = true;
  const changedAllocations = new Set();

  const primaryUpdate = { ...allocation, color:cleanedColor, pantoneCode:cleanedColor };
  changedAllocations.add(primaryUpdate);

  if (order?.widthMode !== 'multiple') {
    allocations.filter((item)=>item.orderId===allocation.orderId).forEach((item)=>{
      changedAllocations.add({
        ...item,
        color: item.id === allocation.id ? cleanedColor : item.color,
        pantoneCode: item.id === allocation.id ? cleanedColor : item.pantoneCode,
        targetFinishedWidth,
        targetFinishedWeight,
      });
    });
  } else {
    changedAllocations.delete(primaryUpdate);
    changedAllocations.add({ ...primaryUpdate, targetFinishedWidth, targetFinishedWeight });
  }
  if (backendSaveRequired) {
    const savedAllocations = [];
    for (const item of changedAllocations) savedAllocations.push(await putBackend(`/allocations/${item.id}`, allocationToApi(item)));
    if (savedAllocations.some((item)=>!item)) {
      await rollbackAfterBackendWriteFailure('تعذر حفظ تعديل اللون في قاعدة البيانات. لم يتم اعتماد التعديل.');
      return;
    }
  }
  await loadBackendData();
}

async function transferAllocationDyehouse(id) {
  const allocation = allocations.find((item)=>item.id===id);
  if (!allocation) return;
  const order = calculateOrder(orders.find((item)=>item.id===allocation.orderId));
  const calculated = order.allocations.find((item)=>item.id===id) || calculateAllocation(allocation);
  const currentDyehouse = allocation.dyehouse || order.dyehouse || '';
  const newDyehouseValue = prompt('\u0627\u0644\u0645\u0635\u0628\u063a\u0629 \u0627\u0644\u062c\u062f\u064a\u062f\u0629', currentDyehouse);
  if (newDyehouseValue === null) return;
  const newDyehouse = newDyehouseValue.trim();
  if (!newDyehouse) return;
  if (newDyehouse === currentDyehouse) { alert('\u0627\u0644\u0645\u0635\u0628\u063a\u0629 \u0644\u0645 \u062a\u062a\u063a\u064a\u0631.'); return; }
  const originalQuantity = Number(allocation.plannedQuantity || 0);
  const suggestedQuantity = Math.max(originalQuantity - Number(calculated.sentToDyehouse || 0), 0) || originalQuantity || '';
  const quantityValue = prompt('\u0627\u0644\u0643\u0645\u064a\u0629 \u0627\u0644\u0645\u062d\u0648\u0644\u0629', suggestedQuantity);
  if (quantityValue === null) return;
  const quantity = Number(quantityValue);
  if (!quantity || quantity <= 0) { alert('\u0627\u062f\u062e\u0644 \u0643\u0645\u064a\u0629 \u0635\u062d\u064a\u062d\u0629 \u0644\u0644\u062a\u062d\u0648\u064a\u0644.'); return; }
  const transferWarnings = [];
  if (quantity > originalQuantity) transferWarnings.push('\u062a\u0646\u0628\u064a\u0647: \u0643\u0645\u064a\u0629 \u0627\u0644\u062a\u062d\u0648\u064a\u0644 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0643\u0645\u064a\u0629 \u0627\u0644\u0645\u062e\u0637\u0637\u0629 \u0644\u0647\u0630\u0627 \u0627\u0644\u0644\u0648\u0646.');
  if (quantity > Math.max(originalQuantity - Number(calculated.sentToDyehouse || 0), 0)) transferWarnings.push('\u062a\u0646\u0628\u064a\u0647: \u0643\u0645\u064a\u0629 \u0627\u0644\u062a\u062d\u0648\u064a\u0644 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u062e\u0627\u0645 \u0627\u0644\u0645\u062a\u0627\u062d \u063a\u064a\u0631 \u0627\u0644\u0645\u0631\u0633\u0644 \u0644\u0644\u0645\u0635\u0628\u063a\u0629.');
  const dateValue = prompt('\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u062a\u062d\u0648\u064a\u0644', new Date().toISOString().slice(0,10));
  if (dateValue === null) return;
  const noteNumber = prompt('\u0631\u0642\u0645 \u0625\u0630\u0646 \u0627\u0644\u062a\u062d\u0648\u064a\u0644', '') || '';
  const reason = prompt('\u0633\u0628\u0628 \u0627\u0644\u062a\u062d\u0648\u064a\u0644', '\u062a\u062d\u0648\u064a\u0644 \u0645\u0635\u0628\u063a\u0629') || '';
  const newAllocationId = uid();
  const roundedQuantity = roundNumber(quantity);
  let transferRecord = null;
  let allocationUpdate = null;
  let newAllocation = null;
  if (!(await ensureBackendForWrite())) return;
  const backendSaveRequired = true;
  if (roundedQuantity >= originalQuantity) {
    allocationUpdate = { ...allocation, dyehouse:newDyehouse };
    transferRecord = { id:uid(), orderId:allocation.orderId, allocationId:id, newAllocationId:null, color:allocation.color || allocation.pantoneCode || '', fromDyehouse:currentDyehouse, toDyehouse:newDyehouse, quantity:roundNumber(originalQuantity), date:dateValue, reason: [reason, ...transferWarnings].filter(Boolean).join(' - '), noteNumber, mode:'full' };
  } else {
    const ratio = originalQuantity ? roundedQuantity / originalQuantity : 0;
    const originalAccessory = Number(allocation.accessoryQuantityManual || 0);
    const newAccessory = originalAccessory ? roundNumber(originalAccessory * ratio) : allocation.accessoryQuantityManual;
    allocationUpdate = { ...allocation, plannedQuantity:roundNumber(originalQuantity - roundedQuantity), accessoryQuantityManual:originalAccessory ? roundNumber(originalAccessory - Number(newAccessory || 0)) : allocation.accessoryQuantityManual };
    newAllocation = { ...allocation, id:newAllocationId, plannedQuantity:roundedQuantity, dyehouse:newDyehouse, accessoryQuantityManual:newAccessory };
    transferRecord = { id:uid(), orderId:allocation.orderId, allocationId:id, newAllocationId, color:allocation.color || allocation.pantoneCode || '', fromDyehouse:currentDyehouse, toDyehouse:newDyehouse, quantity:roundedQuantity, date:dateValue, reason, noteNumber, mode:'split' };
  }
  if (backendSaveRequired) {
    const updatedAllocation = allocationUpdate ? await putBackend(`/allocations/${id}`, allocationToApi(allocationUpdate)) : true;
    const insertedAllocation = newAllocation ? await postBackend(`/orders/${allocation.orderId}/allocations`, allocationToApi(newAllocation)) : true;
    const insertedTransfer = transferRecord ? await postBackend('/transfers', transferToApi(transferRecord)) : true;
    if (!updatedAllocation || !insertedAllocation || !insertedTransfer) {
      await rollbackAfterBackendWriteFailure('تعذر حفظ تحويل المصبغة في قاعدة البيانات. لم يتم اعتماد التحويل.');
      return;
    }
  }
  await loadBackendData();
}
async function deleteAllocation(id) {
  const allocation = allocations.find((item)=>item.id===id);
  if (!allocation) return;
  if (!confirm(`هل تريد حذف اللون ${allocation.color || allocation.pantoneCode || '-'}؟ سيتم حذف الحركات المرتبطة به من هذا الطلب.`)) return;
  if (!(await ensureBackendForWrite())) return;
  const backendSaveRequired = true;
  if (backendSaveRequired) {
    const deleted = await deleteBackend(`/allocations/${id}`);
    if (!deleted) {
      await rollbackAfterBackendWriteFailure('تعذر حذف اللون من قاعدة البيانات. لم يتم اعتماد الحذف.');
      return;
    }
  }
  recordAudit('delete', 'allocation', id, allocation, null, `حذف اللون ${allocation.color || allocation.pantoneCode || '-'}`);
  await persistAuditLog();
  await loadBackendData();
}
async function deleteOrder(id) {
  const order = orders.find((item)=>item.id===id);
  if (!order) return;
  if (!confirm(`هل تريد حذف الطلب رقم ${order.orderNumber || '-'}؟ سيتم حذف الألوان والحركات المرتبطة به.`)) return;
  if (!(await ensureBackendForWrite())) return;
  const backendSaveRequired = true;
  if (backendSaveRequired) {
    const deleted = await deleteBackend(`/orders/${id}`);
    if (!deleted) {
      await rollbackAfterBackendWriteFailure('تعذر حذف الطلب من قاعدة البيانات. لم يتم اعتماد الحذف.');
      return;
    }
  }
  recordAudit('delete', 'order', id, order, null, `حذف الطلب رقم ${order.orderNumber || ''}`);
  await persistAuditLog();
  if (selectedOrderId === id) selectedOrderId = null;
  await loadBackendData();
}
async function deleteBatch(type, id) {
  if (!confirm('هل تريد حذف هذه الحركة؟ سيتم حذفها من قاعدة البيانات أيضًا.')) return;
  if (!(await ensureBackendForWrite())) return;
  const backendSaveRequired = true;
  let transfer = null;
  if (type === 'transfer') {
    transfer = dyehouseTransfers.find((batch)=>String(batch.id) === String(id));
    if (transfer) {
      if (transfer.mode === 'split' && transfer.newAllocationId) {
        const newAllocation = allocations.find((allocation)=>allocation.id === transfer.newAllocationId);
        const originalAllocation = allocations.find((allocation)=>allocation.id === transfer.allocationId);
        const hasLinkedMovements = [
          ...rawReturns,
          ...dyeBatches,
          ...productionBatches,
          ...finishedBatches,
          ...customerBatches,
          ...accessoryBatches,
        ].some((batch)=>batch.allocationId === transfer.newAllocationId);
        if (newAllocation && originalAllocation && !hasLinkedMovements) {
          const newQty = Number(newAllocation.plannedQuantity || transfer.quantity || 0);
          originalAllocation.plannedQuantity = roundNumber(Number(originalAllocation.plannedQuantity || 0) + newQty);
          if (originalAllocation.accessoryQuantityManual !== null && originalAllocation.accessoryQuantityManual !== undefined && newAllocation.accessoryQuantityManual !== null && newAllocation.accessoryQuantityManual !== undefined) {
            originalAllocation.accessoryQuantityManual = roundNumber(Number(originalAllocation.accessoryQuantityManual || 0) + Number(newAllocation.accessoryQuantityManual || 0));
          }
          allocations = allocations.filter((allocation)=>allocation.id !== transfer.newAllocationId);
        } else if (hasLinkedMovements) {
          alert('لا يمكن حذف التحويل لأن اللون المحول عليه توجد عليه حركات تشغيل. احذف الحركات المرتبطة أولًا أو اترك التحويل كما هو.');
          return;
        }
      } else if (transfer.mode === 'full' && transfer.allocationId) {
        allocations = allocations.map((allocation)=>allocation.id === transfer.allocationId ? { ...allocation, dyehouse:transfer.fromDyehouse || allocation.dyehouse } : allocation);
      }
    }
  }
  if (backendSaveRequired) {
    const backendTasks = [];
    if (type === 'transfer') {
      backendTasks.push(deleteBackend(`/transfers/${id}`));
      if (transfer?.allocationId) {
        const originalAllocation = allocations.find((allocation)=>allocation.id === transfer.allocationId);
        if (originalAllocation) backendTasks.push(putBackend(`/allocations/${originalAllocation.id}`, allocationToApi(originalAllocation)));
      }
      if (transfer?.mode === 'split' && transfer.newAllocationId) backendTasks.push(deleteBackend(`/allocations/${transfer.newAllocationId}`));
    } else {
      backendTasks.push(deleteBackend(`/batches/${backendBatchType(type)}/${id}`));
    }
    const results = await Promise.all(backendTasks);
    if (results.some((item)=>!item)) {
      await rollbackAfterBackendWriteFailure('تعذر حذف الحركة من قاعدة البيانات. لم يتم اعتماد الحذف.');
      return;
    }
  }
  await loadBackendData();
}
async function editBatch(type, id) {
  const collection = type === 'raw' ? rawBatches : type === 'accessory' ? accessoryBatches : type === 'transfer' ? dyehouseTransfers : type === 'rawReturn' ? rawReturns : type === 'production' ? productionBatches : type === 'customer' ? customerBatches : finishedBatches;
  const batch = collection.find((item)=>item.id===id); if (!batch) return;
  if (!(await ensureBackendForWrite())) return;
  const backendSaveRequired = true;
  const updatedBatch = { ...batch };
  const quantity = Number(prompt('الكمية', updatedBatch.quantity)); if (!quantity) return; updatedBatch.quantity = quantity;
  updatedBatch.date = prompt('التاريخ', updatedBatch.date) || updatedBatch.date;
  if (type === 'raw') { updatedBatch.supplier = prompt('الجهة / المصدر', updatedBatch.supplier) || updatedBatch.supplier; updatedBatch.noteNumber = prompt('رقم الإذن', updatedBatch.noteNumber || '') || ''; updatedBatch.notes = prompt('ملاحظات', updatedBatch.notes || '') || ''; }
  if (type === 'transfer') { updatedBatch.fromDyehouse = prompt('\u0645\u0646 \u0645\u0635\u0628\u063a\u0629', updatedBatch.fromDyehouse || '') || updatedBatch.fromDyehouse; updatedBatch.toDyehouse = prompt('\u0625\u0644\u0649 \u0645\u0635\u0628\u063a\u0629', updatedBatch.toDyehouse || '') || updatedBatch.toDyehouse; updatedBatch.noteNumber = prompt('\u0631\u0642\u0645 \u0625\u0630\u0646 \u0627\u0644\u062a\u062d\u0648\u064a\u0644', updatedBatch.noteNumber || '') || ''; updatedBatch.reason = prompt('\u0633\u0628\u0628 \u0627\u0644\u0646\u0642\u0644', updatedBatch.reason || '') || ''; }
  if (type === 'rawReturn') { updatedBatch.noteNumber = prompt('رقم إذن المرتجع', updatedBatch.noteNumber || '') || ''; updatedBatch.notes = prompt('ملاحظات', updatedBatch.notes || '') || ''; }
  if (type === 'accessory') { updatedBatch.accessoryType = prompt('نوع الإكسسوار', updatedBatch.accessoryType) || updatedBatch.accessoryType; updatedBatch.noteNumber = prompt('رقم الإذن', updatedBatch.noteNumber || '') || ''; updatedBatch.notes = prompt('ملاحظات', updatedBatch.notes || '') || ''; }
  if (type === 'dye') { updatedBatch.noteNumber = prompt('رقم الإذن', updatedBatch.noteNumber || '') || ''; updatedBatch.notes = prompt('ملاحظات', updatedBatch.notes || '') || ''; }
  if (type === 'production') { updatedBatch.noteNumber = prompt('رقم إذن استلام المجهز', updatedBatch.noteNumber || '') || ''; updatedBatch.notes = prompt('ملاحظات', updatedBatch.notes || '') || ''; }
  if (type === 'finished') { updatedBatch.finishedWidth = Number(prompt('العرض', updatedBatch.finishedWidth)); updatedBatch.finishedWeight = Number(prompt('الوزن المجهز', updatedBatch.finishedWeight)); updatedBatch.notes = prompt('ملاحظات', updatedBatch.notes || '') || ''; }
  if (backendSaveRequired) {
    const saved = type === 'transfer'
      ? await putBackend(`/transfers/${id}`, transferToApi(updatedBatch))
      : await putBackend(`/batches/${backendBatchType(type)}/${id}`, type === 'rawReturn' ? { ...batchToApi(updatedBatch), reason:updatedBatch.reason || updatedBatch.notes || '' } : batchToApi(updatedBatch));
    if (!saved) {
      await rollbackAfterBackendWriteFailure('تعذر حفظ تعديل الحركة في قاعدة البيانات. لم يتم اعتماد التعديل.');
      return;
    }
  }
  await loadBackendData();
}
function getOperationalStage(order) {
  if (order.totalRawReceived === 0 && order.totalAllocated > 0) return 'بانتظار خروج الخام';
  if (order.totalRawReceived === 0) return 'بانتظار استلام الخام';
  if (order.totalAllocated === 0) return 'بانتظار توزيع الألوان';
  if (order.rawAtDyehouseAvailable > 0 || order.totalFinishedReceived < Math.min(order.totalRawReceived, order.totalAllocated)) return 'تحت التشغيل بالمصبغة';
  if (order.warehouseBalance > 0 && order.totalDeliveredToCustomer < order.totalFinishedReceived) return 'بالمخزن';
  if (order.totalDeliveredToCustomer < order.totalAllocated) return 'تسليم العميل';
  return 'مكتمل';
}
function cleanOperationalStage(stage) {
  const text = String(stage || '').trim();
  return isLegacyRecoveredText(text) ? 'مراجعة' : (text || '-');
}
function dateRangeLabel(items) {
  const dates = items.map((item)=>item.date).filter(Boolean).sort();
  if (!dates.length) return '-';
  return dates[0] === dates[dates.length - 1] ? dates[0] : `${dates[0]} - ${dates[dates.length - 1]}`;
}
function orderMovementDates(order) {
  const allocationIds = order.allocations.map((allocation)=>allocation.id);
  return {
    orderDate: order.orderDate || '-',
    weavingDate: dateRangeLabel(rawBatches.filter((batch)=>batch.orderId===order.id)),
    dyehouseDate: dateRangeLabel(productionBatches.filter((batch)=>allocationIds.includes(batch.allocationId))),
    customerDate: dateRangeLabel(customerBatches.filter((batch)=>allocationIds.includes(batch.allocationId))),
  };
}
function reportNumber(value, digits = 3) {
  const number = Number(value || 0);
  const factor = 10 ** digits;
  return Math.round(number * factor) / factor;
}
function reportFmt(value, digits = 3) {
  return reportNumber(value, digits).toLocaleString('ar-EG', { maximumFractionDigits: digits });
}
function daysSince(dateValue) {
  if (!dateValue) return 0;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 0;
  return Math.max(Math.floor((new Date() - date) / 86400000), 0);
}
function stageStartDate(order) {
  const allocationIds = order.allocations.map((allocation)=>allocation.id);
  const stage = getOperationalStage(order);
  if (stage === 'بانتظار استلام الخام' || stage === 'بانتظار خروج الخام' || stage === 'بانتظار توزيع الألوان') return order.orderDate || '';
  if (stage === 'تحت التشغيل بالمصبغة') return dateRangeLabel(rawBatches.filter((batch)=>batch.orderId===order.id)).split(' - ')[0] || order.orderDate || '';
  if (stage === 'بالمخزن' || stage === 'تسليم العميل') return dateRangeLabel(productionBatches.filter((batch)=>allocationIds.includes(batch.allocationId))).split(' - ')[0] || order.orderDate || '';
  return order.orderDate || '';
}
function openManagementReportsMenu() {
  refs.documentTitle.textContent = 'التقارير الإدارية';
  refs.documentBody.dataset.documentType = 'management-reports-menu';
  const cards = [
    ['orders-follow', 'تقرير متابعة الطلبات', 'ملخص الطلبات وحالتها من الخام حتى التسليم.'],
    ['dyehouse-balances', 'تقرير أرصدة المصابغ', 'الكميات المتبقية داخل كل مصبغة حسب الطلبات والألوان.'],
    ['inventory', 'تقرير رصيد المخزن', 'رصيد المخزن الحالي حسب الداخل والتسليم.'],
    ['delays', 'تقرير التأخيرات', 'الطلبات المتوقفة أو المتأخرة في مراحل التشغيل.'],
    ['dyehouse-performance', 'أداء المصابغ', 'مراجعة كميات التشغيل والاستلام والهالك لكل مصبغة.'],
    ['waste-analysis', 'تحليل الهالك', 'مقارنة الهالك التقديري بالهالك الفعلي.'],
    ['customer-account', 'تقرير العملاء', 'ملخص كل عميل داخل نظام المتابعة.'],
    ['order-movement', 'حركة الطلبات', 'تواريخ انتقال الطلبات بين مراحل التشغيل.'],
    ['raw-returns', 'مرتجعات الخام', 'حركات الخام المرتجع من المصبغة أو التشغيل.'],
    ['accessories', 'تقرير الإكسسوار', 'حركات الإكسسوار خروجًا واستلامًا وتسليمًا.'],
  ];
  refs.documentBody.innerHTML = `<div class="document-sheet orders-follow-report">${documentHeader()}<div class="report-title"><h2>التقارير الإدارية</h2><span>اختر التقرير المطلوب لمراجعة التشغيل الحالي.</span></div><div class="management-report-grid no-print">${cards.map(([type,title,desc])=>`<button type="button" class="management-report-card" data-management-report="${type}"><strong>${title}</strong><span>${desc}</span></button>`).join('')}</div><section class="report-section"><h3>قائمة التقارير</h3><table class="follow-table"><thead><tr><th>التقرير</th><th>الوصف</th><th>إجراء</th></tr></thead><tbody>${cards.map(([type,title,desc])=>`<tr><th>${title}</th><td>${desc}</td><td><button type="button" class="mini-btn gold" data-management-report="${type}">فتح التقرير</button></td></tr>`).join('')}</tbody></table></section>${documentFooter()}</div>`;
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
function showManagementReport(title, subtitle, sectionsHtml, reportKey = '') {
  refs.documentTitle.textContent = title;
  refs.documentBody.dataset.documentType = 'management-report';
  refs.documentBody.dataset.reportKey = reportKey || title;
  refs.documentBody.dataset.reportTitle = title;
  refs.documentBody.dataset.reportSubtitle = subtitle;
  const reportHtml = `${documentHeader()}<div class="report-title"><h2>${title}</h2><span>${subtitle}</span></div>${sectionsHtml}`;
  refs.documentBody.innerHTML = `<div class="document-sheet orders-follow-report">${withDocumentFooter(reportHtml)}</div>`;
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
function openManagementReport(type) {
  if (type === 'orders-follow') { if (refs.documentDialog.open) refs.documentDialog.close(); return openOrdersReport(); }
  if (type === 'dyehouse-balances') { if (refs.documentDialog.open) refs.documentDialog.close(); return openDyehouseBalancesReport(); }
  const list = allOrders();
  if (type === 'inventory') {
    const clothRows = [];
    const accessoryRows = [];
    list.forEach((order)=>order.allocations.forEach((allocation)=>{
      const delivered = sum(customerBatches.filter((batch)=>batch.allocationId===allocation.id));
      const balance = reportNumber(Number(allocation.finishedReceived || 0) - delivered);
      if (balance > 0) clothRows.push(`<tr><td>${order.orderNumber}</td><td>${order.customer}</td><td>${order.fabricType || '-'}</td><td>${allocation.color || '-'}</td><td>${allocation.rawInch || order.inchWidth || '-'}</td><td>${allocation.rawWidth || allocation.targetFinishedWidth || '-'}</td><td>${reportFmt(allocation.finishedReceived)}</td><td>${reportFmt(delivered)}</td><td><strong>${reportFmt(balance)}</strong></td></tr>`);
      if (order.accessoryLines.length) {
        const received = sum(accessoryBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement==='received'));
        const customerDelivered = sum(accessoryBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement==='customer'));
        const accessoryBalance = reportNumber(received - customerDelivered);
        if (accessoryBalance > 0) accessoryRows.push(`<tr><td>${order.orderNumber}</td><td>${order.customer}</td><td>${allocation.color || '-'}</td><td>${accessoryTypesLabel(order)}</td><td>${reportFmt(received)}</td><td>${reportFmt(customerDelivered)}</td><td><strong>${reportFmt(accessoryBalance)}</strong></td></tr>`);
      }
    }));
    return showManagementReport('تقرير رصيد المخزن', 'رصيد القماش والإكسسوار المتاح حسب الداخل للمخزن والتسليم للعميل.', `<section class="report-section"><h3>رصيد القماش الحالي</h3><table class="follow-table"><thead><tr><th>رقم الطلب</th><th>العميل</th><th>الصنف</th><th>اللون</th><th>البوصة</th><th>العرض</th><th>دخل المخزن</th><th>تسليم العميل</th><th>الرصيد الحالي</th></tr></thead><tbody>${clothRows.join('') || '<tr><td colspan="9">لا يوجد رصيد قماش حالي.</td></tr>'}</tbody></table></section><section class="report-section"><h3>رصيد الإكسسوار</h3><table class="follow-table"><thead><tr><th>رقم الطلب</th><th>العميل</th><th>اللون</th><th>نوع الإكسسوار</th><th>مستلم</th><th>مسلم للعميل</th><th>الرصيد الحالي</th></tr></thead><tbody>${accessoryRows.join('') || '<tr><td colspan="7">لا يوجد رصيد إكسسوار حالي.</td></tr>'}</tbody></table></section>`, type);
  }
  if (type === 'delays') {
    const rows = list.filter((order)=>cleanOperationalStage(getOperationalStage(order))!=='مكتمل').map((order)=>{ const stageDate = stageStartDate(order); return { order, stage:cleanOperationalStage(getOperationalStage(order)), stageDate, days:daysSince(stageDate) }; }).sort((a,b)=>b.days-a.days).map(({order,stage,stageDate,days})=>`<tr><td>${order.orderNumber}</td><td>${order.customer}</td><td>${order.fabricType || '-'}</td><td>${order.dyehouse || '-'}</td><td>${stage}</td><td>${stageDate || '-'}</td><td><strong>${days}</strong></td><td>${reportFmt(order.totalRawOrdered)}</td><td>${reportFmt(order.totalFinishedReceived)}</td><td>${reportFmt(order.totalDeliveredToCustomer)}</td></tr>`).join('');
    return showManagementReport('تقرير التأخيرات', 'الطلبات المفتوحة أو المتأخرة حسب مرحلة التشغيل وآخر حركة مسجلة.', `<section class="report-section"><h3>تفاصيل التأخير</h3><table class="follow-table"><thead><tr><th>رقم الطلب</th><th>العميل</th><th>الصنف</th><th>المصبغة</th><th>المرحلة</th><th>تاريخ المرحلة</th><th>أيام الانتظار</th><th>خام مطلوب</th><th>دخل المخزن</th><th>تسليم العميل</th></tr></thead><tbody>${rows || '<tr><td colspan="10">لا توجد طلبات متأخرة حاليًا.</td></tr>'}</tbody></table></section>`, type);
  }
  if (type === 'dyehouse-performance') {
    const groups = {};
    list.forEach((order)=>order.allocations.forEach((allocation)=>{ const key = allocation.dyehouse || order.dyehouse || '-'; groups[key] ||= { orders:new Set(), planned:0, finished:0, waste:0, inside:0 }; groups[key].orders.add(order.orderNumber); groups[key].planned += Number(allocation.plannedQuantity || 0); groups[key].finished += Number(allocation.finishedReceived || 0); groups[key].waste += Number(allocation.wasteQuantity || 0); if (cleanOperationalStage(getOperationalStage(order))==='تحت التشغيل بالمصبغة') groups[key].inside += 1; }));
    const rows = Object.entries(groups).sort((a,b)=>a[0].localeCompare(b[0],'ar')).map(([dyehouse,data])=>`<tr><td>${dyehouse}</td><td>${data.orders.size}</td><td>${reportFmt(data.planned)}</td><td>${reportFmt(data.finished)}</td><td>${reportFmt(data.waste)}</td><td>${data.planned ? reportFmt(data.waste / data.planned * 100, 2) : 0}%</td><td>${data.inside}</td></tr>`).join('');
    return showManagementReport('أداء المصابغ', 'مراجعة كميات التشغيل والاستلام والهالك لكل مصبغة.', `<section class="report-section"><h3>ملخص المصابغ</h3><table class="follow-table"><thead><tr><th>المصبغة</th><th>عدد الطلبات</th><th>المخطط</th><th>دخل المخزن</th><th>هالك فعلي</th><th>نسبة الهالك</th><th>طلبات داخل المصبغة</th></tr></thead><tbody>${rows || '<tr><td colspan="7">لا توجد بيانات أداء للمصابغ.</td></tr>'}</tbody></table></section>`, type);
  }
  if (type === 'waste-analysis') {
    const rows = list.flatMap((order)=>order.allocations.map((allocation)=>`<tr><td>${order.orderNumber}</td><td>${order.customer}</td><td>${order.fabricType || '-'}</td><td>${allocation.color || '-'}</td><td>${allocation.dyehouse || '-'}</td><td>${reportFmt(allocation.plannedQuantity)}</td><td>${reportFmt(allocation.finishedReceived)}</td><td>${reportFmt(allocation.expectedWasteQuantity)} (${reportFmt(allocation.expectedWastePercent,2)}%)</td><td>${reportFmt(allocation.wasteQuantity)} (${reportFmt(allocation.wastePercent,2)}%)</td><td>${reportFmt(Number(allocation.wasteQuantity || 0) - Number(allocation.expectedWasteQuantity || 0))}</td></tr>`)).join('');
    return showManagementReport('تحليل الهالك', 'مقارنة الهالك التقديري بالهالك الفعلي حسب كل لون.', `<section class="report-section"><h3>تفاصيل الهالك</h3><table class="follow-table"><thead><tr><th>رقم الطلب</th><th>العميل</th><th>الصنف</th><th>اللون</th><th>المصبغة</th><th>المخطط</th><th>دخل المخزن</th><th>هالك تقديري</th><th>هالك فعلي</th><th>الفرق</th></tr></thead><tbody>${rows || '<tr><td colspan="10">لا توجد بيانات هالك حاليًا.</td></tr>'}</tbody></table></section>`, type);
  }
  if (type === 'customer-account') {
    const groups = {};
    list.forEach((order)=>{ const key = order.customer || '-'; groups[key] ||= { count:0, contract:0, raw:0, finished:0, delivered:0, balance:0, open:0 }; groups[key].count += 1; groups[key].contract += Number(order.contractTotal || order.totalContract || (Number(order.kiloPrice || 0) * Number(order.totalRawOrdered || 0)) || 0); groups[key].raw += Number(order.totalRawOrdered || 0); groups[key].finished += Number(order.totalFinishedReceived || 0); groups[key].delivered += Number(order.totalDeliveredToCustomer || 0); groups[key].balance += Number(order.warehouseBalance || 0); if (cleanOperationalStage(getOperationalStage(order))!=='مكتمل') groups[key].open += 1; });
    const rows = Object.entries(groups).sort((a,b)=>a[0].localeCompare(b[0],'ar')).map(([customer,data])=>`<tr><td>${customer}</td><td>${data.count}</td><td>${reportFmt(data.contract,2)}</td><td>${reportFmt(data.raw)}</td><td>${reportFmt(data.finished)}</td><td>${reportFmt(data.delivered)}</td><td>${reportFmt(data.balance)}</td><td>${data.open}</td></tr>`).join('');
    return showManagementReport('تقرير العملاء', 'ملخص كل عميل داخل نظام المتابعة.', `<section class="report-section"><h3>ملخص العملاء</h3><table class="follow-table"><thead><tr><th>العميل</th><th>عدد الطلبات</th><th>إجمالي العقود</th><th>خام مطلوب</th><th>دخل المخزن</th><th>تسليم العميل</th><th>رصيد المخزن</th><th>طلبات مفتوحة</th></tr></thead><tbody>${rows || '<tr><td colspan="8">لا توجد بيانات عملاء.</td></tr>'}</tbody></table></section>`, type);
  }
  if (type === 'order-movement') {
    const rows = list.map((order)=>{ const dates = orderMovementDates(order); return `<tr><td>${order.orderNumber}</td><td>${order.customer}</td><td>${order.fabricType || '-'}</td><td>${dates.orderDate}</td><td>${dates.weavingDate}</td><td>${dates.dyehouseDate}</td><td>${dates.customerDate}</td><td>${cleanOperationalStage(getOperationalStage(order))}</td></tr>`; }).join('');
    return showManagementReport('حركة الطلبات', 'تواريخ انتقال الطلبات بين مراحل التشغيل.', `<section class="report-section"><h3>تواريخ الحركة</h3><table class="follow-table"><thead><tr><th>رقم الطلب</th><th>العميل</th><th>الصنف</th><th>تاريخ الطلب</th><th>خروج الخام للمصبغة</th><th>دخول المخزن</th><th>تسليم العميل</th><th>مرحلة التشغيل</th></tr></thead><tbody>${rows || '<tr><td colspan="8">لا توجد حركات طلبات.</td></tr>'}</tbody></table></section>`, type);
  }
  if (type === 'raw-returns') {
    const rows = rawReturns.map((batch)=>{ const allocation = allocations.find((item)=>item.id===batch.allocationId); const sourceOrder = orders.find((item)=>item.id===batch.orderId || item.id===allocation?.orderId); const order = sourceOrder ? calculateOrder(sourceOrder) : { orderNumber:'-', customer:'-' }; return `<tr><td>${batch.date || '-'}</td><td>${order.orderNumber || '-'}</td><td>${order.customer || '-'}</td><td>${allocation?.color || '-'}</td><td>${allocation?.dyehouse || '-'}</td><td>${reportFmt(batch.quantity)}</td><td>${batch.noteNumber || '-'}</td><td>${batch.notes || '-'}</td></tr>`; }).join('');
    return showManagementReport('مرتجعات الخام', 'حركات الخام المرتجع من المصبغة أو التشغيل.', `<section class="report-section"><h3>تفاصيل المرتجعات</h3><table class="follow-table"><thead><tr><th>التاريخ</th><th>رقم الطلب</th><th>العميل</th><th>اللون</th><th>المصبغة</th><th>الكمية</th><th>رقم الإذن</th><th>ملاحظات</th></tr></thead><tbody>${rows || '<tr><td colspan="8">لا توجد مرتجعات خام.</td></tr>'}</tbody></table></section>`, type);
  }
  if (type === 'accessories') {
    const rows = [];
    list.filter((order)=>order.accessoryLines.length).forEach((order)=>order.allocations.forEach((allocation)=>{ const sent = sum(accessoryBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement==='sent')); const received = sum(accessoryBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement==='received')); const delivered = sum(accessoryBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement==='customer')); rows.push(`<tr><td>${order.orderNumber}</td><td>${order.customer}</td><td>${allocation.color || '-'}</td><td>${accessoryTypesLabel(order)}</td><td>${reportFmt(allocation.accessoryQuantity)}</td><td>${reportFmt(sent)}</td><td>${reportFmt(received)}</td><td>${reportFmt(delivered)}</td><td>${reportFmt(received - delivered)}</td></tr>`); }));
    return showManagementReport('تقرير الإكسسوار', 'حركات الإكسسوار خروجًا واستلامًا وتسليمًا.', `<section class="report-section"><h3>تفاصيل الإكسسوار</h3><table class="follow-table"><thead><tr><th>رقم الطلب</th><th>العميل</th><th>اللون</th><th>نوع الإكسسوار</th><th>المطلوب</th><th>المرسل</th><th>المستلم</th><th>المسلم للعميل</th><th>الرصيد</th></tr></thead><tbody>${rows.join('') || '<tr><td colspan="9">لا توجد حركات إكسسوار.</td></tr>'}</tbody></table></section>`, type);
  }
}

function openOrdersReport() {
  const list = allOrders();
  const fmt = (value) => Number(value || 0).toLocaleString('ar-EG', { maximumFractionDigits: 2 });
  const totals = list.reduce((acc, order)=>{
    acc.raw += Number(order.totalRawOrdered || 0);
    acc.received += Number(order.totalRawReceived || 0);
    acc.sent += Number(order.totalSentToDyehouse || 0);
    acc.finished += Number(order.totalFinishedReceived || 0);
    acc.delivered += Number(order.totalDeliveredToCustomer || 0);
    acc.balance += Number(order.warehouseBalance || 0);
    acc.waste += Number(order.totalWaste || 0);
    acc.accessoryRequired += Number(order.accessoryRequired || 0);
    acc.accessorySent += Number(order.accessorySent || 0);
    acc.accessoryReceived += Number(order.accessoryReceived || 0);
    acc.accessoryDelivered += Number(order.accessoryDelivered || 0);
    acc.accessoryBalance += Number(order.accessoryBalance || 0);
    return acc;
  }, { raw:0, received:0, sent:0, finished:0, delivered:0, balance:0, waste:0, accessoryRequired:0, accessorySent:0, accessoryReceived:0, accessoryDelivered:0, accessoryBalance:0 });
  const rows = list.map((order)=>`<tr><td>${order.orderNumber || '-'}</td><td>${order.customer || '-'}</td><td>${order.fabricType || '-'}</td><td>${order.dyehouse || '-'}</td><td><span class="status ${order.status || ''}">${statusLabel(order.status)}</span></td><td>${cleanOperationalStage(getOperationalStage(order))}</td><td>${fmt(order.totalRawOrdered)}</td><td>${fmt(order.totalRawReceived)}</td><td>${fmt(order.totalSentToDyehouse)}</td><td>${fmt(order.totalFinishedReceived)}</td><td>${fmt(order.warehouseBalance)}</td><td>${fmt(order.totalDeliveredToCustomer)}</td><td>${fmt(order.totalWaste)} (${formatNumber(order.totalWastePercent || 0, 1)}%)</td><td>${fmt(order.accessoryRequired || 0)}</td><td>${fmt(order.accessorySent || 0)}</td><td>${fmt(order.accessoryReceived || 0)}</td><td>${fmt(order.accessoryDelivered || 0)}</td><td>${fmt(order.accessoryBalance || 0)}</td></tr>`).join('');
  const summary = `<section class="report-section"><h3>ملخص الكميات</h3><table class="summary-table"><tbody><tr><th>إجمالي الخام المطلوب</th><td>${fmt(totals.raw)}</td><th>الخامة المستلمة</th><td>${fmt(totals.received)}</td></tr><tr><th>مرسل للمصبغة</th><td>${fmt(totals.sent)}</td><th>دخل المخزن</th><td>${fmt(totals.finished)}</td></tr><tr><th>تسليم العميل</th><td>${fmt(totals.delivered)}</td><th>رصيد المخزن</th><td>${fmt(totals.balance)}</td></tr><tr><th>إكسسوار مطلوب</th><td>${fmt(totals.accessoryRequired)}</td><th>إكسسوار مستلم</th><td>${fmt(totals.accessoryReceived)}</td></tr><tr><th>رصيد الإكسسوار</th><td>${fmt(totals.accessoryBalance)}</td><th>عدد الطلبات</th><td>${list.length}</td></tr></tbody></table></section>`;
  const table = `<section class="report-section"><h3>تفاصيل الطلبات</h3><table class="follow-table"><thead><tr><th>رقم الطلب</th><th>العميل</th><th>الصنف</th><th>المصبغة</th><th>الحالة</th><th>المرحلة</th><th>خام مطلوب</th><th>خام مستلم</th><th>مرسل للمصبغة</th><th>دخل المخزن</th><th>رصيد المخزن</th><th>تسليم العميل</th><th>الهالك</th><th>إكسسوار مطلوب</th><th>إكسسوار مرسل</th><th>إكسسوار مستلم</th><th>إكسسوار مسلم</th><th>رصيد الإكسسوار</th></tr></thead><tbody>${rows || emptyRow(18, 'لا توجد طلبات مسجلة.')}</tbody></table></section>`;
  showManagementReport('تقرير متابعة الطلبات', 'ملخص الطلبات وحالتها من الخام والإكسسوار حتى التسليم.', `${summary}${table}`, 'orders-follow');
}
function openDyehouseBalancesReport() {
  const list = allOrders();
  const fmt = (value) => Number(value || 0).toLocaleString('ar-EG', { maximumFractionDigits: 2 });
  const groups = {};
  list.forEach((order)=>{
    (order.allocations || []).forEach((allocation)=>{
      const name = allocation.dyehouse || order.dyehouse || 'غير محدد';
      groups[name] ||= { colors:0, planned:0, sent:0, finished:0, remaining:0, waste:0, accessoryRequired:0, accessoryReceived:0, accessoryBalance:0 };
      groups[name].colors += 1;
      groups[name].planned += Number(allocation.plannedQuantity || 0);
      groups[name].sent += Number(allocation.sentToDyehouse || 0);
      groups[name].finished += Number(allocation.finishedReceived || 0);
      groups[name].remaining += Math.max(0, Number(allocation.sentToDyehouse || 0) - Number(allocation.finishedReceived || 0));
      groups[name].waste += Number(allocation.wasteQuantity || 0);
      groups[name].accessoryRequired += Number(allocation.accessoryQuantity || 0);
    });
    if ((order.accessoryLines || []).length) {
      const name = order.dyehouse || 'غير محدد';
      groups[name] ||= { colors:0, planned:0, sent:0, finished:0, remaining:0, waste:0, accessoryRequired:0, accessoryReceived:0, accessoryBalance:0 };
      groups[name].accessoryReceived += Number(order.accessoryReceived || 0);
      groups[name].accessoryBalance += Number(order.accessoryBalance || 0);
    }
  });
  const rows = Object.entries(groups).sort((a,b)=>a[0].localeCompare(b[0], 'ar')).map(([name, data])=>`<tr><td>${name}</td><td>${data.colors}</td><td>${fmt(data.planned)}</td><td>${fmt(data.sent)}</td><td>${fmt(data.finished)}</td><td>${fmt(data.remaining)}</td><td>${fmt(data.waste)}</td><td>${fmt(data.accessoryRequired)}</td><td>${fmt(data.accessoryReceived)}</td><td>${fmt(data.accessoryBalance)}</td></tr>`).join('');
  const table = `<section class="report-section"><h3>أرصدة المصابغ</h3><table class="follow-table"><thead><tr><th>المصبغة</th><th>عدد الألوان</th><th>المخطط</th><th>مرسل للمصبغة</th><th>دخل المخزن</th><th>متبقي بالمصبغة</th><th>هالك فعلي</th><th>إكسسوار مطلوب</th><th>إكسسوار مستلم</th><th>رصيد الإكسسوار</th></tr></thead><tbody>${rows || emptyRow(10, 'لا توجد أرصدة مصابغ حالية.')}</tbody></table></section>`;
  showManagementReport('تقرير أرصدة المصابغ', 'الكميات المتبقية داخل كل مصبغة حسب الطلبات والألوان والإكسسوار.', table, 'dyehouse-balances');
}
function emptyRow(colspan, text = 'لا توجد بيانات مسجلة.') {
  return `<tr><td colspan="${colspan}">${text}</td></tr>`;
}
function dyehouseNamesForOrder(order) {
  const originalDyehouse = String(order?.dyehouse || '').trim();
  const transferDyehouses = dyehouseTransfers
    .filter((transfer)=>transfer.orderId === order?.id)
    .map((transfer)=>transfer.toDyehouse);
  const allocationDyehouses = (order?.allocations || [])
    .map((allocation)=>allocation.dyehouse || originalDyehouse);
  return uniqueNonEmpty([originalDyehouse, ...allocationDyehouses, ...transferDyehouses]);
}
function operationNotesKey(type, dyehouseName = '') {
  const name = String(dyehouseName || '').trim();
  return type === 'dyeing' ? `dyeing:${name || 'default'}` : 'weaving';
}
function reportOperationNotes(order) {
  return order.operationNoteText || order.notes || '-';
}
const {
  buildCompactFullReportDocument,
  buildDyeingSummaryDocument,
  buildLabSamplesDocument,
  buildQuotationDocument,
  buildStickersDocument,
  buildWasteReportDocument,
  buildWeavingOrderDocument,
} = window.TwoBTexDocuments.createBuilders({
  accessoryDocumentSection,
  documentFooter,
  documentHeader,
  documentLogo,
  emptyRow,
  escapeHtml,
  formatNumber,
  getFirstRawNoteNumber,
  orderRawCost,
  rawPermitImagesSection,
  reportOperationNotes,
  uniqueNonEmpty,
});


function openDyeingDocumentForDyehouse(dyehouseName) {
  const sourceOrder = orders.find((item)=>item.id===selectedOrderId);
  if (!sourceOrder) return;
  const operationNoteText = promptOperationNotes(sourceOrder, 'dyeing', dyehouseName);
  if (operationNoteText === null) return;
  const order = calculateOrder(sourceOrder);
  const name = String(dyehouseName || '').trim();
  const fmt = (value) => roundNumber(value).toLocaleString('ar-EG', { maximumFractionDigits: 3 });
  const reportOrder = { ...order, operationNoteText, whatsappDyehouseName:name };
  currentDocumentType = 'dyeing';
  refs.documentTitle.textContent = `أمر صباغة - ${name || '-'}`;
  refs.documentBody.dataset.documentType = 'dyeing';
  refs.documentBody.dataset.dyehouseName = name;
  refs.documentBody.innerHTML = `<div class="document-sheet dyeing-document">${withDocumentFooter(buildDyeingOrderReport(reportOrder, name, fmt))}</div>`;
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
  queueDocumentReport('dyeing', reportOrder);
}
function buildFullOrderReport(order, header, meta, fmt) {
  const movementDates = orderMovementDates(order);
  const allocationIds = order.allocations.map((allocation)=>allocation.id);
  const widthLabelFor = (allocation) => order.widthMode === 'multiple'
    ? `بوصة ${allocation?.rawInch || '-'} / عرض ${allocation?.rawWidth || allocation?.targetFinishedWidth || '-'}`
    : `بوصة ${order.inchWidth || '-'} / عرض ${allocation?.targetFinishedWidth || '-'}`;
  const allocationRows = order.allocations.map((allocation)=>{
    const delivered = sum(customerBatches.filter((batch)=>batch.allocationId===allocation.id));
    const stockBalance = Math.max(Number(allocation.finishedReceived || 0) - delivered, 0);
    const expectedWaste = order.operationClosed ? `${fmt(allocation.expectedWasteQuantity)} (${formatNumber(allocation.expectedWastePercent || 0, 1)}%)` : 'يظهر بعد إغلاق الدورة';
    const actualWaste = order.operationClosed ? `${fmt(allocation.wasteQuantity)} (${formatNumber(allocation.wastePercent || 0, 1)}%)` : 'يظهر بعد إغلاق الدورة';
    return `<tr><td>${allocation.color || '-'}</td><td>${widthLabelFor(allocation)}</td><td>${allocation.dyehouse || '-'}</td><td>${fmt(allocation.plannedQuantity)}</td><td>${fmt(allocation.sentToDyehouse)}</td><td>${fmt(allocation.finishedReceived)}</td><td>${fmt(delivered)}</td><td>${fmt(stockBalance)}</td><td>${expectedWaste}</td><td>${actualWaste}</td></tr>`;
  }).join('');
  const rawRows = rawBatches.filter((batch)=>batch.orderId===order.id).map((batch)=>`<tr><td>${batch.date || '-'}</td><td>${fmt(batch.quantity)}</td><td>${batch.supplier || '-'}</td><td>${batch.noteNumber || '-'}</td><td>${batch.notes || '-'}</td></tr>`).join('');
  const productionRows = productionBatches.filter((batch)=>allocationIds.includes(batch.allocationId)).map((batch)=>{
    const allocation = order.allocations.find((item)=>item.id===batch.allocationId);
    return `<tr><td>${batch.date || '-'}</td><td>${allocation?.dyehouse || '-'}</td><td>${allocation?.color || '-'}</td><td>${widthLabelFor(allocation)}</td><td>${fmt(batch.quantity)}</td><td>${batch.noteNumber || '-'}</td><td>${batch.notes || '-'}</td></tr>`;
  }).join('');
  const customerRows = customerBatches.filter((batch)=>allocationIds.includes(batch.allocationId)).map((batch)=>{
    const allocation = order.allocations.find((item)=>item.id===batch.allocationId);
    return `<tr><td>${batch.date || '-'}</td><td>${allocation?.color || '-'}</td><td>${widthLabelFor(allocation)}</td><td>${fmt(batch.quantity)}</td><td>${batch.notes || '-'}</td></tr>`;
  }).join('');
  const rawReturnRows = rawReturns.filter((batch)=>allocationIds.includes(batch.allocationId)).map((batch)=>{
    const allocation = order.allocations.find((item)=>item.id===batch.allocationId);
    return `<tr><td>${batch.date || '-'}</td><td>${allocation?.color || '-'}</td><td>${allocation?.dyehouse || '-'}</td><td>${fmt(batch.quantity)}</td><td>${batch.noteNumber || '-'}</td><td>${batch.notes || '-'}</td></tr>`;
  }).join('');
  const accessoryRows = accessoryBatches.filter((batch)=>batch.orderId===order.id || allocationIds.includes(batch.allocationId)).map((batch)=>{
    const allocation = order.allocations.find((item)=>item.id===batch.allocationId);
    const movement = batch.movement === 'received' ? 'استلام إكسسوار' : batch.movement === 'customer' ? 'تسليم عميل' : 'خروج إكسسوار';
    return `<tr><td>${batch.date || '-'}</td><td>${batch.accessoryType || order.accessoryLines[0]?.type || 'إكسسوار'}</td><td>${allocation?.color || '-'}</td><td>${movement}</td><td>${fmt(batch.quantity)}</td><td>${batch.noteNumber || '-'}</td><td>${batch.notes || '-'}</td></tr>`;
  }).join('');
  const accessorySection = order.accessoryLines.length ? `<section class="report-section"><h3>ملخص الإكسسوار</h3><table class="summary-table"><tbody><tr><th>إكسسوار مطلوب</th><td>${fmt(order.accessoryRequired)}</td><th>إكسسوار مرسل</th><td>${fmt(order.accessorySent)}</td></tr><tr><th>إكسسوار مستلم</th><td>${fmt(order.accessoryReceived)}</td><th>إكسسوار مسلم للعميل</th><td>${fmt(order.accessoryDelivered)}</td></tr><tr><th>رصيد الإكسسوار</th><td>${fmt(order.accessoryBalance)}</td><th>هالك الإكسسوار</th><td>${order.operationClosed ? `${fmt(order.accessoryWaste)} (${formatNumber(order.accessoryWastePercent || 0, 1)}%)` : 'يظهر بعد إغلاق الدورة'}</td></tr></tbody></table><table><thead><tr><th>التاريخ</th><th>النوع</th><th>اللون</th><th>الحركة</th><th>الكمية</th><th>رقم الإذن</th><th>ملاحظات</th></tr></thead><tbody>${accessoryRows || emptyRow(7, 'لا توجد حركات إكسسوار مسجلة.')}</tbody></table></section>` : '';
  return `${header}<div class="report-title"><h2>التقرير التفصيلي للطلب</h2><span>تجميع كامل من الخام حتى تسليم العميل.</span></div>${meta}<div class="document-meta"><div><span>نوع القماش</span>${order.fabricType || '-'}</div><div><span>إجمالي الخام المطلوب</span>${fmt(order.totalRawOrdered)}</div><div><span>نظام العرض</span>${order.widthMode === 'multiple' ? 'عدة عروض' : 'عرض واحد'}</div><div><span>المصبغة</span>${order.dyehouse || '-'}</div><div><span>مصدر النسيج</span>${order.weavingSource || '-'}</div><div><span>حالة الهالك</span>${order.operationClosed ? 'بعد إغلاق الدورة' : 'يظهر بعد إغلاق الدورة'}</div></div><section class="report-section"><h3>ملاحظات تشغيل</h3><p>${reportOperationNotes(order) || '-'}</p></section><section class="report-section"><h3>تواريخ الحركة</h3><table class="summary-table"><tbody><tr><th>تاريخ الطلب</th><td>${movementDates.orderDate}</td><th>خروج الخام للمصبغة</th><td>${movementDates.weavingDate}</td></tr><tr><th>دخول المخزن</th><td>${movementDates.dyehouseDate}</td><th>تسليم العميل</th><td>${movementDates.customerDate}</td></tr></tbody></table></section><section class="report-section"><h3>ملخص الكميات</h3><table class="summary-table"><tbody><tr><th>خام مطلوب</th><td>${fmt(order.totalRawOrdered)}</td><th>خام مستلم</th><td>${fmt(order.totalRawReceived)}</td></tr><tr><th>مرسل للمصبغة</th><td>${fmt(order.totalSentToDyehouse)}</td><th>دخل المخزن</th><td>${fmt(order.totalFinishedReceived)}</td></tr><tr><th>تسليم العميل</th><td>${fmt(order.totalDeliveredToCustomer)}</td><th>رصيد المخزن</th><td>${fmt(order.warehouseBalance)}</td></tr><tr><th>متبقي بالمصبغة</th><td>${fmt(order.rawAtDyehouseAvailable)}</td><th>مرتجعات الخام</th><td>${fmt(order.totalRawReturnedToWeaving)}</td></tr><tr><th>هالك تقديري</th><td>${order.operationClosed ? `${fmt(order.expectedWasteQuantity)} (${formatNumber(order.expectedWastePercent || 0, 1)}%)` : 'يظهر بعد إغلاق الدورة'}</td><th>هالك فعلي</th><td>${order.operationClosed ? `${fmt(order.totalWaste)} (${formatNumber(order.totalWastePercent || 0, 1)}%)` : 'يظهر بعد إغلاق الدورة'}</td></tr></tbody></table></section><section class="report-section"><h3>خطة توزيع الألوان</h3><table><thead><tr><th>اللون</th><th>العرض / البوصة</th><th>المصبغة</th><th>المخطط</th><th>مرسل للمصبغة</th><th>دخل المخزن</th><th>تسليم العميل</th><th>رصيد المخزن</th><th>هالك تقديري</th><th>هالك فعلي</th></tr></thead><tbody>${allocationRows || emptyRow(10)}</tbody></table></section>${accessorySection}<section class="report-section"><h3>دفعات الخام</h3><table><thead><tr><th>التاريخ</th><th>الكمية</th><th>المورد</th><th>رقم الإذن</th><th>ملاحظات</th></tr></thead><tbody>${rawRows || emptyRow(5, 'لا توجد دفعات خام مسجلة.')}</tbody></table></section>${rawReturnRows ? `<section class="report-section"><h3>مرتجعات الخام</h3><table><thead><tr><th>التاريخ</th><th>اللون</th><th>المصبغة</th><th>الكمية</th><th>رقم الإذن</th><th>ملاحظات</th></tr></thead><tbody>${rawReturnRows}</tbody></table></section>` : ''}<section class="report-section"><h3>استلام المجهز من المصبغة</h3><table><thead><tr><th>التاريخ</th><th>المصبغة</th><th>اللون</th><th>العرض / البوصة</th><th>الكمية</th><th>رقم الإذن</th><th>ملاحظات</th></tr></thead><tbody>${productionRows || emptyRow(7, 'لا توجد دفعات استلام مجهز مسجلة.')}</tbody></table></section><section class="report-section"><h3>تسليم العميل</h3><table><thead><tr><th>التاريخ</th><th>اللون</th><th>العرض / البوصة</th><th>الكمية</th><th>ملاحظات</th></tr></thead><tbody>${customerRows || emptyRow(5, 'لا توجد دفعات تسليم عميل مسجلة.')}</tbody></table></section><div class="signatures"><div><span>إعداد</span></div><div><span>مراجعة</span></div><div><span>اعتماد</span></div></div>`;
}
function openDocument(type) {
  const sourceOrder = orders.find((item)=>item.id === selectedOrderId);
  if (!sourceOrder) { alert('اختر طلبًا أولًا.'); return; }
  const order = calculateOrder(sourceOrder);
  if (type === 'dyeing') {
    const names = dyehouseNamesForOrder(order);
    if (names.length > 1) {
      renderDyehouseDocumentPicker(order);
    } else {
      openDyeingDocumentForDyehouse(names[0] || order.dyehouse || '');
    }
    return;
  }
  const fmt = (value) => formatNumber(Number(value || 0));
  const safe = (value) => escapeHtml(value || '-');
  const titleMap = { quotation:'عرض سعر', weaving:'أمر تشغيل نسيج', dyeing:'أمر تشغيل صباغة', waste:'تقرير الهالك', fullreport:'التقرير التفصيلي للطلب', labSamples:'عينات معمل', stickers:'استيكرات التشغيل' };
  const title = titleMap[type] || 'مستند تشغيلي';
  currentDocumentType = type;
  refs.documentTitle.textContent = title;
  refs.documentBody.dataset.documentType = type;
  refs.documentBody.dataset.reportTitle = title;
  refs.documentBody.dataset.reportSubtitle = `رقم الطلب: ${order.orderNumber || '-'} - العميل: ${order.customer || '-'}`;
  if (type === 'dyeing') refs.documentBody.dataset.dyehouseName = order.dyehouse || '';
  let body = '';
  let alreadyWrapped = false;
  if (type === 'quotation') {
    body = buildQuotationDocument(order, fmt, safe);
  } else if (type === 'weaving') {
    body = buildWeavingOrderDocument(order, fmt, safe);
  } else if (type === 'dyeing') {
    body = buildDyeingSummaryDocument(order, fmt, safe);
  } else if (type === 'waste') {
    body = buildWasteReportDocument(order, fmt, safe);
  } else if (type === 'fullreport') {
    body = buildCompactFullReportDocument(order, fmt, safe);
  } else if (type === 'labSamples') {
    body = buildLabSamplesDocument(order, fmt, safe);
    alreadyWrapped = true;
  } else if (type === 'stickers') {
    body = buildStickersDocument(order, fmt, safe);
    alreadyWrapped = true;
  } else {
    body = `${documentHeader()}<div class="report-title"><h2>${title}</h2></div><div class="document-meta"><div><span>رقم الطلب</span>${safe(order.orderNumber)}</div><div><span>العميل</span>${safe(order.customer)}</div><div><span>التاريخ</span>${safe(order.orderDate)}</div><div><span>الصنف</span>${safe(order.fabricType)}</div><div><span>إجمالي الخام</span>${fmt(order.totalRawOrdered)}</div><div><span>المصبغة</span>${safe(order.dyehouse)}</div></div>${documentFooter()}`;
  }
  refs.documentBody.innerHTML = alreadyWrapped ? body : `<div class="document-sheet">${body}</div>`;
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
function installAmalReviewUi() {
  refs.weavingSlipType.innerHTML = '<option value="weaving">إذن خام رايح للمصبغة</option>';
  document.getElementById('amalReviewBox')?.remove();
}
function toggleAmalReviewMode() {
  const normalGrid = refs.weavingSlipOrderNumber.closest('.form-grid');
  if (normalGrid) normalGrid.style.display = '';
  document.getElementById('amalReviewBox')?.remove();
  refs.weavingSlipForm.querySelector('.dialog-actions .primary-btn').textContent = 'تسجيل المستند';
}
function renderAmalSuggestion(suggestion = {}) {
  pendingAmalSuggestion = cloneAmalSuggestion(suggestion);
  const $ = (id)=>document.getElementById(id);
  $('amalOrderNumber').value = pendingAmalSuggestion.orderNumber || '';
  $('amalCustomer').value = pendingAmalSuggestion.customer || '';
  $('amalOrderDate').value = pendingAmalSuggestion.orderDate || '';
  $('amalDyehouse').value = pendingAmalSuggestion.dyehouse || '';
  $('amalRawNote').value = pendingAmalSuggestion.rawNoteNumber || '';
  $('amalWeavingSource').value = pendingAmalSuggestion.weavingSource || 'مصدر النسيج';
  $('amalSpecs').value = pendingAmalSuggestion.specs || '';
  const rows = (pendingAmalSuggestion.rows && pendingAmalSuggestion.rows.length) ? pendingAmalSuggestion.rows : [{}];
  $('amalLinesBody').innerHTML = rows.map((row, index)=>`
    <tr data-amal-row="${index}">
      <td><select data-amal="rowType"><option value="cloth" ${!isAccessoryRow(row)?'selected':''}>قماش</option><option value="accessory" ${isAccessoryRow(row)?'selected':''}>إكسسوار</option></select></td>
      <td><input data-amal="fabricType" value="${row.fabricType || ''}"></td>
      <td><input data-amal="inch" value="${row.inch || ''}"></td>
      <td><input data-amal="quantity" type="number" step="0.01" value="${row.quantity || ''}"></td>
      <td><input data-amal="pantoneCode" value="${row.pantoneCode || row.color || ''}"></td>
      <td><input data-amal="width" type="number" step="0.01" value="${row.width || ''}"></td>
      <td><input data-amal="weight" type="number" step="0.01" value="${row.weight || ''}"></td>
      <td><select data-amal="accessoryType"><option value="">-</option><option value="ريب" ${row.accessoryType==='ريب'?'selected':''}>ريب</option><option value="لياقة" ${row.accessoryType==='لياقة'?'selected':''}>لياقة</option><option value="إكسسوار آخر" ${row.accessoryType==='إكسسوار آخر'?'selected':''}>إكسسوار آخر</option></select></td>
    </tr>`).join('');
}
function applyAmalSuggestionFromFile(file) {
  if (refs.weavingSlipType.value === 'deltexIssue') {
    const rawIssueSuggestion = getRawIssueSuggestionFromFile(file) || {
      orderNumber:'',
      customer:'',
      orderDate:new Date().toISOString().slice(0,10),
      dyehouse:'جيما',
      rawNoteNumber:'',
      weavingSource:'دلتا تكستايل',
      specs:'',
      rows:[],
    };
    renderAmalSuggestion(rawIssueSuggestion);
    const existingOrder = findOrderForRawIssueSuggestion(rawIssueSuggestion);
    if (existingOrder) refs.weavingSlipOrderNumber.value = existingOrder.id;
    refs.weavingSlipDate.value = rawIssueSuggestion.orderDate || refs.weavingSlipDate.value || new Date().toISOString().slice(0,10);
    refs.weavingSlipQuantity.value = rawIssueSuggestion.rawIssueQuantity || rawIssueSuggestion.rows?.filter((row)=>!isAccessoryRow(row)).reduce((total,row)=>total + Number(row.quantity || 0), 0) || '';
    refs.weavingSlipSupplier.value = rawIssueSuggestion.weavingSource || 'دلتا تكستايل';
    refs.weavingSlipNoteNumber.value = rawIssueSuggestion.rawNoteNumber || '';
    refs.weavingSlipNotes.value = rawIssueSuggestion.specs || '';
    updateDocumentReviewFields();
    refs.reviewMatchStatus.textContent = existingOrder
      ? `تمت مطابقة إذن الخام رقم ${rawIssueSuggestion.rawNoteNumber || '-'} مع الطلب ${existingOrder.orderNumber}. راجع البيانات قبل الاعتماد.`
      : `لم يتم العثور على طلب مرتبط بإذن الخام رقم ${rawIssueSuggestion.rawNoteNumber || '-'}. اختر الطلب يدويًا قبل التسجيل.`;
    return;
  }
  const rawIssueSuggestion = getRawIssueSuggestionFromFile(file);
  if (rawIssueSuggestion) {
    renderAmalSuggestion(rawIssueSuggestion);
    const existingOrder = findOrderForRawIssueSuggestion(rawIssueSuggestion);
    if (existingOrder) refs.weavingSlipOrderNumber.value = existingOrder.id;
    refs.reviewMatchStatus.textContent = existingOrder
      ? `تمت مطابقة إذن الخام رقم ${rawIssueSuggestion.rawNoteNumber || '-'} مع الطلب ${existingOrder.orderNumber}. راجع البيانات قبل الاعتماد.`
      : `لم يتم العثور على طلب مرتبط بإذن الخام رقم ${rawIssueSuggestion.rawNoteNumber || '-'}. اختر الطلب يدويًا قبل التسجيل.`;
    return;
  }
  const orderNumber = getAmalOrderNumberFromFile(file);
  const suggestion = cloneAmalSuggestion(AMAL_FASHION_ORDER_LIBRARY[orderNumber] || { orderNumber, customer:'', rows:[] });
  renderAmalSuggestion(suggestion);
  refs.reviewMatchStatus.textContent = orderNumber && AMAL_FASHION_ORDER_LIBRARY[orderNumber] ? `تم التعرف على المستند للطلب ${orderNumber}. راجع البيانات قبل الاعتماد.` : 'لم يتم التعرف على بيانات المستند تلقائيًا. أدخل البيانات أو اختر الطلب يدويًا.';
}
function readAmalSuggestionFromUi() {
  const $ = (id)=>document.getElementById(id);
  const rows = [...document.querySelectorAll('#amalLinesBody tr[data-amal-row]')].map((tr)=>{
    const value = (name)=>tr.querySelector(`[data-amal="${name}"]`)?.value?.trim() || '';
    const rowType = value('rowType');
    return { fabricType:value('fabricType'), inch:value('inch'), quantity:Number(value('quantity') || 0), pantoneCode:value('pantoneCode'), width:Number(value('width') || 0), weight:Number(value('weight') || 0), accessoryType: rowType === 'accessory' ? value('accessoryType') || 'إكسسوار' : '' };
  }).filter((row)=>row.fabricType || row.pantoneCode || row.quantity);
  return { orderNumber:$('amalOrderNumber').value.trim(), customer:$('amalCustomer').value.trim(), orderDate:$('amalOrderDate').value, dyehouse:$('amalDyehouse').value.trim(), rawNoteNumber:$('amalRawNote').value.trim(), weavingSource:$('amalWeavingSource').value.trim(), specs:$('amalSpecs').value.trim(), rows };
}
async function confirmAmalOrderImport() {
  const suggestion = readAmalSuggestionFromUi();
  const reviewType = refs.weavingSlipType.value;
  if (!suggestion.orderNumber || !suggestion.customer || !suggestion.orderDate || !suggestion.dyehouse) { alert('راجع رقم الطلب والعميل والتاريخ والمصبغة قبل الاعتماد.'); return; }
  const clothRows = suggestion.rows.filter((row)=>!isAccessoryRow(row));
  const accessoryRows = suggestion.rows.filter(isAccessoryRow);
  if (!clothRows.length) { alert('يجب وجود بند قماش واحد على الأقل قبل الاعتماد.'); return; }
  const existing = orders.find((order)=>String(order.orderNumber) === String(suggestion.orderNumber));
  if (existing && !confirm(`يوجد طلب مسجل بنفس الرقم ${suggestion.orderNumber}. هل تريد استبداله بالبيانات الحالية؟`)) return;
  if (!(await ensureBackendForWrite('تعذر الاتصال بقاعدة البيانات. لم يتم اعتماد المستند.'))) return;
  if (existing) {
    const deleted = await deleteBackend(`/orders/${existing.id}`);
    if (!deleted) {
      await rollbackAfterBackendWriteFailure('تعذر استبدال الطلب القديم في قاعدة البيانات. لم يتم اعتماد المستند.');
      return;
    }
  }
  const orderId = uid();
  const totalRawQuantity = roundNumber(clothRows.reduce((t,row)=>t+Number(row.quantity||0),0));
  const firstCloth = clothRows[0] || {};
  const accessoryType = accessoryRows[0]?.accessoryType || '';
  const accessoryPercent = accessoryRows.find((row)=>row.accessoryPercent)?.accessoryPercent || calcAccessoryPercentFromRows(suggestion.rows);
  const backendCustomer = await ensureBackendCustomer(suggestion.customer);
  const importedOrder = { id:orderId, orderNumber:suggestion.orderNumber, customer:suggestion.customer, orderDate:suggestion.orderDate, fabricType:firstCloth.fabricType || '', totalRawQuantity, widthMode:'single', inchWidth:firstCloth.inch || '', widthLines:[], kiloPrice:0, paymentTerms:'', accessoryType, accessoryPercent, dyehouse:suggestion.dyehouse, weavingSource:suggestion.weavingSource || '', notes:suggestion.specs || '', status:'pending' };
  const savedOrder = await postBackend('/orders', orderToApi(importedOrder, backendCustomer));
  if (!savedOrder) {
    await rollbackAfterBackendWriteFailure('تعذر حفظ الطلب المستورد في قاعدة البيانات. لم يتم اعتماد المستند.');
    return;
  }
  for (const row of clothRows) {
    const relatedAccessory = accessoryRows.find((item)=>item.pantoneCode && item.pantoneCode === row.pantoneCode);
    const allocation = { id:uid(), orderId, color:row.pantoneCode || row.fabricType || '-', pantoneCode:row.pantoneCode || '', fabricType:row.fabricType || firstCloth.fabricType || '', plannedQuantity:Number(row.quantity || 0), dyehouse:suggestion.dyehouse, targetFinishedWidth:row.width || '', targetFinishedWeight:row.weight || '', accessoryQuantityManual: relatedAccessory ? Number(relatedAccessory.quantity || 0) : null };
    const savedAllocation = await postBackend(`/orders/${orderId}/allocations`, allocationToApi(allocation));
    if (!savedAllocation) {
      await rollbackAfterBackendWriteFailure('تعذر حفظ ألوان الطلب المستورد في قاعدة البيانات. لم يتم اعتماد المستند كاملًا.');
      return;
    }
  }
  if (suggestion.rawNoteNumber) {
    const rawSaved = await postBackend('/batches/dyehouse', batchToApi({ id:uid(), orderId, date:suggestion.orderDate, quantity:totalRawQuantity, supplier:suggestion.weavingSource || '', noteNumber:suggestion.rawNoteNumber, notes:reviewType === 'deltexIssue' ? 'تم تسجيل إذن صرف خام من مراجعة المستند' : 'تم تسجيل أمر صباغة محفوظ من مراجعة المستند', sourceDocument: pendingWeavingSlipImage ? { type:reviewType === 'deltexIssue' ? 'raw-issue-review-image' : 'saved-order-review-image', image:pendingWeavingSlipImage } : null }));
    if (!rawSaved) {
      await rollbackAfterBackendWriteFailure('تعذر حفظ إذن الخام المستورد في قاعدة البيانات. لم يتم اعتماد المستند كاملًا.');
      return;
    }
  }
  for (const row of accessoryRows) {
    const savedAccessory = await postBackend('/batches/accessory', batchToApi({ id:uid(), orderId, date:suggestion.orderDate, accessoryType:row.accessoryType || accessoryType || 'إكسسوار', quantity:Number(row.quantity || 0), noteNumber:suggestion.rawNoteNumber || '', notes:`لون مرتبط: ${row.pantoneCode || '-'}`, movement:'sent' }));
    if (!savedAccessory) {
      await rollbackAfterBackendWriteFailure('تعذر حفظ إكسسوار المستند في قاعدة البيانات. لم يتم اعتماد المستند كاملًا.');
      return;
    }
  }
  selectedOrderId = orderId;
  await loadBackendData();
  refs.weavingSlipDialog.close();
}
function repairGlobalArabicText() {
  document.querySelectorAll('#documentTitle, button, h2, h3, th, .eyebrow, .empty-state').forEach((element)=>{
    if (isLegacyRecoveredText(element.textContent || '')) element.textContent = 'مراجعة';
  });
}

function renderAll() { ensureRuntimeCollections(); renderPricings(); renderOrderFilters(); renderOrders(); renderDetails(); repairGlobalArabicText(); }
let pendingWeavingSlipImage = '';
function resizeSlipImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const maxWidth = 2200;
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.94));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
function getReviewedOrder() {
  const orderId = refs.weavingSlipOrderNumber.value || '';
  return orderId ? calculateOrder(orders.find((item)=>item.id===orderId)) : null;
}
function fillReviewOrderOptions() {
  refs.weavingSlipOrderNumber.innerHTML = `<option value="">اختر الطلب المرتبط بالمستند</option>${orders.map((order)=>`<option value="${order.id}">${order.orderNumber} - ${order.customer} - ${order.fabricType}</option>`).join('')}`;
}
function normalizeNote(value) {
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return String(value || '').trim()
    .replace(/[٠-٩]/g, (digit)=>String(arabicDigits.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit)=>String(persianDigits.indexOf(digit)))
    .replace(/\s+/g, '');
}
function findOrderByReviewedNote(noteNumber) {
  const note = normalizeNote(noteNumber);
  if (!note) return null;
  const sources = [
    ...rawBatches.map((batch)=>({ kind:'دفعة خام مستلمة', orderId:batch.orderId, allocationId:'', batch })),
    ...accessoryBatches.map((batch)=>({ kind:'إكسسوار', orderId:batch.orderId, allocationId:'', batch })),
    ...productionBatches.map((batch)=>({ kind:'استلام مجهز من المصبغة', orderId:allocations.find((item)=>item.id===batch.allocationId)?.orderId || '', allocationId:batch.allocationId, batch })),
    ...customerBatches.map((batch)=>({ kind:'تسليم عميل', orderId:allocations.find((item)=>item.id===batch.allocationId)?.orderId || '', allocationId:batch.allocationId, batch })),
  ];
  return sources.find((item)=> item.orderId && normalizeNote(item.batch.noteNumber) === note) || null;
}
function matchReviewByNoteNumber() {
  const match = findOrderByReviewedNote(refs.weavingSlipNoteNumber.value);
  if (!match) {
    refs.reviewMatchStatus.textContent = 'لم يتم العثور على طلب مرتبط بهذا الرقم. راجع رقم الإذن أو اختر الطلب يدويًا.';
    return;
  }
  refs.weavingSlipOrderNumber.value = match.orderId;
  updateDocumentReviewFields();
  if (match.allocationId && refs.weavingSlipAllocation) refs.weavingSlipAllocation.value = match.allocationId;
  if (!refs.weavingSlipQuantity.value && match.batch.quantity) refs.weavingSlipQuantity.value = match.batch.quantity;
  const order = orders.find((item)=>item.id===match.orderId);
  refs.reviewMatchStatus.textContent = `تمت المطابقة مع الطلب ${order?.orderNumber || '-'} / ${order?.customer || '-'} من خلال ${match.kind}. راجع البيانات قبل التسجيل.`;
}
function updateDocumentReviewFields() {
  const type = refs.weavingSlipType.value;
  toggleAmalReviewMode();
  if (type === 'amalOrder') return;
  const order = getReviewedOrder();
  const needsAllocation = type === 'production' || type === 'customer';
  const needsRawIssueFields = type === 'weaving' || type === 'deltexIssue';
  refs.weavingSlipAllocation.closest('label').style.display = needsAllocation ? '' : 'none';
  refs.weavingSlipAllocation.required = needsAllocation;
  refs.weavingSlipWidthLine.closest('label').style.display = needsRawIssueFields ? '' : 'none';
  refs.weavingSlipSupplier.closest('label').style.display = needsRawIssueFields ? '' : 'none';
  refs.weavingSlipSupplier.required = needsRawIssueFields;
  refs.weavingSlipWidthLine.innerHTML = '<option value="">اختر العرض / البوصة بعد اختيار الطلب</option>';
  refs.weavingSlipAllocation.innerHTML = '<option value="">اختر اللون / البند بعد اختيار الطلب</option>';
  refs.weavingSlipWidthLine.required = false;
  if (!order) return;
  refs.weavingSlipWidthLine.innerHTML = order.widthMode === 'multiple'
    ? `<option value="">اختر العرض المطلوب</option>${order.widthLines.map((item)=>`<option value="${item.id}">بوصة ${item.inch} / عرض ${item.width} / كمية ${item.quantity}</option>`).join('')}`
    : `<option value="">غير مطلوب لطلب عرض واحد</option>`;
  refs.weavingSlipWidthLine.required = needsRawIssueFields && order.widthMode === 'multiple';
  refs.weavingSlipAllocation.innerHTML = `<option value="">اختر اللون / البند</option>${order.allocations.map((item)=>`<option value="${item.id}">${item.color} / عرض ${item.targetFinishedWidth} / كمية ${item.plannedQuantity}</option>`).join('')}`;
}
function openDocumentReviewDialog() {
  pendingWeavingSlipImage = '';
  refs.weavingSlipForm.reset();
  refs.weavingSlipFile.value = '';
  refs.weavingSlipPreview.removeAttribute('src');
  fillReviewOrderOptions();
  refs.weavingSlipOrderNumber.value = '';
  refs.weavingSlipDate.value = '';
  refs.weavingSlipQuantity.value = '';
  refs.weavingSlipSupplier.value = '';
  refs.weavingSlipNoteNumber.value = '';
  refs.weavingSlipNotes.value = '';
  updateDocumentReviewFields();
  refs.weavingSlipDialog.showModal();
}const openWeavingSlipDialog = openDocumentReviewDialog;
async function handleWeavingSlipFile() {
  const file = refs.weavingSlipFile.files?.[0];
  if (!file) return;
  pendingWeavingSlipImage = await resizeSlipImage(file);
  refs.weavingSlipPreview.src = pendingWeavingSlipImage;
  if (refs.weavingSlipType.value === 'amalOrder' || refs.weavingSlipType.value === 'deltexIssue') applyAmalSuggestionFromFile(file);
}
async function confirmWeavingSlip(event) {
  event.preventDefault();
  if (refs.weavingSlipType.value === 'amalOrder') { await confirmAmalOrderImport(); return; }
  const order = getReviewedOrder();
  if (!order) { alert('اختر الطلب المرتبط بالمستند قبل التسجيل.'); return; }
  const type = refs.weavingSlipType.value;
  const isRawIssue = type === 'weaving' || type === 'deltexIssue';
  if (isRawIssue && order.widthMode === 'multiple' && !refs.weavingSlipWidthLine.value) { alert('اختر العرض / البوصة المرتبطة بإذن الخام.'); return; }
  if ((type === 'production' || type === 'customer') && !refs.weavingSlipAllocation.value) { alert('اختر اللون / البند المرتبط بالحركة.'); return; }
  const quantity = Number(refs.weavingSlipQuantity.value || 0);
  if (!quantity) { alert('أدخل الكمية قبل التسجيل.'); return; }
  const common = {
    id: uid(),
    date: refs.weavingSlipDate.value,
    quantity,
    noteNumber: refs.weavingSlipNoteNumber.value || '',
    notes: refs.weavingSlipNotes.value || '',
    sourceDocument: pendingWeavingSlipImage ? { type:type === 'deltexIssue' ? 'raw-issue-review-image' : `${type}-review-image`, image:pendingWeavingSlipImage } : null,
  };
  if (type === 'pricing') {
    refs.pricingNumber.value = `Q-${order.orderNumber || ''}`;
    refs.pricingCustomer.value = order.customer || '';
    refs.pricingDate.value = refs.weavingSlipDate.value;
    refs.pricingFabricType.value = order.fabricType || '';
    refs.pricingQuantity.value = quantity;
    refs.pricingInchWidth.value = order.inchWidth || '';
    refs.pricingPaymentTerms.value = order.paymentTerms || '';
    refs.pricingNotes.value = refs.weavingSlipNotes.value || '';
    updatePricingPreview();
    refs.weavingSlipDialog.close();
    refs.pricingDialog.showModal();
    return;
  }
  if (!(await ensureBackendForWrite('تعذر الاتصال بقاعدة البيانات. لم يتم تسجيل المستند.'))) return;
  let saved = null;
  if (isRawIssue) {
    const existingRawBatch = rawBatches.find((batch)=>batch.orderId === order.id && normalizeDigits(batch.noteNumber) === normalizeDigits(common.noteNumber));
    const rawBatch = existingRawBatch
      ? { ...existingRawBatch, date: common.date || existingRawBatch.date, quantity: quantity || existingRawBatch.quantity, notes: common.notes || existingRawBatch.notes, widthLineId: refs.weavingSlipWidthLine.value || existingRawBatch.widthLineId || '', supplier: refs.weavingSlipSupplier.value || existingRawBatch.supplier || '', sourceDocument: common.sourceDocument || existingRawBatch.sourceDocument || null }
      : { ...common, orderId:order.id, widthLineId:refs.weavingSlipWidthLine.value || '', supplier: refs.weavingSlipSupplier.value || '' };
    saved = existingRawBatch
      ? await putBackend(`/batches/dyehouse/${existingRawBatch.id}`, batchToApi(rawBatch))
      : await postBackend('/batches/dyehouse', batchToApi(rawBatch));
  }
  if (type === 'production') saved = await postBackend('/batches/finished', batchToApi({ ...common, orderId:order.id, allocationId:refs.weavingSlipAllocation.value }));
  if (type === 'customer') saved = await postBackend('/batches/customer', batchToApi({ ...common, orderId:order.id, allocationId:refs.weavingSlipAllocation.value }));
  if (!saved) {
    await rollbackAfterBackendWriteFailure('تعذر حفظ بيانات المستند في قاعدة البيانات. لم يتم اعتماد التسجيل.');
    return;
  }
  await loadBackendData();
  refs.weavingSlipDialog.close();
}

function documentHeader() {
  return '<div class="document-brand"><div class="document-brand-info"><strong>2B Tex</strong><span>العاشر من رمضان</span><span>خدمة العملاء: 01000343835</span></div><div class="document-brand-logo"><img src="./2b-mark.svg" alt="2B Tex"><span>للنسيج والصباغة والتجهيز</span></div></div>';
}


function documentLogo() {
  return '<img src="./2b-mark.svg" alt="2B Tex" style="max-width:140px;height:auto">';
}

function rawPermitImagesSection(order, rawNotes = null) {
  const wantedNotes = rawNotes ? new Set(rawNotes.map((note)=>normalizeDigits(note)).filter(Boolean)) : null;
  const orderImages = rawBatches
    .filter((batch)=>batch.orderId === order.id && batch.sourceDocument?.image)
    .map((batch)=>({ noteNumber:batch.noteNumber || '-', normalizedNote:normalizeDigits(batch.noteNumber), image:batch.sourceDocument.image }));
  let images = wantedNotes && wantedNotes.size
    ? orderImages.filter((item)=>wantedNotes.has(item.normalizedNote))
    : orderImages;
  if (!images.length && orderImages.length) images = orderImages;
  if (!images.length) return '';
  const cards = images.map((item)=>`<figure><img src="${item.image}" alt="صورة إذن الخام ${item.noteNumber}"><figcaption>إذن خام: ${item.noteNumber}</figcaption></figure>`).join('');
  return `<section class="report-section raw-permit-section"><h3>صورة إذن الخام</h3><div class="raw-permit-gallery">${cards}</div></section>`;
}

function buildDyeingOrderReport(order, dyehouseName, fmt) {
  const name = String(dyehouseName || '').trim();
  const originalDyehouse = String(order.dyehouse || '').trim();
  const isOriginalDyehouse = !name || name === originalDyehouse;
  const transfersToDyehouse = dyehouseTransfers.filter((transfer)=>transfer.orderId === order.id && String(transfer.toDyehouse || '').trim() === name);
  const transfersFromDyehouse = dyehouseTransfers.filter((transfer)=>transfer.orderId === order.id && String(transfer.fromDyehouse || '').trim() === name && String(transfer.toDyehouse || '').trim() !== name);
  const rawBatchesForOriginalDyehouse = rawBatches.filter((batch)=>batch.orderId === order.id);
  const reportRawTotal = isOriginalDyehouse
    ? roundNumber(Math.max(sum(rawBatchesForOriginalDyehouse) - sum(transfersFromDyehouse), 0))
    : roundNumber(sum(transfersToDyehouse));
  const transferMatchesAllocation = (transfer, allocation) => {
    const transferColor = String(transfer.color || '').trim();
    const allocationColor = String(allocation.color || allocation.pantoneCode || '').trim();
    return transfer.newAllocationId === allocation.id || transfer.allocationId === allocation.id || (!!transferColor && transferColor === allocationColor);
  };
  const transfersForAllocation = (allocation) => transfersToDyehouse.filter((transfer)=>transferMatchesAllocation(transfer, allocation));
  const baseDyehouseAllocations = (order.allocations || []).filter((allocation)=>String(allocation.dyehouse || order.dyehouse || '').trim() === name);
  const dyehouseAllocations = isOriginalDyehouse ? baseDyehouseAllocations : baseDyehouseAllocations.filter((allocation)=>transfersForAllocation(allocation).length > 0);
  const hasAccessory = order.accessoryLines.length > 0;
  const plannedTotal = dyehouseAllocations.reduce((total, allocation)=>total + Number(allocation.plannedQuantity || 0), 0);
  const rawNotesForAllocation = (allocation) => {
    const transferNotes = uniqueNonEmpty(transfersForAllocation(allocation).map((transfer)=>transfer.noteNumber));
    if (!isOriginalDyehouse) return transferNotes;
    return uniqueNonEmpty(rawBatchesForOriginalDyehouse
      .filter((batch)=>!allocation.widthLineId || !batch.widthLineId || batch.widthLineId === allocation.widthLineId)
      .map((batch)=>batch.noteNumber));
  };
  const rawSentForAllocation = (allocation) => {
    if (!isOriginalDyehouse) return roundNumber(sum(transfersForAllocation(allocation)));
    return plannedTotal ? roundNumber(reportRawTotal * Number(allocation.plannedQuantity || 0) / plannedTotal) : 0;
  };
  const actualSentTotal = reportRawTotal || dyehouseAllocations.reduce((total, allocation)=>total + rawSentForAllocation(allocation), 0);
  const dyehouseRawNotes = isOriginalDyehouse && !dyehouseAllocations.length
    ? uniqueNonEmpty(rawBatchesForOriginalDyehouse.map((batch)=>batch.noteNumber))
    : uniqueNonEmpty(dyehouseAllocations.flatMap(rawNotesForAllocation));
  const rawNotesLabel = dyehouseRawNotes.length ? dyehouseRawNotes.join('، ') : '-';
  const dyehouseDates = isOriginalDyehouse
    ? uniqueNonEmpty(rawBatchesForOriginalDyehouse.map((batch)=>batch.date))
    : uniqueNonEmpty(transfersToDyehouse.map((transfer)=>transfer.transferDate || transfer.date));
  const reportDate = dyehouseDates.join('، ') || order.orderDate || '-';
  const cleanDyeingMeta = `<div class="document-meta"><div><span>رقم الطلب</span>${order.orderNumber || '-'}</div><div><span>التاريخ</span>${reportDate}</div><div><span>الصنف</span>${order.fabricType || '-'}</div><div><span>أذون صرف الخام</span>${rawNotesLabel}</div></div>`;
  const allocationWarning = plannedTotal > Number(order.totalRawReceived || order.totalRawOrdered || 0)
    ? '<div class="document-warning">تنبيه للمراجعة: كمية الصباغة لهذه المصبغة أكبر من كمية الخام المتاحة.</div>'
    : '';
  const rows = dyehouseAllocations.map((allocation)=>{
    const accessoryQuantity = hasAccessory ? allocation.accessoryQuantity : 0;
    return `<tr><td>${allocation.color}</td>${order.widthMode === 'multiple' ? `<td>${allocation.rawInch || '-'}</td>` : ''}<td>${allocation.targetFinishedWidth || '-'}</td><td>${fmt(allocation.plannedQuantity)}</td><td>${allocation.targetFinishedWeight}</td>${hasAccessory ? `<td>${fmt(accessoryQuantity)}</td>` : ''}</tr>`;
  }).join('');
  return `${documentHeader()}<h2>أمر تشغيل صباغة</h2>${cleanDyeingMeta}<div class="document-meta"><div><span>المصبغة</span>${name || '-'}</div><div><span>إجمالي كمية المصبغة</span>${fmt(plannedTotal)}</div><div><span>رصيد الخام في المصبغة</span>${fmt(actualSentTotal)}</div><div><span>عدد الألوان</span>${dyehouseAllocations.length}</div></div>${allocationWarning}<table><thead><tr><th>اللون</th>${order.widthMode === 'multiple' ? '<th>البوصة</th>' : ''}<th>العرض</th><th>كمية الصباغة</th><th>الوزن المجهز</th>${hasAccessory ? `<th>${accessoryTypesLabel(order)}</th>` : ''}</tr></thead><tbody>${rows || emptyRow(order.widthMode === 'multiple' ? (hasAccessory ? 6 : 5) : (hasAccessory ? 5 : 4), 'لا توجد ألوان لهذه المصبغة.')}</tbody></table><section class="report-section"><h3>ملاحظات تشغيل</h3><p>${reportOperationNotes(order)}</p></section>${rawPermitImagesSection(order, dyehouseRawNotes)}`;
}

function renderDyehouseDocumentPicker(order) {
  const names = dyehouseNamesForOrder(order);
  refs.documentTitle.textContent = 'اختيار أمر صباغة';
  refs.documentBody.dataset.documentType = 'dyeing-picker';
  refs.documentBody.dataset.dyehouseName = '';
  refs.documentBody.innerHTML = `<div class="document-sheet">
    ${documentHeader()}
    <div class="report-title"><h2>اختيار أمر صباغة</h2><span>اختر المصبغة المطلوبة لفتح أمر تشغيل منفصل لكل مصبغة.</span></div>
    <table><thead><tr><th>المصبغة</th><th>عدد الألوان</th><th>إجمالي كمية الصباغة</th><th>إجراء</th></tr></thead><tbody>${names.map((name)=>{
      const rows = (order.allocations || []).filter((allocation)=>String(allocation.dyehouse || order.dyehouse || '').trim() === name);
      const quantity = rows.reduce((total, row)=>total + Number(row.plannedQuantity || 0), 0);
      return `<tr><td>${escapeHtml(name)}</td><td>${rows.length}</td><td>${formatNumber(quantity)}</td><td><button class="mini-btn gold" type="button" data-open-dyeing-for="${escapeHtml(name)}">فتح أمر الصباغة</button></td></tr>`;
    }).join('') || emptyRow(4, 'لا توجد مصابغ مرتبطة بهذا الطلب.')}</tbody></table>
  </div>`;
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}

function promptOperationNotes(sourceOrder, type, dyehouseName = '') {
  if (!sourceOrder) return null;
  const key = operationNotesKey(type, dyehouseName);
  const current = sourceOrder.operationNotes?.[key] || '';
  const title = type === 'dyeing'
    ? `ملاحظات أمر تشغيل الصباغة${dyehouseName ? ` - ${dyehouseName}` : ''}`
    : 'ملاحظات أمر تشغيل النسيج';
  const value = prompt(title, current);
  if (value === null) return null;
  sourceOrder.operationNotes = sourceOrder.operationNotes && typeof sourceOrder.operationNotes === 'object' && !Array.isArray(sourceOrder.operationNotes) ? sourceOrder.operationNotes : {};
  sourceOrder.operationNotes[key] = value.trim();
  save();
  return sourceOrder.operationNotes[key];
}
if (refs.weavingSlipDialog) installAmalReviewUi();
applyPricingDyehouseOptions();
refs.openPricingFormBtn.onclick = () => { editingPricingId = null; if (refs.deletePricingBtn) refs.deletePricingBtn.style.display = 'none'; refs.pricingForm.reset(); refs.pricingNumber.value = nextPricingNumber(); refs.pricingDate.value = new Date().toISOString().slice(0,10); syncAutoCodes(); updatePricingPreview(); refs.pricingDialog.showModal(); };
refs.deletePricingBtn.onclick = () => { if (editingPricingId) deletePricing(editingPricingId).catch((error)=>{ console.error('pricing-delete-error', error); alert('تعذر حذف التسعيرة.'); }); };
if (refs.openDocumentReviewBtn) refs.openDocumentReviewBtn.onclick = openDocumentReviewDialog;
refs.openOrderFormBtn.onclick = () => { pendingConvertedPricingId = null; editingOrderId = null; refs.orderForm.reset(); refs.orderDate.value = new Date().toISOString().slice(0,10); syncAutoCodes(); renderWidthLinesEditor(); renderAccessoryLinesEditor(); syncWidthModeUi(); refs.orderDialog.showModal(); };
if (refs.openOrdersReportBtn) refs.openOrdersReportBtn.onclick = openOrdersReport;
if (refs.openDyehouseBalancesReportBtn) refs.openDyehouseBalancesReportBtn.onclick = openDyehouseBalancesReport;
if (refs.openManagementReportsBtn) refs.openManagementReportsBtn.onclick = openManagementReportsMenu;
if (refs.documentBody) refs.documentBody.addEventListener('click', (event)=>{
  const button = event.target.closest('[data-management-report]');
  if (button) {
    event.preventDefault();
    event.stopPropagation();
    openManagementReport(button.dataset.managementReport);
    return;
  }
  const retryButton = event.target.closest('[data-retry-outbox]');
  if (retryButton) retryOutbox(retryButton.dataset.retryOutbox);
  const addGroupButton = event.target.closest('[data-add-whatsapp-group-row]');
  if (addGroupButton) {
    const type = addGroupButton.dataset.addWhatsappGroupRow || 'dyehouse';
    const label = addGroupButton.dataset.rowLabel || 'اسم البند';
    [...refs.documentBody.querySelectorAll('[data-whatsapp-group-rows]')].find((body)=>body.dataset.whatsappGroupRows === type)?.insertAdjacentHTML('beforeend', whatsappSettingsRowHtml(type, label));
    refs.documentBody.querySelectorAll('[data-group-name]').forEach((input)=>input.setAttribute('list', 'whatsappGroupNames'));
  }
  const deleteButton = event.target.closest('[data-delete-group-row]');
  if (deleteButton) deleteButton.closest('[data-whatsapp-group-row]')?.remove();
  if (event.target.closest('[data-save-whatsapp-settings]')) saveWhatsappSettingsFromDialog().catch((error)=>{ console.error('whatsapp-settings-save-error', error); alert('تعذر حفظ إعدادات واتساب.'); });
  if (event.target.closest('[data-add-price-row]')) {
    refs.documentBody.querySelector('[data-dyehouse-price-rows]')?.insertAdjacentHTML('beforeend', dyehousePriceRowHtml());
  }
  const deletePriceButton = event.target.closest('[data-delete-price-row]');
  if (deletePriceButton) deletePriceButton.closest('[data-dyehouse-price-row]')?.remove();
  if (event.target.closest('[data-save-dyehouse-prices]')) saveDyehousePricesFromDialog().catch((error)=>{ console.error('dyehouse-prices-save-error', error); alert('تعذر حفظ أسعار المصابغ.'); });
  const dyeingDocButton = event.target.closest('[data-open-dyeing-for]');
  if (dyeingDocButton) openDyeingDocumentForDyehouse(dyeingDocButton.dataset.openDyeingFor);
  if (event.target.closest('[data-refresh-a5-accounts]')) renderA5AccountsDialog();
  const a5LedgerButton = event.target.closest('[data-a5-ledger]');
  if (a5LedgerButton) renderA5LedgerDialog(a5LedgerButton.dataset.a5Ledger);
  if (event.target.closest('[data-back-a5-accounts]')) renderA5AccountsDialog();
  if (event.target.closest('[data-export-a5-csv]')) exportA5AccountingCsv();
  const ledgerButton = event.target.closest('[data-customer-ledger]');
  if (ledgerButton) renderCustomerLedgerDialog(ledgerButton.dataset.customerLedger);
  if (event.target.closest('[data-back-customer-accounts]')) renderCustomerAccountsDialog();
  const openingButton = event.target.closest('[data-save-opening-balance]');
  if (openingButton) saveCustomerOpeningBalance(openingButton.dataset.saveOpeningBalance).catch((error)=>{ console.error('customer-opening-save-error', error); alert('تعذر حفظ رصيد العميل.'); });
  const paymentButton = event.target.closest('[data-add-customer-payment]');
  if (paymentButton) addCustomerPayment(paymentButton.dataset.addCustomerPayment).catch((error)=>{ console.error('customer-payment-save-error', error); alert('تعذر حفظ دفعة العميل.'); });
  const deletePaymentButton = event.target.closest('[data-delete-customer-payment]');
  if (deletePaymentButton) deleteCustomerPayment(deletePaymentButton.dataset.customerName, deletePaymentButton.dataset.deleteCustomerPayment).catch((error)=>{ console.error('customer-payment-delete-error', error); alert('تعذر حذف دفعة العميل.'); });
});

refs.closePricingFormBtn.onclick = () => refs.pricingDialog.close();
refs.closeOrderFormBtn.onclick = () => { pendingConvertedPricingId = null; refs.orderDialog.close(); };
refs.pricingForm.onsubmit = (event) => addPricing(event).catch((error)=>{ console.error('pricing-save-error', error); alert('تعذر حفظ التسعيرة.'); });
refs.pricingNumber.readOnly = true;
['pricingQuantity','pricingRawCost','pricingDyeCost','pricingWastePercent','pricingExtraCost','pricingProfitPerKg'].forEach((key)=>refs[key].oninput = updatePricingPreview);
['pricingDyehouse','pricingMaterialType'].forEach((key)=>refs[key].onchange = () => { applyPricingColorOptions(); updateSuggestedDyeCost(); });
refs.pricingColorClass.onchange = updateSuggestedDyeCost;
refs.widthMode.onchange = syncWidthModeUi;
refs.addWidthLineBtn.onclick = () => refs.widthLinesEditor.insertAdjacentHTML('beforeend', widthLineRowHtml());
refs.widthLinesEditor.onclick = (event) => { if (event.target.dataset.removeWidthLine !== undefined) event.target.closest('.width-line-row')?.remove(); };
refs.addAccessoryLineBtn.onclick = () => refs.accessoryLinesEditor.insertAdjacentHTML('beforeend', accessoryLineRowHtml());
refs.accessoryLinesEditor.onclick = (event) => { if (event.target.dataset.removeAccessoryLine !== undefined) event.target.closest('.accessory-line-row')?.remove(); };
refs.orderForm.onsubmit = (event) => addOrder(event).catch((error)=>{ console.error('order-save-error', error); alert('تعذر حفظ الطلب.'); });
refs.orderNumber.oninput = syncAutoCodes;
refs.searchInput.oninput = refs.orderStatusFilter.oninput = refs.customerFilter.oninput = refs.dyehouseFilter.oninput = refs.fabricFilter.oninput = renderOrders;
refs.pricingTableBody.onclick = (event) => { if (event.target.dataset.pricingQuote) openPricingQuotation(event.target.dataset.pricingQuote); if (event.target.dataset.convertPricing) convertPricingToOrder(event.target.dataset.convertPricing); if (event.target.dataset.editPricing) editPricing(event.target.dataset.editPricing); if (event.target.dataset.deletePricing) deletePricing(event.target.dataset.deletePricing).catch((error)=>{ console.error('pricing-delete-error', error); alert('تعذر حذف التسعيرة.'); }); };
refs.ordersTableBody.onclick = (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.view) {
    selectedOrderId = button.dataset.view;
    try {
      renderDetails();
      refs.orderDetailsPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      console.error('Order details failed', error);
      recordAudit('error', 'orderDetails', button.dataset.view, null, { message: error && error.message ? error.message : String(error) }, 'فشل فتح تفاصيل الطلب');
      persistAuditLog().catch((saveError)=>console.warn('audit-save-failed', saveError));
      refs.orderDetailsPanel.innerHTML = '<div class="empty-state">تعذر فتح تفاصيل الطلب حاليًا. راجع البيانات ثم حاول مرة أخرى.</div>';
      alert(`تعذر فتح تفاصيل الطلب. سبب الخطأ: ${error && error.message ? error.message : String(error)}`);
    }
    return;
  }
  if (button.dataset.editOrder) {
    editingOrderId = button.dataset.editOrder;
    const order = orders.find((item)=>item.id===editingOrderId);
    if (order) { selectedOrderId = order.id; fillOrderForm(order); refs.orderDialog.showModal(); }
    return;
  }
  if (button.dataset.deleteOrder) deleteOrder(button.dataset.deleteOrder).catch((error)=>{ console.error('order-delete-error', error); alert('تعذر حذف الطلب.'); });
};
refs.orderDetailsPanel.addEventListener('submit', (event) => {
  addBatch(event).catch((error) => {
    console.error('batch-save-error', error);
    alert('تعذر حفظ الحركة. راجع البيانات ثم حاول مرة أخرى.');
  });
});
refs.orderDetailsPanel.addEventListener('input', (event) => {
  const form = event.target.closest('.batch-form');
  if (form) form.dataset.dirty = 'true';
});
refs.orderDetailsPanel.addEventListener('change', (event) => {
  const form = event.target.closest('.batch-form');
  if (form) form.dataset.dirty = 'true';
  if (event.target.name === 'movementKind') {
    if (form?.dataset.form === 'raw') updateRawMovementVisibility(form);
    if (form?.dataset.form === 'customer') updateCustomerDeliveryFields(form);
  }
});
refs.orderDetailsPanel.addEventListener('click', (event) => {
  const target = event.target.closest('button');
  if (!target) return;
  if (target.id === 'editOrderBtn') { editingOrderId = selectedOrderId; const order = orders.find((item)=>item.id===selectedOrderId); if (order) { fillOrderForm(order); refs.orderDialog.showModal(); } }
  if (target.id === 'toggleOperationClosedBtn') { event.preventDefault(); toggleOperationClosed().catch((error)=>{ console.error('operation-close-error', error); alert('تعذر حفظ حالة دورة التشغيل.'); }); return; }
  if (target.id === 'addAllocationBtn') addAllocation().catch((error)=>{ console.error('allocation-add-error', error); alert('تعذر حفظ اللون.'); });
  if (target.dataset.editAllocation) editAllocation(target.dataset.editAllocation).catch((error)=>{ console.error('allocation-edit-error', error); alert('تعذر تعديل اللون.'); });
  if (target.dataset.deleteAllocation) deleteAllocation(target.dataset.deleteAllocation).catch((error)=>{ console.error('allocation-delete-error', error); alert('تعذر حذف اللون.'); });
  if (target.dataset.transferAllocation) transferAllocationDyehouse(target.dataset.transferAllocation).catch((error)=>{ console.error('allocation-transfer-error', error); alert('تعذر حفظ تحويل المصبغة.'); });
  const action = target.dataset.batchAction;
  if (action === 'delete') deleteBatch(target.dataset.batchType, target.dataset.batchId).catch((error)=>{ console.error('batch-delete-error', error); alert('تعذر حذف الحركة.'); });
  if (action === 'edit') editBatch(target.dataset.batchType, target.dataset.batchId).catch((error)=>{ console.error('batch-edit-error', error); alert('تعذر تعديل الحركة.'); });
  if (target.dataset.retryOutbox) retryOutbox(target.dataset.retryOutbox);
});
function safeOpenDocument(type) {
  try {
    openDocument(type === 'labsamples' ? 'labSamples' : type);
  } catch (error) {
    console.error('document-open-error', error);
    alert('تعذر فتح المستند حاليًا. راجع بيانات الطلب ثم حاول مرة أخرى.');
  }
}
function printCurrentDocument(stickerId = null) {
  const isSticker = currentDocumentType === 'stickers' || !!refs.documentBody.querySelector('.sticker-sheet');
  let stickerPrintStyle = null;
  const cleanup = () => {
    document.body.classList.remove('printing-stickers');
    if (stickerPrintStyle) stickerPrintStyle.remove();
  };
  if (isSticker) {
    const cards = [...refs.documentBody.querySelectorAll('.sticker-card')];
    if (stickerId || cards.length === 1) {
      const selectedId = stickerId || cards[0]?.dataset.stickerId || '';
      document.body.classList.add('printing-stickers');
      stickerPrintStyle = document.createElement('style');
      stickerPrintStyle.textContent = `@media print { @page { size: 55mm 40mm; margin: 0; } body.printing-stickers .sticker-card:not([data-sticker-id="${selectedId}"]) { display:none!important; } }`;
      document.head.appendChild(stickerPrintStyle);
    }
  }
  window.addEventListener('afterprint', cleanup, { once:true });
  setTimeout(() => window.print(), 80);
  setTimeout(cleanup, 4000);
}
refs.documentBody.addEventListener('click', (event) => { if (event.target.dataset.printSticker) printCurrentDocument(event.target.dataset.printSticker); if (event.target.dataset.editPricingDoc) editPricing(event.target.dataset.editPricingDoc); if (event.target.dataset.convertPricing) convertPricingToOrder(event.target.dataset.convertPricing); });
refs.documentsPanel.onclick = (event) => { const type = event.target.dataset.doc; if (!type) return; if (type === 'print') { safeOpenDocument('dyeing'); setTimeout(()=>printCurrentDocument(),150); return; } safeOpenDocument(type); };
refs.closeDocumentBtn.onclick = () => refs.documentDialog.close();
if (refs.weavingSlipDialog) {
  refs.closeWeavingSlipBtn.onclick = () => refs.weavingSlipDialog.close();
  refs.weavingSlipType.onchange = () => { updateDocumentReviewFields(); if ((refs.weavingSlipType.value === 'amalOrder' || refs.weavingSlipType.value === 'deltexIssue') && refs.weavingSlipFile.files?.[0]) applyAmalSuggestionFromFile(refs.weavingSlipFile.files[0]); };
  refs.weavingSlipOrderNumber.onchange = updateDocumentReviewFields;
  refs.reviewMatchNoteBtn.onclick = matchReviewByNoteNumber;
  refs.weavingSlipFile.onchange = () => handleWeavingSlipFile().catch(()=>alert('تعذر قراءة صورة المستند. جرّب صورة أوضح أو ملفًا آخر.'));
refs.weavingSlipForm.onsubmit = (event) => confirmWeavingSlip(event).catch((error)=>{ console.error('document-review-save-error', error); alert('تعذر تسجيل المستند.'); });
}
refs.printDocumentBtn.onclick = () => printCurrentDocument();
if (refs.analyzeReportBtn) refs.analyzeReportBtn.onclick = analyzeReportWithAi;
if (refs.closeAiAnalysisBtn) refs.closeAiAnalysisBtn.onclick = () => refs.aiAnalysisDialog.close();
if (refs.copyAiWhatsappBtn) refs.copyAiWhatsappBtn.onclick = copyAiWhatsappMessage;
function currentReportTypeFromDocument() {
  const documentType = refs.documentBody?.dataset.documentType || currentDocumentType;
  const directTypes = {
    weaving:'weaving_production_order',
    dyeing:'dyeing_production_order',
    fullreport:'dyehouses_report',
    'orders-follow':'orders_follow_report',
    'dyehouse-balances':'dyehouse_balances_report',
  };
  if (directTypes[documentType]) return directTypes[documentType];
  if (documentType === 'management-report') return `management_${cleanCodePart(refs.documentBody.dataset.reportKey || refs.documentTitle.textContent || 'report')}`;
  if (['quotation','waste','rawreport','productionreport','customerreport'].includes(documentType)) return `${documentType}_pdf_report`;
  return '';
}
function currentShareReportPayload(reportType) {
  const documentType = refs.documentBody?.dataset.documentType || currentDocumentType;
  const sourceOrder = orders.find((item)=>item.id===selectedOrderId);
  if (sourceOrder && ['weaving','dyeing','fullreport','quotation','waste','rawreport','productionreport','customerreport'].includes(documentType)) {
    const order = calculateOrder(sourceOrder);
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
    const blob = await reportToPngBlob();
    const fileName = `${cleanCodePart(reportTypeLabels[reportType] || refs.documentTitle?.textContent || '2B-Tex')}-${cleanCodePart(order.orderNumber || 'report')}.png`;
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
    alert('تعذر تجهيز صورة المشاركة. جرّب الطباعة PDF أو أعد فتح التقرير مرة أخرى.');
  } finally {
    refs.shareWhatsAppBtn.disabled = false;
    refs.shareWhatsAppBtn.textContent = oldText;
  }
}
async function shareCurrentReportPngManual() {
  return await shareCurrentReportPdf();
}
window.shareCurrentReportPngManual = shareCurrentReportPngManual;
if (refs.shareWhatsAppBtn) {
  refs.shareWhatsAppBtn.textContent = 'مشاركة PNG';
  refs.shareWhatsAppBtn.onclick = shareCurrentReportPngManual;
}

initialLocalStorageSnapshot = captureLocalStorageSnapshot();
loadBackendData();
installAutomationUi();
pollBackendStatus();
pollWhatsappService();
setInterval(pollBackendStatus, 15000);
setInterval(pollWhatsappService, 15000);

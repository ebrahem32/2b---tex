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
  gluing: '2btex.gluing.v1',
  pricings: '2btex.pricings.v1',
  customerAccounts: '2btex.customerAccounts.v1',
  reportOutbox: '2btex.reportOutbox.v1',
  whatsappSettings: '2btex.whatsappSettings.v1',
  dyehousePriceLibrary: '2btex.dyehousePriceLibrary.v1',
  auditLog: '2btex.auditLog.v1',
  whatsappStatus: '2btex.whatsappStatus.v1',
};
const APP_VERSION = 'v2026.06.13.16';
const APP_BUILD_TIME = '2026-06-13 08:25';
// LEGACY_ARABIC_MARKER: بقايا كتل قديمة تالفة داخل app.js.
// المسارات المستخدمة فعليًا تم تجاوزها بدوال عربية سليمة في نهاية الملف، وهذه العلامة تبقى ظاهرة في البحث حتى لا نخفي مواضع التنظيف المتبقية.
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
const safeSetLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn('local-storage-write-skipped', key, error);
    return false;
  }
};
const save = () => {
  ensureRuntimeCollections();
  safeSetLocalStorage(STORAGE_KEYS.customerAccounts, JSON.stringify(customerAccounts));
  safeSetLocalStorage(STORAGE_KEYS.reportOutbox, JSON.stringify(reportOutbox));
  safeSetLocalStorage(STORAGE_KEYS.whatsappSettings, JSON.stringify(whatsappSettings));
  safeSetLocalStorage(STORAGE_KEYS.auditLog, JSON.stringify(auditLog));
  safeSetLocalStorage(STORAGE_KEYS.whatsappStatus, JSON.stringify(whatsappStatus));
};
const OPERATIONAL_STORAGE_KEYS = [
  STORAGE_KEYS.orders,
  STORAGE_KEYS.allocations,
  STORAGE_KEYS.raw,
  STORAGE_KEYS.dye,
  STORAGE_KEYS.finished,
  STORAGE_KEYS.production,
  STORAGE_KEYS.customer,
  STORAGE_KEYS.accessory,
  STORAGE_KEYS.transfers,
  STORAGE_KEYS.rawReturns,
  STORAGE_KEYS.gluing,
  STORAGE_KEYS.pricings,
];
function clearOperationalLocalStorageCache() {
  try { OPERATIONAL_STORAGE_KEYS.forEach((key)=>localStorage.removeItem(key)); } catch {}
}
clearOperationalLocalStorageCache();

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
  gluing: [],
  pricings: [],
  customerAccounts: {},
  reportOutbox: [],
  whatsappSettings: { weavingGroupName: '2B - النسيج', dyeingGroupName: '2B - المصبغة', dyehousesReportGroupName: 'اوردارات 2B', dyehouseGroups: {}, weavingGroups: {}, customerGroups: {}, sendingEnabled: false },
  auditLog: [],
  whatsappStatus: { status: 'disconnected', updatedAt: '', errorMessage: '', qrDataUrl: '' },
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
let gluingBatches = clone(defaults.gluing);
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
let whatsappSettingsRefreshTimer = null;
if (!Array.isArray(reportOutbox)) reportOutbox = clone(defaults.reportOutbox);
if (!Array.isArray(auditLog)) auditLog = clone(defaults.auditLog);
if (!Array.isArray(customerBatches)) customerBatches = clone(defaults.customer);
if (!Array.isArray(dyehouseTransfers)) dyehouseTransfers = clone(defaults.transfers);
if (!Array.isArray(rawReturns)) rawReturns = clone(defaults.rawReturns);
if (!Array.isArray(gluingBatches)) gluingBatches = clone(defaults.gluing);
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
  gluingBatches = gluingBatches.filter((batch)=>!legacyIdSet.has(batch.orderId) && !legacyAllocationIds.has(batch.allocationId));
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
  if (!Array.isArray(gluingBatches)) gluingBatches = clone(defaults.gluing);
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
if ([rawBatches, rawReturns, gluingBatches, dyeBatches, productionBatches, finishedBatches, customerBatches, accessoryBatches, dyehouseTransfers].some(ensureRecordIds) || repairTransferredAllocationDyehouses()) save();
const saveData = save;
let selectedOrderId = null;
let editingOrderId = null;
let editingPricingId = null;
let currentDocumentType = null;
let pendingConvertedPricingId = null;
let pendingPricingOrderId = null;
let initialLocalStorageSnapshot = null;
let orderFocusMode = false;
let aiFocusMode = false;
let dashboardFocusMode = false;
const orderDetailTabsByOrder = {};
let syncOrderFocusMode;
let decorateOrderFocusHeader;
let closeOrderFocusMode;
let openOrderFocusMode;
let syncAiFocusMode;
let syncDashboardFocusMode;
let decorateDashboardFocusHeader;
let closeDashboardFocusMode;
let openDashboardFocusMode;
let decorateAiFocusHeader;
let closeAiFocusMode;
let openAiFocusMode;
let openMainWorkspace;
let closeOpenErpMenus;
let closeSidebar;
let toggleSidebar;
let setActiveSidebarButton;
let setWorkspaceModule;
let normalizeReportAction;
let applyStageShortcut;
let handleNavMenuAction;
let buildAiSummaryStats;
let collectAiReportPayload;
let formatAiItem;
let renderAiAnalysis;
let buildLocalAiEmployeeResponse;
let requestAiEmployee;
let analyzeReportWithAi;
let askAiEmployee;
let copyAiWhatsappMessage;
let installAiUiHandlers;
let renderOperationalAiDashboard;
let buildTodayOrders;
let renderTodayOrdersPanel;
let installTodayOrdersUiHandlers;
let renderDocuments;
let openDyeingDocumentForDyehouse;
let openDocument;
let safeOpenDocument;
let printCurrentDocument;
let currentReportTypeFromDocument;
let currentShareReportPayload;
let shareCurrentReportPdf;
let shareCurrentReportPngManual;
let installDocumentsUiHandlers;
let buildCompactFullReportDocument;
let buildDyeingOrderDocument;
let buildDyeingSummaryDocument;
let buildLabSamplesDocument;
let buildQuotationDocument;
let buildStickersDocument;
let buildWasteReportDocument;
let buildWeavingOrderDocument;
let openManagementReportsMenu;
let showManagementReport;
let openManagementReport;
let activeOrderFilterSummary;
let openOrdersReport;
let openFilteredOrdersReport;
let openDyehouseBalancesReport;
let stockFlowText;
let accessoryBalancePartsForOrder;
let stockFlowCell;
let ordersListHeadingForCurrentFilter;
let updateOrdersListHeading;
let renderOrders;
let hasActiveOrderFilter;
let syncFilteredListMode;
let auditActionLabel;
let auditEntityLabel;
let normalizeAuditItem;
let cleanAuditNote;
let fetchAuditLogRows;
let renderAuditLogRows;
let openAuditLogDialog;
let fetchSystemUsers;
let systemUserRoleLabel;
let currentUserRole;
let canManageUsers;
let canDeleteRecords;
let canWriteRecords;
let applyPermissionVisibility;
let openUsersDialog;
let openSystemUserForm;
let systemUserFormPayload;
let saveSystemUser;
let deleteSystemUser;
let dyehousePriceRows;
let dyehousePriceRowHtml;
let dyehousePriceSummaryHtml;
let renderDyehousePricesDialog;
let readWidthLinesFromEditor;
let widthLineRowHtml;
let renderWidthLinesEditor;
let accessoryLineRowHtml;
let renderAccessoryLinesEditor;
let readAccessoryLinesFromEditor;
let syncWidthModeUi;
let groupedOrderRowHtml;
let groupedOrderPrimaryItem;
let syncGroupedOrderPrimaryRow;
let syncGroupedOrderUi;
let resetGroupedOrderRows;
let readGroupedOrderItems;
let installGroupedOrderUi;
let applyPricingDyehouseOptions;
let applyPricingMaterialOptions;
let applyPricingColorOptions;
let updateSuggestedDyeCost;
let renderPricings;
let updatePricingPreview;
let fillPricingForm;
let editPricing;
let nextOrderPricingNumber;
let pricingDraftFromOrder;
let openPricingForOrder;

const refs = Object.fromEntries([
  'statsGrid','pricingTableBody','ordersTableBody','searchInput','customerFilter','dyehouseFilter','fabricFilter','orderStatusFilter','printFilteredOrdersBtn','orderDetailsPanel','documentsPanel','todayOrdersPanel','analyzeReportBtn','operationalAiDashboard','aiQuestionInput','askAiBtn','aiStatusText','aiAnalysisDialog','aiAnalysisBody','closeAiAnalysisBtn','copyAiWhatsappBtn','openPricingFormBtn','openDocumentReviewBtn','openOrderFormBtn','openOrdersReportBtn','openDyehouseBalancesReportBtn','openManagementReportsBtn','closePricingFormBtn','pricingDialog','pricingForm','pricingNumber','pricingProductCode','pricingCustomer','pricingDate','pricingFabricType','pricingMaterialType','pricingDyehouse','pricingColorClass','pricingQuantity','pricingInchWidth','pricingFinishedWeight','pricingRawCost','pricingDyeCost','pricingSuggestedDyeCost','pricingWastePercent','pricingExtraCost','pricingProfitPerKg','pricingPaymentMode','pricingPaymentDetails','pricingPaymentTerms','pricingNotes','pricingWasteCostPreview','pricingCostPreview','pricingSellPreview','pricingTotalPreview','closeOrderFormBtn','orderDialog','orderForm','orderNumber','productCode','customer','orderDate','fabricType','totalRawQuantity','expectedWastePercent','widthMode','inchWidth','widthLinesBox','widthLinesEditor','addWidthLineBtn','kiloPrice','paymentMode','paymentDetails','paymentTerms','accessoryType','accessoryPercent','accessoryLinesEditor','addAccessoryLineBtn','dyehouse','weavingSource','orderNotes','weavingSlipDialog','weavingSlipForm','weavingSlipFile','weavingSlipPreview','weavingSlipType','weavingSlipOrderNumber','weavingSlipDate','weavingSlipAllocation','weavingSlipWidthLine','weavingSlipQuantity','weavingSlipSupplier','weavingSlipNoteNumber','reviewMatchNoteBtn','reviewMatchStatus','weavingSlipNotes','closeWeavingSlipBtn','documentDialog','documentTitle','documentBody','closeDocumentBtn','printDocumentBtn','shareWhatsAppBtn','deletePricingBtn'
].map((id) => [id, document.getElementById(id)]));
refs.orderNotes?.closest('label')?.querySelector('span') && (refs.orderNotes.closest('label').querySelector('span').textContent = 'ملاحظات تشغيل');

function composePaymentTerms(modeValue, detailsValue) {
  const mode = String(modeValue || 'كاش').trim() || 'كاش';
  const details = String(detailsValue || '').trim();
  return details ? `${mode} - ${details}` : mode;
}
function parsePaymentTerms(value) {
  const text = String(value || '').trim();
  if (!text) return { mode:'كاش', details:'' };
  const [mode, ...rest] = text.split(' - ');
  return { mode: mode || 'كاش', details: rest.join(' - ') };
}
function setPaymentFields(modeRef, detailsRef, hiddenRef, paymentTerms) {
  const parsed = parsePaymentTerms(paymentTerms);
  if (modeRef) modeRef.value = [...modeRef.options].some((option)=>option.value === parsed.mode) ? parsed.mode : 'كاش';
  if (detailsRef) detailsRef.value = parsed.details || '';
  if (hiddenRef) hiddenRef.value = composePaymentTerms(modeRef?.value, detailsRef?.value);
}

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

const WHATSAPP_SERVICE_URL = '/whatsapp';
const AI_SERVICE_URL = '';
const A5_SERVICE_URL = 'http://127.0.0.1:3041';
const backendClient = window.createBackendClient({ baseUrl: '/api' });
let backendAvailable = false;
let backendDataLoading = false;
let currentUser = null;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function backendRequest(path, options = {}) {
  return backendClient.request(path, options);
}

async function loadCurrentUser() {
  try {
    const data = await backendRequest('/auth/me', { cache:'no-store' });
    currentUser = data.user || null;
  } catch {
    currentUser = null;
  }
}

async function logoutCurrentUser() {
  try {
    await backendRequest('/auth/logout', { method:'POST', body:JSON.stringify({}) });
  } finally {
    window.location.href = '/login.html';
  }
}

const dbDate = (row) => row.batch_date || row.transfer_date || row.order_date || row.pricing_date || row.created_at || '';
const customerLookupName = (customers, id) => customers.find((item)=>item.id===id)?.name || '';
function customerNameFromId(id) {
  const raw = String(id || '').trim();
  if (!raw.startsWith('customer-')) return '';
  const body = raw.slice('customer-'.length).trim();
  if (!body || /^-+$/.test(body)) return '';
  if (/^[0-9a-f]+$/i.test(body) && body.length % 2 === 0) {
    try {
      const decoded = decodeURIComponent(body.match(/.{1,2}/g).map((part)=>`%${part}`).join('')).trim();
      if (decoded && decoded !== body) return decoded;
    } catch {}
  }
  return body.replace(/-+/g, ' ').trim();
}
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
function parseDbJsonObject(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
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
    customer: customerLookupName(customers, row.customer_id) || row.customer || customerNameFromId(row.customer_id),
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
    operationNotes: parseDbJsonObject(row.operation_notes_json),
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
    sourceDocument: parseDbJsonObject(row.source_document_json),
    finishedWidth: row.finished_width || '',
    finishedWeight: row.finished_weight || '',
    accessoryType: row.accessory_type || '',
    movement: row.movement || '',
    partnerFabric: row.partner_fabric || '',
    outputName: row.output_name || '',
    customerName: row.customer_name || '',
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
    customer: customerLookupName(customers, row.customer_id) || row.customer || customerNameFromId(row.customer_id),
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
  gluingBatches = clone(defaults.gluing);
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
    const wasUnavailable = !backendAvailable;
    const health = await backendRequest('/health', { cache: 'no-store' });
    const schemaOk = health?.schema?.ok !== false;
    backendAvailable = schemaOk;
    updateBackendStatusBadge(schemaOk ? 'قاعدة البيانات متصلة' : 'قاعدة البيانات متصلة لكن تحتاج ترقية');
    if (schemaOk && wasUnavailable && !backendDataLoading && !orders.length) {
      await loadBackendData({ retries: 2, silentFailure: true });
    }
  } catch (error) {
    backendAvailable = false;
    updateBackendStatusBadge('قاعدة البيانات غير متاحة');
  }
}
async function loadBackendData(options = {}) {
  if (backendDataLoading) return;
  const retries = Number.isFinite(options.retries) ? Number(options.retries) : 6;
  const silentFailure = !!options.silentFailure;
  backendDataLoading = true;
  try {
    let data = null;
    let lastError = null;
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        data = await backendRequest('/bootstrap', { cache: 'no-store' });
        lastError = null;
        break;
      } catch (error) {
        lastError = error;
        if (attempt < retries) await wait(800);
      }
    }
    if (!data) throw lastError || new Error('تعذر تحميل بيانات قاعدة البيانات');
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
    gluingBatches = (data.gluingBatches || []).map(mapDbBatch);
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
      applyPricingMaterialOptions();
      applyPricingDyehouseOptions();
      updateSuggestedDyeCost();
    }
    const health = await backendRequest('/health', { cache: 'no-store' });
    const schemaOk = health?.schema?.ok !== false;
    backendAvailable = schemaOk;
    updateBackendStatusBadge(schemaOk ? 'قاعدة البيانات متصلة' : 'قاعدة البيانات متصلة لكن تحتاج ترقية');
    if (!schemaOk) {
      renderBackendUnavailable();
      return;
    }
    save();
    renderAll();
  } catch (error) {
    backendAvailable = false;
    updateBackendStatusBadge('قاعدة البيانات غير متاحة');
    console.warn('Backend unavailable; operational LocalStorage fallback is disabled', error);
    if (!silentFailure) renderBackendUnavailable();
  } finally {
    backendDataLoading = false;
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
  operation_notes_json: JSON.stringify(order.operationNotes && typeof order.operationNotes === 'object' && !Array.isArray(order.operationNotes) ? order.operationNotes : {}),
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
  source_document_json: JSON.stringify(batch.sourceDocument || null),
  finished_width: batch.finishedWidth || null,
  finished_weight: batch.finishedWeight || null,
  accessory_type: batch.accessoryType || null,
  movement: batch.movement || null,
  partner_fabric: batch.partnerFabric || null,
  output_name: batch.outputName || null,
  customer_name: batch.customerName || null,
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
  const saved = await postBackend('/customers', { id, name: cleanName, notes: 'مضاف من الواجهة' });
  return saved?.id || id;
}
async function postBackend(path, payload) {
  if (!backendAvailable) return null;
  try { return await backendRequest(path, { method: 'POST', body: JSON.stringify(payload) }); }
  catch (error) { backendAvailable = false; console.warn('Backend write failed, kept LocalStorage copy', error); return null; }
}
async function postBackendStrict(path, payload) {
  if (!backendAvailable) throw new Error('قاعدة البيانات غير متصلة الآن.');
  return backendRequest(path, { method: 'POST', body: JSON.stringify(payload) });
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
    const health = await backendRequest('/health', { cache: 'no-store' });
    const schemaOk = health?.schema?.ok !== false;
    backendAvailable = schemaOk;
    updateBackendStatusBadge(schemaOk ? 'قاعدة البيانات متصلة' : 'قاعدة البيانات متصلة لكن تحتاج ترقية');
    if (!schemaOk) {
      alert('قاعدة البيانات متصلة لكن هيكلها غير مكتمل. لم يتم اعتماد التعديل حتى تتم الترقية.');
      return false;
    }
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
    : type === 'gluing' ? 'gluing'
    : type === 'accessory' ? 'accessory'
    : type === 'customer' ? 'customer'
    : type === 'raw' ? 'dyehouse'
    : type === 'dye' ? 'dyehouse'
    : type;
}
function backendSnapshotCollection(snapshot, type) {
  const key = backendBatchType(type);
  if (key === 'dyehouse') return snapshot.dyehouseDeliveryBatches || [];
  if (key === 'finished') return snapshot.finishedReceivingBatches || [];
  if (key === 'customer') return snapshot.customerDeliveryBatches || [];
  if (key === 'accessory') return snapshot.accessoryBatches || [];
  if (key === 'raw-return') return snapshot.rawReturns || [];
  if (key === 'gluing') return snapshot.gluingBatches || [];
  if (key === 'transfer') return snapshot.dyehouseTransfers || [];
  if (key === 'allocation') return snapshot.allocations || [];
  if (key === 'pricing') return snapshot.pricings || [];
  if (key === 'order') return snapshot.orders || [];
  return [];
}
async function backendSnapshot() {
  return backendRequest('/bootstrap', { cache:'no-store' });
}
async function rollbackAfterBackendWriteFailure(message) {
  alert(message || 'تعذر تثبيت التعديل في قاعدة البيانات. سيتم الرجوع لآخر بيانات محفوظة.');
  await loadBackendData();
}
async function verifyRecordPersisted(type, id, predicate = null) {
  if (!id) return false;
  const snapshot = await backendSnapshot();
  const row = backendSnapshotCollection(snapshot, type).find((item)=>item.id === id);
  if (!row) return false;
  return typeof predicate === 'function' ? !!predicate(row, snapshot) : true;
}
async function verifyRecordDeleted(type, id) {
  if (!id) return false;
  const snapshot = await backendSnapshot();
  return !backendSnapshotCollection(snapshot, type).some((item)=>item.id === id);
}
async function verifyPricingPersisted(pricingId, expected = {}) {
  return verifyRecordPersisted('pricing', pricingId, (row)=>(
    String(row.pricing_number || '') === String(expected.pricingNumber || row.pricing_number || '')
    && String(row.fabric_type || '') === String(expected.fabricType || row.fabric_type || '')
  ));
}
async function verifyOrderPersisted(orderId, expected = {}) {
  if (!orderId) return false;
  const row = await backendRequest(`/orders/${orderId}`, { cache:'no-store' });
  const savedLines = parseDbJsonArray(row.accessory_lines_json);
  const expectedLines = Array.isArray(expected.accessoryLines) ? expected.accessoryLines : [];
  if (expectedLines.length && !savedLines.length) return false;
  if (expectedLines.length) {
    const expectedSignature = JSON.stringify(expectedLines.map((line)=>({
      type:String(line.type || ''),
      percent:Number(line.percent || 0),
      quantityManual:line.quantityManual === '' || line.quantityManual === null || line.quantityManual === undefined ? '' : Number(line.quantityManual || 0),
    })));
    const savedSignature = JSON.stringify(savedLines.map((line)=>({
      type:String(line.type || ''),
      percent:Number(line.percent || 0),
      quantityManual:line.quantityManual === '' || line.quantityManual === null || line.quantityManual === undefined ? '' : Number(line.quantityManual || 0),
    })));
    if (expectedSignature !== savedSignature) return false;
  }
  if (Number(expected.accessoryPercent || 0) !== Number(row.accessory_percent || 0)) return false;
  if (String(expected.accessoryType || '') !== String(row.accessory_type || '')) return false;
  return true;
}
async function verifyAllocationPersisted(allocationId, expected = {}) {
  return verifyRecordPersisted('allocation', allocationId, (row)=>(
    String(row.color || row.pantone_code || '') === String(expected.color || expected.pantoneCode || row.color || row.pantone_code || '')
  ));
}
async function verifyBatchPersisted(type, batchId, expected = {}) {
  return verifyRecordPersisted(type, batchId, (row)=>(
    Number(row.quantity || 0) === Number(expected.quantity || row.quantity || 0)
  ));
}
async function verifyTransferPersisted(transferId, expected = {}) {
  return verifyRecordPersisted('transfer', transferId, (row)=>(
    String(row.to_dyehouse || '') === String(expected.toDyehouse || expected.to_dyehouse || row.to_dyehouse || '')
  ));
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
  return isNaN(date.getTime()) ? '-' : date.toLocaleString('en-US', { dateStyle:'short', timeStyle:'short' });
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
  // سجل التعديلات الرسمي أصبح في جدول audit_log داخل قاعدة البيانات.
  return true;
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
function knownCustomerNames() {
  return uniqueNonEmpty([
    ...orders.map((order)=>order.customer),
    ...pricings.map((pricing)=>pricing.customer),
    ...customerBatches.map((batch)=>batch.customer),
  ]).sort((a,b)=>String(a).localeCompare(String(b), 'ar'));
}
function knownDyehouseNames() {
  return uniqueNonEmpty([
    ...orders.map((order)=>order.dyehouse),
    ...allocations.map((allocation)=>allocation.dyehouse),
    ...dyeBatches.map((batch)=>batch.dyehouse),
    ...dyehouseTransfers.flatMap((transfer)=>[transfer.fromDyehouse, transfer.toDyehouse]),
  ]).sort((a,b)=>String(a).localeCompare(String(b), 'ar'));
}
function knownWeavingNames() {
  return uniqueNonEmpty([
    ...orders.map((order)=>order.weavingSource),
    ...rawBatches.map((batch)=>batch.supplier),
  ]).sort((a,b)=>String(a).localeCompare(String(b), 'ar'));
}
function normalizeA5CustomerName(value) {
  return normalizeForCompare(value)
    .replace(/[\u0625\u0623\u0622]/g, '\u0627')
    .replace(/\u0649/g, '\u064a')
    .replace(/\u0629/g, '\u0647')
    .replace(/[\s\-_.?,()\[\]{}]/g, '');
}
function a5CustomerDisplayName(customer) {
  if (!customer) return '';
  return String(customer.customerName || customer.name || customer.accountName || customer.account_name || customer.customer_name || '').trim();
}
function findA5CustomerForSystemName(systemName, a5Customers = []) {
  const wanted = normalizeA5CustomerName(systemName);
  if (!wanted) return null;
  return a5Customers.find((customer)=>normalizeA5CustomerName(a5CustomerDisplayName(customer)) === wanted)
    || a5Customers.find((customer)=>{
      const name = normalizeA5CustomerName(a5CustomerDisplayName(customer));
      return name && (name.includes(wanted) || wanted.includes(name));
    })
    || null;
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
function whatsappConnectionStatusText() {
  return { connected:'متصل', waiting_for_qr:'بانتظار ربط واتساب', disconnected:'غير متصل' }[whatsappStatus?.status] || whatsappStatus?.status || 'غير متصل';
}
function whatsappConnectionPanelHtml() {
  const statusText = whatsappConnectionStatusText();
  const qrHtml = whatsappStatus?.qrDataUrl
    ? `<div class="notice"><strong>امسح كود واتساب من الموبايل</strong><br><span class="muted">لو ظهر تعذر ربط الجهاز، امسح الكود الحالي فقط لأن الكود يتحدث تلقائيًا.</span><br><img data-whatsapp-qr src="${escapeHtml(whatsappStatus.qrDataUrl)}" alt="WhatsApp QR" style="width:220px;max-width:100%;margin-top:10px;border:1px solid #d8dee9;border-radius:8px;background:#fff;padding:8px"></div>`
    : '';
  return `<div class="notice ${whatsappStatus?.status === 'connected' ? 'success' : 'warning'}"><strong>حالة واتساب:</strong> ${escapeHtml(statusText)}${whatsappStatus?.errorMessage ? ` - ${escapeHtml(whatsappStatus.errorMessage)}` : ''}</div>${qrHtml}`;
}
function stopWhatsappSettingsAutoRefresh() {
  if (whatsappSettingsRefreshTimer) clearInterval(whatsappSettingsRefreshTimer);
  whatsappSettingsRefreshTimer = null;
}
function updateWhatsappSettingsConnectionPanel() {
  const panel = refs.documentBody?.querySelector('[data-whatsapp-connection-panel]');
  if (panel) panel.innerHTML = whatsappConnectionPanelHtml();
}
function startWhatsappSettingsAutoRefresh() {
  stopWhatsappSettingsAutoRefresh();
  whatsappSettingsRefreshTimer = setInterval(async () => {
    if (!refs.documentDialog?.open || refs.documentBody?.dataset.documentType !== 'whatsapp-settings') {
      stopWhatsappSettingsAutoRefresh();
      return;
    }
    try {
      const response = await fetch(`${WHATSAPP_SERVICE_URL}/api/status`, { cache:'no-store' });
      if (!response.ok) throw new Error('service-offline');
      const data = await response.json();
      whatsappStatus = data.whatsapp || { status:'disconnected', updatedAt:nowIso(), errorMessage:'' };
      save();
      updateWhatsappStatusBadge();
      updateWhatsappSettingsConnectionPanel();
    } catch {
      whatsappStatus = { status:'disconnected', updatedAt:nowIso(), errorMessage:'خدمة واتساب غير متصلة حاليًا' };
      updateWhatsappStatusBadge();
      updateWhatsappSettingsConnectionPanel();
    }
  }, 5000);
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
function whatsappSettingsRows(map = {}, names = []) {
  const rows = [];
  const seen = new Set();
  Object.entries(map || {}).forEach(([name, group]) => {
    const cleanName = String(name || '').trim();
    if (!cleanName) return;
    seen.add(normalizeForCompare(cleanName));
    rows.push([cleanName, String(group || '').trim()]);
  });
  (names || []).forEach((name) => {
    const cleanName = String(name || '').trim();
    const key = normalizeForCompare(cleanName);
    if (!cleanName || seen.has(key)) return;
    seen.add(key);
    rows.push([cleanName, '']);
  });
  return rows.length ? rows : [['', '']];
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
    <div data-whatsapp-connection-panel>${whatsappConnectionPanelHtml()}</div>
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
  startWhatsappSettingsAutoRefresh();
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
  const text = String(value || '')
    .trim()
    .replace(/كسر بياض/g, 'كسترة')
    .replace(/أسود مخصوص/g, 'أسود خاص')
    .replace(/بني غامق/g, 'ألوان خاصة')
    .replace(/^خصوص$/g, 'ألوان خاصة')
    .replace(/^ألوان$/g, 'ألوان خاصة');
  return text;
}
const roundNumber = (value, digits = 2) => {
  const number = Number(value || 0);
  return Number(Math.round((number + Number.EPSILON) * 10 ** digits) / 10 ** digits);
};
const formatNumber = (value, digits = 3) => roundNumber(value, digits).toLocaleString('en-US', { maximumFractionDigits: digits });
const sum = (items) => roundNumber(items.reduce((total, item) => total + Number(item.quantity || 0), 0));

const pricingDomain = window.TwoBTexPricing.createPricingDomain({
  buildItemCode,
  clone,
  isLegacyRecoveredText,
  normalizeDyehousePriceLabel,
  roundNumber,
});
function sanitizeDyehousePriceLibrary(source = {}) {
  return pricingDomain.sanitizeDyehousePriceLibrary(source);
}
({
  dyehousePriceRows,
  dyehousePriceRowHtml,
  dyehousePriceSummaryHtml,
  renderDyehousePricesDialog,
} = window.createSettingsUi({
  refs,
  escapeHtml,
  activeDyehousePriceLibrary,
  isLegacyRecoveredText,
}));

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
  const summaries = knownAccountCustomers().map(customerAccountSummary);
  const totals = summaries.reduce((acc, item)=>{
    acc.opening += Number(item.openingBalance || 0);
    acc.invoices += Number(item.invoiceTotal || 0);
    acc.payments += Number(item.paymentTotal || 0);
    acc.balance += Number(item.balance || 0);
    return acc;
  }, { opening:0, invoices:0, payments:0, balance:0 });
  const rows = summaries.map((item)=>`<tr><td>${escapeHtml(item.customerName)}</td><td>${formatNumber(item.openingBalance)}</td><td>${formatNumber(item.invoiceTotal)}</td><td>${formatNumber(item.paymentTotal)}</td><td><strong>${formatNumber(item.balance)}</strong></td><td class="no-print"><button class="mini-btn" type="button" data-customer-ledger="${escapeHtml(item.customerName)}">عرض الحساب</button></td></tr>`).join('');
  refs.documentTitle.textContent = 'حسابات العملاء';
  refs.documentBody.dataset.documentType = 'customer-accounts';
  refs.documentBody.innerHTML = `<div class="document-sheet customer-account-sheet">
    <div class="customer-ledger-header">
      <div><p class="muted">نظام 2B Tex</p><h2>حسابات العملاء</h2><span>ملخص أرصدة العملاء داخل نظام المتابعة.</span></div>
    </div>
    <div class="customer-ledger-summary">
      <div><span>عدد العملاء</span><strong>${summaries.length}</strong></div>
      <div><span>رصيد افتتاحي</span><strong>${formatNumber(totals.opening)}</strong></div>
      <div><span>مبيعات / مستحقات</span><strong>${formatNumber(totals.invoices)}</strong></div>
      <div><span>مدفوعات</span><strong>${formatNumber(totals.payments)}</strong></div>
      <div class="emphasis"><span>إجمالي الرصيد</span><strong>${formatNumber(totals.balance)}</strong></div>
    </div>
    <p class="muted customer-ledger-note">الرصيد الحالي = الرصيد الافتتاحي + مستحقات الطلبات - المدفوعات. هذه القراءة داخل نظام المتابعة فقط ولا تعدل أرصدة A5.</p>
    <table class="customer-ledger-table"><thead><tr><th>العميل</th><th>رصيد افتتاحي</th><th>مبيعات / مستحقات</th><th>مدفوعات</th><th>الرصيد الحالي</th><th class="no-print">إجراء</th></tr></thead><tbody>${rows || '<tr><td colspan="6">لا توجد حسابات عملاء متاحة.</td></tr>'}</tbody></table>
  </div>`;
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
function renderCustomerLedgerDialog(customerName) {
  const summary = customerAccountSummary(customerName);
  const invoiceRows = summary.invoices.map((item)=>`<tr><td>${item.orderNumber || '-'}</td><td>${item.date || '-'}</td><td>${item.item || '-'}</td><td>${formatNumber(item.quantity)}</td><td>${formatNumber(item.unitPrice)}</td><td>${formatNumber(item.amount)}</td><td>${item.status}</td></tr>`).join('');
  const paymentRows = summary.payments.map((item)=>`<tr><td>${item.date || '-'}</td><td>${formatNumber(item.amount)}</td><td>${item.method || '-'}</td><td>${item.notes || '-'}</td><td class="no-print"><button class="mini-btn danger" type="button" data-delete-customer-payment="${item.id}" data-customer-name="${escapeHtml(summary.customerName)}">حذف</button></td></tr>`).join('');
  refs.documentTitle.textContent = `كشف حساب العميل ${summary.customerName}`;
  refs.documentBody.dataset.documentType = 'customer-ledger';
  refs.documentBody.innerHTML = `<div class="document-sheet customer-ledger-sheet">
    <div class="customer-ledger-header">
      <button class="mini-btn no-print" type="button" data-back-customer-accounts>رجوع</button>
      <div><p class="muted">كشف حساب عميل</p><h2>${escapeHtml(summary.customerName)}</h2><span>حركات العميل من فواتير الطلبات والمدفوعات المسجلة.</span></div>
    </div>
    <div class="customer-ledger-summary">
      <div><span>رصيد افتتاحي</span><strong>${formatNumber(summary.openingBalance)}</strong></div>
      <div><span>مبيعات / مستحقات</span><strong>${formatNumber(summary.invoiceTotal)}</strong></div>
      <div><span>مدفوعات</span><strong>${formatNumber(summary.paymentTotal)}</strong></div>
      <div class="emphasis"><span>الرصيد الحالي</span><strong>${formatNumber(summary.balance)}</strong></div>
    </div>
    <section class="report-section ledger-edit-section no-print">
      <h3>تعديل الرصيد الافتتاحي</h3>
      <div class="summary-grid"><label><span>الرصيد الافتتاحي</span><input type="number" step="0.01" data-opening-balance value="${summary.openingBalance}"></label><button class="primary-btn" type="button" data-save-opening-balance="${escapeHtml(summary.customerName)}">حفظ الرصيد</button></div>
    </section>
    <section class="report-section ledger-edit-section no-print">
      <h3>إضافة دفعة</h3>
      <div class="summary-grid"><input type="date" data-payment-date value="${new Date().toISOString().slice(0,10)}"><input type="number" step="0.01" data-payment-amount placeholder="المبلغ"><input data-payment-method placeholder="طريقة الدفع"><input data-payment-notes placeholder="ملاحظات"><button class="primary-btn" type="button" data-add-customer-payment="${escapeHtml(summary.customerName)}">إضافة دفعة</button></div>
    </section>
    <section class="report-section"><h3>فواتير الطلبات</h3><table class="customer-ledger-table"><thead><tr><th>رقم الطلب</th><th>التاريخ</th><th>البند</th><th>الكمية</th><th>سعر الوحدة</th><th>الإجمالي</th><th>الحالة</th></tr></thead><tbody>${invoiceRows || '<tr><td colspan="7">لا توجد فواتير مسجلة لهذا العميل.</td></tr>'}</tbody></table></section>
    <section class="report-section"><h3>المدفوعات</h3><table class="customer-ledger-table"><thead><tr><th>التاريخ</th><th>المبلغ</th><th>طريقة الدفع</th><th>ملاحظات</th><th class="no-print">إجراء</th></tr></thead><tbody>${paymentRows || '<tr><td colspan="5">لا توجد مدفوعات مسجلة لهذا العميل.</td></tr>'}</tbody></table></section>
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
  renderWhatsappSettingsDialog([]);
  try {
    await Promise.race([pollWhatsappService(), wait(3000)]);
  } catch {}
  let groupNames = [];
  try {
    groupNames = await Promise.race([fetchWhatsappGroupNames(), wait(3000).then(()=>[])]);
  } catch {
    groupNames = [];
  }
  renderWhatsappSettingsDialog(groupNames);
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
  return isNaN(date.getTime()) ? String(value) : date.toLocaleDateString('en-US');
}
async function renderA5AccountsDialog() {
  refs.documentTitle.textContent = '\u062d\u0633\u0627\u0628\u0627\u062a A5';
  refs.documentBody.dataset.documentType = 'a5-accounts';
  refs.documentBody.innerHTML = '<div class="document-sheet"><div class="subsection-head"><div><h2>\u062d\u0633\u0627\u0628\u0627\u062a A5</h2><p class="muted">\u0631\u0628\u0637 \u0639\u0645\u0644\u0627\u0621 \u0627\u0644\u0646\u0638\u0627\u0645 \u0628\u0643\u0634\u0648\u0641\u0627\u062a \u062d\u0633\u0627\u0628\u0627\u062a\u0647\u0645 \u0641\u064a A5.</p></div></div><p class="muted">\u062c\u0627\u0631\u064a \u062a\u062d\u0645\u064a\u0644 \u0628\u064a\u0627\u0646\u0627\u062a A5...</p></div>';
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
  try {
    const a5Customers = await fetchA5Customers();
    const systemCustomers = knownCustomerNames();
    const matchedRows = systemCustomers.map((systemName)=>{
      const a5Customer = findA5CustomerForSystemName(systemName, a5Customers);
      const tracking = trackingCustomerSummary(systemName);
      const balance = Number(a5Customer?.balance || 0);
      const balanceClass = balance > 0 ? 'danger-text' : (balance < 0 ? 'success-text' : '');
      const a5Name = a5CustomerDisplayName(a5Customer);
      const action = a5Customer
        ? '<button class="mini-btn" type="button" data-a5-ledger="' + escapeHtml(a5Name) + '">\u0639\u0631\u0636 \u0643\u0634\u0641 \u0627\u0644\u062d\u0633\u0627\u0628</button>'
        : '<span class="status pending">\u063a\u064a\u0631 \u0645\u0637\u0627\u0628\u0642 \u0641\u064a A5</span>';
      return '<tr>'
        + '<td><strong>' + escapeHtml(systemName || '-') + '</strong></td>'
        + '<td>' + escapeHtml(a5Name || '-') + '</td>'
        + '<td>' + escapeHtml(a5Customer?.areaName || '-') + '</td>'
        + '<td class="' + balanceClass + '"><strong>' + formatNumber(balance) + '</strong></td>'
        + '<td>' + formatNumber(a5Customer?.totalDebit || 0) + '</td>'
        + '<td>' + formatNumber(a5Customer?.totalCredit || 0) + '</td>'
        + '<td>' + (a5Customer?.movementCount || 0) + '</td>'
        + '<td>' + tracking.ordersCount + '</td>'
        + '<td>' + tracking.activeOrdersCount + '</td>'
        + '<td>' + formatNumber(tracking.deliveredQuantity) + '</td>'
        + '<td>' + (tracking.lastOrderNumber || '-') + '</td>'
        + '<td>' + action + '</td>'
        + '</tr>';
    }).join('');
    const unmatchedA5 = a5Customers.filter((customer)=>!systemCustomers.some((name)=>findA5CustomerForSystemName(name, [customer])));
    const unmatchedNote = unmatchedA5.length
      ? '<p class="eyebrow">\u064a\u0648\u062c\u062f ' + unmatchedA5.length + ' \u0639\u0645\u064a\u0644 \u0641\u064a A5 \u0644\u064a\u0633 \u0644\u0647\u0645 \u0637\u0644\u0628\u0627\u062a \u062d\u0627\u0644\u064a\u0629 \u0641\u064a \u0627\u0644\u0646\u0638\u0627\u0645.</p>'
      : '';
    refs.documentBody.innerHTML = '<div class="document-sheet">'
      + '<div class="subsection-head"><div><h2>\u0643\u0634\u0648\u0641\u0627\u062a \u062d\u0633\u0627\u0628\u0627\u062a A5</h2><p class="muted">\u0627\u0644\u0639\u0631\u0636 \u0645\u0628\u0646\u064a \u0639\u0644\u0649 \u0639\u0645\u0644\u0627\u0621 \u0627\u0644\u0646\u0638\u0627\u0645\u060c \u0648\u064a\u0633\u062d\u0628 \u0627\u0644\u0631\u0635\u064a\u062f \u0648\u0627\u0644\u0643\u0634\u0641 \u0645\u0646 A5 \u0644\u0644\u0642\u0631\u0627\u0621\u0629 \u0641\u0642\u0637.</p></div><button class="mini-btn no-print" type="button" data-refresh-a5-accounts>\u062a\u062d\u062f\u064a\u062b</button></div>'
      + unmatchedNote
      + '<table><thead><tr><th>\u0639\u0645\u064a\u0644 \u0627\u0644\u0646\u0638\u0627\u0645</th><th>\u0627\u0633\u0645\u0647 \u0641\u064a A5</th><th>\u0627\u0644\u0645\u0646\u0637\u0642\u0629</th><th>\u0631\u0635\u064a\u062f A5</th><th>\u0625\u062c\u0645\u0627\u0644\u064a \u0645\u062f\u064a\u0646</th><th>\u0625\u062c\u0645\u0627\u0644\u064a \u062f\u0627\u0626\u0646</th><th>\u0639\u062f\u062f \u0627\u0644\u062d\u0631\u0643\u0627\u062a</th><th>\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0646\u0638\u0627\u0645</th><th>\u062a\u062d\u062a \u0627\u0644\u062a\u0634\u063a\u064a\u0644</th><th>\u0643\u0645\u064a\u0629 \u0645\u0633\u0644\u0645\u0629</th><th>\u0622\u062e\u0631 \u0637\u0644\u0628</th><th>\u0627\u0644\u0643\u0634\u0641</th></tr></thead><tbody>'
      + (matchedRows || '<tr><td colspan="12">\u0644\u0627 \u064a\u0648\u062c\u062f \u0639\u0645\u0644\u0627\u0621 \u0645\u0633\u062c\u0644\u0648\u0646 \u0641\u064a \u0627\u0644\u0646\u0638\u0627\u0645.</td></tr>')
      + '</tbody></table></div>';
  } catch (error) {
    refs.documentBody.innerHTML = '<div class="document-sheet"><h2>\u062d\u0633\u0627\u0628\u0627\u062a A5</h2><div class="notice warning">\u062e\u062f\u0645\u0629 A5 \u063a\u064a\u0631 \u0645\u062a\u0627\u062d\u0629 \u062d\u0627\u0644\u064a\u0627. \u0634\u063a\u0644 \u0645\u0644\u0641 \"\u062a\u0634\u063a\u064a\u0644 \u062e\u062f\u0645\u0629 A5.bat\" \u062b\u0645 \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649.</div><div class="document-actions no-print"><button class="primary-btn" type="button" data-refresh-a5-accounts>\u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629</button></div></div>';
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
({
  auditActionLabel,
  auditEntityLabel,
  normalizeAuditItem,
  cleanAuditNote,
  fetchAuditLogRows,
  renderAuditLogRows,
  openAuditLogDialog,
} = window.createAuditUi({
  refs,
  escapeHtml,
  arDateTime,
  isLegacyRecoveredText,
  backendRequest,
}));

({
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
} = window.createUsersUi({
  refs,
  escapeHtml,
  arDateTime,
  backendRequest,
  getCurrentUser: () => currentUser,
  alert: (message) => alert(message),
  confirm: (message) => confirm(message),
}));

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
  refs.documentTitle.textContent = 'فحص النظام';
  refs.documentBody.dataset.documentType = 'system-status';
  refs.documentBody.innerHTML = '<div class="document-sheet"><h2>فحص النظام</h2><p>جاري قراءة حالة Railway وقاعدة البيانات...</p></div>';
  refs.documentDialog.showModal();
  try {
    const status = await backendRequest('/system/check', { cache: 'no-store' });
    const row = (item) => `<tr><td>${escapeHtml(item.label)}</td><td><span class="status ${item.ok ? 'completed' : 'failed'}">${item.ok ? 'سليم' : 'يحتاج مراجعة'}</span></td><td>${escapeHtml(item.detail || '-')}</td></tr>`;
    const tableRow = (label, value) => `<tr><td>${escapeHtml(label)}</td><td>${Number(value || 0).toLocaleString('en-US')}</td></tr>`;
    const stageRows = (status.orderStages || []).map((stage)=>`<tr><td>${escapeHtml(stage.label)}</td><td>${escapeHtml(stage.description)}</td></tr>`).join('');
    refs.documentBody.innerHTML = `<div class="document-sheet">
      <h2>فحص النظام</h2>
      <p class="muted">آخر فحص: ${escapeHtml(status.generatedAt || '-')}</p>
      <table>
        <thead><tr><th>البند</th><th>الحالة</th><th>التفاصيل</th></tr></thead>
        <tbody>${(status.checks || []).map(row).join('')}</tbody>
      </table>
      <h3>ملخص البيانات</h3>
      <table>
        <tbody>
          ${tableRow('الطلبات', status.tables?.orders)}
          ${tableRow('الألوان', status.tables?.allocations)}
          ${tableRow('استلام الخام', status.tables?.rawReceiving)}
          ${tableRow('إرسال المصبغة', status.tables?.dyehouseDelivery)}
          ${tableRow('استلام المجهز', status.tables?.finishedReceiving)}
          ${tableRow('تسليم العميل', status.tables?.customerDelivery)}
          ${tableRow('الإكسسوارات', status.tables?.accessories)}
          ${tableRow('سجل التعديلات', status.tables?.auditLog)}
        </tbody>
      </table>
      <h3>حالات الطلب المعتمدة</h3>
      <table>
        <thead><tr><th>الحالة</th><th>المعنى</th></tr></thead>
        <tbody>${stageRows}</tbody>
      </table>
      <h3>النسخ الاحتياطي</h3>
      <p><strong>آخر نسخة:</strong> ${escapeHtml(status.storage?.latestBackup?.name || 'لا توجد نسخة')}</p>
      <p><strong>عدد النسخ:</strong> ${Number(status.storage?.backupsCount || 0).toLocaleString('en-US')}</p>
      <p><strong>سياسة الاحتفاظ:</strong> حذف تلقائي بعد ${Number(status.storage?.retentionDays || 6).toLocaleString('en-US')} أيام</p>
      <p><strong>آخر تنظيف:</strong> ${escapeHtml(status.storage?.lastCleanup?.ranAt || '-')} - محذوف ${Number(status.storage?.lastCleanup?.deleted || 0).toLocaleString('en-US')} نسخة</p>
      <button class="mini-btn gold" type="button" data-create-backup>إنشاء نسخة احتياطية الآن</button>
    </div>`;
  } catch {
    refs.documentBody.innerHTML = '<div class="document-sheet"><h2>فحص النظام</h2><p>تعذر قراءة حالة النظام حاليًا.</p></div>';
  }
}
async function createBackupFromStatusDialog() {
  const button = refs.documentBody.querySelector('[data-create-backup]');
  if (button) { button.disabled = true; button.textContent = 'جاري إنشاء النسخة...'; }
  try {
    const result = await backendRequest('/backup', { method:'POST', body:JSON.stringify({}) });
    alert(result.ok ? 'تم إنشاء النسخة الاحتياطية.' : 'تعذر إنشاء النسخة الاحتياطية.');
    await openSystemStatusDialog();
  } catch (error) {
    alert(error.message || 'تعذر إنشاء النسخة الاحتياطية.');
    if (button) { button.disabled = false; button.textContent = 'إنشاء نسخة احتياطية الآن'; }
  }
}
function installAutomationUi() {
  const actionBar = document.querySelector('.hero-actions') || document.querySelector('header') || document.body;
  if (!document.getElementById('whatsappStatusBadge')) {
    const userName = currentUser?.name || currentUser?.username || 'مستخدم';
    actionBar.insertAdjacentHTML('beforeend', `<span class="mini-btn version-badge" id="appVersionBadge" title="وقت إصدار هذه النسخة">النسخة ${APP_VERSION} | ${APP_BUILD_TIME}</span><span class="mini-btn version-badge" id="currentUserBadge">المستخدم: ${escapeHtml(userName)}</span><button class="mini-btn" id="logoutBtn" type="button">خروج</button><button class="mini-btn connection-badge is-down" id="backendStatusBadge" type="button"><span class="connection-dot"></span><span data-connection-text>قاعدة البيانات: غير متصل</span></button><button class="mini-btn connection-badge is-down" id="whatsappStatusBadge" type="button"><span class="connection-dot"></span><span data-connection-text>واتساب: غير متصل</span></button><button class="mini-btn" id="systemStatusBtn" type="button">حالة النظام</button><button class="mini-btn" id="usersBtn" type="button">المستخدمين</button><button class="mini-btn" id="whatsappSettingsBtn" type="button">إعدادات واتساب</button><button class="mini-btn" id="dyehousePricesBtn" type="button">أسعار المصابغ</button><button class="mini-btn" id="a5AccountsBtn" type="button">حسابات A5</button><button class="mini-btn" id="outboxBtn" type="button">قائمة الإرسال</button><button class="mini-btn" id="auditLogBtn" type="button">سجل التعديلات</button>`);
  }
  if (!canManageUsers()) document.getElementById('usersBtn')?.remove();
  document.getElementById('backendStatusBadge')?.addEventListener('click', pollBackendStatus);
  document.getElementById('whatsappStatusBadge')?.addEventListener('click', pollWhatsappService);
  document.getElementById('logoutBtn')?.addEventListener('click', logoutCurrentUser);
  document.getElementById('systemStatusBtn')?.addEventListener('click', openSystemStatusDialog);
  document.getElementById('usersBtn')?.addEventListener('click', openUsersDialog);
  const whatsappSettingsButton = document.getElementById('whatsappSettingsBtn');
  if (whatsappSettingsButton) whatsappSettingsButton.onclick = (event) => {
    event.preventDefault();
    openWhatsappSettingsDialog().catch((error)=>{ console.error('whatsapp-settings-open-error', error); renderWhatsappSettingsDialog([]); });
  };
  document.getElementById('dyehousePricesBtn')?.addEventListener('click', renderDyehousePricesDialog);
  document.getElementById('a5AccountsBtn')?.addEventListener('click', renderA5AccountsDialog);
  document.getElementById('outboxBtn')?.addEventListener('click', openOutboxDialog);
  document.getElementById('auditLogBtn')?.addEventListener('click', ()=>openAuditLogDialog().catch(console.error));
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
    10000,
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

let customDyehousePriceLibrary = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.dyehousePriceLibrary));
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
})();
function mergeDyehousePriceLibrary() {
  return pricingDomain.mergeDyehousePriceLibrary(customDyehousePriceLibrary || {});
}
function saveDyehousePriceLibraryLocal() {
  safeSetLocalStorage(STORAGE_KEYS.dyehousePriceLibrary, JSON.stringify(customDyehousePriceLibrary || {}));
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
  return pricingDomain.getSuggestedDyeCost(activeDyehousePriceLibrary(), dyehouse, materialType, colorClass);
}
({
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
} = window.createFormsUi({
  refs,
  uid,
  escapeHtml,
  getEditingOrderId: () => editingOrderId,
}));

const statusLabel = (status) => ({ pending:'بانتظار الاستلام', 'in-progress':'قيد التشغيل', completed:'مكتمل', closed:'مغلق تشغيليًا' }[status]);
const orderDomain = window.TwoBTexOrders.createOrderDomain({
  buildItemCode,
  orderRawCost,
  roundNumber,
  sum,
  uid,
  getState: () => ({
    orders,
    allocations,
    rawBatches,
    productionBatches,
    customerBatches,
    accessoryBatches,
    dyehouseTransfers,
    rawReturns,
    gluingBatches,
  }),
});

function orderAccessoryConfig(order = {}) {
  return orderDomain.orderAccessoryConfig(order);
}

function normalizeOrderForRuntime(order = {}) {
  return orderDomain.normalizeOrderForRuntime(order);
}
function calculateAllocation(allocation = {}, orderContext = null) {
  return orderDomain.calculateAllocation(allocation, orderContext);
}
function expectedWasteFor(order, quantity) {
  return orderDomain.expectedWasteFor(order, quantity);
}
function allocationAccessoryQuantity(order, allocation) {
  return orderDomain.allocationAccessoryQuantity(order, allocation);
}
function calculateOrder(order) {
  return orderDomain.calculateOrder(order);
}
function calculatePricing(pricing) {
  return pricingDomain.calculatePricing(pricing || {}, activeDyehousePriceLibrary());
}
({
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
} = window.createPricingUi({
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
  getPricings: () => pricings,
  getOrders: () => orders,
  getSelectedOrderId: () => selectedOrderId,
  setEditingPricingId: (value) => { editingPricingId = value; },
  setPendingPricingOrderId: (value) => { pendingPricingOrderId = value; },
  showAlert: (message) => alert(message),
}));

function pricingPayload(id = uid()) {
  const paymentTerms = composePaymentTerms(refs.pricingPaymentMode?.value, refs.pricingPaymentDetails?.value);
  if (refs.pricingPaymentTerms) refs.pricingPaymentTerms.value = paymentTerms;
  return { id, pricingNumber:refs.pricingNumber.value, productCode:buildItemCode(refs.pricingNumber.value), customer:refs.pricingCustomer.value, pricingDate:refs.pricingDate.value, fabricType:refs.pricingFabricType.value, dyehouse:refs.pricingDyehouse.value, colorClass:refs.pricingColorClass.value, quantity:+refs.pricingQuantity.value, inchWidth:+refs.pricingInchWidth.value, finishedWeight:+refs.pricingFinishedWeight.value, materialType:refs.pricingMaterialType.value, rawCost:+refs.pricingRawCost.value, dyeCost:+refs.pricingDyeCost.value, wastePercent:+refs.pricingWastePercent.value, extraCost:+refs.pricingExtraCost.value, profitPerKg:+refs.pricingProfitPerKg.value, paymentTerms, notes:refs.pricingNotes.value };
}
async function attachPricingToOrder(orderId, pricingId) {
  const order = orders.find((item)=>item.id === orderId);
  if (!order || !pricingId) return true;
  const before = clone(order);
  const updatedOrder = { ...order, pricingId };
  const backendCustomer = await ensureBackendCustomer(updatedOrder.customer);
  const savedOrder = await putBackend(`/orders/${updatedOrder.id}`, orderToApi(updatedOrder, backendCustomer));
  if (!savedOrder) return false;
  if (!(await verifyOrderPersisted(updatedOrder.id, updatedOrder))) return false;
  recordAudit('update', 'order', updatedOrder.id, before, updatedOrder, `ربط الطلب رقم ${updatedOrder.orderNumber || ''} بالتسعيرة`);
  await persistAuditLog();
  return true;
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
      if (!(await verifyPricingPersisted(editingPricingId, updatedPricing))) {
        await rollbackAfterBackendWriteFailure('تم إرسال تعديل التسعيرة لكن لم يرجع من قاعدة Railway. لم يتم اعتماد التعديل.');
        return;
      }
      if (pendingPricingOrderId) {
        const linked = await attachPricingToOrder(pendingPricingOrderId, editingPricingId);
        if (!linked) {
          await rollbackAfterBackendWriteFailure('تم حفظ تعديل التسعيرة لكن تعذر ربطها بالطلب الحالي. راجع الاتصال ثم حاول من تفاصيل الطلب مرة أخرى.');
          return;
        }
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
    if (!(await verifyPricingPersisted(savedPricing.id || createdPricing.id, createdPricing))) {
      await rollbackAfterBackendWriteFailure('تم إرسال التسعيرة لكن لم ترجع من قاعدة Railway. لم يتم اعتماد التسعيرة.');
      return;
    }
    if (pendingPricingOrderId) {
      const linked = await attachPricingToOrder(pendingPricingOrderId, savedPricing.id || createdPricing.id);
      if (!linked) {
        await rollbackAfterBackendWriteFailure('تم حفظ التسعيرة لكن تعذر ربطها بالطلب الحالي. راجع الاتصال ثم حاول من تفاصيل الطلب مرة أخرى.');
        return;
      }
    }
    recordAudit('create', 'pricing', createdPricing.id, null, createdPricing, `إنشاء التسعيرة رقم ${createdPricing.pricingNumber || ''}`);
    await persistAuditLog();
  }
  await loadBackendData();
  pendingPricingOrderId = null;
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
  const money = (value) => Number(value || 0).toLocaleString('en-US');
  const customer = pricing.customer || pricing.customerName || pricing.clientName || '-';
  const notes = String(pricing.notes || '').trim();
  refs.documentTitle.textContent = 'عرض سعر';
  refs.documentBody.innerHTML = `<div class="document-sheet quotation-report two-b-report">
    ${documentHeader()}
    <div class="document-inline-actions no-print"><button class="mini-btn" data-convert-pricing="${escapeHtml(pricing.id)}">تنزيل طلب</button><button class="mini-btn" data-edit-pricing-doc="${escapeHtml(pricing.id)}">تعديل</button></div>
    <div class="report-title"><h2>عرض سعر <small># ${escapeHtml(pricing.pricingNumber || '-')}</small></h2><span>عرض مقدم للعميل حسب بيانات التسعير الحالية.</span></div>
    <div class="document-meta">
      <div><span>العميل</span>${escapeHtml(customer)}</div>
      <div><span>التاريخ</span>${escapeHtml(pricing.pricingDate || '-')}</div>
      <div><span>الصنف</span>${escapeHtml(pricing.fabricType || '-')}</div>
      <div><span>درجة اللون</span>${escapeHtml(pricing.colorClass || '-')}</div>
      <div><span>الكمية</span>${money(pricing.quantity)} كجم</div>
      <div><span>البوصة</span>${escapeHtml(pricing.inchWidth || '-')}</div>
      <div><span>الوزن المجهز</span>${escapeHtml(pricing.finishedWeight || '-')}</div>
      <div><span>طريقة السداد</span>${escapeHtml(pricing.paymentTerms || 'كاش')}</div>
    </div>
    <section class="report-section quotation-summary">
      <h3>ملخص العرض</h3>
      <div class="quotation-kpis">
        <div><span>سعر الكيلو</span><strong>${money(pricing.sellPrice)} جنيه</strong></div>
        <div class="quotation-total"><span>إجمالي العقد</span><strong>${money(pricing.totalOffer)} جنيه</strong></div>
      </div>
    </section>
    <section class="report-section">
      <h3>بنود العرض</h3>
      <table><thead><tr><th>الصنف</th><th>درجة اللون</th><th>الكمية</th><th>البوصة</th><th>سعر الكيلو</th><th>الإجمالي</th></tr></thead><tbody>
        <tr><td>${escapeHtml(pricing.fabricType || '-')}</td><td>${escapeHtml(pricing.colorClass || '-')}</td><td>${money(pricing.quantity)} كجم</td><td>${escapeHtml(pricing.inchWidth || '-')}</td><td>${money(pricing.sellPrice)} جنيه</td><td>${money(pricing.totalOffer)} جنيه</td></tr>
      </tbody></table>
    </section>
    <section class="report-section"><h3>ملاحظات</h3><p>${escapeHtml(notes || 'لا توجد ملاحظات إضافية.')}</p></section>
    ${documentFooter()}
  </div>`;
  refs.documentDialog.showModal();
}
function allOrders() { return orders.map(calculateOrder); }
function orderNoteNumbers(order) {
  const allocationIds = (order.allocations || []).map((allocation)=>allocation.id);
  return uniqueNonEmpty([
    ...rawBatches.filter((batch)=>batch.orderId===order.id).map((batch)=>batch.noteNumber),
    ...dyeBatches.filter((batch)=>batch.orderId===order.id || allocationIds.includes(batch.allocationId)).map((batch)=>batch.noteNumber),
    ...rawReturns.filter((batch)=>allocationIds.includes(batch.allocationId)).map((batch)=>batch.noteNumber),
    ...accessoryBatches.filter((batch)=>batch.orderId===order.id || allocationIds.includes(batch.allocationId)).map((batch)=>batch.noteNumber),
    ...productionBatches.filter((batch)=>allocationIds.includes(batch.allocationId)).map((batch)=>batch.noteNumber),
    ...customerBatches.filter((batch)=>allocationIds.includes(batch.allocationId)).map((batch)=>batch.noteNumber),
    ...dyehouseTransfers.filter((batch)=>batch.orderId===order.id || allocationIds.includes(batch.allocationId)).map((batch)=>batch.noteNumber),
  ].map(normalizeDigits));
}
function orderSearchText(order) {
  const noteNumbers = orderNoteNumbers(order);
  const noteAliases = noteNumbers.flatMap((note)=>[
    note,
    `اذن ${note}`,
    `إذن ${note}`,
    `اذن رقم ${note}`,
    `إذن رقم ${note}`,
    `رقم اذن ${note}`,
    `رقم إذن ${note}`,
  ]);
  return normalizeDigits([order.orderNumber, order.customer, order.dyehouse, order.weavingSource, order.fabricType, order.productCode, ...noteAliases].filter(Boolean).join(' ').toLowerCase());
}
function filteredOrders() {
  const query = normalizeDigits(refs.searchInput.value.trim().toLowerCase());
  const status = refs.orderStatusFilter.value === 'stage:delivery' ? 'stage:warehouse' : refs.orderStatusFilter.value;
  const customer = refs.customerFilter.value;
  const dyehouse = refs.dyehouseFilter.value;
  const fabric = refs.fabricFilter.value;
  return allOrders().filter((order) => {
    const stage = orderStageInfo(order);
    const statusMatch = status.startsWith('stage:')
      ? stage.key === status.slice('stage:'.length)
      : (status === 'closed' ? order.status === 'closed' : (status === 'all' ? order.status !== 'closed' : order.status === status));
    return orderSearchText(order).includes(query) && statusMatch && (customer === 'all' || order.customer === customer) && (dyehouse === 'all' || order.dyehouse === dyehouse) && (fabric === 'all' || order.fabricType === fabric);
  });
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
  const fmt = (value) => roundNumber(value).toLocaleString('en-US', { maximumFractionDigits: 3 });
  const values = [
    ['عدد الطلبات', list.length],
    ['خام مطلوب', list.reduce((t,o)=>t+o.totalRawOrdered,0)],
    ['خام مستلم', list.reduce((t,o)=>t+o.totalRawReceived,0)],
    ['مرسل للمصبغة', list.reduce((t,o)=>t+o.totalSentToDyehouse,0)],
    ['مجهز مستلم', list.reduce((t,o)=>t+o.totalFinishedReceived,0)],
    ['واقف بالمخزن', list.reduce((t,o)=>t+o.warehouseBalance,0)],
  ];
  refs.statsGrid.innerHTML = values.map(([label,value]) => `<article class="stat-card"><span>${label}</span><strong>${fmt(value)}</strong></article>`).join('');
}
function renderErpCockpit(list = []) {
  const panel = document.getElementById('erpCockpit');
  if (!panel) return;
  const fmt = (value) => roundNumber(value).toLocaleString('en-US', { maximumFractionDigits: 3 });
  const source = allOrders();
  const active = source.filter((order)=>!['completed','closed'].includes(order.status));
  const stageOf = (order) => orderStageInfo(order);
  const countWhere = (predicate) => source.filter(predicate).length;
  const sum = (items, selector) => roundNumber(items.reduce((total, item)=>total + Number(selector(item) || 0), 0));
  const lateOrders = source.map((order)=>({ order, stage:stageOf(order) }))
    .filter(({ order, stage })=>!['completed','closed'].includes(order.status) && Number(stage.days || 0) >= 7)
    .sort((a,b)=>Number(b.stage.days || 0) - Number(a.stage.days || 0));
  const wasteWatch = source.filter((order)=>Number(order.totalWastePercent || 0) > 0 && Number(order.totalWastePercent || 0) >= Math.max(8, Number(order.expectedWastePercent || 0) + 2));
  const priorityRows = [...lateOrders.map((item)=>item.order), ...wasteWatch]
    .filter((order, index, arr)=>arr.findIndex((item)=>item.id === order.id) === index)
    .slice(0, 5);
  const lanes = [
    { label:'النسيج', filter:'stage:weaving', count:countWhere((order)=>stageOf(order).key === 'weaving'), qty:sum(source, (order)=>Math.max(Number(order.totalRawOrdered || 0) - Number(order.totalRawReceived || 0), 0)), sub:'خام مطلوب لم يخرج بعد' },
    { label:'المصبغة', filter:'stage:dyehouse', count:countWhere((order)=>Number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse || 0) > 0), qty:sum(source, (order)=>Number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse || 0)), sub:'رصيد فعلي داخل المصبغة' },
    { label:'المخزن / جاهز للتسليم', filter:'stage:warehouse', count:countWhere((order)=>Number(order.warehouseBalance || 0) > 0), qty:sum(source, (order)=>order.warehouseBalance), sub:'مجهز موجود ومتاح للتسليم' },
  ];
  const cards = [
    ['طلبات مفتوحة', active.length, `${source.length} إجمالي الطلبات`],
    ['داخل المصبغة', fmt(sum(source, (order)=>Number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse || 0))), `${lanes[1].count} أوردر`],
    ['رصيد المخزن الجاهز', fmt(sum(source, (order)=>order.warehouseBalance)), `${lanes[2].count} أوردر`],
    ['أولوية متابعة', lateOrders.length + wasteWatch.length, 'وقوف طويل أو هالك مرتفع'],
  ];
  panel.innerHTML = `
    <div class="section-head stacked-on-mobile">
      <div><p class="eyebrow">ERP Command Center</p><h2>غرفة عمليات المصنع</h2><p class="orders-list-note">قراءة تنفيذية لحركة القماش من النسيج إلى المصبغة والمخزن والتسليم، مبنية على نفس بيانات التشغيل الحالية.</p></div>
      <div class="actions"><button class="mini-btn gold" type="button" data-nav-action="ordersList">فتح كل الطلبات</button><button class="mini-btn" type="button" data-nav-action="managementReports">التقارير</button></div>
    </div>
    <div class="erp-cockpit-cards">${cards.map(([label, value, sub])=>`<article><span>${label}</span><strong>${value}</strong><small>${sub}</small></article>`).join('')}</div>
    <div class="erp-pipeline">${lanes.map((lane, index)=>`<button type="button" data-stage-shortcut="${lane.filter}"><span>${index + 1}</span><strong>${lane.label}</strong><em>${fmt(lane.qty)} كجم</em><small>${lane.count} أوردر - ${lane.sub}</small></button>`).join('')}</div>
    <div class="erp-priority-board">
      <div><h3>أولويات المتابعة</h3><p class="eyebrow">الأقدم وقوفًا أو الأعلى هالكًا يظهر هنا أولًا.</p></div>
      <div class="erp-priority-list">${priorityRows.length ? priorityRows.map((order)=>{
        const stage = stageOf(order);
        return `<button type="button" data-view="${escapeHtml(order.id)}"><strong>${escapeHtml(order.orderNumber || '-')} - ${escapeHtml(order.customer || '-')}</strong><span>${escapeHtml(order.fabricType || '-')}</span><small>${escapeHtml(stage.label)} / ${Number(stage.days || 0)} يوم / هالك ${fmt(order.totalWastePercent || 0)}%</small></button>`;
      }).join('') : '<div class="empty-state">لا توجد أولويات حرجة حاليًا.</div>'}</div>
    </div>`;
}
({
  buildAiSummaryStats,
  collectAiReportPayload,
  formatAiItem,
  renderAiAnalysis,
  buildLocalAiEmployeeResponse,
  requestAiEmployee,
  analyzeReportWithAi,
  askAiEmployee,
  copyAiWhatsappMessage,
  renderOperationalAiDashboard,
  installAiUiHandlers,
} = window.createAiUi({
  refs,
  AI_SERVICE_URL,
  escapeHtml,
  roundNumber,
  sum,
  formatNumber,
  createOperationalAiManager: window.createOperationalAiManager,
  allOrders,
  orderStageInfo,
  calculateOrder,
  openOrderFocusMode: (orderId) => openOrderFocusMode?.(orderId),
  getOrders: () => orders,
  getAllocations: () => allocations,
  getRawBatches: () => rawBatches,
  getProductionBatches: () => productionBatches,
  getCustomerBatches: () => customerBatches,
  getAccessoryBatches: () => accessoryBatches,
  getRawReturns: () => rawReturns,
  getGluingBatches: () => gluingBatches,
  getDyehouseTransfers: () => dyehouseTransfers,
  getReportOutbox: () => reportOutbox,
}));

({
  buildTodayOrders,
  renderTodayOrdersPanel,
  installTodayOrdersUiHandlers,
} = window.createTodayOrdersUi({
  refs,
  escapeHtml,
  formatNumber,
  orderStageInfo,
  openOrderFocusMode: (orderId) => openOrderFocusMode?.(orderId),
  getCalculatedOrders: () => allOrders(),
}));

({
  ordersListHeadingForCurrentFilter,
  updateOrdersListHeading,
  renderOrders,
  hasActiveOrderFilter,
  syncFilteredListMode,
} = window.createOrdersUi({
  refs,
  filteredOrders,
  renderStats,
  renderErpCockpit,
  orderStageInfo,
  formatNumber,
  escapeHtml,
  canDeleteRecords,
  activeOrderFilterSummary: () => activeOrderFilterSummary(),
  getOrderFocusMode: () => orderFocusMode,
}));
function documentFooter() {
  const printedAt = new Date().toLocaleString('en-US', { dateStyle:'medium', timeStyle:'short' });
  return `<div class="document-footer"><span>${printedAt}</span><strong>Manager : Ibrahim Assem</strong></div>`;
}
function withDocumentFooter(body) {
  if (body.includes('sticker-sheet') || body.includes('document-footer')) return body;
  return `${body}${documentFooter()}`;
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
  const names = uniqueNonEmpty((order?.accessoryLines || []).map((line)=>accessoryLineName(line, order)));
  return names.length ? names.join(' + ') : '\u0625\u0643\u0633\u0633\u0648\u0627\u0631';
}
function isGenericAccessoryName(value) {
  const text = normalizeForCompare(value);
  return !text || text === normalizeForCompare('\u0625\u0643\u0633\u0633\u0648\u0627\u0631') || text === 'accessory';
}
function accessoryBatchTypesForOrder(order) {
  return uniqueNonEmpty(accessoryBatches
    .filter((batch)=>batch.orderId === order?.id)
    .map((batch)=>batch.accessoryType)
    .filter((type)=>!isGenericAccessoryName(type)));
}
function accessoryLineName(line, order) {
  const direct = String(line?.type || '').trim();
  if (!isGenericAccessoryName(direct)) return direct;
  const orderType = String(order?.accessoryType || '').trim();
  if (!isGenericAccessoryName(orderType)) return orderType;
  return accessoryBatchTypesForOrder(order)[0] || '\u0625\u0643\u0633\u0633\u0648\u0627\u0631';
}
function accessoryTypeMatches(batch, line, order) {
  const batchType = String(batch?.accessoryType || '').trim();
  const lineType = String(line?.type || '').trim();
  const lineName = accessoryLineName(line, order);
  return isGenericAccessoryName(batchType)
    || isGenericAccessoryName(lineType)
    || normalizeForCompare(batchType) === normalizeForCompare(lineType)
    || normalizeForCompare(batchType) === normalizeForCompare(lineName);
}
function accessoryPlannedQuantityForLine(order, allocation, line) {
  const allocations = Array.isArray(order?.allocations) ? order.allocations : [];
  const totalPlanned = allocations.reduce((total, item)=>total + Number(item.plannedQuantity || 0), 0) || Number(order?.totalRawQuantity || order?.totalRawOrdered || 0);
  const hasManual = line?.quantityManual !== '' && line?.quantityManual !== null && line?.quantityManual !== undefined;
  const baseQuantity = hasManual ? Number(line.quantityManual || 0) : Number(allocation?.plannedQuantity || 0) * Number(line?.percent || 0) / 100;
  const quantity = hasManual && totalPlanned ? baseQuantity * Number(allocation?.plannedQuantity || 0) / totalPlanned : baseQuantity;
  if (quantity) return roundNumber(quantity);
  const lines = Array.isArray(order?.accessoryLines) ? order.accessoryLines : [];
  if (lines.length === 1 && Number(allocation?.accessoryQuantity || 0)) return roundNumber(allocation.accessoryQuantity);
  return 0;
}
function accessoryPlannedPartsForOrder(order, allocation) {
  return (order?.accessoryLines || []).map((line) => {
    const quantity = accessoryPlannedQuantityForLine(order, allocation, line);
    return quantity ? `${formatNumber(quantity)} ${accessoryLineName(line, order)}` : '';
  }).filter(Boolean);
}
function accessoryFlowQuantityForLine(order, allocation, movement, line) {
  const direct = sum(accessoryBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement===movement && accessoryTypeMatches(batch, line, order)));
  if (direct || movement !== 'sent') return roundNumber(direct);
  const orderLevelSent = sum(accessoryBatches.filter((batch)=>batch.orderId===order.id && !batch.allocationId && batch.movement===movement && accessoryTypeMatches(batch, line, order)));
  if (!orderLevelSent) return 0;
  const currentPlanned = accessoryPlannedQuantityForLine(order, allocation, line);
  const totalPlanned = (order?.allocations || []).reduce((total, item)=>total + accessoryPlannedQuantityForLine(order, item, line), 0);
  return totalPlanned ? roundNumber(orderLevelSent * currentPlanned / totalPlanned) : 0;
}
function accessoryFlowPartsForOrder(order, allocation, movement) {
  return (order?.accessoryLines || []).map((line) => {
    const quantity = accessoryFlowQuantityForLine(order, allocation, movement, line);
    return quantity ? `${formatNumber(quantity)} ${accessoryLineName(line, order)}` : '';
  }).filter(Boolean);
}
({
  stockFlowText,
  accessoryBalancePartsForOrder,
  stockFlowCell,
} = window.createWarehouseUi({
  escapeHtml,
  formatNumber,
  roundNumber,
  accessoryFlowQuantityForLine,
  accessoryLineName,
}));
function reportOrderItemsCell(order) {
  const parts = [`قماش ${formatNumber(order?.totalRawOrdered || order?.totalRawQuantity || 0)} كجم`];
  (order?.accessoryLines || []).forEach((line) => {
    const quantity = Number(line.quantity || line.quantityManual || 0);
    if (quantity) parts.push(`${accessoryLineName(line, order)} ${formatNumber(quantity)} كجم`);
  });
  return parts.map((part, index)=>`<span class="report-flow-line ${index ? 'report-flow-accessory' : 'report-flow-body'}">${escapeHtml(part)}</span>`).join('');
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
  const isAccessory = ['accessory', 'accessoryReturn'].includes(form.elements.movementKind?.value);
  form.querySelectorAll('[data-accessory-only]').forEach((field) => field.classList.toggle('field-hidden', !isAccessory));
  form.querySelectorAll('[data-accessory-only] select, [data-accessory-only] input').forEach((field) => {
    field.disabled = !isAccessory;
    if (field.name === 'accessoryType') field.required = isAccessory;
  });
  const sourceOrder = orders.find((item)=>item.id === selectedOrderId);
  const order = sourceOrder ? calculateOrder(sourceOrder) : null;
  const allocationSelect = form.elements.allocationId;
  if (order && allocationSelect) {
    [...allocationSelect.options].forEach((option) => {
      const allocation = order.allocations.find((item)=>item.id === option.value);
      if (!allocation) return;
      option.textContent = isAccessory ? allocationOptionLabel(order, allocation) : customerDeliveryAllocationLabel(order, allocation);
    });
  }
}

function installBulkEntryButtons() {
  refs.orderDetailsPanel?.querySelectorAll('form.batch-form').forEach((form) => {
    if (!['production', 'customer', 'accessory', 'accessoryReceived'].includes(form.dataset.form)) return;
    if (form.querySelector('[data-open-bulk-entry]')) return;
    form.insertAdjacentHTML('afterbegin', '<button class="mini-btn gold full" type="button" data-open-bulk-entry>إدخال جماعي للألوان</button>');
  });
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
    [...customerForm.elements.movementKind.options].forEach((option) => {
      if (option.value === 'cloth') option.textContent = 'تسليم قماش';
      if (option.value === 'clothReturn') option.textContent = 'مرتجع قماش من العميل';
      if (option.value === 'accessory') option.textContent = 'تسليم إكسسوار';
      if (option.value === 'accessoryReturn') option.textContent = 'مرتجع إكسسوار من العميل';
    });
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

function operationFollowRows() {
  return allOrders()
    .map((order) => ({ order, stage:orderStageInfo(order) }))
    .filter(({ stage }) => !['completed', 'closed'].includes(stage.key))
    .sort((left, right) => Number(right.stage.days || 0) - Number(left.stage.days || 0));
}

function renderOperationFollowPanel() {
  const summaryBox = document.getElementById('operationFollowSummary');
  const body = document.getElementById('operationFollowBody');
  if (!summaryBox || !body) return;
  const rows = operationFollowRows();
  const totals = rows.reduce((acc, { order, stage }) => {
    acc[stage.key] = (acc[stage.key] || 0) + 1;
    acc.quantity += Number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse || order.warehouseBalance || 0);
    return acc;
  }, { quantity:0 });
  const cards = [
    ['النسيج', totals.weaving || 0],
    ['المصبغة', totals.dyehouse || 0],
    ['المخزن', totals.warehouse || 0],
    ['التسليم', totals.delivery || 0],
  ];
  summaryBox.innerHTML = cards.map(([label, value]) => `<button type="button" data-stage-filter="${escapeHtml(label === 'النسيج' ? 'weaving' : label === 'المصبغة' ? 'dyehouse' : label === 'المخزن' ? 'warehouse' : 'delivery')}"><span>${escapeHtml(label)}</span><strong>${Number(value || 0).toLocaleString('en-US')}</strong></button>`).join('');
  body.innerHTML = rows.length ? rows.map(({ order, stage }) => `
    <tr>
      <td data-label="رقم الطلب">${escapeHtml(order.orderNumber || '-')}</td>
      <td data-label="العميل">${escapeHtml(order.customer || '-')}</td>
      <td data-label="الصنف">${escapeHtml(order.fabricType || '-')}</td>
      <td data-label="المرحلة"><span class="status in-progress">${escapeHtml(stage.label || '-')}</span></td>
      <td data-label="واقف من">${escapeHtml(stage.startDate || '-')}</td>
      <td data-label="الأيام">${Number(stage.days || 0).toLocaleString('en-US')}</td>
      <td data-label="السبب">${escapeHtml(stage.reason || '-')}</td>
      <td data-label="إجراء"><button type="button" class="mini-btn" data-view="${escapeHtml(order.id)}">فتح</button></td>
    </tr>
  `).join('') : '<tr><td colspan="8"><div class="empty-state">لا توجد طلبات تحتاج متابعة تشغيل حالياً.</div></td></tr>';
}

async function refreshOperationFollowPanel() {
  await loadBackendData({ silentFailure:true });
  renderOperationFollowPanel();
}

({
  openMainWorkspace,
  closeOpenErpMenus,
  closeSidebar,
  toggleSidebar,
  setActiveSidebarButton,
  setWorkspaceModule,
  normalizeReportAction,
  applyStageShortcut,
  handleNavMenuAction,
} = window.createNavigation({
  refs,
  closeDashboardFocusMode: () => closeDashboardFocusMode(),
  closeAiFocusMode: () => closeAiFocusMode(),
  closeOrderFocusMode: () => closeOrderFocusMode(),
  openDashboardFocusMode: () => openDashboardFocusMode(),
  openAiFocusMode: () => openAiFocusMode(),
  renderOrders,
  renderTodayOrdersPanel: () => renderTodayOrdersPanel?.(),
  openManagementReport: (...args) => openManagementReport(...args),
  refreshOperationFollowPanel,
  openGluingQueueDialog,
  renderCustomerAccountsDialog,
  renderA5AccountsDialog,
  renderA5ExportDialog,
  openWhatsappSettingsDialog,
  renderWhatsappSettingsDialog,
  openOutboxDialog,
  openAuditLogDialog,
  openUsersDialog,
  openSystemStatusDialog,
  renderDyehousePricesDialog,
}));

({
  syncOrderFocusMode,
  decorateOrderFocusHeader,
  closeOrderFocusMode,
  openOrderFocusMode,
  syncAiFocusMode,
  syncDashboardFocusMode,
  decorateDashboardFocusHeader,
  closeDashboardFocusMode,
  openDashboardFocusMode,
  decorateAiFocusHeader,
  closeAiFocusMode,
  openAiFocusMode,
} = window.createFocusViews({
  refs,
  escapeHtml,
  canDeleteRecords,
  getOrderFocusMode: () => orderFocusMode,
  setOrderFocusMode: (value) => { orderFocusMode = value; },
  getAiFocusMode: () => aiFocusMode,
  setAiFocusMode: (value) => { aiFocusMode = value; },
  getDashboardFocusMode: () => dashboardFocusMode,
  setDashboardFocusMode: (value) => { dashboardFocusMode = value; },
  setSelectedOrderId: (value) => { selectedOrderId = value; },
  syncFilteredListMode,
  renderDetails,
  renderOperationFollowPanel,
  openMainWorkspace: () => openMainWorkspace(),
  closeSidebar: () => closeSidebar(),
  setWorkspaceModule: (moduleKey) => setWorkspaceModule(moduleKey),
  closeOrderFocusMode: () => closeOrderFocusMode(),
  closeAiFocusMode: () => closeAiFocusMode(),
  closeDashboardFocusMode: () => closeDashboardFocusMode(),
}));

function gluingOperationKey(batch = {}) {
  return String(batch.noteNumber || batch.partnerFabric || '').trim();
}

function gluingSourceLabel(batch = {}) {
  const order = orders.find((item)=>item.id === batch.orderId) || {};
  const allocation = allocations.find((item)=>item.id === batch.allocationId) || {};
  const calculatedOrder = order.id ? calculateOrder(order) : null;
  const calculatedAllocation = calculatedOrder?.allocations?.find((item)=>item.id === batch.allocationId) || allocation;
  const orderNumber = order.orderNumber || order.order_number || '-';
  const customer = order.customer || '-';
  const fabricType = order.fabricType || order.fabric_type || '-';
  const color = calculatedAllocation.color || '-';
  const width = calculatedAllocation.rawWidth || calculatedAllocation.targetFinishedWidth || '-';
  const weight = calculatedAllocation.targetFinishedWeight || '-';
  return `\u0637\u0644\u0628 ${orderNumber} - ${customer} - ${fabricType} - ${color} - \u0639\u0631\u0636 ${width} - \u0648\u0632\u0646 ${weight}`;
}

function gluingAllocationAvailable(order, allocation) {
  const calculatedAllocation = calculateAllocation(allocation, order);
  const delivered = sum(customerBatches.filter((batch)=>batch.allocationId === allocation.id));
  const sentGlue = sum(gluingBatches.filter((batch)=>batch.allocationId === allocation.id && batch.movement === 'sent'));
  const returnedGlue = sum(gluingBatches.filter((batch)=>batch.allocationId === allocation.id && batch.movement === 'return'));
  return roundNumber(Math.max(Number(calculatedAllocation.finishedReceived || 0) - delivered - sentGlue + returnedGlue, 0));
}

function gluingWarehouseSourceOptions() {
  return orders.flatMap((order) => {
    const calculatedOrder = calculateOrder(order);
    return (calculatedOrder.allocations || []).map((allocation) => {
      const available = gluingAllocationAvailable(calculatedOrder, allocation);
      if (available <= 0) return '';
      const label = gluingSourceLabel({ orderId: order.id, allocationId: allocation.id });
      return `<option value="${escapeHtml(order.id)}|${escapeHtml(allocation.id)}">${escapeHtml(label)} - متاح ${formatNumber(available)}</option>`;
    }).filter(Boolean);
  }).join('');
}

function gluingQueueGroups() {
  const groups = new Map();
  (gluingBatches || []).forEach((batch) => {
    const key = gluingOperationKey(batch);
    if (!key) return;
    if (!groups.has(key)) groups.set(key, { key, rows:[], sources:[], returns:[], received:[], delivered:[] });
    const group = groups.get(key);
    group.rows.push(batch);
    const movement = String(batch.movement || 'sent');
    if (movement === 'sent') group.sources.push(batch);
    else if (movement === 'return') group.returns.push(batch);
    else if (movement === 'received') group.received.push(batch);
    else if (movement === 'customer') group.delivered.push(batch);
  });
  return [...groups.values()].sort((a,b)=>String(b.rows[0]?.date || b.rows[0]?.createdAt || '').localeCompare(String(a.rows[0]?.date || a.rows[0]?.createdAt || '')));
}

function openGluingQueueDialog() {
  const groups = gluingQueueGroups();
  const groupOptions = groups.map((group)=>`<option value="${escapeHtml(group.key)}">${escapeHtml(group.key)}</option>`).join('');
  const groupDatalist = `<datalist id="gluingOperationKeys">${groups.map((group)=>`<option value="${escapeHtml(group.key)}"></option>`).join('')}</datalist>`;
  const warehouseSourceOptions = gluingWarehouseSourceOptions();
  const cards = groups.length ? groups.map((group)=>{
    const sent = sum(group.sources);
    const received = sum(group.received);
    const inGluing = roundNumber(Math.max(sent - received, 0));
    const sourceRows = group.sources.map((batch)=>`<tr><td>${escapeHtml(gluingSourceLabel(batch))}</td><td>${formatNumber(batch.quantity || 0)}</td></tr>`).join('');
    const outputRows = group.received.map((batch)=>`<tr><td>${escapeHtml(batch.outputName || '-')}</td><td>${formatNumber(batch.quantity || 0)}</td><td>${escapeHtml(batch.date || '-')}</td></tr>`).join('');
    return `<div class="subsection"><div class="subsection-head"><div><h3>عملية دمج ${escapeHtml(group.key)}</h3><p class="eyebrow">بعد تسجيل المنتج الناتج، افتح له طلب عادي جديد لإدخاله دورة التشغيل.</p></div></div><div class="summary-grid"><div class="metric"><span>خامات داخلة</span><strong>${formatNumber(sent)}</strong></div><div class="metric"><span>منتج ناتج</span><strong>${formatNumber(received)}</strong></div><div class="metric"><span>متبقي داخل الدمج</span><strong>${formatNumber(inGluing)}</strong></div></div><div class="table-wrap"><table class="allocation-table"><thead><tr><th>الخامة المصدر</th><th>كمية مسحوبة للدمج</th></tr></thead><tbody>${sourceRows}</tbody></table></div>${outputRows ? `<div class="table-wrap"><table class="allocation-table"><thead><tr><th>المنتج الناتج</th><th>الكمية</th><th>التاريخ</th></tr></thead><tbody>${outputRows}</tbody></table></div>` : ''}</div>`;
  }).join('') : '<div class="empty-state">لا توجد خامات في دمج الخامات حتى الآن.</div>';
  refs.documentTitle.textContent = 'دمج خامات';
  refs.documentBody.dataset.documentType = 'gluing-queue';
  refs.documentBody.innerHTML = `<div class="doc-root">${groupDatalist}<div class="subsection"><div class="subsection-head"><div><h3>&#1583;&#1605;&#1580; &#1582;&#1575;&#1605;&#1575;&#1578; &#1605;&#1606; &#1575;&#1604;&#1571;&#1608;&#1585;&#1583;&#1585;&#1575;&#1578; &#1575;&#1604;&#1585;&#1574;&#1610;&#1587;&#1610;&#1577;</h3><p class="eyebrow">&#1575;&#1582;&#1578;&#1585; &#1575;&#1604;&#1582;&#1575;&#1605;&#1578;&#1610;&#1606; &#1608;&#1575;&#1604;&#1603;&#1605;&#1610;&#1575;&#1578; &#1575;&#1604;&#1605;&#1591;&#1604;&#1608;&#1576;&#1577; &#1605;&#1606; &#1585;&#1589;&#1610;&#1583; &#1575;&#1604;&#1605;&#1582;&#1586;&#1606;&#1548; &#1579;&#1605; &#1610;&#1578;&#1605; &#1587;&#1581;&#1576;&#1607;&#1605; &#1573;&#1604;&#1609; &#1606;&#1601;&#1587; &#1593;&#1605;&#1604;&#1610;&#1577; &#1575;&#1604;&#1583;&#1605;&#1580;.</p></div></div><form class="batch-form" data-gluing-source-form><input name="operationKey" list="gluingOperationKeys" placeholder="&#1585;&#1602;&#1605; &#1593;&#1605;&#1604;&#1610;&#1577; &#1575;&#1604;&#1583;&#1605;&#1580;" required><select name="sourceKey" required><option value="">&#1575;&#1604;&#1582;&#1575;&#1605;&#1577; &#1575;&#1604;&#1571;&#1608;&#1604;&#1609; &#1605;&#1606; &#1585;&#1589;&#1610;&#1583; &#1575;&#1604;&#1605;&#1582;&#1586;&#1606;</option>${warehouseSourceOptions}</select><input name="quantity" type="number" step="0.01" placeholder="&#1603;&#1605;&#1610;&#1577; &#1575;&#1604;&#1582;&#1575;&#1605;&#1577; &#1575;&#1604;&#1571;&#1608;&#1604;&#1609;" required><select name="sourceKey2"><option value="">&#1575;&#1604;&#1582;&#1575;&#1605;&#1577; &#1575;&#1604;&#1579;&#1575;&#1606;&#1610;&#1577; &#1605;&#1606; &#1585;&#1589;&#1610;&#1583; &#1575;&#1604;&#1605;&#1582;&#1586;&#1606;</option>${warehouseSourceOptions}</select><input name="quantity2" type="number" step="0.01" placeholder="&#1603;&#1605;&#1610;&#1577; &#1575;&#1604;&#1582;&#1575;&#1605;&#1577; &#1575;&#1604;&#1579;&#1575;&#1606;&#1610;&#1577;"><input name="date" type="date" value="${new Date().toISOString().slice(0,10)}" required><input class="full" name="notes" placeholder="&#1605;&#1604;&#1575;&#1581;&#1592;&#1575;&#1578;"><button type="button" class="mini-btn full" data-save-gluing-source>&#1587;&#1581;&#1576; &#1575;&#1604;&#1582;&#1575;&#1605;&#1575;&#1578; &#1573;&#1604;&#1609; &#1593;&#1605;&#1604;&#1610;&#1577; &#1575;&#1604;&#1583;&#1605;&#1580;</button></form></div><div class="subsection"><div class="subsection-head"><div><h3>دمج الخامات واستلام المنتج الناتج</h3><p class="eyebrow">اختر عملية الدمج بعد سحب الخامتين، ثم سجل المنتج الناتج منها.</p></div></div><form class="batch-form" data-gluing-merge-form><select name="operationKey" required><option value="">اختر رقم عملية الدمج</option>${groupOptions}</select><input name="date" type="date" value="${new Date().toISOString().slice(0,10)}" required><input name="outputName" placeholder="اسم المنتج الناتج" required><input name="quantity" type="number" step="0.01" placeholder="كمية المنتج الناتج" required><input class="full" name="notes" placeholder="ملاحظات"><button type="button" class="mini-btn full" data-save-gluing-merge>تسجيل الدمج واستلام المنتج</button></form></div>${cards}</div>`;
  if (!refs.documentDialog.open) refs.documentDialog.showModal();
}

function findGluingGroup(operationKey) {
  return gluingQueueGroups().find((group)=>group.key === String(operationKey || '').trim());
}

async function saveGluingSourceFromDialog(form) {
  if (!(await ensureBackendForWrite())) return;
  const data = Object.fromEntries(new FormData(form).entries());
  const operationKey = String(data.operationKey || '').trim();
  if (!operationKey) { alert('اكتب رقم عملية الدمج.'); return; }
  const sourceRows = [
    { sourceKey:data.sourceKey, quantity:data.quantity },
    { sourceKey:data.sourceKey2, quantity:data.quantity2 }
  ].filter((row)=>String(row.sourceKey || '').trim() && Number(row.quantity || 0) > 0);
  if (!sourceRows.length) { alert('اختر خامة واحدة على الأقل وكمية مطلوبة.'); return; }
  let savedAny = false;
  for (const row of sourceRows) {
    const [orderId, allocationId] = String(row.sourceKey || '').split('|');
    const order = orders.find((item)=>item.id === orderId);
    const allocation = allocations.find((item)=>item.id === allocationId);
    if (!order || !allocation) { alert('تعذر قراءة الخامة المختارة من الطلب.'); return; }
    const calculatedOrder = calculateOrder(order);
    const available = gluingAllocationAvailable(calculatedOrder, allocation);
    const quantity = Number(row.quantity || 0);
    let notes = data.notes || '';
    if (quantity > available) notes = [notes, 'تنبيه: الكمية أكبر من رصيد المخزن المتاح لهذه الخامة'].filter(Boolean).join(' - ');
    const saved = await postBackend('/batches/gluing', batchToApi({
      id: uid(),
      orderId,
      allocationId,
      date: data.date,
      quantity,
      movement: 'sent',
      noteNumber: operationKey,
      partnerFabric: operationKey,
      notes
    }));
    if (!saved) { alert('تعذر سحب الخامات إلى عملية الدمج.'); return; }
    savedAny = true;
  }
  if (!savedAny) return;
  await loadBackendData();
  openGluingQueueDialog();
}

async function saveGluingMergeFromDialog(form) {
  if (!(await ensureBackendForWrite())) return;
  const data = Object.fromEntries(new FormData(form).entries());
  const group = findGluingGroup(data.operationKey);
  const source = group?.sources?.[0];
  if (!group || !source) { alert('اختر رقم عملية دمج تحتوي على خامات داخلة أولا.'); return; }
  if (!String(data.outputName || '').trim()) { alert('اكتب اسم المنتج الجديد.'); return; }
  const sent = sum(group.sources);
  const returned = sum(group.returns);
  const received = sum(group.received);
  const available = Math.max(sent - returned - received, 0);
  if (Number(data.quantity || 0) > available) data.notes = [data.notes, 'تنبيه: كمية المنتج الناتج أكبر من الرصيد الموجود داخل الدمج'].filter(Boolean).join(' - ');
  const saved = await postBackend('/batches/gluing', batchToApi({
    id: uid(),
    orderId: source.orderId,
    date: data.date,
    quantity: Number(data.quantity || 0),
    movement: 'received',
    outputName: data.outputName,
    customerName: data.customerName || '',
    noteNumber: group.key,
    partnerFabric: group.key,
    notes: data.notes || ''
  }));
  if (!saved) { alert('تعذر حفظ عملية الدمج في قاعدة البيانات.'); return; }
  await loadBackendData();
  openGluingQueueDialog();
}

async function saveGluingReturnFromDialog(form) {
  if (!(await ensureBackendForWrite())) return;
  const data = Object.fromEntries(new FormData(form).entries());
  const [operationKey, allocationId] = String(data.sourceKey || '').split('|');
  const group = findGluingGroup(operationKey);
  const source = group?.sources?.find((batch)=>batch.allocationId === allocationId);
  if (!group || !source || !allocationId) { alert('اختر الخامة المصدر أولا.'); return; }
  const sent = sum(group.sources.filter((batch)=>batch.allocationId === allocationId));
  const returned = sum(group.returns.filter((batch)=>batch.allocationId === allocationId));
  const available = Math.max(sent - returned, 0);
  if (Number(data.quantity || 0) > available) data.notes = [data.notes, 'تنبيه: المرتجع أكبر من رصيد هذه الخامة داخل الدمج'].filter(Boolean).join(' - ');
  const saved = await postBackend('/batches/gluing', batchToApi({
    id: uid(),
    orderId: source.orderId,
    allocationId,
    date: data.date,
    quantity: Number(data.quantity || 0),
    movement: 'return',
    noteNumber: group.key,
    partnerFabric: group.key,
    notes: data.notes || ''
  }));
  if (!saved) { alert('تعذر حفظ رجوع المتبقي من الدمج.'); return; }
  await loadBackendData();
  openGluingQueueDialog();
}

async function saveGluingCustomerFromDialog(form) {
  if (!(await ensureBackendForWrite())) return;
  const data = Object.fromEntries(new FormData(form).entries());
  const group = findGluingGroup(data.operationKey);
  const source = group?.sources?.[0];
  if (!group || !source) { alert('اختر رقم عملية الدمج أولا.'); return; }
  if (!String(data.outputName || '').trim() || !String(data.customerName || '').trim()) { alert('اكتب اسم المنتج والعميل قبل التسليم.'); return; }
  const received = sum(group.received.filter((batch)=>normalizeForCompare(batch.outputName) === normalizeForCompare(data.outputName)));
  const delivered = sum(group.delivered.filter((batch)=>normalizeForCompare(batch.outputName) === normalizeForCompare(data.outputName)));
  if (Number(data.quantity || 0) > Math.max(received - delivered, 0)) data.notes = [data.notes, 'تنبيه: كمية التسليم أكبر من رصيد المنتج الناتج'].filter(Boolean).join(' - ');
  const saved = await postBackend('/batches/gluing', batchToApi({
    id: uid(),
    orderId: source.orderId,
    date: data.date,
    quantity: Number(data.quantity || 0),
    movement: 'customer',
    outputName: data.outputName,
    customerName: data.customerName,
    noteNumber: group.key,
    partnerFabric: group.key,
    notes: data.notes || ''
  }));
  if (!saved) { alert('تعذر حفظ تسليم المنتج الناتج.'); return; }
  await loadBackendData();
  openGluingQueueDialog();
}
function batchItemHtml(type, batch, label) {
  const quantity = Number(batch?.quantity || 0);
  const displayLabel = quantity < 0
    ? String(label)
      .replace('تسليم قماش للعميل', 'مرتجع قماش من العميل')
      .replace('تسليم إكسسوار للعميل', 'مرتجع إكسسوار من العميل')
      .replace(String(batch.quantity), formatNumber(Math.abs(quantity)))
    : label;
  return `<div class="batch-item"><span>${displayLabel}</span><div class="batch-actions"><button class="mini-btn" data-batch-action="edit" data-batch-type="${type}" data-batch-id="${batch.id}">تعديل</button>${canDeleteRecords() ? `<button class="mini-btn danger" data-batch-action="delete" data-batch-type="${type}" data-batch-id="${batch.id}">حذف</button>` : ''}</div></div>`;
}
function listHtml(items, formatter) { const rows = Array.isArray(items) ? items : []; return rows.length ? rows.map(formatter).join('') : `<div class="empty-state">لا توجد دفعات بعد.</div>`; }
function allocationWidthSuffix(order, allocation) {
  if (!order || !allocation) return '';
  const widthLine = (order.widthLines || []).find((item) => item.id === allocation.widthLineId) || {};
  const inch = allocation.rawInch || widthLine.inch || '';
  const width = allocation.rawWidth || allocation.targetFinishedWidth || widthLine.width || '';
  const finishedWeight = allocation.targetFinishedWeight || allocation.finishedWeight || '';
  const parts = [];
  if (inch) parts.push(`بوصة ${inch}`);
  if (width) parts.push(`عرض ${width}`);
  if (finishedWeight) parts.push(`وزن ${finishedWeight}`);
  return parts.length ? ` / ${parts.join(' - ')}` : '';
}
function allocationAvailableToCustomer(allocation) {
  return roundNumber(Math.max(Number(allocation?.finishedReceived || 0) - Number(allocation?.deliveredToCustomer || 0), 0));
}
function allocationOrdinalLabel(order, allocation) {
  const index = (order?.allocations || []).findIndex((item)=>item.id === allocation?.id);
  return index >= 0 ? `بند ${index + 1}` : '';
}
function allocationOptionLabel(order, allocation) {
  if (!allocation) return '-';
  const planned = Number(allocation.plannedQuantity || 0) ? ` / مخطط ${formatNumber(allocation.plannedQuantity)}` : '';
  const ordinal = allocationOrdinalLabel(order, allocation);
  return `${ordinal ? `${ordinal} / ` : ''}${allocation.color || '-'} / ${allocation.dyehouse || '-'}${allocationWidthSuffix(order, allocation)}${planned}`;
}
function allocationColorLabel(order, allocation) {
  if (!allocation) return '-';
  return allocationOptionLabel(order, allocation);
}
function customerDeliveryAllocationLabel(order, allocation) {
  if (!allocation) return '-';
  return `${allocationOptionLabel(order, allocation)} / متاح ${formatNumber(allocationAvailableToCustomer(allocation))}`;
}
function rawDispatchOptions(order) {
  const widthLines = Array.isArray(order?.widthLines) ? order.widthLines : [];
  if (widthLines.length) {
    return widthLines.map((line)=>({
      id: line.id,
      label: `بوصة ${line.inch || '-'} - عرض ${line.width || '-'} - كمية ${formatNumber(line.quantity || 0)}`,
    })).filter((item)=>item.id);
  }
  return (order?.allocations || []).map((allocation)=>({
    id: allocation.id,
    label: allocationOptionLabel(order, allocation),
  })).filter((item)=>item.id);
}
function rawDispatchLabel(order, id) {
  if (!id) return '';
  const option = rawDispatchOptions(order).find((item)=>item.id === id);
  return option?.label || '';
}
function ensureRawDispatchSelect(form, order) {
  if (!form || !order) return;
  const options = rawDispatchOptions(order);
  if (!options.length) return;
  let select = form.elements.widthLineId;
  if (!select) {
    select = document.createElement('select');
    select.name = 'widthLineId';
    select.setAttribute('data-out-only', '');
    const dateInput = form.elements.date;
    dateInput?.insertAdjacentElement('afterend', select);
  }
  const current = select.value;
  select.innerHTML = `<option value="">اختر العرض / البند عند خروج الخام</option>${options.map((item)=>`<option value="${item.id}">${item.label}</option>`).join('')}`;
  if ([...select.options].some((option)=>option.value === current)) select.value = current;
}
function movementLine(...parts) {
  return parts.map((part)=>String(part ?? '').trim()).filter(Boolean).join(' - ');
}
function noteSuffix(batch) {
  return batch?.noteNumber ? ` / رقم إذن ${batch.noteNumber}` : '';
}

function order360StageClass(done, active) {
  if (done) return 'done';
  if (active) return 'active';
  return 'pending';
}
function order360Alerts(order, stage) {
  const alerts = [];
  const expectedWaste = Number(order.expectedWastePercent || 0);
  const actualWaste = Number(order.totalWastePercent || 0);
  if (Number(stage.days || 0) >= 7 && !['completed','closed'].includes(stage.key)) alerts.push(`واقف ${stage.days} يوم في مرحلة ${stage.label}`);
  if (actualWaste > 0 && actualWaste >= Math.max(8, expectedWaste + 2)) alerts.push(`الهالك الفعلي ${formatNumber(actualWaste, 1)}% أعلى من المتوقع ${formatNumber(expectedWaste, 1)}%`);
  if (Number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse || 0) > 0) alerts.push(`داخل المصبغة ${formatNumber(order.rawAtDyehouseAvailable || order.remainingAtDyehouse)} كجم لم يرجع مجهزًا`);
  if (Number(order.warehouseBalance || 0) > 0) alerts.push(`رصيد مخزن متاح للتسليم ${formatNumber(order.warehouseBalance)} كجم`);
  if (order.allocationExceedsRaw) alerts.push('كمية خطة الألوان أكبر من الخام المتاح');
  return alerts;
}
function order360Html(order) {
  const stage = orderStageInfo(order);
  const movementDates = orderMovementDates(order);
  const dyehouseBalance = Number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse || 0);
  const steps = [
    { key:'order', label:'طلب العميل', value:formatNumber(order.totalRawOrdered || 0), sub:`خام مطلوب / ${movementDates.orderDate}`, done:true },
    { key:'weaving', label:'النسيج', value:formatNumber(order.totalRawReceived || 0), sub:`خام خرج للمصبغة / ${movementDates.weavingDate}`, done:Number(order.totalRawReceived || 0) > 0, active:stage.key === 'weaving' },
    { key:'dyehouse', label:'المصبغة', value:formatNumber(dyehouseBalance), sub:`متبقي داخل المصبغة / ${movementDates.weavingDate}`, done:Number(order.totalFinishedReceived || 0) > 0 || dyehouseBalance === 0, active:stage.key === 'dyehouse' },
    { key:'warehouse', label:'المخزن', value:formatNumber(order.warehouseBalance || 0), sub:`رصيد مجهز / ${movementDates.dyehouseDate}`, done:Number(order.totalFinishedReceived || 0) > 0, active:stage.key === 'warehouse' },
    { key:'delivery', label:'التسليم', value:formatNumber(order.totalDeliveredToCustomer || 0), sub:`مسلم للعميل / ${movementDates.customerDate}`, done:Number(order.remainingToCustomer || 0) === 0 && Number(order.totalDeliveredToCustomer || 0) > 0, active:stage.key === 'delivery' },
    { key:'close', label:'الإغلاق', value:stage.key === 'closed' ? 'مغلق' : (stage.key === 'completed' ? 'مكتمل' : 'مفتوح'), sub:'حالة التشغيل', done:['completed','closed'].includes(stage.key), active:stage.key === 'closed' },
  ];
  const alerts = order360Alerts(order, stage);
  const progressBase = Number(order.totalRawOrdered || order.totalAllocated || 0);
  const deliveredPercent = progressBase ? Math.min(Number(order.totalDeliveredToCustomer || 0) / progressBase * 100, 100) : 0;
  return `<section class="order-360">
    <div class="order-360-head">
      <div><p class="eyebrow">Order 360</p><h2>${escapeHtml(order.orderNumber || '-')} - ${escapeHtml(order.customer || '-')}</h2><p>${escapeHtml(order.fabricType || '-')} / ${escapeHtml(order.dyehouse || '-')} / ${escapeHtml(order.weavingSource || '-')}</p></div>
      <div class="order-360-stage"><span>${escapeHtml(stage.label)}</span><strong>${Number(stage.days || 0).toLocaleString('en-US')} يوم</strong></div>
    </div>
    <div class="order-360-flow">${steps.map((step)=>`<article class="${order360StageClass(step.done, step.active)}"><span>${escapeHtml(step.label)}</span><strong>${escapeHtml(step.value)}</strong><small>${escapeHtml(step.sub)}</small></article>`).join('')}</div>
    <div class="order-360-progress"><span style="width:${deliveredPercent}%"></span></div>
    <div class="order-360-kpis">
      <div><span>داخل المصبغة</span><strong>${formatNumber(dyehouseBalance)}</strong></div>
      <div><span>رصيد المخزن</span><strong>${formatNumber(order.warehouseBalance || 0)}</strong></div>
      <div><span>متبقي للعميل</span><strong>${formatNumber(order.remainingToCustomer || 0)}</strong></div>
      <div><span>الهالك الفعلي</span><strong>${formatNumber(order.totalWaste || 0)} (${formatNumber(order.totalWastePercent || 0, 1)}%)</strong></div>
    </div>
    <div class="order-360-alerts">${alerts.length ? alerts.map((alert)=>`<span>${escapeHtml(alert)}</span>`).join('') : '<span class="ok">لا توجد تنبيهات حرجة على هذا الطلب حاليًا.</span>'}</div>
  </section>`;
}

function consolidateOrderDetailView(order) {
  const root = refs.orderDetailsPanel;
  if (!root || !order) return;
  if (orderFocusMode) root.querySelector('#editOrderBtn')?.remove();
  const stage = orderStageInfo(order);
  const statusBadge = root.querySelector('.section-head .status');
  if (statusBadge) {
    statusBadge.textContent = stage.label;
    statusBadge.title = stage.reason;
  }
  const colorSection = root.querySelector('#addAllocationBtn')?.closest('.subsection');
  if (colorSection) {
    const title = colorSection.querySelector('h3');
    if (title) title.textContent = '\u062e\u0637\u0629 \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0648\u0627\u0644\u0631\u0635\u064a\u062f';
    const table = colorSection.querySelector('table');
    if (table) {
      const head = table.querySelector('thead');
      const body = table.querySelector('tbody');
      if (head && body) {
        head.innerHTML = '<tr><th>\u0627\u0644\u0644\u0648\u0646</th><th>\u0627\u0644\u0645\u062e\u0637\u0637</th><th>\u0627\u0644\u0645\u0635\u0628\u063a\u0629</th><th>\u0627\u0644\u0639\u0631\u0636</th><th>\u0627\u0644\u0648\u0632\u0646 \u0645\u062c\u0647\u0632</th><th>\u0645\u0631\u0633\u0644 \u0644\u0644\u0645\u0635\u0628\u063a\u0629</th><th>\u062a\u0633\u0644\u064a\u0645 \u0627\u0644\u0639\u0645\u064a\u0644</th><th>\u0631\u0635\u064a\u062f \u0627\u0644\u0645\u062e\u0632\u0646</th><th>\u0627\u0644\u0647\u0627\u0644\u0643</th><th>\u0625\u062c\u0631\u0627\u0621</th></tr>';
        body.innerHTML = order.allocations.map((allocation) => {
          const delivered = sum(customerBatches.filter((batch)=>batch.allocationId === allocation.id));
          const sentGlue = sum(gluingBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement === 'sent'));
          const returnedGlue = sum(gluingBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement === 'return'));
          const balance = roundNumber(Number(allocation.finishedReceived || 0) - delivered - sentGlue + returnedGlue);
          const wasteLabel = `${formatNumber(allocation.wasteQuantity || 0)} (${formatNumber(allocation.wastePercent || 0, 1)}%)`;
          const plannedCell = stockFlowCell(allocation.plannedQuantity || 0, accessoryPlannedPartsForOrder(order, allocation));
          const sentCell = stockFlowCell(allocation.sentToDyehouse || 0, accessoryFlowPartsForOrder(order, allocation, 'sent'));
          const deliveredCell = stockFlowCell(delivered || 0, accessoryFlowPartsForOrder(order, allocation, 'customer'));
          const balanceCell = stockFlowCell(balance || 0, accessoryBalancePartsForOrder(order, allocation));
          const actions = `<div class="batch-actions"><button class="mini-btn" data-edit-allocation="${allocation.id}">\u062a\u0639\u062f\u064a\u0644 \u0644\u0648\u0646</button><button class="mini-btn" data-transfer-allocation="${allocation.id}">\u0646\u0642\u0644 \u0645\u0635\u0628\u063a\u0629</button>${canDeleteRecords() ? `<button class="mini-btn danger" data-delete-allocation="${allocation.id}">\u062d\u0630\u0641 \u0644\u0648\u0646</button>` : ''}</div>`;
          return `<tr><td>${escapeHtml(allocation.color || '-')}</td><td>${plannedCell}</td><td>${escapeHtml(allocation.dyehouse || order.dyehouse || '-')}</td><td>${escapeHtml(allocation.targetFinishedWidth || allocation.rawWidth || '-')}</td><td>${escapeHtml(allocation.targetFinishedWeight || '-')}</td><td>${sentCell}</td><td>${deliveredCell}</td><td><strong>${balanceCell}</strong></td><td>${wasteLabel}</td><td>${actions}</td></tr>`;
        }).join('');
      }
    }
  }
}

function setOrderDetailTab(tabId = 'overview') {
  const root = refs.orderDetailsPanel;
  if (!root) return;
  const nextTab = root.querySelector(`[data-order-tab-panel="${tabId}"]`) ? tabId : 'overview';
  if (selectedOrderId) orderDetailTabsByOrder[selectedOrderId] = nextTab;
  root.querySelectorAll('[data-order-tab]').forEach((button) => {
    const active = button.dataset.orderTab === nextTab;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  root.querySelectorAll('[data-order-tab-panel]').forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.orderTabPanel === nextTab);
  });
}

function orderDetailSectionForNode(node) {
  if (!node || node.nodeType !== 1) return 'overview';
  if (node.classList.contains('batch-grid')) return 'movements';
  if (node.classList.contains('report-send-status')) return 'documents';
  if (node.classList.contains('order-360') || node.classList.contains('summary-grid')) return 'overview';
  if (node.matches('h3')) return 'overview';
  if (node.classList.contains('subsection')) {
    const text = node.textContent || '';
    if (node.querySelector('#addAllocationBtn') || text.includes('\u0627\u0644\u0623\u0644\u0648\u0627\u0646') || text.includes('\u0627\u0644\u0639\u0631\u0648\u0636')) return 'colors';
    if (node.classList.contains('stock-flow-section') || text.includes('\u0627\u0644\u0645\u062e\u0632\u0646') || text.includes('\u0627\u0644\u0631\u0635\u064a\u062f')) return 'warehouse';
  }
  return 'overview';
}

function organizeOrderDetailsTabs() {
  const root = refs.orderDetailsPanel;
  if (!root || root.querySelector('.order-detail-tabs')) return;
  const head = root.querySelector('.section-head');
  if (!head) return;
  const tabs = [
    ['overview', '\u0627\u0644\u0645\u0644\u062e\u0635'],
    ['colors', '\u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0648\u0627\u0644\u0631\u0635\u064a\u062f'],
    ['movements', '\u0627\u0644\u062d\u0631\u0643\u0627\u062a'],
    ['warehouse', '\u0627\u0644\u0645\u062e\u0632\u0646'],
    ['documents', '\u0627\u0644\u0645\u0633\u062a\u0646\u062f\u0627\u062a'],
  ];
  const nav = document.createElement('div');
  nav.className = 'order-detail-tabs';
  nav.setAttribute('role', 'tablist');
  nav.innerHTML = tabs.map(([id, label], index) => `<button type="button" class="mini-btn ${index === 0 ? 'active' : ''}" role="tab" aria-selected="${index === 0 ? 'true' : 'false'}" data-order-tab="${id}">${label}</button>`).join('');
  const panels = document.createElement('div');
  panels.className = 'order-detail-tab-panels';
  panels.innerHTML = tabs.map(([id, label], index) => `<section class="order-detail-tab-panel ${index === 0 ? 'active' : ''}" data-order-tab-panel="${id}" aria-label="${label}"></section>`).join('');
  head.insertAdjacentElement('afterend', nav);
  nav.insertAdjacentElement('afterend', panels);
  const panelMap = Object.fromEntries([...panels.querySelectorAll('[data-order-tab-panel]')].map((panel) => [panel.dataset.orderTabPanel, panel]));
  [...root.children].forEach((node) => {
    if (node === head || node === nav || node === panels) return;
    const sectionId = orderDetailSectionForNode(node);
    panelMap[sectionId]?.appendChild(node);
  });
  Object.values(panelMap).forEach((panel) => {
    if (!panel.children.length) panel.innerHTML = '<div class="empty-state">\u0644\u0627 \u062a\u0648\u062c\u062f \u0628\u064a\u0627\u0646\u0627\u062a \u0641\u064a \u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645 \u062d\u0627\u0644\u064a\u064b\u0627.</div>';
  });
  setOrderDetailTab(orderDetailTabsByOrder[selectedOrderId] || 'overview');
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
  const rawItems = (()=>{ const outgoing = rawBatches.filter((batch)=>batch.orderId===order.id).map((batch)=>{ const widthLabel = rawDispatchLabel(order, batch.widthLineId); return { type:'raw', batch, label:movementLine('خروج خام للمصبغة', batch.date, batch.quantity, batch.supplier || '-', widthLabel) + noteSuffix(batch) }; }); const returns = rawReturns.filter((batch)=>order.allocations.some((allocation)=>allocation.id===batch.allocationId)).map((batch)=>{ const allocation=order.allocations.find((item)=>item.id===batch.allocationId); return { type:'rawReturn', batch, label:movementLine('مرتجع خام للنسيج', batch.date, allocation?.dyehouse || '-', allocation?.color || '-', batch.quantity) + noteSuffix(batch) }; }); const rows = outgoing.concat(returns).sort((a,b)=>String(b.batch.date||'').localeCompare(String(a.batch.date||''))); return rows.length ? rows.map((item)=>batchItemHtml(item.type, item.batch, item.label)).join('') : '<div class="empty-state">لا توجد دفعات بعد.</div>'; })();
  const accessoryColor = (batch)=>order.allocations.find((item)=>item.id===batch.allocationId)?.color || batch.color || '-';
  const accessoryTypeOptions = order.accessoryLines.map((line)=>`<option value="${line.type}">${line.type}</option>`).join('');
  const accessoryTypeSelect = `<select name="accessoryType" required><option value="">اختر نوع الإكسسوار</option>${accessoryTypeOptions}</select>`;
  const accessoryItems = listHtml(accessoryBatches.filter((batch)=>batch.orderId===order.id && batch.movement === 'sent'), (batch)=>batchItemHtml('accessory', batch, movementLine('خروج إكسسوار', batch.date, batch.quantity, batch.accessoryType || order.accessoryLines[0]?.type || 'إكسسوار') + noteSuffix(batch)));
  const accessoryReceivedItems = listHtml(accessoryBatches.filter((batch)=>batch.orderId===order.id && batch.movement === 'received'), (batch)=>batchItemHtml('accessory', batch, movementLine('استلام إكسسوار', batch.date, accessoryColor(batch), batch.quantity, batch.accessoryType || 'إكسسوار') + noteSuffix(batch)));
  const productionItems = listHtml(productionBatches.filter((batch)=>order.allocations.some((allocation)=>allocation.id===batch.allocationId)), (batch)=>{ const allocation=order.allocations.find((item)=>item.id===batch.allocationId); return batchItemHtml('production', batch, movementLine('استلام مجهز', batch.date, allocation?.dyehouse || '-', allocation?.color || '-', batch.quantity) + noteSuffix(batch)); });
  const customerItems = (()=>{ const cloth = customerBatches.filter((batch)=>order.allocations.some((allocation)=>allocation.id===batch.allocationId)).map((batch)=>{ const allocation=order.allocations.find((item)=>item.id===batch.allocationId); const label = allocation ? allocationColorLabel(order, allocation) : '-'; return { type:'customer', batch, label:movementLine('تسليم قماش للعميل', batch.date, label, batch.quantity) }; }); const accessories = accessoryBatches.filter((batch)=>batch.orderId===order.id && batch.movement === 'customer').map((batch)=>{ const allocation=order.allocations.find((item)=>item.id===batch.allocationId); const label = allocation ? allocationColorLabel(order, allocation) : accessoryColor(batch); return { type:'accessory', batch, label:movementLine('تسليم إكسسوار للعميل', batch.date, label, batch.quantity, batch.accessoryType || order.accessoryLines[0]?.type || 'إكسسوار') + noteSuffix(batch) }; }); const rows = cloth.concat(accessories).sort((a,b)=>String(b.batch.date||'').localeCompare(String(a.batch.date||''))); return rows.length ? rows.map((item)=>batchItemHtml(item.type, item.batch, item.label)).join('') : '<div class="empty-state">لا توجد دفعات بعد.</div>'; })();
  const transferItems = listHtml(dyehouseTransfers.filter((batch)=>batch.orderId===order.id), (batch)=>batchItemHtml('transfer', batch, movementLine('تحويل مصبغة', batch.date, batch.color || '-', batch.fromDyehouse || '-', batch.toDyehouse || '-', batch.quantity) + noteSuffix(batch)));
  const rawReturnItems = listHtml(rawReturns.filter((batch)=>order.allocations.some((allocation)=>allocation.id===batch.allocationId)), (batch)=>{ const allocation=order.allocations.find((item)=>item.id===batch.allocationId); return batchItemHtml('rawReturn', batch, movementLine('مرتجع خام للنسيج', batch.date, allocation?.dyehouse || '-', allocation?.color || '-', batch.quantity) + noteSuffix(batch)); });
  const stockRows = order.allocations.map((allocation)=>{ const delivered = sum(customerBatches.filter((batch)=>batch.allocationId===allocation.id)); const sentGlue = sum(gluingBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement === 'sent')); const returnedGlue = sum(gluingBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement === 'return')); const balance = roundNumber(Number(allocation.finishedReceived || 0) - delivered - sentGlue + returnedGlue); const widthInfo = order.widthMode === 'multiple' ? `&#1576;&#1608;&#1589;&#1577; ${allocation.rawInch || '-'} / &#1593;&#1585;&#1590; ${allocation.rawWidth || allocation.targetFinishedWidth || '-'}` : `&#1576;&#1608;&#1589;&#1577; ${order.inchWidth || '-'} / &#1593;&#1585;&#1590; ${allocation.targetFinishedWidth || '-'}`; return `<tr><td>${allocation.color}</td><td>${widthInfo}</td><td>${formatNumber(allocation.finishedReceived || 0)}</td><td>${formatNumber(delivered || 0)}</td><td><strong>${formatNumber(balance)}</strong></td></tr>`; }).join('');
  const accessoryStockRows = order.accessoryLines.length ? order.allocations.flatMap((allocation)=>order.accessoryLines.map((line)=>{ const received = sum(accessoryBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement==='received' && (batch.accessoryType || line.type) === line.type)); const delivered = sum(accessoryBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement==='customer' && (batch.accessoryType || line.type) === line.type)); const balance = roundNumber(received - delivered); return `<tr><td>${allocation.color}</td><td>${line.type}</td><td>${formatNumber(received || 0)}</td><td>${formatNumber(delivered || 0)}</td><td><strong>${formatNumber(balance)}</strong></td></tr>`; })).join('') : '';
  const stockFlowRows = order.allocations.map((allocation)=>{ const clothDelivered = sum(customerBatches.filter((batch)=>batch.allocationId===allocation.id)); const sentGlue = sum(gluingBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement === 'sent')); const returnedGlue = sum(gluingBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement === 'return')); const clothBalance = roundNumber(Number(allocation.finishedReceived || 0) - clothDelivered - sentGlue + returnedGlue); const accessorySentParts = accessoryFlowPartsForOrder(order, allocation, 'sent'); const accessoryReceivedParts = accessoryFlowPartsForOrder(order, allocation, 'received'); const accessoryDeliveredParts = accessoryFlowPartsForOrder(order, allocation, 'customer'); const accessoryBalanceParts = (order.accessoryLines || []).map((line)=>{ const received = sum(accessoryBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement==='received' && (batch.accessoryType || line.type) === line.type)); const delivered = sum(accessoryBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement==='customer' && (batch.accessoryType || line.type) === line.type)); const balance = roundNumber(received - delivered); return balance ? `${formatNumber(balance)} ${line.type}` : ''; }).filter(Boolean); return `<tr><td>${escapeHtml(allocation.color || '-')}</td><td>${stockFlowText(allocation.sentToDyehouse || 0, accessorySentParts)}</td><td>${stockFlowText(allocation.finishedReceived || 0, accessoryReceivedParts)}</td><td>${stockFlowText(clothDelivered || 0, accessoryDeliveredParts)}</td><td><strong>${stockFlowText(clothBalance || 0, accessoryBalanceParts)}</strong></td></tr>`; }).join('');
  const inventorySection = `<div class="subsection stock-flow-section"><div class="subsection-head"><div><h3>رصيد المخزن الحالي</h3><p class="eyebrow">رصيد المخزن حسب التشغيل والتسليم</p></div></div><div class="table-wrap"><table class="allocation-table"><thead><tr><th>اللون</th><th>العرض</th><th>دخل المخزن</th><th>تسليم العميل</th><th>الرصيد الحالي</th></tr></thead><tbody>${stockRows}</tbody></table></div>${order.accessoryLines.length ? `<div class="table-wrap"><table class="allocation-table"><thead><tr><th>اللون</th><th>العرض</th><th>دخل المخزن</th><th>تسليم العميل</th><th>الرصيد الحالي</th></tr></thead><tbody>${accessoryStockRows}</tbody></table></div>` : ''}</div>`;
  refs.orderDetailsPanel.innerHTML = `<div class="section-head"><div><p class="eyebrow">${order.orderNumber}</p><h2>${order.customer}</h2></div><div class="actions"><button class="mini-btn" id="editOrderBtn">تعديل الطلب</button><button class="mini-btn ${order.operationClosed ? 'gold' : 'danger'}" id="toggleOperationClosedBtn">${order.operationClosed ? 'إعادة فتح التشغيل' : 'إغلاق دورة التشغيل'}</button><span class="status ${order.status}">${statusLabel(order.status)}</span></div></div><h3>&#1605;&#1604;&#1582;&#1589; &#1583;&#1608;&#1585;&#1577; &#1575;&#1604;&#1578;&#1588;&#1594;&#1610;&#1604;</h3><div class="summary-grid"><div class="metric"><span>&#1573;&#1580;&#1605;&#1575;&#1604;&#1610; &#1575;&#1604;&#1582;&#1575;&#1605; &#1575;&#1604;&#1605;&#1591;&#1604;&#1608;&#1576;</span><strong>${order.totalRawOrdered}</strong></div><div class="metric"><span>&#1582;&#1585;&#1580; &#1605;&#1606; &#1575;&#1604;&#1606;&#1587;&#1610;&#1580; &#1573;&#1604;&#1609; &#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</span><strong>${order.totalRawReceived}</strong></div><div class="metric"><span>&#1582;&#1575;&#1605; &#1605;&#1578;&#1575;&#1581; &#1576;&#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</span><strong>${order.rawAtDyehouseAvailable}</strong></div><div class="metric"><span>&#1583;&#1582;&#1604; &#1575;&#1604;&#1605;&#1582;&#1586;&#1606; &#1605;&#1606; &#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</span><strong>${order.totalFinishedReceived}</strong></div><div class="metric emphasis"><span>&#1585;&#1589;&#1610;&#1583; &#1575;&#1604;&#1605;&#1582;&#1586;&#1606;</span><strong>${order.warehouseBalance}</strong></div><div class="metric"><span>&#1578;&#1605; &#1578;&#1587;&#1604;&#1610;&#1605;&#1607; &#1604;&#1604;&#1593;&#1605;&#1610;&#1604;</span><strong>${order.totalDeliveredToCustomer}</strong></div><div class="metric"><span>مرتجع خام للنسيج</span><strong>${order.totalRawReturnedToWeaving}</strong></div><div class="metric"><span>هالك تقديري</span><strong>${order.expectedWasteQuantity} (${order.expectedWastePercent}%)</strong></div><div class="metric"><span>هالك فعلي</span><strong>${order.totalWaste} (${formatNumber(order.totalWastePercent || 0, 1)}%)</strong></div></div>${order.widthMode === 'multiple' ? `<div class="subsection"><div class="subsection-head"><h3>توزيع العروض</h3></div>${order.widthDistributionMatches ? '' : `<div class="warning">تنبيه: مجموع العروض لا يطابق إجمالي الطلب</div>`}<div class="table-wrap"><table class="allocation-table"><thead><tr><th>البوصة</th><th>العرض</th><th>الكمية</th></tr></thead><tbody>${order.widthLines.map((item)=>`<tr><td>${item.inch}</td><td>${item.width}</td><td>${item.quantity}</td></tr>`).join('')}</tbody></table></div></div>` : ''}<div class="subsection"><div class="subsection-head"><div><h3>&#1582;&#1591;&#1577; &#1578;&#1608;&#1586;&#1610;&#1593; &#1575;&#1604;&#1571;&#1604;&#1608;&#1575;&#1606;</h3><p class="eyebrow">${order.totalAllocated} / ${order.totalRawReceived} &#1603;&#1580;&#1605; &#1605;&#1606; &#1575;&#1604;&#1582;&#1575;&#1605; &#1575;&#1604;&#1605;&#1587;&#1578;&#1604;&#1605;</p></div><button class="mini-btn" id="addAllocationBtn">+ &#1573;&#1590;&#1575;&#1601;&#1577; &#1604;&#1608;&#1606;</button></div><div class="allocation-bar"><div class="allocation-fill" style="width:${allocationPercent}%"></div></div>${order.allocationExceedsRaw ? `<div class="warning">&#1603;&#1605;&#1610;&#1577; &#1575;&#1604;&#1589;&#1576;&#1575;&#1594;&#1577; &#1575;&#1604;&#1605;&#1582;&#1591;&#1591;&#1577; &#1571;&#1603;&#1576;&#1585; &#1605;&#1606; &#1603;&#1605;&#1610;&#1577; &#1575;&#1604;&#1582;&#1575;&#1605; &#1575;&#1604;&#1605;&#1578;&#1575;&#1581;&#1577;</div>` : ''}<div class="table-wrap"><table class="allocation-table"><thead><tr><th>&#1575;&#1604;&#1604;&#1608;&#1606;</th><th>&#1575;&#1604;&#1605;&#1582;&#1591;&#1591;</th><th>&#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</th><th>&#1575;&#1604;&#1593;&#1585;&#1590;</th><th>&#1575;&#1604;&#1608;&#1586;&#1606; &#1605;&#1580;&#1607;&#1586;</th>${order.accessoryLines.length ? `<th>${accessoryTypesLabel(order)}</th>` : ''}<th>&#1578;&#1605; &#1578;&#1588;&#1594;&#1610;&#1604;&#1607;</th><th>&#1583;&#1582;&#1604; &#1575;&#1604;&#1605;&#1582;&#1586;&#1606;</th><th>هالك تقديري</th><th>هالك فعلي</th><th>إجراء</th></tr></thead><tbody>${order.allocations.map((allocation)=>`<tr><td>${allocation.color}</td><td>${allocation.plannedQuantity}</td><td>${allocation.dyehouse}</td><td>${allocation.targetFinishedWidth}</td><td>${allocation.targetFinishedWeight}</td>${order.accessoryLines.length ? `<td>${allocation.accessoryQuantity}</td>` : ''}<td>${allocation.sentToDyehouse}</td><td>${allocation.finishedReceived}</td><td>${allocation.expectedWasteQuantity || 0} (${allocation.expectedWastePercent || 0}%)</td><td>${allocation.wasteQuantity} (${formatNumber(allocation.wastePercent || 0, 1)}%)</td><td><div class="batch-actions"><button class="mini-btn" data-edit-allocation="${allocation.id}">&#1578;&#1593;&#1583;&#1610;&#1604;</button><button class="mini-btn" data-transfer-allocation="${allocation.id}">&#1606;&#1602;&#1604; &#1605;&#1589;&#1576;&#1594;&#1577;</button>${canDeleteRecords() ? `<button class="mini-btn danger" data-delete-allocation="${allocation.id}">&#1581;&#1584;&#1601;</button>` : ''}</div></td></tr>`).join('')}</tbody></table></div></div>${inventorySection}<div class="batch-grid compact"><div class="batch-box"><h3>خروج خام</h3><form class="batch-form" data-form="raw"><select name="movementKind" class="full"><option value="out">خروج خام للمصبغة</option><option value="return">ارتجاع خام للنسيج</option></select><input name="date" type="date" required>${order.widthMode === 'multiple' ? `<select name="widthLineId" data-out-only><option value="">اختر العرض عند خروج الخام</option>${order.widthLines.map((item)=>`<option value="${item.id}">بوصة ${item.inch} - عرض ${item.width} - كمية ${item.quantity}</option>`).join('')}</select>` : ''}<select name="allocationId" data-return-only class="field-hidden"><option value="">اختر اللون / المصبغة للمرتجع</option>${order.allocations.map((allocation)=>`<option value="${allocation.id}">${allocationOptionLabel(order, allocation)}</option>`).join('')}</select><input name="quantity" type="number" step="0.01" placeholder="الكمية" required><input name="supplier" placeholder="مصدر النسيج" value="${order.weavingSource}"><input name="noteNumber" placeholder="رقم إذن"><input class="full" name="notes" placeholder="ملاحظات"><label class="full batch-file-label" data-out-only><span>صورة إذن الخام</span><input name="sourceDocumentFile" type="file" accept="image/*"></label><button class="mini-btn full">إضافة حركة</button></form><div class="batch-list">${rawItems}</div></div>${order.accessoryLines.length ? `<div class="batch-box"><h3>خروج إكسسوار</h3><form class="batch-form" data-form="accessory"><input name="date" type="date" required>${accessoryTypeSelectHtml(order)}<input name="quantity" type="number" step="0.01" placeholder="الكمية" required><input name="noteNumber" placeholder="رقم إذن"><input class="full" name="notes" placeholder="ملاحظات"><button class="mini-btn full">إضافة خروج</button></form><div class="batch-list">${accessoryItems}</div></div><div class="batch-box"><h3>استلام إكسسوار</h3><form class="batch-form" data-form="accessoryReceived"><input name="date" type="date" required>${accessoryTypeSelectHtml(order)}<select name="allocationId" required><option value="">اختر اللون</option>${order.allocations.map((allocation)=>`<option value="${allocation.id}">${allocationColorLabel(order, allocation)}</option>`).join('')}</select><input name="quantity" type="number" step="0.01" placeholder="الكمية المستلمة" required><input name="noteNumber" placeholder="رقم إذن"><input class="full" name="notes" placeholder="ملاحظات"><button class="mini-btn full">إضافة استلام</button></form><div class="batch-list">${accessoryReceivedItems}</div></div>` : ''}<div class="batch-box"><h3>استلام مجهز</h3><form class="batch-form" data-form="production"><select name="allocationId"><option value="raw">&#1575;&#1582;&#1578;&#1585; &#1575;&#1604;&#1604;&#1608;&#1606; / &#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</option>${order.allocations.map((allocation)=>`<option value="${allocation.id}">${allocationOptionLabel(order, allocation)}</option>`).join('')}</select><input name="date" type="date" required><input name="quantity" type="number" step="0.01" placeholder="&#1575;&#1604;&#1603;&#1605;&#1610;&#1577; &#1575;&#1604;&#1605;&#1587;&#1578;&#1604;&#1605;&#1577;" required><input name="noteNumber" placeholder="&#1585;&#1602;&#1605; &#1573;&#1584;&#1606; &#1575;&#1604;&#1575;&#1587;&#1578;&#1604;&#1575;&#1605;"><input class="full" name="notes" placeholder="&#1605;&#1604;&#1575;&#1581;&#1592;&#1575;&#1578;"><button class="mini-btn full">&#1573;&#1590;&#1575;&#1601;&#1577; &#1575;&#1587;&#1578;&#1604;&#1575;&#1605;</button></form><div class="batch-list">${productionItems}</div></div><div class="batch-box"><h3>تسليم عميل</h3><form class="batch-form" data-form="customer"><select name="movementKind" class="full"><option value="cloth">تسليم قماش</option>${order.accessoryLines.length ? '<option value="accessory">تسليم إكسسوار</option>' : ''}</select><select name="allocationId">${order.allocations.map((allocation)=>`<option value="${allocation.id}">${allocationColorLabel(order, allocation)}</option>`).join('')}</select><input name="date" type="date" required>${order.accessoryLines.length ? `<span data-accessory-only class="field-hidden">${accessoryTypeSelectHtml(order)}</span>` : ''}<input name="quantity" type="number" step="0.01" placeholder="&#1575;&#1604;&#1603;&#1605;&#1610;&#1577;" required><input class="full" name="notes" placeholder="&#1605;&#1604;&#1575;&#1581;&#1592;&#1575;&#1578;"><button class="mini-btn full">&#1573;&#1590;&#1575;&#1601;&#1577; &#1581;&#1585;&#1603;&#1577;</button></form><div class="batch-list">${customerItems}</div></div><div class="batch-box"><h3>&#1578;&#1581;&#1608;&#1610;&#1604;&#1575;&#1578; &#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</h3><p class="eyebrow">&#1578;&#1587;&#1580;&#1610;&#1604; &#1571;&#1610; &#1606;&#1602;&#1604; &#1605;&#1606; &#1605;&#1589;&#1576;&#1594;&#1577; &#1604;&#1571;&#1582;&#1585;&#1609; &#1576;&#1583;&#1608;&#1606; &#1601;&#1602;&#1583;&#1575;&#1606; &#1575;&#1604;&#1578;&#1575;&#1585;&#1610;&#1582;.</p><div class="batch-list">${transferItems}</div></div></div>`;
  const hasMixedClothAndAccessory = order.accessoryLines.length > 0 && Number(order.totalRawOrdered || order.totalRawQuantity || 0) > 0;
  refs.orderDetailsPanel.querySelector('.section-head')?.insertAdjacentHTML('afterend', order360Html(order));
  if (hasMixedClothAndAccessory) {
    const combinedInventorySectionHtml = `<div class="subsection stock-flow-section"><div class="subsection-head"><div><h3>رصيد القماش والإكسسوار</h3><p class="eyebrow">متابعة موحدة: القماش ومعه الإكسسوار المرتبط بكل لون.</p></div></div><div class="table-wrap"><table class="allocation-table stock-flow-table"><thead><tr><th>اللون</th><th>مرسل للمصبغة</th><th>دخل المخزن</th><th>تسليم العميل</th><th>الرصيد الحالي</th></tr></thead><tbody>${stockFlowRows}</tbody></table></div></div>`;
    const batchGrid = refs.orderDetailsPanel.querySelector('.batch-grid.compact');
    const oldInventorySection = batchGrid?.previousElementSibling;
    if (oldInventorySection?.classList?.contains('subsection')) {
      oldInventorySection.replaceWith(document.createRange().createContextualFragment(combinedInventorySectionHtml));
    }
  }
  if (Number(order.gluingBalance || 0) > 0 || Number(order.gluedProductBalance || 0) > 0) {
    refs.orderDetailsPanel.querySelector('.summary-grid')?.insertAdjacentHTML('beforeend', `<div class="metric"><span>واقف في دمج الخامات</span><strong>${formatNumber(order.gluingBalance || 0)}</strong></div><div class="metric"><span>منتج مدمج جاهز للتسليم</span><strong>${formatNumber(order.gluedProductBalance || 0)}</strong></div>`);
  }
  consolidateOrderDetailView(order);
  refs.orderDetailsPanel.insertAdjacentHTML('beforeend', renderReportSendStatus(order));
  organizeOrderDetailsTabs();
  refs.orderDetailsPanel.querySelectorAll('form[data-form="raw"]').forEach((form) => {
    ensureRawDispatchSelect(form, order);
    updateRawMovementVisibility(form);
  });
  refs.orderDetailsPanel.querySelectorAll('form[data-form="customer"] select[name="movementKind"]').forEach((select) => {
    if (![...select.options].some((option)=>option.value === 'clothReturn')) {
      select.options.add(new Option('مرتجع قماش من العميل', 'clothReturn'), 1);
    }
    if (order.accessoryLines.length && ![...select.options].some((option)=>option.value === 'accessoryReturn')) {
      select.options.add(new Option('مرتجع إكسسوار من العميل', 'accessoryReturn'));
    }
  });
  refs.orderDetailsPanel.querySelectorAll('form[data-form="customer"]').forEach(updateCustomerDeliveryFields);
  installBulkEntryButtons();
  repairOrderDetailsArabic(order);
  decorateOrderFocusHeader(order);
  applyPermissionVisibility();
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
  resetGroupedOrderRows();
  refs.kiloPrice.value = order.kiloPrice || '';
  setPaymentFields(refs.paymentMode, refs.paymentDetails, refs.paymentTerms, order.paymentTerms || '');
  refs.dyehouse.value = order.dyehouse || '';
  refs.weavingSource.value = order.weavingSource || '';
  refs.accessoryType.value = order.accessoryType || '';
  refs.accessoryPercent.value = order.accessoryPercent || 0;
  renderAccessoryLinesEditor(orderAccessoryConfig(order));
  refs.orderNotes.value = order.notes || '';
  resetGroupedOrderRows();
}
async function addOrder(event) {
  event.preventDefault();
  const widthLines = refs.widthMode.value === 'multiple' ? readWidthLinesFromEditor() : [];
  if (refs.widthMode.value === 'multiple' && widthLines.length === 0) { alert('أضف عرضًا واحدًا على الأقل عند اختيار أكثر من عرض.'); return; }
  const currentOrder = editingOrderId ? orders.find((order)=>order.id === editingOrderId) : null;
  const accessoryLines = readAccessoryLinesFromEditor();
  const firstAccessory = accessoryLines[0] || {};
  const paymentTerms = composePaymentTerms(refs.paymentMode?.value, refs.paymentDetails?.value);
  if (refs.paymentTerms) refs.paymentTerms.value = paymentTerms;
  const payload = { pricingId: currentOrder?.pricingId || pendingConvertedPricingId || '', orderNumber:refs.orderNumber.value, productCode:buildItemCode(refs.orderNumber.value), customer:refs.customer.value, orderDate:refs.orderDate.value, fabricType:refs.fabricType.value, totalRawQuantity:+refs.totalRawQuantity.value, expectedWastePercent:+refs.expectedWastePercent.value || 0, widthMode:refs.widthMode.value, inchWidth:refs.inchWidth.value, widthLines, kiloPrice:+refs.kiloPrice.value, rawCost:orderRawCost({ ...currentOrder, orderNumber:refs.orderNumber.value }), paymentTerms, accessoryType:firstAccessory.type || refs.accessoryType.value, accessoryPercent:+(firstAccessory.percent ?? refs.accessoryPercent.value) || 0, accessoryLines, dyehouse:refs.dyehouse.value, weavingSource:refs.weavingSource.value, notes:refs.orderNotes.value };
  const groupedItems = !editingOrderId && refs.widthMode.value !== 'multiple' ? readGroupedOrderItems() : [];
  const hasGroupedOrderItems = groupedItems.length > 1;
  if (hasGroupedOrderItems && payload.pricingId) { alert('الطلب المحول من تسعيرة يحفظ كصنف واحد. احفظ الأصناف الإضافية كطلب مجمع مستقل.'); return; }
  if (hasGroupedOrderItems) {
    const incomplete = groupedItems.find((item)=>!item.fabricType || !(item.totalRawQuantity > 0));
    if (incomplete) { alert('راجع أصناف الطلب المجمع: كل صنف يجب أن يحتوي على اسم صنف وكمية.'); return; }
  }
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
    if (!(await verifyOrderPersisted(editingOrderId, payload))) {
      await rollbackAfterBackendWriteFailure('تم إرسال تعديل الطلب لكن بيانات الإكسسوارات لم ترجع من قاعدة البيانات. لم يتم اعتماد التعديل.');
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
    if (hasGroupedOrderItems) {
      const groupedOrders = groupedItems.map((item)=> {
        const groupedPayload = { ...payload, pricingId:'', fabricType:item.fabricType, totalRawQuantity:item.totalRawQuantity, expectedWastePercent:item.expectedWastePercent || payload.expectedWastePercent, inchWidth:item.inchWidth || payload.inchWidth, kiloPrice:item.kiloPrice || payload.kiloPrice, widthMode:'single', widthLines:[], productCode:buildItemCode(payload.orderNumber) };
        return { id:uid(), status:'pending', ...groupedPayload };
      });
      let savedGroupedOrders = null;
      try {
        savedGroupedOrders = await postBackendStrict('/orders/bulk', { orders: groupedOrders.map((order)=>orderToApi(order, backendCustomer)) });
      } catch (error) {
        alert(error.message || 'تعذر حفظ الطلب المجمع.');
        return;
      }
      if (backendSaveRequired && (!Array.isArray(savedGroupedOrders) || savedGroupedOrders.length !== groupedOrders.length)) {
        await rollbackAfterBackendWriteFailure('تعذر حفظ الطلب المجمع بالكامل في قاعدة البيانات. لم يتم اعتماد التسجيل.');
        return;
      }
      selectedOrderId = savedGroupedOrders[0]?.id || groupedOrders[0]?.id || null;
      editingOrderId = null;
      pendingConvertedPricingId = null;
      await loadBackendData();
      refs.orderDialog.close();
      return;
    }
    const newOrder = { id:uid(), status:'pending', ...payload };
    const savedOrder = await postBackend('/orders', orderToApi(newOrder, backendCustomer));
    if (backendSaveRequired && !savedOrder) {
      await rollbackAfterBackendWriteFailure('تعذر حفظ الطلب الجديد في قاعدة البيانات. لم يتم اعتماد الطلب.');
      return;
    }
    if (!(await verifyOrderPersisted(savedOrder.id || newOrder.id, payload))) {
      await rollbackAfterBackendWriteFailure('تم إرسال الطلب لكن بيانات الإكسسوارات لم ترجع من قاعدة البيانات. لم يتم اعتماد الطلب.');
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
      if (rawDispatchOptions(currentOrder).length && !data.widthLineId) { alert('اختر العرض / البند المرتبط قبل تسجيل خروج الخام.'); return; }
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
  if (type === 'gluing') {
    data.movement = ['return', 'received', 'customer'].includes(data.movementKind) ? data.movementKind : 'sent';
    if (data.movement === 'sent' || data.movement === 'return') {
      if (!data.allocationId) { alert('اختر اللون / الخامة المصدر قبل تسجيل حركة الدمج.'); return; }
      if (!String(data.noteNumber || '').trim()) { alert('اكتب رقم عملية الدمج حتى تظهر الخامة داخل قائمة دمج الخامات المستقلة.'); return; }
      const allocation = calculateAllocation(allocations.find((item)=>item.id===data.allocationId));
      const delivered = sum(customerBatches.filter((batch)=>batch.allocationId===data.allocationId));
      const sentToGluing = sum(gluingBatches.filter((batch)=>batch.allocationId===data.allocationId && batch.movement === 'sent'));
      const returnedFromGluing = sum(gluingBatches.filter((batch)=>batch.allocationId===data.allocationId && batch.movement === 'return'));
      if (data.movement === 'sent') {
        const available = Math.max(Number(allocation.finishedReceived || 0) - delivered - sentToGluing + returnedFromGluing, 0);
        if (data.quantity > available) data.notes = [data.notes, 'تنبيه: كمية الدمج أكبر من رصيد المخزن المتاح'].filter(Boolean).join(' - ');
      } else {
        const availableAtGluing = Math.max(sentToGluing - returnedFromGluing, 0);
        if (data.quantity > availableAtGluing) data.notes = [data.notes, 'تنبيه: المرتجع أكبر من رصيد الخامة في الدمج'].filter(Boolean).join(' - ');
      }
    } else {
      delete data.allocationId;
      if (!data.outputName) { alert('اكتب اسم المنتج الناتج.'); return; }
      if (data.movement === 'customer' && !data.customerName) { alert('اكتب اسم العميل قبل تسليم المنتج الناتج.'); return; }
      if (data.movement === 'customer') {
        const received = sum(gluingBatches.filter((batch)=>batch.orderId===selectedOrderId && batch.movement === 'received' && normalizeForCompare(batch.outputName) === normalizeForCompare(data.outputName)));
        const delivered = sum(gluingBatches.filter((batch)=>batch.orderId===selectedOrderId && batch.movement === 'customer' && normalizeForCompare(batch.outputName) === normalizeForCompare(data.outputName)));
        if (data.quantity > Math.max(received - delivered, 0)) data.notes = [data.notes, 'تنبيه: كمية التسليم أكبر من رصيد المنتج الناتج'].filter(Boolean).join(' - ');
      }
    }
    backendResult = await postBackend('/batches/gluing', batchToApi(data));
  }
  if (type === 'finished') {
    const allocation = calculateAllocation(allocations.find((item)=>item.id===data.allocationId));
    if (data.quantity > allocation.remainingAtDyehouse) { data.notes = [data.notes, 'تنبيه: الكمية المستلمة أكبر من المتبقي داخل المصبغة'].filter(Boolean).join(' - '); }
    data.finishedWidth = +data.finishedWidth; data.finishedWeight = +data.finishedWeight;
    backendResult = await postBackend('/batches/finished', batchToApi(data));
  }
  if (type === 'customer') {
    if (data.movementKind === 'accessory' || data.movementKind === 'accessoryReturn') {
      if (!data.accessoryType) { alert('اختر نوع الإكسسوار أولًا.'); return; }
      if (!data.allocationId) { alert('اختر اللون المرتبط بتسليم الإكسسوار.'); return; }
      const isAccessoryReturn = data.movementKind === 'accessoryReturn';
      data.movement = 'customer';
      const receivedAccessory = sum(accessoryBatches.filter((batch)=>batch.allocationId===data.allocationId && batch.movement==='received' && batch.accessoryType===data.accessoryType));
      const deliveredAccessory = sum(accessoryBatches.filter((batch)=>batch.allocationId===data.allocationId && batch.movement==='customer' && batch.accessoryType===data.accessoryType));
      const availableAccessory = Math.max(receivedAccessory - deliveredAccessory, 0);
      if (isAccessoryReturn) {
        const returnQuantity = Math.abs(Number(data.quantity || 0));
        if (returnQuantity > Math.max(deliveredAccessory, 0)) data.notes = [data.notes, 'تنبيه: كمية مرتجع الإكسسوار أكبر من صافي المسلم للعميل'].filter(Boolean).join(' - ');
        data.quantity = -returnQuantity;
        data.notes = [data.notes, 'مرتجع إكسسوار من العميل'].filter(Boolean).join(' - ');
      } else if (data.quantity > availableAccessory) { data.notes = [data.notes, 'تنبيه: كمية الإكسسوار المسلمة أكبر من الرصيد المتاح'].filter(Boolean).join(' - '); }
      backendResult = await postBackend('/batches/accessory', batchToApi(data));
    } else {
      const isCustomerReturn = data.movementKind === 'clothReturn';
      const allocation = calculateAllocation(allocations.find((item)=>item.id===data.allocationId));
      const alreadyDelivered = sum(customerBatches.filter((batch)=>batch.allocationId===data.allocationId));
      const warehouseAvailable = Math.max(allocation.finishedReceived - alreadyDelivered, 0);
      if (isCustomerReturn) {
        const returnQuantity = Math.abs(Number(data.quantity || 0));
        if (returnQuantity > Math.max(alreadyDelivered, 0)) data.notes = [data.notes, 'تنبيه: كمية المرتجع أكبر من صافي المسلم للعميل'].filter(Boolean).join(' - ');
        data.quantity = -returnQuantity;
        data.notes = [data.notes, 'مرتجع من العميل'].filter(Boolean).join(' - ');
      } else if (data.quantity > warehouseAvailable) { data.notes = [data.notes, 'تنبيه: كمية التسليم أكبر من رصيد المخزن المتاح'].filter(Boolean).join(' - '); }
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

function defaultBulkMovementForForm(formType, form = null) {
  if (formType === 'raw') return 'rawOut';
  if (formType === 'production') return 'finished';
  if (formType === 'customer') return form?.elements?.movementKind?.value === 'accessory' ? 'accessoryCustomer' : 'customer';
  if (formType === 'accessoryReceived') return 'accessoryReceived';
  if (formType === 'accessory') return 'accessorySent';
  return '';
}

function openBulkBatchDialog(form) {
  const order = calculateOrder(orders.find((item)=>item.id===selectedOrderId));
  if (!order) return;
  const formType = form?.dataset.form || '';
  const movement = defaultBulkMovementForForm(formType, form);
  if (!movement) return;
  const date = form?.elements.date?.value || new Date().toISOString().slice(0, 10);
  const noteNumber = form?.elements.noteNumber?.value || '';
  const notes = form?.elements.notes?.value || '';
  const accessoryType = form?.elements.accessoryType?.value || order.accessoryLines?.[0]?.type || '';
  const title = {
    rawOut: 'خروج خام جماعي للمصبغة',
    finished: 'استلام مجهز جماعي',
    customer: 'تسليم قماش جماعي',
    accessoryReceived: 'استلام إكسسوار جماعي',
    accessorySent: 'خروج إكسسوار جماعي',
    accessoryCustomer: 'تسليم إكسسوار جماعي للعميل',
  }[movement] || 'إدخال جماعي';
  refs.documentTitle.textContent = title;
  refs.documentBody.dataset.documentType = 'bulk-batches';
  refs.documentBody.innerHTML = `<div class="document-sheet bulk-entry-sheet" data-bulk-movement="${movement}">
    <div class="subsection-head"><div><h2>${title}</h2><p class="muted">اكتب الكمية أمام كل لون، واترك اللون الفاضي بدون حفظ.</p></div></div>
    <div class="summary-grid">
      <label><span>التاريخ</span><input type="date" data-bulk-date value="${escapeHtml(date)}"></label>
      <label><span>رقم الإذن</span><input data-bulk-note-number value="${escapeHtml(noteNumber)}"></label>
      ${movement.startsWith('accessory') ? `<label><span>نوع الإكسسوار</span>${accessoryTypeSelectHtml(order).replace('name="accessoryType"', 'data-bulk-accessory-type')}</label>` : ''}
      <label class="full-row"><span>ملاحظات</span><input data-bulk-notes value="${escapeHtml(notes)}"></label>
    </div>
    <table class="bulk-entry-table"><thead><tr><th>اللون</th><th>المصبغة</th><th>العرض</th><th>المتاح</th><th>الكمية</th></tr></thead><tbody>
      ${order.allocations.map((allocation)=>{
        const available = movement === 'rawOut'
          ? Math.max(Number(allocation.plannedQuantity || 0) - Number(allocation.sentToDyehouse || 0), 0)
          : movement === 'finished'
          ? allocation.remainingAtDyehouse
          : movement === 'customer'
            ? allocationAvailableToCustomer(allocation)
            : '';
        return `<tr data-bulk-allocation="${escapeHtml(allocation.id)}"><td>${escapeHtml(allocation.color || '-')}</td><td>${escapeHtml(allocation.dyehouse || '-')}</td><td>${escapeHtml(allocationWidthSuffix(order, allocation).replace(/^\s*\/\s*/, '') || '-')}</td><td>${available === '' ? '-' : formatNumber(available)}</td><td><input type="number" step="0.01" data-bulk-quantity placeholder="0"></td></tr>`;
      }).join('')}
    </tbody></table>
    <div class="dialog-actions"><button class="primary-btn" type="button" data-save-bulk-batches>حفظ الإدخال الجماعي</button></div>
  </div>`;
  const accessorySelect = refs.documentBody.querySelector('[data-bulk-accessory-type]');
  if (accessorySelect && accessoryType) accessorySelect.value = accessoryType;
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}

function bulkBatchItemsFromDialog() {
  const body = refs.documentBody;
  const movement = body.querySelector('[data-bulk-movement]')?.dataset.bulkMovement || body.dataset.bulkMovement || body.querySelector('.bulk-entry-sheet')?.dataset.bulkMovement || '';
  const date = body.querySelector('[data-bulk-date]')?.value || new Date().toISOString().slice(0, 10);
  const noteNumber = body.querySelector('[data-bulk-note-number]')?.value || '';
  const notes = body.querySelector('[data-bulk-notes]')?.value || '';
  const currentOrder = calculateOrder(orders.find((item)=>item.id===selectedOrderId));
  const accessoryType = body.querySelector('[data-bulk-accessory-type]')?.value || currentOrder?.accessoryLines?.[0]?.type || 'إكسسوار';
  const rows = [...body.querySelectorAll('[data-bulk-allocation]')];
  return rows.map((row) => {
    const quantity = Number(row.querySelector('[data-bulk-quantity]')?.value || 0);
    if (!quantity) return null;
    const allocationId = row.dataset.bulkAllocation;
    const allocation = allocations.find((item)=>item.id === allocationId) || {};
    if (movement === 'rawOut') return { type:'dyehouse', data: batchToApi({ id:uid(), orderId:selectedOrderId, allocationId, date, quantity, noteNumber, notes, dyehouse:allocation.dyehouse || '' }) };
    if (movement === 'finished') return { type:'finished', data: batchToApi({ id:uid(), orderId:selectedOrderId, allocationId, date, quantity, noteNumber, notes }) };
    if (movement === 'customer') return { type:'customer', data: batchToApi({ id:uid(), orderId:selectedOrderId, allocationId, date, quantity, noteNumber, notes }) };
    if (movement === 'accessoryReceived') return { type:'accessory', data: batchToApi({ id:uid(), orderId:selectedOrderId, allocationId, date, quantity, noteNumber, notes, accessoryType, movement:'received' }) };
    if (movement === 'accessorySent') return { type:'accessory', data: batchToApi({ id:uid(), orderId:selectedOrderId, allocationId, date, quantity, noteNumber, notes, accessoryType, movement:'sent' }) };
    if (movement === 'accessoryCustomer') return { type:'accessory', data: batchToApi({ id:uid(), orderId:selectedOrderId, allocationId, date, quantity, noteNumber, notes, accessoryType, movement:'customer' }) };
    return null;
  }).filter(Boolean);
}

async function saveBulkBatchesFromDialog() {
  const items = bulkBatchItemsFromDialog();
  if (!items.length) { alert('اكتب كمية على لون واحد على الأقل.'); return; }
  if (!(await ensureBackendForWrite('تعذر الاتصال بقاعدة البيانات. لم يتم حفظ الإدخال الجماعي.'))) return;
  let result = null;
  try {
    result = await postBackendStrict('/batches/bulk', { items });
  } catch (error) {
    const message = `تعذر حفظ الإدخال الجماعي في قاعدة البيانات. السبب: ${error.message || error}`;
    await rollbackAfterBackendWriteFailure(message);
    alert(message);
    return;
  }
  if (!result?.ok) {
    await rollbackAfterBackendWriteFailure('تعذر حفظ الإدخال الجماعي في قاعدة البيانات. لم يتم اعتماد أي حركة.');
    return;
  }
  refs.documentDialog.close();
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
          ...gluingBatches,
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
  const collection = type === 'raw' ? rawBatches : type === 'accessory' ? accessoryBatches : type === 'transfer' ? dyehouseTransfers : type === 'gluing' ? gluingBatches : type === 'rawReturn' ? rawReturns : type === 'production' ? productionBatches : type === 'customer' ? customerBatches : finishedBatches;
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
  if (type === 'gluing') { updatedBatch.movement = prompt('نوع الحركة sent/received/customer', updatedBatch.movement || 'sent') || updatedBatch.movement; updatedBatch.partnerFabric = prompt('مصدر الدمج / العملية', updatedBatch.partnerFabric || '') || ''; updatedBatch.outputName = prompt('اسم المنتج الناتج', updatedBatch.outputName || '') || ''; updatedBatch.customerName = prompt('العميل', updatedBatch.customerName || '') || ''; updatedBatch.noteNumber = prompt('رقم الإذن', updatedBatch.noteNumber || '') || ''; updatedBatch.notes = prompt('ملاحظات', updatedBatch.notes || '') || ''; }
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
  if (Number(order.gluingBalance || 0) > 0) return 'واقف في دمج الخامات';
  if (Number(order.gluedProductBalance || 0) > 0) return 'منتج مدمج جاهز للتسليم';
  if (order.rawAtDyehouseAvailable > 0 || order.remainingAtDyehouse > 0) return 'تحت التشغيل بالمصبغة';
  if (order.warehouseBalance > 0 && order.totalDeliveredToCustomer < order.totalFinishedReceived) return 'بالمخزن';
  if (order.totalDeliveredToCustomer < order.totalAllocated) return 'تسليم العميل';
  return 'مكتمل';
}
function cleanOperationalStage(stage) {
  const text = String(stage || '').trim();
  return isLegacyRecoveredText(text) ? 'مراجعة' : (text || '-');
}
function firstDate(items) {
  return (items || []).map((item)=>item.date || item.orderDate || item.batchDate || '').filter(Boolean).sort()[0] || '';
}
function orderStageInfo(order) {
  const allocationIds = (order.allocations || []).map((allocation)=>allocation.id);
  const rawDate = firstDate(rawBatches.filter((batch)=>batch.orderId === order.id));
  const gluingDate = firstDate(gluingBatches.filter((batch)=>batch.orderId === order.id));
  const finishedDate = firstDate(productionBatches.filter((batch)=>allocationIds.includes(batch.allocationId)));
  const customerDate = firstDate(customerBatches.filter((batch)=>allocationIds.includes(batch.allocationId)));
  let key = 'completed';
  let label = 'مكتمل';
  let startDate = customerDate || finishedDate || rawDate || order.orderDate || '';
  let reason = 'اكتملت دورة التشغيل.';
  if (order.operationClosed || order.status === 'closed') {
    key = 'closed'; label = 'مغلق تشغيليًا'; reason = 'تم إغلاق دورة التشغيل.';
  } else if (Number(order.totalRawReceived || 0) === 0 && Number(order.totalAllocated || 0) > 0) {
    key = 'weaving'; label = 'واقف في النسيج'; startDate = order.orderDate || ''; reason = 'تم توزيع الألوان ولم يتم خروج الخام للمصبغة.';
  } else if (Number(order.totalRawReceived || 0) === 0) {
    key = 'weaving'; label = 'واقف في النسيج'; startDate = order.orderDate || ''; reason = 'لم يتم تسجيل خروج خام من النسيج للمصبغة.';
  } else if (Number(order.totalAllocated || 0) === 0) {
    key = 'color-planning'; label = 'بانتظار توزيع الألوان'; startDate = order.orderDate || rawDate || ''; reason = 'الخام موجود لكن لم يتم توزيع الألوان.';
  } else if (Number(order.gluingBalance || 0) > 0) {
    key = 'gluing'; label = 'واقف في دمج الخامات'; startDate = gluingDate || rawDate || order.orderDate || ''; reason = 'خرج خام للدمج ولم يكتمل استلام المنتج الناتج.';
  } else if (Number(order.gluedProductBalance || 0) > 0) {
    key = 'glued-ready'; label = 'منتج مدمج جاهز للتسليم'; startDate = gluingDate || finishedDate || order.orderDate || ''; reason = 'تم استلام منتج مدمج ولم يكتمل تسليمه للعميل.';
  } else if (Number(order.rawAtDyehouseAvailable || 0) > 0 || Number(order.remainingAtDyehouse || 0) > 0) {
    key = 'dyehouse'; label = 'واقف في المصبغة'; startDate = rawDate || order.orderDate || ''; reason = 'تم تسليم خام للمصبغة ولم يكتمل استلام المجهز.';
  } else if (Number(order.warehouseBalance || 0) > 0 && Number(order.totalDeliveredToCustomer || 0) < Number(order.totalFinishedReceived || 0)) {
    key = 'warehouse'; label = 'واقف في المخزن'; startDate = finishedDate || order.orderDate || ''; reason = 'دخل مجهز إلى المخزن ولم يكتمل تسليمه للعميل.';
  } else if (Number(order.totalDeliveredToCustomer || 0) < Number(order.totalAllocated || 0)) {
    key = 'delivery'; label = 'تسليم العميل'; startDate = finishedDate || order.orderDate || ''; reason = 'التسليم للعميل لم يكتمل.';
  }
  return { key, label, startDate, days:daysSince(startDate), reason };
}
function orderFilterLabel(value) {
  const labels = { all:'كل الطلبات المفتوحة', pending:'بانتظار الاستلام', 'in-progress':'قيد التشغيل', completed:'مكتمل', closed:'مغلق تشغيليًا', 'stage:weaving':'واقف في النسيج', 'stage:color-planning':'بانتظار توزيع الألوان', 'stage:gluing':'واقف في دمج الخامات', 'stage:glued-ready':'منتج مدمج جاهز للتسليم', 'stage:dyehouse':'واقف في المصبغة', 'stage:warehouse':'واقف في المخزن' };
  return labels[value] || statusLabel(value) || value || '-';
}
function ensureStageFilterOptions() {
  const select = refs.orderStatusFilter;
  if (!select) return;
  [...select.options].filter((option)=>option.value === 'stage:ready-to-dyehouse').forEach((option)=>option.remove());
  [...select.options].filter((option)=>option.value === 'stage:delivery').forEach((option)=>option.remove());
  const before = [...select.options].find((item)=>item.value === 'stage:dyehouse');
  if (![...select.options].some((option)=>option.value === 'stage:gluing')) select.add(new Option('واقف في دمج الخامات', 'stage:gluing'), before || null);
  if (![...select.options].some((option)=>option.value === 'stage:glued-ready')) select.add(new Option('منتج مدمج جاهز للتسليم', 'stage:glued-ready'), before || null);
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
    gluingDate: dateRangeLabel(gluingBatches.filter((batch)=>batch.orderId===order.id)),
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
  return reportNumber(value, digits).toLocaleString('en-US', { maximumFractionDigits: digits });
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
({
  openManagementReportsMenu,
  showManagementReport,
  openManagementReport,
  activeOrderFilterSummary,
  openOrdersReport,
  openFilteredOrdersReport,
  openDyehouseBalancesReport,
} = window.createReportsUi({
  refs,
  documentHeader,
  documentFooter,
  withDocumentFooter,
  allOrders,
  filteredOrders,
  sum,
  reportNumber,
  reportFmt,
  formatNumber,
  escapeHtml,
  emptyRow,
  orderFilterLabel,
  cleanOperationalStage,
  getOperationalStage,
  stageStartDate,
  daysSince,
  orderMovementDates,
  calculateOrder,
  accessoryFlowQuantityForLine,
  accessoryLineName,
  accessoryPlannedQuantityForLine,
  reportOrderItemsCell,
  getOrders: () => orders,
  getAllocations: () => allocations,
  getRawBatches: () => rawBatches,
  getProductionBatches: () => productionBatches,
  getCustomerBatches: () => customerBatches,
  getRawReturns: () => rawReturns,
}));
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
function combinedOperationNotes(order) {
  const sections = [];
  if (String(order?.notes || '').trim()) sections.push(`ملاحظات الطلب: ${String(order.notes).trim()}`);
  const notes = order?.operationNotes && typeof order.operationNotes === 'object' && !Array.isArray(order.operationNotes) ? order.operationNotes : {};
  if (String(notes.weaving || '').trim()) sections.push(`ملاحظات النسيج: ${String(notes.weaving).trim()}`);
  Object.entries(notes)
    .filter(([key, value]) => key.startsWith('dyeing:') && String(value || '').trim())
    .forEach(([key, value]) => {
      const dyehouseName = key.slice('dyeing:'.length) || 'المصبغة';
      sections.push(`ملاحظات الصباغة - ${dyehouseName}: ${String(value).trim()}`);
    });
  return uniqueNonEmpty(sections).join('\n') || '-';
}
function reportOperationNotes(order) {
  if (order.reportNotesText !== undefined) return String(order.reportNotesText || '').trim() || '-';
  if (order.operationNoteText !== undefined) return String(order.operationNoteText || '').trim() || '-';
  return order.notes || '-';
}
({
  buildCompactFullReportDocument,
  buildDyeingOrderDocument,
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
}));

({
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
} = window.createDocumentsUi({
  refs,
  escapeHtml,
  formatNumber,
  roundNumber,
  calculateOrder,
  pricingForOrder,
  documentHeader,
  documentFooter,
  withDocumentFooter,
  combinedOperationNotes,
  dyehouseNamesForOrder,
  renderDyehouseDocumentPicker,
  promptOperationNotes,
  loadBackendData,
  buildQuotationDocument,
  buildWeavingOrderDocument,
  buildDyeingSummaryDocument,
  buildDyeingOrderDocument,
  buildWasteReportDocument,
  buildCompactFullReportDocument,
  buildLabSamplesDocument,
  buildStickersDocument,
  queueDocumentReport,
  reportToPngBlob,
  cleanCodePart,
  editPricing,
  convertPricingToOrder,
  openPricingForOrder,
  stopWhatsappSettingsAutoRefresh,
  isBackendAvailable: () => backendAvailable,
  getOrders: () => orders,
  getPricings: () => pricings,
  getRawBatches: () => rawBatches,
  getProductionBatches: () => productionBatches,
  getFinishedBatches: () => finishedBatches,
  getRawReturns: () => rawReturns,
  getDyehouseTransfers: () => dyehouseTransfers,
  getSelectedOrderId: () => selectedOrderId,
  getCurrentDocumentType: () => currentDocumentType,
  setCurrentDocumentType: (value) => { currentDocumentType = value; },
  getReportTypeLabels: () => reportTypeLabels,
}));


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

function renderAll() { ensureRuntimeCollections(); renderPricings(); renderOrderFilters(); ensureStageFilterOptions(); renderOrders(); renderOperationFollowPanel(); renderTodayOrdersPanel?.(); renderOperationalAiDashboard?.(); renderDetails(); repairGlobalArabicText(); applyPermissionVisibility(); }
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
    refs.pricingNumber.value = nextPricingNumber();
    refs.pricingCustomer.value = order.customer || '';
    refs.pricingDate.value = refs.weavingSlipDate.value;
    refs.pricingFabricType.value = order.fabricType || '';
    refs.pricingQuantity.value = quantity;
    refs.pricingInchWidth.value = order.inchWidth || '';
    setPaymentFields(refs.pricingPaymentMode, refs.pricingPaymentDetails, refs.pricingPaymentTerms, order.paymentTerms || '');
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

async function promptOperationNotes(sourceOrder, type, dyehouseName = '') {
  if (!sourceOrder) return null;
  const key = operationNotesKey(type, dyehouseName);
  const savedNotes = sourceOrder.operationNotes && typeof sourceOrder.operationNotes === 'object' && !Array.isArray(sourceOrder.operationNotes) ? sourceOrder.operationNotes : {};
  const current = Object.prototype.hasOwnProperty.call(savedNotes, key) ? savedNotes[key] : '';
  const title = type === 'dyeing'
    ? `ملاحظات أمر تشغيل الصباغة${dyehouseName ? ` - ${dyehouseName}` : ''}`
    : 'ملاحظات أمر تشغيل النسيج';
  const value = prompt(title, current);
  if (value === null) return null;
  sourceOrder.operationNotes = sourceOrder.operationNotes && typeof sourceOrder.operationNotes === 'object' && !Array.isArray(sourceOrder.operationNotes) ? sourceOrder.operationNotes : {};
  sourceOrder.operationNotes[key] = value.trim();
  if (backendAvailable) {
    const customerId = await ensureBackendCustomer(sourceOrder.customer);
    const savedOrder = await putBackend(`/orders/${sourceOrder.id}`, orderToApi(sourceOrder, customerId));
    if (!savedOrder) {
      await rollbackAfterBackendWriteFailure('تعذر حفظ ملاحظات التقرير في قاعدة البيانات. لم يتم فتح التقرير.');
      return null;
    }
    await loadBackendData();
    const refreshedOrder = orders.find((order)=>order.id === sourceOrder.id);
    if (refreshedOrder) {
      sourceOrder.operationNotes = refreshedOrder.operationNotes || sourceOrder.operationNotes;
    }
  }
  save();
  return sourceOrder.operationNotes[key];
}
if (refs.weavingSlipDialog) installAmalReviewUi();
applyPricingMaterialOptions();
applyPricingDyehouseOptions();
installGroupedOrderUi();
refs.openPricingFormBtn.onclick = () => { editingPricingId = null; pendingPricingOrderId = null; if (refs.deletePricingBtn) refs.deletePricingBtn.style.display = 'none'; refs.pricingForm.reset(); refs.pricingNumber.value = nextPricingNumber(); refs.pricingDate.value = new Date().toISOString().slice(0,10); applyPricingMaterialOptions(); applyPricingDyehouseOptions(); syncAutoCodes(); updatePricingPreview(); refs.pricingDialog.showModal(); };
refs.deletePricingBtn.onclick = () => { if (editingPricingId) deletePricing(editingPricingId).catch((error)=>{ console.error('pricing-delete-error', error); alert('تعذر حذف التسعيرة.'); }); };
if (refs.openDocumentReviewBtn) refs.openDocumentReviewBtn.onclick = openDocumentReviewDialog;
refs.openOrderFormBtn.onclick = () => { pendingConvertedPricingId = null; editingOrderId = null; refs.orderForm.reset(); refs.orderNumber.value = nextPricingNumber(); refs.orderDate.value = new Date().toISOString().slice(0,10); syncAutoCodes(); renderWidthLinesEditor(); renderAccessoryLinesEditor(); syncWidthModeUi(); resetGroupedOrderRows(); refs.orderDialog.showModal(); };
if (refs.openOrdersReportBtn) refs.openOrdersReportBtn.onclick = openOrdersReport;
if (refs.printFilteredOrdersBtn) refs.printFilteredOrdersBtn.onclick = openFilteredOrdersReport;
if (refs.openDyehouseBalancesReportBtn) refs.openDyehouseBalancesReportBtn.onclick = openDyehouseBalancesReport;
if (refs.openManagementReportsBtn) refs.openManagementReportsBtn.onclick = openManagementReportsMenu;
document.addEventListener('click', (event) => {
  if (event.target.closest('#backFromDashboardBtn')) {
    event.preventDefault();
    closeDashboardFocusMode();
    return;
  }
  if (event.target.closest('#backFromAiBtn')) {
    event.preventDefault();
    closeAiFocusMode();
    return;
  }
  if (event.target.closest('[data-sidebar-toggle]')) {
    event.preventDefault();
    toggleSidebar();
    return;
  }
  if (event.target.closest('[data-sidebar-close]')) {
    event.preventDefault();
    closeSidebar();
    return;
  }
  const moduleButton = event.target.closest('[data-module-action]');
  if (moduleButton) {
    setWorkspaceModule(moduleButton.dataset.moduleAction || 'dashboard');
    setActiveSidebarButton(moduleButton);
  }
  const stageShortcut = event.target.closest('[data-stage-shortcut]')?.dataset.stageShortcut;
  if (stageShortcut) {
    event.preventDefault();
    applyStageShortcut(stageShortcut);
    closeSidebar();
    return;
  }
  const menuButton = event.target.closest('.erp-menu > button');
  if (menuButton) {
    const menu = menuButton.closest('.erp-menu');
    const willOpen = !menu.classList.contains('open');
    closeOpenErpMenus(menu);
    menu.classList.toggle('open', willOpen);
    return;
  }
  if (!event.target.closest('.erp-menu')) closeOpenErpMenus();
  const navAction = event.target.closest('[data-nav-action]')?.dataset.navAction;
  if (navAction) {
    event.preventDefault();
    handleNavMenuAction(navAction);
    closeSidebar();
    return;
  }
  const docType = event.target.closest('[data-doc-menu]')?.dataset.docMenu;
  if (docType) {
    event.preventDefault();
    if (!selectedOrderId) { alert('اختر طلبًا أولًا لفتح المستند.'); return; }
    closeSidebar();
    safeOpenDocument(docType);
  }
});
if (refs.documentBody) refs.documentBody.addEventListener('click', (event)=>{
  if (event.target.closest('[data-save-gluing-source]')) {
    saveGluingSourceFromDialog(event.target.closest('form')).catch((error)=>{ console.error('gluing-source-save-error', error); alert('تعذر سحب الخامة إلى عملية الدمج.'); });
    return;
  }
  if (event.target.closest('[data-save-gluing-merge]')) {
    saveGluingMergeFromDialog(event.target.closest('form')).catch((error)=>{ console.error('gluing-merge-save-error', error); alert('تعذر حفظ عملية الدمج.'); });
    return;
  }
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
  if (dyeingDocButton) openDyeingDocumentForDyehouse(dyeingDocButton.dataset.openDyeingFor).catch((error)=>{ console.error('dyeing-document-open-error', error); alert('تعذر فتح أمر الصباغة حاليًا.'); });
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
  if (event.target.closest('[data-new-system-user]')) openSystemUserForm();
  if (event.target.closest('[data-back-system-users]')) openUsersDialog();
  const editUserButton = event.target.closest('[data-edit-system-user]');
  if (editUserButton) {
    const users = JSON.parse(refs.documentBody.dataset.usersJson || '[]');
    openSystemUserForm(users.find((user)=>user.id === editUserButton.dataset.editSystemUser) || null);
  }
  const saveUserButton = event.target.closest('[data-save-system-user]');
  if (saveUserButton) saveSystemUser(saveUserButton.dataset.saveSystemUser).catch((error)=>{ console.error('system-user-save-error', error); alert(error.message || 'تعذر حفظ المستخدم.'); });
  const deleteUserButton = event.target.closest('[data-delete-system-user]');
  if (deleteUserButton) deleteSystemUser(deleteUserButton.dataset.deleteSystemUser).catch((error)=>{ console.error('system-user-delete-error', error); alert(error.message || 'تعذر حذف المستخدم.'); });
  if (event.target.closest('[data-save-bulk-batches]')) saveBulkBatchesFromDialog().catch((error)=>{ console.error('bulk-batches-save-error', error); alert(error.message || 'تعذر حفظ الإدخال الجماعي.'); });
});

refs.closePricingFormBtn.onclick = () => { pendingPricingOrderId = null; refs.pricingDialog.close(); };
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
  if (!button) {
    const row = event.target.closest('[data-order-row]');
    if (row?.dataset.orderRow) openOrderFocusMode(row.dataset.orderRow);
    return;
  }
  if (button.dataset.view) {
    try {
      openOrderFocusMode(button.dataset.view);
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
document.getElementById('refreshOperationFollowBtn')?.addEventListener('click', refreshOperationFollowPanel);
document.getElementById('erpCockpit')?.addEventListener('click', (event) => {
  const viewButton = event.target.closest('[data-view]');
  if (viewButton?.dataset.view) openOrderFocusMode(viewButton.dataset.view);
});
document.getElementById('operationFollowPanel')?.addEventListener('click', (event) => {
  const stageCard = event.target.closest('[data-stage-filter]');
  if (stageCard) {
    const stageKey = stageCard.dataset.stageFilter;
    if (stageKey && refs.orderStatusFilter) {
      refs.orderStatusFilter.value = `stage:${stageKey}`;
      renderOrders();
      document.querySelector('.orders-list-panel')?.scrollIntoView({ behavior:'smooth', block:'start' });
    }
    return;
  }
  const viewButton = event.target.closest('[data-view]');
  if (viewButton?.dataset.view) openOrderFocusMode(viewButton.dataset.view);
});
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
  if (target.dataset.orderTab) {
    event.preventDefault();
    setOrderDetailTab(target.dataset.orderTab);
    return;
  }
  if (target.id === 'backToOrdersBtn') { closeOrderFocusMode(); return; }
  if (target.id === 'focusEditOrderBtn') {
    editingOrderId = selectedOrderId;
    const order = orders.find((item)=>item.id===selectedOrderId);
    if (order) { fillOrderForm(order); refs.orderDialog.showModal(); }
    return;
  }
  if (target.id === 'focusDeleteOrderBtn') {
    if (selectedOrderId) deleteOrder(selectedOrderId).then(()=>{ if (!selectedOrderId) closeOrderFocusMode(); }).catch((error)=>{ console.error('order-delete-error', error); alert('تعذر حذف الطلب.'); });
    return;
  }
  if (target.id === 'editOrderBtn') { editingOrderId = selectedOrderId; const order = orders.find((item)=>item.id===selectedOrderId); if (order) { fillOrderForm(order); refs.orderDialog.showModal(); } }
  if (target.id === 'toggleOperationClosedBtn') { event.preventDefault(); toggleOperationClosed().catch((error)=>{ console.error('operation-close-error', error); alert('تعذر حفظ حالة دورة التشغيل.'); }); return; }
  if (target.id === 'addAllocationBtn') addAllocation().catch((error)=>{ console.error('allocation-add-error', error); alert('تعذر حفظ اللون.'); });
  if (target.dataset.openBulkEntry !== undefined) {
    event.preventDefault();
    openBulkBatchDialog(target.closest('.batch-form'));
    return;
  }
  if (target.dataset.editAllocation) editAllocation(target.dataset.editAllocation).catch((error)=>{ console.error('allocation-edit-error', error); alert('تعذر تعديل اللون.'); });
  if (target.dataset.deleteAllocation) deleteAllocation(target.dataset.deleteAllocation).catch((error)=>{ console.error('allocation-delete-error', error); alert('تعذر حذف اللون.'); });
  if (target.dataset.transferAllocation) transferAllocationDyehouse(target.dataset.transferAllocation).catch((error)=>{ console.error('allocation-transfer-error', error); alert('تعذر حفظ تحويل المصبغة.'); });
  const action = target.dataset.batchAction;
  if (action === 'delete') deleteBatch(target.dataset.batchType, target.dataset.batchId).catch((error)=>{ console.error('batch-delete-error', error); alert('تعذر حذف الحركة.'); });
  if (action === 'edit') editBatch(target.dataset.batchType, target.dataset.batchId).catch((error)=>{ console.error('batch-edit-error', error); alert('تعذر تعديل الحركة.'); });
  if (target.dataset.retryOutbox) retryOutbox(target.dataset.retryOutbox);
});
installDocumentsUiHandlers();
installTodayOrdersUiHandlers?.();
if (refs.weavingSlipDialog) {
  refs.closeWeavingSlipBtn.onclick = () => refs.weavingSlipDialog.close();
  refs.weavingSlipType.onchange = () => { updateDocumentReviewFields(); if ((refs.weavingSlipType.value === 'amalOrder' || refs.weavingSlipType.value === 'deltexIssue') && refs.weavingSlipFile.files?.[0]) applyAmalSuggestionFromFile(refs.weavingSlipFile.files[0]); };
  refs.weavingSlipOrderNumber.onchange = updateDocumentReviewFields;
  refs.reviewMatchNoteBtn.onclick = matchReviewByNoteNumber;
  refs.weavingSlipFile.onchange = () => handleWeavingSlipFile().catch(()=>alert('تعذر قراءة صورة المستند. جرّب صورة أوضح أو ملفًا آخر.'));
refs.weavingSlipForm.onsubmit = (event) => confirmWeavingSlip(event).catch((error)=>{ console.error('document-review-save-error', error); alert('تعذر تسجيل المستند.'); });
}
refs.documentBody?.addEventListener('click', (event) => {
  if (event.target.closest('[data-create-backup]')) createBackupFromStatusDialog();
});
installAiUiHandlers();
initialLocalStorageSnapshot = captureLocalStorageSnapshot();
loadCurrentUser().finally(() => {
  installAutomationUi();
  pollBackendStatus();
  pollWhatsappService();
});
loadBackendData();
setInterval(pollBackendStatus, 15000);
setInterval(pollWhatsappService, 15000);

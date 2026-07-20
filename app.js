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
  fabricMaster: '2btex.fabricMaster.v1',
  auditLog: '2btex.auditLog.v1',
  whatsappStatus: '2btex.whatsappStatus.v1',
};
const APP_VERSION = 'v2026.07.02.04';
const APP_BUILD_TIME = '2026-07-02 19:45';
const TRANSFER_RAW_MARKER = '[raw-transfer]';
const TRANSFER_ALLOCATION_MARKER = '[allocation-transfer]';
const TRANSFER_ACCESSORY_MARKER = '[accessory-transfer]';
const MAIN_WAREHOUSE_STOCK_MARKER = '[main-warehouse-stock]';
const MAIN_WAREHOUSE_CUSTOMER = '2B';
const MAIN_WAREHOUSE_DYEHOUSE = 'ط§ظ„ظ…ط®ط²ظ† ط§ظ„ط±ط¦ظٹط³ظٹ';
const MAIN_WAREHOUSE_PREFIX = 'WH-';
const FINISHED_TRANSFER_MARKER = '[finished-stock-transfer]';
function ensureStartGateActionCards() {
  const actions = document.querySelector('.start-actions');
  if (!actions) return;
  const definitions = [
    { action: 'workspaceHome', primary: true, title: 'ظپطھط­ ظ„ظˆط­ط© ط§ظ„طھط´ط؛ظٹظ„', body: 'ط§ظ„ط·ظ„ط¨ط§طھطŒ ط§ظ„ظپظ„ط§طھط±طŒ ط§ظ„ظ…طھط§ط¨ط¹ط©طŒ ظˆط­ط§ظ„ط© ط§ظ„طھط´ط؛ظٹظ„.' },
    { action: 'orderNew', title: 'ط·ظ„ط¨ ط¬ط¯ظٹط¯', body: 'طھط³ط¬ظٹظ„ ط£ظ…ط± طھط´ط؛ظٹظ„ ط¬ط¯ظٹط¯ ظ…ط¨ط§ط´ط±ط©.' },
    { action: 'pricingNew', module: 'pricing', title: 'ظƒط±طھ طھط³ط¹ظٹط±', body: 'طھط³ط¹ظٹط± ط®ط§ظ…ط© ظˆظ…ط±ط§ط­ظ„ طµط¨ط§ط؛ط© ظ‚ط¨ظ„ ط§ظ„ط¹ط±ط¶.' },
    { action: 'ordersList', module: 'orders', title: 'ط¨ط­ط« ط§ظ„ط·ظ„ط¨ط§طھ', body: 'ط§ظ„ظˆطµظˆظ„ ظ„ط·ظ„ط¨ ظ…ظˆط¬ظˆط¯ ط£ظˆ ظپظ„طھط±ط© ط§ظ„ط­ط§ظ„ط©.' },
    { action: 'managementReports', module: 'reports', title: 'ط§ظ„طھظ‚ط§ط±ظٹط±', body: 'ظ…طھط§ط¨ط¹ط© ط§ظ„طھط´ط؛ظٹظ„ ظˆط§ظ„ط­ط³ط§ط¨ط§طھ ظˆط§ظ„طھط­ظ„ظٹظ„ط§طھ.' },
    { action: 'aiModel', module: 'ai', title: 'ظ…ط±ظƒط² ط§ظ„ظ…طھط§ط¨ط¹ط© ط§ظ„ط°ظƒظٹ', body: 'ظ‚ط±ط§ط،ط© ط§ظ„ظ…طھط§ط¨ط¹ط© ط§ظ„ظٹظˆظ…ظٹط© ظˆط§ظ„ط£ط³ط¦ظ„ط© ط§ظ„ط°ظƒظٹط© ظپظٹ ط´ط§ط´ط© ظˆط§ط­ط¯ط©.' },
  ];
  const existingByAction = new Map();
  actions.querySelectorAll('[data-nav-action]').forEach((button) => {
    const key = button.dataset.navAction;
    if (key && !existingByAction.has(key)) existingByAction.set(key, button);
    else button.remove();
  });
  definitions.forEach((item) => {
    let button = existingByAction.get(item.action);
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = `start-card${item.primary ? ' primary' : ''}`;
      button.dataset.navAction = item.action;
      button.innerHTML = `<strong>${item.title}</strong><span>${item.body}</span>`;
    } else {
      button.type = 'button';
      button.classList.add('start-card');
      button.classList.toggle('primary', Boolean(item.primary));
    }
    if (item.module) button.dataset.moduleAction = item.module;
    else delete button.dataset.moduleAction;
    actions.appendChild(button);
  });
}
// LEGACY_ARABIC_MARKER: ط¨ظ‚ط§ظٹط§ ظƒطھظ„ ظ‚ط¯ظٹظ…ط© طھط§ظ„ظپط© ط¯ط§ط®ظ„ app.js.
// ط§ظ„ظ…ط³ط§ط±ط§طھ ط§ظ„ظ…ط³طھط®ط¯ظ…ط© ظپط¹ظ„ظٹظ‹ط§ طھظ… طھط¬ط§ظˆط²ظ‡ط§ ط¨ط¯ظˆط§ظ„ ط¹ط±ط¨ظٹط© ط³ظ„ظٹظ…ط© ظپظٹ ظ†ظ‡ط§ظٹط© ط§ظ„ظ…ظ„ظپطŒ ظˆظ‡ط°ظ‡ ط§ظ„ط¹ظ„ط§ظ…ط© طھط¨ظ‚ظ‰ ط¸ط§ظ‡ط±ط© ظپظٹ ط§ظ„ط¨ط­ط« ط­طھظ‰ ظ„ط§ ظ†ط®ظپظٹ ظ…ظˆط§ط¶ط¹ ط§ظ„طھظ†ط¸ظٹظپ ط§ظ„ظ…طھط¨ظ‚ظٹط©.
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
  safeSetLocalStorage(STORAGE_KEYS.fabricMaster, JSON.stringify(fabricMaster));
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
  whatsappSettings: { weavingGroupName: '2B - النسيج', dyeingGroupName: '2B - المصبغة', dyehousesReportGroupName: 'اوردرات 2B', dyehouseGroups: {}, weavingGroups: {}, customerGroups: {}, sendingEnabled: false, scheduledReports: { enabled:false, time:'09:00', groupName:'', includeOperations:true, includeDyehouse:true, includeReady:true, includeDelayed:true, includeWaste:true, lastRunKey:'' } },
  fabricMaster: [],
  auditLog: [],
  whatsappStatus: { status: 'disconnected', updatedAt: '', errorMessage: '', qrDataUrl: '', processing:null, outboxSummary:null },
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
let backendCustomers = [];
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
let fabricMaster = load(STORAGE_KEYS.fabricMaster, defaults.fabricMaster);
let auditLog = load(STORAGE_KEYS.auditLog, defaults.auditLog);
let whatsappStatus = (() => {
  try { return { ...defaults.whatsappStatus, ...(JSON.parse(localStorage.getItem(STORAGE_KEYS.whatsappStatus)) || {}) }; }
  catch { return clone(defaults.whatsappStatus); }
})();
let whatsappSettingsRefreshTimer = null;
let whatsappScheduleTimer = null;
if (!Array.isArray(reportOutbox)) reportOutbox = clone(defaults.reportOutbox);
if (!Array.isArray(auditLog)) auditLog = clone(defaults.auditLog);
if (!Array.isArray(customerBatches)) customerBatches = clone(defaults.customer);
if (!Array.isArray(dyehouseTransfers)) dyehouseTransfers = clone(defaults.transfers);
if (!Array.isArray(rawReturns)) rawReturns = clone(defaults.rawReturns);
if (!Array.isArray(gluingBatches)) gluingBatches = clone(defaults.gluing);
const LEGACY_TEST_ORDER_NUMBERS = new Set(['2554']);
const LEGACY_TEST_CUSTOMERS = new Set(['ط§ظ… ط§ط­ظ…ط¯','ط£ظ… ط£ط­ظ…ط¯','ط§ظ… ط£ط­ظ…ط¯','ط£ظ… ط§ط­ظ…ط¯']);
function normalizeLegacyCustomerName(value) {
  return String(value || '').replace(/[ط¥ط£ط¢]/g, 'ط§').replace(/\s+/g, ' ').trim();
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
  if (!Array.isArray(fabricMaster)) fabricMaster = clone(defaults.fabricMaster);
  if (!whatsappSettings || typeof whatsappSettings !== 'object' || Array.isArray(whatsappSettings)) whatsappSettings = clone(defaults.whatsappSettings);
  whatsappSettings = { ...defaults.whatsappSettings, ...whatsappSettings };
  if (!whatsappSettings.dyehouseGroups || typeof whatsappSettings.dyehouseGroups !== 'object' || Array.isArray(whatsappSettings.dyehouseGroups)) whatsappSettings.dyehouseGroups = {};
  if (!whatsappSettings.weavingGroups || typeof whatsappSettings.weavingGroups !== 'object' || Array.isArray(whatsappSettings.weavingGroups)) whatsappSettings.weavingGroups = {};
  if (!whatsappSettings.customerGroups || typeof whatsappSettings.customerGroups !== 'object' || Array.isArray(whatsappSettings.customerGroups)) whatsappSettings.customerGroups = {};
  if (!whatsappSettings.scheduledReports || typeof whatsappSettings.scheduledReports !== 'object' || Array.isArray(whatsappSettings.scheduledReports)) whatsappSettings.scheduledReports = {};
  whatsappSettings.scheduledReports = { ...defaults.whatsappSettings.scheduledReports, ...whatsappSettings.scheduledReports };
  if (!whatsappStatus || typeof whatsappStatus !== 'object' || Array.isArray(whatsappStatus)) whatsappStatus = clone(defaults.whatsappStatus);
  whatsappStatus = { ...defaults.whatsappStatus, ...whatsappStatus };
}
ensureRuntimeCollections();
function ensureRecordIds(collection) {
  let changed = false;
  (collection || []).forEach((item)=>{ if (item && !item.id) { item.id = uid(); changed = true; } });
  return changed;
}
function transferTextLooksRaw(value) {
  const text = String(value || '');
  if (text.includes(TRANSFER_ACCESSORY_MARKER)) return false;
  if (text.includes(TRANSFER_ALLOCATION_MARKER)) return false;
  return text.includes(TRANSFER_RAW_MARKER)
    || /\braw\b/i.test(text)
    || text.includes('\u062e\u0631\u0648\u062c \u062e\u0627\u0645')
    || text.includes('\u0646\u0642\u0644 \u062e\u0627\u0645');
}
function transferModeFromText(reason, toAllocationId) {
  if (String(reason || '').includes(TRANSFER_ACCESSORY_MARKER)) return 'accessory';
  if (String(reason || '').includes(TRANSFER_ALLOCATION_MARKER)) return toAllocationId ? 'split' : 'full';
  if (transferTextLooksRaw(reason)) return 'raw';
  return toAllocationId ? 'split' : 'full';
}
function transferRecordMode(transfer) {
  return transferModeFromText(transfer?.reason || transfer?.notes || '', transfer?.newAllocationId);
}
function repairTransferredAllocationDyehouses() {
  let changed = false;
  (dyehouseTransfers || []).forEach((transfer)=>{
    if (transferRecordMode(transfer) !== 'raw') return;
    const targetId = transfer.allocationId;
    const fromDyehouse = String(transfer.fromDyehouse || '').trim();
    if (!targetId || !fromDyehouse) return;
    const allocation = allocations.find((item)=>item.id === targetId);
    if (allocation && String(allocation.dyehouse || '').trim() !== fromDyehouse) {
      allocation.dyehouse = fromDyehouse;
      changed = true;
    }
  });
  (dyehouseTransfers || []).forEach((transfer)=>{
    if (transferRecordMode(transfer) === 'raw') return;
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
let pendingConvertedPricingItems = [];
let pendingConvertedOrderDrafts = [];
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
let pricingRowsForReport;

const refs = Object.fromEntries([
  'statsGrid','pricingTableBody','pricingSearchInput','pricingCustomerFilter','pricingStatusFilter','printFilteredPricingsBtn','ordersTableBody','weavingOrdersTableBody','dyehouseOrdersTableBody','warehouseOrdersTableBody','searchInput','customerFilter','dyehouseFilter','fabricFilter','orderStatusFilter','printFilteredOrdersBtn','orderDetailsPanel','documentsPanel','todayOrdersPanel','analyzeReportBtn','operationalAiDashboard','aiQuestionInput','askAiBtn','aiStatusText','aiAnalysisDialog','aiAnalysisBody','closeAiAnalysisBtn','copyAiWhatsappBtn','openPricingFormBtn','openDocumentReviewBtn','openOrderFormBtn','openOrdersReportBtn','openDyehouseBalancesReportBtn','openManagementReportsBtn','closePricingFormBtn','pricingDialog','pricingForm','savePricingBtn','pricingNumber','pricingProductCode','pricingCustomer','pricingDate','pricingFabricType','pricingMaterialType','pricingDyehouse','pricingColorClass','pricingQuantity','pricingInchWidth','pricingFinishedWeight','pricingRawCost','pricingDyeCost','pricingSuggestedDyeCost','pricingWastePercent','pricingExtraCost','pricingProfitPerKg','pricingPaymentMode','pricingPaymentDetails','pricingPaymentTerms','pricingNotes','pricingWasteCostPreview','pricingCostPreview','pricingSellPreview','pricingTotalPreview','closeOrderFormBtn','orderDialog','orderForm','orderNumber','productCode','customer','orderDate','fabricType','totalRawQuantity','expectedWastePercent','widthMode','inchWidth','widthLinesBox','widthLinesEditor','addWidthLineBtn','kiloPrice','paymentMode','paymentDetails','paymentTerms','accessoryType','accessoryPercent','accessoryLinesEditor','addAccessoryLineBtn','dyehouse','weavingSource','orderNotes','weavingSlipDialog','weavingSlipForm','weavingSlipFile','weavingSlipPreview','weavingSlipType','weavingSlipOrderNumber','weavingSlipDate','weavingSlipAllocation','weavingSlipWidthLine','weavingSlipQuantity','weavingSlipSupplier','weavingSlipNoteNumber','reviewMatchNoteBtn','reviewMatchStatus','weavingSlipNotes','closeWeavingSlipBtn','documentDialog','documentTitle','documentBody','closeDocumentBtn','printDocumentBtn','shareWhatsAppBtn','deletePricingBtn'
].map((id) => [id, document.getElementById(id)]));
refs.orderNotes?.closest('label')?.querySelector('span') && (refs.orderNotes.closest('label').querySelector('span').textContent = 'ظ…ظ„ط§ط­ط¸ط§طھ طھط´ط؛ظٹظ„');

function composePaymentTerms(modeValue, detailsValue) {
  const mode = String(modeValue || 'ظ†ظ‚ط¯ظٹ').trim() || 'ظ†ظ‚ط¯ظٹ';
  const details = String(detailsValue || '').trim();
  return details ? `${mode} - ${details}` : mode;
}
function parsePaymentTerms(value) {
  const text = String(value || '').trim();
  if (!text) return { mode:'ظ†ظ‚ط¯ظٹ', details:'' };
  const [mode, ...rest] = text.split(' - ');
  return { mode: mode === 'ظƒط§ط´' ? 'ظ†ظ‚ط¯ظٹ' : (mode || 'ظ†ظ‚ط¯ظٹ'), details: rest.join(' - ') };
}
function setPaymentFields(modeRef, detailsRef, hiddenRef, paymentTerms) {
  const parsed = parsePaymentTerms(paymentTerms);
  if (modeRef) {
    const fallback = [...modeRef.options].some((option)=>option.value === 'ظ†ظ‚ط¯ظٹ') ? 'ظ†ظ‚ط¯ظٹ' : ([...modeRef.options][0]?.value || '');
    modeRef.value = [...modeRef.options].some((option)=>option.value === parsed.mode) ? parsed.mode : fallback;
  }
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

if (!window.__twoBTexMovementDetailsToggleInstalled) {
  window.__twoBTexMovementDetailsToggleInstalled = true;
  document.addEventListener('click', (event) => {
    const row = event.target.closest?.('[data-batch-row]');
    if (!row || event.target.closest?.('[data-batch-action], button, a, input, select, textarea')) return;
    const meta = row.querySelector('[data-batch-meta]');
    if (meta) meta.hidden = !meta.hidden;
  });
}
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
    unitPrice: Number(row.unit_price || 0),
    totalPrice: Number(row.total_price || 0),
    paymentTerms: row.payment_terms || '',
    createdAt: row.created_at || '',
    updatedAt: row.updated_at || '',
    createdBy: row.created_by || '',
    updatedBy: row.updated_by || '',
  };
}
function mapDbTransfer(row) {
  const reason = row.notes || '';
  const mode = transferModeFromText(reason, row.to_allocation_id);
  return {
    id: row.id,
    orderId: row.order_id,
    allocationId: row.from_allocation_id,
    newAllocationId: row.to_allocation_id,
    fromDyehouse: row.from_dyehouse || '',
    toDyehouse: row.to_dyehouse || '',
    quantity: Number(row.quantity || 0),
    date: dbDate(row),
    reason,
    noteNumber: row.note_number || '',
    transferDate: row.transfer_date || dbDate(row),
    createdAt: row.created_at || '',
    updatedAt: row.updated_at || '',
    createdBy: row.created_by || '',
    updatedBy: row.updated_by || '',
    mode,
  };
}
function mapDbPricing(row, customers) {
  const priceItems = parseDbJsonArray(row.pricing_items_json);
  const firstItemWithWeavingSource = priceItems.find((item)=>item?.weavingSource || item?.weaving_source);
  const firstItemWithCurrency = priceItems.find((item)=>item?.currency || item?.exchangeRate || item?.exchange_rate);
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
    weavingSource: firstItemWithWeavingSource?.weavingSource || firstItemWithWeavingSource?.weaving_source || '',
    notes: row.notes || '',
    status: row.status || 'active',
    priceItems,
    currency: firstItemWithCurrency?.currency || 'EGP',
    exchangeRate: Number(firstItemWithCurrency?.exchangeRate || firstItemWithCurrency?.exchange_rate || 1),
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
    if (!data) throw lastError || new Error('طھط¹ط°ط± طھط­ظ…ظٹظ„ ط¨ظٹط§ظ†ط§طھ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ');
    const customers = data.customers || [];
    backendCustomers = customers.map((customer)=>({
      id: customer.id || backendCustomerId(customer.name),
      name: cleanCustomerDisplayName(customer.name || customer.customerName || ''),
      phone: customer.phone || '',
      a5CustomerId: customer.a5_customer_id || customer.a5CustomerId || '',
      notes: customer.notes || '',
    })).filter((customer)=>customer.name);
    orders = (data.orders || []).map((row)=>mapDbOrder(row, customers));
    pricings = (data.pricings || []).map((row)=>mapDbPricing(row, customers));
    repairUnreadableOrderFabricTypesFromPricings();
    allocations = (data.allocations || []).map(mapDbAllocation);
    rawBatches = (data.dyehouseDeliveryBatches || []).map(mapDbBatch);
    finishedBatches = [];
    productionBatches = (data.finishedReceivingBatches || []).map(mapDbBatch);
    customerBatches = (data.customerDeliveryBatches || []).map(mapDbBatch);
    accessoryBatches = (data.accessoryBatches || []).map(mapDbBatch);
    rawReturns = (data.rawReturns || []).map(mapDbBatch);
    gluingBatches = (data.gluingBatches || []).map(mapDbBatch);
    dyehouseTransfers = (data.dyehouseTransfers || []).map(mapDbTransfer);
    repairUnreadableOperationalFields();
    purgeLegacyTestOrdersFromMemory();
    if (!orders.some((order)=>order.id === selectedOrderId)) selectedOrderId = orders[0]?.id || null;
    const settings = data.systemSettings || {};
    if (settings.customerAccounts && typeof settings.customerAccounts === 'object' && !Array.isArray(settings.customerAccounts)) {
      customerAccounts = settings.customerAccounts;
    }
    if (settings.whatsappSettings && typeof settings.whatsappSettings === 'object' && !Array.isArray(settings.whatsappSettings)) {
      whatsappSettings = { ...defaults.whatsappSettings, ...settings.whatsappSettings };
    }
    if (Array.isArray(settings.fabricMaster)) {
      fabricMaster = settings.fabricMaster.map((name)=>cleanFabricDisplayName(name)).filter(Boolean);
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
  if (!confirm('ط³ظٹطھظ… طھط±ط­ظٹظ„ ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…طھطµظپط­ ط§ظ„ط­ط§ظ„ظٹط© ط¥ظ„ظ‰ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ط¨ط¯ظˆظ† ط­ط°ظپ LocalStorage. ظ‡ظ„ طھط±ظٹط¯ ط§ظ„ظ…طھط§ط¨ط¹ط©طں')) return;
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
    alert(`طھظ…طھ ط§ظ„ظ…ط²ط§ظ…ظ†ط©.\nطھظ…طھ ط¥ط¶ط§ظپط©: ${result.inserted || 0}\nطھظ… طھط­ط¯ظٹط«: ${result.updated || 0}\nطھظ… طھط¬ط§ظ‡ظ„: ${result.skipped || 0}`);
    await loadBackendData();
  } catch (error) {
    console.error(error);
    alert('طھط¹ط°ط± طھظ†ظپظٹط° ط§ظ„ظ…ط²ط§ظ…ظ†ط©. طھط£ظƒط¯ ط£ظ† ط®ط¯ظ…ط© ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ طھط¹ظ…ظ„ ط«ظ… ط­ط§ظˆظ„ ظ…ط±ط© ط£ط®ط±ظ‰.');
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
  const currency = pricing.currency || 'EGP';
  const priceItems = Array.isArray(pricing.priceItems) ? pricing.priceItems.map((item)=>({ ...item, currency:item.currency || currency, exchangeRate:item.exchangeRate || pricing.exchangeRate || '', weavingSource:item.weavingSource || pricing.weavingSource || '' })) : [];
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
    pricing_items_json: JSON.stringify(priceItems),
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
  unit_price: Number(batch.unitPrice || 0),
  total_price: Number(batch.totalPrice || 0),
  payment_terms: batch.paymentTerms || null,
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
  const cleanName = cleanCustomerDisplayName(name);
  if (!backendAvailable || !cleanName) return null;
  const existing = findCustomerMasterByName(cleanName);
  if (existing?.id) return existing.id;
  const id = backendCustomerId(cleanName);
  const saved = await postBackend('/customers', { id, name: cleanName, notes: 'ظ…ط¶ط§ظپ ظ…ظ† ط§ظ„ظˆط§ط¬ظ‡ط©' });
  if (saved?.id) {
    backendCustomers = [
      ...customerMasterRows().filter((customer)=>customer.id !== saved.id),
      { id:saved.id, name:saved.name || cleanName, phone:saved.phone || '', a5CustomerId:saved.a5_customer_id || '', notes:saved.notes || '' },
    ];
  }
  return saved?.id || id;
}
async function postBackend(path, payload) {
  if (!backendAvailable) return null;
  try { return await backendRequest(path, { method: 'POST', body: JSON.stringify(payload) }); }
  catch (error) { backendAvailable = false; console.warn('Backend write failed, kept LocalStorage copy', error); return null; }
}
async function postBackendStrict(path, payload) {
  if (!backendAvailable) throw new Error('ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ط؛ظٹط± ظ…طھطµظ„ط© ط§ظ„ط¢ظ†.');
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
async function ensureBackendForWrite(message = 'طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط¨ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„طھط¹ط¯ظٹظ„.') {
  try {
    const health = await backendRequest('/health', { cache: 'no-store' });
    const schemaOk = health?.schema?.ok !== false;
    backendAvailable = schemaOk;
    updateBackendStatusBadge(schemaOk ? 'ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ظ…طھطµظ„ط©' : 'ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ظ…طھطµظ„ط© ظ„ظƒظ† طھط­طھط§ط¬ طھط±ظ‚ظٹط©');
    if (!schemaOk) {
      alert('ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ظ…طھطµظ„ط© ظ„ظƒظ† ظ‡ظٹظƒظ„ظ‡ط§ ط؛ظٹط± ظ…ظƒطھظ…ظ„. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„طھط¹ط¯ظٹظ„ ط­طھظ‰ طھطھظ… ط§ظ„طھط±ظ‚ظٹط©.');
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
const {
  backendBatchType,
  backendSnapshotCollection,
  backendSnapshot,
  verifyRecordPersisted,
  verifyRecordDeleted,
  verifyPricingPersisted,
  pricingPersistenceMatches,
  verifyOrderPersisted,
  verifyAllocationPersisted,
  verifyBatchPersisted,
  verifyTransferPersisted,
} = window.createPersistenceGuards({
  backendRequest,
  parseDbJsonArray,
});
async function rollbackAfterBackendWriteFailure(message) {
  alert(message || 'طھط¹ط°ط± طھط«ط¨ظٹطھ ط§ظ„طھط¹ط¯ظٹظ„ ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ط³ظٹطھظ… ط§ظ„ط±ط¬ظˆط¹ ظ„ط¢ط®ط± ط¨ظٹط§ظ†ط§طھ ظ…ط­ظپظˆط¸ط©.');
  await loadBackendData();
}
const reportTypeLabels = {
  weaving_production_order: 'ط£ظ…ط± طھط´ط؛ظٹظ„ ظ†ط³ظٹط¬',
  dyeing_production_order: 'ط£ظ…ط± طھط´ط؛ظٹظ„ طµط¨ط§ط؛ط©',
  dyehouses_report: 'طھظ‚ط±ظٹط± ط§ظ„ظ…طµط§ط¨ط؛',
  orders_follow_report: 'طھظ‚ط±ظٹط± ظ…طھط§ط¨ط¹ط© ط§ظ„ط·ظ„ط¨ط§طھ',
  dyehouse_balances_report: 'طھظ‚ط±ظٹط± ط£ط±طµط¯ط© ط§ظ„ظ…طµط§ط¨ط؛',
  scheduled_operations_report: 'طھظ‚ط±ظٹط± ط§ظ„طھط´ط؛ظٹظ„ ط§ظ„ط¯ظˆط±ظٹ',
  document_pdf_report: 'طھظ‚ط±ظٹط± PDF',
};
const reportTypeIcons = { pending:'â€¢', sending:'â€¦', sent:'âœ“', failed:'!', cancelled:'أ—' };
const reportStatusText = { pending:'ظپظٹ ظ‚ط§ط¦ظ…ط© ط§ظ„ط¥ط±ط³ط§ظ„', sending:'ط¬ط§ط±ظٹ ط§ظ„ط¥ط±ط³ط§ظ„', sent:'طھظ… ط§ظ„ط¥ط±ط³ط§ظ„', failed:'طھط¹ط°ط± ط§ظ„ط¥ط±ط³ط§ظ„', cancelled:'طھظ… ط§ظ„ط¥ظ„ط؛ط§ط،' };
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
  // ط³ط¬ظ„ ط§ظ„طھط¹ط¯ظٹظ„ط§طھ ط§ظ„ط±ط³ظ…ظٹ ط£طµط¨ط­ ظپظٹ ط¬ط¯ظˆظ„ audit_log ط¯ط§ط®ظ„ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ.
  return true;
}
function getFirstRawNoteNumber(order) {
  if (!order) return '';
  return [...new Set(rawBatches.filter((batch)=>batch.orderId===order.id).map((batch)=>batch.noteNumber).filter(Boolean))].join('طŒ ');
}
function compatibleNameForMatch(left, right) {
  const a = normalizeForCompare(left).replace(/\s+/g, ' ').trim();
  const b = normalizeForCompare(right).replace(/\s+/g, ' ').trim();
  return !!a && !!b && (a === b || a.includes(b) || b.includes(a));
}
function compatibleFabricForMatch(left, right) {
  const a = normalizeForCompare(left).replace(/[^\p{L}\p{N}\s/.-]/gu, ' ').replace(/\s+/g, ' ').trim();
  const b = normalizeForCompare(right).replace(/[^\p{L}\p{N}\s/.-]/gu, ' ').replace(/\s+/g, ' ').trim();
  if (!a || !b) return false;
  if (a === b || a.includes(b) || b.includes(a)) return true;
  const aTokens = new Set(a.split(/\s+/).filter((token)=>token.length > 1));
  const bTokens = new Set(b.split(/\s+/).filter((token)=>token.length > 1));
  let shared = 0;
  aTokens.forEach((token)=>{ if (bTokens.has(token)) shared += 1; });
  return shared >= Math.min(2, aTokens.size, bTokens.size);
}
function isUnreadableOperationalText(value) {
  const text = String(value || '').trim();
  if (!text) return false;
  if (text.includes('\uFFFD') || /[?]{3,}/.test(text)) return true;
  const questionMarks = (text.match(/\?/g) || []).length;
  const nonSpace = text.replace(/\s+/g, '').length || 1;
  return questionMarks >= 3 && questionMarks / nonSpace >= 0.35;
}
function readablePricingFabricName(pricing) {
  if (!pricing) return '';
  const direct = String(pricing.fabricType || '').trim();
  if (direct && !isUnreadableOperationalText(direct)) return direct;
  const readableItem = pricingItemsFor(pricing).find((item)=>{
    const name = String(item.fabricType || item.materialType || '').trim();
    return name && !isUnreadableOperationalText(name);
  });
  return String(readableItem?.fabricType || readableItem?.materialType || '').trim();
}
function readablePricingField(pricing, fieldName) {
  if (!pricing || !fieldName) return '';
  const direct = String(pricing[fieldName] || '').trim();
  if (direct && !isUnreadableOperationalText(direct)) return direct;
  const readableItem = pricingItemsFor(pricing).find((item)=>{
    const value = String(item[fieldName] || '').trim();
    return value && !isUnreadableOperationalText(value);
  });
  return String(readableItem?.[fieldName] || '').trim();
}
function pricingCandidateForUnreadableOrder(order) {
  const orderNo = String(order?.orderNumber || '').trim();
  const pricingId = String(order?.pricingId || '').trim();
  if (!orderNo && !pricingId) return null;
  const candidates = pricings.filter((pricing)=>{
    const sameId = pricingId && String(pricing.id || '').trim() === pricingId;
    const sameNumber = orderNo && String(pricing.pricingNumber || '').trim() === orderNo;
    return (sameId || sameNumber) && readablePricingFabricName(pricing);
  });
  if (!candidates.length) return null;
  const exactCustomer = candidates.find((pricing)=>compatibleNameForMatch(order.customer, pricing.customer));
  if (exactCustomer) return exactCustomer;
  if (pricingId) return candidates[0] || null;
  return candidates.length === 1 ? candidates[0] : null;
}
function repairUnreadableOrderFabricTypesFromPricings() {
  if (!Array.isArray(orders) || !Array.isArray(pricings)) return 0;
  let repaired = 0;
  orders = orders.map((order)=>{
    if (!isUnreadableOperationalText(order.fabricType)) return order;
    const recoveredFabric = readablePricingFabricName(pricingCandidateForUnreadableOrder(order));
    if (!recoveredFabric) return order;
    repaired += 1;
    return { ...order, fabricType: recoveredFabric, recoveredFabricType: true };
  });
  return repaired;
}
function firstReadableValue(values = []) {
  return (values || []).map((value)=>String(value || '').trim()).find((value)=>value && !isUnreadableOperationalText(value)) || '';
}
function repairUnreadableOperationalFields() {
  if (!Array.isArray(orders)) return 0;
  let repaired = 0;
  orders = orders.map((order)=>{
    const pricing = pricingCandidateForUnreadableOrder(order) || pricingForOrder(order);
    const orderAllocations = allocations.filter((allocation)=>allocation.orderId === order.id);
    const orderRawBatches = rawBatches.filter((batch)=>batch.orderId === order.id);
    const recoveredFabric = isUnreadableOperationalText(order.fabricType)
      ? readablePricingFabricName(pricing)
      : '';
    const recoveredDyehouse = isUnreadableOperationalText(order.dyehouse)
      ? firstReadableValue([
          readablePricingField(pricing, 'dyehouse'),
          ...orderAllocations.map((allocation)=>allocation.dyehouse),
          ...orderRawBatches.map((batch)=>batch.dyehouse),
        ])
      : '';
    const recoveredWeavingSource = isUnreadableOperationalText(order.weavingSource)
      ? firstReadableValue([
          readablePricingField(pricing, 'weavingSource'),
          ...orderRawBatches.map((batch)=>batch.supplier),
        ])
      : '';
    const next = {
      ...order,
      fabricType: recoveredFabric || order.fabricType,
      dyehouse: recoveredDyehouse || order.dyehouse,
      weavingSource: recoveredWeavingSource || order.weavingSource,
    };
    if (recoveredFabric || recoveredDyehouse || recoveredWeavingSource) repaired += 1;
    return next;
  });
  allocations = allocations.map((allocation)=>{
    if (!isUnreadableOperationalText(allocation.dyehouse)) return allocation;
    const order = orders.find((item)=>item.id === allocation.orderId);
    const dyehouse = firstReadableValue([order?.dyehouse, readablePricingField(pricingForOrder(order), 'dyehouse')]);
    if (!dyehouse) return allocation;
    repaired += 1;
    return { ...allocation, dyehouse };
  });
  return repaired;
}
function pricingMatchesOrder(pricing, order) {
  if (!pricing || !order) return false;
  const pricingId = String(pricing.id || '').trim();
  if (pricingId && String(order.pricingId || '').trim() === pricingId) return true;
  const orderNo = String(order.orderNumber || '').trim();
  const pricingNo = String(pricing.pricingNumber || '').trim();
  const pricingOrderNo = String(orderNumberFromPricing(pricing.pricingNumber) || '').trim();
  const sameNumber = !!orderNo && (orderNo === pricingNo || orderNo === pricingOrderNo);
  if (!sameNumber) return false;
  if (!compatibleNameForMatch(order.customer, pricing.customer)) return false;
  const pricingFabrics = uniqueNonEmpty([
    pricing.fabricType,
    ...pricingItemsFor(pricing).map((item)=>item.fabricType || item.materialType),
  ]);
  return pricingFabrics.some((fabric)=>compatibleFabricForMatch(order.fabricType, fabric));
}
function pricingForOrder(order) {
  if (!order) return null;
  const strictMatch = pricings.find((pricing)=>pricingMatchesOrder(pricing, order));
  if (strictMatch) return strictMatch;
  const orderNo = String(order.orderNumber || '').trim();
  if (!orderNo) return null;
  const sameNumberCandidates = pricings.filter((pricing)=>{
    const pricingNo = String(pricing.pricingNumber || '').trim();
    const pricingOrderNo = String(orderNumberFromPricing(pricing.pricingNumber) || '').trim();
    const sameNumber = orderNo === pricingNo || orderNo === pricingOrderNo;
    return sameNumber && compatibleNameForMatch(order.customer, pricing.customer);
  });
  if (sameNumberCandidates.length === 1) return sameNumberCandidates[0];
  const readableFallback = sameNumberCandidates.filter((pricing)=>readablePricingFabricName(pricing));
  return readableFallback.length === 1 ? readableFallback[0] : null;
}
function orderRawCost(order) {
  const direct = Number(order?.rawCost || order?.rawPrice || 0);
  if (direct) return direct;
  return Number(pricingForOrder(order)?.rawCost || 0);
}
function uniqueNonEmpty(values) {
  return [...new Set((values || []).map((value)=>String(value || '').trim()).filter(Boolean))];
}
function cleanCustomerDisplayName(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}
function normalizeCustomerMasterName(value) {
  return cleanCustomerDisplayName(value)
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[\u0623\u0625\u0622\u0671]/g, '\u0627')
    .replace(/\u0649/g, '\u064a')
    .replace(/\u0629/g, '\u0647')
    .replace(/[^\u0600-\u06FF\w]/g, '')
    .toLowerCase();
}
function customerMasterRows() {
  return Array.isArray(backendCustomers) ? backendCustomers.filter((customer)=>cleanCustomerDisplayName(customer?.name)) : [];
}
function findCustomerMasterByName(name) {
  const wanted = normalizeCustomerMasterName(name);
  if (!wanted) return null;
  return customerMasterRows().find((customer)=>normalizeCustomerMasterName(customer.name) === wanted) || null;
}
function canonicalCustomerName(name) {
  const cleanName = cleanCustomerDisplayName(name);
  return findCustomerMasterByName(cleanName)?.name || cleanName;
}
function cleanFabricDisplayName(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}
function normalizeFabricMasterName(value) {
  return cleanFabricDisplayName(value)
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[\u0623\u0625\u0622\u0671]/g, '\u0627')
    .replace(/\u0649/g, '\u064a')
    .replace(/\u0629/g, '\u0647')
    .replace(/[^\u0600-\u06FF\w]/g, '')
    .toLowerCase();
}
function fabricMasterRows() {
  return Array.isArray(fabricMaster) ? uniqueNonEmpty(fabricMaster.map(cleanFabricDisplayName)) : [];
}
function knownFabricNames() {
  return uniqueNonEmpty([
    ...fabricMasterRows(),
    ...orders.map((order)=>order.fabricType),
    ...pricings.map((pricing)=>pricing.fabricType),
    ...pricings.flatMap((pricing)=>pricingItemsFor(pricing).map((item)=>item.fabricType)),
    ...allocations.map((allocation)=>allocation.fabricType),
  ]).sort((a,b)=>String(a).localeCompare(String(b), 'ar'));
}
function findFabricMasterByName(name) {
  const wanted = normalizeFabricMasterName(name);
  if (!wanted) return null;
  return fabricMasterRows().find((fabric)=>normalizeFabricMasterName(fabric) === wanted) || null;
}
function canonicalFabricName(name) {
  const cleanName = cleanFabricDisplayName(name);
  return findFabricMasterByName(cleanName) || cleanName;
}
function applyFabricNameDatalist() {
  const datalistId = 'fabricNamesList';
  let datalist = document.getElementById(datalistId);
  if (!datalist) {
    datalist = document.createElement('datalist');
    datalist.id = datalistId;
    document.body.appendChild(datalist);
  }
  datalist.innerHTML = knownFabricNames().map((name)=>`<option value="${escapeHtml(name)}"></option>`).join('');
  [refs.fabricType, refs.pricingFabricType].forEach((input)=>{
    if (input) input.setAttribute('list', datalistId);
  });
  document.querySelectorAll('input[data-pricing-item-field="fabricType"], input[data-grouped-field="fabricType"], input[data-amal="fabricType"]').forEach((input)=>{
    input.setAttribute('list', datalistId);
  });
}
function knownCustomerNames() {
  return uniqueNonEmpty([
    ...customerMasterRows().map((customer)=>customer.name),
    ...orders.map((order)=>order.customer),
    ...pricings.map((pricing)=>pricing.customer),
    ...customerBatches.map((batch)=>batch.customerName || batch.customer),
  ]).sort((a,b)=>String(a).localeCompare(String(b), 'ar'));
}
function applyCustomerNameDatalist() {
  const datalistId = 'customerNamesList';
  let datalist = document.getElementById(datalistId);
  if (!datalist) {
    datalist = document.createElement('datalist');
    datalist.id = datalistId;
    document.body.appendChild(datalist);
  }
  datalist.innerHTML = knownCustomerNames().map((name)=>`<option value="${escapeHtml(name)}"></option>`).join('');
  [refs.customer, refs.pricingCustomer].forEach((input)=>{
    if (input) input.setAttribute('list', datalistId);
  });
  document.querySelectorAll('input[name="customerName"], input[data-customer-master-name]').forEach((input)=>{
    input.setAttribute('list', datalistId);
  });
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
    return `ط£ظ…ط± طھط´ط؛ظٹظ„ ظ†ط³ظٹط¬\nط±ظ‚ظ… ط§ظ„ط·ظ„ط¨: ${order.orderNumber || '-'}\nط§ظ„ط¹ظ…ظٹظ„: ${order.customer || '-'}\nط§ظ„طµظ†ظپ: ${order.fabricType || '-'}\nط§ظ„ظƒظ…ظٹط©: ${formatNumber(order.totalRawOrdered || 0)}\nط³ط¹ط± ط§ظ„ط®ط§ظ…: ${formatNumber(orderRawCost(order) || 0)}\nط§ظ„طھط§ط±ظٹط®: ${order.orderDate || '-'}\nظ…ظ„ط§ط­ط¸ط§طھ ط§ظ„طھط´ط؛ظٹظ„: ${reportOperationNotes(order)}`;
  }
  if (reportType === 'dyeing_production_order') {
    const dyehouseName = String(order.whatsappDyehouseName || order.dyehouse || '').trim();
    const dyeingLines = (order.allocations || [])
      .filter((line)=>!dyehouseName || String(line.dyehouse || order.dyehouse || '').trim() === dyehouseName)
      .map((line)=>`${line.color || line.pantoneCode || '-'}: ${formatNumber(line.plannedQuantity || 0)} ظƒط¬ظ…`)
      .join('\n');
    return `ط£ظ…ط± طھط´ط؛ظٹظ„ طµط¨ط§ط؛ط©\nط±ظ‚ظ… ط§ظ„ط·ظ„ط¨: ${order.orderNumber || '-'}\nط¥ط°ظ† ط§ظ„ط®ط§ظ…: ${rawNote}\nط§ظ„ط¹ظ…ظٹظ„: ${order.customer || '-'}\nط§ظ„ظ…طµط¨ط؛ط©: ${dyehouseName || '-'}\nط§ظ„طµظ†ظپ: ${order.fabricType || '-'}\nط§ظ„ط£ظ„ظˆط§ظ† ظˆط§ظ„ظƒظ…ظٹط§طھ:\n${dyeingLines || '-'}\nظ…ظ„ط§ط­ط¸ط§طھ ط§ظ„طھط´ط؛ظٹظ„: ${reportOperationNotes(order)}`;
  }
  if (order.isStandaloneReport) {
    return `${reportTypeLabels[reportType] || order.reportTitle || 'طھظ‚ط±ظٹط± ظ…ظ† ظ†ط¸ط§ظ… 2B Tex'}\n${order.reportSubtitle || 'طھظ‚ط±ظٹط± ظ…ظ† ظ†ط¸ط§ظ… 2B Tex'}\nظˆظ‚طھ ط§ظ„طھط¬ظ‡ظٹط²: ${arDateTime()}`;
  }
  return `طھظ‚ط±ظٹط± طھط´ط؛ظٹظ„\nط±ظ‚ظ… ط§ظ„ط·ظ„ط¨: ${order.orderNumber || '-'}\nط§ظ„ط¹ظ…ظٹظ„: ${order.customer || '-'}\nط§ظ„ظ…ط±ط³ظ„ ظ„ظ„ظ…طµط¨ط؛ط©: ${formatNumber(order.totalSentToDyehouse || order.totalRawReceived || 0)}\nط§ظ„ظ…ط³طھظ„ظ… ظ…ط¬ظ‡ط²: ${formatNumber(order.totalFinishedReceived || 0)}\nط§ظ„ظ‡ط§ظ„ظƒ ط§ظ„ظپط¹ظ„ظٹ: ${formatNumber(order.totalWaste || 0)}\nظ†ط³ط¨ط© ط§ظ„ظ‡ط§ظ„ظƒ: ${formatNumber(order.totalWastePercent || 0)}%`;
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
    recordAudit('create', 'reportOutbox', row.id, null, row, `ط¥ط¶ط§ظپط© ${reportTypeLabels[reportType] || reportType} ط¥ظ„ظ‰ ظ‚ط§ط¦ظ…ط© ط§ظ„ط¥ط±ط³ط§ظ„`);
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
function scheduledReportSettings() {
  ensureRuntimeCollections();
  return { ...defaults.whatsappSettings.scheduledReports, ...(whatsappSettings.scheduledReports || {}) };
}
function scheduledReportRunKey(settings = scheduledReportSettings(), date = new Date()) {
  return `${date.toISOString().slice(0, 10)}|${String(settings.time || '09:00').slice(0, 5)}`;
}
function orderDelayDays(order) {
  const sourceDate = order?.orderDate ? new Date(order.orderDate) : null;
  if (!sourceDate || isNaN(sourceDate.getTime())) return 0;
  return Math.max(0, Math.floor((Date.now() - sourceDate.getTime()) / 86400000));
}
function topOrderLines(list, mapper, limit = 5) {
  return list.slice(0, limit).map(mapper).filter(Boolean);
}
function buildScheduledOperationsReportText(settings = scheduledReportSettings()) {
  ensureRuntimeCollections();
  const calculated = orders.map((order)=>calculateOrder(order)).filter(Boolean);
  const openOrders = calculated.filter((order)=>!order.closed);
  const dyehouse = openOrders
    .filter((order)=>Number(order.remainingAtDyehouse || order.totalSentToDyehouse || 0) > 0)
    .sort((a,b)=>Number(b.remainingAtDyehouse || b.totalSentToDyehouse || 0) - Number(a.remainingAtDyehouse || a.totalSentToDyehouse || 0));
  const ready = openOrders
    .filter((order)=>Number(order.warehouseBalance || 0) > 0)
    .sort((a,b)=>Number(b.warehouseBalance || 0) - Number(a.warehouseBalance || 0));
  const delayed = openOrders
    .map((order)=>({ ...order, delayDays:orderDelayDays(order) }))
    .filter((order)=>order.delayDays >= 7)
    .sort((a,b)=>b.delayDays - a.delayDays);
  const waste = calculated
    .filter((order)=>Number(order.totalWastePercent || 0) > Math.max(8, Number(order.expectedWastePercent || 0)))
    .sort((a,b)=>Number(b.totalWastePercent || 0) - Number(a.totalWastePercent || 0));
  const lines = [
    `طھظ‚ط±ظٹط± ط§ظ„طھط´ط؛ظٹظ„ ط§ظ„ط¯ظˆط±ظٹ - 2B Tex`,
    `ظˆظ‚طھ ط§ظ„طھظ‚ط±ظٹط±: ${arDateTime()}`,
    '',
    `ط¹ط¯ط¯ ط§ظ„ط·ظ„ط¨ط§طھ: ${formatNumber(calculated.length, 0)}`,
    `ط·ظ„ط¨ط§طھ ظ…ظپطھظˆط­ط©: ${formatNumber(openOrders.length, 0)}`,
    `ط¯ط§ط®ظ„ ط§ظ„ظ…طµط¨ط؛ط©: ${formatNumber(dyehouse.reduce((total, order)=>total + Number(order.remainingAtDyehouse || order.totalSentToDyehouse || 0), 0))} ظƒط¬ظ…`,
    `ط¬ط§ظ‡ط² ظ„ظ„طھط³ظ„ظٹظ…: ${formatNumber(ready.reduce((total, order)=>total + Number(order.warehouseBalance || 0), 0))} ظƒط¬ظ…`,
  ];
  if (settings.includeDyehouse && dyehouse.length) {
    lines.push('', 'ط£ط¹ظ„ظ‰ ط£ط±طµط¯ط© ط¯ط§ط®ظ„ ط§ظ„ظ…طµط¨ط؛ط©:');
    lines.push(...topOrderLines(dyehouse, (order)=>`- ${order.orderNumber} / ${order.customer || '-'} / ${order.fabricType || '-'} / ${order.dyehouse || '-'}: ${formatNumber(order.remainingAtDyehouse || order.totalSentToDyehouse || 0)} ظƒط¬ظ…`));
  }
  if (settings.includeReady && ready.length) {
    lines.push('', 'ط¬ط§ظ‡ط² ظ„ظ„طھط³ظ„ظٹظ…:');
    lines.push(...topOrderLines(ready, (order)=>`- ${order.orderNumber} / ${order.customer || '-'} / ${order.fabricType || '-'}: ${formatNumber(order.warehouseBalance || 0)} ظƒط¬ظ…`));
  }
  if (settings.includeDelayed && delayed.length) {
    lines.push('', 'ط·ظ„ط¨ط§طھ ظ…طھط£ط®ط±ط©:');
    lines.push(...topOrderLines(delayed, (order)=>`- ${order.orderNumber} / ${order.customer || '-'} / ${order.fabricType || '-'}: ${formatNumber(order.delayDays, 0)} ظٹظˆظ…`));
  }
  if (settings.includeWaste && waste.length) {
    lines.push('', 'ط£ط¹ظ„ظ‰ ظ‡ط§ظ„ظƒ:');
    lines.push(...topOrderLines(waste, (order)=>`- ${order.orderNumber} / ${order.customer || '-'} / ${order.fabricType || '-'}: ${formatNumber(order.totalWastePercent || 0, 1)}%`));
  }
  lines.push('', 'ظ…ط±ط³ظ„ طھظ„ظ‚ط§ط¦ظٹظ‹ط§ ظ…ظ† ظ†ط¸ط§ظ… 2B Tex.');
  return lines.join('\n');
}
function enqueueScheduledWhatsappReport(settings = scheduledReportSettings(), runKey = scheduledReportRunKey(settings)) {
  const targetGroup = String(settings.groupName || whatsappSettings.dyehousesReportGroupName || '').trim();
  if (!targetGroup) return null;
  const existing = reportOutbox.find((item)=>item.reportType === 'scheduled_operations_report' && item.orderNumber === runKey && item.targetGroup === targetGroup);
  if (existing) return existing;
  const row = {
    id: uid(),
    reportType: 'scheduled_operations_report',
    orderNumber: runKey,
    customerName: '2B Tex',
    targetGroup,
    messageText: buildScheduledOperationsReportText(settings),
    attachmentPath: '',
    status: 'pending',
    createdAt: nowIso(),
    sendingAt: null,
    sentAt: null,
    errorMessage: '',
    retryCount: 0,
  };
  reportOutbox.unshift(row);
  recordAudit('create', 'reportOutbox', row.id, null, row, 'ط¥ط¶ط§ظپط© طھظ‚ط±ظٹط± ط§ظ„طھط´ط؛ظٹظ„ ط§ظ„ط¯ظˆط±ظٹ ط¥ظ„ظ‰ ظ‚ط§ط¦ظ…ط© ط§ظ„ط¥ط±ط³ط§ظ„');
  save();
  syncOutboxToWhatsappService();
  return row;
}
function runScheduledWhatsappReports(force = false) {
  ensureRuntimeCollections();
  const settings = scheduledReportSettings();
  if (!settings.enabled || !whatsappSettings.sendingEnabled) return null;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [hour, minute] = String(settings.time || '09:00').split(':').map((value)=>Number(value || 0));
  const dueMinutes = Math.max(0, Math.min(1439, (Number(hour || 0) * 60) + Number(minute || 0)));
  const runKey = scheduledReportRunKey(settings, now);
  if (!force && (currentMinutes < dueMinutes || settings.lastRunKey === runKey)) return null;
  const row = enqueueScheduledWhatsappReport(settings, runKey);
  if (!row) return null;
  whatsappSettings.scheduledReports = { ...settings, lastRunKey:runKey };
  save();
  saveBackendSetting('whatsappSettings', whatsappSettings).catch((error)=>console.warn('whatsapp-schedule-save-failed', error));
  return row;
}
function startWhatsappScheduleTimer() {
  if (whatsappScheduleTimer) clearInterval(whatsappScheduleTimer);
  whatsappScheduleTimer = setInterval(()=>runScheduledWhatsappReports(false), 60000);
  runScheduledWhatsappReports(false);
}
async function syncOutboxToWhatsappService() {
  try {
    const response = await fetch(`${WHATSAPP_SERVICE_URL}/api/outbox/sync`, { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ outbox:reportOutbox, settings:whatsappSettings }) });
    if (!response.ok) throw new Error('service-offline');
    const data = await response.json();
    whatsappStatus = { ...(data.whatsapp || whatsappStatus), processing:data.processing || null, outboxSummary:data.outboxSummary || null };
    save();
    updateWhatsappStatusBadge();
    return data;
  } catch (error) {
    whatsappStatus = { ...whatsappStatus, errorMessage:'ط®ط¯ظ…ط© ظˆط§طھط³ط§ط¨ ط؛ظٹط± ظ…طھط§ط­ط© ظ„ظ„ظ…ط²ط§ظ…ظ†ط©', processing:{ blockedReason:error.message || String(error) } };
    save();
    updateWhatsappStatusBadge();
    return null;
  }
}
async function pollWhatsappService() {
  ensureRuntimeCollections();
  try {
    const response = await fetch(`${WHATSAPP_SERVICE_URL}/api/status`);
    if (!response.ok) throw new Error('service-offline');
    const data = await response.json();
    whatsappStatus = { ...(data.whatsapp || { status:'disconnected', updatedAt:nowIso(), errorMessage:'' }), processing:data.processing || null, outboxSummary:data.outboxSummary || null };
    if (Array.isArray(data.outbox)) {
      const localById = new Map(reportOutbox.map((item)=>[item.id,item]));
      data.outbox.forEach((remote)=>{ localById.set(remote.id, { ...(localById.get(remote.id) || {}), ...remote }); });
      reportOutbox = [...localById.values()].sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
    }
    save();
    updateWhatsappStatusBadge();
    if (selectedOrderId && refs.orderDetailsPanel?.querySelector('.report-send-status') && !orderDetailsHasActiveDraft()) renderDetails();
  } catch {
    whatsappStatus = { status:'disconnected', updatedAt:nowIso(), errorMessage:'ط®ط¯ظ…ط© ظˆط§طھط³ط§ط¨ ط؛ظٹط± ظ…طھطµظ„ط© ط­ط§ظ„ظٹظ‹ط§', processing:null, outboxSummary:null };
    updateWhatsappStatusBadge();
  }
}
function whatsappConnectionStatusText() {
  return { connected:'ظ…طھطµظ„', waiting_for_qr:'ط¨ط§ظ†طھط¸ط§ط± ط±ط¨ط· ظˆط§طھط³ط§ط¨', disconnected:'ط؛ظٹط± ظ…طھطµظ„' }[whatsappStatus?.status] || whatsappStatus?.status || 'ط؛ظٹط± ظ…طھطµظ„';
}
function whatsappConnectionPanelHtml() {
  const statusText = whatsappConnectionStatusText();
  const blockedReason = whatsappStatus?.processing?.blockedReason || '';
  const summary = whatsappStatus?.outboxSummary || {};
  const diagnosticHtml = blockedReason || summary.total
    ? `<div class="notice ${blockedReason ? 'warning' : 'success'}"><strong>????? ???????:</strong> ${escapeHtml(blockedReason || '???? ??????? ??? ???? ?????? pending.')}<br><span class="muted">Pending: ${formatNumber(summary.pending || 0)} / Failed: ${formatNumber(summary.failed || 0)} / Sent: ${formatNumber(summary.sent || 0)}</span></div>`
    : '';
  const qrHtml = whatsappStatus?.qrDataUrl
    ? `<div class="notice"><strong>???? ??? ?????? ?? ????????</strong><br><span class="muted">?? ??? ???? ??? ??????? ???? ????? ?????? ??? ??? ????? ????? ????????.</span><br><img data-whatsapp-qr src="${escapeHtml(whatsappStatus.qrDataUrl)}" alt="WhatsApp QR" style="width:220px;max-width:100%;margin-top:10px;border:1px solid #d8dee9;border-radius:8px;background:#fff;padding:8px"></div>`
    : '';
  return `<div class="notice ${whatsappStatus?.status === 'connected' ? 'success' : 'warning'}"><strong>???? ??????:</strong> ${escapeHtml(statusText)}${whatsappStatus?.errorMessage ? ` - ${escapeHtml(whatsappStatus.errorMessage)}` : ''}</div>${diagnosticHtml}${qrHtml}`;
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
      whatsappStatus = { ...(data.whatsapp || { status:'disconnected', updatedAt:nowIso(), errorMessage:'' }), processing:data.processing || null, outboxSummary:data.outboxSummary || null };
      save();
      updateWhatsappStatusBadge();
      updateWhatsappSettingsConnectionPanel();
    } catch {
      whatsappStatus = { status:'disconnected', updatedAt:nowIso(), errorMessage:'ط®ط¯ظ…ط© ظˆط§طھط³ط§ط¨ ط؛ظٹط± ظ…طھطµظ„ط© ط­ط§ظ„ظٹظ‹ط§', processing:null, outboxSummary:null };
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
  const rows = reportRowsForOrder(order).map((row)=>`<tr><td>${escapeHtml(reportTypeLabels[row.reportType] || row.reportType)}</td><td>${escapeHtml(row.targetGroup || '-')}</td><td>${reportTypeIcons[row.status] || ''} ${reportStatusText[row.status] || row.status}</td><td>${row.sentAt ? arDateTime(row.sentAt) : '-'}</td><td>${escapeHtml(row.errorMessage || '-')}</td><td>${row.id && row.status === 'failed' ? `<button class="mini-btn" data-retry-outbox="${row.id}">ط¥ط¹ط§ط¯ط© ط§ظ„ظ…ط­ط§ظˆظ„ط©</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="6">ظ„ط§ طھظˆط¬ط¯ طھظ‚ط§ط±ظٹط± ظپظٹ ظ‚ط§ط¦ظ…ط© ط§ظ„ط¥ط±ط³ط§ظ„.</td></tr>';
  return `<section class="report-send-status panel-card"><div class="subsection-head"><div><h3>ط­ط§ظ„ط© ظ…ط´ط§ط±ظƒط© ط§ظ„طھظ‚ط§ط±ظٹط±</h3><p class="eyebrow">ط§ظ„ظ…ط´ط§ط±ظƒط© ط§ظ„طھظ„ظ‚ط§ط¦ظٹط© طھط¹ظ…ظ„ ظپظ‚ط· ط¹ظ†ط¯ طھظپط¹ظٹظ„ ظˆط§طھط³ط§ط¨ ظˆط±ط¨ط· ط§ظ„ط¬ط±ظˆط¨ط§طھ.</p></div></div><table><thead><tr><th>ط§ظ„طھظ‚ط±ظٹط±</th><th>ط§ظ„ط¬ط±ظˆط¨</th><th>ط§ظ„ط­ط§ظ„ط©</th><th>ظˆظ‚طھ ط§ظ„ط¥ط±ط³ط§ظ„</th><th>ظ…ظ„ط§ط­ط¸ط§طھ</th><th>ط¥ط¬ط±ط§ط،</th></tr></thead><tbody>${rows}</tbody></table></section>`;
}
// LEGACY DOCUMENT FUNCTION - pending cleanup: overridden by the active Arabic whatsappGroupsPromptHint implementation.
async function whatsappGroupsPromptHint() {
  try {
    const response = await fetch(`${WHATSAPP_SERVICE_URL}/api/groups`);
    if (!response.ok) return '';
    const data = await response.json();
    const names = (data.groups || []).map((group)=>group.name).filter(Boolean).slice(0, 20);
    return names.length ? `\n\nط§ظ„ط¬ط±ظˆط¨ط§طھ ط§ظ„ظ…طھط§ط­ط© ط­ط§ظ„ظٹظ‹ط§:\n${names.join('\n')}\n\nط§ظƒطھط¨ ط§ط³ظ… ط§ظ„ط¬ط±ظˆط¨ ظƒظ…ط§ ظٹط¸ظ‡ط± ظ‡ظ†ط§.` : '';
  } catch {
    return '';
  }
}
function whatsappSettingsRowHtml(type, label, name = '', group = '') {
  return `<tr data-whatsapp-group-row data-group-type="${escapeHtml(type)}">
    <td><input type="text" data-entity-name value="${escapeHtml(name)}" placeholder="${escapeHtml(label)}"></td>
    <td><input type="text" data-group-name value="${escapeHtml(group)}" placeholder="ط§ط³ظ… ط¬ط±ظˆط¨ ظˆط§طھط³ط§ط¨"></td>
    <td><button class="mini-btn" type="button" data-delete-group-row>ط­ط°ظپ</button></td>
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
    <div class="subsection-head"><h3>${escapeHtml(title)}</h3><button class="mini-btn" type="button" data-add-whatsapp-group-row="${escapeHtml(type)}" data-row-label="${escapeHtml(label)}">ط¥ط¶ط§ظپط©</button></div>
    <table>
      <thead><tr><th>${escapeHtml(label)}</th><th>ط§ط³ظ… ط¬ط±ظˆط¨ ظˆط§طھط³ط§ط¨</th><th>ط¥ط¬ط±ط§ط،</th></tr></thead>
      <tbody data-whatsapp-group-rows="${escapeHtml(type)}">${rowsHtml}</tbody>
    </table>
  </section>`;
}
function renderWhatsappSettingsDialog(groupNames = []) {
  ensureRuntimeCollections();
  const groupOptions = groupNames.map((name)=>`<option value="${escapeHtml(name)}"></option>`).join('');
  const schedule = scheduledReportSettings();
  refs.documentTitle.textContent = 'ط¥ط¹ط¯ط§ط¯ط§طھ ظˆط§طھط³ط§ط¨';
  refs.documentBody.dataset.documentType = 'whatsapp-settings';
  refs.documentBody.innerHTML = `<div class="document-sheet whatsapp-settings-sheet">
    <h2>ط¥ط¹ط¯ط§ط¯ط§طھ ظˆط§طھط³ط§ط¨</h2>
    <p class="muted">ط§ط±ط¨ط· ظƒظ„ ط¹ظ…ظٹظ„ ط£ظˆ ظ…طµط¨ط؛ط© ط£ظˆ ظ…طµط¯ط± ظ†ط³ظٹط¬ ط¨ط§ظ„ط¬ط±ظˆط¨ ط§ظ„طµط­ظٹط­. ط§ظ„ط¥ط±ط³ط§ظ„ ط§ظ„طھظ„ظ‚ط§ط¦ظٹ ظ„ط§ ظٹط¹ظ…ظ„ ط¥ظ„ط§ ط¹ظ†ط¯ طھظپط¹ظٹظ„ظ‡ طµط±ط§ط­ط©.</p>
    <div data-whatsapp-connection-panel>${whatsappConnectionPanelHtml()}</div>
    <div class="summary-grid">
      <label><span>ط¬ط±ظˆط¨ ط§ظ„طھظ‚ط§ط±ظٹط± ط§ظ„ط¹ط§ظ…ط©</span><input type="text" data-general-report-group value="${escapeHtml(whatsappSettings.dyehousesReportGroupName || '')}" placeholder="ظ…ط«ط§ظ„: طھظ‚ط§ط±ظٹط± ط§ظ„ظ…طµط§ط¨ط؛"></label>
      <label class="checkbox-row"><input type="checkbox" data-sending-enabled ${whatsappSettings.sendingEnabled ? 'checked' : ''}> <span>طھظپط¹ظٹظ„ ط§ظ„ط¥ط±ط³ط§ظ„ ط§ظ„طھظ„ظ‚ط§ط¦ظٹ ط¹ظ†ط¯ طھط´ط؛ظٹظ„ ط®ط¯ظ…ط© ظˆط§طھط³ط§ط¨</span></label>
    </div>
    <section class="whatsapp-settings-section">
      <div class="subsection-head">
        <h3>ط§ظ„طھظ‚ط§ط±ظٹط± ط§ظ„ط¯ظˆط±ظٹط©</h3>
        <button class="mini-btn" type="button" data-run-whatsapp-schedule-now>ط¥ط±ط³ط§ظ„ طھط¬ط±ط¨ط© ط§ظ„ط¢ظ†</button>
      </div>
      <div class="summary-grid">
        <label class="checkbox-row"><input type="checkbox" data-schedule-enabled ${schedule.enabled ? 'checked' : ''}> <span>طھظپط¹ظٹظ„ ط¥ط±ط³ط§ظ„ طھظ‚ط±ظٹط± ط§ظ„طھط´ط؛ظٹظ„ ط§ظ„ط¯ظˆط±ظٹ</span></label>
        <label><span>ظˆظ‚طھ ط§ظ„ط¥ط±ط³ط§ظ„ ط§ظ„ظٹظˆظ…ظٹ</span><input type="time" data-schedule-time value="${escapeHtml(schedule.time || '09:00')}"></label>
        <label><span>ط¬ط±ظˆط¨ ط§ظ„طھظ‚ط±ظٹط± ط§ظ„ط¯ظˆط±ظٹ</span><input type="text" data-schedule-group value="${escapeHtml(schedule.groupName || whatsappSettings.dyehousesReportGroupName || '')}" list="whatsappGroupNames" placeholder="ط§ط³ظ… ط¬ط±ظˆط¨ ظˆط§طھط³ط§ط¨"></label>
      </div>
      <div class="summary-grid compact">
        <label class="checkbox-row"><input type="checkbox" data-schedule-section="includeOperations" ${schedule.includeOperations ? 'checked' : ''}> <span>ظ…ظ„ط®طµ ط§ظ„طھط´ط؛ظٹظ„</span></label>
        <label class="checkbox-row"><input type="checkbox" data-schedule-section="includeDyehouse" ${schedule.includeDyehouse ? 'checked' : ''}> <span>ط¯ط§ط®ظ„ ط§ظ„ظ…طµط¨ط؛ط©</span></label>
        <label class="checkbox-row"><input type="checkbox" data-schedule-section="includeReady" ${schedule.includeReady ? 'checked' : ''}> <span>ط¬ط§ظ‡ط² ظ„ظ„طھط³ظ„ظٹظ…</span></label>
        <label class="checkbox-row"><input type="checkbox" data-schedule-section="includeDelayed" ${schedule.includeDelayed ? 'checked' : ''}> <span>ط§ظ„ط·ظ„ط¨ط§طھ ط§ظ„ظ…طھط£ط®ط±ط©</span></label>
        <label class="checkbox-row"><input type="checkbox" data-schedule-section="includeWaste" ${schedule.includeWaste ? 'checked' : ''}> <span>ط£ط¹ظ„ظ‰ ظ‡ط§ظ„ظƒ</span></label>
      </div>
      <p class="muted">ط§ظ„طھظ‚ط±ظٹط± ط§ظ„ط¯ظˆط±ظٹ ظٹظڈط±ط³ظ„ ظƒط±ط³ط§ظ„ط© طھط´ط؛ظٹظ„ ظ†طµظٹط© ظ…ظ† ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ†ط¸ط§ظ… ط§ظ„ط­ط§ظ„ظٹط©. ظ…ط³طھظ†ط¯ط§طھ PDF/PNG طھط¸ظ„ ظ…ظ† ظ‚ط§ط¦ظ…ط© ط§ظ„ظ…ط³طھظ†ط¯ط§طھ ط­طھظ‰ ظ†ط¶ظٹظپ ظ…ظˆظ„ط¯ PDF ظ…ظ† ط§ظ„ط³ظٹط±ظپط±.</p>
    </section>
    ${whatsappSettingsSectionHtml('dyehouse', 'ط±ط¨ط· ط§ظ„ظ…طµط§ط¨ط؛ ط¨ط§ظ„ط¬ط±ظˆط¨ط§طھ', 'ط§ط³ظ… ط§ظ„ظ…طµط¨ط؛ط©', whatsappSettings.dyehouseGroups, knownDyehouseNames())}
    ${whatsappSettingsSectionHtml('weaving', 'ط±ط¨ط· ظ…طµط§ط¯ط± ط§ظ„ظ†ط³ظٹط¬ ط¨ط§ظ„ط¬ط±ظˆط¨ط§طھ', 'ظ…طµط¯ط± ط§ظ„ظ†ط³ظٹط¬', whatsappSettings.weavingGroups, knownWeavingNames())}
    ${whatsappSettingsSectionHtml('customer', 'ط±ط¨ط· ط§ظ„ط¹ظ…ظ„ط§ط، ط¨ط§ظ„ط¬ط±ظˆط¨ط§طھ', 'ط§ط³ظ… ط§ظ„ط¹ظ…ظٹظ„', whatsappSettings.customerGroups, knownCustomerNames())}
    <datalist id="whatsappGroupNames">${groupOptions}</datalist>
    <div class="document-actions no-print">
      <button class="primary-btn" type="button" data-save-whatsapp-settings>ط­ظپط¸ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ</button>
    </div>
  </div>`;
  refs.documentBody.querySelectorAll('[data-group-name]').forEach((input)=>input.setAttribute('list', 'whatsappGroupNames'));
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
  startWhatsappSettingsAutoRefresh();
}
async function saveWhatsappSettingsFromDialog() {
  if (!(await ensureBackendForWrite('طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط¨ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط­ظپط¸ ط¥ط¹ط¯ط§ط¯ط§طھ ظˆط§طھط³ط§ط¨.'))) return;
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
    scheduledReports: {
      ...scheduledReportSettings(),
      enabled: !!refs.documentBody.querySelector('[data-schedule-enabled]')?.checked,
      time: refs.documentBody.querySelector('[data-schedule-time]')?.value || '09:00',
      groupName: refs.documentBody.querySelector('[data-schedule-group]')?.value.trim() || refs.documentBody.querySelector('[data-general-report-group]')?.value.trim() || '',
      includeOperations: !!refs.documentBody.querySelector('[data-schedule-section="includeOperations"]')?.checked,
      includeDyehouse: !!refs.documentBody.querySelector('[data-schedule-section="includeDyehouse"]')?.checked,
      includeReady: !!refs.documentBody.querySelector('[data-schedule-section="includeReady"]')?.checked,
      includeDelayed: !!refs.documentBody.querySelector('[data-schedule-section="includeDelayed"]')?.checked,
      includeWaste: !!refs.documentBody.querySelector('[data-schedule-section="includeWaste"]')?.checked,
    },
  };
  const saved = await saveBackendSetting('whatsappSettings', nextSettings);
  if (!saved) {
    await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط¥ط¹ط¯ط§ط¯ط§طھ ظˆط§طھط³ط§ط¨ ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„طھط¹ط¯ظٹظ„.');
    return;
  }
  whatsappSettings = nextSettings;
  recordAudit('update', 'whatsappSettings', 'groups', before, whatsappSettings, 'طھط­ط¯ظٹط« ط¥ط¹ط¯ط§ط¯ط§طھ ظ…ط¬ظ…ظˆط¹ط§طھ ظˆط§طھط³ط§ط¨');
  refreshOutboxTargetsAfterSettings();
  await saveBackendSetting('auditLog', auditLog);
  save();
  syncOutboxToWhatsappService();
  await loadBackendData();
  renderWhatsappSettingsDialog();
  alert(whatsappSettings.sendingEnabled ? 'طھظ… ط­ظپط¸ ط¥ط¹ط¯ط§ط¯ط§طھ ظˆط§طھط³ط§ط¨ ظˆطھظپط¹ظٹظ„ ط§ظ„ط¥ط±ط³ط§ظ„.' : 'طھظ… ط­ظپط¸ ط¥ط¹ط¯ط§ط¯ط§طھ ظˆط§طھط³ط§ط¨ ظ…ط¹ ط¨ظ‚ط§ط، ط§ظ„ط¥ط±ط³ط§ظ„ ط§ظ„طھظ„ظ‚ط§ط¦ظٹ ظ…طھظˆظ‚ظپظ‹ط§.');
}
function isLegacyRecoveredText(value) {
  const text = String(value || '');
  const legacyText = ['ظ†طµ','ظ‚ط¯ظٹظ…','ط؛ظٹط±','ظ…ط³طھط¹ط§ط¯'].join(' ');
  return text.includes(legacyText) || /\uFFFD|أ¯طںآ½|\?{3,}/.test(text);
}
function normalizeDyehousePriceLabel(value) {
  const text = String(value || '')
    .trim()
    .replace(/ظƒط³ط± ط¨ظٹط§ط¶/g, 'ظƒط³طھط±ط©')
    .replace(/ط£ط³ظˆط¯ ظ…ط®طµظˆطµ/g, 'ط£ط³ظˆط¯ ط®ط§طµ')
    .replace(/ط¨ظ†ظٹ ط؛ط§ظ…ظ‚/g, 'ط£ظ„ظˆط§ظ† ط®ط§طµط©')
    .replace(/^ط®طµظˆطµ$/g, 'ط£ظ„ظˆط§ظ† ط®ط§طµط©')
    .replace(/^ط£ظ„ظˆط§ظ†$/g, 'ط£ظ„ظˆط§ظ† ط®ط§طµط©');
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
  if (!(await ensureBackendForWrite('طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط¨ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط­ظپط¸ ط£ط³ط¹ط§ط± ط§ظ„ظ…طµط§ط¨ط؛.'))) return;
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
    await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط£ط³ط¹ط§ط± ط§ظ„ظ…طµط§ط¨ط؛ ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„طھط¹ط¯ظٹظ„.');
    return;
  }
  recordAudit('update', 'dyehousePriceLibrary', 'pricing', before, customDyehousePriceLibrary, 'طھط­ط¯ظٹط« ط£ط³ط¹ط§ط± ط§ظ„ظ…طµط§ط¨ط؛');
  await saveBackendSetting('auditLog', auditLog);
  await loadBackendData();
  applyPricingDyehouseOptions();
  updateSuggestedDyeCost();
  renderDyehousePricesDialog();
  alert('طھظ… ط­ظپط¸ ط£ط³ط¹ط§ط± ط§ظ„ظ…طµط§ط¨ط؛ ط¨ظ†ط¬ط§ط­.');
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
function isFinishedStockSale(batch = {}) {
  return String(batch.movement || '').trim() === 'finished_sale' && String(batch.customerName || '').trim();
}
function isFinishedStockTransferOut(batch = {}) {
  return String(batch.movement || '').trim() === 'finished_transfer_out';
}
function isInternalWarehouseMovement(batch = {}) {
  return isFinishedStockSale(batch) || isFinishedStockTransferOut(batch);
}
function orderLedgerDeliveredQuantity(order) {
  const allocationIds = allocations.filter((allocation)=>allocation.orderId === order.id).map((allocation)=>allocation.id);
  return roundNumber(customerBatches
    .filter((batch)=>allocationIds.includes(batch.allocationId) && !isInternalWarehouseMovement(batch))
    .reduce((total, batch)=>total + Number(batch.quantity || 0), 0));
}
function finishedStockSaleInvoices(customerName) {
  const name = String(customerName || '').trim();
  if (!name) return [];
  return customerBatches
    .filter((batch)=>isFinishedStockSale(batch) && String(batch.customerName || '').trim() === name)
    .map((batch)=>{
      const sourceOrder = orders.find((order)=>order.id === batch.orderId) || {};
      const sourceAllocation = allocations.find((allocation)=>allocation.id === batch.allocationId) || {};
      const quantity = Number(batch.quantity || 0);
      const unitPrice = Number(batch.unitPrice || sourceOrder.kiloPrice || 0);
      const amount = Number(batch.totalPrice || 0) || roundNumber(quantity * unitPrice);
      return {
        id: batch.id,
        orderNumber: sourceOrder.orderNumber || batch.orderId || '-',
        date: batch.date,
        item: [sourceOrder.fabricType, sourceAllocation.color].filter(Boolean).join(' / ') || 'ط¨ظٹط¹ ظ…ط¬ظ‡ط²',
        quantity,
        unitPrice,
        amount: roundNumber(amount),
        status: 'ط¨ظٹط¹ ظ…ط¬ظ‡ط² ظ…ظ† ط§ظ„ظ…ط®ط²ظ†',
      };
    });
}
function customerAccountInvoices(customerName) {
  const name = String(customerName || '').trim();
  const orderInvoices = orders
    .filter((order)=>String(order.customer || '').trim() === name)
    .map(calculateOrder)
    .map((order)=>{
      const deliveredQuantity = orderLedgerDeliveredQuantity(order);
      const contractQuantity = Number(order.totalRawQuantity || order.totalRawOrdered || 0);
      const hasFinishedSaleFromOrder = customerBatches.some((batch)=>batch.orderId === order.id && isFinishedStockSale(batch));
      const invoiceQuantity = deliveredQuantity || (order.operationClosed && !hasFinishedSaleFromOrder ? contractQuantity : 0);
      const unitPrice = Number(order.kiloPrice || 0);
      return {
        id: order.id,
        orderNumber: order.orderNumber,
        date: order.orderDate,
        item: order.fabricType,
        quantity: invoiceQuantity,
        unitPrice,
        amount: roundNumber(invoiceQuantity * unitPrice),
        status: deliveredQuantity ? 'طھظ… ط§ظ„طھط³ظ„ظٹظ…' : (order.operationClosed ? 'ظ…ط؛ظ„ظ‚ ط¨ط¯ظˆظ† طھط³ظ„ظٹظ…' : 'طھط­طھ ط§ظ„طھط´ط؛ظٹظ„'),
      };
    });
  return [...orderInvoices, ...finishedStockSaleInvoices(name)].sort((a, b)=>String(a.date || '').localeCompare(String(b.date || '')));
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
  return uniqueNonEmpty([...customerMasterRows().map((customer)=>customer.name), ...orders.map((order)=>order.customer), ...pricings.map((pricing)=>pricing.customer), ...customerBatches.map((batch)=>batch.customerName), ...Object.keys(customerAccounts || {})]);
}
function customerMasterTableRows() {
  const rows = customerMasterRows().slice().sort((a,b)=>String(a.name).localeCompare(String(b.name), 'ar'));
  return rows.map((customer)=>{
    const deleteAction = canDeleteRecords?.() ? `<button class="mini-btn danger" type="button" data-delete-customer-master="${escapeHtml(customer.id)}">ط­ط°ظپ</button>` : '';
    return `<tr>
    <td>${escapeHtml(customer.name)}</td>
    <td>${escapeHtml(customer.phone || '-')}</td>
    <td>${escapeHtml(customer.notes || '-')}</td>
    <td class="no-print"><div class="batch-actions"><button class="mini-btn" type="button" data-edit-customer-master="${escapeHtml(customer.id)}">طھط¹ط¯ظٹظ„</button><button class="mini-btn" type="button" data-customer-ledger="${escapeHtml(customer.name)}">ظƒط´ظپ ط§ظ„ط­ط³ط§ط¨</button>${deleteAction}</div></td>
  </tr>`;
  }).join('') || '<tr><td colspan="4">ظ„ط§ طھظˆط¬ط¯ ط¨ظٹط§ظ†ط§طھ ط¹ظ…ظ„ط§ط، ظ…ط³ط¬ظ„ط©.</td></tr>';
}
function customerMasterSectionHtml() {
  return `<section class="report-section no-print">
    <h3>ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¹ظ…ظ„ط§ط،</h3>
    <div class="summary-grid">
      <input type="hidden" data-customer-master-id>
      <input data-customer-master-name placeholder="ط§ط³ظ… ط§ظ„ط¹ظ…ظٹظ„ ط§ظ„ط±ط³ظ…ظٹ">
      <input data-customer-master-phone placeholder="ط±ظ‚ظ… ط§ظ„ظ‡ط§طھظپ">
      <input data-customer-master-notes placeholder="ظ…ظ„ط§ط­ط¸ط§طھ">
      <button class="primary-btn" type="button" data-save-customer-master>ط­ظپط¸ ط§ظ„ط¹ظ…ظٹظ„</button>
      <button class="mini-btn" type="button" data-clear-customer-master>ط¹ظ…ظٹظ„ ط¬ط¯ظٹط¯</button>
    </div>
    <p class="muted">ط§ظ„ظ†ط¸ط§ظ… ظٹط·ط§ط¨ظ‚ ط£ط³ظ…ط§ط، ط§ظ„ط¹ظ…ظ„ط§ط، ط¨ط¹ط¯ طھظˆط­ظٹط¯ ط§ظ„ظ‡ظ…ط²ط§طھ ظˆط§ظ„ظ…ط³ط§ظپط§طھطŒ ظ„ط°ظ„ظƒ ط£ظ…ظ„/ط§ظ…ظ„/ط¥ظ…ظ„ طھط¹طھط¨ط± ظ†ظپط³ ط§ظ„ط¹ظ…ظٹظ„.</p>
    <table class="customer-ledger-table"><thead><tr><th>ط§ظ„ط¹ظ…ظٹظ„</th><th>ط§ظ„ظ‡ط§طھظپ</th><th>ظ…ظ„ط§ط­ط¸ط§طھ</th><th class="no-print">ط¥ط¬ط±ط§ط،</th></tr></thead><tbody>${customerMasterTableRows()}</tbody></table>
  </section>`;
}
function customerMasterFormRefs() {
  return {
    id: refs.documentBody.querySelector('[data-customer-master-id]'),
    name: refs.documentBody.querySelector('[data-customer-master-name]'),
    phone: refs.documentBody.querySelector('[data-customer-master-phone]'),
    notes: refs.documentBody.querySelector('[data-customer-master-notes]'),
  };
}
function clearCustomerMasterForm() {
  const formRefs = customerMasterFormRefs();
  if (formRefs.id) formRefs.id.value = '';
  if (formRefs.name) formRefs.name.value = '';
  if (formRefs.phone) formRefs.phone.value = '';
  if (formRefs.notes) formRefs.notes.value = '';
  formRefs.name?.focus();
}
function fillCustomerMasterForm(customerId) {
  const customer = customerMasterRows().find((item)=>String(item.id) === String(customerId));
  if (!customer) return;
  const formRefs = customerMasterFormRefs();
  if (formRefs.id) formRefs.id.value = customer.id || '';
  if (formRefs.name) formRefs.name.value = customer.name || '';
  if (formRefs.phone) formRefs.phone.value = customer.phone || '';
  if (formRefs.notes) formRefs.notes.value = customer.notes || '';
  formRefs.name?.focus();
}
async function saveCustomerMasterFromDialog() {
  const formRefs = customerMasterFormRefs();
  const id = formRefs.id?.value || '';
  const name = cleanCustomerDisplayName(formRefs.name?.value || '');
  const phone = String(formRefs.phone?.value || '').trim();
  const notes = String(formRefs.notes?.value || '').trim();
  if (!name) { alert('ط§ظƒطھط¨ ط§ط³ظ… ط§ظ„ط¹ظ…ظٹظ„.'); return; }
  const normalized = normalizeCustomerMasterName(name);
  const duplicate = customerMasterRows().find((customer)=>normalizeCustomerMasterName(customer.name) === normalized && String(customer.id) !== String(id));
  if (duplicate) {
    alert(`ط§ظ„ط¹ظ…ظٹظ„ ظ…ظˆط¬ظˆط¯ ط¨ط§ظ„ظپط¹ظ„ ط¨ط§ط³ظ…: ${duplicate.name}`);
    fillCustomerMasterForm(duplicate.id);
    return;
  }
  if (!(await ensureBackendForWrite('طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط¨ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط­ظپط¸ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¹ظ…ظٹظ„.'))) return;
  const customerId = id || backendCustomerId(name);
  const payload = { id: customerId, name, phone, notes };
  const saved = id ? await putBackend(`/customers/${encodeURIComponent(customerId)}`, payload) : await postBackend('/customers', payload);
  if (!saved) {
    await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¹ظ…ظٹظ„ ط¯ط§ط®ظ„ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ.');
    return;
  }
  recordAudit(id ? 'update' : 'create', 'customer', customerId, null, payload, `ط­ظپط¸ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¹ظ…ظٹظ„ ${name}`);
  await persistAuditLog();
  await loadBackendData();
  applyCustomerNameDatalist();
  renderCustomerAccountsDialog();
}
async function deleteCustomerMaster(customerId) {
  const customer = customerMasterRows().find((item)=>String(item.id) === String(customerId));
  if (!customer) return;
  if (!normalizeCustomerMasterName(customer.name)) {
    alert('ط§ط³ظ… ط§ظ„ط¹ظ…ظٹظ„ ط؛ظٹط± ظˆط§ط¶ط­.');
    return;
  }
  const fullDeleteText = `ط­ط°ظپ ظƒط§ظ…ظ„ ظ„ظ„ط¹ظ…ظٹظ„ ${customer.name}طں\n\nط³ظٹطھظ… ط­ط°ظپ ط§ظ„ط¹ظ…ظٹظ„ ظ…ظ† ط§ظ„ظ‚ط§ط¦ظ…ط© ظˆط­ط°ظپ ط£ظٹ ط·ظ„ط¨ط§طھ ط£ظˆ ط¹ط±ظˆط¶ ط³ط¹ط± ط£ظˆ ط­ط±ظƒط§طھ ط¨ظٹط¹/طھط³ظ„ظٹظ… ظ…ط±طھط¨ط·ط© ط¨ظ‡ ظ…ظ† ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ.\nظ‡ط°ظ‡ ط§ظ„ط¹ظ…ظ„ظٹط© ظ„ط§ طھط±ط§ط¬ط¹ ط¥ظ„ط§ ظ…ظ† ط§ظ„ظ†ط³ط® ط§ظ„ط§ط­طھظٹط§ط·ظٹط©.`;
  if (!confirm(fullDeleteText)) return;
  if (!confirm(`طھط£ظƒظٹط¯ ظ†ظ‡ط§ط¦ظٹ: ط­ط°ظپ ظƒط§ظ…ظ„ ظ„ظ„ط¹ظ…ظٹظ„ ${customer.name} ظˆظƒظ„ ط¨ظٹط§ظ†ط§طھظ‡ ط§ظ„ظ…ط±طھط¨ط·ط©طں`)) return;
  if (!(await ensureBackendForWrite('طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط¨ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط­ط°ظپ ط§ظ„ط¹ظ…ظٹظ„.'))) return;
  const deleted = await deleteBackend(`/customers/${encodeURIComponent(customer.id)}/full`);
  if (!deleted?.ok) {
    await rollbackAfterBackendWriteFailure('طھط¹ط°ط± طھظ†ظپظٹط° ط§ظ„ط­ط°ظپ ط§ظ„ظƒط§ظ…ظ„ ظ„ظ„ط¹ظ…ظٹظ„ ظ…ظ† ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ.');
    return;
  }
  if (customerAccounts?.[customer.name]) {
    const nextAccounts = clone(customerAccounts);
    delete nextAccounts[customer.name];
    await saveBackendSetting('customerAccounts', nextAccounts);
    customerAccounts = nextAccounts;
  }
  recordAudit('delete', 'customer', customer.id, customer, deleted.deleted || null, `ط­ط°ظپ ظƒط§ظ…ظ„ ظ„ظ„ط¹ظ…ظٹظ„ ${customer.name}`);
  await persistAuditLog();
  await loadBackendData();
  applyCustomerNameDatalist();
  renderCustomerAccountsDialog();
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
  const rows = summaries.map((item)=>`<tr><td>${escapeHtml(item.customerName)}</td><td>${formatNumber(item.openingBalance)}</td><td>${formatNumber(item.invoiceTotal)}</td><td>${formatNumber(item.paymentTotal)}</td><td><strong>${formatNumber(item.balance)}</strong></td><td class="no-print"><button class="mini-btn" type="button" data-customer-ledger="${escapeHtml(item.customerName)}">ط¹ط±ط¶ ط§ظ„ط­ط³ط§ط¨</button></td></tr>`).join('');
  refs.documentTitle.textContent = 'ط­ط³ط§ط¨ط§طھ ط§ظ„ط¹ظ…ظ„ط§ط،';
  refs.documentBody.dataset.documentType = 'customer-accounts';
  refs.documentBody.innerHTML = `<div class="document-sheet customer-account-sheet">
    <div class="customer-ledger-header">
      <div><p class="muted">ظ†ط¸ط§ظ… 2B Tex</p><h2>ط­ط³ط§ط¨ط§طھ ط§ظ„ط¹ظ…ظ„ط§ط،</h2><span>ظ…ظ„ط®طµ ط£ط±طµط¯ط© ط§ظ„ط¹ظ…ظ„ط§ط، ط¯ط§ط®ظ„ ظ†ط¸ط§ظ… ط§ظ„ظ…طھط§ط¨ط¹ط©.</span></div>
    </div>
    <div class="customer-ledger-summary">
      <div><span>ط¹ط¯ط¯ ط§ظ„ط¹ظ…ظ„ط§ط،</span><strong>${summaries.length}</strong></div>
      <div><span>ط±طµظٹط¯ ط§ظپطھطھط§ط­ظٹ</span><strong>${formatNumber(totals.opening)}</strong></div>
      <div><span>ظ…ط¨ظٹط¹ط§طھ / ظ…ط³طھط­ظ‚ط§طھ</span><strong>${formatNumber(totals.invoices)}</strong></div>
      <div><span>ظ…ط¯ظپظˆط¹ط§طھ</span><strong>${formatNumber(totals.payments)}</strong></div>
      <div class="emphasis"><span>ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط±طµظٹط¯</span><strong>${formatNumber(totals.balance)}</strong></div>
    </div>
    <p class="muted customer-ledger-note">ط§ظ„ط±طµظٹط¯ ط§ظ„ط­ط§ظ„ظٹ = ط§ظ„ط±طµظٹط¯ ط§ظ„ط§ظپطھطھط§ط­ظٹ + ظ…ط³طھط­ظ‚ط§طھ ط§ظ„ط·ظ„ط¨ط§طھ - ط§ظ„ظ…ط¯ظپظˆط¹ط§طھ. ظ‡ط°ظ‡ ط§ظ„ظ‚ط±ط§ط،ط© ط¯ط§ط®ظ„ ظ†ط¸ط§ظ… ط§ظ„ظ…طھط§ط¨ط¹ط© ظپظ‚ط· ظˆظ„ط§ طھط¹ط¯ظ„ ط£ط±طµط¯ط© A5.</p>
    ${customerMasterSectionHtml()}
    <table class="customer-ledger-table"><thead><tr><th>ط§ظ„ط¹ظ…ظٹظ„</th><th>ط±طµظٹط¯ ط§ظپطھطھط§ط­ظٹ</th><th>ظ…ط¨ظٹط¹ط§طھ / ظ…ط³طھط­ظ‚ط§طھ</th><th>ظ…ط¯ظپظˆط¹ط§طھ</th><th>ط§ظ„ط±طµظٹط¯ ط§ظ„ط­ط§ظ„ظٹ</th><th class="no-print">ط¥ط¬ط±ط§ط،</th></tr></thead><tbody>${rows || '<tr><td colspan="6">ظ„ط§ طھظˆط¬ط¯ ط­ط³ط§ط¨ط§طھ ط¹ظ…ظ„ط§ط، ظ…طھط§ط­ط©.</td></tr>'}</tbody></table>
  </div>`;
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
function renderCustomerLedgerDialog(customerName) {
  const summary = customerAccountSummary(customerName);
  const invoiceRows = summary.invoices.map((item)=>`<tr><td>${escapeHtml(item.orderNumber || '-')}</td><td>${escapeHtml(item.date || '-')}</td><td>${escapeHtml(item.item || '-')}</td><td>${formatNumber(item.quantity)}</td><td>${formatNumber(item.unitPrice)}</td><td>${formatNumber(item.amount)}</td><td>${escapeHtml(item.status)}</td></tr>`).join('');
  const paymentRows = summary.payments.map((item)=>`<tr><td>${escapeHtml(item.date || '-')}</td><td>${formatNumber(item.amount)}</td><td>${escapeHtml(item.method || '-')}</td><td>${escapeHtml(item.notes || '-')}</td><td class="no-print"><button class="mini-btn danger" type="button" data-delete-customer-payment="${escapeHtml(item.id)}" data-customer-name="${escapeHtml(summary.customerName)}">ط­ط°ظپ</button></td></tr>`).join('');
  refs.documentTitle.textContent = `ظƒط´ظپ ط­ط³ط§ط¨ ط§ظ„ط¹ظ…ظٹظ„ ${summary.customerName}`;
  refs.documentBody.dataset.documentType = 'customer-ledger';
  refs.documentBody.innerHTML = `<div class="document-sheet customer-ledger-sheet">
    <div class="customer-ledger-header">
      <button class="mini-btn no-print" type="button" data-back-customer-accounts>ط±ط¬ظˆط¹</button>
      <div><p class="muted">ظƒط´ظپ ط­ط³ط§ط¨ ط¹ظ…ظٹظ„</p><h2>${escapeHtml(summary.customerName)}</h2><span>ط­ط±ظƒط§طھ ط§ظ„ط¹ظ…ظٹظ„ ظ…ظ† ظپظˆط§طھظٹط± ط§ظ„ط·ظ„ط¨ط§طھ ظˆط§ظ„ظ…ط¯ظپظˆط¹ط§طھ ط§ظ„ظ…ط³ط¬ظ„ط©.</span></div>
    </div>
    <div class="customer-ledger-summary">
      <div><span>ط±طµظٹط¯ ط§ظپطھطھط§ط­ظٹ</span><strong>${formatNumber(summary.openingBalance)}</strong></div>
      <div><span>ظ…ط¨ظٹط¹ط§طھ / ظ…ط³طھط­ظ‚ط§طھ</span><strong>${formatNumber(summary.invoiceTotal)}</strong></div>
      <div><span>ظ…ط¯ظپظˆط¹ط§طھ</span><strong>${formatNumber(summary.paymentTotal)}</strong></div>
      <div class="emphasis"><span>ط§ظ„ط±طµظٹط¯ ط§ظ„ط­ط§ظ„ظٹ</span><strong>${formatNumber(summary.balance)}</strong></div>
    </div>
    <section class="report-section ledger-edit-section no-print">
      <h3>طھط¹ط¯ظٹظ„ ط§ظ„ط±طµظٹط¯ ط§ظ„ط§ظپطھطھط§ط­ظٹ</h3>
      <div class="summary-grid"><label><span>ط§ظ„ط±طµظٹط¯ ط§ظ„ط§ظپطھطھط§ط­ظٹ</span><input type="number" step="0.01" data-opening-balance value="${summary.openingBalance}"></label><button class="primary-btn" type="button" data-save-opening-balance="${escapeHtml(summary.customerName)}">ط­ظپط¸ ط§ظ„ط±طµظٹط¯</button></div>
    </section>
    <section class="report-section ledger-edit-section no-print">
      <h3>ط¥ط¶ط§ظپط© ط¯ظپط¹ط©</h3>
      <div class="summary-grid"><input type="date" data-payment-date value="${new Date().toISOString().slice(0,10)}"><input type="number" step="0.01" data-payment-amount placeholder="ط§ظ„ظ…ط¨ظ„ط؛"><input data-payment-method placeholder="ط·ط±ظٹظ‚ط© ط§ظ„ط¯ظپط¹"><input data-payment-notes placeholder="ظ…ظ„ط§ط­ط¸ط§طھ"><button class="primary-btn" type="button" data-add-customer-payment="${escapeHtml(summary.customerName)}">ط¥ط¶ط§ظپط© ط¯ظپط¹ط©</button></div>
    </section>
    <section class="report-section"><h3>ظپظˆط§طھظٹط± ط§ظ„ط·ظ„ط¨ط§طھ</h3><table class="customer-ledger-table"><thead><tr><th>ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨</th><th>ط§ظ„طھط§ط±ظٹط®</th><th>ط§ظ„ط¨ظ†ط¯</th><th>ط§ظ„ظƒظ…ظٹط©</th><th>ط³ط¹ط± ط§ظ„ظˆط­ط¯ط©</th><th>ط§ظ„ط¥ط¬ظ…ط§ظ„ظٹ</th><th>ط§ظ„ط­ط§ظ„ط©</th></tr></thead><tbody>${invoiceRows || '<tr><td colspan="7">ظ„ط§ طھظˆط¬ط¯ ظپظˆط§طھظٹط± ظ…ط³ط¬ظ„ط© ظ„ظ‡ط°ط§ ط§ظ„ط¹ظ…ظٹظ„.</td></tr>'}</tbody></table></section>
    <section class="report-section"><h3>ط§ظ„ظ…ط¯ظپظˆط¹ط§طھ</h3><table class="customer-ledger-table"><thead><tr><th>ط§ظ„طھط§ط±ظٹط®</th><th>ط§ظ„ظ…ط¨ظ„ط؛</th><th>ط·ط±ظٹظ‚ط© ط§ظ„ط¯ظپط¹</th><th>ظ…ظ„ط§ط­ط¸ط§طھ</th><th class="no-print">ط¥ط¬ط±ط§ط،</th></tr></thead><tbody>${paymentRows || '<tr><td colspan="5">ظ„ط§ طھظˆط¬ط¯ ظ…ط¯ظپظˆط¹ط§طھ ظ…ط³ط¬ظ„ط© ظ„ظ‡ط°ط§ ط§ظ„ط¹ظ…ظٹظ„.</td></tr>'}</tbody></table></section>
  </div>`;
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
async function saveCustomerOpeningBalance(customerName) {
  const account = ensureCustomerAccount(customerName);
  if (!account) return;
  if (!(await ensureBackendForWrite('طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط¨ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط­ظپط¸ ط­ط³ط§ط¨ ط§ظ„ط¹ظ…ظٹظ„.'))) return;
  const before = clone(account);
  const nextAccounts = clone(customerAccounts);
  nextAccounts[customerName] = { ...(nextAccounts[customerName] || { payments:[] }), openingBalance:Number(refs.documentBody.querySelector('[data-opening-balance]')?.value || 0) };
  const saved = await saveBackendSetting('customerAccounts', nextAccounts);
  if (!saved) {
    await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط­ط³ط§ط¨ ط§ظ„ط¹ظ…ظٹظ„ ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„طھط¹ط¯ظٹظ„.');
    return;
  }
  customerAccounts = nextAccounts;
  recordAudit('update', 'customerAccount', customerName, before, customerAccounts[customerName], `طھط¹ط¯ظٹظ„ ط§ظ„ط±طµظٹط¯ ط§ظ„ط§ظپطھطھط§ط­ظٹ ظ„ظ„ط¹ظ…ظٹظ„ ${customerName}`);
  await saveBackendSetting('auditLog', auditLog);
  await loadBackendData();
  renderCustomerLedgerDialog(customerName);
}
async function addCustomerPayment(customerName) {
  const account = ensureCustomerAccount(customerName);
  if (!account) return;
  const amount = Number(refs.documentBody.querySelector('[data-payment-amount]')?.value || 0);
  if (!amount) { alert('ط£ط¯ط®ظ„ ظ…ط¨ظ„ط؛ ط§ظ„ط¯ظپط¹ط© ظ‚ط¨ظ„ ط§ظ„ط­ظپط¸.'); return; }
  if (!(await ensureBackendForWrite('طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط¨ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط­ظپط¸ ط§ظ„ط¯ظپط¹ط©.'))) return;
  const payment = { id:uid(), date:refs.documentBody.querySelector('[data-payment-date]')?.value || new Date().toISOString().slice(0,10), amount, method:refs.documentBody.querySelector('[data-payment-method]')?.value || '', notes:refs.documentBody.querySelector('[data-payment-notes]')?.value || '' };
  const before = clone(account);
  const nextAccounts = clone(customerAccounts);
  const nextAccount = { ...(nextAccounts[customerName] || { openingBalance:0, payments:[] }) };
  nextAccount.payments = [payment, ...(nextAccount.payments || [])];
  nextAccounts[customerName] = nextAccount;
  const saved = await saveBackendSetting('customerAccounts', nextAccounts);
  if (!saved) {
    await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط¯ظپط¹ط© ط§ظ„ط¹ظ…ظٹظ„ ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ط¯ظپط¹ط©.');
    return;
  }
  customerAccounts = nextAccounts;
  recordAudit('create', 'customerPayment', payment.id, before, nextAccount, `ط¥ط¶ط§ظپط© ط¯ظپط¹ط© ظ„ظ„ط¹ظ…ظٹظ„ ${customerName}`);
  await saveBackendSetting('auditLog', auditLog);
  await loadBackendData();
  renderCustomerLedgerDialog(customerName);
}
async function deleteCustomerPayment(customerName, paymentId) {
  const account = ensureCustomerAccount(customerName);
  if (!account) return;
  if (!(await ensureBackendForWrite('طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط¨ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط­ط°ظپ ط§ظ„ط¯ظپط¹ط©.'))) return;
  const before = clone(account);
  const nextAccounts = clone(customerAccounts);
  const nextAccount = { ...(nextAccounts[customerName] || { openingBalance:0, payments:[] }) };
  nextAccount.payments = (nextAccount.payments || []).filter((payment)=>payment.id !== paymentId);
  nextAccounts[customerName] = nextAccount;
  const saved = await saveBackendSetting('customerAccounts', nextAccounts);
  if (!saved) {
    await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ط°ظپ ط¯ظپط¹ط© ط§ظ„ط¹ظ…ظٹظ„ ظ…ظ† ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ط­ط°ظپ.');
    return;
  }
  customerAccounts = nextAccounts;
  recordAudit('delete', 'customerPayment', paymentId, before, nextAccount, `ط­ط°ظپ ط¯ظپط¹ط© ظ„ظ„ط¹ظ…ظٹظ„ ${customerName}`);
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
      row.errorMessage = 'ظ„ظ… ظٹطھظ… طھط­ط¯ظٹط¯ ط¬ط±ظˆط¨ ظˆط§طھط³ط§ط¨ ظ„ظ‡ط°ط§ ط§ظ„طھظ‚ط±ظٹط±.';
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
  refs.documentTitle.textContent = `ظƒط´ظپ ط­ط³ط§ط¨ A5 - ${name}`;
  refs.documentBody.dataset.documentType = 'a5-ledger';
  refs.documentBody.innerHTML = `<div class="document-sheet">
    <div class="subsection-head"><div><h2>ظƒط´ظپ ط­ط³ط§ط¨ A5</h2><p class="muted">${escapeHtml(name)} - ط¨ظٹط§ظ†ط§طھ ظ‚ط±ط§ط،ط© ظپظ‚ط· ظ…ظ† A5.</p></div><button class="mini-btn no-print" type="button" data-back-a5-accounts>ط±ط¬ظˆط¹</button></div>
    <p class="muted">ط¬ط§ط±ظٹ طھط­ظ…ظٹظ„ ط­ط±ظƒط§طھ ط§ظ„ط­ط³ط§ط¨...</p>
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
      <div class="subsection-head"><div><h2>ظƒط´ظپ ط­ط³ط§ط¨ A5 - ${escapeHtml(name)}</h2><p class="muted">ط­ط±ظƒط§طھ ط§ظ„ط¹ظ…ظٹظ„ ظپظٹ A5 ظ…ط¹ ظ…ظ„ط®طµ ط·ظ„ط¨ط§طھظ‡ ط¯ط§ط®ظ„ ظ†ط¸ط§ظ… ط§ظ„ظ…طھط§ط¨ط¹ط©.</p></div><button class="mini-btn no-print" type="button" data-back-a5-accounts>ط±ط¬ظˆط¹</button></div>
      <div class="summary-grid">
        <div class="metric"><span>ط±طµظٹط¯ ط§ظ„ط¹ظ…ظٹظ„</span><strong>${formatNumber(currentBalance)}</strong></div>
        <div class="metric"><span>ط¥ط¬ظ…ط§ظ„ظٹ ظ…ط¯ظٹظ†</span><strong>${formatNumber(totals.debit)}</strong></div>
        <div class="metric"><span>ط¥ط¬ظ…ط§ظ„ظٹ ط¯ط§ط¦ظ†</span><strong>${formatNumber(totals.credit)}</strong></div>
        <div class="metric"><span>ط¹ط¯ط¯ ط§ظ„ط­ط±ظƒط§طھ</span><strong>${movements.length}</strong></div>
        <div class="metric"><span>ط·ظ„ط¨ط§طھ ط§ظ„ظ…طھط§ط¨ط¹ط©</span><strong>${tracking.ordersCount}</strong></div>
        <div class="metric"><span>طھط­طھ ط§ظ„طھط´ط؛ظٹظ„</span><strong>${tracking.activeOrdersCount}</strong></div>
      </div>
      <table><thead><tr><th>ط§ظ„طھط§ط±ظٹط®</th><th>ظ†ظˆط¹ ط§ظ„ط­ط±ظƒط©</th><th>ط§ظ„ط¨ظٹط§ظ†</th><th>ط±طµظٹط¯ ظ‚ط¨ظ„</th><th>ظ…ط¯ظٹظ†</th><th>ط¯ط§ط¦ظ†</th><th>ط±طµظٹط¯ ط¨ط¹ط¯</th><th>ظ…ط±ط¬ط¹ ط§ظ„ط·ظ„ط¨</th></tr></thead><tbody>${rows || '<tr><td colspan="8">ظ„ط§ طھظˆط¬ط¯ ط­ط±ظƒط§طھ ظ…طھط§ط­ط© ظ„ظ‡ط°ط§ ط§ظ„ط¹ظ…ظٹظ„ ظپظٹ A5.</td></tr>'}</tbody></table>
    </div>`;
  } catch (error) {
    refs.documentBody.innerHTML = `<div class="document-sheet">
      <div class="subsection-head"><h2>ظƒط´ظپ ط­ط³ط§ط¨ A5</h2><button class="mini-btn no-print" type="button" data-back-a5-accounts>ط±ط¬ظˆط¹</button></div>
      <div class="notice warning">طھط¹ط°ط± طھط­ظ…ظٹظ„ ظƒط´ظپ ط§ظ„ط­ط³ط§ط¨ ظ…ظ† A5. طھط£ظƒط¯ ط£ظ† ط®ط¯ظ…ط© A5 طھط¹ظ…ظ„ ط«ظ… ط­ط§ظˆظ„ ظ…ط±ط© ط£ط®ط±ظ‰.</div>
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
    const reportName = reportTypeLabels[item.reportType] || item.reportType || 'طھظ‚ط±ظٹط±';
    const status = `${reportTypeIcons[item.status] || ''} ${reportStatusText[item.status] || item.status || '-'}`.trim();
    const errorText = brokenText(item.errorMessage) ? 'ط±ط³ط§ظ„ط© ظ‚ط¯ظٹظ…ط© ط؛ظٹط± ظ‚ط§ط¨ظ„ط© ظ„ظ„ط¹ط±ط¶' : (item.errorMessage || '-');
    const action = item.status === 'failed' ? `<button class="mini-btn" data-retry-outbox="${item.id}">ط¥ط¹ط§ط¯ط© ط§ظ„ظ…ط­ط§ظˆظ„ط©</button>` : '';
    return `<tr><td>${cellText(reportName, 'طھظ‚ط±ظٹط±')}</td><td>${cellText(item.orderNumber, '-')}</td><td>${cellText(item.targetGroup, 'ط؛ظٹط± ظ…ط­ط¯ط¯')}</td><td>${escapeHtml(status)}</td><td>${cellText(errorText, '-')}</td><td>${action}</td></tr>`;
  }).join('') || '<tr><td colspan="6">ظ„ط§ طھظˆط¬ط¯ طھظ‚ط§ط±ظٹط± ظپظٹ ظ‚ط§ط¦ظ…ط© ط§ظ„ط¥ط±ط³ط§ظ„.</td></tr>';
  refs.documentTitle.textContent = 'ظ‚ط§ط¦ظ…ط© ط¥ط±ط³ط§ظ„ ظˆط§طھط³ط§ط¨';
  refs.documentBody.dataset.documentType = 'outbox';
  refs.documentBody.innerHTML = `<div class="document-sheet"><h2>ظ‚ط§ط¦ظ…ط© ط¥ط±ط³ط§ظ„ ظˆط§طھط³ط§ط¨</h2><p class="muted">ط­ط§ظ„ط© ط§ظ„طھظ‚ط§ط±ظٹط± ط§ظ„طھظٹ طھظ†طھط¸ط± ط§ظ„ط¥ط±ط³ط§ظ„ ط£ظˆ طھظ… ط¥ط±ط³ط§ظ„ظ‡ط§ ظ…ظ† ط®ط¯ظ…ط© ظˆط§طھط³ط§ط¨.</p><table><thead><tr><th>ط§ظ„طھظ‚ط±ظٹط±</th><th>ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨</th><th>ط§ظ„ط¬ط±ظˆط¨</th><th>ط§ظ„ط­ط§ظ„ط©</th><th>ظ…ظ„ط§ط­ط¸ط§طھ</th><th>ط¥ط¬ط±ط§ط،</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
async function openSystemStatusDialog() {
  refs.documentTitle.textContent = 'ظپط­طµ ط§ظ„ظ†ط¸ط§ظ…';
  refs.documentBody.dataset.documentType = 'system-status';
  refs.documentBody.innerHTML = '<div class="document-sheet"><h2>ظپط­طµ ط§ظ„ظ†ط¸ط§ظ…</h2><p>ط¬ط§ط±ظٹ ظ‚ط±ط§ط،ط© ط­ط§ظ„ط© Railway ظˆظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ...</p></div>';
  refs.documentDialog.showModal();
  try {
    const status = await backendRequest('/system/check', { cache: 'no-store' });
    const row = (item) => `<tr><td>${escapeHtml(item.label)}</td><td><span class="status ${item.ok ? 'completed' : 'failed'}">${item.ok ? 'ط³ظ„ظٹظ…' : 'ظٹط­طھط§ط¬ ظ…ط±ط§ط¬ط¹ط©'}</span></td><td>${escapeHtml(item.detail || '-')}</td></tr>`;
    const tableRow = (label, value) => `<tr><td>${escapeHtml(label)}</td><td>${Number(value || 0).toLocaleString('en-US')}</td></tr>`;
    const stageRows = (status.orderStages || []).map((stage)=>`<tr><td>${escapeHtml(stage.label)}</td><td>${escapeHtml(stage.description)}</td></tr>`).join('');
    refs.documentBody.innerHTML = `<div class="document-sheet">
      <h2>ظپط­طµ ط§ظ„ظ†ط¸ط§ظ…</h2>
      <p class="muted">ط¢ط®ط± ظپط­طµ: ${escapeHtml(status.generatedAt || '-')}</p>
      <table>
        <thead><tr><th>ط§ظ„ط¨ظ†ط¯</th><th>ط§ظ„ط­ط§ظ„ط©</th><th>ط§ظ„طھظپط§طµظٹظ„</th></tr></thead>
        <tbody>${(status.checks || []).map(row).join('')}</tbody>
      </table>
      <h3>ظ…ظ„ط®طµ ط§ظ„ط¨ظٹط§ظ†ط§طھ</h3>
      <table>
        <tbody>
          ${tableRow('ط§ظ„ط·ظ„ط¨ط§طھ', status.tables?.orders)}
          ${tableRow('ط§ظ„ط£ظ„ظˆط§ظ†', status.tables?.allocations)}
          ${tableRow('ط§ط³طھظ„ط§ظ… ط§ظ„ط®ط§ظ…', status.tables?.rawReceiving)}
          ${tableRow('ط¥ط±ط³ط§ظ„ ط§ظ„ظ…طµط¨ط؛ط©', status.tables?.dyehouseDelivery)}
          ${tableRow('ط§ط³طھظ„ط§ظ… ط§ظ„ظ…ط¬ظ‡ط²', status.tables?.finishedReceiving)}
          ${tableRow('طھط³ظ„ظٹظ… ط§ظ„ط¹ظ…ظٹظ„', status.tables?.customerDelivery)}
          ${tableRow('ط§ظ„ط¥ظƒط³ط³ظˆط§ط±ط§طھ', status.tables?.accessories)}
          ${tableRow('ط³ط¬ظ„ ط§ظ„طھط¹ط¯ظٹظ„ط§طھ', status.tables?.auditLog)}
        </tbody>
      </table>
      <h3>ط­ط§ظ„ط§طھ ط§ظ„ط·ظ„ط¨ ط§ظ„ظ…ط¹طھظ…ط¯ط©</h3>
      <table>
        <thead><tr><th>ط§ظ„ط­ط§ظ„ط©</th><th>ط§ظ„ظ…ط¹ظ†ظ‰</th></tr></thead>
        <tbody>${stageRows}</tbody>
      </table>
      <h3>ط§ظ„ظ†ط³ط® ط§ظ„ط§ط­طھظٹط§ط·ظٹ</h3>
      <p><strong>ط¢ط®ط± ظ†ط³ط®ط©:</strong> ${escapeHtml(status.storage?.latestBackup?.name || 'ظ„ط§ طھظˆط¬ط¯ ظ†ط³ط®ط©')}</p>
      <p><strong>ط¹ط¯ط¯ ط§ظ„ظ†ط³ط®:</strong> ${Number(status.storage?.backupsCount || 0).toLocaleString('en-US')}</p>
      <p><strong>ط³ظٹط§ط³ط© ط§ظ„ط§ط­طھظپط§ط¸:</strong> ط­ط°ظپ طھظ„ظ‚ط§ط¦ظٹ ط¨ط¹ط¯ ${Number(status.storage?.retentionDays || 6).toLocaleString('en-US')} ط£ظٹط§ظ…</p>
      <p><strong>ط¢ط®ط± طھظ†ط¸ظٹظپ:</strong> ${escapeHtml(status.storage?.lastCleanup?.ranAt || '-')} - ظ…ط­ط°ظˆظپ ${Number(status.storage?.lastCleanup?.deleted || 0).toLocaleString('en-US')} ظ†ط³ط®ط©</p>
            ${fabricMasterSettingsSectionHtml()}
      <button class="mini-btn gold" type="button" data-create-backup>ط¥ظ†ط´ط§ط، ظ†ط³ط®ط© ط§ط­طھظٹط§ط·ظٹط© ط§ظ„ط¢ظ†</button>
    </div>`;
  } catch {
    refs.documentBody.innerHTML = '<div class="document-sheet"><h2>ظپط­طµ ط§ظ„ظ†ط¸ط§ظ…</h2><p>طھط¹ط°ط± ظ‚ط±ط§ط،ط© ط­ط§ظ„ط© ط§ظ„ظ†ط¸ط§ظ… ط­ط§ظ„ظٹظ‹ط§.</p></div>';
  }
}
async function createBackupFromStatusDialog() {
  const button = refs.documentBody.querySelector('[data-create-backup]');
  if (button) { button.disabled = true; button.textContent = 'ط¬ط§ط±ظٹ ط¥ظ†ط´ط§ط، ط§ظ„ظ†ط³ط®ط©...'; }
  try {
    const result = await backendRequest('/backup', { method:'POST', body:JSON.stringify({}) });
    alert(result.ok ? 'طھظ… ط¥ظ†ط´ط§ط، ط§ظ„ظ†ط³ط®ط© ط§ظ„ط§ط­طھظٹط§ط·ظٹط©.' : 'طھط¹ط°ط± ط¥ظ†ط´ط§ط، ط§ظ„ظ†ط³ط®ط© ط§ظ„ط§ط­طھظٹط§ط·ظٹط©.');
    await openSystemStatusDialog();
  } catch (error) {
    alert(error.message || 'طھط¹ط°ط± ط¥ظ†ط´ط§ط، ط§ظ„ظ†ط³ط®ط© ط§ظ„ط§ط­طھظٹط§ط·ظٹط©.');
    if (button) { button.disabled = false; button.textContent = 'ط¥ظ†ط´ط§ط، ظ†ط³ط®ط© ط§ط­طھظٹط§ط·ظٹط© ط§ظ„ط¢ظ†'; }
  }
}
function installAutomationUi() {
  const actionBar = document.querySelector('.hero-actions') || document.querySelector('header') || document.body;
  if (!document.getElementById('whatsappStatusBadge')) {
    const userName = currentUser?.name || currentUser?.username || 'مستخدم';
    actionBar.insertAdjacentHTML('beforeend', `<span class="mini-btn version-badge" id="appVersionBadge" title="وقت إصدار هذه النسخة">النسخة ${APP_VERSION} | ${APP_BUILD_TIME}</span><span class="mini-btn version-badge" id="currentUserBadge">المستخدم: ${escapeHtml(userName)}</span><button class="mini-btn" id="logoutBtn" type="button">خروج</button><button class="mini-btn connection-badge is-down" id="backendStatusBadge" type="button"><span class="connection-dot"></span><span data-connection-text>قاعدة البيانات: غير متصل</span></button><button class="mini-btn connection-badge is-down" id="whatsappStatusBadge" type="button"><span class="connection-dot"></span><span data-connection-text>واتساب: غير متصل</span></button><button class="mini-btn" id="systemStatusBtn" type="button">حالة النظام</button><button class="mini-btn" id="usersBtn" type="button">المستخدمين</button><button class="mini-btn" id="whatsappSettingsBtn" type="button">إعدادات واتساب</button><button class="mini-btn" id="dyehousePricesBtn" type="button">أسعار المصابغ</button><button class="mini-btn" id="a5AccountsBtn" type="button">حسابات A5</button><button class="mini-btn" id="outboxBtn" type="button">قائمة الإرسال</button><button class="mini-btn" id="auditLogBtn" type="button">سجل التعديلات</button>`);
  }
  const userName = currentUser?.name || currentUser?.username || 'مستخدم';
  const labels = [
    ['appVersionBadge', `النسخة ${APP_VERSION} | ${APP_BUILD_TIME}`, 'وقت إصدار هذه النسخة'],
    ['currentUserBadge', `المستخدم: ${userName}`],
    ['logoutBtn', 'خروج'],
    ['systemStatusBtn', 'حالة النظام'],
    ['usersBtn', 'المستخدمين'],
    ['whatsappSettingsBtn', 'إعدادات واتساب'],
    ['dyehousePricesBtn', 'أسعار المصابغ'],
    ['a5AccountsBtn', 'حسابات A5'],
    ['outboxBtn', 'قائمة الإرسال'],
    ['auditLogBtn', 'سجل التعديلات'],
  ];
  labels.forEach(([id, text, title]) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = text;
    if (title) element.title = title;
  });
  updateBackendStatusBadge();
  updateWhatsappStatusBadge();
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
  recordAudit('retry', 'reportOutbox', id, null, item, 'ط¥ط¹ط§ط¯ط© ط¥ط±ط³ط§ظ„ ط§ظ„طھظ‚ط±ظٹط±');
  await persistAuditLog();
  save();
  await syncOutboxToWhatsappService();
  openOutboxDialog();
  pollWhatsappService();
}

function fabricMasterSettingsSectionHtml() {
  const masterRows = fabricMasterRows();
  const suggestedRows = knownFabricNames().filter((name)=>!findFabricMasterByName(name));
  return `<section class="report-section no-print">
    <div class="subsection-head"><div><h3>ط§ظ„ط£طµظ†ط§ظپ ط§ظ„ط±ط³ظ…ظٹط©</h3><p class="muted">ط§ظƒطھط¨ ظƒظ„ طµظ†ظپ ط±ط³ظ…ظٹ ظپظٹ ط³ط·ط± ظ…ط³طھظ‚ظ„. ط§ظ„ظ†ط¸ط§ظ… ظٹط·ط§ط¨ظ‚ ط§ظ„ط£طµظ†ط§ظپ ط¨ط¹ط¯ طھظˆط­ظٹط¯ ط§ظ„ظ‡ظ…ط²ط§طھ ظˆط§ظ„ظ…ط³ط§ظپط§طھ ط­طھظ‰ ظ„ط§ طھطھظƒط±ط± ط§ظ„ط®ط§ظ…ط© ط¨ط£ظƒط«ط± ظ…ظ† ظƒطھط§ط¨ط©.</p></div></div>
    <textarea data-fabric-master-list rows="8" class="full" placeholder="ظ…ط«ط§ظ„: ط³ظ†ط¬ظ„ ظ„ظٹظƒط±ط§&#10;ط¨ظٹظƒط§ ظ‚ط·ظ† ظ…ظ…ط´ط· ط§ط³طھط±طھط±">${escapeHtml(masterRows.join('\n'))}</textarea>
    <p class="muted">ط£طµظ†ط§ظپ ظ…ط³طھط®ط¯ظ…ط© ظˆط؛ظٹط± ظ…ط«ط¨طھط© ط±ط³ظ…ظٹظ‹ط§: ${escapeHtml(suggestedRows.slice(0, 20).join('طŒ ') || 'ظ„ط§ ظٹظˆط¬ط¯')}</p>
    <button class="primary-btn" type="button" data-save-fabric-master>ط­ظپط¸ ط§ظ„ط£طµظ†ط§ظپ ط§ظ„ط±ط³ظ…ظٹط©</button>
  </section>`;
}
async function saveFabricMasterFromDialog() {
  const textarea = refs.documentBody.querySelector('[data-fabric-master-list]');
  if (!textarea) return;
  const lines = String(textarea.value || '').split(/\r?\n/).map(cleanFabricDisplayName).filter(Boolean);
  const seen = new Map();
  const duplicates = [];
  lines.forEach((name)=>{
    const key = normalizeFabricMasterName(name);
    if (!key) return;
    if (seen.has(key)) duplicates.push(`${seen.get(key)} / ${name}`);
    else seen.set(key, name);
  });
  if (duplicates.length) {
    alert(`ظٹظˆط¬ط¯ طھظƒط±ط§ط± ظپظٹ ط§ظ„ط£طµظ†ط§ظپ:\n${duplicates.slice(0, 5).join('\n')}`);
    return;
  }
  if (!(await ensureBackendForWrite('طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط¨ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط­ظپط¸ ط§ظ„ط£طµظ†ط§ظپ ط§ظ„ط±ط³ظ…ظٹط©.'))) return;
  const nextMaster = [...seen.values()].sort((a,b)=>String(a).localeCompare(String(b), 'ar'));
  const saved = await saveBackendSetting('fabricMaster', nextMaster);
  if (!saved) {
    await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط§ظ„ط£طµظ†ط§ظپ ط§ظ„ط±ط³ظ…ظٹط© ط¯ط§ط®ظ„ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ.');
    return;
  }
  const before = clone(fabricMaster);
  fabricMaster = nextMaster;
  recordAudit('update', 'fabricMaster', 'settings', before, fabricMaster, 'طھط­ط¯ظٹط« ط§ظ„ط£طµظ†ط§ظپ ط§ظ„ط±ط³ظ…ظٹط©');
  await saveBackendSetting('auditLog', auditLog);
  save();
  await loadBackendData();
  applyFabricNameDatalist();
  await openSystemStatusDialog();
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

const statusLabel = (status) => ({ pending:'ط¨ط§ظ†طھط¸ط§ط± ط§ظ„ط§ط³طھظ„ط§ظ…', 'in-progress':'ظ‚ظٹط¯ ط§ظ„طھط´ط؛ظٹظ„', completed:'ظ…ظƒطھظ…ظ„', closed:'ظ…ط؛ظ„ظ‚ طھط´ط؛ظٹظ„ظٹظ‹ط§' }[status]);
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

function orderActualWastePercentForPricing(order) {
  if (!order) return 0;
  const calculated = calculateOrder(order);
  const actualWastePercent = Number(calculated.totalWastePercent || 0);
  const actualWasteQuantity = Number(calculated.totalWaste || 0);
  return actualWasteQuantity > 0 && actualWastePercent > 0 ? actualWastePercent : 0;
}

function pricingOrderCandidates(pricing = {}) {
  const pricingId = String(pricing.id || '').trim();
  return orders.filter((order) => {
    if (pricingId && String(order.pricingId || '').trim() === pricingId) return true;
    return pricingMatchesOrder(pricing, order);
  });
}

function pricingItemMatchesOrder(item = {}, order = {}) {
  const fabric = item.fabricType || item.materialType || '';
  const dyehouse = item.dyehouse || '';
  const quantity = Number(item.quantity || 0);
  const orderQuantity = Number(order.totalRawQuantity || order.totalRawOrdered || 0);
  const fabricOk = !fabric || compatibleFabricForMatch(order.fabricType, fabric);
  const orderDyehouses = uniqueNonEmpty([
    order.dyehouse,
    ...(Array.isArray(order.allocations) ? order.allocations.map((allocation)=>allocation.dyehouse) : []),
  ]);
  const dyehouseOk = !dyehouse || orderDyehouses.some((name)=>normalizeForCompare(name) === normalizeForCompare(dyehouse));
  const quantityOk = !quantity || !orderQuantity || Math.abs(quantity - orderQuantity) <= Math.max(0.01, orderQuantity * 0.05);
  return fabricOk && dyehouseOk && quantityOk;
}

function pricingOrderForItem(pricing = {}, item = {}) {
  const candidates = pricingOrderCandidates(pricing);
  if (!candidates.length) return null;
  return candidates.find((order)=>pricingItemMatchesOrder(item, order))
    || candidates.find((order)=>compatibleFabricForMatch(order.fabricType, item.fabricType || item.materialType || pricing.fabricType || ''))
    || candidates[0];
}

function pricingWithOperationalWastePercent(pricing = {}) {
  if (!pricing || typeof pricing !== 'object') return pricing;
  const items = Array.isArray(pricing.priceItems) ? pricing.priceItems : [];
  if (items.length) {
    let changed = false;
    const priceItems = items.map((item) => {
      const wastePercent = orderActualWastePercentForPricing(pricingOrderForItem(pricing, item));
      if (!wastePercent) return item;
      changed = true;
      return { ...item, wastePercent };
    });
    const primaryWastePercent = orderActualWastePercentForPricing(pricingOrderForItem(pricing, priceItems[0] || pricing));
    return changed || primaryWastePercent
      ? { ...pricing, wastePercent: primaryWastePercent || pricing.wastePercent, priceItems }
      : pricing;
  }
  const wastePercent = orderActualWastePercentForPricing(pricingOrderForItem(pricing, pricing));
  return wastePercent ? { ...pricing, wastePercent } : pricing;
}

function calculatePricing(pricing) {
  const source = pricingWithOperationalWastePercent(pricing || {});
  const items = pricingItemsFor(source);
  if (items.length <= 1 && !Array.isArray(source.priceItems)) return pricingDomain.calculatePricing(source, activeDyehousePriceLibrary());
  const calculatedItems = items.map((item)=>pricingDomain.calculatePricing({ ...source, ...item }, activeDyehousePriceLibrary()));
  const totalQuantity = roundNumber(calculatedItems.reduce((total, item)=>total + Number(item.quantity || 0), 0));
  const totalOffer = roundNumber(calculatedItems.reduce((total, item)=>total + Number(item.totalOffer || 0), 0));
  const weighted = (key) => totalQuantity ? roundNumber(calculatedItems.reduce((total, item)=>total + Number(item[key] || 0) * Number(item.quantity || 0), 0) / totalQuantity) : 0;
  const first = calculatedItems[0] || {};
  return {
    ...source,
    ...first,
    customer: source.customer,
    pricingNumber: source.pricingNumber,
    pricingDate: source.pricingDate,
    paymentTerms: source.paymentTerms,
    notes: source.notes,
    status: source.status,
    priceItems: calculatedItems,
    itemCount: calculatedItems.length,
    fabricType: calculatedItems.length > 1 ? `${first.fabricType || 'ط¹ط±ط¶ ظ…ط¬ظ…ط¹'} + ${calculatedItems.length - 1}` : first.fabricType || source.fabricType || '',
    quantity: totalQuantity,
    wasteCost: weighted('wasteCost'),
    deferredCost: weighted('deferredCost'),
    costPerKg: weighted('costPerKg'),
    sellPrice: weighted('sellPrice') || Number(first.sellPrice || 0),
    totalOffer,
  };
}
function pricingInheritedNumber(item = {}, keys = [], fallback = 0) {
  const keyList = Array.isArray(keys) ? keys : [keys];
  for (const key of keyList) {
    if (item[key] !== undefined && item[key] !== null && item[key] !== '') {
      const number = Number(item[key] || 0);
      return Number.isFinite(number) ? number : 0;
    }
  }
  const fallbackNumber = Number(fallback || 0);
  return Number.isFinite(fallbackNumber) ? fallbackNumber : 0;
}
function pricingItemsFor(pricing = {}) {
  const items = Array.isArray(pricing.priceItems) ? pricing.priceItems.filter(Boolean) : [];
  if (items.length) return items.map((item)=>({
    currency: item.currency || pricing.currency || 'EGP',
    exchangeRate: Number(item.exchangeRate || item.exchange_rate || pricing.exchangeRate || pricing.exchange_rate || 0),
    fabricType: item.fabricType || item.fabric_type || '',
    materialType: item.materialType || item.material_type || item.fabricType || item.fabric_type || '',
    dyehouse: item.dyehouse || pricing.dyehouse || '',
    weavingSource: item.weavingSource || item.weaving_source || pricing.weavingSource || '',
    colorClass: item.colorClass || item.color_class || '',
    quantity: Number(item.quantity || 0),
    inchWidth: item.inchWidth || item.inch_width || pricing.inchWidth || '',
    finishedWeight: item.finishedWeight || item.finished_weight || pricing.finishedWeight || '',
    rawCost: Number(item.rawCost || item.raw_cost || 0),
    dyeCost: Number(item.dyeCost || item.dye_cost || 0),
    dyeStages: Array.isArray(item.dyeStages) ? item.dyeStages : Array.isArray(item.dye_stages) ? item.dye_stages : [],
    accessoryLines: Array.isArray(item.accessoryLines) ? item.accessoryLines : Array.isArray(item.accessory_lines) ? item.accessory_lines : [],
    accessoryCost: Number(item.accessoryCost || item.accessory_cost || 0),
    wastePercent: pricingInheritedNumber(item, ['wastePercent', 'waste_percent'], pricing.wastePercent ?? pricing.waste_percent ?? 0),
    wasteBasis: item.wasteBasis || item.waste_basis || pricing.wasteBasis || pricing.waste_basis || '',
    deferredPercent: pricingInheritedNumber(item, ['deferredPercent', 'deferred_percent'], pricing.deferredPercent ?? pricing.deferred_percent ?? 0),
    extraCost: Number(item.extraCost || item.extra_cost || pricing.extraCost || pricing.extra_cost || 0),
    profitPerKg: pricingInheritedNumber(item, ['profitPerKg', 'profit_per_kg'], pricing.profitPerKg ?? pricing.profit_per_kg ?? 0),
  }));
  const hasSingle = pricing.fabricType || pricing.quantity || pricing.rawCost || pricing.dyeCost || pricing.profitPerKg;
  if (!hasSingle) return [];
  return [{
    currency: pricing.currency || 'EGP',
    exchangeRate: Number(pricing.exchangeRate || pricing.exchange_rate || 0),
    fabricType: pricing.fabricType || '',
    materialType: pricing.materialType || pricing.fabricType || '',
    dyehouse: pricing.dyehouse || '',
    weavingSource: pricing.weavingSource || '',
    colorClass: pricing.colorClass || '',
    quantity: Number(pricing.quantity || 0),
    inchWidth: pricing.inchWidth || '',
    finishedWeight: pricing.finishedWeight || '',
    rawCost: Number(pricing.rawCost || 0),
    dyeCost: Number(pricing.dyeCost || 0),
    dyeStages: [],
    accessoryLines: Array.isArray(pricing.accessoryLines) ? pricing.accessoryLines : [],
    accessoryCost: Number(pricing.accessoryCost || pricing.accessory_total || 0),
    wastePercent: Number(pricing.wastePercent || 0),
    wasteBasis: pricing.wasteBasis || pricing.waste_basis || '',
    deferredPercent: Number(pricing.deferredPercent || pricing.deferred_percent || 0),
    extraCost: Number(pricing.extraCost || pricing.extra_cost || 0),
    profitPerKg: Number(pricing.profitPerKg || 0),
  }];
}

function pricingDyeStageNames(item = {}) {
  return uniqueNonEmpty((Array.isArray(item.dyeStages) ? item.dyeStages : [])
    .map((stage)=>String(stage?.name || '').trim())
    .filter(Boolean));
}

function pricingOperationNotesForItem(item = {}) {
  return {};
}

function pricingAccessoryLinesForOrder(item = {}) {
  return (Array.isArray(item.accessoryLines) ? item.accessoryLines : [])
    .map((line)=>({
      id: line.id || uid(),
      type: line.type || 'ط¥ظƒط³ط³ظˆط§ط±',
      percent: Number(line.percent || 0),
      quantityManual: line.quantityManual !== undefined && line.quantityManual !== null && line.quantityManual !== ''
        ? Number(line.quantityManual || 0)
        : line.quantity !== undefined && line.quantity !== null && line.quantity !== ''
          ? Number(line.quantity || 0)
          : '',
    }))
    .filter((line)=>line.type || line.percent || line.quantityManual !== '');
}

function pricingItemToOrderDraft(item = {}, pricing = {}) {
  const calculated = calculatePricing({ ...pricing, ...item, priceItems:null });
  const accessoryLines = pricingAccessoryLinesForOrder(item);
  const firstAccessory = accessoryLines[0] || {};
  return {
    fabricType: calculated.fabricType || item.fabricType || '',
    totalRawQuantity: calculated.quantity || item.quantity || '',
    inchWidth: calculated.inchWidth || item.inchWidth || '',
    kiloPrice: calculated.sellPrice || item.sellPrice || '',
    rawCost: Number(calculated.rawCost || item.rawCost || 0),
    expectedWastePercent: Number(calculated.wastePercent || item.wastePercent || 0),
    dyehouse: calculated.dyehouse || item.dyehouse || '',
    weavingSource: item.weavingSource || pricing.weavingSource || '',
    accessoryType: firstAccessory.type || '',
    accessoryPercent: Number(firstAccessory.percent || 0),
    accessoryLines,
    operationNotes: {},
  };
}

function setOrderFormPricingConversionMode(active = false, itemCount = 0) {
  refs.orderForm?.classList.toggle('order-form-pricing-conversion', Boolean(active));
  if (refs.orderForm) refs.orderForm.dataset.pricingItemsCount = String(Number(itemCount || 0));
  refs.accessoryType?.closest('label')?.classList.add('pricing-conversion-hidden-field');
  refs.accessoryPercent?.closest('label')?.classList.add('pricing-conversion-hidden-field');
}

function pricingPrimaryItemFromRefs() {
  return {
    currency: pricingCurrencyValue(),
    exchangeRate: pricingExchangeRateValue(),
    fabricType: canonicalFabricName(refs.pricingFabricType?.value),
    materialType: canonicalFabricName(refs.pricingFabricType?.value),
    dyehouse: refs.pricingDyehouse?.value || '',
    weavingSource: refs.pricingWeavingSource?.value || '',
    colorClass: refs.pricingColorClass?.value || '',
    quantity: Number(refs.pricingQuantity?.value || 0),
    inchWidth: refs.pricingInchWidth?.value || '',
    finishedWeight: refs.pricingFinishedWeight?.value || '',
    rawCost: Number(refs.pricingRawCost?.value || 0),
    dyeCost: Number(refs.pricingDyeCost?.value || 0),
    dyeStages: [],
    accessoryLines: [],
    accessoryCost: 0,
    wastePercent: Number(refs.pricingWastePercent?.value || 0),
    wasteBasis: 'net',
    deferredPercent: pricingDeferredPercentFromPaymentDetails(),
    extraCost: 0,
    profitPerKg: Number(refs.pricingProfitPerKg?.value || 0),
  };
}

function pricingStageKey(value) {
  return String(value || '')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/\s+/g, '')
    .trim();
}

function isFixedPackagingStageName(value) {
  return pricingStageKey(value) === pricingStageKey('طھط؛ظ„ظٹظپ');
}

function isFixedTransportStageName(value) {
  return pricingStageKey(value) === pricingStageKey('ظ†ظ‚ظ„');
}

function fixedPricingStageDefinition(value) {
  if (isFixedPackagingStageName(value)) return { name:'طھط؛ظ„ظٹظپ', price:2, fixed:true };
  if (isFixedTransportStageName(value)) return { name:'ظ†ظ‚ظ„', price:0.5, fixed:true };
  return null;
}

function normalizePricingDyeStages(stages = [], dyeCost = '') {
  const normalized = (Array.isArray(stages) ? stages : [])
    .map((stage)=>{
      const fixedStage = fixedPricingStageDefinition(stage?.name);
      return {
        name: fixedStage?.name || String(stage?.name || '').trim(),
        price: fixedStage ? fixedStage.price : Number(stage?.price || 0),
        fixed: Boolean(fixedStage),
      };
    })
    .filter((stage)=>stage.name || stage.price);
  if (!normalized.length && dyeCost !== '' && dyeCost !== null && dyeCost !== undefined) {
    normalized.push({ name:'طµط¨ط§ط؛ط©', price:Number(dyeCost || 0), fixed:false });
  }
  if (!normalized.some((stage)=>isFixedPackagingStageName(stage.name))) {
    normalized.push({ name:'طھط؛ظ„ظٹظپ', price:2, fixed:true });
  }
  if (!normalized.some((stage)=>isFixedTransportStageName(stage.name))) {
    normalized.push({ name:'ظ†ظ‚ظ„', price:0.5, fixed:true });
  }
  return normalized.map((stage)=>fixedPricingStageDefinition(stage.name) || stage);
}

function pricingDeferredPercentFromPaymentDetails() {
  const text = String(refs.pricingPaymentMode?.value || refs.pricingPaymentDetails?.value || refs.pricingPaymentTerms?.value || '');
  const monthMatch = text.match(/(?:ط£ط¬ظ„|ط§ط¬ظ„)\s*(\d+)/i);
  if (monthMatch) return Number(monthMatch[1] || 0);
  const match = text.match(/(?:ط£ط¬ظ„|ط§ط¬ظ„|ظ†ط³ط¨ط©)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*%?/i);
  return match ? Number(match[1] || 0) / 3 : 0;
}

function pricingWasteBasisSelect(value = '', disabled = false) {
  const current = value || 'net';
  return `<select data-pricing-item-field="wasteBasis" ${disabled ? 'disabled' : ''}>
    <option value="net" ${current === 'net' ? 'selected' : ''}>طµط§ظپظٹ</option>
    <option value="gross" ${current === 'gross' ? 'selected' : ''}>ظ‚ط§ط¦ظ…</option>
  </select>`;
}

function pricingItemRowHtml(item = {}) {
  const stages = normalizePricingDyeStages(Array.isArray(item.dyeStages) && item.dyeStages.length ? item.dyeStages : [{ name:'طµط¨ط§ط؛ط©', price:item.dyeCost || '' }], item.dyeCost || '');
  const stagesHtml = stages.map((stage)=>pricingStageRowHtml(stage)).join('');
  const accessories = Array.isArray(item.accessoryLines) && item.accessoryLines.length ? item.accessoryLines : [];
  const accessoriesHtml = accessories.map((line)=>pricingAccessoryRowHtml(line, stages)).join('');
  return `<div class="grouped-order-row pricing-item-row" data-pricing-item-row>
    <input data-pricing-item-field="fabricType" list="fabricNamesList" placeholder="ط§ظ„طµظ†ظپ / ط§ظ„ط®ط§ظ…ط©" value="${escapeHtml(item.fabricType || item.materialType || '')}">
    <input data-pricing-item-field="dyehouse" placeholder="ط§ظ„ظ…طµط¨ط؛ط©" value="${escapeHtml(item.dyehouse || '')}">
    <input data-pricing-item-field="weavingSource" placeholder="ظ…طµط¯ط± ط§ظ„ظ†ط³ظٹط¬" value="${escapeHtml(item.weavingSource || '')}">
    <input data-pricing-item-field="quantity" type="number" step="0.01" placeholder="ط§ظ„ظƒظ…ظٹط©" value="${item.quantity || ''}">
    <input data-pricing-item-field="inchWidth" placeholder="ط§ظ„ط¨ظˆطµط©" value="${escapeHtml(item.inchWidth || '')}">
    <input data-pricing-item-field="finishedWeight" placeholder="ط§ظ„ظˆط²ظ†" value="${escapeHtml(item.finishedWeight || '')}">
    <div class="pricing-money-field"><input data-pricing-item-field="rawCost" type="number" step="0.01" placeholder="ط³ط¹ط± ط§ظ„ظ‚ظ…ط§ط´" value="${item.rawCost || ''}"><span data-pricing-currency-badge="pricing">${pricingCurrencyLabel()}</span></div>
    <div class="pricing-stage-card" data-pricing-stage-card>
      <div class="pricing-stage-head"><span>ط¬ط¯ظˆظ„ ط§ظ„طµط¨ط§ط؛ط©</span><button class="mini-btn" type="button" data-add-pricing-stage>+ ظ…ط±ط­ظ„ط©</button></div>
      <div class="pricing-stage-rows">${stagesHtml}</div>
      <div class="pricing-stage-total">ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„طµط¨ط§ط؛ط©: <strong data-pricing-dye-total>${formatNumber(pricingStagesTotal(stages))}</strong></div>
    </div>
    <div class="pricing-stage-card pricing-accessory-card" data-pricing-accessory-card>
      <div class="pricing-stage-head"><span>ط§ظ„ط¥ظƒط³ط³ظˆط§ط±</span><button class="mini-btn" type="button" data-add-pricing-accessory>+ ط¥ظƒط³ط³ظˆط§ط±</button></div>
      <div class="pricing-stage-rows">${accessoriesHtml}</div>
      <div class="pricing-stage-total">ط¥ط¬ظ…ط§ظ„ظٹ ط®ط§ظ… ط§ظ„ط¥ظƒط³ط³ظˆط§ط±: <strong data-pricing-accessory-total>${formatNumber(pricingAccessoriesTotal(accessories))}</strong></div>
    </div>
    <input data-pricing-item-field="wastePercent" type="number" step="0.01" placeholder="ظ‡ط§ظ„ظƒ %" value="${item.wastePercent || ''}">
    ${pricingWasteBasisSelect(item.wasteBasis || item.accountingMode || 'net')}
    <input data-pricing-item-field="deferredPercent" type="number" step="0.01" placeholder="ط£ط¬ظ„ ط´ظ‡ط±" value="${item.deferredPercent || ''}">
    <div class="pricing-money-field"><input data-pricing-item-field="profitPerKg" type="number" step="0.01" placeholder="ط±ط¨ط­" value="${item.profitPerKg || ''}"><span data-pricing-currency-badge="egp">ط¬ظ†ظٹظ‡</span></div>
    <button type="button" class="mini-btn danger" data-remove-pricing-item>ط­ط°ظپ</button>
  </div>`;
}

function pricingAccessoryTypeOptions(current = '') {
  const options = uniqueNonEmpty(['ط±ظٹط¨', 'ط¯ظٹط±ط¨ظٹ', 'ظ„ظٹط§ظ‚ط§طھ', 'ط£ط³ط§ظˆط±', 'ط£ط³ط§ظˆط± ظˆظ„ظٹط§ظ‚ط§طھ', current]).filter(Boolean);
  return `<option value="">ط§ط®طھط± ط§ظ„ط¥ظƒط³ط³ظˆط§ط±</option>${options.map((name)=>`<option value="${escapeHtml(name)}" ${name === current ? 'selected' : ''}>${escapeHtml(name)}</option>`).join('')}`;
}

function pricingAccessorySelectedStageNames(line = {}) {
  return Array.isArray(line.stageNames) ? line.stageNames
    : Array.isArray(line.appliedStages) ? line.appliedStages
    : Array.isArray(line.stages) ? line.stages
    : [];
}

function pricingAccessoryStageOptions(line = {}, stages = []) {
  const selected = new Set(pricingAccessorySelectedStageNames(line).map((name)=>String(name || '').trim()).filter(Boolean));
  const validStages = (Array.isArray(stages) ? stages : []).filter((stage)=>stage.name || stage.price);
  if (!validStages.length) return '<span class="pricing-accessory-hint">ط£ط¶ظپ ظ…ط±ط§ط­ظ„ ط§ظ„طµط¨ط§ط؛ط© ط£ظˆظ„ظ‹ط§ ظ„ط§ط®طھظٹط§ط± ظ…ط§ ظٹظ†ط·ط¨ظ‚ ط¹ظ„ظ‰ ط§ظ„ط¥ظƒط³ط³ظˆط§ط±.</span>';
  return validStages.map((stage)=>{
    const name = String(stage.name || 'ظ…ط±ط­ظ„ط©').trim();
    return `<label class="pricing-accessory-stage-option"><input type="checkbox" data-pricing-accessory-stage value="${escapeHtml(name)}" ${selected.has(name) ? 'checked' : ''}><span>${escapeHtml(name)} + ${formatNumber(stage.price || 0)}</span></label>`;
  }).join('');
}

function pricingAccessoryRowHtml(line = {}, stages = []) {
  const quantity = line.quantity ?? line.quantityManual ?? line.percent ?? '';
  const wastePercent = line.wastePercent ?? '';
  const profitPerKg = line.profitPerKg ?? '';
  return `<div class="pricing-stage-row pricing-accessory-row" data-pricing-accessory-row>
    <select data-pricing-accessory-type>${pricingAccessoryTypeOptions(line.type || '')}</select>
    <input data-pricing-accessory-quantity type="number" step="0.01" placeholder="ط§ظ„ظƒظ…ظٹط©" value="${quantity || ''}">
    <div class="pricing-money-field"><input data-pricing-accessory-price type="number" step="0.01" placeholder="ط³ط¹ط± ط§ظ„ط®ط§ظ…" value="${line.price || ''}"><span data-pricing-currency-badge="pricing">${pricingCurrencyLabel()}</span></div>
    <button class="mini-btn danger" type="button" data-remove-pricing-accessory>ط­ط°ظپ</button>
    <input data-pricing-accessory-waste-percent type="number" step="0.01" placeholder="ظ‡ط§ظ„ظƒ %" value="${wastePercent}">
    <select data-pricing-accessory-waste-basis>
      <option value="">ظ†ظپط³ ظ‡ط§ظ„ظƒ ط§ظ„ظ‚ظ…ط§ط´</option>
      <option value="net" ${(line.wasteBasis || line.waste_basis) === 'net' ? 'selected' : ''}>طµط§ظپظٹ</option>
      <option value="gross" ${(line.wasteBasis || line.waste_basis) === 'gross' ? 'selected' : ''}>ظ‚ط§ط¦ظ…</option>
    </select>
    <div class="pricing-money-field"><input data-pricing-accessory-profit type="number" step="0.01" placeholder="ط±ط¨ط­ / ظƒط¬ظ…" value="${profitPerKg}"><span data-pricing-currency-badge="egp">ط¬ظ†ظٹظ‡</span></div>
    <div class="pricing-accessory-stage-options" data-pricing-accessory-stage-options>${pricingAccessoryStageOptions(line, stages)}</div>
  </div>`;
}

function pricingStageRowHtml(stage = {}) {
  const fixedStage = fixedPricingStageDefinition(stage.name);
  const isFixedStage = Boolean(fixedStage);
  return `<div class="pricing-stage-row" data-pricing-stage-row>
    <input data-pricing-stage-name placeholder="ظ…ط±ط­ظ„ط© ط§ظ„طµط¨ط§ط؛ط©" value="${escapeHtml(fixedStage?.name || stage.name || '')}" ${isFixedStage ? 'readonly' : ''}>
    <div class="pricing-money-field"><input data-pricing-stage-price type="number" step="0.01" placeholder="ط§ظ„ط³ط¹ط±" value="${isFixedStage ? fixedStage.price : (stage.price || '')}" ${isFixedStage ? 'readonly' : ''}><span data-pricing-currency-badge="egp">ط¬ظ†ظٹظ‡</span></div>
    ${isFixedStage ? '<span class="status pending">ط«ط§ط¨طھ</span>' : '<button class="mini-btn danger" type="button" data-remove-pricing-stage>ط­ط°ظپ</button>'}
  </div>`;
}

function pricingStagesFromRow(row) {
  const stages = [...row.querySelectorAll('[data-pricing-stage-row]')].map((stageRow)=>({
    name: stageRow.querySelector('[data-pricing-stage-name]')?.value.trim() || '',
    price: Number(stageRow.querySelector('[data-pricing-stage-price]')?.value || 0),
  })).filter((stage)=>stage.name || stage.price);
  return normalizePricingDyeStages(stages);
}

function pricingStagesTotal(stages = []) {
  return roundNumber(stages.reduce((total, stage)=>total + Number(stage.price || 0), 0));
}

function pricingAccessoriesFromRow(row) {
  const stages = pricingStagesFromRow(row);
  const currency = pricingCurrencyValue();
  const exchangeRate = pricingExchangeRateValue();
  return [...row.querySelectorAll('[data-pricing-accessory-row]')].map((accessoryRow)=>{
    const stageNames = [...accessoryRow.querySelectorAll('[data-pricing-accessory-stage]:checked')]
      .map((input)=>String(input.value || '').trim())
      .filter(Boolean);
    const stageCost = stages
      .filter((stage)=>stageNames.includes(String(stage.name || '').trim()))
      .reduce((total, stage)=>total + Number(stage.price || 0), 0);
    const quantity = Number(accessoryRow.querySelector('[data-pricing-accessory-quantity]')?.value || 0);
    const price = Number(accessoryRow.querySelector('[data-pricing-accessory-price]')?.value || 0);
    const wasteInput = accessoryRow.querySelector('[data-pricing-accessory-waste-percent]')?.value;
    const wasteBasis = accessoryRow.querySelector('[data-pricing-accessory-waste-basis]')?.value || '';
    const profitInput = accessoryRow.querySelector('[data-pricing-accessory-profit]')?.value;
    const unitPrice = roundNumber(price + pricingConvertEgpCost(stageCost, currency, exchangeRate));
    return {
      type: accessoryRow.querySelector('[data-pricing-accessory-type]')?.value.trim() || '',
      quantity,
      percent: quantity,
      price,
      currency,
      exchangeRate,
      stageNames,
      stageCost: roundNumber(stageCost),
      wastePercent: wasteInput === '' ? undefined : Number(wasteInput || 0),
      wasteBasis,
      profitPerKg: profitInput === '' ? undefined : Number(profitInput || 0),
      unitPrice,
      total: roundNumber(quantity * unitPrice),
    };
  }).filter((line)=>line.type || line.quantity || line.price || line.stageNames.length);
}

function pricingAccessoriesTotal(lines = []) {
  return roundNumber(lines.reduce((total, line)=>{
    if (line.total !== undefined && line.total !== null) return total + Number(line.total || 0);
    const unitPrice = Number(line.unitPrice ?? (Number(line.price || 0) + Number(line.stageCost || 0)));
    return total + Number(line.quantity ?? line.percent ?? 0) * unitPrice;
  }, 0));
}

function refreshPricingAccessoryStageOptions(row) {
  const stages = pricingStagesFromRow(row);
  row.querySelectorAll('[data-pricing-accessory-row]').forEach((accessoryRow)=>{
    const container = accessoryRow.querySelector('[data-pricing-accessory-stage-options]');
    if (!container) return;
    const selected = [...accessoryRow.querySelectorAll('[data-pricing-accessory-stage]:checked')]
      .map((input)=>String(input.value || '').trim())
      .filter(Boolean);
    container.innerHTML = pricingAccessoryStageOptions({ stageNames:selected }, stages);
  });
}

function updatePricingStageTotals() {
  document.querySelectorAll('#pricingItemsRows [data-pricing-item-row]').forEach((row)=>{
    const total = pricingStagesTotal(pricingStagesFromRow(row));
    const totalEl = row.querySelector('[data-pricing-dye-total]');
    if (totalEl) totalEl.textContent = formatNumber(total);
    refreshPricingAccessoryStageOptions(row);
    const accessoryTotal = pricingAccessoriesTotal(pricingAccessoriesFromRow(row));
    const accessoryTotalEl = row.querySelector('[data-pricing-accessory-total]');
    if (accessoryTotalEl) accessoryTotalEl.textContent = formatNumber(accessoryTotal);
  });
}

function syncPricingPrimaryItemRow() {}
function readPricingItemsEditor() {
  const rows = [...document.querySelectorAll('#pricingItemsRows [data-pricing-item-row]')];
  if (!rows.length) return [pricingPrimaryItemFromRefs()].filter((item)=>item.fabricType || item.quantity > 0);
  return rows.map((row)=>({
    currency: pricingCurrencyValue(),
    exchangeRate: pricingExchangeRateValue(),
    fabricType: canonicalFabricName(row.querySelector('[data-pricing-item-field="fabricType"]')?.value || ''),
    materialType: canonicalFabricName(row.querySelector('[data-pricing-item-field="fabricType"]')?.value || ''),
    dyehouse: row.querySelector('[data-pricing-item-field="dyehouse"]')?.value.trim() || '',
    weavingSource: row.querySelector('[data-pricing-item-field="weavingSource"]')?.value.trim() || refs.pricingWeavingSource?.value || '',
    colorClass: '',
    quantity: Number(row.querySelector('[data-pricing-item-field="quantity"]')?.value || 0),
    inchWidth: row.querySelector('[data-pricing-item-field="inchWidth"]')?.value.trim() || '',
    finishedWeight: row.querySelector('[data-pricing-item-field="finishedWeight"]')?.value.trim() || '',
    rawCost: Number(row.querySelector('[data-pricing-item-field="rawCost"]')?.value || 0),
    dyeCost: pricingStagesTotal(pricingStagesFromRow(row)),
    dyeStages: pricingStagesFromRow(row),
    accessoryLines: pricingAccessoriesFromRow(row),
    accessoryCost: pricingAccessoriesTotal(pricingAccessoriesFromRow(row)),
    wastePercent: Number(row.querySelector('[data-pricing-item-field="wastePercent"]')?.value || 0),
    wasteBasis: row.querySelector('[data-pricing-item-field="wasteBasis"]')?.value || 'net',
    deferredPercent: Number(row.querySelector('[data-pricing-item-field="deferredPercent"]')?.value || 0),
    extraCost: 0,
    profitPerKg: Number(row.querySelector('[data-pricing-item-field="profitPerKg"]')?.value || 0),
  })).filter((item)=>item.fabricType || item.quantity > 0 || item.rawCost > 0 || item.dyeCost > 0 || item.accessoryCost > 0 || item.deferredPercent > 0 || item.profitPerKg > 0);
}
function pricingCurrencyRef() {
  return document.getElementById('pricingCurrency');
}
function pricingCurrencyValue() {
  return pricingCurrencyRef()?.value || 'EGP';
}
function pricingCurrencyLabel(currency = pricingCurrencyValue()) {
  return currency === 'USD' ? 'ط¯ظˆظ„ط§ط±' : 'ط¬ظ†ظٹظ‡';
}
function updatePricingCurrencyBadges() {
  const label = pricingCurrencyLabel();
  document.querySelectorAll('[data-pricing-currency-badge="pricing"]').forEach((badge)=>{
    badge.textContent = label;
  });
  document.querySelectorAll('[data-pricing-currency-badge="egp"]').forEach((badge)=>{
    badge.textContent = 'ط¬ظ†ظٹظ‡';
  });
}
function pricingExchangeRateRef() {
  return document.getElementById('pricingExchangeRate');
}
function pricingExchangeRateValue() {
  const value = Number(pricingExchangeRateRef()?.value || 0);
  return Number.isFinite(value) && value > 0 ? value : 1;
}
function pricingConvertEgpCost(value, currency = pricingCurrencyValue(), exchangeRate = pricingExchangeRateValue()) {
  const amount = Number(value || 0);
  return currency === 'USD' ? amount / (Number(exchangeRate || 0) || 1) : amount;
}
function syncPricingExchangeRateVisibility() {
  const wrapper = pricingExchangeRateRef()?.closest('label');
  if (!wrapper) return;
  wrapper.classList.toggle('field-hidden', pricingCurrencyValue() !== 'USD');
  updatePricingCurrencyBadges();
}
function pricingPreviewPayloadFromEditor() {
  return { priceItems: readPricingItemsEditor(), currency:pricingCurrencyValue(), exchangeRate:pricingExchangeRateValue(), customer:refs.pricingCustomer?.value || '', pricingNumber:refs.pricingNumber?.value || '', pricingDate:refs.pricingDate?.value || '', weavingSource:refs.pricingWeavingSource?.value || '' };
}
function renderPricingFormulaBreakdown(payload = {}, calculated = {}) {
  const box = document.getElementById('pricingFormulaPreview');
  if (!box) return;
  const items = Array.isArray(payload.priceItems) && payload.priceItems.length ? payload.priceItems : [payload];
  const calculatedItems = Array.isArray(calculated.priceItems) && calculated.priceItems.length ? calculated.priceItems : [calculated];
  const currency = calculated.currency || payload.currency || pricingCurrencyValue();
  const currencyLabel = pricingCurrencyLabel(currency);
  const money = (value) => `${formatNumber(value || 0, 2)} ${currencyLabel}`;
  const egp = (value) => `${formatNumber(value || 0, 2)} ط¬ظ†ظٹظ‡`;
  if (items.length !== 1) {
    box.innerHTML = `<strong>طھظپطµظٹظ„ ط§ظ„طھط³ط¹ظٹط±:</strong> ظƒط±طھ ظ…ط¬ظ…ط¹ ظ…ظ† ${items.length} ط®ط§ظ…ط§طھ. ظ…طھظˆط³ط· ط³ط¹ط± ط§ظ„ط¨ظٹط¹ ${money(calculated.sellPrice)} ظˆط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط¹ظ‚ط¯ ${money(calculated.totalOffer)}.`;
    return;
  }
  const item = items[0] || {};
  const calc = calculatedItems[0] || calculated || {};
  const exchangeRate = Number(item.exchangeRate || payload.exchangeRate || calculated.exchangeRate || 0) || 1;
  const rawCost = Number(item.rawCost || 0);
  const dyeEgp = Number(item.dyeCost || 0);
  const dyeConverted = Number(calc.dyeCost || 0);
  const wasteCost = Number(calc.wasteCost || 0);
  const deferredCost = Number(calc.deferredCost || 0);
  const profitEgp = Number(item.profitPerKg || 0);
  const profitConverted = Number(calc.profitCost || calc.profitPerKg || 0);
  const rateText = currency === 'USD' ? ` | ط³ط¹ط± ط§ظ„ط¯ظˆظ„ط§ط± ط§ظ„ظ…ط³طھط®ط¯ظ…: ${formatNumber(exchangeRate, 2)}` : '';
  const profitText = currency === 'USD'
    ? `ط±ط¨ط­ ${egp(profitEgp)} = ${money(profitConverted)}`
    : `ط±ط¨ط­ ${money(profitConverted)}`;
  const dyeText = currency === 'USD'
    ? `طµط¨ط§ط؛ط© ${egp(dyeEgp)} = ${money(dyeConverted)}`
    : `طµط¨ط§ط؛ط© ${money(dyeConverted)}`;
  box.innerHTML = `<strong>ط·ط±ظٹظ‚ط© ط§ظ„ط­ط³ط§ط¨:</strong> ط®ط§ظ… ${money(rawCost)} + ${dyeText} + ظ‡ط§ظ„ظƒ ${money(wasteCost)} + ط£ط¬ظ„ ${money(deferredCost)} + ${profitText} = <strong>${money(calc.sellPrice || calculated.sellPrice || 0)}</strong>${rateText}`;
}
function renderPricingItemsEditor(pricing = null) {
  const rows = document.getElementById('pricingItemsRows');
  if (!rows) return;
  const items = pricing ? pricingItemsFor(pricing) : [pricingPrimaryItemFromRefs()];
  if (refs.pricingWeavingSource) refs.pricingWeavingSource.value = pricing?.weavingSource || items.find((item)=>item.weavingSource)?.weavingSource || '';
  rows.innerHTML = (items.length ? items : [pricingPrimaryItemFromRefs()]).map((item)=>pricingItemRowHtml(item)).join('');
  updatePricingCurrencyBadges();
}

function markPricingCardMode() {
  const legacyFields = [
    refs.pricingFabricType,
    refs.pricingMaterialType,
    refs.pricingDyehouse,
    refs.pricingColorClass,
    refs.pricingQuantity,
    refs.pricingInchWidth,
    refs.pricingFinishedWeight,
    refs.pricingRawCost,
    refs.pricingDyeCost,
    refs.pricingSuggestedDyeCost,
    refs.pricingWastePercent,
    refs.pricingExtraCost,
    refs.pricingProfitPerKg,
  ];
  legacyFields.filter(Boolean).forEach((field) => {
    field.required = false;
    field.removeAttribute('required');
    field.disabled = true;
    field.setAttribute('data-pricing-legacy-disabled', 'true');
    field.closest('label')?.classList.add('pricing-legacy-field');
  });
  refs.pricingDialog?.querySelector('.dialog-head h2')?.replaceChildren(document.createTextNode('ظƒط±طھ طھط³ط¹ظٹط± ط¬ط¯ظٹط¯'));
}

function installPricingWeavingSourceField() {
  if (!refs.pricingForm || document.getElementById('pricingWeavingSource')) {
    refs.pricingWeavingSource = document.getElementById('pricingWeavingSource');
    return;
  }
  const anchor = refs.pricingDyehouse?.closest('label') || refs.pricingFabricType?.closest('label');
  if (!anchor) return;
  anchor.insertAdjacentHTML('afterend', '<label><span>ظ…طµط¯ط± ط§ظ„ظ†ط³ظٹط¬</span><input id="pricingWeavingSource" autocomplete="off"></label>');
  refs.pricingWeavingSource = document.getElementById('pricingWeavingSource');
}

function ensurePricingItemsUi() {
  if (!refs.pricingForm || document.getElementById('pricingItemsBox')) return;
  const anchor = refs.pricingNotes?.closest('label') || refs.pricingForm.querySelector('.form-grid');
  if (!anchor) return;
  markPricingCardMode();
  installPricingWeavingSourceField();
  refs.pricingPaymentMode?.closest('label')?.insertAdjacentHTML('beforebegin', `<label><span>ط¹ظ…ظ„ط© ط§ظ„طھط³ط¹ظٹط±</span><select id="pricingCurrency"><option value="EGP">ط¬ظ†ظٹظ‡</option><option value="USD">ط¯ظˆظ„ط§ط±</option></select></label><label class="pricing-exchange-rate-field field-hidden"><span>ط³ط¹ط± ط§ظ„ط¯ظˆظ„ط§ط± ط§ظ„ظٹظˆظ…</span><input id="pricingExchangeRate" type="number" step="0.01" min="0" placeholder="ظ…ط«ط§ظ„: 52"><small>ظٹط­ظˆظ„ ط§ظ„طµط¨ط§ط؛ط© ظˆط§ظ„طھط¬ظ‡ظٹط² ط¨ط§ظ„ط¬ظ†ظٹظ‡ ط¥ظ„ظ‰ ط¯ظˆظ„ط§ط±.</small></label>`);
  anchor.insertAdjacentHTML('afterend', `<div class="full-row grouped-order-box pricing-items-box" id="pricingItemsBox"><div class="subsection-head"><div><span>ظƒط±طھ طھط³ط¹ظٹط±</span><p class="eyebrow">ط§ظ„طµظ†ظپ ظ‡ظˆ ط§ظ„ط®ط§ظ…ط©. ط¥ط¶ط§ظپط§طھ ط§ظ„طµط¨ط§ط؛ط© ط¯ط§ط®ظ„ ط¬ط¯ظˆظ„ ط§ظ„طµط¨ط§ط؛ط©طŒ ظˆط§ظ„ط¥ظƒط³ط³ظˆط§ط± ظ„ظ‡ ط¬ط¯ظˆظ„ ظ…ط³طھظ‚ظ„ ط¯ط§ط®ظ„ ظ†ظپط³ ط§ظ„ط¨ظ†ط¯.</p></div><button type="button" class="mini-btn" id="addPricingItemBtn">+ ط¥ط¶ط§ظپط© ط®ط§ظ…ط©</button></div><div class="grouped-order-head pricing-items-head"><span>ط§ظ„طµظ†ظپ / ط§ظ„ط®ط§ظ…ط©</span><span>ط§ظ„ظ…طµط¨ط؛ط©</span><span>ط§ظ„ظƒظ…ظٹط©</span><span>ط§ظ„ط¨ظˆطµط©</span><span>ط§ظ„ظˆط²ظ†</span><span>ط³ط¹ط± ط§ظ„ظ‚ظ…ط§ط´</span><span>ط¬ط¯ظˆظ„ ط§ظ„طµط¨ط§ط؛ط©</span><span>ط§ظ„ط¥ظƒط³ط³ظˆط§ط±</span><span>ظ‡ط§ظ„ظƒ %</span><span>طµط§ظپظٹ/ظ‚ط§ط¦ظ…</span><span>ط£ط¬ظ„ %</span><span>ط±ط¨ط­</span><span></span></div><div id="pricingItemsRows"></div></div>`);
  refs.pricingForm?.querySelector('.pricing-preview')?.insertAdjacentHTML('afterend', '<div class="pricing-formula-preview" id="pricingFormulaPreview"></div>');
  document.getElementById('addPricingItemBtn')?.addEventListener('click', () => {
    document.getElementById('pricingItemsRows')?.insertAdjacentHTML('beforeend', pricingItemRowHtml());
    applyFabricNameDatalist();
    updatePricingCurrencyBadges();
    updatePricingPreview();
  });
  document.getElementById('pricingItemsRows')?.addEventListener('click', (event)=>{
    const addStageButton = event.target.closest('[data-add-pricing-stage]');
    if (addStageButton) {
      addStageButton.closest('[data-pricing-stage-card]')?.querySelector('.pricing-stage-rows')?.insertAdjacentHTML('beforeend', pricingStageRowHtml());
      updatePricingCurrencyBadges();
      updatePricingStageTotals();
      updatePricingPreview();
      return;
    }
    const addAccessoryButton = event.target.closest('[data-add-pricing-accessory]');
    if (addAccessoryButton) {
      const itemRow = addAccessoryButton.closest('[data-pricing-item-row]');
      addAccessoryButton.closest('[data-pricing-accessory-card]')?.querySelector('.pricing-stage-rows')?.insertAdjacentHTML('beforeend', pricingAccessoryRowHtml({}, pricingStagesFromRow(itemRow)));
      updatePricingCurrencyBadges();
      updatePricingStageTotals();
      updatePricingPreview();
      return;
    }
    const removeAccessoryButton = event.target.closest('[data-remove-pricing-accessory]');
    if (removeAccessoryButton) {
      removeAccessoryButton.closest('[data-pricing-accessory-row]')?.remove();
      updatePricingStageTotals();
      updatePricingPreview();
      return;
    }
    const removeStageButton = event.target.closest('[data-remove-pricing-stage]');
    if (removeStageButton) {
      removeStageButton.closest('[data-pricing-stage-row]')?.remove();
      updatePricingStageTotals();
      updatePricingPreview();
      return;
    }
    const button = event.target.closest('[data-remove-pricing-item]');
    if (!button || button.disabled) return;
    button.closest('[data-pricing-item-row]')?.remove();
    updatePricingPreview();
  });
  document.getElementById('pricingItemsRows')?.addEventListener('input', () => { updatePricingStageTotals(); updatePricingPreview(); });
  document.getElementById('pricingItemsRows')?.addEventListener('change', () => { updatePricingStageTotals(); updatePricingPreview(); });
  [refs.pricingPaymentDetails].filter(Boolean).forEach((input)=>{
    input.addEventListener('input', updatePricingPreview);
    input.addEventListener('change', updatePricingPreview);
  });
  pricingCurrencyRef()?.addEventListener('change', () => { syncPricingExchangeRateVisibility(); updatePricingPreview(); });
  pricingExchangeRateRef()?.addEventListener('input', updatePricingPreview);
  pricingExchangeRateRef()?.addEventListener('change', updatePricingPreview);
  renderPricingItemsEditor();
  syncPricingExchangeRateVisibility();
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
  pricingRowsForReport,
} = window.createPricingUi({
  refs,
  escapeHtml,
  activeDyehousePriceLibrary,
  isLegacyRecoveredText,
  normalizeDyehousePriceLabel,
  uniqueNonEmpty,
  getSuggestedDyeCost,
  calculatePricing,
  pricingWithOperationalWastePercent,
  buildItemCode,
  setPaymentFields,
  pricingForOrder,
  calculateOrder,
  orderRawCost,
  nextPricingNumber,
  isActivePricing,
  pricingMatchesOrder,
  pricingConvertedByOrder,
  canDeleteRecords,
  getPricings: () => pricings,
  getOrders: () => orders,
  getSelectedOrderId: () => selectedOrderId,
  setEditingPricingId: (value) => { editingPricingId = value; },
  setPendingPricingOrderId: (value) => { pendingPricingOrderId = value; },
  resetOrderEditingContext: () => {
    setOrderFormPricingConversionMode(false);
    pendingConvertedPricingId = null;
    pendingConvertedPricingItems = [];
    pendingConvertedOrderDrafts = [];
    editingOrderId = null;
    if (refs.orderDialog?.open) refs.orderDialog.close();
  },
  showAlert: (message) => alert(message),
  pricingPreviewPayloadFromEditor,
  renderPricingItemsEditor,
  renderPricingFormulaBreakdown,
}));

function openFilteredPricingsReport() {
  const rows = typeof pricingRowsForReport === 'function' ? pricingRowsForReport() : [];
  const pricingPrintActualSellableBalanceLabel = 'الرصيد الفعلي للبيع';
  const currencyName = (currency) => currency === 'USD' ? 'ط¯ظˆظ„ط§ط±' : 'ط¬ظ†ظٹظ‡';
  const money = (value, currency) => `${formatNumber(value || 0, 2)} ${currencyName(currency)}`;
  const unifiedNumber = (row) => row.linkedOrder?.orderNumber || row.pricingNumber || '-';
  const sellableBalance = (row) => Number(row.linkedOrder?.warehouseBalance || 0);
  const totalsByCurrency = rows.reduce((acc, row) => {
    const currency = row.currency || 'EGP';
    acc[currency] = (acc[currency] || 0) + Number(row.totalOffer || 0);
    return acc;
  }, {});
  const totalContractsText = Object.entries(totalsByCurrency).map(([currency, total]) => money(total, currency)).join(' / ') || money(0, 'EGP');
  const totalSellableBalance = rows.reduce((total, row) => total + sellableBalance(row), 0);
  const tableRows = rows.map((row)=>`<tr>
    <td>${escapeHtml(unifiedNumber(row))}</td>
    <td>${escapeHtml(row.customer || '-')}</td>
    <td>${escapeHtml(row.fabricType || '-')}</td>
    <td>${escapeHtml(row.dyehouse || '-')}</td>
    <td>${formatNumber(row.quantity || 0)}</td>
    <td>${escapeHtml(money(row.rawCost, row.currency))}</td>
    <td>${escapeHtml(money(row.sellPrice, row.currency))}</td>
    <td>${escapeHtml(money(row.totalOffer, row.currency))}</td>
    <td>${formatNumber(sellableBalance(row))} ظƒط¬ظ…</td>
    <td>${row.listMode === 'linked' ? 'ظ…ط±طھط¨ط· ط¨ط·ظ„ط¨ طھط´ط؛ظٹظ„' : 'ظƒط±طھ طھط³ط¹ظٹط± ط´ط؛ط§ظ„'}</td>
  </tr>`).join('') || emptyRow(10, 'ظ„ط§ طھظˆط¬ط¯ ظƒط±ظˆطھ طھط³ط¹ظٹط± ظ…ط·ط§ط¨ظ‚ط© ظ„ظ„ظپظ„طھط±ط©.');
  refs.documentTitle.textContent = 'ظ‚ط§ط¦ظ…ط© ط§ظ„طھط³ط¹ظٹط±';
  refs.documentBody.innerHTML = `<div class="document-sheet two-b-report">
    ${documentHeader()}
    <div class="report-title"><h2>ظ‚ط§ط¦ظ…ط© ط§ظ„طھط³ط¹ظٹط±</h2><span>طھظ‚ط±ظٹط± ظ…ط·ط§ط¨ظ‚ ظ„ظ„ظپظ„طھط±ط© ط§ظ„ط­ط§ظ„ظٹط© ظپظٹ ط´ط§ط´ط© ظƒط±ظˆطھ ط§ظ„طھط³ط¹ظٹط±.</span></div>
    <div class="document-meta">
      <div><span>ط¹ط¯ط¯ ط§ظ„ط¨ظ†ظˆط¯</span>${formatNumber(rows.length, 0)}</div>
      <div><span>ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط¹ظ‚ط¯</span>${escapeHtml(totalContractsText)}</div>
      <div><span>${pricingPrintActualSellableBalanceLabel}</span>${formatNumber(totalSellableBalance)} ظƒط¬ظ…</div>
      <div><span>طھط§ط±ظٹط® ط§ظ„ط·ط¨ط§ط¹ط©</span>${new Date().toLocaleString('en-GB')}</div>
    </div>
    <section class="report-section">
      <h3>ظƒط±ظˆطھ ط§ظ„طھط³ط¹ظٹط±</h3>
      <table><thead><tr><th>ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨</th><th>ط§ظ„ط¹ظ…ظٹظ„</th><th>ط§ظ„طµظ†ظپ</th><th>ط§ظ„ظ…طµط¨ط؛ط©</th><th>ط§ظ„ظƒظ…ظٹط©</th><th>ط³ط¹ط± ط§ظ„ط®ط§ظ…</th><th>ط³ط¹ط± ط§ظ„ظ…ط¬ظ‡ط²</th><th>ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط¹ظ‚ط¯</th><th>ط§ظ„ط±طµظٹط¯ ط§ظ„ظپط¹ظ„ظٹ ظ„ظ„ط¨ظٹط¹</th><th>ط§ظ„ط­ط§ظ„ط©</th></tr></thead><tbody>${tableRows}</tbody></table>
    </section>
    <div class="summary-grid document-summary print-summary">
      <div class="metric emphasis"><span>ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط¹ظ‚ط¯</span><strong>${escapeHtml(totalContractsText)}</strong></div>
      <div class="metric"><span>ط§ظ„ط±طµظٹط¯ ط§ظ„ظپط¹ظ„ظٹ ظ„ظ„ط¨ظٹط¹</span><strong>${formatNumber(totalSellableBalance)} ظƒط¬ظ…</strong></div>
    </div>
    ${documentFooter()}
  </div>`;
  refs.documentDialog.showModal();
}

function pricingPayload(id = uid()) {
  const paymentTerms = composePaymentTerms(refs.pricingPaymentMode?.value, refs.pricingPaymentDetails?.value);
  if (refs.pricingPaymentTerms) refs.pricingPaymentTerms.value = paymentTerms;
  const currency = pricingCurrencyValue();
  const exchangeRate = pricingExchangeRateValue();
  const cardWeavingSource = refs.pricingWeavingSource?.value || '';
  const priceItems = readPricingItemsEditor().map((item)=>({ ...item, currency, exchangeRate, weavingSource:item.weavingSource || cardWeavingSource }));
  const primaryItem = priceItems[0] || pricingPrimaryItemFromRefs();
  const summary = calculatePricing({ priceItems: priceItems.length ? priceItems : [primaryItem] });
  return { id, pricingNumber:refs.pricingNumber.value, productCode:buildItemCode(refs.pricingNumber.value), customer:canonicalCustomerName(refs.pricingCustomer.value), pricingDate:refs.pricingDate.value, fabricType:primaryItem.fabricType || refs.pricingFabricType.value, dyehouse:primaryItem.dyehouse || refs.pricingDyehouse.value, weavingSource:primaryItem.weavingSource || cardWeavingSource, colorClass:primaryItem.colorClass || refs.pricingColorClass.value, quantity:+summary.quantity || +primaryItem.quantity || +refs.pricingQuantity.value, inchWidth:primaryItem.inchWidth || refs.pricingInchWidth.value, finishedWeight:+primaryItem.finishedWeight || +refs.pricingFinishedWeight.value, materialType:primaryItem.materialType || refs.pricingMaterialType.value, rawCost:+primaryItem.rawCost || +refs.pricingRawCost.value, dyeCost:+primaryItem.dyeCost || +refs.pricingDyeCost.value, wastePercent:+primaryItem.wastePercent || +refs.pricingWastePercent.value, extraCost:+primaryItem.extraCost || +refs.pricingExtraCost.value, profitPerKg:+primaryItem.profitPerKg || +refs.pricingProfitPerKg.value, currency, exchangeRate, priceItems, paymentTerms, notes:refs.pricingNotes.value };
}
function validatePricingPayloadForSave(pricing) {
  const items = Array.isArray(pricing?.priceItems)
    ? pricing.priceItems.filter((item)=>item.fabricType || Number(item.quantity || 0) > 0 || Number(item.rawCost || 0) > 0)
    : [];
  if (!String(pricing?.customer || '').trim()) {
    alert('ط§ط®طھط± ط§ظ„ط¹ظ…ظٹظ„ ظ‚ط¨ظ„ ط­ظپط¸ ظƒط±طھ ط§ظ„طھط³ط¹ظٹط±.');
    return false;
  }
  if (!items.length) {
    alert('ط£ط¶ظپ ط®ط§ظ…ط© ظˆط§ط­ط¯ط© ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„ ط¯ط§ط®ظ„ ظƒط±طھ ط§ظ„طھط³ط¹ظٹط±.');
    return false;
  }
  const incompleteItem = items.find((item)=>!String(item.fabricType || '').trim() || Number(item.quantity || 0) <= 0);
  if (incompleteItem) {
    alert('ظƒظ„ ط®ط§ظ…ط© ظپظٹ ظƒط±طھ ط§ظ„طھط³ط¹ظٹط± ظٹط¬ط¨ ط£ظ† طھط­طھظˆظٹ ط¹ظ„ظ‰ ط§ظ„طµظ†ظپ ظˆط§ظ„ظƒظ…ظٹط©.');
    return false;
  }
  return true;
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
  recordAudit('update', 'order', updatedOrder.id, before, updatedOrder, `ط±ط¨ط· ط§ظ„ط·ظ„ط¨ ط±ظ‚ظ… ${updatedOrder.orderNumber || ''} ط¨ط§ظ„طھط³ط¹ظٹط±ط©`);
  await persistAuditLog();
  return true;
}
async function deletePricing(id) {
  const pricing = pricings.find((item)=>item.id===id);
  if (!pricing) return;
  if (!confirm(`ظ‡ظ„ طھط±ظٹط¯ ط­ط°ظپ ط§ظ„طھط³ط¹ظٹط±ط© ط±ظ‚ظ… ${pricing.pricingNumber}طں`)) return;
  if (!(await ensureBackendForWrite())) return;
  const backendSaveRequired = true;
  const deleted = await deleteBackend(`/pricings/${id}`);
  if (backendSaveRequired && !deleted) {
    await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ط°ظپ ط§ظ„طھط³ط¹ظٹط±ط© ظ…ظ† ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ط­ط°ظپ.');
    return;
  }
  recordAudit('delete', 'pricing', id, pricing, null, `ط­ط°ظپ ط§ظ„طھط³ط¹ظٹط±ط© ط±ظ‚ظ… ${pricing.pricingNumber || ''}`);
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
      if (!validatePricingPayloadForSave(updatedPricing)) return;
      const backendCustomer = await ensureBackendCustomer(updatedPricing.customer);
      const savedPricing = await putBackend(`/pricings/${editingPricingId}`, pricingToApi(updatedPricing, backendCustomer));
      if (backendSaveRequired && !savedPricing) {
        await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ طھط¹ط¯ظٹظ„ ط§ظ„طھط³ط¹ظٹط±ط© ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„طھط¹ط¯ظٹظ„.');
        return;
      }
      if (!(await verifyPricingPersisted(editingPricingId, updatedPricing))) {
        await rollbackAfterBackendWriteFailure('طھظ… ط¥ط±ط³ط§ظ„ طھط¹ط¯ظٹظ„ ط§ظ„طھط³ط¹ظٹط±ط© ظ„ظƒظ† ظ„ظ… ظٹط±ط¬ط¹ ظ…ظ† ظ‚ط§ط¹ط¯ط© Railway. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„طھط¹ط¯ظٹظ„.');
        return;
      }
      if (pendingPricingOrderId) {
        const linked = await attachPricingToOrder(pendingPricingOrderId, editingPricingId);
        if (!linked) {
          await rollbackAfterBackendWriteFailure('طھظ… ط­ظپط¸ طھط¹ط¯ظٹظ„ ط§ظ„طھط³ط¹ظٹط±ط© ظ„ظƒظ† طھط¹ط°ط± ط±ط¨ط·ظ‡ط§ ط¨ط§ظ„ط·ظ„ط¨ ط§ظ„ط­ط§ظ„ظٹ. ط±ط§ط¬ط¹ ط§ظ„ط§طھطµط§ظ„ ط«ظ… ط­ط§ظˆظ„ ظ…ظ† طھظپط§طµظٹظ„ ط§ظ„ط·ظ„ط¨ ظ…ط±ط© ط£ط®ط±ظ‰.');
          return;
        }
      }
      recordAudit('update', 'pricing', editingPricingId, before, updatedPricing, `طھط¹ط¯ظٹظ„ ط§ظ„طھط³ط¹ظٹط±ط© ط±ظ‚ظ… ${updatedPricing.pricingNumber || ''}`);
      await persistAuditLog();
    }
    editingPricingId = null;
  } else {
    const createdPricing = pricingPayload();
    if (!validatePricingPayloadForSave(createdPricing)) return;
    const backendCustomer = await ensureBackendCustomer(createdPricing.customer);
    const savedPricing = await postBackend('/pricings', pricingToApi(createdPricing, backendCustomer));
    if (backendSaveRequired && !savedPricing) {
      await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط§ظ„طھط³ط¹ظٹط±ط© ط§ظ„ط¬ط¯ظٹط¯ط© ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„طھط³ط¹ظٹط±ط©.');
      return;
    }
    if (!(await verifyPricingPersisted(savedPricing.id || createdPricing.id, createdPricing))) {
      await rollbackAfterBackendWriteFailure('طھظ… ط¥ط±ط³ط§ظ„ ط§ظ„طھط³ط¹ظٹط±ط© ظ„ظƒظ† ظ„ظ… طھط±ط¬ط¹ ظ…ظ† ظ‚ط§ط¹ط¯ط© Railway. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„طھط³ط¹ظٹط±ط©.');
      return;
    }
    if (pendingPricingOrderId) {
      const linked = await attachPricingToOrder(pendingPricingOrderId, savedPricing.id || createdPricing.id);
      if (!linked) {
        await rollbackAfterBackendWriteFailure('طھظ… ط­ظپط¸ ط§ظ„طھط³ط¹ظٹط±ط© ظ„ظƒظ† طھط¹ط°ط± ط±ط¨ط·ظ‡ط§ ط¨ط§ظ„ط·ظ„ط¨ ط§ظ„ط­ط§ظ„ظٹ. ط±ط§ط¬ط¹ ط§ظ„ط§طھطµط§ظ„ ط«ظ… ط­ط§ظˆظ„ ظ…ظ† طھظپط§طµظٹظ„ ط§ظ„ط·ظ„ط¨ ظ…ط±ط© ط£ط®ط±ظ‰.');
        return;
      }
    }
    recordAudit('create', 'pricing', createdPricing.id, null, createdPricing, `ط¥ظ†ط´ط§ط، ط§ظ„طھط³ط¹ظٹط±ط© ط±ظ‚ظ… ${createdPricing.pricingNumber || ''}`);
    await persistAuditLog();
  }
  await loadBackendData();
  pendingPricingOrderId = null;
  refs.pricingDialog.close();
}
function convertPricingToOrder(id) {
  const sourcePricing = pricings.find((item)=>item.id===id);
  const pricing = calculatePricing(sourcePricing);
  if (!pricing) return;
  const sourceItems = pricingItemsFor(sourcePricing || pricing)
    .filter((item)=>item.fabricType || Number(item.quantity || 0) > 0);
  const sourceOrderItems = (sourceItems.length ? sourceItems : [sourcePricing || pricing])
    .filter((item)=>item && (item.fabricType || Number(item.quantity || 0) > 0));
  const orderDrafts = sourceOrderItems.map((item)=>pricingItemToOrderDraft(item, pricing));
  const items = sourceOrderItems
    .map((item)=>calculatePricing({ ...pricing, ...item, priceItems:null }))
    .filter((item)=>item.fabricType || Number(item.quantity || 0) > 0);
  const primary = items[0] || pricing;
  const primaryDraft = orderDrafts[0] || pricingItemToOrderDraft(primary, pricing);
  const orderNumber = orderNumberFromPricing(pricing.pricingNumber);
  pendingConvertedPricingId = pricing.id;
  pendingConvertedPricingItems = sourceOrderItems;
  pendingConvertedOrderDrafts = orderDrafts;
  editingOrderId = null;
  fillOrderForm({
    pricingId: pricing.id,
    orderNumber,
    productCode: buildItemCode(orderNumber),
    customer: pricing.customer || '',
    orderDate: pricing.pricingDate || new Date().toISOString().slice(0,10),
    fabricType: primaryDraft.fabricType || primary.fabricType || pricing.fabricType || '',
    totalRawQuantity: primaryDraft.totalRawQuantity || primary.quantity || pricing.quantity || '',
    expectedWastePercent: primaryDraft.expectedWastePercent || '',
    widthMode: 'single',
    inchWidth: primaryDraft.inchWidth || primary.inchWidth || pricing.inchWidth || '',
    widthLines: [],
    kiloPrice: primaryDraft.kiloPrice || primary.sellPrice || pricing.sellPrice || '',
    rawCost: primaryDraft.rawCost || primary.rawCost || pricing.rawCost || 0,
    paymentTerms: pricing.paymentTerms || '',
    dyehouse: primaryDraft.dyehouse || primary.dyehouse || pricing.dyehouse || '',
    weavingSource: primaryDraft.weavingSource || pricing.weavingSource || 'ظ…ظ† ظƒط±طھ ط§ظ„طھط³ط¹ظٹط±',
    accessoryType: primaryDraft.accessoryType || '',
    accessoryPercent: primaryDraft.accessoryPercent || 0,
    accessoryLines: primaryDraft.accessoryLines || [],
    notes: pricing.notes || '',
    operationNotes: {}
  });
  if (items.length > 1) {
    const rows = document.getElementById('groupedOrderRows');
    if (rows) {
      rows.innerHTML = orderDrafts.map((item, index)=>groupedOrderRowHtml({
        fabricType:item.fabricType || '',
        totalRawQuantity:item.totalRawQuantity || '',
        inchWidth:item.inchWidth || '',
        kiloPrice:item.kiloPrice || '',
        expectedWastePercent:item.expectedWastePercent || '',
        dyehouse:item.dyehouse || '',
        weavingSource:item.weavingSource || '',
        accessoryType:item.accessoryType || '',
        accessoryLines:item.accessoryLines || [],
      }, index === 0)).join('');
      syncGroupedOrderUi();
    }
  }
  setOrderFormPricingConversionMode(true, orderDrafts.length || items.length || 1);
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.orderDialog.showModal();
}
async function markPricingConverted(pricingNumber, orderId, pricingId = null) {
  const convertedAt = new Date().toISOString();
  const converted = [];
  const convertedOrder = orders.find((order)=>order.id === orderId);
  pricings.forEach((pricing)=>{
    const matches = pricingId
      ? pricing.id === pricingId
      : (convertedOrder ? pricingMatchesOrder(pricing, convertedOrder) : (String(pricing.pricingNumber)===String(pricingNumber) || orderNumberFromPricing(pricing.pricingNumber)===String(pricingNumber)));
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
function openCustomerPricingQuotation(id) {
  const sourcePricing = pricings.find((item)=>item.id===id);
  const pricing = calculatePricing(sourcePricing);
  if (!pricing) return;
  const items = pricingItemsFor(sourcePricing || pricing)
    .map((item)=>calculatePricing({ ...pricing, ...item, priceItems:null }))
    .filter((item)=>item.fabricType || Number(item.quantity || 0) > 0);
  const money = (value) => Number(value || 0).toLocaleString('en-US');
  const currency = pricingCurrencyLabel(pricing.currency || pricing.priceItems?.find((item)=>item?.currency)?.currency || 'EGP');
  const customer = pricing.customer || pricing.customerName || pricing.clientName || '-';
  const notes = String(pricing.notes || '').trim();
  const alreadyConverted = pricingConvertedByOrder(sourcePricing || pricing);
  const convertPricingButton = alreadyConverted ? '' : `<button class="mini-btn" data-convert-pricing="${escapeHtml(pricing.id)}">طھط­ظˆظٹظ„ ظ„ط·ظ„ط¨ طھط´ط؛ظٹظ„</button>`;
  const wasteBasisLabel = (item) => (item.wasteBasis || item.accountingMode) === 'gross' ? 'ظ‚ط§ط¦ظ…' : 'طµط§ظپظٹ';
  const dyeStagesLabel = (item) => Array.isArray(item.dyeStages) && item.dyeStages.length
    ? item.dyeStages.map((stage)=>`${escapeHtml(stage.name || 'ظ…ط±ط­ظ„ط©')} ${money(stage.price)}`).join('<br>')
    : money(item.dyeCost);
  const accessoryLabel = (item) => Array.isArray(item.accessoryLines) && item.accessoryLines.length
    ? item.accessoryLines.map((line)=>{
        const quantity = Number(line.quantity ?? line.percent ?? 0);
        const unitPrice = Number(line.unitPrice ?? (Number(line.price || 0) + Number(line.stageCost || 0)));
        const stages = pricingAccessorySelectedStageNames(line).length ? ` + ${escapeHtml(pricingAccessorySelectedStageNames(line).join(' / '))}` : '';
        return `${escapeHtml(line.type || 'ط¥ظƒط³ط³ظˆط§ط±')} ${money(quantity)} ظƒط¬ظ… أ— ${money(unitPrice)} ${currency}${stages} = ${money(line.total ?? quantity * unitPrice)} ${currency}`;
      }).join('<br>')
    : '-';
  const itemRows = (items.length ? items : [pricing]).map((item)=>`<tr>
    <td>${escapeHtml(item.fabricType || '-')}</td>
    <td>${money(item.quantity)} \u0643\u062c\u0645</td>
    <td>${money(item.rawCost)}</td>
    <td>${dyeStagesLabel(item)}</td>
    <td>${accessoryLabel(item)}</td>
    <td>${money(item.wasteCost)} (${money(item.wastePercent)}% ${wasteBasisLabel(item)})</td>
    <td>${money(item.deferredCost)} (${money(item.deferredMonths || 0)} ط´ظ‡ط± / ${money(item.deferredPercent)}%)</td>
    <td>${money(item.profitPerKg)}</td>
    <td>${money(item.sellPrice)} \u062c\u0646\u064a\u0647</td>
    <td>${money(item.totalOffer)} \u062c\u0646\u064a\u0647</td>
  </tr>`).join('');
  const publicAccessoryRows = (item) => Array.isArray(item.accessoryLines) && item.accessoryLines.length
    ? item.accessoryLines.map((line)=>{
        const quantity = Number(line.quantity ?? line.percent ?? 0);
        const unitPrice = Number(line.unitPrice ?? (Number(line.price || 0) + Number(line.stageCost || 0)));
        const total = Number(line.total ?? quantity * unitPrice);
        return `<tr class="quotation-accessory-row">
          <td><span class="quotation-line-kind">ط¥ظƒط³ط³ظˆط§ط±</span><strong>${escapeHtml(line.type || 'ط¥ظƒط³ط³ظˆط§ط±')}</strong></td>
          <td>${money(quantity)} ظƒط¬ظ…</td>
          <td>${money(unitPrice)} ${currency}</td>
          <td>${money(total)} ${currency}</td>
        </tr>`;
      }).join('')
    : '';
  const publicItemRows = (items.length ? items : [pricing]).map((item)=>{
    const clothTotal = Number(item.clothTotal ?? Number(item.sellPrice || 0) * Number(item.quantity || 0));
    return `<tr class="quotation-fabric-row">
      <td><span class="quotation-line-kind">ظ‚ظ…ط§ط´</span><strong>${escapeHtml(item.fabricType || '-')}</strong></td>
      <td>${money(item.quantity)} \u0643\u062c\u0645</td>
      <td>${money(item.sellPrice)} ${currency}</td>
      <td>${money(clothTotal)} ${currency}</td>
    </tr>${publicAccessoryRows(item)}`;
  }).join('');
  refs.documentTitle.textContent = '\u0639\u0631\u0636 \u0633\u0639\u0631';
  refs.documentBody.dataset.documentType = 'pricing-quotation';
  refs.documentBody.dataset.documentNumber = pricing.pricingNumber || pricing.id || '';
  refs.documentBody.dataset.reportTitle = 'عرض سعر';
  refs.documentBody.innerHTML = `<div class="document-sheet quotation-report two-b-report">
    ${documentHeader()}
    <div class="document-inline-actions no-print">${convertPricingButton}<button class="mini-btn" data-edit-pricing-doc="${escapeHtml(pricing.id)}">\u062a\u0639\u062f\u064a\u0644</button></div>
    <div class="report-title quotation-title"><h2>\u0639\u0631\u0636 \u0633\u0639\u0631 \u0644\u0644\u0639\u0645\u064a\u0644 <small># ${escapeHtml(pricing.pricingNumber || '-')}</small></h2><span>\u0639\u0631\u0636 \u0633\u0639\u0631 \u0645\u0642\u062f\u0645 \u0644\u0644\u0639\u0645\u064a\u0644.</span></div>
    <div class="document-meta quotation-meta">
      <div><span>\u0627\u0644\u0639\u0645\u064a\u0644</span>${escapeHtml(customer)}</div>
      <div><span>\u0627\u0644\u062a\u0627\u0631\u064a\u062e</span>${escapeHtml(pricing.pricingDate || '-')}</div>
      <div><span>\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0643\u0645\u064a\u0629</span>${money(pricing.quantity)} \u0643\u062c\u0645</div>
      <div><span>\u0627\u0644\u0639\u0645\u0644\u0629</span>${currency}</div>
      <div><span>\u0637\u0631\u064a\u0642\u0629 \u0627\u0644\u0633\u062f\u0627\u062f</span>${escapeHtml(pricing.paymentTerms || '\u0643\u0627\u0634')}</div>
    </div>
    <section class="report-section quotation-summary">
      <h3>\u0645\u0644\u062e\u0635 \u0627\u0644\u0639\u0631\u0636</h3>
      <div class="quotation-kpis quotation-kpis-single">
        <div class="quotation-total"><span>\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0639\u0642\u062f</span><strong>${money(pricing.totalOffer)} ${currency}</strong></div>
      </div>
    </section>
    <section class="report-section">
      <h3>\u0628\u0646\u0648\u062f \u0627\u0644\u0639\u0631\u0636</h3>
      <table class="quotation-items-table"><thead><tr><th>\u0627\u0644\u0628\u0646\u062f</th><th>\u0627\u0644\u0643\u0645\u064a\u0629</th><th>\u0633\u0639\u0631 \u0627\u0644\u0643\u064a\u0644\u0648</th><th>\u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a</th></tr></thead><tbody>${publicItemRows}</tbody></table>
    </section>
    <section class="report-section quotation-notes"><h3>\u0645\u0644\u0627\u062d\u0638\u0627\u062a</h3><p>${escapeHtml([notes, 'ط¹ط±ط¶ ط§ظ„ط³ط¹ط± ط³ط§ط±ظٹ ظ„ظ…ط¯ط© 7 ط£ظٹط§ظ….'].filter(Boolean).join('\n'))}</p></section>
    ${documentFooter()}
  </div>`;
  refs.documentDialog.showModal();
}
function openPricingCostSheet(id) {
  const sourcePricing = pricings.find((item)=>item.id===id);
  const pricing = calculatePricing(sourcePricing);
  if (!pricing) return;
  const items = pricingItemsFor(sourcePricing || pricing)
    .map((item)=>calculatePricing({ ...pricing, ...item, priceItems:null }))
    .filter((item)=>item.fabricType || Number(item.quantity || 0) > 0);
  const money = (value) => Number(value || 0).toLocaleString('en-US');
  const currency = pricingCurrencyLabel(pricing.currency || pricing.priceItems?.find((item)=>item?.currency)?.currency || 'EGP');
  const stageRows = (item) => Array.isArray(item.dyeStages) && item.dyeStages.length
    ? item.dyeStages.map((stage)=>`${escapeHtml(stage.name || 'ظ…ط±ط­ظ„ط©')} ${money(stage.price)} ط¬ظ†ظٹظ‡`).join('<br>')
    : `${money(item.dyeCost || 0)} ط¬ظ†ظٹظ‡`;
  const accessoryCostRows = (item) => Array.isArray(item.accessoryLines) && item.accessoryLines.length
    ? item.accessoryLines.map((line)=>`<tr>
        <td>ط¥ظƒط³ط³ظˆط§ط±: ${escapeHtml(line.type || '-')}</td>
        <td>${money(line.quantity)} ظƒط¬ظ…</td>
        <td>${money(line.price)} ${currency}</td>
        <td>${money(line.stageCostConverted ?? line.stageCost ?? 0)} ${currency}</td>
        <td>${money(line.wasteCost)} ${currency} (${money(line.wastePercent)}%)</td>
        <td>${money(line.deferredCost)} ${currency}</td>
        <td>${money(line.profitCost ?? line.profitPerKg ?? 0)} ${currency}</td>
        <td>${money(line.costPerKg)} ${currency}</td>
        <td>${money(line.sellPrice ?? line.unitPrice)} ${currency}</td>
        <td>${money(line.total)} ${currency}</td>
      </tr>`).join('')
    : '';
  const itemRows = (items.length ? items : [pricing]).map((item)=>`<tr>
      <td>ظ‚ظ…ط§ط´: ${escapeHtml(item.fabricType || '-')}</td>
      <td>${money(item.quantity)} ظƒط¬ظ…</td>
      <td>${money(item.rawCost)} ${currency}</td>
      <td>${stageRows(item)}</td>
      <td>${money(item.wasteCost)} ${currency} (${money(item.wastePercent)}%)</td>
      <td>${money(item.deferredCost)} ${currency}</td>
      <td>${money(item.profitCost ?? item.profitPerKg ?? 0)} ${currency}</td>
      <td>${money(item.costPerKg)} ${currency}</td>
      <td>${money(item.sellPrice)} ${currency}</td>
      <td>${money(item.clothTotal)} ${currency}</td>
    </tr>${accessoryCostRows(item)}`).join('');
  refs.documentTitle.textContent = 'طھظ‚ط±ظٹط± طھظƒظ„ظپط© ظƒط±طھ ط§ظ„طھط³ط¹ظٹط±';
  refs.documentBody.dataset.documentType = 'pricing-cost';
  refs.documentBody.dataset.documentNumber = pricing.pricingNumber || pricing.id || '';
  refs.documentBody.dataset.reportTitle = 'تقرير تكلفة داخلي';
  refs.documentBody.innerHTML = `<div class="document-sheet quotation-report two-b-report">
    ${documentHeader()}
    <div class="report-title quotation-title"><h2>طھظ‚ط±ظٹط± طھظƒظ„ظپط© ط¯ط§ط®ظ„ظٹ <small># ${escapeHtml(pricing.pricingNumber || '-')}</small></h2><span>ظ…ط³طھظ†ط¯ ط¯ط§ط®ظ„ظٹ ظ„ظ…ط¬ظ…ظˆط¹ط© ط§ظ„طھظƒط§ظ„ظٹظپ ظˆظ„ط§ ظٹط±ط³ظ„ ظ„ظ„ط¹ظ…ظٹظ„.</span></div>
    <div class="document-meta quotation-meta">
      <div><span>ط§ظ„ط¹ظ…ظٹظ„</span>${escapeHtml(pricing.customer || '-')}</div>
      <div><span>ط§ظ„طھط§ط±ظٹط®</span>${escapeHtml(pricing.pricingDate || '-')}</div>
      <div><span>ط§ظ„ط¹ظ…ظ„ط©</span>${currency}</div>
      <div><span>ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط¹ظ‚ط¯</span>${money(pricing.totalOffer)} ${currency}</div>
    </div>
    <section class="report-section">
      <h3>طھظپطµظٹظ„ ط§ظ„طھظƒظ„ظپط©</h3>
      <table class="quotation-items-table"><thead><tr><th>ط§ظ„ط¨ظ†ط¯</th><th>ط§ظ„ظƒظ…ظٹط©</th><th>ط³ط¹ط± ط§ظ„ط®ط§ظ…</th><th>ط§ظ„طµط¨ط§ط؛ط© / ط§ظ„ظ…ط±ط§ط­ظ„</th><th>ط§ظ„ظ‡ط§ظ„ظƒ</th><th>ط§ظ„ط£ط¬ظ„</th><th>ط§ظ„ط±ط¨ط­</th><th>طھظƒظ„ظپط© ط§ظ„ظƒظٹظ„ظˆ</th><th>ط³ط¹ط± ط§ظ„ط¨ظٹط¹</th><th>ط§ظ„ط¥ط¬ظ…ط§ظ„ظٹ</th></tr></thead><tbody>${itemRows}</tbody></table>
    </section>
    <section class="report-section quotation-notes"><h3>ظ…ظ„ط§ط­ط¸ط§طھ</h3><p>${escapeHtml(pricing.notes || 'ظ„ط§ طھظˆط¬ط¯ ظ…ظ„ط§ط­ط¸ط§طھ.')}</p></section>
    ${documentFooter()}
  </div>`;
  refs.documentDialog.showModal();
}

function openPricingQuotation(id) {
  return openCustomerPricingQuotation(id);
  const pricing = calculatePricing(pricings.find((item)=>item.id===id));
  if (!pricing) return;
  const money = (value) => Number(value || 0).toLocaleString('en-US');
  const customer = pricing.customer || pricing.customerName || pricing.clientName || '-';
  const notes = String(pricing.notes || '').trim();
  refs.documentTitle.textContent = 'ط¹ط±ط¶ ط³ط¹ط±';
  refs.documentBody.innerHTML = `<div class="document-sheet quotation-report two-b-report">
    ${documentHeader()}
    <div class="document-inline-actions no-print"><button class="mini-btn" data-convert-pricing="${escapeHtml(pricing.id)}">طھظ†ط²ظٹظ„ ط·ظ„ط¨</button><button class="mini-btn" data-edit-pricing-doc="${escapeHtml(pricing.id)}">طھط¹ط¯ظٹظ„</button></div>
    <div class="report-title"><h2>ط¹ط±ط¶ ط³ط¹ط± <small># ${escapeHtml(pricing.pricingNumber || '-')}</small></h2><span>ط¹ط±ط¶ ظ…ظ‚ط¯ظ… ظ„ظ„ط¹ظ…ظٹظ„ ط­ط³ط¨ ط¨ظٹط§ظ†ط§طھ ط§ظ„طھط³ط¹ظٹط± ط§ظ„ط­ط§ظ„ظٹط©.</span></div>
    <div class="document-meta">
      <div><span>ط§ظ„ط¹ظ…ظٹظ„</span>${escapeHtml(customer)}</div>
      <div><span>ط§ظ„طھط§ط±ظٹط®</span>${escapeHtml(pricing.pricingDate || '-')}</div>
      <div><span>ط§ظ„طµظ†ظپ</span>${escapeHtml(pricing.fabricType || '-')}</div>
      <div><span>ط¯ط±ط¬ط© ط§ظ„ظ„ظˆظ†</span>${escapeHtml(pricing.colorClass || '-')}</div>
      <div><span>ط§ظ„ظƒظ…ظٹط©</span>${money(pricing.quantity)} ظƒط¬ظ…</div>
      <div><span>ط§ظ„ط¨ظˆطµط©</span>${escapeHtml(pricing.inchWidth || '-')}</div>
      <div><span>ط§ظ„ظˆط²ظ† ط§ظ„ظ…ط¬ظ‡ط²</span>${escapeHtml(pricing.finishedWeight || '-')}</div>
      <div><span>ط·ط±ظٹظ‚ط© ط§ظ„ط³ط¯ط§ط¯</span>${escapeHtml(pricing.paymentTerms || 'ظƒط§ط´')}</div>
    </div>
    <section class="report-section quotation-summary">
      <h3>ظ…ظ„ط®طµ ط§ظ„ط¹ط±ط¶</h3>
      <div class="quotation-kpis">
        <div><span>ط³ط¹ط± ط§ظ„ظƒظٹظ„ظˆ</span><strong>${money(pricing.sellPrice)} ط¬ظ†ظٹظ‡</strong></div>
        <div class="quotation-total"><span>ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط¹ظ‚ط¯</span><strong>${money(pricing.totalOffer)} ط¬ظ†ظٹظ‡</strong></div>
      </div>
    </section>
    <section class="report-section">
      <h3>ط¨ظ†ظˆط¯ ط§ظ„ط¹ط±ط¶</h3>
      <table><thead><tr><th>ط§ظ„طµظ†ظپ</th><th>ط¯ط±ط¬ط© ط§ظ„ظ„ظˆظ†</th><th>ط§ظ„ظƒظ…ظٹط©</th><th>ط§ظ„ط¨ظˆطµط©</th><th>ط³ط¹ط± ط§ظ„ظƒظٹظ„ظˆ</th><th>ط§ظ„ط¥ط¬ظ…ط§ظ„ظٹ</th></tr></thead><tbody>
        <tr><td>${escapeHtml(pricing.fabricType || '-')}</td><td>${escapeHtml(pricing.colorClass || '-')}</td><td>${money(pricing.quantity)} ظƒط¬ظ…</td><td>${escapeHtml(pricing.inchWidth || '-')}</td><td>${money(pricing.sellPrice)} ط¬ظ†ظٹظ‡</td><td>${money(pricing.totalOffer)} ط¬ظ†ظٹظ‡</td></tr>
      </tbody></table>
    </section>
    <section class="report-section"><h3>ظ…ظ„ط§ط­ط¸ط§طھ</h3><p>${escapeHtml(notes || 'ظ„ط§ طھظˆط¬ط¯ ظ…ظ„ط§ط­ط¸ط§طھ ط¥ط¶ط§ظپظٹط©.')}</p></section>
    ${documentFooter()}
  </div>`;
  refs.documentDialog.showModal();
}
function allOrders() { return orders.map(calculateOrder); }
function isMainWarehouseStockOrder(order) {
  return String(order?.notes || '').includes(MAIN_WAREHOUSE_STOCK_MARKER)
    || String(order?.orderNumber || '').startsWith(MAIN_WAREHOUSE_PREFIX);
}
function nextMainWarehouseOrderNumber() {
  const maxNumber = Math.max(
    10000,
    ...orders
      .filter(isMainWarehouseStockOrder)
      .map((order)=>numericPart(order.orderNumber))
      .filter(Boolean)
  );
  return `${MAIN_WAREHOUSE_PREFIX}${maxNumber + 1}`;
}
function mainWarehouseStockOrders() {
  return allOrders()
    .filter(isMainWarehouseStockOrder)
    .sort((a, b)=>String(b.orderDate || '').localeCompare(String(a.orderDate || '')) || String(a.fabricType || '').localeCompare(String(b.fabricType || ''), 'ar'));
}
function mainWarehouseStockRows() {
  return mainWarehouseStockOrders()
    .flatMap((order)=>(order.allocations || []).map((allocation)=>{
      const warehouseOut = Number(allocation.warehouseOut ?? allocation.deliveredToCustomer ?? 0);
      const balance = roundNumber(
        Number(allocation.finishedReceived || 0)
        - warehouseOut
        - Number(allocation.sentToGluing || 0)
        + Number(allocation.returnedFromGluing || 0)
      );
      return { order, allocation, balance };
    }))
    .filter((item)=>Math.abs(Number(item.balance || 0)) > 0.001)
    .sort((a, b)=>String(a.order.fabricType || '').localeCompare(String(b.order.fabricType || ''), 'ar') || Number(b.balance || 0) - Number(a.balance || 0));
}
function renderMainWarehouseRows() {
  const rows = mainWarehouseStockRows();
  if (!rows.length) return '<tr><td colspan="7">ظ„ط§ طھظˆط¬ط¯ ط£طµظ†ط§ظپ ظ…ط³ط¬ظ„ط© ظ…ط¨ط§ط´ط±ط© ظپظٹ ط§ظ„ظ…ط®ط²ظ† ط§ظ„ط±ط¦ظٹط³ظٹ ط­طھظ‰ ط§ظ„ط¢ظ†.</td></tr>';
  return rows.map(({ order, allocation, balance })=>`
    <tr>
      <td>${escapeHtml(order.orderNumber || '-')}</td>
      <td>${escapeHtml(order.fabricType || '-')}</td>
      <td>${escapeHtml(allocation.color || '-')}</td>
      <td>${escapeHtml(allocation.targetFinishedWidth || allocation.rawWidth || order.inchWidth || '-')}</td>
      <td>${formatNumber(allocation.finishedReceived || 0)}</td>
      <td>${formatNumber(allocation.warehouseOut ?? allocation.deliveredToCustomer ?? 0)}</td>
      <td><strong>${formatNumber(balance)}</strong></td>
    </tr>`).join('');
}
function finishedStockSaleSources() {
  return allOrders()
    .flatMap((order)=>(order.allocations || []).map((allocation)=>{
      const warehouseOut = Number(allocation.warehouseOut ?? allocation.deliveredToCustomer ?? 0);
      const balance = roundNumber(
        Number(allocation.finishedReceived || 0)
        - warehouseOut
        - Number(allocation.sentToGluing || 0)
        + Number(allocation.returnedFromGluing || 0)
      );
      return { order, allocation, balance };
    }))
    .filter((item)=>Math.abs(Number(item.balance || 0)) > 0.001)
    .sort((a, b)=>String(a.order.fabricType || '').localeCompare(String(b.order.fabricType || ''), 'ar') || Number(b.balance || 0) - Number(a.balance || 0));
}
function finishedStockSaleFabricOptions() {
  const fabrics = uniqueNonEmpty(finishedStockSaleSources().map((item)=>item.order.fabricType));
  return fabrics.map((fabric)=>`<option value="${escapeHtml(fabric)}">${escapeHtml(fabric)}</option>`).join('');
}
function finishedTransferTargetOptions(selectedFabric = '') {
  return allOrders()
    .filter((order)=>!isMainWarehouseStockOrder(order))
    .flatMap((order)=>(order.allocations || []).map((allocation)=>{
      const key = `${order.id}|${allocation.id}`;
      if (selectedFabric && !finishedSaleFabricMatches(order.fabricType, selectedFabric)) return '';
      const label = [
        order.orderNumber || '-',
        order.customer || '-',
        order.fabricType || '-',
        allocation.color || '-',
        allocation.targetFinishedWidth || allocation.rawWidth || order.inchWidth || '',
      ].filter(Boolean).join(' / ');
      return `<option value="${escapeHtml(key)}">${escapeHtml(label)}</option>`;
    }).filter(Boolean))
    .join('');
}
function selectedFinishedSaleFabric() {
  return document.getElementById('finishedSaleFabric')?.value || '';
}
function finishedSaleFabricMatches(sourceFabric, selectedFabric) {
  const source = cleanFabricDisplayName(sourceFabric);
  const selected = cleanFabricDisplayName(selectedFabric);
  if (!selected) return true;
  if (source === selected) return true;
  const sourceKey = normalizeFabricMasterName(source);
  const selectedKey = normalizeFabricMasterName(selected);
  return !!sourceKey && sourceKey === selectedKey;
}
function renderFinishedSaleRows() {
  const body = document.getElementById('finishedSaleRows');
  if (!body) return;
  const fabric = selectedFinishedSaleFabric();
  const rows = finishedStockSaleSources()
    .filter((item)=>finishedSaleFabricMatches(item.order.fabricType, fabric))
    .map(({ order, allocation, balance })=>`
      <tr data-finished-sale-row data-allocation-id="${escapeHtml(allocation.id)}" data-order-id="${escapeHtml(order.id)}" data-available="${escapeHtml(balance)}">
        <td>${escapeHtml(order.orderNumber || '-')}</td>
        <td>${escapeHtml(order.customer || '-')}</td>
        <td>${escapeHtml(order.fabricType || '-')}</td>
        <td>${escapeHtml(allocation.color || '-')}</td>
        <td>${escapeHtml(allocation.targetFinishedWidth || allocation.rawWidth || order.inchWidth || '-')}</td>
        <td><strong>${formatNumber(balance)}</strong></td>
        <td><input type="number" step="0.01" min="0" data-finished-sale-quantity placeholder="0"></td>
      </tr>`)
    .join('');
  body.innerHTML = rows || '<tr><td colspan="7">ظ„ط§ ظٹظˆط¬ط¯ ط±طµظٹط¯ ظ…ط®ط²ظ† ظ…طھط§ط­ ظ„ظ„ط¨ظٹط¹ ط§ظ„ط¬ط§ظ‡ط².</td></tr>';
}
function renderFinishedTransferTargets() {
  const select = document.querySelector('#finishedTransferForm select[name="targetKey"]');
  if (!select) return;
  const currentValue = select.value;
  const fabric = selectedFinishedSaleFabric();
  select.innerHTML = `<option value="">ط§ط®طھط± ط§ظ„ط·ظ„ط¨ / ط§ظ„ظ„ظˆظ† ط§ظ„ظ…ط³طھظ„ظ… ظ„ظ„طھط­ظˆظٹظ„</option>${finishedTransferTargetOptions(fabric)}`;
  if (currentValue && [...select.options].some((option)=>option.value === currentValue)) select.value = currentValue;
}
function renderFinishedSalePanel() {
  const panel = document.getElementById('finishedSalePanel');
  if (!panel) return;
  const currentFabric = selectedFinishedSaleFabric();
  const sources = finishedStockSaleSources();
  const total = sources.reduce((sumValue, item)=>sumValue + Number(item.balance || 0), 0);
  panel.innerHTML = `
    <div class="section-head stacked-on-mobile">
      <div><p class="eyebrow">ط§ظ„ظ…ط®ط²ظ† ظˆط§ظ„طھط³ظ„ظٹظ…</p><h2>ط¨ظٹط¹ ظ…ط¬ظ‡ط²</h2><p class="muted">ط¨ظٹط¹ ظ…ظ† ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ† ط§ظ„ظپط¹ظ„ظٹ ط¨ط¯ظˆظ† ط¥ظ†ط´ط§ط، ط£ظ…ط± طھط´ط؛ظٹظ„ ط¬ط¯ظٹط¯.</p></div>
      <div class="metric compact"><span>ط±طµظٹط¯ ظ…طھط§ط­ ظ„ظ„ط¨ظٹط¹</span><strong>${formatNumber(total)}</strong></div>
    </div>
    <datalist id="customerNamesList">${knownCustomerNames().map((name)=>`<option value="${escapeHtml(name)}"></option>`).join('')}</datalist>
    <div class="subsection main-warehouse-entry">
      <div class="subsection-head">
        <div>
          <h3>ط§ظ„ظ…ط®ط²ظ† ط§ظ„ط±ط¦ظٹط³ظٹ</h3>
          <p class="muted">ط¥ط¶ط§ظپط© طµظ†ظپ ط¬ط§ظ‡ط² ظ…ط¨ط§ط´ط±ط© ظ„ظ„ظ…ط®ط²ظ† ط¨ط¯ظˆظ† ظƒط±طھ طھط³ط¹ظٹط± ط£ظˆ ط·ظ„ط¨ ط¹ظ…ظٹظ„. ط¨ط¹ط¯ ط§ظ„ط­ظپط¸ ظٹط¸ظ‡ط± ط§ظ„ط±طµظٹط¯ ظپظٹ ط¨ظٹط¹ ظ…ط¬ظ‡ط².</p>
        </div>
        <span class="status warehouse">ط±طµظٹط¯ ط¯ط§ط®ظ„ظٹ</span>
      </div>
      <form id="mainWarehouseStockForm" class="batch-form finished-sale-form">
        <input name="fabricType" list="fabricNamesList" placeholder="ط§ظ„طµظ†ظپ" required>
        <input name="color" placeholder="ط§ظ„ظ„ظˆظ†" required>
        <input name="quantity" type="number" step="0.01" min="0" placeholder="ظƒظ…ظٹط© ط§ظ„ظ…ط®ط²ظ†" required>
        <input name="finishedWeight" type="number" step="0.01" min="0" placeholder="ط§ظ„ظˆط²ظ† ظ…ط¬ظ‡ط²">
        <input name="width" placeholder="ط§ظ„ط¹ط±ط¶">
        <input name="inch" placeholder="ط§ظ„ط¨ظˆطµط©">
        <input name="unitPrice" type="number" step="0.01" min="0" placeholder="ط³ط¹ط± ط§ظ„ظƒظٹظ„ظˆ">
        <input name="date" type="date" value="${new Date().toISOString().slice(0, 10)}" required>
        <input name="noteNumber" placeholder="ط±ظ‚ظ… ط¥ط°ظ† / ظ…ط±ط¬ط¹">
        <input class="full" name="notes" placeholder="ظ…ظ„ط§ط­ط¸ط§طھ">
        <button class="mini-btn full" type="submit">ط¥ط¶ط§ظپط© ط±طµظٹط¯ ظ„ظ„ظ…ط®ط²ظ† ط§ظ„ط±ط¦ظٹط³ظٹ</button>
      </form>
      <div class="table-wrap">
        <table class="mobile-card-table allocation-table">
          <thead><tr><th>ط±ظ‚ظ… ط§ظ„ظ…طµط¯ط±</th><th>ط§ظ„طµظ†ظپ</th><th>ط§ظ„ظ„ظˆظ†</th><th>ط§ظ„ط¹ط±ط¶</th><th>ط¯ط®ظ„ ط§ظ„ظ…ط®ط²ظ†</th><th>ظ…ط¨ط§ط¹</th><th>ط§ظ„ط±طµظٹط¯</th></tr></thead>
          <tbody>${renderMainWarehouseRows()}</tbody>
        </table>
      </div>
    </div>
    <form id="finishedSaleForm" class="batch-form finished-sale-form">
      <input name="customerName" list="customerNamesList" placeholder="ط§ظ„ط¹ظ…ظٹظ„ ط§ظ„ظ…ط³طھظ„ظ…" required>
      <select id="finishedSaleFabric" name="fabricType" required>
        <option value="">ط§ط®طھط± ط§ظ„طµظ†ظپ ظ…ظ† ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ†</option>
        ${finishedStockSaleFabricOptions()}
      </select>
      <input name="date" type="date" value="${new Date().toISOString().slice(0, 10)}" required>
      <input name="unitPrice" type="number" step="0.01" min="0" placeholder="ط³ط¹ط± ط§ظ„ظƒظٹظ„ظˆ" required>
      <input name="paymentTerms" placeholder="ط·ط±ظٹظ‚ط© ط§ظ„ط³ط¯ط§ط¯ / ط´ط±ظˆط· ط§ظ„ط¨ظٹط¹">
      <input name="noteNumber" placeholder="ط±ظ‚ظ… ظ…ط³طھظ†ط¯ ط§ظ„ط¨ظٹط¹">
      <input class="full" name="notes" placeholder="ظ…ظ„ط§ط­ط¸ط§طھ">
      <div class="table-wrap full">
        <table class="mobile-card-table allocation-table finished-sale-table">
          <thead><tr><th>ط±ظ‚ظ… ط§ظ„ظ…طµط¯ط±</th><th>ظ…طµط¯ط± ط§ظ„ط±طµظٹط¯</th><th>ط§ظ„طµظ†ظپ</th><th>ط§ظ„ظ„ظˆظ†</th><th>ط§ظ„ط¹ط±ط¶</th><th>ط§ظ„ظ…طھط§ط­</th><th>ظƒظ…ظٹط© ط§ظ„ط¨ظٹط¹</th></tr></thead>
          <tbody id="finishedSaleRows"></tbody>
        </table>
      </div>
      <button class="primary-btn full" type="submit">ط­ظپط¸ ط¨ظٹط¹ ظ…ط¬ظ‡ط²</button>
    </form>
    <form id="finishedTransferForm" class="batch-form finished-sale-form">
      <div class="full">
        <h3>طھط­ظˆظٹظ„ ط±طµظٹط¯ ظ…ط¬ظ‡ط² ظ…ظ† ط·ظ„ط¨ ظ„ط·ظ„ط¨</h3>
        <p class="muted">ط­ط±ظƒط© ط¯ط§ط®ظ„ظٹط© طھظ†ظ‚ظ„ ط±طµظٹط¯ ظ…ط®ط²ظ† ظپط¹ظ„ظٹ ظ…ظ† ط§ظ„ط·ظ„ط¨ ط§ظ„ظ…طµط¯ط± ط¥ظ„ظ‰ ط·ظ„ط¨ ط¢ط®ط± ط¨ط¯ظˆظ† طھط³ط¬ظٹظ„ ط¨ظٹط¹ ط£ظˆ ظپط§طھظˆط±ط© ط¹ظ…ظٹظ„.</p>
      </div>
      <select name="targetKey" required>
        <option value="">ط§ط®طھط± ط§ظ„ط·ظ„ط¨ / ط§ظ„ظ„ظˆظ† ط§ظ„ظ…ط³طھظ„ظ… ظ„ظ„طھط­ظˆظٹظ„</option>
        ${finishedTransferTargetOptions(currentFabric)}
      </select>
      <input name="date" type="date" value="${new Date().toISOString().slice(0, 10)}" required>
      <input name="noteNumber" placeholder="ط±ظ‚ظ… ط¥ط°ظ† ط§ظ„طھط­ظˆظٹظ„">
      <input class="full" name="notes" placeholder="ظ…ظ„ط§ط­ط¸ط§طھ ط§ظ„طھط­ظˆظٹظ„">
      <p class="muted full">ط§ظƒطھط¨ ظƒظ…ظٹط© ط§ظ„طھط­ظˆظٹظ„ ظپظٹ ط¬ط¯ظˆظ„ ط§ظ„ط±طµظٹط¯ ط¨ط§ظ„ط£ط¹ظ„ظ‰طŒ ط«ظ… ط§ط¶ط؛ط· ط­ظپط¸ ط§ظ„طھط­ظˆظٹظ„. ظ†ظپط³ ط§ظ„ط¬ط¯ظˆظ„ ظٹط³طھط®ط¯ظ… ظ„ط§ط®طھظٹط§ط± ط§ظ„ط±طµظٹط¯ ط§ظ„ظ…طµط¯ط±.</p>
      <button class="mini-btn full" type="submit">ط­ظپط¸ طھط­ظˆظٹظ„ ط±طµظٹط¯ ظ…ط¬ظ‡ط²</button>
    </form>
    <div class="subsection">
      <div class="subsection-head"><h3>ط¢ط®ط± ط­ط±ظƒط§طھ ط§ظ„ظ…ط®ط²ظ†</h3></div>
      <div class="table-wrap">
        <table class="mobile-card-table allocation-table">
          <thead><tr><th>ط§ظ„طھط§ط±ظٹط®</th><th>ط§ظ„ط­ط±ظƒط©</th><th>ط§ظ„ط·ط±ظپ</th><th>ط§ظ„ظ…طµط¯ط±</th><th>ط§ظ„طµظ†ظپ</th><th>ط§ظ„ظƒظ…ظٹط©</th><th>ط§ظ„ظ‚ظٹظ…ط©</th></tr></thead>
          <tbody>${finishedStockSaleHistoryRows()}</tbody>
        </table>
      </div>
    </div>`;
  const select = document.getElementById('finishedSaleFabric');
  if (select && currentFabric && [...select.options].some((option)=>option.value === currentFabric)) select.value = currentFabric;
  renderFinishedSaleRows();
  renderFinishedTransferTargets();
}
function finishedStockSaleHistoryRows() {
  const stockOutRows = customerBatches
    .filter((batch)=>isFinishedStockSale(batch) || isFinishedStockTransferOut(batch))
    .map((batch)=>({ ...batch, __historyType:isFinishedStockSale(batch) ? 'sale' : 'transfer-out' }));
  const stockInRows = productionBatches
    .filter((batch)=>String(batch.notes || '').includes(FINISHED_TRANSFER_MARKER))
    .map((batch)=>({ ...batch, __historyType:'transfer-in' }));
  return stockOutRows
    .concat(stockInRows)
    .sort((a, b)=>String(b.date || '').localeCompare(String(a.date || '')))
    .slice(0, 12)
    .map((batch)=>{
      const order = orders.find((item)=>item.id === batch.orderId) || {};
      const allocation = allocations.find((item)=>item.id === batch.allocationId) || {};
      const typeLabel = batch.__historyType === 'sale' ? 'ط¨ظٹط¹ ظ…ط¬ظ‡ط²' : (batch.__historyType === 'transfer-in' ? 'طھط­ظˆظٹظ„ ظˆط§ط±ط¯' : 'طھط­ظˆظٹظ„ طµط§ط¯ط±');
      const party = batch.__historyType === 'sale'
        ? (batch.customerName || '-')
        : ((batch.notes || '').split(' - ').find((part)=>part.includes('طھط­ظˆظٹظ„')) || '-');
      const amount = batch.__historyType === 'sale'
        ? formatNumber(batch.totalPrice || Number(batch.quantity || 0) * Number(batch.unitPrice || 0))
        : '-';
      return `<tr><td>${escapeHtml(batch.date || '-')}</td><td>${escapeHtml(typeLabel)}</td><td>${escapeHtml(party)}</td><td>${escapeHtml(order.orderNumber || '-')}</td><td>${escapeHtml([order.fabricType, allocation.color].filter(Boolean).join(' / ') || '-')}</td><td>${formatNumber(batch.quantity || 0)}</td><td>${amount}</td></tr>`;
    })
    .join('') || '<tr><td colspan="7">ظ„ط§ طھظˆط¬ط¯ ط­ط±ظƒط§طھ ظ…ط®ط²ظ† ظ…ط³ط¬ظ„ط©.</td></tr>';
}
function openFinishedSalePanel() {
  openMainWorkspace();
  closeDashboardFocusMode();
  closeAiFocusMode();
  closeOrderFocusMode();
  setWorkspaceModule('warehouse');
  renderFinishedSalePanel();
  document.getElementById('finishedSalePanel')?.scrollIntoView({ behavior:'smooth', block:'start' });
}
function applyModuleVisibilityToPanel(panel) {
  if (!panel) return;
  const activeModule = document.body.dataset.activeModule || 'dashboard';
  const modules = String(panel.dataset.modulePanel || '').split(/\s+/).filter(Boolean);
  panel.classList.toggle('module-hidden', modules.length > 0 && !modules.includes(activeModule));
}
function ensureFinishedSaleUi() {
  if (!document.getElementById('finishedSalePanel')) {
    const ordersPanel = document.querySelector('.orders-list-panel');
    ordersPanel?.insertAdjacentHTML('beforebegin', '<section class="panel finished-sale-panel module-hidden" id="finishedSalePanel" data-module-panel="warehouse"></section>');
  }
  applyModuleVisibilityToPanel(document.getElementById('finishedSalePanel'));
  const warehouseStageButton = document.querySelector('[data-stage-shortcut="stage:warehouse"]');
  const warehouseSection = warehouseStageButton?.closest('section');
  if (warehouseSection && !warehouseSection.querySelector('[data-nav-action="finishedSale"]')) {
    warehouseStageButton.insertAdjacentHTML('afterend', '<button type="button" data-module-action="warehouse" data-nav-action="finishedSale">ط¨ظٹط¹ ظ…ط¬ظ‡ط²</button>');
  }
  const topOperationMenu = [...document.querySelectorAll('.erp-menu-list')]
    .find((menu)=>menu.querySelector('[data-nav-action="orderDetails"]') && menu.querySelector('[data-nav-action="gluingQueue"]'));
  if (topOperationMenu && !topOperationMenu.querySelector('[data-nav-action="finishedSale"]')) {
    topOperationMenu.querySelector('[data-nav-action="orderDetails"]')?.insertAdjacentHTML('afterend', '<button type="button" data-nav-action="finishedSale">ط¨ظٹط¹ ظ…ط¬ظ‡ط²</button>');
  }
}
async function saveFinishedStockSale(event) {
  event.preventDefault();
  if (!(await ensureBackendForWrite('طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط¨ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط­ظپط¸ ط¨ظٹط¹ ظ…ط¬ظ‡ط².'))) return;
  const form = event.target.closest('#finishedSaleForm');
  if (!form) return;
  const data = Object.fromEntries(new FormData(form).entries());
  const customerName = canonicalCustomerName(data.customerName);
  const unitPrice = Number(data.unitPrice || 0);
  const rows = [...form.querySelectorAll('[data-finished-sale-row]')]
    .map((row)=>{
      const quantity = Number(row.querySelector('[data-finished-sale-quantity]')?.value || 0);
      return {
        row,
        orderId: row.dataset.orderId,
        allocationId: row.dataset.allocationId,
        available: Number(row.dataset.available || 0),
        quantity,
      };
    })
    .filter((item)=>item.quantity > 0);
  if (!customerName) { alert('ط§ظƒطھط¨ ط§ط³ظ… ط§ظ„ط¹ظ…ظٹظ„ ط§ظ„ظ…ط³طھظ„ظ….'); return; }
  if (!rows.length) { alert('ط§ظƒطھط¨ ظƒظ…ظٹط© ط¨ظٹط¹ ظˆط§ط­ط¯ط© ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„.'); return; }
  await ensureBackendCustomer(customerName);
  for (const item of rows) {
    const totalPrice = roundNumber(item.quantity * unitPrice);
    const balanceWarning = item.quantity > item.available + 0.001
      ? `طھظ†ط¨ظٹظ‡: ظƒظ…ظٹط© ط§ظ„ط¨ظٹط¹ ${formatNumber(item.quantity)} ط£ظƒط¨ط± ظ…ظ† ط±طµظٹط¯ ط§ظ„طµظ†ظپ ط§ظ„ظ…طھط§ط­ ${formatNumber(item.available)} ظƒط¬ظ…`
      : '';
    const saved = await postBackend('/batches/customer', batchToApi({
      id: uid(),
      orderId: item.orderId,
      allocationId: item.allocationId,
      date: data.date,
      quantity: item.quantity,
      customerName,
      unitPrice,
      totalPrice,
      paymentTerms: data.paymentTerms || '',
      noteNumber: data.noteNumber || '',
      movement: 'finished_sale',
      notes: ['ط¨ظٹط¹ ظ…ط¬ظ‡ط²', balanceWarning, data.notes || ''].filter(Boolean).join(' - '),
    }));
    if (!saved) {
      await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط¨ظٹط¹ ظ…ط¬ظ‡ط² ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ط­ط±ظƒط©.');
      return;
    }
  }
  recordAudit('create', 'finishedStockSale', customerName, null, { rows: rows.length, customerName }, 'طھط³ط¬ظٹظ„ ط¨ظٹط¹ ظ…ط¬ظ‡ط² ظ…ظ† ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ†');
  await saveBackendSetting('auditLog', auditLog);
  await loadBackendData();
  renderFinishedSalePanel();
  alert('طھظ… ط­ظپط¸ ط¨ظٹط¹ ظ…ط¬ظ‡ط² ظˆط®طµظ… ط§ظ„ظƒظ…ظٹط© ظ…ظ† ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ†.');
}
async function saveFinishedStockTransfer(event) {
  event.preventDefault();
  if (!(await ensureBackendForWrite('طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط¨ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط­ظپط¸ طھط­ظˆظٹظ„ ط§ظ„ط±طµظٹط¯ ط§ظ„ظ…ط¬ظ‡ط².'))) return;
  const form = event.target.closest('#finishedTransferForm');
  if (!form) return;
  const data = Object.fromEntries(new FormData(form).entries());
  const [targetOrderId, targetAllocationId] = String(data.targetKey || '').split('|');
  const targetOrder = orders.find((order)=>order.id === targetOrderId);
  const targetAllocation = allocations.find((allocation)=>allocation.id === targetAllocationId);
  if (!targetOrder || !targetAllocation) { alert('ط§ط®طھط± ط§ظ„ط·ظ„ط¨ / ط§ظ„ظ„ظˆظ† ط§ظ„ظ…ط³طھظ„ظ… ظ„ظ„طھط­ظˆظٹظ„.'); return; }
  const rows = [...document.querySelectorAll('#finishedSaleRows [data-finished-sale-row]')]
    .map((row)=>{
      const quantity = roundNumber(Number(row.querySelector('[data-finished-sale-quantity]')?.value || 0));
      return {
        orderId: row.dataset.orderId,
        allocationId: row.dataset.allocationId,
        available: Number(row.dataset.available || 0),
        quantity,
      };
    })
    .filter((item)=>item.quantity > 0);
  if (!rows.length) { alert('ط§ظƒطھط¨ ظƒظ…ظٹط© طھط­ظˆظٹظ„ ظˆط§ط­ط¯ط© ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„ ظپظٹ ط¬ط¯ظˆظ„ ط§ظ„ط±طµظٹط¯.'); return; }
  const date = data.date || new Date().toISOString().slice(0, 10);
  const noteNumber = data.noteNumber || '';
  const transferId = uid();
  for (const item of rows) {
    if (item.orderId === targetOrderId && item.allocationId === targetAllocationId) {
      alert('ظ„ط§ ظٹظ…ظƒظ† طھط­ظˆظٹظ„ ط§ظ„ط±طµظٹط¯ ط¥ظ„ظ‰ ظ†ظپط³ ط§ظ„ط·ظ„ط¨ / ط§ظ„ظ„ظˆظ† ط§ظ„ظ…طµط¯ط±.');
      return;
    }
    const sourceOrder = orders.find((order)=>order.id === item.orderId) || {};
    const sourceAllocation = allocations.find((allocation)=>allocation.id === item.allocationId) || {};
    const warning = item.quantity > item.available + 0.001
      ? `طھظ†ط¨ظٹظ‡: ظƒظ…ظٹط© ط§ظ„طھط­ظˆظٹظ„ ${formatNumber(item.quantity)} ط£ظƒط¨ط± ظ…ظ† ط§ظ„ط±طµظٹط¯ ط§ظ„ظ…طھط§ط­ ${formatNumber(item.available)} ظƒط¬ظ…`
      : '';
    const sourceLabel = `${sourceOrder.orderNumber || '-'} / ${sourceOrder.customer || '-'} / ${sourceOrder.fabricType || '-'} / ${sourceAllocation.color || '-'}`;
    const targetLabel = `${targetOrder.orderNumber || '-'} / ${targetOrder.customer || '-'} / ${targetOrder.fabricType || '-'} / ${targetAllocation.color || '-'}`;
    const outSaved = await postBackend('/batches/customer', batchToApi({
      id: uid(),
      orderId: item.orderId,
      allocationId: item.allocationId,
      date,
      quantity: item.quantity,
      customerName: targetOrder.customer || '',
      unitPrice: 0,
      totalPrice: 0,
      paymentTerms: '',
      noteNumber,
      movement: 'finished_transfer_out',
      notes: [FINISHED_TRANSFER_MARKER, `طھط­ظˆظٹظ„ ط±طµظٹط¯ ظ…ط¬ظ‡ط² ط¥ظ„ظ‰ ${targetLabel}`, `ظ…ط±ط¬ط¹ ${transferId}`, warning, data.notes || ''].filter(Boolean).join(' - '),
    }));
    if (!outSaved) {
      await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط®ط±ظˆط¬ طھط­ظˆظٹظ„ ط§ظ„ط±طµظٹط¯ ط§ظ„ظ…ط¬ظ‡ط² ظ…ظ† ط§ظ„ط·ظ„ط¨ ط§ظ„ظ…طµط¯ط±. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„طھط­ظˆظٹظ„.');
      return;
    }
    const inSaved = await postBackend('/batches/finished', batchToApi({
      id: uid(),
      orderId: targetOrderId,
      allocationId: targetAllocationId,
      date,
      quantity: item.quantity,
      noteNumber,
      finishedWidth: targetAllocation.targetFinishedWidth || targetAllocation.rawWidth || '',
      finishedWeight: targetAllocation.targetFinishedWeight || '',
      notes: [FINISHED_TRANSFER_MARKER, `طھط­ظˆظٹظ„ ط±طµظٹط¯ ظ…ط¬ظ‡ط² ظ…ظ† ${sourceLabel}`, `ظ…ط±ط¬ط¹ ${transferId}`, data.notes || ''].filter(Boolean).join(' - '),
    }));
    if (!inSaved) {
      await rollbackAfterBackendWriteFailure('طھظ… ط­ظپط¸ ط®ط±ظˆط¬ ط§ظ„طھط­ظˆظٹظ„ ظ…ظ† ط§ظ„ظ…طµط¯ط± ظ„ظƒظ† طھط¹ط°ط± ط­ظپط¸ ط¯ط®ظˆظ„ظ‡ ط¹ظ„ظ‰ ط§ظ„ط·ظ„ط¨ ط§ظ„ظ‡ط¯ظپ. ط±ط§ط¬ط¹ ط§ظ„ط­ط±ظƒط§طھ ظ‚ط¨ظ„ ط§ظ„ظ…طھط§ط¨ط¹ط©.');
      return;
    }
  }
  recordAudit('create', 'finishedStockTransfer', targetOrder.orderNumber || targetOrderId, null, { rows: rows.length, targetOrder: targetOrder.orderNumber, transferId }, 'طھط­ظˆظٹظ„ ط±طµظٹط¯ ظ…ط¬ظ‡ط² ظ…ظ† ط·ظ„ط¨ ظ„ط·ظ„ط¨');
  await saveBackendSetting('auditLog', auditLog);
  await loadBackendData();
  renderFinishedSalePanel();
  alert('طھظ… ط­ظپط¸ طھط­ظˆظٹظ„ ط§ظ„ط±طµظٹط¯ ط§ظ„ظ…ط¬ظ‡ط² ط¨ظٹظ† ط§ظ„ط·ظ„ط¨ط§طھ.');
}
async function saveMainWarehouseStock(event) {
  event.preventDefault();
  if (!(await ensureBackendForWrite('طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط¨ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط­ظپط¸ ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ† ط§ظ„ط±ط¦ظٹط³ظٹ.'))) return;
  const form = event.target.closest('#mainWarehouseStockForm');
  if (!form) return;
  const data = Object.fromEntries(new FormData(form).entries());
  const fabricType = canonicalFabricName(data.fabricType);
  const color = String(data.color || '').trim();
  const quantity = roundNumber(Number(data.quantity || 0));
  const finishedWeight = data.finishedWeight ? roundNumber(Number(data.finishedWeight || 0)) : quantity;
  const unitPrice = roundNumber(Number(data.unitPrice || 0));
  if (!fabricType) { alert('ط§ظƒطھط¨ ط§ط³ظ… ط§ظ„طµظ†ظپ ظ‚ط¨ظ„ ط­ظپط¸ ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ†.'); return; }
  if (!color) { alert('ط§ظƒطھط¨ ط§ظ„ظ„ظˆظ† ظ‚ط¨ظ„ ط­ظپط¸ ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ†.'); return; }
  if (!(quantity > 0)) { alert('ط§ظƒطھط¨ ظƒظ…ظٹط© ظ…ط®ط²ظ† ط£ظƒط¨ط± ظ…ظ† طµظپط±.'); return; }
  const orderId = uid();
  const allocationId = uid();
  const orderNumber = nextMainWarehouseOrderNumber();
  const date = data.date || new Date().toISOString().slice(0, 10);
  const backendCustomer = await ensureBackendCustomer(MAIN_WAREHOUSE_CUSTOMER);
  const order = {
    id: orderId,
    orderNumber,
    productCode: buildItemCode(orderNumber),
    customer: MAIN_WAREHOUSE_CUSTOMER,
    orderDate: date,
    fabricType,
    totalRawQuantity: quantity,
    expectedWastePercent: 0,
    widthMode: 'single',
    inchWidth: data.inch || '',
    widthLines: [],
    kiloPrice: unitPrice,
    rawCost: unitPrice,
    paymentTerms: '',
    accessoryType: '',
    accessoryPercent: 0,
    accessoryLines: [],
    dyehouse: MAIN_WAREHOUSE_DYEHOUSE,
    weavingSource: MAIN_WAREHOUSE_DYEHOUSE,
    notes: [MAIN_WAREHOUSE_STOCK_MARKER, 'ط±طµظٹط¯ ظ…ط®ط²ظ† ط±ط¦ظٹط³ظٹ ظ…ط¨ط§ط´ط±', data.notes || ''].filter(Boolean).join(' - '),
    operationNotes: {},
    status: 'pending',
    operationClosed: false,
  };
  const allocation = {
    id: allocationId,
    orderId,
    color,
    pantoneCode: '',
    plannedQuantity: quantity,
    dyehouse: MAIN_WAREHOUSE_DYEHOUSE,
    widthLineId: '',
    rawInch: data.inch || '',
    rawWidth: data.width || '',
    targetFinishedWidth: data.width || '',
    targetFinishedWeight: finishedWeight,
    accessoryQuantityManual: null,
    notes: 'ط±طµظٹط¯ ظ…ط®ط²ظ† ط±ط¦ظٹط³ظٹ ظ…ط¨ط§ط´ط±',
  };
  const savedOrder = await postBackend('/orders', orderToApi(order, backendCustomer));
  if (!savedOrder) {
    await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط£ظ…ط± ط§ظ„ظ…ط®ط²ظ† ط§ظ„ط±ط¦ظٹط³ظٹ ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ط±طµظٹط¯.');
    return;
  }
  const savedAllocation = await postBackend(`/orders/${orderId}/allocations`, allocationToApi(allocation));
  if (!savedAllocation) {
    await rollbackAfterBackendWriteFailure('طھظ… ط­ظپط¸ ط£ظ…ط± ط§ظ„ظ…ط®ط²ظ†طŒ ظ„ظƒظ† طھط¹ط°ط± ط­ظپط¸ ط¨ظ†ط¯ ط§ظ„طµظ†ظپ/ط§ظ„ظ„ظˆظ†. ط±ط§ط¬ط¹ ط§ظ„ط±طµظٹط¯ ظ‚ط¨ظ„ ط§ظ„ظ…طھط§ط¨ط¹ط©.');
    return;
  }
  const savedFinished = await postBackend('/batches/finished', batchToApi({
    id: uid(),
    orderId,
    allocationId,
    date,
    quantity,
    noteNumber: data.noteNumber || '',
    notes: [MAIN_WAREHOUSE_STOCK_MARKER, 'ط¥ط¶ط§ظپط© ظ…ط¨ط§ط´ط±ط© ظ„ظ„ظ…ط®ط²ظ† ط§ظ„ط±ط¦ظٹط³ظٹ', data.notes || ''].filter(Boolean).join(' - '),
    finishedWidth: data.width || '',
    finishedWeight,
  }));
  if (!savedFinished) {
    await rollbackAfterBackendWriteFailure('طھظ… ط­ظپط¸ ط§ظ„طµظ†ظپطŒ ظ„ظƒظ† طھط¹ط°ط± ط­ظپط¸ ط­ط±ظƒط© ط¯ط®ظˆظ„ ط§ظ„ظ…ط®ط²ظ†. ط±ط§ط¬ط¹ ط§ظ„ط±طµظٹط¯ ظ‚ط¨ظ„ ط§ظ„ط¨ظٹط¹.');
    return;
  }
  recordAudit('create', 'mainWarehouseStock', orderNumber, null, { orderNumber, fabricType, color, quantity }, 'ط¥ط¶ط§ظپط© ط±طµظٹط¯ ظ…ط¨ط§ط´ط± ظ„ظ„ظ…ط®ط²ظ† ط§ظ„ط±ط¦ظٹط³ظٹ');
  await saveBackendSetting('auditLog', auditLog);
  await loadBackendData();
  renderFinishedSalePanel();
  alert('طھظ…طھ ط¥ط¶ط§ظپط© ط§ظ„طµظ†ظپ ط¥ظ„ظ‰ ط§ظ„ظ…ط®ط²ظ† ط§ظ„ط±ط¦ظٹط³ظٹ ظˆط£طµط¨ط­ ظ…طھط§ط­ظ‹ط§ ظپظٹ ط¨ظٹط¹ ظ…ط¬ظ‡ط².');
}
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
    `ط§ط°ظ† ${note}`,
    `ط¥ط°ظ† ${note}`,
    `ط§ط°ظ† ط±ظ‚ظ… ${note}`,
    `ط¥ط°ظ† ط±ظ‚ظ… ${note}`,
    `ط±ظ‚ظ… ط§ط°ظ† ${note}`,
    `ط±ظ‚ظ… ط¥ط°ظ† ${note}`,
  ]);
  return normalizeDigits([order.orderNumber, order.customer, order.dyehouse, order.weavingSource, order.fabricType, order.productCode, ...noteAliases].filter(Boolean).join(' ').toLowerCase());
}
function orderMatchesStageFilter(order, stageKey, stage = orderStageInfo(order)) {
  const warehouseBalance = Number(order.warehouseBalance || 0);
  const dyehouseBalance = Number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse || 0);
  const gluingBalance = Number(order.gluingBalance || 0);
  const gluedProductBalance = Number(order.gluedProductBalance || 0);
  if (stageKey === 'warehouse') return warehouseBalance !== 0;
  if (stageKey === 'dyehouse') return dyehouseBalance > 0;
  if (stageKey === 'weaving') return stage.key === 'weaving' || stage.key === 'color-planning';
  if (stageKey === 'gluing') return stage.key === 'gluing' || stage.key === 'glued-ready' || gluingBalance > 0 || gluedProductBalance > 0;
  return stage.key === stageKey;
}
function filteredOrders() {
  const query = normalizeDigits(refs.searchInput.value.trim().toLowerCase());
  const rawStatus = refs.orderStatusFilter.value;
  const legacyStageMap = {
    'stage:delivery': 'stage:warehouse',
    'stage:color-planning': 'stage:weaving',
    'stage:glued-ready': 'stage:gluing',
  };
  const status = legacyStageMap[rawStatus] || rawStatus;
  const customer = refs.customerFilter.value;
  const dyehouse = refs.dyehouseFilter.value;
  const fabric = refs.fabricFilter.value;
  const includeMainWarehouseStock = status === 'stage:warehouse' || !!query;
  return allOrders().filter((order) => {
    if (isMainWarehouseStockOrder(order) && !includeMainWarehouseStock) return false;
    const stage = orderStageInfo(order);
    const statusMatch = status.startsWith('stage:')
      ? orderMatchesStageFilter(order, status.slice('stage:'.length), stage)
      : (status === 'closed' ? order.status === 'closed' : (status === 'all' ? true : order.status === status));
    return orderSearchText(order).includes(query) && statusMatch && (customer === 'all' || order.customer === customer) && (dyehouse === 'all' || order.dyehouse === dyehouse) && (fabric === 'all' || order.fabricType === fabric);
  });
}
function fillSelectOptions(select, values, allLabel) {
  const current = select.value || 'all';
  select.innerHTML = `<option value="all">${allLabel}</option>${[...new Set(values.filter(Boolean))].sort().map((value)=>`<option value="${value}">${value}</option>`).join('')}`;
  if ([...select.options].some((option)=>option.value === current)) select.value = current;
}
function renderOrderFilters() {
  fillSelectOptions(refs.customerFilter, orders.map((order)=>order.customer), 'ظƒظ„ ط§ظ„ط¹ظ…ظ„ط§ط،');
  fillSelectOptions(refs.dyehouseFilter, orders.map((order)=>order.dyehouse), 'ظƒظ„ ط§ظ„ظ…طµط§ط¨ط؛');
  fillSelectOptions(refs.fabricFilter, knownFabricNames(), 'ظƒظ„ ط§ظ„ط£طµظ†ط§ظپ');
}
function renderStats(list) {
  const fmt = (value) => roundNumber(value).toLocaleString('en-US', { maximumFractionDigits: 3 });
  const insideDyehouse = list.reduce((t,o)=>t + Number(o.rawAtDyehouseAvailable || o.remainingAtDyehouse || 0), 0);
  const values = [
    ['ط¹ط¯ط¯ ط§ظ„ط·ظ„ط¨ط§طھ', list.length],
    ['ط®ط§ظ… ظ…ط·ظ„ظˆط¨', list.reduce((t,o)=>t+o.totalRawOrdered,0)],
    ['ط®ط±ط¬ ظ„ظ„ظ…طµط¨ط؛ط©', list.reduce((t,o)=>t+o.totalSentToDyehouse,0)],
    ['ط¯ط§ط®ظ„ ط§ظ„ظ…طµط¨ط؛ط©', insideDyehouse],
    ['ط¯ط®ظ„ ط§ظ„ظ…ط®ط²ظ†', list.reduce((t,o)=>t+o.totalFinishedReceived,0)],
    ['ط¬ط§ظ‡ط² ظ„ظ„طھط³ظ„ظٹظ…', list.reduce((t,o)=>t+o.warehouseBalance,0)],
    ['ظ…ط³ظ„ظ… ظ„ظ„ط¹ظ…ظٹظ„', list.reduce((t,o)=>t+o.totalDeliveredToCustomer,0)],
    ['ظ‡ط§ظ„ظƒ ظپط¹ظ„ظٹ', list.reduce((t,o)=>t+o.totalWaste,0)],
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
    { label:'ط§ظ„ظ†ط³ظٹط¬', filter:'stage:weaving', count:countWhere((order)=>orderMatchesStageFilter(order, 'weaving', stageOf(order))), qty:sum(source, (order)=>Math.max(Number(order.totalRawOrdered || 0) - Number(order.totalRawReceived || 0), 0)), sub:'ط®ط§ظ… ظ…ط·ظ„ظˆط¨ ظ„ظ… ظٹط®ط±ط¬ ط¨ط¹ط¯' },
    { label:'ط§ظ„ظ…طµط¨ط؛ط©', filter:'stage:dyehouse', count:countWhere((order)=>orderMatchesStageFilter(order, 'dyehouse', stageOf(order))), qty:sum(source, (order)=>Number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse || 0)), sub:'ط±طµظٹط¯ ظپط¹ظ„ظٹ ط¯ط§ط®ظ„ ط§ظ„ظ…طµط¨ط؛ط©' },
    { label:'ط§ظ„ظ…ط®ط²ظ† / ط¬ط§ظ‡ط² ظ„ظ„طھط³ظ„ظٹظ…', filter:'stage:warehouse', count:countWhere((order)=>orderMatchesStageFilter(order, 'warehouse', stageOf(order))), qty:sum(source, (order)=>order.warehouseBalance), sub:'ظ…ط¬ظ‡ط² ظ…ظˆط¬ظˆط¯ ظˆظ…طھط§ط­ ظ„ظ„طھط³ظ„ظٹظ…' },
  ];
  const cards = [
    ['ط·ظ„ط¨ط§طھ ظ…ظپطھظˆط­ط©', active.length, `${source.length} ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط·ظ„ط¨ط§طھ`],
    ['ط¯ط§ط®ظ„ ط§ظ„ظ…طµط¨ط؛ط©', fmt(sum(source, (order)=>Number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse || 0))), `${lanes[1].count} ط£ظˆط±ط¯ط±`],
    ['ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ† ط§ظ„ط¬ط§ظ‡ط²', fmt(sum(source, (order)=>order.warehouseBalance)), `${lanes[2].count} ط£ظˆط±ط¯ط±`],
    ['ط£ظˆظ„ظˆظٹط© ظ…طھط§ط¨ط¹ط©', lateOrders.length + wasteWatch.length, 'ظˆظ‚ظˆظپ ط·ظˆظٹظ„ ط£ظˆ ظ‡ط§ظ„ظƒ ظ…ط±طھظپط¹'],
  ];
  panel.innerHTML = `
    <div class="section-head stacked-on-mobile">
      <div><p class="eyebrow">ERP Command Center</p><h2>ط؛ط±ظپط© ط¹ظ…ظ„ظٹط§طھ ط§ظ„ظ…طµظ†ط¹</h2><p class="orders-list-note">ظ‚ط±ط§ط،ط© طھظ†ظپظٹط°ظٹط© ظ„ط­ط±ظƒط© ط§ظ„ظ‚ظ…ط§ط´ ظ…ظ† ط§ظ„ظ†ط³ظٹط¬ ط¥ظ„ظ‰ ط§ظ„ظ…طµط¨ط؛ط© ظˆط§ظ„ظ…ط®ط²ظ† ظˆط§ظ„طھط³ظ„ظٹظ…طŒ ظ…ط¨ظ†ظٹط© ط¹ظ„ظ‰ ظ†ظپط³ ط¨ظٹط§ظ†ط§طھ ط§ظ„طھط´ط؛ظٹظ„ ط§ظ„ط­ط§ظ„ظٹط©.</p></div>
      <div class="actions"><button class="mini-btn gold" type="button" data-nav-action="ordersList">ظپطھط­ ظƒظ„ ط§ظ„ط·ظ„ط¨ط§طھ</button><button class="mini-btn" type="button" data-nav-action="managementReports">ط§ظ„طھظ‚ط§ط±ظٹط±</button></div>
    </div>
    <div class="erp-cockpit-cards">${cards.map(([label, value, sub])=>`<article><span>${label}</span><strong>${value}</strong><small>${sub}</small></article>`).join('')}</div>
    <div class="erp-pipeline">${lanes.map((lane, index)=>`<button type="button" data-stage-shortcut="${lane.filter}"><span>${index + 1}</span><strong>${lane.label}</strong><em>${fmt(lane.qty)} ظƒط¬ظ…</em><small>${lane.count} ط£ظˆط±ط¯ط± - ${lane.sub}</small></button>`).join('')}</div>
    <div class="erp-priority-board">
      <div><h3>ط£ظˆظ„ظˆظٹط§طھ ط§ظ„ظ…طھط§ط¨ط¹ط©</h3><p class="eyebrow">ط§ظ„ط£ظ‚ط¯ظ… ظˆظ‚ظˆظپظ‹ط§ ط£ظˆ ط§ظ„ط£ط¹ظ„ظ‰ ظ‡ط§ظ„ظƒظ‹ط§ ظٹط¸ظ‡ط± ظ‡ظ†ط§ ط£ظˆظ„ظ‹ط§.</p></div>
      <div class="erp-priority-list">${priorityRows.length ? priorityRows.map((order)=>{
        const stage = stageOf(order);
        return `<button type="button" data-view="${escapeHtml(order.id)}"><strong>${escapeHtml(order.orderNumber || '-')} - ${escapeHtml(order.customer || '-')}</strong><span>${escapeHtml(order.fabricType || '-')}</span><small>${escapeHtml(operationStagePlace(order, stage))} / ${Number(stage.days || 0)} ظٹظˆظ… / ظ‡ط§ظ„ظƒ ${fmt(order.totalWastePercent || 0)}%</small></button>`;
      }).join('') : '<div class="empty-state">ظ„ط§ طھظˆط¬ط¯ ط£ظˆظ„ظˆظٹط§طھ ط­ط±ط¬ط© ط­ط§ظ„ظٹظ‹ط§.</div>'}</div>
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
  getCalculatedOrders: () => allOrders(),
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
  return `<select name="accessoryType" required><option value="">ط§ط®طھط± ظ†ظˆط¹ ط§ظ„ط¥ظƒط³ط³ظˆط§ط±</option>${options}</select>`;
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
function accessoryPlannedPartsForScopedQuantity(order, allocation, scopedQuantity) {
  const planned = Number(allocation?.plannedQuantity || 0);
  const quantity = Number(scopedQuantity || 0);
  const ratio = planned ? quantity / planned : 0;
  if (!ratio) return [];
  return (order?.accessoryLines || []).map((line) => {
    const baseQuantity = accessoryPlannedQuantityForLine(order, allocation, line);
    const scopedAccessory = roundNumber(Number(baseQuantity || 0) * ratio);
    return scopedAccessory ? `${formatNumber(scopedAccessory)} ${accessoryLineName(line, order)}` : '';
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
  const parts = [`ظ‚ظ…ط§ط´ ${formatNumber(order?.totalRawOrdered || order?.totalRawQuantity || 0)} ظƒط¬ظ…`];
  (order?.accessoryLines || []).forEach((line) => {
    const quantity = Number(line.quantity || line.quantityManual || 0);
    if (quantity) parts.push(`${accessoryLineName(line, order)} ${formatNumber(quantity)} ظƒط¬ظ…`);
  });
  return parts.map((part, index)=>`<span class="report-flow-line ${index ? 'report-flow-accessory' : 'report-flow-body'}">${escapeHtml(part)}</span>`).join('');
}
function accessoryDocumentSection(order, fmt, safe) {
  const lines = Array.isArray(order?.accessoryLines) ? order.accessoryLines : [];
  const hasAccessory = lines.length || Number(order?.accessoryRequired || 0) || Number(order?.accessorySent || 0) || Number(order?.accessoryReceived || 0) || Number(order?.accessoryDelivered || 0);
  if (!hasAccessory) return '';
  const rows = (lines.length ? lines : [{ type:'ط¥ظƒط³ط³ظˆط§ط±', percent:order?.accessoryPercent || 0, quantity:order?.accessoryRequired || 0 }])
    .map((line) => `<tr><td>${safe(line.type || 'ط¥ظƒط³ط³ظˆط§ط±')}</td><td>${formatNumber(Number(line.percent || 0))}%</td><td>${fmt(line.quantity || line.quantityManual || 0)}</td></tr>`).join('');
  const wasteText = order?.operationClosed ? `${fmt(order.accessoryWaste || 0)} (${formatNumber(order.accessoryWastePercent || 0, 1)}%)` : 'ظٹط¸ظ‡ط± ط¨ط¹ط¯ ط¥ط؛ظ„ط§ظ‚ ط§ظ„ط¯ظˆط±ط©';
  return `<section class="report-section"><h3>ظ…طھط§ط¨ط¹ط© ط§ظ„ط¥ظƒط³ط³ظˆط§ط±</h3><table class="summary-table"><tbody><tr><th>ط¥ظƒط³ط³ظˆط§ط± ظ…ط·ظ„ظˆط¨</th><td>${fmt(order.accessoryRequired || 0)}</td><th>ط¥ظƒط³ط³ظˆط§ط± ظ…ط±ط³ظ„</th><td>${fmt(order.accessorySent || 0)}</td></tr><tr><th>ط¥ظƒط³ط³ظˆط§ط± ظ…ط³طھظ„ظ…</th><td>${fmt(order.accessoryReceived || 0)}</td><th>ط¥ظƒط³ط³ظˆط§ط± ظ…ط³ظ„ظ… ظ„ظ„ط¹ظ…ظٹظ„</th><td>${fmt(order.accessoryDelivered || 0)}</td></tr><tr><th>ط±طµظٹط¯ ط§ظ„ط¥ظƒط³ط³ظˆط§ط±</th><td>${fmt(order.accessoryBalance || 0)}</td><th>ظ‡ط§ظ„ظƒ ط§ظ„ط¥ظƒط³ط³ظˆط§ط±</th><td>${wasteText}</td></tr></tbody></table><table class="summary-table"><thead><tr><th>ظ†ظˆط¹ ط§ظ„ط¥ظƒط³ط³ظˆط§ط±</th><th>ط§ظ„ظ†ط³ط¨ط©</th><th>ط§ظ„ظƒظ…ظٹط© ط§ظ„ظ…ط·ظ„ظˆط¨ط©</th></tr></thead><tbody>${rows}</tbody></table></section>`;
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
  const panel = refs.orderDetailsPanel;
  if (!panel) return;
  panel.querySelectorAll('form.batch-form').forEach((form) => {
    form.classList.remove('single-entry-form-hidden');
    form.removeAttribute('aria-hidden');
    form.querySelectorAll('[data-open-bulk-entry]').forEach((button)=>button.remove());
  });
  const batchGrid = panel.querySelector('.batch-grid.compact');
  if (!batchGrid || panel.querySelector('[data-combined-movement-panel]')) return;
  batchGrid.insertAdjacentHTML('beforebegin', `<section class="combined-movement-panel" data-combined-movement-panel>
    <div>
      <p class="eyebrow">ط£ظˆط§ظ…ط± ط§ظ„ط­ط±ظƒط© ط§ظ„ظ…ط¬ظ…ط¹ط©</p>
      <h3>ط§ظ„ظ‚ظ…ط§ط´ ظˆط§ظ„ط¥ظƒط³ط³ظˆط§ط± ظپظٹ ط¥ط°ظ† ظˆط§ط­ط¯</h3>
      <p class="eyebrow">ط§ظ„ظ†ظ…ط§ط°ط¬ ط§ظ„ظپط±ط¯ظٹط© ط£ط³ظپظ„ظ‡ط§ ظ…طھط§ط­ط© ظ„ظ„ظ…ط±طھط¬ط¹ط§طھ ط£ظˆ ط§ظ„ط­ط±ظƒط© ط§ظ„ط³ط±ظٹط¹ط©.</p>
    </div>
    <div class="combined-movement-actions">
      <button class="mini-btn gold" type="button" data-open-combined-movement="dyehouse">ط£ظ…ط± طµط±ظپ ظ„ظ„ظ…طµط¨ط؛ط©</button>
      <button class="mini-btn" type="button" data-open-combined-movement="finished">ط£ظ…ط± ط§ط³طھظ„ط§ظ… ظ…ظ† ط§ظ„ظ…طµط¨ط؛ط©</button>
      <button class="mini-btn" type="button" data-open-combined-movement="customer">ط£ظ…ط± طھط³ظ„ظٹظ… ظ„ظ„ط¹ظ…ظٹظ„</button>
    </div>
  </section>`);
}
function repairOrderDetailsArabic(order) {
  const root = refs.orderDetailsPanel;
  if (!root || !order) return;
  const isBadText = isLegacyRecoveredText;
  const setText = (selector, text) => { const element = root.querySelector(selector); if (element) element.textContent = text; };
  const setPlaceholder = (selector, text) => { root.querySelectorAll(selector).forEach((element)=>{ element.placeholder = text; }); };
  setText('#editOrderBtn', 'طھط¹ط¯ظٹظ„ ط§ظ„ط·ظ„ط¨');
  setText('#toggleOperationClosedBtn', order.operationClosed ? 'ط¥ط¹ط§ط¯ط© ظپطھط­ ط§ظ„طھط´ط؛ظٹظ„' : 'ط¥ط؛ظ„ط§ظ‚ ط¯ظˆط±ط© ط§ظ„طھط´ط؛ظٹظ„');
  setText('#addAllocationBtn', '+ ط¥ط¶ط§ظپط© ظ„ظˆظ†');
  root.querySelectorAll('.batch-box h3').forEach((title) => {
    const form = title.closest('.batch-box')?.querySelector('.batch-form')?.dataset.form;
    const labels = { raw:'ط®ط±ظˆط¬ ط®ط§ظ…', accessory:'ط®ط±ظˆط¬ ط¥ظƒط³ط³ظˆط§ط±', accessoryReceived:'ط§ط³طھظ„ط§ظ… ط¥ظƒط³ط³ظˆط§ط±', production:'ط§ط³طھظ„ط§ظ… ظ…ط¬ظ‡ط²', customer:'طھط³ظ„ظٹظ… ط¹ظ…ظٹظ„' };
    if (labels[form]) title.textContent = labels[form];
  });
  const rawForm = root.querySelector('form[data-form="raw"]');
  if (rawForm) {
    rawForm.elements.movementKind.options[0].textContent = 'ط®ط±ظˆط¬ ط®ط§ظ… ظ„ظ„ظ…طµط¨ط؛ط©';
    rawForm.elements.movementKind.options[1].textContent = 'ط§ط±طھط¬ط§ط¹ ط®ط§ظ… ظ„ظ„ظ†ط³ظٹط¬';
    rawForm.querySelector('[name="widthLineId"] option')?.replaceChildren(document.createTextNode('ط§ط®طھط± ط§ظ„ط¹ط±ط¶ ط¹ظ†ط¯ ط®ط±ظˆط¬ ط§ظ„ط®ط§ظ…'));
    rawForm.querySelector('[name="allocationId"] option')?.replaceChildren(document.createTextNode('ط§ط®طھط± ط§ظ„ظ„ظˆظ† / ط§ظ„ظ…طµط¨ط؛ط© ظ„ظ„ظ…ط±طھط¬ط¹'));
    const fileLabel = rawForm.querySelector('.batch-file-label span');
    if (fileLabel) fileLabel.textContent = 'طµظˆط±ط© ط¥ط°ظ† ط§ظ„ط®ط§ظ…';
    rawForm.querySelector('button') && (rawForm.querySelector('button').textContent = 'ط¥ط¶ط§ظپط© ط­ط±ظƒط©');
  }
  root.querySelectorAll('select[name="widthLineId"] option').forEach((option) => {
    const line = (order.widthLines || []).find((item)=>item.id === option.value);
    if (line) option.textContent = `ط¨ظˆطµط© ${line.inch} â€” ط¹ط±ط¶ ${line.width} â€” ظ…ط·ظ„ظˆط¨ ${line.quantity}`;
  });
  root.querySelectorAll('form[data-form="accessory"] button, form[data-form="accessoryReceived"] button').forEach((button)=>button.textContent = 'ط¥ط¶ط§ظپط©');
  root.querySelector('form[data-form="production"] button') && (root.querySelector('form[data-form="production"] button').textContent = 'ط¥ط¶ط§ظپط© ط§ط³طھظ„ط§ظ…');
  root.querySelector('form[data-form="customer"] button') && (root.querySelector('form[data-form="customer"] button').textContent = 'ط¥ط¶ط§ظپط© ط­ط±ظƒط©');
  const customerForm = root.querySelector('form[data-form="customer"]');
  if (customerForm?.elements.movementKind) {
    [...customerForm.elements.movementKind.options].forEach((option) => {
      if (option.value === 'cloth') option.textContent = 'طھط³ظ„ظٹظ… ظ‚ظ…ط§ط´';
      if (option.value === 'clothReturn') option.textContent = 'ظ…ط±طھط¬ط¹ ظ‚ظ…ط§ط´ ظ…ظ† ط§ظ„ط¹ظ…ظٹظ„';
      if (option.value === 'accessory') option.textContent = 'طھط³ظ„ظٹظ… ط¥ظƒط³ط³ظˆط§ط±';
      if (option.value === 'accessoryReturn') option.textContent = 'ظ…ط±طھط¬ط¹ ط¥ظƒط³ط³ظˆط§ط± ظ…ظ† ط§ظ„ط¹ظ…ظٹظ„';
    });
  }
  setPlaceholder('input[name="quantity"]', 'ط§ظ„ظƒظ…ظٹط©');
  setPlaceholder('form[data-form="production"] input[name="quantity"], form[data-form="accessoryReceived"] input[name="quantity"]', 'ط§ظ„ظƒظ…ظٹط© ط§ظ„ظ…ط³طھظ„ظ…ط©');
  setPlaceholder('input[name="supplier"]', 'ظ…طµط¯ط± ط§ظ„ظ†ط³ظٹط¬');
  setPlaceholder('input[name="noteNumber"]', 'ط±ظ‚ظ… ط§ظ„ط¥ط°ظ†');
  setPlaceholder('input[name="notes"]', 'ظ…ظ„ط§ط­ط¸ط§طھ');
  root.querySelectorAll('.summary-grid .metric span').forEach((span, index) => {
    const labels = ['ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط®ط§ظ… ط§ظ„ظ…ط·ظ„ظˆط¨','ط®ط±ط¬ ظ…ظ† ط§ظ„ظ†ط³ظٹط¬ ط¥ظ„ظ‰ ط§ظ„ظ…طµط¨ط؛ط©','ط¯ط§ط®ظ„ ط§ظ„ظ…طµط¨ط؛ط©','ظ…ط¬ظ‡ط² ط¯ط®ظ„ ط§ظ„ظ…ط®ط²ظ†','ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ† / ط¬ط§ظ‡ط² ظ„ظ„طھط³ظ„ظٹظ…','طھظ… طھط³ظ„ظٹظ…ظ‡ ظ„ظ„ط¹ظ…ظٹظ„','ظ…ط±طھط¬ط¹ ط®ط§ظ… ظ„ظ„ظ†ط³ظٹط¬','ظ‡ط§ظ„ظƒ طھظ‚ط¯ظٹط±ظٹ','ظ‡ط§ظ„ظƒ ظپط¹ظ„ظٹ'];
    if (labels[index]) span.textContent = labels[index];
  });
  root.querySelectorAll('th').forEach((th) => {
    if (!isBadText(th.textContent)) return;
    const row = [...th.parentElement.children];
    const index = row.indexOf(th);
    const fixed = ({ 0:'ط§ظ„ط¨ظˆطµط©', 1:'ط§ظ„ط¹ط±ط¶', 2:'ط§ظ„ظƒظ…ظٹط©', 7:'ظ‡ط§ظ„ظƒ طھظ‚ط¯ظٹط±ظٹ', 8:'ظ‡ط§ظ„ظƒ طھظ‚ط¯ظٹط±ظٹ', 9:'ظ‡ط§ظ„ظƒ ظپط¹ظ„ظٹ', 10:'ط¥ط¬ط±ط§ط،ط§طھ' })[index];
    if (fixed) th.textContent = fixed;
  });
  root.querySelectorAll('.batch-list .empty-state').forEach((item)=>{ if (isBadText(item.textContent)) item.textContent = 'ظ„ط§ طھظˆط¬ط¯ ط¯ظپط¹ط§طھ ط¨ط¹ط¯.'; });
  root.querySelectorAll('.batch-list .batch-item span').forEach((span)=>{
    let text = span.textContent;
    text = text.replace(/\?+/g, '').replace(/\uFFFD/g, '').replace(/أ¯طںآ½/g, '').replace(/\s+/g, ' ').trim();
    if (text.includes('202') && !text.includes('ط®ط±ظˆط¬ ط®ط§ظ…')) text = `ط®ط±ظˆط¬ ط®ط§ظ… - ${text}`;
    text = text.replace(/(\d+)\s*-\s*(\d+)$/, 'ط¨ظˆطµط© $1 - ط¹ط±ط¶ $2');
    span.textContent = text;
  });
  const sendStatus = root.querySelector('.report-send-status');
  if (sendStatus) {
    const title = sendStatus.querySelector('h3');
    const hint = sendStatus.querySelector('.eyebrow');
    if (title) title.textContent = 'ط­ط§ظ„ط© ظ…ط´ط§ط±ظƒط© ط§ظ„طھظ‚ط§ط±ظٹط±';
    if (hint) hint.textContent = 'ط§ظ„ظ…ط´ط§ط±ظƒط© طھطھظ… ط¹ط¨ط± ط®ط¯ظ…ط© ظˆط§طھط³ط§ط¨ ط¹ظ†ط¯ طھط´ط؛ظٹظ„ظ‡ط§.';
  }
  root.querySelectorAll('h3').forEach((title)=>{
    if (isBadText(title.textContent)) title.textContent = 'ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ† ط§ظ„ط­ط§ظ„ظٹ';
  });
  root.querySelectorAll('.subsection .eyebrow').forEach((hint)=>{
    if (isBadText(hint.textContent)) hint.textContent = 'ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ† ط­ط³ط¨ ط§ظ„طھط´ط؛ظٹظ„ ظˆط§ظ„طھط³ظ„ظٹظ…';
  });
  root.querySelectorAll('th').forEach((th)=>{
    if (!isBadText(th.textContent)) return;
    const row = [...th.parentElement.children];
    const index = row.indexOf(th);
    const fixed = index === 3 ? 'ط¯ط®ظ„ ط§ظ„ظ…ط®ط²ظ†' : index === 4 ? 'ط§ظ„ط±طµظٹط¯ ط§ظ„ط­ط§ظ„ظٹ' : 'ظ…ظ„ط§ط­ط¸ط§طھ';
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
    ['ط§ظ„ظ†ط³ظٹط¬', totals.weaving || 0],
    ['ط§ظ„ظ…طµط¨ط؛ط©', totals.dyehouse || 0],
    ['ط§ظ„ظ…ط®ط²ظ†', totals.warehouse || 0],
    ['ط§ظ„طھط³ظ„ظٹظ…', totals.delivery || 0],
  ];
  summaryBox.innerHTML = cards.map(([label, value]) => `<button type="button" data-stage-filter="${escapeHtml(label === 'ط§ظ„ظ†ط³ظٹط¬' ? 'weaving' : label === 'ط§ظ„ظ…طµط¨ط؛ط©' ? 'dyehouse' : label === 'ط§ظ„ظ…ط®ط²ظ†' ? 'warehouse' : 'delivery')}"><span>${escapeHtml(label)}</span><strong>${Number(value || 0).toLocaleString('en-US')}</strong></button>`).join('');
  body.innerHTML = rows.length ? rows.map(({ order, stage }) => `
    <tr>
      <td data-label="ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨">${escapeHtml(order.orderNumber || '-')}</td>
      <td data-label="ط§ظ„ط¹ظ…ظٹظ„">${escapeHtml(order.customer || '-')}</td>
      <td data-label="ط§ظ„طµظ†ظپ">${escapeHtml(order.fabricType || '-')}</td>
      <td data-label="ط§ظ„ظ…ط±ط­ظ„ط©"><span class="status in-progress">${escapeHtml(operationStagePlace(order, stage))}</span></td>
      <td data-label="ظˆط§ظ‚ظپ ظ…ظ†">${escapeHtml(stage.startDate || '-')}</td>
      <td data-label="ط§ظ„ط£ظٹط§ظ…">${Number(stage.days || 0).toLocaleString('en-US')}</td>
      <td data-label="ط§ظ„ط³ط¨ط¨">${escapeHtml(stage.reason || '-')}</td>
      <td data-label="ط¥ط¬ط±ط§ط،"><button type="button" class="mini-btn" data-view="${escapeHtml(order.id)}">ظپطھط­</button></td>
    </tr>
  `).join('') : '<tr><td colspan="8"><div class="empty-state">ظ„ط§ طھظˆط¬ط¯ ط·ظ„ط¨ط§طھ طھط­طھط§ط¬ ظ…طھط§ط¨ط¹ط© طھط´ط؛ظٹظ„ ط­ط§ظ„ظٹط§ظ‹.</div></td></tr>';
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
  renderPricings,
  renderTodayOrdersPanel: () => renderTodayOrdersPanel?.(),
  openManagementReport: (...args) => openManagementReport(...args),
  refreshOperationFollowPanel,
  openGluingQueueDialog,
  openFinishedSalePanel,
  renderCustomerAccountsDialog,
  renderA5AccountsDialog,
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

function gluingPurchaseDetails(batch = {}) {
  const details = batch.sourceDocument || {};
  return details?.type === 'gluing-purchase-send' ? details : null;
}

function gluingSourceLabel(batch = {}) {
  const purchase = gluingPurchaseDetails(batch);
  if (purchase) {
    const material = purchase.materialName || batch.outputName || 'ط®ط§ظ…ط© ظ„ط²ظ‚';
    const supplier = purchase.supplier ? ` - ${purchase.supplier}` : '';
    return `ط´ط±ط§ط، ظˆط¥ط±ط³ط§ظ„ ${material}${supplier}`;
  }
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

function gluingSourceTypeLabel(batch = {}) {
  return gluingPurchaseDetails(batch) ? 'ط´ط±ط§ط، ط®ط§ظ…ط© ظ„ط²ظ‚ + ط¥ط±ط³ط§ظ„' : 'ط®ط§ظ… ظ…ط¬ظ‡ط² ظ…ط±ط³ظ„ ظ„ظ„ط²ظ‚';
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
      return `<option value="${escapeHtml(order.id)}|${escapeHtml(allocation.id)}">${escapeHtml(label)} - ظ…طھط§ط­ ${formatNumber(available)}</option>`;
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
    const sourceRows = group.sources.map((batch)=>`<tr><td>${escapeHtml(gluingSourceTypeLabel(batch))}</td><td>${escapeHtml(gluingSourceLabel(batch))}</td><td>${formatNumber(batch.quantity || 0)}</td></tr>`).join('');
    const outputRows = group.received.map((batch)=>`<tr><td>${escapeHtml(batch.outputName || '-')}</td><td>${formatNumber(batch.quantity || 0)}</td><td>${escapeHtml(batch.date || '-')}</td></tr>`).join('');
    return `<div class="subsection"><div class="subsection-head"><div><h3>ط¹ظ…ظ„ظٹط© ط¯ظ…ط¬ ${escapeHtml(group.key)}</h3><p class="eyebrow">ط¥ط±ط³ط§ظ„ ط§ظ„ط®ط§ظ… ط§ظ„ظ…ط¬ظ‡ط² ظ„ظ…طµظ†ط¹ ط§ظ„ظ„ط²ظ‚طŒ ط«ظ… ط´ط±ط§ط، ط®ط§ظ…ط© ط§ظ„ظ„ط²ظ‚ ظˆط¥ط±ط³ط§ظ„ظ‡ط§طŒ ط«ظ… طھط³ط¬ظٹظ„ ط§ظ„ظ…ظ†طھط¬ ط§ظ„ظ†ط§طھط¬.</p></div></div><div class="summary-grid"><div class="metric"><span>ط®ط§ظ…ط§طھ ط¯ط§ط®ظ„ط©</span><strong>${formatNumber(sent)}</strong></div><div class="metric"><span>ظ…ظ†طھط¬ ظ†ط§طھط¬</span><strong>${formatNumber(received)}</strong></div><div class="metric"><span>ظ…طھط¨ظ‚ظٹ ط¯ط§ط®ظ„ ط§ظ„ط¯ظ…ط¬</span><strong>${formatNumber(inGluing)}</strong></div></div><div class="table-wrap"><table class="allocation-table"><thead><tr><th>ظ†ظˆط¹ ط§ظ„ط­ط±ظƒط©</th><th>ط§ظ„ط®ط§ظ…ط© / ط§ظ„ظ…طµط¯ط±</th><th>ط§ظ„ظƒظ…ظٹط©</th></tr></thead><tbody>${sourceRows}</tbody></table></div>${outputRows ? `<div class="table-wrap"><table class="allocation-table"><thead><tr><th>ط§ظ„ظ…ظ†طھط¬ ط§ظ„ظ†ط§طھط¬</th><th>ط§ظ„ظƒظ…ظٹط©</th><th>ط§ظ„طھط§ط±ظٹط®</th></tr></thead><tbody>${outputRows}</tbody></table></div>` : ''}</div>`;
  }).join('') : '<div class="empty-state">ظ„ط§ طھظˆط¬ط¯ ط®ط§ظ…ط§طھ ظپظٹ ط¯ظ…ط¬ ط§ظ„ط®ط§ظ…ط§طھ ط­طھظ‰ ط§ظ„ط¢ظ†.</div>';
  refs.documentTitle.textContent = 'ط¯ظ…ط¬ ط®ط§ظ…ط§طھ';
  refs.documentBody.dataset.documentType = 'gluing-queue';
  refs.documentBody.innerHTML = `<div class="doc-root">${groupDatalist}<div class="subsection"><div class="subsection-head"><div><h3>ط¥ط±ط³ط§ظ„ ط®ط§ظ…ط§طھ ظ„ظ…طµظ†ط¹ ط§ظ„ظ„ط²ظ‚</h3><p class="eyebrow">ط³ط¬ظ„ ط§ظ„ط®ط§ظ… ط§ظ„ظ…ط¬ظ‡ط² ط§ظ„ط®ط§ط±ط¬ ظ…ظ† ط§ظ„ط£ظˆط±ط¯ط±طŒ ظˆظ…ط¹ظ‡ ط´ط±ط§ط، ط®ط§ظ…ط© ط§ظ„ظ„ط²ظ‚ ظˆط¥ط±ط³ط§ظ„ظ‡ط§ ظپظٹ ظ†ظپط³ ط±ظ‚ظ… ط¹ظ…ظ„ظٹط© ط§ظ„ط¯ظ…ط¬.</p></div></div><form class="batch-form" data-gluing-source-form><input name="operationKey" list="gluingOperationKeys" placeholder="ط±ظ‚ظ… ط¹ظ…ظ„ظٹط© ط§ظ„ط¯ظ…ط¬" required><select name="sourceKey"><option value="">ط§ظ„ط®ط§ظ… ط§ظ„ظ…ط¬ظ‡ط² ظ…ظ† ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ†</option>${warehouseSourceOptions}</select><input name="quantity" type="number" step="0.01" placeholder="ظƒظ…ظٹط© ط§ظ„ط®ط§ظ… ط§ظ„ظ…ط¬ظ‡ط²"><input name="adhesiveName" placeholder="ط®ط§ظ…ط© ط§ظ„ظ„ط²ظ‚ / ط§ظ„ظ‚ط·ظٹظپط©"><input name="adhesiveQuantity" type="number" step="0.01" placeholder="ظƒظ…ظٹط© ط®ط§ظ…ط© ط§ظ„ظ„ط²ظ‚ ط§ظ„ظ…ط´طھط±ط§ط©"><input name="adhesiveSupplier" placeholder="ظ…ظˆط±ط¯ ط®ط§ظ…ط© ط§ظ„ظ„ط²ظ‚"><input name="adhesiveUnitPrice" type="number" step="0.01" placeholder="ط³ط¹ط± ط§ظ„ظƒظٹظ„ظˆ"><input name="date" type="date" value="${new Date().toISOString().slice(0,10)}" required><input class="full" name="notes" placeholder="ظ…ظ„ط§ط­ط¸ط§طھ"><button type="button" class="mini-btn full" data-save-gluing-source>ط­ظپط¸ ط¥ط±ط³ط§ظ„ ط§ظ„ط®ط§ظ… ظˆط´ط±ط§ط، ط®ط§ظ…ط© ط§ظ„ظ„ط²ظ‚</button></form></div><div class="subsection"><div class="subsection-head"><div><h3>ط¯ظ…ط¬ ط§ظ„ط®ط§ظ…ط§طھ ظˆط§ط³طھظ„ط§ظ… ط§ظ„ظ…ظ†طھط¬ ط§ظ„ظ†ط§طھط¬</h3><p class="eyebrow">ط§ط®طھط± ط¹ظ…ظ„ظٹط© ط§ظ„ط¯ظ…ط¬ ط¨ط¹ط¯ طھط³ط¬ظٹظ„ ط®ط§ظ… ط§ظ„ظ…طµظ†ط¹ ظˆط®ط§ظ…ط© ط§ظ„ظ„ط²ظ‚طŒ ط«ظ… ط³ط¬ظ„ ط§ظ„ظ…ظ†طھط¬ ط§ظ„ظ†ط§طھط¬.</p></div></div><form class="batch-form" data-gluing-merge-form><select name="operationKey" required><option value="">ط§ط®طھط± ط±ظ‚ظ… ط¹ظ…ظ„ظٹط© ط§ظ„ط¯ظ…ط¬</option>${groupOptions}</select><input name="date" type="date" value="${new Date().toISOString().slice(0,10)}" required><input name="outputName" placeholder="ط§ط³ظ… ط§ظ„ظ…ظ†طھط¬ ط§ظ„ظ†ط§طھط¬" required><input name="quantity" type="number" step="0.01" placeholder="ظƒظ…ظٹط© ط§ظ„ظ…ظ†طھط¬ ط§ظ„ظ†ط§طھط¬" required><input class="full" name="notes" placeholder="ظ…ظ„ط§ط­ط¸ط§طھ"><button type="button" class="mini-btn full" data-save-gluing-merge>طھط³ط¬ظٹظ„ ط§ظ„ط¯ظ…ط¬ ظˆط§ط³طھظ„ط§ظ… ط§ظ„ظ…ظ†طھط¬</button></form></div>${cards}</div>`;
  if (!refs.documentDialog.open) refs.documentDialog.showModal();
}

function findGluingGroup(operationKey) {
  return gluingQueueGroups().find((group)=>group.key === String(operationKey || '').trim());
}

async function saveGluingSourceFromDialog(form) {
  if (!(await ensureBackendForWrite())) return;
  const data = Object.fromEntries(new FormData(form).entries());
  const operationKey = String(data.operationKey || '').trim();
  if (!operationKey) { alert('ط§ظƒطھط¨ ط±ظ‚ظ… ط¹ظ…ظ„ظٹط© ط§ظ„ط¯ظ…ط¬.'); return; }
  const sourceRows = [
    { sourceKey:data.sourceKey, quantity:data.quantity }
  ].filter((row)=>String(row.sourceKey || '').trim() && Number(row.quantity || 0) > 0);
  const adhesiveQuantity = Number(data.adhesiveQuantity || 0);
  const adhesiveName = String(data.adhesiveName || '').trim();
  if (!sourceRows.length && !adhesiveQuantity) { alert('ط§ط®طھط± ط®ط§ظ… ظ…ط¬ظ‡ط² ط£ظˆ ط³ط¬ظ„ ط®ط§ظ…ط© ط§ظ„ظ„ط²ظ‚ ط§ظ„ظ…ط´طھط±ط§ط©.'); return; }
  if (adhesiveQuantity && !adhesiveName) { alert('ط§ظƒطھط¨ ط§ط³ظ… ط®ط§ظ…ط© ط§ظ„ظ„ط²ظ‚ / ط§ظ„ظ‚ط·ظٹظپط© ظ‚ط¨ظ„ ط§ظ„ط­ظپط¸.'); return; }
  let savedAny = false;
  let primaryOrderId = selectedOrderId || '';
  for (const row of sourceRows) {
    const [orderId, allocationId] = String(row.sourceKey || '').split('|');
    primaryOrderId = primaryOrderId || orderId;
    const order = orders.find((item)=>item.id === orderId);
    const allocation = allocations.find((item)=>item.id === allocationId);
    if (!order || !allocation) { alert('طھط¹ط°ط± ظ‚ط±ط§ط،ط© ط§ظ„ط®ط§ظ…ط© ط§ظ„ظ…ط®طھط§ط±ط© ظ…ظ† ط§ظ„ط·ظ„ط¨.'); return; }
    const calculatedOrder = calculateOrder(order);
    const available = gluingAllocationAvailable(calculatedOrder, allocation);
    const quantity = Number(row.quantity || 0);
    let notes = data.notes || '';
    if (quantity > available) notes = [notes, 'طھظ†ط¨ظٹظ‡: ط§ظ„ظƒظ…ظٹط© ط£ظƒط¨ط± ظ…ظ† ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ† ط§ظ„ظ…طھط§ط­ ظ„ظ‡ط°ظ‡ ط§ظ„ط®ط§ظ…ط©'].filter(Boolean).join(' - ');
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
    if (!saved) { alert('طھط¹ط°ط± ط¥ط±ط³ط§ظ„ ط§ظ„ط®ط§ظ… ط§ظ„ظ…ط¬ظ‡ط² ط¥ظ„ظ‰ ط¹ظ…ظ„ظٹط© ط§ظ„ط¯ظ…ط¬.'); return; }
    savedAny = true;
  }
  if (adhesiveQuantity) {
    primaryOrderId = primaryOrderId || orders[0]?.id || '';
    if (!primaryOrderId) { alert('ظ„ط§ ظٹظˆط¬ط¯ ط·ظ„ط¨ ظٹظ…ظƒظ† ط±ط¨ط· ط®ط§ظ…ط© ط§ظ„ظ„ط²ظ‚ ط¨ظ‡.'); return; }
    const unitPrice = Number(data.adhesiveUnitPrice || 0);
    const purchaseNotes = [
      data.notes || '',
      `ط´ط±ط§ط، ظˆط¥ط±ط³ط§ظ„ ${adhesiveName}`,
      data.adhesiveSupplier ? `ط§ظ„ظ…ظˆط±ط¯: ${data.adhesiveSupplier}` : '',
      unitPrice ? `ط³ط¹ط± ط§ظ„ظƒظٹظ„ظˆ: ${formatNumber(unitPrice)}` : ''
    ].filter(Boolean).join(' - ');
    const saved = await postBackend('/batches/gluing', batchToApi({
      id: uid(),
      orderId: primaryOrderId,
      allocationId: '',
      date: data.date,
      quantity: adhesiveQuantity,
      movement: 'sent',
      noteNumber: operationKey,
      partnerFabric: operationKey,
      notes: purchaseNotes,
      sourceDocument: {
        type: 'gluing-purchase-send',
        materialName: adhesiveName,
        supplier: data.adhesiveSupplier || '',
        unitPrice,
        totalPrice: roundNumber(adhesiveQuantity * unitPrice)
      }
    }));
    if (!saved) { alert('طھط¹ط°ط± ط­ظپط¸ ط´ط±ط§ط، ظˆط¥ط±ط³ط§ظ„ ط®ط§ظ…ط© ط§ظ„ظ„ط²ظ‚.'); return; }
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
  if (!group || !source) { alert('ط§ط®طھط± ط±ظ‚ظ… ط¹ظ…ظ„ظٹط© ط¯ظ…ط¬ طھط­طھظˆظٹ ط¹ظ„ظ‰ ط®ط§ظ…ط§طھ ط¯ط§ط®ظ„ط© ط£ظˆظ„ط§.'); return; }
  if (!String(data.outputName || '').trim()) { alert('ط§ظƒطھط¨ ط§ط³ظ… ط§ظ„ظ…ظ†طھط¬ ط§ظ„ط¬ط¯ظٹط¯.'); return; }
  const sent = sum(group.sources);
  const returned = sum(group.returns);
  const received = sum(group.received);
  const available = Math.max(sent - returned - received, 0);
  if (Number(data.quantity || 0) > available) data.notes = [data.notes, 'طھظ†ط¨ظٹظ‡: ظƒظ…ظٹط© ط§ظ„ظ…ظ†طھط¬ ط§ظ„ظ†ط§طھط¬ ط£ظƒط¨ط± ظ…ظ† ط§ظ„ط±طµظٹط¯ ط§ظ„ظ…ظˆط¬ظˆط¯ ط¯ط§ط®ظ„ ط§ظ„ط¯ظ…ط¬'].filter(Boolean).join(' - ');
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
  if (!saved) { alert('طھط¹ط°ط± ط­ظپط¸ ط¹ظ…ظ„ظٹط© ط§ظ„ط¯ظ…ط¬ ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ.'); return; }
  await loadBackendData();
  openGluingQueueDialog();
}

async function saveGluingReturnFromDialog(form) {
  if (!(await ensureBackendForWrite())) return;
  const data = Object.fromEntries(new FormData(form).entries());
  const [operationKey, allocationId] = String(data.sourceKey || '').split('|');
  const group = findGluingGroup(operationKey);
  const source = group?.sources?.find((batch)=>batch.allocationId === allocationId);
  if (!group || !source || !allocationId) { alert('ط§ط®طھط± ط§ظ„ط®ط§ظ…ط© ط§ظ„ظ…طµط¯ط± ط£ظˆظ„ط§.'); return; }
  const sent = sum(group.sources.filter((batch)=>batch.allocationId === allocationId));
  const returned = sum(group.returns.filter((batch)=>batch.allocationId === allocationId));
  const available = Math.max(sent - returned, 0);
  if (Number(data.quantity || 0) > available) data.notes = [data.notes, 'طھظ†ط¨ظٹظ‡: ط§ظ„ظ…ط±طھط¬ط¹ ط£ظƒط¨ط± ظ…ظ† ط±طµظٹط¯ ظ‡ط°ظ‡ ط§ظ„ط®ط§ظ…ط© ط¯ط§ط®ظ„ ط§ظ„ط¯ظ…ط¬'].filter(Boolean).join(' - ');
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
  if (!saved) { alert('طھط¹ط°ط± ط­ظپط¸ ط±ط¬ظˆط¹ ط§ظ„ظ…طھط¨ظ‚ظٹ ظ…ظ† ط§ظ„ط¯ظ…ط¬.'); return; }
  await loadBackendData();
  openGluingQueueDialog();
}

async function saveGluingCustomerFromDialog(form) {
  if (!(await ensureBackendForWrite())) return;
  const data = Object.fromEntries(new FormData(form).entries());
  const group = findGluingGroup(data.operationKey);
  const source = group?.sources?.[0];
  if (!group || !source) { alert('ط§ط®طھط± ط±ظ‚ظ… ط¹ظ…ظ„ظٹط© ط§ظ„ط¯ظ…ط¬ ط£ظˆظ„ط§.'); return; }
  if (!String(data.outputName || '').trim() || !String(data.customerName || '').trim()) { alert('ط§ظƒطھط¨ ط§ط³ظ… ط§ظ„ظ…ظ†طھط¬ ظˆط§ظ„ط¹ظ…ظٹظ„ ظ‚ط¨ظ„ ط§ظ„طھط³ظ„ظٹظ….'); return; }
  const received = sum(group.received.filter((batch)=>normalizeForCompare(batch.outputName) === normalizeForCompare(data.outputName)));
  const delivered = sum(group.delivered.filter((batch)=>normalizeForCompare(batch.outputName) === normalizeForCompare(data.outputName)));
  if (Number(data.quantity || 0) > Math.max(received - delivered, 0)) data.notes = [data.notes, 'طھظ†ط¨ظٹظ‡: ظƒظ…ظٹط© ط§ظ„طھط³ظ„ظٹظ… ط£ظƒط¨ط± ظ…ظ† ط±طµظٹط¯ ط§ظ„ظ…ظ†طھط¬ ط§ظ„ظ†ط§طھط¬'].filter(Boolean).join(' - ');
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
  if (!saved) { alert('طھط¹ط°ط± ط­ظپط¸ طھط³ظ„ظٹظ… ط§ظ„ظ…ظ†طھط¬ ط§ظ„ظ†ط§طھط¬.'); return; }
  await loadBackendData();
  openGluingQueueDialog();
}
function batchItemHtml(type, batch, label) {
  const quantity = Number(batch?.quantity || 0);
  const displayLabel = quantity < 0
    ? String(label)
      .replace('تسليم قماش للعميل', 'مرتجع قماش من العميل')
      .replace('تسليم إكسسوار للعميل', 'مرتجع إكسسوار من العميل')
      .replace('طھط³ظ„ظٹظ… ظ‚ظ…ط§ط´ ظ„ظ„ط¹ظ…ظٹظ„', 'مرتجع قماش من العميل')
      .replace('طھط³ظ„ظٹظ… ط¥ظƒط³ط³ظˆط§ط± ظ„ظ„ط¹ظ…ظٹظ„', 'مرتجع إكسسوار من العميل')
      .replace(String(batch.quantity), formatNumber(Math.abs(quantity)))
    : label;
  return `<div class="batch-item" data-batch-row title="اضغط لعرض وقت الإدخال والمدخل"><div class="batch-main"><span>${displayLabel}</span>${batchMovementMetaHtml(batch)}</div><div class="batch-actions"><button class="mini-btn" data-batch-action="edit" data-batch-type="${escapeHtml(type)}" data-batch-id="${escapeHtml(batch.id)}">تعديل</button>${canDeleteRecords() ? `<button class="mini-btn danger" data-batch-action="delete" data-batch-type="${escapeHtml(type)}" data-batch-id="${escapeHtml(batch.id)}">حذف</button>` : ''}</div></div>`;
}
function movementTimestampLabel(value) {
  if (!value) return 'غير مسجل';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' });
}
function movementActorLabel(batch) {
  return batch?.createdBy || batch?.created_by || batch?.updatedBy || batch?.updated_by || 'غير مسجل';
}
function batchMovementMetaHtml(batch) {
  const createdAt = batch?.createdAt || batch?.created_at || '';
  const updatedAt = batch?.updatedAt || batch?.updated_at || '';
  return `<div class="batch-meta" hidden data-batch-meta>
    <span>وقت الإدخال: ${escapeHtml(movementTimestampLabel(createdAt))}</span>
    <span>آخر تعديل: ${escapeHtml(movementTimestampLabel(updatedAt))}</span>
    <span>المدخل: ${escapeHtml(movementActorLabel(batch))}</span>
  </div>`;
}
function listHtml(items, formatter) { const rows = Array.isArray(items) ? items : []; return rows.length ? rows.map(formatter).join('') : `<div class="empty-state">لا توجد دفعات بعد.</div>`; }
function findAllocationWidthLine(order, allocation) {
  const widthLines = Array.isArray(order?.widthLines) ? order.widthLines : [];
  if (!widthLines.length || !allocation) return {};
  const byId = widthLines.find((item) => item.id && item.id === allocation.widthLineId);
  if (byId) return byId;
  const allocationWidth = Number(allocation.rawWidth || allocation.targetFinishedWidth || 0);
  if (!allocationWidth) return {};
  return widthLines.find((item) => Number(item.width || 0) === allocationWidth) || {};
}
function allocationWidthSuffix(order, allocation) {
  if (!order || !allocation) return '';
  const widthLine = findAllocationWidthLine(order, allocation);
  const inch = allocation.rawInch || widthLine.inch || order.inchWidth || '';
  const width = allocation.rawWidth || allocation.targetFinishedWidth || widthLine.width || '';
  const finishedWeight = allocation.targetFinishedWeight || allocation.finishedWeight || '';
  const parts = [];
  if (inch) parts.push(`ط¨ظˆطµط© ${inch}`);
  if (width) parts.push(`ط¹ط±ط¶ ${width}`);
  if (finishedWeight) parts.push(`ظˆط²ظ† ${finishedWeight}`);
  return parts.length ? ` / ${parts.join(' - ')}` : '';
}
function allocationWidthLabel(order, allocation) {
  if (!order || !allocation) return '-';
  return allocationWidthSuffix(order, allocation).replace(/^\s*\/\s*/, '') || '-';
}
function allocationInchWidthLabel(order, allocation) {
  if (!order || !allocation) return '-';
  const widthLine = findAllocationWidthLine(order, allocation);
  const inch = allocation.rawInch || widthLine.inch || order.inchWidth || '-';
  const width = allocation.rawWidth || allocation.targetFinishedWidth || widthLine.width || '-';
  return `ط¨ظˆطµط© ${inch} - ط¹ط±ط¶ ${width}`;
}
function allocationMovementLabel(order, allocation) {
  if (!allocation) return '-';
  return `${allocation.color || '-'} / ${allocation.dyehouse || '-'} / ${allocationWidthLabel(order, allocation)}`;
}
function allocationAvailableToCustomer(allocation) {
  return roundNumber(Math.max(Number(allocation?.finishedReceived || 0) - Number(allocation?.warehouseOut ?? allocation?.deliveredToCustomer ?? 0), 0));
}
function allocationOrdinalLabel(order, allocation) {
  const index = (order?.allocations || []).findIndex((item)=>item.id === allocation?.id);
  return index >= 0 ? `ط¨ظ†ط¯ ${index + 1}` : '';
}
function allocationOptionLabel(order, allocation) {
  if (!allocation) return '-';
  const planned = Number(allocation.plannedQuantity || 0) ? ` / ظ…ط®ط·ط· ${formatNumber(allocation.plannedQuantity)}` : '';
  const ordinal = allocationOrdinalLabel(order, allocation);
  return `${ordinal ? `${ordinal} / ` : ''}${allocation.color || '-'} / ${allocation.dyehouse || '-'}${allocationWidthSuffix(order, allocation)}${planned}`;
}
function allocationColorLabel(order, allocation) {
  if (!allocation) return '-';
  return allocationOptionLabel(order, allocation);
}
function customerDeliveryAllocationLabel(order, allocation) {
  if (!allocation) return '-';
  return `${allocationOptionLabel(order, allocation)} / ظ…طھط§ط­ ${formatNumber(allocationAvailableToCustomer(allocation))}`;
}
function rawDispatchOptions(order) {
  const widthLines = Array.isArray(order?.widthLines) ? order.widthLines : [];
  if (widthLines.length) {
    return widthLines.map((line)=>({
      id: line.id,
      label: `ط¨ظˆطµط© ${line.inch || '-'} - ط¹ط±ط¶ ${line.width || '-'} - ظƒظ…ظٹط© ${formatNumber(line.quantity || 0)}`,
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
  select.innerHTML = `<option value="">ط§ط®طھط± ط§ظ„ط¹ط±ط¶ / ط§ظ„ط¨ظ†ط¯ ط¹ظ†ط¯ ط®ط±ظˆط¬ ط§ظ„ط®ط§ظ…</option>${options.map((item)=>`<option value="${item.id}">${item.label}</option>`).join('')}`;
  if ([...select.options].some((option)=>option.value === current)) select.value = current;
}
function movementLine(...parts) {
  return parts.map((part)=>String(part ?? '').trim()).filter(Boolean).join(' - ');
}
function noteSuffix(batch) {
  return batch?.noteNumber ? ` / ط±ظ‚ظ… ط¥ط°ظ† ${batch.noteNumber}` : '';
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
  const overDelivered = Math.max(Number(order.totalDeliveredToCustomer || 0) - Number(order.totalFinishedReceived || 0), 0);
  if (Number(stage.days || 0) >= 7 && !['completed','closed'].includes(stage.key)) alerts.push(`ظˆط§ظ‚ظپ ${stage.days} ظٹظˆظ… ظپظٹ ظ…ط±ط­ظ„ط© ${stage.label}`);
  if (overDelivered > 0) alerts.push(`طھظ†ط¨ظٹظ‡ ط¨ظٹط§ظ†ط§طھ: طھط³ظ„ظٹظ… ط§ظ„ط¹ظ…ظٹظ„ ط£ظƒط¨ط± ظ…ظ† ط§ظ„ظ…ط¬ظ‡ط² ط¨ظ€ ${formatNumber(overDelivered)} ظƒط¬ظ… - ط§ظ„ظ…ط¬ظ‡ط² ${formatNumber(order.totalFinishedReceived || 0)} ظƒط¬ظ… / ط§ظ„ظ…ط³ظ„ظ… ${formatNumber(order.totalDeliveredToCustomer || 0)} ظƒط¬ظ…`);
  if (actualWaste > 0 && actualWaste >= Math.max(8, expectedWaste + 2)) alerts.push(`ط§ظ„ظ‡ط§ظ„ظƒ ط§ظ„ظپط¹ظ„ظٹ ${formatNumber(actualWaste, 1)}% ط£ط¹ظ„ظ‰ ظ…ظ† ط§ظ„ظ…طھظˆظ‚ط¹ ${formatNumber(expectedWaste, 1)}%`);
  if (Number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse || 0) > 0) alerts.push(`ط¯ط§ط®ظ„ ط§ظ„ظ…طµط¨ط؛ط© ${formatNumber(order.rawAtDyehouseAvailable || order.remainingAtDyehouse)} ظƒط¬ظ… ظ„ظ… ظٹط±ط¬ط¹ ظ…ط¬ظ‡ط²ظ‹ط§`);
  if (Number(order.warehouseBalance || 0) > 0) alerts.push(`ط±طµظٹط¯ ظ…ط®ط²ظ† ظ…طھط§ط­ ظ„ظ„طھط³ظ„ظٹظ… ${formatNumber(order.warehouseBalance)} ظƒط¬ظ…`);
  if (order.allocationExceedsRaw) alerts.push('ظƒظ…ظٹط© ط®ط·ط© ط§ظ„ط£ظ„ظˆط§ظ† ط£ظƒط¨ط± ظ…ظ† ط§ظ„ط®ط§ظ… ط§ظ„ظ…طھط§ط­');
  return alerts;
}
function order360Html(order) {
  const stage = orderStageInfo(order);
  const movementDates = orderMovementDates(order);
  const dyehouseBalance = Number(order.rawAtDyehouseAvailable || order.remainingAtDyehouse || 0);
  const steps = [
    { key:'order', label:'ط·ظ„ط¨ ط§ظ„ط¹ظ…ظٹظ„', value:formatNumber(order.totalRawOrdered || 0), sub:`ط®ط§ظ… ظ…ط·ظ„ظˆط¨ / ${movementDates.orderDate}`, done:true },
    { key:'weaving', label:'ط§ظ„ظ†ط³ظٹط¬', value:formatNumber(order.totalRawReceived || 0), sub:`ط®ط§ظ… ط®ط±ط¬ ظ„ظ„ظ…طµط¨ط؛ط© / ${movementDates.weavingDate}`, done:Number(order.totalRawReceived || 0) > 0, active:stage.key === 'weaving' },
    { key:'dyehouse', label:'ط§ظ„ظ…طµط¨ط؛ط©', value:formatNumber(dyehouseBalance), sub:`ظ…طھط¨ظ‚ظٹ ط¯ط§ط®ظ„ ط§ظ„ظ…طµط¨ط؛ط© / ${movementDates.weavingDate}`, done:Number(order.totalFinishedReceived || 0) > 0 || dyehouseBalance === 0, active:stage.key === 'dyehouse' },
    { key:'warehouse', label:'ط§ظ„ظ…ط®ط²ظ†', value:formatNumber(order.warehouseBalance || 0), sub:`ط±طµظٹط¯ ظ…ط¬ظ‡ط² / ${movementDates.dyehouseDate}`, done:Number(order.totalFinishedReceived || 0) > 0, active:stage.key === 'warehouse' },
    { key:'delivery', label:'ط§ظ„طھط³ظ„ظٹظ…', value:formatNumber(order.totalDeliveredToCustomer || 0), sub:`ظ…ط³ظ„ظ… ظ„ظ„ط¹ظ…ظٹظ„ / ${movementDates.customerDate}`, done:Number(order.remainingToCustomer || 0) === 0 && Number(order.totalDeliveredToCustomer || 0) > 0, active:stage.key === 'delivery' },
    { key:'close', label:'ط§ظ„ط¥ط؛ظ„ط§ظ‚', value:stage.key === 'closed' ? 'ظ…ط؛ظ„ظ‚' : (stage.key === 'completed' ? 'ظ…ظƒطھظ…ظ„' : 'ظ…ظپطھظˆط­'), sub:'ط­ط§ظ„ط© ط§ظ„طھط´ط؛ظٹظ„', done:['completed','closed'].includes(stage.key), active:stage.key === 'closed' },
  ];
  const alerts = order360Alerts(order, stage);
  const progressBase = Number(order.totalRawOrdered || order.totalAllocated || 0);
  const deliveredPercent = progressBase ? Math.min(Number(order.totalDeliveredToCustomer || 0) / progressBase * 100, 100) : 0;
  return `<section class="order-360">
    <div class="order-360-head">
      <div><p class="eyebrow">Order 360</p><h2>${escapeHtml(order.orderNumber || '-')} - ${escapeHtml(order.customer || '-')}</h2><p>${escapeHtml(order.fabricType || '-')} / ${escapeHtml(order.dyehouse || '-')} / ${escapeHtml(order.weavingSource || '-')}</p></div>
      <div class="order-360-stage"><span>${escapeHtml(stage.label)}</span><strong>${Number(stage.days || 0).toLocaleString('en-US')} ظٹظˆظ…</strong></div>
    </div>
    <div class="order-360-flow">${steps.map((step)=>`<article class="${order360StageClass(step.done, step.active)}"><span>${escapeHtml(step.label)}</span><strong>${escapeHtml(step.value)}</strong><small>${escapeHtml(step.sub)}</small></article>`).join('')}</div>
    <div class="order-360-progress"><span style="width:${deliveredPercent}%"></span></div>
    <div class="order-360-kpis">
      <div><span>ط¯ط§ط®ظ„ ط§ظ„ظ…طµط¨ط؛ط©</span><strong>${formatNumber(dyehouseBalance)}</strong></div>
      <div><span>ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ†</span><strong>${formatNumber(order.warehouseBalance || 0)}</strong></div>
      <div><span>ظ…طھط¨ظ‚ظٹ ظ„ظ„ط¹ظ…ظٹظ„</span><strong>${formatNumber(order.remainingToCustomer || 0)}</strong></div>
      <div><span>ط§ظ„ظ‡ط§ظ„ظƒ ط§ظ„ظپط¹ظ„ظٹ</span><strong>${formatNumber(order.totalWaste || 0)} (${formatNumber(order.totalWastePercent || 0, 1)}%)</strong></div>
    </div>
    <div class="order-360-alerts">${alerts.length ? alerts.map((alert)=>`<span>${escapeHtml(alert)}</span>`).join('') : '<span class="ok">ظ„ط§ طھظˆط¬ط¯ طھظ†ط¨ظٹظ‡ط§طھ ط­ط±ط¬ط© ط¹ظ„ظ‰ ظ‡ط°ط§ ط§ظ„ط·ظ„ط¨ ط­ط§ظ„ظٹظ‹ط§.</span>'}</div>
  </section>`;
}

function actualWastePercentForDisplay(row) {
  const waste = Number(row?.wasteQuantity || row?.totalWaste || 0);
  const finished = Number(row?.finishedReceived || row?.totalFinishedReceived || 0);
  if (waste > 0 && finished > 0) return roundNumber((waste / finished) * 100);
  return Number(row?.wastePercent || row?.totalWastePercent || 0);
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
        body.innerHTML = scopedOrderDetailAllocationRows(order).map((allocation) => {
          const sourceAllocation = allocation.sourceAllocation || allocation;
          const isReceiptDyehouse = String(sourceAllocation.dyehouse || order.dyehouse || '').trim() === String(allocation.scopedDyehouse || allocation.dyehouse || '').trim();
          const delivered = isReceiptDyehouse ? sum(customerBatches.filter((batch)=>batch.allocationId === sourceAllocation.id)) : 0;
          const sentGlue = isReceiptDyehouse ? sum(gluingBatches.filter((batch)=>batch.allocationId===sourceAllocation.id && batch.movement === 'sent')) : 0;
          const returnedGlue = isReceiptDyehouse ? sum(gluingBatches.filter((batch)=>batch.allocationId===sourceAllocation.id && batch.movement === 'return')) : 0;
          const balance = roundNumber(Number(allocation.finishedReceived || 0) - delivered - sentGlue + returnedGlue);
          const wasteLabel = `${formatNumber(allocation.wasteQuantity || 0)} (${formatNumber(actualWastePercentForDisplay(allocation), 1)}%)`;
          const scopedAccessoryParts = accessoryPlannedPartsForScopedQuantity(order, sourceAllocation, allocation.scopedQuantity || allocation.plannedQuantity || 0);
          const plannedCell = stockFlowCell(allocation.plannedQuantity || 0, scopedAccessoryParts);
          const sentCell = stockFlowCell(allocation.sentToDyehouse || 0, scopedAccessoryParts.length ? scopedAccessoryParts : accessoryFlowPartsForOrder(order, sourceAllocation, 'sent'));
          const deliveredCell = stockFlowCell(delivered || 0, accessoryFlowPartsForOrder(order, sourceAllocation, 'customer'));
          const balanceCell = stockFlowCell(balance || 0, accessoryBalancePartsForOrder(order, sourceAllocation));
          const transferSourceDyehouse = allocation.scopedDyehouse || allocation.dyehouse || sourceAllocation.dyehouse || order.dyehouse || '';
          const transferAvailableQuantity = Number(allocation.scopedQuantity || allocation.sentToDyehouse || allocation.plannedQuantity || 0);
          const transferAccessorySummary = scopedAccessoryParts.join(' + ');
          const actions = `<div class="batch-actions"><button class="mini-btn" data-edit-allocation="${sourceAllocation.id}">\u062a\u0639\u062f\u064a\u0644 \u0644\u0648\u0646</button><button class="mini-btn" data-transfer-allocation="${sourceAllocation.id}" data-transfer-source-dyehouse="${escapeHtml(transferSourceDyehouse)}" data-transfer-available-quantity="${escapeHtml(transferAvailableQuantity)}" data-transfer-accessory-summary="${escapeHtml(transferAccessorySummary)}">\u0646\u0642\u0644 \u0645\u0635\u0628\u063a\u0629</button>${canDeleteRecords() ? `<button class="mini-btn danger" data-delete-allocation="${sourceAllocation.id}">\u062d\u0630\u0641 \u0644\u0648\u0646</button>` : ''}</div>`;
          return `<tr><td>${escapeHtml(allocation.color || '-')}</td><td>${plannedCell}</td><td>${escapeHtml(allocation.dyehouse || order.dyehouse || '-')}</td><td>${escapeHtml(allocationWidthLabel(order, allocation))}</td><td>${escapeHtml(allocation.targetFinishedWeight || '-')}</td><td>${sentCell}</td><td>${deliveredCell}</td><td><strong>${balanceCell}</strong></td><td>${wasteLabel}</td><td>${actions}</td></tr>`;
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
  const rawItems = (()=>{ const outgoing = rawBatches.filter((batch)=>batch.orderId===order.id).map((batch)=>{ const widthLabel = rawDispatchLabel(order, batch.widthLineId); return { type:'raw', batch, label:movementLine('ط®ط±ظˆط¬ ط®ط§ظ… ظ„ظ„ظ…طµط¨ط؛ط©', batch.date, batch.quantity, batch.supplier || '-', widthLabel) + noteSuffix(batch) }; }); const returns = rawReturns.filter((batch)=>order.allocations.some((allocation)=>allocation.id===batch.allocationId)).map((batch)=>{ const allocation=order.allocations.find((item)=>item.id===batch.allocationId); return { type:'rawReturn', batch, label:movementLine('ظ…ط±طھط¬ط¹ ط®ط§ظ… ظ„ظ„ظ†ط³ظٹط¬', batch.date, allocationMovementLabel(order, allocation), batch.quantity) + noteSuffix(batch) }; }); const rows = outgoing.concat(returns).sort((a,b)=>String(b.batch.date||'').localeCompare(String(a.batch.date||''))); return rows.length ? rows.map((item)=>batchItemHtml(item.type, item.batch, item.label)).join('') : '<div class="empty-state">ظ„ط§ طھظˆط¬ط¯ ط¯ظپط¹ط§طھ ط¨ط¹ط¯.</div>'; })();
  const accessoryColor = (batch)=>order.allocations.find((item)=>item.id===batch.allocationId)?.color || batch.color || '-';
  const accessoryTypeOptions = order.accessoryLines.map((line)=>`<option value="${line.type}">${line.type}</option>`).join('');
  const accessoryAllocationLabel = (batch)=>{ const allocation=order.allocations.find((item)=>item.id===batch.allocationId); return allocation ? allocationMovementLabel(order, allocation) : accessoryColor(batch); };
  const transferAllocationLabel = (batch)=>{ const allocation=order.allocations.find((item)=>item.id===batch.allocationId) || order.allocations.find((item)=>item.color===batch.color && (item.dyehouse===batch.fromDyehouse || item.dyehouse===batch.toDyehouse)); return allocation ? allocationMovementLabel(order, allocation) : (batch.color || '-'); };
  const accessoryTypeSelect = `<select name="accessoryType" required><option value="">ط§ط®طھط± ظ†ظˆط¹ ط§ظ„ط¥ظƒط³ط³ظˆط§ط±</option>${accessoryTypeOptions}</select>`;
  const accessoryItems = listHtml(accessoryBatches.filter((batch)=>batch.orderId===order.id && batch.movement === 'sent'), (batch)=>batchItemHtml('accessory', batch, movementLine('ط®ط±ظˆط¬ ط¥ظƒط³ط³ظˆط§ط±', batch.date, batch.quantity, batch.accessoryType || order.accessoryLines[0]?.type || 'ط¥ظƒط³ط³ظˆط§ط±') + noteSuffix(batch)));
  const accessoryReceivedItems = listHtml(accessoryBatches.filter((batch)=>batch.orderId===order.id && batch.movement === 'received'), (batch)=>batchItemHtml('accessory', batch, movementLine('ط§ط³طھظ„ط§ظ… ط¥ظƒط³ط³ظˆط§ط±', batch.date, accessoryAllocationLabel(batch), batch.quantity, batch.accessoryType || 'ط¥ظƒط³ط³ظˆط§ط±') + noteSuffix(batch)));
  const productionItems = listHtml(productionBatches.filter((batch)=>order.allocations.some((allocation)=>allocation.id===batch.allocationId)), (batch)=>{ const allocation=order.allocations.find((item)=>item.id===batch.allocationId); return batchItemHtml('production', batch, movementLine('ط§ط³طھظ„ط§ظ… ظ…ط¬ظ‡ط²', batch.date, allocationMovementLabel(order, allocation), batch.quantity) + noteSuffix(batch)); });
  const customerItems = (()=>{ const cloth = customerBatches.filter((batch)=>order.allocations.some((allocation)=>allocation.id===batch.allocationId)).map((batch)=>{ const allocation=order.allocations.find((item)=>item.id===batch.allocationId); const label = allocation ? allocationColorLabel(order, allocation) : '-'; return { type:'customer', batch, label:movementLine('طھط³ظ„ظٹظ… ظ‚ظ…ط§ط´ ظ„ظ„ط¹ظ…ظٹظ„', batch.date, label, batch.quantity) }; }); const accessories = accessoryBatches.filter((batch)=>batch.orderId===order.id && batch.movement === 'customer').map((batch)=>{ const allocation=order.allocations.find((item)=>item.id===batch.allocationId); const label = allocation ? allocationColorLabel(order, allocation) : accessoryColor(batch); return { type:'accessory', batch, label:movementLine('طھط³ظ„ظٹظ… ط¥ظƒط³ط³ظˆط§ط± ظ„ظ„ط¹ظ…ظٹظ„', batch.date, label, batch.quantity, batch.accessoryType || order.accessoryLines[0]?.type || 'ط¥ظƒط³ط³ظˆط§ط±') + noteSuffix(batch) }; }); const rows = cloth.concat(accessories).sort((a,b)=>String(b.batch.date||'').localeCompare(String(a.batch.date||''))); return rows.length ? rows.map((item)=>batchItemHtml(item.type, item.batch, item.label)).join('') : '<div class="empty-state">ظ„ط§ طھظˆط¬ط¯ ط¯ظپط¹ط§طھ ط¨ط¹ط¯.</div>'; })();
  const transferItems = listHtml(dyehouseTransfers.filter((batch)=>batch.orderId===order.id), (batch)=>{ const transferTitle = transferRecordMode(batch) === 'accessory' ? 'ظ†ظ‚ظ„ ط®ط§ظ… ط¥ظƒط³ط³ظˆط§ط±' : 'طھط­ظˆظٹظ„ ظ…طµط¨ط؛ط©'; return batchItemHtml('transfer', batch, movementLine(transferTitle, batch.date, transferAllocationLabel(batch), batch.fromDyehouse || '-', batch.toDyehouse || '-', batch.quantity) + noteSuffix(batch)); });
  const rawReturnItems = listHtml(rawReturns.filter((batch)=>order.allocations.some((allocation)=>allocation.id===batch.allocationId)), (batch)=>{ const allocation=order.allocations.find((item)=>item.id===batch.allocationId); return batchItemHtml('rawReturn', batch, movementLine('ظ…ط±طھط¬ط¹ ط®ط§ظ… ظ„ظ„ظ†ط³ظٹط¬', batch.date, allocationMovementLabel(order, allocation), batch.quantity) + noteSuffix(batch)); });
  const stockRows = order.allocations.map((allocation)=>{ const delivered = sum(customerBatches.filter((batch)=>batch.allocationId===allocation.id)); const sentGlue = sum(gluingBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement === 'sent')); const returnedGlue = sum(gluingBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement === 'return')); const balance = roundNumber(Number(allocation.finishedReceived || 0) - delivered - sentGlue + returnedGlue); const widthInfo = allocationInchWidthLabel(order, allocation); return `<tr><td>${escapeHtml(allocation.color)}</td><td>${escapeHtml(widthInfo)}</td><td>${formatNumber(allocation.finishedReceived || 0)}</td><td>${formatNumber(delivered || 0)}</td><td><strong>${formatNumber(balance)}</strong></td></tr>`; }).join('');
  const accessoryStockRows = order.accessoryLines.length ? order.allocations.flatMap((allocation)=>order.accessoryLines.map((line)=>{ const received = sum(accessoryBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement==='received' && (batch.accessoryType || line.type) === line.type)); const delivered = sum(accessoryBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement==='customer' && (batch.accessoryType || line.type) === line.type)); const balance = roundNumber(received - delivered); return `<tr><td>${escapeHtml(allocation.color)}</td><td>${escapeHtml(line.type)}</td><td>${formatNumber(received || 0)}</td><td>${formatNumber(delivered || 0)}</td><td><strong>${formatNumber(balance)}</strong></td></tr>`; })).join('') : '';
  const stockFlowRows = order.allocations.map((allocation)=>{ const clothDelivered = sum(customerBatches.filter((batch)=>batch.allocationId===allocation.id)); const sentGlue = sum(gluingBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement === 'sent')); const returnedGlue = sum(gluingBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement === 'return')); const clothBalance = roundNumber(Number(allocation.finishedReceived || 0) - clothDelivered - sentGlue + returnedGlue); const accessorySentParts = accessoryFlowPartsForOrder(order, allocation, 'sent'); const accessoryReceivedParts = accessoryFlowPartsForOrder(order, allocation, 'received'); const accessoryDeliveredParts = accessoryFlowPartsForOrder(order, allocation, 'customer'); const accessoryBalanceParts = (order.accessoryLines || []).map((line)=>{ const received = sum(accessoryBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement==='received' && (batch.accessoryType || line.type) === line.type)); const delivered = sum(accessoryBatches.filter((batch)=>batch.allocationId===allocation.id && batch.movement==='customer' && (batch.accessoryType || line.type) === line.type)); const balance = roundNumber(received - delivered); return balance ? `${formatNumber(balance)} ${line.type}` : ''; }).filter(Boolean); return `<tr><td>${escapeHtml(allocation.color || '-')}</td><td>${stockFlowText(allocation.sentToDyehouse || 0, accessorySentParts)}</td><td>${stockFlowText(allocation.finishedReceived || 0, accessoryReceivedParts)}</td><td>${stockFlowText(clothDelivered || 0, accessoryDeliveredParts)}</td><td><strong>${stockFlowText(clothBalance || 0, accessoryBalanceParts)}</strong></td></tr>`; }).join('');
  const inventorySection = `<div class="subsection stock-flow-section"><div class="subsection-head"><div><h3>ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ† ط§ظ„ط­ط§ظ„ظٹ</h3><p class="eyebrow">ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ† ط­ط³ط¨ ط§ظ„طھط´ط؛ظٹظ„ ظˆط§ظ„طھط³ظ„ظٹظ…</p></div></div><div class="table-wrap"><table class="allocation-table"><thead><tr><th>ط§ظ„ظ„ظˆظ†</th><th>ط§ظ„ط¹ط±ط¶</th><th>ط¯ط®ظ„ ط§ظ„ظ…ط®ط²ظ†</th><th>طھط³ظ„ظٹظ… ط§ظ„ط¹ظ…ظٹظ„</th><th>ط§ظ„ط±طµظٹط¯ ط§ظ„ط­ط§ظ„ظٹ</th></tr></thead><tbody>${stockRows}</tbody></table></div>${order.accessoryLines.length ? `<div class="table-wrap"><table class="allocation-table"><thead><tr><th>ط§ظ„ظ„ظˆظ†</th><th>ط§ظ„ط¹ط±ط¶</th><th>ط¯ط®ظ„ ط§ظ„ظ…ط®ط²ظ†</th><th>طھط³ظ„ظٹظ… ط§ظ„ط¹ظ…ظٹظ„</th><th>ط§ظ„ط±طµظٹط¯ ط§ظ„ط­ط§ظ„ظٹ</th></tr></thead><tbody>${accessoryStockRows}</tbody></table></div>` : ''}</div>`;
  refs.orderDetailsPanel.innerHTML = `<div class="section-head"><div><p class="eyebrow">${escapeHtml(order.orderNumber)}</p><h2>${escapeHtml(order.customer)}</h2></div><div class="actions"><button class="mini-btn" id="editOrderBtn">طھط¹ط¯ظٹظ„ ط§ظ„ط·ظ„ط¨</button><button class="mini-btn ${order.operationClosed ? 'gold' : 'danger'}" id="toggleOperationClosedBtn">${order.operationClosed ? 'ط¥ط¹ط§ط¯ط© ظپطھط­ ط§ظ„طھط´ط؛ظٹظ„' : 'ط¥ط؛ظ„ط§ظ‚ ط¯ظˆط±ط© ط§ظ„طھط´ط؛ظٹظ„'}</button><span class="status ${order.status}">${statusLabel(order.status)}</span></div></div><h3>&#1605;&#1604;&#1582;&#1589; &#1583;&#1608;&#1585;&#1577; &#1575;&#1604;&#1578;&#1588;&#1594;&#1610;&#1604;</h3><div class="summary-grid"><div class="metric"><span>&#1573;&#1580;&#1605;&#1575;&#1604;&#1610; &#1575;&#1604;&#1582;&#1575;&#1605; &#1575;&#1604;&#1605;&#1591;&#1604;&#1608;&#1576;</span><strong>${order.totalRawOrdered}</strong></div><div class="metric"><span>&#1582;&#1585;&#1580; &#1605;&#1606; &#1575;&#1604;&#1606;&#1587;&#1610;&#1580; &#1573;&#1604;&#1609; &#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</span><strong>${order.totalRawReceived}</strong></div><div class="metric"><span>ط¯ط§ط®ظ„ ط§ظ„ظ…طµط¨ط؛ط©</span><strong>${order.rawAtDyehouseAvailable}</strong></div><div class="metric"><span>ظ…ط¬ظ‡ط² ط¯ط®ظ„ ط§ظ„ظ…ط®ط²ظ†</span><strong>${order.totalFinishedReceived}</strong></div><div class="metric emphasis"><span>ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ† / ط¬ط§ظ‡ط² ظ„ظ„طھط³ظ„ظٹظ…</span><strong>${order.warehouseBalance}</strong></div><div class="metric"><span>&#1578;&#1605; &#1578;&#1587;&#1604;&#1610;&#1605;&#1607; &#1604;&#1604;&#1593;&#1605;&#1610;&#1604;</span><strong>${order.totalDeliveredToCustomer}</strong></div><div class="metric"><span>ظ…ط±طھط¬ط¹ ط®ط§ظ… ظ„ظ„ظ†ط³ظٹط¬</span><strong>${order.totalRawReturnedToWeaving}</strong></div><div class="metric"><span>ظ‡ط§ظ„ظƒ طھظ‚ط¯ظٹط±ظٹ</span><strong>${order.expectedWasteQuantity} (${order.expectedWastePercent}%)</strong></div><div class="metric"><span>ظ‡ط§ظ„ظƒ ظپط¹ظ„ظٹ</span><strong>${order.totalWaste} (${formatNumber(order.totalWastePercent || 0, 1)}%)</strong></div></div>${order.widthMode === 'multiple' ? `<div class="subsection"><div class="subsection-head"><h3>طھظˆط²ظٹط¹ ط§ظ„ط¹ط±ظˆط¶</h3></div>${order.widthDistributionMatches ? '' : `<div class="warning">طھظ†ط¨ظٹظ‡: ظ…ط¬ظ…ظˆط¹ ط§ظ„ط¹ط±ظˆط¶ ظ„ط§ ظٹط·ط§ط¨ظ‚ ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط·ظ„ط¨</div>`}<div class="table-wrap"><table class="allocation-table"><thead><tr><th>ط§ظ„ط¨ظˆطµط©</th><th>ط§ظ„ط¹ط±ط¶</th><th>ط§ظ„ظƒظ…ظٹط©</th></tr></thead><tbody>${order.widthLines.map((item)=>`<tr><td>${item.inch}</td><td>${item.width}</td><td>${item.quantity}</td></tr>`).join('')}</tbody></table></div></div>` : ''}<div class="subsection"><div class="subsection-head"><div><h3>&#1582;&#1591;&#1577; &#1578;&#1608;&#1586;&#1610;&#1593; &#1575;&#1604;&#1571;&#1604;&#1608;&#1575;&#1606;</h3><p class="eyebrow">${order.totalAllocated} / ${order.totalRawReceived} ظƒط¬ظ… ظ…ظ† ط§ظ„ط®ط§ظ… ط§ظ„ط®ط§ط±ط¬ ظ„ظ„ظ…طµط¨ط؛ط©</p></div><button class="mini-btn" id="addAllocationBtn">+ &#1573;&#1590;&#1575;&#1601;&#1577; &#1604;&#1608;&#1606;</button></div><div class="allocation-bar"><div class="allocation-fill" style="width:${allocationPercent}%"></div></div>${order.allocationExceedsRaw ? `<div class="warning">ظƒظ…ظٹط© ط§ظ„طµط¨ط§ط؛ط© ط§ظ„ظ…ط®ط·ط·ط© ط£ظƒط¨ط± ظ…ظ† ظƒظ…ظٹط© ط§ظ„ط®ط§ظ… ط§ظ„ط®ط§ط±ط¬ ظ„ظ„ظ…طµط¨ط؛ط©</div>` : ''}<div class="table-wrap"><table class="allocation-table"><thead><tr><th>&#1575;&#1604;&#1604;&#1608;&#1606;</th><th>&#1575;&#1604;&#1605;&#1582;&#1591;&#1591;</th><th>&#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</th><th>&#1575;&#1604;&#1593;&#1585;&#1590;</th><th>&#1575;&#1604;&#1608;&#1586;&#1606; &#1605;&#1580;&#1607;&#1586;</th>${order.accessoryLines.length ? `<th>${accessoryTypesLabel(order)}</th>` : ''}<th>&#1578;&#1605; &#1578;&#1588;&#1594;&#1610;&#1604;&#1607;</th><th>&#1583;&#1582;&#1604; &#1575;&#1604;&#1605;&#1582;&#1586;&#1606;</th><th>ظ‡ط§ظ„ظƒ طھظ‚ط¯ظٹط±ظٹ</th><th>ظ‡ط§ظ„ظƒ ظپط¹ظ„ظٹ</th><th>ط¥ط¬ط±ط§ط،</th></tr></thead><tbody>${order.allocations.map((allocation)=>`<tr><td>${escapeHtml(allocation.color)}</td><td>${allocation.plannedQuantity}</td><td>${escapeHtml(allocation.dyehouse)}</td><td>${escapeHtml(allocationWidthLabel(order, allocation))}</td><td>${allocation.targetFinishedWeight}</td>${order.accessoryLines.length ? `<td>${allocation.accessoryQuantity}</td>` : ''}<td>${allocation.sentToDyehouse}</td><td>${allocation.finishedReceived}</td><td>${allocation.expectedWasteQuantity || 0} (${allocation.expectedWastePercent || 0}%)</td><td>${allocation.wasteQuantity} (${formatNumber(actualWastePercentForDisplay(allocation), 1)}%)</td><td><div class="batch-actions"><button class="mini-btn" data-edit-allocation="${allocation.id}">&#1578;&#1593;&#1583;&#1610;&#1604;</button><button class="mini-btn" data-transfer-allocation="${allocation.id}">&#1606;&#1602;&#1604; &#1605;&#1589;&#1576;&#1594;&#1577;</button>${canDeleteRecords() ? `<button class="mini-btn danger" data-delete-allocation="${allocation.id}">&#1581;&#1584;&#1601;</button>` : ''}</div></td></tr>`).join('')}</tbody></table></div></div>${inventorySection}<div class="batch-grid compact"><div class="batch-box"><h3>ط®ط±ظˆط¬ ط®ط§ظ…</h3><form class="batch-form" data-form="raw"><select name="movementKind" class="full"><option value="out">ط®ط±ظˆط¬ ط®ط§ظ… ظ„ظ„ظ…طµط¨ط؛ط©</option><option value="return">ط§ط±طھط¬ط§ط¹ ط®ط§ظ… ظ„ظ„ظ†ط³ظٹط¬</option></select><input name="date" type="date" required>${order.widthMode === 'multiple' ? `<select name="widthLineId" data-out-only><option value="">ط§ط®طھط± ط§ظ„ط¹ط±ط¶ ط¹ظ†ط¯ ط®ط±ظˆط¬ ط§ظ„ط®ط§ظ…</option>${order.widthLines.map((item)=>`<option value="${item.id}">ط¨ظˆطµط© ${item.inch} - ط¹ط±ط¶ ${item.width} - ظƒظ…ظٹط© ${item.quantity}</option>`).join('')}</select>` : ''}<select name="allocationId" data-return-only class="field-hidden"><option value="">ط§ط®طھط± ط§ظ„ظ„ظˆظ† / ط§ظ„ظ…طµط¨ط؛ط© ظ„ظ„ظ…ط±طھط¬ط¹</option>${order.allocations.map((allocation)=>`<option value="${allocation.id}">${allocationOptionLabel(order, allocation)}</option>`).join('')}</select><input name="quantity" type="number" step="0.01" placeholder="ط§ظ„ظƒظ…ظٹط©" required><input name="supplier" placeholder="ظ…طµط¯ط± ط§ظ„ظ†ط³ظٹط¬" value="${escapeHtml(order.weavingSource)}"><input name="noteNumber" placeholder="ط±ظ‚ظ… ط¥ط°ظ†"><input class="full" name="notes" placeholder="ظ…ظ„ط§ط­ط¸ط§طھ"><label class="full batch-file-label" data-out-only><span>طµظˆط±ط© ط¥ط°ظ† ط§ظ„ط®ط§ظ…</span><input name="sourceDocumentFile" type="file" accept="image/*"></label><button class="mini-btn full">ط¥ط¶ط§ظپط© ط­ط±ظƒط©</button></form><div class="batch-list">${rawItems}</div></div>${order.accessoryLines.length ? `<div class="batch-box"><h3>ط®ط±ظˆط¬ ط¥ظƒط³ط³ظˆط§ط±</h3><form class="batch-form" data-form="accessory"><input name="date" type="date" required>${accessoryTypeSelectHtml(order)}<input name="quantity" type="number" step="0.01" placeholder="ط§ظ„ظƒظ…ظٹط©" required><input name="noteNumber" placeholder="ط±ظ‚ظ… ط¥ط°ظ†"><input class="full" name="notes" placeholder="ظ…ظ„ط§ط­ط¸ط§طھ"><button class="mini-btn full">ط¥ط¶ط§ظپط© ط®ط±ظˆط¬</button></form><div class="batch-list">${accessoryItems}</div></div><div class="batch-box"><h3>ط§ط³طھظ„ط§ظ… ط¥ظƒط³ط³ظˆط§ط±</h3><form class="batch-form" data-form="accessoryReceived"><input name="date" type="date" required>${accessoryTypeSelectHtml(order)}<select name="allocationId" required><option value="">ط§ط®طھط± ط§ظ„ظ„ظˆظ†</option>${order.allocations.map((allocation)=>`<option value="${allocation.id}">${allocationColorLabel(order, allocation)}</option>`).join('')}</select><input name="quantity" type="number" step="0.01" placeholder="ط§ظ„ظƒظ…ظٹط© ط§ظ„ظ…ط³طھظ„ظ…ط©" required><input name="noteNumber" placeholder="ط±ظ‚ظ… ط¥ط°ظ†"><input class="full" name="notes" placeholder="ظ…ظ„ط§ط­ط¸ط§طھ"><button class="mini-btn full">ط¥ط¶ط§ظپط© ط§ط³طھظ„ط§ظ…</button></form><div class="batch-list">${accessoryReceivedItems}</div></div>` : ''}<div class="batch-box"><h3>ط§ط³طھظ„ط§ظ… ظ…ط¬ظ‡ط²</h3><form class="batch-form" data-form="production"><select name="allocationId"><option value="raw">&#1575;&#1582;&#1578;&#1585; &#1575;&#1604;&#1604;&#1608;&#1606; / &#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</option>${order.allocations.map((allocation)=>`<option value="${allocation.id}">${allocationOptionLabel(order, allocation)}</option>`).join('')}</select><input name="date" type="date" required><input name="quantity" type="number" step="0.01" placeholder="&#1575;&#1604;&#1603;&#1605;&#1610;&#1577; &#1575;&#1604;&#1605;&#1587;&#1578;&#1604;&#1605;&#1577;" required><input name="noteNumber" placeholder="&#1585;&#1602;&#1605; &#1573;&#1584;&#1606; &#1575;&#1604;&#1575;&#1587;&#1578;&#1604;&#1575;&#1605;"><input class="full" name="notes" placeholder="&#1605;&#1604;&#1575;&#1581;&#1592;&#1575;&#1578;"><button class="mini-btn full">&#1573;&#1590;&#1575;&#1601;&#1577; &#1575;&#1587;&#1578;&#1604;&#1575;&#1605;</button></form><div class="batch-list">${productionItems}</div></div><div class="batch-box"><h3>طھط³ظ„ظٹظ… ط¹ظ…ظٹظ„</h3><form class="batch-form" data-form="customer"><select name="movementKind" class="full"><option value="cloth">طھط³ظ„ظٹظ… ظ‚ظ…ط§ط´</option>${order.accessoryLines.length ? '<option value="accessory">طھط³ظ„ظٹظ… ط¥ظƒط³ط³ظˆط§ط±</option>' : ''}</select><select name="allocationId">${order.allocations.map((allocation)=>`<option value="${allocation.id}">${allocationColorLabel(order, allocation)}</option>`).join('')}</select><input name="date" type="date" required>${order.accessoryLines.length ? `<span data-accessory-only class="field-hidden">${accessoryTypeSelectHtml(order)}</span>` : ''}<input name="quantity" type="number" step="0.01" placeholder="&#1575;&#1604;&#1603;&#1605;&#1610;&#1577;" required><input class="full" name="notes" placeholder="&#1605;&#1604;&#1575;&#1581;&#1592;&#1575;&#1578;"><button class="mini-btn full">&#1573;&#1590;&#1575;&#1601;&#1577; &#1581;&#1585;&#1603;&#1577;</button></form><div class="batch-list">${customerItems}</div></div><div class="batch-box"><h3>&#1578;&#1581;&#1608;&#1610;&#1604;&#1575;&#1578; &#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</h3><p class="eyebrow">&#1578;&#1587;&#1580;&#1610;&#1604; &#1571;&#1610; &#1606;&#1602;&#1604; &#1605;&#1606; &#1605;&#1589;&#1576;&#1594;&#1577; &#1604;&#1571;&#1582;&#1585;&#1609; &#1576;&#1583;&#1608;&#1606; &#1601;&#1602;&#1583;&#1575;&#1606; &#1575;&#1604;&#1578;&#1575;&#1585;&#1610;&#1582;.</p><div class="batch-list">${transferItems}</div></div></div>`;
  const hasMixedClothAndAccessory = order.accessoryLines.length > 0 && Number(order.totalRawOrdered || order.totalRawQuantity || 0) > 0;
  refs.orderDetailsPanel.querySelector('.section-head')?.insertAdjacentHTML('afterend', order360Html(order));
  if (hasMixedClothAndAccessory) {
    const combinedInventorySectionHtml = `<div class="subsection stock-flow-section"><div class="subsection-head"><div><h3>ط±طµظٹط¯ ط§ظ„ظ‚ظ…ط§ط´ ظˆط§ظ„ط¥ظƒط³ط³ظˆط§ط±</h3><p class="eyebrow">ظ…طھط§ط¨ط¹ط© ظ…ظˆط­ط¯ط©: ط§ظ„ظ‚ظ…ط§ط´ ظˆظ…ط¹ظ‡ ط§ظ„ط¥ظƒط³ط³ظˆط§ط± ط§ظ„ظ…ط±طھط¨ط· ط¨ظƒظ„ ظ„ظˆظ†.</p></div></div><div class="table-wrap"><table class="allocation-table stock-flow-table"><thead><tr><th>ط§ظ„ظ„ظˆظ†</th><th>ظ…ط±ط³ظ„ ظ„ظ„ظ…طµط¨ط؛ط©</th><th>ط¯ط®ظ„ ط§ظ„ظ…ط®ط²ظ†</th><th>طھط³ظ„ظٹظ… ط§ظ„ط¹ظ…ظٹظ„</th><th>ط§ظ„ط±طµظٹط¯ ط§ظ„ط­ط§ظ„ظٹ</th></tr></thead><tbody>${stockFlowRows}</tbody></table></div></div>`;
    const batchGrid = refs.orderDetailsPanel.querySelector('.batch-grid.compact');
    const oldInventorySection = batchGrid?.previousElementSibling;
    if (oldInventorySection?.classList?.contains('subsection')) {
      oldInventorySection.replaceWith(document.createRange().createContextualFragment(combinedInventorySectionHtml));
    }
  }
  if (Number(order.gluingBalance || 0) > 0 || Number(order.gluedProductBalance || 0) > 0) {
    refs.orderDetailsPanel.querySelector('.summary-grid')?.insertAdjacentHTML('beforeend', `<div class="metric"><span>ظˆط§ظ‚ظپ ظپظٹ ط¯ظ…ط¬ ط§ظ„ط®ط§ظ…ط§طھ</span><strong>${formatNumber(order.gluingBalance || 0)}</strong></div><div class="metric"><span>ظ…ظ†طھط¬ ظ…ط¯ظ…ط¬ ط¬ط§ظ‡ط² ظ„ظ„طھط³ظ„ظٹظ…</span><strong>${formatNumber(order.gluedProductBalance || 0)}</strong></div>`);
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
      select.options.add(new Option('ظ…ط±طھط¬ط¹ ظ‚ظ…ط§ط´ ظ…ظ† ط§ظ„ط¹ظ…ظٹظ„', 'clothReturn'), 1);
    }
    if (order.accessoryLines.length && ![...select.options].some((option)=>option.value === 'accessoryReturn')) {
      select.options.add(new Option('ظ…ط±طھط¬ط¹ ط¥ظƒط³ط³ظˆط§ط± ظ…ظ† ط§ظ„ط¹ظ…ظٹظ„', 'accessoryReturn'));
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
      await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط­ط§ظ„ط© ط¯ظˆط±ط© ط§ظ„طھط´ط؛ظٹظ„ ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„طھط¹ط¯ظٹظ„.');
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
  if (refs.widthMode.value === 'multiple' && widthLines.length === 0) { alert('ط£ط¶ظپ ط¹ط±ط¶ظ‹ط§ ظˆط§ط­ط¯ظ‹ط§ ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„ ط¹ظ†ط¯ ط§ط®طھظٹط§ط± ط£ظƒط«ط± ظ…ظ† ط¹ط±ط¶.'); return; }
  const currentOrder = editingOrderId ? orders.find((order)=>order.id === editingOrderId) : null;
  const accessoryLines = readAccessoryLinesFromEditor();
  const firstAccessory = accessoryLines[0] || {};
  const paymentTerms = composePaymentTerms(refs.paymentMode?.value, refs.paymentDetails?.value);
  if (refs.paymentTerms) refs.paymentTerms.value = paymentTerms;
  const payloadOperationNotes = currentOrder?.operationNotes && typeof currentOrder.operationNotes === 'object' && !Array.isArray(currentOrder.operationNotes)
    ? { ...currentOrder.operationNotes, dyeingStages: undefined }
    : {};
  const payload = { pricingId: currentOrder?.pricingId || pendingConvertedPricingId || '', orderNumber:refs.orderNumber.value, productCode:buildItemCode(refs.orderNumber.value), customer:canonicalCustomerName(refs.customer.value), orderDate:refs.orderDate.value, fabricType:canonicalFabricName(refs.fabricType.value), totalRawQuantity:+refs.totalRawQuantity.value, expectedWastePercent:+refs.expectedWastePercent.value || 0, widthMode:refs.widthMode.value, inchWidth:refs.inchWidth.value, widthLines, kiloPrice:+refs.kiloPrice.value, rawCost:orderRawCost({ ...currentOrder, orderNumber:refs.orderNumber.value }), paymentTerms, accessoryType:firstAccessory.type || refs.accessoryType.value, accessoryPercent:+(firstAccessory.percent ?? refs.accessoryPercent.value) || 0, accessoryLines, dyehouse:refs.dyehouse.value, weavingSource:refs.weavingSource.value, notes:refs.orderNotes.value, operationNotes: payloadOperationNotes };
  const convertedDraftItems = !editingOrderId && refs.widthMode.value !== 'multiple' && pendingConvertedOrderDrafts.length > 1 ? pendingConvertedOrderDrafts : [];
  const groupedItems = !editingOrderId && refs.widthMode.value !== 'multiple'
    ? (convertedDraftItems.length ? convertedDraftItems : readGroupedOrderItems()).map((item)=>({ ...item, fabricType:canonicalFabricName(item.fabricType) }))
    : [];
  const hasGroupedOrderItems = groupedItems.length > 1;
  const groupedSourcePricingId = hasGroupedOrderItems ? payload.pricingId : '';
  if (hasGroupedOrderItems) {
    const incomplete = groupedItems.find((item)=>!item.fabricType || !(item.totalRawQuantity > 0));
    if (incomplete) { alert('ط±ط§ط¬ط¹ ط£طµظ†ط§ظپ ط§ظ„ط·ظ„ط¨ ط§ظ„ظ…ط¬ظ…ط¹: ظƒظ„ طµظ†ظپ ظٹط¬ط¨ ط£ظ† ظٹط­طھظˆظٹ ط¹ظ„ظ‰ ط§ط³ظ… طµظ†ظپ ظˆظƒظ…ظٹط©.'); return; }
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
      await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ طھط¹ط¯ظٹظ„ ط§ظ„ط·ظ„ط¨ ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„طھط¹ط¯ظٹظ„.');
      return;
    }
    if (!(await verifyOrderPersisted(editingOrderId, payload))) {
      await rollbackAfterBackendWriteFailure('طھظ… ط¥ط±ط³ط§ظ„ طھط¹ط¯ظٹظ„ ط§ظ„ط·ظ„ط¨ ظ„ظƒظ† ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¥ظƒط³ط³ظˆط§ط±ط§طھ ظ„ظ… طھط±ط¬ط¹ ظ…ظ† ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„طھط¹ط¯ظٹظ„.');
      return;
    }
    const changedAllocations = updatedAllocations.filter((allocation) => {
      const original = allocations.find((item)=>item.id === allocation.id);
      return original && original.dyehouse !== allocation.dyehouse;
    });
    for (const allocation of changedAllocations) {
      const savedAllocation = await putBackend(`/allocations/${allocation.id}`, allocationToApi(allocation));
      if (backendSaveRequired && !savedAllocation) {
        await rollbackAfterBackendWriteFailure('طھظ… ط­ظپط¸ ط§ظ„ط·ظ„ط¨طŒ ظ„ظƒظ† طھط¹ط°ط± طھط­ط¯ظٹط« ظ…طµط¨ط؛ط© ط§ظ„ط£ظ„ظˆط§ظ† ط§ظ„ظ…ط±طھط¨ط·ط© ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„طھط¹ط¯ظٹظ„ ظƒط§ظ…ظ„ظ‹ط§.');
        return;
      }
    }
    selectedOrderId = editingOrderId;
  } else {
    if (hasGroupedOrderItems) {
      const groupedOrders = groupedItems.map((item, index)=> {
        const pricingItem = pendingConvertedPricingItems[index] || {};
        const pricingDraft = pendingConvertedOrderDrafts[index] || pricingItemToOrderDraft(pricingItem, {});
        const groupedAccessoryLines = pricingDraft.accessoryLines || [];
        const firstGroupedAccessory = groupedAccessoryLines[0] || {};
        const groupedPayload = {
          ...payload,
          pricingId:index === 0 ? groupedSourcePricingId : '',
          fabricType:item.fabricType,
          totalRawQuantity:item.totalRawQuantity,
          expectedWastePercent:item.expectedWastePercent || pricingDraft.expectedWastePercent || payload.expectedWastePercent,
          inchWidth:item.inchWidth || pricingDraft.inchWidth || payload.inchWidth,
          kiloPrice:item.kiloPrice || pricingDraft.kiloPrice || payload.kiloPrice,
          rawCost:pricingDraft.rawCost || payload.rawCost,
          widthMode:'single',
          widthLines:[],
          productCode:buildItemCode(payload.orderNumber),
          dyehouse:item.dyehouse || pricingDraft.dyehouse || payload.dyehouse,
          weavingSource:item.weavingSource || pricingDraft.weavingSource || payload.weavingSource,
          accessoryType:firstGroupedAccessory.type || '',
          accessoryPercent:Number(firstGroupedAccessory.percent || 0),
          accessoryLines:groupedAccessoryLines,
          operationNotes:{},
        };
        return { id:uid(), status:'pending', ...groupedPayload };
      });
      let savedGroupedOrders = null;
      try {
        savedGroupedOrders = await postBackendStrict('/orders/bulk', { orders: groupedOrders.map((order)=>orderToApi(order, backendCustomer)) });
      } catch (error) {
        alert(error.message || 'طھط¹ط°ط± ط­ظپط¸ ط§ظ„ط·ظ„ط¨ ط§ظ„ظ…ط¬ظ…ط¹.');
        return;
      }
      if (backendSaveRequired && (!Array.isArray(savedGroupedOrders) || savedGroupedOrders.length !== groupedOrders.length)) {
        await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط§ظ„ط·ظ„ط¨ ط§ظ„ظ…ط¬ظ…ط¹ ط¨ط§ظ„ظƒط§ظ…ظ„ ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„طھط³ط¬ظٹظ„.');
        return;
      }
      const pricingMarked = await markPricingConverted(payload.orderNumber, savedGroupedOrders[0]?.id || groupedOrders[0]?.id, groupedSourcePricingId);
      if (backendSaveRequired && !pricingMarked) {
        await rollbackAfterBackendWriteFailure('طھط¹ط°ط± طھط­ط¯ظٹط« ط­ط§ظ„ط© ط§ظ„طھط³ط¹ظٹط±ط© ط¨ط¹ط¯ ط­ظپط¸ ط§ظ„ط·ظ„ط¨ ط§ظ„ظ…ط¬ظ…ط¹. ط±ط§ط¬ط¹ ط§ظ„ط·ظ„ط¨ ظˆط§ظ„طھط³ط¹ظٹط±ط© ظ‚ط¨ظ„ ط§ظ„ظ…طھط§ط¨ط¹ط©.');
        return;
      }
      selectedOrderId = savedGroupedOrders[0]?.id || groupedOrders[0]?.id || null;
      editingOrderId = null;
      setOrderFormPricingConversionMode(false);
      pendingConvertedPricingId = null;
      pendingConvertedPricingItems = [];
      pendingConvertedOrderDrafts = [];
      await loadBackendData();
      refs.orderDialog.close();
      return;
    }
    const newOrder = { id:uid(), status:'pending', ...payload };
    const savedOrder = await postBackend('/orders', orderToApi(newOrder, backendCustomer));
    if (backendSaveRequired && !savedOrder) {
      await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط§ظ„ط·ظ„ط¨ ط§ظ„ط¬ط¯ظٹط¯ ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ط·ظ„ط¨.');
      return;
    }
    if (!(await verifyOrderPersisted(savedOrder.id || newOrder.id, payload))) {
      await rollbackAfterBackendWriteFailure('طھظ… ط¥ط±ط³ط§ظ„ ط§ظ„ط·ظ„ط¨ ظ„ظƒظ† ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¥ظƒط³ط³ظˆط§ط±ط§طھ ظ„ظ… طھط±ط¬ط¹ ظ…ظ† ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ط·ظ„ط¨.');
      return;
    }
    selectedOrderId = savedOrder.id || newOrder.id;
    const pricingMarked = await markPricingConverted(payload.orderNumber, newOrder.id, payload.pricingId);
    if (backendSaveRequired && !pricingMarked) {
      await rollbackAfterBackendWriteFailure('طھظ… ط­ظپط¸ ط§ظ„ط·ظ„ط¨طŒ ظ„ظƒظ† طھط¹ط°ط± طھط­ط¯ظٹط« ط­ط§ظ„ط© ط§ظ„طھط³ط¹ظٹط±ط© ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ط±ط§ط¬ط¹ ط§ظ„ط·ظ„ط¨ ظˆط§ظ„طھط³ط¹ظٹط±ط© ظ‚ط¨ظ„ ط§ظ„ظ…طھط§ط¨ط¹ط©.');
      return;
    }
  }
  editingOrderId = null;
  setOrderFormPricingConversionMode(false);
  pendingConvertedPricingId = null;
  pendingConvertedPricingItems = [];
  pendingConvertedOrderDrafts = [];
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
      if (!data.allocationId) { alert('ط§ط®طھط± ط§ظ„ظ„ظˆظ† / ط§ظ„ظ…طµط¨ط؛ط© ظ‚ط¨ظ„ طھط³ط¬ظٹظ„ ظ…ط±طھط¬ط¹ ط§ظ„ط®ط§ظ….'); return; }
      backendResult = await postBackend('/batches/raw-return', { ...batchToApi(data), reason:data.reason || data.notes || '' });
    } else {
      if (rawDispatchOptions(currentOrder).length && !data.widthLineId) { alert('ط§ط®طھط± ط§ظ„ط¹ط±ط¶ / ط§ظ„ط¨ظ†ط¯ ط§ظ„ظ…ط±طھط¨ط· ظ‚ط¨ظ„ طھط³ط¬ظٹظ„ ط®ط±ظˆط¬ ط§ظ„ط®ط§ظ….'); return; }
      if (rawDocumentFile) data.sourceDocument = { type:'raw-batch-image', image: await resizeSlipImage(rawDocumentFile) };
      backendResult = await postBackend('/batches/dyehouse', batchToApi(data));
    }
  }
  if (type === 'rawReturn') {
    if (!data.allocationId) { alert('ط§ط®طھط± ط§ظ„ظ„ظˆظ† / ط§ظ„ظ…طµط¨ط؛ط© ظ‚ط¨ظ„ طھط³ط¬ظٹظ„ ظ…ط±طھط¬ط¹ ط§ظ„ط®ط§ظ….'); return; }
    backendResult = await postBackend('/batches/raw-return', { ...batchToApi(data), reason:data.reason || data.notes || '' });
  }
  if (type === 'accessory') {
    if (!data.accessoryType) { alert('ط§ط®طھط± ظ†ظˆط¹ ط§ظ„ط¥ظƒط³ط³ظˆط§ط± ط£ظˆظ„ظ‹ط§.'); return; }
    data.movement = 'sent'; delete data.allocationId;
    backendResult = await postBackend('/batches/accessory', batchToApi(data));
  }
  if (type === 'accessoryReceived') {
    if (!data.accessoryType) { alert('ط§ط®طھط± ظ†ظˆط¹ ط§ظ„ط¥ظƒط³ط³ظˆط§ط± ط£ظˆظ„ظ‹ط§.'); return; }
    if (!data.allocationId) { alert('ط§ط®طھط± ط§ظ„ظ„ظˆظ† ط§ظ„ظ…ط±طھط¨ط· ط¨ط§ط³طھظ„ط§ظ… ط§ظ„ط¥ظƒط³ط³ظˆط§ط±.'); return; }
    data.movement = 'received';
    backendResult = await postBackend('/batches/accessory', batchToApi(data));
  }
  if (type === 'production') {
    if (!data.allocationId || data.allocationId === 'raw') { alert('ط§ط®طھط± ط§ظ„ظ„ظˆظ† / ط§ظ„ظ…طµط¨ط؛ط© ظ‚ط¨ظ„ طھط³ط¬ظٹظ„ ط§ط³طھظ„ط§ظ… ط§ظ„ظ…ط¬ظ‡ط².'); return; }
    backendResult = await postBackend('/batches/finished', batchToApi(data));
  }
  if (type === 'gluing') {
    data.movement = ['return', 'received', 'customer'].includes(data.movementKind) ? data.movementKind : 'sent';
    if (data.movement === 'sent' || data.movement === 'return') {
      if (!data.allocationId) { alert('ط§ط®طھط± ط§ظ„ظ„ظˆظ† / ط§ظ„ط®ط§ظ…ط© ط§ظ„ظ…طµط¯ط± ظ‚ط¨ظ„ طھط³ط¬ظٹظ„ ط­ط±ظƒط© ط§ظ„ط¯ظ…ط¬.'); return; }
      if (!String(data.noteNumber || '').trim()) { alert('ط§ظƒطھط¨ ط±ظ‚ظ… ط¹ظ…ظ„ظٹط© ط§ظ„ط¯ظ…ط¬ ط­طھظ‰ طھط¸ظ‡ط± ط§ظ„ط®ط§ظ…ط© ط¯ط§ط®ظ„ ظ‚ط§ط¦ظ…ط© ط¯ظ…ط¬ ط§ظ„ط®ط§ظ…ط§طھ ط§ظ„ظ…ط³طھظ‚ظ„ط©.'); return; }
      const allocation = calculateAllocation(allocations.find((item)=>item.id===data.allocationId));
      const delivered = sum(customerBatches.filter((batch)=>batch.allocationId===data.allocationId));
      const sentToGluing = sum(gluingBatches.filter((batch)=>batch.allocationId===data.allocationId && batch.movement === 'sent'));
      const returnedFromGluing = sum(gluingBatches.filter((batch)=>batch.allocationId===data.allocationId && batch.movement === 'return'));
      if (data.movement === 'sent') {
        const available = Math.max(Number(allocation.finishedReceived || 0) - delivered - sentToGluing + returnedFromGluing, 0);
        if (data.quantity > available) data.notes = [data.notes, 'طھظ†ط¨ظٹظ‡: ظƒظ…ظٹط© ط§ظ„ط¯ظ…ط¬ ط£ظƒط¨ط± ظ…ظ† ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ† ط§ظ„ظ…طھط§ط­'].filter(Boolean).join(' - ');
      } else {
        const availableAtGluing = Math.max(sentToGluing - returnedFromGluing, 0);
        if (data.quantity > availableAtGluing) data.notes = [data.notes, 'طھظ†ط¨ظٹظ‡: ط§ظ„ظ…ط±طھط¬ط¹ ط£ظƒط¨ط± ظ…ظ† ط±طµظٹط¯ ط§ظ„ط®ط§ظ…ط© ظپظٹ ط§ظ„ط¯ظ…ط¬'].filter(Boolean).join(' - ');
      }
    } else {
      delete data.allocationId;
      if (!data.outputName) { alert('ط§ظƒطھط¨ ط§ط³ظ… ط§ظ„ظ…ظ†طھط¬ ط§ظ„ظ†ط§طھط¬.'); return; }
      if (data.movement === 'customer' && !data.customerName) { alert('ط§ظƒطھط¨ ط§ط³ظ… ط§ظ„ط¹ظ…ظٹظ„ ظ‚ط¨ظ„ طھط³ظ„ظٹظ… ط§ظ„ظ…ظ†طھط¬ ط§ظ„ظ†ط§طھط¬.'); return; }
      if (data.movement === 'customer') {
        const received = sum(gluingBatches.filter((batch)=>batch.orderId===selectedOrderId && batch.movement === 'received' && normalizeForCompare(batch.outputName) === normalizeForCompare(data.outputName)));
        const delivered = sum(gluingBatches.filter((batch)=>batch.orderId===selectedOrderId && batch.movement === 'customer' && normalizeForCompare(batch.outputName) === normalizeForCompare(data.outputName)));
        if (data.quantity > Math.max(received - delivered, 0)) data.notes = [data.notes, 'طھظ†ط¨ظٹظ‡: ظƒظ…ظٹط© ط§ظ„طھط³ظ„ظٹظ… ط£ظƒط¨ط± ظ…ظ† ط±طµظٹط¯ ط§ظ„ظ…ظ†طھط¬ ط§ظ„ظ†ط§طھط¬'].filter(Boolean).join(' - ');
      }
    }
    backendResult = await postBackend('/batches/gluing', batchToApi(data));
  }
  if (type === 'finished') {
    const allocation = calculateAllocation(allocations.find((item)=>item.id===data.allocationId));
    if (data.quantity > allocation.remainingAtDyehouse) { data.notes = [data.notes, 'طھظ†ط¨ظٹظ‡: ط§ظ„ظƒظ…ظٹط© ط§ظ„ظ…ط³طھظ„ظ…ط© ط£ظƒط¨ط± ظ…ظ† ط§ظ„ظ…طھط¨ظ‚ظٹ ط¯ط§ط®ظ„ ط§ظ„ظ…طµط¨ط؛ط©'].filter(Boolean).join(' - '); }
    data.finishedWidth = +data.finishedWidth; data.finishedWeight = +data.finishedWeight;
    backendResult = await postBackend('/batches/finished', batchToApi(data));
  }
  if (type === 'customer') {
    if (data.movementKind === 'accessory' || data.movementKind === 'accessoryReturn') {
      if (!data.accessoryType) { alert('ط§ط®طھط± ظ†ظˆط¹ ط§ظ„ط¥ظƒط³ط³ظˆط§ط± ط£ظˆظ„ظ‹ط§.'); return; }
      if (!data.allocationId) { alert('ط§ط®طھط± ط§ظ„ظ„ظˆظ† ط§ظ„ظ…ط±طھط¨ط· ط¨طھط³ظ„ظٹظ… ط§ظ„ط¥ظƒط³ط³ظˆط§ط±.'); return; }
      const isAccessoryReturn = data.movementKind === 'accessoryReturn';
      data.movement = 'customer';
      const receivedAccessory = sum(accessoryBatches.filter((batch)=>batch.allocationId===data.allocationId && batch.movement==='received' && batch.accessoryType===data.accessoryType));
      const deliveredAccessory = sum(accessoryBatches.filter((batch)=>batch.allocationId===data.allocationId && batch.movement==='customer' && batch.accessoryType===data.accessoryType));
      const availableAccessory = Math.max(receivedAccessory - deliveredAccessory, 0);
      if (isAccessoryReturn) {
        const returnQuantity = Math.abs(Number(data.quantity || 0));
        if (returnQuantity > Math.max(deliveredAccessory, 0)) data.notes = [data.notes, 'طھظ†ط¨ظٹظ‡: ظƒظ…ظٹط© ظ…ط±طھط¬ط¹ ط§ظ„ط¥ظƒط³ط³ظˆط§ط± ط£ظƒط¨ط± ظ…ظ† طµط§ظپظٹ ط§ظ„ظ…ط³ظ„ظ… ظ„ظ„ط¹ظ…ظٹظ„'].filter(Boolean).join(' - ');
        data.quantity = -returnQuantity;
        data.notes = [data.notes, 'ظ…ط±طھط¬ط¹ ط¥ظƒط³ط³ظˆط§ط± ظ…ظ† ط§ظ„ط¹ظ…ظٹظ„'].filter(Boolean).join(' - ');
      } else if (data.quantity > availableAccessory) { data.notes = [data.notes, 'طھظ†ط¨ظٹظ‡: ظƒظ…ظٹط© ط§ظ„ط¥ظƒط³ط³ظˆط§ط± ط§ظ„ظ…ط³ظ„ظ…ط© ط£ظƒط¨ط± ظ…ظ† ط§ظ„ط±طµظٹط¯ ط§ظ„ظ…طھط§ط­'].filter(Boolean).join(' - '); }
      backendResult = await postBackend('/batches/accessory', batchToApi(data));
    } else {
      const isCustomerReturn = data.movementKind === 'clothReturn';
      const allocation = calculateAllocation(allocations.find((item)=>item.id===data.allocationId));
      const alreadyDelivered = sum(customerBatches.filter((batch)=>batch.allocationId===data.allocationId));
      const warehouseAvailable = Math.max(allocation.finishedReceived - alreadyDelivered, 0);
      if (isCustomerReturn) {
        const returnQuantity = Math.abs(Number(data.quantity || 0));
        if (returnQuantity > Math.max(alreadyDelivered, 0)) data.notes = [data.notes, 'طھظ†ط¨ظٹظ‡: ظƒظ…ظٹط© ط§ظ„ظ…ط±طھط¬ط¹ ط£ظƒط¨ط± ظ…ظ† طµط§ظپظٹ ط§ظ„ظ…ط³ظ„ظ… ظ„ظ„ط¹ظ…ظٹظ„'].filter(Boolean).join(' - ');
        data.quantity = -returnQuantity;
        data.notes = [data.notes, 'ظ…ط±طھط¬ط¹ ظ…ظ† ط§ظ„ط¹ظ…ظٹظ„'].filter(Boolean).join(' - ');
      } else if (data.quantity > warehouseAvailable) { data.notes = [data.notes, 'طھظ†ط¨ظٹظ‡: ظƒظ…ظٹط© ط§ظ„طھط³ظ„ظٹظ… ط£ظƒط¨ط± ظ…ظ† ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ† ط§ظ„ظ…طھط§ط­'].filter(Boolean).join(' - '); }
      backendResult = await postBackend('/batches/customer', batchToApi(data));
    }
  }
  if (backendSaveRequired && !backendResult) {
    await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط§ظ„ط­ط±ظƒط© ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ط­ط±ظƒط©.');
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

function combinedMovementConfig(source) {
  const key = typeof source === 'string' ? source : '';
  const form = typeof source === 'string' ? null : source;
  const legacyMovement = form ? defaultBulkMovementForForm(form.dataset.form || '', form) : '';
  const movementKey = key || ({
    rawOut: 'dyehouse',
    accessorySent: 'dyehouse',
    finished: 'finished',
    accessoryReceived: 'finished',
    customer: 'customer',
    accessoryCustomer: 'customer',
  })[legacyMovement] || '';
  return {
    key: movementKey,
    title: {
      dyehouse: 'ط£ظ…ط± طµط±ظپ ظ„ظ„ظ…طµط¨ط؛ط©',
      finished: 'ط£ظ…ط± ط§ط³طھظ„ط§ظ… ظ…ظ† ط§ظ„ظ…طµط¨ط؛ط©',
      customer: 'ط£ظ…ط± طھط³ظ„ظٹظ… ظ„ظ„ط¹ظ…ظٹظ„',
    }[movementKey] || 'ط¥ط¯ط®ط§ظ„ ط¬ظ…ط§ط¹ظٹ',
    description: {
      dyehouse: 'ط£ط¯ط®ظ„ ط§ظ„ظ‚ظ…ط§ط´ ط§ظ„ط®ط§ط±ط¬ ظ„ظ„ظ…طµط¨ط؛ط© ظˆط§ظ„ط¥ظƒط³ط³ظˆط§ط± ط§ظ„ظ…طµط±ظˆظپ ظپظٹ ظ†ظپط³ ط§ظ„ط¥ط°ظ†.',
      finished: 'ط£ط¯ط®ظ„ ط§ظ„ظ‚ظ…ط§ط´ ط§ظ„ظ…ط¬ظ‡ط² ط§ظ„ظ…ط³طھظ„ظ… ظˆط§ظ„ط¥ظƒط³ط³ظˆط§ط± ط§ظ„ظ…ط³طھظ„ظ… ظپظٹ ظ†ظپط³ ط§ظ„ط¥ط°ظ†.',
      customer: 'ط£ط¯ط®ظ„ ط§ظ„ظ‚ظ…ط§ط´ ظˆط§ظ„ط¥ظƒط³ط³ظˆط§ط± ط§ظ„ظ…ط³ظ„ظ… ظ„ظ„ط¹ظ…ظٹظ„ ظپظٹ ظ†ظپط³ ط§ظ„ط¥ط°ظ†.',
    }[movementKey] || 'ط§ظƒطھط¨ ط§ظ„ظƒظ…ظٹط§طھ ط§ظ„ظ…ط·ظ„ظˆط¨ط© ظˆط§طھط±ظƒ ط§ظ„طµظپظˆظپ ط§ظ„ظپط§ط±ط؛ط© ط¨ط¯ظˆظ† ط­ظپط¸.',
    clothMovement: {
      dyehouse: 'rawOut',
      finished: 'finished',
      customer: 'customer',
    }[movementKey] || legacyMovement,
    accessoryMovement: {
      dyehouse: 'accessorySent',
      finished: 'accessoryReceived',
      customer: 'accessoryCustomer',
    }[movementKey] || legacyMovement,
    form,
  };
}

function combinedMovementClothAvailable(allocation, movement) {
  if (movement === 'rawOut') return Math.max(Number(allocation.plannedQuantity || 0) - Number(allocation.sentToDyehouse || 0), 0);
  if (movement === 'finished') return Math.max(Number(allocation.remainingAtDyehouse || 0), 0);
  if (movement === 'customer') return allocationAvailableToCustomer(allocation);
  return '';
}

function combinedMovementClothRows(order, movement) {
  if (movement === 'rawOut') {
    const groups = new Map();
    order.allocations.forEach((allocation) => {
      const dyehouse = allocation.dyehouse || order.dyehouse || '';
      const key = dyehouse || '__blank__';
      const current = groups.get(key) || { dyehouse, planned:0, sent:0, colors:[] };
      current.planned += Number(allocation.plannedQuantity || 0);
      current.sent += Number(allocation.sentToDyehouse || 0);
      if (allocation.color) current.colors.push(allocation.color);
      groups.set(key, current);
    });
    return [...groups.values()].map((group) => {
      const available = Math.max(group.planned - group.sent, 0);
      const colorLabel = group.colors.length > 1 ? 'ظƒظ„ ط§ظ„ط£ظ„ظˆط§ظ†' : (group.colors[0] || 'ظƒظ„ ط§ظ„ط£ظ„ظˆط§ظ†');
      return `<tr data-bulk-dyehouse="${escapeHtml(group.dyehouse || '')}"><td>${escapeHtml(colorLabel)}</td><td>${escapeHtml(group.dyehouse || '-')}</td><td>ظƒظ„ ط§ظ„ط¹ط±ظˆط¶</td><td>${formatNumber(available)}</td><td><input type="number" step="0.01" data-bulk-cloth-quantity placeholder="0"></td></tr>`;
    }).join('');
  }
  return order.allocations.map((allocation)=>{
    const available = combinedMovementClothAvailable(allocation, movement);
    return `<tr data-bulk-allocation="${escapeHtml(allocation.id)}"><td>${escapeHtml(allocation.color || '-')}</td><td>${escapeHtml(allocation.dyehouse || '-')}</td><td>${escapeHtml(allocationWidthSuffix(order, allocation).replace(/^\s*\/\s*/, '') || '-')}</td><td>${available === '' ? '-' : formatNumber(available)}</td><td><input type="number" step="0.01" data-bulk-cloth-quantity placeholder="0"></td></tr>`;
  }).join('');
}

function accessoryRowsForCombinedMovement(order, config) {
  if (!order.accessoryLines?.length) return '';
  if (config.accessoryMovement === 'accessorySent') {
    return order.accessoryLines.map((line)=>`<tr data-bulk-accessory-type="${escapeHtml(line.type)}"><td>${escapeHtml(line.type)}</td><td>-</td><td>-</td><td>${formatNumber(Number(line.quantity || 0))}</td><td><input type="number" step="0.01" data-bulk-accessory-quantity placeholder="0"></td></tr>`).join('');
  }
  return order.allocations.map((allocation)=>order.accessoryLines.map((line)=>{
    const received = sum(accessoryBatches.filter((batch)=>batch.allocationId === allocation.id && batch.movement === 'received' && (batch.accessoryType || line.type) === line.type));
    const delivered = sum(accessoryBatches.filter((batch)=>batch.allocationId === allocation.id && batch.movement === 'customer' && (batch.accessoryType || line.type) === line.type));
    const available = config.accessoryMovement === 'accessoryCustomer' ? Math.max(received - delivered, 0) : '';
    return `<tr data-bulk-allocation="${escapeHtml(allocation.id)}" data-bulk-accessory-type="${escapeHtml(line.type)}"><td>${escapeHtml(line.type)}</td><td>${escapeHtml(allocation.color || '-')}</td><td>${escapeHtml(allocationWidthSuffix(order, allocation).replace(/^\s*\/\s*/, '') || '-')}</td><td>${available === '' ? '-' : formatNumber(available)}</td><td><input type="number" step="0.01" data-bulk-accessory-quantity placeholder="0"></td></tr>`;
  }).join('')).join('');
}

function bulkExtraRawRowHtml(dyehouse = '') {
  return `<tr data-bulk-extra-raw-row>
    <td><input data-bulk-extra-raw-label value="ط®ط§ظ… ط¥ط¶ط§ظپظٹ" placeholder="ط§ظ„ط¨ظٹط§ظ†"></td>
    <td><input data-bulk-extra-raw-dyehouse value="${escapeHtml(dyehouse || '')}" placeholder="ط§ظ„ظ…طµط¨ط؛ط©"></td>
    <td>ظƒظ„ ط§ظ„ط¹ط±ظˆط¶</td>
    <td>-</td>
    <td><div class="inline-control-row"><input type="number" step="0.01" data-bulk-extra-raw-quantity placeholder="0"><button type="button" class="mini-btn danger" data-remove-bulk-extra-raw>ط­ط°ظپ</button></div></td>
  </tr>`;
}

function bulkNoteNumberFieldHtml(value = '') {
  return `<label data-bulk-note-row><span>ط±ظ‚ظ… ط¥ط°ظ†</span><div class="inline-control-row"><input data-bulk-note-number value="${escapeHtml(value || '')}" placeholder="ط±ظ‚ظ… ط§ظ„ط¥ط°ظ†"><button type="button" class="mini-btn danger" data-remove-bulk-note-number>ط­ط°ظپ</button></div></label>`;
}

function openBulkBatchDialog(source) {
  const order = calculateOrder(orders.find((item)=>item.id===selectedOrderId));
  if (!order) return;
  const config = combinedMovementConfig(source);
  const form = config.form;
  if (!config.key || !config.clothMovement) return;
  const movement = config.clothMovement;
  const date = form?.elements.date?.value || new Date().toISOString().slice(0, 10);
  const noteNumber = form?.elements.noteNumber?.value || '';
  const notes = form?.elements.notes?.value || '';
  const title = config.title;
  const accessoryRows = accessoryRowsForCombinedMovement(order, config);
  const defaultDyehouse = order.dyehouse || order.allocations?.[0]?.dyehouse || '';
  refs.documentTitle.textContent = title;
  refs.documentBody.dataset.documentType = 'bulk-batches';
  refs.documentBody.innerHTML = `<div class="document-sheet bulk-entry-sheet" data-bulk-group="${config.key}" data-bulk-movement="${movement}" data-bulk-accessory-movement="${config.accessoryMovement}">
    <div class="subsection-head"><div><h2>${title}</h2><p class="muted">${config.description}</p></div></div>
    <div class="summary-grid">
      <label><span>ط§ظ„طھط§ط±ظٹط®</span><input type="date" data-bulk-date value="${escapeHtml(date)}"></label>
      <div class="full-row" data-bulk-note-list>
        <div class="subsection-head compact-head"><h3>ط£ط±ظ‚ط§ظ… ط§ظ„ط£ط°ظˆظ†</h3><button type="button" class="mini-btn" data-add-bulk-note-number>+ ط¥ط°ظ†</button></div>
        ${bulkNoteNumberFieldHtml(noteNumber)}
      </div>
      <label class="full-row"><span>ظ…ظ„ط§ط­ط¸ط§طھ</span><input data-bulk-notes value="${escapeHtml(notes)}"></label>
    </div>
    <div class="subsection-head"><h3>ط§ظ„ظ‚ظ…ط§ط´</h3>${movement === 'rawOut' ? '<button type="button" class="mini-btn" data-add-bulk-extra-raw>+ ط¥ط¶ط§ظپط© ط®ط§ظ…</button>' : ''}</div>
    <table class="bulk-entry-table"><thead><tr><th>ط§ظ„ظ„ظˆظ†</th><th>ط§ظ„ظ…طµط¨ط؛ط©</th><th>ط§ظ„ط¹ط±ط¶</th><th>ط§ظ„ظ…طھط§ط­</th><th>ط§ظ„ظƒظ…ظٹط©</th></tr></thead><tbody>
      ${combinedMovementClothRows(order, movement)}
      ${movement === 'rawOut' ? `<tr data-bulk-extra-raw-anchor></tr>${bulkExtraRawRowHtml(defaultDyehouse)}` : ''}
    </tbody></table>
    ${accessoryRows ? `<div class="subsection-head"><h3>ط§ظ„ط¥ظƒط³ط³ظˆط§ط±</h3></div><table class="bulk-entry-table"><thead><tr><th>ظ†ظˆط¹ ط§ظ„ط¥ظƒط³ط³ظˆط§ط±</th><th>ط§ظ„ظ„ظˆظ†</th><th>ط§ظ„ط¹ط±ط¶</th><th>ط§ظ„ظ…طھط§ط­/ط§ظ„ظ…ط·ظ„ظˆط¨</th><th>ط§ظ„ظƒظ…ظٹط©</th></tr></thead><tbody>${accessoryRows}</tbody></table>` : ''}
    <div class="dialog-actions"><button class="primary-btn" type="button" data-save-bulk-batches>ط­ظپط¸ ط§ظ„ط£ظ…ط± ط§ظ„ظ…ط¬ظ…ط¹</button></div>
  </div>`;
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}

function bulkBatchItemsFromDialog() {
  const body = refs.documentBody;
  const sheet = body.querySelector('.bulk-entry-sheet');
  const movement = sheet?.dataset.bulkMovement || body.querySelector('[data-bulk-movement]')?.dataset.bulkMovement || body.dataset.bulkMovement || '';
  const accessoryMovement = sheet?.dataset.bulkAccessoryMovement || '';
  const date = body.querySelector('[data-bulk-date]')?.value || new Date().toISOString().slice(0, 10);
  const noteNumber = [...body.querySelectorAll('[data-bulk-note-number]')]
    .map((input)=>input.value.trim())
    .filter(Boolean)
    .join('طŒ ');
  const notes = body.querySelector('[data-bulk-notes]')?.value || '';
  const clothRows = [...body.querySelectorAll('[data-bulk-cloth-quantity]')].map((input)=>input.closest('tr')).filter(Boolean);
  const extraRawRows = [...body.querySelectorAll('[data-bulk-extra-raw-quantity]')].map((input)=>input.closest('tr')).filter(Boolean);
  const accessoryRows = [...body.querySelectorAll('[data-bulk-accessory-quantity]')].map((input)=>input.closest('tr')).filter(Boolean);
  const clothItems = clothRows.map((row) => {
    const quantity = Number(row.querySelector('[data-bulk-cloth-quantity]')?.value || 0);
    if (!quantity) return null;
    const allocationId = row.dataset.bulkAllocation;
    const allocation = allocations.find((item)=>item.id === allocationId) || {};
    if (movement === 'rawOut') return { type:'dyehouse', data: batchToApi({ id:uid(), orderId:selectedOrderId, allocationId:'', date, quantity, noteNumber, notes, dyehouse:row.dataset.bulkDyehouse || allocation.dyehouse || '' }) };
    if (movement === 'finished') return { type:'finished', data: batchToApi({ id:uid(), orderId:selectedOrderId, allocationId, date, quantity, noteNumber, notes }) };
    if (movement === 'customer') return { type:'customer', data: batchToApi({ id:uid(), orderId:selectedOrderId, allocationId, date, quantity, noteNumber, notes }) };
    return null;
  }).filter(Boolean);
  const extraRawItems = extraRawRows.map((row) => {
    const quantity = Number(row.querySelector('[data-bulk-extra-raw-quantity]')?.value || 0);
    if (!quantity || movement !== 'rawOut') return null;
    const dyehouse = row.querySelector('[data-bulk-extra-raw-dyehouse]')?.value.trim() || '';
    const label = row.querySelector('[data-bulk-extra-raw-label]')?.value.trim() || 'ط®ط§ظ… ط¥ط¶ط§ظپظٹ';
    return { type:'dyehouse', data: batchToApi({ id:uid(), orderId:selectedOrderId, allocationId:'', date, quantity, noteNumber, notes:[notes, label].filter(Boolean).join(' - '), dyehouse }) };
  }).filter(Boolean);
  const accessoryItems = accessoryRows.map((row) => {
    const quantity = Number(row.querySelector('[data-bulk-accessory-quantity]')?.value || 0);
    if (!quantity) return null;
    const allocationId = row.dataset.bulkAllocation || '';
    const accessoryType = row.dataset.bulkAccessoryType || 'ط¥ظƒط³ط³ظˆط§ط±';
    if (accessoryMovement === 'accessoryReceived') return { type:'accessory', data: batchToApi({ id:uid(), orderId:selectedOrderId, allocationId, date, quantity, noteNumber, notes, accessoryType, movement:'received' }) };
    if (accessoryMovement === 'accessorySent') return { type:'accessory', data: batchToApi({ id:uid(), orderId:selectedOrderId, allocationId, date, quantity, noteNumber, notes, accessoryType, movement:'sent' }) };
    if (accessoryMovement === 'accessoryCustomer') return { type:'accessory', data: batchToApi({ id:uid(), orderId:selectedOrderId, allocationId, date, quantity, noteNumber, notes, accessoryType, movement:'customer' }) };
    return null;
  }).filter(Boolean);
  return [...clothItems, ...extraRawItems, ...accessoryItems];
}

async function saveBulkBatchesFromDialog() {
  const items = bulkBatchItemsFromDialog();
  if (!items.length) { alert('ط§ظƒطھط¨ ظƒظ…ظٹط© ط¹ظ„ظ‰ ظ„ظˆظ† ظˆط§ط­ط¯ ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„.'); return; }
  if (!(await ensureBackendForWrite('طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط¨ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط­ظپط¸ ط§ظ„ط¥ط¯ط®ط§ظ„ ط§ظ„ط¬ظ…ط§ط¹ظٹ.'))) return;
  let result = null;
  try {
    result = await postBackendStrict('/batches/bulk', { items });
  } catch (error) {
    const message = `طھط¹ط°ط± ط­ظپط¸ ط§ظ„ط¥ط¯ط®ط§ظ„ ط§ظ„ط¬ظ…ط§ط¹ظٹ ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ط§ظ„ط³ط¨ط¨: ${error.message || error}`;
    await rollbackAfterBackendWriteFailure(message);
    alert(message);
    return;
  }
  if (!result?.ok) {
    await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط§ظ„ط¥ط¯ط®ط§ظ„ ط§ظ„ط¬ظ…ط§ط¹ظٹ ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط£ظٹ ط­ط±ظƒط©.');
    return;
  }
  refs.documentDialog.close();
  await loadBackendData();
}
async function addAllocation() {
  const order = calculateOrder(orders.find((item)=>item.id===selectedOrderId));
  const color = prompt('ط§ظƒطھط¨ ط§ظ„ظ„ظˆظ† ط§ظ„ظ…ط·ظ„ظˆط¨'); if (!color) return;
  const createdAllocations = [];
  if (!(await ensureBackendForWrite())) return;
  const backendSaveRequired = true;
  if (order.widthMode === 'multiple') {
    const targetFinishedWeight = Number(prompt('ط§ظƒطھط¨ ط§ظ„ظˆط²ظ† ط§ظ„ظ…ط¬ظ‡ط² ط§ظ„ظ…ط·ظ„ظˆط¨')); if (!targetFinishedWeight) return;
    order.widthLines.forEach((widthLine) => { const allocation = { id:uid(), orderId:order.id, color, plannedQuantity:widthLine.quantity, dyehouse:order.dyehouse, targetFinishedWidth:widthLine.width, targetFinishedWeight, widthLineId:widthLine.id, rawInch:widthLine.inch, rawWidth:widthLine.width }; createdAllocations.push(allocation); });
  } else {
    const plannedQuantity = Number(prompt('ط§ظƒطھط¨ ظƒظ…ظٹط© ط§ظ„ظ„ظˆظ†')); if (!plannedQuantity) return;
    const existing = order.allocations[0];
    const targetFinishedWidth = existing?.targetFinishedWidth || Number(prompt('ط§ظƒطھط¨ ط§ظ„ط¹ط±ط¶')); if (!targetFinishedWidth) return;
    const targetFinishedWeight = existing?.targetFinishedWeight || Number(prompt('ط§ظƒطھط¨ ط§ظ„ظˆط²ظ† ط§ظ„ظ…ط¬ظ‡ط²')); if (!targetFinishedWeight) return;
    const allocation = { id:uid(), orderId:order.id, color, plannedQuantity, dyehouse:order.dyehouse, targetFinishedWidth, targetFinishedWeight };
    createdAllocations.push(allocation);
  }
  const savedAllocations = [];
  for (const allocation of createdAllocations) savedAllocations.push(await postBackend(`/orders/${order.id}/allocations`, allocationToApi(allocation)));
  if (backendSaveRequired && savedAllocations.some((item)=>!item)) {
    await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط§ظ„ظ„ظˆظ† ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ط¥ط¶ط§ظپط©.');
    return;
  }
  await loadBackendData();
}
async function editAllocation(id) {
  const allocation = allocations.find((item)=>item.id===id);
  if (!allocation) return;
  const order = orders.find((item)=>item.id===allocation.orderId);
  const colorValue = prompt('ط§ظƒطھط¨ ط§ظ„ظ„ظˆظ† / ظƒظˆط¯ ط§ظ„ظ„ظˆظ†', allocation.color || allocation.pantoneCode || '');
  if (colorValue === null) return;
  const cleanedColor = colorValue.trim();
  if (!cleanedColor) return;
  const targetFinishedWidth = Number(prompt('ط§ظƒطھط¨ ط§ظ„ط¹ط±ط¶', allocation.targetFinishedWidth));
  if (!targetFinishedWidth) return;
  const targetFinishedWeight = Number(prompt('ط§ظƒطھط¨ ط§ظ„ظˆط²ظ† ط§ظ„ظ…ط¬ظ‡ط²', allocation.targetFinishedWeight));
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
      await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ طھط¹ط¯ظٹظ„ ط§ظ„ظ„ظˆظ† ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„طھط¹ط¯ظٹظ„.');
      return;
    }
  }
  await loadBackendData();
}

function chooseDyehouseTransferType(hasAccessories = false) {
  const fallbackPrompt = () => {
    const value = prompt(`\u0627\u062e\u062a\u0631 \u0646\u0648\u0639 \u0627\u0644\u0646\u0642\u0644:\n1 - \u0646\u0642\u0644 \u062e\u0627\u0645\n2 - \u0646\u0642\u0644 \u0644\u0648\u0646${hasAccessories ? '\n3 - \u0646\u0642\u0644 \u062e\u0627\u0645 \u0625\u0643\u0633\u0633\u0648\u0627\u0631' : ''}`, '1');
    if (value === null) return null;
    const normalized = String(value).trim();
    if (/^1\b|\u062e\u0627\u0645/.test(normalized)) return 'raw';
    if (/^2\b|\u0644\u0648\u0646/.test(normalized)) return 'allocation';
    if (hasAccessories && (/^3\b|\u0625\u0643\u0633\u0633\u0648\u0627\u0631|\u0627\u0643\u0633\u0633\u0648\u0627\u0631|\u0631\u064a\u0628/.test(normalized))) return 'accessory';
    alert(hasAccessories ? '\u0627\u062e\u062a\u0631 1 \u0644\u0646\u0642\u0644 \u062e\u0627\u0645 \u0623\u0648 2 \u0644\u0646\u0642\u0644 \u0644\u0648\u0646 \u0623\u0648 3 \u0644\u0646\u0642\u0644 \u062e\u0627\u0645 \u0625\u0643\u0633\u0633\u0648\u0627\u0631.' : '\u0627\u062e\u062a\u0631 1 \u0644\u0646\u0642\u0644 \u062e\u0627\u0645 \u0623\u0648 2 \u0644\u0646\u0642\u0644 \u0644\u0648\u0646.');
    return null;
  };
  if (typeof document === 'undefined' || !document.createElement || typeof HTMLDialogElement === 'undefined') {
    return Promise.resolve(fallbackPrompt());
  }
  return new Promise((resolve) => {
    const dialog = document.createElement('dialog');
    dialog.className = 'transfer-choice-dialog';
    dialog.innerHTML = `
      <form method="dialog" class="transfer-choice-card" dir="rtl">
        <button class="mini-btn transfer-choice-close" type="button" data-transfer-choice="">\u0625\u063a\u0644\u0627\u0642</button>
        <h3>\u0646\u0642\u0644 \u0645\u0635\u0628\u063a\u0629</h3>
        <p>\u0627\u062e\u062a\u0631 \u0647\u0644 \u0627\u0644\u062d\u0631\u0643\u0629 \u0646\u0642\u0644 \u062e\u0627\u0645 \u0641\u0639\u0644\u064a \u0628\u064a\u0646 \u0645\u0635\u0628\u063a\u062a\u064a\u0646 \u0623\u0645 \u0646\u0642\u0644 \u0644\u0648\u0646 \u0645\u0646 \u062e\u0637\u0629 \u0627\u0644\u0623\u0648\u0631\u062f\u0631.</p>
        <div class="transfer-choice-actions">
          <button class="mini-btn gold" type="button" data-transfer-choice="raw">\u0646\u0642\u0644 \u062e\u0627\u0645</button>
          <button class="mini-btn" type="button" data-transfer-choice="allocation">\u0646\u0642\u0644 \u0644\u0648\u0646</button>
          ${hasAccessories ? '<button class="mini-btn" type="button" data-transfer-choice="accessory">\u0646\u0642\u0644 \u062e\u0627\u0645 \u0625\u0643\u0633\u0633\u0648\u0627\u0631</button>' : ''}
        </div>
      </form>`;
    const finish = (value) => {
      dialog.close();
      dialog.remove();
      resolve(value || null);
    };
    dialog.addEventListener('click', (event) => {
      const button = event.target.closest('[data-transfer-choice]');
      if (!button) return;
      finish(button.dataset.transferChoice || null);
    });
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      finish(null);
    });
    document.body.appendChild(dialog);
    try {
      dialog.showModal();
    } catch (error) {
      dialog.remove();
      resolve(fallbackPrompt());
    }
  });
}

async function transferAllocationDyehouse(id, context = {}) {
  const allocation = allocations.find((item)=>item.id===id);
  if (!allocation) return;
  const order = calculateOrder(orders.find((item)=>item.id===allocation.orderId));
  const calculated = order.allocations.find((item)=>item.id===id) || calculateAllocation(allocation);
  const scopedSourceDyehouse = String(context.sourceDyehouse || '').trim();
  const currentDyehouse = scopedSourceDyehouse || allocation.dyehouse || order.dyehouse || '';
  const normalizedTransferType = await chooseDyehouseTransferType(Boolean(order.accessoryLines?.length));
  if (!normalizedTransferType) return;
  const isRawTransfer = normalizedTransferType === 'raw';
  const isAllocationTransfer = normalizedTransferType === 'allocation';
  const isAccessoryTransfer = normalizedTransferType === 'accessory';
  const newDyehouseValue = prompt('\u0627\u0644\u0645\u0635\u0628\u063a\u0629 \u0627\u0644\u062c\u062f\u064a\u062f\u0629', currentDyehouse);
  if (newDyehouseValue === null) return;
  const newDyehouse = newDyehouseValue.trim();
  if (!newDyehouse) return;
  if (newDyehouse === currentDyehouse) { alert('\u0627\u0644\u0645\u0635\u0628\u063a\u0629 \u0644\u0645 \u062a\u062a\u063a\u064a\u0631.'); return; }
  const originalQuantity = Number(allocation.plannedQuantity || 0);
  const scopedAvailableQuantity = Number(context.availableQuantity || 0);
  let accessoryLine = null;
  let accessoryType = '';
  let accessoryAvailable = 0;
  if (isAccessoryTransfer) {
    const accessoryNames = (order.accessoryLines || []).map((line)=>accessoryLineName(line, order));
    const selectedAccessoryValue = prompt('\u0646\u0648\u0639 \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631', accessoryNames[0] || '\u0631\u064a\u0628');
    if (selectedAccessoryValue === null) return;
    accessoryType = selectedAccessoryValue.trim();
    if (!accessoryType) return;
    accessoryLine = (order.accessoryLines || []).find((line)=>normalizeForCompare(accessoryLineName(line, order)) === normalizeForCompare(accessoryType)) || order.accessoryLines?.[0] || null;
    accessoryAvailable = accessoryLine ? accessoryFlowQuantityForLine(order, calculated, 'sent', accessoryLine) : 0;
    if (!accessoryAvailable) {
      alert('\u0644\u0627 \u064a\u0648\u062c\u062f \u062e\u0631\u0648\u062c \u0625\u0643\u0633\u0633\u0648\u0627\u0631 \u0641\u0639\u0644\u064a \u0645\u0633\u062c\u0644 \u0644\u0647\u0630\u0627 \u0627\u0644\u0644\u0648\u0646. \u0633\u062c\u0644 \u062e\u0631\u0648\u062c \u0627\u0644\u0631\u064a\u0628 \u0623\u0648\u0644\u0627\u064b \u062b\u0645 \u0627\u0646\u0642\u0644\u0647.');
      return;
    }
  }
  const suggestedQuantity = isAccessoryTransfer
    ? (accessoryAvailable || '')
    : isRawTransfer
    ? (scopedAvailableQuantity || Number(calculated.remainingAtDyehouse || 0) || Number(calculated.sentToDyehouse || 0) || originalQuantity || '')
    : (Math.max(originalQuantity - Number(calculated.sentToDyehouse || 0), 0) || originalQuantity || '');
  const quantityValue = prompt('\u0627\u0644\u0643\u0645\u064a\u0629 \u0627\u0644\u0645\u062d\u0648\u0644\u0629', suggestedQuantity);
  if (quantityValue === null) return;
  const quantity = Number(quantityValue);
  if (!quantity || quantity <= 0) { alert('\u0627\u062f\u062e\u0644 \u0643\u0645\u064a\u0629 \u0635\u062d\u064a\u062d\u0629 \u0644\u0644\u062a\u062d\u0648\u064a\u0644.'); return; }
  const transferWarnings = [];
  if (!isAccessoryTransfer && quantity > originalQuantity) transferWarnings.push('\u062a\u0646\u0628\u064a\u0647: \u0643\u0645\u064a\u0629 \u0627\u0644\u062a\u062d\u0648\u064a\u0644 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0643\u0645\u064a\u0629 \u0627\u0644\u0645\u062e\u0637\u0637\u0629 \u0644\u0647\u0630\u0627 \u0627\u0644\u0644\u0648\u0646.');
  if (isRawTransfer && scopedAvailableQuantity && quantity > scopedAvailableQuantity + 0.01) transferWarnings.push('\u062a\u0646\u0628\u064a\u0647: \u0643\u0645\u064a\u0629 \u0646\u0642\u0644 \u0627\u0644\u062e\u0627\u0645 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0631\u0635\u064a\u062f \u0647\u0630\u0647 \u0627\u0644\u0645\u0635\u0628\u063a\u0629 \u0641\u064a \u0627\u0644\u0635\u0641 \u0627\u0644\u0645\u0639\u0631\u0648\u0636.');
  if (!isAccessoryTransfer && quantity > Math.max(originalQuantity - Number(calculated.sentToDyehouse || 0), 0)) transferWarnings.push('\u062a\u0646\u0628\u064a\u0647: \u0643\u0645\u064a\u0629 \u0627\u0644\u062a\u062d\u0648\u064a\u0644 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u062e\u0627\u0645 \u0627\u0644\u0645\u062a\u0627\u062d \u063a\u064a\u0631 \u0627\u0644\u0645\u0631\u0633\u0644 \u0644\u0644\u0645\u0635\u0628\u063a\u0629.');
  if (isAccessoryTransfer && quantity > accessoryAvailable + 0.01) transferWarnings.push('\u062a\u0646\u0628\u064a\u0647: \u0643\u0645\u064a\u0629 \u0646\u0642\u0644 \u062e\u0627\u0645 \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0645\u062e\u0631\u0648\u062c \u0641\u0639\u0644\u064a\u0627\u064b \u0644\u0647\u0630\u0627 \u0627\u0644\u0644\u0648\u0646.');
  const accessorySummary = String(context.accessorySummary || '').trim();
  if (isRawTransfer && accessorySummary && !confirm(`\u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631 \u0627\u0644\u0645\u0631\u062a\u0628\u0637 \u0628\u0647\u0630\u0627 \u0627\u0644\u0635\u0641:\n${accessorySummary}\n\n\u0647\u0644 \u062a\u0645\u0631\u0631 \u0646\u0642\u0644 \u0627\u0644\u062e\u0627\u0645 \u0645\u0639 \u0645\u0631\u0627\u062c\u0639\u0629 \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631\u061f`)) return;
  const dateValue = prompt('\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u062a\u062d\u0648\u064a\u0644', new Date().toISOString().slice(0,10));
  if (dateValue === null) return;
  const noteNumber = prompt('\u0631\u0642\u0645 \u0625\u0630\u0646 \u0627\u0644\u062a\u062d\u0648\u064a\u0644', '') || '';
  const reason = prompt('\u0633\u0628\u0628 \u0627\u0644\u062a\u062d\u0648\u064a\u0644', '\u062a\u062d\u0648\u064a\u0644 \u0645\u0635\u0628\u063a\u0629') || '';
  const accessoryReason = isRawTransfer && accessorySummary ? `\u0625\u0643\u0633\u0633\u0648\u0627\u0631 \u0645\u0631\u062a\u0628\u0637: ${accessorySummary}` : '';
  const newAllocationId = uid();
  const roundedQuantity = roundNumber(quantity);
  let transferRecord = null;
  let allocationUpdate = null;
  let newAllocation = null;
  if (!(await ensureBackendForWrite())) return;
  const backendSaveRequired = true;
  if (isAccessoryTransfer) {
    transferRecord = { id:uid(), orderId:allocation.orderId, allocationId:id, newAllocationId:null, color:`${accessoryType} / ${allocation.color || allocation.pantoneCode || ''}`.trim(), fromDyehouse:currentDyehouse, toDyehouse:newDyehouse, quantity:roundedQuantity, date:dateValue, reason:[TRANSFER_ACCESSORY_MARKER, '\u0646\u0642\u0644 \u062e\u0627\u0645 \u0625\u0643\u0633\u0633\u0648\u0627\u0631', reason, ...transferWarnings].filter(Boolean).join(' - '), noteNumber, mode:'accessory' };
  } else if (isRawTransfer) {
    transferRecord = { id:uid(), orderId:allocation.orderId, allocationId:id, newAllocationId:null, color:allocation.color || allocation.pantoneCode || '', fromDyehouse:currentDyehouse, toDyehouse:newDyehouse, quantity:roundedQuantity, date:dateValue, reason:[TRANSFER_RAW_MARKER, reason, accessoryReason, ...transferWarnings].filter(Boolean).join(' - '), noteNumber, mode:'raw' };
  } else if (roundedQuantity >= originalQuantity) {
    allocationUpdate = { ...allocation, dyehouse:newDyehouse };
    transferRecord = { id:uid(), orderId:allocation.orderId, allocationId:id, newAllocationId:null, color:allocation.color || allocation.pantoneCode || '', fromDyehouse:currentDyehouse, toDyehouse:newDyehouse, quantity:roundNumber(originalQuantity), date:dateValue, reason: [TRANSFER_ALLOCATION_MARKER, reason, ...transferWarnings].filter(Boolean).join(' - '), noteNumber, mode:'full' };
  } else {
    const ratio = originalQuantity ? roundedQuantity / originalQuantity : 0;
    const originalAccessory = Number(allocation.accessoryQuantityManual || 0);
    const newAccessory = originalAccessory ? roundNumber(originalAccessory * ratio) : allocation.accessoryQuantityManual;
    allocationUpdate = { ...allocation, plannedQuantity:roundNumber(originalQuantity - roundedQuantity), accessoryQuantityManual:originalAccessory ? roundNumber(originalAccessory - Number(newAccessory || 0)) : allocation.accessoryQuantityManual };
    newAllocation = { ...allocation, id:newAllocationId, plannedQuantity:roundedQuantity, dyehouse:newDyehouse, accessoryQuantityManual:newAccessory };
    transferRecord = { id:uid(), orderId:allocation.orderId, allocationId:id, newAllocationId, color:allocation.color || allocation.pantoneCode || '', fromDyehouse:currentDyehouse, toDyehouse:newDyehouse, quantity:roundedQuantity, date:dateValue, reason:[TRANSFER_ALLOCATION_MARKER, reason].filter(Boolean).join(' - '), noteNumber, mode:'split' };
  }
  if (backendSaveRequired) {
    const updatedAllocation = allocationUpdate ? await putBackend(`/allocations/${id}`, allocationToApi(allocationUpdate)) : true;
    const insertedAllocation = newAllocation ? await postBackend(`/orders/${allocation.orderId}/allocations`, allocationToApi(newAllocation)) : true;
    const insertedTransfer = transferRecord ? await postBackend('/transfers', transferToApi(transferRecord)) : true;
    if (!updatedAllocation || !insertedAllocation || !insertedTransfer) {
      await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ طھط­ظˆظٹظ„ ط§ظ„ظ…طµط¨ط؛ط© ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„طھط­ظˆظٹظ„.');
      return;
    }
  }
  await loadBackendData();
}
async function deleteAllocation(id) {
  const allocation = allocations.find((item)=>item.id===id);
  if (!allocation) return;
  if (!confirm(`ظ‡ظ„ طھط±ظٹط¯ ط­ط°ظپ ط§ظ„ظ„ظˆظ† ${allocation.color || allocation.pantoneCode || '-'}طں ط³ظٹطھظ… ط­ط°ظپ ط§ظ„ط­ط±ظƒط§طھ ط§ظ„ظ…ط±طھط¨ط·ط© ط¨ظ‡ ظ…ظ† ظ‡ط°ط§ ط§ظ„ط·ظ„ط¨.`)) return;
  if (!(await ensureBackendForWrite())) return;
  const backendSaveRequired = true;
  if (backendSaveRequired) {
    const deleted = await deleteBackend(`/allocations/${id}`);
    if (!deleted) {
      await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ط°ظپ ط§ظ„ظ„ظˆظ† ظ…ظ† ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ط­ط°ظپ.');
      return;
    }
  }
  recordAudit('delete', 'allocation', id, allocation, null, `ط­ط°ظپ ط§ظ„ظ„ظˆظ† ${allocation.color || allocation.pantoneCode || '-'}`);
  await persistAuditLog();
  await loadBackendData();
}
async function deleteOrder(id) {
  const order = orders.find((item)=>item.id===id);
  if (!order) return;
  if (!confirm(`ظ‡ظ„ طھط±ظٹط¯ ط­ط°ظپ ط§ظ„ط·ظ„ط¨ ط±ظ‚ظ… ${order.orderNumber || '-'}طں ط³ظٹطھظ… ط­ط°ظپ ط§ظ„ط£ظ„ظˆط§ظ† ظˆط§ظ„ط­ط±ظƒط§طھ ط§ظ„ظ…ط±طھط¨ط·ط© ط¨ظ‡.`)) return;
  if (!(await ensureBackendForWrite())) return;
  const backendSaveRequired = true;
  if (backendSaveRequired) {
    const deleted = await deleteBackend(`/orders/${id}`);
    if (!deleted) {
      await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ط°ظپ ط§ظ„ط·ظ„ط¨ ظ…ظ† ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ط­ط°ظپ.');
      return;
    }
  }
  recordAudit('delete', 'order', id, order, null, `ط­ط°ظپ ط§ظ„ط·ظ„ط¨ ط±ظ‚ظ… ${order.orderNumber || ''}`);
  await persistAuditLog();
  if (selectedOrderId === id) selectedOrderId = null;
  await loadBackendData();
}
async function deleteBatch(type, id) {
  if (!confirm('ظ‡ظ„ طھط±ظٹط¯ ط­ط°ظپ ظ‡ط°ظ‡ ط§ظ„ط­ط±ظƒط©طں ط³ظٹطھظ… ط­ط°ظپظ‡ط§ ظ…ظ† ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ط£ظٹط¶ظ‹ط§.')) return;
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
          alert('ظ„ط§ ظٹظ…ظƒظ† ط­ط°ظپ ط§ظ„طھط­ظˆظٹظ„ ظ„ط£ظ† ط§ظ„ظ„ظˆظ† ط§ظ„ظ…ط­ظˆظ„ ط¹ظ„ظٹظ‡ طھظˆط¬ط¯ ط¹ظ„ظٹظ‡ ط­ط±ظƒط§طھ طھط´ط؛ظٹظ„. ط§ط­ط°ظپ ط§ظ„ط­ط±ظƒط§طھ ط§ظ„ظ…ط±طھط¨ط·ط© ط£ظˆظ„ظ‹ط§ ط£ظˆ ط§طھط±ظƒ ط§ظ„طھط­ظˆظٹظ„ ظƒظ…ط§ ظ‡ظˆ.');
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
      await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ط°ظپ ط§ظ„ط­ط±ظƒط© ظ…ظ† ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ط­ط°ظپ.');
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
  const quantity = Number(prompt('ط§ظ„ظƒظ…ظٹط©', updatedBatch.quantity)); if (!quantity) return; updatedBatch.quantity = quantity;
  updatedBatch.date = prompt('ط§ظ„طھط§ط±ظٹط®', updatedBatch.date) || updatedBatch.date;
  if (type === 'raw') { updatedBatch.supplier = prompt('ط§ظ„ط¬ظ‡ط© / ط§ظ„ظ…طµط¯ط±', updatedBatch.supplier) || updatedBatch.supplier; updatedBatch.noteNumber = prompt('ط±ظ‚ظ… ط§ظ„ط¥ط°ظ†', updatedBatch.noteNumber || '') || ''; updatedBatch.notes = prompt('ظ…ظ„ط§ط­ط¸ط§طھ', updatedBatch.notes || '') || ''; }
  if (type === 'transfer') { updatedBatch.fromDyehouse = prompt('\u0645\u0646 \u0645\u0635\u0628\u063a\u0629', updatedBatch.fromDyehouse || '') || updatedBatch.fromDyehouse; updatedBatch.toDyehouse = prompt('\u0625\u0644\u0649 \u0645\u0635\u0628\u063a\u0629', updatedBatch.toDyehouse || '') || updatedBatch.toDyehouse; updatedBatch.noteNumber = prompt('\u0631\u0642\u0645 \u0625\u0630\u0646 \u0627\u0644\u062a\u062d\u0648\u064a\u0644', updatedBatch.noteNumber || '') || ''; updatedBatch.reason = prompt('\u0633\u0628\u0628 \u0627\u0644\u0646\u0642\u0644', updatedBatch.reason || '') || ''; if (updatedBatch.mode === 'accessory' && !String(updatedBatch.reason || '').includes(TRANSFER_ACCESSORY_MARKER)) updatedBatch.reason = [TRANSFER_ACCESSORY_MARKER, updatedBatch.reason].filter(Boolean).join(' - '); if (updatedBatch.mode === 'raw' && !String(updatedBatch.reason || '').includes(TRANSFER_RAW_MARKER)) updatedBatch.reason = [TRANSFER_RAW_MARKER, updatedBatch.reason].filter(Boolean).join(' - '); if (updatedBatch.mode !== 'raw' && updatedBatch.mode !== 'accessory' && !String(updatedBatch.reason || '').includes(TRANSFER_ALLOCATION_MARKER)) updatedBatch.reason = [TRANSFER_ALLOCATION_MARKER, updatedBatch.reason].filter(Boolean).join(' - '); }
  if (type === 'rawReturn') { updatedBatch.noteNumber = prompt('ط±ظ‚ظ… ط¥ط°ظ† ط§ظ„ظ…ط±طھط¬ط¹', updatedBatch.noteNumber || '') || ''; updatedBatch.notes = prompt('ظ…ظ„ط§ط­ط¸ط§طھ', updatedBatch.notes || '') || ''; }
  if (type === 'accessory') { updatedBatch.accessoryType = prompt('ظ†ظˆط¹ ط§ظ„ط¥ظƒط³ط³ظˆط§ط±', updatedBatch.accessoryType) || updatedBatch.accessoryType; updatedBatch.noteNumber = prompt('ط±ظ‚ظ… ط§ظ„ط¥ط°ظ†', updatedBatch.noteNumber || '') || ''; updatedBatch.notes = prompt('ظ…ظ„ط§ط­ط¸ط§طھ', updatedBatch.notes || '') || ''; }
  if (type === 'gluing') { updatedBatch.movement = prompt('ظ†ظˆط¹ ط§ظ„ط­ط±ظƒط© sent/received/customer', updatedBatch.movement || 'sent') || updatedBatch.movement; updatedBatch.partnerFabric = prompt('ظ…طµط¯ط± ط§ظ„ط¯ظ…ط¬ / ط§ظ„ط¹ظ…ظ„ظٹط©', updatedBatch.partnerFabric || '') || ''; updatedBatch.outputName = prompt('ط§ط³ظ… ط§ظ„ظ…ظ†طھط¬ ط§ظ„ظ†ط§طھط¬', updatedBatch.outputName || '') || ''; updatedBatch.customerName = prompt('ط§ظ„ط¹ظ…ظٹظ„', updatedBatch.customerName || '') || ''; updatedBatch.noteNumber = prompt('ط±ظ‚ظ… ط§ظ„ط¥ط°ظ†', updatedBatch.noteNumber || '') || ''; updatedBatch.notes = prompt('ظ…ظ„ط§ط­ط¸ط§طھ', updatedBatch.notes || '') || ''; }
  if (type === 'dye') { updatedBatch.noteNumber = prompt('ط±ظ‚ظ… ط§ظ„ط¥ط°ظ†', updatedBatch.noteNumber || '') || ''; updatedBatch.notes = prompt('ظ…ظ„ط§ط­ط¸ط§طھ', updatedBatch.notes || '') || ''; }
  if (type === 'production') { updatedBatch.noteNumber = prompt('ط±ظ‚ظ… ط¥ط°ظ† ط§ط³طھظ„ط§ظ… ط§ظ„ظ…ط¬ظ‡ط²', updatedBatch.noteNumber || '') || ''; updatedBatch.notes = prompt('ظ…ظ„ط§ط­ط¸ط§طھ', updatedBatch.notes || '') || ''; }
  if (type === 'finished') { updatedBatch.finishedWidth = Number(prompt('ط§ظ„ط¹ط±ط¶', updatedBatch.finishedWidth)); updatedBatch.finishedWeight = Number(prompt('ط§ظ„ظˆط²ظ† ط§ظ„ظ…ط¬ظ‡ط²', updatedBatch.finishedWeight)); updatedBatch.notes = prompt('ظ…ظ„ط§ط­ط¸ط§طھ', updatedBatch.notes || '') || ''; }
  if (backendSaveRequired) {
    const saved = type === 'transfer'
      ? await putBackend(`/transfers/${id}`, transferToApi(updatedBatch))
      : await putBackend(`/batches/${backendBatchType(type)}/${id}`, type === 'rawReturn' ? { ...batchToApi(updatedBatch), reason:updatedBatch.reason || updatedBatch.notes || '' } : batchToApi(updatedBatch));
    if (!saved) {
      await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ طھط¹ط¯ظٹظ„ ط§ظ„ط­ط±ظƒط© ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„طھط¹ط¯ظٹظ„.');
      return;
    }
  }
  await loadBackendData();
}
function getOperationalStage(order) {
  if (order.totalRawReceived === 0 && order.totalAllocated > 0) return 'ط¨ط§ظ†طھط¸ط§ط± ط®ط±ظˆط¬ ط§ظ„ط®ط§ظ…';
  if (order.totalRawReceived === 0) return 'ط¨ط§ظ†طھط¸ط§ط± ط§ط³طھظ„ط§ظ… ط§ظ„ط®ط§ظ…';
  if (order.totalAllocated === 0) return 'ط¨ط§ظ†طھط¸ط§ط± طھظˆط²ظٹط¹ ط§ظ„ط£ظ„ظˆط§ظ†';
  if (Number(order.gluingBalance || 0) > 0) return 'ظˆط§ظ‚ظپ ظپظٹ ط¯ظ…ط¬ ط§ظ„ط®ط§ظ…ط§طھ';
  if (Number(order.gluedProductBalance || 0) > 0) return 'ظ…ظ†طھط¬ ظ…ط¯ظ…ط¬ ط¬ط§ظ‡ط² ظ„ظ„طھط³ظ„ظٹظ…';
  if (order.rawAtDyehouseAvailable > 0 || order.remainingAtDyehouse > 0) return 'طھط­طھ ط§ظ„طھط´ط؛ظٹظ„ ط¨ط§ظ„ظ…طµط¨ط؛ط©';
  if (order.warehouseBalance > 0 && order.totalDeliveredToCustomer < order.totalFinishedReceived) return 'ط¨ط§ظ„ظ…ط®ط²ظ†';
  if (order.totalDeliveredToCustomer < order.totalAllocated) return 'طھط³ظ„ظٹظ… ط§ظ„ط¹ظ…ظٹظ„';
  return 'ظ…ظƒطھظ…ظ„';
}
function cleanOperationalStage(stage) {
  const text = String(stage || '').trim();
  return isLegacyRecoveredText(text) ? 'ظ…ط±ط§ط¬ط¹ط©' : (text || '-');
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
  let label = 'ظ…ظƒطھظ…ظ„';
  let startDate = customerDate || finishedDate || rawDate || order.orderDate || '';
  let reason = 'ط§ظƒطھظ…ظ„طھ ط¯ظˆط±ط© ط§ظ„طھط´ط؛ظٹظ„.';
  if (order.operationClosed || order.status === 'closed') {
    key = 'closed'; label = 'ظ…ط؛ظ„ظ‚ طھط´ط؛ظٹظ„ظٹظ‹ط§'; reason = 'طھظ… ط¥ط؛ظ„ط§ظ‚ ط¯ظˆط±ط© ط§ظ„طھط´ط؛ظٹظ„.';
  } else if (Number(order.totalRawReceived || 0) === 0 && Number(order.totalAllocated || 0) > 0) {
    key = 'weaving'; label = 'ظˆط§ظ‚ظپ ظپظٹ ط§ظ„ظ†ط³ظٹط¬'; startDate = order.orderDate || ''; reason = 'طھظ… طھظˆط²ظٹط¹ ط§ظ„ط£ظ„ظˆط§ظ† ظˆظ„ظ… ظٹطھظ… ط®ط±ظˆط¬ ط§ظ„ط®ط§ظ… ظ„ظ„ظ…طµط¨ط؛ط©.';
  } else if (Number(order.totalRawReceived || 0) === 0) {
    key = 'weaving'; label = 'ظˆط§ظ‚ظپ ظپظٹ ط§ظ„ظ†ط³ظٹط¬'; startDate = order.orderDate || ''; reason = 'ظ„ظ… ظٹطھظ… طھط³ط¬ظٹظ„ ط®ط±ظˆط¬ ط®ط§ظ… ظ…ظ† ط§ظ„ظ†ط³ظٹط¬ ظ„ظ„ظ…طµط¨ط؛ط©.';
  } else if (Number(order.totalAllocated || 0) === 0) {
    key = 'color-planning'; label = 'ط¨ط§ظ†طھط¸ط§ط± طھظˆط²ظٹط¹ ط§ظ„ط£ظ„ظˆط§ظ†'; startDate = order.orderDate || rawDate || ''; reason = 'ط§ظ„ط®ط§ظ… ظ…ظˆط¬ظˆط¯ ظ„ظƒظ† ظ„ظ… ظٹطھظ… طھظˆط²ظٹط¹ ط§ظ„ط£ظ„ظˆط§ظ†.';
  } else if (Number(order.gluingBalance || 0) > 0) {
    key = 'gluing'; label = 'ظˆط§ظ‚ظپ ظپظٹ ط¯ظ…ط¬ ط§ظ„ط®ط§ظ…ط§طھ'; startDate = gluingDate || rawDate || order.orderDate || ''; reason = 'ط®ط±ط¬ ط®ط§ظ… ظ„ظ„ط¯ظ…ط¬ ظˆظ„ظ… ظٹظƒطھظ…ظ„ ط§ط³طھظ„ط§ظ… ط§ظ„ظ…ظ†طھط¬ ط§ظ„ظ†ط§طھط¬.';
  } else if (Number(order.gluedProductBalance || 0) > 0) {
    key = 'glued-ready'; label = 'ظ…ظ†طھط¬ ظ…ط¯ظ…ط¬ ط¬ط§ظ‡ط² ظ„ظ„طھط³ظ„ظٹظ…'; startDate = gluingDate || finishedDate || order.orderDate || ''; reason = 'طھظ… ط§ط³طھظ„ط§ظ… ظ…ظ†طھط¬ ظ…ط¯ظ…ط¬ ظˆظ„ظ… ظٹظƒطھظ…ظ„ طھط³ظ„ظٹظ…ظ‡ ظ„ظ„ط¹ظ…ظٹظ„.';
  } else if (Number(order.rawAtDyehouseAvailable || 0) > 0 || Number(order.remainingAtDyehouse || 0) > 0) {
    key = 'dyehouse'; label = 'ظˆط§ظ‚ظپ ظپظٹ ط§ظ„ظ…طµط¨ط؛ط©'; startDate = rawDate || order.orderDate || ''; reason = 'طھظ… طھط³ظ„ظٹظ… ط®ط§ظ… ظ„ظ„ظ…طµط¨ط؛ط© ظˆظ„ظ… ظٹظƒطھظ…ظ„ ط§ط³طھظ„ط§ظ… ط§ظ„ظ…ط¬ظ‡ط².';
  } else if (Number(order.warehouseBalance || 0) > 0 && Number(order.totalDeliveredToCustomer || 0) < Number(order.totalFinishedReceived || 0)) {
    key = 'warehouse'; label = 'ظˆط§ظ‚ظپ ظپظٹ ط§ظ„ظ…ط®ط²ظ†'; startDate = finishedDate || order.orderDate || ''; reason = 'ط¯ط®ظ„ ظ…ط¬ظ‡ط² ط¥ظ„ظ‰ ط§ظ„ظ…ط®ط²ظ† ظˆظ„ظ… ظٹظƒطھظ…ظ„ طھط³ظ„ظٹظ…ظ‡ ظ„ظ„ط¹ظ…ظٹظ„.';
  } else if (Number(order.totalDeliveredToCustomer || 0) < Number(order.totalAllocated || 0)) {
    key = 'delivery'; label = 'طھط³ظ„ظٹظ… ط§ظ„ط¹ظ…ظٹظ„'; startDate = finishedDate || order.orderDate || ''; reason = 'ط§ظ„طھط³ظ„ظٹظ… ظ„ظ„ط¹ظ…ظٹظ„ ظ„ظ… ظٹظƒطھظ…ظ„.';
  }
  return { key, label, startDate, days:daysSince(startDate), reason };
}
function operationStagePlace(order, stage = orderStageInfo(order)) {
  if (stage.key === 'weaving') return order.weavingSource || 'ط§ظ„ظ†ط³ظٹط¬';
  if (stage.key === 'dyehouse') return order.dyehouse || 'ط§ظ„ظ…طµط¨ط؛ط©';
  if (stage.key === 'warehouse') return 'ط§ظ„ظ…ط®ط²ظ†';
  if (stage.key === 'delivery') return order.customer || 'ط§ظ„طھط³ظ„ظٹظ…';
  return stage.label || '-';
}
function orderFilterLabel(value) {
  const labels = { all:'ظƒظ„ ط§ظ„ط·ظ„ط¨ط§طھ', pending:'ط¨ط§ظ†طھط¸ط§ط± ط§ظ„ط§ط³طھظ„ط§ظ…', 'in-progress':'ظ‚ظٹط¯ ط§ظ„طھط´ط؛ظٹظ„', completed:'ظ…ظƒطھظ…ظ„', closed:'ظ…ط؛ظ„ظ‚ طھط´ط؛ظٹظ„ظٹظ‹ط§', 'stage:weaving':'ط§ظ„ظ†ط³ظٹط¬', 'stage:color-planning':'ط§ظ„ظ†ط³ظٹط¬', 'stage:gluing':'ط¯ظ…ط¬', 'stage:glued-ready':'ط¯ظ…ط¬', 'stage:dyehouse':'ط§ظ„ظ…طµط¨ط؛ط©', 'stage:warehouse':'ط§ظ„ظ…ط®ط²ظ†' };
  return labels[value] || statusLabel(value) || value || '-';
}
function ensureStageFilterOptions() {
  const select = refs.orderStatusFilter;
  if (!select) return;
  [...select.options]
    .filter((option)=>['stage:ready-to-dyehouse', 'stage:delivery', 'stage:color-planning', 'stage:glued-ready'].includes(option.value))
    .forEach((option)=>option.remove());
  const before = [...select.options].find((item)=>item.value === 'stage:dyehouse');
  if (![...select.options].some((option)=>option.value === 'stage:gluing')) select.add(new Option('ط¯ظ…ط¬', 'stage:gluing'), before || null);
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
  if (stage === 'ط¨ط§ظ†طھط¸ط§ط± ط§ط³طھظ„ط§ظ… ط§ظ„ط®ط§ظ…' || stage === 'ط¨ط§ظ†طھط¸ط§ط± ط®ط±ظˆط¬ ط§ظ„ط®ط§ظ…' || stage === 'ط¨ط§ظ†طھط¸ط§ط± طھظˆط²ظٹط¹ ط§ظ„ط£ظ„ظˆط§ظ†') return order.orderDate || '';
  if (stage === 'طھط­طھ ط§ظ„طھط´ط؛ظٹظ„ ط¨ط§ظ„ظ…طµط¨ط؛ط©') return dateRangeLabel(rawBatches.filter((batch)=>batch.orderId===order.id)).split(' - ')[0] || order.orderDate || '';
  if (stage === 'ط¨ط§ظ„ظ…ط®ط²ظ†' || stage === 'طھط³ظ„ظٹظ… ط§ظ„ط¹ظ…ظٹظ„') return dateRangeLabel(productionBatches.filter((batch)=>allocationIds.includes(batch.allocationId))).split(' - ')[0] || order.orderDate || '';
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
function emptyRow(colspan, text = 'ظ„ط§ طھظˆط¬ط¯ ط¨ظٹط§ظ†ط§طھ ظ…ط³ط¬ظ„ط©.') {
  return `<tr><td colspan="${colspan}">${text}</td></tr>`;
}
function dyehouseNamesForOrder(order) {
  const originalDyehouse = String(order?.dyehouse || '').trim();
  const transferDyehouses = dyehouseTransfers
    .filter((transfer)=>transferBelongsToOrderScope(order, transfer))
    .flatMap((transfer)=>[transfer.fromDyehouse, transfer.toDyehouse]);
  const allocationDyehouses = (order?.allocations || [])
    .map((allocation)=>allocation.dyehouse || originalDyehouse);
  return uniqueNonEmpty([originalDyehouse, ...allocationDyehouses, ...transferDyehouses]);
}
function transferAllocationIdForScope(transfer = {}) {
  return transfer.allocationId || transfer.fromAllocationId || transfer.from_allocation_id || '';
}
function transferLinkedIdsForScope(transfer = {}) {
  return [
    transferAllocationIdForScope(transfer),
    transfer.newAllocationId,
    transfer.toAllocationId,
    transfer.to_allocation_id,
  ].filter(Boolean);
}
function orderAllocationIdSetForScope(order) {
  return new Set((order?.allocations || []).map((allocation)=>allocation.id).filter(Boolean));
}
function transferHasOrderAllocationForScope(order, transfer = {}) {
  const allocationIds = orderAllocationIdSetForScope(order);
  return transferLinkedIdsForScope(transfer).some((id)=>allocationIds.has(id));
}
function baseDyehouseNamesForOrderScope(order) {
  const originalDyehouse = String(order?.dyehouse || '').trim();
  return new Set(uniqueNonEmpty([
    originalDyehouse,
    ...(order?.allocations || []).map((allocation)=>allocation.dyehouse || originalDyehouse),
  ]).map((name)=>String(name || '').trim()));
}
function transferBelongsToOrderScope(order, transfer = {}) {
  const orderId = String(order?.id || '').trim();
  const transferOrderId = String(transfer.orderId || transfer.order_id || '').trim();
  const linkedIds = transferLinkedIdsForScope(transfer);
  const hasLinkedAllocation = transferHasOrderAllocationForScope(order, transfer);
  if (orderId && transferOrderId) {
    if (transferOrderId !== orderId) return false;
    if (linkedIds.length) return hasLinkedAllocation;
    const baseNames = baseDyehouseNamesForOrderScope(order);
    return baseNames.has(String(transfer.fromDyehouse || '').trim()) || baseNames.has(String(transfer.toDyehouse || '').trim());
  }
  return hasLinkedAllocation;
}
function isRawTransferForScopedDyehouse(transfer = {}, allocation = {}) {
  const text = `${transfer.mode || ''} ${transfer.reason || ''} ${transfer.notes || ''}`;
  if (text.includes(TRANSFER_ACCESSORY_MARKER) || transferRecordMode(transfer) === 'accessory') return false;
  if (text.includes(TRANSFER_ALLOCATION_MARKER) || transfer.newAllocationId) return false;
  if (transferRecordMode(transfer) === 'raw') return true;
  const planned = Number(allocation?.plannedQuantity || 0);
  const quantity = Number(transfer?.quantity || 0);
  return Boolean(planned && quantity > 0 && quantity < planned - 0.01);
}
function scopedDyehouseQuantityForPicker(order, allocation, dyehouseName) {
  const name = String(dyehouseName || '').trim();
  const segment = scopedDyehouseSegmentsForAllocation(order, allocation).find((item)=>item.dyehouse === name);
  return roundNumber(segment?.quantity || 0);
}
function scopedDyehouseTransfersForAllocation(order, allocation) {
  return dyehouseTransfers.filter((transfer)=>(
    transferBelongsToOrderScope(order, transfer)
    && transferAllocationIdForScope(transfer) === allocation?.id
    && isRawTransferForScopedDyehouse(transfer, allocation)
  ));
}
function dyehouseLedgerSegmentsForAllocation(order, allocation) {
  const planned = Number(allocation?.plannedQuantity || 0);
  const rawTransfers = scopedDyehouseTransfersForAllocation(order, allocation);
  const allocationDyehouse = String(allocation?.dyehouse || order?.dyehouse || '').trim();
  const firstSourceDyehouse = String(rawTransfers.find((transfer)=>String(transfer.fromDyehouse || '').trim())?.fromDyehouse || '').trim();
  const baseDyehouse = firstSourceDyehouse || allocationDyehouse;
  const ledger = new Map();
  const add = (dyehouseName, quantity) => {
    const name = String(dyehouseName || '').trim();
    if (!name) return;
    ledger.set(name, roundNumber(Number(ledger.get(name) || 0) + Number(quantity || 0)));
  };
  add(baseDyehouse, planned);
  rawTransfers.forEach((transfer) => {
    const quantity = Number(transfer.quantity || 0);
    const fromName = String(transfer.fromDyehouse || '').trim();
    const toName = String(transfer.toDyehouse || '').trim();
    if (fromName && toName && fromName !== toName) {
      add(fromName, -quantity);
      add(toName, quantity);
    }
  });
  if (!rawTransfers.length && !ledger.size) add(allocationDyehouse, planned);
  return [...ledger.entries()]
    .map(([dyehouse, quantity])=>({ dyehouse, quantity:roundNumber(Math.max(Number(quantity || 0), 0)) }))
    .filter((item)=>item.quantity > 0);
}
function scopedDyehouseSegmentsForAllocation(order, allocation) {
  return dyehouseLedgerSegmentsForAllocation(order, allocation);
}
function scopedDyehouseRowsForPicker(order, dyehouseName) {
  return (order?.allocations || [])
    .map((allocation)=>{
      const scopedQuantity = scopedDyehouseQuantityForPicker(order, allocation, dyehouseName);
      return scopedQuantity > 0 ? { ...allocation, plannedQuantity:scopedQuantity } : null;
    })
    .filter(Boolean);
}
function scopedOrderDetailAllocationRows(order) {
  const rows = [];
  (order?.allocations || []).forEach((allocation) => {
    const rawTransfers = scopedDyehouseTransfersForAllocation(order, allocation);
    if (!rawTransfers.length) {
      rows.push({ ...allocation, sourceAllocation:allocation, scopedDyehouse:allocation.dyehouse || order?.dyehouse || '', scopedQuantity:Number(allocation.plannedQuantity || 0) });
      return;
    }
    scopedDyehouseSegmentsForAllocation(order, allocation).forEach(({ dyehouse:name, quantity:scopedQuantity }) => {
      if (scopedQuantity <= 0) return;
      const isReceiptDyehouse = String(allocation.dyehouse || order?.dyehouse || '').trim() === String(name || '').trim();
      rows.push({
        ...allocation,
        dyehouse:name,
        plannedQuantity:scopedQuantity,
        sentToDyehouse:scopedQuantity,
        finishedReceived:isReceiptDyehouse ? allocation.finishedReceived : 0,
        deliveredToCustomer:isReceiptDyehouse ? allocation.deliveredToCustomer : 0,
        customerDelivered:isReceiptDyehouse ? allocation.customerDelivered : 0,
        wasteQuantity:isReceiptDyehouse ? allocation.wasteQuantity : 0,
        wastePercent:isReceiptDyehouse ? allocation.wastePercent : 0,
        sourceAllocation:allocation,
        scopedDyehouse:name,
        scopedQuantity,
      });
    });
  });
  return rows;
}
function operationNotesKey(type, dyehouseName = '') {
  const name = String(dyehouseName || '').trim();
  return type === 'dyeing' ? `dyeing:${name || 'default'}` : 'weaving';
}
function combinedOperationNotes(order) {
  const sections = [];
  if (String(order?.notes || '').trim()) sections.push(`ظ…ظ„ط§ط­ط¸ط§طھ ط§ظ„ط·ظ„ط¨: ${String(order.notes).trim()}`);
  const notes = order?.operationNotes && typeof order.operationNotes === 'object' && !Array.isArray(order.operationNotes) ? order.operationNotes : {};
  if (String(notes.weaving || '').trim()) sections.push(`ظ…ظ„ط§ط­ط¸ط§طھ ط§ظ„ظ†ط³ظٹط¬: ${String(notes.weaving).trim()}`);
  Object.entries(notes)
    .filter(([key, value]) => key.startsWith('dyeing:') && String(value || '').trim())
    .forEach(([key, value]) => {
      const dyehouseName = key.slice('dyeing:'.length) || 'ط§ظ„ظ…طµط¨ط؛ط©';
      sections.push(`ظ…ظ„ط§ط­ط¸ط§طھ ط§ظ„طµط¨ط§ط؛ط© - ${dyehouseName}: ${String(value).trim()}`);
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
  openPricingQuotation,
  openPricingCostSheet,
  stopWhatsappSettingsAutoRefresh,
  isBackendAvailable: () => backendAvailable,
  getOrders: () => orders,
  getPricings: () => pricings,
  getRawBatches: () => rawBatches,
  getProductionBatches: () => productionBatches,
  getFinishedBatches: () => finishedBatches,
  getCustomerBatches: () => customerBatches,
  getRawReturns: () => rawReturns,
  getDyehouseTransfers: () => dyehouseTransfers,
  getSelectedOrderId: () => selectedOrderId,
  getCurrentDocumentType: () => currentDocumentType,
  setCurrentDocumentType: (value) => { currentDocumentType = value; },
  getReportTypeLabels: () => reportTypeLabels,
}));


function installAmalReviewUi() {
  refs.weavingSlipType.innerHTML = '<option value="weaving">ط¥ط°ظ† ط®ط§ظ… ط±ط§ظٹط­ ظ„ظ„ظ…طµط¨ط؛ط©</option>';
  document.getElementById('amalReviewBox')?.remove();
}
function toggleAmalReviewMode() {
  const normalGrid = refs.weavingSlipOrderNumber.closest('.form-grid');
  if (normalGrid) normalGrid.style.display = '';
  document.getElementById('amalReviewBox')?.remove();
  refs.weavingSlipForm.querySelector('.dialog-actions .primary-btn').textContent = 'طھط³ط¬ظٹظ„ ط§ظ„ظ…ط³طھظ†ط¯';
}
function renderAmalSuggestion(suggestion = {}) {
  pendingAmalSuggestion = cloneAmalSuggestion(suggestion);
  const $ = (id)=>document.getElementById(id);
  $('amalOrderNumber').value = pendingAmalSuggestion.orderNumber || '';
  $('amalCustomer').value = pendingAmalSuggestion.customer || '';
  $('amalOrderDate').value = pendingAmalSuggestion.orderDate || '';
  $('amalDyehouse').value = pendingAmalSuggestion.dyehouse || '';
  $('amalRawNote').value = pendingAmalSuggestion.rawNoteNumber || '';
  $('amalWeavingSource').value = pendingAmalSuggestion.weavingSource || 'ظ…طµط¯ط± ط§ظ„ظ†ط³ظٹط¬';
  $('amalSpecs').value = pendingAmalSuggestion.specs || '';
  const rows = (pendingAmalSuggestion.rows && pendingAmalSuggestion.rows.length) ? pendingAmalSuggestion.rows : [{}];
  $('amalLinesBody').innerHTML = rows.map((row, index)=>`
    <tr data-amal-row="${index}">
      <td><select data-amal="rowType"><option value="cloth" ${!isAccessoryRow(row)?'selected':''}>ظ‚ظ…ط§ط´</option><option value="accessory" ${isAccessoryRow(row)?'selected':''}>ط¥ظƒط³ط³ظˆط§ط±</option></select></td>
      <td><input data-amal="fabricType" value="${escapeHtml(row.fabricType || '')}"></td>
      <td><input data-amal="inch" value="${escapeHtml(row.inch || '')}"></td>
      <td><input data-amal="quantity" type="number" step="0.01" value="${escapeHtml(row.quantity || '')}"></td>
      <td><input data-amal="pantoneCode" value="${escapeHtml(row.pantoneCode || row.color || '')}"></td>
      <td><input data-amal="width" type="number" step="0.01" value="${row.width || ''}"></td>
      <td><input data-amal="weight" type="number" step="0.01" value="${row.weight || ''}"></td>
      <td><select data-amal="accessoryType"><option value="">-</option><option value="ط±ظٹط¨" ${row.accessoryType==='ط±ظٹط¨'?'selected':''}>ط±ظٹط¨</option><option value="ظ„ظٹط§ظ‚ط©" ${row.accessoryType==='ظ„ظٹط§ظ‚ط©'?'selected':''}>ظ„ظٹط§ظ‚ط©</option><option value="ط¥ظƒط³ط³ظˆط§ط± ط¢ط®ط±" ${row.accessoryType==='ط¥ظƒط³ط³ظˆط§ط± ط¢ط®ط±'?'selected':''}>ط¥ظƒط³ط³ظˆط§ط± ط¢ط®ط±</option></select></td>
    </tr>`).join('');
}
function applyAmalSuggestionFromFile(file) {
  if (refs.weavingSlipType.value === 'deltexIssue') {
    const rawIssueSuggestion = getRawIssueSuggestionFromFile(file) || {
      orderNumber:'',
      customer:'',
      orderDate:new Date().toISOString().slice(0,10),
      dyehouse:'ط¬ظٹظ…ط§',
      rawNoteNumber:'',
      weavingSource:'ط¯ظ„طھط§ طھظƒط³طھط§ظٹظ„',
      specs:'',
      rows:[],
    };
    renderAmalSuggestion(rawIssueSuggestion);
    const existingOrder = findOrderForRawIssueSuggestion(rawIssueSuggestion);
    if (existingOrder) refs.weavingSlipOrderNumber.value = existingOrder.id;
    refs.weavingSlipDate.value = rawIssueSuggestion.orderDate || refs.weavingSlipDate.value || new Date().toISOString().slice(0,10);
    refs.weavingSlipQuantity.value = rawIssueSuggestion.rawIssueQuantity || rawIssueSuggestion.rows?.filter((row)=>!isAccessoryRow(row)).reduce((total,row)=>total + Number(row.quantity || 0), 0) || '';
    refs.weavingSlipSupplier.value = rawIssueSuggestion.weavingSource || 'ط¯ظ„طھط§ طھظƒط³طھط§ظٹظ„';
    refs.weavingSlipNoteNumber.value = rawIssueSuggestion.rawNoteNumber || '';
    refs.weavingSlipNotes.value = rawIssueSuggestion.specs || '';
    updateDocumentReviewFields();
    refs.reviewMatchStatus.textContent = existingOrder
      ? `طھظ…طھ ظ…ط·ط§ط¨ظ‚ط© ط¥ط°ظ† ط§ظ„ط®ط§ظ… ط±ظ‚ظ… ${rawIssueSuggestion.rawNoteNumber || '-'} ظ…ط¹ ط§ظ„ط·ظ„ط¨ ${existingOrder.orderNumber}. ط±ط§ط¬ط¹ ط§ظ„ط¨ظٹط§ظ†ط§طھ ظ‚ط¨ظ„ ط§ظ„ط§ط¹طھظ…ط§ط¯.`
      : `ظ„ظ… ظٹطھظ… ط§ظ„ط¹ط«ظˆط± ط¹ظ„ظ‰ ط·ظ„ط¨ ظ…ط±طھط¨ط· ط¨ط¥ط°ظ† ط§ظ„ط®ط§ظ… ط±ظ‚ظ… ${rawIssueSuggestion.rawNoteNumber || '-'}. ط§ط®طھط± ط§ظ„ط·ظ„ط¨ ظٹط¯ظˆظٹظ‹ط§ ظ‚ط¨ظ„ ط§ظ„طھط³ط¬ظٹظ„.`;
    return;
  }
  const rawIssueSuggestion = getRawIssueSuggestionFromFile(file);
  if (rawIssueSuggestion) {
    renderAmalSuggestion(rawIssueSuggestion);
    const existingOrder = findOrderForRawIssueSuggestion(rawIssueSuggestion);
    if (existingOrder) refs.weavingSlipOrderNumber.value = existingOrder.id;
    refs.reviewMatchStatus.textContent = existingOrder
      ? `طھظ…طھ ظ…ط·ط§ط¨ظ‚ط© ط¥ط°ظ† ط§ظ„ط®ط§ظ… ط±ظ‚ظ… ${rawIssueSuggestion.rawNoteNumber || '-'} ظ…ط¹ ط§ظ„ط·ظ„ط¨ ${existingOrder.orderNumber}. ط±ط§ط¬ط¹ ط§ظ„ط¨ظٹط§ظ†ط§طھ ظ‚ط¨ظ„ ط§ظ„ط§ط¹طھظ…ط§ط¯.`
      : `ظ„ظ… ظٹطھظ… ط§ظ„ط¹ط«ظˆط± ط¹ظ„ظ‰ ط·ظ„ط¨ ظ…ط±طھط¨ط· ط¨ط¥ط°ظ† ط§ظ„ط®ط§ظ… ط±ظ‚ظ… ${rawIssueSuggestion.rawNoteNumber || '-'}. ط§ط®طھط± ط§ظ„ط·ظ„ط¨ ظٹط¯ظˆظٹظ‹ط§ ظ‚ط¨ظ„ ط§ظ„طھط³ط¬ظٹظ„.`;
    return;
  }
  const orderNumber = getAmalOrderNumberFromFile(file);
  const suggestion = cloneAmalSuggestion(AMAL_FASHION_ORDER_LIBRARY[orderNumber] || { orderNumber, customer:'', rows:[] });
  renderAmalSuggestion(suggestion);
  refs.reviewMatchStatus.textContent = orderNumber && AMAL_FASHION_ORDER_LIBRARY[orderNumber] ? `طھظ… ط§ظ„طھط¹ط±ظپ ط¹ظ„ظ‰ ط§ظ„ظ…ط³طھظ†ط¯ ظ„ظ„ط·ظ„ط¨ ${orderNumber}. ط±ط§ط¬ط¹ ط§ظ„ط¨ظٹط§ظ†ط§طھ ظ‚ط¨ظ„ ط§ظ„ط§ط¹طھظ…ط§ط¯.` : 'ظ„ظ… ظٹطھظ… ط§ظ„طھط¹ط±ظپ ط¹ظ„ظ‰ ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ط³طھظ†ط¯ طھظ„ظ‚ط§ط¦ظٹظ‹ط§. ط£ط¯ط®ظ„ ط§ظ„ط¨ظٹط§ظ†ط§طھ ط£ظˆ ط§ط®طھط± ط§ظ„ط·ظ„ط¨ ظٹط¯ظˆظٹظ‹ط§.';
}
function readAmalSuggestionFromUi() {
  const $ = (id)=>document.getElementById(id);
  const rows = [...document.querySelectorAll('#amalLinesBody tr[data-amal-row]')].map((tr)=>{
    const value = (name)=>tr.querySelector(`[data-amal="${name}"]`)?.value?.trim() || '';
    const rowType = value('rowType');
    return { fabricType:value('fabricType'), inch:value('inch'), quantity:Number(value('quantity') || 0), pantoneCode:value('pantoneCode'), width:Number(value('width') || 0), weight:Number(value('weight') || 0), accessoryType: rowType === 'accessory' ? value('accessoryType') || 'ط¥ظƒط³ط³ظˆط§ط±' : '' };
  }).filter((row)=>row.fabricType || row.pantoneCode || row.quantity);
  return { orderNumber:$('amalOrderNumber').value.trim(), customer:$('amalCustomer').value.trim(), orderDate:$('amalOrderDate').value, dyehouse:$('amalDyehouse').value.trim(), rawNoteNumber:$('amalRawNote').value.trim(), weavingSource:$('amalWeavingSource').value.trim(), specs:$('amalSpecs').value.trim(), rows };
}
async function confirmAmalOrderImport() {
  const suggestion = readAmalSuggestionFromUi();
  const reviewType = refs.weavingSlipType.value;
  if (!suggestion.orderNumber || !suggestion.customer || !suggestion.orderDate || !suggestion.dyehouse) { alert('ط±ط§ط¬ط¹ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظˆط§ظ„ط¹ظ…ظٹظ„ ظˆط§ظ„طھط§ط±ظٹط® ظˆط§ظ„ظ…طµط¨ط؛ط© ظ‚ط¨ظ„ ط§ظ„ط§ط¹طھظ…ط§ط¯.'); return; }
  const clothRows = suggestion.rows.filter((row)=>!isAccessoryRow(row));
  const accessoryRows = suggestion.rows.filter(isAccessoryRow);
  if (!clothRows.length) { alert('ظٹط¬ط¨ ظˆط¬ظˆط¯ ط¨ظ†ط¯ ظ‚ظ…ط§ط´ ظˆط§ط­ط¯ ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„ ظ‚ط¨ظ„ ط§ظ„ط§ط¹طھظ…ط§ط¯.'); return; }
  const existing = orders.find((order)=>String(order.orderNumber) === String(suggestion.orderNumber));
  if (existing && !confirm(`ظٹظˆط¬ط¯ ط·ظ„ط¨ ظ…ط³ط¬ظ„ ط¨ظ†ظپط³ ط§ظ„ط±ظ‚ظ… ${suggestion.orderNumber}. ظ‡ظ„ طھط±ظٹط¯ ط§ط³طھط¨ط¯ط§ظ„ظ‡ ط¨ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ط­ط§ظ„ظٹط©طں`)) return;
  if (!(await ensureBackendForWrite('طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط¨ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ظ…ط³طھظ†ط¯.'))) return;
  if (existing) {
    const deleted = await deleteBackend(`/orders/${existing.id}`);
    if (!deleted) {
      await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط§ط³طھط¨ط¯ط§ظ„ ط§ظ„ط·ظ„ط¨ ط§ظ„ظ‚ط¯ظٹظ… ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ظ…ط³طھظ†ط¯.');
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
    await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط§ظ„ط·ظ„ط¨ ط§ظ„ظ…ط³طھظˆط±ط¯ ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ظ…ط³طھظ†ط¯.');
    return;
  }
  for (const row of clothRows) {
    const relatedAccessory = accessoryRows.find((item)=>item.pantoneCode && item.pantoneCode === row.pantoneCode);
    const allocation = { id:uid(), orderId, color:row.pantoneCode || row.fabricType || '-', pantoneCode:row.pantoneCode || '', fabricType:row.fabricType || firstCloth.fabricType || '', plannedQuantity:Number(row.quantity || 0), dyehouse:suggestion.dyehouse, targetFinishedWidth:row.width || '', targetFinishedWeight:row.weight || '', accessoryQuantityManual: relatedAccessory ? Number(relatedAccessory.quantity || 0) : null };
    const savedAllocation = await postBackend(`/orders/${orderId}/allocations`, allocationToApi(allocation));
    if (!savedAllocation) {
      await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط£ظ„ظˆط§ظ† ط§ظ„ط·ظ„ط¨ ط§ظ„ظ…ط³طھظˆط±ط¯ ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ظ…ط³طھظ†ط¯ ظƒط§ظ…ظ„ظ‹ط§.');
      return;
    }
  }
  if (suggestion.rawNoteNumber) {
    const rawSaved = await postBackend('/batches/dyehouse', batchToApi({ id:uid(), orderId, date:suggestion.orderDate, quantity:totalRawQuantity, supplier:suggestion.weavingSource || '', noteNumber:suggestion.rawNoteNumber, notes:reviewType === 'deltexIssue' ? 'طھظ… طھط³ط¬ظٹظ„ ط¥ط°ظ† طµط±ظپ ط®ط§ظ… ظ…ظ† ظ…ط±ط§ط¬ط¹ط© ط§ظ„ظ…ط³طھظ†ط¯' : 'طھظ… طھط³ط¬ظٹظ„ ط£ظ…ط± طµط¨ط§ط؛ط© ظ…ط­ظپظˆط¸ ظ…ظ† ظ…ط±ط§ط¬ط¹ط© ط§ظ„ظ…ط³طھظ†ط¯', sourceDocument: pendingWeavingSlipImage ? { type:reviewType === 'deltexIssue' ? 'raw-issue-review-image' : 'saved-order-review-image', image:pendingWeavingSlipImage } : null }));
    if (!rawSaved) {
      await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط¥ط°ظ† ط§ظ„ط®ط§ظ… ط§ظ„ظ…ط³طھظˆط±ط¯ ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ظ…ط³طھظ†ط¯ ظƒط§ظ…ظ„ظ‹ط§.');
      return;
    }
  }
  for (const row of accessoryRows) {
    const savedAccessory = await postBackend('/batches/accessory', batchToApi({ id:uid(), orderId, date:suggestion.orderDate, accessoryType:row.accessoryType || accessoryType || 'ط¥ظƒط³ط³ظˆط§ط±', quantity:Number(row.quantity || 0), noteNumber:suggestion.rawNoteNumber || '', notes:`ظ„ظˆظ† ظ…ط±طھط¨ط·: ${row.pantoneCode || '-'}`, movement:'sent' }));
    if (!savedAccessory) {
      await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط¥ظƒط³ط³ظˆط§ط± ط§ظ„ظ…ط³طھظ†ط¯ ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ظ…ط³طھظ†ط¯ ظƒط§ظ…ظ„ظ‹ط§.');
      return;
    }
  }
  selectedOrderId = orderId;
  await loadBackendData();
  refs.weavingSlipDialog.close();
}
function repairGlobalArabicText() {
  document.querySelectorAll('#documentTitle, button, h2, h3, th, .eyebrow, .empty-state').forEach((element)=>{
    if (isLegacyRecoveredText(element.textContent || '')) element.textContent = 'ظ…ط±ط§ط¬ط¹ط©';
  });
}

function renderAll() { ensureRuntimeCollections(); ensureFinishedSaleUi(); renderPricings(); renderOrderFilters(); ensureStageFilterOptions(); renderOrders(); renderFinishedSalePanel(); applyCustomerNameDatalist(); applyFabricNameDatalist(); renderOperationFollowPanel(); renderTodayOrdersPanel?.(); renderOperationalAiDashboard?.(); renderDetails(); repairGlobalArabicText(); applyPermissionVisibility(); }
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
  refs.weavingSlipOrderNumber.innerHTML = `<option value="">ط§ط®طھط± ط§ظ„ط·ظ„ط¨ ط§ظ„ظ…ط±طھط¨ط· ط¨ط§ظ„ظ…ط³طھظ†ط¯</option>${orders.map((order)=>`<option value="${escapeHtml(order.id)}">${escapeHtml(order.orderNumber)} - ${escapeHtml(order.customer)} - ${escapeHtml(order.fabricType)}</option>`).join('')}`;
}
function normalizeNote(value) {
  const arabicDigits = 'ظ ظ،ظ¢ظ£ظ¤ظ¥ظ¦ظ§ظ¨ظ©';
  const persianDigits = 'غ°غ±غ²غ³غ´غµغ¶غ·غ¸غ¹';
  return String(value || '').trim()
    .replace(/[ظ -ظ©]/g, (digit)=>String(arabicDigits.indexOf(digit)))
    .replace(/[غ°-غ¹]/g, (digit)=>String(persianDigits.indexOf(digit)))
    .replace(/\s+/g, '');
}
function findOrderByReviewedNote(noteNumber) {
  const note = normalizeNote(noteNumber);
  if (!note) return null;
  const sources = [
    ...rawBatches.map((batch)=>({ kind:'ط¯ظپط¹ط© ط®ط±ظˆط¬ ط®ط§ظ… ظ„ظ„ظ…طµط¨ط؛ط©', orderId:batch.orderId, allocationId:'', batch })),
    ...accessoryBatches.map((batch)=>({ kind:'ط¥ظƒط³ط³ظˆط§ط±', orderId:batch.orderId, allocationId:'', batch })),
    ...productionBatches.map((batch)=>({ kind:'ط§ط³طھظ„ط§ظ… ظ…ط¬ظ‡ط² ظ…ظ† ط§ظ„ظ…طµط¨ط؛ط©', orderId:allocations.find((item)=>item.id===batch.allocationId)?.orderId || '', allocationId:batch.allocationId, batch })),
    ...customerBatches.map((batch)=>({ kind:'طھط³ظ„ظٹظ… ط¹ظ…ظٹظ„', orderId:allocations.find((item)=>item.id===batch.allocationId)?.orderId || '', allocationId:batch.allocationId, batch })),
  ];
  return sources.find((item)=> item.orderId && normalizeNote(item.batch.noteNumber) === note) || null;
}
function matchReviewByNoteNumber() {
  const match = findOrderByReviewedNote(refs.weavingSlipNoteNumber.value);
  if (!match) {
    refs.reviewMatchStatus.textContent = 'ظ„ظ… ظٹطھظ… ط§ظ„ط¹ط«ظˆط± ط¹ظ„ظ‰ ط·ظ„ط¨ ظ…ط±طھط¨ط· ط¨ظ‡ط°ط§ ط§ظ„ط±ظ‚ظ…. ط±ط§ط¬ط¹ ط±ظ‚ظ… ط§ظ„ط¥ط°ظ† ط£ظˆ ط§ط®طھط± ط§ظ„ط·ظ„ط¨ ظٹط¯ظˆظٹظ‹ط§.';
    return;
  }
  refs.weavingSlipOrderNumber.value = match.orderId;
  updateDocumentReviewFields();
  if (match.allocationId && refs.weavingSlipAllocation) refs.weavingSlipAllocation.value = match.allocationId;
  if (!refs.weavingSlipQuantity.value && match.batch.quantity) refs.weavingSlipQuantity.value = match.batch.quantity;
  const order = orders.find((item)=>item.id===match.orderId);
  refs.reviewMatchStatus.textContent = `طھظ…طھ ط§ظ„ظ…ط·ط§ط¨ظ‚ط© ظ…ط¹ ط§ظ„ط·ظ„ط¨ ${order?.orderNumber || '-'} / ${order?.customer || '-'} ظ…ظ† ط®ظ„ط§ظ„ ${match.kind}. ط±ط§ط¬ط¹ ط§ظ„ط¨ظٹط§ظ†ط§طھ ظ‚ط¨ظ„ ط§ظ„طھط³ط¬ظٹظ„.`;
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
  refs.weavingSlipWidthLine.innerHTML = '<option value="">ط§ط®طھط± ط§ظ„ط¹ط±ط¶ / ط§ظ„ط¨ظˆطµط© ط¨ط¹ط¯ ط§ط®طھظٹط§ط± ط§ظ„ط·ظ„ط¨</option>';
  refs.weavingSlipAllocation.innerHTML = '<option value="">ط§ط®طھط± ط§ظ„ظ„ظˆظ† / ط§ظ„ط¨ظ†ط¯ ط¨ط¹ط¯ ط§ط®طھظٹط§ط± ط§ظ„ط·ظ„ط¨</option>';
  refs.weavingSlipWidthLine.required = false;
  if (!order) return;
  refs.weavingSlipWidthLine.innerHTML = order.widthMode === 'multiple'
    ? `<option value="">ط§ط®طھط± ط§ظ„ط¹ط±ط¶ ط§ظ„ظ…ط·ظ„ظˆط¨</option>${order.widthLines.map((item)=>`<option value="${item.id}">ط¨ظˆطµط© ${item.inch} / ط¹ط±ط¶ ${item.width} / ظƒظ…ظٹط© ${item.quantity}</option>`).join('')}`
    : `<option value="">ط؛ظٹط± ظ…ط·ظ„ظˆط¨ ظ„ط·ظ„ط¨ ط¹ط±ط¶ ظˆط§ط­ط¯</option>`;
  refs.weavingSlipWidthLine.required = needsRawIssueFields && order.widthMode === 'multiple';
  refs.weavingSlipAllocation.innerHTML = `<option value="">ط§ط®طھط± ط§ظ„ظ„ظˆظ† / ط§ظ„ط¨ظ†ط¯</option>${order.allocations.map((item)=>`<option value="${escapeHtml(item.id)}">${escapeHtml(item.color)} / ط¹ط±ط¶ ${escapeHtml(item.targetFinishedWidth)} / ظƒظ…ظٹط© ${escapeHtml(item.plannedQuantity)}</option>`).join('')}`;
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
  if (!order) { alert('ط§ط®طھط± ط§ظ„ط·ظ„ط¨ ط§ظ„ظ…ط±طھط¨ط· ط¨ط§ظ„ظ…ط³طھظ†ط¯ ظ‚ط¨ظ„ ط§ظ„طھط³ط¬ظٹظ„.'); return; }
  const type = refs.weavingSlipType.value;
  const isRawIssue = type === 'weaving' || type === 'deltexIssue';
  if (isRawIssue && order.widthMode === 'multiple' && !refs.weavingSlipWidthLine.value) { alert('ط§ط®طھط± ط§ظ„ط¹ط±ط¶ / ط§ظ„ط¨ظˆطµط© ط§ظ„ظ…ط±طھط¨ط·ط© ط¨ط¥ط°ظ† ط§ظ„ط®ط§ظ….'); return; }
  if ((type === 'production' || type === 'customer') && !refs.weavingSlipAllocation.value) { alert('ط§ط®طھط± ط§ظ„ظ„ظˆظ† / ط§ظ„ط¨ظ†ط¯ ط§ظ„ظ…ط±طھط¨ط· ط¨ط§ظ„ط­ط±ظƒط©.'); return; }
  const quantity = Number(refs.weavingSlipQuantity.value || 0);
  if (!quantity) { alert('ط£ط¯ط®ظ„ ط§ظ„ظƒظ…ظٹط© ظ‚ط¨ظ„ ط§ظ„طھط³ط¬ظٹظ„.'); return; }
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
  if (!(await ensureBackendForWrite('طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط¨ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… طھط³ط¬ظٹظ„ ط§ظ„ظ…ط³طھظ†ط¯.'))) return;
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
    await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ط³طھظ†ط¯ ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„طھط³ط¬ظٹظ„.');
    return;
  }
  await loadBackendData();
  refs.weavingSlipDialog.close();
}

function documentHeader() {
  return '<div class="document-brand"><div class="document-brand-info"><strong>2B Tex</strong><span>ط§ظ„ط¹ط§ط´ط± ظ…ظ† ط±ظ…ط¶ط§ظ†</span><span>ط®ط¯ظ…ط© ط§ظ„ط¹ظ…ظ„ط§ط،: 01000343835</span></div><div class="document-brand-logo"><img src="./2b-mark.svg" alt="2B Tex"><span>ظ„ظ„ظ†ط³ظٹط¬ ظˆط§ظ„طµط¨ط§ط؛ط© ظˆط§ظ„طھط¬ظ‡ظٹط²</span></div></div>';
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
  const cards = images.map((item)=>`<figure><img src="${item.image}" alt="طµظˆط±ط© ط¥ط°ظ† ط§ظ„ط®ط§ظ… ${item.noteNumber}"><figcaption>ط¥ط°ظ† ط®ط§ظ…: ${item.noteNumber}</figcaption></figure>`).join('');
  return `<section class="report-section raw-permit-section"><h3>طµظˆط±ط© ط¥ط°ظ† ط§ظ„ط®ط§ظ…</h3><div class="raw-permit-gallery">${cards}</div></section>`;
}

function renderDyehouseDocumentPicker(order) {
  const names = dyehouseNamesForOrder(order);
  refs.documentTitle.textContent = 'ط§ط®طھظٹط§ط± ط£ظ…ط± طµط¨ط§ط؛ط©';
  refs.documentBody.dataset.documentType = 'dyeing-picker';
  refs.documentBody.dataset.dyehouseName = '';
  refs.documentBody.innerHTML = `<div class="document-sheet">
    ${documentHeader()}
    <div class="report-title"><h2>ط§ط®طھظٹط§ط± ط£ظ…ط± طµط¨ط§ط؛ط©</h2><span>ط§ط®طھط± ط§ظ„ظ…طµط¨ط؛ط© ط§ظ„ظ…ط·ظ„ظˆط¨ط© ظ„ظپطھط­ ط£ظ…ط± طھط´ط؛ظٹظ„ ظ…ظ†ظپطµظ„ ظ„ظƒظ„ ظ…طµط¨ط؛ط©.</span></div>
    <table><thead><tr><th>ط§ظ„ظ…طµط¨ط؛ط©</th><th>ط¹ط¯ط¯ ط§ظ„ط£ظ„ظˆط§ظ†</th><th>ط¥ط¬ظ…ط§ظ„ظٹ ظƒظ…ظٹط© ط§ظ„طµط¨ط§ط؛ط©</th><th>ط¥ط¬ط±ط§ط،</th></tr></thead><tbody>${names.map((name)=>{
      const rows = scopedDyehouseRowsForPicker(order, name);
      const quantity = rows.reduce((total, row)=>total + Number(row.plannedQuantity || 0), 0);
      return `<tr><td>${escapeHtml(name)}</td><td>${rows.length}</td><td>${formatNumber(quantity)}</td><td><button class="mini-btn gold" type="button" data-open-dyeing-for="${escapeHtml(name)}">ظپطھط­ ط£ظ…ط± ط§ظ„طµط¨ط§ط؛ط©</button></td></tr>`;
    }).join('') || emptyRow(4, 'ظ„ط§ طھظˆط¬ط¯ ظ…طµط§ط¨ط؛ ظ…ط±طھط¨ط·ط© ط¨ظ‡ط°ط§ ط§ظ„ط·ظ„ط¨.')}</tbody></table>
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
    ? `ظ…ظ„ط§ط­ط¸ط§طھ ط£ظ…ط± طھط´ط؛ظٹظ„ ط§ظ„طµط¨ط§ط؛ط©${dyehouseName ? ` - ${dyehouseName}` : ''}`
    : 'ظ…ظ„ط§ط­ط¸ط§طھ ط£ظ…ط± طھط´ط؛ظٹظ„ ط§ظ„ظ†ط³ظٹط¬';
  const value = prompt(title, current);
  if (value === null) return null;
  sourceOrder.operationNotes = sourceOrder.operationNotes && typeof sourceOrder.operationNotes === 'object' && !Array.isArray(sourceOrder.operationNotes) ? sourceOrder.operationNotes : {};
  sourceOrder.operationNotes[key] = value.trim();
  if (backendAvailable) {
    const customerId = await ensureBackendCustomer(sourceOrder.customer);
    const savedOrder = await putBackend(`/orders/${sourceOrder.id}`, orderToApi(sourceOrder, customerId));
    if (!savedOrder) {
      await rollbackAfterBackendWriteFailure('طھط¹ط°ط± ط­ظپط¸ ظ…ظ„ط§ط­ط¸ط§طھ ط§ظ„طھظ‚ط±ظٹط± ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. ظ„ظ… ظٹطھظ… ظپطھط­ ط§ظ„طھظ‚ط±ظٹط±.');
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
ensurePricingItemsUi();
installGroupedOrderUi();
refs.openPricingFormBtn.onclick = () => { editingPricingId = null; pendingPricingOrderId = null; if (refs.deletePricingBtn) refs.deletePricingBtn.style.display = 'none'; refs.pricingForm.reset(); refs.pricingNumber.value = nextPricingNumber(); refs.pricingDate.value = new Date().toISOString().slice(0,10); applyPricingMaterialOptions(); applyPricingDyehouseOptions(); renderPricingItemsEditor(); syncAutoCodes(); updatePricingPreview(); refs.pricingDialog.showModal(); };
refs.deletePricingBtn.onclick = () => { if (editingPricingId) deletePricing(editingPricingId).catch((error)=>{ console.error('pricing-delete-error', error); alert('طھط¹ط°ط± ط­ط°ظپ ط§ظ„طھط³ط¹ظٹط±ط©.'); }); };
if (refs.openDocumentReviewBtn) refs.openDocumentReviewBtn.onclick = openDocumentReviewDialog;
refs.openOrderFormBtn.onclick = () => { setOrderFormPricingConversionMode(false); pendingConvertedPricingId = null; pendingConvertedPricingItems = []; pendingConvertedOrderDrafts = []; editingOrderId = null; refs.orderForm.reset(); refs.orderNumber.value = nextPricingNumber(); refs.orderDate.value = new Date().toISOString().slice(0,10); syncAutoCodes(); renderWidthLinesEditor(); renderAccessoryLinesEditor(); syncWidthModeUi(); resetGroupedOrderRows(); refs.orderDialog.showModal(); };
if (refs.openOrdersReportBtn) refs.openOrdersReportBtn.onclick = openOrdersReport;
if (refs.printFilteredOrdersBtn) refs.printFilteredOrdersBtn.onclick = openFilteredOrdersReport;
if (refs.printFilteredPricingsBtn) refs.printFilteredPricingsBtn.onclick = openFilteredPricingsReport;
if (refs.openDyehouseBalancesReportBtn) refs.openDyehouseBalancesReportBtn.onclick = openDyehouseBalancesReport;
if (refs.openManagementReportsBtn) refs.openManagementReportsBtn.onclick = openManagementReportsMenu;
ensureStartGateActionCards();

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
    if (!selectedOrderId) { alert('ط§ط®طھط± ط·ظ„ط¨ظ‹ط§ ط£ظˆظ„ظ‹ط§ ظ„ظپطھط­ ط§ظ„ظ…ط³طھظ†ط¯.'); return; }
    closeSidebar();
    safeOpenDocument(docType);
  }
});
if (refs.documentBody) refs.documentBody.addEventListener('click', (event)=>{
  const editPricingDocButton = event.target.closest('[data-edit-pricing-doc]');
  if (editPricingDocButton) {
    event.preventDefault();
    event.stopPropagation();
    editPricing(editPricingDocButton.dataset.editPricingDoc);
    return;
  }
  const convertPricingDocButton = event.target.closest('[data-convert-pricing]');
  if (convertPricingDocButton) {
    event.preventDefault();
    event.stopPropagation();
    convertPricingToOrder(convertPricingDocButton.dataset.convertPricing);
    return;
  }
  if (event.target.closest('[data-save-gluing-source]')) {
    saveGluingSourceFromDialog(event.target.closest('form')).catch((error)=>{ console.error('gluing-source-save-error', error); alert('طھط¹ط°ط± ط³ط­ط¨ ط§ظ„ط®ط§ظ…ط© ط¥ظ„ظ‰ ط¹ظ…ظ„ظٹط© ط§ظ„ط¯ظ…ط¬.'); });
    return;
  }
  if (event.target.closest('[data-save-gluing-merge]')) {
    saveGluingMergeFromDialog(event.target.closest('form')).catch((error)=>{ console.error('gluing-merge-save-error', error); alert('طھط¹ط°ط± ط­ظپط¸ ط¹ظ…ظ„ظٹط© ط§ظ„ط¯ظ…ط¬.'); });
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
    const label = addGroupButton.dataset.rowLabel || 'ط§ط³ظ… ط§ظ„ط¨ظ†ط¯';
    [...refs.documentBody.querySelectorAll('[data-whatsapp-group-rows]')].find((body)=>body.dataset.whatsappGroupRows === type)?.insertAdjacentHTML('beforeend', whatsappSettingsRowHtml(type, label));
    refs.documentBody.querySelectorAll('[data-group-name]').forEach((input)=>input.setAttribute('list', 'whatsappGroupNames'));
  }
  const deleteButton = event.target.closest('[data-delete-group-row]');
  if (deleteButton) deleteButton.closest('[data-whatsapp-group-row]')?.remove();
  if (event.target.closest('[data-run-whatsapp-schedule-now]')) {
    const currentSettings = {
      ...scheduledReportSettings(),
      enabled: true,
      groupName: refs.documentBody.querySelector('[data-schedule-group]')?.value.trim() || refs.documentBody.querySelector('[data-general-report-group]')?.value.trim() || '',
      includeOperations: !!refs.documentBody.querySelector('[data-schedule-section="includeOperations"]')?.checked,
      includeDyehouse: !!refs.documentBody.querySelector('[data-schedule-section="includeDyehouse"]')?.checked,
      includeReady: !!refs.documentBody.querySelector('[data-schedule-section="includeReady"]')?.checked,
      includeDelayed: !!refs.documentBody.querySelector('[data-schedule-section="includeDelayed"]')?.checked,
      includeWaste: !!refs.documentBody.querySelector('[data-schedule-section="includeWaste"]')?.checked,
    };
    const row = enqueueScheduledWhatsappReport(currentSettings, `manual-${Date.now()}`);
    alert(row ? 'طھظ…طھ ط¥ط¶ط§ظپط© طھظ‚ط±ظٹط± طھط¬ط±ط¨ط© ط¥ظ„ظ‰ ظ‚ط§ط¦ظ…ط© ط§ظ„ط¥ط±ط³ط§ظ„.' : 'ط­ط¯ط¯ ط¬ط±ظˆط¨ ط§ظ„طھظ‚ط±ظٹط± ط§ظ„ط¯ظˆط±ظٹ ط£ظˆظ„ظ‹ط§.');
    return;
  }
  if (event.target.closest('[data-save-whatsapp-settings]')) saveWhatsappSettingsFromDialog().catch((error)=>{ console.error('whatsapp-settings-save-error', error); alert('طھط¹ط°ط± ط­ظپط¸ ط¥ط¹ط¯ط§ط¯ط§طھ ظˆط§طھط³ط§ط¨.'); });
  if (event.target.closest('[data-add-price-row]')) {
    refs.documentBody.querySelector('[data-dyehouse-price-rows]')?.insertAdjacentHTML('beforeend', dyehousePriceRowHtml());
  }
  const deletePriceButton = event.target.closest('[data-delete-price-row]');
  if (deletePriceButton) deletePriceButton.closest('[data-dyehouse-price-row]')?.remove();
  if (event.target.closest('[data-save-dyehouse-prices]')) saveDyehousePricesFromDialog().catch((error)=>{ console.error('dyehouse-prices-save-error', error); alert('طھط¹ط°ط± ط­ظپط¸ ط£ط³ط¹ط§ط± ط§ظ„ظ…طµط§ط¨ط؛.'); });
  const dyeingDocButton = event.target.closest('[data-open-dyeing-for]');
  if (dyeingDocButton) openDyeingDocumentForDyehouse(dyeingDocButton.dataset.openDyeingFor).catch((error)=>{ console.error('dyeing-document-open-error', error); alert('طھط¹ط°ط± ظپطھط­ ط£ظ…ط± ط§ظ„طµط¨ط§ط؛ط© ط­ط§ظ„ظٹظ‹ط§.'); });
  if (event.target.closest('[data-refresh-a5-accounts]')) renderA5AccountsDialog();
  const a5LedgerButton = event.target.closest('[data-a5-ledger]');
  if (a5LedgerButton) renderA5LedgerDialog(a5LedgerButton.dataset.a5Ledger);
  if (event.target.closest('[data-back-a5-accounts]')) renderA5AccountsDialog();
  const ledgerButton = event.target.closest('[data-customer-ledger]');
  if (ledgerButton) renderCustomerLedgerDialog(ledgerButton.dataset.customerLedger);
  const editCustomerMasterButton = event.target.closest('[data-edit-customer-master]');
  if (editCustomerMasterButton) fillCustomerMasterForm(editCustomerMasterButton.dataset.editCustomerMaster);
  const deleteCustomerMasterButton = event.target.closest('[data-delete-customer-master]');
  if (deleteCustomerMasterButton) deleteCustomerMaster(deleteCustomerMasterButton.dataset.deleteCustomerMaster).catch((error)=>{ console.error('customer-master-delete-error', error); alert(error.message || 'طھط¹ط°ط± ط­ط°ظپ ط§ظ„ط¹ظ…ظٹظ„.'); });
  if (event.target.closest('[data-clear-customer-master]')) clearCustomerMasterForm();
  if (event.target.closest('[data-save-customer-master]')) saveCustomerMasterFromDialog().catch((error)=>{ console.error('customer-master-save-error', error); alert(error.message || 'طھط¹ط°ط± ط­ظپط¸ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¹ظ…ظٹظ„.'); });
  if (event.target.closest('[data-back-customer-accounts]')) renderCustomerAccountsDialog();
  const openingButton = event.target.closest('[data-save-opening-balance]');
  if (openingButton) saveCustomerOpeningBalance(openingButton.dataset.saveOpeningBalance).catch((error)=>{ console.error('customer-opening-save-error', error); alert('طھط¹ط°ط± ط­ظپط¸ ط±طµظٹط¯ ط§ظ„ط¹ظ…ظٹظ„.'); });
  const paymentButton = event.target.closest('[data-add-customer-payment]');
  if (paymentButton) addCustomerPayment(paymentButton.dataset.addCustomerPayment).catch((error)=>{ console.error('customer-payment-save-error', error); alert('طھط¹ط°ط± ط­ظپط¸ ط¯ظپط¹ط© ط§ظ„ط¹ظ…ظٹظ„.'); });
  const deletePaymentButton = event.target.closest('[data-delete-customer-payment]');
  if (deletePaymentButton) deleteCustomerPayment(deletePaymentButton.dataset.customerName, deletePaymentButton.dataset.deleteCustomerPayment).catch((error)=>{ console.error('customer-payment-delete-error', error); alert('طھط¹ط°ط± ط­ط°ظپ ط¯ظپط¹ط© ط§ظ„ط¹ظ…ظٹظ„.'); });
  if (event.target.closest('[data-new-system-user]')) openSystemUserForm();
  if (event.target.closest('[data-back-system-users]')) openUsersDialog();
  const editUserButton = event.target.closest('[data-edit-system-user]');
  if (editUserButton) {
    const users = JSON.parse(refs.documentBody.dataset.usersJson || '[]');
    openSystemUserForm(users.find((user)=>user.id === editUserButton.dataset.editSystemUser) || null);
  }
  const saveUserButton = event.target.closest('[data-save-system-user]');
  if (saveUserButton) saveSystemUser(saveUserButton.dataset.saveSystemUser).catch((error)=>{ console.error('system-user-save-error', error); alert(error.message || 'طھط¹ط°ط± ط­ظپط¸ ط§ظ„ظ…ط³طھط®ط¯ظ….'); });
  const deleteUserButton = event.target.closest('[data-delete-system-user]');
  if (deleteUserButton) deleteSystemUser(deleteUserButton.dataset.deleteSystemUser).catch((error)=>{ console.error('system-user-delete-error', error); alert(error.message || 'طھط¹ط°ط± ط­ط°ظپ ط§ظ„ظ…ط³طھط®ط¯ظ….'); });
  if (event.target.closest('[data-add-bulk-note-number]')) {
    refs.documentBody.querySelector('[data-bulk-note-list]')?.insertAdjacentHTML('beforeend', bulkNoteNumberFieldHtml());
  }
  const removeBulkNoteButton = event.target.closest('[data-remove-bulk-note-number]');
  if (removeBulkNoteButton) {
    const rows = refs.documentBody.querySelectorAll('[data-bulk-note-row]');
    if (rows.length > 1) removeBulkNoteButton.closest('[data-bulk-note-row]')?.remove();
    else {
      const noteInput = removeBulkNoteButton.closest('[data-bulk-note-row]')?.querySelector('[data-bulk-note-number]');
      if (noteInput) noteInput.value = '';
    }
  }
  if (event.target.closest('[data-add-bulk-extra-raw]')) {
    const defaultDyehouse = calculateOrder(orders.find((item)=>item.id===selectedOrderId))?.dyehouse || '';
    refs.documentBody.querySelector('[data-bulk-extra-raw-anchor]')?.insertAdjacentHTML('afterend', bulkExtraRawRowHtml(defaultDyehouse));
  }
  const removeBulkExtraRawButton = event.target.closest('[data-remove-bulk-extra-raw]');
  if (removeBulkExtraRawButton) removeBulkExtraRawButton.closest('[data-bulk-extra-raw-row]')?.remove();
  if (event.target.closest('[data-save-bulk-batches]')) saveBulkBatchesFromDialog().catch((error)=>{ console.error('bulk-batches-save-error', error); alert(error.message || 'طھط¹ط°ط± ط­ظپط¸ ط§ظ„ط¥ط¯ط®ط§ظ„ ط§ظ„ط¬ظ…ط§ط¹ظٹ.'); });
});

refs.closePricingFormBtn.onclick = () => { pendingPricingOrderId = null; refs.pricingDialog.close(); };
refs.closeOrderFormBtn.onclick = () => { setOrderFormPricingConversionMode(false); pendingConvertedPricingId = null; pendingConvertedPricingItems = []; pendingConvertedOrderDrafts = []; refs.orderDialog.close(); };
refs.pricingForm.onsubmit = (event) => addPricing(event).catch((error)=>{ console.error('pricing-save-error', error); alert('طھط¹ط°ط± ط­ظپط¸ ط§ظ„طھط³ط¹ظٹط±ط©.'); });
if (refs.savePricingBtn) refs.savePricingBtn.onclick = refs.pricingForm.onsubmit;
refs.pricingNumber.readOnly = true;
['pricingQuantity','pricingRawCost','pricingDyeCost','pricingWastePercent','pricingExtraCost','pricingProfitPerKg'].forEach((key)=>refs[key].oninput = updatePricingPreview);
['pricingDyehouse','pricingMaterialType'].forEach((key)=>refs[key].onchange = () => { applyPricingColorOptions(); updateSuggestedDyeCost(); });
refs.pricingColorClass.onchange = updateSuggestedDyeCost;
refs.widthMode.onchange = syncWidthModeUi;
refs.addWidthLineBtn.onclick = () => refs.widthLinesEditor.insertAdjacentHTML('beforeend', widthLineRowHtml());
refs.widthLinesEditor.onclick = (event) => { if (event.target.dataset.removeWidthLine !== undefined) event.target.closest('.width-line-row')?.remove(); };
refs.addAccessoryLineBtn.onclick = () => refs.accessoryLinesEditor.insertAdjacentHTML('beforeend', accessoryLineRowHtml());
refs.accessoryLinesEditor.onclick = (event) => { if (event.target.dataset.removeAccessoryLine !== undefined) event.target.closest('.accessory-line-row')?.remove(); };
refs.orderForm.onsubmit = (event) => addOrder(event).catch((error)=>{ console.error('order-save-error', error); alert('طھط¹ط°ط± ط­ظپط¸ ط§ظ„ط·ظ„ط¨.'); });
refs.orderNumber.oninput = syncAutoCodes;
refs.searchInput.oninput = refs.orderStatusFilter.oninput = refs.customerFilter.oninput = refs.dyehouseFilter.oninput = refs.fabricFilter.oninput = renderOrders;
[refs.pricingSearchInput, refs.pricingCustomerFilter, refs.pricingStatusFilter].filter(Boolean).forEach((input)=>{
  input.oninput = renderPricings;
  input.onchange = renderPricings;
});
refs.pricingTableBody.onclick = (event) => {
  const pricingQuoteButton = event.target.closest('[data-pricing-quote]');
  if (pricingQuoteButton) { openPricingQuotation(pricingQuoteButton.dataset.pricingQuote); return; }
  const pricingCostButton = event.target.closest('[data-pricing-cost]');
  if (pricingCostButton) { openPricingCostSheet(pricingCostButton.dataset.pricingCost); return; }
  const openOrderButton = event.target.closest('[data-open-order]');
  if (openOrderButton) { openOrderFocusMode(openOrderButton.dataset.openOrder); return; }
  const convertPricingButton = event.target.closest('[data-convert-pricing]');
  if (convertPricingButton) { convertPricingToOrder(convertPricingButton.dataset.convertPricing); return; }
  const editPricingButton = event.target.closest('[data-edit-pricing]');
  if (editPricingButton) { editPricing(editPricingButton.dataset.editPricing); return; }
  const deletePricingButton = event.target.closest('[data-delete-pricing]');
  if (deletePricingButton) deletePricing(deletePricingButton.dataset.deletePricing).catch((error)=>{ console.error('pricing-delete-error', error); alert('طھط¹ط°ط± ط­ط°ظپ ط§ظ„طھط³ط¹ظٹط±ط©.'); });
};
function handleOrderTableClick(event) {
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
      recordAudit('error', 'orderDetails', button.dataset.view, null, { message: error && error.message ? error.message : String(error) }, 'ظپط´ظ„ ظپطھط­ طھظپط§طµظٹظ„ ط§ظ„ط·ظ„ط¨');
      persistAuditLog().catch((saveError)=>console.warn('audit-save-failed', saveError));
      refs.orderDetailsPanel.innerHTML = '<div class="empty-state">طھط¹ط°ط± ظپطھط­ طھظپط§طµظٹظ„ ط§ظ„ط·ظ„ط¨ ط­ط§ظ„ظٹظ‹ط§. ط±ط§ط¬ط¹ ط§ظ„ط¨ظٹط§ظ†ط§طھ ط«ظ… ط­ط§ظˆظ„ ظ…ط±ط© ط£ط®ط±ظ‰.</div>';
      alert(`طھط¹ط°ط± ظپطھط­ طھظپط§طµظٹظ„ ط§ظ„ط·ظ„ط¨. ط³ط¨ط¨ ط§ظ„ط®ط·ط£: ${error && error.message ? error.message : String(error)}`);
    }
    return;
  }
  if (button.dataset.editOrder) {
    setOrderFormPricingConversionMode(false);
    pendingConvertedPricingId = null;
    pendingConvertedPricingItems = [];
    pendingConvertedOrderDrafts = [];
    editingOrderId = button.dataset.editOrder;
    const order = orders.find((item)=>item.id===editingOrderId);
    if (order) { selectedOrderId = order.id; fillOrderForm(order); refs.orderDialog.showModal(); }
    return;
  }
  if (button.dataset.deleteOrder) deleteOrder(button.dataset.deleteOrder).catch((error)=>{ console.error('order-delete-error', error); alert('طھط¹ط°ط± ط­ط°ظپ ط§ظ„ط·ظ„ط¨.'); });
}
[refs.ordersTableBody, refs.weavingOrdersTableBody, refs.dyehouseOrdersTableBody, refs.warehouseOrdersTableBody]
  .filter(Boolean)
  .forEach((body) => { body.onclick = handleOrderTableClick; });

function syncMobileTableLabels(root = document) {
  root.querySelectorAll?.('table.mobile-card-table').forEach((table) => {
    const labels = [...table.querySelectorAll('thead th')].map((cell) => cell.textContent.trim());
    if (!labels.length) return;
    table.querySelectorAll('tbody tr').forEach((row) => {
      [...row.children].forEach((cell, index) => {
        if (cell.tagName !== 'TD' || cell.dataset.label || !labels[index]) return;
        cell.dataset.label = labels[index];
      });
    });
  });
}

function installMobileTableLabelSync() {
  syncMobileTableLabels();
  const observer = new MutationObserver((mutations) => {
    if (!mutations.some((mutation) => mutation.addedNodes.length)) return;
    syncMobileTableLabels(document);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

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
document.addEventListener('change', (event) => {
  if (event.target?.id === 'finishedSaleFabric') {
    renderFinishedSaleRows();
    renderFinishedTransferTargets();
  }
});
document.addEventListener('submit', (event) => {
  if (event.target?.id === 'mainWarehouseStockForm') {
    saveMainWarehouseStock(event).catch((error)=>{
      console.error('main-warehouse-stock-save-error', error);
      alert(error.message || 'طھط¹ط°ط± ط­ظپط¸ ط±طµظٹط¯ ط§ظ„ظ…ط®ط²ظ† ط§ظ„ط±ط¦ظٹط³ظٹ.');
    });
  }
  if (event.target?.id === 'finishedSaleForm') {
    saveFinishedStockSale(event).catch((error)=>{
      console.error('finished-sale-save-error', error);
      alert(error.message || 'طھط¹ط°ط± ط­ظپط¸ ط¨ظٹط¹ ظ…ط¬ظ‡ط².');
    });
  }
  if (event.target?.id === 'finishedTransferForm') {
    saveFinishedStockTransfer(event).catch((error)=>{
      console.error('finished-transfer-save-error', error);
      alert(error.message || 'طھط¹ط°ط± ط­ظپط¸ طھط­ظˆظٹظ„ ط±طµظٹط¯ ظ…ط¬ظ‡ط².');
    });
  }
});
refs.orderDetailsPanel.addEventListener('submit', (event) => {
  addBatch(event).catch((error) => {
    console.error('batch-save-error', error);
    alert('طھط¹ط°ط± ط­ظپط¸ ط§ظ„ط­ط±ظƒط©. ط±ط§ط¬ط¹ ط§ظ„ط¨ظٹط§ظ†ط§طھ ط«ظ… ط­ط§ظˆظ„ ظ…ط±ط© ط£ط®ط±ظ‰.');
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
    setOrderFormPricingConversionMode(false);
    editingOrderId = selectedOrderId;
    const order = orders.find((item)=>item.id===selectedOrderId);
    if (order) { fillOrderForm(order); refs.orderDialog.showModal(); }
    return;
  }
  if (target.id === 'focusDeleteOrderBtn') {
    if (selectedOrderId) deleteOrder(selectedOrderId).then(()=>{ if (!selectedOrderId) closeOrderFocusMode(); }).catch((error)=>{ console.error('order-delete-error', error); alert('طھط¹ط°ط± ط­ط°ظپ ط§ظ„ط·ظ„ط¨.'); });
    return;
  }
  if (target.id === 'editOrderBtn') { setOrderFormPricingConversionMode(false); pendingConvertedPricingId = null; pendingConvertedPricingItems = []; pendingConvertedOrderDrafts = []; editingOrderId = selectedOrderId; const order = orders.find((item)=>item.id===selectedOrderId); if (order) { fillOrderForm(order); refs.orderDialog.showModal(); } }
  if (target.id === 'toggleOperationClosedBtn') { event.preventDefault(); toggleOperationClosed().catch((error)=>{ console.error('operation-close-error', error); alert('طھط¹ط°ط± ط­ظپط¸ ط­ط§ظ„ط© ط¯ظˆط±ط© ط§ظ„طھط´ط؛ظٹظ„.'); }); return; }
  if (target.id === 'addAllocationBtn') addAllocation().catch((error)=>{ console.error('allocation-add-error', error); alert('طھط¹ط°ط± ط­ظپط¸ ط§ظ„ظ„ظˆظ†.'); });
  if (target.dataset.openCombinedMovement) {
    event.preventDefault();
    openBulkBatchDialog(target.dataset.openCombinedMovement);
    return;
  }
  if (target.dataset.openBulkEntry !== undefined) {
    event.preventDefault();
    openBulkBatchDialog(target.closest('.batch-form'));
    return;
  }
  if (target.dataset.editAllocation) editAllocation(target.dataset.editAllocation).catch((error)=>{ console.error('allocation-edit-error', error); alert('طھط¹ط°ط± طھط¹ط¯ظٹظ„ ط§ظ„ظ„ظˆظ†.'); });
  if (target.dataset.deleteAllocation) deleteAllocation(target.dataset.deleteAllocation).catch((error)=>{ console.error('allocation-delete-error', error); alert('طھط¹ط°ط± ط­ط°ظپ ط§ظ„ظ„ظˆظ†.'); });
  if (target.dataset.transferAllocation) {
    const transferContext = {
      sourceDyehouse: target.dataset.transferSourceDyehouse || '',
      availableQuantity: target.dataset.transferAvailableQuantity || '',
      accessorySummary: target.dataset.transferAccessorySummary || '',
    };
    transferAllocationDyehouse(target.dataset.transferAllocation, transferContext).catch((error)=>{ console.error('allocation-transfer-error', error); alert('طھط¹ط°ط± ط­ظپط¸ طھط­ظˆظٹظ„ ط§ظ„ظ…طµط¨ط؛ط©.'); });
  }
  const action = target.dataset.batchAction;
  if (action === 'delete') deleteBatch(target.dataset.batchType, target.dataset.batchId).catch((error)=>{ console.error('batch-delete-error', error); alert('طھط¹ط°ط± ط­ط°ظپ ط§ظ„ط­ط±ظƒط©.'); });
  if (action === 'edit') editBatch(target.dataset.batchType, target.dataset.batchId).catch((error)=>{ console.error('batch-edit-error', error); alert('طھط¹ط°ط± طھط¹ط¯ظٹظ„ ط§ظ„ط­ط±ظƒط©.'); });
  if (target.dataset.retryOutbox) retryOutbox(target.dataset.retryOutbox);
});
installDocumentsUiHandlers();
installTodayOrdersUiHandlers?.();
installMobileTableLabelSync();
if (refs.weavingSlipDialog) {
  refs.closeWeavingSlipBtn.onclick = () => refs.weavingSlipDialog.close();
  refs.weavingSlipType.onchange = () => { updateDocumentReviewFields(); if ((refs.weavingSlipType.value === 'amalOrder' || refs.weavingSlipType.value === 'deltexIssue') && refs.weavingSlipFile.files?.[0]) applyAmalSuggestionFromFile(refs.weavingSlipFile.files[0]); };
  refs.weavingSlipOrderNumber.onchange = updateDocumentReviewFields;
  refs.reviewMatchNoteBtn.onclick = matchReviewByNoteNumber;
  refs.weavingSlipFile.onchange = () => handleWeavingSlipFile().catch(()=>alert('طھط¹ط°ط± ظ‚ط±ط§ط،ط© طµظˆط±ط© ط§ظ„ظ…ط³طھظ†ط¯. ط¬ط±ظ‘ط¨ طµظˆط±ط© ط£ظˆط¶ط­ ط£ظˆ ظ…ظ„ظپظ‹ط§ ط¢ط®ط±.'));
refs.weavingSlipForm.onsubmit = (event) => confirmWeavingSlip(event).catch((error)=>{ console.error('document-review-save-error', error); alert('طھط¹ط°ط± طھط³ط¬ظٹظ„ ط§ظ„ظ…ط³طھظ†ط¯.'); });
}
refs.documentBody?.addEventListener('click', (event) => {
  if (event.target.closest('[data-create-backup]')) createBackupFromStatusDialog();
  if (event.target.closest('[data-save-fabric-master]')) saveFabricMasterFromDialog().catch((error)=>{ console.error('fabric-master-save-error', error); alert(error.message || 'طھط¹ط°ط± ط­ظپط¸ ط§ظ„ط£طµظ†ط§ظپ ط§ظ„ط±ط³ظ…ظٹط©.'); });
});
installAiUiHandlers();
initialLocalStorageSnapshot = captureLocalStorageSnapshot();
loadCurrentUser().finally(() => {
  installAutomationUi();
  pollBackendStatus();
  pollWhatsappService();
});
loadBackendData().finally(startWhatsappScheduleTimer);
setInterval(pollBackendStatus, 15000);
setInterval(pollWhatsappService, 15000);

"use strict";

var _refs$orderNotes;
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _toArray(r) { return _arrayWithHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var STORAGE_KEYS = {
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
  whatsappStatus: '2btex.whatsappStatus.v1'
};
var APP_VERSION = 'v2026.06.06.12';
var APP_BUILD_TIME = '2026-06-06 15:50';
// LEGACY_ARABIC_MARKER: بقايا كتل قديمة تالفة داخل app.js.
// المسارات المستخدمة فعليًا تم تجاوزها بدوال عربية سليمة في نهاية الملف، وهذه العلامة تبقى ظاهرة في البحث حتى لا نخفي مواضع التنظيف المتبقية.
var uid = function uid() {
  return "id-".concat(Date.now(), "-").concat(Math.random().toString(16).slice(2));
};
var clone = function clone(value) {
  return JSON.parse(JSON.stringify(value));
};
var load = function load(key, fallback, legacyKey) {
  try {
    var current = JSON.parse(localStorage.getItem(key));
    var legacy = legacyKey ? JSON.parse(localStorage.getItem(legacyKey)) : null;
    if (Array.isArray(current) && current.length) return current;
    if (Array.isArray(legacy) && legacy.length) return legacy;
    return clone(fallback);
  } catch (_unused) {
    return clone(fallback);
  }
};
var safeSetLocalStorage = function safeSetLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn('local-storage-write-skipped', key, error);
    return false;
  }
};
var save = function save() {
  ensureRuntimeCollections();
  safeSetLocalStorage(STORAGE_KEYS.customerAccounts, JSON.stringify(customerAccounts));
  safeSetLocalStorage(STORAGE_KEYS.reportOutbox, JSON.stringify(reportOutbox));
  safeSetLocalStorage(STORAGE_KEYS.whatsappSettings, JSON.stringify(whatsappSettings));
  safeSetLocalStorage(STORAGE_KEYS.auditLog, JSON.stringify(auditLog));
  safeSetLocalStorage(STORAGE_KEYS.whatsappStatus, JSON.stringify(whatsappStatus));
};
var OPERATIONAL_STORAGE_KEYS = [STORAGE_KEYS.orders, STORAGE_KEYS.allocations, STORAGE_KEYS.raw, STORAGE_KEYS.dye, STORAGE_KEYS.finished, STORAGE_KEYS.production, STORAGE_KEYS.customer, STORAGE_KEYS.accessory, STORAGE_KEYS.transfers, STORAGE_KEYS.rawReturns, STORAGE_KEYS.pricings];
function clearOperationalLocalStorageCache() {
  try {
    OPERATIONAL_STORAGE_KEYS.forEach(function (key) {
      return localStorage.removeItem(key);
    });
  } catch (_unused2) {}
}
clearOperationalLocalStorageCache();
var defaults = {
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
  whatsappSettings: {
    weavingGroupName: '2B - النسيج',
    dyeingGroupName: '2B - المصبغة',
    dyehousesReportGroupName: 'اوردارات 2B',
    dyehouseGroups: {},
    weavingGroups: {},
    customerGroups: {},
    sendingEnabled: false
  },
  auditLog: [],
  whatsappStatus: {
    status: 'disconnected',
    updatedAt: '',
    errorMessage: '',
    qrDataUrl: ''
  }
};
var orders = clone(defaults.orders);
var allocations = clone(defaults.allocations);
var rawBatches = clone(defaults.raw);
var dyeBatches = clone(defaults.dye);
var finishedBatches = clone(defaults.finished);
var productionBatches = clone(defaults.production);
var customerBatches = clone(defaults.customer);
var accessoryBatches = clone(defaults.accessory);
var dyehouseTransfers = clone(defaults.transfers);
var rawReturns = clone(defaults.rawReturns);
var pricings = clone(defaults.pricings);
var customerAccounts = function () {
  try {
    var saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.customerAccounts));
    return saved && _typeof(saved) === 'object' && !Array.isArray(saved) ? saved : clone(defaults.customerAccounts);
  } catch (_unused3) {
    return clone(defaults.customerAccounts);
  }
}();
var reportOutbox = load(STORAGE_KEYS.reportOutbox, defaults.reportOutbox);
var whatsappSettings = function () {
  try {
    return _objectSpread(_objectSpread({}, defaults.whatsappSettings), JSON.parse(localStorage.getItem(STORAGE_KEYS.whatsappSettings)) || {});
  } catch (_unused4) {
    return clone(defaults.whatsappSettings);
  }
}();
var auditLog = load(STORAGE_KEYS.auditLog, defaults.auditLog);
var whatsappStatus = function () {
  try {
    return _objectSpread(_objectSpread({}, defaults.whatsappStatus), JSON.parse(localStorage.getItem(STORAGE_KEYS.whatsappStatus)) || {});
  } catch (_unused5) {
    return clone(defaults.whatsappStatus);
  }
}();
var whatsappSettingsRefreshTimer = null;
if (!Array.isArray(reportOutbox)) reportOutbox = clone(defaults.reportOutbox);
if (!Array.isArray(auditLog)) auditLog = clone(defaults.auditLog);
if (!Array.isArray(customerBatches)) customerBatches = clone(defaults.customer);
if (!Array.isArray(dyehouseTransfers)) dyehouseTransfers = clone(defaults.transfers);
if (!Array.isArray(rawReturns)) rawReturns = clone(defaults.rawReturns);
var LEGACY_TEST_ORDER_NUMBERS = new Set(['2554']);
var LEGACY_TEST_CUSTOMERS = new Set(['ام احمد', 'أم أحمد', 'ام أحمد', 'أم احمد']);
function normalizeLegacyCustomerName(value) {
  return String(value || '').replace(/[إأآ]/g, 'ا').replace(/\s+/g, ' ').trim();
}
function isLegacyTestOrder(order) {
  return LEGACY_TEST_ORDER_NUMBERS.has(String((order === null || order === void 0 ? void 0 : order.orderNumber) || '').trim()) && LEGACY_TEST_CUSTOMERS.has(normalizeLegacyCustomerName(order === null || order === void 0 ? void 0 : order.customer));
}
function purgeLegacyTestOrdersFromMemory() {
  var legacyIds = orders.filter(isLegacyTestOrder).map(function (order) {
    return order.id;
  }).filter(Boolean);
  if (!legacyIds.length) return false;
  var legacyIdSet = new Set(legacyIds);
  var legacyAllocationIds = new Set(allocations.filter(function (allocation) {
    return legacyIdSet.has(allocation.orderId);
  }).map(function (allocation) {
    return allocation.id;
  }));
  orders = orders.filter(function (order) {
    return !legacyIdSet.has(order.id);
  });
  allocations = allocations.filter(function (allocation) {
    return !legacyIdSet.has(allocation.orderId);
  });
  rawBatches = rawBatches.filter(function (batch) {
    return !legacyIdSet.has(batch.orderId);
  });
  rawReturns = rawReturns.filter(function (batch) {
    return !legacyIdSet.has(batch.orderId) && !legacyAllocationIds.has(batch.allocationId);
  });
  dyeBatches = dyeBatches.filter(function (batch) {
    return !legacyAllocationIds.has(batch.allocationId);
  });
  productionBatches = productionBatches.filter(function (batch) {
    return !legacyAllocationIds.has(batch.allocationId);
  });
  finishedBatches = finishedBatches.filter(function (batch) {
    return !legacyAllocationIds.has(batch.allocationId);
  });
  customerBatches = customerBatches.filter(function (batch) {
    return !legacyAllocationIds.has(batch.allocationId);
  });
  accessoryBatches = accessoryBatches.filter(function (batch) {
    return !legacyIdSet.has(batch.orderId) && !legacyAllocationIds.has(batch.allocationId);
  });
  dyehouseTransfers = dyehouseTransfers.filter(function (transfer) {
    return !legacyIdSet.has(transfer.orderId) && !legacyAllocationIds.has(transfer.allocationId) && !legacyAllocationIds.has(transfer.newAllocationId);
  });
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
  if (!customerAccounts || _typeof(customerAccounts) !== 'object' || Array.isArray(customerAccounts)) customerAccounts = clone(defaults.customerAccounts);
  if (!Array.isArray(reportOutbox)) reportOutbox = clone(defaults.reportOutbox);
  if (!Array.isArray(auditLog)) auditLog = clone(defaults.auditLog);
  if (!whatsappSettings || _typeof(whatsappSettings) !== 'object' || Array.isArray(whatsappSettings)) whatsappSettings = clone(defaults.whatsappSettings);
  whatsappSettings = _objectSpread(_objectSpread({}, defaults.whatsappSettings), whatsappSettings);
  if (!whatsappSettings.dyehouseGroups || _typeof(whatsappSettings.dyehouseGroups) !== 'object' || Array.isArray(whatsappSettings.dyehouseGroups)) whatsappSettings.dyehouseGroups = {};
  if (!whatsappSettings.weavingGroups || _typeof(whatsappSettings.weavingGroups) !== 'object' || Array.isArray(whatsappSettings.weavingGroups)) whatsappSettings.weavingGroups = {};
  if (!whatsappSettings.customerGroups || _typeof(whatsappSettings.customerGroups) !== 'object' || Array.isArray(whatsappSettings.customerGroups)) whatsappSettings.customerGroups = {};
  if (!whatsappStatus || _typeof(whatsappStatus) !== 'object' || Array.isArray(whatsappStatus)) whatsappStatus = clone(defaults.whatsappStatus);
  whatsappStatus = _objectSpread(_objectSpread({}, defaults.whatsappStatus), whatsappStatus);
}
ensureRuntimeCollections();
function ensureRecordIds(collection) {
  var changed = false;
  (collection || []).forEach(function (item) {
    if (item && !item.id) {
      item.id = uid();
      changed = true;
    }
  });
  return changed;
}
function repairTransferredAllocationDyehouses() {
  var changed = false;
  (dyehouseTransfers || []).forEach(function (transfer) {
    var targetId = transfer.newAllocationId || transfer.allocationId;
    var toDyehouse = String(transfer.toDyehouse || '').trim();
    if (!targetId || !toDyehouse) return;
    var allocation = allocations.find(function (item) {
      return item.id === targetId;
    });
    if (allocation && String(allocation.dyehouse || '').trim() !== toDyehouse) {
      allocation.dyehouse = toDyehouse;
      changed = true;
    }
  });
  return changed;
}
if ([rawBatches, rawReturns, dyeBatches, productionBatches, finishedBatches, customerBatches, accessoryBatches, dyehouseTransfers].some(ensureRecordIds) || repairTransferredAllocationDyehouses()) save();
var saveData = save;
var selectedOrderId = null;
var editingOrderId = null;
var editingPricingId = null;
var currentDocumentType = null;
var pendingConvertedPricingId = null;
var initialLocalStorageSnapshot = null;
var refs = Object.fromEntries(['statsGrid', 'pricingTableBody', 'ordersTableBody', 'searchInput', 'customerFilter', 'dyehouseFilter', 'fabricFilter', 'orderStatusFilter', 'printFilteredOrdersBtn', 'orderDetailsPanel', 'documentsPanel', 'analyzeReportBtn', 'aiStatusText', 'aiAnalysisDialog', 'aiAnalysisBody', 'closeAiAnalysisBtn', 'copyAiWhatsappBtn', 'openPricingFormBtn', 'openDocumentReviewBtn', 'openOrderFormBtn', 'openOrdersReportBtn', 'openDyehouseBalancesReportBtn', 'openManagementReportsBtn', 'closePricingFormBtn', 'pricingDialog', 'pricingForm', 'pricingNumber', 'pricingProductCode', 'pricingCustomer', 'pricingDate', 'pricingFabricType', 'pricingMaterialType', 'pricingDyehouse', 'pricingColorClass', 'pricingQuantity', 'pricingInchWidth', 'pricingFinishedWeight', 'pricingRawCost', 'pricingDyeCost', 'pricingSuggestedDyeCost', 'pricingWastePercent', 'pricingExtraCost', 'pricingProfitPerKg', 'pricingPaymentMode', 'pricingPaymentDetails', 'pricingPaymentTerms', 'pricingNotes', 'pricingWasteCostPreview', 'pricingCostPreview', 'pricingSellPreview', 'pricingTotalPreview', 'closeOrderFormBtn', 'orderDialog', 'orderForm', 'orderNumber', 'productCode', 'customer', 'orderDate', 'fabricType', 'totalRawQuantity', 'expectedWastePercent', 'widthMode', 'inchWidth', 'widthLinesBox', 'widthLinesEditor', 'addWidthLineBtn', 'kiloPrice', 'paymentMode', 'paymentDetails', 'paymentTerms', 'accessoryType', 'accessoryPercent', 'accessoryLinesEditor', 'addAccessoryLineBtn', 'dyehouse', 'weavingSource', 'orderNotes', 'weavingSlipDialog', 'weavingSlipForm', 'weavingSlipFile', 'weavingSlipPreview', 'weavingSlipType', 'weavingSlipOrderNumber', 'weavingSlipDate', 'weavingSlipAllocation', 'weavingSlipWidthLine', 'weavingSlipQuantity', 'weavingSlipSupplier', 'weavingSlipNoteNumber', 'reviewMatchNoteBtn', 'reviewMatchStatus', 'weavingSlipNotes', 'closeWeavingSlipBtn', 'documentDialog', 'documentTitle', 'documentBody', 'closeDocumentBtn', 'printDocumentBtn', 'shareWhatsAppBtn', 'deletePricingBtn'].map(function (id) {
  return [id, document.getElementById(id)];
}));
((_refs$orderNotes = refs.orderNotes) === null || _refs$orderNotes === void 0 || (_refs$orderNotes = _refs$orderNotes.closest('label')) === null || _refs$orderNotes === void 0 ? void 0 : _refs$orderNotes.querySelector('span')) && (refs.orderNotes.closest('label').querySelector('span').textContent = 'ملاحظات تشغيل');
function composePaymentTerms(modeValue, detailsValue) {
  var mode = String(modeValue || 'كاش').trim() || 'كاش';
  var details = String(detailsValue || '').trim();
  return details ? "".concat(mode, " - ").concat(details) : mode;
}
function parsePaymentTerms(value) {
  var text = String(value || '').trim();
  if (!text) return {
    mode: 'كاش',
    details: ''
  };
  var _text$split = text.split(' - '),
    _text$split2 = _toArray(_text$split),
    mode = _text$split2[0],
    rest = _arrayLikeToArray(_text$split2).slice(1);
  return {
    mode: mode || 'كاش',
    details: rest.join(' - ')
  };
}
function setPaymentFields(modeRef, detailsRef, hiddenRef, paymentTerms) {
  var parsed = parsePaymentTerms(paymentTerms);
  if (modeRef) modeRef.value = _toConsumableArray(modeRef.options).some(function (option) {
    return option.value === parsed.mode;
  }) ? parsed.mode : 'كاش';
  if (detailsRef) detailsRef.value = parsed.details || '';
  if (hiddenRef) hiddenRef.value = composePaymentTerms(modeRef === null || modeRef === void 0 ? void 0 : modeRef.value, detailsRef === null || detailsRef === void 0 ? void 0 : detailsRef.value);
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
    auditLog: clone(auditLog)
  };
}
var WHATSAPP_SERVICE_URL = '/whatsapp';
var AI_SERVICE_URL = 'http://127.0.0.1:3030';
var A5_SERVICE_URL = 'http://127.0.0.1:3041';
var BACKEND_API_URL = '/api';
var backendAvailable = false;
var backendDataLoading = false;
var currentUser = null;
var wait = function wait(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
};
function backendRequest(_x) {
  return _backendRequest.apply(this, arguments);
}
function _backendRequest() {
  _backendRequest = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(path) {
    var options,
      response,
      message,
      data,
      _args = arguments,
      _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          _context3.n = 1;
          return fetch("".concat(BACKEND_API_URL).concat(path), _objectSpread(_objectSpread({}, options), {}, {
            headers: _objectSpread({
              'Content-Type': 'application/json'
            }, options.headers || {})
          }));
        case 1:
          response = _context3.v;
          if (response.ok) {
            _context3.n = 6;
            break;
          }
          message = "Backend ".concat(response.status);
          _context3.p = 2;
          _context3.n = 3;
          return response.json();
        case 3:
          data = _context3.v;
          message = data.error || data.message || message;
          _context3.n = 5;
          break;
        case 4:
          _context3.p = 4;
          _t3 = _context3.v;
        case 5:
          throw new Error(message);
        case 6:
          return _context3.a(2, response.json());
      }
    }, _callee3, null, [[2, 4]]);
  }));
  return _backendRequest.apply(this, arguments);
}
function loadCurrentUser() {
  return _loadCurrentUser.apply(this, arguments);
}
function _loadCurrentUser() {
  _loadCurrentUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var data, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          _context4.n = 1;
          return backendRequest('/auth/me', {
            cache: 'no-store'
          });
        case 1:
          data = _context4.v;
          currentUser = data.user || null;
          _context4.n = 3;
          break;
        case 2:
          _context4.p = 2;
          _t4 = _context4.v;
          currentUser = null;
        case 3:
          return _context4.a(2);
      }
    }, _callee4, null, [[0, 2]]);
  }));
  return _loadCurrentUser.apply(this, arguments);
}
function logoutCurrentUser() {
  return _logoutCurrentUser.apply(this, arguments);
}
function _logoutCurrentUser() {
  _logoutCurrentUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          _context5.n = 1;
          return backendRequest('/auth/logout', {
            method: 'POST',
            body: JSON.stringify({})
          });
        case 1:
          _context5.p = 1;
          window.location.href = '/login.html';
          return _context5.f(1);
        case 2:
          return _context5.a(2);
      }
    }, _callee5, null, [[0,, 1, 2]]);
  }));
  return _logoutCurrentUser.apply(this, arguments);
}
var dbDate = function dbDate(row) {
  return row.batch_date || row.transfer_date || row.order_date || row.pricing_date || row.created_at || '';
};
var customerLookupName = function customerLookupName(customers, id) {
  var _customers$find;
  return ((_customers$find = customers.find(function (item) {
    return item.id === id;
  })) === null || _customers$find === void 0 ? void 0 : _customers$find.name) || '';
};
function parseDbJsonArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    var parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_unused6) {
    return [];
  }
}
function parseDbJsonObject(value) {
  if (value && _typeof(value) === 'object' && !Array.isArray(value)) return value;
  if (!value) return {};
  try {
    var parsed = JSON.parse(value);
    return parsed && _typeof(parsed) === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch (_unused7) {
    return {};
  }
}
function normalizeOrderStatus(status) {
  return status === 'active' ? 'pending' : status || 'pending';
}
function mapDbOrder(row, customers) {
  var widthMode = row.width_mode || 'single';
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
    widthMode: widthMode,
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
    operationClosed: !!row.is_closed
  };
}
function mapDbAllocation(row) {
  var _row$accessory_quanti;
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
    accessoryQuantityManual: (_row$accessory_quanti = row.accessory_quantity_manual) !== null && _row$accessory_quanti !== void 0 ? _row$accessory_quanti : null,
    notes: row.notes || ''
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
    movement: row.movement || ''
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
    mode: row.to_allocation_id ? 'split' : 'full'
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
    status: row.status || 'active'
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
function updateConnectionBadge(id, ok, label) {
  var detail = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var badge = document.getElementById(id);
  if (!badge) return;
  badge.classList.toggle('is-ok', !!ok);
  badge.classList.toggle('is-down', !ok);
  badge.setAttribute('aria-label', "".concat(label, ": ").concat(ok ? 'متصل' : 'غير متصل'));
  badge.title = detail || "".concat(label, ": ").concat(ok ? 'متصل' : 'غير متصل');
  var text = badge.querySelector('[data-connection-text]');
  if (text) text.textContent = "".concat(label, ": ").concat(ok ? 'متصل' : 'غير متصل');
}
function updateBackendStatusBadge() {
  var detail = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  updateConnectionBadge('backendStatusBadge', backendAvailable, 'قاعدة البيانات', detail);
}
function updateWhatsappStatusBadge() {
  var _whatsappStatus, _whatsappStatus2, _whatsappStatus3;
  var connected = ((_whatsappStatus = whatsappStatus) === null || _whatsappStatus === void 0 ? void 0 : _whatsappStatus.status) === 'connected';
  updateConnectionBadge('whatsappStatusBadge', connected, 'واتساب', ((_whatsappStatus2 = whatsappStatus) === null || _whatsappStatus2 === void 0 ? void 0 : _whatsappStatus2.errorMessage) || ((_whatsappStatus3 = whatsappStatus) === null || _whatsappStatus3 === void 0 ? void 0 : _whatsappStatus3.updatedAt) || '');
}
function pollBackendStatus() {
  return _pollBackendStatus.apply(this, arguments);
}
function _pollBackendStatus() {
  _pollBackendStatus = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var _health$schema, wasUnavailable, health, schemaOk, _t5;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          wasUnavailable = !backendAvailable;
          _context6.n = 1;
          return backendRequest('/health', {
            cache: 'no-store'
          });
        case 1:
          health = _context6.v;
          schemaOk = (health === null || health === void 0 || (_health$schema = health.schema) === null || _health$schema === void 0 ? void 0 : _health$schema.ok) !== false;
          backendAvailable = schemaOk;
          updateBackendStatusBadge(schemaOk ? 'قاعدة البيانات متصلة' : 'قاعدة البيانات متصلة لكن تحتاج ترقية');
          if (!(schemaOk && wasUnavailable && !backendDataLoading && !orders.length)) {
            _context6.n = 2;
            break;
          }
          _context6.n = 2;
          return loadBackendData({
            retries: 2,
            silentFailure: true
          });
        case 2:
          _context6.n = 4;
          break;
        case 3:
          _context6.p = 3;
          _t5 = _context6.v;
          backendAvailable = false;
          updateBackendStatusBadge('قاعدة البيانات غير متاحة');
        case 4:
          return _context6.a(2);
      }
    }, _callee6, null, [[0, 3]]);
  }));
  return _pollBackendStatus.apply(this, arguments);
}
function loadBackendData() {
  return _loadBackendData.apply(this, arguments);
}
function _loadBackendData() {
  _loadBackendData = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
    var options,
      retries,
      silentFailure,
      _orders$,
      _data$systemSettings,
      _health$schema2,
      data,
      lastError,
      attempt,
      customers,
      settings,
      backendPriceLibrary,
      health,
      schemaOk,
      _args5 = arguments,
      _t6,
      _t7;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          options = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : {};
          if (!backendDataLoading) {
            _context7.n = 1;
            break;
          }
          return _context7.a(2);
        case 1:
          retries = Number.isFinite(options.retries) ? Number(options.retries) : 6;
          silentFailure = !!options.silentFailure;
          backendDataLoading = true;
          _context7.p = 2;
          data = null;
          lastError = null;
          attempt = 0;
        case 3:
          if (!(attempt <= retries)) {
            _context7.n = 8;
            break;
          }
          _context7.p = 4;
          _context7.n = 5;
          return backendRequest('/bootstrap', {
            cache: 'no-store'
          });
        case 5:
          data = _context7.v;
          lastError = null;
          return _context7.a(3, 8);
        case 6:
          _context7.p = 6;
          _t6 = _context7.v;
          lastError = _t6;
          if (!(attempt < retries)) {
            _context7.n = 7;
            break;
          }
          _context7.n = 7;
          return wait(800);
        case 7:
          attempt += 1;
          _context7.n = 3;
          break;
        case 8:
          if (data) {
            _context7.n = 9;
            break;
          }
          throw lastError || new Error('تعذر تحميل بيانات قاعدة البيانات');
        case 9:
          customers = data.customers || [];
          orders = (data.orders || []).map(function (row) {
            return mapDbOrder(row, customers);
          });
          pricings = (data.pricings || []).map(function (row) {
            return mapDbPricing(row, customers);
          });
          allocations = (data.allocations || []).map(mapDbAllocation);
          rawBatches = (data.dyehouseDeliveryBatches || []).map(mapDbBatch);
          finishedBatches = [];
          productionBatches = (data.finishedReceivingBatches || []).map(mapDbBatch);
          customerBatches = (data.customerDeliveryBatches || []).map(mapDbBatch);
          accessoryBatches = (data.accessoryBatches || []).map(mapDbBatch);
          rawReturns = (data.rawReturns || []).map(mapDbBatch);
          dyehouseTransfers = (data.dyehouseTransfers || []).map(mapDbTransfer);
          purgeLegacyTestOrdersFromMemory();
          if (!orders.some(function (order) {
            return order.id === selectedOrderId;
          })) selectedOrderId = ((_orders$ = orders[0]) === null || _orders$ === void 0 ? void 0 : _orders$.id) || null;
          settings = data.systemSettings || {};
          if (settings.customerAccounts && _typeof(settings.customerAccounts) === 'object' && !Array.isArray(settings.customerAccounts)) {
            customerAccounts = settings.customerAccounts;
          }
          if (settings.whatsappSettings && _typeof(settings.whatsappSettings) === 'object' && !Array.isArray(settings.whatsappSettings)) {
            whatsappSettings = _objectSpread(_objectSpread({}, defaults.whatsappSettings), settings.whatsappSettings);
          }
          if (Array.isArray(settings.auditLog)) {
            auditLog = settings.auditLog;
          }
          backendPriceLibrary = (_data$systemSettings = data.systemSettings) === null || _data$systemSettings === void 0 ? void 0 : _data$systemSettings.dyehousePriceLibrary;
          if (backendPriceLibrary && _typeof(backendPriceLibrary) === 'object' && !Array.isArray(backendPriceLibrary)) {
            customDyehousePriceLibrary = sanitizeDyehousePriceLibrary(backendPriceLibrary);
            saveDyehousePriceLibraryLocal();
            applyPricingMaterialOptions();
            applyPricingDyehouseOptions();
            updateSuggestedDyeCost();
          }
          _context7.n = 10;
          return backendRequest('/health', {
            cache: 'no-store'
          });
        case 10:
          health = _context7.v;
          schemaOk = (health === null || health === void 0 || (_health$schema2 = health.schema) === null || _health$schema2 === void 0 ? void 0 : _health$schema2.ok) !== false;
          backendAvailable = schemaOk;
          updateBackendStatusBadge(schemaOk ? 'قاعدة البيانات متصلة' : 'قاعدة البيانات متصلة لكن تحتاج ترقية');
          if (schemaOk) {
            _context7.n = 11;
            break;
          }
          renderBackendUnavailable();
          return _context7.a(2);
        case 11:
          save();
          renderAll();
          _context7.n = 13;
          break;
        case 12:
          _context7.p = 12;
          _t7 = _context7.v;
          backendAvailable = false;
          updateBackendStatusBadge('قاعدة البيانات غير متاحة');
          console.warn('Backend unavailable; operational LocalStorage fallback is disabled', _t7);
          if (!silentFailure) renderBackendUnavailable();
        case 13:
          _context7.p = 13;
          backendDataLoading = false;
          return _context7.f(13);
        case 14:
          return _context7.a(2);
      }
    }, _callee7, null, [[4, 6], [2, 12, 13, 14]]);
  }));
  return _loadBackendData.apply(this, arguments);
}
function syncLocalStorageToBackend() {
  return _syncLocalStorageToBackend.apply(this, arguments);
}
function _syncLocalStorageToBackend() {
  _syncLocalStorageToBackend = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
    var snapshot, result, _t8;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          if (confirm('سيتم ترحيل بيانات المتصفح الحالية إلى قاعدة البيانات بدون حذف LocalStorage. هل تريد المتابعة؟')) {
            _context8.n = 1;
            break;
          }
          return _context8.a(2);
        case 1:
          snapshot = initialLocalStorageSnapshot || captureLocalStorageSnapshot();
          _context8.p = 2;
          _context8.n = 3;
          return backendRequest('/import-local', {
            method: 'POST',
            body: JSON.stringify(_objectSpread({
              metadata: {
                origin: location.origin,
                href: location.href,
                exportedAt: new Date().toISOString(),
                source: 'ui-sync'
              }
            }, snapshot))
          });
        case 3:
          result = _context8.v;
          alert("\u062A\u0645\u062A \u0627\u0644\u0645\u0632\u0627\u0645\u0646\u0629.\n\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629: ".concat(result.inserted || 0, "\n\u062A\u0645 \u062A\u062D\u062F\u064A\u062B: ").concat(result.updated || 0, "\n\u062A\u0645 \u062A\u062C\u0627\u0647\u0644: ").concat(result.skipped || 0));
          _context8.n = 4;
          return loadBackendData();
        case 4:
          _context8.n = 6;
          break;
        case 5:
          _context8.p = 5;
          _t8 = _context8.v;
          console.error(_t8);
          alert('تعذر تنفيذ المزامنة. تأكد أن خدمة قاعدة البيانات تعمل ثم حاول مرة أخرى.');
        case 6:
          return _context8.a(2);
      }
    }, _callee8, null, [[2, 5]]);
  }));
  return _syncLocalStorageToBackend.apply(this, arguments);
}
var orderToApi = function orderToApi(order) {
  var customerId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return {
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
    operation_notes_json: JSON.stringify(order.operationNotes && _typeof(order.operationNotes) === 'object' && !Array.isArray(order.operationNotes) ? order.operationNotes : {}),
    status: normalizeOrderStatus(order.status),
    is_closed: order.operationClosed ? 1 : 0
  };
};
var allocationToApi = function allocationToApi(allocation) {
  var _allocation$accessory;
  return {
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
    accessory_quantity_manual: (_allocation$accessory = allocation.accessoryQuantityManual) !== null && _allocation$accessory !== void 0 ? _allocation$accessory : null,
    notes: allocation.notes || ''
  };
};
var pricingToApi = function pricingToApi(pricing) {
  var customerId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var calculated = calculatePricing(pricing);
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
    status: pricing.status || 'active'
  };
};
function pricingConvertedByOrder(pricing) {
  var pricingOrderNumber = orderNumberFromPricing(pricing === null || pricing === void 0 ? void 0 : pricing.pricingNumber);
  var pricingNumber = String((pricing === null || pricing === void 0 ? void 0 : pricing.pricingNumber) || '').trim();
  var pricingId = String((pricing === null || pricing === void 0 ? void 0 : pricing.id) || '').trim();
  var customer = normalizeForCompare(pricing === null || pricing === void 0 ? void 0 : pricing.customer);
  var fabric = normalizeForCompare(pricing === null || pricing === void 0 ? void 0 : pricing.fabricType);
  return orders.some(function (order) {
    var orderNumber = String(order.orderNumber || '').trim();
    var samePricingId = pricingId && String(order.pricingId || '').trim() === pricingId;
    var sameNumber = orderNumber === String(pricingOrderNumber || '').trim() || orderNumber === pricingNumber;
    return samePricingId || sameNumber && normalizeForCompare(order.customer) === customer && normalizeForCompare(order.fabricType) === fabric;
  });
}
function isActivePricing(pricing) {
  var status = String((pricing === null || pricing === void 0 ? void 0 : pricing.status) || '').toLowerCase();
  return !(pricing !== null && pricing !== void 0 && pricing.convertedOrderId) && !['converted', 'ordered', 'order', 'closed'].includes(status) && !pricingConvertedByOrder(pricing);
}
var batchToApi = function batchToApi(batch) {
  return {
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
    movement: batch.movement || null
  };
};
var transferToApi = function transferToApi(transfer) {
  return {
    id: transfer.id,
    order_id: transfer.orderId || selectedOrderId || '',
    from_allocation_id: transfer.allocationId || null,
    to_allocation_id: transfer.newAllocationId || null,
    from_dyehouse: transfer.fromDyehouse || '',
    to_dyehouse: transfer.toDyehouse || '',
    quantity: Number(transfer.quantity || 0),
    transfer_date: transfer.date || new Date().toISOString().slice(0, 10),
    note_number: transfer.noteNumber || '',
    notes: transfer.reason || transfer.notes || ''
  };
};
function backendCustomerId(name) {
  return "customer-".concat(String(name || 'unknown').trim().replace(/\s+/g, '-').replace(/[^\u0600-\u06FF\w-]/g, ''));
}
function ensureBackendCustomer(_x2) {
  return _ensureBackendCustomer.apply(this, arguments);
}
function _ensureBackendCustomer() {
  _ensureBackendCustomer = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(name) {
    var cleanName, id;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          cleanName = String(name || '').trim();
          if (!(!backendAvailable || !cleanName)) {
            _context9.n = 1;
            break;
          }
          return _context9.a(2, null);
        case 1:
          id = backendCustomerId(cleanName);
          _context9.n = 2;
          return postBackend('/customers', {
            id: id,
            name: cleanName,
            notes: 'مضاف من الواجهة'
          });
        case 2:
          return _context9.a(2, id);
      }
    }, _callee9);
  }));
  return _ensureBackendCustomer.apply(this, arguments);
}
function postBackend(_x3, _x4) {
  return _postBackend.apply(this, arguments);
}
function _postBackend() {
  _postBackend = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(path, payload) {
    var _t9;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          if (backendAvailable) {
            _context0.n = 1;
            break;
          }
          return _context0.a(2, null);
        case 1:
          _context0.p = 1;
          _context0.n = 2;
          return backendRequest(path, {
            method: 'POST',
            body: JSON.stringify(payload)
          });
        case 2:
          return _context0.a(2, _context0.v);
        case 3:
          _context0.p = 3;
          _t9 = _context0.v;
          backendAvailable = false;
          console.warn('Backend write failed, kept LocalStorage copy', _t9);
          return _context0.a(2, null);
      }
    }, _callee0, null, [[1, 3]]);
  }));
  return _postBackend.apply(this, arguments);
}
function putBackend(_x5, _x6) {
  return _putBackend.apply(this, arguments);
}
function _putBackend() {
  _putBackend = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(path, payload) {
    var _t0;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.p = _context1.n) {
        case 0:
          if (backendAvailable) {
            _context1.n = 1;
            break;
          }
          return _context1.a(2, null);
        case 1:
          _context1.p = 1;
          _context1.n = 2;
          return backendRequest(path, {
            method: 'PUT',
            body: JSON.stringify(payload)
          });
        case 2:
          return _context1.a(2, _context1.v);
        case 3:
          _context1.p = 3;
          _t0 = _context1.v;
          backendAvailable = false;
          console.warn('Backend update failed, kept LocalStorage copy', _t0);
          return _context1.a(2, null);
      }
    }, _callee1, null, [[1, 3]]);
  }));
  return _putBackend.apply(this, arguments);
}
function deleteBackend(_x7) {
  return _deleteBackend.apply(this, arguments);
}
function _deleteBackend() {
  _deleteBackend = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(path) {
    var _t1;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.p = _context10.n) {
        case 0:
          if (backendAvailable) {
            _context10.n = 1;
            break;
          }
          return _context10.a(2, null);
        case 1:
          _context10.p = 1;
          _context10.n = 2;
          return backendRequest(path, {
            method: 'DELETE'
          });
        case 2:
          return _context10.a(2, _context10.v);
        case 3:
          _context10.p = 3;
          _t1 = _context10.v;
          backendAvailable = false;
          console.warn('Backend delete failed, kept LocalStorage copy', _t1);
          return _context10.a(2, null);
      }
    }, _callee10, null, [[1, 3]]);
  }));
  return _deleteBackend.apply(this, arguments);
}
function saveBackendSetting(_x8, _x9) {
  return _saveBackendSetting.apply(this, arguments);
}
function _saveBackendSetting() {
  _saveBackendSetting = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(key, value) {
    var _t10;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.p = _context11.n) {
        case 0:
          if (backendAvailable) {
            _context11.n = 1;
            break;
          }
          return _context11.a(2, null);
        case 1:
          _context11.p = 1;
          _context11.n = 2;
          return backendRequest("/settings/".concat(key), {
            method: 'PUT',
            body: JSON.stringify({
              value: value
            })
          });
        case 2:
          return _context11.a(2, _context11.v);
        case 3:
          _context11.p = 3;
          _t10 = _context11.v;
          backendAvailable = false;
          console.warn('Backend setting save failed', key, _t10);
          return _context11.a(2, null);
      }
    }, _callee11, null, [[1, 3]]);
  }));
  return _saveBackendSetting.apply(this, arguments);
}
function ensureBackendForWrite() {
  return _ensureBackendForWrite.apply(this, arguments);
}
function _ensureBackendForWrite() {
  _ensureBackendForWrite = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
    var message,
      _health$schema3,
      health,
      schemaOk,
      _args10 = arguments,
      _t11;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.p = _context12.n) {
        case 0:
          message = _args10.length > 0 && _args10[0] !== undefined ? _args10[0] : 'تعذر الاتصال بقاعدة البيانات. لم يتم اعتماد التعديل.';
          _context12.p = 1;
          _context12.n = 2;
          return backendRequest('/health', {
            cache: 'no-store'
          });
        case 2:
          health = _context12.v;
          schemaOk = (health === null || health === void 0 || (_health$schema3 = health.schema) === null || _health$schema3 === void 0 ? void 0 : _health$schema3.ok) !== false;
          backendAvailable = schemaOk;
          updateBackendStatusBadge(schemaOk ? 'قاعدة البيانات متصلة' : 'قاعدة البيانات متصلة لكن تحتاج ترقية');
          if (schemaOk) {
            _context12.n = 3;
            break;
          }
          alert('قاعدة البيانات متصلة لكن هيكلها غير مكتمل. لم يتم اعتماد التعديل حتى تتم الترقية.');
          return _context12.a(2, false);
        case 3:
          return _context12.a(2, true);
        case 4:
          _context12.p = 4;
          _t11 = _context12.v;
          backendAvailable = false;
          console.warn('Backend unavailable before write', _t11);
          alert(message);
          return _context12.a(2, false);
      }
    }, _callee12, null, [[1, 4]]);
  }));
  return _ensureBackendForWrite.apply(this, arguments);
}
function backendBatchType(type) {
  return type === 'production' || type === 'finished' ? 'finished' : type === 'rawReturn' ? 'raw-return' : type === 'accessory' ? 'accessory' : type === 'customer' ? 'customer' : type === 'raw' ? 'dyehouse' : type === 'dye' ? 'dyehouse' : type;
}
function backendSnapshotCollection(snapshot, type) {
  var key = backendBatchType(type);
  if (key === 'dyehouse') return snapshot.dyehouseDeliveryBatches || [];
  if (key === 'finished') return snapshot.finishedReceivingBatches || [];
  if (key === 'customer') return snapshot.customerDeliveryBatches || [];
  if (key === 'accessory') return snapshot.accessoryBatches || [];
  if (key === 'raw-return') return snapshot.rawReturns || [];
  if (key === 'transfer') return snapshot.dyehouseTransfers || [];
  if (key === 'allocation') return snapshot.allocations || [];
  if (key === 'pricing') return snapshot.pricings || [];
  if (key === 'order') return snapshot.orders || [];
  return [];
}
function backendSnapshot() {
  return _backendSnapshot.apply(this, arguments);
}
function _backendSnapshot() {
  _backendSnapshot = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.n) {
        case 0:
          return _context13.a(2, backendRequest('/bootstrap', {
            cache: 'no-store'
          }));
      }
    }, _callee13);
  }));
  return _backendSnapshot.apply(this, arguments);
}
function rollbackAfterBackendWriteFailure(_x0) {
  return _rollbackAfterBackendWriteFailure.apply(this, arguments);
}
function _rollbackAfterBackendWriteFailure() {
  _rollbackAfterBackendWriteFailure = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(message) {
    return _regenerator().w(function (_context14) {
      while (1) switch (_context14.n) {
        case 0:
          alert(message || 'تعذر تثبيت التعديل في قاعدة البيانات. سيتم الرجوع لآخر بيانات محفوظة.');
          _context14.n = 1;
          return loadBackendData();
        case 1:
          return _context14.a(2);
      }
    }, _callee14);
  }));
  return _rollbackAfterBackendWriteFailure.apply(this, arguments);
}
function verifyRecordPersisted(_x1, _x10) {
  return _verifyRecordPersisted.apply(this, arguments);
}
function _verifyRecordPersisted() {
  _verifyRecordPersisted = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(type, id) {
    var predicate,
      snapshot,
      row,
      _args13 = arguments;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.n) {
        case 0:
          predicate = _args13.length > 2 && _args13[2] !== undefined ? _args13[2] : null;
          if (id) {
            _context15.n = 1;
            break;
          }
          return _context15.a(2, false);
        case 1:
          _context15.n = 2;
          return backendSnapshot();
        case 2:
          snapshot = _context15.v;
          row = backendSnapshotCollection(snapshot, type).find(function (item) {
            return item.id === id;
          });
          if (row) {
            _context15.n = 3;
            break;
          }
          return _context15.a(2, false);
        case 3:
          return _context15.a(2, typeof predicate === 'function' ? !!predicate(row, snapshot) : true);
      }
    }, _callee15);
  }));
  return _verifyRecordPersisted.apply(this, arguments);
}
function verifyRecordDeleted(_x11, _x12) {
  return _verifyRecordDeleted.apply(this, arguments);
}
function _verifyRecordDeleted() {
  _verifyRecordDeleted = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(type, id) {
    var snapshot;
    return _regenerator().w(function (_context16) {
      while (1) switch (_context16.n) {
        case 0:
          if (id) {
            _context16.n = 1;
            break;
          }
          return _context16.a(2, false);
        case 1:
          _context16.n = 2;
          return backendSnapshot();
        case 2:
          snapshot = _context16.v;
          return _context16.a(2, !backendSnapshotCollection(snapshot, type).some(function (item) {
            return item.id === id;
          }));
      }
    }, _callee16);
  }));
  return _verifyRecordDeleted.apply(this, arguments);
}
function verifyPricingPersisted(_x13) {
  return _verifyPricingPersisted.apply(this, arguments);
}
function _verifyPricingPersisted() {
  _verifyPricingPersisted = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(pricingId) {
    var expected,
      _args15 = arguments;
    return _regenerator().w(function (_context17) {
      while (1) switch (_context17.n) {
        case 0:
          expected = _args15.length > 1 && _args15[1] !== undefined ? _args15[1] : {};
          return _context17.a(2, verifyRecordPersisted('pricing', pricingId, function (row) {
            return String(row.pricing_number || '') === String(expected.pricingNumber || row.pricing_number || '') && String(row.fabric_type || '') === String(expected.fabricType || row.fabric_type || '');
          }));
      }
    }, _callee17);
  }));
  return _verifyPricingPersisted.apply(this, arguments);
}
function verifyOrderPersisted(_x14) {
  return _verifyOrderPersisted.apply(this, arguments);
}
function _verifyOrderPersisted() {
  _verifyOrderPersisted = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(orderId) {
    var expected,
      row,
      savedLines,
      expectedLines,
      expectedSignature,
      savedSignature,
      _args16 = arguments;
    return _regenerator().w(function (_context18) {
      while (1) switch (_context18.n) {
        case 0:
          expected = _args16.length > 1 && _args16[1] !== undefined ? _args16[1] : {};
          if (orderId) {
            _context18.n = 1;
            break;
          }
          return _context18.a(2, false);
        case 1:
          _context18.n = 2;
          return backendRequest("/orders/".concat(orderId), {
            cache: 'no-store'
          });
        case 2:
          row = _context18.v;
          savedLines = parseDbJsonArray(row.accessory_lines_json);
          expectedLines = Array.isArray(expected.accessoryLines) ? expected.accessoryLines : [];
          if (!(expectedLines.length && !savedLines.length)) {
            _context18.n = 3;
            break;
          }
          return _context18.a(2, false);
        case 3:
          if (!expectedLines.length) {
            _context18.n = 4;
            break;
          }
          expectedSignature = JSON.stringify(expectedLines.map(function (line) {
            return {
              type: String(line.type || ''),
              percent: Number(line.percent || 0),
              quantityManual: line.quantityManual === '' || line.quantityManual === null || line.quantityManual === undefined ? '' : Number(line.quantityManual || 0)
            };
          }));
          savedSignature = JSON.stringify(savedLines.map(function (line) {
            return {
              type: String(line.type || ''),
              percent: Number(line.percent || 0),
              quantityManual: line.quantityManual === '' || line.quantityManual === null || line.quantityManual === undefined ? '' : Number(line.quantityManual || 0)
            };
          }));
          if (!(expectedSignature !== savedSignature)) {
            _context18.n = 4;
            break;
          }
          return _context18.a(2, false);
        case 4:
          if (!(Number(expected.accessoryPercent || 0) !== Number(row.accessory_percent || 0))) {
            _context18.n = 5;
            break;
          }
          return _context18.a(2, false);
        case 5:
          if (!(String(expected.accessoryType || '') !== String(row.accessory_type || ''))) {
            _context18.n = 6;
            break;
          }
          return _context18.a(2, false);
        case 6:
          return _context18.a(2, true);
      }
    }, _callee18);
  }));
  return _verifyOrderPersisted.apply(this, arguments);
}
function verifyAllocationPersisted(_x15) {
  return _verifyAllocationPersisted.apply(this, arguments);
}
function _verifyAllocationPersisted() {
  _verifyAllocationPersisted = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19(allocationId) {
    var expected,
      _args17 = arguments;
    return _regenerator().w(function (_context19) {
      while (1) switch (_context19.n) {
        case 0:
          expected = _args17.length > 1 && _args17[1] !== undefined ? _args17[1] : {};
          return _context19.a(2, verifyRecordPersisted('allocation', allocationId, function (row) {
            return String(row.color || row.pantone_code || '') === String(expected.color || expected.pantoneCode || row.color || row.pantone_code || '');
          }));
      }
    }, _callee19);
  }));
  return _verifyAllocationPersisted.apply(this, arguments);
}
function verifyBatchPersisted(_x16, _x17) {
  return _verifyBatchPersisted.apply(this, arguments);
}
function _verifyBatchPersisted() {
  _verifyBatchPersisted = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20(type, batchId) {
    var expected,
      _args18 = arguments;
    return _regenerator().w(function (_context20) {
      while (1) switch (_context20.n) {
        case 0:
          expected = _args18.length > 2 && _args18[2] !== undefined ? _args18[2] : {};
          return _context20.a(2, verifyRecordPersisted(type, batchId, function (row) {
            return Number(row.quantity || 0) === Number(expected.quantity || row.quantity || 0);
          }));
      }
    }, _callee20);
  }));
  return _verifyBatchPersisted.apply(this, arguments);
}
function verifyTransferPersisted(_x18) {
  return _verifyTransferPersisted.apply(this, arguments);
}
function _verifyTransferPersisted() {
  _verifyTransferPersisted = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21(transferId) {
    var expected,
      _args19 = arguments;
    return _regenerator().w(function (_context21) {
      while (1) switch (_context21.n) {
        case 0:
          expected = _args19.length > 1 && _args19[1] !== undefined ? _args19[1] : {};
          return _context21.a(2, verifyRecordPersisted('transfer', transferId, function (row) {
            return String(row.to_dyehouse || '') === String(expected.toDyehouse || expected.to_dyehouse || row.to_dyehouse || '');
          }));
      }
    }, _callee21);
  }));
  return _verifyTransferPersisted.apply(this, arguments);
}
var reportTypeLabels = {
  weaving_production_order: 'أمر تشغيل نسيج',
  dyeing_production_order: 'أمر تشغيل صباغة',
  dyehouses_report: 'تقرير المصابغ',
  orders_follow_report: 'تقرير متابعة الطلبات',
  dyehouse_balances_report: 'تقرير أرصدة المصابغ',
  document_pdf_report: 'تقرير PDF'
};
var reportTypeIcons = {
  pending: '•',
  sending: '…',
  sent: '✓',
  failed: '!',
  cancelled: '×'
};
var reportStatusText = {
  pending: 'في قائمة الإرسال',
  sending: 'جاري الإرسال',
  sent: 'تم الإرسال',
  failed: 'تعذر الإرسال',
  cancelled: 'تم الإلغاء'
};
function nowIso() {
  return new Date().toISOString();
}
function arDateTime() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  var date = value instanceof Date ? value : new Date(value);
  return isNaN(date.getTime()) ? '-' : date.toLocaleString('en-US', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
}
function normalizeForCompare(value) {
  return String(value || '').trim().toLowerCase();
}
function escapeHtml(value) {
  return String(value !== null && value !== void 0 ? value : '').replace(/[&<>"']/g, function (_char) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[_char];
  });
}
function recordAudit(action, entityType, entityId) {
  var beforeValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var afterValue = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var note = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
  if (!Array.isArray(auditLog)) auditLog = [];
  var safeClone = function safeClone(value) {
    try {
      return value === null || value === undefined ? null : clone(value);
    } catch (_unused8) {
      return value === null || value === undefined ? null : String(value);
    }
  };
  auditLog.unshift({
    id: uid(),
    action: action,
    entityType: entityType,
    entityId: entityId,
    beforeValue: safeClone(beforeValue),
    afterValue: safeClone(afterValue),
    note: note,
    createdAt: nowIso()
  });
  auditLog = auditLog.slice(0, 1000);
}
function persistAuditLog() {
  return _persistAuditLog.apply(this, arguments);
}
function _persistAuditLog() {
  _persistAuditLog = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22() {
    return _regenerator().w(function (_context22) {
      while (1) switch (_context22.n) {
        case 0:
          return _context22.a(2, true);
      }
    }, _callee22);
  }));
  return _persistAuditLog.apply(this, arguments);
}
function getFirstRawNoteNumber(order) {
  if (!order) return '';
  return _toConsumableArray(new Set(rawBatches.filter(function (batch) {
    return batch.orderId === order.id;
  }).map(function (batch) {
    return batch.noteNumber;
  }).filter(Boolean))).join('، ');
}
function pricingForOrder(order) {
  if (!order) return null;
  var orderNo = String(order.orderNumber || '').trim();
  return pricings.find(function (pricing) {
    return String(pricing.pricingNumber || '').trim() === orderNo || orderNumberFromPricing(pricing.pricingNumber) === orderNo;
  }) || null;
}
function orderRawCost(order) {
  var _pricingForOrder;
  var direct = Number((order === null || order === void 0 ? void 0 : order.rawCost) || (order === null || order === void 0 ? void 0 : order.rawPrice) || 0);
  if (direct) return direct;
  return Number(((_pricingForOrder = pricingForOrder(order)) === null || _pricingForOrder === void 0 ? void 0 : _pricingForOrder.rawCost) || 0);
}
function uniqueNonEmpty(values) {
  return _toConsumableArray(new Set((values || []).map(function (value) {
    return String(value || '').trim();
  }).filter(Boolean)));
}
function knownCustomerNames() {
  return uniqueNonEmpty([].concat(_toConsumableArray(orders.map(function (order) {
    return order.customer;
  })), _toConsumableArray(pricings.map(function (pricing) {
    return pricing.customer;
  })), _toConsumableArray(customerBatches.map(function (batch) {
    return batch.customer;
  })))).sort(function (a, b) {
    return String(a).localeCompare(String(b), 'ar');
  });
}
function knownDyehouseNames() {
  return uniqueNonEmpty([].concat(_toConsumableArray(orders.map(function (order) {
    return order.dyehouse;
  })), _toConsumableArray(allocations.map(function (allocation) {
    return allocation.dyehouse;
  })), _toConsumableArray(dyeBatches.map(function (batch) {
    return batch.dyehouse;
  })), _toConsumableArray(dyehouseTransfers.flatMap(function (transfer) {
    return [transfer.fromDyehouse, transfer.toDyehouse];
  })))).sort(function (a, b) {
    return String(a).localeCompare(String(b), 'ar');
  });
}
function knownWeavingNames() {
  return uniqueNonEmpty([].concat(_toConsumableArray(orders.map(function (order) {
    return order.weavingSource;
  })), _toConsumableArray(rawBatches.map(function (batch) {
    return batch.supplier;
  })))).sort(function (a, b) {
    return String(a).localeCompare(String(b), 'ar');
  });
}
function normalizeA5CustomerName(value) {
  return normalizeForCompare(value).replace(/[\u0625\u0623\u0622]/g, "\u0627").replace(/\u0649/g, "\u064A").replace(/\u0629/g, "\u0647").replace(/[\s\-_.?,()\[\]{}]/g, '');
}
function a5CustomerDisplayName(customer) {
  if (!customer) return '';
  return String(customer.customerName || customer.name || customer.accountName || customer.account_name || customer.customer_name || '').trim();
}
function findA5CustomerForSystemName(systemName) {
  var a5Customers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var wanted = normalizeA5CustomerName(systemName);
  if (!wanted) return null;
  return a5Customers.find(function (customer) {
    return normalizeA5CustomerName(a5CustomerDisplayName(customer)) === wanted;
  }) || a5Customers.find(function (customer) {
    var name = normalizeA5CustomerName(a5CustomerDisplayName(customer));
    return name && (name.includes(wanted) || wanted.includes(name));
  }) || null;
}
function mappedGroupFor(name) {
  var groupMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var wanted = normalizeForCompare(name);
  if (!wanted) return '';
  var entry = Object.entries(groupMap || {}).find(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
      key = _ref2[0];
    return normalizeForCompare(key) === wanted;
  });
  return String((entry === null || entry === void 0 ? void 0 : entry[1]) || '').trim();
}
function targetGroupsForReport(reportType) {
  var order = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  ensureRuntimeCollections();
  if (reportType === 'weaving_production_order') return uniqueNonEmpty([mappedGroupFor(order === null || order === void 0 ? void 0 : order.weavingSource, whatsappSettings.weavingGroups)]);
  if (reportType === 'dyeing_production_order') {
    if (order !== null && order !== void 0 && order.whatsappDyehouseName) return uniqueNonEmpty([mappedGroupFor(order.whatsappDyehouseName, whatsappSettings.dyehouseGroups)]);
    var allocationDyehouses = uniqueNonEmpty(((order === null || order === void 0 ? void 0 : order.allocations) || []).map(function (allocation) {
      return allocation.dyehouse;
    }));
    var dyehouses = allocationDyehouses.length ? allocationDyehouses : uniqueNonEmpty([order === null || order === void 0 ? void 0 : order.dyehouse]);
    return uniqueNonEmpty(dyehouses.map(function (dyehouse) {
      return mappedGroupFor(dyehouse, whatsappSettings.dyehouseGroups);
    }));
  }
  if (['customerreport_pdf_report', 'quotation_pdf_report'].includes(reportType) && order !== null && order !== void 0 && order.customer) return uniqueNonEmpty([mappedGroupFor(order.customer, whatsappSettings.customerGroups)]);
  if (reportType === 'dyehouses_report') return uniqueNonEmpty([whatsappSettings.dyehousesReportGroupName]);
  return uniqueNonEmpty([whatsappSettings.dyehousesReportGroupName]);
}
function targetGroupForReport(reportType) {
  var order = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return targetGroupsForReport(reportType, order)[0] || '';
}
function reportNeedsManualWhatsappGroup(reportType) {
  return ['weaving_production_order', 'dyeing_production_order', 'customerreport_pdf_report', 'quotation_pdf_report'].includes(reportType);
}
// LEGACY DOCUMENT FUNCTION - pending cleanup: overridden by the active Arabic reportMessage implementation.
function reportMessage(reportType, order) {
  var rawNote = getFirstRawNoteNumber(order) || '-';
  if (reportType === 'weaving_production_order') {
    return "\u0623\u0645\u0631 \u062A\u0634\u063A\u064A\u0644 \u0646\u0633\u064A\u062C\n\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628: ".concat(order.orderNumber || '-', "\n\u0627\u0644\u0639\u0645\u064A\u0644: ").concat(order.customer || '-', "\n\u0627\u0644\u0635\u0646\u0641: ").concat(order.fabricType || '-', "\n\u0627\u0644\u0643\u0645\u064A\u0629: ").concat(formatNumber(order.totalRawOrdered || 0), "\n\u0633\u0639\u0631 \u0627\u0644\u062E\u0627\u0645: ").concat(formatNumber(orderRawCost(order) || 0), "\n\u0627\u0644\u062A\u0627\u0631\u064A\u062E: ").concat(order.orderDate || '-', "\n\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u062A\u0634\u063A\u064A\u0644: ").concat(reportOperationNotes(order));
  }
  if (reportType === 'dyeing_production_order') {
    var dyehouseName = String(order.whatsappDyehouseName || order.dyehouse || '').trim();
    var dyeingLines = (order.allocations || []).filter(function (line) {
      return !dyehouseName || String(line.dyehouse || order.dyehouse || '').trim() === dyehouseName;
    }).map(function (line) {
      return "".concat(line.color || line.pantoneCode || '-', ": ").concat(formatNumber(line.plannedQuantity || 0), " \u0643\u062C\u0645");
    }).join('\n');
    return "\u0623\u0645\u0631 \u062A\u0634\u063A\u064A\u0644 \u0635\u0628\u0627\u063A\u0629\n\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628: ".concat(order.orderNumber || '-', "\n\u0625\u0630\u0646 \u0627\u0644\u062E\u0627\u0645: ").concat(rawNote, "\n\u0627\u0644\u0639\u0645\u064A\u0644: ").concat(order.customer || '-', "\n\u0627\u0644\u0645\u0635\u0628\u063A\u0629: ").concat(dyehouseName || '-', "\n\u0627\u0644\u0635\u0646\u0641: ").concat(order.fabricType || '-', "\n\u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0648\u0627\u0644\u0643\u0645\u064A\u0627\u062A:\n").concat(dyeingLines || '-', "\n\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u062A\u0634\u063A\u064A\u0644: ").concat(reportOperationNotes(order));
  }
  if (order.isStandaloneReport) {
    return "".concat(reportTypeLabels[reportType] || order.reportTitle || 'تقرير من نظام 2B Tex', "\n").concat(order.reportSubtitle || 'تقرير من نظام 2B Tex', "\n\u0648\u0642\u062A \u0627\u0644\u062A\u062C\u0647\u064A\u0632: ").concat(arDateTime());
  }
  return "\u062A\u0642\u0631\u064A\u0631 \u062A\u0634\u063A\u064A\u0644\n\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628: ".concat(order.orderNumber || '-', "\n\u0627\u0644\u0639\u0645\u064A\u0644: ").concat(order.customer || '-', "\n\u0627\u0644\u0645\u0631\u0633\u0644 \u0644\u0644\u0645\u0635\u0628\u063A\u0629: ").concat(formatNumber(order.totalSentToDyehouse || order.totalRawReceived || 0), "\n\u0627\u0644\u0645\u0633\u062A\u0644\u0645 \u0645\u062C\u0647\u0632: ").concat(formatNumber(order.totalFinishedReceived || 0), "\n\u0627\u0644\u0647\u0627\u0644\u0643 \u0627\u0644\u0641\u0639\u0644\u064A: ").concat(formatNumber(order.totalWaste || 0), "\n\u0646\u0633\u0628\u0629 \u0627\u0644\u0647\u0627\u0644\u0643: ").concat(formatNumber(order.totalWastePercent || 0), "%");
}
function enqueueReport(reportType, order) {
  var attachmentPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  ensureRuntimeCollections();
  if (!order || !reportType) return null;
  if (reportType === 'dyeing_production_order' && !getFirstRawNoteNumber(order)) return null;
  var targets = targetGroupsForReport(reportType, order);
  if (!targets.length) return null;
  var rows = [];
  targets.forEach(function (targetGroup) {
    var dyehouseName = reportType === 'dyeing_production_order' && !order.whatsappDyehouseName ? dyehouseNamesForOrder(order).find(function (name) {
      return mappedGroupFor(name, whatsappSettings.dyehouseGroups) === targetGroup;
    }) || '' : '';
    var messageOrder = dyehouseName ? _objectSpread(_objectSpread({}, order), {}, {
      whatsappDyehouseName: dyehouseName
    }) : order;
    var existing = reportOutbox.find(function (item) {
      return item.reportType === reportType && item.orderNumber === order.orderNumber && item.targetGroup === targetGroup && ['pending', 'sending', 'failed', 'sent'].includes(item.status);
    });
    if (existing) {
      rows.push(existing);
      return;
    }
    var row = {
      id: uid(),
      reportType: reportType,
      orderNumber: order.orderNumber,
      customerName: order.customer,
      targetGroup: targetGroup,
      messageText: reportMessage(reportType, messageOrder),
      attachmentPath: attachmentPath,
      status: 'pending',
      createdAt: nowIso(),
      sendingAt: null,
      sentAt: null,
      errorMessage: '',
      retryCount: 0
    };
    reportOutbox.unshift(row);
    rows.push(row);
    recordAudit('create', 'reportOutbox', row.id, null, row, "\u0625\u0636\u0627\u0641\u0629 ".concat(reportTypeLabels[reportType] || reportType, " \u0625\u0644\u0649 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0625\u0631\u0633\u0627\u0644"));
    persistAuditLog()["catch"](function (error) {
      return console.warn('audit-save-failed', error);
    });
  });
  save();
  syncOutboxToWhatsappService();
  return rows[0] || null;
}
function refreshQueuedReportRows(reportType, order) {
  var attachmentPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var targets = targetGroupsForReport(reportType, order);
  reportOutbox.filter(function (row) {
    return row.reportType === reportType && row.orderNumber === order.orderNumber && targets.includes(row.targetGroup);
  }).forEach(function (row) {
    var dyehouseName = reportType === 'dyeing_production_order' && !order.whatsappDyehouseName ? dyehouseNamesForOrder(order).find(function (name) {
      return mappedGroupFor(name, whatsappSettings.dyehouseGroups) === row.targetGroup;
    }) || '' : '';
    var messageOrder = dyehouseName ? _objectSpread(_objectSpread({}, order), {}, {
      whatsappDyehouseName: dyehouseName
    }) : order;
    row.attachmentPath = attachmentPath || row.attachmentPath || '';
    row.status = 'pending';
    row.sendingAt = null;
    row.sentAt = null;
    row.errorMessage = '';
    row.retryCount = 0;
    row.messageText = reportMessage(reportType, messageOrder);
  });
}
function syncOutboxToWhatsappService() {
  return _syncOutboxToWhatsappService.apply(this, arguments);
}
function _syncOutboxToWhatsappService() {
  _syncOutboxToWhatsappService = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23() {
    var _t12;
    return _regenerator().w(function (_context23) {
      while (1) switch (_context23.p = _context23.n) {
        case 0:
          _context23.p = 0;
          _context23.n = 1;
          return fetch("".concat(WHATSAPP_SERVICE_URL, "/api/outbox/sync"), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              outbox: reportOutbox,
              settings: whatsappSettings
            })
          });
        case 1:
          _context23.n = 3;
          break;
        case 2:
          _context23.p = 2;
          _t12 = _context23.v;
        case 3:
          return _context23.a(2);
      }
    }, _callee23, null, [[0, 2]]);
  }));
  return _syncOutboxToWhatsappService.apply(this, arguments);
}
function pollWhatsappService() {
  return _pollWhatsappService.apply(this, arguments);
}
function _pollWhatsappService() {
  _pollWhatsappService = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24() {
    var _refs$orderDetailsPan3, response, data, localById, _t13;
    return _regenerator().w(function (_context24) {
      while (1) switch (_context24.p = _context24.n) {
        case 0:
          ensureRuntimeCollections();
          _context24.p = 1;
          _context24.n = 2;
          return fetch("".concat(WHATSAPP_SERVICE_URL, "/api/status"));
        case 2:
          response = _context24.v;
          if (response.ok) {
            _context24.n = 3;
            break;
          }
          throw new Error('service-offline');
        case 3:
          _context24.n = 4;
          return response.json();
        case 4:
          data = _context24.v;
          whatsappStatus = data.whatsapp || {
            status: 'disconnected',
            updatedAt: nowIso(),
            errorMessage: ''
          };
          if (Array.isArray(data.outbox)) {
            localById = new Map(reportOutbox.map(function (item) {
              return [item.id, item];
            }));
            data.outbox.forEach(function (remote) {
              localById.set(remote.id, _objectSpread(_objectSpread({}, localById.get(remote.id) || {}), remote));
            });
            reportOutbox = _toConsumableArray(localById.values()).sort(function (a, b) {
              return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
            });
          }
          save();
          updateWhatsappStatusBadge();
          if (selectedOrderId && (_refs$orderDetailsPan3 = refs.orderDetailsPanel) !== null && _refs$orderDetailsPan3 !== void 0 && _refs$orderDetailsPan3.querySelector('.report-send-status') && !orderDetailsHasActiveDraft()) renderDetails();
          _context24.n = 6;
          break;
        case 5:
          _context24.p = 5;
          _t13 = _context24.v;
          whatsappStatus = {
            status: 'disconnected',
            updatedAt: nowIso(),
            errorMessage: 'خدمة واتساب غير متصلة حاليًا'
          };
          updateWhatsappStatusBadge();
        case 6:
          return _context24.a(2);
      }
    }, _callee24, null, [[1, 5]]);
  }));
  return _pollWhatsappService.apply(this, arguments);
}
function whatsappConnectionStatusText() {
  var _whatsappStatus4, _whatsappStatus5;
  return {
    connected: 'متصل',
    waiting_for_qr: 'بانتظار ربط واتساب',
    disconnected: 'غير متصل'
  }[(_whatsappStatus4 = whatsappStatus) === null || _whatsappStatus4 === void 0 ? void 0 : _whatsappStatus4.status] || ((_whatsappStatus5 = whatsappStatus) === null || _whatsappStatus5 === void 0 ? void 0 : _whatsappStatus5.status) || 'غير متصل';
}
function whatsappConnectionPanelHtml() {
  var _whatsappStatus6, _whatsappStatus7, _whatsappStatus8;
  var statusText = whatsappConnectionStatusText();
  var qrHtml = (_whatsappStatus6 = whatsappStatus) !== null && _whatsappStatus6 !== void 0 && _whatsappStatus6.qrDataUrl ? "<div class=\"notice\"><strong>\u0627\u0645\u0633\u062D \u0643\u0648\u062F \u0648\u0627\u062A\u0633\u0627\u0628 \u0645\u0646 \u0627\u0644\u0645\u0648\u0628\u0627\u064A\u0644</strong><br><span class=\"muted\">\u0644\u0648 \u0638\u0647\u0631 \u062A\u0639\u0630\u0631 \u0631\u0628\u0637 \u0627\u0644\u062C\u0647\u0627\u0632\u060C \u0627\u0645\u0633\u062D \u0627\u0644\u0643\u0648\u062F \u0627\u0644\u062D\u0627\u0644\u064A \u0641\u0642\u0637 \u0644\u0623\u0646 \u0627\u0644\u0643\u0648\u062F \u064A\u062A\u062D\u062F\u062B \u062A\u0644\u0642\u0627\u0626\u064A\u064B\u0627.</span><br><img data-whatsapp-qr src=\"".concat(escapeHtml(whatsappStatus.qrDataUrl), "\" alt=\"WhatsApp QR\" style=\"width:220px;max-width:100%;margin-top:10px;border:1px solid #d8dee9;border-radius:8px;background:#fff;padding:8px\"></div>") : '';
  return "<div class=\"notice ".concat(((_whatsappStatus7 = whatsappStatus) === null || _whatsappStatus7 === void 0 ? void 0 : _whatsappStatus7.status) === 'connected' ? 'success' : 'warning', "\"><strong>\u062D\u0627\u0644\u0629 \u0648\u0627\u062A\u0633\u0627\u0628:</strong> ").concat(escapeHtml(statusText)).concat((_whatsappStatus8 = whatsappStatus) !== null && _whatsappStatus8 !== void 0 && _whatsappStatus8.errorMessage ? " - ".concat(escapeHtml(whatsappStatus.errorMessage)) : '', "</div>").concat(qrHtml);
}
function stopWhatsappSettingsAutoRefresh() {
  if (whatsappSettingsRefreshTimer) clearInterval(whatsappSettingsRefreshTimer);
  whatsappSettingsRefreshTimer = null;
}
function updateWhatsappSettingsConnectionPanel() {
  var _refs$documentBody;
  var panel = (_refs$documentBody = refs.documentBody) === null || _refs$documentBody === void 0 ? void 0 : _refs$documentBody.querySelector('[data-whatsapp-connection-panel]');
  if (panel) panel.innerHTML = whatsappConnectionPanelHtml();
}
function startWhatsappSettingsAutoRefresh() {
  stopWhatsappSettingsAutoRefresh();
  whatsappSettingsRefreshTimer = setInterval(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var _refs$documentDialog, _refs$documentBody2;
    var response, data, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          if (!(!((_refs$documentDialog = refs.documentDialog) !== null && _refs$documentDialog !== void 0 && _refs$documentDialog.open) || ((_refs$documentBody2 = refs.documentBody) === null || _refs$documentBody2 === void 0 ? void 0 : _refs$documentBody2.dataset.documentType) !== 'whatsapp-settings')) {
            _context.n = 1;
            break;
          }
          stopWhatsappSettingsAutoRefresh();
          return _context.a(2);
        case 1:
          _context.p = 1;
          _context.n = 2;
          return fetch("".concat(WHATSAPP_SERVICE_URL, "/api/status"), {
            cache: 'no-store'
          });
        case 2:
          response = _context.v;
          if (response.ok) {
            _context.n = 3;
            break;
          }
          throw new Error('service-offline');
        case 3:
          _context.n = 4;
          return response.json();
        case 4:
          data = _context.v;
          whatsappStatus = data.whatsapp || {
            status: 'disconnected',
            updatedAt: nowIso(),
            errorMessage: ''
          };
          save();
          updateWhatsappStatusBadge();
          updateWhatsappSettingsConnectionPanel();
          _context.n = 6;
          break;
        case 5:
          _context.p = 5;
          _t = _context.v;
          whatsappStatus = {
            status: 'disconnected',
            updatedAt: nowIso(),
            errorMessage: 'خدمة واتساب غير متصلة حاليًا'
          };
          updateWhatsappStatusBadge();
          updateWhatsappSettingsConnectionPanel();
        case 6:
          return _context.a(2);
      }
    }, _callee, null, [[1, 5]]);
  })), 5000);
}
function reportRowsForOrder(order) {
  ensureRuntimeCollections();
  var types = ['weaving_production_order', 'dyeing_production_order', 'dyehouses_report'];
  return types.flatMap(function (type) {
    var targets = targetGroupsForReport(type, order);
    var fallbackTargets = targets.length ? targets : [''];
    return fallbackTargets.map(function (targetGroup) {
      return reportOutbox.find(function (item) {
        return item.reportType === type && item.orderNumber === order.orderNumber && item.targetGroup === targetGroup;
      }) || {
        reportType: type,
        targetGroup: targetGroup,
        status: 'pending',
        sentAt: null,
        errorMessage: '',
        retryCount: 0
      };
    });
  });
}
// LEGACY DOCUMENT FUNCTION - pending cleanup: overridden by the active Arabic renderReportSendStatus implementation.
function renderReportSendStatus(order) {
  var rows = reportRowsForOrder(order).map(function (row) {
    return "<tr><td>".concat(escapeHtml(reportTypeLabels[row.reportType] || row.reportType), "</td><td>").concat(escapeHtml(row.targetGroup || '-'), "</td><td>").concat(reportTypeIcons[row.status] || '', " ").concat(reportStatusText[row.status] || row.status, "</td><td>").concat(row.sentAt ? arDateTime(row.sentAt) : '-', "</td><td>").concat(escapeHtml(row.errorMessage || '-'), "</td><td>").concat(row.id && row.status === 'failed' ? "<button class=\"mini-btn\" data-retry-outbox=\"".concat(row.id, "\">\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629</button>") : '', "</td></tr>");
  }).join('') || '<tr><td colspan="6">لا توجد تقارير في قائمة الإرسال.</td></tr>';
  return "<section class=\"report-send-status panel-card\"><div class=\"subsection-head\"><div><h3>\u062D\u0627\u0644\u0629 \u0645\u0634\u0627\u0631\u0643\u0629 \u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631</h3><p class=\"eyebrow\">\u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0629 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A\u0629 \u062A\u0639\u0645\u0644 \u0641\u0642\u0637 \u0639\u0646\u062F \u062A\u0641\u0639\u064A\u0644 \u0648\u0627\u062A\u0633\u0627\u0628 \u0648\u0631\u0628\u0637 \u0627\u0644\u062C\u0631\u0648\u0628\u0627\u062A.</p></div></div><table><thead><tr><th>\u0627\u0644\u062A\u0642\u0631\u064A\u0631</th><th>\u0627\u0644\u062C\u0631\u0648\u0628</th><th>\u0627\u0644\u062D\u0627\u0644\u0629</th><th>\u0648\u0642\u062A \u0627\u0644\u0625\u0631\u0633\u0627\u0644</th><th>\u0645\u0644\u0627\u062D\u0638\u0627\u062A</th><th>\u0625\u062C\u0631\u0627\u0621</th></tr></thead><tbody>".concat(rows, "</tbody></table></section>");
}
// LEGACY DOCUMENT FUNCTION - pending cleanup: overridden by the active Arabic whatsappGroupsPromptHint implementation.
function whatsappGroupsPromptHint() {
  return _whatsappGroupsPromptHint.apply(this, arguments);
}
function _whatsappGroupsPromptHint() {
  _whatsappGroupsPromptHint = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25() {
    var response, data, names, _t14;
    return _regenerator().w(function (_context25) {
      while (1) switch (_context25.p = _context25.n) {
        case 0:
          _context25.p = 0;
          _context25.n = 1;
          return fetch("".concat(WHATSAPP_SERVICE_URL, "/api/groups"));
        case 1:
          response = _context25.v;
          if (response.ok) {
            _context25.n = 2;
            break;
          }
          return _context25.a(2, '');
        case 2:
          _context25.n = 3;
          return response.json();
        case 3:
          data = _context25.v;
          names = (data.groups || []).map(function (group) {
            return group.name;
          }).filter(Boolean).slice(0, 20);
          return _context25.a(2, names.length ? "\n\n\u0627\u0644\u062C\u0631\u0648\u0628\u0627\u062A \u0627\u0644\u0645\u062A\u0627\u062D\u0629 \u062D\u0627\u0644\u064A\u064B\u0627:\n".concat(names.join('\n'), "\n\n\u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0627\u0644\u062C\u0631\u0648\u0628 \u0643\u0645\u0627 \u064A\u0638\u0647\u0631 \u0647\u0646\u0627.") : '');
        case 4:
          _context25.p = 4;
          _t14 = _context25.v;
          return _context25.a(2, '');
      }
    }, _callee25, null, [[0, 4]]);
  }));
  return _whatsappGroupsPromptHint.apply(this, arguments);
}
function whatsappSettingsRowHtml(type, label) {
  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var group = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  return "<tr data-whatsapp-group-row data-group-type=\"".concat(escapeHtml(type), "\">\n    <td><input type=\"text\" data-entity-name value=\"").concat(escapeHtml(name), "\" placeholder=\"").concat(escapeHtml(label), "\"></td>\n    <td><input type=\"text\" data-group-name value=\"").concat(escapeHtml(group), "\" placeholder=\"\u0627\u0633\u0645 \u062C\u0631\u0648\u0628 \u0648\u0627\u062A\u0633\u0627\u0628\"></td>\n    <td><button class=\"mini-btn\" type=\"button\" data-delete-group-row>\u062D\u0630\u0641</button></td>\n  </tr>");
}
function whatsappSettingsRows() {
  var map = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var names = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var rows = [];
  var seen = new Set();
  Object.entries(map || {}).forEach(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
      name = _ref5[0],
      group = _ref5[1];
    var cleanName = String(name || '').trim();
    if (!cleanName) return;
    seen.add(normalizeForCompare(cleanName));
    rows.push([cleanName, String(group || '').trim()]);
  });
  (names || []).forEach(function (name) {
    var cleanName = String(name || '').trim();
    var key = normalizeForCompare(cleanName);
    if (!cleanName || seen.has(key)) return;
    seen.add(key);
    rows.push([cleanName, '']);
  });
  return rows.length ? rows : [['', '']];
}
function whatsappSettingsSectionHtml(type, title, label, map, names) {
  var rowsHtml = whatsappSettingsRows(map, names).map(function (_ref6) {
    var _ref7 = _slicedToArray(_ref6, 2),
      name = _ref7[0],
      group = _ref7[1];
    return whatsappSettingsRowHtml(type, label, name, group);
  }).join('');
  return "<section class=\"whatsapp-settings-section\">\n    <div class=\"subsection-head\"><h3>".concat(escapeHtml(title), "</h3><button class=\"mini-btn\" type=\"button\" data-add-whatsapp-group-row=\"").concat(escapeHtml(type), "\" data-row-label=\"").concat(escapeHtml(label), "\">\u0625\u0636\u0627\u0641\u0629</button></div>\n    <table>\n      <thead><tr><th>").concat(escapeHtml(label), "</th><th>\u0627\u0633\u0645 \u062C\u0631\u0648\u0628 \u0648\u0627\u062A\u0633\u0627\u0628</th><th>\u0625\u062C\u0631\u0627\u0621</th></tr></thead>\n      <tbody data-whatsapp-group-rows=\"").concat(escapeHtml(type), "\">").concat(rowsHtml, "</tbody>\n    </table>\n  </section>");
}
function renderWhatsappSettingsDialog() {
  var groupNames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  ensureRuntimeCollections();
  var groupOptions = groupNames.map(function (name) {
    return "<option value=\"".concat(escapeHtml(name), "\"></option>");
  }).join('');
  refs.documentTitle.textContent = 'إعدادات واتساب';
  refs.documentBody.dataset.documentType = 'whatsapp-settings';
  refs.documentBody.innerHTML = "<div class=\"document-sheet whatsapp-settings-sheet\">\n    <h2>\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0648\u0627\u062A\u0633\u0627\u0628</h2>\n    <p class=\"muted\">\u0627\u0631\u0628\u0637 \u0643\u0644 \u0639\u0645\u064A\u0644 \u0623\u0648 \u0645\u0635\u0628\u063A\u0629 \u0623\u0648 \u0645\u0635\u062F\u0631 \u0646\u0633\u064A\u062C \u0628\u0627\u0644\u062C\u0631\u0648\u0628 \u0627\u0644\u0635\u062D\u064A\u062D. \u0627\u0644\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A \u0644\u0627 \u064A\u0639\u0645\u0644 \u0625\u0644\u0627 \u0639\u0646\u062F \u062A\u0641\u0639\u064A\u0644\u0647 \u0635\u0631\u0627\u062D\u0629.</p>\n    <div data-whatsapp-connection-panel>".concat(whatsappConnectionPanelHtml(), "</div>\n    <div class=\"summary-grid\">\n      <label><span>\u062C\u0631\u0648\u0628 \u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u0644\u0639\u0627\u0645\u0629</span><input type=\"text\" data-general-report-group value=\"").concat(escapeHtml(whatsappSettings.dyehousesReportGroupName || ''), "\" placeholder=\"\u0645\u062B\u0627\u0644: \u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u0644\u0645\u0635\u0627\u0628\u063A\"></label>\n      <label class=\"checkbox-row\"><input type=\"checkbox\" data-sending-enabled ").concat(whatsappSettings.sendingEnabled ? 'checked' : '', "> <span>\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A \u0639\u0646\u062F \u062A\u0634\u063A\u064A\u0644 \u062E\u062F\u0645\u0629 \u0648\u0627\u062A\u0633\u0627\u0628</span></label>\n    </div>\n    ").concat(whatsappSettingsSectionHtml('dyehouse', 'ربط المصابغ بالجروبات', 'اسم المصبغة', whatsappSettings.dyehouseGroups, knownDyehouseNames()), "\n    ").concat(whatsappSettingsSectionHtml('weaving', 'ربط مصادر النسيج بالجروبات', 'مصدر النسيج', whatsappSettings.weavingGroups, knownWeavingNames()), "\n    ").concat(whatsappSettingsSectionHtml('customer', 'ربط العملاء بالجروبات', 'اسم العميل', whatsappSettings.customerGroups, knownCustomerNames()), "\n    <datalist id=\"whatsappGroupNames\">").concat(groupOptions, "</datalist>\n    <div class=\"document-actions no-print\">\n      <button class=\"primary-btn\" type=\"button\" data-save-whatsapp-settings>\u062D\u0641\u0638 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A</button>\n    </div>\n  </div>");
  refs.documentBody.querySelectorAll('[data-group-name]').forEach(function (input) {
    return input.setAttribute('list', 'whatsappGroupNames');
  });
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
  startWhatsappSettingsAutoRefresh();
}
function saveWhatsappSettingsFromDialog() {
  return _saveWhatsappSettingsFromDialog.apply(this, arguments);
}
function _saveWhatsappSettingsFromDialog() {
  _saveWhatsappSettingsFromDialog = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26() {
    var _refs$documentBody$qu2, _refs$documentBody$qu3;
    var before, nextMaps, nextSettings, saved;
    return _regenerator().w(function (_context26) {
      while (1) switch (_context26.n) {
        case 0:
          _context26.n = 1;
          return ensureBackendForWrite('تعذر الاتصال بقاعدة البيانات. لم يتم حفظ إعدادات واتساب.');
        case 1:
          if (_context26.v) {
            _context26.n = 2;
            break;
          }
          return _context26.a(2);
        case 2:
          before = clone(whatsappSettings);
          nextMaps = {
            dyehouse: {},
            weaving: {},
            customer: {}
          };
          refs.documentBody.querySelectorAll('[data-whatsapp-group-row]').forEach(function (row) {
            var _row$querySelector, _row$querySelector2;
            var type = row.dataset.groupType || 'dyehouse';
            var entity = ((_row$querySelector = row.querySelector('[data-entity-name]')) === null || _row$querySelector === void 0 ? void 0 : _row$querySelector.value.trim()) || '';
            var group = ((_row$querySelector2 = row.querySelector('[data-group-name]')) === null || _row$querySelector2 === void 0 ? void 0 : _row$querySelector2.value.trim()) || '';
            if (entity && group && nextMaps[type]) nextMaps[type][entity] = group;
          });
          nextSettings = _objectSpread(_objectSpread({}, whatsappSettings), {}, {
            dyehousesReportGroupName: ((_refs$documentBody$qu2 = refs.documentBody.querySelector('[data-general-report-group]')) === null || _refs$documentBody$qu2 === void 0 ? void 0 : _refs$documentBody$qu2.value.trim()) || '',
            dyehouseGroups: nextMaps.dyehouse,
            weavingGroups: nextMaps.weaving,
            customerGroups: nextMaps.customer,
            sendingEnabled: !!((_refs$documentBody$qu3 = refs.documentBody.querySelector('[data-sending-enabled]')) !== null && _refs$documentBody$qu3 !== void 0 && _refs$documentBody$qu3.checked)
          });
          _context26.n = 3;
          return saveBackendSetting('whatsappSettings', nextSettings);
        case 3:
          saved = _context26.v;
          if (saved) {
            _context26.n = 5;
            break;
          }
          _context26.n = 4;
          return rollbackAfterBackendWriteFailure('تعذر حفظ إعدادات واتساب في قاعدة البيانات. لم يتم اعتماد التعديل.');
        case 4:
          return _context26.a(2);
        case 5:
          whatsappSettings = nextSettings;
          recordAudit('update', 'whatsappSettings', 'groups', before, whatsappSettings, 'تحديث إعدادات مجموعات واتساب');
          refreshOutboxTargetsAfterSettings();
          _context26.n = 6;
          return saveBackendSetting('auditLog', auditLog);
        case 6:
          save();
          syncOutboxToWhatsappService();
          _context26.n = 7;
          return loadBackendData();
        case 7:
          renderWhatsappSettingsDialog();
          alert(whatsappSettings.sendingEnabled ? 'تم حفظ إعدادات واتساب وتفعيل الإرسال.' : 'تم حفظ إعدادات واتساب مع بقاء الإرسال التلقائي متوقفًا.');
        case 8:
          return _context26.a(2);
      }
    }, _callee26);
  }));
  return _saveWhatsappSettingsFromDialog.apply(this, arguments);
}
function isLegacyRecoveredText(value) {
  var text = String(value || '');
  var legacyText = ['نص', 'قديم', 'غير', 'مستعاد'].join(' ');
  return text.includes(legacyText) || /\uFFFD|ï؟½|\?{3,}/.test(text);
}
function normalizeDyehousePriceLabel(value) {
  var text = String(value || '').trim().replace(/كسر بياض/g, 'كسترة').replace(/أسود مخصوص/g, 'أسود خاص').replace(/بني غامق/g, 'ألوان خاصة').replace(/^خصوص$/g, 'ألوان خاصة').replace(/^ألوان$/g, 'ألوان خاصة');
  return text;
}
var roundNumber = function roundNumber(value) {
  var digits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var number = Number(value || 0);
  return Number(Math.round((number + Number.EPSILON) * Math.pow(10, digits)) / Math.pow(10, digits));
};
var formatNumber = function formatNumber(value) {
  var digits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  return roundNumber(value, digits).toLocaleString('en-US', {
    maximumFractionDigits: digits
  });
};
var sum = function sum(items) {
  return roundNumber(items.reduce(function (total, item) {
    return total + Number(item.quantity || 0);
  }, 0));
};
var pricingDomain = window.TwoBTexPricing.createPricingDomain({
  buildItemCode: buildItemCode,
  clone: clone,
  isLegacyRecoveredText: isLegacyRecoveredText,
  normalizeDyehousePriceLabel: normalizeDyehousePriceLabel,
  roundNumber: roundNumber
});
function sanitizeDyehousePriceLibrary() {
  var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return pricingDomain.sanitizeDyehousePriceLibrary(source);
}
function dyehousePriceRows() {
  var rows = [];
  Object.entries(activeDyehousePriceLibrary()).forEach(function (_ref8) {
    var _ref9 = _slicedToArray(_ref8, 2),
      dyehouse = _ref9[0],
      config = _ref9[1];
    if (isLegacyRecoveredText(dyehouse)) return;
    if (config !== null && config !== void 0 && config.aliasOf) return;
    var dyeing = (config === null || config === void 0 ? void 0 : config.dyeing) || {};
    Object.entries(dyeing).forEach(function (_ref0) {
      var _ref1 = _slicedToArray(_ref0, 2),
        material = _ref1[0],
        colors = _ref1[1];
      if (isLegacyRecoveredText(material)) return;
      Object.entries(colors || {}).forEach(function (_ref10) {
        var _ref11 = _slicedToArray(_ref10, 2),
          color = _ref11[0],
          price = _ref11[1];
        if (isLegacyRecoveredText(color)) return;
        rows.push({
          dyehouse: dyehouse,
          material: material,
          color: color,
          price: price !== null && price !== void 0 ? price : ''
        });
      });
    });
    if (!Object.keys(dyeing).length) rows.push({
      dyehouse: dyehouse,
      material: '',
      color: '',
      price: ''
    });
  });
  return rows.length ? rows : [{
    dyehouse: '',
    material: '',
    color: '',
    price: ''
  }];
}
function dyehousePriceRowHtml() {
  var _row$price;
  var row = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return "<tr data-dyehouse-price-row>\n    <td><input type=\"text\" data-price-dyehouse value=\"".concat(escapeHtml(row.dyehouse || ''), "\" placeholder=\"\u0627\u0633\u0645 \u0627\u0644\u0645\u0635\u0628\u063A\u0629\"></td>\n    <td><input type=\"text\" data-price-material value=\"").concat(escapeHtml(row.material || ''), "\" placeholder=\"\u0646\u0648\u0639 \u0627\u0644\u062E\u0627\u0645\u0629\"></td>\n    <td><input type=\"text\" data-price-color value=\"").concat(escapeHtml(row.color || ''), "\" placeholder=\"\u062F\u0631\u062C\u0629 \u0627\u0644\u0644\u0648\u0646\"></td>\n    <td><input type=\"number\" step=\"0.01\" data-price-value value=\"").concat(escapeHtml((_row$price = row.price) !== null && _row$price !== void 0 ? _row$price : ''), "\" placeholder=\"\u0627\u0644\u0633\u0639\u0631\"></td>\n    <td><button class=\"mini-btn\" type=\"button\" data-delete-price-row>\u062D\u0630\u0641</button></td>\n  </tr>");
}
function dyehousePriceSummaryHtml() {
  return Object.entries(activeDyehousePriceLibrary()).filter(function (_ref12) {
    var _ref13 = _slicedToArray(_ref12, 1),
      name = _ref13[0];
    return name && !isLegacyRecoveredText(name);
  }).map(function (_ref14) {
    var _ref15 = _slicedToArray(_ref14, 2),
      dyehouse = _ref15[0],
      config = _ref15[1];
    var extras = Object.entries(config.extras || {}).map(function (_ref16) {
      var _ref17 = _slicedToArray(_ref16, 2),
        name = _ref17[0],
        price = _ref17[1];
      return "<tr><td>".concat(escapeHtml(name), "</td><td>").concat(escapeHtml(price), "</td></tr>");
    }).join('') || '<tr><td colspan="2">لا توجد بنود تجهيز.</td></tr>';
    var printing = Object.entries(config.printing || {}).flatMap(function (_ref18) {
      var _ref19 = _slicedToArray(_ref18, 2),
        type = _ref19[0],
        rows = _ref19[1];
      return Object.entries(rows || {}).map(function (_ref20) {
        var _ref21 = _slicedToArray(_ref20, 2),
          name = _ref21[0],
          price = _ref21[1];
        return "<tr><td>".concat(escapeHtml(type), "</td><td>").concat(escapeHtml(name), "</td><td>").concat(escapeHtml(price), "</td></tr>");
      });
    }).join('') || '<tr><td colspan="3">لا توجد طباعة.</td></tr>';
    return "<section class=\"whatsapp-settings-section\">\n      <div class=\"subsection-head\"><h3>".concat(escapeHtml(dyehouse), " - ").concat(config.accountingMode === 'gross' ? 'قائم' : 'صافي', "</h3></div>\n      <h4>\u0627\u0644\u062A\u062C\u0647\u064A\u0632</h4>\n      <table><thead><tr><th>\u0627\u0644\u0628\u0646\u062F</th><th>\u0627\u0644\u0633\u0639\u0631</th></tr></thead><tbody>").concat(extras, "</tbody></table>\n      <h4>\u0627\u0644\u0637\u0628\u0627\u0639\u0629</h4>\n      <table><thead><tr><th>\u0627\u0644\u0646\u0648\u0639</th><th>\u0627\u0644\u0628\u0646\u062F</th><th>\u0627\u0644\u0633\u0639\u0631</th></tr></thead><tbody>").concat(printing, "</tbody></table>\n    </section>");
  }).join('');
}
function renderDyehousePricesDialog() {
  var rowsHtml = dyehousePriceRows().map(dyehousePriceRowHtml).join('');
  refs.documentTitle.textContent = 'أسعار المصابغ';
  refs.documentBody.dataset.documentType = 'dyehouse-prices';
  refs.documentBody.innerHTML = "<div class=\"document-sheet whatsapp-settings-sheet\">\n    <h2>\u062A\u062D\u062F\u064A\u062B \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0645\u0635\u0627\u0628\u063A</h2>\n    <p class=\"muted\">\u0623\u0636\u0641 \u0623\u0648 \u0639\u062F\u0644 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0635\u0628\u0627\u063A\u0629 \u0648\u0627\u0644\u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0629 \u0641\u064A \u0634\u0627\u0634\u0629 \u0627\u0644\u062A\u0633\u0639\u064A\u0631. \u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0627\u0644\u0645\u0635\u0628\u063A\u0629 \u0648\u0646\u0648\u0639 \u0627\u0644\u062E\u0627\u0645\u0629 \u0648\u062F\u0631\u062C\u0629 \u0627\u0644\u0644\u0648\u0646 \u0648\u0627\u0644\u0633\u0639\u0631\u060C \u062B\u0645 \u0627\u062D\u0641\u0638 \u0627\u0644\u0642\u0627\u0626\u0645\u0629.</p>\n    <table>\n      <thead><tr><th>\u0627\u0644\u0645\u0635\u0628\u063A\u0629</th><th>\u0646\u0648\u0639 \u0627\u0644\u062E\u0627\u0645\u0629</th><th>\u062F\u0631\u062C\u0629 \u0627\u0644\u0644\u0648\u0646</th><th>\u0627\u0644\u0633\u0639\u0631</th><th>\u0625\u062C\u0631\u0627\u0621</th></tr></thead>\n      <tbody data-dyehouse-price-rows>".concat(rowsHtml, "</tbody>\n    </table>\n    ").concat(dyehousePriceSummaryHtml(), "\n    <div class=\"document-actions no-print\">\n      <button class=\"mini-btn\" type=\"button\" data-add-price-row>\u0625\u0636\u0627\u0641\u0629 \u0628\u0646\u062F</button>\n      <button class=\"primary-btn\" type=\"button\" data-save-dyehouse-prices>\u062D\u0641\u0638 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0645\u0635\u0627\u0628\u063A</button>\n    </div>\n  </div>");
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
function saveDyehousePricesFromDialog() {
  return _saveDyehousePricesFromDialog.apply(this, arguments);
}
function _saveDyehousePricesFromDialog() {
  _saveDyehousePricesFromDialog = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27() {
    var before, next, saved;
    return _regenerator().w(function (_context27) {
      while (1) switch (_context27.n) {
        case 0:
          _context27.n = 1;
          return ensureBackendForWrite('تعذر الاتصال بقاعدة البيانات. لم يتم حفظ أسعار المصابغ.');
        case 1:
          if (_context27.v) {
            _context27.n = 2;
            break;
          }
          return _context27.a(2);
        case 2:
          before = clone(customDyehousePriceLibrary || {});
          next = {};
          refs.documentBody.querySelectorAll('[data-dyehouse-price-row]').forEach(function (row) {
            var _row$querySelector3, _row$querySelector4, _row$querySelector5, _row$querySelector6;
            var dyehouse = ((_row$querySelector3 = row.querySelector('[data-price-dyehouse]')) === null || _row$querySelector3 === void 0 ? void 0 : _row$querySelector3.value.trim()) || '';
            var material = ((_row$querySelector4 = row.querySelector('[data-price-material]')) === null || _row$querySelector4 === void 0 ? void 0 : _row$querySelector4.value.trim()) || '';
            var color = normalizeDyehousePriceLabel(((_row$querySelector5 = row.querySelector('[data-price-color]')) === null || _row$querySelector5 === void 0 ? void 0 : _row$querySelector5.value) || '');
            var rawPrice = (_row$querySelector6 = row.querySelector('[data-price-value]')) === null || _row$querySelector6 === void 0 ? void 0 : _row$querySelector6.value;
            if (!dyehouse || isLegacyRecoveredText(dyehouse) || isLegacyRecoveredText(material) || isLegacyRecoveredText(color)) return;
            if (!next[dyehouse]) {
              var _customDyehousePriceL;
              var existing = ((_customDyehousePriceL = customDyehousePriceLibrary) === null || _customDyehousePriceL === void 0 ? void 0 : _customDyehousePriceL[dyehouse]) || {};
              next[dyehouse] = {
                effectiveFrom: existing.effectiveFrom || '',
                accountingMode: existing.accountingMode || 'net',
                dyeing: {},
                printing: clone(existing.printing || {}),
                extras: clone(existing.extras || {})
              };
              if (existing.aliasOf) next[dyehouse].aliasOf = existing.aliasOf;
            }
            if (!material || !color || rawPrice === '') return;
            var price = Number(rawPrice);
            if (!Number.isFinite(price)) return;
            if (!next[dyehouse].dyeing[material]) next[dyehouse].dyeing[material] = {};
            next[dyehouse].dyeing[material][color] = price;
          });
          customDyehousePriceLibrary = sanitizeDyehousePriceLibrary(next);
          _context27.n = 3;
          return saveDyehousePriceLibrary();
        case 3:
          saved = _context27.v;
          if (saved) {
            _context27.n = 5;
            break;
          }
          customDyehousePriceLibrary = before;
          saveDyehousePriceLibraryLocal();
          _context27.n = 4;
          return rollbackAfterBackendWriteFailure('تعذر حفظ أسعار المصابغ في قاعدة البيانات. لم يتم اعتماد التعديل.');
        case 4:
          return _context27.a(2);
        case 5:
          recordAudit('update', 'dyehousePriceLibrary', 'pricing', before, customDyehousePriceLibrary, 'تحديث أسعار المصابغ');
          _context27.n = 6;
          return saveBackendSetting('auditLog', auditLog);
        case 6:
          _context27.n = 7;
          return loadBackendData();
        case 7:
          applyPricingDyehouseOptions();
          updateSuggestedDyeCost();
          renderDyehousePricesDialog();
          alert('تم حفظ أسعار المصابغ بنجاح.');
        case 8:
          return _context27.a(2);
      }
    }, _callee27);
  }));
  return _saveDyehousePricesFromDialog.apply(this, arguments);
}
function csvCell(value) {
  var text = String(value !== null && value !== void 0 ? value : '').replace(/"/g, '""');
  return "\"".concat(text, "\"");
}
function downloadTextFile(fileName, content) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'text/csv;charset=utf-8';
  var blob = new Blob(["\uFEFF", content], {
    type: type
  });
  var url = URL.createObjectURL(blob);
  var link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(function () {
    return URL.revokeObjectURL(url);
  }, 1000);
}
function buildA5ExportRows() {
  var rows = [];
  pricings.filter(function (pricing) {
    return !pricing.convertedOrderId;
  }).map(calculatePricing).forEach(function (pricing) {
    rows.push({
      type: 'عرض سعر',
      number: pricing.pricingNumber,
      date: pricing.pricingDate,
      customer: pricing.customer,
      item: pricing.fabricType,
      quantity: pricing.quantity,
      unitPrice: pricing.sellPrice,
      total: pricing.totalOffer,
      paymentTerms: pricing.paymentTerms,
      source: '2B Tex - التسعير',
      notes: pricing.notes || ''
    });
  });
  orders.map(calculateOrder).forEach(function (order) {
    var deliveredQuantity = Number(order.totalDeliveredToCustomer || 0);
    var contractQuantity = Number(order.totalRawQuantity || order.totalRawOrdered || 0);
    var quantity = deliveredQuantity || contractQuantity;
    var unitPrice = Number(order.kiloPrice || 0);
    rows.push({
      type: deliveredQuantity ? 'فاتورة تسليم عميل' : 'طلب تشغيل',
      number: order.orderNumber,
      date: order.orderDate,
      customer: order.customer,
      item: order.fabricType,
      quantity: quantity,
      unitPrice: unitPrice,
      total: roundNumber(quantity * unitPrice),
      paymentTerms: order.paymentTerms,
      source: '2B Tex - المتابعة',
      notes: order.notes || ''
    });
  });
  return rows;
}
function exportA5AccountingCsv() {
  var headers = ['نوع الحركة', 'رقم المستند', 'التاريخ', 'العميل', 'البند', 'الكمية', 'سعر الوحدة', 'الإجمالي', 'شروط السداد', 'المصدر', 'ملاحظات'];
  var rows = buildA5ExportRows();
  var body = rows.map(function (row) {
    return [row.type, row.number, row.date, row.customer, row.item, row.quantity, row.unitPrice, row.total, row.paymentTerms, row.source, row.notes].map(csvCell).join(',');
  }).join('\r\n');
  var fileName = "2B-A5-export-".concat(new Date().toISOString().slice(0, 10), ".csv");
  downloadTextFile(fileName, "".concat(headers.map(csvCell).join(','), "\r\n").concat(body));
  alert("\u062A\u0645 \u062A\u062C\u0647\u064A\u0632 \u0645\u0644\u0641 A5 \u0628\u0639\u062F\u062F ".concat(rows.length, " \u062D\u0631\u0643\u0629. \u0627\u0641\u062A\u062D \u0627\u0644\u0645\u0644\u0641 \u0641\u064A Excel \u062B\u0645 \u0631\u0627\u062C\u0639\u0647 \u0642\u0628\u0644 \u0631\u0641\u0639\u0647 \u0625\u0644\u0649 A5."));
}
function renderA5ExportDialog() {
  var rows = buildA5ExportRows();
  var preview = rows.slice(0, 20).map(function (row) {
    return "<tr><td>".concat(row.type, "</td><td>").concat(row.number, "</td><td>").concat(row.date || '-', "</td><td>").concat(row.customer || '-', "</td><td>").concat(row.item || '-', "</td><td>").concat(formatNumber(row.quantity || 0), "</td><td>").concat(formatNumber(row.total || 0), "</td></tr>");
  }).join('');
  refs.documentTitle.textContent = 'تصدير حركات A5';
  refs.documentBody.dataset.documentType = 'a5-export';
  refs.documentBody.innerHTML = "<div class=\"document-sheet\">\n    <h2>\u062A\u0635\u062F\u064A\u0631 \u062D\u0631\u0643\u0627\u062A A5</h2>\n    <p class=\"muted\">\u0647\u0630\u0647 \u0634\u0627\u0634\u0629 \u062A\u062C\u0647\u064A\u0632 \u0645\u0644\u0641 CSV \u0644\u0644\u0642\u0631\u0627\u0621\u0629 \u0648\u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0642\u0628\u0644 \u0627\u0644\u0631\u0641\u0639 \u0625\u0644\u0649 \u0628\u0631\u0646\u0627\u0645\u062C A5. \u0644\u0627 \u064A\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0623\u0631\u0635\u062F\u0629 A5 \u0645\u0646 \u062F\u0627\u062E\u0644 \u0646\u0638\u0627\u0645 \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629.</p>\n    <div class=\"document-actions no-print\"><button class=\"primary-btn\" type=\"button\" data-export-a5-csv>\u062A\u062D\u0645\u064A\u0644 \u0645\u0644\u0641 A5 CSV</button></div>\n    <table><thead><tr><th>\u0627\u0644\u0646\u0648\u0639</th><th>\u0631\u0642\u0645 \u0627\u0644\u0645\u0633\u062A\u0646\u062F</th><th>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</th><th>\u0627\u0644\u0639\u0645\u064A\u0644</th><th>\u0627\u0644\u0628\u0646\u062F</th><th>\u0627\u0644\u0643\u0645\u064A\u0629</th><th>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</th></tr></thead><tbody>".concat(preview || '<tr><td colspan="7">لا توجد حركات جاهزة للتصدير.</td></tr>', "</tbody></table>\n  </div>");
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
function ensureCustomerAccount(customerName) {
  var name = String(customerName || '').trim();
  if (!name) return null;
  if (!customerAccounts[name] || _typeof(customerAccounts[name]) !== 'object' || Array.isArray(customerAccounts[name])) {
    customerAccounts[name] = {
      openingBalance: 0,
      payments: []
    };
  }
  if (!Array.isArray(customerAccounts[name].payments)) customerAccounts[name].payments = [];
  customerAccounts[name].openingBalance = Number(customerAccounts[name].openingBalance || 0);
  return customerAccounts[name];
}
function customerAccountInvoices(customerName) {
  var name = String(customerName || '').trim();
  return orders.filter(function (order) {
    return String(order.customer || '').trim() === name;
  }).map(calculateOrder).map(function (order) {
    var deliveredQuantity = Number(order.totalDeliveredToCustomer || 0);
    var contractQuantity = Number(order.totalRawQuantity || order.totalRawOrdered || 0);
    var invoiceQuantity = deliveredQuantity || (order.operationClosed ? contractQuantity : 0);
    var unitPrice = Number(order.kiloPrice || 0);
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      date: order.orderDate,
      item: order.fabricType,
      quantity: invoiceQuantity,
      unitPrice: unitPrice,
      amount: roundNumber(invoiceQuantity * unitPrice),
      status: deliveredQuantity ? 'تم التسليم' : order.operationClosed ? 'مغلق بدون تسليم' : 'تحت التشغيل'
    };
  });
}
function customerAccountSummary(customerName) {
  var account = ensureCustomerAccount(customerName) || {
    openingBalance: 0,
    payments: []
  };
  var invoices = customerAccountInvoices(customerName);
  var invoiceTotal = roundNumber(invoices.reduce(function (total, item) {
    return total + Number(item.amount || 0);
  }, 0));
  var paymentTotal = roundNumber((account.payments || []).reduce(function (total, item) {
    return total + Number(item.amount || 0);
  }, 0));
  var balance = roundNumber(Number(account.openingBalance || 0) + invoiceTotal - paymentTotal);
  return {
    customerName: customerName,
    openingBalance: Number(account.openingBalance || 0),
    invoices: invoices,
    invoiceTotal: invoiceTotal,
    payments: account.payments || [],
    paymentTotal: paymentTotal,
    balance: balance
  };
}
function knownAccountCustomers() {
  return uniqueNonEmpty([].concat(_toConsumableArray(orders.map(function (order) {
    return order.customer;
  })), _toConsumableArray(pricings.map(function (pricing) {
    return pricing.customer;
  })), _toConsumableArray(Object.keys(customerAccounts || {}))));
}
function renderCustomerAccountsDialog() {
  ensureRuntimeCollections();
  knownAccountCustomers().forEach(ensureCustomerAccount);
  var rows = knownAccountCustomers().map(customerAccountSummary).map(function (item) {
    return "<tr><td>".concat(escapeHtml(item.customerName), "</td><td>").concat(formatNumber(item.openingBalance), "</td><td>").concat(formatNumber(item.invoiceTotal), "</td><td>").concat(formatNumber(item.paymentTotal), "</td><td>").concat(formatNumber(item.balance), "</td><td><button class=\"mini-btn\" type=\"button\" data-customer-ledger=\"").concat(escapeHtml(item.customerName), "\">\u0639\u0631\u0636 \u0627\u0644\u062D\u0633\u0627\u0628</button></td></tr>");
  }).join('');
  refs.documentTitle.textContent = 'حسابات العملاء';
  refs.documentBody.dataset.documentType = 'customer-accounts';
  refs.documentBody.innerHTML = "<div class=\"document-sheet\">\n    <h2>\u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u0639\u0645\u0644\u0627\u0621</h2>\n    <p class=\"muted\">\u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u062D\u0627\u0644\u064A = \u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u0627\u0641\u062A\u062A\u0627\u062D\u064A + \u0645\u0633\u062A\u062D\u0642\u0627\u062A \u0627\u0644\u0637\u0644\u0628\u0627\u062A - \u0627\u0644\u0645\u062F\u0641\u0648\u0639\u0627\u062A. \u0647\u0630\u0647 \u0627\u0644\u0642\u0631\u0627\u0621\u0629 \u062F\u0627\u062E\u0644 \u0646\u0638\u0627\u0645 \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0641\u0642\u0637 \u0648\u0644\u0627 \u062A\u0639\u062F\u0644 \u0623\u0631\u0635\u062F\u0629 A5.</p>\n    <table><thead><tr><th>\u0627\u0644\u0639\u0645\u064A\u0644</th><th>\u0631\u0635\u064A\u062F \u0627\u0641\u062A\u062A\u0627\u062D\u064A</th><th>\u0645\u0628\u064A\u0639\u0627\u062A / \u0645\u0633\u062A\u062D\u0642\u0627\u062A</th><th>\u0645\u062F\u0641\u0648\u0639\u0627\u062A</th><th>\u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u062D\u0627\u0644\u064A</th><th>\u0625\u062C\u0631\u0627\u0621</th></tr></thead><tbody>".concat(rows || '<tr><td colspan="6">لا توجد حسابات عملاء متاحة.</td></tr>', "</tbody></table>\n  </div>");
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
function renderCustomerLedgerDialog(customerName) {
  var summary = customerAccountSummary(customerName);
  var invoiceRows = summary.invoices.map(function (item) {
    return "<tr><td>".concat(item.orderNumber || '-', "</td><td>").concat(item.date || '-', "</td><td>").concat(item.item || '-', "</td><td>").concat(formatNumber(item.quantity), "</td><td>").concat(formatNumber(item.unitPrice), "</td><td>").concat(formatNumber(item.amount), "</td><td>").concat(item.status, "</td></tr>");
  }).join('');
  var paymentRows = summary.payments.map(function (item) {
    return "<tr><td>".concat(item.date || '-', "</td><td>").concat(formatNumber(item.amount), "</td><td>").concat(item.method || '-', "</td><td>").concat(item.notes || '-', "</td><td><button class=\"mini-btn danger\" type=\"button\" data-delete-customer-payment=\"").concat(item.id, "\" data-customer-name=\"").concat(escapeHtml(summary.customerName), "\">\u062D\u0630\u0641</button></td></tr>");
  }).join('');
  refs.documentTitle.textContent = "\u0643\u0634\u0641 \u062D\u0633\u0627\u0628 \u0627\u0644\u0639\u0645\u064A\u0644 ".concat(summary.customerName);
  refs.documentBody.dataset.documentType = 'customer-ledger';
  refs.documentBody.innerHTML = "<div class=\"document-sheet\">\n    <div class=\"subsection-head\"><h2>\u0643\u0634\u0641 \u062D\u0633\u0627\u0628 \u0627\u0644\u0639\u0645\u064A\u0644 ".concat(escapeHtml(summary.customerName), "</h2><button class=\"mini-btn\" type=\"button\" data-back-customer-accounts>\u0631\u062C\u0648\u0639</button></div>\n    <div class=\"summary-grid\">\n      <div class=\"metric\"><span>\u0631\u0635\u064A\u062F \u0627\u0641\u062A\u062A\u0627\u062D\u064A</span><strong>").concat(formatNumber(summary.openingBalance), "</strong></div>\n      <div class=\"metric\"><span>\u0645\u0628\u064A\u0639\u0627\u062A / \u0645\u0633\u062A\u062D\u0642\u0627\u062A</span><strong>").concat(formatNumber(summary.invoiceTotal), "</strong></div>\n      <div class=\"metric\"><span>\u0645\u062F\u0641\u0648\u0639\u0627\u062A</span><strong>").concat(formatNumber(summary.paymentTotal), "</strong></div>\n      <div class=\"metric emphasis\"><span>\u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u062D\u0627\u0644\u064A</span><strong>").concat(formatNumber(summary.balance), "</strong></div>\n    </div>\n    <section class=\"report-section\">\n      <h3>\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u0627\u0641\u062A\u062A\u0627\u062D\u064A</h3>\n      <div class=\"summary-grid\"><label><span>\u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u0627\u0641\u062A\u062A\u0627\u062D\u064A</span><input type=\"number\" step=\"0.01\" data-opening-balance value=\"").concat(summary.openingBalance, "\"></label><button class=\"primary-btn\" type=\"button\" data-save-opening-balance=\"").concat(escapeHtml(summary.customerName), "\">\u062D\u0641\u0638 \u0627\u0644\u0631\u0635\u064A\u062F</button></div>\n    </section>\n    <section class=\"report-section\">\n      <h3>\u0625\u0636\u0627\u0641\u0629 \u062F\u0641\u0639\u0629</h3>\n      <div class=\"summary-grid\"><input type=\"date\" data-payment-date value=\"").concat(new Date().toISOString().slice(0, 10), "\"><input type=\"number\" step=\"0.01\" data-payment-amount placeholder=\"\u0627\u0644\u0645\u0628\u0644\u063A\"><input data-payment-method placeholder=\"\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639\"><input data-payment-notes placeholder=\"\u0645\u0644\u0627\u062D\u0638\u0627\u062A\"><button class=\"primary-btn\" type=\"button\" data-add-customer-payment=\"").concat(escapeHtml(summary.customerName), "\">\u0625\u0636\u0627\u0641\u0629 \u062F\u0641\u0639\u0629</button></div>\n    </section>\n    <section class=\"report-section\"><h3>\u0641\u0648\u0627\u062A\u064A\u0631 \u0627\u0644\u0637\u0644\u0628\u0627\u062A</h3><table><thead><tr><th>\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628</th><th>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</th><th>\u0627\u0644\u0628\u0646\u062F</th><th>\u0627\u0644\u0643\u0645\u064A\u0629</th><th>\u0633\u0639\u0631 \u0627\u0644\u0648\u062D\u062F\u0629</th><th>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</th><th>\u0627\u0644\u062D\u0627\u0644\u0629</th></tr></thead><tbody>").concat(invoiceRows || '<tr><td colspan="7">لا توجد فواتير مسجلة لهذا العميل.</td></tr>', "</tbody></table></section>\n    <section class=\"report-section\"><h3>\u0627\u0644\u0645\u062F\u0641\u0648\u0639\u0627\u062A</h3><table><thead><tr><th>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</th><th>\u0627\u0644\u0645\u0628\u0644\u063A</th><th>\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639</th><th>\u0645\u0644\u0627\u062D\u0638\u0627\u062A</th><th>\u0625\u062C\u0631\u0627\u0621</th></tr></thead><tbody>").concat(paymentRows || '<tr><td colspan="5">لا توجد مدفوعات مسجلة لهذا العميل.</td></tr>', "</tbody></table></section>\n  </div>");
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
function saveCustomerOpeningBalance(_x19) {
  return _saveCustomerOpeningBalance.apply(this, arguments);
}
function _saveCustomerOpeningBalance() {
  _saveCustomerOpeningBalance = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee28(customerName) {
    var _refs$documentBody$qu4;
    var account, before, nextAccounts, saved;
    return _regenerator().w(function (_context28) {
      while (1) switch (_context28.n) {
        case 0:
          account = ensureCustomerAccount(customerName);
          if (account) {
            _context28.n = 1;
            break;
          }
          return _context28.a(2);
        case 1:
          _context28.n = 2;
          return ensureBackendForWrite('تعذر الاتصال بقاعدة البيانات. لم يتم حفظ حساب العميل.');
        case 2:
          if (_context28.v) {
            _context28.n = 3;
            break;
          }
          return _context28.a(2);
        case 3:
          before = clone(account);
          nextAccounts = clone(customerAccounts);
          nextAccounts[customerName] = _objectSpread(_objectSpread({}, nextAccounts[customerName] || {
            payments: []
          }), {}, {
            openingBalance: Number(((_refs$documentBody$qu4 = refs.documentBody.querySelector('[data-opening-balance]')) === null || _refs$documentBody$qu4 === void 0 ? void 0 : _refs$documentBody$qu4.value) || 0)
          });
          _context28.n = 4;
          return saveBackendSetting('customerAccounts', nextAccounts);
        case 4:
          saved = _context28.v;
          if (saved) {
            _context28.n = 6;
            break;
          }
          _context28.n = 5;
          return rollbackAfterBackendWriteFailure('تعذر حفظ حساب العميل في قاعدة البيانات. لم يتم اعتماد التعديل.');
        case 5:
          return _context28.a(2);
        case 6:
          customerAccounts = nextAccounts;
          recordAudit('update', 'customerAccount', customerName, before, customerAccounts[customerName], "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u0627\u0641\u062A\u062A\u0627\u062D\u064A \u0644\u0644\u0639\u0645\u064A\u0644 ".concat(customerName));
          _context28.n = 7;
          return saveBackendSetting('auditLog', auditLog);
        case 7:
          _context28.n = 8;
          return loadBackendData();
        case 8:
          renderCustomerLedgerDialog(customerName);
        case 9:
          return _context28.a(2);
      }
    }, _callee28);
  }));
  return _saveCustomerOpeningBalance.apply(this, arguments);
}
function addCustomerPayment(_x20) {
  return _addCustomerPayment.apply(this, arguments);
}
function _addCustomerPayment() {
  _addCustomerPayment = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee29(customerName) {
    var _refs$documentBody$qu5, _refs$documentBody$qu6, _refs$documentBody$qu7, _refs$documentBody$qu8;
    var account, amount, payment, before, nextAccounts, nextAccount, saved;
    return _regenerator().w(function (_context29) {
      while (1) switch (_context29.n) {
        case 0:
          account = ensureCustomerAccount(customerName);
          if (account) {
            _context29.n = 1;
            break;
          }
          return _context29.a(2);
        case 1:
          amount = Number(((_refs$documentBody$qu5 = refs.documentBody.querySelector('[data-payment-amount]')) === null || _refs$documentBody$qu5 === void 0 ? void 0 : _refs$documentBody$qu5.value) || 0);
          if (amount) {
            _context29.n = 2;
            break;
          }
          alert('أدخل مبلغ الدفعة قبل الحفظ.');
          return _context29.a(2);
        case 2:
          _context29.n = 3;
          return ensureBackendForWrite('تعذر الاتصال بقاعدة البيانات. لم يتم حفظ الدفعة.');
        case 3:
          if (_context29.v) {
            _context29.n = 4;
            break;
          }
          return _context29.a(2);
        case 4:
          payment = {
            id: uid(),
            date: ((_refs$documentBody$qu6 = refs.documentBody.querySelector('[data-payment-date]')) === null || _refs$documentBody$qu6 === void 0 ? void 0 : _refs$documentBody$qu6.value) || new Date().toISOString().slice(0, 10),
            amount: amount,
            method: ((_refs$documentBody$qu7 = refs.documentBody.querySelector('[data-payment-method]')) === null || _refs$documentBody$qu7 === void 0 ? void 0 : _refs$documentBody$qu7.value) || '',
            notes: ((_refs$documentBody$qu8 = refs.documentBody.querySelector('[data-payment-notes]')) === null || _refs$documentBody$qu8 === void 0 ? void 0 : _refs$documentBody$qu8.value) || ''
          };
          before = clone(account);
          nextAccounts = clone(customerAccounts);
          nextAccount = _objectSpread({}, nextAccounts[customerName] || {
            openingBalance: 0,
            payments: []
          });
          nextAccount.payments = [payment].concat(_toConsumableArray(nextAccount.payments || []));
          nextAccounts[customerName] = nextAccount;
          _context29.n = 5;
          return saveBackendSetting('customerAccounts', nextAccounts);
        case 5:
          saved = _context29.v;
          if (saved) {
            _context29.n = 7;
            break;
          }
          _context29.n = 6;
          return rollbackAfterBackendWriteFailure('تعذر حفظ دفعة العميل في قاعدة البيانات. لم يتم اعتماد الدفعة.');
        case 6:
          return _context29.a(2);
        case 7:
          customerAccounts = nextAccounts;
          recordAudit('create', 'customerPayment', payment.id, before, nextAccount, "\u0625\u0636\u0627\u0641\u0629 \u062F\u0641\u0639\u0629 \u0644\u0644\u0639\u0645\u064A\u0644 ".concat(customerName));
          _context29.n = 8;
          return saveBackendSetting('auditLog', auditLog);
        case 8:
          _context29.n = 9;
          return loadBackendData();
        case 9:
          renderCustomerLedgerDialog(customerName);
        case 10:
          return _context29.a(2);
      }
    }, _callee29);
  }));
  return _addCustomerPayment.apply(this, arguments);
}
function deleteCustomerPayment(_x21, _x22) {
  return _deleteCustomerPayment.apply(this, arguments);
}
function _deleteCustomerPayment() {
  _deleteCustomerPayment = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee30(customerName, paymentId) {
    var account, before, nextAccounts, nextAccount, saved;
    return _regenerator().w(function (_context30) {
      while (1) switch (_context30.n) {
        case 0:
          account = ensureCustomerAccount(customerName);
          if (account) {
            _context30.n = 1;
            break;
          }
          return _context30.a(2);
        case 1:
          _context30.n = 2;
          return ensureBackendForWrite('تعذر الاتصال بقاعدة البيانات. لم يتم حذف الدفعة.');
        case 2:
          if (_context30.v) {
            _context30.n = 3;
            break;
          }
          return _context30.a(2);
        case 3:
          before = clone(account);
          nextAccounts = clone(customerAccounts);
          nextAccount = _objectSpread({}, nextAccounts[customerName] || {
            openingBalance: 0,
            payments: []
          });
          nextAccount.payments = (nextAccount.payments || []).filter(function (payment) {
            return payment.id !== paymentId;
          });
          nextAccounts[customerName] = nextAccount;
          _context30.n = 4;
          return saveBackendSetting('customerAccounts', nextAccounts);
        case 4:
          saved = _context30.v;
          if (saved) {
            _context30.n = 6;
            break;
          }
          _context30.n = 5;
          return rollbackAfterBackendWriteFailure('تعذر حذف دفعة العميل من قاعدة البيانات. لم يتم اعتماد الحذف.');
        case 5:
          return _context30.a(2);
        case 6:
          customerAccounts = nextAccounts;
          recordAudit('delete', 'customerPayment', paymentId, before, nextAccount, "\u062D\u0630\u0641 \u062F\u0641\u0639\u0629 \u0644\u0644\u0639\u0645\u064A\u0644 ".concat(customerName));
          _context30.n = 7;
          return saveBackendSetting('auditLog', auditLog);
        case 7:
          _context30.n = 8;
          return loadBackendData();
        case 8:
          renderCustomerLedgerDialog(customerName);
        case 9:
          return _context30.a(2);
      }
    }, _callee30);
  }));
  return _deleteCustomerPayment.apply(this, arguments);
}
function refreshOutboxTargetsAfterSettings() {
  var changed = false;
  reportOutbox.forEach(function (row) {
    var sourceOrder = orders.find(function (order) {
      return order.orderNumber === row.orderNumber;
    });
    var calculatedOrder = sourceOrder ? calculateOrder(sourceOrder) : null;
    var targets = targetGroupsForReport(row.reportType, calculatedOrder);
    var nextTarget = targets.includes(row.targetGroup) ? row.targetGroup : targets[0];
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
function openWhatsappSettingsDialog() {
  return _openWhatsappSettingsDialog.apply(this, arguments);
}
function _openWhatsappSettingsDialog() {
  _openWhatsappSettingsDialog = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee31() {
    var groupNames, _t15, _t16;
    return _regenerator().w(function (_context31) {
      while (1) switch (_context31.p = _context31.n) {
        case 0:
          renderWhatsappSettingsDialog([]);
          _context31.p = 1;
          _context31.n = 2;
          return Promise.race([pollWhatsappService(), wait(3000)]);
        case 2:
          _context31.n = 4;
          break;
        case 3:
          _context31.p = 3;
          _t15 = _context31.v;
        case 4:
          groupNames = [];
          _context31.p = 5;
          _context31.n = 6;
          return Promise.race([fetchWhatsappGroupNames(), wait(3000).then(function () {
            return [];
          })]);
        case 6:
          groupNames = _context31.v;
          _context31.n = 8;
          break;
        case 7:
          _context31.p = 7;
          _t16 = _context31.v;
          groupNames = [];
        case 8:
          renderWhatsappSettingsDialog(groupNames);
        case 9:
          return _context31.a(2);
      }
    }, _callee31, null, [[5, 7], [1, 3]]);
  }));
  return _openWhatsappSettingsDialog.apply(this, arguments);
}
function trackingCustomerSummary(customerName) {
  var wanted = normalizeForCompare(customerName);
  var relatedOrders = orders.map(calculateOrder).filter(function (order) {
    return normalizeForCompare(order.customer) === wanted;
  });
  var activeOrders = relatedOrders.filter(function (order) {
    return !order.operationClosed && !['delivered', 'cancelled'].includes(order.status);
  });
  var deliveredQuantity = roundNumber(relatedOrders.reduce(function (total, order) {
    return total + Number(order.totalDeliveredToCustomer || 0);
  }, 0));
  var pendingValue = roundNumber(activeOrders.reduce(function (total, order) {
    var quantity = Number(order.totalRawQuantity || order.totalRawOrdered || 0);
    return total + quantity * Number(order.kiloPrice || 0);
  }, 0));
  var lastOrder = relatedOrders.slice().sort(function (a, b) {
    return String(b.orderDate || '').localeCompare(String(a.orderDate || ''));
  })[0];
  return {
    ordersCount: relatedOrders.length,
    activeOrdersCount: activeOrders.length,
    deliveredQuantity: deliveredQuantity,
    pendingValue: pendingValue,
    lastOrderNumber: (lastOrder === null || lastOrder === void 0 ? void 0 : lastOrder.orderNumber) || ''
  };
}
function fetchA5Customers() {
  return _fetchA5Customers.apply(this, arguments);
}
function _fetchA5Customers() {
  _fetchA5Customers = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee32() {
    var response, data;
    return _regenerator().w(function (_context32) {
      while (1) switch (_context32.n) {
        case 0:
          _context32.n = 1;
          return fetch("".concat(A5_SERVICE_URL, "/api/a5/customers"), {
            cache: 'no-store'
          });
        case 1:
          response = _context32.v;
          if (response.ok) {
            _context32.n = 2;
            break;
          }
          throw new Error('a5-offline');
        case 2:
          _context32.n = 3;
          return response.json();
        case 3:
          data = _context32.v;
          if (!(!data.ok || !Array.isArray(data.customers))) {
            _context32.n = 4;
            break;
          }
          throw new Error(data.message || 'a5-invalid');
        case 4:
          return _context32.a(2, data.customers);
      }
    }, _callee32);
  }));
  return _fetchA5Customers.apply(this, arguments);
}
function fetchA5CustomerLedger(_x23) {
  return _fetchA5CustomerLedger.apply(this, arguments);
}
function _fetchA5CustomerLedger() {
  _fetchA5CustomerLedger = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee33(customerName) {
    var response, data;
    return _regenerator().w(function (_context33) {
      while (1) switch (_context33.n) {
        case 0:
          _context33.n = 1;
          return fetch("".concat(A5_SERVICE_URL, "/api/a5/customer-ledger?customerName=").concat(encodeURIComponent(customerName)), {
            cache: 'no-store'
          });
        case 1:
          response = _context33.v;
          if (response.ok) {
            _context33.n = 2;
            break;
          }
          throw new Error('a5-offline');
        case 2:
          _context33.n = 3;
          return response.json();
        case 3:
          data = _context33.v;
          if (!(!data.ok || !Array.isArray(data.movements))) {
            _context33.n = 4;
            break;
          }
          throw new Error(data.message || 'a5-invalid');
        case 4:
          return _context33.a(2, data.movements);
      }
    }, _callee33);
  }));
  return _fetchA5CustomerLedger.apply(this, arguments);
}
function formatA5Date(value) {
  if (!value) return '-';
  var match = String(value).match(/\/Date\((\d+)\)\//);
  var date = match ? new Date(Number(match[1])) : new Date(value);
  return isNaN(date.getTime()) ? String(value) : date.toLocaleDateString('en-US');
}
function renderA5AccountsDialog() {
  return _renderA5AccountsDialog.apply(this, arguments);
}
function _renderA5AccountsDialog() {
  _renderA5AccountsDialog = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee34() {
    var a5Customers, systemCustomers, matchedRows, unmatchedA5, unmatchedNote, _t17;
    return _regenerator().w(function (_context34) {
      while (1) switch (_context34.p = _context34.n) {
        case 0:
          refs.documentTitle.textContent = "\u062D\u0633\u0627\u0628\u0627\u062A A5";
          refs.documentBody.dataset.documentType = 'a5-accounts';
          refs.documentBody.innerHTML = "<div class=\"document-sheet\"><div class=\"subsection-head\"><div><h2>\u062D\u0633\u0627\u0628\u0627\u062A A5</h2><p class=\"muted\">\u0631\u0628\u0637 \u0639\u0645\u0644\u0627\u0621 \u0627\u0644\u0646\u0638\u0627\u0645 \u0628\u0643\u0634\u0648\u0641\u0627\u062A \u062D\u0633\u0627\u0628\u0627\u062A\u0647\u0645 \u0641\u064A A5.</p></div></div><p class=\"muted\">\u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A A5...</p></div>";
          if (refs.documentDialog.open) refs.documentDialog.close();
          refs.documentDialog.showModal();
          _context34.p = 1;
          _context34.n = 2;
          return fetchA5Customers();
        case 2:
          a5Customers = _context34.v;
          systemCustomers = knownCustomerNames();
          matchedRows = systemCustomers.map(function (systemName) {
            var a5Customer = findA5CustomerForSystemName(systemName, a5Customers);
            var tracking = trackingCustomerSummary(systemName);
            var balance = Number((a5Customer === null || a5Customer === void 0 ? void 0 : a5Customer.balance) || 0);
            var balanceClass = balance > 0 ? 'danger-text' : balance < 0 ? 'success-text' : '';
            var a5Name = a5CustomerDisplayName(a5Customer);
            var action = a5Customer ? '<button class="mini-btn" type="button" data-a5-ledger="' + escapeHtml(a5Name) + "\">\u0639\u0631\u0636 \u0643\u0634\u0641 \u0627\u0644\u062D\u0633\u0627\u0628</button>" : "<span class=\"status pending\">\u063A\u064A\u0631 \u0645\u0637\u0627\u0628\u0642 \u0641\u064A A5</span>";
            return '<tr>' + '<td><strong>' + escapeHtml(systemName || '-') + '</strong></td>' + '<td>' + escapeHtml(a5Name || '-') + '</td>' + '<td>' + escapeHtml((a5Customer === null || a5Customer === void 0 ? void 0 : a5Customer.areaName) || '-') + '</td>' + '<td class="' + balanceClass + '"><strong>' + formatNumber(balance) + '</strong></td>' + '<td>' + formatNumber((a5Customer === null || a5Customer === void 0 ? void 0 : a5Customer.totalDebit) || 0) + '</td>' + '<td>' + formatNumber((a5Customer === null || a5Customer === void 0 ? void 0 : a5Customer.totalCredit) || 0) + '</td>' + '<td>' + ((a5Customer === null || a5Customer === void 0 ? void 0 : a5Customer.movementCount) || 0) + '</td>' + '<td>' + tracking.ordersCount + '</td>' + '<td>' + tracking.activeOrdersCount + '</td>' + '<td>' + formatNumber(tracking.deliveredQuantity) + '</td>' + '<td>' + (tracking.lastOrderNumber || '-') + '</td>' + '<td>' + action + '</td>' + '</tr>';
          }).join('');
          unmatchedA5 = a5Customers.filter(function (customer) {
            return !systemCustomers.some(function (name) {
              return findA5CustomerForSystemName(name, [customer]);
            });
          });
          unmatchedNote = unmatchedA5.length ? "<p class=\"eyebrow\">\u064A\u0648\u062C\u062F " + unmatchedA5.length + " \u0639\u0645\u064A\u0644 \u0641\u064A A5 \u0644\u064A\u0633 \u0644\u0647\u0645 \u0637\u0644\u0628\u0627\u062A \u062D\u0627\u0644\u064A\u0629 \u0641\u064A \u0627\u0644\u0646\u0638\u0627\u0645.</p>" : '';
          refs.documentBody.innerHTML = '<div class="document-sheet">' + "<div class=\"subsection-head\"><div><h2>\u0643\u0634\u0648\u0641\u0627\u062A \u062D\u0633\u0627\u0628\u0627\u062A A5</h2><p class=\"muted\">\u0627\u0644\u0639\u0631\u0636 \u0645\u0628\u0646\u064A \u0639\u0644\u0649 \u0639\u0645\u0644\u0627\u0621 \u0627\u0644\u0646\u0638\u0627\u0645\u060C \u0648\u064A\u0633\u062D\u0628 \u0627\u0644\u0631\u0635\u064A\u062F \u0648\u0627\u0644\u0643\u0634\u0641 \u0645\u0646 A5 \u0644\u0644\u0642\u0631\u0627\u0621\u0629 \u0641\u0642\u0637.</p></div><button class=\"mini-btn no-print\" type=\"button\" data-refresh-a5-accounts>\u062A\u062D\u062F\u064A\u062B</button></div>" + unmatchedNote + "<table><thead><tr><th>\u0639\u0645\u064A\u0644 \u0627\u0644\u0646\u0638\u0627\u0645</th><th>\u0627\u0633\u0645\u0647 \u0641\u064A A5</th><th>\u0627\u0644\u0645\u0646\u0637\u0642\u0629</th><th>\u0631\u0635\u064A\u062F A5</th><th>\u0625\u062C\u0645\u0627\u0644\u064A \u0645\u062F\u064A\u0646</th><th>\u0625\u062C\u0645\u0627\u0644\u064A \u062F\u0627\u0626\u0646</th><th>\u0639\u062F\u062F \u0627\u0644\u062D\u0631\u0643\u0627\u062A</th><th>\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0646\u0638\u0627\u0645</th><th>\u062A\u062D\u062A \u0627\u0644\u062A\u0634\u063A\u064A\u0644</th><th>\u0643\u0645\u064A\u0629 \u0645\u0633\u0644\u0645\u0629</th><th>\u0622\u062E\u0631 \u0637\u0644\u0628</th><th>\u0627\u0644\u0643\u0634\u0641</th></tr></thead><tbody>" + (matchedRows || "<tr><td colspan=\"12\">\u0644\u0627 \u064A\u0648\u062C\u062F \u0639\u0645\u0644\u0627\u0621 \u0645\u0633\u062C\u0644\u0648\u0646 \u0641\u064A \u0627\u0644\u0646\u0638\u0627\u0645.</td></tr>") + '</tbody></table></div>';
          _context34.n = 4;
          break;
        case 3:
          _context34.p = 3;
          _t17 = _context34.v;
          refs.documentBody.innerHTML = "<div class=\"document-sheet\"><h2>\u062D\u0633\u0627\u0628\u0627\u062A A5</h2><div class=\"notice warning\">\u062E\u062F\u0645\u0629 A5 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D\u0629 \u062D\u0627\u0644\u064A\u0627. \u0634\u063A\u0644 \u0645\u0644\u0641 \"\u062A\u0634\u063A\u064A\u0644 \u062E\u062F\u0645\u0629 A5.bat\" \u062B\u0645 \u062D\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649.</div><div class=\"document-actions no-print\"><button class=\"primary-btn\" type=\"button\" data-refresh-a5-accounts>\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629</button></div></div>";
        case 4:
          return _context34.a(2);
      }
    }, _callee34, null, [[1, 3]]);
  }));
  return _renderA5AccountsDialog.apply(this, arguments);
}
function renderA5LedgerDialog(_x24) {
  return _renderA5LedgerDialog.apply(this, arguments);
}
function _renderA5LedgerDialog() {
  _renderA5LedgerDialog = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee35(customerName) {
    var name, movements, tracking, totals, currentBalance, rows, _t18;
    return _regenerator().w(function (_context35) {
      while (1) switch (_context35.p = _context35.n) {
        case 0:
          name = String(customerName || '').trim();
          refs.documentTitle.textContent = "\u0643\u0634\u0641 \u062D\u0633\u0627\u0628 A5 - ".concat(name);
          refs.documentBody.dataset.documentType = 'a5-ledger';
          refs.documentBody.innerHTML = "<div class=\"document-sheet\">\n    <div class=\"subsection-head\"><div><h2>\u0643\u0634\u0641 \u062D\u0633\u0627\u0628 A5</h2><p class=\"muted\">".concat(escapeHtml(name), " - \u0628\u064A\u0627\u0646\u0627\u062A \u0642\u0631\u0627\u0621\u0629 \u0641\u0642\u0637 \u0645\u0646 A5.</p></div><button class=\"mini-btn no-print\" type=\"button\" data-back-a5-accounts>\u0631\u062C\u0648\u0639</button></div>\n    <p class=\"muted\">\u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u062D\u0631\u0643\u0627\u062A \u0627\u0644\u062D\u0633\u0627\u0628...</p>\n  </div>");
          _context35.p = 1;
          _context35.n = 2;
          return fetchA5CustomerLedger(name);
        case 2:
          movements = _context35.v;
          tracking = trackingCustomerSummary(name);
          totals = movements.reduce(function (acc, item) {
            acc.debit += Number(item.debit || 0);
            acc.credit += Number(item.credit || 0);
            return acc;
          }, {
            debit: 0,
            credit: 0
          });
          currentBalance = movements.length ? Number(movements[0].afterBalance || 0) : 0;
          rows = movements.map(function (item) {
            return "<tr>\n      <td>".concat(formatA5Date(item.movementDate), "</td>\n      <td>").concat(escapeHtml(item.movementType || '-'), "</td>\n      <td>").concat(escapeHtml(item.description || '-'), "</td>\n      <td>").concat(formatNumber(item.beforeBalance || 0), "</td>\n      <td>").concat(formatNumber(item.debit || 0), "</td>\n      <td>").concat(formatNumber(item.credit || 0), "</td>\n      <td><strong>").concat(formatNumber(item.afterBalance || 0), "</strong></td>\n      <td>").concat(item.orderRef || item.orderBookRef || '-', "</td>\n    </tr>");
          }).join('');
          refs.documentBody.innerHTML = "<div class=\"document-sheet\">\n      <div class=\"subsection-head\"><div><h2>\u0643\u0634\u0641 \u062D\u0633\u0627\u0628 A5 - ".concat(escapeHtml(name), "</h2><p class=\"muted\">\u062D\u0631\u0643\u0627\u062A \u0627\u0644\u0639\u0645\u064A\u0644 \u0641\u064A A5 \u0645\u0639 \u0645\u0644\u062E\u0635 \u0637\u0644\u0628\u0627\u062A\u0647 \u062F\u0627\u062E\u0644 \u0646\u0638\u0627\u0645 \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629.</p></div><button class=\"mini-btn no-print\" type=\"button\" data-back-a5-accounts>\u0631\u062C\u0648\u0639</button></div>\n      <div class=\"summary-grid\">\n        <div class=\"metric\"><span>\u0631\u0635\u064A\u062F \u0627\u0644\u0639\u0645\u064A\u0644</span><strong>").concat(formatNumber(currentBalance), "</strong></div>\n        <div class=\"metric\"><span>\u0625\u062C\u0645\u0627\u0644\u064A \u0645\u062F\u064A\u0646</span><strong>").concat(formatNumber(totals.debit), "</strong></div>\n        <div class=\"metric\"><span>\u0625\u062C\u0645\u0627\u0644\u064A \u062F\u0627\u0626\u0646</span><strong>").concat(formatNumber(totals.credit), "</strong></div>\n        <div class=\"metric\"><span>\u0639\u062F\u062F \u0627\u0644\u062D\u0631\u0643\u0627\u062A</span><strong>").concat(movements.length, "</strong></div>\n        <div class=\"metric\"><span>\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629</span><strong>").concat(tracking.ordersCount, "</strong></div>\n        <div class=\"metric\"><span>\u062A\u062D\u062A \u0627\u0644\u062A\u0634\u063A\u064A\u0644</span><strong>").concat(tracking.activeOrdersCount, "</strong></div>\n      </div>\n      <table><thead><tr><th>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</th><th>\u0646\u0648\u0639 \u0627\u0644\u062D\u0631\u0643\u0629</th><th>\u0627\u0644\u0628\u064A\u0627\u0646</th><th>\u0631\u0635\u064A\u062F \u0642\u0628\u0644</th><th>\u0645\u062F\u064A\u0646</th><th>\u062F\u0627\u0626\u0646</th><th>\u0631\u0635\u064A\u062F \u0628\u0639\u062F</th><th>\u0645\u0631\u062C\u0639 \u0627\u0644\u0637\u0644\u0628</th></tr></thead><tbody>").concat(rows || '<tr><td colspan="8">لا توجد حركات متاحة لهذا العميل في A5.</td></tr>', "</tbody></table>\n    </div>");
          _context35.n = 4;
          break;
        case 3:
          _context35.p = 3;
          _t18 = _context35.v;
          refs.documentBody.innerHTML = "<div class=\"document-sheet\">\n      <div class=\"subsection-head\"><h2>\u0643\u0634\u0641 \u062D\u0633\u0627\u0628 A5</h2><button class=\"mini-btn no-print\" type=\"button\" data-back-a5-accounts>\u0631\u062C\u0648\u0639</button></div>\n      <div class=\"notice warning\">\u062A\u0639\u0630\u0631 \u062A\u062D\u0645\u064A\u0644 \u0643\u0634\u0641 \u0627\u0644\u062D\u0633\u0627\u0628 \u0645\u0646 A5. \u062A\u0623\u0643\u062F \u0623\u0646 \u062E\u062F\u0645\u0629 A5 \u062A\u0639\u0645\u0644 \u062B\u0645 \u062D\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649.</div>\n    </div>";
        case 4:
          return _context35.a(2);
      }
    }, _callee35, null, [[1, 3]]);
  }));
  return _renderA5LedgerDialog.apply(this, arguments);
}
function auditActionLabel(action) {
  return {
    create: 'إضافة',
    update: 'تعديل',
    "delete": 'حذف',
    retry: 'إعادة محاولة',
    error: 'خطأ'
  }[action] || action || 'حركة';
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
    users: 'مستخدم'
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
    note: row.note || ''
  };
}
function cleanAuditNote(item) {
  var _String$match;
  var text = String((item === null || item === void 0 ? void 0 : item.note) || '').trim();
  if (text && !isLegacyRecoveredText(text)) return text;
  var number = ((_String$match = String(text || (item === null || item === void 0 ? void 0 : item.entityId) || '').match(/\d+/)) === null || _String$match === void 0 ? void 0 : _String$match[0]) || String((item === null || item === void 0 ? void 0 : item.entityId) || '').trim();
  var entity = auditEntityLabel(item === null || item === void 0 ? void 0 : item.entityType);
  var action = auditActionLabel(item === null || item === void 0 ? void 0 : item.action);
  return "".concat(action, " ").concat(entity).concat(number ? " \u0631\u0642\u0645 ".concat(number) : '');
}
function fetchAuditLogRows() {
  return _fetchAuditLogRows.apply(this, arguments);
}
function _fetchAuditLogRows() {
  _fetchAuditLogRows = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee36() {
    var rows;
    return _regenerator().w(function (_context36) {
      while (1) switch (_context36.n) {
        case 0:
          _context36.n = 1;
          return backendRequest('/audit-log?limit=500', {
            cache: 'no-store'
          });
        case 1:
          rows = _context36.v;
          return _context36.a(2, Array.isArray(rows) ? rows.map(normalizeAuditItem).filter(Boolean) : []);
      }
    }, _callee36);
  }));
  return _fetchAuditLogRows.apply(this, arguments);
}
function renderAuditLogRows(rows) {
  return rows.map(function (item) {
    return "<tr>\n    <td>".concat(escapeHtml(arDateTime(item.createdAt)), "</td>\n    <td>").concat(escapeHtml(auditActionLabel(item.action)), "</td>\n    <td>").concat(escapeHtml(auditEntityLabel(item.entityType)), "</td>\n    <td>").concat(escapeHtml(item.entityId || '-'), "</td>\n    <td>").concat(escapeHtml(cleanAuditNote(item)), "</td>\n  </tr>");
  }).join('') || '<tr><td colspan="5">لا توجد حركات مسجلة حتى الآن.</td></tr>';
}
function openAuditLogDialog() {
  return _openAuditLogDialog.apply(this, arguments);
}
function _openAuditLogDialog() {
  _openAuditLogDialog = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee37() {
    var rows, _t19;
    return _regenerator().w(function (_context37) {
      while (1) switch (_context37.p = _context37.n) {
        case 0:
          refs.documentTitle.textContent = 'سجل التعديلات';
          refs.documentBody.dataset.documentType = 'audit-log';
          refs.documentBody.innerHTML = '<div class="document-sheet orders-follow-report"><div class="report-title"><h2>سجل التعديلات</h2><span>جاري تحميل الحركات من قاعدة البيانات...</span></div></div>';
          if (refs.documentDialog.open) refs.documentDialog.close();
          refs.documentDialog.showModal();
          _context37.p = 1;
          _context37.n = 2;
          return fetchAuditLogRows();
        case 2:
          rows = _context37.v;
          refs.documentBody.innerHTML = "<div class=\"document-sheet orders-follow-report\"><div class=\"report-title\"><h2>\u0633\u062C\u0644 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A</h2><span>\u0622\u062E\u0631 \u0627\u0644\u0639\u0645\u0644\u064A\u0627\u062A \u0627\u0644\u0645\u0633\u062C\u0644\u0629 \u0645\u0646 \u0642\u0627\u0639\u062F\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062A\u0634\u063A\u064A\u0644 \u0645\u0628\u0627\u0634\u0631\u0629.</span></div><section class=\"report-section\"><h3>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0633\u062C\u0644</h3><table class=\"follow-table\"><thead><tr><th>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</th><th>\u0627\u0644\u062D\u0631\u0643\u0629</th><th>\u0646\u0648\u0639 \u0627\u0644\u0628\u064A\u0627\u0646</th><th>\u0627\u0644\u0645\u0631\u062C\u0639</th><th>\u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644</th></tr></thead><tbody>".concat(renderAuditLogRows(rows), "</tbody></table></section></div>");
          _context37.n = 4;
          break;
        case 3:
          _context37.p = 3;
          _t19 = _context37.v;
          refs.documentBody.innerHTML = '<div class="document-sheet orders-follow-report"><div class="report-title"><h2>سجل التعديلات</h2><span>تعذر تحميل سجل التعديلات من قاعدة البيانات.</span></div><div class="notice warning">السجل لا يعرض بيانات قديمة من المتصفح. أعد المحاولة بعد التأكد من اتصال قاعدة البيانات.</div></div>';
        case 4:
          return _context37.a(2);
      }
    }, _callee37, null, [[1, 3]]);
  }));
  return _openAuditLogDialog.apply(this, arguments);
}
function fetchSystemUsers() {
  return _fetchSystemUsers.apply(this, arguments);
}
function _fetchSystemUsers() {
  _fetchSystemUsers = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee38() {
    return _regenerator().w(function (_context38) {
      while (1) switch (_context38.n) {
        case 0:
          _context38.n = 1;
          return backendRequest('/users', {
            cache: 'no-store'
          });
        case 1:
          return _context38.a(2, _context38.v);
      }
    }, _callee38);
  }));
  return _fetchSystemUsers.apply(this, arguments);
}
function systemUserRoleLabel(role) {
  return {
    admin: 'مدير',
    manager: 'مسؤول تشغيل',
    user: 'مستخدم'
  }[role] || role || 'مستخدم';
}
function openUsersDialog() {
  return _openUsersDialog.apply(this, arguments);
}
function _openUsersDialog() {
  _openUsersDialog = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee39() {
    var users, rows, _t20;
    return _regenerator().w(function (_context39) {
      while (1) switch (_context39.p = _context39.n) {
        case 0:
          refs.documentTitle.textContent = 'المستخدمين';
          refs.documentBody.dataset.documentType = 'system-users';
          refs.documentBody.innerHTML = '<div class="document-sheet"><h2>المستخدمين</h2><p class="muted">جاري تحميل المستخدمين...</p></div>';
          if (refs.documentDialog.open) refs.documentDialog.close();
          refs.documentDialog.showModal();
          _context39.p = 1;
          _context39.n = 2;
          return fetchSystemUsers();
        case 2:
          users = _context39.v;
          rows = users.map(function (user) {
            return "<tr>\n      <td><strong>".concat(escapeHtml(user.name || '-'), "</strong></td>\n      <td>").concat(escapeHtml(user.username || '-'), "</td>\n      <td>").concat(escapeHtml(systemUserRoleLabel(user.role)), "</td>\n      <td><span class=\"status ").concat(Number(user.is_active) === 1 ? 'completed' : 'failed', "\">").concat(Number(user.is_active) === 1 ? 'نشط' : 'موقوف', "</span></td>\n      <td>").concat(escapeHtml(arDateTime(user.updated_at || user.created_at)), "</td>\n      <td><div class=\"batch-actions\"><button class=\"mini-btn\" type=\"button\" data-edit-system-user=\"").concat(escapeHtml(user.id), "\">\u062A\u0639\u062F\u064A\u0644</button><button class=\"mini-btn danger\" type=\"button\" data-delete-system-user=\"").concat(escapeHtml(user.id), "\">\u062D\u0630\u0641</button></div></td>\n    </tr>");
          }).join('');
          refs.documentBody.innerHTML = "<div class=\"document-sheet\">\n      <div class=\"subsection-head\"><div><h2>\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646</h2><p class=\"muted\">\u0625\u062F\u0627\u0631\u0629 \u0645\u0633\u062A\u062E\u062F\u0645\u064A \u0627\u0644\u0646\u0638\u0627\u0645. \u0627\u0644\u062F\u062E\u0648\u0644 \u0627\u0644\u062D\u0627\u0644\u064A \u064A\u0638\u0644 \u0645\u0624\u0645\u0646\u064B\u0627 \u0628\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0633\u064A\u0631\u0641\u0631 \u062D\u062A\u0649 \u0646\u0642\u0644 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0644\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646.</p></div><button class=\"mini-btn gold\" type=\"button\" data-new-system-user>\u0625\u0636\u0627\u0641\u0629 \u0645\u0633\u062A\u062E\u062F\u0645</button></div>\n      <table><thead><tr><th>\u0627\u0644\u0627\u0633\u0645</th><th>\u0627\u0633\u0645 \u0627\u0644\u062F\u062E\u0648\u0644</th><th>\u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629</th><th>\u0627\u0644\u062D\u0627\u0644\u0629</th><th>\u0622\u062E\u0631 \u062A\u0639\u062F\u064A\u0644</th><th>\u0625\u062C\u0631\u0627\u0621\u0627\u062A</th></tr></thead><tbody>".concat(rows || '<tr><td colspan="6">لا يوجد مستخدمين حتى الآن.</td></tr>', "</tbody></table>\n    </div>");
          refs.documentBody.dataset.usersJson = JSON.stringify(users);
          _context39.n = 4;
          break;
        case 3:
          _context39.p = 3;
          _t20 = _context39.v;
          refs.documentBody.innerHTML = '<div class="document-sheet"><h2>المستخدمين</h2><div class="notice warning">تعذر تحميل المستخدمين حاليًا.</div></div>';
        case 4:
          return _context39.a(2);
      }
    }, _callee39, null, [[1, 3]]);
  }));
  return _openUsersDialog.apply(this, arguments);
}
function openSystemUserForm() {
  var _user$is_active;
  var user = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  refs.documentTitle.textContent = user ? 'تعديل مستخدم' : 'إضافة مستخدم';
  refs.documentBody.dataset.documentType = 'system-user-form';
  refs.documentBody.innerHTML = "<div class=\"document-sheet\">\n    <div class=\"subsection-head\"><h2>".concat(user ? 'تعديل مستخدم' : 'إضافة مستخدم', "</h2><button class=\"mini-btn\" type=\"button\" data-back-system-users>\u0631\u062C\u0648\u0639</button></div>\n    <div class=\"summary-grid\">\n      <label><span>\u0627\u0644\u0627\u0633\u0645</span><input data-user-name value=\"").concat(escapeHtml((user === null || user === void 0 ? void 0 : user.name) || ''), "\"></label>\n      <label><span>\u0627\u0633\u0645 \u0627\u0644\u062F\u062E\u0648\u0644</span><input data-user-username value=\"").concat(escapeHtml((user === null || user === void 0 ? void 0 : user.username) || ''), "\" required></label>\n      <label><span>\u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629</span><select data-user-role><option value=\"admin\">\u0645\u062F\u064A\u0631</option><option value=\"manager\">\u0645\u0633\u0624\u0648\u0644 \u062A\u0634\u063A\u064A\u0644</option><option value=\"user\">\u0645\u0633\u062A\u062E\u062F\u0645</option></select></label>\n      <label><span>\u0627\u0644\u062D\u0627\u0644\u0629</span><select data-user-active><option value=\"1\">\u0646\u0634\u0637</option><option value=\"0\">\u0645\u0648\u0642\u0648\u0641</option></select></label>\n      <label class=\"full-row\"><span>").concat(user ? 'كلمة مرور جديدة - اختياري' : 'كلمة المرور', "</span><input data-user-password type=\"password\" autocomplete=\"new-password\"></label>\n    </div>\n    <div class=\"dialog-actions\"><button class=\"primary-btn\" type=\"button\" data-save-system-user=\"").concat(escapeHtml((user === null || user === void 0 ? void 0 : user.id) || ''), "\">\u062D\u0641\u0638 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645</button></div>\n  </div>");
  refs.documentBody.querySelector('[data-user-role]').value = (user === null || user === void 0 ? void 0 : user.role) || 'user';
  refs.documentBody.querySelector('[data-user-active]').value = String(Number((_user$is_active = user === null || user === void 0 ? void 0 : user.is_active) !== null && _user$is_active !== void 0 ? _user$is_active : 1));
}
function systemUserFormPayload(isNew) {
  var _body$querySelector, _body$querySelector2, _body$querySelector3, _body$querySelector4, _body$querySelector5;
  var body = refs.documentBody;
  var payload = {
    name: ((_body$querySelector = body.querySelector('[data-user-name]')) === null || _body$querySelector === void 0 ? void 0 : _body$querySelector.value) || '',
    username: ((_body$querySelector2 = body.querySelector('[data-user-username]')) === null || _body$querySelector2 === void 0 ? void 0 : _body$querySelector2.value) || '',
    role: ((_body$querySelector3 = body.querySelector('[data-user-role]')) === null || _body$querySelector3 === void 0 ? void 0 : _body$querySelector3.value) || 'user',
    is_active: Number(((_body$querySelector4 = body.querySelector('[data-user-active]')) === null || _body$querySelector4 === void 0 ? void 0 : _body$querySelector4.value) || 1)
  };
  var password = ((_body$querySelector5 = body.querySelector('[data-user-password]')) === null || _body$querySelector5 === void 0 ? void 0 : _body$querySelector5.value) || '';
  if (password || isNew) payload.password = password;
  return payload;
}
function saveSystemUser() {
  return _saveSystemUser.apply(this, arguments);
}
function _saveSystemUser() {
  _saveSystemUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee40() {
    var userId,
      isNew,
      payload,
      _args38 = arguments;
    return _regenerator().w(function (_context40) {
      while (1) switch (_context40.n) {
        case 0:
          userId = _args38.length > 0 && _args38[0] !== undefined ? _args38[0] : '';
          isNew = !userId;
          payload = systemUserFormPayload(isNew);
          if (!(!payload.username || isNew && !payload.password)) {
            _context40.n = 1;
            break;
          }
          alert('اسم الدخول وكلمة المرور مطلوبين.');
          return _context40.a(2);
        case 1:
          if (!isNew) {
            _context40.n = 3;
            break;
          }
          _context40.n = 2;
          return backendRequest('/users', {
            method: 'POST',
            body: JSON.stringify(payload)
          });
        case 2:
          _context40.n = 4;
          break;
        case 3:
          _context40.n = 4;
          return backendRequest("/users/".concat(userId), {
            method: 'PUT',
            body: JSON.stringify(payload)
          });
        case 4:
          _context40.n = 5;
          return openUsersDialog();
        case 5:
          return _context40.a(2);
      }
    }, _callee40);
  }));
  return _saveSystemUser.apply(this, arguments);
}
function deleteSystemUser(_x25) {
  return _deleteSystemUser.apply(this, arguments);
}
function _deleteSystemUser() {
  _deleteSystemUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee41(userId) {
    return _regenerator().w(function (_context41) {
      while (1) switch (_context41.n) {
        case 0:
          if (!(!userId || !confirm('حذف المستخدم؟'))) {
            _context41.n = 1;
            break;
          }
          return _context41.a(2);
        case 1:
          _context41.n = 2;
          return backendRequest("/users/".concat(userId), {
            method: 'DELETE'
          });
        case 2:
          _context41.n = 3;
          return openUsersDialog();
        case 3:
          return _context41.a(2);
      }
    }, _callee41);
  }));
  return _deleteSystemUser.apply(this, arguments);
}
function openOutboxDialog() {
  ensureRuntimeCollections();
  var brokenText = isLegacyRecoveredText;
  var cellText = function cellText(value) {
    var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '-';
    var text = String(value !== null && value !== void 0 ? value : '').trim();
    return escapeHtml(!text || brokenText(text) ? fallback : text);
  };
  var rows = reportOutbox.map(function (item) {
    var reportName = reportTypeLabels[item.reportType] || item.reportType || 'تقرير';
    var status = "".concat(reportTypeIcons[item.status] || '', " ").concat(reportStatusText[item.status] || item.status || '-').trim();
    var errorText = brokenText(item.errorMessage) ? 'رسالة قديمة غير قابلة للعرض' : item.errorMessage || '-';
    var action = item.status === 'failed' ? "<button class=\"mini-btn\" data-retry-outbox=\"".concat(item.id, "\">\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629</button>") : '';
    return "<tr><td>".concat(cellText(reportName, 'تقرير'), "</td><td>").concat(cellText(item.orderNumber, '-'), "</td><td>").concat(cellText(item.targetGroup, 'غير محدد'), "</td><td>").concat(escapeHtml(status), "</td><td>").concat(cellText(errorText, '-'), "</td><td>").concat(action, "</td></tr>");
  }).join('') || '<tr><td colspan="6">لا توجد تقارير في قائمة الإرسال.</td></tr>';
  refs.documentTitle.textContent = 'قائمة إرسال واتساب';
  refs.documentBody.dataset.documentType = 'outbox';
  refs.documentBody.innerHTML = "<div class=\"document-sheet\"><h2>\u0642\u0627\u0626\u0645\u0629 \u0625\u0631\u0633\u0627\u0644 \u0648\u0627\u062A\u0633\u0627\u0628</h2><p class=\"muted\">\u062D\u0627\u0644\u0629 \u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u0644\u062A\u064A \u062A\u0646\u062A\u0638\u0631 \u0627\u0644\u0625\u0631\u0633\u0627\u0644 \u0623\u0648 \u062A\u0645 \u0625\u0631\u0633\u0627\u0644\u0647\u0627 \u0645\u0646 \u062E\u062F\u0645\u0629 \u0648\u0627\u062A\u0633\u0627\u0628.</p><table><thead><tr><th>\u0627\u0644\u062A\u0642\u0631\u064A\u0631</th><th>\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628</th><th>\u0627\u0644\u062C\u0631\u0648\u0628</th><th>\u0627\u0644\u062D\u0627\u0644\u0629</th><th>\u0645\u0644\u0627\u062D\u0638\u0627\u062A</th><th>\u0625\u062C\u0631\u0627\u0621</th></tr></thead><tbody>".concat(rows, "</tbody></table></div>");
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
function openSystemStatusDialog() {
  return _openSystemStatusDialog.apply(this, arguments);
}
function _openSystemStatusDialog() {
  _openSystemStatusDialog = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee42() {
    var _status$cloudflare, _status$frontend, _status$frontend2, _status$backend, _status$backend2, _status$cloudflare2, _status$backup, _status$backup2, status, cloudflareUrl, row, _t21;
    return _regenerator().w(function (_context42) {
      while (1) switch (_context42.p = _context42.n) {
        case 0:
          refs.documentTitle.textContent = 'حالة تشغيل النظام';
          refs.documentBody.dataset.documentType = 'system-status';
          refs.documentBody.innerHTML = '<div class="document-sheet"><h2>حالة تشغيل النظام</h2><p>جاري فحص الخدمات...</p></div>';
          refs.documentDialog.showModal();
          _context42.p = 1;
          _context42.n = 2;
          return fetch('/system/status', {
            cache: 'no-store'
          }).then(function (response) {
            return response.json();
          });
        case 2:
          status = _context42.v;
          cloudflareUrl = ((_status$cloudflare = status.cloudflare) === null || _status$cloudflare === void 0 ? void 0 : _status$cloudflare.url) || 'لا يوجد رابط مسجل حاليًا';
          row = function row(label, value, ok) {
            return "<tr><td>".concat(label, "</td><td><span class=\"status ").concat(ok ? 'completed' : 'failed', "\">").concat(ok ? 'يعمل' : 'متوقف', "</span></td><td>").concat(escapeHtml(value || '-'), "</td></tr>");
          };
          refs.documentBody.innerHTML = "<div class=\"document-sheet\">\n      <h2>\u062D\u0627\u0644\u0629 \u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u0646\u0638\u0627\u0645</h2>\n      <table>\n        <thead><tr><th>\u0627\u0644\u0628\u0646\u062F</th><th>\u0627\u0644\u062D\u0627\u0644\u0629</th><th>\u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644</th></tr></thead>\n        <tbody>\n          ".concat(row('Frontend', "Port ".concat(((_status$frontend = status.frontend) === null || _status$frontend === void 0 ? void 0 : _status$frontend.port) || 3000), (_status$frontend2 = status.frontend) === null || _status$frontend2 === void 0 ? void 0 : _status$frontend2.ok), "\n          ").concat(row('Backend', "Port ".concat(((_status$backend = status.backend) === null || _status$backend === void 0 ? void 0 : _status$backend.port) || 3050), (_status$backend2 = status.backend) === null || _status$backend2 === void 0 ? void 0 : _status$backend2.ok), "\n          ").concat(row('Cloudflare', cloudflareUrl, (_status$cloudflare2 = status.cloudflare) === null || _status$cloudflare2 === void 0 ? void 0 : _status$cloudflare2.ok), "\n          ").concat(row('Backup', ((_status$backup = status.backup) === null || _status$backup === void 0 || (_status$backup = _status$backup.latest) === null || _status$backup === void 0 ? void 0 : _status$backup.path) || 'لا يوجد Backup معروف', (_status$backup2 = status.backup) === null || _status$backup2 === void 0 ? void 0 : _status$backup2.ok), "\n        </tbody>\n      </table>\n      <p><strong>\u0631\u0627\u0628\u0637 Cloudflare \u0627\u0644\u062D\u0627\u0644\u064A:</strong> ").concat(cloudflareUrl.startsWith('https://') ? "<a href=\"".concat(escapeHtml(cloudflareUrl), "\" target=\"_blank\" rel=\"noopener\">").concat(escapeHtml(cloudflareUrl), "</a>") : escapeHtml(cloudflareUrl), "</p>\n    </div>");
          _context42.n = 4;
          break;
        case 3:
          _context42.p = 3;
          _t21 = _context42.v;
          refs.documentBody.innerHTML = '<div class="document-sheet"><h2>حالة تشغيل النظام</h2><p>تعذر قراءة حالة النظام حاليًا.</p></div>';
        case 4:
          return _context42.a(2);
      }
    }, _callee42, null, [[1, 3]]);
  }));
  return _openSystemStatusDialog.apply(this, arguments);
}
function installAutomationUi() {
  var _document$getElementB, _document$getElementB2, _document$getElementB3, _document$getElementB4, _document$getElementB5, _document$getElementB6, _document$getElementB7, _document$getElementB8, _document$getElementB9;
  var actionBar = document.querySelector('.hero-actions') || document.querySelector('header') || document.body;
  if (!document.getElementById('whatsappStatusBadge')) {
    var _currentUser, _currentUser2;
    var userName = ((_currentUser = currentUser) === null || _currentUser === void 0 ? void 0 : _currentUser.name) || ((_currentUser2 = currentUser) === null || _currentUser2 === void 0 ? void 0 : _currentUser2.username) || 'مستخدم';
    actionBar.insertAdjacentHTML('beforeend', "<span class=\"mini-btn version-badge\" id=\"appVersionBadge\" title=\"\u0648\u0642\u062A \u0625\u0635\u062F\u0627\u0631 \u0647\u0630\u0647 \u0627\u0644\u0646\u0633\u062E\u0629\">\u0627\u0644\u0646\u0633\u062E\u0629 ".concat(APP_VERSION, " | ").concat(APP_BUILD_TIME, "</span><span class=\"mini-btn version-badge\" id=\"currentUserBadge\">\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645: ").concat(escapeHtml(userName), "</span><button class=\"mini-btn\" id=\"logoutBtn\" type=\"button\">\u062E\u0631\u0648\u062C</button><button class=\"mini-btn connection-badge is-down\" id=\"backendStatusBadge\" type=\"button\"><span class=\"connection-dot\"></span><span data-connection-text>\u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A: \u063A\u064A\u0631 \u0645\u062A\u0635\u0644</span></button><button class=\"mini-btn connection-badge is-down\" id=\"whatsappStatusBadge\" type=\"button\"><span class=\"connection-dot\"></span><span data-connection-text>\u0648\u0627\u062A\u0633\u0627\u0628: \u063A\u064A\u0631 \u0645\u062A\u0635\u0644</span></button><button class=\"mini-btn\" id=\"systemStatusBtn\" type=\"button\">\u062D\u0627\u0644\u0629 \u0627\u0644\u0646\u0638\u0627\u0645</button><button class=\"mini-btn\" id=\"usersBtn\" type=\"button\">\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646</button><button class=\"mini-btn\" id=\"whatsappSettingsBtn\" type=\"button\">\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0648\u0627\u062A\u0633\u0627\u0628</button><button class=\"mini-btn\" id=\"dyehousePricesBtn\" type=\"button\">\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0645\u0635\u0627\u0628\u063A</button><button class=\"mini-btn\" id=\"a5AccountsBtn\" type=\"button\">\u062D\u0633\u0627\u0628\u0627\u062A A5</button><button class=\"mini-btn\" id=\"outboxBtn\" type=\"button\">\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0625\u0631\u0633\u0627\u0644</button><button class=\"mini-btn\" id=\"auditLogBtn\" type=\"button\">\u0633\u062C\u0644 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A</button>"));
  }
  (_document$getElementB = document.getElementById('backendStatusBadge')) === null || _document$getElementB === void 0 || _document$getElementB.addEventListener('click', pollBackendStatus);
  (_document$getElementB2 = document.getElementById('whatsappStatusBadge')) === null || _document$getElementB2 === void 0 || _document$getElementB2.addEventListener('click', pollWhatsappService);
  (_document$getElementB3 = document.getElementById('logoutBtn')) === null || _document$getElementB3 === void 0 || _document$getElementB3.addEventListener('click', logoutCurrentUser);
  (_document$getElementB4 = document.getElementById('systemStatusBtn')) === null || _document$getElementB4 === void 0 || _document$getElementB4.addEventListener('click', openSystemStatusDialog);
  (_document$getElementB5 = document.getElementById('usersBtn')) === null || _document$getElementB5 === void 0 || _document$getElementB5.addEventListener('click', openUsersDialog);
  var whatsappSettingsButton = document.getElementById('whatsappSettingsBtn');
  if (whatsappSettingsButton) whatsappSettingsButton.onclick = function (event) {
    event.preventDefault();
    openWhatsappSettingsDialog()["catch"](function (error) {
      console.error('whatsapp-settings-open-error', error);
      renderWhatsappSettingsDialog([]);
    });
  };
  (_document$getElementB6 = document.getElementById('dyehousePricesBtn')) === null || _document$getElementB6 === void 0 || _document$getElementB6.addEventListener('click', renderDyehousePricesDialog);
  (_document$getElementB7 = document.getElementById('a5AccountsBtn')) === null || _document$getElementB7 === void 0 || _document$getElementB7.addEventListener('click', renderA5AccountsDialog);
  (_document$getElementB8 = document.getElementById('outboxBtn')) === null || _document$getElementB8 === void 0 || _document$getElementB8.addEventListener('click', openOutboxDialog);
  (_document$getElementB9 = document.getElementById('auditLogBtn')) === null || _document$getElementB9 === void 0 || _document$getElementB9.addEventListener('click', function () {
    return openAuditLogDialog()["catch"](console.error);
  });
  updateBackendStatusBadge();
  updateWhatsappStatusBadge();
}
function reportToCanvas() {
  return _reportToCanvas.apply(this, arguments);
}
function _reportToCanvas() {
  _reportToCanvas = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee44() {
    var options,
      sheet,
      renderTarget,
      cloneWrap,
      _args42 = arguments,
      _t22;
    return _regenerator().w(function (_context44) {
      while (1) switch (_context44.p = _context44.n) {
        case 0:
          options = _args42.length > 0 && _args42[0] !== undefined ? _args42[0] : {};
          sheet = refs.documentBody.querySelector('.document-sheet');
          if (!(!sheet || !window.html2canvas)) {
            _context44.n = 1;
            break;
          }
          throw new Error('no-sheet');
        case 1:
          renderTarget = /*#__PURE__*/function () {
            var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee43(target) {
              var targetHeight, scale;
              return _regenerator().w(function (_context43) {
                while (1) switch (_context43.n) {
                  case 0:
                    targetHeight = Math.max(target.scrollHeight || target.offsetHeight || 1, 1);
                    scale = options.scale || Math.max(0.8, Math.min(2, 14000 / targetHeight));
                    _context43.n = 1;
                    return html2canvas(target, {
                      backgroundColor: '#ffffff',
                      scale: scale,
                      useCORS: true,
                      allowTaint: true,
                      imageTimeout: 0,
                      logging: false,
                      scrollX: 0,
                      scrollY: 0,
                      windowWidth: Math.max(target.scrollWidth || target.offsetWidth || 1100, 1100),
                      ignoreElements: function ignoreElements(element) {
                        var _element$classList;
                        return (_element$classList = element.classList) === null || _element$classList === void 0 ? void 0 : _element$classList.contains('no-print');
                      },
                      onclone: function onclone(clonedDoc) {
                        return clonedDoc.querySelectorAll('.document-brand-logo img').forEach(function (img) {
                          return img.remove();
                        });
                      }
                    });
                  case 1:
                    return _context43.a(2, _context43.v);
                }
              }, _callee43);
            }));
            return function renderTarget(_x50) {
              return _ref3.apply(this, arguments);
            };
          }();
          _context44.p = 2;
          _context44.n = 3;
          return renderTarget(sheet);
        case 3:
          return _context44.a(2, _context44.v);
        case 4:
          _context44.p = 4;
          _t22 = _context44.v;
          cloneWrap = document.createElement('div');
          cloneWrap.style.cssText = 'position:absolute;left:-20000px;top:0;width:1100px;background:#fff;pointer-events:none;';
          cloneWrap.appendChild(sheet.cloneNode(true));
          document.body.appendChild(cloneWrap);
          _context44.p = 5;
          _context44.n = 6;
          return renderTarget(cloneWrap.firstElementChild);
        case 6:
          return _context44.a(2, _context44.v);
        case 7:
          _context44.p = 7;
          cloneWrap.remove();
          return _context44.f(7);
        case 8:
          return _context44.a(2);
      }
    }, _callee44, null, [[5,, 7, 8], [2, 4]]);
  }));
  return _reportToCanvas.apply(this, arguments);
}
function asciiBytes(text) {
  var bytes = new Uint8Array(text.length);
  for (var i = 0; i < text.length; i += 1) bytes[i] = text.charCodeAt(i) & 255;
  return bytes;
}
function concatBytes(parts) {
  var total = parts.reduce(function (sumBytes, part) {
    return sumBytes + part.length;
  }, 0);
  var out = new Uint8Array(total);
  var offset = 0;
  parts.forEach(function (part) {
    out.set(part, offset);
    offset += part.length;
  });
  return out;
}
function dataUrlToBytes(dataUrl) {
  var binary = atob(String(dataUrl).split(',')[1] || '');
  var bytes = new Uint8Array(binary.length);
  for (var i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
function buildPdfFromPages(pageCanvases) {
  var pageWidth = 595.28;
  var pageHeight = 841.89;
  var objects = [];
  var addObject = function addObject(bodyParts) {
    return objects.push(Array.isArray(bodyParts) ? bodyParts : [asciiBytes(bodyParts)]);
  };
  addObject('<< /Type /Catalog /Pages 2 0 R >>');
  var kids = pageCanvases.map(function (_, index) {
    return "".concat(3 + index * 3, " 0 R");
  }).join(' ');
  addObject("<< /Type /Pages /Kids [".concat(kids, "] /Count ").concat(pageCanvases.length, " >>"));
  pageCanvases.forEach(function (canvas, index) {
    var pageObj = 3 + index * 3;
    var imageObj = pageObj + 1;
    var contentObj = pageObj + 2;
    var imageBytes = dataUrlToBytes(canvas.toDataURL('image/jpeg', 0.92));
    var imageRatio = canvas.height / canvas.width;
    var drawWidth = pageWidth;
    var drawHeight = Math.min(pageHeight, pageWidth * imageRatio);
    var drawY = pageHeight - drawHeight;
    var content = "q\n".concat(drawWidth.toFixed(2), " 0 0 ").concat(drawHeight.toFixed(2), " 0 ").concat(drawY.toFixed(2), " cm\n/Im").concat(index + 1, " Do\nQ\n");
    addObject("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ".concat(pageWidth, " ").concat(pageHeight, "] /Resources << /XObject << /Im").concat(index + 1, " ").concat(imageObj, " 0 R >> >> /Contents ").concat(contentObj, " 0 R >>"));
    addObject([asciiBytes("<< /Type /XObject /Subtype /Image /Width ".concat(canvas.width, " /Height ").concat(canvas.height, " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ").concat(imageBytes.length, " >>\nstream\n")), imageBytes, asciiBytes('\nendstream')]);
    addObject("<< /Length ".concat(asciiBytes(content).length, " >>\nstream\n").concat(content, "endstream"));
  });
  var parts = [asciiBytes('%PDF-1.4\n')];
  var offsets = [0];
  objects.forEach(function (bodyParts, index) {
    offsets.push(parts.reduce(function (sumBytes, part) {
      return sumBytes + part.length;
    }, 0));
    parts.push.apply(parts, [asciiBytes("".concat(index + 1, " 0 obj\n"))].concat(_toConsumableArray(bodyParts), [asciiBytes('\nendobj\n')]));
  });
  var xrefOffset = parts.reduce(function (sumBytes, part) {
    return sumBytes + part.length;
  }, 0);
  var xref = "xref\n0 ".concat(objects.length + 1, "\n0000000000 65535 f \n");
  offsets.slice(1).forEach(function (offset) {
    xref += "".concat(String(offset).padStart(10, '0'), " 00000 n \n");
  });
  xref += "trailer\n<< /Size ".concat(objects.length + 1, " /Root 1 0 R >>\nstartxref\n").concat(xrefOffset, "\n%%EOF");
  parts.push(asciiBytes(xref));
  return new Blob([concatBytes(parts)], {
    type: 'application/pdf'
  });
}
function reportToPdfBlob() {
  return _reportToPdfBlob.apply(this, arguments);
}
function _reportToPdfBlob() {
  _reportToPdfBlob = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee45() {
    var canvas, pageHeight, pageCanvases, top, sliceHeight, pageCanvas, ctx;
    return _regenerator().w(function (_context45) {
      while (1) switch (_context45.n) {
        case 0:
          _context45.n = 1;
          return reportToCanvas();
        case 1:
          canvas = _context45.v;
          pageHeight = Math.max(1200, Math.round(canvas.width * 1.414));
          pageCanvases = [];
          for (top = 0; top < canvas.height; top += pageHeight) {
            sliceHeight = Math.min(pageHeight, canvas.height - top);
            pageCanvas = document.createElement('canvas');
            pageCanvas.width = canvas.width;
            pageCanvas.height = sliceHeight;
            ctx = pageCanvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(canvas, 0, top, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
            pageCanvases.push(pageCanvas);
          }
          return _context45.a(2, buildPdfFromPages(pageCanvases));
      }
    }, _callee45);
  }));
  return _reportToPdfBlob.apply(this, arguments);
}
function uploadCurrentDocumentPdf(_x26, _x27) {
  return _uploadCurrentDocumentPdf.apply(this, arguments);
}
function _uploadCurrentDocumentPdf() {
  _uploadCurrentDocumentPdf = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee46(reportType, order) {
    var blob, dataUrl, customerName, response, data;
    return _regenerator().w(function (_context46) {
      while (1) switch (_context46.n) {
        case 0:
          _context46.n = 1;
          return reportToPdfBlob();
        case 1:
          blob = _context46.v;
          _context46.n = 2;
          return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () {
              return resolve(reader.result);
            };
            reader.onerror = function () {
              return reject(new Error('pdf-read-failed'));
            };
            reader.readAsDataURL(blob);
          });
        case 2:
          dataUrl = _context46.v;
          customerName = reportType === 'dyeing_production_order' && order.whatsappDyehouseName ? "".concat(order.customer || '', "_").concat(order.whatsappDyehouseName) : order.customer;
          _context46.n = 3;
          return fetch("".concat(WHATSAPP_SERVICE_URL, "/api/reports/upload"), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              reportType: reportType,
              orderNumber: order.orderNumber,
              customerName: customerName,
              dataUrl: dataUrl
            })
          });
        case 3:
          response = _context46.v;
          if (response.ok) {
            _context46.n = 5;
            break;
          }
          if (!(response.status === 413)) {
            _context46.n = 4;
            break;
          }
          throw new Error('pdf-too-large');
        case 4:
          throw new Error('upload-failed');
        case 5:
          _context46.n = 6;
          return response.json();
        case 6:
          data = _context46.v;
          return _context46.a(2, data.attachmentPath || data.path || '');
      }
    }, _callee46);
  }));
  return _uploadCurrentDocumentPdf.apply(this, arguments);
}
function getWhatsappServiceStatus() {
  return _getWhatsappServiceStatus.apply(this, arguments);
}
function _getWhatsappServiceStatus() {
  _getWhatsappServiceStatus = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee47() {
    var response;
    return _regenerator().w(function (_context47) {
      while (1) switch (_context47.n) {
        case 0:
          _context47.n = 1;
          return fetch("".concat(WHATSAPP_SERVICE_URL, "/api/status"));
        case 1:
          response = _context47.v;
          if (response.ok) {
            _context47.n = 2;
            break;
          }
          throw new Error('whatsapp-service-offline');
        case 2:
          _context47.n = 3;
          return response.json();
        case 3:
          return _context47.a(2, _context47.v);
      }
    }, _callee47);
  }));
  return _getWhatsappServiceStatus.apply(this, arguments);
}
function normalizeWhatsappGroupName(value) {
  return String(value || '').replace(/\*/g, '').replace(/[\-\s]+/g, '').trim().toLowerCase();
}
function ensureWhatsappGroupExists(_x28) {
  return _ensureWhatsappGroupExists.apply(this, arguments);
}
function _ensureWhatsappGroupExists() {
  _ensureWhatsappGroupExists = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee48(groupName) {
    var response, data, wanted, groups, found, preview, error;
    return _regenerator().w(function (_context48) {
      while (1) switch (_context48.n) {
        case 0:
          _context48.n = 1;
          return fetch("".concat(WHATSAPP_SERVICE_URL, "/api/groups"));
        case 1:
          response = _context48.v;
          if (response.ok) {
            _context48.n = 2;
            break;
          }
          return _context48.a(2);
        case 2:
          _context48.n = 3;
          return response.json();
        case 3:
          data = _context48.v;
          wanted = normalizeWhatsappGroupName(groupName);
          groups = data.groups || [];
          found = groups.some(function (group) {
            var normalizedGroup = normalizeWhatsappGroupName(group.name);
            return normalizedGroup === wanted;
          });
          if (found) {
            _context48.n = 4;
            break;
          }
          preview = groups.map(function (group) {
            return group.name;
          }).slice(0, 12).join('\n');
          error = new Error('whatsapp-group-not-found');
          error.groupName = groupName;
          error.groupPreview = preview;
          throw error;
        case 4:
          return _context48.a(2);
      }
    }, _callee48);
  }));
  return _ensureWhatsappGroupExists.apply(this, arguments);
}
function queueDocumentReport(type, order) {
  var reportType = {
    weaving: 'weaving_production_order',
    dyeing: 'dyeing_production_order',
    fullreport: 'dyehouses_report'
  }[type];
  if (!reportType || !order) return;
  setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var attachmentPath, row, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          _context2.n = 1;
          return uploadCurrentDocumentPdf(reportType, order);
        case 1:
          attachmentPath = _context2.v;
          row = enqueueReport(reportType, order, attachmentPath);
          if (row && attachmentPath) {
            refreshQueuedReportRows(reportType, order, attachmentPath);
            save();
            syncOutboxToWhatsappService();
          }
          _context2.n = 3;
          break;
        case 2:
          _context2.p = 2;
          _t2 = _context2.v;
          console.warn('whatsapp-auto-queue-skipped', _t2);
        case 3:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 2]]);
  })), 350);
}
function retryOutbox(_x29) {
  return _retryOutbox.apply(this, arguments);
}
function _retryOutbox() {
  _retryOutbox = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee49(id) {
    var item;
    return _regenerator().w(function (_context49) {
      while (1) switch (_context49.n) {
        case 0:
          item = reportOutbox.find(function (row) {
            return row.id === id;
          });
          if (item) {
            _context49.n = 1;
            break;
          }
          return _context49.a(2);
        case 1:
          item.status = 'pending';
          item.errorMessage = '';
          item.retryCount = Number(item.retryCount || 0) + 1;
          recordAudit('retry', 'reportOutbox', id, null, item, 'إعادة إرسال التقرير');
          _context49.n = 2;
          return persistAuditLog();
        case 2:
          save();
          _context49.n = 3;
          return syncOutboxToWhatsappService();
        case 3:
          openOutboxDialog();
          pollWhatsappService();
        case 4:
          return _context49.a(2);
      }
    }, _callee49);
  }));
  return _retryOutbox.apply(this, arguments);
}
var cleanCodePart = function cleanCodePart(value) {
  return String(value || '').trim().replace(/\s+/g, '-');
};
function buildItemCode(number) {
  var part = cleanCodePart(number);
  return part ? "2B-".concat(part) : '';
}
function numericPart(value) {
  var match = String(value || '').match(/\d+/g);
  return match ? Number(match[match.length - 1]) : 0;
}
function nextPricingNumber() {
  var maxNumber = Math.max.apply(Math, [1000].concat(_toConsumableArray(pricings.map(function (pricing) {
    return numericPart(pricing.pricingNumber);
  })), _toConsumableArray(orders.map(function (order) {
    return numericPart(order.orderNumber);
  }))));
  return String(maxNumber + 1);
}
function orderNumberFromPricing(pricingNumber) {
  var number = numericPart(pricingNumber);
  return number ? String(number) : String(pricingNumber || '');
}
function syncAutoCodes() {
  var _refs$pricingNumber, _refs$orderNumber;
  if (refs.pricingProductCode) refs.pricingProductCode.value = buildItemCode((_refs$pricingNumber = refs.pricingNumber) === null || _refs$pricingNumber === void 0 ? void 0 : _refs$pricingNumber.value);
  if (refs.productCode) refs.productCode.value = buildItemCode((_refs$orderNumber = refs.orderNumber) === null || _refs$orderNumber === void 0 ? void 0 : _refs$orderNumber.value);
}
var itemCodeMigrationNeeded = false;
orders = orders.map(function (order) {
  var productCode = order.productCode || buildItemCode(order.orderNumber);
  if (productCode !== order.productCode) itemCodeMigrationNeeded = true;
  return _objectSpread(_objectSpread({}, order), {}, {
    productCode: productCode
  });
});
pricings = pricings.map(function (pricing) {
  var productCode = pricing.productCode || buildItemCode(pricing.pricingNumber);
  if (productCode !== pricing.productCode) itemCodeMigrationNeeded = true;
  return _objectSpread(_objectSpread({}, pricing), {}, {
    productCode: productCode
  });
});
if (itemCodeMigrationNeeded) save();
var customDyehousePriceLibrary = function () {
  try {
    var saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.dyehousePriceLibrary));
    return saved && _typeof(saved) === 'object' && !Array.isArray(saved) ? saved : {};
  } catch (_unused0) {
    return {};
  }
}();
function mergeDyehousePriceLibrary() {
  return pricingDomain.mergeDyehousePriceLibrary(customDyehousePriceLibrary || {});
}
function saveDyehousePriceLibraryLocal() {
  safeSetLocalStorage(STORAGE_KEYS.dyehousePriceLibrary, JSON.stringify(customDyehousePriceLibrary || {}));
}
function saveDyehousePriceLibrary() {
  return _saveDyehousePriceLibrary.apply(this, arguments);
}
function _saveDyehousePriceLibrary() {
  _saveDyehousePriceLibrary = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee50() {
    var _t23;
    return _regenerator().w(function (_context50) {
      while (1) switch (_context50.p = _context50.n) {
        case 0:
          customDyehousePriceLibrary = sanitizeDyehousePriceLibrary(customDyehousePriceLibrary || {});
          saveDyehousePriceLibraryLocal();
          if (backendAvailable) {
            _context50.n = 1;
            break;
          }
          return _context50.a(2, false);
        case 1:
          _context50.p = 1;
          _context50.n = 2;
          return backendRequest('/settings/dyehousePriceLibrary', {
            method: 'PUT',
            body: JSON.stringify({
              value: customDyehousePriceLibrary
            })
          });
        case 2:
          return _context50.a(2, true);
        case 3:
          _context50.p = 3;
          _t23 = _context50.v;
          backendAvailable = false;
          console.warn('Dyehouse price library backend save failed', _t23);
          return _context50.a(2, false);
      }
    }, _callee50, null, [[1, 3]]);
  }));
  return _saveDyehousePriceLibrary.apply(this, arguments);
}
function activeDyehousePriceLibrary() {
  return mergeDyehousePriceLibrary();
}
function applyPricingDyehouseOptions() {
  if (!refs.pricingDyehouse) return;
  var current = refs.pricingDyehouse.value;
  var names = Object.keys(activeDyehousePriceLibrary()).filter(function (name) {
    return name && !isLegacyRecoveredText(name);
  }).sort(function (a, b) {
    return a.localeCompare(b, 'ar');
  });
  refs.pricingDyehouse.innerHTML = "<option value=\"\">\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0635\u0628\u063A\u0629</option>".concat(names.map(function (name) {
    return "<option value=\"".concat(escapeHtml(name), "\">").concat(escapeHtml(name), "</option>");
  }).join(''));
  if (names.includes(current)) refs.pricingDyehouse.value = current;
  applyPricingColorOptions();
}
function applyPricingMaterialOptions() {
  if (!refs.pricingMaterialType) return;
  var current = refs.pricingMaterialType.value;
  var options = ['قطن', 'مخلوط', 'بوليستر'];
  refs.pricingMaterialType.innerHTML = "<option value=\"\">\u0627\u062E\u062A\u0631 \u0627\u0644\u062E\u0627\u0645\u0629</option>".concat(options.map(function (name) {
    return "<option value=\"".concat(escapeHtml(name), "\">").concat(escapeHtml(name), "</option>");
  }).join(''));
  if (options.includes(current)) refs.pricingMaterialType.value = current;
}
function applyPricingColorOptions() {
  var _refs$pricingDyehouse, _refs$pricingMaterial;
  if (!refs.pricingColorClass) return;
  var current = normalizeDyehousePriceLabel(refs.pricingColorClass.value);
  var librarySource = activeDyehousePriceLibrary();
  var dyehouse = ((_refs$pricingDyehouse = refs.pricingDyehouse) === null || _refs$pricingDyehouse === void 0 ? void 0 : _refs$pricingDyehouse.value) || '';
  var material = ((_refs$pricingMaterial = refs.pricingMaterialType) === null || _refs$pricingMaterial === void 0 ? void 0 : _refs$pricingMaterial.value) || '';
  var library = librarySource[dyehouse];
  var resolved = library !== null && library !== void 0 && library.aliasOf ? librarySource[library.aliasOf] : library;
  var materialKey = material === 'مخلوط' ? 'قطن' : material;
  var sourceLibraries = resolved ? [resolved] : Object.values(librarySource).map(function (config) {
    return config !== null && config !== void 0 && config.aliasOf ? librarySource[config.aliasOf] : config;
  });
  var colors = materialKey ? uniqueNonEmpty(sourceLibraries.flatMap(function (config) {
    var _config$dyeing;
    return Object.keys((config === null || config === void 0 || (_config$dyeing = config.dyeing) === null || _config$dyeing === void 0 ? void 0 : _config$dyeing[materialKey]) || {});
  })) : uniqueNonEmpty(Object.values((resolved === null || resolved === void 0 ? void 0 : resolved.dyeing) || {}).flatMap(function (items) {
    return Object.keys(items || {});
  }));
  var fallback = ['غسيل - مفتوح', 'غسيل - مقفول', 'أبيض / كسترة - مفتوح', 'أبيض / كسترة - مقفول', 'فواتح - مفتوح', 'فواتح - مقفول', 'وسط - مفتوح', 'وسط - مقفول', 'غوامق - مفتوح', 'غوامق - مقفول', 'أسود - مفتوح', 'أسود - مقفول', 'أسود خاص - مفتوح', 'أسود خاص - مقفول', 'ألوان خاصة - مفتوح', 'ألوان خاصة - مقفول'];
  var options = (colors.length ? colors : materialKey ? [] : fallback).filter(function (name) {
    return name && !isLegacyRecoveredText(name);
  }).sort(function (a, b) {
    return a.localeCompare(b, 'ar');
  });
  refs.pricingColorClass.innerHTML = "<option value=\"\">\u0627\u062E\u062A\u0631 \u0627\u0644\u062F\u0631\u062C\u0629</option>".concat(options.map(function (name) {
    return "<option value=\"".concat(escapeHtml(name), "\">").concat(escapeHtml(name), "</option>");
  }).join(''));
  if (options.includes(current)) refs.pricingColorClass.value = current;
}
var AMAL_FASHION_ORDER_LIBRARY = {};
function cloneAmalSuggestion(item) {
  return JSON.parse(JSON.stringify(item || {}));
}
function getAmalOrderNumberFromFile(file) {
  var name = String((file === null || file === void 0 ? void 0 : file.name) || '');
  var match = name.match(/(\d{3,6})/);
  return match ? match[1] : '';
}
function getRawIssueSuggestionFromFile() {
  return null;
}
function normalizeDigits(value) {
  return String(value || '').trim().replace(/[\u0660-\u0669]/g, function (digit) {
    return String(digit.charCodeAt(0) - 0x0660);
  }).replace(/[\u06F0-\u06F9]/g, function (digit) {
    return String(digit.charCodeAt(0) - 0x06F0);
  });
}
function noteParts(value) {
  return normalizeDigits(value).split(/[^\d]+/).filter(Boolean);
}
function orderRawNoteCandidates(order) {
  var orderNumber = String((order === null || order === void 0 ? void 0 : order.orderNumber) || '').trim();
  var pricing = pricingForOrder(order);
  var library = AMAL_FASHION_ORDER_LIBRARY[orderNumber];
  return uniqueNonEmpty([library === null || library === void 0 ? void 0 : library.rawNoteNumber, pricing === null || pricing === void 0 ? void 0 : pricing.rawNoteNumber].concat(_toConsumableArray(rawBatches.filter(function (batch) {
    return batch.orderId === (order === null || order === void 0 ? void 0 : order.id);
  }).map(function (batch) {
    return batch.noteNumber;
  }))).flatMap(noteParts));
}
function findOrderForRawIssueSuggestion() {
  var _find;
  var suggestion = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var byOrderNumber = suggestion.orderNumber ? orders.find(function (order) {
    return String(order.orderNumber || '').trim() === String(suggestion.orderNumber || '').trim();
  }) : null;
  if (byOrderNumber) return byOrderNumber;
  var wantedNotes = noteParts(suggestion.rawNoteNumber);
  if (wantedNotes.length) {
    var byNote = orders.find(function (order) {
      var notes = orderRawNoteCandidates(order);
      return wantedNotes.some(function (note) {
        return notes.includes(note);
      });
    });
    if (byNote) return byNote;
  }
  var firstFabric = normalizeForCompare(((_find = (suggestion.rows || []).find(function (row) {
    return !isAccessoryRow(row);
  })) === null || _find === void 0 ? void 0 : _find.fabricType) || '');
  if (firstFabric) {
    return orders.find(function (order) {
      return normalizeForCompare(order.fabricType).includes(firstFabric) || firstFabric.includes(normalizeForCompare(order.fabricType));
    });
  }
  return null;
}
function isAccessoryRow(row) {
  var text = String((row === null || row === void 0 ? void 0 : row.fabricType) || (row === null || row === void 0 ? void 0 : row.accessoryType) || '').trim();
  return !!(row !== null && row !== void 0 && row.accessoryType) || /\b(||||||)\b/i.test(text);
}
function calcAccessoryPercentFromRows(rows) {
  var clothTotal = rows.filter(function (row) {
    return !isAccessoryRow(row);
  }).reduce(function (t, row) {
    return t + Number(row.quantity || 0);
  }, 0);
  var accessoryTotal = rows.filter(isAccessoryRow).reduce(function (t, row) {
    return t + Number(row.quantity || 0);
  }, 0);
  return clothTotal && accessoryTotal ? roundNumber(accessoryTotal / clothTotal * 100) : 0;
}
function getSuggestedDyeCost(dyehouse, materialType, colorClass) {
  return pricingDomain.getSuggestedDyeCost(activeDyehousePriceLibrary(), dyehouse, materialType, colorClass);
}
function updateSuggestedDyeCost() {
  var suggested = getSuggestedDyeCost(refs.pricingDyehouse.value, refs.pricingMaterialType.value, refs.pricingColorClass.value);
  refs.pricingSuggestedDyeCost.value = suggested;
  if (suggested !== '') refs.pricingDyeCost.value = suggested;
  updatePricingPreview();
}
function readWidthLinesFromEditor() {
  return _toConsumableArray(refs.widthLinesEditor.querySelectorAll('.width-line-row')).map(function (row) {
    return {
      id: row.dataset.widthLineId || uid(),
      inch: row.querySelector('[data-width-field="inch"]').value.trim(),
      width: Number(row.querySelector('[data-width-field="width"]').value),
      quantity: Number(row.querySelector('[data-width-field="quantity"]').value)
    };
  }).filter(function (item) {
    return item.inch && item.width > 0 && item.quantity > 0;
  });
}
function widthLineRowHtml() {
  var line = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return "<div class=\"width-line-row\" data-width-line-id=\"".concat(line.id || '', "\"><input data-width-field=\"inch\" placeholder=\"\" value=\"").concat(line.inch || '', "\"><input data-width-field=\"width\" type=\"number\" placeholder=\"\" value=\"").concat(line.width || '', "\"><input data-width-field=\"quantity\" type=\"number\" placeholder=\"\" value=\"").concat(line.quantity || '', "\"><button type=\"button\" class=\"mini-btn danger\" data-remove-width-line></button></div>");
}
function renderWidthLinesEditor() {
  var lines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  refs.widthLinesEditor.innerHTML = "<div class=\"width-line-head\"><span>\u0627\u0644\u0628\u0648\u0635\u0629</span><span>\u0627\u0644\u0639\u0631\u0636</span><span>\u0627\u0644\u0643\u0645\u064A\u0629</span><span></span></div>".concat((lines.length ? lines : [{}]).map(function (line) {
    return widthLineRowHtml(line);
  }).join(''));
}
function accessoryLineRowHtml() {
  var line = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return "<div class=\"accessory-line-row\" data-accessory-line-id=\"".concat(line.id || '', "\"><input data-accessory-field=\"type\" placeholder=\" \" list=\"accessoryTypeList\" value=\"").concat(line.type || '', "\"><input data-accessory-field=\"percent\" type=\"number\" step=\"0.01\" placeholder=\" %\" value=\"").concat(line.percent || '', "\"><input data-accessory-field=\"quantity\" type=\"number\" step=\"0.01\" placeholder=\" \" value=\"").concat(line.quantityManual || line.quantity || '', "\"><button type=\"button\" class=\"mini-btn danger\" data-remove-accessory-line></button></div>");
}
function renderAccessoryLinesEditor() {
  var lines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var rows = lines.length ? lines : [{}];
  refs.accessoryLinesEditor.innerHTML = "<datalist id=\"accessoryTypeList\"><option value=\"\u0631\u064A\u0628\"><option value=\"\u0644\u064A\u0627\u0642\u0627\u062A\"><option value=\"\u0623\u0633\u0627\u0648\u0631\"><option value=\"\u062F\u064A\u0631\u0628\u064A\"></datalist><div class=\"accessory-line-head\"><span>\u0646\u0648\u0639 \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631</span><span>\u0627\u0644\u0646\u0633\u0628\u0629 %</span><span>\u0627\u0644\u0643\u0645\u064A\u0629</span><span></span></div>".concat(rows.map(function (line) {
    return accessoryLineRowHtml(line);
  }).join(''));
}
function readAccessoryLinesFromEditor() {
  var rows = _toConsumableArray(refs.accessoryLinesEditor.querySelectorAll('.accessory-line-row')).map(function (row) {
    return {
      id: row.dataset.accessoryLineId || uid(),
      type: row.querySelector('[data-accessory-field="type"]').value.trim(),
      percent: Number(row.querySelector('[data-accessory-field="percent"]').value || 0),
      quantityManual: row.querySelector('[data-accessory-field="quantity"]').value === '' ? '' : Number(row.querySelector('[data-accessory-field="quantity"]').value || 0)
    };
  }).filter(function (item) {
    return item.type || item.percent > 0 || Number(item.quantityManual || 0) > 0;
  });
  if (rows.length) return rows.map(function (item) {
    return _objectSpread(_objectSpread({}, item), {}, {
      type: item.type || ''
    });
  });
  if (refs.accessoryType.value || Number(refs.accessoryPercent.value || 0)) return [{
    id: uid(),
    type: refs.accessoryType.value || '',
    percent: Number(refs.accessoryPercent.value || 0),
    quantityManual: ''
  }];
  return [];
}
function syncWidthModeUi() {
  var multiple = refs.widthMode.value === 'multiple';
  refs.widthLinesBox.classList.toggle('active', multiple);
  refs.inchWidth.required = !multiple;
}
var statusLabel = function statusLabel(status) {
  return {
    pending: 'بانتظار الاستلام',
    'in-progress': 'قيد التشغيل',
    completed: 'مكتمل',
    closed: 'مغلق تشغيليًا'
  }[status];
};
var orderDomain = window.TwoBTexOrders.createOrderDomain({
  buildItemCode: buildItemCode,
  orderRawCost: orderRawCost,
  roundNumber: roundNumber,
  sum: sum,
  uid: uid,
  getState: function getState() {
    return {
      orders: orders,
      allocations: allocations,
      rawBatches: rawBatches,
      productionBatches: productionBatches,
      customerBatches: customerBatches,
      accessoryBatches: accessoryBatches,
      dyehouseTransfers: dyehouseTransfers,
      rawReturns: rawReturns
    };
  }
});
function orderAccessoryConfig() {
  var order = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return orderDomain.orderAccessoryConfig(order);
}
function normalizeOrderForRuntime() {
  var order = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return orderDomain.normalizeOrderForRuntime(order);
}
function calculateAllocation() {
  var allocation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var orderContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
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
function renderPricings() {
  var activePricings = pricings.filter(isActivePricing);
  refs.pricingTableBody.innerHTML = activePricings.map(calculatePricing).map(function (pricing) {
    return "<tr><td data-label=\"\u0631\u0642\u0645 \u0627\u0644\u062A\u0633\u0639\u064A\u0631\u0629\">".concat(pricing.pricingNumber, "</td><td data-label=\"\u0627\u0644\u0639\u0645\u064A\u0644\">").concat(pricing.customer, "</td><td data-label=\"\u0627\u0644\u0635\u0646\u0641\">").concat(pricing.fabricType, "</td><td data-label=\"\u0627\u0644\u0645\u0635\u0628\u063A\u0629\">").concat(pricing.dyehouse, "</td><td data-label=\"\u0627\u0644\u0643\u0645\u064A\u0629\">").concat(pricing.quantity, "</td><td data-label=\"\u062A\u0643\u0644\u0641\u0629 \u0627\u0644\u0643\u064A\u0644\u0648\">").concat(pricing.costPerKg.toLocaleString('en-US'), "</td><td data-label=\"\u0633\u0639\u0631 \u0627\u0644\u0628\u064A\u0639\">").concat(pricing.sellPrice.toLocaleString('en-US'), "</td><td data-label=\"\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0639\u0642\u062F\">").concat(pricing.totalOffer.toLocaleString('en-US'), "</td><td data-label=\"\u0627\u0644\u062D\u0627\u0644\u0629\"><span class=\"status pending\">\u062A\u0633\u0639\u064A\u0631\u0629</span></td><td data-label=\"\u0625\u062C\u0631\u0627\u0621\u0627\u062A\"><div class=\"batch-actions\"><button class=\"mini-btn\" data-pricing-quote=\"").concat(pricing.id, "\">\u0639\u0631\u0636 \u0633\u0639\u0631</button><button class=\"mini-btn\" data-convert-pricing=\"").concat(pricing.id, "\">\u062A\u0646\u0632\u064A\u0644 \u0637\u0644\u0628</button><button class=\"mini-btn\" data-edit-pricing=\"").concat(pricing.id, "\">\u062A\u0639\u062F\u064A\u0644</button><button class=\"mini-btn danger\" data-delete-pricing=\"").concat(pricing.id, "\">\u062D\u0630\u0641</button></div></td></tr>");
  }).join('');
}
function updatePricingPreview() {
  var pricing = calculatePricing({
    dyehouse: refs.pricingDyehouse.value,
    rawCost: +refs.pricingRawCost.value,
    dyeCost: +refs.pricingDyeCost.value,
    wastePercent: +refs.pricingWastePercent.value,
    extraCost: +refs.pricingExtraCost.value,
    profitPerKg: +refs.pricingProfitPerKg.value,
    quantity: +refs.pricingQuantity.value
  });
  refs.pricingWasteCostPreview.textContent = pricing.wasteCost.toLocaleString('en-US');
  refs.pricingCostPreview.textContent = pricing.costPerKg.toLocaleString('en-US');
  refs.pricingSellPreview.textContent = pricing.sellPrice.toLocaleString('en-US');
  refs.pricingTotalPreview.textContent = pricing.totalOffer.toLocaleString('en-US');
}
function pricingPayload() {
  var _refs$pricingPaymentM, _refs$pricingPaymentD;
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : uid();
  var paymentTerms = composePaymentTerms((_refs$pricingPaymentM = refs.pricingPaymentMode) === null || _refs$pricingPaymentM === void 0 ? void 0 : _refs$pricingPaymentM.value, (_refs$pricingPaymentD = refs.pricingPaymentDetails) === null || _refs$pricingPaymentD === void 0 ? void 0 : _refs$pricingPaymentD.value);
  if (refs.pricingPaymentTerms) refs.pricingPaymentTerms.value = paymentTerms;
  return {
    id: id,
    pricingNumber: refs.pricingNumber.value,
    productCode: buildItemCode(refs.pricingNumber.value),
    customer: refs.pricingCustomer.value,
    pricingDate: refs.pricingDate.value,
    fabricType: refs.pricingFabricType.value,
    dyehouse: refs.pricingDyehouse.value,
    colorClass: refs.pricingColorClass.value,
    quantity: +refs.pricingQuantity.value,
    inchWidth: +refs.pricingInchWidth.value,
    finishedWeight: +refs.pricingFinishedWeight.value,
    materialType: refs.pricingMaterialType.value,
    rawCost: +refs.pricingRawCost.value,
    dyeCost: +refs.pricingDyeCost.value,
    wastePercent: +refs.pricingWastePercent.value,
    extraCost: +refs.pricingExtraCost.value,
    profitPerKg: +refs.pricingProfitPerKg.value,
    paymentTerms: paymentTerms,
    notes: refs.pricingNotes.value
  };
}
function fillPricingForm(pricing) {
  var material = pricing.materialType || '';
  var dyehouse = pricing.dyehouse || '';
  var colorClass = normalizeDyehousePriceLabel(pricing.colorClass || '');
  refs.pricingNumber.value = pricing.pricingNumber || '';
  if (refs.pricingProductCode) refs.pricingProductCode.value = pricing.productCode || buildItemCode(pricing.pricingNumber);
  refs.pricingCustomer.value = pricing.customer || '';
  refs.pricingDate.value = pricing.pricingDate || new Date().toISOString().slice(0, 10);
  refs.pricingFabricType.value = pricing.fabricType || '';
  applyPricingMaterialOptions();
  refs.pricingMaterialType.value = _toConsumableArray(refs.pricingMaterialType.options).some(function (option) {
    return option.value === material;
  }) ? material : '';
  applyPricingDyehouseOptions();
  refs.pricingDyehouse.value = _toConsumableArray(refs.pricingDyehouse.options).some(function (option) {
    return option.value === dyehouse;
  }) ? dyehouse : '';
  applyPricingColorOptions();
  refs.pricingColorClass.value = _toConsumableArray(refs.pricingColorClass.options).some(function (option) {
    return option.value === colorClass;
  }) ? colorClass : '';
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
  var pricing = pricings.find(function (item) {
    return item.id === id;
  });
  if (!pricing) return;
  editingPricingId = id;
  if (refs.deletePricingBtn) refs.deletePricingBtn.style.display = 'inline-flex';
  fillPricingForm(pricing);
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.pricingDialog.showModal();
}
function deletePricing(_x30) {
  return _deletePricing.apply(this, arguments);
}
function _deletePricing() {
  _deletePricing = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee51(id) {
    var pricing, backendSaveRequired, deleted;
    return _regenerator().w(function (_context51) {
      while (1) switch (_context51.n) {
        case 0:
          pricing = pricings.find(function (item) {
            return item.id === id;
          });
          if (pricing) {
            _context51.n = 1;
            break;
          }
          return _context51.a(2);
        case 1:
          if (confirm("\u0647\u0644 \u062A\u0631\u064A\u062F \u062D\u0630\u0641 \u0627\u0644\u062A\u0633\u0639\u064A\u0631\u0629 \u0631\u0642\u0645 ".concat(pricing.pricingNumber, "\u061F"))) {
            _context51.n = 2;
            break;
          }
          return _context51.a(2);
        case 2:
          _context51.n = 3;
          return ensureBackendForWrite();
        case 3:
          if (_context51.v) {
            _context51.n = 4;
            break;
          }
          return _context51.a(2);
        case 4:
          backendSaveRequired = true;
          _context51.n = 5;
          return deleteBackend("/pricings/".concat(id));
        case 5:
          deleted = _context51.v;
          if (!(backendSaveRequired && !deleted)) {
            _context51.n = 7;
            break;
          }
          _context51.n = 6;
          return rollbackAfterBackendWriteFailure('تعذر حذف التسعيرة من قاعدة البيانات. لم يتم اعتماد الحذف.');
        case 6:
          return _context51.a(2);
        case 7:
          recordAudit('delete', 'pricing', id, pricing, null, "\u062D\u0630\u0641 \u0627\u0644\u062A\u0633\u0639\u064A\u0631\u0629 \u0631\u0642\u0645 ".concat(pricing.pricingNumber || ''));
          _context51.n = 8;
          return persistAuditLog();
        case 8:
          if (editingPricingId === id) editingPricingId = null;
          _context51.n = 9;
          return loadBackendData();
        case 9:
          if (refs.documentDialog.open) refs.documentDialog.close();
        case 10:
          return _context51.a(2);
      }
    }, _callee51);
  }));
  return _deletePricing.apply(this, arguments);
}
function addPricing(_x31) {
  return _addPricing.apply(this, arguments);
}
function _addPricing() {
  _addPricing = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee52(event) {
    var backendSaveRequired, index, before, updatedPricing, backendCustomer, savedPricing, createdPricing, _backendCustomer, _savedPricing;
    return _regenerator().w(function (_context52) {
      while (1) switch (_context52.n) {
        case 0:
          event.preventDefault();
          _context52.n = 1;
          return ensureBackendForWrite();
        case 1:
          if (_context52.v) {
            _context52.n = 2;
            break;
          }
          return _context52.a(2);
        case 2:
          backendSaveRequired = true;
          if (!editingPricingId) {
            _context52.n = 11;
            break;
          }
          index = pricings.findIndex(function (item) {
            return item.id === editingPricingId;
          });
          if (!(index !== -1)) {
            _context52.n = 10;
            break;
          }
          before = clone(pricings[index]);
          updatedPricing = pricingPayload(editingPricingId);
          _context52.n = 3;
          return ensureBackendCustomer(updatedPricing.customer);
        case 3:
          backendCustomer = _context52.v;
          _context52.n = 4;
          return putBackend("/pricings/".concat(editingPricingId), pricingToApi(updatedPricing, backendCustomer));
        case 4:
          savedPricing = _context52.v;
          if (!(backendSaveRequired && !savedPricing)) {
            _context52.n = 6;
            break;
          }
          _context52.n = 5;
          return rollbackAfterBackendWriteFailure('تعذر حفظ تعديل التسعيرة في قاعدة البيانات. لم يتم اعتماد التعديل.');
        case 5:
          return _context52.a(2);
        case 6:
          _context52.n = 7;
          return verifyPricingPersisted(editingPricingId, updatedPricing);
        case 7:
          if (_context52.v) {
            _context52.n = 9;
            break;
          }
          _context52.n = 8;
          return rollbackAfterBackendWriteFailure('تم إرسال تعديل التسعيرة لكن لم يرجع من قاعدة Railway. لم يتم اعتماد التعديل.');
        case 8:
          return _context52.a(2);
        case 9:
          recordAudit('update', 'pricing', editingPricingId, before, updatedPricing, "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u062A\u0633\u0639\u064A\u0631\u0629 \u0631\u0642\u0645 ".concat(updatedPricing.pricingNumber || ''));
          _context52.n = 10;
          return persistAuditLog();
        case 10:
          editingPricingId = null;
          _context52.n = 19;
          break;
        case 11:
          createdPricing = pricingPayload();
          _context52.n = 12;
          return ensureBackendCustomer(createdPricing.customer);
        case 12:
          _backendCustomer = _context52.v;
          _context52.n = 13;
          return postBackend('/pricings', pricingToApi(createdPricing, _backendCustomer));
        case 13:
          _savedPricing = _context52.v;
          if (!(backendSaveRequired && !_savedPricing)) {
            _context52.n = 15;
            break;
          }
          _context52.n = 14;
          return rollbackAfterBackendWriteFailure('تعذر حفظ التسعيرة الجديدة في قاعدة البيانات. لم يتم اعتماد التسعيرة.');
        case 14:
          return _context52.a(2);
        case 15:
          _context52.n = 16;
          return verifyPricingPersisted(_savedPricing.id || createdPricing.id, createdPricing);
        case 16:
          if (_context52.v) {
            _context52.n = 18;
            break;
          }
          _context52.n = 17;
          return rollbackAfterBackendWriteFailure('تم إرسال التسعيرة لكن لم ترجع من قاعدة Railway. لم يتم اعتماد التسعيرة.');
        case 17:
          return _context52.a(2);
        case 18:
          recordAudit('create', 'pricing', createdPricing.id, null, createdPricing, "\u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062A\u0633\u0639\u064A\u0631\u0629 \u0631\u0642\u0645 ".concat(createdPricing.pricingNumber || ''));
          _context52.n = 19;
          return persistAuditLog();
        case 19:
          _context52.n = 20;
          return loadBackendData();
        case 20:
          refs.pricingDialog.close();
        case 21:
          return _context52.a(2);
      }
    }, _callee52);
  }));
  return _addPricing.apply(this, arguments);
}
function convertPricingToOrder(id) {
  var pricing = calculatePricing(pricings.find(function (item) {
    return item.id === id;
  }));
  if (!pricing) return;
  var orderNumber = orderNumberFromPricing(pricing.pricingNumber);
  pendingConvertedPricingId = pricing.id;
  editingOrderId = null;
  fillOrderForm({
    pricingId: pricing.id,
    orderNumber: orderNumber,
    productCode: buildItemCode(orderNumber),
    customer: pricing.customer || '',
    orderDate: pricing.pricingDate || new Date().toISOString().slice(0, 10),
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
function markPricingConverted(_x32, _x33) {
  return _markPricingConverted.apply(this, arguments);
}
function _markPricingConverted() {
  _markPricingConverted = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee53(pricingNumber, orderId) {
    var pricingId,
      convertedAt,
      converted,
      ok,
      _i,
      _converted,
      pricing,
      saved,
      convertedById,
      _args51 = arguments;
    return _regenerator().w(function (_context53) {
      while (1) switch (_context53.n) {
        case 0:
          pricingId = _args51.length > 2 && _args51[2] !== undefined ? _args51[2] : null;
          convertedAt = new Date().toISOString();
          converted = [];
          pricings.forEach(function (pricing) {
            var matches = pricingId ? pricing.id === pricingId : String(pricing.pricingNumber) === String(pricingNumber) || orderNumberFromPricing(pricing.pricingNumber) === String(pricingNumber);
            if (matches) converted.push(_objectSpread(_objectSpread({}, pricing), {}, {
              status: 'converted',
              convertedOrderId: orderId || true,
              convertedAt: convertedAt
            }));
          });
          ok = true;
          _i = 0, _converted = converted;
        case 1:
          if (!(_i < _converted.length)) {
            _context53.n = 4;
            break;
          }
          pricing = _converted[_i];
          _context53.n = 2;
          return putBackend("/pricings/".concat(pricing.id), {
            status: 'converted',
            notes: pricing.notes || ''
          });
        case 2:
          saved = _context53.v;
          if (!saved) ok = false;
        case 3:
          _i++;
          _context53.n = 1;
          break;
        case 4:
          if (ok && converted.length) {
            convertedById = new Map(converted.map(function (pricing) {
              return [pricing.id, pricing];
            }));
            pricings = pricings.map(function (pricing) {
              return convertedById.get(pricing.id) || pricing;
            });
          }
          return _context53.a(2, ok);
      }
    }, _callee53);
  }));
  return _markPricingConverted.apply(this, arguments);
}
function openPricingQuotation(id) {
  var pricing = calculatePricing(pricings.find(function (item) {
    return item.id === id;
  }));
  if (!pricing) return;
  var money = function money(value) {
    return Number(value || 0).toLocaleString('en-US');
  };
  var customer = pricing.customer || pricing.customerName || pricing.clientName || '-';
  var notes = String(pricing.notes || '').trim();
  refs.documentTitle.textContent = 'عرض سعر';
  refs.documentBody.innerHTML = "<div class=\"document-sheet quotation-report two-b-report\">\n    ".concat(documentHeader(), "\n    <div class=\"document-inline-actions no-print\"><button class=\"mini-btn\" data-convert-pricing=\"").concat(escapeHtml(pricing.id), "\">\u062A\u0646\u0632\u064A\u0644 \u0637\u0644\u0628</button><button class=\"mini-btn\" data-edit-pricing-doc=\"").concat(escapeHtml(pricing.id), "\">\u062A\u0639\u062F\u064A\u0644</button></div>\n    <div class=\"report-title\"><h2>\u0639\u0631\u0636 \u0633\u0639\u0631 <small># ").concat(escapeHtml(pricing.pricingNumber || '-'), "</small></h2><span>\u0639\u0631\u0636 \u0645\u0642\u062F\u0645 \u0644\u0644\u0639\u0645\u064A\u0644 \u062D\u0633\u0628 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062A\u0633\u0639\u064A\u0631 \u0627\u0644\u062D\u0627\u0644\u064A\u0629.</span></div>\n    <div class=\"document-meta\">\n      <div><span>\u0627\u0644\u0639\u0645\u064A\u0644</span>").concat(escapeHtml(customer), "</div>\n      <div><span>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</span>").concat(escapeHtml(pricing.pricingDate || '-'), "</div>\n      <div><span>\u0627\u0644\u0635\u0646\u0641</span>").concat(escapeHtml(pricing.fabricType || '-'), "</div>\n      <div><span>\u062F\u0631\u062C\u0629 \u0627\u0644\u0644\u0648\u0646</span>").concat(escapeHtml(pricing.colorClass || '-'), "</div>\n      <div><span>\u0627\u0644\u0643\u0645\u064A\u0629</span>").concat(money(pricing.quantity), " \u0643\u062C\u0645</div>\n      <div><span>\u0627\u0644\u0628\u0648\u0635\u0629</span>").concat(escapeHtml(pricing.inchWidth || '-'), "</div>\n      <div><span>\u0627\u0644\u0648\u0632\u0646 \u0627\u0644\u0645\u062C\u0647\u0632</span>").concat(escapeHtml(pricing.finishedWeight || '-'), "</div>\n      <div><span>\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u0633\u062F\u0627\u062F</span>").concat(escapeHtml(pricing.paymentTerms || 'كاش'), "</div>\n    </div>\n    <section class=\"report-section quotation-summary\">\n      <h3>\u0645\u0644\u062E\u0635 \u0627\u0644\u0639\u0631\u0636</h3>\n      <div class=\"quotation-kpis\">\n        <div><span>\u0633\u0639\u0631 \u0627\u0644\u0643\u064A\u0644\u0648</span><strong>").concat(money(pricing.sellPrice), " \u062C\u0646\u064A\u0647</strong></div>\n        <div class=\"quotation-total\"><span>\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0639\u0642\u062F</span><strong>").concat(money(pricing.totalOffer), " \u062C\u0646\u064A\u0647</strong></div>\n      </div>\n    </section>\n    <section class=\"report-section\">\n      <h3>\u0628\u0646\u0648\u062F \u0627\u0644\u0639\u0631\u0636</h3>\n      <table><thead><tr><th>\u0627\u0644\u0635\u0646\u0641</th><th>\u062F\u0631\u062C\u0629 \u0627\u0644\u0644\u0648\u0646</th><th>\u0627\u0644\u0643\u0645\u064A\u0629</th><th>\u0627\u0644\u0628\u0648\u0635\u0629</th><th>\u0633\u0639\u0631 \u0627\u0644\u0643\u064A\u0644\u0648</th><th>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</th></tr></thead><tbody>\n        <tr><td>").concat(escapeHtml(pricing.fabricType || '-'), "</td><td>").concat(escapeHtml(pricing.colorClass || '-'), "</td><td>").concat(money(pricing.quantity), " \u0643\u062C\u0645</td><td>").concat(escapeHtml(pricing.inchWidth || '-'), "</td><td>").concat(money(pricing.sellPrice), " \u062C\u0646\u064A\u0647</td><td>").concat(money(pricing.totalOffer), " \u062C\u0646\u064A\u0647</td></tr>\n      </tbody></table>\n    </section>\n    <section class=\"report-section\"><h3>\u0645\u0644\u0627\u062D\u0638\u0627\u062A</h3><p>").concat(escapeHtml(notes || 'لا توجد ملاحظات إضافية.'), "</p></section>\n    ").concat(documentFooter(), "\n  </div>");
  refs.documentDialog.showModal();
}
function allOrders() {
  return orders.map(calculateOrder);
}
function orderNoteNumbers(order) {
  var allocationIds = (order.allocations || []).map(function (allocation) {
    return allocation.id;
  });
  return uniqueNonEmpty([].concat(_toConsumableArray(rawBatches.filter(function (batch) {
    return batch.orderId === order.id;
  }).map(function (batch) {
    return batch.noteNumber;
  })), _toConsumableArray(dyeBatches.filter(function (batch) {
    return batch.orderId === order.id || allocationIds.includes(batch.allocationId);
  }).map(function (batch) {
    return batch.noteNumber;
  })), _toConsumableArray(rawReturns.filter(function (batch) {
    return allocationIds.includes(batch.allocationId);
  }).map(function (batch) {
    return batch.noteNumber;
  })), _toConsumableArray(accessoryBatches.filter(function (batch) {
    return batch.orderId === order.id || allocationIds.includes(batch.allocationId);
  }).map(function (batch) {
    return batch.noteNumber;
  })), _toConsumableArray(productionBatches.filter(function (batch) {
    return allocationIds.includes(batch.allocationId);
  }).map(function (batch) {
    return batch.noteNumber;
  })), _toConsumableArray(customerBatches.filter(function (batch) {
    return allocationIds.includes(batch.allocationId);
  }).map(function (batch) {
    return batch.noteNumber;
  })), _toConsumableArray(dyehouseTransfers.filter(function (batch) {
    return batch.orderId === order.id || allocationIds.includes(batch.allocationId);
  }).map(function (batch) {
    return batch.noteNumber;
  }))).map(normalizeDigits));
}
function orderSearchText(order) {
  var noteNumbers = orderNoteNumbers(order);
  var noteAliases = noteNumbers.flatMap(function (note) {
    return [note, "\u0627\u0630\u0646 ".concat(note), "\u0625\u0630\u0646 ".concat(note), "\u0627\u0630\u0646 \u0631\u0642\u0645 ".concat(note), "\u0625\u0630\u0646 \u0631\u0642\u0645 ".concat(note), "\u0631\u0642\u0645 \u0627\u0630\u0646 ".concat(note), "\u0631\u0642\u0645 \u0625\u0630\u0646 ".concat(note)];
  });
  return normalizeDigits([order.orderNumber, order.customer, order.dyehouse, order.weavingSource, order.fabricType, order.productCode].concat(_toConsumableArray(noteAliases)).filter(Boolean).join(' ').toLowerCase());
}
function filteredOrders() {
  var query = normalizeDigits(refs.searchInput.value.trim().toLowerCase());
  var status = refs.orderStatusFilter.value;
  var customer = refs.customerFilter.value;
  var dyehouse = refs.dyehouseFilter.value;
  var fabric = refs.fabricFilter.value;
  return allOrders().filter(function (order) {
    return orderSearchText(order).includes(query) && (status === 'closed' ? order.status === 'closed' : status === 'all' ? order.status !== 'closed' : order.status === status) && (customer === 'all' || order.customer === customer) && (dyehouse === 'all' || order.dyehouse === dyehouse) && (fabric === 'all' || order.fabricType === fabric);
  });
}
function fillSelectOptions(select, values, allLabel) {
  var current = select.value || 'all';
  select.innerHTML = "<option value=\"all\">".concat(allLabel, "</option>").concat(_toConsumableArray(new Set(values.filter(Boolean))).sort().map(function (value) {
    return "<option value=\"".concat(value, "\">").concat(value, "</option>");
  }).join(''));
  if (_toConsumableArray(select.options).some(function (option) {
    return option.value === current;
  })) select.value = current;
}
function renderOrderFilters() {
  fillSelectOptions(refs.customerFilter, orders.map(function (order) {
    return order.customer;
  }), 'كل العملاء');
  fillSelectOptions(refs.dyehouseFilter, orders.map(function (order) {
    return order.dyehouse;
  }), 'كل المصابغ');
  fillSelectOptions(refs.fabricFilter, orders.map(function (order) {
    return order.fabricType;
  }), 'كل الأصناف');
}
function renderStats(list) {
  var fmt = function fmt(value) {
    return roundNumber(value).toLocaleString('en-US', {
      maximumFractionDigits: 3
    });
  };
  var values = [['عدد الطلبات', list.length], ['خام مطلوب', list.reduce(function (t, o) {
    return t + o.totalRawOrdered;
  }, 0)], ['خام مستلم', list.reduce(function (t, o) {
    return t + o.totalRawReceived;
  }, 0)], ['مرسل للمصبغة', list.reduce(function (t, o) {
    return t + o.totalSentToDyehouse;
  }, 0)], ['مجهز مستلم', list.reduce(function (t, o) {
    return t + o.totalFinishedReceived;
  }, 0)], ['هالك إجمالي', list.reduce(function (t, o) {
    return t + o.totalWaste;
  }, 0)]];
  refs.statsGrid.innerHTML = values.map(function (_ref23) {
    var _ref24 = _slicedToArray(_ref23, 2),
      label = _ref24[0],
      value = _ref24[1];
    return "<article class=\"stat-card\"><span>".concat(label, "</span><strong>").concat(fmt(value), "</strong></article>");
  }).join('');
}
function buildAiSummaryStats() {
  var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : allOrders();
  var openOrders = list.filter(function (order) {
    return !['completed', 'closed'].includes(order.status);
  });
  var pendingReports = reportOutbox.filter(function (item) {
    return ['pending', 'failed'].includes(item.status);
  });
  return {
    ordersCount: list.length,
    openOrdersCount: openOrders.length,
    pendingOrdersCount: list.filter(function (order) {
      return order.status === 'pending';
    }).length,
    inProgressOrdersCount: list.filter(function (order) {
      return order.status === 'in-progress';
    }).length,
    completedOrdersCount: list.filter(function (order) {
      return order.status === 'completed';
    }).length,
    closedOrdersCount: list.filter(function (order) {
      return order.status === 'closed';
    }).length,
    totalRawOrdered: roundNumber(list.reduce(function (total, order) {
      return total + Number(order.totalRawOrdered || 0);
    }, 0)),
    totalSentToDyehouse: roundNumber(list.reduce(function (total, order) {
      return total + Number(order.totalSentToDyehouse || 0);
    }, 0)),
    totalFinishedReceived: roundNumber(list.reduce(function (total, order) {
      return total + Number(order.totalFinishedReceived || 0);
    }, 0)),
    totalRemainingAtDyehouse: roundNumber(list.reduce(function (total, order) {
      return total + Number(order.rawAtDyehouseAvailable || 0);
    }, 0)),
    totalWarehouseBalance: roundNumber(list.reduce(function (total, order) {
      return total + Number(order.warehouseBalance || 0);
    }, 0)),
    totalDeliveredToCustomer: roundNumber(list.reduce(function (total, order) {
      return total + Number(order.totalDeliveredToCustomer || 0);
    }, 0)),
    finalWasteOnClosedOrders: roundNumber(list.filter(function (order) {
      return ['completed', 'closed'].includes(order.status);
    }).reduce(function (total, order) {
      return total + Number(order.totalWaste || 0);
    }, 0)),
    reportsNeedAttention: pendingReports.length
  };
}
function collectAiReportPayload() {
  var calculatedOrders = allOrders().map(function (order) {
    return _objectSpread(_objectSpread({}, order), {}, {
      rawNoteNumbers: rawBatches.filter(function (batch) {
        return batch.orderId === order.id;
      }).map(function (batch) {
        return batch.noteNumber;
      }).filter(Boolean)
    });
  });
  return {
    orders: calculatedOrders,
    weavingOrders: orders,
    dyeingPlans: allocations,
    batches: {
      rawBatches: rawBatches,
      productionBatches: productionBatches,
      customerBatches: customerBatches,
      accessoryBatches: accessoryBatches,
      rawReturns: rawReturns,
      dyehouseTransfers: dyehouseTransfers
    },
    reportOutbox: reportOutbox,
    summaryStats: buildAiSummaryStats(calculatedOrders)
  };
}
function asListHtml(items) {
  var rows = Array.isArray(items) ? items : [];
  return rows.length ? "<ul>".concat(rows.map(function (item) {
    return "<li>".concat(item, "</li>");
  }).join(''), "</ul>") : '<p class="empty-state">لا توجد بيانات كافية للعرض.</p>';
}
function renderAiAnalysis(result) {
  var safe = result || {};
  refs.aiAnalysisBody.innerHTML = "<section class=\"ai-result-section\"><h3>\u0627\u0644\u0645\u0644\u062E\u0635 \u0627\u0644\u062A\u0646\u0641\u064A\u0630\u064A</h3><p>".concat(safe.executiveSummary || '-', "</p></section><section class=\"ai-result-section\"><h3>\u0623\u0647\u0645 \u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A</h3>").concat(asListHtml(safe.keyFindings), "</section><section class=\"ai-result-section\"><h3>\u0627\u0644\u0645\u062E\u0627\u0637\u0631</h3>").concat(asListHtml(safe.risks), "</section><section class=\"ai-result-section\"><h3>\u0627\u0644\u062A\u0648\u0635\u064A\u0627\u062A</h3>").concat(asListHtml(safe.recommendations), "</section><section class=\"ai-result-section\"><h3>\u0631\u0633\u0627\u0644\u0629 \u0648\u0627\u062A\u0633\u0627\u0628 \u0644\u0644\u0625\u062F\u0627\u0631\u0629</h3><div class=\"ai-whatsapp-message\" id=\"aiWhatsappMessage\">").concat(safe.whatsappMessage || '-', "</div></section>");
  refs.aiAnalysisDialog.showModal();
}
function analyzeReportWithAi() {
  return _analyzeReportWithAi.apply(this, arguments);
}
function _analyzeReportWithAi() {
  _analyzeReportWithAi = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee54() {
    var oldText, response, data, message, _t24;
    return _regenerator().w(function (_context54) {
      while (1) switch (_context54.p = _context54.n) {
        case 0:
          if (refs.analyzeReportBtn) {
            _context54.n = 1;
            break;
          }
          return _context54.a(2);
        case 1:
          oldText = refs.analyzeReportBtn.textContent;
          refs.analyzeReportBtn.disabled = true;
          refs.analyzeReportBtn.textContent = 'جاري التحليل...';
          if (refs.aiStatusText) refs.aiStatusText.textContent = 'جاري إرسال بيانات التشغيل إلى مساعد 2B الذكي.';
          _context54.p = 2;
          _context54.n = 3;
          return fetch("".concat(AI_SERVICE_URL, "/api/ai/analyze-report"), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(collectAiReportPayload())
          });
        case 3:
          response = _context54.v;
          _context54.n = 4;
          return response.json()["catch"](function () {
            return {};
          });
        case 4:
          data = _context54.v;
          if (response.ok) {
            _context54.n = 6;
            break;
          }
          if (!(data.error === 'MISSING_OPENAI_API_KEY')) {
            _context54.n = 5;
            break;
          }
          throw new Error('لم يتم ضبط مفتاح OpenAI API داخل السيرفر');
        case 5:
          throw new Error(data.message || 'تعذر تحليل التقرير من خدمة مساعد 2B الذكي');
        case 6:
          renderAiAnalysis(data);
          if (refs.aiStatusText) refs.aiStatusText.textContent = 'تم تحليل التقرير بواسطة خدمة OpenAI.';
          _context54.n = 8;
          break;
        case 7:
          _context54.p = 7;
          _t24 = _context54.v;
          message = _t24.message === 'لم يتم ضبط مفتاح OpenAI API داخل السيرفر' ? _t24.message : _t24.message || 'خدمة مساعد 2B الذكي غير متصلة حاليًا';
          if (refs.aiStatusText) refs.aiStatusText.textContent = message;
          refs.aiAnalysisBody.innerHTML = "<div class=\"empty-state\">".concat(message, "</div>");
          refs.aiAnalysisDialog.showModal();
        case 8:
          _context54.p = 8;
          refs.analyzeReportBtn.disabled = false;
          refs.analyzeReportBtn.textContent = oldText;
          return _context54.f(8);
        case 9:
          return _context54.a(2);
      }
    }, _callee54, null, [[2, 7, 8, 9]]);
  }));
  return _analyzeReportWithAi.apply(this, arguments);
}
function copyAiWhatsappMessage() {
  return _copyAiWhatsappMessage.apply(this, arguments);
}
function _copyAiWhatsappMessage() {
  _copyAiWhatsappMessage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee55() {
    var _document$getElementB10;
    var text, area, _t25;
    return _regenerator().w(function (_context55) {
      while (1) switch (_context55.p = _context55.n) {
        case 0:
          text = ((_document$getElementB10 = document.getElementById('aiWhatsappMessage')) === null || _document$getElementB10 === void 0 || (_document$getElementB10 = _document$getElementB10.textContent) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.trim()) || '';
          if (!(!text || text === '-')) {
            _context55.n = 1;
            break;
          }
          alert('لا توجد رسالة جاهزة للنسخ.');
          return _context55.a(2);
        case 1:
          _context55.p = 1;
          _context55.n = 2;
          return navigator.clipboard.writeText(text);
        case 2:
          alert('تم نسخ الرسالة.');
          _context55.n = 4;
          break;
        case 3:
          _context55.p = 3;
          _t25 = _context55.v;
          area = document.createElement('textarea');
          area.value = text;
          document.body.appendChild(area);
          area.select();
          document.execCommand('copy');
          area.remove();
          alert('  .');
        case 4:
          return _context55.a(2);
      }
    }, _callee55, null, [[1, 3]]);
  }));
  return _copyAiWhatsappMessage.apply(this, arguments);
}
function renderOrders() {
  var list = filteredOrders();
  renderStats(list);
  refs.ordersTableBody.innerHTML = list.map(function (order) {
    return "<tr><td data-label=\"\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628\">".concat(order.orderNumber, "</td><td data-label=\"\u0627\u0644\u0639\u0645\u064A\u0644\">").concat(order.customer, "</td><td data-label=\"\u0627\u0644\u0635\u0646\u0641\">").concat(order.fabricType, "</td><td data-label=\"\u062E\u0627\u0645 \u0645\u0637\u0644\u0648\u0628\">").concat(order.totalRawOrdered, "</td><td data-label=\"\u062E\u0627\u0645 \u0645\u0633\u062A\u0644\u0645\">").concat(order.totalRawReceived, "</td><td data-label=\"\u0645\u0631\u0633\u0644 \u0644\u0644\u0645\u0635\u0628\u063A\u0629\">").concat(order.totalSentToDyehouse, "</td><td data-label=\"\u0645\u062C\u0647\u0632 \u0645\u0633\u062A\u0644\u0645\">").concat(order.totalFinishedReceived, "</td><td data-label=\"\u0627\u0644\u0647\u0627\u0644\u0643\">").concat(formatNumber(order.totalWastePercent || 0, 1), "%</td><td data-label=\"\u0627\u0644\u062D\u0627\u0644\u0629\"><span class=\"status ").concat(order.status, "\">").concat(statusLabel(order.status), "</span></td><td data-label=\"\u0625\u062C\u0631\u0627\u0621\u0627\u062A\"><div class=\"batch-actions\"><button class=\"mini-btn\" data-view=\"").concat(order.id, "\">\u0639\u0631\u0636</button><button class=\"mini-btn\" data-edit-order=\"").concat(order.id, "\">\u062A\u0639\u062F\u064A\u0644</button><button class=\"mini-btn danger\" data-delete-order=\"").concat(order.id, "\">\u062D\u0630\u0641</button></div></td></tr>");
  }).join('');
}
function documentFooter() {
  var printedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
  return "<div class=\"document-footer\"><span>".concat(printedAt, "</span><strong>Manager : Ibrahim Assem</strong></div>");
}
function withDocumentFooter(body) {
  if (body.includes('sticker-sheet') || body.includes('document-footer')) return body;
  return "".concat(body).concat(documentFooter());
}
function updateRawMovementVisibility(form) {
  var _form$elements$moveme;
  if (!form) return;
  var isReturn = ((_form$elements$moveme = form.elements.movementKind) === null || _form$elements$moveme === void 0 ? void 0 : _form$elements$moveme.value) === 'return';
  form.querySelectorAll('[data-return-only]').forEach(function (field) {
    return field.classList.toggle('field-hidden', !isReturn);
  });
  form.querySelectorAll('[data-out-only]').forEach(function (field) {
    return field.classList.toggle('field-hidden', isReturn);
  });
}
function accessoryTypeSelectHtml(order) {
  var options = ((order === null || order === void 0 ? void 0 : order.accessoryLines) || []).map(function (line) {
    return "<option value=\"".concat(line.type, "\">").concat(line.type, "</option>");
  }).join('');
  return "<select name=\"accessoryType\" required><option value=\"\">\u0627\u062E\u062A\u0631 \u0646\u0648\u0639 \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631</option>".concat(options, "</select>");
}
function accessoryTypesLabel(order) {
  var names = uniqueNonEmpty(((order === null || order === void 0 ? void 0 : order.accessoryLines) || []).map(function (line) {
    return line.type;
  }));
  return names.length ? names.join(' + ') : 'إكسسوار';
}
function accessoryDocumentSection(order, fmt, safe) {
  var lines = Array.isArray(order === null || order === void 0 ? void 0 : order.accessoryLines) ? order.accessoryLines : [];
  var hasAccessory = lines.length || Number((order === null || order === void 0 ? void 0 : order.accessoryRequired) || 0) || Number((order === null || order === void 0 ? void 0 : order.accessorySent) || 0) || Number((order === null || order === void 0 ? void 0 : order.accessoryReceived) || 0) || Number((order === null || order === void 0 ? void 0 : order.accessoryDelivered) || 0);
  if (!hasAccessory) return '';
  var rows = (lines.length ? lines : [{
    type: 'إكسسوار',
    percent: (order === null || order === void 0 ? void 0 : order.accessoryPercent) || 0,
    quantity: (order === null || order === void 0 ? void 0 : order.accessoryRequired) || 0
  }]).map(function (line) {
    return "<tr><td>".concat(safe(line.type || 'إكسسوار'), "</td><td>").concat(formatNumber(Number(line.percent || 0)), "%</td><td>").concat(fmt(line.quantity || line.quantityManual || 0), "</td></tr>");
  }).join('');
  var wasteText = order !== null && order !== void 0 && order.operationClosed ? "".concat(fmt(order.accessoryWaste || 0), " (").concat(formatNumber(order.accessoryWastePercent || 0, 1), "%)") : 'يظهر بعد إغلاق الدورة';
  return "<section class=\"report-section\"><h3>\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631</h3><table class=\"summary-table\"><tbody><tr><th>\u0625\u0643\u0633\u0633\u0648\u0627\u0631 \u0645\u0637\u0644\u0648\u0628</th><td>".concat(fmt(order.accessoryRequired || 0), "</td><th>\u0625\u0643\u0633\u0633\u0648\u0627\u0631 \u0645\u0631\u0633\u0644</th><td>").concat(fmt(order.accessorySent || 0), "</td></tr><tr><th>\u0625\u0643\u0633\u0633\u0648\u0627\u0631 \u0645\u0633\u062A\u0644\u0645</th><td>").concat(fmt(order.accessoryReceived || 0), "</td><th>\u0625\u0643\u0633\u0633\u0648\u0627\u0631 \u0645\u0633\u0644\u0645 \u0644\u0644\u0639\u0645\u064A\u0644</th><td>").concat(fmt(order.accessoryDelivered || 0), "</td></tr><tr><th>\u0631\u0635\u064A\u062F \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631</th><td>").concat(fmt(order.accessoryBalance || 0), "</td><th>\u0647\u0627\u0644\u0643 \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631</th><td>").concat(wasteText, "</td></tr></tbody></table><table class=\"summary-table\"><thead><tr><th>\u0646\u0648\u0639 \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631</th><th>\u0627\u0644\u0646\u0633\u0628\u0629</th><th>\u0627\u0644\u0643\u0645\u064A\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629</th></tr></thead><tbody>").concat(rows, "</tbody></table></section>");
}
function updateCustomerDeliveryFields(form) {
  var _form$elements$moveme2;
  if (!form) return;
  var isAccessory = ((_form$elements$moveme2 = form.elements.movementKind) === null || _form$elements$moveme2 === void 0 ? void 0 : _form$elements$moveme2.value) === 'accessory';
  form.querySelectorAll('[data-accessory-only]').forEach(function (field) {
    return field.classList.toggle('field-hidden', !isAccessory);
  });
}
function repairOrderDetailsArabic(order) {
  var root = refs.orderDetailsPanel;
  if (!root || !order) return;
  var isBadText = isLegacyRecoveredText;
  var setText = function setText(selector, text) {
    var element = root.querySelector(selector);
    if (element) element.textContent = text;
  };
  var setPlaceholder = function setPlaceholder(selector, text) {
    root.querySelectorAll(selector).forEach(function (element) {
      element.placeholder = text;
    });
  };
  setText('#editOrderBtn', 'تعديل الطلب');
  setText('#toggleOperationClosedBtn', order.operationClosed ? 'إعادة فتح التشغيل' : 'إغلاق دورة التشغيل');
  setText('#addAllocationBtn', '+ إضافة لون');
  root.querySelectorAll('.batch-box h3').forEach(function (title) {
    var _title$closest;
    var form = (_title$closest = title.closest('.batch-box')) === null || _title$closest === void 0 || (_title$closest = _title$closest.querySelector('.batch-form')) === null || _title$closest === void 0 ? void 0 : _title$closest.dataset.form;
    var labels = {
      raw: 'خروج خام',
      accessory: 'خروج إكسسوار',
      accessoryReceived: 'استلام إكسسوار',
      production: 'استلام مجهز',
      customer: 'تسليم عميل'
    };
    if (labels[form]) title.textContent = labels[form];
  });
  var rawForm = root.querySelector('form[data-form="raw"]');
  if (rawForm) {
    var _rawForm$querySelecto, _rawForm$querySelecto2;
    rawForm.elements.movementKind.options[0].textContent = 'خروج خام للمصبغة';
    rawForm.elements.movementKind.options[1].textContent = 'ارتجاع خام للنسيج';
    (_rawForm$querySelecto = rawForm.querySelector('[name="widthLineId"] option')) === null || _rawForm$querySelecto === void 0 || _rawForm$querySelecto.replaceChildren(document.createTextNode('اختر العرض عند خروج الخام'));
    (_rawForm$querySelecto2 = rawForm.querySelector('[name="allocationId"] option')) === null || _rawForm$querySelecto2 === void 0 || _rawForm$querySelecto2.replaceChildren(document.createTextNode('اختر اللون / المصبغة للمرتجع'));
    var fileLabel = rawForm.querySelector('.batch-file-label span');
    if (fileLabel) fileLabel.textContent = 'صورة إذن الخام';
    rawForm.querySelector('button') && (rawForm.querySelector('button').textContent = 'إضافة حركة');
  }
  root.querySelectorAll('select[name="widthLineId"] option').forEach(function (option) {
    var line = (order.widthLines || []).find(function (item) {
      return item.id === option.value;
    });
    if (line) option.textContent = "\u0628\u0648\u0635\u0629 ".concat(line.inch, " \u2014 \u0639\u0631\u0636 ").concat(line.width, " \u2014 \u0645\u0637\u0644\u0648\u0628 ").concat(line.quantity);
  });
  root.querySelectorAll('form[data-form="accessory"] button, form[data-form="accessoryReceived"] button').forEach(function (button) {
    return button.textContent = 'إضافة';
  });
  root.querySelector('form[data-form="production"] button') && (root.querySelector('form[data-form="production"] button').textContent = 'إضافة استلام');
  root.querySelector('form[data-form="customer"] button') && (root.querySelector('form[data-form="customer"] button').textContent = 'إضافة حركة');
  var customerForm = root.querySelector('form[data-form="customer"]');
  if (customerForm !== null && customerForm !== void 0 && customerForm.elements.movementKind) {
    customerForm.elements.movementKind.options[0].textContent = 'تسليم قماش';
    if (customerForm.elements.movementKind.options[1]) customerForm.elements.movementKind.options[1].textContent = 'تسليم إكسسوار';
  }
  setPlaceholder('input[name="quantity"]', 'الكمية');
  setPlaceholder('form[data-form="production"] input[name="quantity"], form[data-form="accessoryReceived"] input[name="quantity"]', 'الكمية المستلمة');
  setPlaceholder('input[name="supplier"]', 'مصدر النسيج');
  setPlaceholder('input[name="noteNumber"]', 'رقم الإذن');
  setPlaceholder('input[name="notes"]', 'ملاحظات');
  root.querySelectorAll('.summary-grid .metric span').forEach(function (span, index) {
    var labels = ['إجمالي الخام المطلوب', 'خرج من النسيج إلى المصبغة', 'خام متاح بالمصبغة', 'دخل المخزن من المصبغة', 'رصيد المخزن', 'تم تسليمه للعميل', 'مرتجع خام للنسيج', 'هالك تقديري', 'هالك فعلي'];
    if (labels[index]) span.textContent = labels[index];
  });
  root.querySelectorAll('th').forEach(function (th) {
    if (!isBadText(th.textContent)) return;
    var row = _toConsumableArray(th.parentElement.children);
    var index = row.indexOf(th);
    var fixed = {
      0: 'البوصة',
      1: 'العرض',
      2: 'الكمية',
      7: 'هالك تقديري',
      8: 'هالك تقديري',
      9: 'هالك فعلي',
      10: 'إجراءات'
    }[index];
    if (fixed) th.textContent = fixed;
  });
  root.querySelectorAll('.batch-list .empty-state').forEach(function (item) {
    if (isBadText(item.textContent)) item.textContent = 'لا توجد دفعات بعد.';
  });
  root.querySelectorAll('.batch-list .batch-item span').forEach(function (span) {
    var text = span.textContent;
    text = text.replace(/\?+/g, '').replace(/\uFFFD/g, '').replace(/ï؟½/g, '').replace(/\s+/g, ' ').trim();
    if (text.includes('202') && !text.includes('خروج خام')) text = "\u062E\u0631\u0648\u062C \u062E\u0627\u0645 - ".concat(text);
    text = text.replace(/(\d+)\s*-\s*(\d+)$/, 'بوصة $1 - عرض $2');
    span.textContent = text;
  });
  var sendStatus = root.querySelector('.report-send-status');
  if (sendStatus) {
    var title = sendStatus.querySelector('h3');
    var hint = sendStatus.querySelector('.eyebrow');
    if (title) title.textContent = 'حالة مشاركة التقارير';
    if (hint) hint.textContent = 'المشاركة تتم عبر خدمة واتساب عند تشغيلها.';
  }
  root.querySelectorAll('h3').forEach(function (title) {
    if (isBadText(title.textContent)) title.textContent = 'رصيد المخزن الحالي';
  });
  root.querySelectorAll('.subsection .eyebrow').forEach(function (hint) {
    if (isBadText(hint.textContent)) hint.textContent = 'رصيد المخزن حسب التشغيل والتسليم';
  });
  root.querySelectorAll('th').forEach(function (th) {
    if (!isBadText(th.textContent)) return;
    var row = _toConsumableArray(th.parentElement.children);
    var index = row.indexOf(th);
    var fixed = index === 3 ? 'دخل المخزن' : index === 4 ? 'الرصيد الحالي' : 'ملاحظات';
    th.textContent = fixed;
  });
}
function canvasToPngBlob(canvas) {
  return new Promise(function (resolve, reject) {
    return canvas.toBlob(function (blob) {
      return blob ? resolve(blob) : reject(new Error('png-create-failed'));
    }, 'image/png');
  });
}
function reportToPngBlob() {
  return _reportToPngBlob.apply(this, arguments);
}
function _reportToPngBlob() {
  _reportToPngBlob = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee56() {
    var canvas;
    return _regenerator().w(function (_context56) {
      while (1) switch (_context56.n) {
        case 0:
          _context56.n = 1;
          return reportToCanvas({
            scale: 3
          });
        case 1:
          canvas = _context56.v;
          _context56.n = 2;
          return canvasToPngBlob(canvas);
        case 2:
          return _context56.a(2, _context56.v);
      }
    }, _callee56);
  }));
  return _reportToPngBlob.apply(this, arguments);
}
function orderDetailsHasActiveDraft() {
  var _active$closest, _refs$orderDetailsPan;
  var active = document.activeElement;
  if (active !== null && active !== void 0 && (_active$closest = active.closest) !== null && _active$closest !== void 0 && _active$closest.call(active, '#orderDetailsPanel .batch-form')) return true;
  return !!((_refs$orderDetailsPan = refs.orderDetailsPanel) !== null && _refs$orderDetailsPan !== void 0 && _refs$orderDetailsPan.querySelector('.batch-form[data-dirty="true"]'));
}
function renderDocuments() {
  refs.documentsPanel.innerHTML = "<button class=\"mini-btn gold\" data-doc=\"quotation\">\u0625\u0646\u0634\u0627\u0621 \u0639\u0631\u0636 \u0633\u0639\u0631</button><button class=\"mini-btn gold\" data-doc=\"weaving\">\u0625\u0646\u0634\u0627\u0621 \u0623\u0645\u0631 \u0646\u0633\u064A\u062C</button><button class=\"mini-btn gold\" data-doc=\"dyeing\">\u0625\u0646\u0634\u0627\u0621 \u0623\u0645\u0631 \u0635\u0628\u0627\u063A\u0629</button><button class=\"mini-btn gold\" data-doc=\"labSamples\">\u0639\u064A\u0646\u0627\u062A \u0645\u0639\u0645\u0644</button><button class=\"mini-btn\" data-doc=\"waste\">\u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u0647\u0627\u0644\u0643</button><button class=\"mini-btn gold\" data-doc=\"fullreport\">\u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u0637\u0644\u0628 \u0627\u0644\u0643\u0627\u0645\u0644</button><button class=\"mini-btn gold\" data-doc=\"stickers\">\u0637\u0628\u0627\u0639\u0629 \u0627\u0633\u062A\u064A\u0643\u0631\u0627\u062A \u0627\u0644\u062A\u0634\u063A\u064A\u0644</button><button class=\"mini-btn\" data-doc=\"print\">\u0637\u0628\u0627\u0639\u0629</button><button class=\"mini-btn\" disabled>\u062A\u0635\u062F\u064A\u0631 PDF \u0644\u0627\u062D\u0642\u064B\u0627</button>";
}
function batchItemHtml(type, batch, label) {
  return "<div class=\"batch-item\"><span>".concat(label, "</span><div class=\"batch-actions\"><button class=\"mini-btn\" data-batch-action=\"edit\" data-batch-type=\"").concat(type, "\" data-batch-id=\"").concat(batch.id, "\">\u062A\u0639\u062F\u064A\u0644</button><button class=\"mini-btn danger\" data-batch-action=\"delete\" data-batch-type=\"").concat(type, "\" data-batch-id=\"").concat(batch.id, "\">\u062D\u0630\u0641</button></div></div>");
}
function listHtml(items, formatter) {
  var rows = Array.isArray(items) ? items : [];
  return rows.length ? rows.map(formatter).join('') : "<div class=\"empty-state\">\u0644\u0627 \u062A\u0648\u062C\u062F \u062F\u0641\u0639\u0627\u062A \u0628\u0639\u062F.</div>";
}
function allocationWidthSuffix(order, allocation) {
  if (!order || !allocation || order.widthMode !== 'multiple') return '';
  var widthLine = (order.widthLines || []).find(function (item) {
    return item.id === allocation.widthLineId;
  }) || {};
  var inch = allocation.rawInch || widthLine.inch || '-';
  var width = allocation.rawWidth || allocation.targetFinishedWidth || widthLine.width || '-';
  var finishedWeight = allocation.targetFinishedWeight || allocation.finishedWeight || '';
  return " / \u0628\u0648\u0635\u0629 ".concat(inch, " - \u0639\u0631\u0636 ").concat(width).concat(finishedWeight ? " - \u0648\u0632\u0646 ".concat(finishedWeight) : '');
}
function allocationAvailableToCustomer(allocation) {
  return roundNumber(Math.max(Number((allocation === null || allocation === void 0 ? void 0 : allocation.finishedReceived) || 0) - Number((allocation === null || allocation === void 0 ? void 0 : allocation.deliveredToCustomer) || 0), 0));
}
function allocationOptionLabel(order, allocation) {
  if (!allocation) return '-';
  return "".concat(allocation.color || '-', " / ").concat(allocation.dyehouse || '-').concat(allocationWidthSuffix(order, allocation));
}
function allocationColorLabel(order, allocation) {
  if (!allocation) return '-';
  return allocationOptionLabel(order, allocation);
}
function customerDeliveryAllocationLabel(order, allocation) {
  if (!allocation) return '-';
  return "".concat(allocationOptionLabel(order, allocation), " / \u0645\u062A\u0627\u062D ").concat(formatNumber(allocationAvailableToCustomer(allocation)));
}
function movementLine() {
  for (var _len = arguments.length, parts = new Array(_len), _key = 0; _key < _len; _key++) {
    parts[_key] = arguments[_key];
  }
  return parts.map(function (part) {
    return String(part !== null && part !== void 0 ? part : '').trim();
  }).filter(Boolean).join(' - ');
}
function noteSuffix(batch) {
  return batch !== null && batch !== void 0 && batch.noteNumber ? " / \u0631\u0642\u0645 \u0625\u0630\u0646 ".concat(batch.noteNumber) : '';
}
function renderDetails() {
  ensureRuntimeCollections();
  if (!refs.orderDetailsPanel) return;
  var baseOrder = orders.find(function (order) {
    return order.id === selectedOrderId;
  });
  if (!baseOrder) return;
  var order = calculateOrder(baseOrder);
  order.allocations = Array.isArray(order.allocations) ? order.allocations : [];
  order.widthLines = Array.isArray(order.widthLines) ? order.widthLines : [];
  order.accessoryLines = Array.isArray(order.accessoryLines) ? order.accessoryLines : [];
  var allocationPercent = order.totalRawReceived ? Math.min(order.totalAllocated / order.totalRawReceived * 100, 100) : 0;
  var rawItems = function () {
    var outgoing = rawBatches.filter(function (batch) {
      return batch.orderId === order.id;
    }).map(function (batch) {
      var widthLine = order.widthLines.find(function (item) {
        return item.id === batch.widthLineId;
      });
      var widthLabel = widthLine ? "\u0628\u0648\u0635\u0629 ".concat(widthLine.inch, " / \u0639\u0631\u0636 ").concat(widthLine.width) : '';
      return {
        type: 'raw',
        batch: batch,
        label: movementLine('خروج خام للمصبغة', batch.date, batch.quantity, batch.supplier || '-', widthLabel) + noteSuffix(batch)
      };
    });
    var returns = rawReturns.filter(function (batch) {
      return order.allocations.some(function (allocation) {
        return allocation.id === batch.allocationId;
      });
    }).map(function (batch) {
      var allocation = order.allocations.find(function (item) {
        return item.id === batch.allocationId;
      });
      return {
        type: 'rawReturn',
        batch: batch,
        label: movementLine('مرتجع خام للنسيج', batch.date, (allocation === null || allocation === void 0 ? void 0 : allocation.dyehouse) || '-', (allocation === null || allocation === void 0 ? void 0 : allocation.color) || '-', batch.quantity) + noteSuffix(batch)
      };
    });
    var rows = outgoing.concat(returns).sort(function (a, b) {
      return String(b.batch.date || '').localeCompare(String(a.batch.date || ''));
    });
    return rows.length ? rows.map(function (item) {
      return batchItemHtml(item.type, item.batch, item.label);
    }).join('') : '<div class="empty-state">لا توجد دفعات بعد.</div>';
  }();
  var accessoryColor = function accessoryColor(batch) {
    var _order$allocations$fi;
    return ((_order$allocations$fi = order.allocations.find(function (item) {
      return item.id === batch.allocationId;
    })) === null || _order$allocations$fi === void 0 ? void 0 : _order$allocations$fi.color) || batch.color || '-';
  };
  var accessoryTypeOptions = order.accessoryLines.map(function (line) {
    return "<option value=\"".concat(line.type, "\">").concat(line.type, "</option>");
  }).join('');
  var accessoryTypeSelect = "<select name=\"accessoryType\" required><option value=\"\">\u0627\u062E\u062A\u0631 \u0646\u0648\u0639 \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631</option>".concat(accessoryTypeOptions, "</select>");
  var accessoryItems = listHtml(accessoryBatches.filter(function (batch) {
    return batch.orderId === order.id && batch.movement === 'sent';
  }), function (batch) {
    var _order$accessoryLines;
    return batchItemHtml('accessory', batch, movementLine('خروج إكسسوار', batch.date, batch.quantity, batch.accessoryType || ((_order$accessoryLines = order.accessoryLines[0]) === null || _order$accessoryLines === void 0 ? void 0 : _order$accessoryLines.type) || 'إكسسوار') + noteSuffix(batch));
  });
  var accessoryReceivedItems = listHtml(accessoryBatches.filter(function (batch) {
    return batch.orderId === order.id && batch.movement === 'received';
  }), function (batch) {
    return batchItemHtml('accessory', batch, movementLine('استلام إكسسوار', batch.date, accessoryColor(batch), batch.quantity, batch.accessoryType || 'إكسسوار') + noteSuffix(batch));
  });
  var productionItems = listHtml(productionBatches.filter(function (batch) {
    return order.allocations.some(function (allocation) {
      return allocation.id === batch.allocationId;
    });
  }), function (batch) {
    var allocation = order.allocations.find(function (item) {
      return item.id === batch.allocationId;
    });
    return batchItemHtml('production', batch, movementLine('استلام مجهز', batch.date, (allocation === null || allocation === void 0 ? void 0 : allocation.dyehouse) || '-', (allocation === null || allocation === void 0 ? void 0 : allocation.color) || '-', batch.quantity) + noteSuffix(batch));
  });
  var customerItems = function () {
    var cloth = customerBatches.filter(function (batch) {
      return order.allocations.some(function (allocation) {
        return allocation.id === batch.allocationId;
      });
    }).map(function (batch) {
      var allocation = order.allocations.find(function (item) {
        return item.id === batch.allocationId;
      });
      var label = allocation ? allocationColorLabel(order, allocation) : '-';
      return {
        type: 'customer',
        batch: batch,
        label: movementLine('تسليم قماش للعميل', batch.date, label, batch.quantity)
      };
    });
    var accessories = accessoryBatches.filter(function (batch) {
      return batch.orderId === order.id && batch.movement === 'customer';
    }).map(function (batch) {
      var _order$accessoryLines2;
      var allocation = order.allocations.find(function (item) {
        return item.id === batch.allocationId;
      });
      var label = allocation ? allocationColorLabel(order, allocation) : accessoryColor(batch);
      return {
        type: 'accessory',
        batch: batch,
        label: movementLine('تسليم إكسسوار للعميل', batch.date, label, batch.quantity, batch.accessoryType || ((_order$accessoryLines2 = order.accessoryLines[0]) === null || _order$accessoryLines2 === void 0 ? void 0 : _order$accessoryLines2.type) || 'إكسسوار') + noteSuffix(batch)
      };
    });
    var rows = cloth.concat(accessories).sort(function (a, b) {
      return String(b.batch.date || '').localeCompare(String(a.batch.date || ''));
    });
    return rows.length ? rows.map(function (item) {
      return batchItemHtml(item.type, item.batch, item.label);
    }).join('') : '<div class="empty-state">لا توجد دفعات بعد.</div>';
  }();
  var transferItems = listHtml(dyehouseTransfers.filter(function (batch) {
    return batch.orderId === order.id;
  }), function (batch) {
    return batchItemHtml('transfer', batch, movementLine('تحويل مصبغة', batch.date, batch.color || '-', batch.fromDyehouse || '-', batch.toDyehouse || '-', batch.quantity) + noteSuffix(batch));
  });
  var rawReturnItems = listHtml(rawReturns.filter(function (batch) {
    return order.allocations.some(function (allocation) {
      return allocation.id === batch.allocationId;
    });
  }), function (batch) {
    var allocation = order.allocations.find(function (item) {
      return item.id === batch.allocationId;
    });
    return batchItemHtml('rawReturn', batch, movementLine('مرتجع خام للنسيج', batch.date, (allocation === null || allocation === void 0 ? void 0 : allocation.dyehouse) || '-', (allocation === null || allocation === void 0 ? void 0 : allocation.color) || '-', batch.quantity) + noteSuffix(batch));
  });
  var stockRows = order.allocations.map(function (allocation) {
    var delivered = sum(customerBatches.filter(function (batch) {
      return batch.allocationId === allocation.id;
    }));
    var balance = roundNumber(Number(allocation.finishedReceived || 0) - delivered);
    var widthInfo = order.widthMode === 'multiple' ? "\u0628\u0648\u0635\u0629 ".concat(allocation.rawInch || '-', " / \u0639\u0631\u0636 ").concat(allocation.rawWidth || allocation.targetFinishedWidth || '-') : "\u0628\u0648\u0635\u0629 ".concat(order.inchWidth || '-', " / \u0639\u0631\u0636 ").concat(allocation.targetFinishedWidth || '-');
    return "<tr><td>".concat(allocation.color, "</td><td>").concat(widthInfo, "</td><td>").concat(formatNumber(allocation.finishedReceived || 0), "</td><td>").concat(formatNumber(delivered || 0), "</td><td><strong>").concat(formatNumber(balance), "</strong></td></tr>");
  }).join('');
  var accessoryStockRows = order.accessoryLines.length ? order.allocations.flatMap(function (allocation) {
    return order.accessoryLines.map(function (line) {
      var received = sum(accessoryBatches.filter(function (batch) {
        return batch.allocationId === allocation.id && batch.movement === 'received' && (batch.accessoryType || line.type) === line.type;
      }));
      var delivered = sum(accessoryBatches.filter(function (batch) {
        return batch.allocationId === allocation.id && batch.movement === 'customer' && (batch.accessoryType || line.type) === line.type;
      }));
      var balance = roundNumber(received - delivered);
      return "<tr><td>".concat(allocation.color, "</td><td>").concat(line.type, "</td><td>").concat(formatNumber(received || 0), "</td><td>").concat(formatNumber(delivered || 0), "</td><td><strong>").concat(formatNumber(balance), "</strong></td></tr>");
    });
  }).join('') : '';
  var inventorySection = "<div class=\"subsection\"><div class=\"subsection-head\"><div><h3>\u0631\u0635\u064A\u062F \u0627\u0644\u0645\u062E\u0632\u0646 \u0627\u0644\u062D\u0627\u0644\u064A</h3><p class=\"eyebrow\">\u0631\u0635\u064A\u062F \u0627\u0644\u0645\u062E\u0632\u0646 \u062D\u0633\u0628 \u0627\u0644\u062A\u0634\u063A\u064A\u0644 \u0648\u0627\u0644\u062A\u0633\u0644\u064A\u0645</p></div></div><div class=\"table-wrap\"><table class=\"allocation-table\"><thead><tr><th>\u0627\u0644\u0644\u0648\u0646</th><th>\u0627\u0644\u0639\u0631\u0636</th><th>\u062F\u062E\u0644 \u0627\u0644\u0645\u062E\u0632\u0646</th><th>\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0639\u0645\u064A\u0644</th><th>\u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u062D\u0627\u0644\u064A</th></tr></thead><tbody>".concat(stockRows, "</tbody></table></div>").concat(order.accessoryLines.length ? "<div class=\"table-wrap\"><table class=\"allocation-table\"><thead><tr><th>\u0627\u0644\u0644\u0648\u0646</th><th>\u0627\u0644\u0639\u0631\u0636</th><th>\u062F\u062E\u0644 \u0627\u0644\u0645\u062E\u0632\u0646</th><th>\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0639\u0645\u064A\u0644</th><th>\u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u062D\u0627\u0644\u064A</th></tr></thead><tbody>".concat(accessoryStockRows, "</tbody></table></div>") : '', "</div>");
  refs.orderDetailsPanel.innerHTML = "<div class=\"section-head\"><div><p class=\"eyebrow\">".concat(order.orderNumber, "</p><h2>").concat(order.customer, "</h2></div><div class=\"actions\"><button class=\"mini-btn\" id=\"editOrderBtn\">\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0637\u0644\u0628</button><button class=\"mini-btn ").concat(order.operationClosed ? 'gold' : 'danger', "\" id=\"toggleOperationClosedBtn\">").concat(order.operationClosed ? 'إعادة فتح التشغيل' : 'إغلاق دورة التشغيل', "</button><span class=\"status ").concat(order.status, "\">").concat(statusLabel(order.status), "</span></div></div><h3>&#1605;&#1604;&#1582;&#1589; &#1583;&#1608;&#1585;&#1577; &#1575;&#1604;&#1578;&#1588;&#1594;&#1610;&#1604;</h3><div class=\"summary-grid\"><div class=\"metric\"><span>&#1573;&#1580;&#1605;&#1575;&#1604;&#1610; &#1575;&#1604;&#1582;&#1575;&#1605; &#1575;&#1604;&#1605;&#1591;&#1604;&#1608;&#1576;</span><strong>").concat(order.totalRawOrdered, "</strong></div><div class=\"metric\"><span>&#1582;&#1585;&#1580; &#1605;&#1606; &#1575;&#1604;&#1606;&#1587;&#1610;&#1580; &#1573;&#1604;&#1609; &#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</span><strong>").concat(order.totalRawReceived, "</strong></div><div class=\"metric\"><span>&#1582;&#1575;&#1605; &#1605;&#1578;&#1575;&#1581; &#1576;&#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</span><strong>").concat(order.rawAtDyehouseAvailable, "</strong></div><div class=\"metric\"><span>&#1583;&#1582;&#1604; &#1575;&#1604;&#1605;&#1582;&#1586;&#1606; &#1605;&#1606; &#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</span><strong>").concat(order.totalFinishedReceived, "</strong></div><div class=\"metric emphasis\"><span>&#1585;&#1589;&#1610;&#1583; &#1575;&#1604;&#1605;&#1582;&#1586;&#1606;</span><strong>").concat(order.warehouseBalance, "</strong></div><div class=\"metric\"><span>&#1578;&#1605; &#1578;&#1587;&#1604;&#1610;&#1605;&#1607; &#1604;&#1604;&#1593;&#1605;&#1610;&#1604;</span><strong>").concat(order.totalDeliveredToCustomer, "</strong></div><div class=\"metric\"><span>\u0645\u0631\u062A\u062C\u0639 \u062E\u0627\u0645 \u0644\u0644\u0646\u0633\u064A\u062C</span><strong>").concat(order.totalRawReturnedToWeaving, "</strong></div><div class=\"metric\"><span>\u0647\u0627\u0644\u0643 \u062A\u0642\u062F\u064A\u0631\u064A</span><strong>").concat(order.expectedWasteQuantity, " (").concat(order.expectedWastePercent, "%)</strong></div><div class=\"metric\"><span>\u0647\u0627\u0644\u0643 \u0641\u0639\u0644\u064A</span><strong>").concat(order.totalWaste, " (").concat(formatNumber(order.totalWastePercent || 0, 1), "%)</strong></div></div>").concat(order.widthMode === 'multiple' ? "<div class=\"subsection\"><div class=\"subsection-head\"><h3>\u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0639\u0631\u0648\u0636</h3></div>".concat(order.widthDistributionMatches ? '' : "<div class=\"warning\">\u062A\u0646\u0628\u064A\u0647: \u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0639\u0631\u0648\u0636 \u0644\u0627 \u064A\u0637\u0627\u0628\u0642 \u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0637\u0644\u0628</div>", "<div class=\"table-wrap\"><table class=\"allocation-table\"><thead><tr><th>\u0627\u0644\u0628\u0648\u0635\u0629</th><th>\u0627\u0644\u0639\u0631\u0636</th><th>\u0627\u0644\u0643\u0645\u064A\u0629</th></tr></thead><tbody>").concat(order.widthLines.map(function (item) {
    return "<tr><td>".concat(item.inch, "</td><td>").concat(item.width, "</td><td>").concat(item.quantity, "</td></tr>");
  }).join(''), "</tbody></table></div></div>") : '', "<div class=\"subsection\"><div class=\"subsection-head\"><div><h3>&#1582;&#1591;&#1577; &#1578;&#1608;&#1586;&#1610;&#1593; &#1575;&#1604;&#1571;&#1604;&#1608;&#1575;&#1606;</h3><p class=\"eyebrow\">").concat(order.totalAllocated, " / ").concat(order.totalRawReceived, " &#1603;&#1580;&#1605; &#1605;&#1606; &#1575;&#1604;&#1582;&#1575;&#1605; &#1575;&#1604;&#1605;&#1587;&#1578;&#1604;&#1605;</p></div><button class=\"mini-btn\" id=\"addAllocationBtn\">+ &#1573;&#1590;&#1575;&#1601;&#1577; &#1604;&#1608;&#1606;</button></div><div class=\"allocation-bar\"><div class=\"allocation-fill\" style=\"width:").concat(allocationPercent, "%\"></div></div>").concat(order.allocationExceedsRaw ? "<div class=\"warning\">&#1603;&#1605;&#1610;&#1577; &#1575;&#1604;&#1589;&#1576;&#1575;&#1594;&#1577; &#1575;&#1604;&#1605;&#1582;&#1591;&#1591;&#1577; &#1571;&#1603;&#1576;&#1585; &#1605;&#1606; &#1603;&#1605;&#1610;&#1577; &#1575;&#1604;&#1582;&#1575;&#1605; &#1575;&#1604;&#1605;&#1578;&#1575;&#1581;&#1577;</div>" : '', "<div class=\"table-wrap\"><table class=\"allocation-table\"><thead><tr><th>&#1575;&#1604;&#1604;&#1608;&#1606;</th><th>&#1575;&#1604;&#1605;&#1582;&#1591;&#1591;</th><th>&#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</th><th>&#1575;&#1604;&#1593;&#1585;&#1590;</th><th>&#1575;&#1604;&#1608;&#1586;&#1606; &#1605;&#1580;&#1607;&#1586;</th>").concat(order.accessoryLines.length ? "<th>".concat(accessoryTypesLabel(order), "</th>") : '', "<th>&#1578;&#1605; &#1578;&#1588;&#1594;&#1610;&#1604;&#1607;</th><th>&#1583;&#1582;&#1604; &#1575;&#1604;&#1605;&#1582;&#1586;&#1606;</th><th>\u0647\u0627\u0644\u0643 \u062A\u0642\u062F\u064A\u0631\u064A</th><th>\u0647\u0627\u0644\u0643 \u0641\u0639\u0644\u064A</th><th>\u0625\u062C\u0631\u0627\u0621</th></tr></thead><tbody>").concat(order.allocations.map(function (allocation) {
    return "<tr><td>".concat(allocation.color, "</td><td>").concat(allocation.plannedQuantity, "</td><td>").concat(allocation.dyehouse, "</td><td>").concat(allocation.targetFinishedWidth, "</td><td>").concat(allocation.targetFinishedWeight, "</td>").concat(order.accessoryLines.length ? "<td>".concat(allocation.accessoryQuantity, "</td>") : '', "<td>").concat(allocation.sentToDyehouse, "</td><td>").concat(allocation.finishedReceived, "</td><td>").concat(allocation.expectedWasteQuantity || 0, " (").concat(allocation.expectedWastePercent || 0, "%)</td><td>").concat(allocation.wasteQuantity, " (").concat(formatNumber(allocation.wastePercent || 0, 1), "%)</td><td><div class=\"batch-actions\"><button class=\"mini-btn\" data-edit-allocation=\"").concat(allocation.id, "\">&#1578;&#1593;&#1583;&#1610;&#1604;</button><button class=\"mini-btn\" data-transfer-allocation=\"").concat(allocation.id, "\">&#1606;&#1602;&#1604; &#1605;&#1589;&#1576;&#1594;&#1577;</button><button class=\"mini-btn danger\" data-delete-allocation=\"").concat(allocation.id, "\">&#1581;&#1584;&#1601;</button></div></td></tr>");
  }).join(''), "</tbody></table></div></div>").concat(inventorySection, "<div class=\"batch-grid compact\"><div class=\"batch-box\"><h3>\u062E\u0631\u0648\u062C \u062E\u0627\u0645</h3><form class=\"batch-form\" data-form=\"raw\"><select name=\"movementKind\" class=\"full\"><option value=\"out\">\u062E\u0631\u0648\u062C \u062E\u0627\u0645 \u0644\u0644\u0645\u0635\u0628\u063A\u0629</option><option value=\"return\">\u0627\u0631\u062A\u062C\u0627\u0639 \u062E\u0627\u0645 \u0644\u0644\u0646\u0633\u064A\u062C</option></select><input name=\"date\" type=\"date\" required>").concat(order.widthMode === 'multiple' ? "<select name=\"widthLineId\" data-out-only><option value=\"\">\u0627\u062E\u062A\u0631 \u0627\u0644\u0639\u0631\u0636 \u0639\u0646\u062F \u062E\u0631\u0648\u062C \u0627\u0644\u062E\u0627\u0645</option>".concat(order.widthLines.map(function (item) {
    return "<option value=\"".concat(item.id, "\">\u0628\u0648\u0635\u0629 ").concat(item.inch, " - \u0639\u0631\u0636 ").concat(item.width, " - \u0643\u0645\u064A\u0629 ").concat(item.quantity, "</option>");
  }).join(''), "</select>") : '', "<select name=\"allocationId\" data-return-only class=\"field-hidden\"><option value=\"\">\u0627\u062E\u062A\u0631 \u0627\u0644\u0644\u0648\u0646 / \u0627\u0644\u0645\u0635\u0628\u063A\u0629 \u0644\u0644\u0645\u0631\u062A\u062C\u0639</option>").concat(order.allocations.map(function (allocation) {
    return "<option value=\"".concat(allocation.id, "\">").concat(allocationOptionLabel(order, allocation), "</option>");
  }).join(''), "</select><input name=\"quantity\" type=\"number\" step=\"0.01\" placeholder=\"\u0627\u0644\u0643\u0645\u064A\u0629\" required><input name=\"supplier\" placeholder=\"\u0645\u0635\u062F\u0631 \u0627\u0644\u0646\u0633\u064A\u062C\" value=\"").concat(order.weavingSource, "\"><input name=\"noteNumber\" placeholder=\"\u0631\u0642\u0645 \u0625\u0630\u0646\"><input class=\"full\" name=\"notes\" placeholder=\"\u0645\u0644\u0627\u062D\u0638\u0627\u062A\"><label class=\"full batch-file-label\" data-out-only><span>\u0635\u0648\u0631\u0629 \u0625\u0630\u0646 \u0627\u0644\u062E\u0627\u0645</span><input name=\"sourceDocumentFile\" type=\"file\" accept=\"image/*\"></label><button class=\"mini-btn full\">\u0625\u0636\u0627\u0641\u0629 \u062D\u0631\u0643\u0629</button></form><div class=\"batch-list\">").concat(rawItems, "</div></div>").concat(order.accessoryLines.length ? "<div class=\"batch-box\"><h3>\u062E\u0631\u0648\u062C \u0625\u0643\u0633\u0633\u0648\u0627\u0631</h3><form class=\"batch-form\" data-form=\"accessory\"><input name=\"date\" type=\"date\" required>".concat(accessoryTypeSelectHtml(order), "<input name=\"quantity\" type=\"number\" step=\"0.01\" placeholder=\"\u0627\u0644\u0643\u0645\u064A\u0629\" required><input name=\"noteNumber\" placeholder=\"\u0631\u0642\u0645 \u0625\u0630\u0646\"><input class=\"full\" name=\"notes\" placeholder=\"\u0645\u0644\u0627\u062D\u0638\u0627\u062A\"><button class=\"mini-btn full\">\u0625\u0636\u0627\u0641\u0629 \u062E\u0631\u0648\u062C</button></form><div class=\"batch-list\">").concat(accessoryItems, "</div></div><div class=\"batch-box\"><h3>\u0627\u0633\u062A\u0644\u0627\u0645 \u0625\u0643\u0633\u0633\u0648\u0627\u0631</h3><form class=\"batch-form\" data-form=\"accessoryReceived\"><input name=\"date\" type=\"date\" required>").concat(accessoryTypeSelectHtml(order), "<select name=\"allocationId\" required><option value=\"\">\u0627\u062E\u062A\u0631 \u0627\u0644\u0644\u0648\u0646</option>").concat(order.allocations.map(function (allocation) {
    return "<option value=\"".concat(allocation.id, "\">").concat(allocationColorLabel(order, allocation), "</option>");
  }).join(''), "</select><input name=\"quantity\" type=\"number\" step=\"0.01\" placeholder=\"\u0627\u0644\u0643\u0645\u064A\u0629 \u0627\u0644\u0645\u0633\u062A\u0644\u0645\u0629\" required><input name=\"noteNumber\" placeholder=\"\u0631\u0642\u0645 \u0625\u0630\u0646\"><input class=\"full\" name=\"notes\" placeholder=\"\u0645\u0644\u0627\u062D\u0638\u0627\u062A\"><button class=\"mini-btn full\">\u0625\u0636\u0627\u0641\u0629 \u0627\u0633\u062A\u0644\u0627\u0645</button></form><div class=\"batch-list\">").concat(accessoryReceivedItems, "</div></div>") : '', "<div class=\"batch-box\"><h3>\u0627\u0633\u062A\u0644\u0627\u0645 \u0645\u062C\u0647\u0632</h3><form class=\"batch-form\" data-form=\"production\"><select name=\"allocationId\"><option value=\"raw\">&#1575;&#1582;&#1578;&#1585; &#1575;&#1604;&#1604;&#1608;&#1606; / &#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</option>").concat(order.allocations.map(function (allocation) {
    return "<option value=\"".concat(allocation.id, "\">").concat(allocationOptionLabel(order, allocation), "</option>");
  }).join(''), "</select><input name=\"date\" type=\"date\" required><input name=\"quantity\" type=\"number\" step=\"0.01\" placeholder=\"&#1575;&#1604;&#1603;&#1605;&#1610;&#1577; &#1575;&#1604;&#1605;&#1587;&#1578;&#1604;&#1605;&#1577;\" required><input name=\"noteNumber\" placeholder=\"&#1585;&#1602;&#1605; &#1573;&#1584;&#1606; &#1575;&#1604;&#1575;&#1587;&#1578;&#1604;&#1575;&#1605;\"><input class=\"full\" name=\"notes\" placeholder=\"&#1605;&#1604;&#1575;&#1581;&#1592;&#1575;&#1578;\"><button class=\"mini-btn full\">&#1573;&#1590;&#1575;&#1601;&#1577; &#1575;&#1587;&#1578;&#1604;&#1575;&#1605;</button></form><div class=\"batch-list\">").concat(productionItems, "</div></div><div class=\"batch-box\"><h3>\u062A\u0633\u0644\u064A\u0645 \u0639\u0645\u064A\u0644</h3><form class=\"batch-form\" data-form=\"customer\"><select name=\"movementKind\" class=\"full\"><option value=\"cloth\">\u062A\u0633\u0644\u064A\u0645 \u0642\u0645\u0627\u0634</option>").concat(order.accessoryLines.length ? '<option value="accessory">تسليم إكسسوار</option>' : '', "</select><select name=\"allocationId\">").concat(order.allocations.map(function (allocation) {
    return "<option value=\"".concat(allocation.id, "\">").concat(allocationColorLabel(order, allocation), "</option>");
  }).join(''), "</select><input name=\"date\" type=\"date\" required>").concat(order.accessoryLines.length ? "<span data-accessory-only class=\"field-hidden\">".concat(accessoryTypeSelectHtml(order), "</span>") : '', "<input name=\"quantity\" type=\"number\" step=\"0.01\" placeholder=\"&#1575;&#1604;&#1603;&#1605;&#1610;&#1577;\" required><input class=\"full\" name=\"notes\" placeholder=\"&#1605;&#1604;&#1575;&#1581;&#1592;&#1575;&#1578;\"><button class=\"mini-btn full\">&#1573;&#1590;&#1575;&#1601;&#1577; &#1581;&#1585;&#1603;&#1577;</button></form><div class=\"batch-list\">").concat(customerItems, "</div></div><div class=\"batch-box\"><h3>&#1578;&#1581;&#1608;&#1610;&#1604;&#1575;&#1578; &#1575;&#1604;&#1605;&#1589;&#1576;&#1594;&#1577;</h3><p class=\"eyebrow\">&#1578;&#1587;&#1580;&#1610;&#1604; &#1571;&#1610; &#1606;&#1602;&#1604; &#1605;&#1606; &#1605;&#1589;&#1576;&#1594;&#1577; &#1604;&#1571;&#1582;&#1585;&#1609; &#1576;&#1583;&#1608;&#1606; &#1601;&#1602;&#1583;&#1575;&#1606; &#1575;&#1604;&#1578;&#1575;&#1585;&#1610;&#1582;.</p><div class=\"batch-list\">").concat(transferItems, "</div></div></div>");
  refs.orderDetailsPanel.insertAdjacentHTML('beforeend', renderReportSendStatus(order));
  refs.orderDetailsPanel.querySelectorAll('form[data-form="raw"]').forEach(updateRawMovementVisibility);
  refs.orderDetailsPanel.querySelectorAll('form[data-form="customer"]').forEach(updateCustomerDeliveryFields);
  repairOrderDetailsArabic(order);
  renderDocuments();
}
function toggleOperationClosed() {
  return _toggleOperationClosed.apply(this, arguments);
}
function _toggleOperationClosed() {
  _toggleOperationClosed = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee57() {
    var order, backendSaveRequired, updatedOrder, backendCustomer, savedOrder;
    return _regenerator().w(function (_context57) {
      while (1) switch (_context57.n) {
        case 0:
          order = orders.find(function (item) {
            return item.id === selectedOrderId;
          });
          if (order) {
            _context57.n = 1;
            break;
          }
          return _context57.a(2);
        case 1:
          _context57.n = 2;
          return ensureBackendForWrite();
        case 2:
          if (_context57.v) {
            _context57.n = 3;
            break;
          }
          return _context57.a(2);
        case 3:
          backendSaveRequired = true;
          updatedOrder = _objectSpread(_objectSpread({}, order), {}, {
            operationClosed: !order.operationClosed
          });
          if (!backendSaveRequired) {
            _context57.n = 7;
            break;
          }
          _context57.n = 4;
          return ensureBackendCustomer(updatedOrder.customer);
        case 4:
          backendCustomer = _context57.v;
          _context57.n = 5;
          return putBackend("/orders/".concat(updatedOrder.id), orderToApi(updatedOrder, backendCustomer));
        case 5:
          savedOrder = _context57.v;
          if (savedOrder) {
            _context57.n = 7;
            break;
          }
          _context57.n = 6;
          return rollbackAfterBackendWriteFailure('تعذر حفظ حالة دورة التشغيل في قاعدة البيانات. لم يتم اعتماد التعديل.');
        case 6:
          return _context57.a(2);
        case 7:
          selectedOrderId = updatedOrder.id;
          _context57.n = 8;
          return loadBackendData();
        case 8:
          return _context57.a(2);
      }
    }, _callee57);
  }));
  return _toggleOperationClosed.apply(this, arguments);
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
  setPaymentFields(refs.paymentMode, refs.paymentDetails, refs.paymentTerms, order.paymentTerms || '');
  refs.dyehouse.value = order.dyehouse || '';
  refs.weavingSource.value = order.weavingSource || '';
  refs.accessoryType.value = order.accessoryType || '';
  refs.accessoryPercent.value = order.accessoryPercent || 0;
  renderAccessoryLinesEditor(orderAccessoryConfig(order));
  refs.orderNotes.value = order.notes || '';
}
function addOrder(_x34) {
  return _addOrder.apply(this, arguments);
}
function _addOrder() {
  _addOrder = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee58(event) {
    var _refs$paymentMode, _refs$paymentDetails, _firstAccessory$perce;
    var widthLines, currentOrder, accessoryLines, firstAccessory, paymentTerms, payload, backendSaveRequired, backendCustomer, previousDyehouse, transferredAllocationIds, updatedOrder, updatedAllocations, savedOrder, changedAllocations, _iterator, _step, allocation, savedAllocation, newOrder, _savedOrder, pricingMarked, _t26;
    return _regenerator().w(function (_context58) {
      while (1) switch (_context58.p = _context58.n) {
        case 0:
          event.preventDefault();
          widthLines = refs.widthMode.value === 'multiple' ? readWidthLinesFromEditor() : [];
          if (!(refs.widthMode.value === 'multiple' && widthLines.length === 0)) {
            _context58.n = 1;
            break;
          }
          alert('أضف عرضًا واحدًا على الأقل عند اختيار أكثر من عرض.');
          return _context58.a(2);
        case 1:
          currentOrder = editingOrderId ? orders.find(function (order) {
            return order.id === editingOrderId;
          }) : null;
          accessoryLines = readAccessoryLinesFromEditor();
          firstAccessory = accessoryLines[0] || {};
          paymentTerms = composePaymentTerms((_refs$paymentMode = refs.paymentMode) === null || _refs$paymentMode === void 0 ? void 0 : _refs$paymentMode.value, (_refs$paymentDetails = refs.paymentDetails) === null || _refs$paymentDetails === void 0 ? void 0 : _refs$paymentDetails.value);
          if (refs.paymentTerms) refs.paymentTerms.value = paymentTerms;
          payload = {
            pricingId: (currentOrder === null || currentOrder === void 0 ? void 0 : currentOrder.pricingId) || pendingConvertedPricingId || '',
            orderNumber: refs.orderNumber.value,
            productCode: buildItemCode(refs.orderNumber.value),
            customer: refs.customer.value,
            orderDate: refs.orderDate.value,
            fabricType: refs.fabricType.value,
            totalRawQuantity: +refs.totalRawQuantity.value,
            expectedWastePercent: +refs.expectedWastePercent.value || 0,
            widthMode: refs.widthMode.value,
            inchWidth: refs.inchWidth.value,
            widthLines: widthLines,
            kiloPrice: +refs.kiloPrice.value,
            rawCost: orderRawCost(_objectSpread(_objectSpread({}, currentOrder), {}, {
              orderNumber: refs.orderNumber.value
            })),
            paymentTerms: paymentTerms,
            accessoryType: firstAccessory.type || refs.accessoryType.value,
            accessoryPercent: +((_firstAccessory$perce = firstAccessory.percent) !== null && _firstAccessory$perce !== void 0 ? _firstAccessory$perce : refs.accessoryPercent.value) || 0,
            accessoryLines: accessoryLines,
            dyehouse: refs.dyehouse.value,
            weavingSource: refs.weavingSource.value,
            notes: refs.orderNotes.value
          };
          _context58.n = 2;
          return ensureBackendForWrite();
        case 2:
          if (_context58.v) {
            _context58.n = 3;
            break;
          }
          return _context58.a(2);
        case 3:
          backendSaveRequired = true;
          _context58.n = 4;
          return ensureBackendCustomer(payload.customer);
        case 4:
          backendCustomer = _context58.v;
          if (!editingOrderId) {
            _context58.n = 20;
            break;
          }
          previousDyehouse = String((currentOrder === null || currentOrder === void 0 ? void 0 : currentOrder.dyehouse) || '').trim();
          transferredAllocationIds = new Set(dyehouseTransfers.filter(function (transfer) {
            return transfer.orderId === editingOrderId;
          }).flatMap(function (transfer) {
            return [transfer.allocationId, transfer.newAllocationId];
          }).filter(Boolean));
          updatedOrder = _objectSpread(_objectSpread({}, currentOrder), payload);
          updatedAllocations = allocations.map(function (allocation) {
            if (allocation.orderId !== editingOrderId) return allocation;
            var allocationDyehouse = String(allocation.dyehouse || '').trim();
            if (transferredAllocationIds.has(allocation.id) || previousDyehouse && allocationDyehouse !== previousDyehouse) return allocation;
            return _objectSpread(_objectSpread({}, allocation), {}, {
              dyehouse: payload.dyehouse
            });
          });
          _context58.n = 5;
          return putBackend("/orders/".concat(editingOrderId), orderToApi(updatedOrder, backendCustomer));
        case 5:
          savedOrder = _context58.v;
          if (!(backendSaveRequired && !savedOrder)) {
            _context58.n = 7;
            break;
          }
          _context58.n = 6;
          return rollbackAfterBackendWriteFailure('تعذر حفظ تعديل الطلب في قاعدة البيانات. لم يتم اعتماد التعديل.');
        case 6:
          return _context58.a(2);
        case 7:
          _context58.n = 8;
          return verifyOrderPersisted(editingOrderId, payload);
        case 8:
          if (_context58.v) {
            _context58.n = 10;
            break;
          }
          _context58.n = 9;
          return rollbackAfterBackendWriteFailure('تم إرسال تعديل الطلب لكن بيانات الإكسسوارات لم ترجع من قاعدة البيانات. لم يتم اعتماد التعديل.');
        case 9:
          return _context58.a(2);
        case 10:
          changedAllocations = updatedAllocations.filter(function (allocation) {
            var original = allocations.find(function (item) {
              return item.id === allocation.id;
            });
            return original && original.dyehouse !== allocation.dyehouse;
          });
          _iterator = _createForOfIteratorHelper(changedAllocations);
          _context58.p = 11;
          _iterator.s();
        case 12:
          if ((_step = _iterator.n()).done) {
            _context58.n = 16;
            break;
          }
          allocation = _step.value;
          _context58.n = 13;
          return putBackend("/allocations/".concat(allocation.id), allocationToApi(allocation));
        case 13:
          savedAllocation = _context58.v;
          if (!(backendSaveRequired && !savedAllocation)) {
            _context58.n = 15;
            break;
          }
          _context58.n = 14;
          return rollbackAfterBackendWriteFailure('تم حفظ الطلب، لكن تعذر تحديث مصبغة الألوان المرتبطة في قاعدة البيانات. لم يتم اعتماد التعديل كاملًا.');
        case 14:
          return _context58.a(2);
        case 15:
          _context58.n = 12;
          break;
        case 16:
          _context58.n = 18;
          break;
        case 17:
          _context58.p = 17;
          _t26 = _context58.v;
          _iterator.e(_t26);
        case 18:
          _context58.p = 18;
          _iterator.f();
          return _context58.f(18);
        case 19:
          selectedOrderId = editingOrderId;
          _context58.n = 29;
          break;
        case 20:
          newOrder = _objectSpread({
            id: uid(),
            status: 'pending'
          }, payload);
          _context58.n = 21;
          return postBackend('/orders', orderToApi(newOrder, backendCustomer));
        case 21:
          _savedOrder = _context58.v;
          if (!(backendSaveRequired && !_savedOrder)) {
            _context58.n = 23;
            break;
          }
          _context58.n = 22;
          return rollbackAfterBackendWriteFailure('تعذر حفظ الطلب الجديد في قاعدة البيانات. لم يتم اعتماد الطلب.');
        case 22:
          return _context58.a(2);
        case 23:
          _context58.n = 24;
          return verifyOrderPersisted(_savedOrder.id || newOrder.id, payload);
        case 24:
          if (_context58.v) {
            _context58.n = 26;
            break;
          }
          _context58.n = 25;
          return rollbackAfterBackendWriteFailure('تم إرسال الطلب لكن بيانات الإكسسوارات لم ترجع من قاعدة البيانات. لم يتم اعتماد الطلب.');
        case 25:
          return _context58.a(2);
        case 26:
          selectedOrderId = _savedOrder.id || newOrder.id;
          _context58.n = 27;
          return markPricingConverted(payload.orderNumber, newOrder.id, payload.pricingId);
        case 27:
          pricingMarked = _context58.v;
          if (!(backendSaveRequired && !pricingMarked)) {
            _context58.n = 29;
            break;
          }
          _context58.n = 28;
          return rollbackAfterBackendWriteFailure('تم حفظ الطلب، لكن تعذر تحديث حالة التسعيرة في قاعدة البيانات. راجع الطلب والتسعيرة قبل المتابعة.');
        case 28:
          return _context58.a(2);
        case 29:
          editingOrderId = null;
          pendingConvertedPricingId = null;
          _context58.n = 30;
          return loadBackendData();
        case 30:
          refs.orderDialog.close();
        case 31:
          return _context58.a(2);
      }
    }, _callee58, null, [[11, 17, 18, 19]]);
  }));
  return _addOrder.apply(this, arguments);
}
function addBatch(_x35) {
  return _addBatch.apply(this, arguments);
}
function _addBatch() {
  _addBatch = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee59(event) {
    var _event$target$element;
    var type, data, rawDocumentFile, backendSaveRequired, backendResult, currentOrder, allocation, receivedAccessory, deliveredAccessory, availableAccessory, _allocation, alreadyDelivered, warehouseAvailable, _t27;
    return _regenerator().w(function (_context59) {
      while (1) switch (_context59.n) {
        case 0:
          event.preventDefault();
          type = event.target.dataset.form;
          data = Object.fromEntries(new FormData(event.target).entries());
          rawDocumentFile = ((_event$target$element = event.target.elements.sourceDocumentFile) === null || _event$target$element === void 0 || (_event$target$element = _event$target$element.files) === null || _event$target$element === void 0 ? void 0 : _event$target$element[0]) || null;
          delete data.sourceDocumentFile;
          data.id = uid();
          data.quantity = +data.quantity;
          data.orderId = selectedOrderId;
          _context59.n = 1;
          return ensureBackendForWrite();
        case 1:
          if (_context59.v) {
            _context59.n = 2;
            break;
          }
          return _context59.a(2);
        case 2:
          backendSaveRequired = true;
          backendResult = true;
          if (!(type === 'raw')) {
            _context59.n = 10;
            break;
          }
          currentOrder = calculateOrder(orders.find(function (item) {
            return item.id === selectedOrderId;
          }));
          if (!(data.movementKind === 'return')) {
            _context59.n = 5;
            break;
          }
          if (data.allocationId) {
            _context59.n = 3;
            break;
          }
          alert('اختر اللون / المصبغة قبل تسجيل مرتجع الخام.');
          return _context59.a(2);
        case 3:
          _context59.n = 4;
          return postBackend('/batches/raw-return', _objectSpread(_objectSpread({}, batchToApi(data)), {}, {
            reason: data.reason || data.notes || ''
          }));
        case 4:
          backendResult = _context59.v;
          _context59.n = 10;
          break;
        case 5:
          if (!(currentOrder.widthMode === 'multiple' && !data.widthLineId)) {
            _context59.n = 6;
            break;
          }
          alert('اختر العرض المرتبط قبل تسجيل خروج الخام.');
          return _context59.a(2);
        case 6:
          if (!rawDocumentFile) {
            _context59.n = 8;
            break;
          }
          _context59.n = 7;
          return resizeSlipImage(rawDocumentFile);
        case 7:
          _t27 = _context59.v;
          data.sourceDocument = {
            type: 'raw-batch-image',
            image: _t27
          };
        case 8:
          _context59.n = 9;
          return postBackend('/batches/dyehouse', batchToApi(data));
        case 9:
          backendResult = _context59.v;
        case 10:
          if (!(type === 'rawReturn')) {
            _context59.n = 13;
            break;
          }
          if (data.allocationId) {
            _context59.n = 11;
            break;
          }
          alert('اختر اللون / المصبغة قبل تسجيل مرتجع الخام.');
          return _context59.a(2);
        case 11:
          _context59.n = 12;
          return postBackend('/batches/raw-return', _objectSpread(_objectSpread({}, batchToApi(data)), {}, {
            reason: data.reason || data.notes || ''
          }));
        case 12:
          backendResult = _context59.v;
        case 13:
          if (!(type === 'accessory')) {
            _context59.n = 16;
            break;
          }
          if (data.accessoryType) {
            _context59.n = 14;
            break;
          }
          alert('اختر نوع الإكسسوار أولًا.');
          return _context59.a(2);
        case 14:
          data.movement = 'sent';
          delete data.allocationId;
          _context59.n = 15;
          return postBackend('/batches/accessory', batchToApi(data));
        case 15:
          backendResult = _context59.v;
        case 16:
          if (!(type === 'accessoryReceived')) {
            _context59.n = 20;
            break;
          }
          if (data.accessoryType) {
            _context59.n = 17;
            break;
          }
          alert('اختر نوع الإكسسوار أولًا.');
          return _context59.a(2);
        case 17:
          if (data.allocationId) {
            _context59.n = 18;
            break;
          }
          alert('اختر اللون المرتبط باستلام الإكسسوار.');
          return _context59.a(2);
        case 18:
          data.movement = 'received';
          _context59.n = 19;
          return postBackend('/batches/accessory', batchToApi(data));
        case 19:
          backendResult = _context59.v;
        case 20:
          if (!(type === 'production')) {
            _context59.n = 23;
            break;
          }
          if (!(!data.allocationId || data.allocationId === 'raw')) {
            _context59.n = 21;
            break;
          }
          alert('اختر اللون / المصبغة قبل تسجيل استلام المجهز.');
          return _context59.a(2);
        case 21:
          _context59.n = 22;
          return postBackend('/batches/finished', batchToApi(data));
        case 22:
          backendResult = _context59.v;
        case 23:
          if (!(type === 'finished')) {
            _context59.n = 25;
            break;
          }
          allocation = calculateAllocation(allocations.find(function (item) {
            return item.id === data.allocationId;
          }));
          if (data.quantity > allocation.remainingAtDyehouse) {
            data.notes = [data.notes, 'تنبيه: الكمية المستلمة أكبر من المتبقي داخل المصبغة'].filter(Boolean).join(' - ');
          }
          data.finishedWidth = +data.finishedWidth;
          data.finishedWeight = +data.finishedWeight;
          _context59.n = 24;
          return postBackend('/batches/finished', batchToApi(data));
        case 24:
          backendResult = _context59.v;
        case 25:
          if (!(type === 'customer')) {
            _context59.n = 31;
            break;
          }
          if (!(data.movementKind === 'accessory')) {
            _context59.n = 29;
            break;
          }
          if (data.accessoryType) {
            _context59.n = 26;
            break;
          }
          alert('اختر نوع الإكسسوار أولًا.');
          return _context59.a(2);
        case 26:
          if (data.allocationId) {
            _context59.n = 27;
            break;
          }
          alert('اختر اللون المرتبط بتسليم الإكسسوار.');
          return _context59.a(2);
        case 27:
          data.movement = 'customer';
          receivedAccessory = sum(accessoryBatches.filter(function (batch) {
            return batch.allocationId === data.allocationId && batch.movement === 'received' && batch.accessoryType === data.accessoryType;
          }));
          deliveredAccessory = sum(accessoryBatches.filter(function (batch) {
            return batch.allocationId === data.allocationId && batch.movement === 'customer' && batch.accessoryType === data.accessoryType;
          }));
          availableAccessory = Math.max(receivedAccessory - deliveredAccessory, 0);
          if (data.quantity > availableAccessory) {
            data.notes = [data.notes, 'تنبيه: كمية الإكسسوار المسلمة أكبر من الرصيد المتاح'].filter(Boolean).join(' - ');
          }
          _context59.n = 28;
          return postBackend('/batches/accessory', batchToApi(data));
        case 28:
          backendResult = _context59.v;
          _context59.n = 31;
          break;
        case 29:
          _allocation = calculateAllocation(allocations.find(function (item) {
            return item.id === data.allocationId;
          }));
          alreadyDelivered = sum(customerBatches.filter(function (batch) {
            return batch.allocationId === data.allocationId;
          }));
          warehouseAvailable = Math.max(_allocation.finishedReceived - alreadyDelivered, 0);
          if (data.quantity > warehouseAvailable) {
            data.notes = [data.notes, 'تنبيه: كمية التسليم أكبر من رصيد المخزن المتاح'].filter(Boolean).join(' - ');
          }
          _context59.n = 30;
          return postBackend('/batches/customer', batchToApi(data));
        case 30:
          backendResult = _context59.v;
        case 31:
          if (!(backendSaveRequired && !backendResult)) {
            _context59.n = 33;
            break;
          }
          _context59.n = 32;
          return rollbackAfterBackendWriteFailure('تعذر حفظ الحركة في قاعدة البيانات. لم يتم اعتماد الحركة.');
        case 32:
          return _context59.a(2);
        case 33:
          event.target.reset();
          _context59.n = 34;
          return loadBackendData();
        case 34:
          return _context59.a(2);
      }
    }, _callee59);
  }));
  return _addBatch.apply(this, arguments);
}
function addAllocation() {
  return _addAllocation.apply(this, arguments);
}
function _addAllocation() {
  _addAllocation = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee60() {
    var order, color, createdAllocations, backendSaveRequired, targetFinishedWeight, plannedQuantity, existing, targetFinishedWidth, _targetFinishedWeight, allocation, savedAllocations, _i2, _createdAllocations, _allocation2, _t28;
    return _regenerator().w(function (_context60) {
      while (1) switch (_context60.n) {
        case 0:
          order = calculateOrder(orders.find(function (item) {
            return item.id === selectedOrderId;
          }));
          color = prompt('اكتب اللون المطلوب');
          if (color) {
            _context60.n = 1;
            break;
          }
          return _context60.a(2);
        case 1:
          createdAllocations = [];
          _context60.n = 2;
          return ensureBackendForWrite();
        case 2:
          if (_context60.v) {
            _context60.n = 3;
            break;
          }
          return _context60.a(2);
        case 3:
          backendSaveRequired = true;
          if (!(order.widthMode === 'multiple')) {
            _context60.n = 5;
            break;
          }
          targetFinishedWeight = Number(prompt('اكتب الوزن المجهز المطلوب'));
          if (targetFinishedWeight) {
            _context60.n = 4;
            break;
          }
          return _context60.a(2);
        case 4:
          order.widthLines.forEach(function (widthLine) {
            var allocation = {
              id: uid(),
              orderId: order.id,
              color: color,
              plannedQuantity: widthLine.quantity,
              dyehouse: order.dyehouse,
              targetFinishedWidth: widthLine.width,
              targetFinishedWeight: targetFinishedWeight,
              widthLineId: widthLine.id,
              rawInch: widthLine.inch,
              rawWidth: widthLine.width
            };
            createdAllocations.push(allocation);
          });
          _context60.n = 9;
          break;
        case 5:
          plannedQuantity = Number(prompt('اكتب كمية اللون'));
          if (plannedQuantity) {
            _context60.n = 6;
            break;
          }
          return _context60.a(2);
        case 6:
          existing = order.allocations[0];
          targetFinishedWidth = (existing === null || existing === void 0 ? void 0 : existing.targetFinishedWidth) || Number(prompt('اكتب العرض'));
          if (targetFinishedWidth) {
            _context60.n = 7;
            break;
          }
          return _context60.a(2);
        case 7:
          _targetFinishedWeight = (existing === null || existing === void 0 ? void 0 : existing.targetFinishedWeight) || Number(prompt('اكتب الوزن المجهز'));
          if (_targetFinishedWeight) {
            _context60.n = 8;
            break;
          }
          return _context60.a(2);
        case 8:
          allocation = {
            id: uid(),
            orderId: order.id,
            color: color,
            plannedQuantity: plannedQuantity,
            dyehouse: order.dyehouse,
            targetFinishedWidth: targetFinishedWidth,
            targetFinishedWeight: _targetFinishedWeight
          };
          createdAllocations.push(allocation);
        case 9:
          savedAllocations = [];
          _i2 = 0, _createdAllocations = createdAllocations;
        case 10:
          if (!(_i2 < _createdAllocations.length)) {
            _context60.n = 13;
            break;
          }
          _allocation2 = _createdAllocations[_i2];
          _t28 = savedAllocations;
          _context60.n = 11;
          return postBackend("/orders/".concat(order.id, "/allocations"), allocationToApi(_allocation2));
        case 11:
          _t28.push.call(_t28, _context60.v);
        case 12:
          _i2++;
          _context60.n = 10;
          break;
        case 13:
          if (!(backendSaveRequired && savedAllocations.some(function (item) {
            return !item;
          }))) {
            _context60.n = 15;
            break;
          }
          _context60.n = 14;
          return rollbackAfterBackendWriteFailure('تعذر حفظ اللون في قاعدة البيانات. لم يتم اعتماد الإضافة.');
        case 14:
          return _context60.a(2);
        case 15:
          _context60.n = 16;
          return loadBackendData();
        case 16:
          return _context60.a(2);
      }
    }, _callee60);
  }));
  return _addAllocation.apply(this, arguments);
}
function editAllocation(_x36) {
  return _editAllocation.apply(this, arguments);
}
function _editAllocation() {
  _editAllocation = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee61(id) {
    var allocation, order, colorValue, cleanedColor, targetFinishedWidth, targetFinishedWeight, backendSaveRequired, changedAllocations, primaryUpdate, savedAllocations, _iterator2, _step2, item, _t29, _t30;
    return _regenerator().w(function (_context61) {
      while (1) switch (_context61.p = _context61.n) {
        case 0:
          allocation = allocations.find(function (item) {
            return item.id === id;
          });
          if (allocation) {
            _context61.n = 1;
            break;
          }
          return _context61.a(2);
        case 1:
          order = orders.find(function (item) {
            return item.id === allocation.orderId;
          });
          colorValue = prompt('اكتب اللون / كود اللون', allocation.color || allocation.pantoneCode || '');
          if (!(colorValue === null)) {
            _context61.n = 2;
            break;
          }
          return _context61.a(2);
        case 2:
          cleanedColor = colorValue.trim();
          if (cleanedColor) {
            _context61.n = 3;
            break;
          }
          return _context61.a(2);
        case 3:
          targetFinishedWidth = Number(prompt('اكتب العرض', allocation.targetFinishedWidth));
          if (targetFinishedWidth) {
            _context61.n = 4;
            break;
          }
          return _context61.a(2);
        case 4:
          targetFinishedWeight = Number(prompt('اكتب الوزن المجهز', allocation.targetFinishedWeight));
          if (targetFinishedWeight) {
            _context61.n = 5;
            break;
          }
          return _context61.a(2);
        case 5:
          _context61.n = 6;
          return ensureBackendForWrite();
        case 6:
          if (_context61.v) {
            _context61.n = 7;
            break;
          }
          return _context61.a(2);
        case 7:
          backendSaveRequired = true;
          changedAllocations = new Set();
          primaryUpdate = _objectSpread(_objectSpread({}, allocation), {}, {
            color: cleanedColor,
            pantoneCode: cleanedColor
          });
          changedAllocations.add(primaryUpdate);
          if ((order === null || order === void 0 ? void 0 : order.widthMode) !== 'multiple') {
            allocations.filter(function (item) {
              return item.orderId === allocation.orderId;
            }).forEach(function (item) {
              changedAllocations.add(_objectSpread(_objectSpread({}, item), {}, {
                color: item.id === allocation.id ? cleanedColor : item.color,
                pantoneCode: item.id === allocation.id ? cleanedColor : item.pantoneCode,
                targetFinishedWidth: targetFinishedWidth,
                targetFinishedWeight: targetFinishedWeight
              }));
            });
          } else {
            changedAllocations["delete"](primaryUpdate);
            changedAllocations.add(_objectSpread(_objectSpread({}, primaryUpdate), {}, {
              targetFinishedWidth: targetFinishedWidth,
              targetFinishedWeight: targetFinishedWeight
            }));
          }
          if (!backendSaveRequired) {
            _context61.n = 17;
            break;
          }
          savedAllocations = [];
          _iterator2 = _createForOfIteratorHelper(changedAllocations);
          _context61.p = 8;
          _iterator2.s();
        case 9:
          if ((_step2 = _iterator2.n()).done) {
            _context61.n = 12;
            break;
          }
          item = _step2.value;
          _t29 = savedAllocations;
          _context61.n = 10;
          return putBackend("/allocations/".concat(item.id), allocationToApi(item));
        case 10:
          _t29.push.call(_t29, _context61.v);
        case 11:
          _context61.n = 9;
          break;
        case 12:
          _context61.n = 14;
          break;
        case 13:
          _context61.p = 13;
          _t30 = _context61.v;
          _iterator2.e(_t30);
        case 14:
          _context61.p = 14;
          _iterator2.f();
          return _context61.f(14);
        case 15:
          if (!savedAllocations.some(function (item) {
            return !item;
          })) {
            _context61.n = 17;
            break;
          }
          _context61.n = 16;
          return rollbackAfterBackendWriteFailure('تعذر حفظ تعديل اللون في قاعدة البيانات. لم يتم اعتماد التعديل.');
        case 16:
          return _context61.a(2);
        case 17:
          _context61.n = 18;
          return loadBackendData();
        case 18:
          return _context61.a(2);
      }
    }, _callee61, null, [[8, 13, 14, 15]]);
  }));
  return _editAllocation.apply(this, arguments);
}
function transferAllocationDyehouse(_x37) {
  return _transferAllocationDyehouse.apply(this, arguments);
}
function _transferAllocationDyehouse() {
  _transferAllocationDyehouse = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee62(id) {
    var allocation, order, calculated, currentDyehouse, newDyehouseValue, newDyehouse, originalQuantity, suggestedQuantity, quantityValue, quantity, transferWarnings, dateValue, noteNumber, reason, newAllocationId, roundedQuantity, transferRecord, allocationUpdate, newAllocation, backendSaveRequired, ratio, originalAccessory, newAccessory, updatedAllocation, insertedAllocation, insertedTransfer, _t31, _t32, _t33;
    return _regenerator().w(function (_context62) {
      while (1) switch (_context62.n) {
        case 0:
          allocation = allocations.find(function (item) {
            return item.id === id;
          });
          if (allocation) {
            _context62.n = 1;
            break;
          }
          return _context62.a(2);
        case 1:
          order = calculateOrder(orders.find(function (item) {
            return item.id === allocation.orderId;
          }));
          calculated = order.allocations.find(function (item) {
            return item.id === id;
          }) || calculateAllocation(allocation);
          currentDyehouse = allocation.dyehouse || order.dyehouse || '';
          newDyehouseValue = prompt("\u0627\u0644\u0645\u0635\u0628\u063A\u0629 \u0627\u0644\u062C\u062F\u064A\u062F\u0629", currentDyehouse);
          if (!(newDyehouseValue === null)) {
            _context62.n = 2;
            break;
          }
          return _context62.a(2);
        case 2:
          newDyehouse = newDyehouseValue.trim();
          if (newDyehouse) {
            _context62.n = 3;
            break;
          }
          return _context62.a(2);
        case 3:
          if (!(newDyehouse === currentDyehouse)) {
            _context62.n = 4;
            break;
          }
          alert("\u0627\u0644\u0645\u0635\u0628\u063A\u0629 \u0644\u0645 \u062A\u062A\u063A\u064A\u0631.");
          return _context62.a(2);
        case 4:
          originalQuantity = Number(allocation.plannedQuantity || 0);
          suggestedQuantity = Math.max(originalQuantity - Number(calculated.sentToDyehouse || 0), 0) || originalQuantity || '';
          quantityValue = prompt("\u0627\u0644\u0643\u0645\u064A\u0629 \u0627\u0644\u0645\u062D\u0648\u0644\u0629", suggestedQuantity);
          if (!(quantityValue === null)) {
            _context62.n = 5;
            break;
          }
          return _context62.a(2);
        case 5:
          quantity = Number(quantityValue);
          if (!(!quantity || quantity <= 0)) {
            _context62.n = 6;
            break;
          }
          alert("\u0627\u062F\u062E\u0644 \u0643\u0645\u064A\u0629 \u0635\u062D\u064A\u062D\u0629 \u0644\u0644\u062A\u062D\u0648\u064A\u0644.");
          return _context62.a(2);
        case 6:
          transferWarnings = [];
          if (quantity > originalQuantity) transferWarnings.push("\u062A\u0646\u0628\u064A\u0647: \u0643\u0645\u064A\u0629 \u0627\u0644\u062A\u062D\u0648\u064A\u0644 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0643\u0645\u064A\u0629 \u0627\u0644\u0645\u062E\u0637\u0637\u0629 \u0644\u0647\u0630\u0627 \u0627\u0644\u0644\u0648\u0646.");
          if (quantity > Math.max(originalQuantity - Number(calculated.sentToDyehouse || 0), 0)) transferWarnings.push("\u062A\u0646\u0628\u064A\u0647: \u0643\u0645\u064A\u0629 \u0627\u0644\u062A\u062D\u0648\u064A\u0644 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u062E\u0627\u0645 \u0627\u0644\u0645\u062A\u0627\u062D \u063A\u064A\u0631 \u0627\u0644\u0645\u0631\u0633\u0644 \u0644\u0644\u0645\u0635\u0628\u063A\u0629.");
          dateValue = prompt("\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062A\u062D\u0648\u064A\u0644", new Date().toISOString().slice(0, 10));
          if (!(dateValue === null)) {
            _context62.n = 7;
            break;
          }
          return _context62.a(2);
        case 7:
          noteNumber = prompt("\u0631\u0642\u0645 \u0625\u0630\u0646 \u0627\u0644\u062A\u062D\u0648\u064A\u0644", '') || '';
          reason = prompt("\u0633\u0628\u0628 \u0627\u0644\u062A\u062D\u0648\u064A\u0644", "\u062A\u062D\u0648\u064A\u0644 \u0645\u0635\u0628\u063A\u0629") || '';
          newAllocationId = uid();
          roundedQuantity = roundNumber(quantity);
          transferRecord = null;
          allocationUpdate = null;
          newAllocation = null;
          _context62.n = 8;
          return ensureBackendForWrite();
        case 8:
          if (_context62.v) {
            _context62.n = 9;
            break;
          }
          return _context62.a(2);
        case 9:
          backendSaveRequired = true;
          if (roundedQuantity >= originalQuantity) {
            allocationUpdate = _objectSpread(_objectSpread({}, allocation), {}, {
              dyehouse: newDyehouse
            });
            transferRecord = {
              id: uid(),
              orderId: allocation.orderId,
              allocationId: id,
              newAllocationId: null,
              color: allocation.color || allocation.pantoneCode || '',
              fromDyehouse: currentDyehouse,
              toDyehouse: newDyehouse,
              quantity: roundNumber(originalQuantity),
              date: dateValue,
              reason: [reason].concat(transferWarnings).filter(Boolean).join(' - '),
              noteNumber: noteNumber,
              mode: 'full'
            };
          } else {
            ratio = originalQuantity ? roundedQuantity / originalQuantity : 0;
            originalAccessory = Number(allocation.accessoryQuantityManual || 0);
            newAccessory = originalAccessory ? roundNumber(originalAccessory * ratio) : allocation.accessoryQuantityManual;
            allocationUpdate = _objectSpread(_objectSpread({}, allocation), {}, {
              plannedQuantity: roundNumber(originalQuantity - roundedQuantity),
              accessoryQuantityManual: originalAccessory ? roundNumber(originalAccessory - Number(newAccessory || 0)) : allocation.accessoryQuantityManual
            });
            newAllocation = _objectSpread(_objectSpread({}, allocation), {}, {
              id: newAllocationId,
              plannedQuantity: roundedQuantity,
              dyehouse: newDyehouse,
              accessoryQuantityManual: newAccessory
            });
            transferRecord = {
              id: uid(),
              orderId: allocation.orderId,
              allocationId: id,
              newAllocationId: newAllocationId,
              color: allocation.color || allocation.pantoneCode || '',
              fromDyehouse: currentDyehouse,
              toDyehouse: newDyehouse,
              quantity: roundedQuantity,
              date: dateValue,
              reason: reason,
              noteNumber: noteNumber,
              mode: 'split'
            };
          }
          if (!backendSaveRequired) {
            _context62.n = 20;
            break;
          }
          if (!allocationUpdate) {
            _context62.n = 11;
            break;
          }
          _context62.n = 10;
          return putBackend("/allocations/".concat(id), allocationToApi(allocationUpdate));
        case 10:
          _t31 = _context62.v;
          _context62.n = 12;
          break;
        case 11:
          _t31 = true;
        case 12:
          updatedAllocation = _t31;
          if (!newAllocation) {
            _context62.n = 14;
            break;
          }
          _context62.n = 13;
          return postBackend("/orders/".concat(allocation.orderId, "/allocations"), allocationToApi(newAllocation));
        case 13:
          _t32 = _context62.v;
          _context62.n = 15;
          break;
        case 14:
          _t32 = true;
        case 15:
          insertedAllocation = _t32;
          if (!transferRecord) {
            _context62.n = 17;
            break;
          }
          _context62.n = 16;
          return postBackend('/transfers', transferToApi(transferRecord));
        case 16:
          _t33 = _context62.v;
          _context62.n = 18;
          break;
        case 17:
          _t33 = true;
        case 18:
          insertedTransfer = _t33;
          if (!(!updatedAllocation || !insertedAllocation || !insertedTransfer)) {
            _context62.n = 20;
            break;
          }
          _context62.n = 19;
          return rollbackAfterBackendWriteFailure('تعذر حفظ تحويل المصبغة في قاعدة البيانات. لم يتم اعتماد التحويل.');
        case 19:
          return _context62.a(2);
        case 20:
          _context62.n = 21;
          return loadBackendData();
        case 21:
          return _context62.a(2);
      }
    }, _callee62);
  }));
  return _transferAllocationDyehouse.apply(this, arguments);
}
function deleteAllocation(_x38) {
  return _deleteAllocation.apply(this, arguments);
}
function _deleteAllocation() {
  _deleteAllocation = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee63(id) {
    var allocation, backendSaveRequired, deleted;
    return _regenerator().w(function (_context63) {
      while (1) switch (_context63.n) {
        case 0:
          allocation = allocations.find(function (item) {
            return item.id === id;
          });
          if (allocation) {
            _context63.n = 1;
            break;
          }
          return _context63.a(2);
        case 1:
          if (confirm("\u0647\u0644 \u062A\u0631\u064A\u062F \u062D\u0630\u0641 \u0627\u0644\u0644\u0648\u0646 ".concat(allocation.color || allocation.pantoneCode || '-', "\u061F \u0633\u064A\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u062D\u0631\u0643\u0627\u062A \u0627\u0644\u0645\u0631\u062A\u0628\u0637\u0629 \u0628\u0647 \u0645\u0646 \u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628."))) {
            _context63.n = 2;
            break;
          }
          return _context63.a(2);
        case 2:
          _context63.n = 3;
          return ensureBackendForWrite();
        case 3:
          if (_context63.v) {
            _context63.n = 4;
            break;
          }
          return _context63.a(2);
        case 4:
          backendSaveRequired = true;
          if (!backendSaveRequired) {
            _context63.n = 7;
            break;
          }
          _context63.n = 5;
          return deleteBackend("/allocations/".concat(id));
        case 5:
          deleted = _context63.v;
          if (deleted) {
            _context63.n = 7;
            break;
          }
          _context63.n = 6;
          return rollbackAfterBackendWriteFailure('تعذر حذف اللون من قاعدة البيانات. لم يتم اعتماد الحذف.');
        case 6:
          return _context63.a(2);
        case 7:
          recordAudit('delete', 'allocation', id, allocation, null, "\u062D\u0630\u0641 \u0627\u0644\u0644\u0648\u0646 ".concat(allocation.color || allocation.pantoneCode || '-'));
          _context63.n = 8;
          return persistAuditLog();
        case 8:
          _context63.n = 9;
          return loadBackendData();
        case 9:
          return _context63.a(2);
      }
    }, _callee63);
  }));
  return _deleteAllocation.apply(this, arguments);
}
function deleteOrder(_x39) {
  return _deleteOrder.apply(this, arguments);
}
function _deleteOrder() {
  _deleteOrder = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee64(id) {
    var order, backendSaveRequired, deleted;
    return _regenerator().w(function (_context64) {
      while (1) switch (_context64.n) {
        case 0:
          order = orders.find(function (item) {
            return item.id === id;
          });
          if (order) {
            _context64.n = 1;
            break;
          }
          return _context64.a(2);
        case 1:
          if (confirm("\u0647\u0644 \u062A\u0631\u064A\u062F \u062D\u0630\u0641 \u0627\u0644\u0637\u0644\u0628 \u0631\u0642\u0645 ".concat(order.orderNumber || '-', "\u061F \u0633\u064A\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0648\u0627\u0644\u062D\u0631\u0643\u0627\u062A \u0627\u0644\u0645\u0631\u062A\u0628\u0637\u0629 \u0628\u0647."))) {
            _context64.n = 2;
            break;
          }
          return _context64.a(2);
        case 2:
          _context64.n = 3;
          return ensureBackendForWrite();
        case 3:
          if (_context64.v) {
            _context64.n = 4;
            break;
          }
          return _context64.a(2);
        case 4:
          backendSaveRequired = true;
          if (!backendSaveRequired) {
            _context64.n = 7;
            break;
          }
          _context64.n = 5;
          return deleteBackend("/orders/".concat(id));
        case 5:
          deleted = _context64.v;
          if (deleted) {
            _context64.n = 7;
            break;
          }
          _context64.n = 6;
          return rollbackAfterBackendWriteFailure('تعذر حذف الطلب من قاعدة البيانات. لم يتم اعتماد الحذف.');
        case 6:
          return _context64.a(2);
        case 7:
          recordAudit('delete', 'order', id, order, null, "\u062D\u0630\u0641 \u0627\u0644\u0637\u0644\u0628 \u0631\u0642\u0645 ".concat(order.orderNumber || ''));
          _context64.n = 8;
          return persistAuditLog();
        case 8:
          if (selectedOrderId === id) selectedOrderId = null;
          _context64.n = 9;
          return loadBackendData();
        case 9:
          return _context64.a(2);
      }
    }, _callee64);
  }));
  return _deleteOrder.apply(this, arguments);
}
function deleteBatch(_x40, _x41) {
  return _deleteBatch.apply(this, arguments);
}
function _deleteBatch() {
  _deleteBatch = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee65(type, id) {
    var backendSaveRequired, transfer, newAllocation, originalAllocation, hasLinkedMovements, newQty, backendTasks, _transfer, _transfer2, _originalAllocation, results;
    return _regenerator().w(function (_context65) {
      while (1) switch (_context65.n) {
        case 0:
          if (confirm('هل تريد حذف هذه الحركة؟ سيتم حذفها من قاعدة البيانات أيضًا.')) {
            _context65.n = 1;
            break;
          }
          return _context65.a(2);
        case 1:
          _context65.n = 2;
          return ensureBackendForWrite();
        case 2:
          if (_context65.v) {
            _context65.n = 3;
            break;
          }
          return _context65.a(2);
        case 3:
          backendSaveRequired = true;
          transfer = null;
          if (!(type === 'transfer')) {
            _context65.n = 7;
            break;
          }
          transfer = dyehouseTransfers.find(function (batch) {
            return String(batch.id) === String(id);
          });
          if (!transfer) {
            _context65.n = 7;
            break;
          }
          if (!(transfer.mode === 'split' && transfer.newAllocationId)) {
            _context65.n = 6;
            break;
          }
          newAllocation = allocations.find(function (allocation) {
            return allocation.id === transfer.newAllocationId;
          });
          originalAllocation = allocations.find(function (allocation) {
            return allocation.id === transfer.allocationId;
          });
          hasLinkedMovements = [].concat(_toConsumableArray(rawReturns), _toConsumableArray(dyeBatches), _toConsumableArray(productionBatches), _toConsumableArray(finishedBatches), _toConsumableArray(customerBatches), _toConsumableArray(accessoryBatches)).some(function (batch) {
            return batch.allocationId === transfer.newAllocationId;
          });
          if (!(newAllocation && originalAllocation && !hasLinkedMovements)) {
            _context65.n = 4;
            break;
          }
          newQty = Number(newAllocation.plannedQuantity || transfer.quantity || 0);
          originalAllocation.plannedQuantity = roundNumber(Number(originalAllocation.plannedQuantity || 0) + newQty);
          if (originalAllocation.accessoryQuantityManual !== null && originalAllocation.accessoryQuantityManual !== undefined && newAllocation.accessoryQuantityManual !== null && newAllocation.accessoryQuantityManual !== undefined) {
            originalAllocation.accessoryQuantityManual = roundNumber(Number(originalAllocation.accessoryQuantityManual || 0) + Number(newAllocation.accessoryQuantityManual || 0));
          }
          allocations = allocations.filter(function (allocation) {
            return allocation.id !== transfer.newAllocationId;
          });
          _context65.n = 5;
          break;
        case 4:
          if (!hasLinkedMovements) {
            _context65.n = 5;
            break;
          }
          alert('لا يمكن حذف التحويل لأن اللون المحول عليه توجد عليه حركات تشغيل. احذف الحركات المرتبطة أولًا أو اترك التحويل كما هو.');
          return _context65.a(2);
        case 5:
          _context65.n = 7;
          break;
        case 6:
          if (transfer.mode === 'full' && transfer.allocationId) {
            allocations = allocations.map(function (allocation) {
              return allocation.id === transfer.allocationId ? _objectSpread(_objectSpread({}, allocation), {}, {
                dyehouse: transfer.fromDyehouse || allocation.dyehouse
              }) : allocation;
            });
          }
        case 7:
          if (!backendSaveRequired) {
            _context65.n = 10;
            break;
          }
          backendTasks = [];
          if (type === 'transfer') {
            backendTasks.push(deleteBackend("/transfers/".concat(id)));
            if ((_transfer = transfer) !== null && _transfer !== void 0 && _transfer.allocationId) {
              _originalAllocation = allocations.find(function (allocation) {
                return allocation.id === transfer.allocationId;
              });
              if (_originalAllocation) backendTasks.push(putBackend("/allocations/".concat(_originalAllocation.id), allocationToApi(_originalAllocation)));
            }
            if (((_transfer2 = transfer) === null || _transfer2 === void 0 ? void 0 : _transfer2.mode) === 'split' && transfer.newAllocationId) backendTasks.push(deleteBackend("/allocations/".concat(transfer.newAllocationId)));
          } else {
            backendTasks.push(deleteBackend("/batches/".concat(backendBatchType(type), "/").concat(id)));
          }
          _context65.n = 8;
          return Promise.all(backendTasks);
        case 8:
          results = _context65.v;
          if (!results.some(function (item) {
            return !item;
          })) {
            _context65.n = 10;
            break;
          }
          _context65.n = 9;
          return rollbackAfterBackendWriteFailure('تعذر حذف الحركة من قاعدة البيانات. لم يتم اعتماد الحذف.');
        case 9:
          return _context65.a(2);
        case 10:
          _context65.n = 11;
          return loadBackendData();
        case 11:
          return _context65.a(2);
      }
    }, _callee65);
  }));
  return _deleteBatch.apply(this, arguments);
}
function editBatch(_x42, _x43) {
  return _editBatch.apply(this, arguments);
}
function _editBatch() {
  _editBatch = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee66(type, id) {
    var collection, batch, backendSaveRequired, updatedBatch, quantity, saved, _t34;
    return _regenerator().w(function (_context66) {
      while (1) switch (_context66.n) {
        case 0:
          collection = type === 'raw' ? rawBatches : type === 'accessory' ? accessoryBatches : type === 'transfer' ? dyehouseTransfers : type === 'rawReturn' ? rawReturns : type === 'production' ? productionBatches : type === 'customer' ? customerBatches : finishedBatches;
          batch = collection.find(function (item) {
            return item.id === id;
          });
          if (batch) {
            _context66.n = 1;
            break;
          }
          return _context66.a(2);
        case 1:
          _context66.n = 2;
          return ensureBackendForWrite();
        case 2:
          if (_context66.v) {
            _context66.n = 3;
            break;
          }
          return _context66.a(2);
        case 3:
          backendSaveRequired = true;
          updatedBatch = _objectSpread({}, batch);
          quantity = Number(prompt('الكمية', updatedBatch.quantity));
          if (quantity) {
            _context66.n = 4;
            break;
          }
          return _context66.a(2);
        case 4:
          updatedBatch.quantity = quantity;
          updatedBatch.date = prompt('التاريخ', updatedBatch.date) || updatedBatch.date;
          if (type === 'raw') {
            updatedBatch.supplier = prompt('الجهة / المصدر', updatedBatch.supplier) || updatedBatch.supplier;
            updatedBatch.noteNumber = prompt('رقم الإذن', updatedBatch.noteNumber || '') || '';
            updatedBatch.notes = prompt('ملاحظات', updatedBatch.notes || '') || '';
          }
          if (type === 'transfer') {
            updatedBatch.fromDyehouse = prompt("\u0645\u0646 \u0645\u0635\u0628\u063A\u0629", updatedBatch.fromDyehouse || '') || updatedBatch.fromDyehouse;
            updatedBatch.toDyehouse = prompt("\u0625\u0644\u0649 \u0645\u0635\u0628\u063A\u0629", updatedBatch.toDyehouse || '') || updatedBatch.toDyehouse;
            updatedBatch.noteNumber = prompt("\u0631\u0642\u0645 \u0625\u0630\u0646 \u0627\u0644\u062A\u062D\u0648\u064A\u0644", updatedBatch.noteNumber || '') || '';
            updatedBatch.reason = prompt("\u0633\u0628\u0628 \u0627\u0644\u0646\u0642\u0644", updatedBatch.reason || '') || '';
          }
          if (type === 'rawReturn') {
            updatedBatch.noteNumber = prompt('رقم إذن المرتجع', updatedBatch.noteNumber || '') || '';
            updatedBatch.notes = prompt('ملاحظات', updatedBatch.notes || '') || '';
          }
          if (type === 'accessory') {
            updatedBatch.accessoryType = prompt('نوع الإكسسوار', updatedBatch.accessoryType) || updatedBatch.accessoryType;
            updatedBatch.noteNumber = prompt('رقم الإذن', updatedBatch.noteNumber || '') || '';
            updatedBatch.notes = prompt('ملاحظات', updatedBatch.notes || '') || '';
          }
          if (type === 'dye') {
            updatedBatch.noteNumber = prompt('رقم الإذن', updatedBatch.noteNumber || '') || '';
            updatedBatch.notes = prompt('ملاحظات', updatedBatch.notes || '') || '';
          }
          if (type === 'production') {
            updatedBatch.noteNumber = prompt('رقم إذن استلام المجهز', updatedBatch.noteNumber || '') || '';
            updatedBatch.notes = prompt('ملاحظات', updatedBatch.notes || '') || '';
          }
          if (type === 'finished') {
            updatedBatch.finishedWidth = Number(prompt('العرض', updatedBatch.finishedWidth));
            updatedBatch.finishedWeight = Number(prompt('الوزن المجهز', updatedBatch.finishedWeight));
            updatedBatch.notes = prompt('ملاحظات', updatedBatch.notes || '') || '';
          }
          if (!backendSaveRequired) {
            _context66.n = 10;
            break;
          }
          if (!(type === 'transfer')) {
            _context66.n = 6;
            break;
          }
          _context66.n = 5;
          return putBackend("/transfers/".concat(id), transferToApi(updatedBatch));
        case 5:
          _t34 = _context66.v;
          _context66.n = 8;
          break;
        case 6:
          _context66.n = 7;
          return putBackend("/batches/".concat(backendBatchType(type), "/").concat(id), type === 'rawReturn' ? _objectSpread(_objectSpread({}, batchToApi(updatedBatch)), {}, {
            reason: updatedBatch.reason || updatedBatch.notes || ''
          }) : batchToApi(updatedBatch));
        case 7:
          _t34 = _context66.v;
        case 8:
          saved = _t34;
          if (saved) {
            _context66.n = 10;
            break;
          }
          _context66.n = 9;
          return rollbackAfterBackendWriteFailure('تعذر حفظ تعديل الحركة في قاعدة البيانات. لم يتم اعتماد التعديل.');
        case 9:
          return _context66.a(2);
        case 10:
          _context66.n = 11;
          return loadBackendData();
        case 11:
          return _context66.a(2);
      }
    }, _callee66);
  }));
  return _editBatch.apply(this, arguments);
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
  var text = String(stage || '').trim();
  return isLegacyRecoveredText(text) ? 'مراجعة' : text || '-';
}
function dateRangeLabel(items) {
  var dates = items.map(function (item) {
    return item.date;
  }).filter(Boolean).sort();
  if (!dates.length) return '-';
  return dates[0] === dates[dates.length - 1] ? dates[0] : "".concat(dates[0], " - ").concat(dates[dates.length - 1]);
}
function orderMovementDates(order) {
  var allocationIds = order.allocations.map(function (allocation) {
    return allocation.id;
  });
  return {
    orderDate: order.orderDate || '-',
    weavingDate: dateRangeLabel(rawBatches.filter(function (batch) {
      return batch.orderId === order.id;
    })),
    dyehouseDate: dateRangeLabel(productionBatches.filter(function (batch) {
      return allocationIds.includes(batch.allocationId);
    })),
    customerDate: dateRangeLabel(customerBatches.filter(function (batch) {
      return allocationIds.includes(batch.allocationId);
    }))
  };
}
function reportNumber(value) {
  var digits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  var number = Number(value || 0);
  var factor = Math.pow(10, digits);
  return Math.round(number * factor) / factor;
}
function reportFmt(value) {
  var digits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  return reportNumber(value, digits).toLocaleString('en-US', {
    maximumFractionDigits: digits
  });
}
function daysSince(dateValue) {
  if (!dateValue) return 0;
  var date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 0;
  return Math.max(Math.floor((new Date() - date) / 86400000), 0);
}
function stageStartDate(order) {
  var allocationIds = order.allocations.map(function (allocation) {
    return allocation.id;
  });
  var stage = getOperationalStage(order);
  if (stage === 'بانتظار استلام الخام' || stage === 'بانتظار خروج الخام' || stage === 'بانتظار توزيع الألوان') return order.orderDate || '';
  if (stage === 'تحت التشغيل بالمصبغة') return dateRangeLabel(rawBatches.filter(function (batch) {
    return batch.orderId === order.id;
  })).split(' - ')[0] || order.orderDate || '';
  if (stage === 'بالمخزن' || stage === 'تسليم العميل') return dateRangeLabel(productionBatches.filter(function (batch) {
    return allocationIds.includes(batch.allocationId);
  })).split(' - ')[0] || order.orderDate || '';
  return order.orderDate || '';
}
function openManagementReportsMenu() {
  refs.documentTitle.textContent = 'التقارير الإدارية';
  refs.documentBody.dataset.documentType = 'management-reports-menu';
  var cards = [['orders-follow', 'تقرير متابعة الطلبات', 'ملخص الطلبات وحالتها من الخام حتى التسليم.'], ['dyehouse-balances', 'تقرير أرصدة المصابغ', 'الكميات المتبقية داخل كل مصبغة حسب الطلبات والألوان.'], ['inventory', 'تقرير رصيد المخزن', 'رصيد المخزن الحالي حسب الداخل والتسليم.'], ['delays', 'تقرير التأخيرات', 'الطلبات المتوقفة أو المتأخرة في مراحل التشغيل.'], ['dyehouse-performance', 'أداء المصابغ', 'مراجعة كميات التشغيل والاستلام والهالك لكل مصبغة.'], ['waste-analysis', 'تحليل الهالك', 'مقارنة الهالك التقديري بالهالك الفعلي.'], ['customer-account', 'تقرير العملاء', 'ملخص كل عميل داخل نظام المتابعة.'], ['order-movement', 'حركة الطلبات', 'تواريخ انتقال الطلبات بين مراحل التشغيل.'], ['raw-returns', 'مرتجعات الخام', 'حركات الخام المرتجع من المصبغة أو التشغيل.'], ['accessories', 'تقرير الإكسسوار', 'حركات الإكسسوار خروجًا واستلامًا وتسليمًا.']];
  refs.documentBody.innerHTML = "<div class=\"document-sheet orders-follow-report\">".concat(documentHeader(), "<div class=\"report-title\"><h2>\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u0644\u0625\u062F\u0627\u0631\u064A\u0629</h2><span>\u0627\u062E\u062A\u0631 \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u062D\u0627\u0644\u064A.</span></div><div class=\"management-report-grid no-print\">").concat(cards.map(function (_ref25) {
    var _ref26 = _slicedToArray(_ref25, 3),
      type = _ref26[0],
      title = _ref26[1],
      desc = _ref26[2];
    return "<button type=\"button\" class=\"management-report-card\" data-management-report=\"".concat(type, "\"><strong>").concat(title, "</strong><span>").concat(desc, "</span></button>");
  }).join(''), "</div><section class=\"report-section\"><h3>\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631</h3><table class=\"follow-table\"><thead><tr><th>\u0627\u0644\u062A\u0642\u0631\u064A\u0631</th><th>\u0627\u0644\u0648\u0635\u0641</th><th>\u0625\u062C\u0631\u0627\u0621</th></tr></thead><tbody>").concat(cards.map(function (_ref27) {
    var _ref28 = _slicedToArray(_ref27, 3),
      type = _ref28[0],
      title = _ref28[1],
      desc = _ref28[2];
    return "<tr><th>".concat(title, "</th><td>").concat(desc, "</td><td><button type=\"button\" class=\"mini-btn gold\" data-management-report=\"").concat(type, "\">\u0641\u062A\u062D \u0627\u0644\u062A\u0642\u0631\u064A\u0631</button></td></tr>");
  }).join(''), "</tbody></table></section>").concat(documentFooter(), "</div>");
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
function showManagementReport(title, subtitle, sectionsHtml) {
  var reportKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  refs.documentTitle.textContent = title;
  refs.documentBody.dataset.documentType = 'management-report';
  refs.documentBody.dataset.reportKey = reportKey || title;
  refs.documentBody.dataset.reportTitle = title;
  refs.documentBody.dataset.reportSubtitle = subtitle;
  var reportHtml = "".concat(documentHeader(), "<div class=\"report-title\"><h2>").concat(title, "</h2><span>").concat(subtitle, "</span></div>").concat(sectionsHtml);
  refs.documentBody.innerHTML = "<div class=\"document-sheet orders-follow-report\">".concat(withDocumentFooter(reportHtml), "</div>");
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
function openManagementReport(type) {
  if (type === 'orders-follow') {
    if (refs.documentDialog.open) refs.documentDialog.close();
    return openOrdersReport();
  }
  if (type === 'dyehouse-balances') {
    if (refs.documentDialog.open) refs.documentDialog.close();
    return openDyehouseBalancesReport();
  }
  var list = allOrders();
  if (type === 'inventory') {
    var clothRows = [];
    var accessoryRows = [];
    list.forEach(function (order) {
      return order.allocations.forEach(function (allocation) {
        var delivered = sum(customerBatches.filter(function (batch) {
          return batch.allocationId === allocation.id;
        }));
        var balance = reportNumber(Number(allocation.finishedReceived || 0) - delivered);
        if (balance > 0) clothRows.push("<tr><td>".concat(order.orderNumber, "</td><td>").concat(order.customer, "</td><td>").concat(order.fabricType || '-', "</td><td>").concat(allocation.color || '-', "</td><td>").concat(allocation.rawInch || order.inchWidth || '-', "</td><td>").concat(allocation.rawWidth || allocation.targetFinishedWidth || '-', "</td><td>").concat(reportFmt(allocation.finishedReceived), "</td><td>").concat(reportFmt(delivered), "</td><td><strong>").concat(reportFmt(balance), "</strong></td></tr>"));
        if (order.accessoryLines.length) {
          var received = sum(accessoryBatches.filter(function (batch) {
            return batch.allocationId === allocation.id && batch.movement === 'received';
          }));
          var customerDelivered = sum(accessoryBatches.filter(function (batch) {
            return batch.allocationId === allocation.id && batch.movement === 'customer';
          }));
          var accessoryBalance = reportNumber(received - customerDelivered);
          if (accessoryBalance > 0) accessoryRows.push("<tr><td>".concat(order.orderNumber, "</td><td>").concat(order.customer, "</td><td>").concat(allocation.color || '-', "</td><td>").concat(accessoryTypesLabel(order), "</td><td>").concat(reportFmt(received), "</td><td>").concat(reportFmt(customerDelivered), "</td><td><strong>").concat(reportFmt(accessoryBalance), "</strong></td></tr>"));
        }
      });
    });
    return showManagementReport('تقرير رصيد المخزن', 'رصيد القماش والإكسسوار المتاح حسب الداخل للمخزن والتسليم للعميل.', "<section class=\"report-section\"><h3>\u0631\u0635\u064A\u062F \u0627\u0644\u0642\u0645\u0627\u0634 \u0627\u0644\u062D\u0627\u0644\u064A</h3><table class=\"follow-table\"><thead><tr><th>\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628</th><th>\u0627\u0644\u0639\u0645\u064A\u0644</th><th>\u0627\u0644\u0635\u0646\u0641</th><th>\u0627\u0644\u0644\u0648\u0646</th><th>\u0627\u0644\u0628\u0648\u0635\u0629</th><th>\u0627\u0644\u0639\u0631\u0636</th><th>\u062F\u062E\u0644 \u0627\u0644\u0645\u062E\u0632\u0646</th><th>\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0639\u0645\u064A\u0644</th><th>\u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u062D\u0627\u0644\u064A</th></tr></thead><tbody>".concat(clothRows.join('') || '<tr><td colspan="9">لا يوجد رصيد قماش حالي.</td></tr>', "</tbody></table></section><section class=\"report-section\"><h3>\u0631\u0635\u064A\u062F \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631</h3><table class=\"follow-table\"><thead><tr><th>\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628</th><th>\u0627\u0644\u0639\u0645\u064A\u0644</th><th>\u0627\u0644\u0644\u0648\u0646</th><th>\u0646\u0648\u0639 \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631</th><th>\u0645\u0633\u062A\u0644\u0645</th><th>\u0645\u0633\u0644\u0645 \u0644\u0644\u0639\u0645\u064A\u0644</th><th>\u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u062D\u0627\u0644\u064A</th></tr></thead><tbody>").concat(accessoryRows.join('') || '<tr><td colspan="7">لا يوجد رصيد إكسسوار حالي.</td></tr>', "</tbody></table></section>"), type);
  }
  if (type === 'delays') {
    var rows = list.filter(function (order) {
      return cleanOperationalStage(getOperationalStage(order)) !== 'مكتمل';
    }).map(function (order) {
      var stageDate = stageStartDate(order);
      return {
        order: order,
        stage: cleanOperationalStage(getOperationalStage(order)),
        stageDate: stageDate,
        days: daysSince(stageDate)
      };
    }).sort(function (a, b) {
      return b.days - a.days;
    }).map(function (_ref29) {
      var order = _ref29.order,
        stage = _ref29.stage,
        stageDate = _ref29.stageDate,
        days = _ref29.days;
      return "<tr><td>".concat(order.orderNumber, "</td><td>").concat(order.customer, "</td><td>").concat(order.fabricType || '-', "</td><td>").concat(order.dyehouse || '-', "</td><td>").concat(stage, "</td><td>").concat(stageDate || '-', "</td><td><strong>").concat(days, "</strong></td><td>").concat(reportFmt(order.totalRawOrdered), "</td><td>").concat(reportFmt(order.totalFinishedReceived), "</td><td>").concat(reportFmt(order.totalDeliveredToCustomer), "</td></tr>");
    }).join('');
    return showManagementReport('تقرير التأخيرات', 'الطلبات المفتوحة أو المتأخرة حسب مرحلة التشغيل وآخر حركة مسجلة.', "<section class=\"report-section\"><h3>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u062A\u0623\u062E\u064A\u0631</h3><table class=\"follow-table\"><thead><tr><th>\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628</th><th>\u0627\u0644\u0639\u0645\u064A\u0644</th><th>\u0627\u0644\u0635\u0646\u0641</th><th>\u0627\u0644\u0645\u0635\u0628\u063A\u0629</th><th>\u0627\u0644\u0645\u0631\u062D\u0644\u0629</th><th>\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0645\u0631\u062D\u0644\u0629</th><th>\u0623\u064A\u0627\u0645 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631</th><th>\u062E\u0627\u0645 \u0645\u0637\u0644\u0648\u0628</th><th>\u062F\u062E\u0644 \u0627\u0644\u0645\u062E\u0632\u0646</th><th>\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0639\u0645\u064A\u0644</th></tr></thead><tbody>".concat(rows || '<tr><td colspan="10">لا توجد طلبات متأخرة حاليًا.</td></tr>', "</tbody></table></section>"), type);
  }
  if (type === 'dyehouse-performance') {
    var groups = {};
    list.forEach(function (order) {
      return order.allocations.forEach(function (allocation) {
        var key = allocation.dyehouse || order.dyehouse || '-';
        groups[key] = groups[key] || {
          orders: new Set(),
          planned: 0,
          finished: 0,
          waste: 0,
          inside: 0
        };
        groups[key].orders.add(order.orderNumber);
        groups[key].planned += Number(allocation.plannedQuantity || 0);
        groups[key].finished += Number(allocation.finishedReceived || 0);
        groups[key].waste += Number(allocation.wasteQuantity || 0);
        if (cleanOperationalStage(getOperationalStage(order)) === 'تحت التشغيل بالمصبغة') groups[key].inside += 1;
      });
    });
    var _rows = Object.entries(groups).sort(function (a, b) {
      return a[0].localeCompare(b[0], 'ar');
    }).map(function (_ref30) {
      var _ref31 = _slicedToArray(_ref30, 2),
        dyehouse = _ref31[0],
        data = _ref31[1];
      return "<tr><td>".concat(dyehouse, "</td><td>").concat(data.orders.size, "</td><td>").concat(reportFmt(data.planned), "</td><td>").concat(reportFmt(data.finished), "</td><td>").concat(reportFmt(data.waste), "</td><td>").concat(data.planned ? reportFmt(data.waste / data.planned * 100, 2) : 0, "%</td><td>").concat(data.inside, "</td></tr>");
    }).join('');
    return showManagementReport('أداء المصابغ', 'مراجعة كميات التشغيل والاستلام والهالك لكل مصبغة.', "<section class=\"report-section\"><h3>\u0645\u0644\u062E\u0635 \u0627\u0644\u0645\u0635\u0627\u0628\u063A</h3><table class=\"follow-table\"><thead><tr><th>\u0627\u0644\u0645\u0635\u0628\u063A\u0629</th><th>\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0628\u0627\u062A</th><th>\u0627\u0644\u0645\u062E\u0637\u0637</th><th>\u062F\u062E\u0644 \u0627\u0644\u0645\u062E\u0632\u0646</th><th>\u0647\u0627\u0644\u0643 \u0641\u0639\u0644\u064A</th><th>\u0646\u0633\u0628\u0629 \u0627\u0644\u0647\u0627\u0644\u0643</th><th>\u0637\u0644\u0628\u0627\u062A \u062F\u0627\u062E\u0644 \u0627\u0644\u0645\u0635\u0628\u063A\u0629</th></tr></thead><tbody>".concat(_rows || '<tr><td colspan="7">لا توجد بيانات أداء للمصابغ.</td></tr>', "</tbody></table></section>"), type);
  }
  if (type === 'waste-analysis') {
    var _rows2 = list.flatMap(function (order) {
      return order.allocations.map(function (allocation) {
        return "<tr><td>".concat(order.orderNumber, "</td><td>").concat(order.customer, "</td><td>").concat(order.fabricType || '-', "</td><td>").concat(allocation.color || '-', "</td><td>").concat(allocation.dyehouse || '-', "</td><td>").concat(reportFmt(allocation.plannedQuantity), "</td><td>").concat(reportFmt(allocation.finishedReceived), "</td><td>").concat(reportFmt(allocation.expectedWasteQuantity), " (").concat(reportFmt(allocation.expectedWastePercent, 2), "%)</td><td>").concat(reportFmt(allocation.wasteQuantity), " (").concat(reportFmt(allocation.wastePercent, 2), "%)</td><td>").concat(reportFmt(Number(allocation.wasteQuantity || 0) - Number(allocation.expectedWasteQuantity || 0)), "</td></tr>");
      });
    }).join('');
    return showManagementReport('تحليل الهالك', 'مقارنة الهالك التقديري بالهالك الفعلي حسب كل لون.', "<section class=\"report-section\"><h3>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0647\u0627\u0644\u0643</h3><table class=\"follow-table\"><thead><tr><th>\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628</th><th>\u0627\u0644\u0639\u0645\u064A\u0644</th><th>\u0627\u0644\u0635\u0646\u0641</th><th>\u0627\u0644\u0644\u0648\u0646</th><th>\u0627\u0644\u0645\u0635\u0628\u063A\u0629</th><th>\u0627\u0644\u0645\u062E\u0637\u0637</th><th>\u062F\u062E\u0644 \u0627\u0644\u0645\u062E\u0632\u0646</th><th>\u0647\u0627\u0644\u0643 \u062A\u0642\u062F\u064A\u0631\u064A</th><th>\u0647\u0627\u0644\u0643 \u0641\u0639\u0644\u064A</th><th>\u0627\u0644\u0641\u0631\u0642</th></tr></thead><tbody>".concat(_rows2 || '<tr><td colspan="10">لا توجد بيانات هالك حاليًا.</td></tr>', "</tbody></table></section>"), type);
  }
  if (type === 'customer-account') {
    var _groups = {};
    list.forEach(function (order) {
      var key = order.customer || '-';
      _groups[key] = _groups[key] || {
        count: 0,
        contract: 0,
        raw: 0,
        finished: 0,
        delivered: 0,
        balance: 0,
        open: 0
      };
      _groups[key].count += 1;
      _groups[key].contract += Number(order.contractTotal || order.totalContract || Number(order.kiloPrice || 0) * Number(order.totalRawOrdered || 0) || 0);
      _groups[key].raw += Number(order.totalRawOrdered || 0);
      _groups[key].finished += Number(order.totalFinishedReceived || 0);
      _groups[key].delivered += Number(order.totalDeliveredToCustomer || 0);
      _groups[key].balance += Number(order.warehouseBalance || 0);
      if (cleanOperationalStage(getOperationalStage(order)) !== 'مكتمل') _groups[key].open += 1;
    });
    var _rows3 = Object.entries(_groups).sort(function (a, b) {
      return a[0].localeCompare(b[0], 'ar');
    }).map(function (_ref32) {
      var _ref33 = _slicedToArray(_ref32, 2),
        customer = _ref33[0],
        data = _ref33[1];
      return "<tr><td>".concat(customer, "</td><td>").concat(data.count, "</td><td>").concat(reportFmt(data.contract, 2), "</td><td>").concat(reportFmt(data.raw), "</td><td>").concat(reportFmt(data.finished), "</td><td>").concat(reportFmt(data.delivered), "</td><td>").concat(reportFmt(data.balance), "</td><td>").concat(data.open, "</td></tr>");
    }).join('');
    return showManagementReport('تقرير العملاء', 'ملخص كل عميل داخل نظام المتابعة.', "<section class=\"report-section\"><h3>\u0645\u0644\u062E\u0635 \u0627\u0644\u0639\u0645\u0644\u0627\u0621</h3><table class=\"follow-table\"><thead><tr><th>\u0627\u0644\u0639\u0645\u064A\u0644</th><th>\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0628\u0627\u062A</th><th>\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0639\u0642\u0648\u062F</th><th>\u062E\u0627\u0645 \u0645\u0637\u0644\u0648\u0628</th><th>\u062F\u062E\u0644 \u0627\u0644\u0645\u062E\u0632\u0646</th><th>\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0639\u0645\u064A\u0644</th><th>\u0631\u0635\u064A\u062F \u0627\u0644\u0645\u062E\u0632\u0646</th><th>\u0637\u0644\u0628\u0627\u062A \u0645\u0641\u062A\u0648\u062D\u0629</th></tr></thead><tbody>".concat(_rows3 || '<tr><td colspan="8">لا توجد بيانات عملاء.</td></tr>', "</tbody></table></section>"), type);
  }
  if (type === 'order-movement') {
    var _rows4 = list.map(function (order) {
      var dates = orderMovementDates(order);
      return "<tr><td>".concat(order.orderNumber, "</td><td>").concat(order.customer, "</td><td>").concat(order.fabricType || '-', "</td><td>").concat(dates.orderDate, "</td><td>").concat(dates.weavingDate, "</td><td>").concat(dates.dyehouseDate, "</td><td>").concat(dates.customerDate, "</td><td>").concat(cleanOperationalStage(getOperationalStage(order)), "</td></tr>");
    }).join('');
    return showManagementReport('حركة الطلبات', 'تواريخ انتقال الطلبات بين مراحل التشغيل.', "<section class=\"report-section\"><h3>\u062A\u0648\u0627\u0631\u064A\u062E \u0627\u0644\u062D\u0631\u0643\u0629</h3><table class=\"follow-table\"><thead><tr><th>\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628</th><th>\u0627\u0644\u0639\u0645\u064A\u0644</th><th>\u0627\u0644\u0635\u0646\u0641</th><th>\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0637\u0644\u0628</th><th>\u062E\u0631\u0648\u062C \u0627\u0644\u062E\u0627\u0645 \u0644\u0644\u0645\u0635\u0628\u063A\u0629</th><th>\u062F\u062E\u0648\u0644 \u0627\u0644\u0645\u062E\u0632\u0646</th><th>\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0639\u0645\u064A\u0644</th><th>\u0645\u0631\u062D\u0644\u0629 \u0627\u0644\u062A\u0634\u063A\u064A\u0644</th></tr></thead><tbody>".concat(_rows4 || '<tr><td colspan="8">لا توجد حركات طلبات.</td></tr>', "</tbody></table></section>"), type);
  }
  if (type === 'raw-returns') {
    var _rows5 = rawReturns.map(function (batch) {
      var allocation = allocations.find(function (item) {
        return item.id === batch.allocationId;
      });
      var sourceOrder = orders.find(function (item) {
        return item.id === batch.orderId || item.id === (allocation === null || allocation === void 0 ? void 0 : allocation.orderId);
      });
      var order = sourceOrder ? calculateOrder(sourceOrder) : {
        orderNumber: '-',
        customer: '-'
      };
      return "<tr><td>".concat(batch.date || '-', "</td><td>").concat(order.orderNumber || '-', "</td><td>").concat(order.customer || '-', "</td><td>").concat((allocation === null || allocation === void 0 ? void 0 : allocation.color) || '-', "</td><td>").concat((allocation === null || allocation === void 0 ? void 0 : allocation.dyehouse) || '-', "</td><td>").concat(reportFmt(batch.quantity), "</td><td>").concat(batch.noteNumber || '-', "</td><td>").concat(batch.notes || '-', "</td></tr>");
    }).join('');
    return showManagementReport('مرتجعات الخام', 'حركات الخام المرتجع من المصبغة أو التشغيل.', "<section class=\"report-section\"><h3>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A</h3><table class=\"follow-table\"><thead><tr><th>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</th><th>\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628</th><th>\u0627\u0644\u0639\u0645\u064A\u0644</th><th>\u0627\u0644\u0644\u0648\u0646</th><th>\u0627\u0644\u0645\u0635\u0628\u063A\u0629</th><th>\u0627\u0644\u0643\u0645\u064A\u0629</th><th>\u0631\u0642\u0645 \u0627\u0644\u0625\u0630\u0646</th><th>\u0645\u0644\u0627\u062D\u0638\u0627\u062A</th></tr></thead><tbody>".concat(_rows5 || '<tr><td colspan="8">لا توجد مرتجعات خام.</td></tr>', "</tbody></table></section>"), type);
  }
  if (type === 'accessories') {
    var _rows6 = [];
    list.filter(function (order) {
      return order.accessoryLines.length;
    }).forEach(function (order) {
      return order.allocations.forEach(function (allocation) {
        var sent = sum(accessoryBatches.filter(function (batch) {
          return batch.allocationId === allocation.id && batch.movement === 'sent';
        }));
        var received = sum(accessoryBatches.filter(function (batch) {
          return batch.allocationId === allocation.id && batch.movement === 'received';
        }));
        var delivered = sum(accessoryBatches.filter(function (batch) {
          return batch.allocationId === allocation.id && batch.movement === 'customer';
        }));
        _rows6.push("<tr><td>".concat(order.orderNumber, "</td><td>").concat(order.customer, "</td><td>").concat(allocation.color || '-', "</td><td>").concat(accessoryTypesLabel(order), "</td><td>").concat(reportFmt(allocation.accessoryQuantity), "</td><td>").concat(reportFmt(sent), "</td><td>").concat(reportFmt(received), "</td><td>").concat(reportFmt(delivered), "</td><td>").concat(reportFmt(received - delivered), "</td></tr>"));
      });
    });
    return showManagementReport('تقرير الإكسسوار', 'حركات الإكسسوار خروجًا واستلامًا وتسليمًا.', "<section class=\"report-section\"><h3>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631</h3><table class=\"follow-table\"><thead><tr><th>\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628</th><th>\u0627\u0644\u0639\u0645\u064A\u0644</th><th>\u0627\u0644\u0644\u0648\u0646</th><th>\u0646\u0648\u0639 \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631</th><th>\u0627\u0644\u0645\u0637\u0644\u0648\u0628</th><th>\u0627\u0644\u0645\u0631\u0633\u0644</th><th>\u0627\u0644\u0645\u0633\u062A\u0644\u0645</th><th>\u0627\u0644\u0645\u0633\u0644\u0645 \u0644\u0644\u0639\u0645\u064A\u0644</th><th>\u0627\u0644\u0631\u0635\u064A\u062F</th></tr></thead><tbody>".concat(_rows6.join('') || '<tr><td colspan="9">لا توجد حركات إكسسوار.</td></tr>', "</tbody></table></section>"), type);
  }
}
function activeOrderFilterSummary() {
  var _refs$searchInput, _refs$customerFilter, _refs$dyehouseFilter, _refs$fabricFilter, _refs$orderStatusFilt;
  var parts = [];
  var query = (_refs$searchInput = refs.searchInput) === null || _refs$searchInput === void 0 || (_refs$searchInput = _refs$searchInput.value) === null || _refs$searchInput === void 0 ? void 0 : _refs$searchInput.trim();
  if (query) parts.push("\u0628\u062D\u062B: ".concat(query));
  if ((_refs$customerFilter = refs.customerFilter) !== null && _refs$customerFilter !== void 0 && _refs$customerFilter.value && refs.customerFilter.value !== 'all') parts.push("\u0627\u0644\u0639\u0645\u064A\u0644: ".concat(refs.customerFilter.value));
  if ((_refs$dyehouseFilter = refs.dyehouseFilter) !== null && _refs$dyehouseFilter !== void 0 && _refs$dyehouseFilter.value && refs.dyehouseFilter.value !== 'all') parts.push("\u0627\u0644\u0645\u0635\u0628\u063A\u0629: ".concat(refs.dyehouseFilter.value));
  if ((_refs$fabricFilter = refs.fabricFilter) !== null && _refs$fabricFilter !== void 0 && _refs$fabricFilter.value && refs.fabricFilter.value !== 'all') parts.push("\u0627\u0644\u0635\u0646\u0641: ".concat(refs.fabricFilter.value));
  if ((_refs$orderStatusFilt = refs.orderStatusFilter) !== null && _refs$orderStatusFilt !== void 0 && _refs$orderStatusFilt.value && refs.orderStatusFilter.value !== 'all') parts.push("\u0627\u0644\u062D\u0627\u0644\u0629: ".concat(statusLabel(refs.orderStatusFilter.value) || refs.orderStatusFilter.value));
  return parts.join(' | ') || 'كل الطلبات الظاهرة';
}
function openOrdersReport() {
  var sourceList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'تقرير متابعة الطلبات';
  var subtitle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ملخص الطلبات وحالتها من الخام والإكسسوار حتى التسليم.';
  var reportKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'orders-follow';
  var list = Array.isArray(sourceList) ? sourceList : allOrders();
  var fmt = function fmt(value) {
    return Number(value || 0).toLocaleString('en-US', {
      maximumFractionDigits: 2
    });
  };
  var totals = list.reduce(function (acc, order) {
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
  }, {
    raw: 0,
    received: 0,
    sent: 0,
    finished: 0,
    delivered: 0,
    balance: 0,
    waste: 0,
    accessoryRequired: 0,
    accessorySent: 0,
    accessoryReceived: 0,
    accessoryDelivered: 0,
    accessoryBalance: 0
  });
  var rows = list.map(function (order) {
    return "<tr><td>".concat(order.orderNumber || '-', "</td><td>").concat(order.customer || '-', "</td><td>").concat(order.fabricType || '-', "</td><td>").concat(order.dyehouse || '-', "</td><td><span class=\"status ").concat(order.status || '', "\">").concat(statusLabel(order.status), "</span></td><td>").concat(cleanOperationalStage(getOperationalStage(order)), "</td><td>").concat(fmt(order.totalRawOrdered), "</td><td>").concat(fmt(order.totalRawReceived), "</td><td>").concat(fmt(order.totalSentToDyehouse), "</td><td>").concat(fmt(order.totalFinishedReceived), "</td><td>").concat(fmt(order.warehouseBalance), "</td><td>").concat(fmt(order.totalDeliveredToCustomer), "</td><td>").concat(fmt(order.totalWaste), " (").concat(formatNumber(order.totalWastePercent || 0, 1), "%)</td><td>").concat(fmt(order.accessoryRequired || 0), "</td><td>").concat(fmt(order.accessorySent || 0), "</td><td>").concat(fmt(order.accessoryReceived || 0), "</td><td>").concat(fmt(order.accessoryDelivered || 0), "</td><td>").concat(fmt(order.accessoryBalance || 0), "</td></tr>");
  }).join('');
  var summary = "<section class=\"report-section\"><h3>\u0645\u0644\u062E\u0635 \u0627\u0644\u0643\u0645\u064A\u0627\u062A</h3><table class=\"summary-table\"><tbody><tr><th>\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062E\u0627\u0645 \u0627\u0644\u0645\u0637\u0644\u0648\u0628</th><td>".concat(fmt(totals.raw), "</td><th>\u0627\u0644\u062E\u0627\u0645\u0629 \u0627\u0644\u0645\u0633\u062A\u0644\u0645\u0629</th><td>").concat(fmt(totals.received), "</td></tr><tr><th>\u0645\u0631\u0633\u0644 \u0644\u0644\u0645\u0635\u0628\u063A\u0629</th><td>").concat(fmt(totals.sent), "</td><th>\u062F\u062E\u0644 \u0627\u0644\u0645\u062E\u0632\u0646</th><td>").concat(fmt(totals.finished), "</td></tr><tr><th>\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0639\u0645\u064A\u0644</th><td>").concat(fmt(totals.delivered), "</td><th>\u0631\u0635\u064A\u062F \u0627\u0644\u0645\u062E\u0632\u0646</th><td>").concat(fmt(totals.balance), "</td></tr><tr><th>\u0625\u0643\u0633\u0633\u0648\u0627\u0631 \u0645\u0637\u0644\u0648\u0628</th><td>").concat(fmt(totals.accessoryRequired), "</td><th>\u0625\u0643\u0633\u0633\u0648\u0627\u0631 \u0645\u0633\u062A\u0644\u0645</th><td>").concat(fmt(totals.accessoryReceived), "</td></tr><tr><th>\u0631\u0635\u064A\u062F \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631</th><td>").concat(fmt(totals.accessoryBalance), "</td><th>\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0628\u0627\u062A</th><td>").concat(list.length, "</td></tr></tbody></table></section>");
  var table = "<section class=\"report-section\"><h3>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0637\u0644\u0628\u0627\u062A</h3><table class=\"follow-table\"><thead><tr><th>\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628</th><th>\u0627\u0644\u0639\u0645\u064A\u0644</th><th>\u0627\u0644\u0635\u0646\u0641</th><th>\u0627\u0644\u0645\u0635\u0628\u063A\u0629</th><th>\u0627\u0644\u062D\u0627\u0644\u0629</th><th>\u0627\u0644\u0645\u0631\u062D\u0644\u0629</th><th>\u062E\u0627\u0645 \u0645\u0637\u0644\u0648\u0628</th><th>\u062E\u0627\u0645 \u0645\u0633\u062A\u0644\u0645</th><th>\u0645\u0631\u0633\u0644 \u0644\u0644\u0645\u0635\u0628\u063A\u0629</th><th>\u062F\u062E\u0644 \u0627\u0644\u0645\u062E\u0632\u0646</th><th>\u0631\u0635\u064A\u062F \u0627\u0644\u0645\u062E\u0632\u0646</th><th>\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0639\u0645\u064A\u0644</th><th>\u0627\u0644\u0647\u0627\u0644\u0643</th><th>\u0625\u0643\u0633\u0633\u0648\u0627\u0631 \u0645\u0637\u0644\u0648\u0628</th><th>\u0625\u0643\u0633\u0633\u0648\u0627\u0631 \u0645\u0631\u0633\u0644</th><th>\u0625\u0643\u0633\u0633\u0648\u0627\u0631 \u0645\u0633\u062A\u0644\u0645</th><th>\u0625\u0643\u0633\u0633\u0648\u0627\u0631 \u0645\u0633\u0644\u0645</th><th>\u0631\u0635\u064A\u062F \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631</th></tr></thead><tbody>".concat(rows || emptyRow(18, 'لا توجد طلبات مسجلة.'), "</tbody></table></section>");
  showManagementReport(title, subtitle, "".concat(summary).concat(table), reportKey);
}
function openFilteredOrdersReport() {
  var list = filteredOrders();
  var summary = activeOrderFilterSummary();
  openOrdersReport(list, 'تقرير الطلبات حسب الفلترة', "".concat(summary, " - \u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0628\u0627\u062A: ").concat(list.length), 'filtered-orders');
}
function openDyehouseBalancesReport() {
  var list = allOrders();
  var fmt = function fmt(value) {
    return Number(value || 0).toLocaleString('en-US', {
      maximumFractionDigits: 2
    });
  };
  var groups = {};
  list.forEach(function (order) {
    (order.allocations || []).forEach(function (allocation) {
      var name = allocation.dyehouse || order.dyehouse || 'غير محدد';
      groups[name] = groups[name] || {
        colors: 0,
        planned: 0,
        sent: 0,
        finished: 0,
        remaining: 0,
        waste: 0,
        accessoryRequired: 0,
        accessoryReceived: 0,
        accessoryBalance: 0
      };
      groups[name].colors += 1;
      groups[name].planned += Number(allocation.plannedQuantity || 0);
      groups[name].sent += Number(allocation.sentToDyehouse || 0);
      groups[name].finished += Number(allocation.finishedReceived || 0);
      groups[name].remaining += Math.max(0, Number(allocation.sentToDyehouse || 0) - Number(allocation.finishedReceived || 0));
      groups[name].waste += Number(allocation.wasteQuantity || 0);
      groups[name].accessoryRequired += Number(allocation.accessoryQuantity || 0);
    });
    if ((order.accessoryLines || []).length) {
      var name = order.dyehouse || 'غير محدد';
      groups[name] = groups[name] || {
        colors: 0,
        planned: 0,
        sent: 0,
        finished: 0,
        remaining: 0,
        waste: 0,
        accessoryRequired: 0,
        accessoryReceived: 0,
        accessoryBalance: 0
      };
      groups[name].accessoryReceived += Number(order.accessoryReceived || 0);
      groups[name].accessoryBalance += Number(order.accessoryBalance || 0);
    }
  });
  var rows = Object.entries(groups).sort(function (a, b) {
    return a[0].localeCompare(b[0], 'ar');
  }).map(function (_ref34) {
    var _ref35 = _slicedToArray(_ref34, 2),
      name = _ref35[0],
      data = _ref35[1];
    return "<tr><td>".concat(name, "</td><td>").concat(data.colors, "</td><td>").concat(fmt(data.planned), "</td><td>").concat(fmt(data.sent), "</td><td>").concat(fmt(data.finished), "</td><td>").concat(fmt(data.remaining), "</td><td>").concat(fmt(data.waste), "</td><td>").concat(fmt(data.accessoryRequired), "</td><td>").concat(fmt(data.accessoryReceived), "</td><td>").concat(fmt(data.accessoryBalance), "</td></tr>");
  }).join('');
  var table = "<section class=\"report-section\"><h3>\u0623\u0631\u0635\u062F\u0629 \u0627\u0644\u0645\u0635\u0627\u0628\u063A</h3><table class=\"follow-table\"><thead><tr><th>\u0627\u0644\u0645\u0635\u0628\u063A\u0629</th><th>\u0639\u062F\u062F \u0627\u0644\u0623\u0644\u0648\u0627\u0646</th><th>\u0627\u0644\u0645\u062E\u0637\u0637</th><th>\u0645\u0631\u0633\u0644 \u0644\u0644\u0645\u0635\u0628\u063A\u0629</th><th>\u062F\u062E\u0644 \u0627\u0644\u0645\u062E\u0632\u0646</th><th>\u0645\u062A\u0628\u0642\u064A \u0628\u0627\u0644\u0645\u0635\u0628\u063A\u0629</th><th>\u0647\u0627\u0644\u0643 \u0641\u0639\u0644\u064A</th><th>\u0625\u0643\u0633\u0633\u0648\u0627\u0631 \u0645\u0637\u0644\u0648\u0628</th><th>\u0625\u0643\u0633\u0633\u0648\u0627\u0631 \u0645\u0633\u062A\u0644\u0645</th><th>\u0631\u0635\u064A\u062F \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631</th></tr></thead><tbody>".concat(rows || emptyRow(10, 'لا توجد أرصدة مصابغ حالية.'), "</tbody></table></section>");
  showManagementReport('تقرير أرصدة المصابغ', 'الكميات المتبقية داخل كل مصبغة حسب الطلبات والألوان والإكسسوار.', table, 'dyehouse-balances');
}
function emptyRow(colspan) {
  var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'لا توجد بيانات مسجلة.';
  return "<tr><td colspan=\"".concat(colspan, "\">").concat(text, "</td></tr>");
}
function dyehouseNamesForOrder(order) {
  var originalDyehouse = String((order === null || order === void 0 ? void 0 : order.dyehouse) || '').trim();
  var transferDyehouses = dyehouseTransfers.filter(function (transfer) {
    return transfer.orderId === (order === null || order === void 0 ? void 0 : order.id);
  }).map(function (transfer) {
    return transfer.toDyehouse;
  });
  var allocationDyehouses = ((order === null || order === void 0 ? void 0 : order.allocations) || []).map(function (allocation) {
    return allocation.dyehouse || originalDyehouse;
  });
  return uniqueNonEmpty([originalDyehouse].concat(_toConsumableArray(allocationDyehouses), _toConsumableArray(transferDyehouses)));
}
function operationNotesKey(type) {
  var dyehouseName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var name = String(dyehouseName || '').trim();
  return type === 'dyeing' ? "dyeing:".concat(name || 'default') : 'weaving';
}
function combinedOperationNotes(order) {
  var sections = [];
  if (String((order === null || order === void 0 ? void 0 : order.notes) || '').trim()) sections.push("\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u0637\u0644\u0628: ".concat(String(order.notes).trim()));
  var notes = order !== null && order !== void 0 && order.operationNotes && _typeof(order.operationNotes) === 'object' && !Array.isArray(order.operationNotes) ? order.operationNotes : {};
  if (String(notes.weaving || '').trim()) sections.push("\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u0646\u0633\u064A\u062C: ".concat(String(notes.weaving).trim()));
  Object.entries(notes).filter(function (_ref36) {
    var _ref37 = _slicedToArray(_ref36, 2),
      key = _ref37[0],
      value = _ref37[1];
    return key.startsWith('dyeing:') && String(value || '').trim();
  }).forEach(function (_ref38) {
    var _ref39 = _slicedToArray(_ref38, 2),
      key = _ref39[0],
      value = _ref39[1];
    var dyehouseName = key.slice('dyeing:'.length) || 'المصبغة';
    sections.push("\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u0635\u0628\u0627\u063A\u0629 - ".concat(dyehouseName, ": ").concat(String(value).trim()));
  });
  return uniqueNonEmpty(sections).join('\n') || '-';
}
function reportOperationNotes(order) {
  if (order.reportNotesText !== undefined) return String(order.reportNotesText || '').trim() || '-';
  if (order.operationNoteText !== undefined) return String(order.operationNoteText || '').trim() || '-';
  return order.notes || '-';
}
var _window$TwoBTexDocume = window.TwoBTexDocuments.createBuilders({
    accessoryDocumentSection: accessoryDocumentSection,
    documentFooter: documentFooter,
    documentHeader: documentHeader,
    documentLogo: documentLogo,
    emptyRow: emptyRow,
    escapeHtml: escapeHtml,
    formatNumber: formatNumber,
    getFirstRawNoteNumber: getFirstRawNoteNumber,
    orderRawCost: orderRawCost,
    rawPermitImagesSection: rawPermitImagesSection,
    reportOperationNotes: reportOperationNotes,
    uniqueNonEmpty: uniqueNonEmpty,
    sum: sum,
    roundNumber: roundNumber,
    accessoryTypesLabel: accessoryTypesLabel
  }),
  buildCompactFullReportDocument = _window$TwoBTexDocume.buildCompactFullReportDocument,
  buildDyeingOrderDocument = _window$TwoBTexDocume.buildDyeingOrderDocument,
  buildDyeingSummaryDocument = _window$TwoBTexDocume.buildDyeingSummaryDocument,
  buildLabSamplesDocument = _window$TwoBTexDocume.buildLabSamplesDocument,
  buildQuotationDocument = _window$TwoBTexDocume.buildQuotationDocument,
  buildStickersDocument = _window$TwoBTexDocume.buildStickersDocument,
  buildWasteReportDocument = _window$TwoBTexDocume.buildWasteReportDocument,
  buildWeavingOrderDocument = _window$TwoBTexDocume.buildWeavingOrderDocument;
function openDyeingDocumentForDyehouse(_x44) {
  return _openDyeingDocumentForDyehouse.apply(this, arguments);
}
function _openDyeingDocumentForDyehouse() {
  _openDyeingDocumentForDyehouse = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee67(dyehouseName) {
    var sourceOrder, name, operationNoteText, refreshedSourceOrder, order, fmt, reportOrder;
    return _regenerator().w(function (_context67) {
      while (1) switch (_context67.n) {
        case 0:
          if (!backendAvailable) {
            _context67.n = 1;
            break;
          }
          _context67.n = 1;
          return loadBackendData();
        case 1:
          sourceOrder = orders.find(function (item) {
            return item.id === selectedOrderId;
          });
          if (sourceOrder) {
            _context67.n = 2;
            break;
          }
          return _context67.a(2);
        case 2:
          name = String(dyehouseName || '').trim();
          _context67.n = 3;
          return promptOperationNotes(sourceOrder, 'dyeing', name);
        case 3:
          operationNoteText = _context67.v;
          if (!(operationNoteText === null)) {
            _context67.n = 4;
            break;
          }
          return _context67.a(2);
        case 4:
          refreshedSourceOrder = orders.find(function (item) {
            return item.id === selectedOrderId;
          }) || sourceOrder;
          order = calculateOrder(refreshedSourceOrder);
          fmt = function fmt(value) {
            return roundNumber(value).toLocaleString('en-US', {
              maximumFractionDigits: 3
            });
          };
          reportOrder = _objectSpread(_objectSpread({}, order), {}, {
            operationNoteText: operationNoteText,
            whatsappDyehouseName: name
          });
          currentDocumentType = 'dyeing';
          refs.documentTitle.textContent = "\u0623\u0645\u0631 \u0635\u0628\u0627\u063A\u0629 - ".concat(name || '-');
          refs.documentBody.dataset.documentType = 'dyeing';
          refs.documentBody.dataset.dyehouseName = name;
          refs.documentBody.innerHTML = "<div class=\"document-sheet dyeing-document\">".concat(withDocumentFooter(buildDyeingOrderDocument(_objectSpread(_objectSpread({}, reportOrder), {}, {
            rawBatches: rawBatches,
            dyehouseTransfers: dyehouseTransfers
          }), name, fmt)), "</div>");
          if (refs.documentDialog.open) refs.documentDialog.close();
          refs.documentDialog.showModal();
          queueDocumentReport('dyeing', reportOrder);
        case 5:
          return _context67.a(2);
      }
    }, _callee67);
  }));
  return _openDyeingDocumentForDyehouse.apply(this, arguments);
}
function openDocument(_x45) {
  return _openDocument.apply(this, arguments);
}
function _openDocument() {
  _openDocument = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee68(type) {
    var sourceOrder, order, names, fmt, safe, titleMap, title, body, alreadyWrapped, operationNoteText, refreshedSourceOrder;
    return _regenerator().w(function (_context68) {
      while (1) switch (_context68.n) {
        case 0:
          if (!backendAvailable) {
            _context68.n = 1;
            break;
          }
          _context68.n = 1;
          return loadBackendData();
        case 1:
          sourceOrder = orders.find(function (item) {
            return item.id === selectedOrderId;
          });
          if (sourceOrder) {
            _context68.n = 2;
            break;
          }
          alert('اختر طلبًا أولًا.');
          return _context68.a(2);
        case 2:
          order = calculateOrder(sourceOrder);
          if (!(type === 'dyeing')) {
            _context68.n = 5;
            break;
          }
          names = dyehouseNamesForOrder(order);
          if (!(names.length > 1)) {
            _context68.n = 3;
            break;
          }
          renderDyehouseDocumentPicker(order);
          _context68.n = 4;
          break;
        case 3:
          _context68.n = 4;
          return openDyeingDocumentForDyehouse(names[0] || order.dyehouse || '');
        case 4:
          return _context68.a(2);
        case 5:
          fmt = function fmt(value) {
            return formatNumber(Number(value || 0));
          };
          safe = function safe(value) {
            return escapeHtml(value || '-');
          };
          titleMap = {
            quotation: 'عرض سعر',
            weaving: 'أمر تشغيل نسيج',
            dyeing: 'أمر تشغيل صباغة',
            waste: 'تقرير الهالك',
            fullreport: 'التقرير التفصيلي للطلب',
            labSamples: 'عينات معمل',
            stickers: 'استيكرات التشغيل'
          };
          title = titleMap[type] || 'مستند تشغيلي';
          currentDocumentType = type;
          refs.documentTitle.textContent = title;
          refs.documentBody.dataset.documentType = type;
          refs.documentBody.dataset.reportTitle = title;
          refs.documentBody.dataset.reportSubtitle = "\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628: ".concat(order.orderNumber || '-', " - \u0627\u0644\u0639\u0645\u064A\u0644: ").concat(order.customer || '-');
          if (type === 'dyeing') refs.documentBody.dataset.dyehouseName = order.dyehouse || '';
          body = '';
          alreadyWrapped = false;
          if (!(type === 'quotation')) {
            _context68.n = 6;
            break;
          }
          body = buildQuotationDocument(order, fmt, safe);
          _context68.n = 10;
          break;
        case 6:
          if (!(type === 'weaving')) {
            _context68.n = 9;
            break;
          }
          _context68.n = 7;
          return promptOperationNotes(sourceOrder, 'weaving');
        case 7:
          operationNoteText = _context68.v;
          if (!(operationNoteText === null)) {
            _context68.n = 8;
            break;
          }
          return _context68.a(2);
        case 8:
          refreshedSourceOrder = orders.find(function (item) {
            return item.id === selectedOrderId;
          }) || sourceOrder;
          order = calculateOrder(refreshedSourceOrder);
          body = buildWeavingOrderDocument(_objectSpread(_objectSpread({}, order), {}, {
            operationNoteText: operationNoteText,
            rawBatches: rawBatches,
            dyehouseTransfers: dyehouseTransfers
          }), fmt, safe);
          _context68.n = 10;
          break;
        case 9:
          if (type === 'dyeing') {
            body = buildDyeingSummaryDocument(order, fmt, safe);
          } else if (type === 'waste') {
            body = buildWasteReportDocument(_objectSpread(_objectSpread({}, order), {}, {
              reportNotesText: combinedOperationNotes(order)
            }), fmt, safe);
          } else if (type === 'fullreport') {
            body = buildCompactFullReportDocument(_objectSpread(_objectSpread({}, order), {}, {
              reportNotesText: combinedOperationNotes(order)
            }), fmt, safe);
          } else if (type === 'labSamples') {
            body = buildLabSamplesDocument(order, fmt, safe);
            alreadyWrapped = true;
          } else if (type === 'stickers') {
            body = buildStickersDocument(order, fmt, safe);
            alreadyWrapped = true;
          } else {
            body = "".concat(documentHeader(), "<div class=\"report-title\"><h2>").concat(title, "</h2></div><div class=\"document-meta\"><div><span>\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628</span>").concat(safe(order.orderNumber), "</div><div><span>\u0627\u0644\u0639\u0645\u064A\u0644</span>").concat(safe(order.customer), "</div><div><span>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</span>").concat(safe(order.orderDate), "</div><div><span>\u0627\u0644\u0635\u0646\u0641</span>").concat(safe(order.fabricType), "</div><div><span>\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062E\u0627\u0645</span>").concat(fmt(order.totalRawOrdered), "</div><div><span>\u0627\u0644\u0645\u0635\u0628\u063A\u0629</span>").concat(safe(order.dyehouse), "</div></div>").concat(documentFooter());
          }
        case 10:
          refs.documentBody.innerHTML = alreadyWrapped ? body : "<div class=\"document-sheet\">".concat(body, "</div>");
          if (refs.documentDialog.open) refs.documentDialog.close();
          refs.documentDialog.showModal();
        case 11:
          return _context68.a(2);
      }
    }, _callee68);
  }));
  return _openDocument.apply(this, arguments);
}
function installAmalReviewUi() {
  var _document$getElementB0;
  refs.weavingSlipType.innerHTML = '<option value="weaving">إذن خام رايح للمصبغة</option>';
  (_document$getElementB0 = document.getElementById('amalReviewBox')) === null || _document$getElementB0 === void 0 || _document$getElementB0.remove();
}
function toggleAmalReviewMode() {
  var _document$getElementB1;
  var normalGrid = refs.weavingSlipOrderNumber.closest('.form-grid');
  if (normalGrid) normalGrid.style.display = '';
  (_document$getElementB1 = document.getElementById('amalReviewBox')) === null || _document$getElementB1 === void 0 || _document$getElementB1.remove();
  refs.weavingSlipForm.querySelector('.dialog-actions .primary-btn').textContent = 'تسجيل المستند';
}
function renderAmalSuggestion() {
  var suggestion = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  pendingAmalSuggestion = cloneAmalSuggestion(suggestion);
  var $ = function $(id) {
    return document.getElementById(id);
  };
  $('amalOrderNumber').value = pendingAmalSuggestion.orderNumber || '';
  $('amalCustomer').value = pendingAmalSuggestion.customer || '';
  $('amalOrderDate').value = pendingAmalSuggestion.orderDate || '';
  $('amalDyehouse').value = pendingAmalSuggestion.dyehouse || '';
  $('amalRawNote').value = pendingAmalSuggestion.rawNoteNumber || '';
  $('amalWeavingSource').value = pendingAmalSuggestion.weavingSource || 'مصدر النسيج';
  $('amalSpecs').value = pendingAmalSuggestion.specs || '';
  var rows = pendingAmalSuggestion.rows && pendingAmalSuggestion.rows.length ? pendingAmalSuggestion.rows : [{}];
  $('amalLinesBody').innerHTML = rows.map(function (row, index) {
    return "\n    <tr data-amal-row=\"".concat(index, "\">\n      <td><select data-amal=\"rowType\"><option value=\"cloth\" ").concat(!isAccessoryRow(row) ? 'selected' : '', ">\u0642\u0645\u0627\u0634</option><option value=\"accessory\" ").concat(isAccessoryRow(row) ? 'selected' : '', ">\u0625\u0643\u0633\u0633\u0648\u0627\u0631</option></select></td>\n      <td><input data-amal=\"fabricType\" value=\"").concat(row.fabricType || '', "\"></td>\n      <td><input data-amal=\"inch\" value=\"").concat(row.inch || '', "\"></td>\n      <td><input data-amal=\"quantity\" type=\"number\" step=\"0.01\" value=\"").concat(row.quantity || '', "\"></td>\n      <td><input data-amal=\"pantoneCode\" value=\"").concat(row.pantoneCode || row.color || '', "\"></td>\n      <td><input data-amal=\"width\" type=\"number\" step=\"0.01\" value=\"").concat(row.width || '', "\"></td>\n      <td><input data-amal=\"weight\" type=\"number\" step=\"0.01\" value=\"").concat(row.weight || '', "\"></td>\n      <td><select data-amal=\"accessoryType\"><option value=\"\">-</option><option value=\"\u0631\u064A\u0628\" ").concat(row.accessoryType === 'ريب' ? 'selected' : '', ">\u0631\u064A\u0628</option><option value=\"\u0644\u064A\u0627\u0642\u0629\" ").concat(row.accessoryType === 'لياقة' ? 'selected' : '', ">\u0644\u064A\u0627\u0642\u0629</option><option value=\"\u0625\u0643\u0633\u0633\u0648\u0627\u0631 \u0622\u062E\u0631\" ").concat(row.accessoryType === 'إكسسوار آخر' ? 'selected' : '', ">\u0625\u0643\u0633\u0633\u0648\u0627\u0631 \u0622\u062E\u0631</option></select></td>\n    </tr>");
  }).join('');
}
function applyAmalSuggestionFromFile(file) {
  if (refs.weavingSlipType.value === 'deltexIssue') {
    var _rawIssueSuggestion$r;
    var _rawIssueSuggestion = getRawIssueSuggestionFromFile(file) || {
      orderNumber: '',
      customer: '',
      orderDate: new Date().toISOString().slice(0, 10),
      dyehouse: 'جيما',
      rawNoteNumber: '',
      weavingSource: 'دلتا تكستايل',
      specs: '',
      rows: []
    };
    renderAmalSuggestion(_rawIssueSuggestion);
    var existingOrder = findOrderForRawIssueSuggestion(_rawIssueSuggestion);
    if (existingOrder) refs.weavingSlipOrderNumber.value = existingOrder.id;
    refs.weavingSlipDate.value = _rawIssueSuggestion.orderDate || refs.weavingSlipDate.value || new Date().toISOString().slice(0, 10);
    refs.weavingSlipQuantity.value = _rawIssueSuggestion.rawIssueQuantity || ((_rawIssueSuggestion$r = _rawIssueSuggestion.rows) === null || _rawIssueSuggestion$r === void 0 ? void 0 : _rawIssueSuggestion$r.filter(function (row) {
      return !isAccessoryRow(row);
    }).reduce(function (total, row) {
      return total + Number(row.quantity || 0);
    }, 0)) || '';
    refs.weavingSlipSupplier.value = _rawIssueSuggestion.weavingSource || 'دلتا تكستايل';
    refs.weavingSlipNoteNumber.value = _rawIssueSuggestion.rawNoteNumber || '';
    refs.weavingSlipNotes.value = _rawIssueSuggestion.specs || '';
    updateDocumentReviewFields();
    refs.reviewMatchStatus.textContent = existingOrder ? "\u062A\u0645\u062A \u0645\u0637\u0627\u0628\u0642\u0629 \u0625\u0630\u0646 \u0627\u0644\u062E\u0627\u0645 \u0631\u0642\u0645 ".concat(_rawIssueSuggestion.rawNoteNumber || '-', " \u0645\u0639 \u0627\u0644\u0637\u0644\u0628 ").concat(existingOrder.orderNumber, ". \u0631\u0627\u062C\u0639 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0642\u0628\u0644 \u0627\u0644\u0627\u0639\u062A\u0645\u0627\u062F.") : "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0637\u0644\u0628 \u0645\u0631\u062A\u0628\u0637 \u0628\u0625\u0630\u0646 \u0627\u0644\u062E\u0627\u0645 \u0631\u0642\u0645 ".concat(_rawIssueSuggestion.rawNoteNumber || '-', ". \u0627\u062E\u062A\u0631 \u0627\u0644\u0637\u0644\u0628 \u064A\u062F\u0648\u064A\u064B\u0627 \u0642\u0628\u0644 \u0627\u0644\u062A\u0633\u062C\u064A\u0644.");
    return;
  }
  var rawIssueSuggestion = getRawIssueSuggestionFromFile(file);
  if (rawIssueSuggestion) {
    renderAmalSuggestion(rawIssueSuggestion);
    var _existingOrder = findOrderForRawIssueSuggestion(rawIssueSuggestion);
    if (_existingOrder) refs.weavingSlipOrderNumber.value = _existingOrder.id;
    refs.reviewMatchStatus.textContent = _existingOrder ? "\u062A\u0645\u062A \u0645\u0637\u0627\u0628\u0642\u0629 \u0625\u0630\u0646 \u0627\u0644\u062E\u0627\u0645 \u0631\u0642\u0645 ".concat(rawIssueSuggestion.rawNoteNumber || '-', " \u0645\u0639 \u0627\u0644\u0637\u0644\u0628 ").concat(_existingOrder.orderNumber, ". \u0631\u0627\u062C\u0639 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0642\u0628\u0644 \u0627\u0644\u0627\u0639\u062A\u0645\u0627\u062F.") : "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0637\u0644\u0628 \u0645\u0631\u062A\u0628\u0637 \u0628\u0625\u0630\u0646 \u0627\u0644\u062E\u0627\u0645 \u0631\u0642\u0645 ".concat(rawIssueSuggestion.rawNoteNumber || '-', ". \u0627\u062E\u062A\u0631 \u0627\u0644\u0637\u0644\u0628 \u064A\u062F\u0648\u064A\u064B\u0627 \u0642\u0628\u0644 \u0627\u0644\u062A\u0633\u062C\u064A\u0644.");
    return;
  }
  var orderNumber = getAmalOrderNumberFromFile(file);
  var suggestion = cloneAmalSuggestion(AMAL_FASHION_ORDER_LIBRARY[orderNumber] || {
    orderNumber: orderNumber,
    customer: '',
    rows: []
  });
  renderAmalSuggestion(suggestion);
  refs.reviewMatchStatus.textContent = orderNumber && AMAL_FASHION_ORDER_LIBRARY[orderNumber] ? "\u062A\u0645 \u0627\u0644\u062A\u0639\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0645\u0633\u062A\u0646\u062F \u0644\u0644\u0637\u0644\u0628 ".concat(orderNumber, ". \u0631\u0627\u062C\u0639 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0642\u0628\u0644 \u0627\u0644\u0627\u0639\u062A\u0645\u0627\u062F.") : 'لم يتم التعرف على بيانات المستند تلقائيًا. أدخل البيانات أو اختر الطلب يدويًا.';
}
function readAmalSuggestionFromUi() {
  var $ = function $(id) {
    return document.getElementById(id);
  };
  var rows = _toConsumableArray(document.querySelectorAll('#amalLinesBody tr[data-amal-row]')).map(function (tr) {
    var value = function value(name) {
      var _tr$querySelector;
      return ((_tr$querySelector = tr.querySelector("[data-amal=\"".concat(name, "\"]"))) === null || _tr$querySelector === void 0 || (_tr$querySelector = _tr$querySelector.value) === null || _tr$querySelector === void 0 ? void 0 : _tr$querySelector.trim()) || '';
    };
    var rowType = value('rowType');
    return {
      fabricType: value('fabricType'),
      inch: value('inch'),
      quantity: Number(value('quantity') || 0),
      pantoneCode: value('pantoneCode'),
      width: Number(value('width') || 0),
      weight: Number(value('weight') || 0),
      accessoryType: rowType === 'accessory' ? value('accessoryType') || 'إكسسوار' : ''
    };
  }).filter(function (row) {
    return row.fabricType || row.pantoneCode || row.quantity;
  });
  return {
    orderNumber: $('amalOrderNumber').value.trim(),
    customer: $('amalCustomer').value.trim(),
    orderDate: $('amalOrderDate').value,
    dyehouse: $('amalDyehouse').value.trim(),
    rawNoteNumber: $('amalRawNote').value.trim(),
    weavingSource: $('amalWeavingSource').value.trim(),
    specs: $('amalSpecs').value.trim(),
    rows: rows
  };
}
function confirmAmalOrderImport() {
  return _confirmAmalOrderImport.apply(this, arguments);
}
function _confirmAmalOrderImport() {
  _confirmAmalOrderImport = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee69() {
    var _accessoryRows$, _accessoryRows$find;
    var suggestion, reviewType, clothRows, accessoryRows, existing, deleted, orderId, totalRawQuantity, firstCloth, accessoryType, accessoryPercent, backendCustomer, importedOrder, savedOrder, _iterator3, _step3, _loop, _ret, rawSaved, _iterator4, _step4, row, savedAccessory, _t35, _t36;
    return _regenerator().w(function (_context70) {
      while (1) switch (_context70.p = _context70.n) {
        case 0:
          suggestion = readAmalSuggestionFromUi();
          reviewType = refs.weavingSlipType.value;
          if (!(!suggestion.orderNumber || !suggestion.customer || !suggestion.orderDate || !suggestion.dyehouse)) {
            _context70.n = 1;
            break;
          }
          alert('راجع رقم الطلب والعميل والتاريخ والمصبغة قبل الاعتماد.');
          return _context70.a(2);
        case 1:
          clothRows = suggestion.rows.filter(function (row) {
            return !isAccessoryRow(row);
          });
          accessoryRows = suggestion.rows.filter(isAccessoryRow);
          if (clothRows.length) {
            _context70.n = 2;
            break;
          }
          alert('يجب وجود بند قماش واحد على الأقل قبل الاعتماد.');
          return _context70.a(2);
        case 2:
          existing = orders.find(function (order) {
            return String(order.orderNumber) === String(suggestion.orderNumber);
          });
          if (!(existing && !confirm("\u064A\u0648\u062C\u062F \u0637\u0644\u0628 \u0645\u0633\u062C\u0644 \u0628\u0646\u0641\u0633 \u0627\u0644\u0631\u0642\u0645 ".concat(suggestion.orderNumber, ". \u0647\u0644 \u062A\u0631\u064A\u062F \u0627\u0633\u062A\u0628\u062F\u0627\u0644\u0647 \u0628\u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062D\u0627\u0644\u064A\u0629\u061F")))) {
            _context70.n = 3;
            break;
          }
          return _context70.a(2);
        case 3:
          _context70.n = 4;
          return ensureBackendForWrite('تعذر الاتصال بقاعدة البيانات. لم يتم اعتماد المستند.');
        case 4:
          if (_context70.v) {
            _context70.n = 5;
            break;
          }
          return _context70.a(2);
        case 5:
          if (!existing) {
            _context70.n = 8;
            break;
          }
          _context70.n = 6;
          return deleteBackend("/orders/".concat(existing.id));
        case 6:
          deleted = _context70.v;
          if (deleted) {
            _context70.n = 8;
            break;
          }
          _context70.n = 7;
          return rollbackAfterBackendWriteFailure('تعذر استبدال الطلب القديم في قاعدة البيانات. لم يتم اعتماد المستند.');
        case 7:
          return _context70.a(2);
        case 8:
          orderId = uid();
          totalRawQuantity = roundNumber(clothRows.reduce(function (t, row) {
            return t + Number(row.quantity || 0);
          }, 0));
          firstCloth = clothRows[0] || {};
          accessoryType = ((_accessoryRows$ = accessoryRows[0]) === null || _accessoryRows$ === void 0 ? void 0 : _accessoryRows$.accessoryType) || '';
          accessoryPercent = ((_accessoryRows$find = accessoryRows.find(function (row) {
            return row.accessoryPercent;
          })) === null || _accessoryRows$find === void 0 ? void 0 : _accessoryRows$find.accessoryPercent) || calcAccessoryPercentFromRows(suggestion.rows);
          _context70.n = 9;
          return ensureBackendCustomer(suggestion.customer);
        case 9:
          backendCustomer = _context70.v;
          importedOrder = {
            id: orderId,
            orderNumber: suggestion.orderNumber,
            customer: suggestion.customer,
            orderDate: suggestion.orderDate,
            fabricType: firstCloth.fabricType || '',
            totalRawQuantity: totalRawQuantity,
            widthMode: 'single',
            inchWidth: firstCloth.inch || '',
            widthLines: [],
            kiloPrice: 0,
            paymentTerms: '',
            accessoryType: accessoryType,
            accessoryPercent: accessoryPercent,
            dyehouse: suggestion.dyehouse,
            weavingSource: suggestion.weavingSource || '',
            notes: suggestion.specs || '',
            status: 'pending'
          };
          _context70.n = 10;
          return postBackend('/orders', orderToApi(importedOrder, backendCustomer));
        case 10:
          savedOrder = _context70.v;
          if (savedOrder) {
            _context70.n = 12;
            break;
          }
          _context70.n = 11;
          return rollbackAfterBackendWriteFailure('تعذر حفظ الطلب المستورد في قاعدة البيانات. لم يتم اعتماد المستند.');
        case 11:
          return _context70.a(2);
        case 12:
          _iterator3 = _createForOfIteratorHelper(clothRows);
          _context70.p = 13;
          _loop = /*#__PURE__*/_regenerator().m(function _loop() {
            var row, relatedAccessory, allocation, savedAllocation;
            return _regenerator().w(function (_context69) {
              while (1) switch (_context69.n) {
                case 0:
                  row = _step3.value;
                  relatedAccessory = accessoryRows.find(function (item) {
                    return item.pantoneCode && item.pantoneCode === row.pantoneCode;
                  });
                  allocation = {
                    id: uid(),
                    orderId: orderId,
                    color: row.pantoneCode || row.fabricType || '-',
                    pantoneCode: row.pantoneCode || '',
                    fabricType: row.fabricType || firstCloth.fabricType || '',
                    plannedQuantity: Number(row.quantity || 0),
                    dyehouse: suggestion.dyehouse,
                    targetFinishedWidth: row.width || '',
                    targetFinishedWeight: row.weight || '',
                    accessoryQuantityManual: relatedAccessory ? Number(relatedAccessory.quantity || 0) : null
                  };
                  _context69.n = 1;
                  return postBackend("/orders/".concat(orderId, "/allocations"), allocationToApi(allocation));
                case 1:
                  savedAllocation = _context69.v;
                  if (savedAllocation) {
                    _context69.n = 3;
                    break;
                  }
                  _context69.n = 2;
                  return rollbackAfterBackendWriteFailure('تعذر حفظ ألوان الطلب المستورد في قاعدة البيانات. لم يتم اعتماد المستند كاملًا.');
                case 2:
                  return _context69.a(2, {
                    v: void 0
                  });
                case 3:
                  return _context69.a(2);
              }
            }, _loop);
          });
          _iterator3.s();
        case 14:
          if ((_step3 = _iterator3.n()).done) {
            _context70.n = 17;
            break;
          }
          return _context70.d(_regeneratorValues(_loop()), 15);
        case 15:
          _ret = _context70.v;
          if (!_ret) {
            _context70.n = 16;
            break;
          }
          return _context70.a(2, _ret.v);
        case 16:
          _context70.n = 14;
          break;
        case 17:
          _context70.n = 19;
          break;
        case 18:
          _context70.p = 18;
          _t35 = _context70.v;
          _iterator3.e(_t35);
        case 19:
          _context70.p = 19;
          _iterator3.f();
          return _context70.f(19);
        case 20:
          if (!suggestion.rawNoteNumber) {
            _context70.n = 23;
            break;
          }
          _context70.n = 21;
          return postBackend('/batches/dyehouse', batchToApi({
            id: uid(),
            orderId: orderId,
            date: suggestion.orderDate,
            quantity: totalRawQuantity,
            supplier: suggestion.weavingSource || '',
            noteNumber: suggestion.rawNoteNumber,
            notes: reviewType === 'deltexIssue' ? 'تم تسجيل إذن صرف خام من مراجعة المستند' : 'تم تسجيل أمر صباغة محفوظ من مراجعة المستند',
            sourceDocument: pendingWeavingSlipImage ? {
              type: reviewType === 'deltexIssue' ? 'raw-issue-review-image' : 'saved-order-review-image',
              image: pendingWeavingSlipImage
            } : null
          }));
        case 21:
          rawSaved = _context70.v;
          if (rawSaved) {
            _context70.n = 23;
            break;
          }
          _context70.n = 22;
          return rollbackAfterBackendWriteFailure('تعذر حفظ إذن الخام المستورد في قاعدة البيانات. لم يتم اعتماد المستند كاملًا.');
        case 22:
          return _context70.a(2);
        case 23:
          _iterator4 = _createForOfIteratorHelper(accessoryRows);
          _context70.p = 24;
          _iterator4.s();
        case 25:
          if ((_step4 = _iterator4.n()).done) {
            _context70.n = 29;
            break;
          }
          row = _step4.value;
          _context70.n = 26;
          return postBackend('/batches/accessory', batchToApi({
            id: uid(),
            orderId: orderId,
            date: suggestion.orderDate,
            accessoryType: row.accessoryType || accessoryType || 'إكسسوار',
            quantity: Number(row.quantity || 0),
            noteNumber: suggestion.rawNoteNumber || '',
            notes: "\u0644\u0648\u0646 \u0645\u0631\u062A\u0628\u0637: ".concat(row.pantoneCode || '-'),
            movement: 'sent'
          }));
        case 26:
          savedAccessory = _context70.v;
          if (savedAccessory) {
            _context70.n = 28;
            break;
          }
          _context70.n = 27;
          return rollbackAfterBackendWriteFailure('تعذر حفظ إكسسوار المستند في قاعدة البيانات. لم يتم اعتماد المستند كاملًا.');
        case 27:
          return _context70.a(2);
        case 28:
          _context70.n = 25;
          break;
        case 29:
          _context70.n = 31;
          break;
        case 30:
          _context70.p = 30;
          _t36 = _context70.v;
          _iterator4.e(_t36);
        case 31:
          _context70.p = 31;
          _iterator4.f();
          return _context70.f(31);
        case 32:
          selectedOrderId = orderId;
          _context70.n = 33;
          return loadBackendData();
        case 33:
          refs.weavingSlipDialog.close();
        case 34:
          return _context70.a(2);
      }
    }, _callee69, null, [[24, 30, 31, 32], [13, 18, 19, 20]]);
  }));
  return _confirmAmalOrderImport.apply(this, arguments);
}
function repairGlobalArabicText() {
  document.querySelectorAll('#documentTitle, button, h2, h3, th, .eyebrow, .empty-state').forEach(function (element) {
    if (isLegacyRecoveredText(element.textContent || '')) element.textContent = 'مراجعة';
  });
}
function renderAll() {
  ensureRuntimeCollections();
  renderPricings();
  renderOrderFilters();
  renderOrders();
  renderDetails();
  repairGlobalArabicText();
}
var pendingWeavingSlipImage = '';
function resizeSlipImage(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onerror = reject;
    reader.onload = function () {
      var img = new Image();
      img.onerror = reject;
      img.onload = function () {
        var maxWidth = 2200;
        var scale = Math.min(1, maxWidth / img.width);
        var canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.94));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
function getReviewedOrder() {
  var orderId = refs.weavingSlipOrderNumber.value || '';
  return orderId ? calculateOrder(orders.find(function (item) {
    return item.id === orderId;
  })) : null;
}
function fillReviewOrderOptions() {
  refs.weavingSlipOrderNumber.innerHTML = "<option value=\"\">\u0627\u062E\u062A\u0631 \u0627\u0644\u0637\u0644\u0628 \u0627\u0644\u0645\u0631\u062A\u0628\u0637 \u0628\u0627\u0644\u0645\u0633\u062A\u0646\u062F</option>".concat(orders.map(function (order) {
    return "<option value=\"".concat(order.id, "\">").concat(order.orderNumber, " - ").concat(order.customer, " - ").concat(order.fabricType, "</option>");
  }).join(''));
}
function normalizeNote(value) {
  var arabicDigits = '٠١٢٣٤٥٦٧٨٩';
  var persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return String(value || '').trim().replace(/[٠-٩]/g, function (digit) {
    return String(arabicDigits.indexOf(digit));
  }).replace(/[۰-۹]/g, function (digit) {
    return String(persianDigits.indexOf(digit));
  }).replace(/\s+/g, '');
}
function findOrderByReviewedNote(noteNumber) {
  var note = normalizeNote(noteNumber);
  if (!note) return null;
  var sources = [].concat(_toConsumableArray(rawBatches.map(function (batch) {
    return {
      kind: 'دفعة خام مستلمة',
      orderId: batch.orderId,
      allocationId: '',
      batch: batch
    };
  })), _toConsumableArray(accessoryBatches.map(function (batch) {
    return {
      kind: 'إكسسوار',
      orderId: batch.orderId,
      allocationId: '',
      batch: batch
    };
  })), _toConsumableArray(productionBatches.map(function (batch) {
    var _allocations$find;
    return {
      kind: 'استلام مجهز من المصبغة',
      orderId: ((_allocations$find = allocations.find(function (item) {
        return item.id === batch.allocationId;
      })) === null || _allocations$find === void 0 ? void 0 : _allocations$find.orderId) || '',
      allocationId: batch.allocationId,
      batch: batch
    };
  })), _toConsumableArray(customerBatches.map(function (batch) {
    var _allocations$find2;
    return {
      kind: 'تسليم عميل',
      orderId: ((_allocations$find2 = allocations.find(function (item) {
        return item.id === batch.allocationId;
      })) === null || _allocations$find2 === void 0 ? void 0 : _allocations$find2.orderId) || '',
      allocationId: batch.allocationId,
      batch: batch
    };
  })));
  return sources.find(function (item) {
    return item.orderId && normalizeNote(item.batch.noteNumber) === note;
  }) || null;
}
function matchReviewByNoteNumber() {
  var match = findOrderByReviewedNote(refs.weavingSlipNoteNumber.value);
  if (!match) {
    refs.reviewMatchStatus.textContent = 'لم يتم العثور على طلب مرتبط بهذا الرقم. راجع رقم الإذن أو اختر الطلب يدويًا.';
    return;
  }
  refs.weavingSlipOrderNumber.value = match.orderId;
  updateDocumentReviewFields();
  if (match.allocationId && refs.weavingSlipAllocation) refs.weavingSlipAllocation.value = match.allocationId;
  if (!refs.weavingSlipQuantity.value && match.batch.quantity) refs.weavingSlipQuantity.value = match.batch.quantity;
  var order = orders.find(function (item) {
    return item.id === match.orderId;
  });
  refs.reviewMatchStatus.textContent = "\u062A\u0645\u062A \u0627\u0644\u0645\u0637\u0627\u0628\u0642\u0629 \u0645\u0639 \u0627\u0644\u0637\u0644\u0628 ".concat((order === null || order === void 0 ? void 0 : order.orderNumber) || '-', " / ").concat((order === null || order === void 0 ? void 0 : order.customer) || '-', " \u0645\u0646 \u062E\u0644\u0627\u0644 ").concat(match.kind, ". \u0631\u0627\u062C\u0639 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0642\u0628\u0644 \u0627\u0644\u062A\u0633\u062C\u064A\u0644.");
}
function updateDocumentReviewFields() {
  var type = refs.weavingSlipType.value;
  toggleAmalReviewMode();
  if (type === 'amalOrder') return;
  var order = getReviewedOrder();
  var needsAllocation = type === 'production' || type === 'customer';
  var needsRawIssueFields = type === 'weaving' || type === 'deltexIssue';
  refs.weavingSlipAllocation.closest('label').style.display = needsAllocation ? '' : 'none';
  refs.weavingSlipAllocation.required = needsAllocation;
  refs.weavingSlipWidthLine.closest('label').style.display = needsRawIssueFields ? '' : 'none';
  refs.weavingSlipSupplier.closest('label').style.display = needsRawIssueFields ? '' : 'none';
  refs.weavingSlipSupplier.required = needsRawIssueFields;
  refs.weavingSlipWidthLine.innerHTML = '<option value="">اختر العرض / البوصة بعد اختيار الطلب</option>';
  refs.weavingSlipAllocation.innerHTML = '<option value="">اختر اللون / البند بعد اختيار الطلب</option>';
  refs.weavingSlipWidthLine.required = false;
  if (!order) return;
  refs.weavingSlipWidthLine.innerHTML = order.widthMode === 'multiple' ? "<option value=\"\">\u0627\u062E\u062A\u0631 \u0627\u0644\u0639\u0631\u0636 \u0627\u0644\u0645\u0637\u0644\u0648\u0628</option>".concat(order.widthLines.map(function (item) {
    return "<option value=\"".concat(item.id, "\">\u0628\u0648\u0635\u0629 ").concat(item.inch, " / \u0639\u0631\u0636 ").concat(item.width, " / \u0643\u0645\u064A\u0629 ").concat(item.quantity, "</option>");
  }).join('')) : "<option value=\"\">\u063A\u064A\u0631 \u0645\u0637\u0644\u0648\u0628 \u0644\u0637\u0644\u0628 \u0639\u0631\u0636 \u0648\u0627\u062D\u062F</option>";
  refs.weavingSlipWidthLine.required = needsRawIssueFields && order.widthMode === 'multiple';
  refs.weavingSlipAllocation.innerHTML = "<option value=\"\">\u0627\u062E\u062A\u0631 \u0627\u0644\u0644\u0648\u0646 / \u0627\u0644\u0628\u0646\u062F</option>".concat(order.allocations.map(function (item) {
    return "<option value=\"".concat(item.id, "\">").concat(item.color, " / \u0639\u0631\u0636 ").concat(item.targetFinishedWidth, " / \u0643\u0645\u064A\u0629 ").concat(item.plannedQuantity, "</option>");
  }).join(''));
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
}
var openWeavingSlipDialog = openDocumentReviewDialog;
function handleWeavingSlipFile() {
  return _handleWeavingSlipFile.apply(this, arguments);
}
function _handleWeavingSlipFile() {
  _handleWeavingSlipFile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee70() {
    var _refs$weavingSlipFile2;
    var file;
    return _regenerator().w(function (_context71) {
      while (1) switch (_context71.n) {
        case 0:
          file = (_refs$weavingSlipFile2 = refs.weavingSlipFile.files) === null || _refs$weavingSlipFile2 === void 0 ? void 0 : _refs$weavingSlipFile2[0];
          if (file) {
            _context71.n = 1;
            break;
          }
          return _context71.a(2);
        case 1:
          _context71.n = 2;
          return resizeSlipImage(file);
        case 2:
          pendingWeavingSlipImage = _context71.v;
          refs.weavingSlipPreview.src = pendingWeavingSlipImage;
          if (refs.weavingSlipType.value === 'amalOrder' || refs.weavingSlipType.value === 'deltexIssue') applyAmalSuggestionFromFile(file);
        case 3:
          return _context71.a(2);
      }
    }, _callee70);
  }));
  return _handleWeavingSlipFile.apply(this, arguments);
}
function confirmWeavingSlip(_x46) {
  return _confirmWeavingSlip.apply(this, arguments);
}
function _confirmWeavingSlip() {
  _confirmWeavingSlip = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee71(event) {
    var order, type, isRawIssue, quantity, common, saved, existingRawBatch, rawBatch, _t37;
    return _regenerator().w(function (_context72) {
      while (1) switch (_context72.n) {
        case 0:
          event.preventDefault();
          if (!(refs.weavingSlipType.value === 'amalOrder')) {
            _context72.n = 2;
            break;
          }
          _context72.n = 1;
          return confirmAmalOrderImport();
        case 1:
          return _context72.a(2);
        case 2:
          order = getReviewedOrder();
          if (order) {
            _context72.n = 3;
            break;
          }
          alert('اختر الطلب المرتبط بالمستند قبل التسجيل.');
          return _context72.a(2);
        case 3:
          type = refs.weavingSlipType.value;
          isRawIssue = type === 'weaving' || type === 'deltexIssue';
          if (!(isRawIssue && order.widthMode === 'multiple' && !refs.weavingSlipWidthLine.value)) {
            _context72.n = 4;
            break;
          }
          alert('اختر العرض / البوصة المرتبطة بإذن الخام.');
          return _context72.a(2);
        case 4:
          if (!((type === 'production' || type === 'customer') && !refs.weavingSlipAllocation.value)) {
            _context72.n = 5;
            break;
          }
          alert('اختر اللون / البند المرتبط بالحركة.');
          return _context72.a(2);
        case 5:
          quantity = Number(refs.weavingSlipQuantity.value || 0);
          if (quantity) {
            _context72.n = 6;
            break;
          }
          alert('أدخل الكمية قبل التسجيل.');
          return _context72.a(2);
        case 6:
          common = {
            id: uid(),
            date: refs.weavingSlipDate.value,
            quantity: quantity,
            noteNumber: refs.weavingSlipNoteNumber.value || '',
            notes: refs.weavingSlipNotes.value || '',
            sourceDocument: pendingWeavingSlipImage ? {
              type: type === 'deltexIssue' ? 'raw-issue-review-image' : "".concat(type, "-review-image"),
              image: pendingWeavingSlipImage
            } : null
          };
          if (!(type === 'pricing')) {
            _context72.n = 7;
            break;
          }
          refs.pricingNumber.value = "Q-".concat(order.orderNumber || '');
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
          return _context72.a(2);
        case 7:
          _context72.n = 8;
          return ensureBackendForWrite('تعذر الاتصال بقاعدة البيانات. لم يتم تسجيل المستند.');
        case 8:
          if (_context72.v) {
            _context72.n = 9;
            break;
          }
          return _context72.a(2);
        case 9:
          saved = null;
          if (!isRawIssue) {
            _context72.n = 14;
            break;
          }
          existingRawBatch = rawBatches.find(function (batch) {
            return batch.orderId === order.id && normalizeDigits(batch.noteNumber) === normalizeDigits(common.noteNumber);
          });
          rawBatch = existingRawBatch ? _objectSpread(_objectSpread({}, existingRawBatch), {}, {
            date: common.date || existingRawBatch.date,
            quantity: quantity || existingRawBatch.quantity,
            notes: common.notes || existingRawBatch.notes,
            widthLineId: refs.weavingSlipWidthLine.value || existingRawBatch.widthLineId || '',
            supplier: refs.weavingSlipSupplier.value || existingRawBatch.supplier || '',
            sourceDocument: common.sourceDocument || existingRawBatch.sourceDocument || null
          }) : _objectSpread(_objectSpread({}, common), {}, {
            orderId: order.id,
            widthLineId: refs.weavingSlipWidthLine.value || '',
            supplier: refs.weavingSlipSupplier.value || ''
          });
          if (!existingRawBatch) {
            _context72.n = 11;
            break;
          }
          _context72.n = 10;
          return putBackend("/batches/dyehouse/".concat(existingRawBatch.id), batchToApi(rawBatch));
        case 10:
          _t37 = _context72.v;
          _context72.n = 13;
          break;
        case 11:
          _context72.n = 12;
          return postBackend('/batches/dyehouse', batchToApi(rawBatch));
        case 12:
          _t37 = _context72.v;
        case 13:
          saved = _t37;
        case 14:
          if (!(type === 'production')) {
            _context72.n = 16;
            break;
          }
          _context72.n = 15;
          return postBackend('/batches/finished', batchToApi(_objectSpread(_objectSpread({}, common), {}, {
            orderId: order.id,
            allocationId: refs.weavingSlipAllocation.value
          })));
        case 15:
          saved = _context72.v;
        case 16:
          if (!(type === 'customer')) {
            _context72.n = 18;
            break;
          }
          _context72.n = 17;
          return postBackend('/batches/customer', batchToApi(_objectSpread(_objectSpread({}, common), {}, {
            orderId: order.id,
            allocationId: refs.weavingSlipAllocation.value
          })));
        case 17:
          saved = _context72.v;
        case 18:
          if (saved) {
            _context72.n = 20;
            break;
          }
          _context72.n = 19;
          return rollbackAfterBackendWriteFailure('تعذر حفظ بيانات المستند في قاعدة البيانات. لم يتم اعتماد التسجيل.');
        case 19:
          return _context72.a(2);
        case 20:
          _context72.n = 21;
          return loadBackendData();
        case 21:
          refs.weavingSlipDialog.close();
        case 22:
          return _context72.a(2);
      }
    }, _callee71);
  }));
  return _confirmWeavingSlip.apply(this, arguments);
}
function documentHeader() {
  return '<div class="document-brand"><div class="document-brand-info"><strong>2B Tex</strong><span>العاشر من رمضان</span><span>خدمة العملاء: 01000343835</span></div><div class="document-brand-logo"><img src="./2b-mark.svg" alt="2B Tex"><span>للنسيج والصباغة والتجهيز</span></div></div>';
}
function documentLogo() {
  return '<img src="./2b-mark.svg" alt="2B Tex" style="max-width:140px;height:auto">';
}
function rawPermitImagesSection(order) {
  var rawNotes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var wantedNotes = rawNotes ? new Set(rawNotes.map(function (note) {
    return normalizeDigits(note);
  }).filter(Boolean)) : null;
  var orderImages = rawBatches.filter(function (batch) {
    var _batch$sourceDocument;
    return batch.orderId === order.id && ((_batch$sourceDocument = batch.sourceDocument) === null || _batch$sourceDocument === void 0 ? void 0 : _batch$sourceDocument.image);
  }).map(function (batch) {
    return {
      noteNumber: batch.noteNumber || '-',
      normalizedNote: normalizeDigits(batch.noteNumber),
      image: batch.sourceDocument.image
    };
  });
  var images = wantedNotes && wantedNotes.size ? orderImages.filter(function (item) {
    return wantedNotes.has(item.normalizedNote);
  }) : orderImages;
  if (!images.length && orderImages.length) images = orderImages;
  if (!images.length) return '';
  var cards = images.map(function (item) {
    return "<figure><img src=\"".concat(item.image, "\" alt=\"\u0635\u0648\u0631\u0629 \u0625\u0630\u0646 \u0627\u0644\u062E\u0627\u0645 ").concat(item.noteNumber, "\"><figcaption>\u0625\u0630\u0646 \u062E\u0627\u0645: ").concat(item.noteNumber, "</figcaption></figure>");
  }).join('');
  return "<section class=\"report-section raw-permit-section\"><h3>\u0635\u0648\u0631\u0629 \u0625\u0630\u0646 \u0627\u0644\u062E\u0627\u0645</h3><div class=\"raw-permit-gallery\">".concat(cards, "</div></section>");
}
function renderDyehouseDocumentPicker(order) {
  var names = dyehouseNamesForOrder(order);
  refs.documentTitle.textContent = 'اختيار أمر صباغة';
  refs.documentBody.dataset.documentType = 'dyeing-picker';
  refs.documentBody.dataset.dyehouseName = '';
  refs.documentBody.innerHTML = "<div class=\"document-sheet\">\n    ".concat(documentHeader(), "\n    <div class=\"report-title\"><h2>\u0627\u062E\u062A\u064A\u0627\u0631 \u0623\u0645\u0631 \u0635\u0628\u0627\u063A\u0629</h2><span>\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0635\u0628\u063A\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0644\u0641\u062A\u062D \u0623\u0645\u0631 \u062A\u0634\u063A\u064A\u0644 \u0645\u0646\u0641\u0635\u0644 \u0644\u0643\u0644 \u0645\u0635\u0628\u063A\u0629.</span></div>\n    <table><thead><tr><th>\u0627\u0644\u0645\u0635\u0628\u063A\u0629</th><th>\u0639\u062F\u062F \u0627\u0644\u0623\u0644\u0648\u0627\u0646</th><th>\u0625\u062C\u0645\u0627\u0644\u064A \u0643\u0645\u064A\u0629 \u0627\u0644\u0635\u0628\u0627\u063A\u0629</th><th>\u0625\u062C\u0631\u0627\u0621</th></tr></thead><tbody>").concat(names.map(function (name) {
    var rows = (order.allocations || []).filter(function (allocation) {
      return String(allocation.dyehouse || order.dyehouse || '').trim() === name;
    });
    var quantity = rows.reduce(function (total, row) {
      return total + Number(row.plannedQuantity || 0);
    }, 0);
    return "<tr><td>".concat(escapeHtml(name), "</td><td>").concat(rows.length, "</td><td>").concat(formatNumber(quantity), "</td><td><button class=\"mini-btn gold\" type=\"button\" data-open-dyeing-for=\"").concat(escapeHtml(name), "\">\u0641\u062A\u062D \u0623\u0645\u0631 \u0627\u0644\u0635\u0628\u0627\u063A\u0629</button></td></tr>");
  }).join('') || emptyRow(4, 'لا توجد مصابغ مرتبطة بهذا الطلب.'), "</tbody></table>\n  </div>");
  if (refs.documentDialog.open) refs.documentDialog.close();
  refs.documentDialog.showModal();
}
function promptOperationNotes(_x47, _x48) {
  return _promptOperationNotes.apply(this, arguments);
}
function _promptOperationNotes() {
  _promptOperationNotes = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee72(sourceOrder, type) {
    var dyehouseName,
      key,
      savedNotes,
      current,
      title,
      value,
      customerId,
      savedOrder,
      refreshedOrder,
      _args71 = arguments;
    return _regenerator().w(function (_context73) {
      while (1) switch (_context73.n) {
        case 0:
          dyehouseName = _args71.length > 2 && _args71[2] !== undefined ? _args71[2] : '';
          if (sourceOrder) {
            _context73.n = 1;
            break;
          }
          return _context73.a(2, null);
        case 1:
          key = operationNotesKey(type, dyehouseName);
          savedNotes = sourceOrder.operationNotes && _typeof(sourceOrder.operationNotes) === 'object' && !Array.isArray(sourceOrder.operationNotes) ? sourceOrder.operationNotes : {};
          current = Object.prototype.hasOwnProperty.call(savedNotes, key) ? savedNotes[key] : '';
          title = type === 'dyeing' ? "\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0623\u0645\u0631 \u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u0635\u0628\u0627\u063A\u0629".concat(dyehouseName ? " - ".concat(dyehouseName) : '') : 'ملاحظات أمر تشغيل النسيج';
          value = prompt(title, current);
          if (!(value === null)) {
            _context73.n = 2;
            break;
          }
          return _context73.a(2, null);
        case 2:
          sourceOrder.operationNotes = sourceOrder.operationNotes && _typeof(sourceOrder.operationNotes) === 'object' && !Array.isArray(sourceOrder.operationNotes) ? sourceOrder.operationNotes : {};
          sourceOrder.operationNotes[key] = value.trim();
          if (!backendAvailable) {
            _context73.n = 8;
            break;
          }
          _context73.n = 3;
          return ensureBackendCustomer(sourceOrder.customer);
        case 3:
          customerId = _context73.v;
          _context73.n = 4;
          return putBackend("/orders/".concat(sourceOrder.id), orderToApi(sourceOrder, customerId));
        case 4:
          savedOrder = _context73.v;
          if (savedOrder) {
            _context73.n = 6;
            break;
          }
          _context73.n = 5;
          return rollbackAfterBackendWriteFailure('تعذر حفظ ملاحظات التقرير في قاعدة البيانات. لم يتم فتح التقرير.');
        case 5:
          return _context73.a(2, null);
        case 6:
          _context73.n = 7;
          return loadBackendData();
        case 7:
          refreshedOrder = orders.find(function (order) {
            return order.id === sourceOrder.id;
          });
          if (refreshedOrder) {
            sourceOrder.operationNotes = refreshedOrder.operationNotes || sourceOrder.operationNotes;
          }
        case 8:
          save();
          return _context73.a(2, sourceOrder.operationNotes[key]);
      }
    }, _callee72);
  }));
  return _promptOperationNotes.apply(this, arguments);
}
if (refs.weavingSlipDialog) installAmalReviewUi();
applyPricingMaterialOptions();
applyPricingDyehouseOptions();
refs.openPricingFormBtn.onclick = function () {
  editingPricingId = null;
  if (refs.deletePricingBtn) refs.deletePricingBtn.style.display = 'none';
  refs.pricingForm.reset();
  refs.pricingNumber.value = nextPricingNumber();
  refs.pricingDate.value = new Date().toISOString().slice(0, 10);
  applyPricingMaterialOptions();
  applyPricingDyehouseOptions();
  syncAutoCodes();
  updatePricingPreview();
  refs.pricingDialog.showModal();
};
refs.deletePricingBtn.onclick = function () {
  if (editingPricingId) deletePricing(editingPricingId)["catch"](function (error) {
    console.error('pricing-delete-error', error);
    alert('تعذر حذف التسعيرة.');
  });
};
if (refs.openDocumentReviewBtn) refs.openDocumentReviewBtn.onclick = openDocumentReviewDialog;
refs.openOrderFormBtn.onclick = function () {
  pendingConvertedPricingId = null;
  editingOrderId = null;
  refs.orderForm.reset();
  refs.orderDate.value = new Date().toISOString().slice(0, 10);
  syncAutoCodes();
  renderWidthLinesEditor();
  renderAccessoryLinesEditor();
  syncWidthModeUi();
  refs.orderDialog.showModal();
};
if (refs.openOrdersReportBtn) refs.openOrdersReportBtn.onclick = openOrdersReport;
if (refs.printFilteredOrdersBtn) refs.printFilteredOrdersBtn.onclick = openFilteredOrdersReport;
if (refs.openDyehouseBalancesReportBtn) refs.openDyehouseBalancesReportBtn.onclick = openDyehouseBalancesReport;
if (refs.openManagementReportsBtn) refs.openManagementReportsBtn.onclick = openManagementReportsMenu;
if (refs.documentBody) refs.documentBody.addEventListener('click', function (event) {
  var _deleteButton$closest, _deletePriceButton$cl;
  var button = event.target.closest('[data-management-report]');
  if (button) {
    event.preventDefault();
    event.stopPropagation();
    openManagementReport(button.dataset.managementReport);
    return;
  }
  var retryButton = event.target.closest('[data-retry-outbox]');
  if (retryButton) retryOutbox(retryButton.dataset.retryOutbox);
  var addGroupButton = event.target.closest('[data-add-whatsapp-group-row]');
  if (addGroupButton) {
    var _find2;
    var type = addGroupButton.dataset.addWhatsappGroupRow || 'dyehouse';
    var label = addGroupButton.dataset.rowLabel || 'اسم البند';
    (_find2 = _toConsumableArray(refs.documentBody.querySelectorAll('[data-whatsapp-group-rows]')).find(function (body) {
      return body.dataset.whatsappGroupRows === type;
    })) === null || _find2 === void 0 || _find2.insertAdjacentHTML('beforeend', whatsappSettingsRowHtml(type, label));
    refs.documentBody.querySelectorAll('[data-group-name]').forEach(function (input) {
      return input.setAttribute('list', 'whatsappGroupNames');
    });
  }
  var deleteButton = event.target.closest('[data-delete-group-row]');
  if (deleteButton) (_deleteButton$closest = deleteButton.closest('[data-whatsapp-group-row]')) === null || _deleteButton$closest === void 0 || _deleteButton$closest.remove();
  if (event.target.closest('[data-save-whatsapp-settings]')) saveWhatsappSettingsFromDialog()["catch"](function (error) {
    console.error('whatsapp-settings-save-error', error);
    alert('تعذر حفظ إعدادات واتساب.');
  });
  if (event.target.closest('[data-add-price-row]')) {
    var _refs$documentBody$qu;
    (_refs$documentBody$qu = refs.documentBody.querySelector('[data-dyehouse-price-rows]')) === null || _refs$documentBody$qu === void 0 || _refs$documentBody$qu.insertAdjacentHTML('beforeend', dyehousePriceRowHtml());
  }
  var deletePriceButton = event.target.closest('[data-delete-price-row]');
  if (deletePriceButton) (_deletePriceButton$cl = deletePriceButton.closest('[data-dyehouse-price-row]')) === null || _deletePriceButton$cl === void 0 || _deletePriceButton$cl.remove();
  if (event.target.closest('[data-save-dyehouse-prices]')) saveDyehousePricesFromDialog()["catch"](function (error) {
    console.error('dyehouse-prices-save-error', error);
    alert('تعذر حفظ أسعار المصابغ.');
  });
  var dyeingDocButton = event.target.closest('[data-open-dyeing-for]');
  if (dyeingDocButton) openDyeingDocumentForDyehouse(dyeingDocButton.dataset.openDyeingFor)["catch"](function (error) {
    console.error('dyeing-document-open-error', error);
    alert('تعذر فتح أمر الصباغة حاليًا.');
  });
  if (event.target.closest('[data-refresh-a5-accounts]')) renderA5AccountsDialog();
  var a5LedgerButton = event.target.closest('[data-a5-ledger]');
  if (a5LedgerButton) renderA5LedgerDialog(a5LedgerButton.dataset.a5Ledger);
  if (event.target.closest('[data-back-a5-accounts]')) renderA5AccountsDialog();
  if (event.target.closest('[data-export-a5-csv]')) exportA5AccountingCsv();
  var ledgerButton = event.target.closest('[data-customer-ledger]');
  if (ledgerButton) renderCustomerLedgerDialog(ledgerButton.dataset.customerLedger);
  if (event.target.closest('[data-back-customer-accounts]')) renderCustomerAccountsDialog();
  var openingButton = event.target.closest('[data-save-opening-balance]');
  if (openingButton) saveCustomerOpeningBalance(openingButton.dataset.saveOpeningBalance)["catch"](function (error) {
    console.error('customer-opening-save-error', error);
    alert('تعذر حفظ رصيد العميل.');
  });
  var paymentButton = event.target.closest('[data-add-customer-payment]');
  if (paymentButton) addCustomerPayment(paymentButton.dataset.addCustomerPayment)["catch"](function (error) {
    console.error('customer-payment-save-error', error);
    alert('تعذر حفظ دفعة العميل.');
  });
  var deletePaymentButton = event.target.closest('[data-delete-customer-payment]');
  if (deletePaymentButton) deleteCustomerPayment(deletePaymentButton.dataset.customerName, deletePaymentButton.dataset.deleteCustomerPayment)["catch"](function (error) {
    console.error('customer-payment-delete-error', error);
    alert('تعذر حذف دفعة العميل.');
  });
  if (event.target.closest('[data-new-system-user]')) openSystemUserForm();
  if (event.target.closest('[data-back-system-users]')) openUsersDialog();
  var editUserButton = event.target.closest('[data-edit-system-user]');
  if (editUserButton) {
    var users = JSON.parse(refs.documentBody.dataset.usersJson || '[]');
    openSystemUserForm(users.find(function (user) {
      return user.id === editUserButton.dataset.editSystemUser;
    }) || null);
  }
  var saveUserButton = event.target.closest('[data-save-system-user]');
  if (saveUserButton) saveSystemUser(saveUserButton.dataset.saveSystemUser)["catch"](function (error) {
    console.error('system-user-save-error', error);
    alert(error.message || 'تعذر حفظ المستخدم.');
  });
  var deleteUserButton = event.target.closest('[data-delete-system-user]');
  if (deleteUserButton) deleteSystemUser(deleteUserButton.dataset.deleteSystemUser)["catch"](function (error) {
    console.error('system-user-delete-error', error);
    alert(error.message || 'تعذر حذف المستخدم.');
  });
});
refs.closePricingFormBtn.onclick = function () {
  return refs.pricingDialog.close();
};
refs.closeOrderFormBtn.onclick = function () {
  pendingConvertedPricingId = null;
  refs.orderDialog.close();
};
refs.pricingForm.onsubmit = function (event) {
  return addPricing(event)["catch"](function (error) {
    console.error('pricing-save-error', error);
    alert('تعذر حفظ التسعيرة.');
  });
};
refs.pricingNumber.readOnly = true;
['pricingQuantity', 'pricingRawCost', 'pricingDyeCost', 'pricingWastePercent', 'pricingExtraCost', 'pricingProfitPerKg'].forEach(function (key) {
  return refs[key].oninput = updatePricingPreview;
});
['pricingDyehouse', 'pricingMaterialType'].forEach(function (key) {
  return refs[key].onchange = function () {
    applyPricingColorOptions();
    updateSuggestedDyeCost();
  };
});
refs.pricingColorClass.onchange = updateSuggestedDyeCost;
refs.widthMode.onchange = syncWidthModeUi;
refs.addWidthLineBtn.onclick = function () {
  return refs.widthLinesEditor.insertAdjacentHTML('beforeend', widthLineRowHtml());
};
refs.widthLinesEditor.onclick = function (event) {
  var _event$target$closest;
  if (event.target.dataset.removeWidthLine !== undefined) (_event$target$closest = event.target.closest('.width-line-row')) === null || _event$target$closest === void 0 || _event$target$closest.remove();
};
refs.addAccessoryLineBtn.onclick = function () {
  return refs.accessoryLinesEditor.insertAdjacentHTML('beforeend', accessoryLineRowHtml());
};
refs.accessoryLinesEditor.onclick = function (event) {
  var _event$target$closest2;
  if (event.target.dataset.removeAccessoryLine !== undefined) (_event$target$closest2 = event.target.closest('.accessory-line-row')) === null || _event$target$closest2 === void 0 || _event$target$closest2.remove();
};
refs.orderForm.onsubmit = function (event) {
  return addOrder(event)["catch"](function (error) {
    console.error('order-save-error', error);
    alert('تعذر حفظ الطلب.');
  });
};
refs.orderNumber.oninput = syncAutoCodes;
refs.searchInput.oninput = refs.orderStatusFilter.oninput = refs.customerFilter.oninput = refs.dyehouseFilter.oninput = refs.fabricFilter.oninput = renderOrders;
refs.pricingTableBody.onclick = function (event) {
  if (event.target.dataset.pricingQuote) openPricingQuotation(event.target.dataset.pricingQuote);
  if (event.target.dataset.convertPricing) convertPricingToOrder(event.target.dataset.convertPricing);
  if (event.target.dataset.editPricing) editPricing(event.target.dataset.editPricing);
  if (event.target.dataset.deletePricing) deletePricing(event.target.dataset.deletePricing)["catch"](function (error) {
    console.error('pricing-delete-error', error);
    alert('تعذر حذف التسعيرة.');
  });
};
refs.ordersTableBody.onclick = function (event) {
  var button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.view) {
    selectedOrderId = button.dataset.view;
    try {
      var _refs$orderDetailsPan2;
      renderDetails();
      (_refs$orderDetailsPan2 = refs.orderDetailsPanel) === null || _refs$orderDetailsPan2 === void 0 || _refs$orderDetailsPan2.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } catch (error) {
      console.error('Order details failed', error);
      recordAudit('error', 'orderDetails', button.dataset.view, null, {
        message: error && error.message ? error.message : String(error)
      }, 'فشل فتح تفاصيل الطلب');
      persistAuditLog()["catch"](function (saveError) {
        return console.warn('audit-save-failed', saveError);
      });
      refs.orderDetailsPanel.innerHTML = '<div class="empty-state">تعذر فتح تفاصيل الطلب حاليًا. راجع البيانات ثم حاول مرة أخرى.</div>';
      alert("\u062A\u0639\u0630\u0631 \u0641\u062A\u062D \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0637\u0644\u0628. \u0633\u0628\u0628 \u0627\u0644\u062E\u0637\u0623: ".concat(error && error.message ? error.message : String(error)));
    }
    return;
  }
  if (button.dataset.editOrder) {
    editingOrderId = button.dataset.editOrder;
    var order = orders.find(function (item) {
      return item.id === editingOrderId;
    });
    if (order) {
      selectedOrderId = order.id;
      fillOrderForm(order);
      refs.orderDialog.showModal();
    }
    return;
  }
  if (button.dataset.deleteOrder) deleteOrder(button.dataset.deleteOrder)["catch"](function (error) {
    console.error('order-delete-error', error);
    alert('تعذر حذف الطلب.');
  });
};
refs.orderDetailsPanel.addEventListener('submit', function (event) {
  addBatch(event)["catch"](function (error) {
    console.error('batch-save-error', error);
    alert('تعذر حفظ الحركة. راجع البيانات ثم حاول مرة أخرى.');
  });
});
refs.orderDetailsPanel.addEventListener('input', function (event) {
  var form = event.target.closest('.batch-form');
  if (form) form.dataset.dirty = 'true';
});
refs.orderDetailsPanel.addEventListener('change', function (event) {
  var form = event.target.closest('.batch-form');
  if (form) form.dataset.dirty = 'true';
  if (event.target.name === 'movementKind') {
    if ((form === null || form === void 0 ? void 0 : form.dataset.form) === 'raw') updateRawMovementVisibility(form);
    if ((form === null || form === void 0 ? void 0 : form.dataset.form) === 'customer') updateCustomerDeliveryFields(form);
  }
});
refs.orderDetailsPanel.addEventListener('click', function (event) {
  var target = event.target.closest('button');
  if (!target) return;
  if (target.id === 'editOrderBtn') {
    editingOrderId = selectedOrderId;
    var order = orders.find(function (item) {
      return item.id === selectedOrderId;
    });
    if (order) {
      fillOrderForm(order);
      refs.orderDialog.showModal();
    }
  }
  if (target.id === 'toggleOperationClosedBtn') {
    event.preventDefault();
    toggleOperationClosed()["catch"](function (error) {
      console.error('operation-close-error', error);
      alert('تعذر حفظ حالة دورة التشغيل.');
    });
    return;
  }
  if (target.id === 'addAllocationBtn') addAllocation()["catch"](function (error) {
    console.error('allocation-add-error', error);
    alert('تعذر حفظ اللون.');
  });
  if (target.dataset.editAllocation) editAllocation(target.dataset.editAllocation)["catch"](function (error) {
    console.error('allocation-edit-error', error);
    alert('تعذر تعديل اللون.');
  });
  if (target.dataset.deleteAllocation) deleteAllocation(target.dataset.deleteAllocation)["catch"](function (error) {
    console.error('allocation-delete-error', error);
    alert('تعذر حذف اللون.');
  });
  if (target.dataset.transferAllocation) transferAllocationDyehouse(target.dataset.transferAllocation)["catch"](function (error) {
    console.error('allocation-transfer-error', error);
    alert('تعذر حفظ تحويل المصبغة.');
  });
  var action = target.dataset.batchAction;
  if (action === 'delete') deleteBatch(target.dataset.batchType, target.dataset.batchId)["catch"](function (error) {
    console.error('batch-delete-error', error);
    alert('تعذر حذف الحركة.');
  });
  if (action === 'edit') editBatch(target.dataset.batchType, target.dataset.batchId)["catch"](function (error) {
    console.error('batch-edit-error', error);
    alert('تعذر تعديل الحركة.');
  });
  if (target.dataset.retryOutbox) retryOutbox(target.dataset.retryOutbox);
});
function safeOpenDocument(_x49) {
  return _safeOpenDocument.apply(this, arguments);
}
function _safeOpenDocument() {
  _safeOpenDocument = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee73(type) {
    var _t38;
    return _regenerator().w(function (_context74) {
      while (1) switch (_context74.p = _context74.n) {
        case 0:
          _context74.p = 0;
          _context74.n = 1;
          return openDocument(type === 'labsamples' ? 'labSamples' : type);
        case 1:
          _context74.n = 3;
          break;
        case 2:
          _context74.p = 2;
          _t38 = _context74.v;
          console.error('document-open-error', _t38);
          alert('تعذر فتح المستند حاليًا. راجع بيانات الطلب ثم حاول مرة أخرى.');
        case 3:
          return _context74.a(2);
      }
    }, _callee73, null, [[0, 2]]);
  }));
  return _safeOpenDocument.apply(this, arguments);
}
function printCurrentDocument() {
  var stickerId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var isSticker = currentDocumentType === 'stickers' || !!refs.documentBody.querySelector('.sticker-sheet');
  var stickerPrintStyle = null;
  var cleanup = function cleanup() {
    document.body.classList.remove('printing-stickers');
    if (stickerPrintStyle) stickerPrintStyle.remove();
  };
  if (isSticker) {
    var cards = _toConsumableArray(refs.documentBody.querySelectorAll('.sticker-card'));
    if (stickerId || cards.length === 1) {
      var _cards$;
      var selectedId = stickerId || ((_cards$ = cards[0]) === null || _cards$ === void 0 ? void 0 : _cards$.dataset.stickerId) || '';
      document.body.classList.add('printing-stickers');
      stickerPrintStyle = document.createElement('style');
      stickerPrintStyle.textContent = "@media print { @page { size: 55mm 40mm; margin: 0; } body.printing-stickers .sticker-item:not(:has(.sticker-card[data-sticker-id=\"".concat(selectedId, "\"])) { display:none!important; } body.printing-stickers .sticker-card:not([data-sticker-id=\"").concat(selectedId, "\"]) { display:none!important; } }");
      document.head.appendChild(stickerPrintStyle);
    }
  }
  window.addEventListener('afterprint', cleanup, {
    once: true
  });
  setTimeout(function () {
    return window.print();
  }, 80);
  setTimeout(cleanup, 4000);
}
refs.documentBody.addEventListener('click', function (event) {
  if (event.target.dataset.printSticker) printCurrentDocument(event.target.dataset.printSticker);
  if (event.target.dataset.editPricingDoc) editPricing(event.target.dataset.editPricingDoc);
  if (event.target.dataset.convertPricing) convertPricingToOrder(event.target.dataset.convertPricing);
});
refs.documentsPanel.onclick = function (event) {
  var type = event.target.dataset.doc;
  if (!type) return;
  if (type === 'print') {
    safeOpenDocument('dyeing');
    setTimeout(function () {
      return printCurrentDocument();
    }, 150);
    return;
  }
  safeOpenDocument(type);
};
refs.closeDocumentBtn.onclick = function () {
  return refs.documentDialog.close();
};
refs.documentDialog.addEventListener('close', stopWhatsappSettingsAutoRefresh);
if (refs.weavingSlipDialog) {
  refs.closeWeavingSlipBtn.onclick = function () {
    return refs.weavingSlipDialog.close();
  };
  refs.weavingSlipType.onchange = function () {
    var _refs$weavingSlipFile;
    updateDocumentReviewFields();
    if ((refs.weavingSlipType.value === 'amalOrder' || refs.weavingSlipType.value === 'deltexIssue') && (_refs$weavingSlipFile = refs.weavingSlipFile.files) !== null && _refs$weavingSlipFile !== void 0 && _refs$weavingSlipFile[0]) applyAmalSuggestionFromFile(refs.weavingSlipFile.files[0]);
  };
  refs.weavingSlipOrderNumber.onchange = updateDocumentReviewFields;
  refs.reviewMatchNoteBtn.onclick = matchReviewByNoteNumber;
  refs.weavingSlipFile.onchange = function () {
    return handleWeavingSlipFile()["catch"](function () {
      return alert('تعذر قراءة صورة المستند. جرّب صورة أوضح أو ملفًا آخر.');
    });
  };
  refs.weavingSlipForm.onsubmit = function (event) {
    return confirmWeavingSlip(event)["catch"](function (error) {
      console.error('document-review-save-error', error);
      alert('تعذر تسجيل المستند.');
    });
  };
}
refs.printDocumentBtn.onclick = function () {
  return printCurrentDocument();
};
if (refs.analyzeReportBtn) refs.analyzeReportBtn.onclick = analyzeReportWithAi;
if (refs.closeAiAnalysisBtn) refs.closeAiAnalysisBtn.onclick = function () {
  return refs.aiAnalysisDialog.close();
};
if (refs.copyAiWhatsappBtn) refs.copyAiWhatsappBtn.onclick = copyAiWhatsappMessage;
function currentReportTypeFromDocument() {
  var _refs$documentBody3;
  var documentType = ((_refs$documentBody3 = refs.documentBody) === null || _refs$documentBody3 === void 0 ? void 0 : _refs$documentBody3.dataset.documentType) || currentDocumentType;
  var directTypes = {
    weaving: 'weaving_production_order',
    dyeing: 'dyeing_production_order',
    fullreport: 'dyehouses_report',
    'orders-follow': 'orders_follow_report',
    'dyehouse-balances': 'dyehouse_balances_report'
  };
  if (directTypes[documentType]) return directTypes[documentType];
  if (documentType === 'management-report') return "management_".concat(cleanCodePart(refs.documentBody.dataset.reportKey || refs.documentTitle.textContent || 'report'));
  if (['quotation', 'waste', 'rawreport', 'productionreport', 'customerreport'].includes(documentType)) return "".concat(documentType, "_pdf_report");
  return '';
}
function currentShareReportPayload(reportType) {
  var _refs$documentBody4, _refs$documentBody6, _refs$documentTitle2, _refs$documentBody7;
  var documentType = ((_refs$documentBody4 = refs.documentBody) === null || _refs$documentBody4 === void 0 ? void 0 : _refs$documentBody4.dataset.documentType) || currentDocumentType;
  var sourceOrder = orders.find(function (item) {
    return item.id === selectedOrderId;
  });
  if (sourceOrder && ['weaving', 'dyeing', 'fullreport', 'quotation', 'waste', 'rawreport', 'productionreport', 'customerreport'].includes(documentType)) {
    var _refs$documentTitle;
    var order = calculateOrder(sourceOrder);
    if (documentType === 'dyeing') {
      var _refs$documentBody5;
      var dyehouseName = String(((_refs$documentBody5 = refs.documentBody) === null || _refs$documentBody5 === void 0 ? void 0 : _refs$documentBody5.dataset.dyehouseName) || '').trim();
      return dyehouseName ? _objectSpread(_objectSpread({}, order), {}, {
        whatsappDyehouseName: dyehouseName
      }) : order;
    }
    if (['weaving', 'fullreport'].includes(documentType)) return order;
    var titleMap = {
      quotation: 'عرض سعر',
      waste: 'تقرير الهالك',
      rawreport: 'تقرير الخام',
      productionreport: 'تقرير الإنتاج',
      customerreport: 'تقرير تسليم العميل'
    };
    var _title = titleMap[documentType] || ((_refs$documentTitle = refs.documentTitle) === null || _refs$documentTitle === void 0 ? void 0 : _refs$documentTitle.textContent) || 'تقرير PDF';
    reportTypeLabels[reportType] = _title;
    return _objectSpread(_objectSpread({}, order), {}, {
      isStandaloneReport: true,
      reportTitle: _title,
      reportSubtitle: "\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628: ".concat(order.orderNumber || '-', " - \u0627\u0644\u0639\u0645\u064A\u0644: ").concat(order.customer || '-')
    });
  }
  var title = ((_refs$documentBody6 = refs.documentBody) === null || _refs$documentBody6 === void 0 ? void 0 : _refs$documentBody6.dataset.reportTitle) || ((_refs$documentTitle2 = refs.documentTitle) === null || _refs$documentTitle2 === void 0 ? void 0 : _refs$documentTitle2.textContent) || 'تقرير PDF';
  var subtitle = ((_refs$documentBody7 = refs.documentBody) === null || _refs$documentBody7 === void 0 ? void 0 : _refs$documentBody7.dataset.reportSubtitle) || 'تقرير PDF من نظام 2B Tex';
  reportTypeLabels[reportType] = title;
  return {
    id: reportType,
    orderNumber: title,
    customer: 'تقرير',
    reportTitle: title,
    reportSubtitle: subtitle,
    isStandaloneReport: true
  };
}
function shareCurrentReportPdf() {
  return _shareCurrentReportPdf.apply(this, arguments);
}
function _shareCurrentReportPdf() {
  _shareCurrentReportPdf = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee74() {
    var reportType, order, oldText, _refs$documentTitle3, blob, fileName, file, _refs$documentTitle4, url, link, _t39, _t40;
    return _regenerator().w(function (_context75) {
      while (1) switch (_context75.p = _context75.n) {
        case 0:
          reportType = currentReportTypeFromDocument();
          order = reportType ? currentShareReportPayload(reportType) : null;
          if (!(!reportType || !order)) {
            _context75.n = 1;
            break;
          }
          alert('لا يوجد تقرير مفتوح جاهز للمشاركة.');
          return _context75.a(2);
        case 1:
          oldText = refs.shareWhatsAppBtn.textContent;
          refs.shareWhatsAppBtn.disabled = true;
          refs.shareWhatsAppBtn.textContent = 'جاري تجهيز PNG...';
          _context75.p = 2;
          _context75.n = 3;
          return reportToPngBlob();
        case 3:
          blob = _context75.v;
          fileName = "".concat(cleanCodePart(reportTypeLabels[reportType] || ((_refs$documentTitle3 = refs.documentTitle) === null || _refs$documentTitle3 === void 0 ? void 0 : _refs$documentTitle3.textContent) || '2B-Tex'), "-").concat(cleanCodePart(order.orderNumber || 'report'), ".png");
          file = new File([blob], fileName, {
            type: 'image/png'
          });
          if (!(navigator.canShare && navigator.canShare({
            files: [file]
          }) && navigator.share)) {
            _context75.n = 5;
            break;
          }
          _context75.n = 4;
          return navigator.share({
            title: reportTypeLabels[reportType] || ((_refs$documentTitle4 = refs.documentTitle) === null || _refs$documentTitle4 === void 0 ? void 0 : _refs$documentTitle4.textContent) || '2B Tex',
            files: [file]
          });
        case 4:
          alert('تم فتح المشاركة اليدوية بصورة PNG عالية الدقة.');
          return _context75.a(2);
        case 5:
          if (!(navigator.clipboard && window.ClipboardItem)) {
            _context75.n = 9;
            break;
          }
          _context75.p = 6;
          _context75.n = 7;
          return navigator.clipboard.write([new ClipboardItem({
            'image/png': blob
          })]);
        case 7:
          alert('تم نسخ صورة التقرير للحافظة. افتح واتساب والصق الصورة يدويًا.');
          return _context75.a(2);
        case 8:
          _context75.p = 8;
          _t39 = _context75.v;
          console.warn('share-png-clipboard-skipped', _t39);
        case 9:
          url = URL.createObjectURL(blob);
          link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          link.remove();
          setTimeout(function () {
            return URL.revokeObjectURL(url);
          }, 1500);
          alert('تم تجهيز صورة PNG عالية الدقة وتنزيلها. أرسلها يدويًا من واتساب.');
          _context75.n = 11;
          break;
        case 10:
          _context75.p = 10;
          _t40 = _context75.v;
          console.error('share-png-error', _t40);
          alert('تعذر تجهيز صورة المشاركة. جرّب الطباعة PDF أو أعد فتح التقرير مرة أخرى.');
        case 11:
          _context75.p = 11;
          refs.shareWhatsAppBtn.disabled = false;
          refs.shareWhatsAppBtn.textContent = oldText;
          return _context75.f(11);
        case 12:
          return _context75.a(2);
      }
    }, _callee74, null, [[6, 8], [2, 10, 11, 12]]);
  }));
  return _shareCurrentReportPdf.apply(this, arguments);
}
function shareCurrentReportPngManual() {
  return _shareCurrentReportPngManual.apply(this, arguments);
}
function _shareCurrentReportPngManual() {
  _shareCurrentReportPngManual = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee75() {
    return _regenerator().w(function (_context76) {
      while (1) switch (_context76.n) {
        case 0:
          _context76.n = 1;
          return shareCurrentReportPdf();
        case 1:
          return _context76.a(2, _context76.v);
      }
    }, _callee75);
  }));
  return _shareCurrentReportPngManual.apply(this, arguments);
}
window.shareCurrentReportPngManual = shareCurrentReportPngManual;
if (refs.shareWhatsAppBtn) {
  refs.shareWhatsAppBtn.textContent = 'مشاركة PNG';
  refs.shareWhatsAppBtn.onclick = shareCurrentReportPngManual;
}
initialLocalStorageSnapshot = captureLocalStorageSnapshot();
loadCurrentUser()["finally"](function () {
  installAutomationUi();
  pollBackendStatus();
  pollWhatsappService();
});
loadBackendData();
setInterval(pollBackendStatus, 15000);
setInterval(pollWhatsappService, 15000);

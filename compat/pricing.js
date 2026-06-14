function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  function createPricingDomain(deps) {
    var buildItemCode = deps.buildItemCode,
      clone = deps.clone,
      isLegacyRecoveredText = deps.isLegacyRecoveredText,
      normalizeDyehousePriceLabel = deps.normalizeDyehousePriceLabel,
      roundNumber = deps.roundNumber;
    var TWO_B_TEX_DYEHOUSE_PRICE_LIBRARY = {
      'جيما': {
        effectiveFrom: '2026-04-15',
        accountingMode: 'net',
        dyeing: {
          'قطن': {
            'غسيل - مفتوح': 45,
            'غسيل - مقفول': 52,
            'أبيض / كسترة - مفتوح': 49,
            'أبيض / كسترة - مقفول': 56,
            'فواتح - مفتوح': 65,
            'فواتح - مقفول': 72,
            'وسط - مفتوح': 68,
            'وسط - مقفول': 75,
            'غوامق - مفتوح': 71,
            'غوامق - مقفول': 78,
            'أسود - مفتوح': 72,
            'أسود - مقفول': 79,
            'أسود خاص - مفتوح': 74,
            'أسود خاص - مقفول': 81,
            'ألوان خاصة - مفتوح': 75,
            'ألوان خاصة - مقفول': 82
          },
          'بوليستر': {
            'أبيض / كسترة - مفتوح': 40,
            'أبيض / كسترة - مقفول': 47,
            'وسط - مفتوح': 41,
            'وسط - مقفول': 48,
            'غوامق - مفتوح': 43,
            'غوامق - مقفول': 50,
            'أسود - مفتوح': 44,
            'أسود - مقفول': 51,
            'ألوان خاصة - مفتوح': 48,
            'ألوان خاصة - مقفول': 55
          }
        },
        extras: {
          'كسترة': 9,
          'قص براسل': 5,
          'حلاقة': 2,
          'كربون فينش': 3,
          'إنزيم': 5,
          'دبل إنزيم': 4,
          'سخاوة خاصة': 5,
          'شق خام': 5,
          'تجهيز خاص نيو جيما': 3,
          'تجهيز سقعانه': 7,
          'تجهيز بوليفار': 7,
          'معالج زيوت': 5,
          'معالجة زيوت خاصة': 8
        }
      },
      'نيو جيما': {
        effectiveFrom: '2026-04-15',
        accountingMode: 'net',
        dyeing: {},
        printing: {
          'بيجمنت': {
            'سنجل بدون ليكرا - أقل من 2.5 متر': 60,
            'سنجل ليكرا - أقل من 2.5 متر': 67,
            'سنجل بدون ليكرا - أقل من 4 متر': 70,
            'سنجل ليكرا - أقل من 4 متر': 77,
            'سنجل بدون ليكرا - أكبر من 4 متر': 77,
            'سنجل ليكرا - أكبر من 4 متر': 84
          },
          'راكتيف': {
            'سنجل بدون ليكرا - أقل من 2.5 متر': 75,
            'سنجل ليكرا - أقل من 2.5 متر': 82,
            'سنجل بدون ليكرا - أقل من 4 متر': 80,
            'سنجل ليكرا - أقل من 4 متر': 87
          },
          'ديسبيرس': {
            'أقل من 2.5 متر': 53,
            'أقل من 4 متر': 60
          },
          'شعيرات + كربون نقش': {
            'عام': 53
          },
          'أوفر برنت': {
            'عام': 16
          },
          'فلوريسنت': {
            'عام': 13
          },
          'جليتر': {
            'عام': 14
          }
        },
        extras: {}
      }
    };
    TWO_B_TEX_DYEHOUSE_PRICE_LIBRARY['نيو جيما'].dyeing = clone(TWO_B_TEX_DYEHOUSE_PRICE_LIBRARY['جيما'].dyeing);
    TWO_B_TEX_DYEHOUSE_PRICE_LIBRARY['نيو جيما'].extras = clone(TWO_B_TEX_DYEHOUSE_PRICE_LIBRARY['جيما'].extras);
    function mergeNestedPriceTable() {
      var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var override = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var merged = clone(base || {});
      Object.entries(override || {}).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          group = _ref2[0],
          rows = _ref2[1];
        if (!rows || _typeof(rows) !== 'object' || Array.isArray(rows)) return;
        merged[group] = _objectSpread(_objectSpread({}, merged[group] || {}), rows);
      });
      return merged;
    }
    function sanitizeDyehousePriceLibrary() {
      var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var clean = {};
      Object.entries(source || {}).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          dyehouse = _ref4[0],
          config = _ref4[1];
        if (!dyehouse || isLegacyRecoveredText(dyehouse) || !config || _typeof(config) !== 'object') return;
        if (config.aliasOf && isLegacyRecoveredText(config.aliasOf)) return;
        var dyeing = {};
        Object.entries(config.dyeing || {}).forEach(function (_ref5) {
          var _ref6 = _slicedToArray(_ref5, 2),
            material = _ref6[0],
            colors = _ref6[1];
          if (!material || isLegacyRecoveredText(material)) return;
          Object.entries(colors || {}).forEach(function (_ref7) {
            var _ref8 = _slicedToArray(_ref7, 2),
              color = _ref8[0],
              price = _ref8[1];
            var cleanColor = normalizeDyehousePriceLabel(color);
            if (!cleanColor || isLegacyRecoveredText(cleanColor)) return;
            var number = Number(price);
            if (!Number.isFinite(number)) return;
            if (!dyeing[material]) dyeing[material] = {};
            dyeing[material][cleanColor] = number;
          });
        });
        var extras = {};
        Object.entries(config.extras || {}).forEach(function (_ref9) {
          var _ref0 = _slicedToArray(_ref9, 2),
            name = _ref0[0],
            price = _ref0[1];
          var number = Number(price);
          if (name && !isLegacyRecoveredText(name) && Number.isFinite(number)) extras[name] = number;
        });
        var printing = {};
        Object.entries(config.printing || {}).forEach(function (_ref1) {
          var _ref10 = _slicedToArray(_ref1, 2),
            type = _ref10[0],
            rows = _ref10[1];
          if (!type || isLegacyRecoveredText(type) || !rows || _typeof(rows) !== 'object') return;
          Object.entries(rows).forEach(function (_ref11) {
            var _ref12 = _slicedToArray(_ref11, 2),
              name = _ref12[0],
              price = _ref12[1];
            var number = Number(price);
            if (!name || isLegacyRecoveredText(name) || !Number.isFinite(number)) return;
            if (!printing[type]) printing[type] = {};
            printing[type][name] = number;
          });
        });
        clean[dyehouse] = {
          effectiveFrom: config.effectiveFrom || '',
          accountingMode: config.accountingMode || 'net',
          dyeing: dyeing,
          printing: printing,
          extras: extras
        };
        if (config.aliasOf) clean[dyehouse].aliasOf = config.aliasOf;
      });
      return clean;
    }
    function mergeDyehousePriceLibrary() {
      var customLibrary = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var merged = sanitizeDyehousePriceLibrary(TWO_B_TEX_DYEHOUSE_PRICE_LIBRARY);
      Object.entries(sanitizeDyehousePriceLibrary(customLibrary || {})).forEach(function (_ref13) {
        var _ref14 = _slicedToArray(_ref13, 2),
          dyehouse = _ref14[0],
          config = _ref14[1];
        if (!dyehouse || !config || _typeof(config) !== 'object') return;
        var current = merged[dyehouse] || {
          effectiveFrom: '',
          dyeing: {},
          extras: {}
        };
        merged[dyehouse] = _objectSpread(_objectSpread(_objectSpread({}, current), config), {}, {
          dyeing: mergeNestedPriceTable(current.dyeing || {}, config.dyeing || {}),
          printing: mergeNestedPriceTable(current.printing || {}, config.printing || {}),
          extras: _objectSpread(_objectSpread({}, current.extras || {}), config.extras || {})
        });
      });
      return merged;
    }
    function getSuggestedDyeCost(librarySource, dyehouse, materialType, colorClass) {
      var _resolved$dyeing$mate, _resolved$dyeing2;
      var library = librarySource[dyehouse];
      var resolved = library !== null && library !== void 0 && library.aliasOf ? librarySource[library.aliasOf] : library;
      if (!resolved) return '';
      var colorKey = normalizeDyehousePriceLabel(colorClass);
      if (materialType === "\u0645\u062E\u0644\u0648\u0637") {
        var _resolved$dyeing;
        var base = (_resolved$dyeing = resolved.dyeing) === null || _resolved$dyeing === void 0 || (_resolved$dyeing = _resolved$dyeing["\u0642\u0637\u0646"]) === null || _resolved$dyeing === void 0 ? void 0 : _resolved$dyeing[colorKey];
        return base === undefined || base === null || base === '' ? '' : Number(base) + 9;
      }
      return (_resolved$dyeing$mate = resolved === null || resolved === void 0 || (_resolved$dyeing2 = resolved.dyeing) === null || _resolved$dyeing2 === void 0 || (_resolved$dyeing2 = _resolved$dyeing2[materialType]) === null || _resolved$dyeing2 === void 0 ? void 0 : _resolved$dyeing2[colorKey]) !== null && _resolved$dyeing$mate !== void 0 ? _resolved$dyeing$mate : '';
    }
    function calculatePricing(pricing, librarySource) {
      var library = librarySource[pricing.dyehouse] || {};
      var wasteBasis = pricing.wasteBasis || pricing.waste_basis || library.accountingMode || 'net';
      var productionCost = Number(pricing.rawCost || 0) + Number(pricing.dyeCost || 0) + Number(pricing.extraCost || 0);
      var wasteBase = wasteBasis === 'gross' ? productionCost : Number(pricing.rawCost || 0);
      var wasteCost = wasteBase * Number(pricing.wastePercent || 0) / 100;
      var costBeforeDeferred = productionCost + wasteCost;
      var deferredCost = costBeforeDeferred * Number(pricing.deferredPercent || pricing.deferred_percent || 0) / 100;
      var costPerKg = costBeforeDeferred + deferredCost;
      var sellPrice = costPerKg + Number(pricing.profitPerKg || 0);
      var totalOffer = sellPrice * Number(pricing.quantity || 0);
      return _objectSpread(_objectSpread({}, pricing), {}, {
        productCode: pricing.productCode || buildItemCode(pricing.pricingNumber),
        accountingMode: wasteBasis,
        wasteBasis: wasteBasis,
        productionCost: roundNumber(productionCost),
        wasteCost: roundNumber(wasteCost),
        costBeforeDeferred: roundNumber(costBeforeDeferred),
        deferredPercent: Number(pricing.deferredPercent || pricing.deferred_percent || 0),
        deferredCost: roundNumber(deferredCost),
        costPerKg: roundNumber(costPerKg),
        sellPrice: roundNumber(sellPrice),
        totalOffer: roundNumber(totalOffer)
      });
    }
    return {
      calculatePricing: calculatePricing,
      getSuggestedDyeCost: getSuggestedDyeCost,
      mergeDyehousePriceLibrary: mergeDyehousePriceLibrary,
      sanitizeDyehousePriceLibrary: sanitizeDyehousePriceLibrary
    };
  }
  window.TwoBTexPricing = {
    createPricingDomain: createPricingDomain
  };
})();

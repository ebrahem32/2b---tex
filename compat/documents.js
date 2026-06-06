"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
(function () {
  function createBuilders(deps) {
    var documentFooter = deps.documentFooter,
      documentHeader = deps.documentHeader,
      documentLogo = deps.documentLogo,
      emptyRow = deps.emptyRow,
      escapeHtml = deps.escapeHtml,
      formatNumber = deps.formatNumber,
      orderRawCost = deps.orderRawCost,
      rawPermitImagesSection = deps.rawPermitImagesSection,
      reportOperationNotes = deps.reportOperationNotes,
      uniqueNonEmpty = deps.uniqueNonEmpty,
      sum = deps.sum,
      roundNumber = deps.roundNumber,
      accessoryTypesLabel = deps.accessoryTypesLabel;
    var safeText = function safeText(value) {
      return escapeHtml(value === undefined || value === null || value === '' ? '-' : value);
    };
    var fmt = function fmt(value) {
      var digits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
      return formatNumber(Number(value || 0), digits);
    };
    var clean = function clean(value) {
      return String(value || '').trim();
    };
    var customerName = function customerName(order) {
      return clean((order === null || order === void 0 ? void 0 : order.customer) || (order === null || order === void 0 ? void 0 : order.customerName) || (order === null || order === void 0 ? void 0 : order.clientName) || '');
    };
    function uniqueBy(rows, keyFactory) {
      var seen = new Set();
      return (rows || []).filter(function (row, index) {
        var key = keyFactory(row, index);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    function orderAllocations(order) {
      return uniqueBy(Array.isArray(order === null || order === void 0 ? void 0 : order.allocations) ? order.allocations : [], function (line, index) {
        return [line.id || index, clean(line.color || line.pantoneCode), clean(line.dyehouse || (order === null || order === void 0 ? void 0 : order.dyehouse)), Number(line.plannedQuantity || 0), clean(line.rawInch || (order === null || order === void 0 ? void 0 : order.inchWidth)), clean(line.targetFinishedWidth || line.rawWidth), clean(line.targetFinishedWeight)].join('|');
      });
    }
    function orderAccessoryLines(order) {
      var configuredLines = Array.isArray(order === null || order === void 0 ? void 0 : order.accessoryLines) ? order.accessoryLines : [];
      var normalized = configuredLines.map(function (line) {
        return {
          type: clean(line.type || 'إكسسوار'),
          percent: Number(line.percent || 0),
          quantity: Number(line.quantityManual || line.quantity || 0)
        };
      }).filter(function (line) {
        return line.type || line.percent || line.quantity;
      });
      if (normalized.length) {
        var byType = new Map();
        normalized.forEach(function (line) {
          var key = clean(line.type || 'إكسسوار');
          var current = byType.get(key) || {
            type: key,
            percent: 0,
            quantity: 0
          };
          current.percent += Number(line.percent || 0);
          current.quantity += Number(line.quantity || 0);
          byType.set(key, current);
        });
        return Array.from(byType.values()).map(function (line) {
          return _objectSpread(_objectSpread({}, line), {}, {
            percent: roundNumber(line.percent),
            quantity: roundNumber(line.quantity)
          });
        });
      }
      var allocationRequired = orderAllocations(order).reduce(function (total, line) {
        return total + Number(line.accessoryQuantity || 0);
      }, 0);
      var quantity = Number((order === null || order === void 0 ? void 0 : order.accessoryRequired) || 0) || allocationRequired;
      var percent = Number((order === null || order === void 0 ? void 0 : order.accessoryPercent) || 0);
      var type = clean((order === null || order === void 0 ? void 0 : order.accessoryType) || '');
      if (!type && !percent && !quantity) return [];
      return [{
        type: type || 'إكسسوار',
        percent: percent,
        quantity: quantity
      }];
    }
    function reportShell(title, order, body) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var subtitle = options.subtitle ? "<span>".concat(safeText(options.subtitle), "</span>") : '';
      return "<div class=\"two-b-report\">".concat(documentHeader(), "<div class=\"report-title\"><h2>").concat(safeText(title)).concat(order !== null && order !== void 0 && order.orderNumber ? " <small># ".concat(safeText(order.orderNumber), "</small>") : '', "</h2>").concat(subtitle, "</div>").concat(basicInfoSection(order, options)).concat(body).concat(documentFooter(), "</div>");
    }
    function basicInfoSection(order) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var omitted = new Set(['رقم الطلب'].concat(_toConsumableArray(options.omitBasicFields || [])));
      var fields = [['رقم الطلب', order === null || order === void 0 ? void 0 : order.orderNumber], ['العميل', customerName(order)], ['التاريخ', options.date || (order === null || order === void 0 ? void 0 : order.orderDate)], ['الصنف', order === null || order === void 0 ? void 0 : order.fabricType], ['إجمالي الخام', "".concat(fmt(order === null || order === void 0 ? void 0 : order.totalRawOrdered), " \u0643\u062C\u0645")], ['المصبغة', options.dyehouse || (order === null || order === void 0 ? void 0 : order.dyehouse)]].filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
          label = _ref2[0];
        return !omitted.has(label);
      });
      if (options.rawNotes && !omitted.has('إذن الخام')) fields.push(['إذن الخام', options.rawNotes]);
      return "<div class=\"document-meta\">".concat(fields.map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          label = _ref4[0],
          value = _ref4[1];
        return "<div><span>".concat(safeText(label), "</span>").concat(safeText(value), "</div>");
      }).join(''), "</div>");
    }
    function colorRows(order) {
      var rows = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : orderAllocations(order);
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var includeDyehouse = !!options.includeDyehouse;
      var includeInch = options.includeInch || (order === null || order === void 0 ? void 0 : order.widthMode) === 'multiple';
      var includeFinished = options.includeFinished !== false;
      var includeReceived = !!options.includeReceived;
      var includeCustomerDelivered = !!options.includeCustomerDelivered;
      var includeWaste = !!options.includeWaste;
      var headers = ['اللون', includeInch ? 'البوصة' : '', 'الكمية', includeDyehouse ? 'المصبغة' : '', includeReceived ? 'دخل المخزن' : '', includeCustomerDelivered ? 'تسليم العميل' : '', includeWaste ? 'الهالك الفعلي' : '', includeFinished ? 'الوزن المجهز' : '', 'العرض'].filter(Boolean);
      var body = rows.map(function (line) {
        var cells = [safeText(line.color || line.pantoneCode), includeInch ? safeText(line.rawInch || (order === null || order === void 0 ? void 0 : order.inchWidth)) : '', fmt(line.plannedQuantity), includeDyehouse ? safeText(line.dyehouse || (order === null || order === void 0 ? void 0 : order.dyehouse)) : '', includeReceived ? fmt(line.finishedReceived) : '', includeCustomerDelivered ? fmt(line.deliveredToCustomer || line.customerDelivered) : '', includeWaste ? "".concat(fmt(line.wasteQuantity), " (").concat(formatNumber(Number(line.wastePercent || 0), 1), "%)") : '', includeFinished ? safeText(line.targetFinishedWeight) : '', safeText(line.targetFinishedWidth || line.rawWidth)].filter(function (cell) {
          return cell !== '';
        });
        return "<tr>".concat(cells.map(function (cell) {
          return "<td>".concat(cell, "</td>");
        }).join(''), "</tr>");
      }).join('');
      return "<section class=\"report-section\"><h3>\u062C\u062F\u0648\u0644 \u0627\u0644\u0623\u0644\u0648\u0627\u0646</h3><table><thead><tr>".concat(headers.map(function (head) {
        return "<th>".concat(safeText(head), "</th>");
      }).join(''), "</tr></thead><tbody>").concat(body || emptyRow(headers.length, 'لا توجد ألوان مسجلة.'), "</tbody></table></section>");
    }
    function accessoriesSection(order) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var lines = orderAccessoryLines(order);
      if (!lines.length) return '';
      var showMovement = !!options.showMovement;
      var header = showMovement ? '<tr><th>نوع الإكسسوار</th><th>النسبة</th><th>المطلوب</th><th>المرسل</th><th>المستلم</th><th>المسلم للعميل</th><th>الرصيد</th></tr>' : '<tr><th>نوع الإكسسوار</th><th>النسبة</th><th>الكمية المطلوبة</th></tr>';
      var rows = lines.map(function (line) {
        if (!showMovement) return "<tr><td>".concat(safeText(line.type), "</td><td>").concat(formatNumber(line.percent || 0), "%</td><td>").concat(fmt(line.quantity), "</td></tr>");
        return "<tr><td>".concat(safeText(line.type), "</td><td>").concat(formatNumber(line.percent || 0), "%</td><td>").concat(fmt(line.quantity || (order === null || order === void 0 ? void 0 : order.accessoryRequired)), "</td><td>").concat(fmt(order === null || order === void 0 ? void 0 : order.accessorySent), "</td><td>").concat(fmt(order === null || order === void 0 ? void 0 : order.accessoryReceived), "</td><td>").concat(fmt(order === null || order === void 0 ? void 0 : order.accessoryDelivered), "</td><td>").concat(fmt(order === null || order === void 0 ? void 0 : order.accessoryBalance), "</td></tr>");
      }).join('');
      return "<section class=\"report-section\"><h3>\u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062A</h3><table class=\"summary-table\"><thead>".concat(header, "</thead><tbody>").concat(rows, "</tbody></table></section>");
    }
    function notesSection(order) {
      return "<section class=\"report-section\"><h3>\u0645\u0644\u0627\u062D\u0638\u0627\u062A</h3><p>".concat(safeText(reportOperationNotes(order)), "</p></section>");
    }
    function widthSummary(order) {
      if ((order === null || order === void 0 ? void 0 : order.widthMode) === 'multiple') {
        var inches = uniqueNonEmpty((order.widthLines || []).map(function (line) {
          return line.inch;
        })).join('، ');
        return inches || '-';
      }
      return (order === null || order === void 0 ? void 0 : order.inchWidth) || '-';
    }
    function buildWeavingOrderDocument(order) {
      var rawNotes = orderRawPermitNotes(order);
      var rawRows = "<section class=\"report-section\"><h3>\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062A\u0634\u063A\u064A\u0644</h3><table class=\"summary-table\"><tbody><tr><th>\u0645\u0635\u062F\u0631 \u0627\u0644\u0646\u0633\u064A\u062C</th><td>".concat(safeText(order === null || order === void 0 ? void 0 : order.weavingSource), "</td><th>\u0627\u0644\u0628\u0648\u0635\u0629</th><td>").concat(safeText(widthSummary(order)), "</td></tr><tr><th>\u0625\u0630\u0646 \u0627\u0644\u062E\u0627\u0645</th><td>").concat(safeText(rawNotes), "</td><th>\u0633\u0639\u0631 \u0627\u0644\u062E\u0627\u0645</th><td>").concat(fmt(orderRawCost(order)), "</td></tr></tbody></table></section>");
      return reportShell('أمر تشغيل نسيج', order, "".concat(rawRows).concat(colorRows(order, orderAllocations(order), {
        includeDyehouse: false,
        includeReceived: false,
        includeWaste: false
      })).concat(accessoriesSection(order)).concat(notesSection(order)));
    }
    function orderRawPermitNoteList(order) {
      return [].concat(_toConsumableArray(Array.isArray(order === null || order === void 0 ? void 0 : order.rawNoteNumbers) ? order.rawNoteNumbers : []), _toConsumableArray(rawBatchesFor(order).map(function (batch) {
        return batch.noteNumber;
      })));
    }
    function orderRawPermitNotes(order) {
      return uniqueNonEmpty(orderRawPermitNoteList(order)).join('، ') || '-';
    }
    function dyehouseTransfersFor(order, dyehouseName) {
      var name = clean(dyehouseName);
      return (Array.isArray(order === null || order === void 0 ? void 0 : order.dyehouseTransfers) ? order.dyehouseTransfers : []).filter(function (transfer) {
        return clean(transfer.toDyehouse) === name;
      });
    }
    function transferNoteNumber(transfer) {
      var direct = String((transfer === null || transfer === void 0 ? void 0 : transfer.noteNumber) || '').trim();
      if (direct) return direct;
      var text = String((transfer === null || transfer === void 0 ? void 0 : transfer.reason) || (transfer === null || transfer === void 0 ? void 0 : transfer.notes) || '').trim();
      var match = text.match(/(?:رقم\s*الإذن|رقم\s*اذن|إذن|اذن)\s*[:：-]?\s*([0-9٠-٩A-Za-z/-]+)/);
      return match ? match[1] : '';
    }
    function rawBatchesFor(order) {
      return (Array.isArray(order === null || order === void 0 ? void 0 : order.rawBatches) ? order.rawBatches : []).filter(function (batch) {
        return batch.orderId === (order === null || order === void 0 ? void 0 : order.id);
      });
    }
    function dyehouseRawNotes(order, dyehouseName, isOriginalDyehouse) {
      var notes = dyehouseRawNoteList(order, dyehouseName, isOriginalDyehouse);
      return uniqueNonEmpty(notes).join('، ') || '-';
    }
    function dyehouseRawNoteList(order, dyehouseName, isOriginalDyehouse) {
      var name = clean(dyehouseName);
      if (!isOriginalDyehouse) return dyehouseTransfersFor(order, dyehouseName).map(function (transfer) {
        return transferNoteNumber(transfer);
      });
      var outgoingTransferNotes = new Set(uniqueNonEmpty((Array.isArray(order === null || order === void 0 ? void 0 : order.dyehouseTransfers) ? order.dyehouseTransfers : []).filter(function (transfer) {
        return clean(transfer.fromDyehouse) === name && clean(transfer.toDyehouse) !== name;
      }).map(function (transfer) {
        return transferNoteNumber(transfer);
      })).map(function (note) {
        return clean(note);
      }));
      return rawBatchesFor(order).map(function (batch) {
        return batch.noteNumber;
      }).filter(function (note) {
        return !outgoingTransferNotes.has(clean(note));
      });
    }
    function buildDyeingOrderDocument(order, dyehouseName) {
      var name = clean(dyehouseName || (order === null || order === void 0 ? void 0 : order.dyehouse));
      var originalDyehouse = clean(order === null || order === void 0 ? void 0 : order.dyehouse);
      var isOriginalDyehouse = !name || name === originalDyehouse;
      var transfersToDyehouse = dyehouseTransfersFor(order, name);
      var rows = orderAllocations(order).filter(function (allocation) {
        var allocationDyehouse = clean(allocation.dyehouse || (order === null || order === void 0 ? void 0 : order.dyehouse));
        if (isOriginalDyehouse) return allocationDyehouse === name;
        return allocationDyehouse === name && transfersToDyehouse.some(function (transfer) {
          return transfer.newAllocationId === allocation.id || transfer.allocationId === allocation.id || clean(transfer.color) === clean(allocation.color || allocation.pantoneCode);
        });
      });
      var plannedTotal = roundNumber(rows.reduce(function (total, allocation) {
        return total + Number(allocation.plannedQuantity || 0);
      }, 0));
      var rawTotal = isOriginalDyehouse ? roundNumber(Math.max(sum(rawBatchesFor(order)) - sum(((order === null || order === void 0 ? void 0 : order.dyehouseTransfers) || []).filter(function (transfer) {
        return clean(transfer.fromDyehouse) === name && clean(transfer.toDyehouse) !== name;
      })), 0)) : roundNumber(sum(transfersToDyehouse));
      var dates = isOriginalDyehouse ? rawBatchesFor(order).map(function (batch) {
        return batch.date;
      }) : transfersToDyehouse.map(function (transfer) {
        return transfer.transferDate || transfer.date;
      });
      var reportDate = uniqueNonEmpty(dates).join('، ') || (order === null || order === void 0 ? void 0 : order.orderDate) || '-';
      var rawNoteList = uniqueNonEmpty(dyehouseRawNoteList(order, name, isOriginalDyehouse));
      var rawNotes = dyehouseRawNotes(order, name, isOriginalDyehouse);
      var summary = "<section class=\"report-section\"><h3>\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0635\u0628\u0627\u063A\u0629</h3><table class=\"summary-table\"><tbody><tr><th>\u0625\u062C\u0645\u0627\u0644\u064A \u0643\u0645\u064A\u0629 \u0627\u0644\u0645\u0635\u0628\u063A\u0629</th><td>".concat(fmt(plannedTotal), "</td><th>\u0631\u0635\u064A\u062F \u0627\u0644\u062E\u0627\u0645 \u0641\u064A \u0627\u0644\u0645\u0635\u0628\u063A\u0629</th><td>").concat(fmt(rawTotal), "</td></tr><tr><th>\u0639\u062F\u062F \u0627\u0644\u0623\u0644\u0648\u0627\u0646</th><td>").concat(rows.length, "</td><th>\u0625\u0630\u0646 \u0627\u0644\u062E\u0627\u0645</th><td>").concat(safeText(rawNotes), "</td></tr></tbody></table></section>");
      var rawImages = typeof rawPermitImagesSection === 'function' ? rawPermitImagesSection(order, rawNoteList) : '';
      return reportShell('أمر تشغيل صباغة', order, "".concat(summary).concat(colorRows(order, rows, {
        includeDyehouse: false,
        includeReceived: false,
        includeWaste: false
      })).concat(accessoriesSection(_objectSpread(_objectSpread({}, order), {}, {
        allocations: rows
      }))).concat(notesSection(order)).concat(rawImages), {
        dyehouse: name,
        date: reportDate,
        rawNotes: rawNotes,
        omitBasicFields: ['إذن الخام']
      });
    }
    function buildDyeingSummaryDocument(order) {
      return buildDyeingOrderDocument(_objectSpread(_objectSpread({}, order), {}, {
        rawBatches: order.rawBatches || [],
        dyehouseTransfers: order.dyehouseTransfers || []
      }), (order === null || order === void 0 ? void 0 : order.dyehouse) || '');
    }
    function buildLabSamplesDocument(order) {
      var rows = orderAllocations(order);
      var sampleRows = [];
      for (var index = 0; index < Math.max(rows.length, 1); index += 2) {
        var right = rows[index] || {};
        var left = rows[index + 1] || {};
        sampleRows.push("<tr><td class=\"sample-cell\"></td><td class=\"color-cell\">".concat(safeText(right.color || right.pantoneCode || ''), "</td><td class=\"color-cell\">").concat(safeText(left.color || left.pantoneCode || ''), "</td><td class=\"sample-cell\"></td></tr>"));
      }
      var accessoryLines = orderAccessoryLines(order);
      var accessoryTotal = roundNumber(accessoryLines.reduce(function (total, line) {
        return total + Number(line.quantity || 0);
      }, 0));
      var accessoryRows = accessoryLines.map(function (line) {
        return "<tr class=\"lab-accessory-row\"><th>".concat(safeText(line.type), "</th><td>").concat(formatNumber(line.percent || 0), "%</td><th>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</th><td>").concat(fmt(line.quantity), " \u0643\u062C\u0645</td></tr>");
      }).join('');
      var accessorySection = accessoryLines.length ? "<tr class=\"lab-section-title\"><th colspan=\"4\">\u0625\u062C\u0645\u0627\u0644\u064A\u0627\u062A \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062A</th></tr><tr class=\"lab-sample-head\"><th>\u0646\u0648\u0639 \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631</th><th>\u0627\u0644\u0646\u0633\u0628\u0629</th><th>\u0627\u0644\u0628\u0646\u062F</th><th>\u0627\u0644\u0643\u0645\u064A\u0629</th></tr>".concat(accessoryRows, "<tr class=\"lab-total-row\"><th colspan=\"3\">\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062A</th><td>").concat(fmt(accessoryTotal), " \u0643\u062C\u0645</td></tr>") : '';
      return "<div class=\"document-sheet lab-document lab-samples-sheet\"><table class=\"lab-samples-table\"><colgroup><col class=\"lab-sample-col\"><col class=\"lab-color-col\"><col class=\"lab-color-col\"><col class=\"lab-sample-col\"></colgroup><tbody><tr><td colspan=\"3\" class=\"lab-title\">\u0639\u064A\u0646\u0627\u062A \u0645\u0639\u0645\u0644</td><td class=\"lab-logo-cell\">".concat(documentLogo(), "</td></tr><tr class=\"lab-meta-row\"><th>\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628</th><td class=\"lab-order-number\">").concat(safeText(order === null || order === void 0 ? void 0 : order.orderNumber), "</td><th>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</th><td>").concat(safeText(order === null || order === void 0 ? void 0 : order.orderDate), "</td></tr><tr class=\"lab-meta-row\"><th>\u0627\u0644\u0645\u0635\u0628\u063A\u0629</th><td>").concat(safeText(order === null || order === void 0 ? void 0 : order.dyehouse), "</td><th>\u0627\u0644\u0635\u0646\u0641</th><td>").concat(safeText(order === null || order === void 0 ? void 0 : order.fabricType), "</td></tr><tr class=\"lab-item-row\"><th colspan=\"2\">\u0627\u0644\u0643\u0645\u064A\u0629</th><td colspan=\"2\">").concat(fmt(order === null || order === void 0 ? void 0 : order.totalRawOrdered), " \u0643\u062C\u0645</td></tr><tr class=\"lab-sample-head\"><th>\u0627\u0644\u0639\u064A\u0646\u0629</th><th>\u0627\u0644\u0644\u0648\u0646</th><th>\u0627\u0644\u0644\u0648\u0646</th><th>\u0627\u0644\u0639\u064A\u0646\u0629</th></tr>").concat(sampleRows.join('')).concat(accessorySection, "</tbody></table></div>");
    }
    function buildStickersDocument(order) {
      var rows = orderAllocations(order);
      var stickerRows = rows.map(function (line, index) {
        var stickerId = "sticker-".concat(line.id || index);
        return "<div class=\"sticker-item\"><div class=\"sticker-card\" data-sticker-id=\"".concat(safeText(stickerId), "\"><div class=\"sticker-brand\"><strong>2B Tex</strong><span>\u062A\u0634\u063A\u064A\u0644</span></div><div class=\"sticker-order\">").concat(safeText(order === null || order === void 0 ? void 0 : order.orderNumber), "</div><div class=\"sticker-line\"><span>\u0627\u0644\u0639\u0645\u064A\u0644</span><strong>").concat(safeText(customerName(order)), "</strong></div><div class=\"sticker-line\"><span>\u0627\u0644\u0635\u0646\u0641</span><strong>").concat(safeText(order === null || order === void 0 ? void 0 : order.fabricType), "</strong></div><div class=\"sticker-line sticker-line-color\"><span>\u0627\u0644\u0644\u0648\u0646</span><strong>").concat(safeText(line.color || line.pantoneCode), "</strong></div><div class=\"sticker-grid\"><div><span>\u0627\u0644\u0643\u0645\u064A\u0629</span><strong>").concat(fmt(line.plannedQuantity), "</strong></div><div><span>\u0627\u0644\u0628\u0648\u0635\u0629</span><strong>").concat(safeText(line.rawInch || (order === null || order === void 0 ? void 0 : order.inchWidth)), "</strong></div><div><span>\u0627\u0644\u0639\u0631\u0636</span><strong>").concat(safeText(line.targetFinishedWidth || line.rawWidth), "</strong></div><div><span>\u0627\u0644\u0648\u0632\u0646</span><strong>").concat(safeText(line.targetFinishedWeight), "</strong></div></div></div><button class=\"mini-btn sticker-print-btn\" type=\"button\" data-print-sticker=\"").concat(safeText(stickerId), "\">\u0637\u0628\u0627\u0639\u0629 \u0647\u0630\u0627 \u0627\u0644\u0644\u0648\u0646</button></div>");
      }).join('');
      return "<div class=\"document-sheet sticker-sheet\">".concat(stickerRows || '<p>لا توجد استيكرات متاحة.</p>', "</div>");
    }
    function buildCompactFullReportDocument(order) {
      var summary = "<section class=\"report-section\"><h3>\u0645\u0644\u062E\u0635 \u0627\u0644\u062A\u0634\u063A\u064A\u0644</h3><table class=\"summary-table\"><tbody><tr><th>\u062E\u0627\u0645 \u0645\u0637\u0644\u0648\u0628</th><td>".concat(fmt(order === null || order === void 0 ? void 0 : order.totalRawOrdered), "</td><th>\u062E\u0627\u0645 \u0645\u0633\u062A\u0644\u0645</th><td>").concat(fmt(order === null || order === void 0 ? void 0 : order.totalRawReceived), "</td></tr><tr><th>\u0645\u0631\u0633\u0644 \u0644\u0644\u0645\u0635\u0628\u063A\u0629</th><td>").concat(fmt(order === null || order === void 0 ? void 0 : order.totalSentToDyehouse), "</td><th>\u062F\u062E\u0644 \u0627\u0644\u0645\u062E\u0632\u0646</th><td>").concat(fmt(order === null || order === void 0 ? void 0 : order.totalFinishedReceived), "</td></tr><tr><th>\u0631\u0635\u064A\u062F \u0627\u0644\u0645\u062E\u0632\u0646</th><td>").concat(fmt(order === null || order === void 0 ? void 0 : order.warehouseBalance), "</td><th>\u0647\u0627\u0644\u0643 \u062A\u0642\u062F\u064A\u0631\u064A</th><td>").concat(fmt(order === null || order === void 0 ? void 0 : order.expectedWasteQuantity), "</td></tr></tbody></table></section>");
      return reportShell('التقرير التفصيلي للطلب', order, "".concat(summary).concat(colorRows(order, orderAllocations(order), {
        includeCustomerDelivered: true,
        includeWaste: true
      })).concat(accessoriesSection(order, {
        showMovement: true
      })).concat(notesSection(order)), {
        subtitle: 'متابعة كاملة من الخام حتى التسليم للعميل.',
        omitBasicFields: ['إجمالي الخام', 'المصبغة']
      });
    }
    function buildWasteReportDocument(order) {
      return reportShell('تقرير الهالك', order, "".concat(colorRows(order, orderAllocations(order), {
        includeCustomerDelivered: true,
        includeWaste: true
      })).concat(accessoriesSection(order, {
        showMovement: true
      })).concat(notesSection(order)), {
        subtitle: 'الهالك الفعلي محسوب من التشغيل الفعلي.',
        omitBasicFields: ['المصبغة']
      });
    }
    function buildQuotationDocument(order) {
      var total = roundNumber(orderAllocations(order).reduce(function (sum, line) {
        return sum + Number(line.plannedQuantity || 0) * Number((order === null || order === void 0 ? void 0 : order.kiloPrice) || 0);
      }, 0));
      var rows = orderAllocations(order).map(function (line) {
        return "<tr><td>".concat(safeText(order === null || order === void 0 ? void 0 : order.fabricType), "</td><td>").concat(safeText(line.color || line.pantoneCode), "</td><td>").concat(fmt(line.plannedQuantity), "</td><td>").concat(safeText(line.rawInch || (order === null || order === void 0 ? void 0 : order.inchWidth)), "</td><td>").concat(fmt(order === null || order === void 0 ? void 0 : order.kiloPrice), "</td><td>").concat(fmt(Number(line.plannedQuantity || 0) * Number((order === null || order === void 0 ? void 0 : order.kiloPrice) || 0)), "</td></tr>");
      }).join('');
      var table = "<section class=\"report-section\"><h3>\u0628\u0646\u0648\u062F \u0627\u0644\u0639\u0631\u0636</h3><table><thead><tr><th>\u0627\u0644\u0635\u0646\u0641</th><th>\u0627\u0644\u0644\u0648\u0646</th><th>\u0627\u0644\u0643\u0645\u064A\u0629</th><th>\u0627\u0644\u0628\u0648\u0635\u0629</th><th>\u0633\u0639\u0631 \u0627\u0644\u0643\u064A\u0644\u0648</th><th>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</th></tr></thead><tbody>".concat(rows || emptyRow(6, 'لا توجد بنود عرض.'), "</tbody></table></section>");
      var summary = "<section class=\"report-section quotation-summary\"><h3>\u0645\u0644\u062E\u0635 \u0627\u0644\u0639\u0631\u0636</h3><table class=\"summary-table\"><tbody><tr><th>\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0639\u0642\u062F</th><td>".concat(fmt(total), " \u062C\u0646\u064A\u0647</td><th>\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u0633\u062F\u0627\u062F</th><td>").concat(safeText((order === null || order === void 0 ? void 0 : order.paymentTerms) || 'كاش'), "</td></tr></tbody></table></section>");
      return reportShell('عرض سعر', order, "".concat(summary).concat(table).concat(notesSection(order)), {
        subtitle: 'عرض تجاري للعميل حسب بيانات الطلب الحالية.',
        omitBasicFields: ['المصبغة']
      });
    }
    return {
      buildCompactFullReportDocument: buildCompactFullReportDocument,
      buildDyeingOrderDocument: buildDyeingOrderDocument,
      buildDyeingSummaryDocument: buildDyeingSummaryDocument,
      buildLabSamplesDocument: buildLabSamplesDocument,
      buildQuotationDocument: buildQuotationDocument,
      buildStickersDocument: buildStickersDocument,
      buildWasteReportDocument: buildWasteReportDocument,
      buildWeavingOrderDocument: buildWeavingOrderDocument
    };
  }
  window.TwoBTexDocuments = {
    createBuilders: createBuilders
  };
})();

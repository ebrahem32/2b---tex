"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
(function () {
  function createOrderDomain(deps) {
    var buildItemCode = deps.buildItemCode,
      orderRawCost = deps.orderRawCost,
      roundNumber = deps.roundNumber,
      sum = deps.sum,
      uid = deps.uid,
      getState = deps.getState;
    function state() {
      return getState();
    }
    function orderAccessoryConfig() {
      var order = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var lines = Array.isArray(order.accessoryLines) ? order.accessoryLines : [];
      if (lines.length) {
        return lines.map(function (line) {
          return {
            id: line.id || uid(),
            type: line.type || 'إكسسوار',
            percent: Number(line.percent || 0),
            quantityManual: line.quantityManual !== undefined ? line.quantityManual : ''
          };
        }).filter(function (line) {
          return line.type || line.percent || line.quantityManual;
        });
      }
      if (order.accessoryType || Number(order.accessoryPercent || 0)) {
        return [{
          id: uid(),
          type: order.accessoryType || 'إكسسوار',
          percent: Number(order.accessoryPercent || 0),
          quantityManual: ''
        }];
      }
      return [];
    }
    function normalizeOrderForRuntime() {
      var order = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var safe = _objectSpread({}, order);
      safe.id = safe.id || uid();
      safe.orderNumber = safe.orderNumber || '';
      safe.productCode = safe.productCode || buildItemCode(safe.orderNumber);
      safe.customer = safe.customer || '';
      safe.orderDate = safe.orderDate || new Date().toISOString().slice(0, 10);
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
      safe.operationNotes = safe.operationNotes && _typeof(safe.operationNotes) === 'object' && !Array.isArray(safe.operationNotes) ? safe.operationNotes : {};
      safe.operationClosed = Boolean(safe.operationClosed);
      return safe;
    }
    function getAllocations(order) {
      return state().allocations.filter(function (allocation) {
        return allocation.orderId === order.id;
      });
    }
    function calculateAllocation() {
      var allocation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var orderContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var data = state();
      var order = orderContext || data.orders.find(function (item) {
        return item.id === allocation.orderId;
      }) || {};
      var orderAllocations = getAllocations(order);
      var directAllocationIds = new Set(orderAllocations.map(function (item) {
        return item.id;
      }));
      var orderRawSent = sum(data.rawBatches.filter(function (batch) {
        return batch.orderId === allocation.orderId && !directAllocationIds.has(batch.widthLineId);
      }));
      var directAllocationSent = sum(data.rawBatches.filter(function (batch) {
        return batch.orderId === allocation.orderId && batch.widthLineId === allocation.id;
      }));
      var widthRawSent = allocation.widthLineId ? sum(data.rawBatches.filter(function (batch) {
        return batch.orderId === allocation.orderId && batch.widthLineId === allocation.widthLineId;
      })) : 0;
      var widthPlanned = allocation.widthLineId ? orderAllocations.filter(function (item) {
        return item.widthLineId === allocation.widthLineId;
      }).reduce(function (total, item) {
        return total + Number(item.plannedQuantity || 0);
      }, 0) : 0;
      var totalPlanned = roundNumber(orderAllocations.reduce(function (total, item) {
        return total + Number(item.plannedQuantity || 0);
      }, 0));
      var basePlanned = Number(allocation.plannedQuantity || 0);
      var proportionalWidthSent = widthPlanned ? widthRawSent * basePlanned / widthPlanned : 0;
      var proportionalOrderSent = totalPlanned ? orderRawSent * basePlanned / totalPlanned : 0;
      var sent = roundNumber(directAllocationSent || (allocation.widthLineId ? proportionalWidthSent : orderAllocations.length <= 1 ? orderRawSent : proportionalOrderSent));
      var finished = sum(data.productionBatches.filter(function (batch) {
        return batch.allocationId === allocation.id;
      }));
      var deliveredToCustomer = sum(data.customerBatches.filter(function (batch) {
        return batch.allocationId === allocation.id;
      }));
      var rawReturned = sum(data.rawReturns.filter(function (batch) {
        return batch.allocationId === allocation.id;
      }));
      var actualBase = sent || Number(allocation.plannedQuantity || 0);
      var actualWaste = order.operationClosed && (sent || finished || rawReturned) ? Math.max(sent - finished - rawReturned, 0) : 0;
      var actualWastePercent = actualBase ? roundNumber(actualWaste / actualBase * 100) : 0;
      var transfers = data.dyehouseTransfers.filter(function (batch) {
        return batch.allocationId === allocation.id;
      });
      return _objectSpread(_objectSpread({}, allocation), {}, {
        transfers: transfers,
        rawReturned: roundNumber(rawReturned),
        transferredQuantity: roundNumber(sum(transfers)),
        sentToDyehouse: roundNumber(sent),
        finishedReceived: roundNumber(finished),
        deliveredToCustomer: roundNumber(deliveredToCustomer),
        customerDelivered: roundNumber(deliveredToCustomer),
        remainingAtDyehouse: roundNumber(Math.max(sent - finished - rawReturned - actualWaste, 0)),
        actualWasteQuantity: roundNumber(actualWaste),
        actualWastePercent: actualWastePercent,
        wasteQuantity: roundNumber(actualWaste),
        wastePercent: actualWastePercent
      });
    }
    function expectedWasteFor(order, quantity) {
      return roundNumber(Number(quantity || 0) * Number(order.expectedWastePercent || 0) / 100);
    }
    function allocationAccessoryQuantity(order, allocation) {
      if (allocation.accessoryQuantityManual !== null && allocation.accessoryQuantityManual !== undefined && allocation.accessoryQuantityManual !== '') return roundNumber(Number(allocation.accessoryQuantityManual || 0));
      var lines = orderAccessoryConfig(order);
      var percent = lines.length ? lines.reduce(function (total, line) {
        return total + Number(line.percent || 0);
      }, 0) : Number(order.accessoryPercent || 0);
      return roundNumber(Number(allocation.plannedQuantity || 0) * percent / 100);
    }
    function calculateOrder(order) {
      var data = state();
      order = normalizeOrderForRuntime(order);
      var expectedWastePercent = Number(order.expectedWastePercent || 0);
      var isClosed = Boolean(order.operationClosed);
      var baseAllocations = getAllocations(order).map(function (allocation) {
        return calculateAllocation(allocation, order);
      });
      var orderAllocations = baseAllocations.map(function (allocation) {
        var widthLine = (order.widthLines || []).find(function (item) {
          return item.id === allocation.widthLineId;
        });
        var expectedWasteQuantity = isClosed ? expectedWasteFor(order, allocation.plannedQuantity) : 0;
        if (widthLine) return _objectSpread(_objectSpread({}, allocation), {}, {
          rawInch: widthLine.inch,
          rawWidth: widthLine.width,
          targetFinishedWidth: widthLine.width,
          accessoryQuantity: allocationAccessoryQuantity(order, allocation),
          expectedWastePercent: expectedWastePercent,
          expectedWasteQuantity: expectedWasteQuantity
        });
        return _objectSpread(_objectSpread({}, allocation), {}, {
          accessoryQuantity: allocationAccessoryQuantity(order, allocation),
          expectedWastePercent: expectedWastePercent,
          expectedWasteQuantity: expectedWasteQuantity
        });
      });
      var rawToDyehouse = sum(data.rawBatches.filter(function (batch) {
        return batch.orderId === order.id;
      }));
      var allocated = roundNumber(orderAllocations.reduce(function (total, item) {
        return total + Number(item.plannedQuantity || 0);
      }, 0));
      var operated = roundNumber(orderAllocations.reduce(function (total, item) {
        return total + Number(item.sentToDyehouse || 0);
      }, 0));
      var warehouseReceived = roundNumber(orderAllocations.reduce(function (total, item) {
        return total + Number(item.finishedReceived || 0);
      }, 0));
      var rawReturnedToWeaving = sum(data.rawReturns.filter(function (batch) {
        return orderAllocations.some(function (allocation) {
          return allocation.id === batch.allocationId;
        });
      }));
      var deliveredToCustomer = sum(data.customerBatches.filter(function (batch) {
        return orderAllocations.some(function (allocation) {
          return allocation.id === batch.allocationId;
        });
      }));
      var waste = isClosed ? Math.max(rawToDyehouse - warehouseReceived - rawReturnedToWeaving, 0) : 0;
      var widthLines = order.widthMode === 'multiple' ? order.widthLines || [] : [{
        inch: order.inchWidth || '',
        width: Number(order.inchWidth || 0),
        quantity: Number(order.totalRawQuantity || 0)
      }];
      var totalWidthQuantity = roundNumber(widthLines.reduce(function (total, item) {
        return total + Number(item.quantity || 0);
      }, 0));
      var totalRawOrdered = order.widthMode === 'multiple' && totalWidthQuantity > 0 ? totalWidthQuantity : roundNumber(order.totalRawQuantity);
      var configuredAccessoryLines = orderAccessoryConfig(order).map(function (line) {
        var quantity = line.quantityManual !== '' && line.quantityManual !== null && line.quantityManual !== undefined ? Number(line.quantityManual || 0) : Number(order.totalRawQuantity || 0) * Number(line.percent || 0) / 100;
        return {
          id: line.id || uid(),
          type: line.type || 'إكسسوار',
          percent: Number(line.percent || 0),
          quantityManual: line.quantityManual,
          quantity: roundNumber(quantity)
        };
      }).filter(function (line) {
        return line.type || line.percent || line.quantity;
      });
      var manualAccessoryQuantity = roundNumber(orderAllocations.reduce(function (total, item) {
        return total + Number(item.accessoryQuantity || 0);
      }, 0));
      var recordedAccessoryQuantity = sum(data.accessoryBatches.filter(function (batch) {
        return batch.orderId === order.id && (!batch.movement || batch.movement === 'sent');
      }));
      var hasAccessory = configuredAccessoryLines.length > 0 || !!order.accessoryType || manualAccessoryQuantity > 0 || recordedAccessoryQuantity > 0;
      var accessoryQuantity = manualAccessoryQuantity || roundNumber(Number(order.totalRawQuantity || 0) * Number(order.accessoryPercent || 0) / 100) || recordedAccessoryQuantity;
      var accessoryLines = configuredAccessoryLines.length ? configuredAccessoryLines : hasAccessory ? [{
        type: order.accessoryType || 'إكسسوار',
        percent: Number(order.accessoryPercent || 0),
        quantity: roundNumber(accessoryQuantity)
      }] : [];
      var accessoryRequired = roundNumber(accessoryLines.reduce(function (total, item) {
        return total + Number(item.quantity || 0);
      }, 0));
      var accessorySent = sum(data.accessoryBatches.filter(function (batch) {
        return batch.orderId === order.id && (!batch.movement || batch.movement === 'sent');
      }));
      var accessoryReceived = sum(data.accessoryBatches.filter(function (batch) {
        return batch.orderId === order.id && batch.movement === 'received';
      }));
      var accessoryDelivered = sum(data.accessoryBatches.filter(function (batch) {
        return batch.orderId === order.id && batch.movement === 'customer';
      }));
      var accessoryWaste = isClosed ? Math.max(accessorySent - accessoryReceived, 0) : 0;
      return _objectSpread(_objectSpread({}, order), {}, {
        allocations: orderAllocations,
        totalRawOrdered: totalRawOrdered,
        widthLines: widthLines,
        totalWidthQuantity: totalWidthQuantity,
        widthDistributionMatches: Math.abs(totalWidthQuantity - Number(order.totalRawQuantity || 0)) <= 0.01,
        accessoryLines: accessoryLines,
        totalRawReceived: roundNumber(rawToDyehouse),
        totalAllocated: roundNumber(allocated),
        remainingUnallocatedRaw: roundNumber(Math.max(rawToDyehouse - allocated, 0)),
        allocationExceedsRaw: allocated > rawToDyehouse,
        totalSentToDyehouse: roundNumber(rawToDyehouse),
        rawAtDyehouseAvailable: roundNumber(Math.max(rawToDyehouse - warehouseReceived - rawReturnedToWeaving - waste, 0)),
        totalRawReturnedToWeaving: roundNumber(rawReturnedToWeaving),
        expectedWastePercent: expectedWastePercent,
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
        accessoryRequired: accessoryRequired,
        accessorySent: roundNumber(accessorySent),
        accessoryReceived: roundNumber(accessoryReceived),
        accessoryDelivered: roundNumber(accessoryDelivered),
        accessoryBalance: roundNumber(Math.max(accessoryReceived - accessoryDelivered, 0)),
        accessoryWaste: roundNumber(accessoryWaste),
        accessoryWastePercent: accessorySent ? roundNumber(accessoryWaste / accessorySent * 100) : 0,
        status: order.operationClosed ? 'closed' : deliveredToCustomer >= allocated && allocated > 0 ? 'completed' : rawToDyehouse === 0 ? 'pending' : 'in-progress'
      });
    }
    return {
      allocationAccessoryQuantity: allocationAccessoryQuantity,
      calculateAllocation: calculateAllocation,
      calculateOrder: calculateOrder,
      expectedWasteFor: expectedWasteFor,
      normalizeOrderForRuntime: normalizeOrderForRuntime,
      orderAccessoryConfig: orderAccessoryConfig
    };
  }
  window.TwoBTexOrders = {
    createOrderDomain: createOrderDomain
  };
})();

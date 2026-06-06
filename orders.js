(function () {
  function createOrderDomain(deps) {
    const { buildItemCode, orderRawCost, roundNumber, sum, uid, getState } = deps;

    function state() {
      return getState();
    }

    function orderAccessoryConfig(order = {}) {
      const lines = Array.isArray(order.accessoryLines) ? order.accessoryLines : [];
      if (lines.length) {
        return lines
          .map((line)=>({
            id:line.id || uid(),
            type:line.type || 'إكسسوار',
            percent:Number(line.percent || 0),
            quantityManual:line.quantityManual !== undefined ? line.quantityManual : '',
          }))
          .filter((line)=>line.type || line.percent || line.quantityManual);
      }
      if (order.accessoryType || Number(order.accessoryPercent || 0)) {
        return [{ id:uid(), type:order.accessoryType || 'إكسسوار', percent:Number(order.accessoryPercent || 0), quantityManual:'' }];
      }
      return [];
    }

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

    function getAllocations(order) {
      return state().allocations.filter((allocation) => allocation.orderId === order.id);
    }

    function calculateAllocation(allocation = {}, orderContext = null) {
      const data = state();
      const order = orderContext || data.orders.find((item)=>item.id===allocation.orderId) || {};
      const orderAllocations = getAllocations(order);
      const directAllocationIds = new Set(orderAllocations.map((item)=>item.id));
      const orderRawSent = sum(data.rawBatches.filter((batch) => batch.orderId === allocation.orderId && !directAllocationIds.has(batch.widthLineId)));
      const directAllocationSent = sum(data.rawBatches.filter((batch) => batch.orderId === allocation.orderId && batch.widthLineId === allocation.id));
      const widthRawSent = allocation.widthLineId ? sum(data.rawBatches.filter((batch) => batch.orderId === allocation.orderId && batch.widthLineId === allocation.widthLineId)) : 0;
      const widthPlanned = allocation.widthLineId ? orderAllocations.filter((item)=>item.widthLineId === allocation.widthLineId).reduce((total, item)=>total + Number(item.plannedQuantity || 0), 0) : 0;
      const totalPlanned = roundNumber(orderAllocations.reduce((total, item)=>total + Number(item.plannedQuantity || 0), 0));
      const basePlanned = Number(allocation.plannedQuantity || 0);
      const proportionalWidthSent = widthPlanned ? widthRawSent * basePlanned / widthPlanned : 0;
      const proportionalOrderSent = totalPlanned ? orderRawSent * basePlanned / totalPlanned : 0;
      const sent = roundNumber(directAllocationSent || (allocation.widthLineId ? proportionalWidthSent : (orderAllocations.length <= 1 ? orderRawSent : proportionalOrderSent)));
      const finished = sum(data.productionBatches.filter((batch) => batch.allocationId === allocation.id));
      const deliveredToCustomer = sum(data.customerBatches.filter((batch) => batch.allocationId === allocation.id));
      const rawReturned = sum(data.rawReturns.filter((batch) => batch.allocationId === allocation.id));
      const actualBase = sent || Number(allocation.plannedQuantity || 0);
      const actualWaste = order.operationClosed && (sent || finished || rawReturned) ? Math.max(sent - finished - rawReturned, 0) : 0;
      const actualWastePercent = actualBase ? roundNumber(actualWaste / actualBase * 100) : 0;
      const transfers = data.dyehouseTransfers.filter((batch) => batch.allocationId === allocation.id);
      return { ...allocation, transfers, rawReturned:roundNumber(rawReturned), transferredQuantity:roundNumber(sum(transfers)), sentToDyehouse:roundNumber(sent), finishedReceived:roundNumber(finished), deliveredToCustomer:roundNumber(deliveredToCustomer), customerDelivered:roundNumber(deliveredToCustomer), remainingAtDyehouse:roundNumber(Math.max(sent - finished - rawReturned - actualWaste, 0)), actualWasteQuantity:roundNumber(actualWaste), actualWastePercent, wasteQuantity:roundNumber(actualWaste), wastePercent:actualWastePercent };
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
      const data = state();
      order = normalizeOrderForRuntime(order);
      const expectedWastePercent = Number(order.expectedWastePercent || 0);
      const isClosed = Boolean(order.operationClosed);
      const baseAllocations = getAllocations(order).map((allocation)=>calculateAllocation(allocation, order));
      const orderAllocations = baseAllocations.map((allocation) => {
        const widthLine = (order.widthLines || []).find((item)=>item.id===allocation.widthLineId);
        const expectedWasteQuantity = isClosed ? expectedWasteFor(order, allocation.plannedQuantity) : 0;
        if (widthLine) return { ...allocation, rawInch:widthLine.inch, rawWidth:widthLine.width, targetFinishedWidth:widthLine.width, accessoryQuantity: allocationAccessoryQuantity(order, allocation), expectedWastePercent, expectedWasteQuantity };
        return { ...allocation, accessoryQuantity: allocationAccessoryQuantity(order, allocation), expectedWastePercent, expectedWasteQuantity };
      });
      const rawToDyehouse = sum(data.rawBatches.filter((batch) => batch.orderId === order.id));
      const allocated = roundNumber(orderAllocations.reduce((total, item) => total + Number(item.plannedQuantity || 0), 0));
      const operated = roundNumber(orderAllocations.reduce((total, item) => total + Number(item.sentToDyehouse || 0), 0));
      const warehouseReceived = roundNumber(orderAllocations.reduce((total, item) => total + Number(item.finishedReceived || 0), 0));
      const rawReturnedToWeaving = sum(data.rawReturns.filter((batch) => orderAllocations.some((allocation) => allocation.id === batch.allocationId)));
      const deliveredToCustomer = sum(data.customerBatches.filter((batch) => orderAllocations.some((allocation) => allocation.id === batch.allocationId)));
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
      const recordedAccessoryQuantity = sum(data.accessoryBatches.filter((batch)=>batch.orderId === order.id && (!batch.movement || batch.movement === 'sent')));
      const hasAccessory = configuredAccessoryLines.length > 0 || !!order.accessoryType || manualAccessoryQuantity > 0 || recordedAccessoryQuantity > 0;
      const accessoryQuantity = manualAccessoryQuantity || roundNumber(Number(order.totalRawQuantity || 0) * Number(order.accessoryPercent || 0) / 100) || recordedAccessoryQuantity;
      const accessoryLines = configuredAccessoryLines.length ? configuredAccessoryLines : (hasAccessory ? [{ type:order.accessoryType || 'إكسسوار', percent:Number(order.accessoryPercent || 0), quantity:roundNumber(accessoryQuantity) }] : []);
      const accessoryRequired = roundNumber(accessoryLines.reduce((total, item)=>total + Number(item.quantity || 0), 0));
      const accessorySent = sum(data.accessoryBatches.filter((batch)=>batch.orderId===order.id && (!batch.movement || batch.movement === 'sent')));
      const accessoryReceived = sum(data.accessoryBatches.filter((batch)=>batch.orderId===order.id && batch.movement === 'received'));
      const accessoryDelivered = sum(data.accessoryBatches.filter((batch)=>batch.orderId===order.id && batch.movement === 'customer'));
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

    return {
      allocationAccessoryQuantity,
      calculateAllocation,
      calculateOrder,
      expectedWasteFor,
      normalizeOrderForRuntime,
      orderAccessoryConfig,
    };
  }

  window.TwoBTexOrders = { createOrderDomain };
})();

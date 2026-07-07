(function () {
  function createPersistenceGuards(deps) {
    const {
      backendRequest,
      parseDbJsonArray,
    } = deps;

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
        && pricingPersistenceMatches(row, expected)
      ));
    }

    function pricingPersistenceMatches(row = {}, expected = {}) {
      const savedItems = parseDbJsonArray(row.pricing_items_json);
      const expectedItems = Array.isArray(expected.priceItems) ? expected.priceItems.filter(Boolean) : [];
      if (expectedItems.length) {
        if (!savedItems.length) return false;
        if (savedItems.length !== expectedItems.length) return false;
        const savedSignature = JSON.stringify(savedItems.map((item)=>({
          fabricType:String(item.fabricType || item.fabric_type || ''),
          quantity:Number(item.quantity || 0),
          rawCost:Number(item.rawCost || item.raw_cost || 0),
          dyeCost:Number(item.dyeCost || item.dye_cost || 0),
          currency:String(item.currency || expected.currency || 'EGP'),
        })));
        const expectedSignature = JSON.stringify(expectedItems.map((item)=>({
          fabricType:String(item.fabricType || item.fabric_type || ''),
          quantity:Number(item.quantity || 0),
          rawCost:Number(item.rawCost || item.raw_cost || 0),
          dyeCost:Number(item.dyeCost || item.dye_cost || 0),
          currency:String(item.currency || expected.currency || 'EGP'),
        })));
        return savedSignature === expectedSignature;
      }
      return String(row.fabric_type || '') === String(expected.fabricType || row.fabric_type || '');
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

    return {
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
    };
  }

  window.createPersistenceGuards = createPersistenceGuards;
}());

(function () {
  function createWarehouseUi(deps) {
    const {
      escapeHtml,
      formatNumber,
      roundNumber,
      accessoryFlowQuantityForLine,
      accessoryLineName,
    } = deps;

    function stockFlowText(clothQuantity, accessoryParts = []) {
      const parts = [];
      if (Number(clothQuantity || 0)) parts.push(`${formatNumber(clothQuantity)} \u062c\u0633\u0645`);
      parts.push(...accessoryParts);
      return parts.length ? parts.join(' - ') : '-';
    }

    function accessoryBalancePartsForOrder(order, allocation) {
      return (order?.accessoryLines || []).map((line) => {
        const received = accessoryFlowQuantityForLine(order, allocation, 'received', line);
        const delivered = accessoryFlowQuantityForLine(order, allocation, 'customer', line);
        const balance = roundNumber(received - delivered);
        return balance ? `${formatNumber(balance)} ${accessoryLineName(line, order)}` : '';
      }).filter(Boolean);
    }

    function stockFlowCell(clothQuantity, accessoryParts = []) {
      return stockFlowText(clothQuantity, accessoryParts)
        .split(' - ')
        .map((part)=>`<span class="stock-flow-line">${escapeHtml(part)}</span>`)
        .join('');
    }

    return {
      stockFlowText,
      accessoryBalancePartsForOrder,
      stockFlowCell,
    };
  }

  window.createWarehouseUi = createWarehouseUi;
})();

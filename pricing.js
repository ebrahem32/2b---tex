(function () {
  function createPricingDomain(deps) {
    const { buildItemCode, clone, isLegacyRecoveredText, normalizeDyehousePriceLabel, roundNumber } = deps;

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

    function mergeNestedPriceTable(base = {}, override = {}) {
      const merged = clone(base || {});
      Object.entries(override || {}).forEach(([group, rows]) => {
        if (!rows || typeof rows !== 'object' || Array.isArray(rows)) return;
        merged[group] = { ...(merged[group] || {}), ...rows };
      });
      return merged;
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
        const printing = {};
        Object.entries(config.printing || {}).forEach(([type, rows]) => {
          if (!type || isLegacyRecoveredText(type) || !rows || typeof rows !== 'object') return;
          Object.entries(rows).forEach(([name, price]) => {
            const number = Number(price);
            if (!name || isLegacyRecoveredText(name) || !Number.isFinite(number)) return;
            if (!printing[type]) printing[type] = {};
            printing[type][name] = number;
          });
        });
        clean[dyehouse] = {
          effectiveFrom: config.effectiveFrom || '',
          accountingMode: config.accountingMode || 'net',
          dyeing,
          printing,
          extras,
        };
        if (config.aliasOf) clean[dyehouse].aliasOf = config.aliasOf;
      });
      return clean;
    }

    function mergeDyehousePriceLibrary(customLibrary = {}) {
      const merged = sanitizeDyehousePriceLibrary(TWO_B_TEX_DYEHOUSE_PRICE_LIBRARY);
      Object.entries(sanitizeDyehousePriceLibrary(customLibrary || {})).forEach(([dyehouse, config]) => {
        if (!dyehouse || !config || typeof config !== 'object') return;
        const current = merged[dyehouse] || { effectiveFrom:'', dyeing:{}, extras:{} };
        merged[dyehouse] = {
          ...current,
          ...config,
          dyeing: mergeNestedPriceTable(current.dyeing || {}, config.dyeing || {}),
          printing: mergeNestedPriceTable(current.printing || {}, config.printing || {}),
          extras: { ...(current.extras || {}), ...(config.extras || {}) },
        };
      });
      return merged;
    }

    function getSuggestedDyeCost(librarySource, dyehouse, materialType, colorClass) {
      const library = librarySource[dyehouse];
      const resolved = library?.aliasOf ? librarySource[library.aliasOf] : library;
      if (!resolved) return '';
      const colorKey = normalizeDyehousePriceLabel(colorClass);
      if (materialType === '\u0645\u062e\u0644\u0648\u0637') {
        const base = resolved.dyeing?.['\u0642\u0637\u0646']?.[colorKey];
        return base === undefined || base === null || base === '' ? '' : Number(base) + 9;
      }
      return resolved?.dyeing?.[materialType]?.[colorKey] ?? '';
    }

    function pricingExchangeRate(pricing = {}) {
      const rate = Number(pricing.exchangeRate || pricing.exchange_rate || pricing.usdRate || pricing.usd_rate || 0);
      return Number.isFinite(rate) && rate > 0 ? rate : 1;
    }

    function convertEgpCostForPricing(value, pricing = {}) {
      const amount = Number(value || 0);
      if ((pricing.currency || 'EGP') !== 'USD') return amount;
      return amount / pricingExchangeRate(pricing);
    }

    function pricingDeferredPercent(pricing = {}) {
      return Number(pricing.deferredPercent || pricing.deferred_percent || 0) * 3;
    }

    function accessoryWasteBasis(line = {}, pricing = {}, library = {}) {
      return line.wasteBasis || line.waste_basis || pricing.wasteBasis || pricing.waste_basis || library.accountingMode || 'net';
    }

    function accessoryInputNumber(line = {}, key, fallback = 0) {
      const value = line[key] ?? fallback;
      const number = Number(value || 0);
      return Number.isFinite(number) ? number : 0;
    }

    function calculateAccessoryLine(line = {}, pricing = {}, library = {}) {
      const currency = pricing.currency || line.currency || 'EGP';
      const exchangeRate = pricingExchangeRate(pricing);
      const quantity = accessoryInputNumber(line, 'quantity', line.percent ?? 0);
      const rawPrice = accessoryInputNumber(line, 'price', line.rawPrice ?? 0);
      const stageCostEgp = accessoryInputNumber(line, 'stageCost', 0);
      const wastePercent = accessoryInputNumber(line, 'wastePercent', pricing.wastePercent ?? 0);
      const wasteBasis = accessoryWasteBasis(line, pricing, library);
      const deferredMonths = accessoryInputNumber(line, 'deferredPercent', pricing.deferredPercent ?? pricing.deferred_percent ?? 0);
      const deferredPercent = deferredMonths * 3;
      const profitPerKgEgp = accessoryInputNumber(line, 'profitPerKg', pricing.profitPerKg ?? 0);

      if (currency === 'USD') {
        const rawPriceEgp = rawPrice * exchangeRate;
        const productionCostEgp = rawPriceEgp + stageCostEgp;
        const wasteBaseEgp = wasteBasis === 'gross' ? productionCostEgp : rawPriceEgp;
        const wasteCostEgp = wasteBaseEgp * wastePercent / 100;
        const costBeforeDeferredEgp = productionCostEgp + wasteCostEgp;
        const deferredCostEgp = costBeforeDeferredEgp * deferredPercent / 100;
        const costPerKgEgp = costBeforeDeferredEgp + deferredCostEgp;
        const roundedCostPerKgEgp = roundNumber(costPerKgEgp, 0);
        const sellPriceEgp = roundedCostPerKgEgp + profitPerKgEgp;
        const sellPrice = sellPriceEgp / exchangeRate;
        const total = sellPrice * quantity;
        return {
          ...line,
          currency,
          exchangeRate,
          quantity,
          percent: quantity,
          price: roundNumber(rawPrice),
          rawCost: roundNumber(rawPrice),
          rawCostEgp: roundNumber(rawPriceEgp),
          stageCost: roundNumber(stageCostEgp),
          stageCostConverted: roundNumber(stageCostEgp / exchangeRate),
          productionCost: roundNumber(productionCostEgp / exchangeRate),
          productionCostEgp: roundNumber(productionCostEgp),
          wastePercent: roundNumber(wastePercent),
          wasteBasis,
          wasteCost: roundNumber(wasteCostEgp / exchangeRate),
          wasteCostEgp: roundNumber(wasteCostEgp),
          deferredMonths,
          deferredPercent,
          deferredCost: roundNumber(deferredCostEgp / exchangeRate),
          deferredCostEgp: roundNumber(deferredCostEgp),
          costPerKg: roundNumber(roundedCostPerKgEgp / exchangeRate),
          costPerKgEgp: roundedCostPerKgEgp,
          profitPerKg: roundNumber(profitPerKgEgp),
          profitCost: roundNumber(profitPerKgEgp / exchangeRate),
          profitCostEgp: roundNumber(profitPerKgEgp),
          unitPrice: roundNumber(sellPrice),
          sellPrice: roundNumber(sellPrice),
          sellPriceEgp: roundNumber(sellPriceEgp),
          total: roundNumber(total),
        };
      }

      const stageCost = convertEgpCostForPricing(stageCostEgp, pricing);
      const productionCost = rawPrice + stageCost;
      const wasteBase = wasteBasis === 'gross' ? productionCost : rawPrice;
      const wasteCost = wasteBase * wastePercent / 100;
      const costBeforeDeferred = productionCost + wasteCost;
      const deferredCost = costBeforeDeferred * deferredPercent / 100;
      const costPerKg = costBeforeDeferred + deferredCost;
      const sellPrice = costPerKg + profitPerKgEgp;
      const total = sellPrice * quantity;
      return {
        ...line,
        currency,
        exchangeRate,
        quantity,
        percent: quantity,
        price: roundNumber(rawPrice),
        rawCost: roundNumber(rawPrice),
        stageCost: roundNumber(stageCostEgp),
        stageCostConverted: roundNumber(stageCost),
        productionCost: roundNumber(productionCost),
        wastePercent: roundNumber(wastePercent),
        wasteBasis,
        wasteCost: roundNumber(wasteCost),
        deferredMonths,
        deferredPercent,
        deferredCost: roundNumber(deferredCost),
        costPerKg: roundNumber(costPerKg),
        profitPerKg: roundNumber(profitPerKgEgp),
        profitCost: roundNumber(profitPerKgEgp),
        unitPrice: roundNumber(sellPrice),
        sellPrice: roundNumber(sellPrice),
        total: roundNumber(total),
      };
    }

    function accessoryLinesForPricing(pricing = {}, library = {}) {
      const lines = Array.isArray(pricing.accessoryLines) ? pricing.accessoryLines : [];
      return lines.map((line) => calculateAccessoryLine(line, pricing, library));
    }

    function accessoryTotalForPricing(pricing = {}, library = {}) {
      const lines = Array.isArray(pricing.accessoryLines) ? pricing.accessoryLines : [];
      if (!lines.length) return Number(pricing.accessoryCost || pricing.accessory_cost || 0);
      return accessoryLinesForPricing(pricing, library).reduce((total, line) => total + Number(line.total || 0), 0);
    }

    function calculatePricing(pricing, librarySource) {
      const library = librarySource[pricing.dyehouse] || {};
      const wasteBasis = pricing.wasteBasis || pricing.waste_basis || library.accountingMode || 'net';
      const exchangeRate = pricingExchangeRate(pricing);
      const rawCostInput = Number(pricing.rawCost || 0);
      const profitPerKgInput = Number(pricing.profitPerKg || 0);
      const deferredPercent = pricingDeferredPercent(pricing);
      const calculatedAccessoryLines = accessoryLinesForPricing(pricing, library);
      if ((pricing.currency || 'EGP') === 'USD') {
        const dyeCostEgp = Number(pricing.dyeCost || 0);
        const extraCostEgp = Number(pricing.extraCost || 0);
        const rawCostEgp = rawCostInput * exchangeRate;
        const productionCostEgp = rawCostEgp + dyeCostEgp + extraCostEgp;
        const wasteBaseEgp = wasteBasis === 'gross' ? productionCostEgp : rawCostEgp;
        const wasteCostEgp = wasteBaseEgp * Number(pricing.wastePercent || 0) / 100;
        const costBeforeDeferredEgp = productionCostEgp + wasteCostEgp;
        const deferredCostEgp = costBeforeDeferredEgp * deferredPercent / 100;
        const costPerKgEgp = costBeforeDeferredEgp + deferredCostEgp;
        const roundedCostPerKgEgp = roundNumber(costPerKgEgp, 0);
        const sellPriceEgp = roundedCostPerKgEgp + profitPerKgInput;
        const sellPrice = sellPriceEgp / exchangeRate;
        const clothTotal = sellPrice * Number(pricing.quantity || 0);
        const accessoryTotal = accessoryTotalForPricing({ ...pricing, accessoryLines: calculatedAccessoryLines }, library);
        const totalOffer = clothTotal + accessoryTotal;
        return {
          ...pricing,
          exchangeRate,
          productCode: pricing.productCode || buildItemCode(pricing.pricingNumber),
          accountingMode: wasteBasis,
          wasteBasis,
          rawCostEgp: roundNumber(rawCostEgp),
          dyeCost: roundNumber(dyeCostEgp / exchangeRate),
          dyeCostEgp: roundNumber(dyeCostEgp),
          extraCost: roundNumber(extraCostEgp / exchangeRate),
          extraCostEgp: roundNumber(extraCostEgp),
          profitPerKg: roundNumber(profitPerKgInput),
          profitCost: roundNumber(profitPerKgInput / exchangeRate),
          profitCostEgp: roundNumber(profitPerKgInput),
          accessoryLines: calculatedAccessoryLines,
          accessoryCost: roundNumber(accessoryTotal),
          accessoryTotal: roundNumber(accessoryTotal),
          productionCost: roundNumber(productionCostEgp / exchangeRate),
          productionCostEgp: roundNumber(productionCostEgp),
          wasteCost: roundNumber(wasteCostEgp / exchangeRate),
          wasteCostEgp: roundNumber(wasteCostEgp),
          costBeforeDeferred: roundNumber(costBeforeDeferredEgp / exchangeRate),
          costBeforeDeferredEgp: roundNumber(costBeforeDeferredEgp),
          deferredMonths: Number(pricing.deferredPercent || pricing.deferred_percent || 0),
          deferredPercent,
          deferredCost: roundNumber(deferredCostEgp / exchangeRate),
          deferredCostEgp: roundNumber(deferredCostEgp),
          costPerKg: roundNumber(roundedCostPerKgEgp / exchangeRate),
          costPerKgEgp: roundedCostPerKgEgp,
          sellPrice: roundNumber(sellPrice),
          sellPriceEgp: roundNumber(sellPriceEgp),
          clothTotal: roundNumber(clothTotal),
          totalOffer: roundNumber(totalOffer),
        };
      }
      const dyeCost = convertEgpCostForPricing(pricing.dyeCost || 0, pricing);
      const extraCost = convertEgpCostForPricing(pricing.extraCost || 0, pricing);
      const accessoryTotal = accessoryTotalForPricing({ ...pricing, accessoryLines: calculatedAccessoryLines }, library);
      const productionCost = rawCostInput + dyeCost + extraCost;
      const wasteBase = wasteBasis === 'gross'
        ? productionCost
        : rawCostInput;
      const wasteCost = wasteBase * Number(pricing.wastePercent || 0) / 100;
      const costBeforeDeferred = productionCost + wasteCost;
      const deferredCost = costBeforeDeferred * deferredPercent / 100;
      const costPerKg = costBeforeDeferred + deferredCost;
      const sellPrice = costPerKg + profitPerKgInput;
      const clothTotal = sellPrice * Number(pricing.quantity || 0);
      const totalOffer = clothTotal + accessoryTotal;
      return { ...pricing, exchangeRate, productCode:pricing.productCode || buildItemCode(pricing.pricingNumber), accountingMode:wasteBasis, wasteBasis, dyeCost:roundNumber(dyeCost), extraCost:roundNumber(extraCost), profitPerKg:roundNumber(profitPerKgInput), profitCost:roundNumber(profitPerKgInput), accessoryLines:calculatedAccessoryLines, accessoryCost:roundNumber(accessoryTotal), accessoryTotal:roundNumber(accessoryTotal), productionCost:roundNumber(productionCost), wasteCost:roundNumber(wasteCost), costBeforeDeferred:roundNumber(costBeforeDeferred), deferredMonths:Number(pricing.deferredPercent || pricing.deferred_percent || 0), deferredPercent, deferredCost:roundNumber(deferredCost), costPerKg:roundNumber(costPerKg), sellPrice:roundNumber(sellPrice), clothTotal:roundNumber(clothTotal), totalOffer:roundNumber(totalOffer) };
    }

    return {
      calculateAccessoryLine,
      calculatePricing,
      getSuggestedDyeCost,
      mergeDyehousePriceLibrary,
      sanitizeDyehousePriceLibrary,
    };
  }

  window.TwoBTexPricing = { createPricingDomain };
})();

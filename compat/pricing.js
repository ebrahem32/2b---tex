(function() {
  function createPricingDomain(deps) {
    const { buildItemCode, clone, isLegacyRecoveredText, normalizeDyehousePriceLabel, roundNumber } = deps;
    const TWO_B_TEX_DYEHOUSE_PRICE_LIBRARY = {
      "جيما": {
        effectiveFrom: "2026-04-15",
        accountingMode: "net",
        dyeing: {
          "قطن": {
            "غسيل - مفتوح": 45,
            "غسيل - مقفول": 52,
            "أبيض / كسترة - مفتوح": 49,
            "أبيض / كسترة - مقفول": 56,
            "فواتح - مفتوح": 65,
            "فواتح - مقفول": 72,
            "وسط - مفتوح": 68,
            "وسط - مقفول": 75,
            "غوامق - مفتوح": 71,
            "غوامق - مقفول": 78,
            "أسود - مفتوح": 72,
            "أسود - مقفول": 79,
            "أسود خاص - مفتوح": 74,
            "أسود خاص - مقفول": 81,
            "ألوان خاصة - مفتوح": 75,
            "ألوان خاصة - مقفول": 82
          },
          "بوليستر": {
            "أبيض / كسترة - مفتوح": 40,
            "أبيض / كسترة - مقفول": 47,
            "وسط - مفتوح": 41,
            "وسط - مقفول": 48,
            "غوامق - مفتوح": 43,
            "غوامق - مقفول": 50,
            "أسود - مفتوح": 44,
            "أسود - مقفول": 51,
            "ألوان خاصة - مفتوح": 48,
            "ألوان خاصة - مقفول": 55
          }
        },
        extras: {
          "كسترة": 9,
          "قص براسل": 5,
          "حلاقة": 2,
          "كربون فينش": 3,
          "إنزيم": 5,
          "دبل إنزيم": 4,
          "سخاوة خاصة": 5,
          "شق خام": 5,
          "تجهيز خاص نيو جيما": 3,
          "تجهيز سقعانه": 7,
          "تجهيز بوليفار": 7,
          "معالج زيوت": 5,
          "معالجة زيوت خاصة": 8
        }
      },
      "نيو جيما": {
        effectiveFrom: "2026-04-15",
        accountingMode: "net",
        dyeing: {},
        printing: {
          "بيجمنت": {
            "سنجل بدون ليكرا - أقل من 2.5 متر": 60,
            "سنجل ليكرا - أقل من 2.5 متر": 67,
            "سنجل بدون ليكرا - أقل من 4 متر": 70,
            "سنجل ليكرا - أقل من 4 متر": 77,
            "سنجل بدون ليكرا - أكبر من 4 متر": 77,
            "سنجل ليكرا - أكبر من 4 متر": 84
          },
          "راكتيف": {
            "سنجل بدون ليكرا - أقل من 2.5 متر": 75,
            "سنجل ليكرا - أقل من 2.5 متر": 82,
            "سنجل بدون ليكرا - أقل من 4 متر": 80,
            "سنجل ليكرا - أقل من 4 متر": 87
          },
          "ديسبيرس": {
            "أقل من 2.5 متر": 53,
            "أقل من 4 متر": 60
          },
          "شعيرات + كربون نقش": { "عام": 53 },
          "أوفر برنت": { "عام": 16 },
          "فلوريسنت": { "عام": 13 },
          "جليتر": { "عام": 14 }
        },
        extras: {}
      }
    };
    TWO_B_TEX_DYEHOUSE_PRICE_LIBRARY["نيو جيما"].dyeing = clone(TWO_B_TEX_DYEHOUSE_PRICE_LIBRARY["جيما"].dyeing);
    TWO_B_TEX_DYEHOUSE_PRICE_LIBRARY["نيو جيما"].extras = clone(TWO_B_TEX_DYEHOUSE_PRICE_LIBRARY["جيما"].extras);
    function mergeNestedPriceTable(base = {}, override = {}) {
      const merged = clone(base || {});
      Object.entries(override || {}).forEach(([group, rows]) => {
        if (!rows || typeof rows !== "object" || Array.isArray(rows)) return;
        merged[group] = { ...merged[group] || {}, ...rows };
      });
      return merged;
    }
    function sanitizeDyehousePriceLibrary(source = {}) {
      const clean = {};
      Object.entries(source || {}).forEach(([dyehouse, config]) => {
        if (!dyehouse || isLegacyRecoveredText(dyehouse) || !config || typeof config !== "object") return;
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
          if (!type || isLegacyRecoveredText(type) || !rows || typeof rows !== "object") return;
          Object.entries(rows).forEach(([name, price]) => {
            const number = Number(price);
            if (!name || isLegacyRecoveredText(name) || !Number.isFinite(number)) return;
            if (!printing[type]) printing[type] = {};
            printing[type][name] = number;
          });
        });
        clean[dyehouse] = {
          effectiveFrom: config.effectiveFrom || "",
          accountingMode: config.accountingMode || "net",
          dyeing,
          printing,
          extras
        };
        if (config.aliasOf) clean[dyehouse].aliasOf = config.aliasOf;
      });
      return clean;
    }
    function mergeDyehousePriceLibrary(customLibrary = {}) {
      const merged = sanitizeDyehousePriceLibrary(TWO_B_TEX_DYEHOUSE_PRICE_LIBRARY);
      Object.entries(sanitizeDyehousePriceLibrary(customLibrary || {})).forEach(([dyehouse, config]) => {
        if (!dyehouse || !config || typeof config !== "object") return;
        const current = merged[dyehouse] || { effectiveFrom: "", dyeing: {}, extras: {} };
        merged[dyehouse] = {
          ...current,
          ...config,
          dyeing: mergeNestedPriceTable(current.dyeing || {}, config.dyeing || {}),
          printing: mergeNestedPriceTable(current.printing || {}, config.printing || {}),
          extras: { ...current.extras || {}, ...config.extras || {} }
        };
      });
      return merged;
    }
    function getSuggestedDyeCost(librarySource, dyehouse, materialType, colorClass) {
      var _a, _b, _c, _d, _e;
      const library = librarySource[dyehouse];
      const resolved = (library == null ? void 0 : library.aliasOf) ? librarySource[library.aliasOf] : library;
      if (!resolved) return "";
      const colorKey = normalizeDyehousePriceLabel(colorClass);
      if (materialType === "مخلوط") {
        const base = (_b = (_a = resolved.dyeing) == null ? void 0 : _a["قطن"]) == null ? void 0 : _b[colorKey];
        return base === void 0 || base === null || base === "" ? "" : Number(base) + 9;
      }
      return (_e = (_d = (_c = resolved == null ? void 0 : resolved.dyeing) == null ? void 0 : _c[materialType]) == null ? void 0 : _d[colorKey]) != null ? _e : "";
    }
    function calculatePricing(pricing, librarySource) {
      const library = librarySource[pricing.dyehouse] || {};
      const wasteBase = library.accountingMode === "gross" ? Number(pricing.rawCost || 0) + Number(pricing.dyeCost || 0) + Number(pricing.extraCost || 0) : Number(pricing.rawCost || 0);
      const wasteCost = wasteBase * Number(pricing.wastePercent || 0) / 100;
      const costPerKg = Number(pricing.rawCost || 0) + Number(pricing.dyeCost || 0) + Number(pricing.extraCost || 0) + wasteCost;
      const sellPrice = costPerKg + Number(pricing.profitPerKg || 0);
      const totalOffer = sellPrice * Number(pricing.quantity || 0);
      return { ...pricing, productCode: pricing.productCode || buildItemCode(pricing.pricingNumber), accountingMode: library.accountingMode || "net", wasteCost: roundNumber(wasteCost), costPerKg: roundNumber(costPerKg), sellPrice: roundNumber(sellPrice), totalOffer: roundNumber(totalOffer) };
    }
    return {
      calculatePricing,
      getSuggestedDyeCost,
      mergeDyehousePriceLibrary,
      sanitizeDyehousePriceLibrary
    };
  }
  window.TwoBTexPricing = { createPricingDomain };
})();

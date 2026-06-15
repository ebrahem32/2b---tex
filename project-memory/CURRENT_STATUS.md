# Current Status

## Current Version

`v2026.06.15.13`

## Last Known Commit Before Project Memory

`282d516 Extract orders UI module`

## Latest Commit Message

`Stabilize pricing flow, navigation, and regression test`

## Latest Dashboard Finished-Sale Visibility Fix

- Version: `v2026.06.15.12`.
- Fixed a UI visibility issue where the dynamically-created `finishedSalePanel` could appear when opening the main operations dashboard.
- `finishedSalePanel` is now hidden by default and immediately synchronized with the active workspace module after creation.
- The panel still opens normally from `بيع مجهز` under warehouse/sales flow.
- Not touched: backend, SQLite, stock calculations, waste calculations, save/rollback flows.

## Latest Pricing Edit Matching Fix

- Version: `v2026.06.15.13`.
- Fixed pricing-card/order matching so a pricing card is no longer matched to an order by number alone.
- A pricing card now matches an order only by explicit `pricingId`, or by order number plus compatible customer name plus compatible fabric name.
- This protects the intentional business rule that the same order number can exist with different customers/items.
- Hardened pricing edit button handling with `closest(...)` and added explicit support for pricing edit buttons inside quotation documents.
- Not touched: backend, SQLite, stock calculations, waste calculations, save/rollback flows.

## Current Phase

```text
Phase 3.1 - Daily Operations and Operational Test
```

## Latest Full System Cleanup Execution

- Version: `v2026.06.15.10`.
- Executed the safe frontend cleanup steps from `Full System Cleanup Plan.pdf` on top of the current pushed version.
- Removed a duplicate `weavingSource` key in the pricing-card-to-order conversion object.
- Replaced the pricing-card row `.replace(...)` markup injection with direct markup for the weaving source field.
- Expanded `npm run check` to include shared frontend files: `documents.js`, `orders.js`, and `pricing.js`.
- Unified pricing frontend source so `index.html` loads the official `pricing.js` directly.
- Removed confirmed unused legacy compatibility files that are not loaded by `index.html`:
  - `compat/app.js`
  - `compat/orders.js`
  - `compat/documents.js`
- Removed duplicated pricing compatibility source:
  - `compat/pricing.js`
- Kept only the loaded compatibility polyfill:
  - `compat/polyfills.js`
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema/data, stock calculations, waste logic, save/rollback flows, AI backend, WhatsApp service, A5 service.

## Latest Three-Path Stabilization

- Version: `v2026.06.15.11`.
- Stabilized the pricing-card-to-order regression path by expanding `scripts/full-operational-test.js`.
- The full test now seeds a multi-line pricing card using `pricing_items_json` with:
  - two fabric/material lines,
  - dyeing-stage tables,
  - accessory raw-item rows,
  - selected accessory stages,
  - currency data.
- The test verifies that grouped order conversion preserves the second item data, including fabric, quantity, dyehouse, and operation-stage notes.
- Removed the hidden top ERP menu markup from `index.html` so Sidebar and the home task cards are the only navigation layers.
- Confirmed the local backend must be restarted after migrations if an older server process is running, otherwise the live process may still use an old SQLite schema.
- Not touched: `backend/calculations.js`, stock formulas, waste formulas, operational save formulas, AI backend, WhatsApp service, A5 service.

## Completed Frontend Modules

- `modules/navigation.js`
- `modules/focusViews.js`
- `modules/aiUi.js`
- `modules/documentsUi.js`
- `modules/reportsUi.js`
- `modules/warehouseUi.js`
- `modules/ordersUi.js`
- `modules/auditUi.js`
- `modules/usersUi.js`
- `modules/settingsUi.js`
- `modules/formsUi.js`
- `modules/pricingUi.js`
- `modules/backendClient.js`
- `modules/operationalAiManager.js`
- `modules/todayOrdersUi.js`

## Current `app.js` Direction

`app.js` is being reduced from a large all-in-one file into an application orchestrator.

Current known line count after Phase 3.1 daily operations dashboard:

```text
app.js: 4944 lines
```

## Next Frontend Refactor Targets

- Keep `operations`, `transfers`, and deeper accessory movement handlers inside `app.js` until a safer write-flow refactor, because they are tightly coupled to backend writes, stock movements, and operational validations.
- Keep write guards, rollback, persistence verification, and operational save flows inside `app.js` until a dedicated write-flow refactor.
- Operational AI Manager is read-only and must stay based on calculated frontend state unless a dedicated AI backend phase is approved.
- Full operational test is available as `npm run test:operational-full`; it creates real test records on the configured target and should be run intentionally, not as part of normal CI writes.

## Not Allowed Currently

- Backend refactor.
- Database schema changes.
- Calculation changes.
- Waste logic changes.
- Stock logic changes.

## Last Verification

For Phase 3.1 local verification before commit:

- `npm run check`: passed.
- Operational flow check: passed.
- `npm run test:operational-full`: passed on Railway with order `تيست-mqbmb12s`.
- GitHub Actions: verify after push.
- Railway: verify after push.

## Latest UI Stage Consolidation

- Version: `v2026.06.13.20`.
- Warehouse filter now shows every order with a non-zero real warehouse balance, including operationally closed orders and negative balances that need review.
- Weaving filter groups weaving and color-planning under one operational view.
- Gluing filter groups all gluing variants under one `دمج` view.
- Dyehouse filter is based on real dyehouse balance.

## Latest Sidebar Reorganization

- Version: `v2026.06.13.21`.
- Weaving menu now keeps only weaving-specific entries and combines `رصيد / استلام الخام`.
- Lab samples and raw gluing moved to the dyehouse menu.
- Operation stickers moved to the warehouse menu.

## Latest Dyehouse Menu Simplification

- Version: `v2026.06.13.22`.
- Dyehouse menu now combines inside/send/receive into one `رصيد / حركة المصبغة` entry.
- Empty/unused dyehouse transfer shortcut was removed from the sidebar only.

## Latest Warehouse Menu Simplification

- Version: `v2026.06.13.23`.
- Removed `رصيد الخام` from the warehouse sidebar because the factory does not operate a separate raw-stock warehouse.
- Warehouse menu now focuses on finished stock and related warehouse actions.

## Latest Reports Menu Simplification

- Version: `v2026.06.13.24`.
- Removed duplicated sidebar report shortcuts: `كل التقارير`, `تقرير الخام المتاح`, `تقرير الطلبات المتأخرة`, and `تقرير المصبغة`.
- Kept `تقرير داخل المصبغة` as the single dyehouse report entry.

## Latest A5 Simplification

- Version: `v2026.06.13.25`.
- Removed the A5 movement export shortcut and frontend CSV export flow.
- A5 is now explicitly read-only: customer balances and customer ledgers only.

## Latest Dashboard Menu Simplification

- Version: `v2026.06.13.26`.
- Merged `ملخص الطلبات` and `أوامر اليوم` into one `متابعة اليوم` entry.
- Removed warehouse, dyehouse, and weaving balance shortcuts from Dashboard because each balance is available in its own module.

## Latest Smart Follow-Up Consolidation

- Version: `v2026.06.13.27`.
- Merged the manager daily screen and smart employee entry under one name: `مركز المتابعة الذكي`.
- Removed duplicate AI shortcuts from the reports and top menus.

## Latest Orders Filter Fix

- Version: `v2026.06.13.28`.
- Renamed `كل الطلبات المفتوحة` to `كل الطلبات`.
- The `all` filter now displays every order, including operationally closed orders.

## Latest Home Screen Simplification

- Version: `v2026.06.13.29`.
- Removed the duplicated ERP flow map from the home screen.
- Home now keeps one task-entry layer instead of two overlapping navigation systems.

## Latest Smart Follow-Up Order Review

- Version: `v2026.06.13.30`.
- Smart follow-up rows now open the selected order details directly for review.
- Opening an order from the smart follow-up center closes AI focus mode first so the order focus screen is visible immediately.

## Latest Home Task Menu Styling

- Version: `v2026.06.13.31`.
- Refined the home task menu into a more compact command panel.
- KPI cards under the home entry now use a tighter visual style so the start screen feels like one organized view.

## Latest Project Memory Update

- Added `project-memory/UI_ORGANIZATION.md`.
- Documented the current no-duplicate UI organization principle.
- Documented that `Order 360` is a full operational order view concept, not an order number and not a database ID.

## Latest Finished Stock Sale Flow

- Version: `v2026.06.14.01`.
- Added `بيع مجهز` as a warehouse/commercial flow.
- The screen shows only real finished warehouse stock, then lets the user sell selected colors/quantities to a receiving customer.
- The sale is stored as a marked `finished_sale` customer delivery movement, so it reduces the source warehouse balance without creating weaving or dyeing work.
- The receiving customer appears in customer accounts with quantity, price, and total sale value.
- Source stock customers such as `2B` are treated as stock owners for these movements, not as the buying customer.
- Customer delivery batch schema now includes sale metadata: receiving customer, unit price, total price, payment terms, note number, and movement type.

## Latest Customer Quotation Items

- Version: `v2026.06.14.02`.
- Quotation is now treated as a customer quotation, not a single-fabric quotation.
- A single quotation can include multiple fabric/material items.
- Existing single-item quotations remain compatible and are read as one quotation item.
- New quotation items are stored in `pricing_items_json`; legacy pricing columns remain as summary/primary-item fields for compatibility.
- Opening the quotation document shows all quotation items under one customer-level offer.
- Converting a multi-item quotation opens a grouped customer order with the same customer and order number, while keeping each fabric item as its own operational order line.
- Not touched: `backend/calculations.js`, waste logic, stock logic, dyehouse logic, weaving logic, WhatsApp service, A5 service.

## Latest Customer Master Normalization

- Version: `v2026.06.14.03`.
- Customer names are now treated as master data from the customers screen.
- The customers/account screen can add and edit customer names, phone, and notes.
- Customer matching normalizes spaces, Arabic hamza forms, tatweel, and diacritics so variants such as `امل فاشون`, `أمل فاشون`, and `إمل فاشون` resolve to the same customer.
- Order creation, quotation creation, and finished-stock sale now use the canonical customer name when a matching customer already exists.
- Not touched: `backend/calculations.js`, waste logic, stock logic, dyehouse logic, weaving logic, WhatsApp service, A5 service.

## Latest Fabric Master Normalization

- Version: `v2026.06.14.04`.
- Fabric/item names are now treated as master data through the system status/settings screen.
- Fabric matching normalizes spaces, Arabic hamza forms, tatweel, and diacritics so spelling variants resolve to the same official fabric name.
- Order creation, grouped order lines, quotation creation, and quotation item rows now save against the canonical fabric name when a matching official fabric exists.
- Existing historical fabric names are not migrated automatically; this change protects new entries and allows a later controlled cleanup if needed.
- Not touched: `backend/calculations.js`, waste logic, stock logic, dyehouse logic, weaving logic, WhatsApp service, A5 service, SQLite schema.

## Latest Customer Delete And Negative Stock Save Warning

- Version: `v2026.06.14.05`.
- Customer master now supports deleting unused customers from the customers/accounts screen.
- Customer deletion is blocked when the customer is linked to orders, quotations, finished-stock sale movements, opening balances, or payments.
- Finished-stock sale no longer blocks saving when the selected stock balance is negative or lower than the sold quantity.
- When the sale exceeds the available balance, the movement is saved with a clear warning note so the operational problem remains visible for later correction.
- Not touched: `backend/calculations.js`, waste logic, stock calculation logic, dyehouse logic, weaving logic, WhatsApp service, A5 service, SQLite schema.

## Latest Finished Stock Sale Fabric Matching Fix

- Version: `v2026.06.14.06`.
- Finished-stock sale fabric filtering now matches the selected fabric against related display names such as base fabric and suffix variants.
- Example: selecting `F3` can show stock rows saved under `F3 تجهيز` when they are part of the same finished-stock family.
- This is a UI filtering fix only; stock calculations and movement persistence are unchanged.

## Latest Finished Stock Sale Exact Fabric Filter

- Version: `v2026.06.14.07`.
- Finished-stock sale now treats `F3` and `F3 تجهيز` as separate fabrics in the sale filter.
- The filter matches only the exact selected fabric name, allowing Arabic normalization but not suffix/prefix grouping.
- This prevents two different stock items from appearing together in one sale selection.
- Not touched: `backend/calculations.js`, stock calculation logic, movement persistence, SQLite schema.

## Latest Customer Master Delete Relaxation

- Version: `v2026.06.14.09`.
- Deleting a customer from the customer master list no longer checks quotations, orders, or delivery movements.
- The delete action removes only the master-list name and does not delete historical orders, quotations, movements, or ledgers.
- If the customer has opening balance or payments, the account data is kept and only a confirmation warning is shown.
- This avoids false delete blockers caused by old imported names or near-duplicate customer spelling.

## Latest Full Customer Delete

- Version: `v2026.06.14.10`.
- Customer delete is now a full delete operation after two confirmations.
- Full delete removes the customer, customer quotations, customer orders with their full operational movement graph, direct customer delivery/sale movements by customer name, outbox rows by customer name, and the saved customer account entry.
- The backend creates a SQLite backup before executing the full delete.
- This is intentionally dangerous and should be used only for incorrect/test/imported customer records.
- Not touched: `backend/calculations.js`, stock formulas, waste formulas, SQLite schema.

## Latest Combined Movement Entry

- Version: `v2026.06.14.11`.
- Order details now use combined movement commands instead of separate visible entry forms.
- The three combined commands are: `أمر صرف للمصبغة`, `أمر استلام من المصبغة`, and `أمر تسليم للعميل`.
- Each combined command can save body fabric and accessories together in one operational entry screen.
- Internally the save still uses the existing `/api/batches/bulk` endpoint and the existing movement tables, so calculations and reports continue to read the same data model.
- The older individual entry forms are hidden from the UI to reduce clutter, while the movement history lists remain visible.
- Not touched: `backend/calculations.js`, `backend/server.js`, stock formulas, waste formulas, SQLite schema, AI backend, WhatsApp service, A5 service.

## Latest Customer Quotation Pricing Formula

- Version: `v2026.06.14.12`.
- Customer quotation items now support the full pricing formula per fabric/material line.
- Formula per line: raw/weaving cost + dyeing cost + finishing/stage cost + waste cost, then deferred-payment percentage, then profit per kg.
- Deferred-payment percentage is applied before profit, as an operating finance cost.
- Waste basis can be selected per quotation line: on raw cost (`net`) or on total production cost (`gross` / القائم).
- The quotation document now shows raw, dyeing, stages, waste, deferred cost, profit, unit price, and total per line.
- Existing quotations remain compatible; missing new fields default to zero or the existing dyehouse accounting mode.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, operational stock logic, waste movement logic, AI backend, WhatsApp service, A5 service.

## Latest Pricing Card Correction

- Version: `v2026.06.14.13`.
- The pricing screen is now treated as `كرت تسعير`.
- The old duplicated top pricing fields for fabric, dyehouse, quantity, raw cost, dyeing cost, waste, stages, and profit are hidden from the visible form.
- The `كرت تسعير` line items are now the single visible source for customer quotation pricing.
- Waste basis labels are corrected:
  - `صافي`: waste is calculated on fabric/raw cost only.
  - `قائم`: waste is calculated on fabric/raw cost + dyeing cost + dyeing additions/stages.
- Existing saved quotations remain compatible because the hidden legacy fields and legacy columns are still populated from the first pricing-card line when saving.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, stock logic, operational waste movement logic, AI backend, WhatsApp service, A5 service.

## Latest Pricing Card Payment And Dyeing Stages

- Version: `v2026.06.14.14`.
- Visible pricing labels now use `كرت تسعير` / `كروت التسعير` instead of `تسعيرة`.
- Payment methods in the pricing card are: `نقدي`, `أجل شهر`, `أجل شهرين`, `أجل 3 شهور`, `أجل 4 شهور`, and `دفعات أسبوعية`.
- The fabric field and material field are unified in the pricing card as `الصنف / الخامة`.
- Dyeing cost is no longer a single visible number in the pricing card; each pricing line now has a `جدول الصباغة` with stage rows.
- Example dyeing stages: `صباغة 71`, `رام مقفول 5`, `دبل إنزيم 9`, `كسترة 3`, `فنش 5`.
- The total dyeing cost for a pricing line is calculated from the stage table and remains stored in the existing pricing item data for compatibility.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, operational stock logic, operational waste movement logic, AI backend, WhatsApp service, A5 service.

## Latest Pricing Card Simplification

- Version: `v2026.06.14.15`.
- Removed visible `نوع الخامة للتسعير` from the pricing card because `الصنف / الخامة` is now one field.
- Removed visible `درجة اللون` from the pricing card.
- Removed visible `إضافات أخرى` from pricing card lines.
- All dyeing additions such as kastra, enzyme, ram, finish, and similar stages must be entered as rows inside `جدول الصباغة`.
- For `قائم`, waste is now effectively based on fabric/raw price plus the summed dyeing-stage table only.
- Legacy hidden columns remain populated safely for compatibility with old rows and backend schema.

## Latest Pricing Card Accessory Support

- Version: `v2026.06.14.17`.
- Each pricing-card line now has an internal accessory table inside the same line.
- Accessory rows capture accessory type, percentage, and price.
- Accessory cost per pricing line is calculated as `percentage * price / 100`.
- The calculated accessory cost is included in the production cost before waste, deferred-payment cost, and profit.
- Accessory data is stored in `pricing_items_json` as `accessoryLines` and `accessoryCost`; the SQLite schema is unchanged.
- Dyeing additions remain inside the dyeing-stage table; accessory is separate from dyeing stages.
- The pricing-card item layout no longer forces horizontal scrolling; item fields wrap inside the card and the dyeing/accessory tables stay visible in the same view.
- Dyeing-stage names from the pricing card are copied to converted orders and appear automatically in the dyeing production order as operation stages only, without prices.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, operational stock logic, operational waste movement logic, AI backend, WhatsApp service, A5 service.

## Latest Pricing Deferred Payment Rule

- Version: `v2026.06.14.18`.
- Deferred payment in the pricing card is now calculated by month.
- The entered deferred value means number of months, not direct percent.
- Each deferred month adds `3%` to the cost before profit.
- Example: `1` month = `3%`, `2` months = `6%`, `3` months = `9%`, `4` months = `12%`.
- No automatic filling was added to pricing-card rows; the user still controls the entered month count.

## Latest Customer Quotation Output Cleanup

- Version: `v2026.06.14.19`.
- Customer-facing quotation no longer shows internal costing columns.
- Removed: item count, raw fabric cost, dyeing-stage table, waste, deferred cost, and profit from the customer quotation.
- Changed labels: `متوسط سعر الكيلو` to `سعر الكيلو`, `إجمالي العرض` to `إجمالي العقد`, and `الصنف / الخامة` to `الصنف`.
- Accessories appear under the fabric name in the same item cell without internal prices.
- Added quotation validity note: `عرض السعر ساري لمدة 7 أيام.`

## Latest Pricing Accessory Service Rule

- Version: `v2026.06.14.20`.
- Pricing-card accessory rows now use an accessory type dropdown.
- Available accessory types include `ريب`, `ديربي`, `لياقات`, `أساور`, and `أساور ولياقات`.
- Accessory pricing is now a direct service price, like dyeing/kastra/enzyme stages.
- Accessory cost per line is the sum of accessory service prices, not `percentage * price / 100`.
- Customer quotations continue to show accessory names only, without internal prices.

## Latest Pricing Accessory Raw Item Correction

- Version: `v2026.06.15.01`.
- Correction: the previous accessory service rule was wrong for the factory workflow.
- Accessory in a pricing card is now treated as a secondary raw/material item, not a dyeing/service addition.
- Each accessory row captures accessory type, quantity, and raw unit price.
- Accessory total is calculated as `quantity * raw unit price`.
- Accessory total is added to the contract total as an independent raw item total.
- Accessory total is not included in the fabric production cost, waste basis, deferred-payment cost, or fabric kilo selling price.
- Customer quotations continue to show accessories under the fabric item without internal costing details.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, operational stock logic, operational waste movement logic, AI backend, WhatsApp service, A5 service.

## Latest Pricing Accessory Stage Selection

- Version: `v2026.06.15.02`.
- Accessory remains a secondary raw/material item, not a service.
- Each accessory row now has selectable operation-stage checkboxes generated from the same fabric dyeing-stage table.
- Checked stages add their stage price to the accessory raw unit price only.
- Example: rib raw price `220` + checked dyeing stage `79` = accessory unit price `299`.
- Accessory total remains `quantity * (raw unit price + selected stage prices)`.
- The selected accessory stages do not change the fabric kilo price, fabric production cost, fabric waste, or deferred-payment cost.
- Customer quotation remains clean: it shows accessory under the fabric item without exposing internal stage costs.

## Latest Customer Quotation Accessory Lines

- Version: `v2026.06.15.03`.
- Customer quotation item rows now separate fabric and accessories commercially.
- Fabric appears as the main row with its quantity, kilo price, and fabric-only total.
- Accessories appear directly under the fabric row as accessory rows.
- Each accessory row shows accessory type, quantity, kilo/unit price, and total.
- The quotation summary contract total remains inclusive of fabric plus accessories.
- Internal dyeing-stage costs are still hidden from the customer-facing quotation.

## Latest Pricing Currency And Active Order Cards

- Version: `v2026.06.15.04`.
- Working orders can open a pricing card from the order documents panel.
- If an order has no linked pricing card, the system opens a new draft card filled from the current order data and links it to the order after save.
- If an order already has a linked pricing card, the same action opens the linked card for editing.
- Pricing cards now support currency selection: Egyptian pound (`EGP`) or dollar (`USD`).
- Currency is stored safely inside pricing item JSON without changing the SQLite schema.
- Pricing list, pricing preview, and customer quotation display the selected currency.
- Customer quotation accessory sub-lines display accessory quantity, unit price, and total using the selected currency.

## Latest Customer Quotation Print Layout

- Version: `v2026.06.15.05`.
- Customer quotation printing was reorganized as a clean commercial offer.
- The printed quotation keeps only customer-facing values: item, quantity, kilo/unit price, total, currency, payment terms, and validity notes.
- Fabric rows are shown as primary lines, and accessory rows appear directly underneath as separate commercial sub-lines.
- Internal pricing details remain hidden from the customer output: raw fabric cost, dyeing-stage table, waste, deferred-payment cost, and profit.
- The quotation print layout now uses a fixed table width and compact metadata strip to reduce horizontal scrolling and improve PDF/print readability.

## Latest Pricing To Order Prefill

- Version: `v2026.06.15.06`.
- Converting a pricing card to an order now prepares the order form from the latest pricing-card structure.
- The order form is prefilled with fabric, customer, quantity, kilo price, dyehouse, waste percent, payment terms, accessory lines, and dyeing operation stages.
- For grouped pricing cards with more than one item, each saved order line keeps its own dyehouse, accessory lines, waste percent, raw cost, and dyeing operation stages.
- The goal is that after pressing `تنزيل طلب`, the user only reviews the generated order data and saves it.
- No backend endpoints, SQLite schema, or calculation logic were changed.

## Latest Quotation Print Summary Cleanup

- Version: `v2026.06.15.07`.
- The printed quotation summary now shows only `إجمالي العقد`.
- The separate summary KPI for `سعر الكيلو` was removed from beside the contract total.
- The item table still keeps its `سعر الكيلو` column for fabric and accessory lines.
- The contract total card is centered and visually emphasized for cleaner printing.

## Latest Pricing To Order Save-Only Mode

- Version: `v2026.06.15.08`.
- `تنزيل طلب` from a pricing card now opens the order form in a dedicated pricing-conversion mode.
- The form is prepared so the user can review and press `حفظ الطلب` without filling required blanks.
- Missing weaving source is prefilled as `من كرت التسعير` during conversion to avoid blocking save.
- Duplicate visual fields are reduced: the legacy accessory summary fields are hidden, the accessory lines table remains visible, and the duplicate primary grouped-order row is hidden.
- For one-item pricing cards, the grouped-order box is hidden entirely during conversion.
- Normal new-order and edit-order flows reset this mode and keep the full editable form.

## Latest Unified Order Form And Pricing Source

- Version: `v2026.06.15.09`.
- The cleaned order form is now the default visual behavior, not only a pricing-conversion mode.
- Legacy accessory summary fields are hidden permanently; the accessory lines table remains the active order input surface.
- The duplicated primary grouped-order row is hidden visually in all order-entry cases, while it remains available internally for safe save logic.
- Pricing cards now include `مصدر النسيج`.
- Because the SQLite pricing schema was not changed, pricing weaving source is stored safely inside each pricing item in `pricing_items_json`.
- Converting a grouped pricing card to orders now saves from full converted order drafts, not from the shortened grouped-order screen rows.
- This preserves each pricing item data during conversion: fabric, quantity, width, kilo price, waste percent, dyehouse, weaving source, accessory lines, raw cost, and dyeing operation stages.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, operational stock logic, operational waste movement logic, AI backend, WhatsApp service, A5 service.

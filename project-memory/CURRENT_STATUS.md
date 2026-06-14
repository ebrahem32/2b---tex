# Current Status

## Current Version

`v2026.06.14.02`

## Last Known Commit Before Project Memory

`282d516 Extract orders UI module`

## Latest Commit Message

`Implement customer quotation items`

## Current Phase

```text
Phase 3.1 - Daily Operations and Operational Test
```

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

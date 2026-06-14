# Development Log

This file records important system changes. New entries should follow `CHANGE_TEMPLATE.md`.

## Known Important Changes

### Organize UI Navigation Structure

- Goal: reorganize the single crowded UI into clearer ERP-style sections.
- Files touched: frontend UI files.
- Not touched: calculations, database schema, operational balances.
- Test: `npm run check`.

### Fix Railway Backend Port Conflict

- Goal: keep Railway deployment stable.
- Files touched: runtime/server startup area.
- Not touched: business logic and database.
- Test: Railway deployment and `npm run check`.

### Hide Redundant Top Navigation

- Goal: reduce duplicate navigation after sidebar introduction.
- Files touched: frontend UI.
- Not touched: calculations and database.

### Link Pricing to Active Orders

- Goal: allow quotations/contracts for existing active orders.
- Files touched: frontend/order-pricing UI.
- Not touched: backend calculations and database schema.

### Focus Order List and Filtered Views

- Goal: when filtering or choosing an order, reduce screen crowding.
- Files touched: frontend UI.
- Not touched: stock, waste, or reporting calculations.

### Show Order Tools in Focus View

- Goal: when inside one order, make printing, reports, and editing available from the order view.
- Files touched: frontend UI.
- Not touched: backend calculations and schema.

### Focus AI Workspace and Improve Targeted Answers

- Goal: open AI as a separate workspace and improve targeted operational answers.
- Files touched: frontend AI UI and existing AI API usage.
- Not touched: AI backend rules unless explicitly required.

### Focus Dashboard Summary View

- Goal: open dashboard summary as a separate focused view.
- Files touched: frontend UI.
- Not touched: calculations and database.

### Extract Navigation and Focus View Modules

- Date: 2026-06-13
- Commit: `47dbc15 Extract navigation and focus view modules`
- Goal: start Phase 1 frontend modular refactor safely.
- Files changed: `modules/navigation.js`, `modules/focusViews.js`, `app.js`, `index.html`, `package.json`.
- Not touched: backend, database, schema, waste logic, stock logic.
- Test: `npm run check`, GitHub Actions, Railway Online.

### Extract AI and Documents UI Modules

- Date: 2026-06-13
- Commit: `918ce4b Extract AI and documents UI modules`
- Goal: continue frontend modular refactor by extracting UI-only AI and document layers.
- Files changed: `modules/aiUi.js`, `modules/documentsUi.js`, `app.js`, `index.html`, `package.json`.
- Not touched: `backend/server.js`, `backend/calculations.js`, `documents.js`, database, schema, waste logic, stock logic.
- Test: `npm run check`, GitHub Actions, Railway Online.

### Complete Frontend UI Module Extraction

- Date: 2026-06-13
- Commit: `3d4dacf Complete frontend UI module extraction`.
- Goal: continue Phase 1.4 by extracting additional frontend UI-only areas from `app.js`.
- Files added: `modules/auditUi.js`, `modules/usersUi.js`, `modules/settingsUi.js`, `modules/formsUi.js`, `modules/pricingUi.js`.
- Files changed: `app.js`, `index.html`, `package.json`, `project-memory/CURRENT_STATUS.md`, `project-memory/DEVELOPMENT_LOG.md`.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite, schema, waste logic, stock logic, AI backend, WhatsApp service, A5 service.
- Deferred: `operationsUi.js`, `transfersUi.js`, and deeper `accessoriesUi.js` movement handlers remain in `app.js` because they are coupled to backend writes, operational validations, and stock movement safety.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Correct Pricing Accessory As Raw Item

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.01`
- Goal: correct the pricing-card accessory rule so accessories are not treated as dyeing/service additions.
- Change: accessory rows now capture accessory type, quantity, and raw unit price.
- Rule: accessory total is `quantity * raw unit price`.
- Rule: accessory total is added to the contract total as a separate raw/material item.
- Rule: accessory total is not part of fabric production cost, waste cost, deferred-payment cost, or fabric kilo selling price.
- Customer quotation remains clean: accessory appears under the fabric item without internal prices.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, operational stock logic, operational waste movement logic.
- Test: `npm run check` passed locally, including `Operational flow check passed`; direct pricing-domain check confirmed accessory is outside `productionCost` and added to `totalOffer` separately.

### Extract Frontend Backend Client

- Date: 2026-06-13
- Commit: `Extract frontend backend client`.
- Goal: start Phase 2.1 by extracting only the generic frontend backend request/client layer.
- Files added: `modules/backendClient.js`.
- Files changed: `app.js`, `index.html`, `package.json`, `project-memory/CURRENT_STATUS.md`, `project-memory/DEVELOPMENT_LOG.md`.
- Moved: generic API URL building, fetch wrapper, JSON parsing, HTTP error extraction, and raw GET/POST/PUT/DELETE client helpers.
- Not moved: write guards, rollback, persistence verification, operational save flows, order/batch/customer/pricing business logic.
- Not touched: `backend/server.js`, `backend/calculations.js`, SQLite, schema, waste logic, stock logic, AI backend, WhatsApp service, A5 service.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Add Operational AI Manager Dashboard

- Date: 2026-06-13
- Commit: `Add operational AI manager dashboard`.
- Goal: start Phase 3.0 by adding a read-only operational AI dashboard inside the existing AI workspace.
- Files added: `modules/operationalAiManager.js`.
- Files changed: `app.js`, `modules/aiUi.js`, `index.html`, `styles.css`, `package.json`, `project-memory/CURRENT_STATUS.md`, `project-memory/DEVELOPMENT_LOG.md`.
- Added: daily operating summary, delayed orders, dyehouse balance watch, ready-to-deliver watch, high waste watch, and read-only recommendations.
- Added: Order 360 read-only movement dates based on existing movement data.
- Not touched: `backend/server.js`, `backend/calculations.js`, SQLite, schema, endpoints, waste logic, stock logic, AI backend, WhatsApp service, A5 service.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Add Daily Operations Dashboard and Full Operational Test

- Date: 2026-06-13
- Commit: `Add daily operations dashboard and full operational test`.
- Goal: add a read-only daily manager screen, formalize the full operational cycle test, and make AI employee responses more action-oriented.
- Files added: `modules/todayOrdersUi.js`, `scripts/full-operational-test.js`.
- Files changed: `app.js`, `index.html`, `modules/navigation.js`, `modules/aiUi.js`, `backend/server.js`, `styles.css`, `package.json`, `project-memory/CURRENT_STATUS.md`, `project-memory/DEVELOPMENT_LOG.md`.
- Added: `أوامر اليوم` dashboard for urgent orders, dyehouse balance, ready-to-deliver, delays, and high waste.
- Added: `npm run test:operational-full` for intentional full-cycle Railway/API testing with a real `تيست-*` order.
- Improved: AI employee local/backend fallback wording now emphasizes operational decisions and next actions.
- Not touched: `backend/calculations.js`, SQLite, schema, waste calculation logic, stock calculation logic, WhatsApp service, A5 service.
- Test: `npm run check` passed locally, including `Operational flow check passed`.
- Full test: `npm run test:operational-full` passed on Railway with order `تيست-mqbmb12s`.

### Hotfix Document UI Initialization Order

- Date: 2026-06-13
- Commit: `Fix document UI initialization order`.
- Goal: fix startup error `Cannot access 'buildQuotationDocument' before initialization`.
- Change: moved `createDocumentsUi()` initialization until after `window.TwoBTexDocuments.createBuilders()` defines document builder functions.
- Not touched: calculations, database, schema, stock logic, waste logic.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Bump App Cache Version After Document UI Hotfix

- Date: 2026-06-13
- Commit: `Bump app cache version after document UI hotfix`.
- Goal: force browsers to reload the corrected `app.js` after the document UI initialization hotfix.
- Change: bumped app version to `v2026.06.13.14` and changed `index.html` script query to `app.js?v=20260613-14`.
- Not touched: calculations, database, schema, stock logic, waste logic.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Fix Document Builder Initialization Guard

- Date: 2026-06-13
- Commit: pending.
- Goal: remove the root startup risk behind `Cannot access 'buildQuotationDocument' before initialization`.
- Change: declared document builder references early in `app.js` and assigned them after `window.TwoBTexDocuments.createBuilders()`, so document-related references cannot hit the temporal-dead-zone during startup.
- Version: `v2026.06.13.15`.
- Not touched: calculations, database, schema, stock logic, waste logic.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Clarify Mixed AI Order Status

- Date: 2026-06-13
- Commit: pending.
- Version: `v2026.06.13.16`
- Goal: make Operational AI and Today's Orders explain orders that are both partially ready in warehouse and partially still inside the dyehouse.
- Change: kept warehouse-ready orders visible when `warehouseBalance > 0`, kept dyehouse orders visible when dyehouse balance exists, and added mixed-status wording to ready rows when dyehouse balance also exists.
- Not touched: calculations, database, schema, stock logic, waste logic.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Sort Operational AI Lists And Show Stopped Company

- Date: 2026-06-13
- Commit: pending.
- Version: `v2026.06.13.17`
- Goal: make operational lists easier to scan by ordering from highest to lowest and naming the actual stopped company/location.
- Change: delayed lists sort by days, dyehouse and ready lists by quantity, waste lists by waste percent, and stage labels now show weaving source or dyehouse name where applicable.
- Not touched: calculations, database, schema, stock logic, waste logic.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Show Over-Delivery Stock Warning

- Date: 2026-06-13
- Commit: pending.
- Version: `v2026.06.13.18`
- Goal: explain cases where finished quantity exists but warehouse balance is zero because customer delivery records exceed finished receiving.
- Change: added an Order 360 alert showing over-delivery quantity and the finished/delivered comparison.
- Not touched: calculations, database, schema, stock logic, waste logic.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Show Negative Warehouse Balance

- Date: 2026-06-13
- Commit: pending.
- Version: `v2026.06.13.19`
- Goal: keep over-delivery issues visible until corrected instead of hiding them as zero warehouse balance.
- Change: frontend order calculation now shows warehouse balance as a signed value when customer delivery exceeds finished stock.
- Not touched: backend calculations, database, schema, waste logic, persisted movement data.
- Test: `npm run check` passed locally, including `Operational flow check passed`; `node --check orders.js` passed.

### Consolidate Operational Stage Filters

- Date: 2026-06-13
- Commit: pending.
- Version: `v2026.06.13.20`
- Goal: remove duplicate operational stage splits in the order lists and make warehouse/dyehouse/weaving filters reflect real operational balances.
- Change: warehouse filter now includes every non-zero warehouse balance, weaving groups color-planning and weaving, gluing groups all gluing variants as `دمج`, and dyehouse uses the real dyehouse balance.
- Not touched: backend calculations, database, schema, waste logic, persisted movement data.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Reorganize Sidebar Operational Menus

- Date: 2026-06-13
- Commit: pending.
- Version: `v2026.06.13.21`
- Goal: remove confusing duplicate menu entries and place each operational document under its real department.
- Change: weaving now shows `رصيد / استلام الخام` as one item, lab samples and raw gluing moved under dyehouse, and operation stickers moved under warehouse.
- Not touched: backend calculations, database, schema, waste logic, stock logic, persisted movement data.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Simplify Dyehouse Sidebar Menu

- Date: 2026-06-13
- Commit: pending.
- Version: `v2026.06.13.22`
- Goal: remove duplicate dyehouse menu actions that opened the same operational screen.
- Change: combined inside/send/receive dyehouse actions into `رصيد / حركة المصبغة` and removed the unused dyehouse transfers shortcut from the sidebar.
- Not touched: backend calculations, database, schema, waste logic, stock logic, persisted movement data, transfer data model.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Remove Raw Stock Shortcut From Warehouse Menu

- Date: 2026-06-13
- Commit: pending.
- Version: `v2026.06.13.23`
- Goal: align the warehouse sidebar with the real factory process where raw fabric does not have a separate warehouse balance.
- Change: removed `رصيد الخام` from the warehouse menu and kept warehouse focused on finished stock.
- Not touched: backend calculations, database, schema, waste logic, stock logic, persisted movement data.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Remove Duplicated Reports From Sidebar

- Date: 2026-06-13
- Commit: pending.
- Version: `v2026.06.13.24`
- Goal: reduce report menu clutter and keep one clear entry for each report purpose.
- Change: removed duplicated sidebar shortcuts for `كل التقارير`, `تقرير الخام المتاح`, `تقرير الطلبات المتأخرة`, and `تقرير المصبغة`; kept `تقرير داخل المصبغة` as the dyehouse report entry.
- Not touched: backend calculations, database, schema, waste logic, stock logic, persisted movement data, report generation functions.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Remove A5 Export Flow

- Date: 2026-06-13
- Commit: pending.
- Version: `v2026.06.13.25`
- Goal: enforce that A5 is a read-only accounting reference for customer balances and ledger review only.
- Change: removed A5 movement export shortcuts and deleted the frontend CSV export flow.
- Not touched: A5 read endpoints, backend calculations, database, schema, waste logic, stock logic, persisted movement data.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Simplify Dashboard Sidebar Menu

- Date: 2026-06-13
- Commit: pending.
- Version: `v2026.06.13.26`
- Goal: keep Dashboard as a high-level daily follow-up entry and remove shortcuts duplicated in operational modules.
- Change: merged `ملخص الطلبات` and `أوامر اليوم` into `متابعة اليوم`, and removed warehouse/dyehouse/weaving balance shortcuts from Dashboard.
- Not touched: backend calculations, database, schema, waste logic, stock logic, persisted movement data.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Merge Manager And Smart Employee Screens

- Date: 2026-06-13
- Commit: pending.
- Version: `v2026.06.13.27`
- Goal: remove duplicate manager/smart-employee navigation and keep one smart follow-up center.
- Change: renamed the combined entry to `مركز المتابعة الذكي`, removed duplicate AI shortcuts from reports/top menus, and hid the old daily manager panel from normal module navigation.
- Not touched: AI backend, backend calculations, database, schema, waste logic, stock logic, persisted movement data.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Show All Orders In All-Orders Filter

- Date: 2026-06-13
- Commit: pending.
- Version: `v2026.06.13.28`
- Goal: make the orders filter label and behavior match exactly.
- Change: renamed `كل الطلبات المفتوحة` to `كل الطلبات` and changed the `all` filter to include closed orders too.
- Not touched: backend calculations, database, schema, waste logic, stock logic, persisted movement data.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Remove Duplicate Home ERP Map

- Date: 2026-06-13
- Commit: pending.
- Version: `v2026.06.13.29`
- Goal: remove the feeling of a system built on top of another system on the home screen.
- Change: removed the duplicate ERP flow-map navigation layer and kept the main task cards as the single home entry point.
- Not touched: backend calculations, database, schema, waste logic, stock logic, persisted movement data.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Open AI Dashboard Orders From Rows

- Date: 2026-06-13
- Commit: pending.
- Version: `v2026.06.13.30`
- Goal: allow reviewing order details directly from smart follow-up lists.
- Change: smart follow-up rows now carry the normal order-open hook, AI row click handling accepts both AI and order row hooks, and order focus closes AI focus before rendering details.
- Not touched: AI backend, backend calculations, database, schema, waste logic, stock logic, persisted movement data.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Refresh Home Task Menu Styling

- Date: 2026-06-13
- Commit: pending.
- Version: `v2026.06.13.31`
- Goal: improve the home task menu shape without reintroducing duplicate navigation.
- Change: made the task menu more compact, added a subtle command-panel treatment, tightened task cards, and visually aligned the KPI cards below it.
- Not touched: backend calculations, database, schema, waste logic, stock logic, persisted movement data.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Document UI Organization Memory

- Date: 2026-06-13
- Commit: pending.
- Version: `v2026.06.13.31`
- Goal: preserve the latest agreed UI organization decisions inside project memory.
- Change: added `UI_ORGANIZATION.md` and linked it from README, overview, architecture, and current status.
- Notes: documented that `Order 360` means a full operational order view, not an order number or database ID.
- Not touched: application code, backend calculations, database, schema, waste logic, stock logic, persisted movement data.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Implement Finished Stock Sale Flow

- Date: 2026-06-14
- Commit: pending.
- Version: `v2026.06.14.01`
- Goal: allow selling finished warehouse stock to a customer without opening a new production order.
- Change: added `بيع مجهز` screen under warehouse, showing available warehouse items/colors, saving selected sale quantities as `finished_sale` customer delivery movements, and adding sale value to the receiving customer's account.
- Schema: extended `customer_delivery_batches` with receiving customer, unit price, total price, payment terms, note number, and movement type.
- Not touched: `backend/calculations.js`, waste logic, dyehouse logic, weaving logic, WhatsApp service, A5 service.
- Test: `npm run check` passed locally, including `Operational flow check passed`; `/api/health` returned `schema.ok=true`.

### Implement Customer Quotation Items

- Date: 2026-06-14
- Commit: pending.
- Version: `v2026.06.14.02`
- Goal: make quotation customer-level and able to contain more than one fabric/material item.
- Change: added quotation item storage through `pricing_items_json`, added a quotation-items editor in the pricing form, made the quotation document render all items under one customer offer, and allowed converting a multi-item quotation into a grouped customer order.
- Compatibility: old single-item quotations still work and are interpreted as one item.
- Not touched: `backend/calculations.js`, waste logic, stock logic, dyehouse logic, weaving logic, WhatsApp service, A5 service.
- Test: `npm run check` passed locally, including `Operational flow check passed`; `/api/health` returned `schema.ok=true`.

### Add Customer Master Normalization

- Date: 2026-06-14
- Commit: pending.
- Version: `v2026.06.14.03`
- Goal: prevent duplicate customer names caused by spelling variants such as hamza forms and spacing differences.
- Change: added customer master management inside the customers/accounts screen, added normalized customer matching, and made order creation, quotation creation, and finished-stock sale save against the canonical customer name when available.
- Not touched: `backend/calculations.js`, waste logic, stock logic, dyehouse logic, weaving logic, WhatsApp service, A5 service.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Add Fabric Master Normalization

- Date: 2026-06-14
- Commit: pending.
- Version: `v2026.06.14.04`
- Goal: prevent duplicate fabric/item names caused by spelling variants, extra spaces, and Arabic hamza differences.
- Change: added official fabric list storage through `system_settings.fabricMaster`, exposed it in the system status/settings screen, added fabric-name datalists, and made order creation, grouped order items, quotation creation, and quotation item rows save canonical fabric names when available.
- Compatibility: existing historical fabric names are left unchanged until a separate controlled cleanup/migration is explicitly requested.
- Not touched: `backend/calculations.js`, waste logic, stock logic, dyehouse logic, weaving logic, WhatsApp service, A5 service, SQLite schema.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Add Customer Delete And Negative Stock Save Warning

- Date: 2026-06-14
- Commit: pending.
- Version: `v2026.06.14.05`
- Goal: allow safe cleanup of unused customer master records and keep negative/insufficient finished-stock issues visible without blocking sale entry.
- Change: added customer master delete action for unused customers, with blockers for linked operational/commercial/customer-account data.
- Change: finished-stock sale now includes negative/non-zero balances in the source list, removes the UI max restriction, and saves sale movements that exceed available balance with a warning note.
- Not touched: `backend/calculations.js`, waste logic, stock calculation logic, dyehouse logic, weaving logic, WhatsApp service, A5 service, SQLite schema.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Fix Finished Stock Sale Fabric Matching

- Date: 2026-06-14
- Commit: pending.
- Version: `v2026.06.14.06`
- Goal: prevent available finished-stock rows from disappearing when the selected fabric name is a base name and the stored stock row has a suffix such as `تجهيز`.
- Change: added a finished-stock sale fabric matcher that compares exact names, normalized names, token matches, and safe prefix matches for the sale filter only.
- Not touched: `backend/calculations.js`, waste logic, stock calculation logic, dyehouse logic, weaving logic, WhatsApp service, A5 service, SQLite schema.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Fix Finished Stock Sale Exact Fabric Filter

- Date: 2026-06-14
- Commit: pending.
- Version: `v2026.06.14.07`
- Goal: keep distinct finished-stock items separate when selling from stock.
- Change: tightened the finished-stock sale fabric matcher so `F3` and `F3 تجهيز` no longer appear together; only exact or normalized-equal names match.
- Not touched: `backend/calculations.js`, waste logic, stock calculation logic, dyehouse logic, weaving logic, WhatsApp service, A5 service, SQLite schema.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Relax Customer Master Delete

- Date: 2026-06-14
- Commit: pending.
- Version: `v2026.06.14.09`
- Goal: allow deleting incorrect or imported customer names from the master list without false blockers from quotations or historical records.
- Change: customer master delete now removes only the master-list record, does not check quotations/orders/movements as blockers, and keeps account data when opening balances or payments exist.
- Not touched: `backend/calculations.js`, waste logic, stock calculation logic, dyehouse logic, weaving logic, WhatsApp service, A5 service, SQLite schema.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Add Full Customer Delete

- Date: 2026-06-14
- Commit: pending.
- Version: `v2026.06.14.10`
- Goal: allow complete removal of incorrect/test/imported customers and their linked data when explicitly confirmed.
- Change: added a full customer delete backend endpoint that removes the customer, customer quotations, customer orders through the existing order graph deletion, direct customer delivery/sale rows by customer name, and report outbox rows by customer name.
- Safety: the backend creates a SQLite backup before executing the full delete.
- Change: customer delete in the UI now uses the full delete endpoint with two confirmation prompts and removes the saved customer account entry.
- Not touched: `backend/calculations.js`, waste logic, stock calculation logic, dyehouse logic, weaving logic, WhatsApp service, A5 service, SQLite schema.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Add Combined Movement Entry

- Date: 2026-06-14
- Commit: pending.
- Version: `v2026.06.14.11`
- Goal: remove repeated individual movement forms and make body fabric and accessories move through the same operational command.
- Change: added a combined movement command panel inside order details for dyehouse issue, dyehouse receipt, and customer delivery.
- Change: each combined command renders fabric rows and accessory rows in one dialog and saves them through the existing `/api/batches/bulk` endpoint.
- Change: individual entry forms for raw issue, finished receipt, customer delivery, accessory issue, and accessory receipt are hidden from the UI; existing movement history remains visible.
- Not touched: `backend/calculations.js`, `backend/server.js`, waste logic, stock calculation logic, dyehouse logic, weaving logic, WhatsApp service, A5 service, SQLite schema.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Add Customer Quotation Pricing Formula

- Date: 2026-06-14
- Commit: pending.
- Version: `v2026.06.14.12`
- Goal: make quotation pricing customer-level and formula-based for multiple fabrics/materials.
- Change: quotation item rows now include raw cost, dyeing cost, finishing/stage cost, waste percentage, waste basis, deferred-payment percentage, and profit per kg.
- Change: pricing formula now applies deferred-payment cost before profit: production cost + waste + deferred percentage + profit.
- Change: waste basis can be controlled per line as `net` (raw cost only) or `gross` (raw + dyeing + stages).
- Change: quotation document now displays the cost breakdown per line and preserves the total quotation summary.
- Compatibility: existing quotations still calculate because missing deferred/waste-basis fields default safely.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, operational stock logic, dyehouse/warehouse movement logic, AI backend, WhatsApp service, A5 service.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Correct Pricing Card UI

- Date: 2026-06-14
- Commit: pending.
- Version: `v2026.06.14.13`
- Goal: make `كرت تسعير` the single visible pricing entry surface instead of keeping duplicated pricing fields above it.
- Change: renamed the pricing dialog title and quotation line editor concept to `كرت تسعير`.
- Change: hidden the older duplicated top fields for item/material/dyehouse/color/quantity/costs/waste/profit from the visible pricing form.
- Change: made pricing-card rows directly editable, including the first row.
- Change: corrected waste basis wording to `صافي` and `قائم`.
- Rule: `صافي` calculates waste on fabric/raw cost only; `قائم` calculates waste on fabric/raw cost + dyeing + dyeing additions/stages.
- Compatibility: legacy pricing fields remain internally available and are filled from the first card line on save, so older reports and conversion paths stay compatible.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, operational stock logic, operational waste movement logic, AI backend, WhatsApp service, A5 service.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Add Pricing Card Payment And Dyeing Stage Table

- Date: 2026-06-14
- Commit: pending.
- Version: `v2026.06.14.14`
- Goal: align the pricing card with the factory pricing method and remove duplicated material meaning.
- Change: updated visible labels from `تسعيرة` to `كرت تسعير` / `كروت التسعير`.
- Change: replaced pricing payment options with `نقدي`, `أجل شهر`, `أجل شهرين`, `أجل 3 شهور`, `أجل 4 شهور`, and `دفعات أسبوعية`.
- Change: unified item and material in the pricing card as `الصنف / الخامة`; saved `materialType` follows the selected fabric name for compatibility.
- Change: replaced the visible single dyeing-cost input inside each card line with a dyeing-stage table.
- Rule: dyeing line cost is the sum of stage rows such as dyeing, ram, enzyme, kastra, finish, etc.
- Compatibility: the stage table is stored inside `pricing_items_json`, while the summed dye cost still fills the existing dye-cost field for reports, conversion, and old saved rows.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, operational stock logic, operational waste movement logic, AI backend, WhatsApp service, A5 service.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Simplify Pricing Card Fields

- Date: 2026-06-14
- Commit: pending.
- Version: `v2026.06.14.15`
- Goal: remove fields that are not part of the real pricing card workflow.
- Change: removed visible `نوع الخامة للتسعير` because `الصنف / الخامة` is the single item field.
- Change: removed visible `درجة اللون` from pricing card lines and quotation output.
- Change: removed visible `إضافات أخرى`; dyeing additions must be entered as dyeing-stage rows.
- Rule: the `قائم` waste basis uses fabric/raw price + summed dyeing-stage table.
- Compatibility: hidden/legacy fields remain internally available for schema and older records, but new card UI no longer asks the user for them.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, operational stock logic, operational waste movement logic, AI backend, WhatsApp service, A5 service.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Add Pricing Card Accessory Support

- Date: 2026-06-14
- Commit: pending.
- Version: `v2026.06.14.17`
- Goal: include accessories inside the pricing card without adding another separate pricing screen.
- Change: added an accessory table inside every pricing-card item line.
- Change: accessory rows include accessory type, percentage, and price.
- Rule: accessory cost is calculated as `percentage * price / 100` and is included in production cost before waste, deferred-payment cost, and profit.
- Change: removed the forced horizontal scroll from pricing-card rows; each item now wraps inside the card and keeps dyeing/accessory tables visible in the same view.
- Change: dyeing-stage names from the pricing card are copied to converted orders and shown in the dyeing production order as operation stages only, without prices.
- Compatibility: accessory data is stored inside `pricing_items_json` as `accessoryLines` and `accessoryCost`; no database schema change was made.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, operational stock logic, operational waste movement logic, AI backend, WhatsApp service, A5 service.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Update Pricing Deferred Payment Monthly Rule

- Date: 2026-06-14
- Commit: pending.
- Version: `v2026.06.14.18`
- Goal: calculate deferred payment cost by month.
- Change: the deferred value in pricing-card lines is treated as month count.
- Rule: each deferred month adds `3%` before profit.
- Example: `3` months equals `9%`.
- No automatic row filling was added; the user still enters the month count manually.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, operational stock logic, operational waste movement logic, AI backend, WhatsApp service, A5 service.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Clean Customer Quotation Output

- Date: 2026-06-14
- Commit: pending.
- Version: `v2026.06.14.19`
- Goal: keep customer quotations commercial and hide internal costing.
- Change: removed internal cost columns from customer-facing quotation output.
- Change: renamed quotation summary labels to `سعر الكيلو` and `إجمالي العقد`.
- Change: renamed item header to `الصنف`.
- Change: accessories now appear under the fabric name in the same item cell without prices.
- Change: added quotation validity note for 7 days.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, pricing formulas, operational stock logic, operational waste movement logic.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Update Pricing Accessory Service Rule

- Date: 2026-06-14
- Commit: pending.
- Version: `v2026.06.14.20`
- Goal: price accessories as direct service additions inside the pricing card.
- Change: accessory rows now use a dropdown for accessory type.
- Change: accessory cost is now the direct service price, summed into production cost like dyeing/kastra stages.
- Change: removed percentage-based accessory pricing from the pricing-card UI.
- Compatibility: existing `accessoryLines` remain stored in `pricing_items_json`; no schema change was made.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, operational stock logic, operational waste movement logic.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

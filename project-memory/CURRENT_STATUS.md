# Current Status

## Current Version

`v2026.06.14.01`

## Last Known Commit Before Project Memory

`282d516 Extract orders UI module`

## Latest Commit Message

`Implement finished stock sale flow`

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

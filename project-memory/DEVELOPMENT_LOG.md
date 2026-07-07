# Development Log

### Add Desktop Launcher

- Date: 2026-07-05
- Commit: pending.
- Goal: allow the system to be started from a Windows Desktop icon without manually opening PowerShell.
- Change: added `start-2btex-desktop.ps1`; it checks port `3000`, starts `node start.js` only if the system is not already running, and opens `http://127.0.0.1:3000/`.
- Local setup: created `2B Tex نظام التشغيل.lnk` on the user's Desktop with the project icon.
- Not touched: SQLite schema/data, backend calculations, stock formulas, waste formulas, WhatsApp service, A5 service.

### Prefer Local Runtime Database on Startup

- Date: 2026-07-02
- Commit: pending.
- Version: `v2026.07.02.02`
- Issue: local startup used the bundled `backend/data/2btex.sqlite`, which caused login/data mismatch after moving the active system data under `server-data`.
- Change: `start.js` now prefers `server-data/2btex.sqlite` for local runtime when it exists.
- Verification: backend health reports the runtime DB path and the production user login succeeds.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: SQLite schema/data rows, backend calculations, stock formulas, waste formulas.

### Stabilize Start Gate Action Cards

- Date: 2026-07-02
- Commit: pending.
- Version: `v2026.07.02.02`
- Goal: keep the start screen complete and prevent missing action cards after cache or DOM drift.
- Change: added a startup guard that restores and orders the six start actions: operations dashboard, new order, pricing card, order search, reports, and smart follow-up center.
- Change: bumped the frontend `app.js` cache key to `20260702-02`.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: SQLite schema/data, backend calculations, stock formulas, waste formulas, WhatsApp service, A5 service.

### Fix Legacy Pricing Cost Card Availability

- Date: 2026-07-02
- Commit: pending.
- Version: `v2026.07.02.01`
- Goal: make old pricing cards show and build `عرض كرت التكلفة` the same way as new pricing cards.
- Change: kept strict pricing/order matching first, then added a safe unique same-number/same-customer fallback for legacy pricing cards.
- Change: normalized legacy pricing item fields, including snake_case fields, extra cost, currency, and exchange rate, before building cost reports.
- Change: bumped the frontend cache key to force browsers to load the fixed `app.js`.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: SQLite schema/data, backend calculations, stock formulas, waste formulas, WhatsApp service, A5 service.

### Update Weaving Document Layout

- Date: 2026-07-01
- Commit: pending.
- Version: `v2026.07.01.04`
- Goal: align the weaving order document with the production request stage before a raw issue exists.
- Change: removed `إذن الخام` from `أمر تشغيل نسيج`.
- Change: added prepared weight and prepared width to weaving operation data.
- Change: changed the weaving document header so the date appears alone, then customer and dyehouse, then the unified item descriptor.
- Change: bumped `styles.css`, `documents.js`, and `app.js` cache keys to `20260701-04`.
- Test: added operational-flow coverage for the new weaving document fields.
- Not touched: SQLite schema/data, backend endpoints, operational stock formulas, WhatsApp service, A5 service.

### Add Linked Pricing Cost Button

- Date: 2026-07-01
- Commit: pending.
- Version: `v2026.07.01.03`
- Goal: expose the internal costing card from the order documents sidebar beside the linked pricing-card actions.
- Change: added `عرض كرت التكلفة` when the selected order has a linked or matched pricing card.
- Change: wired the button to the existing `openPricingCostSheet` report.
- Change: bumped frontend cache keys to `20260701-03` and visible build time to `2026-07-01 18:22`.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: SQLite schema/data, backend endpoints, operational stock formulas, WhatsApp service, A5 service.

### Sync Frontend Cache Version

- Date: 2026-07-01
- Commit: pending.
- Version: `v2026.07.01.02`
- Goal: force browsers and Railway proxies to load the latest frontend files instead of stale June builds.
- Change: updated all `index.html` JavaScript cache keys to `20260701-02`.
- Change: updated the visible app build time to `2026-07-01 17:48`.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: SQLite schema/data, backend endpoints, operational stock formulas, WhatsApp service, A5 service.

### Fix Legacy Pricing Card Term Inheritance

- Date: 2026-07-01
- Commit: pending.
- Version: `v2026.07.01.02`
- Goal: ensure old pricing cards receive the latest accessory costing behavior without manually editing saved records.
- Change: grouped pricing-card items now inherit missing waste percent, deferred terms, and profit from the main card.
- Change: old single-line cards keep card-level accessory lines during calculation.
- Change: added an operational-flow regression guard for this backward compatibility.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: SQLite schema/data, backend endpoints, operational stock formulas, WhatsApp service, A5 service.

### Add Dyeing Document Pricing-Stage Regression Check

- Date: 2026-06-30
- Commit: pending.
- Version: `v2026.06.30.05`
- Goal: make it impossible for pricing-card stages to reappear in dyeing operation documents.
- Change: hard-disabled the legacy dyeing operation stages section function so it always returns empty HTML.
- Change: added an operational-flow regression check that injects old pricing stages and asserts they do not appear in the dyeing document.
- Change: updated the full operational test fixture to stop storing pricing dyeing stages in converted orders.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: SQLite schema/data, backend endpoints, calculations, stock/waste formulas, WhatsApp service, A5 service.

### Hard-Block Pricing Stages In Dyeing Orders

- Date: 2026-06-30
- Commit: pending.
- Version: `v2026.06.30.04`
- Goal: ensure dyeing operation orders never show pricing-card stages.
- Change: removed the stages section from dyeing document composition.
- Change: added a final UI guard that removes any `مراحل التشغيل` section from dyeing documents before preview/print, covering old cached/generated paths.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: SQLite schema/data, backend endpoints, calculations, stock/waste formulas, WhatsApp service, A5 service.

### Add Fixed Transport Pricing Stage

- Date: 2026-06-30
- Commit: pending.
- Version: `v2026.06.30.03`
- Goal: add a fixed transport cost row to pricing cards like the fixed packaging row.
- Change: pricing cards now always include `نقل` at `0.5` جنيه/كيلو as a read-only fixed dyeing/service stage.
- Change: stage normalization prevents duplicate fixed `تغليف` or `نقل` rows and corrects their fixed prices.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: SQLite schema/data, backend endpoints, calculations, stock/waste formulas, WhatsApp service, A5 service.

### Remove Pricing Stages From Dyeing Orders

- Date: 2026-06-30
- Commit: pending.
- Version: `v2026.06.30.02`
- Goal: keep dyeing operation documents operational only, without showing pricing-card stage data.
- Change: dyeing order documents ignore `operationNotes.dyeingStages`, including old orders that already had pricing stages saved.
- Change: pricing-card conversion no longer writes dyeing stages into order `operationNotes`.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: SQLite schema/data, backend endpoints, calculations, stock/waste formulas, WhatsApp service, A5 service.

### Fix Document Dialog Preview Isolation

- Date: 2026-06-30
- Commit: pending.
- Version: `v2026.06.30.01`
- Goal: restore clean operational document previews and PDF/print layout after generic mobile dialog rules affected the document modal.
- Change: added scoped final CSS overrides for `#documentDialog`, `#documentBody`, and `.document-sheet` so the toolbar stays outside the printable page and scrollbars stay on the preview body.
- Change: added print-scoped safeguards for normal documents while preserving sticker and orders-follow print modes.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: SQLite schema/data, backend endpoints, calculations, stock/waste formulas, WhatsApp service, A5 service.

### Add Finished Stock Transfer Between Orders

- Date: 2026-06-29
- Commit: `ebdeb660` then follow-up pending.
- Version: `v2026.06.29.03`
- Goal: allow transferring finished warehouse balance from one order/allocation to another without recording a customer sale.
- Change: added a warehouse transfer form that reuses the available finished-stock rows as the transfer source and a target order/allocation selector as the receiving side.
- Change: source movements are saved as `finished_transfer_out`; target movements are saved as finished receiving rows marked with `[finished-stock-transfer]`.
- Change: `warehouseOut` is now separate from actual `deliveredToCustomer`, so internal warehouse movement reduces stock but does not enter customer account delivery.
- Change: detailed reports, frontend summaries, and backend summaries use `warehouseOut` for warehouse balance while keeping customer delivery clean.
- Change: target order/allocation options now stay available even if the target already has warehouse balance, while same-source transfers remain blocked during save.
- Change: selecting a different source fabric refreshes both the source stock rows and target transfer list.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: SQLite schema/data, backend endpoints, dyehouse transfer logic, waste formulas, WhatsApp service, A5 service.

This file records important system changes. New entries should follow `CHANGE_TEMPLATE.md`.

## Known Important Changes

### Add Main Warehouse Stock Intake

- Date: 2026-06-29
- Commit: pending.
- Version: `v2026.06.29.01`
- Goal: let the operator start from the main warehouse when finished stock already exists, instead of forcing a quotation/customer order flow.
- Change: added a main warehouse intake form inside `بيع مجهز` for fabric, color, quantity, finished weight, width, inch, price, date, reference, and notes.
- Change: direct warehouse intake uses existing operational records internally: `WH-` order, allocation/color, and finished-receiving batch marked `[main-warehouse-stock]`.
- Change: direct stock appears in sellable warehouse balance and can be sold to any customer through the existing `بيع مجهز` flow.
- Change: internal warehouse stock records are hidden from the ordinary order list unless viewing warehouse stock or searching directly.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: SQLite schema/data, backend endpoints, `backend/calculations.js`, stock/waste formulas, dyehouse transfer logic, WhatsApp service, A5 service.

### Fix Document Print Preview Layout

- Date: 2026-06-28
- Commit: pending.
- Version: `v2026.06.28.02`
- Goal: repair the shared print/document preview that could show documents shifted, cropped, and mixed with nested scrollbars.
- Change: document dialog now uses one fixed viewport with a separate action bar and a scrollable document body.
- Change: printable sheets are centered in the preview and no longer own the horizontal scroll container.
- Change: mobile preview rules were aligned with the same document dialog model.
- Change: cache keys were updated for `styles.css` and `app.js`.
- Not touched: SQLite schema/data, backend endpoints, stock/waste formulas, movement save/rollback flows, WhatsApp service, A5 service.

### Add Accessory Raw Dyehouse Transfer Path

- Date: 2026-06-28
- Commit: pending.
- Version: `v2026.06.28.01`
- Goal: allow rib/accessory raw material to move between dyehouses without mixing it into cloth raw transfer calculations.
- Change: transfer dialog now exposes `نقل خام إكسسوار` when the order contains accessory lines.
- Change: accessory transfer availability uses actual sent accessory movements only; planned accessory quantities are not used as fallback.
- Change: accessory raw transfers are saved in the transfer log with `[accessory-transfer]` and shown separately in order movements and detailed reports.
- Change: cloth raw ledgers and dyehouse balances ignore accessory raw transfers.
- Test: regression check added for accessory transfer marker, UI choice, actual accessory source, and report separation.
- Not touched: SQLite schema/data, backend endpoints, stock save/rollback flows, cloth raw transfer logic, waste formulas, WhatsApp service, A5 service.

### Recalculate Displayed Waste Percent From Finished Weight

- Date: 2026-06-24
- Commit: pending.
- Version: `v2026.06.24.05`
- Goal: remove the remaining stale display path that could show old waste percent logic on existing orders.
- Change: order detail allocation rows, waste documents, and management reports now calculate displayed actual waste percent from actual waste / finished received.
- Change: existing stored old percentages are still kept as historical data, but are not used for display when actual waste and finished received are available.
- Change: regression check now fails if display layers print stale stored allocation waste percent.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: SQLite schema/data, backend endpoints, movement save/rollback flows, stock balance formulas, WhatsApp service, A5 service.

### Document Official Workspace And Memory Rule

- Date: 2026-06-24
- Version: `v2026.06.24.04`
- Goal: consolidate development around one clean local project folder and make project-memory updates mandatory.
- Change: official local workspace is now `D:\Codex\2B TEX`.
- Change: previous project folder `D:\2B Tex نظام التشغيل` was deleted after verifying the official workspace, except for locked `cloudflared.exe`.
- Note: the remaining old `cloudflared.exe` is owned by the Windows service `Cloudflared agent` and requires Administrator PowerShell to stop/delete.
- Change: `README_FOR_CODEX.md` and `SAFE_CHANGE_RULES.md` now require updating `project-memory/` after every future change.
- Not touched: SQLite schema/data, production data, backend calculations, stock formulas, movement save/rollback flows.

### Apply Operational Waste To Legacy Pricing Cards

- Date: 2026-06-24
- Version: `v2026.06.24.03`
- Goal: remove the old pricing-card waste behavior from existing/legacy orders without migrating or rewriting SQLite data.
- Change: `calculatePricing()` now normalizes linked pricing cards with the order-calculated actual waste percent before any pricing display, print, edit, or report path uses them.
- Change: multi-item pricing cards match each pricing item to its linked order by fabric, dyehouse, and quantity where possible.
- Change: direct pricing-list rows and pricing edit forms use the same runtime normalization.
- Note: copied the full current project workspace to `D:\Codex\2B TEX` as requested, without deleting extra destination files.
- Not touched: SQLite schema/data, stock balance formulas, movement save/rollback flows, WhatsApp service, A5 service.

### Refresh Pricing Cards From Operational Waste Percent

- Date: 2026-06-24
- Version: `v2026.06.24.02`
- Goal: complete the waste-basis review so pricing cards opened from running/closed orders do not keep using only expected waste.
- Change: `pricingDraftFromOrder()` now prefers calculated actual waste percent when actual waste exists, then falls back to expected waste.
- Change: linked/matched pricing cards shown from an order refresh their displayed waste percent from the order calculation.
- Verification: added operational-flow assertions that protect this pricing UI route.
- Not touched: SQLite schema/data, stock balance formulas, movement save/rollback flows, WhatsApp service, A5 service.

### Calculate Actual Waste Percent On Finished Weight

- Date: 2026-06-24
- Version: `v2026.06.24.01`
- Goal: make operational waste match factory costing by calculating the actual waste percentage on the finished received kilo, not on raw sent to the dyehouse.
- Change: frontend order/allocation waste percent now uses `actual waste kg / finished received kg`.
- Change: backend order summaries now use the same finished-weight denominator.
- Rule: actual waste kg remains `raw sent to dyehouse - finished received - raw returned`; only the percentage denominator changed.
- Verification: added operational-flow assertions for frontend/backend parity on the new waste percentage basis.
- Not touched: SQLite schema/data, movement save/rollback flows, stock balance formulas, pricing cost-basis options, WhatsApp service, A5 service.

### Improve Mobile-First Workspace Layout

- Date: 2026-06-18
- Version: `v2026.06.18.16`
- Goal: make the current system easier to operate on mobile without changing operational behavior.
- Change: added a mobile-only CSS layer that keeps the main workspace inside the phone viewport and reduces horizontal scrolling.
- Change: mobile card tables now receive missing `data-label` values from their headers automatically, so rendered rows become readable cards on phones.
- Change: filters, actions, dialogs, order detail tabs, pricing forms, operation cards, and AI panels collapse to safer single-column mobile layouts.
- Change: mobile menu button text is now `القائمة`, and CSS/app cache keys were updated.
- Verification: `npm run check` passes and operational flow check passes.
- Not touched: `backend/calculations.js`, SQLite schema/data, backend endpoints, stock formulas, waste formulas, operational save/rollback flows, AI backend, WhatsApp service, A5 service.

### Expand AI Employee Direct Operational Commands

- Date: 2026-06-18
- Version: `v2026.06.18.15`
- Goal: make the 2B smart employee answer factory commands from system data instead of falling back to generic model responses.
- Change: added deterministic direct reports for order lookup, dyehouse balance, ready-to-deliver/warehouse balance, delayed orders, and waste.
- Change: `/api/ai/employee-report` now uses the enhanced direct command layer before Gemini/OpenAI.
- Verification: added operational-flow assertions to keep the direct command layer wired into the employee endpoint.
- Not touched: `backend/calculations.js`, SQLite schema/data, stock formulas, waste formulas, WhatsApp service internals, A5 service internals.

### Expose Dyehouse Ledger Helper In Frontend UI

- Date: 2026-06-18
- Version: `v2026.06.18.14`
- Goal: make the order-details UI use an explicit dyehouse ledger helper instead of hiding the source/target transfer logic inside scoped row naming.
- Change: added `dyehouseLedgerSegmentsForAllocation()` in `app.js`.
- Change: the legacy `scopedDyehouseSegmentsForAllocation()` wrapper now delegates to the explicit ledger helper to preserve current call sites.
- Verification: added operational-flow assertions so UI ledger logic cannot drift from the explicit helper.
- Not touched: `backend/calculations.js`, SQLite schema/data, backend endpoints, stock formulas, waste formulas, AI backend, WhatsApp, A5.

### Unify Dyehouse Document Balance Ledger

- Date: 2026-06-18
- Version: `v2026.06.18.13`
- Goal: make dyeing documents and detailed reports read raw dyehouse transfers from one source/target ledger.
- Change: added a document-side dyehouse ledger that starts with the allocation quantity in the source dyehouse, subtracts raw transfers out, and adds raw transfers into target dyehouses.
- Change: scoped dyehouse quantities now come from this ledger instead of separate raw-in/raw-out branches.
- Verification: added operational-flow assertion for the unified document ledger and kept existing source/target split tests.
- Not touched: `backend/calculations.js`, SQLite schema/data, backend endpoints, stock formulas, waste formulas, AI backend, WhatsApp, A5.

### Recover Unreadable Order Fabric Names From Pricing Cards

- Date: 2026-06-18
- Version: `v2026.06.18.12`
- Goal: prevent order lists and operational screens from showing unreadable `???` fabric names when production data returns corrupted display text.
- Change: added unreadable-text detection for operational names.
- Change: after backend load, orders with unreadable fabric names recover the readable fabric name from their matching pricing card by order number and customer.
- Safety: if an order number has multiple pricing cards and no safe customer match, the system does not guess.
- Verification: added operational-flow assertions for the recovery hook.
- Not touched: `backend/calculations.js`, SQLite schema/data, backend endpoints, stock formulas, waste formulas, AI backend, WhatsApp, A5.

### Show Accessories In Raw Dyehouse Transfer Context

- Date: 2026-06-18
- Version: `v2026.06.18.11`
- Goal: keep accessories visible when moving raw balance between dyehouses.
- Change: split dyehouse rows now scale accessory quantities according to the displayed raw quantity.
- Change: raw dyehouse transfer buttons carry and confirm the related accessory summary before saving.
- Change: the transfer reason stores the accessory summary as an operational reference.
- Verification: `npm run check` passes and operational flow check passes.
- Not touched: `backend/calculations.js`, SQLite schema/data, backend endpoints, stock formulas, waste formulas, AI backend, WhatsApp, A5.

### Fix Raw Dyehouse Transfer Source Context

- Date: 2026-06-18
- Version: `v2026.06.18.10`
- Goal: make `نقل خام` work from the actual dyehouse row shown in order details.
- Change: scoped order-detail transfer buttons now carry the displayed source dyehouse and available row quantity.
- Change: raw dyehouse transfer prompts and validation use that displayed source context before falling back to the allocation dyehouse.
- Verification: `npm run check` passes and operational flow check passes.
- Not touched: `backend/calculations.js`, SQLite schema/data, backend endpoints, stock formulas, waste formulas, AI backend, WhatsApp, A5.

### Add Operational AI Command Reports And WhatsApp Diagnostics

- Date: 2026-06-18
- Version: `v2026.06.18.09`
- Goal: make the 2B smart employee answer real operational commands instead of generic chat.
- Change: `/api/ai/employee-report` now detects direct commands before Gemini/OpenAI.
- Change: `حساب + اسم العميل` returns a customer ledger-style summary from system customer accounts, delivery invoices, finished-stock sales, payments, and opening balance.
- Change: `تحويل / تحويلات + اسم المصبغة` returns dyehouse transfer history and balance context.
- Change: `واتساب / إرسال التقارير` returns outbox status and send-risk recommendations.
- Change: WhatsApp service status now reports sending blockers: automatic sending disabled, WhatsApp not connected, no pending reports, or target group not linked.
- Change: WhatsApp settings UI displays send diagnostics and outbox counts.
- Verification: `npm run check` passes and operational flow check passes.
- Not touched: `backend/calculations.js`, SQLite schema/data, stock formulas, waste formulas, A5 service.

### Enable Real AI Employee Model Grounding

- Date: 2026-06-18
- Version: `v2026.06.18.01`
- Goal: make the smart employee use a real AI model for 2B when credentials are available, without returning generic or invented answers.
- Change: Railway variables were checked by name only and include `GEMINI_API_KEY`, `GEMINI_MODEL`, and `OPENAI_API_KEY`.
- Change: `/api/ai/employee-report` now builds a compact 2B operational payload and uses Gemini first, OpenAI second, and deterministic operational rules as fallback.
- Change: model answers are grounded by `rulesBaseline`, so calculated quantities, order scope, and focused-question limits remain controlled by the system.
- Verification coverage: added operational-flow assertions for the real AI model path, Gemini/OpenAI support, and grounding rules.
- Not touched: backend calculations, SQLite schema/data, WhatsApp, A5.

### Fix Pricing List Navigation

- Date: 2026-06-17
- Version: `v2026.06.17.17`
- Goal: make the `عروض الأسعار` sidebar action reliably open the pricing list screen.
- Change: pricing list navigation now explicitly renders the pricing table after switching to the pricing workspace.
- Verification coverage: added a regression assertion that the pricing list navigation calls `renderPricings`.
- Not touched: backend calculations, backend server endpoints, SQLite schema/data, AI backend, WhatsApp, A5.

### Show Dyehouse Transfer Type Choices First

- Date: 2026-06-17
- Version: `v2026.06.17.16`
- Goal: prevent confusion between physical raw transfer and color/allocation transfer.
- Change: pressing `نقل مصبغة` now first asks the user to choose either `نقل خام` or `نقل لون`.
- Change: the existing save logic remains separated by transfer mode: raw transfers keep the allocation in the source dyehouse, while color transfers can move/split the allocation.
- Verification coverage: added a regression assertion for the visible raw/color choice prompt.
- Not touched: backend calculations, backend server endpoints, SQLite schema/data, AI backend, WhatsApp, A5.

### Split Order Detail Dyehouse Balances

- Date: 2026-06-17
- Version: `v2026.06.17.15`
- Goal: make the order detail color/balance screen show the same dyehouse split that the detailed report now shows.
- Change: the `الألوان والرصيد` table now renders scoped dyehouse rows instead of direct allocation rows when a physical raw transfer splits one width/color between dyehouses.
- Change: source dyehouses keep their remaining raw quantity and target dyehouses show only the transferred quantity.
- Verification coverage: added source-level assertions so the UI table keeps using scoped dyehouse rows and rejects foreign transfers.
- Not touched: backend calculations, backend server endpoints, SQLite schema/data, AI backend, WhatsApp, A5.

### Harden Detailed Report Transfer Ownership

- Date: 2026-06-17
- Version: `v2026.06.17.14`
- Goal: stop detailed reports from showing dyehouse transfers that belong to another operational order, especially when order numbers are repeated.
- Change: tightened document transfer ownership checks to require the current internal order id and valid allocation links when transfer rows carry allocation ids.
- Change: kept physical raw transfer distribution for the current order so source and target dyehouse balances both remain visible.
- Verification coverage: added regression assertions for foreign transfer rejection, bad migrated transfer rejection, and single-allocation 1,000 -> 700/300 dyehouse split.
- Not touched: backend calculations, backend server endpoints, SQLite schema/data, AI backend, WhatsApp, A5.

### Show Dyehouse Balance Distribution In Detailed Report

- Date: 2026-06-17
- Version: `v2026.06.17.13`
- Goal: make detailed reports show how a physical raw transfer splits the same order between dyehouses.
- Change: added a dyehouse distribution section to the detailed report.
- Change: raw-transfer document calculations are scoped to the current order before distributing source and target dyehouse balances.
- Example: 1,000 kg at Geima and 300 kg transferred to New Geima displays Geima 700 kg and New Geima 300 kg.
- Verification coverage: added a regression assertion for the 1,000 -> 700/300 split.
- Not touched: backend calculations, backend server endpoints, SQLite schema/data, AI backend, WhatsApp, A5.

### Scope Detailed Report Transfers To Current Order

- Date: 2026-06-17
- Version: `v2026.06.17.12`
- Goal: prevent dyehouse transfers from unrelated orders appearing in a detailed order report.
- Change: detailed report transfer history now filters transfers by current order id, with allocation id fallback for older records.
- Verification coverage: added a regression assertion that a foreign order transfer is hidden from the current order report.
- Not touched: backend calculations, backend server endpoints, SQLite schema/data, AI backend, WhatsApp, A5.

### Fix Detailed Report Movements And Balances

- Date: 2026-06-17
- Version: `v2026.06.17.11`
- Goal: make the detailed report show the real operational state, not an empty or partial report.
- Change: full report rendering now receives the live movement collections from the documents UI.
- Change: the detailed color plan now includes dyehouse, finished received, customer delivered, warehouse balance, and actual waste.
- Change: the report summary now includes actual dyehouse balance, warehouse balance, delivered quantity, and waste values.
- Verification coverage: added regression assertions for color plan, dyehouse balance, warehouse balance, and transfer history.
- Not touched: backend calculations, backend server endpoints, SQLite schema/data, AI backend, WhatsApp, A5.

### Restore Transfer History In Detailed Report

- Date: 2026-06-17
- Version: `v2026.06.17.10`
- Goal: bring dyehouse transfer history back into the detailed order report with each transfer date.
- Change: the detailed report now includes a dedicated dyehouse transfers section after the color table.
- Change: the section shows transfer date, type, source dyehouse, target dyehouse, color/width label, quantity, note number, and notes.
- Verification coverage: added regression assertions that detailed reports include the transfer section, date, source/target dyehouses, and transfer quantity.
- Not touched: backend calculations, backend server endpoints, SQLite schema/data, AI backend, WhatsApp, A5.

### Keep Source Dyehouse Visible After Partial Raw Transfer

- Date: 2026-06-17
- Version: `v2026.06.17.09`
- Goal: show both dyehouses after a partial raw balance transfer, not only the receiving dyehouse.
- Change: dyeing document picker now includes transfer source and target dyehouses.
- Change: picker totals use scoped transfer quantities so the target shows incoming raw and the source shows remaining raw.
- Verification coverage: added a regression assertion for the source dyehouse remaining quantity after legacy partial raw transfer.
- Not touched: backend calculations, backend server endpoints, SQLite schema/data, AI backend, WhatsApp, A5.

### Restore Individual Order Movement Forms

- Date: 2026-06-17
- Version: `v2026.06.17.08`
- Goal: keep raw returns, finished receiving, and customer delivery visible after adding combined movement shortcuts.
- Change: combined movement shortcuts no longer hide the original single-entry movement forms.
- Change: added a small UI note that individual forms remain available for returns or quick movement.
- Change: updated `app.js` cache busting so the browser loads the corrected frontend.
- Not touched: backend calculations, backend server endpoints, SQLite schema/data, AI backend, WhatsApp, A5.

### Scope Legacy Partial Dyehouse Transfers By Quantity

- Date: 2026-06-17
- Version: `v2026.06.17.07`
- Goal: stop old partial dyehouse balance transfers from making the whole color/width look transferred.
- Change: legacy unmarked transfers with quantity lower than the source allocation quantity are treated as physical raw transfers.
- Change: dyeing operation documents now scope each dyehouse row by the actual transferred quantity, keeping the source balance separate from the target balance.
- Change: allocation runtime balances prefer actual incoming raw-transfer quantity for old partial transfers that previously moved the allocation label.
- Verification coverage: added a regression case for old partial transfers without explicit markers.
- Not touched: backend calculations, backend server endpoints, SQLite schema/data, AI backend, WhatsApp, A5.

### Prioritize Allocation Dyehouse Transfers Over Raw Text

- Date: 2026-06-17
- Version: `v2026.06.17.06`
- Goal: stop color/allocation transfers from appearing as fabric/raw transfer when their note text includes old wording such as `خروج خام`.
- Change: explicit `[allocation-transfer]` now overrides raw-transfer text detection in the frontend and document builders.
- Change: startup repair uses the normalized transfer kind instead of stale local mode values.
- Change: dyeing documents apply the same precedence so color transfers do not affect physical raw transfer totals.
- Verification coverage: expanded transfer-kind regression checks for allocation marker precedence.
- Not touched: backend calculations, backend server endpoints, SQLite schema/data, AI backend, WhatsApp, A5.

### Classify Legacy Raw Dyehouse Transfers Safely

- Date: 2026-06-17
- Version: `v2026.06.17.05`
- Goal: prevent old dyehouse transfers such as `خروج خام - تحويل مصبغة` from being interpreted as full allocation/color transfer.
- Change: legacy transfer notes containing `خروج خام` or `نقل خام` are classified as physical raw transfers.
- Change: raw-transfer startup repair keeps the allocation assigned to its source dyehouse, while allocation-transfer records still move/split allocations.
- Change: dyeing documents recognize the same legacy raw-transfer text so old transfer records do not distort dyehouse totals.
- Verification coverage: expanded transfer-kind regression checks to cover legacy raw-transfer text and allocation ownership repair.
- Not touched: backend calculations, backend server endpoints, SQLite schema/data, AI backend, WhatsApp, A5.

### Separate Dyehouse Transfer Types And Scoped Dyeing Totals

- Date: 2026-06-17
- Version: `v2026.06.17.04`
- Goal: prevent dyeing operation documents and dyehouse balances from mixing physical raw movement with allocation/color reassignment.
- Change: dyeing operation document header raw total is now scoped to the selected dyehouse rows.
- Change: dyeing operation raw balance now prefers the operational balance of the selected dyehouse rows before movement fallback.
- Change: dyehouse transfer UI now asks whether the user is moving raw physically or moving the color/allocation inside the order.
- Change: physical raw transfer records do not update/split allocations; allocation transfer records keep the existing split/full allocation behavior.
- Verification coverage: added regression checks for scoped dyeing totals and separated transfer kinds.
- Not touched: backend calculations, backend server endpoints, SQLite schema/data, AI backend, WhatsApp, A5.

### Show Width Labels Across Multi-Width Order Operations

- Date: 2026-06-17
- Version: `v2026.06.17.03`
- Goal: make every operational row in orders with multiple widths clearly show which عرض it belongs to.
- Change: added shared allocation width/movement label helpers in the frontend.
- Change: color-plan rows now show the full allocation width label instead of only the finished width number.
- Change: raw returns, finished receiving, accessory receiving, and dyehouse transfer history now include the related color/dyehouse/width label.
- Verification coverage: added an operational-flow regression check for multi-width labels across plan rows and movement rows.
- Not touched: backend calculations, backend server endpoints, SQLite schema/data, stock formulas, waste formulas, AI backend, WhatsApp, A5.

### Fix Multi-Dyehouse Dyeing Document Totals

- Date: 2026-06-17
- Version: `v2026.06.17.02`
- Goal: keep each dyeing operation document limited to the selected dyehouse when one order is split across multiple dyehouses.
- Root cause: the dyeing document balance path could use order-level raw movement totals for the original dyehouse and could over-filter non-original dyehouses unless a transfer record matched the color/allocation.
- Change: dyeing documents now select allocations by the requested dyehouse name first, with transfer matching only as a fallback.
- Change: raw balance in the document now starts from the selected dyehouse allocation `sentToDyehouse` quantities before falling back to movement rows.
- Verification coverage: added a regression check for a Geima/New Geima split order so each document shows only its own colors, planned total, and raw balance.
- Not touched: backend calculations, backend server endpoints, SQLite schema/data, stock formulas, waste formulas, AI backend, WhatsApp, A5.

### Fix Pricing Card Edit Save Button

- Date: 2026-06-17
- Version: `v2026.06.17.01`
- Goal: make edited pricing cards save reliably after the grouped pricing verification fix.
- Root cause: legacy hidden pricing fields still had native `required` validation in the dialog, which could stop the browser before the JavaScript save handler executed.
- Change: added an explicit `savePricingBtn` button with `type="button"` and wired it directly to the pricing save handler.
- Change: disabled legacy hidden pricing fields and removed their `required` attributes when the pricing-card editor is installed.
- Change: added pricing-card-level validation for customer, at least one item line, fabric name, and quantity.
- Verification coverage: `operational-flow-check` now asserts the explicit save button, disabled legacy fields, and app-level pricing validation.
- Not touched: backend calculations, backend server endpoints, SQLite schema/data, stock formulas, waste formulas, AI backend, WhatsApp, A5.

### Fix Pricing Card Order Linkage And Filters

- Date: 2026-06-15
- Version: `v2026.06.15.25`
- Goal: make pricing cards connected to real operational orders use the real order number and make the pricing list usable as an independent list.
- Change: pricing cards opened from an existing order now keep the order number instead of receiving a new automatic pricing number.
- Change: the pricing list now has search, customer filter, status filter, and filtered print.
- Change: filtered pricing print includes the linked operational order number when available.
- Railway data cleanup: linked pricing cards were aligned to their order numbers, and duplicate unlinked pricing rows were removed/left absent while preserving referenced pricing cards.
- Verification: `npm run check` passed and Operational flow check passed.
- Not touched: backend calculations, SQLite schema, local SQLite data, stock formulas, waste formulas, AI backend, WhatsApp, A5.

### Fix Packaging Pricing Stage

- Date: 2026-06-15
- Version: `v2026.06.15.24`
- Goal: keep packaging as a standard dyeing-stage cost in every pricing card.
- Change: pricing item dyeing stages now always include a fixed `تغليف` row.
- Change: `تغليف` is fixed at `2 جنيه`, read-only, and has no delete action.
- Change: existing pricing items get the fixed row when opened or saved, without duplicating it if it already exists.
- Not touched: backend calculations, SQLite schema/data, stock formulas, waste formulas, AI backend, WhatsApp, A5.

### Separate Active And Linked Pricing Cards

- Date: 2026-06-15
- Version: `v2026.06.15.23`
- Goal: separate pricing cards that are still only quotations from pricing cards already linked to operational orders.
- Change: the pricing list now has an active section and a linked-to-order section.
- Change: linked pricing cards show `فتح الطلب` and do not show another conversion button, preventing duplicate operational orders.
- Change: safe local data correction linked converted pricing cards to orders only when the match was exact and unambiguous by order number and customer.
- Note: ambiguous customer-name differences are not force-written to SQLite; the UI matching layer handles compatible names and fabric wording for display/linkage.
- Not touched: backend calculations, SQLite schema, stock formulas, waste formulas, AI backend, WhatsApp, A5.

### Fix Quotation Pricing Linkage And Conversion Labels

- Date: 2026-06-15
- Version: `v2026.06.15.22`
- Goal: prevent quotations opened from an order from losing USD pricing and showing zero totals.
- Change: when an order has a linked or matching pricing card, the quotation document opens from the pricing card instead of the order fallback.
- Change: pricing-card conversion is labelled as `تحويل لطلب تشغيل`, and linked/converted cards do not show a duplicate conversion button in the quotation document.
- Fallback: if no pricing card exists, the old order-based quotation remains available.
- Not touched: SQLite schema/data, pricing formulas, stock formulas, operational waste formulas, backend save/rollback flows.

### Add Grouped Raw And Finished Pricing View

- Date: 2026-06-15
- Version: `v2026.06.15.21`
- Goal: make the pricing screen show the full price history for each raw/fabric item in one place.
- Change: pricing cards are grouped by fabric/raw item, with customer/card lines underneath each group.
- UI: each line shows raw price, finished price, quantity, customer, dyehouse, total contract, and actions.
- Not touched: SQLite schema/data, pricing formulas, stock formulas, operational waste formulas, backend save/rollback flows.

### Match USD Pricing To Excel Calculation

- Date: 2026-06-15
- Version: `v2026.06.15.20`
- Goal: make USD pricing cards match the factory Excel sheet.
- Change: USD cards now convert raw USD to EGP, add EGP dyeing/finishing/waste/deferred/profit, round EGP cost per kg, then convert final selling price back to USD.
- UI: added a pricing formula preview and moved currency badges beside fields so numbers stay readable.
- Regression: raw `$4.4`, rate `52`, processing `80 EGP`, net waste `10%`, profit `33 EGP` must produce `$7.02`.
- Not touched: SQLite schema/data, stock formulas, operational waste formulas, backend save/rollback flows.

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

### Add Pricing Accessory Stage Selection

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.02`
- Goal: let accessory raw items inherit selected operation-stage costs from the fabric dyeing table when needed.
- Change: each accessory row now shows selectable stage checkboxes generated from the same pricing-card dyeing-stage rows.
- Rule: checked stages are added to the accessory raw unit price only.
- Rule: accessory total is `quantity * (raw unit price + selected stage prices)`.
- Rule: selected accessory stages do not change the fabric kilo price, production cost, waste cost, or deferred-payment cost.
- Customer quotation remains clean and does not expose internal stage costs.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, operational stock logic, operational waste movement logic.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Show Accessories As Quotation Sub-Lines

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.03`
- Goal: make customer quotations commercially clear when a fabric item includes accessories.
- Change: fabric row now shows fabric-only quantity, kilo price, and total.
- Change: accessories appear directly below the fabric row with accessory type, quantity, unit price, and total.
- Rule: customer quotation summary total remains inclusive of fabric plus accessories.
- Rule: internal dyeing-stage costs remain hidden from the customer-facing quotation.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Add Pricing Currency And Active Order Pricing Drafts

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.04`
- Goal: support pricing cards for already-running orders and allow customer quotation values in pound or dollar.
- Change: active orders use the existing `openPricingForOrder` flow from the documents panel; if no linked pricing exists, a draft pricing card is created from the order and linked after save.
- Change: added pricing-card currency selection with `EGP` and `USD`.
- Compatibility: currency is persisted inside `pricing_items_json` without SQLite schema changes.
- Change: pricing list, preview, and customer quotation display the selected currency.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

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

### Improve Customer Quotation Print Layout

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.05`
- Goal: make the printed customer quotation organized, readable, and free from internal costing details.
- Change: added a compact customer quotation print layout with a fixed-width item table.
- Change: displayed fabric as the main commercial row and accessories as sub-lines underneath with quantity, unit price, and total.
- Change: added currency to the quotation metadata strip.
- Change: preserved the customer-facing cleanup: no raw fabric cost, dyeing-stage table, waste, deferred-payment cost, or profit in the printed offer.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, pricing formulas, operational stock logic, operational waste movement logic.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Prepare Orders From Pricing Cards

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.06`
- Goal: make `تنزيل طلب` prepare the order from the updated pricing-card data so the user only reviews and saves.
- Change: added a frontend conversion helper from pricing-card item to order draft.
- Change: the order form now receives accessory lines from the selected pricing item instead of opening empty accessory fields.
- Change: grouped pricing cards now preserve per-item dyehouse, waste percent, raw cost, accessory lines, and dyeing operation stages when saved as grouped orders.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, pricing formulas, operational stock logic, operational waste movement logic.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Clean Quotation Print Summary

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.07`
- Goal: improve the printed quotation summary without removing the item-table kilo price.
- Change: removed only the separate `سعر الكيلو` KPI from beside `إجمالي العقد`.
- Change: kept the `سعر الكيلو` column inside the quotation item table.
- Change: centered and emphasized the contract total card for cleaner print/PDF output.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, pricing formulas, operational stock logic, operational waste movement logic.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Prepare Save-Only Order Conversion Mode

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.08`
- Goal: make orders opened from pricing cards ready to save with no duplicated fields.
- Change: added a dedicated order-form mode for pricing-card conversion.
- Change: prefilled missing weaving source with `من كرت التسعير` so required fields do not block saving.
- Change: hid duplicate visual fields during conversion: legacy accessory summary fields, one-item grouped-order box, and duplicated primary grouped row for multi-item pricing cards.
- Change: normal new/edit order flows reset conversion mode and keep the full form.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, pricing formulas, save endpoints, operational stock logic, operational waste movement logic.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Unify Order Form And Pricing Source Flow

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.09`
- Goal: make the cleaned order form the standard form in every case and make pricing-to-order conversion preserve all grouped item data.
- Change: added `مصدر النسيج` to the pricing card flow without changing the database schema.
- Change: stored pricing weaving source inside each pricing item in `pricing_items_json`.
- Change: pricing-to-order conversion now keeps full converted order drafts for grouped pricing cards.
- Change: grouped order save uses those full drafts so every item keeps its own dyehouse, weaving source, accessory lines, raw cost, waste percent, kilo price, and dyeing stages.
- Change: legacy accessory summary fields and the duplicated primary grouped-order row are hidden as the default order form behavior.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema, pricing formulas, save endpoints, operational stock logic, operational waste movement logic.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Execute Full System Cleanup Safe Frontend Steps

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.10`
- Goal: execute the safe cleanup items from `Full System Cleanup Plan.pdf` without touching backend, calculations, database, or operational save flows.
- Change: removed a duplicate `weavingSource` key from pricing-to-order conversion while preserving the existing effective value order.
- Change: replaced pricing-card row HTML `.replace(...)` injection with direct weaving-source field markup.
- Change: expanded `npm run check` so shared frontend files are syntax-checked: `documents.js`, `orders.js`, and `pricing.js`.
- Change: made `pricing.js` the single official frontend pricing source loaded by `index.html`.
- Change: deleted confirmed unused legacy compatibility bundles not loaded by `index.html`: `compat/app.js`, `compat/orders.js`, and `compat/documents.js`.
- Change: deleted duplicated pricing compatibility source `compat/pricing.js` after switching the app to load `pricing.js` directly.
- Kept: `compat/polyfills.js` because it is still loaded by the app.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema/data, stock formulas, waste formulas, persistence/rollback flows, AI backend, WhatsApp service, A5 service.
- Test: `npm run check` passed locally, including `Operational flow check passed`.

### Harden Full Operational Test Coverage

- Date: 2026-06-15
- Commit: pending.
- Goal: make the full operational test catch pricing-source regressions after unifying frontend pricing on `pricing.js`.
- Change: `scripts/full-operational-test.js` now loads `pricing.js` directly and verifies pricing calculation, accessory total, gross waste basis, and monthly deferred-payment rule.
- Verified locally with a real test cycle named `تيست`: customer quotation, grouped order with two items under the same order number, dyehouse dispatch, raw return, dyehouse transfer, finished receiving, customer delivery, accessory movement, close/waste calculation, and operational documents.
- Test: local full operational test passed against `http://127.0.0.1:3050`.

### Stabilize Pricing Flow, Navigation, And Regression Test

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.11`
- Goal: execute the three approved paths together: stabilize pricing-card-to-order flow, reduce duplicated navigation, and harden regression testing.
- Change: removed the hidden top ERP menu markup from `index.html`; Sidebar and home task cards are now the only navigation layers.
- Change: bumped the app version and app script cache key to `v2026.06.15.11`.
- Change: expanded `scripts/full-operational-test.js` so the seeded quotation uses `pricing_items_json` with two pricing-card lines, dyeing stages, accessory raw-item lines, selected accessory stages, and currency data.
- Change: the full operational test now verifies persisted pricing-card items, accessory stage pricing, grouped-order second item preservation, per-item dyehouse/quantity, and dyeing operation stages in the dyeing production order.
- Finding: local backend must be restarted after migrations if an old server process was already running; otherwise the live process may still use an old SQLite schema.
- Not touched: `backend/calculations.js`, stock formulas, waste formulas, operational save formulas, AI backend, WhatsApp service, A5 service.
- Test: `npm run check` passed locally, including `Operational flow check passed`.
- Test: full operational test passed locally against `http://127.0.0.1:3050` after restarting the local backend with the current migration code.

### Fix Finished Sale Panel Visibility

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.12`
- Goal: opening the main operations dashboard must not show the full finished-stock sale form.
- Change: `finishedSalePanel` is created hidden by default and synchronized with the active workspace module immediately after dynamic insertion.
- Change: bumped the app version and app script cache key to `v2026.06.15.12`.
- Not touched: backend, SQLite schema/data, stock formulas, waste formulas, operational save/rollback flows, AI backend, WhatsApp service, A5 service.

### Fix Pricing Card Edit Matching

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.13`
- Goal: editing or creating a pricing card from an order must not open a pricing card belonging to another order/customer with the same number.
- Change: pricing-card/order matching now requires explicit `pricingId`, or order number plus compatible customer name plus compatible fabric name.
- Change: hardened pricing-table event handling with `closest(...)` so nested clicks cannot pass the wrong target.
- Change: added explicit handlers for quotation-document `تعديل` and `تنزيل طلب` buttons.
- Not touched: backend, SQLite schema/data, stock formulas, waste formulas, operational save/rollback flows, AI backend, WhatsApp service, A5 service.

### Add USD Pricing Exchange Rate

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.14`
- Goal: USD pricing must not add EGP dyeing/finishing costs directly to USD raw-fabric prices.
- Change: added `سعر الدولار اليوم` to pricing cards when currency is USD.
- Change: converted dyeing, finishing, and selected accessory-stage costs from EGP to USD before pricing calculation when USD is selected.
- Change: stored the exchange rate in `pricing_items_json`; no database schema change.
- Not touched: backend, SQLite schema/data, stock formulas, waste formulas, operational save/rollback flows, AI backend, WhatsApp service, A5 service.

### Fix Bulk Raw Dispatch For Dyehouse

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.15`
- Goal: keep raw dispatch to dyehouse as one order/dyehouse issue, not one issue per color.
- Change: the bulk raw-dispatch screen now groups cloth rows by dyehouse and shows `كل الألوان` / `كل العروض` with the remaining total quantity.
- Change: new raw-dispatch saves are order-level records with empty `allocationId`; allocation distribution remains calculated from the color plan.
- Change: preserved support for old allocation-linked raw records so previous data stays readable.
- Test: added an operational-flow regression that one 3000 kg raw issue against two 1500 kg colors distributes to both colors by plan.
- Not touched: backend, SQLite schema/data, pricing formulas, waste formulas, AI backend, WhatsApp service, A5 service.

### Fix Body Label Display For Accessory Orders Only

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.16`
- Goal: the `جسم` label must appear only when an order includes accessories.
- Change: updated the shared warehouse `stockFlowText` helper so plain fabric-only orders show just the quantity.
- Change: updated document fallback rendering with the same rule.
- Change: accessory orders continue to show `جسم` plus the accessory type/quantity.
- Test: added operational-flow document regression for both no-accessory and accessory dyeing documents.
- Not touched: backend, SQLite schema/data, stock formulas, waste formulas, pricing formulas, AI backend, WhatsApp service, A5 service.

### Clean Raw Warehouse Terminology

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.17`
- Goal: align the UI and AI wording with the operating principle that there is no separate raw-fabric warehouse.
- Change: dashboard totals now avoid the misleading raw-received card and show raw issued to dyehouse, inside dyehouse, finished entered warehouse, ready for delivery, delivered, and actual waste.
- Change: order details now call dyehouse balance `داخل المصبغة` and finished receipt `مجهز دخل المخزن`.
- Change: AI stage analysis no longer exposes a standalone `ready-to-dyehouse` stage; raw not yet issued stays under weaving / not issued to dyehouse.
- Test: added an operational-flow regression to prevent reintroducing raw-warehouse dashboard/AI terminology.
- Not touched: SQLite schema/data, `backend/calculations.js`, stock formulas, waste formulas, pricing formulas, operational save/rollback flows.

### Fix USD Pricing Profit Conversion

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.18`
- Goal: when pricing in USD, EGP-entered profit margin must not be added directly as dollars.
- Change: `pricing.js` now converts `profitPerKg` from EGP to USD using the pricing exchange rate before adding it to the USD sell price.
- Test: added an operational-flow regression proving 30 EGP profit at exchange rate 50 becomes 0.6 USD.
- Not touched: SQLite schema/data, stock formulas, waste formulas, operational save/rollback flows.

### Add Pricing Currency Badges

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.19`
- Goal: make every money entry in the pricing card visibly identify its currency.
- Change: raw fabric and accessory raw price inputs show the selected pricing currency.
- Change: dyeing stages and profit margin show `جنيه` because they are EGP inputs that convert when USD pricing is selected.
- Change: updated styles/cache keys and added regression coverage for the currency badges.
- Not touched: SQLite schema/data, stock formulas, waste formulas, operational save/rollback flows.

### Unify Pricing Order Numbers In Reports

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.26`
- Goal: avoid confusing users with separate card/order/product-code numbers in pricing reports.
- Change: pricing list and printed pricing report now display one unified visible number: `رقم الطلب`.
- Change: the printed pricing list no longer has separate `رقم الكرت` and `رقم الطلب` columns.
- Change: the printed pricing list now includes `إجمالي العقد` and `الرصيد الفعلي للبيع` summaries.
- Test: added an operational-flow regression for unified pricing-list numbering and sellable-balance print coverage.
- Not touched: backend calculations, SQLite schema/data, stock formulas, waste formulas, operational save/rollback flows, AI backend, WhatsApp service, A5 service.

### Separate Workspace Module Screens

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.27`
- Goal: stop showing the same system panels under multiple menus and make every menu feel like a separate screen.
- Change: pricing, dashboard, AI, order lists, and order details now use distinct workspace modules.
- Change: order details switch to an `order-details` module and return to the previous operational list after closing.
- Change: stage shortcuts explicitly open their own operational module before applying the filter.
- Test: added an operational-flow regression to prevent shared pricing/orders panels from returning across all menus.
- Not touched: backend calculations, SQLite schema/data, stock formulas, waste formulas, operational save/rollback flows, AI backend, WhatsApp service, A5 service.

### Fix Pricing Menu Module Fallback

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.28`
- Goal: make `عروض الأسعار` always open the pricing screen, not the last operational list.
- Root cause: closing order-focus mode restored the previous operational module even when order-focus mode was not active.
- Change: `closeOrderFocusMode()` now restores the previous module only when an order details screen was actually open.
- Test: added regression coverage to prevent inactive order-focus cleanup from overriding requested modules.
- Not touched: backend calculations, SQLite schema/data, stock formulas, waste formulas, operational save/rollback flows, AI backend, WhatsApp service, A5 service.

### Separate Operational List Screens

- Date: 2026-06-15
- Commit: pending.
- Version: `v2026.06.15.29`
- Goal: stop reusing the same orders table for `orders`, `weaving`, `dyehouse`, and `warehouse`.
- Change: general orders, weaving, dyehouse, and warehouse now have independent module panels and independent table bodies.
- Change: stage shortcuts now scroll to the matching screen: weaving, dyehouse, or warehouse.
- Change: all separated operational rows still open the same order details workflow and keep the same edit/delete actions.
- Test: added operational-flow coverage to prevent returning to one shared operational list panel.
- Not touched: backend calculations, SQLite schema/data, stock formulas, waste formulas, operational save/rollback flows, AI backend, WhatsApp service, A5 service.

### Fix Scoped Dyehouse Transfer Ledger

- Date: 2026-06-17
- Commit: pending.
- Version: `v2026.06.17.18`
- Goal: make order detail screens show both source and target dyehouse balances after partial dyehouse transfers.
- Change: order detail rows now build a per-color dyehouse ledger from raw transfer movements instead of trusting the current allocation dyehouse only.
- Change: legacy partial transfers keep the original source dyehouse visible with the remaining balance and show the target dyehouse with the transferred quantity.
- Change: `نقل مصبغة` now starts with an explicit dialog for `نقل خام` or `نقل لون`, with the old prompt retained only as a browser fallback.
- Test: `npm run check` passes and operational-flow regression coverage was updated.
- Not touched: backend calculations, SQLite schema/data, stock formulas, waste formulas, operational save/rollback flows, AI backend, WhatsApp service, A5 service.
### Fix Grouped Pricing Save Verification

- Date: 2026-06-16
- Commit: pending.
- Version: `v2026.06.16.02`
- Goal: fix pricing-card edits that appeared not to save after the grouped pricing-card changes.
- Root cause: frontend verification after `PUT /pricings/:id` still compared the legacy `fabric_type` column only.
- Change: grouped pricing save verification now reads `pricing_items_json` and compares saved item count/signature before approving the save.
- Change: legacy single-line pricing still falls back to the old fabric-column check.
- Test: added operational-flow coverage so grouped pricing verification cannot regress to the legacy single-column check.
- Not touched: backend calculations, SQLite schema/data, stock formulas, waste formulas, operational save/rollback flows, AI backend, WhatsApp service, A5 service.

### Add Scheduled WhatsApp Operational Reports

- Date: 2026-06-18
- Commit: pending.
- Version: `v2026.06.18.02`
- Goal: send operational reports to WhatsApp periodically without changing stock, waste, database schema, or WhatsApp service internals.
- Change: WhatsApp settings now include daily scheduled report controls: enable flag, send time, target group, and included report sections.
- Change: the scheduler builds a text operational report from calculated frontend state and queues it in the existing `reportOutbox`.
- Change: the existing WhatsApp service sends the scheduled row when WhatsApp is connected and automatic sending is enabled.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: `backend/calculations.js`, `backend/server.js`, SQLite schema/data, stock formulas, waste formulas, operational save/rollback flows, WhatsApp service internals, A5 service.

### Add Sticker Printing Choice

- Date: 2026-06-18
- Commit: pending.
- Version: `v2026.06.18.03`
- Goal: let the user print stickers either from the currently opened order or from manually entered data.
- Change: `استيكرات التشغيل` now opens a choice screen.
- Change: manual sticker rows accept color, quantity, inch, width, and weight, then render the same sticker document layout without saving operational data.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: backend, SQLite schema/data, stock formulas, waste formulas, operational save/rollback flows, AI backend, WhatsApp service, A5 service.

### Split Operation Stickers And Showroom Cards

- Date: 2026-06-18
- Commit: pending.
- Version: `v2026.06.18.06`
- Goal: keep operational stickers unchanged while adding simplified showroom cards.
- Change: `طباعة استيكرات` now offers `استيكر تشغيل` for the current order and `كرتيلات المعرض` for manual showroom cards.
- Change: showroom cards hide order number, customer name, color, and quantity.
- Change: manual showroom entry now keeps only item/fabric and measurement fields.
- Change: showroom cards can now be printed under either `2B` or `Deltex.co`.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: backend, SQLite schema/data, stock formulas, waste formulas, operational save/rollback flows, AI backend, WhatsApp service, A5 service.

### Polish Showroom Card Print Layout

- Date: 2026-06-18
- Commit: pending.
- Version: `v2026.06.18.07`
- Goal: improve the visual layout of `كرتيلات المعرض` without changing operational sticker behavior.
- Change: showroom cards now have a dedicated CSS class and print layout.
- Change: brand header, fabric name area, and measurement cells are tighter and more readable.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: backend, SQLite schema/data, stock formulas, waste formulas, operational save/rollback flows, AI backend, WhatsApp service, A5 service.

### Remove Inch From Showroom Cards

- Date: 2026-06-18
- Commit: pending.
- Version: `v2026.06.18.08`
- Goal: simplify `كرتيلات المعرض` by removing the `البوصة` field.
- Change: manual showroom card entry no longer asks for inch.
- Change: showroom card print output now shows only brand, item/fabric, width, and weight.
- Change: operational stickers still keep the original inch field.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: backend, SQLite schema/data, stock formulas, waste formulas, operational save/rollback flows, AI backend, WhatsApp service, A5 service.

### Stabilize Workflow Screens And Mobile Layout

- Date: 2026-06-16
- Commit: pending.
- Version: `v2026.06.16.01`
- Goal: continue the approved 7-point cleanup and start the mobile version pass without touching backend or calculations.
- Change: pricing-to-order conversion now carries dyehouse, weaving source, and accessory summary into grouped order review.
- Change: grouped order saves now prefer the per-item operational values from the converted pricing rows before falling back to pricing defaults.
- Change: removed the duplicated warehouse inventory report entry from the warehouse sidebar.
- Change: improved mobile layout for grouped order rows, pricing cards, dialogs, forms, filters, and general workspace width.
- Test: added operational-flow coverage for grouped pricing operational fields and the removed duplicated warehouse menu.
- Not touched: backend calculations, SQLite schema/data, stock formulas, waste formulas, operational save/rollback flows, AI backend, WhatsApp service, A5 service.

### Price Accessories As Full Costing Lines

- Date: 2026-07-01
- Commit: pending.
- Version: `v2026.07.01.01`
- Goal: make pricing-card accessories behave like fabric/raw lines, not as hidden extra cost.
- Change: accessory lines now calculate raw price, selected dyeing stages, waste, deferred cost, profit, sale price per kilo, and total value.
- Change: pricing cards can print a customer quotation separately from an internal cost report.
- Guard: added an operational-flow regression check for accessory waste/profit pricing.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: backend calculations, SQLite schema/data, stock formulas, operational save/rollback flows, AI backend, WhatsApp service, A5 service.
### Prepare Company Server Migration Package

- Date: 2026-07-01
- Commit: pending.
- Version observed in code: `v2026.07.01.04`
- Goal: move away from Railway resource limits and prepare the system for deployment on the company server.
- Change: prepared transfer folder `F:\2B Tex` with `data`, `backups`, `logs`, and `server-tools`.
- Change: created full project archive `F:\2B Tex\2B-Tex-System-full-20260701-204414.tar` including source, `.git`, and project memory.
- Change: copied the current SQLite database separately to `F:\2B Tex\data\2btex.sqlite`.
- Finding: direct extraction/copy to `F:\2B Tex\system` is blocked by folder policy for `.js`, `.ps1`, `.bat`, and `.zip`, so the incomplete copy was removed.
- Next: allow script/application extensions on the company server path, extract the archive, install npm dependencies, and run with `DB_PATH=F:\2B Tex\data\2btex.sqlite`.
- Not touched: backend calculations, SQLite schema, data contents, stock formulas, waste formulas, AI backend logic, WhatsApp internals, A5 service.

### Add Redundant Production Data Safety Copy

- Date: 2026-07-01
- Commit: pending.
- Goal: prevent any data loss during the move from Railway/company transfer storage to a company server.
- Change: copied the active SQLite database to `D:\2B Tex نظام التشغيل\server-data\2btex.sqlite`.
- Change: created a timestamped SQLite backup under `D:\2B Tex نظام التشغيل\server-backups`.
- Change: added `server-data/` and `server-backups/` to `.gitignore` so production data and backups do not enter Git accidentally.
- Verification: source database, `D:` data copy, `F:` data copy, and timestamped backup have identical SHA256 hashes.
- Not touched: SQLite schema, data contents, backend calculations, stock formulas, waste formulas.

### Restore Railway Production Data To Company Server Copy

- Date: 2026-07-02
- Commit: pending.
- Goal: fix missing production data after moving the system off Railway by restoring the actual Railway volume SQLite database.
- Finding: the active company-server/local copy had only `60` orders and `6` pricing cards, while the Railway volume had `72` orders and `47` pricing cards.
- Change: downloaded `/2btex.sqlite` from Railway volume `2b---tex-volume` to `D:\2B Tex نظام التشغيل\server-backups\railway-volume-2btex-20260702-105012.sqlite`.
- Change: backed up the previous active local database to `D:\2B Tex نظام التشغيل\server-backups\before-railway-restore-20260702-105509.sqlite`.
- Change: restored the Railway production database to `D:\2B Tex نظام التشغيل\server-data\2btex.sqlite` and synced it to `F:\2B Tex\data\2btex.sqlite`.
- Verification: restored counts include `orders=72`, `pricings=47`, `customers=24`, `finished_receiving_batches=201`, `customer_delivery_batches=156`, and `accessory_batches=161`.
- Verification: login for `Ibrahim Assem` succeeded after restore.
- Not touched: SQLite schema, backend calculations, stock formulas, waste formulas, Git-tracked bundled database.

### Enhance Combined Dyehouse Issue Entry

- Date: 2026-07-02
- Commit: pending.
- Version: `v2026.07.02.03`
- Goal: support real combined dyehouse issue workflows where one issue can include fabric/accessory lines, extra raw lines, and more than one permit number.
- Change: added extra raw-fabric rows to the combined dyehouse issue dialog.
- Change: added multiple permit-number inputs and saved them together on the generated movement records.
- Change: bumped frontend cache keys for `app.js` and `styles.css`.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: backend calculations, SQLite schema/data, stock formulas, waste formulas, WhatsApp service, A5 service.

### Align Gluing Workflow With Factory Operation

- Date: 2026-07-02
- Commit: pending.
- Version: `v2026.07.02.04`
- Goal: make raw-material merging match the factory process instead of treating it as a simple stock merge.
- Change: the gluing source form now records prepared fabric sent to the gluing factory and purchased adhesive/velvet material sent in the same operation.
- Change: purchased adhesive details are stored in `source_document_json` on the existing `gluing_batches` row, so no database schema change is required.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: backend calculations, SQLite schema/data, stock formulas, waste formulas, WhatsApp service, A5 service.

### Refresh Company Server Migration Package

- Date: 2026-07-05
- Commit: pending.
- Version observed in code: `v2026.07.02.04`
- Goal: replace the outdated transfer package at `F:\2B Tex` (code at `68a1cf8`, database snapshot from 2026-07-02 10:50) with the current system state.
- Change: created a new full archive in `F:\2B Tex` from `D:\2B Tex نظام التشغيل` including source, `.git`, and `project-memory`, excluding `node_modules`, `server-data`, `server-backups`, logs, and local temp files.
- Change: copied the live runtime database `server-data\2btex.sqlite` to `F:\2B Tex\data\2btex.sqlite` with hash verification while the system was running; the previous snapshot was kept in `F:\2B Tex\backups\`.
- Change: updated `F:\2B Tex\README-نقل-السيرفر.md` with the new archive name and removed the plaintext password.
- Finding: `F:\2B Tex` still blocks `.js`/`.ps1` file creation as of 2026-07-05, so extraction on the company server still requires IT to allow script extensions first.
- Not touched: backend calculations, SQLite schema, production data contents, stock formulas, waste formulas, AI backend, WhatsApp internals, A5 service.

### Security Hardening Pass

- Date: 2026-07-05
- Commit: pending.
- Version observed in code: `v2026.07.02.04`
- Goal: close the review findings (LAN exposure, default password, brute-force, stored XSS) without touching operational logic.
- Change: `backend/server.js` binds `127.0.0.1` by default (`BACKEND_HOST` override); `whatsapp-service/server.js` binds `127.0.0.1` by default (`WHATSAPP_HOST` override). Only the gateway on port 3000 stays public.
- Change: removed hardcoded `151297` fallback; system-admin fallback requires `SYSTEM_PASS`; first-run seeding uses a random password when `SYSTEM_PASS` is unset.
- Change: added login rate limiting on `/api/auth/login` (8 attempts / 15 min lock, env-overridable), returns 429 when locked.
- Change: escaped customer/fabric/dyehouse free text in `modules/reportsUi.js` report tables (stored-XSS fix).
- Change: `npm audit fix` in `whatsapp-service` (js-yaml advisory resolved).
- Change: documented new security env vars in `.env.example`.
- Test: `npm run check` passes; smoke test confirmed loopback binding, old password rejected, new password accepted, and 429 lockout.
- Not touched: backend calculations, SQLite schema/data, stock formulas, waste formulas, A5 service.


### Atomic Database Persistence And Post-GitHub Documentation Update

- Date: 2026-07-06
- Commit: pending.
- Version observed in code: `v2026.07.02.04`
- Goal: fix the riskiest infrastructure gap from the 2026-07-06 architecture review (non-atomic SQLite writes) and align project-memory docs with the 2026-07-05 decision to drop GitHub/Railway.
- Change: `backend/db.js` `persist()` now writes the exported database to `<db>.tmp` and renames it atomically over the live file; falls back to the previous direct write if the rename fails (e.g. antivirus lock). This protects the SQLite file from corruption if the process dies mid-write.
- Change: `project-memory/PROJECT_OVERVIEW.md`, `SYSTEM_ARCHITECTURE.md`, `SAFE_CHANGE_RULES.md`, and `RUNBOOK.md` updated: source of truth is `F:\2B Tex\system` (active workspace on D: until cutover), no pushing to remotes, Railway/GitHub sections replaced with company-server runtime, required server env vars documented, frontend module list completed.
- Test: `npm run check` passes and operational flow check passes.
- Not touched: backend calculations, SQLite schema/data, stock formulas, waste logic, WhatsApp service, A5 service, frontend behavior.


### Internal Build Hardening: Atomic Deletes, AI Layer Extraction, Persistence Guards Module, XSS Escaping

- Date: 2026-07-06
- Commits: 95d4f62, 322656c, 0deeb69, 50ac973 (plus this log entry).
- Goal: execute the four priorities from the 2026-07-06 internal-structure review.
- Change: deleteOrderGraph/deleteAllocationGraph/deleteCustomerGraph in `backend/server.js` now run inside `db.transaction()`; a shared sync helper lets full customer deletion be one atomic transaction. Interrupted deletes roll back instead of leaving partial graphs.
- Change: the ~1340-line AI employee layer moved from `backend/server.js` to `backend/aiEmployee.js` as a `createAiEmployee(deps)` factory (injected: repairMissingCustomersFromReferences, readableCustomerNameFromId). server.js went from 2812 to 1679 lines. All four `/api/ai/*` endpoints smoke-tested on a temp DB.
- Change: first safe extraction from PERSISTENCE_SAVE_FLOW_REVIEW.md done: `modules/persistenceGuards.js` (`createPersistenceGuards(deps)`) now holds backendBatchType/backendSnapshot(Collection) and all verify*Persisted readback helpers. ensureBackendForWrite and rollbackAfterBackendWriteFailure stay in app.js per the review. Wired in index.html and check:app.
- Change: escapeHtml applied to 32 real unescaped free-text interpolation sites found by a template scan (reportsUi management tables, customer ledger, order-details panel including the weavingSource value attribute, Amal document rows, weaving slip options). Wrapped paths (safeText/safe/renderList/listHtml) verified as already escaping.
- Change: `scripts/operational-flow-check.js` updated to read the AI functions from backend/aiEmployee.js, the pricing matcher from modules/persistenceGuards.js, and the escaped width-label form. Same assertions, new locations.
- Test: `npm run check` passes and operational flow check passes after each commit; AI endpoints smoke-tested live.
- Not touched: backend calculations, SQLite schema/data, stock formulas, waste logic, WhatsApp service, A5 service, route behavior.

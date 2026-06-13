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

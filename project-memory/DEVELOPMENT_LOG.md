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


# System Architecture

## Authoritative Deployment Architecture (2026-07-22)

- Company-server root: `F:\2B Tex`.
- Canonical Git workspace: `F:\2B Tex\system`.
- Public frontend/gateway: port `3000`, bound to `0.0.0.0` for LAN clients.
- Backend API: port `3050`, bound to `127.0.0.1` behind the gateway.
- WhatsApp service: port `3020`, bound to `127.0.0.1` behind the gateway.
- Database: central SQL Server (`2BTex`), normally local to the Windows server. Client devices never connect to SQL Server directly.
- Windows service: `2BTexServer` (`2B Tex Server`), configured to start automatically and recover after process failure.
- Server control panel: `2B Tex Server.exe` for status, start/stop/restart, opening logs, backup, restore, and server links.
- Portable runtime: packaged `runtime\node\node.exe` plus `runtime\node_modules\mssql`; application child processes use the same executable through `process.execPath`.
- Central configuration: `config\2btex.config.json`, loaded by both JavaScript and PowerShell tooling. The real file contains secrets and must not be committed.
- Backup architecture: SQL `.bak` files are retained locally and copied off-machine to the company share by the scheduled backup workflow.

Client topology:

```text
Windows client app / browser
        |
        v
2B Tex gateway :3000
        |
        +--> backend API :3050 --> SQL Server 2BTex
        +--> WhatsApp :3020
```

## Frontend

Main frontend files:

- `index.html`
- `app.js`
- `orders.js`
- `documents.js`
- `pricing.js`
- `styles.css`

Current frontend modules:

- `modules/navigation.js`
- `modules/focusViews.js`
- `modules/operationalAiManager.js`
- `modules/todayOrdersUi.js`
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

Frontend direction:

- Keep plain JavaScript.
- Do not migrate to React, Vue, Next, or another framework unless explicitly requested.
- Continue reducing `app.js` until it becomes an application orchestrator instead of `Everything.js`.
- Follow `project-memory/UI_ORGANIZATION.md` before changing navigation, Dashboard, sidebar entries, reports menu, smart follow-up, or order focus views.

## Current UI Organization

The interface is organized as an operations room:

- Dashboard is a high-level entry point, not a duplicate of every module.
- Weaving, dyehouse, and warehouse balances live inside their own modules.
- Smart follow-up is one combined center, not separate manager/employee copies.
- The order focus view is the single place to review one order and its tools.
- `Order 360` is a full-order-view concept, not an order number or database ID.

## Backend

Main backend files:

- `backend/server.js`
- `backend/calculations.js`
- `backend/db.js`
- `backend/schema.sql`
- `backend/data/2btex.sqlite`

Critical file:

- `backend/calculations.js`

Do not change this file casually. It contains sensitive operational calculations.

## Runtime and Services

- `server.js`: public server, auth gate, and proxy layer.
- `start.js`: starts the system services.
- `whatsapp-service/server.js`: WhatsApp service.
- `a5-service/server.js`: A5 bridge.
- `ai-service/server.js`: older AI service, not the current main AI path.

## Current AI API

The current AI employee path is integrated mainly through `backend/server.js`.

Important AI endpoints:

- `/api/ai/health`
- `/api/ai/analyze-report`
- `/api/ai/employee-context`
- `/api/ai/employee-report`

## Source and Runtime

Current decision: the company server is the production runtime and `F:\2B Tex\system`
is the canonical workspace. SQL Server is the production database path; SQLite remains
only for compatibility/development paths and must not be treated as the multi-user
production store. Git remains the source-history mechanism, not the runtime host.

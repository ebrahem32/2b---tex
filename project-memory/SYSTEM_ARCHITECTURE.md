# System Architecture

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
- `modules/aiUi.js`
- `modules/documentsUi.js`

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

- GitHub is the official source of code.
- Railway is the external runtime.

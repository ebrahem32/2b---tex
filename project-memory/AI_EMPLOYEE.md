# AI Employee

## Current AI Flow

```text
Frontend
↓
/api/ai/employee-report
↓
backend/server.js
↓
buildAiEmployeeContext
↓
Operational Rules + Question Focus
↓
Gemini / OpenAI / Local fallback
↓
Structured Response
↓
AI UI
```

## Current AI UI

Frontend AI UI has been extracted into:

- `modules/aiUi.js`

This module handles:

- AI dialog rendering.
- AI question button.
- AI analysis button.
- Local fallback response rendering.
- Copy WhatsApp message action.

## Current AI Backend

The main current AI path is integrated in `backend/server.js`.

Relevant endpoints:

- `/api/ai/health`
- `/api/ai/analyze-report`
- `/api/ai/employee-context`
- `/api/ai/employee-report`

## Older AI Service

`ai-service/server.js` is an older service and is not the current center of AI operation.

Do not expand or depend on it without reviewing the current integrated AI backend first.

## Known AI Limitations

- General dashboard questions can still use model/rules summarization, but direct operational commands now bypass the model.
- Question focus partly depends on keywords for non-command questions.
- There are no complete AI evaluation tests yet.
- The first operational query engine is active for customer accounts, dyehouse transfers, and WhatsApp/outbox diagnosis.

## Operational Query Engine

`/api/ai/employee-report` now checks direct 2B commands before Gemini/OpenAI:

- `حساب + اسم العميل`: returns a customer account summary from customer account settings, delivery invoices, finished-stock sales, payments, and opening balance.
- `تحويل / تحويلات + اسم المصبغة`: returns dyehouse transfer history and current dyehouse balance context.
- `واتساب / إرسال التقارير`: returns outbox status, pending/failed/sent counts, and send-risk recommendations.

This layer is read-only and does not write to orders, stock, waste, WhatsApp, A5, or SQLite schema.

## Future Goal

The smart employee should become an operational manager that answers with:

- Order numbers.
- Customers.
- Dyehouse status.
- Weaving status.
- Warehouse balance.
- Delay reasons.
- Waste risk.
- Recommended next action.

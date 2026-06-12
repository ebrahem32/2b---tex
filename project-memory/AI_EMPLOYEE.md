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

- Some responses can still be general.
- Question focus partly depends on keywords.
- There are no complete AI evaluation tests yet.
- The system needs an operational query engine later.

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


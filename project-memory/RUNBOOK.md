# Runbook

## Local Run

Install dependencies if needed:

```bash
npm install
```

Run checks:

```bash
npm run check
```

Start the system:

```bash
npm start
```

## Runtime

Decision 2026-07-05: GitHub and Railway are out of the workflow. The system runs on the company server (Windows) from `F:\2B Tex\system`, started with `npm start`. Until cutover, the active workspace is `D:\2B Tex نظام التشغيل`.

Required environment on the server before first start:

- `SYSTEM_USER` and a strong `SYSTEM_PASS` (the gateway refuses to serve without them).
- A strong independent `AUTH_SECRET` for session signing.
- `PUPPETEER_EXECUTABLE_PATH` pointing to a local Chrome/Chromium for the WhatsApp service (the default `/usr/bin/chromium` is Linux-only).

## Change Workflow

Before changes:

```bash
git status
git branch
```

After changes:

```bash
npm run check
git add <files>
git commit -m "<clear message>"
```

Do NOT push to any remote. Sync the change to `F:\2B Tex\system` and commit there as well.

## Checks

Main command:

```bash
npm run check
```

Expected result:

```text
Operational flow check passed.
```

## Health and API

Known API and health areas:

- `/api/health`
- `/api/system/check`
- `/api/system/status`
- `/api/ai/health`
- `/api/ai/employee-context`
- `/api/ai/employee-report`

Some endpoints are protected and may return `401` without login.

## Common Ports

Common local ports based on current project memory:

- Frontend/public server: often `3000`
- Backend: often `3050`
- WhatsApp: often `3020`

## Environment Variables

Required or relevant variables may include:

- `SYSTEM_USER`
- `SYSTEM_PASS`
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `DB_PATH`
- `PORT`
- `BACKEND_PORT`

Never write real secrets, passwords, tokens, or API keys into documentation or commits.


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

## Railway Runtime

Railway is the external runtime environment.

Expected project service:

- Repository: `ebrahem32/2b---tex`
- Public URL: `https://2b-tex-railway-startjs.up.railway.app`

After pushing to `origin/main`, Railway should build and deploy automatically.

## GitHub Workflow

Before changes:

```bash
git status
git branch
git remote -v
```

After changes:

```bash
npm run check
git add <files>
git commit -m "<clear message>"
git push origin main
```

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


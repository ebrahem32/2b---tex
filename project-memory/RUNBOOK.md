# Runbook

## Official Server Layout

- Root: `F:\2B Tex`
- Code/Git: `F:\2B Tex\system`
- Tools: `F:\2B Tex\server-tools`
- Config example: `F:\2B Tex\config\2btex.config.example.json`
- Portable package output: `F:\2B Tex\dist`
- Canonical memory: `F:\2B Tex\system\project-memory`

## Portable Server Package

Build from the authoritative server root/tooling:

```powershell
& "F:\2B Tex\server-tools\build-server-package.ps1"
```

For a package that must carry WhatsApp dependencies for offline installation:

```powershell
& "F:\2B Tex\server-tools\build-server-package.ps1" -IncludeWhatsApp
```

The build must pass `npm run check` before packaging. A complete release should contain
both the versioned package directory and its ZIP. At the 2026-07-22 review, the directory
existed but the ZIP did not, so do not label that build fully distributable yet.

On a new Windows server, copy/extract the package and run `install.cmd` as Administrator.
The installer preserves an existing real config, can install SQL Server Express, restores
the newest available `.bak`, configures the firewall, and registers `2BTexServer`.

Service checks:

```powershell
Get-Service 2BTexServer
Restart-Service 2BTexServer -Force
```

Never put real passwords, API keys, or `config\2btex.config.json` in Git or documentation.

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

The system runs centrally on the company Windows server from `F:\2B Tex`. Normal production
startup is through the `2BTexServer` Windows service; `npm start` remains a diagnostic/manual
fallback from `F:\2B Tex\system`.

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

For the dedicated production server, verify both authenticated endpoints after every deployment:

```text
/api/health
/api/system/check
```

The production database is SQL Server. Database backups must be real `.bak` files created through
`POST /api/backup` or the scheduled SQL Server backup task; never treat a copied SQLite file as a
production backup while `DB_CLIENT=mssql`.

## Windows Client Release

- Build source: `F:\2B Tex\windows-app`.
- Shared unpacked release: `F:\2B Tex\windows-app\dist\win-unpacked`.
- Release manifest: `F:\2B Tex\client-app-manifest.json`.
- After every rebuild, update the manifest version, portable EXE SHA256, `app.asar` SHA256, size, and publish time.
- The workstation launcher compares the local `app.asar` hash with the manifest and updates `%LOCALAPPDATA%\2BTex\App`.
- The desktop client clears Chromium cache at startup so frontend and Arabic-text releases are loaded immediately.

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

# Safe Change Rules

## Forbidden Without Explicit User Approval

- Delete production data or backups.
- Change the database schema.
- Change `backend/calculations.js`.
- Change waste, stock, or sensitive report calculations.
- Migrate the project to a new framework.
- Commit environment files, secrets, `node_modules`, or runtime artifacts.

## Required Before Changes

- Read `project-memory/`.
- Work only from the canonical server repository: `C:\2B Tex\system` on `2B-Server`.
- Run `git status`.
- Understand the current requested scope.
- Keep edits scoped.
- Preserve production behavior.
- Create and verify a SQL Server backup before schema, migration, or high-risk operational changes.
- Record the main production table counts before deployment.

## Required After Changes

- Run `npm run check`.
- Confirm `Operational flow check passed`.
- Update `project-memory/` with the completed change and verification result.
- Commit with a clear message. GitHub is not part of the production workflow unless the user explicitly restores it.
- Restart the `2B Tex Server` scheduled task when runtime files change.
- Check `/api/health` and compare production table counts after deployment.
- Report files changed, behavior changed, behavior not touched, test result, and commit hash.

## Canonical Copy Rules

- The only full application copy is `C:\2B Tex\system` on `2B-Server`.
- Do not create or sync a second full application copy on `D:` or `F:`.
- `F:\2B Tex` is launcher-only.
- `D:\2B Tex نظام التشغيل` must remain non-runnable and empty except for temporary Codex work that is removed after use.

## Production Data Isolation

- Production uses SQL Server database `2BTex`.
- Production configuration remains outside the repository at `C:\2B Tex\config\2btex.config.json`.
- Keep `C:\2B Tex\config\production-mssql.lock` enabled.
- Never overwrite `C:\2B Tex\config`, `C:\2B Tex\data`, or `C:\ProgramData\2BTex\backups` during code deployment.
- SQLite is archive or test material only and must never be restored to a production runtime path.
- Never enable local import or automatic seed in production.

## Refactor Rules

- Extract frontend modules gradually and keep `app.js` as the application orchestrator.
- Do not change behavior while extracting.
- Do not change calculations during UI refactor.
- Backend refactor is not a priority unless explicitly requested.

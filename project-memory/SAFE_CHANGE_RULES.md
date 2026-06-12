# Safe Change Rules

## Forbidden Without Explicit User Approval

- Delete data.
- Delete backups.
- Delete environment files.
- Delete local project folders.
- Change database schema.
- Change `backend/calculations.js`.
- Change waste logic.
- Change stock logic.
- Change sensitive report calculations.
- Migrate the project to a new framework.
- Break Railway runtime.
- Commit `.env` files or secrets.
- Commit `node_modules`.
- Commit large runtime artifacts.

## Required Before Changes

- Read `project-memory/`.
- Run `git status`.
- Understand the current requested scope.
- Keep edits scoped.
- Preserve the running production behavior.

## Required After Changes

- Run `npm run check`.
- Confirm `Operational flow check passed`.
- Commit with a clear message.
- Push to `origin/main` when requested.
- Report:
  - Files changed.
  - What changed.
  - What was not touched.
  - Test result.
  - Commit hash.
  - Railway/GitHub status when checked.

## Frontend Refactor Rules

- Extract modules gradually.
- Keep `app.js` as application orchestrator.
- Do not change behavior while extracting.
- Do not change calculations during UI refactor.

## Backend Refactor Rules

Backend refactor is not current priority unless explicitly requested.

Do not begin backend refactor while frontend Phase 1 is still in progress.


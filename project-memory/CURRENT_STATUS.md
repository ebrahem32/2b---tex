# Current Status

## Current Version

`v2026.06.13.06`

## Last Known Commit Before Project Memory

`918ce4b Extract AI and documents UI modules`

## Current Phase

```text
Phase 1 - Frontend Modular Refactor
```

## Completed Frontend Modules

- `modules/navigation.js`
- `modules/focusViews.js`
- `modules/aiUi.js`
- `modules/documentsUi.js`

## Current `app.js` Direction

`app.js` is being reduced from a large all-in-one file into an application orchestrator.

Current known line count after Phase 1.2:

```text
app.js: about 5538 lines
```

## Next Frontend Refactor Targets

- `modules/reportsUi.js`
- `modules/ordersUi.js`
- `modules/warehouseUi.js`

## Not Allowed Currently

- Backend refactor.
- Database schema changes.
- Calculation changes.
- Waste logic changes.
- Stock logic changes.

## Last Verification

For commit `918ce4b`:

- `npm run check`: passed.
- Operational flow check: passed.
- GitHub Actions: passed.
- Railway: Online.

## This Documentation Task

Goal:

- Add `project-memory/` to GitHub as the persistent project memory.

Required after creation:

```bash
npm run check
git add project-memory
git commit -m "Add project memory documentation"
git push origin main
```


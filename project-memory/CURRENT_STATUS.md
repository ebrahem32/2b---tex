# Current Status

## Current Version

`v2026.06.13.10`

## Last Known Commit Before Project Memory

`282d516 Extract orders UI module`

## Current Phase

```text
Phase 1 - Frontend Modular Refactor
```

## Completed Frontend Modules

- `modules/navigation.js`
- `modules/focusViews.js`
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

## Current `app.js` Direction

`app.js` is being reduced from a large all-in-one file into an application orchestrator.

Current known line count after Phase 1.2:

```text
app.js: about 5538 lines
```

## Next Frontend Refactor Targets

- Keep `operations`, `transfers`, and deeper accessory movement handlers inside `app.js` until a safer write-flow refactor, because they are tightly coupled to backend writes, stock movements, and operational validations.

## Not Allowed Currently

- Backend refactor.
- Database schema changes.
- Calculation changes.
- Waste logic changes.
- Stock logic changes.

## Last Verification

For Phase 1.4 local verification before commit:

- `npm run check`: passed.
- Operational flow check: passed.
- GitHub Actions: verify after push.
- Railway: verify after push.

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

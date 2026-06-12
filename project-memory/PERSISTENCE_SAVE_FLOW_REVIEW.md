# Persistence Save Flow Review

Date: 2026-06-13  
Version reviewed: `v2026.06.13.11`  
Commit baseline: `f14cf27 Extract frontend backend client`  
Scope: review and documentation only. No runtime code was changed for this review.

## Executive Summary

The frontend save layer is still centered in `app.js`. `modules/backendClient.js` now owns the generic request wrapper, but the operational save flow still lives in `app.js` by design:

```text
User Action
-> UI handler
-> validation and normalization
-> ensureBackendForWrite()
-> postBackend / putBackend / deleteBackend / postBackendStrict
-> optional verify*Persisted()
-> rollbackAfterBackendWriteFailure() if needed
-> loadBackendData()
-> render/update dialog
```

The system has a clear safety pattern for orders and pricings. Batch/movement flows are mostly protected by `ensureBackendForWrite()` and `loadBackendData()`, but many do not run a detailed `verifyBatchPersisted()` after write. This is the main reason the write guards should not be moved blindly yet.

## Core Persistence Guards

| Layer | Current location | Responsibility | Notes |
|---|---|---|---|
| Generic HTTP client | `modules/backendClient.js` | API URL, fetch, JSON parsing, HTTP errors | Safe and already extracted. |
| `backendRequest()` | `app.js` wrapper over `backendClient.request()` | Keeps existing call sites stable | Thin compatibility wrapper. |
| `ensureBackendForWrite()` | `app.js` | `/api/health`, schema check, badge update, alert on failure | Coupled to UI state and alerts. |
| `postBackend()` | `app.js` | Safe POST returning `null` on failure | Mutates `backendAvailable`. |
| `postBackendStrict()` | `app.js` | Strict POST throwing on failure | Used for bulk/transactional flows. |
| `putBackend()` | `app.js` | Safe PUT returning `null` on failure | Mutates `backendAvailable`. |
| `deleteBackend()` | `app.js` | Safe DELETE returning `null` on failure | Mutates `backendAvailable`. |
| `saveBackendSetting()` | `app.js` | PUT `/api/settings/:key` | Used by settings, WhatsApp, customer accounts. |
| `backendSnapshot()` | `app.js` | GET `/api/bootstrap` | Used for verify helpers. |
| `rollbackAfterBackendWriteFailure()` | `app.js` | Alert and `loadBackendData()` | Not a DB transaction rollback; it reloads UI state from persisted backend data. |
| `verify*Persisted()` | `app.js` | Reads backend again and checks saved data | Strongest checks exist for orders/pricings/accessories. |
| `recordAudit()` / `persistAuditLog()` | `app.js` | Local audit object, but `persistAuditLog()` currently returns true | Official audit is now generated in `backend/server.js` via `auditMutation()`. |

## Backend Endpoints Used By Save Flows

| Endpoint | Type | Server location | Role gate | Used for |
|---|---|---|---|---|
| `POST /api/customers` | create/upsert | `backend/server.js` `crudRoutes('customers')` | manager | Ensure customer reference before orders/pricings. |
| `POST /api/pricings` | create/upsert | `crudRoutes('pricings')` | manager | New pricing. |
| `PUT /api/pricings/:id` | update | `crudRoutes('pricings')` | manager | Edit pricing / mark converted. |
| `DELETE /api/pricings/:id` | delete | `crudRoutes('pricings')` | admin | Delete pricing. |
| `POST /api/orders` | create/upsert | `crudRoutes('orders')` | manager | New single order. |
| `PUT /api/orders/:id` | update | `crudRoutes('orders')` | manager | Edit order / close order / operation notes / pricing link. |
| `DELETE /api/orders/:id` | delete graph | `crudRoutes('orders')` | admin | Delete order and related graph. |
| `POST /api/orders/bulk` | create transaction | custom route | manager | Grouped order items. |
| `POST /api/orders/:orderId/allocations` | create | custom route | manager | Add color/allocation. |
| `PUT /api/allocations/:id` | update | custom route | manager | Edit color/allocation or transfer source. |
| `DELETE /api/allocations/:id` | delete graph | custom route | admin | Delete color/allocation graph. |
| `POST /api/batches/dyehouse` | create | batch route | manager | Raw sent to dyehouse. |
| `POST /api/batches/finished` | create | batch route | manager | Finished received from dyehouse. |
| `POST /api/batches/customer` | create | batch route | manager | Customer delivery / return. |
| `POST /api/batches/accessory` | create | batch route | manager | Accessory sent/received/customer. |
| `POST /api/batches/raw-return` | create | batch route | manager | Raw returned from dyehouse. |
| `POST /api/batches/gluing` | create | generic batch route | manager | Gluing source/merge/return/customer. |
| `POST /api/batches/bulk` | create transaction | custom route | manager | Bulk batch entry. |
| `PUT /api/batches/:type/:id` | update | generic batch update | manager | Edit movement. |
| `DELETE /api/batches/:type/:id` | delete | generic batch delete | admin | Delete movement. |
| `POST /api/transfers` | create | custom transfer route | manager | Dyehouse transfer. |
| `PUT /api/transfers/:id` | update | custom transfer route | manager | Edit transfer. |
| `DELETE /api/transfers/:id` | delete | custom transfer route | admin | Delete transfer. |
| `PUT /api/settings/:key` | create/update setting | settings route | manager | WhatsApp, customer accounts, dyehouse prices. |
| `GET/POST/PUT/DELETE /api/users` | users | users routes | admin | User management. |

## Flow Review By Operation

### 1. New Order

- Files: `app.js`, `modules/formsUi.js`, `modules/backendClient.js`, `backend/server.js`, `orders.js`.
- User action: submit `#orderForm`.
- UI handler: `refs.orderForm.onsubmit -> addOrder(event)`.
- Validation:
  - Multiple width mode requires at least one width line.
  - Grouped order items require fabric and quantity.
  - Converted pricing cannot be saved as grouped multi-item order.
  - Accessory lines are read and normalized.
- Backend write:
  - `ensureBackendForWrite()`.
  - `ensureBackendCustomer(payload.customer)` -> `POST /api/customers`.
  - Single order: `POST /api/orders`.
  - Grouped orders: `POST /api/orders/bulk` via `postBackendStrict()`.
  - If converted from pricing: `markPricingConverted()` -> `PUT /api/pricings/:id`.
- Verify persistence:
  - Single order: `verifyOrderPersisted(savedOrder.id || newOrder.id, payload)`.
  - Grouped order: checks returned array length only.
- Rollback:
  - `rollbackAfterBackendWriteFailure()` on failed write, failed verify, or failed pricing mark.
- Reload/render:
  - `loadBackendData()`, close order dialog.
- Audit:
  - Backend `auditMutation()` records the DB mutation.
  - Frontend does not call `recordAudit()` for the final order creation path.
- Risk:
  - Grouped order has no per-order `verifyOrderPersisted()`.
  - `markPricingConverted()` happens after order creation; failure leaves order saved but pricing not converted, then UI reloads as rollback.
- Future extraction:
  - `operationsController.js`: yes, but only after tests around single/grouped/converted orders.
  - `persistenceGuards.js`: later.

### 2. Edit Existing Order

- Files: `app.js`, `orders.js`, `backend/server.js`.
- User action: edit button in orders list or focus view, submit `#orderForm`.
- UI handler: `addOrder(event)` with `editingOrderId`.
- Validation:
  - Same base form validation as new order.
  - Dyehouse changes avoid allocations already transferred or already manually diverged from previous dyehouse.
- Backend write:
  - `ensureBackendForWrite()`.
  - `ensureBackendCustomer()`.
  - `PUT /api/orders/:id`.
  - Potential allocation updates: `PUT /api/allocations/:id`.
- Verify persistence:
  - `verifyOrderPersisted(editingOrderId, payload)`.
  - Allocation updates are checked only by returned response, not `verifyAllocationPersisted()`.
- Rollback:
  - Yes on failed order save, failed order verify, or failed allocation update.
- Reload/render:
  - `loadBackendData()`, close order dialog.
- Audit:
  - Backend audit for order and allocation updates.
- Risk:
  - Multi-step update can save order then fail allocation update. UI rollback reloads state but DB has partial change.
- Future extraction:
  - Keep inside `app.js` until a transaction endpoint or controller is designed.

### 3. Pricing

#### Create Pricing

- User action: submit `#pricingForm`.
- UI handler: `refs.pricingForm.onsubmit -> addPricing(event)`.
- Validation:
  - HTML required fields plus `pricingPayload()` normalization.
- Backend write:
  - `ensureBackendForWrite()`.
  - `ensureBackendCustomer()`.
  - `POST /api/pricings`.
  - Optional `attachPricingToOrder()` -> `PUT /api/orders/:id`.
- Verify persistence:
  - `verifyPricingPersisted(savedPricing.id || createdPricing.id, createdPricing)`.
  - If attached to order, `attachPricingToOrder()` calls `verifyOrderPersisted()`.
- Rollback:
  - Yes on failed create, failed verify, failed attach.
- Reload/render:
  - `loadBackendData()`, close pricing dialog.
- Audit:
  - Frontend `recordAudit('create','pricing')`, but `persistAuditLog()` is no-op.
  - Backend `auditMutation()` is official.
- Future extraction:
  - Good candidate for `pricingController.js` or `operationsController.js` later.

#### Edit Pricing

- User action: edit pricing, submit pricing form.
- UI handler: `addPricing(event)` with `editingPricingId`.
- Backend write:
  - `PUT /api/pricings/:id`.
- Verify:
  - `verifyPricingPersisted(editingPricingId, updatedPricing)`.
- Rollback:
  - Yes.
- Risk:
  - Optional re-attach to order is second write after pricing update.

#### Pricing From Existing Order

- User action: `openPricingForOrder()` from order details.
- UI handler:
  - `openPricingForOrder()` sets form values from `pricingDraftFromOrder()`.
  - Save uses `addPricing()`.
- Backend write:
  - Same as create pricing.
  - Then `attachPricingToOrder()`.
- Verify:
  - Pricing verify and order verify in attach flow.
- Risk:
  - If pricing succeeds but attach fails, rollback reloads but pricing may remain saved.

#### Convert Pricing To Order

- User action: pricing table button.
- UI handler:
  - `convertPricingToOrder(id)` fills order form.
  - Actual write happens in `addOrder()` when order form is submitted.
- Backend write:
  - `POST /api/orders`, then `markPricingConverted()` -> `PUT /api/pricings/:id`.
- Verify:
  - Order verify exists.
  - Pricing conversion checks only write return.
- Risk:
  - Two-step save can partially succeed.

### 4. Raw From Weaving / Sent To Dyehouse

- Files: `app.js`, `orders.js`, `backend/server.js`.
- User action: submit raw/dyehouse batch form in order details.
- UI handler:
  - `refs.orderDetailsPanel submit -> addBatch(event)`.
- Validation:
  - `ensureBackendForWrite()`.
  - If width dispatch options exist, requires `widthLineId`.
  - Optional document image is resized into `sourceDocument`.
- Backend write:
  - `POST /api/batches/dyehouse`.
- Verify persistence:
  - No explicit `verifyBatchPersisted()` call.
- Rollback:
  - Yes if backend returns null.
- Reload/render:
  - `event.target.reset()`, `loadBackendData()`.
- Audit:
  - Backend audit.
- Risk:
  - No detailed post-save verification.
  - This same table is semantically "raw sent to dyehouse"; naming can confuse future refactors.
- Future extraction:
  - `operationsController.js`, but only with tests around width allocation and image payloads.

### 5. Finished Received From Dyehouse

- User action: submit production/finished receiving form.
- UI handler: `addBatch(event)` with type `production` or `finished`.
- Validation:
  - Requires allocation for production.
  - Compares quantity to `remainingAtDyehouse`; overage becomes warning in notes rather than hard block.
  - Captures finished width/weight for `finished`.
- Backend write:
  - `POST /api/batches/finished`.
- Verify:
  - No explicit verify.
- Rollback:
  - Yes on null backend result.
- Reload/render:
  - `loadBackendData()`.
- Risk:
  - Soft validation allows over-receive by note.
  - No verify that finished width/weight came back.

### 6. Customer Delivery

- User action: submit customer delivery form.
- UI handler: `addBatch(event)` with type `customer`.
- Validation:
  - Cloth delivery checks available warehouse balance.
  - Cloth return checks return quantity against already delivered.
  - Accessory delivery/return requires accessory type and allocation.
  - Over-delivery/over-return becomes warning in notes.
- Backend write:
  - Cloth: `POST /api/batches/customer`.
  - Accessory: `POST /api/batches/accessory` with movement `customer`.
- Verify:
  - No explicit verify.
- Rollback:
  - Yes on null backend result.
- Reload/render:
  - `loadBackendData()`.
- Risk:
  - Negative quantities for returns are allowed and must remain carefully tested.
  - Cloth and accessory share handler but go to different tables.

### 7. Close / Reopen Order

- User action: click close/reopen operation button.
- UI handler: `toggleOperationClosed()`.
- Validation:
  - `ensureBackendForWrite()`.
- Backend write:
  - `PUT /api/orders/:id` with `operationClosed` toggled.
- Verify:
  - No explicit `verifyOrderPersisted()` here.
- Rollback:
  - Yes on failed save.
- Reload/render:
  - `loadBackendData()`.
- Audit:
  - Backend audit.
- Risk:
  - Closing affects waste calculation display in `orders.js`; this should remain highly protected.

### 8. Dyehouse Transfers

- User action: transfer allocation button.
- UI handler: `transferAllocationDyehouse(id)`.
- Validation:
  - Prompts new dyehouse, quantity, date, note, reason.
  - Warns if transfer quantity exceeds planned or unsent raw balance.
- Backend write:
  - Full transfer: `PUT /api/allocations/:id`, `POST /api/transfers`.
  - Split transfer: `PUT /api/allocations/:id`, `POST /api/orders/:orderId/allocations`, `POST /api/transfers`.
- Verify:
  - No explicit verify transfer/allocation after save.
- Rollback:
  - Yes if any write returns null.
- Reload/render:
  - `loadBackendData()`.
- Risk:
  - Multi-write non-transactional frontend flow. Partial success is possible.
  - Deleting transfer has special reconstruction logic for split/full modes.
- Future extraction:
  - Do not move until a dedicated backend transaction endpoint is considered.

### 9. Raw Returns

- User action: raw return form or raw movement kind `return`.
- UI handler: `addBatch(event)`.
- Validation:
  - Requires allocation/dyehouse selection.
- Backend write:
  - `POST /api/batches/raw-return`.
- Verify:
  - No explicit verify.
- Rollback:
  - Yes on null backend result.
- Reload/render:
  - `loadBackendData()`.
- Risk:
  - Raw return reduces dyehouse balance; any future split must respect calculation coupling.

### 10. Accessories

#### Add / Send Accessory

- UI handler: `addBatch(event)` type `accessory`.
- Validation:
  - Requires accessory type.
  - Sets `movement = 'sent'`.
- Backend write:
  - `POST /api/batches/accessory`.
- Verify:
  - No explicit verify.
- Rollback:
  - Yes on null backend result.

#### Receive Accessory

- UI handler: `addBatch(event)` type `accessoryReceived`.
- Validation:
  - Requires accessory type and allocation.
  - Sets `movement = 'received'`.
- Backend write:
  - `POST /api/batches/accessory`.
- Verify:
  - No explicit verify.

#### Deliver / Return Accessory To Customer

- UI handler: `addBatch(event)` type `customer` with `movementKind` `accessory` or `accessoryReturn`.
- Validation:
  - Requires accessory type and allocation.
  - Computes received, delivered, and available accessory balance.
  - Returns become negative quantity.
- Backend write:
  - `POST /api/batches/accessory`.
- Verify:
  - No explicit verify.

#### Edit / Delete Accessory Movement

- UI handlers:
  - `editBatch('accessory', id)` -> `PUT /api/batches/accessory/:id`.
  - `deleteBatch('accessory', id)` -> `DELETE /api/batches/accessory/:id`.
- Validation:
  - Prompt-based edit.
  - Confirm-based delete.
- Verify:
  - No explicit verify.
- Risk:
  - Accessory quantities affect order summary and documents through `orders.js` and `documents.js`.
- Future extraction:
  - Split into `accessoriesDomain.js` and `operationsController.js` later. Do not move now.

### 11. Delete / Edit Generally

#### Delete Order

- UI handler: `deleteOrder(id)`.
- Backend write:
  - `DELETE /api/orders/:id`.
  - Backend runs graph delete via `deleteOrderGraph()`.
- Verify:
  - No explicit `verifyRecordDeleted('order')`.
- Rollback:
  - Yes on null backend result.
- Reload:
  - `selectedOrderId = null` if needed, `loadBackendData()`.
- Risk:
  - High impact; delete graph is backend-owned.

#### Delete Allocation

- UI handler: `deleteAllocation(id)`.
- Backend write:
  - `DELETE /api/allocations/:id`.
  - Backend runs allocation graph delete.
- Verify:
  - No explicit verify.
- Risk:
  - Removes related movements through backend graph.

#### Delete Movement

- UI handler: `deleteBatch(type, id)`.
- Backend write:
  - Normal movement: `DELETE /api/batches/:type/:id`.
  - Transfer: `DELETE /api/transfers/:id`, plus allocation repair/update/delete depending on split/full mode.
- Verify:
  - No explicit verify.
- Risk:
  - Transfer delete can issue several writes; not transaction-safe from frontend.

#### Edit Movement

- UI handler: `editBatch(type, id)`.
- Backend write:
  - Transfer: `PUT /api/transfers/:id`.
  - Normal movement: `PUT /api/batches/:type/:id`.
- Verify:
  - No explicit verify.
- Risk:
  - Prompt-driven updates can miss field-specific validation.

#### Audit Log

- Frontend `recordAudit()` is still used for UI-side events and old local log structure.
- `persistAuditLog()` currently returns `true` because official audit is in DB table `audit_log`.
- Backend `auditMutation()` records actual DB writes for CRUD, batches, transfers, settings, users, imports.
- Risk:
  - Frontend audit calls can create an impression that local audit is persisted, but official persistence is backend-side.

### 12. System Settings

#### WhatsApp Settings

- UI handler: `saveWhatsappSettingsFromDialog()`.
- Backend write:
  - `PUT /api/settings/whatsappSettings`.
  - Attempts `PUT /api/settings/auditLog`, but backend ignores `auditLog`.
- Verify:
  - No explicit readback verify.
- Rollback:
  - Yes on failed setting save.
- Reload/render:
  - `loadBackendData()`, re-render settings dialog, `syncOutboxToWhatsappService()`.
- Risk:
  - Settings update and outbox sync are separate systems.

#### Dyehouse Price Library

- UI handler: `saveDyehousePricesFromDialog()`.
- Backend write:
  - `saveDyehousePriceLibrary()` -> `PUT /api/settings/dyehousePriceLibrary`.
- Verify:
  - No explicit readback verify.
- Rollback:
  - Restores local `customDyehousePriceLibrary` before `rollbackAfterBackendWriteFailure()`.
- Reload/render:
  - `loadBackendData()`, update pricing options, re-render dialog.

#### Customer Accounts

- UI handlers:
  - `saveCustomerOpeningBalance(customerName)`.
  - `addCustomerPayment(customerName)`.
  - `deleteCustomerPayment(customerName, paymentId)`.
- Backend write:
  - `PUT /api/settings/customerAccounts`.
- Verify:
  - No explicit readback verify.
- Rollback:
  - Yes on failed setting save.
- Reload/render:
  - `loadBackendData()`, re-render ledger.
- Risk:
  - Stored as one JSON setting; concurrent edits could overwrite other customer account changes.

### 13. Users And Permissions

- Files: `modules/usersUi.js`, `app.js`, `backend/server.js`.
- User actions:
  - Create user, edit user, delete user.
- UI handlers:
  - `saveSystemUser(userId)`.
  - `deleteSystemUser(userId)`.
- Validation:
  - New user requires username and password.
  - UI visibility is controlled by `canManageUsers()` and backend `requireRole('admin')`.
- Backend write:
  - Create: `POST /api/users`.
  - Update: `PUT /api/users/:id`.
  - Delete: `DELETE /api/users/:id`.
- Verify:
  - No explicit verify; reloads list through `openUsersDialog()`.
- Rollback:
  - No `rollbackAfterBackendWriteFailure()`; errors surface through thrown `backendRequest()` and caller alert.
- Audit:
  - Backend audit route records user changes.
- Future extraction:
  - Already extracted UI. Could later share common admin save guards, but not urgent.

### 14. WhatsApp Outbox / Report Sending

- Files: `app.js`, `documents.js`, WhatsApp service at `/whatsapp`.
- User action:
  - Generate report/document, enqueue/send/retry.
- UI handlers:
  - `enqueueReport(reportType, order, attachmentPath)`.
  - `syncOutboxToWhatsappService()`.
  - `pollWhatsappService()`.
  - `retryOutbox(id)` if present from UI.
- Save model:
  - Local `reportOutbox` array persisted through `save()` to LocalStorage only.
  - Sync to external service: `POST /whatsapp/api/outbox/sync`.
  - Status read: `GET /whatsapp/api/status`.
- Backend write:
  - Not through `/api` database save flow in current frontend.
- Verify:
  - External service status polling merges remote outbox back into local array.
- Rollback:
  - None; failed sync is silently ignored.
- Retry:
  - Outbox rows include `retryCount`, `status`, `sendingAt`, `sentAt`, `errorMessage`.
- Audit:
  - `recordAudit('create','reportOutbox')`, but official DB audit is not involved.
- Risk:
  - Outbox is not first-class SQLite persistence in this UI flow despite `report_outbox` being returned by bootstrap.
  - Service sync and browser local state can diverge.
- Future extraction:
  - Candidate for `whatsappClient.js` + `whatsappOutboxStore.js` after deciding whether outbox belongs in SQLite.

### 15. A5

- Files: `app.js`.
- Current status:
  - Read-only integration.
- Read endpoints:
  - `GET http://127.0.0.1:3041/api/a5/customers`.
  - `GET http://127.0.0.1:3041/api/a5/customer-ledger?customerName=...`.
- Export:
  - `exportA5AccountingCsv()` creates a local CSV from system data.
- Write action:
  - No write back to A5 was found in the reviewed code.
- Risk:
  - Because A5 is local service at `127.0.0.1:3041`, Railway users will not have this unless local bridge exists.

### 16. Document Review / Imported Documents

- User actions:
  - Confirm Amal order import.
  - Confirm weaving slip / raw issue / production / customer document.
- UI handlers:
  - `confirmAmalOrderImport()`.
  - `confirmWeavingSlip(event)`.
- Backend write:
  - Amal import can delete existing order, create order, create allocations, create raw batch, create accessory batches.
  - Weaving slip can update or create `dyehouse` batch.
  - Production/customer slips create finished/customer batches.
- Verify:
  - No explicit verify after each imported write.
- Rollback:
  - Yes on failed write, but multi-write partial persistence is possible.
- Risk:
  - Very high. These flows import operational data and can touch many tables.
- Future extraction:
  - Should become a dedicated import controller and preferably backend transaction endpoint before refactor.

### 17. Operation Notes From Documents

- User action:
  - Opening some documents prompts operation notes.
- UI handler:
  - `promptOperationNotes(sourceOrder, type, dyehouseName)`.
- Backend write:
  - `PUT /api/orders/:id`.
- Verify:
  - No explicit verify.
- Rollback:
  - Yes on failed save.
- Reload:
  - `loadBackendData()`, then refresh local `sourceOrder.operationNotes`.
- Risk:
  - A read/document action can trigger a write before the document opens.

## Main Risk Areas

1. Multi-step frontend writes are not atomic:
   - Edit order plus allocation updates.
   - Transfer split/full.
   - Delete transfer with allocation repair.
   - Import document with order + allocations + batches.
   - Convert pricing to order then mark pricing converted.

2. Batch/movement writes usually do not run explicit `verifyBatchPersisted()`:
   - They trust returned insert/update response and then reload.
   - This is practical, but weaker than order/pricing verification.

3. `rollbackAfterBackendWriteFailure()` reloads backend state; it does not undo already committed partial writes:
   - The name is operationally useful but should be understood as UI rollback/reload.

4. Settings stored as JSON blobs can overwrite concurrent edits:
   - `customerAccounts`, `whatsappSettings`, `dyehousePriceLibrary`.

5. WhatsApp outbox is not aligned with the main SQLite persistence model:
   - It is local browser state synced to an external service.
   - It has retry/status, but not the same write guard/verify pattern.

## Extraction Recommendation

### `persistenceGuards.js`

Recommendation: yes, but not immediately.

Move later only after defining dependencies explicitly:

- `backendAvailable` getter/setter.
- `updateBackendStatusBadge`.
- `loadBackendData`.
- `alert`.
- `backendRequest`.
- `backendSnapshotCollection`.

Safe first extraction candidate:

```text
backendSnapshotCollection
backendSnapshot
verifyRecordPersisted
verifyRecordDeleted
verifyPricingPersisted
verifyAllocationPersisted
verifyBatchPersisted
verifyTransferPersisted
```

Do not move `ensureBackendForWrite()` and `rollbackAfterBackendWriteFailure()` until UI dependencies are injected cleanly.

### `operationsController.js`

Recommendation: yes, but only after `Persistence & Save Flow Tests`.

Good later split:

- Order controller:
  - new order
  - edit order
  - close order
  - delete order

- Movement controller:
  - raw/dyehouse
  - finished
  - customer
  - raw returns
  - accessory

- Transfer controller:
  - transfer allocation
  - delete/edit transfer

Do not move document import and transfer flows before transactional tests exist.

### `frontendStateStore.js`

Recommendation: yes, after persistence guards.

Reason:

- `loadBackendData()` currently maps DB rows into runtime arrays.
- Many render and save flows directly read/write globals.
- A store layer would reduce globals, but moving it before save guards could make debugging harder.

## Suggested Next Step

Before moving more code:

1. Add tests or scripted checks for:
   - New order with accessory lines.
   - Edit order and allocation dyehouse propagation.
   - Raw sent to dyehouse.
   - Finished received.
   - Customer delivery and return.
   - Accessory sent/received/customer.
   - Transfer split/full.
   - Delete movement and delete transfer.

2. Then extract readback verify helpers into `persistenceGuards.js`.

3. Then consider a backend transactional endpoint for:
   - transfer split/full,
   - document import,
   - converted pricing to order,
   - grouped order registration.


# Architecture Development Plan

## Goal

Develop 2B Tex incrementally without a disruptive rewrite. SQL Server remains the only production source of truth, clients remain thin, and every phase must leave the live operational workflow usable.

## Delivery Order

1. Stabilize persistence, server health, reconnection, and idempotent writes.
2. Establish server-side financial and operational calculation sources.
3. Introduce the order and customer financial centers.
4. Move critical save workflows out of `app.js` into focused controllers and persistence guards.
5. Unify movement-ledger derivation for weaving, dyehouse, warehouse, accessories, and returns.
6. Version operational documents and move A4 PDF generation to a controlled document service.
7. Expand automated operational, financial, database, and visual regression tests.
8. Add atomic releases, health gates, rollback, structured diagnostics, and restore drills.

## Financial Center Rule

The financial center has two scopes:

- Order center: one order/fabric line with estimated versus actual values.
- Customer center: aggregation of all linked order centers plus customer opening balance and collections.

Money must remain separated into at least:

- Weaving/raw fabric money.
- Dyeing and finishing money.
- Customer sales and collections.
- Accessories and other expenses (next financial phase).
- Estimated and recognized margin.

### Quantity Bases

- Estimated weaving = contracted quantity x raw fabric unit cost.
- Actual weaving = raw quantity received from weaving x raw fabric unit cost.
- Estimated dyeing = contracted quantity x dyeing unit cost.
- Actual dyeing = finished quantity received from the dyehouse x dyeing unit cost.
- Recognized sales = customer delivery value; a closed legacy order without delivery may use its contract value and must remain identifiable.
- Manufacturing-only orders never carry raw fabric cost; they carry dyeing/finishing and applicable processing costs only.

The UI and reports must consume the server result and must not repeat these formulas.

## Phase 1 Implementation (2026-08-17)

- Added `backend/financial-center.js` as the first server-side financial calculation source.
- Added `GET /api/financial/orders/:orderId`.
- Added `GET /api/financial/customers/:customerId`.
- Added order/customer financial-center views to the current UI.
- Added `scripts/financial-center-check.js` to the backend verification suite.
- This phase is read-only over existing production data and introduces no schema migration.

## Next Financial Phase

- Persist supplier/dyehouse invoices and payments as immutable financial movements.
- Add accessory and extra-processing actual costs.
- Allocate customer receipts to orders while retaining unallocated customer credit.
- Add due dates, aging, payable/receivable status, and reconciliation with A5 without direct cross-database writes.
- Add adjustment/reversal entries instead of destructive financial edits.

## Persistence Hardening (v2026.08.17.02)

- POST writes now treat a repeated client-generated record ID as a safe replay and return the already-saved row instead of creating a duplicate.
- The rule covers customers/pricing/orders, allocations, operational batches, bulk orders, bulk batches, and dyehouse transfers.
- Bulk replay handling runs inside the same database transaction and does not create duplicate audit entries.
- The client retries a POST once only for a network interruption or retryable server response, using the exact same payload and ID.
- Validation and permission errors are never retried automatically.
- `scripts/save-resilience-check.js` is part of the required backend verification suite.

## Frontend Persistence Extraction (v2026.08.17.03)

- Extracted POST/PUT/DELETE/settings writes and retry policy from `app.js` into `modules/persistenceWriter.js`.
- Preserved the existing function names in `app.js` as compatibility wrappers so operational screens keep the same behavior.
- Added executable behavior tests for transient retry, non-retryable validation errors, and offline fallback.
- Further extraction must continue in small independently tested slices; do not move document layouts or business calculations with persistence code.

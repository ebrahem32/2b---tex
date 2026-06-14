# UI Organization Memory

This file records the current agreed user-interface organization for 2B Tex System.

## Core Principle

The interface must not duplicate the same operational information in the same screen.

If two entries show the same business meaning, keep one clear entry and remove or hide the duplicate shortcut.

## Current Navigation Principle

Each operational balance belongs to its real module:

- Weaving balance belongs under weaving.
- Dyehouse balance belongs under dyehouse.
- Warehouse balance belongs under warehouse.
- Customer/account information belongs under sales or A5/customer ledger.
- Smart follow-up belongs in one combined smart follow-up center.

Dashboard should remain a high-level entry point, not a second copy of every module.

## Home Task Menu

The home task menu is the first action layer after login.

Current purpose:

- Open operations board.
- New customer order.
- New quotation.
- Search orders.
- Reports.
- Smart follow-up center.

The removed ERP map must not be reintroduced as a second navigation layer unless the user explicitly asks for a workflow guide.

## Sidebar Simplification Rules

### Dashboard

Keep one daily follow-up entry.

Do not duplicate:

- Warehouse balance.
- Dyehouse balance.
- Weaving balance.

These are already available in their own modules.

### Weaving

`رصيد النسيج` and `استلام الخام` are treated as one operational area.

Lab samples and raw-material gluing do not belong in weaving.

### Dyehouse

Inside dyehouse, sending raw to dyehouse, and receiving finished fabric are one operational flow.

Keep one clear dyehouse balance/movement entry instead of separate duplicate entries.

Unused dyehouse transfers should not be shown as a main shortcut unless real data and workflow require it.

### Warehouse

There is no separate raw-stock warehouse in the current factory workflow.

Warehouse means finished stock available for customer delivery.

Do not show `رصيد الخام` as a warehouse entry.

### Finished Stock Sale Screen

Arabic screen/process name:

`بيع مجهز`

Purpose:

Sell finished fabric from existing warehouse balance to a customer without opening a new production cycle.

Current screen behavior:

1. Show fabric/items that currently have finished warehouse balance only.
2. User selects an item.
3. Screen opens that item's available colors and quantities.
4. User selects one or more colors.
5. User enters the quantity/weight sold per color.
6. User enters sale data:
   - Receiving customer.
   - Price per kilo.
   - Total value.
   - Date.
   - Payment method/details.
   - Notes.
   - Reference/invoice/permission number if available.
7. User saves the `بيع مجهز` movement.

The screen must show the source stock clearly:

- Source order/customer, such as `2B`.
- Fabric/item.
- Color.
- Available quantity.

`2B` can represent internal factory stock, not only an external customer.

The receiving customer may be different from the source stock owner.

The UI must not route this process through:

- Weaving screens.
- Dyehouse screens.
- Waste screens.
- New production order screens.

This is a warehouse/commercial sale flow only.

### Reports

Do not duplicate reports already represented by module balances.

Current simplification:

- `تقرير الخام المتاح` is equivalent to warehouse/available stock and should not be duplicated.
- `تقرير الطلبات المتأخرة` is available inside operational reports and should not be repeated as clutter.
- `تقرير المصبغة` is represented by `تقرير داخل المصبغة`.

### A5

A5 is read-only from 2B Tex System.

Allowed:

- Customer balances.
- Customer ledger/account statement.

Not allowed unless explicitly requested:

- Exporting movements to A5.
- Writing data back to A5.

## Smart Follow-Up Center

The manager screen and smart employee screen are one combined operational follow-up center.

Do not maintain two identical AI screens.

The smart follow-up center should:

- Show daily operational risks.
- Show late orders.
- Show dyehouse balance.
- Show ready-for-delivery stock.
- Show high waste.
- Let the user open any listed order directly.

## Order Focus View

When an order is opened, it should become the single focused view for that order.

The user should be able to review:

- Summary.
- Colors and balances.
- Movements.
- Warehouse.
- Documents.
- Reports and printing actions.

## Order 360 / Full Order View Concept

`Order 360` is a UI concept added to represent a full operational view of one order.

Important:

- It is not an order number.
- It is not a database ID.
- It is not a customer-facing document number.
- It means a 360-degree operational view of the order cycle.

Business purpose:

```text
Customer Order
↓
Weaving
↓
Dyehouse
↓
Warehouse
↓
Delivery
↓
Closure
```

If the label appears confusing in the UI, prefer Arabic wording such as:

- `ملخص دورة التشغيل`
- `النظرة الكاملة للطلب`
- `متابعة الطلب الكاملة`

Do not treat `360` as a real order field.

## Filters

The filter called `كل الطلبات` must show all orders, including operationally closed orders.

When a user filters by a specific order, customer, dyehouse, or stage, the screen should show only the matching rows to avoid clutter.

## Design Preference

The system is an operations room, not a landing page.

Use compact, work-focused views:

- Clear lists.
- Clear filters.
- No repeated blocks.
- No duplicated navigation paths.
- No decorative layers that look like another system on top of the system.

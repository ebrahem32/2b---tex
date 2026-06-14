# Business Logic

## Operational Cycle

```text
Quotation
↓
Customer Order
↓
Weaving Order
↓
Raw Receiving
↓
Dyeing Order
↓
Send Raw to Dyehouse
↓
Receive Finished Fabric
↓
Warehouse
↓
Customer Delivery
↓
Order Closure
```

## Factory Rules

- The same order number can intentionally exist with different fabric items.
- A quotation is customer-level and may contain multiple fabric/material items.
- When a multi-item quotation is converted to an order, each fabric item must become its own operational order line with the same customer/order number so weaving, dyehouse, warehouse, delivery, and waste remain traceable per item.
- One order can be split into multiple colors.
- Each color is an independent allocation inside the order.
- Receiving is done in batches.
- Sending to dyehouse is done in batches.
- Receiving from dyehouse is done in batches.
- Customer delivery is done in batches.
- Every movement must keep its date and reference.
- Balances are calculated from movements, not edited manually.

## Customer Master Rule

Customer names are master data.

The customers screen is the official source for customer names used by:

- Customer orders.
- Customer quotations.
- Finished-stock sales.
- Customer accounts and ledgers.

To prevent duplicate names, the system normalizes customer-name matching before creating a new customer. This matching ignores:

- Extra spaces.
- Arabic hamza variants such as `ا`, `أ`, `إ`, `آ`.
- Tatweel and Arabic diacritics.

Example:

```text
امل فاشون
أمل فاشون
إمل فاشون
```

These should resolve to the same customer record, using the official name saved in the customers screen.

## Finished Stock Sale

Arabic operating name:

`بيع مجهز`

Meaning:

`بيع مجهز` is a sale/delivery from existing finished warehouse stock to a customer.

It is not a new weaving order and not a new dyeing order.

Important factory case:

- Some stock may be produced under the internal/customer name `2B`.
- In this case, `2B` represents factory-owned stock or warehouse stock.
- Other customers may buy from this finished stock later.
- The movement must reduce the original warehouse balance.
- The receiving/buying customer must have their own commercial record for the sale.

Operational behavior:

1. Open `بيع مجهز`.
2. Show only items that currently exist in finished warehouse stock.
3. Select the required fabric/item.
4. Show available colors and quantities for that item.
5. Select one or more colors.
6. Enter sold quantities per color.
7. Enter customer, price, date, payment data, notes, and reference number if available.
8. Save the sale movement.

Effects:

- Reduces finished warehouse stock from the selected source order/allocation.
- Creates a commercial sale/delivery record for the receiving customer.
- Appears in the receiving customer's account/ledger.
- Appears in warehouse movement reports.
- Appears in sales/finished-stock sale reports.

Must not:

- Create a weaving order.
- Create a dyeing order.
- Send anything to dyehouse.
- Receive new finished fabric.
- Calculate operational waste for the receiving customer.
- Change dyehouse or weaving balances.

Validation:

- The sold quantity for each color must not exceed the available warehouse balance for that color.
- If requested quantity is greater than available quantity, block saving or show a clear warning.

## Waste Logic

- Waste is not calculated when raw fabric is sent to the dyehouse.
- Remaining dyehouse balance stays active until it is received, returned, or confirmed as waste.
- Waste is recorded when it is proven or when the operational cycle is closed.

## Dyehouse Balance Rule

```text
Remaining inside dyehouse
= Total sent to dyehouse
- Total received finished
- Closed waste if any
- Raw returns if any
```

## Example

```text
Sent to dyehouse: 1250 kg
Received finished: 1200 kg
Waste: 50 kg
Waste percentage: 4%
```

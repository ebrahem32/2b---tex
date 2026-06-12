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
- One order can be split into multiple colors.
- Each color is an independent allocation inside the order.
- Receiving is done in batches.
- Sending to dyehouse is done in batches.
- Receiving from dyehouse is done in batches.
- Customer delivery is done in batches.
- Every movement must keep its date and reference.
- Balances are calculated from movements, not edited manually.

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


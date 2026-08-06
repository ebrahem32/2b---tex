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

## Fabric Master Rule

Fabric/item names are master data.

The official fabric list is used by:

- Customer orders.
- Grouped order items.
- Customer quotations.
- Quotation item rows.
- Fabric filters and selection helpers.

To prevent duplicate fabric names, the system normalizes matching before saving a new order or quotation item. This matching ignores:

- Extra spaces.
- Arabic hamza variants such as `ا`, `أ`, `إ`, `آ`.
- Tatweel and Arabic diacritics.

Example:

```text
بيكا قطن استرتر
بيكا  قطن إسترتر
بيكا قطن أسترتر
```

Supported spelling variants should resolve to the official fabric name saved in the fabric master list. Historical records are not rewritten automatically; cleanup must be a separate controlled migration.

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

- Negative or insufficient finished-stock balance must not be hidden.
- If the requested sale quantity is greater than the available quantity, the system may save the sale movement but must attach a clear warning note to the movement.
- The warning keeps the stock issue visible for later operational review instead of silently blocking or hiding the problem.

## Waste Logic

- Waste is not calculated when raw fabric is sent to the dyehouse.
- Remaining dyehouse balance stays active until it is received, returned, or confirmed as waste.
- Actual waste quantity is the confirmed operational difference:
  `raw sent to dyehouse - finished received - raw returned`.
- Actual waste percentage is calculated on finished received weight:
  `actual waste quantity / finished received`.
- Pricing cards that use operational waste should use this finished-weight percentage, while the pricing cost basis (`صافي` or `قائم`) still controls which costs receive that percentage.
- Waste is recorded when it is proven or when the operational cycle is closed.

## Order Business Mode

Every customer order must explicitly use one of these modes:

- `trade`: 2B buys/owns the raw fabric and sells the completed product. Raw-fabric price and estimated raw waste participate in commercial calculations.
- `manufacturing`: customer-owned raw fabric; 2B performs dyeing/manufacturing services only. Raw-fabric price and estimated raw waste must be zero and must not enter the contract calculation.

Historical manufacturing rows that contain old raw-price or estimated-waste values are normalized to zero in runtime reads. Editing and saving the order persists the corrected zero values.

## Planned Waste Loading For Production Documents

Estimated pricing waste is a planning addition, separate from confirmed actual operational waste.

- Customer color allocation remains the customer's ordered quantity.
- Dyeing work-order quantity per color is:
  `customer color quantity + (customer color quantity × expected waste percent)`.
- Dyeing work-order total is the sum of all waste-loaded colors.
- Example: ten colors of 500 kg at 10% become ten operating lines of 550 kg and a dyeing total of 5,500 kg.
- Manufacturing-only/customer-owned-raw orders do not receive this estimated raw-waste addition.

## Weaving Raw Components And Shania

- A weaving order may contain separate raw-production components inside the same customer order.
- Same-name components must not be merged when specification or operating percentage differs.
- Example: `ممشط 4000`, `شانيه فاتح 2% 500`, and `شانيه فاتح 8% 500` are three independent rows.
- Component customer quantities must sum exactly to the customer order quantity.
- Estimated waste is calculated independently for every component.
- Rib/accessory quantity is distributed onto and displayed below each component, based on its saved percentage or proportional manual total.
- Weaving work orders intentionally omit the color table and the separate accessory table.
- Weaving header shows date, customer, and weaving factory/supplier once. Inch, fabric, prepared weight, and customer quantity appear together in the first operating-data row.

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

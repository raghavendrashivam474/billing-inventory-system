# ADR 0015 — Inventory Mutation Through Business Events

## Status
Accepted — Sprint 3.3

## Context
The application manages product stock across multiple warehouses.
Inventory balances must change in response to business operations:
- Goods Receipt (purchase receipt)
- Stock Adjustment (manual correction)
- Future: Sales, Transfers, Returns

## Problem
Direct inventory editing via a PATCH /inventory/:id endpoint would:
- Provide no business context for why stock changed
- Create gaps in the audit trail
- Make operational investigation impossible
- Risk silent data corruption

## Decision
Inventory balances must never be directly mutated through
public business APIs.

All inventory changes must originate from explicitly modeled
business events that:
1. Describe WHY the stock changed
2. Generate an immutable Stock Movement ledger record
3. Update the Inventory balance atomically within one transaction

## Implemented Business Events

| Event | Module | Movement Type |
|---|---|---|
| Goods Receipt | goods-receipt | PURCHASE_RECEIPT |
| Stock Adjustment | stock-adjustment | ADJUSTMENT_IN / ADJUSTMENT_OUT |

## Future Business Events (Planned)

| Event | Movement Type |
|---|---|
| Sales Order Dispatch | SALE |
| Stock Transfer Out | TRANSFER_OUT |
| Stock Transfer In | TRANSFER_IN |
| Return Receipt | RETURN_IN |

## Rejected Alternatives

### Direct Inventory CRUD
Rejected — no audit trail, no business context.

### Inventory Update Without Ledger
Rejected — cannot reconstruct history,
operational investigations become impossible.

### Ledger-Only (SUM to get current)
Not selected currently because:
- Inventory reads are operationally frequent
- SUM aggregation becomes expensive at volume
- Materialized balance provides O(1) reads
This remains a valid future architectural option.

## Consequences
- All inventory mutations require a business event model
- Inventory balance is always consistent with the ledger
- Latest StockMovement.quantityAfter = Inventory.quantity
- Full audit trail available for every stock change
- No unauthorized inventory modifications are possible
# ADR 0017 — Dispatch as Inventory Mutation Event

## Status
Accepted — Sprint 3.5

## Context
After Sales Order confirmation, physical goods must leave the
warehouse. A controlled business event is needed to:
1. Record the shipment
2. Reduce inventory
3. Create an audit trail

## Decision
Dispatch is the outbound inventory mutation event.
It is the outbound equivalent of Goods Receipt.

| Event | Direction | Movement Type |
|---|---|---|
| Goods Receipt | Inbound | PURCHASE_RECEIPT |
| Stock Adjustment | Correction | ADJUSTMENT_IN/OUT |
| Dispatch | Outbound | SALE_DISPATCH |

## Invariants
- quantityAfter = quantityBefore - quantityDispatched
- One DispatchItem = One SALE_DISPATCH movement
- Inventory never goes negative
- Dispatch is atomic with inventory and movement creation

## Consequences
- Complete event-driven inventory audit trail
- Every stock change has a corresponding business event
- Inventory balance always reconcilable with movement ledger
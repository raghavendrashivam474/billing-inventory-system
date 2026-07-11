# ADR 0009 — Purchase Order Aggregate Boundary

## Status
Accepted — Sprint 3.1

## Context
The Purchase Order domain involves a header (PurchaseOrder) and
multiple line items (PurchaseOrderItem). These must always be
consistent with each other.

## Decision
PurchaseOrder is the aggregate root.
PurchaseOrderItem is owned exclusively by PurchaseOrder.
No public API exists for PurchaseOrderItem.
All item operations go through the Purchase Order workflow.

## Consequences
- Items cannot exist without a Purchase Order
- Totals remain synchronized with items
- Status rules are consistently enforced
- Transaction integrity remains centralized
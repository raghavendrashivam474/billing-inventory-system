# ADR 0014 — Separate Purchase Order Lifecycle from Receipt Progress

## Status
Accepted — Sprint 3.2

## Context
A Purchase Order has two independent state dimensions:
1. Commercial lifecycle (DRAFT → CONFIRMED → CANCELLED)
2. Physical receipt progress (NOT_RECEIVED → PARTIALLY_RECEIVED → FULLY_RECEIVED)

## Problem
Merging both into one status field creates invalid combinations
and makes the domain model ambiguous.

## Decision
Maintain two separate enum fields on PurchaseOrder:
- status: PurchaseOrderStatus (commercial lifecycle)
- receiptStatus: PurchaseOrderReceiptStatus (fulfillment progress)

## Valid Combinations

| status    | receiptStatus        | Meaning                        |
|-----------|----------------------|--------------------------------|
| CONFIRMED | NOT_RECEIVED         | Ordered, nothing arrived yet   |
| CONFIRMED | PARTIALLY_RECEIVED   | Some goods arrived             |
| CONFIRMED | FULLY_RECEIVED       | All goods arrived              |
| CANCELLED | NOT_RECEIVED         | Cancelled before any receipt   |

## Consequences
- Clear separation of business concerns
- receiptStatus is automatically maintained by Goods Receipt Service
- status is controlled by explicit confirm/cancel operations
- Both dimensions can be queried and filtered independently
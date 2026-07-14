# Stock Adjustment Management

## Sprint: 3.3 — Stock Adjustment Management

---

## Purpose
Stock Adjustments provide a controlled, auditable workflow for
correcting inventory quantities when physical stock differs from
system records.

## Business Problem
Real warehouse stock may differ from system records due to:
- Physical count discrepancies
- Damaged stock
- Lost or stolen items
- Expired products
- Historical data corrections
- Operational errors

Direct inventory editing is prohibited.
All corrections must occur through Stock Adjustment business events.

## Domain Architecture
Stock Adjustment → WHY stock changed
Stock Movement → HOW stock changed
Inventory → WHAT stock is now


## Adjustment Types

| Type | Description |
|---|---|
| INCREASE | Adds stock to inventory |
| DECREASE | Removes stock from inventory |

## Adjustment Reasons

| Reason | Description |
|---|---|
| PHYSICAL_COUNT | Physical count differs from system |
| DAMAGED | Stock physically damaged |
| LOST | Stock lost or stolen |
| EXPIRED | Stock expired |
| DATA_CORRECTION | Correcting historical data entry |
| OTHER | Other reason (explain in notes) |

## Quantity Semantics
Client always provides a positive quantity.
The service calculates the signed delta:
- INCREASE: signedQuantity = +quantity
- DECREASE: signedQuantity = -quantity

## Missing Inventory Policy

| Scenario | Behavior |
|---|---|
| INCREASE, no inventory record | Create record, quantityBefore = 0 |
| DECREASE, no inventory record | Reject 422 — no stock to remove |

## Negative Inventory Prevention
quantityAfter must always be >= 0.
Requests that would produce negative inventory are rejected with 422.

## Atomic Transaction
Every adjustment creates atomically:
1. StockAdjustment record
2. Inventory upsert
3. StockMovement ledger entry

## Adjustment Number Format
ADJ-YYYY-NNNNNN
Example: ADJ-2026-000001

## Immutability
Stock Adjustments are immutable after posting.
No PATCH, DELETE, or RESTORE endpoints exist.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/stock-adjustments | List with filters |
| GET | /api/v1/stock-adjustments/:id | Get single adjustment |
| POST | /api/v1/stock-adjustments | Post adjustment |

## Query Parameters
page, limit, search, productId, warehouseId,
adjustmentType, reason, fromDate, toDate, sort, order

## Verified Ledger (Sprint 3.3 Test Data)

| ADJ | Type | Qty | Before | After |
|---|---|---|---|---|
| ADJ-000001 | INCREASE | +5 | 2 | 7 |
| ADJ-000002 | DECREASE | -2 | 7 | 5 |
| ADJ-000003 | INCREASE | +10 | 0 | 10 |
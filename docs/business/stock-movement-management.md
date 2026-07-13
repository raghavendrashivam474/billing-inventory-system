# Stock Movement Management

## Sprint: 3.2 — Goods Receipt, Inventory & Stock Movement

---

## Overview
Stock Movements are an immutable, append-only audit ledger.
Every inventory quantity change creates exactly one stock movement.

## Invariant
quantityAfter = quantityBefore + quantity (for PURCHASE_RECEIPT)

## Movement Types (Sprint 3.2)
- PURCHASE_RECEIPT — goods received from supplier

## Future Movement Types
- SALE, ADJUSTMENT_IN, ADJUSTMENT_OUT
- TRANSFER_IN, TRANSFER_OUT
- RETURN_IN, RETURN_OUT

## Reference Architecture
Each movement links to its originating business event:
- referenceType: GOODS_RECEIPT
- referenceId: GoodsReceipt.id

## Immutability
Stock Movements are never:
- Updated
- Soft deleted
- Hard deleted via API

## API Endpoints (Read-Only)

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/stock-movements | List with filters |
| GET | /api/v1/stock-movements/:id | Get single movement |

## Verified Audit Trail (Sprint 3.2 Test Data)

| SM | Product | Before | Qty | After | GRN |
|---|---|---|---|---|---|
| 1 | Dell Inspiron | 0 | +1 | 1 | GRN-000001 |
| 2 | Samsung Galaxy | 0 | +2 | 2 | GRN-000001 |
| 3 | Dell Inspiron | 1 | +1 | 2 | GRN-000002 |
| 4 | Samsung Galaxy | 2 | +1 | 3 | GRN-000002 |
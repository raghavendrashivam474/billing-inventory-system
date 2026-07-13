# Goods Receipt Management

## Sprint: 3.2 — Goods Receipt, Inventory & Stock Movement

---

## Overview
A Goods Receipt records the physical arrival of goods
against a Confirmed Purchase Order.
It triggers inventory updates and stock movement records atomically.

## Business Rules
- Only CONFIRMED Purchase Orders can receive goods
- Warehouse is derived from Purchase Order — not client-supplied
- Partial receipts are supported
- Multiple GRNs can reference one Purchase Order
- Over-receipt is rejected
- GRNs are immutable after posting
- GRN number format: GRN-YYYY-NNNNNN

## Workflow
Confirmed PO → Create GRN → Validate quantities →
Atomic transaction: GRN + Items + Inventory + Stock Movements + PO status update

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/goods-receipts | List with filters |
| GET | /api/v1/goods-receipts/:id | Get with full nested data |
| POST | /api/v1/goods-receipts | Create and post GRN |

## No Update or Delete
Goods Receipts are immutable after posting.
Use inventory adjustments (future sprint) to correct errors.
# Dispatch / Fulfilment Management

## Sprint: 3.5 — Dispatch / Fulfilment Management

---

## Overview
A Dispatch represents a physical warehouse shipment against a
Confirmed Sales Order. It reduces inventory and creates immutable
SALE_DISPATCH stock movements.

## Business Position
Sales Order (CONFIRMED)
│
▼
Dispatch
│
├── Inventory reduced
├── Stock Movement created (SALE_DISPATCH)
└── Sales Order dispatchStatus updated

## Business Rules
- Only CONFIRMED Sales Orders can be dispatched
- Dispatch warehouse = Sales Order warehouse (not client-supplied)
- Partial dispatches are supported
- Multiple dispatches per Sales Order are supported
- Over-dispatch is prevented
- Negative inventory is prevented
- Every DispatchItem creates exactly one SALE_DISPATCH movement
- Dispatch posting is atomic
- Dispatches are immutable after posting

## Dispatch Number Format
DSP-YYYY-NNNNNN
Example: DSP-2026-000001

## dispatchStatus Lifecycle

| Status | Meaning |
|---|---|
| NOT_DISPATCHED | No items dispatched yet |
| PARTIALLY_DISPATCHED | Some items dispatched |
| FULLY_DISPATCHED | All ordered quantities dispatched |

When FULLY_DISPATCHED: Sales Order status advances to FULFILLED.

## Stock Movement Created
type          = SALE_DISPATCH
referenceType = DISPATCH
referenceId   = Dispatch.id
quantity      = negative (stock leaving warehouse)

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/dispatches | List with filters |
| GET | /api/v1/dispatches/:id | Get full aggregate |
| POST | /api/v1/dispatches | Create and post dispatch |

## Verified Ledger (Sprint 3.5)

| Movement | Type | Qty | Before | After |
|---|---|---|---|---|
| DSP-000001 | SALE_DISPATCH | -1 | 5 | 4 |
| DSP-000002 | SALE_DISPATCH | -1 | 4 | 3 |
# Invoice Management

## Sprint: 3.6 — Invoice Management

---

## Overview
An Invoice is a financial document that requests payment from a
customer for goods that have been delivered via Dispatch.

## Position in the Business Flow
Sales Order (FULFILLED)
│
▼
Dispatch (completed)
│
▼
Invoice (financial request)
│
▼
Payment (Sprint 3.7)


## Key Principle
Invoice belongs to the financial layer.
It does NOT affect inventory.
Inventory ends at Dispatch.

## Financial Snapshot
Invoice items capture pricing at creation time.
Product prices are never re-read after invoice creation.
SalesOrderItem.unitPrice → InvoiceItem.unitPrice (snapshot)
SalesOrderItem.taxRate → InvoiceItem.taxRate (snapshot)


## Invoice Number Format
INV-YYYY-NNNNNN
Example: INV-2026-000001

## Lifecycle

| Status | Meaning |
|---|---|
| DRAFT | Created, editable |
| ISSUED | Sent to customer, locked |
| PARTIALLY_PAID | Part payment received |
| PAID | Fully paid |
| VOID | Cancelled |

## Business Rules
- Only FULFILLED Sales Orders can be invoiced
- Dispatch must belong to the referenced Sales Order
- Financial calculations use decimal.js (no floating-point)
- Invoice creation is atomic
- Only DRAFT invoices can be updated
- PAID invoices cannot be voided
- Inventory is never modified

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/invoices | List with filters |
| GET | /api/v1/invoices/:id | Get full aggregate |
| POST | /api/v1/invoices | Create invoice |
| PATCH | /api/v1/invoices/:id | Update DRAFT |
| PATCH | /api/v1/invoices/:id/issue | Issue invoice |
| PATCH | /api/v1/invoices/:id/void | Void invoice |

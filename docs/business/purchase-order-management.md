# Purchase Order Management

## Sprint: 3.1 — Purchase Order Management

---

## Overview
Purchase Orders represent commercial intent to purchase products
from a supplier for delivery to a warehouse.
They do NOT modify inventory quantities.

## Domain Relationships
Supplier → PurchaseOrder → Warehouse
PurchaseOrder → PurchaseOrderItem → Product

## Status Lifecycle
DRAFT → CONFIRMED → CANCELLED
DRAFT → CANCELLED

## Business Rules
- Only DRAFT POs can be modified
- Confirmation revalidates all FK references
- Tax rate is snapshotted at creation time
- All monetary calculations are server-side
- Duplicate products in items are rejected
- Order number is backend-generated: PO-YYYY-NNNNNN

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/purchase-orders | List with filters |
| GET | /api/v1/purchase-orders/:id | Get with full nested data |
| POST | /api/v1/purchase-orders | Create DRAFT |
| PATCH | /api/v1/purchase-orders/:id | Update DRAFT |
| PATCH | /api/v1/purchase-orders/:id/confirm | Confirm |
| PATCH | /api/v1/purchase-orders/:id/cancel | Cancel |

## Calculation Formula
baseAmount = quantity × unitCost
itemTaxAmount = baseAmount × taxRate / 100
lineTotal = baseAmount + itemTaxAmount
subtotal = SUM(baseAmount)
totalTax = SUM(itemTaxAmount)
totalAmount = subtotal + totalTax
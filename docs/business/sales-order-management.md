# Sales Order Management

## Sprint: 3.4 — Sales Order Management

---

## Overview
A Sales Order represents commercial demand from a customer.
It records what a customer wants to purchase from a specific warehouse.

## Critical Architectural Boundary
Sales Order = Commercial Demand
Dispatch = Physical Stock Event (future sprint)


Sales Order confirmation validates inventory availability.
Sales Order confirmation does NOT reduce inventory.
Inventory reduction belongs to a future Dispatch workflow.

## Domain Relationships
Customer → SalesOrder → Warehouse
SalesOrder → SalesOrderItem → Product
SalesOrder (confirmation) → Inventory (read-only validation)

## Lifecycle
DRAFT ──────────────► CONFIRMED
│
└────────────────► CANCELLED

FULFILLED is reserved for the future Dispatch workflow.

## Pricing Snapshots
At order creation, current Product values are snapshotted:
- SalesOrderItem.unitPrice = Product.sellingPrice (at time of order)
- SalesOrderItem.taxRate   = Product.taxRate.rate (at time of order)

Future price changes do not affect existing orders.

## Calculation Rules
item.subtotal = quantity × unitPrice
taxableAmount = subtotal - item.discountAmount
item.taxAmount = taxableAmount × taxRate / 100
item.totalAmount = taxableAmount + taxAmount

SO.subtotal = SUM(item.subtotal)
SO.taxAmount = SUM(item.taxAmount)
SO.totalAmount = SUM(item.totalAmount) - SO.discountAmount


All calculations are server-side. Client never supplies monetary totals.

## Inventory Availability at Confirmation
Confirmation validates current inventory is sufficient.
Inventory quantity remains unchanged after confirmation.
No Stock Movements are created by Sales Order confirmation.

## DRAFT Mutability
Only DRAFT Sales Orders can be modified.
CONFIRMED and CANCELLED orders are immutable.

## Sales Order Number Format
SO-YYYY-NNNNNN
Example: SO-2026-000001

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/sales-orders | List with filters |
| GET | /api/v1/sales-orders/:id | Get full aggregate |
| POST | /api/v1/sales-orders | Create DRAFT |
| PATCH | /api/v1/sales-orders/:id | Update DRAFT |
| PATCH | /api/v1/sales-orders/:id/confirm | Confirm |
| PATCH | /api/v1/sales-orders/:id/cancel | Cancel DRAFT |

## Verified Inventory Boundary (Sprint 3.4)
Product 2 (Samsung Galaxy S24) inventory = 3 units
After SO-2026-000001 confirmed (qty=2): inventory still = 3 units
Stock Movement count: unchanged

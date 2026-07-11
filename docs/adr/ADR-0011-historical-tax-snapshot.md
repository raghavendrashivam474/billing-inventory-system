# ADR 0011 — Historical Tax Snapshot Strategy

## Status
Accepted — Sprint 3.1

## Context
Product tax rates change over time. Historical Purchase Orders must
reflect the tax rate at the time of creation, not the current rate.

## Decision
At Purchase Order creation, the current tax rate from the Product's
TaxRate relation is copied into PurchaseOrderItem.taxRate as a
numeric value. This snapshot is immutable after creation.

## Consequences
- Historical records are financially accurate
- Tax rate changes do not affect existing Purchase Orders
- PurchaseOrderItem.taxRate is a Decimal field, not a foreign key
- If a Product has no Tax Rate, taxRate = 0
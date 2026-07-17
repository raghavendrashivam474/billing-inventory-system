# ADR 0018 — Invoice as Financial Snapshot

## Status
Accepted — Sprint 3.6

## Context
Invoice items must preserve pricing at the time of invoice creation.
Product prices may change after invoicing.

## Decision
Invoice items snapshot all commercial values from SalesOrderItem:
- unitPrice
- taxRate
- discountAmount
- subtotal, taxAmount, totalAmount

Product master data is never accessed during invoice display or
recalculation. The snapshot is immutable after creation.

## Consequences
- Historical invoices are financially accurate regardless of price changes
- Invoice calculations are deterministic and auditable
- No dependency on Product pricing after invoice creation
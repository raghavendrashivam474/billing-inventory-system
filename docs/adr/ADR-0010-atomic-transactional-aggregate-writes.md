# ADR 0010 — Atomic Transactional Aggregate Writes

## Status
Accepted — Sprint 3.1

## Context
Creating a Purchase Order requires writing to two tables simultaneously:
purchase_orders and purchase_order_items.
Partial writes would leave the database in an inconsistent state.

## Decision
All Purchase Order writes use prisma.$transaction().
If any operation within the transaction fails, the entire transaction
is rolled back. No partial Purchase Orders can exist.

## Consequences
- Atomic consistency guaranteed
- No partial Purchase Orders in database
- Slightly higher database connection usage per request
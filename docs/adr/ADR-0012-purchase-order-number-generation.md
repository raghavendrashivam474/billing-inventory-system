# ADR 0012 — Purchase Order Number Generation

## Status
Accepted — Sprint 3.1

## Context
Purchase Orders need a human-readable business identifier.
Sequential numbering must be safe under concurrent requests.

## Decision
Format: PO-YYYY-NNNNNN
The last order number for the current year is fetched and
incremented. Prisma's unique constraint on orderNumber prevents
duplicates. This approach is safe for low-to-medium concurrency.

## Consequences
- Human-readable business identifiers
- Unique constraint prevents duplicates
- High concurrency scenarios may require a database sequence
  in a future sprint
- Year-based sequencing resets per year
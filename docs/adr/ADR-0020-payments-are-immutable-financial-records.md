# ADR 0020 — Payments Are Immutable Financial Records

## Status
Accepted — Sprint 3.7

## Context
Payment records must have the highest integrity in the system.
They represent actual money movement and are subject to
audit and accounting requirements.

## Decision
Payments are strictly immutable after creation.
No PATCH, DELETE, or RESTORE endpoints exist.

If a payment was recorded incorrectly:
- A future Refund workflow will reverse it via a new record
- The original payment remains as historical evidence

## Consequences
- Complete audit trail of all financial transactions
- No accidental data loss or corruption
- Compliance with accounting principles (no deletion of financial records)
- Corrections require new business events, not edits
- Foundation for future Refund and Credit Note modules

## Related Principles
- Stock Movements are immutable (ADR-0013)
- Invoices operate independently of inventory (ADR-0019)
- Payments operate independently of inventory and dispatch
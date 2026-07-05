# ADR 0008 — Soft Delete Strategy

## Status
Accepted — Sprint 2.3

## Context
Business data must never be permanently deleted.
Deleted records may be referenced by historical transactions.

## Decision
All master data modules use soft delete via isActive flag.

## Implementation
- DELETE sets isActive = false
- PATCH /restore sets isActive = true
- No hard DELETE operations permitted on master data

## Consequences
- Data is always recoverable
- Historical references remain valid
- List endpoints should filter by active state by default
- Reporting must account for inactive records
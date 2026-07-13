# ADR 0013 — Separate Current Inventory Balance from Immutable Stock Movement History

## Status
Accepted — Sprint 3.2

## Context
The application needs two capabilities:
- Fast current stock reads for operational use
- Historical stock auditability for compliance and debugging

## Options Considered

### Option A — Inventory only
Store current quantity on Inventory.
Problem: History is lost. Cannot audit how stock reached current level.

### Option B — Stock Movements only (sum to get current)
Store only movements, calculate current stock via SUM.
Problem: Expensive reads. Performance degrades with volume.

### Option C — Both (Selected)
Maintain Inventory for current state.
Maintain StockMovement as immutable append-only ledger.
Every controlled mutation updates both atomically.

## Decision
Option C — Dual model approach.

Inventory.quantity = current authoritative stock balance
StockMovement = immutable historical audit trail

## Consequences
- Current stock reads are fast O(1) lookups
- Full stock history available via StockMovement
- Every mutation must update both tables atomically
- StockMovements are never edited or deleted
- Inventory is never directly mutated via public API
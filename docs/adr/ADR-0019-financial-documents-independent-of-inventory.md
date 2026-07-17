# ADR 0019 — Financial Documents Independent of Inventory

## Status
Accepted — Sprint 3.6

## Context
Invoice creation must not affect physical warehouse stock.
The financial and physical layers must remain separated.

## Decision
Invoice creation does not modify:
- Inventory quantities
- Stock Movements
- Dispatch records
- Sales Order item data

## Boundary
Physical Layer: Dispatch → Inventory reduction → Stock Movement
Financial Layer: Invoice → Payment tracking


These layers are connected through Sales Order but operate independently.

## Consequences
- Voiding an invoice does not restore inventory
- Inventory restoration requires a separate Return workflow
- Financial reporting and inventory reporting use separate data sources
- The system maintains clean separation of physical and financial concerns
# ADR 0016 — Sales Order Confirmation Does Not Mutate Inventory

## Status
Accepted — Sprint 3.4

## Context
A Sales Order represents customer demand for products.
The question arose: should confirming a Sales Order immediately
reduce inventory to reserve stock for the customer?

## Decision
Sales Order confirmation must NOT mutate physical inventory.

Inventory remains unchanged at confirmation.
No Stock Movement is created at confirmation.

## Rationale

### Sales Order = Commercial Demand
A confirmed Sales Order means the business has accepted the order.
It does not mean goods have physically left the warehouse.

### Dispatch = Physical Stock Event
Physical inventory reduction occurs when goods are actually dispatched.
This belongs to a future Dispatch/Fulfilment business event.

### Separation of Concerns
Commercial Layer: Sales Order (demand)
Physical Layer: Dispatch (supply reduction)


Merging these would create premature inventory commitments
and make partial fulfilment, order splits, and cancellations complex.

## Future Workflow
CONFIRMED Sales Order
│
▼
Dispatch / Fulfilment (future Sprint 3.5+)
│
├── Inventory.quantity -= dispatched quantity
└── StockMovement created (type: SALE)


## Verified Invariants (Sprint 3.4)
- Inventory before SO confirmation = Inventory after SO confirmation
- Stock Movement count before = Stock Movement count after
- No SALE type movements exist until Dispatch is implemented

## Consequences
- Inventory is never reserved or locked by Sales Orders
- Cancellation of confirmed orders requires no inventory rollback
- Dispatch workflow must validate inventory availability independently
- Multiple Sales Orders may reference the same inventory simultaneously

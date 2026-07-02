# ADR-0007 — Establish Master Data Before Business Transactions

**Date:** 02 July 2026

**Status:** Accepted

**Sprint:** Sprint 2.1 — Master Data Foundation

**Authors:** Raghavendra Singh

---

# Context

Billing and Inventory Management Systems operate on interconnected business entities.

Business operations such as purchasing inventory, selling products, generating invoices, and tracking stock cannot exist independently. They depend on foundational reference data that defines the core business objects.

Attempting to implement transactional modules before establishing this foundation would result in incomplete relationships, duplicated data, and frequent schema changes.

A structured data model was required before implementing business workflows.

---

# Decision

The project establishes all master data entities before implementing any transactional modules.

The following entities are considered foundational:

- Category
- Brand
- Unit
- Tax Rate
- Product
- Supplier
- Customer
- Warehouse

These entities are created first and serve as dependencies for future business operations.

---

# Relationship Overview

```
Category
     │
     ▼
 Product ◀──────── Brand
     │
     ├──────── Unit
     │
     ├──────── TaxRate
     │
     ▼
Inventory

Supplier
     │
     ▼
Purchase Order
     │
     ▼
Stock Movement
     │
     ▼
Warehouse

Customer
     │
     ▼
Sales Order
     │
     ▼
Invoice
```

---

# Rationale

Master data changes infrequently but is referenced throughout the application.

For example:

- Every Product belongs to a Category.
- Every Product belongs to a Brand.
- Every Product uses a Unit.
- Every Product references a Tax Rate.
- Purchases require Suppliers.
- Sales require Customers.
- Inventory requires Warehouses.

Without these entities:

- Purchases cannot reference suppliers.
- Products cannot exist.
- Inventory cannot track stock.
- Sales cannot generate invoices.

Therefore, master data forms the foundation of the system.

---

# Alternatives Considered

## Option 1 — Build Transaction Modules First

Example:

Purchase Orders

Sales

Inventory

Invoices

### Advantages

- Visible features appear sooner.

### Disadvantages

- Numerous placeholder fields.
- Repeated schema changes.
- Broken relationships.
- Frequent database migrations.
- Increased technical debt.

Decision: Rejected.

---

## Option 2 — Build Master Data First

### Advantages

- Stable database structure.
- Clear entity relationships.
- Fewer future migrations.
- Easier API implementation.
- Cleaner business logic.
- Better long-term maintainability.

Decision: Accepted.

---

# Consequences

## Positive

- Database relationships are defined early.
- Product module has all required references.
- Future transaction modules can reuse existing entities.
- Business logic becomes simpler.
- API contracts become stable.

## Negative

- Early sprints contain fewer visible user features.
- More upfront planning is required.

---

# Master Data Scope

Sprint 2.1 introduces the following entities:

| Entity | Purpose |
|---------|---------|
| Category | Product classification |
| Brand | Product manufacturer or brand |
| Unit | Measurement unit (Piece, Kg, Litre, etc.) |
| TaxRate | GST or other applicable tax |
| Product | Sellable inventory item |
| Supplier | Purchase source |
| Customer | Sales recipient |
| Warehouse | Physical inventory location |

These entities act as the reference layer for future modules.

---

# Engineering Rules Established

The following rules are now mandatory:

- Transaction modules must reference master data instead of duplicating information.
- Products must reference Category, Brand, Unit, and Tax Rate.
- Purchases must reference Suppliers.
- Sales must reference Customers.
- Inventory must reference Products and Warehouses.
- Master data should support soft deletion through the `isActive` flag.
- Business transactions must preserve referential integrity.

---

# Future Impact

This decision enables the implementation of:

- Category Management
- Brand Management
- Product Management
- Purchase Orders
- Goods Receipts
- Stock Transfers
- Inventory Tracking
- Sales Orders
- Billing
- Reporting
- Analytics

The master data layer becomes the foundation for all subsequent business modules.

---

# References

- Sprint 2.1 — Master Data Foundation
- Prisma Schema
- Master Data Documentation
- Backend Architecture Documentation
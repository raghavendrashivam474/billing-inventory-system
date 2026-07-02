# Glossary

This glossary defines the business and technical terminology used throughout the **Billing & Inventory Management System**.

The objective is to establish a shared vocabulary across documentation, code, APIs, and future contributors.

Unless otherwise specified, these definitions should be considered the authoritative meaning within this project.

---

# Business Terms

## Brand

A company or manufacturer associated with a product.

Examples:

- Samsung
- Apple
- HP
- Dell

A brand may have multiple products.

Relationship:

```
Brand
   │
   └────► Products
```

---

## Category

A logical classification used to organize products.

Examples:

- Electronics
- Grocery
- Stationery
- Furniture

A category may contain many products.

Relationship:

```
Category
      │
      └────► Products
```

---

## Customer

An individual or organization purchasing products from the business.

Customers participate in:

- Sales
- Billing
- Payments
- Returns

---

## Supplier

An individual or organization supplying products to the business.

Suppliers participate in:

- Purchase Orders
- Goods Receipt
- Procurement

---

## Warehouse

A physical storage location for inventory.

Examples:

- Main Warehouse
- Store Warehouse
- Branch Warehouse

Inventory quantities are maintained separately for each warehouse.

---

## Product

A sellable inventory item.

A product belongs to:

- Category
- Brand
- Unit
- Tax Rate

Products participate in:

- Purchases
- Inventory
- Sales
- Billing

---

## Unit

Defines how inventory is measured.

Examples:

- Piece
- Box
- Kilogram
- Liter
- Meter

Every product references one unit.

---

## Tax Rate

Represents the percentage of tax applied to a product.

Examples:

- GST 5%
- GST 12%
- GST 18%

Multiple products may reference the same tax rate.

---

## SKU (Stock Keeping Unit)

A unique internal identifier assigned to every product.

Example:

```
SKU-1001
ELEC-0007
BOOK-0054
```

Each SKU must be unique.

---

## Barcode

Machine-readable identifier printed on products.

A barcode may be scanned during:

- Purchase
- Sales
- Inventory counting

---

## Cost Price

The amount paid to acquire one unit of a product.

Used for:

- Inventory valuation
- Profit calculation

---

## Selling Price

The price charged to customers.

Used during sales and billing.

---

## Inventory

The complete stock owned by the business.

Inventory changes because of:

- Purchases
- Sales
- Returns
- Adjustments
- Transfers

---

## Stock

The quantity of a product currently available.

Example:

```
Laptop

Current Stock:

15 units
```

---

## Purchase

A transaction in which inventory is acquired from a supplier.

Future modules:

- Purchase Orders
- Goods Receipt
- Purchase Returns

---

## Sale

A transaction in which inventory is sold to a customer.

Future modules:

- Sales Invoice
- Payment
- Sales Return

---

## Invoice

A document recording a completed sale.

Typically contains:

- Customer
- Products
- Quantity
- Tax
- Total

---

## Payment

A financial transaction settling an invoice.

Examples:

- Cash
- Card
- UPI
- Bank Transfer

---

## Soft Delete

Instead of permanently deleting a record, the entity is marked as inactive.

Current implementation:

```
isActive = false
```

Benefits:

- Auditability
- Data recovery
- Historical reporting

---

# Technical Terms

## API

Application Programming Interface.

Allows frontend and backend to communicate.

Example:

```
GET /api/v1/categories
```

---

## Controller

Receives HTTP requests and returns HTTP responses.

Controllers never contain business logic.

---

## Service

Implements business rules.

Services coordinate workflows and interact with repositories.

---

## Repository

Responsible for all database access.

Repositories interact with Prisma only.

---

## DTO

Data Transfer Object.

Defines and validates incoming request data.

Current implementation uses **Zod** schemas.

---

## Middleware

Functions executed before or after request handling.

Examples:

- CORS
- Helmet
- Logging
- Authentication
- Error Handling

---

## Prisma

The ORM used to communicate with PostgreSQL.

Responsibilities:

- Database queries
- Migrations
- Client generation

---

## Migration

A version-controlled database schema change.

Example:

```
20260702111600_master_data
```

---

## Health API

Infrastructure endpoint used to verify application health.

Current endpoint:

```
GET /api/v1/health
```

Reports:

- Database connectivity
- Runtime
- Memory usage
- Uptime

---

## Request ID

A unique identifier assigned to every HTTP request.

Used for:

- Logging
- Debugging
- Error tracing

---

## Winston

The centralized logging library used by the backend.

Supports:

- Console logging
- File logging
- Error logging

---

## ADR (Architecture Decision Record)

A document describing an important engineering decision.

Each ADR includes:

- Context
- Decision
- Consequences
- Alternatives

ADRs preserve architectural reasoning over time.

---

## Sprint

A focused development iteration with a defined scope.

Each sprint produces:

- Sprint Brief
- Implementation
- Verification
- Completion Report
- Documentation Updates

---

## Layered Architecture

The architectural pattern used by the backend.

```
Routes

↓

Controllers

↓

Services

↓

Repositories

↓

Prisma

↓

PostgreSQL
```

Each layer has a single responsibility.

---

# Naming Conventions

Throughout the project:

| Term | Convention |
|------|------------|
| Module names | Singular (`category`, `brand`) |
| API endpoints | Plural (`/categories`, `/products`) |
| Database tables | Snake case plural (`tax_rates`) |
| Prisma models | PascalCase singular (`Category`, `Product`) |
| TypeScript files | Kebab-case (`category.service.ts`) |

---

# Future Terms

The glossary will expand as new modules are introduced.

Upcoming business concepts include:

- Purchase Order
- Goods Receipt
- Inventory Adjustment
- Stock Transfer
- Sales Order
- Sales Return
- Purchase Return
- Invoice Line Item
- Payment Method
- Ledger
- Audit Log
- User Role
- Permission
- Notification

---

# Maintenance

This glossary should be updated whenever:

- A new business concept is introduced.
- A technical term becomes part of the architecture.
- Existing terminology changes.

Maintaining a shared vocabulary helps ensure consistency across the codebase, documentation, and future development.
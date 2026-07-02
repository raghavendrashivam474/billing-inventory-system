# Master Data Foundation

## Project: Billing & Inventory Management System
## Sprint: 2.1 — Master Data Foundation

---

## Overview

Master data represents the core business entities that all
transactional modules depend on. These entities must be
established before any business operations can be implemented.

---

## Entity Map
Master Data
│
├── Category Groups products logically
├── Brand Manufacturer or brand
├── Unit Unit of measurement (kg, litre, piece)
├── TaxRate Tax rates applied to products
├── Product Core sellable item
├── Supplier Vendors and purchase sources
├── Customer End customers for billing
└── Warehouse Physical storage locations

text


---

## Relationships
Category ──< Product >── Brand
│
Unit
│
TaxRate

text


- One Category has many Products
- One Brand has many Products
- One Unit has many Products
- One TaxRate has many Products
- Supplier, Customer, Warehouse are independent

---

## Database Tables

| Model | Table | Purpose |
|---|---|---|
| Category | categories | Product grouping |
| Brand | brands | Manufacturer info |
| Unit | units | Measurement units |
| TaxRate | tax_rates | Tax configuration |
| Product | products | Core product data |
| Supplier | suppliers | Vendor management |
| Customer | customers | Customer management |
| Warehouse | warehouses | Storage locations |

---

## API Endpoints (Sprint 2.1 — Placeholders)

| Method | Endpoint | Status |
|---|---|---|
| GET | /api/v1/categories | Placeholder |
| GET | /api/v1/brands | Placeholder |
| GET | /api/v1/units | Placeholder |
| GET | /api/v1/tax-rates | Placeholder |
| GET | /api/v1/products | Placeholder |
| GET | /api/v1/suppliers | Placeholder |
| GET | /api/v1/customers | Placeholder |
| GET | /api/v1/warehouses | Placeholder |

Full CRUD implementation in Sprint 2.2+

---

## Module Structure

Each module follows this pattern:
modules/[module]/
├── [module].controller.ts HTTP handlers
├── [module].service.ts Business logic
├── [module].repository.ts Database access
├── [module].routes.ts Route definitions
├── [module].validator.ts Request validation
└── index.ts Module exports
---

## Engineering Rules

- Controllers never access Prisma directly
- Services contain all business logic
- Repositories own all database access
- Validators handle request validation only
- Routes contain no business logic


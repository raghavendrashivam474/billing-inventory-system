# Billing & Inventory Management System

> **A production-oriented full-stack Billing & Inventory Management System that models real-world retail operations using modern software engineering practices, clean architecture, transactional workflows, controlled inventory mutations, immutable audit ledgers, and production-ready development practices.**

This project is being developed as a learning and portfolio initiative to understand how enterprise billing, purchasing, inventory, and business operation systems are architected, implemented, documented, tested, and maintained throughout their complete software development lifecycle.

---

# Project Status

| Item                          | Status                                       |
| ----------------------------- | -------------------------------------------- |
| **Version**                   | `v1.1.0`                                     |
| **Current Phase**             | **Phase 3 — Business Operations**            |
| **Latest Completed Sprint**   | **Sprint 3.3 — Stock Adjustment Management** |
| **Next Sprint**               | **Sprint 3.4 — Sales Order Management**      |
| **Development Status**        | 🟢 Active                                    |
| **Foundation**                | ✅ Complete                                   |
| **Master Data**               | ✅ Complete                                   |
| **Business Partner Layer**    | ✅ Complete                                   |
| **Business Modules**          | ✅ Complete                                   |
| **Purchase Management**       | ✅ Complete                                   |
| **Goods Receipt Workflow**    | ✅ Complete                                   |
| **Inventory Foundation**      | ✅ Complete                                   |
| **Stock Movement Ledger**     | ✅ Complete                                   |
| **Stock Adjustment Workflow** | ✅ Complete                                   |
| **Business Operations**       | 🚧 In Progress                               |

---

# Features

## Foundation

* ✅ Modular Layered Architecture
* ✅ Versioned REST API
* ✅ PostgreSQL Integration
* ✅ Prisma ORM
* ✅ Environment Configuration
* ✅ Middleware Pipeline
* ✅ Global Error Handling
* ✅ Winston Logging
* ✅ Production Health API
* ✅ Frontend ↔ Backend Integration
* ✅ Comprehensive Engineering Documentation

---

## Master Data

* ✅ Category Management
* ✅ Brand Management
* ✅ Unit Management
* ✅ Tax Rate Management
* ✅ Product Management
* ✅ Supplier Management
* ✅ Customer Management
* ✅ Warehouse Management

---

## Business Operations

* ✅ Purchase Order Management
* ✅ Goods Receipt Management
* ✅ Inventory Balance Management
* ✅ Stock Movement Ledger
* ✅ Stock Adjustment Management
* ⏳ Sales Order Management
* ⏳ Billing
* ⏳ Invoice Generation
* ⏳ Payment Processing
* ⏳ Stock Transfer

---

# Purchase Order Capabilities

The Purchase Order module is the first transactional aggregate implemented in the system.

Current capabilities include:

* ✅ Multi-item Purchase Orders
* ✅ Supplier and Warehouse validation
* ✅ Product batch validation
* ✅ Backend-generated Purchase Order numbers
* ✅ Transaction-specific unit costs
* ✅ Historical tax rate snapshots
* ✅ Server-side monetary calculations
* ✅ Decimal-safe financial arithmetic
* ✅ Atomic aggregate writes using Prisma transactions
* ✅ Purchase Order lifecycle management
* ✅ DRAFT → CONFIRMED transition
* ✅ DRAFT / CONFIRMED → CANCELLED transition
* ✅ Draft-only modification rules
* ✅ Confirmation-time dependency revalidation
* ✅ Receipt progress tracking
* ✅ Nested aggregate API responses
* ✅ Pagination, filtering, search, and sorting

Purchase Order Items are owned by the Purchase Order aggregate and are not exposed through an independent public API.

---

# Goods Receipt Capabilities

Goods Receipt represents the physical receipt of goods against a confirmed Purchase Order.

Current capabilities include:

* ✅ Receipt creation against confirmed Purchase Orders
* ✅ Partial goods receipt
* ✅ Multiple receipts against a Purchase Order
* ✅ Purchase Order Item ownership validation
* ✅ Warehouse consistency validation
* ✅ Over-receipt prevention
* ✅ Duplicate Purchase Order Item rejection
* ✅ Backend-generated GRN numbers
* ✅ Automatic inventory balance updates
* ✅ Automatic stock movement creation
* ✅ Purchase Order receipt status recalculation
* ✅ Immutable posted Goods Receipts
* ✅ Atomic receipt posting
* ✅ Complete rollback on transactional failure

A Goods Receipt is treated as a posted business event.

Once successfully created, the receipt cannot be edited or deleted.

---

# Inventory Capabilities

Inventory represents the current stock balance of a Product within a Warehouse.

```text
Inventory
    =
Product
    +
Warehouse
    +
Current Quantity
```

Current capabilities include:

* ✅ Product + Warehouse inventory balances
* ✅ Unique inventory record per Product and Warehouse
* ✅ Automatic inventory creation on first inbound stock event
* ✅ Atomic quantity mutations
* ✅ Inventory lookup by ID
* ✅ Inventory lookup by Product
* ✅ Cross-warehouse Product stock visibility
* ✅ Warehouse filtering
* ✅ Pagination and sorting
* ✅ System-managed stock balances
* ✅ Negative inventory prevention
* ✅ Business-event-controlled mutations

Inventory is not directly modified through a public create, update, or delete API.

Stock quantities change only through controlled business workflows.

Current inventory mutation workflows are:

```text
Goods Receipt
      │
      └── Increases Inventory

Stock Adjustment — INCREASE
      │
      └── Increases Inventory

Stock Adjustment — DECREASE
      │
      └── Decreases Inventory
```

---

# Stock Adjustment Capabilities

Stock Adjustment provides a controlled workflow for correcting inventory balances.

Adjustments are intended for exceptional inventory corrections such as:

* Physical stock count differences
* Damaged stock
* Lost stock
* Expired stock
* Data corrections
* Other documented corrections

Current capabilities include:

* ✅ Stock increase adjustments
* ✅ Stock decrease adjustments
* ✅ Product validation
* ✅ Warehouse validation
* ✅ Positive client-supplied quantity enforcement
* ✅ Service-layer signed quantity calculation
* ✅ Negative inventory prevention
* ✅ Missing inventory handling
* ✅ Backend-generated Adjustment numbers
* ✅ Quantity-before snapshot
* ✅ Quantity-after calculation
* ✅ Automatic Inventory mutation
* ✅ Automatic Stock Movement creation
* ✅ Atomic adjustment posting
* ✅ Immutable posted adjustments
* ✅ Full filtering and pagination

Adjustment numbers follow:

```text
ADJ-YYYY-NNNNNN
```

Example:

```text
ADJ-2026-000001
```

---

# Stock Adjustment Domain Model

A Stock Adjustment records:

```text
Adjustment Number
Product
Warehouse
Adjustment Type
Quantity
Reason
Notes
Quantity Before
Quantity After
Timestamp
```

Supported adjustment types:

```text
INCREASE
DECREASE
```

Supported reasons:

```text
PHYSICAL_COUNT
DAMAGED
LOST
EXPIRED
DATA_CORRECTION
OTHER
```

The client always submits a positive quantity.

Signed quantity semantics are controlled by the service layer.

```text
Client
   │
   └── quantity = 2
            │
            ▼
Adjustment Type
   │
   ├── INCREASE → signedQuantity = +2
   │
   └── DECREASE → signedQuantity = -2
```

The API contract therefore represents quantity magnitude while the domain service determines stock direction.

---

# Stock Adjustment Workflow

```text
Create Stock Adjustment
        │
        ▼
Validate Product
        │
        ├── Must exist
        └── Must be active
        │
        ▼
Validate Warehouse
        │
        ├── Must exist
        └── Must be active
        │
        ▼
Resolve Inventory
        │
        ├── INCREASE + missing inventory
        │       └── Start from quantity 0
        │
        └── DECREASE + missing inventory
                └── Reject with 422
        │
        ▼
Calculate Signed Quantity
        │
        ├── INCREASE → +quantity
        └── DECREASE → -quantity
        │
        ▼
Calculate Quantity After
        │
        ▼
Validate Non-Negative Inventory
        │
        ▼
Generate Adjustment Number
        │
        ▼
Atomic Transaction
        │
        ├── Create Stock Adjustment
        ├── Create or Update Inventory
        └── Create Stock Movement
        │
        ▼
Commit
```

Any failure causes the entire workflow to roll back.

---

# Missing Inventory Policy

The system explicitly defines behavior when no Product + Warehouse inventory record exists.

| Scenario                            | Behavior                                   |
| ----------------------------------- | ------------------------------------------ |
| `INCREASE` with no inventory record | Create Inventory with `quantityBefore = 0` |
| `DECREASE` with no inventory record | Reject with HTTP `422`                     |

This prevents stock from being removed from an inventory balance that does not exist.

---

# Negative Inventory Prevention

Stock Adjustment cannot reduce inventory below zero.

```text
quantityAfter
    =
quantityBefore
    +
signedQuantity
```

Before posting:

```text
IF quantityAfter < 0
    REJECT ADJUSTMENT
```

Example:

```text
Current Inventory = 5

Requested Adjustment
DECREASE 7

5 + (-7) = -2

Result
→ 422 Unprocessable Entity
```

Negative inventory is therefore prevented at the business workflow layer.

---

# Stock Movement Ledger

Every inventory quantity change is recorded in the Stock Movement ledger.

A Stock Movement records:

```text
Product
Warehouse
Movement Type
Quantity Changed
Quantity Before
Quantity After
Reference Type
Reference ID
Timestamp
```

Current stock movement types used by implemented workflows include:

```text
PURCHASE_RECEIPT
ADJUSTMENT_IN
ADJUSTMENT_OUT
```

Example ledger:

```text
PURCHASE_RECEIPT  +1    0 → 1
PURCHASE_RECEIPT  +1    1 → 2
ADJUSTMENT_IN     +5    2 → 7
ADJUSTMENT_OUT    -2    7 → 5
```

Final Inventory quantity:

```text
5
```

Stock Movements are immutable audit records.

They cannot be edited or deleted through the public API.

---

# Inventory and Ledger Invariant

The system maintains the following stock invariant:

```text
quantityAfter
    =
quantityBefore
    +
signedQuantity
```

For the latest movement of a Product within a Warehouse:

```text
Latest StockMovement.quantityAfter
    =
Inventory.quantity
```

Example:

```text
Stock Movement Ledger
│
├── 0 + 1  = 1
├── 1 + 1  = 2
├── 2 + 5  = 7
└── 7 - 2  = 5
             │
             ▼
Inventory Quantity = 5
```

This invariant has been verified across Goods Receipt and Stock Adjustment workflows.

---

# Inventory Mutation Through Business Events

Inventory is treated as system-managed state.

Public clients cannot directly perform:

```text
POST   /inventory
PATCH  /inventory/:id
DELETE /inventory/:id
```

Instead:

```text
Business Event
      │
      ▼
Domain Validation
      │
      ▼
Inventory Mutation
      │
      ▼
Stock Movement
```

Current inventory-mutating business events:

```text
Goods Receipt
Stock Adjustment
```

Future events may include:

```text
Sales Fulfillment
Stock Transfer
Sales Return
Purchase Return
```

This architecture ensures that every inventory mutation has a business reason and corresponding audit record.

---

# Complete Stock Workflow

The current inventory architecture supports both stock acquisition and controlled correction.

```text
Supplier
   │
   ▼
Purchase Order
   │
   ▼
Purchase Order Confirmation
   │
   ▼
Goods Receipt
   │
   ▼
Inventory
   │
   ▼
Stock Movement
```

Inventory corrections follow:

```text
Physical / Operational Discrepancy
              │
              ▼
       Stock Adjustment
              │
              ▼
      Inventory Mutation
              │
              ▼
       Stock Movement
```

Together:

```text
Purchase Order
      │
      └── WHAT WE INTEND TO BUY

Goods Receipt
      │
      └── WHAT WE PHYSICALLY RECEIVED

Stock Adjustment
      │
      └── WHY STOCK WAS CORRECTED

Inventory
      │
      └── WHAT STOCK WE CURRENTLY HAVE

Stock Movement
      │
      └── HOW STOCK CHANGED OVER TIME
```

---

# Transaction Safety

Transactional business workflows use Prisma database transactions.

For Goods Receipt posting:

```text
BEGIN TRANSACTION

Create Goods Receipt
        │
        ▼
Create Goods Receipt Items
        │
        ▼
Update Inventory Balances
        │
        ▼
Create Stock Movements
        │
        ▼
Recalculate PO Receipt Status

COMMIT
```

For Stock Adjustment posting:

```text
BEGIN TRANSACTION

Create Stock Adjustment
        │
        ▼
Create or Update Inventory
        │
        ▼
Create Stock Movement

COMMIT
```

If any operation fails:

```text
ROLLBACK
```

This prevents:

* Inventory changes without business events
* Business events without inventory changes
* Inventory changes without audit movements
* Stock Movements without matching inventory state
* Partially persisted transactional workflows

---

# Inventory State and Ledger Strategy

The system separates current inventory state from historical stock events.

```text
Inventory
    │
    └── CURRENT STATE

Stock Movement
    │
    └── HISTORICAL LEDGER
```

Example:

```text
Stock Movements
│
├── +10 PURCHASE_RECEIPT
├── -2 ADJUSTMENT_OUT
├── +1 ADJUSTMENT_IN
└── -1 ADJUSTMENT_OUT

             │
             ▼

Inventory Quantity = 8
```

Inventory provides efficient current-state reads.

Stock Movements preserve the complete historical audit trail.

---

# Financial Calculation Strategy

Financial calculations are performed on the server using `decimal.js`.

Example:

```text
Base Amount
    =
Quantity × Unit Cost

Tax Amount
    =
Base Amount × Tax Rate / 100

Line Total
    =
Base Amount + Tax Amount
```

Purchase Order totals are derived from all calculated items:

```text
Subtotal
    =
Σ Base Amount

Tax Amount
    =
Σ Item Tax Amount

Total Amount
    =
Subtotal + Tax Amount
```

The client cannot directly provide calculated totals.

---

# Historical Tax Snapshot Strategy

Tax rates are copied into Purchase Order Items when the transaction is created.

```text
Product
   │
   └── Current Tax Rate
             │
             ▼
Purchase Order Item
   │
   └── Tax Rate Snapshot
```

Future changes to a Product's tax configuration do not modify historical Purchase Orders.

This preserves transaction history and financial consistency.

---

# Architecture

The backend follows a layered architecture designed for scalability, maintainability, and clear separation of responsibilities.

```text
Client
   │
   ▼
Routes
   │
   ▼
Validators
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Repositories
   │
   ▼
Prisma ORM
   │
   ▼
PostgreSQL
```

Each layer owns a clearly defined responsibility.

```text
Routes
   │
   └── Register HTTP endpoints

Validators
   │
   └── Validate request data using Zod

Controllers
   │
   └── Handle HTTP request and response concerns

Services
   │
   └── Enforce business rules and coordinate workflows

Repositories
   │
   └── Perform database operations

Prisma ORM
   │
   └── Map application data to PostgreSQL
```

Transactional business workflows coordinate multiple database operations through service-layer orchestration and atomic Prisma transactions.

---

# Current Business Domain

```text
Master Data
│
├── Category              ✅
├── Brand                 ✅
├── Unit                  ✅
├── Tax Rate              ✅
├── Product               ✅
├── Supplier              ✅
├── Customer              ✅
└── Warehouse             ✅

Business Operations
│
├── Purchase Order        ✅
│   └── Purchase Items    ✅
│
├── Goods Receipt         ✅
│   └── Receipt Items     ✅
│
├── Inventory             ✅
├── Stock Movement        ✅
├── Stock Adjustment      ✅
├── Sales Order           ⏳
├── Billing               ⏳
├── Invoice               ⏳
├── Payments              ⏳
└── Stock Transfer        ⏳
```

The system has moved beyond independent CRUD-oriented modules and now implements coordinated transactional workflows, controlled inventory mutations, current-state balance management, and immutable stock audit records.

---

# API Surface

## Infrastructure

```text
GET /api/v1
GET /api/v1/status
GET /api/v1/health
```

## Master Data

```text
/api/v1/categories
/api/v1/brands
/api/v1/units
/api/v1/tax-rates
```

Each master data module provides:

```text
GET
GET /:id
POST
PATCH /:id
DELETE /:id
PATCH /:id/restore
```

## Business Entities

```text
/api/v1/products
/api/v1/suppliers
/api/v1/customers
/api/v1/warehouses
```

Each business entity provides complete CRUD, soft delete, and restore workflows.

## Purchase Orders

```text
GET    /api/v1/purchase-orders
GET    /api/v1/purchase-orders/:id
POST   /api/v1/purchase-orders
PATCH  /api/v1/purchase-orders/:id
PATCH  /api/v1/purchase-orders/:id/confirm
PATCH  /api/v1/purchase-orders/:id/cancel
```

## Goods Receipts

```text
GET  /api/v1/goods-receipts
GET  /api/v1/goods-receipts/:id
POST /api/v1/goods-receipts
```

## Inventory

```text
GET /api/v1/inventory
GET /api/v1/inventory/:id
GET /api/v1/inventory/product/:productId
```

## Stock Movements

```text
GET /api/v1/stock-movements
GET /api/v1/stock-movements/:id
```

## Stock Adjustments

```text
GET  /api/v1/stock-adjustments
GET  /api/v1/stock-adjustments/:id
POST /api/v1/stock-adjustments
```

Stock Adjustments intentionally expose no update or delete endpoints.

The current release exposes **68 business API endpoints**.

---

# Technology Stack

## Frontend

* React
* Vite
* TypeScript
* Axios

## Backend

* Node.js
* Express
* TypeScript

## Database

* PostgreSQL
* Prisma ORM

## Validation & Financial Processing

* Zod
* decimal.js

## Infrastructure

* Winston
* Helmet
* Morgan
* CORS
* UUID

---

# Repository Structure

```text
billing-inventory-system/
│
├── backend/
├── frontend/
├── docs/
├── database/
├── scripts/
├── shared/
│
└── README.md
```

A detailed repository breakdown is available in:

```text
docs/PROJECT-STRUCTURE.md
```

---

# Development Philosophy

This project follows an **Architecture First** and **Documentation First** engineering methodology.

Every feature follows the same lifecycle:

```text
Research
      │
      ▼
Planning
      │
      ▼
Architecture
      │
      ▼
Implementation
      │
      ▼
Testing
      │
      ▼
Documentation
      │
      ▼
Git Commit
      │
      ▼
Release
```

The objective is not only to build production-quality software, but also to document engineering decisions, architectural evolution, trade-offs, and the implementation journey throughout the project.

---

# Documentation

The `docs/` directory contains comprehensive engineering documentation, including:

* Project Documentation
* Repository Guide
* Project Structure
* Architecture Documentation
* API Documentation
* Business Documentation
* Architecture Decision Records
* Sprint Briefs
* Sprint Completion Reports
* Coding Standards
* Design Principles
* Development Workflow
* Roadmap
* Glossary
* Middleware Documentation
* Logging Documentation
* Health API Documentation

Documentation evolves alongside the implementation and is treated as a first-class engineering deliverable.

---

# Architecture Decision Records

The project maintains Architecture Decision Records for significant technical and architectural decisions.

Current ADR topics include:

* Layered Backend Architecture
* Prisma ORM Adoption
* Versioned REST API
* Centralized Environment Configuration
* Centralized Logging
* Global Error Handling
* Master Data Foundation
* Soft Delete Strategy
* Purchase Order Aggregate Boundary
* Atomic Transactional Aggregate Writes
* Historical Tax Snapshot Strategy
* Purchase Order Number Generation
* Inventory Balance and Stock Movement Ledger
* Separate Purchase Order Receipt Progress
* Inventory Mutation Through Business Events

The repository currently maintains **15 Architecture Decision Records**.

ADR documents are maintained inside:

```text
docs/adr/
```

---

# Engineering Practices

This repository emphasizes:

* Clean Architecture
* Layered Design
* Aggregate-Oriented Transaction Design
* Domain-Oriented Development
* Modular Software Design
* REST API Design
* Repository Pattern
* Service Layer Pattern
* Database Transaction Boundaries
* Decimal-Safe Financial Arithmetic
* Historical Data Snapshotting
* Business Lifecycle State Machines
* Immutable Business Events
* Immutable Audit Ledgers
* System-Managed Inventory State
* Controlled Inventory Mutations
* Negative Inventory Prevention
* Transactional Workflow Orchestration
* Professional Git Workflow
* Conventional Commits
* Architecture Decision Records
* Documentation-First Development
* Incremental Sprint-Based Development

---

# Development Roadmap

## ✅ Phase 1 — Foundation

* Project Setup
* Backend Foundation

---

## ✅ Phase 2 — Business Modules

* Category Management
* Brand Management
* Unit Management
* Tax Rate Management
* Product Management
* Supplier Management
* Customer Management
* Warehouse Management

---

## 🚧 Phase 3 — Business Operations

* ✅ Purchase Order Management
* ✅ Goods Receipt Management
* ✅ Inventory Management Foundation
* ✅ Stock Movement Ledger
* ✅ Stock Adjustment Management
* ⏳ Sales Order Management
* ⏳ Billing
* ⏳ Invoice Generation
* ⏳ Payment Processing
* ⏳ Stock Transfer

---

## ⏳ Phase 4 — Analytics

* Dashboard
* Reports
* Business Insights
* Inventory Analytics

---

## ⏳ Phase 5 — Production Readiness

* Unit Testing
* Integration Testing
* Docker
* CI/CD
* Performance Optimization
* Deployment
* Monitoring
* Backup & Recovery

---

# Current Progress

| Phase                 | Status         |
| --------------------- | -------------- |
| Project Foundation    | ✅ Complete     |
| Backend Foundation    | ✅ Complete     |
| Master Data           | ✅ Complete     |
| Business Modules      | ✅ Complete     |
| Purchase Management   | ✅ Complete     |
| Goods Receipt         | ✅ Complete     |
| Inventory Foundation  | ✅ Complete     |
| Stock Movement Ledger | ✅ Complete     |
| Stock Adjustment      | ✅ Complete     |
| Business Operations   | 🚧 In Progress |
| Analytics             | ⏳ Planned      |
| Production Readiness  | ⏳ Planned      |

---

# Repository Goals

This repository demonstrates:

* Enterprise Application Architecture
* Clean Architecture Principles
* Production-Oriented Backend Development
* Relational Database Design
* Transactional Aggregate Design
* Atomic Database Operations
* REST API Development
* Financial Calculation Safety
* Domain-Oriented Module Organization
* Business Lifecycle Modeling
* Inventory State Management
* Controlled Inventory Mutation
* Negative Inventory Prevention
* Immutable Stock Audit Ledgers
* Transactional Workflow Coordination
* Engineering Documentation Practices
* Professional Git Workflow
* Incremental Software Delivery

---

# Release History

| Version  | Milestone                                            |
| -------- | ---------------------------------------------------- |
| `v0.3.0` | Backend Foundation Complete                          |
| `v0.4.0` | Business Module Foundation                           |
| `v0.5.0` | Master Data Foundation Complete                      |
| `v0.6.0` | Core Product Domain Complete                         |
| `v0.7.0` | Business Partner Layer Complete                      |
| `v0.8.0` | Phase 2 — Business Modules Complete                  |
| `v0.8.1` | Phase 3 Transition Documentation                     |
| `v0.9.0` | Purchase Order Transactional Foundation              |
| `v1.0.0` | Goods Receipt, Inventory & Stock Movement Foundation |
| `v1.1.0` | Stock Adjustment & Controlled Inventory Mutation     |

---

# Quick Start

Clone the repository:

```bash
git clone https://github.com/raghavendrashivam474/billing-inventory-system.git
```

Navigate into the project:

```bash
cd billing-inventory-system
```

Follow the setup guide:

```text
docs/setup-instructions.md
```

---

# Contributing

This repository is currently maintained by a single developer as a learning and portfolio project.

External contributions may be considered as the project architecture and contribution workflow mature.

---

# License

This project is licensed under the **MIT License**.

See the `LICENSE` file for details.

# Billing & Inventory Management System

> **A production-oriented full-stack Billing & Inventory Management System that models real-world retail operations using modern software engineering practices, clean architecture, transactional workflows, immutable audit ledgers, and production-ready development practices.**

This project is being developed as a learning and portfolio initiative to understand how enterprise billing, purchasing, inventory, and business operation systems are architected, implemented, documented, tested, and maintained throughout their complete software development lifecycle.

---

# Project Status

| Item                          | Status                                                     |
| ----------------------------- | ---------------------------------------------------------- |
| **Version**                   | `v1.0.0`                                                   |
| **Current Phase**             | **Phase 3 — Business Operations**                          |
| **Latest Completed Sprint**   | **Sprint 3.2 — Goods Receipt, Inventory & Stock Movement** |
| **Next Sprint**               | **Sprint 3.3 — Stock Adjustment**                          |
| **Development Status**        | 🟢 Active                                                  |
| **Foundation**                | ✅ Complete                                                 |
| **Master Data**               | ✅ Complete                                                 |
| **Business Partner Layer**    | ✅ Complete                                                 |
| **Business Modules**          | ✅ Complete                                                 |
| **Purchase Order Management** | ✅ Complete                                                 |
| **Goods Receipt Workflow**    | ✅ Complete                                                 |
| **Inventory Foundation**      | ✅ Complete                                                 |
| **Stock Movement Ledger**     | ✅ Complete                                                 |
| **Business Operations**       | 🚧 In Progress                                             |

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
* ⏳ Stock Adjustment
* ⏳ Sales Management
* ⏳ Billing
* ⏳ Invoice Generation
* ⏳ Payment Processing

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
* ✅ Automatic inventory creation on first stock receipt
* ✅ Atomic quantity increments
* ✅ Inventory lookup by ID
* ✅ Inventory lookup by Product
* ✅ Cross-warehouse Product stock visibility
* ✅ Warehouse filtering
* ✅ Pagination and sorting
* ✅ System-managed stock balances

Inventory is not directly modified through a public create, update, or delete API.

Stock quantities change only through controlled business workflows.

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

The current stock workflow creates one Stock Movement for every received Goods Receipt Item.

Example:

```text
Inventory Before
      │
      ▼
      2
      │
      │  PURCHASE_RECEIPT +3
      ▼
Inventory After
      │
      ▼
      5
```

The corresponding Stock Movement records:

```text
quantityBefore = 2
quantity       = 3
quantityAfter  = 5
```

Stock Movements are immutable audit records.

They cannot be edited or deleted through the public API.

---

# Engineering Documentation

* ✅ Sprint Briefs
* ✅ Sprint Completion Reports
* ✅ Architecture Decision Records
* ✅ Project Structure Guide
* ✅ Coding Standards
* ✅ Design Principles
* ✅ Development Workflow
* ✅ Roadmap
* ✅ Glossary
* ✅ Business Documentation

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
├── Stock Adjustment      ⏳
├── Sales                 ⏳
├── Billing               ⏳
├── Invoice               ⏳
└── Payments              ⏳
```

The system has moved beyond independent CRUD-oriented business modules and now implements coordinated transactional workflows with inventory state management and immutable audit records.

---

# Complete Stock Acquisition Workflow

The current business operation architecture implements the following workflow:

```text
Supplier
   │
   ▼
Purchase Order
   │
   ├── Purchase Order Items
   │
   ▼
Purchase Order Confirmation
   │
   ▼
Goods Receipt
   │
   ├── Goods Receipt Items
   │
   ▼
Inventory Balance Update
   │
   ▼
Stock Movement Ledger
```

The workflow preserves a clear distinction between commercial intent, physical stock events, current state, and historical audit records.

```text
Purchase Order
      │
      └── WHAT WE INTEND TO BUY

Goods Receipt
      │
      └── WHAT WE PHYSICALLY RECEIVED

Inventory
      │
      └── WHAT STOCK WE CURRENTLY HAVE

Stock Movement
      │
      └── HOW THE STOCK CHANGED
```

---

# Purchase Order Lifecycle

```text
             ┌───────────────┐
             │     DRAFT     │
             └───────┬───────┘
                     │
              Confirm Order
                     │
                     ▼
             ┌───────────────┐
             │   CONFIRMED   │
             └───────┬───────┘
                     │
                  Cancel
                     │
                     ▼
             ┌───────────────┐
             │   CANCELLED   │
             └───────────────┘
```

A DRAFT Purchase Order may be modified.

Once confirmed, the order becomes immutable.

Purchase Order confirmation revalidates all referenced business entities before completing the lifecycle transition.

---

# Purchase Order Receipt Progress

Purchase Order lifecycle status and receipt progress are modeled independently.

```text
Purchase Order Status
│
├── DRAFT
├── CONFIRMED
└── CANCELLED

Receipt Status
│
├── NOT_RECEIVED
├── PARTIALLY_RECEIVED
└── FULLY_RECEIVED
```

Example:

```text
Purchase Order
│
├── status        = CONFIRMED
└── receiptStatus = PARTIALLY_RECEIVED
```

This allows commercial lifecycle state and physical fulfillment progress to evolve independently.

---

# Goods Receipt Workflow

```text
Confirmed Purchase Order
        │
        ▼
Create Goods Receipt
        │
        ▼
Validate Purchase Order
        │
        ├── Status must be CONFIRMED
        └── Warehouse must match
        │
        ▼
Validate Receipt Items
        │
        ├── PO Item ownership
        ├── Positive quantity
        ├── Duplicate rejection
        └── Over-receipt prevention
        │
        ▼
Generate GRN Number
        │
        ▼
Atomic Transaction
        │
        ├── Create Goods Receipt
        ├── Create Receipt Items
        ├── Update Inventory
        ├── Create Stock Movements
        └── Recalculate PO Receipt Status
        │
        ▼
Commit
```

Any failure causes the complete workflow to roll back.

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

If any operation fails:

```text
ROLLBACK
```

This prevents:

* Partial Goods Receipts
* Inventory updates without audit movements
* Stock Movements without inventory updates
* Incorrect Purchase Order receipt status
* Partially persisted business events

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
├── -2 SALE
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

The current release exposes **56 business API endpoints**.

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

The repository currently maintains **14 Architecture Decision Records**.

ADR documents are maintained inside:

```text
docs/adr/
```

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
* ⏳ Stock Adjustment
* ⏳ Sales Management
* ⏳ Billing
* ⏳ Invoice Generation
* ⏳ Payment Processing

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
* Immutable Audit Ledgers
* System-Managed Inventory State
* Transactional Workflow Orchestration
* Professional Git Workflow
* Conventional Commits
* Architecture Decision Records
* Documentation-First Development
* Incremental Sprint-Based Development

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

---

# Contributing

This repository is currently maintained by a single developer as a learning and portfolio project.

External contributions may be considered as the project architecture and contribution workflow mature.

---

# License

This project is licensed under the **MIT License**.

See the `LICENSE` file for details.

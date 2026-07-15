# Billing & Inventory Management System

> **A production-oriented full-stack Billing & Inventory Management System that models real-world retail operations using modern software engineering practices, clean architecture, transactional workflows, controlled inventory mutations, immutable audit ledgers, and production-ready development practices.**

This project is being developed as a learning and portfolio initiative to understand how enterprise billing, purchasing, inventory, sales, and business operation systems are architected, implemented, documented, tested, and maintained throughout their complete software development lifecycle.

---

# Project Status

| Item                          | Status                                  |
| ----------------------------- | --------------------------------------- |
| **Version**                   | `v1.2.0`                                |
| **Current Phase**             | **Phase 3 — Business Operations**       |
| **Latest Completed Sprint**   | **Sprint 3.4 — Sales Order Management** |
| **Next Sprint**               | **Sprint 3.5 — Dispatch / Fulfilment**  |
| **Development Status**        | 🟢 Active                               |
| **Foundation**                | ✅ Complete                              |
| **Master Data**               | ✅ Complete                              |
| **Business Partner Layer**    | ✅ Complete                              |
| **Business Modules**          | ✅ Complete                              |
| **Purchase Management**       | ✅ Complete                              |
| **Goods Receipt Workflow**    | ✅ Complete                              |
| **Inventory Foundation**      | ✅ Complete                              |
| **Stock Movement Ledger**     | ✅ Complete                              |
| **Stock Adjustment Workflow** | ✅ Complete                              |
| **Sales Order Workflow**      | ✅ Complete                              |
| **Business Operations**       | 🚧 In Progress                          |

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
* ✅ Sales Order Management
* ⏳ Dispatch / Fulfilment
* ⏳ Billing
* ⏳ Invoice Generation
* ⏳ Payment Processing
* ⏳ Stock Transfer

---

# Purchase Order Capabilities

The Purchase Order module represents the inbound commercial intent to acquire products from a Supplier.

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

Purchase Order Items belong to the Purchase Order aggregate and are not exposed through an independent public API.

---

# Goods Receipt Capabilities

Goods Receipt represents the physical receipt of products against a confirmed Purchase Order.

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
* ✅ Automatic Stock Movement creation
* ✅ Purchase Order receipt status recalculation
* ✅ Immutable posted Goods Receipts
* ✅ Atomic receipt posting
* ✅ Complete rollback on transactional failure

A Goods Receipt is treated as a posted business event.

Once successfully created, it cannot be edited or deleted.

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

Inventory cannot be directly mutated through public APIs.

Current inventory-mutating workflows are:

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

Sales Order confirmation intentionally performs inventory validation without inventory mutation.

---

# Stock Adjustment Capabilities

Stock Adjustment provides a controlled workflow for correcting inventory balances.

Adjustments support exceptional inventory corrections such as:

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
* ✅ Quantity-before snapshots
* ✅ Quantity-after calculations
* ✅ Automatic Inventory mutation
* ✅ Automatic Stock Movement creation
* ✅ Atomic adjustment posting
* ✅ Immutable posted adjustments
* ✅ Filtering and pagination

Adjustment numbers follow:

```text
ADJ-YYYY-NNNNNN
```

---

# Sales Order Capabilities

The Sales Order module represents outbound commercial intent from a Customer.

It is the first outbound transactional aggregate in the system.

Current capabilities include:

* ✅ Multi-item Sales Orders
* ✅ Customer validation
* ✅ Warehouse validation
* ✅ Product validation
* ✅ Backend-generated Sales Order numbers
* ✅ Product selling price snapshots
* ✅ Historical tax rate snapshots
* ✅ Item-level discount support
* ✅ Order-level discount support
* ✅ Server-side monetary calculations
* ✅ Decimal-safe financial arithmetic
* ✅ Atomic aggregate creation and updates
* ✅ DRAFT lifecycle support
* ✅ Draft-only modification
* ✅ Inventory-aware confirmation
* ✅ Missing inventory detection
* ✅ Insufficient inventory prevention
* ✅ DRAFT → CONFIRMED transition
* ✅ DRAFT → CANCELLED transition
* ✅ Invalid lifecycle transition prevention
* ✅ Nested aggregate API responses
* ✅ Pagination, filtering, search, and sorting

Sales Order Items belong to the Sales Order aggregate and are not exposed through an independent public API.

---

# Sales Order Domain Model

```text
Sales Order
│
├── Order Number
├── Customer
├── Warehouse
├── Status
├── Order Date
├── Expected Delivery Date
├── Subtotal
├── Tax Amount
├── Discount Amount
├── Total Amount
├── Notes
│
└── Sales Order Items
      │
      ├── Product
      ├── Quantity
      ├── Unit Price Snapshot
      ├── Tax Rate Snapshot
      ├── Discount Amount
      ├── Subtotal
      ├── Tax Amount
      └── Total Amount
```

Supported Sales Order states:

```text
DRAFT
CONFIRMED
FULFILLED
CANCELLED
```

Current lifecycle:

```text
DRAFT
  │
  ├── CONFIRM
  │      │
  │      ▼
  │   CONFIRMED
  │
  └── CANCEL
         │
         ▼
      CANCELLED
```

The `FULFILLED` state is reserved for the Dispatch / Fulfilment workflow.

---

# Sales Order Pricing Snapshot Strategy

Product selling prices are copied into Sales Order Items when the aggregate is created or rebuilt while in DRAFT.

```text
Product
   │
   └── Current Selling Price
             │
             ▼
Sales Order Item
   │
   └── Unit Price Snapshot
```

Tax rates are also snapshotted:

```text
Product Tax Rate
        │
        ▼
Sales Order Item Tax Rate
```

Future Product price or tax configuration changes therefore do not rewrite historical Sales Orders.

---

# Sales Order Monetary Calculation Strategy

All monetary calculations are performed on the server using `decimal.js`.

For each item:

```text
Subtotal
    =
Quantity × Unit Price

Taxable Amount
    =
Subtotal - Item Discount

Tax Amount
    =
Taxable Amount × Tax Rate / 100

Item Total
    =
Taxable Amount + Tax Amount
```

Order totals are derived from calculated items:

```text
Order Subtotal
    =
Σ Item Subtotal

Order Tax Amount
    =
Σ Item Tax Amount

Order Total
    =
Σ Item Total - Order Discount
```

The client cannot provide calculated totals.

Business rules enforce:

```text
Item Discount <= Item Subtotal

Order Discount <= SUM(Item Total)

Order Total >= 0
```

---

# Sales Order Confirmation Workflow

```text
Confirm Sales Order
        │
        ▼
Load Sales Order Aggregate
        │
        ▼
Validate Status = DRAFT
        │
        ▼
Revalidate Customer
        │
        ├── Must exist
        └── Must be active
        │
        ▼
Revalidate Warehouse
        │
        ├── Must exist
        └── Must be active
        │
        ▼
For Each Sales Order Item
        │
        ├── Validate Product
        │
        ├── Resolve Product + Warehouse Inventory
        │
        ├── Reject Missing Inventory
        │
        └── Validate Available Quantity
        │
        ▼
Update Status
        │
        ▼
CONFIRMED
```

Confirmation is inventory-aware but inventory read-only.

---

# Sales Order and Inventory Boundary

Sales Order confirmation does **not** mutate inventory.

```text
Sales Order Confirmation
        │
        ├── READ Inventory
        ├── VALIDATE Availability
        │
        ├── DOES NOT decrement Inventory
        └── DOES NOT create Stock Movement
```

Example:

```text
Inventory Before Confirmation = 3

Confirm Sales Order
Quantity Requested = 2

Inventory After Confirmation = 3
```

Stock Movement count also remains unchanged.

This separates:

```text
Commercial Intent
        │
        └── Sales Order

Physical Stock Movement
        │
        └── Dispatch / Fulfilment
```

The future Dispatch / Fulfilment workflow will own outbound inventory mutation and `SALE` Stock Movement creation.

---

# Complete Commercial and Stock Workflow

Inbound flow:

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
Inventory Increase
   │
   ▼
PURCHASE_RECEIPT Stock Movement
```

Inventory correction flow:

```text
Operational Discrepancy
          │
          ▼
Stock Adjustment
          │
          ▼
Inventory Mutation
          │
          ▼
ADJUSTMENT_IN / ADJUSTMENT_OUT
Stock Movement
```

Outbound commercial flow:

```text
Customer
   │
   ▼
Sales Order
   │
   ▼
Sales Order Confirmation
   │
   ├── Validate Inventory
   └── Preserve Inventory
          │
          ▼
Future Dispatch / Fulfilment
          │
          ├── Decrease Inventory
          └── Create SALE Stock Movement
```

The domain boundaries can therefore be expressed as:

```text
Purchase Order
      └── WHAT WE INTEND TO BUY

Goods Receipt
      └── WHAT WE PHYSICALLY RECEIVED

Sales Order
      └── WHAT WE INTEND TO SELL

Dispatch / Fulfilment
      └── WHAT WE PHYSICALLY SHIPPED

Stock Adjustment
      └── WHY STOCK WAS CORRECTED

Inventory
      └── WHAT STOCK WE CURRENTLY HAVE

Stock Movement
      └── HOW STOCK CHANGED OVER TIME
```

---

# Stock Movement Ledger

Every implemented inventory quantity change is recorded in the Stock Movement ledger.

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

Current active movement types include:

```text
PURCHASE_RECEIPT
ADJUSTMENT_IN
ADJUSTMENT_OUT
```

Sales Order confirmation does not create a Stock Movement.

The future Dispatch / Fulfilment workflow will introduce outbound sale movement behavior.

Stock Movements are immutable audit records.

---

# Inventory and Ledger Invariant

The system maintains:

```text
quantityAfter
    =
quantityBefore
    +
signedQuantity
```

For the latest Stock Movement of a Product within a Warehouse:

```text
Latest StockMovement.quantityAfter
    =
Inventory.quantity
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

Inventory-validating but non-mutating events:

```text
Sales Order Confirmation
```

Future inventory-mutating events may include:

```text
Dispatch / Fulfilment
Stock Transfer
Sales Return
Purchase Return
```

---

# Transaction Safety

Transactional workflows use Prisma database transactions.

Examples include:

```text
Purchase Order Aggregate Write
Goods Receipt Posting
Stock Adjustment Posting
Sales Order Aggregate Write
```

The general transaction boundary is:

```text
BEGIN TRANSACTION

Validate Transaction State
        │
        ▼
Create or Update Aggregate
        │
        ▼
Apply Related State Changes
        │
        ▼
Create Required Audit Records

COMMIT
```

If any operation fails:

```text
ROLLBACK
```

This prevents partially persisted business workflows.

---

# Architecture

The backend follows a layered architecture:

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

Responsibilities are separated as follows:

```text
Routes
   └── Register HTTP endpoints

Validators
   └── Validate request data using Zod

Controllers
   └── Handle HTTP concerns

Services
   └── Enforce business rules and coordinate workflows

Repositories
   └── Perform database operations

Prisma ORM
   └── Map application data to PostgreSQL
```

Transactional business workflows are coordinated through service-layer orchestration and atomic Prisma transactions.

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

Inbound Operations
│
├── Purchase Order        ✅
│   └── Purchase Items    ✅
│
└── Goods Receipt         ✅
    └── Receipt Items     ✅

Inventory Operations
│
├── Inventory             ✅
├── Stock Movement        ✅
└── Stock Adjustment      ✅

Outbound Operations
│
├── Sales Order           ✅
│   └── Sales Order Items ✅
│
├── Dispatch / Fulfilment ⏳
├── Billing               ⏳
├── Invoice               ⏳
└── Payment               ⏳

Warehouse Operations
│
└── Stock Transfer        ⏳
```

The system now supports both inbound purchasing and outbound commercial intent while maintaining controlled inventory mutation boundaries.

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

Each master data module provides six lifecycle endpoints.

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

## Sales Orders

```text
GET    /api/v1/sales-orders
GET    /api/v1/sales-orders/:id
POST   /api/v1/sales-orders
PATCH  /api/v1/sales-orders/:id
PATCH  /api/v1/sales-orders/:id/confirm
PATCH  /api/v1/sales-orders/:id/cancel
```

The current release exposes **74 business API endpoints**.

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

Every feature follows:

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

The objective is not only to build production-quality software, but also to document engineering decisions, architectural evolution, trade-offs, and implementation history.

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

Documentation evolves alongside implementation and is treated as a first-class engineering deliverable.

---

# Architecture Decision Records

The repository currently maintains **16 Architecture Decision Records**.

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
* Sales Order Confirmation Does Not Mutate Inventory

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
* Inventory-Aware Commercial Validation
* Separation of Commercial Intent and Physical Stock Movement
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
* ✅ Sales Order Management
* ⏳ Dispatch / Fulfilment
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

| Phase / Domain         | Status         |
| ---------------------- | -------------- |
| Project Foundation     | ✅ Complete     |
| Backend Foundation     | ✅ Complete     |
| Master Data            | ✅ Complete     |
| Business Modules       | ✅ Complete     |
| Purchase Management    | ✅ Complete     |
| Goods Receipt          | ✅ Complete     |
| Inventory Foundation   | ✅ Complete     |
| Stock Movement Ledger  | ✅ Complete     |
| Stock Adjustment       | ✅ Complete     |
| Sales Order Management | ✅ Complete     |
| Business Operations    | 🚧 In Progress |
| Analytics              | ⏳ Planned      |
| Production Readiness   | ⏳ Planned      |

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
* Inbound and Outbound Commercial Workflow Modeling
* Commercial Intent and Physical Fulfilment Separation
* Engineering Documentation Practices
* Professional Git Workflow
* Incremental Software Delivery

---

# Release History

| Version  | Milestone                                             |
| -------- | ----------------------------------------------------- |
| `v0.3.0` | Backend Foundation Complete                           |
| `v0.4.0` | Business Module Foundation                            |
| `v0.5.0` | Master Data Foundation Complete                       |
| `v0.6.0` | Core Product Domain Complete                          |
| `v0.7.0` | Business Partner Layer Complete                       |
| `v0.8.0` | Phase 2 — Business Modules Complete                   |
| `v0.8.1` | Phase 3 Transition Documentation                      |
| `v0.9.0` | Purchase Order Transactional Foundation               |
| `v1.0.0` | Goods Receipt, Inventory & Stock Movement Foundation  |
| `v1.1.0` | Stock Adjustment & Controlled Inventory Mutation      |
| `v1.2.0` | Sales Order & Outbound Commercial Workflow Foundation |

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

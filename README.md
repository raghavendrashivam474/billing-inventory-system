# Billing & Inventory Management System

> **A production-oriented full-stack Billing & Inventory Management System that models real-world retail operations using modern software engineering practices, clean architecture, transactional workflows, and production-ready development practices.**

This project is being developed as a learning and portfolio initiative to understand how enterprise billing and inventory systems are architected, implemented, documented, tested, and maintained throughout their complete software development lifecycle.

---

# Project Status

| Item                          | Status                                     |
| ----------------------------- | ------------------------------------------ |
| **Version**                   | `v0.8.1`                                   |
| **Current Phase**             | **Phase 3 — Business Operations**          |
| **Current Sprint**            | **Sprint 3.2 — Goods Receipt & Inventory** |
| **Development Status**        | 🟢 Active                                  |
| **Foundation**                | ✅ Complete                                 |
| **Master Data**               | ✅ Complete                                 |
| **Business Partner Layer**    | ✅ Complete                                 |
| **Business Modules**          | ✅ Complete                                 |
| **Purchase Order Management** | ✅ Complete                                 |
| **Business Operations**       | 🚧 In Progress                             |

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
* 🚧 Goods Receipt
* 🚧 Inventory Management
* 🚧 Stock Movement
* ⏳ Stock Adjustment
* ⏳ Sales Management
* ⏳ Billing
* ⏳ Invoice Generation
* ⏳ Payment Processing

---

## Purchase Order Capabilities

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
* ✅ Nested aggregate API responses
* ✅ Pagination, filtering, search, and sorting

Purchase Order Items are owned by the Purchase Order aggregate and are not exposed through an independent public API.

---

## Engineering Documentation

* ✅ Sprint Briefs
* ✅ Sprint Completion Reports
* ✅ Architecture Decision Records (ADR)
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

Transactional business workflows may coordinate multiple repositories through service-layer orchestration and atomic Prisma transactions.

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
├── Goods Receipt         🚧
├── Inventory             🚧
├── Stock Movement        🚧
├── Stock Adjustment      ⏳
├── Sales                 ⏳
├── Billing               ⏳
├── Invoice               ⏳
└── Payments              ⏳
```

The system has now moved from independent CRUD-oriented business modules into transactional business workflows.

---

# Transactional Workflow

The current business operation architecture follows this direction:

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
   ▼
Inventory Update
   │
   ▼
Stock Movement Ledger
```

A Purchase Order represents **commercial intent to purchase goods**.

It does not directly modify inventory.

Physical stock changes will occur only when goods are recorded through the Goods Receipt workflow.

This separation preserves a clear distinction between:

```text
Ordered Quantity
        │
        ▼
Received Quantity
        │
        ▼
Available Inventory
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

# Transaction Safety

Transactional aggregates use Prisma database transactions.

```text
BEGIN TRANSACTION

Create Purchase Order
        │
        ▼
Create Purchase Order Items
        │
        ▼
Persist Aggregate

COMMIT
```

If any operation fails:

```text
ROLLBACK
```

This ensures that partially created transactional aggregates cannot exist.

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
* 🚧 Goods Receipt
* 🚧 Inventory Management
* 🚧 Stock Movement
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
* Professional Git Workflow
* Conventional Commits
* Architecture Decision Records
* Documentation-First Development
* Incremental Sprint-Based Development

---

# Current Progress

| Phase                | Status         |
| -------------------- | -------------- |
| Project Foundation   | ✅ Complete     |
| Backend Foundation   | ✅ Complete     |
| Master Data          | ✅ Complete     |
| Business Modules     | ✅ Complete     |
| Purchase Management  | ✅ Complete     |
| Business Operations  | 🚧 In Progress |
| Analytics            | ⏳ Planned      |
| Production Readiness | ⏳ Planned      |

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
* Engineering Documentation Practices
* Professional Git Workflow
* Incremental Software Delivery

---

# Contributing

This repository is currently maintained by a single developer as a learning and portfolio project.

External contributions may be considered after the first stable release (`v1.0.0`).

---

# License

This project is licensed under the **MIT License**.

See the `LICENSE` file for details.

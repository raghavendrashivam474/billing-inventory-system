# Billing & Inventory Management System

> **A production-oriented full-stack Billing & Inventory Management System that models real-world procurement, inventory, warehousing, sales, fulfilment, billing, and financial workflows using Clean Architecture, Domain-Driven Design, immutable audit trails, and production-ready engineering practices.**

This project is being developed as a learning and portfolio initiative to understand how enterprise ERP systems are architected, implemented, tested, documented, and maintained throughout their complete software development lifecycle.

---

# Project Status

| Item | Status |
|------|--------|
| **Version** | `v1.4.0` |
| **Current Phase** | **Phase 3 — Business Operations** |
| **Latest Release** | **v1.4.0 — Invoice Management** |
| **Current Focus** | **Sprint 3.7 — Payment Management** |
| **Development Status** | 🟢 Active |

---

# Features

## Foundation

- ✅ Modular Layered Architecture
- ✅ Versioned REST API
- ✅ PostgreSQL Integration
- ✅ Prisma ORM
- ✅ Environment Configuration
- ✅ Middleware Pipeline
- ✅ Global Error Handling
- ✅ Winston Logging
- ✅ Production Health API
- ✅ React Frontend Integration
- ✅ Comprehensive Engineering Documentation

---

## Master Data

- ✅ Category Management
- ✅ Brand Management
- ✅ Unit Management
- ✅ Tax Rate Management
- ✅ Product Management
- ✅ Supplier Management
- ✅ Customer Management
- ✅ Warehouse Management

---

## Business Operations

### Procurement

- ✅ Purchase Order Management
- ✅ Goods Receipt Management

### Inventory

- ✅ Inventory Management
- ✅ Stock Movement Ledger
- ✅ Stock Adjustment Management

### Sales & Fulfilment

- ✅ Sales Order Management
- ✅ Dispatch / Fulfilment Management

### Financial

- ✅ Invoice Management
- ⏳ Payment Management
- ⏳ Credit Notes

### Warehouse

- ⏳ Stock Transfer

---

# Complete Business Workflow

```text
                    PROCUREMENT

Supplier
    │
    ▼
Purchase Order
    │
    ▼
CONFIRMED
    │
    ▼
Goods Receipt
    │
    ▼
Inventory (+)
    │
    ▼
Stock Movement Ledger
```

```text
                    INVENTORY

Inventory
    │
    ├───────────────┐
    │               │
    ▼               ▼
Stock Adjustment   Dispatch
    │               │
Inventory (±)   Inventory (-)
```

```text
                  ORDER TO CASH

Customer
     │
     ▼
Sales Order
     │
     ▼
CONFIRMED
     │
     ▼
Dispatch
     │
     ▼
FULFILLED
     │
     ▼
Invoice
     │
     ▼
Payment (Next Sprint)
```

The application now models both physical warehouse operations and financial document workflows while maintaining clear architectural separation between inventory state and financial state.

---

# Key Capabilities

## Purchase Management

- Multi-item Purchase Orders
- Supplier & Warehouse validation
- Purchase lifecycle management
- Historical pricing snapshots
- Receipt progress tracking
- Atomic transactional writes

---

## Goods Receipt

- Partial receipts
- Multiple receipts
- Automatic inventory creation
- Automatic inventory updates
- Automatic stock movement generation
- Immutable posted receipts

---

## Inventory

- Product + Warehouse balances
- Cross-warehouse visibility
- Negative inventory prevention
- Automatic quantity management
- System-managed inventory state

---

## Stock Movement Ledger

Immutable audit history for every inventory mutation.

Supported movement types:

- PURCHASE_RECEIPT
- ADJUSTMENT_IN
- ADJUSTMENT_OUT
- SALE_DISPATCH

Every movement stores:

- Quantity Before
- Quantity Change
- Quantity After
- Business Event Reference

---

## Stock Adjustment

- Physical count corrections
- Damage/Loss adjustments
- Inventory increase/decrease
- Automatic inventory mutation
- Automatic stock movement generation
- Atomic posting

---

## Sales Order

- Multi-item Sales Orders
- Customer & Warehouse validation
- Inventory-aware confirmation
- Pricing snapshots
- Tax snapshots
- Draft lifecycle
- Decimal-safe calculations

Sales Order confirmation validates inventory but intentionally does **not** modify inventory.

---

## Dispatch / Fulfilment

- Partial dispatch support
- Multiple dispatches
- Inventory deduction
- Automatic SALE_DISPATCH stock movements
- Dispatch progress tracking
- Automatic Sales Order fulfilment
- Immutable dispatch events

Dispatch is the only outbound warehouse event that physically removes inventory.

---

## Invoice

- Invoice generation from fulfilled Sales Orders
- Immutable financial snapshots
- Snapshot pricing & taxation
- Decimal-safe monetary calculations
- Draft / Issue / Void lifecycle
- Independent financial document model
- Automatic Sales Order invoice tracking

Invoice generation never mutates inventory.

---

# Architecture

The backend follows a layered architecture.

```text
Client
   │
   ▼
Routes
   │
   ▼
Validators (Zod)
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

Responsibilities remain clearly separated.

- Routes — Endpoint registration
- Validators — Request validation
- Controllers — HTTP orchestration
- Services — Business rules & workflows
- Repositories — Database interaction
- Prisma ORM — Persistence layer

All transactional workflows execute through atomic Prisma transactions coordinated by the service layer.

---

# Current Domain Model

```text
Master Data
│
├── Category                ✅
├── Brand                   ✅
├── Unit                    ✅
├── Tax Rate                ✅
├── Product                 ✅
├── Supplier                ✅
├── Customer                ✅
└── Warehouse               ✅

Procurement
│
├── Purchase Order          ✅
└── Goods Receipt           ✅

Inventory
│
├── Inventory               ✅
├── Stock Movement          ✅
└── Stock Adjustment        ✅

Sales
│
├── Sales Order             ✅
└── Dispatch                ✅

Finance
│
├── Invoice                 ✅
├── Payment                 ⏳
└── Credit Note             ⏳

Warehouse
│
└── Stock Transfer          ⏳
```

---

# Event-Driven Inventory Architecture

```text
Goods Receipt
        │
        ▼
Inventory (+)
        │
        ▼
PURCHASE_RECEIPT

Stock Adjustment
        │
        ▼
Inventory (±)
        │
        ▼
ADJUSTMENT

Dispatch
        │
        ▼
Inventory (-)
        │
        ▼
SALE_DISPATCH
```

Every inventory mutation originates from a business event.

Direct inventory editing is impossible.

---

# Financial Architecture

```text
Sales Order
      │
      ▼
Invoice
      │
      ▼
Payment
      │
      ▼
Invoice Status

DRAFT
   │
ISSUED
   │
PARTIALLY_PAID
   │
PAID
```

Financial workflows are intentionally independent of inventory mutations.

---

# API Surface

| Domain | Endpoints |
|---------|----------:|
| Infrastructure | 3 |
| Master Data | 24 |
| Business Entities | 24 |
| Transactional Modules | 27 |
| Read-only Modules | 5 |

## Total Business API Endpoints

**83**

---

# Technology Stack

## Frontend

- React
- Vite
- TypeScript
- Axios

## Backend

- Node.js
- Express
- TypeScript

## Database

- PostgreSQL
- Prisma ORM

## Validation & Financial Processing

- Zod
- decimal.js

## Infrastructure

- Winston
- Helmet
- Morgan
- CORS
- UUID

---

# Engineering Practices

This repository emphasizes:

- Clean Architecture
- Layered Design
- Domain-Driven Design
- Aggregate-Oriented Transaction Design
- Repository Pattern
- Service Layer Pattern
- Atomic Database Transactions
- REST API Design
- Historical Data Snapshotting
- Decimal-Safe Financial Calculations
- Immutable Business Events
- Immutable Audit Ledgers
- Event-Driven Inventory
- Controlled Inventory Mutation
- Professional Git Workflow
- Conventional Commits
- Architecture Decision Records (ADR)
- Documentation-First Development
- Incremental Sprint-Based Development

---

# Repository Statistics

| Metric | Value |
|--------|------:|
| Current Version | `v1.4.0` |
| Completed Phases | 2 |
| Completed Sprints | 16 |
| Architecture Decision Records | 19 |
| Business API Endpoints | 83 |
| Master Data Modules | 8 |
| Transactional Modules | 7 |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | Zod |
| Financial Engine | decimal.js |
| Logging | Winston |

---

# Development Roadmap

## ✅ Phase 1 — Foundation

- Project Setup
- Backend Foundation

## ✅ Phase 2 — Business Modules

- Category
- Brand
- Unit
- Tax Rate
- Product
- Supplier
- Customer
- Warehouse

## 🚧 Phase 3 — Business Operations

### Procurement

- ✅ Purchase Orders
- ✅ Goods Receipts

### Inventory

- ✅ Inventory
- ✅ Stock Movement Ledger
- ✅ Stock Adjustments

### Sales

- ✅ Sales Orders
- ✅ Dispatch / Fulfilment

### Finance

- ✅ Invoice Management
- ⏳ Payment Management
- ⏳ Credit Notes

### Warehouse

- ⏳ Stock Transfer

---

## ⏳ Phase 4 — Analytics

- Dashboard
- Purchase Analytics
- Sales Analytics
- Inventory Analytics
- Financial Reports

---

## ⏳ Phase 5 — Production Readiness

- Unit Testing
- Integration Testing
- Docker
- CI/CD
- Performance Optimization
- Deployment
- Monitoring
- Backup & Recovery

---

# Release History

| Version | Milestone |
|---------|-----------|
| v0.3.0 | Backend Foundation |
| v0.4.0 | Business Module Foundation |
| v0.5.0 | Master Data Foundation |
| v0.6.0 | Core Product Domain |
| v0.7.0 | Business Partner Layer |
| v0.8.0 | Phase 2 Complete |
| v0.8.1 | Phase 3 Transition |
| v0.9.0 | Purchase Order Foundation |
| v1.0.0 | Goods Receipt, Inventory & Stock Ledger |
| v1.0.1 | Documentation Update |
| v1.1.0 | Stock Adjustment |
| v1.1.1 | Documentation Update |
| v1.2.0 | Sales Order |
| v1.2.1 | Documentation Update |
| v1.3.0 | Dispatch / Fulfilment |
| v1.3.1 | Documentation Update |
| v1.4.0 | Invoice Management |

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
├── LICENSE
└── README.md
```

---

# Documentation

The repository includes comprehensive engineering documentation covering:

- Project Documentation
- Architecture Documentation
- API Documentation
- Business Documentation
- Architecture Decision Records (19 ADRs)
- Sprint Briefs
- Sprint Completion Reports
- Development Workflow
- Coding Standards
- Design Principles
- Middleware Documentation
- Logging Documentation
- Health API Documentation

Documentation evolves alongside implementation and is treated as a first-class engineering deliverable.

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

Follow:

```text
docs/setup-instructions.md
```

---

# Repository Goals

This repository demonstrates:

- Enterprise ERP Architecture
- Production-Oriented Backend Development
- Transactional Business Workflow Modeling
- Event-Driven Inventory Management
- Financial Document Architecture
- Immutable Audit Ledgers
- Decimal-Safe Financial Processing
- Domain-Driven Design
- Modern Software Engineering Practices
- Professional Engineering Documentation

---

# Contributing

This repository is currently maintained as a learning and portfolio project.

External contributions may be considered after the architecture stabilizes and contribution guidelines are published.

---

# License

This project is licensed under the **MIT License**.

See the **LICENSE** file for details.
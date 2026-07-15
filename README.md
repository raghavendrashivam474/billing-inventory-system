# Billing & Inventory Management System

> **A production-oriented full-stack Billing & Inventory Management System that models real-world purchasing, inventory, warehousing, sales, and transactional business workflows using clean architecture, modular domain-driven design, immutable audit trails, and production-ready engineering practices.**

This project is being developed as a learning and portfolio initiative to understand how enterprise billing, inventory, purchasing, warehousing, and sales systems are architected, implemented, tested, documented, and maintained throughout their complete software development lifecycle.

---

# Project Status

| Item | Status |
|------|--------|
| **Version** | `v1.2.0` |
| **Current Phase** | **Phase 3 — Business Operations** |
| **Latest Release** | **v1.2.0 — Sales Order Management** |
| **Current Focus** | **Sprint 3.5 — Dispatch / Fulfilment** |
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

- ✅ Purchase Order Management
- ✅ Goods Receipt Management
- ✅ Inventory Management
- ✅ Stock Movement Ledger
- ✅ Stock Adjustment Management
- ✅ Sales Order Management
- ⏳ Dispatch / Fulfilment
- ⏳ Invoice Management
- ⏳ Payment Management
- ⏳ Stock Transfer

---

# Current Business Workflow

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
Stock Movement Ledger
    │
    ▼
Stock Adjustment (Optional)
    │
    ▼
Sales Order
    │
    ▼
Sales Order Confirmation
    │
    ▼
Dispatch / Fulfilment (Next Sprint)
    │
    ▼
Invoice
    │
    ▼
Payment
```

The application currently supports the complete inbound purchasing workflow and the outbound commercial workflow, while maintaining strict separation between commercial intent and physical inventory movement.

---

# Key Capabilities

## Purchase Management

- Multi-item Purchase Orders
- Supplier and Warehouse validation
- Purchase Order lifecycle management
- Atomic transactional writes
- Historical pricing snapshots
- Receipt progress tracking

---

## Goods Receipt

- Partial and multiple receipts
- Automatic inventory creation
- Automatic inventory updates
- Automatic stock movement generation
- Purchase Order receipt tracking
- Immutable posted receipts

---

## Inventory

- Product + Warehouse inventory balances
- Automatic quantity management
- Cross-warehouse visibility
- Negative inventory prevention
- System-managed inventory state

---

## Stock Movement Ledger

- Immutable inventory audit history
- Quantity before/after snapshots
- Business event references
- Complete inventory traceability

Current movement types:

- PURCHASE_RECEIPT
- ADJUSTMENT_IN
- ADJUSTMENT_OUT

---

## Stock Adjustment

- Inventory increase/decrease
- Physical count corrections
- Damage/Loss adjustments
- Automatic inventory mutation
- Automatic stock movement creation
- Atomic posting

---

## Sales Order

- Multi-item Sales Orders
- Customer validation
- Warehouse validation
- Inventory-aware confirmation
- Pricing snapshots
- Tax snapshots
- Decimal-safe monetary calculations
- Draft lifecycle management
- Confirmation workflow

Sales Order confirmation validates inventory availability but intentionally does **not** modify inventory.

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

Responsibilities are clearly separated.

- **Routes** — HTTP endpoint registration
- **Validators** — Request validation
- **Controllers** — HTTP orchestration
- **Services** — Business rules & workflows
- **Repositories** — Database access
- **Prisma** — Data mapping

All transactional workflows are coordinated through service-layer orchestration using atomic Prisma transactions.

---

# Current Domain Model

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
├── Dispatch              ⏳
├── Invoice               ⏳
└── Payment               ⏳

Warehouse Operations
│
└── Stock Transfer        ⏳
```

---

# API Surface

| Domain | Endpoints |
|---------|----------:|
| Infrastructure | 3 |
| Master Data | 24 |
| Business Entities | 24 |
| Transactional Modules | 18 |
| Read-only Modules | 5 |

## Total Business API Endpoints

**74**

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

This project emphasizes:

- Clean Architecture
- Layered Design
- Domain-Driven Modular Design
- Aggregate-Oriented Transaction Design
- Repository Pattern
- Service Layer Pattern
- Atomic Database Transactions
- REST API Design
- Historical Data Snapshotting
- Decimal-Safe Financial Calculations
- Immutable Business Events
- Immutable Audit Ledgers
- Controlled Inventory Mutation
- Inventory-Aware Validation
- Professional Git Workflow
- Conventional Commits
- Architecture Decision Records (ADR)
- Documentation-First Development
- Incremental Sprint-Based Development

---

# Repository Statistics

| Metric | Value |
|--------|------:|
| Current Version | `v1.2.0` |
| Completed Phases | 2 |
| Completed Sprints | 12 |
| Architecture Decision Records | 16 |
| Business API Endpoints | 74 |
| Master Data Modules | 8 |
| Transactional Modules | 5 |
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

---

## ✅ Phase 2 — Business Modules

- Category Management
- Brand Management
- Unit Management
- Tax Rate Management
- Product Management
- Supplier Management
- Customer Management
- Warehouse Management

---

## 🚧 Phase 3 — Business Operations

- ✅ Purchase Order Management
- ✅ Goods Receipt Management
- ✅ Inventory Foundation
- ✅ Stock Movement Ledger
- ✅ Stock Adjustment Management
- ✅ Sales Order Management
- ⏳ Dispatch / Fulfilment
- ⏳ Invoice Management
- ⏳ Payment Management
- ⏳ Stock Transfer

---

## ⏳ Phase 4 — Analytics

- Dashboard
- Reports
- Business Insights
- Inventory Analytics

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
| `v0.3.0` | Backend Foundation Complete |
| `v0.4.0` | Business Module Foundation |
| `v0.5.0` | Master Data Foundation |
| `v0.6.0` | Core Product Domain |
| `v0.7.0` | Business Partner Layer |
| `v0.8.0` | Phase 2 Complete |
| `v0.8.1` | Phase 3 Transition |
| `v0.9.0` | Purchase Order Foundation |
| `v1.0.0` | Goods Receipt, Inventory & Stock Ledger |
| `v1.1.0` | Stock Adjustment Workflow |
| `v1.2.0` | Sales Order Management |

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
- Architecture Decision Records (16 ADRs)
- Sprint Briefs
- Sprint Completion Reports
- Development Workflow
- Coding Standards
- Design Principles
- Middleware Documentation
- Logging Documentation
- Health API Documentation

Documentation is treated as a first-class engineering deliverable and evolves alongside the implementation.

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

# Repository Goals

This repository demonstrates:

- Enterprise Application Architecture
- Production-Oriented Backend Development
- Transactional Business Workflow Modeling
- Relational Database Design
- Financial Calculation Safety
- Inventory State Management
- Controlled Inventory Mutation
- Immutable Audit Ledgers
- REST API Development
- Domain-Driven Design Principles
- Professional Engineering Documentation
- Modern Software Engineering Practices

---

# Contributing

This repository is currently maintained as a learning and portfolio project.

External contributions may be considered after the architecture stabilizes and contribution guidelines are published.

---

# License

This project is licensed under the **MIT License**.

See the **LICENSE** file for details.
# Billing & Inventory Management System

> **A production-oriented full-stack Billing & Inventory Management System that models real-world procurement, inventory, warehousing, sales, fulfilment, billing, and financial settlement workflows using Clean Architecture, Domain-Driven Design (DDD), immutable audit trails, and production-ready engineering practices.**

This project is being developed as a learning and portfolio initiative to understand how modern Enterprise Resource Planning (ERP) systems are architected, implemented, documented, tested, and maintained throughout their complete software development lifecycle.

---

# Project Status

| Item | Status |
|------|--------|
| **Current Version** | `v1.5.0` |
| **Current Phase** | **Phase 3 — Business Operations** |
| **Latest Release** | **Payment Management** |
| **Current Sprint** | **Sprint 3.8 — Stock Transfer Management** |
| **Project Status** | 🟢 Active Development |

---

# Project Highlights

- ✅ Layered & Modular Architecture
- ✅ Domain-Driven Design
- ✅ Clean Service & Repository Pattern
- ✅ PostgreSQL + Prisma ORM
- ✅ RESTful Versioned APIs
- ✅ Immutable Inventory Ledger
- ✅ Event-Driven Inventory Updates
- ✅ Decimal-safe Financial Calculations
- ✅ Production-style Documentation
- ✅ Architecture Decision Records (ADRs)
- ✅ Sprint-based Development Process

---

# Features

## Foundation

- Project Foundation
- Environment Configuration
- Global Error Handling
- Logging with Winston
- Health Monitoring API
- Versioned REST APIs
- Prisma ORM Integration
- PostgreSQL Database
- React Frontend Integration

---

## Master Data

- Category Management
- Brand Management
- Unit Management
- Tax Rate Management
- Product Management
- Supplier Management
- Customer Management
- Warehouse Management

---

## Procurement

- Purchase Orders
- Goods Receipts
- Partial Receipts
- Supplier Validation
- Warehouse Validation

---

## Inventory

- Inventory Management
- Stock Movement Ledger
- Stock Adjustments
- Automatic Inventory Creation
- Automatic Inventory Updates
- Negative Inventory Prevention

---

## Sales & Fulfilment

- Sales Orders
- Inventory Validation
- Dispatch Management
- Partial Dispatch
- Fulfilment Tracking

---

## Financial

- Invoice Management
- Payment Management
- Outstanding Balance Tracking
- Partial Payments
- Multiple Payments
- Automatic Invoice Settlement

---

## Upcoming

- Stock Transfers
- Credit Notes
- Business Analytics
- Reporting Dashboard

---

# Complete ERP Workflow

```text
Supplier
     │
     ▼
Purchase Order
     │
     ▼
Goods Receipt
     │
     ▼
Inventory
     │
     ▼
Dispatch
     │
     ▼
Sales Order
     │
     ▼
Invoice
     │
     ▼
Payment
```

The system intentionally separates **physical inventory operations** from **financial settlement workflows**, following real-world ERP design principles.

---

# Business Modules

```text
Master Data
│
├── Category
├── Brand
├── Unit
├── Tax Rate
├── Product
├── Supplier
├── Customer
└── Warehouse

Business Operations
│
├── Purchase Order
├── Goods Receipt
├── Inventory
├── Stock Movement
├── Stock Adjustment
├── Sales Order
├── Dispatch
├── Invoice
└── Payment

Upcoming
│
├── Stock Transfer
└── Credit Note
```

---

# Procurement Workflow

```text
Supplier

↓

Purchase Order

↓

Goods Receipt

↓

Inventory Update

↓

Stock Movement Ledger
```

---

# Inventory Workflow

```text
Inventory

├── Goods Receipt (+)

├── Stock Adjustment (±)

└── Dispatch (-)
```

Every inventory mutation generates an immutable stock movement record.

Direct inventory modification is never allowed.

---

# Order-to-Cash Workflow

```text
Customer

↓

Sales Order

↓

Dispatch

↓

Invoice

↓

Payment

↓

Accounts Receivable Closed
```

Inventory changes stop at Dispatch.

Invoices and Payments belong exclusively to the financial domain.

---

# Financial Architecture

```text
Invoice

↓

Outstanding Balance

↓

Partial Payment

↓

Remaining Balance

↓

Paid
```

Invoice lifecycle

```text
DRAFT

↓

ISSUED

↓

PARTIALLY_PAID

↓

PAID
```

---

# Event-Driven Inventory

Inventory changes are driven only through business events.

Supported events:

- PURCHASE_RECEIPT
- ADJUSTMENT_IN
- ADJUSTMENT_OUT
- SALE_DISPATCH

Future:

- TRANSFER_OUT
- TRANSFER_IN

This guarantees complete inventory traceability.

---

# Architecture

```text
Client

↓

REST API

↓

Routes

↓

Validators

↓

Controllers

↓

Services

↓

Repositories

↓

Prisma ORM

↓

PostgreSQL
```

Every layer has a single responsibility.

Business rules live inside the Service Layer.

Database interactions remain isolated within Repositories.

---

# Domain Model

```text
Supplier
      │
      ▼
Purchase Order
      │
      ▼
Goods Receipt
      │
      ▼
Inventory
      │
      ▼
Dispatch

Customer
      │
      ▼
Sales Order
      │
      ▼
Invoice
      │
      ▼
Payment
```

---

# API Surface

| Module | Status |
|---------|--------|
| Infrastructure APIs | ✅ |
| Master Data APIs | ✅ |
| Procurement APIs | ✅ |
| Inventory APIs | ✅ |
| Sales APIs | ✅ |
| Financial APIs | ✅ |

### Total Business APIs

**86 REST Endpoints**

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

## Validation

- Zod

## Financial Calculations

- decimal.js

## Infrastructure

- Winston
- Helmet
- Morgan
- UUID
- CORS

---

# Engineering Practices

The project follows modern engineering principles:

- Clean Architecture
- Domain-Driven Design
- Layered Architecture
- Repository Pattern
- Service Layer Pattern
- Atomic Database Transactions
- REST API Design
- Immutable Business Events
- Immutable Audit Trails
- Event-Driven Inventory
- Snapshot-based Financial Documents
- Conventional Commits
- Incremental Sprint Development
- Architecture Decision Records
- Documentation-First Development

---

# Repository Statistics

| Metric | Value |
|---------|------:|
| Version | v1.5.0 |
| Completed Phases | 2 |
| Completed Sprints | 17 |
| Business Modules | 16 |
| REST APIs | 86 |
| ADRs | 20 |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | Zod |
| Financial Engine | decimal.js |

---

# Repository Structure

```text
billing-inventory-system/

backend/
frontend/
database/
docs/
scripts/
shared/

README.md
LICENSE
```

---

# Development Roadmap

## ✅ Phase 1 — Foundation

- Backend Foundation
- Infrastructure
- Environment Configuration
- Middleware
- Database Integration

---

## ✅ Phase 2 — Master Data

- Categories
- Brands
- Units
- Tax Rates
- Products
- Suppliers
- Customers
- Warehouses

---

## 🚧 Phase 3 — Business Operations

### Procurement

- ✅ Purchase Orders
- ✅ Goods Receipts

### Inventory

- ✅ Inventory
- ✅ Stock Movement
- ✅ Stock Adjustment
- ⏳ Stock Transfer

### Sales

- ✅ Sales Orders
- ✅ Dispatch

### Finance

- ✅ Invoice
- ✅ Payment
- ⏳ Credit Notes

---

## ⏳ Phase 4 — Analytics

- Dashboard
- Sales Analytics
- Inventory Analytics
- Procurement Analytics
- Financial Reports

---

## ⏳ Phase 5 — Production Readiness

- Unit Testing
- Integration Testing
- Docker
- CI/CD
- Monitoring
- Performance Optimization
- Deployment

---

# Release History

| Version | Milestone |
|-----------|-----------------------------|
| v0.3.0 | Backend Foundation |
| v0.4.0 | Business Module Foundation |
| v0.5.0 | Master Data Foundation |
| v0.6.0 | Product Domain |
| v0.7.0 | Business Partners |
| v0.8.0 | Phase 2 Complete |
| v0.9.0 | Purchase Orders |
| v1.0.0 | Goods Receipt & Inventory |
| v1.1.0 | Stock Adjustments |
| v1.2.0 | Sales Orders |
| v1.3.0 | Dispatch |
| v1.4.0 | Invoice Management |
| **v1.5.0** | **Payment Management** |

---

# Documentation

The repository includes comprehensive engineering documentation covering:

- Architecture Documentation
- API Documentation
- Business Documentation
- Sprint Briefs
- Sprint Reports
- ADRs
- Setup Guides
- Development Standards
- Logging Documentation
- Health API Documentation

Documentation evolves alongside implementation and is treated as a first-class engineering deliverable.

---

# Quick Start

Clone the repository

```bash
git clone https://github.com/raghavendrashivam474/billing-inventory-system.git
```

Navigate into the project

```bash
cd billing-inventory-system
```

Install dependencies

```bash
npm install
```

Configure environment variables

```bash
cp .env.example .env
```

Run the backend

```bash
npm run dev
```

---

# Repository Goals

This repository demonstrates:

- Enterprise ERP Architecture
- Production-Oriented Backend Development
- Domain-Driven Design
- Transactional Workflow Modeling
- Event-Driven Inventory
- Financial Document Processing
- Clean Architecture
- Production Engineering Practices
- Professional Documentation

---

# Contributing

This project is currently maintained as a learning and portfolio project.

External contributions may be considered after the architecture stabilizes and contribution guidelines are published.

---

# License

This project is licensed under the **MIT License**.

See the **LICENSE** file for details.
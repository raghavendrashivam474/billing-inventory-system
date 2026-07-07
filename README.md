# Billing & Inventory Management System

> **A production-oriented full-stack Billing & Inventory Management System that models real-world retail operations using modern software engineering practices, clean architecture, and production-ready development workflows.**

This project is being developed as a learning and portfolio initiative to understand how enterprise billing and inventory systems are architected, implemented, documented, tested, and maintained throughout their complete software development lifecycle.

---

# Project Status

| Item | Status |
|------|--------|
| **Version** | `v0.7.0` |
| **Current Phase** | Phase 2 — Business Module Development |
| **Current Sprint** | Sprint 2.6 — Warehouse Management |
| **Development Status** | 🟢 Active |
| **Foundation** | ✅ Complete |
| **Master Data** | 🚧 Near Completion |
| **Core Product Domain** | ✅ Complete |
| **Business Partner Layer** | ✅ Complete |
| **Business Modules** | 🚧 In Progress |

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
- ✅ Frontend ↔ Backend Integration
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
- ⏳ Warehouse Management

---

## Engineering Documentation

- ✅ Sprint Briefs
- ✅ Sprint Completion Reports
- ✅ Architecture Decision Records (ADR)
- ✅ Project Structure Guide
- ✅ Coding Standards
- ✅ Design Principles
- ✅ Development Workflow
- ✅ Roadmap
- ✅ Glossary
- ✅ Business Documentation

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

## Infrastructure

- Winston
- Helmet
- Morgan
- CORS
- UUID

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

Each layer owns a single responsibility and communicates only with adjacent layers.

---

# Current Business Domain

```text
Master Data
│
├── Category        ✅
├── Brand           ✅
├── Unit            ✅
├── Tax Rate        ✅
├── Product         ✅
├── Supplier        ✅
├── Customer        ✅
└── Warehouse       ⏳

Business Operations
│
├── Purchase        ⏳
├── Inventory       ⏳
├── Stock Movement  ⏳
├── Sales           ⏳
├── Billing         ⏳
└── Payments        ⏳
```

The Product module is now the central business entity and serves as the foundation for all future transactional workflows.

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

The objective is not only to build production-quality software, but also to document the engineering decisions, trade-offs, and architectural evolution throughout the project.

---

# Documentation

The `docs/` directory contains comprehensive engineering documentation, including:

- Project Documentation
- Repository Guide
- Project Structure
- Architecture Documentation
- API Documentation
- Business Documentation
- Architecture Decision Records (ADR)
- Sprint Briefs
- Sprint Completion Reports
- Coding Standards
- Design Principles
- Development Workflow
- Roadmap
- Glossary
- Middleware Documentation
- Logging Documentation
- Health API Documentation

Documentation evolves alongside the implementation and is treated as a first-class deliverable.

---

# Development Roadmap

## ✅ Phase 1 — Foundation

- Project Setup
- Backend Foundation

---

## 🚧 Phase 2 — Business Modules

- ✅ Category Management
- ✅ Brand Management
- ✅ Unit Management
- ✅ Tax Rate Management
- ✅ Product Management
- ✅ Supplier Management
- ✅ Customer Management
- ⏳ Warehouse Management

---

## ⏳ Phase 3 — Business Operations

- Purchase Management
- Inventory Management
- Stock Movement
- Sales Management
- Billing
- Invoice Generation
- Payment Processing

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

- Clean Architecture
- Layered Design
- Domain-Oriented Development
- Modular Software Design
- REST API Design
- Repository Pattern
- Service Layer Pattern
- Professional Git Workflow
- Conventional Commits
- Architecture Decision Records (ADR)
- Documentation-First Development
- Incremental Sprint-Based Development

---

| Phase | Status |
|------|--------|
| Project Foundation | ✅ Complete |
| Backend Foundation | ✅ Complete |
| Master Data | 🚧 Near Completion |
| Business Partner Layer | ✅ Complete |
| Business Modules | 🚧 In Progress |
| Business Operations | ⏳ Planned |
| Analytics | ⏳ Planned |
| Production Readiness | ⏳ Planned |

---

# Repository Goals

This repository demonstrates:

- Enterprise Application Architecture
- Clean Architecture Principles
- Production-Oriented Backend Development
- Relational Database Design
- REST API Development
- Domain-Oriented Module Organization
- Engineering Documentation Practices
- Professional Git Workflow
- Incremental Software Delivery

---

# Contributing

This repository is currently maintained by a single developer as a learning and portfolio project.

External contributions may be considered after the first stable release (`v1.0.0`).

---

# License

This project is developed for educational, experimentation, and portfolio purposes.
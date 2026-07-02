# ADR-0001 — Adopt Layered Backend Architecture

**Date:** 27 June 2026

**Status:** Accepted

**Sprint:** Sprint 1.4 — Backend Architecture

**Authors:** Raghavendra Singh

---

# Context

The Billing & Inventory Management System is expected to grow into a production-oriented application consisting of multiple business modules, including Products, Inventory, Purchasing, Billing, Sales, Customers, Suppliers, Warehouses, and Reporting.

As the application grows, business logic, database access, request handling, and infrastructure concerns must remain clearly separated to maintain readability, scalability, and maintainability.

Without a defined architecture, responsibilities can become mixed across the codebase, leading to duplicated logic, difficult testing, tight coupling, and reduced maintainability.

A consistent architectural pattern is therefore required before implementing business functionality.

---

# Decision

The backend will adopt a layered architecture with strict separation of responsibilities.

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

Each layer has a single responsibility and communicates only with the layer immediately below it.

---

# Layer Responsibilities

## Routes

Responsible for:

- Registering API endpoints
- Applying middleware
- Delegating requests to controllers

Routes must never contain business logic.

---

## Controllers

Responsible for:

- Receiving HTTP requests
- Extracting request data
- Calling service methods
- Returning HTTP responses

Controllers must never access the database directly.

---

## Services

Responsible for:

- Business rules
- Workflow orchestration
- Validation coordination
- Calling repositories

Services remain independent of HTTP concerns.

---

## Repositories

Responsible for:

- Database queries
- Prisma operations
- Data persistence
- Mapping database entities

Repositories contain no business rules.

---

## Infrastructure

Infrastructure includes:

- Prisma
- PostgreSQL
- Logging
- Configuration
- Middleware

These components support the application but remain outside business logic.

---

# Rationale

This architecture was selected because it provides:

- Clear separation of concerns
- Improved maintainability
- Better testability
- Reduced coupling
- Easier onboarding for future contributors
- Consistent development patterns across all business modules
- Scalability as additional modules are introduced

The architecture also aligns with common enterprise backend development practices.

---

# Alternatives Considered

## Option 1 — MVC with Database Access Inside Controllers

### Advantages

- Faster for small projects
- Fewer files

### Disadvantages

- Business logic becomes scattered
- Difficult to test
- Controllers become large
- Tight coupling between HTTP and database

Decision: Rejected.

---

## Option 2 — Direct Prisma Calls from Routes

### Advantages

- Minimal code
- Rapid prototyping

### Disadvantages

- No separation of concerns
- Duplicate logic
- Poor scalability
- Difficult maintenance

Decision: Rejected.

---

## Option 3 — Layered Architecture

### Advantages

- Clear responsibilities
- Modular codebase
- Scalable
- Testable
- Enterprise-friendly
- Consistent development workflow

### Disadvantages

- More files
- Slightly higher initial complexity

Decision: Accepted.

---

# Consequences

## Positive

- Every business module follows the same structure.
- Business logic remains isolated.
- Database implementation can evolve independently.
- Easier code reviews.
- Easier debugging.
- Better long-term maintainability.

## Negative

- Increased number of files.
- Slightly more boilerplate for small features.
- Developers must understand layer responsibilities before contributing.

---

# Engineering Rules Established

The following rules are now mandatory throughout the project:

- Routes never contain business logic.
- Controllers never access Prisma directly.
- Services contain all business logic.
- Repositories own all database operations.
- Infrastructure components remain independent of business modules.
- Layers communicate only with adjacent layers.

---

# Future Impact

All future modules—including Products, Inventory, Suppliers, Customers, Billing, Sales, Reports, and Authentication—must follow this architectural pattern.

Any proposed architectural changes should be documented through a new ADR rather than modifying this decision.

---

# References

- Sprint 1.4 — Backend Architecture
- `backend/src/`
- Backend Architecture Documentation
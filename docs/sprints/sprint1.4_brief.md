# Sprint 1.4 — Backend Architecture

## Implementation Brief for Junior Developer

### Project

Billing & Inventory Management System

### Sprint

Sprint 1 — Backend Foundation & Architecture

### Sub-Sprint

Sprint 1.4 — Backend Architecture

---

# Objective

Design and establish a scalable, modular, and maintainable backend architecture that will serve as the foundation for all future business modules.

The objective of this sprint is **not** to implement business functionality but to define the application's structural organization and architectural boundaries.

Every future module (Products, Customers, Inventory, Sales, Billing, Reports, etc.) will conform to the architecture established during this sprint.

---

# Background

The project currently has:

* React frontend initialized
* Express backend initialized
* PostgreSQL configured
* Prisma ORM integrated
* Environment configuration completed

Before implementing APIs and business logic, the backend must adopt a consistent project structure.

---

# Scope

This sprint includes:

* Backend folder organization
* Layered architecture
* Module boundaries
* Shared utilities
* Common type definitions
* Central export files
* Architecture documentation

---

# Out of Scope

Do **NOT** implement:

* Authentication
* API endpoints
* Controllers with business logic
* Database queries
* Products
* Customers
* Inventory
* Billing
* Reports
* Middleware logic
* Validation logic

This sprint establishes only the project structure.

---

# Architecture Philosophy

The backend should follow a layered architecture.

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

Each layer has a single responsibility.

---

# Tasks

## Task 1 — Create Folder Structure

Create the following directories inside `backend/src`:

```text
config/
controllers/
middlewares/
modules/
repositories/
routes/
services/
types/
utils/
validators/
```

Each directory should contain an `index.ts` placeholder.

---

## Task 2 — Organize Existing Files

Move existing files into their appropriate architectural locations.

The project root should remain clean and organized.

---

## Task 3 — Module Boundary Guidelines

Document the responsibilities of each layer.

### Routes

* Register API endpoints.
* Delegate requests to controllers.
* No business logic.

---

### Controllers

* Receive HTTP requests.
* Validate request flow.
* Call services.
* Return HTTP responses.
* No database access.

---

### Services

* Implement business logic.
* Coordinate application workflows.
* Call repositories.
* No HTTP-specific logic.

---

### Repositories

* Handle database operations.
* Use Prisma Client.
* Return domain data.
* No business rules.

---

### Validators

* Validate request payloads.
* Define reusable schemas.
* No business logic.

---

### Utilities

Shared helper functions.

Examples:

* Date helpers
* String helpers
* Number helpers
* Error utilities

---

### Types

Shared TypeScript interfaces and type definitions.

---

### Config

Centralized application configuration.

---

## Task 4 — Barrel Files

Create an `index.ts` inside every directory.

Purpose:

* Centralize exports.
* Simplify imports.
* Prepare for module expansion.

---

## Task 5 — Module Placeholder

Create the first empty module.

Example:

```text
modules/

health/
```

Only folder structure is required.

No implementation.

---

## Task 6 — Documentation

Create:

```text
docs/architecture/
```

Include:

* Backend architecture overview
* Layer responsibilities
* Folder organization
* Dependency flow

---

# Deliverables

Expected project structure:

```text
backend/

src/

config/

controllers/

middlewares/

modules/

repositories/

routes/

services/

types/

utils/

validators/
```

---

# Validation Checklist

Verify:

* Folder structure created.
* Barrel files created.
* No circular dependencies.
* Architecture documented.
* Project builds successfully.
* Existing functionality still operates.

---

# Engineering Rules

The following rules become mandatory after this sprint.

## Rule 1

Controllers must never access Prisma directly.

---

## Rule 2

Services contain business logic.

---

## Rule 3

Repositories own database access.

---

## Rule 4

Routes never contain business logic.

---

## Rule 5

Utilities must remain framework-independent.

---

## Rule 6

Configuration must always be accessed through the configuration module.

---

# Documentation

Update:

* README
* Folder Structure
* Backend Architecture
* Sprint Documentation

---

# Expected Completion Report

Include:

* Folder structure
* Architecture overview
* Files created
* Layer responsibilities
* Documentation updates
* Issues encountered
* Lessons learned
* Technical decisions

---

# Definition of Done

Sprint 1.4 is complete when:

* Backend architecture is established.
* Folder structure is complete.
* Layer responsibilities are documented.
* Barrel files exist.
* Existing application still builds.
* Documentation updated.

No business functionality should be introduced.

---

# Success Criteria

At the end of Sprint 1.4, the backend should have a production-quality architectural foundation that can support all future business modules without requiring structural reorganization.

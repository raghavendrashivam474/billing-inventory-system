# Project Structure

This document describes the repository organization of the **Billing & Inventory Management System** and the purpose of each directory.

The project follows a modular structure that separates frontend, backend, documentation, database resources, and shared assets. The goal is to keep the codebase scalable, maintainable, and easy to navigate as new features are introduced.

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

---

# Root Directories

## backend/

Contains the complete backend application built with Node.js, Express, TypeScript, PostgreSQL, and Prisma.

Responsibilities:

- Business logic
- REST APIs
- Database access
- Authentication
- Validation
- Middleware
- Logging
- Error handling

This directory contains all server-side code.

---

## frontend/

Contains the React application responsible for the user interface.

Responsibilities:

- User interface
- API communication
- Forms
- State management
- Business dashboards

The frontend communicates only with the backend REST API.

---

## docs/

Contains all engineering documentation.

Documentation includes:

- Architecture
- Sprint Reports
- Sprint Briefs
- ADRs
- API Documentation
- Business Documentation
- Engineering Standards

Documentation evolves together with the software.

---

## database/

Contains database-related resources.

Examples:

- SQL scripts
- Seed data
- Database utilities
- Migration notes

Database schema itself is managed by Prisma.

---

## scripts/

Contains utility scripts used during development.

Examples:

- Database helpers
- Development automation
- Build scripts
- Maintenance scripts

Scripts should never contain application business logic.

---

## shared/

Contains resources shared between frontend and backend.

Examples:

- Shared TypeScript types
- Constants
- Utility functions
- DTOs (if shared)

Keeping common resources here avoids duplication.

---

# Backend Structure

```text
backend/
│
├── prisma/
├── src/
├── logs/
│
├── package.json
├── tsconfig.json
└── .env.example
```

---

## prisma/

Contains Prisma ORM resources.

```text
prisma/
├── migrations/
└── schema.prisma
```

Responsibilities:

- Database schema
- Migrations
- Prisma Client generation

No application logic belongs here.

---

## src/

Contains the complete backend source code.

```
src/
```

Every backend feature starts here.

---

# src/config/

Configuration layer.

Responsibilities:

- Environment configuration
- Prisma client
- Shared application configuration

No business logic belongs here.

---

# src/constants/

Shared application constants.

Examples:

- API versions
- Status messages
- HTTP status codes

Avoid hardcoded values throughout the application.

---

# src/routes/

Application routing.

Responsibilities:

- Register endpoints
- API versioning
- Route composition

Routes should never contain business logic.

---

# src/controllers/

HTTP layer.

Responsibilities:

- Receive requests
- Validate request flow
- Call services
- Return responses

Controllers should remain thin.

---

# src/services/

Business logic layer.

Responsibilities:

- Business rules
- Workflow coordination
- Validation after DTO parsing
- Transaction orchestration

Most application logic belongs here.

---

# src/repositories/

Data access layer.

Responsibilities:

- Prisma queries
- CRUD operations
- Database interaction

Repositories never contain business rules.

---

# src/modules/

Feature-based organization.

Each business capability is implemented as a module.

Example:

```text
modules/
└── category/
```

Every module follows a standard structure.

---

# Standard Module Structure

```text
module/
│
├── dto/
│
├── module.controller.ts
├── module.service.ts
├── module.repository.ts
├── module.routes.ts
├── module.validator.ts
│
└── index.ts
```

Every future module follows this same layout.

---

# src/middlewares/

Application middleware.

Responsibilities:

- Security
- Logging
- CORS
- Request IDs
- Error handling
- Request timing

Middleware executes before or after controllers.

---

# src/logger/

Centralized logging infrastructure.

Responsibilities:

- Winston configuration
- Log formatting
- Log transports

Only one logger instance should exist.

---

# src/utils/

Reusable helper functions.

Examples:

- Pagination
- Response builders
- Formatting utilities

Utilities should remain framework-independent whenever possible.

---

# src/types/

Shared TypeScript types.

Examples:

- API responses
- Pagination
- Shared interfaces

---

# src/validators/

Reusable validation utilities.

Validation should be reusable across multiple modules.

---

# logs/

Runtime-generated log files.

Examples:

```text
logs/
├── application.log
└── error.log
```

Logs are excluded from version control.

---

# Engineering Principles

The repository follows several structural principles.

## Separation of Concerns

Every directory has one clearly defined responsibility.

---

## Layered Architecture

Business logic never communicates directly with the database.

```
Routes

↓

Controllers

↓

Services

↓

Repositories

↓

Prisma

↓

PostgreSQL
```

---

## Feature Modularity

Business capabilities are organized into independent modules.

This allows new functionality to be added without affecting existing modules.

---

## Documentation First

Engineering documentation is maintained alongside implementation.

No major feature is considered complete without documentation updates.

---

## Scalability

The repository structure is designed to support future modules including:

- Products
- Inventory
- Purchases
- Sales
- Billing
- Reports
- Authentication
- Notifications

without requiring structural changes.

---

# Current Status

The repository structure established during Sprint 1 serves as the long-term architectural foundation for the project.

Future development will focus on expanding business modules while preserving the existing architecture.
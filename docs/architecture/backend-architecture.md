# Backend Architecture Overview

## Project: Billing & Inventory Management System
## Sprint: 1.4 — Backend Architecture

---

## Architecture Pattern

The backend follows a Layered Architecture pattern.
Client Request
│
▼
┌─────────────┐
│ Routes │ Register endpoints, delegate to controllers
└─────────────┘
│
▼
┌─────────────┐
│ Controllers │ Handle HTTP, call services, return responses
└─────────────┘
│
▼
┌─────────────┐
│ Services │ Business logic, coordinate workflows
└─────────────┘
│
▼
┌─────────────┐
│Repositories │ Database access via Prisma
└─────────────┘
│
▼
┌─────────────┐
│ Prisma ORM │ Query builder and schema manager
└─────────────┘
│
▼
┌─────────────┐
│ PostgreSQL │ Relational database
└─────────────┘

text


---

## Folder Structure
backend/src/
├── config/ Configuration module
├── controllers/ HTTP request handlers
├── middlewares/ Express middleware functions
├── modules/ Feature modules (health, products, etc.)
├── repositories/ Database access layer
├── routes/ API route definitions
├── services/ Business logic layer
├── types/ Shared TypeScript types
├── utils/ Shared utility functions
└── validators/ Request validation schemas

text


---

## Layer Responsibilities

### Routes
- Register API endpoints
- Apply route-level middleware
- Delegate to controllers
- No business logic

### Controllers
- Receive HTTP requests
- Extract and validate request data
- Call service layer
- Return HTTP responses
- No direct database access

### Services
- Implement business logic
- Coordinate workflows
- Call repositories
- No HTTP-specific code

### Repositories
- Database CRUD operations
- Prisma Client usage
- Data transformation
- No business rules

### Middlewares
- Request preprocessing
- Authentication (future)
- Logging
- Error handling

### Validators
- Request payload validation
- Schema definitions
- Reusable validation rules

### Types
- Shared TypeScript interfaces
- API response types
- Domain types

### Utils
- Helper functions
- Framework-independent
- Reusable across layers

### Config
- Environment variable access
- Single source of truth
- Runtime configuration

---

## Engineering Rules

1. Controllers never access Prisma directly
2. Services contain all business logic
3. Repositories own all database access
4. Routes never contain business logic
5. Utils are framework-independent
6. Config is accessed only through the config module
7. No circular dependencies between layers

---

## Module Structure (Future)

Each business module follows this pattern:
modules/
└── [module-name]/
├── [module].controller.ts
├── [module].service.ts
├── [module].repository.ts
├── [module].routes.ts
├── [module].validator.ts
└── index.ts

text

# Coding Standards

This document defines the coding standards followed throughout the **Billing & Inventory Management System**.

The purpose of these standards is to ensure that every part of the codebase remains consistent, readable, maintainable, and easy to extend as the project grows.

These standards apply to both existing and future development.

---

# General Principles

Code should prioritize:

- Readability over cleverness
- Consistency over personal preference
- Maintainability over shortcuts
- Simplicity over unnecessary complexity

When multiple solutions exist, choose the one that is easiest for another developer to understand.

---

# Naming Conventions

## Variables

Use camelCase.

```typescript
const categoryName = '';
const productCount = 0;
const isActive = true;
```

Avoid abbreviations.

❌

```typescript
const cat = {};
const usr = {};
```

---

## Functions

Use camelCase.

Functions should describe actions.

```typescript
createCategory()

updateBrand()

findProductById()

deleteSupplier()

calculateInventoryValue()
```

Avoid generic names.

❌

```
doTask()

process()

execute()

run()
```

---

## Classes

Use PascalCase.

```typescript
CategoryService

BrandRepository

ProductController

AppError
```

---

## Interfaces

Use PascalCase.

Avoid prefixing with `I`.

Good

```typescript
ApiResponse

PaginationMeta

CreateCategoryDto
```

Avoid

```typescript
ICategory

IApiResponse
```

---

## Enums

Use PascalCase.

Members use PascalCase.

```typescript
enum UserRole {
    Admin,
    Manager,
    Staff
}
```

---

## Constants

Global constants use UPPER_SNAKE_CASE.

```typescript
API_VERSION

HTTP_STATUS

DEFAULT_PAGE_SIZE
```

Local constants use camelCase.

---

# File Naming

Use kebab-case.

Examples:

```
category.service.ts

category.controller.ts

category.repository.ts

health.routes.ts

format-memory.ts
```

Avoid:

```
CategoryService.ts

Category_Controller.ts

CategoryServiceNew.ts
```

---

# Folder Naming

Use lowercase.

If multiple words are required, use kebab-case.

```
health/

tax-rate/

request-id/

purchase-order/
```

---

# Module Structure

Every module follows the same structure.

```text
module/

dto/

module.controller.ts

module.service.ts

module.repository.ts

module.routes.ts

module.validator.ts

index.ts
```

No exceptions without an ADR.

---

# Controller Standards

Controllers should:

- Receive HTTP requests
- Extract request data
- Call services
- Return HTTP responses

Controllers should never:

- Query Prisma
- Implement business rules
- Perform calculations

Controllers should remain thin.

---

# Service Standards

Services own all business logic.

Examples:

- Duplicate prevention
- Business validation
- Workflow coordination
- Transactions

Services never:

- Access req/res
- Send HTTP responses

---

# Repository Standards

Repositories interact only with Prisma.

Responsibilities include:

- CRUD operations
- Database queries
- Persistence

Repositories never:

- Throw HTTP responses
- Implement business rules

---

# Route Standards

Routes should only register endpoints.

Good

```
GET /categories

POST /categories

PATCH /categories/:id
```

Routes never contain logic.

---

# DTO Standards

Every request payload should have its own DTO.

Examples:

```
create-category.dto.ts

update-category.dto.ts

query-category.dto.ts
```

Validation belongs in DTO schemas.

---

# Validation Standards

All request validation uses Zod.

Validation should occur before controllers execute.

Invalid requests return `400 Bad Request`.

Business validation belongs in services.

---

# Error Handling

Never return inconsistent error responses.

Use:

```typescript
throw AppError.notFound()

throw AppError.conflict()

throw AppError.badRequest()
```

Avoid manually constructing error responses inside services.

---

# Logging Standards

Use the shared Winston logger.

Good

```typescript
logger.info()

logger.warn()

logger.error()

logger.debug()
```

Never use:

```typescript
console.log()

console.error()

console.warn()
```

---

# Database Standards

Use Prisma for all database operations.

Never write raw SQL unless absolutely necessary.

Database access must go through repositories.

---

# API Response Format

Successful responses follow:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

Error responses follow:

```json
{
  "success": false,
  "message": "...",
  "statusCode": 400
}
```

All modules should use the same structure.

---

# Import Order

Imports should appear in this order.

1. Node.js modules
2. Third-party packages
3. Configuration
4. Constants
5. Shared utilities
6. Internal modules
7. Types

Example

```typescript
import path from 'path';

import express from 'express';

import { config } from '../config/environment';

import { HTTP_STATUS } from '../constants/api';

import { logger } from '../logger';

import { CategoryService } from './category.service';

import { ApiResponse } from '../types';
```

---

# Function Length

Prefer functions under **40 lines**.

If a function becomes difficult to read, extract smaller helper functions.

---

# Service Size

Prefer services below **300–400 lines**.

Large services should be split into domain-specific services.

---

# Comments

Write comments to explain **why**, not **what**.

Good

```typescript
// Soft delete preserves historical transaction integrity.
```

Avoid

```typescript
// Increment i.
i++;
```

---

# Git Commit Convention

Follow Conventional Commits.

Examples:

```
feat:

fix:

docs:

refactor:

test:

chore:

perf:

build:
```

Examples

```
feat: implement category CRUD

fix: resolve duplicate brand validation

docs: update API documentation

refactor: simplify pagination utility
```

---

# Documentation Requirements

A feature is complete only when:

- Code is implemented
- Documentation is updated
- Sprint report is written
- ADR added if required

Documentation is part of the Definition of Done.

---

# Code Review Checklist

Before committing code, verify:

- Naming conventions followed
- No duplicated logic
- No unused imports
- No commented-out code
- No console.log statements
- TypeScript builds successfully
- Validation implemented
- Documentation updated
- Tests pass (when available)

---

# Summary

These standards establish a consistent development style across the project.

Following them ensures that new modules integrate naturally with the existing architecture, reduces maintenance costs, and makes the codebase easier to understand for future contributors.
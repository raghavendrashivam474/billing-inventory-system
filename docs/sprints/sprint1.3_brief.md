# Sprint 1.3 — Environment Configuration

## Implementation Brief for Junior Developer

### Project

Billing & Inventory Management System

### Sprint

Sprint 1 — Backend Foundation & Architecture

### Sub-Sprint

Sprint 1.3 — Environment Configuration

---

# Objective

Establish a centralized, secure, and maintainable configuration system for both the frontend and backend applications.

The application must no longer rely on hardcoded configuration values. All configurable values should be managed through environment variables.

This sprint focuses only on configuration management and environment loading.

---

# Background

The project currently has:

* React frontend initialized
* Express backend initialized
* PostgreSQL configured
* Prisma connected to PostgreSQL
* Initial migration completed

Before implementing business features, the application's runtime configuration must be standardized.

---

# Scope

This sprint includes:

* Backend environment configuration
* Frontend environment configuration
* Environment variable validation
* Configuration module creation
* Secure handling of sensitive information
* Documentation updates

---

# Out of Scope

Do NOT implement:

* Authentication
* User management
* Business APIs
* Database models
* Product module
* Customer module
* Supplier module
* Inventory module
* Billing module

---

# Tasks

## Task 1 — Backend Environment Review

Review the existing backend `.env` file.

Verify that all required variables exist.

Minimum required variables:

* PORT
* NODE_ENV
* DATABASE_URL

Do not expose credentials in source control.

---

## Task 2 — Backend Environment Template

Review and update:

```text
backend/.env.example
```

The example file must contain placeholder values only.

Example:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

Never include real usernames or passwords.

---

## Task 3 — Frontend Environment

Create:

```text
frontend/.env
```

and

```text
frontend/.env.example
```

Configure:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Do not add additional variables unless required.

---

## Task 4 — Configuration Module

Create a dedicated backend configuration module.

Purpose:

* Read environment variables
* Export application configuration
* Provide a single source of truth for runtime settings

Business logic must never access `process.env` directly.

Instead:

```text
Application

↓

Configuration Module

↓

Environment Variables
```

---

## Task 5 — Environment Validation

Implement validation during application startup.

If a required environment variable is missing:

* Stop application startup
* Display a meaningful error message
* Exit gracefully

The application must never continue with invalid configuration.

---

## Task 6 — Verify Runtime Configuration

Confirm:

* Backend loads environment variables correctly.
* Prisma connects using `DATABASE_URL`.
* Frontend uses `VITE_API_BASE_URL`.
* No hardcoded URLs remain.

---

# Deliverables

Expected project state:

```text
backend/

.env
.env.example

src/

config/
    environment.ts

frontend/

.env
.env.example
```

---

# Validation Checklist

Before marking this sprint complete, verify:

* Backend `.env` exists
* Backend `.env.example` updated
* Frontend `.env` exists
* Frontend `.env.example` created
* Configuration module implemented
* Required variables validated
* Backend starts successfully
* Frontend starts successfully
* Prisma still connects
* No sensitive information committed

---

# Documentation

Update:

* Setup Instructions
* Environment Variables Guide
* README (if necessary)

Document:

* Required environment variables
* Purpose of each variable
* Example values
* Security guidelines

---

# Security Requirements

* `.env` files must remain gitignored.
* Only `.env.example` files may be committed.
* Secrets must never appear in documentation.
* API keys and passwords must never be hardcoded.

---

# Expected Completion Report

The completion report should include:

* Environment variables configured
* Files created
* Validation mechanism implemented
* Configuration module overview
* Verification results
* Issues encountered
* Root cause analysis
* Resolution
* Lessons learned

---

# Definition of Done

Sprint 1.3 is complete when:

* Backend configuration is fully environment-driven.
* Frontend configuration is fully environment-driven.
* Required variables are validated during startup.
* No hardcoded runtime configuration remains.
* Documentation is updated.
* Sensitive configuration is excluded from version control.

---

# Success Criteria

At the end of this sprint, the project should have a secure, centralized, and maintainable configuration system that supports development today and deployment to different environments (development, staging, production) in the future without requiring code changes.

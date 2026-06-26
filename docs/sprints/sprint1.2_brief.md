# Sprint 1.2 — Prisma ORM Setup

## Implementation Brief for Junior Developer

### Project

Billing & Inventory Management System

### Sprint

Sprint 1 — Backend Foundation & Architecture

### Sub-Sprint

Sprint 1.2 — Prisma ORM Setup

---

# Objective

Configure Prisma ORM as the application's database access layer and connect it to the PostgreSQL development database.

This sprint establishes the database tooling that will be used throughout the project.

No business entities or application features should be implemented during this sprint.

---

# Background

Sprint 1.1 has already been completed.

The PostgreSQL development environment is operational with the following configuration:

* PostgreSQL installed and running
* Development database created
* Dedicated application user configured
* Database connectivity verified

Your responsibility is to integrate Prisma with this existing database.

---

# Scope

The following work is included in this sprint:

* Install Prisma CLI
* Install Prisma Client
* Initialize Prisma
* Configure PostgreSQL datasource
* Configure environment variables
* Generate Prisma Client
* Validate database connection
* Verify Prisma Studio launches successfully

---

# Out of Scope

Do NOT implement:

* User model
* Product model
* Customer model
* Supplier model
* Inventory model
* Authentication
* CRUD APIs
* Business tables
* Seed data

Those belong to future sprints.

---

# Tasks

## Task 1 — Install Dependencies

Install the required packages.

Required:

* prisma
* @prisma/client

Verify installation before continuing.

---

## Task 2 — Initialize Prisma

Initialize Prisma inside the backend project.

Expected result:

* prisma directory created
* schema.prisma created
* .env created (if missing)

---

## Task 3 — Configure Prisma Schema

Update the datasource configuration to use PostgreSQL.

Configure:

* provider
* DATABASE_URL environment variable

Generator should target Prisma Client for TypeScript.

Do not create business models.

---

## Task 4 — Configure Environment Variables

Ensure the backend `.env` contains:

* DATABASE_URL
* PORT
* NODE_ENV

Create or update `.env.example`.

Never commit the real `.env` file.

---

## Task 5 — Generate Prisma Client

Generate Prisma Client successfully.

Confirm no generation errors.

---

## Task 6 — Initial Migration

Attempt to create the initial migration.

Expected behavior:

* If Prisma creates an initial migration, verify it succeeds.
* If Prisma reports that no migration is required because no models exist yet, document the result. Do not introduce placeholder models solely to force a migration.

---

## Task 7 — Verify Prisma Studio

Launch Prisma Studio.

Expected outcome:

* Application starts successfully.
* Database connection established.
* No runtime errors.

---

# Validation Checklist

Before marking this sprint complete, verify:

* Prisma CLI installed
* Prisma Client installed
* Prisma initialized
* schema.prisma configured
* DATABASE_URL functioning
* Prisma Client generated
* Database connection successful
* Prisma Studio opens correctly
* No TypeScript errors
* No npm errors

---

# Deliverables

Repository should now contain:

```text
backend/

prisma/
    schema.prisma
    migrations/ (if generated)

src/

.env.example

package.json

package-lock.json
```

---

# Documentation

Update:

* Setup Instructions
* Environment Configuration
* Database Setup Guide

Include:

* Prisma version
* PostgreSQL version
* Installation steps
* Verification commands

---

# Expected Completion Report

Upon completion, prepare a report including:

* Packages installed
* Prisma version
* PostgreSQL version
* Database connection status
* Migration result
* Prisma Client generation status
* Prisma Studio verification
* Issues encountered
* Root cause analysis
* Resolution
* Lessons learned

---

# Definition of Done

Sprint 1.2 is complete when:

* Prisma is installed.
* Prisma is connected to PostgreSQL.
* Prisma Client is generated successfully.
* Prisma Studio connects successfully.
* Environment variables are configured.
* Documentation is updated.
* No business models have been introduced.

---

# Success Criteria

The project should now have a production-ready ORM layer capable of supporting future database models without requiring additional architectural changes.

This sprint is complete only when the database tooling is fully operational and verified for continued development.

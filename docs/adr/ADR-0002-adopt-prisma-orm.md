# ADR-0002 — Adopt Prisma as the Primary ORM

**Date:** 27 June 2026

**Status:** Accepted

**Sprint:** Sprint 1.2 — Prisma ORM Setup

**Authors:** Raghavendra Singh

---

# Context

The Billing & Inventory Management System requires a robust data access layer capable of supporting a growing number of business entities and transactional workflows.

The project is built using TypeScript and PostgreSQL. As development progresses, the application will include numerous database models, relationships, migrations, and complex business operations.

A suitable Object-Relational Mapping (ORM) solution was needed to simplify database interaction while maintaining strong type safety, migration support, and long-term maintainability.

---

# Decision

Prisma has been selected as the primary Object-Relational Mapping (ORM) tool for the project.

Prisma will be responsible for:

- Database schema management
- Migration generation
- Type-safe database queries
- Client generation
- Relationship mapping
- Database access throughout the application

A single shared `PrismaClient` instance is maintained in:

```text
backend/src/config/prisma.ts
```

Repositories are the only layer permitted to communicate directly with Prisma.

---

# Rationale

Prisma was selected because it offers:

- Excellent TypeScript integration
- Automatic type generation
- Declarative schema definition
- Reliable migration management
- Strong developer experience
- Clear relationship modeling
- Comprehensive PostgreSQL support
- Active ecosystem and documentation

These capabilities align well with the project's objectives of building a production-oriented application while maintaining readability and developer productivity.

---

# Alternatives Considered

## Option 1 — Raw SQL

### Advantages

- Maximum flexibility
- Full control over SQL queries
- No ORM abstraction

### Disadvantages

- Increased boilerplate
- Manual mapping of query results
- Greater risk of runtime errors
- Reduced maintainability
- Slower development

Decision: Rejected.

---

## Option 2 — TypeORM

### Advantages

- Mature ecosystem
- Entity-based modeling
- Supports decorators

### Disadvantages

- More complex configuration
- Less intuitive migration workflow
- Inconsistent TypeScript experience
- Larger learning curve

Decision: Rejected.

---

## Option 3 — Sequelize

### Advantages

- Mature ORM
- Large community
- Supports multiple databases

### Disadvantages

- Weaker TypeScript support
- Less ergonomic schema management
- More verbose model definitions

Decision: Rejected.

---

## Option 4 — Prisma

### Advantages

- Strong TypeScript support
- Generated type-safe client
- Excellent migration tooling
- Clear schema language
- High developer productivity
- Clean integration with PostgreSQL

### Disadvantages

- Additional client generation step
- Some advanced SQL features require raw queries

Decision: Accepted.

---

# Consequences

## Positive

- Strong compile-time type safety.
- Easier schema evolution.
- Reliable migration history.
- Consistent database access layer.
- Reduced likelihood of runtime query errors.
- Improved developer productivity.

## Negative

- Prisma Client must be regenerated after schema changes.
- Team members must understand the Prisma workflow.
- Certain advanced database features may still require raw SQL.

---

# Engineering Rules Established

The following rules are now mandatory:

- All database access must occur through Prisma.
- Only repositories may use Prisma Client directly.
- Controllers and services must never instantiate `PrismaClient`.
- A single shared Prisma Client instance must be used throughout the application.
- Database schema changes must be performed through Prisma migrations.
- Manual modification of migration history is prohibited.

---

# Future Impact

All future business modules—including Products, Inventory, Purchasing, Billing, Sales, Reporting, Customers, Suppliers, and Warehouses—will use Prisma as the sole database access layer.

Any future database technology change must be documented through a new ADR.

---

# References

- Sprint 1.2 — Prisma ORM Setup
- `backend/prisma/schema.prisma`
- `backend/src/config/prisma.ts`
- PostgreSQL Configuration Documentation
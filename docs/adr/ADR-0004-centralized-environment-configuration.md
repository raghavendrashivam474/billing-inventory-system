# ADR-0004 — Centralize Application Configuration Through Environment Variables

**Date:** 27 June 2026

**Status:** Accepted

**Sprint:** Sprint 1.3 — Environment Configuration

**Authors:** Raghavendra Singh

---

# Context

The Billing & Inventory Management System will be deployed across multiple environments, including local development, testing, staging, and production.

Each environment requires different runtime configuration such as:

- Database connection
- Server port
- API URLs
- Runtime environment
- Future third-party credentials

Embedding these values directly into the source code would make deployments difficult, reduce flexibility, and increase the risk of exposing sensitive information.

A consistent configuration strategy was therefore required before implementing business functionality.

---

# Decision

The project will use environment variables as the single source of runtime configuration.

A centralized configuration module is responsible for:

- Loading environment variables
- Validating required values
- Parsing configuration
- Exporting a typed configuration object

No application code should access `process.env` directly.

Instead, all modules must import configuration from:

```text
backend/src/config/environment.ts
```

Application flow:

```text
.env
    │
    ▼
dotenv
    │
    ▼
environment.ts
    │
    ▼
Application Modules
```

---

# Rationale

A centralized configuration system provides:

- Environment independence
- Improved security
- Strong typing
- Startup validation
- Easier maintenance
- Consistent configuration access
- Simplified deployment

The configuration module also prevents accidental runtime failures caused by missing or invalid environment variables.

---

# Alternatives Considered

## Option 1 — Hardcoded Configuration

Example:

```typescript
const PORT = 3000;
const DATABASE_URL = "...";
```

### Advantages

- Very simple

### Disadvantages

- Not environment independent
- Unsafe for production
- Difficult deployment
- Requires code changes between environments

Decision: Rejected.

---

## Option 2 — Direct `process.env` Usage

Example:

```typescript
process.env.PORT
process.env.DATABASE_URL
```

### Advantages

- Easy to implement
- No additional abstraction

### Disadvantages

- Configuration scattered throughout the project
- No validation
- Weak typing
- Difficult testing
- Repeated parsing logic

Decision: Rejected.

---

## Option 3 — Centralized Configuration Module

Example:

```typescript
import { config } from '../config/environment';
```

### Advantages

- Single source of truth
- Strong typing
- Validation at startup
- Cleaner code
- Easier maintenance
- Consistent access pattern

### Disadvantages

- Small amount of additional setup

Decision: Accepted.

---

# Consequences

## Positive

- Runtime configuration is centralized.
- Missing variables are detected during startup.
- Business logic remains independent of environment implementation.
- Easier deployment across multiple environments.
- Reduced risk of exposing secrets.

## Negative

- New configuration values must be added to the configuration module.
- Startup validation adds a small initialization step.

---

# Engineering Rules Established

The following rules are now mandatory:

- Never access `process.env` directly outside the configuration module.
- All runtime configuration must be exposed through `environment.ts`.
- Required environment variables must be validated during startup.
- `.env` files must never be committed to version control.
- `.env.example` must always be maintained.
- Sensitive credentials must never appear in documentation or source code.

---

# Future Impact

As the project grows, additional configuration such as:

- JWT secrets
- Email providers
- Payment gateways
- Cloud storage
- External APIs
- Cache configuration

will be added to the centralized configuration module without requiring changes to the rest of the application.

This decision provides a scalable foundation for future deployment environments.

---

# References

- Sprint 1.3 — Environment Configuration
- `backend/src/config/environment.ts`
- `backend/.env.example`
- `frontend/.env.example`
- Setup Documentation
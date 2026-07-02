# ADR-0003 — Adopt Versioned REST API Architecture

**Date:** 27 June 2026

**Status:** Accepted

**Sprint:** Sprint 1.5 — API Foundation

**Authors:** Raghavendra Singh

---

# Context

The Billing & Inventory Management System exposes REST APIs that will be consumed by multiple clients, including the React frontend and potentially future desktop, mobile, and third-party integrations.

As the application evolves, APIs will inevitably change. New features, response structures, validation rules, and business requirements may introduce breaking changes.

Without a versioning strategy, introducing such changes could break existing clients and make long-term maintenance difficult.

A consistent API versioning strategy was therefore required before exposing business endpoints.

---

# Decision

The project adopts URI-based API versioning.

All public API endpoints are grouped under a version prefix.

```text
/api/v1
```

Example:

```text
GET    /api/v1/health
GET    /api/v1/status

GET    /api/v1/categories
POST   /api/v1/categories

GET    /api/v1/products
POST   /api/v1/products
```

Each major API version will have its own router.

```text
src/routes/

index.ts
└── v1/
    └── index.ts
```

---

# Rationale

URI versioning was selected because it:

- Makes the active API version immediately visible.
- Simplifies routing.
- Allows multiple API versions to coexist.
- Prevents breaking existing clients.
- Aligns with common REST API practices.
- Is easy to document and test.

This approach provides flexibility for future evolution while maintaining backward compatibility.

---

# Alternatives Considered

## Option 1 — No Versioning

### Advantages

- Simple routing
- Fewer URLs

### Disadvantages

- Breaking changes affect all clients.
- Difficult migration path.
- No long-term compatibility.

Decision: Rejected.

---

## Option 2 — Header-Based Versioning

Example:

```http
Accept: application/vnd.billing.v1+json
```

### Advantages

- Clean URLs.
- API version hidden from URI.

### Disadvantages

- Harder to test manually.
- Less discoverable.
- Additional client configuration.

Decision: Rejected.

---

## Option 3 — Query Parameter Versioning

Example:

```text
/api/products?version=1
```

### Advantages

- Easy to implement.

### Disadvantages

- Less common.
- Poor URL semantics.
- Difficult routing.

Decision: Rejected.

---

## Option 4 — URI Versioning

Example:

```text
/api/v1/products
```

### Advantages

- Widely adopted.
- Easy to understand.
- Simple routing.
- Easy documentation.
- Supports parallel API versions.

### Disadvantages

- URLs change when new major versions are introduced.

Decision: Accepted.

---

# Consequences

## Positive

- Stable API contracts.
- Easier client upgrades.
- Multiple API versions can coexist.
- Simplified deprecation strategy.
- Clear routing structure.

## Negative

- Additional router organization.
- Duplicate endpoints may exist during migrations.

---

# Engineering Rules Established

The following rules are now mandatory:

- Every public endpoint must exist under `/api/v1`.
- New endpoints must be registered inside the version router.
- Breaking API changes require a new version.
- Minor enhancements should remain within the existing version.
- Clients must never bypass the versioned namespace.

---

# Future Impact

Future versions may be introduced as:

```text
/api/v1
/api/v2
/api/v3
```

Older versions may continue to operate while clients migrate.

This strategy allows the system to evolve without disrupting existing integrations.

---

# References

- Sprint 1.5 — API Foundation
- `backend/src/routes/index.ts`
- `backend/src/routes/v1/index.ts`
- API Documentation
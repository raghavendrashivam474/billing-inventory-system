# ADR-0006 — Adopt a Centralized Global Error Handling Strategy

**Date:** 27 June 2026

**Status:** Accepted

**Sprint:** Sprint 1.7 — Global Error Handling

**Authors:** Raghavendra Singh

---

# Context

As the Billing & Inventory Management System grows, application errors will originate from multiple layers, including controllers, services, repositories, middleware, and external integrations.

Without a centralized error handling strategy:

- Controllers become filled with repetitive `try...catch` blocks.
- Error responses become inconsistent.
- Internal implementation details may leak to clients.
- Logging becomes fragmented.
- Maintenance becomes increasingly difficult.

A unified approach was required to ensure all errors are handled consistently across the application.

---

# Decision

The project adopts a centralized global error handling strategy.

All application errors flow through a dedicated middleware pipeline before a response is returned to the client.

```
Application Code
        │
        ▼
Throw Error
        │
        ▼
asyncHandler
        │
        ▼
Error Middleware
        │
        ▼
Standard JSON Response
```

The following components form the error handling infrastructure:

- `AppError`
- `asyncHandler`
- `notFoundMiddleware`
- `errorMiddleware`

Unexpected errors are converted into standardized API responses.

---

# Error Flow

```
Client Request
      │
      ▼
Route
      │
      ▼
Controller
      │
      ▼
Service
      │
      ▼
Repository
      │
      ▼
Error Thrown
      │
      ▼
asyncHandler
      │
      ▼
errorMiddleware
      │
      ▼
JSON Response
```

Unknown routes follow:

```
Unknown Route
      │
      ▼
notFoundMiddleware
      │
      ▼
errorMiddleware
      │
      ▼
404 Response
```

---

# Rationale

A centralized strategy provides:

- Consistent API responses
- Reduced code duplication
- Cleaner controllers
- Easier debugging
- Centralized logging
- Separation between business logic and HTTP error formatting
- Better long-term maintainability

The `asyncHandler` utility also removes repetitive error forwarding from asynchronous controllers.

---

# Alternatives Considered

## Option 1 — try...catch in Every Controller

### Advantages

- Simple to understand
- No middleware required

### Disadvantages

- Repetitive code
- Difficult maintenance
- Inconsistent responses
- High risk of missing error handling

Decision: Rejected.

---

## Option 2 — Return Errors Manually

Example:

```typescript
return res.status(500).json(...);
```

### Advantages

- Straightforward implementation

### Disadvantages

- Business logic becomes coupled to HTTP.
- Error formatting duplicated.
- Controllers become unnecessarily large.

Decision: Rejected.

---

## Option 3 — Global Error Middleware

### Advantages

- Single error formatting location
- Consistent API responses
- Easier maintenance
- Cleaner controllers
- Better logging integration
- Easier testing

### Disadvantages

- Requires middleware configuration
- Developers must understand the request lifecycle

Decision: Accepted.

---

# Consequences

## Positive

- Consistent responses across the application.
- Controllers remain focused on request handling.
- Services remain focused on business logic.
- Errors are automatically logged.
- Easier debugging and maintenance.

## Negative

- Initial setup complexity is higher.
- Developers must throw appropriate error types.

---

# Engineering Rules Established

The following rules are now mandatory:

- Controllers must not contain repetitive `try...catch` blocks.
- Asynchronous controllers must use `asyncHandler`.
- Services throw errors instead of sending HTTP responses.
- Controllers never construct error responses manually.
- All unexpected errors flow through `errorMiddleware`.
- Unknown routes are handled exclusively by `notFoundMiddleware`.
- Error responses must follow the project's standard response format.

---

# Error Classification

Errors are categorized as:

## Operational Errors

Expected business or client errors.

Examples:

- Validation failure
- Resource not found
- Duplicate resource
- Unauthorized request
- Forbidden operation

These are represented using `AppError`.

---

## Unexpected Errors

Unexpected failures such as:

- Programming mistakes
- Database failures
- Third-party service failures
- Unhandled exceptions

These are converted into standardized `500 Internal Server Error` responses.

---

# Future Impact

This strategy establishes the foundation for:

- Validation error handling
- Authentication failures
- Authorization failures
- Database exception mapping
- External service error handling
- Business rule violations
- Audit logging
- Error monitoring platforms

Future modules automatically inherit the same error handling behavior without additional implementation.

---

# References

- Sprint 1.7 — Global Error Handling
- `backend/src/utils/app-error.ts`
- `backend/src/utils/async-handler.ts`
- `backend/src/middlewares/error.middleware.ts`
- `backend/src/middlewares/not-found.middleware.ts`
- Error Handling Documentation
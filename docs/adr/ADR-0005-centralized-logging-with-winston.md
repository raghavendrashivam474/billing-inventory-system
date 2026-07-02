# ADR-0005 — Adopt Centralized Logging with Winston

**Date:** 28 June 2026

**Status:** Accepted

**Sprint:** Sprint 1.8 — Logging Infrastructure

**Authors:** Raghavendra Singh

---

# Context

As the Billing & Inventory Management System grows, the application will execute numerous business operations including inventory updates, billing transactions, purchases, authentication, and reporting.

Using `console.log()` for application logging is sufficient during early development but is inadequate for a production-oriented system.

The project requires a centralized logging solution capable of:

- Recording application events
- Capturing errors
- Logging HTTP requests
- Supporting multiple log destinations
- Producing structured logs
- Assisting debugging and monitoring

A dedicated logging infrastructure was therefore required.

---

# Decision

The project adopts **Winston** as the centralized logging library.

A single shared logger instance is configured in:

```text
backend/src/logger/logger.ts
```

All application modules use this shared logger.

Application code must never use:

```typescript
console.log()
console.error()
console.warn()
```

Instead:

```typescript
logger.info(...)
logger.warn(...)
logger.error(...)
logger.debug(...)
logger.http(...)
```

---

# Logging Architecture

```text
Application
      │
      ▼
Shared Logger
(logger.ts)
      │
      ├────────► Console
      │
      ├────────► application.log
      │
      └────────► error.log
```

Morgan HTTP request logging is integrated into Winston so that all logs follow the same infrastructure.

---

# Rationale

A centralized logging solution provides:

- Consistent log formatting
- Multiple output destinations
- Log levels
- Structured JSON logs
- Easier debugging
- Better production monitoring
- Future compatibility with cloud logging platforms

Using a single logger also eliminates inconsistent logging practices across modules.

---

# Alternatives Considered

## Option 1 — console.log()

### Advantages

- Built into Node.js
- No dependencies
- Easy to use

### Disadvantages

- No log levels
- No structured output
- No file logging
- Difficult production debugging
- No centralized configuration

Decision: Rejected.

---

## Option 2 — Morgan Only

### Advantages

- Excellent HTTP request logging

### Disadvantages

- Logs requests only
- Cannot log business events
- Cannot log application lifecycle events
- No centralized application logging

Decision: Rejected.

---

## Option 3 — Winston

### Advantages

- Multiple transports
- Structured logging
- Log levels
- File logging
- Console logging
- Easily extensible
- Mature ecosystem

### Disadvantages

- Additional configuration
- Slight learning curve

Decision: Accepted.

---

# Consequences

## Positive

- Centralized logging across the application.
- Structured logs suitable for production.
- Consistent logging practices.
- Better debugging.
- Easier monitoring.
- Supports future observability platforms.

## Negative

- Slightly more setup than console logging.
- Developers must understand log levels.

---

# Engineering Rules Established

The following rules are now mandatory:

- Never use `console.log()` inside application code.
- All logging must use the shared Winston logger.
- Business modules must never configure their own loggers.
- Errors are logged only through the centralized logger.
- Sensitive information such as passwords, tokens, and credentials must never be written to logs.
- Choose the appropriate log level for each event.

---

# Log Levels

The project uses the following log levels:

| Level | Purpose |
|--------|---------|
| `error` | Unexpected failures requiring attention |
| `warn` | Recoverable or unusual situations |
| `info` | Important application events |
| `http` | Incoming HTTP requests |
| `debug` | Development diagnostics |

---

# Future Impact

The logging infrastructure provides the foundation for future capabilities such as:

- Log rotation
- Centralized log aggregation
- Cloud logging services
- Performance monitoring
- Audit logging
- Security event monitoring
- Request tracing

The logging interface will remain stable even if the underlying logging provider changes in the future.

---

# References

- Sprint 1.8 — Logging Infrastructure
- `backend/src/logger/logger.ts`
- `backend/src/middlewares/logger.middleware.ts`
- Logging Documentation
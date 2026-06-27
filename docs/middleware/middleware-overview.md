# Middleware Overview

## Project: Billing & Inventory Management System
## Sprint: 1.6 — Middleware Infrastructure

---

## Middleware Pipeline Order
Client Request
│
▼ 1. helmet() Security HTTP headers
▼ 2. corsMiddleware Cross-origin request handling
▼ 3. loggerMiddleware HTTP request logging
▼ 4. requestIdMiddleware Unique request identifier (UUID)
▼ 5. requestTimerMiddleware Request duration measurement
▼ 6. express.json() JSON body parsing
▼ 7. express.urlencoded() Form data parsing
▼ Application Routes
▼ notFoundMiddleware Catches unknown routes
▼ errorMiddleware Global error handler
▼ Response

text


---

## Middleware Responsibilities

| Middleware | Package | Purpose |
|---|---|---|
| Helmet | helmet | Sets secure HTTP headers |
| CORS | cors | Controls cross-origin access |
| Morgan | morgan | Logs HTTP requests |
| Request ID | Custom | UUID per request for tracing |
| Request Timer | Custom | Measures request duration |
| JSON Parser | express | Parses JSON request bodies |
| URL Parser | express | Parses form-encoded bodies |
| Not Found | Custom | Catches unknown routes |
| Error Handler | Custom | Global error formatting |

---

## Response Headers Added

| Header | Value | Purpose |
|---|---|---|
| X-Request-ID | UUID v4 | Unique request identifier |
| X-Response-Time | Duration in ms | Request processing time |

---

## CORS Configuration

| Setting | Value |
|---|---|
| Allowed Origins | http://localhost:5173, http://localhost:3000 |
| Allowed Methods | GET, POST, PUT, PATCH, DELETE, OPTIONS |
| Credentials | true |

---

## Security Headers Confirmed (Helmet)

| Header | Purpose |
|---|---|
| Content-Security-Policy | Prevents XSS |
| Strict-Transport-Security | Enforces HTTPS |
| X-Content-Type-Options | Prevents MIME sniffing |
| X-Frame-Options | Prevents clickjacking |
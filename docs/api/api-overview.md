# API Overview

## Project: Billing & Inventory Management System
## Version: v1

---

## Base URL
http://localhost:3000/api/v1

text


---

## Versioning Strategy

All endpoints are versioned under `/api/v1`.
Future versions will use `/api/v2`, `/api/v3`, etc.
Old versions remain supported during transition periods.

---

## Infrastructure Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1` | API metadata and info |
| GET | `/api/v1/status` | API operational status |
| GET | `/api/v1/health` | Application health check |

---

## Standard Response Format

### Success
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
Error
JSON

{
  "success": false,
  "message": "...",
  "errors": []
}
HTTP Status Code Guidelines
Code	Meaning	When to Use
200	OK	Successful GET, PUT
201	Created	Successful POST
204	No Content	Successful DELETE
400	Bad Request	Validation failure
401	Unauthorized	Missing auth
403	Forbidden	Insufficient permissions
404	Not Found	Resource missing
409	Conflict	Duplicate resource
422	Unprocessable Entity	Business rule violation
500	Internal Server Error	Unexpected server error
Endpoint Naming Conventions
Use lowercase and hyphens: /api/v1/product-categories
Use plural nouns for collections: /api/v1/products
Use IDs for specific resources: /api/v1/products/1
Use nested routes for relationships: /api/v1/orders/1/items

# Error Handling Overview

## Project: Billing & Inventory Management System
## Sprint: 1.7 — Global Error Handling

---

## Error Lifecycle
Controller or Service
│
▼
throw new AppError(message, statusCode)
│
▼
Global Error Middleware (error.middleware.ts)
│
▼
Standard JSON Response

text


---

## AppError Factory Methods

| Method | Status Code | Usage |
|---|---|---|
| `AppError.badRequest(msg)` | 400 | Invalid input |
| `AppError.unauthorized(msg)` | 401 | Missing authentication |
| `AppError.forbidden(msg)` | 403 | Insufficient permissions |
| `AppError.notFound(msg)` | 404 | Resource not found |
| `AppError.conflict(msg)` | 409 | Duplicate resource |
| `AppError.unprocessable(msg)` | 422 | Business rule violation |
| `AppError.internal(msg)` | 500 | Unexpected server error |

---

## Standard Error Response Format

```json
{
  "success": false,
  "statusCode": 404,
  "message": "The requested resource was not found.",
  "timestamp": "2026-06-27T12:00:00.000Z"
}
Development vs Production Behavior
Field	Development	Production
success	false	false
statusCode	included	included
message	included	included
timestamp	included	included
stack	included	excluded
Middleware Pipeline Position
text

Routes
  └── notFoundMiddleware    (after all routes)
        └── errorMiddleware (last in pipeline)
Usage in Controllers
TypeScript

import { asyncHandler } from '../../utils/async-handler';
import { AppError }     from '../../utils/app-error';

export const getItem = asyncHandler(async (req, res) => {
  const item = await service.findById(req.params.id);
  if (!item) throw AppError.notFound('Item not found.');
  res.json({ success: true, data: item });
});
Engineering Rules
Controllers must not contain repetitive try-catch blocks
Services throw errors instead of sending HTTP responses
Global error middleware owns all error response formatting
Stack traces are never exposed in production
Error messages must remain consistent across all modules
# Logging Overview

## Project: Billing & Inventory Management System
## Sprint: 1.8 — Logging Infrastructure

---

## Logger Architecture
Application Event
│
▼
logger.info() / logger.error() / logger.warn() / logger.debug()
│
▼
Winston Logger
│
├──▶ Console Transport (colorized — all environments)
├──▶ application.log (info and above)
└──▶ error.log (errors only)

text


---

## Log Levels

| Level | Priority | Usage |
|---|---|---|
| error | 0 | Exceptions, failures |
| warn | 1 | Unexpected but recoverable |
| info | 2 | General application events |
| http | 3 | HTTP request logs via Morgan |
| debug | 4 | Development debugging only |

---

## Environment Behavior

| Setting | Development | Production |
|---|---|---|
| Log Level | debug | info |
| Console Output | Colorized | Colorized |
| application.log | Written | Written |
| error.log | Written | Written |
| Stack Traces in logs | Included | Excluded |

---

## Log File Structure

| File | Contents | Level Filter |
|---|---|---|
| logs/application.log | All events — startup, requests, errors | info and above |
| logs/error.log | Errors only — exceptions, 404s, 500s | error only |

---

## Verified Log Output

### application.log (JSON structured)
```json
{"level":"info","message":"API started successfully","timestamp":"2026-06-28 02:41:04"}
{"level":"info","message":"Environment : development","timestamp":"2026-06-28 02:41:04"}
{"level":"error","message":"GET /api/v1/unknown","requestId":"8b98...","statusCode":404}
error.log (errors only)
JSON

{"level":"error","message":"GET /api/v1/unknown","requestId":"8b98...","statusCode":404,"stack":"AppError..."}
Usage in Application Code
TypeScript

import { logger } from '../logger';

logger.info('Record created successfully');
logger.warn('Deprecated endpoint called');
logger.error('Database query failed', { error, requestId });
logger.debug('Request payload', { body: req.body });
logger.http('Incoming request processed');
Engineering Rules
Never use console.log() in application code
Always import and use the shared logger instance
Log errors exactly once — in error middleware only
Never log passwords, tokens, or secrets
Use appropriate log levels — not everything is an error
Business modules must not configure or create loggers
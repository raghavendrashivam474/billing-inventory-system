# Health API Documentation

## Project: Billing & Inventory Management System
## Sprint: 1.9 — Production Health API

---

## Endpoint
GET /api/v1/health

text


---

## Purpose

Returns the current operational state of the application including
database connectivity, system uptime, memory usage, and runtime information.

Suitable for use by load balancers, monitoring systems, and administrators.

---

## Live Response (Verified)

```json
{
  "success": true,
  "status": "healthy",
  "application": {
    "name": "Billing & Inventory Management API",
    "version": "0.2.0",
    "apiVersion": "v1"
  },
  "database": "connected",
  "uptime": "0h 0m 17s",
  "runtime": {
    "environment": "development",
    "node": "v24.16.0",
    "platform": "win32",
    "pid": 22028
  },
  "memory": {
    "heapUsed": "102 MB",
    "heapTotal": "104 MB",
    "rss": "170 MB"
  },
  "timestamp": "2026-06-27T21:23:02.434Z"
}
Status Values
status	HTTP Code	Meaning
healthy	200	All systems operational
unhealthy	500	One or more systems down
Database Check
Prisma executes SELECT 1 against PostgreSQL.

Result	database field
Query succeeds	connected
Query fails	disconnected
Response Fields
Field	Source	Description
status	Health check result	healthy or unhealthy
application.name	APP_NAME constant	Application name
application.version	APP_VERSION constant	Current version
application.apiVersion	API_VERSION constant	API version
database	Prisma SELECT 1	Real connectivity check
uptime	process.uptime()	Formatted server uptime
runtime.node	process.version	Node.js version
runtime.platform	process.platform	Operating system
runtime.pid	process.pid	Process identifier
memory.heapUsed	process.memoryUsage()	Used heap memory
memory.heapTotal	process.memoryUsage()	Total heap memory
memory.rss	process.memoryUsage()	Resident set size
Monitoring Usage
Use this endpoint for:

Load balancer health checks
Deployment readiness verification
Uptime monitoring
Developer diagnostics
CI/CD pipeline verification
# Frontend Integration

## Project: Billing & Inventory Management System
## Sprint: 1.10 — Frontend Integration

---

## Architecture
React Component (HealthStatus.tsx)
│
▼
Health Service (health.service.ts)
│
▼
API Client (api.ts — Axios)
│
▼
Backend API (http://localhost:3000/api/v1)
│
▼
Health Module → Prisma → PostgreSQL

text


---

## Environment Configuration

| Variable | Value | Purpose |
|---|---|---|
| VITE_API_BASE_URL | http://localhost:3000/api/v1 | Backend API base URL |

---

## Folder Structure
frontend/src/
├── components/
│ └── HealthStatus.tsx Health dashboard component
├── services/
│ ├── api.ts Axios client instance
│ └── health.service.ts Health API communication
└── types/
└── health.ts TypeScript interfaces

text


---

## Service Layer

### api.ts
- Axios instance configured with VITE_API_BASE_URL
- 10 second timeout
- Request and response interceptors

### health.service.ts
- Calls GET /api/v1/health
- Returns typed HealthResponse

---

## Component States

| State | Display |
|---|---|
| Loading | Loading server status... |
| Error | Unable to connect to backend. + Retry button |
| Success | Full health dashboard with Refresh button |

---

## Live Verified Output

| Field | Value |
|---|---|
| Status | healthy |
| Database | connected |
| Environment | development |
| API Version | v1 |
| App Version | 0.2.0 |
| Node.js | v24.16.0 |
| Platform | win32 |
| Uptime | 0h 1m 6s |
| Heap Used | 102 MB |
| Heap Total | 104 MB |
| RSS | 172 MB |

---

## Running Both Applications

Terminal 1 - Backend:
```bash
cd backend
npm run dev
Terminal 2 - Frontend:

Bash

cd frontend
npm run dev
Open: http://localhost:5173

Engineering Rules
Components never call apiClient directly
Services own all HTTP communication
No hardcoded API URLs — always use VITE_API_BASE_URL
TypeScript interfaces used for all API responses
Loading and error states always handled
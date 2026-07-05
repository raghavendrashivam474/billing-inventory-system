# Tax Rate Management

## Sprint: 2.3 — Unit & Tax Rate CRUD

---

## Overview
Tax rates define the applicable tax percentages for products.

## Database Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| id | Int | Auto | Primary key |
| name | String (unique) | Yes | e.g. GST 18% |
| rate | Decimal(5,2) | Yes | 0.00 to 100.00 |
| description | String | No | Optional |
| isActive | Boolean | No | Default true |
| createdAt | DateTime | Auto | - |
| updatedAt | DateTime | Auto | - |

## Business Rules
- Name is required and unique
- Rate must be between 0 and 100
- Rate supports 2 decimal places
- Soft delete only

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/tax-rates | List with pagination |
| GET | /api/v1/tax-rates/:id | Get single tax rate |
| POST | /api/v1/tax-rates | Create tax rate |
| PATCH | /api/v1/tax-rates/:id | Update tax rate |
| DELETE | /api/v1/tax-rates/:id | Soft delete |
| PATCH | /api/v1/tax-rates/:id/restore | Restore |

## Example Request
```json
POST /api/v1/tax-rates
{ "name": "GST 18%", "rate": 18.00 }

{
  "success": true,
  "message": "Tax Rate created successfully.",
  "data": { "id": 1, "name": "GST 18%", "rate": "18.00", "isActive": true }
}
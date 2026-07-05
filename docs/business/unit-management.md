# Unit Management

## Sprint: 2.3 — Unit & Tax Rate CRUD

---

## Overview
Units define how products are measured and sold.

## Database Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| id | Int | Auto | Primary key |
| name | String (unique) | Yes | e.g. Kilogram |
| abbreviation | String (unique) | Yes | Uppercase, e.g. KG |
| isActive | Boolean | No | Default true |
| createdAt | DateTime | Auto | - |
| updatedAt | DateTime | Auto | - |

## Business Rules
- Name is required and unique
- Abbreviation is required, unique, and stored uppercase
- Soft delete only
- Both name and abbreviation checked for duplicates on create and update

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/units | List with pagination |
| GET | /api/v1/units/:id | Get single unit |
| POST | /api/v1/units | Create unit |
| PATCH | /api/v1/units/:id | Update unit |
| DELETE | /api/v1/units/:id | Soft delete |
| PATCH | /api/v1/units/:id/restore | Restore |

## Example Request
```json
POST /api/v1/units
{ "name": "Kilogram", "abbreviation": "kg" }
{
  "success": true,
  "message": "Unit created successfully.",
  "data": { "id": 1, "name": "Kilogram", "abbreviation": "KG", "isActive": true }
}
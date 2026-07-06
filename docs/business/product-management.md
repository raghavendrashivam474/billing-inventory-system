# Product Management

## Sprint: 2.4 — Product CRUD

---

## Overview
Products are the central business entity of the system.
Every future transactional module depends on Products.

## Database Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| id | Int | Auto | Primary key |
| name | String | Yes | Max 100 chars |
| sku | String (unique) | Yes | Auto uppercase |
| barcode | String (unique) | No | Optional |
| description | String | No | Max 1000 chars |
| costPrice | Decimal(10,2) | Yes | >= 0 |
| sellingPrice | Decimal(10,2) | Yes | > 0, >= costPrice |
| isActive | Boolean | No | Default true |
| categoryId | Int (FK) | Yes | Must exist and be active |
| brandId | Int (FK) | No | If supplied, must exist |
| unitId | Int (FK) | Yes | Must exist and be active |
| taxRateId | Int (FK) | No | If supplied, must exist |
| createdAt | DateTime | Auto | - |
| updatedAt | DateTime | Auto | - |

## Relationships

| Relation | Type | Required |
|---|---|---|
| Category | Many-to-One | Yes |
| Brand | Many-to-One | No |
| Unit | Many-to-One | Yes |
| Tax Rate | Many-to-One | No |

## Business Rules
- SKU is required, unique, auto-uppercase
- sellingPrice must be >= costPrice (422 if violated)
- All supplied foreign keys are validated for existence and active status
- Soft delete only — no hard deletes

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/products | List with pagination, search, filter |
| GET | /api/v1/products/:id | Get single product with relations |
| POST | /api/v1/products | Create product |
| PATCH | /api/v1/products/:id | Update product |
| DELETE | /api/v1/products/:id | Soft delete |
| PATCH | /api/v1/products/:id/restore | Restore |

## Query Parameters

| Param | Type | Description |
|---|---|---|
| page | number | Page number |
| limit | number | Records per page |
| search | string | Search name, sku, barcode |
| sort | string | Field to sort by |
| order | asc/desc | Sort direction |
| active | true/false | Filter by active state |
| categoryId | number | Filter by category |
| brandId | number | Filter by brand |
| unitId | number | Filter by unit |
| taxRateId | number | Filter by tax rate |

## Example Response
```json
{
  "success": true,
  "message": "Product created successfully.",
  "data": {
    "id": 1,
    "name": "Dell Inspiron 15",
    "sku": "LAP001",
    "category": { "id": 1, "name": "Electronics" },
    "brand": null,
    "unit": { "id": 2, "name": "Piece", "abbreviation": "PCS" },
    "taxRate": null
  }
}
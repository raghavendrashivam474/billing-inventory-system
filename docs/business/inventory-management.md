# Inventory Management

## Sprint: 3.2 — Goods Receipt, Inventory & Stock Movement

---

## Overview
Inventory represents current product stock quantities per warehouse.
It is system-managed — never directly mutated via public API.

## Model
- One Inventory record per Product per Warehouse (unique constraint)
- quantity field is the authoritative current stock balance

## Why Not Store Stock on Product
Products exist independently of warehouses.
The same product can have different quantities in different warehouses.
Product.costPrice is a master data field — not a stock field.

## Inventory Update Flow
Goods Receipt → GoodsReceiptService → prisma.$transaction →
inventory.upsert (create or increment)

## API Endpoints (Read-Only)

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/inventory | List all balances |
| GET | /api/v1/inventory/:id | Get single balance |
| GET | /api/v1/inventory/product/:productId | Stock across all warehouses |

## No Write Endpoints
POST, PATCH, DELETE are not exposed.
Inventory changes only through controlled business operations.
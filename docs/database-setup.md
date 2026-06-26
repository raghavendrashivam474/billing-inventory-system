# Database Setup Guide

## Sprint 1.1 — PostgreSQL Configuration

### Prerequisites
- PostgreSQL 17.x installed and running

### Development Database

| Parameter | Value |
|---|---|
| Host | localhost |
| Port | 5432 |
| Database | billing_inventory_db |
| Username | billing_dev |
| PostgreSQL Version | 17.10 |

### Setup Instructions

Run the following commands in psql as superuser:

```sql
-- Connect as postgres superuser
psql -U postgres

-- Create database
CREATE DATABASE billing_inventory_db;

-- Create development user
CREATE USER billing_dev WITH PASSWORD 'your_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE billing_inventory_db TO billing_dev;

-- Connect to database and grant schema access
\c billing_inventory_db
GRANT ALL ON SCHEMA public TO billing_dev;

-- Verify
\l
\du
\q
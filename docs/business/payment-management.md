# Payment Management

## Sprint: 3.7 — Payment Management

---

## Overview
Payments record customer settlements against invoices.
This completes the order-to-cash financial workflow.

## Position in Business Flow
Sales Order → Dispatch → Invoice → Payment


Payments do NOT affect inventory. They only affect financial state.

## Business Rules
- Only ISSUED or PARTIALLY_PAID invoices can receive payments
- Cannot pay DRAFT, PAID, or VOID invoices
- Amount must be greater than zero
- Over-payment is prevented
- Partial payments supported
- Multiple payments per invoice supported
- Payments are immutable (no update, no delete)

## Payment Methods
- CASH
- BANK_TRANSFER
- UPI
- CARD
- CHEQUE
- OTHER

## Payment Number Format
PAY-YYYY-NNNNNN
Example: PAY-2026-000001

## Invoice Status Progression
ISSUED → PARTIALLY_PAID → PAID


## Outstanding Calculation
outstanding = invoice.totalAmount - SUM(all payments)

if outstanding == 0 → PAID
if outstanding > 0 → PARTIALLY_PAID


## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/payments | List with filters |
| GET | /api/v1/payments/:id | Get single payment |
| POST | /api/v1/payments | Record payment |

## Verified Payment Flow (Sprint 3.7)

Invoice INV-2026-000001 total: 177,000

| Payment | Amount | Running Total | Status |
|---|---|---|---|
| PAY-000001 (UPI) | 50,000 | 50,000 | PARTIALLY_PAID |
| PAY-000002 (BANK) | 77,000 | 127,000 | PARTIALLY_PAID |
| PAY-000003 (CASH) | 50,000 | 177,000 | PAID |
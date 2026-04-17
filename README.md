# RevoBank API

## Overview

RevoBank is a RESTful banking API built with NestJS and Prisma. It supports user authentication, account management, and financial transactions including deposits, withdrawals, transfers, and purchases. The system enforces ownership checks, role-based access control, and atomic transaction processing to ensure data integrity.

**Live API**: [https://milestone-4-mrafiasyifaa-production.up.railway.app](https://milestone-4-mrafiasyifaa-production.up.railway.app)

**API Documentation (Swagger)**: [https://milestone-4-mrafiasyifaa-production.up.railway.app/docs-v1](https://milestone-4-mrafiasyifaa-production.up.railway.app/docs-v1)

---

## Features

### Authentication

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and receive a JWT access token

### Users

- `GET /users/profile` — Get current user profile
- `PATCH /users/profile` — Update current user name

### Accounts

- `POST /accounts` — Create a new bank account (SAVINGS, CHECKING, BUSINESS, INVESTMENT, LOAN)
- `GET /accounts` — List all accounts owned by the current user
- `GET /accounts/:id` — Get a specific account
- `PATCH /accounts/:id` — Update account name
- `DELETE /accounts/:id` — Delete an account

### Transactions

- `POST /transactions/deposit` — Deposit funds into an account
- `POST /transactions/withdrawal` — Withdraw funds from an account
- `POST /transactions/transfer` — Transfer funds between accounts
- `POST /transactions/purchase` — Record a purchase from an account
- `POST /transactions` — Generic transaction endpoint (requires `type` field)
- `GET /transactions?accountId=` — List transactions for an account
- `GET /transactions/:id` — Get a specific transaction

### Admin (ADMIN role required)

- `GET /admins/users` — List all users with their accounts
- `GET /admins/users/:id` — Get a specific user
- `GET /admins/transactions` — List all transactions
- `GET /admins/transactions/:id` — Get a specific transaction

### Security

- JWT authentication on all protected endpoints
- Ownership enforcement — users can only access their own accounts and transactions
- Role-Based Access Control (RBAC) — admin endpoints restricted to ADMIN role
- Atomic transactions using Prisma `$transaction` to prevent partial updates

---

## Technologies Used

| Category         | Technology                         |
| ---------------- | ---------------------------------- |
| Framework        | NestJS 11                          |
| Language         | TypeScript                         |
| ORM              | Prisma 7                           |
| Database         | PostgreSQL (Supabase)              |
| Authentication   | JWT (@nestjs/jwt), bcrypt          |
| Validation       | class-validator, class-transformer |
| Documentation    | Swagger (@nestjs/swagger)          |
| Deployment       | Railway                            |
| Database Hosting | Supabase                           |

---

## How to Run Locally

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/Revou-FSSE-Oct25/milestone-4-mrafiasyifaa.git
   cd milestone-4-mrafiasyifaa/revobank
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables — create a `.env` file in the `revobank` folder:

   ```
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   JWT_SECRET="your-secret-key"
   PORT=3000
   ```

4. Run database migration

   ```bash
   npx prisma db push
   ```

5. Start the development server

   ```bash
   npm run start:dev
   ```

6. API is available at `http://localhost:3000`
   Swagger docs at `http://localhost:3000/docs-v1`

---

## Environment Variables

| Variable       | Description                               |
| -------------- | ----------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string              |
| `JWT_SECRET`   | Secret key for signing JWT tokens         |
| `PORT`         | Port to run the server on (default: 3000) |

---

## Notes

- ADMIN role must be set manually in the database. Default role for all registered users is `CUSTOMER`.
- All financial amounts are stored as `Decimal(19, 4)` for precision.
- Account numbers are randomly generated 8-digit numbers with collision checking.

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/PzCCy7VV)

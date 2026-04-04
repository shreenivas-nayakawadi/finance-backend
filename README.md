# Finance Data Processing & Access Control Backend

A production-grade RESTful API backend for a finance dashboard system, featuring role-based access control, financial record management, and aggregated analytics endpoints.

Built as part of the **Zorvyn FinTech Backend Developer Internship** assessment.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js (v18+) |
| **Framework** | Express 5 |
| **Language** | TypeScript 6 (strict mode) |
| **ORM** | Prisma 6 |
| **Database** | PostgreSQL (Neon Serverless) |
| **Authentication** | JWT (jsonwebtoken + bcryptjs) |
| **Validation** | express-validator |
| **Rate Limiting** | express-rate-limit |

---

## Project Architecture

```
finance-backend/
├── prisma/
│   ├── schema.prisma          # Data models & enums
│   ├── seed.ts                # Database seed script
│   └── migrations/            # Migration history
├── src/
│   ├── server.ts              # Entry point — boots server & DB
│   ├── app.ts                 # Express app setup, middleware, routes
│   ├── config/
│   │   ├── env.ts             # Environment variable configuration
│   │   └── prisma.ts          # Prisma client singleton
│   ├── middlewares/
│   │   ├── authenticate.ts    # JWT token verification
│   │   ├── authorize.ts       # Role-based access guard
│   │   ├── validate.ts        # Request validation handler
│   │   ├── errorHandler.ts    # Global error handler
│   │   ├── notFound.ts        # 404 fallback handler
│   │   └── rateLimiter.ts     # Rate limiting (global + auth)
│   ├── modules/
│   │   ├── auth/              # Authentication (register/login/me)
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.validators.ts
│   │   ├── users/             # User management (ADMIN only)
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.routes.ts
│   │   │   └── user.validators.ts
│   │   ├── records/           # Financial records CRUD
│   │   │   ├── record.controller.ts
│   │   │   ├── record.service.ts
│   │   │   ├── record.routes.ts
│   │   │   └── record.validators.ts
│   │   └── dashboard/         # Analytics & summaries
│   │       ├── dashboard.controller.ts
│   │       ├── dashboard.service.ts
│   │       ├── dashboard.routes.ts
│   │       └── dashboard.validators.ts
│   └── utils/
│       ├── AppError.ts        # Custom error class
│       └── response.ts        # Standardized response helper
├── .env.example               # Environment template
├── package.json
└── tsconfig.json
```

### Design Principles

- **Modular architecture**: Each feature (auth, users, records, dashboard) is a self-contained module with its own controller → service → routes → validators.
- **Separation of concerns**: Controllers handle HTTP req/res, services contain business logic, validators enforce input rules.
- **Middleware pipeline**: `authenticate → authorize → validate → controller` ensures every request is verified before reaching business logic.
- **Consistent API responses**: Every endpoint returns `{ success, message, data }` via a centralized response helper.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- PostgreSQL database (or [Neon](https://neon.tech) free tier)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/shreenivas-nayakawadi/finance-backend.git
cd finance-backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your database URL and JWT secret

# 4. Run database migrations
npx prisma migrate deploy

# 5. Generate Prisma client
npx prisma generate

# 6. Seed the database with demo data
npm run seed

# 7. Start the development server
npm run dev
```

The server will start at `http://localhost:5000`.

### Verify Installation

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Finance Backend API is running",
  "timestamp": "2026-04-04T06:00:00.000Z"
}
```

---

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | — | ✅ |
| `PORT` | Server port | `5000` | ❌ |
| `JWT_SECRET` | Secret key for signing JWT tokens | — | ✅ |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` | ❌ |
| `NODE_ENV` | Environment mode | `development` | ❌ |

---

## Database Schema

### Entity Relationship

```
┌──────────────────────┐          ┌──────────────────────────┐
│        User          │          │         Record           │
├──────────────────────┤          ├──────────────────────────┤
│ id         (UUID PK) │──── 1:N ─│ id          (UUID PK)   │
│ name       (String)  │          │ amount      (Decimal)    │
│ email      (Unique)  │          │ type        (ENUM)       │
│ passwordHash(String) │          │ category    (String)     │
│ role       (ENUM)    │          │ date        (DateTime)   │
│ status     (ENUM)    │          │ description (String?)    │
│ createdAt  (DateTime)│          │ isDeleted   (Boolean)    │
│ updatedAt  (DateTime)│          │ userId      (FK → User)  │
└──────────────────────┘          │ createdAt   (DateTime)   │
                                  │ updatedAt   (DateTime)   │
                                  └──────────────────────────┘
```

### Enums

| Enum | Values | Description |
|------|--------|-------------|
| `Role` | `VIEWER`, `ANALYST`, `ADMIN` | User access level |
| `UserStatus` | `ACTIVE`, `INACTIVE` | Account status |
| `RecordType` | `INCOME`, `EXPENSE` | Financial record type |

---

## Access Control Matrix

Role-based permissions enforced at the middleware level via `authorize()`:

| Resource / Action | VIEWER | ANALYST | ADMIN |
|-------------------|--------|---------|-------|
| Register / Login | ✅ | ✅ | ✅ |
| View own profile (`/auth/me`) | ✅ | ✅ | ✅ |
| **User Management** | | | |
| List all users | ❌ | ❌ | ✅ |
| Get user by ID | ❌ | ❌ | ✅ |
| Update user role | ❌ | ❌ | ✅ |
| Update user status | ❌ | ❌ | ✅ |
| Delete user | ❌ | ❌ | ✅ |
| **Financial Records** | | | |
| List / view records | ❌ | ✅ | ✅ |
| Create records | ❌ | ❌ | ✅ |
| Update records | ❌ | ❌ | ✅ |
| Delete records (soft) | ❌ | ❌ | ✅ |
| **Dashboard** | | | |
| Summary (totals) | ✅ | ✅ | ✅ |
| Recent activity | ✅ | ✅ | ✅ |
| Category breakdown | ❌ | ✅ | ✅ |
| Monthly trends | ❌ | ✅ | ✅ |

---

## Demo Credentials

After running `npm run seed`, these accounts are available:

| Role | Email | Password |
|------|-------|----------|
| **ADMIN** | `admin@finance.com` | `123456` |
| **ANALYST** | `analyst@finance.com` | `123456` |
| **VIEWER** | `viewer@finance.com` | `123456` |

The seed also creates **20 financial records** across 8 categories spanning 3 months (Jan–Mar 2026).

---

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Response Format

All endpoints return a consistent JSON structure:

```json
{
  "success": true,
  "message": "Descriptive message",
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Validation errors (422):

```json
{
  "success": false,
  "errors": [
    { "type": "field", "msg": "Valid email required", "path": "email", "location": "body" }
  ]
}
```

### Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

---

### 1. Health Check

#### `GET /api/health`

Verify that the API is running. **No authentication required.**

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Finance Backend API is running",
  "timestamp": "2026-04-04T06:00:00.000Z"
}
```

---

### 2. Authentication

#### `POST /api/auth/register`

Create a new user account. **Rate limited** (20 req / 15 min).

**Request Body**
```json
{
  "name": "Shreenivas",
  "email": "shree@example.com",
  "password": "securepass123",
  "role": "VIEWER"          // optional, defaults to VIEWER
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | ✅ | Non-empty, trimmed |
| `email` | string | ✅ | Valid email format |
| `password` | string | ✅ | Minimum 6 characters |
| `role` | string | ❌ | One of: `VIEWER`, `ANALYST`, `ADMIN` |

**Response** `201 Created`
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "c7677bc3-3e96-4694-b483-f680a955cb52",
      "name": "Shreenivas",
      "email": "shree@example.com",
      "role": "VIEWER",
      "status": "ACTIVE"
    }
  }
}
```

**Errors**
| Status | Message |
|--------|---------|
| 409 | Email already in use |
| 422 | Validation errors |

---

#### `POST /api/auth/login`

Authenticate and receive a JWT token. **Rate limited** (20 req / 15 min).

**Request Body**
```json
{
  "email": "admin@finance.com",
  "password": "123456"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "ab7a3fe9-d336-47fd-992f-428b0a69f76d",
      "name": "Shreenivas Admin",
      "email": "admin@finance.com",
      "role": "ADMIN"
    }
  }
}
```

**Errors**
| Status | Message |
|--------|---------|
| 401 | Invalid credentials |
| 422 | Validation errors |

---

#### `GET /api/auth/me`

Get the currently authenticated user's profile. **Requires authentication.**

**Headers**: `Authorization: Bearer <token>`

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "user": {
      "id": "ab7a3fe9-d336-47fd-992f-428b0a69f76d",
      "name": "Shreenivas Admin",
      "email": "admin@finance.com",
      "role": "ADMIN",
      "status": "ACTIVE",
      "createdAt": "2026-04-01T13:17:48.000Z"
    }
  }
}
```

---

### 3. User Management

> **All endpoints require ADMIN role.**

#### `GET /api/users`

List all users. Supports regex-based search.

**Query Parameters**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `search` | string | ❌ | Regex pattern to search name, email, role, or status |

**Example**: `GET /api/users?search=analyst`

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "users": [
      {
        "id": "ab7a3fe9-d336-47fd-992f-428b0a69f76d",
        "name": "Shreenivas Admin",
        "email": "admin@finance.com",
        "role": "ADMIN",
        "status": "ACTIVE",
        "createdAt": "2026-04-01T13:17:48.000Z"
      }
    ]
  }
}
```

---

#### `GET /api/users/:id`

Get a single user by ID.

**Response** `200 OK`
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "user": {
      "id": "c7677bc3-3e96-4694-b483-f680a955cb52",
      "name": "Rahul Viewer",
      "email": "viewer@finance.com",
      "role": "VIEWER",
      "status": "ACTIVE",
      "createdAt": "2026-04-01T13:17:48.000Z"
    }
  }
}
```

**Errors**: `404` User not found | `422` Invalid UUID

---

#### `PATCH /api/users/:id/role`

Update a user's role.

**Request Body**
```json
{
  "role": "ANALYST"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "user": {
      "id": "c7677bc3-...",
      "name": "Rahul Viewer",
      "email": "viewer@finance.com",
      "role": "ANALYST",
      "status": "ACTIVE"
    }
  }
}
```

---

#### `PATCH /api/users/:id/status`

Activate or deactivate a user.

**Request Body**
```json
{
  "status": "INACTIVE"
}
```

**Response** `200 OK` — same format as role update.

> **Note**: Inactive users cannot log in.

---

#### `DELETE /api/users/:id`

Permanently delete a user account.

**Response** `200 OK`
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null
}
```

---

### 4. Financial Records

#### `POST /api/records`

Create a new financial record. **Requires ADMIN role.**

**Request Body**
```json
{
  "amount": 75000.50,
  "type": "INCOME",
  "category": "Salary",
  "date": "2026-04-01",
  "description": "April salary credited"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `amount` | number | ✅ | Must be > 0 |
| `type` | string | ✅ | `INCOME` or `EXPENSE` |
| `category` | string | ✅ | Non-empty |
| `date` | string | ✅ | ISO 8601 date |
| `description` | string | ❌ | Free text |

**Response** `201 Created`
```json
{
  "success": true,
  "message": "Record created successfully",
  "data": {
    "record": {
      "id": "d732aeff-f84d-4056-ace3-1dea8f2ae222",
      "amount": "75000.50",
      "type": "INCOME",
      "category": "Salary",
      "date": "2026-04-01T00:00:00.000Z",
      "description": "April salary credited",
      "isDeleted": false,
      "userId": "ab7a3fe9-...",
      "createdAt": "2026-04-04T06:00:00.000Z",
      "updatedAt": "2026-04-04T06:00:00.000Z"
    }
  }
}
```

---

#### `GET /api/records`

List financial records with filtering, search, and pagination. **Requires ANALYST or ADMIN role.**

**Query Parameters**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ❌ | Filter by `INCOME` or `EXPENSE` |
| `category` | string | ❌ | Filter by category (case-insensitive partial match) |
| `from` | string | ❌ | Start date (ISO 8601) |
| `to` | string | ❌ | End date (ISO 8601) |
| `search` | string | ❌ | Regex search across category, type, description, creator name |
| `page` | number | ❌ | Page number (default: 1) |
| `limit` | number | ❌ | Items per page (default: 20, max: 100) |

**Example**: `GET /api/records?type=EXPENSE&category=Groceries&from=2026-01-01&to=2026-03-31&page=1&limit=10`

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Records fetched successfully",
  "data": {
    "records": [
      {
        "id": "d732aeff-...",
        "amount": "4500",
        "type": "EXPENSE",
        "category": "Groceries",
        "date": "2026-01-08T00:00:00.000Z",
        "description": "Monthly grocery shopping",
        "isDeleted": false,
        "userId": "ab7a3fe9-...",
        "createdAt": "2026-04-04T06:00:00.000Z",
        "updatedAt": "2026-04-04T06:00:00.000Z",
        "createdBy": {
          "id": "ab7a3fe9-...",
          "name": "Shreenivas Admin"
        }
      }
    ],
    "total": 3,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

#### `GET /api/records/:id`

Get a single record by ID. **Requires ANALYST or ADMIN role.**

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Record fetched successfully",
  "data": {
    "record": { ... }
  }
}
```

---

#### `PATCH /api/records/:id`

Update a financial record. **Requires ADMIN role.** At least one field must be provided.

**Request Body** (all fields optional)
```json
{
  "amount": 5000,
  "description": "Updated grocery total"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Record updated successfully",
  "data": {
    "record": { ... }
  }
}
```

**Errors**: `404` Record not found | `422` No fields provided

---

#### `DELETE /api/records/:id`

Soft-delete a financial record (sets `isDeleted = true`). **Requires ADMIN role.**

> Records are not permanently removed — they are flagged as deleted and excluded from all queries.

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Record deleted successfully",
  "data": null
}
```

---

### 5. Dashboard & Analytics

#### `GET /api/dashboard/summary`

Get total income, total expenses, and net balance. **Requires any authenticated role.**

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Dashboard summary fetched successfully",
  "data": {
    "totalIncome": 268000,
    "totalExpense": 90500,
    "netBalance": 177500
  }
}
```

---

#### `GET /api/dashboard/categories`

Get spending/income breakdown by category. **Requires ANALYST or ADMIN role.**

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Category breakdown fetched successfully",
  "data": {
    "categories": [
      { "category": "Salary", "type": "INCOME", "total": 225000 },
      { "category": "Rent", "type": "EXPENSE", "total": 54000 },
      { "category": "Freelance", "type": "INCOME", "total": 23000 },
      { "category": "Groceries", "type": "EXPENSE", "total": 13500 },
      { "category": "Investment", "type": "INCOME", "total": 17000 },
      { "category": "Utilities", "type": "EXPENSE", "total": 7500 },
      { "category": "Transportation", "type": "EXPENSE", "total": 6000 },
      { "category": "Entertainment", "type": "EXPENSE", "total": 1500 },
      { "category": "Healthcare", "type": "EXPENSE", "total": 8500 },
      { "category": "Refund", "type": "INCOME", "total": 3000 }
    ]
  }
}
```

---

#### `GET /api/dashboard/trends`

Get monthly income/expense trends (last 24 months). **Requires ANALYST or ADMIN role.**

Uses raw SQL with `DATE_TRUNC` for efficient server-side aggregation.

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Monthly trends fetched successfully",
  "data": {
    "trends": [
      { "month": "2026-03-01T00:00:00.000Z", "type": "INCOME", "total": 87000 },
      { "month": "2026-03-01T00:00:00.000Z", "type": "EXPENSE", "total": 33900 },
      { "month": "2026-02-01T00:00:00.000Z", "type": "INCOME", "total": 83000 },
      { "month": "2026-02-01T00:00:00.000Z", "type": "EXPENSE", "total": 26100 },
      { "month": "2026-01-01T00:00:00.000Z", "type": "INCOME", "total": 95000 },
      { "month": "2026-01-01T00:00:00.000Z", "type": "EXPENSE", "total": 31000 }
    ]
  }
}
```

---

#### `GET /api/dashboard/recent`

Get recent financial activity. **Requires any authenticated role.**

**Query Parameters**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `limit` | number | ❌ | Number of records (default: 10, max: 100) |

**Example**: `GET /api/dashboard/recent?limit=5`

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Recent activity fetched successfully",
  "data": {
    "records": [
      {
        "id": "d732aeff-...",
        "amount": "8500",
        "type": "EXPENSE",
        "category": "Healthcare",
        "date": "2026-03-22T00:00:00.000Z",
        "description": "Annual health checkup",
        "createdBy": {
          "id": "ab7a3fe9-...",
          "name": "Shreenivas Admin",
          "email": "admin@finance.com"
        }
      }
    ]
  }
}
```

---

## Error Handling

The API implements a layered error handling strategy:

| Layer | Mechanism | Description |
|-------|-----------|-------------|
| **Validation** | `express-validator` + `validate` middleware | Returns 422 with field-level errors |
| **Business Logic** | `AppError` custom class | Thrown in services with specific HTTP status codes |
| **Authentication** | `authenticate` middleware | Returns 401 for missing/invalid tokens |
| **Authorization** | `authorize` middleware | Returns 403 for insufficient permissions |
| **Not Found** | `notFound` middleware | Returns 404 for undefined routes |
| **Global** | `errorHandler` middleware | Catches unhandled errors, returns 500 |

### HTTP Status Codes Used

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful read/update/delete |
| 201 | Created | Successful resource creation |
| 400 | Bad Request | Invalid input or regex pattern |
| 401 | Unauthorized | Missing/invalid token or credentials |
| 403 | Forbidden | Insufficient role permissions |
| 404 | Not Found | Resource or route not found |
| 409 | Conflict | Duplicate resource (e.g., email) |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unhandled server errors |

---

## Rate Limiting

| Scope | Window | Max Requests |
|-------|--------|-------------|
| **Global** | 1 minute | 100 |
| **Auth endpoints** (`/api/auth/register`, `/api/auth/login`) | 15 minutes | 20 |

Exceeding the limit returns:
```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

---

## Key Design Decisions & Trade-offs

### 1. Express 5 over Express 4
Adopted Express 5 for its built-in async error handling support and modern API improvements, despite it being newer — demonstrates willingness to use current technology.

### 2. Prisma ORM over Raw SQL
Chose Prisma for type-safe database access, auto-generated TypeScript types, and seamless migration management. Used raw SQL (`$queryRaw`) only where Prisma's query builder is insufficient (e.g., `DATE_TRUNC` for monthly trends).

### 3. Neon Serverless PostgreSQL
Selected Neon for its free tier with generous limits, instant provisioning, and production-grade PostgreSQL compatibility. Eliminates the need for local database setup during evaluation.

### 4. Soft Delete over Hard Delete (Records)
Financial records use soft delete (`isDeleted` flag) to maintain audit trails — critical in finance applications where data integrity and traceability are paramount. All queries automatically exclude soft-deleted records.

### 5. Modular File Structure
Each feature module (auth, users, records, dashboard) is self-contained with `controller → service → routes → validators`. This makes the codebase navigable, testable, and maintainable as it scales.

### 6. JWT over Session-based Auth
JWT is stateless, horizontally scalable, and well-suited for API-first backends. Token payload contains `userId` and `role` to avoid a database lookup on every request.

### 7. Regex-based Search
Both user and record search support regex patterns (e.g., `salary|rent`, `^admin`), providing flexible matching power without a full-text search engine. The regex is validated server-side to prevent `ReDoS` attacks.

### 8. Separate Role & Status Update Endpoints
Instead of a single `PUT /users/:id` catching all updates, role and status changes are separate `PATCH` endpoints (`/role`, `/status`). This makes the API more explicit and access control more granular.

---

## Assumptions Made

1. **Single-tenant system**: All users share the same pool of financial records. In production, records would be scoped to organizations/teams.
2. **Open registration**: Any user can register with any role (for demo purposes). In production, role assignment would be restricted to admins.
3. **No email verification**: Registration does not verify email ownership for simplicity.
4. **UTC timestamps**: All dates are stored and returned in UTC. Timezone conversion is the frontend's responsibility.
5. **Decimal(12,2) for amounts**: Supports amounts up to 9,999,999,999.99 — sufficient for a dashboard demo.
6. **Category as free text**: Categories are user-defined strings rather than a fixed enum, allowing flexibility for different use cases.

---

## Features Implemented

- [x] User registration & login with JWT authentication
- [x] Role-based access control (VIEWER / ANALYST / ADMIN)
- [x] User management — list, get, update role, update status, delete (ADMIN only)
- [x] Financial records — full CRUD with soft delete
- [x] Record filtering — by type, category, date range
- [x] Record search — regex-based across multiple fields
- [x] Pagination — page/limit with total count and total pages
- [x] Dashboard summary — total income, expenses, net balance
- [x] Category-wise breakdown — aggregated by category and type
- [x] Monthly trends — server-side date aggregation using raw SQL
- [x] Recent activity — configurable limit
- [x] Input validation — on all endpoints with descriptive error messages
- [x] Global error handling — with proper HTTP status codes
- [x] Rate limiting — global + auth-specific
- [x] Soft delete — for financial records (audit trail)
- [x] Database seeding — demo users and 20 realistic records
- [x] Health check endpoint
- [x] Postman collection included

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run compiled production build |
| `npm run seed` | Seed database with demo data |
| `npm run format` | Format code with Prettier |

---

## Postman Collection

A Postman collection (`Finanace Backend API.postman_collection.json`) is included in the repository root with pre-configured requests for all endpoints.

**Setup**:
1. Import the collection into Postman
2. Create an environment with variable `baseUrl` set to `http://localhost:5000`
3. Login with an admin account and set the `adminToken` variable

---

## Author

**Shreenivas Nayakawadi**  
📧 shreenivasnayakawadi5@gmail.com  
🔗 [GitHub](https://github.com/shreenivas-nayakawadi)

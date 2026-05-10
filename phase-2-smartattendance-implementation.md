# SmartAttendance AI — Phase 2 Implementation Plan

## Project
**SmartAttendance AI**  
Phase 2 — Authentication, RBAC & Core Backend Foundation

---

# 1. Phase 2 Objective

Phase 2 focuses ONLY on:

- backend foundation implementation
- authentication system
- JWT architecture
- RBAC implementation
- Prisma ORM setup
- MySQL integration
- backend modular setup
- API standards
- validation layer
- security middleware
- scalable backend initialization

This phase does NOT implement:
- attendance logic
- face recognition
- geofencing
- reports
- analytics
- dashboards

---

# 2. Phase 2 Deliverables

At end of Phase 2:

- Express backend fully initialized
- Prisma connected to MySQL
- Authentication APIs functional
- JWT access/refresh flow working
- RBAC middleware implemented
- User roles operational
- Validation layer complete
- Error handling centralized
- API architecture production-ready
- Security middleware configured
- Database migrations initialized

---

# 3. Technical Scope

## Modules Included

```text
auth/
users/
roles/
common/
middleware/
config/
```

---

# 4. Backend Technology Stack

## Runtime
- Node.js (LTS)

## Framework
- Express.js

## Database
- MySQL

## ORM
- Prisma ORM

## Validation
- Zod

## Authentication
- JWT
- bcrypt

## Security
- Helmet
- CORS
- Rate Limiting

---

# 5. Backend Project Initialization

## Step 1 — Create Backend

```bash
mkdir smart-attendance-ai
cd smart-attendance-ai

mkdir apps
cd apps

mkdir api
cd api

npm init -y
```

---

# 6. Install Dependencies

## Core Dependencies

```bash
npm install express cors helmet compression dotenv bcrypt jsonwebtoken zod express-rate-limit cookie-parser
```

---

## Prisma Dependencies

```bash
npm install prisma @prisma/client
```

---

## TypeScript Dependencies

```bash
npm install -D typescript ts-node-dev @types/node @types/express @types/jsonwebtoken @types/bcrypt
```

---

# 7. Initialize TypeScript

```bash
npx tsc --init
```

Recommended config:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  }
}
```

---

# 8. Initialize Prisma

```bash
npx prisma init
```

Creates:

```text
prisma/
.env
```

---

# 9. Environment Variables

## .env

```env
PORT=5000

DATABASE_URL="mysql://root:password@localhost:3306/smartattendance"

JWT_SECRET=
JWT_REFRESH_SECRET=

ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d

NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

---

# 10. Backend Folder Structure

```text
apps/api/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   │
│   ├── common/
│   │
│   ├── middleware/
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   └── roles/
│   │
│   ├── routes/
│   │
│   ├── utils/
│   │
│   ├── app.ts
│   └── server.ts
│
├── package.json
└── tsconfig.json
```

---

# 11. App Initialization

## app.ts

Responsibilities:
- initialize express
- initialize middleware
- initialize routes
- global error handling

---

## server.ts

Responsibilities:
- start HTTP server
- initialize environment
- connect database

---

# 12. Prisma Database Schema

## schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  STUDENT
  TEACHER
  ADMIN
}

model User {
  id            BigInt   @id @default(autoincrement())
  fullName      String
  email         String   @unique
  password      String

  role          UserRole

  isActive      Boolean  @default(true)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  refreshTokens RefreshToken[]

  @@index([email])
}

model RefreshToken {
  id          BigInt   @id @default(autoincrement())

  token       String   @unique

  userId       BigInt
  user         User     @relation(fields: [userId], references: [id])

  expiresAt    DateTime

  createdAt    DateTime @default(now())

  @@index([userId])
}
```

---

# 13. Run Migration

```bash
npx prisma migrate dev --name init
```

---

# 14. Generate Prisma Client

```bash
npx prisma generate
```

---

# 15. Prisma Client Setup

## src/config/prisma.ts

Responsibilities:
- initialize singleton Prisma client
- avoid multiple DB connections

Example:

```ts
import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()
```

---

# 16. Authentication Architecture

## JWT Strategy

### Access Token
- lifetime: 15 minutes

### Refresh Token
- lifetime: 7 days

---

## Why Two Tokens?

### Access Token
- short-lived
- secure
- minimizes risk

### Refresh Token
- renews sessions
- avoids repeated login

---

# 17. Authentication Flow

```text
User Login
    ↓
Validate Credentials
    ↓
Generate Access Token
    ↓
Generate Refresh Token
    ↓
Store Refresh Token
    ↓
Return Tokens
```

---

# 18. Authentication Module Structure

```text
auth/
│
├── auth.controller.ts
├── auth.service.ts
├── auth.repository.ts
├── auth.routes.ts
├── auth.validation.ts
├── auth.types.ts
├── auth.middleware.ts
└── auth.utils.ts
```

---

# 19. Auth API Endpoints

## Register

```http
POST /api/v1/auth/register
```

Request:

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "StrongPass123",
  "role": "STUDENT"
}
```

---

## Login

```http
POST /api/v1/auth/login
```

---

## Refresh Access Token

```http
POST /api/v1/auth/refresh
```

---

## Logout

```http
POST /api/v1/auth/logout
```

---

## Get Current User

```http
GET /api/v1/auth/me
```

---

# 20. Zod Validation Layer

## auth.validation.ts

Responsibilities:
- validate request body
- sanitize inputs
- reject invalid payloads

Example:

```ts
import { z } from "zod"

export const registerSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["STUDENT", "TEACHER", "ADMIN"])
})
```

---

# 21. Password Security

## bcrypt Strategy

Use:

```bash
bcrypt salt rounds = 12
```

Never:
- store plain passwords
- use SHA256 directly

---

## Password Hashing Flow

```text
User Password
    ↓
bcrypt hash
    ↓
Store hash in DB
```

---

# 22. JWT Utility Layer

## jwt.utils.ts

Responsibilities:
- generate access token
- generate refresh token
- verify token
- decode token

---

## Token Payload

```json
{
  "userId": 1,
  "role": "STUDENT"
}
```

---

# 23. Authentication Middleware

## authenticate()

Responsibilities:
- verify JWT
- attach user to request
- reject unauthorized requests

Flow:

```text
Request
   ↓
Extract Bearer Token
   ↓
Verify JWT
   ↓
Attach req.user
   ↓
next()
```

---

# 24. RBAC Middleware

## authorize()

Responsibilities:
- validate user role
- restrict route access

Example:

```ts
authorize(["ADMIN"])

authorize(["TEACHER", "ADMIN"])
```

---

# 25. Role Hierarchy

```text
ADMIN
 ├── full access

TEACHER
 ├── academic access

STUDENT
 ├── limited access
```

---

# 26. API Route Structure

```text
/api/v1/auth/*
/api/v1/users/*
```

---

# 27. Common Response Format

## Success

```json
{
  "success": true,
  "message": "Login successful",
  "data": {}
}
```

---

## Error

```json
{
  "success": false,
  "message": "Invalid credentials",
  "errors": []
}
```

---

# 28. Centralized Error Handling

## global-error.middleware.ts

Responsibilities:
- catch all errors
- standardize responses
- avoid app crashes

---

## Error Types

```text
ValidationError
AuthenticationError
AuthorizationError
DatabaseError
InternalServerError
```

---

# 29. Security Middleware

## helmet

Protects:
- HTTP headers
- XSS
- clickjacking

---

## cors

Restricts:
- frontend domains
- unauthorized origins

---

## rate limiting

Protect:
- login endpoints
- auth routes

Recommended:

```text
100 requests / 15 minutes
```

---

# 30. Request Validation Middleware

## validateRequest()

Responsibilities:
- apply Zod schemas
- reject malformed requests

Flow:

```text
Incoming Request
     ↓
Validate Schema
     ↓
Valid?
  YES → Continue
  NO  → Reject
```

---

# 31. Database Connection Strategy

## Important

Backend must:
- reuse Prisma client
- avoid creating new DB clients per request

---

# 32. Scalability Considerations

## Concurrent Authentication Requests

Target:
- 100+ concurrent logins

---

## Scalability Decisions

### Stateless Authentication
- JWT-based
- no session memory

### Efficient Password Hashing
- bcrypt async hashing

### Indexed Email Queries
- unique indexed email

### Minimal JWT Payload
- reduce token size

---

# 33. Performance Optimization

## Important

Do NOT:
- query DB repeatedly
- store huge JWT payloads
- expose user passwords

---

## Recommended

- async/await everywhere
- pagination-ready architecture
- centralized config

---

# 34. Logging Strategy

## Winston/Pino (Future)

Log:
- authentication failures
- suspicious access
- server errors

---

# 35. API Testing

## Use:
- Postman
- Thunder Client

---

## Test Cases

### Register
- valid user
- duplicate email
- invalid password

### Login
- correct password
- wrong password

### JWT
- expired token
- invalid token

### RBAC
- admin route access
- unauthorized route access

---

# 36. Scripts

## package.json

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

---

# 37. Initial Route Registration

## routes/index.ts

Responsibilities:
- combine all module routes

Example:

```ts
router.use("/auth", authRoutes)
router.use("/users", userRoutes)
```

---

# 38. User Module Responsibilities

## users/

Handles:
- get profile
- update profile
- account activation
- role metadata

NOT attendance yet.

---

# 39. Future Readiness

Phase 2 architecture must support future modules:

```text
attendance/
timetable/
face-recognition/
geofence/
analytics/
reports/
```

without major refactor.

---

# 40. Coding Standards

## Rules

- single responsibility
- modular services
- repository pattern
- no business logic in routes
- typed responses
- async error handling

---

# 41. Recommended Git Workflow

## Branches

```text
main
develop
feature/auth
feature/rbac
feature/prisma
```

---

# 42. Docker Preparation

## Future Ready

Prepare:
- Dockerfile
- docker-compose

Not mandatory in Phase 2.

---

# 43. Completion Checklist

## Phase 2 Complete If:

- backend initialized
- Prisma connected
- migrations working
- auth APIs functional
- JWT flow working
- RBAC working
- validation working
- middleware integrated
- routes modularized
- error handling centralized
- security middleware active

---

# 44. Important Engineering Notes

The backend foundation quality determines:
- future scalability
- maintainability
- debugging complexity
- feature expansion speed

This phase must be:
- clean
- modular
- scalable
- production-oriented

before implementing attendance features.

---

# 45. Next Phase Preview

## Phase 3

Will implement:
- timetable engine
- classroom management
- subject allocation
- active session detection
- schedule validation

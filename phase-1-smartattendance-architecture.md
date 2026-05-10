# SmartAttendance AI — Phase 1 Architecture & Project Skeleton

## Project
**SmartAttendance AI**  
Integrated Biometric & Geospatial Attendance Management Platform

---

# 1. Phase 1 Goal

Phase 1 is ONLY about:

- Defining architecture
- Designing scalable foundation
- Creating project skeleton
- Setting up backend/frontend structure
- Establishing database architecture
- Defining modules and responsibilities
- Preparing for future scalability

No business features are implemented in Phase 1.

---

# 2. Core Engineering Objectives

The architecture must support:

- 100+ concurrent attendance submissions
- Real-time attendance validation
- Role-based dashboard segregation
- Secure biometric verification
- Geospatial validation
- Timetable-driven attendance engine
- Analytics and reporting
- Future horizontal scaling

---

# 3. High-Level System Architecture

```text
 ┌─────────────────────────────┐
 │         Frontend            │
 │   Next.js 15 + Shadcn/UI    │
 └──────────────┬──────────────┘
                │ HTTPS
                ▼
 ┌─────────────────────────────┐
 │        API Gateway          │
 │      Express.js Server      │
 └──────────────┬──────────────┘
                │
 ┌──────────────┼─────────────────────────────────┐
 ▼              ▼                ▼                ▼
Auth        Attendance       Timetable        Analytics
Service      Service          Service          Service

 ▼              ▼                ▼                ▼
JWT       Face Validation   Active Session    Reports
RBAC      Geo Validation    Scheduler         Prediction

 └──────────────┬─────────────────────────────────┘
                ▼
        ┌───────────────┐
        │   MySQL DB    │
        └───────────────┘
```

---

# 4. Scalability Strategy (Important)

## Requirement
At peak:
- ~100 students may mark attendance simultaneously

The application MUST NOT crash.

---

# 5. Scalability Decisions

## 5.1 Stateless Backend

Backend must remain stateless.

Meaning:
- No session memory in server RAM
- JWT-based authentication
- Any request can hit any server instance

This enables:
- horizontal scaling
- load balancing
- future Kubernetes deployment

---

## 5.2 Client-Side Face Processing

Face recognition descriptor generation occurs in browser.

Reason:
TensorFlow operations are CPU-heavy.

If server handles:
- webcam frames
- TensorFlow inference
- image processing

Then:
100 concurrent users may overload backend.

Instead:

Frontend:
- captures face
- generates 128D descriptor
- sends descriptor only

Backend:
- validates descriptor
- performs matching

This massively reduces server load.

---

## 5.3 Attendance Submission Pipeline

Attendance API flow:

```text
Student Request
    ↓
JWT Validation
    ↓
Rate Limiter
    ↓
Timetable Validation
    ↓
Geo Validation
    ↓
Face Descriptor Matching
    ↓
Attendance Record Creation
    ↓
Response
```

---

## 5.4 Database Optimization

Attendance table will become large.

Optimization required:

- indexed foreign keys
- composite indexes
- optimized attendance queries

Important indexes:

```sql
INDEX(student_id, date)
INDEX(class_id, date)
INDEX(subject_id, date)
INDEX(marked_at)
```

---

## 5.5 API Protection

Attendance endpoint protections:

- Rate limiting
- Request validation
- Request size limits
- Helmet middleware
- CORS restrictions

---

# 6. Recommended Tech Stack

## Frontend
- Next.js 15
- App Router
- Tailwind CSS
- Shadcn/UI
- React Hook Form
- Zod
- TanStack Query

---

## Backend
- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT
- Zod
- bcrypt
- Redis (future)

---

## AI Layer
- face-api.js
- TensorFlow.js

---

## Reporting
- ExcelJS
- jsPDF

---

# 7. Monorepo Structure

```text
smart-attendance-ai/
│
├── apps/
│   ├── web/                 # Next.js frontend
│   └── api/                 # Express backend
│
├── packages/
│   ├── shared-types/
│   ├── eslint-config/
│   └── tsconfig/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   └── database/
│
├── docker/
│
├── .github/
│
├── package.json
├── turbo.json
└── README.md
```

---

# 8. Frontend Architecture

## Frontend Folder Structure

```text
apps/web/
│
├── app/
│   ├── (auth)/
│   ├── (student)/
│   ├── (teacher)/
│   ├── (admin)/
│   ├── api/
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   ├── shared/
│   ├── attendance/
│   ├── analytics/
│   └── forms/
│
├── lib/
│   ├── api/
│   ├── auth/
│   ├── validations/
│   └── utils/
│
├── hooks/
│
├── services/
│
├── store/
│
├── types/
│
└── middleware.ts
```

---

# 9. Backend Architecture

## Backend Folder Structure

```text
apps/api/
│
├── src/
│   ├── config/
│   ├── modules/
│   │
│   ├── common/
│   │
│   ├── middleware/
│   │
│   ├── routes/
│   │
│   ├── jobs/
│   │
│   ├── utils/
│   │
│   ├── app.ts
│   └── server.ts
│
├── prisma/
│
├── tests/
│
└── package.json
```

---

# 10. Backend Modular Structure

```text
modules/
│
├── auth/
├── users/
├── students/
├── teachers/
├── attendance/
├── timetable/
├── geofence/
├── face-recognition/
├── leave/
├── analytics/
├── notifications/
└── reports/
```

---

# 11. Example Module Structure

```text
attendance/
│
├── attendance.controller.ts
├── attendance.service.ts
├── attendance.repository.ts
├── attendance.routes.ts
├── attendance.validation.ts
├── attendance.types.ts
├── attendance.constants.ts
└── attendance.utils.ts
```

---

# 12. Database Architecture

## Database Choice
MySQL chosen because:

- relational integrity
- timetable relationships
- attendance joins
- transactional consistency
- analytics support

---

# 13. Core Database Tables

```text
users
roles
students
teachers
departments
subjects
sections
classrooms
timetables
attendance
attendance_logs
leave_requests
notifications
face_descriptors
```

---

# 14. Critical Attendance Table

```sql
CREATE TABLE attendance (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    class_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,

    attendance_date DATE NOT NULL,

    status ENUM('PRESENT', 'ABSENT', 'LATE'),

    face_verified BOOLEAN DEFAULT FALSE,
    geo_verified BOOLEAN DEFAULT FALSE,

    confidence_score DECIMAL(5,2),

    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),

    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_student_date (student_id, attendance_date),
    INDEX idx_class_date (class_id, attendance_date),
    INDEX idx_subject_date (subject_id, attendance_date)
);
```

---

# 15. Authentication Architecture

## JWT Strategy

### Access Token
- 15 minutes

### Refresh Token
- 7 days

---

## RBAC Roles

```text
STUDENT
TEACHER
ADMIN
```

---

## Middleware Flow

```text
authenticate()
    ↓
authorize(["ADMIN"])
```

---

# 16. Attendance Workflow

```text
1. Student opens app
2. JWT verified
3. Active timetable fetched
4. GPS validated
5. Webcam opened
6. Face descriptor generated
7. Descriptor sent to backend
8. Backend validates descriptor
9. Attendance saved
10. Analytics updated
```

---

# 17. Geo-fencing Design

Each classroom stores:

```text
latitude
longitude
allowed_radius
```

Recommended radius:
- 150m to 250m

Reason:
browser GPS is inaccurate indoors.

---

# 18. Face Recognition Design

## Registration

Student uploads:
- 5 face samples

System:
- generates average descriptor
- stores vector

---

## Attendance Verification

```text
Incoming Descriptor
        ↓
Euclidean Distance Match
        ↓
Threshold Validation
        ↓
Verified / Rejected
```

Recommended threshold:
- 0.45

---

# 19. Performance Optimization

## Important

Do NOT:
- store images in DB
- process video on backend
- block request thread

---

## Future Optimizations

- Redis caching
- BullMQ queues
- Horizontal scaling
- CDN asset delivery
- Read replicas

---

# 20. API Design Principles

## REST Naming

```text
/api/v1/auth/login
/api/v1/attendance/mark
/api/v1/timetable/current
/api/v1/reports/export
```

---

## Response Format

```json
{
  "success": true,
  "message": "Attendance marked successfully",
  "data": {}
}
```

---

# 21. Security Architecture

## Required Security Middleware

- helmet
- cors
- express-rate-limit
- compression
- zod validation

---

## Password Security

Use:
- bcrypt

Never:
- plain text
- SHA256 directly

---

# 22. Environment Variables

```env
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
PORT=
CLIENT_URL=
REDIS_URL=
```

---

# 23. DevOps Preparation

## Docker Ready

Prepare:
- Dockerfile
- docker-compose

---

## CI/CD Ready

Future:
- GitHub Actions
- automated testing
- lint pipelines

---

# 24. Initial Backend Dependencies

```bash
npm install express cors helmet compression dotenv bcrypt jsonwebtoken zod prisma @prisma/client express-rate-limit
```

---

# 25. Initial Frontend Dependencies

```bash
npm install next react react-dom tailwindcss zod react-hook-form @tanstack/react-query
```

---

# 26. Phase 1 Deliverables

At end of Phase 1:

- complete folder structure
- database schema
- Prisma setup
- environment setup
- auth architecture
- RBAC design
- API architecture
- module structure
- route planning
- scalability planning
- deployment planning

NO feature implementation yet.

---

# 27. What NOT To Build In Phase 1

Do not build:
- dashboards
- attendance logic
- facial recognition
- reports
- analytics
- notifications

Only architecture + skeleton.

---

# 28. Suggested Development Order After Phase 1

## Phase 2
Authentication + RBAC

## Phase 3
Timetable Engine

## Phase 4
Attendance Engine

## Phase 5
Geo Validation

## Phase 6
Face Recognition

## Phase 7
Analytics + Reports

---

# 29. Final Engineering Notes

The system’s actual core is:

```text
Timetable Engine + Attendance Workflow
```

NOT face recognition.

Face recognition is an enhancement layer.

The architecture must prioritize:
- maintainability
- modularity
- scalability
- security
- clear service boundaries

before adding AI features.

---

# 30. Success Criteria for Phase 1

Phase 1 is successful if:

- project skeleton initialized
- scalable architecture defined
- backend modules isolated
- database schema finalized
- role structure finalized
- deployment-ready structure prepared
- system supports future scaling
- developers can start implementation immediately

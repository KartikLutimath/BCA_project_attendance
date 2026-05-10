# SmartAttendance AI — Project Discussion, Technical Decisions & Architecture Summary

## Project
**SmartAttendance AI**  
Integrated Biometric & Geospatial Attendance Management Platform

---

# 1. Project Vision

SmartAttendance AI is an enterprise-style institutional attendance management system designed to automate and secure academic attendance workflows using:

- biometric verification
- geospatial validation
- timetable-driven session orchestration
- role-based dashboards
- academic analytics
- automated reporting

The system is designed as a scalable, modular, production-oriented platform rather than a simple CRUD attendance application.

---

# 2. Core Product Objective

The main goal is to ensure:

- students can mark attendance only for valid active classes
- attendance is authenticated using face recognition
- attendance is restricted to classroom geofence boundaries
- teachers can manage and verify attendance efficiently
- administrators can monitor institutional attendance trends

---

# 3. Finalized Technology Decisions

---

## Frontend Stack

### Selected
- Next.js 15
- App Router
- Tailwind CSS
- Shadcn/UI
- React Hook Form
- TanStack Query
- Zustand

### Why

Next.js was selected because:
- App Router supports scalable dashboard architecture
- route groups fit RBAC well
- middleware supports authentication protection
- SSR and client components improve performance
- excellent deployment support via Vercel

Shadcn/UI selected because:
- professional enterprise UI
- reusable component architecture
- clean dashboard implementation
- Tailwind compatibility

---

## Backend Stack

### Selected
- Node.js
- Express.js
- TypeScript

### Why

Express was selected because:
- lightweight and modular
- suitable for API-heavy architecture
- easy middleware integration
- scalable stateless backend design
- good concurrency handling for attendance APIs

TypeScript selected because:
- strict typing
- safer large-scale architecture
- easier maintainability

---

## Database Decision

### Selected
- MySQL
- Prisma ORM

### Why MySQL Instead of MongoDB

The system is highly relational.

Core entities:
- students
- teachers
- timetables
- subjects
- sections
- classrooms
- attendance records

require:
- joins
- transactional integrity
- normalization
- indexing
- structured relationships

MongoDB was rejected because:
- timetable querying becomes inefficient
- attendance analytics become harder
- relational integrity weakens
- report generation becomes complex

Prisma selected because:
- migration management
- type safety
- relational querying
- productivity
- maintainable schema management

---

# 4. System Architecture Decision

The application is architected as:

```text
Frontend (Next.js)
        ↓
Express API Layer
        ↓
Service Layer
        ↓
Repository Layer
        ↓
Prisma ORM
        ↓
MySQL Database
```

---

# 5. Architectural Principles Finalized

---

## Modular Architecture

The backend must use:
- feature-based modular architecture

Rejected:
```text
controllers/
models/
routes/
```

Selected:
```text
modules/
  auth/
  attendance/
  timetable/
  analytics/
```

Reason:
- scalability
- maintainability
- isolated business logic

---

## Stateless Backend

Backend must remain stateless.

Meaning:
- no session storage in memory
- JWT-based authentication
- horizontal scalability supported

Reason:
attendance spikes may involve:
- 100+ concurrent submissions

---

## Repository-Service Pattern

Business logic must NOT exist inside controllers.

Selected architecture:

```text
Controller
   ↓
Service
   ↓
Repository
   ↓
Database
```

Reason:
- cleaner logic separation
- reusable services
- easier testing

---

# 6. Role-Based System Design

Three primary roles finalized:

---

## Student

Capabilities:
- biometric attendance marking
- GPS validation
- attendance dashboard
- leave requests
- attendance prediction

---

## Teacher

Capabilities:
- timetable access
- attendance verification
- manual attendance override
- leave approval
- subject analytics

---

## Admin / Head Master

Capabilities:
- timetable management
- classroom management
- user management
- institutional analytics
- report generation
- attendance monitoring

---

# 7. Authentication & Security Decisions

---

## Authentication Strategy

Selected:
- JWT Access Token
- JWT Refresh Token

### Access Token
- 15 minutes

### Refresh Token
- 7 days

Reason:
- secure session management
- scalable stateless auth
- production-oriented architecture

---

## Password Security

Selected:
- bcrypt (12 rounds)

Rejected:
- SHA256 direct hashing
- plain password storage

---

## Security Middleware

Finalized:
- Helmet
- CORS
- Rate Limiting
- Request Validation
- JWT Middleware

---

## RBAC

Middleware-based RBAC:

```text
authenticate()
authorize(["ADMIN"])
```

---

# 8. Timetable Engine Decision

The timetable engine was finalized as:
> the actual core system.

Reason:
attendance eligibility depends entirely on:
- active class
- valid teacher
- valid section
- correct time slot

---

## Timetable Responsibilities

The timetable engine must:
- detect active sessions
- validate class schedules
- prevent conflicts
- determine attendance eligibility

---

## Conflict Detection

Must prevent:
- teacher overlap
- classroom overlap
- section overlap

---

# 9. Attendance Engine Decision

Attendance system designed as:

```text
Student Request
    ↓
JWT Validation
    ↓
Timetable Validation
    ↓
Geofence Validation
    ↓
Face Validation
    ↓
Attendance Save
```

---

## Attendance Metadata

Attendance records will store:
- face verification status
- geofence validation status
- confidence score
- timestamps
- subject
- teacher
- classroom

Reason:
improves auditability and institutional transparency.

---

# 10. Face Recognition Decision

Selected:
- face-api.js
- TensorFlow.js

---

## Why Client-Side Processing

Face descriptor generation happens in browser.

Reason:
TensorFlow inference is CPU expensive.

If backend processed video:
- server load increases massively
- concurrency decreases

Selected architecture:

```text
Frontend:
- webcam capture
- descriptor generation

Backend:
- descriptor validation
- attendance verification
```

---

## Face Recognition Workflow

### Registration
- capture multiple face samples
- generate averaged descriptor
- store descriptor vector

### Attendance
- capture live face
- generate descriptor
- compare with stored descriptor
- validate similarity threshold

---

## Similarity Threshold

Recommended threshold:
```text
0.45
```

Reason:
exact matching is unreliable.

---

## Spoofing Concern

Identified issue:
- photo replay attacks
- fake image attacks

Future mitigation:
- blink detection
- head movement validation
- basic liveness checks

---

# 11. Geofencing Decision

Attendance allowed only inside classroom perimeter.

---

## Selected Validation

Browser Geolocation API.

---

## Classroom Metadata

Each classroom stores:
- latitude
- longitude
- allowed radius

---

## Radius Decision

Recommended:
```text
150m–250m
```

Reason:
indoor GPS accuracy is inconsistent.

---

## Limitation Accepted

GPS spoofing cannot be fully prevented in capstone scope.

This limitation will be documented honestly.

---

# 12. Scalability Decisions

---

## Concurrent Attendance Target

Architecture designed to support:
```text
100+ simultaneous attendance submissions
```

without application crash.

---

## Scalability Strategy

Selected:
- stateless backend
- indexed queries
- client-side AI processing
- modular services
- optimized DB relations

Future-ready:
- Redis
- BullMQ
- horizontal scaling
- load balancing

---

# 13. Database Architecture Decisions

Core tables finalized:

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

## Attendance Table Design

Attendance table stores:
- student
- teacher
- subject
- class
- validation metadata
- timestamps

Reason:
supports:
- analytics
- audits
- exports
- reporting

---

# 14. Analytics Decision

Prediction system:
> not treated as machine learning.

Selected:
- formula-based academic analytics

Example:
- current attendance %
- remaining classes
- possibility of reaching 75%

Reason:
more realistic and maintainable.

---

# 15. Reporting Decision

Selected:
- ExcelJS
- jsPDF

Supports:
- semester reports
- institutional compliance
- export generation

---

# 16. Deployment Decisions

Frontend:
- Vercel

Backend:
- Render

Database:
- MySQL

---

# 17. API Architecture Decisions

Selected:
- REST API architecture

Versioned routes:

```text
/api/v1/auth
/api/v1/attendance
/api/v1/timetables
```

---

## Common API Response Structure

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

# 18. Validation Strategy

Selected:
- Zod

Reason:
- schema safety
- request validation
- type-safe parsing

---

# 19. Development Philosophy

The project must prioritize:

- maintainability
- modularity
- scalability
- clean architecture
- service isolation
- production-readiness

before adding AI complexity.

---

# 20. Finalized Phase Order

---

## Phase 1
Architecture & Project Skeleton

---

## Phase 2
Authentication & Backend Foundation

---

## Phase 3
Timetable Engine

---

## Phase 4
Attendance Engine

---

## Phase 5
Geofencing System

---

## Phase 6
Face Recognition System

---

## Phase 7
Analytics & Reporting

---

# 21. Final Engineering Conclusions

The actual core of the system is:

```text
Timetable Engine + Attendance Workflow
```

NOT facial recognition.

Face recognition is treated as:
> an enhancement layer on top of a strong workflow system.

The project was intentionally designed as:
- enterprise-oriented
- scalable
- modular
- technically defendable
- suitable for capstone presentation and real-world architecture discussion.


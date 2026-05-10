# SmartAttendance AI — Phase 3 Implementation Plan

## Project
**SmartAttendance AI**  
Phase 3 — Timetable Engine & Academic Workflow System

---

# 1. Phase 3 Objective

Phase 3 focuses ONLY on:

- timetable engine
- academic scheduling system
- classroom management
- subject allocation
- active session detection
- academic relationships
- class scheduling APIs
- session validation engine
- teacher-subject mapping
- timetable-based attendance eligibility

This phase does NOT implement:
- attendance marking
- face recognition
- geofencing
- reports
- analytics
- notifications

---

# 2. Why Phase 3 Is Critical

This is the actual core of the system.

Without timetable orchestration:
- attendance logic fails
- validation fails
- class eligibility fails
- attendance automation fails

The timetable engine becomes:
> the source of truth.

---

# 3. Phase 3 Deliverables

At end of Phase 3:

- timetable system functional
- subjects managed
- classrooms managed
- sections managed
- active session engine working
- teacher-subject allocation working
- timetable APIs complete
- session eligibility validation working
- academic relationships normalized

---

# 4. Modules Included

```text
departments/
subjects/
classrooms/
sections/
timetables/
academic-calendar/
```

---

# 5. Core Academic Workflow

```text
Admin Creates Department
        ↓
Admin Creates Subjects
        ↓
Admin Creates Sections
        ↓
Admin Creates Classrooms
        ↓
Admin Assigns Teachers
        ↓
Admin Creates Timetable
        ↓
System Detects Active Sessions
        ↓
Students Become Eligible
```

---

# 6. Database Expansion

## New Tables Required

```text
departments
subjects
sections
classrooms
teacher_subjects
timetables
academic_sessions
```

---

# 7. Prisma Schema Additions

## Department Model

```prisma
model Department {
  id          BigInt   @id @default(autoincrement())

  name        String   @unique
  code        String   @unique

  createdAt   DateTime @default(now())

  subjects    Subject[]
  sections    Section[]
}
```

---

# 8. Subject Model

```prisma
model Subject {
  id            BigInt   @id @default(autoincrement())

  name          String
  code          String   @unique
  credits       Int

  departmentId  BigInt
  department    Department @relation(fields: [departmentId], references: [id])

  createdAt     DateTime @default(now())

  timetables    Timetable[]

  @@index([departmentId])
}
```

---

# 9. Classroom Model

```prisma
model Classroom {
  id              BigInt   @id @default(autoincrement())

  roomNumber      String   @unique

  buildingName    String

  latitude        Decimal
  longitude       Decimal

  allowedRadius   Int

  createdAt       DateTime @default(now())

  timetables      Timetable[]
}
```

---

# 10. Section Model

```prisma
model Section {
  id              BigInt   @id @default(autoincrement())

  name            String

  semester        Int

  departmentId    BigInt
  department      Department @relation(fields: [departmentId], references: [id])

  createdAt       DateTime @default(now())

  timetables      Timetable[]

  @@index([departmentId])
}
```

---

# 11. Teacher Subject Mapping

## teacher_subjects

Purpose:
- maps teachers to subjects
- supports subject ownership
- enables timetable generation

---

# 12. Timetable Model

## Core Engine Table

```prisma
model Timetable {
  id              BigInt   @id @default(autoincrement())

  dayOfWeek       Int

  startTime       String
  endTime         String

  teacherId       BigInt
  teacher         User @relation(fields: [teacherId], references: [id])

  subjectId       BigInt
  subject         Subject @relation(fields: [subjectId], references: [id])

  sectionId       BigInt
  section         Section @relation(fields: [sectionId], references: [id])

  classroomId     BigInt
  classroom       Classroom @relation(fields: [classroomId], references: [id])

  isActive        Boolean @default(true)

  createdAt       DateTime @default(now())

  @@index([teacherId])
  @@index([subjectId])
  @@index([sectionId])
}
```

---

# 13. Day Mapping Strategy

## dayOfWeek

```text
0 = Sunday
1 = Monday
2 = Tuesday
3 = Wednesday
4 = Thursday
5 = Friday
6 = Saturday
```

---

# 14. Academic Session Engine

## Purpose

Detect:
- current active class
- active teacher
- active subject
- active section

based on:
- server time
- current weekday

---

# 15. Active Session Detection Logic

## Example

Current Time:
```text
10:15 AM
Monday
```

Query:

```sql
SELECT *
FROM timetables
WHERE
day_of_week = 1
AND start_time <= NOW()
AND end_time >= NOW()
AND is_active = true
```

---

# 16. Timetable Validation Rules

## Must Prevent

- overlapping classes
- duplicate teacher allocation
- duplicate room allocation
- invalid timeslots

---

# 17. Overlapping Session Validation

## Example Invalid Case

```text
Teacher A
9:00 - 10:00
AND
9:30 - 10:30
```

Must reject.

---

# 18. Timetable Conflict Engine

## Validation Types

### Teacher Conflict
Same teacher cannot teach two classes simultaneously.

### Classroom Conflict
Same room cannot host two classes simultaneously.

### Section Conflict
Same section cannot attend two classes simultaneously.

---

# 19. Timetable Service Responsibilities

## timetable.service.ts

Handles:
- create timetable
- update timetable
- conflict detection
- active session detection
- session eligibility validation

---

# 20. Timetable Module Structure

```text
timetables/
│
├── timetable.controller.ts
├── timetable.service.ts
├── timetable.repository.ts
├── timetable.routes.ts
├── timetable.validation.ts
├── timetable.utils.ts
└── timetable.constants.ts
```

---

# 21. Subject Module Responsibilities

## subjects/

Handles:
- create subjects
- update subjects
- assign credits
- department mapping

---

# 22. Classroom Module Responsibilities

## classrooms/

Handles:
- room creation
- building metadata
- geofence coordinates
- radius configuration

---

# 23. Section Module Responsibilities

## sections/

Handles:
- section creation
- semester assignment
- department assignment

---

# 24. Timetable APIs

## Create Timetable

```http
POST /api/v1/timetables
```

Request:

```json
{
  "dayOfWeek": 1,
  "startTime": "09:00",
  "endTime": "10:00",
  "teacherId": 2,
  "subjectId": 4,
  "sectionId": 1,
  "classroomId": 3
}
```

---

# 25. Get Current Active Session

```http
GET /api/v1/timetables/current
```

Response:

```json
{
  "success": true,
  "data": {
    "subject": "Operating Systems",
    "teacher": "Dr. Sharma",
    "section": "CSE-A",
    "classroom": "Block A-204",
    "startTime": "09:00",
    "endTime": "10:00"
  }
}
```

---

# 26. Get Section Timetable

```http
GET /api/v1/timetables/section/:sectionId
```

---

# 27. Get Teacher Timetable

```http
GET /api/v1/timetables/teacher/:teacherId
```

---

# 28. Validation Layer

## timetable.validation.ts

Responsibilities:
- validate timetable inputs
- validate time format
- validate conflicts

---

# 29. Time Validation Rules

## Rules

```text
startTime < endTime
```

Must reject:

```text
10:00 → 09:00
```

---

# 30. Zod Timetable Schema

```ts
import { z } from "zod"

export const createTimetableSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),

  startTime: z.string(),
  endTime: z.string(),

  teacherId: z.number(),
  subjectId: z.number(),
  sectionId: z.number(),
  classroomId: z.number()
})
```

---

# 31. Session Eligibility Engine

## Purpose

Determine:
> can student mark attendance now?

---

## Validation Conditions

```text
Valid Session Exists
AND
Student Belongs To Section
AND
Current Time Is Within Slot
```

---

# 32. Academic Calendar Module

## Future Ready

Supports:
- semester start
- semester end
- holidays
- exam schedules

Not fully implemented yet.

---

# 33. Conflict Detection Algorithm

## Steps

```text
Incoming Timetable Request
        ↓
Check Teacher Availability
        ↓
Check Classroom Availability
        ↓
Check Section Availability
        ↓
No Conflicts?
   YES → Create
   NO  → Reject
```

---

# 34. Important Scalability Consideration

Timetable queries will run:
- frequently
- on every attendance request

Therefore:
queries must be optimized.

---

# 35. Recommended Indexes

```sql
INDEX(day_of_week)
INDEX(start_time)
INDEX(end_time)
INDEX(section_id)
INDEX(teacher_id)
```

---

# 36. Performance Optimization

## Important

Avoid:
- full timetable scans
- repeated joins
- redundant queries

---

## Recommended

- indexed filtering
- optimized relations
- cached active sessions (future)

---

# 37. Current Session Utility

## current-session.utils.ts

Responsibilities:
- get current weekday
- get current server time
- determine active slot

---

# 38. Timezone Handling

## Important

Always use:
```text
Asia/Kolkata
```

Do NOT depend on:
- client timezone
- browser time

Server becomes source of truth.

---

# 39. Error Handling

## Common Errors

```text
TeacherConflictError
RoomConflictError
SectionConflictError
InvalidTimeSlotError
```

---

# 40. Route Protection

## Admin Routes

Only ADMIN can:
- create timetable
- update timetable
- delete timetable

---

## Teacher Routes

Teachers can:
- view own timetable

---

## Student Routes

Students can:
- view section timetable

---

# 41. API Response Standards

## Success

```json
{
  "success": true,
  "message": "Timetable created successfully",
  "data": {}
}
```

---

## Error

```json
{
  "success": false,
  "message": "Teacher already assigned during this slot"
}
```

---

# 42. Testing Strategy

## Important Test Cases

### Create Timetable
- valid slot
- overlapping slot
- invalid times

### Active Session
- current active class
- no active class

### Conflict Detection
- teacher conflict
- room conflict
- section conflict

---

# 43. API Testing Tools

Use:
- Postman
- Thunder Client

---

# 44. Example Workflow

## Timetable Creation

```text
Admin Creates Subject
       ↓
Admin Creates Classroom
       ↓
Admin Creates Section
       ↓
Admin Assigns Teacher
       ↓
Admin Creates Timetable
       ↓
Conflict Engine Validates
       ↓
Timetable Saved
```

---

# 45. Future Readiness

Phase 3 architecture must support future modules:

```text
attendance/
geofence/
face-recognition/
analytics/
reports/
```

without schema redesign.

---

# 46. Backend Scripts

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

# 47. Coding Standards

## Rules

- modular services
- no business logic in controllers
- repository pattern
- reusable validation
- centralized constants

---

# 48. Engineering Notes

The timetable engine must be:
- deterministic
- reliable
- optimized
- conflict-safe

because:
every attendance request depends on it.

---

# 49. Completion Checklist

## Phase 3 Complete If:

- departments working
- subjects working
- sections working
- classrooms working
- timetable APIs functional
- conflict engine working
- active session engine working
- validations implemented
- indexes optimized
- RBAC enforced

---

# 50. Next Phase Preview

## Phase 4

Will implement:
- attendance engine
- attendance lifecycle
- attendance records
- teacher verification flow
- attendance submission APIs
- attendance validation engine

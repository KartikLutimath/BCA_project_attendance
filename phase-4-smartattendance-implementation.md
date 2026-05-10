# SmartAttendance AI — Phase 4 Implementation Plan

## Project
**SmartAttendance AI**  
Phase 4 — Attendance Engine & Attendance Workflow System

---

# 1. Phase 4 Objective

Phase 4 focuses ONLY on:

- attendance engine
- attendance lifecycle
- attendance APIs
- attendance validation
- attendance workflow
- attendance records
- teacher verification flow
- attendance session control
- attendance logging
- attendance status management

This phase does NOT implement:
- face recognition
- geofencing
- analytics
- reports
- notifications

---

# 2. Why Phase 4 Is Important

This phase implements:
> the actual attendance workflow.

The timetable engine determines:
- who CAN mark attendance

The attendance engine determines:
- how attendance is processed and stored.

---

# 3. Phase 4 Deliverables

At end of Phase 4:

- attendance APIs functional
- attendance records stored
- attendance session validation working
- duplicate attendance prevention working
- teacher verification workflow working
- attendance status lifecycle operational
- attendance logs operational
- attendance database optimized

---

# 4. Attendance Lifecycle

## Core Workflow

```text
Student Opens Attendance Page
          ↓
System Fetches Active Session
          ↓
Eligibility Validation
          ↓
Attendance Request Submitted
          ↓
Pending Verification
          ↓
Teacher Reviews Attendance
          ↓
Attendance Approved / Rejected
          ↓
Attendance Finalized
```

---

# 5. Modules Included

```text
attendance/
attendance-logs/
attendance-verification/
attendance-sessions/
```

---

# 6. Attendance Status Flow

```text
PENDING
   ↓
APPROVED
   ↓
FINALIZED
```

Rejected Flow:

```text
PENDING
   ↓
REJECTED
```

---

# 7. Attendance Database Design

## Core Tables

```text
attendance
attendance_logs
attendance_sessions
```

---

# 8. Attendance Table

```prisma
model Attendance {
  id                BigInt   @id @default(autoincrement())

  studentId         BigInt
  teacherId         BigInt
  timetableId       BigInt

  attendanceDate    DateTime

  status            AttendanceStatus

  isVerified        Boolean @default(false)

  markedAt          DateTime @default(now())

  createdAt         DateTime @default(now())

  @@index([studentId])
  @@index([attendanceDate])
  @@index([timetableId])
}
```

---

# 9. Attendance Status Enum

```prisma
enum AttendanceStatus {
  PENDING
  APPROVED
  REJECTED
  FINALIZED
}
```

---

# 10. Attendance Session Logic

Attendance should only be allowed:
- during active class
- within valid time window

---

# 11. Attendance Window Rules

Example:

```text
09:00 → 09:20
```

After that:
attendance closes automatically.

---

# 12. Attendance APIs

## Mark Attendance

```http
POST /api/v1/attendance/mark
```

---

## Approve Attendance

```http
PATCH /api/v1/attendance/:id/approve
```

---

## Reject Attendance

```http
PATCH /api/v1/attendance/:id/reject
```

---

# 13. Attendance Submission Flow

```text
Student Request
      ↓
Validate JWT
      ↓
Validate Student Role
      ↓
Validate Active Session
      ↓
Validate Timetable
      ↓
Check Duplicate Attendance
      ↓
Create Attendance Record
      ↓
Return Success
```

---

# 14. Duplicate Attendance Prevention

Student cannot mark attendance:
- twice for same session
- same date
- same timetable

---

# 15. Teacher Verification Workflow

```text
Teacher Opens Dashboard
        ↓
Fetch Pending Attendance
        ↓
Review Attendance Entries
        ↓
Approve / Reject
        ↓
Attendance Finalized
```

---

# 16. Attendance Validation Rules

Must validate:
- role is STUDENT
- student belongs to section
- student active status
- session open
- class active
- attendance not already marked

---

# 17. Attendance Module Structure

```text
attendance/
│
├── attendance.controller.ts
├── attendance.service.ts
├── attendance.repository.ts
├── attendance.routes.ts
├── attendance.validation.ts
├── attendance.constants.ts
├── attendance.utils.ts
└── attendance.types.ts
```

---

# 18. Scalability Considerations

Target:
- 100+ simultaneous attendance requests

Must avoid:
- duplicate inserts
- race conditions

---

# 19. Recommended DB Constraint

```text
(studentId + timetableId + attendanceDate)
```

---

# 20. Database Optimization

Recommended indexes:

```sql
INDEX(student_id)
INDEX(timetable_id)
INDEX(attendance_date)
INDEX(status)
```

---

# 21. Rate Limiting

Recommended:

```text
20 requests / minute
```

per student.

---

# 22. Security Rules

Must prevent:
- duplicate submissions
- unauthorized attendance
- fake timetable access
- direct teacher endpoint access

---

# 23. Attendance Logs

Every action must generate logs:

```text
ATTENDANCE_MARKED
ATTENDANCE_APPROVED
ATTENDANCE_REJECTED
ATTENDANCE_UPDATED
```

---

# 24. Route Protection

Students can:
- mark attendance
- view own attendance

Teachers can:
- verify attendance
- manage sessions

Admins can:
- override records

---

# 25. Testing Strategy

Test:
- valid attendance
- duplicate attendance
- closed session
- unauthorized access
- approval workflow
- rejection workflow

---

# 26. Completion Checklist

Phase 4 complete if:

- attendance APIs working
- validation operational
- duplicate prevention working
- teacher verification working
- logs working
- RBAC enforced
- indexes optimized

---

# 27. Next Phase Preview

## Phase 5

Will implement:
- geofencing engine
- GPS validation
- classroom radius validation
- geospatial utilities
- location verification workflow

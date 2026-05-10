/**
 * SmartAttendance AI — Full Dummy Data Seed
 *
 * Seeds ALL tables with realistic data for all 12 existing users.
 * Safe to re-run — skips already-existing records.
 *
 * Dependency order:
 *   Department → Subject, Section, Teacher profiles
 *   Section    → Student profiles
 *   Classroom  → Timetable
 *   Timetable  → Attendance, AttendanceLog
 *   Student    → LeaveRequest
 *   User       → Notification
 */

import {
  PrismaClient,
  AttendanceStatus,
  LeaveStatus,
  DayOfWeek,
} from "@prisma/client";

const prisma = new PrismaClient({ log: [] });

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns a date N days ago at midnight */
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Pick a random element from an array */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱  Starting full data seed...\n");

  // ── 1. Fetch existing users ────────────────────────────────────────────────
  const studentUsers = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { email: "asc" },
  });
  const teacherUsers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    orderBy: { email: "asc" },
  });

  if (studentUsers.length === 0 || teacherUsers.length === 0) {
    throw new Error("Run seed.ts first to create the 12 base users.");
  }

  console.log(`👤  Found ${studentUsers.length} students, ${teacherUsers.length} teachers\n`);

  // ── 2. Department ──────────────────────────────────────────────────────────
  const dept = await prisma.department.upsert({
    where: { code: "CSE" },
    update: {},
    create: {
      name: "Computer Science & Engineering",
      code: "CSE",
    },
  });
  console.log(`🏛   Department: ${dept.name}`);

  // ── 3. Subjects (5) ───────────────────────────────────────────────────────
  const subjectDefs = [
    { name: "Data Structures & Algorithms", code: "CSE301", credits: 4 },
    { name: "Database Management Systems",  code: "CSE302", credits: 3 },
    { name: "Operating Systems",            code: "CSE303", credits: 3 },
    { name: "Computer Networks",            code: "CSE304", credits: 3 },
    { name: "Software Engineering",         code: "CSE305", credits: 3 },
  ];

  const subjects = await Promise.all(
    subjectDefs.map((s) =>
      prisma.subject.upsert({
        where: { code: s.code },
        update: {},
        create: { ...s, departmentId: dept.id },
      })
    )
  );
  console.log(`📚  Subjects: ${subjects.map((s) => s.code).join(", ")}`);

  // ── 4. Section ────────────────────────────────────────────────────────────
  const section = await prisma.section.upsert({
    where: { id: "section-6cse-a" },
    update: {},
    create: {
      id: "section-6cse-a",
      name: "6CSE-A",
      semester: 6,
      departmentId: dept.id,
      academicYear: "2024-25",
    },
  });
  console.log(`🏫  Section: ${section.name}`);

  // ── 5. Classrooms (3) ─────────────────────────────────────────────────────
  const classroomDefs = [
    { name: "Block-A Room 101", building: "Block A", latitude: 15.4589, longitude: 75.0078, radius: 200 },
    { name: "Block-B Room 201", building: "Block B", latitude: 15.4595, longitude: 75.0085, radius: 200 },
    { name: "Block-C Lab 301",  building: "Block C", latitude: 15.4601, longitude: 75.0092, radius: 200 },
  ];

  const classrooms = await Promise.all(
    classroomDefs.map((c) =>
      prisma.classroom.upsert({
        where: { name: c.name },
        update: {},
        create: c,
      })
    )
  );
  console.log(`🏢  Classrooms: ${classrooms.map((c) => c.name).join(", ")}`);

  // ── 6. Teacher profiles (5) ───────────────────────────────────────────────
  const teachers = await Promise.all(
    teacherUsers.map((u, i) =>
      prisma.teacher.upsert({
        where: { userId: u.id },
        update: {},
        create: {
          userId: u.id,
          employeeId: `EMP${String(i + 1).padStart(3, "0")}`,
          departmentId: dept.id,
          designation: i === 0 || i === 3 ? "Associate Professor" : "Assistant Professor",
        },
      })
    )
  );
  console.log(`👨‍🏫  Teacher profiles: ${teachers.length} created/skipped`);

  // ── 7. Student profiles (5) ───────────────────────────────────────────────
  const students = await Promise.all(
    studentUsers.map((u, i) =>
      prisma.student.upsert({
        where: { userId: u.id },
        update: {},
        create: {
          userId: u.id,
          rollNumber: `CSE2024${String(i + 1).padStart(3, "0")}`,
          sectionId: section.id,
        },
      })
    )
  );
  console.log(`🎓  Student profiles: ${students.length} created/skipped`);

  // ── 8. Timetable slots (5 subjects × Mon–Fri) ─────────────────────────────
  // Each subject gets one slot per week on a different day
  const slotDefs: {
    subjectIdx: number;
    teacherIdx: number;
    day: DayOfWeek;
    start: string;
    end: string;
    classroomIdx: number;
  }[] = [
    { subjectIdx: 0, teacherIdx: 0, day: "MONDAY",    start: "09:00", end: "10:00", classroomIdx: 0 },
    { subjectIdx: 1, teacherIdx: 1, day: "TUESDAY",   start: "10:00", end: "11:00", classroomIdx: 1 },
    { subjectIdx: 2, teacherIdx: 2, day: "WEDNESDAY", start: "11:00", end: "12:00", classroomIdx: 0 },
    { subjectIdx: 3, teacherIdx: 3, day: "THURSDAY",  start: "14:00", end: "15:00", classroomIdx: 2 },
    { subjectIdx: 4, teacherIdx: 4, day: "FRIDAY",    start: "15:00", end: "16:00", classroomIdx: 1 },
  ];

  const effectiveFrom = daysAgo(60); // semester started 60 days ago

  const timetables = await Promise.all(
    slotDefs.map((s) =>
      prisma.timetable.upsert({
        where: {
          id: `tt-${s.day}-${subjects[s.subjectIdx].code}`,
        },
        update: {},
        create: {
          id: `tt-${s.day}-${subjects[s.subjectIdx].code}`,
          teacherId:   teachers[s.teacherIdx].id,
          subjectId:   subjects[s.subjectIdx].id,
          sectionId:   section.id,
          classroomId: classrooms[s.classroomIdx].id,
          dayOfWeek:   s.day,
          startTime:   s.start,
          endTime:     s.end,
          effectiveFrom,
          isActive:    true,
        },
      })
    )
  );
  console.log(`📅  Timetable slots: ${timetables.length} created/skipped`);

  // ── 9. Attendance records (past 30 days) ──────────────────────────────────
  // Map day name → JS getDay() index
  const dayIndex: Record<DayOfWeek, number> = {
    MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, FRIDAY: 5, SATURDAY: 6,
  };

  // Attendance % targets per student (for realistic variation)
  const attendancePct = [0.92, 0.78, 0.65, 0.88, 0.55]; // student 1–5

  let attendanceCreated = 0;
  let attendanceSkipped = 0;

  for (let daysBack = 30; daysBack >= 1; daysBack--) {
    const date = daysAgo(daysBack);
    const jsDay = date.getDay(); // 0=Sun, 1=Mon … 6=Sat

    // Find which timetable slot falls on this day
    const slot = timetables.find((t) => {
      const def = slotDefs[timetables.indexOf(t)];
      return dayIndex[def.day] === jsDay;
    });

    if (!slot) continue; // weekend or no class

    for (let si = 0; si < students.length; si++) {
      const student = students[si];
      const target  = attendancePct[si];

      // Decide present/absent based on target percentage
      const isPresent = Math.random() < target;
      const status: AttendanceStatus = isPresent ? "APPROVED" : "REJECTED";

      try {
        const record = await prisma.attendance.create({
          data: {
            studentId:       student.id,
            timetableId:     slot.id,
            date,
            status,
            isVerified:      true,
            faceVerified:    isPresent,
            geofenceVerified: isPresent,
            latitude:        isPresent ? 15.4589 + (Math.random() * 0.001) : null,
            longitude:       isPresent ? 75.0078 + (Math.random() * 0.001) : null,
            distanceMeters:  isPresent ? Math.round(Math.random() * 150) : null,
            markedAt:        new Date(date.getTime() + 9 * 60 * 60 * 1000), // 9 AM
          },
        });

        // Attendance log
        await prisma.attendanceLog.create({
          data: {
            attendanceId:   record.id,
            changedBy:      teacherUsers[slotDefs[timetables.indexOf(slot)].teacherIdx].id,
            previousStatus: "PENDING",
            newStatus:      status,
            reason:         isPresent ? "Verified by teacher" : "Absent — marked by system",
          },
        });

        attendanceCreated++;
      } catch {
        // @@unique([studentId, timetableId, date]) — skip duplicates
        attendanceSkipped++;
      }
    }
  }

  console.log(`✅  Attendance: ${attendanceCreated} created, ${attendanceSkipped} skipped`);

  // ── 10. Leave requests (2 per student) ────────────────────────────────────
  const leaveReasons = [
    "Medical appointment — fever and cold",
    "Family function — sister's wedding",
    "Sports tournament — inter-college cricket",
    "Personal emergency — family matter",
    "Medical — dental surgery recovery",
    "Educational trip — industrial visit",
    "Religious festival — family obligation",
    "Health issue — viral infection",
    "Personal — out of station",
    "Medical — follow-up checkup",
  ];

  let leaveCreated = 0;

  for (let si = 0; si < students.length; si++) {
    const student = students[si];
    const teacher = teachers[si % teachers.length];

    // Leave 1: approved, 2 weeks ago
    try {
      await prisma.leaveRequest.create({
        data: {
          studentId:    student.id,
          approvedById: teacher.id,
          fromDate:     daysAgo(14),
          toDate:       daysAgo(13),
          reason:       leaveReasons[si * 2],
          status:       "APPROVED",
        },
      });
      leaveCreated++;
    } catch { /* skip */ }

    // Leave 2: pending, 3 days ago
    try {
      await prisma.leaveRequest.create({
        data: {
          studentId:    student.id,
          approvedById: null,
          fromDate:     daysAgo(3),
          toDate:       daysAgo(2),
          reason:       leaveReasons[si * 2 + 1],
          status:       "PENDING",
        },
      });
      leaveCreated++;
    } catch { /* skip */ }
  }

  console.log(`📝  Leave requests: ${leaveCreated} created`);

  // ── 11. Notifications (for all 12 users) ──────────────────────────────────
  const allUsers = await prisma.user.findMany();

  const notifTemplates = [
    { title: "Attendance Marked",       body: "Your attendance has been recorded for today's class." },
    { title: "Leave Request Update",    body: "Your leave request has been reviewed by your teacher." },
    { title: "Low Attendance Warning",  body: "Your attendance is below 75%. Please attend classes regularly." },
    { title: "Timetable Updated",       body: "Your class schedule has been updated for next week." },
    { title: "System Announcement",     body: "SmartAttendance AI system maintenance scheduled this Sunday." },
  ];

  let notifCreated = 0;

  for (const user of allUsers) {
    // Give each user 2–3 notifications
    const count = user.role === "STUDENT" ? 3 : 2;
    for (let n = 0; n < count; n++) {
      const tmpl = notifTemplates[n % notifTemplates.length];
      try {
        await prisma.notification.create({
          data: {
            userId:  user.id,
            title:   tmpl.title,
            body:    tmpl.body,
            isRead:  n > 0, // first notification unread, rest read
          },
        });
        notifCreated++;
      } catch { /* skip */ }
    }
  }

  console.log(`🔔  Notifications: ${notifCreated} created`);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅  Full data seed complete!

  📊  What was seeded:
      • 1  Department  (CSE)
      • 5  Subjects    (CSE301–CSE305)
      • 1  Section     (6CSE-A, Semester 6)
      • 3  Classrooms  (Block A/B/C)
      • 5  Teacher profiles
      • 5  Student profiles
      • 5  Timetable slots (Mon–Fri)
      • ${attendanceCreated} Attendance records (30 days)
      • ${leaveCreated} Leave requests
      • ${notifCreated} Notifications

  🎯  Student attendance percentages:
      • student1  ~92%  (safe)
      • student2  ~78%  (safe)
      • student3  ~65%  (warning)
      • student4  ~88%  (safe)
      • student5  ~55%  (detained)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

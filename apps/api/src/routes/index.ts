import { Router } from "express";
import authRoutes from "@/modules/auth/auth.routes";
import usersRoutes from "@/modules/users/users.routes";

import departmentRoutes from "@/modules/departments/departments.routes";
import subjectRoutes from "@/modules/subjects/subjects.routes";
import classroomRoutes from "@/modules/classrooms/classrooms.routes";
import sectionRoutes from "@/modules/sections/sections.routes";
import timetableRoutes from "@/modules/timetables/timetables.routes";
import { attendanceRoutes } from "@/modules/attendance/attendance.routes";

const router = Router();

// ─── Module routes ────────────────────────────────────────────────────────────
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/departments", departmentRoutes);
router.use("/subjects", subjectRoutes);
router.use("/classrooms", classroomRoutes);
router.use("/sections", sectionRoutes);
router.use("/timetables", timetableRoutes);
router.use("/attendance", attendanceRoutes);

// ─── Future phase routes (registered here when implemented) ───────────────────
// router.use("/students",     studentsRoutes);
// router.use("/teachers",     teachersRoutes);
// router.use("/geofence",     geofenceRoutes);
// router.use("/analytics",    analyticsRoutes);
// router.use("/reports",      reportsRoutes);
// router.use("/leave",        leaveRoutes);
// router.use("/notifications",notificationsRoutes);

export default router;

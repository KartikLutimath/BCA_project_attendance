import { Router } from "express";
import authRoutes from "@/modules/auth/auth.routes";
import usersRoutes from "@/modules/users/users.routes";

const router = Router();

// ─── Module routes ────────────────────────────────────────────────────────────
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);

// ─── Future phase routes (registered here when implemented) ───────────────────
// router.use("/students",     studentsRoutes);
// router.use("/teachers",     teachersRoutes);
// router.use("/timetables",   timetableRoutes);
// router.use("/attendance",   attendanceRoutes);
// router.use("/geofence",     geofenceRoutes);
// router.use("/analytics",    analyticsRoutes);
// router.use("/reports",      reportsRoutes);
// router.use("/leave",        leaveRoutes);
// router.use("/notifications",notificationsRoutes);

export default router;

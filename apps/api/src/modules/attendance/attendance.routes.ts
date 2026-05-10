import { Router } from "express";
import { AttendanceController } from "./attendance.controller";
import { authenticate } from "@/middleware/auth.middleware";
import { authorize } from "@/middleware/rbac.middleware";
import { validate } from "@/middleware/validation.middleware";
import { attendanceRateLimiter } from "@/middleware/rateLimiter.middleware";
import { markAttendanceSchema, overrideSchema, getHistorySchema } from "./attendance.validation";

const router = Router();

// Student
router.post(
  "/mark",
  authenticate,
  authorize(["STUDENT"]),
  attendanceRateLimiter, // Rate limit: 5 submissions per minute
  validate(markAttendanceSchema),
  AttendanceController.mark
);

router.get(
  "/history",
  authenticate,
  authorize(["STUDENT"]),
  validate(getHistorySchema),
  AttendanceController.getHistory
);

router.get(
  "/summary",
  authenticate,
  authorize(["STUDENT"]),
  AttendanceController.getSummary
);

// Teacher & Admin
router.patch(
  "/:id/override",
  authenticate,
  authorize(["TEACHER", "ADMIN"]),
  validate(overrideSchema),
  AttendanceController.override
);

// We add these two routes to conform with the workflow specs
router.patch(
  "/:id/approve",
  authenticate,
  authorize(["TEACHER", "ADMIN"]),
  (req, res, next) => {
    req.body.status = "APPROVED";
    req.body.reason = req.body.reason || "Approved by teacher";
    next();
  },
  validate(overrideSchema),
  AttendanceController.override
);

router.patch(
  "/:id/reject",
  authenticate,
  authorize(["TEACHER", "ADMIN"]),
  (req, res, next) => {
    req.body.status = "REJECTED";
    req.body.reason = req.body.reason || "Rejected by teacher";
    next();
  },
  validate(overrideSchema),
  AttendanceController.override
);

router.get(
  "/session/:id",
  authenticate,
  authorize(["TEACHER", "ADMIN"]),
  AttendanceController.getSessionAttendance
);

router.post(
  "/mark-absentees",
  authenticate,
  authorize(["TEACHER", "ADMIN"]),
  AttendanceController.markAbsentees
);

export const attendanceRoutes = router;

import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { authorize } from "@/middleware/rbac.middleware";
import { validate } from "@/middleware/validation.middleware";
import { createTimetableSchema, updateTimetableSchema } from "./timetables.validation";
import * as ctrl from "./timetables.controller";

const router = Router();

// Admin only mutations
router.post("/", authenticate, authorize(["ADMIN"]), validate(createTimetableSchema), ctrl.createTimetable);
router.put("/:id", authenticate, authorize(["ADMIN"]), validate(updateTimetableSchema), ctrl.updateTimetable);
router.delete("/:id", authenticate, authorize(["ADMIN"]), ctrl.deactivateTimetable);

// Admin + Teacher views
router.get("/section/:sectionId", authenticate, authorize(["ADMIN", "TEACHER"]), ctrl.getBySection);
router.get("/teacher/:teacherId", authenticate, authorize(["ADMIN", "TEACHER"]), ctrl.getByTeacher);

// Student/All views
router.get("/active", authenticate, ctrl.getActiveSession);
router.get("/today", authenticate, ctrl.getTodaySchedule);
router.get("/weekly", authenticate, ctrl.getWeeklySchedule);

export default router;

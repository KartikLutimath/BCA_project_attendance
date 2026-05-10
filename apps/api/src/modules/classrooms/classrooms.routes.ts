import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { authorize } from "@/middleware/rbac.middleware";
import { validate } from "@/middleware/validation.middleware";
import { createClassroomSchema, updateClassroomSchema } from "./classrooms.validation";
import * as ctrl from "./classrooms.controller";

const router = Router();

router.use(authenticate);

// Public list for authenticated users
router.get("/", ctrl.listClassrooms);
router.get("/:id", ctrl.getClassroomById);

// Admin only mutations
router.post("/", authorize(["ADMIN"]), validate(createClassroomSchema), ctrl.createClassroom);
router.put("/:id", authorize(["ADMIN"]), validate(updateClassroomSchema), ctrl.updateClassroom);
router.delete("/:id", authorize(["ADMIN"]), ctrl.deleteClassroom);

export default router;

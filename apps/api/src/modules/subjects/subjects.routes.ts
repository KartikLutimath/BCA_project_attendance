import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { authorize } from "@/middleware/rbac.middleware";
import { validate } from "@/middleware/validation.middleware";
import { createSubjectSchema, updateSubjectSchema } from "./subjects.validation";
import * as ctrl from "./subjects.controller";

const router = Router();

router.use(authenticate);

// Public list for authenticated users
router.get("/", ctrl.listSubjects);
router.get("/:id", ctrl.getSubjectById);

// Admin only mutations
router.post("/", authorize(["ADMIN"]), validate(createSubjectSchema), ctrl.createSubject);
router.put("/:id", authorize(["ADMIN"]), validate(updateSubjectSchema), ctrl.updateSubject);
router.delete("/:id", authorize(["ADMIN"]), ctrl.deleteSubject);

export default router;

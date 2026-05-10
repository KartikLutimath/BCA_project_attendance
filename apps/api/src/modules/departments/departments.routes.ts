import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { authorize } from "@/middleware/rbac.middleware";
import { validate } from "@/middleware/validation.middleware";
import { createDepartmentSchema, updateDepartmentSchema } from "./departments.validation";
import * as ctrl from "./departments.controller";

const router = Router();

router.use(authenticate);

// Public list for authenticated users
router.get("/", ctrl.listDepartments);
router.get("/:id", ctrl.getDepartmentById);

// Admin only mutations
router.post("/", authorize(["ADMIN"]), validate(createDepartmentSchema), ctrl.createDepartment);
router.put("/:id", authorize(["ADMIN"]), validate(updateDepartmentSchema), ctrl.updateDepartment);
router.delete("/:id", authorize(["ADMIN"]), ctrl.deleteDepartment);

export default router;

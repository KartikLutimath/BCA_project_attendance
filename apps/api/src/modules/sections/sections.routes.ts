import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { authorize } from "@/middleware/rbac.middleware";
import { validate } from "@/middleware/validation.middleware";
import { createSectionSchema, updateSectionSchema } from "./sections.validation";
import * as ctrl from "./sections.controller";

const router = Router();

router.use(authenticate);

// Public list for authenticated users
router.get("/", ctrl.listSections);
router.get("/:id", ctrl.getSectionById);

// Admin only mutations
router.post("/", authorize(["ADMIN"]), validate(createSectionSchema), ctrl.createSection);
router.put("/:id", authorize(["ADMIN"]), validate(updateSectionSchema), ctrl.updateSection);
router.delete("/:id", authorize(["ADMIN"]), ctrl.deleteSection);

export default router;

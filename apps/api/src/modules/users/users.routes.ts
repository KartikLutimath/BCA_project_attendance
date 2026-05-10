import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { authorize } from "@/middleware/rbac.middleware";
import { validate } from "@/middleware/validation.middleware";
import * as ctrl from "./users.controller";
import { updateProfileSchema, userIdParamSchema } from "./users.validation";

const router = Router();

// All users routes require authentication
router.use(authenticate);

// GET /api/v1/users/me — any authenticated user
router.get("/me", ctrl.getMyProfile);

// GET /api/v1/users — ADMIN only
router.get("/", authorize(["ADMIN"]), ctrl.listUsers);

// GET /api/v1/users/:id — ADMIN only
router.get("/:id", authorize(["ADMIN"]), validate(userIdParamSchema), ctrl.getUserById);

// PATCH /api/v1/users/:id — authenticated (own profile) or ADMIN
router.patch(
  "/:id",
  validate(updateProfileSchema),
  ctrl.updateProfile
);

// PATCH /api/v1/users/:id/deactivate — ADMIN only
router.patch(
  "/:id/deactivate",
  authorize(["ADMIN"]),
  ctrl.deactivateUser
);

// PATCH /api/v1/users/:id/activate — ADMIN only
router.patch(
  "/:id/activate",
  authorize(["ADMIN"]),
  ctrl.activateUser
);

export default router;

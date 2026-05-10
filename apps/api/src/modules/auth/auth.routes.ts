import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validation.middleware";
import { authRateLimiter } from "@/middleware/rateLimiter.middleware";
import * as ctrl from "./auth.controller";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
} from "./auth.validation";

const router = Router();

// POST /api/v1/auth/register
router.post("/register", authRateLimiter, validate(registerSchema), ctrl.register);

// POST /api/v1/auth/login
router.post("/login", authRateLimiter, validate(loginSchema), ctrl.login);

// POST /api/v1/auth/refresh
router.post("/refresh", validate(refreshSchema), ctrl.refresh);

// POST /api/v1/auth/logout
router.post("/logout", validate(logoutSchema), ctrl.logout);

// GET /api/v1/auth/me — protected
router.get("/me", authenticate, ctrl.getMe);

export default router;

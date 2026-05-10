// geofence.routes.ts — Route Definitions

import { Router } from "express";
import { GeofenceController } from "./geofence.controller";
import { authenticate } from "@/middleware/auth.middleware";
import { authorize } from "@/middleware/rbac.middleware";
import { validate } from "@/middleware/validation.middleware";
import { verifyLocationSchema, updateClassroomLocationSchema } from "./geofence.validation";

const router = Router();

/**
 * Verify student location (mark attendance requires geofence check)
 * POST /api/v1/geofence/verify
 * Auth: Student
 */
router.post(
  "/verify",
  authenticate,
  authorize(["STUDENT"]),
  validate(verifyLocationSchema),
  GeofenceController.verifyLocation
);

/**
 * Get classroom location details
 * GET /api/v1/geofence/classroom/:id
 * Auth: Any authenticated user
 */
router.get(
  "/classroom/:id",
  authenticate,
  GeofenceController.getClassroomLocation
);

/**
 * Get all classrooms
 * GET /api/v1/geofence/classrooms
 * Auth: Any authenticated user
 */
router.get(
  "/classrooms",
  authenticate,
  GeofenceController.getAllClassrooms
);

/**
 * Update classroom geofence settings
 * PATCH /api/v1/geofence/classroom/:id
 * Auth: Admin only
 */
router.patch(
  "/classroom/:id",
  authenticate,
  authorize(["ADMIN"]),
  validate(updateClassroomLocationSchema),
  GeofenceController.updateClassroomLocation
);

/**
 * Calculate distance between two coordinates (utility endpoint)
 * POST /api/v1/geofence/distance
 * Auth: Any authenticated user
 */
router.post(
  "/distance",
  authenticate,
  GeofenceController.calculateDistance
);

export const geofenceRoutes = router;

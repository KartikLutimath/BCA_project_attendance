// geofence.validation.ts — Zod Validation Schemas

import { z } from "zod";

/**
 * Validate geofence verification request
 * Expects timetableId and GPS coordinates
 */
export const verifyLocationSchema = z.object({
  body: z.object({
    timetableId: z.string().cuid("Invalid timetable ID"),
    latitude: z
      .number()
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90"),
    longitude: z
      .number()
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180"),
    accuracy: z
      .number()
      .min(0, "Accuracy must be non-negative")
      .optional(),
  }),
});

/**
 * Validate classroom location update
 * Used by admins to configure classroom coordinates
 */
export const updateClassroomLocationSchema = z.object({
  body: z.object({
    latitude: z
      .number()
      .min(-90)
      .max(90)
      .optional(),
    longitude: z
      .number()
      .min(-180)
      .max(180)
      .optional(),
    allowedRadius: z
      .number()
      .min(100, "Radius must be at least 100m")
      .max(500, "Radius must not exceed 500m")
      .optional(),
  }),
  params: z.object({
    id: z.string().cuid("Invalid classroom ID"),
  }),
});

/**
 * Validate coordinate pair (used internally)
 */
export const coordinateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

/**
 * Validate GPS accuracy (used internally)
 */
export const gpsAccuracySchema = z.object({
  accuracy: z.number().min(0).optional(),
});

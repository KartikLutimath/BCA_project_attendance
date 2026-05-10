// geofence.constants.ts — Configuration & Error Codes

export const GEOFENCE_ERROR_CODES = {
  INVALID_COORDINATES: "INVALID_COORDINATES",
  OUTSIDE_GEOFENCE: "OUTSIDE_GEOFENCE",
  CLASSROOM_NOT_FOUND: "CLASSROOM_NOT_FOUND",
  TIMETABLE_NOT_FOUND: "TIMETABLE_NOT_FOUND",
  LOCATION_UNAVAILABLE: "LOCATION_UNAVAILABLE",
  GPS_ACCURACY_LOW: "GPS_ACCURACY_LOW",
  GPS_PERMISSION_DENIED: "GPS_PERMISSION_DENIED",
  LOCATION_TIMEOUT: "LOCATION_TIMEOUT",
} as const;

/**
 * Default classroom geofence radius in metres
 * Recommended: 150-250m to account for GPS drift & indoor inaccuracies
 */
export const DEFAULT_CLASSROOM_RADIUS = 200;

/**
 * Minimum allowed radius (metres)
 */
export const MIN_CLASSROOM_RADIUS = 100;

/**
 * Maximum allowed radius (metres)
 */
export const MAX_CLASSROOM_RADIUS = 500;

/**
 * GPS accuracy threshold (metres)
 * If GPS accuracy > this, location is considered unreliable
 */
export const GPS_ACCURACY_THRESHOLD = 150;

/**
 * Rate limiting for geofence verification
 * Max 10 requests per student per minute
 */
export const GEOFENCE_RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxPerMinute: 10,
} as const;

/**
 * Geofence validation error messages
 */
export const GEOFENCE_ERROR_MESSAGES: Record<string, string> = {
  [GEOFENCE_ERROR_CODES.INVALID_COORDINATES]: "Invalid coordinates provided",
  [GEOFENCE_ERROR_CODES.OUTSIDE_GEOFENCE]:
    "You are outside the classroom perimeter. Please move closer to the classroom.",
  [GEOFENCE_ERROR_CODES.CLASSROOM_NOT_FOUND]: "Classroom location not configured",
  [GEOFENCE_ERROR_CODES.TIMETABLE_NOT_FOUND]: "Timetable slot not found",
  [GEOFENCE_ERROR_CODES.LOCATION_UNAVAILABLE]: "Your location is not available",
  [GEOFENCE_ERROR_CODES.GPS_ACCURACY_LOW]:
    "GPS accuracy is too low. Please try again in a location with better GPS signal.",
  [GEOFENCE_ERROR_CODES.GPS_PERMISSION_DENIED]:
    "Location permission denied. Please allow location access in browser settings.",
  [GEOFENCE_ERROR_CODES.LOCATION_TIMEOUT]:
    "Location request timed out. Please try again.",
} as const;

/**
 * Geofence validation log events
 */
export const GEOFENCE_LOG_EVENTS = {
  LOCATION_VERIFIED: "LOCATION_VERIFIED",
  LOCATION_REJECTED: "LOCATION_REJECTED",
  GPS_ACCURACY_WARNING: "GPS_ACCURACY_WARNING",
  GPS_PERMISSION_DENIED: "GPS_PERMISSION_DENIED",
  GEOFENCE_CONFIGURED: "GEOFENCE_CONFIGURED",
  GEOFENCE_UPDATED: "GEOFENCE_UPDATED",
} as const;

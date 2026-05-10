export const ATTENDANCE_ERROR_CODES = {
  NO_ACTIVE_SESSION: "NO_ACTIVE_SESSION",
  ALREADY_MARKED: "ALREADY_MARKED",
  OUTSIDE_GEOFENCE: "OUTSIDE_GEOFENCE",
  FACE_MISMATCH: "FACE_MISMATCH",
  FACE_NOT_ENROLLED: "FACE_NOT_ENROLLED",
  OUTSIDE_ATTENDANCE_WINDOW: "OUTSIDE_ATTENDANCE_WINDOW",
  INVALID_REQUEST: "INVALID_REQUEST",
  UNAUTHORIZED_ACCESS: "UNAUTHORIZED_ACCESS",
} as const;

/**
 * Attendance window duration in minutes.
 * Students can mark attendance within this window from class start time.
 * Example: Class starts at 09:00, window is 20 mins → can mark until 09:20
 */
export const ATTENDANCE_WINDOW_MINUTES = 20;

/**
 * Rate limiting for mark attendance endpoint
 * 20 requests per student per minute
 */
export const ATTENDANCE_RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequestsPerWindow: 20,
  maxPerMinute: 1, // Max 1 attendance submission per minute per student
};

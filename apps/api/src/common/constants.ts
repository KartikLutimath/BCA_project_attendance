// Application-wide constants

export const BCRYPT_SALT_ROUNDS = 12;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const API_PREFIX = "/api/v1" as const;

export const GEOFENCE = {
  DEFAULT_RADIUS_METRES: 200,
  FACE_MATCH_THRESHOLD: 0.45,
} as const;

export const TOKEN = {
  ACCESS_EXPIRES: "15m",
  REFRESH_EXPIRES: "7d",
  REFRESH_EXPIRES_MS: 7 * 24 * 60 * 60 * 1000,
} as const;

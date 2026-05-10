// geofence.utils.ts — Haversine & Distance Calculation

const EARTH_RADIUS_M = 6371000; // Earth radius in metres

/**
 * Converts degrees to radians
 */
function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates distance between two GPS coordinates using the Haversine formula.
 * Returns distance in metres.
 *
 * @param lat1 - Student latitude
 * @param lng1 - Student longitude
 * @param lat2 - Classroom latitude
 * @param lng2 - Classroom longitude
 * @returns Distance in metres
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_M * c;
}

/**
 * Validates coordinate ranges
 */
export function validateCoordinates(latitude: number, longitude: number): boolean {
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}

/**
 * Validates GPS accuracy (reject if too inaccurate)
 * GPS accuracy > 150m is considered unreliable
 */
export function isAccuracyAcceptable(accuracyM: number, threshold: number = 150): boolean {
  return accuracyM <= threshold;
}

/**
 * Formats distance for display
 */
export function formatDistance(metres: number): string {
  if (metres < 1000) {
    return `${Math.round(metres)}m`;
  }
  return `${(metres / 1000).toFixed(2)}km`;
}

/**
 * Calculate margin (positive = inside, negative = outside)
 */
export function calculateMargin(distance: number, radius: number): number {
  return radius - distance;
}

/**
 * Check if point is inside circle (geofence)
 */
export function isInsideGeofence(distance: number, radius: number): boolean {
  return distance <= radius;
}

/**
 * Calculate GPS accuracy percentage
 */
export function getAccuracyPercentage(accuracyM: number, radiusM: number): number {
  return Math.round((accuracyM / radiusM) * 100);
}

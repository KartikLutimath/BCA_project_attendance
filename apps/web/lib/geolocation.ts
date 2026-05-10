/**
 * Browser Geolocation Integration
 * Frontend library for capturing student GPS coordinates
 * 
 * Usage:
 * import { getCurrentLocation } from "@/lib/geolocation";
 * 
 * const location = await getCurrentLocation();
 * // {latitude, longitude, accuracy}
 */

export interface LocationResult {
  latitude: number;
  longitude: number;
  accuracy: number; // metres
}

export interface LocationError {
  code: number;
  message: string;
}

/**
 * Get current student location using browser Geolocation API
 * 
 * @param timeoutMs - Timeout in milliseconds (default: 10000ms = 10 seconds)
 * @returns Promise with {latitude, longitude, accuracy}
 * @throws Error with message if permission denied, unavailable, or timeout
 * 
 * Example:
 * try {
 *   const loc = await getCurrentLocation();
 *   console.log(`At ${loc.latitude}, ${loc.longitude} (±${loc.accuracy}m)`);
 * } catch (err) {
 *   console.error("Location error:", err.message);
 * }
 */
export function getCurrentLocation(timeoutMs: number = 10000): Promise<LocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(
        new Error("Geolocation is not supported by this browser. Please use Chrome, Firefox, Safari or Edge.")
      );
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(mapGeoError(error));
      },
      {
        enableHighAccuracy: true, // Request GPS, not just IP/WiFi
        timeout: timeoutMs, // How long to wait for location
        maximumAge: 30000, // Can use cached position if < 30s old
      }
    );
  });
}

/**
 * Map browser Geolocation error codes to user-friendly messages
 */
function mapGeoError(error: GeolocationPositionError): Error {
  const messages: Record<number, string> = {
    1: "Location permission denied. Please allow location access in your browser settings to mark attendance.",
    2: "Your location is unavailable. Please move to an area with a stronger GPS signal and try again.",
    3: "Location request timed out. Please ensure your GPS is enabled and try again.",
  };

  const message = messages[error.code] ?? `Location error (code ${error.code})`;
  return new Error(message);
}

/**
 * Calculate distance between two GPS coordinates (Haversine formula)
 * Returns distance in metres
 * 
 * Useful for client-side validation before sending to backend
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const EARTH_RADIUS_M = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_M * c;
}

/**
 * Format distance for display to user
 */
export function formatDistance(metres: number): string {
  if (metres < 1000) {
    return `${Math.round(metres)}m`;
  }
  return `${(metres / 1000).toFixed(2)}km`;
}

/**
 * Check if location accuracy is acceptable
 * GPS accuracy > 150m is considered unreliable
 */
export function isAccuracyGood(accuracyM: number): boolean {
  return accuracyM <= 150;
}

/**
 * Format GPS accuracy for display
 */
export function formatAccuracy(accuracyM: number): string {
  return `±${Math.round(accuracyM)}m`;
}

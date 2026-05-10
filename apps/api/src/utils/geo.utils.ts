/**
 * Haversine formula — calculates the great-circle distance between two
 * GPS coordinates in metres.
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in metres
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Returns true if the student's GPS coordinates fall within the classroom's
 * allowed radius.
 */
export function isWithinGeofence(
  studentLat: number,
  studentLon: number,
  classroomLat: number,
  classroomLon: number,
  radiusMetres: number
): boolean {
  const distance = haversineDistance(
    studentLat,
    studentLon,
    classroomLat,
    classroomLon
  );
  return distance <= radiusMetres;
}

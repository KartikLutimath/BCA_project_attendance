// geofence.types.ts — TypeScript Interfaces & DTOs

export interface GeofenceInput {
  studentLat: number;
  studentLng: number;
  classroomLat: number;
  classroomLng: number;
  allowedRadius: number; // metres
  accuracy?: number; // GPS accuracy in metres
}

export interface GeofenceResult {
  isInside: boolean;
  distance: number; // metres from classroom centre
  margin: number; // positive = inside by Xm, negative = outside by Xm
  accuracy?: number;
}

export interface VerifyLocationDTO {
  timetableId: string;
  latitude: number;
  longitude: number;
  accuracy?: number; // GPS accuracy
}

export interface LocationVerificationResponse {
  isVerified: boolean;
  distance: number;
  allowedRadius: number;
  message: string;
  accuracy?: number;
}

export interface ClassroomLocationDTO {
  latitude: number;
  longitude: number;
  radius: number;
}

export interface UpdateClassroomLocationDTO {
  latitude?: number;
  longitude?: number;
  allowedRadius?: number;
}

export interface GeofenceValidationLog {
  attendanceId?: string;
  studentId?: string;
  timetableId: string;
  latitude: number;
  longitude: number;
  classroomLatitude: number;
  classroomLongitude: number;
  distance: number;
  allowedRadius: number;
  isVerified: boolean;
  accuracy?: number;
  verifiedAt: Date;
}

export interface StudentLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

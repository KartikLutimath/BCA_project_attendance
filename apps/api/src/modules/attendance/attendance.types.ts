import { AttendanceStatus } from "@prisma/client";

export interface MarkAttendanceDTO {
  latitude?: number;
  longitude?: number;
  faceDescriptor?: number[];
}

export interface OverrideAttendanceDTO {
  status: AttendanceStatus;
  reason: string;
}

export interface AttendanceFilters {
  from?: Date;
  to?: Date;
  subjectId?: string;
  limit?: number;
  offset?: number;
}

export interface CreateAttendanceDTO {
  studentId: string;
  timetableId: string;
  date: Date;
  status: AttendanceStatus;
  isVerified?: boolean;
  faceVerified?: boolean;
  faceConfidence?: number;
  geofenceVerified?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface CreateLogDTO {
  attendanceId: string;
  changedBy: string;
  previousStatus: AttendanceStatus;
  newStatus: AttendanceStatus;
  reason: string;
}

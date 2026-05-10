// ─── Auth ─────────────────────────────────────────────────────────────────────

export type Role = "STUDENT" | "TEACHER" | "ADMIN";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  isActive: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ─── Attendance ───────────────────────────────────────────────────────────────

export type AttendanceStatus = "PENDING" | "APPROVED" | "REJECTED" | "FINALIZED";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  timetableId: string;
  date: string;
  status: AttendanceStatus;
  isVerified: boolean;
  faceVerified: boolean;
  geofenceVerified: boolean;
  latitude?: number;
  longitude?: number;
  distanceMeters?: number;
  markedAt: string;
  timetable?: {
    subject: { id: string; name: string; code: string };
    teacher?: { user: { fullName: string } };
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  };
}

export interface MarkAttendanceDTO {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  faceDescriptor?: number[];
}

export interface AttendanceSummary {
  subjectId: string;
  subjectName: string;
  total: number;
  present: number;
}

// ─── Timetable ────────────────────────────────────────────────────────────────

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export interface TimetableSlot {
  id: string;
  teacherId: string;
  subjectId: string;
  sectionId: string;
  classroomId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
  subject: { id: string; name: string; code: string };
  teacher: { id: string; user: { fullName: string; email: string } };
  classroom: { id: string; name: string; building: string; latitude: number; longitude: number; radius: number };
  section: { id: string; name: string };
}

// ─── Classroom ────────────────────────────────────────────────────────────────

export interface Classroom {
  id: string;
  name: string;
  building: string;
  latitude: number;
  longitude: number;
  radius: number;
}

// ─── Geofence ─────────────────────────────────────────────────────────────────

export interface GeofenceVerifyResult {
  isVerified: boolean;
  distance: number;
  allowedRadius: number;
  margin: number;
  classroomName: string;
  accuracy?: number;
  message: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface SubjectAnalytics {
  subjectId: string;
  subjectName: string;
  total: number;
  present: number;
  percentage: number;
  isSafe: boolean;
}

export interface AttendancePrediction {
  subjectId: string;
  subjectName: string;
  currentPercentage: number;
  remainingClasses: number;
  classesNeeded: number;
  canReach75: boolean;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: unknown;
}

// ─── Leave ────────────────────────────────────────────────────────────────────

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface LeaveRequest {
  id: string;
  studentId: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
}

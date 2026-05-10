import { AppError } from "@/common/errors";

/**
 * Validates if current time is within the attendance marking window.
 * Window = class start time to (class start time + ATTENDANCE_WINDOW_MINUTES)
 *
 * @param classStartTime — "09:00" format
 * @param attendanceWindowMinutes — e.g., 20
 * @returns { isWithinWindow: boolean, minutesRemaining: number }
 */
export function isWithinAttendanceWindow(
  classStartTime: string,
  attendanceWindowMinutes: number = 20
): { isWithinWindow: boolean; minutesRemaining: number } {
  const now = new Date();
  const [startHour, startMinute] = classStartTime.split(":").map(Number);

  // Create today's class start time in local timezone
  const classStart = new Date();
  classStart.setHours(startHour, startMinute, 0, 0);

  // Calculate window end
  const windowEnd = new Date(classStart.getTime() + attendanceWindowMinutes * 60 * 1000);

  const minutesRemaining = Math.floor((windowEnd.getTime() - now.getTime()) / (60 * 1000));
  const isWithinWindow = now >= classStart && now <= windowEnd;

  return {
    isWithinWindow,
    minutesRemaining: isWithinWindow ? minutesRemaining : -1,
  };
}

/**
 * Formats time difference in human-readable format
 * @param minutes
 * @returns formatted string
 */
export function formatMinutesRemaining(minutes: number): string {
  if (minutes < 0) return "Attendance window closed";
  if (minutes === 0) return "Less than 1 minute remaining";
  return `${minutes} minute${minutes > 1 ? "s" : ""} remaining`;
}

/**
 * Validates attendance window and throws error if outside
 * @param classStartTime — "09:00" format
 * @param windowMinutes — attendance window duration in minutes
 * @throws AppError if outside window
 */
export function validateAttendanceWindow(
  classStartTime: string,
  windowMinutes: number = 20
): void {
  const { isWithinWindow, minutesRemaining } = isWithinAttendanceWindow(classStartTime, windowMinutes);

  if (!isWithinWindow) {
    const message =
      minutesRemaining < 0
        ? `Attendance window has closed. Class started at ${classStartTime}`
        : `Attendance window not yet open. Class starts at ${classStartTime}`;

    throw new AppError(message, 403, "OUTSIDE_ATTENDANCE_WINDOW");
  }
}

/**
 * Parse time string to minutes since midnight
 * @param timeStr — "09:30" format
 * @returns minutes since midnight
 */
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Check if student is currently in active class session
 * @param classStartTime — "09:00"
 * @param classEndTime — "10:00"
 * @returns boolean
 */
export function isInActiveSession(classStartTime: string, classEndTime: string): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const startMinutes = timeToMinutes(classStartTime);
  const endMinutes = timeToMinutes(classEndTime);

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

/**
 * Generate attendance summary metadata
 */
export function generateAttendanceMetadata(payload: any) {
  return {
    userAgent: payload.userAgent || "unknown",
    ipAddress: payload.ipAddress || "0.0.0.0",
    timestamp: new Date(),
    source: "mobile", // or "web"
  };
}

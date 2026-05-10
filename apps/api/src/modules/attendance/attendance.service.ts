import { TimetablesService } from "../timetables/timetables.service";
import { AttendanceRepository } from "./attendance.repository";
import { GeofenceService } from "../geofence/geofence.service";
import { AppError } from "@/common/errors";
import { MarkAttendanceDTO, AttendanceFilters } from "./attendance.types";
import { AttendanceStatus } from "@prisma/client";
import { prisma } from "@/config/database";
import { validateAttendanceWindow, isInActiveSession } from "./attendance.utils";
import { ATTENDANCE_WINDOW_MINUTES } from "./attendance.constants";

export class AttendanceService {
  static async markAttendance(studentId: string, payload: MarkAttendanceDTO) {
    const session = await TimetablesService.getActiveSessionForStudent(studentId);
    if (!session) {
      throw new AppError("No active class session found for your section", 404, "NO_ACTIVE_SESSION");
    }

    // ── PHASE 4: Attendance Window Validation ──
    validateAttendanceWindow(session.startTime, ATTENDANCE_WINDOW_MINUTES);

    // ── PHASE 4: Active Session Validation ──
    if (!isInActiveSession(session.startTime, session.endTime)) {
      throw new AppError("Class session is not currently active", 403, "SESSION_NOT_ACTIVE");
    }

    // ── PHASE 5: Geofence Validation ──
    // Student must be within classroom radius to mark attendance
    let geofenceResult = null;
    let geofenceVerified = false;

    if (payload.latitude !== undefined && payload.longitude !== undefined) {
      try {
        geofenceResult = GeofenceService.validate({
          studentLat: payload.latitude,
          studentLng: payload.longitude,
          classroomLat: session.classroom.latitude,
          classroomLng: session.classroom.longitude,
          allowedRadius: session.classroom.radius,
          accuracy: payload.accuracy,
        });
        geofenceVerified = geofenceResult.isInside;
      } catch (error) {
        // Geofence validation failed
        throw error;
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await AttendanceRepository.findTodayRecord(studentId, session.id, today);
    if (existing) {
      throw new AppError("Attendance already marked for this session", 409, "ALREADY_MARKED");
    }

    // Phase 5: Save attendance with geofence verification data
    const record = await AttendanceRepository.create({
      studentId,
      timetableId: session.id,
      date: today,
      status: "PENDING",
      isVerified: false,
      faceVerified: false,
      geofenceVerified,
      latitude: payload.latitude,
      longitude: payload.longitude,
      distanceMeters: geofenceResult?.distance,
    });

    // Generate log
    await AttendanceRepository.createLog({
      attendanceId: record.id,
      changedBy: studentId,
      previousStatus: "PENDING",
      newStatus: "PENDING",
      reason: geofenceVerified ? "Submitted with geofence verification" : "Submitted without geofence",
    });

    return {
      attendanceId: record.id,
      subject: session.subject.name,
      markedAt: record.markedAt,
      status: record.status,
      geofenceVerified,
      distance: geofenceResult?.distance,
    };
  }

  static async overrideAttendance(teacherId: string, attendanceId: string, newStatus: AttendanceStatus, reason: string, userRole?: string) {
    const record = await AttendanceRepository.findById(attendanceId);
    if (!record) throw new AppError("Attendance record not found", 404);

    // Verify teacher owns this timetable slot if not ADMIN
    if (userRole !== "ADMIN" && record.timetable.teacherId !== teacherId) {
      throw new AppError("You can only modify attendance for your own classes", 403);
    }

    const updated = await AttendanceRepository.updateStatus(attendanceId, newStatus);

    await AttendanceRepository.createLog({
      attendanceId,
      changedBy: teacherId,
      previousStatus: record.status,
      newStatus,
      reason,
    });

    return updated;
  }

  static async getStudentHistory(studentId: string, filters: AttendanceFilters) {
    return AttendanceRepository.getStudentHistory(studentId, filters);
  }

  static async getSubjectSummary(studentId: string) {
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) throw new AppError("Student not found", 404);
    return AttendanceRepository.getSubjectSummary(studentId, student.sectionId);
  }

  static async getSessionAttendance(timetableId: string, dateStr: string) {
    const date = new Date(dateStr);
    return AttendanceRepository.getSessionAttendance(timetableId, date);
  }

  static async markAbsentees(timetableId: string, date: Date) {
    const session = await prisma.timetable.findUnique({
      where: { id: timetableId },
      include: { section: { include: { students: true } } },
    });
    if (!session) return;

    const presentIds = await AttendanceRepository.getPresentStudentIds(timetableId, date);
    const absentStudents = session.section.students.filter((s) => !presentIds.includes(s.id));

    await prisma.attendance.createMany({
      data: absentStudents.map((s) => ({
        studentId: s.id,
        timetableId,
        date,
        status: "REJECTED", // Or ABSENT if we had it, but Phase 4 specifies PENDING, APPROVED, REJECTED, FINALIZED.
        isVerified: true,
        faceVerified: false,
        geofenceVerified: false,
      })),
      skipDuplicates: true,
    });

    return { marked: absentStudents.length };
  }
}

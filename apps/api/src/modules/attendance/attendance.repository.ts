import { prisma } from "@/config/database";
import { AttendanceStatus } from "@prisma/client";
import { CreateAttendanceDTO, CreateLogDTO, AttendanceFilters } from "./attendance.types";

export class AttendanceRepository {
  static async create(data: CreateAttendanceDTO) {
    return prisma.attendance.create({ data });
  }

  static async findById(id: string) {
    return prisma.attendance.findUnique({
      where: { id },
      include: { timetable: { include: { subject: true } }, student: true },
    });
  }

  static async findTodayRecord(studentId: string, timetableId: string, date: Date) {
    return prisma.attendance.findUnique({
      where: { studentId_timetableId_date: { studentId, timetableId, date } },
    });
  }

  static async getStudentHistory(studentId: string, filters: AttendanceFilters) {
    return prisma.attendance.findMany({
      where: {
        studentId,
        ...(filters.from && filters.to && { date: { gte: filters.from, lte: filters.to } }),
        ...(filters.subjectId && {
          timetable: { subjectId: filters.subjectId }
        }),
      },
      include: { timetable: { include: { subject: true } } },
      orderBy: { date: "desc" },
      take: filters.limit ?? 50,
      skip: filters.offset ?? 0,
    });
  }

  static async updateStatus(id: string, status: AttendanceStatus) {
    const isVerified = status === "APPROVED" || status === "REJECTED" || status === "FINALIZED";
    return prisma.attendance.update({
      where: { id },
      data: { status, isVerified },
    });
  }

  static async createLog(data: CreateLogDTO) {
    return prisma.attendanceLog.create({ data });
  }

  static async getSessionAttendance(timetableId: string, date: Date) {
    return prisma.attendance.findMany({
      where: { timetableId, date },
      include: { student: { include: { user: true } } },
    });
  }

  static async getPresentStudentIds(timetableId: string, date: Date): Promise<string[]> {
    const records = await prisma.attendance.findMany({
      where: { timetableId, date, status: { in: ["APPROVED", "FINALIZED"] } },
      select: { studentId: true },
    });
    return records.map((r) => r.studentId);
  }

  static async getSubjectSummary(studentId: string, sectionId: string) {
    const rows = await prisma.$queryRaw<
      { subjectId: string; subjectName: string; total: bigint; present: bigint }[]
    >`
      SELECT
        s.id       AS subjectId,
        s.name     AS subjectName,
        COUNT(a.id) AS total,
        SUM(CASE WHEN a.status IN ('APPROVED', 'FINALIZED') THEN 1 ELSE 0 END) AS present
      FROM Attendance a
      JOIN Timetable  t ON a.timetableId = t.id
      JOIN Subject    s ON t.subjectId   = s.id
      WHERE a.studentId = ${studentId}
        AND t.sectionId = ${sectionId}
      GROUP BY s.id, s.name
    `;

    // MySQL COUNT/SUM returns BigInt — convert to plain numbers for JSON serialisation
    return rows.map((r) => ({
      subjectId:   r.subjectId,
      subjectName: r.subjectName,
      total:   Number(r.total),
      present: Number(r.present ?? 0),
    }));
  }
}

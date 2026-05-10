import { prisma } from "@/config/database";
import { CreateTimetableDTO } from "./timetables.validation";
import { DayOfWeek } from "@prisma/client";

export class TimetablesRepository {
  static async create(data: CreateTimetableDTO) {
    return prisma.timetable.create({ data });
  }

  static async findById(id: string) {
    return prisma.timetable.findUnique({
      where: { id },
      include: {
        subject: true,
        teacher: { include: { user: { select: { fullName: true, email: true } } } },
        classroom: true,
        section: true,
      },
    });
  }

  static async deactivate(id: string) {
    // Never hard delete — affects attendance records
    return prisma.timetable.update({
      where: { id },
      data: { isActive: false },
    });
  }

  static async findByTeacher(teacherId: string) {
    return prisma.timetable.findMany({
      where: { teacherId, isActive: true },
      include: { subject: true, classroom: true, section: true },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
  }

  static async findBySection(sectionId: string) {
    return prisma.timetable.findMany({
      where: { sectionId, isActive: true },
      include: { subject: true, classroom: true, teacher: { include: { user: { select: { fullName: true } } } } },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
  }

  static async findDaySchedule(sectionId: string, day: DayOfWeek) {
    return prisma.timetable.findMany({
      where: { sectionId, dayOfWeek: day, isActive: true },
      include: { subject: true, teacher: { include: { user: { select: { fullName: true } } } }, classroom: true },
      orderBy: { startTime: "asc" },
    });
  }
}

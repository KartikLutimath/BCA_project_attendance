import { Request, Response, NextFunction } from "express";
import { AttendanceService } from "./attendance.service";
import { AppError } from "@/common/errors";
import { prisma } from "@/config/database";

export class AttendanceController {
  static async mark(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw new AppError("Unauthorized", 401);

      const student = await prisma.student.findUnique({ where: { userId } });
      if (!student) throw new AppError("Student profile not found", 404);

      const result = await AttendanceService.markAttendance(student.id, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw new AppError("Unauthorized", 401);

      const student = await prisma.student.findUnique({ where: { userId } });
      if (!student) throw new AppError("Student profile not found", 404);

      const filters = {
        from: req.query.from ? new Date(req.query.from as string) : undefined,
        to: req.query.to ? new Date(req.query.to as string) : undefined,
        subjectId: req.query.subjectId as string,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        offset: req.query.offset ? Number(req.query.offset) : undefined,
      };

      const history = await AttendanceService.getStudentHistory(student.id, filters);
      res.json({ success: true, data: history });
    } catch (error) {
      next(error);
    }
  }

  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw new AppError("Unauthorized", 401);

      const student = await prisma.student.findUnique({ where: { userId } });
      if (!student) throw new AppError("Student profile not found", 404);

      const summary = await AttendanceService.getSubjectSummary(student.id);
      res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  }

  static async override(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      if (!userId) throw new AppError("Unauthorized", 401);

      let teacherId = "";
      if (req.user?.role !== "ADMIN") {
        const teacher = await prisma.teacher.findUnique({ where: { userId } });
        if (!teacher) throw new AppError("Teacher profile not found", 404);
        teacherId = teacher.id;
      }

      const { id } = req.params;
      const { status, reason } = req.body;
      const result = await AttendanceService.overrideAttendance(teacherId || "ADMIN", id, status, reason, req.user?.role);
      
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getSessionAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const date = (req.query.date as string) || new Date().toISOString();
      const records = await AttendanceService.getSessionAttendance(id, date);
      res.json({ success: true, data: records });
    } catch (error) {
      next(error);
    }
  }

  static async markAbsentees(req: Request, res: Response, next: NextFunction) {
    try {
      const { timetableId, date } = req.body;
      if (!timetableId || !date) {
        throw new AppError("timetableId and date are required", 400);
      }
      
      const userId = req.user?.sub;
      if (!userId) throw new AppError("Unauthorized", 401);

      if (req.user?.role !== "ADMIN") {
        const teacher = await prisma.teacher.findUnique({ where: { userId } });
        if (!teacher) throw new AppError("Teacher profile not found", 404);
        
        // Verify teacher owns this slot
        const slot = await prisma.timetable.findUnique({ where: { id: timetableId } });
        if (slot?.teacherId !== teacher.id) {
          throw new AppError("You can only modify attendance for your own classes", 403);
        }
      }

      const result = await AttendanceService.markAbsentees(timetableId, new Date(date));
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from "express";
import { TimetablesService } from "./timetables.service";
import { success } from "@/common/response";
import { CreateTimetableDTO, UpdateTimetableDTO } from "./timetables.validation";
import { AppError } from "@/common/errors";

export const createTimetable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slot = await TimetablesService.createTimetable(req.body as CreateTimetableDTO);
    res.status(201).json(success("Timetable created successfully", slot));
  } catch (err) {
    next(err);
  }
};

export const updateTimetable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slot = await TimetablesService.updateTimetable(req.params.id, req.body as UpdateTimetableDTO);
    res.status(200).json(success("Timetable updated successfully", slot));
  } catch (err) {
    next(err);
  }
};

export const deactivateTimetable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await TimetablesService.deactivateTimetable(req.params.id);
    res.status(200).json(success("Timetable deactivated successfully"));
  } catch (err) {
    next(err);
  }
};

export const getBySection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const weekly = await TimetablesService.getSectionWeeklySchedule(req.params.sectionId);
    res.status(200).json(success("Section timetable fetched", weekly));
  } catch (err) {
    next(err);
  }
};

export const getByTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const weekly = await TimetablesService.getTeacherWeeklySchedule(req.params.teacherId);
    res.status(200).json(success("Teacher timetable fetched", weekly));
  } catch (err) {
    next(err);
  }
};

export const getActiveSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Requires student lookup using user ID
    // Normally we fetch student record ID via user ID:
    const student = await import("@/config/database").then(m => m.prisma.student.findUnique({
      where: { userId: req.user!.sub },
    }));

    if (!student) {
      throw new AppError("Student profile not found", 404, "NOT_FOUND");
    }

    const session = await TimetablesService.getActiveSessionForStudent(student.id);
    res.status(200).json(success("Active session fetched", session));
  } catch (err) {
    next(err);
  }
};

export const getTodaySchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await import("@/config/database").then(m => m.prisma.student.findUnique({
      where: { userId: req.user!.sub },
    }));

    if (!student) {
      throw new AppError("Student profile not found", 404, "NOT_FOUND");
    }

    const day = TimetablesService.getCurrentDayOfWeek(new Date());
    const schedule = await TimetablesService.getDaySchedule(student.sectionId, day);
    res.status(200).json(success("Today's schedule fetched", schedule));
  } catch (err) {
    next(err);
  }
};

export const getWeeklySchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await import("@/config/database").then(m => m.prisma.student.findUnique({
      where: { userId: req.user!.sub },
    }));

    if (!student) {
      throw new AppError("Student profile not found", 404, "NOT_FOUND");
    }

    const schedule = await TimetablesService.getSectionWeeklySchedule(student.sectionId);
    res.status(200).json(success("Weekly schedule fetched", schedule));
  } catch (err) {
    next(err);
  }
};

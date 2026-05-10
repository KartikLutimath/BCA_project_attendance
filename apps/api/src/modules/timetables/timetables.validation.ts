import { z } from "zod";
import { DayOfWeek } from "@prisma/client";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createTimetableSchema = z.object({
  body: z.object({
    teacherId: z.string().cuid(),
    subjectId: z.string().cuid(),
    sectionId: z.string().cuid(),
    classroomId: z.string().cuid(),
    dayOfWeek: z.nativeEnum(DayOfWeek),
    startTime: z.string().regex(timeRegex, "Invalid time format — use HH:mm"),
    endTime: z.string().regex(timeRegex, "Invalid time format — use HH:mm"),
    effectiveFrom: z.coerce.date(),
    effectiveTo: z.coerce.date().optional().nullable(),
  }).refine((d) => d.startTime < d.endTime, {
    message: "startTime must be before endTime",
  }),
});

export const updateTimetableSchema = z.object({
  body: z.object({
    teacherId: z.string().cuid().optional(),
    subjectId: z.string().cuid().optional(),
    sectionId: z.string().cuid().optional(),
    classroomId: z.string().cuid().optional(),
    dayOfWeek: z.nativeEnum(DayOfWeek).optional(),
    startTime: z.string().regex(timeRegex, "Invalid time format — use HH:mm").optional(),
    endTime: z.string().regex(timeRegex, "Invalid time format — use HH:mm").optional(),
    effectiveFrom: z.coerce.date().optional(),
    effectiveTo: z.coerce.date().optional().nullable(),
  }).refine((d) => {
    if (d.startTime && d.endTime) return d.startTime < d.endTime;
    return true; // if only one is updated, validation must happen in service against existing record
  }, {
    message: "startTime must be before endTime",
  }),
});

export type CreateTimetableDTO = z.infer<typeof createTimetableSchema>["body"];
export type UpdateTimetableDTO = z.infer<typeof updateTimetableSchema>["body"];

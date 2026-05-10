import { z } from "zod";
import { AttendanceStatus } from "@prisma/client";

export const markAttendanceSchema = z.object({
  body: z.object({
    faceDescriptor: z.array(z.number()).length(128, "Descriptor must have 128 values").optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
  }),
});

export const overrideSchema = z.object({
  params: z.object({ id: z.string().cuid() }),
  body: z.object({
    status: z.nativeEnum(AttendanceStatus),
    reason: z.string().min(5, "Reason required (min 5 chars)"),
  }),
});

export const getHistorySchema = z.object({
  query: z.object({
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    subjectId: z.string().cuid().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
  }),
});

import { z } from "zod";

export const createSectionSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(50),
    semester: z.number().int().min(1).max(10),
    departmentId: z.string().cuid("Invalid department ID"),
    academicYear: z.string().min(7).max(9), // e.g. "2024-25"
  }),
});

export const updateSectionSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(50).optional(),
    semester: z.number().int().min(1).max(10).optional(),
    departmentId: z.string().cuid().optional(),
    academicYear: z.string().min(7).max(9).optional(),
  }),
});

export type CreateSectionDTO = z.infer<typeof createSectionSchema>["body"];
export type UpdateSectionDTO = z.infer<typeof updateSectionSchema>["body"];

import { z } from "zod";

export const createSubjectSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    code: z.string().min(2, "Code must be at least 2 characters").max(20).toUpperCase(),
    departmentId: z.string().cuid("Invalid department ID"),
    credits: z.number().int().min(1).max(10).default(3),
  }),
});

export const updateSubjectSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    code: z.string().min(2).max(20).toUpperCase().optional(),
    departmentId: z.string().cuid().optional(),
    credits: z.number().int().min(1).max(10).optional(),
  }),
});

export type CreateSubjectDTO = z.infer<typeof createSubjectSchema>["body"];
export type UpdateSubjectDTO = z.infer<typeof updateSubjectSchema>["body"];

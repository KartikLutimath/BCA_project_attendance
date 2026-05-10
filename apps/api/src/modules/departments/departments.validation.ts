import { z } from "zod";

export const createDepartmentSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    code: z.string().min(2, "Code must be at least 2 characters").max(20).toUpperCase(),
  }),
});

export const updateDepartmentSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    code: z.string().min(2).max(20).toUpperCase().optional(),
  }),
});

export type CreateDepartmentDTO = z.infer<typeof createDepartmentSchema>["body"];
export type UpdateDepartmentDTO = z.infer<typeof updateDepartmentSchema>["body"];

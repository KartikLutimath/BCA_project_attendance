import { z } from "zod";

export const createClassroomSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    building: z.string().min(2, "Building name is required").max(100),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    radius: z.number().min(10).max(1000).default(200),
  }),
});

export const updateClassroomSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    building: z.string().min(2).max(100).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    radius: z.number().min(10).max(1000).optional(),
  }),
});

export type CreateClassroomDTO = z.infer<typeof createClassroomSchema>["body"];
export type UpdateClassroomDTO = z.infer<typeof updateClassroomSchema>["body"];

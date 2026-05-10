import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .max(100)
      .optional(),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "User ID is required" }),
  }),
});

export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>["body"];

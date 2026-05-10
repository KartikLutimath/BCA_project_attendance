import { z } from "zod";

// ─── Register ─────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  body: z.object({
    fullName: z
      .string({ required_error: "Full name is required" })
      .min(3, "Full name must be at least 3 characters")
      .max(100, "Full name too long"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    role: z.enum(["STUDENT", "TEACHER", "ADMIN"], {
      required_error: "Role is required",
      invalid_type_error: "Role must be STUDENT, TEACHER, or ADMIN",
    }),
  }),
});

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address"),
    password: z.string({ required_error: "Password is required" }).min(1),
  }),
});

// ─── Refresh ──────────────────────────────────────────────────────────────────

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string({ required_error: "Refresh token is required" }),
  }),
});

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string({ required_error: "Refresh token is required" }),
  }),
});

// ─── Inferred types ───────────────────────────────────────────────────────────

export type RegisterDTO = z.infer<typeof registerSchema>["body"];
export type LoginDTO = z.infer<typeof loginSchema>["body"];
export type RefreshDTO = z.infer<typeof refreshSchema>["body"];
export type LogoutDTO = z.infer<typeof logoutSchema>["body"];

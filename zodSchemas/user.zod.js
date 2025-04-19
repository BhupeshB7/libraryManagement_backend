import { z } from "zod";

export const userZodSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must be at most 50 characters long")
    .trim(),

  email: z
    .string()
    .email()
    .max(100, "Email must be at most 100 characters long"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password must be at most 50 characters long")
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/\d/, "Must include at least one number")
    .regex(/[!@#$%^&*]/, "Must include at least one special character"),

  role: z.enum(["admin", "user"]).default("user"),
});

import { z } from "zod";

const loginBody = z.object({
    email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

    password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[a-z]/, "Must contain one lowercase letter")
    .regex(/[0-9]/, "Must contain one number")
    .regex(/[^A-Za-z0-9]/, "Must contain one special character"),
})

export const loginSchema = z.object({
  body: loginBody,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
}).strict();
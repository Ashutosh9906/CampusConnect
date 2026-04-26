import { z } from "zod";

const sendOTPBody = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
});

export const sendOTPSchema = z.object({
  body: sendOTPBody,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
}).strict();

const verifyOTPBody = z.object({
  email: z
    .string()
    .email("Invalid email address"),
  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be a 6-digit number"),
});

export const verifyOTPSchema = z.object({
  body: verifyOTPBody,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
}).strict();

const registerOTPBody = z.object({
  email: z
    .string()
    .email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[a-z]/, "Must contain one lowercase letter")
    .regex(/[0-9]/, "Must contain one number")
    .regex(/[^A-Za-z0-9]/, "Must contain one special character"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),
  prn: z
    .string()
    .length(8, "PRN must be exactly 8 characters")
    .regex(/^[A-Z0-9]+$/, "PRN must contain only uppercase letters and numbers"),
  roll: z
    .string()
    .regex(/^\d{5}$/, "Roll number must be exactly 5 digits"),
  division: z
    .string()
    .max(5, "Division must be at most 5 characters"),
});

export const registerOTPSchema = z.object({
  body: registerOTPBody,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
}).strict();

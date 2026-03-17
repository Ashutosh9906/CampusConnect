import { z } from "zod";

const googleLoginBody = z.string().email("Invalid email format");

export const googleLoginSchema = z.object({
  body: googleLoginBody,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
}).strict();

const googleRegisterBody = z.object({
  appwriteId: z
    .string()
    .regex(/^[a-z0-9]{20}$/, "Invalid Appwrite ID format"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),
});

export const googleRegisterSchema = z.object({
  body: googleRegisterBody,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
}).strict();

const RoleEnum = z.enum(["CLUB_MEMBER", "CLUB_HEAD"]);
const ClubEnum = z.enum(["CSI", "IEEE", "PICTOREAL"]);

const completeProfileBody = z.object({
  appwriteUserId: z
    .string()
    .regex(/^[a-z0-9]{20}$/, "Invalid Appwrite User ID"),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[a-z]/, "Must contain one lowercase letter")
    .regex(/[0-9]/, "Must contain one number")
    .regex(/[^A-Za-z0-9]/, "Must contain one special character"),

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

  role: RoleEnum,

  club: ClubEnum,
});

export const completeProfileSchema = z.object({
  body: completeProfileBody,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
}).strict();

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
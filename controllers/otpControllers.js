import { PrismaClient } from "@prisma/client";
import { otpTemplate } from "../templates/userTemplates.js";
import { sendEmail } from "../utilities/emailUtility.js";
import { handleResponse, hashPassword } from "../utilities/userUtility.js";

const prisma = new PrismaClient();

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ✅ SEND OTP
export const sendOTP = async (req, res) => {
  try {
    const { email } = res.locals.validated.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return handleResponse(res, 409, "Email already registered. Please login.", false);
    }

    // Delete any existing OTP for this email
    await prisma.otp.deleteMany({
      where: { email },
    });

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save OTP to database
    await prisma.otp.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });

    // Send email with OTP
    await sendEmail(email, otpTemplate(otp));

    return handleResponse(res, 200, "OTP sent to your email", true, {
      email,
      message: "Check your email for the OTP",
    });

  } catch (err) {
    console.error("Send OTP Error:", err);
    return handleResponse(res, 500, "Failed to send OTP. Please try again.", false);
  }
};

// ✅ VERIFY OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = res.locals.validated.body;

    // Find OTP record
    const otpRecord = await prisma.otp.findUnique({
      where: { email },
    });

    if (!otpRecord) {
      return handleResponse(res, 404, "OTP not found. Please request a new one.", false);
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await prisma.otp.delete({
        where: { email },
      });
      return handleResponse(res, 400, "OTP has expired. Please request a new one.", false);
    }

    // Verify OTP
    if (otpRecord.otp !== otp.toString()) {
      return handleResponse(res, 400, "Invalid OTP. Please try again.", false);
    }

    // Mark OTP as verified
    await prisma.otp.update({
      where: { email },
      data: { isVerified: true },
    });

    return handleResponse(res, 200, "OTP verified successfully", true, {
      email,
      verified: true,
    });

  } catch (err) {
    console.error("Verify OTP Error:", err);
    return handleResponse(res, 500, "Failed to verify OTP", false);
  }
};

// ✅ REGISTER WITH OTP (Create user after OTP verification)
export const registerWithOTP = async (req, res) => {
  try {
    const { email, password, name, prn, roll, division } = res.locals.validated.body;

    // Check if OTP is verified
    const otpRecord = await prisma.otp.findUnique({
      where: { email },
    });

    if (!otpRecord || !otpRecord.isVerified) {
      return handleResponse(res, 400, "Email not verified. Please verify OTP first.", false);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return handleResponse(res, 409, "User already exists. Please login.", false);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        passwordSet: true,
        prn,
        roll,
        division,
        profileComplete: true,
      },
    });

    // Delete OTP record
    await prisma.otp.delete({
      where: { email },
    });

    return handleResponse(res, 201, "Registration successful", true, {
      user,
    });

  } catch (err) {
    console.error("Register with OTP Error:", err);
    return handleResponse(res, 500, "Registration failed", false);
  }
};

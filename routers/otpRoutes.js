import { Router } from "express";
import { registerWithOTP, sendOTP, verifyOTP } from "../controllers/otpControllers.js";
import { validateRequest } from "../middlewares/parseBody.js";
import { registerOTPSchema, sendOTPSchema, verifyOTPSchema } from "../validators/otpValidationSchema.js";

const router = Router();

// Send OTP to email
router.post("/send-otp", validateRequest(sendOTPSchema), sendOTP);

// Verify OTP
router.post("/verify-otp", validateRequest(verifyOTPSchema), verifyOTP);

// Register user after OTP verification
router.post("/register", validateRequest(registerOTPSchema), registerWithOTP);

export default router;

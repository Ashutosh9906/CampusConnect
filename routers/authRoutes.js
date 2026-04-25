import { Router } from "express";
import { getCurrentUser, getUserClubs, handleCompleteProfile, handleGoogleLogin, handleGoogleRegister, handleLogin, handleLogout, handleSelectClub } from "../controllers/authControllers.js";
import { checkAuthentication } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/parseBody.js";
import { completeProfileSchema, googleLoginSchema, googleRegisterSchema, loginSchema } from "../validators/userValidationSchema.js";

const router = Router();

router.post("/google-login", validateRequest(googleLoginSchema), handleGoogleLogin);

router.post("/google-register", validateRequest(googleRegisterSchema), handleGoogleRegister);

router.post("/complete-profile", validateRequest(completeProfileSchema), handleCompleteProfile);

router.post("/login", validateRequest(loginSchema), handleLogin)

router.post("/logout", handleLogout)

router.post("/select-club", checkAuthentication, handleSelectClub)

router.get("/me", checkAuthentication, getCurrentUser);
router.get("/my-clubs", checkAuthentication, getUserClubs);

export default router;
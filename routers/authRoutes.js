import { Router } from "express";
import { getCurrentUser, getUserClubs, handleCompleteProfile, handleLogin, handleLogout, handleSelectClub } from "../controllers/authControllers.js";
import { checkAuthentication } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/parseBody.js";
import { loginSchema } from "../validators/userValidationSchema.js";

const router = Router();

router.post("/login", validateRequest(loginSchema), handleLogin)

router.post("/complete-profile", checkAuthentication, handleCompleteProfile)

router.post("/logout", handleLogout)

router.post("/select-club", checkAuthentication, handleSelectClub)

router.get("/me", checkAuthentication, getCurrentUser);
router.get("/my-clubs", checkAuthentication, getUserClubs);

export default router;
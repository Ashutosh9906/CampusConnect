import { Router } from "express";
import { validateRequest } from "../middlewares/parseBody.js";
import { checkAuthentication, checkAuthorizatioon } from "../middlewares/auth.js";
import { clubIdSchema, clubPostSchema } from "../validators/clubValidationSchema.js";
import { handleAddNewClub, handleClubRequest, handleCreateClubRequest, handleDeletClubDetails, handleDeleteClubRequest, handleGetAllClub, handleGetClubById, handleGetClubRequest, handleGetJoinedClub, handleUpdateClubDetail } from "../controllers/clubControllers.js";

const router = Router();

router.get("/", handleGetAllClub)

router.get("/:id", validateRequest(clubIdSchema), handleGetClubById)

router.post("/", validateRequest(clubPostSchema), handleAddNewClub)

router.patch("/:id", validateRequest(clubIdSchema), handleUpdateClubDetail)

router.delete("/:id", validateRequest(clubIdSchema), handleDeletClubDetails)

router.post("/request", checkAuthentication, handleCreateClubRequest)

router.get("/request", checkAuthentication, checkAuthorizatioon("CLUB_HEAD"), handleGetClubRequest)

router.post("/request/handle", checkAuthentication, authorizeClub("CLUB_HEAD"), handleClubRequest);

router.delete("/request/:requestId", checkAuthentication, handleDeleteClubRequest);

router.get("/joined", checkAuthentication, handleGetJoinedClub)

export default router;
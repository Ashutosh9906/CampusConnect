import { Router } from "express";
import { validateRequest } from "../middlewares/parseBody.js";
import { checkAuthentication, checkAuthorization } from "../middlewares/auth.js";
import { clubIdSchema, clubPostSchema } from "../validators/clubValidationSchema.js";
import { getAvailableClubs, getRequestHistory, handleAddNewClub, handleClubRequest, handleCreateClubRequest, handleDeletClubDetails, handleDeleteClubRequest, handleGetAllClub, handleGetClubById, handleGetClubRequest, handleGetJoinedClub, handleUpdateClubDetail } from "../controllers/clubControllers.js";

const router = Router();

// ✅ SPECIFIC ROUTES FIRST
router.get("/joined", checkAuthentication, handleGetJoinedClub);

router.get("/available", checkAuthentication, getAvailableClubs);

router.get("/history", checkAuthentication, getRequestHistory);

router.post("/request", checkAuthentication, handleCreateClubRequest);

router.get("/request", checkAuthentication, checkAuthorization("CLUB_HEAD"), handleGetClubRequest);

router.post("/request/handle", checkAuthentication, handleClubRequest);

router.delete("/request/:requestId", checkAuthentication, handleDeleteClubRequest);


// ✅ GENERIC ROUTES LAST
router.get("/", handleGetAllClub);

router.get("/:id", validateRequest(clubIdSchema), handleGetClubById);

router.post("/", validateRequest(clubPostSchema), handleAddNewClub);

router.patch("/:id", validateRequest(clubIdSchema), handleUpdateClubDetail);

router.delete("/:id", validateRequest(clubIdSchema), handleDeletClubDetails);

export default router;
// routes/event.routes.js

import express from "express";
import { checkAuthentication, checkAuthorization } from "../middlewares/auth.js";
import { createEvent, getAllEvents, getEventById } from "../controllers/eventControllers.js";

const router = express.Router();

// ✅ Only CLUB_HEAD can create event
router.post("/", checkAuthentication, checkAuthorization(), createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
export default router;
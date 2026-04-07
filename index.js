//pre defined dependencies
import express from "express";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

configDotenv();

// server variables
const app = express();
const PORT = process.env.PORT || 8000;

//custom imports
import errorHandling from "./middlewares/errorHandler.js";
import authRoutes from "./routers/authRoutes.js";
import clubRoutes from "./routers/clubRoutes.js";
import eventRoutes from "./routers/eventRoutes.js";

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


//custom api
app.use("/auth", authRoutes);
app.use("/club", clubRoutes);
app.use("/event", eventRoutes);

//central error handlinf system
app.use(errorHandling);

//starting the server
app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});
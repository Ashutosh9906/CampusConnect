//pre defined dependencies
import cookieParser from "cookie-parser";
import cors from "cors";
import { configDotenv } from "dotenv";
import express from "express";

configDotenv();

// server variables
const app = express();
const PORT = process.env.PORT || 8000;

//custom imports
import errorHandling from "./middlewares/errorHandler.js";
import authRoutes from "./routers/authRoutes.js";
import clubRoutes from "./routers/clubRoutes.js";
import eventRoutes from "./routers/eventRoutes.js";
import otpRoutes from "./routers/otpRoutes.js";

//middlewares
app.use(cors({
  origin: "https://campus-connect-nine-virid.vercel.app", // 👈 add https://
  credentials: true
}));
// app.use(cors({
//   origin: "https://campusconnect-3-kyzk.onrender.com",
//   credentials: true
// }));
app.use(cookieParser());
app.use(express.json());


//custom api
app.use("/auth", authRoutes);
app.use("/otp", otpRoutes);
app.use("/club", clubRoutes);
app.use("/event", eventRoutes);

//central error handlinf system
app.use(errorHandling);

//starting the server
app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});
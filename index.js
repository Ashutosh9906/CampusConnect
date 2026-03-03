//pre defined dependencies
import express from "express";
import { configDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { ID } from "node-appwrite";
import cors from "cors";

configDotenv();

// server variables
const app = express();
const PORT = process.env.PORT || 8000;
const prisma = new PrismaClient();

//custom imports
import errorHandling from "./middlewares/errorHandler.js";
import { users } from "./config/appWrite.js";
import { comparePassword, handleResponse, hashPassword } from "./utilities/userUtility.js";
import { account } from "./config/appWriteOtp.js";

//middlewares
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


//custom api
app.get("/logout", async (req, res, next) => {
  try {
    await users.deleteSession("current");
    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});

app.post("/auth/google-register", async (req, res, next) => {
  try {
    const { appwriteUserId, email, name } = req.body;

    // 🔍 Check by EMAIL (important)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists. Please use another email.",
      });
    }

    // ✅ Create new user
    const user = await prisma.user.create({
      data: {
        appwriteUserId,
        email,
        name,
        profileComplete: false,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user,
    });

  } catch (err) {
    next(err);
  }
});

app.post("/auth/complete-profile", async (req, res, next) => {
  try {
    const { appwriteUserId, name, password, prn, roll, division } = req.body;
    console.log(req.body);

    const hash = await hashPassword(password);

    const user = await prisma.user.update({
      where: { appwriteUserId },
      data: {
        name,
        passwordHash: hash,
        passwordSet: true,
        prn,
        roll,
        division,
        profileComplete: true,
      },
    });

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

app.post("/club", async (req, res, next) => {
  try {
    const { name, description, clubCordinator } = req.body;

    let existingClub = await prisma.club.findUnique({
      where: { name }
    })

    if (existingClub) {
      return res.status(409).json({
        success: false,
        message: "Club already exists.",
      });
    }

    const club = await prisma.club.create({
      data: {
        name,
        description,
        clubCordinator
      }
    })

    return res.status(201).json({
      success: true,
      message: "Club added successful",
      club,
    });    
  } catch (error) {
    next(error);
  }
})

//central error handlinf system
app.use(errorHandling);

//starting the server
app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});

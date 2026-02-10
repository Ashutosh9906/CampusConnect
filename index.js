//pre defined dependencies
import express from "express";
import { configDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

configDotenv();

// server variables
const app = express();
const PORT = process.env.PORT || 8000;
const prisma = new PrismaClient();

//custom imports
import errorHandling from "./middlewares/errorHandler.js";
import { account } from "./config/appWrite.js";
import { comparePassword, handleResponse, hashPassword } from "./utilities/userUtility.js";

//middlewares
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


//custom api
app.post("/auth/google-login", async (req, res, next) => {
  try {
    const { appwriteUserId, email, name } = req.body;

    let user = await prisma.user.findUnique({
      where: { appwriteUserId },
    });

    // If user doesn't exist → create
    if (!user) {
      user = await prisma.user.create({
        data: {
          appwriteUserId,
          email,
          name,
          profileComplete: false,
        },
      });
    }

    return res.json({
      success: true,
      profileComplete: user.profileComplete,
      user,
    });
  } catch (err) {
    next(err);
  }
});

app.post("/auth/complete-profile", async (req, res, next) => {
  try {
    const { appwriteUserId, name, password, prn, roll, division } = req.body;

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


app.post("/auth/otp/verify", async (req, res, next) => {
  try {
    const { userId, secret } = req.body;

    await account.createSession(userId, secret);

    // SUCCESS
    handleResponse(res, 200, "OTP verified successfully");

  } catch (err) {
    // FAILURE
    err.message = "Invalid or expired OTP";
    next(err);
  }
});

app.post("/auth/set-password", async (req, res, next) => {
  try {
    const { appwriteUserId, password } = req.body;

    const hash = hashPassword(password);

    await prisma.user.update({
      where: { appwriteUserId },
      data: {
        passwordHash: hash,
        passwordSet: true,
      },
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

app.post("/auth/verify-password", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return handleResponse(res, 404, "user not found")
    }

    // 2. Check if password is set
    if (!user.passwordSet || !user.passwordHash) {
      return handleResponse(res, 400, "Set password first or, perform continue with google")
    }

    // 3. Compare password
    const isValid = comparePassword(password, user.passwordHash);

    if (!isValid) {
      return handleResponse(res, 401, "Invalid Email or password");
    }

    // 4. SUCCESS (you can also create session / JWT here)
    handleResponse(res, 200, "Login successful", {
      userId: user.appwriteUserId,
      email: user.email,
      name: user.name,
    });

  } catch (error) {
    next(error);
  }
});



//central error handlinf system
app.use(errorHandling);

//starting the server
app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});

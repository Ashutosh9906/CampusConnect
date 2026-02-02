//pre defined dependencies
import express from "express";
import { configDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { ID } from "node-appwrite";
configDotenv();

// server variables
const app = express();
const PORT = process.env.PORT || 8000;
const prisma = new PrismaClient();

//custom imports
import errorHandling from "./middlewares/errorHandler.js";
import { account } from "./config/appWrite.js";
import { handleResponse, hashPassword } from "./utilities/userUtility.js";

//middlewares
app.use(express.json());

//custom api
app.get("/auth/google", (req, res) => {
  const redirectUrl =
    `${process.env.APPWRITE_ENDPOINT}/account/sessions/oauth2/google` +
    `?project=${process.env.APPWRITE_PROJECT_ID}` +
    `&success=${encodeURIComponent("http://localhost:4000/auth/success")}` +
    `&failure=${encodeURIComponent("http://localhost:4000/auth/failure")}`;

  res.redirect(redirectUrl);
});

app.get("/auth/success", async (req, res, next) => {
  try {
    const user = await account.get();

    let dbUser = await prisma.user.findUnique({
      where: { appwriteUserId: user.$id },
    })
    
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          appwriteUserId: user.$id,
          email: user.email,
          name: user.name,
        },
      });
    }

    return handleResponse(res, 200, "User verified successfully");
  } catch (error) {
    next(error);
  }
});

app.get("/auth/failure", (req, res) => {
  res.status(401).send("❌ Google login failed");
});

app.post("/auth/otp/send", async (req, res, next) => {
  try {
    const { email } = req.body;

    const token = await account.createEmailToken(
      ID.unique(),
      email
    );

    // return userId to client (needed for verification)
    res.json({
      success: true,
      userId: token.userId,
      message: `OTP sent to ${email}`,
    });
  } catch (err) {
    next(err);
  }
});

app.post("/auth/otp/verify", express.json(), async (req, res, next) => {
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

app.post("/auth/set-password", express.json(), async (req, res, next) => {
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


//central error handlinf system
app.use(errorHandling);

//starting the server
app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});

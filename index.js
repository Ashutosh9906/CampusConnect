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
import { validateRequest } from "./middlewares/parseBody.js";
import { completeProfileSchema, googleLoginSchema, googleRegisterSchema, loginSchema } from "./validators/validationSchema.js";

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

app.post("/auth/google-login", validateRequest(googleLoginSchema), async (req, res, next) => {
  try {
    const { email } = req.locals.validated.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // ❌ USER NOT FOUND → REJECT
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist. Please register first.",
      });
    }

    // ✅ USER EXISTS → LOGIN
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });

  } catch (err) {
    next(err);
  }
});

app.post("/auth/google-register", validateRequest(googleRegisterSchema), async (req, res, next) => {
  try {
    const { appwriteUserId, email, name } = req.locals.validated.body;

    // 🔍 Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // ✅ EXISTING USER → LOGIN
    if (user) {
      return res.status(200).json({
        success: true,
        message: "Login successful",
        user,
        isNewUser: false,
      });
    }

    // ✅ NEW USER → REGISTER
    user = await prisma.user.create({
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
      isNewUser: true,
    });

  } catch (err) {
    next(err);
  }
});


app.post("/auth/complete-profile", validateRequest(completeProfileSchema), async (req, res, next) => {
  try {
    const { appwriteUserId, name, password, prn, roll, division, role, club } = req.locals.validated.body;
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

    if(role == "club"){
      const clubDetails = await prisma.club.findUnique({
        where: { name: club }
      });

      if(!clubDetails){
        return res.status(404).json({
          message: "No such club exists"
        })
      }

      const existingRequest = await prisma.clubJoinRequest.findFirst({
        where: {
          userId: user.id,
          clubId: clubDetails.id,
          role: "CLUB_MEMBER",
          status: "PENDING"
        }
      });

      if(existingRequest){
        return res.status(400).json({
          message: "You already have an pending request for this club"
        })
      }

      await prisma.clubJoinRequest.create({
        data: {
          userId: user.id,
          clubId: clubDetails.id,
          role: "CLUB_MEMBER"
        }
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

app.post("/auth/login", validateRequest(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = res.locals.validated.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if(!user){
      return res.status(404).json({
        message: "User with such credentials does not exist"
      })
    }

    if(!comparePassword(password, user.passwordHash)){
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User login successfully",
      user
    });
  } catch (error) {
    next(error);
  }
})

app.post("/club", async (req, res, next) => {
  try {
    const { name, description, clubCoordinator } = req.body;

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
        clubCoordinator
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

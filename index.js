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
import { clubUpdateFilter, comparePassword, createTokenUser, handleResponse, hashPassword } from "./utilities/userUtility.js";
import { validateRequest } from "./middlewares/parseBody.js";
import { completeProfileSchema, googleLoginSchema, googleRegisterSchema, loginSchema } from "./validators/userValidationSchema.js";
import { clubIdSchema, clubPostSchema } from "./validators/clubValidationSchema.js";

//middlewares
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


//custom api
app.post("/auth/google-login", validateRequest(googleLoginSchema), async (req, res, next) => {
  try {
    const { email } = res.locals.validated.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist. Please register first.",
      });
    }

    const token = createTokenUser(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",     //while worling with frontend else use "strict"
      maxAge: 30 * 60 * 1000,
      path: "/"         //implifies that the created cookie can be accessied through all routes
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });

  } catch (err) {
    console.error("Google Register Error:", err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
});

app.post("/auth/google-register", validateRequest(googleRegisterSchema), async (req, res, next) => {
  try {
    const { appwriteUserId, email } = res.locals.validated.body;
    console.log(res.locals.validated.body);

    // 🔍 Check if user exists
    let user = await prisma.user.findUnique({
      where: { email, appwriteUserId },
    });

    // ✅ EXISTING USER → LOGIN
    if (user) {
      return res.status(409).json({
        success: false,
        message: "User Already Exist, Try Login",
        isNewUser: false,
      });
    }

    // ✅ NEW USER → REGISTER
    user = await prisma.user.create({
      data: {
        appwriteUserId,
        email,
        profileComplete: false,
      },
    });

    const token = createTokenUser(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",     //while worling with frontend else use "strict"
      maxAge: 30 * 60 * 1000,
      path: "/"         //implifies that the created cookie can be accessied through all routes
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user,
      isNewUser: true,
    });

  } catch (err) {
    // next(err);
    console.error("Google Register Error:", err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
});


app.post("/auth/complete-profile", validateRequest(completeProfileSchema), async (req, res, next) => {
  try {
    const { appwriteUserId, name, password, prn, roll, division } = res.locals.validated.body;
    console.log(res.body);

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

    const token = createTokenUser(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",     //while worling with frontend else use "strict"
      maxAge: 30 * 60 * 1000,
      path: "/"         //implifies that the created cookie can be accessied through all routes
    });

    res.status(201).json({
      success: true,
      message: "user register successfully",
      user
    });
  } catch (err) {
    console.error("Google Register Error:", err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
});

app.post("/auth/login", validateRequest(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = res.locals.validated.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });
    console.log(user);


    if (!user) {
      return res.status(404).json({
        message: "Invalid credentials"
      })
    }

    if (!comparePassword(password, user.passwordHash)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials"
      });
    }

    const token = createTokenUser(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",     //while worling with frontend else use "strict"
      maxAge: 30 * 60 * 1000,
      path: "/"         //implifies that the created cookie can be accessied through all routes
    });

    return res.status(200).json({
      success: true,
      message: "User login successfully",
      user
    });
  } catch (error) {
    console.error("Google Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
})

app.post("/auth/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    })

    console.log("User logout successful");
    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Enable to delete auth cookie", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
})

app.get("/club", async (req, res, next) => {
  try {
    const clubDetails = await prisma.club.findMany();
    return res.status(200).json({
      success: true,
      message: "Club details fetchedd successfully",
      clubDetails
    });
  } catch (error) {
    console.error("Getting club details failed", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
})

app.get("/club/:id", validateRequest(clubIdSchema), async (req, res, next) => {
  try {
    const clubId = res.locals.validated.params.id;

    const clubDetails = await prisma.club.findUnique({
      where: { id: clubId }
    })

    if (!clubDetails) {
      return res.status(409).json({
        success: false,
        message: "Club already exists.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Club details fetched successfully",
      clubDetails
    });
  } catch (error) {
    console.error("Getting club details by ID failed", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
})

app.post("/club", validateRequest(clubPostSchema), async (req, res, next) => {
  try {
    const { name, description, clubCoordinator } = res.locals.validated.body;

    const existingClub = await prisma.club.findUnique({
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
    console.error("Club insertion failed", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
})

app.patch("/club/:id", validateRequest(clubIdSchema), async (req, res, next) => {
  try {
    const clubId = res.locals.validated.params.id;

    const clubExist = await prisma.club.findUnique({
      where: { id: clubId }
    });
    if(!clubExist){
      return res.status(404).json({
        success: false,
        message: "Invalid club ID",
      })
    }

    const updateBody = clubUpdateFilter(req.body);

    const updatedClub = await prisma.club.update({
      where: { id: clubId },
      data: updateBody
    });

    return res.status(200).json({
      success: true,
      message: "Club details updated successful",
      updatedClub,
    })
  } catch (error) {
    console.error("Club updation failed", error);
    
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
})

app.delete("/club/:id", validateRequest(clubIdSchema), async (req, res, next) => {
  try {
    const clubId = res.locals.validated.params.id;

    const clubExist = await prisma.club.findUnique({
      where: { id: clubId }
    });
    if(!clubExist){
      return res.status(404).json({
        success: false,
        message: "Invalid club ID",
      })
    }

    await prisma.club.delete({
      where: { id: clubId }
    });

    return res.status(200).json({
      success: true,
      message: "Club details deleted successfully"
    });
  } catch (error) {
    console.error("Club updation failed", error);
    
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
})

//central error handlinf system
app.use(errorHandling);

//starting the server
app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});
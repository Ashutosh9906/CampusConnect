import { PrismaClient } from "@prisma/client";

import { comparePassword, createTokenUser, handleResponse, hashPassword } from "../utilities/userUtility.js";

const prisma = new PrismaClient();


export const handleGoogleLogin = async (req, res, next) => {
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
}

export const handleGoogleRegister = async (req, res, next) => {
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
}

export const handleCompleteProfile = async (req, res, next) => {
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
}

export const handleLogin = async (req, res, next) => {
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

    const isMatch = await comparePassword(password, user.passwordHash);

    if (!isMatch) {
      return handleResponse(res, 400, "Invalid Credentials", false);
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
}

export const handleLogout = (req, res) => {
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
}

export const handleSelectClub = async (req, res) => {
  try {
    const userId = res.locals.user.userId;
    const { clubId } = req.body;

    if (!clubId) {
      return handleResponse(res, 400, "Club ID is required", false);
    }

    const membership = await prisma.userClubRole.findFirst({
      where: {
        userId,
        clubId
      }
    });

    if (!membership) {
      return handleResponse(res, 403, "You are not a member of this club", false);
    }

    const newToken = createTokenUser(userId, clubId);

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 60 * 1000
    });

    return handleResponse(res, 200, "Active club selected", true, {
      clubId
    });

  } catch (error) {
    return handleResponse(res, 500, "Failed to select club", false);
  }
}
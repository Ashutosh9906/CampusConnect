import { PrismaClient } from "@prisma/client";

import { comparePassword, createTokenUser, handleResponse, hashPassword } from "../utilities/userUtility.js";

const prisma = new PrismaClient();

export const handleCompleteProfile = async (req, res) => {
  try {
    const userId = res.locals.user.userId;
    const { name, password, prn, roll, division } = req.body;

    // Validate inputs
    if (!name || !password || !prn || !roll || !division) {
      return handleResponse(res, 400, "All fields are required", false);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Update user profile
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        passwordHash,
        passwordSet: true,
        prn,
        roll,
        division,
        profileComplete: true,
      },
    });

    const token = createTokenUser(user.id, null);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 12 * 60 * 60 * 1000,
      path: "/",
    });

    return handleResponse(res, 201, "Profile completed successfully", true, {
      user,
    });
  } catch (err) {
    console.error("Complete Profile Error:", err);
    return handleResponse(res, 500, "Failed to complete profile", false);
  }
};

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
      secure: true,
      sameSite: "None",
      maxAge: 12 * 60 * 60 * 1000,
      path: "/"
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

    // ✅ STUDENT MODE
    if (!clubId) {
      const newToken = createTokenUser(userId, null);

      res.cookie("token", newToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 12 * 60 * 60 * 1000,
        path: "/"
      });

      return handleResponse(res, 200, "Student mode selected", true, {
        clubId: null,
        clubRole: "STUDENT"
      });
    }

    // ✅ CLUB MODE
    const membership = await prisma.userClubRole.findFirst({
      where: {
        userId,
        clubId
      },
      include: { club: true }
    });

    if (!membership) {
      return handleResponse(res, 403, "You are not a member of this club", false);
    }

    const newToken = createTokenUser(userId, clubId);

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 12 * 60 * 60 * 1000,
      path: "/"
    });

    return handleResponse(res, 200, "Active club selected", true, {
      clubId,
      clubName: membership.club.name,
      clubRole: membership.role,
    });

  } catch (error) {
    return handleResponse(res, 500, "Failed to select club", false);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = res.locals.user.userId;
    const activeClubId = res.locals.user.activeClubId || null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        appwriteUserId: true,
        email: true,
        name: true,
        profileComplete: true,
        prn: true,
        roll: true,
        division: true,
        role: true
      }
    });

    let clubRole = null;
    let activeClubName = null;

    if (activeClubId) {
      const membership = await prisma.userClubRole.findFirst({
        where: {
          userId,
          clubId: activeClubId
        },
        include: { club: true }
      });

      if (membership) {
        clubRole = membership.role;
        activeClubName = membership.club.name;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Current user fetched",
      user: {
        ...user,
        activeClubId,
        clubRole,
        role: activeClubName || user.role,
      }
    });
  } catch (error) {
    return handleResponse(res, 500, "Failed to fetch current user", false);
  }
};

export const getUserClubs = async (req, res) => {
  try {
    const userId = res.locals.user.userId;

    const clubs = await prisma.userClubRole.findMany({
      where: { userId },
      include: {
        club: true
      }
    });

    return handleResponse(res, 200, "Clubs fetched", true, clubs);
  } catch (error) {
    return handleResponse(res, 500, "Error fetching clubs", false);
  }
};

//somthing to test te 
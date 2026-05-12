import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { handleResponse } from "../utilities/userUtility.js";

const prisma = new PrismaClient();

export function checkAuthentication(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User is unauthenticated",
      });
    }

    const secret = process.env.SECRET;
    if (!secret) {
      throw new Error("JWT SECRET not defined");
    }

    const decoded = jwt.verify(token, secret);

    res.locals.user = decoded;
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again.",
        code: "TOKEN_EXPIRED"
      });
    }
    
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

export const checkAuthorization = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const userId = res.locals.user.userId;
      const clubId = res.locals.user.activeClubId;

      // ✅ STUDENT MODE
      if (!clubId) {
        res.locals.club = null;
        res.locals.role = "STUDENT";

        // if route requires specific club role → block
        if (requiredRole && requiredRole !== "STUDENT") {
          return handleResponse(res, 403, "Club context required", false);
        }

        return next();
      }

      // ✅ CLUB MODE
      const membership = await prisma.userClubRole.findFirst({
        where: { userId, clubId },
        include: { club: true }
      });

      if (!membership) {
        return handleResponse(res, 403, "Not a member of this club", false);
      }

      if (requiredRole && membership.role !== requiredRole) {
        return handleResponse(res, 403, "Insufficient permissions", false);
      }

      res.locals.club = membership.club;
      res.locals.role = membership.role;

      next();

    } catch (error) {
      return handleResponse(res, 500, "Authorization failed", false);
    }
  };
};
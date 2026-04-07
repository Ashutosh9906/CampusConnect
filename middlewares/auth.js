import jwt from "jsonwebtoken";
import { handleResponse } from "../utilities/userUtility.js";

export function checkAuthentication(req, res, next){
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                success: false,
                message: "User is unAuthentaicated",
            })
        } 
        const secret = process.env.SECRET ?? "TEmp154"
        const decoded = jwt.verify(token, secret);
        res.locals.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
}

export const checkAuthorizatioon = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const userId = res.locals.user.userId;
      const clubId = res.locals.user.activeClubId;

      if (!clubId) {
        return handleResponse(res, 400, "No club selected", false);
      }

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

      // attach useful data
      res.locals.club = membership.club;
      res.locals.role = membership.role;

      next();
    } catch (error) {
      return handleResponse(res, 500, "Authorization failed", false);
    }
  };
};
import jwt from "jsonwebtoken";
import { hash, compare } from "bcryptjs";

export const handleResponse = (res, status, message, success, data = null) => {
    return res.status(status).json({
      success,
      message,
      data
    });
};

export async function hashPassword(password) {
    const saltRounds = 10;
    const hashPassword = await hash(password, saltRounds);
    return hashPassword;
}

export async function comparePassword(userPass, hashPass) {
    const isMatch = await compare(userPass, hashPass);
    return isMatch;
}

export function createTokenUser(userId, activeClubId = null) {
  const payload = {
    userId,
  };

  // add club only if provided
  if (activeClubId) {
    payload.activeClubId = activeClubId;
  }

  const token = jwt.sign(
    payload,
    process.env.SECRET,
    { expiresIn: "30m" }
  );

  return token;
}

export function clubUpdateFilter(body){
    const updateBody = {};
    if(body.name) updateBody.name = body.name;
    if(body.description) updateBody.description = body.description;
    if(body.clubCoordinator) updateBody.clubCoordinator = body.clubCoordinator;

    return updateBody;
}
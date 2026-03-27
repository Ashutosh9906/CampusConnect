import jwt from "jsonwebtoken";
import { hash, compare } from "bcryptjs";

export const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        message,
        data,
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

export function createTokenUser(id, role) {
    const token = jwt.sign(
        { id, role },
        process.env.SECRET,
        { expiresIn: "30m" } // 🔥 change here
    );
    return token;
}
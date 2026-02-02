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
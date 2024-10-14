import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        // expiresIn: process.env.JWT_EXPIRE,
        expiresIn: "15d",
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        httpOnly: true, // cookie inaccessible by client-side JavaScript (prevents XSS: cross-site scripting attacks)
        sameSite: "strict", // CSRF (cross-site request forgery) attacks protection
        secure: process.env.NODE_ENV !== "development", // cookie sent only over HTTPS in production
    });
};

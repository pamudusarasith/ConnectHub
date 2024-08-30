import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

function createToken(user) {
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
    return token;
}

export { createToken };
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export const generateAccessToken = (userId: string) => {
    return jwt.sign({ userId }, ENV.ACCESS_TOKEN_SECRET, { expiresIn: ENV.ACCESS_TOKEN_EXPIRY });
};

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, ENV.REFRESH_TOKEN_SECRET, { expiresIn: ENV.REFRESH_TOKEN_EXPIRY });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, ENV.REFRESH_TOKEN_SECRET);
};

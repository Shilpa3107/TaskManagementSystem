import prisma from "../../utils/prisma";
import { hashPassword, comparePassword } from "../../utils/bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import { RegisterInput, LoginInput } from "./auth.types";

export const registerUser = async (data: RegisterInput) => {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw { statusCode: 400, message: "User already exists" };

    const hashedPassword = await hashPassword(data.password);

    // Note: refreshToken is optional in DB, can be null initially
    return prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
        },
        select: { id: true, email: true, createdAt: true },
    });
};

export const validateUser = async (data: LoginInput) => {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw { statusCode: 401, message: "Invalid credentials" };

    const isValid = await comparePassword(data.password, user.password);
    if (!isValid) throw { statusCode: 401, message: "Invalid credentials" };

    return user;
};

export const generateTokens = async (userId: string) => {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken },
    });

    return { accessToken, refreshToken };
};

export const refreshAccessToken = async (token: string) => {
    // This logic needs to verify the token, check DB, etc. 
    // Simplified for now based on prompt.
    // Real implementation would verify token first in controller or here.
    // Assuming token is valid JWT struct, we need to verify signature and db match.
    // See controller.
    return {};
};

export const logoutUser = async (userId: string) => {
    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
    });
};

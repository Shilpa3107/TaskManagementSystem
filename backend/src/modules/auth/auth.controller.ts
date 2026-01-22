import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { RegisterSchema, LoginSchema } from "./auth.types";
import { verifyRefreshToken, generateAccessToken } from "../../utils/token";
import prisma from "../../utils/prisma";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = RegisterSchema.parse(req.body);
        const user = await authService.registerUser(data);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = LoginSchema.parse(req.body);
        const user = await authService.validateUser(data);
        const tokens = await authService.generateTokens(user.id);
        res.json(tokens);
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw { statusCode: 400, message: "Refresh Token required" };

        const decoded = verifyRefreshToken(refreshToken) as any;
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!user || user.refreshToken !== refreshToken) {
            throw { statusCode: 403, message: "Invalid Refresh Token" };
        }

        const accessToken = generateAccessToken(user.id);
        res.json({ accessToken });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Assuming auth middleware runs before this and attaches userId
        // But logout usually receives userId from the token? 
        // Or we can pass userId in body? 
        // Prompt says: "Invalidate refresh token in DB".
        // We need userId. We can get it from the access token if we require auth.
        // Let's assume authenticateJWT is used on this route.
        const userId = (req as any).userId;
        if (userId) {
            await authService.logoutUser(userId);
        }
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

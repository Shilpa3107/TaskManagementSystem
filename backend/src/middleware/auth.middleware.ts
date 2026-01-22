import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export interface AuthRequest extends Request {
    userId?: string;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    console.log(`[AuthMiddleware] ${req.method} ${req.path}`);
    console.log(`[AuthMiddleware] Header: ${authHeader}`);

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, ENV.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log(`[AuthMiddleware] Token verify error: ${err.message}`);
                return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
            }

            req.userId = (user as any).userId;
            console.log(`[AuthMiddleware] Success for UserID: ${req.userId}`);
            next();
        });
    } else {
        console.log(`[AuthMiddleware] No token provided`);
        res.status(401).json({ message: "Unauthorized: No token provided" });
    }
};

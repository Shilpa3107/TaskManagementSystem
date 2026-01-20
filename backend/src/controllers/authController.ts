import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

const generateAccessToken = (user: { id: string; email: string }) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
};

const generateRefreshToken = (user: { id: string; email: string }) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { id: string; email: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }

        const accessToken = generateAccessToken(user);
        res.json({ accessToken });
    } catch (error) {
        res.status(403).json({ error: 'Invalid refresh token' });
    }
};

export const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { id: string; email: string };
        await prisma.user.update({
            where: { id: decoded.id },
            data: { refreshToken: null },
        });
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

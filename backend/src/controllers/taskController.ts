import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import prisma from '../utils/prisma';

export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        const { status, search, page = '1', limit = '10' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const where: any = { userId: req.user!.id };
        if (status) where.status = status;
        if (search) {
            where.OR = [
                { title: { contains: String(search) } },
                { description: { contains: String(search) } },
            ];
        }

        const tasks = await prisma.task.findMany({
            where,
            skip,
            take: Number(limit),
            orderBy: { createdAt: 'desc' },
        });

        const total = await prisma.task.count({ where });

        res.json({
            tasks,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description } = req.body;
        if (!title) return res.status(400).json({ error: 'Title is required' });

        const task = await prisma.task.create({
            data: {
                title,
                description,
                userId: req.user!.id,
            },
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
    try {
        const task = await prisma.task.findFirst({
            where: { id: req.params.id, userId: req.user!.id },
        });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, status } = req.body;
        const task = await prisma.task.findFirst({
            where: { id: req.params.id, userId: req.user!.id },
        });

        if (!task) return res.status(404).json({ error: 'Task not found' });

        const updatedTask = await prisma.task.update({
            where: { id: req.params.id },
            data: { title, description, status },
        });

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const task = await prisma.task.findFirst({
            where: { id: req.params.id, userId: req.user!.id },
        });

        if (!task) return res.status(404).json({ error: 'Task not found' });

        await prisma.task.delete({ where: { id: req.params.id } });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const toggleTask = async (req: AuthRequest, res: Response) => {
    try {
        const task = await prisma.task.findFirst({
            where: { id: req.params.id, userId: req.user!.id },
        });

        if (!task) return res.status(404).json({ error: 'Task not found' });

        const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
        const updatedTask = await prisma.task.update({
            where: { id: req.params.id },
            data: { status: newStatus },
        });

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

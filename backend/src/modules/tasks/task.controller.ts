import { Request, Response, NextFunction } from "express";
import * as taskService from "./task.service";
import { CreateTaskSchema, UpdateTaskSchema, TaskQuerySchema } from "./task.types";

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        const data = CreateTaskSchema.parse(req.body);
        const task = await taskService.createTask(userId, data);
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        const query = TaskQuerySchema.parse(req.query);
        const result = await taskService.getTasks(userId, query);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        const task = await taskService.getTaskById(userId, req.params.id);
        res.json(task);
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        const data = UpdateTaskSchema.parse(req.body);
        const task = await taskService.updateTask(userId, req.params.id, data);
        res.json(task);
    } catch (error) {
        next(error);
    }
};

export const toggleTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        const task = await taskService.toggleTaskStatus(userId, req.params.id);
        res.json(task);
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        await taskService.deleteTask(userId, req.params.id);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

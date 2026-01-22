import prisma from "../../utils/prisma";
import { getPagination } from "../../utils/pagination";
import { CreateTaskInput, UpdateTaskInput } from "./task.types";
import { Prisma } from "@prisma/client";

export const createTask = async (userId: string, data: CreateTaskInput) => {
    return prisma.task.create({
        data: {
            ...data,
            userId,
            status: false,
        },
    });
};

export const getTasks = async (userId: string, query: any) => {
    const page = parseInt(query.page || "1");
    const limit = parseInt(query.limit || "10");
    const { skip, take } = getPagination(page, limit);

    const where: Prisma.TaskWhereInput = { userId };

    if (query.status !== undefined) {
        where.status = query.status === 'true';
    }

    if (query.search) {
        where.title = { contains: query.search }; // Remove mode: 'insensitive' for SQLite compatibility if needed, but keeping simple
    }

    const [tasks, total] = await Promise.all([
        prisma.task.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: "desc" },
        }),
        prisma.task.count({ where }),
    ]);

    return { tasks, total, page, totalPages: Math.ceil(total / limit) };
};

export const getTaskById = async (userId: string, taskId: string) => {
    const task = await prisma.task.findFirst({
        where: { id: taskId, userId },
    });
    if (!task) throw { statusCode: 404, message: "Task not found" };
    return task;
};

export const updateTask = async (userId: string, taskId: string, data: UpdateTaskInput) => {
    await getTaskById(userId, taskId); // Ensure ownership
    return prisma.task.update({
        where: { id: taskId },
        data,
    });
};

export const toggleTaskStatus = async (userId: string, taskId: string) => {
    const task = await getTaskById(userId, taskId);
    return prisma.task.update({
        where: { id: taskId },
        data: { status: !task.status },
    });
};

export const deleteTask = async (userId: string, taskId: string) => {
    await getTaskById(userId, taskId); // Ensure ownership
    return prisma.task.delete({
        where: { id: taskId },
    });
};

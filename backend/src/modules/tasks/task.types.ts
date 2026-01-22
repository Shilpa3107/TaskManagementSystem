import { z } from "zod";

export const CreateTaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
});

export const UpdateTaskSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
});

export const TaskQuerySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.string().optional(), // "true" or "false"
    search: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

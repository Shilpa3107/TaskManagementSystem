"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
    onSubmit: (data: TaskFormData) => Promise<void>;
    initialData?: { title: string; description?: string } | null;
    isLoading?: boolean;
    onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData, isLoading, onCancel }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: initialData || { title: "", description: "" },
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset({ title: "", description: "" });
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                    {...register("title")}
                    className="input-field"
                    placeholder="What needs to be done?"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                <textarea
                    {...register("description")}
                    className="input-field min-h-[100px]"
                    placeholder="Add details..."
                />
            </div>

            <div className="flex justify-end gap-2">
                {onCancel && (
                    <button type="button" onClick={onCancel} className="btn bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        Cancel
                    </button>
                )}
                <button type="submit" disabled={isLoading} className="btn btn-primary">
                    {isLoading ? "Saving..." : (initialData ? "Update Task" : "Add Task")}
                </button>
            </div>
        </form>
    );
};

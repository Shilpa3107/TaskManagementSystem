"use client";

import React from "react";
import { Task } from "@/services/task.service";
import { CheckCircle, Circle, Trash2, Edit2, Clock } from "lucide-react";
import { clsx } from "clsx";

interface TaskCardProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete, onEdit }) => {
    return (
        <div className={clsx("card flex flex-col justify-between gap-4 transition-all hover:border-primary/50", task.status && "opacity-75")}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className={clsx("text-lg font-semibold", task.status && "line-through text-muted-foreground")}>
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className="mt-2 text-sm text-muted-foreground">{task.description}</p>
                    )}
                </div>
                <button
                    onClick={() => onToggle(task.id)}
                    className={clsx("p-2 rounded-full transition-colors", task.status ? "text-green-500 hover:bg-green-500/10" : "text-gray-400 hover:text-primary hover:bg-primary/10")}
                >
                    {task.status ? <CheckCircle size={24} /> : <Circle size={24} />}
                </button>
            </div>

            <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/50">
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Clock size={12} />
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 rounded hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-2 rounded hover:bg-red-500/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

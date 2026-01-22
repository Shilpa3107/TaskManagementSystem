"use client";

import { useState, useEffect, useCallback } from "react";
import * as taskService from "../services/task.service";
import { Task } from "../services/task.service";

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [filters, setFilters] = useState<taskService.TaskFilters>({ page: 1, limit: 10 });

    const fetchTasks = useCallback(async (currentFilters = filters) => {
        setLoading(true);
        try {
            const data = await taskService.getTasks(currentFilters);
            setTasks(data.tasks);
            setPagination({ page: data.page, totalPages: data.totalPages });
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const createTask = async (data: { title: string; description?: string }) => {
        try {
            await taskService.createTask(data);
            fetchTasks(); // Refresh list
        } catch (err: any) {
            throw err;
        }
    };

    const updateTask = async (id: string, data: { title?: string; description?: string }) => {
        await taskService.updateTask(id, data);
        fetchTasks();
    };

    const toggleTask = async (id: string) => {
        await taskService.toggleTaskStatus(id);
        fetchTasks();
    };

    const deleteTask = async (id: string) => {
        await taskService.deleteTask(id);
        fetchTasks();
    };

    const updateFilters = (newFilters: Partial<taskService.TaskFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 })); // Reset to page 1 on filter change
    };

    const setPage = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    return {
        tasks,
        loading,
        error,
        pagination,
        createTask,
        updateTask,
        toggleTask,
        deleteTask,
        updateFilters,
        setPage,
        refresh: fetchTasks
    };
};

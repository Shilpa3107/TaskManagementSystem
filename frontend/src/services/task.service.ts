import api from "./api";

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: boolean;
    createdAt: string;
}

export interface TaskFilters {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export const getTasks = async (filters: TaskFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
};

export const createTask = async (data: { title: string; description?: string }) => {
    const response = await api.post("/tasks", data);
    return response.data;
};

export const updateTask = async (id: string, data: { title?: string; description?: string }) => {
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data;
};

export const toggleTaskStatus = async (id: string) => {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data;
};

export const deleteTask = async (id: string) => {
    await api.delete(`/tasks/${id}`);
};

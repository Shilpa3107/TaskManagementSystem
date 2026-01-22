"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/app/components/TaskCard";
import { TaskForm } from "@/app/components/TaskForm";
import { SearchBar } from "@/app/components/SearchBar";
import { Filter } from "@/app/components/Filter";
import { Plus, LogOut, Loader2, X } from "lucide-react";
import { Task } from "@/services/task.service";
import toast from "react-hot-toast";

export default function DashboardPage() {
    const { logout } = useAuth();
    const {
        tasks,
        loading,
        createTask,
        updateTask,
        toggleTask,
        deleteTask,
        updateFilters,
        pagination,
        setPage
    } = useTasks();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [currentFilter, setCurrentFilter] = useState("");

    const handleCreate = async (data: any) => {
        try {
            await createTask(data);
            toast.success("Task created successfully");
            setIsModalOpen(false);
        } catch (e) {
            toast.error("Failed to create task");
        }
    };

    const handleUpdate = async (data: any) => {
        if (!editingTask) return;
        try {
            await updateTask(editingTask.id, data);
            toast.success("Task updated");
            setEditingTask(null);
            setIsModalOpen(false);
        } catch (e) {
            toast.error("Failed to update task");
        }
    };

    const handleToggle = async (id: string) => {
        try {
            await toggleTask(id);
        } catch (e) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this task?")) {
            try {
                await deleteTask(id);
                toast.success("Task deleted");
            } catch (e) {
                toast.error("Failed to delete task");
            }
        }
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const openEditModal = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleFilterChange = (val: string) => {
        setCurrentFilter(val);
        updateFilters({ status: val === "" ? undefined : val });
    };

    const handleSearch = (query: string) => {
        updateFilters({ search: query });
    };

    return (
        <div className="min-h-screen gradient-bg text-foreground p-4 sm:p-8">
            {/* Header */}
            <header className="max-w-5xl mx-auto flex items-center justify-between mb-8 animate-fade-in">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                    TaskFlow
                </h1>
                <button onClick={logout} className="btn bg-secondary/50 text-muted-foreground hover:bg-destructive/10 hover:text-destructive gap-2 text-sm">
                    <LogOut size={16} /> Logout
                </button>
            </header>

            <main className="max-w-5xl mx-auto space-y-6">
                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
                    <div className="w-full sm:w-auto flex-1 max-w-md">
                        <SearchBar onSearch={handleSearch} />
                    </div>
                    <div className="flex w-full sm:w-auto items-center gap-3 justify-between sm:justify-end">
                        <Filter currentFilter={currentFilter} onFilterChange={handleFilterChange} />
                        <button onClick={openCreateModal} className="btn btn-primary gap-2 shadow-lg shadow-primary/20">
                            <Plus size={18} /> New Task
                        </button>
                    </div>
                </div>

                {/* Task List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                    {loading && tasks.length === 0 ? (
                        <div className="col-span-full flex justify-center py-20 text-muted-foreground">
                            <Loader2 className="animate-spin mr-2" /> Loading tasks...
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-muted-foreground border border-dashed border-border rounded-xl bg-card/30">
                            <p>No tasks found. Create one to get started!</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggle={handleToggle}
                                onDelete={handleDelete}
                                onEdit={openEditModal}
                            />
                        ))
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => setPage(pagination.page - 1)}
                            className="btn bg-secondary text-sm disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="flex items-center text-sm text-muted-foreground">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <button
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() => setPage(pagination.page + 1)}
                            className="btn bg-secondary text-sm disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="glass w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-semibold mb-6">
                            {editingTask ? "Edit Task" : "Create New Task"}
                        </h2>

                        <TaskForm
                            onSubmit={editingTask ? handleUpdate : handleCreate}
                            initialData={editingTask}
                            isLoading={loading} // reusing loading state might be tricky if fetching tasks in background, but okay for now
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

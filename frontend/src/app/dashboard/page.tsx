'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Search,
    CheckCircle2,
    Circle,
    Trash2,
    LogOut,
    LayoutDashboard,
    Filter,
    MoreVertical
} from 'lucide-react';
import api from '@/lib/api';

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'TODO' | 'DONE';
    createdAt: string;
}

export default function DashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const router = useRouter();

    const fetchTasks = async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (statusFilter) params.append('status', statusFilter);

            const res = await api.get(`/tasks?${params.toString()}`);
            setTasks(res.data.tasks);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [search, statusFilter]);

    const toggleTask = async (id: string) => {
        try {
            await api.patch(`/tasks/${id}/toggle`);
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTask = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/tasks', newTask);
            setNewTask({ title: '', description: '' });
            setShowAddModal(false);
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            await api.post('/auth/logout', { refreshToken });
        } catch (err) {
            console.error(err);
        } finally {
            localStorage.clear();
            router.push('/login');
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200">
            {/* Sidebar / Nav */}
            <nav className="fixed top-0 left-0 right-0 h-16 glass border-b border-white/5 z-50 px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-primary p-2 rounded-lg">
                        <LayoutDashboard size={20} className="text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">TaskFlow</span>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </nav>

            <main className="pt-24 pb-12 px-6 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Your Tasks</h2>
                        <p className="text-slate-400">Keep track of your productivity and goals</p>
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn btn-primary gap-2 h-12 px-6 shadow-lg shadow-primary/20"
                    >
                        <Plus size={20} />
                        <span>Create New Task</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="input-field pl-10 h-11"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <select
                                className="input-field pl-10 h-11 pr-8 appearance-none bg-[#1e293b]"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="TODO">To Do</option>
                                <option value="DONE">Completed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Task List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="card glass text-center py-20 animate-fade-in">
                        <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={32} className="text-slate-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
                        <p className="text-slate-400 max-w-xs mx-auto">
                            {search || statusFilter ? 'Try adjusting your filters' : 'Start by creating your first task to stay organized!'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 animate-fade-in">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`card glass group hover:border-primary/30 transition-all duration-300 flex items-center gap-4 ${task.status === 'DONE' ? 'opacity-70' : ''}`}
                            >
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className={`flex-shrink-0 transition-colors ${task.status === 'DONE' ? 'text-primary' : 'text-slate-600 hover:text-slate-400'}`}
                                >
                                    {task.status === 'DONE' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-semibold text-lg truncate ${task.status === 'DONE' ? 'line-through text-slate-500' : 'text-white'}`}>
                                        {task.title}
                                    </h4>
                                    {task.description && (
                                        <p className={`text-sm truncate ${task.status === 'DONE' ? 'text-slate-600' : 'text-slate-400'}`}>
                                            {task.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="p-2 text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="card glass w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-bold text-white mb-6">Create New Task</h3>
                        <form onSubmit={addTask} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Title</label>
                                <input
                                    autoFocus
                                    className="input-field"
                                    placeholder="Task title"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Description (Optional)</label>
                                <textarea
                                    className="input-field min-h-[100px] py-3"
                                    placeholder="What needs to be done?"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="btn bg-slate-800 hover:bg-slate-700 text-white flex-1"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary flex-1">
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

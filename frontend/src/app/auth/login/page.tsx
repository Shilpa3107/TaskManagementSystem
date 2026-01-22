"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        try {
            await login(data);
            toast.success("Welcome back!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center gradient-bg p-4 relative">
            {/* Decorative circles */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="glass w-full max-w-md p-8 rounded-2xl animate-fade-in shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-muted-foreground mt-2">Sign in to manage your tasks</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 ml-1 text-muted-foreground">Email</label>
                        <input
                            {...register("email")}
                            className="input-field bg-background/50 focus:bg-background/80"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 ml-1 text-muted-foreground">Password</label>
                        <input
                            type="password"
                            {...register("password")}
                            className="input-field bg-background/50 focus:bg-background/80"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full mt-6 py-3 text-base shadow-lg shadow-primary/20"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/auth/register" className="text-primary hover:text-primary/80 font-medium hover:underline">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
}

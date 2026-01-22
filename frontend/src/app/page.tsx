"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (isAuthenticated) {
                router.push("/dashboard");
            } else {
                router.push("/auth/login");
            }
        }
    }, [isAuthenticated, loading, router]);

    return (
        <div className="min-h-screen flex items-center justify-center gradient-bg text-foreground">
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-4xl font-bold">TaskFlow</h1>
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    );
}

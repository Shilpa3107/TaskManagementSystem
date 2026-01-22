"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as authService from "../services/auth.service";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if token exists on mount
        const token = localStorage.getItem("accessToken");
        setIsAuthenticated(!!token);
        setLoading(false);
    }, []);

    const login = async (data: any) => {
        const tokens = await authService.login(data);
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        setIsAuthenticated(true);
        router.push("/dashboard");
    };

    const register = async (data: any) => {
        await authService.register(data);
        // Auto login or redirect to login? Prompt says "Return success", so maybe user needs to login.
        // Flow 4.1 says Register -> Return success.
        // I'll redirect to login.
        router.push("/auth/login");
    };

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
        router.push("/auth/login");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};

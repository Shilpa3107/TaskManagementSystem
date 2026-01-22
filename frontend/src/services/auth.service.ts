import api from "./api";

export interface User {
    id: string;
    email: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

export const login = async (data: any): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

export const register = async (data: any) => {
    const response = await api.post("/auth/register", data);
    return response.data;
};

export const logout = async () => {
    // We can try to notify backend, but client side cleanup is most important
    try {
        await api.post("/auth/logout");
    } catch (e) {
        console.error("Logout error", e);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

export const getCurrentUser = () => {
    // This is a placeholder. In a real app we might decode the token 
    // or fetch /auth/me. For now, we'll return null or implemented in Context.
    // If using JWT decode, we can decode here.
    return null;
};

import axios from "axios";

// Create an Axios instance
const api = axios.create({
    baseURL: "http://localhost:5000", // Adjust backend URL if needed
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to attach the access token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 (Unauthorized) and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    throw new Error("No refresh token");
                }

                const { data } = await axios.post("http://localhost:5000/auth/refresh", {
                    refreshToken,
                });

                localStorage.setItem("accessToken", data.accessToken);

                // Update the header of the original request
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login or clear storage
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/auth/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

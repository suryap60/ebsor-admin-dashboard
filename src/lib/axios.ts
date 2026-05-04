import axios from "axios";
import { toast } from "react-toastify";

// MAIN API (with interceptors)
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

// CLEAN INSTANCE (NO interceptors)
const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});


//  REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  // const token =
  //   typeof window !== "undefined"
  //     ? localStorage.getItem("accessToken")
  //     : null;

  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.request.use((config) => {
  config.headers["Cache-Control"] = "no-cache";
  return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Access token expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // USE CLEAN INSTANCE (IMPORTANT)
        const res = await refreshApi.post("/auth/refresh", {
          refreshToken,
        });

        const newAccessToken = res.data.data.accessToken;

        console.log("NEW TOKEN:", newAccessToken);

        // Save token
        localStorage.setItem("accessToken", newAccessToken);

        // Update default header
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        // Update original request
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        // Retry request
        return api(originalRequest);

      } catch (refreshError) {
        console.log("REFRESH FAILED:", refreshError);
        toast.error("Session expired. Please login again ");

        localStorage.clear();
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    const status = error.response?.status;
    const message =
      error.response?.data?.message || "Something went wrong";

    // Forbidden
    if (status === 403) {
      toast.error("You are not allowed to perform this action");
    }

    // Server error
    else if (status === 500) {
      toast.error("Server error. Try again later");
    }

    // Other errors (optional)
    else if (status && status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }

  
);

export default api;
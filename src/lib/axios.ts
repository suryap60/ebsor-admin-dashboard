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

// STATE FOR CONCURRENT REQUESTS
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

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

        console.log("NEW TOKEN GENERATED:", newAccessToken);

        // Save token
        localStorage.setItem("accessToken", newAccessToken);

        // Update default header
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.log("REFRESH FAILED:", refreshError);
        processQueue(refreshError, null);
        toast.error("Session expired. Please login again");

        localStorage.clear();
        window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
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
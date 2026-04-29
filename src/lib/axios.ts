import axios from "axios";

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
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

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

        // ✅ USE CLEAN INSTANCE (IMPORTANT)
        const res = await refreshApi.post("/auth/refresh", {
          refreshToken,
        });

        const newAccessToken = res.data.data.accessToken;

        console.log("NEW TOKEN:", newAccessToken);

        // ✅ Save token
        localStorage.setItem("accessToken", newAccessToken);

        // ✅ Update default header
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        // ✅ Update original request
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        // ✅ Retry request
        return api(originalRequest);

      } catch (refreshError) {
        console.log("REFRESH FAILED:", refreshError);

        localStorage.clear();
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
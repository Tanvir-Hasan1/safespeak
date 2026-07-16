import axios from "axios";
import { API_URL } from "./config";
import { useAuthStore } from "../store/useAuthStore";
import { router } from "expo-router";

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60s – AI analysis (OCR + GPT-4o vision) can take 20-40s
});

// Request Interceptor: Attaches Authorization token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL || ""}${config.url || ""}`;
    console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${fullUrl}`);

    // Read token directly from the imported store (avoids stale require() module ref)
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.warn(`[API REQUEST ERROR]`, error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Logs responses; handles 401 by clearing stale auth
api.interceptors.response.use(
  (response) => {
    const fullUrl = `${response.config.baseURL || ""}${response.config.url || ""}`;
    console.log(
      `[API RESPONSE] ${response.config.method?.toUpperCase()} ${fullUrl} | Status: ${response.status} ${
        response.statusText || "OK"
      }`
    );
    return response;
  },
  (error) => {
    const config = error.config || {};
    const fullUrl = `${config.baseURL || ""}${config.url || ""}`;
    const status = error.response?.status;
    const errorMsg = error.response
      ? `Status: ${status} | Error: ${JSON.stringify(error.response.data)}`
      : error.message || String(error);

    console.warn(`[API ERROR] ${config.method?.toUpperCase()} ${fullUrl} | ${errorMsg}`);

    // If we get a 401 on a non-auth endpoint, the stored token is stale — attempt refresh
    if (
      status === 401 &&
      config.url &&
      !config.url.includes("/auth/login") &&
      !config.url.includes("/auth/refresh") &&
      !config._retry
    ) {
      config._retry = true;
      const rToken = useAuthStore.getState().refreshToken;
      if (rToken) {
        // Attempt silent token refresh
        return axios
          .post(`${API_URL}/auth/refresh`, {
            refreshToken: rToken,
          })
          .then((refreshRes) => {
            const { accessToken, refreshToken } = refreshRes.data?.data?.tokens ?? {};
            if (accessToken) {
              useAuthStore.getState().setAuth(
                useAuthStore.getState().user,
                { accessToken, refreshToken }
              );
              // Retry original request with new token
              config.headers = {
                ...config.headers,
                Authorization: `Bearer ${accessToken}`,
              };
              return api(config);
            }
            // Refresh didn't return a token — clear auth and redirect to login
            useAuthStore.getState().clearAuth();
            router.replace("/auth/sign-in");
            return Promise.reject(error);
          })
          .catch((refreshError) => {
            console.warn("[Token Refresh Error]", refreshError);
            useAuthStore.getState().clearAuth();
            router.replace("/auth/sign-in");
            return Promise.reject(error);
          });
      } else {
        // No refresh token available, session is completely expired — clear auth and redirect to login
        useAuthStore.getState().clearAuth();
        router.replace("/auth/sign-in");
      }
    }

    return Promise.reject(error);
  }
);

export default api;

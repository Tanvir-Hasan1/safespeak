import axios from "axios";
import { API_URL } from "./config";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request Interceptor: Logs all outgoing requests
api.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL || ""}${config.url || ""}`;
    console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${fullUrl}`);
    return config;
  },
  (error) => {
    console.warn(`[API REQUEST ERROR]`, error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Logs all successful responses and errors
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
    const errorMsg = error.response
      ? `Status: ${error.response.status} | Error: ${JSON.stringify(error.response.data)}`
      : error.message || String(error);
    console.warn(`[API ERROR] ${config.method?.toUpperCase()} ${fullUrl} | ${errorMsg}`);
    return Promise.reject(error);
  }
);

export default api;

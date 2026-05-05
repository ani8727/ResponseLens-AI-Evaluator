import axios from "axios";

// Single source of truth for API base URL: require VITE_API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("Missing required environment variable: VITE_API_BASE_URL");
}

const TOKEN_KEY = "token";

let onUnauthorizedCallback = null;

export function setOnUnauthorized(callback) {
  onUnauthorizedCallback = callback;
}

export function clearOnUnauthorized() {
  onUnauthorizedCallback = null;
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR: attach bearer token if present
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore storage errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: normalize errors and surface unauthorized to a caller
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      const message = data?.message || data?.error || error.message || "API Error";

      if (status === 401) {
        try {
          localStorage.removeItem(TOKEN_KEY);
        } catch (e) { }
        if (typeof onUnauthorizedCallback === "function") {
          try {
            onUnauthorizedCallback();
          } catch (e) { }
        }
        const err = new Error(message);
        err.status = status;
        return Promise.reject(err);
      }

      const err = new Error(message);
      err.status = status;
      return Promise.reject(err);
    }

    // network / no-response
    return Promise.reject(new Error("Network Error"));
  }
);

export default axiosInstance;
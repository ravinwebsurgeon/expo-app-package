import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/authStore";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { router } from "expo-router";
import { refreshTokenApi } from "./auth";
import { getCSRFTokenString } from "./tokens";

/* ----------------------------------
 * Axios type augmentation
 * ---------------------------------- */
declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
  }
}

/* ----------------------------------
 * Axios instance
 * ---------------------------------- */
export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* ----------------------------------
 * Request interceptor
 * ---------------------------------- */
apiClient.interceptors.request.use(
  async (config) => {
    const { authToken } = useAuthStore.getState();
    const csrfToken = getCSRFTokenString();

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* ----------------------------------
 * Refresh queue
 * ---------------------------------- */
let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}[] = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve(token as string);
  });

  failedQueue = [];
};

/* ----------------------------------
 * Response interceptor
 * ---------------------------------- */
apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig;

    const isUnauthorized = error.response?.status === 401;

    if (
      isUnauthorized &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers!.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const { refreshToken } = useAuthStore.getState();
        if (!refreshToken) throw error;

        const res = await refreshTokenApi(refreshToken);
        const newAccessToken = res.tokens.access.token;

        useAuthStore.setState({
          authToken: newAccessToken,
        });

        processQueue(null, newAccessToken);

        originalRequest.headers!.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);

        useAuthStore.getState().resetStore();
        router.replace(ROUTES.AUTH.LOGIN);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

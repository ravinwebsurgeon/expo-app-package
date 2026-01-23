import { useAuthStore } from "@/stores/authStore";
import axios from "axios";
import { refreshTokenApi } from "./auth";
import { getCSRFTokenString } from "./tokens";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().authToken;
    const csrfToken = getCSRFTokenString();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (token) p.resolve(token);
    else p.reject(error);
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response.data,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) throw error;

        const res = await refreshTokenApi(refreshToken);
        // const res = await axios.post(
        //   `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
        //   { refreshToken },
        // );

        // const newAccessToken = res.data.accessToken;

        // await tokenStorage.setTokens(newAccessToken);

        // apiClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

        // processQueue(null, newAccessToken);

        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // await tokenStorage.clear();
        // TODO: redirect to login
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

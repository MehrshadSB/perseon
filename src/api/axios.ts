// api/axios.ts

import { getCookie, setCookie } from "@/utils/cookie";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = import.meta.env.API_URL || "http://localhost:3000/";

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = getCookie("accessToken");

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("✅ Response Success:", response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log("❌ Response Error:", error.response?.status, originalRequest.url);

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        console.log("⏳ Queueing request:", originalRequest.url);
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            console.log("🚀 Retrying queued request:", originalRequest.url);
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      console.log("🔄 Attempting to refresh token...");

      return new Promise((resolve, reject) => {
        api
          .post("/auth/refresh", { refreshToken: getCookie("refreshToken") })
          .then(({ data }) => {
            const newToken = data.data.access_token;
            console.log("✨ New token received:", newToken);
            setCookie("accessToken", newToken);

            api.defaults.headers.common["Authorization"] = "Bearer " + newToken;
            originalRequest.headers["Authorization"] = "Bearer " + newToken;

            processQueue(null, newToken);
            console.log("🔁 Retrying original request:", originalRequest.url);
            resolve(api(originalRequest));
          })
          .catch((err) => {
            console.error("💀 Refresh token failed:", err);
            processQueue(err, null);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    // if (error.response?.status === 409) {
    //   return Promise.resolve(error.response);
    // }

    return Promise.reject(error);
  },
);

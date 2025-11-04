import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { CookieUtils } from "@/utils/cookieUtils";
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export function setupInterceptors(client: AxiosInstance) {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (typeof window !== "undefined") {
        let token = localStorage.getItem("token");
        if (!token) {
          token = CookieUtils.getCookie("token");
          if (token) {
            localStorage.setItem("token", token);
          }
        }

        if (token && config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as ExtendedAxiosRequestConfig;
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        console.log("401 error intercepted:", error.response);
        const errorData = error.response.data as any;
        if (
          errorData?.requireLogin ||
          errorData?.code === "NO_AUTH_HEADER" ||
          errorData?.code === "TOKEN_EXPIRED" ||
          errorData?.code === "INVALID_TOKEN"
        ) {
          originalRequest._retry = true;
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            CookieUtils.removeAuthToken();
            try {
              const { useUserStore } = await import("@/store/userStore");
              useUserStore.getState().clearUser();
            } catch (e) {
              console.warn("Could not clear user store:", e);
            }
            window.location.href = "/";
          }
          return Promise.resolve(error.response!);
        }
      }

      return Promise.resolve(error.response!);
    }
  );
}

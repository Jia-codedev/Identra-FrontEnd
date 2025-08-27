import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";

export function setupInterceptors(client: AxiosInstance) {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      config.withCredentials = true;
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token && config.headers) {
          if (typeof config.headers.set === "function") {
            config.headers.set("Authorization", `Bearer ${token}`);
          } else {
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => Promise.reject(error)
  );
}

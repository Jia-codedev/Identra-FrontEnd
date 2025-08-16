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
      return config;
    },
    (error) => Promise.reject(error)
  );
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response) {
        return Promise.resolve(error.response);
      }
      return Promise.reject(error);
    }
  );
}

import axios from "axios";
import { setupInterceptors } from "./interceptors";
import frontendSettings from "../constants/envValidation";

const defaultRequestHeaders = {
  "Content-Type": "application/json",
};

function buildApiClient(headers = {}) {
  const client = axios.create({
    baseURL: frontendSettings.apiBaseUrl,
    timeout: 10000,
    headers: { ...defaultRequestHeaders, ...headers },
  });
  setupInterceptors(client);
  return client;
}

export const apiClient = buildApiClient();

export function createApiClient(moduleHeaders = {}) {
  return buildApiClient(moduleHeaders);
}

export { defaultRequestHeaders };
export default apiClient;

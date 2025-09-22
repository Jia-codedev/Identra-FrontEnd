import apiClient from "@/configs/api/Axios";

export interface BiometricTerminal {
  device_id: number;
  device_no: string;
  device_name: string;
  device_status: boolean;
  delete_flag: boolean;
  created_id: number;
  created_date: string;
  last_updated_id: number;
  last_updated_date: string;
}

export interface ListBiometricTerminalsRequest {
  limit?: number;
  offset?: number;
  device_no?: string;
  device_name?: string;
  device_status?: boolean;
  delete_flag?: boolean;
}

export interface CreateBiometricTerminalRequest {
  device_no?: string;
  device_name?: string;
  device_status?: boolean;
  delete_flag?: boolean;
}

export interface UpdateBiometricTerminalRequest {
  device_no?: string;
  device_name?: string;
  device_status?: boolean;
  delete_flag?: boolean;
}

export interface BiometricTerminalsListResponse {
  success: boolean;
  data: BiometricTerminal[];
  hasNext: boolean;
  total: number;
}

export interface BiometricTerminalResponse {
  success: boolean;
  data: BiometricTerminal;
}

export interface CreateBiometricTerminalResponse {
  message: string;
  data: BiometricTerminal;
}

class BiometricTerminalsApi {
  private baseUrl = "/device";

  async list(params: ListBiometricTerminalsRequest = {}): Promise<BiometricTerminalsListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.set("limit", params.limit.toString());
    if (params.offset !== undefined) queryParams.set("offset", (Number(params.offset) + 1).toString());
    if (params.device_no) queryParams.set("device_no", params.device_no);
    if (params.device_name) queryParams.set("device_name", params.device_name);
    if (params.device_status !== undefined) queryParams.set("device_status", params.device_status.toString());
    // if (params.delete_flag !== undefined) queryParams.set("delete_flag", params.delete_flag.toString());
    const response = await apiClient.get(`${this.baseUrl}/all?${queryParams.toString()}`);
    return response.data;
  }

  async getById(id: number): Promise<BiometricTerminalResponse> {
    const response = await apiClient.get(`${this.baseUrl}/get/${id}`);
    return response.data;
  }

  async create(data: CreateBiometricTerminalRequest): Promise<CreateBiometricTerminalResponse> {
    const response = await apiClient.post(`${this.baseUrl}/add`, data);
    return response.data;
  }

  async update(id: number, data: UpdateBiometricTerminalRequest): Promise<CreateBiometricTerminalResponse> {
    const response = await apiClient.put(`${this.baseUrl}/edit/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`${this.baseUrl}/delete/${id}`);
    return response.data;
  }

  async deleteMany(ids: number[]): Promise<{ message: string; count: number; data: { deleted_count: number; requested_count: number } }> {
    const response = await apiClient.delete(`${this.baseUrl}/delete`, { data: { ids } });
    return response.data;
  }
}

const biometricTerminalsApi = new BiometricTerminalsApi();
export default biometricTerminalsApi;
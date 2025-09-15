import apiClient from "@/configs/api/Axios";

export interface Device {
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

export interface ListDevicesRequest {
  limit?: number;
  offset?: number;
  device_no?: string;
  device_name?: string;
  device_status?: boolean;
  delete_flag?: boolean;
}

export interface CreateDeviceRequest {
  device_no?: string;
  device_name?: string;
  device_status?: boolean;
  delete_flag?: boolean;
}

export interface UpdateDeviceRequest {
  device_no?: string;
  device_name?: string;
  device_status?: boolean;
  delete_flag?: boolean;
}

export interface DevicesListResponse {
  success: boolean;
  data: Device[];
  hasNext: boolean;
  total: number;
}

export interface DeviceResponse {
  success: boolean;
  data: Device;
}

export interface CreateDeviceResponse {
  message: string;
  data: Device;
}

class DevicesApi {
  private baseUrl = "/device";

  async list(params: ListDevicesRequest = {}): Promise<DevicesListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.set("limit", params.limit.toString());
    if (params.offset !== undefined) queryParams.set("offset", params.offset.toString());
    if (params.device_no) queryParams.set("device_no", params.device_no);
    if (params.device_name) queryParams.set("device_name", params.device_name);
    if (params.device_status !== undefined) queryParams.set("device_status", params.device_status.toString());
    if (params.delete_flag !== undefined) queryParams.set("delete_flag", params.delete_flag.toString());

    const response = await apiClient.get(`${this.baseUrl}/all?${queryParams.toString()}`);
    return response.data;
  }

  async getById(id: number): Promise<DeviceResponse> {
    const response = await apiClient.get(`${this.baseUrl}/get/${id}`);
    return response.data;
  }

  async create(data: CreateDeviceRequest): Promise<CreateDeviceResponse> {
    const response = await apiClient.post(`${this.baseUrl}/add`, data);
    return response.data;
  }

  async update(id: number, data: UpdateDeviceRequest): Promise<CreateDeviceResponse> {
    const response = await apiClient.put(`${this.baseUrl}/edit/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`${this.baseUrl}/delete/${id}`);
    return response.data;
  }
}

const devicesApi = new DevicesApi();
export default devicesApi;
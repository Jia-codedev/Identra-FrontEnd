import apiClient from "@/configs/api/Axios";

export interface AccessZone {
  zone_id: number;
  zone_name: string;
  zone_description?: string;
  zone_status: boolean;
  zone_type: string; // 'entry' | 'exit' | 'both'
  building_id?: number;
  building_name?: string;
  floor_level?: number;
  capacity_limit?: number;
  delete_flag: boolean;
  created_id: number;
  created_date: string;
  last_updated_id: number;
  last_updated_date: string;
}

export interface ListAccessZonesRequest {
  limit?: number;
  offset?: number;
  zone_name?: string;
  zone_type?: string;
  zone_status?: boolean;
  building_id?: number;
  delete_flag?: boolean;
}

export interface CreateAccessZoneRequest {
  zone_name: string;
  zone_description?: string;
  zone_status?: boolean;
  zone_type: string;
  building_id?: number;
  floor_level?: number;
  capacity_limit?: number;
  delete_flag?: boolean;
}

export interface UpdateAccessZoneRequest {
  zone_name?: string;
  zone_description?: string;
  zone_status?: boolean;
  zone_type?: string;
  building_id?: number;
  floor_level?: number;
  capacity_limit?: number;
  delete_flag?: boolean;
}

export interface AccessZonesListResponse {
  success: boolean;
  data: AccessZone[];
  hasNext: boolean;
  total: number;
}

export interface AccessZoneResponse {
  success: boolean;
  data: AccessZone;
}

export interface CreateAccessZoneResponse extends AccessZoneResponse {
  message: string;
  data: AccessZone;
}

export interface UpdateAccessZoneResponse extends Partial<AccessZoneResponse> {}

class AccessZonesApi {
  private baseUrl = "/access-zones";

  async list(
    params: ListAccessZonesRequest = {}
  ): Promise<AccessZonesListResponse> {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.set("limit", params.limit.toString());
    if (params.offset !== undefined)
      queryParams.set("offset", (Number(params.offset) + 1).toString());
    if (params.zone_name) queryParams.set("zone_name", params.zone_name);
    if (params.zone_type) queryParams.set("zone_type", params.zone_type);
    if (params.zone_status !== undefined)
      queryParams.set("zone_status", params.zone_status.toString());
    if (params.building_id)
      queryParams.set("building_id", params.building_id.toString());
    if (params.delete_flag !== undefined)
      queryParams.set("delete_flag", params.delete_flag.toString());
    const response = await apiClient.get(
      `${this.baseUrl}/all?${queryParams.toString()}`
    );
    return response.data;
  }

  async getById(id: number): Promise<AccessZoneResponse> {
    const response = await apiClient.post(`${this.baseUrl}/get/${id}`);
    return response.data;
  }

  async create(
    data: CreateAccessZoneRequest
  ): Promise<CreateAccessZoneResponse> {
    const response = await apiClient.post(`${this.baseUrl}/add`, data);
    return response.data;
  }

  async update(
    id: number,
    data: UpdateAccessZoneRequest
  ): Promise<UpdateAccessZoneResponse> {
    const response = await apiClient.put(`${this.baseUrl}/edit/${id}`, data);
    return response?.data;
  }

  async delete(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`${this.baseUrl}/delete/${id}`);
    return response.data;
  }

  async bulkDelete(ids: number[]): Promise<{
    message: string;
    count: number;
    data: { deleted_count: number; requested_count: number };
  }> {
    const response = await apiClient.delete(`${this.baseUrl}/delete`, {
      data: { ids },
    });
    return response.data;
  }
}

const accessZonesApi = new AccessZonesApi();
export default accessZonesApi;

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

export interface CreateAccessZoneResponse {
  message: string;
  data: AccessZone;
}

class AccessZonesApi {
  private baseUrl = "/access-zones";

  async list(params: ListAccessZonesRequest = {}): Promise<AccessZonesListResponse> {
    const mockData: AccessZone[] = [
      {
        zone_id: 1,
        zone_name: "Main Entrance",
        zone_description: "Primary building entrance access zone",
        zone_status: true,
        zone_type: "both",
        building_id: 1,
        building_name: "Main Building",
        floor_level: 1,
        capacity_limit: 100,
        delete_flag: false,
        created_id: 1,
        created_date: "2024-01-15T08:00:00Z",
        last_updated_id: 1,
        last_updated_date: "2024-01-15T08:00:00Z"
      },
      {
        zone_id: 2,
        zone_name: "Executive Floor",
        zone_description: "Restricted access zone for executives",
        zone_status: true,
        zone_type: "entry",
        building_id: 1,
        building_name: "Main Building",
        floor_level: 5,
        capacity_limit: 25,
        delete_flag: false,
        created_id: 1,
        created_date: "2024-01-16T09:00:00Z",
        last_updated_id: 1,
        last_updated_date: "2024-01-16T09:00:00Z"
      },
      {
        zone_id: 3,
        zone_name: "Server Room",
        zone_description: "High security zone for IT infrastructure",
        zone_status: true,
        zone_type: "both",
        building_id: 2,
        building_name: "IT Building",
        floor_level: 2,
        capacity_limit: 5,
        delete_flag: false,
        created_id: 1,
        created_date: "2024-01-17T10:00:00Z",
        last_updated_id: 1,
        last_updated_date: "2024-01-17T10:00:00Z"
      }
    ];

    let filteredData = mockData.filter(zone => !zone.delete_flag);
    
    if (params.zone_name) {
      filteredData = filteredData.filter(zone => 
        zone.zone_name.toLowerCase().includes(params.zone_name!.toLowerCase())
      );
    }
    
    if (params.zone_status !== undefined) {
      filteredData = filteredData.filter(zone => zone.zone_status === params.zone_status);
    }
    
    if (params.zone_type) {
      filteredData = filteredData.filter(zone => zone.zone_type === params.zone_type);
    }

    const limit = params.limit || 10;
    const offset = params.offset || 0;
    const paginatedData = filteredData.slice(offset, offset + limit);

    return {
      success: true,
      data: paginatedData,
      hasNext: offset + limit < filteredData.length,
      total: filteredData.length
    };
  }

  async getById(id: number): Promise<AccessZoneResponse> {
    const mockZone: AccessZone = {
      zone_id: id,
      zone_name: "Mock Zone",
      zone_description: "Mock access zone",
      zone_status: true,
      zone_type: "both",
      building_id: 1,
      building_name: "Main Building",
      floor_level: 1,
      capacity_limit: 50,
      delete_flag: false,
      created_id: 1,
      created_date: "2024-01-15T08:00:00Z",
      last_updated_id: 1,
      last_updated_date: "2024-01-15T08:00:00Z"
    };

    return {
      success: true,
      data: mockZone
    };
  }

  async create(data: CreateAccessZoneRequest): Promise<CreateAccessZoneResponse> {
    const mockZone: AccessZone = {
      zone_id: Math.floor(Math.random() * 1000),
      zone_name: data.zone_name,
      zone_description: data.zone_description || "",
      zone_status: data.zone_status ?? true,
      zone_type: data.zone_type,
      building_id: data.building_id,
      building_name: "Mock Building",
      floor_level: data.floor_level,
      capacity_limit: data.capacity_limit,
      delete_flag: false,
      created_id: 1,
      created_date: new Date().toISOString(),
      last_updated_id: 1,
      last_updated_date: new Date().toISOString()
    };

    return {
      message: "Access zone created successfully",
      data: mockZone
    };
  }

  async update(id: number, data: UpdateAccessZoneRequest): Promise<CreateAccessZoneResponse> {
    const mockZone: AccessZone = {
      zone_id: id,
      zone_name: data.zone_name || "Updated Zone",
      zone_description: data.zone_description || "",
      zone_status: data.zone_status ?? true,
      zone_type: data.zone_type || "both",
      building_id: data.building_id,
      building_name: "Mock Building",
      floor_level: data.floor_level,
      capacity_limit: data.capacity_limit,
      delete_flag: false,
      created_id: 1,
      created_date: "2024-01-15T08:00:00Z",
      last_updated_id: 1,
      last_updated_date: new Date().toISOString()
    };

    return {
      message: "Access zone updated successfully",
      data: mockZone
    };
  }

  async delete(id: number): Promise<{ message: string }> {
    return {
      message: "Access zone deleted successfully"
    };
  }
}

const accessZonesApi = new AccessZonesApi();
export default accessZonesApi;
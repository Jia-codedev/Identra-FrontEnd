import apiClient from "@/configs/api/Axios";
export interface ApiResponse<T> {
  data: T;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
  page: number;
  totalPages: number;
}

export interface Building {
  id: number;
  building_name: string;
  building_code: string;
  building_address: string;
  building_description?: string;
  building_status: boolean;
  building_type: "office" | "warehouse" | "factory" | "residential" | "mixed";
  total_floors: number;
  total_area?: number;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  created_date?: string;
  last_updated_date?: string;
  delete_flag: boolean;
}

export interface ListBuildingsRequest {
  limit?: number;
  offset?: number;
  building_name?: string;
  building_code?: string;
  building_status?: boolean;
  building_type?: string;
  city?: string;
  delete_flag?: boolean;
}

export interface ListBuildingResponse extends ApiResponse<Building[]> {
  success: boolean;
  data: Building[];
  hasNext: boolean;
  total: number;
}

export interface CreateBuildingRequest {
  building_name: string;
  building_code: string;
  building_address: string;
  building_description?: string;
  building_status: boolean;
  building_type: "office" | "warehouse" | "factory" | "residential" | "mixed";
  total_floors: number;
  total_area?: number;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
}

export interface CreateBuildingResponse {
  success: boolean;
  data: Building;
}

export interface UpdateBuildingRequest extends Partial<CreateBuildingRequest> {}
export interface UpdateBuildingResponse extends CreateBuildingResponse {}


//   {
//     id: 1,
//     building_name: "Headquarters Tower",
//     building_code: "HQ001",
//     building_address: "123 Business District, Downtown",
//     building_description: "Main headquarters building with executive offices",
//     building_status: true,
//     building_type: "office",
//     total_floors: 25,
//     total_area: 50000,
//     contact_person: "John Smith",
//     contact_phone: "+1-555-0123",
//     contact_email: "facilities@company.com",
//     city: "New York",
//     country: "USA",
//     postal_code: "10001",
//     latitude: 40.7128,
//     longitude: -74.006,
//     created_date: "2024-01-15",
//     last_updated_date: "2024-12-01",
//     delete_flag: false,
//   },
//   {
//     id: 2,
//     building_name: "Manufacturing Plant A",
//     building_code: "MFG001",
//     building_address: "456 Industrial Avenue, West Side",
//     building_description: "Primary manufacturing facility for product assembly",
//     building_status: true,
//     building_type: "factory",
//     total_floors: 3,
//     total_area: 75000,
//     contact_person: "Sarah Johnson",
//     contact_phone: "+1-555-0124",
//     contact_email: "plant.manager@company.com",
//     city: "Detroit",
//     country: "USA",
//     postal_code: "48201",
//     latitude: 42.3314,
//     longitude: -83.0458,
//     created_date: "2024-02-10",
//     last_updated_date: "2024-11-15",
//     delete_flag: false,
//   },
//   {
//     id: 3,
//     building_name: "Storage Warehouse B",
//     building_code: "WH002",
//     building_address: "789 Logistics Road, South District",
//     building_description: "Secondary storage facility for inventory management",
//     building_status: false,
//     building_type: "warehouse",
//     total_floors: 2,
//     total_area: 30000,
//     contact_person: "Mike Wilson",
//     contact_phone: "+1-555-0125",
//     contact_email: "warehouse@company.com",
//     city: "Chicago",
//     country: "USA",
//     postal_code: "60601",
//     latitude: 41.8781,
//     longitude: -87.6298,
//     created_date: "2024-03-05",
//     last_updated_date: "2024-10-20",
//     delete_flag: false,
//   },
//   {
//     id: 4,
//     building_name: "Research & Development Center",
//     building_code: "RD001",
//     building_address: "321 Innovation Boulevard, Tech Park",
//     building_description: "Advanced research and development facility",
//     building_status: true,
//     building_type: "office",
//     total_floors: 8,
//     total_area: 40000,
//     contact_person: "Dr. Emily Chen",
//     contact_phone: "+1-555-0126",
//     contact_email: "research@company.com",
//     city: "San Francisco",
//     country: "USA",
//     postal_code: "94105",
//     latitude: 37.7749,
//     longitude: -122.4194,
//     created_date: "2024-04-12",
//     last_updated_date: "2024-12-05",
//     delete_flag: false,
//   },
// ];

// const buildingsApi = {
//   list: async (
//     params: ListBuildingsRequest = {}
//   ): Promise<ApiResponse<Building[]>> => {
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     let filteredBuildings = [...mockBuildings];

//     if (params.building_name) {
//       filteredBuildings = filteredBuildings.filter((building) =>
//         building.building_name
//           .toLowerCase()
//           .includes(params.building_name!.toLowerCase())
//       );
//     }

//     if (params.building_code) {
//       filteredBuildings = filteredBuildings.filter((building) =>
//         building.building_code
//           .toLowerCase()
//           .includes(params.building_code!.toLowerCase())
//       );
//     }

//     if (params.building_status !== undefined) {
//       filteredBuildings = filteredBuildings.filter(
//         (building) => building.building_status === params.building_status
//       );
//     }

//     if (params.building_type) {
//       filteredBuildings = filteredBuildings.filter(
//         (building) => building.building_type === params.building_type
//       );
//     }

//     if (params.city) {
//       filteredBuildings = filteredBuildings.filter((building) =>
//         building.city?.toLowerCase().includes(params.city!.toLowerCase())
//       );
//     }

//     if (params.delete_flag !== undefined) {
//       filteredBuildings = filteredBuildings.filter(
//         (building) => building.delete_flag === params.delete_flag
//       );
//     }

//     const total = filteredBuildings.length;
//     const limit = params.limit || 10;
//     const offset = params.offset || 0;
//     const hasNext = offset + limit < total;
//     const hasPrev = offset > 0;

//     const paginatedBuildings = filteredBuildings.slice(offset, offset + limit);

//     return {
//       data: paginatedBuildings,
//       total,
//       hasNext,
//       hasPrev,
//       page: Math.floor(offset / limit) + 1,
//       totalPages: Math.ceil(total / limit),
//     };
//   },

//   getById: async (id: number): Promise<ApiResponse<Building>> => {
//     await new Promise((resolve) => setTimeout(resolve, 300));

//     const building = mockBuildings.find((b) => b.id === id && !b.delete_flag);
//     if (!building) {
//       throw new Error("Building not found");
//     }

//     return {
//       data: building,
//       total: 1,
//       hasNext: false,
//       hasPrev: false,
//       page: 1,
//       totalPages: 1,
//     };
//   },

//   create: async (
//     data: CreateBuildingRequest
//   ): Promise<ApiResponse<Building>> => {
//     await new Promise((resolve) => setTimeout(resolve, 800));

//     const newBuilding: Building = {
//       id: Math.max(...mockBuildings.map((b) => b.id)) + 1,
//       ...data,
//       created_date: new Date().toISOString().split("T")[0],
//       last_updated_date: new Date().toISOString().split("T")[0],
//       delete_flag: false,
//     };

//     mockBuildings.push(newBuilding);

//     return {
//       data: newBuilding,
//       total: 1,
//       hasNext: false,
//       hasPrev: false,
//       page: 1,
//       totalPages: 1,
//     };
//   },

//   update: async (
//     id: number,
//     data: UpdateBuildingRequest
//   ): Promise<ApiResponse<Building>> => {
//     await new Promise((resolve) => setTimeout(resolve, 600));

//     const buildingIndex = mockBuildings.findIndex(
//       (b) => b.id === id && !b.delete_flag
//     );
//     if (buildingIndex === -1) {
//       throw new Error("Building not found");
//     }

//     mockBuildings[buildingIndex] = {
//       ...mockBuildings[buildingIndex],
//       ...data,
//       last_updated_date: new Date().toISOString().split("T")[0],
//     };

//     return {
//       data: mockBuildings[buildingIndex],
//       total: 1,
//       hasNext: false,
//       hasPrev: false,
//       page: 1,
//       totalPages: 1,
//     };
//   },

//   delete: async (id: number): Promise<ApiResponse<void>> => {
//     await new Promise((resolve) => setTimeout(resolve, 400));

//     const buildingIndex = mockBuildings.findIndex((b) => b.id === id);
//     if (buildingIndex === -1) {
//       throw new Error("Building not found");
//     }

//     mockBuildings[buildingIndex].delete_flag = true;
//     mockBuildings[buildingIndex].last_updated_date = new Date()
//       .toISOString()
//       .split("T")[0];

//     return {
//       data: undefined,
//       total: 0,
//       hasNext: false,
//       hasPrev: false,
//       page: 1,
//       totalPages: 1,
//     };
//   },

//   bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
//     await new Promise((resolve) => setTimeout(resolve, 800));

//     ids.forEach((id) => {
//       const buildingIndex = mockBuildings.findIndex((b) => b.id === id);
//       if (buildingIndex !== -1) {
//         mockBuildings[buildingIndex].delete_flag = true;
//         mockBuildings[buildingIndex].last_updated_date = new Date()
//           .toISOString()
//           .split("T")[0];
//       }
//     });

//     return {
//       data: undefined,
//       total: 0,
//       hasNext: false,
//       hasPrev: false,
//       page: 1,
//       totalPages: 1,
//     };
//   },
// };

class BuildingsApi {
  private baseUrl = "/building";

  async list(params: ListBuildingsRequest = {}): Promise<ListBuildingResponse> {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.set("limit", params.limit.toString());
    if (params.offset !== undefined)
      queryParams.set("offset", params.offset.toString());

    if (params.building_name)
      queryParams.set("building_name", params.building_name);
    if (params.building_status !== undefined)
      queryParams.set("building_status", params.building_status.toString());
    if (params.delete_flag !== undefined)
      queryParams.set("delete_flag", params.delete_flag.toString());
    const response = await apiClient.get(
      `${this.baseUrl}/all?${queryParams.toString()}`
    );
    return response.data;
  }

  async getById(id: number): Promise<ListBuildingResponse> {
    const response = await apiClient.get(`${this.baseUrl}/get/${id}`);
    return response.data;
  }

  async create(data: CreateBuildingRequest): Promise<CreateBuildingResponse> {
    const response = await apiClient.post(`${this.baseUrl}/add`, data);
    return response.data;
  }

  async update(
    id: number,
    data: UpdateBuildingRequest
  ): Promise<UpdateBuildingResponse> {
    const response = await apiClient.put(`${this.baseUrl}/edit/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`${this.baseUrl}/delete/${id}`);
    return response.data;
  }

  async bulkDelete(
    ids: number[]
  ): Promise<{
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

const buildingsApi = new BuildingsApi();

export default buildingsApi;

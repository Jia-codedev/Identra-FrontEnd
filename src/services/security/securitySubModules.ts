import apiClient from "@/configs/api/Axios";

export interface SecSubModule {
  sub_module_id: number;
  sub_module_name: string;
  module_id?: number;
  is_active?: boolean;
  created_id?: number;
  created_date?: string;
  last_updated_id?: number;
  last_updated_time?: string;
}

export interface CreateSecSubModuleRequest {
  sub_module_name: string;
  module_id?: number;
}

class SecuritySubModulesApi {
  // Sub Modules Management
  getSubModules(
    { offset = 1, limit = 10, search = "" } = {} as {
      offset?: number;
      limit?: number;
      search?: string;
    }
  ) {
    return apiClient.get("/secSubModule/all", {
      params: { offset, limit, ...(search && { search }) },
    });
  }

  getSubModuleById(id: number) {
    return apiClient.get(`/secSubModule/get/${id}`);
  }

  getSubModulesByModuleId(moduleId: number) {
    return apiClient.get(`/secSubModule/by-module/${moduleId}`);
  }

  createSubModule(data: CreateSecSubModuleRequest) {
    return apiClient.post("/secSubModule/add", data);
  }

  updateSubModule(id: number, data: Partial<CreateSecSubModuleRequest>) {
    return apiClient.put(`/secSubModule/edit/${id}`, data);
  }

  deleteSubModule(id: number) {
    return apiClient.delete(`/secSubModule/delete/${id}`);
  }
}

const securitySubModulesApi = new SecuritySubModulesApi();
export default securitySubModulesApi;
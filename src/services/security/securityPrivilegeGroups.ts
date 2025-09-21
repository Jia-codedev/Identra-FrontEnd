import apiClient from "@/configs/api/Axios";

export interface SecPrivilegeGroup {
  privilege_group_id: number;
  group_name: string;
  created_id?: number;
  created_date?: string;
  last_updated_id?: number;
  last_updated_date?: string;
}

export interface CreateSecPrivilegeGroupRequest {
  group_name: string;
}

class SecurityPrivilegeGroupsApi {
  // Privilege Groups Management
  getPrivilegeGroups(
    { offset = 1, limit = 10, search = "" } = {} as {
      offset?: number;
      limit?: number;
      search?: string;
    }
  ) {
    return apiClient.get("/secPrivilegeGroup/all", {
      params: { offset, limit, ...(search && { search }) },
    });
  }

  getPrivilegeGroupById(id: number) {
    return apiClient.get(`/secPrivilegeGroup/get/${id}`);
  }

  createPrivilegeGroup(data: CreateSecPrivilegeGroupRequest) {
    return apiClient.post("/secPrivilegeGroup/add", data);
  }

  updatePrivilegeGroup(id: number, data: Partial<CreateSecPrivilegeGroupRequest>) {
    return apiClient.put(`/secPrivilegeGroup/edit/${id}`, data);
  }

  deletePrivilegeGroup(id: number) {
    return apiClient.delete(`/secPrivilegeGroup/delete/${id}`);
  }
}

const securityPrivilegeGroupsApi = new SecurityPrivilegeGroupsApi();
export default securityPrivilegeGroupsApi;
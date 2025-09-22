import apiClient from "@/configs/api/Axios";

export interface SecPrivilege {
  priv_id: number;
  priv_name: string;
  priv_description?: string;
  module_name?: string;
  priv_type?: string;
  editable_flag?: boolean;
  created_id?: number;
  created_date?: string;
  last_updated_id?: number;
  last_updated_date?: string;
}

export interface CreateSecPrivilegeRequest {
  priv_name: string;
  priv_description?: string;
  module_name?: string;
  priv_type?: string;
  editable_flag?: boolean;
}

export interface SecRolePrivilege {
  role_priv_id: number;
  role_id: number;
  priv_id: number;
  created_id?: number;
  created_date?: string;
  last_updated_id?: number;
  last_updated_date?: string;
  sec_roles?: {
    role_id: number;
    role_name: string;
  };
  sec_privileges?: SecPrivilege;
}

export interface CreateSecRolePrivilegeRequest {
  role_id: number;
  priv_id: number;
}

export interface SecModule {
  module_id: number;
  module_name: string;
  module_description?: string;
  parent_module_id?: number;
  module_order?: number;
  is_active?: boolean;
  created_id?: number;
  created_date?: string;
  last_updated_id?: number;
  last_updated_date?: string;
}

class SecurityPermissionsApi {
  getPrivileges(
    { offset = 1, limit = 10, search = "", module_name = "" } = {} as {
      offset?: number;
      limit?: number;
      search?: string;
      module_name?: string;
    }
  ) {
    return apiClient.get("/secPrivilege/all", {
      params: { 
        offset, 
        limit, 
        ...(search && { search }),
        ...(module_name && { module_name })
      },
    });
  }

  getPrivilegeById(id: number) {
    return apiClient.get(`/secPrivilege/get/${id}`);
  }

  getPrivilegeByName(privName: string) {
    return apiClient.get(`/secPrivilege/getByName/${privName}`);
  }

  createPrivilege(data: CreateSecPrivilegeRequest) {
    return apiClient.post("/secPrivilege/add", data);
  }

  updatePrivilege(id: number, data: Partial<CreateSecPrivilegeRequest>) {
    return apiClient.put(`/secPrivilege/edit/${id}`, data);
  }

  deletePrivilege(id: number) {
    return apiClient.delete(`/secPrivilege/delete/${id}`);
  }

  deleteMultiplePrivileges(ids: number[]) {
    return apiClient.delete("/secPrivilege/delete", { data: { ids } });
  }

  getRolePrivileges(
    { offset = 1, limit = 10, role_id, priv_id } = {} as {
      offset?: number;
      limit?: number;
      role_id?: number;
      priv_id?: number;
    }
  ) {
    return apiClient.get("/secRolePrivilege/all", {
      params: { offset, limit, ...(role_id && { role_id }), ...(priv_id && { priv_id }) },
    });
  }

  getRolePrivilegeById(id: number) {
    return apiClient.get(`/secRolePrivilege/get/${id}`);
  }

  createRolePrivilege(data: CreateSecRolePrivilegeRequest) {
    return apiClient.post("/secRolePrivilege/add", data);
  }

  updateRolePrivilege(id: number, data: Partial<CreateSecRolePrivilegeRequest>) {
    return apiClient.put(`/secRolePrivilege/edit/${id}`, data);
  }

  deleteRolePrivilege(id: number) {
    return apiClient.delete(`/secRolePrivilege/delete/${id}`);
  }

  getModules(
    { offset = 1, limit = 10, search = "" } = {} as {
      offset?: number;
      limit?: number;
      search?: string;
    }
  ) {
    return apiClient.get("/secModule/all", {
      params: { offset, limit, ...(search && { module_name: search }) },
    });
  }

  getModuleById(id: number) {
    return apiClient.get(`/secModule/get/${id}`);
  }

  createModule(data: Partial<SecModule>) {
    return apiClient.post("/secModule/add", data);
  }

  updateModule(id: number, data: Partial<SecModule>) {
    return apiClient.put(`/secModule/edit/${id}`, data);
  }

  deleteModule(id: number) {
    return apiClient.delete(`/secModule/delete/${id}`);
  }
}

const securityPermissionsApi = new SecurityPermissionsApi();
export default securityPermissionsApi;
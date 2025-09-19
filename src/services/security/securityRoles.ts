import apiClient from "@/configs/api/Axios";

export interface SecRole {
  role_id: number;
  role_name: string;
  editable_flag?: boolean;
  created_id?: number;
  created_date?: string;
  last_updated_id?: number;
  last_updated_date?: string;
}

export interface CreateSecRoleRequest {
  role_name: string;
  editable_flag?: boolean;
}

export interface SecUserRole {
  user_role_id: number;
  user_id: number;
  role_id: number;
  effective_from_date: string;
  effective_to_date?: string;
  created_id?: number;
  created_date?: string;
  last_updated_id?: number;
  last_updated_date?: string;
  // Relations
  sec_roles?: SecRole;
  sec_users?: {
    user_id: number;
    username: string;
    employee_id: number;
    employee_master?: {
      emp_no: string;
      firstname_eng: string;
      lastname_eng: string;
      firstname_arb: string;
      lastname_arb: string;
    };
  };
}

export interface CreateSecUserRoleRequest {
  user_id: number;
  role_id: number;
  effective_from_date: string;
  effective_to_date?: string;
}

class SecurityRolesApi {
  // Roles Management
  getRoles(
    { offset = 1, limit = 10, search = "" } = {} as {
      offset?: number;
      limit?: number;
      search?: string;
    }
  ) {
    return apiClient.get("/secRole/all", {
      params: { offset, limit, ...(search && { search }) },
    });
  }

  getRoleById(id: number) {
    return apiClient.get(`/secRole/get/${id}`);
  }

  getRoleByName(roleName: string) {
    return apiClient.get(`/secRole/getByName/${roleName}`);
  }

  createRole(data: CreateSecRoleRequest) {
    return apiClient.post("/secRole/add", data);
  }

  updateRole(id: number, data: Partial<CreateSecRoleRequest>) {
    return apiClient.put(`/secRole/edit/${id}`, data);
  }

  deleteRole(id: number) {
    return apiClient.delete(`/secRole/delete/${id}`);
  }

  deleteMultipleRoles(ids: number[]) {
    return apiClient.delete("/secRole/delete", { data: { ids } });
  }

  // User Role Assignments
  getUserRoles(
    { offset = 1, limit = 10, user_id, role_id } = {} as {
      offset?: number;
      limit?: number;
      user_id?: number;
      role_id?: number;
    }
  ) {
    return apiClient.get("/secUserRole/all", {
      params: { offset, limit, ...(user_id && { user_id }), ...(role_id && { role_id }) },
    });
  }

  getUserRoleById(id: number) {
    return apiClient.get(`/secUserRole/get/${id}`);
  }

  createUserRole(data: CreateSecUserRoleRequest) {
    return apiClient.post("/secUserRole/add", data);
  }

  updateUserRole(id: number, data: Partial<CreateSecUserRoleRequest>) {
    return apiClient.put(`/secUserRole/edit/${id}`, data);
  }

  deleteUserRole(id: number) {
    return apiClient.delete(`/secUserRole/delete/${id}`);
  }
}

const securityRolesApi = new SecurityRolesApi();
export default securityRolesApi;
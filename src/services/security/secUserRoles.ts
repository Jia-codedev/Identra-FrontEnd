import apiClient from "@/configs/api/Axios";

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
  sec_roles?: {
    role_id: number;
    role_name: string;
  };
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
      organization_id?: number;
      organizations?: {
        organization_id: number;
        organization_name_eng: string;
        organization_name_arb: string;
      };
    };
  };
}

export interface CreateSecUserRoleRequest {
  user_id: number;
  role_id: number;
  effective_from_date: string;
  effective_to_date?: string;
}

export interface GetUserRolesParams {
  offset?: number;
  limit?: number;
  user_id?: number;
  role_id?: number;
  organization_id?: number | null;
}

class SecUserRolesApi {
  /**
   * Get all user role assignments with optional filters (paginated)
   */
  getUserRoles(params: GetUserRolesParams = {}) {
    const {
      offset = 1,
      limit = 10,
      user_id,
      role_id,
      organization_id,
    } = params;
    return apiClient.get("/secUserRole/all", {
      params: {
        offset,
        limit,
        ...(user_id && { user_id }),
        ...(role_id && { role_id }),
        ...(organization_id && { organization_id }),
      },
    });
  }

  /**
   * Get a user role assignment by ID
   */
  getUserRoleById(id: number) {
    return apiClient.get(`/secUserRole/get/${id}`);
  }

  /**
   * Create a new user role assignment
   */
  createUserRole(data: CreateSecUserRoleRequest) {
    return apiClient.post("/secUserRole/add", data);
  }

  /**
   * Update a user role assignment
   */
  updateUserRole(id: number, data: Partial<CreateSecUserRoleRequest>) {
    return apiClient.put(`/secUserRole/edit/${id}`, data);
  }

  /**
   * Delete a user role assignment
   */
  deleteUserRole(id: number) {
    return apiClient.delete(`/secUserRole/delete/${id}`);
  }

  /**
   * Patch user role assignments (bulk assign roles to users)
   */
  patchUserRoleAssignments(data: { user_ids: number[]; role_id: number }) {
    return apiClient.patch("/secUserRole/patch-role", data);
  }
}

const secUserRolesApi = new SecUserRolesApi();
export default secUserRolesApi;

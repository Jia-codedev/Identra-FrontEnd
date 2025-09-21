import apiClient from "@/configs/api/Axios";

export interface EmployeeGroupMember {
  group_member_id?: number;
  employee_group_id: number;
  employee_id: number;
  effective_from_date: string;
  effective_to_date?: string | null;
  active_flag: boolean;
  created_id: number;
  created_date?: string;
  last_updated_id: number;
  last_updated_date?: string;
}

export interface CreateEmployeeGroupMemberRequest {
  employee_group_id: number;
  employee_id: number;
  effective_from_date: string;
  effective_to_date?: string;
  active_flag?: boolean;
}

class EmployeeGroupMembersApi {
  // Employee Group Members Management
  getEmployeeGroupMembers(
    { offset = 1, limit = 10, search = "" } = {} as {
      offset?: number;
      limit?: number;
      search?: string;
    }
  ) {
    return apiClient.get("/employeeGroupMember/all", {
      params: { offset, limit, ...(search && { search }) },
    });
  }

  getEmployeeGroupMemberById(id: number) {
    return apiClient.get(`/employeeGroupMember/get/${id}`);
  }

  getMembersByGroup(groupId: number) {
    return apiClient.get(`/employeeGroupMember/byGroup/${groupId}`);
  }

  getGroupsByEmployee(employeeId: number) {
    return apiClient.get(`/employeeGroupMember/byEmployee/${employeeId}`);
  }

  createEmployeeGroupMember(data: CreateEmployeeGroupMemberRequest) {
    return apiClient.post("/employeeGroupMember/add", data);
  }

  updateEmployeeGroupMember(id: number, data: Partial<CreateEmployeeGroupMemberRequest>) {
    return apiClient.put(`/employeeGroupMember/edit/${id}`, data);
  }

  deleteEmployeeGroupMember(id: number) {
    return apiClient.delete(`/employeeGroupMember/delete/${id}`);
  }

  deleteEmployeeGroupMembers(ids: number[]) {
    return apiClient.post("/employeeGroupMember/delete", { ids });
  }
}

const employeeGroupMembersApi = new EmployeeGroupMembersApi();
export default employeeGroupMembersApi;
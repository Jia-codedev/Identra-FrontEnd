import apiClient from "@/configs/api/Axios";

export type ListLeavesRequest = {
  limit?: number;
  offset?: number;
  employee_id?: number | string;
  leave_type_id?: number;
  leave_status?: string;
  from_date?: string;
  to_date?: string;
};

export type ListLeavesResponse = {
  success: boolean;
  data: any[];
  total: number;
  hasNext: boolean;
  limit?: number;
  offset?: number;
};

export type GetEmployeeLeavesRequest = {
  limit?: number;
  offset?: number;
  leave_status?: string;
  from_date?: string;
  to_date?: string;
};

export type GetPendingLeavesRequest = {
  limit?: number;
  offset?: number;
  employee_id?: string;
  leave_type_id?: string;
};

class EmployeeLeavesApi {
  getLeaveTypes() {
    return apiClient.get("/leaveType/");
  }

  getApprovers() {
    return apiClient.get("/employeeLeave/approvers");
  }
  list(req: ListLeavesRequest = {}): Promise<ListLeavesResponse> {
    return apiClient.get("/employeeLeave/all", { params: req });
  }

  getEmployeeLeaves(
    employeeId: number,
    req: GetEmployeeLeavesRequest = {}
  ): Promise<ListLeavesResponse> {
    return apiClient.get(`/employeeLeave/get/${employeeId}`, { params: req });
  }

  getPendingLeaves(
    req: GetPendingLeavesRequest = {}
  ): Promise<ListLeavesResponse> {
    return apiClient.get("/employeeLeave/pending", { params: req });
  }

  getById(id: number) {
    return apiClient.get(`/employeeLeave/get/${id}`);
  }

  approve(id: number, approverId?: number) {
    return apiClient.put(`/employeeLeave/approve/${id}`, {
      approve_reject_flag: 1,
      leave_status: "APPROVED",
      ...(approverId ? { approver_id: approverId } : {}),
    });
  }

  reject(id: number, approverId?: number, remarks?: string) {
    return apiClient.put(`/employeeLeave/approve/${id}`, {
      approve_reject_flag: 2,
      leave_status: "REJECTED",
      ...(approverId ? { approver_id: approverId } : {}),
      ...(remarks ? { approver_remarks: remarks } : {}),
    });
  }

  add(data: any) {
    return apiClient.post("/employeeLeave/add", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  edit(id: number, data: any) {
    return apiClient.put(`/employeeLeave/edit/${id}`, data);
  }

  delete(id: number) {
    return apiClient.delete(`/employeeLeave/delete/${id}`);
  }

  deleteMany(ids: number[]) {
    return apiClient.delete("/employee-leaves/delete", { data: { ids } });
  }
  myleavesRequests(req: ListLeavesRequest = {}): Promise<ListLeavesResponse> {
    return apiClient.get("/employeeLeave/myleavesRequests", { params: req });
  }
}

const employeeLeavesApi = new EmployeeLeavesApi();
export default employeeLeavesApi;

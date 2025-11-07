import apiClient from "@/configs/api/Axios";

export type ListPermissionsRequest = {
  limit?: number;
  offset?: number;
  employee_id?: number;
  employee_number?: string;
  employee_name?: string;
  manager_id?: number;
  status?: number;
  from_date?: string;
  to_date?: string;
  search?: string;
};

class EmployeeShortPermissionsApi {
  getPermissions(params: ListPermissionsRequest = {}) {
    return apiClient.get("/employeeShortPermission/all", { params });
  }

  list(req: ListPermissionsRequest = {}) {
    return apiClient.get("/employeeShortPermission/all", { params: req });
  }

  getById(id: number) {
    return apiClient.get(`/employeeShortPermission/get/${id}`);
  }

  add(data: any) {
    return apiClient.post("/employeeShortPermission/add", data);
  }

  edit(id: number, data: any) {
    return apiClient.put(`/employeeShortPermission/edit/${id}`, data);
  }

  approve(id: number, data: any) {
    return apiClient.put(`/employeeShortPermission/approve/${id}`, data);
  }

  delete(id: number) {
    return apiClient.delete(`/employeeShortPermission/delete/${id}`);
  }

  deleteMultiple(ids: number[]) {
    return apiClient.delete("/employeeShortPermission/delete", {
      data: { ids },
    });
  }
}

const employeeShortPermissionsApi = new EmployeeShortPermissionsApi();
export default employeeShortPermissionsApi;

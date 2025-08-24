import apiClient from '@/configs/api/Axios';

export type ListPermissionsRequest = {
  limit?: number;
  offset?: number;
  employee_number?: string;
  employee_name?: string;
  status?: number;
  from_date?: string;
  to_date?: string;
};

class EmployeeShortPermissionsApi {
  list(req: ListPermissionsRequest = {}) {
    return apiClient.get('/employeeShortPermission/all', { params: req });
  }

  getById(id: number) {
    return apiClient.get(`/employeeShortPermission/get/${id}`);
  }

  add(data: any) {
    return apiClient.post('/employeeShortPermission/add', data);
  }

  edit(id: number, data: any) {
    return apiClient.put(`/employeeShortPermission/edit/${id}`, data);
  }

  approve(id: number, data: any) {
    return apiClient.put(`/employeeShortPermissions/approve/${id}`, data);
  }

  approveAlt(id: number, data: any) {
    return apiClient.put(`/employeeShortPermission/approve/${id}`, data);
  }

  delete(id: number) {
    return apiClient.delete(`/employeeShortPermission/delete/${id}`);
  }
}

const employeeShortPermissionsApi = new EmployeeShortPermissionsApi();
export default employeeShortPermissionsApi;

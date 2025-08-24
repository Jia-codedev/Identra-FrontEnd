import apiClient from '@/configs/api/Axios';

export type ListLeavesRequest = {
  limit?: number;
  offset?: number;
  employee_id?: number | string;
  leave_type_id?: number;
  leave_status?: string;
  from_date?: string;
  to_date?: string;
};

class EmployeeLeavesApi {
  list(req: ListLeavesRequest = {}) {
    return apiClient.get('/employeeLeave/all', { params: req });
  }

  getById(id: number) {
    return apiClient.get(`/employeeLeave/get/${id}`);
  }

  approve(id: number, approverId?: number) {
    return apiClient.put(`/employeeLeave/approve/${id}`, {
      approve_reject_flag: 1,
      leave_status: 'APPROVED',
      ...(approverId ? { approver_id: approverId } : {}),
    });
  }

  reject(id: number, approverId?: number, remarks?: string) {
    return apiClient.put(`/employeeLeave/approve/${id}`, {
      approve_reject_flag: 2,
      leave_status: 'REJECTED',
      ...(approverId ? { approver_id: approverId } : {}),
      ...(remarks ? { approver_remarks: remarks } : {}),
    });
  }

  add(data: any) {
    return apiClient.post('/employeeLeave/add', data);
  }

  edit(id: number, data: any) {
    return apiClient.put(`/employeeLeave/edit/${id}`, data);
  }

  delete(id: number) {
    return apiClient.delete(`/employeeLeave/delete/${id}`);
  }

  deleteMany(ids: number[]) {
    return apiClient.delete('/employee-leaves/delete', { data: { ids } });
  }
}

const employeeLeavesApi = new EmployeeLeavesApi();
export default employeeLeavesApi;

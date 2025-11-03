import { AxiosResponse } from 'axios';
import apiClient from '@/configs/api/Axios';

class DeptAdminsApi {
  getDeptAdmins({ offset = 1, limit = 10 } = {} as { offset?: number; limit?: number; search?: string }) {
    return apiClient.get('/deptAdmins', { params: { offset, limit } });
  }
  getDeptAdminById(id: number) {
    return apiClient.get(`/deptAdmins/${id}`);
  }
  addDeptAdmin(data: any) {
    return apiClient.post('/deptAdmins', data);
  }
  updateDeptAdmin(id: number, data: any) {
    return apiClient.put(`/deptAdmins/${id}`, data);
  }
  deleteDeptAdmin(id: number) {
    return apiClient.delete(`/deptAdmins/${id}`);
  }
  deleteDeptAdmins(ids: number[]) {
    return apiClient.post('/deptAdmins/delete', { ids });
  }
}

const deptAdminsApi = new DeptAdminsApi();
export default deptAdminsApi;

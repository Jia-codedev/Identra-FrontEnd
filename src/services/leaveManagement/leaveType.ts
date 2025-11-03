import apiClient from '@/configs/api/Axios';

export type LeaveType = {
  leave_type_id: number;
  leave_type_eng?: string;
  leave_type_name?: string;
};

class LeaveTypeApi {
  dropdown() {
    return apiClient.get('/leaveType');
  }

  all(params?: any) {
    return apiClient.get('/leaveType/all', { params });
  }

  active() {
    return apiClient.get('/leaveType/active');
  }

  get(id: number) {
    return apiClient.get(`/leaveType/get/${id}`);
  }

  create(payload: any) {
    return apiClient.post('/leaveType/add', payload);
  }

  update(id: number, payload: any) {
    return apiClient.put(`/leaveType/edit/${id}`, payload);
  }

  remove(id: number) {
    return apiClient.delete(`/leaveType/delete/${id}`);
  }

  removeMany(ids: number[]) {
    return apiClient.delete('/leaveType/delete', { data: { ids } });
  }
}

const leaveTypeApi = new LeaveTypeApi();
export default leaveTypeApi;

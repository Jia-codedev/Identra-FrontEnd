import apiClient from '@/configs/api/Axios';

export type LeaveType = {
  leave_type_id: number;
  leave_type_eng?: string;
  leave_type_name?: string;
  // Add other fields as needed
};

class LeaveTypeApi {
  // Dropdown / minimal list
  dropdown() {
    return apiClient.get('/leaveType');
  }

  // Get all leave types with optional pagination params
  all(params?: any) {
    return apiClient.get('/leaveType/all', { params });
  }

  // Get active leave types
  active() {
    return apiClient.get('/leaveType/active');
  }

  // Get by id
  get(id: number) {
    return apiClient.get(`/leaveType/get/${id}`);
  }

  // Create (backend expects POST to /leaveType/add)
  create(payload: any) {
    return apiClient.post('/leaveType/add', payload);
  }

  // Update (backend expects PUT to /leaveType/edit/:id)
  update(id: number, payload: any) {
    return apiClient.put(`/leaveType/edit/${id}`, payload);
  }

  // Delete single (backend expects DELETE to /leaveType/delete/:id)
  remove(id: number) {
    return apiClient.delete(`/leaveType/delete/${id}`);
  }

  // Bulk delete (backend expects DELETE to /leaveType/delete with body { ids: [] })
  removeMany(ids: number[]) {
    return apiClient.delete('/leaveType/delete', { data: { ids } });
  }
}

const leaveTypeApi = new LeaveTypeApi();
export default leaveTypeApi;

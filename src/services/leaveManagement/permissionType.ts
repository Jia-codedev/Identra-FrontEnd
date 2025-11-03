import apiClient from '@/configs/api/Axios';

class PermissionTypeApi {
  all(params?: any) {
    return apiClient.get('/permissionType/all', { params });
  }

  create(payload: any) {
    return apiClient.post('/permissionType/add', payload);
  }

  update(id: number, payload: any) {
    return apiClient.put(`/permissionType/edit/${id}`, payload);
  }

  remove(id: number) {
    return apiClient.delete(`/permissionType/delete/${id}`);
  }

  removeMany(ids: number[]) {
    return apiClient.delete('/permissionType/delete', { data: { ids } });
  }
}

const permissionTypeApi = new PermissionTypeApi();
export default permissionTypeApi;

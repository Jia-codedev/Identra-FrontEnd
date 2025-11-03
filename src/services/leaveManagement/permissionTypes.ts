import apiClient from '@/configs/api/Axios'

class PermissionTypesApi {
  getActive() {
    return apiClient.get('/permissionType/active')
  }

  list(params: any) {
    return apiClient.get('/permissionType/all', { params })
  }

  get(id: number) {
    return apiClient.get(`/permissionType/${id}`);
  }

  create(payload: any) {
    return apiClient.post('/permissionType', payload);
  }

  update(id: number, payload: any) {
    return apiClient.put(`/permissionType/${id}`, payload);
  }

  remove(id: number) {
    return apiClient.delete(`/permissionType/${id}`);
  }
}

const permissionTypesApi = new PermissionTypesApi()
export default permissionTypesApi

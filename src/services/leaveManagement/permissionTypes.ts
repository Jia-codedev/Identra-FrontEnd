import apiClient from '@/configs/api/Axios'

class PermissionTypesApi {
  getActive() {
    return apiClient.get('/permissionType/active')
  }

  list(params: any) {
    return apiClient.get('/permissionType/all', { params })
  }
}

const permissionTypesApi = new PermissionTypesApi()
export default permissionTypesApi

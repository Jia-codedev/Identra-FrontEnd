import apiClient from "@/configs/api/Axios";

class RolesApi {
  getRoles(
    { offset = 1, limit = 10, search = "" } = {} as {
      offset?: number;
      limit?: number;
      search?: string;
    }
  ) {
    return apiClient.get("/secRole/all", {
      params: { offset, limit, ...(search && { search }) },
    });
  }

  getRoleById(id: number) {
    return apiClient.get(`/secRole/get/${id}`);
  }
}

const rolesApi = new RolesApi();
export default rolesApi;

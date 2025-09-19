import apiClient from "@/configs/api/Axios";

class RolesApi {
  // Backend pagination expects `offset` starting at 1 (page number), not 0.
  // Default `limit` set to 10 to match frontend dropdown page size.
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

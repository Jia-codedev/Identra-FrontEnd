import { IOrganizationType } from "@/modules/masterdata/organizationtypes/types";
import apiClient from "@/configs/api/Axios";

class OrganizationTypesApi {
  getOrganizationTypes(
    { offset = 0, limit = 10, name = "" } = {} as {
      offset?: number;
      limit?: number;
      name?: string;
    }
  ) {
    return apiClient.get("/organizationtype/all", {
      params: {
        offset,
        limit,
        name,
      },
    });
  }
  getOrganizationTypesWithoutPagination(
  ) {
    return apiClient.get("/organizationtype");
  }
  getOrganizationTypeById(id: number) {
    return apiClient.get(`/organizationtype/${id}`);
  }
  addOrganizationType(data: Partial<IOrganizationType>) {
    return apiClient.post("/organizationtype/add", data);
  }
  updateOrganizationType(id: number, data: Partial<IOrganizationType>) {
    return apiClient.put(`/organizationtype/edit/${id}`, data);
  }
  deleteOrganizationType(id: number) {
    return apiClient.delete(`/organizationtype/delete/${id}`);
  }
  deleteOrganizationTypes(ids: number[]) {
    return apiClient.delete("/organizationtype/delete", { data: { ids } });
  }
}
const organizationTypesApi = new OrganizationTypesApi();
export default organizationTypesApi;

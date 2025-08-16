import { IOrganization } from "@/modules/masterdata/organizations/types";
import apiClient from "@/configs/api/Axios";

class OrganizationsApi {
  getOrganizations(
    { offset = 0, limit = 10, name = "" } = {} as {
      offset?: number;
      limit?: number;
      name?: string;
    }
  ) {
    return apiClient.get("/organization/all", {
      params: {
        offset,
        limit,
        name,
      },
    });
  }
  getOrganizationById(id: number) {
    return apiClient.get(`/organization/${id}`);
  }
  getOrganizationsWithoutPagination() {
    return apiClient.get("/organization/all");
  }
  addOrganization(data: Partial<IOrganization>) {
    return apiClient.post("/organization/add", data);
  }
  updateOrganization(id: number, data: Partial<IOrganization>) {
    return apiClient.put(`/organization/edit/${id}`, data);
  }
  deleteOrganization(id: number) {
    return apiClient.delete(`/organization/delete/${id}`);
  }
  deleteOrganizations(ids: number[]) {
    return apiClient.delete("/organization/delete", { data: { ids } });
  }
  
  getOrganizationStructure() {
    return apiClient.get("/organization/structure");
  }

  // Dropdown specific endpoint
  getOrganizationsForDropdown(params?: {
    offset?: number;
    limit?: number;
    name?: string;
  }) {
    return apiClient.get("/organization/", { params });
  }
}
const organizationsApi = new OrganizationsApi();
export default organizationsApi;
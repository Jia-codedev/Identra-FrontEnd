import { IOrganization } from "@/modules/masterdata/organizations/types";
import apiClient from "@/configs/api/Axios";

class OrganizationsApi {
  getOrganizations(
    { offset = 0, limit = 10, search = "" } = {} as {
      offset?: number;
      limit?: number;
      search?: string;
    }
  ) {
    return apiClient.get("/organization/all", {
      params: {
        offset,
        limit,
        ...(search && { search }),
      },
    });
  }
  getOrganizationById(id: number) {
    return apiClient.get(`/organization/get/${id}`);
  }
  getOrganizationsWithoutPagination() {
    return apiClient.get("/organization");
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

  getOrganizationsForDropdown(params?: {
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    return apiClient.get("/organization/all", { params });
  }

  getOrganizationDropdownList() {
    return apiClient.get("/organization/dropdown-list");
  }
}
const organizationsApi = new OrganizationsApi();
export default organizationsApi;

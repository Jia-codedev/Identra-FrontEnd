import { ISite } from "@/modules/masterdata/site-management";
import apiClient from "@/configs/api/Axios";

class SitesApi {
  getSites(
    { offset = 0, limit = 10, name = "", code = "" } = {} as {
      offset?: number;
      limit?: number;
      name?: string;
      code?: string;
    }
  ) {
    return apiClient.get("/location/all", {
      params: {
        offset,
        limit,
        name,
        code,
      },
    });
  }
  getSiteById(id: number) {
    return apiClient.get(`/location/${id}`);
  }
  getSitesWithoutPagination() {
    return apiClient.get("/location").then((response) => response.data);
  }
  addSite(data: Partial<ISite>) {
    return apiClient.post("/location/add", data);
  }
  updateSite(id: number, data: Partial<ISite>) {
    return apiClient.put(`/location/edit/${id}`, data);
  }
  deleteSite(id: number) {
    return apiClient.delete(`/location/delete/${id}`);
  }
  deleteSites(ids: number[]) {
    return apiClient.delete("/location/delete", { data: { ids } });
  }
}
const sitesApi = new SitesApi();
export default sitesApi;

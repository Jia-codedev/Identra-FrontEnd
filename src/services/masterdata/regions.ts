import { IRegion } from "@/app/_modules/masterdata/regions";
import apiClient from "@/configs/api/Axios";

class RegionsApi {
  getRegions(
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
  getRegionById(id: number) {
    return apiClient.get(`/location/${id}`);
  };
  getRegionsWithoutPagination() {
    return apiClient.get("/location").then(response => response.data);
  }
  addRegion(data: Partial<IRegion>) {
    return apiClient.post("/location/add", data);
  }
  updateRegion(id: number, data: Partial<IRegion>) {
    return apiClient.put(`/location/edit/${id}`, data);
  }
  deleteRegion(id: number) {
    return apiClient.delete(`/location/delete/${id}`);
  }
  deleteRegions(ids: number[]) {
    return apiClient.delete("/location/delete", { data: { ids } });
  }
}
const regionsApi = new RegionsApi();
export default regionsApi;

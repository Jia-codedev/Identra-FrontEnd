import apiClient from "@/configs/api/Axios";

class LocationsApi {
  getLocations(params?: {
    offset?: number;
    limit?: number;
    name?: string;
    code?: string;
  }) {
    return apiClient.get("/location/all", { params });
  }

  getLocationById(id: number) {
    return apiClient.get(`/location/${id}`);
  }

  getLocationsWithoutPagination() {
    return apiClient.get("/location/all");
  }

  addLocation(data: any) {
    return apiClient.post("/location/add", data);
  }

  updateLocation(id: number, data: any) {
    return apiClient.put(`/location/edit/${id}`, data);
  }

  deleteLocation(id: number) {
    return apiClient.delete(`/location/delete/${id}`);
  }

  deleteLocations(ids: number[]) {
    return apiClient.delete("/location/delete", { data: { ids } });
  }

  getLocationsForDropdown(params?: {
    offset?: number;
    limit?: number;
    name?: string;
  }) {
    return apiClient.get("/location/", { params });
  }
}

const locationsApi = new LocationsApi();
export default locationsApi;

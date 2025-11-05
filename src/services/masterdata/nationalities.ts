import { INationality } from "@/modules/masterdata/nationalities/types";
import apiClient from "@/configs/api/Axios";

class NationalitiesApi {
  getNationalities(
    { offset = 0, limit = 10, search = "" }: { offset?: number; limit?: number; search?: string } = {}
  ) {
    return apiClient.get("/citizenship/all", {
      params: {
        offset,
        limit,
        search,
      },
    });
  }
  
  getNationalityById(id: number) {
    return apiClient.get(`/citizenship/get/${id}`);
  }
  
  addNationality(data: Partial<INationality>) {
    return apiClient.post("/citizenship/add", data);
  }
  
  updateNationality(id: number, data: Partial<INationality>) {
    return apiClient.put(`/citizenship/edit/${id}` , data);
  }
  
  deleteNationality(id: number) {
    return apiClient.delete(`/citizenship/delete/${id}`);
  }
  
  deleteNationalities(ids: number[]) {
    return apiClient.delete("/citizenship/delete", { data: { ids } });
  }

  getNationalitiesWithoutPagination() {
    return apiClient.get("/citizenship");
  }
}

const nationalitiesApi = new NationalitiesApi();
export default nationalitiesApi;

import { INationality } from "@/modules/masterdata/nationalities/types";
import apiClient from "@/configs/api/Axios";

class NationalitiesApi {
  getNationalities(
    { offset = 0, limit = 10, name = "", code = "" } = {} as {
      offset?: number;
      limit?: number;
      name?: string;
      code?: string;
    }
  ) {
    return apiClient.get("/citizenship/all", {
      params: {
        offset,
        limit,
        name,
        code,
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
}

const nationalitiesApi = new NationalitiesApi();
export default nationalitiesApi;

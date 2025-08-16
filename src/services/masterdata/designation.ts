import { IDesignation } from "@/modules/masterdata/designations/types";
import apiClient from "@/configs/api/Axios";

class DesignationsApi {
  getDesignations(
    { offset = 0, limit = 10, name = "", code = "" } = {} as {
      offset?: number;
      limit?: number;
      name?: string;
      code?: string;
    }
  ) {
    return apiClient.get("/designation/all", {
      params: {
        offset,
        limit,
        name,
        code,
      },
    });
  }

  getDesignationById(id: number) {
    return apiClient.get(`/designation/${id}`);
  }

  addDesignation(data: Partial<IDesignation>) {
    return apiClient.post("/designation/add", data);
  }

  updateDesignation(id: number, data: Partial<IDesignation>) {
    return apiClient.put(`/designation/edit/${id}`, data);
  }

  deleteDesignation(id: number) {
    return apiClient.delete(`/designation/delete/${id}`);
  }

  deleteDesignations(ids: number[]) {
    return apiClient.delete("/designation/delete", { data: { ids } });
  }
}

const designationsApi = new DesignationsApi();
export default designationsApi;

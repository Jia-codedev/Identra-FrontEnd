import { IDesignation } from "@/modules/masterdata/designations/types";
import apiClient from "@/configs/api/Axios";

class DesignationsApi {
  getDesignations(
    { offset = 0, limit = 10, search = "" }: { offset?: number; limit?: number; search?: string } = {}
  ) {
    return apiClient.get("/designation/all", {
      params: {
        offset,
        limit,
        search,
      },
    });
  }

  getDesignationById(id: number) {
    return apiClient.get(`/designation/get/${id}`);
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

  getDesignationsWithoutPagination() {
    return apiClient.get("/designation");
  }
}

const designationsApi = new DesignationsApi();
export default designationsApi;

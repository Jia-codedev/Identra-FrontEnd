import { IGrade } from "@/modules/masterdata/grades/types";
import apiClient from "@/configs/api/Axios";

class GradesApi {
  getGrades(
    { offset = 0, limit = 10, search = "" }: { offset?: number; limit?: number; search?: string } = {}
  ) {
    return apiClient.get("/grade/all", {
      params: {
        offset,
        limit,
        search,
      },
    });
  }
  getGradeById(id: number) {
    return apiClient.get(`/grade/${id}`);
  }
  addGrade(data: Partial<IGrade>) {
    return apiClient.post("/grade/add", data);
  }
  updateGrade(id: number, data: Partial<IGrade>) {
    return apiClient.put(`/grade/edit/${id}` , data);
  }
  deleteGrade(id: number) {
    return apiClient.delete(`/grade/delete/${id}`);
  }
  deleteGrades(ids: number[]) {
    return apiClient.delete("/grade/delete", { data: { ids } });
  }

  getGradesWithoutPagination() {
    return apiClient.get("/grade");
  }
}
const gradesApi = new GradesApi();
export default gradesApi;

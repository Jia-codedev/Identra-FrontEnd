import { IGrade } from "@/modules/masterdata/grades/types";
import apiClient from "@/configs/api/Axios";

class GradesApi {
  getGrades(
    { offset = 0, limit = 10, name = "", code = "" } = {} as {
      offset?: number;
      limit?: number;
      name?: string;
      code?: string;
    }
  ) {
    return apiClient.get("/grade/all", {
      params: {
        offset,
        limit,
        name,
        code,
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
}
const gradesApi = new GradesApi();
export default gradesApi;

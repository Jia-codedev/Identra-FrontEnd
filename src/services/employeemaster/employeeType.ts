import { IEmployeeType } from "@/modules/employeemaster/employeeType/types";
import apiClient from "@/configs/api/Axios";

class EmployeeTypeApi {
  getEmployeeTypes(
    { offset = 0, limit = 10, name = "", code = "" } = {} as {
      offset?: number;
      limit?: number;
      name?: string;
      code?: string;
    }
  ) {
    return apiClient.get("/employeeType/all", {
      params: {
        offset,
        limit,
        name,
        code,
      },
    });
  }
  getEmployeeTypeById(id: number) {
    return apiClient.get(`/employeeType/get/${id}`);
  }
  addEmployeeType(data: Partial<IEmployeeType>) {
    return apiClient.post("/employeeType/add", data);
  }
  updateEmployeeType(id: number, data: Partial<IEmployeeType>) {
    return apiClient.put(`/employeeType/edit/${id}` , data);
  }
  deleteEmployeeType(id: number) {
    return apiClient.delete(`/employeeType/delete/${id}`);
  }
  deleteEmployeeTypes(ids: number[]) {
    return apiClient.delete("/employeeType/delete", { data: { ids } });
  }
}
const employeeTypeApi = new EmployeeTypeApi();
export default employeeTypeApi;

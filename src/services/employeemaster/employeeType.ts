import { IEmployeeType } from "@/modules/employeemaster/employeeType/types";
import apiClient from "@/configs/api/Axios";

class EmployeeTypeApi {
  getEmployeeTypes(
    { offset = 0, limit = 10, search = "", code } = {} as {
      offset?: number;
      limit?: number;
      search?: string;
      code?: string;
    }
  ) {
    return apiClient.get("/employeeType/all", {
      params: {
        offset,
        limit,
        ...(search && { search }),
        ...(typeof code !== 'undefined' && { code }),
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

  getEmployeeTypesWithoutPagination() {
    return apiClient.get("/employeeType");
  }
}
const employeeTypeApi = new EmployeeTypeApi();
export default employeeTypeApi;

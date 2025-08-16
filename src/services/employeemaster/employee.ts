import { IEmployee } from "@/modules/employeemaster/employee/types";
import apiClient from "@/configs/api/Axios";

class EmployeeApi {
  getEmployees(
    { offset = 0, limit = 10, search = "", manager_flag = null } = {} as {
      offset?: number;
      limit?: number;
      search?: string;
      manager_flag?: boolean | null;
    }
  ) {
    return apiClient.get("/employee/all", {
      params: {
        offset,
        limit,
        ...(search && { name: search }), // The backend expects 'name' parameter for search
        ...(manager_flag !== null && { manager_flag: manager_flag.toString() }),
      },
    });
  }

  getEmployeesWithoutPagination() {
    return apiClient.get("/employee");
  }

  getEmployeeById(id: number) {
    return apiClient.get(`/employee/get/${id}`);
  }

  searchEmployees(search: string, limit = 10) {
    return apiClient.get("/employee/search", {
      params: { search, limit },
    });
  }

  addEmployee(data: Partial<IEmployee>) {
    return apiClient.post("/employee/add", data);
  }

  updateEmployee(id: number, data: Partial<IEmployee>) {
    return apiClient.put(`/employee/edit/${id}`, data);
  }

  deleteEmployee(id: number) {
    return apiClient.delete(`/employee/delete/${id}`);
  }
  deleteEmployees(ids: number[]) {
    return apiClient.delete("/employee/delete", { data: { ids } });
  }

  getEmployeeLookupData() {
    return Promise.all([
      apiClient.get("/organization"),
      apiClient.get("/grade"),
      apiClient.get("/designation"),
      apiClient.get("/citizenship"),
      apiClient.get("/employeeType"),
      apiClient.get("/location"),
    ]);
  }

  getManagerByName(name: string) {
    return apiClient.get(`/employee/managers`, {
      params: { name },
    });
  }

  getEmployeeGroupById(id: number) {
    return apiClient.get(`/employeeGroup/get/${id}`);
  }
}

const employeeApi = new EmployeeApi();
export default employeeApi;

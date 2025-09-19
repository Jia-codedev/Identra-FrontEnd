import { IEmployeeGroup } from "@/modules/employeemaster/employeeGroup/types";
import apiClient from "@/configs/api/Axios";

class EmployeeGroupApi {
  getEmployeeGroups(
    { offset = 0, limit = 10, search = "", code } = {} as {
      offset?: number;
      limit?: number;
      search?: string;
      code?: string | number;
    }
  ) {
    return apiClient.get("/employeeGroup/all", {
      params: {
        offset,
        limit,
        ...(search && { search }),
        ...(typeof code !== 'undefined' && { code }),
      },
    });
  }

  getEmployeeGroupsForDropdown(search?: string) {
    return apiClient.get(`/employeeGroup`, {
      params: {
        name: search && search.trim() !== "" ? search.trim() : undefined,
      },
    });
  }

  getEmployeeGroupById(id: number) {
    return apiClient.get(`/employeeGroup/get/${id}`);
  }

  addEmployeeGroup(data: Partial<IEmployeeGroup>) {
    return apiClient.post("/employeeGroup/add", data);
  }

  updateEmployeeGroup(id: number, data: Partial<IEmployeeGroup>) {
    return apiClient.put(`/employeeGroup/edit/${id}`, data);
  }

  deleteEmployeeGroup(id: number) {
    return apiClient.delete(`/employeeGroup/delete/${id}`);
  }

  deleteEmployeeGroups(ids: number[]) {
    return apiClient.post("/employeeGroup/delete", { ids });
  }
}

const employeeGroupApi = new EmployeeGroupApi();
export default employeeGroupApi;

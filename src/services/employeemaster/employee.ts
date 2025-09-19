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
        ...(search && { search }), // The backend expects 'search' parameter for name search
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

  checkEmployeeNumberExists(empNo: string) {
    return apiClient.get("/employee/check-emp-no", {
      params: { emp_no: empNo },
    });
  }

  checkEmailExists(email: string) {
    return apiClient.get("/employee/check-email", {
      params: { email },
    });
  }

  addEmployee(data: Partial<IEmployee>) {
    return apiClient.post("/employee/add", data).catch((err) => {
      // Attach request payload to error for easier debugging
      try {
        console.error("addEmployee payload:", data);
        console.error(
          "addEmployee error response:",
          err?.response?.data || err.message
        );
      } catch {}
      
      // Enhance error message for better user experience
      if (err?.response?.status === 409) {
        const errorMessage = err?.response?.data?.message || 'Duplicate entry found';
        const enhancedError = new Error(errorMessage);
        enhancedError.name = 'ConflictError';
        (enhancedError as any).status = 409;
        (enhancedError as any).originalError = err;
        throw enhancedError;
      }
      
      throw err;
    });
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

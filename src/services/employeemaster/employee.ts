import { IEmployee } from "@/modules/employeemaster/employee/types";
import apiClient from "@/configs/api/Axios";

class EmployeeApi {
  getEmployees(
    {
      offset = 0,
      limit = 10,
      search = "",
      manager_flag = null,
      organization_id = null,
    } = {} as {
      offset?: number;
      limit?: number;
      search?: string;
      manager_flag?: boolean | null;
      organization_id?: number | null;
    }
  ) {
    return apiClient.get("/employee/all", {
      params: {
        offset,
        limit,
        ...(search && { search }),
        ...(manager_flag !== null && { manager_flag: manager_flag.toString() }),
        ...(organization_id !== null && { organization_id }),
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
    // Clean the data before sending
    const cleanedData = this.cleanEmployeeData(data);

    return apiClient.post("/employee/add", cleanedData).catch((err) => {
      try {
        console.error("addEmployee payload:", cleanedData);
        console.error(
          "addEmployee error response:",
          err?.response?.data || err.message
        );
      } catch {}

      if (err?.response?.status === 409) {
        const errorMessage =
          err?.response?.data?.message || "Duplicate entry found";
        const enhancedError = new Error(errorMessage);
        enhancedError.name = "ConflictError";
        (enhancedError as any).status = 409;
        (enhancedError as any).originalError = err;
        throw enhancedError;
      }

      throw err;
    });
  }

  updateEmployee(id: number, data: Partial<IEmployee>) {
    // Clean the data before sending
    const cleanedData = this.cleanEmployeeData(data);
    return apiClient.put(`/employee/edit/${id}`, cleanedData);
  }

  // Helper method to clean employee data
  private cleanEmployeeData(data: Partial<IEmployee>): any {
    const cleaned: any = {};

    // Process each field
    Object.keys(data).forEach((key) => {
      const value = (data as any)[key];

      // Skip undefined and null values
      if (value === undefined || value === null) {
        return;
      }

      // Convert empty strings to undefined for optional fields
      if (
        typeof value === "string" &&
        value.trim() === "" &&
        key !== "emp_no" &&
        !key.includes("firstname") &&
        !key.includes("lastname")
      ) {
        return;
      }

      // Keep the value
      cleaned[key] = value;
    });

    return cleaned;
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

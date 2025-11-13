import { IDepartment } from "@/modules/organization/departments/types";
import apiClient from "@/configs/api/Axios";

class DepartmentsApi {
  getDepartments({
    page = 1,
    limit = 10,
    search = "",
  }: { page?: number; limit?: number; search?: string } = {}) {
    return apiClient.get("/department", {
      params: {
        page,
        limit,
        search,
      },
    });
  }

  getDepartmentById(id: number) {
    return apiClient.get(`/department/${id}`);
  }

  addDepartment(data: Partial<IDepartment>) {
    return apiClient.post("/department", data);
  }

  updateDepartment(id: number, data: Partial<IDepartment>) {
    return apiClient.put(`/department/${id}`, data);
  }

  deleteDepartment(id: number) {
    return apiClient.delete(`/department/${id}`);
  }

  deleteDepartments(ids: number[]) {
    return apiClient.delete("/department/bulk", { data: { ids } });
  }

  getDepartmentsWithoutPagination() {
    return apiClient.get("/department", { params: { limit: 1000 } });
  }

  getDepartmentsByOrganization(organizationId: number) {
    return apiClient.get(`/department/organization/${organizationId}`);
  }
}

const departmentsApi = new DepartmentsApi();
export default departmentsApi;

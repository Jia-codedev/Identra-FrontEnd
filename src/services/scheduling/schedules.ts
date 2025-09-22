import { CreateScheduleRequest, UpdateScheduleRequest } from "@/modules/scheduling/scheduletypes/types";
import apiClient from "@/configs/api/Axios";

class SchedulesApi {
  getSchedules(params?: {
    limit?: number;
    offset?: number;
  }) {
    return apiClient.get("/schedule/all", { params });
  }

  getSchedulesForDropdown(params?: {
    organization_id?: number;
    status_flag?: boolean;
  }) {
    return apiClient.get("/schedule", { params });
  }

  searchSchedules(params?: {
    code?: string;
    organization?: string;
    limit?: number;
    offset?: number;
  }) {
    return apiClient.get("/schedule/search", { params });
  }

  getScheduleById(id: number) {
    return apiClient.get(`/schedule/get${id}`);
  }

  getSchedulesByOrganization(organizationId: number) {
    return apiClient.get(`/schedule/organization/${organizationId}`);
  }

  addSchedule(data: CreateScheduleRequest) {
    return apiClient.post("/schedule/add", data);
  }

  updateSchedule(id: number, data: UpdateScheduleRequest) {
    return apiClient.put(`/schedule/edit/${id}`, data);
  }

  deleteSchedule(id: number) {
    return apiClient.delete(`/schedule/delete/${id}`);
  }

  deleteMultipleSchedules(ids: number[]) {
    return apiClient.delete("/schedule/delete-many", { data: { ids } });
  }
}

const schedulesApi = new SchedulesApi();
export default schedulesApi;

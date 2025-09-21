import apiClient from "@/configs/api/Axios";

export interface OrganizationSchedule {
  organization_schedule_id?: number;
  organization_id: number;
  from_date: string;
  to_date?: string;
  monday_schedule_id?: number;
  tuesday_schedule_id?: number;
  wednesday_schedule_id?: number;
  thursday_schedule_id?: number;
  friday_schedule_id?: number;
  saturday_schedule_id?: number;
  sunday_schedule_id?: number;
  created_id: number;
  created_date?: string;
  last_updated_id: number;
  last_updated_date?: string;
}

export interface CreateOrganizationScheduleRequest {
  from_date: string;
  to_date?: string;
  organization_id: number;
  monday_schedule_id?: number;
  tuesday_schedule_id?: number;
  wednesday_schedule_id?: number;
  thursday_schedule_id?: number;
  friday_schedule_id?: number;
  saturday_schedule_id?: number;
  sunday_schedule_id?: number;
}

export interface OrganizationScheduleFilters {
  organization_id?: number;
  from_date?: string;
  to_date?: string;
}

class OrganizationSchedulesApi {
  // Organization Schedules Management
  getOrganizationSchedules(
    { offset = 1, limit = 10, search = "" } = {} as {
      offset?: number;
      limit?: number;
      search?: string;
    }
  ) {
    return apiClient.get("/organizationSchedule/all", {
      params: { offset, limit, ...(search && { search }) },
    });
  }

  getOrganizationScheduleById(id: number) {
    return apiClient.get(`/organizationSchedule/get/${id}`);
  }

  createOrganizationSchedule(data: CreateOrganizationScheduleRequest) {
    return apiClient.post("/organizationSchedule/add", data);
  }

  updateOrganizationSchedule(id: number, data: Partial<CreateOrganizationScheduleRequest>) {
    return apiClient.put(`/organizationSchedule/edit/${id}`, data);
  }

  deleteOrganizationSchedule(id: number) {
    return apiClient.delete(`/organizationSchedule/delete/${id}`);
  }

  filterOrganizationSchedules(filters: OrganizationScheduleFilters) {
    return apiClient.get("/organizationSchedule/filter", { params: filters });
  }
}

const organizationSchedulesApi = new OrganizationSchedulesApi();
export default organizationSchedulesApi;
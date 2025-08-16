import apiClient from '@/configs/api/Axios';

export interface IGroupSchedule {
  group_schedule_id?: number;
  employee_group_id: number;
  from_date: string;
  to_date: string;
  monday_schedule_id?: number | null;
  tuesday_schedule_id?: number | null;
  wednesday_schedule_id?: number | null;
  thursday_schedule_id?: number | null;
  friday_schedule_id?: number | null;
  saturday_schedule_id?: number | null;
  sunday_schedule_id?: number | null;
  created_id: number;
  created_time: string;
  last_updated_id: number;
  last_updated_date: string;
  // Related data that might be included in API responses
  employee_group?: {
    group_id: number;
    group_eng: string;
    group_arb: string;
  };
  monday_schedule?: {
    schedule_id: number;
    schedule_code: string;
    in_time?: string;
    out_time?: string;
    sch_color?: string;
  };
  tuesday_schedule?: {
    schedule_id: number;
    schedule_code: string;
    in_time?: string;
    out_time?: string;
    sch_color?: string;
  };
  wednesday_schedule?: {
    schedule_id: number;
    schedule_code: string;
    in_time?: string;
    out_time?: string;
    sch_color?: string;
  };
  thursday_schedule?: {
    schedule_id: number;
    schedule_code: string;
    in_time?: string;
    out_time?: string;
    sch_color?: string;
  };
  friday_schedule?: {
    schedule_id: number;
    schedule_code: string;
    in_time?: string;
    out_time?: string;
    sch_color?: string;
  };
  saturday_schedule?: {
    schedule_id: number;
    schedule_code: string;
    in_time?: string;
    out_time?: string;
    sch_color?: string;
  };
  sunday_schedule?: {
    schedule_id: number;
    schedule_code: string;
    in_time?: string;
    out_time?: string;
    sch_color?: string;
  };
}

export interface ICreateGroupSchedule {
  employee_group_id: number;
  from_date: string;
  to_date: string;
  monday_schedule_id?: number;
  tuesday_schedule_id?: number;
  wednesday_schedule_id?: number;
  thursday_schedule_id?: number;
  friday_schedule_id?: number;
  saturday_schedule_id?: number;
  sunday_schedule_id?: number;
  created_id: number;
  last_updated_id: number;
}

export interface IUpdateGroupSchedule {
  employee_group_id?: number;
  from_date?: string;
  to_date?: string;
  monday_schedule_id?: number;
  tuesday_schedule_id?: number;
  wednesday_schedule_id?: number;
  thursday_schedule_id?: number;
  friday_schedule_id?: number;
  saturday_schedule_id?: number;
  sunday_schedule_id?: number;
  last_updated_id: number;
}

class GroupSchedulesApi {
  private baseUrl = '/groupSchedule';

  // Get all group schedules
  async getAll() {
    const response = await apiClient.get(`${this.baseUrl}/all`);
    return response.data;
  }

  // Get group schedule by ID
  async getById(id: number) {
    const response = await apiClient.get(`${this.baseUrl}/get/${id}`);
    return response.data;
  }

  // Create new group schedule
  async create(data: ICreateGroupSchedule) {
    const response = await apiClient.post(`${this.baseUrl}/add`, data);
    return response.data;
  }

  // Update group schedule
  async update(id: number, data: IUpdateGroupSchedule) {
    const response = await apiClient.put(`${this.baseUrl}/edit/${id}`, data);
    return response.data;
  }

  // Delete group schedule
  async delete(id: number) {
    const response = await apiClient.delete(`${this.baseUrl}/delete/${id}`);
    return response.data;
  }

  // Delete multiple group schedules
  async deleteMany(ids: number[]) {
    const response = await apiClient.delete(`${this.baseUrl}/delete-many`, {
      data: { group_schedule_ids: ids }
    });
    return response.data;
  }
}

const groupSchedulesApi = new GroupSchedulesApi();
export default groupSchedulesApi;

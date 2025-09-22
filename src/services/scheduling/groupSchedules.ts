import apiClient from "@/configs/api/Axios";

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
    open_shift_flag?: boolean;
    night_shift_flag?: boolean;
    ramadan_flag?: boolean;
  };
  tuesday_schedule?: {
    schedule_id: number;
    schedule_code: string;
    in_time?: string;
    out_time?: string;
    sch_color?: string;
    open_shift_flag?: boolean;
    night_shift_flag?: boolean;
    ramadan_flag?: boolean;
  };
  wednesday_schedule?: {
    schedule_id: number;
    schedule_code: string;
    in_time?: string;
    out_time?: string;
    sch_color?: string;
    open_shift_flag?: boolean;
    night_shift_flag?: boolean;
    ramadan_flag?: boolean;
  };
  thursday_schedule?: {
    schedule_id: number;
    schedule_code: string;
    in_time?: string;
    out_time?: string;
    sch_color?: string;
    open_shift_flag?: boolean;
    night_shift_flag?: boolean;
    ramadan_flag?: boolean;
  };
  friday_schedule?: {
    schedule_id: number;
    schedule_code: string;
    in_time?: string;
    out_time?: string;
    sch_color?: string;
    open_shift_flag?: boolean;
    night_shift_flag?: boolean;
    ramadan_flag?: boolean;
  };
  saturday_schedule?: {
    schedule_id: number;
    schedule_code: string;
    in_time?: string;
    out_time?: string;
    sch_color?: string;
    open_shift_flag?: boolean;
    night_shift_flag?: boolean;
    ramadan_flag?: boolean;
  };
  sunday_schedule?: {
    schedule_id: number;
    schedule_code: string;
    in_time?: string;
    out_time?: string;
    sch_color?: string;
    open_shift_flag?: boolean;
    night_shift_flag?: boolean;
    ramadan_flag?: boolean;
  };
}

export interface IGroupSchedulesResponse {
  success: boolean;
  data: IGroupSchedule[];
  total?: number;
  hasNext?: boolean;
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
  private baseUrl = "/groupSchedule";

  async getAll(params?: {
    offset?: number;
    limit?: number;
    employee_group_id?: number;
    start_date?: string;
    end_date?: string;
    search?: string;
  }) {
    const response = await apiClient.get(`${this.baseUrl}/all`, { params });
    return response.data as IGroupSchedulesResponse;
  }

  async getById(id: number) {
    const response = await apiClient.get(`${this.baseUrl}/get/${id}`);
    return response.data;
  }

  async create(data: ICreateGroupSchedule) {
    const response = await apiClient.post(`${this.baseUrl}/add`, data);
    return response.data;
  }

  async update(id: number, data: IUpdateGroupSchedule) {
    const response = await apiClient.put(`${this.baseUrl}/edit/${id}`, data);
    return response.data;
  }

  async delete(id: number) {
    const response = await apiClient.delete(`${this.baseUrl}/delete/${id}`);
    return response.data;
  }

  async deleteMany(ids: number[]) {
    const response = await apiClient.delete(`${this.baseUrl}/delete`, {
      data: { group_schedule_ids: ids },
    });
    return response.data;
  }
}

const groupSchedulesApi = new GroupSchedulesApi();
export default groupSchedulesApi;

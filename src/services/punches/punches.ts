import apiClient from "@/configs/api/Axios";

export interface EmployeeEventTransactions {
  transaction_time: Date;
  reason: "IN" | "OUT";
  remarks?: string | null;
  device_id?: number | null;
  user_entry_flag: boolean;
  created_id: number;
  created_date?: Date;
  geolocation?: string | null;
}

export interface PunchStatusResponse {
  success: boolean;
  data: {
    employee_id: number;
    scheduled_in_time: Date | null;
    scheduled_out_time: Date | null;
    actual_in_time: Date | null;
    actual_out_time: Date | null;
    current_status: "IN" | "OUT";
    punch_status: string;
  };
}

export interface ScheduleInfo {
  has_schedule: boolean;
  is_open_shift: boolean;
  schedule_source: string;
  day_type: "holiday" | "working_day";
  schedule_info?: {
    schedule_id: number;
    schedule_code: string;
    in_time: Date;
    out_time: Date;
    flexible_minutes: number;
    grace_in_minutes: number;
    grace_out_minutes: number;
    is_night_shift: boolean;
    is_ramadan_schedule: boolean;
    required_work_hours: number | null;
    schedule_color: string | null;
    calculate_worked_hours: boolean;
    default_overtime: boolean;
    expected_work_duration?: {
      total_minutes: number;
      hours: number;
      minutes: number;
      formatted: string;
    };
    actual_in_time?: Date;
    actual_out_time?: Date;
    location: any;
  };
  holiday_info?: any;
}

// Always fetch fresh server time per request
const getServerTime = async (): Promise<Date> => {
  const res = await apiClient.get("/systime");
  return new Date(res.data.time);
};

class EmployeeEventTransactionApi {
  async punch(data: EmployeeEventTransactions) {
    // Use client's local time for the transaction timestamp
    const time = new Date();
    return apiClient.post("/employeeEventTransaction/add", {
      ...data,
      transaction_time: time,
    });
  }

  async getPunchStatus(employee_id?: number): Promise<PunchStatusResponse> {
    const response = await apiClient.get("/employeeEventTransaction/punchStatus", {
      params: employee_id ? { employee_id } : undefined,
    });
    return response.data;
  }

  async getTodaySchedule(): Promise<{ success: boolean; data: ScheduleInfo }> {
    const response = await apiClient.get("/employeeEventTransaction/todayStatus");
    return response.data;
  }

  async checkIn(employee_id: number, geolocation?: string) {
    // Use client's local time for punch-in
    const time = new Date();
    return apiClient.post("/employeeEventTransaction/add", {
      employee_id,
      transaction_time: time,
      reason: "IN",
      user_entry_flag: true,
      geolocation,
    });
  }

  async checkOut(employee_id: number, geolocation?: string) {
    // Use client's local time for punch-out
    const time = new Date();
    return apiClient.post("/employeeEventTransaction/add", {
      employee_id,
      transaction_time: time,
      reason: "OUT",
      user_entry_flag: true,
      geolocation,
    });
  }
}

const employeeEventTransactionApi = new EmployeeEventTransactionApi();
export default employeeEventTransactionApi;

import { CreateHolidayRequest, UpdateHolidayRequest } from "@/modules/scheduling/holidays/types";
import apiClient from "@/configs/api/Axios";

class HolidaysApi {
  getHolidays(params?: {
    year?: number;
    month?: number;
    recurring_flag?: boolean;
    public_holiday_flag?: boolean;
    limit?: number;
    offset?: number;
  }) {
    return apiClient.get("/holiday/all", { params });
  }

  getHolidayById(id: number) {
    return apiClient.get(`/holiday/get/${id}`);
  }

  addHoliday(data: CreateHolidayRequest) {
    return apiClient.post("/holiday/add", data);
  }

  updateHoliday(id: number, data: UpdateHolidayRequest) {
    return apiClient.put(`/holiday/edit/${id}`, data);
  }

  deleteHoliday(id: number) {
    return apiClient.delete(`/holiday/delete/${id}`);
  }

  getUpcomingHolidays(days: number = 30) {
    return apiClient.get("/holiday/upcoming", { 
      params: { days } 
    });
  }
}

const holidaysApi = new HolidaysApi();
export default holidaysApi;

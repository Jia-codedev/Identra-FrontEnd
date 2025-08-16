import { CreateRamadanDateRequest, UpdateRamadanDateRequest } from "@/modules/scheduling/ramadandates/types";
import apiClient from "@/configs/api/Axios";

class RamadanDatesApi {
  getRamadanDates(params?: {
    year?: number;
    month?: number;
  }) {
    return apiClient.get("/ramadan/all", { params });
  }

  getRamadanDateById(id: number) {
    return apiClient.get(`/ramadan/get/${id}`);
  }

  addRamadanDate(data: CreateRamadanDateRequest) {
    return apiClient.post("/ramadan/add", data);
  }

  updateRamadanDate(id: number, data: UpdateRamadanDateRequest) {
    return apiClient.put(`/ramadan/edit/${id}`, data);
  }

  deleteRamadanDate(id: number) {
    return apiClient.delete(`/ramadan/delete/${id}`);
  }

  getCurrentRamadanDates() {
    return apiClient.get("/ramadan/current");
  }

  getUpcomingRamadanDates(days: number = 30) {
    return apiClient.get("/ramadan/upcoming", { 
      params: { days } 
    });
  }
}

const ramadanDatesApi = new RamadanDatesApi();
export default ramadanDatesApi;

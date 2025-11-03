import apiClient from "@/configs/api/Axios";

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  employeeId?: number;
  organization?: string;
  limit?: number;
  offset?: number;
}

class ReportsApi {
  getFilteredReport(filters: ReportFilters = {}) {
    return apiClient.get("/report", { params: filters });
  }

  getNewReport() {
    return apiClient.get("/report/new");
  }
}

const reportsApi = new ReportsApi();
export default reportsApi;
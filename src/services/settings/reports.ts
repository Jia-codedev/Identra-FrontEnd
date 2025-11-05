import apiClient from "@/configs/api/Axios";

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  employeeId?: number;
  organization?: string;
  limit?: number;
  offset?: number;
}

export interface NewReportFilters extends ReportFilters {
  organizationId?: number;
}

class ReportsApi {
  getFilteredReport(filters: ReportFilters = {}) {
    return apiClient.get("/report", { params: filters });
  }

  getNewReport(filters: NewReportFilters = {}) {
    return apiClient.get("/report/new", { params: filters });
  }

  exportNewReportCSV(filters: NewReportFilters = {}) {
    return apiClient.get("/report/new/export", {
      params: filters,
      responseType: "blob",
    });
  }
}

const reportsApi = new ReportsApi();
export default reportsApi;
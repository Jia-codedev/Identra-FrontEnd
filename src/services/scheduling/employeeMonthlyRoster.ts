import apiClient from "@/configs/api/Axios";

export interface MonthlyRoster {
  schedule_roster_id: number;
  employee_id: number;
  emp_no?: string | null;
  employee_name?: string | null;
  employee_name_arb?: string | null;
  manager_id?: number | null;
  from_date: string;
  to_date: string;
  version_no: number;
  finalize_flag: boolean;
  created_date?: string;
  last_updated_date?: string;
  D1?: number | null; D2?: number | null; D3?: number | null; D4?: number | null; D5?: number | null;
  D6?: number | null; D7?: number | null; D8?: number | null; D9?: number | null; D10?: number | null;
  D11?: number | null; D12?: number | null; D13?: number | null; D14?: number | null; D15?: number | null;
  D16?: number | null; D17?: number | null; D18?: number | null; D19?: number | null; D20?: number | null;
  D21?: number | null; D22?: number | null; D23?: number | null; D24?: number | null; D25?: number | null;
  D26?: number | null; D27?: number | null; D28?: number | null; D29?: number | null; D30?: number | null; D31?: number | null;
}

export interface CreateMonthlyRosterRequest {
  employee_id: number;
  from_date: string;
  to_date: string;  
  version_no: number;
  finalize_flag: boolean;
  manager_id?: number;
  [key: `D${number}`]: number | undefined;
}

export interface UpdateMonthlyRosterRequest {
  employee_id?: number;
  from_date?: string;
  to_date?: string;
  version_no?: number;
  finalize_flag?: boolean;
  manager_id?: number;
  [key: `D${number}`]: number | undefined;
}

export interface FilterMonthlyRosterRequest {
  organization_id: number;
  month: number;
  year: number; 
  day?: number;
  employee_id?: number;
  employee_group_id?: number;
  manager_id?: number;
  schedule_id?: number;
  finalize_flag?: boolean;
}

class EmployeeMonthlyRosterApi {
  add(data: CreateMonthlyRosterRequest) {
    return apiClient.post("/employeeMonthlyRoster/add", data);
  }

  getAll(params?: { organization_id?: number; month?: number; year?: number; day?: number; employee_id?: number; employee_group_id?: number; manager_id?: number; schedule_id?: number; finalize_flag?: boolean; limit?: number; offset?: number; orderBy?: string }) {
    return apiClient.get("/employeeMonthlyRoster/all", { params });
  }

  getById(id: number) {
    return apiClient.get(`/employeeMonthlyRoster/get/${id}`);
  }

  edit(id: number, data: UpdateMonthlyRosterRequest) {
    return apiClient.put(`/employeeMonthlyRoster/edit/${id}`, data);
  }

  delete(id: number) {
    return apiClient.delete(`/employeeMonthlyRoster/delete/${id}`);
  }

  finalize(id: number, body: { user_id?: number; id?: number } = {}) {
    return apiClient.patch(`/employeeMonthlyRoster/finalize/${id}`, body);
  }

  filter(data: FilterMonthlyRosterRequest) {
    return apiClient.post("/employeeMonthlyRoster/filter", data);
  }

  importFile(formData: FormData) {
    return apiClient.post("/employeeMonthlyRoster/import", formData, {
      headers: { 'Content-Type': undefined as any },
    });
  }

  export(data: FilterMonthlyRosterRequest) {
    return apiClient.post("/employeeMonthlyRoster/export", data, { responseType: 'blob' });
  }
}

const employeeMonthlyRosterApi = new EmployeeMonthlyRosterApi();
export default employeeMonthlyRosterApi;

import { apiClient } from "@/configs/api/Axios";

export interface EmployeeEventTransaction {
  transaction_id: number;
  employee_id: number;
  transaction_time: string;
  reason: string;
  remarks?: string | null;
  device_id?: number | null;
  user_entry_flag: boolean;
  created_id: number;
  created_date: string;
  last_updated_id: number;
  last_updated_date: string;
  geolocation?: string | null;
  employee_master?: {
    emp_no: string;
    firstname_eng: string;
    lastname_eng: string;
    firstname_arb: string;
    lastname_arb: string;
  };
}

export interface EmployeeEventTransactionFilters {
  limit?: number;
  offset?: number;
  employee_id?: number;
  startDate?: string;
  endDate?: string;
  manager_id?: number;
  search?: string;
}

export interface EmployeeEventTransactionResponse {
  success: boolean;
  data: EmployeeEventTransaction[];
  total: number;
  hasNext: boolean;
}

class EmployeeEventTransactionsApi {
  async getAllEmployeeEventTransactions(
    filters: EmployeeEventTransactionFilters = {}
  ): Promise<EmployeeEventTransactionResponse> {
    const params = new URLSearchParams();

    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());
    if (filters.employee_id)
      params.append("employee_id", filters.employee_id.toString());
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.manager_id)
      params.append("manager_id", filters.manager_id.toString());

    const url = `/employeeEventTransaction/all${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await apiClient.get(url);
    return response.data;
  }

  async getEmployeeEventTransactionById(
    id: number
  ): Promise<EmployeeEventTransaction> {
    const response = await apiClient.get(`/employeeEventTransaction/${id}`);
    return response.data;
  }

  async createEmployeeEventTransaction(
    data: Partial<EmployeeEventTransaction>
  ): Promise<{ message: string }> {
    const response = await apiClient.post("/employeeEventTransaction/add", data);
    return response.data;
  }

  async updateEmployeeEventTransaction(
    id: number,
    data: Partial<EmployeeEventTransaction>
  ): Promise<{ message: string }> {
    const response = await apiClient.put(`/employeeEventTransaction/${id}`, data);
    return response.data;
  }

  async deleteEmployeeEventTransaction(
    id: number
  ): Promise<{ message: string }> {
    const response = await apiClient.delete(`/employeeEventTransaction/${id}`);
    return response.data;
  }
}

const employeeEventTransactionsApi = new EmployeeEventTransactionsApi();
export default employeeEventTransactionsApi;

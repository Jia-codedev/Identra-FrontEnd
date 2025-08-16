export interface IEmployeeType {
    employee_type_id: number;
    employee_type_code: string;
    employee_type_eng?: string;
    employee_type_arb?: string;
    created_id?: number;
    created_date?: string;
    last_updated_id?: number;
    last_updated_date?: string;
}

export interface EmployeeTypeFormData {
  data: IEmployeeType[];
  hasNext: boolean;
  total: number;
}

export interface EmployeeTypeState {
  employeeTypes: IEmployeeType[];
  selected: number[];
  search: string;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

export interface EmployeeTypeFilters {
  search: string;
}
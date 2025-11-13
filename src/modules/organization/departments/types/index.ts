export interface IDepartment {
  department_id: number;
  department_code: string;
  department_name_eng?: string;
  department_name_arb?: string;
  created_id?: number;
  created_date?: Date;
  last_updated_id?: number;
  last_updated_date?: Date;
}

export interface DepartmentFormData {
  data: IDepartment[];
  hasNext: boolean;
  total: number;
}

export interface DepartmentsState {
  departments: IDepartment[];
  selected: number[];
  search: string;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

export interface DepartmentFilters {
  search: string;
  organization_id?: number;
}

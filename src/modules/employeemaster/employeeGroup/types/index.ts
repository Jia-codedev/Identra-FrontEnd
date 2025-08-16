export interface IEmployeeGroup {
    employee_group_id?: number;
    group_code?: string;
    group_name_eng?: string | null;
    group_name_arb?: string | null;
    schedule_flag?: boolean;
    reporting_group_flag?: boolean;
    group_start_date?: Date | null;
    group_end_date?: Date | null;
    reporting_person_id?: number;
}

export interface EmployeeGroupFormData {
  data: IEmployeeGroup[];
  hasNext: boolean;
  total: number;
}

export interface EmployeeGroupState {
  employeeGroups: IEmployeeGroup[];
  selected: number[];
  search: string;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

export interface EmployeeGroupFilters {
  search: string;
}

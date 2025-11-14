export interface IEmployee {
  employee_id?: number;
  emp_no: string;
  firstname_eng: string;
  lastname_eng: string;
  firstname_arb: string;
  lastname_arb: string;
  card_number?: string;
  pin?: string;
  organization_id?: number;
  grade_id?: number;
  designation_id?: number;
  citizenship_id?: number;
  employee_type_id?: number;
  join_date?: Date;
  active_date?: Date;
  inactive_date?: Date;
  national_id?: string;
  national_id_expiry_date?: Date;
  passport_number?: string;
  passport_expiry_date?: Date;
  passport_issue_country_id?: number;
  mobile?: string;
  email?: string;
  active_flag?: boolean;
  gender?: string;
  local_flag?: boolean;
  punch_flag?: boolean;
  on_reports_flag?: boolean;
  email_notifications_flag?: boolean;
  include_email_flag?: boolean;
  open_shift_flag?: boolean;
  overtime_flag?: boolean;
  web_punch_flag?: boolean;
  shift_flag?: boolean;
  check_inout_selfie_flag?: boolean;
  calculate_monthly_missed_hrs_flag?: boolean;
  exclude_from_integration_flag?: boolean;
  photo_file_name?: string;
  manager_flag?: boolean;
  manager_id?: number;
  inpayroll_flag?: boolean;
  share_roster_flag?: boolean;
  location_id?: number;
  contract_company_id?: number;
  remarks?: string;
  geofence_flag?: boolean;
  login?: string;
  password?: string;
  organization?: any
}

export interface EmployeeFormData {
  data: IEmployee[];
  hasNext: boolean;
  total: number;
}

export interface EmployeeState {
  employees: IEmployee[];
  selected: number[];
  search: string;
  isManager: boolean | null;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

export interface EmployeeSearchResponse{
  employee_id:number,
  firstname_eng:string,
  lastname_eng:string,
  firstname_arb:string,
  lastname_arb:string
}
export interface EmployeeFilters {
  search: string;
}

export interface DropdownOption {
  label: string;
  value: number;
}

export type EmployeeFormFields = {
  // Basic Info
  emp_no: string;
  firstname_eng: string;
  lastname_eng: string;
  firstname_arb: string;
  lastname_arb: string;
  card_number: string;
  pin: string;

  // Organization Info
  organization_id: number | null;
  grade_id: number | null;
  designation_id: number | null;
  employee_type_id: number | null;
  location_id: number | null;
  manager_id: number | null;

  // Personal Info
  citizenship_id: number | null;
  national_id: string;
  national_id_expiry_date: Date | null;
  passport_number: string;
  passport_expiry_date: Date | null;
  passport_issue_country_id: number | null;
  mobile: string;
  email: string;
  gender: string;

  // Employment Info
  join_date: Date | null;
  active_date: Date | null;
  inactive_date: Date | null;

  // Settings & Permissions
  active_flag: boolean;
  local_flag: boolean;
  punch_flag: boolean;
  on_reports_flag: boolean;
  email_notifications_flag: boolean;
  include_email_flag: boolean;
  open_shift_flag: boolean;
  overtime_flag: boolean;
  web_punch_flag: boolean;
  shift_flag: boolean;
  check_inout_selfie_flag: boolean;
  calculate_monthly_missed_hrs_flag: boolean;
  exclude_from_integration_flag: boolean;
  manager_flag: boolean;
  inpayroll_flag: boolean;
  share_roster_flag: boolean;
  geofence_flag: boolean;

  // Login Credentials
  login_id: string;
  password: string;
  confirm_password: string;

  // Additional
  remarks: string;
};

export interface EmployeeStepProps {
  formData: EmployeeFormFields;
  errors: Partial<Record<keyof EmployeeFormFields, string>>;
  onInputChange: (field: keyof EmployeeFormFields, value: any) => void;
  organizations: DropdownOption[];
  designations: DropdownOption[];
  nationalities: DropdownOption[];
  employeeTypes: DropdownOption[];
  employees?: DropdownOption[]; // Optional since managers are now loaded dynamically
  countries: DropdownOption[];
  grades: DropdownOption[];
  locations: DropdownOption[];
  isLoadingData: boolean;
  isRTL: boolean;
  t: (key: string) => string;
}

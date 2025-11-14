export interface IPermission {
  short_permission_id: number; // API field name
  employee_short_permission_id?: number; // Backwards compatibility
  employee_id: number;
  permission_type_id: number;
  from_date: string;
  to_date: string;
  from_time?: string;
  to_time?: string;
  perm_minutes?: number | null;
  remarks?: string;
  approver_remarks?: string | null;
  approver_id?: number | null;
  approved_date?: string | null;
  approve_reject_flag: number; // 0=Pending, 1=Approved, 2=Rejected
  official_perm_flag?: boolean;
  created_id?: number;
  created_date?: string;
  last_updated_id?: number;
  last_updated_date?: string;

  // Relations
  employee_master?: {
    emp_no: string;
    firstname_eng: string;
    lastname_eng: string;
    firstname_arb?: string;
    lastname_arb?: string;
  };
  permission_types?: {
    permission_type_code: string;
    permission_type_eng: string;
    permission_type_arb?: string;
  };
}

export interface PermissionFormData {
  employee_id: number;
  permission_type_id: number;
  from_date: string;
  to_date: string;
  from_time?: string;
  to_time?: string;
  remarks?: string;
}

export interface PermissionsState {
  permissions: IPermission[];
  selected: number[];
  search: string;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

export interface PermissionFilters {
  employee_number?: string;
  employee_name?: string;
  manager_id?: number;
  status?: number;
  from_date?: string;
  to_date?: string;
}

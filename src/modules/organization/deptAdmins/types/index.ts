export interface IDepartmentAdmin {
  dept_admin_id?: number;
  employee_id?: number | string;
  from_date?: string | Date | null;
  to_date?: string | Date | null;
  delegation_level?: number | string;
  active_status?: boolean | number | string;
  remarks?: string | null;
}

export interface DeptAdminsState {
  deptAdmins: IDepartmentAdmin[];
}

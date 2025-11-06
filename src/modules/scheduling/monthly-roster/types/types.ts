export * from "./types";

export interface MonthlyRosterFilters {
  organization_id?: number;
  employee_group_id?: number;
  employee_id?: number;
  manager_id?: number;
  schedule_id?: number;
  version_no?: number;
  day?: number;
  finalize_flag?: boolean;
  month?: number;
  year?: number;
}

export interface MonthlyRosterRow {
  schedule_roster_id: number;
  emp_no?: string;
  employee_name?: string;
  employee_name_arb?: string;
  from_date: string;
  finalize_flag?: boolean;
  [key: string]: number | string | boolean | null | undefined;
}

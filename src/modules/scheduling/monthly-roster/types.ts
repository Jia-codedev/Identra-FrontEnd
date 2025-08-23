export * from './types';

export interface MonthlyRosterFilters {
  organization_id?: number;
  employee_group_id?: number;
  employee_id?: number;
  manager_id?: number;
  schedule_id?: number;
  finalize_flag?: boolean;
  month?: number;
  year?: number;
}

export interface MonthlyRosterRow {
  schedule_roster_id: number;
  emp_no?: string;
  employee_name?: string;
  employee_name_arb?: string;
  from_date: string; // ISO date
  finalize_flag?: boolean;
  // Day columns are dynamic (D1..D31) and hold schedule IDs (number) or null/undefined.
  // Allow other properties used by the table.
  [key: string]: number | string | boolean | null | undefined;
}

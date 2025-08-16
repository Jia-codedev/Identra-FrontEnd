export interface MonthlyRosterFilters {
  organization_id?: number;
  month?: number; // 1-12
  year?: number;  // yyyy
  day?: number;
  employee_id?: number;
  employee_group_id?: number;
  manager_id?: number;
  schedule_id?: number;
  finalize_flag?: boolean;
}

export interface MonthlyRosterRow {
  schedule_roster_id: number;
  employee_id: number;
  emp_no?: string | null;
  employee_name?: string | null;
  employee_name_arb?: string | null;
  from_date: string;
  to_date: string;
  version_no: number;
  finalize_flag: boolean;
  D1?: number | null; D2?: number | null; D3?: number | null; D4?: number | null; D5?: number | null;
  D6?: number | null; D7?: number | null; D8?: number | null; D9?: number | null; D10?: number | null;
  D11?: number | null; D12?: number | null; D13?: number | null; D14?: number | null; D15?: number | null;
  D16?: number | null; D17?: number | null; D18?: number | null; D19?: number | null; D20?: number | null;
  D21?: number | null; D22?: number | null; D23?: number | null; D24?: number | null; D25?: number | null;
  D26?: number | null; D27?: number | null; D28?: number | null; D29?: number | null; D30?: number | null; D31?: number | null;
}

export interface ISchedule {
  schedule_id: number;
  organization_id: number;
  schedule_code: string;
  in_time?: string;
  out_time?: string;
  flexible_min?: number;
  grace_in_min?: number;
  grace_out_min?: number;
  open_shift_flag?: boolean;
  night_shift_flag?: boolean;
  sch_color?: string;
  ramadan_flag?: boolean;
  sch_parent_id?: number;
  required_work_hours?: string;
  status_flag?: boolean;
  calculate_worked_hrs_flag?: boolean;
  default_overtime_flag?: boolean;
  default_break_hrs_flag?: boolean;
  override_schedule_on_holiday_flag?: boolean;
  reduce_required_hrs_flag?: boolean;
  schedule_location?: number;
  inactive_date?: string;
  created_id: number;
  created_date: string;
  last_updated_id: number;
  last_updated_date: string;
  organizations?: {
    organization_id: number;
    organization_code: string;
    organization_eng: string;
    organization_arb: string;
  };
  schedules?: {
    schedule_id: number;
    schedule_code: string;
  };
}

export interface ScheduleFormData {
  data: ISchedule[];
  hasNext: boolean;
  total: number;
  pagination?: {
    current_page: number;
    total_pages: number;
    total_count: number;
    limit: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface SchedulesState {
  schedules: ISchedule[];
  selected: number[];
  search: string;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filters: ScheduleFilters;
}

export interface ScheduleFilters {
  search: string;
  code?: string;
  organization_name?: string;
  organization_id?: number;
  status_flag?: boolean;
  open_shift_flag?: boolean;
  night_shift_flag?: boolean;
  ramadan_flag?: boolean;
}

export interface CreateScheduleRequest {
  organization_id: number;
  schedule_code: string;
  in_time?: string;
  out_time?: string;
  flexible_min?: number;
  grace_in_min?: number;
  grace_out_min?: number;
  open_shift_flag?: boolean;
  night_shift_flag?: boolean;
  sch_color?: string;
  ramadan_flag?: boolean;
  sch_parent_id?: number;
  required_work_hours?: string;
  status_flag?: boolean;
  calculate_worked_hrs_flag?: boolean;
  default_overtime_flag?: boolean;
  default_break_hrs_flag?: boolean;
  override_schedule_on_holiday_flag?: boolean;
  reduce_required_hrs_flag?: boolean;
  schedule_location?: number;
  inactive_date?: string;
}

export interface UpdateScheduleRequest extends Partial<CreateScheduleRequest> {
  id?: number;
}

export interface Organization {
  organization_id: number;
  organization_code: string;
  organization_eng: string;
  organization_arb: string;
}

export interface Location {
  location_id: number;
  location_code: string;
  location_eng: string;
  location_arb: string;
  city?: string;
  region_name?: string;
  country_code?: string;
  radius?: number;
}

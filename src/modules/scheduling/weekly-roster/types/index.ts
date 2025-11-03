export interface GroupSchedule {
  id: number;
  group_name: string;
  description?: string;
  employee_group_id: number;
  location_id: number;
  is_active: boolean;
  monday_schedule_id?: number;
  tuesday_schedule_id?: number;
  wednesday_schedule_id?: number;
  thursday_schedule_id?: number;
  friday_schedule_id?: number;
  saturday_schedule_id?: number;
  sunday_schedule_id?: number;
  created_at?: string;
  updated_at?: string;
  
  monday_schedule?: ScheduleInfo;
  tuesday_schedule?: ScheduleInfo;
  wednesday_schedule?: ScheduleInfo;
  thursday_schedule?: ScheduleInfo;
  friday_schedule?: ScheduleInfo;
  saturday_schedule?: ScheduleInfo;
  sunday_schedule?: ScheduleInfo;
  
  employee_group?: {
    id: number;
    group_name: string;
  };
  location?: {
    id: number;
    location_name: string;
  };
}

export interface ScheduleInfo {
  schedule_id: number;
  schedule_code: string;
  in_time: string;
  out_time: string;
  sch_color: string;
  open_shift_flag?: boolean;
  night_shift_flag?: boolean;
  ramadan_flag?: boolean;
}

export interface GroupScheduleCreate {
  group_name: string;
  description?: string | null;
  employee_group_id: number;
  location_id: number;
  is_active: boolean;
  monday_schedule_id?: number | null;
  tuesday_schedule_id?: number | null;
  wednesday_schedule_id?: number | null;
  thursday_schedule_id?: number | null;
  friday_schedule_id?: number | null;
  saturday_schedule_id?: number | null;
  sunday_schedule_id?: number | null;
}

export interface GroupScheduleUpdate {
  group_name?: string;
  description?: string | null;
  employee_group_id?: number;
  location_id?: number;
  is_active?: boolean;
  monday_schedule_id?: number | null;
  tuesday_schedule_id?: number | null;
  wednesday_schedule_id?: number | null;
  thursday_schedule_id?: number | null;
  friday_schedule_id?: number | null;
  saturday_schedule_id?: number | null;
  sunday_schedule_id?: number | null;
}

export interface GroupScheduleResponse {
  data: GroupSchedule[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GroupScheduleListParams {
  page?: number;
  limit?: number;
  search?: string;
  location_id?: number;
  employee_group_id?: number;
  is_active?: boolean;
}

export type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface DayInfo {
  key: DayKey;
  label: string;
  field: keyof GroupSchedule;
}

export const DAYS_OF_WEEK: DayInfo[] = [
  { key: 'monday', label: 'Monday', field: 'monday_schedule_id' },
  { key: 'tuesday', label: 'Tuesday', field: 'tuesday_schedule_id' },
  { key: 'wednesday', label: 'Wednesday', field: 'wednesday_schedule_id' },
  { key: 'thursday', label: 'Thursday', field: 'thursday_schedule_id' },
  { key: 'friday', label: 'Friday', field: 'friday_schedule_id' },
  { key: 'saturday', label: 'Saturday', field: 'saturday_schedule_id' },
  { key: 'sunday', label: 'Sunday', field: 'sunday_schedule_id' },
];

export interface WeeklyRosterFilters {
  employee_group_id?: number;
  start_date?: Date;
  end_date?: Date;
}

export interface WeeklyRosterData {
  employee_group_id: number;
  start_date: Date;
  end_date: Date;
  employee_group?: {
    employee_group_id: number;
    group_name_eng: string;
    group_name_arb: string;
    group_code: string;
  };
}

export interface CreateWeeklyRosterRequest {
  employee_group_id: number;
  start_date: string;
  end_date: string;
}

export interface EmployeeGroup {
  employee_group_id: number;
  group_code: string;
  group_name_eng: string;
  group_name_arb: string;
  group_start_date?: string;
  group_end_date?: string;
  created_date?: string;
  last_updated_date?: string;
}

export interface EmployeeGroupsResponse {
  success: boolean;
  data: EmployeeGroup[];
}

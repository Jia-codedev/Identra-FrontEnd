export interface IHoliday {
  holiday_id: number;
  holiday_eng: string;
  holiday_arb: string;
  remarks?: string;
  from_date: string;
  to_date: string;
  recurring_flag: boolean;
  public_holiday_flag: boolean;
  created_id: number;
  created_date: string;
  last_updated_id: number;
  last_updated_time: string;
}

export interface HolidayFormData {
  data: IHoliday[];
  hasNext: boolean;
  total: number;
}

export interface HolidaysState {
  holidays: IHoliday[];
  selected: number[];
  search: string;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filters: HolidayFilters;
}

export interface HolidayFilters {
  search: string;
  year?: number;
  month?: number;
  recurring_flag?: boolean;
  public_holiday_flag?: boolean;
}

export interface CreateHolidayRequest {
  holiday_eng: string;
  holiday_arb: string;
  remarks?: string;
  from_date: string;
  to_date: string;
  recurring_flag: boolean;
  public_holiday_flag: boolean;
}

export interface UpdateHolidayRequest extends Partial<CreateHolidayRequest> {
  id?: number;
}

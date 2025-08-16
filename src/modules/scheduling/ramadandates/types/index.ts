export interface IRamadanDate {
  ramadan_id: number;
  ramadan_name_eng: string;
  ramadan_name_arb: string;
  remarks?: string;
  from_date: string;
  to_date: string;
  created_id?: number;
  created_date?: string;
  updated_id?: number;
  updated_date?: string;
}

export interface CreateRamadanDateRequest {
  ramadan_name_eng: string;
  ramadan_name_arb: string;
  remarks?: string;
  from_date: string;
  to_date: string;
}

export interface UpdateRamadanDateRequest extends CreateRamadanDateRequest {
  updated_id?: number;
}

export interface RamadanDateFilters {
  search?: string;
  year?: number;
  month?: number;
}

export interface RamadanDatesState {
  ramadanDates: IRamadanDate[];
  selected: number[];
  search: string;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filters: RamadanDateFilters;
}

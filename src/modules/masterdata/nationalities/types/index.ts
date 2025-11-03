export interface INationality {
    citizenship_id: number;
    citizenship_code: string;
    citizenship_eng?: string;
    citizenship_arb?: string;
    created_id?: number; 
    created_date?: Date;
    last_updated_id?: number; 
    last_updated_date?: Date;
}

export interface NationalityFormData {
  data: INationality[];
  hasNext: boolean;
  total: number;
}

export interface NationalitiesState {
  nationalities: INationality[];
  selected: number[];
  search: string;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

export interface NationalityFilters {
  search: string;
  code?: string;
}

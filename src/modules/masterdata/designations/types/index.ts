export interface IDesignation {
  designation_id: number;
  designation_eng?: string;
  designation_arb?: string;
  designation_code: string;
  senior_flag: boolean;         
  overtime_eligible_flag: boolean; 
}

export interface DesignationFormData {
  data: IDesignation[];
  hasNext: boolean;
  total: number;
}

export interface DesignationsState {
  designations: IDesignation[];
  selected: number[];
  search: string;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

export interface DesignationFilters {
  search: string;
  department?: string;   
  location?: string;    
}

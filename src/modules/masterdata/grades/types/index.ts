
export interface IGrade {
    grade_id: number;
    grade_eng?: string;
    grade_arb?: string;
    overtime_eligible_flag: boolean;
    number_of_AL?: number;
    number_of_SL?: number;
    number_of_CL?: number;
    grade_code: string;
    senior_flag: boolean;
}


export interface GradeFormData {
  data: IGrade[];
  hasNext: boolean;
  total: number;
}


export interface GradesState {
  grades: IGrade[];
  selected: number[];
  search: string;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

export interface GradeFilters {
  search: string;
  country?: string;
  timezone?: string;
}

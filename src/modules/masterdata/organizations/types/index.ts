export interface IOrganization {
  organization_id: number;
  organization_type_id: number;
  organization_code: string;
  organization_eng: string;
  organization_arb: string;
  parent_id?: number;
  position_in_grid?: number;
  location_id?: number;
}

export interface OrganizationFormData {
  data: IOrganization[];
  hasNext: boolean;
  total: number;
}

export interface OrganizationState {
  organizations: IOrganization[];
  selected: number[];
  search: string;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

export interface OrganizationFilters {
  search: string;
  country?: string;
  timezone?: string;
}
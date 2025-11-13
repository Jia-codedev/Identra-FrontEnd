export interface IOrganizationType {
  organization_type_id: number;
  organization_type_eng?: string;
  organization_type_arb?: string;
  org_type_level: number | undefined;
}

export interface OrganizationTypesState {
  organizationtypes: IOrganizationType[];
  selected: number[];
  search: string;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

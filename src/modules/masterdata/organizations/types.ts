export interface IOrganization {
  organization_id: number;
  organization_type_id: number;
  organization_code: string;
  organization_eng: string;
  organization_arb: string;
  parent_id?: number;
  position_in_grid?: number;
  location_id?: number;
  organizations: IOrganization | null;
}

export interface IOrganizationType {
  organization_type_id: number;
  organization_type_eng: string;
  organization_type_arb: string;
}

export interface ILocation {
  location_id: number;
  location_eng: string;
  location_arb: string;
}

export interface IOrganizationStructure extends IOrganization {
  organization_types?: IOrganizationType;
  locations?: ILocation;
  children: IOrganizationStructure[];
}

export interface OrganizationsState {
  organizations: IOrganization[];
  selected: number[];
  search: string;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

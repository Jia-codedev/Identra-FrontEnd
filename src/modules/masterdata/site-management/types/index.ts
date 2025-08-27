export interface ISite {
  location_id: number;
  location_code: string;
  location_eng?: string;
  location_arb?: string;
  city?: string;
  site_name?: string;
  country_code?: string;
  geolocation?: any;
  created_date?: Date;
  radius?: number | null;
}

export interface SiteFormData {
  data: ISite[];
  hasNext: boolean;
  total: number;
}

export interface SitesState {
  sites: ISite[];
  selected: number[];
  search: string;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

export interface SiteFilters {
  search: string;
  country?: string;
  timezone?: string;
}

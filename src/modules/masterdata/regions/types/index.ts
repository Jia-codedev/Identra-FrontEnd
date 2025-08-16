export interface IRegion {
  location_id: number;
  location_code: string;
  location_eng?: string;
  location_arb?: string;
  city?: string;
  region_name?: string;
  country_code?: string;
  geolocation?: any;
  created_date?: Date;
  radius?: number | null;
}

export interface RegionFormData {
  data: IRegion[];
  hasNext: boolean;
  total: number;
}

export interface RegionsState {
  regions: IRegion[];
  selected: number[];
  search: string;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

export interface RegionFilters {
  search: string;
  country?: string;
  timezone?: string;
}

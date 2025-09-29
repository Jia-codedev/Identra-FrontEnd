export interface IAppSetting {
  version_name: string;
  value?: string | null;
  descr?: string | null;
  tab_no?: number | null;
  deleted?: number | null;
  created_id?: number | null;
  created_date?: string | null;
  last_updated_id?: number | null;
  last_updated_date?: string | null;
}

export interface AppSettingState {
  appSettings: IAppSetting[];
  selected: string[];
  search: string;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}
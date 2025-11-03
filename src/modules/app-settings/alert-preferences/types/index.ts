export interface EmailSettingsState {
  emailSettings: any[];
  selected: number[];
  search: string;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

export interface DbSettingsState {
  dbSettings: any[];
  selected: number[];
  search: string;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

export interface AlertPreferencesState {
  activeTab: 'email' | 'db';
}

// Re-export types from services
export type {
  ChronEmailSetting,
  CreateChronEmailSettingRequest,
  UpdateChronEmailSettingRequest,
  TestEmailRequest
} from "@/services/settings/chronEmailSettings";

export type {
  ChronDbSetting,
  CreateChronDbSettingRequest,
  UpdateChronDbSettingRequest
} from "@/services/settings/chronDbSettings";
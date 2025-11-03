import apiClient from "@/configs/api/Axios";

export interface AppSetting {
  id?: number;
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

export interface CreateAppSettingRequest {
  version_name: string;
  value?: string;
  descr?: string;
  tab_no?: number;
}

class AppSettingsApi {
  getAppSettings(
    { offset = 1, limit = 10, search = "" } = {} as {
      offset?: number;
      limit?: number;
      search?: string;
    }
  ) {
    return apiClient.get("/appSetting/all", {
      params: { offset, limit, ...(search && { search }) },
    });
  }

  getAppSettingById(versionName: string) {
    return apiClient.get(`/appSetting/get/${encodeURIComponent(versionName)}`);
  }

  createAppSetting(data: CreateAppSettingRequest) {
    return apiClient.post("/appSetting/add", data);
  }

  updateAppSetting(versionName: string, data: Partial<CreateAppSettingRequest>) {
    return apiClient.put(`/appSetting/edit/${encodeURIComponent(versionName)}`, data);
  }

  deleteAppSetting(versionName: string) {
    return apiClient.delete(`/appSetting/delete/${encodeURIComponent(versionName)}`);
  }

  deleteAppSettings(versionNames: string[]) {
    return apiClient.delete("/appSetting/delete", { data: { version_names: versionNames } });
  }
}

const appSettingsApi = new AppSettingsApi();
export default appSettingsApi;
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
  // App Settings Management
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

  getAppSettingById(id: number) {
    return apiClient.get(`/appSetting/get/${id}`);
  }

  createAppSetting(data: CreateAppSettingRequest) {
    return apiClient.post("/appSetting/add", data);
  }

  updateAppSetting(id: number, data: Partial<CreateAppSettingRequest>) {
    return apiClient.put(`/appSetting/edit/${id}`, data);
  }

  deleteAppSetting(id: number) {
    return apiClient.delete(`/appSetting/delete/${id}`);
  }

  deleteAppSettings(ids: number[]) {
    return apiClient.delete("/appSetting/delete", { data: { ids } });
  }
}

const appSettingsApi = new AppSettingsApi();
export default appSettingsApi;
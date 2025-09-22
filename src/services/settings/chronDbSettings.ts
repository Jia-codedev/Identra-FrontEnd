import apiClient from "@/configs/api/Axios";

export interface ChronDbSetting {
  db_settings_id: number;
  db_databasetype: string;
  db_databasename: string;
  db_host_name: string;
  db_port_no: string;
  db_username?: string | null;
  db_password?: string | null;
  connect_db_flag?: boolean | null;
  created_id: number;
  created_date?: string;
  last_updated_id: number;
  last_updated_date?: string;
}

export interface CreateChronDbSettingRequest {
  db_databasetype: string;
  db_databasename: string;
  db_host_name: string;
  db_port_no: string;
  db_username?: string;
  db_password?: string;
  connect_db_flag?: boolean;
}

class ChronDbSettingsApi {
  getDbSettings(
    { offset = 1, limit = 10, search = "" } = {} as {
      offset?: number;
      limit?: number;
      search?: string;
    }
  ) {
    return apiClient.get("/dbSetting/all", {
      params: { offset, limit, ...(search && { search }) },
    });
  }

  getDbSettingById(id: number) {
    return apiClient.get(`/dbSetting/get/${id}`);
  }

  createDbSetting(data: CreateChronDbSettingRequest) {
    return apiClient.post("/dbSetting/add", data);
  }

  updateDbSetting(id: number, data: Partial<CreateChronDbSettingRequest>) {
    return apiClient.put(`/dbSetting/edit/${id}`, data);
  }

  deleteDbSetting(id: number) {
    return apiClient.delete(`/dbSetting/delete/${id}`);
  }
}

const chronDbSettingsApi = new ChronDbSettingsApi();
export default chronDbSettingsApi;
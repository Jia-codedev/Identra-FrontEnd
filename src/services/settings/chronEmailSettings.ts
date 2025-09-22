import apiClient from "@/configs/api/Axios";

export interface ChronEmailSetting {
  em_id: number;
  em_smtp_name: string;
  em_host_name: string;
  em_port_no: string;
  em_from_email?: string | null;
  em_encryption?: string | null;
  em_active_smtp_flag?: boolean | null;
  created_id: number;
  created_date?: string;
  last_updated_id: number;
  last_updated_date?: string;
}

export interface CreateChronEmailSettingRequest {
  em_smtp_name: string;
  em_host_name: string;
  em_port_no: string;
  em_from_email?: string;
  em_encryption?: string;
  em_active_smtp_flag?: boolean;
}

class ChronEmailSettingsApi {
  getEmailSettings(
    { offset = 1, limit = 10, search = "" } = {} as {
      offset?: number;
      limit?: number;
      search?: string;
    }
  ) {
    return apiClient.get("/emailSetting/all", {
      params: { offset, limit, ...(search && { search }) },
    });
  }

  getEmailSettingById(id: number) {
    return apiClient.get(`/emailSetting/get/${id}`);
  }

  createEmailSetting(data: CreateChronEmailSettingRequest) {
    return apiClient.post("/emailSetting/add", data);
  }

  updateEmailSetting(id: number, data: Partial<CreateChronEmailSettingRequest>) {
    return apiClient.put(`/emailSetting/edit/${id}`, data);
  }

  deleteEmailSetting(id: number) {
    return apiClient.delete(`/emailSetting/delete/${id}`);
  }
}

const chronEmailSettingsApi = new ChronEmailSettingsApi();
export default chronEmailSettingsApi;
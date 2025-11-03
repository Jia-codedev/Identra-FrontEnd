import apiClient from "@/configs/api/Axios";

export interface ChronEmailSetting {
  em_id?: number;
  em_smtp_name?: string;
  em_host_name?: string;
  em_port_no?: string;
  em_encryption?: string;
  em_from_email?: string;
  em_smtp_password?: string;
  em_active_smtp_flag?: boolean;
  created_date?: string;
  created_id?: number;
  last_updated_date?: string;
  last_updated_id?: number;
}

export interface CreateChronEmailSettingRequest {
  em_smtp_name: string;
  em_host_name: string;
  em_port_no: string;
  em_encryption?: string;
  em_from_email: string;
  em_smtp_password: string;
  em_active_smtp_flag?: boolean;
}

export interface UpdateChronEmailSettingRequest {
  em_smtp_name?: string;
  em_host_name?: string;
  em_port_no?: string;
  em_encryption?: string;
  em_from_email?: string;
  em_smtp_password?: string;
  em_active_smtp_flag?: boolean;
}

export interface TestEmailRequest {
  to: string;
}

class ChronEmailSettingsApi {
  getEmailSettings(params?: {
    limit?: number;
    offset?: number;
    search?: string;
  }) {
    return apiClient.get("/emailSetting/all", {
      params,
    });
  }

  getEmailSettingById(id: number) {
    return apiClient.get(`/emailSetting/get/${id}`);
  }

  createEmailSetting(data: CreateChronEmailSettingRequest) {
    return apiClient.post("/emailSetting/add", data);
  }

  updateEmailSetting(id: number, data: UpdateChronEmailSettingRequest) {
    return apiClient.put(`/emailSetting/edit/${id}`, data);
  }

  deleteEmailSetting(id: number) {
    return apiClient.delete(`/emailSetting/delete/${id}`);
  }

  deleteEmailSettings(ids: number[]) {
    return apiClient.post("/emailSetting/delete-many", { ids });
  }

  sendTestEmail(data: TestEmailRequest) {
    return apiClient.post("/emailSetting/test", data);
  }

  checkConfiguration() {
    return apiClient.get("/emailSetting/check-config");
  }

  reinitializeService() {
    return apiClient.post("/emailSetting/reinitialize");
  }
}

const chronEmailSettingsApi = new ChronEmailSettingsApi();
export default chronEmailSettingsApi;
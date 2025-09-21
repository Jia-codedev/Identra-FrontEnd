import apiClient from "@/configs/api/Axios";

export interface TaEmail {
  ta_email_id?: number;
  to_text?: string | null;
  subject_text?: string | null;
  body_text?: string | null;
  email_status?: number | null;
  cc_email?: string | null;
  bcc_email?: string | null;
  processed_date?: string | null;
  created_id?: number | null;
  created_date?: string | null;
  last_updated_id?: number | null;
  last_updated_date?: string | null;
}

export interface CreateTaEmailRequest {
  to_text: string;
  subject_text: string;
  body_text: string;
  email_status?: number;
  cc_email?: string;
  bcc_email?: string;
}

export interface SendEmailRequest {
  to: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
}

class TaEmailsApi {
  // TA Emails Management
  getTaEmails(
    { offset = 1, limit = 10, search = "" } = {} as {
      offset?: number;
      limit?: number;
      search?: string;
    }
  ) {
    return apiClient.get("/ta-emails/all", {
      params: { offset, limit, ...(search && { search }) },
    });
  }

  getTaEmailById(id: number) {
    return apiClient.get(`/ta-emails/get/${id}`);
  }

  createTaEmail(data: CreateTaEmailRequest) {
    return apiClient.post("/ta-emails/add", data);
  }

  updateTaEmail(id: number, data: Partial<CreateTaEmailRequest>) {
    return apiClient.put(`/ta-emails/edit/${id}`, data);
  }

  deleteTaEmail(id: number) {
    return apiClient.delete(`/ta-emails/delete/${id}`);
  }

  // Email Processing
  getPendingEmails() {
    return apiClient.get("/ta-emails/pending");
  }

  markEmailProcessed(id: number) {
    return apiClient.patch(`/ta-emails/mark-processed/${id}`);
  }

  processPendingEmails() {
    return apiClient.post("/ta-emails/process-pending");
  }

  // Email Sending
  queueEmail(data: SendEmailRequest) {
    return apiClient.post("/ta-emails/queue", data);
  }

  sendEmailImmediate(data: SendEmailRequest) {
    return apiClient.post("/ta-emails/send-immediate", data);
  }

  // Stats
  getEmailStats() {
    return apiClient.get("/ta-emails/stats");
  }
}

const taEmailsApi = new TaEmailsApi();
export default taEmailsApi;
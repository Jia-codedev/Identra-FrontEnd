import apiClient from "@/configs/api/Axios";

export interface SecUser {
  user_id: number;
  username: string;
  employee_id: number;
  password_hash?: string;
  email?: string;
  is_active?: boolean;
  last_login_date?: string;
  password_expires_date?: string;
  failed_login_attempts?: number;
  account_locked?: boolean;
  account_locked_date?: string;
  created_id?: number;
  created_date?: string;
  last_updated_id?: number;
  last_updated_date?: string;
  // Relations
  employee_master?: {
    emp_no: string;
    firstname_eng: string;
    lastname_eng: string;
    firstname_arb: string;
    lastname_arb: string;
  };
}

export interface SecUserSession {
  session_id: number;
  user_id: number;
  session_token: string;
  ip_address?: string;
  user_agent?: string;
  login_time: string;
  logout_time?: string;
  session_status: string;
  created_date?: string;
  last_updated_date?: string;
  // Relations
  sec_users?: SecUser;
}

export interface CreateSecUserRequest {
  username: string;
  employee_id: number;
  password_hash: string;
  email?: string;
  is_active?: boolean;
  password_expires_date?: string;
}

export interface UpdateUserPasswordRequest {
  old_password: string;
  new_password: string;
}

export interface SessionFilters {
  offset?: number;
  limit?: number;
  user_id?: number;
  session_status?: string;
  ip_address?: string;
  from_date?: string;
  to_date?: string;
}

class SecuritySessionsApi {
  // Users Management
  getUsers(
    { offset = 1, limit = 10, search = "", is_active } = {} as {
      offset?: number;
      limit?: number;
      search?: string;
      is_active?: boolean;
    }
  ) {
    return apiClient.get("/secUser/all", {
      params: { 
        offset, 
        limit, 
        ...(search && { username: search }),
        ...(is_active !== undefined && { is_active })
      },
    });
  }

  getUserById(id: number) {
    return apiClient.get(`/secUser/get/${id}`);
  }

  getUserByUsername(username: string) {
    return apiClient.get(`/secUser/getByUsername/${username}`);
  }

  createUser(data: CreateSecUserRequest) {
    return apiClient.post("/secUser/add", data);
  }

  updateUser(id: number, data: Partial<CreateSecUserRequest>) {
    return apiClient.put(`/secUser/edit/${id}`, data);
  }

  updateUserPassword(id: number, data: UpdateUserPasswordRequest) {
    return apiClient.put(`/secUser/updatePassword/${id}`, data);
  }

  lockUser(id: number) {
    return apiClient.put(`/secUser/lock/${id}`);
  }

  unlockUser(id: number) {
    return apiClient.put(`/secUser/unlock/${id}`);
  }

  deleteUser(id: number) {
    return apiClient.delete(`/secUser/delete/${id}`);
  }

  // Sessions Management
  getSessions(filters: SessionFilters = {}) {
    const { offset = 1, limit = 10, ...rest } = filters;
    return apiClient.get("/secUserSession/all", {
      params: { offset, limit, ...rest },
    });
  }

  getSessionById(id: number) {
    return apiClient.get(`/secUserSession/get/${id}`);
  }

  getActiveSessionsByUser(userId: number) {
    return apiClient.get(`/secUserSession/activeByUser/${userId}`);
  }

  getAllActiveSessions() {
    return apiClient.get("/secUserSession/active");
  }

  createSession(data: {
    user_id: number;
    session_token: string;
    ip_address?: string;
    user_agent?: string;
  }) {
    return apiClient.post("/secUserSession/add", data);
  }

  updateSession(id: number, data: Partial<{
    logout_time: string;
    session_status: string;
  }>) {
    return apiClient.put(`/secUserSession/edit/${id}`, data);
  }

  terminateSession(id: number) {
    return apiClient.put(`/secUserSession/terminate/${id}`);
  }

  terminateAllUserSessions(userId: number) {
    return apiClient.put(`/secUserSession/terminateAllByUser/${userId}`);
  }

  deleteSession(id: number) {
    return apiClient.delete(`/secUserSession/delete/${id}`);
  }

  // Session Statistics
  getSessionStats() {
    return apiClient.get("/secUserSession/stats");
  }

  getUserSessionHistory(userId: number, { offset = 1, limit = 10 } = {}) {
    return apiClient.get(`/secUserSession/history/${userId}`, {
      params: { offset, limit }
    });
  }
}

const securitySessionsApi = new SecuritySessionsApi();
export default securitySessionsApi;
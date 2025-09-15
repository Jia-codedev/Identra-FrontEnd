import apiClient from "@/configs/api/Axios";

export interface SecAuditLog {
  audit_id: number;
  user_id: number;
  table_name: string;
  operation: string;
  record_id?: string;
  old_values?: string;
  new_values?: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
  // Relations
  sec_users?: {
    user_id: number;
    username: string;
    employee_master?: {
      emp_no: string;
      firstname_eng: string;
      lastname_eng: string;
      firstname_arb: string;
      lastname_arb: string;
    };
  };
}

export interface AuditLogFilters {
  offset?: number;
  limit?: number;
  user_id?: number;
  table_name?: string;
  operation?: string;
  from_date?: string;
  to_date?: string;
  ip_address?: string;
  search?: string;
}

export interface ActivitySummary {
  total_actions: number;
  today_actions: number;
  this_week_actions: number;
  this_month_actions: number;
  top_users: Array<{
    user_id: number;
    username: string;
    action_count: number;
    employee_name: string;
  }>;
  recent_activities: SecAuditLog[];
  operation_breakdown: Array<{
    operation: string;
    count: number;
  }>;
  table_breakdown: Array<{
    table_name: string;
    count: number;
  }>;
}

export interface UserActivityReport {
  user_id: number;
  username: string;
  employee_name: string;
  total_actions: number;
  last_activity: string;
  actions_by_date: Array<{
    date: string;
    count: number;
  }>;
  actions_by_operation: Array<{
    operation: string;
    count: number;
  }>;
  recent_activities: SecAuditLog[];
}

class SecurityAuditApi {
  // Audit Logs
  getAuditLogs(filters: AuditLogFilters = {}) {
    const { offset = 1, limit = 10, ...rest } = filters;
    return apiClient.get("/secAuditLog/all", {
      params: { offset, limit, ...rest },
    });
  }

  getAuditLogById(id: number) {
    return apiClient.get(`/secAuditLog/get/${id}`);
  }

  getAuditLogsByUser(userId: number, { offset = 1, limit = 10, from_date, to_date } = {} as {
    offset?: number;
    limit?: number;
    from_date?: string;
    to_date?: string;
  }) {
    return apiClient.get(`/secAuditLog/byUser/${userId}`, {
      params: { offset, limit, ...(from_date && { from_date }), ...(to_date && { to_date }) }
    });
  }

  getAuditLogsByTable(tableName: string, { offset = 1, limit = 10, from_date, to_date } = {} as {
    offset?: number;
    limit?: number;
    from_date?: string;
    to_date?: string;
  }) {
    return apiClient.get(`/secAuditLog/byTable/${tableName}`, {
      params: { offset, limit, ...(from_date && { from_date }), ...(to_date && { to_date }) }
    });
  }

  getAuditLogsByOperation(operation: string, { offset = 1, limit = 10, from_date, to_date } = {} as {
    offset?: number;
    limit?: number;
    from_date?: string;
    to_date?: string;
  }) {
    return apiClient.get(`/secAuditLog/byOperation/${operation}`, {
      params: { offset, limit, ...(from_date && { from_date }), ...(to_date && { to_date }) }
    });
  }

  createAuditLog(data: {
    user_id: number;
    table_name: string;
    operation: string;
    record_id?: string;
    old_values?: string;
    new_values?: string;
    ip_address?: string;
    user_agent?: string;
  }) {
    return apiClient.post("/secAuditLog/add", data);
  }

  deleteAuditLog(id: number) {
    return apiClient.delete(`/secAuditLog/delete/${id}`);
  }

  // Activity Summary & Reports
  getActivitySummary(filters: {
    from_date?: string;
    to_date?: string;
    user_id?: number;
  } = {}) {
    return apiClient.get("/secAuditLog/summary", {
      params: filters
    });
  }

  getUserActivityReport(userId: number, filters: {
    from_date?: string;
    to_date?: string;
  } = {}) {
    return apiClient.get(`/secAuditLog/userReport/${userId}`, {
      params: filters
    });
  }

  getSystemActivityReport(filters: {
    from_date?: string;
    to_date?: string;
    groupBy?: 'day' | 'week' | 'month';
  } = {}) {
    return apiClient.get("/secAuditLog/systemReport", {
      params: filters
    });
  }

  getTableActivityReport(filters: {
    from_date?: string;
    to_date?: string;
  } = {}) {
    return apiClient.get("/secAuditLog/tableReport", {
      params: filters
    });
  }

  // Analytics
  getOperationStatistics(filters: {
    from_date?: string;
    to_date?: string;
  } = {}) {
    return apiClient.get("/secAuditLog/operationStats", {
      params: filters
    });
  }

  getHourlyActivityPattern(filters: {
    from_date?: string;
    to_date?: string;
  } = {}) {
    return apiClient.get("/secAuditLog/hourlyPattern", {
      params: filters
    });
  }

  exportAuditLogs(filters: AuditLogFilters & { format?: 'csv' | 'excel' } = {}) {
    return apiClient.get("/secAuditLog/export", {
      params: filters,
      responseType: 'blob'
    });
  }

  // Cleanup
  cleanupOldLogs(beforeDate: string) {
    return apiClient.delete("/secAuditLog/cleanup", {
      data: { before_date: beforeDate }
    });
  }
}

const securityAuditApi = new SecurityAuditApi();
export default securityAuditApi;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { securityAuditApi, type SecAuditLog, type AuditLogFilters, type ActivitySummary, type UserActivityReport } from "@/services/security";
import { toast } from "sonner";

// Audit Logs Hooks
export function useAuditLogs(filters: AuditLogFilters = {}) {
  return useQuery({
    queryKey: ["security", "auditLogs", filters],
    queryFn: () => securityAuditApi.getAuditLogs(filters),
    select: (data) => data.data,
  });
}

export function useAuditLog(id: number) {
  return useQuery({
    queryKey: ["security", "auditLogs", id],
    queryFn: () => securityAuditApi.getAuditLogById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

export function useAuditLogsByUser(userId: number, params: {
  offset?: number;
  limit?: number;
  from_date?: string;
  to_date?: string;
} = {}) {
  return useQuery({
    queryKey: ["security", "auditLogs", "user", userId, params],
    queryFn: () => securityAuditApi.getAuditLogsByUser(userId, params),
    select: (data) => data.data,
    enabled: !!userId,
  });
}

export function useAuditLogsByTable(tableName: string, params: {
  offset?: number;
  limit?: number;
  from_date?: string;
  to_date?: string;
} = {}) {
  return useQuery({
    queryKey: ["security", "auditLogs", "table", tableName, params],
    queryFn: () => securityAuditApi.getAuditLogsByTable(tableName, params),
    select: (data) => data.data,
    enabled: !!tableName,
  });
}

export function useAuditLogsByOperation(operation: string, params: {
  offset?: number;
  limit?: number;
  from_date?: string;
  to_date?: string;
} = {}) {
  return useQuery({
    queryKey: ["security", "auditLogs", "operation", operation, params],
    queryFn: () => securityAuditApi.getAuditLogsByOperation(operation, params),
    select: (data) => data.data,
    enabled: !!operation,
  });
}

export function useCreateAuditLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      user_id: number;
      table_name: string;
      operation: string;
      record_id?: string;
      old_values?: string;
      new_values?: string;
      ip_address?: string;
      user_agent?: string;
    }) => securityAuditApi.createAuditLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "auditLogs"] });
      toast.success("Audit log created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create audit log");
    },
  });
}

export function useDeleteAuditLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => securityAuditApi.deleteAuditLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "auditLogs"] });
      toast.success("Audit log deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete audit log");
    },
  });
}

// Activity Summary & Reports Hooks
export function useActivitySummary(filters: {
  from_date?: string;
  to_date?: string;
  user_id?: number;
} = {}) {
  return useQuery({
    queryKey: ["security", "activitySummary", filters],
    queryFn: () => securityAuditApi.getActivitySummary(filters),
    select: (data) => data.data,
  });
}

export function useUserActivityReport(userId: number, filters: {
  from_date?: string;
  to_date?: string;
} = {}) {
  return useQuery({
    queryKey: ["security", "userActivityReport", userId, filters],
    queryFn: () => securityAuditApi.getUserActivityReport(userId, filters),
    select: (data) => data.data,
    enabled: !!userId,
  });
}

export function useSystemActivityReport(filters: {
  from_date?: string;
  to_date?: string;
  groupBy?: 'day' | 'week' | 'month';
} = {}) {
  return useQuery({
    queryKey: ["security", "systemActivityReport", filters],
    queryFn: () => securityAuditApi.getSystemActivityReport(filters),
    select: (data) => data.data,
  });
}

export function useTableActivityReport(filters: {
  from_date?: string;
  to_date?: string;
} = {}) {
  return useQuery({
    queryKey: ["security", "tableActivityReport", filters],
    queryFn: () => securityAuditApi.getTableActivityReport(filters),
    select: (data) => data.data,
  });
}

// Analytics Hooks
export function useOperationStatistics(filters: {
  from_date?: string;
  to_date?: string;
} = {}) {
  return useQuery({
    queryKey: ["security", "operationStatistics", filters],
    queryFn: () => securityAuditApi.getOperationStatistics(filters),
    select: (data) => data.data,
  });
}

export function useHourlyActivityPattern(filters: {
  from_date?: string;
  to_date?: string;
} = {}) {
  return useQuery({
    queryKey: ["security", "hourlyActivityPattern", filters],
    queryFn: () => securityAuditApi.getHourlyActivityPattern(filters),
    select: (data) => data.data,
  });
}

export function useExportAuditLogs() {
  return useMutation({
    mutationFn: (filters: AuditLogFilters & { format?: 'csv' | 'excel' } = {}) =>
      securityAuditApi.exportAuditLogs(filters),
    onSuccess: (response, variables) => {
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.${variables?.format || 'csv'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Audit logs exported successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to export audit logs");
    },
  });
}

// Cleanup Hook
export function useCleanupOldLogs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (beforeDate: string) => securityAuditApi.cleanupOldLogs(beforeDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "auditLogs"] });
      toast.success("Old logs cleaned up successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to cleanup old logs");
    },
  });
}
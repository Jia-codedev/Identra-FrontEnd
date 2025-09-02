import apiClient from '@/configs/api/Axios';

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  employee_no: string;
  employee_name?: string;
  Ddate: string;
  check_in?: string;
  check_out?: string;
  break_start?: string;
  break_end?: string;
  total_work_hours?: number;
  overtime_hours?: number;
  status?: string;
  location?: string;
  device_id?: string;
  created_date?: string;
  last_updated_date?: string;
}

export interface AttendanceFilter {
  limit?: number;
  offset?: number;
  employee_id?: number;
  employee_no?: string;
  from_date?: string;
  to_date?: string;
  status?: string;
  location?: string;
}

export interface AttendanceListResponse {
  data: AttendanceRecord[];
  total: number;
  page: number;
  limit: number;
}

const attendanceApi = {
  // Get attendance records with pagination and filters
  getAllAttendance: (params: AttendanceFilter = {}) =>
    apiClient.get<AttendanceListResponse>('/dailyAttendance/all', { params }),

  // Get attendance by ID
  getAttendanceById: (id: number) =>
    apiClient.get<AttendanceRecord>(`/dailyAttendance/${id}`),

  // Get employee specific attendance
  getEmployeeAttendance: (employeeId: number, params: AttendanceFilter = {}) =>
    apiClient.get<AttendanceListResponse>(`/dailyAttendance/employee/${employeeId}`, { params }),

  // Create new attendance record
  createAttendance: (data: Partial<AttendanceRecord>) =>
    apiClient.post<AttendanceRecord>('/dailyAttendance/add', data),

  // Update attendance record
  updateAttendance: (id: number, data: Partial<AttendanceRecord>) =>
    apiClient.put<AttendanceRecord>(`/dailyAttendance/${id}`, data),

  // Delete attendance record
  deleteAttendance: (id: number) =>
    apiClient.delete(`/dailyAttendance/${id}`),

  // Bulk operations
  bulkUpdateAttendance: (records: Partial<AttendanceRecord>[]) =>
    apiClient.post('/dailyAttendance/bulk-update', { records }),

  // Get attendance summary/statistics
  getAttendanceSummary: (params: { employee_id?: number; from_date?: string; to_date?: string }) =>
    apiClient.get('/dailyAttendance/summary', { params }),

  // Export attendance data
  exportAttendance: (params: AttendanceFilter = {}) =>
    apiClient.get('/dailyAttendance/export', { 
      params,
      responseType: 'blob'
    }),
};

export default attendanceApi;

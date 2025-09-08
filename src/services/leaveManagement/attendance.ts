import apiClient from '@/configs/api/Axios';

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  employee_no: string;
  employee_name?: string;
  Ddate: string;
  time_in?: string;
  time_out?: string;
  check_in?: string; // Backwards compatibility
  check_out?: string; // Backwards compatibility
  break_start?: string;
  break_end?: string;
  total_work_hours?: number;
  overtime_hours?: number;
  overtime?: number;
  late?: number;
  early?: number;
  status?: string;
  location?: string;
  device_id?: string;
  created_date?: string;
  last_updated_date?: string;
  comment?: string;
  remarks?: string;
  // Additional fields from backend
  daily_EmployeeAttendanceDetails_id?: number;
  in_time?: string;
  out_time?: string;
  actualschInPerMove?: string;
  actualschOutPerMove?: string;
  nightshift?: number;
  holiday?: number;
  restday?: number;
  leave?: number;
  isabsent?: number;
  // Event transaction specific fields
  transaction_id?: number;
  transaction_time?: string;
  transaction_type?: string; // IN/OUT
  reason?: string;
  user_entry_flag?: boolean;
  geolocation?: string;
}

export interface EventTransactionRecord {
  id: number;
  transaction_id: number;
  employee_id: number;
  employee_no: string;
  employee_name: string;
  transaction_time: string;
  transaction_date: string;
  transaction_type: string; // IN/OUT
  reason: string;
  remarks?: string;
  device_id?: number;
  user_entry_flag: boolean;
  geolocation?: string;
  status: string;
  created_date: string;
  last_updated_date: string;
}

export interface AttendanceFilter {
  limit?: number;
  offset?: number;
  employee_id?: number;
  employee_no?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  location?: string;
  manager_id?: number; // For manager view
  viewType?: 'self' | 'team'; // For manager view
  search?: string;
}

export interface AttendanceListResponse {
  data: AttendanceRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface EventTransactionListResponse {
  data: EventTransactionRecord[];
  total: number;
  page: number;
  limit: number;
}

const attendanceApi = {
  // Get event transaction records with pagination and filters
  getAllAttendance: async (params: AttendanceFilter = {}) => {
    // Build query parameters based on API documentation
    const queryParams: any = {};
    
    if (params.limit) queryParams.limit = params.limit;
    if (params.offset) queryParams.offset = Math.floor(params.offset / (params.limit || 10)) + 1; // Convert to page number
    if (params.employee_id) queryParams.employee_id = params.employee_id;
    if (params.manager_id) queryParams.manager_id = params.manager_id;
    if (params.startDate) queryParams.startDate = params.startDate;
    if (params.endDate) queryParams.endDate = params.endDate;
    
    const response = await apiClient.get<EventTransactionListResponse>('/employeeEventTransaction/all', { 
      params: queryParams 
    });
    
    // Map the backend event transaction data to frontend format
    if (response.data && response.data.data) {
      const mappedData = response.data.data.map((item: any) => {
        // Extract date from transaction_time
        const transactionDate = new Date(item.transaction_time);
        const dateStr = transactionDate.toISOString().split('T')[0];
        const timeStr = transactionDate.toLocaleTimeString('en-US', { hour12: false });
        
        // Determine transaction type and status
        const transactionType = item.reason || 'IN'; // Default to IN if no reason
        let status = 'present';
        
        // Determine status based on transaction type and time
        if (item.user_entry_flag) {
          status = 'manual';
        } else if (transactionType.toUpperCase().includes('OUT')) {
          status = 'checkout';
        } else if (transactionType.toUpperCase().includes('IN')) {
          status = 'checkin';
        }

        // Build employee name from the employee_master data
        const employeeName = item.employee_master 
          ? `${item.employee_master.firstname_eng || ''} ${item.employee_master.lastname_eng || ''}`.trim()
          : `Employee ${item.employee_id}`;

        return {
          id: item.transaction_id,
          employee_id: item.employee_id,
          employee_no: item.employee_master?.emp_no || item.employee_no || '',
          employee_name: employeeName,
          Ddate: dateStr,
          time_in: transactionType.toUpperCase().includes('IN') ? timeStr : undefined,
          time_out: transactionType.toUpperCase().includes('OUT') ? timeStr : undefined,
          check_in: transactionType.toUpperCase().includes('IN') ? timeStr : undefined,
          check_out: transactionType.toUpperCase().includes('OUT') ? timeStr : undefined,
          status: status,
          location: item.geolocation || 'Office',
          device_id: item.device_id?.toString(),
          created_date: item.created_date,
          last_updated_date: item.last_updated_date,
          remarks: item.remarks,
          // Event transaction specific fields
          transaction_id: item.transaction_id,
          transaction_time: item.transaction_time,
          transaction_type: transactionType,
          reason: item.reason,
          user_entry_flag: item.user_entry_flag,
          geolocation: item.geolocation,
          ...item
        } as EventTransactionRecord;
      });
      
      return {
        ...response,
        data: {
          ...response.data,
          data: mappedData
        }
      };
    }
    
    return response;
  },

  // Get attendance by ID
  getAttendanceById: (id: number) =>
    apiClient.get<EventTransactionRecord>(`/employeeEventTransaction/get/${id}`),

  // Get employee specific attendance
  getEmployeeAttendance: (employeeId: number, params: AttendanceFilter = {}) =>
    apiClient.get<EventTransactionListResponse>(`/employeeEventTransaction/employee/${employeeId}`, { params }),

  // Create new event transaction record
  createAttendance: (data: Partial<EventTransactionRecord>) =>
    apiClient.post<EventTransactionRecord>('/employeeEventTransaction/add', data),

  // Update event transaction record
  updateAttendance: (id: number, data: Partial<EventTransactionRecord>) =>
    apiClient.put<EventTransactionRecord>(`/employeeEventTransaction/edit/${id}`, data),

  // Delete event transaction record
  deleteAttendance: (id: number) =>
    apiClient.delete(`/employeeEventTransaction/delete/${id}`),

  // Bulk delete event transaction records  
  bulkDeleteAttendance: (ids: number[]) =>
    apiClient.delete('/employeeEventTransaction/deleteMany', { data: { ids } }),

  // Bulk operations
  bulkUpdateAttendance: (records: Partial<EventTransactionRecord>[]) =>
    apiClient.post('/employeeEventTransaction/bulk-update', { records }),

  // Get attendance summary/statistics (keeping daily attendance for summaries)
  getAttendanceSummary: (params: { employee_id?: number; from_date?: string; to_date?: string }) =>
    apiClient.get('/dailyAttendance/summary', { params }),

  // Export event transaction data
  exportAttendance: (params: AttendanceFilter = {}) =>
    apiClient.get('/employeeEventTransaction/export', { 
      params,
      responseType: 'blob'
    }),
};

export default attendanceApi;

import apiClient from '@/configs/api/Axios';

export type LeaveType = {
  leave_type_id: number;
  leave_type_eng?: string;
  leave_type_name?: string;
  // Add other fields as needed
};

class LeaveTypeApi {
  getAll() {
    return apiClient.get('/leaveType');
  }
}

const leaveTypeApi = new LeaveTypeApi();
export default leaveTypeApi;

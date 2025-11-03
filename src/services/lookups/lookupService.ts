import employeeApi from '@/services/employeemaster/employee';
import apiClient from '@/configs/api/Axios';

const employeeCache: Record<number, string> = {};
const leaveTypeCache: Record<number, string> = {};

async function getEmployeeName(id: number) {
  if (!id) return String(id);
  if (employeeCache[id]) return employeeCache[id];
  try {
    const res = await employeeApi.getEmployeeById(id);
    const data = res.data?.data || res.data;
    const name = data?.name || `${data?.first_name || ''} ${data?.last_name || ''}`.trim() || String(id);
    employeeCache[id] = `${name} (${id})`;
    return employeeCache[id];
  } catch (err) {
    return String(id);
  }
}

async function getLeaveTypeName(id: number) {
  if (!id) return String(id);
  if (leaveTypeCache[id]) return leaveTypeCache[id];
  try {
    const res = await apiClient.get(`/leaveType/get/${id}`);
    const data = res.data?.data || res.data;
    const name = data?.leave_type_name || data?.name || String(id);
    leaveTypeCache[id] = name;
    return name;
  } catch (err) {
    return String(id);
  }
}

export default {
  getEmployeeName,
  getLeaveTypeName,
};

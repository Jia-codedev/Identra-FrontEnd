import { Socket } from 'socket.io-client';

export interface SocketEventData {
  [key: string]: any;
}

export interface SocketResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface NotificationData {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
  userId?: string;
}

export interface UserStatusData {
  userId: string;
  status: 'online' | 'offline';
  lastSeen?: number;
}

export interface EmployeeUpdateData {
  employeeId: string;
  field: string;
  oldValue: any;
  newValue: any;
  updatedBy: string;
  timestamp: number;
}

export interface RosterUpdateData {
  rosterId: string;
  employeeId: string;
  date: string;
  changes: Record<string, any>;
  updatedBy: string;
  timestamp: number;
}

export interface LeaveRequestData {
  requestId: string;
  employeeId: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  startDate: string;
  endDate: string;
  reason?: string;
  timestamp: number;
}

export interface AttendanceUpdateData {
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
  timestamp: number;
}

export interface RoomData {
  roomId: string;
  roomType: 'general' | 'department' | 'project' | 'private';
  members: string[];
}

export type SocketEventMap = {
  connect: () => void;
  disconnect: (reason: string) => void;
  connect_error: (error: Error) => void;
  message: (data: SocketEventData) => void;
  response: (data: SocketResponse) => void;
  notification: (data: NotificationData) => void;
  user_online: (data: UserStatusData) => void;
  user_offline: (data: UserStatusData) => void;
  employee_update: (data: EmployeeUpdateData) => void;
  roster_update: (data: RosterUpdateData) => void;
  leave_request: (data: LeaveRequestData) => void;
  attendance_update: (data: AttendanceUpdateData) => void;
  room_joined: (data: RoomData) => void;
  room_left: (data: RoomData) => void;
};

export interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  emit: <T = any>(event: string, data?: T) => void;
  on: <T = any>(event: string, callback: (data: T) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
}

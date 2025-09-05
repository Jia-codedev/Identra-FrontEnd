import { io, Socket } from 'socket.io-client';
import { socketConfig, SOCKET_EVENTS } from '@/configs/socket/config';
import type { 
  SocketEventData, 
  NotificationData,
  UserStatusData,
  EmployeeUpdateData,
  RosterUpdateData,
  LeaveRequestData,
  AttendanceUpdateData,
  RoomData
} from '@/configs/types/socket.types';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private connectionRetries = 0;
  private maxRetries = 5;
  private eventListeners: Map<string, Array<(data: any) => void>> = new Map();
  private isInitialized = false;
  private _isConnecting = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSocket();
    }
    
  }

  private initializeSocket(): void {
    if (this.isInitialized) return;
    
    try {
      this.socket = io(socketConfig.url, {
        ...socketConfig.options,
        query: {
          userId: this.userId || '',
        },
      });

      this.setupEventListeners();
      this.isInitialized = true;
      this.connect();
    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on(SOCKET_EVENTS.CONNECT, () => {
      this.connectionRetries = 0;
      this._isConnecting = false;
      this.triggerEvent('connect', null);
    });

    this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason: string) => {
      this._isConnecting = false;
      this.triggerEvent('disconnect', reason);
    });

    this.socket.on(SOCKET_EVENTS.CONNECT_ERROR, (error: Error) => {
      console.error('Socket connection error:', error);
      this._isConnecting = false;
      this.handleConnectionError(error);
    });

    this.socket.on(SOCKET_EVENTS.RECONNECT, () => {
      this.connectionRetries = 0;
      this.triggerEvent('reconnect', null);
    });

    this.socket.on(SOCKET_EVENTS.RECONNECT_ERROR, (error: Error) => {
      console.error('Socket reconnection error:', error);
      this.handleReconnectionError(error);
    });

    this.socket.on(SOCKET_EVENTS.RECONNECT_FAILED, () => {
      console.error('Socket reconnection failed');
      this.triggerEvent('reconnect_failed', null);
    });

    // Custom events
    this.socket.on(SOCKET_EVENTS.MESSAGE, (data: SocketEventData) => {
      this.triggerEvent('message', data);
    });

    this.socket.on(SOCKET_EVENTS.RESPONSE, (data: SocketEventData) => {
      this.triggerEvent('response', data);
    });

    this.socket.on(SOCKET_EVENTS.NOTIFICATION, (data: NotificationData) => {
      this.triggerEvent('notification', data);
    });

    this.socket.on(SOCKET_EVENTS.USER_ONLINE, (data: UserStatusData) => {
      this.triggerEvent('user_online', data);
    });

    this.socket.on(SOCKET_EVENTS.USER_OFFLINE, (data: UserStatusData) => {
      this.triggerEvent('user_offline', data);
    });

    // Business-specific events
    this.socket.on(SOCKET_EVENTS.EMPLOYEE_UPDATE, (data: EmployeeUpdateData) => {
      this.triggerEvent('employee_update', data);
    });

    this.socket.on(SOCKET_EVENTS.ROSTER_UPDATE, (data: RosterUpdateData) => {
      this.triggerEvent('roster_update', data);
    });

    this.socket.on(SOCKET_EVENTS.LEAVE_REQUEST, (data: LeaveRequestData) => {
      this.triggerEvent('leave_request', data);
    });

    this.socket.on(SOCKET_EVENTS.ATTENDANCE_UPDATE, (data: AttendanceUpdateData) => {
      this.triggerEvent('attendance_update', data);
    });

    // Room events
    this.socket.on(SOCKET_EVENTS.ROOM_JOINED, (data: RoomData) => {
      this.triggerEvent('room_joined', data);
    });

    this.socket.on(SOCKET_EVENTS.ROOM_LEFT, (data: RoomData) => {
      this.triggerEvent('room_left', data);
    });
  }

  private handleConnectionError(error: Error): void {
    this.connectionRetries++;
    this.triggerEvent('connect_error', error);
    
    if (this.connectionRetries >= this.maxRetries) {
      console.error('Max connection retries reached');
      this.triggerEvent('max_retries_reached', error);
    }
  }

  private handleReconnectionError(error: Error): void {
    this.triggerEvent('reconnect_error', error);
  }

  private triggerEvent(eventName: string, data: any): void {
    const listeners = this.eventListeners.get(eventName);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in socket event listener for ${eventName}:`, error);
        }
      });
    }
  }

  // Public methods
  public connect(): void {
    if (!this.socket) {
      this.initializeSocket();
    }
    this._isConnecting = true;
    this.socket?.connect();
  }

  public disconnect(): void {
    this._isConnecting = false;
    this.socket?.disconnect();
    this.eventListeners.clear();
  }

  public setUserId(userId: string): void {
    this.userId = userId;
    if (this.socket && this.isInitialized) {
      this.socket.disconnect();
      this.isInitialized = false;
      this.initializeSocket();
      this.connect();
    }
  }

  public emit<T = any>(event: string, data?: T): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }

  public on<T = any>(event: string, callback: (data: T) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(callback);
  }

  public off(event: string, callback?: (data: any) => void): void {
    if (callback) {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      }
    } else {
      this.eventListeners.delete(event);
    }
  }

  public get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  public get isConnecting(): boolean {
    return this._isConnecting;
  }

  public get socketId(): string | undefined {
    return this.socket?.id;
  }

  public get connectionState(): string {
    if (!this.socket) return 'not_initialized';
    if (this.socket.connected) return 'connected';
    if (this._isConnecting) return 'connecting';
    if (this.socket.disconnected) return 'disconnected';
    return 'unknown';
  }

  // Business-specific methods
  public sendMessage(message: string, targetUserId?: string): void {
    this.emit(SOCKET_EVENTS.MESSAGE, {
      message,
      targetUserId,
      timestamp: Date.now(),
    });
  }

  public sendNotification(notification: Omit<NotificationData, 'id' | 'timestamp'>): void {
    this.emit(SOCKET_EVENTS.NOTIFICATION, {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
    });
  }

  public updateUserStatus(status: 'online' | 'offline'): void {
    this.emit(status === 'online' ? SOCKET_EVENTS.USER_ONLINE : SOCKET_EVENTS.USER_OFFLINE, {
      userId: this.userId,
      status,
      lastSeen: Date.now(),
    });
  }

  public joinRoom(roomId: string, roomType: 'general' | 'department' | 'project' | 'private' = 'general'): void {
    this.emit(SOCKET_EVENTS.JOIN_ROOM, { 
      roomId, 
      roomType, 
      userId: this.userId 
    });
  }

  public leaveRoom(roomId: string): void {
    this.emit(SOCKET_EVENTS.LEAVE_ROOM, { 
      roomId, 
      userId: this.userId 
    });
  }

  // Employee-specific methods
  public subscribeToEmployeeUpdates(employeeId: string): void {
    this.joinRoom(`employee_${employeeId}`, 'private');
  }

  public unsubscribeFromEmployeeUpdates(employeeId: string): void {
    this.leaveRoom(`employee_${employeeId}`);
  }

  public subscribeToDepartmentUpdates(departmentId: string): void {
    this.joinRoom(`department_${departmentId}`, 'department');
  }

  public unsubscribeFromDepartmentUpdates(departmentId: string): void {
    this.leaveRoom(`department_${departmentId}`);
  }

  // Utility methods
  public getEventListeners(): string[] {
    return Array.from(this.eventListeners.keys());
  }

  public clearAllListeners(): void {
    this.eventListeners.clear();
  }

  public destroy(): void {
    this.disconnect();
    this.clearAllListeners();
    this.socket = null;
    this.isInitialized = false;
  }
}

// Create singleton instance
const socketService = new SocketService();

// Ensure proper cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    socketService.destroy();
  });
}

export default socketService;

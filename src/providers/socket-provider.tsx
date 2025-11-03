"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useSocket } from "@/hooks/use-socket";
import socketService from "@/services/socket/socketService";
import type {
  SocketContextType,
  NotificationData,
  EmployeeUpdateData,
  RosterUpdateData,
  LeaveRequestData,
  UserStatusData,
} from "@/configs/types/socket.types";

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
  children: ReactNode;
  options?: {
    autoConnect?: boolean;
    reconnectOnUserChange?: boolean;
    enableLogging?: boolean;
  };
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  options = {},
}) => {
  const {
    autoConnect = true, 
    reconnectOnUserChange = true,
    enableLogging = false,
  } = options;

  const socket = useSocket({
    autoConnect,
    reconnectOnUserChange,
  });

  const emit = (event: string, data?: any) => {
    if (enableLogging) {
      console.log(`[Socket] Emitting event: ${event}`, data);
    }
    socket.emit(event, data);
  };

  const on = <T = any,>(event: string, callback: (data: T) => void) => {
    if (enableLogging) {
      console.log(`[Socket] Registering listener for event: ${event}`);
    }
    socketService.on(event, callback);
  };

  const off = (event: string, callback?: (data: any) => void) => {
    if (enableLogging) {
      console.log(`[Socket] Removing listener for event: ${event}`);
    }
    socketService.off(event, callback);
  };

  const contextValue: SocketContextType = {
    socket: null, 
    isConnected: socket.isConnected,
    isConnecting: socket.isConnecting,
    error: socket.error,
    connect: socket.connect,
    disconnect: socket.disconnect,
    emit,
    on,
    off,
  };
  useEffect(() => {
    if (!enableLogging) return;

    const events = [
      "connect",
      "disconnect",
      "connect_error",
      "reconnect",
      "reconnect_error",
      "notification",
      "employee_update",
      "roster_update",
      "leave_request",
      "attendance_update",
      "user_online",
      "user_offline",
    ];

    const logEvent = (eventName: string) => (data: any) => {
      console.log(`[Socket] Received event: ${eventName}`, data);
    };

    events.forEach((event) => {
      socketService.on(event, logEvent(event));
    });

    return () => {
      events.forEach((event) => {
        socketService.off(event, logEvent(event));
      });
    };
  }, [enableLogging]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};

export const withSocket = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const SocketWrappedComponent: React.FC<P> = (props: P) => {
    const notifications = useSocketNotifications();
    console.log("Socket notifications:", notifications);
    
    return (
      <SocketProvider>
        <Component {...props} />
      </SocketProvider>
    );
  };

  SocketWrappedComponent.displayName = `withSocket(${
    Component.displayName || Component.name || "Component"
  })`;

  return SocketWrappedComponent;
};

export const useSocketNotifications = (
  onNotification?: (notification: NotificationData) => void
) => {
  useEffect(() => {
    if (onNotification) {
      socketService.on("notification", onNotification);
      return () => socketService.off("notification", onNotification);
    }
  }, [onNotification]);
};

export const useSocketEmployeeUpdates = (
  onEmployeeUpdate?: (update: EmployeeUpdateData) => void
) => {
  useEffect(() => {
    if (onEmployeeUpdate) {
      socketService.on("employee_update", onEmployeeUpdate);
      return () => socketService.off("employee_update", onEmployeeUpdate);
    }
  }, [onEmployeeUpdate]);
};

export const useSocketRosterUpdates = (
  onRosterUpdate?: (update: RosterUpdateData) => void
) => {
  useEffect(() => {
    if (onRosterUpdate) {
      socketService.on("roster_update", onRosterUpdate);
      return () => socketService.off("roster_update", onRosterUpdate);
    }
  }, [onRosterUpdate]);
};

export const useSocketLeaveRequests = (
  onLeaveRequest?: (request: LeaveRequestData) => void
) => {
  useEffect(() => {
    if (onLeaveRequest) {
      socketService.on("leave_request", onLeaveRequest);
      return () => socketService.off("leave_request", onLeaveRequest);
    }
  }, [onLeaveRequest]);
};

export const useSocketUserStatus = (
  onUserOnline?: (user: UserStatusData) => void,
  onUserOffline?: (user: UserStatusData) => void
) => {
  useEffect(() => {
    if (onUserOnline) {
      socketService.on("user_online", onUserOnline);
    }
    if (onUserOffline) {
      socketService.on("user_offline", onUserOffline);
    }

    return () => {
      if (onUserOnline) socketService.off("user_online", onUserOnline);
      if (onUserOffline) socketService.off("user_offline", onUserOffline);
    };
  }, [onUserOnline, onUserOffline]);
};

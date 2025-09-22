"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import socketService from "@/services/socket/socketService";
import { useUserStore } from "@/store/userStore";
import type { NotificationData } from "@/configs/types/socket.types";

export interface UseSocketOptions {
  autoConnect?: boolean;
  reconnectOnUserChange?: boolean;
}

export interface UseSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connectionState: string;
  connect: () => void;
  disconnect: () => void;
  emit: <T = any>(event: string, data?: T) => void;
  sendMessage: (message: string, targetUserId?: string) => void;
  sendNotification: (
    notification: Omit<NotificationData, "id" | "timestamp">
  ) => void;
  joinRoom: (
    roomId: string,
    roomType?: "general" | "department" | "project" | "private"
  ) => void;
  leaveRoom: (roomId: string) => void;
  subscribeToEmployeeUpdates: (employeeId: string) => void;
  unsubscribeFromEmployeeUpdates: (employeeId: string) => void;
  subscribeToDepartmentUpdates: (departmentId: string) => void;
  unsubscribeFromDepartmentUpdates: (departmentId: string) => void;
}

export const useSocket = (options: UseSocketOptions = {}): UseSocketReturn => {
  const { autoConnect = true, reconnectOnUserChange = true } = options;
  const { user } = useUserStore();

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionState, setConnectionState] =
    useState<string>("not_initialized");

  const userIdRef = useRef<string | null>(null);

  const connect = useCallback(() => {
    setIsConnecting(true);
    setError(null);
    socketService.connect();
  }, []);

  const disconnect = useCallback(() => {
    socketService.disconnect();
    setIsConnected(false);
    setIsConnecting(false);
    setConnectionState("disconnected");
  }, []);

  const emit = useCallback(<T = any>(event: string, data?: T) => {
    socketService.emit(event, data);
  }, []);

  const sendMessage = useCallback((message: string, targetUserId?: string) => {
    socketService.sendMessage(message, targetUserId);
  }, []);

  const sendNotification = useCallback(
    (notification: Omit<NotificationData, "id" | "timestamp">) => {
      socketService.sendNotification(notification);
    },
    []
  );

  const joinRoom = useCallback(
    (
      roomId: string,
      roomType: "general" | "department" | "project" | "private" = "general"
    ) => {
      socketService.joinRoom(roomId, roomType);
    },
    []
  );

  const leaveRoom = useCallback((roomId: string) => {
    socketService.leaveRoom(roomId);
  }, []);

  const subscribeToEmployeeUpdates = useCallback((employeeId: string) => {
    socketService.subscribeToEmployeeUpdates(employeeId);
  }, []);

  const unsubscribeFromEmployeeUpdates = useCallback((employeeId: string) => {
    socketService.unsubscribeFromEmployeeUpdates(employeeId);
  }, []);

  const subscribeToDepartmentUpdates = useCallback((departmentId: string) => {
    socketService.subscribeToDepartmentUpdates(departmentId);
  }, []);

  const unsubscribeFromDepartmentUpdates = useCallback(
    (departmentId: string) => {
      socketService.unsubscribeFromDepartmentUpdates(departmentId);
    },
    []
  );

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
      setConnectionState("connected");
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setIsConnecting(false);
      setConnectionState("disconnected");
    };

    const handleConnectError = (error: Error) => {
      setError(error.message);
      setIsConnecting(false);
      setConnectionState("error");
    };

    const handleReconnect = () => {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
      setConnectionState("connected");
    };

    const handleReconnectError = (error: Error) => {
      setError(error.message);
      setConnectionState("reconnect_error");
    };

    const handleMaxRetriesReached = () => {
      setError("Maximum connection retries reached");
      setIsConnecting(false);
      setConnectionState("max_retries_reached");
    };

    socketService.on("connect", handleConnect);
    socketService.on("disconnect", handleDisconnect);
    socketService.on("connect_error", handleConnectError);
    socketService.on("reconnect", handleReconnect);
    socketService.on("reconnect_error", handleReconnectError);
    socketService.on("max_retries_reached", handleMaxRetriesReached);

    return () => {
      socketService.off("connect", handleConnect);
      socketService.off("disconnect", handleDisconnect);
      socketService.off("connect_error", handleConnectError);
      socketService.off("reconnect", handleReconnect);
      socketService.off("reconnect_error", handleReconnectError);
      socketService.off("max_retries_reached", handleMaxRetriesReached);
    };
  }, []);

  useEffect(() => {
    if (
      user?.employeenumber &&
      user.employeenumber.toString() !== userIdRef.current
    ) {
      userIdRef.current = user.employeenumber.toString();
      socketService.setUserId(user.employeenumber.toString());

      if (reconnectOnUserChange && autoConnect) {
        connect();
      }
    }
  }, [user?.employeenumber, reconnectOnUserChange, autoConnect, connect]);

  useEffect(() => {
    if (autoConnect && user?.employeenumber) {
      connect();
    }

    return () => {
      if (autoConnect) {
        disconnect();
      }
    };
  }, [autoConnect, user?.employeenumber, connect, disconnect]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentState = socketService.connectionState;
      const currentConnecting = socketService.isConnecting;
      const currentConnected = socketService.isConnected;

      setConnectionState(currentState);
      setIsConnecting(currentConnecting);
      setIsConnected(currentConnected);
    }, 500); 

    return () => clearInterval(interval);
  }, []);

  return {
    isConnected,
    isConnecting,
    error,
    connectionState,
    connect,
    disconnect,
    emit,
    sendMessage,
    sendNotification,
    joinRoom,
    leaveRoom,
    subscribeToEmployeeUpdates,
    unsubscribeFromEmployeeUpdates,
    subscribeToDepartmentUpdates,
    unsubscribeFromDepartmentUpdates,
  };
};

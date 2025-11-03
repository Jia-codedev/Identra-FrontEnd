import frontendSettings from "../constants/envValidation";

export interface SocketConfig {
  url: string;
  options: {
    transports: string[];
    timeout: number;
    forceNew: boolean;
    reconnection: boolean;
    reconnectionAttempts: number;
    reconnectionDelay: number;
    reconnectionDelayMax: number;
    autoConnect: boolean;
  };
}

export const socketConfig: SocketConfig = {
  url: frontendSettings.socketUrl || "ws://localhost:8000",
  options: {
    transports: ["websocket", "polling"],
    timeout: 20000,
    forceNew: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    autoConnect: true,
  },
};

export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",
  RECONNECT: "reconnect",
  RECONNECT_ERROR: "reconnect_error",
  RECONNECT_FAILED: "reconnect_failed",

  // Custom events
  MESSAGE: "message",
  RESPONSE: "response",
  NOTIFICATION: "notification",
  USER_ONLINE: "user_online",
  USER_OFFLINE: "user_offline",

  // Employee related events
  EMPLOYEE_UPDATE: "employee_update",
  ROSTER_UPDATE: "roster_update",
  LEAVE_REQUEST: "leave_request",
  ATTENDANCE_UPDATE: "attendance_update",

  // System events
  JOIN_ROOM: "join_room",
  LEAVE_ROOM: "leave_room",
  ROOM_JOINED: "room_joined",
  ROOM_LEFT: "room_left",
} as const;

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];

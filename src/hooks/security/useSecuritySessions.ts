import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { securitySessionsApi, type SecUser, type CreateSecUserRequest, type UpdateUserPasswordRequest, type SecUserSession, type SessionFilters } from "@/services/security";
import { toast } from "sonner";

// Users Hooks
export function useUsers(params: {
  offset?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
} = {}) {
  return useQuery({
    queryKey: ["security", "users", params],
    queryFn: () => securitySessionsApi.getUsers(params),
    select: (data) => data.data,
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ["security", "users", id],
    queryFn: () => securitySessionsApi.getUserById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

export function useUserByUsername(username: string) {
  return useQuery({
    queryKey: ["security", "users", "username", username],
    queryFn: () => securitySessionsApi.getUserByUsername(username),
    select: (data) => data.data,
    enabled: !!username,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSecUserRequest) => securitySessionsApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "users"] });
      toast.success("User created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create user");
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateSecUserRequest> }) =>
      securitySessionsApi.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["security", "users"] });
      queryClient.invalidateQueries({ queryKey: ["security", "users", id] });
      toast.success("User updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update user");
    },
  });
}

export function useUpdateUserPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserPasswordRequest }) =>
      securitySessionsApi.updateUserPassword(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["security", "users", id] });
      toast.success("Password updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update password");
    },
  });
}

export function useLockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => securitySessionsApi.lockUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["security", "users"] });
      queryClient.invalidateQueries({ queryKey: ["security", "users", id] });
      toast.success("User locked successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to lock user");
    },
  });
}

export function useUnlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => securitySessionsApi.unlockUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["security", "users"] });
      queryClient.invalidateQueries({ queryKey: ["security", "users", id] });
      toast.success("User unlocked successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to unlock user");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => securitySessionsApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "users"] });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    },
  });
}

// Sessions Hooks
export function useSessions(filters: SessionFilters = {}) {
  return useQuery({
    queryKey: ["security", "sessions", filters],
    queryFn: () => securitySessionsApi.getSessions(filters),
    select: (data) => data.data,
  });
}

export function useSession(id: number) {
  return useQuery({
    queryKey: ["security", "sessions", id],
    queryFn: () => securitySessionsApi.getSessionById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

export function useActiveSessionsByUser(userId: number) {
  return useQuery({
    queryKey: ["security", "sessions", "user", userId, "active"],
    queryFn: () => securitySessionsApi.getActiveSessionsByUser(userId),
    select: (data) => data.data,
    enabled: !!userId,
  });
}

export function useAllActiveSessions() {
  return useQuery({
    queryKey: ["security", "sessions", "active"],
    queryFn: () => securitySessionsApi.getAllActiveSessions(),
    select: (data) => data.data,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      user_id: number;
      session_token: string;
      ip_address?: string;
      user_agent?: string;
    }) => securitySessionsApi.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "sessions"] });
      toast.success("Session created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create session");
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<{
      logout_time: string;
      session_status: string;
    }> }) => securitySessionsApi.updateSession(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["security", "sessions"] });
      queryClient.invalidateQueries({ queryKey: ["security", "sessions", id] });
      toast.success("Session updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update session");
    },
  });
}

export function useTerminateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => securitySessionsApi.terminateSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "sessions"] });
      toast.success("Session terminated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to terminate session");
    },
  });
}

export function useTerminateAllUserSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => securitySessionsApi.terminateAllUserSessions(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "sessions"] });
      toast.success("All user sessions terminated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to terminate user sessions");
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => securitySessionsApi.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "sessions"] });
      toast.success("Session deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete session");
    },
  });
}

// Session Statistics
export function useSessionStats() {
  return useQuery({
    queryKey: ["security", "sessions", "stats"],
    queryFn: () => securitySessionsApi.getSessionStats(),
    select: (data) => data.data,
  });
}

export function useUserSessionHistory(userId: number, params: { offset?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["security", "sessions", "history", userId, params],
    queryFn: () => securitySessionsApi.getUserSessionHistory(userId, params),
    select: (data) => data.data,
    enabled: !!userId,
  });
}
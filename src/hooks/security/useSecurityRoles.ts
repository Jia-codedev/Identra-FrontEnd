import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { securityRolesApi, type SecRole, type CreateSecRoleRequest, type SecUserRole, type CreateSecUserRoleRequest } from "@/services/security";
import { toast } from "sonner";

export function useRoles(params: {
  offset?: number;
  limit?: number;
  search?: string;
} = {}) {
  return useQuery({
    queryKey: ["security", "roles", params],
    queryFn: () => securityRolesApi.getRoles(params),
    select: (data) => data.data,
  });
}

export function useRole(id: number) {
  return useQuery({
    queryKey: ["security", "roles", id],
    queryFn: () => securityRolesApi.getRoleById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

export function useRoleByName(roleName: string) {
  return useQuery({
    queryKey: ["security", "roles", "name", roleName],
    queryFn: () => securityRolesApi.getRoleByName(roleName),
    select: (data) => data.data,
    enabled: !!roleName,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSecRoleRequest) => securityRolesApi.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "roles"] });
      toast.success("Role created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create role");
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateSecRoleRequest> }) =>
      securityRolesApi.updateRole(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["security", "roles"] });
      queryClient.invalidateQueries({ queryKey: ["security", "roles", id] });
      toast.success("Role updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update role");
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => securityRolesApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "roles"] });
      toast.success("Role deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete role");
    },
  });
}

export function useDeleteMultipleRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => securityRolesApi.deleteMultipleRoles(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "roles"] });
      toast.success("Roles deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete roles");
    },
  });
}

export function useUserRoles(params: {
  offset?: number;
  limit?: number;
  user_id?: number;
  role_id?: number;
} = {}) {
  return useQuery({
    queryKey: ["security", "userRoles", params],
    queryFn: () => securityRolesApi.getUserRoles(params),
    select: (data) => data.data,
  });
}

export function useUserRole(id: number) {
  return useQuery({
    queryKey: ["security", "userRoles", id],
    queryFn: () => securityRolesApi.getUserRoleById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

export function useCreateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSecUserRoleRequest) => securityRolesApi.createUserRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "userRoles"] });
      toast.success("User role assigned successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to assign user role");
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateSecUserRoleRequest> }) =>
      securityRolesApi.updateUserRole(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["security", "userRoles"] });
      queryClient.invalidateQueries({ queryKey: ["security", "userRoles", id] });
      toast.success("User role updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update user role");
    },
  });
}

export function useDeleteUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => securityRolesApi.deleteUserRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "userRoles"] });
      toast.success("User role removed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to remove user role");
    },
  });
}
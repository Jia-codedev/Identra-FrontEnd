import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { securityPermissionsApi, type SecPrivilege, type CreateSecPrivilegeRequest, type SecRolePrivilege, type CreateSecRolePrivilegeRequest, type SecModule } from "@/services/security";
import { toast } from "sonner";

// Privileges Hooks
export function usePrivileges(params: {
  offset?: number;
  limit?: number;
  search?: string;
  module_name?: string;
} = {}) {
  return useQuery({
    queryKey: ["security", "privileges", params],
    queryFn: () => securityPermissionsApi.getPrivileges(params),
    select: (data) => data.data,
  });
}

export function usePrivilege(id: number) {
  return useQuery({
    queryKey: ["security", "privileges", id],
    queryFn: () => securityPermissionsApi.getPrivilegeById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

export function usePrivilegeByName(privName: string) {
  return useQuery({
    queryKey: ["security", "privileges", "name", privName],
    queryFn: () => securityPermissionsApi.getPrivilegeByName(privName),
    select: (data) => data.data,
    enabled: !!privName,
  });
}

export function useCreatePrivilege() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSecPrivilegeRequest) => securityPermissionsApi.createPrivilege(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "privileges"] });
      toast.success("Privilege created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create privilege");
    },
  });
}

export function useUpdatePrivilege() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateSecPrivilegeRequest> }) =>
      securityPermissionsApi.updatePrivilege(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["security", "privileges"] });
      queryClient.invalidateQueries({ queryKey: ["security", "privileges", id] });
      toast.success("Privilege updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update privilege");
    },
  });
}

export function useDeletePrivilege() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => securityPermissionsApi.deletePrivilege(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "privileges"] });
      toast.success("Privilege deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete privilege");
    },
  });
}

export function useDeleteMultiplePrivileges() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => securityPermissionsApi.deleteMultiplePrivileges(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "privileges"] });
      toast.success("Privileges deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete privileges");
    },
  });
}

// Role-Privilege Assignment Hooks
export function useRolePrivileges(params: {
  offset?: number;
  limit?: number;
  role_id?: number;
  priv_id?: number;
} = {}) {
  return useQuery({
    queryKey: ["security", "rolePrivileges", params],
    queryFn: () => securityPermissionsApi.getRolePrivileges(params),
    select: (data) => data.data,
  });
}

export function useRolePrivilege(id: number) {
  return useQuery({
    queryKey: ["security", "rolePrivileges", id],
    queryFn: () => securityPermissionsApi.getRolePrivilegeById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

export function useCreateRolePrivilege() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSecRolePrivilegeRequest) => securityPermissionsApi.createRolePrivilege(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "rolePrivileges"] });
      toast.success("Role privilege assigned successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to assign role privilege");
    },
  });
}

export function useUpdateRolePrivilege() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateSecRolePrivilegeRequest> }) =>
      securityPermissionsApi.updateRolePrivilege(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["security", "rolePrivileges"] });
      queryClient.invalidateQueries({ queryKey: ["security", "rolePrivileges", id] });
      toast.success("Role privilege updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update role privilege");
    },
  });
}

export function useDeleteRolePrivilege() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => securityPermissionsApi.deleteRolePrivilege(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "rolePrivileges"] });
      toast.success("Role privilege removed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to remove role privilege");
    },
  });
}

// Modules Hooks
export function useModules(params: {
  offset?: number;
  limit?: number;
  search?: string;
} = {}) {
  return useQuery({
    queryKey: ["security", "modules", params],
    queryFn: () => securityPermissionsApi.getModules(params),
    select: (data) => data.data,
  });
}

export function useModule(id: number) {
  return useQuery({
    queryKey: ["security", "modules", id],
    queryFn: () => securityPermissionsApi.getModuleById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

export function useCreateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SecModule>) => securityPermissionsApi.createModule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "modules"] });
      toast.success("Module created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create module");
    },
  });
}

export function useUpdateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SecModule> }) =>
      securityPermissionsApi.updateModule(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["security", "modules"] });
      queryClient.invalidateQueries({ queryKey: ["security", "modules", id] });
      toast.success("Module updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update module");
    },
  });
}

export function useDeleteModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => securityPermissionsApi.deleteModule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "modules"] });
      toast.success("Module deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete module");
    },
  });
}
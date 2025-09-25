import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { securityRolesApi } from "@/services/security";
import { SecRole, CreateSecRoleRequest } from "@/services/security/securityRoles";

export function useRoleMutations() {
  const queryClient = useQueryClient();

  const createRole = useMutation({
    mutationFn: async ({ roleData, onClose }: { roleData: CreateSecRoleRequest; onClose: () => void }) => {
      const res = await securityRolesApi.createRole(roleData);
      if (res.status !== 201) {
        toast.error(res.data?.message || "Failed to create role");
        return null;
      }
      onClose();
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Role created successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error) => {
      toast.error("Failed to create role");
      console.error("Error creating role:", error);
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ id, roleData, onClose }: { id: number; roleData: Partial<CreateSecRoleRequest>; onClose: () => void }) => {
      const res = await securityRolesApi.updateRole(id, roleData);
      if (res.status !== 200) {
        toast.error(res.data?.message || "Failed to update role");
        return null;
      }
      onClose();
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error) => {
      toast.error("Failed to update role");
      console.error("Error updating role:", error);
    },
  });

  const deleteRole = useMutation({
    mutationFn: async (id: number) => {
      const res = await securityRolesApi.deleteRole(id);
      return res;
    },
    onSuccess: () => {
      toast.success("Role deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error) => {
      toast.error("Failed to delete role");
      console.error("Error deleting role:", error);
    },
  });

  const deleteRoles = useMutation({
    mutationFn: async (ids: number[]) => {
      const res = await securityRolesApi.deleteMultipleRoles(ids);
      return res;
    },
    onSuccess: () => {
      toast.success("Roles deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error) => {
      toast.error("Failed to delete roles");
      console.error("Error deleting roles:", error);
    },
  });

  return {
    createRole: createRole.mutate,
    updateRole: updateRole.mutate,
    deleteRole: deleteRole.mutate,
    deleteRoles: deleteRoles.mutate,
  };
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import permissionTypeApi from "@/services/leaveManagement/permissionType";
import { toast } from "sonner";

export const usePermissionTypeMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: any) => permissionTypeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissionTypes"] });
      toast.success("Permission type created successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to create permission type";
      toast.error(message);
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      permissionTypeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissionTypes"] });
      toast.success("Permission type updated successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update permission type";
      toast.error(message);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => permissionTypeApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissionTypes"] });
      toast.success("Permission type deleted successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to delete permission type";
      toast.error(message, { duration: 5000 });
      throw error;
    },
  });
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => permissionTypeApi.removeMany(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ["permissionTypes"] });
      toast.success(`${ids.length} permission type(s) deleted successfully`);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to delete permission types";
      toast.error(message, { duration: 5000 });
      throw error;
    },
  });

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    bulkDelete: bulkDeleteMutation,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isBulkDeleting: bulkDeleteMutation.isPending,
  };
};

export default usePermissionTypeMutations;

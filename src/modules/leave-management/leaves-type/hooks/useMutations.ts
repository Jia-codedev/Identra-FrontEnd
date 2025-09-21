"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import leaveTypeApi from "@/services/leaveManagement/leaveType";
import { toast } from "sonner";

export const useLeaveTypeMutations = () => {
  const queryClient = useQueryClient();

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => leaveTypeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
      toast.success("Leave type created successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to create leave type";
      toast.error(message);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      leaveTypeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
      toast.success("Leave type updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to update leave type";
      toast.error(message);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => leaveTypeApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
      toast.success("Leave type deleted successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to delete leave type";
      toast.error(message);
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => leaveTypeApi.removeMany(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
      toast.success(`${ids.length} leave type(s) deleted successfully`);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to delete leave types";
      toast.error(message);
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

export default useLeaveTypeMutations;

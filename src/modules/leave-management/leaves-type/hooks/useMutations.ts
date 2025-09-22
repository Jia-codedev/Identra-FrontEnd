"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import leaveTypeApi from "@/services/leaveManagement/leaveType";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/use-translations";

export const useLeaveTypeMutations = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  const createMutation = useMutation({
    mutationFn: (data: any) => leaveTypeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
      toast.success(t("leaveManagement.leaveTypes.messages.created") || "Leave type created successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || (t("leaveManagement.leaveTypes.messages.createError") || "Failed to create leave type");
      toast.error(message);
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      leaveTypeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
      toast.success(t("leaveManagement.leaveTypes.messages.updated") || "Leave type updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || (t("leaveManagement.leaveTypes.messages.updateError") || "Failed to update leave type");
      toast.error(message);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => leaveTypeApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
      toast.success(t("leaveManagement.leaveTypes.messages.deleted") || "Leave type deleted successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || (t("leaveManagement.leaveTypes.messages.deleteError") || "Failed to delete leave type");
      toast.error(message);
    },
  });
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => leaveTypeApi.removeMany(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
      toast.success(t("leaveManagement.leaveTypes.messages.bulkDeleted", { count: ids.length }) || `${ids.length} leave type(s) deleted successfully`);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || (t("leaveManagement.leaveTypes.messages.bulkDeleteError") || "Failed to delete leave types");
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

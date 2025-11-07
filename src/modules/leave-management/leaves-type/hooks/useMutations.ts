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
      toast.success(
        t("leaveManagement.leaveTypes.messages.created") ||
          "Leave type created successfully"
      );
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        t("leaveManagement.leaveTypes.messages.createError") ||
        "Failed to create leave type";
      toast.error(message);
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      leaveTypeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
      toast.success(
        t("leaveManagement.leaveTypes.messages.updated") ||
          "Leave type updated successfully"
      );
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        t("leaveManagement.leaveTypes.messages.updateError") ||
        "Failed to update leave type";
      toast.error(message);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await leaveTypeApi.remove(id);
      if (res.status == 400) {
        toast.error(t("toast.error.foreignKeyConstraint"));
        throw new Error("Foreign key constraint error");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
      toast.success(
        t("leaveManagement.leaveTypes.messages.deleted") ||
          "Leave type deleted successfully"
      );
    },
    onError: (error: any) => {
      const errorData = error?.response?.data;
      return;
    },
  });
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const res = await leaveTypeApi.removeMany(ids);
      if (res.status == 400) {
        toast.error(t("toast.error.foreignKeyConstraint"));
        throw new Error("Foreign key constraint error");
      }
      return res;
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
      toast.success(
        t("leaveManagement.leaveTypes.messages.bulkDeleted", {
          count: ids.length,
        }) || `${ids.length} leave type(s) deleted successfully`
      );
    },
    onError: (error: any) => {
      return;
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

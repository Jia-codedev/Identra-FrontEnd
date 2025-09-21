"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/use-translations";
import attendanceApi from "@/services/leaveManagement/attendance";

export default function useAttendanceMutations() {
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["attendance"] });
    queryClient.invalidateQueries({ queryKey: ["attendance-summary"] });
  };

  // Create attendance record
  const create = useMutation({
    mutationFn: attendanceApi.createAttendance,
    onSuccess: () => {
      invalidateQueries();
      toast.success(t("leave-management.attendance.messages.created"));
    },
    onError: (error: any) => {
      toast.error(
        error?.message || t("leave-management.attendance.messages.createError")
      );
    },
  });

  // Update attendance record
  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      attendanceApi.updateAttendance(id, data),
    onSuccess: () => {
      invalidateQueries();
      toast.success(t("leave-management.attendance.messages.updated"));
    },
    onError: (error: any) => {
      toast.error(
        error?.message || t("leave-management.attendance.messages.updateError")
      );
    },
  });

  // Delete attendance record
  const remove = useMutation({
    mutationFn: attendanceApi.deleteAttendance,
    onSuccess: () => {
      invalidateQueries();
      toast.success(t("leave-management.attendance.messages.deleted"));
    },
    onError: (error: any) => {
      toast.error(
        error?.message || t("leave-management.attendance.messages.deleteError")
      );
    },
  });

  // Bulk update attendance records
  const bulkUpdate = useMutation({
    mutationFn: attendanceApi.bulkUpdateAttendance,
    onSuccess: () => {
      invalidateQueries();
      toast.success(t("leave-management.attendance.messages.bulkUpdated"));
    },
    onError: (error: any) => {
      toast.error(
        error?.message ||
          t("leave-management.attendance.messages.bulkUpdateError")
      );
    },
  });

  // Export attendance data
  const exportData = useMutation({
    mutationFn: attendanceApi.exportAttendance,
    onSuccess: (response) => {
      // Create download link for exported file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `attendance-export-${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(t("leave-management.attendance.messages.exported"));
    },
    onError: (error: any) => {
      toast.error(
        error?.message || t("leave-management.attendance.messages.exportError")
      );
    },
  });

  return {
    create,
    update,
    remove,
    bulkUpdate,
    exportData,
  };
}

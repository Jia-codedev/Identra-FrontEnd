"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import attendanceApi from "@/services/leaveManagement/attendance";

export default function useAttendanceMutations() {
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["attendance"] });
    queryClient.invalidateQueries({ queryKey: ["attendance-summary"] });
  };

  // Create attendance record
  const create = useMutation({
    mutationFn: attendanceApi.createAttendance,
    onSuccess: () => {
      invalidateQueries();
      toast.success("Attendance record created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create attendance record");
    },
  });

  // Update attendance record
  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      attendanceApi.updateAttendance(id, data),
    onSuccess: () => {
      invalidateQueries();
      toast.success("Attendance record updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update attendance record");
    },
  });

  // Delete attendance record
  const remove = useMutation({
    mutationFn: attendanceApi.deleteAttendance,
    onSuccess: () => {
      invalidateQueries();
      toast.success("Attendance record deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete attendance record");
    },
  });

  // Bulk update attendance records
  const bulkUpdate = useMutation({
    mutationFn: attendanceApi.bulkUpdateAttendance,
    onSuccess: () => {
      invalidateQueries();
      toast.success("Attendance records updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update attendance records");
    },
  });

  // Export attendance data
  const exportData = useMutation({
    mutationFn: attendanceApi.exportAttendance,
    onSuccess: (response) => {
      // Create download link for exported file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Attendance data exported successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to export attendance data");
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

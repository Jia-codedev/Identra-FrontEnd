"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import employeeShortPermissionsApi from "@/services/leaveManagement/employeeShortPermissions";
import { toast } from "sonner";

export const usePermissionMutations = () => {
  const queryClient = useQueryClient();

  const approve = useMutation({
    mutationFn: async ({ id, data }: { id: number; data?: any }) => {
      return employeeShortPermissionsApi.approve(id, {
        approve_reject_flag: 1,
        status: 'APPROVED',
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success("Permission approved successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to approve permission");
    },
  });

  const reject = useMutation({
    mutationFn: async ({ id, data }: { id: number; data?: any }) => {
      return employeeShortPermissionsApi.approve(id, {
        approve_reject_flag: 2,
        status: 'REJECTED',
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success("Permission rejected successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to reject permission");
    },
  });

  const remove = useMutation({
    mutationFn: async (id: number) => {
      return employeeShortPermissionsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success("Permission deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete permission");
    },
  });

  const create = useMutation({
    mutationFn: async (data: any) => {
      return employeeShortPermissionsApi.add(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success("Permission created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create permission");
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return employeeShortPermissionsApi.edit(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success("Permission updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update permission");
    },
  });

  return {
    approve,
    reject,
    remove,
    create,
    update,
  };
};

export default usePermissionMutations;

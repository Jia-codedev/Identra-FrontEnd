"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import employeeShortPermissionsApi from "@/services/leaveManagement/employeeShortPermissions";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/use-translations";

export const usePermissionMutations = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  const createPermission = useMutation({
    mutationFn: async ({
      permissionData,
      onClose,
      search,
      pageSize,
    }: {
      permissionData: any;
      onClose: () => void;
      search: string;
      pageSize: number;
    }) => {
      const data = await employeeShortPermissionsApi.add(permissionData);
      if (data.status !== 201) {
        toast.error(data.data?.message || t("toast.error.creating"));
        return null;
      }
      onClose();
      let updatedPermissionData = undefined;
      if (data && data.data && data.data.data) {
        updatedPermissionData = data.data.data;
      } else if (data && data.data) {
        updatedPermissionData = data.data;
      } else {
        updatedPermissionData = undefined;
      }
      return { data: updatedPermissionData, onClose, search, pageSize };
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(
        t("leaveManagement.permissions.messages.created") ||
          "Permission created successfully"
      );
      queryClient.setQueryData(
        ["permissions", data.search ?? "", data.pageSize ?? 10],
        (oldData: any) => {
          if (!oldData || !data.data) return oldData;
          if (oldData?.pages) {
            const firstPage = oldData.pages[0];
            const newPage = {
              ...firstPage,
              data: [data.data, ...(firstPage.data || [])],
            };
            return {
              ...oldData,
              pages: [newPage, ...oldData.pages.slice(1)],
            };
          }
          return oldData;
        }
      );
    },
    onError: (error: any) => {
      console.error("Error creating permission:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("toast.error.creating")
      );
    },
  });

  const updatePermission = useMutation({
    mutationFn: async ({
      id,
      permissionData,
      onClose,
      search,
      pageSize,
    }: {
      id: number;
      permissionData: any;
      onClose: () => void;
      search: string;
      pageSize: number;
    }) => {
      const data = await employeeShortPermissionsApi.edit(id, permissionData);
      if (data.status !== 200) {
        toast.error(data.data?.message || t("toast.error.updating"));
        return null;
      }
      onClose();
      let updatedPermissionData = undefined;
      if (data && data.data && data.data.data) {
        updatedPermissionData = data.data.data;
      } else if (data && data.data) {
        updatedPermissionData = data.data;
      } else {
        updatedPermissionData = undefined;
      }
      return { data: updatedPermissionData, onClose, search, pageSize };
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(
        t("leaveManagement.permissions.messages.updated") ||
          "Permission updated successfully"
      );
      queryClient.setQueryData(
        ["permissions", data.search ?? "", data.pageSize ?? 10],
        (oldData: any) => {
          if (!oldData || !data.data) return oldData;
          if (oldData?.pages) {
            const updatedPages = oldData.pages.map((page: any) => ({
              ...page,
              data: Array.isArray(page.data)
                ? page.data.map((permission: any) => {
                    const permissionId =
                      permission.employee_short_permission_id ||
                      permission.short_permission_id;
                    const updatedId =
                      data.data.employee_short_permission_id ||
                      data.data.short_permission_id ||
                      data.data.id;
                    return permissionId === updatedId
                      ? { ...permission, ...data.data }
                      : permission;
                  })
                : page.data,
            }));
            return { ...oldData, pages: updatedPages };
          }
          return oldData;
        }
      );
    },
    onError: (error: any) => {
      console.error("Error updating permission:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("toast.error.updating")
      );
    },
  });

  const deletePermission = useMutation({
    mutationFn: async (id: number) => {
      const data = await employeeShortPermissionsApi.delete(id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success(
        t("leaveManagement.permissions.messages.deleted") ||
          "Permission deleted successfully"
      );
    },
    onError: (error: any) => {
      console.error("Error deleting permission:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("leaveManagement.permissions.messages.deleteError") ||
          "Failed to delete permission"
      );
    },
  });

  const deletePermissions = useMutation({
    mutationFn: async (ids: number[]) => {
      const data = await employeeShortPermissionsApi.deleteMultiple(ids);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success(
        t("leaveManagement.permissions.messages.deletedMultiple") ||
          "Permissions deleted successfully"
      );
    },
    onError: (error: any) => {
      console.error("Error deleting permissions:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("leaveManagement.permissions.messages.deleteError") ||
          "Failed to delete permissions"
      );
    },
  });

  const approve = useMutation({
    mutationFn: async ({ id, data }: { id: number; data?: any }) => {
      return employeeShortPermissionsApi.approve(id, {
        approve_reject_flag: 1,
        status: "APPROVED",
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success(
        t("leaveManagement.permissions.messages.approved") ||
          "Permission approved successfully"
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("leaveManagement.permissions.messages.approveError") ||
          "Failed to approve permission"
      );
    },
  });

  const reject = useMutation({
    mutationFn: async ({ id, data }: { id: number; data?: any }) => {
      return employeeShortPermissionsApi.approve(id, {
        approve_reject_flag: 2,
        status: "REJECTED",
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success(
        t("leaveManagement.permissions.messages.rejected") ||
          "Permission rejected successfully"
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("leaveManagement.permissions.messages.rejectError") ||
          "Failed to reject permission"
      );
    },
  });

  return {
    createPermission,
    updatePermission,
    deletePermission,
    deletePermissions,
    approve,
    reject,
  };
};

export default usePermissionMutations;

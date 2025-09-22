import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IEmployeeGroup } from "../types";
import { toast } from "sonner";
import employeeGroupApi from "@/services/employeemaster/employeeGroup";
import { useTranslations } from '@/hooks/use-translations';

export function useEmployeeGroupMutations() {
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  const createEmployeeGroupMutation = useMutation({
    mutationFn: async ({
      employeeGroupData,
      onClose,
      search,
      pageSize,
    }: {
      employeeGroupData: IEmployeeGroup;
      onClose: () => void;
      search: string;
      pageSize: number;
    }) => {
      const data = await employeeGroupApi.addEmployeeGroup(employeeGroupData);
      if (data.status !== 201) {
        toast.error(data.data?.message || t('toast.error.creating'));
        return null;
      }
      onClose();
      let updatedEmployeeGroupData = undefined;
      if (data?.data?.data) {
        updatedEmployeeGroupData = data.data.data;
      } else if (data?.data) {
        updatedEmployeeGroupData = data.data;
      }
      return { data: updatedEmployeeGroupData, onClose, search, pageSize };
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(t('toast.success.created'));
      queryClient.setQueryData(
        ["employeeGroups", data.search ?? "", data.pageSize ?? 5],
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
    onError: (error) => {
      console.error("Error creating employee group:", error);
    },
  });

  const updateEmployeeGroupMutation = useMutation({
    mutationFn: async ({
      id,
      employeeGroupData,
      onClose,
      search,
      pageSize,
    }: {
      id: number;
      employeeGroupData: IEmployeeGroup;
      onClose: () => void;
      search: string;
      pageSize: number;
    }) => {
      const data = await employeeGroupApi.updateEmployeeGroup(
        id,
        employeeGroupData
      );
      if (data.status !== 200) {
        toast.error(data.data?.message || t('toast.error.updating'));
        return null;
      }
      onClose();
      let updatedEmployeeGroupData = undefined;
      if (data?.data?.data) {
        updatedEmployeeGroupData = data.data.data;
      } else if (data?.data) {
        updatedEmployeeGroupData = data.data;
      }
      return { data: updatedEmployeeGroupData, onClose, search, pageSize };
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(t('toast.success.updated'));
      queryClient.setQueryData(
        ["employeeGroups", data.search ?? "", data.pageSize ?? 5],
        (oldData: any) => {
          if (!oldData || !data.data) return oldData;
          if (oldData?.pages) {
            const updatedPages = oldData.pages.map((page: any) => ({
              ...page,
              data: Array.isArray(page.data)
                ? page.data.map((employeeGroup: IEmployeeGroup) => {
                    const employeeGroupId =
                      employeeGroup.employee_group_id;
                    const updatedId =
                      data.data.employee_group_id ?? data.data.id;
                    return employeeGroupId === updatedId
                      ? { ...employeeGroup, ...data.data }
                      : employeeGroup;
                  })
                : page.data,
            }));
            return { ...oldData, pages: updatedPages };
          }
          return oldData;
        }
      );
    },
    onError: (error) => {
      console.error("Error updating employee group:", error);
    },
  });

  const deleteEmployeeGroupMutation = useMutation({
    mutationFn: async (id: number) => {
      if (typeof id !== "number" || isNaN(id)) {
        const err = new Error("Invalid id provided to deleteEmployeeGroup");
        console.error(err);
        throw err;
      }
      const data = await employeeGroupApi.deleteEmployeeGroup(id);
      return data;
    },
    onSuccess: () => {
      toast.success(t('toast.success.deleted'));
      queryClient.invalidateQueries({ queryKey: ["employeeGroups"] });
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      const url = error?.config?.url;
      const reqData = error?.config?.data;
      const resData = error?.response?.data;
      console.error("Error deleting employee group:", {
        status,
        url,
        reqData,
        resData,
        error,
      });
      const serverMessage = resData?.message || resData?.error || null;
      if (serverMessage) {
        toast.error(serverMessage);
      } else {
        toast.error(t('toast.error.deleting'));
      }
    },
  });

  const deleteEmployeeGroupsMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const data = await employeeGroupApi.deleteEmployeeGroups(ids);
      return data;
    },
    onSuccess: () => {
      toast.success(t('toast.success.deletedMultiple'));
      queryClient.invalidateQueries({ queryKey: ["employeeGroups"] });
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      const url = error?.config?.url;
      const reqData = error?.config?.data;
      const resData = error?.response?.data;
      console.error("Error deleting selected employee groups:", {
        status,
        url,
        reqData,
        resData,
        error,
      });
      const serverMessage = resData?.message || resData?.error || null;
      if (serverMessage) {
        toast.error(serverMessage);
      } else {
        toast.error(t('toast.error.deletingMultiple'));
      }
    },
  });
  
  return {
    createEmployeeGroup: createEmployeeGroupMutation.mutate,
    updateEmployeeGroup: updateEmployeeGroupMutation.mutate,
    deleteEmployeeGroup: deleteEmployeeGroupMutation.mutate,
    deleteEmployeeGroups: deleteEmployeeGroupsMutation.mutate,
  };
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IDepartment } from "../types";
import { toast } from "sonner";
import departmentsApi from "@/services/masterdata/departments";
import { useTranslations } from "@/hooks/use-translations";

export function useDepartmentMutations() {
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  const createDepartmentMutation = useMutation({
    mutationFn: async ({
      departmentData,
      onClose,
      search,
      pageSize,
    }: {
      departmentData: IDepartment;
      onClose: () => void;
      search: string;
      pageSize: number;
    }) => {
      const data = await departmentsApi.addDepartment(departmentData);
      if (data.status !== 201) {
        toast.error(data.data?.message || t("toast.error.creating"));
        return null;
      }
      onClose();
      let updatedDepartmentData;
      if (data?.data?.data) {
        updatedDepartmentData = data.data.data;
      } else if (data?.data) {
        updatedDepartmentData = data.data;
      } else {
        updatedDepartmentData = undefined;
      }
      return { data: updatedDepartmentData, onClose, search, pageSize };
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(t("toast.success.created"));
      queryClient.setQueryData(
        ["departments", data.search ?? "", data.pageSize ?? 10],
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
      console.error("Error creating department:", error);
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: async ({
      id,
      departmentData,
      onClose,
      search,
      pageSize,
    }: {
      id: number;
      departmentData: IDepartment;
      onClose: () => void;
      search: string;
      pageSize: number;
    }) => {
      const data = await departmentsApi.updateDepartment(id, departmentData);
      if (data.status !== 200) {
        toast.error(data.data?.message || t("toast.error.updating"));
        return null;
      }
      onClose();
      let updatedDepartmentData;
      if (data?.data?.data) {
        updatedDepartmentData = data.data.data;
      } else if (data?.data) {
        updatedDepartmentData = data.data;
      } else {
        updatedDepartmentData = undefined;
      }
      return { data: updatedDepartmentData, onClose, search, pageSize };
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(t("toast.success.updated"));
      queryClient.setQueryData(
        ["departments", data.search ?? "", data.pageSize ?? 10],
        (oldData: any) => {
          if (!oldData || !data.data) return oldData;
          if (oldData?.pages) {
            const updatedPages = oldData.pages.map((page: any) => ({
              ...page,
              data: Array.isArray(page.data)
                ? page.data.map((department: IDepartment) => {
                    const departmentId = department.department_id;
                    const updatedId = data.data.department_id ?? data.data.id;
                    return departmentId === updatedId
                      ? { ...department, ...data.data }
                      : department;
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
      console.error("Error updating department:", error);
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: async (id: number) => {
      const data = await departmentsApi.deleteDepartment(id);
      return data;
    },
    onSuccess: () => {
      toast.success(t("toast.success.deleted"));
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error) => {
      toast.error(t("toast.error.deleting"));
      console.error("Error deleting department:", error);
    },
  });

  const deleteDepartmentsMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const data = await departmentsApi.deleteDepartments(ids);
      return data;
    },
    onSuccess: () => {
      toast.success(t("toast.success.deletedMultiple"));
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error) => {
      toast.error(t("toast.error.deletingMultiple"));
      console.error("Error deleting selected departments:", error);
    },
  });

  return {
    createDepartment: createDepartmentMutation.mutate,
    updateDepartment: updateDepartmentMutation.mutate,
    deleteDepartment: deleteDepartmentMutation.mutate,
    deleteDepartments: deleteDepartmentsMutation.mutate,
  };
}

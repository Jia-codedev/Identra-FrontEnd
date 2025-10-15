import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import deptAdminsApi from "@/services/masterdata/deptAdmins";
import { useTranslations } from "@/hooks/use-translations";
import { IDepartmentAdmin } from "../types";

export function useDeptAdminMutations() {
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  const createMutation = useMutation({
    mutationFn: async ({
      deptAdminData,
      onClose,
      search,
      pageSize,
    }: {
      deptAdminData: Partial<IDepartmentAdmin>;
      onClose: () => void;
      search: string;
      pageSize: number;
    }) => {
      const res = await deptAdminsApi.addDeptAdmin(deptAdminData);
      if (res.status !== 201 && res.status !== 200) {
        toast.error(res.data?.message || t("toast.error.creating"));
        return null;
      }
      onClose();
      let created = undefined;
      if (res && res.data && res.data.data) created = res.data.data;
      else if (res && res.data) created = res.data;
      return { data: created, onClose, search, pageSize };
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(t("toast.success.departmentAdminsAdded"));
      queryClient.invalidateQueries({ queryKey: ["deptAdmins"] });
    },
    onError: (err) => {
      toast.error(t("toast.error.departmentAdminsAddError"));
      console.error("create deptAdmin error", err);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      deptAdminData,
      onClose,
      search,
      pageSize,
    }: {
      id: number;
      deptAdminData: Partial<IDepartmentAdmin>;
      onClose: () => void;
      search: string;
      pageSize: number;
    }) => {
      const res = await deptAdminsApi.updateDeptAdmin(id, deptAdminData);
      if (res.status !== 200) {
        toast.error(
          res.data?.message || t("toast.error.departmentAdminsUpdateError")
        );
        return null;
      }
      onClose();
      let updated = undefined;
      if (res && res.data && res.data.data) updated = res.data.data;
      else if (res && res.data) updated = res.data;
      return { data: updated, onClose, search, pageSize };
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(t("toast.success.departmentAdminsUpdated"));
      queryClient.invalidateQueries({ queryKey: ["deptAdmins"] });
    },
    onError: (err) => {
      toast.error(t("toast.error.departmentAdminsUpdateError"));
      console.error("update deptAdmin error", err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await deptAdminsApi.deleteDeptAdmin(id);
      return res;
    },
    onSuccess: () => {
      toast.success(t("toast.success.departmentAdminsDeleted"));
      queryClient.invalidateQueries({ queryKey: ["deptAdmins"] });
    },
    onError: (err) => {
      console.error("delete deptAdmin error", err);
      toast.error(t("toast.error.departmentAdminsDeleteError"));
    },
  });

  const deleteManyMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const res = await deptAdminsApi.deleteDeptAdmins(ids);
      return res;
    },
    onSuccess: () => {
      toast.success(t("toast.success.departmentAdminsDeletedMultiple"));
      queryClient.invalidateQueries({ queryKey: ["deptAdmins"] });
    },
    onError: (err) => {
      console.error("delete multiple deptAdmins error", err);
      toast.error(t("toast.error.departmentAdminsMultipleDeleteError"));
    },
  });

  return {
    createDeptAdmin: createMutation.mutate,
    updateDeptAdmin: updateMutation.mutate,
    deleteDeptAdmin: deleteMutation.mutate,
    deleteDeptAdmins: deleteManyMutation.mutate,
  };
}

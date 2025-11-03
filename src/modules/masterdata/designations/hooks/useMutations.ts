import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IDesignation } from "../types";
import { toast } from "sonner";
import designationsApi from "@/services/masterdata/designation";
import { useTranslations } from '@/hooks/use-translations';

export function useDesignationMutations() {
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  const createDesignationMutation = useMutation({
    mutationFn: async ({
      designationData,
      onClose,
      search,
      pageSize,
    }: {
      designationData: IDesignation;
      onClose: () => void;
      search: string;
      pageSize: number;
    }) => {
      const data = await designationsApi.addDesignation(designationData);
      if (data.status !== 201) {
        toast.error(data.data?.message || t('toast.error.creating'));
        return null;
      }
      onClose();
      let updatedDesignationData;
      if (data?.data?.data) {
        updatedDesignationData = data.data.data;
      } else if (data?.data) {
        updatedDesignationData = data.data;
      } else {
        updatedDesignationData = undefined;
      }
      return { data: updatedDesignationData, onClose, search, pageSize };
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(t('toast.success.created'));
      queryClient.setQueryData(
        ["designations", data.search ?? "", data.pageSize ?? 5],
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
      console.error("Error creating designation:", error);
    },
  });

  const updateDesignationMutation = useMutation({
    mutationFn: async ({
      id,
      designationData,
      onClose,
      search,
      pageSize,
    }: {
      id: number;
      designationData: IDesignation;
      onClose: () => void;
      search: string;
      pageSize: number;
    }) => {
      const data = await designationsApi.updateDesignation(id, designationData);
      if (data.status !== 200) {
        toast.error(data.data?.message || t('toast.error.updating'));
        return null;
      }
      onClose();
      let updatedDesignationData;
      if (data?.data?.data) {
        updatedDesignationData = data.data.data;
      } else if (data?.data) {
        updatedDesignationData = data.data;
      } else {
        updatedDesignationData = undefined;
      }
      return { data: updatedDesignationData, onClose, search, pageSize };
    },
    onSuccess: (data) => {
      if (!data) return;
      toast.success(t('toast.success.updated'));
      queryClient.setQueryData(
        ["designations", data.search ?? "", data.pageSize ?? 5],
        (oldData: any) => {
          if (!oldData || !data.data) return oldData;
          if (oldData?.pages) {
            const updatedPages = oldData.pages.map((page: any) => ({
              ...page,
              data: Array.isArray(page.data)
                ? page.data.map((designation: IDesignation) => {
                    const designationId = designation.designation_id;
                    const updatedId =
                      data.data.designation_id ?? data.data.id;
                    return designationId === updatedId
                      ? { ...designation, ...data.data }
                      : designation;
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
      console.error("Error updating designation:", error);
    },
  });

  const deleteDesignationMutation = useMutation({
    mutationFn: async (id: number) => {
      const data = await designationsApi.deleteDesignation(id);
      return data;
    },
    onSuccess: () => {
      toast.success(t('toast.success.deleted'));
      queryClient.invalidateQueries({ queryKey: ["designations"] });
    },
    onError: (error) => {
      toast.error(t('toast.error.deleting'));
      console.error("Error deleting designation:", error);
    },
  });

  const deleteDesignationsMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const data = await designationsApi.deleteDesignations(ids);
      return data;
    },
    onSuccess: () => {
      toast.success(t('toast.success.deletedMultiple'));
      queryClient.invalidateQueries({ queryKey: ["designations"] });
    },
    onError: (error) => {
      toast.error(t('toast.error.deletingMultiple'));
      console.error("Error deleting selected designations:", error);
    },
  });

  return {
    createDesignation: createDesignationMutation.mutate,
    updateDesignation: updateDesignationMutation.mutate,
    deleteDesignation: deleteDesignationMutation.mutate,
    deleteDesignations: deleteDesignationsMutation.mutate,
  };
}

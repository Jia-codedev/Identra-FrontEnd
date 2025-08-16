import { useMutation, useQueryClient } from "@tanstack/react-query";
import { INationality } from "../types";
import { toast } from "sonner";
import nationalitiesApi from "@/services/masterdata/nationalities";
import { useTranslations } from '@/hooks/use-translations';

export function useNationalityMutations() {
    const queryClient = useQueryClient();
    const { t } = useTranslations();

    const createNationalityMutation = useMutation({
        mutationFn: async ({ nationalityData, onClose, search, pageSize }: { nationalityData: INationality; onClose: () => void; search: string; pageSize: number }) => {
            const data = await nationalitiesApi.addNationality(nationalityData);
            if (data.status !== 201) {
                toast.error(data.data?.message || t('toast.error.creating'));
                return null;
            }
            onClose();
            // Defensive: handle possible undefined structure
            let updatedNationalityData = undefined;
            if (data && data.data && data.data.data) {
                updatedNationalityData = data.data.data;
            } else if (data && data.data) {
                updatedNationalityData = data.data;
            } else {
                updatedNationalityData = undefined;
            }
            return { data: updatedNationalityData, onClose, search, pageSize };
        },
        onSuccess: (data) => {
            if (!data) return;
            toast.success(t('toast.success.created'));
            console.log("Nationality created:", data);
            // Update the cache for the current search and pageSize
            queryClient.setQueryData(["nationalities", data.search ?? "", data.pageSize ?? 5], (oldData: any) => {
                if (!oldData || !data.data) return oldData;
                if (oldData?.pages) {
                    // Insert new nationality at the start of the first page
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
            });
        },
        onError: (error) => {
            console.error("Error creating nationality:", error);
        },
    });
    
    const updateNationalityMutation = useMutation({
        mutationFn: async ({ id, nationalityData, onClose, search, pageSize }: { id: number; nationalityData: INationality; onClose: () => void; search: string; pageSize: number }) => {
            const data = await nationalitiesApi.updateNationality(id, nationalityData);
            if (data.status !== 200) {
                toast.error(data.data?.message || t('toast.error.updating'));
                return null;
            }
            onClose();
            // Defensive: handle possible undefined structure
            let updatedNationalityData = undefined;
            if (data && data.data && data.data.data) {
                updatedNationalityData = data.data.data;
            } else if (data && data.data) {
                updatedNationalityData = data.data;
            } else {
                updatedNationalityData = undefined;
            }
            return { data: updatedNationalityData, onClose, search, pageSize };
        },
        onSuccess: (data) => {
            if (!data) return;
            toast.success(t('toast.success.updated'));
            console.log("Nationality updated:", data);
            // Update the cache for the current search and pageSize
            queryClient.setQueryData(["nationalities", data.search ?? "", data.pageSize ?? 5], (oldData: any) => {
                if (!oldData || !data.data) return oldData;
                if (oldData?.pages) {
                    const updatedPages = oldData.pages.map((page: any) => ({
                        ...page,
                        data: Array.isArray(page.data)
                            ? page.data.map((nationality: INationality) => {
                                const nationalityId = nationality.citizenship_id;
                                const updatedId = data.data.citizenship_id ?? data.data.id;
                                return nationalityId === updatedId ? { ...nationality, ...data.data } : nationality;
                              })
                            : page.data,
                    }));
                    return { ...oldData, pages: updatedPages };
                }
                return oldData;
            });
        },
        onError: (error) => {
            console.error("Error updating nationality:", error);
        }
    });
    
    const deleteNationalityMutation = useMutation({
        mutationFn: async (id: number) => {
            const data = await nationalitiesApi.deleteNationality(id);
            return data;
        },
        onSuccess: () => {
            toast.success(t('toast.success.deleted'));
            queryClient.invalidateQueries({ queryKey: ["nationalities"] });
        },
        onError: (error) => {
            toast.error(t('toast.error.deleting'));
            console.error("Error deleting nationality:", error);
        },
    });

    const deleteNationalitiesMutation = useMutation({
        mutationFn: async (ids: number[]) => {
            const data = await nationalitiesApi.deleteNationalities(ids);
            return data;
        },
        onSuccess: () => {
            toast.success(t('toast.success.deletedMultiple'));
            queryClient.invalidateQueries({ queryKey: ["nationalities"] });
        },
        onError: (error) => {
            toast.error(t('toast.error.deletingMultiple'));
            console.error("Error deleting selected nationalities:", error);
        },
    });

    return {
        createNationality: createNationalityMutation.mutate,
        updateNationality: updateNationalityMutation.mutate,
        deleteNationality: deleteNationalityMutation.mutate,
        deleteNationalities: deleteNationalitiesMutation.mutate,
    };
}

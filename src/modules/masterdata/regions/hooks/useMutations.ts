import regionsApi from "@/services/masterdata/regions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IRegion } from "../types";
import { toast } from "sonner";
import { useTranslations } from '@/hooks/use-translations';

export function useRegionMutations() {
    const queryClient = useQueryClient();
    const { t } = useTranslations();

    const createRegionMutation = useMutation({
        mutationFn: async ({ regionData, onClose, search, pageSize }: { regionData: IRegion; onClose: () => void; search: string; pageSize: number }) => {
            const data = await regionsApi.addRegion(regionData);
            if (data.status !== 201) {
                toast.error(data.data?.message || t('toast.error.creating'));
                return null;
            }
            onClose();
            // Defensive: handle possible undefined structure
            let updatedRegionData = undefined;
            if (data && data.data && data.data.data) {
                updatedRegionData = data.data.data;
            } else if (data && data.data) {
                updatedRegionData = data.data;
            } else {
                updatedRegionData = undefined;
            }
            return { data: updatedRegionData, onClose, search, pageSize };
        },
        onSuccess: (data) => {
            if (!data) return;
            toast.success(t('toast.success.created'));
            console.log("Region created:", data);
            // Update the cache for the current search and pageSize
            queryClient.setQueryData(["regions", data.search ?? "", data.pageSize ?? 5], (oldData: any) => {
                if (!oldData || !data.data) return oldData;
                if (oldData?.pages) {
                    // Insert new region at the start of the first page
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
            console.error("Error creating region:", error);
        },
    });
    const updateRegionMutation = useMutation({
        mutationFn: async ({ id, regionData, onClose, search, pageSize }: { id: number; regionData: IRegion; onClose: () => void; search: string; pageSize: number }) => {
            const data = await regionsApi.updateRegion(id, regionData);
            if (data.status !== 200) {
                toast.error(data.data?.message || t('toast.error.updating'));
                return null;
            }
            onClose();
            // Defensive: handle possible undefined structure
            let updatedRegionData = undefined;
            if (data && data.data && data.data.data) {
                updatedRegionData = data.data.data;
            } else if (data && data.data) {
                updatedRegionData = data.data;
            } else {
                updatedRegionData = undefined;
            }
            return { data: updatedRegionData, onClose, search, pageSize };
        },
        onSuccess: (data) => {
            if (!data) return;
            toast.success(t('toast.success.updated'));
            console.log("Region updated:", data);
            // Update the cache for the current search and pageSize
            queryClient.setQueryData(["regions", data.search ?? "", data.pageSize ?? 5], (oldData: any) => {
                if (!oldData || !data.data) return oldData;
                if (oldData?.pages) {
                    const updatedPages = oldData.pages.map((page: any) => ({
                        ...page,
                        data: Array.isArray(page.data)
                            ? page.data.map((region: IRegion) =>
                                region.location_id === data.data.location_id ? data.data : region
                              )
                            : [],
                    }));
                    return { ...oldData, pages: updatedPages };
                }
                return oldData;
            });
        },
        onError: (error) => {
            console.error("Error updating region:", error);
        }
    });
    const deleteRegionMutation = useMutation({
        mutationFn: async (id: number) => {
            const data = await regionsApi.deleteRegion(id);
            return data;
        },
        onSuccess: () => {
            toast.success(t('toast.success.deleted'));
            queryClient.invalidateQueries({ queryKey: ["regions"] });
        },
        onError: (error) => {
            toast.error(t('toast.error.deleting'));
            console.error("Error deleting region:", error);
        },
    });

    const deleteRegionsMutation = useMutation({
        mutationFn: async (ids: number[]) => {
            const data = await regionsApi.deleteRegions(ids);
            if (data.status === 409) {
                toast.error("Some regions cannot be deleted as they are associated with other records.");
                return null;
            }
            return data;
        },
        onSuccess: (data) => {
            if (!data) return;
            toast.success(t('toast.success.deletedMultiple'));
            queryClient.invalidateQueries({ queryKey: ["regions"] });
        },
        onError: (error) => {
            toast.error(t('toast.error.deletingMultiple'));
            console.error("Error deleting selected regions:", error);
        },
    });

    return {
        createRegion: createRegionMutation.mutate,
        updateRegion: updateRegionMutation.mutate,
        deleteRegion: deleteRegionMutation.mutate,
        deleteRegions: deleteRegionsMutation.mutate,
    };
}
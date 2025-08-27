import sitesApi from "@/services/masterdata/site";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISite } from "../types";
import { toast } from "sonner";
import { useTranslations } from '@/hooks/use-translations';

export function useSiteMutations() {
    const queryClient = useQueryClient();
    const { t } = useTranslations();

    const createSiteMutation = useMutation({
        mutationFn: async ({ siteData, onClose, search, pageSize }: { siteData: ISite; onClose: () => void; search: string; pageSize: number }) => {
            const data = await sitesApi.addSite(siteData);
            if (data.status !== 201) {
                toast.error(data.data?.message || t('toast.error.creating'));
                return null;
            }
            onClose();
            let updatedSiteData = data?.data?.data || data?.data || undefined;
            return { data: updatedSiteData, onClose, search, pageSize };
        },
        onSuccess: (data) => {
            if (!data) return;
            toast.success(t('toast.success.created'));
            queryClient.setQueryData(["sites", data.search ?? "", data.pageSize ?? 5], (oldData: any) => {
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
            });
        },
        onError: (error) => {
            console.error("Error creating site:", error);
        },
    });

    const updateSiteMutation = useMutation({
        mutationFn: async ({ id, siteData, onClose, search, pageSize }: { id: number; siteData: ISite; onClose: () => void; search: string; pageSize: number }) => {
            const data = await sitesApi.updateSite(id, siteData);
            if (data.status !== 200) {
                toast.error(data.data?.message || t('toast.error.updating'));
                return null;
            }
            onClose();
            let updatedSiteData = data?.data?.data || data?.data || undefined;
            return { data: updatedSiteData, onClose, search, pageSize };
        },
        onSuccess: (data) => {
            if (!data) return;
            toast.success(t('toast.success.updated'));
            queryClient.setQueryData(["sites", data.search ?? "", data.pageSize ?? 5], (oldData: any) => {
                if (!oldData || !data.data) return oldData;
                if (oldData?.pages) {
                    const updatedPages = oldData.pages.map((page: any) => ({
                        ...page,
                        data: Array.isArray(page.data)
                            ? page.data.map((site: ISite) =>
                                site.location_id === data.data.location_id ? data.data : site
                              )
                            : [],
                    }));
                    return { ...oldData, pages: updatedPages };
                }
                return oldData;
            });
        },
        onError: (error) => {
            console.error("Error updating site:", error);
        }
    });
    const deleteSiteMutation = useMutation({
        mutationFn: async (id: number) => {
            const data = await sitesApi.deleteSite(id);
            return data;
        },
        onSuccess: () => {
            toast.success(t('toast.success.deleted'));
            queryClient.invalidateQueries({ queryKey: ["sites"] });
        },
        onError: (error) => {
            toast.error(t('toast.error.deleting'));
            console.error("Error deleting site:", error);
        },
    });

    const deleteSitesMutation = useMutation({
        mutationFn: async (ids: number[]) => {
            const data = await sitesApi.deleteSites(ids);
            if (data.status === 409) {
                toast.error("Some sites cannot be deleted as they are associated with other records.");
                return null;
            }
            return data;
        },
        onSuccess: (data) => {
            if (!data) return;
            toast.success(t('toast.success.deletedMultiple'));
            queryClient.invalidateQueries({ queryKey: ["sites"] });
        },
        onError: (error) => {
            toast.error(t('toast.error.deletingMultiple'));
            console.error("Error deleting selected sites:", error);
        },
    });

    return {
        createSite: createSiteMutation.mutate,
        updateSite: updateSiteMutation.mutate,
        deleteSite: deleteSiteMutation.mutate,
        deleteSites: deleteSitesMutation.mutate,
    };
}

export const useRegionMutations = () => {
  return {
    createRegion: ({ regionData, onClose, search, pageSize }: { regionData: ISite; onClose: () => void; search: string; pageSize: number }) => {},
    updateRegion: ({ id, regionData, onClose, search, pageSize }: { id: number; regionData: ISite; onClose: () => void; search: string; pageSize: number }) => {},
    deleteRegion: (id: number) => {},
    deleteRegions: (ids: number[]) => {},
  };
};
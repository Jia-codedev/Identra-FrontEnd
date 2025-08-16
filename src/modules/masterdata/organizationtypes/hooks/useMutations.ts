
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IOrganizationType } from "../types";
import { toast } from "sonner";
import organizationTypesApi from "@/services/masterdata/organizationTypes";
import { useTranslations } from '@/hooks/use-translations';

export function useOrganizationTypeMutations() {
    const queryClient = useQueryClient();
    const { t } = useTranslations();

    const createOrganizationTypeMutation = useMutation({
        mutationFn: async ({ organizationTypeData, onClose, search, pageSize }: { organizationTypeData: IOrganizationType; onClose: () => void; search: string; pageSize: number }) => {
            const refinedOrganizationTypeData = {
                ...organizationTypeData,
            };
            if (!refinedOrganizationTypeData.organization_type_arb) {
                delete refinedOrganizationTypeData.organization_type_arb;
            }
            if (!refinedOrganizationTypeData.organization_type_eng) {
                delete refinedOrganizationTypeData.organization_type_eng;
            }
            const data = await organizationTypesApi.addOrganizationType(refinedOrganizationTypeData);
            if (data.status !== 201) {
                toast.error(data.data?.message || t('toast.error.creating'));
                return null;
            }
            onClose();
            let updatedOrganizationTypeData = undefined;
            if (data && data.data && data.data.data) {
                updatedOrganizationTypeData = data.data.data;
            } else if (data && data.data) {
                updatedOrganizationTypeData = data.data;
            } else {
                updatedOrganizationTypeData = undefined;
            }
            return { data: updatedOrganizationTypeData, onClose, search, pageSize };
        },
        onSuccess: (data) => {
            if (!data) return;
            toast.success(t('toast.success.created'));
            // Update the cache using the correct query key pattern
            queryClient.setQueryData(["organizationtypes", data.search ?? "", data.pageSize ?? 5], (oldData: any) => {
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
            // Also invalidate all organizationtypes queries to ensure consistency
            queryClient.invalidateQueries({ queryKey: ["organizationtypes"] });
        },
        onError: (error) => {
            console.error("Error creating organization type:", error);
        },
    });

    const updateOrganizationTypeMutation = useMutation({
        mutationFn: async ({ id, organizationTypeData, onClose, search, pageSize }: { id: number; organizationTypeData: IOrganizationType; onClose: () => void; search: string; pageSize: number }) => {
            const data = await organizationTypesApi.updateOrganizationType(id, organizationTypeData);
            if (data.status !== 200) {
                toast.error(data.data?.message || t('toast.error.updating'));
                return null;
            }
            onClose();
            let updatedOrganizationTypeData = undefined;
            if (data && data.data && data.data.data) {
                updatedOrganizationTypeData = data.data.data;
            } else if (data && data.data) {
                updatedOrganizationTypeData = data.data;
            } else {
                updatedOrganizationTypeData = undefined;
            }
            return { data: updatedOrganizationTypeData, onClose, search, pageSize };
        },
        onSuccess: (data) => {
            if (!data) return;
            toast.success(t('toast.success.updated'));
            // Update the cache using the correct query key pattern
            queryClient.setQueryData(["organizationtypes", data.search ?? "", data.pageSize ?? 5], (oldData: any) => {
                if (!oldData || !data.data) return oldData;
                if (oldData?.pages) {
                    const updatedPages = oldData.pages.map((page: any) => ({
                        ...page,
                        data: Array.isArray(page.data)
                            ? page.data.map((organizationType: IOrganizationType) => {
                                const organizationTypeId = organizationType.organization_type_id;
                                const updatedId = data.data.organization_type_id ?? data.data.id;
                                return organizationTypeId === updatedId ? { ...organizationType, ...data.data } : organizationType;
                            })
                            : page.data,
                    }));
                    return { ...oldData, pages: updatedPages };
                }
                return oldData;
            });
            // Also invalidate all organizationtypes queries to ensure consistency
            queryClient.invalidateQueries({ queryKey: ["organizationtypes"] });
        },
        onError: (error) => {
            console.error("Error updating organization type:", error);
        }
    });

    const deleteOrganizationTypeMutation = useMutation({
        mutationFn: async (id: number) => {
            const data = await organizationTypesApi.deleteOrganizationType(id);
            return { data, id };
        },
        onSuccess: ({ id }) => {
            toast.success(t('toast.success.deleted'));
            // Update cache by removing the deleted item from all pages
            queryClient.setQueriesData({ queryKey: ["organizationtypes"] }, (oldData: any) => {
                if (!oldData?.pages) return oldData;

                const updatedPages = oldData.pages.map((page: any) => ({
                    ...page,
                    data: Array.isArray(page.data)
                        ? page.data.filter((organizationType: IOrganizationType) =>
                            organizationType.organization_type_id !== id
                        )
                        : page.data,
                }));

                return { ...oldData, pages: updatedPages };
            });
            // Also invalidate queries to ensure consistency
            queryClient.invalidateQueries({ queryKey: ["organizationtypes"] });
        },
        onError: (error) => {
            toast.error(t('toast.error.deleting'));
            console.error("Error deleting organization type:", error);
        },
    });

    const deleteOrganizationTypesMutation = useMutation({
        mutationFn: async (ids: number[]) => {
            const data = await organizationTypesApi.deleteOrganizationTypes(ids);
            if (data.status === 409) {
                toast.error("Some organization types cannot be deleted as they are associated with other records.");
                return null;
            }
            if (data.status !== 200) {
                toast.error(data.data?.message || "Error deleting selected organization types.");
                return null;
            }
            return { data, ids };
        },
        onSuccess: (data) => {
            if (!data) return;
            const { ids } = data;
            toast.success(t('toast.success.deletedMultiple'));
            // Update cache by removing the deleted items from all pages
            queryClient.setQueriesData({ queryKey: ["organizationtypes"] }, (oldData: any) => {
                if (!oldData?.pages) return oldData;

                const updatedPages = oldData.pages.map((page: any) => ({
                    ...page,
                    data: Array.isArray(page.data)
                        ? page.data.filter((organizationType: IOrganizationType) =>
                            !ids.includes(organizationType.organization_type_id)
                        )
                        : page.data,
                }));

                return { ...oldData, pages: updatedPages };
            });
            // Also invalidate queries to ensure consistency
            queryClient.invalidateQueries({ queryKey: ["organizationtypes"] });
        },
        onError: (error) => {
            toast.error(t('toast.error.deletingMultiple'));
            console.error("Error deleting selected organization types:", error);
        },
    });

    return {
        createOrganizationType: createOrganizationTypeMutation.mutate,
        updateOrganizationType: updateOrganizationTypeMutation.mutate,
        deleteOrganizationType: deleteOrganizationTypeMutation.mutate,
        deleteOrganizationTypes: deleteOrganizationTypesMutation.mutate,
    };
}

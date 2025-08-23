
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IOrganization } from "../types";
import { toast } from "sonner";
import organizationsApi from "@/services/masterdata/organizations";
import { useTranslations } from '@/hooks/use-translations';

export function useOrganizationMutations() {
    const queryClient = useQueryClient();
    const { t } = useTranslations();

    const createOrganizationMutation = useMutation({
        mutationFn: async ({ organizationData, onClose, search, pageSize }: { organizationData: IOrganization; onClose: () => void; search: string; pageSize: number }) => {
            const data = await organizationsApi.addOrganization(organizationData);
            if (data.status !== 201) {
                toast.error(data.data?.message || t('toast.error.creating'));
                return null;
            }
            onClose();
            // Defensive: handle possible undefined structure
            let updatedOrganizationData = undefined;
            if (data && data.data && data.data.data) {
                updatedOrganizationData = data.data.data;
            } else if (data && data.data) {
                updatedOrganizationData = data.data;
            } else {
                updatedOrganizationData = undefined;
            }
            return { data: updatedOrganizationData, onClose, search, pageSize };
        },
        onSuccess: (data) => {
            if (!data) return;
            toast.success(t('toast.success.created'));
            console.log("Organization created:", data);
            // Update the cache for the current search and pageSize
            queryClient.setQueryData(["organizations", data.search ?? "", data.pageSize ?? 5], (oldData: any) => {
                if (!oldData || !data.data) return oldData;
                if (oldData?.pages) {
                    // Insert new organization at the start of the first page
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
    const updateOrganizationMutation = useMutation({
        mutationFn: async ({ id, organizationData, onClose, search, pageSize }: { id: number; organizationData: IOrganization; onClose: () => void; search: string; pageSize: number }) => {
            const data = await organizationsApi.updateOrganization(id, organizationData);
            if (data.status !== 200) {
                toast.error(data.data?.message || t('toast.error.updating'));
                return null;
            }
            onClose();
            // Defensive: handle possible undefined structure
            let updatedOrganizationData = undefined;
            if (data && data.data && data.data.data) {
                updatedOrganizationData = data.data.data;
            } else if (data && data.data) {
                updatedOrganizationData = data.data;
            } else {
                updatedOrganizationData = undefined;
            }
            return { data: updatedOrganizationData, onClose, search, pageSize };
        },
        onSuccess: (data) => {
            if (!data) return;
            toast.success(t('toast.success.updated'));
            console.log("Organization updated:", data);
            // Update the cache for the current search and pageSize
            queryClient.setQueryData(["organizations", data.search ?? "", data.pageSize ?? 5], (oldData: any) => {
                if (!oldData || !data.data) return oldData;
                if (oldData?.pages) {
                    const updatedPages = oldData.pages.map((page: any) => ({
                        ...page,
                        data: Array.isArray(page.data)
                            ? page.data.map((organization: IOrganization) => {
                                const organizationId = organization.organization_id;
                                const updatedId = data.data.organization_id ?? data.data.id;
                                return organizationId === updatedId ? { ...organization, ...data.data } : organization;
                              })
                            : page.data,
                    }));
                    return { ...oldData, pages: updatedPages };
                }
                return oldData;
            });
        },
        onError: (error) => {
            console.error("Error updating organization:", error);
        }
    });
    const deleteOrganizationMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await organizationsApi.deleteOrganization(id);
            // If backend returns Conflict (409), surface the message and return null
            if (response?.status === 409) {
                toast.error(response.data?.message || t('toast.error.deleting'));
                return null;
            }
            // For other non-success statuses, show generic error and return null
            if (response?.status !== 200) {
                toast.error(response.data?.message || t('toast.error.deleting'));
                return null;
            }
            return response;
        },
        onSuccess: (data) => {
            // If mutationFn returned null (conflict or handled error), do nothing
            if (!data) return;
            toast.success(t('toast.success.deleted'));
            queryClient.invalidateQueries({ queryKey: ["organizations"] });
        },
        onError: (error) => {
            toast.error(t('toast.error.deleting'));
            console.error("Error deleting organization:", error);
        },
    });
    const deleteOrganizationsMutation = useMutation({
        mutationFn: async (ids: number[]) => {
            const response = await organizationsApi.deleteOrganizations(ids);
            if (response?.status === 409) {
                toast.error(response.data?.message || t('toast.error.deletingMultiple'));
                return null;
            }
            if (response?.status !== 200) {
                toast.error(response.data?.message || t('toast.error.deletingMultiple'));
                return null;
            }
            return response;
        },
        onSuccess: (data) => {
            if (!data) return;
            toast.success(t('toast.success.deletedMultiple'));
            queryClient.invalidateQueries({ queryKey: ["organizations"] });
        },
        onError: (error) => {
            toast.error(t('toast.error.deletingMultiple'));
            console.error("Error deleting organizations:", error);
        },
    });
    return {
        createOrganization: createOrganizationMutation.mutate,
        updateOrganization: updateOrganizationMutation.mutate,
        deleteOrganization: deleteOrganizationMutation.mutate,
        deleteOrganizations: deleteOrganizationsMutation.mutate,
    };
}
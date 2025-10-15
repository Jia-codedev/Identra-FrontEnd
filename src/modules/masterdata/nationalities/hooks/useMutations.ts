import { useMutation, useQueryClient } from "@tanstack/react-query";
import { INationality } from "../types";
import { toast } from "sonner";
import nationalitiesApi from "@/services/masterdata/nationalities";
import { useTranslations } from '@/hooks/use-translations';
import { isAxiosError } from 'axios';

export function useNationalityMutations() {
    const queryClient = useQueryClient();
    const { t } = useTranslations();

    const createNationalityMutation = useMutation({
        mutationFn: async ({ nationalityData, onClose, search, pageSize }: { nationalityData: INationality; onClose: () => void; search: string; pageSize: number }) => {
            try {
                const data = await nationalitiesApi.addNationality(nationalityData);
                if (data.status !== 201) {
                    toast.error(data.data?.message || t('toast.error.creating'));
                    return null;
                }
                onClose();
                let updatedNationalityData = undefined;
                if (data && data.data && data.data.data) {
                    updatedNationalityData = data.data.data;
                } else if (data && data.data) {
                    updatedNationalityData = data.data;
                } else {
                    updatedNationalityData = undefined;
                }
                return { data: updatedNationalityData, onClose, search, pageSize };
            } catch (err: any) {
                if (isAxiosError(err)) {
                    const serverMessage = err.response?.data?.message;
                    if (err.response?.status === 409) {
                        toast.error(serverMessage || t('toast.error.conflict'));
                    } else {
                        toast.error(serverMessage || t('toast.error.creating'));
                    }
                    console.error('Create nationality failed:', {
                        status: err.response?.status,
                        url: err.config?.url,
                        requestData: err.config?.data,
                        responseData: err.response?.data,
                    });
                } else {
                    console.error('Create nationality unexpected error:', err);
                    toast.error(t('toast.error.creating'));
                }
                throw err;
            }
        },
        onSuccess: (data) => {
            if (!data) return;
            toast.success(t('toast.success.created'));
            queryClient.setQueryData(["nationalities", data.search ?? "", data.pageSize ?? 5], (oldData: any) => {
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
            console.error("Error creating nationality:", error);
        },
    });
    
    const updateNationalityMutation = useMutation({
        mutationFn: async ({ id, nationalityData, onClose, search, pageSize }: { id: number; nationalityData: INationality; onClose: () => void; search: string; pageSize: number }) => {
            try {
                const data = await nationalitiesApi.updateNationality(id, nationalityData);
                if (data.status !== 200) {
                    toast.error(data.data?.message || t('toast.error.updating'));
                    return null;
                }
                onClose();
                let updatedNationalityData = undefined;
                if (data && data.data && data.data.data) {
                    updatedNationalityData = data.data.data;
                } else if (data && data.data) {
                    updatedNationalityData = data.data;
                } else {
                    updatedNationalityData = undefined;
                }
                return { data: updatedNationalityData, onClose, search, pageSize };
            } catch (err: any) {
                if (isAxiosError(err)) {
                    const serverMessage = err.response?.data?.message;
                    if (err.response?.status === 409) {
                        toast.error(serverMessage || t('toast.error.conflict'));
                    } else {
                        toast.error(serverMessage || t('toast.error.updating'));
                    }
                    console.error('Update nationality failed:', {
                        status: err.response?.status,
                        url: err.config?.url,
                        requestData: err.config?.data,
                        responseData: err.response?.data,
                    });
                } else {
                    console.error('Update nationality unexpected error:', err);
                    toast.error(t('toast.error.updating'));
                }
                throw err;
            }
        },
        onSuccess: (data) => {
            if (!data) return;
            toast.success(t('toast.success.updated'));
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
            try {
                const data = await nationalitiesApi.deleteNationality(id);
                return data;
            } catch (err: any) {
                if (isAxiosError(err)) {
                    const serverMessage = err.response?.data?.message;
                    if (err.response?.status === 409) {
                        toast.error(serverMessage || t('toast.error.conflict'));
                    } else {
                        toast.error(serverMessage || t('toast.error.deleting'));
                    }
                    console.error('Delete nationality failed:', {
                        status: err.response?.status,
                        url: err.config?.url,
                        requestData: err.config?.data,
                        responseData: err.response?.data,
                    });
                } else {
                    console.error('Delete nationality unexpected error:', err);
                    toast.error(t('toast.error.deleting'));
                }
                throw err;
            }
        },
        onSuccess: () => {
            toast.success(t('toast.success.deleted'));
            queryClient.invalidateQueries({ queryKey: ["nationalities"] });
        },
        onError: (error) => {
            toast.error(t('toast.error.deleting'));
        },
    });

    const deleteNationalitiesMutation = useMutation({
        mutationFn: async (ids: number[]) => {
            try {
                const data = await nationalitiesApi.deleteNationalities(ids);
                return data;
            } catch (err: any) {
                if (isAxiosError(err)) {
                    const serverMessage = err.response?.data?.message;
                    if (err.response?.status === 409) {
                        toast.error(serverMessage || t('toast.error.conflict'));
                    } else {
                        toast.error(serverMessage || t('toast.error.deletingMultiple'));
                    }
                    console.error('Bulk delete nationalities failed:', {
                        status: err.response?.status,
                        url: err.config?.url,
                        requestData: err.config?.data,
                        responseData: err.response?.data,
                    });
                } else {
                    console.error('Bulk delete nationalities unexpected error:', err);
                    toast.error(t('toast.error.deletingMultiple'));
                }
                throw err;
            }
        },
        onSuccess: () => {
            toast.success(t('toast.success.deletedMultiple'));
            queryClient.invalidateQueries({ queryKey: ["nationalities"] });
        },
        onError: (error) => {
            toast.error(t('toast.error.deletingMultiple'));
        },
    });

    return {
        createNationality: createNationalityMutation.mutate,
        updateNationality: updateNationalityMutation.mutate,
        deleteNationality: deleteNationalityMutation.mutate,
        deleteNationalities: deleteNationalitiesMutation.mutate,
    };
}

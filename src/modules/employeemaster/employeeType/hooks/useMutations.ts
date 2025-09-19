import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IEmployeeType } from "../types";
import { toast } from "sonner";
import employeeTypeApi from "@/services/employeemaster/employeeType";
import { useTranslations } from '@/hooks/use-translations';
import { isAxiosError } from 'axios';

export function useEmployeeTypeMutations() {
    const queryClient = useQueryClient();
    const { t } = useTranslations();

    const createEmployeeTypeMutation = useMutation({
        mutationFn: async ({ employeeTypeData, onClose, search, pageSize }: { employeeTypeData: IEmployeeType; onClose: () => void; search: string; pageSize: number }) => {
            try {
                const data = await employeeTypeApi.addEmployeeType(employeeTypeData);
                if (data.status !== 201) {
                    toast.error(data.data?.message || t('toast.error.creating'));
                    return null;
                }
                onClose();
                let updatedEmployeeTypeData = undefined;
                if (data && data.data && data.data.data) {
                    updatedEmployeeTypeData = data.data.data;
                } else if (data && data.data) {
                    updatedEmployeeTypeData = data.data;
                } else {
                    updatedEmployeeTypeData = undefined;
                }
                return { data: updatedEmployeeTypeData, onClose, search, pageSize };
            } catch (err: any) {
                if (isAxiosError(err)) {
                    const serverMessage = err.response?.data?.message;
                    if (err.response?.status === 409) {
                        toast.error(serverMessage || t('toast.error.conflict'));
                    } else {
                        toast.error(serverMessage || t('toast.error.creating'));
                    }
                    console.error('Create employee type failed:', {
                        status: err.response?.status,
                        url: err.config?.url,
                        requestData: err.config?.data,
                        responseData: err.response?.data,
                    });
                } else {
                    console.error('Create employee type unexpected error:', err);
                    toast.error(t('toast.error.creating'));
                }
                throw err;
            }
        },
        onSuccess: (data) => {
            if (!data) return;
            toast.success(t('toast.success.created'));
            queryClient.setQueryData(["employeeTypes", data.search ?? "", data.pageSize ?? 5], (oldData: any) => {
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
            console.error("Error creating employee type:", error);
        },
    });
    const updateEmployeeTypeMutation = useMutation({
        mutationFn: async ({ id, employeeTypeData, onClose, search, pageSize }: { id: number; employeeTypeData: IEmployeeType; onClose: () => void; search: string; pageSize: number }) => {
            try {
                const data = await employeeTypeApi.updateEmployeeType(id, employeeTypeData);
                if (data.status !== 200) {
                    toast.error(data.data?.message || t('toast.error.updating'));
                    return null;
                }
                onClose();
                let updatedEmployeeTypeData = undefined;
                if (data && data.data && data.data.data) {
                    updatedEmployeeTypeData = data.data.data;
                } else if (data && data.data) {
                    updatedEmployeeTypeData = data.data;
                } else {
                    updatedEmployeeTypeData = undefined;
                }
                return { data: updatedEmployeeTypeData, onClose, search, pageSize };
            } catch (err: any) {
                if (isAxiosError(err)) {
                    const serverMessage = err.response?.data?.message;
                    if (err.response?.status === 409) {
                        toast.error(serverMessage || t('toast.error.conflict'));
                    } else {
                        toast.error(serverMessage || t('toast.error.updating'));
                    }
                    console.error('Update employee type failed:', {
                        status: err.response?.status,
                        url: err.config?.url,
                        requestData: err.config?.data,
                        responseData: err.response?.data,
                    });
                } else {
                    console.error('Update employee type unexpected error:', err);
                    toast.error(t('toast.error.updating'));
                }
                throw err;
            }
        },
        onSuccess: (data) => {
            if (!data) return;
            toast.success(t('toast.success.updated'));
            queryClient.setQueryData(["employeeTypes", data.search ?? "", data.pageSize ?? 5], (oldData: any) => {
                if (!oldData || !data.data) return oldData;
                if (oldData?.pages) {
                    const updatedPages = oldData.pages.map((page: any) => ({
                        ...page,
                        data: Array.isArray(page.data)
                            ? page.data.map((employeeType: IEmployeeType) => {
                                const employeeTypeId = employeeType.employee_type_id;
                                const updatedId = data.data.employee_type_id ?? data.data.id;
                                return employeeTypeId === updatedId ? { ...employeeType, ...data.data } : employeeType;
                              })
                            : page.data,
                    }));
                    return { ...oldData, pages: updatedPages };
                }
                return oldData;
            });
        },
        onError: (error) => {
            console.error("Error updating employee type:", error);
        }
    });
    const deleteEmployeeTypeMutation = useMutation({
        mutationFn: async (id: number) => {
            try {
                const data = await employeeTypeApi.deleteEmployeeType(id);
                return data;
            } catch (err: any) {
                if (isAxiosError(err)) {
                    const serverMessage = err.response?.data?.message;
                    if (err.response?.status === 409) {
                        toast.error(serverMessage || t('toast.error.conflict'));
                    } else {
                        toast.error(serverMessage || t('toast.error.deleting'));
                    }
                    console.error('Delete employee type failed:', {
                        status: err.response?.status,
                        url: err.config?.url,
                        requestData: err.config?.data,
                        responseData: err.response?.data,
                    });
                } else {
                    console.error('Delete employee type unexpected error:', err);
                    toast.error(t('toast.error.deleting'));
                }
                throw err;
            }
        },
        onSuccess: () => {
            toast.success(t('toast.success.deleted'));
            queryClient.invalidateQueries({ queryKey: ["employeeTypes"] });
        },
        onError: (error) => {
            toast.error(t('toast.error.deleting'));
        },
    });

    const deleteEmployeeTypesMutation = useMutation({
        mutationFn: async (ids: number[]) => {
            try {
                const data = await employeeTypeApi.deleteEmployeeTypes(ids);
                return data;
            } catch (err: any) {
                if (isAxiosError(err)) {
                    const serverMessage = err.response?.data?.message;
                    if (err.response?.status === 409) {
                        toast.error(serverMessage || t('toast.error.conflict'));
                    } else {
                        toast.error(serverMessage || t('toast.error.deletingMultiple'));
                    }
                    console.error('Bulk delete employee types failed:', {
                        status: err.response?.status,
                        url: err.config?.url,
                        requestData: err.config?.data,
                        responseData: err.response?.data,
                    });
                } else {
                    console.error('Bulk delete employee types unexpected error:', err);
                    toast.error(t('toast.error.deletingMultiple'));
                }
                throw err;
            }
        },
        onSuccess: () => {
            toast.success(t('toast.success.deletedMultiple'));
            queryClient.invalidateQueries({ queryKey: ["employeeTypes"] });
        },
        onError: (error) => {
            toast.error(t('toast.error.deletingMultiple'));
        },
    });

    return {
        createEmployeeType: createEmployeeTypeMutation.mutate,
        updateEmployeeType: updateEmployeeTypeMutation.mutate,
        deleteEmployeeType: deleteEmployeeTypeMutation.mutate,
        deleteEmployeeTypes: deleteEmployeeTypesMutation.mutate,
    };
}
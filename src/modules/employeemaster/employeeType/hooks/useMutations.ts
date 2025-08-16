import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IEmployeeType } from "../types";
import { toast } from "sonner";
import employeeTypeApi from "@/services/employeemaster/employeeType";
import { useTranslations } from '@/hooks/use-translations';

export function useEmployeeTypeMutations() {
    const queryClient = useQueryClient();
    const { t } = useTranslations();

    const createEmployeeTypeMutation = useMutation({
        mutationFn: async ({ employeeTypeData, onClose, search, pageSize }: { employeeTypeData: IEmployeeType; onClose: () => void; search: string; pageSize: number }) => {
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
            const data = await employeeTypeApi.deleteEmployeeType(id);
            return data;
        },
        onSuccess: () => {
            toast.success(t('toast.success.deleted'));
            queryClient.invalidateQueries({ queryKey: ["employeeTypes"] });
        },
        onError: (error) => {
            toast.error(t('toast.error.deleting'));
            console.error("Error deleting employee type:", error);
        },
    });

    const deleteEmployeeTypesMutation = useMutation({
        mutationFn: async (ids: number[]) => {
            const data = await employeeTypeApi.deleteEmployeeTypes(ids);
            return data;
        },
        onSuccess: () => {
            toast.success(t('toast.success.deletedMultiple'));
            queryClient.invalidateQueries({ queryKey: ["employeeTypes"] });
        },
        onError: (error) => {
            toast.error(t('toast.error.deletingMultiple'));
            console.error("Error deleting selected employee types:", error);
        },
    });

    return {
        createEmployeeType: createEmployeeTypeMutation.mutate,
        updateEmployeeType: updateEmployeeTypeMutation.mutate,
        deleteEmployeeType: deleteEmployeeTypeMutation.mutate,
        deleteEmployeeTypes: deleteEmployeeTypesMutation.mutate,
    };
}
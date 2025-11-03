import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IGrade } from "../types";
import { toast } from 'sonner';
import gradesApi from "@/services/masterdata/grades";
import { useTranslations } from '@/hooks/use-translations';

export function useGradeMutations() {
    const queryClient = useQueryClient();
    const { t } = useTranslations();

    const createGradeMutation = useMutation({
        mutationFn: async ({ gradeData, onClose, search, pageSize }: { gradeData: IGrade; onClose: () => void; search: string; pageSize: number }) => {
            const data = await gradesApi.addGrade(gradeData);
            if (data.status !== 201) {
                toast.error(data.data?.message || t('toast.error.creating'));
                return null;
            }
            onClose();
            let updatedGradeData = undefined;
            if (data && data.data && data.data.data) {
                updatedGradeData = data.data.data;
            } else if (data && data.data) {
                updatedGradeData = data.data;
            } else {
                updatedGradeData = undefined;
            }
            return { data: updatedGradeData, onClose, search, pageSize };
        },
        onSuccess: (data) => {
            if (!data) return;
            toast.success(t('toast.success.created'));
            queryClient.setQueryData(["grades", data.search ?? "", data.pageSize ?? 5], (oldData: any) => {
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
            console.error("Error creating region:", error);
        },
    });
    const updateGradeMutation = useMutation({
        mutationFn: async ({ id, gradeData, onClose, search, pageSize }: { id: number; gradeData: IGrade; onClose: () => void; search: string; pageSize: number }) => {
            const data = await gradesApi.updateGrade(id, gradeData);
            if (data.status !== 200) {
                toast.error(data.data?.message || t('toast.error.updating'));
                return null;
            }
            onClose();
            let updatedGradeData = undefined;
            if (data && data.data && data.data.data) {
                updatedGradeData = data.data.data;
            } else if (data && data.data) {
                updatedGradeData = data.data;
            } else {
                updatedGradeData = undefined;
            }
            return { data: updatedGradeData, onClose, search, pageSize };
        },
        onSuccess: (data) => {
            if (!data) return;
            toast.success(t('toast.success.updated'));
            queryClient.setQueryData(["grades", data.search ?? "", data.pageSize ?? 5], (oldData: any) => {
                if (!oldData || !data.data) return oldData;
                if (oldData?.pages) {
                    const updatedPages = oldData.pages.map((page: any) => ({
                        ...page,
                        data: Array.isArray(page.data)
                            ? page.data.map((grade: IGrade) => {
                                const gradeId = grade.grade_id;
                                const updatedId = data.data.grade_id ?? data.data.id;
                                return gradeId === updatedId ? { ...grade, ...data.data } : grade;
                              })
                            : page.data,
                    }));
                    return { ...oldData, pages: updatedPages };
                }
                return oldData;
            });
        },
        onError: (error) => {
            console.error("Error updating grade:", error);
        }
    });
    const deleteGradeMutation = useMutation({
        mutationFn: async (id: number) => {
            const data = await gradesApi.deleteGrade(id);
            return data;
        },
        onSuccess: () => {
            toast.success(t('toast.success.deleted'));
            queryClient.invalidateQueries({ queryKey: ["grades"] });
        },
        onError: (error) => {
            toast.error(t('toast.error.deleting'));
            console.error("Error deleting grade:", error);
        },
    });

    const deleteGradesMutation = useMutation({
        mutationFn: async (ids: number[]) => {
            const data = await gradesApi.deleteGrades(ids);
            return data;
        },
        onSuccess: () => {
            toast.success(t('toast.success.deletedMultiple'));
            queryClient.invalidateQueries({ queryKey: ["grades"] });
        },
        onError: (error) => {
            toast.error(t('toast.error.deletingMultiple'));
            console.error("Error deleting selected grades:", error);
        },
    });

    return {
        createGrade: createGradeMutation.mutate,
        updateGrade: updateGradeMutation.mutate,
        deleteGrade: deleteGradeMutation.mutate,
        deleteGrades: deleteGradesMutation.mutate,
    };
}
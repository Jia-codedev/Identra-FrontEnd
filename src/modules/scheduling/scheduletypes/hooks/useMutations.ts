"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/use-translations";
import schedulesApi from "@/services/scheduling/schedules";
import { CreateScheduleRequest, UpdateScheduleRequest } from "../types";

interface MutationParams {
  onClose?: () => void;
  search?: string;
  pageSize?: number;
}

interface UpdateMutationParams extends MutationParams {
  id: number;
  scheduleData: UpdateScheduleRequest;
}

interface CreateMutationParams extends MutationParams {
  scheduleData: CreateScheduleRequest;
}

export const useScheduleMutations = () => {
  const { t } = useTranslations();
  const queryClient = useQueryClient();

  const createSchedule = useMutation({
    mutationFn: (data: CreateScheduleRequest) => schedulesApi.addSchedule(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      queryClient.invalidateQueries({ queryKey: ["parent-schedules-search"] });
      queryClient.invalidateQueries({ queryKey: ["parentSchedules"] });
      queryClient.invalidateQueries({ queryKey: ["organizations-search"] });
      queryClient.invalidateQueries({ queryKey: ["locations-search"] });
      toast.success(t("toast.success.created"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("toast.error.general");
      toast.error(message);
      console.error("Error creating schedule:", error);
    },
  });

  const updateSchedule = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateScheduleRequest }) =>
      schedulesApi.updateSchedule(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      queryClient.invalidateQueries({ queryKey: ["parent-schedules-search"] });
      queryClient.invalidateQueries({ queryKey: ["parentSchedules"] });
      queryClient.invalidateQueries({ queryKey: ["organizations-search"] });
      queryClient.invalidateQueries({ queryKey: ["locations-search"] });
      toast.success(t("toast.success.updated"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("toast.error.general");
      toast.error(message);
      console.error("Error updating schedule:", error);
    },
  });

  const deleteSchedule = useMutation({
    mutationFn: (id: number) => schedulesApi.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      queryClient.invalidateQueries({ queryKey: ["parent-schedules-search"] });
      queryClient.invalidateQueries({ queryKey: ["parentSchedules"] });
      toast.success(t("toast.success.deleted"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("toast.error.general");
      toast.error(message);
      console.error("Error deleting schedule:", error);
    },
  });

  const deleteMultipleSchedules = useMutation({
    mutationFn: (ids: number[]) => schedulesApi.deleteMultipleSchedules(ids),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      // Use provided toast.json key; include count in message if translation supports it
      try {
        toast.success(
          t("toast.success.deletedMultiple", { count: variables.length })
        );
      } catch {
        toast.success(t("toast.success.deletedMultiple"));
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("toast.error.general");
      toast.error(message);
      console.error("Error deleting schedules:", error);
    },
  });

  return {
    createSchedule: (params: CreateMutationParams) => {
      createSchedule.mutate(params.scheduleData, {
        onSuccess: () => {
          params.onClose?.();
        },
      });
    },
    updateSchedule: (params: UpdateMutationParams) => {
      updateSchedule.mutate(
        { id: params.id, data: params.scheduleData },
        {
          onSuccess: () => {
            params.onClose?.();
          },
        }
      );
    },
    deleteSchedule: (id: number) => {
      deleteSchedule.mutate(id);
    },
    deleteMultipleSchedules: (ids: number[]) => {
      deleteMultipleSchedules.mutate(ids);
    },
    isCreating: createSchedule.isPending,
    isUpdating: updateSchedule.isPending,
    isDeleting: deleteSchedule.isPending,
    isDeletingMultiple: deleteMultipleSchedules.isPending,
  };
};

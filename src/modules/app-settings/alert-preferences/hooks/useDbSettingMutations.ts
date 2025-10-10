"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import chronDbSettingsApi from "@/services/settings/chronDbSettings";
import type {
  ChronDbSetting,
  CreateChronDbSettingRequest,
  UpdateChronDbSettingRequest,
} from "../types";

export const useDbSettingMutations = () => {
  const queryClient = useQueryClient();

  const createDbSetting = useMutation({
    mutationFn: (data: CreateChronDbSettingRequest) =>
      chronDbSettingsApi.createDbSetting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dbSettings"] });
      toast.success("Database setting created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create database setting");
    },
  });

  const updateDbSetting = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateChronDbSettingRequest }) =>
      chronDbSettingsApi.updateDbSetting(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dbSettings"] });
      toast.success("Database setting updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update database setting");
    },
  });

  const deleteDbSetting = useMutation({
    mutationFn: (id: number) => chronDbSettingsApi.deleteDbSetting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dbSettings"] });
      toast.success("Database setting deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete database setting");
    },
  });

  return {
    createDbSetting: createDbSetting.mutate,
    updateDbSetting: updateDbSetting.mutate,
    deleteDbSetting: deleteDbSetting.mutate,
    isCreating: createDbSetting.isPending,
    isUpdating: updateDbSetting.isPending,
    isDeleting: deleteDbSetting.isPending,
  };
};
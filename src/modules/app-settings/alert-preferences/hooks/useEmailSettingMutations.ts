"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import chronEmailSettingsApi from "@/services/settings/chronEmailSettings";
import type {
  ChronEmailSetting,
  CreateChronEmailSettingRequest,
  UpdateChronEmailSettingRequest,
  TestEmailRequest,
} from "../types";

export const useEmailSettingMutations = () => {
  const queryClient = useQueryClient();

  const createEmailSetting = useMutation({
    mutationFn: (data: CreateChronEmailSettingRequest) =>
      chronEmailSettingsApi.createEmailSetting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailSettings"] });
      toast.success("Email setting created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create email setting");
    },
  });

  const updateEmailSetting = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateChronEmailSettingRequest }) =>
      chronEmailSettingsApi.updateEmailSetting(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailSettings"] });
      toast.success("Email setting updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update email setting");
    },
  });

  const deleteEmailSetting = useMutation({
    mutationFn: (id: number) => chronEmailSettingsApi.deleteEmailSetting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailSettings"] });
      toast.success("Email setting deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete email setting");
    },
  });

  const deleteEmailSettings = useMutation({
    mutationFn: (ids: number[]) => chronEmailSettingsApi.deleteEmailSettings(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailSettings"] });
      toast.success("Email settings deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete email settings");
    },
  });

  const sendTestEmail = useMutation({
    mutationFn: (data: TestEmailRequest) => chronEmailSettingsApi.sendTestEmail(data),
    onSuccess: () => {
      toast.success("Test email sent successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to send test email");
    },
  });

  const checkConfiguration = useMutation({
    mutationFn: () => chronEmailSettingsApi.checkConfiguration(),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to check configuration");
    },
  });

  const reinitializeService = useMutation({
    mutationFn: () => chronEmailSettingsApi.reinitializeService(),
    onSuccess: () => {
      toast.success("Email service reinitialized successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to reinitialize service");
    },
  });

  return {
    createEmailSetting: createEmailSetting.mutate,
    updateEmailSetting: updateEmailSetting.mutate,
    deleteEmailSetting: deleteEmailSetting.mutate,
    deleteEmailSettings: deleteEmailSettings.mutate,
    sendTestEmail: sendTestEmail.mutate,
    checkConfiguration: checkConfiguration.mutate,
    reinitializeService: reinitializeService.mutate,
    isCreating: createEmailSetting.isPending,
    isUpdating: updateEmailSetting.isPending,
    isDeleting: deleteEmailSetting.isPending,
    isDeletingMultiple: deleteEmailSettings.isPending,
    isSendingTest: sendTestEmail.isPending,
    isChecking: checkConfiguration.isPending,
    isReinitializing: reinitializeService.isPending,
  };
};
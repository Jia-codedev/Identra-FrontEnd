"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import biometricTerminalsApi, { CreateBiometricTerminalRequest, UpdateBiometricTerminalRequest } from "@/services/biometric-terminals/biometricTerminalsApi";
import { useTranslations } from "@/hooks/use-translations";

export const useBiometricTerminalMutations = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  const createBiometricTerminal = useMutation({
    mutationFn: (data: CreateBiometricTerminalRequest) => biometricTerminalsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biometric-terminals"] });
      toast.success(t("biometricTerminals.success.created"));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || t("biometricTerminals.error.create");
      toast.error(message);
    },
  });

  const updateBiometricTerminal = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBiometricTerminalRequest }) => 
      biometricTerminalsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biometric-terminals"] });
      toast.success(t("biometricTerminals.success.updated"));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || t("biometricTerminals.error.update");
      toast.error(message);
    },
  });

  const deleteBiometricTerminal = useMutation({
    mutationFn: (id: number) => biometricTerminalsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biometric-terminals"] });
      toast.success(t("biometricTerminals.success.deleted"));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || t("biometricTerminals.error.delete");
      toast.error(message);
    },
  });

  const deleteManyBiometricTerminals = useMutation({
    mutationFn: (ids: number[]) => biometricTerminalsApi.deleteMany(ids),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["biometric-terminals"] });
      toast.success(t("biometricTerminals.success.bulkDeleted", { count: data.count }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || t("biometricTerminals.error.bulkDelete");
      toast.error(message);
    },
  });

  return {
    createBiometricTerminal,
    updateBiometricTerminal,
    deleteBiometricTerminal,
    deleteManyBiometricTerminals,
  };
};

export default useBiometricTerminalMutations;
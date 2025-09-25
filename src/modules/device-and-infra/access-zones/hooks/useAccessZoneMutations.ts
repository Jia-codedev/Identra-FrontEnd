"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import accessZonesApi, {
  CreateAccessZoneRequest,
  UpdateAccessZoneRequest,
} from "@/services/device-and-infra/accessZonesApi";
import { useTranslations } from "@/hooks/use-translations";

export const useAccessZoneMutations = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  const createAccessZone = useMutation({
    mutationFn: (data: CreateAccessZoneRequest) => accessZonesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-zones"] });
      toast.success(t("accessZones.success.created"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("accessZones.error.create");
      toast.error(message);
    },
  });

  const updateAccessZone = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAccessZoneRequest }) =>
      accessZonesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-zones"] });
      toast.success(t("accessZones.success.updated"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("accessZones.error.update");
      toast.error(message);
    },
  });

  const deleteAccessZone = useMutation({
    mutationFn: (id: number) => accessZonesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-zones"] });
      toast.success(t("accessZones.success.deleted"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("accessZones.error.delete");
      toast.error(message);
    },
  });

  const bulkDeleteAccessZones = useMutation({
    mutationFn: (ids: number[]) => accessZonesApi.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-zones"] });
      toast.success(t("accessZones.success.bulkDeleted"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("accessZones.error.bulkDelete");
      toast.error(message);
    },
  });

  return {
    createAccessZone,
    updateAccessZone,
    deleteAccessZone,
    bulkDeleteAccessZones,
  };
};

export default useAccessZoneMutations;

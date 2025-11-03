"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import buildingsApi, { Building, CreateBuildingRequest, UpdateBuildingRequest } from "@/services/device-and-infra/buildingsApi";
import { useTranslations } from "@/hooks/use-translations";

export const useBuildingMutations = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  const createBuilding = useMutation({
    mutationFn: (data: CreateBuildingRequest) => buildingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      toast.success(t("buildings.success.created"));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || t("buildings.error.create");
      toast.error(message);
    },
  });

  const updateBuilding = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBuildingRequest }) =>
      buildingsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      toast.success(t("buildings.success.updated"));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || t("buildings.error.update");
      toast.error(message);
    },
  });

  const deleteBuilding = useMutation({
    mutationFn: (id: number) => buildingsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      toast.success(t("buildings.success.deleted"));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || t("buildings.error.delete");
      toast.error(message);
    },
  });

  const bulkDeleteBuildings = useMutation({
    mutationFn: (ids: number[]) => buildingsApi.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      toast.success(t("buildings.success.deleted"));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || t("buildings.error.delete");
      toast.error(message);
    },
  });

  return {
    createBuilding,
    updateBuilding,
    deleteBuilding,
    bulkDeleteBuildings,
  };
};

export default useBuildingMutations;
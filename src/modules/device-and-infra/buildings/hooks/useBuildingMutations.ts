"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import buildingsApi, { Building, CreateBuildingRequest, UpdateBuildingRequest } from "@/services/device-and-infra/buildingsApi";

export const useBuildingMutations = () => {
  const queryClient = useQueryClient();

  const createBuilding = useMutation({
    mutationFn: (data: CreateBuildingRequest) => buildingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
    onError: (error: Error) => {
      console.error("Failed to create building:", error.message);
    },
  });

  const updateBuilding = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBuildingRequest }) =>
      buildingsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
    onError: (error: Error) => {
      console.error("Failed to update building:", error.message);
    },
  });

  const deleteBuilding = useMutation({
    mutationFn: (id: number) => buildingsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
    onError: (error: Error) => {
      console.error("Failed to delete building:", error.message);
    },
  });

  const bulkDeleteBuildings = useMutation({
    mutationFn: (ids: number[]) => buildingsApi.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
    onError: (error: Error) => {
      console.error("Failed to delete buildings:", error.message);
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
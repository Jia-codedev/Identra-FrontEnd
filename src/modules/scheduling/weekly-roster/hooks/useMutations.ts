import { useMutation, useQueryClient } from "@tanstack/react-query";
import organizationSchedulesApi, {
  CreateOrganizationScheduleRequest,
} from "@/services/scheduling/organizationSchedules";

export const useMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateOrganizationScheduleRequest) =>
      organizationSchedulesApi.createOrganizationSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weekly-roster"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateOrganizationScheduleRequest>;
    }) => organizationSchedulesApi.updateOrganizationSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weekly-roster"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      organizationSchedulesApi.deleteOrganizationSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weekly-roster"] });
    },
  });

  const deleteManyMutation = useMutation({
    mutationFn: (ids: number[]) => organizationSchedulesApi.deleteMany(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weekly-roster"] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    deleteManyMutation,
  };
};

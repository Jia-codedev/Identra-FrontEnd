import { useMutation, useQueryClient } from '@tanstack/react-query';
import groupSchedulesApi, { ICreateGroupSchedule, IUpdateGroupSchedule } from '@/services/scheduling/groupSchedules';

export const useMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: ICreateGroupSchedule) => groupSchedulesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-roster'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateGroupSchedule }) => 
      groupSchedulesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-roster'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => groupSchedulesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-roster'] });
    },
  });

  const deleteManyMutation = useMutation({
    mutationFn: (ids: number[]) => groupSchedulesApi.deleteMany(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-roster'] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    deleteManyMutation,
  };
};

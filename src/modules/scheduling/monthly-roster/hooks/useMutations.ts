import { useMutation } from '@tanstack/react-query';
import employeeMonthlyRosterApi, { UpdateMonthlyRosterRequest, CreateMonthlyRosterRequest, FilterMonthlyRosterRequest } from '@/services/scheduling/employeeMonthlyRoster';

export const useMonthlyRosterMutations = () => {
  const createMutation = useMutation({
    mutationFn: async (data: CreateMonthlyRosterRequest) => {
      return employeeMonthlyRosterApi.add(data);
    },
  });

  const finalizeMutation = useMutation({
    mutationFn: async (id: number) => {
      return employeeMonthlyRosterApi.finalize(id);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return employeeMonthlyRosterApi.delete(id);
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateMonthlyRosterRequest }) => {
      return employeeMonthlyRosterApi.edit(id, data);
    },
  });

  const importMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return employeeMonthlyRosterApi.importFile(formData);
    },
  });

  const exportMutation = useMutation({
    mutationFn: async (filters: FilterMonthlyRosterRequest) => {
      return employeeMonthlyRosterApi.export(filters);
    },
  });

  return { createMutation, finalizeMutation, deleteMutation, editMutation, importMutation, exportMutation };
};

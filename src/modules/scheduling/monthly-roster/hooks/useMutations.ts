import { useMutation, useQueryClient } from "@tanstack/react-query";
import employeeMonthlyRosterApi, {
  UpdateMonthlyRosterRequest,
  CreateMonthlyRosterRequest,
  FilterMonthlyRosterRequest,
} from "@/services/scheduling/employeeMonthlyRoster";

export const useMonthlyRosterMutations = () => {
  const queryClient = useQueryClient();
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
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateMonthlyRosterRequest;
    }) => {
      return employeeMonthlyRosterApi.edit(id, data);
    },
    onSuccess: (response, variables) => {
      // Get the updated record from the response
      const updatedRecord = response?.data?.data;

      if (updatedRecord) {
        // Update all monthly-roster queries in the cache
        queryClient.setQueriesData(
          { queryKey: ["monthly-roster"], exact: false },
          (oldData: any) => {
            if (!oldData || !Array.isArray(oldData)) return oldData;

            // Find and replace the updated record in the array
            return oldData.map((record: any) =>
              record.schedule_roster_id === variables.id
                ? { ...record, ...updatedRecord }
                : record
            );
          }
        );
      }

      // Invalidate all monthly-roster queries to trigger refetch
      queryClient.invalidateQueries({
        queryKey: ["monthly-roster"],
        exact: false,
        refetchType: "active",
      });
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

  return {
    createMutation,
    finalizeMutation,
    deleteMutation,
    editMutation,
    importMutation,
    exportMutation,
  };
};

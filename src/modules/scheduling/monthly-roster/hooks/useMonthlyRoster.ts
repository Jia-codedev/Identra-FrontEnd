import { useQuery, UseQueryResult } from '@tanstack/react-query';
import employeeMonthlyRosterApi, { FilterMonthlyRosterRequest, MonthlyRoster } from '@/services/scheduling/employeeMonthlyRoster';

export const useMonthlyRoster = (
  filters: FilterMonthlyRosterRequest | undefined
): UseQueryResult<MonthlyRoster[]> => {
  return useQuery<MonthlyRoster[]>({
    queryKey: ['monthly-roster', filters],
    queryFn: async () => {
      // Always return the same resolved type to satisfy the query function contract
      if (!filters) {
        return [] as MonthlyRoster[];
      }
      console.log('Fetching monthly roster with filters:', filters);
      const response = await employeeMonthlyRosterApi.filter(filters);
      console.log('Monthly roster API response:', response);
      
      // Backend returns { success: true, data: [...] } according to the OpenAPI spec
      const data = response?.data?.data || [];
      console.log('Extracted data:', data);
      return data as MonthlyRoster[];
    },
    enabled: !!filters && !!filters.organization_id && !!filters.month && !!filters.year,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    initialData: [] as MonthlyRoster[],
  });
};

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";
import employeeMonthlyRosterApi, {
  FilterMonthlyRosterRequest,
  MonthlyRoster,
} from "@/services/scheduling/employeeMonthlyRoster";

export const useMonthlyRoster = (
  filters: FilterMonthlyRosterRequest | undefined
): UseQueryResult<MonthlyRoster[]> => {
  return useQuery<MonthlyRoster[]>({
    queryKey: ["monthly-roster", filters],
    queryFn: async () => {
      if (!filters) return [] as MonthlyRoster[];
      try {
        const body = {
          ...filters,
          limit: (filters as any).limit ?? 50,
          offset: (filters as any).offset ?? 1,
        } as any;
        const response = await employeeMonthlyRosterApi.filter(body);
        const data = response?.data?.data || [];
        return data as MonthlyRoster[];
      } catch (err) {
        console.error("Monthly roster fetch error:", err);
        try {
          toast.error("Failed to load monthly roster");
        } catch {}
        return [] as MonthlyRoster[];
      }
    },
    enabled:
      !!filters &&
      !!filters.organization_id &&
      !!filters.month &&
      !!filters.year,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    initialData: [] as MonthlyRoster[],
  });
};

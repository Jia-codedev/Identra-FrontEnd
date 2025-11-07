import { useQuery } from "@tanstack/react-query";
import organizationSchedulesApi from "@/services/scheduling/organizationSchedules";
import { WeeklyRosterFilters } from "../types";

export const useWeeklyRoster = ({
  page = 1,
  pageSize = 10,
  filters = {},
  search = "",
}: {
  page?: number;
  pageSize?: number;
  filters?: WeeklyRosterFilters;
  search?: string;
} = {}) => {
  return useQuery({
    queryKey: [
      "weekly-roster",
      "organization-schedules",
      page,
      pageSize,
      filters,
      search,
    ],
    queryFn: async () => {
      const params: any = {
        offset: page,
        limit: pageSize,
      };

      if (filters.organization_id)
        params.organization_id = filters.organization_id;
      if (filters.from_date) params.from_date = filters.from_date.toISOString();
      if (filters.to_date) params.to_date = filters.to_date.toISOString();
      if (search) params.organization_name = search;

      const response =
        await organizationSchedulesApi.filterOrganizationSchedules(params);
      const schedules = response?.data?.data ?? [];
      const total = response?.data?.pagination?.total_count ?? 0;
      const hasNext = response?.data?.pagination?.has_next ?? false;

      return { data: schedules, total, hasNext };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

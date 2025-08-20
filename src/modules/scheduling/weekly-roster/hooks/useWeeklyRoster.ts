import { useQuery } from '@tanstack/react-query';
import groupSchedulesApi from '@/services/scheduling/groupSchedules';
import { WeeklyRosterFilters } from '../types';

export const useWeeklyRoster = ({ page = 1, pageSize = 10, filters = {}, search = '' } : { page?: number; pageSize?: number; filters?: WeeklyRosterFilters; search?: string; } = {}) => {
  return useQuery({
    queryKey: ['weekly-roster', 'group-schedules', page, pageSize, filters, search],
    queryFn: async () => {
      const offset = (page - 1) * pageSize;
      const params: any = {
        offset,
        limit: pageSize,
      };

      if (filters.employee_group_id) params.employee_group_id = filters.employee_group_id;
      if (filters.start_date) params.start_date = filters.start_date.toISOString();
      if (filters.end_date) params.end_date = filters.end_date.toISOString();
      if (search) params.search = search;

      const gsResp = await groupSchedulesApi.getAll(params);
      const groups = gsResp?.data ?? [];
      return { data: groups, total: gsResp?.total ?? 0, hasNext: gsResp?.hasNext ?? false };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

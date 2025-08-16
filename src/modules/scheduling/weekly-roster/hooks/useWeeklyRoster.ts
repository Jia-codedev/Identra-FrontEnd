import { useQuery } from '@tanstack/react-query';
import groupSchedulesApi from '@/services/scheduling/groupSchedules';

export const useWeeklyRoster = () => {
  return useQuery({
    queryKey: ['weekly-roster', 'group-schedules'],
    queryFn: () => groupSchedulesApi.getAll(),
    select: (data) => data?.data || [],
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

import apiClient from "@/configs/api/Axios";
import frontendSettings from "@/configs/constants/envValidation";

export interface InsightsState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export async function useInsights() {
  const [a, w, l, d] = await Promise.all([
    apiClient.get("/dashboard/attendance"),
    apiClient.get("/dashboard/work-schedule"),
    apiClient.get("/dashboard/leave-analytics"),
    apiClient.get("/dashboard/work-hour-trends"),
  ]);
  return {
    attendance: {
      data: a,
      loading: false,
      error: null,
    },
    workSchedule: {
      data: w,
      loading: false,
      error: null,
    },
    leaveAnalytics: {
      data: l,
      loading: false,
      error: null,
    },
    workHourTrends: {
      data: d,
      loading: false,
      error: null,
    },
  };
}

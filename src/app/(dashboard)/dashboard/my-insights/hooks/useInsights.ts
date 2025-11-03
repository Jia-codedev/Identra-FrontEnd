"use client";

import { useCallback, useEffect, useState } from "react";
import apiClient from "@/configs/api/Axios";

export interface InsightsState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

async function fetcher<T = any>(url: string) {
  const res = await apiClient.get(url);
  return res.data;
}

export default function useInsights() {
  const [attendance, setAttendance] = useState<InsightsState | null>(null);
  const [workSchedule, setWorkSchedule] = useState<InsightsState | null>(null);
  const [leaveAnalytics, setLeaveAnalytics] = useState<InsightsState | null>(
    null
  );
  const [workHourTrends, setWorkHourTrends] = useState<InsightsState | null>(
    null
  );

  const load = useCallback(async () => {
    // attendance
    setAttendance({ data: null, loading: true, error: null });
    setWorkSchedule({ data: null, loading: true, error: null });
    setLeaveAnalytics({ data: null, loading: true, error: null });
    setWorkHourTrends({ data: null, loading: true, error: null });

    try {
      const [a, w, l, d] = await Promise.all([
        fetcher("/dashboard/attendance"),
        fetcher("/dashboard/work-schedule"),
        fetcher("/dashboard/leave-analytics"),
        fetcher("/dashboard/work-hour-trends"),
      ]);

      setAttendance({ data: a, loading: false, error: null });
      setWorkSchedule({ data: w, loading: false, error: null });
      setLeaveAnalytics({ data: l, loading: false, error: null });
      setWorkHourTrends({ data: d, loading: false, error: null });
    } catch (err: any) {
      const message = err?.message || "Failed to load insights";
      setAttendance((s) => (s ? { ...s, loading: false, error: message } : s));
      setWorkSchedule((s) =>
        s ? { ...s, loading: false, error: message } : s    
      );
      setLeaveAnalytics((s) =>
        s ? { ...s, loading: false, error: message } : s
      );

      setWorkHourTrends((s) =>
        s ? { ...s, loading: false, error: message } : s
      );
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    attendance,
    workSchedule,
    leaveAnalytics,
    workHourTrends,
    refresh: load,
  } as const;
}

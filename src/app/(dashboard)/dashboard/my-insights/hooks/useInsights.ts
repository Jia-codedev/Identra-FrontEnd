"use client";
import apiClient from "@/configs/api/Axios";
import { useState, useEffect } from "react";

export interface InsightsState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}


export function useInsights() {
  const [isLoading, setIsLoading] = useState(true);
  const [attendance, setAttendance] = useState<InsightsState>({
    data: null,
    loading: true,
    error: null,
  });
  const [workSchedule, setWorkSchedule] = useState<InsightsState>({
    data: null,
    loading: true,
    error: null,
  });
  const [leaveAnalytics, setLeaveAnalytics] = useState<InsightsState>({
    data: null,
    loading: true,
    error: null,
  });
  const [workHourTrends, setWorkHourTrends] = useState<InsightsState>({
    data: null,
    loading: true,
    error: null,
  });
  const [profile, setProfile] = useState<InsightsState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setIsLoading(true);
        const p = await apiClient.get("/dashboard/profile");
        setProfile({
          data: p.data?.profile,
          loading: false,
          error: null,
        });
        const [a, w, l, d] = await Promise.all([
          apiClient.get("/dashboard/attendance"),
          apiClient.get("/dashboard/work-schedule"),
          apiClient.get("/dashboard/leave-analytics"),
          apiClient.get("/dashboard/work-hour-trends"),
        ]);

        // Update states with fetched data
        setAttendance({
          data: a.data.data[0],
          loading: false,
          error: null,
        });

        setWorkSchedule({
          data: w.data,
          loading: false,
          error: null,
        });

        setLeaveAnalytics({
          data: l.data,
          loading: false,
          error: null,
        });

        setWorkHourTrends({
          data: d.data,
          loading: false,
          error: null,
        });

      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch insights";

        // Set error state for all data
        setAttendance((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        setWorkSchedule((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        setLeaveAnalytics((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        setWorkHourTrends((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));

        console.error("Error fetching insights:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return {
    isLoading,
    attendance,
    workSchedule,
    leaveAnalytics,
    workHourTrends,
    profile,
  };
}

"use client";

import React from "react";
import useInsights from "../hooks/useInsights";
import AnalyticsGrid from "../components/AnalyticsGrid";
import PunchCard from "../components/PunchCard";
import InsightsCard from "../components/InsightsCard";
import Sparkline from "../components/Sparkline";
import MiniBarChart from "../components/MiniBarChart";
import { numericSeriesFromWorkHourTrends } from "../components/dataUtils";

function MyInsights() {
  const { attendance, workSchedule, leaveAnalytics, workHourTrends, refresh } =
    useInsights();

  // Simple derived states
  const loading =
    attendance?.loading ||
    workSchedule?.loading ||
    leaveAnalytics?.loading ||
    workHourTrends?.loading;

  const error =
    attendance?.error ||
    workSchedule?.error ||
    leaveAnalytics?.error ||
    workHourTrends?.error ||
    null;

  return (
    <div className="p-4">
      <div className="mb-4">
        <button onClick={() => refresh()} className="btn">
          Refresh
        </button>
      </div>

      {loading ? (
        <div>Loading insights…</div>
      ) : error ? (
        <div className="text-red-600">Error: {error}</div>
      ) : (
        <AnalyticsGrid>
          <div className="md:col-span-2">
            <PunchCard
              punches={attendance?.data?.punches ?? []}
              onPunch={refresh}
            />
          </div>

          <InsightsCard title="Work Schedule">
            {workSchedule?.data && workSchedule.data.length > 0 ? (
              <div className="text-sm">
                <div>Schedule: {workSchedule.data[0].SchCode ?? "—"}</div>
                <div>
                  In: {workSchedule.data[0].InTime ?? "—"} · Out:{" "}
                  {workSchedule.data[0].OutTime ?? "—"}
                </div>
                <div className="mt-2">
                  <MiniBarChart
                    data={numericSeriesFromWorkHourTrends(
                      workSchedule?.data[0]?.history ?? []
                    )}
                  />
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No schedule data
              </div>
            )}
          </InsightsCard>

          <InsightsCard title="Leave Analytics">
            {Array.isArray(leaveAnalytics?.data) &&
            leaveAnalytics.data.length > 0 ? (
              <Sparkline
                data={numericSeriesFromWorkHourTrends(leaveAnalytics)}
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                No leave analytics to show
              </div>
            )}
          </InsightsCard>

          <InsightsCard title="Work Hour Trends">
            {Array.isArray(workHourTrends?.data) &&
            workHourTrends.data.length > 0 ? (
              <Sparkline
                data={numericSeriesFromWorkHourTrends(workHourTrends)}
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                No trends to show
              </div>
            )}
          </InsightsCard>
        </AnalyticsGrid>
      )}
    </div>
  );
}

export default MyInsights;

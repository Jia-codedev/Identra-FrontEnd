import React from "react";
import { useInsights } from "../hooks/useInsights";
import LeavesAndPermissionsCard from "../components/LeavesAndPermissionsCard";
import EventTransation from "../components/EventTransation";
import WelcomeCard from "../components/WelcomeCard";
import LeaveAnalytics from "../components/LeaveAnalytics";
import WorkHoursTrends from "../components/WorkHoursTrends";
import Violation from "../components/Violation";
import Schedule from "../components/Schedule";
import Announcements from "../components/Anouncements";

async function MyInsights() {
  const { attendance, workSchedule, leaveAnalytics, workHourTrends } =
    await useInsights();

  return (
    <div
      className="py-4"
    >
      <div className="grid grid-cols-6 gap-2">
        <div className="col-span-1 row-span-1 gap-2">
          <WelcomeCard />
        </div>
        <div className="col-span-3 row-span-1 h-full">
          <LeavesAndPermissionsCard />
        </div>
        <div className="col-span-2 row-span-1 h-full">
          <EventTransation />
        </div>
        <div className="col-span-3">
          <WorkHoursTrends />
        </div>
        <div className="col-span-3 grid grid-cols-2 grid-rows-2 gap-2">
          <div className="col-span-2">
            <Violation />
          </div>
          <div className="col-span-2">
            <Schedule />
          </div>
        </div>
        <div className="col-span-3">
          <Announcements />
        </div>
        <div className="col-span-3">
          <LeaveAnalytics />
        </div>
      </div>
    </div>
  );
}

export default MyInsights;

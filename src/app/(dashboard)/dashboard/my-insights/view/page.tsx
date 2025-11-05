"use client";
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
function MyInsights() {
  const { attendance, workSchedule, leaveAnalytics, workHourTrends, profile } =
    useInsights();
  return (
    <div
      className="py-4"
    >
      <div className="grid grid-cols-6 gap-2">
        <div className="col-span-1 row-span-1 gap-2">
          <WelcomeCard
            isLoading={profile.loading}
            profile={
              {
                email: profile.data?.email,
                firstname_eng: profile.data?.firstname_eng,
                lastname_eng: profile.data?.lastname_eng,
                organization_arb: profile.data?.organization_arb,
                organization_eng: profile.data?.organization_eng,
                role: profile.data?.role,
              }
            } />
        </div>
        <div className="col-span-3 row-span-1 h-full">
          <LeavesAndPermissionsCard
            isLoading={attendance.loading}
            leavesData={{
              absent: Number(attendance?.data?.Absent ?? 0),
              approvedLeaves: Number(attendance?.data?.ApprovedLeaves ?? 0),
              leavesTaken: Number(attendance?.data?.LeaveTaken ?? 0),
              pendingLeaves: Number(attendance?.data?.PendingLeaves ?? 0),
              totalLeaves: Number(attendance?.data?.TotalLeaves ?? 0),
              workingDays: Number(attendance?.data?.WorkingDays ?? 0)
            }}
            permissionsData={{
              permissionTaken: `${attendance?.data?.TotalPermissionCnt ?? 0} hrs`,
              pendingPermissions: String(attendance?.data?.PendingPermissions ?? 0),
              totalPermissions: Number(attendance?.data?.TotalPermissions ?? 0),
              workingDays: Number(attendance?.data?.WorkingDays ?? 0),
              unapprovedPermissions: String(attendance?.data?.UnapprovedPermissions ?? 0),
              approvedPermissions: String(attendance?.data?.ApprovedPermissions ?? 0),
            }}
          />
        </div>
        <div className="col-span-2 row-span-1 h-full">
          <EventTransation />
        </div>
        <div className="col-span-3">
          <WorkHoursTrends
            apiData={Array.isArray((workHourTrends as any)?.data)
              ? (workHourTrends as any).data as any
              : (workHourTrends as any)?.data?.data as any}
          />
        </div>
        <div className="col-span-3 grid grid-cols-2 grid-rows-2 gap-2">
          <div className="col-span-2">
            <Violation
              isLoading={attendance.loading}
              data={{
                early: Number(attendance?.data?.Early ?? 0),
                late: Number(attendance?.data?.Late ?? 0),
                missedIn: Number(attendance?.data?.TotalMissedIn ?? 0),
                missedOut: Number(attendance?.data?.TotalMissedOut ?? 0),
              }}
            />
          </div>
          <div className="col-span-2">
            <Schedule
              apiData={Array.isArray((workSchedule as any)?.data)
                ? (workSchedule as any).data[0] as any
                : (workSchedule as any)?.data?.data?.[0] as any}
            />
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

"use client";

import React from "react";
import Header from "./header";
import LeaveCard from './(SelfStatistics)/LeaveCard'
import TimerCard from "./(SelfStatistics)/TimerCard";
import LeaveAnalyticsCard from "./(SelfStatistics)/LeaveAnalyticsCard";
import ViolationsCard from "./(SelfStatistics)/ViolationsCard";
import WorkTrendsCard from "./(SelfStatistics)/WorkTrendsCard";
import ScheduleCard from "./(SelfStatistics)/ScheduleCard";
import ServicesStatisticsCard from "./(SelfStatistics)/ServicesStatisticsCard";
import InsightsCard from "./(SelfStatistics)/InsightsCard";

function Dashboard() {
  const [tab, setTab] = React.useState<string>("");

  return (
    <div className="page-container">
      <Header setTab={setTab} tab={tab} />
      <div className="widget-group-1 flex justify-between mx-6 gap-4">
        <div className="card-widget max-w-[calc(100vh / 3 * 4)] w-full h-auto flex flex-col gap-4">
          <LeaveCard/>
          <LeaveAnalyticsCard/>
        </div>
        <div className='card-widget max-w-[calc(100vh / 1 * 4)] w-full h-auto flex flex-col gap-4'>
          <TimerCard/>
          <ViolationsCard/>
        </div>
      </div>
      <div className="widget-group-2 flex justify-between mx-6 gap-4 my-4">
        <div className="card-widget w-full h-auto flex flex-col gap-4">
          <WorkTrendsCard/>
        </div>
        <div className='card-widget max-w-[35%] w-full h-auto flex flex-col gap-4'>
          <ScheduleCard/>
        </div>
      </div>
      <div className="widget-group-3 flex justify-between mx-6 gap-4 mb-4">
        <div className="card-widget max-w-[35%] w-full h-auto flex flex-col gap-4">
          <ServicesStatisticsCard/>
        </div>
        <div className='card-widget w-full h-auto flex flex-col gap-4'>
          <InsightsCard/>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
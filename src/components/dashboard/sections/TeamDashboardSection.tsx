"use client";

import React from "react";
import StatCard from "../widgets/StatCard";
import ChartCard from "../widgets/ChartCard";
import BadgeGroupCard from "../widgets/BadgeGroupCard";
import ProgressCard from "../widgets/ProgressCard";
import AttendanceChart from "../charts/AttendanceChart";
import LeaveDistributionChart from "../charts/LeaveDistributionChart";
import { motion } from "framer-motion";
import { 
  Users, 
  UserCheck, 
  UserX, 
  AlertTriangle,
  FileText,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Clock
} from "lucide-react";

const TeamDashboardSection: React.FC = () => {
  // Mock data for team overview
  const totalEmployees = 150;
  const punchedInOut = 142;
  const notYetPunchedIn = 8;
  const leaveCountToday = 12;
  const absentWithoutLeave = 3;
  const pendingApprovals = 7;
  const avgAttendanceRate = 94.7;
  const productivityScore = 87;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  // Mock chart data for attendance by department
  const attendanceByDeptData = {
    labels: ['Engineering', 'HR', 'Sales', 'Marketing', 'Finance'],
    datasets: [
      {
        label: 'Present',
        data: [45, 8, 25, 15, 12],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: 'Absent',
        data: [3, 1, 2, 1, 1],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
      {
        label: 'On Leave',
        data: [2, 1, 3, 2, 4],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      }
    ],
  };

  // Mock chart data for violation trends
  const violationTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Late In',
        data: [5, 3, 7, 2, 4, 1, 0],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Early Out',
        data: [2, 1, 3, 1, 2, 0, 0],
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Missed Punch',
        data: [1, 2, 1, 3, 1, 0, 0],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
        tension: 0.4,
      },
    ],
  };

  // Mock chart data for leave usage
  const leaveUsageData = {
    labels: ['Annual Leave', 'Sick Leave', 'Emergency', 'Maternity', 'Personal'],
    datasets: [
      {
        data: [35, 20, 15, 10, 20],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Departmental overview data
  const departmentData = [
    { text: "Engineering (48)", count: 95, variant: "default" as const },
    { text: "Sales (27)", count: 92, variant: "secondary" as const },
    { text: "Marketing (18)", count: 89, variant: "outline" as const },
    { text: "HR (10)", count: 98, variant: "default" as const },
    { text: "Finance (17)", count: 96, variant: "secondary" as const },
    { text: "Operations (30)", count: 91, variant: "outline" as const },
  ].filter(item => item.text && item.text.trim() !== '');

  // Team performance metrics
  const teamMetrics = [
    { text: "Avg Attendance", count: 95, variant: "default" as const },
    { text: "On-Time Rate", count: 88, variant: "secondary" as const },
    { text: "Productivity", count: 92, variant: "outline" as const },
    { text: "Goal Achievement", count: 87, variant: "default" as const },
  ].filter(item => item.text && item.text.trim() !== '');

  // Weekly performance data
  const weeklyData = [
    { text: "Mon", count: 98, variant: "default" as const },
    { text: "Tue", count: 96, variant: "secondary" as const },
    { text: "Wed", count: 94, variant: "outline" as const },
    { text: "Thu", count: 97, variant: "default" as const },
    { text: "Fri", count: 89, variant: "secondary" as const },
  ].filter(item => item.text && item.text.trim() !== '');

  return (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div key="team-header" variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Team Dashboard</h2>
            <p className="text-sm text-muted-foreground mt-1">Monitor team performance, attendance, and productivity</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="hidden sm:inline">Live tracking active</span>
          </div>
        </div>
      </motion.div>
      
      {/* Team Overview Section - Enhanced Grid */}
      <motion.div key="team-overview" variants={itemVariants}>
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Team Overview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            title="Total Employees"
            value={totalEmployees}
            icon={<Users className="w-5 h-5" />}
            variant="default"
            className="col-span-1"
          />
          
          <StatCard
            title="Present Today"
            value={punchedInOut}
            subtitle="Live status"
            icon={<UserCheck className="w-5 h-5" />}
            variant="success"
            className="col-span-1"
          />
          
          <StatCard
            title="Not Checked In"
            value={notYetPunchedIn}
            subtitle="Needs attention"
            icon={<UserX className="w-5 h-5" />}
            variant="warning"
            className="col-span-1"
          />
          
          <StatCard
            title="On Leave"
            value={leaveCountToday}
            subtitle="Approved absences"
            icon={<Calendar className="w-5 h-5" />}
            variant="primary"
            className="col-span-1"
          />
          
          <StatCard
            title="Unauthorized"
            value={absentWithoutLeave}
            subtitle="Requires follow-up"
            icon={<AlertTriangle className="w-5 h-5" />}
            variant="error"
            className="col-span-1"
          />
          
          <StatCard
            title="Pending Items"
            value={pendingApprovals}
            subtitle="Awaiting approval"
            icon={<FileText className="w-5 h-5" />}
            variant="primary"
            className="col-span-1"
          />
        </div>
      </motion.div>

      {/* Performance Metrics Section */}
      <motion.div key="performance-metrics" variants={itemVariants}>
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="col-span-1">
            <ProgressCard
              title="Attendance Rate"
              percentage={Math.round(avgAttendanceRate)}
              value={`${avgAttendanceRate}%`}
              subtitle="This month"
              color="#10b981"
              size="md"
            />
          </div>
          
          <div className="col-span-1">
            <ProgressCard
              title="Productivity Score"
              percentage={productivityScore}
              value={`${productivityScore}%`}
              subtitle="Team average"
              color="#3b82f6"
              size="md"
            />
          </div>
          
          <BadgeGroupCard
            title="Team Performance"
            badges={teamMetrics}
            layout="vertical"
            className="col-span-1"
          />
          
          <BadgeGroupCard
            title="Weekly Attendance"
            badges={weeklyData}
            layout="vertical"
            className="col-span-1"
          />
        </div>
      </motion.div>

      {/* Violation Summary & Department Overview */}
      <motion.div key="violation-department" variants={itemVariants}>
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Department Analysis
        </h3>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
          <BadgeGroupCard
            title="Violation Summary"
            badges={[
              { text: "Late Arrivals", count: 15, variant: "destructive" },
              { text: "Early Departures", count: 8, variant: "destructive" },
              { text: "Missed Punches", count: 5, variant: "destructive" },
              { text: "Overtime Hours", count: 127, variant: "secondary" },
            ]}
            layout="vertical"
            className="xl:col-span-1"
          />
          
          <BadgeGroupCard
            title="Department Performance (%)"
            badges={departmentData}
            layout="vertical"
            className="xl:col-span-2"
          />
        </div>
      </motion.div>

      {/* Charts Section - Enhanced */}
      <motion.div key="charts-analytics" variants={itemVariants}>
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-primary" />
          Analytics & Trends
        </h3>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          <div className="order-2 xl:order-1">
            <AttendanceChart className="h-full" />
          </div>
          
          <div className="order-1 xl:order-2">
            <ChartCard
              title="Violation Trend Analysis"
              type="line"
              data={violationTrendData}
              height={300}
              className="h-full"
            />
          </div>
        </div>
      </motion.div>

      <motion.div key="leave-weekly-section" variants={itemVariants}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          <div className="order-2 xl:order-1">
            <LeaveDistributionChart className="h-full" />
          </div>
          
          <div className="order-1 xl:order-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                title="Active Projects"
                value={24}
                subtitle="In progress"
                variant="primary"
                icon={<BarChart3 className="w-5 h-5" />}
              />
              <StatCard
                title="Avg. Hours/Day"
                value={7.8}
                subtitle="Team average"
                variant="success"
                icon={<Clock className="w-5 h-5" />}
              />
            </div>
            <BadgeGroupCard
              title="Key Performance Indicators"
              badges={[
                { text: "Customer Satisfaction", count: 94, variant: "default" },
                { text: "Quality Score", count: 89, variant: "secondary" },
                { text: "Efficiency Rating", count: 92, variant: "outline" },
                { text: "Innovation Index", count: 76, variant: "default" },
              ]}
              layout="vertical"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TeamDashboardSection;

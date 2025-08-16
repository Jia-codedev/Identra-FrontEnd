"use client";

import React from "react";
import StatCard from "../widgets/StatCard";
import InfoCard from "../widgets/InfoCard";
import ProgressCard from "../widgets/ProgressCard";
import BadgeGroupCard from "../widgets/BadgeGroupCard";
import PunchInOutWidget from "../widgets/PunchInOutWidget";
import { AnnouncementFeed, AnnouncementItem } from "../widgets/ScrollableCard";
import WorkHoursTrendChart from "../charts/WorkHoursTrendChart";
import LeaveDistributionChart from "../charts/LeaveDistributionChart";
import { motion } from "framer-motion";
import {
    Clock,
    Calendar,
    Coffee,
    MapPin,
    TrendingUp,
    Bell,
    CheckCircle2,
    AlertTriangle,
    Timer,
    BarChart3,
    Zap,
    Target
} from "lucide-react";

// Mock data for announcements
const mockAnnouncements: AnnouncementItem[] = [
    {
        id: "1",
        title: "System Maintenance Scheduled",
        content: "Planned maintenance on Sunday from 2 AM to 4 AM. All services will be temporarily unavailable.",
        timestamp: new Date().toISOString(),
        priority: "medium"
    },
    {
        id: "2",
        title: "New Holiday Added - National Day",
        content: "National Day has been added to the holiday calendar. Please update your leave plans accordingly.",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        priority: "low"
    },
    {
        id: "3",
        title: "Updated Leave Policy",
        content: "New leave policy guidelines are now in effect. Please review the updated terms in the employee handbook.",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        priority: "high"
    },
    {
        id: "4",
        title: "Team Building Event",
        content: "Join us for the quarterly team building event next Friday at 3 PM in the main conference room.",
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        priority: "low"
    },
    {
        id: "5",
        title: "Performance Review Cycle",
        content: "Q3 performance reviews are now open. Please complete your self-assessment by the end of this week.",
        timestamp: new Date(Date.now() - 345600000).toISOString(),
        priority: "medium"
    }
];

const EmployeeDashboardSection: React.FC = () => {
    const currentTime = new Date();
    const punchInTime = "09:00 AM";
    const workedHours = 6.5;
    const targetHours = 8;
    const breakTime = "45 mins";
    const overtimeHours = 2.5;
    const monthlyHours = 168;
    const monthlyTarget = 176;

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
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

    // Mock data for leave balance
    const leaveBalance = [
        { text: "Annual Leave", count: 12, variant: "default" as const },
        { text: "Sick Leave", count: 5, variant: "secondary" as const },
        { text: "Emergency Leave", count: 3, variant: "outline" as const },
        { text: "Personal Leave", count: 2, variant: "default" as const },
    ].filter(item => item.text && item.text.trim() !== '');

    // Mock violation data
    const violations = [
        { text: "Late Arrivals", count: 2, variant: "destructive" as const },
        { text: "Early Departures", count: 1, variant: "destructive" as const },
        { text: "Missed Punches", count: 0, variant: "default" as const },
        { text: "Overtime Days", count: 5, variant: "secondary" as const },
    ].filter(item => item.text && item.text.trim() !== '');

    // Performance metrics
    const performanceMetrics = [
        { text: "On Time %", count: 95, variant: "default" as const },
        { text: "Productivity", count: 88, variant: "secondary" as const },
        { text: "Goals Met", count: 12, variant: "outline" as const },
    ].filter(item => item.text && item.text.trim() !== '');

    return (
        <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header Section */}
            <motion.div key="header-section" variants={itemVariants}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-primary">
                                Employee Dashboard
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">Track your productivity and stay on top of your game! 🚀</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="hidden sm:inline">All systems operational</span>
                    </div>
                </div>
            </motion.div>

            {/* Quick Action & Punch Section */}
            <motion.div key="punch-section" variants={itemVariants}>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Quick Actions
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <div className="lg:col-span-1">
                        <PunchInOutWidget
                            currentStatus="checked_in"
                            lastPunchTime={punchInTime}
                            workingHours={`${workedHours}h`}
                            location="Office Floor 3"
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-2 gap-3 h-full">
                            <StatCard
                                title="Today&apos;s Progress"
                                value={Math.round((workedHours / targetHours) * 100)}
                                suffix="%"
                                subtitle="Target completion"
                                variant="success"
                                icon={<TrendingUp className="w-5 h-5" />}
                                className="h-full"
                            />
                            <StatCard
                                title="Productivity Score"
                                value="95"
                                suffix="%"
                                subtitle="Above average! 🎯"
                                variant="primary"
                                icon={<BarChart3 className="w-5 h-5" />}
                                className="h-full"
                            />
                            <InfoCard
                                title="Next Break"
                                content={
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-semibold">2:30 PM</span>
                                            <Coffee className="w-4 h-4 text-amber-500" />
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            In 45 minutes
                                        </div>
                                    </div>
                                }
                                variant="info"
                                className="h-full"
                            />
                            <InfoCard
                                title="Today&apos;s Mood"
                                content={
                                    <div className="space-y-1">
                                        <div className="text-2xl">😊</div>
                                        <div className="text-xs text-muted-foreground">
                                            Feeling productive!
                                        </div>
                                    </div>
                                }
                                className="h-full"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Enhanced Attendance Overview Section */}
            <motion.div key="attendance-overview" variants={itemVariants}>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Today&apos;s Overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="col-span-1">
                        <ProgressCard
                            title="Shift Progress"
                            percentage={Math.round((workedHours / targetHours) * 100)}
                            value={workedHours}
                            total={targetHours}
                            subtitle="Hours completed"
                            color="#10b981"
                            size="md"
                            className="h-full"
                        />
                    </div>

                    <InfoCard
                        title="Break Summary"
                        content={
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold">{breakTime}</span>
                                    <Coffee className="w-4 h-4 text-amber-500" />
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    2 breaks taken • 1 remaining
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                            </div>
                        }
                        variant="warning"
                        className="col-span-1 h-full"
                    />

                    <StatCard
                        title="Overtime Hours"
                        value={overtimeHours}
                        suffix=" hrs"
                        subtitle="This month so far"
                        variant="primary"
                        icon={<Timer className="w-5 h-5" />}
                        className="col-span-1 h-full"
                    />

                    <InfoCard
                        title="Location Status"
                        content={
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium">At Office</span>
                                </div>
                                <div className="text-xs text-muted-foreground">Floor 3, Desk 42</div>
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                    <MapPin className="w-3 h-3" />
                                    Connected to Office WiFi
                                </div>
                            </div>
                        }
                        icon={<MapPin className="w-4 h-4" />}
                        className="col-span-1 h-full"
                    />
                </div>
            </motion.div>

            {/* Monthly Performance Section */}
            <motion.div key="monthly-performance" variants={itemVariants}>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Monthly Performance
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="col-span-1 h-full">
                        <ProgressCard
                            title="Monthly Hours"
                            percentage={Math.round((monthlyHours / monthlyTarget) * 100)}
                            value={monthlyHours}
                            total={monthlyTarget}
                            subtitle="This month"
                            color="#3b82f6"
                            size="md"
                            className="h-full"
                        />
                    </div>

                    <StatCard
                        title="Overtime Hours"
                        value={overtimeHours}
                        suffix=" hrs"
                        subtitle="Extra effort this month"
                        variant="primary"
                        icon={<BarChart3 className="w-5 h-5" />}
                        className="col-span-1 h-full"
                    />

                    <BadgeGroupCard
                        title="Performance Metrics"
                        badges={performanceMetrics}
                        layout="vertical"
                        className="col-span-1 h-full"
                    />
                </div>
            </motion.div>

            {/* Leave & Violations Section - Enhanced */}
            <motion.div key="leave-violations" variants={itemVariants}>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Leave Management & Attendance
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <BadgeGroupCard
                        title="Available Leave Balance"
                        badges={leaveBalance}
                        layout="vertical"
                        className="h-full"
                    />

                    <BadgeGroupCard
                        title="Attendance Summary"
                        badges={violations}
                        layout="vertical"
                        className="h-full"
                    />
                </div>
            </motion.div>

            {/* Analytics & Communication Section */}
            <motion.div key="analytics-communication" variants={itemVariants}>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Analytics & Updates
                </h3>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 items-start">
                    <div className="order-2 xl:order-1 h-full">
                        <AnnouncementFeed
                            announcements={mockAnnouncements}
                            maxHeight={350}
                            className="h-full"
                        />
                    </div>

                    <div className="order-1 xl:order-2 h-full">
                        <WorkHoursTrendChart className="h-full" />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EmployeeDashboardSection;

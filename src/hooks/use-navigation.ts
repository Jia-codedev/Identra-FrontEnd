"use client";

import { useTranslations } from "./use-translations";
import {
  FiHome,
  FiDatabase,
  FiUsers,
  FiCalendar,
  FiBriefcase,
  FiClock,
} from "react-icons/fi";

export const useNavigation = () => {
  const { t } = useTranslations();

  const NAV_LINKS = [
    {
      id: "dashboard",
      label: t("common.dashboard"),
      icon: FiHome,
      secondary: [
        { label: t("navigation.selfStatistics"), href: "/workforce-analytics/my-insights" },
        { label: t("navigation.teamStatistics"), href: "/workforce-analytics/team-insights" },
        { label: t("navigation.activityMonitor"), href: "/workforce-analytics/activity-log" },
        { label: t("navigation.teamEfficiency"), href: "/workforce-analytics/productivity-metrics" },
        { label: t("navigation.geoTracking"), href: "/workforce-analytics/location-intelligence" },
      ],
    },
    {
      id: "masterData",
      label: t("common.masterData"),
      icon: FiDatabase,
      secondary: [
        { label: t("navigation.regions"), href: "/master-data/site-managements" },
        { label: t("navigation.grades"), href: "/master-data/job-levels" },
        {
          label: t("navigation.designations"),
          href: "/master-data/job-titles",
        },
        {
          label: t("navigation.nationalities"),
          href: "/master-data/citizenship-info",
        },
        {
          label: t("navigation.organizations"),
          href: "/master-data/business-entity",
        },
        {
          label: t("navigation.organizationTypes"),
          href: "/master-data/business-entity-type",
        },
        {
          label: t("navigation.organizationStructure"),
          href: "/master-data/hierarchy-management",
        },
      ],
    },
    {
      id: "employeeMaster",
      label: t("common.employeeMaster"),
      icon: FiUsers,
      secondary: [
        { label: t("navigation.workFlow"), href: "/employee-management/process-automation" },
        { label: t("navigation.employees"), href: "/employee-management/workforce-directory" },
        {
          label: t("navigation.employeeTypes"),
          href: "/employee-management/contract-types",
        },
        {
          label: t("navigation.employeeGroups"),
          href: "/employee-management/team-grouping",
        },
      ],
    },
    {
      id: "scheduling",
      label: t("common.scheduling"),
      icon: FiCalendar,
      secondary: [
        { label: t("navigation.reasons"), href: "/roster-management/reasons" },
        { label: t("navigation.holidays"), href: "/roster-management/holiday-calendar" },
        {
          label: t("navigation.ramadanDates"),
          href: "/roster-management/ramadan-hours-setup",
        },
        {
          label: t("navigation.scheduleTypes"),
          href: "/roster-management/schedule-templates",
        },
        {
          label: t("navigation.monthlyRoaster"),
          href: "/roster-management/monthly-roster",
        },
        {
          label: t("navigation.weeklySchedule"),
          href: "/roster-management/weekly-roster",
        },
      ],
    },
    {
      id: "workforce",
      label: t("common.workforce"),
      icon: FiBriefcase,
      secondary: [
        { label: t("navigation.approvals"), href: "/workforce/request-authorizations" },
        { label: t("navigation.reports"), href: "/workforce/analytics-reports" },
      ],
    },
    {
      id: "leaveTracker",
      label: t("navigation.leaveTracker"),
      icon: FiClock,
      secondary: [
        { label: t("navigation.leaves"), href: "/leave-management/leaves" },
        {
          label: t("navigation.permissions"),
          href: "/leave-management/permission-management",
        },
        { label: t("navigation.punches"), href: "/leave-management/attendance-logs" },
      ],
    },
  ];

  const PROFILE_LINKS = [
    { label: t("common.profile"), href: "/my-account" },
    { label: t("common.security"), href: "/user-security-settings" },
    { label: t("common.language"), href: "/language" },
    { label: t("common.appearance"), href: "/theme-layout" },
    { label: t("common.support"), href: "/help-support" },
    { label: t("common.logout"), href: "/sign-out", className: "text-red-600" },
  ];

  const SETTINGS_LINKS = [
    { label: t("settings.applicationSettings"), href: "/settings/app-settings" },
    {
      label: t("settings.notificationSettings"),
      href: "/settings/alert-preferences",
    },
    { label: t("navigation.organizations"), href: "/settings/business-entity" },
    { label: t("settings.viewEmployeeLogs"), href: "/logs/employee-audit-trail" },
    { label: t("settings.viewLogs"), href: "/logs/system-logs" },
    { label: t("settings.announcement"), href: "/bulletins" },
    { label: t("settings.license"), href: "/license-management" },
  ];

  return {
    NAV_LINKS,
    PROFILE_LINKS,
    SETTINGS_LINKS,
  };
};

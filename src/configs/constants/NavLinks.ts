import {
  FiHome,
  FiDatabase,
  FiUsers,
  FiCalendar,
  FiBriefcase,
  FiClock,
} from "react-icons/fi";

export const NAV_LINKS = [
  {
    label: "Workforce Analytics",
    icon: FiHome,
    secondary: [
      { label: "My Insights", href: "/workforce-analytics/my-insights" },
      { label: "Team Insights", href: "/workforce-analytics/team-insights" },
      { label: "Workforce Activity Log", href: "/workforce-analytics/activity-log" },
      { label: "Productivity Metrics", href: "/workforce-analytics/productivity-metrics" },
      { label: "Location Intelligence", href: "/workforce-analytics/location-intelligence" },
    ],
  },
  {
    label: "Master Data",
    icon: FiDatabase,
    secondary: [
      { label: "Site Managements", href: "/master-data/site-managements" },
      { label: "Job Levels", href: "/master-data/job-levels" },
      { label: "Job Titles", href: "/master-data/job-titles" },
      { label: "Citizenship Info", href: "/master-data/citizenship-info" },
      { label: "Business Entity", href: "/master-data/business-entity" },
      { label: "Business Entity Type", href: "/master-data/business-entity-type" },
      {
        label: "Hierarchy Management",
        href: "/master-data/hierarchy-management",
      },
    ],
  },
  {
    label: "Employee Management",
    icon: FiUsers,
    secondary: [
      { label: "Process Automation", href: "/employee-management/process-automation" },
      { label: "Workforce Directory", href: "/employee-management/workforce-directory" },
      { label: "Contract Types", href: "/employee-management/contract-types" },
      { label: "Team grouping", href: "/employee-management/team-grouping" },
    ],
  },
  {
    label: "Roster Management",
    icon: FiCalendar,
    secondary: [
      { label: "Reasons", href: "/roster-management/reasons" },
      { label: "Holiday Calendar", href: "/roster-management/holiday-calendar" },
      { label: "Ramadan Hours Setup", href: "/roster-management/ramadan-hours-setup" },
      { label: "Schedule Templates", href: "/roster-management/schedule-templates" },
      { label: "Monthly Roster", href: "/roster-management/monthly-roster" },
      { label: "Weekly Roster", href: "/roster-management/weekly-roster" },
    ],
  },
  {
    label: "WorkForce",
    icon: FiBriefcase,
    secondary: [
      { label: "Request Authorizations", href: "/workforce/request-authorizations" },
      { label: "Analytics & Reports", href: "/workforce/analytics-reports" },
    ],
  },
  {
    label: "Leave Management",
    icon: FiClock,
    secondary: [
      { label: "Leave Management", href: "/leave-management/leaves" },
      { label: "Permission Management", href: "/leave-management/permission-management" },
      { label: "Attendance Logs", href: "/leave-management/attendance-logs" },
    ],
  },
];

export const PROFILE_LINKS = [
  { label: "My Account", href: "/my-account" },
  { label: "User Security Settings", href: "/user-security-settings" },
  { label: "Language", href: "/language" },
  { label: "Theme & Layout", href: "/theme-layout" },
  { label: "Help & Support", href: "/help-support" },
  { label: "Sign Out", href: "/sign-out", className: "text-red-600" },
];

export const SETTINGS_LINKS = [
  { label: "App Settings", href: "/settings/app-settings" },
  { label: "Alert Preferences", href: "/settings/alert-preferences" },
  { label: "Business Entity", href: "/settings/business-entity" },
  { label: "Employee Audit Trail", href: "/logs/employee-audit-trail" },
  { label: "System Logs", href: "/logs/system-logs" },
  { label: "Bulletins", href: "/bulletins" },
  { label: "License Management", href: "/license-management" },
];

// Language options
export const LANGUAGES = [
  { code: "en", label: "English", image: "/lang/usa.svg" },
  { code: "ar", label: "Arabic", image: "/lang/uae.svg" },
];

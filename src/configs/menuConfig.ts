// Central mapping from translation keys -> route paths
// Used to migrate/normalize menu names and page links in one place

type KeyMap = Record<string, string>;

export const MENU_KEY_TO_PATH: KeyMap = {
  // Workforce Analytics
  "navigation.selfStatistics": "/workforce-analytics/my-insights",
  "navigation.teamStatistics": "/workforce-analytics/team-insights",
  "navigation.activityMonitor": "/workforce-analytics/activity-log",
  "navigation.teamEfficiency": "/workforce-analytics/productivity-metrics",
  "navigation.geoTracking": "/workforce-analytics/location-intelligence",

  // Master Data / Enterprise Settings
  "navigation.regions": "/master-data/site-managements",
  "navigation.grades": "/master-data/job-levels",
  "navigation.designations": "/master-data/job-titles",
  "navigation.nationalities": "/master-data/citizenship-info",
  "navigation.organizations": "/master-data/business-entity",
  "navigation.organizationTypes": "/master-data/business-entity-type",
  "navigation.organizationStructure": "/master-data/hierarchy-management",
  "navigation.departmentAdmins": "/master-data/dept-admins",

  // Employee Management
  "navigation.employees": "/employee-management/workforce-directory",
  "navigation.employeeTypes": "/employee-management/contract-types",
  "navigation.employeeGroups": "/employee-management/team-grouping",

  // Scheduling / Roster Management
  "navigation.holidays": "/roster-management/holiday-calendar",
  "navigation.ramadanDates": "/roster-management/ramadan-hours-setup",
  "navigation.scheduleTypes": "/roster-management/schedule-templates",
  "navigation.monthlyRoaster": "/roster-management/monthly-roster",
  "navigation.weeklySchedule": "/roster-management/weekly-roster",

  // Leave / Self-service
  "navigation.workFlow": "/leave-management/process-automation",
  "navigation.leaves": "/leave-management/leaves",
  "navigation.permissions": "/leave-management/permission-management",
  "navigation.punches": "/leave-management/attendance-logs",

  // Workforce
  "navigation.approvals": "/workforce/request-authorizations",
  "navigation.reports": "/workforce/analytics-reports",

  // Devices & Infrastructure
  "navigation.deviceManagement": "/device-and-infra/biometric-terminals",
};

export function getPathByKey(key: string): string {
  if (!key) return "/";
  return MENU_KEY_TO_PATH[key] ?? "/";
}
// NOTE: default export below is the full `menus` structure used for rendering
// Central menu configuration and name -> route conversion helpers
// Auto-generated from Chronexa grouping (source: design attachment)

export type MenuItem = {
  id: string; // unique id/key
  label: string; // display name
  path: string; // route path
};

export type MainMenu = {
  id: string;
  label: string;
  items: MenuItem[];
};

const menus: MainMenu[] = [
  {
    id: 'workforce-analytics',
    label: 'Workforce Analytics',
    items: [
      { id: 'my-insights', label: 'My Insights', path: '/analytics/my-insights' },
      { id: 'team-insights', label: 'Team Insights', path: '/analytics/team-insights' },
      { id: 'activity-log', label: 'Activity Log', path: '/analytics/activity-log' },
      { id: 'productivity-metrics', label: 'Productivity Metrics', path: '/analytics/productivity-metrics' },
      { id: 'geo-analytics', label: 'Geo-Analytics', path: '/analytics/geo-analytics' },
    ],
  },

  {
    id: 'enterprise-settings',
    label: 'Enterprise Settings',
    items: [
      { id: 'site-management', label: 'Site Managements', path: '/settings/site-management' },
      { id: 'job-levels', label: 'Job Levels', path: '/settings/job-levels' },
      { id: 'job-titles', label: 'Job Titles', path: '/settings/job-titles' },
      { id: 'citizenship-info', label: 'Citizenship Info', path: '/settings/citizenship-info' },
    ],
  },

  {
    id: 'organization',
    label: 'Organization',
    items: [
      { id: 'organization-type', label: 'Organization Type', path: '/organization/type' },
      { id: 'org-chart', label: 'Org Chart', path: '/organization/org-chart' },
      { id: 'divisions', label: 'Divisions', path: '/organization/divisions' },
    ],
  },

  {
    id: 'employee-management',
    label: 'Employee Management',
    items: [
      { id: 'employee-directory', label: 'Employee Directory', path: '/employees/directory' },
      { id: 'contract-types', label: 'Contract Types', path: '/employees/contract-types' },
      { id: 'team-grouping', label: 'Team grouping', path: '/employees/team-grouping' },
    ],
  },

  {
    id: 'roster-management',
    label: 'Roster Management',
    items: [
      { id: 'reasons', label: 'Reasons', path: '/roster/reasons' },
      { id: 'holiday-calendar', label: 'Holiday Calendar', path: '/roster/holiday-calendar' },
      { id: 'ramadan-hours', label: 'Ramadan Hours', path: '/roster/ramadan-hours' },
      { id: 'shift-patterns', label: 'Shift Patterns', path: '/roster/shift-patterns' },
      { id: 'monthly-roster', label: 'Monthly Roster', path: '/roster/monthly' },
      { id: 'weekly-roster', label: 'Weekly Roster', path: '/roster/weekly' },
    ],
  },

  {
    id: 'self-services',
    label: 'Self Services',
    items: [
      { id: 'leave-management', label: 'Leave Management', path: '/self-service/leave-management' },
      { id: 'permission-management', label: 'Permission Management', path: '/self-service/permission-management' },
      { id: 'attendance-logs', label: 'Attendance Logs', path: '/self-service/attendance-logs' },
      { id: 'workflow-automation', label: 'Workflow Automation', path: '/self-service/workflow-automation' },
      // { id: 'payroll-locking', label: 'Payroll Locking', path: '/self-service/payroll-locking' },
    ],
  },

  {
    id: 'devices-infrastructure',
    label: 'Devices & Infrastructure',
    items: [
      { id: 'biometric-terminals', label: 'Biometric Terminals', path: '/device-and-infra/biometric-terminals' },
      { id: 'access-zones', label: 'Access Zones', path: '/device-and-infra/access-zones' },
      { id: 'buildings', label: 'Buildings', path: '/device-and-infra/buildings' },
    ],
  },

  {
    id: 'user-security-settings',
    label: 'User Security Settings',
    items: [
      { id: 'roles-management', label: 'Roles Management', path: '/security/roles' },
      { id: 'access-permissions', label: 'Access Permissions', path: '/security/access-permissions' },
      { id: 'session-monitor', label: 'Session Monitor', path: '/security/session-monitor' },
      { id: 'activity-summary', label: 'Activity Summary', path: '/security/activity-summary' },
    ],
  },

  {
    id: 'application-settings',
    label: 'Application Settings',
    items: [
      { id: 'app-settings', label: 'App Settings', path: '/app-settings' },
      { id: 'app-configuration', label: 'App Configuration', path: '/app-settings/configuration' },
      { id: 'alert-preferences', label: 'Alert Preferences', path: '/app-settings/alert-preferences' },
      { id: 'audit-trail', label: 'Audit Trail', path: '/app-settings/audit-trail' },
    ],
  },

  {
    id: 'alert-centre',
    label: 'Alert Centre',
    items: [
      { id: 'email-alerts', label: 'Email Alerts', path: '/alerts/email' },
      { id: 'sms-alerts', label: 'SMS Alerts', path: '/alerts/sms' },
      { id: 'bulletins', label: 'Bulletins', path: '/alerts/bulletins' },
    ],
  },

  {
    id: 'profile-icon',
    label: 'Profile Icon',
    items: [
      { id: 'my-account', label: 'My Account', path: '/profile/my-account' },
      { id: 'theme-layout', label: 'Theme & Layout', path: '/profile/theme-layout' },
      { id: 'update-password', label: 'Update Password', path: '/profile/update-password' },
      { id: 'sign-out', label: 'Sign Out', path: '/auth/sign-out' },
    ],
  },

  {
    id: 'support-centre',
    label: 'Support Centre',
    items: [
      { id: 'faqs', label: 'FAQs', path: '/support/faqs' },
      { id: 'user-manual', label: 'User Manual', path: '/support/user-manual' },
      { id: 'license-management', label: 'License Management', path: '/support/license-management' },
    ],
  },
];

// Build lookup maps for convenient conversion
const flatNameToPath = new Map<string, string>();
const idToPath = new Map<string, string>();

for (const m of menus) {
  idToPath.set(m.id, m.items.length ? m.items[0].path : '/');
  for (const it of m.items) {
    flatNameToPath.set(it.label.toLowerCase(), it.path);
    idToPath.set(it.id, it.path);
  }
}

export function getPathByLabel(label: string): string | undefined {
  if (!label) return undefined;
  return flatNameToPath.get(label.toLowerCase());
}

export function getPathById(id: string): string | undefined {
  if (!id) return undefined;
  return idToPath.get(id);
}

export default menus;

// Example usage (in comments):
// import menus, { getPathByLabel } from '@/configs/menuConfig';
// const path = getPathByLabel('My Insights'); // -> '/analytics/my-insights'


function camelToKebab(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}


const GROUP_PREFIXES: Record<string, string> = {
  selfStatistics: '/',
  teamStatistics: '/',
  activityMonitor: '/',
  teamEfficiency: '/',
  geoTracking: '/',
  myInsights: '/',
  teamInsights: '/',
  siteManagements: '/master-data',
  jobLevels: '/master-data',
  jobTitles: '/master-data',
  citizenshipInfo: '/master-data',
  departmentAdmins: '/organization',
  organizationTypes: '/organization',
  organization: '/organization',
  orgChart: '/organization',
  employees: '/employee-management',
  employeeTypes: '/employee-management',
  employeeGroups: '/employee-management',
  employeeDirectory: '/employee-management',
  contractTypes: '/employee-management',
  teamGrouping: '/employee-management',
  reasons: '/roster-management',
  holidays: '/roster-management',
  ramadanDates: '/roster-management',
  scheduleTypes: '/roster-management',
  monthlyRoaster: '/roster-management',
  weeklySchedule: '/roster-management',
  holidayCalendar: '/roster-management',
  monthlyRoster: '/roster-management',
  weeklyRoster: '/roster-management',
  ramadanHours: '/roster-management',
  workFlow: '/leave-management',
  leaves: '/leave-management',
  leaveTypes: '/leave-management',
  permissionTypes: '/leave-management',
  permissions: '/leave-management',
  punches: '/leave-management',
  leaveManagement: '/leave-management',
  permissionManagement: '/leave-management',
  attendanceLogs: '/leave-management',
  workflowAutomation: '/leave-management',
  approvals: '/workforce',
  reports: '/workforce',
  biometricTerminals: '/device-and-infra',
  buildingManagement: '/device-and-infra',
  rolesManagement: '/security',
  accessPermissions: '/security',
  sessionMonitor: '/security',
  activitySummary: '/security',
  appSettings: '/app-settings',
  appConfiguration: '/app-settings',
  alertPreferences: '/app-settings',
  auditTrail: '/app-settings',
  emailAlerts: '/alerts',
  smsAlerts: '/alerts',
  bulletins: '/alerts',
  myAccount: '/profile',
  themeLayout: '/profile',
  updatePassword: '/profile',
  signOut: '/profile',
  faqs: '/support',
  userManual: '/support',
  licenseManagement: '/support',
};


const OVERRIDES: Record<string, string> = {
  monthlyRoaster: 'monthly-roster',
  monthlyRoster: 'monthly-roster',
  ramadanDates: 'ramadan-hours-setup',
  ramadanHours: 'ramadan-hours-setup',
  activityMonitor: 'activity-log',
  teamEfficiency: 'productivity-metrics',
  geoTracking: 'location-intelligence',
  myInsights: 'dashboard',
  teamInsights: 'dashboard/teamInsights',
  organizationTypes: 'business-entity-type',
  organizationStructure: 'hierarchy-management',
  organizationType: 'organization-type',
  orgChart: 'org-chart',
  divisions: 'divisions',
  employees: 'workforce-directory',
  employeeDirectory: 'workforce-directory',
  employeeTypes: 'contract-types',
  contractTypes: 'contract-types',
  employeeGroups: 'team-grouping',
  teamGrouping: 'team-grouping',
  attendanceLogs: 'attendance-logs',
  workflowAutomation: 'workflow-automation',
  workFlow: 'workflow-automation',
  leaveManagement: 'leave-management',
  leaveTypes: 'leave-type',
  permissionTypes: 'permission-type',
  permissionManagement: 'permission-management',
  deviceManagement: 'device-and-infra',
  biometricTerminals: 'biometric-terminals',
  accessZones: 'access-zones',
  appConfiguration: 'configuration',
  appSettings: '',
  deptAdmins: 'dept-admins',
};


export function getRouteFromKey(key: string): string {
  if (!key) return '/';
  const parts = key.split('.');
  let name = parts[parts.length - 1];
  if (parts[0] === 'navigation' && parts.length >= 2) {
    name = parts[1];
  }
  let prefix = '/';
  if (parts[0] === 'mainMenu' && parts.length >= 2) {
    const groupName = parts[1];
    const groupPrefixMap: Record<string, string> = {
      workforceAnalytics: '/',
      enterpriseSettings: '/master-data',
      organization: '/organization',
      employeeManagement: '/employee-management',
      rosterManagement: '/roster-management',
      selfServices: '/leave-management',
      devicesAndInfrastructure: '/device-and-infra',
      devicesInfrastructure: '/device-and-infra',
      userSecuritySettings: '/security',
      applicationSettings: '/app-settings',
      alertCentre: '/alerts',
      profileIcon: '/profile',
      supportCentre: '/support',
    };
    prefix = groupPrefixMap[groupName] ?? '/';
  }

  if (GROUP_PREFIXES[name]) {
    prefix = GROUP_PREFIXES[name];
  }

  const slug = OVERRIDES[name] ?? camelToKebab(name);
  const path = slug ? `${prefix}/${slug}`.replace('//', '/') : `${prefix}`;
  return path;
}

export default getRouteFromKey;

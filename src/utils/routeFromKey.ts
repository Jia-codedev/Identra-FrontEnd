
function camelToKebab(s: string) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

const GROUP_PREFIXES: { prefix: string; keys: string[] }[] = [
  { prefix: '/workforce-analytics', keys: ['selfStatistics', 'teamStatistics', 'activityMonitor', 'teamEfficiency', 'geoTracking', 'myInsights', 'teamInsights'] },
  { prefix: '/master-data', keys: ['regions', 'grades', 'designations', 'nationalities', 'organizations', 'organizationTypes', 'organizationStructure', 'departmentAdmins', 'siteManagements', 'jobLevels', 'jobTitles', 'citizenshipInfo'] },
  { prefix: '/employee-management', keys: ['employees', 'employeeTypes', 'employeeGroups', 'employeeDirectory', 'contractTypes', 'teamGrouping'] },
  { prefix: '/roster-management', keys: ['reasons', 'holidays', 'ramadanDates', 'scheduleTypes', 'monthlyRoaster', 'weeklySchedule', 'holidayCalendar', 'monthlyRoster', 'weeklyRoster', 'ramadanHours'] },
  { prefix: '/leave-management', keys: ['workFlow', 'leaves', 'permissions', 'punches', 'leaveManagement', 'permissionManagement', 'attendanceLogs', 'workflowAutomation'] },
  { prefix: '/workforce', keys: ['approvals', 'reports'] },
  { prefix: '/device-and-infra', keys: ['biometricTerminals', 'buildingManagement'] },
  { prefix: '/security', keys: ['rolesManagement', 'accessPermissions', 'sessionMonitor', 'activitySummary'] },
  { prefix: '/app-settings', keys: ['appSettings', 'appConfiguration', 'alertPreferences', 'auditTrail'] },
  { prefix: '/alerts', keys: ['emailAlerts', 'smsAlerts', 'bulletins'] },
  { prefix: '/profile', keys: ['myAccount', 'themeLayout', 'updatePassword', 'signOut'] },
  { prefix: '/support', keys: ['faqs', 'userManual', 'licenseManagement'] },
];

const OVERRIDES: Record<string, string> = {
  monthlyRoaster: 'monthly-roster', // typo in key -> desired route
  monthlyRoster: 'monthly-roster',
  ramadanDates: 'ramadan-hours-setup',
  ramadanHours: 'ramadan-hours-setup',
  activityMonitor: 'activity-log',
  teamEfficiency: 'productivity-metrics',
  geoTracking: 'location-intelligence',
  organizations: 'business-entity',
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
  permissionManagement: 'permission-management',
  deviceManagement: 'device-and-infra',
  biometricTerminals: 'biometric-terminals',
  accessZones: 'access-zones',
  appConfiguration: 'configuration',
  appSettings: '',
};


export function getRouteFromKey(key: string): string {
  if (!key) return '/';
  const parts = key.split('.');

  let name = parts[parts.length - 1];
  let prefix = '/';

  if (parts[0] === 'navigation' && parts.length >= 2) {
    name = parts[1];
  }

  if (parts[0] === 'mainMenu' && parts.length >= 2) {
    const groupName = parts[1];
    const mapping: Record<string, string> = {
      workforceAnalytics: '/workforce-analytics',
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

    prefix = mapping[groupName] ?? '/';
  }

  // prefer group prefixes defined by keys
  for (const g of GROUP_PREFIXES) {
    if (g.keys.includes(name)) {
      prefix = g.prefix;
      break;
    }
  }

  const slug = OVERRIDES[name] ?? camelToKebab(name);
  // ensure no double slash; if slug is empty return prefix
  const path = slug ? `${prefix}/${slug}`.replace('//', '/') : `${prefix}`;
  return path;
}

export default getRouteFromKey;

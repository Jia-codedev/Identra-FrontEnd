-- =====================================================================================
-- APPLICATION PRIVILEGES DATA INSERTION SCRIPT
-- This script inserts role-based privileges for the Chronologix application
-- =====================================================================================

-- First, let's ensure we have all the privileges in the system
-- These should match your frontend navigation structure and actions

-- Insert missing privileges if they don't exist
INSERT INTO sec_privileges (privilege_name, privilege_translation_key, privilege_description, privilege_group_id, created_id, created_date, last_updated_id, last_updated_date)
SELECT * FROM (VALUES
    -- Dashboard & Analytics
    ('VIEW_DASHBOARD', 'privileges.viewDashboard', 'View main dashboard', 1, 1, GETDATE(), 1, GETDATE()),
    ('VIEW_MY_INSIGHTS', 'privileges.viewMyInsights', 'View personal insights', 1, 1, GETDATE(), 1, GETDATE()),
    ('VIEW_TEAM_INSIGHTS', 'privileges.viewTeamInsights', 'View team insights', 1, 1, GETDATE(), 1, GETDATE()),
    ('VIEW_ACTIVITY_LOG', 'privileges.viewActivityLog', 'View activity logs', 1, 1, GETDATE(), 1, GETDATE()),
    ('VIEW_PRODUCTIVITY_METRICS', 'privileges.viewProductivityMetrics', 'View productivity metrics', 1, 1, GETDATE(), 1, GETDATE()),
    ('VIEW_GEO_ANALYTICS', 'privileges.viewGeoAnalytics', 'View geo tracking analytics', 1, 1, GETDATE(), 1, GETDATE()),
    
    -- Enterprise Settings
    ('MANAGE_SITE_SETTINGS', 'privileges.manageSiteSettings', 'Manage site configurations', 2, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_JOB_LEVELS', 'privileges.manageJobLevels', 'Manage job levels', 2, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_JOB_TITLES', 'privileges.manageJobTitles', 'Manage job titles', 2, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_CITIZENSHIP', 'privileges.manageCitizenship', 'Manage citizenship information', 2, 1, GETDATE(), 1, GETDATE()),
    
    -- Organization Management
    ('VIEW_ORGANIZATION_TYPES', 'privileges.viewOrganizationTypes', 'View organization types', 3, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_ORGANIZATION_TYPES', 'privileges.manageOrganizationTypes', 'Manage organization types', 3, 1, GETDATE(), 1, GETDATE()),
    ('VIEW_ORG_CHART', 'privileges.viewOrgChart', 'View organizational chart', 3, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_ORGANIZATIONS', 'privileges.manageOrganizations', 'Manage organizations', 3, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_DEPT_ADMINS', 'privileges.manageDeptAdmins', 'Manage department administrators', 3, 1, GETDATE(), 1, GETDATE()),
    
    -- Employee Management
    ('VIEW_EMPLOYEE_DIRECTORY', 'privileges.viewEmployeeDirectory', 'View employee directory', 4, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_EMPLOYEES', 'privileges.manageEmployees', 'Manage employee records', 4, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_CONTRACT_TYPES', 'privileges.manageContractTypes', 'Manage contract types', 4, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_TEAM_GROUPING', 'privileges.manageTeamGrouping', 'Manage team groupings', 4, 1, GETDATE(), 1, GETDATE()),
    
    -- Roster Management
    ('VIEW_SCHEDULES', 'privileges.viewSchedules', 'View work schedules', 5, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_SCHEDULES', 'privileges.manageSchedules', 'Manage work schedules', 5, 1, GETDATE(), 1, GETDATE()),
    ('VIEW_HOLIDAY_CALENDAR', 'privileges.viewHolidayCalendar', 'View holiday calendar', 5, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_HOLIDAYS', 'privileges.manageHolidays', 'Manage holidays', 5, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_RAMADAN_HOURS', 'privileges.manageRamadanHours', 'Manage Ramadan working hours', 5, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_SHIFT_PATTERNS', 'privileges.manageShiftPatterns', 'Manage shift patterns', 5, 1, GETDATE(), 1, GETDATE()),
    ('VIEW_MONTHLY_ROSTER', 'privileges.viewMonthlyRoster', 'View monthly roster', 5, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_MONTHLY_ROSTER', 'privileges.manageMonthlyRoster', 'Manage monthly roster', 5, 1, GETDATE(), 1, GETDATE()),
    ('VIEW_WEEKLY_ROSTER', 'privileges.viewWeeklyRoster', 'View weekly roster', 5, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_WEEKLY_ROSTER', 'privileges.manageWeeklyRoster', 'Manage weekly roster', 5, 1, GETDATE(), 1, GETDATE()),
    
    -- Self Services
    ('VIEW_MY_LEAVES', 'privileges.viewMyLeaves', 'View own leave requests', 6, 1, GETDATE(), 1, GETDATE()),
    ('APPLY_LEAVE', 'privileges.applyLeave', 'Apply for leave', 6, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_LEAVE_TYPES', 'privileges.manageLeaveTypes', 'Manage leave types', 6, 1, GETDATE(), 1, GETDATE()),
    ('VIEW_PERMISSION_TYPES', 'privileges.viewPermissionTypes', 'View permission types', 6, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_PERMISSION_TYPES', 'privileges.managePermissionTypes', 'Manage permission types', 6, 1, GETDATE(), 1, GETDATE()),
    ('APPLY_PERMISSION', 'privileges.applyPermission', 'Apply for short permissions', 6, 1, GETDATE(), 1, GETDATE()),
    ('VIEW_ATTENDANCE_LOGS', 'privileges.viewAttendanceLogs', 'View attendance logs', 6, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_WORKFLOW', 'privileges.manageWorkflow', 'Manage workflow automation', 6, 1, GETDATE(), 1, GETDATE()),
    
    -- Devices & Infrastructure
    ('MANAGE_DEVICES', 'privileges.manageDevices', 'Manage biometric terminals', 7, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_ACCESS_ZONES', 'privileges.manageAccessZones', 'Manage access zones', 7, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_BUILDINGS', 'privileges.manageBuildings', 'Manage buildings', 7, 1, GETDATE(), 1, GETDATE()),
    
    -- Security Settings
    ('MANAGE_ROLES', 'privileges.manageRoles', 'Manage user roles', 8, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_PERMISSIONS', 'privileges.managePermissions', 'Manage access permissions', 8, 1, GETDATE(), 1, GETDATE()),
    ('VIEW_SESSION_MONITOR', 'privileges.viewSessionMonitor', 'View session monitoring', 8, 1, GETDATE(), 1, GETDATE()),
    ('VIEW_ACTIVITY_SUMMARY', 'privileges.viewActivitySummary', 'View activity summary', 8, 1, GETDATE(), 1, GETDATE()),
    
    -- Application Settings
    ('MANAGE_APP_SETTINGS', 'privileges.manageAppSettings', 'Manage application settings', 9, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_APP_CONFIG', 'privileges.manageAppConfig', 'Manage application configuration', 9, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_ALERT_PREFERENCES', 'privileges.manageAlertPreferences', 'Manage alert preferences', 9, 1, GETDATE(), 1, GETDATE()),
    ('VIEW_AUDIT_TRAIL', 'privileges.viewAuditTrail', 'View audit trail', 9, 1, GETDATE(), 1, GETDATE()),
    
    -- Alert Centre
    ('MANAGE_EMAIL_ALERTS', 'privileges.manageEmailAlerts', 'Manage email alerts', 10, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_SMS_ALERTS', 'privileges.manageSmsAlerts', 'Manage SMS alerts', 10, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_BULLETINS', 'privileges.manageBulletins', 'Manage bulletins', 10, 1, GETDATE(), 1, GETDATE()),
    
    -- Workforce Management
    ('VIEW_APPROVALS', 'privileges.viewApprovals', 'View pending approvals', 11, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_APPROVALS', 'privileges.manageApprovals', 'Manage approvals', 11, 1, GETDATE(), 1, GETDATE()),
    ('VIEW_REPORTS', 'privileges.viewReports', 'View reports', 11, 1, GETDATE(), 1, GETDATE()),
    ('GENERATE_REPORTS', 'privileges.generateReports', 'Generate reports', 11, 1, GETDATE(), 1, GETDATE()),
    
    -- Support Centre
    ('VIEW_FAQS', 'privileges.viewFaqs', 'View FAQs', 12, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_FAQS', 'privileges.manageFaqs', 'Manage FAQs', 12, 1, GETDATE(), 1, GETDATE()),
    ('VIEW_USER_MANUAL', 'privileges.viewUserManual', 'View user manual', 12, 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_LICENSES', 'privileges.manageLicenses', 'Manage license information', 12, 1, GETDATE(), 1, GETDATE())
) AS temp(privilege_name, privilege_translation_key, privilege_description, privilege_group_id, created_id, created_date, last_updated_id, last_updated_date)
WHERE NOT EXISTS (
    SELECT 1 FROM sec_privileges p 
    WHERE p.privilege_name = temp.privilege_name
);

PRINT 'Privileges inserted successfully';
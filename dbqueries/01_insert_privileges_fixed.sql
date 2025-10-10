-- =====================================================================================
-- APPLICATION PRIVILEGES DATA INSERTION SCRIPT
-- This script inserts role-based privileges for the Chronologix application
-- =====================================================================================

-- First, let's ensure we have all the privileges in the system
-- These should match your frontend navigation structure and actions

-- Insert missing privileges if they don't exist
INSERT INTO sec_privileges (privilege_name, created_id, created_date, last_updated_id, last_updated_date)
SELECT * FROM (VALUES
    -- Dashboard & Analytics
    ('VIEW_DASHBOARD', 1, GETDATE(), 1, GETDATE()),
    ('VIEW_MY_INSIGHTS', 1, GETDATE(), 1, GETDATE()),
    ('VIEW_TEAM_INSIGHTS', 1, GETDATE(), 1, GETDATE()),
    ('VIEW_ACTIVITY_LOG', 1, GETDATE(), 1, GETDATE()),
    ('VIEW_PRODUCTIVITY_METRICS', 1, GETDATE(), 1, GETDATE()),
    ('VIEW_GEO_ANALYTICS', 1, GETDATE(), 1, GETDATE()),
    
    -- Enterprise Settings
    ('MANAGE_SITE_SETTINGS', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_JOB_LEVELS', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_JOB_TITLES', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_CITIZENSHIP', 1, GETDATE(), 1, GETDATE()),
    
    -- Organization Management
    ('VIEW_ORGANIZATION_TYPES', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_ORGANIZATION_TYPES', 1, GETDATE(), 1, GETDATE()),
    ('VIEW_ORG_CHART', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_ORGANIZATIONS', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_DEPT_ADMINS', 1, GETDATE(), 1, GETDATE()),
    
    -- Employee Management
    ('VIEW_EMPLOYEE_DIRECTORY', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_EMPLOYEES', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_CONTRACT_TYPES', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_TEAM_GROUPING', 1, GETDATE(), 1, GETDATE()),
    
    -- Roster Management
    ('VIEW_SCHEDULES', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_SCHEDULES', 1, GETDATE(), 1, GETDATE()),
    ('VIEW_HOLIDAY_CALENDAR', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_HOLIDAYS', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_RAMADAN_HOURS', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_SHIFT_PATTERNS', 1, GETDATE(), 1, GETDATE()),
    ('VIEW_MONTHLY_ROSTER', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_MONTHLY_ROSTER', 1, GETDATE(), 1, GETDATE()),
    ('VIEW_WEEKLY_ROSTER', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_WEEKLY_ROSTER', 1, GETDATE(), 1, GETDATE()),
    
    -- Self Services
    ('VIEW_MY_LEAVES', 1, GETDATE(), 1, GETDATE()),
    ('APPLY_LEAVE', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_LEAVE_TYPES', 1, GETDATE(), 1, GETDATE()),
    ('VIEW_PERMISSION_TYPES', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_PERMISSION_TYPES', 1, GETDATE(), 1, GETDATE()),
    ('APPLY_PERMISSION', 1, GETDATE(), 1, GETDATE()),
    ('VIEW_ATTENDANCE_LOGS', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_WORKFLOW', 1, GETDATE(), 1, GETDATE()),
    
    -- Devices & Infrastructure
    ('MANAGE_DEVICES', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_ACCESS_ZONES', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_BUILDINGS', 1, GETDATE(), 1, GETDATE()),
    
    -- Security Settings
    ('MANAGE_ROLES', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_PERMISSIONS', 1, GETDATE(), 1, GETDATE()),
    ('VIEW_SESSION_MONITOR', 1, GETDATE(), 1, GETDATE()),
    ('VIEW_ACTIVITY_SUMMARY', 1, GETDATE(), 1, GETDATE()),
    
    -- Application Settings
    ('MANAGE_APP_SETTINGS', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_APP_CONFIG', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_ALERT_PREFERENCES', 1, GETDATE(), 1, GETDATE()),
    ('VIEW_AUDIT_TRAIL', 1, GETDATE(), 1, GETDATE()),
    
    -- Alert Centre
    ('MANAGE_EMAIL_ALERTS', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_SMS_ALERTS', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_BULLETINS', 1, GETDATE(), 1, GETDATE()),
    
    -- Workforce Management
    ('VIEW_APPROVALS', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_APPROVALS', 1, GETDATE(), 1, GETDATE()),
    ('VIEW_REPORTS', 1, GETDATE(), 1, GETDATE()),
    ('GENERATE_REPORTS', 1, GETDATE(), 1, GETDATE()),
    
    -- Support Centre
    ('VIEW_FAQS', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_FAQS', 1, GETDATE(), 1, GETDATE()),
    ('VIEW_USER_MANUAL', 1, GETDATE(), 1, GETDATE()),
    ('MANAGE_LICENSES', 1, GETDATE(), 1, GETDATE())
) AS temp(privilege_name, created_id, created_date, last_updated_id, last_updated_date)
WHERE NOT EXISTS (
    SELECT 1 FROM sec_privileges p 
    WHERE p.privilege_name = temp.privilege_name
);

PRINT 'Privileges inserted successfully';
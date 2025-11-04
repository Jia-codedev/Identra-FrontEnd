-- =====================================================================================
-- ROLE PRIVILEGES ASSIGNMENT SCRIPT
-- This script assigns privileges to each role based on their responsibility level
-- =====================================================================================

-- Clear existing role privileges to start fresh
DELETE FROM sec_role_privileges;

-- Get privilege IDs for easier assignment
DECLARE @privilegeIds TABLE (
    privilege_name VARCHAR(100),
    privilege_id INT
);

INSERT INTO @privilegeIds (privilege_name, privilege_id)
SELECT privilege_name, privilege_id FROM sec_privileges;

-- =====================================================================================
-- ROLE 1: ADMIN - Full system access
-- =====================================================================================
INSERT INTO sec_role_privileges (role_id, privilege_id, created_id, created_date, last_updated_id, last_updated_date)
SELECT 1, p.privilege_id, 1, GETDATE(), 1, GETDATE()
FROM @privilegeIds p;

PRINT 'ADMIN role privileges assigned (Full Access)';

-- =====================================================================================
-- ROLE 2: EMPLOYEE - Basic employee access
-- =====================================================================================
INSERT INTO sec_role_privileges (role_id, privilege_id, created_id, created_date, last_updated_id, last_updated_date)
SELECT 2, p.privilege_id, 1, GETDATE(), 1, GETDATE()
FROM @privilegeIds p
WHERE p.privilege_name IN (
    'VIEW_DASHBOARD',
    'VIEW_MY_INSIGHTS',
    'VIEW_MY_LEAVES',
    'APPLY_LEAVE',
    'APPLY_PERMISSION',
    'VIEW_ATTENDANCE_LOGS',
    'VIEW_SCHEDULES',
    'VIEW_MONTHLY_ROSTER',
    'VIEW_WEEKLY_ROSTER',
    'VIEW_HOLIDAY_CALENDAR',
    'VIEW_EMPLOYEE_DIRECTORY',
    'VIEW_FAQS',
    'VIEW_USER_MANUAL'
);

PRINT 'EMPLOYEE role privileges assigned';

-- =====================================================================================
-- ROLE 3: HR_ADMIN - Human Resources management
-- =====================================================================================
INSERT INTO sec_role_privileges (role_id, privilege_id, created_id, created_date, last_updated_id, last_updated_date)
SELECT 3, p.privilege_id, 1, GETDATE(), 1, GETDATE()
FROM @privilegeIds p
WHERE p.privilege_name IN (
    -- Dashboard & Analytics
    'VIEW_DASHBOARD',
    'VIEW_MY_INSIGHTS',
    'VIEW_TEAM_INSIGHTS',
    'VIEW_PRODUCTIVITY_METRICS',
    
    -- Employee Management
    'VIEW_EMPLOYEE_DIRECTORY',
    'MANAGE_EMPLOYEES',
    'MANAGE_CONTRACT_TYPES',
    'MANAGE_TEAM_GROUPING',
    
    -- Leave Management
    'VIEW_MY_LEAVES',
    'APPLY_LEAVE',
    'MANAGE_LEAVE_TYPES',
    'VIEW_PERMISSION_TYPES',
    'MANAGE_PERMISSION_TYPES',
    'APPLY_PERMISSION',
    'VIEW_APPROVALS',
    'MANAGE_APPROVALS',
    
    -- Roster Management
    'VIEW_SCHEDULES',
    'MANAGE_SCHEDULES',
    'VIEW_HOLIDAY_CALENDAR',
    'MANAGE_HOLIDAYS',
    'VIEW_MONTHLY_ROSTER',
    'MANAGE_MONTHLY_ROSTER',
    'VIEW_WEEKLY_ROSTER',
    'MANAGE_WEEKLY_ROSTER',
    
    -- Organization
    'VIEW_ORGANIZATION_TYPES',
    'VIEW_ORG_CHART',
    'MANAGE_ORGANIZATIONS',
    
    -- Workflow
    'MANAGE_WORKFLOW',
    'VIEW_ATTENDANCE_LOGS',
    
    -- Reports
    'VIEW_REPORTS',
    'GENERATE_REPORTS',
    
    -- Support
    'VIEW_FAQS',
    'MANAGE_FAQS',
    'VIEW_USER_MANUAL'
);

PRINT 'HR_ADMIN role privileges assigned';

-- =====================================================================================
-- ROLE 4: MANAGER - Team and department management
-- =====================================================================================
INSERT INTO sec_role_privileges (role_id, privilege_id, created_id, created_date, last_updated_id, last_updated_date)
SELECT 4, p.privilege_id, 1, GETDATE(), 1, GETDATE()
FROM @privilegeIds p
WHERE p.privilege_name IN (
    -- Dashboard & Analytics
    'VIEW_DASHBOARD',
    'VIEW_MY_INSIGHTS',
    'VIEW_TEAM_INSIGHTS',
    'VIEW_PRODUCTIVITY_METRICS',
    'VIEW_ACTIVITY_LOG',
    
    -- Employee Management
    'VIEW_EMPLOYEE_DIRECTORY',
    'MANAGE_TEAM_GROUPING',
    
    -- Self Services
    'VIEW_MY_LEAVES',
    'APPLY_LEAVE',
    'APPLY_PERMISSION',
    'VIEW_ATTENDANCE_LOGS',
    
    -- Approvals
    'VIEW_APPROVALS',
    'MANAGE_APPROVALS',
    
    -- Roster Management
    'VIEW_SCHEDULES',
    'VIEW_HOLIDAY_CALENDAR',
    'VIEW_MONTHLY_ROSTER',
    'MANAGE_MONTHLY_ROSTER',
    'VIEW_WEEKLY_ROSTER',
    'MANAGE_WEEKLY_ROSTER',
    
    -- Organization
    'VIEW_ORGANIZATION_TYPES',
    'VIEW_ORG_CHART',
    
    -- Workflow
    'MANAGE_WORKFLOW',
    
    -- Reports
    'VIEW_REPORTS',
    'GENERATE_REPORTS',
    
    -- Support
    'VIEW_FAQS',
    'VIEW_USER_MANUAL'
);

PRINT 'MANAGER role privileges assigned';

-- =====================================================================================
-- ROLE 5: OPERATIONS - Operations and infrastructure management
-- =====================================================================================
INSERT INTO sec_role_privileges (role_id, privilege_id, created_id, created_date, last_updated_id, last_updated_date)
SELECT 5, p.privilege_id, 1, GETDATE(), 1, GETDATE()
FROM @privilegeIds p
WHERE p.privilege_name IN (
    -- Dashboard & Analytics
    'VIEW_DASHBOARD',
    'VIEW_MY_INSIGHTS',
    'VIEW_TEAM_INSIGHTS',
    'VIEW_GEO_ANALYTICS',
    'VIEW_ACTIVITY_LOG',
    
    -- Devices & Infrastructure
    'MANAGE_DEVICES',
    'MANAGE_ACCESS_ZONES',
    'MANAGE_BUILDINGS',
    
    -- Employee Management
    'VIEW_EMPLOYEE_DIRECTORY',
    
    -- Self Services
    'VIEW_MY_LEAVES',
    'APPLY_LEAVE',
    'APPLY_PERMISSION',
    'VIEW_ATTENDANCE_LOGS',
    
    -- Roster Management
    'VIEW_SCHEDULES',
    'MANAGE_SCHEDULES',
    'VIEW_HOLIDAY_CALENDAR',
    'MANAGE_HOLIDAYS',
    'VIEW_MONTHLY_ROSTER',
    'VIEW_WEEKLY_ROSTER',
    'MANAGE_SHIFT_PATTERNS',
    
    -- Organization
    'VIEW_ORGANIZATION_TYPES',
    'VIEW_ORG_CHART',
    'MANAGE_ORGANIZATIONS',
    
    -- Application Settings
    'MANAGE_APP_SETTINGS',
    'MANAGE_APP_CONFIG',
    'VIEW_AUDIT_TRAIL',
    
    -- Alert Management
    'MANAGE_EMAIL_ALERTS',
    'MANAGE_SMS_ALERTS',
    'MANAGE_BULLETINS',
    
    -- Reports
    'VIEW_REPORTS',
    'GENERATE_REPORTS',
    
    -- Support
    'VIEW_FAQS',
    'VIEW_USER_MANUAL'
);

PRINT 'OPERATIONS role privileges assigned';

-- =====================================================================================
-- ROLE 6: TA_ADMIN - Time & Attendance administration
-- =====================================================================================
INSERT INTO sec_role_privileges (role_id, privilege_id, created_id, created_date, last_updated_id, last_updated_date)
SELECT 6, p.privilege_id, 1, GETDATE(), 1, GETDATE()
FROM @privilegeIds p
WHERE p.privilege_name IN (
    -- Dashboard & Analytics
    'VIEW_DASHBOARD',
    'VIEW_MY_INSIGHTS',
    'VIEW_TEAM_INSIGHTS',
    'VIEW_PRODUCTIVITY_METRICS',
    'VIEW_ACTIVITY_LOG',
    'VIEW_GEO_ANALYTICS',
    
    -- Employee Management
    'VIEW_EMPLOYEE_DIRECTORY',
    'MANAGE_EMPLOYEES',
    
    -- Self Services
    'VIEW_MY_LEAVES',
    'APPLY_LEAVE',
    'APPLY_PERMISSION',
    'VIEW_ATTENDANCE_LOGS',
    
    -- Roster Management
    'VIEW_SCHEDULES',
    'MANAGE_SCHEDULES',
    'VIEW_HOLIDAY_CALENDAR',
    'MANAGE_HOLIDAYS',
    'MANAGE_RAMADAN_HOURS',
    'MANAGE_SHIFT_PATTERNS',
    'VIEW_MONTHLY_ROSTER',
    'MANAGE_MONTHLY_ROSTER',
    'VIEW_WEEKLY_ROSTER',
    'MANAGE_WEEKLY_ROSTER',
    
    -- Devices & Infrastructure
    'MANAGE_DEVICES',
    'MANAGE_ACCESS_ZONES',
    
    -- Organization
    'VIEW_ORGANIZATION_TYPES',
    'VIEW_ORG_CHART',
    
    -- Workflow
    'MANAGE_WORKFLOW',
    
    -- Reports
    'VIEW_REPORTS',
    'GENERATE_REPORTS',
    
    -- Support
    'VIEW_FAQS',
    'VIEW_USER_MANUAL'
);

PRINT 'TA_ADMIN role privileges assigned';

-- =====================================================================================
-- ROLE 7: SECRETARY - Administrative support
-- =====================================================================================
INSERT INTO sec_role_privileges (role_id, privilege_id, created_id, created_date, last_updated_id, last_updated_date)
SELECT 7, p.privilege_id, 1, GETDATE(), 1, GETDATE()
FROM @privilegeIds p
WHERE p.privilege_name IN (
    -- Dashboard & Analytics
    'VIEW_DASHBOARD',
    'VIEW_MY_INSIGHTS',
    'VIEW_TEAM_INSIGHTS',
    
    -- Employee Management
    'VIEW_EMPLOYEE_DIRECTORY',
    
    -- Self Services
    'VIEW_MY_LEAVES',
    'APPLY_LEAVE',
    'APPLY_PERMISSION',
    'VIEW_ATTENDANCE_LOGS',
    
    -- Roster Management
    'VIEW_SCHEDULES',
    'VIEW_HOLIDAY_CALENDAR',
    'VIEW_MONTHLY_ROSTER',
    'VIEW_WEEKLY_ROSTER',
    
    -- Organization
    'VIEW_ORGANIZATION_TYPES',
    'VIEW_ORG_CHART',
    
    -- Approvals (limited)
    'VIEW_APPROVALS',
    
    -- Support
    'VIEW_FAQS',
    'VIEW_USER_MANUAL',
    
    -- Alert Management
    'MANAGE_BULLETINS'
);

PRINT 'SECRETARY role privileges assigned';

-- =====================================================================================
-- ROLE 8: Share_Roster - Roster sharing access
-- =====================================================================================
INSERT INTO sec_role_privileges (role_id, privilege_id, created_id, created_date, last_updated_id, last_updated_date)
SELECT 8, p.privilege_id, 1, GETDATE(), 1, GETDATE()
FROM @privilegeIds p
WHERE p.privilege_name IN (
    -- Dashboard & Analytics
    'VIEW_DASHBOARD',
    'VIEW_MY_INSIGHTS',
    
    -- Employee Management
    'VIEW_EMPLOYEE_DIRECTORY',
    
    -- Self Services
    'VIEW_MY_LEAVES',
    'APPLY_LEAVE',
    'APPLY_PERMISSION',
    'VIEW_ATTENDANCE_LOGS',
    
    -- Roster Management (View Only)
    'VIEW_SCHEDULES',
    'VIEW_HOLIDAY_CALENDAR',
    'VIEW_MONTHLY_ROSTER',
    'VIEW_WEEKLY_ROSTER',
    
    -- Organization
    'VIEW_ORGANIZATION_TYPES',
    'VIEW_ORG_CHART',
    
    -- Support
    'VIEW_FAQS',
    'VIEW_USER_MANUAL'
);

PRINT 'Share_Roster role privileges assigned';

-- =====================================================================================
-- ROLE 9: SENIORS - Senior staff with additional privileges
-- =====================================================================================
INSERT INTO sec_role_privileges (role_id, privilege_id, created_id, created_date, last_updated_id, last_updated_date)
SELECT 9, p.privilege_id, 1, GETDATE(), 1, GETDATE()
FROM @privilegeIds p
WHERE p.privilege_name IN (
    -- Dashboard & Analytics
    'VIEW_DASHBOARD',
    'VIEW_MY_INSIGHTS',
    'VIEW_TEAM_INSIGHTS',
    'VIEW_PRODUCTIVITY_METRICS',
    'VIEW_ACTIVITY_LOG',
    
    -- Employee Management
    'VIEW_EMPLOYEE_DIRECTORY',
    
    -- Self Services
    'VIEW_MY_LEAVES',
    'APPLY_LEAVE',
    'APPLY_PERMISSION',
    'VIEW_ATTENDANCE_LOGS',
    
    -- Approvals
    'VIEW_APPROVALS',
    'MANAGE_APPROVALS',
    
    -- Roster Management
    'VIEW_SCHEDULES',
    'VIEW_HOLIDAY_CALENDAR',
    'VIEW_MONTHLY_ROSTER',
    'VIEW_WEEKLY_ROSTER',
    
    -- Organization
    'VIEW_ORGANIZATION_TYPES',
    'VIEW_ORG_CHART',
    
    -- Workflow
    'MANAGE_WORKFLOW',
    
    -- Reports
    'VIEW_REPORTS',
    'GENERATE_REPORTS',
    
    -- Support
    'VIEW_FAQS',
    'VIEW_USER_MANUAL'
);

PRINT 'SENIORS role privileges assigned';

-- =====================================================================================
-- ROLE 10: DELEGATIONS - Department administrators
-- =====================================================================================
INSERT INTO sec_role_privileges (role_id, privilege_id, created_id, created_date, last_updated_id, last_updated_date)
SELECT 10, p.privilege_id, 1, GETDATE(), 1, GETDATE()
FROM @privilegeIds p
WHERE p.privilege_name IN (
    -- Dashboard & Analytics
    'VIEW_DASHBOARD',
    'VIEW_MY_INSIGHTS',
    'VIEW_TEAM_INSIGHTS',
    'VIEW_PRODUCTIVITY_METRICS',
    'VIEW_ACTIVITY_LOG',
    
    -- Employee Management
    'VIEW_EMPLOYEE_DIRECTORY',
    'MANAGE_EMPLOYEES',
    'MANAGE_TEAM_GROUPING',
    
    -- Self Services
    'VIEW_MY_LEAVES',
    'APPLY_LEAVE',
    'APPLY_PERMISSION',
    'VIEW_ATTENDANCE_LOGS',
    
    -- Approvals
    'VIEW_APPROVALS',
    'MANAGE_APPROVALS',
    
    -- Roster Management
    'VIEW_SCHEDULES',
    'MANAGE_SCHEDULES',
    'VIEW_HOLIDAY_CALENDAR',
    'VIEW_MONTHLY_ROSTER',
    'MANAGE_MONTHLY_ROSTER',
    'VIEW_WEEKLY_ROSTER',
    'MANAGE_WEEKLY_ROSTER',
    
    -- Organization
    'VIEW_ORGANIZATION_TYPES',
    'VIEW_ORG_CHART',
    'MANAGE_ORGANIZATIONS',
    'MANAGE_DELEGATIONS',
    
    -- Workflow
    'MANAGE_WORKFLOW',
    
    -- Reports
    'VIEW_REPORTS',
    'GENERATE_REPORTS',
    
    -- Support
    'VIEW_FAQS',
    'MANAGE_FAQS',
    'VIEW_USER_MANUAL'
);

PRINT 'DELEGATIONS role privileges assigned';

-- =====================================================================================
-- Summary
-- =====================================================================================
PRINT '=====================================================================================';
PRINT 'ROLE PRIVILEGES ASSIGNMENT COMPLETED';
PRINT '=====================================================================================';

-- Display summary of assigned privileges per role
SELECT 
    r.role_name,
    COUNT(rp.privilege_id) as total_privileges
FROM sec_roles r
LEFT JOIN sec_role_privileges rp ON r.role_id = rp.role_id
GROUP BY r.role_id, r.role_name
ORDER BY r.role_id;

PRINT 'All role privileges have been successfully assigned!';
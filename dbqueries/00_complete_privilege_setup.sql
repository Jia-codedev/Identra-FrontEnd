-- =====================================================================================
-- COMPLETE SETUP SCRIPT - PRIVILEGES AND ROLE ASSIGNMENTS
-- This script combines both privilege insertion and role assignment
-- Run this script to set up the complete privilege system
-- =====================================================================================

USE [ChronexaDB]; -- Replace with your actual database name
GO

BEGIN TRANSACTION;

BEGIN TRY
    PRINT 'Starting privilege setup process...';
    PRINT CHAR(13) + CHAR(10);

    -- =====================================================================================
    -- STEP 1: Insert Privileges
    -- =====================================================================================
    PRINT '=== STEP 1: INSERTING PRIVILEGES ===';
    
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
    PRINT CHAR(13) + CHAR(10);

    -- =====================================================================================
    -- STEP 2: Assign Role Privileges
    -- =====================================================================================
    PRINT '=== STEP 2: ASSIGNING ROLE PRIVILEGES ===';
    
    -- Clear existing role privileges to start fresh
    DELETE FROM sec_role_privileges;
    PRINT 'Cleared existing role privileges';

    -- Create a mapping table for easier assignment
    DECLARE @rolePrivileges TABLE (
        role_id INT,
        privilege_name VARCHAR(100)
    );

    -- ADMIN (Role 1) - Full Access
    INSERT INTO @rolePrivileges (role_id, privilege_name)
    SELECT 1, privilege_name FROM sec_privileges;

    -- EMPLOYEE (Role 2) - Basic Access
    INSERT INTO @rolePrivileges (role_id, privilege_name) VALUES
    (2, 'VIEW_DASHBOARD'), (2, 'VIEW_MY_INSIGHTS'), (2, 'VIEW_MY_LEAVES'), (2, 'APPLY_LEAVE'),
    (2, 'APPLY_PERMISSION'), (2, 'VIEW_ATTENDANCE_LOGS'), (2, 'VIEW_SCHEDULES'), (2, 'VIEW_MONTHLY_ROSTER'),
    (2, 'VIEW_WEEKLY_ROSTER'), (2, 'VIEW_HOLIDAY_CALENDAR'), (2, 'VIEW_EMPLOYEE_DIRECTORY'), (2, 'VIEW_FAQS'),
    (2, 'VIEW_USER_MANUAL');

    -- HR_ADMIN (Role 3) - HR Management
    INSERT INTO @rolePrivileges (role_id, privilege_name) VALUES
    (3, 'VIEW_DASHBOARD'), (3, 'VIEW_MY_INSIGHTS'), (3, 'VIEW_TEAM_INSIGHTS'), (3, 'VIEW_PRODUCTIVITY_METRICS'),
    (3, 'VIEW_EMPLOYEE_DIRECTORY'), (3, 'MANAGE_EMPLOYEES'), (3, 'MANAGE_CONTRACT_TYPES'), (3, 'MANAGE_TEAM_GROUPING'),
    (3, 'VIEW_MY_LEAVES'), (3, 'APPLY_LEAVE'), (3, 'MANAGE_LEAVE_TYPES'), (3, 'VIEW_PERMISSION_TYPES'),
    (3, 'MANAGE_PERMISSION_TYPES'), (3, 'APPLY_PERMISSION'), (3, 'VIEW_APPROVALS'), (3, 'MANAGE_APPROVALS'),
    (3, 'VIEW_SCHEDULES'), (3, 'MANAGE_SCHEDULES'), (3, 'VIEW_HOLIDAY_CALENDAR'), (3, 'MANAGE_HOLIDAYS'),
    (3, 'VIEW_MONTHLY_ROSTER'), (3, 'MANAGE_MONTHLY_ROSTER'), (3, 'VIEW_WEEKLY_ROSTER'), (3, 'MANAGE_WEEKLY_ROSTER'),
    (3, 'VIEW_ORGANIZATION_TYPES'), (3, 'VIEW_ORG_CHART'), (3, 'MANAGE_ORGANIZATIONS'), (3, 'MANAGE_WORKFLOW'),
    (3, 'VIEW_ATTENDANCE_LOGS'), (3, 'VIEW_REPORTS'), (3, 'GENERATE_REPORTS'), (3, 'VIEW_FAQS'),
    (3, 'MANAGE_FAQS'), (3, 'VIEW_USER_MANUAL');

    -- MANAGER (Role 4) - Team Management
    INSERT INTO @rolePrivileges (role_id, privilege_name) VALUES
    (4, 'VIEW_DASHBOARD'), (4, 'VIEW_MY_INSIGHTS'), (4, 'VIEW_TEAM_INSIGHTS'), (4, 'VIEW_PRODUCTIVITY_METRICS'),
    (4, 'VIEW_ACTIVITY_LOG'), (4, 'VIEW_EMPLOYEE_DIRECTORY'), (4, 'MANAGE_TEAM_GROUPING'), (4, 'VIEW_MY_LEAVES'),
    (4, 'APPLY_LEAVE'), (4, 'APPLY_PERMISSION'), (4, 'VIEW_ATTENDANCE_LOGS'), (4, 'VIEW_APPROVALS'),
    (4, 'MANAGE_APPROVALS'), (4, 'VIEW_SCHEDULES'), (4, 'VIEW_HOLIDAY_CALENDAR'), (4, 'VIEW_MONTHLY_ROSTER'),
    (4, 'MANAGE_MONTHLY_ROSTER'), (4, 'VIEW_WEEKLY_ROSTER'), (4, 'MANAGE_WEEKLY_ROSTER'), (4, 'VIEW_ORGANIZATION_TYPES'),
    (4, 'VIEW_ORG_CHART'), (4, 'MANAGE_WORKFLOW'), (4, 'VIEW_REPORTS'), (4, 'GENERATE_REPORTS'),
    (4, 'VIEW_FAQS'), (4, 'VIEW_USER_MANUAL');

    -- OPERATIONS (Role 5) - Operations Management
    INSERT INTO @rolePrivileges (role_id, privilege_name) VALUES
    (5, 'VIEW_DASHBOARD'), (5, 'VIEW_MY_INSIGHTS'), (5, 'VIEW_TEAM_INSIGHTS'), (5, 'VIEW_GEO_ANALYTICS'),
    (5, 'VIEW_ACTIVITY_LOG'), (5, 'MANAGE_DEVICES'), (5, 'MANAGE_ACCESS_ZONES'), (5, 'MANAGE_BUILDINGS'),
    (5, 'VIEW_EMPLOYEE_DIRECTORY'), (5, 'VIEW_MY_LEAVES'), (5, 'APPLY_LEAVE'), (5, 'APPLY_PERMISSION'),
    (5, 'VIEW_ATTENDANCE_LOGS'), (5, 'VIEW_SCHEDULES'), (5, 'MANAGE_SCHEDULES'), (5, 'VIEW_HOLIDAY_CALENDAR'),
    (5, 'MANAGE_HOLIDAYS'), (5, 'VIEW_MONTHLY_ROSTER'), (5, 'VIEW_WEEKLY_ROSTER'), (5, 'MANAGE_SHIFT_PATTERNS'),
    (5, 'VIEW_ORGANIZATION_TYPES'), (5, 'VIEW_ORG_CHART'), (5, 'MANAGE_ORGANIZATIONS'), (5, 'MANAGE_APP_SETTINGS'),
    (5, 'MANAGE_APP_CONFIG'), (5, 'VIEW_AUDIT_TRAIL'), (5, 'MANAGE_EMAIL_ALERTS'), (5, 'MANAGE_SMS_ALERTS'),
    (5, 'MANAGE_BULLETINS'), (5, 'VIEW_REPORTS'), (5, 'GENERATE_REPORTS'), (5, 'VIEW_FAQS'), (5, 'VIEW_USER_MANUAL');

    -- TA_ADMIN (Role 6) - Time & Attendance Administration
    INSERT INTO @rolePrivileges (role_id, privilege_name) VALUES
    (6, 'VIEW_DASHBOARD'), (6, 'VIEW_MY_INSIGHTS'), (6, 'VIEW_TEAM_INSIGHTS'), (6, 'VIEW_PRODUCTIVITY_METRICS'),
    (6, 'VIEW_ACTIVITY_LOG'), (6, 'VIEW_GEO_ANALYTICS'), (6, 'VIEW_EMPLOYEE_DIRECTORY'), (6, 'MANAGE_EMPLOYEES'),
    (6, 'VIEW_MY_LEAVES'), (6, 'APPLY_LEAVE'), (6, 'APPLY_PERMISSION'), (6, 'VIEW_ATTENDANCE_LOGS'),
    (6, 'VIEW_SCHEDULES'), (6, 'MANAGE_SCHEDULES'), (6, 'VIEW_HOLIDAY_CALENDAR'), (6, 'MANAGE_HOLIDAYS'),
    (6, 'MANAGE_RAMADAN_HOURS'), (6, 'MANAGE_SHIFT_PATTERNS'), (6, 'VIEW_MONTHLY_ROSTER'), (6, 'MANAGE_MONTHLY_ROSTER'),
    (6, 'VIEW_WEEKLY_ROSTER'), (6, 'MANAGE_WEEKLY_ROSTER'), (6, 'MANAGE_DEVICES'), (6, 'MANAGE_ACCESS_ZONES'),
    (6, 'VIEW_ORGANIZATION_TYPES'), (6, 'VIEW_ORG_CHART'), (6, 'MANAGE_WORKFLOW'), (6, 'VIEW_REPORTS'),
    (6, 'GENERATE_REPORTS'), (6, 'VIEW_FAQS'), (6, 'VIEW_USER_MANUAL');

    -- SECRETARY (Role 7) - Administrative Support
    INSERT INTO @rolePrivileges (role_id, privilege_name) VALUES
    (7, 'VIEW_DASHBOARD'), (7, 'VIEW_MY_INSIGHTS'), (7, 'VIEW_TEAM_INSIGHTS'), (7, 'VIEW_EMPLOYEE_DIRECTORY'),
    (7, 'VIEW_MY_LEAVES'), (7, 'APPLY_LEAVE'), (7, 'APPLY_PERMISSION'), (7, 'VIEW_ATTENDANCE_LOGS'),
    (7, 'VIEW_SCHEDULES'), (7, 'VIEW_HOLIDAY_CALENDAR'), (7, 'VIEW_MONTHLY_ROSTER'), (7, 'VIEW_WEEKLY_ROSTER'),
    (7, 'VIEW_ORGANIZATION_TYPES'), (7, 'VIEW_ORG_CHART'), (7, 'VIEW_APPROVALS'), (7, 'VIEW_FAQS'),
    (7, 'VIEW_USER_MANUAL'), (7, 'MANAGE_BULLETINS');

    -- Share_Roster (Role 8) - Roster Sharing
    INSERT INTO @rolePrivileges (role_id, privilege_name) VALUES
    (8, 'VIEW_DASHBOARD'), (8, 'VIEW_MY_INSIGHTS'), (8, 'VIEW_EMPLOYEE_DIRECTORY'), (8, 'VIEW_MY_LEAVES'),
    (8, 'APPLY_LEAVE'), (8, 'APPLY_PERMISSION'), (8, 'VIEW_ATTENDANCE_LOGS'), (8, 'VIEW_SCHEDULES'),
    (8, 'VIEW_HOLIDAY_CALENDAR'), (8, 'VIEW_MONTHLY_ROSTER'), (8, 'VIEW_WEEKLY_ROSTER'), (8, 'VIEW_ORGANIZATION_TYPES'),
    (8, 'VIEW_ORG_CHART'), (8, 'VIEW_FAQS'), (8, 'VIEW_USER_MANUAL');

    -- SENIORS (Role 9) - Senior Staff
    INSERT INTO @rolePrivileges (role_id, privilege_name) VALUES
    (9, 'VIEW_DASHBOARD'), (9, 'VIEW_MY_INSIGHTS'), (9, 'VIEW_TEAM_INSIGHTS'), (9, 'VIEW_PRODUCTIVITY_METRICS'),
    (9, 'VIEW_ACTIVITY_LOG'), (9, 'VIEW_EMPLOYEE_DIRECTORY'), (9, 'VIEW_MY_LEAVES'), (9, 'APPLY_LEAVE'),
    (9, 'APPLY_PERMISSION'), (9, 'VIEW_ATTENDANCE_LOGS'), (9, 'VIEW_APPROVALS'), (9, 'MANAGE_APPROVALS'),
    (9, 'VIEW_SCHEDULES'), (9, 'VIEW_HOLIDAY_CALENDAR'), (9, 'VIEW_MONTHLY_ROSTER'), (9, 'VIEW_WEEKLY_ROSTER'),
    (9, 'VIEW_ORGANIZATION_TYPES'), (9, 'VIEW_ORG_CHART'), (9, 'MANAGE_WORKFLOW'), (9, 'VIEW_REPORTS'),
    (9, 'GENERATE_REPORTS'), (9, 'VIEW_FAQS'), (9, 'VIEW_USER_MANUAL');

    -- DEPT_ADMINS (Role 10) - Department Administrators
    INSERT INTO @rolePrivileges (role_id, privilege_name) VALUES
    (10, 'VIEW_DASHBOARD'), (10, 'VIEW_MY_INSIGHTS'), (10, 'VIEW_TEAM_INSIGHTS'), (10, 'VIEW_PRODUCTIVITY_METRICS'),
    (10, 'VIEW_ACTIVITY_LOG'), (10, 'VIEW_EMPLOYEE_DIRECTORY'), (10, 'MANAGE_EMPLOYEES'), (10, 'MANAGE_TEAM_GROUPING'),
    (10, 'VIEW_MY_LEAVES'), (10, 'APPLY_LEAVE'), (10, 'APPLY_PERMISSION'), (10, 'VIEW_ATTENDANCE_LOGS'),
    (10, 'VIEW_APPROVALS'), (10, 'MANAGE_APPROVALS'), (10, 'VIEW_SCHEDULES'), (10, 'MANAGE_SCHEDULES'),
    (10, 'VIEW_HOLIDAY_CALENDAR'), (10, 'VIEW_MONTHLY_ROSTER'), (10, 'MANAGE_MONTHLY_ROSTER'), (10, 'VIEW_WEEKLY_ROSTER'),
    (10, 'MANAGE_WEEKLY_ROSTER'), (10, 'VIEW_ORGANIZATION_TYPES'), (10, 'VIEW_ORG_CHART'), (10, 'MANAGE_ORGANIZATIONS'),
    (10, 'MANAGE_DEPT_ADMINS'), (10, 'MANAGE_WORKFLOW'), (10, 'VIEW_REPORTS'), (10, 'GENERATE_REPORTS'),
    (10, 'VIEW_FAQS'), (10, 'MANAGE_FAQS'), (10, 'VIEW_USER_MANUAL');

    -- Insert all role privileges
    INSERT INTO sec_role_privileges (role_id, privilege_id, created_id, created_date, last_updated_id, last_updated_date)
    SELECT 
        rp.role_id,
        p.privilege_id,
        1,
        GETDATE(),
        1,
        GETDATE()
    FROM @rolePrivileges rp
    INNER JOIN sec_privileges p ON rp.privilege_name = p.privilege_name;

    PRINT 'Role privileges assigned successfully';
    PRINT CHAR(13) + CHAR(10);

    -- =====================================================================================
    -- STEP 3: Display Summary
    -- =====================================================================================
    PRINT '=== SETUP SUMMARY ===';
    
    SELECT 
        r.role_name,
        COUNT(rp.privilege_id) as total_privileges
    FROM sec_roles r
    LEFT JOIN sec_role_privileges rp ON r.role_id = rp.role_id
    GROUP BY r.role_id, r.role_name
    ORDER BY r.role_id;

    COMMIT TRANSACTION;
    
    PRINT CHAR(13) + CHAR(10);
    PRINT '=====================================================================================';
    PRINT 'PRIVILEGE SETUP COMPLETED SUCCESSFULLY!';
    PRINT '=====================================================================================';
    PRINT 'Total Privileges Created: ' + CAST((SELECT COUNT(*) FROM sec_privileges) AS VARCHAR(10));
    PRINT 'Total Role-Privilege Assignments: ' + CAST((SELECT COUNT(*) FROM sec_role_privileges) AS VARCHAR(10));
    PRINT '=====================================================================================';

END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    
    PRINT 'ERROR OCCURRED DURING SETUP:';
    PRINT 'Error Number: ' + CAST(ERROR_NUMBER() AS VARCHAR(10));
    PRINT 'Error Message: ' + ERROR_MESSAGE();
    PRINT 'Error Line: ' + CAST(ERROR_LINE() AS VARCHAR(10));
    
    THROW;
END CATCH;
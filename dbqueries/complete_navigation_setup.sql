-- Complete Navigation Setup Script
-- This script will create all necessary data and procedures for navigation

-- Step 1: Insert main navigation modules using existing sec_modules table
INSERT INTO sec_modules (
    module_name, 
    created_id, 
    created_date, 
    last_updated_id, 
    last_updated_date
) VALUES 
-- Main Menu Items
('workforce-analytics', 1, GETDATE(), 1, GETDATE()),
('enterprise-settings', 1, GETDATE(), 1, GETDATE()),
('organization-menu', 1, GETDATE(), 1, GETDATE()),
('employee-management', 1, GETDATE(), 1, GETDATE()),
('roster-management', 1, GETDATE(), 1, GETDATE()),
('self-services', 1, GETDATE(), 1, GETDATE()),

-- Sidebar Menu Items
('devices-infrastructure', 1, GETDATE(), 1, GETDATE()),
('user-security', 1, GETDATE(), 1, GETDATE()),
('app-settings', 1, GETDATE(), 1, GETDATE()),
('alert-centre', 1, GETDATE(), 1, GETDATE()),
('workforce', 1, GETDATE(), 1, GETDATE()),

-- Footer Menu Items
('support-centre', 1, GETDATE(), 1, GETDATE());

-- Step 2: Insert Sub-modules
-- Get module IDs for reference
DECLARE @WorkforceAnalyticsId INT = (SELECT module_id FROM sec_modules WHERE module_name = 'workforce-analytics');
DECLARE @EnterpriseSettingsId INT = (SELECT module_id FROM sec_modules WHERE module_name = 'enterprise-settings');
DECLARE @OrganizationId INT = (SELECT module_id FROM sec_modules WHERE module_name = 'organization-menu');
DECLARE @EmployeeManagementId INT = (SELECT module_id FROM sec_modules WHERE module_name = 'employee-management');
DECLARE @RosterManagementId INT = (SELECT module_id FROM sec_modules WHERE module_name = 'roster-management');
DECLARE @SelfServicesId INT = (SELECT module_id FROM sec_modules WHERE module_name = 'self-services');
DECLARE @DevicesInfrastructureId INT = (SELECT module_id FROM sec_modules WHERE module_name = 'devices-infrastructure');
DECLARE @UserSecurityId INT = (SELECT module_id FROM sec_modules WHERE module_name = 'user-security');
DECLARE @AppSettingsId INT = (SELECT module_id FROM sec_modules WHERE module_name = 'app-settings');
DECLARE @AlertCentreId INT = (SELECT module_id FROM sec_modules WHERE module_name = 'alert-centre');
DECLARE @WorkforceId INT = (SELECT module_id FROM sec_modules WHERE module_name = 'workforce');
DECLARE @SupportCentreId INT = (SELECT module_id FROM sec_modules WHERE module_name = 'support-centre');

-- Workforce Analytics sub-modules
INSERT INTO sec_sub_modules (sub_module_name, module_id, created_id, created_date, last_updated_id, last_updated_date) VALUES
('my-insights', @WorkforceAnalyticsId, 1, GETDATE(), 1, GETDATE()),
('team-insights', @WorkforceAnalyticsId, 1, GETDATE(), 1, GETDATE()),
('activity-log', @WorkforceAnalyticsId, 1, GETDATE(), 1, GETDATE()),
('productivity-metrics', @WorkforceAnalyticsId, 1, GETDATE(), 1, GETDATE()),
('geo-analytics', @WorkforceAnalyticsId, 1, GETDATE(), 1, GETDATE());

-- Enterprise Settings sub-modules
INSERT INTO sec_sub_modules (sub_module_name, module_id, created_id, created_date, last_updated_id, last_updated_date) VALUES
('site-management', @EnterpriseSettingsId, 1, GETDATE(), 1, GETDATE()),
('job-levels', @EnterpriseSettingsId, 1, GETDATE(), 1, GETDATE()),
('job-titles', @EnterpriseSettingsId, 1, GETDATE(), 1, GETDATE()),
('citizenship-info', @EnterpriseSettingsId, 1, GETDATE(), 1, GETDATE());

-- Organization sub-modules
INSERT INTO sec_sub_modules (sub_module_name, module_id, created_id, created_date, last_updated_id, last_updated_date) VALUES
('organization-type', @OrganizationId, 1, GETDATE(), 1, GETDATE()),
('org-chart', @OrganizationId, 1, GETDATE(), 1, GETDATE()),
('organizations', @OrganizationId, 1, GETDATE(), 1, GETDATE()),
('dept-admins', @OrganizationId, 1, GETDATE(), 1, GETDATE());

-- Employee Management sub-modules
INSERT INTO sec_sub_modules (sub_module_name, module_id, created_id, created_date, last_updated_id, last_updated_date) VALUES
('employee-directory', @EmployeeManagementId, 1, GETDATE(), 1, GETDATE()),
('contract-types', @EmployeeManagementId, 1, GETDATE(), 1, GETDATE()),
('team-grouping', @EmployeeManagementId, 1, GETDATE(), 1, GETDATE());

-- Roster Management sub-modules
INSERT INTO sec_sub_modules (sub_module_name, module_id, created_id, created_date, last_updated_id, last_updated_date) VALUES
('reasons', @RosterManagementId, 1, GETDATE(), 1, GETDATE()),
('holiday-calendar', @RosterManagementId, 1, GETDATE(), 1, GETDATE()),
('ramadan-hours', @RosterManagementId, 1, GETDATE(), 1, GETDATE()),
('shift-patterns', @RosterManagementId, 1, GETDATE(), 1, GETDATE()),
('monthly-roster', @RosterManagementId, 1, GETDATE(), 1, GETDATE()),
('weekly-roster', @RosterManagementId, 1, GETDATE(), 1, GETDATE());

-- Self Services sub-modules
INSERT INTO sec_sub_modules (sub_module_name, module_id, created_id, created_date, last_updated_id, last_updated_date) VALUES
('leave-management', @SelfServicesId, 1, GETDATE(), 1, GETDATE()),
('leave-types', @SelfServicesId, 1, GETDATE(), 1, GETDATE()),
('permission-types', @SelfServicesId, 1, GETDATE(), 1, GETDATE()),
('permission-management', @SelfServicesId, 1, GETDATE(), 1, GETDATE()),
('attendance-logs', @SelfServicesId, 1, GETDATE(), 1, GETDATE()),
('workflow-automation', @SelfServicesId, 1, GETDATE(), 1, GETDATE());

-- Devices and Infrastructure sub-modules
INSERT INTO sec_sub_modules (sub_module_name, module_id, created_id, created_date, last_updated_id, last_updated_date) VALUES
('biometric-terminals', @DevicesInfrastructureId, 1, GETDATE(), 1, GETDATE()),
('access-zones', @DevicesInfrastructureId, 1, GETDATE(), 1, GETDATE()),
('buildings', @DevicesInfrastructureId, 1, GETDATE(), 1, GETDATE());

-- User Security Settings sub-modules
INSERT INTO sec_sub_modules (sub_module_name, module_id, created_id, created_date, last_updated_id, last_updated_date) VALUES
('roles-management', @UserSecurityId, 1, GETDATE(), 1, GETDATE()),
('access-permissions', @UserSecurityId, 1, GETDATE(), 1, GETDATE()),
('session-monitor', @UserSecurityId, 1, GETDATE(), 1, GETDATE()),
('activity-summary', @UserSecurityId, 1, GETDATE(), 1, GETDATE());

-- Application Settings sub-modules
INSERT INTO sec_sub_modules (sub_module_name, module_id, created_id, created_date, last_updated_id, last_updated_date) VALUES
('app-settings-main', @AppSettingsId, 1, GETDATE(), 1, GETDATE()),
('app-configuration', @AppSettingsId, 1, GETDATE(), 1, GETDATE()),
('alert-preferences', @AppSettingsId, 1, GETDATE(), 1, GETDATE()),
('audit-trail', @AppSettingsId, 1, GETDATE(), 1, GETDATE());

-- Alert Centre sub-modules
INSERT INTO sec_sub_modules (sub_module_name, module_id, created_id, created_date, last_updated_id, last_updated_date) VALUES
('email-alerts', @AlertCentreId, 1, GETDATE(), 1, GETDATE()),
('sms-alerts', @AlertCentreId, 1, GETDATE(), 1, GETDATE()),
('bulletins', @AlertCentreId, 1, GETDATE(), 1, GETDATE());

-- Workforce sub-modules
INSERT INTO sec_sub_modules (sub_module_name, module_id, created_id, created_date, last_updated_id, last_updated_date) VALUES
('approvals', @WorkforceId, 1, GETDATE(), 1, GETDATE()),
('reports', @WorkforceId, 1, GETDATE(), 1, GETDATE());

-- Support Centre sub-modules
INSERT INTO sec_sub_modules (sub_module_name, module_id, created_id, created_date, last_updated_id, last_updated_date) VALUES
('faqs', @SupportCentreId, 1, GETDATE(), 1, GETDATE()),
('user-manual', @SupportCentreId, 1, GETDATE(), 1, GETDATE()),
('license-management', @SupportCentreId, 1, GETDATE(), 1, GETDATE());

PRINT 'Navigation modules and sub-modules inserted successfully!';
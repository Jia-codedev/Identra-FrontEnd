-- Create a view that provides navigation mapping
CREATE VIEW v_navigation_mapping AS
SELECT 
    m.module_id,
    m.module_name,
    CASE m.module_name
        WHEN 'workforce-analytics' THEN 'mainMenu.workforceAnalytics.title'
        WHEN 'enterprise-settings' THEN 'mainMenu.enterpriseSettings.title'
        WHEN 'organization' THEN 'mainMenu.organization.title'
        WHEN 'employee-management' THEN 'mainMenu.employeeManagement.title'
        WHEN 'roster-management' THEN 'mainMenu.rosterManagement.title'
        WHEN 'self-services' THEN 'mainMenu.selfServices.title'
        WHEN 'devices-infrastructure' THEN 'mainMenu.devicesAndInfrastructure.title'
        WHEN 'user-security' THEN 'mainMenu.userSecuritySettings.title'
        WHEN 'app-settings' THEN 'mainMenu.applicationSettings.title'
        WHEN 'alert-centre' THEN 'mainMenu.alertCentre.title'
        WHEN 'workforce' THEN 'common.workforce'
        WHEN 'support-centre' THEN 'mainMenu.supportCentre.title'
    END as module_translation_key,
    CASE m.module_name
        WHEN 'workforce-analytics' THEN '/workforce-analytics'
        WHEN 'enterprise-settings' THEN '/enterprise-settings'
        WHEN 'organization' THEN '/organization'
        WHEN 'employee-management' THEN '/employee-management'
        WHEN 'roster-management' THEN '/roster-management'
        WHEN 'self-services' THEN '/self-services'
        WHEN 'devices-infrastructure' THEN '/devices-infrastructure'
        WHEN 'user-security' THEN '/user-security'
        WHEN 'app-settings' THEN '/app-settings'
        WHEN 'alert-centre' THEN '/alert-centre'
        WHEN 'workforce' THEN '/workforce'
        WHEN 'support-centre' THEN '/support'
    END as module_route,
    CASE m.module_name
        WHEN 'workforce-analytics' THEN 'FiBarChart2'
        WHEN 'enterprise-settings' THEN 'FiLayers'
        WHEN 'organization' THEN 'FiMapPin'
        WHEN 'employee-management' THEN 'FiUsers'
        WHEN 'roster-management' THEN 'FiCalendar'
        WHEN 'self-services' THEN 'FiClock'
        WHEN 'devices-infrastructure' THEN 'FiCpu'
        WHEN 'user-security' THEN 'FiShield'
        WHEN 'app-settings' THEN 'FiSettings'
        WHEN 'alert-centre' THEN 'FiAlertCircle'
        WHEN 'workforce' THEN 'FiBriefcase'
        WHEN 'support-centre' THEN 'FiHelpCircle'
    END as module_icon,
    CASE m.module_name
        WHEN 'workforce-analytics' THEN 1
        WHEN 'enterprise-settings' THEN 2
        WHEN 'organization' THEN 3
        WHEN 'employee-management' THEN 4
        WHEN 'roster-management' THEN 5
        WHEN 'self-services' THEN 6
        WHEN 'devices-infrastructure' THEN 7
        WHEN 'user-security' THEN 8
        WHEN 'app-settings' THEN 9
        WHEN 'alert-centre' THEN 10
        WHEN 'workforce' THEN 11
        WHEN 'support-centre' THEN 12
    END as display_order,
    CASE m.module_name
        WHEN 'workforce-analytics' THEN 0
        WHEN 'enterprise-settings' THEN 0
        WHEN 'organization' THEN 0
        WHEN 'employee-management' THEN 0
        WHEN 'roster-management' THEN 0
        WHEN 'self-services' THEN 0
        ELSE 1
    END as is_sidebar_menu,
    CASE m.module_name
        WHEN 'support-centre' THEN 1
        ELSE 0
    END as is_footer_menu,
    sm.sub_module_id,
    sm.sub_module_name,
    -- Sub-module translation keys mapping
    CASE 
        -- Workforce Analytics
        WHEN sm.sub_module_name = 'my-insights' THEN 'mainMenu.workforceAnalytics.items.myInsights'
        WHEN sm.sub_module_name = 'team-insights' THEN 'mainMenu.workforceAnalytics.items.teamInsights'
        WHEN sm.sub_module_name = 'activity-log' THEN 'mainMenu.workforceAnalytics.items.activityLog'
        WHEN sm.sub_module_name = 'productivity-metrics' THEN 'mainMenu.workforceAnalytics.items.productivityMetrics'
        WHEN sm.sub_module_name = 'geo-analytics' THEN 'mainMenu.workforceAnalytics.items.geoAnalytics'
        
        -- Enterprise Settings
        WHEN sm.sub_module_name = 'site-management' THEN 'mainMenu.enterpriseSettings.items.siteManagements'
        WHEN sm.sub_module_name = 'job-levels' THEN 'mainMenu.enterpriseSettings.items.jobLevels'
        WHEN sm.sub_module_name = 'job-titles' THEN 'mainMenu.enterpriseSettings.items.jobTitles'
        WHEN sm.sub_module_name = 'citizenship-info' THEN 'mainMenu.enterpriseSettings.items.citizenshipInfo'
        
        -- Organization
        WHEN sm.sub_module_name = 'organization-type' THEN 'mainMenu.organization.items.organizationType'
        WHEN sm.sub_module_name = 'org-chart' THEN 'mainMenu.organization.items.orgChart'
        WHEN sm.sub_module_name = 'organizations' THEN 'mainMenu.organization.items.organizations'
        WHEN sm.sub_module_name = 'dept-admins' THEN 'mainMenu.organization.items.deptAdmins'
        
        -- Add more mappings as needed...
        ELSE sm.sub_module_name
    END as submodule_translation_key,
    -- Sub-module routes
    CASE 
        WHEN sm.sub_module_name IS NOT NULL THEN 
            CASE m.module_name
                WHEN 'workforce-analytics' THEN '/workforce-analytics/' + sm.sub_module_name
                WHEN 'enterprise-settings' THEN '/enterprise-settings/' + sm.sub_module_name
                WHEN 'organization' THEN '/organization/' + sm.sub_module_name
                WHEN 'employee-management' THEN '/employee-management/' + sm.sub_module_name
                WHEN 'roster-management' THEN '/roster-management/' + sm.sub_module_name
                WHEN 'self-services' THEN '/self-services/' + sm.sub_module_name
                WHEN 'devices-infrastructure' THEN '/devices-infrastructure/' + sm.sub_module_name
                WHEN 'user-security' THEN '/user-security/' + sm.sub_module_name
                WHEN 'app-settings' THEN '/app-settings/' + sm.sub_module_name
                WHEN 'alert-centre' THEN '/alert-centre/' + sm.sub_module_name
                WHEN 'workforce' THEN '/workforce/' + sm.sub_module_name
                WHEN 'support-centre' THEN '/support/' + sm.sub_module_name
            END
    END as submodule_route
FROM sec_modules m
LEFT JOIN sec_sub_modules sm ON m.module_id = sm.module_id;
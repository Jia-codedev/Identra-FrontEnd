-- Create stored procedures for navigation based on user privileges
-- Note: This assumes you have a way to link modules to user permissions
-- You may need to adjust based on your actual privilege/permission system

-- Simple procedure to get all navigation (for testing without user privileges)
CREATE PROCEDURE GetAllNavigationMenu
AS
BEGIN
    SELECT DISTINCT
        vnm.module_id,
        vnm.module_name,
        vnm.module_translation_key,
        vnm.module_route,
        vnm.module_icon,
        vnm.display_order,
        vnm.is_sidebar_menu,
        vnm.is_footer_menu,
        vnm.sub_module_id,
        vnm.sub_module_name,
        vnm.submodule_translation_key,
        vnm.submodule_route
    FROM v_navigation_mapping vnm
    ORDER BY vnm.display_order, vnm.sub_module_name;
END;
GO

-- Procedure to get main navigation menu
CREATE PROCEDURE GetMainNavigationMenu
AS
BEGIN
    SELECT 
        vnm.module_id,
        vnm.module_name,
        vnm.module_translation_key,
        vnm.module_route,
        vnm.module_icon,
        vnm.display_order,
        STRING_AGG(
            CONCAT(vnm.sub_module_name, '|', vnm.submodule_translation_key, '|', vnm.submodule_route), 
            ';'
        ) as sub_modules
    FROM v_navigation_mapping vnm
    WHERE vnm.is_sidebar_menu = 0 AND vnm.is_footer_menu = 0
    GROUP BY vnm.module_id, vnm.module_name, vnm.module_translation_key, vnm.module_route, vnm.module_icon, vnm.display_order
    ORDER BY vnm.display_order;
END;
GO

-- Procedure to get sidebar menu
CREATE PROCEDURE GetSidebarMenu
AS
BEGIN
    SELECT 
        vnm.module_id,
        vnm.module_name,
        vnm.module_translation_key,
        vnm.module_route,
        vnm.module_icon,
        vnm.display_order,
        STRING_AGG(
            CONCAT(vnm.sub_module_name, '|', vnm.submodule_translation_key, '|', vnm.submodule_route), 
            ';'
        ) as sub_modules
    FROM v_navigation_mapping vnm
    WHERE vnm.is_sidebar_menu = 1
    GROUP BY vnm.module_id, vnm.module_name, vnm.module_translation_key, vnm.module_route, vnm.module_icon, vnm.display_order
    ORDER BY vnm.display_order;
END;
GO

-- Procedure to get footer menu
CREATE PROCEDURE GetFooterMenu
AS
BEGIN
    SELECT 
        vnm.module_id,
        vnm.module_name,
        vnm.module_translation_key,
        vnm.module_route,
        vnm.module_icon,
        vnm.display_order,
        STRING_AGG(
            CONCAT(vnm.sub_module_name, '|', vnm.submodule_translation_key, '|', vnm.submodule_route), 
            ';'
        ) as sub_modules
    FROM v_navigation_mapping vnm
    WHERE vnm.is_footer_menu = 1
    GROUP BY vnm.module_id, vnm.module_name, vnm.module_translation_key, vnm.module_route, vnm.module_icon, vnm.display_order
    ORDER BY vnm.display_order;
END;
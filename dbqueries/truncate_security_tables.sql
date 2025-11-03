-- Clear security tables in correct order due to foreign key constraints
-- Using DELETE with table existence checks to avoid errors

-- 1. First, delete from tables that reference sec_role_privileges
IF OBJECT_ID('sec_user_roles', 'U') IS NOT NULL
    DELETE FROM sec_user_roles;

-- 2. Then delete from sec_role_privileges (references sec_privileges and sec_roles)
IF OBJECT_ID('sec_role_privileges', 'U') IS NOT NULL
    DELETE FROM sec_role_privileges;

-- 3. Delete from sec_role_tab_privileges if it exists and has data
IF OBJECT_ID('sec_role_tab_privileges', 'U') IS NOT NULL
    DELETE FROM sec_role_tab_privileges;

-- 4. Delete from sec_tabs (if it references sec_sub_modules)
IF OBJECT_ID('sec_tabs', 'U') IS NOT NULL
    DELETE FROM sec_tabs;

-- 5. Delete from sec_privileges (references sec_modules)
IF OBJECT_ID('sec_privileges', 'U') IS NOT NULL
    DELETE FROM sec_privileges;

-- 6. Delete from sec_sub_modules (references sec_modules)
IF OBJECT_ID('sec_sub_modules', 'U') IS NOT NULL
    DELETE FROM sec_sub_modules;

-- 7. Delete from sec_roles (standalone table)
IF OBJECT_ID('sec_roles', 'U') IS NOT NULL
    DELETE FROM sec_roles;

-- 8. Delete from sec_modules (references sec_privilege_groups)
IF OBJECT_ID('sec_modules', 'U') IS NOT NULL
    DELETE FROM sec_modules;

-- 9. Finally, delete from sec_privilege_groups (parent table)
IF OBJECT_ID('sec_privilege_groups', 'U') IS NOT NULL
    DELETE FROM sec_privilege_groups;

-- Reset identity seeds if needed (only for existing tables)
IF OBJECT_ID('sec_privilege_groups', 'U') IS NOT NULL
    DBCC CHECKIDENT ('sec_privilege_groups', RESEED, 0);

IF OBJECT_ID('sec_modules', 'U') IS NOT NULL
    DBCC CHECKIDENT ('sec_modules', RESEED, 0);

IF OBJECT_ID('sec_sub_modules', 'U') IS NOT NULL
    DBCC CHECKIDENT ('sec_sub_modules', RESEED, 0);

IF OBJECT_ID('sec_privileges', 'U') IS NOT NULL
    DBCC CHECKIDENT ('sec_privileges', RESEED, 0);

IF OBJECT_ID('sec_roles', 'U') IS NOT NULL
    DBCC CHECKIDENT ('sec_roles', RESEED, 0);

IF OBJECT_ID('sec_role_privileges', 'U') IS NOT NULL
    DBCC CHECKIDENT ('sec_role_privileges', RESEED, 0);

IF OBJECT_ID('sec_user_roles', 'U') IS NOT NULL
    DBCC CHECKIDENT ('sec_user_roles', RESEED, 0);

IF OBJECT_ID('sec_tabs', 'U') IS NOT NULL
    DBCC CHECKIDENT ('sec_tabs', RESEED, 0);

IF OBJECT_ID('sec_role_tab_privileges', 'U') IS NOT NULL
    DBCC CHECKIDENT ('sec_role_tab_privileges', RESEED, 0);

PRINT 'All security tables truncated successfully!';
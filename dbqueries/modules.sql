-- Insert main navigation modules using existing sec_modules table
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
('organization', 1, GETDATE(), 1, GETDATE()),
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
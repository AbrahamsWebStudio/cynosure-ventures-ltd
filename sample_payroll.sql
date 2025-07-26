-- Sample Payroll Data for CYNOSURE VENTURES LTD

-- Sample Employees for Payroll
INSERT INTO employees (id, full_name, email, phone, role_id, created_at) VALUES
('emp-001', 'John Driver', 'john.driver@cynosure.com', '254700111111', 'role-001', NOW()),
('emp-002', 'Sarah Manager', 'sarah.manager@cynosure.com', '254700222222', 'role-002', NOW()),
('emp-003', 'Mike Mechanic', 'mike.mechanic@cynosure.com', '254700333333', 'role-003', NOW()),
('emp-004', 'Lisa Admin', 'lisa.admin@cynosure.com', '254700444444', 'role-002', NOW()),
('emp-005', 'David Supervisor', 'david.supervisor@cynosure.com', '254700555555', 'role-001', NOW()),
('emp-006', 'Emma Accountant', 'emma.accountant@cynosure.com', '254700666666', 'role-004', NOW()),
('emp-007', 'James Operator', 'james.operator@cynosure.com', '254700777777', 'role-003', NOW()),
('emp-008', 'Maria Coordinator', 'maria.coordinator@cynosure.com', '254700888888', 'role-002', NOW()),
('emp-009', 'Robert Technician', 'robert.technician@cynosure.com', '254700999999', 'role-003', NOW()),
('emp-010', 'Anna Assistant', 'anna.assistant@cynosure.com', '254700000000', 'role-001', NOW());

-- Sample Roles (if not exists)
INSERT INTO roles (id, name, description, created_at) VALUES
('role-001', 'Driver', 'Vehicle driver and transport operator', NOW()),
('role-002', 'Manager', 'Department manager and supervisor', NOW()),
('role-003', 'Technician', 'Vehicle maintenance and repair', NOW()),
('role-004', 'Accountant', 'Financial management and reporting', NOW())
ON CONFLICT (id) DO NOTHING;

-- Sample Payroll Entries (Pending)
INSERT INTO payroll (employee_id, amount, status, created_at) VALUES
('emp-001', 25000, 'pending', NOW() - INTERVAL '5 days'),
('emp-002', 45000, 'pending', NOW() - INTERVAL '4 days'),
('emp-003', 30000, 'pending', NOW() - INTERVAL '3 days'),
('emp-004', 35000, 'pending', NOW() - INTERVAL '2 days'),
('emp-005', 28000, 'pending', NOW() - INTERVAL '1 day'),
('emp-006', 40000, 'pending', NOW()),
('emp-007', 22000, 'pending', NOW()),
('emp-008', 38000, 'pending', NOW()),
('emp-009', 32000, 'pending', NOW()),
('emp-010', 20000, 'pending', NOW());

-- Sample Payroll Entries (Paid)
INSERT INTO payroll (employee_id, amount, status, paid_at, created_at) VALUES
('emp-001', 25000, 'paid', NOW() - INTERVAL '30 days', NOW() - INTERVAL '35 days'),
('emp-002', 45000, 'paid', NOW() - INTERVAL '30 days', NOW() - INTERVAL '35 days'),
('emp-003', 30000, 'paid', NOW() - INTERVAL '30 days', NOW() - INTERVAL '35 days'),
('emp-004', 35000, 'paid', NOW() - INTERVAL '30 days', NOW() - INTERVAL '35 days'),
('emp-005', 28000, 'paid', NOW() - INTERVAL '30 days', NOW() - INTERVAL '35 days'),
('emp-006', 40000, 'paid', NOW() - INTERVAL '30 days', NOW() - INTERVAL '35 days'),
('emp-007', 22000, 'paid', NOW() - INTERVAL '30 days', NOW() - INTERVAL '35 days'),
('emp-008', 38000, 'paid', NOW() - INTERVAL '30 days', NOW() - INTERVAL '35 days'),
('emp-009', 32000, 'paid', NOW() - INTERVAL '30 days', NOW() - INTERVAL '35 days'),
('emp-010', 20000, 'paid', NOW() - INTERVAL '30 days', NOW() - INTERVAL '35 days');

-- Display payroll summary
SELECT 
  'Payroll Summary' as info,
  COUNT(*) as count,
  'total payroll entries' as description
FROM payroll
UNION ALL
SELECT 
  'Pending Payroll' as info,
  COUNT(*) as count,
  'entries awaiting payment' as description
FROM payroll WHERE status = 'pending'
UNION ALL
SELECT 
  'Paid Payroll' as info,
  COUNT(*) as count,
  'completed payments' as description
FROM payroll WHERE status = 'paid'
UNION ALL
SELECT 
  'Total Amount' as info,
  SUM(amount) as count,
  'KES in payroll system' as description
FROM payroll; 
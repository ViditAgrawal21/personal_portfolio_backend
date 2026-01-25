-- ========================================
-- SEED DATA FOR DEVELOPMENT/TESTING
-- ========================================

-- Clear existing data
TRUNCATE admin_users, service_inquiries, hire_requests CASCADE;

-- ========================================
-- SEED: Admin Users
-- ========================================
-- Password for all: Admin@123
-- Generate new hash: bcrypt.hash('Admin@123', 10)

INSERT INTO admin_users (email, password_hash, role) VALUES
('superadmin@portfolio.com', '$2b$10$YourActualBcryptHashHere', 'super_admin'),
('admin@portfolio.com', '$2b$10$YourActualBcryptHashHere', 'admin'),
('viewer@portfolio.com', '$2b$10$YourActualBcryptHashHere', 'viewer');

-- ========================================
-- SEED: Service Inquiries
-- ========================================

INSERT INTO service_inquiries (client_name, email, service_type, budget_range, requirements, status) VALUES
('Acme Corp', 'contact@acmecorp.com', 'Web Development', '$5k-$10k', 'Need a modern e-commerce platform with payment integration', 'new'),
('TechStart Inc', 'hello@techstart.io', 'Mobile App', '$10k-$25k', 'iOS and Android app for fitness tracking with social features', 'in_progress'),
('Global Solutions', 'info@globalsolutions.com', 'API Development', '$3k-$5k', 'RESTful API for inventory management system', 'contacted'),
('Design Studio', 'studio@design.co', 'Full Stack', '$15k-$30k', 'Portfolio website with CMS and admin dashboard', 'new'),
('Finance Plus', 'dev@financeplus.com', 'Consulting', '$2k-$5k', 'Code review and architecture consultation', 'converted');

-- ========================================
-- SEED: Hire Requests
-- ========================================

INSERT INTO hire_requests (project_name, tech_stack, email, message, status) VALUES
('SaaS Dashboard', '["React", "Node.js", "PostgreSQL", "AWS"]', 'founder@saasproject.com', 'Looking for a full-stack developer to build our analytics dashboard. Timeline: 3 months.', 'new'),
('Healthcare App', '["React Native", "Firebase", "TypeScript"]', 'cto@healthtech.com', 'Need mobile development expertise for HIPAA-compliant health tracking app.', 'reviewing'),
('E-learning Platform', '["Next.js", "Prisma", "Supabase", "Tailwind"]', 'team@edutech.io', 'Building online course platform, need help with video streaming and payment integration.', 'accepted'),
('Blockchain Wallet', '["Solidity", "Web3.js", "React", "Hardhat"]', 'crypto@blockchain.dev', 'DeFi wallet development with multi-chain support. 6-month contract.', 'new'),
('Social Network', '["Vue.js", "NestJS", "MongoDB", "Redis"]', 'startup@social.app', 'Social media platform for professionals. Looking for senior backend engineer.', 'declined');

-- ========================================
-- Add some timestamps variation
-- ========================================

UPDATE service_inquiries SET created_at = NOW() - INTERVAL '5 days' WHERE client_name = 'Acme Corp';
UPDATE service_inquiries SET created_at = NOW() - INTERVAL '3 days' WHERE client_name = 'TechStart Inc';
UPDATE service_inquiries SET created_at = NOW() - INTERVAL '1 day' WHERE client_name = 'Global Solutions';

UPDATE hire_requests SET created_at = NOW() - INTERVAL '7 days' WHERE project_name = 'SaaS Dashboard';
UPDATE hire_requests SET created_at = NOW() - INTERVAL '4 days' WHERE project_name = 'Healthcare App';
UPDATE hire_requests SET created_at = NOW() - INTERVAL '2 days' WHERE project_name = 'E-learning Platform';

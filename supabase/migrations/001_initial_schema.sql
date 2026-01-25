-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE inquiry_status AS ENUM ('new', 'in_progress', 'contacted', 'converted', 'rejected');
CREATE TYPE hire_status AS ENUM ('new', 'reviewing', 'accepted', 'declined');
CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'viewer');

-- ========================================
-- TABLE: admin_users
-- ========================================
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role admin_role DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- ========================================
-- TABLE: service_inquiries
-- ========================================
CREATE TABLE service_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    budget_range VARCHAR(50),
    requirements TEXT NOT NULL,
    status inquiry_status DEFAULT 'new',
    internal_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for filtering and sorting
CREATE INDEX idx_service_inquiries_status ON service_inquiries(status);
CREATE INDEX idx_service_inquiries_created_at ON service_inquiries(created_at DESC);
CREATE INDEX idx_service_inquiries_email ON service_inquiries(email);

-- ========================================
-- TABLE: hire_requests
-- ========================================
CREATE TABLE hire_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name VARCHAR(255) NOT NULL,
    tech_stack JSONB NOT NULL DEFAULT '[]',
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status hire_status DEFAULT 'new',
    internal_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for filtering and sorting
CREATE INDEX idx_hire_requests_status ON hire_requests(status);
CREATE INDEX idx_hire_requests_created_at ON hire_requests(created_at DESC);
CREATE INDEX idx_hire_requests_email ON hire_requests(email);
CREATE INDEX idx_hire_requests_tech_stack ON hire_requests USING GIN (tech_stack);

-- ========================================
-- TRIGGERS: Auto-update updated_at
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_inquiries_updated_at
    BEFORE UPDATE ON service_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hire_requests_updated_at
    BEFORE UPDATE ON hire_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SEED: Create initial admin user
-- Password: Admin@123 (CHANGE THIS IMMEDIATELY!)
-- ========================================
INSERT INTO admin_users (email, password_hash, role) VALUES
('admin@portfolio.com', '$2b$10$rGv5K7HqL8QmXx8K7YFvxO9F3qY.xGWJZy1YK5L8L5L5L5L5L5L5L', 'super_admin');

-- Note: The password hash above is a placeholder. 
-- You'll need to generate a real bcrypt hash and update this.

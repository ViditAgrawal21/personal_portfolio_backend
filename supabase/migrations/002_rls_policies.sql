-- ========================================
-- ROW LEVEL SECURITY POLICIES
-- ========================================

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE hire_requests ENABLE ROW LEVEL SECURITY;

-- ========================================
-- ADMIN_USERS POLICIES
-- ========================================

-- Only authenticated users can read their own data
CREATE POLICY "Admins can read their own data"
    ON admin_users FOR SELECT
    TO authenticated
    USING (auth.uid()::text = id::text);

-- Only super_admins can insert new admins
CREATE POLICY "Super admins can create admins"
    ON admin_users FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id::text = auth.uid()::text
            AND role = 'super_admin'
        )
    );

-- Admins can update their own profile
CREATE POLICY "Admins can update own profile"
    ON admin_users FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = id::text);

-- ========================================
-- SERVICE_INQUIRIES POLICIES
-- ========================================

-- Public can INSERT (submit inquiries)
CREATE POLICY "Public can submit inquiries"
    ON service_inquiries FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Authenticated admins can SELECT all inquiries
CREATE POLICY "Admins can read all inquiries"
    ON service_inquiries FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id::text = auth.uid()::text
        )
    );

-- Admins (not viewers) can UPDATE inquiries
CREATE POLICY "Admins can update inquiries"
    ON service_inquiries FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id::text = auth.uid()::text
            AND role IN ('super_admin', 'admin')
        )
    );

-- Super admins can DELETE inquiries
CREATE POLICY "Super admins can delete inquiries"
    ON service_inquiries FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id::text = auth.uid()::text
            AND role = 'super_admin'
        )
    );

-- ========================================
-- HIRE_REQUESTS POLICIES
-- ========================================

-- Public can INSERT (submit hire requests)
CREATE POLICY "Public can submit hire requests"
    ON hire_requests FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Authenticated admins can SELECT all hire requests
CREATE POLICY "Admins can read all hire requests"
    ON hire_requests FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id::text = auth.uid()::text
        )
    );

-- Admins (not viewers) can UPDATE hire requests
CREATE POLICY "Admins can update hire requests"
    ON hire_requests FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id::text = auth.uid()::text
            AND role IN ('super_admin', 'admin')
        )
    );

-- Super admins can DELETE hire requests
CREATE POLICY "Super admins can delete hire requests"
    ON hire_requests FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id::text = auth.uid()::text
            AND role = 'super_admin'
        )
    );

-- ========================================
-- HELPER FUNCTIONS
-- ========================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE id::text = auth.uid()::text
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION has_role(required_role admin_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE id::text = auth.uid()::text
        AND role = required_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

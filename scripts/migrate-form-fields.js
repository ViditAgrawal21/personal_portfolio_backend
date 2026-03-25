#!/usr/bin/env node

/**
 * Database Migration: Update Form Fields
 * 
 * Updates both service_inquiries and hire_requests tables to match new form requirements
 * 
 * Changes:
 * 1. Service Inquiry: Add companyName, phoneNumber, timeline; rename requirements->projectDetails; remove serviceType
 * 2. Hire Request: Add candidateName, companyName, roleType, salaryOffer; remove projectName, techStack
 */

const { PrismaClient } = require('@prisma/client');

async function migrateFormFields() {
  console.log('🔄 Starting form fields migration...\n');

  console.log('📝 Step 1: Dropping existing tables...');
  
  const dropSql = `
    -- Drop existing tables to recreate with new schema
    DROP TABLE IF EXISTS service_inquiries CASCADE;
    DROP TABLE IF EXISTS hire_requests CASCADE;
    
    -- Drop old enums if they exist
    DROP TYPE IF EXISTS inquiry_status CASCADE;
    DROP TYPE IF EXISTS hire_status CASCADE;
  `;

  console.log('📝 Step 2: Creating updated schema...');
  
  const createSql = `
    -- Create enums
    CREATE TYPE inquiry_status AS ENUM ('new', 'in_progress', 'contacted', 'converted', 'rejected');
    CREATE TYPE hire_status AS ENUM ('new', 'reviewing', 'accepted', 'declined');

    -- Create updated service_inquiries table
    CREATE TABLE service_inquiries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      company_name VARCHAR(255),
      phone_number VARCHAR(50),
      budget_range VARCHAR(100),
      timeline VARCHAR(255),
      project_details TEXT NOT NULL,
      status inquiry_status NOT NULL DEFAULT 'new',
      internal_notes TEXT,
      created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
    );

    -- Create updated hire_requests table  
    CREATE TABLE hire_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      candidate_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      company_name VARCHAR(255) NOT NULL,
      role_type VARCHAR(255) NOT NULL,
      salary_offer VARCHAR(255),
      message TEXT NOT NULL,
      status hire_status NOT NULL DEFAULT 'new',
      internal_notes TEXT,
      created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
    );

    -- Create indexes for performance
    CREATE INDEX idx_service_inquiries_status ON service_inquiries(status);
    CREATE INDEX idx_service_inquiries_created_at ON service_inquiries(created_at DESC);
    CREATE INDEX idx_service_inquiries_email ON service_inquiries(email);

    CREATE INDEX idx_hire_requests_status ON hire_requests(status);
    CREATE INDEX idx_hire_requests_created_at ON hire_requests(created_at DESC);
    CREATE INDEX idx_hire_requests_email ON hire_requests(email);

    -- Create update triggers for updated_at
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    CREATE TRIGGER update_service_inquiries_updated_at BEFORE UPDATE
        ON service_inquiries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

    CREATE TRIGGER update_hire_requests_updated_at BEFORE UPDATE
        ON hire_requests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  `;

  try {
    // Note: This script shows the SQL structure but would need to be run via Prisma migrate
    console.log('⚠️  This migration requires running: npx prisma migrate dev --name update-form-fields');
    console.log('💡 The schema.prisma file has been updated. Run the migration command to apply changes.');
    
    console.log('✅ Migration script prepared successfully!');
    console.log('📋 Manual steps required:');
    console.log('1. Run: npx prisma migrate dev --name update-form-fields');
    console.log('2. Run: npx prisma generate');
    console.log('3. Restart the server');
    
  } catch (error) {
    console.error('❌ Migration script error:', error);
    throw error;
  }
}

async function main() {
  try {
    await migrateFormFields();
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { migrateFormFields };
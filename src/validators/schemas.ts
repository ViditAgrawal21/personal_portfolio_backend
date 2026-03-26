import { z } from 'zod';
import { config } from '../config';

// Only accept image URLs from Supabase Storage (uploaded via /api/admin/upload)
const supabaseImageUrl = z.string()
  .refine(
    (url) => url.startsWith(`${config.supabase.url}/storage/v1/object/public/`),
    'Only uploaded images are accepted. Use the /api/admin/upload endpoint first.'
  )
  .optional()
  .or(z.literal(''));

export const serviceInquirySchema = z.object({
  clientName: z
    .string()
    .min(2, 'Client name must be at least 2 characters')
    .max(255, 'Client name too long'),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email too long'),
  serviceType: z
    .string()
    .min(2, 'Service type must be at least 2 characters')
    .max(100, 'Service type too long')
    .optional(),
  companyName: z
    .string()
    .max(255, 'Company name too long')
    .optional(),
  phoneNumber: z
    .string()
    .max(50, 'Phone number too long')
    .optional(),
  budgetRange: z
    .string()
    .max(100, 'Budget range too long')
    .optional(),
  timeline: z
    .string()
    .max(255, 'Timeline too long')
    .optional(),
  projectDetails: z
    .string()
    .min(10, 'Project details must be at least 10 characters')
    .max(5000, 'Project details too long'),
});

export const hireRequestSchema = z.object({
  candidateName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name too long'),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email too long'),
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(255, 'Company name too long'),
  roleType: z
    .string()
    .min(2, 'Role type must be at least 2 characters')
    .max(255, 'Role type too long'),
  salaryOffer: z
    .string()
    .max(255, 'Salary offer too long')
    .optional(),
  location: z
    .string()
    .max(255, 'Location too long')
    .optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message too long'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const updateStatusSchema = z.object({
  status: z.enum(['new', 'in_progress', 'contacted', 'converted', 'rejected']),
  internalNotes: z.string().max(5000).optional(),
});

export const updateHireStatusSchema = z.object({
  status: z.enum(['new', 'reviewing', 'accepted', 'declined']),
  internalNotes: z.string().max(5000).optional(),
});

// =====================================================
// PORTFOLIO CONTENT SCHEMAS
// =====================================================

export const aboutSchema = z.object({
  fullName: z.string().min(2).max(255),
  title: z.string().min(2).max(255),
  bio: z.string().min(10).max(5000),
  email: z.string().email().max(255),
  phone: z.string().max(50).optional(),
  location: z.string().max(255).optional(),
  resumeUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  profileImageUrl: supabaseImageUrl,
  yearsOfExp: z.number().int().min(0).max(100).optional(),
});

export const serviceSchema = z.object({
  title: z.string().min(2).max(255),
  description: z.string().min(10).max(5000),
  icon: z.string().max(100).optional(),
  features: z.array(z.string()).optional(),
  pricing: z.string().max(100).optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const projectSchema = z.object({
  title: z.string().min(2).max(255),
  description: z.string().min(10).max(5000),
  techStack: z.array(z.string()).min(1, 'At least one technology required'),
  imageUrl: supabaseImageUrl,
  demoUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().max(100).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const techStackSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.string().min(2).max(100),
  icon: z.string().max(100).optional(),
  proficiency: z.number().int().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const experienceSchema = z.object({
  company: z.string().min(2).max(255),
  position: z.string().min(2).max(255),
  description: z.string().min(10).max(5000),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid start date',
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid end date',
  }).optional().or(z.literal('')),
  isCurrent: z.boolean().optional(),
  location: z.string().max(255).optional(),
  companyUrl: z.string().url().optional().or(z.literal('')),
  techUsed: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const educationSchema = z.object({
  institution: z.string().min(2).max(255),
  degree: z.string().min(2).max(255),
  field: z.string().min(2).max(255),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid start date',
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid end date',
  }).optional().or(z.literal('')),
  isCurrent: z.boolean().optional(),
  grade: z.string().max(50).optional(),
  location: z.string().max(255).optional(),
  description: z.string().max(5000).optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

// Reply Email Schema
export const replyEmailSchema = z.object({
  subject: z.string().min(3).max(500).optional(),
  message: z.string().min(10).max(5000, 'Message too long'),
});

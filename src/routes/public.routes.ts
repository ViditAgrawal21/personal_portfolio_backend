import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { publicApiRateLimiter } from '../middleware/rateLimiter.middleware';
import { serviceInquirySchema, hireRequestSchema } from '../validators/schemas';
import {
  createServiceInquiry,
  createHireRequest,
} from '../controllers/public.controller';

const router = Router();

// Public Routes - Service Inquiries
router.post(
  '/services/inquiry',
  publicApiRateLimiter,
  validate(serviceInquirySchema),
  createServiceInquiry
);

// Public Routes - Hire Requests
router.post(
  '/hire/request',
  publicApiRateLimiter,
  validate(hireRequestSchema),
  createHireRequest
);

export default router;

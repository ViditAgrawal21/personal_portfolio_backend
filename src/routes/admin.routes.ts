import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { authRateLimiter } from '../middleware/rateLimiter.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { 
  loginSchema, 
  updateStatusSchema, 
  updateHireStatusSchema,
  replyEmailSchema,
} from '../validators/schemas';
import {
  login,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  getHireRequests,
  getHireRequestById,
  updateHireRequestStatus,
  getStats,
  exportInquiriesCSV,
  exportHireRequestsCSV,
  exportInquiryPDF,
  exportHireRequestPDF,
  sendInquiryReply,
  sendHireRequestReply,
  upload,
  uploadFile,
  updateAvailabilityStatus,
} from '../controllers/admin.controller';

const router = Router();

// Admin Authentication
router.post('/login', authRateLimiter, validate(loginSchema), login);

// Admin - Service Inquiries
router.get('/inquiries', authenticate, getInquiries);
router.get('/inquiries/export/csv', authenticate, exportInquiriesCSV);
router.get('/inquiries/export/excel', authenticate, exportInquiriesCSV);
router.get('/inquiries/:id', authenticate, getInquiryById);
router.get('/inquiries/:id/pdf', authenticate, exportInquiryPDF);
router.patch(
  '/inquiry/:id/status',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  validate(updateStatusSchema),
  updateInquiryStatus
);

// Admin - Hire Requests
router.get('/hire-requests', authenticate, getHireRequests);
router.get('/hire-requests/export/csv', authenticate, exportHireRequestsCSV);
router.get('/hire-requests/export/excel', authenticate, exportHireRequestsCSV);
router.get('/hire-requests/:id', authenticate, getHireRequestById);
router.get('/hire-requests/:id/pdf', authenticate, exportHireRequestPDF);
router.patch(
  '/hire-request/:id/status',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  validate(updateHireStatusSchema),
  updateHireRequestStatus
);

// Admin - Statistics
router.get('/stats', authenticate, getStats);

// Admin - Send Reply Emails
router.post(
  '/inquiries/:id/reply',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  validate(replyEmailSchema),
  sendInquiryReply
);
router.post(
  '/hire-requests/:id/reply',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  validate(replyEmailSchema),
  sendHireRequestReply
);

// Admin - File Upload
router.post(
  '/upload',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  upload.single('file'),
  uploadFile
);

// Admin - Update Availability Status
router.patch(
  '/availability',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  updateAvailabilityStatus
);

export default router;

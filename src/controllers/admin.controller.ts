import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { logger } from '../utils/logger';
import { comparePassword, generateToken } from '../utils/auth';
import { sendReplyEmail } from '../services/notification.service';
import { supabase, STORAGE_BUCKET } from '../config/supabase';
import multer from 'multer';
import path from 'path';
import * as XLSX from 'xlsx';

// Configure multer with memory storage for Supabase uploads
const storage = multer.memoryStorage();

const fileFilter = (_req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      logger.warn('Login attempt with invalid email', { email });
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await comparePassword(password, admin.passwordHash);

    if (!isValidPassword) {
      logger.warn('Login attempt with invalid password', { email });
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken({
      userId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    logger.info('Admin login successful', { email, role: admin.role });

    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getInquiries = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where = status ? { status: status as any } : {};

    const [inquiries, total] = await Promise.all([
      prisma.serviceInquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.serviceInquiry.count({ where }),
    ]);

    res.json({
      success: true,
      data: inquiries,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
};

export const getInquiryById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const inquiry = await prisma.serviceInquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }

    res.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    logger.error('Error fetching inquiry:', error);
    res.status(500).json({ error: 'Failed to fetch inquiry' });
  }
};

export const updateInquiryStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, internalNotes } = req.body;

    // Map lowercase status to enum value
    const statusMap: Record<string, any> = {
      'new': 'NEW',
      'in_progress': 'IN_PROGRESS',
      'contacted': 'CONTACTED',
      'converted': 'CONVERTED',
      'rejected': 'REJECTED',
    };

    const inquiry = await prisma.serviceInquiry.update({
      where: { id },
      data: {
        status: statusMap[status],
        ...(internalNotes !== undefined && { internalNotes }),
      },
    });

    logger.info('Inquiry status updated', {
      id,
      status,
      updatedBy: req.user?.email,
    });

    res.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    logger.error('Error updating inquiry:', error);
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
};

export const getHireRequests = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where = status ? { status: status as any } : {};

    const [requests, total] = await Promise.all([
      prisma.hireRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.hireRequest.count({ where }),
    ]);

    res.json({
      success: true,
      data: requests,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error('Error fetching hire requests:', error);
    res.status(500).json({ error: 'Failed to fetch hire requests' });
  }
};

export const getHireRequestById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const request = await prisma.hireRequest.findUnique({
      where: { id },
    });

    if (!request) {
      res.status(404).json({ error: 'Hire request not found' });
      return;
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    logger.error('Error fetching hire request:', error);
    res.status(500).json({ error: 'Failed to fetch hire request' });
  }
};

export const updateHireRequestStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, internalNotes } = req.body;

    // Map lowercase status to enum value
    const statusMap: Record<string, any> = {
      'new': 'NEW',
      'reviewing': 'REVIEWING',
      'accepted': 'ACCEPTED',
      'declined': 'DECLINED',
    };

    const request = await prisma.hireRequest.update({
      where: { id },
      data: {
        status: statusMap[status],
        ...(internalNotes !== undefined && { internalNotes }),
      },
    });

    logger.info('Hire request status updated', {
      id,
      status,
      updatedBy: req.user?.email,
    });

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    logger.error('Error updating hire request:', error);
    res.status(500).json({ error: 'Failed to update hire request' });
  }
};

export const getStats = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const [
      totalInquiries,
      totalHireRequests,
      inquiriesByStatus,
      hireRequestsByStatus,
      recentInquiries,
      recentHireRequests,
    ] = await Promise.all([
      prisma.serviceInquiry.count(),
      prisma.hireRequest.count(),
      prisma.serviceInquiry.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.hireRequest.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.serviceInquiry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          clientName: true,
          companyName: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.hireRequest.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          candidateName: true,
          companyName: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalInquiries,
          totalHireRequests,
          total: totalInquiries + totalHireRequests,
        },
        inquiries: {
          byStatus: inquiriesByStatus.reduce((acc, item) => {
            acc[item.status] = item._count;
            return acc;
          }, {} as Record<string, number>),
          recent: recentInquiries,
        },
        hireRequests: {
          byStatus: hireRequestsByStatus.reduce((acc, item) => {
            acc[item.status] = item._count;
            return acc;
          }, {} as Record<string, number>),
          recent: recentHireRequests,
        },
      },
    });
  } catch (error) {
    logger.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

export const exportInquiriesCSV = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const inquiries = await prisma.serviceInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const data = inquiries.map((inquiry) => ({
      'ID': inquiry.id,
      'Client Name': inquiry.clientName,
      'Email': inquiry.email,
      'Company Name': inquiry.companyName || 'Not specified',
      'Phone Number': inquiry.phoneNumber || '',
      'Service Type': inquiry.serviceType || '',
      'Budget Range': inquiry.budgetRange || '',
      'Timeline': inquiry.timeline || '',
      'Project Details': inquiry.projectDetails || '',
      'Status': inquiry.status,
      'Internal Notes': inquiry.internalNotes || '',
      'Created At': inquiry.createdAt.toISOString().split('T')[0],
      'Updated At': inquiry.updatedAt.toISOString().split('T')[0],
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Auto-fit column widths
    const colWidths = Object.keys(data[0] || {}).map((key) => ({
      wch: Math.max(key.length, ...data.map((row: any) => String(row[key] || '').length)).toString().length > 40 ? 40 : Math.max(key.length + 2, ...data.map((row: any) => String(row[key] || '').substring(0, 40).length + 2)),
    }));
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Service Inquiries');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    const date = new Date().toISOString().split('T')[0];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=service-inquiries-${date}.xlsx`);
    res.send(Buffer.from(buffer));
  } catch (error) {
    logger.error('Error exporting inquiries:', error);
    res.status(500).json({ error: 'Failed to export inquiries' });
  }
};

export const exportHireRequestsCSV = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const requests = await prisma.hireRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const data = requests.map((request) => ({
      'ID': request.id,
      'Project Name': request.project_name || '',
      'Candidate Name': request.candidateName || '',
      'Company Name': request.companyName || '',
      'Email': request.email,
      'Role Type': request.roleType || '',
      'Tech Stack': Array.isArray(request.tech_stack) ? (request.tech_stack as string[]).join(', ') : '',
      'Salary Offer': request.salaryOffer || 'Not specified',
      'Location': request.location || '',
      'Message': request.message,
      'Status': request.status,
      'Internal Notes': request.internalNotes || '',
      'Created At': request.createdAt.toISOString().split('T')[0],
      'Updated At': request.updatedAt.toISOString().split('T')[0],
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Auto-fit column widths
    const colWidths = Object.keys(data[0] || {}).map((key) => ({
      wch: Math.max(key.length, ...data.map((row: any) => String(row[key] || '').length)).toString().length > 40 ? 40 : Math.max(key.length + 2, ...data.map((row: any) => String(row[key] || '').substring(0, 40).length + 2)),
    }));
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Hire Requests');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    const date = new Date().toISOString().split('T')[0];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=hire-requests-${date}.xlsx`);
    res.send(Buffer.from(buffer));
  } catch (error) {
    logger.error('Error exporting hire requests:', error);
    res.status(500).json({ error: 'Failed to export hire requests' });
  }
};

export const exportInquiryPDF = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const inquiry = await prisma.serviceInquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }

    // Generate simple HTML that can be printed as PDF
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Service Inquiry - ${inquiry.clientName}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
    .info-row { margin: 15px 0; }
    .label { font-weight: bold; color: #555; }
    .value { color: #333; }
    .section { margin: 30px 0; }
    .status { 
      display: inline-block;
      padding: 5px 10px;
      border-radius: 4px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .status-new { background-color: #e3f2fd; color: #1976d2; }
    .status-in_progress { background-color: #fff3e0; color: #f57c00; }
    .status-contacted { background-color: #f3e5f5; color: #7b1fa2; }
    .status-converted { background-color: #e8f5e9; color: #388e3c; }
    .status-rejected { background-color: #ffebee; color: #c62828; }
    .requirements { 
      background-color: #f5f5f5; 
      padding: 20px; 
      border-radius: 8px;
      white-space: pre-wrap;
      line-height: 1.6;
    }
    .footer { margin-top: 50px; text-align: center; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <h1>Service Inquiry Details</h1>
  
  <div class="section">
    <div class="info-row">
      <span class="label">Inquiry ID:</span>
      <span class="value">${inquiry.id}</span>
    </div>
    <div class="info-row">
      <span class="label">Status:</span>
      <span class="status status-${inquiry.status}">${inquiry.status.replace('_', ' ')}</span>
    </div>
    <div class="info-row">
      <span class="label">Received:</span>
      <span class="value">${inquiry.createdAt.toLocaleString()}</span>
    </div>
  </div>

  <div class="section">
    <h2>Client Information</h2>
    <div class="info-row">
      <span class="label">Name:</span>
      <span class="value">${inquiry.clientName}</span>
    </div>
    <div class="info-row">
      <span class="label">Email:</span>
      <span class="value">${inquiry.email}</span>
    </div>
  </div>

  <div class="section">
    <h2>Service Details</h2>
    <div class="info-row">
      <span class="label">Company:</span>
      <span class="value">${inquiry.companyName || 'Not specified'}</span>
    </div>
    <div class="info-row">
      <span class="label">Phone Number:</span>
      <span class="value">${inquiry.phoneNumber || 'Not specified'}</span>
    </div>
    <div class="info-row">
      <span class="label">Budget Range:</span>
      <span class="value">${inquiry.budgetRange || 'Not specified'}</span>
    </div>
    <div class="info-row">
      <span class="label">Timeline:</span>
      <span class="value">${inquiry.timeline || 'Not specified'}</span>
    </div>
  </div>

  <div class="section">
    <h2>Project Details</h2>
    <div class="requirements">${inquiry.projectDetails}</div>
  </div>

  ${inquiry.internalNotes ? `
  <div class="section">
    <h2>Internal Notes</h2>
    <div class="requirements">${inquiry.internalNotes}</div>
  </div>
  ` : ''}

  <div class="footer">
    Generated on ${new Date().toLocaleString()} | Portfolio Admin Panel
  </div>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `inline; filename=inquiry-${inquiry.id}.html`);
    res.send(html);
  } catch (error) {
    logger.error('Error generating inquiry PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

export const exportHireRequestPDF = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const request = await prisma.hireRequest.findUnique({
      where: { id },
    });

    if (!request) {
      res.status(404).json({ error: 'Hire request not found' });
      return;
    }

    // Generate simple HTML that can be printed as PDF
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset=\"UTF-8\">
  <title>Hire Request - ${request.candidateName}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px; }
    .info-row { margin: 15px 0; }
    .label { font-weight: bold; color: #555; }
    .value { color: #333; }
    .section { margin: 30px 0; }
    .status { 
      display: inline-block;
      padding: 5px 10px;
      border-radius: 4px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .status-new { background-color: #e3f2fd; color: #1976d2; }
    .status-reviewing { background-color: #fff3e0; color: #f57c00; }
    .status-accepted { background-color: #e8f5e9; color: #388e3c; }
    .status-declined { background-color: #ffebee; color: #c62828; }
    .message { 
      background-color: #f5f5f5; 
      padding: 20px; 
      border-radius: 8px;
      white-space: pre-wrap;
      line-height: 1.6;
    }
    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }
    .tech-badge {
      background-color: #007bff;
      color: white;
      padding: 5px 12px;
      border-radius: 4px;
      font-size: 14px;
    }
    .footer { margin-top: 50px; text-align: center; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <h1>Hire Request Details</h1>
  
  <div class="section">
    <div class="info-row">
      <span class="label">Request ID:</span>
      <span class="value">${request.id}</span>
    </div>
    <div class="info-row">
      <span class="label">Status:</span>
      <span class="status status-${request.status}">${request.status.replace('_', ' ')}</span>
    </div>
    <div class="info-row">
      <span class="label">Received:</span>
      <span class="value">${request.createdAt.toLocaleString()}</span>
    </div>
  </div>

  <div class="section">
    <h2>Contact Information</h2>
    <div class="info-row">
      <span class="label">Candidate Name:</span>
      <span class="value">${request.candidateName}</span>
    </div>
    <div class="info-row">
      <span class="label">Company:</span>
      <span class="value">${request.companyName}</span>
    </div>
    <div class="info-row">
      <span class="label">Client Email:</span>
      <span class="value">${request.email}</span>
    </div>
  </div>

  <div class="section">
    <h2>Position Details</h2>
    <div class="info-row">
      <span class="label">Role Type:</span>
      <span class="value">${request.roleType}</span>
    </div>
    <div class="info-row">
      <span class="label">Salary Offer:</span>
      <span class="value">${request.salaryOffer || 'Not specified'}</span>
    </div>
  </div>

  <div class="section">
    <h2>Project Description</h2>
    <div class="message">${request.message}</div>
  </div>

  ${request.internalNotes ? `
  <div class="section">
    <h2>Internal Notes</h2>
    <div class="message">${request.internalNotes}</div>
  </div>
  ` : ''}

  <div class="footer">
    Generated on ${new Date().toLocaleString()} | Portfolio Admin Panel
  </div>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `inline; filename=hire-request-${request.id}.html`);
    res.send(html);
  } catch (error) {
    logger.error('Error generating hire request PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

// =====================================================
// SEND REPLY EMAILS
// =====================================================

export const sendInquiryReply = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;

    // Get the inquiry
    const inquiry = await prisma.serviceInquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      res.status(404).json({ success: false, error: 'Inquiry not found' });
      return;
    }

    // Send reply email
    await sendReplyEmail({
      to: inquiry.email,
      subject: subject || `Re: Your Service Inquiry - Project Details`,
      message,
      clientName: inquiry.clientName,
    });

    // Update status to contacted if it was new
    if (inquiry.status === 'NEW') {
      await prisma.serviceInquiry.update({
        where: { id },
        data: { status: 'CONTACTED' },
      });
    }

    logger.info('Reply sent to service inquiry', { inquiryId: id });
    res.json({ success: true, message: 'Reply sent successfully' });
  } catch (error) {
    logger.error('Error sending inquiry reply:', error);
    res.status(500).json({ success: false, error: 'Failed to send reply' });
  }
};

export const sendHireRequestReply = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;

    // Get the hire request
    const request = await prisma.hireRequest.findUnique({
      where: { id },
    });

    if (!request) {
      res.status(404).json({ success: false, error: 'Hire request not found' });
      return;
    }

    // Use candidate name or extract from email as fallback
    const clientName = request.candidateName || request.email.split('@')[0];

    // Send reply email
    await sendReplyEmail({
      to: request.email,
      subject: subject || `Re: Your Hire Request - ${request.roleType}`,
      message,
      clientName,
    });

    // Update status to reviewing if it was new
    if (request.status === 'NEW') {
      await prisma.hireRequest.update({
        where: { id },
        data: { status: 'REVIEWING' },
      });
    }

    logger.info('Reply sent to hire request', { requestId: id });
    res.json({ success: true, message: 'Reply sent successfully' });
  } catch (error) {
    logger.error('Error sending hire request reply:', error);
    res.status(500).json({ success: false, error: 'Failed to send reply' });
  }
};

// File Upload Controller
export const uploadFile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
      return;
    }

    const ext = path.extname(req.file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    const filePath = `uploads/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      logger.error('Supabase storage upload error:', uploadError);
      res.status(500).json({ success: false, error: 'Failed to upload file' });
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    const fileUrl = publicUrlData.publicUrl;
    
    logger.info('File uploaded successfully', {
      filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: fileUrl,
    });

    res.json({
      success: true,
      data: {
        url: fileUrl,
        filename,
        originalName: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    logger.error('Error uploading file:', error);
    res.status(500).json({ success: false, error: 'Failed to upload file' });
  }
};

// Update Availability Status
export const updateAvailabilityStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { isAvailable, availabilityStatus, hourlyRate } = req.body;

    const about = await prisma.about.findFirst();
    
    if (!about) {
      res.status(404).json({ 
        success: false, 
        error: 'Profile not found' 
      });
      return;
    }

    const updatedAbout = await prisma.about.update({
      where: { id: about.id },
      data: {
        ...(isAvailable !== undefined && { isAvailable }),
        ...(availabilityStatus !== undefined && { availabilityStatus }),
        ...(hourlyRate !== undefined && { hourlyRate }),
        updatedAt: new Date(),
      },
    });

    logger.info('Availability status updated', {
      isAvailable,
      availabilityStatus,
      hourlyRate,
      updatedBy: req.user?.email,
    });

    res.json({
      success: true,
      data: updatedAbout,
    });
  } catch (error) {
    logger.error('Error updating availability status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update availability status' 
    });
  }
};

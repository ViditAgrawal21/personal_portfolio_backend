import { Request, Response } from 'express';
import prisma from '../config/database';
import { logger } from '../utils/logger';
import { sendInquiryNotification, sendHireRequestNotification } from '../services/notification.service';

export const createServiceInquiry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { 
      clientName, 
      email, 
      serviceType,
      companyName, 
      phoneNumber, 
      budgetRange, 
      timeline, 
      projectDetails 
    } = req.body;

    const inquiry = await prisma.serviceInquiry.create({
      data: {
        clientName,
        email,
        serviceType,
        companyName,
        phoneNumber,
        budgetRange,
        timeline,
        projectDetails,
        status: 'NEW',
      },
    });

    logger.info('New service inquiry created', { id: inquiry.id, email });

    // Send notifications asynchronously (don't wait)
    sendInquiryNotification(inquiry).catch((error) => {
      logger.error('Failed to send inquiry notification:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Service inquiry submitted successfully',
      data: {
        id: inquiry.id,
        createdAt: inquiry.createdAt,
      },
    });
  } catch (error) {
    logger.error('Error creating service inquiry:', error);
    res.status(500).json({
      error: 'Failed to submit inquiry',
      message: 'An error occurred while processing your request',
    });
  }
};

export const createHireRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { 
      candidateName, 
      email, 
      companyName, 
      roleType, 
      salaryOffer, 
      location,
      message 
    } = req.body;

    const hireRequest = await prisma.hireRequest.create({
      data: {
        candidateName,
        email,
        companyName,
        roleType,
        salaryOffer,
        location,
        message,
        status: 'NEW',
      },
    });

    logger.info('New hire request created', { id: hireRequest.id, email });

    // Send notifications asynchronously (don't wait)
    sendHireRequestNotification(hireRequest).catch((error) => {
      logger.error('Failed to send hire request notification:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Hire request submitted successfully',
      data: {
        id: hireRequest.id,
        createdAt: hireRequest.createdAt,
      },
    });
  } catch (error) {
    logger.error('Error creating hire request:', error);
    res.status(500).json({
      error: 'Failed to submit hire request',
      message: 'An error occurred while processing your request',
    });
  }
};

import { Request, Response } from 'express';
import prisma from '../config/database';
import { logger } from '../utils/logger';

// =====================================================
// PUBLIC CONTENT API
// Fetch portfolio content for public display
// =====================================================

export const getAbout = async (_req: Request, res: Response) => {
  try {
    const about = await prisma.about.findFirst();
    res.json({ success: true, data: about });
  } catch (error) {
    logger.error('Error fetching about:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch about section' });
  }
};

export const getServices = async (_req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        icon: true,
        features: true,
        pricing: true,
        displayOrder: true,
      },
    });
    res.json({ success: true, data: services });
  } catch (error) {
    logger.error('Error fetching services:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch services' });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { featured, category } = req.query;
    
    const where: any = { isActive: true };
    if (featured === 'true') {
      where.isFeatured = true;
    }
    if (category) {
      where.category = category;
    }
    
    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }],
      select: {
        id: true,
        title: true,
        description: true,
        techStack: true,
        imageUrl: true,
        demoUrl: true,
        githubUrl: true,
        category: true,
        isFeatured: true,
        displayOrder: true,
      },
    });
    
    res.json({ success: true, data: projects });
  } catch (error) {
    logger.error('Error fetching projects:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
};

export const getTechStack = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    const where: any = { isActive: true };
    if (category) {
      where.category = category;
    }
    
    const techStack = await prisma.techStack.findMany({
      where,
      orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }],
      select: {
        id: true,
        name: true,
        category: true,
        icon: true,
        proficiency: true,
        displayOrder: true,
      },
    });
    
    res.json({ success: true, data: techStack });
  } catch (error) {
    logger.error('Error fetching tech stack:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch tech stack' });
  }
};

export const getExperience = async (_req: Request, res: Response) => {
  try {
    const experience = await prisma.experience.findMany({
      where: { isActive: true },
      orderBy: [{ startDate: 'desc' }, { displayOrder: 'asc' }],
      select: {
        id: true,
        company: true,
        position: true,
        description: true,
        startDate: true,
        endDate: true,
        isCurrent: true,
        location: true,
        companyUrl: true,
        techUsed: true,
        displayOrder: true,
      },
    });
    
    res.json({ success: true, data: experience });
  } catch (error) {
    logger.error('Error fetching experience:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch experience' });
  }
};

export const getEducation = async (_req: Request, res: Response) => {
  try {
    const education = await prisma.education.findMany({
      where: { isActive: true },
      orderBy: [{ startDate: 'desc' }, { displayOrder: 'asc' }],
      select: {
        id: true,
        institution: true,
        degree: true,
        field: true,
        startDate: true,
        endDate: true,
        isCurrent: true,
        grade: true,
        location: true,
        description: true,
        displayOrder: true,
      },
    });
    
    res.json({ success: true, data: education });
  } catch (error) {
    logger.error('Error fetching education:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch education' });
  }
};

// Get all portfolio content in one request (for initial page load)
export const getAllContent = async (_req: Request, res: Response) => {
  try {
    const [about, services, projects, techStack, experience, education] = await Promise.all([
      prisma.about.findFirst(),
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.project.findMany({
        where: { isActive: true },
        orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }],
      }),
      prisma.techStack.findMany({
        where: { isActive: true },
        orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }],
      }),
      prisma.experience.findMany({
        where: { isActive: true },
        orderBy: [{ startDate: 'desc' }, { displayOrder: 'asc' }],
      }),
      prisma.education.findMany({
        where: { isActive: true },
        orderBy: [{ startDate: 'desc' }, { displayOrder: 'asc' }],
      }),
    ]);
    
    res.json({
      success: true,
      data: {
        about,
        services,
        projects,
        techStack,
        experience,
        education,
      },
    });
  } catch (error) {
    logger.error('Error fetching all content:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch portfolio content' });
  }
};

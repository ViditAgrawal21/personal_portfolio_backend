import { Request, Response } from 'express';
import prisma from '../config/database';
import { logger } from '../utils/logger';

// =====================================================
// ABOUT SECTION
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

export const updateAbout = async (req: Request, res: Response) => {
  try {
    const existing = await prisma.about.findFirst();
    
    let about;
    if (existing) {
      about = await prisma.about.update({
        where: { id: existing.id },
        data: req.body,
      });
    } else {
      about = await prisma.about.create({
        data: req.body,
      });
    }
    
    res.json({ success: true, data: about });
  } catch (error) {
    logger.error('Error updating about:', error);
    res.status(500).json({ success: false, error: 'Failed to update about section' });
  }
};

// =====================================================
// SERVICES
// =====================================================

export const getAllServices = async (_req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json({ success: true, data: services });
  } catch (error) {
    logger.error('Error fetching services:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch services' });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const service = await prisma.service.create({
      data: req.body,
    });
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    logger.error('Error creating service:', error);
    res.status(500).json({ success: false, error: 'Failed to create service' });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: service });
  } catch (error) {
    logger.error('Error updating service:', error);
    res.status(500).json({ success: false, error: 'Failed to update service' });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    await prisma.service.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    logger.error('Error deleting service:', error);
    res.status(500).json({ success: false, error: 'Failed to delete service' });
  }
};

// =====================================================
// PROJECTS
// =====================================================

export const getAllProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }],
    });
    res.json({ success: true, data: projects });
  } catch (error) {
    logger.error('Error fetching projects:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const project = await prisma.project.create({
      data: req.body,
    });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    logger.error('Error creating project:', error);
    res.status(500).json({ success: false, error: 'Failed to create project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: project });
  } catch (error) {
    logger.error('Error updating project:', error);
    res.status(500).json({ success: false, error: 'Failed to update project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    logger.error('Error deleting project:', error);
    res.status(500).json({ success: false, error: 'Failed to delete project' });
  }
};

// =====================================================
// TECH STACK
// =====================================================

export const getAllTechStack = async (_req: Request, res: Response) => {
  try {
    const techStack = await prisma.techStack.findMany({
      orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }],
    });
    res.json({ success: true, data: techStack });
  } catch (error) {
    logger.error('Error fetching tech stack:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch tech stack' });
  }
};

export const createTechStack = async (req: Request, res: Response) => {
  try {
    const tech = await prisma.techStack.create({
      data: req.body,
    });
    res.status(201).json({ success: true, data: tech });
  } catch (error) {
    logger.error('Error creating tech stack:', error);
    res.status(500).json({ success: false, error: 'Failed to create tech stack' });
  }
};

export const updateTechStack = async (req: Request, res: Response) => {
  try {
    const tech = await prisma.techStack.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: tech });
  } catch (error) {
    logger.error('Error updating tech stack:', error);
    res.status(500).json({ success: false, error: 'Failed to update tech stack' });
  }
};

export const deleteTechStack = async (req: Request, res: Response) => {
  try {
    await prisma.techStack.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true, message: 'Tech stack item deleted' });
  } catch (error) {
    logger.error('Error deleting tech stack:', error);
    res.status(500).json({ success: false, error: 'Failed to delete tech stack' });
  }
};

// =====================================================
// EXPERIENCE
// =====================================================

export const getAllExperience = async (_req: Request, res: Response) => {
  try {
    const experience = await prisma.experience.findMany({
      orderBy: [{ startDate: 'desc' }, { displayOrder: 'asc' }],
    });
    res.json({ success: true, data: experience });
  } catch (error) {
    logger.error('Error fetching experience:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch experience' });
  }
};

export const createExperience = async (req: Request, res: Response) => {
  try {
    const experience = await prisma.experience.create({
      data: {
        ...req.body,
        startDate: new Date(req.body.startDate),
        endDate: req.body.endDate ? new Date(req.body.endDate) : null,
      },
    });
    res.status(201).json({ success: true, data: experience });
  } catch (error) {
    logger.error('Error creating experience:', error);
    res.status(500).json({ success: false, error: 'Failed to create experience' });
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const experience = await prisma.experience.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : null,
      },
    });
    res.json({ success: true, data: experience });
  } catch (error) {
    logger.error('Error updating experience:', error);
    res.status(500).json({ success: false, error: 'Failed to update experience' });
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    await prisma.experience.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true, message: 'Experience deleted' });
  } catch (error) {
    logger.error('Error deleting experience:', error);
    res.status(500).json({ success: false, error: 'Failed to delete experience' });
  }
};

// =====================================================
// EDUCATION
// =====================================================

export const getAllEducation = async (_req: Request, res: Response) => {
  try {
    const education = await prisma.education.findMany({
      orderBy: [{ startDate: 'desc' }, { displayOrder: 'asc' }],
    });
    res.json({ success: true, data: education });
  } catch (error) {
    logger.error('Error fetching education:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch education' });
  }
};

export const createEducation = async (req: Request, res: Response) => {
  try {
    const education = await prisma.education.create({
      data: {
        ...req.body,
        startDate: new Date(req.body.startDate),
        endDate: req.body.endDate ? new Date(req.body.endDate) : null,
      },
    });
    res.status(201).json({ success: true, data: education });
  } catch (error) {
    logger.error('Error creating education:', error);
    res.status(500).json({ success: false, error: 'Failed to create education' });
  }
};

export const updateEducation = async (req: Request, res: Response) => {
  try {
    const education = await prisma.education.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : null,
      },
    });
    res.json({ success: true, data: education });
  } catch (error) {
    logger.error('Error updating education:', error);
    res.status(500).json({ success: false, error: 'Failed to update education' });
  }
};

export const deleteEducation = async (req: Request, res: Response) => {
  try {
    await prisma.education.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true, message: 'Education deleted' });
  } catch (error) {
    logger.error('Error deleting education:', error);
    res.status(500).json({ success: false, error: 'Failed to delete education' });
  }
};

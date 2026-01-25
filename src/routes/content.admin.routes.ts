import { Router } from 'express';
import * as contentAdminController from '../controllers/content.admin.controller';
import { validate } from '../middleware/validation.middleware';
import {
  aboutSchema,
  serviceSchema,
  projectSchema,
  techStackSchema,
  experienceSchema,
  educationSchema,
} from '../validators/schemas';

const router = Router();

// About Section
router.get('/about', contentAdminController.getAbout);
router.put('/about', validate(aboutSchema), contentAdminController.updateAbout);

// Services
router.get('/services', contentAdminController.getAllServices);
router.post('/services', validate(serviceSchema), contentAdminController.createService);
router.put('/services/:id', validate(serviceSchema), contentAdminController.updateService);
router.delete('/services/:id', contentAdminController.deleteService);

// Projects
router.get('/projects', contentAdminController.getAllProjects);
router.post('/projects', validate(projectSchema), contentAdminController.createProject);
router.put('/projects/:id', validate(projectSchema), contentAdminController.updateProject);
router.delete('/projects/:id', contentAdminController.deleteProject);

// Tech Stack
router.get('/stack', contentAdminController.getAllTechStack);
router.post('/stack', validate(techStackSchema), contentAdminController.createTechStack);
router.put('/stack/:id', validate(techStackSchema), contentAdminController.updateTechStack);
router.delete('/stack/:id', contentAdminController.deleteTechStack);

// Experience
router.get('/experience', contentAdminController.getAllExperience);
router.post('/experience', validate(experienceSchema), contentAdminController.createExperience);
router.put('/experience/:id', validate(experienceSchema), contentAdminController.updateExperience);
router.delete('/experience/:id', contentAdminController.deleteExperience);

// Education
router.get('/education', contentAdminController.getAllEducation);
router.post('/education', validate(educationSchema), contentAdminController.createEducation);
router.put('/education/:id', validate(educationSchema), contentAdminController.updateEducation);
router.delete('/education/:id', contentAdminController.deleteEducation);

export default router;

import { Router } from 'express';
import * as contentController from '../controllers/content.public.controller';

const router = Router();

// Get all content in one request
router.get('/all', contentController.getAllContent);

// Individual endpoints
router.get('/about', contentController.getAbout);
router.get('/services', contentController.getServices);
router.get('/projects', contentController.getProjects);
router.get('/stack', contentController.getTechStack);
router.get('/experience', contentController.getExperience);
router.get('/education', contentController.getEducation);

export default router;

import express from 'express';
import * as publicController from '../controllers/public.controller.js';

const router = express.Router();

router.get('/home', publicController.getHomeSummary);

export default router;

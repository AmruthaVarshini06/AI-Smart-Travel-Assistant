import express from "express";
import { getRoutes } from '../controllers/transportController.js';
import { getPrediction } from '../controllers/predictionController.js';

const router = express.Router();

router.get('/routes', getRoutes);
router.get('/predict/:routeId', getPrediction);

export default router;
import express from "express";
import axios from "axios";

import { getRoutes } from '../controllers/transportController.js';

const router = express.Router();

router.get('/routes', getRoutes);

export default router;
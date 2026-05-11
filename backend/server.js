<<<<<<< HEAD
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import transportRoutes from './routes/transportRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import geminiRoutes from './routes/geminiRoutes.js';
import { sendError } from './utils/responseHelper.js';
=======
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import geminiRoutes from "./routes/geminiRoutes.js";
import transportRoutes from "./routes/transportRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";

import { errorHandler }
  from "./middleware/errorMiddleware.js";
>>>>>>> origin/main

dotenv.config();

const app = express();
<<<<<<< HEAD
=======

connectDB();

>>>>>>> origin/main
app.use(cors());

app.use(express.json());

<<<<<<< HEAD
connectDB();

app.get('/', (req, res) => {
  res.json({ success: true, message: 'AI Smart Travel Assistant backend is running.' });
});

app.use('/api/transport', transportRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/gemini', geminiRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  sendError(res, err.message || 'Internal Server Error', err.statusCode || 500);
});
=======
app.use(
  "/api/gemini",
  geminiRoutes
);

app.use(
  "/api/transport",
  transportRoutes
);

app.use(
  "/api/weather",
  weatherRoutes
);

app.use(
  "/api/trips",
  tripRoutes
);

app.use(errorHandler);
>>>>>>> origin/main

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
<<<<<<< HEAD
  console.log(`Backend running at http://localhost:${PORT}`);
=======

  console.log(
    `Server running on port ${PORT}`
  );
>>>>>>> origin/main
});
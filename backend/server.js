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

dotenv.config();

const app = express();

connectDB();

app.use(cors());

app.use(express.json());

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

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});
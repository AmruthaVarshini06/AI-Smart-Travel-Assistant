import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import connectDB, {
  getDBStatus
} from "./config/db.js";

import geminiRoutes from "./routes/geminiRoutes.js";
import transportRoutes from "./routes/transportRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";

import { errorHandler }
  from "./middleware/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, ".env")
});

const app = express();

connectDB();

app.use(cors());

app.use(express.json());

app.get(
  "/api/health",
  async (req, res) => {
    const database =
      getDBStatus();

    const collections =
      database.connected
        ? await mongoose.connection.db.listCollections().toArray()
        : [];

    const collectionCounts =
      database.connected
        ? Object.fromEntries(
            await Promise.all(
              collections.map(async collection => [
                collection.name,
                await mongoose.connection.db
                  .collection(collection.name)
                  .countDocuments()
              ])
            )
          )
        : {};

    const counts =
      database.connected
        ? {
            buses:
              await mongoose.connection.db.collection("buses").countDocuments(),
            trains:
              await mongoose.connection.db.collection("trains").countDocuments(),
            flights:
              await mongoose.connection.db.collection("flights").countDocuments(),
            trips:
              await mongoose.connection.db.collection("trips").countDocuments()
          }
        : {};

    res.json({
      success: true,
      server: "running",
      database: {
        ...database,
        counts,
        collections:
          collectionCounts
      }
    });
  }
);

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

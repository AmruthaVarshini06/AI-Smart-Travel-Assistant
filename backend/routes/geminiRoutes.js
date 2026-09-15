import express from "express";

import {
  chatWithAI,
  chatWithAIStream
} from "../controllers/geminiController.js";

const router = express.Router();

router.post("/chat", chatWithAI);
router.post("/chat/stream", chatWithAIStream);

export default router;
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Load Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST: /api/gemini/chat
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // 🔥 Travel AI Brain
    const prompt = `
You are an AI Travel Assistant.

Rules:
- Answer ONLY travel-related questions
- Include transport (bus/train/flight)
- Give estimated price and time
- Suggest best option
- Keep it short and clear

User Question:
${message}
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ reply: response });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "AI error occurred" });
  }
});

export default router;
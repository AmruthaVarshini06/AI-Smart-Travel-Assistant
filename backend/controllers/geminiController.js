import { getAIResponse } from "../services/geminiService.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    const reply = await getAIResponse(message);

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: "AI error" });
  }
};
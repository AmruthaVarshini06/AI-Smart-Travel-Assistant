import { processChat } from '../services/geminiService.js';
import { sendSuccess } from '../utils/responseHelper.js';

export const chatWithAI = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const response = await processChat(message);

    sendSuccess(res, response);
  } catch (error) {
    next(error);
  }
};

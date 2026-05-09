import { processChat } from '../services/geminiService.js';
import { sendSuccess } from '../utils/responseHelper.js';

export const chatWithAI = async (req, res, next) => {
  try {
    const { message } = req.body;
    const response = await processChat(message);
    sendSuccess(res, response);
  } catch (error) {
    next(error);
  }
};
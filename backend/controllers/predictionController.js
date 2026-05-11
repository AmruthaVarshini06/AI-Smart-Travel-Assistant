import { getRoutePrediction } from '../services/predictionService.js';
import { sendSuccess } from '../utils/responseHelper.js';

export const getPrediction = async (req, res, next) => {
  try {
    const { routeId } = req.params;
    const { weather = 'Clear' } = req.query;

    const prediction = await getRoutePrediction(routeId, weather);
    sendSuccess(res, prediction);
  } catch (error) {
    next(error);
  }
};

import { getWeatherByCity } from '../services/weatherService.js';
import { sendSuccess } from '../utils/responseHelper.js';

export const getWeather = async (req, res, next) => {
  try {
    const { city } = req.params;
    const weather = await getWeatherByCity(city);
    sendSuccess(res, weather);
  } catch (error) {
    next(error);
  }
};
import { getFlightRoutes } from '../services/flightService.js';
import { getTrainRoutes } from '../services/trainService.js';
import { getBusRoutes } from '../services/busService.js';
import { sendSuccess } from '../utils/responseHelper.js';

export const getRoutes = async (req, res, next) => {
  try {
    const { source, destination, date } = req.query;
    
    const [flights, trains, buses] = await Promise.all([
      getFlightRoutes(source, destination, date),
      getTrainRoutes(source, destination, date),
      getBusRoutes(source, destination, date)
    ]);

    sendSuccess(res, { flights, trains, buses });
  } catch (error) {
    next(error);
  }
};
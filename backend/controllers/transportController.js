import { getFlightRoutes } from '../services/flightService.js';
import { getTrainRoutes } from '../services/trainService.js';
import { getBusRoutes } from '../services/busService.js';
import { predictRouteDelay } from '../services/mlService.js';
import { sendSuccess } from '../utils/responseHelper.js';

export const getRoutes = async (req, res, next) => {
  try {
    const { source, destination, date, weatherCondition = 'Clear' } = req.query;
    
    const [flights, trains, buses] = await Promise.all([
      getFlightRoutes(source, destination, date),
      getTrainRoutes(source, destination, date),
      getBusRoutes(source, destination, date)
    ]);

    const allRoutes = [...flights, ...trains, ...buses];

    // Enrich routes with ML predictions
    const enrichedRoutes = await Promise.all(allRoutes.map(async (route) => {
      const prediction = await predictRouteDelay(
        { mode: route.mode, departureTime: route.departureTime || '12:00' },
        { condition: weatherCondition, temp: 25 }
      );
      return { ...route, prediction };
    }));

    sendSuccess(res, enrichedRoutes);
  } catch (error) {
    next(error);
  }
};
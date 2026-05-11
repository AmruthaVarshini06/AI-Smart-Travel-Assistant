import TouristPlace from '../models/TouristPlace.js';
import { sendSuccess } from '../utils/responseHelper.js';

export const getPlacesAlongRoute = async (req, res, next) => {
  try {
    const { sourceLat, sourceLng, destLat, destLng, radius = 50 } = req.query;
    
    // In a real implementation, we would use a geospatial query 
    // to find places within 'radius' km of the line segment between source and destination.
    // For now, we fetch all and filter based on a simple bounding box + distance logic.
    
    const places = await TouristPlace.find({
      'coordinates.lat': { 
        $gte: Math.min(sourceLat, destLat) - 1, 
        $lte: Math.max(sourceLat, destLat) + 1 
      },
      'coordinates.lng': { 
        $gte: Math.min(sourceLng, destLng) - 1, 
        $lte: Math.max(sourceLng, destLng) + 1 
      }
    });

    sendSuccess(res, places);
  } catch (error) {
    next(error);
  }
};

export const getPlaceDetails = async (req, res, next) => {
  try {
    const place = await TouristPlace.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });
    sendSuccess(res, place);
  } catch (error) {
    next(error);
  }
};
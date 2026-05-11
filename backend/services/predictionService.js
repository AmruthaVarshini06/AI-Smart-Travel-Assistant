import axios from 'axios';

const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5001';

const simulatePrediction = (routeId, weather = 'Clear') => {
  const seed = routeId
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  const baseDelay = 8 + (seed % 18);
  const weatherPenalty = weather === 'Storm' ? 22 : weather === 'Rain' ? 12 : 5;
  const predictedDelayMinutes = baseDelay + weatherPenalty;
  const probability = Math.min(
    100,
    Math.max(10, 45 + (seed % 35) + (weather === 'Storm' ? 20 : weather === 'Rain' ? 10 : 0))
  );
  const confidence = Number((0.75 + ((seed % 15) / 100)).toFixed(2));

  return {
    routeId,
    predictedDelayMinutes,
    probability,
    confidence,
    factors: ['Weather impact', 'Historical delay patterns', 'Transfer complexity'],
  };
};

export const getRoutePrediction = async (routeId, weather = 'Clear') => {
  if (process.env.USE_ML_SERVICE === 'true') {
    try {
      const response = await axios.post(`${mlServiceUrl}/predict`, {
        routeId,
        weather,
      });
      return response.data;
    } catch (error) {
      console.warn(
        'ML service unavailable, falling back to local prediction engine.',
        error.message || error
      );
    }
  }

  return simulatePrediction(routeId, weather);
};

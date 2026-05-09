import { generateRoutes, WeatherCondition } from './mock-data';

/**
 * Simulates the Node.js /api/plan endpoint
 */
export const fetchTravelPlan = async (params: {
  source: string;
  destination: string;
  distance: number;
  style: 'balanced' | 'fastest' | 'cheapest';
  weather: WeatherCondition;
}) => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return generateRoutes(params.distance, params.style, params.weather);
};

/**
 * Simulates the Python ML /predict endpoint for delay prediction
 */
export const predictDelay = async (routeId: string, weather: WeatherCondition) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const baseProb = Math.random() * 20;
  const weatherImpact = weather === 'Storm' ? 40 : weather === 'Rain' ? 15 : 0;
  
  return {
    probability: Math.min(100, baseProb + weatherImpact),
    confidence: 0.85 + (Math.random() * 0.1),
    factors: ['Weather', 'Historical Congestion', 'Terminal Load']
  };
};
/**
 * ML Service (Simulating the Python/Flask Microservice)
 * In a production environment, this would be a bridge to a Flask/FastAPI service.
 * It uses a weighted heuristic model to predict delays and score routes.
 */

export const predictRouteDelay = async (routeData, weatherData) => {
  // Weights for the "ML Model"
  const WEIGHTS = {
    weather: 0.4,
    timeOfDay: 0.3,
    historicalCongestion: 0.3
  };

  const { mode, departureTime } = routeData;
  const { condition, temp } = weatherData;

  // 1. Weather Impact
  let weatherImpact = 0;
  if (condition === 'Storm') weatherImpact = 0.9;
  else if (condition === 'Rain') weatherImpact = 0.4;
  else if (temp > 40) weatherImpact = 0.2; // Heatwave impact

  // 2. Time of Day Impact (Rush hour logic)
  const hour = parseInt(departureTime.split(':')[0]);
  let timeImpact = 0;
  if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) {
    timeImpact = 0.8; // Peak hours
  } else if (hour >= 22 || hour <= 5) {
    timeImpact = 0.1; // Night hours
  } else {
    timeImpact = 0.3;
  }

  // 3. Mode Specific Base Risk
  const modeBaseRisk = {
    flight: 0.1,
    train: 0.15,
    bus: 0.3,
    cab: 0.4,
    metro: 0.05
  };

  const baseRisk = modeBaseRisk[mode] || 0.2;

  // Calculate Probability
  const probability = (
    (weatherImpact * WEIGHTS.weather) + 
    (timeImpact * WEIGHTS.timeOfDay) + 
    (baseRisk * WEIGHTS.historicalCongestion)
  ) * 100;

  return {
    probability: Math.min(99, Math.max(2, probability)),
    confidence: 0.88,
    factors: [
      weatherImpact > 0.5 ? 'Severe Weather' : null,
      timeImpact > 0.6 ? 'Peak Traffic' : null,
      'Historical Mode Reliability'
    ].filter(Boolean)
  };
};

export const calculateRouteScore = (route) => {
  // Heuristic for "Recommended" badge
  const costWeight = 0.4;
  const timeWeight = 0.4;
  const reliabilityWeight = 0.2;

  // Normalized scores (lower is better for cost/time)
  const score = (route.totalCost * costWeight) + (route.totalDuration * timeWeight);
  return score / route.reliabilityScore;
};
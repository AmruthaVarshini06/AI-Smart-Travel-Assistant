import { TravelRoute, WeatherCondition } from '@/types/travel';
import { aiApi } from '@/services/api';

export const getAIRecommendation = (routes: TravelRoute[], weather: WeatherCondition) => {
  if (weather === 'Storm') {
    return routes.find(r => r.segments.every(s => s.mode !== 'flight')) || routes[0];
  }
  
  return routes.reduce((prev, current) => {
    const prevScore = prev.reliabilityScore * 0.6 + (10000 / prev.totalCost) * 0.4;
    const currScore = current.reliabilityScore * 0.6 + (10000 / current.totalCost) * 0.4;
    return currScore > prevScore ? current : prev;
  });
};

export const processChatQuery = async (query: string): Promise<string> => {
  const message =
    query.trim();

  if (!message) {
    return "Tell me where you're going, and I'll help plan the route.";
  }

  const response =
    await aiApi.chat(message);

  const reply =
    response.data?.data ||
    response.data?.message;

  if (!reply) {
    throw new Error('AI response was empty');
  }

  return reply;
};

import axios from "axios";

import {TravelRoute,WeatherCondition,} from "@/types/travel";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";
  
export const fetchTravelPlan = async (
  params: {
    source: string;

    destination: string;

    distance: number;

    style:
      | "balanced"
      | "fastest"
      | "cheapest";

    weather: WeatherCondition;
  }
): Promise<TravelRoute[]> => {
  try {
    const response = await axios.get(
  `${API_BASE_URL}/transport/routes`,
  {
    params: {
      source: params.source,
      destination: params.destination,
      distance: params.distance,
      style: params.style,
      weather: params.weather,
    },
  }
)

    const routes = response.data.data;

const transformedRoutes: TravelRoute[] =
  routes.map((route: any) => ({
    id: route.id?.toString() || "0",

    type: "recommended",

    totalCost:
      Number(route.Price) || 0,

    totalDuration: (() => {
  const duration =
    route.Duration || "0:00";

  const parts =
    duration.split(":");

  const hours =
    Number(parts[0]) || 0;

  const minutes =
    Number(parts[1]) || 0;

  return `${hours}h ${minutes}m`;
})(),

    score:
  100 -
  (route.prediction
    ?.probability || 10),

    segments: [
      {
        mode: "flight",

        from: route.source,

        to: route.destination,

        duration:
          route.Duration || "0h",

        cost:
          Number(route.Price) || 0,

        departureTime:
  route.dep_time
    ?.slice(0, 5) || "00:00",
    
    arrivalTime:
  route.arrival_time
    ?.slice(0, 5) || "00:00",

        delayRisk:
          route.prediction
            ?.probability || 10,
      },
    ],
  }));

return transformedRoutes;
  } catch (error) {
    console.error(
      "Error fetching travel plan:",
      error
    );

    throw error;
  }
};

/**
 * Predict transport delays dynamically
 */
export const predictDelay = async (routeId: string,mode: string,departureTime: string,weather: WeatherCondition) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/transport/predict`,
      {routeId,mode,departureTime,weather,}
    );

    return response.data;
  } catch (error) {
    console.error(
      "Prediction service error:",
      error
    );

    return {
      probability: 20,
      confidence: 0.75,
      factors: ["Weather","Traffic",],
    };
  }
};
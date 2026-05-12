import axios from "axios";

import {
  TravelRoute,
  WeatherCondition,
} from "@/types/travel";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const parseDurationToMinutes = (duration = "0") => {
  const hourMatch =
    duration.match(/(\d+)\s*h/i);

  const minuteMatch =
    duration.match(/(\d+)\s*m/i);

  if (hourMatch || minuteMatch) {
    return (
      Number(hourMatch?.[1] || 0) * 60 +
      Number(minuteMatch?.[1] || 0)
    );
  }

  const parts =
    duration.split(":");

  if (parts.length >= 2) {
    return (
      (Number(parts[0]) || 0) * 60 +
      (Number(parts[1]) || 0)
    );
  }

  return Number(duration) || 0;
};
  
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
    );

    const routes =
      response.data.routes ||
      response.data.data ||
      [];

    const transformedRoutes: TravelRoute[] =
      routes.map((route: any, index: number) => {
        const totalDuration =
          parseDurationToMinutes(route.duration);

        const delayRisk =
          route.prediction?.probability || 10;

        return {
          id:
            route.id?.toString() ||
            route._id?.toString() ||
            `${route.type}-${index}`,

          type:
            index === 0
              ? "recommended"
              : route.type === "flight"
                ? "fastest"
                : route.type === "bus"
                  ? "cheapest"
                  : "eco-friendly",

          totalCost:
            Number(route.price) || 0,

          totalDuration,

          reliabilityScore:
            Math.max(0, 100 - delayRisk),

          co2Saved:
            route.type === "train"
              ? 45
              : route.type === "bus"
                ? 25
                : 0,

          score:
            100 - delayRisk,

          segments: [
            {
              mode: route.type,
              from: route.source,
              to: route.destination,
              duration: totalDuration,
              cost: Number(route.price) || 0,
              departureTime:
                route.departure_time?.slice(0, 5) || "00:00",
              arrivalTime:
                route.arrival_time?.slice(0, 5) || "00:00",
              delayRisk,
            },
          ],
        };
      });

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
export const predictDelay = async (
  routeId: string,
  mode: string,
  departureTime: string,
  weather: WeatherCondition
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/transport/predict`,
      {
        routeId,
        mode,
        departureTime,
        weather,
      }
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
      factors: [
        "Weather",
        "Traffic",
      ],
    };
  }
};

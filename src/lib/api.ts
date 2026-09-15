import axios from "axios";

import {
  TravelRoute,
  WeatherCondition,
} from "@/types/travel";

import {
  normalizeRouteMetrics,
} from "@/utils/tripEstimates";


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


// ========================================
// TYPES
// ========================================

interface RouteData {
  duration?: string;
  departure_time?: string;
  arrival_time?: string;

  prediction?: {
    probability?: number;
  };

  id?: string | number;
  _id?: string | number;

  type?: string;
  transportMode?: string;

  price?: string | number;

  source?: string;
  destination?: string;

  reliability_score?: number;
  reliabilityScore?: number;
  on_time_percentage?: number;

  isCombination?: boolean;

  totalDuration?: number;
  totalPrice?: number;

  segments?: RouteData[];
}


// ========================================
// PARSE DURATION
// ========================================

const parseDurationToMinutes = (
  duration = "0"
) => {
  const value = String(duration);

  const hourMatch =
    value.match(/(\d+)\s*h/i);

  const minuteMatch =
    value.match(/(\d+)\s*m/i);

  if (hourMatch || minuteMatch) {
    return (
      Number(hourMatch?.[1] || 0) * 60 +
      Number(minuteMatch?.[1] || 0)
    );
  }

  const parts = value.split(":");

  if (parts.length >= 2) {
    return (
      (Number(parts[0]) || 0) * 60 +
      (Number(parts[1]) || 0)
    );
  }

  return Number(value) || 0;
};


// ========================================
// NORMALIZE TRANSPORT MODE
// ========================================

const normalizeMode = (
  mode?: string
) => {
  const normalized =
    String(mode || "").toLowerCase();

  if (normalized.includes("flight")) {
    return "flight";
  }

  if (normalized.includes("train")) {
    return "train";
  }

  if (normalized.includes("bus")) {
    return "bus";
  }

  if (normalized.includes("cab")) {
    return "cab";
  }

  return "bus";
};


// ========================================
// CREATE COMBINATION ROUTES
// ========================================

const createCombinationRoutes = (
  routes: RouteData[]
): RouteData[] => {

  const combinations: RouteData[] = [];

  // Limit routes to avoid creating
  // too many combinations
  const availableRoutes =
    routes.slice(0, 10);

  for (
    let i = 0;
    i < availableRoutes.length;
    i++
  ) {

    for (
      let j = i + 1;
      j < availableRoutes.length;
      j++
    ) {

      const first =
        availableRoutes[i];

      const second =
        availableRoutes[j];


      // Do not combine same transport mode
      if (
        first.transportMode ===
        second.transportMode
      ) {
        continue;
      }


      // Create a combination route
      combinations.push({

        _id:
          `combo-${i}-${j}`,

        isCombination:
          true,

        totalDuration:

          parseDurationToMinutes(
            first.duration || "0"
          ) +

          parseDurationToMinutes(
            second.duration || "0"
          ) +

          60,


        totalPrice:

          Number(
            first.price || 0
          ) +

          Number(
            second.price || 0
          ),


        reliability_score:

          Math.round(

            (
              Number(
                first.reliability_score ||
                first.reliabilityScore ||
                80
              ) +

              Number(
                second.reliability_score ||
                second.reliabilityScore ||
                80
              )
            ) / 2

          ),


        segments: [

          {
            ...first,

            source:
              first.source,

            destination:
              first.destination,

            type:
              first.transportMode,
          },

          {
            ...second,

            source:
              second.source,

            destination:
              second.destination,

            type:
              second.transportMode,
          },

        ],

      });

    }

  }

  return combinations;
};


// ========================================
// FETCH TRAVEL PLAN
// ========================================

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

    // ==============================
    // CALL BACKEND
    // ==============================

    const response =
      await axios.get(

        `${API_BASE_URL}/transport/search`,

        {
          params: {
            source:
              params.source,

            destination:
              params.destination,
          },
        }

      );


    console.log(
      "Transport API response:",
      response.data
    );


    // ==============================
    // GET DATA FROM BACKEND
    // ==============================

    const buses: RouteData[] =
      response.data.buses || [];

    const trains: RouteData[] =
      response.data.trains || [];

    const flights: RouteData[] =
      response.data.flights || [];


    console.log(
      "Buses:",
      buses.length
    );

    console.log(
      "Trains:",
      trains.length
    );

    console.log(
      "Flights:",
      flights.length
    );


    // ==============================
    // DIRECT ROUTES
    // ==============================

    const directRoutes: RouteData[] = [

      ...buses.map(
        (route) => ({

          ...route,

          transportMode:
            "bus",

          isCombination:
            false,

        })
      ),


      ...trains.map(
        (route) => ({

          ...route,

          transportMode:
            "train",

          isCombination:
            false,

        })
      ),


      ...flights.map(
        (route) => ({

          ...route,

          transportMode:
            "flight",

          isCombination:
            false,

        })
      ),

    ];


    // ==============================
    // CREATE COMBINATION ROUTES
    // ==============================

    const combinationRoutes =
      createCombinationRoutes(
        directRoutes
      );


    console.log(
      "Combination routes:",
      combinationRoutes
    );


    // ==============================
    // ALL ROUTES
    // ==============================

    const routes: RouteData[] = [

      ...directRoutes,

      ...combinationRoutes,

    ];


    console.log(
      "Total routes:",
      routes.length
    );


    // ==============================
    // TRANSFORM ROUTES
    // ==============================

    const transformedRoutes:
      TravelRoute[] =

      routes.map(
        (
          route: RouteData,
          index: number
        ) => {


          // ==========================
          // COMBINATION ROUTE
          // ==========================

          if (
            route.isCombination &&
            route.segments
          ) {

            const totalDuration =
              route.totalDuration ||

              route.segments.reduce(
                (
                  total,
                  segment
                ) =>

                  total +

                  parseDurationToMinutes(
                    segment.duration || "0"
                  ),

                60
              );


            const totalCost =
              route.totalPrice ||

              route.segments.reduce(
                (
                  total,
                  segment
                ) =>

                  total +

                  Number(
                    segment.price || 0
                  ),

                0
              );


            return {

              id:

                route._id?.toString() ||

                `combination-${index}`,


              type:
                "recommended",


              totalCost,


              totalDuration,


              reliabilityScore:

                Number(
                  route.reliability_score
                ) || 80,


              co2Saved:
                20,


              score:
                85,


              segments:

                route.segments.map(
                  (segment) => {

                    const mode =
                      normalizeMode(
                        segment.type ||
                        segment.transportMode
                      );


                    const duration =
                      parseDurationToMinutes(
                        segment.duration || "0"
                      );


                    const cost =
                      Number(
                        segment.price || 0
                      );


                    const reliability =
                      Number(
                        segment.reliability_score ||
                        segment.reliabilityScore ||
                        80
                      );


                    return {

                      mode,

                      from:
                        segment.source ||
                        params.source,

                      to:
                        segment.destination ||
                        params.destination,

                      duration,

                      cost,

                      departureTime:

                        segment.departure_time
                          ?.slice(0, 5) ||

                        "00:00",


                      arrivalTime:

                        segment.arrival_time
                          ?.slice(0, 5) ||

                        "00:00",


                      delayRisk:

                        Math.max(
                          0,
                          100 - reliability
                        ),

                    };

                  }
                ),

            };

          }


          // ==========================
          // NORMAL DIRECT ROUTE
          // ==========================

          const transportMode =
            normalizeMode(
              route.transportMode ||
              route.type
            );


          let totalDuration =
            parseDurationToMinutes(
              route.duration || "0"
            );


          const normalizedMetrics =
            normalizeRouteMetrics({

              type:
                transportMode,

              durationMinutes:
                totalDuration,

              cost:
                Number(
                  route.price
                ) || 0,

            });


          totalDuration =
            normalizedMetrics.durationMinutes;


          const reliabilityScore =
            Number(

              route.reliability_score ||

              route.reliabilityScore ||

              route.on_time_percentage

            ) || 80;


          const delayRisk =
            Math.max(
              0,
              100 - reliabilityScore
            );


          return {

            id:

              route._id?.toString() ||

              route.id?.toString() ||

              `${transportMode}-${index}`,


            type:

              index === 0

                ? "recommended"

                : transportMode ===
                  "flight"

                    ? "fastest"

                    : transportMode ===
                      "bus"

                        ? "cheapest"

                        : "eco-friendly",


            totalCost:
              normalizedMetrics.cost,


            totalDuration,


            reliabilityScore,


            co2Saved:

              transportMode === "train"

                ? 45

                : transportMode === "bus"

                  ? 25

                  : 0,


            score:
              100 - delayRisk,


            segments: [

              {

                mode:
                  transportMode,


                from:
                  route.source ||
                  params.source,


                to:
                  route.destination ||
                  params.destination,


                duration:
                  totalDuration,


                cost:
                  normalizedMetrics.cost,


                departureTime:

                  route.departure_time
                    ?.slice(0, 5) ||

                  "00:00",


                arrivalTime:

                  route.arrival_time
                    ?.slice(0, 5) ||

                  "00:00",


                delayRisk,

              },

            ],

          };

        }

      );


    console.log(
      "Transformed routes:",
      transformedRoutes
    );


    return transformedRoutes;


  } catch (error) {

    console.error(
      "Error fetching travel plan:",
      error
    );

    throw error;

  }

};


// ========================================
// PREDICT DELAY
// ========================================

export const predictDelay = async (

  routeId: string,

  mode: string,

  departureTime: string,

  weather: WeatherCondition

) => {

  try {

    const response =
      await axios.post(

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

      probability:
        20,

      confidence:
        0.75,

      factors: [

        "Weather",

        "Traffic",

      ],

    };

  }

};
import { TravelRoute } from "@/types/travel";

/**
 * Convert time like:
 * 09:30
 * 09:30 PM
 * 6:30:00 AM
 * into minutes
 */
function timeToMinutes(timeString: string): number {
  if (!timeString) return 0;

  try {
    const cleaned = timeString.trim();

    // Handle AM/PM format
    if (cleaned.includes("AM") || cleaned.includes("PM")) {
      const date = new Date(`1970-01-01 ${cleaned}`);

      return date.getHours() * 60 + date.getMinutes();
    }

    // Handle HH:mm:ss
    const parts = cleaned.split(":");

    const hours = Number(parts[0] || 0);
    const minutes = Number(parts[1] || 0);

    return hours * 60 + minutes;
  } catch {
    return 0;
  }
}

/**
 * Safely calculate duration
 */
function calculateDuration(
  departure: string,
  arrival: string
): number {
  const dep = timeToMinutes(departure);
  const arr = timeToMinutes(arrival);

  // Handle overnight travel
  if (arr < dep) {
    return 24 * 60 - dep + arr;
  }

  return arr - dep;
}

/**
 * Build intelligent routes dynamically
 */
export function buildSmartRoutes(
  buses: any[],
  trains: any[],
  flights: any[],
  source: string,
  destination: string
): TravelRoute[] {

  const routes: TravelRoute[] = [];

  /**
   * --------------------------
   * BUS ROUTES
   * --------------------------
   */
  buses.forEach((bus: any, index: number) => {

    const duration = calculateDuration(
      bus.Departure,
      bus.Arrival
    );

    const price = Number(bus.Price || 0);

    routes.push({
      id: `bus-${index}`,

      totalDuration: duration,

      totalCost: price,

      reliabilityScore: 82,

      type: "cheapest",

      co2Saved: 8,

      score: 0,

      segments: [
        {
          mode: "bus",

          from: bus.From,

          to: bus.To,

          duration,

          cost: price,

          departureTime: bus.Departure,

          arrivalTime: bus.Arrival,

          delayRisk: 0.2,
        },
      ],
    });
  });

  /**
   * --------------------------
   * TRAIN ROUTES
   * --------------------------
   */
  trains.forEach((train: any, index: number) => {

    const duration = calculateDuration(
      train.departure_time,
      train.arrival_time
    );

    const price = Number(train.Price || 0);

    routes.push({
      id: `train-${index}`,

      totalDuration: duration,

      totalCost: price,

      reliabilityScore: 92,

      type: "recommended",

      co2Saved: 12,

      score: 0,

      segments: [
        {
          mode: "train",

          from: train.source_station,

          to: train.destination_station,

          duration,

          cost: price,

          departureTime: train.departure_time,

          arrivalTime: train.arrival_time,

          delayRisk: 0.08,
        },
      ],
    });
  });

  /**
   * --------------------------
   * FLIGHT ROUTES
   * --------------------------
   */
  flights.forEach((flight: any, index: number) => {

    const duration = calculateDuration(
      flight.dep_time,
      flight.Arrival_time
    );

    const price = Number(flight.Price || 0);

    routes.push({
      id: `flight-${index}`,

      totalDuration: duration,

      totalCost: price,

      reliabilityScore: 95,

      type: "fastest",

      co2Saved: 3,

      score: 0,

      segments: [
        {
          mode: "flight",

          from: flight.Source,

          to: flight.destination,

          duration,

          cost: price,

          departureTime: flight.dep_time,

          arrivalTime: flight.Arrival_time,

          delayRisk: 0.05,
        },
      ],
    });
  });

  /**
   * --------------------------
   * MULTI MODAL COMBINATIONS
   * --------------------------
   */

  trains.forEach((train: any, tIndex: number) => {

    flights.forEach((flight: any, fIndex: number) => {

      const trainArrival = timeToMinutes(
        train.arrival_time
      );

      const flightDeparture = timeToMinutes(
        flight.dep_time
      );

      const waitingTime =
        flightDeparture - trainArrival;

      // Allow realistic transfers
      if (waitingTime >= 45 && waitingTime <= 300) {

        const trainDuration = calculateDuration(
          train.departure_time,
          train.arrival_time
        );

        const flightDuration = calculateDuration(
          flight.dep_time,
          flight.Arrival_time
        );

        const totalCost =
          Number(train.Price || 0) +
          Number(flight.Price || 0);

        const totalDuration =
          trainDuration +
          waitingTime +
          flightDuration;

        routes.push({
          id: `combo-train-flight-${tIndex}-${fIndex}`,

          totalDuration,

          totalCost,

          reliabilityScore: 90,

          type: "recommended",

          co2Saved: 6,

          score: 0,

          segments: [
            {
              mode: "train",

              from: train.source_station,

              to: train.destination_station,

              duration: trainDuration,

              cost: Number(train.Price || 0),

              departureTime: train.departure_time,

              arrivalTime: train.arrival_time,

              delayRisk: 0.1,
            },

            {
              mode: "flight",

              from: flight.Source,

              to: flight.destination,

              duration: flightDuration,

              cost: Number(flight.Price || 0),

              departureTime: flight.dep_time,

              arrivalTime: flight.Arrival_time,

              delayRisk: 0.05,
            },
          ],
        });
      }
    });
  });

  /**
   * --------------------------
   * SMART RANKING
   * --------------------------
   */

  routes.forEach((route) => {

    const costWeight = route.totalCost * 0.35;

    const durationWeight =
      route.totalDuration * 0.4;

    const reliabilityWeight =
      (100 - route.reliabilityScore) * 20;

    route.score =
      costWeight +
      durationWeight +
      reliabilityWeight;
  });

  /**
   * Sort by optimized score
   */
  routes.sort((a, b) => a.score - b.score);

  /**
 * Remove near duplicate routes
 */

const uniqueRoutes: TravelRoute[] = [];

routes.forEach((route) => {

  const isDuplicate = uniqueRoutes.some((existing) => {

    // Transport pattern
    const existingPattern =
      existing.segments
        .map((s) => s.mode)
        .join("->");

    const currentPattern =
      route.segments
        .map((s) => s.mode)
        .join("->");

    // Different route structure
    if (existingPattern !== currentPattern) {
      return false;
    }

    // Cost similarity
    const priceDifference =
      Math.abs(
        existing.totalCost - route.totalCost
      );

    // Duration similarity
    const durationDifference =
      Math.abs(
        existing.totalDuration -
        route.totalDuration
      );

    // Treat as duplicate only if both are very similar
    return (
      priceDifference <= 300 &&
      durationDifference <= 45
    );
  });

  if (!isDuplicate) {
    uniqueRoutes.push(route);
  }
});
    /**
 * Prioritize transport diversity
 */

const selectedRoutes: TravelRoute[] = [];

const usedPatterns = new Set<string>();

for (const route of uniqueRoutes) {

  const pattern =
    route.segments
      .map((s) => s.mode)
      .join("->");

  // Prefer different transport combinations
  if (!usedPatterns.has(pattern)) {

    selectedRoutes.push(route);

    usedPatterns.add(pattern);
  }

  // Stop after top 3
  if (selectedRoutes.length >= 3) {
    break;
  }
}

/**
 * Fallback:
 * if less than 3 unique combinations exist
 */

if (selectedRoutes.length < 3) {

  uniqueRoutes.forEach((route) => {

    const alreadyExists =
      selectedRoutes.some(
        (r) => r.id === route.id
      );

    if (!alreadyExists) {
      selectedRoutes.push(route);
    }
  });
}

return selectedRoutes.slice(0, 3);
}
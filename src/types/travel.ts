export type TransportMode =
  | "flight"
  | "train"
  | "bus"
  | "metro"
  | "cab"
  | "walking";

export type WeatherCondition =
  | "Clear"
  | "Rain"
  | "Storm";

export interface RouteSegment {
  mode: TransportMode;
  from: string;
  to: string;
  duration: number;
  cost: number;
  departureTime: string;
  arrivalTime: string;
  delayRisk: number;
}

export interface TravelRoute {
  id: string;
  totalDuration: number;
  totalCost: number;
  reliabilityScore: number;
  type:
    | "fastest"
    | "cheapest"
    | "recommended"
    | "eco-friendly";

  segments: RouteSegment[];

  co2Saved: number;
  score: number;
}

export const PRICE_TRENDS = [
  { day: "Today", price: 1250 },
  { day: "2 May", price: 1400 },
  { day: "3 May", price: 1800 },
  { day: "4 May", price: 2100 },
  { day: "5 May", price: 2400 },
  { day: "6 May", price: 2800 },
];

export const DELAY_DATA = [
  { time: "06:00", delay: 5 },
  { time: "09:00", delay: 25 },
  { time: "12:00", delay: 15 },
  { time: "15:00", delay: 10 },
  { time: "18:00", delay: 30 },
  { time: "21:00", delay: 5 },
];
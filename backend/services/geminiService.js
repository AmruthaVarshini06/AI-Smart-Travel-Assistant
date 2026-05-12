import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import Bus from "../models/Bus.js";
import Train from "../models/Train.js";
import Flight from "../models/Flight.js";

let providerDisabled = false;

const sourceFields = [
  "source",
  "Source",
  "from",
  "From",
  "source_city",
  "source_station"
];

const destinationFields = [
  "destination",
  "Destination",
  "to",
  "To",
  "destination_city",
  "destination_station"
];

const pick = (route, fields, fallback = "") => {
  for (const field of fields) {
    if (route[field] !== undefined && route[field] !== null && route[field] !== "") {
      return route[field];
    }
  }

  return fallback;
};

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const cityMatch = (value = "") => ({
  $regex: `^${escapeRegex(value.trim())}$`,
  $options: "i"
});

const routeQuery = (source, destination) => ({
  $and: [
    {
      $or: sourceFields.map(field => ({
        [field]: cityMatch(source)
      }))
    },
    {
      $or: destinationFields.map(field => ({
        [field]: cityMatch(destination)
      }))
    }
  ]
});

const normalizeRoute = (route, type) => ({
  type,
  source: pick(route, sourceFields),
  destination: pick(route, destinationFields),
  departure: pick(route, [
    "departure_time",
    "Departure",
    "Departure_time",
    "dep_time"
  ]),
  arrival: pick(route, [
    "arrival_time",
    "Arrival",
    "Arrival_time"
  ]),
  duration: pick(route, [
    "duration",
    "Duration"
  ]),
  price: Number(pick(route, [
    "price",
    "Price",
    "fare",
    "Fare",
    "cost",
    "Cost"
  ], 0)),
  provider: pick(route, [
    "bus_name",
    "Bus_name",
    "train_name",
    "Train_name",
    "airline",
    "Airline",
    "name",
    "Name"
  ], type)
});

const extractRouteRequest = (message) => {
  const match =
    message.match(/from\s+([a-zA-Z\s.]+?)\s+to\s+([a-zA-Z\s.]+?)(?:[?.!,]|$)/i);

  if (!match) return null;

  return {
    source: match[1].trim(),
    destination: match[2].trim()
  };
};

const getRoutesFromDatabase = async (source, destination) => {
  if (mongoose.connection.readyState !== 1) {
    return [];
  }

  const query =
    routeQuery(source, destination);

  const [
    buses,
    trains,
    flights
  ] = await Promise.all([
    Bus.collection.find(query).limit(5).toArray(),
    Train.collection.find(query).limit(5).toArray(),
    Flight.collection.find(query).limit(5).toArray()
  ]);

  return [
    ...buses.map(route => normalizeRoute(route, "bus")),
    ...trains.map(route => normalizeRoute(route, "train")),
    ...flights.map(route => normalizeRoute(route, "flight"))
  ];
};

const buildPrompt = (message) => `
You are AI Travel Concierge for a smart travel assistant app.
Help with Indian travel routes, itinerary ideas, transport choices, delays, budgets, food spots, and safety.
Keep answers practical, friendly, and concise. Use bullet points when helpful.
If the user asks for live ticket availability or exact current prices, explain that they should verify before booking.

User message:
${message}
`;

const fallbackReply = async (message) => {
  const lowerMessage =
    message.toLowerCase();

  const routeRequest =
    extractRouteRequest(message);

  if (routeRequest) {
    const routes =
      await getRoutesFromDatabase(
        routeRequest.source,
        routeRequest.destination
      );

    if (routes.length > 0) {
      const sortedRoutes =
        [...routes].sort((a, b) => a.price - b.price);

      const cheapest =
        sortedRoutes[0];

      const routeLines =
        sortedRoutes
          .slice(0, 3)
          .map((route, index) =>
            `${index + 1}. ${route.type.toUpperCase()} - ${route.provider}: ${route.departure || "time N/A"} to ${route.arrival || "time N/A"}, ${route.duration || "duration N/A"}, Rs. ${route.price || "N/A"}`
          )
          .join("\n");

      return `I found ${routes.length} database route option(s) from ${routeRequest.source} to ${routeRequest.destination}.\n\n${routeLines}\n\nBest budget pick: ${cheapest.type.toUpperCase()} by ${cheapest.provider} for Rs. ${cheapest.price}.`;
    }

    return `I could not find database routes from ${routeRequest.source} to ${routeRequest.destination}. Try checking the exact city spelling from the source and destination dropdowns.`;
  }

  if (lowerMessage.includes("delay") || lowerMessage.includes("rain")) {
    return "For weather or delay risk, prefer trains or buses over flights during heavy rain, leave buffer time between connections, and check alerts before starting. If you share your source and destination, I can compare database route options.";
  }

  if (lowerMessage.includes("budget") || lowerMessage.includes("cheap")) {
    return "For a budget-friendly trip, compare bus and train routes first, travel outside peak hours, and keep one flexible backup option. Ask me like: `budget route from Hyderabad to Bangalore`.";
  }

  if (lowerMessage.includes("itinerary") || lowerMessage.includes("trip")) {
    return "I can help build an itinerary. Share the destination, number of days, budget, and travel style, and I'll suggest a practical day-by-day plan.";
  }

  return "I can help with routes, transport choices, budgets, itineraries, food spots, and travel delays. Tell me your source, destination, date, and preference: fastest, cheapest, or balanced.";
};

export const processChat = async (message) => {
  const prompt =
    message?.trim();

  if (!prompt) {
    return "Please enter a travel question so I can help.";
  }

  const apiKey =
    process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return fallbackReply(prompt);
  }

  try {
    if (providerDisabled) {
      return fallbackReply(prompt);
    }

    const genAI =
      new GoogleGenerativeAI(apiKey);

    const model =
      genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || "gemini-pro"
      });

    const result =
      await model.generateContent(buildPrompt(prompt));

    const response =
      await result.response;

    const text =
      response.text();

    return text?.trim() || await fallbackReply(prompt);
  } catch (error) {
    if (
      error.message?.includes("API key") ||
      error.message?.includes("PERMISSION_DENIED") ||
      error.message?.includes("403")
    ) {
      providerDisabled = true;
    }

    console.log(
      "Gemini Error:",
      error.message
    );

    return fallbackReply(prompt);
  }
};

import express from "express";
import mongoose from "mongoose";

import Bus from "../models/Bus.js";
import Train from "../models/Train.js";
import Flight from "../models/Flight.js";

const router = express.Router();

const normalizeCity = (value = "") =>
  value.trim();

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const cityAliases = {
  bangalore: [
    "Bangalore",
    "Bengaluru"
  ],
  bengaluru: [
    "Bengaluru",
    "Bangalore"
  ]
};

const cityMatches = (value = "") => {
  const normalized =
    normalizeCity(value);

  const aliases =
    cityAliases[normalized.toLowerCase()] ||
    [normalized];

  return aliases.map(alias => ({
    $regex: `^${escapeRegex(alias)}$`,
    $options: "i"
  }));
};

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

const matchAnyField = (fields, value) => ({
  $or: fields.flatMap(field =>
    cityMatches(value).map(match => ({
      [field]: match
    }))
  )
});

const ignoredCollections = new Set([
  "trips",
  "users",
  "sessions"
]);

const inferType = (collectionName, route, fallback = "bus") => {
  const explicitType =
    pick(route, [
      "type",
      "Type",
      "mode",
      "Mode",
      "transport",
      "Transport"
    ]);

  const value =
    explicitType ||
    collectionName;

  const lowerValue =
    value.toString().toLowerCase();

  if (lowerValue.includes("flight")) return "flight";
  if (lowerValue.includes("train")) return "train";
  if (lowerValue.includes("bus")) return "bus";

  return fallback;
};

const listSearchableCollections = async () => {
  const collections =
    await mongoose.connection.db.listCollections().toArray();

  return collections
    .map(collection => collection.name)
    .filter(name => !ignoredCollections.has(name));
};

const findByRouteInCollection = (collectionName, source, destination) =>
  mongoose.connection.db
    .collection(collectionName)
    .find({
      $and: [
        matchAnyField(sourceFields, source),
        matchAnyField(destinationFields, destination)
      ]
    })
    .toArray();

const findByRoute = async (Model, source, destination, fallbackType) => {
  const routes =
    await findByRouteInCollection(
      Model.collection.name,
      source,
      destination
    );

  return routes.map(route => ({
    route,
    type: inferType(Model.collection.name, route, fallbackType)
  }));
};

const findRoutesAcrossCollections = async (source, destination) => {
  const collectionNames =
    await listSearchableCollections();

  const results =
    await Promise.all(
      collectionNames.map(async collectionName => {
        const routes =
          await findByRouteInCollection(
            collectionName,
            source,
            destination
          );

        return routes.map(route => ({
          route,
          type: inferType(collectionName, route)
        }));
      })
    );

  return results.flat();
};

const pick = (route, fields, fallback = "") => {
  for (const field of fields) {
    if (route[field] !== undefined && route[field] !== null && route[field] !== "") {
      return route[field];
    }
  }

  return fallback;
};

const timeToMinutes = (value = "") => {
  if (!value) return 0;

  const date =
    new Date(`1970-01-01 ${value}`);

  if (!Number.isNaN(date.getTime())) {
    return date.getHours() * 60 + date.getMinutes();
  }

  const [hours = 0, minutes = 0] =
    value.toString().split(":").map(Number);

  return hours * 60 + minutes;
};

const calculateDuration = (departure, arrival) => {
  const departureMinutes =
    timeToMinutes(departure);

  const arrivalMinutes =
    timeToMinutes(arrival);

  if (!departureMinutes || !arrivalMinutes) {
    return "";
  }

  const minutes =
    arrivalMinutes >= departureMinutes
      ? arrivalMinutes - departureMinutes
      : 24 * 60 - departureMinutes + arrivalMinutes;

  const hours =
    Math.floor(minutes / 60);

  return `${hours}h ${minutes % 60}m`;
};

const getCityValues = async (Model) => {
  const fields = [
    ...sourceFields,
    ...destinationFields
  ];

  const values =
    await Promise.all(
      fields.map(field =>
        Model.collection.distinct(field)
      )
    );

  return values
    .flat()
    .filter(Boolean);
};

const toRoute = (item, type) => {
  const route =
    typeof item.toObject === "function"
      ? item.toObject()
      : item;

  const departureTime =
    pick(route, [
      "departure_time",
      "Departure",
      "Departure_time",
      "dep_time"
    ]);

  const arrivalTime =
    pick(route, [
      "arrival_time",
      "Arrival",
      "Arrival_time"
    ]);

  return {
    id: route._id.toString(),
    type,
    source: pick(route, sourceFields),
    destination: pick(route, destinationFields),
    departure_time: departureTime,
    arrival_time: arrivalTime,
    duration:
      pick(route, [
        "duration",
        "Duration"
      ]) || calculateDuration(departureTime, arrivalTime),
    price: Number(pick(route, [
      "price",
      "Price",
      "fare",
      "Fare",
      "cost",
      "Cost"
    ], 0)),
    provider:
      pick(route, [
        "bus_name",
        "Bus_name",
        "train_name",
        "Train_name",
        "airline",
        "Airline",
        "name",
        "Name"
      ]) ||
      type
  };
};

//
// GET ROUTES
//
router.get(
  "/routes",
  async (req, res) => {

    try {

      const {
        source,
        destination
      } = req.query;

      if (!source || !destination) {
        return res.status(400).json({
          success: false,
          message: "Source and destination are required"
        });
      }

      const buses =
        await findByRoute(Bus, source, destination, "bus");

      const trains =
        await findByRoute(Train, source, destination, "train");

      const flights =
        await findByRoute(Flight, source, destination, "flight");

      const discoveredRoutes =
        buses.length || trains.length || flights.length
          ? []
          : await findRoutesAcrossCollections(source, destination);

      const routes = [
        ...buses.map(item =>
          toRoute(item.route, item.type)
        ),
        ...trains.map(item =>
          toRoute(item.route, item.type)
        ),
        ...flights.map(item =>
          toRoute(item.route, item.type)
        ),
        ...discoveredRoutes.map(item =>
          toRoute(item.route, item.type)
        )
      ];

      res.json({
        success: true,
        routes
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

router.get(
  "/buses",
  async (req, res) => {
    try {
      const buses =
        await findByRoute(Bus, req.query.source, req.query.destination, "bus");

      res.json({
        success: true,
        buses: buses.map(item => item.route)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

router.get(
  "/trains",
  async (req, res) => {
    try {
      const trains =
        await findByRoute(Train, req.query.source, req.query.destination, "train");

      res.json({
        success: true,
        trains: trains.map(item => item.route)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

router.get(
  "/flights",
  async (req, res) => {
    try {
      const flights =
        await findByRoute(Flight, req.query.source, req.query.destination, "flight");

      res.json({
        success: true,
        flights: flights.map(item => item.route)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

//
// GET ALL CITIES
//
router.get(
  "/cities",
  async (req, res) => {

    try {

      const [
        busCities,
        trainCities,
        flightCities
      ] = await Promise.all([
        getCityValues(Bus),
        getCityValues(Train),
        getCityValues(Flight)
      ]);

      const cities = new Set();

      busCities.forEach(city =>
        cities.add(city)
      );

      trainCities.forEach(city =>
        cities.add(city)
      );

      flightCities.forEach(city =>
        cities.add(city)
      );

      res.json({
        success: true,
        cities: Array.from(cities).sort()
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

export default router;

import express from "express";

import Bus from "../models/Bus.js";
import Train from "../models/Train.js";
import Flight from "../models/Flight.js";

const router = express.Router();


/* ===============================
   GET ALL AVAILABLE CITIES
================================ */

router.get("/cities", async (req, res) => {
  try {
    const [
      busSources,
      busDestinations,
      trainSources,
      trainDestinations,
      flightSources,
      flightDestinations,
    ] = await Promise.all([
      Bus.distinct("source"),
      Bus.distinct("destination"),

      Train.distinct("source"),
      Train.distinct("destination"),

      Flight.distinct("source"),
      Flight.distinct("destination"),
    ]);

    const cities = [
      ...busSources,
      ...busDestinations,
      ...trainSources,
      ...trainDestinations,
      ...flightSources,
      ...flightDestinations,
    ]
      .filter(Boolean)
      .map((city) => city.trim())
      .filter((city, index, array) =>
        array.findIndex(
          (item) =>
            item.toLowerCase() === city.toLowerCase()
        ) === index
      )
      .sort((a, b) => a.localeCompare(b));

    res.json({
      success: true,
      cities,
    });

  } catch (error) {
    console.error("City loading error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
      cities: [],
    });
  }
});


/* ===============================
   SEARCH TRANSPORT
================================ */

router.get("/search", async (req, res) => {
  try {
    const { source, destination } = req.query;

    const buses = await Bus.find({
      source,
      destination,
    });

    const trains = await Train.find({
      source,
      destination,
    });

    const flights = await Flight.find({
      source,
      destination,
    });

    res.json({
      success: true,
      buses,
      trains,
      flights,
    });

  } catch (error) {
    console.error("Transport search error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


export default router;
import express from "express";

import Bus from "../models/Bus.js";
import Train from "../models/Train.js";
import Flight from "../models/Flight.js";

const router = express.Router();

//
// GET ROUTES
//
router.get(
  "/routes",
  async (req, res) => {

    try {

      let {
        source,
        destination
      } = req.query;

      source =
        source?.trim().toLowerCase();

      destination =
        destination?.trim().toLowerCase();

      const buses =
        await Bus.find({
          source,
          destination
        });

      const trains =
        await Train.find({
          source,
          destination
        });

      const flights =
        await Flight.find({
          source,
          destination
        });

      const routes = [

        ...buses.map(item => ({
          ...item.toObject(),
          type: "bus"
        })),

        ...trains.map(item => ({
          ...item.toObject(),
          type: "train"
        })),

        ...flights.map(item => ({
          ...item.toObject(),
          type: "flight"
        }))
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

//
// GET ALL CITIES
//
router.get(
  "/cities",
  async (req, res) => {

    try {

      const busCities =
        await Bus.find(
          {},
          {
            source: 1,
            destination: 1
          }
        );

      const trainCities =
        await Train.find(
          {},
          {
            source: 1,
            destination: 1
          }
        );

      const flightCities =
        await Flight.find(
          {},
          {
            source: 1,
            destination: 1
          }
        );

      const cities = new Set();

      //
      // BUS
      //
      busCities.forEach(item => {

        if (item.source)
          cities.add(item.source);

        if (item.destination)
          cities.add(item.destination);
      });

      //
      // TRAIN
      //
      trainCities.forEach(item => {

        if (item.source)
          cities.add(item.source);

        if (item.destination)
          cities.add(item.destination);
      });

      //
      // FLIGHT
      //
      flightCities.forEach(item => {

        if (item.source)
          cities.add(item.source);

        if (item.destination)
          cities.add(item.destination);
      });

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
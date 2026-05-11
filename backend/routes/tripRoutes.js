import express from "express";

import Trip from "../models/Trip.js";

const router = express.Router();

//
// BOOK TRIP
//
router.post(
  "/book",
  async (req, res) => {

    try {

      const trip =
        await Trip.create(req.body);

      res.status(201).json({
        success: true,
        trip
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
// GET ALL TRIPS
//
router.get(
  "/",
  async (req, res) => {

    try {

      const trips =
        await Trip.find().sort({
          createdAt: -1
        });

      res.json({
        success: true,
        trips
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
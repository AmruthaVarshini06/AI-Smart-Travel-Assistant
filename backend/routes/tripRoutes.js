import express from "express";

import Trip from "../models/Trip.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

//
// BOOK TRIP
//
router.post(
  "/book",
  authMiddleware,
  async (req, res) => {
    try {
      const trip = await Trip.create({
        ...req.body,

        // Get the logged-in user's ID from the JWT
        userId: req.user.id
      });

      res.status(201).json({
        success: true,
        trip
      });

    } catch (error) {
      console.error("Book trip error:", error);

      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);


//
// GET CURRENT USER'S TRIPS ONLY
//
router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const trips = await Trip.find({
        userId: req.user.id
      }).sort({
        createdAt: -1
      });

      res.json({
        success: true,
        trips
      });

    } catch (error) {
      console.error("Get trips error:", error);

      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);


//
// DELETE ONLY CURRENT USER'S TRIP
//
router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const trip = await Trip.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id
      });

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trip not found or access denied"
        });
      }

      res.json({
        success: true,
        message: "Trip deleted successfully"
      });

    } catch (error) {
      console.error("Delete trip error:", error);

      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

export default router;
const express = require("express");

const router = express.Router();

const Bus = require("../models/Bus");
const Train = require("../models/Train");
const Flight = require("../models/Flight");

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
      buses,
      trains,
      flights,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
import mongoose from "mongoose";

const flightSchema =
  new mongoose.Schema({

    source: String,

    destination: String,

    departure_time: String,

    arrival_time: String,

    duration: String,

    price: Number,

    airline: String
  });

const Flight = mongoose.model(
  "Flight",
  flightSchema
);

export default Flight;
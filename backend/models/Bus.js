import mongoose from "mongoose";

const busSchema =
  new mongoose.Schema({

    source: String,

    destination: String,

    departure_time: String,

    arrival_time: String,

    duration: String,

    price: Number,

    bus_name: String
  });

const Bus = mongoose.model(
  "Bus",
  busSchema
);

export default Bus;
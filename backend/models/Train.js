import mongoose from "mongoose";

const trainSchema =
  new mongoose.Schema({

    source: String,

    destination: String,

    departure_time: String,

    arrival_time: String,

    duration: String,

    price: Number,

    train_name: String
  });

const Train = mongoose.model(
  "Train",
  trainSchema
);

export default Train;
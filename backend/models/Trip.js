import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    source: String,

    destination: String,

    date: String,

    status: String,

    mode: String,

    cost: Number,

    full_route: Object
  },
  {
    timestamps: true
  }
);

const Trip = mongoose.model(
  "Trip",
  tripSchema
);

export default Trip;
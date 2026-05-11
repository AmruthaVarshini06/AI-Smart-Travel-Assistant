const Bus = require("../models/Bus");

const getBusRoutes = async (
  source,
  destination,
  date
) => {

  try {

    const buses = await Bus.find({
      source: source.trim().toLowerCase(),
      destination: destination.trim().toLowerCase(),
      Date: date
    });

    return buses;

  } catch (error) {

    console.log(error.message);

    return [];
  }
};

module.exports = {
  getBusRoutes
};
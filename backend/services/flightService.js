const Flight = require("../models/Flight");

const getFlightRoutes = async (
  source,
  destination,
  date
) => {

  try {

    const flights = await Flight.find({
      source: source.trim().toLowerCase(),
      destination: destination.trim().toLowerCase(),
      Date: date
    });

    return flights;

  } catch (error) {

    console.log(error.message);

    return [];
  }
};

module.exports = {
  getFlightRoutes
};
const Train = require("../models/Train");

const getTrainRoutes = async (
  source,
  destination,
  date
) => {

  try {

    const trains = await Train.find({
      source: source.trim().toLowerCase(),
      destination: destination.trim().toLowerCase(),
      Date: date
    });

    return trains;

  } catch (error) {

    console.log(error.message);

    return [];
  }
};

module.exports = {
  getTrainRoutes
};
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export async function getBusData(
  source?: string,
  destination?: string
) {

  try {

    const response = await axios.get(
      `${API_BASE_URL}/transport/buses`,
      {
        params: {
          source,
          destination
        }
      }
    );

    return response.data.buses || [];

  } catch (error) {

    console.log("BUS ERROR:", error);

    return [];
  }
}

export async function getTrainData(
  source?: string,
  destination?: string
) {

  try {

    const response = await axios.get(
      `${API_BASE_URL}/transport/trains`,
      {
        params: {
          source,
          destination
        }
      }
    );

    return response.data.trains || [];

  } catch (error) {

    console.log("TRAIN ERROR:", error);

    return [];
  }
}

export async function getFlightData(
  source?: string,
  destination?: string
) {

  try {

    const response = await axios.get(
      `${API_BASE_URL}/transport/flights`,
      {
        params: {
          source,
          destination
        }
      }
    );

    return response.data.flights || [];

  } catch (error) {

    console.log("FLIGHT ERROR:", error);

    return [];
  }
}
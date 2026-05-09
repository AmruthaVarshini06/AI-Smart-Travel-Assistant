import axios from "axios";

export const getFlightRoutes = async (source, destination, date) => {

  try {

    const response = await axios.get(
      `${process.env.SUPABASE_URL}/rest/v1/flight`,
      {
        params: {
          Source: `eq.${source}`,
          Destination: `eq.${destination}`
        },

        headers: {
          apikey: process.env.SUPABASE_API_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_API_KEY}`
        }
      }
    );

    return response.data;

  } catch (error) {

    console.log(error.response?.data || error.message);

    return [];
  }
};
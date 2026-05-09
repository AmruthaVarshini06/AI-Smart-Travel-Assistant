import axios from "axios";

export const getTrainRoutes = async ( source, destination, date) => {

  try {

    const response = await axios.get(
      `${process.env.SUPABASE_URL}/rest/v1/train`,
      {
        params: {
          Source: `eq.${source}`,
          Destination: `eq.${destination}`,
          Date: `eq.${date}`
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
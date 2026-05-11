import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export async function getAllCities() {

  try {

    const response = await axios.get(
      `${API_BASE_URL}/transport/cities`
    );

    return response.data.cities || [];

  } catch (error) {

    console.log(error);

    return [];
  }
}
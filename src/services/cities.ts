import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export const getAllCities = async (): Promise<string[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/transport/cities`
    );

    return response.data.cities || [];
  } catch (error) {
    console.error("Error loading cities:", error);
    return [];
  }
};
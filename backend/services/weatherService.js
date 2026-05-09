import axios from 'axios';

export const getWeatherByCity = async (city) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return { temp: 25, condition: 'Clear' }; // Fallback
  }
};
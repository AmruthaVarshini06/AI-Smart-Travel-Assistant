"use client";

import { WeatherCondition } from '@/types/travel';

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY; 

export const fetchWeather = async (city: string): Promise<{
  temp: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
}> => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  if (!apiKey || apiKey === 'placeholder-key') {
    console.warn("Weather API Key missing. Using simulated data.");
    // Fallback simulation
    await new Promise(resolve => setTimeout(resolve, 600));
    const conditions: WeatherCondition[] = ['Clear', 'Rain', 'Storm'];
    return {
      temp: Math.floor(Math.random() * 15) + 15,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      humidity: 65 + Math.floor(Math.random() * 20),
      windSpeed: 10 + Math.floor(Math.random() * 15)
    };
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    
    if (!response.ok) throw new Error("Weather data unavailable");
    
    const data = await response.json();
    const mainCondition = data?.weather?.[0]?.main || "Clear";
    
    let condition: WeatherCondition = 'Clear';
    if (mainCondition === 'Rain' || mainCondition === 'Drizzle') condition = 'Rain';
    if (mainCondition === 'Thunderstorm') condition = 'Storm';

    return {
      temp: Math.round(data.main.temp),
      condition,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6) // Convert m/s to km/h
    };
  } catch (error) {
    console.error("Weather API Error:", error);
    throw error;
  }
};
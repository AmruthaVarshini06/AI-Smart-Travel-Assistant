"use client";

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const transportApi = {
  getRoutes: (params: any) => api.get('/transport/routes', { params }),
  getPredictions: (routeId: string) => api.get(`/transport/predict/${routeId}`),
};

export const weatherApi = {
  getWeather: (city: string) => api.get(`/weather/${city}`),
};

export const aiApi = {
  chat: (message: string) => api.post('/gemini/chat', { message }),
};

export default api;
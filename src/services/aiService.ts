<<<<<<< HEAD
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const processChatQuery = async (query: string) => {
  try {
    const res = await fetch(`${API_URL}/gemini/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: query }),
    });

    const data = await res.json();

    if (data.reply) {
      return data.reply;
    }

    throw new Error('No response from AI');
  } catch (error) {
    console.log('AI fallback triggered');

    // ✅ fallback to your old logic
    return localFallback(query);
  }
};

// Local fallback function for when AI service is unavailable
const localFallback = (query: string): string => {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
    return "Hello! I'm your AI Travel Assistant. How can I help you plan your trip today?";
  }

  if (lowerQuery.includes('route') || lowerQuery.includes('travel')) {
    return "I can help you find the best routes! Try searching for routes between cities using our search form above.";
  }

  if (lowerQuery.includes('weather')) {
    return "I can check weather conditions for your travel plans. The current weather data is integrated into our route recommendations.";
  }

  if (lowerQuery.includes('hotel') || lowerQuery.includes('stay')) {
    return "For hotel recommendations, I suggest checking popular booking sites. Consider factors like location, price, and amenities.";
  }

  if (lowerQuery.includes('budget')) {
    return "Budget planning is important! Consider transportation costs, accommodation, food, and activities. Our app shows estimated costs for different travel options.";
  }

  return "I'm here to help with your travel planning! You can ask me about routes, weather, hotels, or budget planning. What would you like to know?";
=======
"use client";

import { TravelRoute, WeatherCondition } from '@/types/travel';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with better error handling
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for better error logging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ [Frontend] Axios Error Details:');
    console.error('   Status:', error.response?.status);
    console.error('   Message:', error.response?.data?.message);
    console.error('   Data:', error.response?.data);
    console.error('   Error Code:', error.code);
    
    if (error.code === 'ECONNREFUSED' || error.message.includes('ERR_NETWORK')) {
      console.error('❌ [Frontend] Network Error: Cannot reach backend at', API_BASE_URL);
      console.error('📍 Make sure backend is running on port 5000');
    }
    
    if (error.code === 'ENOTFOUND') {
      console.error('❌ [Frontend] DNS Error: Cannot resolve backend host');
    }
    
    if (error.code === 'ETIMEDOUT') {
      console.error('❌ [Frontend] Timeout: Backend took too long to respond');
    }
    
    return Promise.reject(error);
  }
);

export const getAIRecommendation = (routes: TravelRoute[], weather: WeatherCondition) => {
  if (weather === 'Storm') {
    return routes.find(r => r.segments.every(s => s.mode !== 'flight')) || routes[0];
  }
  
  return routes.reduce((prev, current) => {
    const prevScore = prev.reliabilityScore * 0.6 + (10000 / prev.totalCost) * 0.4;
    const currScore = current.reliabilityScore * 0.6 + (10000 / current.totalCost) * 0.4;
    return currScore > prevScore ? current : prev;
  });
};

export const processChatQuery = async (query: string): Promise<string> => {
  const startTime = Date.now();
  
  try {
    console.log('═'.repeat(80));
    console.log('📤 [Frontend] Sending message to backend:', query);
    console.log('📡 [Frontend] API Base URL:', API_BASE_URL);
    console.log('═'.repeat(80));
    
    // Check if backend is reachable first
    try {
      console.log('🔍 [Frontend] Checking backend health...');
      const healthResponse = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
      console.log('✅ [Frontend] Backend is healthy:', healthResponse.status);
    } catch (healthError: any) {
      console.warn('⚠️ [Frontend] Backend health check failed:', healthError.message);
      console.warn('⚠️ [Frontend] Backend might be down, attempting chat anyway...');
    }
    
    // Call the backend Gemini API for real AI responses
    const response = await apiClient.post(
      '/api/gemini/chat',
      { message: query },
      {
        timeout: 60000 // 60 second timeout for longer responses
      }
    );

    const elapsedTime = Date.now() - startTime;
    console.log('═'.repeat(80));
    console.log('✅ [Frontend] Response received:', response.status, response.statusText);
    console.log('⏱️ [Frontend] Response time:', elapsedTime, 'ms');
    console.log('═'.repeat(80));
    
    // Extract the response data
    if (response.data?.success && response.data?.data) {
      const responseText = response.data.data;
      const responseLength = responseText.length;
      
      console.log('📊 [Frontend] Response length:', responseLength, 'characters');
      console.log('📥 [Frontend] AI response full text:');
      console.log('═'.repeat(80));
      console.log(responseText);
      console.log('═'.repeat(80));
      
      return responseText;
    }
    
    console.error('❌ [Frontend] Invalid response format:', response.data);
    throw new Error(`Invalid response format: ${JSON.stringify(response.data)}`);
  } catch (error: any) {
    console.error('═'.repeat(80));
    console.error('❌ [Frontend] Chat API Error Occurred');
    console.error('═'.repeat(80));
    
    // Better error messages for different scenarios
    let errorMsg = 'Unknown error occurred';
    
    if (error.response?.data?.message) {
      // Backend returned an error
      errorMsg = error.response.data.message;
      console.error('📤 [Backend Error]:', errorMsg);
    } else if (error.code === 'ECONNREFUSED') {
      // Connection refused - backend not running
      errorMsg = `Cannot reach backend at ${API_BASE_URL}. Make sure the backend server is running on port 5000.`;
      console.error('🔴 [Connection Error]:', errorMsg);
      console.error('💡 [Solution] Run: npm run server (in backend directory)');
    } else if (error.code === 'ENOTFOUND') {
      // DNS error
      errorMsg = `Cannot resolve backend host. Check your network connection.`;
      console.error('🔴 [DNS Error]:', errorMsg);
    } else if (error.code === 'ETIMEDOUT') {
      // Timeout
      errorMsg = `Backend is not responding. It might be overloaded or the API key might be invalid.`;
      console.error('⏱️ [Timeout Error]:', errorMsg);
    } else if (error.message.includes('Network Error')) {
      // Network error
      errorMsg = `Network error: ${error.message}. Check your internet connection.`;
      console.error('🌐 [Network Error]:', errorMsg);
    } else {
      errorMsg = error?.message || 'Failed to get AI response';
      console.error('❌ [Error Message]:', errorMsg);
    }
    
    console.error('📋 [Error Details]:', error);
    console.error('═'.repeat(80));
    
    // Re-throw with improved message
    throw new Error(`${errorMsg}`);
  }
>>>>>>> origin/main
};
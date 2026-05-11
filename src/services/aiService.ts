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
};
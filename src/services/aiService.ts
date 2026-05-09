"use client";

import { TravelRoute, WeatherCondition } from '@/lib/mock-data';

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

export const processChatQuery = async (query: string) => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const q = query.toLowerCase();

  // 11. Refuse unrelated topics (politics, coding, etc.)
  const unrelatedKeywords = ['politics', 'coding', 'programming', 'math', 'history', 'science', 'code', 'javascript', 'python'];
  if (unrelatedKeywords.some(k => q.includes(k))) {
    return "I'm your AI Smart Travel Assistant. I specialize in travel planning and cannot assist with unrelated topics. How can I help with your trip today?";
  }

  // 7. Handle "Best way to travel from A to B" or comparisons
  if (q.includes('from') && q.includes('to')) {
    const match = q.match(/from\s+([a-zA-Z\s]+)\s+to\s+([a-zA-Z\s]+)/);
    const source = match ? match[1].trim() : "Origin";
    const dest = match ? match[2].trim() : "Destination";
    
    const capSource = source.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const capDest = dest.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // 10. Format responses as requested (Estimated values)
    return `Travel Options from ${capSource} to ${capDest} (Estimated):

✈ Flight: ₹4,500 | 1.5 hrs (Fastest)
🚆 Train: ₹1,200 | 10 hrs (Cheapest)
🚌 Bus: ₹1,500 | 12 hrs

Recommendation: Train is the most economical option, while flight is best for saving time.`;
  }

  // 4. Suggest best options based on specific needs
  if (q.includes('cheap') || q.includes('budget')) {
    return "For a budget-friendly trip, I recommend booking sleeper class trains or state-run buses. Estimated savings can reach 40% if booked 15 days in advance. Would you like me to find a specific route?";
  }

  if (q.includes('fast') || q.includes('quick')) {
    return "Flights are the fastest for distances over 400km. For shorter trips, express cabs or high-speed rail are more efficient as they avoid airport check-in times. Which destination are you targeting?";
  }

  // 12. General travel questions / Tips
  if (q.includes('tips')) {
    return `Smart Travel Tips:
• Pack light to avoid extra baggage fees.
• Use offline maps for better navigation.
• Book mid-week for the best flight prices.
• Carry a portable power bank for long journeys.`;
  }

  if (q.includes('visit goa')) {
    return "Best time to visit Goa: November to February (Peak Season). The weather is pleasant (20°C-30°C), perfect for beaches. For budget travel, consider August-September for lush greenery and lower prices.";
  }

  // 8. Clarification for unclear input
  if (q.length < 5 || (!q.includes(' ') && q.length < 10)) {
    return "Could you please provide more details about your travel plans, such as your destination or preferred mode of transport?";
  }

  // Default helpful response
  return "I'm here to help you plan your perfect trip! I can compare travel costs, find the fastest routes, or provide travel tips. What's on your mind?";
};
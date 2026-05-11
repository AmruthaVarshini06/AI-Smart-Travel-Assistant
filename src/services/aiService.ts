"use client";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const aiApi = {
  chat: (message: string) => api.post('/gemini/chat', { message }),
};

const SYSTEM_PROMPT = `
You are an AI Travel Assistant for a travel planning application.

YOUR ROLE:
- Help users plan trips.
- Suggest tourist places.
- Recommend stops along travel routes.
- Provide travel tips, budget ideas, and best times to visit.

INSTRUCTIONS:
- If the user gives a source and destination, suggest interesting places and stops along that specific route.
- Recommend top attractions, hidden gems, and local food spots.
- Keep your answers short, clear, and helpful.
- Always ask follow-up questions to better understand the user's needs.

Always use Markdown for clear formatting.
`;

export const processChatQuery = async (query: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('VITE_GEMINI_API_KEY');

  if (!apiKey || apiKey === 'placeholder-key' || apiKey.trim() === '') {
    return "⚠️ **API Key Missing**: Please add your Gemini API Key in the **Profile** settings to enable live AI responses.\n\n[Get a free key here](https://aistudio.google.com/app/apikey)";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${SYSTEM_PROMPT}\n\nUser Message: ${query}`
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to connect to Gemini API");
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      throw new Error("Empty response from AI model");
    }

    return aiResponse;
  } catch (error: any) {
    console.error("AI Service Error:", error);
    return `❌ **Assistant Error**: ${error.message}. Please verify your API key in Profile settings.`;
  }
};
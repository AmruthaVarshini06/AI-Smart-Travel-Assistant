import axios from "axios";

export const getAIResponse = async (message) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are an AI Travel Assistant.

User Query: ${message}

Give:
- Best travel options
- Tourist places
- Budget tips
- Route suggestions

Keep it simple and useful.`,
              },
            ],
          },
        ],
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini Error:", error.response?.data || error.message);
    throw new Error("AI failed");
  }
};
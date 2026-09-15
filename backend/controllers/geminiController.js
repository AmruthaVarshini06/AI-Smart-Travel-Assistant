import { sendSuccess } from '../utils/responseHelper.js';
import Conversation from "../models/Conversation.js";

// A local knowledge base to answer common questions instantly
const getLocalTravelAnswer = (message) => {
  const q = message.toLowerCase();

  // --- ROUTE QUESTIONS ---
  if (q.includes('delhi') && q.includes('mumbai')) {
    return {
      success: true,
      message: `🚆 **Best Routes from Delhi to Mumbai:**

**✈️ Flight:** ₹3,500 - ₹8,000 | 2.5 hrs
**🚆 Train:** ₹250 - ₹3,000 (Sleeper to 1st AC) | 16 - 20 hrs (Rajdhani Express is fastest)
**🚌 Bus:** ₹500 - ₹2,000 | 15 - 18 hrs (Volvo AC is best)

🛣 **Best Route:** Take the **Rajdhani Express** for comfort, or a **SpiceJet flight** if you are short on time.`
    };
  }

  if (q.includes('goa') && (q.includes('cheapest') || q.includes('train'))) {
    return {
      success: true,
      message: `🚆 **Cheapest Train to Goa from Major Cities:**

🏙️ **From Mumbai:** 
Train: **Konkan Kanya Express** (₹150 - ₹500 Sleeper) | 12 hours.

🏙️ **From Delhi:** 
Train: **Goa Express** (₹300 - ₹1,000 Sleeper) | 24 hours.

🏙️ **From Bangalore:** 
Train: **Yesvantpur - Vasco Express** (₹100 - ₹300 Sleeper) | 10 hours.

💡 **Pro Tip:** Book Tatkal tickets 24 hours in advance for the best rates!`
    };
  }

  if (q.includes('jaipur') && q.includes('weather')) {
    return {
      success: true,
      message: `☀️ **Weather in Jaipur This Week:**

**Current:** Hot & Dry (35°C - 40°C)
**Tomorrow:** Partly Cloudy, High of 38°C
**Next 3 Days:** Clear skies, ideal for visiting Amber Fort & Hawa Mahal. 
🌙 **Nights:** Pleasant at 22°C. Carry light cotton clothes and a water bottle!`
    };
  }

  if (q.includes('kerala') && q.includes('tourist')) {
    return {
      success: true,
      message: `🌴 **Top Tourist Places in Kerala (God's Own Country):**

1. **Alleppey (Alappuzha):** Stay in a traditional Houseboat on the backwaters.
2. **Munnar:** Visit the sprawling tea gardens and misty mountains.
3. **Kochi:** Explore the historic Fort Kochi and Chinese fishing nets.
4. **Varkala:** Relax on the pristine beaches and cliffside resorts.
5. **Thekkady:** Go on a wildlife safari at Periyar National Park.

🍛 **Must Eat:** Karimeen Pollichathu (Pearl Spot Fish) and Puttu-Kadala.`
    };
  }

  if (q.includes('rajasthan') && q.includes('3-day')) {
    return {
      success: true,
      message: `🏰 **Plan a 3-Day Trip to Rajasthan (The Golden Triangle):**

**Day 1: Jaipur (The Pink City)**
- Morning: Visit the majestic **Amber Fort** (Take an elephant ride!).
- Afternoon: Explore the **City Palace** and **Jantar Mantar**.
- Evening: Shop for textiles in **Johari Bazaar**.

**Day 2: Jodhpur / Pushkar (Optional)**
- Drive to Pushkar (2.5 hrs). Visit the **Brahma Temple** and the holy lake.

**Day 3: Back to Jaipur**
- Visit the **Hawa Mahal** (Palace of Winds).
- Enjoy the sunset at **Nahargarh Fort** overlooking the city.`
    };
  }

  // --- DEFAULT FALLBACK ---
  return {
    success: true,
    message: `🌟 **Travel Advice for "${message}"**

While I'm currently running in offline mode (Gemini API is temporarily bypassed), I can tell you that **${message}** is a fantastic place to explore!

💡 **General Tips:**
- Always check the local weather before packing.
- Book your accommodations and train/bus tickets at least 2 weeks in advance during peak seasons.
- Try the local street food for an authentic experience!

If you want specific details, try asking for "Mumbai to Delhi route" or "Food in Goa".`
  };
};

export const chatWithAI = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const response = getLocalTravelAnswer(message);

    sendSuccess(
      res,
      {
        reply: response.message
      },
      "AI response generated"
    );
  } catch (error) {
    next(error);
  }
};

export const chatWithAIStream = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    // Get the local answer
    const response = getLocalTravelAnswer(message);
    const replyText = response.message;

    // Stream it character by character to the frontend
    for (let i = 0; i < replyText.length; i++) {
      const chunk = replyText[i];
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      // Add a tiny delay (30ms) so it looks like it's "thinking" and typing
      await new Promise(resolve => setTimeout(resolve, 30)); 
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('Stream error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
};

export const getConversationHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const conversation = await Conversation.findOne({ userId });

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: []
      });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.messages
    });

  } catch (error) {
    next(error);
  }
};
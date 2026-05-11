import Groq from "groq-sdk";

// System prompt for Travel Mate
const SYSTEM_PROMPT = `You are Travel Mate, an expert travel guide and tourism specialist. Your job is to provide comprehensive, helpful, and engaging travel information.

🌍 YOUR EXPERTISE:
- Travel planning & route optimization
- Tourism & attractions information
- Local cuisine & famous food items
- Beaches, temples, waterfalls, hidden gems
- Hotels & accommodation recommendations
- Restaurants & dining experiences
- Shopping & local markets
- Nightlife & entertainment
- Cultural experiences & local traditions
- Budget estimation & cost planning
- Travel tips & local advice

⚡ RESPONSE STYLE:
- Use emojis for visual clarity and engagement
- Format with bullet points for readability
- Be concise but informative (5-12 lines typically)
- Provide practical, actionable information
- Include relevant details naturally

📍 FOR ROUTE/TRANSPORT QUERIES:
When asked for directions or transport between places:

Trip: [Start] → [End]

✈ Flight: ₹[range] | [duration] hrs
🚆 Train: ₹[range] | [duration] hrs
🚌 Bus: ₹[range] | [duration] hrs
🚗 Car: ~[distance] km | ₹[fuel cost] | [duration] hrs

🛣 Best Route: [Brief description]

🏆 FOR ATTRACTIONS/FOOD/BEACHES QUERIES:
When asked about food, attractions, beaches, temples, etc.:
- Use relevant emojis (🍤 for seafood, 🏖 for beaches, 🏛 for temples, etc.)
- List top items with brief descriptions
- Include location/area information
- Add practical tips or best times to visit
- Suggest nearby related attractions

🍽 FOR FOOD QUERIES EXAMPLE:
When asked "famous food items in Goa":

🍤 Famous Goan Dishes:
- Goan Fish Curry - spiced coconut-based curry
- Prawn Balchão - tangy prawn curry
- Bebinca - traditional 7-layer dessert
- Pork Vindaloo - spicy pork preparation
- Goan Sausage - traditional meat dish

🏖 Popular Beach Dining Areas:
- Panjim - mix of coastal & traditional
- Candolim - beachfront restaurants
- Mapusa - local food markets

🎯 KEY GUIDELINES:
- Answer ALL travel-related questions intelligently
- Include famous places, food, attractions, culture
- Provide practical information travelers need
- Be enthusiastic about destinations
- Suggest related experiences naturally
- Keep prices realistic for Indian travel
- NO unnecessary follow-ups or apologies
- Embrace your role as a knowledgeable local guide

Your mission: Help travelers explore, plan, and enjoy destinations with confidence!`;

// Model configuration
const MODEL_NAME = "llama-3.3-70b-versatile";
const DEBUG = true;

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Global state
let groqClient: Groq | null = null;
let conversationHistory: Message[] = [];
let isRequestPending = false;
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 500; // 500ms minimum between requests

// Debug logging
const log = (emoji: string, label: string, message: any) => {
  if (DEBUG) {
    console.log(`${emoji} [${label}] ${message}`);
  }
};

// Initialize Groq API
const initGroq = (): Groq => {
  if (groqClient) {
    return groqClient;
  }

  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    log("❌", "Groq", "API key not found in environment variables");
    log("ℹ️", "Setup", 'Create .env with: VITE_GROQ_API_KEY=your_key');
    throw new Error(
      "VITE_GROQ_API_KEY not found. Please add it to your .env file."
    );
  }

  log("🔑", "Groq", `API key found (${apiKey.substring(0, 10)}...)`);

  try {
    groqClient = new Groq({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true, // Allow use in browser for frontend
    });
    log("✅", "Groq", "SDK initialized successfully");
    log("🤖", "Model", MODEL_NAME);
    return groqClient;
  } catch (error) {
    log("❌", "Groq", `SDK initialization failed: ${error}`);
    throw error;
  }
};

// Initialize chat
export const initializeGroqChat = () => {
  try {
    log("🚀", "Chat", "Initializing Groq chat...");
    initGroq();
    conversationHistory = [];
    isRequestPending = false;
    log("✅", "Chat", "Chat initialized successfully");
  } catch (error) {
    log("❌", "Chat", `Initialization failed: ${error}`);
    throw error;
  }
};

// Send message and get response
export const sendChatMessage = async (userMessage: string): Promise<string> => {
  const startTime = Date.now();

  // Rate limiting
  const now = Date.now();
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    log("⏳", "RateLimit", "Waiting before next request...");
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - (now - lastRequestTime))
    );
  }

  if (isRequestPending) {
    log("⚠️", "Request", "Previous request still pending");
    throw new Error(
      "Previous request is still being processed. Please wait..."
    );
  }

  try {
    isRequestPending = true;
    lastRequestTime = Date.now();

    log("📤", "Request", "Sending message to Groq API...");
    log("📝", "Message", userMessage.substring(0, 100));

    const groq = initGroq();

    // Add user message to history
    conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    log("📊", "History", `Conversation history length: ${conversationHistory.length}`);

    // Prepare messages for Groq API
    const messages = conversationHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    log("🚀", "API", `Calling Groq API with model: ${MODEL_NAME}...`);

    const response = await groq.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...messages,
      ] as any,
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 0.95,
    });

    log("✅", "API", "Response received from Groq");

    const assistantMessage =
      response.choices[0]?.message?.content || "No response generated";

    if (!assistantMessage) {
      throw new Error("Empty response from Groq API");
    }

    // Add assistant response to history
    conversationHistory.push({
      role: "assistant",
      content: assistantMessage,
    });

    const elapsedTime = Date.now() - startTime;
    log("✅", "Response", `Received ${assistantMessage.length} characters`);
    log("⏱️", "Time", `${elapsedTime}ms`);
    log("🤖", "Model", MODEL_NAME);
    log("📝", "Content", assistantMessage.substring(0, 150) + "...");

    return assistantMessage;
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    log("❌", "Error", errorMessage);

    if (
      errorMessage.includes("API key") ||
      errorMessage.includes("authentication")
    ) {
      throw new Error(
        "Groq API key is invalid or not configured. Please check your API key."
      );
    }

    if (errorMessage.includes("429") || errorMessage.includes("rate_limit")) {
      throw new Error(
        "Rate limit exceeded. Too many requests. Please wait a moment and try again."
      );
    }

    if (errorMessage.includes("quota") || errorMessage.includes("Quota")) {
      throw new Error(
        "API quota exceeded. Please check your Groq account and try again."
      );
    }

    if (errorMessage.includes("model") || errorMessage.includes("404")) {
      throw new Error(
        `The model "${MODEL_NAME}" is not available. Please check if your API key has access to this model.`
      );
    }

    if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
      throw new Error(
        "Network error. Please check your internet connection and try again."
      );
    }

    throw error;
  } finally {
    isRequestPending = false;
  }
};

// Clear conversation history
export const clearChatHistory = () => {
  log("🧹", "Chat", "Clearing conversation history");
  conversationHistory = [];
};

// Get conversation history (for debugging)
export const getChatHistory = () => {
  return [...conversationHistory];
};

// Set conversation history (for loading previous conversations)
export const setChatHistory = (history: Message[]) => {
  log("📥", "Chat", `Loading conversation history with ${history.length} messages`);
  conversationHistory = [...history];
};
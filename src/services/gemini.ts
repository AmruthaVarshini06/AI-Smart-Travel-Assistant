import { GoogleGenerativeAI } from "@google/generative-ai";

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
const MODEL_NAME = "gemini-2.0-flash";
const DEBUG = true;

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Global state
let genAI: GoogleGenerativeAI | null = null;
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

// Initialize Gemini API
const initGemini = (): GoogleGenerativeAI => {
  if (genAI) {
    return genAI;
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    log("❌", "Gemini", "API key not found in environment variables");
    log("ℹ️", "Setup", 'Create .env with: VITE_GEMINI_API_KEY=your_key');
    throw new Error(
      "VITE_GEMINI_API_KEY not found. Please add it to your .env file."
    );
  }

  log("🔑", "Gemini", `API key found (${apiKey.substring(0, 10)}...)`);

  try {
    genAI = new GoogleGenerativeAI(apiKey);
    log("✅", "Gemini", "SDK initialized successfully");
    return genAI;
  } catch (error) {
    log("❌", "Gemini", `SDK initialization failed: ${error}`);
    throw error;
  }
};

// Initialize chat
export const initializeGeminiChat = () => {
  try {
    log("🚀", "Chat", "Initializing chat...");
    initGemini();
    conversationHistory = [];
    isRequestPending = false;
    log("✅", "Chat", "Chat initialized successfully");
  } catch (error) {
    log("❌", "Chat", `Initialization failed: ${error}`);
    throw error;
  }
};

// Send message to Gemini
export const sendChatMessage = async (userMessage: string): Promise<string> => {
  // Validate input
  if (!userMessage.trim()) {
    throw new Error("Message cannot be empty");
  }

  // Prevent duplicate requests
  if (isRequestPending) {
    log("⚠️", "Request", "Request already pending, ignoring duplicate");
    throw new Error(
      "A request is already being processed. Please wait for the response."
    );
  }

  // Rate limiting
  const timeSinceLastRequest = Date.now() - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    log("⏳", "RateLimit", `Waiting ${waitTime}ms...`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  isRequestPending = true;
  lastRequestTime = Date.now();

  try {
    log("📤", "Request", `Sending: "${userMessage.substring(0, 50)}..."`);
    log("🤖", "Model", MODEL_NAME);

    // Get or initialize Gemini
    const gAI = initGemini();

    // Add user message to history
    conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    log("📊", "History", `Messages in history: ${conversationHistory.length}`);

    // Get model
    const model = gAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: SYSTEM_PROMPT,
    });

    log("🔧", "Model", `Configured with system prompt`);

    // Build conversation for API
    const contents = conversationHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [
        {
          text: msg.content,
        },
      ],
    }));

    log("🌐", "API", "Calling generateContent...");

    // Call API
    const result = await model.generateContent({
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.95,
        topK: 40,
      },
    });

    // Extract response
    const response = result.response.text();

    if (!response || response.trim().length === 0) {
      throw new Error("Empty response from Gemini API");
    }

    log("✅", "Response", `Received ${response.length} characters`);
    log("📝", "Content", response.substring(0, 100) + "...");

    // Add to history
    conversationHistory.push({
      role: "assistant",
      content: response,
    });

    return response;
  } catch (error) {
    // Remove last user message on error
    if (conversationHistory.length > 0) {
      conversationHistory.pop();
    }

    const errorMessage =
      error instanceof Error ? error.message : String(error);
    log("❌", "Error", errorMessage);

    // Provide helpful error messages
    if (errorMessage.includes("API key")) {
      throw new Error(
        "API Key Error: VITE_GEMINI_API_KEY is invalid or not set. Please check your .env file."
      );
    }

    if (errorMessage.includes("429")) {
      throw new Error(
        "Rate Limited: Too many requests. Please wait a moment and try again."
      );
    }

    if (errorMessage.includes("RESOURCE_EXHAUSTED")) {
      throw new Error(
        "Quota Exceeded: Daily API quota exhausted. Please try again tomorrow."
      );
    }

    if (errorMessage.includes("not found") || errorMessage.includes("404")) {
      throw new Error(
        `Model Error: The model "${MODEL_NAME}" is not available. Please check if your API key has access to this model.`
      );
    }

    if (errorMessage.includes("permission")) {
      throw new Error(
        "Permission Error: Your API key doesn't have permission to use the Gemini API."
      );
    }

    // Generic error
    throw new Error(`Gemini API Error: ${errorMessage}`);
  } finally {
    isRequestPending = false;
  }
};

// Reset chat
export const resetGeminiChat = () => {
  log("🔄", "Chat", "Resetting chat...");
  conversationHistory = [];
  isRequestPending = false;
  log("✅", "Chat", "Chat reset");
};

// Get conversation history
export const getConversationHistory = () => conversationHistory;

// Get API status
export const getGeminiStatus = () => {
  return {
    initialized: genAI !== null,
    model: MODEL_NAME,
    historyLength: conversationHistory.length,
    isPending: isRequestPending,
  };
};
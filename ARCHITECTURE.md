# System Architecture & Communication Flow

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Frontend)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  React + TypeScript + Tailwind CSS                  │   │
│  │  http://localhost:5173                              │   │
│  │                                                      │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │  AIAssistant Component (Chat UI)           │    │   │
│  │  │  - User input form                         │    │   │
│  │  │  - Message display                         │    │   │
│  │  │  - Loading states                          │    │   │
│  │  │  - Error handling                          │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  │                        ↓                            │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │  aiService.ts (API Service)                │    │   │
│  │  │  - processChatQuery()                      │    │   │
│  │  │  - Axios HTTP client                       │    │   │
│  │  │  - Error handling & logging                │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                        ↓ HTTP POST                          │
│   (http://localhost:5000/api/gemini/chat)                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               Backend Server (Node.js + Express)            │
│  http://localhost:5000                                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  server.js (Express App)                            │   │
│  │  - CORS enabled                                     │   │
│  │  - JSON parsing middleware                          │   │
│  │  - Request logging                                  │   │
│  │  - Error handling                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                        ↓                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Routes (/api/gemini)                               │   │
│  │  geminiRoutes.js: POST /chat                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                        ↓                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Controller                                         │   │
│  │  geminiController.js: chatWithAI()                  │   │
│  │  - Validate input                                   │   │
│  │  - Error handling                                   │   │
│  │  - Response formatting                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                        ↓                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Service Layer                                      │   │
│  │  geminiService.js                                   │   │
│  │  - processChat()                                    │   │
│  │  - Gemini API calls                                │   │
│  │  - Response processing                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                        ↓                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  External API (Google Gemini)                       │   │
│  │  https://generativelanguage.googleapis.com/...      │   │
│  └─────────────────────────────────────────────────────┘   │
│                        ↑                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Response flows back through layers                 │   │
│  │  formatted as JSON                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                        ↑ HTTP Response                      │
│   (JSON with success, message, data fields)                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Request/Response Flow

### 1. User Action (Frontend)
```javascript
// User types "Trip from Mumbai to Goa" and clicks Send
// AIAssistant.tsx
handleSend() called
  ↓
  Display user message in chat
  ↓
  processChatQuery(messageText) called
```

### 2. Frontend HTTP Request
```javascript
// src/services/aiService.ts
axios.post(
  'http://localhost:5000/api/gemini/chat',
  { message: "Trip from Mumbai to Goa" },
  { timeout: 60000 }
)
```

**Log Output:**
```
📤 [Frontend] Sending message to backend: Trip from Mumbai to Goa
📡 [Frontend] API Base URL: http://localhost:5000
🔍 [Frontend] Checking backend health...
✅ [Frontend] Backend is healthy: 200
```

### 3. Backend Receipt
```javascript
// backend/routes/geminiRoutes.js
router.post('/chat', chatWithAI)
  ↓
// backend/controllers/geminiController.js
chatWithAI(req, res)
  ↓
  Validate request
  ↓
  Log: 📨 [Controller] Received message
  ↓
  processChat(message)
```

**Log Output:**
```
📨 [Backend] POST /api/gemini/chat
📝 Message: "Trip from Mumbai to Goa"
📨 [Controller] Received message from frontend
🔄 [Controller] Processing with Gemini service...
```

### 4. Gemini API Call
```javascript
// backend/services/geminiService.js
fetch('https://generativelanguage.googleapis.com/...', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: systemPrompt + userMessage }] }],
    generationConfig: { maxOutputTokens: 2048, temperature: 0.7 }
  })
})
```

**Log Output:**
```
🔄 Processing chat message...
📝 User message: Trip from Mumbai to Goa
🚀 Sending request to Gemini API...
```

### 5. Gemini Response
```
Gemini API processes request (5-15 seconds)
Returns: { candidates: [{ content: { parts: [{ text: "..." }] } }] }

✅ Gemini response received
📊 Response length: 1234 characters
📤 Full response: [complete response text]
```

### 6. Backend Response
```javascript
// backend/utils/responseHelper.js
sendSuccess(res, responseText, 'AI response generated', 200)

// Sends back:
{
  success: true,
  message: 'AI response generated successfully',
  data: "Full response text from Gemini..."
}
```

**Log Output:**
```
✅ [Controller] Gemini response received
📤 [Controller] Full response being sent to frontend
```

### 7. Frontend Receipt
```javascript
// src/services/aiService.ts
response.data?.success && response.data?.data
  ↓
  Validate response
  ↓
  Log: ✅ [Frontend] Response received
  ↓
  Return responseText
```

**Log Output:**
```
✅ [Frontend] Response received: 200
⏱️ [Frontend] Response time: 2345 ms
📊 [Frontend] Response length: 1234 characters
📥 [Frontend] AI response full text: [response]
```

### 8. Display in UI
```javascript
// src/components/travel/AIAssistant.tsx
setMessages(prev => [...prev, { 
  role: 'ai', 
  content: response 
}])
  ↓
  React renders message
  ↓
  Auto-scroll to latest message
  ↓
  ✅ Response displays in chat
```

---

## Error Handling Flow

### Scenario 1: Backend Not Running

```
User sends message
  ↓
Frontend tries: POST http://localhost:5000/api/gemini/chat
  ↓
Connection refused (ECONNREFUSED)
  ↓
// src/services/aiService.ts catches error
if (error.code === 'ECONNREFUSED') {
  errorMsg = "Cannot reach backend at http://localhost:5000..."
}
  ↓
// src/components/travel/AIAssistant.tsx
setMessages with error: "❌ Backend Server Not Reachable..."
  ↓
User sees helpful error message with solution
```

### Scenario 2: Invalid Gemini API Key

```
Frontend sends message to backend
  ↓
Backend receives: "Trip from Mumbai to Goa"
  ↓
Backend calls Gemini API with invalid key
  ↓
Gemini returns: 401 Unauthorized
  ↓
// backend/services/geminiService.js catches
throw new Error("Gemini API Error: Invalid API Key")
  ↓
// backend/controllers/geminiController.js catches
sendError(res, "AI Error: Invalid API Key", 500)
  ↓
Frontend receives: { success: false, message: "AI Error: ..." }
  ↓
User sees: "❌ Gemini API Key Not Configured..."
```

### Scenario 3: Response Timeout

```
Frontend sends message with 60-second timeout
  ↓
Backend processes request
  ↓
Gemini API takes > 60 seconds
  ↓
Frontend timeout triggers
  ↓
// src/services/aiService.ts
error.code === 'ETIMEDOUT'
  ↓
// src/components/travel/AIAssistant.tsx
setMessages with error about timeout
  ↓
User sees: "Backend is not responding..."
```

---

## Data Structures

### Frontend Request
```typescript
interface ChatRequest {
  message: string;
}

// Example:
{
  "message": "Trip from Mumbai to Goa"
}
```

### Backend Response
```typescript
interface ChatResponse {
  success: boolean;
  message: string;
  data: string; // AI response text
}

// Example:
{
  "success": true,
  "message": "AI response generated successfully",
  "data": "🚂 **TRAIN OPTIONS:**\n- Express Train...\n..."
}
```

### Error Response
```typescript
interface ErrorResponse {
  success: false;
  message: string;
  error?: {
    name: string;
    stack: string;
    url: string;
    method: string;
  };
  timestamp: string;
}

// Example:
{
  "success": false,
  "message": "GEMINI_API_KEY not configured",
  "timestamp": "2026-05-10T10:30:00Z"
}
```

---

## Configuration Points

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

### Backend (.env)
```
PORT=5000
GEMINI_API_KEY=AIzaSy...
NODE_ENV=development
```

### Timeout Settings
```
Frontend: 60000ms (src/services/aiService.ts)
Backend: None (Gemini API timeout is 30s)
```

### Response Size
```
Max output tokens: 2048 (backend/services/geminiService.js)
Frontend max storage: Limited by browser memory
```

---

## Performance Considerations

### Request Size
- Typical: 50-500 bytes
- Max: ~4KB (with system prompt included)

### Response Size
- Typical: 500-5000 bytes
- Max: ~50KB (2048 tokens)

### Latency
1. Frontend → Backend: ~10-50ms (local)
2. Backend → Gemini: 5-15 seconds (API processing)
3. Total: 5-15 seconds first response

### Connection Pool
- Axios: Reuses TCP connections
- Keep-alive: Enabled by default

---

## Security Considerations

### CORS
- Enabled for all origins in development
- Should restrict to frontend origin in production

### API Key
- Stored in backend .env (not exposed to frontend)
- Hardcoded in backend environment variable
- Validated before each Gemini API call

### Input Validation
- Frontend: Basic validation in component
- Backend: Strict validation in controller
- No SQL injection risk (no database queries)

### Rate Limiting
- Not implemented (add in production)
- Should limit: 10 requests/minute per IP

---

## Monitoring & Debugging

### Frontend Console
```javascript
// Check for these logs:
console.log('📤 [Frontend] Sending message...')    // Request sent
console.log('✅ [Frontend] Response received...')   // Response received
console.log('❌ [Frontend] Chat API Error...')      // Error occurred
```

### Backend Logs
```javascript
// Check for these logs:
console.log('📨 [Backend] POST /api/gemini/chat')  // Request received
console.log('🚀 Sending request to Gemini API')    // Gemini called
console.log('✅ Gemini response received')           // Response received
console.log('❌ [Backend] Error:')                  // Error occurred
```

### Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Send a message
4. Click on the POST request
5. Check:
   - Status: Should be 200
   - Size: Should be >1KB
   - Time: Should be 5-15 seconds

---

## Troubleshooting Decision Tree

```
Response not appearing in chat?
│
├─→ Check browser console for errors
│   ├─→ ECONNREFUSED? → Backend not running
│   ├─→ ETIMEDOUT? → Backend too slow
│   ├─→ Network Error? → Connection issue
│   └─→ Other error? → Check backend logs
│
├─→ Check backend logs
│   ├─→ No message received? → Frontend didn't send
│   ├─→ No Gemini API call? → Backend crashed
│   ├─→ Empty response? → Gemini API key invalid
│   └─→ Full response shown? → Problem is in frontend
│
├─→ Check Network tab
│   ├─→ No request? → Frontend didn't call API
│   ├─→ Request failed? → Backend issue
│   ├─→ Response empty? → Backend returned empty
│   └─→ Response has data? → Frontend parsing issue
│
└─→ Check if response displays
    ├─→ Displays fully? → ✅ Working
    ├─→ Displays partially? → CSS or state issue
    └─→ Doesn't display? → Parsing or state issue
```

---

## Summary

1. **Frontend** → HTTP POST to Backend
2. **Backend** → Validates request, calls Gemini API
3. **Gemini API** → Returns AI-generated response
4. **Backend** → Formats response and sends back
5. **Frontend** → Displays response in chat UI

All communication is JSON-based HTTP with proper error handling at each layer.

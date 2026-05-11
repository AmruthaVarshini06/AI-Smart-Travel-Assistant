# AI Travel Assistant - Complete Setup Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 16+ installed
- Gemini API key from https://aistudio.google.com/apikey
- Two terminal windows

### Step 1: Get Gemini API Key
1. Visit: https://aistudio.google.com/apikey
2. Click "Create API key"
3. Copy the key (looks like: `AIzaSy...`)

### Step 2: Setup Backend
```bash
# Terminal 1 - Backend Setup
cd backend

# Install dependencies (first time only)
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your Gemini API key:
# GEMINI_API_KEY=AIzaSy...

# Start backend server
npm run dev
```

**Expected output:**
```
✅ [Backend] Server Started Successfully!
🌐 Server URL: http://localhost:5000
💬 Chat Endpoint: http://localhost:5000/api/gemini/chat
```

### Step 3: Setup Frontend
```bash
# Terminal 2 - Frontend Setup (in root directory)
npm install  # First time only

npm run dev
```

**Expected output:**
```
Local:   http://localhost:5173
```

### Step 4: Test Chat
1. Open: http://localhost:5173
2. Scroll to "AI Travel Concierge" section
3. Type: "Trip from Mumbai to Goa"
4. Hit Enter
5. Response should appear in 5-15 seconds

---

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] GEMINI_API_KEY set in backend/.env
- [ ] VITE_API_URL=http://localhost:5000 in .env
- [ ] http://localhost:5000/health returns ✓ healthy
- [ ] First chat message gets a response
- [ ] Response displays fully without truncation

---

## 🔧 Troubleshooting

### Backend Won't Start
```bash
# Check Node version
node --version  # Should be 16+

# Clear and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### "Cannot reach backend" Error
1. **Check backend is running**
   - Should see: `✅ [Backend] Server Started Successfully!`
   
2. **Check port 5000 is free**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   # Mac/Linux
   lsof -i :5000
   ```

3. **Check .env has GEMINI_API_KEY**
   ```bash
   # In backend/.env
   GEMINI_API_KEY=AIzaSy...  # Your actual key
   ```

4. **Try health check**
   - Visit: http://localhost:5000/health
   - Should return JSON response

### "GEMINI_API_KEY not set" Error
1. Open backend/.env
2. Find the line: `GEMINI_API_KEY=`
3. Make sure you have a real API key (not empty, not "your_key_here")
4. Restart backend: `npm run dev`
5. Check logs for: `🔑 GEMINI_API_KEY: ✓ Configured`

### Response is Empty or Truncated
1. Check backend logs for: `📤 Full response:`
2. If empty, Gemini API key might be invalid
3. Try a simpler query: "Hi" instead of long queries
4. Restart backend

### Port 5173 Already in Use
```bash
# Vite will use next available port
npm run dev

# Or kill the process using port 5173
# Windows: taskkill /PID <pid> /F
# Mac/Linux: kill <pid>
```

---

## 📁 Project Structure

```
project/
├── backend/
│   ├── .env (GEMINI_API_KEY required)
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── package.json
├── src/
│   ├── services/
│   │   └── aiService.ts (frontend API calls)
│   ├── components/
│   │   └── travel/
│   │       └── AIAssistant.tsx (chat UI)
│   └── main.tsx
├── .env (VITE_API_URL=http://localhost:5000)
└── package.json
```

---

## 🌐 API Endpoints

### Health Check
```
GET http://localhost:5000/health
Response: {"status": "healthy", ...}
```

### Chat Endpoint
```
POST http://localhost:5000/api/gemini/chat
Request:  {"message": "Trip from Mumbai to Goa"}
Response: {"success": true, "data": "AI response..."}
```

---

## 📊 Expected Behavior

### Input
```
User: "Trip from Mumbai to Vizag give cost"
```

### Expected Response
```
✈️ **TRAIN OPTIONS:**
- Express Train, 6:00 PM - 8:30 AM (14.5 hours)
- Price: ₹500-1500 (Sleeper/AC)

✈️ **FLIGHT OPTIONS:**
- IndiGo, ₹2000-3500, 1.5 hours

🚌 **BUS OPTIONS:**
- AC Bus, ₹600-800, 8 hours

💰 **COST SUMMARY:**
- Budget: ₹600 (Bus)
- Best: ₹2000 (Flight)

... (full response)
```

**Not acceptable:**
- Truncated responses
- Empty responses
- Generic "I'm here to help" messages
- Incomplete sentences

---

## 🔍 Debugging

### View Logs

**Backend Logs** (Terminal 1)
```
🚀 [Backend] Starting...
✅ [Backend] Server Started
📨 [Backend] POST /api/gemini/chat
📤 Full response: [actual response text]
```

**Frontend Logs** (DevTools Console - F12)
```
📤 [Frontend] Sending message...
✅ [Frontend] Response received: 200
📊 Response length: 1234 characters
```

### Test API Directly
```bash
curl -X POST http://localhost:5000/api/gemini/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hi"}'
```

---

## 🚀 Development Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` (root) | Start frontend dev server |
| `npm run dev` (backend) | Start backend with auto-reload |
| `npm run server` (backend) | Start backend (production mode) |
| `npm run build` (root) | Build frontend for production |
| `npm run preview` (root) | Preview production build |

---

## 🎯 Features

- ✅ Real Gemini AI responses
- ✅ Complete travel information (trains, flights, buses, costs)
- ✅ Full response without truncation
- ✅ Auto-scroll to latest message
- ✅ Loading state indicator
- ✅ Detailed error messages
- ✅ Health checks and diagnostics
- ✅ Comprehensive logging

---

## 📞 Support

### If Backend Won't Connect
1. Backend running? → `npm run dev` in backend/
2. Port 5000 free? → Check with netstat/lsof
3. Gemini API key set? → Check backend/.env
4. Check health: http://localhost:5000/health

### If Response is Empty
1. Check backend logs for full response
2. Check Gemini API key is valid
3. Try simpler query
4. Restart backend

### If Still Having Issues
1. Open DevTools (F12)
2. Check Console for error messages
3. Check Network tab for API responses
4. Check both backend and frontend logs
5. Restart both services

---

## 🎓 Learning Resources

- Gemini API: https://ai.google.dev/
- Express.js: https://expressjs.com/
- React/Vite: https://vitejs.dev/
- TypeScript: https://www.typescriptlang.org/

---

## ⚠️ Important Notes

1. **Gemini API Key**: Keep it secret, don't commit to git
2. **Backend Logs**: Use for debugging network issues
3. **CORS**: Already enabled in backend
4. **Timeout**: 60 seconds for frontend, adjust if needed
5. **Response Length**: Max 2048 tokens, adjust if needed

---

**You're all set! Enjoy using the AI Travel Assistant! 🎉**

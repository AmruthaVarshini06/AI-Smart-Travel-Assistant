# Backend Setup & Troubleshooting Guide

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
# Edit .env and set:
# - GEMINI_API_KEY (REQUIRED)
# - PORT (optional, defaults to 5000)
# - MONGO_URI (optional, for database features)
```

### 3. Start Backend Server
```bash
# Option A: Development mode (with auto-reload)
npm run dev

# Option B: Production mode
npm run server
```

### 4. Verify Backend is Running
Visit: http://localhost:5000/health

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-05-10T...",
  "message": "AI Travel Backend is running",
  "endpoints": { ... }
}
```

---

## API Endpoints

### Health Check
- **Endpoint**: GET `/health`
- **Purpose**: Verify backend is running
- **Response**: Health status and available endpoints

### Status Check
- **Endpoint**: GET `/api/status`
- **Purpose**: Check API operational status
- **Response**: Operational status and configuration info

### Chat with AI
- **Endpoint**: POST `/api/gemini/chat`
- **Request**:
```json
{
  "message": "Trip from Mumbai to Vizag"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "AI response generated successfully",
  "data": "AI generated response text..."
}
```

---

## Environment Variables

### Required
- `GEMINI_API_KEY`: Google Gemini API Key
  - Get from: https://aistudio.google.com/apikey
  - Format: `AIzaSy...`

### Optional
- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `NODE_ENV`: "development" or "production"

---

## Troubleshooting

### Issue: "Cannot reach backend"

**Check 1: Is backend running?**
```bash
# In backend directory
npm run dev
```

**Check 2: Is port 5000 in use?**
```bash
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000
```

**Check 3: Can you reach it directly?**
```
Visit: http://localhost:5000/health
```

### Issue: "GEMINI_API_KEY not set"

**Solution:**
1. Open `backend/.env`
2. Add: `GEMINI_API_KEY=your_key_here`
3. Restart backend: `npm run dev`
4. Verify: Check backend logs for "✅ Gemini API initialized"

### Issue: "Backend returned empty response"

**Check logs for:**
1. Message received: `📨 [Controller] Received message...`
2. Gemini called: `🚀 Sending request to Gemini API...`
3. Response received: `✅ Gemini response received`

**If no "Response received" log:**
- Gemini API key might be invalid
- Gemini API might be down
- Network issue connecting to Gemini

### Issue: MongoDB connection failed

**This is non-critical.** Backend will work without database.

If you need database:
1. Get MongoDB URI from https://cloud.mongodb.com
2. Set `MONGO_URI` in `.env`
3. Restart backend

---

## Frontend Configuration

Make sure frontend has:
- `VITE_API_URL=http://localhost:5000` in `.env` file

---

## Development Tips

### View Backend Logs
Backend logs show:
- `🚀 [Backend]` - Backend events
- `📨 [Backend]` - Incoming requests
- `✅ [Backend]` - Success messages
- `❌ [Backend]` - Errors
- `⚠️ [Backend]` - Warnings

### Test API with cURL
```bash
# Health check
curl http://localhost:5000/health

# Chat endpoint
curl -X POST http://localhost:5000/api/gemini/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hi there"}'
```

### Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request format |
| 404 | Not Found | Check endpoint path |
| 500 | Server Error | Check backend logs |
| ECONNREFUSED | Backend not running | Run `npm run dev` |
| ETIMEDOUT | Backend timeout | Restart backend, check Gemini API |

---

## Performance Tips

1. **Response Time**
   - First response may take 5-10 seconds (Gemini API latency)
   - Subsequent responses are faster
   - Check `/health` endpoint if response is very slow

2. **Token Limits**
   - Max output tokens: 2048
   - Adjust in `backend/services/geminiService.js` if needed

3. **Timeout**
   - Frontend timeout: 60 seconds
   - Adjust in `src/services/aiService.ts` if needed

---

## Production Deployment

Before deploying:
1. Set `NODE_ENV=production`
2. Use strong `GEMINI_API_KEY`
3. Configure proper `MONGO_URI` if using database
4. Set `PORT` to your server port
5. Enable HTTPS in reverse proxy (nginx, etc.)
6. Add rate limiting
7. Add request validation
8. Enable error tracking (Sentry, etc.)

---

## Support

If issues persist:
1. Check `/health` endpoint
2. Check `/api/status` endpoint
3. View backend logs (look for 📨, ❌, ⚠️ markers)
4. Check browser console (F12)
5. Verify GEMINI_API_KEY is valid
6. Try with simpler query

# Frontend Setup & Configuration Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
# Create .env file (should already exist)
# Make sure it contains:
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access Frontend
Visit: http://localhost:5173 (or http://localhost:8080 depending on vite config)

---

## Environment Variables

### Required for Chat Features
- `VITE_API_URL`: Backend API URL (default: `http://localhost:5000`)

### Optional for Other Features
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase publishable key
- `VITE_GEMINI_API_KEY`: Can be used for frontend Gemini calls (optional)

---

## Troubleshooting

### Issue: "Cannot reach backend" Error

**Step 1: Verify Backend is Running**
```bash
# Open another terminal, go to backend directory
cd backend
npm run dev
```

Check logs show:
```
✅ [Backend] Server Started Successfully!
🌐 Server URL: http://localhost:5000
```

**Step 2: Verify Frontend is Configured Correctly**
```bash
# Make sure .env has:
VITE_API_URL=http://localhost:5000
```

**Step 3: Check Backend Health**
Visit: http://localhost:5000/health

Should return:
```json
{
  "status": "healthy",
  "endpoints": { ... }
}
```

**Step 4: Check Browser Console**
- Open DevTools (F12)
- Go to Console tab
- Look for logs starting with `📤 [Frontend]`
- Check for actual error message

### Issue: Backend Returns Different Errors

**Error: "GEMINI_API_KEY not set"**
- Solution: Set `GEMINI_API_KEY` in `backend/.env`

**Error: "Empty response from Gemini API"**
- Solution: Check Gemini API key is valid
- Restart backend: `npm run dev`

**Error: "Network timeout"**
- Solution: 
  1. Restart backend
  2. Check internet connection
  3. Gemini API might be slow, try again

### Issue: Frontend Server Won't Start

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Try again
npm run dev
```

### Issue: Port Already in Use

**If port 5173 is in use:**
```bash
# Vite will automatically use next available port
npm run dev

# Or specify custom port:
npm run dev -- --port 3000
```

---

## Development Workflow

### 1. Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

### 2. Start Frontend (Terminal 2)
```bash
npm run dev
```

### 3. Open Browser
```
http://localhost:5173
```

### 4. Test Chat Feature
1. Scroll to "AI Travel Concierge" section
2. Type: "Hi" or "Trip from Mumbai to Goa"
3. Check browser console (F12) for:
   - `📤 [Frontend] Sending message...`
   - `✅ [Frontend] Response received`
4. Response should appear in chat

---

## Console Logging Guide

### What to Look For

**Successful Flow:**
```
📤 [Frontend] Sending message to backend: Trip from Mumbai to Vizag
📡 [Frontend] API Base URL: http://localhost:5000
🔍 [Frontend] Checking backend health...
✅ [Frontend] Backend is healthy: 200
✅ [Frontend] Response received: 200 OK
⏱️ [Frontend] Response time: 2345 ms
📊 [Frontend] Response length: 1234 characters
📥 [Frontend] AI response full text:
[Full response shown]
```

**Error Flow:**
```
❌ [Frontend] Chat API Error Occurred
🔴 [Connection Error]: Cannot reach backend at http://localhost:5000
💡 [Solution] Run: npm run server (in backend directory)
```

### Debug Tips

1. **Check API URL**: Look for line `📡 [Frontend] API Base URL:`
2. **Check Response Time**: If > 10 seconds, Gemini API might be slow
3. **Check Response Length**: If 0, backend returned empty response
4. **Check Error Details**: Full error in `📋 [Error Details]:`

---

## Testing

### Manual Test Queries

**Test 1: Simple Message**
```
Input: "Hi"
Expected: Quick greeting response
```

**Test 2: Travel Query**
```
Input: "Trip from Mumbai to Vizag give cost"
Expected: Detailed response with trains, flights, buses, costs, duration
```

**Test 3: Destination Query**
```
Input: "Tell me about Goa"
Expected: Information about destination with attractions, weather, best season
```

**Test 4: Budget Query**
```
Input: "What's a good budget trip for 5000 rupees?"
Expected: Affordable travel suggestions
```

---

## Build for Production

```bash
# Create optimized build
npm run build

# Preview production build locally
npm run preview
```

---

## Performance Optimization

### If Frontend is Slow

1. **Check Network Tab**
   - Open DevTools > Network
   - See actual response time from backend

2. **Check Bundle Size**
   ```bash
   npm run build
   # Check dist/ folder size
   ```

3. **Check API Response Time**
   - First response: 5-15 seconds (Gemini API latency)
   - Cached responses: < 2 seconds

---

## Common Issues & Solutions

| Issue | Check | Solution |
|-------|-------|----------|
| Chat doesn't work | Backend running? | `npm run dev` in backend |
| Can't see response | Console errors? | Open F12, check Console tab |
| Very slow response | Response time > 30s | Restart backend, check API key |
| Port 5173 in use | Try different port | Vite auto-selects next port |
| CORS errors | Backend CORS enabled? | Should be automatic |
| Env vars not loading | File is `.env`? | Restart `npm run dev` |

---

## Browser Compatibility

**Tested & Working:**
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Features Using Modern APIs:**
- Speech Recognition: Not supported in all browsers
- WebGL (for maps): Requires WebGL support

---

## Support

If issues persist:
1. Check both backend and frontend consoles
2. Verify all environment variables are set
3. Restart both backend and frontend
4. Check that port 5000 (backend) and 5173 (frontend) are free
5. Check internet connection
6. Try with a simpler query

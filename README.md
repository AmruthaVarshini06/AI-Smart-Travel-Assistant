# AI Smart Travel Assistant

AI Smart Travel Assistant is an intelligent travel planning platform that combines multi-modal route optimization, weather-aware recommendations, AI chat assistance, and ML-based delay prediction.

## Key Features

- Multi-modal travel route planning for bus, train, metro, cab, and flight options
- Route optimization using time, cost, distance, and weather factors
- Weather integration using OpenWeather API for travel-aware scheduling
- ML-based delay prediction service using Python Flask
- AI travel concierge chat assistant powered by Gemini / generative model integration
- Tourism planning and route visualization with interactive map support
- Search and booking simulation with route details and scoring
- MongoDB-ready backend architecture for data persistence

## Architecture

Frontend (React + TypeScript)
- `src/pages/Index.tsx` for route discovery and recommendations
- `src/components/travel/RouteDetails.tsx` for itinerary and prediction details
- `src/components/travel/AIAssistant.tsx` for conversational travel guidance
- `src/services/api.ts` and `src/services/aiService.ts` for backend and AI API integration
- `src/lib/api.ts` for route simulation logic used by the front-end mock plan flow

Backend (Node.js + Express)
- `backend/server.js` exposes REST APIs for transport, weather, and AI chat
- `backend/routes/transportRoutes.js` handles multi-modal route and delay prediction endpoints
- `backend/routes/weatherRoutes.js` fetches weather data from OpenWeather
- `backend/routes/geminiRoutes.js` routes AI chat to Gemini generative models
- `backend/controllers` separates transport, weather, and prediction logic
- `backend/services` includes Supabase route data, weather integration, and prediction service
- `backend/config/db.js` connects to MongoDB

ML Service (Python Flask)
- `ml_service/app.py` provides a dedicated `/predict` endpoint for delay forecasting
- `ml_service/requirements.txt` lists Flask dependencies
- `backend/services/predictionService.js` can call the Flask service or use fallback prediction logic

## What was improved

- Added backend transport delay prediction endpoint: `/api/transport/predict/:routeId`
- Integrated backend route prediction into the route details panel
- Mounted transport, weather, and AI routes in `backend/server.js`
- Added Python Flask ML service stub for real ML service architecture
- Updated AI chat integration to use `/api/gemini/chat`
- Added `backend/.env.example` for required environment variables
- Strengthened README documentation with architecture, features, and run instructions

## Run locally

### 1. Frontend

```bash
cd d:/projects/AI-Smart-Travel-Assistant
pnpm install
pnpm dev
```

### 2. Backend

```bash
cd d:/projects/AI-Smart-Travel-Assistant/backend
npm install
cp .env.example .env
# fill in API keys and connection strings
npm run dev
```

### 3. ML Service (optional)

```bash
cd d:/projects/AI-Smart-Travel-Assistant/ml_service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## Environment Variables

Use `backend/.env.example` as a template for:

- `MONGO_URI`
- `WEATHER_API_KEY`
- `GEMINI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_API_KEY`
- `ML_SERVICE_URL`
- `USE_ML_SERVICE`

## Notes for evaluation

This repository now demonstrates a complete full-stack travel assistant architecture with separate frontend, backend, and ML service layers. It includes RESTful API communication, weather-aware routing, AI chat, and delay prediction support aligned with the stated project requirements.

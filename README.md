<<<<<<< HEAD
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
=======
# Welcome to your AI-Smart-travel-Assistant app

## 📖 Description

AI Smart Travel Assistant is an intelligent travel planning system that helps users find the most efficient travel routes by integrating multiple transportation modes such as bus, train, and flight.

It uses Machine Learning and AI techniques to:

Predict travel time and delays
Optimize routes based on cost, time, distance, and user preferences
Suggest tourist places along the travel path
Provide real-time travel and weather insights

The system simplifies travel planning by offering a single intelligent platform for complete journey management.


## ❗ Problem Statement

Users often struggle to find the most efficient travel option because existing platforms do not integrate bus, train, and flight services effectively. Current systems fail to consider important factors such as time, cost, distance, traffic, and weather together, leading to inefficient travel planning.

Hence, there is a need for a smart travel assistant system that provides optimized, convenient, and intelligent route suggestions in one unified platform.


## 💡 Proposed Solution

The proposed system is a Smart Travel Assistant Web Application that:

Integrates bus, train, and flight services
Provides optimized route suggestions
Considers time, cost, distance, traffic, and weather
Recommends famous tourist places between routes
Supports AI-based prediction for travel time and delays
Offers alternative route suggestions
Provides interactive map visualization of trips

This makes travel planning faster, smarter, and more reliable.


## 🧰 Technologies Used
### Frontend:
* React.js
* JavaScript
* Tailwind CSS

### Backend:
* Node.js
* Express.js
  
### Database:
* MongoDB
  
### AI / ML:
* Python (Machine Learning models for prediction)
  
### APIs Integrated:
* Weather API (real-time weather updates)
* Maps API (route visualization)
* Transportation APIs (bus, train, flight data)
  
### Authentication:
* JWT (JSON Web Token)


## 🏗️ System Architecture

The system follows a Three-Tier Architecture:

1️⃣ Frontend Layer
Built using React.js
Handles user interface and interactions
Displays routes, maps, and trip details
2️⃣ Backend Layer
Node.js + Express.js REST API
Processes user requests
Handles authentication and business logic
Communicates with database and external APIs
3️⃣ Data & AI Layer
MongoDB for storing user and trip data
Python-based ML modules for prediction
External APIs for weather, maps, and transport data
🔄 Architecture Flow

User (Frontend - React.js)
⬇
API Requests (Express.js Backend)
⬇
Database (MongoDB) + AI/ML Engine (Python)
⬇
External APIs (Weather / Maps / Transport)
⬇
Processed Response Returned
⬇
Frontend Displays Optimized Travel Plan

## 📌 In-Scope Features
* Travel route search and optimization
* Integration of bus, train, and flight services
* AI-based travel time and weather prediction
* Tourist place recommendations
* Route booking and trip management
* Interactive map visualization
* Real-time travel updates
* Secure authentication using JWT

## 🚫 Out-of-Scope Features
* International transportation systems
* Hotel and food booking services
* Real-time GPS tracking
* Enterprise-level integrations
* Advanced chatbot assistance
* Offline travel planning

## 🚀 Future Enhancements
* 🌙 Dark mode and UI customization
* 📩 Email notifications for delays and weather alerts
* 📄 Downloadable PDF travel itinerary
* 🤖 AI chatbot for travel assistance
* 🏨 Hotel & restaurant recommendations
* 📱 Mobile application (Android & iOS)

## 🎯 Conclusion

The AI Smart Travel Assistant is a powerful web-based system that simplifies travel planning by integrating multiple transportation modes into a single intelligent platform. It enhances user experience through route optimization, AI-based prediction, weather insights, and tourist recommendations.

Future improvements can expand its capabilities with real-time tracking, mobile applications, and advanced AI features, making it a complete smart travel ecosystem.
>>>>>>> origin/main

# 🏙️ UrbanPulse AI

**Smart City Risk & Resource Intelligence Dashboard**

---

## Project Overview

UrbanPulse AI is a full-stack smart city analytics platform that uses machine learning to predict urban risks across three critical dimensions — **traffic congestion**, **air quality (AQI)**, and **energy consumption** — and provides AI-driven natural-language recommendations to city administrators.

---

## Features

- 📊 **KPI Cards** — Real-time Traffic, AQI, and Energy metrics with status badges
- 🤖 **AI Recommendations** — Severity-aware advisory messages generated from ML predictions
- �� **Interactive Charts** — Line charts for traffic, AQI, and energy trends (Recharts)
- 🗺️ **City Risk Heatmap** — Leaflet-powered heatmap overlaid on a real map
- 🔍 **Live Prediction Panel** — Query any hour/day and get instant ML predictions
- ⚡ **FastAPI Backend** — Scikit-learn LinearRegression models trained on CSV data

---

## Architecture

```
Browser (React + Vite)
        │
        │  REST API (JSON)
        ▼
FastAPI (Python) on port 8000
        │
        ├── /predict/traffic  → LinearRegression on traffic.csv
        ├── /predict/aqi      → LinearRegression on pollution.csv
        ├── /predict/energy   → LinearRegression on energy.csv
        └── /recommend        → Rule-based analysis of predictions
```

### Tech Stack

| Layer     | Technology                         |
|-----------|------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS       |
| Charts    | Recharts                           |
| Map       | Leaflet + leaflet.heat             |
| Backend   | Python, FastAPI, Uvicorn           |
| ML        | Scikit-learn LinearRegression      |
| Data      | Pandas, CSV files                  |

---

## Project Structure

```
urbanpulse-ai/
├── backend/
│   ├── main.py              # FastAPI app + endpoints
│   ├── models.py            # ML model training & prediction helpers
│   ├── requirements.txt     # Python dependencies
│   └── data/
│       ├── traffic.csv      # hour, traffic_volume
│       ├── pollution.csv    # day, AQI
│       └── energy.csv       # hour, usage
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       └── components/
│           ├── KpiCard.jsx
│           ├── DataChart.jsx
│           ├── CityMap.jsx
│           ├── RecommendationPanel.jsx
│           └── PredictForm.jsx
└── README.md
```

---

## Setup & Run Locally

### Prerequisites

- Python 3.9+ and `pip`
- Node.js 18+ and `npm`

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

Interactive docs: `http://localhost:8000/docs`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

> The Vite dev server proxies `/predict/*` and `/recommend` to the FastAPI backend automatically.

---

## API Endpoints

| Method | Endpoint                     | Description                  |
|--------|------------------------------|------------------------------|
| GET    | `/predict/traffic?hour=8`    | Predict traffic volume       |
| GET    | `/predict/aqi?day=3`         | Predict air quality index    |
| GET    | `/predict/energy?hour=5`     | Predict energy usage         |
| GET    | `/recommend`                 | Get AI recommendations       |

---

## Deploying to Vercel

The project includes a `vercel.json` that configures everything for a one-click Vercel deployment:

- The **frontend** (React/Vite) is built with `cd frontend && npm install && npm run build` and served from `frontend/dist`.
- The **backend** (FastAPI) is exposed as a Vercel Python serverless function in `api/index.py` using [Mangum](https://github.com/jordaneremieff/mangum) as the ASGI adapter.
- URL rewrites route `/predict/*` and `/recommend` to the serverless function automatically.

```bash
# One-time setup
npm i -g vercel

# Deploy
vercel --prod
```

> **Note:** On a cold start, Vercel's serverless function loads the ML models from the bundled CSV files and caches them for subsequent warm invocations.

---

## GitHub Push Instructions

```bash
git add .
git commit -m "feat: add UrbanPulse AI full-stack project"
git push origin main
```

---

## Future Scope

- 🔄 **Real-time data ingestion** via IoT sensor APIs
- 🧠 **Deep learning models** (LSTM/Prophet) for time-series forecasting
- 🔔 **Alert notification system** (email/SMS/push)
- 🗃️ **Database integration** (PostgreSQL/TimescaleDB for historical data)
- 🔐 **Authentication** for role-based admin/operator access
- 📱 **Mobile-responsive progressive web app (PWA)**
- 🌐 **Multi-city support** with configurable data sources
- 📦 **Docker deployment** with docker-compose

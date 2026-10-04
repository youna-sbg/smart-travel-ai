# Smart Travel AI 🗺️

A location-aware travel assistant MVP focused on Northern Iran (Babol, Babolsar, and Sari). The project combines a FastAPI backend, PostgreSQL database, React/Vite frontend, weather-aware recommendation scoring, user authentication, favorites, and Neshan Maps routing.

## Highlights

- 📍 User geolocation and map-based place discovery
- 🧭 Route calculation through Neshan Maps
- 🌦️ Weather-aware recommendations
- 🎯 Multi-factor ranking based on distance, weather, category, user features, and data quality
- 🔐 JWT authentication and password hashing
- ❤️ User favorites
- 🗃️ PostgreSQL + SQLAlchemy async backend
- ⚡ FastAPI REST APIs with automatic Swagger documentation
- ⚛️ React + Vite frontend

## Architecture

```text
smart-travel-ai/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── main.py
│   ├── .env.example
│   └── requirements.txt
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── migrations
├── frontend/
│   └── legacy web client
└── frontend-react/
    ├── src/
    ├── public/
    └── package.json
```

## Tech Stack

**Backend:** Python, FastAPI, SQLAlchemy 2, asyncpg, Pydantic, JWT

**Database:** PostgreSQL

**Frontend:** React, Vite, JavaScript, CSS

**Maps & Routing:** Neshan Maps API

## Recommendation Engine

The current recommendation layer uses a transparent weighted scoring system rather than a trained ML model. Scores are calculated from:

- Distance from the user
- Current weather suitability
- Requested features
- Preferred category
- Completeness of place information

The ranking service is isolated from the API layer so it can later be replaced or extended with an ML model without redesigning the rest of the application.

## Local Setup

### 1. Backend

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env  # macOS/Linux
```

Create a PostgreSQL database named `travel_ai`, then apply:

```bash
psql travel_ai < ../database/schema.sql
psql travel_ai < ../database/seed.sql
```

Set your local database URL, Neshan routing key, and JWT secret in `backend/.env`.

Run the API:

```bash
uvicorn app.main:app --reload --port 8001
```

Swagger: `http://127.0.0.1:8001/docs`

### 2. React Frontend

```bash
cd frontend-react
npm install
copy .env.example .env   # Windows
# cp .env.example .env  # macOS/Linux
npm run dev
```

Set `VITE_BACKEND_URL` and your Neshan web map key in `frontend-react/.env`.

## Security

Secrets and local environment files are intentionally excluded from this repository. Never commit database passwords, JWT secrets, or private API keys.

## Project Status

This repository represents an MVP / active development project. The current focus is the technical foundation: location-aware place data, routing, authentication, favorites, and explainable recommendations.

## Author

**Younas Sabbaghyan** — Computer Engineering student and software developer focused on Backend, AI-powered applications, and Full-Stack development.

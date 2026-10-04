
````markdown
# Smart Travel AI 🗺️🤖

> An AI-powered, location-aware travel assistant focused on Northern Iran.

Smart Travel AI is an **MVP travel platform currently under active development**, initially focused on **Babol, Babolsar, and Sari** in Northern Iran.

The project combines **location-aware place discovery, map routing, weather-aware recommendation scoring, user authentication, favorites, PostgreSQL, FastAPI, and a React frontend** into a single travel platform.

The long-term goal is to evolve Smart Travel AI into an intelligent travel assistant capable of understanding a user's **location, interests, preferences, weather conditions, available destinations, and travel constraints** to provide personalized travel recommendations and itineraries.

---

## 🚧 Project Status

**Status: MVP / Active Development**

Smart Travel AI is currently an evolving technical project and is **not yet a finished commercial product**.

The current development phase focuses on building and improving the core infrastructure required for an intelligent travel platform.

### Current development focus

- 📍 Location-aware place discovery
- 🗺️ Map integration and route calculation
- 🌦️ Weather-aware recommendation scoring
- 🎯 Recommendation engine
- 🔐 User authentication
- ❤️ User favorites
- 🗃️ PostgreSQL database architecture
- ⚡ FastAPI REST APIs
- ⚛️ React + Vite frontend
- 🔗 Frontend / Backend integration

New features, improvements, and AI capabilities will continue to be added as development progresses.

---

# 🎯 MVP

The current MVP is based on a simple concept:

> **Understand where the user is, understand available destinations, evaluate their suitability, and help the user reach them.**

The MVP provides the technical foundation required to build a more advanced AI-powered travel assistant.

### MVP Components

- User location detection
- Place discovery from PostgreSQL
- Category-based place filtering
- Feature-based place filtering
- Distance calculation
- Neshan Maps integration
- Route calculation
- Weather-aware scoring
- User authentication
- Password hashing
- JWT-based authentication
- Protected API endpoints
- User favorites
- REST APIs
- React frontend
- PostgreSQL database

---

# ✨ Current Features

## 📍 Location-Aware Discovery

The application can detect the user's current location and use it when working with nearby destinations.

Places are stored in the database with geographic information, allowing the system to work with real-world destinations.

The current geographic scope focuses on:

- Babol
- Babolsar
- Sari

The architecture is designed so that additional cities and regions can be added later.

---

## 🗺️ Maps & Routing

Smart Travel AI integrates with **Neshan Maps API** for map-based functionality and route calculation.

Current functionality includes:

- Displaying destinations on the map
- Working with the user's current location
- Selecting destinations
- Calculating routes
- Connecting geographic data with backend services

The mapping layer is designed to support future intelligent route planning.

---

## 🌦️ Weather-Aware Recommendations

Weather conditions can influence the suitability score of destinations.

For example, outdoor destinations can be evaluated differently depending on current weather conditions.

Weather information can therefore become one of the factors used by the recommendation engine.

---

## 🎯 Recommendation Engine

The current recommendation system uses a **transparent weighted scoring system** rather than claiming to be a trained Machine Learning model.

The scoring system can consider factors such as:

- Distance from the user
- Weather suitability
- Requested features
- Preferred category
- Place characteristics
- Completeness and quality of available data

The recommendation logic is separated from the API layer, making it easier to improve, extend, or replace with more advanced AI/ML approaches in future versions.

---

## 🔐 Authentication

The backend includes user authentication infrastructure based on:

- JWT
- Password hashing
- Protected API endpoints
- User-specific data

This provides the foundation for personalized travel experiences.

---

## ❤️ Favorites

Authenticated users can save places as favorites and access their saved destinations.

The favorites system also provides a foundation for future personalization and recommendation improvements.

---

## 🗃️ Database

The project uses **PostgreSQL** with asynchronous SQLAlchemy.

The database is designed around structured travel and user data, including:

- Cities
- Categories
- Places
- Features
- Place-feature relationships
- Users
- Favorites

The database structure is designed to support future expansion of the recommendation and AI layers.

---

# ⚡ REST API

The backend is built with **FastAPI** and provides RESTful APIs for communication between the React frontend and backend services.

FastAPI also provides interactive API documentation through Swagger UI.

### API Documentation

When running the backend locally:

```text
http://127.0.0.1:8001/docs
````

The Swagger interface allows developers to explore available endpoints and test API requests directly from the browser.

---

# 🏗️ Architecture

The current architecture separates the frontend, API layer, business logic, recommendation system, database, and external services.

```text
                         ┌─────────────────────┐
                         │    React + Vite      │
                         │      Frontend        │
                         └──────────┬──────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌─────────────────────┐
                         │       FastAPI       │
                         │       Backend       │
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
        ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
        │ Recommendation │ │ Authentication │ │ Neshan Maps   │
        │    Engine      │ │     & Users    │ │  & Routing     │
        └────────────────┘ └────────────────┘ └────────────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │      PostgreSQL     │
        │       Database      │
        └─────────────────────┘
```

---

# 📁 Project Structure

```text
smart-travel-ai/
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── favorites.py
│   │   │   ├── lookups.py
│   │   │   ├── places.py
│   │   │   ├── recommendations.py
│   │   │   └── route.py
│   │   │
│   │   ├── services/
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── main.py
│   │
│   ├── .env.example
│   └── requirements.txt
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── migrations/
│
└── frontend-react/
    ├── src/
    ├── public/
    ├── .env.example
    └── package.json
```

---

# 🧰 Tech Stack

## Backend

* Python
* FastAPI
* SQLAlchemy 2
* asyncpg
* Pydantic
* JWT
* REST API

## Database

* PostgreSQL
* SQLAlchemy
* Async database access
* Relational database design

## Frontend

* React
* Vite
* JavaScript
* HTML
* CSS

## Maps & Routing

* Neshan Maps API

## Development

* Git
* GitHub
* VS Code

---

# 🧠 Recommendation Architecture

The current recommendation system intentionally uses an **explainable scoring approach** instead of presenting a traditional trained Machine Learning model.

Conceptually:

```text
                    User
                      │
          ┌───────────┼───────────┐
          │           │           │
       Location   Preferences   Category
          │           │           │
          └───────────┼───────────┘
                      │
                      ▼
             Recommendation Engine
                      │
       ┌──────────────┼──────────────┐
       │              │              │
       ▼              ▼              ▼
 Distance Score   Weather Score   Feature Score
       │              │              │
       └──────────────┼──────────────┘
                      │
                Category Score
                      │
                Data Quality
                      │
                      ▼
                Final Ranking
                      │
                      ▼
              Recommended Places
```

This architecture allows future versions to introduce more advanced Machine Learning or AI models without requiring a complete redesign of the backend.

---

# 🛣️ Roadmap

## Phase 1 — Core Infrastructure

* [x] PostgreSQL database
* [x] FastAPI backend
* [x] Place management
* [x] Cities and categories
* [x] Place features
* [x] User authentication
* [x] Favorites
* [x] Neshan Maps integration
* [x] Route calculation
* [x] Location-aware functionality
* [x] Initial recommendation scoring
* [x] React + Vite frontend

---

## Phase 2 — Recommendation Improvements

* [ ] Improve recommendation weighting
* [ ] Add more destination characteristics
* [ ] Improve weather-based scoring
* [ ] Add richer user preference profiles
* [ ] Improve ranking accuracy
* [ ] Add recommendation explanations
* [ ] Improve data quality and coverage

---

## Phase 3 — AI Travel Assistant

* [ ] Natural-language travel requests
* [ ] AI-powered destination selection
* [ ] AI travel assistant / chatbot
* [ ] Personalized travel suggestions
* [ ] AI-generated travel itineraries
* [ ] Context-aware recommendations
* [ ] Conversation-based trip planning

Example future interaction:

```text
"I have two hours in Babol.
I like nature and photography.
The weather is cloudy.
Where should I go?"
```

The goal is for the system to combine:

```text
User Preferences
       +
Current Location
       +
Weather
       +
Available Destinations
       +
Routes
       +
AI Reasoning
       ↓
Personalized Travel Recommendation
```

---

## Phase 4 — Advanced Travel Planning

* [ ] Multi-destination trip planning
* [ ] Route optimization
* [ ] Time-aware itineraries
* [ ] Travel duration estimation
* [ ] Restaurant recommendations
* [ ] Food recommendations
* [ ] Accommodation recommendations
* [ ] Activity recommendations
* [ ] Budget-aware planning

---

## Phase 5 — Intelligent Personalization

* [ ] User preference learning
* [ ] Recommendation history
* [ ] Feedback-based ranking
* [ ] Personalized destination profiles
* [ ] User behavior analysis
* [ ] Advanced ML recommendation models
* [ ] Continuous recommendation improvement

---

# 🔮 Future Vision

The long-term vision of Smart Travel AI is to become an intelligent travel assistant rather than simply a map or place directory.

Potential future capabilities include:

### 🤖 AI Travel Agent

A conversational AI assistant that understands natural-language travel requests and helps users plan trips.

### 🧭 Intelligent Route Planning

Combining multiple destinations, travel time, distance, weather, and user preferences to generate optimized routes.

### 🌦️ Real-Time Context

Using real-time weather and environmental information to dynamically adjust recommendations.

### 🧠 Personalized Recommendations

Learning from user preferences and previous interactions to provide increasingly personalized suggestions.

### 🗺️ Multi-City Travel

Expanding beyond Northern Iran and supporting additional cities and regions.

### 💰 Budget-Aware Trips

Allowing users to specify a budget and generate recommendations and itineraries within that budget.

---

# 🌍 Initial Geographic Scope

The initial version focuses on Northern Iran, particularly:

* 📍 Babol
* 📍 Babolsar
* 📍 Sari

The system is designed so that the geographic scope can later expand to additional cities and regions.

---

# 🔒 Security

Secrets and local environment files are intentionally excluded from this repository.

Never commit:

```text
.env
database passwords
JWT secrets
private API keys
production credentials
```

Sensitive configuration should always be stored in environment variables.

Example:

```text
backend/.env
```

should remain local and should never be pushed to GitHub.

For local development, use:

```text
backend/.env.example
frontend-react/.env.example
```

as configuration templates.

---

# 🚀 Local Setup

## 1. Clone the Repository

```bash
git clone https://github.com/youna-sbg/smart-travel-ai.git
cd smart-travel-ai
```

---

## 2. Backend Setup

```bash
cd backend
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create the environment file.

### Windows

```bash
copy .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

Configure the required local values inside:

```text
backend/.env
```

including:

* PostgreSQL connection
* Neshan routing key
* JWT secret

---

## 3. Database Setup

Create a PostgreSQL database named:

```text
travel_ai
```

Apply the database schema:

```bash
psql travel_ai < ../database/schema.sql
```

Load the initial data:

```bash
psql travel_ai < ../database/seed.sql
```

---

## 4. Run the Backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload --port 8001
```

Backend:

```text
http://127.0.0.1:8001
```

Swagger UI:

```text
http://127.0.0.1:8001/docs
```

---

## 5. Run the React Frontend

Open another terminal:

```bash
cd frontend-react
npm install
```

Create the environment file.

### Windows

```bash
copy .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

Configure:

```text
VITE_BACKEND_URL
VITE_NESHAN_WEB_MAP_KEY
```

Then start the development server:

```bash
npm run dev
```

---

# 📌 Development Philosophy

Smart Travel AI is being developed incrementally.

The project intentionally separates the main system components:

```text
React Frontend
      ↓
REST API
      ↓
Business Logic
      ↓
Recommendation Engine
      ↓
PostgreSQL Database
      ↓
External Services
```

This separation makes it easier to:

* Improve individual components
* Add new APIs
* Introduce AI models
* Replace external services
* Expand to new cities
* Add new recommendation strategies
* Scale the backend
* Improve the frontend independently

---

# 👨‍💻 Author

**Younas Sabbaghyan**

Computer Engineering student and software developer focused on:

* Backend Development
* Artificial Intelligence
* Full-Stack Development
* AI-powered Applications
* Software Engineering
* REST API Development
* Database Design

---

# 📈 Project Vision

Smart Travel AI started as a technical MVP for location-aware travel recommendations.

The long-term vision is to evolve it into an intelligent travel platform capable of understanding:

```text
Who is the user?
        +
Where is the user?
        +
What does the user like?
        +
What is the weather?
        +
What destinations are available?
        +
How can the user get there?
        +
What are the user's travel constraints?
        ↓
Intelligent Travel Recommendation
```

The project is currently under active development, and its architecture is being designed to support increasingly advanced recommendation and AI capabilities over time.

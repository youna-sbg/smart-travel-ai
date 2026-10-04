

````markdown
# Smart Travel AI 🗺️🤖

> An AI-powered, location-aware travel assistant focused on Northern Iran.

Smart Travel AI is an MVP travel platform currently under active development, initially focused on **Babol, Babolsar, and Sari**.

The project combines **location-aware place discovery, route calculation, weather-aware scoring, user preferences, authentication, favorites, and AI-oriented recommendation infrastructure** into a single travel platform.

The long-term goal is to evolve the system into an intelligent travel assistant capable of understanding a user's location, interests, conditions, and preferences and generating useful travel suggestions and plans.

---

## 🚧 Project Status

**Status: MVP / Active Development**

This project is not a finished commercial product.

The current development phase focuses on building and validating the core technical infrastructure, including:

- Location-aware place discovery
- Database architecture
- Route calculation
- User authentication
- Favorites
- Recommendation scoring
- Weather-aware ranking
- Frontend and backend integration

New features, improvements, and AI capabilities will continue to be added as development progresses.

---

# 🎯 MVP

The current MVP is designed around a simple idea:

> **Understand where the user is, understand available destinations, evaluate their suitability, and help the user reach them.**

The current system provides the technical foundation required for this workflow.

### MVP Components

- User location detection
- Place discovery from PostgreSQL
- Category-based place filtering
- Feature-based place filtering
- Distance calculation
- Neshan Maps routing
- Weather-aware scoring
- User authentication
- Password hashing
- JWT-based authentication
- User favorites
- REST APIs
- React frontend
- PostgreSQL database

---

# ✨ Current Features

## 📍 Location-Aware Discovery

The application can detect the user's location and use it as a factor when working with nearby destinations.

Places are stored in the database with geographic information, allowing the system to work with real-world locations.

---

## 🗺️ Maps & Routing

The system integrates with **Neshan Maps API** for map-based functionality and route calculation.

Users can:

- View places on the map
- Work with their current location
- Select destinations
- Request routes to destinations

---

## 🌦️ Weather-Aware Recommendations

Weather conditions can influence the suitability score of destinations.

For example, different locations may receive different scores depending on current weather conditions and the characteristics of the destination.

---

## 🎯 Recommendation Scoring

The current recommendation engine uses a transparent weighted scoring system rather than a trained Machine Learning model.

The score can consider:

- Distance from the user
- Weather suitability
- Requested features
- Preferred category
- Place characteristics
- Completeness and quality of available data

The recommendation logic is separated from the API layer, making it easier to improve or replace in future versions.

---

## 🔐 Authentication

The backend includes user authentication infrastructure based on:

- JWT
- Password hashing
- Protected API endpoints
- User-specific data

---

## ❤️ Favorites

Authenticated users can save places as favorites and access their saved destinations.

---

## 🗃️ Database

The project uses **PostgreSQL** with asynchronous SQLAlchemy.

The database contains structured information for:

- Cities
- Categories
- Places
- Features
- Place-feature relationships
- Users
- Favorites

---

## ⚡ REST API

The backend is built with **FastAPI** and provides RESTful endpoints for communication between the frontend and backend.

FastAPI also provides automatic API documentation through Swagger UI.

Local Swagger documentation:

```text
http://127.0.0.1:8001/docs
````

---

# 🏗️ Architecture

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
├── frontend/
│   └── legacy web client
│
└── frontend-react/
    ├── src/
    ├── public/
    └── package.json
```

---

# 🧰 Tech Stack

### Backend

* Python
* FastAPI
* SQLAlchemy 2
* asyncpg
* Pydantic
* JWT
* REST API

### Database

* PostgreSQL
* Relational database design
* Async database access

### Frontend

* React
* Vite
* JavaScript
* HTML
* CSS

### Maps & Routing

* Neshan Maps API

### Development

* Git
* GitHub
* VS Code

---

# 🧠 Recommendation Architecture

The current recommendation system intentionally uses an **explainable scoring approach** instead of pretending to be a trained AI model.

Conceptually:

```text
User
 │
 ├── Location
 ├── Preferences
 ├── Category
 └── Requested Features
          │
          ▼
   Recommendation Engine
          │
          ├── Distance Score
          ├── Weather Score
          ├── Feature Score
          ├── Category Score
          └── Data Quality Score
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
* [x] Categories
* [x] Features
* [x] User authentication
* [x] Favorites
* [x] Neshan routing
* [x] Location-aware functionality
* [x] Initial recommendation scoring

---

## Phase 2 — Recommendation Improvements

* [ ] Improve recommendation weighting
* [ ] Add more place characteristics
* [ ] Improve weather-based scoring
* [ ] Add user preference profiles
* [ ] Improve ranking accuracy
* [ ] Add recommendation explanations

---

## Phase 3 — AI Travel Assistant

* [ ] Natural-language travel requests
* [ ] AI-powered destination selection
* [ ] AI travel assistant / chatbot
* [ ] Personalized travel suggestions
* [ ] AI-generated travel itineraries
* [ ] Context-aware recommendations
* [ ] Conversation-based trip planning

Example:

```text
"I have 2 hours in Babol.
I like nature and photography.
The weather is cloudy.
Where should I go?"
```

The future system should be able to combine user preferences, location, weather, available destinations, routes, and AI reasoning to generate a useful response.

---

## Phase 4 — Advanced Travel Planning

* [ ] Multi-destination trip planning
* [ ] Route optimization
* [ ] Time-aware itineraries
* [ ] Travel duration estimation
* [ ] Restaurant and food recommendations
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
* [ ] More advanced ML recommendation models

---

# 🔮 Future Features

The long-term vision for Smart Travel AI includes:

### 🤖 AI Travel Agent

A conversational AI assistant that understands natural-language travel requests and helps users plan trips.

### 🧭 Intelligent Route Planning

Combining multiple destinations, travel time, distance, weather, and user preferences to create optimized routes.

### 🌦️ Real-Time Context

Using real-time weather and environmental information to dynamically adjust recommendations.

### 🧠 Personalized Recommendations

Learning from user preferences and previous interactions to provide increasingly personalized suggestions.

### 🗺️ Multi-City Travel

Expanding beyond Northern Iran and supporting more cities and regions.

### 💰 Budget-Aware Trips

Allowing users to specify a budget and generate recommendations and itineraries within that budget.

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

Use environment variables for sensitive configuration.

Example:

```text
backend/.env
```

should remain local and should never be pushed to GitHub.

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

Create your environment file:

### Windows

```bash
copy .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

Configure your local PostgreSQL connection, Neshan routing key, and JWT secret inside `.env`.

---

## 3. Database Setup

Create a PostgreSQL database:

```text
travel_ai
```

Apply the schema:

```bash
psql travel_ai < ../database/schema.sql
```

Load initial data:

```bash
psql travel_ai < ../database/seed.sql
```

---

## 4. Run the Backend

```bash
uvicorn app.main:app --reload --port 8001
```

API:

```text
http://127.0.0.1:8001
```

Swagger:

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

Create the environment file:

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

Then run:

```bash
npm run dev
```

---

# 🌍 Initial Geographic Scope

The initial version focuses on Northern Iran, particularly:

* 📍 Babol
* 📍 Babolsar
* 📍 Sari

The architecture is designed so that the geographic scope can later expand to additional cities and regions.

---

# 📌 Development Philosophy

Smart Travel AI is being developed incrementally.

The project intentionally separates:

```text
Frontend
     ↓
REST API
     ↓
Business Logic
     ↓
Recommendation Engine
     ↓
Database
     ↓
External Services
```

This separation makes it easier to:

* Improve individual components
* Add new APIs
* Introduce AI models
* Replace external services
* Scale the backend
* Expand to new cities
* Add new recommendation strategies

---

# 👨‍💻 Author

**Younas Sabbaghyan**

Computer Engineering student and software developer focused on:

* Backend Development
* Artificial Intelligence
* Full-Stack Development
* AI-powered Applications
* Software Engineering
* API Development

---

# 📈 Project Vision

Smart Travel AI started as a technical MVP for location-aware travel recommendations.

The long-term vision is to evolve it into an intelligent travel platform that can understand:

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
        ↓
Intelligent Travel Recommendation
```

The project is currently under active development.

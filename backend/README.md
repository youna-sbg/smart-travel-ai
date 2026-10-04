# Smart Travel AI — Backend

FastAPI backend for the Smart Travel AI project.

## Requirements

- Python 3.11+
- PostgreSQL

## Setup

```bash
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and configure the database, Neshan routing key, and JWT secret.

Create the database and apply the SQL files from `../database/`.

## Run

```bash
uvicorn app.main:app --reload --port 8001
```

API documentation is available at `http://127.0.0.1:8001/docs`.

## Main API Areas

- `/places` — place listing and details
- `/cities` and `/categories` — lookup data
- `/route` — Neshan route calculation
- `/auth` — registration/login
- `/favorites` — user favorites
- `/recommendations` — ranked place recommendations

![RawFeed preview](docs/preview.png)

**Know what matters. Ignore the noise.**

RawFeed is a Kenya-first, event-based information platform that brings related news together into verified events, scores their importance, and presents a focused feed instead of an endless stream of individual articles.

## Features

* Event-based feed organized into **Breaking**, **Developing**, and **Important**
* Explainable importance and confidence scores
* **Why it matters**, **What we know**, and **What we don't know** for each event
* Interactive 3D globe on web, with region and county browsing on mobile
* Teal glassmorphism design system with dark/light mode and a fixed accent-color palette
* Email OTP verification, password reset, and account deletion using verification codes
* Push notification architecture with per-user importance thresholds

## Tech Stack

* **Web:** React, TypeScript, Vite
* **Mobile:** React Native, Expo, TypeScript
* **Backend:** Python, FastAPI, Uvicorn
* **Database:** PostgreSQL, SQLAlchemy, Alembic
* **Cache / Rate Limiting:** Redis
* **Local AI:** Ollama with a small local model, kept separate from the main ingestion request path

## Project Structure

```text
RawFeed/
├── backend/
├── web/
├── mobile/
└── docs/
```

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and `web/.env.example` to `web/.env` before running the apps.

## Running

**Backend**

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

**Web**

```bash
cd web
npm run dev
```

**Mobile**

```bash
cd mobile
npx expo start
```

The backend requires PostgreSQL and Redis to be running. Ollama is optional and can be started with `ollama serve` for AI-enriched **Why it matters** content through `POST /api/ingestion/enrich`.

## Testing

Run the backend test suite with:

```bash
cd backend
source .venv/bin/activate
python -m pytest -v
```
## Project Status

Live in production.
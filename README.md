# RawFeed

Know what matters. Ignore the noise.

RawFeed is a Kenya-first, event-based information platform that clusters news into verified events, scores their importance, and shows a minimal feed instead of an article firehose.

## Tech Stack

- Web: React, TypeScript, Vite
- Mobile: React Native, Expo, TypeScript
- Backend: Python, FastAPI, Uvicorn
- Database: PostgreSQL, SQLAlchemy, Alembic
- Cache: Redis

## Project Structure

RawFeed/
backend/
web/
mobile/

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and `web/.env.example` to `web/.env` before running either app. Never commit `.env` files.

## Running

Backend: `uvicorn app.main:app --reload` from `backend/`
Web: `npm run dev` from `web/`
Mobile: `npx expo start` from `mobile/`

## Project Status

Phase 1 (Foundation) in progress.
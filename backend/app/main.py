from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.auth import router as auth_router
from app.api.routes.events import router as events_router
from app.api.routes.ingestion import router as ingestion_router
from app.api.routes.sources import router as sources_router
from app.api.routes.users import router as users_router
from app.config import get_settings

settings = get_settings()

app = FastAPI(title="RawFeed API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(events_router)
app.include_router(sources_router)
app.include_router(ingestion_router)


@app.get("/")
def read_root():
    return {"name": "RawFeed API", "status": "ok"}
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.admin import router as admin_router
from app.api.routes.auth import router as auth_router
from app.api.routes.events import router as events_router
from app.api.routes.ingestion import router as ingestion_router
from app.api.routes.notifications import router as notifications_router
from app.api.routes.sources import router as sources_router
from app.api.routes.users import router as users_router
from app.config import get_settings
from app.core.errors import unhandled_exception_handler
from app.scheduler import start_scheduler, stop_scheduler

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield
    stop_scheduler()


app = FastAPI(
    title="RawFeed API",
    version="1.2.0",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(Exception, unhandled_exception_handler)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(events_router)
app.include_router(sources_router)
app.include_router(ingestion_router)
app.include_router(notifications_router)
app.include_router(admin_router)


@app.get("/")
def read_root():
    return {"name": "RawFeed API", "status": "ok", "version": "1.2.0"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
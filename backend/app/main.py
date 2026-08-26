"""
CareerBrew FastAPI Application Entrypoint
Unified Career Operating System & AI Job Seeker Platform
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.models.models import *
from app.services.seeder import seed_database_if_empty

# Routers
from app.api.auth import router as auth_router
from app.api.jobs import router as jobs_router
from app.api.applications import router as applications_router
from app.api.community import router as community_router
from app.api.referrals import router as referrals_router
from app.api.ai_copilot import router as ai_router
from app.api.users import router as users_router
from app.api.salary import router as salary_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager: Create tables and auto-seed sample dataset on start"""
    print("🚀 Initializing CareerBrew Engine database schema...")
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed
    db = SessionLocal()
    try:
        seed_database_if_empty(db)
    finally:
        db.close()
    
    yield
    print("🛑 Shutting down CareerBrew API service...")


app = FastAPI(
    title="CareerBrew API",
    description="The Unified One-Stop Platform & AI Copilot for the Modern Job Seeker",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(jobs_router, prefix=settings.API_V1_STR)
app.include_router(applications_router, prefix=settings.API_V1_STR)
app.include_router(community_router, prefix=settings.API_V1_STR)
app.include_router(referrals_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(salary_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "platform": "CareerBrew - Unified Career OS",
        "status": "online",
        "docs_url": "/docs",
        "version": settings.VERSION
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "CareerBrew FastAPI Engine"}

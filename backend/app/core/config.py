"""
CareerBrew - High-Performance Configuration Settings
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "CareerBrew API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "careerbrew-super-secret-jwt-token-key-2026-caffeine-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days for development convenience

    # CORS origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://localhost:8000",
        "*"
    ]

    # Database
    DATABASE_URL: str = "sqlite:///./careerbrew.db"

    class Config:
        case_sensitive = True


settings = Settings()

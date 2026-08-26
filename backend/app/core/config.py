"""
CareerBrew - High-Performance Configuration Settings
"""
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

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

    # Neon PostgreSQL configuration
    PGHOST: str = "ep-aged-breeze-azpkzd6l-pooler.c-3.ap-southeast-1.aws.neon.tech"
    PGDATABASE: str = "neondb"
    PGUSER: str = "neondb_owner"
    PGPASSWORD: str = "npg_aqjnWwzthX08"
    PGPORT: int = 5432
    PGSSLMODE: str = "require"
    PGCHANNELBINDING: str = "require"

    # Database URL (Constructed or loaded directly from env)
    DATABASE_URL: str = ""

    def __init__(self, **values):
        super().__init__(**values)
        if not self.DATABASE_URL:
            if self.PGHOST and self.PGUSER and self.PGPASSWORD:
                self.DATABASE_URL = (
                    f"postgresql://{self.PGUSER}:{self.PGPASSWORD}@{self.PGHOST}:{self.PGPORT}/{self.PGDATABASE}?sslmode={self.PGSSLMODE}"
                )
            else:
                self.DATABASE_URL = "sqlite:///./careerbrew.db"


settings = Settings()


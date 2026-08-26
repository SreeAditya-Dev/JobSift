"""
Database connection and session factory
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# Engine configuration
connect_args = {}
engine_kwargs = {
    "pool_pre_ping": True,
}

if "sqlite" in settings.DATABASE_URL:
    connect_args["check_same_thread"] = False
else:
    # Serverless PostgreSQL connection pooling optimization for Neon
    engine_kwargs.update({
        "pool_size": 10,
        "max_overflow": 20,
        "pool_recycle": 300,
        "pool_timeout": 30,
    })

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    **engine_kwargs
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency for yielding database session in FastAPI endpoints"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


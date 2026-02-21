from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base
import os

# SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"  # dev only
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# create tables if not exists
Base.metadata.create_all(bind=engine)

from sqlalchemy import Column, Integer, Float, String, Boolean, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from pydantic import BaseModel

Base = declarative_base()

class FoodLog(Base):
    __tablename__ = "food_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    food = Column(String)
    calories = Column(Float)
    protein = Column(Float)
    fat = Column(Float)
    carbs = Column(Float)

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="food_logs")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    discord_id = Column(String, unique=True, index=True)
    username = Column(String)
    email = Column(String, unique=True)
    verified = Column(Boolean, default=False)
    avatar = Column(String, nullable=True)

    food_logs = relationship("FoodLog", back_populates="user")
class ManualFoodEntry(BaseModel):
    food: str
    portion: str = "medium"

class UserGoal(Base):
    __tablename__ = "user_goals"
    id = Column(Integer, primary_key=True, index=True)
    calories = Column(Integer, default=2000)
    protein = Column(Integer, default=100)
    carbs = Column(Integer, default=200)
    fat = Column(Integer, default=70)

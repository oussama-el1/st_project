#!/usr/bin/python3
from models.base import BaseData, Base
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship

class MealPreference(Base):
    """MealPreference Table"""
    __tablename__ = 'meal_preferences'

    meal_id = Column(String(60), ForeignKey('meals.id'), primary_key=True)
    preference_id = Column(String(60), ForeignKey('preferences.id'), primary_key=True)
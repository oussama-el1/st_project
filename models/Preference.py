#!/usr/bin/python3
from models.base import BaseData, Base
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

class Preference(BaseData, Base):
    """Preference Table"""
    __tablename__ = 'preferences'

    name = Column(String(100), nullable=False)

    # Define relationship with MealPreference
    meals = relationship("Meal", secondary="meal_preferences", overlaps="preference")
    orders = relationship("Order", secondary="order_preferences", overlaps="preferences")

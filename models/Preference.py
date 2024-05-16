#!/usr/bin/python3
from models.base import BaseData, Base
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

class Preference(BaseData, Base):
    """Preference Table"""
    __tablename__ = 'preferences'

    name = Column(String(100), nullable=False)

    # Define relationship with MealPreference
    meals = relationship("Meal", secondary="meal_preferences", back_populates="preferences")
    orders = relationship("Order", secondary="order_preferences", back_populates="preferences")
    order_preferences = relationship("OrderPreference", backref="preference_in_order")
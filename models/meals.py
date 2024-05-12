#!/usr/bin/python3
from models.base import BaseData, Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship


class Meal(BaseData, Base):
    """Meals Data Model"""
    __tablename__ = 'meals'
    
    name = Column(String(255), nullable=False)
    """ prix = Column(Float, nullable=False) """
    protein = Column(Integer, nullable=True)
    calories = Column(Integer, nullable=True)
    Carbs = Column(Integer, nullable=True)
    Fat = Column(Integer, nullable=True)
    
    orders = relationship("Order", secondary="order_meals", overlaps="order_meals")
    ingredients = relationship("Ingredient", secondary="meal_ingredients", overlaps="meals")
    preferences = relationship("Preference", secondary="meal_preferences", overlaps="meals")

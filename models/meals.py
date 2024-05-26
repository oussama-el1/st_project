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

    orders = relationship("Order", secondary="order_meals", back_populates="meals")
    ingredients = relationship("Ingredient", secondary="meal_ingredients", back_populates="meals")
    preferences = relationship("Preference", secondary="meal_preferences", back_populates="meals")

    order_meals = relationship("OrderMeal", cascade="all, delete")
    meal_ingredients = relationship("MealIngredient", cascade="all, delete")
    meal_preferences = relationship("MealPreference", cascade="all, delete")

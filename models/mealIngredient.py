#!/usr/bin/python3
from models.base import Base
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship

class MealIngredient(Base):
    """MealIngredient Table"""
    __tablename__ = 'meal_ingredients'

    meal_id = Column(String(60), ForeignKey('meals.id'), primary_key=True)
    ingredient_id = Column(String(60), ForeignKey('ingredients.id'), primary_key=True)
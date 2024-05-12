#!/usr/bin/python3
from models.base import BaseData, Base
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship


class Ingredient(BaseData, Base):
    """Ingredients Data Model"""
    __tablename__ = 'ingredients'
    ingredientsName = Column(String(255), nullable=False)
    
    meals = relationship("Meal", secondary="meal_ingredients", overlaps="ingredients")

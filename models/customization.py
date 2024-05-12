#!/usr/bin/python3
from models.base import BaseData, Base
from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.orm import relationship

class CustomizationOptions(BaseData,Base):
    """ CustomizationOptions Model """
    __tablename__ = 'customization_options'
    meal_id = Column(String(60), ForeignKey('meals.id'), nullable=False)
    ingredient_id = Column(String(60), ForeignKey('ingredients.id'), nullable=False)
    portion_size = Column(String(50), nullable=False)
    price = Column(Float, nullable=False)
    
    # Define relationship with Meal
    meal = relationship("Meal", backref="customization_options")
    # Define relationship with Ingredient
    ingredient = relationship("Ingredient", backref="customization_options")
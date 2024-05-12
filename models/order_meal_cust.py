#!/usr/bin/python3
from models.base import BaseData, Base
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship

class OrderMealCustomization(BaseData, Base):
    """OrderMealCustomization Table"""
    __tablename__ = 'order_meal_customization'

    order_id = Column(String(60), ForeignKey('orders.id'))
    meal_id = Column(String(60), ForeignKey('meals.id'))
    ingredient_id = Column(String(60), ForeignKey('ingredients.id'))
    portion_size = Column(String(50), nullable=False)
    
    # Define relationship with Meal
    meal = relationship("Meal")
    # Define relationship with order
    order = relationship("Order")
    # Define relationship with Ingredient
    ingredient = relationship("Ingredient")